---
title:  数据库SQL JOINS笔记汇总
date: 2021-4-1
---

# 数据库SQL JOINS笔记汇总

可见下图，一共包括7种连接

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/SQL_Joins.jpg" style="zoom:50%;" />

1. 内连接——inner join
2. 左连接（左外连接）——left join(left outer join)
3. 右连接（右外连接）——right join(right outer join)
4. 左连接不包含内连接——left join excluding inner join
5. 右连接不包含内连接——right join excluding inner join
6. 全连接（全外连接）——full join(full outer join)
7. 全连接不包含内连接——full outer join excluding inner join

### 创建测试数据

以下SQL目的在于创建用于测试的`test`数据集，并创建`user_info`和`mail_info`两个信息表

```sql
drop database if exists test;

create database `test` default character set utf8mb4 collate utf8mb4_unicode_ci;

use test;


create table user_info
(
    user_id int auto_increment comment '用户ID'
        primary key,
    name    varchar(20)   not null comment '用户名',
    lv      int default 1 not null comment '等级'
)
    comment '用户信息表';

create table mail_info
(
    mail_id int auto_increment comment '邮件ID'
        primary key,
    title   varchar(50) not null comment '邮件标题',
    user_id int         not null comment 'user_info.user_id外键（不设约束）'
)
    comment '邮件信息表';


insert into user_info(user_id, name, lv)
values (1001, 'Bill', 100),
       (1002, 'William', 220),
       (1003, 'Joseph', 80);


insert into mail_info(mail_id, title, user_id)
values (1, 'Happy Birthday', 1002),
       (2, 'Congrats on obtaining', 1006),
       (3, 'Enjoy Charm Beach', 1010);

```

**user_id表**： ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL%20JOINS笔记汇总/user_info表.png)

**mail_id表** ：![](https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL%20JOINS笔记汇总/mail_info表.png)



## 内连接——inner join

内连接是一种一一映射关系，就是两张表都有的才能显示出来
用韦恩图表示是两个集合的交集，如图：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/内连接.png" style="zoom: 67%;" />

```sql
# 内连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         inner join mail_info as mi on ui.user_id = mi.user_id;
```

查询结果

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/内连接截图.png"  />



## 左连接（左外连接）——left join(left outer join)

左连接是左边表的所有数据都有显示出来，右边的表数据只显示共同有的那部分，没有对应的部分只能补空显示，所谓的左边表其实就是指放在left join的左边的表
用韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/左连接.png" style="zoom:67%;" />

```sql
# 左连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         left join mail_info mi on ui.user_id = mi.user_id;
```

查询结果

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/左连接截图.png"  />



## 右连接（右外连接）——right join(right outer join)

右连接正好是和左连接相反的，这里的右边也是相对right join来说的，在这个右边的表就是右表
用韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/右连接.png" style="zoom:67%;" />

```sql
# 右连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         right join mail_info mi on ui.user_id = mi.user_id;
```

查询结果：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/右连接截图.png"  />



## 左连接不包含内连接——left join excluding inner join

这个查询是只查询左边表有的数据，共同有的也不查出来
韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/左连接不包含内连接.png" style="zoom:67%;" />

```sql
# 左连接不包含内连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         left join mail_info mi on ui.user_id = mi.user_id
where mi.user_id is null;
```

查询结果：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/左连接不包含内连接截图.png"  />



## 右连接不包含内连接——right join excluding inner join

右连接正好是和左连接相反的，这里的右边也是相对right join来说的，在这个右边的表就是右表
用韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/右连接不包含内连接.png" style="zoom:67%;" />

```sql
# 右连接不包含内连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         right join mail_info mi on ui.user_id = mi.user_id
where ui.user_id is null;
```

查询结果：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL%20JOINS笔记汇总/右连接不包含内连接截图.png)



## 全连接（全外连接）——full join(full outer join)

查询出左表和右表所有数据，但是去除两表的重复数据
韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/全连接.png" style="zoom:67%;" />

```sql
# 全连接
# mysql 不支持全连接
# select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
# from user_info as ui
#          full join mail_info mi on ui.user_id = mi.user_id;
# 用以下方式实现，全链接 = 左连接 union 右连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         left join mail_info mi on ui.user_id = mi.user_id
union
distinct
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         right join mail_info mi on ui.user_id = mi.user_id;
```

查询结果：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL%20JOINS笔记汇总/全连接截图.png)



## 全连接不包含内连接——full outer join excluding inner join

意思就是查询左右表各自拥有的那部分数据
韦恩图表示如下：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/全连接不包含内连接.png" style="zoom:67%;" />

```sql
# 全连接不包含内连接
# select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
# from user_info as ui
#          full join mail_info mi on ui.user_id = mi.user_id
# where ui.user_id is null
#    or mi.user_id is null;
# 用以下方式实现，全连接不包含内连接 = 左连接不包含内连接 union all 右连接不包含内连接
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         left join mail_info mi on ui.user_id = mi.user_id
where mi.user_id is null
union all
select ui.user_id, ui.name, ui.lv, mi.mail_id, mi.title, mi.user_id
from user_info as ui
         right join mail_info mi on ui.user_id = mi.user_id
where ui.user_id is null;
```

查询结果：

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/数据库SQL JOINS笔记汇总/全连接不包含内连接截图.png"  />