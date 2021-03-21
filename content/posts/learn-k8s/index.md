---
title: "Kubernetes 学习日记"
date: 2021-03-20T22:59:49+08:00
#featuredImage: "cover.png"
slug: baaa9162
categories: [学习日记]
tags: [Linux, k8s, 容器, 集群]
---

Kubernetes 是用于自动部署，扩展和管理容器化应用程序的开源系统。

<!--more-->

{{< admonition danger "注意" >}}

当前处于草稿状态，且目前仅到安装 kubeadm 可以，创建集群暂未测试

{{< /admonition >}}

{{< admonition note "文章更新时间轴" false >}}

- 2021/03/20 文章创建

{{< /admonition >}}

## 引言

随着微服务、分布式的流行，容器化也逐渐流行起来，Kubernetes 也逐渐成为了一项技能，我便在课余时间抽时间来学习了一下。

Kubernetes 是一个容器编排工具，学习它肯定需要一个集群，但毕竟是学习，肯定没那么的资源来使用，我便使用虚拟机模拟了一个集群来进行学习。

## 用虚拟机创建集群

考虑到 Kubernetes 的系统要求，我打算用 Fedora Server 作为虚拟机的系统，至于虚拟软件则因人而异了，有的人喜欢用 VM，我使用的是 KVM。

{{< admonition tip "Kubernetes 支持的系统" false >}}

- Ubuntu 16.04+
- Debian 9+
- CentOS 7+
- Red Hat Enterprise Linux (RHEL) 7+
- Fedora 25+
- HypriotOS v1.0.1+
- Flatcar Container Linux （使用 2512.3.0 版本测试通过）

{{< /admonition >}}

1. 前往 [Aliyun](https://mirrors.aliyun.com/fedora/releases/33/Server/x86_64/iso/) 下载`Fedora-*.iso`文件。
2. 下载完毕后创建虚拟机，因为 k8s 的要求我们分配的虚拟机至少需要 `2 核 和 2G RAM`。
3. 启动虚拟机，根据提示安装。
4. 安装完毕后使用`reboot`重启，此时`iso`文件已经可以移除了。

使用以上步骤创建至少两个虚拟机。

## 安装 kubeadm 及其他组件

### 每个节点上 MAC 地址和 product_uuid 的唯一性

Kubernetes 使用这些值来唯一确定集群中的节点。 如果这些值在每个节点上不唯一，可能会导致安装失败。

- 你可以使用命令 `ip link` 或 `ifconfig -a` 来获取网络接口的 MAC 地址
- 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令对 product_uuid 校验

### 允许 iptables 检查桥接流量

```shell
sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

{{< admonition note "放行端口" >}}
如果你用的是云服务器请确保以下端口已被放行

- 控制平面节点: `6443`,`2379-2380`,`10250`,`10251`,`10252`
- 工作节点: `10250`,`30000-32767`

端口的具体作用请查阅[官网](https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#check-required-ports)

{{< /admonition >}}

### 设置系统镜像

```shell
sudo rm -f /etc/yum.repos.d/*

echo '[fedora]
name=Fedora $releasever - $basearch
failovermethod=priority
baseurl=https://mirrors.aliyun.com/fedora/releases/$releasever/Everything/$basearch/os/
metadata_expire=28d
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-$releasever-$basearch
skip_if_unavailable=False' | \
sudo tee /etc/yum.repos.d/fedora.repo > /dev/null

echo '[updates]
name=Fedora $releasever - $basearch - Updates
failovermethod=priority
baseurl=https://mirrors.aliyun.com/fedora/updates/$releasever/Everything/$basearch/
enabled=1
gpgcheck=1
metadata_expire=6h
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-$releasever-$basearch
skip_if_unavailable=False' | \
sudo tee /etc/yum.repos.d/fedora-updates.repo > /dev/null

echo '[fedora-modular]
name=Fedora Modular $releasever - $basearch
failovermethod=priority
baseurl=https://mirrors.aliyun.com/fedora/releases/$releasever/Modular/$basearch/os/
enabled=1
metadata_expire=7d
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-$releasever-$basearch
skip_if_unavailable=False' | \
sudo tee /etc/yum.repos.d/fedora-modular.repo > /dev/null

echo '[updates-modular]
name=Fedora Modular $releasever - $basearch - Updates
failovermethod=priority
baseurl=https://mirrors.aliyun.com/fedora/updates/$releasever/Modular/$basearch/
enabled=1
gpgcheck=1
metadata_expire=6h
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-$releasever-$basearch
skip_if_unavailable=False' | \
sudo tee /etc/yum.repos.d/fedora-updates-modular.repo > /dev/null
```

系统更新: `sudo dnf update`

### 安装 Docker

添加 mirrors

```shell
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo \
https://mirrors.aliyun.com/docker-ce/linux/fedora/docker-ce.repo
```

安装 Docker

```shell
sudo dnf install docker-ce docker-ce-cli containerd.io
```

赋予账户可直接操作 Docker 的权限

```shell
sudo usermod -aG docker $USER
newgrp docker
```

添加 Docker 仓库加速

```shell
echo \
'{
    "exec-opts": [
        "native.cgroupdriver=systemd"
    ],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "100m"
    },
    "storage-driver": "overlay2",
    "registry-mirrors": [
        "https://docker.mirrors.sjtug.sjtu.edu.cn"
    ]
}' | \
sudo tee /etc/docker/daemon.json > /dev/null
```

启动 Docker 并设置自启

```shell
sudo systemctl start docker
sudo systemctl enable docker
```

### 安装 kubeadm

添加 mirror

```shell
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF
```

禁用 SELinux

```shell
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```

安装并启动

```shell
sudo dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

## 使用 kubeadm 创建集群

关闭防火墙

```shell
systemctl stop firewalld
systemctl disable firewalld
```

关闭 swap

```shell
swapoff -a
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

提前拉取所需镜像(因版本而异)，可用`kubeadm config images list`查看

> 将`k8s.gcr.io`换成`registry.aliyuncs.com/google_containers/`

> 也可修改配置实现加速  
> `kubeadm config print-defaults --api-objects ClusterConfiguration > kubeadm.conf`生成配置  
> 修改`kubernetesVersion:`为当前版本  
> 修改`imageRepository:`为`registry.aliyuncs.com/google_containers`

```shell
docker pull registry.aliyuncs.com/google_containers/kube-apiserver:v1.20.5
docker pull registry.aliyuncs.com/google_containers/kube-controller-manager:v1.20.5
docker pull registry.aliyuncs.com/google_containers/kube-scheduler:v1.20.5
docker pull registry.aliyuncs.com/google_containers/kube-proxy:v1.20.5
docker pull registry.aliyuncs.com/google_containers/pause:3.2
docker pull registry.aliyuncs.com/google_containers/etcd:3.4.13-0
docker pull registry.aliyuncs.com/google_containers/coredns:1.7.0

docker tag registry.aliyuncs.com/google_containers/kube-apiserver:v1.20.5 \
k8s.gcr.io/kube-apiserver:v1.20.5
docker tag registry.aliyuncs.com/google_containers/kube-controller-manager:v1.20.5 \
k8s.gcr.io/kube-controller-manager:v1.20.5
docker tag registry.aliyuncs.com/google_containers/kube-scheduler:v1.20.5 \
k8s.gcr.io/kube-scheduler:v1.20.5
docker tag registry.aliyuncs.com/google_containers/kube-proxy:v1.20.5 \
k8s.gcr.io/kube-proxy:v1.20.5
docker tag registry.aliyuncs.com/google_containers/pause:3.2 \
k8s.gcr.io/pause:3.2
docker tag registry.aliyuncs.com/google_containers/etcd:3.4.13-0 \
k8s.gcr.io/etcd:3.4.13-0
docker tag registry.aliyuncs.com/google_containers/coredns:1.7.0 \
k8s.gcr.io/coredns:1.7.0
```

初始化

```shell
kubeadm init
# 或
kubeadm init --ignore-preflight-errors=Swap
```
