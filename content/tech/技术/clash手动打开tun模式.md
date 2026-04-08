---
title: clash手动打开tun模式
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- clash
- config
- tun
---

#clash #config #tun
在clash启动的时候运行`sudo clash-verge-service'即可。
举例说明，修改了`Exec`字段。
```desktop
# /usr/share/applications/Clash\ Verge.desktop

[Desktop Entry]
Categories=Development;
Comment=Clash Verge Rev
Exec=/bin/bash -c "sudo clash-verge-service & clash-verge %U"
StartupWMClass=clash-verge
Icon=clash-verge
Name=Clash Verge
Terminal=false
Type=Application
MimeType=x-scheme-handler/clash;
```
> 也可以使用`pkexec clash-verge-service &`来启动服务，但是每次都需要输入密码。