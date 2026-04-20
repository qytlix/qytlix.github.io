---
title: 关闭docker
date: '2026-01-06T21:06:43+08:00'
lastmod: '2026-01-05T14:15:33+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- docker
- systemctl
---
 
```zsh
sudo systemctl disable --now docker
sudo systemctl disable docker.socket
```