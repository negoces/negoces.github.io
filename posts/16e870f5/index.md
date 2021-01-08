# iptables详解


iptables是运行在用户空间的应用软件，通过控制Linux内核netfilter模块，来管理网络数据包的处理和转发。在大部分Linux发行版中，可以通过手册页或`man iptables`获取用户手册。

<!--more-->

iptables、ip6tables等都使用Xtables框架。存在“表（tables）”、“链（chain）”和“规则（rules）”三个层面。

## 数据包走向

{{< mermaid >}}
graph LR;
    输入 --> PREROUTING
    PREROUTING --> B{本机?}
    B -->|Y| INPUT
    B -->|N| FORWARD
    INPUT --> E[应用层]
    E --> OUTPUT
    FORWARD --> POSTROUTING
    OUTPUT --> POSTROUTING
    POSTROUTING --> 输出
{{< /mermaid >}}

## 表

### filter表

filter表是默认的表，如果不指明表则使用此表。其通常用于过滤数据包。其中的内建链包括：

+ INPUT，输入链。发往本机的数据包通过此链。
+ OUTPUT，输出链。从本机发出的数据包通过此链。
+ FORWARD，转发链。本机转发的数据包通过此链。

### nat表

nat表如其名，用于地址转换操作。其中的内建链包括：

+ PREROUTING，路由前链，在处理路由规则前通过此链，通常用于目的地址转换（DNAT）。
+ POSTROUTING，路由后链，完成路由规则后通过此链，通常用于源地址转换（SNAT）。
+ OUTPUT，输出链，类似PREROUTING，但是处理本机发出的数据包。

### mangle表

mangle表用于处理数据包。其和nat表的主要区别在于，nat表侧重连接而mangle表侧重每一个数据包。[4]其中内建链列表如下。

+ PREROUTING
+ OUTPUT
+ FORWARD
+ INPUT
+ POSTROUTING

### raw表

raw表用于处理异常，有如下两个内建链：

+ PREROUTING
+ OUTPUT
