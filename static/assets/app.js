(() => {
  const copy = {
    en: {
      eyebrow: "?!qiang qiang!?", title: "Happy Birthday, Phoebe!", tagline: "A special day, made just for you.",
      introGreeting: "Happy Birthday", skip: "Skip intro", countdownHeading: "Almost time to celebrate", countdownHint: "Counting down to midnight in West Lafayette", cakeCaption: "A little cake, just for you", cakeInstruction: "Drag across the cake to cut it", invalidCut: "That line did not cut the cake. Try another direction.",
      cakeAlt: "An illustrated cream and blueberry cake with blue jam, ready to cut", reset: "Put it back together, please", footer: "Made with AI", guideNext: "Continue", guideSkip: "Skip guide", blow: "Blow out candle", musicStop: "Stop music", musicPlay: "Play birthday song", musicBlocked: "Music did not start automatically. Click Play birthday song to retry, or skip the guide.", audioUnavailable: "Web Audio is unavailable in this browser. You can skip the guide.", characterMal: "mal character", characterMizuki: "mizuki character"
    },
    zh: {
      eyebrow: "?!强强!?", title: "🈷️，生日快乐！", tagline: "好过兄弟，好过",
      introGreeting: "生日快乐", skip: "跳过开场", countdownHeading: "等等...", countdownHint: "距 West Lafayette 当地 9 月 25 日 00:00", cakeCaption: "为你准备的小蛋糕", cakeInstruction: "拖动鼠标划过蛋糕来切开它", invalidCut: "这次没有切到蛋糕，再试试别的方向吧。",
      cakeAlt: "可切割的奶油蓝莓蛋糕插画，带蓝色果酱", reset: "可以再来一次喵", footer: "用♥️制作", guideNext: "继续", guideSkip: "跳过引导", blow: "吹灭蜡烛", musicStop: "停止音乐", musicPlay: "手动播放生日歌", musicBlocked: "生日歌未能自动播放。可点击“手动播放生日歌”重试，或跳过引导。", audioUnavailable: "此浏览器无法使用 Web Audio；你可以跳过引导。", characterMal: "mal 人物", characterMizuki: "水月人物"
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
  // Target instant that gates the opening overlay. 2026-09-25 00:00 local in West
  // Lafayette (IANA America/Indiana/Indianapolis). On that date Indiana is on EDT
  // (UTC-4): DST runs 2026-03-08 .. 2026-11-01, so local midnight equals
  // 2026-09-25T04:00:00Z exactly (epoch ms 1790308800000). Verified by probing the
  // IANA rules: new Date(TARGET_EPOCH_MS) formats back to 2026-09-25T00:00:00 in
  // that tz. Single-shot for the 19th birthday; deliberately NOT repeated yearly.
  const TARGET_EPOCH_MS = 1790308800000;

  const introLine = overlay.querySelector('[data-copy="intro-greeting"]');
  const countdown = document.getElementById("intro-countdown");
  const countdownTime = document.getElementById("countdown-time");
  let countdownTimer;
  const formatRemaining = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const buildGreeting = () => {
    introLine.textContent = "";
    segmentGraphemes(copy[language].introGreeting).forEach((grapheme, index) => {
      const glyph = document.createElement("span");
      glyph.className = "greeting-glyph";
      glyph.textContent = grapheme === " " ? "\u00a0" : grapheme;
      glyph.style.setProperty("--glyph-delay", `${index * 75}ms`);
      introLine.append(glyph);
    });
  };
  const showCountdown = () => {
    document.body.classList.add("countdown");
    if (countdown) countdown.hidden = false;
    if (skip) skip.hidden = true;
    tickCountdown();
    window.clearInterval(countdownTimer);
    countdownTimer = window.setInterval(tickCountdown, 1000);
  };
  const reachTarget = () => {
    if (finished) return;
    window.clearInterval(countdownTimer);
    document.body.classList.remove("countdown");
    if (countdown) countdown.hidden = true;
    if (countdownTime) countdownTime.textContent = "00:00:00";
    if (skip) skip.hidden = false;
    buildGreeting();
    if (reducedMotion) {
      finishIntro();
    } else {
      document.body.classList.add("intro-playing");
      introTimer = window.setTimeout(() => overlay.classList.add("is-leaving"), 2300);
      finishTimer = window.setTimeout(finishIntro, 3300);
    }
  };
  const tickCountdown = () => {
    const remaining = TARGET_EPOCH_MS - Date.now();
    if (!countdownTime || remaining <= 0) { reachTarget(); return; }
    countdownTime.textContent = formatRemaining(remaining);
  };

  if (Date.now() < TARGET_EPOCH_MS) showCountdown();
  else reachTarget();

  const cake = document.getElementById("cake");
  const piecesLayer = document.getElementById("cake-pieces");
  const preview = document.getElementById("cut-preview");
  const knife = document.getElementById("knife-character");
  const status = document.getElementById("cake-status");
  const resetButton = document.getElementById("reset-game");
  const pushers = document.getElementById("pushers");
  const pusherLeft = document.getElementById("pusher-left");
  const pusherRight = document.getElementById("pusher-right");
  const knifeArt = knife.querySelector("image");
  const pusherArts = [pusherLeft.querySelector("image"), pusherRight.querySelector("image")];
  const faceAlongX = (image, dx) => image.setAttribute("transform", dx < -1e-6 ? "scale(-1 1)" : "scale(1 1)");
  if (!cake) return;
  const setSvgVisibility = (element, value) => { element.setAttribute("visibility", value); element.style.visibility = value; };
  setSvgVisibility(preview, "hidden");
  setSvgVisibility(knife, "hidden");
  setSvgVisibility(pushers, "hidden");
  resetButton.textContent = copy[language].reset;

  const INITIAL_POLYGON = [[55, 100], [80, 60], [150, 38], [450, 38], [520, 60], [545, 100], [545, 295], [520, 325], [80, 325], [55, 295]];
  // Offset maps each fragment back onto the single, shared illustration in SVG defs.
  // Cutting changes both polygon geometry and offset, never the illustration itself.
  let pieces = [{ points: INITIAL_POLYGON, offset: [0, 0] }];
  const history = [];
  let gesture = null;
  let busy = false;
  let restoring = false;
  let idleTimer = 0;
  let gameActive = false;
  const idleDelay = 3000;
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
  const clonePieces = (items) => items.map(({ points, offset }) => ({ points: points.map(([x, y]) => [x, y]), offset: [...offset] }));
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
    pieces.forEach(({ points, offset }, index) => {
      const svgNS = "http://www.w3.org/2000/svg";
      const polygonPoints = points.map(([x, y]) => `${x},${y}`).join(" ");
      const group = document.createElementNS(svgNS, "g");
      group.setAttribute("class", "cake-piece");
      group.dataset.pieceIndex = String(index);
      const clip = document.createElementNS(svgNS, "clipPath");
      clip.id = `cake-fragment-${index}`;
      clip.setAttribute("clipPathUnits", "userSpaceOnUse");
      const clipPolygon = document.createElementNS(svgNS, "polygon");
      clipPolygon.setAttribute("points", polygonPoints);
      clip.append(clipPolygon);
      const shadow = document.createElementNS(svgNS, "polygon");
      shadow.setAttribute("points", polygonPoints);
      shadow.setAttribute("class", "cake-shadow");
      const art = document.createElementNS(svgNS, "g");
      art.setAttribute("clip-path", `url(#${clip.id})`);
      const image = document.createElementNS(svgNS, "use");
      image.setAttribute("href", "#cake-illustration");
      image.setAttribute("transform", `translate(${offset[0]} ${offset[1]})`);
      art.append(image);
      const edge = document.createElementNS(svgNS, "polygon");
      edge.setAttribute("points", polygonPoints);
      edge.setAttribute("class", "cake-edge");
      group.append(clip, shadow, art, edge);
      piecesLayer.append(group);
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
    pieces.forEach(({ points, offset }, parentIndex) => {
      if (!segmentHitsPolygon(a, b, points)) { nextPieces.push({ points, offset }); return; }
      const plusBase = clipPolygon(points, a, b, true), minusBase = clipPolygon(points, a, b, false);
      if (plusBase.length >= 3 && minusBase.length >= 3 && area(plusBase) > 8 && area(minusBase) > 8) {
        const plusDelta = [unitNormal.x * gap, unitNormal.y * gap];
        const minusDelta = [-plusDelta[0], -plusDelta[1]];
        const cutBoundary = uniquePoints(plusBase.filter((point) => Math.abs(signedDistance(point, a, b)) <= 1e-6));
        const plusChildIndex = nextPieces.length;
        const minusChildIndex = plusChildIndex + 1;
        nextPieces.push(
          { points: plusBase.map(([x, y]) => [x + plusDelta[0], y + plusDelta[1]]), offset: [offset[0] + plusDelta[0], offset[1] + plusDelta[1]] },
          { points: minusBase.map(([x, y]) => [x + minusDelta[0], y + minusDelta[1]]), offset: [offset[0] + minusDelta[0], offset[1] + minusDelta[1]] }
        );
        cutRecord.operations.push({ parentIndex, plusChildIndex, minusChildIndex, plusDelta, minusDelta, cutBoundary });
      } else nextPieces.push({ points, offset });
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
    faceAlongX(knifeArt, end.x - start.x);
    knife.setAttribute("transform", `translate(${travelStart.x} ${travelStart.y})`);
    void knife.getBoundingClientRect();
    requestAnimationFrame(() => {
      knife.style.transition = reducedMotion ? "none" : "transform 700ms cubic-bezier(.3,.05,.65,.95)";
      knife.setAttribute("transform", `translate(${travelEnd.x} ${travelEnd.y})`);
    });
    await new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : 760));
    setSvgVisibility(knife, "hidden");
    const divided = splitPieces(start, end);
    status.textContent = divided ? copy[language].cakeCaption : copy[language].invalidCut;
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
        faceAlongX(pusherArts[0], plusEnd[0] - plusStart[0]);
        faceAlongX(pusherArts[1], minusEnd[0] - minusStart[0]);

        setSvgVisibility(pushers, "visible");
        pusherLeft.style.transition = pusherRight.style.transition = "none";
        pusherLeft.setAttribute("transform", transformString(...plusStart));
        pusherRight.setAttribute("transform", transformString(...minusStart));
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
        pusherLeft.setAttribute("transform", transformString(...plusEnd));
        pusherRight.setAttribute("transform", transformString(...minusEnd));
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
  drawPieces();
  const guide = document.getElementById("guide");
  const guideLine = document.getElementById("guide-line");
  const guideSpeaker = document.getElementById("guide-speaker");
  const guideHint = document.getElementById("guide-hint");
  const guideCharacter = document.getElementById("guide-character");
  const guideArt = document.getElementById("guide-art");
  const guideArtFallback = document.getElementById("guide-art-fallback");
  const guideNext = document.getElementById("guide-next");
  const blowButton = document.getElementById("blow-candle");
  const musicButton = document.getElementById("music-toggle");
  const candle = document.getElementById("guide-candle");
  const characterArtwork = (role, type, face) => {
    if (role === "mizuki") return type === "knife" ? "mizuki knife.png" : "mizuki ori.png";
    if (face === "happy") return "mal face happy.png";
    return `mal ${["ori", "idea", "hug", "go"].includes(type) ? type : "ori"}.png`;
  };
  const setCharacterState = (role, type, face = "normal") => {
    guideCharacter.dataset.role = role;
    guideCharacter.dataset.type = type;
    guideCharacter.dataset.face = face;
    guideCharacter.setAttribute("aria-label", role === "mizuki" ? copy[language].characterMizuki : copy[language].characterMal);
    guideArtFallback.textContent = ({ ori: "✿", idea: "💡", hug: "♡", go: "➜", knife: "🔪" })[type] ?? "✿";
    guideArt.src = `./assets/pictures/${encodeURIComponent(characterArtwork(role, type, face))}`;
  };
  guideArt.addEventListener("error", () => { guideArtFallback.hidden = false; });
  guideArt.addEventListener("load", () => { guideArtFallback.hidden = true; });
  let scorePromise;
  let audioContext = null, activeOscillators = [], songTimer = 0, songPlaying = false, audioGeneration = 0, musicBlocked = false;
  const stopSong = (closeContext = false) => {
    audioGeneration++;
    window.clearTimeout(songTimer);
    activeOscillators.forEach((oscillator) => { try { oscillator.stop(); } catch {} });
    activeOscillators = [];
    songPlaying = false;
    if (closeContext && audioContext) { void audioContext.close(); audioContext = null; }
  };
  const playSong = async () => {
    const generation = audioGeneration;
    const Audio = window.AudioContext || window.webkitAudioContext;
    try {
      if (!Audio) throw new Error("Web Audio unavailable");
      audioContext ??= new Audio();
      await audioContext.resume();
      if (generation !== audioGeneration) return;
      if (audioContext.state !== "running") throw new Error("AudioContext was not permitted");
      scorePromise ??= fetch("./assets/birthday-notes.json").then((response) => {
        if (!response.ok) throw new Error("Could not load the local birthday note data");
        return response.json();
      });
      const score = await scorePromise;
      if (generation !== audioGeneration) return;
      musicBlocked = false;
      guideHint.textContent = "";
      songPlaying = true;
      musicButton.hidden = false;
      musicButton.textContent = copy[language].musicStop;
      const startAt = audioContext.currentTime + .08;
      const secondsPerTick = score.tempoMicrosecondsPerQuarter / 1e6 / score.ticksPerQuarter;
      let songEnd = 0;
      score.notes.forEach(([onset, duration, midiPitch]) => {
        const begins = startAt + onset * secondsPerTick;
        const ends = begins + duration * secondsPerTick * .9;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 440 * (2 ** ((midiPitch - 69) / 12));
        gain.gain.setValueAtTime(.0001, begins);
        gain.gain.exponentialRampToValueAtTime(.075, begins + .02);
        gain.gain.exponentialRampToValueAtTime(.0001, ends);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(begins); oscillator.stop(ends + .01);
        activeOscillators.push(oscillator);
        songEnd = Math.max(songEnd, onset + duration);
      });
      songTimer = window.setTimeout(() => {
        songPlaying = false; activeOscillators = [];
        musicButton.textContent = copy[language].musicPlay;
      }, songEnd * secondsPerTick * 1000 + 150);
    } catch (error) {
      if (generation !== audioGeneration) return;
      musicBlocked = true;
      musicButton.hidden = !Audio;
      if (Audio) musicButton.textContent = copy[language].musicPlay;
      guideHint.textContent = Audio ? copy[language].musicBlocked : copy[language].audioUnavailable;
    }
  };
  const lines = [
    { role: "mal", type: "ori", face: "happy", text: "生日快乐喵！" },
    { role: "mal", type: "ori", text: "其他界面都是双语的哦，只有这里说中文呐。为什么呢～好难猜呀。" },
    { role: "mal", type: "idea", text: "这是给你的蛋糕喵" },
    { role: "mal", type: "go", afterType: "ori", text: "先点蜡烛——", action: async () => { await wait(450); if (guideRunning) setSvgVisibility(candle, "visible"); } },
    { role: "mal", type: "go", afterType: "ori", text: "然后是关灯——", action: async () => { await wait(450); if (!guideRunning) return; const box = candle.getBoundingClientRect(); document.body.style.setProperty("--candle-x", `${box.left + box.width / 2}px`); document.body.style.setProperty("--candle-y", `${box.top + box.height / 2}px`); document.body.classList.add("guide-dark"); } },
    { role: "mal", type: "go", afterType: "ori", text: "生日歌启动——", action: () => { void playSong(); } },
    { role: "mal", type: "hug", text: "许愿，然后吹蜡烛喵。", action: () => { blowButton.hidden = false; } },
    { role: "mal", type: "go", text: "好啦，可以吃蛋糕啦w", action: () => { document.body.classList.remove("guide-dark"); setSvgVisibility(candle, "hidden"); } },
    { role: "mal", type: "go", text: "我请来了水月和你一起切蛋糕喵。", action: async () => {
      guideCharacter.classList.add("mizuki");
      setCharacterState("mizuki", "ori");
      guideHint.textContent = language === "zh" ? "水月出现" : "Mizuki appears";
      await wait(500);
      if (!guideRunning) return;
      setCharacterState("mizuki", "knife");
      guideCharacter.classList.add("knife-ready");
      guideHint.textContent = language === "zh" ? "展示蛋糕刀" : "Cake knife shown";
    } },
    { role: "mal", face: "happy", text: "用鼠标在蛋糕上描绘轨迹，开始切切切 ><", action: () => { document.getElementById("guide-character").classList.remove("mizuki", "knife-ready"); } }
  ];
  let guideIndex = 0, typingTimer = 0, guideRunning = false, restoreGuideButtonFocus = false;
  const segmentGuideText = (text) => window.Intl?.Segmenter
    ? Array.from(new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(text), (part) => part.segment)
    : Array.from(text);
  const renderGuideLine = () => {
    window.clearInterval(typingTimer);
    const item = lines[guideIndex];
    guideSpeaker.textContent = item.role === "mizuki" ? "水月 · mizuki" : "mal";
    setCharacterState(item.role, item.type ?? "ori", item.face ?? "normal");
    guideLine.replaceChildren();
    const chunks = segmentGuideText(item.text);
    chunks.forEach((glyph) => { const span = document.createElement("span"); span.className = "dialogue-grapheme"; span.textContent = glyph; span.hidden = true; guideLine.append(span); });
    guideNext.setAttribute("aria-disabled", "true");
    if (!musicBlocked) guideHint.textContent = "";
    blowButton.hidden = true;
    let shown = 0, typingComplete = false;
    const finishTyping = async () => {
      if (typingComplete) return;
      typingComplete = true;
      window.clearInterval(typingTimer);
      guideLine.querySelectorAll(".dialogue-grapheme").forEach((glyph) => { glyph.hidden = false; });
      guideNext.setAttribute("aria-disabled", "true");
      if (item.action) await item.action();
      if (!guideRunning) return;
      if (item.afterType) setCharacterState(item.role, item.afterType, item.face ?? "normal");
      if (guideIndex !== 6) guideNext.setAttribute("aria-disabled", "false");
      if (restoreGuideButtonFocus) {
        (guideIndex === 6 ? blowButton : guideNext).focus();
        restoreGuideButtonFocus = false;
      }
    };
    if (!chunks.length) void finishTyping();
    else typingTimer = window.setInterval(() => {
      if (shown < chunks.length) guideLine.querySelectorAll(".dialogue-grapheme")[shown++].hidden = false;
      if (shown >= chunks.length) void finishTyping();
    }, 65);
  };
  const stopGuide = () => {
    window.clearInterval(typingTimer); stopSong(true);
    document.body.classList.remove("guide-dark");
    document.body.style.removeProperty("--candle-x"); document.body.style.removeProperty("--candle-y");
    guide.hidden = true; guideRunning = false; gameActive = true;
    document.getElementById("game").classList.remove("guide-target");
    setSvgVisibility(candle, "hidden"); armIdleTimer();
    document.getElementById("welcome-title").focus();
  };
  const startGuide = () => {
    if (guideRunning) return;
    guideRunning = true; guideIndex = 0; gameActive = false; guide.hidden = false;
    document.getElementById("game").classList.add("guide-target");
    renderGuideLine();
    document.getElementById("guide-skip").focus();
  };
  const unlockAudioFromGesture = () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ??= new Audio();
    if (audioContext.state === "suspended") void audioContext.resume().catch(() => {});
  };
  guideNext.addEventListener("click", () => {
    unlockAudioFromGesture();
    if (guideNext.getAttribute("aria-disabled") === "true" || !guideRunning) return;
    if (guideIndex >= lines.length - 1) { stopGuide(); return; }
    restoreGuideButtonFocus = document.activeElement === guideNext || document.activeElement === blowButton;
    guideIndex++; renderGuideLine();
  });
  blowButton.addEventListener("click", () => {
    restoreGuideButtonFocus = document.activeElement === blowButton;
    blowButton.hidden = true; stopSong();
    document.body.classList.remove("guide-dark");
    candle.querySelector(".candle-flame").hidden = true;
    guideIndex = 7; renderGuideLine();
  });
  musicButton.addEventListener("click", () => {
    if (songPlaying) { stopSong(); musicButton.textContent = copy[language].musicPlay; }
    else { void playSong(); }
  });
  document.getElementById("guide-skip").addEventListener("click", stopGuide);
  document.addEventListener("keydown", (event) => {
    if (guideRunning && event.key === "Escape") { event.preventDefault(); stopGuide(); }
  });
  guide.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...guide.querySelectorAll("button:not([hidden]):not(:disabled)")];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener("pagehide", () => stopSong(true));

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
  onIntroFinished = startGuide;
  if (finished) onIntroFinished();
})();
