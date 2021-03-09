---
title: "Minecraft 服务端种类"
date: 2020-06-06T20:41:33+08:00
#featuredImage: "cover.png"
slug: d9828d29
categories: [Game]
tags: [Minecraft, Server]
---

现在网络上的我的世界服务端有许多，那么他们都有些什么特点呢

<!--more-->

## 快速入门

底下那么一大坨认真看的人我觉得不多，直接列举吧

+ 插件服
  + Bukkit 插件服
    + [SpigotMC](https://www.spigotmc.org/)
    + [PaperMC](https://papermc.io/)
  + Sponge 插件服
    + [SpongeVanilla](https://www.spongepowered.org/)
+ Mod服
  + Forge Mod服
    + 官方 + [Forge](https://files.minecraftforge.net/)
  + Fabric Mod服
    + 官方 + [Fabric](https://fabricmc.net/)
+ 混合型
  + Forge + Sponge (Mod+插件)
    + [SpongeForge](https://www.spongepowered.org/)(本质是Mod，依赖Forge)
  + Forge + Bukkit (Mod+插件)
    + [CatServer](http://catserver.moe/)(存在兼容性问题，仅支持1.12.2)

注:无论是那种服务端，插件放在`plugins`文件夹，模组放在`mods`文件夹。上面说过SpongeForge本质是模组，所以SpongeForge.jar不能直接启动，而是放在`mods`文件夹，sponge插件放在`plugins`文件夹

## 知识普及

### API是啥

API（Application Programming Interface，应用程序接口）是一些预先定义的函数，或指软件系统不同组成部分衔接的约定。用来提供应用程序与开发人员基于某软件或硬件得以访问的一组例程，而又无需访问原码，或理解内部工作机制的细节。——摘自百度百科

简单来说就是给模组、插件开发者留的一些功能实现接口。

## Minecraft现在有哪些API

这些API不是官方提供的，而是修改官方的服务端实现的，下面列举一下

### Forge

玩mod的人都知道，[Forge](https://files.minecraftforge.net/)是一个模组(mod)API，可以让我的世界拥有更多的方块和玩法，典型的例子有[工业2](https://www.industrial-craft.net/)，当然也有一些辅助型的mod，比如[旅行地图](https://journeymap.info/Home)

### Fabric

与Forge类似，[Fabric](https://fabricmc.net/)也是个模组API,与Forge不同的是Fabric是模块化的，主要针对高版本的MC(1.14+)，对Bukkit，Optifine支持友好，加速火把和WorldEdit也都出现了Fabric版本的模组了

### Bukkit(水桶)

Bukkit是一个服务器插件API，大部分插件都是基于这个API的，比如 基础插件(EssX) 登录插件(Authme) 等等，特点是客户端不需要安装，只要服务端安装就行了。典型代表是CraftBukkit，但是被Mojang咬了一口，现在已经Over了。但是不用担心，大部分API已经被Spigot继承了。

### Sponge(海绵)

这也是一个插件API，他可以建立在原版上，也可以建立在Forge的API之上，使mod和插件同时存在变为可能，也可以单独存在。

### API总结

|API名称|用途|要求|备注|
|:-|:-|:-|:-|
|Forge|模组|客户端和服务器均要安装|加载慢占内存,主流|
|Fabric|模组|客户端和服务器均要安装|新API，支持的模组没Forge多|
|Bukkit|插件|仅服务端需要安装|老牌API，插件多，主流|
|Sponge|插件|仅服务端需要安装|插件没Bukkit多|

## 服务端介绍

### 官方服务端

官方提供的服务端，在正版启动器和官网能够下载到，不提供任何API，只提供原版的联机能力

### SpigotMC

是CraftBukkit的改进版本，提供Bukkit API，作为插件服使用，对性能要求稍微低一点，当然插件多了也吃性能。前面也说了CraftBukkit被咬了一口，Spigot为了避免这种情况所以不提供直接下载，只提供[Buildtool下载](https://hub.spigotmc.org/jenkins/job/BuildTools/)，用户可以通过此工具自己编译服务端。下面给出一个示例代码：

```shell
java -jar buildtool.jar --rev 1.15.2
```

注:需要代理

### PaperMC

是SpigotMC的一个改进版本，也提供Bukkit API，插件服，对于性能要求稍高一些

### SpongeVanilla

在原版的基础上提供Sponge API，插件服

### 官方+FML(Forge Mod Loader)

在官方的基础上加上Forge API的支持，可以加mod

### 官方+Fabric

在官方的基础上加上Fabric API的支持，可以加mod

### 官方+Forge+SpongeForge

SpongeForge本质上可以算是一个Mod，在Forge API上面提供Spong API支持，同时支持模组和插件

### CatServer

一个魔改版本，同时支持Forge API和Bukkit API，只支持1.12.2，存在兼容性问题，有时会导致Mod功能失效，例如AE2(应用能源)的空间塔

### 服务端总结

|服务端名称|用途|要求|备注|支持版本|
|:-|:-|:-|:-|:-|
|官方|原版联机|无||All|
|SpigotMC|插件服|无||1.8+|
|PaperMC|插件服|无||1.8+|
|SpongeVanilla|插件服|无|支持插件较少，没Bukkit全|1.8+|
|官方+FML|模组服|客户端需安装Forge及对应模组||ALL|
|官方+Fabric|模组服|客户端需安装Fabric及对应模组|支持模组较少|1.14+|
|CatServer|模组+插件服|客户端需安装Forge及对应模组|存在不兼容问题|1.12.2|
|另类:||||
|SpongeForge|模组+插件服|客户端需安装Forge及对应模组|本质是一个模组，需基于Forge，支持插件较少|1.8+|
