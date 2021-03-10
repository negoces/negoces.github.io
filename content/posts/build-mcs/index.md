---
title: "从零开始搭建一个我的世界服务器"
date: 2021-03-10T17:13:41+08:00
featuredImage: "/posts/079848ab/cover.png"
slug: 079848ab
categories: [Game]
tags: [Minecraft, Server]
---

相信有不少人玩 Minecraft 的时候都想与自己的小伙伴一起玩耍，如过你们恰好在同一局域网，那么可以通过游戏内的`对局域网开放`与小伙伴联机，但是房主必须一直在线，而且非局域网内的小伙伴也无法一起玩耍。

<!--more-->

> 本文章只介绍了如何搭建一个 Minecraft 服务器，并不能直接让非局域网的用户连接，如果你恰好有公网 IP 只需要在路由器里面做个小小的设置(`端口映射`、`端口转发`或者叫`虚拟服务器`)就可以访问了，如果你没有公网 IP 你可以百度`内网穿透`寻找解决方案

## 基础知识

### Java

Minecraft 玩家应该都知道这是什么东西，这里也不做过多的解释，想要了解的可以自己去百度、Google 或者[Wiki](https://zh.wikipedia.org/wiki/Java)。

我们搭建服务需要一个 Java 运行环境即 JRE(Java Runtime Environment)，不过我建议使用 Server JRE 或者 JDK 以便使用更多的启动参数，比如`-server`。

### IP 地址和端口

- IP 地址(IP Address)：这是一个网络上的概念，在网络上我们的手机、电脑相当于一个个建筑，网络则是一条条道路，IP 地址则是你的的门牌号，通过 IP 地址可以找到你的手机、电脑在什么地方，从而与你建立连接，发送数据。

- 端口(Port)：前面说 IP 地址是你的门牌号，那么端口指的就是你家的哪个门，前门、后门或者窗户？与哪个端口连接就相当于从哪个入口进去。Java 版 Minecraft 服务器默认监听(listen)端口: 25565

## 准备工作

### 查看 Java 是否安装

使用`java -version`指令查看 Java 是否已经正确安装，如果输出类似以下内容则表示 Java 已正确安装

```shell
java version "1.8.0_281"
Java(TM) SE Runtime Environment (build 1.8.0_281-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.281-b09, mixed mode)
```

若报错则表示你的 Java 未正确安装

{{< admonition note "关于 Server JRE" >}}
Server JRE 不需要安装(也可以手动安装)，不需要上述操作，在启动服务器时将`java`指令换成 Server JRE 内 java 二进制文件的`绝对路径`(如`/opt/serverjre/jre/bin/java`或`D:\ServerJRE\jre\bin\java.exe`)即可。
{{< /admonition >}}

### 下载一个服务端

下载一个服务端 Jar 文件，官方、spigot、paper 都行，这里用官方 1.16.5 作为演示，下面是下载地址:

- https://download.mcbbs.net/v1/objects/1b557e7b033b583cd9f66746b7a9ab1ec1673ced/server.jar

创建一个文件夹，名字任意，这里以`mcs-1.16.5`为例，位置为`~/RAMDisk/mcs-1.16.5`，将下载的`server.jar`丢进这个文件夹。

## 启动并配置

**在我们创建的文件夹内打开终端(命令行)**，使用以下指令启动服务端

```shell
# -Xms2G 是最小分配内存，这里设置的是2GB，理论上越大启动越快
# -Xmx4G 是最大分配内存，这里设置的是4GB，理论上不大于物理内存的80%
java -Xms2G -Xmx4G -jar server.jar nogui
```

你会发现他输出三行文字就退出了

```shell
[20:01:55] [main/ERROR]: Failed to load properties from file: server.properties
[20:01:55] [main/WARN]: Failed to load eula.txt
[20:01:55] [main/INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
```

从字面也能看出我们没有同意用户协议，将文件夹下`eula.txt`文件里面的`eula=false`改成`eula=true`即可。同时，我们发现它还在文件夹里面创建了一个叫`server.properties`的配置文件，我们就现在对其进行修改。

点击下面的`> Code`以展开配置文件

```ini
#Minecraft server properties
#Wed Mar 10 20:01:55 CST 2021

# 出生点保护范围，非op玩家在出生点这个距离的范围内无法建造与破坏
spawn-protection=16
# 设置每个tick花费的最大毫秒数。超过该毫秒数时，服务器看门狗将停止服务器程序并附带上信息：服务器的一个tick花费了60.00秒（最长也应该只有0.05秒）；判定服务器已崩溃，它将被强制关闭。遇到这种情况的时候，它会调用 System.exit(1)。
max-tick-time=60000
# GameSpy4协议的服务器监听端口。用于获取服务器信息。
query.port=25565
# 用于自定义世界的生成，参见 https://minecraft-zh.gamepedia.com/%E8%87%AA%E5%AE%9A%E4%B9%89
generator-settings=
# 启用后区块文件以同步模式写入。
sync-chunk-writes=true
# 是否强制游戏模式
force-gamemode=false
# 是否允许进入下界
allow-nether=true
# 在服务器上强制执行白名单
enforce-whitelist=false
# 游戏模式(高版本不接受数字参数) survival|creative|adventure|spectator
gamemode=survival
# 向所有在线OP发送所执行命令的输出。
broadcast-console-to-ops=true
# GameSpy4协议的服务器监听开关。用于获取服务器信息。
enable-query=false
# 如果不为0，服务器将在玩家的空闲时间达到设置的时间（单位为分钟）时将玩家踢出服务器
player-idle-timeout=0
text-filtering-config=
# 游戏难度(高版本不接受数字参数) peaceful|easy|normal|hard
difficulty=easy
# 向所有在线OP发送通过RCON执行的命令的输出。
broadcast-rcon-to-ops=true
# 决定攻击型生物（怪物）是否可以生成。
spawn-monsters=true
# OP的权限等级
op-permission-level=4
# pvp开关
pvp=true
# 此选项控制实体需要距离玩家有多近才会将数据包发送给客户端。更高的数值意味着实体可以在更远的地方就被渲染，同时也可能提高增加延迟的几率。(单位:% 范围:10-1000)
entity-broadcast-range-percentage=100
# 是否允许服务端定期发送统计数据到http://snoop.minecraft.net。
snooper-enabled=true
# 决定生成的地图的类型。 FLAT|LEGACY|DEFAULT
level-type=default
# 使服务器在服务器列表中看起来是“在线”的。
enable-status=true
# 如果设为 true，服务器难度的设置会被忽略并且设为 hard（困难），玩家在死后会自动切换至旁观模式。
hardcore=false
# 是否启用命令方块。
enable-command-block=false
# 默认会允许n-1字节的数据包正常发送, 如果数据包为n字节或更大时会进行压缩。-1：完全禁用数据包压缩 0：压缩全部数据包
network-compression-threshold=256
# 设置服务器同时能容纳的最大玩家数量。
max-players=20
# 世界最大半径值
max-world-size=29999984
# 资源包的SHA-1值，必须为小写十六进制，建议填写它。这还没有用于验证资源包的完整性，但是它提高了资源包缓存的有效性和可靠性。
resource-pack-sha1=
# 设定函数的默认权限等级。
function-permission-level=2
# rcon远程控制端口
rcon.port=25575
# 服务器（监听的）端口号。
server-port=25565
# 将服务器与一个特定IP绑定。强烈建议留空该属性值！
server-ip=
# 决定是否生成村民。
spawn-npcs=true
# 允许玩家在安装添加飞行功能的mod前提下在生存模式下飞行。
allow-flight=false
# 世界名称及其文件夹名（你可以把你已生成的世界存档复制过来，然后让这个值与那个文件夹的名字保持一致，服务器就可以载入该存档。）
level-name=world
# 最大视距(单位：区块)，客户端大于此数值也不会显示更远的区块
view-distance=10
# 可选选项，可输入指向一个资源包的URI。玩家可选择是否使用该资源包。注意若该值含":"和"="字符，需要在其前加上反斜线(\)
resource-pack=
# 决定动物是否可以生成。
spawn-animals=true
# 启用服务器的白名单。
white-list=false
# 设置RCON远程访问的密码
rcon.password=
# 定义是否能生成结构（例如村庄）
generate-structures=true
# 是否让服务器对比Minecraft账户数据库验证登录信息。(俗称：正版验证)
online-mode=true
# 玩家在游戏中能够建造的最大高度。
max-build-height=256
# 为世界定义一个种子。
level-seed=
# 如果服务器发送的ISP/AS和Mojang的验证服务器的不一样，玩家将会被踢出。(即：不允许使用VPN或代理)
prevent-proxy-connections=false
# 是否使用针对Linux平台的数据包收发优化。此选项仅会在Linux平台上生成。
use-native-transport=true
enable-jmx-monitoring=false
# 玩家客户端的多人游戏服务器列表中显示的服务器信息，显示于名称下方。中文需要用unicode，超过59个字符可能会返回“通讯错误”
motd=A Minecraft Server
# 设置玩家被踢出服务器前，可以发送的数据包数量。设置为0表示关闭此功能。
rate-limit=0
# rcon远程控制开关
enable-rcon=false
```

然后保存，**记得保存！！！**

再次使用上面的指令启动，出现`Done (16.409s)! For help, type "help"`字样表示启动成功。此时便可以进入服务器了。在终端输入`stop`后回车可关闭服务器。

{{< admonition note "关于模组和插件" >}}

- forge 服务端的启动文件不是`server.jar`，而是`forge-x.xx.x.jar`，需要将`-jar server.jar`改成`-jar forge-x.xx.x.jar`，否则服务器不会加载模组。(注：这里的 xx 只是版本代称，请以实际版本填写。)
- 模组一般放在`mods`文件夹内。只有放入指定文件夹才能被服务器加载。`(只有 forge 或 fabric 服务器才能加载模组)`
- 插件一般放在`plugins`文件夹内。只有放入指定文件夹才能被服务器加载。`(只有 spigot、paper 等基于 bukkit 或 sponge 服务器才能使用插件)`

{{< /admonition >}}

{{< admonition note "关于 server-ip=" >}}

此参数为服务端监听地址，绑定的是具有此 IP 的网卡  
假定我有两张网卡，名称和 IP 分别为:

- eth0: 192.168.0.101
- eth1: 192.168.1.101

如果我设置 server-ip=192.168.1.101 那么服务端只会接受来自 eth1 网卡的连接，来自 eth0 的连接会被丢弃。

如果我设置 server-ip=127.0.0.1 那么服务端只会接受本地回环(loopback)的连接，即只有本机才能进入游戏，就算是来自局域网的连接也无法进入

设置 server-ip=0.0.0.0 或着留空则会监听所有网卡，会接受来自所有网卡的连接，**故强烈建议此参数留空！**

{{< /admonition >}}
