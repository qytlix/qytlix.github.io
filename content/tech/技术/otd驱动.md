---
title: otd驱动
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- opentabletdriver
---

#opentabletdriver
在启动的时候运行`otd-daemon`
然后禁用内核驱动
```sh
echo "blacklist wacom" | sudo tee -a /etc/modprobe.d/blacklist-otd.conf
echo "blacklist hid_uclogic" | sudo tee -a /etc/modprobe.d/blacklist-otd.conf

# 这个mkinitcpio要安装
sudo mkinitcpio -P
```
验证，以下命令应该没有输出
```sh
lsmod | grep -E 'wacom|uclogic'
```