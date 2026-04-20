---
title: Dolphin环境
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-01-10T12:08:26+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- dolphin
- hyprland
---
   
在`hyprland.conf`添加如下环境变量
```conf
env = XDG_MENU_PREFIX, plasma-
exec-once = systemctl --user import-environment XDG_MENU_PREFIX
exec-once = dbus-update-activation-environment XDG_MENU_PREFIX
```