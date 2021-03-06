---
title: "Linux ane Me"
date: 2021-01-25T14:42:03+08:00
#featuredImage: "cover.png"
slug: 2109a7df
categories: [杂谈]
tags: [Linux]
#draft: true
---

Linux 因为其稳定和安全被不少服务器所使用，我也因为偶然接触到了 Linux，发现了它的方便，甚至将它作为日常系统使用。

<!--more-->

## 第一次接触 Linux

我一个接触到的 Linux 叫[Slax](https://www.slax.org/)，我也不清楚它算不算一个发行版本，总之它是基于 Debian 的。

当时我高一，上的是封闭式学校，不给带电子产品，一周下来唯一能接触电子产品的时候便是微机课。因为平时的高强度学习，微机课一般都被我们当作放松时间(虽然要过会考)，便想着通过机房的电脑玩些什么。然而学校的老师们早就想到了这一点，通过路由切断了网络，安装了极域电子教室对 USB 进行管控(虽然后期通过注册表找到了卸载密码)。我曾因为重装家里面电脑的系统在 U 盘写了个老毛桃 PE，于是在微机室的电脑上启动试了一下发现可以启动。但是 PE 在运行时将系统加载到内存上，安装的软件关机之后就没有了。于是我在万恶的百度(当时还不会上谷歌)上面搜索"口袋系统"，我便在搜索结果里面看到了 Slax。  
当时没管那么多，下载下来解压到 U 盘，执行安装脚本。进入系统之后看到了 KDE 桌面和浏览器，那时候只会上网，不知道怎么装软件。  
之后官网更新了 Slax9 桌面环境变了，变成了 Slax 自己开发的桌面，但是因为软件太少我也从官网学会了用`apt`(debian 系 Linux 的包管理器)指令来安装软件，此时的我还没接触到镜像(mirrors)这一概念，看着十几 KB/s 的速度在那傻傻的等软件下好。

虽然当时没有通过 Slax 接触到 Linux 很深层的东西，但是也接触到了 Linux 的部分指令。

## 再次接触

过了些时候，忽然不知道在哪看到了国产 Linux(Deepin) 然后就想去试一下，安装完之后被那华丽的动画惊艳了(那时配置不好，有点卡)，体验了一把，确实不错，但是最后被无线网卡的驱动给劝退了(还是因为当时不懂)。之后又看到了网上 Cyborg Hawk Linux(目前好像停止维护了) 的界面，觉得挺帅又去尝试了一下，发现自己不会用，卸载！

{{< figure src="cyborghawk.webp" title="Cyborg Hawk Linux" >}}

## 深入接触

真正的接触 Linux 是我买了个树莓派，其系统 Raspbian 基于 Debian，也是因为树莓派让我接触到了 mirrors(镜像)这一概念，看着 9M/s 的下载速度真舒服，后来尝试这在树莓派上面搭建 Wordpress，出于树莓派的性能有限便抛弃了桌面环境使用指令对系统进行操作，刚开始是用 Xshell 连接到树莓派的，后来因为重装了系统懒得下载了便直接使用了 Windows10 自带的 ssh(发现 ssh 真香)。之后又不满足在内网里面搭建博客又在腾讯云买了个云服务器(用的是 Ubuntu Server)而且还搞了备案(因为服务器续费太贵且用不到便退还了服务器并撤销了备案)，然后又折腾了很长时间的 Nginx 和 HTTPS，最后发现服务器带宽太低了就 1Mbps 访问速度非常慢就没搞了。服务器买了一年放在那也是闲着就尝试着搭建了 Minecraft 服务器、内网穿透等等东西。

{{< figure src="raspbian.webp" title="Raspbian" >}}

到此为止我学会了一些简单的指令，比如删除、复制、移动、新建文件夹、使用 nano 编辑文本等。

其实对 Linux 了解最为深入的还是买了笔记本然后在笔记本上装了个 Linux，刚开始装的是 Ubuntu 装了个 Geany 作为 C 语言学习环境，顺便装了个 JRE 用来玩我的世界。结果发现 Ubuntu 有 BUG，显卡驱动有问题，有时候还管不了机，正好看见这样一篇文章《人生苦短，我选 Manjaro》然后就尝试了一下 Manjaro，说实话真的方便安装驱动直接用`mhwd`指令就能完成。

{{< figure src="manjaro.webp" title="Manjaro" >}}

目前 Manjaro GNOME 是我日常使用的系统，装了 VSCode 还有一些其他 IDE，众所周知，Linux 没用 QQ，我用的是用 yay 装的 com.qq.tim.spark
虽然托盘独立了看起来有点难受，但是使用起来并没有什么大问题。
