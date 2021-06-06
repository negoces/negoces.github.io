# 树莓派安装Seafile文件服务


{{< admonition danger "警告" >}}

此文章的部分内容仅适用于 `debian buster arm64` 系统，对于其他系统仅做参考，不保证能够正常运行

{{< /admonition >}}

## 安装 MariaDB 数据库

`若已使用 Docker 安装过 MariaDB 且可用，可忽略此步骤`

安装 MariaDB 并设置自启

```bash
sudo apt install mariadb-server mariadb-client -y
sudo systemctl enable --now mariadb
```

用 `root` 权限进入数据库开启密码登录:

```sql
USE mysql; /* 进入 mysql 库 */
ALTER USER `root`@`localhost` IDENTIFIED WITH mysql_native_password; /* 使用MySQL原生验证 */
ALTER USER `root`@`localhost` IDENTIFIED BY '$PASSWORD'; /* 设置登录密码为 $PASSWORD */
FLUSH privileges; /* 刷新权限 */
```

可使用以下指令测试连接:

```bash
mysql -u root -p
```

{{< admonition tip "为什么在其他计算机上无法登入数据库" false >}}

MariaDB 默认监听 `127.0.0.1` 即:仅本机可登入数据库,如有需求前往 `/etc/mysql/mariadb.conf.d/50-server.cnf` 文件修改 `bind-address = 0.0.0.0` 后重启服务,并登入入数据库通过以下 SQL 语句开启 root 的任意域登录:

```sql
USE mysql; /* 进入 mysql 库 */
CREATE USER `root`@`%` IDENTIFIED WITH mysql_native_password; /* 使用MySQL原生验证 */
CREATE USER `root`@`%` IDENTIFIED BY '$PASSWORD'; /* 设置登录密码为 $PASSWORD */
FLUSH privileges; /* 刷新权限 */
```

若在 `CREATE` 过程中出现 `ERROR 1396 (HY000)` 错误，则表明该条目已存在，将 `CREATE` 替换成 `ALTER` 执行即可。

{{< /admonition >}}

## 安装 Seafile

### 安装依赖

```bash
sudo apt install python3 python3-setuptools python3-pip libmemcached-dev python3-mysqldb -y
pip config set global.index-url https://mirrors.sjtug.sjtu.edu.cn/pypi/web/simple
sudo pip config set global.index-url https://mirrors.sjtug.sjtu.edu.cn/pypi/web/simple
sudo pip3 install Pillow pylibmc captcha jinja2 sqlalchemy==1.4.3 django-pylibmc django-simple-captcha python3-ldap pymysql
```

### 创建 Seafile 用户

`非必选，但不进行此操作可能会导致后续的步骤需要改动`

对 Seafile 服务进行用户隔离，保障数据安全，防止误操作或其他用户恶意删除。

```bash
sudo useradd -MUr seafile
```

### 下载 Seafile

{{< admonition warning "关于32位(armhf,armv7)系统用户" >}}

32 位系统用户请下载`8.0.5-armv7`版本: [seafile-server-8.0.5-buster-armv7.tar.gz](https://ghproxy.com/github.com/haiwen/seafile-rpi/releases/download/v8.0.5/seafile-server-8.0.5-buster-armv7.tar.gz)

{{< /admonition >}}

```bash
# 从 Github 下载 seafile-8.0.3-arm64 (链接包含加速，国内用户可直接下载)
wget https://ghproxy.com/github.com/haiwen/seafile-rpi/releases/download/v8.0.3/seafile-server-8.0.3-buster-arm64v8.tar.gz
# 解压 seafile-server-8.0.3-buster-arm64v8.tar.gz
tar -xzf seafile-server-8.0.3-buster-arm64v8.tar.gz
# 在 /opt 目录创建 seafile 文件夹
sudo mkdir /opt/seafile
# 将 seafile-server-8.0.3 移动到 /opt/seafile
sudo mv seafile-server-8.0.3 /opt/seafile
# 设置 /opt/seafile 属主及权限
sudo chown -R seafile:seafile /opt/seafile/
sudo chmod -R 755 /opt/seafile/
```

### 配置 Seafile

{{< admonition warning "关于执行权限问题" >}}

由于树莓派默认用户为 `pi` 而 seafile 文件属主为 `seafile` ，我们无法直接执行 seafile 文件里面的`设置`、`启动`等脚本，解决方法:

1. 切换用户

   使用 `su` 指令切换当前用户

   ```bash
   sudo su seafile
   ```

   当终端以 `seafile@raspberrypi` 打头时，则表明切换成功，此时的所有操作均由 `seafile` 执行。

2. 使用 `sudo -u seafile <脚本>` 来执行脚本

   此时将会使用 seafile 执行这个脚本，而不影响其他指令。

以下步骤将使用第二种方式。

{{< /admonition >}}

```bash
cd /opt/seafile/seafile-server-8.0.3 # 进入 seafile 目录
sudo -u seafile ./setup-seafile-mysql.sh # 运行配置脚本
```

按照提示进行配置，出现以下信息则表明配置成功。

```shell
-----------------------------------------------------------------
Your seafile server configuration has been finished successfully.
-----------------------------------------------------------------

run seafile server:     ./seafile.sh { start | stop | restart }
run seahub  server:     ./seahub.sh  { start <port> | stop | restart <port> }

-----------------------------------------------------------------
If you are behind a firewall, remember to allow input/output of these tcp ports:
-----------------------------------------------------------------

port of seafile fileserver:   8082
port of seahub:               8000

When problems occur, Refer to

        https://download.seafile.com/published/seafile-manual/home.md

for information.
```

### 启动 Seafile

```bash
sudo -u seafile ./seafile.sh start # 一般seafile都能正常启动，除非有其他程序占用端口
sudo -u seafile ./seahub.sh start # 首次启动需要按照提示配置管理员账户II
```

若 Seahub 无法启动，请参考[关于 seahub 无法启动](#%E5%85%B3%E4%BA%8E-seahub-%E6%97%A0%E6%B3%95%E5%90%AF%E5%8A%A8%E7%9A%84%E9%97%AE%E9%A2%98)

### 测试 Seahub

打开`/opt/seafile/conf/gunicorn.conf.py`  
修改`bind = "127.0.0.1:8000"`为`bind = "0.0.0.0:8000"`  
执行`sudo -u seafile ./seahub.sh restart`重启 seahub  
浏览器打开`http://<IP>:8000/`查看服务是否正常

若要使用反向代理，将`gunicorn.conf.py`改回原配置，重启 seahub，继续[下列步骤](#%E9%85%8D%E7%BD%AE-nginx-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86)

### 设置 Seafile 开机自启

创建并编辑`/etc/systemd/system/seafile.service`

```shell
[Unit]
Description=Seafile
After=network.target mysql.service

[Service]
Type=oneshot
ExecStart=/opt/seafile/seafile-server-latest/seafile.sh start
ExecStop=/opt/seafile/seafile-server-latest/seafile.sh stop
RemainAfterExit=yes
User=seafile
Group=seafile

[Install]
WantedBy=multi-user.target
```

创建并编辑`/etc/systemd/system/seahub.service`

```shell
[Unit]
Description=Seafile hub
After=network.target seafile.service

[Service]
ExecStart=/opt/seafile/seafile-server-latest/seahub.sh start
ExecStop=/opt/seafile/seafile-server-latest/seahub.sh stop
User=seafile
Group=seafile
Type=oneshot
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

设置开机自启

```shell
sudo systemctl enable seafile
sudo systemctl enable seahub
```

## 配置 Nginx 反向代理

### 安装 Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable --now nginx
```

### 准备证书及相关文件

1. 前往自己的域名服务商或 Let's Encrypt 申请证书

2. 使用下列指令下载 dhparam

```bsah
curl https://ssl-config.mozilla.org/ffdhe2048.txt > ./dhparam
sudo mv ./dhparam /var/www/
```

### 配置 Nginx 并重启

修改`/etc/nginx/sites-available/default`

```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    location / {
        return 301 https://$host$request_uri;
    }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name _; # 域名
    ssl_certificate /path/to/signed_cert_plus_intermediates; # 证书crt
    ssl_certificate_key /path/to/private_key; # 证书key
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    ssl_dhparam /var/www/dhparam;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security "max-age=63072000" always;

    proxy_set_header X-Forwarded-For $remote_addr;
    location / {
         proxy_pass         http://127.0.0.1:8000;
         proxy_set_header   Host $host;
         proxy_set_header   X-Real-IP $remote_addr;
         proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header   X-Forwarded-Host $server_name;
         proxy_read_timeout  1200s;
         client_max_body_size 0;

         access_log      /var/log/nginx/seahub.access.log;
         error_log       /var/log/nginx/seahub.error.log;
    }
    location /seafhttp {
        rewrite ^/seafhttp(.*)$ $1 break;
        proxy_pass http://127.0.0.1:8082;
        client_max_body_size 0;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        send_timeout  36000s;
    }
    location /media {
        root /home/user/haiwen/seafile-server-latest/seahub; # seafile位置
    }
}
```

以上配置包含了 TLS(https)设置，请在`第11行`填入自己的域名，例如: `server_name mycloud.com;`，在`第12、13行`填入自己的证书路径。  
若不需要启用 https 设置，请直接将`第4行`至`第22行`删除。

```bash
sudo nginx -t # 检查配置是否有错误
sudo systemctl restart nginx # 重启Nginx
```

访问域名查看页面是否正常加载

## 调整 openssl ciphers 顺序优化 TLS 性能

TLSv1.2 的 ciphers 顺序可以在 Nginx 里面通过`ssl_ciphers`和`ssl_prefer_server_ciphers`进行设置，对于 TLSv1.3 Nginx 会从 OpenSSL 读取顺序，
但是！OpenSSL 的默认顺序是`TLS_AES_256_GCM_SHA384`、`TLS_CHACHA20_POLY1305_SHA256`、`TLS_AES_128_GCM_SHA256`，对于普通的服务器来说，这三种协议都能跑到 100M/s 以上，基本没什么区别，但是对于树莓派则不一样，因为树莓派鸡肋的性能且没有 AES 硬件加速，它在使用 AES256-GCM 作为加密方式时只能达到 20M/s 的速度，POLY1305 则可以稳定在 100M/s 以上。所以，我们要设置优先 ciphers 来提传输速度。

```bash
# 查看配置文件所在位置
openssl version -a | grep OPENSSLDIR
```

修改刚刚获得的目录下的`openssl.cnf`，在随后追加

```ini
openssl_conf = default_conf

[default_conf]
ssl_conf = ssl_sect

[ssl_sect]
system_default = system_default_sect

[system_default_sect]
MinProtocol = TLSv1.2
Ciphersuites = TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256
CipherString = DEFAULT@SECLEVEL=2
```

验证

```bash
openssl ciphers -s -tls1_3
```

重启 Nginx 生效

## 安装 Memcached

```bash
sudo apt install memcached libmemcached-dev -y
sudo systemctl enable --now memcached
```

修改`/opt/seafile/conf/seahub_settings.py`文件，追加以下代码:

```py
CACHES = {
    'default': {
        'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
        'LOCATION': '127.0.0.1:11211',
    },
    'locmem': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    },
}
COMPRESS_CACHE_BACKEND = 'locmem'
```

重启 seahub 生效

## 关于 seahub 无法启动的问题

### 如何 Debug

修改`/opt/seafile/conf/gunicorn.conf.py`文件  
找到`daemon = True`，将其改为`daemon = False`  
再次运行`./seahub.sh start`以查看错误，使用`Ctrl`+`C`组合键结束进程

`注: 记得 Debug 之后将其改回来`
`注: 部分错误无法使用 start-fastcgi 来 Debug`

### 错误: `NameError: name '_mysql' is not defined`

- 原因: `MySQLdb`为 Python2 的模块，在 Python3 上无法运行
- 解决方法: 用`pymysql`替代`MySQLdb`
- 具体操作: 安装 python 模块`pymysql`，并将以下代码添加入`/opt/seafile/seafile-server-latest/seahub/seahub/__init__.py`文件
  ```python
  import pymysql
  pymysql.install_as_MySQLdb()
  ```

### 错误: `ModuleNotFoundError: No module named 'Image'`

- 原因: seafile 内预装的 PIL 和 Pillow 有问题
- 解决方法: 对`Pillow`进行更新
- 具体操作: 使用以下指令
  ```python
  pip3 install -U Pillow -t /opt/seafile/seafile-server-latest/seahub/thirdpart
  # 若下载缓慢请使用镜像加速
  pip3 install -U Pillow -t /opt/seafile/seafile-server-latest/seahub/thirdpart -i https://mirrors.sjtug.sjtu.edu.cn/pypi/web/simple
  ```

### 错误: `ModuleNotFoundError: No module named 'XXX'`

- 原因: `XXX` 模块缺失或文件权限问题
- 解决方法: 使用 pip 安装或参考[下一条](#%E6%8C%87%E4%BB%A4%E6%9C%AA%E6%89%BE%E5%88%B0%E5%8F%8A%E5%85%B6%E4%BB%96%E9%97%AE%E9%A2%98)

### 指令未找到及其他问题

- 原因: seafile 文件权限问题
- 解决方法: 设置 seafile 文件权限
- 具体操作: 使用以下指令
  ```python
  sudo chown -R seafile:seafile /opt/seafile/
  sudo chmod -R 755 /opt/seafile/
  ```

## 参考 Issues

- https://github.com/haiwen/seafile-rpi/issues/80
- https://github.com/haiwen/seafile-rpi/issues/65
- https://github.com/openssl/openssl/issues/7562

