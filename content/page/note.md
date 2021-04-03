---
title: "📋随手记"
slug: note
comment:
  enable: false
---

## 不用怀疑！这就是个记事本！

{{< admonition note "Android SDK Platform Tools 下载地址" false >}}

- [官网](https://developer.android.google.cn/studio/releases/platform-tools#downloads)

直接下载最新版本(请自行前往官网阅读用户协议)

- [Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)
- [Linux](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)
- [MacOS](https://dl.google.com/android/repository/platform-tools-latest-darwin.zip)

{{< /admonition >}}

{{< admonition note "Chrome 离线安装包下载地址" false >}}

标准版

- https://www.google.cn/chrome/?standalone=1

测试版

- https://www.google.cn/chrome/beta/?standalone=1
- https://www.google.cn/intl/zh-CN/chrome/beta/?standalone=1

开发版

- https://www.google.cn/chrome/dev/?standalone=1
- https://www.google.cn/intl/zh-CN/chrome/dev/?standalone=1

金丝雀版(无离线安装包，但可正常更新)

- https://www.google.cn/chrome/canary/

{{< /admonition >}}

{{< admonition note "Minecraft Metadata" false >}}

- https://launchermeta.mojang.com/mc/game/version_manifest.json
- https://download.mcbbs.net/mc/game/version_manifest.json

{{< /admonition >}}

{{< admonition note "Git 常用指令" false >}}

设置用户名及邮箱

```shell
git config --global user.name "username"
git config --global user.email username@demo.com
```

配置默认文本编辑器与差异对比工具

```shell
git config --global core.editor vim
git config --global merge.tool vimdiff
```

包含子模块 clone

```shell
git clone --recursive $REPO_URL
```

{{< /admonition >}}

{{< admonition note "Linux 下使用环境变量使用NVIDIA显卡启动软件" false >}}

参考文档: https://download.nvidia.com/XFree86/Linux-x86_64/435.21/README/primerenderoffload.html

变量：

```shell
__NV_PRIME_RENDER_OFFLOAD=1
__GLX_VENDOR_LIBRARY_NAME=nvidia
```

{{< /admonition >}}

{{< admonition note "Debian删除或添加系统架构" false >}}

- 查看现有架构

```shell
sudo dpkg --print-architecture
```

- 添加架构

```shell
sudo dpkg --add-architecture $ARCH
```

- 删除架构

```shell
sudo dpkg --remove-architecture $ARCH
```

> 其中 `$ARCH` 填写架构名，如：i386、amd64、arm64

{{< /admonition >}}

{{< admonition note "搭建Theia" false >}}

```shell
docker run \
-d \
--security-opt \
seccomp=unconfined \
--init -it \
-p 2900:3000 \
--restart=always \
--name=theia \
-v "/home/theia:/home/project:cached" \
theiaide/theia-cpp:latest
```

{{< /admonition >}}

{{< admonition tip "配置一个自认为高效的终端" false >}}

安装以下软件

- zsh
- zsh-autosuggestions
- zsh-syntax-highlighting
- [starship](https://starship.rs/zh-CN/)

编辑`~/.zshrc`

```shell
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

HISTSIZE=1000
SAVEHIST=1000
HISTFILE=~/.zsh_history

alias grep="grep --color=auto"
alias ls="ls --color -lh"
eval "$(starship init zsh)"
```

编辑`~/.config/starship.toml`

```shell
[character]
success_symbol = "[➜](bold green) "
error_symbol = "[➜](bold red) "

[hostname]
ssh_only = false
format =  "[@$hostname](bold red) "
trim_at = ".companyname.com"
disabled = false

[username]
style_user = "green bold"
style_root = "red bold"
format = "[$user]($style) "
disabled = false
show_always = true
```

{{< /admonition >}}

{{< admonition note "fastboot在windows下的异常问题" false >}}

管理员身份运行

```batch
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\usbflags\18D1D00D0100" /v "osvc" /t REG_BINARY /d "0000" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\usbflags\18D1D00D0100" /v "SkipContainerIdQuery" /t REG_BINARY /d "01000000" /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\usbflags\18D1D00D0100" /v "SkipBOSDescriptorQuery" /t REG_BINARY /d "01000000" /f
```

{{< /admonition >}}

{{< admonition note "电信光猫超级密码" false >}}

帐号: telecomadmin  
密码: <span class="hiden">nE7jA%5m</span>

{{< /admonition >}}