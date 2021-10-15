## Gitbook插件篇

插件是 `gitbook` 的扩展功能，很多炫酷有用的功能都是通过插件完成的。其中插件有[官方插件](https://plugins.gitbook.com/)和第三方插件[npm](https://www.npmjs.com/)之分。根据 `gitbook` [插件规范](https://toolchain.gitbook.com/plugins/), `gitbook-plugin-` 是功能插件,`gitbook-theme-` 是主体插件.



### 安装插件

* 先安装到本地 `npm install gitbook-plugin-<name>`（可略）

* 配置：在 `book.json` 中 `plugins` 配置插件名称，`pluginsConfig`配置插件参数。

* 安装： `gitbook install`。

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

  

### 一些有趣的插件

#### donate 打赏插件

文章最下面的按钮，点击可弹出图片

```json
{
    "plugins": [
        "donate"
    ],
    "pluginsConfig": {
        "donate": {
            "wechat": "微信收款的二维码URL",
            "alipay": "支付宝收款的二维码URL",
            "title": "",
            "button": "赏",
            "alipayText": "支付宝打赏",
            "wechatText": "微信打赏"
        }
    }
}
```



#### disqus 评论插件（需注册账号）

[discus](https://disqus.com/) 是一款集成评论的插件，可以为静态网站添加动态评论，让你的网站动起来!

> 遗憾的是，`discus` 插件只有 FQ 才能正常使用，暂时没找到其他较好的替代方案。
>
> `gitbook` 集成 `disqus` 插件中最重要的配置项就是注册 `disqus.com` 网站唯一标识。

```json
{
    "plugins": ["disqus"],
    "pluginsConfig": {
        "disqus": {
            "shortName": "snowdreams1006"
        }
    }
}
```



#### gitalk 评论插件

上述 `disqus` 评论插件虽然比较好用，但是注册是在 `disqus.com` 官网，需要特殊手段才能访问，即便成功配置了国内一般也是访问不到的，因此功能相当鸡肋。

`gitalk` 评论插件解决了这一痛点，利用 `github` 的开发者接口授权，将讨论区的 `issue` 变成评论区，和 `github` 结合的如此紧密，**适合用源码托管到 `github` 这类情况。**

实出操作如下：

##### 申请 GitHub Application 授权

登录 `github` 账号，点击 [在线申请](https://github.com/settings/applications/new) 授权应用。

新建应用，**首页 url 和授权回调 url 填写相同的首页链接即可**，其他情况自定义填写。

应用登记成功后会生成 `token` 令牌，`clientId` 和 `clientSecret` 需要重点保存下来，待会需要用到。

![image-20200501141958185](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501141958185.png)

##### 安装并集成到网站

在需要添加评论的页面，添加下述内容引入 `gitalk` 插件，其中参数来自我们上一步获取的 `clientId` 和 `clientSecret` 。

默认应该添加到 `.html` 页面，当然也可以添加到 `.md` 页面，毕竟 `markdown` 语法也支持 `html` 标签。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
var gitalk = new Gitalk({
    "clientID": "clientId",
    "clientSecret": "clientSecret",
    "repo": "GitHub repo",
    "owner": "GitHub repo owner",
    "admin": ["GitHub repo admin"],
    "id": location.pathname,      
    "distractionFreeMode": false  
});
gitalk.render("gitalk-container");
```

```shell
"clientID" : [必选] GitHub Application Client ID
"clientSecret" : [必选] GitHub Application Client Secret
"repo" : [必选] GitHub repository
"owner" : [必选] GitHub repository 所有者，可以是个人或者组织
"admin" : [必选] GitHub repository 的所有者和合作者 (对这个 repository有写权限的用户)
"id" : [可选] 页面的唯一标识,默认值: location.href, 长度必须小于50,否则会报错!
"distractionFreeMode": [可选] 类似 Facebook 评论框的全屏遮罩效果,默认值: false
```

> 注意：必须推送到服务器。因为申请应用时填写的域名是线上地址，因而本地测试是不会成功的，会报错。
>
> 注意：需要管理员对 `Issue` 进行初始化创建。

**遗憾的是：**我们目前仅仅在首页(`README.md`) 集成了 `gitalk` 插件，也就是说使用 `gitbook build` 输出的 `index.html` 首页才支持评论区，其他页面没有插入上述代码，自然是没有评论区功能的啊！**目前并没有找到优雅的解决方案。**

**解决思路：**无非就是在`js`里面加一段Gitalk的调用代码，这样使用gitbook build命令的时候，所有的页面都会有Gitalk的评论调用。



#### mygitalk 评论插件

`gitbook-plugin-mygitalk` 是全网最早发布的基于 `gitalk` 实现评论插件,用于给 `Gitbook` 博客网站集成评论功能。

![image-20200501193223338](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501193223338.png)

```json
{
  "plugins" : ["mygitalk"],
  "pluginsConfig": {
    "mygitalk": {
        "clientID": "GitHub Application Client ID",
        "clientSecret": "GitHub Application Client Secret",
        "repo": "GitHub repo",
        "owner": "GitHub repo owner",
        "admin": ["GitHub repo owner and collaborators, only these guys can initialize github issues"],
        "distractionFreeMode": false
    }
  }
}
```

#### change_girls 可自动切换的背景

添加背景图片，并且可以自动切换

```json
{
    "plugins":["change_girls"],
    "pluginsConfig": {
        "change_girls" : {
            "time" : 10,
            "urls" : [
                "girlUrl1", "girlUrl2",...""
            ]
        }
    }
}
```



#### copyright 版权保护插件

如果你的博客不希望被别人随意转载或者文章希望保留首发网站信息，那么推荐使用[copyright插件](https://www.npmjs.com/package/gitbook-plugin-copyright)帮助你进行版权保护。

`gitbook-plugin-copyright` 版权保护插件实现复制文章时自动追加版权保护信息，并在文章结尾处追加来源信息。

![image-20200501193041965](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501193041965.png)

```json
{
    "plugins": ["copyright"],
    "pluginsConfig": {
        "copyright": {
        "site": "",
        "author": "",
        "website": "",
        "image": ""
        }
    }
}
```

#### readmore 阅读更多插件

如果 `Gitbook` 个人博客流量不错的话，可以考虑转化成公众号流量，`readmore` 插件是集成[OpenWrite](https://openwrite.cn/)提供引流工具，通过关注公众号解锁博客文章，实现粉丝转换!、

```json
{
    "plugins": ["readmore"],
    "pluginsConfig": {
        "readmore":{
            "blogId": "",
            "name": "",
            "qrcode": "",
            "keyword": ""
        }
    }
}
```

#### advanced-emoji - 支持emoji表情

```json
{
    "plugins": [
        "advanced-emoji"
    ]
}
```



### 一些实用插件

#### search-plus 中文搜索插件

默认的 `search` 搜索插件是不支持中文搜索的，而 `search-plus` 则功能更强大些，两者不能共存，需要禁用或移除 `search` 插件。

![image-20200501192908268](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501192908268.png)

```json
{
    "plugins": [
      "-lunr", 
      "-search", 
      "search-plus"
    ]
}
```

#### expandable-chapters-small 可扩展导航章节

`expandable-chapters`效果相同，唯一不同的是这个插件的箭头粗。

支持多层目录。点击箭头才能实现收放目录。不如`chapter-fold`好用。

```json
{
    "plugins": [
         "expandable-chapters-small"
    ]
}
```

#### gitbook-plugin-summary

自动生成SUMMARY.md文件

```json
{
    "plugins": [
        "summary"
    ]
}
```

#### page-treeview 生成页内目录

生成目录，放在页面顶部

![image-20200501192832829](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200501192832829.png)

```json
{
    "plugins": [
        "page-treeview"
    ],
    "pluginsConfig": {
        "page-treeview": {
            "copyright": "Copyright &#169; aleen42",
            "minHeaderCount": "2",
            "minHeaderDeep": "2"
        }
    }
}
```

#### tbfed-pagefooter 页脚插件

```json
{
    "plugins": ["tbfed-pagefooter"],
    "pluginsConfig": {
        "tbfed-pagefooter": {
          "copyright":"&copy username",
          "modify_label": "文件修订时间：",
          "modify_format": "YYYY-MM-DD HH:mm:ss"
        }
    }
}
```

#### pageview-count 阅读量计数

```json
{
  "plugins": [ "pageview-count"]
}
```

#### accordion 折叠模块

这个插件名叫手风琴，可以实现将内容隐藏起来，外部显示模块标题和显示箭头，点击箭头可显示里面的内容。

```json
{
  "plugins": ["accordion"]
}
```

用法：编辑内容，用下面的标签括起来

```html
%accordion%模块标题%accordion%
内容部分
%/accordion%
```

#### hide-element 隐藏元素

可以隐藏不想看到的元素，比如导航栏中`Published by GitBook`

```json
{
    "plugins": [
        "hide-element"
    ],
    "pluginsConfig": {
        "hide-element": {
            "elements": [".gitbook-link"]
        }
    }
}
```

#### splitter 侧边栏宽度可调节

```json
{
    "plugins": [
        "splitter"
    ]
}
```

####  sharing-plus

分享当前页面，比默认的 sharing 插件多了一些分享方式。

```json
{
    "plugins": ["-sharing", "sharing-plus"],
    "pluginsConfig": {
        "sharing": {
             "douban": false,
             "facebook": false,
             "google": true,
             "pocket": false,
             "qq": false,
             "qzone": true,
             "twitter": false,
             "weibo": true,
          "all": [
               "douban", "facebook", "google", "instapaper", "linkedin","twitter", "weibo", 
               "messenger","qq", "qzone","viber","whatsapp"
           ]
       }
    }
}
```

#### klipse 嵌入类似IDE的功能

嵌入一块功能，可在代码段中实时交互，即（输入代码 > 执行结果

```json
{
    "plugins": ["klipse"]
}
```

klipse 目前支持下面的语言：

- javascript: evaluation is done with the javascript function eval and pretty printing of the result is done with pretty-format
- clojure[script]: evaluation is done with Self-Hosted Clojurescript
- ruby: evaluation is done with Opal
- C++: evaluation is done with JSCPP
- python: evaluation is done with Skulpt
- scheme: evaluation is done with BiwasScheme
- PHP: evaluation is done with Uniter
- BrainFuck
- JSX
- EcmaScript2017
- Google Charts: See Interactive Business Report with Google Charts.



#### github 插件

添加 `github` 图标链接，方便直接跳转到 `github` 指定仓库。

```json
{
    "plugins": ["github"],
    "pluginsConfig": {
        "github": {
          "url": "https://github.com/snowdreams1006/snowdreams1006.github.io"
        }
    }
}
```

#### edit-link 编辑链接插件

如果希望将网页源码暴露出去并接受公众的监督校准的话，使用[edit-link插件](https://plugins.gitbook.com/plugin/edit-link)可以直接链接到源码文件。

```json
{
    "plugins": ["edit-link"],
    "pluginsConfig": {
        "edit-link": {
          "base": "",
          "label": ""
        }
    }
}
```

#### back-to-top-button 回到顶部

```json
{
    "plugins": [
         "back-to-top-button"
    ]
}
```

#### chapter-fold 导航目录折叠

支持多层目录，点击导航栏的标题名就可以实现折叠扩展。

```json
{
    "plugins": ["chapter-fold"]
}
```

#### code 代码添加行号&复制按钮（可选）

```json
{
    "plugins" : [ 
            "code" 
     ],
    "pluginsConfig": {
      "code": {
        "copyButtons": false
      }
    }
}
```

#### insert-logo 插入logo

将logo插入到导航栏上方中

```json
{
    "plugins": [ "insert-logo" ]
    "pluginsConfig": {
      "insert-logo": {
        "url": "images/logo.png",
        "style": "background: none; max-height: 30px; min-height: 30px"
      }
    }
}
```





### 主题插件

#### theme-default 主题

`theme-default` 是 `3.0.0` 引入的默认主题，大多数插件针对的都是默认主题，如果切换到其他主题或者自定义主题，可能会造成某些情况下不兼容,甚至报错。

默认情况下，左侧菜单不显示层级属性，如果将 `showLevel` 属性设置为 `true` 可以显示层级数字。

```json
{
    "plugins": [
      "theme-default"
    ]
	"pluginsConfig": {
        "theme-default": {
            "showLevel": true
        }
	}
}
```

#### theme-comscore 主题

`default` 默认主题是黑白的，而 `comscore` 主题是彩色，即标题和正文颜色有所区分。

```json
"plugins": [
   "theme-comscore"
]
```

#### flexible-alerts 警报

这个GitBook插件将块引用转换为漂亮的警报。此外，您还可以提供自己的警报类型（比如最后的comment）。

```json
{
    "plugins": [
      "flexible-alerts"
    ],
    "pluginsConfig": {
      "flexible-alerts": {
        "style": "callout",
        "comment": {
          "label": "Comment",
          "icon": "fa fa-comments",
          "className": "info"
        }
      }
    }
}
```

arkdown文件中编辑

```html
> [!NOTE]
> 这是一个简单的Note类型的使用，所有的属性都是默认值。
```

上面的`[!NOTE]`是行匹配模式，默认情况下支持类型`NOTE`，`TIP`，`WARNING`和`DANGER`。

```html
> [!type|style:xx|label:xx|icon:xx|className:xx|labelVisibility:xx|iconVisibility:xx]
> 内容部分
```





#### theme-api 插件

如果文档本身是普普通文档模式，切换成 `api` 文档模式后并不会有太大变化，除非一开始就是接口文档，那样使用 `theme-api` 插件才能看出效果。

```json
{
    "plugins": ["theme-api"],
    "pluginsConfig": {
        "theme-api": {
            "theme": "dark"
        }
    }
}
```

#### theme-faq 插件

`theme-faq` 可以帮助我们构建问答中心，预设好常见问题以及相应答案模式，同时为了方便搜索到问题或答案，一般需要搜索插件的配合。

帮助中心没有工具栏，因此涉及到工具类的插件一律失效或主动移除，同时默认搜索插件也会失效。

```json
{
    "plugins": [
        "theme-faq",
        "-fontsettings",
        "-sharing",
        "-search", 
        "search-plus"
    ]
}
```





### 插件开发

`GitBook` 插件是在 `npm` 上发布的遵循**传统定义**的 `node` 包，除了标准的 `node` 规范外还有一些 `Gitbook` 自身定义的相关规范。

#### 目录结构

`Gitbook` 插件最基本的项目结构至少包括**配置文件** `package.json` 和**入口文件** `index.js` ，其他目录文件根据插件用途自行增减。

> 实际插件项目略有不同，可能还会有 `_layouts` 布局目录， `asset` 资源目录以及自定义 `example` 示例目录和 `docs` 文档目录等等。

####  package.json

`package.json` 是**`nodejs`**的配置文件，`Gitbook` 插件同样遵循该规范，配置文件声明了插件的版本描述性信息，除此之外还有 `Gitbook` 相关字段，遵循[`schema`](http://json-schema.org/)准则，基本示例如下：

```json
{
    "name": "gitbook-plugin-mytest",
    "version": "0.0.1",
    "description": "This is my first GitBook plugin",
    "engines": {
        "gitbook": ">1.x.x"
    },
    "gitbook": {
        "properties": {
            "myConfigKey": {
                "type": "string",
                "default": "it's the default value",
                "description": "It defines my awesome config!"
            }
        }
    }
}
```

值得注意的是，**包名称**必须以 `gitbook-plugin-`开头，**包引擎**应该包含`gitbook`。

####  index.js

`index.js` 是插件运行时的入口，基本示例如下：

```js
module.exports = {
    // 钩子函数
    hooks: {},

    // 代码块
    blocks: {},

    // 过滤器
    filters: {}
};
```

#### 专用插件

专用插件可以托管在 `GitHub` 上，并使用 `git` urls：

```json
{
    "plugins": [
        "myplugin@git+https://github.com/MyCompany/mygitbookplugin.git#1.0.0"
    ]
}
```

#### 发布&测试插件

与其他npm插件一样。`GitBook` 插件可以在[`npmjs`官网](https://www.npmjs.com/)上发布。如需发布插件，首先需要在[`npmjs`官网](https://www.npmjs.com/)上**注册帐户**，然后通过命令行发布。

```shell
npm publish
```

```shell
#在插件的文件夹中，运行
npm link

#然后在您的书或者文档的文件夹中执行
npm link gitbook-plugin-<name>
```



### 参数链接

[雪之梦技术驿站](https://snowdreams1006.tech/markdown/)

[GitBook插件整理](https://www.jianshu.com/p/427b8bb066e6)