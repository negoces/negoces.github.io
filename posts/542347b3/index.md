# 把树莓派当作热点并开启Tproxy


<!--more-->

> 测试环境:  
> 设备: RaspberryPi 3B+  
> 系统: raspios  
> 上级路由: 192.1681.1 (OpenWRT)

## 安装系统

从[官网](https://www.raspberrypi.org/software/operating-systems/)或者[镜像](https://mirrors.tuna.tsinghua.edu.cn/raspberry-pi-os-images/)下载 raspios,使用[BalenaEtcher](https://www.balena.io/etcher/)写入 SD 卡

启动并修改 apt 镜像

```conf
# /etc/apt/sources.list
deb https://mirrors.sjtug.sjtu.edu.cn/debian buster main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian buster-updates main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian-security/ buster/updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian buster main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian buster-updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian-security/ buster/updates main contrib non-free
```

{{< admonition note "更激进的软件更新" false >}}

```conf
# /etc/apt/sources.list
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian testing-updates main contrib non-free
deb-src https://mirrors.sjtug.sjtu.edu.cn/debian-security/ stable/updates main contrib non-free
```

{{< /admonition >}}

```conf
# /etc/apt/sources.list.d/raspi.list
deb https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main
deb-src https://mirrors.sjtug.sjtu.edu.cn/raspberrypi/debian/ buster main
```

完全更新系统

```shell
sudo apt update
sudo apt full-upgrade -y
```

## 安装必要软件

```shell
sudo apt install hostapd dnsmasq netfilter-persistent iptables-persistent -y
```

## 设置无线接口

```conf
# /etc/dhcpcd.conf
interface wlan0
    static ip_address=172.16.3.1/24
    nohook wpa_supplicant
```

## 设置系统语言(可选)

```ini
# /etc/environment
LANG=zh_CN.UTF-8
LANGUAGE="zh_CN:zh:en_US:en"
```

## 开启内核转发

```ini
# /etc/sysctl.conf
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

## 配置无线国家代码

```shell
sudo raspi-config
```

`Localisation Options -> WLAN Country -> AU`

重启

## 配置并启用hostapd

先确保无线模块未被禁用

```shell
sudo rfkill unblock wlan
```

对hostapd进行设置

(
    查看支持的频段
    sudo iw reg set GB
    iw phy phy0 channels
)

```ini
# /etc/hostapd/hostapd.conf

# 接口与频率设定
interface=wlan0
hw_mode=a
channel=149
country_code=AU
ieee80211d=1
macaddr_acl=0
max_num_sta=10
ignore_broadcast_ssid=0
wmm_enabled=1

# 802.11n/ac (HT/VHT) Settings
ieee80211n=1
ieee80211ac=1
ht_capab=[HT40+][SHORT-GI-20][SHORT-GI-40][DSSS_CCK-40][MAX-AMSDU-3839]
vht_capab=[MAX-MPDU-3895][SHORT-GI-80][SU-BEAMFORMEE]
vht_oper_chwidth=1
vht_oper_centr_freq_seg0_idx=155

# SSID及安全设置
ssid=Raspberry Net
wpa=2
auth_algs=1
rsn_pairwise=CCMP
wpa_key_mgmt=WPA-PSK
wpa_passphrase=12345678
```

start
```shell
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
sudo systemctl status hostapd
```

手机的WLAN列表中会扫描到，但请不要尝试连接，现在并没有配置DHCP服务，你的设备会因为没有分配到IP导致无法连接

## 配置并启用dnsmasq

备份原有配置

```shell
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.bak
```

创建新配置

```conf
# /etc/dnsmasq.conf
interface=wlan0
dhcp-range=172.16.3.100,172.16.3.253,255.255.255.0,2h
domain=wlan
address=/gw.wlan/172.16.3.1
```

```shell
sudo systemctl enable dnsmasq
sudo systemctl restart dnsmasq
sudo systemctl status dnsmasq
```

## 配置iptables

```shell
sudo iptables -t nat -A POSTROUTING -j MASQUERADE
```

iptables永久化

```shell
sudo netfilter-persistent save
```

## 启用IPv6地址下发

```shell
sudo apt install radvd -y
```

```conf
# /etc/radvd.conf
interface wlan0 {
    AdvSendAdvert on;
	MinRtrAdvInterval 30;
	MaxRtrAdvInterval 100; 
    prefix ::/64
    {
        AdvOnLink on;
        AdvAutonomous on;   
        AdvRouterAddr off;
        AdvValidLifetime 120;
		AdvPreferredLifetime 100;
    };
};
```

