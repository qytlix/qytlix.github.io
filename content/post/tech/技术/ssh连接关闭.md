---
title: ssh连接关闭
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-05-21T23:08:04+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- ssh
- sshd
---
 
[[查看sshd的日志]]
```sh
sudo journalctl -u sshd --since "2025-05-21"
```
发现sshd-session报错
```journal
pam_env(sshd:setcred): Unable to read configuration file /etc//environment line 1: Missing delimiter pam_kwallet5(sshd:setcred): pam_kwallet5: pam_sm_setcred fatal: PAM: pam_setcred(): Critical error - immediate abort
```
检查`/etc/environment`，发现之前在调整`wayland`的输入法的时候往里面乱装了一些东西。
删掉他。
```sh
sudo rm /etc/environment
```
然后重启`sshd`
```sh
sudo systemctl restart sshd
```
手机端：
```sh
~ $ link-start
Last login: Wed May 21 22:58:47 CST 2025 from 192.168.31.143 on ssh
Have a lot of fun...
Welcome! qytlix
Wed May 21 11:04:21 PM CST 2025
 ~/
```
启动成功。
