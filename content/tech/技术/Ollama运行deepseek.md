---
title: Ollama运行deepseek
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- AI
- deepseek
- ollama
---

#AI #deepseek #ollama
# 参数大小选择
## 笔记本电脑
笔记本电脑无脑选择`1.5b`
```sh
$ ollama run deepseek
```
然而效果不咋地。
## 台式机，有独立显卡
台式机有`rx6600-8G`，本来以为可以顺利运行`8b`参数的，结果因为没有官方`AMD`支持，用不了显卡加速。
可以尝试`ollama-for-amd`。
如果是官方支持的型号就不用了，可惜我这个不支持。
> [!Tip]
> 记得要备份本地大模型。你也不想再下载一遍这个玩意儿了吧。