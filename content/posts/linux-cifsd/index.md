---
title: "在Linux上安装cifsd启用SMB共享"
date: 2021-03-17T19:14:22+08:00
#featuredImage: "cover.png"
slug: 4ab61985
categories: [学习日记]
tags: [cifsd, SMB, Linux]
---

用树莓派做了一个网络存储，想挂载到系统上，便想到了 SMB 协议，之前用过 Samba 但是性能实属不行，恰巧在 Github 上看到了 cifsd 这个项目，并且支持 RDMA 所以在树莓派上面安装试试，结果发现效果还不错，速度蛮快的。

<!--more-->

## 安装必要的依赖

Github 上只有源码，没有现成的二进制文件，软件仓库里面也没有，所以必须自己编译(其实并不意外，这个程序是作为内核模块运行的，所以才有如此之高的性能)。

```shell
sudo apt update
sudo apt install linux-headers gcc make git autoconf \
libtool pkg-config libnl-3-dev libnl-genl-3-dev libglib2.0-dev -y
```

## 编译安装 cifsd

克隆并进入目录

```shell
cd ~
git clone https://github.com.cnpmjs.org/cifsd-team/cifsd.git
cd cifsd
```

编译并安装，如果出现问题。。。我相信你百度能力一直可以。

```shell
make                # 编译
sudo make install   # 安装
```

## 编译安装 ksmbd-tools

克隆并进入目录

```shell
cd ~
git clone https://github.com.cnpmjs.org/cifsd-team/cifsd-tools.git
cd ksmbd-tools
```

编译并安装，如果出现问题。。。我相信你百度能力一直可以。(悄悄告诉你，其实这一步最容易出错)

```shell
./autogen.sh
./configure
make
sudo make install
```

## 加载模块并设置开机自动加载

加载模块，并编辑`/etc/modules-load.d/ksmbd.conf`文件以设置开机自动加载。。。算了，怕你不会，直接运行下面的指令吧

```shell
sudo modprobe ksmbd
echo 'ksmbd' | sudo tee /etc/modules-load.d/ksmbd.conf > /dev/null
```

用`lsmod | grep ksmbd`查看模块是否被加载

## 创建并编辑配置

先创建配置文件夹

```shell
sudo mkdir /etc/ksmbd/
```

### 创建用户

```shell
# $USER 换成你想用的用户名
sudo ksmbd.adduser -a $USER
# 输密码，回车，再输一遍，回车
```

### 创建共享

参考[文档(Github)](https://github.com/cifsd-team/ksmbd-tools/blob/master/Documentation/configuration.txt)对`/etc/ksmbd/smb.conf`进行配置，下面是一键生成示例配置的指令

```shell
echo '[global]
tcp port = 445

[share]
comment = Share
path = /home/share
read only = no
browseable = yes
writeable = yes' | \
sudo tee /etc/ksmbd/smb.conf > /dev/null
```

> 经测试`tcp port = 445`这一行必须存在且需在`[global]`键下面，否则服务将无法在网络上监听。

## 启动测试

使用下面的指令启动服务，并用其他设备连接测试(别和我说你不会连接 SMB)，如果测试成功就可以停止服务进行下一步了。

```shell
# 启动
sudo ksmbd.mountd
# 停止
sudo ksmbd.control -s
```

## 创建 sevice 文件实现开机自启

### 创建 sevice 文件

创建`/etc/systemd/system/cifsd.service`文件，以下是一键指令

```shell
echo '[Unit]
Description=CIFSD
After=network.target network-online.target nss-lookup.target

[Service]
Type=oneshot
StandardError=journal
User=root
Group=root
ExecStart=/usr/local/sbin/ksmbd.mountd
ExecStop=/usr/local/sbin/ksmbd.control -s
RemainAfterExit=true
Restart=on-failure
RestartSec=1s

[Install]
WantedBy=multi-user.target' | \
sudo tee /etc/systemd/system/cifsd.service > /dev/null
```

### 设置开机自启

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now cifsd   # 设置自启并立即启动
sudo systemctl status cifsd         # 查看当前进程状态
```

> 大功告成，可以存你喜欢的小姐姐了  
> 因为 `cifsd` 支持 `RDMA` 可以不经过 CPU 直接传输数据，所以理论上是可以跑满网络带宽的  
> 至于你的带宽有多少你可以使用 `iperf3` 进行测试
