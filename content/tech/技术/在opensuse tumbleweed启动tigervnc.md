---
title: 在opensuse tumbleweed启动tigervnc
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- VNC
- opensuse
- config
- 安装
---

#opensuse #安装 #VNC #config 
# 安装
```sh
# one can chose tigervnc
sudo zypper in tigervnc

# Actually, xorg-x11-Xvnc is enough
sudo zypper in xorg-x11-Xvnc
```
# 配置
```sh
# Setting passwd and save it into [file]
vncpasswd [file]
```
# 启动

> [!Tip]
> 在`opensuse`中，使用的不是`vncserver`而是`/usr/libexec/vncserver`。
> 直接用`vncserver`会报错的。
> 可以在环境变量`PATH`中添加`/usr/libexec`来直接使用`vncserver`。

```sh
# should set firewall first
sudo firewall-cmd --add-port=5901/tcp --permanent
sudo firewall-cmd --reload

# start vnc at port 5701
/usr/libexec/vncserver :1
```

还可以用如下命令来调整屏幕分辨率：
```bash
Xvnc -geometry 1920x1080 -depth 24 :1 -rfbauth .vncpasswd
```
`.vncpasswd`是在配置的时候用到的`[file]`。
`-depth 24`是颜色位深，为`24`。

> [!warning]
> 这一条似乎不能启动`kde plasma`，问题的原因有待探究。
