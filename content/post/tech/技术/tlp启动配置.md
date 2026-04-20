---
title: tlp启动配置
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-02-27T21:08:10+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- power
- tlp
---
   
## 关掉其他电源管理
例如`power-profiles-daemon`等等。
> 记得关掉socket
## 屏蔽`systemd-rfkill`
保证tlp管理无线设备正常。
```sh
sudo systemctl mask systemd-rfkill.service
sudo systemctl mask systemd-rfkill.socket
```
## `systemctl`启动`tlp`
```sh
systemctl enable --now tlp
```
## 检查`tlp`状态
```sh
sudo tlp-stat -s
```
## USB设备不自动挂起
```config
# /etc/tlp.conf
# 1. USB自动挂起全部关闭
USB_AUTOSUSPEND=0

# 2. 只排除某一个设备
# 使用lsusb查看ID
# USB_DENYLIST="****:****"
```