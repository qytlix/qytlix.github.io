---
title: pacman删除无用依赖
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- pacman
- archlinuxwiki
- 依赖
---

#archlinuxwiki #pacman #依赖 
# Arch Linux 移除不使用的包
[原文](https://www.cnblogs.com/james-wangx/p/16111505.html)
[参考wiki](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks#Removing_unused_packages_(orphans))
递归地删除包和它的配置文件。
> [!caution] 悠着点
> 这个可能会误删一些编译用包
```sh
pacman -Qtdq | pacman -Rns -
```
`pacman -Q` 主要用于查询，其后加选项和包名。
`pacman -Qt (--unrequired)` 列出不被任何包需要的包。
`pacman -Qd (--deps)` 列出作为依赖被安装的包。
`pacman -Qq (--quiet)` 显示少量的信息（只显示包名，不显示版本）用于查或搜索。
`pacman -R` 主要用于删除，其后加选项和包名。
`pacman -Rn (--nosave)` 移除配置文件。
`pacman -Rs (--recursive)` 递归地删除不需要的依赖。
可以调整`.bashrc`：
```sh
~/.bashrc
alias autoremove="sudo pacman -Qtdq | sudo pacman -Rns -"
```