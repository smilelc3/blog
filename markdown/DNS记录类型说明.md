---
title: DNS记录类型说明
date: 2019-07-03
---

## DNS

域名系统（英文：Domain Name System，缩写：`DNS`）是互联网的一项服务。它作为将域名和IP地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。DNS使用`TCP`和`UDP`端口`53`。当前，对于每一级域名长度的限制是63个字符，域名总长度则不能超过253个字符。

### A记录（主机记录）

A（Address）记录是用来指定主机名（或域名）对应的IP地址记录。用户可以将该域名下的网站服务器指向到自己的web server上。

以域名`liuchang.men`为例，添加A记录：

| 类型 | 名称  |       值       |
| :--: | :---: | :------------: |
|  A   | proxy | 47.101.212.137 |

`proxy.liuchang.men`是指定域名对应的IP地址47.101.212.137。

A记录同时也可以设置域名的二级域名，如：

| 类型 |  名称   |       值       |
| :--: | :-----: | :------------: |
|  A   | *.proxy | 47.101.212.137 |

使用通配符`*`泛解析所有 `*.proxy.liuchang.men` 指向IP地址47.101.212.137。

### CNAME记录（别名记录）

CNAME（Canonical Name ）别名记录，允许您将多个名字映射到同一台计算机。通常用于同时提供WWW和MAIL服务的计算机。例如：

| 类型  | 名称 |         值         |
| :---: | :--: | :----------------: |
| CNAME | www  | smilelc3.github.io |
| CNAME | mail |     ym.163.com     |
| CNAME |  @   | smilelc3.github.io |

若有一台计算机名为`smilelc3.github.io`（A记录），它能提供WWW服务，而另一台机器名为`ym.163.com`能提供mail服务，我希望`www.liuchang.men`能够指向`smilelc3.github.io`，而`mail.liuchang.men`能够指向`ym.163.com`，则记录值如上。

* 注意：记录值留白或使用@符代表使用域名自身作为名称，上表第三条中，@代表`liuchang.men`指向`smilelc3.github.io`域名。

### AAAA记录（IPv6主机记录）

AAAA 记录是用来指定主机名（或域名）对应的IPv6地址记录。

### TXT记录

TXT记录一般是为某条记录设置说明，用来保存域名的附加文本信息，TXT记录的内容按照一定的格式编写，最常用的是SPF（Sender Policy Framework）格式。反垃圾邮件是TXT的应用之一，SPF是跟DNS相关的一项技术，它的内容写在DNS的TXT类型的记录里面。

在命令行下可以使用如下命令来查看域名`liuchang.men`的TXT记录。

```shell
nslookup -qt=txt liuchang.men
```

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/DNS记录类型说明/屏幕截图%202023-11-12%20151645.png)

### MX记录

MX记录也叫做邮件路由记录，用户可以将该域名下的邮件服务器指向到自己的mail server上，然后即可自行操控所有的邮箱设置。您只需在线填写您服务器的IP地址，即可将您域名下的邮件全部转到您自己设定相应的邮件服务器上。MX记录的作用是给寄信者指明某个域名的邮件服务器有哪些，SPF格式的TXT记录的作用跟MX记录相反，它向收信者表明，哪些邮件服务器是经过某个域名认可发送邮件的。

### DS记录

NS（Name Server）记录是域名服务器记录，用来指定该域名由哪个DNS服务器来进行解析。 您注册域名时，总有默认的DNS服务器，每个注册的域名都是由一个DNS域名服务器来进行解析的，DNS服务器NS记录地址一般以以下的形式出现： ns1.domain.com、ns2.domain.com等。简单的说，NS记录是指定由哪个DNS服务器解析你的域名。

### URL记录

将域名指向一个http(s)协议地址，访问域名时，自动跳转至目标地址。
