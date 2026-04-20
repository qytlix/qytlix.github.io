---
title: flatpak仓库问题
date: '2025-08-05T17:54:03+08:00'
lastmod: '2025-08-05T17:54:03+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- flatpak
- mirror
- 配置文件
- 镜像
---

# 显示仓库地址
运行
```sh
flatpak remotes --show-details
```
# 配置文件地址
  
在`/var/lib/flatpak/repo/config`里面。
已经备份为`/var/lib/flatpak/repo/config~`。
# 上海交通大学源
 
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