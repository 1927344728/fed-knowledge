## SVG基础入门篇

可缩放矢量图形（Scalable Vector Graphics，SVG），是一种用于描述二维的矢量图形，基于 XML 的标记语言。作为一个基于文本的开放网络标准，SVG能够优雅而简洁地渲染不同大小的图形，并和 CSS，DOM，JavaScript 和 SMIL 等其他网络标准无缝衔接。本质上，SVG 相对于图像，就好比 HTML 相对于文本。

和传统的点阵图像模式，像 JPEG 和 PNG 不同，SVG 格式提供的是矢量图，这意味着它的图像能够被无限放大而不失真或降低质量，并且可以方便地修改内容。

SVG 是由万维网联盟（W3C）自 1999 年开始开发的开放标准。

- SVG 是指可伸缩矢量图形
- SVG 用来定义用于网络的基于矢量的图形
- SVG 使用 XML 格式定义图形
- SVG 图像在放大或缩小（改变尺寸）的情况下，其图形质量不会受受损失
- SVG 是 W3C 的一个标准



### SVG 有哪些优缺点

与其他图像格式相比，使用 SVG 的优势在于：

- SVG 是矢量格式，可呈现任何大小而不降低其质量
- SVG 支持静止或动态图像
- SVG 支持透明度
- SVG 可被非常多的工具读取和修改（比如：代码或文本编辑器）
- SVG 可以从 Adobe Illustrator 或 Sketch 等设计软件中导出
- SVG 是由于基于文本的格式，是可搜索的（很适合制作地图）
- SVG 是开放的标准。现代浏览器支持 SVG 格式，并且面向未来
- SVG 文件是纯粹的 XML

- SVG 格式具有高度可压缩性和轻量级

SVG 也有一些缺点：

* 设计 SVG 可能会变得复杂
* 在某些版本过低的浏览器上无法呈现
* 电子邮件客户端支持有限
* SVG 的效率可能会不如 PNG 好。因为它需要运行时的计算和对应平台的渲染绘制。
* 渲染效果不一致。不同的浏览器乃至不同的平台的抗锯齿处理千差万别，尤其是用户关掉抗锯齿的情况下，多边形（边数较多）图标会惨不忍睹。



### 浏览器中如何使用SVG元素

**注意：在外部文件引入的 SVG 必须与原始文件同源 **

要在浏览器中显示（前提是浏览器支持），可以通过几种方法来实现：

- HTML 元素引入 SVG 文件

  * 使用 iframe 元素来嵌入SVG图像

  * 使用 img 元素来嵌入SVG图像

  

![image-20200905141904001](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905141904001.png)

```html
  <iframe src="img/snowman.svg" width="300" height="200" ></iframe>
  <img src="img/snowman.svg"  width="300" />
```

- 在 CSS 样式中使用 SVG 来对HTML内容应用图像效果

  * 将 SVG 图像作为背景图像嵌入

  ```css
  div {
      background: url(img/snowman.svg) no-repeat center;
      background-size : 300px 200px;
  }
  ```
  
  * 现代浏览器支持在 CSS 样式中使用 SVG 来对 HTML 内容应用图像效果。
  
    你可以在同一文件中使用 SVG 样式，也可以通过外部样式表引入。有三个属性可以使用： mask、clip-path、filter。
  
    ```html
    <svg >
        <mask id="mask-1"> ... </mask>
        <clipPath id="clipping-path-1"> ... </clipPath>
        <filter id="f1"> ... </filter>
    </svg>
    ```
  
    ``` css
    .target { 
        mask: url(#mask-1); 
        clip-path: url(#clipping-path-1);
        filter:url(#f1);
    }
  .target2 { /*使用外部引用*/
        clip-path: url(resources.svg#c1);
  }
    ```
  
- 将 SVG 直接嵌套在 HTML 中

  * 直接使用 svg 元素，通过代码将SVG图像嵌入到HTML代码中。

  ```html
  <div class="element_box">
      <svg width="445" height="630">
          ...
      </svg>
  </div>
  ```
  
  [直接嵌套DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=2)
  
  * 使用 embed、object 元素来嵌入SVG图像。(不推荐使用)
  
  ```html
  <embed src="img/snowman.svg" width="300" height="220" type="image/svg+xml" />
  <object data="img/snowman.svg" width="300" height="200" type="image/svg+xml"/>
  ```



### SVG 文档基本结构

一个独立的SVG文件，也就是平时看到的以扩展名 .svg 结尾的文件。一个简单的SVG图形例子：

```html
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.0">
    <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
</csvg>
```

* XML声明：和HTML文档的DTD声明是类似的。

  ```html
  <!---类似于HTML文档的DTD声明 <!DOCTYPE html> -->
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
  ```

  `version="1.0"` 和 `encoding="utf-8"` 无论如何都是默认值。

  standalone 属性 规定此 SVG 文件是否是"独立的"，或含有对外部文件的引用。standalone="no" 意味着 SVG 文档会引用一个外部文件。

* svg 根元素包括一个用来描述 SVG 的 XML 声明空间。

  ```html
  <!---类似于HTML文档的HTML中的命名空间声明 <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> -->
  <svg xmlns="http://www.w3.org/2000/svg">
  ```

嵌入 HTML5 文档中的 SVG 不应具有独立的 XML 声明。在格式良好的XML中只允许使用一个XML声明，并且如果有，它必须位于顶部。而通过 html5 `img` 或 css `background-images` 引用的 SVG 必须有自己的 XML 声明。



### 几个重要的 SVG 概念

#### 1.viewport

视口，表示 SVG 可见区域的大小，或者可以想象成画布大小（与 canvas 的画布概念相似）。SVG 中超出视窗边界的区域会被裁切并且隐藏。

```html
<svg width="500" height="300"></svg>
```

#### 2.viewBox 属性

viewBox 是 “视区盒子” 的意思，即，创建一个可伸展的盒子，用以承载一组图形。当 viewBox 的大小与 viewport 不一致时，盒子会自动伸缩（与 preserveAspectRatio  属性有关）。

```html
viewBox="min-x, min-y, width and height"
```

viewBox 大小，默认是与 viewport 相同。不允许宽度和高度为负值，0则禁用元素的呈现。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905212643005.png" alt="image-20200905212643005" style="zoom:67%;" />

```html
<svg width="400" height="300" viewBox="0,0,40,30" style="border: 1px solid #0aa;">
    <rect x="10" y="5" width="20" height="15" fill="#0aa"/>
    <line x1="20" y1="15" x2="20" y2="30" stroke="orange" stroke-width="2" />
</svg>
```

[viewBox属性DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=16)

如上所示，viewBox 的大小是 `40 * 30`，viewport 的大小是 `400 * 300`。实现渲染时，会将 viewBox 放大 10 倍。

有 marker、pattern、svg、symbol、view 等五个 svg 元素可以有这个属性。

#### 3.preserveAspectRatio属性

有时候，通常我们使用  viewBox 属性时，希望图形拉伸占据整个视口。 在其他情况下，为了保持图形的长宽比，必须使用统一的缩放比例。**preserveAspectRatio 属性表示是否强制进行统一缩放。**

对于支持该属性的所有元素，除了 image 元素之外，preserveAspectRatio 只适用于元素上 viewBox 值的元素，如果元素没有提供属性 viewBox ，则忽略了preserveAspectRatio。

```html
preserveAspectRatio="<align> <meetOrSlice>"
```

* **align：**表示是否强制统一缩放。当 SVG 的 viewbox 属性与视图属性宽高比不一致时使用。默认值 **xMidYMid** ，即，居中。

  align 属性的值一定是下列的值之一：

  - **none**：不会进行强制统一缩放。**注意：** 如果 align 的值是 none ，则 meetOrSlice 属性的值将会被忽略。
  - **xMinYMin**： 强制统一缩放。viewbox 与 viewport  X方向左对齐、Y 方向上对齐。
  - **xMidYMin**：强制统一缩放。viewbox 与 viewport X方向居中、Y 方向上对齐。
  - **xMaxYMin**：强制统一缩放。viewbox 与 viewport X方向居右、Y 方向上对齐。
  - **xMinYMid**： 强制统一缩放。viewbox 与 viewport X方向左对齐、Y 方向居中。
  - **xMidYMid** (默认值) ：强制统一缩放。viewbox 与 viewport X方向、Y 方向都居中。
  - **xMaxYMid**：强制统一缩放。viewbox 与 viewport X方向右对齐、Y 方向居中。
  - **xMinYMax**：强制统一缩放。viewbox 与 viewport X方向左对齐、Y 方向下对齐。
  - **xMidYMax**：强制统一缩放。viewbox 与 viewport X方向居中、Y 方向下对齐。
  - **xMaxYMax**：强制统一缩放。viewbox 与 viewport X方向右对齐、Y 方向下对齐。

* **meetOrSlice：**可选。默认值 **meet**，即图形将缩放到。

  - **meet：**默认值。这种情况下，宽高比将会被保留，尽可能的放大 SVG 的 viewbox，但要确保整个 viewbox 在视图窗口内是可见的。
  - **slice：** 这种情况下，宽高比将会被保留，尽可能的放大 SVG 的 viewbox，并且要确保宽、高都覆盖整个视图窗口。
  - **none：**扭曲纵横比以充分适应viewport



### SVG 中的坐标系统

SVG 的坐标系统分为三种类型：

- 初始坐标系统
- 转换坐标系统
- 嵌套坐标系统

#### 初始坐标系统

初始视窗坐标系是一个建立在视窗（viewport）上的坐标系。原点(0,0)在视窗的左上角，X轴正向指向右，Y轴正向指向下，初始坐标系中的一个单位等于视窗中的一个”像素”（更确切的说是一个单位）。

初始用户坐标系 是通过 VIEWBOX 建立在 SVG 画布上的坐标系。这个坐标系一开始和初始视窗坐标系完全一样-它自己的原点位于视窗左上角，x 轴正向指向右，y 轴正向指向下。

```html
<svg width="300" height="300"></svg>
```

#### 转换坐标系统

可以使用 transform 属性来对元素的坐标系统进行变换。**transform 属性的作用对象是元素所在的坐标系统，而不是元素本身。**

在 SVG 规范中，transform 属性的作用是 **在被添加的元素上建立新用户空间坐标系（当前坐标系）** (效果与 viewBox 类似)。

它和 CSS 中 transform 属性的变换函数，都是基于坐标系变换的。它们的区别在于：HTML 元素的坐标系建立在元素自身上，而 SVG中，元素坐标系是基于是 **初始坐标系** 或 **当前用户空间坐标系** 创建的 。

![image-20200907235008085](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200907235008085.png)

> svg 元素有多个变换时，下一个变换的坐标系是基于上一个变换完成后的坐标系创建的，并且其子元素变换的坐标系，也是基于父元素变换后的坐标系创建的。

#### 嵌套坐标系统

在 svg 元素中可以嵌套 svg 元素。外面的 svg 创建一个 Viewport 和坐标系统，而且嵌套在里面的 svg 也可以创建一个 Viewport 和坐标系统。

如果你不声明子 SVG 的 x 和 y 属性，它们默认是 0。如果你不声明 height 和 width 属性，svg 会是父 SVG 宽度和高度的 100%。

除了可以通过嵌套 svg 外，也可以使用例如 use、symbol 的元素来建立新的 viewport 和用户坐标系。



### SVG 的基本组成元素

一个简单的 SVG 文档由 svg 根元素和基本的形状元素构成。另外还有一个 g 元素，它用来把若干个基本形状编成一个组。

从这些开始，SVG 可以变得更加复杂。SVG 支持渐变、旋转、动画、滤镜效果、与 JavaScript 交互等等功能，但是所有这些额外的语言特性，都需要在一个定义好的图形区域内实现。

#### 1.line元素（直线）

line 元素是一个 SVG 基本形状，用来创建一条连接两个点的线。

* x1：起点x坐标
* y1：起点y坐标
* x2：终点x坐标
* y2：终点y坐标

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905150943301.png" alt="image-20200905150943301" style="zoom: 67%;" />

```html
<svg width="300px" height="300px" style="border: 1px solid #ccc;">
    <line x1="0" y1="200" x2="250" y2="0" stroke="#0aa" stroke-width="5" />
</svg>
```

[line元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=3)

#### 2.rect元素（矩形）

rect 元素是 SVG 的一个基本形状，用来创建矩形，基于一个角位置以及它的宽和高。它还可以用来创建圆角矩形。

- x：左上角x坐标
- y：左上角y坐标
- width：宽度
- height：高度
- rx：x方向的圆角半径
- ry：y方向的圆角半径

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905151025386.png" alt="image-20200905151025386" style="zoom: 67%;" />

```html
<svg width="300px" height="150px" style="border: 1px solid #ccc;">
    <rect x="20" y="20" width="250px" height="125px" rx="5" ry="5" fill="teal" />
</svg>
```

[rect元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=4)

#### 3.circle元素 (圆)

circle 元素是一个 SVG 的基本形状，用来创建圆,基于一个圆心和一个半径。

- cx：圆心x坐标
- xy：圆心y坐标
- r：半径

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905151513091.png" alt="image-20200905151513091" style="zoom: 67%;" />

```html
<svg width="300px" height="300px" style="border: 1px solid #ccc;">
    <circle cx="100" cy="100" r="50" fill="#0aa"></circle>
</svg>
```

[circle元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=5)

#### 4.ellipse元素（椭圆）

ellipse 元素是一个 SVG 基本形状，用来创建一个椭圆，基于一个中心坐标以及它们的 x 半径和 y 半径。

- cx：圆心x坐标
- cy：圆心y坐标c
- rx：x方向半径
- ry：y方向半径

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905151925222.png" alt="image-20200905151925222" style="zoom: 67%;" />

```html
<svg width="300px" height="300px" style="border: 1px solid #ccc;">
    <ellipse cx="150" cy="150" rx="100" ry="75" fill="#0aa" />
</svg>
```

[ellipse元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=6)

#### 5.polygon元素 (闭合多边形)

polygon 元素是由连接一组点集的直线构成。`polygon` 的路径在最后一个点处自动回到第一个点。需要注意的是，矩形也是一种多边形。

* potins：定义了用来画一个 polygon 元素或 polyline 元素的点的数列。每个点用用户坐标系统中的一个 X 坐标和 Y 坐标定义。用逗号分开每个点。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905152811262.png" alt="image-20200905152811262" style="zoom: 67%;" />

```html
<svg width="300px" height="300px" style="border: 1px solid #ccc;">
    <polygon points="0, 50 50, 0 150, 0 200, 50 150, 100 50, 100" fill="#0aa"></polygon>
</svg>
```

[polygon元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=7)

#### 6.polyline元素 (折线)

polyline 元素是 SVG 的一个基本形状，用来创建一系列直线连接多个点。典型的一个 polyline 是用来创建一个开放的形状，最后一点不与第一点相连。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905153443196.png" alt="image-20200905153443196" style="zoom: 67%;" />

```html
<svg width="300px" height="180px" style="border: 1px solid #ccc;">
    <polyline points="10 10, 50 50, 75 175, 175 150, 175 50, 225 75, 225 150, 300 150" fill="none" stroke="#0aa"/>
</svg>
<svg width="300px" height="180px" style="border: 1px solid #ccc;">
    <polyline points="10 10, 50 50, 75 175, 175 150, 175 50, 225 75, 225 150, 300 150" fill="#0aa" stroke="none"/>
</svg>
```

[polyline元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=8)

#### 7.image元素（图片）

允许在一个 SVG 对象内部呈现光栅图像。它表现为图像文件或者其他 SVG 文件。SVG 图像格式转换软件支持 JPEG、PNG 格式，是否支持动图 GIF 不明确。

- x：图像水平方向上到原点的距离
- y：图像竖直方向上到原点的距离
- width：图像宽度。和 HTML 的 img 不同，该属性是必须的
- height：图像高度。和 HTML 的 img 不同，该属性是必须的
- xlink:href：图像的 URL 指向
- preserveAspectRatio：控制图像比例

```html
<svg width="500" height="300">
    <image xlink:href="img/20190419141710_4735vxaqwhri_small.jpg" x="0" y="0" height="300" width="300"/> 
</svg>
```

[image元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=26)

- 如果你没有设置 x 属性或 y 属性，它们自动被设置为 0
- 如果你没有设置 height 属性或 width 属性，它们自动被设置为 0
- 如果 width 属性或 height 等于0，将不会呈现这个图像

#### 8.textPath（文本）

text 元素定义了一个由文字组成的图形。

注意：我们可以将渐变、图案、剪切路径、遮罩或者滤镜应用到 text 上。

* x、y：在用户坐标系统中标识了一个 x 轴、y 轴坐标。
* dx、dy：一个元素或其内容在 x 轴、y 轴方向上的偏移，偏移量取决于设置该属性的元素。
* text-anchor：用来描述该文本与所给点的对齐方式 (开头、中间、末尾对齐) 。取值：start | middle | end。
* rotate：指定动画元素沿 animateMotion 元素中指定的路径行进时如何旋转。取值：	auto| auto-reverse| number。
* textLength：指定文本将绘制到的空间的宽度。
* lengthAdjust：控制文本如何拉伸到该 textLength 属性定义的长度。取值：spacing | spacingAndGlyphs。

#### 9.textPath元素（文本路径）

除了笔直地绘制一行文字以外， SVG 也可以根据 path 元素的形状来放置文字。 只要在 textPath 元素内部放置文本，并通过其 xlink:href 属性值引用 path 元素，我们就可以让文字块呈现在 path 元素给定的路径上了。

- startOffset：将路径转换为 textPath 元素的坐标系后，该属性定义了沿路径的初始当前文本位置相对于路径起点的偏移量。
- method：指示应沿着 textPath 元素路径呈现文本的方法。取值：align` | `stretch。
- spacing：指示用户代理应如何确定要沿路径呈现的印刷字符之间的间距。
- xlink:href：将对资源的引用定义为引用IRI。该链接的确切含义取决于使用它的每个元素的上下文。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200912022433702.png" alt="image-20200912022433702" style="zoom:67%;" />

```html
<svg width="500" height="300" style="border: 1px solid #eee;">
    <defs>
        <path id="MyPath" d="M 50 200 C 200 400 900 -200 900 100" />
    </defs>
    <use xlink:href="#MyPath" fill="none" stroke="orange" stroke-width="3" />
    <text font-family="Verdana" font-size="30" fill="#0aa">
        <textPath startOffset="-50" xlink:href="#MyPath" spacing="exact" > 君子之交淡如水，茶人之交醇如茶。 </textPath>
    </text>
    <text x="120" y="30" dx="0" dy="30" font-weight="bold" font-size="30" fill="#0aa" text-anchor="middle"> 君子之交淡如水，茶人之交醇如茶。 </text> 
    <text x="20" y="100" font-weight="bold" font-size="30" fill="#0aa" textLength="300"> 君子之交淡如水，茶人之交醇如茶。 </text> 
    <text x="20" y="140" font-weight="bold" font-size="30" fill="#0aa" textLength="300" lengthAdjust="spacingAndGlyphs" rotate="30"> 君子之交淡如水，茶人之交醇如茶。 </text> 
</svg>
```

[textPath元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=27)

#### 10.pattern元素（图案）

使用预定义的图形对一个对象进行填充或描边，就要用到 pattern 元素。pattern 元素让预定义图形能够以固定间隔在 x 轴和 y 轴上重复（或平铺）从而覆盖要涂色的区域。先使用 pattern 元素定义图案，然后在给定的图形元素上用属性 fill 或属性 stroke 引用用来填充或描边的图案。

* patternUnits：指示将哪个坐标系用于 pattern 元素的几何属性。
* patternContentUnits：指示要用于 pattern 元素内容的坐标系。
* patternTransform：定义应用于图案的变换定义列表。
* x、y：在用户坐标系统中标识了一个x 轴、y 轴坐标。
* width、height：在用户坐标系统中标识了一个水平长度、垂直长度。
* xlink:href：将对资源的引用定义为引用IRI。该链接的确切含义取决于使用它的每个元素的上下文。
* preserveAspectRatio：表示是否强制进行统一缩放。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200912172113635.png" alt="image-20200912172113635" style="zoom:67%;" />

```html
<svg width="400" height="400">
    <defs>
        <linearGradient id="Gradient7">
            <stop offset="5%" stop-color="white"/>
            <stop offset="95%" stop-color="#0aa"/>
        </linearGradient>
        <linearGradient id="Gradient8" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stop-color="white"/>
            <stop offset="95%" stop-color="orange"/>
        </linearGradient>
        <pattern id="Pattern" x="0" y="0" width=".25" height=".25">
            <rect x="0" y="0" width="50" height="50" fill="#0aa"/>
            <line x1="25" y1="25" x2="50" y2="50"  stroke-width="5" stroke="url(#Gradient8)"/>
            <circle cx="25" cy="25" r="20" fill="url(#Gradient7)" fill-opacity="0.8"/>
        </pattern>
    </defs>
    <rect fill="url(#Pattern)" x="0" y="0" width="200" height="200"/>
</svg>
```

[pattern元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=27)



### SVG 中的路径

 path 可能是SVG中最常见的形状。你可以用 path 元素绘制矩形（直角矩形或者圆角矩形）、圆形、椭圆、折线形、多边形，以及一些其他的形状，例如贝塞尔曲线、2次曲线等曲线。

路径可以被填充、描边或者用于剪裁其他元素。

* d：一个字符串，包含了一系列路径描述。可以使用不同的指令，移动到一个新的点，然后绘制不同的直线和曲线。

注意：**指令字母大写表示坐标位置是绝对坐标，指令字母小写表示坐标位置是相对坐标。**

以下用 path 元素，绘制上个 polyline 元素 示例：

```html
<svg width="300px" height="180px" style="border: 1px solid #ccc;">
    <path d="
             M10,10
             L50,50
             L75,175
             L175,150
             L175,50
             L225,75
             L225,150
             L300,150"
		fill="none"
		stroke="#0aa"
		stroke-width="2px"
	/>
</svg>
```

#### 1.直线指令

这里有五种不同的直线指令，你可以使用它们来创建路径。

* moveto(M 或 m)：移动到新的位置
* lineto(L 或 l)：从当前坐标画一条直线到一个新坐标
* horizontal lineto(H 或 h)：画一条水平线到新坐标。只带一个参数，标明在 x 轴移动到的位置
* vertical lineto(V 或 v)：画一条垂直线到新坐标。只带一个参数，标明在 y 轴移动到的位置
* closepath(Z 或 z)：关闭当前路径。它是最简单的命令，而且不带有任何参数。Z 或 z，两种写法作用都一样

**注意：**指令的参数用空格或逗号隔开，多个指令之间不需要隔开。

```html
d="M10 10L50 50L75 175L175 150L175 50L225 75L225 150L300 150"
d="M10,10 L50,50 L75,175 L175,150 L175,50 L225,75 L225,150 L300,150"
```

**注意：**实际应用中使用指令字母即可。**指令字母大写表示坐标位置是绝对位置，指令字母小写表示坐标位置时相对位置。**

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905161857928.png" alt="image-20200905161857928" style="zoom:67%;" />

```html
<svg width="300px" height="300px" style="border: 1px solid #ccc;">
    <g fill="none">
        <path d="M 0 300 l 150 -300" stroke="red" />
        <path d="M 150 0 l 150 300" stroke="red" />
        <path d="M 50 200 h 200" stroke="#0aa" />
        <path d="M 0 300 q 150 -300 300 0 z" stroke="orange" stroke-width="3px" />
    </g>
</svg>
```

[直线指令DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=10)

#### 2.曲线指令

绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分：

- Curveto: 三次贝塞尔曲线指令 (C, c, S, s)，需要一个初始点的控制点和一个结束点的控制点，还有一个结束点。

  ```shell
  C (or c) x1,y1 x2,y2 x,y
  S (or c) x2,y2 x,y
  ```

  * x1、y1 是曲线起点的控制点坐标
  * x2、y2 是曲线终点的控制点坐标
  * x、y  是曲线的终点坐标。（曲线的起点是上一条指令的终点）

- Curveto：二次贝塞尔曲线指令 (Q, q, T, t)，只需要一个控制点，同时作为起点控制点和终点控制点。

  ```shell
  Q (or q) x1,y1 x,y
  T (or t) x1,y1 x,y
  ```

  * x1、y1 是曲线起点和终点的控制点坐标
  * x、y 是曲线的终点坐标

  ```html
  <svg width="300px" height="150px" style="border: 1px solid #ccc;">
      <path d="M0 30 C 100 30 150 150 300 30" fill="none" stroke="#0aa" stroke-width="3px"/>
      <path d="M0 100 Q 150 180 300 100" fill="none" stroke="orange"/>
  </svg>
  ```

  [曲线指令DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=11)

> 为了连缀平滑的贝塞尔曲线，还可以使用 T 和 S 命令。它们的语法比别的 Curveto 命令简单。因为它假定第一个控制点是前一个控制点关于前一个点的反射（即，关于前一个点对称），或者说如果没有前一个控制点的话它实际上就是前一个点。

- Arcto：椭圆弧线 (A, a)，用于绘制一段椭圆片段。若 rx 和 ry 的值相同，则绘制出圆。

  ```shell
  A (or a) rx ry  xAxisRotate  large-arc-flag  sweep-flag  x y
  ```

  * rx、ry：弧线在 x 轴、y 轴方向的半径
  * xAxisRotate：与 x 轴夹角的度数
  * large-arc-flag：0 或 1，用来确定是要画小弧（0）还是画大弧（1）
  * sweep-flag：0 或 1，用来确定弧是顺时针方向（1）还是逆时针方向（0）
  * x、y：弧线的终点

  <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905170936292.png" alt="image-20200905170936292" style="zoom:67%;" />

  ```html
  <svg width="600" height="300" style="border: 1px solid #eee;">
      <path d="M250,100 A120,80 0 0 0 250,200" fill="none" stroke="red" stroke-width="5" />
      <path d="M250,100 A120,80 0 1 1 250,200" fill="none" stroke="#0aa" stroke-width="3"/>
      <path d="M250,100 A120,80 0 1 0 250,200" fill="none" stroke="orange" stroke-width="1"/>
      <path d="M250,100 A120,80 0 0 1 250,200" fill="none" stroke="#a0a" stroke-width="3"/>
  </svg>
  ```

  [椭圆弧线指令DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=12)



### SVG 中的其他元素

#### SVG 中的标记（Marker）

marker 元素定义了在特定的 path、line、polyline、polygon 元素上绘制的箭头或者多边标记图形。

* markerUnits：
* refX、refY：定义元素参考点的x、y坐标
* markerWidth、markerHeight：定义 marker元素的宽度、高度。
* orient：指示将标记放置在形状上的位置时如何旋转标记。

> marker-start、marker-mid、marker-end 这三个 CSS 属性会将标记分别放置在路径的开始、中间和结束位置。
>
> 可以设置markerUnits=”strokeWidth” 使得标记进行缩放来适应路径描边的大小

![image-20200905174739391](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905174739391.png)

```html
<svg width="300" height="150" style="border: 1px solid #eee;">
    <defs>
        <marker id="markerCircle" markerWidth="20" markerHeight="20" refX="5" refY="5">
            <circle cx="5" cy="5" r="3" style="stroke: none; fill: orange;"/>
        </marker>
        <marker id="markerCircle2" markerWidth="8" markerHeight="8" refX="5" refY="5">
            <circle cx="5" cy="5" r="5" style="stroke: none; fill: red;"/>
        </marker>
        <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto" markerUnits="strokeWidth">
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill: orange;" />
        </marker>
    </defs>
    <path d="M75 25 h150 v100 l -100 -50"
          style="stroke: #0aa; fill: none; marker-start: url(#markerCircle); marker-mid: url(#markerCircle2);  marker-end: url(#markerArrow); "/>
</svg>
```

[标记DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=13)

#### SVG 中的clipPath

SVG 剪裁路径是指根据指定的路径或形状来剪裁 SVG 图形。应用了剪裁路径的图形，在剪裁路径内部的图形可以被显示出来，在剪裁路径之外的图形会被隐藏。

你可以使用任何图形来作为剪裁路径或者被剪裁的对象。可以是文字、圆形、椭圆、多边形或自定义路径。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905180428246.png" alt="image-20200905180428246" style="zoom:67%;" />

```html
<style>
    @keyframes openYourHeart { from { r: 10px; } to { r: 60px; } }
    #myClip circle { animation: openYourHeart 5s infinite; }
</style>
<svg viewBox="0 0 100 100" style="width: 300px; border: 1px solid #eee;">
    <clipPath id="myClip">
        <circle cx="40" cy="35" r="35" />
    </clipPath>
    <path id="heart" d="M10 30 A20 20 0 0 1 50 30 A20 20 0 0 1 90 30 Q90 60 50 90 Q10 60 10 30 Z" style="clip-path: url(#myClip);" fill="#0aa" />
</svg>

```

[clipPath DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=14)

#### SVG DEFS元素、SYMBOL元素和USE元素

* defs 元素：用于预定义一个元素使其能够在 SVG 图像中重复使用。在 defs 元素中定义的图形元素不会直接呈现。

* symbol 元素：用于定义可重复使用的符号。

  symbol 能够创建自己的视窗，所以能够应用 viewBox 和 preserveAspectRatio 属性。

* use 元素：可以在SVG图像中多次重用一个预定义的SVG图形，包括 `<g>` 元素和`<symbol>`元素。use 元素可以引入在 defs 元素中定义的图形。

  出于安全原因，一些浏览器可能在use元素上应用同源策略，还有可能拒绝载入xlink:href属性内的跨源URI。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200905201129540.png" alt="image-20200905201129540" style="zoom:67%;" />

```html
  <svg viewBox="0 0 300 300" style="width: 300px; border: 1px solid #eee;">
    <defs>
      <g id="shape" stroke-width="1">
          <line x1="150" y1="150" x2="150" y2="300" />
          <circle cx="150" cy="150" r="120" />
      </g>
    </defs>
    <symbol id="shape2">
        <circle cx="75" cy="75" r="75" style="fill: orange;"/>
    </symbol>
    <use xlink:href="#shape" style="stroke: #0aa; fill: none;"/>
    <use xlink:href="#shape2" x="150" y="75" />
  </svg>
```

[defs-symbol-use DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=15)



### SVG元素的样式属性

SVG 元素不同于普通的 HTML 元素，具有特殊的一些样式属性。这些属性的声明可以通过SVG元素属性的方式直接声明，也可以通过 CSS样式表中进行声明。

语法和在 html 里使用 CSS 一样，只不过你要把 `background-color`、`border` 改成 `fill` 和 `stroke`。

注意，不是所有的属性都能用 CSS 来设置。上色和填充的部分一般是可以用 CSS 来设置的，比如`fill`，`stroke`，`stroke-dasharray`等，但是不包括下面会提到的渐变和图案等功能。另外，`width`、`height`，以及路径的命令等等，都不能用css设置。判断它们能不能用CSS设置还是比较容易的。

> SVG 规范将属性区分成 properties 和其他 attributes，前者是可以用CSS设置的，后者不能。

以下是一些 CSS2 规范之中未定义的，SVG 独有的部分样式属性：

* fill：元素的填充颜色
* fill-opacity：元素的填充颜色透明度
* stroke：元素的笔画颜色
* stroke-width：元素的笔画宽度
* stroke-linecap：定义元素顶点样式
* stroke-dasharray：虚线样式虚线长度
* stroke-dashoffset：虚线样式的偏移长度
* stroke-linejoin：定义元素之间的连接点的形状
* stroke-opacity：元素的笔画颜色透明度

我们可以通过以下方法引用样式属性：

1. 使用属性来添加CSS样式。

   ```html
   <circle stroke="none" fill="#0aa" />
   ```

2. 使用 STYLE 属性。

   ```html
   <circle style="stroke: none; fill: #0aa;" />
   ```

3. 使用内联样式表。

   这种使用内联样式表的工作方式和在HTML元素上使用内联样式表是完全相同的。样式可以定义在 svg 元素外，也可以定义在 svg 元素内。

   ```html
   <style>
       .class_name2 { stroke: #0aa; fill: #a0a; }
   </style>
   <svg>
       <style type="text/css" >
           <![CDATA[
           circle { stroke: #0aa; fill: orange; }
           .class_name1 { stroke: #0aa; fill: red; }
           ]]>
       </style> 
       <circle cx="40" cy="40" r="25"/>
       <circle class="class_name1" cx="120" cy="40" r="25"/>
       <circle class="class_name2" cx="200" cy="40" r="25"/>
   </svg>
   ```

4. 使用外部样式表来添加CSS样式。

   ```html
   <?xml-stylesheet type="text/css" href="svg-stylesheet.css" ?>
   ```

### SVG 中的渐变效果

SVG 可以创建和并在填充和描边上应用渐变色。

有两种类型的渐变：线性渐变和径向渐变。你必须给渐变内容指定一个id属性，否则文档内的其他元素就不能引用它。为了让渐变能被重复使用，渐变内容需要定义在 defs 标签内部，而不是定义在形状上面。

#### 线性渐变

线性渐变沿着直线改变颜色，要插入一个线性渐变，你需要在 SVG 文件的 defs 元素内部，创建一个 linearGradient 元素。

* gradientUnits：定义用于在渐变元素上指定的属性的坐标系。取值：`userSpaceOnUse` 、`objectBoundingBox`，默认值为`objectBoundingBox`。`objectBoundingBox`  用百分比表示相对于当前SVG视口的值。`userSpaceOnUse` 使用绝对单元。
* gradientTransform：定义从渐变坐标系到目标坐标系的转换。
* x1、y1、x2、y2：起点的和结束点的坐标。用于定义渐变的方向和范围。
* spreadMethod：确定如何填充超出定义的渐变边的形状。
  * pad（默认值）：该值表示渐变的最终颜色填充了超出渐变边缘的形状。
  * reflect：此值表示渐变超过其边缘反向重复。
  * repeat：此值指定渐变以原始顺序重复其边缘。
* xlink:href：引入其他 linearGradient  元素

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200910001740691.png" alt="image-20200910001740691" style="zoom:80%;" />

```html
<svg width="500" height="300">
    <defs>
        <linearGradient id="Gradient1">
            <stop stop-color="orange" offset="0%"/>
            <stop stop-color="white" stop-opacity="0.5"offset="50%"/>
            <stop stop-color="#0aa" offset="100%"/>
        </linearGradient>
        <linearGradient id="Gradient2" x1="0" y1="0" x2="1" y2="1" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Gradient1"/>
        <linearGradient id="Gradient3" x1="33%" x2="67%" y1="33%" y2="67%" spreadMethod="reflect" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Gradient1"/>
    </defs>
    <rect x="0" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient1)"/>      
    <rect x="175" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient2)"/>      
    <rect x="350" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient3)"/>      
</svg>
```

可以在 stop 元素中定义，`stop-color` 、`stop-opacity` 、`fill` 属性，也可以定义在 css 中：

```html
<style type="text/css"><![CDATA[
    #rect { fill: url(#Gradient1); }
    .stop { stop-color: black; stop-opacity: 0; }
    ]]></style>
```

linearGradient 元素还需要一些其他的属性值，它们指定了渐变的大小和出现范围。渐变的方向可以通过两个点来控制，它们分别是属性x1、x2、y1和y2，这些属性定义了渐变路线走向。

>  可以在渐变上使用 xlink:href 属性，使一个渐变的属性和颜色中值（stop）可以被另一个渐变包含引用。

```html
<linearGradient id="Gradient2" x1="0" y1="0" x2="1" y2="1"
                        xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Gradient1"/>
```

[线性渐变DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=24)

#### 径向渐变

径向渐变与线性渐变相似，只是它是从一个点开始发散绘制渐变。创建径向渐变需要在文档的 defs 中添加一个 radialGradient 元素。

* cx、cy：中心点的 x、y 轴坐标。
* r：定义圆的半径
* fx、fy：定义径向渐变的焦点的 x、y 轴坐标。如果该属性没有被定义，就假定它与中心点是同一位置。
* fr：定义径向渐变的焦点的半径。若该属性没有被定义，默认值为 0%。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/js/image-20200910003119521.png" alt="image-20200910003119521" style="zoom:80%;" />

```html
<svg width="500" height="300">
    <defs>
        <radialGradient id="Gradient4">
            <stop stop-color="orange" offset="0%"/>
            <stop stop-color="white" stop-opacity="0.5"offset="50%"/>
            <stop stop-color="#0aa" offset="100%"/>
        </radialGradient>
        <radialGradient id="Gradient5" cx="0.5" cy="0" r="1" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Gradient4"/>
        <radialGradient id="Gradient6" fx="0.5" fy="0.35" fr="0.25" spreadMethod="reflect" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Gradient4"/>
    </defs>
    <rect x="0" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient4)"/>      
    <rect x="175" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient5)"/>      
    <rect x="350" y="50" rx="30" ry="30" width="150" height="150" fill="url(#Gradient6)"/>      
</svg>
```

[径向渐变DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=25)



### SVG 中的SMIL动画

SMIL 是 Synchronized Multimedia Integration Language（同步多媒体集成语言）的首字母缩写简称。SMIL 开发组和 SVG 开发组合作开发了 SMIL 动画规范，在规范中制定了一个基本的 XML 动画特征集合。SVG 吸收了 SMIL 动画规范当中的动画优点，并提供了一些 SVG 继承实现。

SMIL允许你做下面这些事情：

- 动画元素的数值属性（X, Y, …）
- 动画属性变换（平移或旋转）
- 动画颜色属性
- 沿着运动路径运动

不论使用 4 个动画元素中的哪一个，你都需要为它指定一个动画目标。可以使用 xlink:href 属性来指定动画目标。这个属性指向将要执行动画的元素。这个元素必须在当前的 SVG 文档中。动画元素也可以嵌套在 SVG 元素中。如果没有为动画元素指定 xlink:href 属性，那么动画的目标元素就是当前动画元素的直接父元素。

```html
<rect id="cool_shape" ... />
<animate xlink:href="#cool_shape" ... />
```

#### SVG 五大动画元素

##### set元素

此元素没有动画效果。可以实现基本的延迟功能。即，可以在特定时间之后修改某个属性值（也可以是 CSS 属性值）

```html
<svg width="320" height="320">
    <g> 
        <text font-family="microsoft yahei" font-size="80" y="160" x="160" fill="#0aa">
            SVG
            <set attributeName="x" attributeType="XML" to="60" begin="2s" />
        </text>
    </g>
</svg>
```

[set元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=18)

##### animate元素

基础动画元素。实现单属性的动画过渡效果。类似于 CSS3 中的 transition 属性

```html
<svg width="320" height="320">
    <g> 
        <text font-family="microsoft yahei" font-size="80" y="160" x="160" fill="#0aa">
            SVG
            <animate attributeName="x" from="160" to="60" begin="0s" dur="3s" repeatCount="indefinite" />
        </text>
    </g>
</svg>
```

[animate元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=19)

##### animateTransform

实现 transform 变换动画效果的。

```html
<svg width="640" height="640">
    <g> 
        <text font-family="microsoft yahei" font-size="80" y="160" x="160" fill="#0aa">
            SVG
            <animateTransform attributeName="transform" begin="0s" dur="3s"  type="scale" from="1" to="1.5" repeatCount="indefinite"/>
        </text>
    </g>
</svg>
```

[animateTransform元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=20)

##### animateMotion元素

可以让 SVG 图形沿着特定的 path 路径运动。

```html
<svg width="360" height="200">
    <text font-family="microsoft yahei" font-size="40" x="0" y="0" fill="#0aa">SVG
        <animateMotion path="M10,80 q100,120 120,20 q140,-50 160,0" begin="0s" dur="3s" rotate="auto" repeatCount="indefinite"/>
    </text>
    <path d="M10,80 q100,120 120,20 q80,-80 160,0" stroke="#0aa" stroke-width="2" fill="none" />
</svg>
```

[animateMotion元素DEMO](https://1927344728.github.io/frontend-knowledge/demo/26-svg.html?type=21)

#### 与使用 CSS 动画的区别

SVG 元素可以像 HTML 元素一样，使用 CSS keyframes 和 animation 属性或者 CSS transitions 来制作各种动画效果。大多数情况下，一个复杂的动画效果需要组合多种变换效果：旋转、倾斜、缩放以及他们的转换和过渡效果。

多数情况下，SVG元素和HTML元素在使用 transform 和 transform-origin上是相同的。但它们之间也有不同之处:

* SVG 元素不能使用 box model 来管理，因此，它没有margin、padding、border或content boxes。
* 默认情况下，一个 HTML 元素的 transform 原点位于该元素的 (50%, 50%) 的地方，这里是元素的中心点。与之不同，SVG 元素的 transform 原点位于当前用户坐标系统的原点上，这个点是画布的左上角位置



### SVG 动画的参数详解

##### attributeName属性

动画属性的名称

* 可以是元素直接暴露的属性，例如，对于本文反复出现的「马」对应的text元素上的 x,  y或者 font-size;
* 可以是CSS属性。例如，透明度 opacity。

##### attributeType属性

动画属性的可选值：CSS | XML | auto。

attributeType 支持三个固定参数，CSS、XML、auto。用来表明 attributeName 属性值的列表。x、y 以及 transform 就属于 XML, opacity就属于 CSS。 auto 为默认值，自动判别的意思。

##### from, to, by, values

类似于CSS3中的关键帧定义。

* from：动画的起始值,缺省默认值
* to：指定动画的结束值
* by：动画的相对变化值
* values：用**分号**分隔的一个或多个值，可以看出是动画的多个关键值点

```html
<svg width="320" height="320">
    <g> 
        <text font-family="microsoft yahei" font-size="80" y="160" x="160" fill="#0aa">
            SVG
            <animate attributeName="x" from="160" to="60" begin="0s" dur="3s" repeatCount="indefinite" />
        </text>
    </g>
</svg>
```

##### begin, end

可选值包括：

* time-value：表示具体的时间值。常见单位有 h | min | s | ms，默认单位为 s 。时间值还支持  `hh:mm:ss`  这种写法，因此，`90s` 我们也可以使用 `01:30` 表示。

* offset-value：表示偏移值，数值前面有  `+` 或 `-`。 应该指相对于  `document`  的  `begin` 值而言。

* syncbase-value：基于同步确定的值。语法为：`[元素的id].begin/end +/-` 时间值。 就是说借用其他元素的 begin 值再加加减减，这个可以准确实现两个独立元素的动画级联效果。
* event-value：这个表示与事件相关联的值。类似于 PowerPoint 动画的“点击执行该动画”。语法是： `[元素的id].[事件类型] +/- 时间值`。
* repeat-value：指某动画重复多少次结束之后开始执行动画。语法为： `[元素的id].repeat(整数) +/- ` 时间值。
* accessKey-value：定义快捷键。即按下某个按键动画开始。语法为：accessKey(character)。 character 表示快捷键所在的字符。
* wallclock-sync-value：指真实世界的时钟时间定义。时间语法是基于在 ISO8601 中定义的语法。
* indefinite：表示“无限等待”。需要 `beginElement()` 方法触发或者指向该动画元素的超链接(SVG中的a元素)。

##### dur

该属性标识了动画的简单持续时间。常规时间值：clock-value | indefinite。

指定简单持续时间的时长。值必须大于0。可以用小时（h）、分钟（m）、秒（s）、毫秒（ms）表达这个值。可以组合这些时间表达式以提供一个复合的持续时间，比如这样：`hh:mm:ss.iii` 或者这样：`mm:ss.iii`。

如果一个动画元素不带有 dur 属性，简单持续时间就是无限期的。

##### calcMode、keyTimes、 keySplines

 calcMode 属性支持4个值：`discrete | linear | paced | spline`。

- discrete: from 值直接跳到 to 值。类似于step(1, end)。
- linear: animateMotion元素以外元素的calcMode默认值。动画从头到尾的速率都是一致的。
- paced: 通过插值让动画的变化步调平稳均匀。仅支持线性数值区域内的属性，这样点之间“距离”的概念才能被计算（如 position, width, height等）。如果`paced`指定，任何 `keyTimes` 或 `keySplines`值将会失效。
- spline: 插值定义贝塞尔曲线。spline点的定义在keyTimes属性中，每个时间间隔控制点由keySplines定义。

**keyTimes：** 是关键时间点的意思。一个以分号分隔的时间值列表，用于控制动画的执行步骤。列表中的每个值与 values 中的值一一对应，定义了 values 中的值在动画中何时执行，keyTimes 列表中的每一个值都是指定在[0-1]之间的浮点数，表示动画的完成时间。

前面提到过 values 也是多值，这里有一些约定的规则：首先，keyTimes 值的数目要和 values 一致，如果是 from/to/by 动画，keyTimes 就必须有两个值。然后对于 linear 和 spline 动画，第一个数字要是0, 最后一个是1。

最后，每个连续的时间值必须比它前面的值大或者相等。

##### repeatCount, repeatDur

repeatCount 表示动画执行次数，可以是合法数值或者 indefinite （动画循环到电脑死机）。

repeatDur 定义重复动画的总时间。可以是普通时间值或者 indefinite（动画循环到电脑死机）。

##### fill

表示动画间隙的填充方式。支持参数有：freeze | remove。其中remove是默认值，表示动画结束直接回到开始的地方。freeze 表示动画结束后像是被冻住了，元素保持了动画结束之后的状态。

##### accumulate, additive

accumulate 是累积的意思。支持参数有：none | sum。 默认值是 none 。如果值是 sum 表示动画结束时候的位置作为下次动画的起始位置。

additive 控制动画是否附加。支持参数有：replace | sum. 默认值是 replace 。如果值是 sum 表示动画的基础知识会附加到其他低优先级的动画上，

##### restart

restart控制重新开启动画的规则。支持的参数有：always | whenNotActive | never.

- always 是默认值，表示总是，也就是点一次圈圈，马儿跑一下。
- whenNotActive 表示动画正在进行的时候，是不能重启动画的。
- never 表示动画是一波流。



### SVG 与 Javascript

当 SVG 嵌入到 HTML 页面的时候，你可以使用 Javascript 来操作 SVG 元素，就像操作其他 HTML 元素一样。

* 通过 ID 或 class 获取 SVG 元素
* 可以读取/修改 SVG 元素的属性值
* 可以读取/修改 SVG 元素的 css 属性值
* 可以给 SVG 元素及其子元素添加事件监听

* 动画的暂停与播放

  ```js
  // svg指当前svg DOM元素
  svg.pauseAnimations(); // 暂停
  svg.unpauseAnimations(); // 重启动
  ```



### **相关链接** 

[SVG元素在移动H5页面动画的应用](http://genie88.github.io/2015/10/23/mobile-html5-page-development-skills-part5/)

[SVG 动画精髓](https://juejin.im/entry/5907dd4cda2f60005d0fd6c3)

[MDN SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)

[MDN SVG教程](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial)