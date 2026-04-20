---
title: stable diffusion webui 启动
date: '2026-04-19T23:01:25+08:00'
lastmod: '2026-03-16T00:40:20+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- notags
---
```sh
conda activate sd_webui
export HF_ENDPOINT=https://hf-mirror.com
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python launch.py

```