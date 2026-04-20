---
title: tmux默认shell
date: '2026-04-19T23:01:25+08:00'
lastmod: '2026-04-06T23:34:57+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- config
- shell
- tmux
---
   
这是最直接的方法，通过在 Tmux 配置文件（`~/.tmux.conf`）中指定一个 shell 的**完整路径**来实现。

```sh
vim ~/.tmux.conf
```

```conf
# .tmux.conf
set -g default-shell "/usr/bin/zsh"
```