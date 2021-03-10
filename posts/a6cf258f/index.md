# 树莓派4安装Gitea


在树莓派上面搭建一个内网 git 服务器，用来存放一些代码及镜像一些常用仓库。顺便搭建个 DroneCI 玩玩。

<!--more-->

> 此文章依据怎么方便怎么来的准则，并未考虑稳定与性能，切勿用作生产环境！

## 安装 MariaDB

### 拉取 mariadb 镜像

```shell
docker pull mariadb
```

### 部署 mariadb

```shell
docker run -d \
--name mariadb \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=<password> \
--restart=always \
mariadb
```

## 安装 phpMyAdmin

### 拉取 phpmyadmin 镜像

```shell
docker pull phpmyadmin
```

### 部署 phpmyadmin

```shell
docker run -d \
--name phpmyadmin \
-p 3380:80 \
-e PMA_HOST=<树莓派IP> \
--restart=always \
phpmyadmin
```

> 注意：<树莓派 IP>不能填写 127.0.0.1，负责无法连接到数据库

## 安装 Gitea

### 创建 Gitea 数据库

登录`<树莓派IP>:3380`创建 gitea 用户并创建同名数据库并赋予权限，注意把密码记着

### 获取 Gitea

下载地址: https://dl.gitea.io/gitea/

### 安装 git

```shell
sudo apt install git git-lfs -y
```

### 创建文件夹并复制文件

创建文件夹

```shell
sudo mkdir /opt/gitea
sudo mkdir /opt/gitea/etc
sudo mkdir /opt/gitea/home
sudo mkdir /opt/gitea/var
sudo mkdir /opt/gitea/var/lib
```

复制文件

```shell
sudo mv gitea /opt/gitea
```

设置权限

```shell
sudo chown git:git -R /opt/gitea
sudo chmod 775 -R /opt/gitea
```

最终目录结构

```shell
/opt/gitea/
├── etc
├── gitea
├── home
└── var
    └── lib
```

### 创建 git 用户

```shell
sudo useradd -d /opt/gitea/home -s /bin/bash -U git
```

### 创建 service 文件

```shell
echo \
'[Unit]
Description=Gitea (Git with a cup of tea)
After=syslog.target
After=network.target docker.service
Requires=docker.service

[Service]
RestartSec=2s
Type=simple
User=git
Group=git
WorkingDirectory=/opt/gitea/var/lib
ExecStart=/opt/gitea/gitea web --config /opt/gitea/etc/app.ini
Restart=always
Environment=USER=git HOME=/opt/gitea/home GITEA_WORK_DIR=/opt/gitea/var/lib
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target' | \
sudo tee /etc/systemd/system/gitea.service > /dev/null
```

### 启动 gitea 并设置自启

```shell
sudo systemctl start gitea
sudo systemctl enable gitea
sudo systemctl status gitea
```

访问`<IP>:3000`进行 Gitea 初始化设置

## 配置 Gitea

编辑`/opt/gitea/etc/app.ini`，添加或修改以下内容以解除 release 发布限制

```ini
[attachment]
ENABLE = true
PATH = /opt/gitea/home/attachments
ALLOWED_TYPES = <文件格式>
MAX_SIZE = <文件最大大小,单位M,不需要加>
MAX_FILES = <文件最大数量>
```

关于文件格式:

查询网址:

- [filext.com](https://filext.com/)
- [OSChina](https://tool.oschina.net/commons/)

比如要接受所有文件就填写

```ini
ALLOWED_TYPES = octet-stream
```

## 配置 Nginx 反向代理

### 安装 Nginx

```shell
sudo apt update
sudo apt install nginx -y
```

### 修改配置

编辑`/etc/nginx/sites-available/default`

```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name <域名>;

    ssl_certificate <证书路径>;
    ssl_certificate_key <密钥路径>;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;

    # curl https://ssl-config.mozilla.org/ffdhe2048.txt > /path/to/dhparam
    ssl_dhparam /path/to/dhparam;

    # intermediate configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (ngx_http_headers_module is required) (63072000 seconds)
    add_header Strict-Transport-Security "max-age=63072000" always;

    client_max_body_size 4096M;
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

### 重启 Nginx

检查配置并更新

```shell
sudo nginx -t
sudo systemctl restart nginx
```

## 安装 DroneCI

### 拉取镜像

```shell
docker pull drone/drone:1
docker pull drone/drone-runner-docker:1
```

### 生成 RPC 密钥

```shell
openssl rand -hex 16
```

### 部署 DroneCI

```shell
docker run \
--volume=/var/lib/drone:/data \
--env=DRONE_GITEA_SERVER={{DRONE_GITEA_SERVER}} \
--env=DRONE_GITEA_CLIENT_ID={{DRONE_GITEA_CLIENT_ID}} \
--env=DRONE_GITEA_CLIENT_SECRET={{DRONE_GITEA_CLIENT_SECRET}} \
--env=DRONE_RPC_SECRET={{DRONE_RPC_SECRET}} \
--env=DRONE_SERVER_HOST={{DRONE_SERVER_HOST}} \
--env=DRONE_SERVER_PROTO={{DRONE_SERVER_PROTO}} \
--env=DRONE_USER_CREATE=username:{{ADMIN_USERNAME}},admin:true \
--publish=80:80 \
--restart=always \
--detach=true \
--name=drone \
drone/drone:1
```

```shell
docker run -d \
-v /var/run/docker.sock:/var/run/docker.sock \
-e DRONE_RPC_PROTO=https \
-e DRONE_RPC_HOST=drone.company.com \
-e DRONE_RPC_SECRET=super-duper-secret \
-e DRONE_RUNNER_CAPACITY=2 \
-e DRONE_RUNNER_NAME=${HOSTNAME} \
-e DRONE_UI_USERNAME=admin \
-e DRONE_UI_PASSWORD=admin \
-p 3200:3000 \
--restart always \
--name runner \
drone/drone-runner-docker:1
```

```shell
docker logs runner
```

### 配置 Nginx 反代

在`/etc/nginx/sites-available/default`后面追加

```shell
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name <域名>;

    ssl_certificate <证书路径>;
    ssl_certificate_key <密钥路径>;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;

    # curl https://ssl-config.mozilla.org/ffdhe2048.txt > /path/to/dhparam
    ssl_dhparam /path/to/dhparam;

    # intermediate configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (ngx_http_headers_module is required) (63072000 seconds)
    add_header Strict-Transport-Security "max-age=63072000" always;

    client_max_body_size 4096M;
    location / {
        proxy_pass http://127.0.0.1:3100;
    }
}
```

{{< admonition note "注意" >}}
Drone 默认会选择 amd64 架构的 runner，但是我们的树莓派是 arm64 的，会导致构建一直处于`Pending`状态，所以项目的`.drone.yml`需要指定平台，比如

```yaml
---
kind: pipeline
type: docker
name: default
platform:
  os: linux
  arch: arm64
steps:
  - name: build
    image: golang
    commands:
      - go build
```

{{< /admonition >}}

