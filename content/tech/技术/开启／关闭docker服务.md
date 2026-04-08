---
title: 开启／关闭docker服务
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- docker
- systemctl
---

#docker #systemctl 
关闭：
```sh
systemctl disable --now docker.socket
systemctl disable --now docker
```

开启：
反着来就行了。
```sh
systemctl enable --now docker.socket
systemctl enable --now docker
```