---
title: 为Linux增加swap分区的方法
date: 2018-07-26
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/为Linux增加swap分区的方法/6122578-e4fc4a1535b54fd2.jpeg)

## 用文件作为Swap分区

1. **创建要作为swap分区的文件:增加1GB大小的交换分区，则命令写法如下**

```shell
dd if=/dev/zero of=/root/swapfile bs=1M count=1024
```

> 文件大小 size = bs \* count
> if 为输入文件， of 指定输出文件

2. **格式化为交换分区文件**

```shell
mkswap /root/swapfile 			# 建立swap的文件系统
```

3. **启用交换分区文件**

```shell
swapon /root/swapfile 			# 启用swap文件
```

4. **系统开机时自启用**

```shell
sudo nano /etc/fstab 			# 在文件/etc/fstab中添加一行
/root/swapfile swap swap defaults 0 0
```

