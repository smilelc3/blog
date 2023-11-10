---
title: 使用shadowsocks-libev代替shadowsocks-python，并开启ipv6支持
date: 2018-07-13
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用shadowsocks-libev代替shadowsocks-python，并开启ipv6支持/300349-1up-feature-IPv6-tool-545x312.png)

# ubuntu安装shadowsocks-libev

本有一篇博文写的是使用`docker`快速部署shadowsocks，但是存在以下问题：

* `docker`部署上是基于`python2.7`下的`shadowsocks`包，效率不高；
* `python`（包括2/3）下的`shadowsocks`包上次更新已经是2015年8月，距今时间过久，存在版本迭代上的一些bug。

这次的安装使用`shadowsocks-libev`，其使用C写的ss服务端，附上github项目地址：

<https://github.com/shadowsocks/shadowsocks-libev>

```shell
sudo apt-get update
sudo apt-get install shadowsocks-libev
```

**相关文件位置说明**

启动文件：*/etc/init.d/shadowsocks-libev*
配置文件： */etc/shadowsocks-libev/config.json*
一些默认启动配置： */etc/default/shadowsocks-libev*

# 编辑shadowsocks参数

**修改配置文件：**

```shell
sudo nano /etc/shadowsocks-libev/config.json
```

**修改样例：**

```json
{
    "server":["[::0]", "0.0.0.0"],
    "server_port":8388,
    "local_port":1080,
    "password":"PASSWORD",
    "timeout":60,
    "method":"aes-256-cfb"
}
```

`"server"`中：使用`["[::0]", "0.0.0.0"]`分别监听ipv6、ipv4所有请求
`"password"`中：修改为所想设置的密码

- 注意：以前在`shadowsock-python`有使用`"server":"::"`会默认监听ipv4、ipv6，但是该设置在`shadowsocks-libev`不生效，仅仅监听ipv6

# 控制shadowsocks

```shell
sudo service shadowsocks-libev start    # 重启shadowsocks
sudo service shadowsocks-libev stop     # 关闭shadowsocks
sudo service shadowsocks-libev restart  # 参数改变后重启生效
```

查看是否启动，返回结果样例

```shell
ps aux |grep ss-server

nobody   16623  0.0  0.9  32088  4672 ?        Ss   12:05   0:00 /usr/bin/ss-server -c /etc/shadowsocks-libev/config.json -u
root     16825  0.0  0.2  14856  1068 pts/1    S+   13:12   0:00 grep --color=auto ss-server
```

注意：使用shadowsocks的ipv6必须保证双栈（服务器和客户端均启用ipv6）支持。[附一个ipv6检测网址](http://test-ipv6.com/)

本来听说校园网是支持ipv6的，还有可能不限流量，但是……

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用shadowsocks-libev代替shadowsocks-python，并开启ipv6支持/13ccdfa696b3c70f606834a12e6d8410.png)