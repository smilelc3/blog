---
title: Android-Nougat(7.1.1)的原生体验
date: 2017-06-23
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Android-Nougat(7.1.1)的原生体验/marlin-black-en_US-1.jpg)

本人常用Mi5s,伴随着MIUI9（7.0）内测，实在等不急官网放MIUI的包（其实是不想使用MIUI，设计风格跟原生差异太大）。

这几天就靠着以前的所积累的刷机经验，并且刷上刚适配的lineage os (CM14.1)，以此为基础，替换AOSP（*Android Open-Source Project*）编码的应用。

再加 上*pixel launcher* 谷歌“**亲儿子**”的美化和*Nougat*的优化，对原生的安卓顿生好感。

当然，刷机过程也是比较曲折的，但总算没有白费精力，为了以后类似操作便捷，特地记录一下。

#  Step1: 小米官网解锁fastboot

​    小米自从mi4后，为了增强安全性（防止大家乱刷机），至底层加入bl锁，导致刷入第一步需解锁，但刷机有风险，一旦解锁，就失去保修机会，且修改不可逆，小米会将设备解锁信息在服务器上保存，谨慎操作！

* 解锁网址：[http://www.miui.com/unlock/index.html](http://http//www.miui.com/unlock/index.html)
* 解锁步骤：[https://jingyan.baidu.com/article/29697b9103205dab20de3c33.html](http://https//jingyan.baidu.com/article/29697b9103205dab20de3c33.html)

# Step2:  adb刷入第三方recovery(TWRP)

1. 去<https://twrp.me/>下载最新的TWRP(我当时最新版本3.1.1.0)，为之后刷第三方系统做准备，并用adb(Android Debug Bridge)工具包刷入TWRP

ADB下载地址：<http://adbshell.com/downloads> 选择ADB Kits

2. 手机关机进入fastboot模式（音量键下+电源键），USB连接电脑，装上驱动（用官方驱动或者第三方驱动安装软件）

powershell 刷入命令

```powershell
 .\fastboot flash recovery XXX.img
```

* XXX.img代表TWRP所下载的文件名

3. 最后输入命令重启，再关机，按住 音量键上+电源键 进入recovery模式

```powershell
.\fastboot reboot
```

# Setp3: 刷入lineage os(with root)

去*lineage os*官网下载*rom*包和*root*包，在*recovery*模式下，用*TWRP*依次刷入两个包

网址：https://download.lineageos.org/

**注意：根据设备cpu类型选择root包（我的是arm64,安卓7.1）**

# Step4: 刷入openGapps（aroma）

 网址：<http://opengapps.org/>

 根据设备类型选择包

- **aroma ：** 图形化安装版本，可以自定义所需刷入的应用。（但有些机型会由于recovery的原因无法使用）。

- **super ：**最为完备的版本，该有的和不该有的都有了（比如日语输入法、注音输入法、等大陆用户基本上不会需要的应用）

- **stock** ：包括 nexus 出厂所具备的所有应用，在安装好 CM 、魔趣等系统后，刷入该包会自动替换掉 Aosp 的应用 ，比如 Google 相机、Gmail、Google Now 桌面、Google 相册分别替换掉 Aosp所带的 相机、 邮件、桌面、相册等，当然 Google全家桶的其他软件如 Gooele Play、Youtube、地图、Gooele keep等也会随之刷入你手机。

- **full ：**与 stock 唯一区别就在于不会替换掉 Aosp 应用。

- **mini、micro、nano、pico** **：**依次减少应用，但都具备 Google service 和 Play 

推荐**nano**包，但下载时需要一个稳定的梯子，建议用chrome直接下载，最后用TWRP刷入既可。

# Step5:  精简部分不需要系统应用+修改hosts

该布操作最简单，但比较繁琐，用*root*删除掉内置的一些不需要使用的*google*应用，比如其他语言输入法，删除完后重启手机一次。

用*go hosts APP*替换掉原始*hosts*，使设备能直接访问谷歌（该操作并不完美，但可以用做备用）

# Step6: 刷入Magisk框架并接入viperfx音效

因为手机并不自带音效改善软件，且不带HIFI模块的手机插手机的音效很差，所以这里刷入现在口碑最好的*viperfx*音效，但直接刷入时会存在*I/O*报错，*root*报错等原因，所以这里借助*Magisk*框架修改系统API接口实现同等功能

Magisk 下载网址：<https://forum.xda-developers.com/apps/magisk/official-magisk-v7-universal-systemless-t3473445>

1. 先TWRP刷入[Magisk](http://tiny.cc/latestmanager) ；
2. 再开机安装[Magisk Manager](http://tiny.cc/latestmanager) apk；
3. 最后在magisk中安装viperfx即可。

**最终效果图**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Android-Nougat(7.1.1)的原生体验/Screenshot_20170622-234628-1.png)