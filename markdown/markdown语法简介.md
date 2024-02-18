---
title: markdown语法简介
date: 2018-01-08
---

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

---

### 无序列表

- 项目一
+ 项目二
* 项目三
  * 子项目
  - 子项目

### 有序列表

1. 项目一
2. 项目二
3. 项目三
    1. 二级项目
    2. 二级项目
        1. 三级项目
        2. 三级项目
4. 项目四

---

> 一级引用
>
>> 二级引用  
>>
>>> 三级引用  

---

粗体：**Markdown**  
斜体：*Markdown*  
粗体+斜体：***Markdown***  
删除线：~~MarkDown~~  
网址\邮箱引用：[liuchang.men](liuchang.men/)  <smile@liuchang.men>  
使用脚注[^1]

---

### TODOLIST

- [x] 待办事务一
- [x] 待办事务二
  - [x] 待办事务三
  - [ ] 待办事务四

---

关于 `latex` 公式

行内公式：$E=mc^2$

单行公式：

$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$

---

### 来张图片吧

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/markdown语法简介/1.png "markdown图片")

---

### 这是表格

| Tables(左对齐) |      Are（居中对齐）      | Cool（右对齐）  |
| :---- | :-----------: | ---: |
|   1    | right-aligned | $1600 |
|   2    |   centered    |  $12  |
|   3    |   are neat    |  $1   |

---

### 代码测试

行内代码 `nano`

代码块

```python
import math
print("hello world!")
```

```c
#include <stdio.h>

int main() {
  printf("hello world!\n");
  return 0;
}
```

```c++
#include <iostream>
using namespace std;

int main() {
  cout << "hello world!" << endl;
  return 0;
}
```

[^1]:Hi 这是一个注脚，会自动拉到最后排版
