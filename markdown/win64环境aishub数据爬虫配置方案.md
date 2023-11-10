---
title: win64环境aishub数据爬虫配置方案
date: 2017-05-25 
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/win64环境aishub数据爬虫配置方案/20170525141021.png)

# Python 3.6.1

- **下载地址**：[python-3.6.1-amd64.exe](https://www.python.org/ftp/python/3.6.1/python-3.6.1-amd64.exe)
- **系统需求**：64位/32位
- **备注**：python需加入系统path，并能够以python链接到

# Mongodb 3.4.4

- **下载地址**：[mongodb-win32-x86_64-2008plus-ssl-3.4.4-signed.msi](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.4.4-signed.msi)
- 系统需求：64位
- 安装位置：C:\\mongoDB3.4.4
- 系统path：C:\\mongoDB3.4.4\\bin
- 配置文件位置：C:\\mongoDB3.4.4\\bin\\mongodb.config
- config文件内容：

> 数据库文件目录：
>         dbpath=C:/mongoDB3.4.4/data

> 日志目录：
>         logpath=C:/mongoDB3.4.4/log/mongo.log
>         diaglog=3

- 安装服务至系统服务

```Bash
mongod –config C:\mongoDB3.4.4\bin\mongodb.config –install
```

- 启动与关闭mongoDB：       

```Bash
net start MongoDB
net stop MongoDB       
```

- 查看aishub数据库状态命令：

```Bash
mongo 
use aishub
db.status()
```

- 数据导出命令(默认csv格式)：

```Bash
mongoexport -d aishub -c sheet1 -o c:\data.csv
```

- 数据集合（sheet1）删除

```Bash
use aishubdb.sheet1.drop()
```

# Python 依赖包

#### Pip 国内源

阿里云 [http://mirrors.aliyun.com/pypi/simple/](http://mirrors.aliyun.com/pypi/simple/)

中国科技大学 [https://pypi.mirrors.ustc.edu.cn/simple/](https://pypi.mirrors.ustc.edu.cn/simple/)

豆瓣 [http://pypi.douban.com/simple/](http://pypi.douban.com/simple/)

清华大学 [https://pypi.tuna.tsinghua.edu.cn/simple/](https://pypi.tuna.tsinghua.edu.cn/simple/)

中国科学技术大学 [http://pypi.mirrors.ustc.edu.cn/simple/pip](http://pypi.mirrors.ustc.edu.cn/simple/)

#### pip使用

后面加上-i参数，指定pip源

```Bash
pip install scrapy -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### Pip更新 

```Bash
python -m pip install –upgrade pip 
```

#### 依赖包

- beautifulsoup4 
- requests 
- pymongo 
- lxml