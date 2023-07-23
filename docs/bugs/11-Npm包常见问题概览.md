## Npm包常见问题概览

本文记录在日常开发中，使用各种 npm 包遇到的问题。

#### DOM 节点转成图片

这是一个比较常见的需求：将 HTML 中的全部或部分内容，转换为图片，然后通过QQ、微信分享或下载到本地。

##### [html2canvas](https://www.npmjs.com/package/html2canvas)

用于在用户浏览器上获取网页或部分网页的“屏幕截图”。屏幕截图是基于 DOM 的，因此可能不是 100% 准确的真实表示，因为它没有制作实际的屏幕截图，而是根据页面上可用的信息构建屏幕截图。

**工作原理：** 通过读取 DOM 和应用于元素的不同样式，将当前页面呈现为 Canvas 图像。

**备注：** 该包仍处于试验性的状态，因此不建议在生产环境中使用它，也不建议开始使用它构建应用程序，因为仍将进行重大更改。

**问题总结：** 

* Android 运行正常，iOS 运行，兼容性较差。
* 无法绕过浏览器设置的内容策略限制：绘制跨源的图像会污染 canvas，导致 canvas 无法读取。

**实测：** 以 iPhone 14 Pro 为例，Canvas 宽高为 594 * 2400px 时，canvas.toDataURL() 会返回结果 `data:,`，且是**非必现**的，即不是一直如此，有时又能获取正确结果。无法确定浏览器限制的规则是什么？？By Lizhao。

```javascript
html2canvas(dom).then(canvas => {
	canvas.toDataURL() // data:,
});
```

> 另外，据说这是 html2canvas@1.4.1 的 bug，@1.3.4 没有问题，未进一步尝试。

##### dom-to-image

用于将任意 DOM 节点转换为矢量（SVG）或光栅（PNG、JPEG）图像。它基于Paul Bakaus的domvas，已经完全重写，修复了一些错误，并添加了一些新功能（如：Web 字体、图像）。

**工作流程：**

* 递归克隆原始 DOM 节点；
* 计算节点和每个子节点的样式，并将其复制到相应的克隆（包括重新创建伪元素，因为它们不能以任何方式克隆）；
* 嵌入网页字体：找到所有可能代表网页字体的 @font-face 声明 -> 解析文件url，下载相应的文件 -> base64 编码和内联内容作为 data: URL -> 连接所有处理过的 CSS 规则并将它们放入一个 style 元素中，然后将其附加到克隆。
* 嵌入的图像：将 img 元素嵌入图像 URL、background 属性使用的内联图像，其方式类似于嵌入字体。
* 将克隆节点序列化为 XML；
* 将 XML 包装到 foreignObject 标记中，然后包装到 SVG中，然后使其成为数据 URL；
* 可获得 PNG 内容或原始像素数据作为 Uint8Array，创建一个图像元素与 SVG 作为源，并将渲染在已经创建 canvas 上，然后从 canvas 读取内容。
* 完成了！

**问题总结：** 

* 支持 Andorid、iOS 上生成图片。
* 浏览器必需支持 Promise、SVG 的 foreignObject 标签。

**备注：** 该包的最新更新时间是 6 年前（当前时间：2023-07-23）。

##### [html-to-image](https://www.npmjs.com/package/html-to-image)

使用 HTML5 Canvas 和 SVG 从 DOM 节点生成图像。

该包是从 dom-to-image 派生的，使用更易维护的代码和一些新特性。

**备注：** 该包可以理解为 dom-to-image 的升级版，其工作流程和需要注意的问题，与 dom-to-image 一样。