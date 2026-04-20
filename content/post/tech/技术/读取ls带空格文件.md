---
title: 读取ls带空格文件
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-02-15T00:27:19+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- IFS
- shell
---
 
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