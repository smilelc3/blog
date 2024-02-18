---
title: 视听说在线平台（Unipus）网页漏洞的提交
date: 2017-09-20
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/252709806-e1505914721349-1024x768.jpg)

> ——致北京工商大学外国语学院的一封信

 北京工商大学向来致力为各位学生提供一个优质，公平的教育环境，为培养学生成为各方面并同发展的未来国家栋梁人才而全力以赴。在英语学习方面，学校尤为重视，特设定英语四级考试通过为毕业条件；同时为四、六级成绩优异考生提供奖金支持。因此，在平时课堂练习时，学校采用了《新标准大学英语》系列教材，该教材配套的《视听说教程》为一个优秀的在线教育平台，为同学们提供了口语练习，写作练习，填空，选择题等多种多样的强化学习方式。

​        但人无完人，再好的平台也有其欠缺的一面。近日，我在使用《视听说3》时，运用对网页源码解析的方式，发现以下问题：

1. **登录密码全部采用默认密码nhce111**

该情况是多年的一个问题，我承认，设置默认密码，便于教室端对学生学习进度以及学习成绩进行掌握。该问题为同学间互相查看答案提供了一个途径，也为我接下来发现的一个更为严重的问题提供了便捷。

2. **在网页源码中保存有答案信息**

Unipus平台中各章节均有固定的网址格式(以视听说3为例)：

<http://192.168.115.248:81/book/book183/U2_S2_2.php>

其访问结构为：

> 服务器IP:81端口/book/book/book183(书本信息)/U(章号)_S(节号)_(小节号).php

通过对所有本书任务进度表格（图1）的解析

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/unipus.png)

不难推测出所有作业所对应的php网址，如下图所示代码。

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/unipus_1.png)

通过运用chrome浏览器的开发者工具箱，我通过对源码的分析，发现在php脚本script标签的下，存在#answer函数下。其中保存有用户所填的答案，以及该题的正确答案，见下图：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/unipus_2.png)

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/unipus_3.png)

上图即是该题的正确答案（#^符号分割）。即认为：视听说3教程的答案对用户是公开的，任何人要可以对源码进行解析，都可以挖掘出正确答案。这一点，无异于考试时，直接把答案印在某些人的试卷上，破坏公平竞争。

可能老师认为这一点并无关大碍，认为只有极少数人员会采用这种方式，但如果该情况被其他一些有心人发现，并针对该漏洞进行开发，会实现下列功能。

因为大家基本都采用默认密码形式，因此只需要掌握全体同学学号，既可以模拟登录。并通过get协议保存服务器所保存的cookies值，访问各章节的url，保存答案。最后通过伪造登录信息，构建data form，批量用post协议提交答案。

通过以上的方式，简单来说，就可以轻松达到：只需要账号（学号），就可以刷章节满分答案！而且单账号处理时间< 3s，效果如图：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/unipus_4.png)

**而且更可能的情况是，通过对提交的答案的控制，亦可以控制分数使其为代码执行者所想的分数。**

希望学校能稍稍重视该问题，也是我的一点荣幸。

2017-9-14

---

*备注：以下代码均由本人进行开发，并未对外进行公布和流传，仅仅做实验性质。如果需要，可立即对代码源文件进行删除*

```python
# main.py
from ans_deal import work
import requests
map= [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],

    [1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0],

    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0],

    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]
cookies = input()
post_headers = {
    'Host': '192.168.115.248:81',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    # 'Referer': 'http://192.168.115.248:81/book/book183/U1_S2_5.php',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh,zh-CN;q=0.8',
    'Cookie': 'NCCE=' + cookies
}
need = 2
SectionID = 0
SisterID = 0
ItemID = 0
for col in range(0, need):
    for row in range(0,23):
        UnitID = col + 1
        if row <= 4:
            SectionID = 1
            SisterID = row + 1
        elif row <= 9:
            SectionID = 2
            SisterID = row - 4
        elif row <= 15:
            SectionID = 3
            SisterID = row - 9
        elif row <= 17:
            SectionID = 4
            SisterID = row - 15
        elif row <= 22:
            SectionID = 4
            SisterID = row - 17
        if map[row][col] == 1:
            url = 'http://192.168.115.248:81/book/book183/U'+str(UnitID)+'_S'+str(SectionID)+'_'+str(SisterID)+'.php'
            TestID = str(SectionID) + '.' + str(SisterID)
            KidID = '1'
            ItemID = col *23 + row + 1
            print(url)
            ans = work(url, cookies)
            form = {
                'UnitID': str(UnitID),
                'SectionID': str(SectionID),
                'SisterID': str(SisterID),
                'TestID': TestID,
                'KidID': KidID,
                'ItemID': str(ItemID),
                'Item_0':''
            }
            for x,t in enumerate(ans):
                form['Item_' + str(x)] = t
            print(form)
            requests.post(url=url, headers = post_headers, data= form)
```

```python
#ans_deal.py
#coding=utf-8
import requests
from bs4 import BeautifulSoup
def deal_answer(list):
    #list格式 A^B^C^D^
    ans =[]
    word = ''
    for i,t in enumerate(list):
        if t != '^':
            word += t
        else:
            if word[-1]=='#':
                word = word[:-1]
            if word.find('|') != -1:
                word = word[:word.find('|')]
            ans.append(word)
            word = ''
    return ans

def work(url, cookies):
    #url = 'http://192.168.115.248:81/book/book183/U1_S3_5.php'
    # 选择题'http://192.168.115.248:81/book/book183/U1_S3_3.php'
    # 填空题'http://192.168.115.248:81/book/book183/U1_S3_4.php'
    # 排序题'http://192.168.115.248:81/book/book183/U1_S3_5.php'
    # 表格勾选题 'http://192.168.115.248:81/book/book183/U2_S3_5.php'

    #cookies = 'ac51297530abeb41668a2fe69aec80a8'

    get_headers = {
        'Host': '192.168.115.248:81',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Origin': 'http://192.168.115.248:81',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        # 'Referer': 'http://192.168.115.248:81/book/book183/U1_S2_5.php',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,zh-CN;q=0.8',
        'Cookie': 'NCCE=' + cookies
    }

    wb_data = requests.get(url, headers=get_headers)

    wb_data.encoding = 'utf-8'
    # print(wb_data.apparent_encoding)
    soup = BeautifulSoup(wb_data.text, 'lxml')

    answers = soup.find_all('script')[-1].get_text()
    # print(answers)
    answer = ''
    # 选择题
    # judgeRadio('.question','','C^B^A^C^D^A')
    num = 0
    if answers.find("judgeRadio") != -1:
        for x, t in enumerate(answers[answers.find("judgeRadio"): len(answers) + 1]):
            if t == ';':
                break
            if t == '\'':
                num += 1
            if num == 5 and t != '\'':
                answer += t
            if num == 6:
                answer += '^'
                break
        if answers != '':
            ans = deal_answer(answer)
            print(ans)
    # 排序题
    # judgeDragQuestion('.content-right .content-div','','D^B^E^A^C','^',{top:0,left:-487})

    if answers.find("judgeDragQuestion") != -1:
        for x, t in enumerate(answers[answers.find("judgeDragQuestion"): len(answers) + 1]):
            if t == ';':
                break
            if t == '\'':
                num += 1
            if num == 5 and t != '\'':
                answer += t
            if num == 6:
                answer += '^'
                break
        if answers != '':
            ans = deal_answer(answer)
            tem = ''
            for x, t in enumerate(ans):
                if x != len(ans) - 1:
                    tem += t + ','
                else:
                    tem += t
            ans = []
            ans.append(tem)
            print(ans)
    # 表格勾选题
    # judgeTableQuestion('table input[type=checkbox]','','0^3^4^7^9^11^12','^')

    if answers.find("judgeTableQuestion") != -1:
        for x, t in enumerate(answers[answers.find("judgeTableQuestion"): len(answers) + 1]):
            if t == ';':
                break
            if t == '\'':
                num += 1
            if num == 5 and t != '\'':
                answer += t
            if num == 6:
                answer += '^'
                break
        if answers != '':
            ans = deal_answer(answer)
            tem = ''
            for x, t in enumerate(ans):
                if x != len(ans) - 1:
                    tem += t + ','
                else:
                    tem += t
            ans = []
            ans.append(tem)
            print(ans)

    # 填空题
    # judgeCompletion('.content-inner input[name^=Item_]','','looking forward#^apart from#^on#^used to get very cross#^angel#^pretty sad#^some cash','#^')
    if answers.find("judgeCompletion") != -1:
        for x, t in enumerate(answers[answers.find("judgeCompletion"): len(answers) + 1]):
            if t == ';':
                break
            if t == '\'':
                num += 1
            if num == 5 and t != '\'':
                answer += t
            if num == 6:
                answer += '^'
                break
        if answers != '':
            ans = deal_answer(answer)
            print(ans)
    return ans
```

**学校的回复**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/视听说在线平台（Unipus）网页漏洞的提交/批注%202019-03-20%20142619.png)
