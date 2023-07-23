## Gitbook入门篇

### 什么是GitBook？

GitBook 是一个使用 Git 和 Markdown 来构建书籍的工具。它可以将你的书输出很多格式：PDF，ePub，mobi，或者输出为静态网页。

GitBook 是开源并且完全免费的，它的源码可以在 [GitHub](https://github.com/GitbookIO/gitbook) 上获取。与格式和工具链相关的问题被发表在 [github.com/GitbookIO/gitbook/issues](https://github.com/GitbookIO/gitbook/issues)。



`gitBook` 是一个基于`node.js`的命令行工具，使用 `github/git` 和 `markdown/asciiDoc` 构建精美的电子书。它支持输出静态网页和电子书等多种格式,其中默认输出静态网页格式。

`gitbook` 不仅支持本地构建电子书,而且可以托管在 `gitbook` 官网上,并享受在线发布和托管图书的便利,完整的文档请参考 [gitbook 新版文档(需FQ)](https://docs.gitbook.com/) 

> **打开`gitbook.com`网站需要使用代理。**如果还是打不开，请确定你的shadowSocks的PAC是最新的，因为老的PAC可能不包括这个网站。（被坑过）



### 开始之前，你需要的准备

#### 知识准备

[markdown 快速入门](https://github.com/xiaotudui/Markdown-Tutorial)

[git - 简明指南（入门推荐）](https://rogerdudler.github.io/git-guide/index.zh.html)

#### 环境检测

检查 git：` git --version`

检查 node.js：`node --version`

Markdown编辑器：方便本地开发，推荐[Typora](http://typora.io/)或gitbook自己的编辑器[gitbook editor](https://legacy.gitbook.com/editor)

> 最新注册的gitbook账号是无法使用 `gitbook-editor` 编辑器。



### 安装

安装：`npm i -g gitbook-cli`

检查 gitbook ：`gitbook --version`

`gitbook-cli` 是 GitBook 的一个命令行工具。它将自动安装所需版本的 GitBook 来构建一本书。

注：不要运行`npm i -g gitbook`安装，如已安装，运行`npm uni -g gitbook`卸载，重装。



### Gitbook命令

#### 初始化 Gitbook 项目

```shell
gitbook init
```

`gitbook init`会在空项目中创建`README.md`和`SUMMARY.md`两个文件：`README.md`文件是项目的介绍文件。
`SUMMARY.md`是gitbook书籍的目录。

初始化相应的文件目录结构，所以主要是用于**开发初始阶段**.



#### 启动 Gitbook 项目

```shell
gitbook serve [--port 4000]
```

默认情况下服务器启动后会占用两个端口，一个是对外暴露的 `4000` 端口，用于浏览器访问项目。另外一个是 `35729` 端口，用于监听本地文件变化，重启服务器进而实现热加载功能。

本地服务器启动后我们就可以访问 `http://localhost:4000` 预览静态网站效果。由于能够实时预览电子书效果,并且大多数开发环境搭建在本地而不是远程服务器中，所以主要用于**开发调试阶段**。



#### 构建 Gitbook 静态网页

```shell
gitbook build [entry] [--output]
## gitbook build ./ ./docs
```

```
-o, --output <directory>  输出文件件, 默认为 ./_book
-f, --format <name>       产生的书籍的类型, 默认为静态站点, 可用的格式为: site, page, ebook, json
--config <config file>    配置文件, 默认为 book.js 或 book.json
```

构建静态网页而不启动本地服务器，默认生成文件存放在 `_book/` 目录。在`_book`文件夹里有一个`index.html`文件，这个文件就是文档网站的HTM入口，主要用于**发布准备阶段**。

输出静态网页后可打包上传到服务器，也可以上传到 `github` 等网站进行托管。

当然输出目录是可配置的,暂不涉及,见高级部分.



#### 其他命令

```shell
#切换版本
gitbook [version]
#列出当前已安装的版本
gitbook ls
#则是列出远程服务器版本
gitbook ls-remote
#更新版本
gitbook fetch [versiion]
#更新到gitbook的最新版本
gitbook update

#生成电子书
gitbook pdf ./ ./aaaa.pdf
gitbook epub ./ ./aaaa.epub
gitbook mobi ./ ./aaaa.mobi
```



### Gitbook配置文件

如果你想对你的网站有更详细的个性化配置或使用插件，那么需要使用配置文件。配置文件写完后，需要重启服务或者重新打包才能应用配置。
gitbook的配置文件名是`book.json`，首先在项目的根目录中创建`book.json`文件。`book.json`主要内容：

```json
{
    "root": "/", //指定存放 gitbook 文件(除了book.json文件本身)的根目录
	"gitbook" : "3.2.3", //gitbook 版本
    //"title": "我的一本书", //标题
	"page": {
		"title": "前端知识库(lizh)"
	},
    "author" : "lizhao", //作者
    "description" : "", //描述
    "language" : "zh-hans", //使用的语言，zh-hans是简体中文，会对应到页面的<html lang="zh-hans" >
    "variables": {
		"authorName": "lizhao"
	},

    //指定 Readme、Summary、Glossary 和 Languages 对应的文件名
    "structure": {
        //readme: 'README.md', //Readme file name
        //summary: 'SUMMARY.md', //Summary file name
        //glossary: 'GLOSSARY.md', //词汇表文件[可选]
        //languages: 'LANGS.md' //语言文件[可选]
    },
    
    //使用的插件列表，所有的插件都在这里写出来，然后使用gitbook install来安装
    "plugins": [
        //gitbook 默认自带5个插件
        //"highlight", //语法高亮插件
        //"search", //搜索插件
        //"sharing", //分享插件
        //"font-settings", //字体设置插件
		//livereload", //热加载插件
        
        "anchors",
		"expandable-chapters-small",
		"search-plus",
		"toggle-chapters",
		"summary",
		"splitter",
		"theme-comscore",
		"fontsettings"
        
        //"search-pro", //高级搜索（支持中文）
		//"back-to-top-button",
		//chapter-fold, //支持多层目录，点击导航栏的标题名就可以实现折叠扩展。
		//page-treeview, 在页面顶部显示目录
        
        //-符号代表去除默认自带的插件
        "-lunr",
		"-search"
    ],
    
    //插件的配置信息，如果插件需要配置参数，那么在这里填写
    "pluginsConfig": {
		"expandable-chapters-small":{},
		"fontsettings": {
            "theme": "white",
            "family": "sans",
            "size": 2
        }
    },
    
    //目前可以给侧导航栏添加链接信息
    "links" : {
        "sidebar" : {
        }
    },
    
    //自定义页面样式，各种格式对应各自的css文件
    "styles": {
        //"website": "styles/website.css",
        //"ebook": "styles/ebook.css",
        //"pdf": "styles/pdf.css",
        //"mobi": "styles/mobi.css",
        //"epub": "styles/epub.css"
    }
}
```



### gitbook.com 官网操作

`gitbook` 官网是官方提供的图书托管的在线平台，分为**新版官网(需要FQ)** https://www.gitbook.com/ 和旧版官网(无需FQ) [https://legacy.gitbook.com](https://legacy.gitbook.com/) 两个网站。

目前均正常提供服务，但令人遗憾的是，两个网站的信息相互独立，而且现在注册的账号默认只能在新版官网中使用，而**新版官网的访问速度简直比 `github` 还要慢，**所以国内用户在线访问你的电子书真的需要点技术手段了!



将 `github` 个人网站项目同步到 `gitbook` 电子书项目。这样的好处是本地**只需要推送到 `github` ，自动更新 `github.io` 网站**(利用的是`github` 静态网站托管服务)，然后再自动同步到 `gitbook.io` 网站。

操作流程如下：

#### 注册并登陆 gitbook.com（需要使用代理）

#### 新建命名空间(电子书)

![image-20200501132535089](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501132535089.png)

#### 域名&路径

默认域名是 `https://[username].gitbook.io/`，如果需要自定义域名，请保证 `dns` 能够正确解析到该网站。路径是`spacename`。比如：`https://lizh.gitbook.io/knowledge/`

#### 整合Github

`gitbook` 默认提供4种整合方式：`GitHub、Slack、Google Analytics、Intercom`。

以为以 `github` 为例，其余三种没接触过，暂不涉及。

##### 选择 github 进行整合

![image-20200501134230474](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501134230474.png)

##### 选择目标仓库

登录 github 并授权 -> 选择目标仓库 -> 选择同步分支 -> 选择同步内容。

![image-20200501134512566](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501134512566.png)

##### 导入成功

![image-20200501134717525](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501134717525.png)

> 由于 `gitbook` 电子书内容来自于 `github` 项目，因此我们只要更新 `github` 仓库，我们的 `gitbook` 电子书网站自然也就相应更新了!
>
> 美中不足的是,国内无法正常访问 `gitbook.com` 。现在国内也有类似的产品,有一种产品叫做 [看云](https://www.kancloud.cn/)，还不错!



### Gitbook插件

插件是 `gitbook` 的扩展功能，很多炫酷有用的功能都是通过插件完成的。其中插件有[官方插件](https://plugins.gitbook.com/)和第三方插件[npm](https://www.npmjs.com/)之分。根据 `gitbook` [插件规范](https://toolchain.gitbook.com/plugins/), `gitbook-plugin-` 是功能插件,`gitbook-theme-` 是主体插件。

**基本使用：**

* 先安装到本地： `npm install gitbook-plugin-<name>`（可略）
* 插件配置：在 `book.json` 中 `plugins` 节点
* 安装： `gitbook install`

```json
{
	"plugins": [
        "myPlugin"
    ],
    "pluginsConfig": {
        "myPlugin": {}
    }
}
```



### 常见问题

#### gitbook build 或 gitbook serve报错

```shell
gitbook: 3.2.3
node：v12.2.0
npm：6.9.0

Error: ENOENT: no such file or directory, stat 'xxxx\_book\gitbook\gitbook-plugin-fontsettings\fontsettings.js'
```

**方法一：**将`C:\Users\[whoami]\.gitbook\versions\3.2.3\lib\output\website\copyPluginAssets.js`第112行confirm: true注释，或改成confirm: false

**方法二：**关闭杀毒软件



#### windows系统无法热加载，总是报错

```js
Stopping server
events.js:173
      throw er; // Unhandled 'error' event
      ^

Error: EPERM: operation not permitted, lstat 'D:\MyCode\gitBook\_book'
Emitted 'error' event at:
    at FSWatcher._handleError (C:\Users\[whoami]\.gitbook\versions\3.2.3\node_modules\chokidar\index.js:236:10)
    at ReaddirpReadable.emit (events.js:196:13)
    at Immediate.<anonymous> (C:\Users\[whoami]\.gitbook\versions\3.2.3\node_modules\chokidar\node_modules\readdirp\stream-api.js:82:32)
    at processImmediate (internal/timers.js:439:21)
```

控制台信息说是操作权限的问题。打开项目，当前项目已经没有 `_book` 目录，证明发生报错时确实已经删除了 `_book` 目录，但是某种原因无权再次创建该文件夹而重启失败。结论是 `gitbook` 是删除 `_book` 文件夹再新建 `_book` 文件夹时发生了意外。

**解决方法：**在启动本地服务器后立即删除 `_book` 目录，当本地文件发生修改时重启服务就能成功了。

**这个官方已知的一个bug，且没有想修复的意思。~只能期待gitbook升级了~**



#### 内容无法在gitbook.com显示

文件夹名称有大写字母或者文件名中有空格会导致 gitbook.com 网站中对应的链接无法访问。



### ~题外话~

搭建文档类站的工具，除了gitbook外，还有以下两种：

####  [Docsify](https://docsify.js.org/#/zh-cn/) 

docsify 是一个动态生成文档网站的工具。不同于 GitBook、Hexo 的地方是它不会生成将 `.md` 转成 `.html` 文件，所有转换工作都是在运行时进行。

这将非常实用，如果只是需要快速的搭建一个小型的文档网站，或者不想因为生成的一堆 `.html` 文件“污染” commit 记录，只需要创建一个 `index.html` 就可以开始写文档而且直接[部署在 GitHub Pages](https://docsify.js.org/#/zh-cn/deploy)。

插件方面，docsify插件不如Gitbook的丰富，但麻雀虽小五脏俱全，该有的基本也都有，足够使用。

**对 SEO 不够友好，**因为它是完全的运行时驱动的。

**[特性：](https://docsify.js.org/#/zh-cn/?id=特性)**

- 无需构建，写完文档直接发布
- 容易使用并且轻量 (压缩后 ~21kB)
- 智能的全文搜索
- 提供多套主题
- 丰富的 API
- 支持 Emoji
- 兼容 IE11
- 支持服务端渲染 SSR ([示例](https://github.com/docsifyjs/docsify-ssr-demo))



#### [VuePress ](https://vuepress.vuejs.org/zh/guide/)

VuePress 由两部分组成：第一部分是一个[极简静态网站生成器](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/core)，它包含由 Vue 驱动的[主题系统](https://vuepress.vuejs.org/zh/theme/)和[插件 API](https://vuepress.vuejs.org/zh/plugin/)，另一个部分是为书写技术文档而优化的[默认主题](https://vuepress.vuejs.org/zh/theme/default-theme-config.html)，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。

每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具**有非常好的加载性能和搜索引擎优化（SEO）**。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他的页面则会只在用户浏览到的时候才按需加载。

**[特性：]([https://vuepress.vuejs.org/zh/guide/#%E5%AE%83%E6%98%AF%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84%EF%BC%9F](https://vuepress.vuejs.org/zh/guide/#它是如何工作的？))**

- 内置的 Markdown 拓展
- 在 Markdown 中 使用 Vue
- Vue驱动的自定义主题系统
- 默认主题
- ...



除此外，还有Docute、Hexo...





### 参数链接

[雪之梦技术驿站](https://snowdreams1006.tech/markdown/)