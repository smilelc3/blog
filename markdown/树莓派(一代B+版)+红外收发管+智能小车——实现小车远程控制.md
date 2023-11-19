---
title: 树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制
date: 2017-07-01
---

前段时间的，新生工程体验课上，两人一组，靠厂家提供的元器件和烧录代码，焊接了了一台智能小车。

最进，碰巧手头有空闲的一块树莓派，本来打算用树莓派去实现远程控制空调，但发现空调的红外编码带有逻辑控制，只能退而求其次，试试远程控制小车，大体框架结构如图。

---

2017-07-03更新，已经实现对空调类带逻辑编码设备的简单控制。

---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/unnamed-file%20[原始大小].jpg)

# 烧录系统

几乎所有的新手教程都使用[Win32DiskImager](https://sourceforge.net/projects/win32diskimager/)作为系统安装工具——中文的、英文的、官方的、eLinux wiki的，不一而足。
但是这个工具不支持中文目录名（文件或目录有中文，会出现123错误），不支持压缩，必须先插好SD卡，再开软件。
而[USB Image Tool](https://www.techspot.com/downloads/6355-usb-image-tool.html)，就是Win32DiskImager的一个更方便的替代品。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/20130831204912500-0-1.jpg)

## 写SD卡：直接读取zip压缩包

USB Image Tool可以直读.zip压缩包。网上下载的zip格式系统镜像，下完直接可以烧录。
点击**Restore**，选择.zip文件即可。注意打开对话框中默认看不到.zip文件，在“文件类型”处选择“**All Files (*.*)**”即可。

##  SSH无法连接问题

自从2016年11月开始，树莓派官方推荐 [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) 系统镜像关闭了默认*ssh*连接，重新开启也很简单，把SD卡拔下来，进入到根目录，新建一个名为*ssh*的空白文件(无后缀)就可以。

好了然后再把卡插回树莓派，就可以使用SSH了。

* 初始用户名：**pi**
* 初始密码：**raspberry**

# 将红外接受管和发射管连接至树莓派GPIO接口

**材料：**

红外接受管（3pin），红外接受管（2pin）,杜邦线若干。

根据不同树莓派版本，查看GPIO的引线图，该实验采用B+版，具体实物对应图和**GPIO**与pin对应图如下图：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/6619373360026755635-1.jpg)

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/c259e358ccbf6c813fdb4c76bb3eb13531fa409f-1.png)

## 硬件连接

**红外接收器** 

* vcc 连 pin1 (3.3v)

* gnd 连 pin6(ground)

* data 连 pin12(gpio18)

**红外发射器**

* gnd 连 pin25(ground)

* data 连 pin11(gpio17)

**红外接受器规格见图，左引脚为data，中为接地，右为3.3V供电**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/20120921154663386338-1.jpg)

**红外发射器规格见图，长脚为data,短脚为接地**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/201453125427363-1.jpg)

接收器和发射器通过杜邦线跟树莓派相连，最后的连接实物图

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/20170701222333.jpg)

# 预先解析控制码

## 修改 raspbian 仓库默认源

1. 修改apt源

```bash
sudo nano /etc/apt/sources.list
```

  例如使用大连东软信息学院软件源镜像，修改之后的内容如下：

```bash
deb http://mirrors.aliyun.com/raspbian/raspbian jessie main contrib non-free rpi
```

其他可用源如下：

* 中国科学技术大学
  Raspbian <http://mirrors.ustc.edu.cn/raspbian/raspbian/>

* 阿里云
  Raspbian <http://mirrors.aliyun.com/raspbian/raspbian/>

* 清华大学
  Raspbian <http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/>

* 华中科技大学
  Raspbian <http://mirrors.hustunique.com/raspbian/raspbian/>
  Arch Linux ARM <http://mirrors.hustunique.com/archlinuxarm/>

* 华南农业大学（华南用户）
  Raspbian <http://mirrors.scau.edu.cn/raspbian/>

* 大连东软信息学院源（北方用户）
  Raspbian <http://mirrors.neusoft.edu.cn/raspbian/raspbian/>

* 重庆大学源（中西部用户）

  Raspbian <http://mirrors.cqu.edu.cn/Raspbian/raspbian/>

2. 更新软件源和软件

```bash
# 更新软件源
sudo apt-get update
# 更新软件
sudo apt-get upgrade
```

## 更换vi文本编译器为vim

因为vi在insert模式下，方向键会变为ABCD，故用vim进行替换

```bash
#卸载vi
sudo apt-get remove vi-common
#安装vim
sudo apt-get install -y vim
```

## 安装lirc

LIRC (*Linux Infrared remote control*)是一个linux系统下开源的软件包。这个软件可以让Linux系统接收及发送红外线信号。

```bash
sudo apt-get install lirc
```

**配置硬件**

```bash
# sudo vim /boot/config.txt #在文件结尾添加
# 修改一下内容
dtoverlay=lirc-rpi
gpio_in_pin=18
gpio_out_pin=17

# sudo vim /etc/lirc/hardware.conf  #编辑LRIC的配置文件
# 修改以下内容
LIRCD_ARGS="--uinput"
DRIVER="default"
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"

# 重启生效
sudo /etc/init.d/lirc restart
```

**注意：**配置gpio_in_pin和gpio_out_pin时，编号为GPIO号，并非pin号 

**启动测试**

```bash
sudo mode2 -d /dev/lirc0
```

红外接收器已经打开，处于监听状态。这个时候，利用任何红外发射器（可以是电视遥控器或其他遥控器）对红外接收模块按任意按钮，就可以在树莓派终端上看到类似如下的代码

看到这个代码便证明红外接收模块是正常工作的。

如果没有看到，请检查你的接线、电压、以及通过**lsusb**查看是否加载了相应模块。

```
pulse 1681
space 4816
pulse 1695
space 4784
pulse 1333
space 3638
```

## 录制解析控制码

1. 开始录制

```bash
irrecord -d /dev/lirc0 ~/lircd.conf #按照提示操作即可,录制完后会让你输入按键名
```

2. 查看可用键名列表

```bash
irrecord --list-namespace
```

3. 将已录制的编码加载进 *lirc* 配置参数

```bash
sudo cp ~/lircd.conf /etc/lirc/lircd.conf
```

# 通过树莓派发射红外编码

1. 启动lircd服务

```bash
sudo lircd -d /dev/lirc0
```

2. 查看录制好可以使用的键名

```bash
irsend LIST /home/pi/lircd.conf ""
```

3. 发送红外编码

```bash
irsend SEND_ONCE /home/pi/lircd.conf KEY_XXX
```

**演示效果**

<video src="https://raw.githubusercontent.com/smilelc3/blog/main/images/树莓派(一代B+版)+红外收发管+智能小车——实现小车远程控制/VID_20170701_211221_1-1.mp4" controls preload="metadata"></video>

---

**关于录制带逻辑编码的红外编码**

一个比较令人兴奋的消息，谢谢博客<http://blog.just4fun.site/raspberrypi-lirc.html>的帮助，直接发送raw原始码就可以实现简单的控制程序。😘

**注意：**其只能使用raw原始码，记录是通过mode2命令实现。

1. 制作模版（不设置按键，初始化玩直接跳过）

```bash
sudo /etc/init.d/lirc restart
irrecord  -f -d /dev/lirc0 ~/lircd.conf
```

2. 录制需要实现的按键

```bash
mode2  -d /dev/lirc0 > /tmp/temp.code  
cat /tmp/temp.code | sed -n '2,$p' | grep -o  -E "[0-9]+" | xargs echo  # 移除第一行,之后把所有数字取出

# 把上述指令写入 ~/lircd.conf 的 KEY_OPEN里
# 值得注意的是 ~/lircd.conf文件里的空格十分重要

sudo cp ~/lircd.conf /etc/lirc/lircd.conf
sudo /etc/init.d/lirc restart
# irsend LIST /home/pi/lircd.conf "" #列出指令
```

3. 最后一个参考格式的***lircd.conf***文件（保证空格正确）

```bash
begin remote

  name  /home/pi/lircd.conf
  flags RAW_CODES
  eps            30
  aeps          100

  gap          8015

      begin raw_codes

          name KEY_POWER
               8927 4522 531 1711 551 1706 559 598 549 599 551 600 551 598 551 597 552 1719 558 597 549 1715 549 1724 540 614 535 592 559 597 550 599 551 610 551 602 549 598 553 1706 558 598 549 601 549 599 550 601 548 614 551 593 557 1717 545 598 551 598 552 598 552 599 549 598 553 1720 556 597 563 589 549 600 549 601 549 607 545 593 555 599 551 614 548 598 551 598 551 600 550 594 604 548 555 597 551 599 551 597 573 7967 558 597 549 598 548 603 548 601 554 598 550 599 550 600 545 619 549 600 545 599 556 598 551 600 549 611 541 597 551 599 551 609 548 601 555 598 552 596 554 598 550 598 563 587 551 600 543 615 556 598 550 598 551 599 576 574 552 596 552 598 552 613 538 612 551 595 552 597 553 598 552 599 552 596 552 1720 545 596 552 610 551 599 551 599 575 575 551 593 559 595 553 598 552 598 549 612 552 598 551 1705 559 597 574 1689 550 1724 540 598 552 592 559 609 553 599 548 598 552 1711 551 1705 560 1708 553 1711 550 599 553 1716 563 7970 559 597 551 600 573 578 550 599 551 600 575 573 565 589 575 586 552 1710 554 597 556 596 553 597 549 604 552 600 550 599 551 614 551 598 552 599 552 599 548 602 553 598 550 1713 552 599 552 613 593 558 545 604 564 586 552 598 552 598 554 595 554 601 546 617 546 607 550 597 551 611 541 597 553 598 553 598 580 572 548 615 552 599 554 596 552 599 551 598 554 598 547 614 536 604 552 609 554 1714 548 598 556 597 548 599 553 601 553 1711 553 598 553 593 549

      end raw_codes

end remote
```

4. 启动服务，运行指令

```bash
sudo lircd -d /dev/lirc0
irsend SEND_ONCE /home/pi/lircd.conf KEY_POWER
```