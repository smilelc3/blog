---
title: python+opencv 检测和跟踪运动物体
date: 2017-07-09
---

# 效果展示

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/python+opencv%20检测和跟踪运动物体/20170709145619-高质量和大小_1-AVC-高质量和大小.mp4_20170709_155500.960.jpg)

**最终效果视频**

<video src="https://raw.githubusercontent.com/smilelc3/blog/main/images/python+opencv%20检测和跟踪运动物体/20170709145619-高质量和大小_1-AVC-高质量和大小.mp4" controls preload="metadata"></video>

**监控+差值+黑白二值图像**

<video src="https://raw.githubusercontent.com/smilelc3/blog/main/images/python+opencv%20检测和跟踪运动物体/20170709145619-高质量和大小-AVC-高质量和大小.mp4" controls preload="metadata"></video>

# 代码

* 该程序**计算量要求较低**，可以部署在**树莓派**类的物联网设备上

## python包配置

```bash
sudo pip install argparse #用于解析参数
sudo pip install imutils #用于修改图片格式大小
sudo apt-get install libopencv-dev  
sudo apt-get install python-opencv  #安装opencv
```

## python代码

代码写的相当详细，注释的极其详细，不再赘述。（python版本2.7）

```python
#coding:utf-8
#必要的包
import argparse
import datetime
import imutils
import time
import cv2

#创建参数解释器并解析参数
ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the video file")
ap.add_argument("-a", "--min-area", type=int, default=1000, help="minimum area size")
args = vars(ap.parse_args())

#如果video参数为None, 那么我们从摄像头读取数据
if args.get("video", None) is None:
    camera = cv2.VideoCapture(0)
    originaltime = time.time()#记录时间
else:
    camera = cv2.VideoCapture(args["video"])
#初始化视频流的第一帧
firstFrame = None
num=0
#遍历视频的每一帧
while True:
    if time.time()-originaltime <= 2:  #等待摄像机开启并稳定
        (grabbed, frame) = camera.read()
    else:
        (grabbed, frame) = camera.read()
        #调用camera.read()返回一个２元组。元组第一个值是grabbed，表明是否成功从缓冲中读取frame。元组第二个值为frame本身
        text = "not exist"
        #表明正在监控的房间“没有被占领”。如果确实有活动，就更新该字符串
        if not grabbed:
            break
        #调整该帧的大小，转换为灰阶图像并且对其进行高斯模糊
        frame = imutils.resize(frame, width = 500)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)#灰阶图片
        gray = cv2.GaussianBlur(gray, (21, 21), 0)#高斯模糊

        #如果第一帧是None, 对其进行初始化
        if firstFrame is None:
            firstFrame = gray
            continue

        #计算当前帧和第一帧的不同
        frameDelta = cv2.absdiff(firstFrame, gray)#两幅图的差的绝对值输出到另一幅图上面来

        thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]#黑白二值化

        #扩展阈值图像填充孔洞，然后找到阈值图像上的轮廓
        thresh = cv2.dilate(thresh, None, iterations = 2)#图像膨胀
        (cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                                     cv2.CHAIN_APPROX_SIMPLE
                                     )#findcontours函数会“原地”修改输入的图像,只检测的外轮廓，仅保存矩形４个顶点


        #遍历轮廓
        for c in cnts:
            #如果轮廓太小，忽视轮廓
            if cv2.contourArea(c)<args["min_area"]:
                continue

            #计算轮廓边界，在当前帧中画出该框，并更新text
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x + w,y + h), (0, 255, 255), 2)
            text = "exist"

        #在当前帧上写文字以及时间戳
        cv2.putText(frame, "room stats:{}".format(text), (10, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        cv2.putText(frame, datetime.datetime.now().strftime("%A %d %B %Y %I:%M:%S%p"),
                    (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)

        #显示当前帧
        cv2.imshow("二值化图像", thresh)
        cv2.imshow("差值图像", frameDelta)
        cv2.imshow("监控", frame)
        cv2.waitKey(10)

        #对环境渐变的适应
        flag = True#标记是否值得更新（第一帧）背景帧
        for c in cnts:
            if cv2.contourArea(c)>args["min_area"]//4:
                flag = False
        if  flag is True:#新背景＝旧背景＊(1-0.618)＋当前无物体背景＊(0.618)
            firstFrame = cv2.addWeighted(firstFrame, 1-0.618, gray, 0.618, 0.0)
        #cv2.imwrite("Security Feed.png", frame)
        #cv2.imwrite("Thresh.png", thresh)
        #cv2.imwrite("Frame delta.png", frameDelta)
        #cv2.waitKey(0)
#清理摄像机资源并关闭打开的窗口
camera.release()
cv2.destroyAllWindows()
```
