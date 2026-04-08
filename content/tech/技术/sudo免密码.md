---
title: sudo免密码
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- 环境
- sudo
- config
---

#sudo #环境 #config 
**使用visudo编辑配置**（避免语法错误导致系统无法使用sudo）：`sudo visudo`
**添加免密规则**（以用户`test`为例）： `test ALL=(ALL) NOPASSWD: ALL`