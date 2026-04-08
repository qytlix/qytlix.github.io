---
title: 使用Pylance自动补全gi
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- gnome
- python
- vscode
- 自动补全
---

#python #vscode #gnome #自动补全
本机环境`openSUSE Tumbleweed 20250319`，`python313`。
# 虚拟环境
```sh
# 新建环境
python3 -m venv .venv

# 启动环境
source .venv/bin/activate
```
# 安装的包
- `python313-devel`: meson用，不然用`pip3`安装下面的包的时候会报错。
- `pygobject`: 基础包。
- `pygobject-stubs`: 自动补全用。
```sh
sudo zypper in python313-devel
pip3 install pygobject
pip3 install pygobject-stubs
```
# 测试样例
```python
# main.py
import gi

gi.require_version ('Gtk', '4.0')

from gi.repository import Gtk # type: ignore

def on_activate(app):
    win = Gtk.ApplicationWindow(application=app)
    btn = Gtk.Button(label="Hello, World!")
    btn.connect('clicked', lambda x: win.close())
    win.set_child(btn)
    win.present()

app = Gtk.Application(application_id='org.gtk.Example')
app.connect('activate', on_activate)
app.run(None)
```

> [! Caution]
> 记得添加`__init__.py`。