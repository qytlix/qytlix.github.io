---
title: linux电源管理
date: 2026-04-08 11:08:03+08:00
lastmod: 2026-04-08 11:08:03+08:00
draft: false
categories:
- content
- tech
- 技术
tags:
- 21-nei4-he2-yu3-ying4-jian4-jiao1-hu4
- 7-can1-kao3-zi1-liao4
- 23-zhen3-duan4-gong1-ju4-powertop
- guan1-jian4-zhi3-biao1-jie3-du2
- mu4-lu4
- 21-
- he2-xin1-mu4-biao1-shi4-fang4-xing4-neng2-bi4-mian3-guo4-du4-hao4-dian4
- 25-fu3-zhu4-gong1-ju4-brightnessctlacpi-deng3
- 43-zi4-dong4-gua4-qi3-yu3-di1-dian4-liang4-bao3-hu4
- 2-
- 5-
- 43-
- 2-he2-xin1-zu3-jian4-yu3-gong1-ju4
- 6-gao1-ji2-hua4-ti2-nei4-he2-can1-shu4-yu3-ying4-jian4-shen1-du4-you1-hua4
- 25-
- 31-dian4-chi2-mo2-shi4-yan2-chang2-xu4-hang2
- 4-
- 1-
- 3-zui4-jia1-shi2-jian4-dian4-chi2-yu3-ac-dian4-yuan2-chang3-jing3-you1-hua4
- 24-xi4-tong3-ji2-kong4-zhi4-systemd-dian4-yuan2-guan3-li3
- 3-
- 51-dian4-chi2-xu4-hang2-guo4-duan3
- manage
- he2-xin1-gong1-neng2
- 51-
- 62-she4-bei4-shu4-yu3-mo2-kuai4-hei1-ming2-dan1
- pei4-zhi4-wen2-jian4
- 5-chang2-jian4-wen4-ti2-yu3-gu4-zhang4-pai2-chu2
- 7-
- 22-yong4-hu4-kong1-jian1-gong1-ju4-tlp
- an1-zhuang1-yu3-qi3-yong4
- 61-nei4-he2-can1-shu4-tiao2-you1
- 41-tlp-he2-xin1-pei4-zhi4-shi4-li4
- 42-powertop-you1-hua4-shi2-li4
- di1-dian4-liang4-zi4-dong4-xiu1-mian2-bi4-mian3-dian4-chi2-hao4-jin4-guan1-ji1
- 31-
- power
- 32-ac-mo2-shi4-xing4-neng2-yu3-wen3-ding4-xing4-ping2-heng2
- 23-
- 32-ac-
- 52-
- 24-
- 22-
- 4-pei4-zhi4-shi4-li4-cong2-ji1-chu3-dao4-jin4-jie1
- 41-tlp-
- he2-xin1-mu4-biao1-jiang4-di1-gong1-hao4-yan2-chang2-shi3-yong4-shi2-jian1
- 52-gua4-qi3-hui1-fu4-shi1-bai4
- 42-powertop-
- 1-dian4-yuan2-guan3-li3-ji1-chu3-gai4-nian4
- an1-zhuang1-yu3-shi3-yong4
- 53-
- 53-guo4-re4-yu3-feng1-shan4-zao4-yin1
- 6-
---

#power #manage
来源： https://geek-blogs.com/blog/arch-linux-power-management
# Arch Linux 电源管理完全指南：从基础到高级优化

Arch Linux 以其轻量、灵活和高度可定制的特性深受技术爱好者喜爱，但这种灵活性也意味着电源管理（尤其是笔记本电脑等移动设备）通常需要用户手动配置。良好的电源管理不仅能显著延长电池续航，还能减少发热、降低噪音并提升系统稳定性。本文将从基础概念、核心工具、最佳实践、配置示例到故障排除，全面讲解 Arch Linux 电源管理的技术细节，帮助你打造高效、稳定的电源管理方案。

## 目录[#](https://geek-blogs.com/blog/arch-linux-power-management/#mu4-lu4)

1. [电源管理基础概念](https://geek-blogs.com/blog/arch-linux-power-management/#1-%E7%94%B5%E6%BA%90%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5)
2. [核心组件与工具](https://geek-blogs.com/blog/arch-linux-power-management/#2-%E6%A0%B8%E5%BF%83%E7%BB%84%E4%BB%B6%E4%B8%8E%E5%B7%A5%E5%85%B7)
    - 2.1 [内核与硬件交互](https://geek-blogs.com/blog/arch-linux-power-management/#21-%E5%86%85%E6%A0%B8%E4%B8%8E%E7%A1%AC%E4%BB%B6%E4%BA%A4%E4%BA%92)
    - 2.2 [用户空间工具：TLP](https://geek-blogs.com/blog/arch-linux-power-management/#22-%E7%94%A8%E6%88%B7%E7%A9%BA%E9%97%B4%E5%B7%A5%E5%85%B7tlp)
    - 2.3 [诊断工具：Powertop](https://geek-blogs.com/blog/arch-linux-power-management/#23-%E8%AF%8A%E6%96%AD%E5%B7%A5%E5%85%B7powertop)
    - 2.4 [系统级控制：systemd 电源管理](https://geek-blogs.com/blog/arch-linux-power-management/#24-%E7%B3%BB%E7%BB%9F%E7%BA%A7%E6%8E%A7%E5%88%B6systemd-%E7%94%B5%E6%BA%90%E7%AE%A1%E7%90%86)
    - 2.5 [辅助工具：brightnessctl、acpi 等](https://geek-blogs.com/blog/arch-linux-power-management/#25-%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7brightnessctlacpi-%E7%AD%89)
3. [最佳实践：电池与 AC 电源场景优化](https://geek-blogs.com/blog/arch-linux-power-management/#3-%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E7%94%B5%E6%B1%A0%E4%B8%8E-ac-%E7%94%B5%E6%BA%90%E5%9C%BA%E6%99%AF%E4%BC%98%E5%8C%96)
    - 3.1 [电池模式：延长续航](https://geek-blogs.com/blog/arch-linux-power-management/#31-%E7%94%B5%E6%B1%A0%E6%A8%A1%E5%BC%8F%E5%BB%B6%E9%95%BF%E7%BB%AD%E8%88%AA)
    - 3.2 [AC 模式：性能与稳定性平衡](https://geek-blogs.com/blog/arch-linux-power-management/#32-ac-%E6%A8%A1%E5%BC%8F%E6%80%A7%E8%83%BD%E4%B8%8E%E7%A8%B3%E5%AE%9A%E6%80%A7%E5%B9%B3%E8%A1%A1)
4. [配置示例：从基础到进阶](https://geek-blogs.com/blog/arch-linux-power-management/#4-%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B%E4%BB%8E%E5%9F%BA%E7%A1%80%E5%88%B0%E8%BF%9B%E9%98%B6)
    - 4.1 [TLP 核心配置示例](https://geek-blogs.com/blog/arch-linux-power-management/#41-tlp-%E6%A0%B8%E5%BF%83%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)
    - 4.2 [Powertop 优化实例](https://geek-blogs.com/blog/arch-linux-power-management/#42-powertop-%E4%BC%98%E5%8C%96%E5%AE%9E%E4%BE%8B)
    - 4.3 [自动挂起与低电量保护](https://geek-blogs.com/blog/arch-linux-power-management/#43-%E8%87%AA%E5%8A%A8%E6%8C%82%E8%B5%B7%E4%B8%8E%E4%BD%8E%E7%94%B5%E9%87%8F%E4%BF%9D%E6%8A%A4)
5. [常见问题与故障排除](https://geek-blogs.com/blog/arch-linux-power-management/#5-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)
    - 5.1 [电池续航过短](https://geek-blogs.com/blog/arch-linux-power-management/#51-%E7%94%B5%E6%B1%A0%E7%BB%AD%E8%88%AA%E8%BF%87%E7%9F%AD)
    - 5.2 [挂起/恢复失败](https://geek-blogs.com/blog/arch-linux-power-management/#52-%E6%8C%82%E8%B5%B7%E6%81%A2%E5%A4%8D%E5%A4%B1%E8%B4%A5)
    - 5.3 [过热与风扇噪音](https://geek-blogs.com/blog/arch-linux-power-management/#53-%E8%BF%87%E7%83%AD%E4%B8%8E%E9%A3%8E%E6%89%87%E5%99%AA%E9%9F%B3)
6. [高级话题：内核参数与硬件深度优化](https://geek-blogs.com/blog/arch-linux-power-management/#6-%E9%AB%98%E7%BA%A7%E8%AF%9D%E9%A2%98%E5%86%85%E6%A0%B8%E5%8F%82%E6%95%B0%E4%B8%8E%E7%A1%AC%E4%BB%B6%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%8C%96)
7. [参考资料](https://geek-blogs.com/blog/arch-linux-power-management/#7-%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

## 1. 电源管理基础概念[#](https://geek-blogs.com/blog/arch-linux-power-management/#1-dian4-yuan2-guan3-li3-ji1-chu3-gai4-nian4)

在深入工具之前，需先理解 Linux 电源管理的核心概念：

- **电源状态**：系统电源状态分为运行（Active）、挂起（Suspend，S3 模式，传统深度睡眠）、休眠（Hibernate，S4 模式，内存写入磁盘后断电）、混合睡眠（Hybrid Sleep，S3+S4，兼顾快速恢复与数据安全）。现代 Intel 平台还支持 S0ix（Low-Power Idle，低功耗活动状态），但需硬件与固件支持。
    
- **CPU 调控器（Governor）**：控制 CPU 频率动态调整策略，常见模式包括：
    
    - `powersave`：优先降低频率，节省电量；
    - `performance`：维持最高频率，提升性能；
    - `schedutil`（默认）：基于调度器负载动态调整，平衡性能与功耗；
    - `ondemand`/`conservative`：根据负载阈值调整（较旧，逐步被 `schedutil` 取代）。
- **设备功耗**：除 CPU 外，屏幕、Wi-Fi、蓝牙、硬盘/SSD、USB 设备等均为耗电大户，需针对性优化（如降低亮度、禁用闲置设备）。
    

## 2. 核心组件与工具[#](https://geek-blogs.com/blog/arch-linux-power-management/#2-he2-xin1-zu3-jian4-yu3-gong1-ju4)

Arch Linux 电源管理依赖内核模块、用户空间工具与服务的协同。以下是必知工具：

### 2.1 内核与硬件交互[#](https://geek-blogs.com/blog/arch-linux-power-management/#21-nei4-he2-yu3-ying4-jian4-jiao1-hu4)

内核通过以下组件实现电源管理：

- **ACPI 驱动**：Advanced Configuration and Power Interface，负责与主板固件通信，控制电源状态（挂起/恢复）、电池信息读取等。需确保内核启用 `CONFIG_ACPI` 相关选项（Arch 内核默认开启）。
    
- **电源管理模块**：如 `intel_pstate`（Intel CPU 专用调频模块）、`amd_pstate`（AMD CPU，需内核 5.17+）、`i915`（Intel 核显电源管理）、`radeon`/`amdgpu`（AMD 显卡）等。可通过 `lsmod | grep pstate` 检查 CPU 调频模块是否加载。
    
- **节能选项**：内核参数如 `intel_idle.max_cstate=5`（限制 CPU 深度休眠状态，部分设备需调整以解决挂起问题）、`mem_sleep_default=deep`（强制使用 S3 深度挂起而非 S0ix）。
    

### 2.2 用户空间工具：TLP[#](https://geek-blogs.com/blog/arch-linux-power-management/#22-yong4-hu4-kong1-jian1-gong1-ju4-tlp)

**TLP**（TLP - Linux Advanced Power Management）是最流行的电源管理工具，通过后台服c务自动调整系统参数（CPU 频率、硬盘休眠、Wi-Fi 功耗等），无需用户干预。

#### 安装与启用：[#](https://geek-blogs.com/blog/arch-linux-power-management/#an1-zhuang1-yu3-qi3-yong4)

```
# 安装 TLP
sudo pacman -S tlp tlp-rdw  # tlp-rdw 用于无线电设备（Wi-Fi/蓝牙）管理
 
# 启用并启动服务
sudo systemctl enable --now tlp.service
# 若使用 ThinkPad，还需安装额外固件
sudo pacman -S tp_smapi-dkms acpi_call-dkms  # 支持电池阈值、风扇控制等 ThinkPad 特有功能
```

#### 核心功能：[#](https://geek-blogs.com/blog/arch-linux-power-management/#he2-xin1-gong1-neng2)

- 自动区分电池/AC 模式，应用不同配置；
- 控制 CPU 调控器、频率范围、涡轮增压（Turbo Boost）；
- 硬盘/SSD 高级电源管理（APM/ATA 命令）；
- 无线电设备（Wi-Fi/蓝牙）自动关闭（仅电池模式）；
- 电池保护（设置充电阈值，如 ThinkPad 充电至 80% 以延长电池寿命）。

#### 配置文件：[#](https://geek-blogs.com/blog/arch-linux-power-management/#pei4-zhi4-wen2-jian4)

主配置文件为 `/etc/tlp.conf`，修改后需重启服务生效：`sudo systemctl restart tlp`。

### 2.3 诊断工具：Powertop[#](https://geek-blogs.com/blog/arch-linux-power-management/#23-zhen3-duan4-gong1-ju4-powertop)

**Powertop** 是 Intel 开发的功耗诊断工具，可实时显示系统功耗、设备唤醒频率、进程耗电排行，帮助定位耗电异常。

#### 安装与使用：[#](https://geek-blogs.com/blog/arch-linux-power-management/#an1-zhuang1-yu3-shi3-yong4)

```
sudo pacman -S powertop
 
# 首次运行需校准（需电池供电，耗时约 20 分钟，期间系统会自动挂起/恢复）
sudo powertop --calibrate
 
# 启动交互式界面
sudo powertop
```

#### 关键指标解读：[#](https://geek-blogs.com/blog/arch-linux-power-management/#guan1-jian4-zhi3-biao1-jie3-du2)

- **Power usage**：实时功耗（单位：W），电池模式下应低于 10W（视设备而定）；
- **Wakeups per second**：每秒唤醒次数（越低越好，理想值 < 100），高唤醒通常由频繁活动的进程（如后台服务、定时器）导致；
- **Device stats**：设备功耗排行，可识别耗电异常设备（如 Wi-Fi 持续高功耗可能是驱动问题）；
- **Tunables**：可优化项（如 `Bad` 状态表示可调整为更省电的设置，按 `Enter` 应用临时优化）。

### 2.4 系统级控制：systemd 电源管理[#](https://geek-blogs.com/blog/arch-linux-power-management/#24-xi4-tong3-ji2-kong4-zhi4-systemd-dian4-yuan2-guan3-li3)

systemd 提供基础电源状态控制命令，无需额外工具：

```
# 挂起（S3）
systemctl suspend
 
# 休眠（S4，需配置交换分区/文件，见 Arch Wiki）
systemctl hibernate
 
# 混合睡眠
systemctl hybrid-sleep
 
# 锁定屏幕并挂起（结合屏幕锁工具，如 i3lock）
i3lock -c 000000 && systemctl suspend
```

配置自动挂起（如闲置 10 分钟后挂起）：  
编辑 `/etc/systemd/logind.conf`，修改以下参数：

```
IdleAction=suspend  # 闲置动作：挂起
IdleActionSec=10min  # 闲置时间阈值
```

重启 `systemd-logind` 服务生效：`sudo systemctl restart systemd-logind`。

### 2.5 辅助工具：brightnessctl、acpi 等[#](https://geek-blogs.com/blog/arch-linux-power-management/#25-fu3-zhu4-gong1-ju4-brightnessctlacpi-deng3)

- **屏幕亮度控制**：`brightnessctl`（通用）、`xbacklight`（X11）、`wl-brightness`（Wayland）：
    
    ```
    sudo pacman -S brightnessctl
    brightnessctl set 50%  # 设置亮度为 50%
    brightnessctl set +10%  # 增加 10% 亮度
    ```
    
- **电池信息查询**：`acpi`（显示电池电量、状态、温度）：
    
    ```
    sudo pacman -S acpi
    acpi -b  # 电池状态：Battery 0: Discharging, 75%, 01:23:45 remaining
    acpi -t  # 温度：Thermal 0: ok, 45.0 degrees C
    ```
    
- **硬盘电源管理**：`hdparm`（控制硬盘休眠）：
    
    ```
    sudo hdparm -S 24 /dev/sda  # 设置硬盘 2 分钟（24*5=120 秒）无操作后休眠
    ```
    

## 3. 最佳实践：电池与 AC 电源场景优化[#](https://geek-blogs.com/blog/arch-linux-power-management/#3-zui4-jia1-shi2-jian4-dian4-chi2-yu3-ac-dian4-yuan2-chang3-jing3-you1-hua4)

根据电源类型（电池/AC）制定不同策略：

### 3.1 电池模式：延长续航[#](https://geek-blogs.com/blog/arch-linux-power-management/#31-dian4-chi2-mo2-shi4-yan2-chang2-xu4-hang2)

#### 核心目标：降低功耗，延长使用时间[#](https://geek-blogs.com/blog/arch-linux-power-management/#he2-xin1-mu4-biao1-jiang4-di1-gong1-hao4-yan2-chang2-shi3-yong4-shi2-jian1)

1. **启用 TLP 电池配置**：  
    在 `/etc/tlp.conf` 中确保电池模式参数：
    
    ```
    TLP_DEFAULT_MODE=BAT  # 默认模式：电池（插电时自动切换为 AC）
    CPU_SCALING_GOVERNOR_ON_BAT=schedutil  # 电池模式 CPU 调控器（平衡）
    # 或进一步保守：CPU_SCALING_GOVERNOR_ON_BAT=powersave
    MAX_LOST_WORK_SECS_ON_BAT=15  # 允许 15 秒数据丢失风险以换取低延迟挂起
    ```
    
2. **降低屏幕亮度**：  
    目标亮度 30-50%（环境光允许时），可绑定快捷键（如 i3wm 中 `bindsym XF86MonBrightnessDown exec brightnessctl set 10%-`）。
    
3. **关闭闲置设备**：  
    通过 TLP 自动禁用闲置无线电设备：
    
    ```
    RADIO_WIFI_ON_BAT=auto  # 电池模式下 Wi-Fi 闲置时关闭
    RADIO_BT_ON_BAT=auto  # 蓝牙同理
    ```
    
    手动关闭：`nmcli radio wifi off`（Wi-Fi）、`bluetoothctl power off`（蓝牙）。
    
4. **限制后台进程**：  
    关闭不必要的服务（如 `cups` 打印机服务、`docker` 容器），使用 `powertop` 识别高唤醒进程（如 `systemd-journald` 日志过频繁，可降低日志级别至 `info`）。
    
5. **禁用 Turbo Boost**：  
    英特尔 Turbo Boost 可临时提升 CPU 频率，但耗电显著。电池模式下可禁用：
    
    ```
    CPU_BOOST_ON_BAT=0  # 0=禁用，1=启用
    ```
    

### 3.2 AC 模式：性能与稳定性平衡[#](https://geek-blogs.com/blog/arch-linux-power-management/#32-ac-mo2-shi4-xing4-neng2-yu3-wen3-ding4-xing4-ping2-heng2)

#### 核心目标：释放性能，避免过度耗电[#](https://geek-blogs.com/blog/arch-linux-power-management/#he2-xin1-mu4-biao1-shi4-fang4-xing4-neng2-bi4-mian3-guo4-du4-hao4-dian4)

1. **TLP AC 配置**：
    
    ```
    CPU_SCALING_GOVERNOR_ON_AC=schedutil  # 或 performance（高性能需求）
    CPU_BOOST_ON_AC=1  # 启用 Turbo Boost
    DISK_APM_LEVEL_ON_AC=254  # 硬盘最高性能（无休眠）
    ```
    
2. **电池保护（长期插电场景）**：  
    若设备长期插电，设置电池充电阈值以减少循环损耗（需硬件支持，如 ThinkPad、戴尔 XPS）：
    
    ```
    # ThinkPad 示例：充电至 80% 停止，低于 70% 开始充电
    START_CHARGE_THRESH_BAT0=70
    STOP_CHARGE_THRESH_BAT0=80
    ```
    
    非 ThinkPad 设备可尝试 `battery-care-utils` 或内核模块 `lenovo-laptop`（视品牌而定）。
    
3. **散热优化**：  
    AC 模式下 CPU 性能释放可能导致发热，可通过 `thermald`（温度守护进程）自动控制风扇与频率：
    
    ```
    sudo pacman -S thermald
    sudo systemctl enable --now thermald
    ```
    

## 4. 配置示例：从基础到进阶[#](https://geek-blogs.com/blog/arch-linux-power-management/#4-pei4-zhi4-shi4-li4-cong2-ji1-chu3-dao4-jin4-jie1)

### 4.1 TLP 核心配置示例[#](https://geek-blogs.com/blog/arch-linux-power-management/#41-tlp-he2-xin1-pei4-zhi4-shi4-li4)

以下是 `/etc/tlp.conf` 的实用配置（取消注释并修改）：

```
# 基本设置
TLP_ENABLE=1
TLP_DEFAULT_MODE=BAT
TLP_PERSISTENT_DEFAULT=0  # 仅当前会话生效，避免修改固件设置
 
# CPU 配置
CPU_SCALING_GOVERNOR_ON_AC=schedutil
CPU_SCALING_GOVERNOR_ON_BAT=powersave
CPU_MIN_PERF_ON_AC=0%
CPU_MAX_PERF_ON_AC=100%
CPU_MIN_PERF_ON_BAT=0%
CPU_MAX_PERF_ON_BAT=70%  # 电池模式限制最高性能为 70%
CPU_BOOST_ON_AC=1
CPU_BOOST_ON_BAT=0
 
# 电池保护（ThinkPad）
START_CHARGE_THRESH_BAT0=60
STOP_CHARGE_THRESH_BAT0=80
 
# 无线电设备
RADIO_WIFI_ON_AC=on
RADIO_WIFI_ON_BAT=auto
RADIO_BT_ON_AC=on
RADIO_BT_ON_BAT=off  # 电池模式强制关闭蓝牙
 
# 硬盘/SSD
DISK_IDLE_SECS_ON_AC=0  # AC 模式不休眠
DISK_IDLE_SECS_ON_BAT=2  # 电池模式 2 秒无操作休眠
```

重启 TLP 生效：`sudo systemctl restart tlp`。

### 4.2 Powertop 优化实例[#](https://geek-blogs.com/blog/arch-linux-power-management/#42-powertop-you1-hua4-shi2-li4)

1. **生成持久化优化配置**：  
    Powertop 可将“Tunables”中的优化项保存为系统服务，开机自动应用：
    
    ```
    sudo powertop --auto-tune  # 临时应用所有优化
    # 生成持久化配置
    sudo powertop --html=powertop-report.html  # 导出报告（可选）
    sudo tee /etc/systemd/system/powertop.service <<EOF
    [Unit]
    Description=Powertop auto-tune
     
    [Service]
    Type=oneshot
    ExecStart=/usr/bin/powertop --auto-tune
     
    [Install]
    WantedBy=multi-user.target
    EOF
    sudo systemctl enable --now powertop.service
    ```
    
2. **解读报告优化高耗电项**：  
    若 Powertop 显示“Wakeups per second” > 200，检查“Processes”栏，例如 `chrome` 进程频繁唤醒，可关闭 Chrome 后台刷新或安装 `chrome-extension-power-saver`。
    

### 4.3 自动挂起与低电量保护[#](https://geek-blogs.com/blog/arch-linux-power-management/#43-zi4-dong4-gua4-qi3-yu3-di1-dian4-liang4-bao3-hu4)

#### 低电量自动休眠（避免电池耗尽关机）：[#](https://geek-blogs.com/blog/arch-linux-power-management/#di1-dian4-liang4-zi4-dong4-xiu1-mian2-bi4-mian3-dian4-chi2-hao4-jin4-guan1-ji1)

1. 使用 `acpi_listen` 监控电池事件，结合脚本触发休眠：
    
    ```
    # 安装依赖
    sudo pacman -S acpid  # ACPI 事件守护进程
    sudo systemctl enable --now acpid
     
    # 创建事件处理脚本
    sudo tee /etc/acpi/actions/lowbattery.sh <<EOF
    #!/bin/bash
    battery_level=\$(acpi -b | grep -P -o '[0-9]+(?=%)')
    if [ "\$battery_level" -le 5 ] && [ "\$(acpi -b | grep -c 'Discharging')" -eq 1 ]; then
        logger "Battery level \$battery_level%: Hibernating..."
        systemctl hibernate
    fi
    EOF
    sudo chmod +x /etc/acpi/actions/lowbattery.sh
     
    # 关联事件（电池电量变化时触发）
    sudo tee /etc/acpi/events/lowbattery <<EOF
    event=button/battery.*
    action=/etc/acpi/actions/lowbattery.sh
    EOF
    sudo systemctl restart acpid
    ```
    

## 5. 常见问题与故障排除[#](https://geek-blogs.com/blog/arch-linux-power-management/#5-chang2-jian4-wen4-ti2-yu3-gu4-zhang4-pai2-chu2)

### 5.1 电池续航过短[#](https://geek-blogs.com/blog/arch-linux-power-management/#51-dian4-chi2-xu4-hang2-guo4-duan3)

- **排查步骤**：
    
    1. 运行 `sudo powertop`，检查“Power usage”是否 > 15W（普通笔记本正常范围 5-10W）；
    2. 查看“Tunables”栏，将 `Bad` 项全部优化为 `Good`；
    3. 检查“Processes”栏，结束高唤醒进程（如 `rsyslogd` 日志过频，可编辑 `/etc/rsyslog.conf` 降低日志级别）；
    4. 确认 TLP 配置是否生效：`sudo tlp-stat | grep "CPU scaling governor"`，确保电池模式为 `powersave` 或 `schedutil`。
- **硬件问题**：若续航突然下降，可能是电池老化（`acpi -b` 显示“Battery 0: Unknown, 0%”或容量骤降），需更换电池。
    

### 5.2 挂起/恢复失败[#](https://geek-blogs.com/blog/arch-linux-power-management/#52-gua4-qi3-hui1-fu4-shi1-bai4)

- **症状**：挂起后黑屏无法唤醒、恢复后键盘/触摸板无响应。
- **解决思路**：
    1. 检查内核日志：`journalctl -b -1 | grep suspend`（查看上一次启动的挂起日志），常见错误如“PM: suspend failed”；
    2. 尝试修改内核参数（`/etc/default/grub` 中 `GRUB_CMDLINE_LINUX_DEFAULT` 添加）：
        - Intel 显卡：`i915.enable_dc=0`（禁用显示控制器深度节能）；
        - 通用：`mem_sleep_default=deep`（强制 S3 深度挂起，而非 S0ix）；
        - 重新生成 grub 配置：`sudo grub-mkconfig -o /boot/grub/grub.cfg`；
    3. 更新 BIOS/UEFI 固件（厂商官网下载，通过 `fwupd` 工具更新：`sudo pacman -S fwupd && sudo fwupdmgr update`）。

### 5.3 过热与风扇噪音[#](https://geek-blogs.com/blog/arch-linux-power-management/#53-guo4-re4-yu3-feng1-shan4-zao4-yin1)

- **排查**：
    1. 检查 CPU 占用：`top` 或 `htop`，结束异常进程（如僵尸进程、无限循环脚本）；
    2. 检查散热模块：清理风扇灰尘，更换硅脂（硬件维护）；
    3. 软件控制：安装 `lm_sensors` 监控温度，`fancontrol` 手动调节风扇转速：
        
        ```
        sudo pacman -S lm_sensors fancontrol
        sudo sensors-detect  # 检测传感器（一路回车默认）
        sudo pwmconfig  # 配置风扇控制规则（按提示操作）
        sudo systemctl enable --now fancontrol
        ```
        

## 6. 高级话题：内核参数与硬件深度优化[#](https://geek-blogs.com/blog/arch-linux-power-management/#6-gao1-ji2-hua4-ti2-nei4-he2-can1-shu4-yu3-ying4-jian4-shen1-du4-you1-hua4)

### 6.1 内核参数调优[#](https://geek-blogs.com/blog/arch-linux-power-management/#61-nei4-he2-can1-shu4-tiao2-you1)

- **Intel 平台节能**：启用 `intel_pstate` 主动模式（更精细的频率控制）：
    
    ```
    # /etc/default/grub 中添加
    GRUB_CMDLINE_LINUX_DEFAULT="intel_pstate=active"
    ```
    
- **内存省电**：启用内存压缩（`zswap`）与低功耗模式：
    
    ```
    GRUB_CMDLINE_LINUX_DEFAULT="zswap.enabled=1 mem_sleep_default=deep"
    ```
    

### 6.2 设备树与模块黑名单[#](https://geek-blogs.com/blog/arch-linux-power-management/#62-she4-bei4-shu4-yu3-mo2-kuai4-hei1-ming2-dan1)

- 禁用未使用的硬件模块（如读卡器、红外摄像头）：
    
    ```
    # 查看已加载模块：lsmod | grep firewire（火线接口，现代设备多无需）
    sudo tee /etc/modprobe.d/blacklist.conf <<EOF
    blacklist firewire_core  # 禁用火线接口
    blacklist snd_hda_intel  # 若无需声卡（仅服务器场景）
    EOF
    ```
    

## 7. 参考资料[#](https://geek-blogs.com/blog/arch-linux-power-management/#7-can1-kao3-zi1-liao4)

- [Arch Wiki: Power Management](https://wiki.archlinux.org/title/Power_management)（权威文档，涵盖所有工具与场景）
- [TLP 官方文档](https://linrunner.de/tlp/)（配置详解与硬件兼容性列表）
- [Powertop 手册](https://www.kernel.org/doc/html/latest/admin-guide/pm/powertop.html)（内核官方指南）
- [Intel 电源管理技术白皮书](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-s0ix-low-power-idle.html)（S0ix 低功耗状态详解）
- [Linux 内核电源管理参数](https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html)（内核参数官方说明）

通过本文的工具与实践，你可根据设备特性定制 Arch Linux 电源管理方案，兼顾续航、性能与稳定性。电源管理是一个持续优化的过程，建议定期使用 `powertop` 与 `tlp-stat` 检查系统状态，结合硬件更新（如 BIOS）与内核升级（Arch 滚动更新优势），逐步完善配置。