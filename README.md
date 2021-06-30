<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">

<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
**本文档主要用于：**

整理前端开发中遇到的各种bug

对一些浏览过、探索过、实践过的前端技术做一些笔记



#### 项目运行

**安装项目:** `gitbook install` 

**本地启动：**`sh serve` 

根目录下有个名`serve`的shell文件，是为了解决`gitbook serve`热加载出现中断的问题和指定输出路径。

本地启动项目的核心命令是：`gitbook serve [--input] [--output]  [--port 4000]` 。

`--input`是需要编译的项目地址。可不传，默认当前根目录下。

`--output`是编译后的输出路径。可不传，默认`_book`。指定输出目录为`./docs`，是因为`GitHub Pages`的静态网站指定的目录是`master` 分支下的`./docs`文件夹。

`--port`是端口号。可不传，默认4000

**生成文件：**`sh build`

**项目`git push`之前，需要`sh build`更新`SUMMARY.md`文件。**

根目录下有个名`build`的shell文件。是为了解决自动生成`SUMMARY.md`时不编译`docs`目录下的文件和指定输出路径。

生成文件的核心命令是：`gitbook build[--input] [--output]` 

`--input`是需要编译的项目地址。可不传，默认当前根目录下。

`--output`是编译后的输出路径。可不传，默认`_book`。指定输出目录为`./docs`，是因为`GitHub Pages`的静态网站指定的目录是`master` 分支下的`./docs`文件夹。



#### 本文有两个访问地址

[Gitbook.io](https://lizh.gitbook.io/knowledge)

[Github Page](https://1927344728.github.io/frontend-knowledge/)



#### 已知问题

* Gitbook不支持原生的`html、css`语法

  ```js
  GitBook doesn't render plane HTML or CSS so the workaround would be to wrap them into a code block by adding '```'
  ```

  ```js
  We don't plan on supporting plain HTML or CSS I'm afraid
  ```

* `Gitbook.com`中引入了`gitalk`做评论插件。目前遇到问题，无法正常显示

  项目引入是基于`gitalk`的`mygitalk`插件。已向作者提issue，暂未回复。

