---
title: 家庭网络拓扑及IPTV单线复用方案
date: 2023-11-20
---


# 家庭网络拓扑及IPTV单线复用方案

搬新家快接近一年了，家里网络布局经过多轮设备更替和演进，总算稳定下来。主要介绍下当前网络的拓扑结构，以及如何利用弱电箱到客厅的一根网线，实现既可以上网，又可以看 IPTV。

## 家庭网络拓扑介绍

### 需求分析

1. 网络套餐为千兆，为保证 WIFI 信号质量不成为带宽的约束，且确保智能家居的接入稳定，**需每个房间放置无线接入点**；
2. 家庭接入设备量大，存在更多网络需求，需**软路由**进行拨号、DHCP、DNS等功能；
3. **弱点箱到客厅仅预埋一根网线**，需支持上网和IPTV两个功能；
4. 尽可能利用当前预埋线，**不另走明线**破坏装修。

### 实现方案

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/家庭网络拓扑及IPTV单线复用方案/绘图.png "网络拓扑图")

整体网络拓扑大致由 `光猫 —— 路由 —— 二层交换机 —— AP —— 接入设备` 组成，呈现 **树状结构**，避免网络环路导致的网络风暴。

特点如下：

1. **光猫 Internet 网口修改为桥接**，仅作光电调制解调（modem）功能；
2. **软路由和光猫同放弱电箱**，软路由作为家庭网络中枢，实现以下功能：
    * 拨号上网，且多播实现宽带叠加；
    * 网关，同时存在一般网关和科学上网网关；
    * DNS 服务，实现去广告和加速功能；
    * DHCP 服务，根据设备 mac 分配分配上述功能，且带IPv6；
3. **增配网管型交换机实现 VLAN 划分，分离 IPTV 线路**，同时增加网口供更多设备使用；
4. **多台无线路由器组Mesh**，保证全屋 WIFI 覆盖，取消 DHCP 服务，当作 AP(*Access Point*) 使用；
5. **搭建服务器**，提供 NAS 存储服务供家庭数据存储，提供虚拟机服务供开发。

## 利用 VLAN 实现单线复用接入 IPTV

因为 IPTV 的特殊性，最佳是光猫 IPTV 接口走单独网线直达机顶盒，避免和家庭网络的 Internet 存在冲突。
实际上因为弱电箱到客厅预埋线仅一根，必须实现单线复用，且做好区分，才能保证两者独立工作正常，解决方案就是 **划分 VLAN**。

> VLAN（Virtual Local Area Network）即虚拟局域网，是将一个物理的LAN在逻辑上划分成多个广播域的通信技术。
> 每个VLAN是一个广播域，VLAN内的主机间可以直接通信，而VLAN间则不能直接互通。这样，广播报文就被限制在一个VLAN内。

具体流程如下：

### 1. 光猫 IPTV 端口带上 VLAN 标签(tag)

**我的目标是让 IPTV 端口出来的数据全部带上 VLAN 标签接入局域网，进而也因为 tag 标签避免对其他设备影响。**
光猫一般用户是无权配置 VLAN 的，因此找宽带供应商工程师拿到光猫超级管理员账号（telecomadmin）和密码。在 `网络 —— 网络设置 —— VLAN绑定` 中新增配置，指定 iTV 端口的 `3_OTHER_B_VID_43`( WAN 侧服务名)绑定用户侧 VLAN，VLAN ID 我改为43。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/家庭网络拓扑及IPTV单线复用方案/1.png)

配置过后，光猫 IPTV 出来的原始数据都会带上 VLAN 43 tag 的标签，也会接受相同 tag 的数据帧，并在内部去除 tag。
将光猫 IPTV 端口接入到软路由中，这样弱电箱到客厅单根网线上，就同时有 **正常Internet + IPTV(tag)** 两种数据。

### 2. 网管交换机指定端口解 VLAN 标签(untag)

**接下来目标是客厅的交换机指定端口解 VLAN 标签，让 IPTV 数据走该端口，其他数据摒弃。**

交换机物理上1口是接入单线复用，4口上连接机顶盒。进入交换机后台，创建一个名为 IPTV 的  VLAN 配置，VLAN ID 为43：

* 4口选择“不带标签”，这样4口发出的数据帧是具有标签的将会去除标签，进来的数据将会在交换机内部加上标签；
* 1口选择“带标签”，交换机中属于该 VLAN 的数据发出1口时会带上标签，其他正常数据也会流转;
* 其他端口选择“非成员”，相当于不敢感知 VLAN 数据。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/家庭网络拓扑及IPTV单线复用方案/2.png)

同时配置 VLAN PVID，让4口仅接受来自机顶盒未打标签的数据帧，当未打标签的数据进入交换机时，将会以 PVID(43) 打上标签，避免机顶盒可能发出 VLAN 数据对链路的影响。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/家庭网络拓扑及IPTV单线复用方案/3.png)

如上两步配置，实现基于 VLAN 的单线复用。
