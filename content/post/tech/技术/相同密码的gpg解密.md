---
title: 相同密码的gpg解密
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-03-22T22:07:26+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- gnupg
- gpg
---
  
# 相同密码
相同密码，使用
```sh
gpg -d /path/to/source.gpg > /path/to/destination
```
之后就会提示输入密码。