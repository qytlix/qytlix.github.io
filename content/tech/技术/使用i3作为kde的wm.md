---
title: 使用i3作为kde的wm
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
---

首先mask作为kde下x11的wm——kwin
```sh
systemctl --user mask plasma-kwin_x11.service
```

创建自定义服务`~/.config/systemd/user/plasma-i3wm.service`:
```ini
[Install]
WantedBy=plasma-workspace.target

[Unit]
Description=Plasma Custom Window Manager
Before=plasma-workspace.target

[Service]
ExecStart=/usr/bin/i3
Slice=session.slice
Restart=on-failure
```

启用新服务:
```bash
systemctl --user enable plasma-i3wm.service
systemctl --user daemon-reload
```

## 如何还原
```sh
systemctl --user disable plasma-i3wm.service
systemctl --user unmask plasma-kwin_x11.service
systemctl --user daemon-reload
```

### 使用脚本
