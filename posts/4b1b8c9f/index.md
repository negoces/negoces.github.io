# 从零开始搭建Hexo博客


教你从零开始搭建自己的Hexo博客

<!--more-->

## 简介

### 什么是Hexo

> Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

### 安装前提

安装 Hexo 相当简单，只需要先安装下列应用程序即可：

+ Node.js (Node.js 版本需不低于 8.10，建议使用 Node.js 10.0 及以上版本)
+ Git
如果您的电脑中已经安装上述必备程序，那么恭喜您！你可以直接前往 安装 Hexo 步骤。

## 安装

### 安装git

> Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。

[Git官方安装指南](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

安装完成后可以打开`cmd`(命令提示符)或`PowerShell`执行下面的指令检查`git`是否安装成功

```sh
git version
```

如果返回

```sh
git version xxx.xxx
```

则表示`git`安装成功

### 安装Node.JS

> Node.js® 是一个基于 Chrome V8 引擎 的 JavaScript 运行时。

Node.js 为大多数平台提供了官方的安装程序。对于中国大陆地区用户，可以前往淘宝 Node.js 镜像下载。

+ [官方链接](https://nodejs.org/zh-cn/)
+ [淘宝镜像](https://npm.taobao.org/mirrors/node)

> 致Windows用户：  
> 使用Nodejs官方安装程序时，请确保勾选`Add to PATH`选项（默认已勾选）。

安装完成后可以打开`cmd`(命令提示符)或`PowerShell`执行下面的指令检查`Node.JS`是否安装成功

```sh
node -v
```

如果返回

```sh
vXX.XX.X
# 例如
v12.16.2
```

则表示`Node.JS`安装成功

### 配置Node.JS镜像源(非中国大陆用户请跳过)

打开`cmd`(命令提示符)或`PowerShell`执行下面的指令

```sh
npm config set registry https://registry.npm.taobao.org/
```

再执行

```sh
npm get registry
```

返回以下内容则表示修改成功

```sh
https://registry.npm.taobao.org/
```

### 进入正题，安装`Hexo`

打开`cmd`(命令提示符)或`PowerShell`执行下面的指令

```sh
npm install -g hexo-cli
```

安装完成后可以输入以下指令查看`Hexo`是否安装成功

```sh
hexo -v
```

## 使用`Hexo`建立属于自己的blog

### 初始化一个blog

我们要找一个方便找到的地方来存放我们的Hexo博客，因为只有这样我们才能更方便的编辑，但是我不建议直接放在桌面上，因为对我来说，我不喜欢桌面有太多东西，而且还有可能把它们误删掉

这里我把它放在`D:`盘来做演示

打开`cmd`(命令提示符)或`PowerShell`

```sh
cd D:
hexo init myblog # 这里的myblog是存放博客文件夹名字，你也可以换成你喜欢的名字
```

因为途中会克隆Github仓库中的某些文件，所以过程会有些漫长，多等一会就好了

如果你看到了绿色的 <span style="background: #0C0; color: #EEE; padding: 0 8px;">INFO</span> 和以下信息，说明Hexo初始化成功了

```sh
INFO  Start blogging with Hexo!
```

如果你看到了红色的 <span style="background: #C00; color: #EEE;  padding: 0 8px;">FATAL</span> 和以下信息，则表示myblog文件夹不是空的，请删除后再重试，或重新找一个文件夹

```sh
FATAL D:\myblog not empty, please run `hexo init` on an empty folder and then copy your files into it
FATAL Something's wrong. Maybe you can find the solution here: http://hexo.io/docs/troubleshooting.html
```

### 进入博客文件夹测试

打开`D:\myblog`可以看到以下目录结构

```sh
node_modules            # 你博客的插件目录
scaffolds               # 中文翻译脚手架，是存放生成新页面的模板文件的地方
source                  # 你写文章的地方，所有文章和图片、文件都应该存放在这里
themes                  # 主题文件夹，用于存放自定义主题
.gitignore              # git生成的文件，不用管
_config.yml             # 你的Hexo博客配置
package.json            # 你的Hexo的插件列表
package-lock.json       # 在`npm install`后生成的，用来记录实际安装的插件版本
```

我们在`myblog`文件夹里面打开`cmd`(命令提示符)或`PowerShell`，执行

```sh
hexo g
```

> 如何在某个文件夹里面打开命令行？  
> 按住`Shitf`键，在文件夹的空白处右击，选择`在此处打开命令提示符`或者`在此处打开PowerShell`即可

经过下面一番输出后，文件夹里面应该多出来了一个`public`文件夹

```sh
INFO  Start processing
INFO  Files loaded in 120 ms
# ···
# 此处省略不知道多少字
# ···
INFO  28 files generated in 400 ms
```

`public`文件夹是用来存放静态网页的，和他的名字一样，里面的网页是用来发布的，我们输入以下指令，即可预览我们的博客长什么样

```sh
hexo s
# 执行这段代码后我们可以用浏览器打开
# 127.0.0.1:4000 或 localhost:4000 来预览
```

如果要关闭预览，我们关闭浏览器，然后在刚刚执行`hexo s`的那个窗口里面按下`Ctrl`+`C`即可终止

### 对博客的标题和信息进行自定义

> 在阅读本节之前，建议学习`YAML`语法 [传送门](https://www.runoob.com/w3cnote/yaml-intro.html)

预览过后我们发现，这个博客的标题叫做`Hexo`，根本不能彰显我们的个性，所以我们要对配置进行更改让他显示我们想要的标题和其他信息

打开`_config.yml`文件，找到这几行，并做更改

```yaml
title: Hexo             # 博客标题
subtitle: ''            # 博客副标题
description: ''         # 博客描述
keywords:               # 关键词(用于搜索引擎优化的(SEO)可以不用填)
author: John Doe        # 作者
language: en            # 语言,要改成中文的话就把这里的 en 改成 zh-CH
timezone: ''            # 时区可以不改
```

改完之后保存，执行以下指令然后打开`localhost:4000`来预览

```sh
hexo clean              # 清理旧的静态文件
hexo g                  # 生成新的静态文件
hexo s                  # 启动本地服务器进行预览
```

预览之后，我们就发现，标题已经变成我们想要的样子了

### 创建新的文章

我们在`myblog`文件夹里面打开`cmd`(命令提示符)或`PowerShell`，执行

```sh
hexo new "我的第一篇文章"       # 这里的"我的第一篇文章"可以写你自己的标题
```

然后我们打开`\source\_posts\我的第一篇文章.md`文件，进行编辑，编辑完成后保存，执行以下代码就可以了

```sh
hexo clean              # 清理旧的静态文件
hexo g                  # 生成新的静态文件
hexo s                  # 启动本地服务器进行预览
```

## 对博客进行发布

使用`hexo s`预览的页面仅仅只有我们自己能看到，如果想让别人看到的话我们要进行发布，发布Hexo博客有两种方式

+ 使用云主机或网站服务器发布
+ 借助各大源码平台的pages服务发布

### 使用云主机或网站服务器发布

将`public`文件夹下的所有文件上传至服务器的网站根目录即可

具体操作请自行百度或者联系你的服务器提供者

### 借助各大源码平台的pages服务发布

这里列出几个代码托管平台

+ [Github](https://github.com)
+ [Gitee码云](https://gitee.com)
+ [Coding](https://coding.net)

怎么注册和怎么使用我就不说了，自行研究和百度，这里只讲Hexo的操作方法

首先我们得先安装一个插件`hexo-deployer-git`，通过以下指令安装

```sh
npm install hexo-deployer-git --save
```

之后我们在`_config.yml`里面找到并修改以下内容(没有的话就自行复制进去)

```yaml
deploy:
  type: git                                 # 仓库类型(svn或git)
  repository: git@xxx.com:xxx/xxx.git       # 仓库地址(推荐使用SSH方式，SSH涉及的公钥创建及配置问题自行百度)
  branch: master                            # 上传的分支
```

配置好之后保存，然后执行

```sh
hexo d
```

第一次连接会让你确认签名，输入`yes`之后回车就行了

进入你的代码平台的仓库页面，打开pages服务，输入他提供的网址即可访问

恭喜你!创建了一个属于自己的博客!

