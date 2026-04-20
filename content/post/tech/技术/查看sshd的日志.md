---
title: 查看sshd的日志
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-05-21T23:00:33+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- journal
- ssh
- sshd
---
  
使用`journalctl`
```sh
sudo journalctl -u sshd --since "yyyy-MM-dd" --until "yyyy-MM-dd"
```