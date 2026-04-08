---
title: Firefox加载bilibili缓慢
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- bilibili
- broswer
- config
- firefox
---

#broswer #firefox #bilibili #config 
1. 清cookie
2. 在`about:config`中搜索`network.dns.disableIPv6`改成`true`。
   > **关闭IPv6（尝试性）**：有网友反馈B站的IPv6线路近期可能存在降速问题 [](https://blog.csdn.net/m0_52352223/article/details/156913064)[](https://jnbxhj.com/a7f9975f4a172b04/db4a28eb79900a22.html)。虽然未经官方证实，但可以作为排查步骤一试：在Firefox地址栏输入 `about:config`，搜索 `network.dns.disableIPv6`，双击将其值改为 `true`。