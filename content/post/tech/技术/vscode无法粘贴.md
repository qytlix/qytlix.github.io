---
title: vscode无法粘贴
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- archlinuxwiki
- vscode
---

#vscode #archlinuxwiki
[原文地址](https://wiki.archlinuxcn.org/wzh/index.php?title=Visual_Studio_Code)

[code](https://archlinux.org/packages/?name=code)包 1.95.0+ 版本运行在 32.2.8+ 版本的 electron 上时，已知存在粘贴不起作用的问题（参见[上游问题](https://github.com/microsoft/vscode/issues/238609)以及[AL 问题](https://gitlab.archlinux.org/archlinux/packaging/packages/code/-/issues/6)）。

两种可能的解决方法：

- 移除`editor.action.clipboardPasteAction`键盘快捷键。
- [降级](https://wiki.archlinuxcn.org/wiki/%E9%99%8D%E7%BA%A7%E8%BD%AF%E4%BB%B6%E5%8C%85 "降级软件包") [electron32](https://archlinux.org/packages/?name=electron32)包 到 32.2.8 版本。

> [!note]
第一种方法有效。
版本:`electron33 33.4.0-1`,`code 1.96.4-1`

> [!note]
> 直接安装`microsoft`预编译的`vscode`二进制包可以直接解决问题
> [还另外解决了一个问题]({{< ref "vscode无法粘贴" >}})