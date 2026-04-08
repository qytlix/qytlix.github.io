---
title: Wechat微信在hyprland下模糊
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- config
- hyprland
- wechat
---

#wechat #hyprland #config 
在hyprland.conf添加：
```conf
exec-once = echo 'Xft.dpi:144' | xrdb -merge
xwayland {
    force_zero_scaling = true
}
```
https://forum.archlinuxcn.org/t/topic/14080