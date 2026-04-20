---
title: hyprland blur shell
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-01-25T17:58:10+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- ghostty
- hyprland
- tty
---
    
在`hyprland`下让`ghostty`的背景毛玻璃：
```config
~/.config/ghostty/config

background-opacity = 0.75
```
这样就可以了，因为在`hyprland`更新之后（应该）就可以直接模糊不用再用`windowrulev2`来限制哪些窗口需要`blur`了，只有`no_blur`的选项。