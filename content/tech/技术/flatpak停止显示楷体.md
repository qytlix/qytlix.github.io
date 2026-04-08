---
title: flatpak停止显示楷体
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- flatpak
- 环境
- 字体
---

#flatpak #字体 #环境 
只用了一行命令就解决问题。
还是国外的ai靠谱很多

```sh
xfconf-query -c xsettings -p /Gtk/FontName -s "Noto Sans CJK SC 10"
```