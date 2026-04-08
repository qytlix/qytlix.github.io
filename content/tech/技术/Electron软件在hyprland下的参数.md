---
title: Electron软件在hyprland下的参数
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- electron
- obsidian
- wofi
---

#electron #obsidian #wofi
启动时添加`--enable-features=UseOzonePlatform --ozone-platform=wayland`参数。
使用`wofi`时，修改`/usr/share/applications/<application>.desktop`里面的启动参数即可。

