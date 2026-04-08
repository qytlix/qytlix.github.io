---
title: 使用Conda
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- 环境
- python
- conda
---

#python #conda #环境
To activate conda's base environment in your current shell session:  
```sh
eval "$(/home/qytlix/anaconda3/bin/conda shell.zsh hook)"    
```

To install conda's shell functions for easier access, first activate, then:  
```sh
conda init
```

> [!hint]
> 但是我发现直接使用`venv`好像就ok了。