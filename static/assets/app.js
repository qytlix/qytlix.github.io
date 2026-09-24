(() => {
  const copy = {
    en: {
      eyebrow: "A little celebration", title: "Happy Birthday, Phoebe!", placeholder: "A special day, made just for you.",
      introGreeting: "Happy Birthday", skip: "Skip intro", cakeCaption: "A little cake, just for you", cakeInstruction: "Drag across the cake to cut it", invalidCut: "That line did not cut the cake. Try another direction.", artPlaceholder: "replaceable placeholder",
      cakeAlt: "A replaceable illustrated birthday cake placeholder", reset: "Put it back together, please", pusherPlaceholder: "replaceable pushing character", footer: "Made with love"
    },
    zh: {
      eyebrow: "一场小小的庆祝", title: "🈷️，生日快乐！", placeholder: "为你准备的特别日子。",
      introGreeting: "生日快乐", skip: "跳过开场", cakeCaption: "为你准备的小蛋糕", cakeInstruction: "拖动鼠标划过蛋糕来切开它", invalidCut: "这次没有切到蛋糕，再试试别的方向吧。", artPlaceholder: "可替换占位图",
      cakeAlt: "可替换的生日蛋糕示意图", reset: "可以再来一次喵", pusherPlaceholder: "可替换的推人占位图", footer: "用心制作"
    }
  };
  const preferredLanguage = navigator.languages?.[0] ?? navigator.language ?? "en";
  const language = /^zh/i.test(preferredLanguage) ? "zh" : "en";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const key = element.dataset.copy;
    if (copy[language][key]) element.textContent = copy[language][key];
  });
  document.querySelectorAll("[data-copy-aria]").forEach((element) => {
    const key = element.dataset.copyAria;
    if (copy[language][key]) element.setAttribute("aria-label", copy[language][key]);
  });

  // Calendar date and display in West Lafayette, independent of the visitor's timezone.
  const BIRTHDAY_TIME_ZONE = "America/Indiana/Indianapolis";
  const birthdayDateParts = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: BIRTHDAY_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]));
  };
  const formatBirthdayLocalDateTime = (date = new Date(), locale = language === "zh" ? "zh-CN" : "en-US") =>
    new Intl.DateTimeFormat(locale, {
      timeZone: BIRTHDAY_TIME_ZONE, dateStyle: "full", timeStyle: "short"
    }).format(date);
  window.birthdayTime = Object.freeze({ timeZone: BIRTHDAY_TIME_ZONE, dateParts: birthdayDateParts, format: formatBirthdayLocalDateTime });

  const overlay = document.getElementById("intro-overlay");
  const skip = document.getElementById("skip-intro");
  let introTimer;
  let finishTimer;
  let finished = false;
  let onIntroFinished = null;
  const finishIntro = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(introTimer);
    window.clearTimeout(finishTimer);
    document.body.classList.add("intro-finished");
    document.getElementById("main-content").removeAttribute("inert");
    if (onIntroFinished) onIntroFinished();
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    skip.removeEventListener("click", finishIntro);
  };
  skip.addEventListener("click", finishIntro);

  const segmentGraphemes = (text) => {
    if (window.Intl?.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), ({ segment }) => segment);
    }
    return text.match(/\P{M}\p{M}*|\p{M}+/gu) ?? Array.from(text);
  };
  const introLine = overlay.querySelector('[data-copy="intro-greeting"]');
  const graphemes = segmentGraphemes(copy[language].introGreeting);
  introLine.textContent = "";
  graphemes.forEach((grapheme, index) => {
    const glyph = document.createElement("span");
    glyph.className = "greeting-glyph";
    glyph.textContent = grapheme === " " ? "\u00a0" : grapheme;
    glyph.style.setProperty("--glyph-delay", `${index * 75}ms`);
    introLine.append(glyph);
  });

  if (reducedMotion) {
    finishIntro();
  } else {
    document.body.classList.add("intro-playing");
    introTimer = window.setTimeout(() => overlay.classList.add("is-leaving"), 2300);
    finishTimer = window.setTimeout(finishIntro, 3300);
  }

  const cake = document.getElementById("cake");
  const piecesLayer = document.getElementById("cake-pieces");
  const preview = document.getElementById("cut-preview");
  const knife = document.getElementById("knife-placeholder");
  const status = document.getElementById("cake-status");
  const resetButton = document.getElementById("reset-game");
  const pushers = document.getElementById("pushers");
  const pusherLeft = document.getElementById("pusher-left");
  const pusherRight = document.getElementById("pusher-right");
  if (!cake) return;
  const setSvgVisibility = (element, value) => { element.setAttribute("visibility", value); element.style.visibility = value; };
  setSvgVisibility(preview, "hidden");
  setSvgVisibility(knife, "hidden");
  setSvgVisibility(pushers, "hidden");
  resetButton.textContent = copy[language].reset;
  document.querySelectorAll(".pusher-placeholder text").forEach((element) => { element.textContent = copy[language].pusherPlaceholder; });

  const INITIAL_POLYGON = [[55, 100], [80, 60], [150, 38], [450, 38], [520, 60], [545, 100], [545, 295], [520, 325], [80, 325], [55, 295]];
  let pieces = [{ points: INITIAL_POLYGON }];
  const history = [];
  let gesture = null;
  let busy = false;
  let restoring = false;
  let idleTimer = 0;
  let gameActive = false;
  const idleDelay = 30000;
  const hideReset = () => { resetButton.hidden = true; };
  const armIdleTimer = () => {
    window.clearTimeout(idleTimer);
    hideReset();
    if (!gameActive || busy || gesture || document.hidden || !gameInView || !history.length) return;
    idleTimer = window.setTimeout(() => {
      if (!busy && history.length && !document.hidden && gameInView) resetButton.hidden = false;
    }, idleDelay);
  };
  const noteActivity = () => { if (gameActive && history.length) armIdleTimer(); };
  const clonePieces = (items) => items.map(({ points }) => ({ points: points.map(([x, y]) => [x, y]) }));
  const cloneHistoryRecord = (record) => ({
    beforePieces: clonePieces(record.beforePieces),
    afterPieces: clonePieces(record.afterPieces),
    cutLine: { a: { ...record.cutLine.a }, b: { ...record.cutLine.b } },
    unitNormal: { ...record.unitNormal },
    gap: record.gap,
    pusherAnchor: [...record.pusherAnchor],
    operations: record.operations.map((operation) => ({
      parentIndex: operation.parentIndex,
      plusChildIndex: operation.plusChildIndex,
      minusChildIndex: operation.minusChildIndex,
      plusDelta: [...operation.plusDelta],
      minusDelta: [...operation.minusDelta],
      cutBoundary: operation.cutBoundary.map(([x, y]) => [x, y])
    }))
  });
  const drawPieces = () => {
    piecesLayer.replaceChildren();
    pieces.forEach(({ points }) => {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", points.map(([x, y]) => `${x},${y}`).join(" "));
      polygon.setAttribute("class", "cake-piece");
      polygon.dataset.pieceIndex = String(piecesLayer.childElementCount);
      piecesLayer.append(polygon);
    });
  };
  const pointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
      if ((yi > point.y) !== (yj > point.y) && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const signedDistance = ([x, y], a, b) => (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
  const clipPolygon = (polygon, a, b, positive) => {
    const output = [];
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i], next = polygon[(i + 1) % polygon.length];
      const d1 = signedDistance(current, a, b), d2 = signedDistance(next, a, b);
      const in1 = positive ? d1 >= -1e-7 : d1 <= 1e-7;
      const in2 = positive ? d2 >= -1e-7 : d2 <= 1e-7;
      if (in1) output.push(current);
      if (in1 !== in2) {
        const t = d1 / (d1 - d2);
        output.push([current[0] + (next[0] - current[0]) * t, current[1] + (next[1] - current[1]) * t]);
      }
    }
    return output;
  };
  const area = (polygon) => Math.abs(polygon.reduce((sum, [x, y], i) => {
    const [nx, ny] = polygon[(i + 1) % polygon.length]; return sum + x * ny - nx * y;
  }, 0)) / 2;
  const segmentsIntersect = (a, b, c, d) => {
    const orient = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
    const onSegment = (p, q, r) => q.x >= Math.min(p.x, r.x) - 1e-7 && q.x <= Math.max(p.x, r.x) + 1e-7 && q.y >= Math.min(p.y, r.y) - 1e-7 && q.y <= Math.max(p.y, r.y) + 1e-7;
    if (o1 * o2 < 0 && o3 * o4 < 0) return true;
    return (Math.abs(o1) < 1e-7 && onSegment(a, c, b)) || (Math.abs(o2) < 1e-7 && onSegment(a, d, b)) || (Math.abs(o3) < 1e-7 && onSegment(c, a, d)) || (Math.abs(o4) < 1e-7 && onSegment(c, b, d));
  };
  const segmentHitsPolygon = (a, b, polygon) => {
    if (pointInPolygon(a, polygon) || pointInPolygon(b, polygon)) return true;
    return polygon.some((p, i) => segmentsIntersect(a, b, { x: p[0], y: p[1] }, { x: polygon[(i + 1) % polygon.length][0], y: polygon[(i + 1) % polygon.length][1] }));
  };
  const uniquePoints = (points, epsilon = 1e-6) => points.reduce((unique, point) => {
    if (!unique.some(([x, y]) => Math.hypot(x - point[0], y - point[1]) <= epsilon)) unique.push([point[0], point[1]]);
    return unique;
  }, []);
  const splitPieces = (a, b) => {
    const nextPieces = [];
    const deltaX = b.x - a.x, deltaY = b.y - a.y;
    const length = Math.hypot(deltaX, deltaY);
    if (!length) return false;
    const unitNormal = { x: -deltaY / length, y: deltaX / length };
    const gap = 8;
    const cutRecord = {
      beforePieces: clonePieces(pieces),
      cutLine: { a: { ...a }, b: { ...b } },
      unitNormal,
      gap,
      pusherAnchor: null,
      operations: []
    };
    pieces.forEach(({ points }, parentIndex) => {
      if (!segmentHitsPolygon(a, b, points)) { nextPieces.push({ points }); return; }
      const plusBase = clipPolygon(points, a, b, true), minusBase = clipPolygon(points, a, b, false);
      if (plusBase.length >= 3 && minusBase.length >= 3 && area(plusBase) > 8 && area(minusBase) > 8) {
        const plusDelta = [unitNormal.x * gap, unitNormal.y * gap];
        const minusDelta = [-plusDelta[0], -plusDelta[1]];
        const cutBoundary = uniquePoints(plusBase.filter((point) => Math.abs(signedDistance(point, a, b)) <= 1e-6));
        const plusChildIndex = nextPieces.length;
        const minusChildIndex = plusChildIndex + 1;
        nextPieces.push(
          { points: plusBase.map(([x, y]) => [x + plusDelta[0], y + plusDelta[1]]) },
          { points: minusBase.map(([x, y]) => [x + minusDelta[0], y + minusDelta[1]]) }
        );
        cutRecord.operations.push({ parentIndex, plusChildIndex, minusChildIndex, plusDelta, minusDelta, cutBoundary });
      } else nextPieces.push({ points });
    });
    if (!cutRecord.operations.length || nextPieces.length > 64) return false;
    const boundaryPoints = uniquePoints(cutRecord.operations.flatMap(({ cutBoundary }) => cutBoundary));
    cutRecord.pusherAnchor = boundaryPoints.length
      ? boundaryPoints.reduce(([x, y], [px, py]) => [x + px / boundaryPoints.length, y + py / boundaryPoints.length], [0, 0])
      : [(a.x + b.x) / 2, (a.y + b.y) / 2];
    cutRecord.afterPieces = clonePieces(nextPieces);
    history.push(cutRecord);
    pieces = nextPieces;
    drawPieces();
    return cutRecord.operations.length;
  };
  const svgPoint = (event) => {
    const rect = cake.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * 600 / rect.width, y: (event.clientY - rect.top) * 360 / rect.height };
  };
  const lineThroughSvg = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    const ux = dx / length, uy = dy / length;
    const rect = cake.getBoundingClientRect();
    const viewportCorners = [[0, 0], [window.innerWidth, 0], [window.innerWidth, window.innerHeight], [0, window.innerHeight]];
    const projections = viewportCorners.map(([x, y]) => {
      const sx = (x - rect.left) * 600 / rect.width, sy = (y - rect.top) * 360 / rect.height;
      return (sx - a.x) * ux + (sy - a.y) * uy;
    });
    const lo = Math.min(...projections) - 24, hi = Math.max(...projections) + 24;
    return [{ x: a.x + ux * lo, y: a.y + uy * lo }, { x: a.x + ux * hi, y: a.y + uy * hi }];
  };
  const setLine = (element, from, to) => {
    element.setAttribute("x1", from.x); element.setAttribute("y1", from.y);
    element.setAttribute("x2", to.x); element.setAttribute("y2", to.y);
  };
  cake.addEventListener("pointerdown", (event) => {
    if (busy || gesture || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    const point = svgPoint(event);
    gesture = { pointerId: event.pointerId, start: point, end: point };
    noteActivity();
    cake.setPointerCapture(event.pointerId);
    setSvgVisibility(preview, "visible");
    setLine(preview, point, point);
  });
  cake.addEventListener("pointermove", (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    event.preventDefault();
    noteActivity();
    gesture.end = svgPoint(event);
    setLine(preview, gesture.start, gesture.end);
  });
  const cancelGesture = (event) => {
    if (!gesture || (event && event.pointerId !== gesture.pointerId)) return;
    gesture = null;
    setSvgVisibility(preview, "hidden");
    noteActivity();
  };
  cake.addEventListener("pointercancel", cancelGesture);
  cake.addEventListener("lostpointercapture", cancelGesture);
  cake.addEventListener("pointerup", async (event) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    event.preventDefault();
    const { start } = gesture;
    const end = svgPoint(event);
    gesture = null;
    noteActivity();
    setSvgVisibility(preview, "hidden");
    if (Math.hypot(end.x - start.x, end.y - start.y) < 10) {
      status.textContent = copy[language].invalidCut;
      return;
    }
    busy = true;
    armIdleTimer();
    const [travelStart, travelEnd] = lineThroughSvg(start, end);
    setSvgVisibility(knife, "visible");
    knife.style.transition = "none";
    knife.setAttribute("transform", `translate(${travelStart.x} ${travelStart.y})`);
    void knife.getBoundingClientRect();
    requestAnimationFrame(() => {
      knife.style.transition = reducedMotion ? "none" : "transform 700ms cubic-bezier(.3,.05,.65,.95)";
      knife.setAttribute("transform", `translate(${travelEnd.x} ${travelEnd.y})`);
    });
    await new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : 760));
    setSvgVisibility(knife, "hidden");
    const divided = splitPieces(start, end);
    status.textContent = divided ? `${copy[language].cakeCaption} · ${history.length}` : copy[language].invalidCut;
    busy = false;
    armIdleTimer();
  });
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const waitUntilVisible = () => document.hidden ? new Promise((resolve) => {
    const onVisible = () => { if (!document.hidden) { document.removeEventListener("visibilitychange", onVisible); resolve(); } };
    document.addEventListener("visibilitychange", onVisible);
  }) : Promise.resolve();
  const waitForMotion = async (elements, duration) => {
    if (reducedMotion || !duration) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await waitUntilVisible();
      return;
    }
    let timedOutWhileHidden = false;
    await Promise.all(elements.map((element) => new Promise((resolve) => {
      let timer;
      const finish = (timeout = false) => {
        element.removeEventListener("transitionend", onEnd);
        window.clearTimeout(timer);
        if (timeout && document.hidden) timedOutWhileHidden = true;
        resolve();
      };
      const onEnd = (event) => {
        if (event.target === element && event.propertyName === "transform") finish();
      };
      element.addEventListener("transitionend", onEnd);
      timer = window.setTimeout(() => finish(true), duration + 250);
    })));
    await waitUntilVisible();
    if (timedOutWhileHidden) await wait(duration + 50);
  };
  const transformString = (x, y, rotation = null) =>
    `translate(${x} ${y})${rotation === null ? "" : ` rotate(${rotation})`}`;
  const restoreCake = async () => {
    if (busy || !history.length) return;
    busy = true;
    window.clearTimeout(idleTimer);
    hideReset();
    resetButton.disabled = true;
    cake.setAttribute("aria-busy", "true");
    const stepMs = reducedMotion ? 0 : 620;
    restoring = true;
    let restoreError = null;
    try {
      while (history.length) {
        await waitUntilVisible();
        const record = history[history.length - 1];
        const polygons = Array.from(piecesLayer.querySelectorAll(".cake-piece"));
        const moves = [];
        record.operations.forEach((operation) => {
          const plus = polygons[operation.plusChildIndex];
          const minus = polygons[operation.minusChildIndex];
          if (plus) moves.push({ element: plus, dx: -operation.plusDelta[0], dy: -operation.plusDelta[1] });
          if (minus) moves.push({ element: minus, dx: -operation.minusDelta[0], dy: -operation.minusDelta[1] });
        });
        if (!moves.length) throw new Error("Missing child fragments in rejoin history");

        const [anchorX, anchorY] = record.pusherAnchor;
        const { x: normalX, y: normalY } = record.unitNormal;
        const representative = record.operations[0];
        const pusherClearance = 30;
        const plusStart = [anchorX + normalX * (pusherClearance + record.gap), anchorY + normalY * (pusherClearance + record.gap)];
        const minusStart = [anchorX - normalX * (pusherClearance + record.gap), anchorY - normalY * (pusherClearance + record.gap)];
        const plusEnd = [plusStart[0] - representative.plusDelta[0], plusStart[1] - representative.plusDelta[1]];
        const minusEnd = [minusStart[0] - representative.minusDelta[0], minusStart[1] - representative.minusDelta[1]];
        const plusAngle = Math.atan2(-normalY, -normalX) * 180 / Math.PI;
        const minusAngle = Math.atan2(normalY, normalX) * 180 / Math.PI - 180;

        setSvgVisibility(pushers, "visible");
        pusherLeft.style.transition = pusherRight.style.transition = "none";
        pusherLeft.setAttribute("transform", transformString(...plusStart, plusAngle));
        pusherRight.setAttribute("transform", transformString(...minusStart, minusAngle));
        moves.forEach(({ element }) => {
          element.style.transition = "none";
          element.setAttribute("transform", "translate(0 0)");
        });
        void piecesLayer.getBoundingClientRect();
        void pushers.getBoundingClientRect();

        const transition = reducedMotion ? "none" : `transform ${stepMs}ms cubic-bezier(.2,.75,.25,1)`;
        moves.forEach(({ element }) => { element.style.transition = transition; });
        pusherLeft.style.transition = pusherRight.style.transition = transition;
        const movingElements = [...moves.map(({ element }) => element), pusherLeft, pusherRight];
        const motionFinished = waitForMotion(movingElements, stepMs);
        moves.forEach(({ element, dx, dy }) => element.setAttribute("transform", `translate(${dx} ${dy})`));
        pusherLeft.setAttribute("transform", transformString(...plusEnd, plusAngle));
        pusherRight.setAttribute("transform", transformString(...minusEnd, minusAngle));
        await motionFinished;

        if (!window.cakeGame.restorePrevious()) throw new Error("Could not restore the preceding cake snapshot");
        setSvgVisibility(pushers, "hidden");
        pusherLeft.removeAttribute("transform"); pusherRight.removeAttribute("transform");
        pusherLeft.style.transition = pusherRight.style.transition = "none";
        if (!reducedMotion && history.length) await wait(110);
      }
    } catch (error) {
      restoreError = error;
      console.error("Cake rejoin interrupted; keeping the current reversible state.", error);
    }
    if (restoreError || history.length) {
      piecesLayer.querySelectorAll(".cake-piece").forEach((polygon) => {
        polygon.style.transition = "none";
        polygon.setAttribute("transform", "translate(0 0)");
      });
    } else {
      const matchesInitial = pieces.length === 1 && pieces[0].points.length === INITIAL_POLYGON.length &&
        pieces[0].points.every(([x, y], index) => x === INITIAL_POLYGON[index][0] && y === INITIAL_POLYGON[index][1]);
      if (matchesInitial) status.textContent = copy[language].cakeCaption;
      else console.error("Rejoin history ended without restoring the exact initial cake; leaving geometry untouched.");
    }
    restoring = false;
    setSvgVisibility(pushers, "hidden");
    pusherLeft.removeAttribute("transform"); pusherRight.removeAttribute("transform");
    pusherLeft.style.transition = pusherRight.style.transition = "none";
    resetButton.disabled = false;
    cake.removeAttribute("aria-busy");
    busy = false;
    armIdleTimer();
  };
  resetButton.addEventListener("click", () => { if (!busy) void restoreCake(); });
  let gameInView = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      gameInView = entry.isIntersecting;
      if (!gameInView) window.clearTimeout(idleTimer);
      else armIdleTimer();
    }, { threshold: .05 }).observe(document.getElementById("game"));
  }
  document.addEventListener("visibilitychange", () => {
    window.clearTimeout(idleTimer);
    if (!document.hidden) armIdleTimer();
  });
  onIntroFinished = () => { gameActive = true; armIdleTimer(); };
  if (finished) onIntroFinished();
  drawPieces();
  window.cakeGame = Object.freeze({
    getHistory: () => history.map(({ beforePieces }) => clonePieces(beforePieces)),
    getHistoryRecords: () => history.map(cloneHistoryRecord),
    getPieceCount: () => pieces.length,
    getCutCount: () => history.length,
    restorePrevious: () => {
      if (!history.length || (busy && !restoring)) return false;
      pieces = history.pop().beforePieces;
      drawPieces();
      return true;
    }
  });
})();
