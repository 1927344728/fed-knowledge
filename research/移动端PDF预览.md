## 移动端PDF预览

微信内置浏览器预览pdf文件，不同操作系统的表现不同：

* IPhone：基本可以预览各式各样的文件格式。微信自带的预览功能（**不能分享，**页面是微信自己的，改不了），可以直接预览PDF文件。如果图文复杂的word，微信预览也会有点错乱。
* Android：打开`PDF`文件，会跳转到浏览器下载页面。



### 解决方案

通过`PDF.JS`来实现PDF文件的在线预览（无需下载其他插件）。**其原理是将PDF文件转换成canvas/svg，在html页面上展示**。

即自己开发一个页面，调用PDF.JS提供的接口，以PDF文件的地址为参数，接收接口返回的canvas或svg数据。这种自己开发的页面，还可以自行增加微信转发功能。

**word文件的预览：**服务端将word转成PDF文件，当然，也可以直接转换成图片。

> 前端我暂时没找到好的将word转换成PDF办法。服务端用linux转的话，如果图文比较复杂，会出现图文错乱的问题。
>
> 可以通过购买Window系统的服务器来转换（坑），也可以在阿里云市场购买服务（👀不太推荐，还是有点小贵的）



### [PDF.JS](https://github.com/mozilla/pdf.js/)

`pdf.js`是基于HTML5技术构建的，用于展示可移植文档格式的文件(PDF)，它可以在现代浏览器中使用且无需安装任何第三方插件。

有以下两种实现方法：

#### script标签引入方式

```js
<script src="//cdn.bootcss.com/pdf.js/1.8.510/pdf.js"></script>
<script>
	PDFJS.getDocument('PDF文件路径').then(pdf => {
		this.renderPageAsync(pdf, pdf.numPages)
	})

  async function renderPageAsync(pdf, numPages) {
    for (let i = 1; i <= numPages; i++) {
      let page = await pdf.getPage(i);

      let scale = 1.5;
      let viewport = page.getViewport(scale);

      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      document.getElementById('pdf_viewer').appendChild(canvas);

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      let renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    }
  }
</script>
```

#### 使用npm的方式

**安装：**`npm install pdfjs-dist -S`

```js
import PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
```

这两个文件包含了获取、解析和展示PDF文档的方法，但是解析和渲染PDF需要较长的时间，可能会阻塞其它JS代码的运行。

为解决该问题，pdf.js依赖了HTML5引入的[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)——通过从主线程中移除大量CPU操作（如解析和渲染）来提升性能。

`PDF.js`的API都会返回一个Promise，使得我们可以优雅的处理异步操作。数据返回后的渲染方法，与上方`renderPageAsync`方法类似。



### [PDFh5](https://www.npmjs.com/package/pdfh5)

`pdfh5.js` 是基于`pdf.js`和`jQuery`，在移动端预览PDF的插件。

支持手势捏合缩放、支持`canvas、svg`两种渲染模式、支持`ajax、fetch`两种请求方式、支持懒加载。



web/h5/移动端PDF预览手势缩放插件。支持`canvas、svg`两种渲染模式，支持`ajax、fetch`两种请求方式。支持懒加载。

有以下两种实现方法：

#### script标签引入方式

需下载pdfh5项目下所有文件，包css、js、bcmap等。

```html
<link rel="stylesheet" type="text/css" href="//www.gjtool.cn/pdfh5/css/pdfh5.css"> 
<script src="https://cdn.bootcss.com/jquery/3.4.1/core.js"></script>

<!--pdf.js会动态加载pdf.worker.js-->
<script src="//res.winbaoxian.com/autoUpload/planbook/pdf_2.3.200.min_00cbdf4292bae80.js"></script>
<script src="//res.winbaoxian.com/autoUpload/planbook/pdf.worker_2.3.200.min_6a5c7ecbf25a64c.js"></script>
<script src="//res.winbaoxian.com/autoUpload/planbook/pdfh5_45706e34292db60.js"></script>

<script>
    new window.Pdfh5('#pdf_viewer', {
        pdfurl: 'pdf文件路径',
        cMapUrl: '//res.winbaoxian.com/pdfjs/web/cmaps/',
        renderType: 'svg'
    })
</script>
```



#### 使用npm的方式

**安装：**`npm install pdfh5 -S`

```vue
<template>
	<div id="pdf_viewer"></div>
</template>
<script>
import Pdfh5 from "pdfh5";
    export default {
        ...
        data: {
            return {
                pdfh5: null
            }
        },
        mounted() {
            this.pdfh5 = new Pdfh5("#pdf_viewer", {
                pdfurl: "" //pdf文件路径
            });
            this.pdfh5.on("complete", function (status, msg, time) { //监听完成事件
            })
        }
    }
</script>
<style>
    @import "pdfh5/css/pdfh5.css";
</style>
```



### 手机兼容性

| 机型           | 编号          | 系统版本 | 备注                     |
| -------------- | ------------- | -------- | ------------------------ |
| lenovo（白色） | 08-201600-021 | 4.3      | 异常。页面一直在加载状态 |
| oppo(深蓝)     | 08-201600-034 | 4.4.4    | 正常                     |
| vivo X27       | -             | 9        | 正常                     |
| iphone 8       | -             | 12.4     | 正常                     |
| 小米 note3     | 08-201703-191 | 5.1.1    | 正常                     |



### 注意问题

#### 跨域问题

* 本地开发：webpack中添加代理

  ```js
  devServer: {
  	open: false,
  	port: 8080, // 自定义修改8080端口
  	proxy: {  // 代理跨域
  		'[/pdf文件存储目录]': {
  			target: 'https://img.xxxxx.com',
  			changeOrigin: true
  		}
  	}
  }
  ```

* 修改服务器(nginx)配置

* 后端提供api，将pdf文件转成byte[]，然后用`pdf.js`解析data



#### 版本问题

引入1.8.**版本，采用svg模式，部分手机会(如：小米 note3)有bug。

**引用最新pdf.js版本**



#### 乱码问题

pdf文件因字体、编码的问题，可能出会现乱码问题，需引入一些[资源文件](https://github.com/pkp/pdfJsViewer/tree/master/pdf.js/web/cmaps)。

```js
//缺少GBK-EUC-H.bcmap，加载错误
https://pbf.winbaoxian.com/planBook/planbookAccessories/pdf-viewer/index.html?file=https://img.winbaoxian.com/static/app-zx-rule-pdf/allrule/tempDir/%E5%85%89%E5%A4%A7%E6%B0%B8%E6%98%8E%E4%BA%BA%E5%AF%BF%E4%BF%9D%E9%99%A9%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E5%85%89%E5%A4%A7%E6%B0%B8%E6%98%8E%E5%85%89%E6%98%8E%E8%B4%A2%E5%AF%8C%E9%87%8D%E5%A4%A7%E7%96%BE%E7%97%85%E4%BF%9D%E9%99%A9%E6%9D%A1%E6%AC%BE_20170622064151.pdf

//解决方法
new window.Pdfh5('#pdf_viewer', {
    pdfurl: 'pdf文件路径',
    cMapUrl: '资源文件夹', //默认是相对路径'./js/cmaps/'
    //为减少本地项目体积，已上传到cdn：'//res.winbaoxian.com/pdfjs/web/cmaps/'
})
```

> `bcmap` 一词代表 `二进制cmap`。
>
> `CMaps`(字符映射)是`PostScript`和其他Adobe产品中使用的文本文件，用于将字符代码映射到CID字体中的字符字形。
>
> 请参阅[Adobe的此文档](http://www.adobe.com/products/postscript/pdfs/cid.pdf)了解哪些CID字体适合使用。它们主要用于处理东亚书写系统。(此技术是一项传统技术，因此不应在现代工具创建的pdf中使用)。pdfjs想要显示这样的CID字体时，它需要CMap文件。
>





#### CDN 跨域问题

* **跨域配置在某些节点没有启效**

  运维强制推送一遍，目前问题已解决。

* **由于CDN的特性会缓存源站的响应**

  阿里云已帮忙解决

> **建议：**上传PDF文件后，先在链接中预览下



#### 内容不满一页

`svg`模式下，字体大小的原因，在pc端，内容显示可能会不满一页。

**改用`canvas`模式**



### 参考链接

[PDF.js实现个性化PDF渲染（文本复制）](https://segmentfault.com/a/1190000016963084)

[移动端展示pdf(在线打开pdf)-pdfh5.js、pdf.js](https://www.codeleading.com/article/15282358996/)