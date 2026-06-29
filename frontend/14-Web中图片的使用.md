## Web中图片的使用

**一图胜千言**，图片是网页不可或缺的一部分。

在 Web 中，正确的使用图片能提高加载性能以及节约带宽。本文介绍了图片的一些概念、格式，以及如何正确的引用图片。

### 图片相关的一些概念

#### 彩色深度

彩色深度标准通常有以下几种：

- 8位色： 每个像素所能显示的彩色数为2的8次方，即 **256** 种颜色。
- 16位增强色：16位彩色，每个像素所能显示的彩色数为2的16次方，即 **65536** 种颜色。
- 24位真彩色：每个像素所能显示的彩色数为24位，即2的24次方，**16777216（约 1677万）** 种颜色。
- 32位真彩色：即在24位真彩色图像的基础上再增加一个表示图像透明度信息的 Alpha 通道。32位真彩色并非是2的32次方的色数，它其实也是 **16777216（约 1677万）** 多色，不过它增加了 256 阶颜色的透明度，为了方便称呼，就规定它为32位色。

#### 光栅图和矢量图

对于图片，一般分光栅图（点阵图）和矢量图：

- 光栅图： 是基于 pixel 像素构成的图像。JPEG、PNG，WEBP 等都属于此类。
- 矢量图： 使用点、线和多边形等几何形状来构图，具有高分辨率和缩放功能。SVG 就是一种矢量图。

#### 无压缩、无损压缩和有损压缩

- 无压缩：即不对图片数据进行压缩处理，能准确地呈现原图片。BMP 格式就是其中之一。
- 无损压缩：即压缩算法对图片的所有的数据进行编码压缩，能在保证图片的质量的同时降低图片的尺寸。PNG 是其中的代表。
- 有损压缩：即压缩算法不会对图片所有的数据进行编码压缩，而是在压缩的时候，去除了人眼无法识别的图片细节。因此有损压缩可以在同等图片质量的情况下大幅降低图片的尺寸。其中的代表是 JPG。

### 常用图片格式

#### ico（ 1985 ？？）

ICO 是 windows 的图标文件格式，图标文件可以存储单个图案、多尺寸、多色板的图标文件。

ICO（Microsoft Windows 图标）文件格式是 Microsoft 为 Windows 系统的桌面图标设计的。然而，早期版本的 Internet Explorer 引入了网站提供 favicon.ico 在网站根目录中命名的 ICO 文件以指定网站图标的能力—— 一个显示在收藏夹菜单中的图标，以及其他地方的图标表示网站会很有用。

一个 ICO 文件可以包含多个图标，并以列出每个图标详细信息的目录开头。目录之后是图标的数据。每个图标的数据可以是没有文件头的 BMP 图像，也可以是完整的 PNG 图像（包括文件头）。如果您使用 ICO 文件，则应使用 BMP 格式，因为直到 Windows Vista 才添加对 ICO 文件中的 PNG 的支持，并且可能没有得到很好的支持。

#### GIF（1987）

GIF 是一种无损的、索引色模式的点阵图，所以 GIF 每帧图所表现的颜色最多为 256 种。GIF 能够支持动画，也能支持背景透明，这点连古老的 IE6 都支持，所以在以前想要在项目中使用背景透明图片，其中一种方案就是生成 GIF 图片。

**其特点：**

- 体积小：优秀的压缩算法使其在一定程度上保证图像质量。
- **动画：**可插入多帧，从而实现动画效果。
- 透明：可设置透明色以产生对象浮现于背景之上的效果。
- 色彩失真：由于采用了 8 位压缩，最多只能处理 256 种颜色，故不宜应用于真彩色图片。

**备注：** 在兼容性允许的情况下考虑，可以在想要动图效果时使用视频，通过静音（muted）的 video 来代替 GIF。相同的效果下，GIF 比视频（MPEG-4）大 5～20 倍。

#### base64（1987）

base64 编码就是将一副图片数据编码成一串字符串，使用该字符串代替图像地址，图片随着 HTML 的下载同时下载到本地，不再单独消耗一个 http 来请求图片。

**其特点：**

- 无额外请求；
- 没有跨域问题，无需考虑缓存、文件头或者 cookies 问题；
- 体积比其他格式至少大 1/3，且编码解码有额外消耗。

#### PNG（1996）

PNG 图像格式使用无损或有损压缩来提供更有效的压缩，并支持比 GIF 更高的颜色深度，以及完全 alpha 透明度支持。

PNG 得到广泛支持，所有主要浏览器都对其功能提供全面支持。Internet Explorer 在版本 4-5 中引入了 PNG 支持，直到 IE 9 才完全支持它，并且在随后的许多年里都有许多臭名昭著的错误，包括曾经的 Internet Explorer 6。

PNG 格式有三种版本：

- **PNG-8：** 是无损的、索引色模式的点阵图，跟 GIF 类似，而且也支持背景透明。相对比 GIF 格式好的特点在与背景透明时，图像边缘没有什么噪点，颜色表现更优秀，并且 PNG-8 具有更小的文件体积。尽量用 PNG-8 而不是 GIT，除非需要动画。
- **PNG-24：** 是无损的、使用直接色的点阵图，其实就是**无损压缩**的 JPEG，其体积比 BMP 小得多，但还是要比 JPEG、GIF、PNG-8 大得多。
- **PNG-32：** 就是在 PNG-24 的基础上，增加了透明度的支持。

**其特点：**

- 体积小：无损压缩，支持256色调色板技术。
- 真彩色：最高支持48位真彩色图像以及16位灰度图像。
- 透明：支持Alpha通道的透明/半透明特性。
- **可预览：**渐近显示和流式读写，适合在网络传输中快速显示预览效果后再展示全貌。
- 其他：支持图像亮度的Gamma校准信息、支持存储附加文本信息（图像名称、作者、版权、创作时间、注释）、使用CRC防止文件出错、最新的PNG标准允许在一个文件内存储多幅图像。

#### JPEG（1992）、JPEG2000（1997~2000）

JPEG 图像格式是目前最广泛使用的静止图像**有损压缩**格式，它实际上是一种压缩图片的数据格式，而不是一种文件类型。

JPG/JPEG （两者没有区别，只是在不同系统中表达不一样） 采用直接色的点阵图，能比较好的表现各种色彩，主要在压缩的时候会有所失真，也正因为如此，造就了这种图片格式体积的轻量。

其特点：

- 适用于储存24位元全采影像
- 采取的压缩方式通常为有损压缩
- **不支持透明或动画**
- 压缩比越高影像耗损越大，失真越严重
- 压缩比在10左右肉眼无法辨出压缩图与原图的差别

#### SVG（1999）

SVG 是无损的矢量图（放大时，不会失真），是一种基于 XML 的矢量图形格式，它将图像的内容指定为一组绘制命令，这些命令可以创建形状、线条、应用颜色、过滤器等。SVG 文件是图表、图标和其他可以精确绘制成任意大小的图像的理想选择。因此，SVG 在现代 Web 设计中的用户界面元素中很受欢迎。

SVG 文件是包含源代码的文本文件，在解释时，它会绘制所需的图像。

**其特点：**

- 可伸缩性
- 体积小。svg 平均比 GIF、 JPEG、 PNG 小得多，在极高的分辨率下也是如此
- 支持动画
- 与 DOM 无缝衔接。可以直接使用 HTML、 CSS 和 JavaScript (例如动画)来操作
- 复杂度高会减慢渲染速度，不适合游戏类等高互动动画

#### APNG（2004）

APNG 是 Mozilla 首次引入的一种文件格式，它扩展了 PNG 标准以添加对动画图像的支持。在概念上类似于已经使用了几十年的动画 GIF 格式，APNG 更强大的是它支持各种颜色深度，而动画 GIF 仅支持 8 位索引颜色。

#### WebP（2010）

WebP 通过基于 VP8 视频编解码器的预测编码支持有损压缩，以及使用替换重复数据的无损压缩。有损 WebP 图像比视觉上相似压缩级别的 JPEG 图像平均小 25–35%。无损 WebP 图像通常比 PNG 格式的相同图像小 26%。

WebP 还支持动画：在有损 WebP 文件中，图像数据由 VP8 比特流表示，其中可能包含多个帧。无损 WebP 拥有 ANIM 描述动画的 ANMF 块和表示动画序列的帧的块。支持循环播放。

WebP 现在在主要网络浏览器的最新版本中得到了广泛的支持，尽管它没有深入的历史支持。

从 [can i use - webp](https://caniuse.com/?search=webp)上看，支持率95%。 主要是 Safari 低版本和 IE 低版本不兼容。

**其特点：**

- 同时提供有损压缩和无损压缩两种图片文件格式。
- **文件体积小：**在有损与无损压缩上，它的表现都会优于传统（JPEG/PNG）格式。WebP 无损压缩比 PNG 的体积小 26%，webP 的有损压缩比同质量的 JPEG 格式体积小 25-34%。同时 WebP 也支持透明度，一个无损压缩的 WebP 图片，如果要支持透明度只需要 22% 的格外文件大小。
- 支持动画。
- **浏览器兼容差：** Safari 不支持或部分支持，IE 11 及以下不支持。

#### BMP

BMP（位图图像）文件类型在 Windows 计算机上最为普遍，通常仅用于 Web 应用程序和内容中的特殊情况。

BMP 是无损的、既支持索引色也支持直接色的点阵图。这种图片格式几乎没有对数据进行压缩，通常体积比较大。

#### TIFF

TIFF 是一种光栅图形文件格式，用于存储扫描的照片，尽管它可以是任何类型的图像。它是一种有点 “重” 的格式，因为 TIFF 文件往往比其他格式的图像大。这是因为通常包含元数据，以及大多数 TIFF 图像要么未压缩，要么使用压缩算法，压缩后仍会留下相当大的文件。

TIFF 支持多种压缩方法，但最常用的是传真软件使用的 CCITT Group 4（以及对于较旧的传真系统，Group 3）压缩系统，以及 LZW 和有损 JPEG 压缩。

**注意：** 很久以前，一些浏览器在网页内容中支持 TIFF 图像；但是，现在需要使用特殊的库或浏览器插件来解析该格式图片。因此，TIFF 文件在 Web 中没有用，但在精确编辑或打印的照片和其他艺术品时，通常会提供可下载的 TIFF 文件。

### 响应式图片

响应式图片是一种可以在不同的屏幕尺寸和分辨率的设备上都能良好工作以及其他特性的图片。

响应式图片主要包含：

* 不同的屏幕尺寸和分辨率的设备上，使用不同的图片以适应不同的空间分配（**美术设计**）。
* 不同的屏幕尺寸和分辨率的设备上，引用相同显示效果的图片但包含多个不同的分辨率（**分辨率切换**）——没有必要在比图片实际尺寸小的屏幕上显示一张大图，这样做会浪费带宽。

#### srcset、sizes属性

标准的 img 元素传统上仅仅允许给浏览器指定唯一的资源文件。

```html
<img src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
```

但可以使用两个新的属性 srcset、sizes，来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源。

srcset 属性定义了允许浏览器选择的图像集，以及每个图像的大小。其值是以逗号分隔的一个或多个字符串列表，每一个字符串由以下组成：

* 一个指向图像的 URL
* 一个空格
* 一个描述符：
  * 宽度描述符（正整数 + 'w'）：该整数是图像的真实大小**（物理像素）**。
  * 像素密度描述符（正浮点数 + 'x'），默认值为：1x。

**注意：** 一个 srcset 属性中混合使用宽度描述符和像素密度描述符，会导致该值无效；重复的描述符（比如，两个源相同，且描述符也相同）也是无效的。

**注意：** 如果 srcset 属性使用宽度描述符，则 sizes 属性也必须存在，否则 srcset 将被忽略。

sizes 属性表示资源大小的，定义了一组媒体条件，并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。其值是以逗号隔开的一个或多个字符串：

* 一个媒体条件（最后必需要有一项，用作默认）
* 一个空格
* 一个资源尺寸的值，表示被用来指定图像的预期尺寸**（逻辑像素、CSS像素）**。

```html
<img
     srcset="
             01s2fcqhjeddyx0wjvb1kt3439.jpg 320w,
             01fnn86u44kv9nhsigucvw3737.png 800w,
             01df276351fc64000e76100056bf2b.jpg 1200w,
             01k5lfhmvy0ghhmj3azqsk3439.png 1440w"
     sizes="
            (max-width: 320px) 320px,
            (max-width: 800px) 800px,
            (max-width: 1200px) 1200px,
            (max-width: 1400px) 1440px,
            1200px"
     src="01k5lfhmvy0ghhmj3azqsk3439.png"
     alt="响应式图片"
>
```

当 srcset 中的资源使用密度像素描述符（'x'）时，用户代理会根据**设备像素比**来选项显示的图像；当使用宽度描述符（'w'）时，先检查 sizes 列表中哪个媒体条件是第一个为真，再查看该媒体查询对应的资源尺寸的值，然后计算图像实际渲染的物理像素（与设备像素比有关），最后加载最接近该物理像素值的图像。

**注意：** 图像物理像素值和屏幕密度密切相关，**DP（物理像素）= DIP（逻辑像素） * DPR（设备像素比）**。如， `(max-width: 320px) 320px` ，在 1 倍屏下，表示渲染图像的实际宽度是 `320px * 1 = 320px` ；在 2 倍屏下，表示渲染图像的实际宽度是 `320px * 2= 640px` 。

**注意：** sizes 定义的图像集只对宽度描述符（'w'）起作用，也就是说，如果 srcset 里用的是密度像素描述符（'x'），sizes 属性是不起作用的。另外，如果没有设置 srcset 属性，或者该属性没有值，那么 sizes 属性也不起作用。

**注意：** srcset 属性值有效的情况下，会忽略 src 属性。

#### picture元素

picture 元素通过包含零或多个 source 元素和一个 img 元素来为不同的显示/设备场景提供图像版本。浏览器会选择最匹配的子 source 元素，如果没有匹配的，就选择 img 元素的 src 属性中的 URL。然后，所选图像呈现在 img 元素占据的空间中。

picture 的常见使用场景：

* 艺术指导—— 针对不同 media 条件裁剪或修改图像；
* 根据浏览器是否支持特定格式，提供不同的图像格式。

要决定加载哪个 URL，用户代理检查每个 source 的 srcset、media 和 type 属性，来选择最匹配页面当前布局、显示设备特征等的兼容图像。

picture 常用属性：

* media 属性：提供一个媒体条件（类似于媒体查询）。如果该媒体条件匹配结果为 false，那么这个 source 元素会被跳过。
* type 属性：为资源指定一个 MIME 类型。如果用户代理不支持指定的类型，那么这个 source 元素会被跳过。
* srcset 属性：以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像。

```html
<picture>
  <source media="(max-width: 320px)" srcset="01s2fcqhjeddyx0wjvb1kt3439.jpg">
  <source media="(max-width: 640px)" srcset="01fnn86u44kv9nhsigucvw3737.png">
  <source media="(max-width: 800px)" srcset="01df276351fc64000e76100056bf2b.jpg">
  <source media="(max-width: 1200px)" srcset="01k5lfhmvy0ghhmj3azqsk3439.png">
  <img style="width: 100%;" src="01s2fcqhjeddyx0wjvb1kt3439.jpg" alt="必需要有一个 img 元素">
</picture>
```

#### 还有一种解决方案

图片链接中携带图片处理参数（宽、高等等），由资源存储服务端处理图片文件。比如：[阿里云 - 新版图片处理指南](https://help.aliyun.com/document_detail/101260.html)，当然，提前是你的资源是存储在阿里云。

```html
<img src="https://image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg">
<img src="https://image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg?x-oss-process=image/resize,h_50,m_lfit">
```

### 正确使用图片

#### 使用什么格式的图片

- **内容图片：** 比较重要，且一般颜色较为丰富、文件体积较大，**优先考虑 ：Webp > JPEG > PNG（PNG8 色位太低，而 PNG24 压缩率低，文件体积大）。**
- **背景图：** 次重内容，起修饰作用，**优先考虑 ：Webp > PNG8 、JPEG > GIT。**

#### 使用多大的图片

**使用规则：** 图片都应该经过压缩处理，压缩后的图片不应该出现肉眼可感知的失真区域，图片大小控制在 **200KB** 以内。

**注意：** 60 质量的 JPEG 格式图片与质量大于 60 的相比，肉眼已看不出明显的区别，因此保存 JPEG 图的时候，质量一般控制在 60。若保真度要求高的图片可适量提高到 80。

### 常见问题

#### 如何判断浏览器是否支持 webp？

WebP 是 Google 推出的一种支持有损压缩和无损压缩的图片文件格式。WebP 无损压缩比 PNG 的体积小 26%，WebP 的有损压缩比同质量的 JPEG 格式体积小 25-34%。同时 WebP 也支持透明度，一个无损压缩的 WebP 图片，如果要支持透明度只需要 22% 的格外文件大小。

但是，Webp 的兼容性不是很好，Safari 不支持或部分支持，IE 11 及以下不支持。

判断浏览器是否支持 Webp，有以下几种方法：

##### 通过 canvas 来判断（常用）

创建一个 canvas 元素，然后把它转成 image/webp 格式的 dataUrl。如果 dataUrl 里面包含 webp，则代表当前浏览器支持 Webp 格式， 反之则不支持。

```javascript
function isSupportWebp () {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch (err) {
    return false
  }
}
```

##### 通过加载 WebP 图片判断（官方推荐）

通过 Webp 的一些特征来加载一张 WebP 图片，如果能获取到图片的宽度和高度，就说明是支持 WebP 的，反之则不支持。

```javascript
function checkWebpFeature(feature, callback) {
  const kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
  }
  const img = new Image()
  img.onload = function () {
    const isSupported = (img.width > 0) && (img.height > 0)
    callback(feature, isSupported)
  };
  img.onerror = function () {
    callback(feature, false)
  }
  img.src = "data:image/webp;base64," + kTestImages[feature]
}

checkWebpFeature('lossy', function (feature, isSupported) {
  console.log(isSupported)
});
```

##### 服务端根据请求 Header 信息判断（不推荐，依赖服务端）

在图片请求发出的时候，Request Headers 里有 Accept，服务端可以根据 Accept 里面是否有 image/webp 进行判断。

```shell
...
accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
...
```

#### 如何让网页快速变灰（包括图片）

简单来讲，网页变灰只需要在所有元素前面加了一个滤镜即可，几行简单的代码就可以。

```css
html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
```

#### 什么情况下图片会/不会加载？

* img 标签的图片任何情况下都会加载。

* 已经加载过的相同图片不会重复加载。

* 设置 `display: none` 的元素，其 `background-image` 属性的图片不会加载。

* 设置 `visibility: hidden` 的元素，其 `background-image` 属性、后代 `img` 元素、后代元素的 `background-image` 属性的图片都会加载，并且会渲染。

* 样式定义了 `background-image`，但没有用在元素上，图片不会加载。

* `hover` 伪类下的 `background-image`，在触发时加载。

* Js 创建 img 对象时，图片会加载。

  ```javascript
  const img = new Image()
  img.src = "./pic1.png"
  ```


### 参考资料

[MDN - 多媒体与嵌入](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding)

[MDN - 响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

[MDN - 图像文件类型与格式指南](https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats/Image_types)

