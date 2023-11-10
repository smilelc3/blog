---
title: ubuntu17.04环境下opencv3.2.0配置
date: 2017-08-11
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/ubuntu17.04环境下opencv3.2.0配置\logo-1.jpg)

# 实验环境：

* CPU：Ryzen 1800x 
* 系统：ubuntu 17.04 64bit
* 软件环境：python2.7 + python3.5 + cuda开发环境（cuda8.0 cuddn 5.1） 

因实验要求，需要对图片进行灰度编码，自然而然想到利用openCV库结合python进行，但由于系统较新，且网上教程多为老版本，新教程也有些小错误，特记下配置过程

* 预配置环境：openCV 3.2.0(cuda加速+python3环境+contrib扩展包)

# openCV基础环境配置

1. 对源的更新

```bash
sudo apt-get uupdate
sudo apt-get update
```

2. 环境搭建

```bash
sudo apt-get install build-essential cmake cmake-qt-gui pkg-config git
```

3. 图像格式相关

```bash
sudo apt-get install libpng-dev libjpeg-dev libtiff5-dev
```

4. GUI相关

```bash
sudo apt-get install libgtk2.0-dev
```

5. 视频格式相关

```bash
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev
```

6. C++多线程相关

```bash
sudo apt-get install libtbb2 libtbb-dev
```

7. 摄像头相关

```bash
sudo apt-get install libdc1394-22-dev
```

8. openGL相关

```bash
sudo apt-get install libgtkglext1 libgtkglext1-dev
```

**注意：**针对可选安装**libjasper-dev**包，该包是针对图像格式JPEG-2000的开发包。在最新的ubuntu17.04中，已放弃对该包的安装支持，如涉及到对该格式的处理，可以到<https://packages.ubuntu.com/trusty/libjasper-dev> ubuntu的官方包管理网址获取，该包需要依赖包libjasper1，请一并下载。但两包无法直接通过ubuntu软件安装器安装，可以通过dpkg命令安装：

```bash
sudo dpkg -i <package.deb>
```

# openCV下载与本地编译

这次安装版本为3.2.0，需要下载**opencv-3.2.0**与**opencv_contrib-3.2.0**（后者会在cmake配置的时候用到），这是因为opencv3以后**SIFT**和**SURF**之类的属性被移到了contrib中。

**下载采用wget命令：**

```bash
# 从github上直接下载或者clone也可
wget https://github.com/opencv/opencv/archive/3.2.0.zip -O opencv-3.2.0.zip
wget https://github.com/opencv/opencv_contrib/archive/3.2.0.zip -O opencv_contrib-3.2.0.zip
```

**分别解压文件：**

```bash
unzip opencv-3.2.0.zip
unzip opencv_contrib-3.2.0.zip
```

获得**opencv-3.2.0**与**opencv_contrib-3.2.0**两个文件夹，打开opencv3.2.0文件夹

**新建build文件夹，作为编译文件路径：**

```bash
cd opencv-3.2.0
mkdir build
```

**打开cmake图形界面：**

```bash
sudo cmake-gui
```

1. 打开cmake图形界面，源码位置设置为opencv-3.2.0文件夹，binaries(二进制文件)位置设为新建build文件夹位置；
2. 在search框输入opengl，勾选上（为了避免opengl版本问题导致的不兼容，这里最好选择使用opencv自带的openGL；
3. 在search框输入opencv_extra_modules_path，在后面value值处填上两个包中另一个opencv_contrib-3.2.0下modules的路径；
4. 然后点击configure，cmake会自动进行参数检测，并下载一些相关包；

**注意：**可能遇到ippicv_linux_20151201.tgz文件下载失败的问题，（墙的原因），解决办法为百度搜索下载（例如CSDN下载<http://download.csdn.net/download/lx928525166/9479919>，并cp命令复制到/opencv-3.2.0/3rdparty/ippicv/downloads/linux-808b791a6eac9ed78d32a7666804320e文件夹下。（最后一个文件夹名可能不一样）

5. 最后cmake中点击Generate，生成编译文件；
6. 然后cd命令进build文件夹

```bash
sudo make -j16 # -j后面数字为采用线程数，根据个人配置而定
sudo make install
```

7. 进度到100%表示安装成功。

# python环境的绑定

我们已经成功安装openCV，且在配置时openCV会自动与python进行绑定，我们可以通过以下方式进行测试：

1. 重启

   ```bash
   sudo reboot
   ```

   sudo reboot

2. 测试，在python中，若无报错，即可认为绑定成功。

   ```python
   import cv2
   ```


我们也可以通过安装预编译的第三方所提供的openCV

```shell
pip install opencv-python opencv-contrib-python
```



