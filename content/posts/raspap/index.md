---
title: "把树莓派当作热点"
date: 2021-03-03T21:18:18+08:00
#featuredImage: "cover.png"
slug: 542347b3
categories: [学习日记]
tags: [RaspberryPi, iptables, hostapd, dnsmasq]
---

将树莓派作为二级路由器

<!--more-->

{{< admonition danger "AP模式 与 路由模式" true >}}

树莓派可作为纯 AP [^ap] 使用，这里启用了 NAT 作为二级路由使用。

[^ap]: AP： 全称 WirelessAccessPoint(无线访问接入点) 是无线网和有线网之间沟通的桥梁

{{< /admonition >}}

> 测试环境:  
> 设备: RaspberryPi 3B+  
> 系统: Raspberry Pi OS (与 Raspbian 类似是官方的 64 位系统。)  
> 上级路由: 10.0.0.1 (OpenWRT)

## 安装系统

系统安装及设置语言等操作请参考[此文章](/posts/04c00a0d/)

{{< admonition note "注意" true >}}

树莓派 3 与树莓派 4 的入门安装基本一致，区别在于树莓派 3 的 USB 启动不需要更新 eeprom

{{< /admonition >}}

## 安装必要软件

完全更新系统，防止安装软件时出现依赖不兼容等问题。

```shell
sudo apt update
sudo apt full-upgrade -y
```

安装`hostapd`、`dnsmasq`等软件，其中`hostapd`可以将你的树莓派变成热点向外发出无线信号，`dnsmasq`作为 DHCP 服务器与 DNS 缓存，为连接的设备分配 IP 地址及提供 DNS 服务。

```shell
sudo apt install hostapd dnsmasq netfilter-persistent iptables-persistent -y
```

## 设置无线接口

编辑`/etc/dhcpcd.conf`添加下面配置(仅树莓派是修改此文件，debian 需修改`/etc/network/interfaces`文件)，为 wlan0 接口绑定 IP 地址，用于后面的`hostapd`绑定接口。

`ip_address=`后的 IP 地址可以填写任意子网 IP，`但不要和你的上级路由重复`，比如一般家用路由器为 `192.168.1.1/24` 客户端可用的 IP 为 192.168.1.2 - 192.168.1.254 (192.168.1.1 为路由器自身地址，192.168.1.255 为广播地址)

{{< admonition tip "子网范围" false >}}

- A 类: 10.0.0.0 - 10.255.255.255 (子网掩码: 255.0.0.0)
- B 类: 172.16.0.0 - 172.31.255.255 (子网掩码: 255.240.0.0)
- C 类: 192.168.0.0 - 192.168.255.255 (子网掩码: 255.255.0.0)

{{< /admonition >}}

```conf
interface wlan0
    static ip_address=172.24.0.1/24
    nohook wpa_supplicant
```

## 开启内核转发

启用 Linux 内核转发功能，使得进入树莓派的流量能顺利的通过树莓派转发出去，否则之后将会出现可以连上树莓派但是无法联网的情况。

```shell
echo "net.ipv4.ip_forward=1" | \
sudo tee /etc/sysctl.d/routed-ap.conf > /dev/null
```

## 配置无线国家代码

使用`raspi-config`工具设置 WLAN 国家代码

```shell
sudo raspi-config
```

依次选择`Localisation Options -> WLAN Country -> AU`，为什么不用 CN？不知道是不是树莓派的问题，CN 的 5G 频段少之又少，而且都不支持 80MHz，所以选择了 AU。设置完成后返回主菜单，`Finished`，`Reboot`

## 配置并启用 hostapd

先确保无线模块未被禁用

```shell
sudo rfkill unblock wlan
```

{{< admonition tip "查询网卡支持的频段" true >}}

```shell
sudo iw reg set AU
sudo iw phy phy0 channels
```

{{< /admonition >}}

编辑`/etc/hostapd/hostapd.conf`对 hostapd 进行设置

```ini
# 接口与频率设定
# 绑定接口
interface=wlan0
# 802.11a
hw_mode=a
# 信道
channel=36
# 国家代码
country_code=AU
# IEEE802.11d
ieee80211d=1
# IEEE802.11h
ieee80211h=1
# MAC地址过滤模式
macaddr_acl=0
# 最大连接数
max_num_sta=255
# 隐藏SSID
ignore_broadcast_ssid=0
# 启用WMM
wmm_enabled=1

# 802.11n/ac (HT/VHT) Settings
# IEEE802.11n
ieee80211n=1
# IEEE802.11ac
ieee80211ac=1
ht_capab=[HT40-][HT40+][SHORT-GI-20][SHORT-GI-40][DSSS_CCK-40][MAX-AMSDU-3839]
vht_capab=[MAX-MPDU-3895][SHORT-GI-80][SU-BEAMFORMER][SU-BEAMFORMEE]
vht_oper_chwidth=1
vht_oper_centr_freq_seg0_idx=42
#vht_oper_centr_freq_seg1_idx=159

# SSID及安全设置
ssid=RaspAP
wpa=2
auth_algs=1
rsn_pairwise=CCMP
wpa_key_mgmt=WPA-PSK
wpa_passphrase=22223333
```

{{< admonition note "注意" true >}}

在我使用的过程中，ACS(自动选择信道)即`channel=0`会导致无法启动。

目前已知能正常启动且国外论坛建议的`channel / vht_oper_centr_freq_seg0_idx`的参数分别为`36/42`和`149/155`，即`36`或`149`信道。

{{< /admonition >}}

先测试能否启动

```shell
sudo /usr/sbin/hostapd -P /run/hostapd.pid -dd /etc/hostapd/hostapd.conf
```

如果`hostapd`正常启动则可通过`cltl^C`关闭，并使用下列指令设置开机自启并在后台运行。

```shell
sudo systemctl unmask hostapd
sudo systemctl enable --now hostapd
sudo systemctl status hostapd
```

手机的 WLAN 列表中会显示你的 WiFi 名称，但请不要尝试连接，现在并没有配置 DHCP 服务，你的设备会因为无法分配到 IP 导致无法连接

## 配置并启用 dnsmasq

备份`dnsmasq`安装时生成的配置，以便于日后查阅

```shell
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.bak
```

创建`/etc/dnsmasq.conf`并编辑新配置

```conf
interface=wlan0
dhcp-range=172.24.0.2,172.24.0.254,255.255.255.0,2h
domain=wlan
server=223.5.5.5
address=/raspberry.lan/172.24.0.1
```

设置开机自启并立即启动`dnsmasq`

```shell
sudo systemctl enable --now dnsmasq
sudo systemctl restart dnsmasq
sudo systemctl status dnsmasq
```

## 配置 iptables

配置 iptables 实现 NAT 功能，将发送到树莓派的流量截获并修改源地址实现 SNAT

```shell
sudo iptables -t nat -A POSTROUTING -j MASQUERADE
```

配置 iptables 永久化，使每次重启后 iptables 都能自动添加之前的规则

```shell
sudo netfilter-persistent save
```
