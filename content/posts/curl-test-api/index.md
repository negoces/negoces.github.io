---
title: "使用curl测试API"
date: 2020-11-07T12:33:57+08:00
featuredImage: "cover.svg"
slug: 9058bdc8
categories: [学习日志]
tags: [curl, Linux]
---

curl是从服务器传输数据或向服务器传输数据的工具，熟悉其用法后，完全可以取代 Postman 这一类的图形界面工具。

<!--more-->

## 常规用法

模拟浏览器向网站发送请求`curl <URL>`,比如

```shell
curl "https://www.bilibili.com"
```

## 参数解释

### -X 指定请求方法

指定 HTTP 请求的方法。RESTful API的四种方法:

```shell
curl -X GET "https://example.com"
curl -X POST "https://example.com"
curl -X PUT "https://example.com"
curl -X DELETE "https://example.com"
```
### -A 指定UA

指定UA（`User-Agent`）。curl 的默认用户代理字符串是（`curl/[version]`）。

```shell
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://google.com
```

也可以通过`-H`参数直接指定

```shell
curl -H 'User-Agent: php/1.0' https://google.com
```

### -b 发送Cookies

向服务器发送 Cookies。

```shell
curl -b 'foo1=bar;foo2=bar2' https://google.com
```

或者发送本地文件中的Cookies

```shell
curl -b cookies.txt https://www.google.com
```

### -c 保存Cookies

将服务器设置的 Cookies 写入一个文件。

```shell
curl -c cookies.txt https://www.google.com
```

### -d 发送POST数据体

用于发送 POST 请求的数据体。

```shell
curl -d'login=emma＆password=123' -X POST https://google.com/login
#或者使用本地文件
curl -d '@data.txt' https://google.com/login
```

使用`-d`参数以后，HTTP 请求会自动加上标头`Content-Type : application/x-www-form-urlencoded`。并且会自动将请求转为 POST 方法，因此可以省略`-X POST`。

### -e 设置Referer

设置 HTTP 的标头`Referer`，表示请求的来源。

```shell
curl -e 'https://google.com?q=example' https://www.example.com
```

可以通过`-H`参数直接添加标头`Referer`，达到同样效果。

```shell
curl -H 'Referer: https://google.com?q=example' https://www.example.com
```

### -F 上传文件

向服务器上传二进制文件。

```shell
curl -F 'file=@photo.png' https://google.com/profile
```

指定 MIME 类型。

```shell
curl -F 'file=@photo.png;type=image/png' https://google.com/profile
```

### -H 指定HTTP标头

添加 HTTP 请求的标头。

```shell
curl -H 'Accept-Language: en-US' -H 'Secret-Message: xyzzy' https://google.com
```

### -i 打印HTTP标头

打印出服务器回应的 HTTP 标头。收到服务器回应后，先输出服务器回应的标头，然后空一行，再输出网页的源码。

```shell
curl -i https://www.example.com
```

### -k 跳过SSL检测

跳过 SSL 检测。不会检查服务器的 SSL 证书是否正确。

### -L 开启重定向

让 HTTP 请求跟随服务器的重定向。curl 默认不跟随重定向。

### -o 保存为文件

将服务器的回应保存成文件，等同于`wget`命令。

```shell
curl -o example.html https://www.example.com
```

### -u Basic Auth认证

用来设置服务器认证的用户名和密码。

```shell
curl -u 'bob:12345' https://google.com/login
#或
curl https://bob:12345@google.com/login
```

### -x 设置代理

指定 HTTP 请求的代理。

```shell
curl -x socks5://user:passwd@proxy.com:8080 https://www.example.com
```

如果没有指定代理协议，默认为 HTTP。

```shell
curl -x user:passwd@proxy.com:8080 https://www.example.com
```

