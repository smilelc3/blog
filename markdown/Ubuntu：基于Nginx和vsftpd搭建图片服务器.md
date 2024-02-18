---
title: Ubuntu：基于Nginx和vsftpd搭建图片服务器
date: 2018-04-17
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Ubuntu：基于Nginx和vsftpd搭建图片服务器/下载.jpeg)

首先，此次项目正好需要对某云服务商的帮助文档进行全文抓取，涉及到对图片进行转存，需要重新搭建一个图片服务器方便管理，也避免数据丢失，经过多方案尝试，最终选择如下的方法，话不多说，开始行动。

# 环境说明

- 系统 `Ubuntu 18.04`
- 已开放 21号端口（ftp），80号端口（http）

# 安装Nginx

### 安装所需依赖库

```shell
sudo apt-get update
sudo apt-get install build-essential # 安装gcc g++依赖库
sudo apt-get install libpcre3 libpcre3-dev # 安装prce依赖库
sudo apt-get install zlib1g-dev # 安装 zlib依赖库
sudo apt-get install openssl # 安装 ssl依赖库
```

### 编译Nginx

先下载[Nginx](http://nginx.org/en/download.htmlhttp://)对应的最新版本（linux\windows）
我当前的最新版本是：1.13.

```shell
tar -zxvf nginx-*   #解压下载下来的压缩包
cd nginx-*  #进入解压目录
./configure --prefix=/usr/local/nginx   #配置并生成makefile，自行配置安装位置
sudo make   #编译 
make install    #安装
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf #启动Nginx
```

此时Nginx就安装完成了，会使用默认的80端口启动，如果有启动，启动完成可直接通过服务器ip或者云解析的域名查看默认网页。

默认网页如图所示：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Ubuntu：基于Nginx和vsftpd搭建图片服务器/af290ef943a2660f1a7e1d28216366c6.png)

# 安装与配置vsftpd

```shell
sudo apt-get install vsftpd #安装vsftpd
sudo service vsftpd start   #启动vsftpd服务
```

> 下面方法目的在于单独为ftp建立一个用户，并建立images文件夹存储图片

```shell
sudo mkdir /home/ftpuser    #新建ftpuser目录作为ftp主目录
sudo useradd -d /home/ftpuser -s /bin/bash ftpuser  #新建ftpuser用户指定用户主目录
passwd ftpuser  #设置用户密码
chown ftpuser /home/ftpuser #制定用户组
chmod 777 -R /home/ftpuser  #为ftpuser下所有文件开放访问权限
```

### 新建文件/etc/vsftpd.user_list，用于存放允许访问ftp的用户

```shell
sudo nano /etc/vsftpd.user_list
```

文本中添加ftpuser用户名

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Ubuntu：基于Nginx和vsftpd搭建图片服务器/b98994f83383bc3f54394db0ff847abc.png)

### 编辑vsftpd配置文件

```shell
sudo nano /etc/vsftpd.conf
```

作如下修改

1. 去除注释 `write_enable=YES`
2. 末尾添加 `userlist_file=/etc/vsftpd.user_list`
3. 末尾添加 `userlist_enable=YES`
4. 末尾添加 `userlist_deny=NO`

*保存，退出*

### 重启vsftpd服务

```shell
sudo service vsftpd restart
```

用`filezilla`或其他ftp软件，并使用刚刚新建的**用户名**和**密码**访问测试是否成功。

### 创建存储图片的根目录

```shell
sudo su 
cd /home/ftpuser
mkdir -p www/images #这里使用www/images为例
mkdir /usr/local/nginx/html/images  #在nginx目录下创建images目录
```

```shell
sudo nano /usr/local/nginx/conf/nginx.conf    #在默认的server里再添加一个location并指定实际路径
```

插入内容为：

```shell
location /images/ {
    root  /home/ftpuser/www/;
    autoindex on;
}
```

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Ubuntu：基于Nginx和vsftpd搭建图片服务器/1b2d5b9ba4e7efba2c289bc6860316ec.png)

停用与重新载入nginx

```
/usr/local/nginx/sbin/nginx -s stop
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

# 最后测试

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Ubuntu：基于Nginx和vsftpd搭建图片服务器/338ca0ad160e786b467858f5ed3e85a0.png)
