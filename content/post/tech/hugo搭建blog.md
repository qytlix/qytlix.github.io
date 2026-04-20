---
title: hugo搭建blog
date: '2026-04-19T22:59:59+08:00'
lastmod: '2026-04-19T22:59:59+08:00'
draft: false
categories:
- Diary
tags:
- blog
- config
- hugo
---
  

## 新建站点

```sh
hugo new site <site-name>
# 或者可以
hugo new site .
```

## 设置gitignore

```gitignore
# .gitignore
public
```

## 配置文件

很需要调整的hugo的文件有：

- hugo.toml
- .github/workflows/hugo.yaml
- content/*
- config/*
- data/*

按需求调整即可。

> [!hint] 我的post呢
> 我这个皮肤需要把博文放在`content/post/`目录下面才能被检测到post的统计信息中，如果发现统计信息有误，可以尝试更换路径。

> [!hint] 奇怪的部署要求
> 如果有特别的需求，把blog部署到奇怪的地方（例如部署到`mysite.com/x`），可以参考`.github/workflows/hugo.yaml`42行，`hugo.toml`1行、6行。

## 添加皮肤

```sh
git submodule add <好看皮肤的仓库地址>
```

在`hugo.toml`中设置`theme=<主题名字>`。

一般会复制主题中的config和data用于本地配置。

## 添加blogs

往content文件夹里面塞东西即可。

{{< admonition "warning" "元数据" true >}}
hugo需要文章有元数据（front matter），实例如下
```
---
title: This is title
draft: false
date: 2026-04-08 11:08:03+08:00
categories:
- test
- only for test
tag:
- notag
---

More content
```
{{< /admonition >}}
## 预览

运行`hugo server`，按照提示在对应的端口查看网页。

> [!hint] 热重载
> 热重载发现页面不匹配时，可以先关掉server，删除`public/*`再启动，强制刷新缓存。

