---
title: stable diffusion webui 启动
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
---

```sh
conda activate sd_webui
export HF_ENDPOINT=https://hf-mirror.com
export HSA_OVERRIDE_GFX_VERSION=10.3.0
python launch.py

```