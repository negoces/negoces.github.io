# 使用 Node 搭建一个自动部署博客


## 我为什么要使用 Node 来搭建 Hugo 博客

我最开始的博客是使用 Hexo 搭建的，那时候刚用的时候觉得很香。但是用到后来，随者文章数量的增加，Hexo 的生成时间直接变成了分钟级别。后来就看到了 Hugo 便将博客转移到了 Hugo 上面并同时看到了 Vercel 的托管服务，当时就觉得白嫖真香。作为一个懒癌晚期，肯定要整个自动部署，很巧 vercel 提供了 hugo 的自动部署，但是不支持 hugo-extended，导致我的博客并不能通过部署，为了解决这个问题便写了个 Github Actions 让 Github 将博客静态文件构建到 gh-pages，vercel 直接部署 gh-pages 分支的静态文件。这次就使用 Node 来简化一下流程，使 vercel 支持 hugo-extended。

<!--more-->

```yaml
原流程: 推送仓库 => Github Actions 构建 => 发布到 gh-pages 分支 => 部署到 vervel
现流程: 推送仓库 => vercel 构建并部署
```

## 使用 Yarn 创建一个 Node 项目

首先得确保你安装了 [Node.js](https://nodejs.org/zh-cn/) 并且安装了 `Yarn`(你对`npm`很熟悉的话也不是不能用)

之后，咱找个地方创建咱的博客文件夹

```bash
mkdir blog && cd blog
```

之后，使用`yarn init`创建项目

```bash
$ yarn init
yarn init v1.22.10
question name (node): blog          # 项目名
question version (1.0.0):           # 版本，可直接回车
question description: my blog       # 项目描述，可留空
question entry point (index.js):
question repository url:
question author: negoces            # 作者
question license (MIT):             # 开源协议
question private:
success Saved package.json
Done in 39.47s.
```

## 在 Node 项目中安装 Hugo 并创建博客站点

安装 hugo (期间需要代理，TUN 模式的那种)

```bash
yarn add hugo-extended
```

创建站点(hugo 无法在非空文件夹里面创建站点，所以先建在 tmp 目录再移回来)

```bash
yarn hugo new site tmp
mv tmp/* ./
rm -rf tmp
```

## 初始化 Git 仓库并安装主题

```bash
git init
git branch -m main
# 安装主题(链接已加速)
git submodule add https://github.com.cnpmjs.org/CaiJimmy/hugo-theme-stack/ themes/hugo-theme-stack
```

删除 hugo 默认的配置和内容，替换成主题的示例配置

```bash
rm -rf config.toml
rm -rf content/
cp themes/hugo-theme-stack/exampleSite/config.yaml ./
cp -r themes/hugo-theme-stack/exampleSite/content/ ./
```

删除`rich-content`文章，否则在本地测试构建时会有些文件下载不下来，导致构建失败(有代理当我没说)

```bash
rm -rf content/post/rich-content/
yarn hugo serve
```

## 配置 NPM 脚本并测试构建

编辑`package.json`并加入`"scripts"`项

```json
{
  "name": "blog",
  "version": "1.0.0",
  "description": "my blog",
  "main": "index.js",
  "author": "negoces",
  "license": "MIT",
  "dependencies": {
    "hugo-extended": "^0.84.0"
  },
  "scripts": {
    "build": "hugo -d ./dist"
  }
}
```

测试构建

```bash
yarn build
```

## 配置 gitignore 并创建提交

编辑 `.gitignore`

```text
/dist/
/resources/_gen/
.vscode/*
tags
/node_modules/
yarn.lock
```

创建提交

```bash
git add *
git add .gitignore
git commit -m "init"
```

## 推送到 Github 并在 Vercel 部署项目

前往 Github 创建仓库

添加远程地址并推送:

```bash
git remote add origin <远程地址>
git push -u origin main
```

到 vercel 创建项目

| 参数             | 值         |
| :--------------- | :--------- |
| FRAMEWORK PRESET | Other      |
| BUILD COMMAND    | yarn build |
| OUTPUT DIRECTORY | dist       |

## 示例网站

[https://testblog-three.vercel.app/](https://testblog-three.vercel.app/)

> 这主题还蛮好看的，后期可能会将现博客迁移到这个主题上
