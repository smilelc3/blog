---
title: 自搭建Ngrok内网穿透服务+https(ssl)认证+ssh通道
date: 2018-07-31
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/自搭建Ngrok内网穿透服务+https(ssl)认证+ssh通道/8392426-2ea590b061201a91.png)

# 背景

> 最近在开发一款微信小程序，实现学校教务管理的信息（成绩、课表等）的抓取与发布。
> 教务系统服务器处于校内网的环境，在外网下，有且仅有通过vpn账号和学校内部服务器通信。

**要实现小程序查询功能，有以下两种方式**

1. 查询服务器完全部署在云端，通过`vpn`账号与学校联通;
2. 查询服务器部署在内网环境下，通过内网穿透的方式，与云端的代理连通。

一般来说，`vpn`账号关乎个人隐私，与网络费用挂钩。此次小程序的开发，我希望遵循**“`简化`、`安全`”**的宗旨，希望借助`ngrok`内网穿透服务，来代理网络的https请求，转发到内网的服务器上。

# 安装GO环境

网络服务器的环境为ubuntu 18.04 x64，借助apt包直接安装

```shell
sudo apt install build-essential golang openssl
```

- 查看go语言版本

```shell
go version
```

# 下载ngrok源码

当前最新的ngrok版本为2.x，但是最新的2.x版本不开源，仅提供1.x可用。且ngrok分服务端和用户端两部分，一般来说，云端服务器做服务端，内网服务端做用户端，且编译依赖于SSL证书，相当于仅仅能一对一使用。

```shell
git clone https://github.com/inconshreveable/ngrok.git
cd ngrok
```

# 配置私有SSL证书信息

- 注意：使用私有的SSL证书，并不会被浏览器/微信小程序开发承认。小程序要求所有`request`要求必须是经过https加密传输，并且安全SSL证书认证的。当前https认证第三方组织的少有免费的。

```shell
NGROK_DOMAIN="btbuquery.top"    #注意域名换成你自己的
openssl genrsa -out base.key 2048
openssl req -new -x509 -nodes -key base.key -days 10000 -subj "/CN=$NGROK_DOMAIN" -out base.pem
openssl genrsa -out server.key 2048
openssl req -new -key server.key -subj "/CN=$NGROK_DOMAIN" -out server.csr
openssl x509 -req -in server.csr -CA base.pem -CAkey base.key -CAcreateserial -days 10000 -out server.crt

    #将生成的证书文件拷贝到指定位置，替代默认证书
cp base.pem assets/client/tls/ngrokroot.crt
cp server.crt assets/server/tls/snakeoil.crt
cp server.key assets/server/tls/snakeoil.key
```

# 使用阿里云免费的SSL一年认证

来自由`DigiCert Inc`公司提供了一年时长的免费SSL认证，因为在编译依赖SSL证书

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/自搭建Ngrok内网穿透服务+https(ssl)认证+ssh通道/522d362de9b91d137f7e91db9873f4a0.png)

从阿里云下载到认证的证书

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/自搭建Ngrok内网穿透服务+https(ssl)认证+ssh通道/757c814d6c710b87b2e96a142befd9cc.png)

共四个文件，将第二个后缀重命名为`xxxxxxxxxxx.crt`，传到ngrok的目录下

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/自搭建Ngrok内网穿透服务+https(ssl)认证+ssh通道/0a7c79d586a1c1e8848fc7c70f3cb96b.png)

复制到`assets/server/tls/`文件夹下

```shell
cp *.crt assets/server/tls/snakeoil.crt
cp *.key assets/server/tls/snakeoil.key
```

# 编译服务端ngrokd

```shell
# 编译64位linux平台服务端
GOOS=linux GOARCH=amd64 make release-server
# 编译64位windows客户端
GOOS=windows GOARCH=amd64 make release-server
# 编译是64位mac客户端
GOOS=darwin GOARCH=amd64 make release-server
# 如果是32位，GOARCH=386
```

- 关于arm的编译

```shell
GOOS=linux GOARCH=arm make release-server
```



# 编译客户端ngrok

按照平台需求，设置不同参数，与编译服务端一致。

```shell
make release-client
```

执行后会在ngrok/bin目录及其子目录下看到服务端ngrokd和客户端ngrok二进制可执行文件

# 运行服务端ngrokd

```shell
cd bin/
sudo ./ngrokd -domain="btbuquery.top" -httpAddr=":80" -httpsAddr=":443" -tunnelAddr=":4443"
```

`httpAddr`：设置代理的http端口，默认80;
`httpsAddr`：设置代理的https端口，默认443;
`tunnelAddr`：设置ngrok通信端口，默认4443。

# 运行客户端ngrok

将云服务器上的`ngrok/bin/ngrok`文件传输到在内网服务器上，以在ngrok文件下为例：

1. 新建一`ngrok.cfg`文件，写入以下内容

- http代理：设置子域名(以www为例)，本地端口（以8000为例）
- ssh代理：远程端口22

```
server_addr: btbuquery.top:4443
trust_host_root_certs: true # 需要第三方SSL认证
inspect_addr: 0.0.0.0:4040

tunnels:
  http:
    proto:
      http: 8000
    subdomain: "www"

  https:
    proto:
      https: 8000
    subdomain: "www"

  ssh:
    remote_port: 222
    proto:
      tcp: 22


```

- 注意：若使用私有SSL认证，必须设置`trust_host_root_certs`为`false`

2. 运行客户端

```shell
./ngrok -log=ngrok.log -config=ngrok.cfg start http ssh
```

相当于实现
`http://www.btbuquery.top` 转发到内网 `127.0.0.1:8000`
`https://www.btbuquery.top` 转发到内网 `127.0.0.1:8000`
`tcp://btbuquery.top:222` 转发到内网 `120.0.0.1:222`

# 服务端加入系统启动服务

1. **在ngrok文件下新建`start.sh`脚本，写入以下内容**

```shell
/root/project/ngrok/bin/ngrokd -domain="btbuquery.top" -httpAddr=":80" -httpsAddr=":443" -tunnelAddr=":4443"
```

2. **在`/etc/init.d`新建ngrok文件，写入以下内容**

```shell
#!/bin/sh
### BEGIN INIT INFO
# Provides:          ngrok
# Required-Start:    
# Required-Stop:     
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start or stop the ngrok Proxy.
### END INIT INFO

ngrok_path=/root/project/ngrok  #指定ngrok文件夹

case "$1" in
        start)
                echo "start ngrok service.."
                sh ${ngrok_path}/start.sh
                ;;
        *)
        exit 1
        ;;
esac
```

3. **加入开机启动**

```shell
cd /etc/init.d/
sudo chmod 755 ngrok
sudo update-rc.d ngrok defaults 90
```