# 树莓派4入门指南(无显示器)


<!--more-->

## 准备

所需材料:
+ 树莓派*1
+ SD卡*1
+ 树莓派系统镜像*1
+ PC*1
+ Etcher*1
+ 活人*1

## 制作带有系统的SD卡

打开Etcher，点击最左侧的`Flash from file`，选择你所下载的树莓派镜像，点击中间的`Select target`，勾选你的SD卡，点击`Select`，点击最右边的`Flash`等待烧录完即可。

烧录完之后系统里面会多出一个命名为`boot`的分区，在此分区里面创建一个空白的名为`ssh`的文件以开启ssh远程访问。

## 装配你的树莓派

插上SD卡，装上散热马甲(如果有的话)，插上网线，插上电源，静待开机

## 连接你的树莓派

前往你的路由器查看你的树莓派IP，一般主机名就是`raspberrypi`，我的树莓派分配到的IP是`10.0.0.181`，用ssh连接(默认用户名:`pi`密码:`raspberry`)

```shell
ssh pi@10.0.0.181
# 进去之后改一下密码
passwd
# 第一个输入当前密码，第二个和第三个是新密码
```

## 设置镜像并更新

> 我的配置用的是testing更新通道，软件比较新但也可能出现bug

```shell
$ sudo nano /etc/apt/sources.list
# 将文件修改如下
# /etc/apt/sources.list
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free
```

```shell
$ sudo nano /etc/apt/sources.list.d/raspi.list
# 将文件修改如下
# /etc/apt/sources.list.d/raspi.list
deb https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main
deb-src https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main
```

```shell
sudo apt update
sudo apt full-upgrade
```

## 设置中文

```shell
$ sudo nano /etc/environment
# 将文件修改如下
LANG=zh_CN.UTF-8
LANGUAGE="zh_CN:zh:en_US:en"
```

然后重启

然后，Enjoy youdelf!
