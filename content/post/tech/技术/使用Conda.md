---
title: 使用Conda
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-03-22T21:46:38+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- conda
- python
- 环境
---
  
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