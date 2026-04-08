---
title: Dolphin环境
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- dolphin
- hyprland
- config
---

#config #dolphin #hyprland 
在`hyprland.conf`添加如下环境变量
```conf
env = XDG_MENU_PREFIX, plasma-
exec-once = systemctl --user import-environment XDG_MENU_PREFIX
exec-once = dbus-update-activation-environment XDG_MENU_PREFIX
```