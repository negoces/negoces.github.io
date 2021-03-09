# iptables从入门到放弃


iptables 是 Linux 系统上常用的命令行工具，主要用来配置防火墙。运用 iptables 我们能够实现流量的转发、拦截等操作

<!--more-->

## iptables 是什么

iptables 是运行在用户空间的应用软件，通过控制 Linux 内核 netfilter 模块，来管理网络数据包的处理和转发。在大部分 Linux 发行版中，可以通过手册页或`man iptables`获取用户手册。

{{< admonition info "netfilter是什么(摘自Wiki)" >}}
Netfilter，在 Linux 内核中的一个软件框架，用于管理网络数据包。不仅具有网络地址转换（NAT）的功能，也具备数据包内容修改、以及数据包过滤等防火墙功能。利用运作于用户空间的应用软件，如 iptables、ebtables 和 arptables 等，来控制 Netfilter，系统管理者可以管理通过 Linux 操作系统的各种网络数据包。1990 年代，Netfilter 在 Linux 2.3.15 版时进入 Linux 内核，正式应用于 Linux 2.4 版。
{{< /admonition >}}

简而言之就是 Netfilter 的上层程序，用户通过 iptables 指定规则，由 Netfilter 来执行，实现流量的拦截、转发等操作。

## iptables 的链(chain)

iptables 中有 5 个链，分别与 netfilter 中的 hook 对应

- `PREROUTING` - 对应`NF_IP_PRE_ROUTING`,任何进入网络堆栈的流量都会触发此 hook。
- `INPUT` - 对应`NF_IP_LOCAL_IN`，如果数据包发送到本地系统，则在路由传入数据包之后，将触发此 hook。
- `FORWARD` - 对应`NF_IP_FORWARD`，如果该数据包转发到另一台主机，则在路由输入数据包之后将触发此 hook。
- `OUTPUT` - 对应`NF_IP_LOCAL_OUT`，由本地的出栈流量触发。
- `POSTROUTING` - 对应`NF_IP_POST_ROUTING`，任何传出的流量都将触发此 hook。

数据包走向:

- 目的地址为本机的传入流量: -> `PREROUTING` -> `INPUT`
- 目的地址为其他主机的传入流量: -> `PREROUTING` -> `FORWARD` -> `POSTROUTING` ->
- 本机出站流量: `OUTPUT` -> `POSTROUTING` ->

## iptables 的表(tables)

### filter 表

filter 表是默认的表，如果不指明表则使用此表。其通常用于过滤数据包。其中的内建链包括：

- INPUT,OUTPUT,FORWARD

### nat 表

nat 表如其名，用于地址转换操作。其中的内建链包括：

- PREROUTING,POSTROUTING,OUTPUT

### mangle 表

mangle 表用于处理数据包。其和 nat 表的主要区别在于，nat 表侧重连接而 mangle 表侧重每一个数据包。其中内建链列表如下。

- PREROUTING,OUTPUT,FORWARD,INPUT,POSTROUTING

### raw 表

raw 表用于处理异常，有如下两个内建链：

- PREROUTING,OUTPUT

{{< figure src="/posts/16e870f5/flow.webp" title="流量流向" >}}

## iptables 的规则(rules)

根据规则匹配条件来尝试匹配报文，一旦匹配成功，就由规则定义的处理动作做出处理。

### 匹配条件

基本匹配条件：源地址，目标地址，传输层协议  
扩展匹配条件：由扩展模块定义

### 处理动作

基本处理动作：ACCEPT、DROP  
扩展处理动作：REJECT、RETURN、LOG、REDIRECT

### iptables的链：内置链和自定义链

内置链：对应于hook functions  
自定义链接：用于内置链的扩展和补充，可实现更灵活的规则管理机制；自定义链可以设置完之后，添加到内置链中，方便管理

> 待续... (iptables的命令操作)
