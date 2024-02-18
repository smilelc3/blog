---
title: App Inventor2 用蓝牙与树莓派小车通讯
date: 2017-12-17
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/App%20Inventor2%20用蓝牙与树莓派小车通讯/timg.jpeg)

# App Inventor开发

***App Inventor 2***

> **Android应用开发者**（英语：**App Inventor**）是一款卡通图形界面的Android智能手机应用程序开发软件。它起先由**Google**提供的应用软件，现在由[麻省理工学院](https://zh.wikipedia.org/wiki/%E9%BA%BB%E7%9C%81%E7%90%86%E5%B7%A5%E5%AD%B8%E9%99%A2)维护及营运。

借助IA2 建立一个简易的游戏手柄。因为AI2 的蓝牙串口通讯协议是基于SPP（Serial Port Profile）串行端口配置。我们目的是并设定相对应代码，在手机发送，在树莓派解析，并对小车进行运动控制。

对应代码如下：

* u  –>  前进 gofront()

* d  –>  后退 goback()

* l  –>  左转 turnleft()

* r  –>  右转 turnright()

* s  –>  停止 istop()

*每次代码运行周期为20ms*

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/App%20Inventor2%20用蓝牙与树莓派小车通讯/Screenshot_2017-12-16-22-19-55-015_edu.mit_.appinventor.aicompanion3-1024x576.png)

**ai2截面图**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/App%20Inventor2%20用蓝牙与树莓派小车通讯/blocks-1-1024x276.png)

# 树莓派蓝牙SPP设置

## 树莓派蓝牙配置

1. **安装支持包**

   ```bash
   sudo apt-get install pi-bluetooth
   sudo apt-get install bluetooth bluez blueman
   ```

2. **添加pi用户到蓝牙组**

   ```bash
   sudo usermod -G bluetooth -a pi
   service bluetooth status
   ```

3. **启动/增加SPP**

   ```bash
   sudo nano /etc/systemd/system/dbus-org.bluez.service
   ```

   修改内容如下:

   ```bash
   ExecStart=/usr/lib/bluetooth/bluetoothd -C
   ExecStartPost=/usr/bin/sdptool add SP
   ```

4. **重启，启动蓝牙串口**

   ```bash
   sudo rfcomm watch hci0
   ```

## 串口调试软件xgcom

```shell
sudo git clone https://github.com/helight/xgcom.git
sudo  apt-get install make automake libglib2.0-dev libvte-dev libgtk2.0-dev
cd xgcom
sudo ./autogen.sh
sudo make
sudo make install
xgcom
```

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/App%20Inventor2%20用蓝牙与树莓派小车通讯/v2-8195c787c4db040dc39d823992c5a0ed_hd.jpg)

# 展示与控制代码

<video src="https://raw.githubusercontent.com/smilelc3/blog/main/images/App Inventor2 用蓝牙与树莓派小车通讯/蓝牙控制样例.mp4" controls preload="metadata"></video>

```python
import serial
import time
from btbu_robot.motor import motor
bluetooth = serial.Serial("/dev/rfcomm0",9600,timeout=0.5)

#bluetooth.open()
left = motor(22, 27, 17)
right = motor(24, 23, 18)
def gofront():
    left.run(70)
    right.run(70)
    # print("前进")

def goback():
    left.run(-70)
    right.run(-70)
    #print("后退")

def turnleft():
    left.run(-70)
    right.run(70)
    #print("左转")

def turnright():
    #print("右转")
    left.run(70)
    right.run(-70)

def istop():
    left.run(0)
    right.run(0)
    #print("停止")

status = '' # 记录当前状态
if __name__ == '__main__':
while True:
    data = bluetooth.readline().decode('utf-8')
    if status == 'u': # 前进
        gofront()

    elif status == 'd': # 后退
        goback()

    elif status == 'l': # 左转
        turnleft()

    elif status == 'r': # 右转
        turnright()

    elif status == 's': # 停止
        istop()
    while data != '':
        status = data[0]
        if status == 'u': #　前进
            gofront()

        elif status == 'd': #　后退
            goback()

        elif status == 'l': #　左转
            turnleft()

        elif status == 'r': #　右转
            turnright()

        elif status == 's': # 停止
            istop()
        data = data[1:]
        time.sleep(0.02)
    time.sleep(0.02)
```
