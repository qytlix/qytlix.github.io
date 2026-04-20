---
title: 开启／关闭docker服务
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-02-27T19:47:17+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- docker
- systemctl
---
  
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