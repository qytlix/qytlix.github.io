---
title: Godot Collision layer 和 mask
date: '2025-08-05T16:57:44+08:00'
lastmod: '2025-04-02T23:38:58+08:00'
draft: false
categories:
- Diary
- 技术
tags:
- CollisionObject2D
- godot
---
 
## collision layer
碰撞层，就是本物体所在的层。
其他所有的，拥有 “本物体所在*碰撞层*”的碰撞掩码 的物体，可以检测到本物体。
## collision mask
碰撞掩码，就是可以和哪些层的物体碰撞。