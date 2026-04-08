---
title: hyprland blur shell
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- config
- ghostty
- hyprland
- tty
---

#config #tty #ghostty #hyprland 
在`hyprland`下让`ghostty`的背景毛玻璃：
```config
~/.config/ghostty/config

background-opacity = 0.75
```
这样就可以了，因为在`hyprland`更新之后（应该）就可以直接模糊不用再用`windowrulev2`来限制哪些窗口需要`blur`了，只有`no_blur`的选项。