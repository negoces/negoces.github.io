---
title: "树莓派4入门指南(无显示器)"
date: 2021-03-03T20:54:16+08:00
lastmod: 2021-04-03T12:54:16+08:00
#featuredImage: "cover.png"
slug: 04c00a0d
categories: [学习日记]
tags: [RaspberryPi]
---

树莓派 4 无头启动(Headless)入门指南

<!--more-->

{{< admonition danger "注意" true >}}

以下部分内容仅适用于 `Debian 10 (buster)` 系统，最新的指南请前往 [官网(英文)](https://www.raspberrypi.org/documentation/) 查阅。

{{< /admonition >}}

## 准备

所需材料:

- 树莓派\*1
- SD 卡\*1
- 树莓派系统镜像\*1
- PC\*1
- Etcher\*1
- 活人\*1

## 制作带有系统的 SD 卡

从 [官网](https://www.raspberrypi.org/software/operating-systems/) 或者 [TUNA](https://mirrors.tuna.tsinghua.edu.cn/raspberry-pi-os-images/) 下载 Raspberry Pi OS 的镜像(`raspios_lite_arm64`)。

打开 Etcher，点击最左侧的`Flash from file`，选择你所下载的树莓派镜像，点击中间的`Select target`，勾选你的 SD 卡，点击`Select`，点击最右边的`Flash`等待烧录完即可。

烧录完之后系统里面会多出一个命名为`boot`的分区，在此分区里面创建一个空白的名为`ssh`的文件以开启 ssh 远程访问。

{{< admonition note "连接到WiFi网络" false >}}
在`boot`分区创建`wpa_supplicant.conf`并编辑

```shell
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=<填写ISO 3166-1国家码>(建议使用`US`,`CN`可能会导致连接不上WiFi)

network={
 ssid="<无线名称>"
 psk="<无线密码>"
}
```

{{< /admonition >}}

{{< admonition note "使用USB启动" false >}}
一、更新`eeprom`

1. 准备一张 SD 卡，格式化成 FAT32 格式
2. 前往[Github](https://github.com/raspberrypi/rpi-eeprom/releases/)下载`rpi-boot-eeprom-recovery-xxx.zip`(要求 vl805 以上的版本)
3. 将 zip 内的文件解压到 SD 卡内
4. 将 SD 卡插入树莓派，插电
5. 等待一段时间，当绿灯开始规律闪烁时则表示更新完毕

二、制作 USB 启动镜像

- 与制作 SD 卡镜像一样，把勾选 SD 卡改为勾选 USB 设备即可

{{< /admonition >}}

## 装配你的树莓派

插上 SD 卡(U 盘)，装上散热马甲(如果有的话)，插上网线，插上电源，静待开机

## 连接你的树莓派

前往你的路由器查看你的树莓派 IP，一般主机名就是`raspberrypi`，我的树莓派分配到的 IP 是`10.0.0.181`，用 ssh 连接(默认用户名:`pi`密码:`raspberry`)

```shell
ssh pi@10.0.0.181
# 进去之后改一下密码
passwd
# 第一个输入当前密码，第二个和第三个是新密码
```

## 设置镜像并更新

{{< admonition danger "注意" true >}}

下面的配置用的是 `testing` 更新通道，软件比较新但也可能出现 BUG

若想使用稳定版请将下面的`testing`全部替换成`buster`

{{< /admonition >}}

设置 Debian 仓库镜像

```shell
echo \
"# /etc/apt/sources.list
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free" | \
sudo tee /etc/apt/sources.list > /dev/null
```

设置 RaspberryPi 仓库镜像

```shell
echo \
"# /etc/apt/sources.list.d/raspi.list
deb https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main
deb-src https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main" | \
sudo tee /etc/apt/sources.list.d/raspi.list > /dev/null
```

对系统镜像全量更新

```shell
sudo apt update
sudo apt full-upgrade -y
```

## 设置中文

{{< admonition danger "注意" true >}}

如果你的树莓派连接了显示器且没有安装图形界面请不要设置中文，否则会导致乱码

{{< /admonition >}}

```shell
echo \
'LANG=zh_CN.UTF-8
LANGUAGE="zh_CN:zh:en_US:en"' | \
sudo tee /etc/environment > /dev/null
```

然后重启

然后，Enjoy youself!

## 更多设置

更多的设置(比如 GPIO 等)可以使用树莓派官方的工具进行配置

```shell
sudo raspi-config
```

{{< admonition note "小技巧" false >}}

#### 磁盘测速

```shell
dd if=/dev/zero of=./test.dbf bs=512k count=1024 conv=fdatasync
```

将会在当前目录写入一个 512MiB 的`test.dbf`文件来测试写入速度

#### 查看温度

```shell
# 方法一：直接查看系统文件
cat /sys/class/thermal/thermal_zone0/temp
# 方法二：通过vcgencmd查看
vcgencmd measure_temp
```

{{< /admonition >}}
