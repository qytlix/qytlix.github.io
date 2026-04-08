---
title: 部分electron应用卡死解决方案
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
tags:
- electron
- fcitx5
- linuxqq
- candidates
- steam
- test_vars
- config
---

例如`linuxqq`和`steam`。
#electron #linuxqq #steam #config #fcitx5 
## 报错信息
```sh
...
Gdk: gdk_wayland_display_get_wl_display: assertion 'GDK_IS_WAYLAND_DISPLAY (display)' failed
# 通常到这里就重复或者直接卡死掉没有输出了
```
## 解决方案
[ds原对话](https://chat.deepseek.com/share/5977hs8juzeqmo6f5i)
注意先看看是不是环境变量的问题。
例如`GTK_IM_MODULE`有没有设置成`wayland`？

来自`deepseek`：
> Fcitx5 官方文档和许多 Wayland 环境的实践都表明，不建议全局设置 `GTK_IM_MODULE` 和 `QT_IM_MODULE` 环境变量

就是说把这个环境变量删掉就好了，在`hyprland.conf`里面看看有没有。

如果不是，另寻高就（或者使用下面的脚本）。

## 附录
ds写的脚本，改了一点点。
最后的二分判断稍微有一点问题，但是人力对比一下就能发现出问题的环境变量了。
位置：`~/Documents/Ideas/test_env/main.sh`
```sh
#!/bin/bash

# 二分法查找导致 linuxqq 启动失败的环境变量
# 基于已知成功的基础环境：env -i HOME=$HOME USER=$USER DISPLAY=$DISPLAY \
#   XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS=$DBUS_SESSION_BUS_ADDRESS \
#   PATH=/usr/bin:/usr/local/bin linuxqq

set -e

# 基础变量（必须保留才能启动）
basic_vars=(HOME USER DISPLAY XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS)
# PATH 固定值（可根据你的系统调整）
PATH_VAL="/usr/bin:/usr/local/bin"

# 检查基础变量是否已设置
for var in "${basic_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "错误: 基础变量 $var 未设置，无法进行测试。"
        exit 1
    fi
done

# 获取当前所有环境变量名
mapfile -t all_vars < <(compgen -e)

# 定义要排除的变量（基础变量、PATH 及 shell 内部变量）
exclude_vars=("${basic_vars[@]}" "PATH" "_" "SHLVL" "PWD" "OLDPWD")
exclude_vars+=("BASH_EXECUTION_STRING" "BASH_LINENO" "BASH_SOURCE" "BASH_VERSINFO")
exclude_vars+=("BASH_VERSION" "DIRSTACK" "EUID" "GROUPS" "IFS" "LINENO" "MACHTYPE")
exclude_vars+=("OPTERR" "OPTIND" "OSTYPE" "PIPESTATUS" "PPID" "SECONDS" "SHELLOPTS" "UID")

# 将排除列表转为关联数组
declare -A exclude_map
for var in "${exclude_vars[@]}"; do
    exclude_map["$var"]=1
done
# 排除所有以 BASH_ 开头的变量
for var in "${all_vars[@]}"; do
    if [[ $var == BASH_* ]]; then
        exclude_map["$var"]=1
    fi
done

# 构建候选变量列表（未排除的变量）
candidates=()
for var in "${all_vars[@]}"; do
    if [[ -z "${exclude_map[$var]}" ]]; then
        candidates+=("$var")
    fi
done

# 排序以保证顺序固定
IFS=$'\n' candidates=($(sort <<<"${candidates[*]}"))
unset IFS

echo "候选环境变量数量: ${#candidates[@]}"
echo "开始二分查找..."

low=0
high=$((${#candidates[@]} - 1))
iteration=1

while [ $low -le $high ]; do
    mid=$(( (low + high) / 2 ))
    # 当前测试的变量子集：candidates[0] 到 candidates[mid]
    test_vars=("${candidates[@]:0:$((mid+1))}")

    echo ""
    echo "=== 迭代 $iteration ==="
    echo "测试变量范围: [0, $mid] (共 ${#test_vars[@]} 个变量)"
    echo "第一个变量: ${candidates[0]}"
    echo "最后一个变量: ${candidates[mid]}"

    # 构建 env 命令
    env_cmd=(env -i)
    # 添加基础变量
    for var in "${basic_vars[@]}"; do
        # 注意：这里的单引号是必要的
        env_cmd+=("$var='${!var}'")
    done
    env_cmd+=("PATH='$PATH_VAL'")
    # 添加当前测试的候选变量
    for var in "${test_vars[@]}"; do
        env_cmd+=("$var='${!var}'")
    done
    env_cmd+=("linuxqq")

    # 显示将要运行的命令（简洁）
    echo "运行命令: ${env_cmd[*]}"
    echo "请观察程序是否能正常启动（不报错且界面正常）"
    read -p "是否成功? (y/n) " -n 1 -r response
    echo ""
    if [[ $response =~ ^[Yy]$ ]]; then
        echo "成功: 问题变量在右侧区间"
        low=$((mid + 1))
    else
        echo "失败: 问题变量在左侧区间"
        high=$((mid - 1))
    fi
    iteration=$((iteration + 1))
done

if [ $low -eq $high ]; then
    culprit="${candidates[$low]}"
    echo ""
    echo "找到可能导致问题的变量: $culprit"
    echo "当前值: ${!culprit}"
    echo "你可以尝试取消设置该变量再启动:"
    echo "  unset $culprit && linuxqq"
    echo "或者使用干净的 env 启动:"
    echo "  env -i HOME=\"\$HOME\" USER=\"\$USER\" DISPLAY=\"\$DISPLAY\" \\"
    echo "      XDG_RUNTIME_DIR=\"\$XDG_RUNTIME_DIR\" \\"
    echo "      DBUS_SESSION_BUS_ADDRESS=\"\$DBUS_SESSION_BUS_ADDRESS\" \\"
    echo "      PATH=/usr/bin:/usr/local/bin linuxqq"
else
    echo "未找到具体变量，可能由多个变量组合引起，或不在候选列表中。"
fi
```