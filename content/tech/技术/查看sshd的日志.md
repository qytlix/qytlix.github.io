---
title: 查看sshd的日志
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- ssh
- journal
- sshd
---

#journal #ssh #sshd
使用`journalctl`
```sh
sudo journalctl -u sshd --since "yyyy-MM-dd" --until "yyyy-MM-dd"
```