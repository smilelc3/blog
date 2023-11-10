---
title: 迁移博客到Hexo(NexT主题) + GitHub Pages
date: 2019-03-20
---

# 背景

个人以前博客常挂在自建的基于`docker`的**WordPress**平台，但往日学艺不精，对docker操作陌生，都是基于别人的模板快速搭建；尽近两年来，经历了多次迁移：

* 腾讯云（centOS） → 阿里云（ubuntu） → DigitalOcean（ubuntu）

同时也经过了多次的版本升级，且前期多是在wordpress内置的编辑器中编写，也尝试过[`百度UEditor编辑器`](https://ueditor.baidu.com/website/index.html)

，最终转到`MarkDown`编辑器。除此外，图床也一变再变，过程中多次忘记备份，导致存在一些图片缺失。

回想写博客的本质，是为了**记录心路，学习知识**。实在不应该放过多时间在博客建设本身😢。

思前想后，还是准备把博客落脚在**GitHub Page**，不用去考虑数据库、`cdn`等，仅采用静态页面，一篇文章也为一份md文件，图床部分也不去用七牛等服务商，就是oneDrive的分享，简单直接。写博客也应该像提交代码一样，**commit + push**😉。

大致步骤如下：

# GitHub建立固定格式仓库

登录GitHub，新建一个仓库，在Repository name中输入新建仓库的名称，我们现在是要搭建自己的个人博客，Repository name是有固定格式的：name.github.io，其中name可以随便填，一般是用自己的名字，点击Create Repository。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/批注%202019-03-20%20202811.png)

# 配置Git

## 安装Git

[Git下载地址](<https://gitforwindows.org/>)，选择适合版本，默认安装即可，安装后git相关命令会自动添加到系统path。可通过：

```she
git --version
```

来确认。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/批注%202019-03-20%20203414.png)

## 配置Git

为了把本地的仓库中的内容传输到GitHub上，需要配置ssh key，无论是上传自己的博客还是上传其他的仓库都需要连接Github，ssh key是一个token，作用是身份验证。 
为了在本地创建ssh key，打开Git Bash，输入命令：

```shell
ssh-keygen -t rsa -C "email"		# email是我们在注册Github时使用的邮箱
```

输入上面的命令后按Enter键，Git Bash会提示:

```shell
Enter file in which to save the key (/c/Users/sun/.ssh/id_rsa):_
```

直接按Enter，Git Bash会在默认路径C:\users\sun\.ssh下生成几个文件。

然后Git Bash又给出提示：

```shell
Enter passphrase <empty for no passphrase>:_
```

这是在提示我们输入密码，直接回车表示不设置密码；此处我不设置密码，然后Git Bash要求我们重复密码，也直接回车，然后就会提示ssh key已经生成。 

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320203848.png)

1. 点击Settings；

2. 在页面左侧找到Deploy keys并点击；

3. 点击右侧的Add deploy key按钮，title随意填，Key填写ssh key文件中复制的key（包括ssh-ras头）；
4. 点击Add Key，保存ssh key。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320204021.png)

我们需在本地验证ssh key设置是否成功，打开cmd，输入命令：

```shell
ssh -T git@github.com
```

若看到

```shell
You’ve successfully authenticated, but GitHub does not provide shell access
```

表示当前已经成功地连接上了自己的GitHub账户

接下来，设置一下自己的用户名和邮箱

```shell
git config --global user.name "my_github_name"
git config --global user.email "my_github_email"
```

至此，我们已经成功地将个人电脑和Github账号连接。

# 安装node.js 和 hexo

## 安装node.js

[node.js下载地址](https://nodejs.org/en/)

按照需要选择不同的版本，下载到本地之后，直接双击安装，一路默认即可，node.js安装后，会自动配置环境变量，打开windows的控制台，输入命令：

```shell
node -v
```

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/批注%202019-03-20%20204831.png)

## 安装Hexo

hexo项目须在电脑的磁盘里新建一个空文件夹，在我的电脑上是*C:\Users\smile\hexo_next*，用于存放本地仓库，和Github上的xxxxx.github.io是对应的，下面以命令行为例，完成Hexo安装

```shell
mkdir C:\Users\smile\hexo_next			# 新建文件夹
cd C:\Users\smile\hexo_next
npm install hexo -g						# 安装Hexo,-g代表全局安装
```

安装耗时较长，最终可通过

```shell
hexo -v
```

检测安装

# 搭建本地测试环境

初始化*C:\Users\smile\hexo_next*这个文件夹，打开Git Bash进入此目录，输入命令：

```shell
hexo init
npm install 					# 安装Hexo所需要的组件
hexo g							# 产生webapp文件
hexo s							# 开启服务器
```

此时控制台提示：

```shell
INFO  Start processing
WARN  ===============================================================
WARN  ========================= ATTENTION! ==========================
WARN  ===============================================================
WARN   NexT repository is moving here: https://github.com/theme-next
WARN  ===============================================================
WARN   It's rebase to v6.0.0 and future maintenance will resume there
WARN  ===============================================================
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
```

表明启动成功

# 使用next设计个性化博客

## 将Hexo的主题切换为NexT

进入到*C:\Users\smile\hexo_next*文件夹，打开cmd

```shell
git clone https://github.com/theme-next/hexo-theme-next themes/next
```

打开C:\Users\smile\hexo_next\\_config.yml

**把theme: lansscape改为theme: next** 

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/批注%202019-03-20%20210223.png)

## 切换Next主题

进入C:\Users\smile\hexo_next\themes\next，打开NexT的配置文件_config.yml，选择自己喜欢的主题样式，选择哪个样式就需要把主题前面的#去掉

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320210633.png)

## 设置动态背景

在*C:\Users\smile\hexo_next\themes\next\\_config.yml*中，canvas_nest设置成ture，并且可选多种动态背景

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320211035.png)

## 取消侧边栏目录的自动编号

在*C:\Users\smile\hexo_next\themes\next\\_config.yml*中，修改toc下number属性为`false`

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20200418205211.png)

## 在右上角或者左上角实现fork me on github

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320211234.png)

在[GitHub Ribbons](https://blog.github.com/2008-12-19-github-ribbons/)或[GitHub Corners](http://tholman.com/github-corners/)选择自己喜欢的挂饰，拷贝方框内的代码

将复制的代码放到C:\Users\smile\hexo_next\themes\next\layout中的_layout.swig文件中，放在

```html
<div class="headband"></div>
```

后面，如下图

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320211516.png)

## 实现文章字数统计和阅读时长功能

```shell
npm install hexo-wordcount --save
```

编辑*C:\Users\smile\hexo_next\themes\next\\_config.yml*，找到post_wordcount，将所有的false都改为true：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320211750.png)

## Hexo博客添加站内搜索

需要安装 hexo-generator-search，输入命令：

```shell
npm install hexo-generator-search --save
```

安装 hexo-generator-searchdb，输入命令：

```shell
npm install hexo-generator-searchdb --save
```

编辑*C:\Users\smile\hexo_next\themes\next\\_config.yml*，找到Local search，做如下设置：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320211940.png)

效果如下：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320212029.png)

# 连接Hexo和Github Pages及部署博客

接下来就是将Hexo与GitHub Pages连接起来 
打开*C:\Users\smile\hexo_next\\_config.yml*文件，找到deploy字段，改为如下内容

```shell
deploy:
    type: git
    repository: git@github.com:user_name/respname.github.io.git
    branch: master
```

填写GitHub的用户名 和 博客仓库名，如下图所示

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/迁移博客到Hexo(NexT主题)%20+%20GitHub%20Pages/微信截图_20190320212202.png)

在产生webapp应用和部署到GitHub之前，需要安装一个扩展插件，在C:\Users\smile\hexo_next中打开cmd，输入命令：

```shell
npm install hexo-deployer-git --save
```

使用命令：

```shell
hexo clean & hexo d -g		# hexo g 生成webapp应用		# hexo d 部署
```

就可以发布到GitHub上啦！😉