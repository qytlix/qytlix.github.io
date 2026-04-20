---
title: v2ray时延测试报错
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-04-29T23:03:28+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- notags
---
```log
unknown cipher method: 2022-blake3-aes-256-gcm
```
解决方案：
找到`协议`是`2022-blake3-aes-256-gcm`的节点，把勾勾去掉，然后再测时延。通常是叫做`SS(2022-blake3-aes-256-gcm)`。