---
title: Huion Kamvas 13
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- autostart
- driver
- 数位屏
- auto
- 驱动
- start
---

经过测验，在`opensuse tumbleweed`中使用良好。
```info
OS: openSUSE Tumbleweed x86_64    
Kernel: 6.15.3-1-default    
Uptime: 14 mins    
Packages: 82 (pip), 3731 (rpm), 6 (steam), 32 (flatpak-system), 1 (flatpak-user)    
Shell: zsh 5.9    
Resolution: 1920x1080    
DE: Plasma 6.4.1 [KF 6.15.0] [Qt 6.9.1] (x11)    
WM: i3    
Theme: Breeze-Dark [GTK2/3]    
Icons: candy-icons [GTK2/3]    
Terminal: konsole    
CPU: AMD Ryzen 5 5600G (12) @ 4.465GHz    
GPU: AMD ATI Radeon RX 6600/6600 XT/6600M    
Memory: 4590.82 MiB / 15776.00 MiB
```
### 关闭驱动自启动
#驱动 #数位屏 #driver #autostart #auto #start
在目录`etc/xdg/autostart/`目录中存放登陆启动的文件。
直接删除`huion`的启动文件即可。
> [!Caution]
> 关掉了屏幕的数位屏仍然被判定为一个屏幕，在`windows`和`opensuse tumbleweed`里面都是这样。