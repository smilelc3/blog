---
title: Google BBR 优化算法，实现TCP加速
date: 2018-03-19
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Google%20BBR%20优化算法，实现TCP加速/bbr.jpg)

> 最近，Google 开源了其 TCP BBR 拥塞控制算法，并提交到了 Linux 内核，从 4.9 开始，Linux 内核已经用上了该算法。根据以往的传统，Google 总是先在自家的生产环境上线运用后，才会将代码开源，此次也不例外。
> 根据实地测试，在部署了最新版内核并开启了 TCP BBR 的机器上，网速甚至可以提升好几个数量级。
> 于是我根据目前三大发行版的最新内核，开发了一键安装最新内核并开启 TCP BBR 脚本。

## 本脚本适用环境

- 系统支持：Ubuntu 12+
- 虚拟技术：OpenVZ 以外的，比如 KVM、Xen、VMware 等
- 内存要求：≥128M
- 日期：2018 年 03 月 20 日

## 关于本脚本

1. 本脚本已在 digitalocean 上的 VPS 全部测试通过。
2. 当脚本检测到 VPS 的虚拟方式为 OpenVZ 时，会提示错误，并自动退出安装。
3. 脚本运行完重启发现开不了机的，打开 VPS 后台控制面板的 VNC, 开机卡在 grub 引导, 手动选择内核即可。
4. 由于是使用最新版系统内核，最好请勿在生产环境安装，以免产生不可预测之后果。

## 使用方法

1. 使用root用户登录，运行以下命令：

   ```bash
   wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
   ```

   安装完成后，脚本会提示需要重启 VPS，输入 y 并回车后重启。

2. 重启完成后，进入 VPS，验证一下是否成功安装最新内核并开启 TCP BBR，输入以下命令：

   ```bas
   uname -r
   ```

   查看内核版本，显示为最新版就表示 OK 了

3. 检查点1

   ```bash
   sysctl net.ipv4.tcp_available_congestion_control
   ```

   返回值一般为：

   ```
   net.ipv4.tcp_available_congestion_control = bbr cubic reno
   ```

4. 检查点2

   ```bash
   sysctl net.ipv4.tcp_congestion_control
   ```

   返回值一般为：

   ```bash
   net.ipv4.tcp_congestion_control = bbr
   ```

5. 检查点3

   ```bash
   sysctl net.core.default_qdisc
   ```

   返回值一般为：

   ```bash
   net.core.default_qdisc = fq
   ```

6. 检查点4

   ```bash
   lsmod | grep bbr
   ```

   返回值有 tcp_bbr 模块即说明 bbr 已启动。注意：并不是所有的 VPS 都会有此返回值，若没有也属正常。
