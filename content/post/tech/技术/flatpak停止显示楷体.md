---
title: flatpak停止显示楷体
date: '2026-01-06T21:06:43+08:00'
lastmod: '2026-01-06T21:02:20+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- flatpak
- 字体
- 环境
---
   
只用了一行命令就解决问题。
还是国外的ai靠谱很多

```sh
xfconf-query -c xsettings -p /Gtk/FontName -s "Noto Sans CJK SC 10"
```