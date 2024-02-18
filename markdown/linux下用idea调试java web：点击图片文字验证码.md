---
title: linux下用idea调试java web：点击图片文字验证码
date: 2018-05-12
---

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/linux下用idea调试java%20web：点击图片文字验证码/timg%20(1).jpeg)

# 环境说明

`Linux`环境：`deepin 15.5` (`debian` / `x64`)
`tomcat`：`tomcat8`
`IDEA`：jetbrain IntelliJ IDEA Ultimate(支持java web环境)

# tomcat 安装配置

## 安装tomcat8

```bash
sudo apt-get update
sudo apt-get install tomcat8
```

## 设置tomcat文件权限

- Tomcat home directory : /usr/share/tomcat8
- Tomcat base directory : /var/lib/tomcat8

```bash
cd /usr/share/tomcat8 && sudo chmod -R 755 *
cd /var/lib/tomcat8 && sudo chmod -R 755 *
```

## 启用与关闭tomcat

```bash
sudo service tomcat8 start  #开启tomcat8服务，会占用8080端口
sudo service tomcat8 stop   #关闭tomcat8服务
```

# 文件环境

**run/debug 参数**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/linux下用idea调试java%20web：点击图片文字验证码/afa4ff202d49f68a60da8144c09f98ef.png)

**项目结构**

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/linux下用idea调试java%20web：点击图片文字验证码/1eb3aa69d517bfd27e79dd508d42a17a.png)

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/linux下用idea调试java%20web：点击图片文字验证码/1f016e3d1504ea1646acafa80361b21e.png)

#### 文件结构

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/linux下用idea调试java%20web：点击图片文字验证码/895dad32cc1dc053ebcbf7d87115fa66.png)

**JcaptchaServlet源码：后端生成验证图片**

```java
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Random;

public class JcaptchaServlet extends HttpServlet {
    private Random random = new Random();
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int height = 220;  //图片高
        int width = 220;  //图片宽
        BufferedImage image = new BufferedImage(width,height,BufferedImage.TYPE_INT_RGB);
        Graphics2D g =  (Graphics2D) image.getGraphics();
        String picPath= JcaptchaServlet.class.getClassLoader().getResource("../image/"+(random.nextInt(4)+1)+".jpg").getPath();  //读取本地图片，做背景图片
        g.drawImage(ImageIO.read(new File(picPath)), 0, 20, width, height, null); //将背景图片从高度20开始
        g.setColor(Color.white);  //设置颜色
        g.drawRect(0, 0, width-1, height-1); //画边框

        g.setFont(new Font("宋体",Font.BOLD,20)); //设置字体
        Integer x=null,y=null;  //用于记录坐标
        String target=null; // 用于记录文字
        for(int i=0;i<4;i++){  //随机产生4个文字，坐标，颜色都不同
            g.setColor(new Color(random.nextInt(50)+200, random.nextInt(150)+100, random.nextInt(50)+200));
            String str=getRandomChineseChar();
            int a=random.nextInt(width-100) + 50;
            int b=random.nextInt(height-70) + 55;
            if(x==null){
                x=a; //记录第一个x坐标
            }
            if(y==null){
                y=b;//记录第一个y坐标
            }
            if(target==null){
                target=str; //记录第一个文字
            }
            g.drawString(str, a, b);
        }
        g.setColor(Color.white);
        g.drawString("点击"+target, 0,20);//写入验证码第一行文字  “点击..”
        request.getSession().setAttribute("gap",x+":"+y);//将坐标放入session
        //5.释放资源
        g.dispose();
        //6.利用ImageIO进行输出
        ImageIO.write(image, "jpg", response.getOutputStream()); //将图片输出

    }
    //网上找的，随机产生汉字的方法
    private String getRandomChineseChar()
    {
        String str = null;
        int hs, ls;
        Random random = new Random();
        hs = (176 + Math.abs(random.nextInt(39)));
        ls = (161 + Math.abs(random.nextInt(93)));
        byte[] b = new byte[2];
        b[0] = (new Integer(hs).byteValue());
        b[1] = (new Integer(ls).byteValue());
        try
        {
            str = new String(b, "GBk"); //转成中文
        }
        catch (UnsupportedEncodingException ex)
        {
            ex.printStackTrace();
        }
        return str;
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

}
```

**Login源码：用于登陆正确与否确认**

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub
        response.setContentType("text/html;charset=utf-8"); //设置编码
        //获取前端传来的坐标

        String xs=request.getParameter("x");
        String ys=request.getParameter("y");
        HttpSession session = request.getSession();

        String str = (String) session.getAttribute("gap");//获取session中的gap
        if(str==null){
            response.getWriter().write("验证码超时");
            return;
        }
        String[] split2 = str.split(":");
        int x=    Integer.parseInt(xs);
        int y=Integer.parseInt(ys);
        int x1=    Integer.parseInt(split2[0]);
        int y1=Integer.parseInt(split2[1]);
        if(x1-2<x && x<x1+22 && y1-22<y && y<y1+2){  //若前端上传的坐标在session中记录的坐标的一定范围内则验证成功
            response.getWriter().write("验证成功");
        }else{
            response.getWriter().write("验证失败");
        }
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub
        doGet(request, response);
    }

}
```

**web.xml：servlet配置参数**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://xmlns.jcp.org/xml/ns/javaee" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd" id="WebApp_ID" version="3.1">
    <display-name>CheckCode</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
        <welcome-file>default.html</welcome-file>
        <welcome-file>default.htm</welcome-file>
        <welcome-file>default.jsp</welcome-file>
    </welcome-file-list>

    <servlet>
        <servlet-name>captcha</servlet-name>
        <servlet-class>JcaptchaServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>Login</servlet-name>
        <servlet-class>Login</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Login</servlet-name>
        <url-pattern>*.shtml</url-pattern>
    </servlet-mapping>

    <servlet-mapping>
        <servlet-name>captcha</servlet-name>
        <url-pattern>/captcha.svl</url-pattern>
    </servlet-mapping>
</web-app>
```

**index.jsp：前端界面**

```html
<html lang = "zh-CN">
    <head>
        <meta charset="UTF-8">
        <script type="text/javascript" src="{pageContext.request.contextPath}/js/jquery.min.js">                  </span>(function(){
            <span class="katex math inline">("#image").click(function(event){                 var obj=this;                 var x=event.offsetX;//获取点击时鼠标相对图片坐标                 var y=event.offsetY;                 </span>.ajax({
                    url:"login.shtml", //ajax提交
                    type:"post",
                    data:{'x':x,"y":y},
                    success:function(data){

                        alert(data)
                        obj.src=obj.src+"?date="+new Date();
                    }
                })
            });
        })
        &lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;img id="image" src="${pageContext.request.contextPath}/captcha.svl" style="cursor: pointer;" &gt;
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>
<ul>
<li>注意：需要另行配置依赖（位置见结构图）<br />
jar包：<code>javax.servlet-api-4.0.0.jar</code><br />
jQuery包：<code>jquery.min.js</code>：<code>v1.11.3</code></li>
</ul>
								</div>
			
		<div class="section section-blog-info">
			<div class="row">
				<div class="col-md-6">
					<div class="entry-categories">分类：						<span class="label label-primary"><a href="http://liuchang.men/category/uncategorized/">未分类</a></span>					</div>
									</div>
				
        <div class="col-md-6">
            <div class="entry-social">
                <a target="_blank" rel="tooltip"
                   data-original-title="分享到 Facebook"
                   class="btn btn-just-icon btn-round btn-facebook"
                   href="https://www.facebook.com/sharer.php?u=http://liuchang.men/2018/05/12/linux%e4%b8%8b%e7%94%a8idea%e8%b0%83%e8%af%95java-web%ef%bc%9a%e7%82%b9%e5%87%bb%e5%9b%be%e7%89%87%e6%96%87%e5%ad%97%e9%aa%8c%e8%af%81%e7%a0%81/">
                   <i class="fa fa-facebook"></i>
                </a>
                
                <a target="_blank" rel="tooltip"
                   data-original-title="分享至微博"
                   class="btn btn-just-icon btn-round btn-twitter"
                   href="http://twitter.com/share?url=http://liuchang.men/2018/05/12/linux%e4%b8%8b%e7%94%a8idea%e8%b0%83%e8%af%95java-web%ef%bc%9a%e7%82%b9%e5%87%bb%e5%9b%be%e7%89%87%e6%96%87%e5%ad%97%e9%aa%8c%e8%af%81%e7%a0%81/&#038;text=linux%E4%B8%8B%E7%94%A8idea%E8%B0%83%E8%AF%95java%20web%EF%BC%9A%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E6%96%87%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81">
                   <i class="fa fa-twitter"></i>
                </a>
                
                <a rel="tooltip"
                   data-original-title=" Share on Email"
                   class="btn btn-just-icon btn-round"
                   href="mailto:?subject=linux下用idea调试java%20web：点击图片文字验证码&#038;body=http://liuchang.men/2018/05/12/linux%e4%b8%8b%e7%94%a8idea%e8%b0%83%e8%af%95java-web%ef%bc%9a%e7%82%b9%e5%87%bb%e5%9b%be%e7%89%87%e6%96%87%e5%ad%97%e9%aa%8c%e8%af%81%e7%a0%81/">
                   <i class="fa fa-envelope"></i>
               </a>
            </div>
		</div>			</div>
			<hr>
			
<div id="comments" class="section section-comments">
	<div class="row">
		<div class="col-md-12">
			<div class="media-area">
				<h3 class="hestia-title text-center">
									</h3>
							</div>
			<div class="media-body">
					<div id="respond" class="comment-respond">
		<h3 class="hestia-title text-center">发表评论 <small><a rel="nofollow" id="cancel-comment-reply-link" href="/2018/05/12/linux%e4%b8%8b%e7%94%a8idea%e8%b0%83%e8%af%95java-web%ef%bc%9a%e7%82%b9%e5%87%bb%e5%9b%be%e7%89%87%e6%96%87%e5%ad%97%e9%aa%8c%e8%af%81%e7%a0%81/#respond" style="display:none;">取消回复</a></small></h3> <span class="pull-left author"> <div class="avatar"><img alt='' src='http://1.gravatar.com/avatar/783dfac778f4f63a2889a4d32384232c?s=64&#038;d=mm&#038;r=g' srcset='http://1.gravatar.com/avatar/783dfac778f4f63a2889a4d32384232c?s=128&#038;d=mm&#038;r=g 2x' class='avatar avatar-64 photo' height='64' width='64' /></div> </span>			<form action="http://liuchang.men/wp-comments-post.php" method="post" id="commentform" class="form media-body">
				<p class="logged-in-as"><a href="http://liuchang.men/wp-admin/profile.php" aria-label="已登入为admin。编辑您的个人资料。">已登入为admin</a>。<a href="http://liuchang.men/wp-login.php?action=logout&amp;redirect_to=http%3A%2F%2Fliuchang.men%2F2018%2F05%2F12%2Flinux%25e4%25b8%258b%25e7%2594%25a8idea%25e8%25b0%2583%25e8%25af%2595java-web%25ef%25bc%259a%25e7%2582%25b9%25e5%2587%25bb%25e5%259b%25be%25e7%2589%2587%25e6%2596%2587%25e5%25ad%2597%25e9%25aa%258c%25e8%25af%2581%25e7%25a0%2581%2F&amp;_wpnonce=92457eb6ae">登出？</a></p><div class="form-group label-floating is-empty"> <label class="control-label">在想些什么？</label><textarea id="comment" name="comment" class="form-control" rows="6" aria-required="true"></textarea><span class="hestia-input"></span> </div><p class="form-submit"><input name="submit" type="submit" id="submit" class="btn btn-primary pull-right" value="发表评论" /> <input type='hidden' name='comment_post_ID' value='625' id='comment_post_ID' />
<input type='hidden' name='comment_parent' id='comment_parent' value='0' />
</p><input type="hidden" id="_wp_unfiltered_html_comment_disabled" name="_wp_unfiltered_html_comment_disabled" value="7d727c2e29" /><script>(function(){if(window===window.parent){document.getElementById('_wp_unfiltered_html_comment_disabled').name='_wp_unfiltered_html_comment';}})();
			
			
```
