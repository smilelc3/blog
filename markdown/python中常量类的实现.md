---
title: python中常量类的实现
date: 2020-01-01
---

众所周知，在Python中其实并没有一个严格定义的常量类概念。

目前所采用的常用约定俗成的方式是采用命名全为**大写字母**的方式来标识别常量。

但实际上这种方式并不能起到防止修改的功能，而只是从语义和可读性上做了区分。

现已有了一种基于\_\_setter\_\_和\_\_delattr\_\_的实现方法：

```python
# coding:utf-8
import sys


class _const:
    def __new__(cls, *args, **kw):
        if not hasattr(cls, '_instance'):
            orig = super(_const, cls)
            cls._instance = orig.__new__(cls, *args, **kw)
        return cls._instance

    # 已存在
    class ConstBuiltError(TypeError):
        def __init__(self, name):
            self.msg = "Can't rebind const instance attribute (%s)" % name

        def __str__(self):
            return 'error msg: {}'.format(self.msg)

    # 非全大写错误（可下划线）
    class ConstCaseError(TypeError):
        def __init__(self, name):
            self.msg = 'const name "%s" is not all uppercase' % name
        def __str__(self):
            return 'error msg: {}'.format(self.msg)

        def __repr__(self):
            return self.__str__()

    # 删除错误
    class ConstDelError(TypeError):
        def __init__(self, name):
            self.msg = "Can't delete const instance attribute (%s)" % name

        def __str__(self):
            return 'error msg: {}'.format(self.msg)

        def __repr__(self):
            return self.__str__()

    # 创建时核对是否重复或全大写
    def __setattr__(self, name, value):
        if self.__dict__.__contains__(name):
            raise self.ConstBuiltError(name)
        if not name.isupper():
            raise self.ConstCaseError(name)
        self.__dict__[name] = value

    # 禁止删除
    def __delattr__(self, name):
        if self.__dict__.__contains__(name):
            raise self.ConstDelError(name)
        raise self.ConstDelError(name)


# 实例化一个类
Const = _const()
Const.TEST = 'test'
```

假设文件保存为constClass使用的时候只要*from constClass import Const*，便可以直接定义常量了，比如：

```python
from constClass import Const
print(Const.TEST)    # 已有定义
Const.AUTHOR = 'smile'   # 首次定义
Const.AUTHOR = 'smilelc'  # 修改
Const.author = 'smile'          # 小写定义
del Const.AUTHOR                # 删除
```

1. 已有定义时，如`Const.TEST = 'test'`，可直接调用；
2. 上面的`Const.AUTHOR`定义后便不可再更改，因此`Const.AUTHOR = ‘smilelc’`会抛出`ConstBuiltError`异常；
3. 而常量名称如果小写，如`Const.author ='smile'`，也会抛出`ConstCaseError`异常；
4. 一旦定义完后，若删除，会抛出`ConstDelError`。
