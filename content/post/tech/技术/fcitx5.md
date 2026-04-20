---
title: fcitx5
date: '2026-01-06T21:06:43+08:00'
lastmod: '2025-10-18T09:32:29+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- fcitx
- fcitx5
- vscode
- 输入法
---
    
居然在这个上面（gnome）可以用了。
震惊我10000年。
注意：[fcitx5漏字调整方案](https://forum.archlinuxcn.org/t/topic/13922)
可以调整electron和chrome* 的漏字问题。
> 你的 Google Chrome 在使用 XIM 输入法协议。这是 Chrom* 的通病。解决方法是让 Google Chrome 运行于 Wayland 下：在 ~/.config/chrome-flags.conf 里添加 --ozone-platform-hint=auto 和 --enable-wayland-ime。


```conf
--ozone-platform-hint=auto
--enable-wayland-ime
```