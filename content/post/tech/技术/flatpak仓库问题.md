---
title: flatpak仓库问题
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- config
- flatpak
- mirror
- 配置文件
- 镜像
---

#flatpak
# 显示仓库地址
运行
```sh
flatpak remotes --show-details
```
# 配置文件地址
#config #配置文件 
在`/var/lib/flatpak/repo/config`里面。
已经备份为`/var/lib/flatpak/repo/config~`。
# 上海交通大学源
#镜像 #mirror
```bash
https://mirror.sjtu.edu.cn/flathub
```
使用如下命令更改
```sh
flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub
```
# 随时换源
```sh
./change-repo
#!/bin/sh

dir="/var/lib/flatpak/repo/"
cd $dir
sudo cp config config.tmp && sudo cp config~ config && sudo cp config.tmp config~
flatpak remotes --show-details
```