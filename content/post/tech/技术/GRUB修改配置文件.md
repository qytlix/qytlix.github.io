---
title: GRUB修改配置文件
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-02-08T19:12:14+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- grub
- 配置文件
---
  
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
