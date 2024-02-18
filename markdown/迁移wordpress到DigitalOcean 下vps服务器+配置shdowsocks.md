---
title: 迁移wordpress到DigitalOcean 下vps服务器+配置shdowsocks
date: 2017-09-24
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移wordpress到DigitalOcean%20下vps服务器+配置shdowsocks/WordPress-Logo-1.png)

# 迁移原因

原**WordPress**配置在腾讯云的centOS 6.8， 环境为镜像市场一键配置的。当初选择腾讯云的产品，是因为有学生优惠活动，2核/2G/1M带宽/20G硬盘+1年cn域名的使用权（12元每月）。但发现仅仅是做博客网站并不需要这样的配置，且cn域名也并非有我所想的域名。

一次偶然机会，在知乎上看到介绍国外的一些vps服务器，其中***digital ocean***（下简称***DO***）家的服务器最低每月5$ ,折合人民币35元左右，且通过***github student packages***能获得50  + 他人推荐码10，共60，共60的优惠，相当于第一年完全免费，加上一个国外的独立ip，意味着以前每个月的购买vpn的钱也可以省下来。长远看，还是相当划算。

因为WordPress的迁移，希望能更有自己的特色，就在阿里云购买的 *liuchang.men* 的新域名（10年/60元左右）。该域名和DO的服务器都不需要备案，这一点也很重要。（你永远也不知道在腾讯云cn域名备案，用了2个月才完全批下来的痛苦）

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移wordpress到DigitalOcean 下vps服务器+配置shdowsocks/1.jpg" style="zoom: 25%;" />

# 基于docker的wordpress迁移

DO下5$每月配置为：1G单核/512M内存/20G硬盘,整体配置在内存上略有缩水，但确实够用。带宽并未在官网列出，经过测试，大概有4M（500k/s）的上下行速度（美国纽约），这一点也为搭建*shadowsocks*提供了一个硬件基础。

以前服务器初次搭建WordPress时，本是Ubuntu下从零搭建，但发现极其繁琐，后通过镜像商场直接选择已有的镜像，但系统为centOS，自己不太熟悉。此次，在网上充分查阅后，发现基于docker的安装相当简单。

## 镜像选择

镜像选择Docker on 16.04 ，下列镜像本来有WordPress，但需要40G硬盘，不符合我们5$每月的需求

## 安装 WordPress Docker 镜像

```bash
sudo docker pull eugeneware/docker-wordpress-nginx
```

## 启动 WordPress 容器

```bash
# 创建容器
sudo docker run -p 80:80 --name docker-wordpress-nginx -d eugeneware/docker-wordpress-nginx 
# 启动容器
docker start docker-wordpress-nginx
```

## 容器开机自启动

```shell
docker run --restart=always  xxxx       # 创建时参数
docker update --restart=always xxxx         # 若创建时未指定，可后期update
```

## 访问网站 http:// +  ip ，配置 WordPress

用wordpress自带的导入导出功能进行迁移

**注意**：关于WordPress后台地址被改导致无法登陆后台的简单解决方法

打开网站根目录下的wp-config.php文件，输入这一行代码

```
define('RELOCATE',true);
```

当 *RELOCATE* 的值为 *true* 时，就会在你登录后台的时候把 *Wordpress*（去后台地址）URL改为你当前输入的，这样就可以不用修改数据来重置地址。记得解决后修改。

# 基于docker的shadowsocks 配置

docker下用虚拟的方式配置一些环境确实方便，下面配置shadowsocks服务端也将基于docker

## 安装shadowsocks

```bash
sudo docker pull oddrationale/docker-shadowsocks
```

## 配置shadowsocks

```bash
sudo docker run -d -p 8888:8888 oddrationale/docker-shadowsocks -s 0.0.0.0 -p 8888 -k yourpassword -m aes-256-cfb
```

*其中，-d为后台运行 ， -p为端口映射 ， -s为ip，0.0.0.0为采用默认本机ip， -k 为密码*

## shadowsocks客户端

附上github上shadowsocks的客户端链接：

* widows：<https://github.com/shadowsocks/shadowsocks-windows>

* android： <https://github.com/shadowsocks/shadowsocks-android>

* ios(未测试)：<https://github.com/herzmut/shadowsocks-iOS>

---

**2017-11-17更新:**

原服务器因为未知原因，下行带宽被限制到0.1M，暂迁移到旧金山的DO，可以借助快照迁移完成。

附一张网速测试图：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移wordpress到DigitalOcean%20下vps服务器+配置shdowsocks/IMG_20171117_081828-1024x986.png)
