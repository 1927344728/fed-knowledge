## html探索系列-meta标签

META 标签是 HTML 语言 HEAD 区的一个辅助性标签。**它提供关于 HTML 文档的元数据**。它不会显示在页面上，但是对于机器是可读的。可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务。

### 什么是元数据？

元数据（Metadata）被定义为：描述数据的数据，对数据及信息资源的描述性信息。

比如一本书的元数据：书名、作者、出版社、总页数、出版时间、书的描述（是关于什么的书）等。

HTML 文档的元数据：**字符集、页面描述、日期时间、页面刷新、关键字、文档作者和视口设置**等。

### meta有什么用？

META 标签用来描述一个 HTML 网页文档的元数据。它提供的信息用户是不可见，它主要是供机器解读的，告诉机器该如何解析这个页面。另外，还有一个用途是可以添加服务器发送到浏览器的 http 头部内容。

- 搜索引擎（SEO）优化

  meta 标签的一个很重要的功能就是设置关键字，来帮助网页被各大搜索引擎登录，提高网站的访问量。在这个功能中，最重要的就是对 **keywords** 和 **description** 的设置。因为按照搜索引擎的工作原理，搜索引擎首先派出机器人自动检索页面中的 keywords 和 decription，并将其加入到自己的数据库，然后再根据关键词的密度将网站排序。

- 定义页面使用语言

- 定义 http 头部内容

- 自动刷新页面

- 控制页面缓存

- 实现网页转换时的动画效果 （IE 浏览器）

- 网页定级评价

  在IE的 internet 选项中有一项内容设置，可以防止浏览一些受限制的网站，而网站的限制级别就是通过 meta 属性来设置的。

  级别的评定是由美国RSAC，即娱乐委员会的评级机构评定的。如果你需要评价自己的网站，可以连接到网站，按要求提交表格，那么 RSAC 会提供一段 meta 代码给你，复制到自己网页里就可以了。

  ```html
  <mata http-equiv="Pics-label" Contect="">
  ```

- 控制页面显示的窗口

- 等等…



META 标签定义的元数据的类型：

| content    | 定义与 http-equiv 或 name 属性相关的元信息。 |
| ---------- | -------------------------------------------- |
| name       | 描述文档级别的元数据，应用于整个页面         |
| http-equiv | 编译指令，提供的信息与类似命名的HTTP头部相同 |
| charset    | 一个字符集声明，告诉文档使用哪种字符编码     |
| scheme     | 定义用于翻译 content 属性值的格式。h5不支持  |

### content属性

meta 标签有  http-equiv 或 name 属性时，一定要有 content 属性对其进行说明。

### name属性

name 属性主要用于描述网页，对应于网页内容，以便于搜索引擎机器人查找、分类。

如果没有提供 name 属性，那么名称/值对中的名称会采用 http-equiv 属性的值。如：

```html
<meta content="text/html; charset=utf-8">

<!--等价于-->
<meta http-equiv="content-Type" content="text/html; charset=utf-8">
```

name 常见参数有：

| 属性             | 说明                                                 |
| ---------------- | ---------------------------------------------------- |
| application-name | 定义正运行在该网页上的网络应用名称                   |
| keywords         | 告诉搜索引擎网页的关键字是什么                       |
| description      | 告诉搜索引擎网页的主要内容                           |
| author           | 标注网页的作者                                       |
| generator        | 标注网站是采用什么软件制作的                         |
| copyright        | 标注版权                                             |
| viewport         | 控制浏览器窗口的大小和缩放的，在移动端浏览器非常常用 |
| robots           | 告诉搜索机器人哪些页面需要索引，哪些页面不需要索引   |

```html
<!--定义正运行在该网页上的网络应用名称-->
<meta name="application-name" content="anmin">

<!--定义搜索引擎的关键字，搜索引擎在遇到这些关键字时，会用这些关键字对文档进行分类-->
<meta name="keywords" content="HTML, CSS, JavaScript">

<!--定义您的网页描述-->
<meta name="description" content="Free Web tutorials for HTML and CSS">

<!--定义页面的作者-->
<meta name="author" content="John Doe">
```

#### viewport参数

一个常用的针对移动网页优化过的页面的 viewport meta 标签大致如下：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
```

- width：控制 viewport 的大小，可以指定的一个值，如果 600，或者特殊的值，如 device-width 为设备的宽度（单位为缩放为 100% 时的 CSS 的像素）。
- height：和 width 相对应，指定高度。
- initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例。
- maximum-scale：允许用户缩放到的最大比例。
- minimum-scale：允许用户缩放到的最小比例。
- user-scalable：用户是否可以手动缩放

#### robots参数

Robots 用来告诉搜索机器人哪些页面需要索引，哪些页面不需要索引。默认是 all。

```html
<meta name="robots" Content="All|None|Index|Noindex|Follow|Nofollow">
```

* all：文件将被检索，且页面上的链接可以被查询
* none：文件将不被检索，且页面上的链接不可以被查询；与 `noindex, no follow` 起相同作用
* index：文件将被检索（让机器人或爬虫登录）
* follow：页面上的链接可以被查询
* noindex：文件将不被检索，但页面上的链接可以被查询；(不让机器人或爬虫登录)
* nofollow：文件将不被检索，页面上的链接可以被查询。(不让机器人或爬虫顺着此页的连接往下探找) 

#### revisit-after参数 

如果页面不是经常更新，为了减轻搜索引擎爬虫对服务器带来的压力，可以设置一个爬虫的重访时间。如果重访时间过短，爬虫将按它们定义的默认时间来访问。

```html
<meta name="revisit-after" content="7 days" >
```

#### renderer参数

renderer 是为双核浏览器准备的，用于指定双核浏览器默认以何种方式渲染页面。比如说360浏览器。

```html
<!--默认webkit内核-->
<meta name="renderer" content="webkit">
<!--默认IE兼容模式-->
<meta name="renderer" content="ie-comp">
<!--默认IE标准模式-->
<meta name="renderer" content="ie-stand">
```

#### referrer参数

控制所有从该文档发出的 HTTP 请求中 HTTP Referer 首部的内容，默认 no-referrer-when-downgrade。

如修改为 origin：

![image-20200829201150240](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200829201150240.png)

```html
<meta name="referrer" content="origin">
```

- no-referrer：不要发送 HTTP Referer 首部
- origin：发送当前文档的 origin
- no-referrer-when-downgrade：当目的地是先验安全的（https->https）则发送 origin 作为 referrer ，但是当目的地是较不安全的 （https -> http）时则不发送 referrer 。这个是默认的行为。
- origin-when-crossorigin：在同源请求下，发送完整的URL (不含查询参数) ，其他情况下则仅发送当前文档的 origin。
- unsafe-URL：在同源请求下，发送完整的URL (不含查询参数)。

**动态地插入**`<meta name="referrer">` (通过 `document.writ`e 或者 `appendChild`) 是不起作用的。同样注意如果同时有多个彼此冲突的策略被定义，那么 ` no-referrer`  策略会生效。

#### 其他参数

```html
<!--表示添加到主屏后的标题-->
<meta name="apple-mobile-web-app-title" content="标题">

<!--表示隐藏状态栏/设置状态栏颜色：只有在开启WebApp全屏模式时才生效。content的值为default | black | black-translucen-->
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!--表示启用 WebApp 全屏模式-->
<meta name="apple-mobile-web-app-capable" content="yes">

<!--表示忽略数字自动识别为电话号码、忽略识别邮箱、-->
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="email=no">
<meta name="format-detection" content="telephone=no,email=no">

<!--禁止跳转至地图-->
<meta name="format-detection" content="adress=no">

<!--页面的最新版本-->
<meta name="revised" content="web app V.1.0.0" />
```



### http-equiv属性 

http-equiv 顾名思义，相当于 http 的文件头作用。http-equiv 属性是添加 http 头部内容，对一些自定义的，或者需要额外添加的 http 头部内容，需要发送到浏览器中，我们就可以是使用这个属性。

http-equiv 属性主要有以下几种参数：

#### content-type参数

content-type 用于设定网页字符集，便于浏览器解析与渲染页面。

```html
<!--HTML5以下-->
<meta http-equiv="content-Type" content="text/html;charset=utf-8">
<!--HTML5-->
<meta charset="utf-8">
```

#### content-language参数

用以说明主页制作所使用的文字以及语言。

```html
<meta http-equiv="content-language" content="zh-CN">
```

还可以是：EN、FR等语言代码。

#### refresh参数

设置一个周期（以秒为单位），之后，将从服务器重新加载当前页面，还可以指定要加载的其他URL。

```html
<!--表示当前页面每5秒钟刷一下-->
<meta http-equiv="refresh" content="5"/>
<!--表示当前页面5秒后跳到首页其他地址-->
<meta http-equiv="refresh" content="5; url=">
<!--表示页面直接跳转到其他网页-->
<meta http-equiv="refresh" content="0; url=">
```

#### default-style参数

设置默认 CSS 样式表组的名称。content 属性的值必须与同一文档中的脚本或链接元素上的title属性匹配。

```html
<meta http-equiv="default-style" content="*the document's preferred stylesheet*">
```

**注意：**上面 content 属性的值必须匹配同一文档中的一个 link 元素上的 title 属性的值，或者必须匹配同一文档中的一个 style 元素上的 title 属性的值。

#### X-UA-Compatible参数

用于告知浏览器以何种版本来渲染页面。一般都设置为最新模式，在各大框架中这个设置也很常见。

```html
<!--指定IE和Chrome使用最新版本渲染当前页面-->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
```

#### cache-control参数

指定浏览器如何缓存某个响应以及缓存多长时间。

```html
<meta http-equiv="cache-control" content="no-cache">
```

共有以下几种用法：

- no-cache：先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。
- no-store：直接禁止浏览器以及所有中间缓存存储任何版本的返回响应。
- public：即使有关联的 HTTP 身份验证，甚至响应状态代码通常无法缓存，也可以缓存响应，即**内容可以被客户端和代理服务器缓存**。 大多数情况下，它不是必需的，因为明确的缓存信息（例如 `max-age`）已表示响应是可以缓存的。
- private：通常只为单个用户缓存，因此不允许任何中间缓存对其进行缓存，**即客户端可以缓存，代理服务器不可缓存**。 例如，用户的浏览器可以缓存包含用户私人信息的 HTML 网页，但 CDN 却不能缓存。
- maxage：表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60表示响应可以再缓存和重用 60 秒。
- must-revalidation/proxy-revalidation：如果缓存的内容失效，请求必须发送到服务器/代理以进行重新验证。

禁止百度自动转码：

```html
<meta http-equiv="Cache-Control" content="no-siteapp" />
```

#### pragma参数

禁止浏览器从本地计算机的缓存中访问页面内容。

```html
<meta http-equiv="Pragma" content="no-cache" />
```

#### expires参数

用于设定网页的到期时间，过期后网页必须到服务器上重新传输。

```html
<meta http-equiv="expires" content="Sunday 26 October 2016 01:00 GMT" />
```

#### Set-Cookie参数

如果网页过期。那么这个网页存在本地的cookies也会被自动删除。

```html
<meta http-equiv="Set-Cookie" content="user=lizh; path=/; expires=Thu, 01 Jan 2022 00:00:02 GMT">
```

> `Blocked setting the `user=lizh; path=/; expires=Thu, 01 Jan 1970 00:00:02 GMT` cookie from a `<meta>` tag.`
>
> 为了减轻跨站点脚本（XSS）攻击的风险，此行为已从最新的HTML规范和Firefox 68中删除[.Google Chrome 65](https://www.chromestatus.com/feature/6170540112871424)已于2018年3月停止支持。

#### Window-target参数

强制页面在当前窗口以独立页面显示，用来防止别人在框架里调用自己的页面。

```html
<meta http-equiv="Window-target" content="_top">
```

#### content-security-policy参数

定义当前页面的内容策略。内容策略主要指定允许的服务器地址和脚本端点，这有助于防止 cross-site scripting 攻击。

CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。 CSP 大大增强了网页的安全性。攻击者即使发现了漏洞，也没法注入脚本，除非还控制了一台列入了白名单的可信主机。 

两种方法可以启用 CSP：

* 服务器端配置

* 通过 HTTP 头信息的 Content-Security-Policy 的字段

  ```html
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
  ```

以下是常用的指令名说明，多个指令用分号隔开:

| 指令名      | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| default-src | 默认策略，可以应用于js文件/图片/css/ajax请求等所有访问       |
| script-src  | 定义js文件的过滤策略                                         |
| style-src   | 定义css文件的过滤策略                                        |
| img-src     | 定义图片文件的过滤策略                                       |
| connect-src | 定义请求连接文件的过滤策略                                   |
| font-src    | 定义字体文件的过滤策略                                       |
| object-src  | 定义页面插件的过滤策略。如object、embed、applet。            |
| media-src   | 定义媒体的过滤策略。audio、video                             |
| frame-src   | 定义加载子frmae的策略                                        |
| sandbox     | 沙盒模式，会阻止页面弹窗、js执行等。可以通过添加策略来放开相应的操作 |
| report-uri  | -                                                            |

常用的指令值：所有以 -src 结尾的指令都可以用一下的值来定义过滤规则，多个规则之间可以用空格来隔开。

| 指令值             | 说明                                                     |
| ------------------ | -------------------------------------------------------- |
| *                  | 允许任意地址的url，但是不包括 blob: filesystem: schemes. |
| 'none'             | 所有地址的咨询都不允许加载                               |
| 'self'             | 同源策略,即允许同域名同端口下,同协议下的请求             |
| data:              | 允许通过data来请求咨询 (比如用Base64 编码过的图片).      |
| domain.example.com | 允许特性的域名请求资源                                   |
| .example.com       | 允许从 example.com下的任意子域名加载资源                 |
| https://cdn.com    | 仅仅允许通过https协议来从指定域名下加载资源              |
| https:             | 只允许通过https协议加载资源                              |
| 'unsafe-inline'    | 允许行内代码执行                                         |
| 'unsafe-eval'      | 允许不安全的动态代码执行，比如 JavaScript 的 eval()方法  |

#### 网页过渡效果

在IE5.5及以上版本的浏览器中，页面被载入和退出时的一些过渡效果。

具体值有：

- Page-Enter : 进入页面
- Page-Exit : 离开页面
- Site-Enter : 进入网站
- Site-Exit : 离开网站

content 表示页面过渡的效果设置，这里的两个属性表示分别表示：

* Duration : 过渡速度
* Transition : 可选项。整数值(Integer)。具体数值可查看 [网页过渡效果](https://blog.csdn.net/cl61917380/article/details/39206715)。

```html
<meta http-equiv="Page-Enter" content="revealTrans(Duration=2.0,Transition=12)" /> 
```

注：ie 9 以上已经不支持。



#### 其他参数

```html
<!--指定返回的数据编码，通常是压缩型-->
<meta http-equiv="content-encoding" content ="gzip">
<meta http-equiv="Content-Encoding" content="zip" />

<!--设置页面中脚本的类型-->
<meta http-equiv="Content-Script-Type" content="text/javascript" />

<!--表示dns预先加载-->
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="">

<!--设置页面创建的日期和时间-->
<meta http-equiv="Date" content="Mon, 31 Jan 2022 16:00:00 GMT" />

<!--设置页面上次修改的时间和日期设置-->
<meta http-equiv="Last-Modified" content="Mon, 31 Jan 2022 16:00:00 GMT" />
```



### charset属性

charset  属性是 HTML5 中的新功能，它声明 HTML 文档使用的字符集（字符编码）。如果使用了这个属性，其值必须是与 ASCII 大小写无关 的 `utf-8`。

charset 有两种写法，下面两种写法是等价的，不过更推荐使用第一种写法：

```html
<!--HTML5 写法-->
<meta charset="utf-8">
<!--html5 之前的写法-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
```

 

### 特定场景的使用

#### 移动端

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
<meta name="format-detection"content="telephone=no, email=no" />

<!-- 删除苹果默认的工具栏和菜单栏 -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- 设置苹果工具栏颜色 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

#### IE浏览器

```html
<!-- 是否开启cleartype显示效果 -->
<meta http-equiv="cleartype" content="on">
<meta name="skype_toolbar" content="skype_toolbar_parser_compatible">


<!-- IE 10 Windows 8 -->
<meta name="msapplication-TileImage" content="pinned-tile-144.png">
<meta name="msapplication-TileColor" content="#009900">

<!-- IE 11 Windows 9.1 -->
<meta name="msapplication-config" content="ieconfig.xml">
```

#### chrome浏览器

```html
<!-- 禁止自动翻译 -->
<meta name="google" value="notranslate">
```

#### UC浏览器

```html
<!-- UC应用模式 -->
<meta name="browsermode" content="application">

<!-- 将屏幕锁定在特定的方向 -->
<meta name="screen-orientation" content="landscape/portrait">

<!-- 全屏显示页面 -->
<meta name="full-screen" content="yes">

<!-- 强制图片显示，即使是"text mode" -->
<meta name="imagemode" content="force">

<!-- 应用模式，默认将全屏，禁止长按菜单，禁止手势，标准排版，强制图片显示。 -->
<meta name="browsermode" content="application">

<!-- 禁止夜间模式显示 -->
<meta name="nightmode" content="disable">

<!-- 使用适屏模式显示 -->
<meta name="layoutmode" content="fitscreen">

<!-- 当页面有太多文字时禁止缩放 -->
<meta name="wap-font-scale" content="no">
```

#### QQ手机浏览器

```html
<!-- 锁定屏幕在特定方向 -->
<meta name="x5-orientation" content="landscape/portrait">

<!-- 全屏显示 -->
<meta name="x5-fullscreen" content="true">

<!-- 页面将以应用模式显示 -->
<meta name="x5-page-mode" content="app">
```

#### IOS

```html
<!-- IOS启用 WebApp 全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- IOS全屏模式下隐藏状态栏/设置状态栏颜色 content的值为default | black | black-translucent -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<!-- IOS添加到主屏后的标题 -->
<meta name="apple-mobile-web-app-title" content="标题">

<!-- IOS添加智能 App 广告条 Smart App Banner -->
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">


<!-- Smart App Banner -->
<meta name="apple-itunes-app" content="app-id=APP_ID,affiliate-data=AFFILIATE_ID,app-argument=SOME_TEXT">
```



### 参考资料

[HTML meta标签总结与属性使用介绍](https://segmentfault.com/a/1190000004279791)

[HTTP 缓存](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn#cache-control)

[前端安全配置之Content-Security-Policy(csp)](https://www.cnblogs.com/heyuqing/p/6215761.html)

