---
title: 读取ls带空格文件
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- IFS
- shell
---

#shell #IFS
# 问题原因
分割符默认有空格
```sh
$ set | grep ^IFS
IFS=$' \t\n'
IFS=$_ifs compgen "$@" ${_cur:+-- "$_cur"}) || {
```
# 解决方案
在开始`ls`之前就先`IFS=$'\t\n'`
> [!hint]
注意全部的变量最好都用双引号引起来以防万一。