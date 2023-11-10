---
title: 使用PyCharm进行远程开发和Django调试
date: 2018-8-9
---

存在这样一种情况，经常在非服务器环境下开发python程序，即使在本地运行良好，但是在服务器的环境下就会存在问题，如何保证开发环境跟运行环境一致呢？

这里通过`PyCharm`的`远程解释器`加上自动文件同步功能，实现

- 本地编译 -> 同步到服务器 -> 远程debug

的方式来调试程序。

# 远程服务器的同步配置

局域网下的服务器IP地址为: `192.168.2.192`，python版本3.6, 且在项目下已有虚拟环境，开启ssh服务。

首先我们需要配置PyCharm通服务器的代码同步，打开Tools | Deployment | Configuration

点击左边的“+”添加一个部署配置，输入名字，类型选SFTP

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/463208605698cb39134207dcd037ead3.png)

确定之后，再配置远程服务器的ip、端口、用户名和密码。root path是文件上传的根目录，注意这个目录必须用户名有权限创建文件。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/09f3924aa349d43ca865ee8c579bcfdb.png)

然后配置映射，local path是你的工程目录，就是需要将本地这个目录同步到服务器上面，我填的是项目根目录。 Deploy path on server 这里填写相对于root path的目录，下面那个web path不用管先

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/63968fe77d6df6cb71c425083c7ab5fd.png)

还有一个设置，打开Tools | Deployment | Options，将”Create Empty directories”打上勾，要是指定的文件夹不存在，会自动创建。

# 上传和下载文件

有几种方法可以实现本地和远程文件的同步，手动和当文件保存后自动触发。这里我选中`Automatic upload`。

手动上传方式很简单，选择需要同步的文件或文件夹，然后选择 Tools | Deployment | Upload to sftp(这个是刚刚配置的部署名称)

如果在服务器存在已有项目，选择Compare with … ，然后全部接受服务器端的文件。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/98114a6545324b2cade721f7cde56660.png)

# 比较远程和本地文件

有时候你并不确定远程和本地版本的完全一致，需要去比较看看。PyCharm提供了对比视图来为你解决这个问题。

选择Tools | Deployment | Browse Remote Host，打开远程文件视图，在右侧窗口就能看到远程主机中的文件

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/d6410d9de1f143d84187c573d5c9e2f4.png)

选择一个你想要对比的文件夹，点击右键->Sync with Local，打开同步对比窗口，使用左右箭头来同步内容。

# 配置远程Python解释器

新建一个python解释器，选择SSH 解释器，由于我上面配置过就直接选模板， 这里请仔细看我的Python解释器是虚拟环境virtualenv，这个要在服务器上面先创建好虚拟环境。
![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/29d7b5c66ffd28d67b73aa501046cf56.png)

# 配置Django运行参数

指定启动`Host`为`0.0.0.0`，表示允许所有ip进行调试
若需要启动web浏览器，指定下地址为服务器端的ip

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用PyCharm进行远程开发和Django调试/b650bb4ed8882027d49456edbfbd1e27.png)