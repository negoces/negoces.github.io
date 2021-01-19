---
title: "树莓派+Clash实现透明代理"
date: 2021-01-19T20:55:39+08:00
#featuredImage: "cover.png"
slug: d7266c81
categories: [经验记录]
tags: [Linux, Proxy]
#draft: true
---

透明代理的透明即为用户不需要进行任何设置，察觉不到其存在。至于代理是什么，懂得都懂。

<!--more-->

## 准备

首先你得有个树莓派或者任意一个能装 Linux 系统并且能联网的设备(甚至可以是路由器，不过本文章不适用)，然后你得会配置Clash且有一定的Linux知识。

本文以树莓派为例子

清单:

+ 树莓派3B+(RaspberryOS(64位))
+ Clash_linux_armv8可执行文件

## 解决53(DNS监听)端口占用问题


```shell
#打开 /etc/systemd/resolved.conf 文件
sudo nano /etc/systemd/resolved.conf
#找到DNSStubListener 修改为 DNSStubListener=no
DNSStubListener=no
```

{{< admonition note "其他软件占用" >}}
若系统中安装有dnsencrypt或dnsmasq等软件，请卸载，此类软件也会占用53端口
{{< /admonition >}}

## 开启Linux内核转发

```shell
#打开/etc/sysctl.conf文件
sudo nano /etc/sysctl.conf
#找到net.ipv4.ip_forward将值修改为1
net.ipv4.ip_forward = 1
#立即生效
sudo sysctl -p
```

> 待续...