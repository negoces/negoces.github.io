# 添加Windows右键菜单选项


在右键菜单里面添加你想要的内容，让你的操作更加流畅方便，也可以删除一些失效的快捷方式

<!--more-->

## 直接将选项添加至右键菜单

先打开注册表编辑器(`win`+`R`键，输入`regedit`，确定)

定位到下表里面的位置

|路径|作用|
|:-|:-|
|`HKEY_CLASSES_ROOT\*\shell\`|任意文件上的右键菜单|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\`|文件夹空白处的右键菜单|
|`HKEY_CLASSES_ROOT\Directory\shell\`|文件夹上的右键菜单|

创建一个`项`，名称随意，尽量为英文且自己能看懂，修改该项的默认值，`默认值即为显示名称`,如需图标则创建字串符值`Icon`，值为图标的绝对路径，然后在刚刚创建的项里面再创建一个`项`名称一定为`command`，该项的默认值即为指令。

上面的一段话可能有点绕，下面来个例子(创建`在此处打开CMD`)：

|路径|类型|值|作用|
|:-|:-|:-|:-|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCMD\(默认)`|REG_SZ|在此处打开CMD|显示名称|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCMD\Icon`|REG_SZ|cmd.exe|显示图标|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\OpenCMD\command\(默认)`|REG_SZ|cmd.exe|操作&指令|

## 创建二级菜单

### 将指令注册进系统

将注册表定位到`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\CommandStore\shell\`，在里面创建`项`例子如下(例子:在此处打开CMD)(表中路径有省略)：

|路径|类型|值|作用|
|:-|:-|:-|:-|
|`HKEY_LOCAL_MACHINE\...\CommandStore\shell\opencmd\(默认)`|REG_SZ|`空`|无作用|
|`HKEY_LOCAL_MACHINE\...\CommandStore\shell\opencmd\icon`|REG_SZ|cmd.exe|显示图标|
|`HKEY_LOCAL_MACHINE\...\CommandStore\shell\opencmd\MUIVerb`|REG_SZ|在此处打开CMD|显示名称|
|`HKEY_LOCAL_MACHINE\...\CommandStore\shell\opencmd\command\(默认)`|REG_SZ|cmd.exe|操作&指令|

### 在想要的地方创建菜单项

定位到下表位置(对，就是第一节的那张表)

|路径|作用|
|:-|:-|
|`HKEY_CLASSES_ROOT\*\shell\`|任意文件上的右键菜单|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\`|文件夹空白处的右键菜单|
|`HKEY_CLASSES_ROOT\Directory\shell\`|文件夹上的右键菜单|

然后直接上表吧，更直观一点

|路径|类型|值|作用|
|:-|:-|:-|:-|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\menu1\(默认)`|REG_SZ|`空`|无作用|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\menu1\Icon`|REG_SZ||显示图标|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\menu1\MUIVerb`|REG_SZ|快捷操作|显示名称|
|`HKEY_CLASSES_ROOT\Directory\Background\shell\menu1\subcommands`|REG_SZ|opencmd;|菜单项目|

`注`:`subcommands`里面可以添加多项，用`;`分隔，比如：`command1;command2`,如果想对项目进行分隔分类可以使用`|`,比如`command1;|;command2;command3`

