---
title: python爬虫之BeatifulSoup Select方法总结
date: 2018-03-26
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/python爬虫之BeatifulSoup%20Select方法总结/logo.jpg)
# 简介

> `BeautifulSoup`提供一些简单的、`python`式的函数用来处理导航、搜索、修改分析树等功能。它是一个工具箱，通过解析文档为用户提供需要抓取的数据，因为简单，所以不需要多少代码就可以写出一个完整的应用程序。
> `BeautifulSoup`自动将输入文档转换为`Unicode`编码，输出文档转换为utf-8编码。你不需要考虑编码方式，除非文档没有指定一个编码方式，这时，`Beautiful Soup`就不能自动识别编码方式了。然后，你仅仅需要说明一下原始编码方式就可以了。
> `BeautifulSoup`已成为和`lxml`、`html6lib`一样出色的python解释器，为用户灵活地提供不同的解析策略或强劲的速度。

# CSS 选择器

#### 通过标签名查找

```python
print(soup.select('title'))
print(soup.select('a'))
```

------

#### 通过类名查找

```python
print(soup.select('.sister'))
```

------

#### 通过id查找

```python
print(soup.select('#link1'))
```

------

#### 组合查找

```python
print(soup.select('p #link1'))    		#查找p标签中内容为id属性为link1的标签
print(soup.select("head > title"))   	#直接查找子标签(绝对路径)
```

------

#### 属性查找

查找时还可以加入属性元素，属性需要用中括号括起来，注意属性和标签属于同一节点，所以中间不能加空格，否则会无法匹配到。

```python
print(soup.select('a[class="sister"]'))
print(soup.select('a[href="http://example.com/elsie"]'))
```