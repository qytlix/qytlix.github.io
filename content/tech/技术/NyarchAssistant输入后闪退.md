---
title: NyarchAssistant输入后闪退
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- issue
- nyarchlinux
- solution
---

#issue #nyarchlinux #solution
# 问题描述
出问题的版本：
`aur/nyarchassistant 0.7.1-1`
`extra/python-scikit-learn 1.6.1-1`
报错信息：
```error
/usr/lib/python3.13/site-packages/sklearn/base.py:380: InconsistentVersionWarning: Trying to unpickle estimator LogisticRegression from version 1.5.2 when using version 1.6.1. This might lead to breaking code or invalid results. Use at your own risk. For more info please refer to:
https://scikit-learn.org/stable/model_persistence.html#security-maintainability-limitations
  warnings.warn(
['console']
**
```
大概就是说`python-scikit-learn`版本太高可能会出现不可预计的错误。
需要`1.5.2`的版本。
# 解决方案
## 降级的方案
### 本地缓存
[参看1.5](https://wiki.archlinuxcn.org/wiki/Pacman)
先看看本地的缓存：
```bash
ls /var/cache/pacman/pkg/ | grep package
# if existed
sudo pacman -U /path/to/grep/package
```

> [!Tip] Tip from kimi
> 为了避免系统自动升级该软件包，可以将其添加到 `pacman.conf` 的 `IgnorePkg` 配置中：
> ```ini
> IgnorePkg = scikit-learn
> ```
> 编辑 `/etc/pacman.conf` 文件，在 `[options]` 部分添加上述内容

不幸的是，没有相应的版本。
### 去Archive下载
直接使用：
```sh
sudo pacman -U /url/to/package
```
## 直接使用`flatpak`的方案
去`github`上面下载官方的包，然后安装即可。
<mark>确认有效</mark>。