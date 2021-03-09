---
title: "Windows 下 MinGW 的选择与安装"
date: 2020-06-12T23:35:44+08:00
#featuredImage: "cover.png"
slug: f1d8b9f4
categories: [学习日记]
tags: [C/C++, 开发环境]
---

Windows下安装用于编译的MinGW

<!--more-->

`注:` 经不起折腾的人还是老老实实用[Dev-C++](https://sourceforge.net/projects/orwelldevcpp/files/)吧，一键安装，现成的UI！

## 关于MinGW

### MinGW是什么

MinGW（Minimalist GNU for Windows），又称mingw32，是将GCC编译器和GNU Binutils移植到Win32平台下的产物，包括一系列头文件（Win32API）、库和可执行文件。

另有可用于产生32位及64位Windows可执行文件的MinGW-w64项目，是从原本MinGW产生的分支。如今已经独立发展。

### MinGW的作用

GCC支持的语言大多在MinGW也受支持，其中涵盖C、C++、Objective-C、Fortran及Ada。

对于C语言之外的语言，MinGW使用标准的GNU运行库，如C++使用GNU libstdc++。

但是MinGW使用Windows中的C运行库。因此用MinGW开发的程序不需要额外的第三方DLL支持就可以直接在Windows下运行，而且也不一定必须遵从GPL许可证。这同时造成了MinGW开发的程序只能使用Win32API和跨平台的第三方库，而缺少POSIX支持，大多数GNU软件无法在不修改源代码的情况下用MinGW编译。

## 安装MinGW

如果你已经阅读完上面的内容，并且已经准备好安装MinGW了，那就请阅读下面的内容吧！

我们先不急着下载，我们先搞懂几个概念，当然，你想边看边下载也可以，[下载链接](https://sourceforge.net/projects/mingw-w64/files/mingw-w64/)

### 系统架构的选择

这取决于你的电脑，Windows7用户请打开`系统属性`，Windows10在`设置`->`系统`->`关于`->`系统信息`，请看到`系统类型`这一行，这里会告诉你你的系统是`64位`还是`32位`，如果是64位请选择`x86_64`，32位请选择`i686`

### 系统接口协议的选择

> 这里我查了好久，垃圾百度上面的东西太杂乱了，根本看不出什么名堂出来，最终还是去查Wiki了，链接：[POSIX](https://zh.wikipedia.org/wiki/%E5%8F%AF%E7%A7%BB%E6%A4%8D%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3) [Win32](https://zh.wikipedia.org/wiki/Windows_API) (可能需要代理)

共有两种选择，`posix`和`win32`。

POSIX(可移植操作系统接口,Portable Operating System Interface)是IEEE为要在各种UNIX操作系统(Linux、MacOS)上运行软件，而定义API的一系列互相关联的标准的总称。微软的Windows NT声称部分实现了POSIX标准。

Windows操作系统应用程序接口（Windows API），有非正式的简称法为WinAPI，是微软对于Windows操作系统中可用的核心应用程序编程接口的称法。它被设计为各种语言的程序调用，也是应用软件与Windows系统最直接的交互方式。大多数驱动程序需要对Windows系统更底层次访问接口，由所用版本的Windows的Native API来提供接口。

总的来说就是，Win32是Windows原生API，POSIX是UNIX的API，Windows仅部分支持，但是好像最大的区别在于线程上面，posix支持C11的多线程功能，支持`std::thread`，而win32不支持，调用的是Windows的API，这影响你以后写代码时多线程的实现方法，这个你自己选择吧，你偏向于原生的C标准就选`posix`，面向Windows编程就选`win32`，如果你还是选择困难的话，毕竟我们最常用的还是Windows，选win32也没什么问题

### 异常处理模型的选择

异常处理模型共三种，`seh`、`dwarf`和`sjlj`，我列一个表你自己选吧.

||64位|32位|
|:-:|:-:|:-:|
|性能|seh|dwarf|
|稳定|sjlj|sjlj|

如果你想深入了解，下面是引自Wiki的话

MinGW编译器在实现异常机制时，有三种可选方式：

+ SJLJ (setjmp/longjmp)：可用于32/64位，但不是零代价的：即使不抛出异常，仍会有一定的性能损失（在最差情形下~15%）。
+ DWARF (DW2, dwarf-2)：只能用于32位，没有永久的运行时开销，需要调用栈是dwarf-enabled，这意味着异常对于Windows system DLLs或Visual Studio编译的DLLs的异常不能被抛出。
+ SEH：零花销。

### 下载MinGW

[下载链接](https://sourceforge.net/projects/mingw-w64/files/mingw-w64/)

至于版本，选最新的吧，支持的标准也新一点

下载的时候不要看见大大的绿色按钮就点，往下面翻一下，你会看到这个链接

+ MinGW-W64-install.exe

但是，不要点他，这是在线安装程序，安装时下载的速度能让你绝望，继续往下翻，看到这些链接，在这里面选

+ x86_64-posix-sjlj
+ x86_64-posix-seh
+ x86_64-win32-sjlj
+ x86_64-win32-seh
+ i686-posix-sjlj
+ i686-posix-dwarf
+ i686-win32-sjlj
+ i686-win32-dwarf

下载可能会有点慢，那就试试其他下载工具，某雷，或者其他多线程下载器。

### 解压MinGW

下载完之后你会得到一个7z压缩包，下面的软件都可以解压，自己选一个吧(我也不知道哪个好用，我用的是7-zip)

+ 7-Zip和p7zip
+ IZArc
+ PowerArchiver
+ QuickZip
+ Squeez
+ TUGZip
+ WinRAR
+ ZipGenius
+ EZ 7z
+ Bandizip

解压过后得到一个文件夹，重命名一下，为`mingw-w64`，然后确保这个目录下面有`bin`文件夹，然后将`mingw-w64`移动到你想要存放的位置，比如我就放在了D盘，路径为`D:\buildtool\mingw-w64`

### 设置环境变量

解压过后是不能直接用的，我们要把他添加到环境变量里面去，打开`设置`->`系统`->`关于`->`系统信息`->`高级系统设置`->`环境变量`，你会注意到有上下两个框。上面的是用户变量，只在自己的用户内有效，更改之后注销重新登录就能生效。下面的是系统变量，全局有效，更改之后需要重启才能生效，当然也有其他方法能让他立即生效。方法是，在改完之后保存，然后打开一个命令行窗口，输入`set Path=C:`，像更新什么变量就把Path换成那个变量名，然后关闭命令行窗口即可。

然后我们添加mingw-w64到系统变量

建议按照下面这张表添加变量(多个值之间用`;`分隔)

|变量名|变量值|备注|
|:-|:-|:-|
|MINGW_HOME|D:\\buildtool\\mingw-w64\\|根据自己的存放位置填写|
|Path|%MINGW_HOME%\\bin\\|追加，而不是覆盖，注意`;`分隔|
|C_INCLUDE_PATH|%MINGW_HOME%\\include\\;%MINGW_HOME%\\lib\\gcc\\x86_64-w64-mingw32\\8.1.0\\include\\|第二个值gcc后面的版本号需自己更改一下|
|CPLUS_INCLUDE_PATH||C++的Include目录|
|LIBRARY_PATH|%MINGW_HOME%\\lib\\||

### 验证安装是否成功

改完变量之后最好重启一下

打开命令行，输入`gcc -v`如果最后一行显示下列字符则表示安装成功，版本可能不一样。

```shell
gcc version 8.1.0 (x86_64-win32-seh-rev0, Built by MinGW-W64 project)
```
