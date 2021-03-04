---
title: "树莓派4安装Docker"
date: 2021-03-03T21:55:47+08:00
slug: c0b3720d
categories: [学习日记]
tags: [RaspberryPi, Docker]
---

<!--more-->

## 安装必要工具

```shell
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg -y
```

## 安装 Docker

下载安装 GPG 密钥

```shell
curl -fsSL https://mirror.sjtu.edu.cn/docker-ce/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

添加镜像源

```shell
echo \
"deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirror.sjtu.edu.cn/docker-ce/linux/debian buster stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

安装 Docker-ce

```shell
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

## 赋予账户可直接操作 Docker 的权限

将自己的账户添加到 docker 组

```shell
sudo usermod -aG docker $USER
newgrp docker
```

## 添加 Docker 仓库加速

编辑或新建`/etc/docker/daemon.json`文件，向其中添加`registry-mirrors`项

```shell
echo \
'{
    "registry-mirrors": ["https://docker.mirrors.sjtug.sjtu.edu.cn"]
}' | \
sudo tee /etc/docker/daemon.json > /dev/null
```

## 启动 Docker 并设置自启

```shell
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

## 安装 Portainer 面板

为了防止待会部署面板时拉取过慢，我们提前拉取

```shell
docker pull portainer/portainer-ce
```

部署面板

```shell
docker volume create portainer_data
docker run -d \
-p 8000:8000 \
-p 9000:9000 \
--name=portainer \
--restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data \
portainer/portainer-ce
```

到此为止，Docker 和 Portainer 面板均已部署完毕，可前往`<ip>：9000`访问面板
