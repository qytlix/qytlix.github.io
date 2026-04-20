---
title: pacman删除包及其依赖
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-02-20T23:03:30+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- pacman
---
 
删除指定软件包，及其所有没有被其他已安装软件包使用的依赖关系：
```sh
sudo pacman -Rs _package_name_
```