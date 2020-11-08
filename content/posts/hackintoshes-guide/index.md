---
title: "黑苹果安装指南"
date: 2020-11-08T00:25:28+08:00
slug: 8b336b48
categories: [捣鼓日记]
tags: [黑苹果]
draft: true
---

让你在普通 x86 架构的电脑上体验 Mac OS

<!--more-->

{{< admonition note >}}

1. 黑苹果不是一步就能装好的，请确保你有足够的时间与耐心来学习与钻研
2. 请确保您知道以下信息:
   - 您电脑的 CPU、GPU 的型号与架构
   - 您电脑的存储设备类型与型号
   - 您电脑的网络芯片组型号(包括有线/无线)
   - 您电脑的触控板、键盘的种类(I2C\PS2)
3. 您可能还需要以下硬件/软件: + 容量大于等于 4GB 的 U 盘或其他 USB 存储器 + 代理软件(可选，用于加速访问 Github)
   {{< /admonition >}}

## 硬件要求

### CPU 要求

- 为了体验最新版本的 Mac OS，你必须使用 4 代(Haswell)以上的 Intel Core 系列处理器
- 对于 AMD 处理器可通过添加[补丁](https://github.com/AMD-OSX/AMD_Vanilla)来获取支持，但即便如此，也只能运行在 FX、A、Zen 系列的处理器上，并且无法使用虚拟化技术(典型应用:虚拟机、模拟器)，且部分软件可能会出现崩溃比如 Adobe、DaVinci Resolve

### GPU 要求

- 支持上述所有 Intel CPU 的集成 GPU
- 仅支持 NVIDIA 开普勒架构(Kepler、Kepler V2)的 GPU
- 支持部分的 AMD GPU

{{< admonition note >}}
支持上述 CPU 的主板大部分都可以顺利运行黑苹果，但是 AMD 的 B550 目前不受支持
{{< /admonition >}}

## 准备安装 U 盘

### 准备工具

- [gibMacOS](https://github.com/corpnewt/gibMacOS)(需要安装 Python 环境)
- fdisk 或其他分区软件(对于 linux 环境)
- dmg2img、7zip(对于 linux 环境)

### 写入 Mac OS 安装镜像

#### Windows 环境下

1. 使用管理员身份打开`gibMacOS.bat`，选择`Toggle Recovery-Only`,程序会列出所有可用版本
2. 选择一个进行下载，程序会下载`RecoveryHDMetaDmg.pkg`到`./macos`目录下
3. 插入 U 盘，使用管理员身份打开`MakeInstall.bat`制作安装 U 盘

具体操作可参考[OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/installer-guide/winblows-install.html)(需要一定的英文基础)

#### Linux 环境下

1. 打开`gibMacOS.bat`，选择`Toggle Recovery-Only`,程序会列出所有可用版本
2. 选择一个进行下载，程序会下载`RecoveryHDMetaDmg.pkg`到`./macos`目录下
3. 将 U 盘分区调整到以下结构(要求 GPT 分区表)

| 分区 |         类型         | 大小  | 卷标 |
| :--: | :------------------: | :---: | :--: |
| sdb1 |        FAT32         | 200MB |  OC  |
| sdb2 | Apple HFS/HFS+(af00) | 3GB+  |      |

具体操作可参考[OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/installer-guide/linux-install.html)(需要一定的英文基础)

4. 使用`7z`解压`RecoveryHDMetaDmg.pkg`

```shell
7z e -txar *.pkg
```

5. 使用`dmg2img`查看 dmg 分区结构

```shell
$ dmg2img -l RecoveryHDMeta.dmg
RecoveryHDMeta.dmg --> (partition list)
partition 0: Protective Master Boot Record (MBR : 0)
partition 1: GPT Header (Primary GPT Header : 1)
partition 2: GPT Partition Data (Primary GPT Table : 2)
partition 3:  (Apple_Free : 3)
partition 4: disk image (Apple_HFS : 4)
partition 5:  (Apple_Free : 5)
partition 6: GPT Partition Data (Backup GPT Table : 6)
partition 7: GPT Header (Backup GPT Header : 7)
```

可以看到`disk image`在第 4 分区

6. 使用`dmg2img`将`disk image`写入 U 盘

```shell
$ sudo dmg2img -p 4 -i RecoveryHDMeta.dmg -o /dev/sdb2

RecoveryHDMeta.dmg --> /dev/sdb2
decompressing:
opening partition 4 ...             100.00%  ok
Archive successfully decompressed as /dev/sdb2
You should be able to mount the image [as root] by:
modprobe hfsplus
mount -t hfsplus -o loop /dev/sdb2 /mnt
```

### 安装配置 OpenCore

1. 下载`OpenCorePkg`[Github Release](https://github.com/acidanthera/OpenCorePkg/releases/)
2. 将 OpenCorePkg 内的文件复制到 OC 分区，目录结构如下

```shell
/dev/sdb1
└── EFI
    ├── BOOT
    │   └── BOOTx64.efi
    └── OC
        ├── ACPI
        ├── Bootstrap
        │   └── Bootstrap.efi
        ├── Drivers
        │   ├── AudioDxe.efi
        │   ├── CrScreenshotDxe.efi
        │   ├── HiiDatabase.efi
        │   ├── NvmExpressDxe.efi
        │   ├── OpenCanopy.efi
        │   ├── OpenRuntime.efi
        │   ├── OpenUsbKbDxe.efi
        │   ├── Ps2KeyboardDxe.efi
        │   ├── Ps2MouseDxe.efi
        │   ├── UsbMouseDxe.efi
        │   └── XhciDxe.efi
        ├── Kexts
        ├── OpenCore.efi
        ├── Resources
        │   ├── Audio
        │   ├── Font
        │   ├── Image
        │   └── Label
        └── Tools
            ├── BootKicker.efi
            ├── ChipTune.efi
            ├── CleanNvram.efi
            ├── GopStop.efi
            ├── HdaCodecDump.efi
            ├── KeyTester.efi
            ├── MmapDump.efi
            ├── OpenControl.efi
            ├── OpenShell.efi
            ├── ResetSystem.efi
            ├── RtcRw.efi
            └── VerifyMsrE2.efi
```

3. 删除不必要的驱动

   - OpenUsbKbDxe.efi
   - UsbMouseDxe.efi
   - NvmExpressDxe.efi **(Haswell 平台请保留)**
   - XhciDxe.efi
   - HiiDatabase.efi
   - Ps2KeyboardDxe.efi **(使用 PS2 键盘的请保留)**
   - Ps2MouseDxe.efi **(使用 PS2 鼠标的请保留)**

4. 下载对应平台的`kext`驱动
   现成的驱动与配置可以到[黑果小兵的部落阁](https://blog.daliansky.net/Hackintosh-long-term-maintenance-model-checklist.html)寻找
   - 固件驱动
     - [HfsPlus.efi](https://github.com/acidanthera/OcBinaryData/blob/master/Drivers/HfsPlus.efi) - 用于查看 HFS 卷
     - OpenRuntime.efi - OpenCorePkg 已捆绑
   - 必要驱动
     - VirtualSMC
     - Liu
   - 网卡驱动及其他驱动
