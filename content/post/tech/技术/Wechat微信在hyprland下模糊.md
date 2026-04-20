---
title: Wechat微信在hyprland下模糊
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-01-10T17:07:01+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- hyprland
- wechat
---
   
在hyprland.conf添加：
```conf
exec-once = echo 'Xft.dpi:144' | xrdb -merge
xwayland {
    force_zero_scaling = true
}
```
https://forum.archlinuxcn.org/t/topic/14080