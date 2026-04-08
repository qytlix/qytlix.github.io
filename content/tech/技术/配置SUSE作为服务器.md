---
title: 配置SUSE作为服务器
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- systemctl
- 配置
---

#systemctl #配置 
关闭了一些服务
```zsh
sudo systemctl disable bluetooth.servise # 蓝牙
sudo systemctl disable cups # 打印机
ModemManager # 调制解调器管理	无移动网络设备（如 4G 网卡）可禁用

sudo systemctl disable smb
sudo systemctl disable ollama
sudo systemctl disable v2raya
```
