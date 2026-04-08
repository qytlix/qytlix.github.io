---
title: GRUB修改配置文件
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- 配置文件
- config
- grub
---

#grub #配置文件 #config
# 配置文件位置
```path
make的时候的源文件
/etc/default/grub

实际文件存储位置
/boot/grub/grub.cfg
```
# 配置文件信息
## GRUB_TIMEOUT
超时时间，单位为秒。
此处设置为0.
# 配置完成
运行使之生效。
```sh
# backup
sudo mv /boot/grub/grub.cfg /boot/grub/grub.cfg~

sudo grub-mkconfig -o /boot/grub/grub.cfg
```
注意：网上的那些`grub-update`不管用
