---

title:  Tmux 快捷键速查表
date: 2020-10-01
---

# Tmux 快捷键速查表

启动新会话：

```
tmux [new -s 会话名 -n 窗口名]
```

恢复会话：

```
tmux at [-t 会话名]
```

列出所有会话：

```
tmux ls
```

关闭会话：

```
tmux kill-session -t 会话名
```

关闭除指定会话外的所有会话：

```
tmux kill-session -a -t 会话名
```

销毁所有会话并停止`Tmux`：

```
tmux kill-server
```

# 在 Tmux 中，按下 Tmux 前缀 `ctrl+b`，然后：

## 会话

```
:new<回车>  	启动新会话
s           列出所有会话
$           重命名当前会话
```

## 窗口

```
c	创建新窗口
w	列出所有窗口
n	后一个窗口
p	前一个窗口
f	查找窗口
,	重命名当前窗口；这样便于识别
.	修改当前窗口编号；相当于窗口重新排序
&	关闭当前窗口
```

## 调整窗口排序

```
:swap-window -s 2 -t 0	交换2号和0号窗口
:swap-window -t 0		交换当前和0号窗口
:move-window -t 0		移动当前窗口到0号
```

## 窗格

```
%	垂直分割
"	水平分割
o	前一个窗格
;	后一个窗格
x	关闭窗格
sapce(空格键)	切换布局
q	显示每个窗格是第几个，当数字出现的时候按数字几就选中第几个窗格
{	与上一个窗格交换位置
}	与下一个窗格交换位置
z	切换窗格最大化/最小化
```

## 同步窗格

如果您将窗口划分为多个窗格，则可以使用`synchronize-panes`选项同时向每个窗格发送相同的键盘输入：

```
:setw synchronize-panes [on/off]
```

你可以指定开启`on`或停用`off`，否则重复执行命令会在两者间切换。 这个选项值针对当前个窗口有效，不会影响别的会话和窗口。 完事儿之后再次执行命令来关闭。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/Tmux%20快捷键速查表/synchronize-panes.gif)

## 调整窗格尺寸

如果你不喜欢默认布局，可以重调窗格的尺寸。虽然这很容易实现，但一般不需要这么干。这几个命令用来调整窗格：

```
:resize-pane -D          当前窗格向下扩大 1 格
:resize-pane -U          当前窗格向上扩大 1 格
:resize-pane -L          当前窗格向左扩大 1 格
:resize-pane -R          当前窗格向右扩大 1 格
:resize-pane -D 20       当前窗格向下扩大 20 格
:resize-pane -t 2 -L 20  编号为 2 的窗格向左扩大 20 格
```

## 杂项

```
d  退出 tmux（tmux 仍在后台运行）
t  窗口中央显示一个数字时钟
?  列出所有快捷键
:  命令提示符
```

## 配置选项

```
# 鼠标支持 - 设置为 on 来启用鼠标
:set -g mouse on

# 设置默认终端模式为 256color
:set -g default-terminal "screen-256color"

# 启用活动警告
:setw -g monitor-activity on
:set -g visual-activity on

# 窗口名列表居中
:set -g status-justify centre
```

