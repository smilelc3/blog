---

title: C语言零长数组使用技巧
date: 2024-02-17
---
# C语言零长数组使用技巧

在标准C语言（ANSI C）中规定不能定义长度为0的数组。标准可见 ISO 9899:2011  章节 6.7.6.2

> ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/C语言零长数组使用技巧/image.png)
> 数组长度的声明表达式中，如果表达式是一个常量表达式，它的值应该大于零。

但是，有些编译器就把0长度的数组成员作为自己的非标准扩展，例如**GNU C** —— [Arrays of Length Zero](https://gcc.gnu.org/onlinedocs/gcc/Zero-Length.html)。
![](https://raw.githubusercontent.com/smilelc3/blog/main/images/C语言零长数组使用技巧/1708158168447_image.png)

## 什么是零长数组

```c
#include <stdio.h>

int main() {
    int buf[0];
    printf("sizeof(int[0]) = %lu", sizeof(buf));
    //      sizeof(int[0]) = 0
    return 0;
}
```

在程序中定义一个零长度数组，`sizeof()` 计算出大小为0，也就是说，**零长数组是不占用内存空间的**。

## 怎么使用零长数组

**零长度数组一般不单独使用，它常常作为结构体的最后一个成员，构成一个变长结构体。**

我们定义一个结构体用于接受对端发送的**所有**传感器数据：

```c
typedef struct {
    uint8_t sensor_num;         // 传感器数量
    uint8_t single_info_size;   // 单个传感器数据size
    SENSOR_INFO_S info[0];      // 定义一个零长结构体数组，表示具体数据，数据大小 = sensor_num * sensor_info_size
} SENSOR_RSP_S;
```

当然我们也可以申请一个指针，指向紧挨`SENSOR_RSP_S` 结构体的下一个地址，比起指针，用零长数组有这样的优势：

1. **不需要初始化，数组名直接就是所在的偏移；**
2. **不占任何空间，指针需要占用空间，空数组不占任何空间。意味着无需初始化，数组名就是后面元素的地址，直接就能当指针使用。**

使用以上定义的结构体实现以下功能：

```c
// 对rsp地址赋值
const SENSOR_RSP_S *rsp = get_sensor_data();
size_t rsp_len = get_sensor_data_length();

// 判断长度合法性，直接使用sizeof(SENSOR_RSP_S)
if (rsp_len != sizeof(SENSOR_RSP_S) + rsp->sensor_num * single_info_size) {
    ...
}

// 遍历访问数据,数据描述和数据内容均来自rsp，阅读清晰
for (size_t i = 0; i < rsp->sensor_num; i++) {
    show_sensor(rsp->info[i]);
}
```
