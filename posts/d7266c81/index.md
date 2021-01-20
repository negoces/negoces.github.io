# 树莓派+Clash实现透明代理


透明代理的透明即为用户不需要进行任何设置，察觉不到其存在。至于代理是什么，懂得都懂。

<!--more-->

## 准备

首先你得有个树莓派或者任意一个能装 Linux 系统并且能联网的设备(甚至可以是路由器，不过本文章不适用)，然后你得会配置 Clash 且有一定的 Linux 知识。

本文以树莓派为例子

清单:

- 树莓派 3B+(RaspberryOS(64 位))
- Clash_linux_armv8 可执行文件

## 设置 IP 获取方式为静态

因为我是把树莓派作为旁路由，所以会将路由器的 DHCP 的网关设置为树莓派 IP，为了防止树莓派使用自己的 IP 地址作为网关，我们要为树莓派手动指定 IP 及网关。

编辑网络配置文件：

```shell
sudo nano /etc/network/interfaces
```

```ini
auto eth0
iface eth0 inet static
    address 10.0.0.2    #IP地址
    netmask 255.255.0.0 #子掩码
    gateway 10.0.0.1    #网关

```

## 解决 53(DNS 监听)端口占用问题

```shell
#打开 /etc/systemd/resolved.conf 文件
sudo nano /etc/systemd/resolved.conf
#找到DNSStubListener 修改为 DNSStubListener=no
DNSStubListener=no
```

{{< admonition note "其他软件占用" >}}
若系统中安装有 dnsencrypt 或 dnsmasq 等软件，请卸载，此类软件也会占用 53 端口
{{< /admonition >}}

## 开启 Linux 内核转发

```shell
#打开/etc/sysctl.conf文件
sudo nano /etc/sysctl.conf
#找到net.ipv4.ip_forward将值修改为1
net.ipv4.ip_forward = 1
#立即生效
sudo sysctl -p
```

## 安装 clash

将 clash 命名为 clash 且赋予可执行权限，放入`/opt`目录

编辑`/etc/systemd/system/clash.service`让 clash 开机自启动

```ini
[Unit]
Description=clash
Documentation=man:clash
After=network.target network-online.target nss-lookup.target

[Service]
Type=simple
StandardError=journal
User=nobody
AmbientCapabilities=CAP_NET_BIND_SERVICE
ExecStart=/opt/clash/clash -d /opt/clash
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=1s

[Install]
WantedBy=multi-user.target
```

```shell
#开机自启
sudo systemctl enable clash
```

安装完之后不急着启动，否则会因为没有配置文件而报错

## 配置 clash

编辑`/opt/clash/config.yaml`

```yaml
redir-port: 1811
tproxy-port: 1812
mixed-port: 1080

allow-lan: true
bind-address: "*"

mode: rule
log-level: warning
ipv6: false
external-controller: 0.0.0.0:9090
# external-ui: folder
# secret: ""
# interface-name: en0

hosts:
  # '*.clash.dev': 127.0.0.1
  # '.dev': 127.0.0.1
  # 'alpha.clash.dev': '::1'

dns:
  enable: true
  listen: 0.0.0.0:53
  ipv6: true
  default-nameserver:
    - 223.5.5.5
    - 114.114.114.114
    - 8.8.8.8
  enhanced-mode: redir-host
  use-hosts: true

  nameserver:
    - 114.114.114.114 # default value
    - 8.8.8.8 # default value
    - tls://dns.rubyfish.cn:853 # DNS over TLS
    - https://1.1.1.1/dns-query # DNS over HTTPS

  fallback:
    - tcp://1.1.1.1

  fallback-filter:
    geoip: true
    ipcidr:
      # - 240.0.0.0/4
    # domain:
    #   - '+.google.com'
    #   - '+.facebook.com'
    #   - '+.youtube.com'

proxies:
#这里写代理

proxy-groups:
#这里写代理组

proxy-providers:
#这里写订阅

rules:
  #这里写规则

  # 保留地址 =========================================
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - IP-CIDR,169.254.0.0/16,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,0.0.0.0/8,DIRECT
  - IP-CIDR,224.0.0.0/4,DIRECT
  - IP-CIDR,240.0.0.0/4,DIRECT
  # 最终匹配 =========================================
  - GEOIP,CN,DIRECT
  - MATCH,Proxy
```

```shell
#重启clash
sudo systemctl restart clash.service
#查看clash状态
sudo systemctl status clash.service
```

如果 clash 并未启动(即为状态非`active(running)`)，则可能是配置文件问题

## 添加 iptables 规则

添加 iptables 规则，让进入树莓派的流量转发至 clash

{{< admonition note "如何避免BT流量被代理" >}}
若 BT 流量被转发至 clash 可能会导致下载速度变慢，流量不足等问题。下面利用了 BT 流量高端口的特性，仅转发了 1024 以下的端口的流量，若要代理全部流量请去除最后一行`--dport 0:1024`参数。
{{< /admonition >}}

```shell
sudo iptables -t nat -N clash
sudo iptables -t nat -A clash -d 0.0.0.0/8 -j RETURN
sudo iptables -t nat -A clash -d 10.0.0.0/8 -j RETURN
sudo iptables -t nat -A clash -d 127.0.0.0/8 -j RETURN
sudo iptables -t nat -A clash -d 169.254.0.0/16 -j RETURN
sudo iptables -t nat -A clash -d 172.16.0.0/12 -j RETURN
sudo iptables -t nat -A clash -d 192.168.0.0/16 -j RETURN
sudo iptables -t nat -A clash -d 224.0.0.0/4 -j RETURN
sudo iptables -t nat -A clash -d 240.0.0.0/4 -j RETURN
sudo iptables -t nat -A clash -p tcp -j REDIRECT --to-port 1811
sudo iptables -t nat -A PREROUTING -p tcp --dport 0:1024 -j clash
```

{{< admonition note "使用TProxy端口" >}}
因为我的 tproxy 端口不知何种原因，并未被打开，所以上面采用的是 REDIRECT 转发，若要使用 Linux 的 tproxy 特性请参考下面的规则:  
(可用`lsof -i:<port>`指令查看端口是否开放)

```shell
sudo ip rule add fwmark 1 table 100
sudo ip route add local default dev lo table 100
sudo iptables -t mangle -N clash
sudo iptables -t mangle -A clash -d 0.0.0.0/8 -j RETURN
sudo iptables -t mangle -A clash -d 10.0.0.0/8 -j RETURN
sudo iptables -t mangle -A clash -d 127.0.0.0/8 -j RETURN
sudo iptables -t mangle -A clash -d 169.254.0.0/16 -j RETURN
sudo iptables -t mangle -A clash -d 172.16.0.0/12 -j RETURN
sudo iptables -t mangle -A clash -d 192.168.0.0/16 -j RETURN
sudo iptables -t mangle -A clash -d 224.0.0.0/4 -j RETURN
sudo iptables -t mangle -A clash -d 240.0.0.0/4 -j RETURN
sudo iptables -t mangle -A clash -p tcp -j TPROXY --on-port 1812 --tproxy-mark 1
sudo iptables -t mangle -A PREROUTING -p tcp --dport 0:1024 -j clash
```

{{< /admonition >}}

{{< admonition note "代理UDP流量" >}}
以上规则仅代理了 TCP 流量，若要代理 UDP 流量请追加以下规则

- redir

```shell
sudo iptables -t nat -A clash -p udp -j REDIRECT --to-port 1811
sudo iptables -t nat -A PREROUTING -p udp -j clash
```

- tproxy

```shell
sudo iptables -t mangle -A clash -p udp -j TPROXY --on-port 1812 --tproxy-mark 1
sudo iptables -t mangle -A PREROUTING -p udp -j clash
```

{{< /admonition >}}

## iptables 规则持久化

安装`iptables-persistent`

```shell
sudo apt install iptables-persistent
```

对当前规则进行保存

```shell
sudo netfilter-persistent save
```

## 设置路由器DHCP

进入路由器的DHCP设置页面，将网关与DNS服务器改为树莓派的IP地址，然后将手机电脑等设备重新连接路由器即可。

Enjoy youslef!
