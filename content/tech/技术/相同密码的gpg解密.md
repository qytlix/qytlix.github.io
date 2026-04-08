---
title: 相同密码的gpg解密
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- gnupg
- gpg
---

#gnupg #gpg 
# 相同密码
相同密码，使用
```sh
gpg -d /path/to/source.gpg > /path/to/destination
```
之后就会提示输入密码。