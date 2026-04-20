---
title: 在arch上面安装新的内核
date: '2026-02-27T21:08:37+08:00'
lastmod: '2026-02-27T18:29:46+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- archlinux
- core
---
 
直接pacman先安装一个想要的内核，例如archlinuxcn/linux-lily
```sh
sudo pacman -S linux-lily
```
然后更新grub启动项
```sh
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

## 更改默认启动项

> from deepseek

设置默认启动项的方法和你使用的引导加载程序（通常是 GRUB）有关。最常用的几种方法我都整理在下面了，你可以根据自己的需求来选择。

### 🎯 为 GRUB 用户准备的三种方法

你可以通过编辑 `/etc/default/grub` 文件来配置 GRUB 的默认行为，修改完成后，**一定记得要运行 `sudo grub-mkconfig -o /boot/grub/grub.cfg` 命令来更新配置**。

| 方法 | 核心配置 (`/etc/default/grub`) | 适用场景与原理 |
| :--- | :--- | :--- |
| **1. 按菜单名称指定** | `GRUB_DEFAULT="Advanced options for Arch Linux>Arch Linux, with Linux linux"` | **最直观、最推荐**。通过指定启动菜单中显示的名称来设定默认项，即使以后内核更新、菜单位置改变，只要名称不变就能准确启动。对于子菜单（如“高级选项”）中的内核，需要用 `>` 符号连接主菜单和子菜单项的名称。 |
| **2. 按内核文件指定** | `GRUB_TOP_LEVEL="/boot/vmlinuz-linux-lts"` | **最直接**。直接指定默认启动的内核镜像文件（如你想默认启动 LTS 内核，就填这个路径）。这种方法会将 GRUB 菜单中的第一个（顶级）条目直接替换为你指定的内核。 |
| **3. 记住上次选择** | `GRUB_DEFAULT=saved` <br> `GRUB_UB_SAVEDEFAULT=true` | **最灵活**。系统会自动记住你上次启动时选择了哪个内核或系统，并将其作为下一次的默认启动项。 |

> 💡 **一点小提示**：方法 2 (`GRUB_TOP_LEVEL`) 和方法 3 (记住上次选择) 的功能是**互斥的**，同时启用可能会导致冲突，选一种最适合你的就好。

### 💡 如何找到正确的菜单名称？

想知道启动菜单里每个选项的确切名称，最简单的方法是直接查看 GRUB 生成的配置文件：
```bash
grep "menuentry" /boot/grub/grub.cfg
```
这个命令会列出所有菜单项的名称，你从中复制粘贴需要的部分到 `GRUB_DEFAULT` 即可，能避免手动输入可能造成的拼写错误。