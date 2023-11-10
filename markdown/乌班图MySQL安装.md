---
title: 乌班图MySQL安装
date: 2018-03-26
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/乌班图MySQL安装/1200px-MySQL.svg.jpg)

# MySQL安装

**首先在命令行中输入三个命令：**


```bash
sudo apt-get install mysql-server
sudo apt install mysql-client
sudo apt install libmysqlclient-dev
```

**接下来确认系统是否已经安装上Mysql:**
输入命令：`mysql --help`
出现如下一大串help，即为成功：
![](https://raw.githubusercontent.com/smilelc3/blog/main/images/乌班图MySQL安装/abcf4d0acea8f65d152a9309813a5239.png)
可以通过如下命令进入MySQL服务：
`mysql -uroot -p`
会让你输入密码，在安装的时候有时候会出现让你设置密码，有些是默认登录。
![](https://raw.githubusercontent.com/smilelc3/blog/main/images/乌班图MySQL安装/24abdc15c758a0dabe4e5dbc6cac6a41.png)

现在设置mysql允许远程访问，首先编辑文件 /etc/mysql/mysql.conf.d/mysqld.cnf：

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

注释掉***bind-address = 127.0.0.1***：
`sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf`
![](https://raw.githubusercontent.com/smilelc3/blog/main/images/乌班图MySQL安装/微信截图_20190320165642.png)

保存退出，然后进入mysql服务，执行授权命令：

```mysql
Grant all on *.* to 'root'@'%' identified by 'root用户的密码' with grant option;
flush privileges;
```

然后执行quit命令退出mysql服务，执行如下命令重启mysql：

```bash
service mysql restart
```

补充：在进入MySQL时，输入`mysql -uroot -p`命令时，会出现 > ERROR 1045 (28000): Access denied for user ‘root’@’localhost’这种情况。于是在网上查了许多技术网站，发现一篇不错的，据此解决。链接： https://blog.csdn.net/learner_lps/article/details/62887343