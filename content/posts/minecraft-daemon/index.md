---
title: "以Daemon的方式运行Minecraft服务器"
date: 2021-02-15T22:03:45+08:00
#featuredImage: "cover.png"
slug: c9e5aec1
categories: [Game]
tags: [Minecraft, Linux]
draft: true
---

Minecraft 是一个 Java 应用，必须跟随着终端运行，在具有[DE]^(桌面环境)的环境下很容易放到后台。但如果是远程控制的服务器，随着 SSH 的断开，我的世界服务器也会被停止。本文提供了一种 `systemd`+`screen` 的解决方案。

<!--more-->

## 安装必要软件

{{< admonition note "注意" >}}
这里的内容仅适用于 Debian/Ubuntu 系统，其他系统请自己寻找安装方式
{{< /admonition >}}

安装`screen`

```shell
sudo apt update
sudo apt install screen -y
```

## 创建一个 Minecraft 系统账户

根据权限最小化原则，我们需要为服务器创建一个用户，其实也是为了能回到服务器控制台做准备。

```shell
sudo useradd -r -s /bin/bash -m -d /opt/minecraft -U minecraft
```

为 minecraft 账户创建密码，以后要回到控制台时要用到

```shell
sudo passwd minecraft
```

## 编写 service 文件

`service`是`systemd`的服务文件，通过编写`service`文件我们能通过`systemctl`对服务进行控制

```ini
# /etc/systemd/system/minecraft@.service
[Unit]
Description=Minecraft Server %i
After=network.target

[Service]
WorkingDirectory=/opt/minecraft/%i
User=minecraft
Group=minecraft
ExecStart=/bin/sh -c '/usr/bin/screen -dmS minecraft-%i /opt/minecraft/%i/start.sh'
ExecReload=/usr/bin/screen -p 0 -S minecraft-%i -X eval 'stuff "reload"\\015'
ExecStop=/usr/bin/screen -p 0 -S minecraft-%i -X eval 'stuff "save-all"\\015'
ExecStop=/usr/bin/screen -p 0 -S minecraft-%i -X eval 'stuff "stop"\\015'
ExecStop=/bin/sleep 10
Restart=on-failure
RestartSec=60s

[Install]
WantedBy=multi-user.target
```

## 复制服务端文件

假定我们的服务器文件夹叫`mc_test`，且该目录下包含`start.sh`启动脚本，那我们将此目录移动到`/opt/minecraft`目录下，
此时服务器文件夹的路径为`/opt/minecraft/mc_test`，服务器启动脚本的路径是`/opt/minecraft/mc_test/start.sh`

文件夹目录应该为

```shell
/
└── opt
    └── minecraft
        └── mc_test
            ├── banned-players.json
            ├── ...
            ├── eula.txt
            ├── server.jar
            ├── server.properties
            └── start.sh
```

## 修改文件权限

```shell
sudo chown -R minecraft:minecraft /opt/minecraft
sudo chmod -R 775 /opt/minecraft 
```

## 启动服务器

至此，我们已经可以开启我们的服务器了，启动指令为`sudo systemctl start minecraft@<server_id>`，其中`server_id`为服务器文件夹。

下面是启动`mc_test`的指令

```shell
sudo systemctl start minecraft@mc_test
```
