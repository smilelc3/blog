---
title: 使用vagrant搭建hadoop+spark环境
date: 2020-02-24
---

## 1. 环境准备

1. 下载vagrant和virtualbox，并安装

- vagrant:https://www.vagrantup.com/

- virtualbox:https://www.virtualbox.org/

  注意：vagrant2.2.7发布，本次更新主要**添加了对virtualbox6.1.x版本的支持。**

2. 虚拟机配置

- 1台master：内存1024MB
- 2台slave：内存512MB

## 2. 使用vagrant部署虚拟机

1. 安装后vagrant，需提前安装`vagrant-hostmanager`插件，以便host管理

   ```shell
   vagrant plugin install vagrant-hostmanager
   ```

2. 从vagrant官网下载ubuntu 16镜像：

   ```shell
   vagrant box add ubuntu/xenial64
   ```

   也可以使用其他镜像，镜像地址：https://app.vagrantup.com/boxes/search

3. 创建hadoopProject文件夹（可自定），并创建两个文件`Vagrantfile`和`init.sh`

   ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223164926490.png)

   * VagrantFile是vagrant的**启动配置文件**， 
   * init.sh是**初始环境的安装脚本**

4. 编辑VagrantFile文件， 内容如下:

   ```ruby
   Vagrant.configure("2") do |config|
       config.vm.define :master1, primary: true do |master|
           master.vm.provider "virtualbox" do |v|
               v.customize ["modifyvm", :id, "--name", "hadoop-master1", "--memory", "1024"]
   		end
   		master.vm.box = "ubuntu/xenial64"
   		master.vm.hostname = "hadoop-master1"
   		master.vm.network :private_network, ip: "192.168.10.10"
   		master.vm.network "forwarded_port", guest: 22, host: 2222, id: "ssh", disabled: "true"
   		master.vm.network "forwarded_port", guest: 22, host: 2220
       end
   
      (1..2).each do |i|
       config.vm.define "slave#{i}" do |node|
           node.vm.box = "ubuntu/xenial64"
           node.vm.hostname = "hadoop-slave#{i}"
           node.vm.network :private_network, ip: "192.168.10.1#{i}"
   		node.vm.network "forwarded_port", guest: 22, host: 2222, id: "ssh", disabled: "true"
   		node.vm.network "forwarded_port", guest: 22, host: "222#{i}"
           node.vm.provider "virtualbox" do |vb|
             vb.memory = "512"
           end
        end
      end
   
     #manage hosts file 
     config.hostmanager.enabled = true
     config.hostmanager.manage_host = true
     config.hostmanager.manage_guest = true
   
      #provision
      config.vm.provision "shell", path: "init.sh", privileged: false
   end
   ```

   从代码可以看到， 我们一共创建了3个虚拟机环境 ，分别是master1, slave1, slave2。并分配好IP地址和内存空间。

   注意：在解决多个SSH端口时，需要先禁用默认的ssh转发，再添加自定义转发，才能生效。

5. 在当前目录启动vagrant，会自动依照`Vagrantfile`配置文件创建虚拟机并配置。

   ```shell
   vagrant up
   ```

   ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223165354776.png)

   启动过程中如果有打印如下信息， 一般稍等即可，出错可在VirtulaBox中删除虚拟机及文件重试。

   ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223170534646.png)

   正常启动后，我们就可以在virtualBox中看到创建的虚拟机。

   ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223171011923.png)

   正常启动后，我们就可以使用以下命令登录到虚拟机：

   ```shell
   vagrant ssh master1
   ```

   可以直接按照host名字Ping操作：

   ![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223171242368.png)
   **注意：此时默认用户名和密码都是`vagrant`**

   此时，主机仅允许公钥私钥配对SSH链接，建议打开密码认证访问，编辑文件` /etc/ssh/sshd_config`，修改如下配置为yes：

   ```
   PasswordAuthentication yes
   ```

   重启ssh服务

   ```shell
   sudo service ssh restart
   ```

   

   6. 编写provision文件
       前面安装vagrant的时候说到，provision的作用是帮助我们进行主机环境的初始化工作，现在我们来编写`init.sh`，具体内容根据实际情况进行删减。在provision里，我只是安装了linux环境必需的一些组件。

   

   ```shell
   sudo apt update         # 更新apt
   sudo apt install openssh-server		# 安装SSH
   sudo apt install openjdk-8-jdk     # 安装JAVA
   ```

   * 即使因为网络问题导致安装不成功，也可以手动逐个安装。

   编写完后，运行命令进行生效

   ```shell
   vagrant provision
   ```



## 3. 配置Hadoop

现在我们有三台机器:

```
hadoop-master1		192.168.10.10
hadoop-slave1		192.168.10.11
hadoop-slave2		192.168.10.12
```

Hadoop 集群配置过程:

1. **选定一台机器作为 Master，在所有主机上配置网络映射；**
2. **在 Master 主机上配置hadoop用户、安装SSH server、安装Java环境；**
3. **在 Master 主机上安装Hadoop，并完成配置；**
4. **在其他主机上配置hadoop用户、安装SSH server、安装Java环境；**
5. **将 Master 主机上的Hadoop目录复制到其他主机上；**
6. **开启、使用 Hadoop。**

----

### 配置基础环境和SSH互信

所有主机配置hadoop用户、安装SSH server、安装Java环境（前步已执行成功的可以跳过）：

```shell
sudo useradd -m hadoop -s /bin/bash     # 创建hadoop用户
sudo passwd hadoop          # 修改hadoop用户密码
sudo adduser hadoop sudo    # 增加hadoop管理员权限
```

注销并使用 Hadoop 用户登录

```shell
sudo apt update         # 更新apt
sudo apt install openssh-server		# 安装SSH
sudo apt install openjdk-8-jdk     # 安装JAVA
```

设置JAVA_HOME环境变量

```shell
sudo nano ~/.bashrc
# 最后面加上
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

使 JAVA_HOME 变量生效：

```shell
source ~/.bashrc    # 使变量设置生效
```

在 Master 主机上执行：

```shell
cd ~/
mkdir .ssh
cd ~/.ssh
ssh-keygen -t rsa              # 一直按回车就可以
cat id_rsa.pub >> authorized_keys
scp ~/.ssh/id_rsa.pub hadoop@hadoop-slave1:/home/hadoop/ # 传输公钥到slave1
scp ~/.ssh/id_rsa.pub hadoop@hadoop-slave2:/home/hadoop/ # 传输公钥到slave2
```

接着在 slave1 节点和slave2节点上保存公钥

```shell
cd ~/
mkdir .ssh
cat ~/id_rsa.pub >> ~/.ssh/authorized_keys
```

如果master主机和slave01、slave02主机的用户名一样，那么在master主机上直接执行如下测试命令，即可让master主机免密码登录slave01、slave02主机。

```shell
 ssh hadoop-slave1
```

### 安装Hadoop

先在master主机上做安装Hadoop，暂时不需要在slave1，slave2主机上安装Hadoop。稍后会把master配置好的Hadoop发送给slave1，slave2。
在master主机执行如下操作：

```shell
tar -zxf ~/hadoop-2.7.7.tar.gz -C /usr/local    # 解压到/usr/local中
cd /usr/local/
sudo mv ./hadoop-2.7.7/ ./hadoop            # 将文件夹名改为hadoop
sudo chown -R hadoop ./hadoop       # 修改文件权限
```

编辑~/.bashrc文件，末尾添加如下内容：

```shell
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```

接着让环境变量生效，执行如下代码：

```bash
source ~/.bashrc
```

### Hadoop集群配置

修改master主机修改Hadoop如下配置文件，这些配置文件都位于`/usr/local/hadoop/etc/hadoop`目录下。
修改`slaves`文件，把DataNode的主机名写入该文件，每行一个。

这里让hadoop-master1节点主机仅作为NameNode使用（不包含在slaves文件中）。

```
hadoop-slave1
hadoop-slave2
```

修改core-site.xml

```xml
<configuration>
	<property>
		<name>hadoop.tmp.dir</name>
		<value>/usr/local/hadoop/tmp</value>
		<description>Abase for other temporary directories.</description>
	</property>
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://hadoop-master1:9000</value>
	</property>
</configuration>
```

修改hdfs-site.xml：

```xml
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>3</value>
	</property>
</configuration>
```

修改mapred-site.xml（复制并修改文件名mapred-site.xml.template）

```shell
cp mapred-site.xml.template  mapred-site.xml
```

```xml
<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>
```

修改yarn-site.xml

```xml
<configuration>
	<!-- Site specific YARN configuration properties -->
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>hadoop-master1</value>
	</property>
</configuration>
```

配置好后，将 master 上的 /usr/local/Hadoop 文件夹复制到各个节点上。之前有跑过伪分布式模式，建议在切换到集群模式前先删除之前的临时文件。在 master 节点主机上执行：

```shell
cd /usr/local/
rm -rf /usr/local/hadoop/tmp   # 删除临时文件
rm -rf /usr/local/hadoop/logs/*   # 删除日志文件
tar -zcf ~/hadoop.master.tar.gz ./hadoop			# 打包hadoop
cd ~
scp ./hadoop.master.tar.gz hadoop-slave1:/home/hadoop
scp ./hadoop.master.tar.gz hadoop-slave2:/home/hadoop
```

在hadoop-slave1，hadoop-slave2节点上执行：

```shell
sudo rm -rf /usr/local/hadoop/
sudo tar -zxf ~/hadoop.master.tar.gz -C /usr/local
sudo chown -R hadoop /usr/local/hadoop
```

### 启动hadoop集群

在hadoop-master1主机上执行如下命令：

```shell
/usr/local/hadoop/bin/hdfs namenode -format
/usr/local/hadoop/sbin/start-all.sh
```

运行后，在hadoop-master1，hadoop-slave1，hadoop-slave2运行`jps`命令，查看：

hadoop-master1运行`jps`后，如下图（必须有四个进程）：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223203017947.png)

hadoop-slave1、hadoop-slave2运行`jps`后，如下图（必须有三个进程）：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223201614373.png)

## 4. 在Hadoop上配置Spark

### 下载Spark

访问[Spark官方下载地址](http://spark.apache.org/downloads.html)，按照如下图下载（不带Hadoop版本）。

<img src="https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223202025035.png" style="zoom:80%;" />

下载后，文件移到master虚拟机中，执行解压

```shell
cd ~
sudo tar -zxf spark-2.4.5-bin-without-hadoop.tgz -C /usr/local/
cd /usr/local/
sudo mv ./spark-2.4.5-bin-without-hadoop/ ./spark
sudo chown -R hadoop ./spark
```

### 配置环境变量

在hadoop-master1节点主机的终端中执行如下命令：

```bash
sudo nano ~/.bashrc
```

在~/.bashrc添加如下配置：

```bash
export SPARK_HOME=/usr/local/spark
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin
```

执行如下命令使得配置立即生效：

```bash
source ~/.bashrc
```

### Spark配置

在Master节点主机上进行如下操作：

- 配置slaves文件

```bash
cd /usr/local/spark/
cp ./conf/slaves.template  ./conf/slaves
```

slaves文件设置Worker节点。编辑slaves内容，把默认内容localhost替换成slave节点：

```
hadoop-slave1
hadoop-slave2
```

* 配置spark-env.sh文件

```shell
cp ./conf/spark-env.sh.template ./conf/spark-env.sh
```

添加如下内容：

```shell
export SPARK_DIST_CLASSPATH=$(/usr/local/hadoop/bin/hadoop classpath)
export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop
export SPARK_MASTER_IP=hadoop-master1
```

SPARK_MASTER_IP 指定 Spark 集群 Master 节点的 IP 地址或主机名。

配置好后，将Master主机上的/usr/local/spark文件夹复制到各个节点上。在Master主机上执行如下命令：

```shell
cd /usr/local/
tar -zcf ~/spark.master.tar.gz ./spark     # 打包spark
cd ~
scp ./spark.master.tar.gz hadoop-slave1:/home/hadoop
scp ./spark.master.tar.gz hadoop-slave2:/home/hadoop
```

在hadoop-slave1，hadoop-slave2节点上执行：

```shell
sudo rm -rf /usr/local/spark/
sudo tar -zxf ~/spark.master.tar.gz -C /usr/local
sudo chown -R hadoop /usr/local/spark
```

**注意：**由于我们使用`vagrant-hostmanager`插件，其会对本地hosts文件修改，导致主机名（host）直接与`127.0.1.1`绑定，若直接启动Spark master节点，会导致只在`127.0.1.1`提供服务，其他局域网内slave节点无法访问，因此需要编辑`/etc/hosts`文件，注释掉：

```shell
#127.0.1.1      hadoop-master1  hadoop-master1
```

### 启动Spark集群

1. 启动Spark集群前，要先**启动Hadoop集群**。在Master节点主机上运行如下命令：

```bash
/usr/local/hadoop/sbin/start-all.sh
```

2. **启动Master节点**， 在Master节点主机上运行如下命令：

```bash
/usr/local/spark/sbin/start-master.sh
```

在hadoop-master1节点上运行jps命令，可以看到多了`Master`进程：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223211744169.png)

3. **启动所有Slave节点**，在Master节点主机上运行如下命令：

```bash
/usr/local/spark/sbin/start-slaves.sh
```

分别在hadoop-slave1、hadoop-slave2节点上运行jps命令，可以看到多了`Worker`进程：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223210712522.png)

**在浏览器上查看Spark独立集群管理器的集群信息**

spark集群端口：8080 

spark-job监控端口：4040

namenode管理端口：50070

yarn端口：8088  

在master主机上打开浏览器，访问http://hadoop-master1:8080/，如下图：

![](https://raw.githubusercontent.com/smilelc3/blog/main/images/使用vagrant搭建hadoop+spark环境/image-20200223232355607.png)

### 关闭Spark集群

1. 关闭Master节点

   ```bash
   /usr/local/spark/sbin/stop-master.sh
   ```

2. 关闭Worker节点

   ```bash
   /usr/local/spark/sbin/stop-slaves.sh
   ```

3. 关闭Hadoop集群

   ```bash
   /usr/local/hadoop/sbin/stop-all.sh
   ```