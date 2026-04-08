---
title: iphone使用v2ray
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- iphone
- v2ray
- proxy
---

#v2ray #iphone #proxy 
### 直接使用`v2ray`的软件
国区的软件都不好用。其他好用的在外区都要付费。
遂不推荐。
### 使用`wifi`连接代理服务器
#### 使用方法
1. 服务端
	- 在安卓手机使用`v2rayNG`
		版本：`1.10.8`
		在`核心设置`中打开`允许来自局域网的连接`
		记住`本地代理端口`，默认是`10808`，这个就是下文苹果端的`端口`
		打开热点，进入`termux`查看内网地址，例如使用`ifconfig`，这个就是下文苹果端的`地址`
	- 在Linux端使用`v2rayA`
		版本：`2.2.4.6`
		点开右上角的设置，打开`开启端口分享`（这是一个按钮）
		连接和手机一样的路由，找到`地址`
		`端口`是`20171`，记得打开防火墙
```shell
sudo firewall-cmd --zone=public --add-port=20171 --permanent
sudo firewall-cmd --reload
```
1. 苹果端
	打开苹果的`wifi`，然后点进正在使用的`wifi`，调到最下面，把`设置代理`改成`手动`，输入代理服务器的`地址`和`端口`就可以了。
	⚠️不能用`自动`模式，至少`v2rayA`和`v2rayNG`都不能这样子。
