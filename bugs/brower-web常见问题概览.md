## web常见问题概览

#### url后面带"/"与不带"/"有什么区别?

url带"/"与不带"/"是两个不同的概念。不带"/"就是一个文件，带"/"就是一个目录。**对于seo优化而言，带斜杠的链接是非常有必要的。**

domain/abc表示的是根目录下的abc文件，而domain/abc/指的是 abc目录下的default文件。

当搜索引擎蜘蛛爬取xxx.com/abc时，首先是到根目录下去读取abc文件，找不到abc 文件后会自动的读取根目录下abc目录下的default文件；

而当蜘蛛爬取xxx.com/abc/时，首先是到根目录下abc目录直接读取该目录下的default文件，在同样资源的情况下，能节省读取时间，对seo优化是非常必要的。



#### 清理 Chrome 浏览器的 favicon缓存

```shell
cd /Users/$USERNAME/Library/Application\ Support/Google/Chrome/Default
rm Favicons Favicons-journal
#重启chrome
```



#### Uncaught SyntaxError: Unexpected token <

通常是html中的引用路径有误



#### undefined is not a function 

出现`undefined is not a funcation`错误，通常是某个方法没有调用。而有些情况在PC机的浏览器中是正常的，转到移动端出错。
**可能原因：**使用了es6中的findIndex等一些新API。部分安卓机不支持。

如果我们没有配置一些规则，Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Array.findIndex、Object.assign 等）都不会转码。

**解决**：使用babel-polyfill，为当前环境提供一个垫片。



### url 、 src 、 href的区别

* src，source的缩写，指向外部资源的位置，**指向的内容将会嵌入到文档中当前标签所在位置**。

  在请求src资源时会将其指向的资源下载并应用到文档内。当浏览器解析到该元素时，**会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕**。如`script, img, frame`。用作 "拿取"。

* href，Hypertext Reference的缩写，指向网络资源所在位置。

  建立资源与当前元素（锚点）或当前文档（链接）之间的链接。浏览器可以识别文档，就会并行下载资源并且**不会停止对当前文档的处理。**如`link, a`等标签。用作 "连结前往"。

* URL，Uniform Resource Locator的缩写，表示统一资源定位符，是互联网上标准资源的地址。

  互联网上的每个文件都有一个唯一的URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。通用的 "连结" 的专业代名词，在 HTML 语法里几乎不会使用。