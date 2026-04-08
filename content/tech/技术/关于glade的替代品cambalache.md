---
title: 关于glade的替代品cambalache
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- cambalache
- glade
---

#glade #cambalache
实际上`glade`只支持`gtk+3`，如果想要使用`gtkmm4`的`builder`功能，就需要另外安装`cambalache`。
`cambalache`支持`gtk+3`和`gtk+4`，所以功能实际更加强大，可以直接替换。
问题是它不如`glade`流畅，也没有中文。
# 安装
`flatpak`上面仅此一个叫这个的。
```sh
flatpak install cambalache
```
# 删掉glade
```sh
zypper rm -u glade
```