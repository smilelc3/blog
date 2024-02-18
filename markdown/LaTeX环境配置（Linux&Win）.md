---
title: LaTeX环境配置（Linux&Win）
date: 2018-01-27
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/LaTeX环境配置（Linux&Win）/u2084003323678625771fm27gp0.jpg)

# LaTeX介绍

`LaTex`是一种基于`TeX`的排版系统，最初由美国计算机学家Leslie Lamport在20四级80年代初开发，在对于生成包含**复杂表格和数学公式的书籍质量的印刷品**，`TeX`发挥着强大功能。

`TeX`在不同的系统下有不同的实现版本(*MiKTeX、pdfTeX、xelaTeX、CTeX*)，有时一种操作系统中也会有几种`TeX`系统。目前系统对应推荐关系如下：

| Unix(mac) | 类Unix(Linux) | windows |
| :-------: | :-----------: | :-----: |
|  MacTex   |    Texlive    | MikTex  |

> CTeX指的是CTeX中文套装的简称，是把MiKTeX和一些常用的相关工具，如GSview，WinEdt 等包装在一起制作的一个简易安装程序，并对其中的中文支持部分进行了配置，使得安装后马上就可以使用中文。

> TeXLive 是由国际 TeX 用户组织 TUG 开发的 TeX 系统，支持不同的操作系统平台。其 Windows 版本又称 fpTeX ， Unix/Linux 版本即著名的 teTeX 。

# linux环境下LaTeX配置

**总体方案介绍**

> *TexLive + Atom编译器（3个Atom插件） + 添加win字体*

## LaTeX基础环境配置

- 在有*apt*包管理的Linux发行版本上，如(ubuntu,deepin,debian)，其安装相对容易。命令如下：

```shell
sudo apt-get update
sudo apt-get install texlive-full
```

其中，`-full`注明安装所有扩展组件（xelaTeX、语言字体包等），建议直接安装`-full`版本，虽然硬盘空间占用较大，但免去了单个配置的苦恼。

- 非*apt*的Linux发行版本可能需要自行texlive官网下载最发行版本并安装。

## atom(IDE)相关配置

> Atom 是github专门为程序员推出的一个跨平台文本编译器。具有简洁和直观的图形用户界面，经过简单的配置，足够胜任各类语言的IDE(集成开发环境)

因为atom在大多数的linux发行版本中均未有收录，需要自行添加仓库源，或者去官网下载安装，这里为了便于更新，提供添加apt源，以及apt安装方式介绍：

```shell
sudo add-apt-repository ppa:webupd8team/atom
sudo apt-get update
sudo apt-get install atom
```

atom若作为latex的开发环境，需要配合以下插件使用(直接在atom中安装)：

- `atom-latex`
- `language-latex`
- `pdf-view`

另外建议安装`simplified-chinese-menu`插件，对atom菜单进行汉化。

因对兼容性的设置，若对一般latex编写，建议Latex编译器使用xelatex，在`atom-latex`插件中设置如下：

- `Toolchain to use` 选择 `custom Toolchain`
- `LaTeX compiler to use` 修改为 `xelatex`
- `bibTeX compiler to use` 修改为 `xelatex`
- `Preview PDF after building process` 选择 `Do nothng`

## 将win下字库迁移到linux下

因为win下大多字体均是微软公司授权或其他公司向用户授权，大多是非开源字体，因此在`Linux`或`TeX`发型版本中均不自带。但在发型书籍时候，使用的大多字体：英文下的新罗马字体（***Times New Roman***），中文下宋体(SimSun)，楷体（KaiTi）均为非开源字体。若在Linux下使用，需要自行移植安装。

**注意：不能直接安装，直接安装后会存在于本用户的目录下，texlive仅仅调用系统共有字体文件夹下所有字体步骤如下**

### 复制win字体到Linux字体文件夹

windows字体文件夹位置：*C://WINDOWS/Fonts*

Linux下字体文件夹位置：*/usr/share/fonts*

建议将windows下所有字体复制到/usr/share/fonts/windows-fonts下，使用cp命令。

例如在windows字体文件夹下打开终端

```shell
sudo mkdir /usr/share/fonts/windows-fonts
sudo cp * /usr/share/fonts/windows-fonts
```

### 刷新字体缓存，使字体生效

```shell
sudo fc-cache -f -v
```

# Win环境下LaTeX配置

windows环境下方案很多，这里推荐直接安装相同的Texlive套件，其直接包含**MiKTeX**和**CTeX**

[点击转至Texlive国内清华源](https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/Images/)

下载文件类型为ios，请解压或挂载后安装。

针对前端的IDE仍建议使用Atom，有了能力者可以使用WinEdt。

- Atom 配置见2.2，但注意：请从官网直接下载atom并安装，其余配置一致；
- 因为不存在字体缺失问题，直接使用即可。
