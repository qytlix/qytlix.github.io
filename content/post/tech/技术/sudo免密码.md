---
title: sudo免密码
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-01-09T16:43:17+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- sudo
- 环境
---
   
**使用visudo编辑配置**（避免语法错误导致系统无法使用sudo）：`sudo visudo`
**添加免密规则**（以用户`test`为例）： `test ALL=(ALL) NOPASSWD: ALL`