---
title: pacman删除包及其依赖
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- pacman
---

#pacman 
删除指定软件包，及其所有没有被其他已安装软件包使用的依赖关系：
```sh
sudo pacman -Rs _package_name_
```