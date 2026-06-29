## @规则：@font-face（自定义字体）

@font-face 用于显示文本自定义字体；字体文件可以从远程服务器或用户自己计算机上本地安装的字体加载。

未设置 `font-family` 属性的情况下，网页字体在不同的操作系统、不同浏览器下内嵌的默认字体是不同的。一般情况下，我们可以给 `font-family` 指定一个安全字体，所谓安全字体，就是在所有的浏览器中都能够正常显示。

常见的安全字体还有：Verdana、Times New Roman。

```css
font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB","Heiti SC", sans-serif;
```

然而，在一些个性化的网页，或者网站 LOGO 、文章主标题中，UI 在设计稿中可能要求用一些比较有特色的字体。这时我们就可以通过 `@font-face` 来引用外部字体了。

一般我们不推荐使用外部字体的主要原因有两个：一是，**字体资源文件太大**（尤其是中文字体文件），影响网页性能；二是，**不同浏览器支持的字体文件格式不同**，出于兼容性考虑，可能要引用多个格式的字体文件。这里要注意，**兼容性是指浏览器支持的字体文件格式，而不是指 @font-face 属性**，实际上在 IE4 就能使用 `@font-face`（最早出现在 CSS2 的规范定义中，但是在 CSS2.1 中又被删除，现在被正式列入 CSS3）。

### 基本用法

```css
@font-face {
    font-family: <family-name>;
    src: url() format | local();
    [ unicode-range: <unicode-range>; ]
    [ font-weight: <font-weight>; ]
    [ font-style: <font-style>; ]
    
    [ font-variant: <font-variant>; ]
    [ font-stretch: <font-stretch>; ]
    [ font-feature-settings: <font-feature-settings>; ]
}
```

以上属性中，`font-family、src` 是必需的，`unicode-range、font-weight、font-style` 可能会用到，其他的用到的可能性不大，不里就不涉及了。

* **font-family：** 指定字体名字，将会被用于 font 或 font-family 属性。字体名字定义，有两点要注意：当有特殊字符或空格时，要加单引号或双引号；尽量不要与系统中已有的字体名字重复，它会覆盖系统中的字体。

* **src：** 指定了包含字体数据的资源，可以是本地的，也可以是远程服务器上的（注意：可能有跨域限制）。

  它的值是一个有优先级的，以逗号分割的外部引用或者本地安装的字体名称。当需要使用字体时，用户代理（指浏览器的意思）将会使用以逗号分隔的参考集中能成功激活的第一个参考值。如果是包含无效数据的字体或者本地的字体资源不存在，用户代理将会忽略当前字体并且加载下一个字体。

  url() 指定外部字体资源的引用，format 描述该 URL 引用的字体资源的格式。格式提示包含以逗号分隔的格式字符串列表，这些格式字符串表示众所周知的字体格式。如果用户代理不支持指定的格式，它会跳过下载字体资源。如果未提供格式提示，则始终下载字体资源。

  local() 指定本地已安装的字体名字。

* **unicode-range：** 设置自定义字体中使用的字符的特定范围。如果页面没有使用此范围内的任何字符，则不会下载字体。值可以是指定字符（如：U+26）、字符范围（如：U+0025-00FF），还可以使用通配符 `?`。
* **font-style：** 指定字体样式。如：normal、italic、oblique。
* **font-weight：**  指定的字体的字体粗细。如：normal（同400）、bold（同700）、数值（1~1000）。

```css
/* 不能在一个 CSS 选择器中定义 @font-face */
@font-face {
    font-family: 'FZQCTJT';
    src: url('/assets/other/方正清纯体简体.ttf');
    unicode-range: u+9701, u+5149, u+6d6e, u+74e6, u+78a7, u+53c2, u+5dee, u+3002, u+000d, u+000a, u+6709, u+60c5, u+828d, u+836f, u+542b, u+6625, u+6cea, u+ff0c, u+000d, u+000a, u+65e0, u+529b, u+8537, u+8587, u+5367, u+6653, u+679d, u+3002;
}
.font {
	font-family: FZQCTJT;
}
```

[查看 @font-face DEMO](https://1927344728.github.io/demo-lizh/html/others_01.html?type=7)

### 字体格式

浏览器对 `@font-face` 的兼容问题是：不同的浏览器对字体格式支持是不一致。我们先了解一下有关字体的几种格式，再看看各种版本的浏览器支持什么样的字体。

##### TrueType（.ttf）

Windows 和 Mac 系统最常用的字体格式，其最大的特点就是它是由一种数学模式来进行定义的基于轮廓技术的字体，这使得它们比基于矢量的字体更容易处理，保证了屏幕与打印输出的一致性。同时，这类字体和矢量字体一样可以随意缩放、旋转而不必担心会出现锯齿。

##### OpenType（.otf）

OpenType 是一种可缩放字型（scalable font）电脑字体类型，采用 PostScript 格式，是美国微软公司与 Adobe 公司联合开发，用来替代 TrueType 字型的新字型。OpenType 最初发表于1996年，并在 2000年之后出现大量字体。它源于微软公司的 TrueType Open 字型，TrueType Open 字型又源于 TrueType 字型。OpenType font 包括了 Adobe CID-Keyed font 技术。Adobe 公司已经在 2002 年末将其字体库全部改用 OpenType 格式。

##### Web Open Font Format（.woff）

WOFF 是一种专门为了 Web 而设计的字体格式标准，它并不复杂，实际上只是对于 TrueType / OpenType 等字体格式的封装，并针对网络使用加以优化：每个字体文件中含有字体以及针对字体的元数据（Metadata），字体文件被压缩，以便于网络传输，并且不包含任何加密或者 DRM 措施。包括 Adobe、 Lino Type、Monotype 在内的几乎所有主要的字体供应商都加入到支持 WOFF 的行列中来。

##### Embedded Open Type（.eot）

嵌入字体格式（EOT）是微软开发的一种技术，专用于 IE（IE4 - IE11），允许 OpenType 字体嵌入到网页并可以下载至浏览器渲染，浏览器根据 CSS 中 @font-face 的定义，下载，渲染这种  .EOT 后缀的字体文件。

##### SVG（.svg）

SVG （Scalable Vector Graphics）格式是使用 SVG 技术来呈现字体，体积上比矢量图更小，还有一种 gzip 压缩格式的 SVG 字体 .svgz。

**浏览器对字体文件的兼容情况如下：**

| Browser | @font-face | TTF\|OTF | WOFF  | EOT  | SVG  |
| :------ | :--------- | :------- | :---- | :--- | :--- |
| IE      | 4+         | 9+       | 9+    | 4+ | 9+ |
| Edge      | 12+ | 12+ | 12+ |  | 12+ |
| Firefox | 3.5+       | 3.5+     | 3.6+  |      | 3+ |
| Chrome  | 4+         | 4+       | 5+  |      | 4+   |
| Safari  | 3.2+       | 3.1+     | 5+   |      | 3.2+ |
| Opera   | 10+        | 10+      | 11.5+ |      | 10+  |
|    | [caniuse-@font-face](https://caniuse.com/?search=%40font-face) | [caniuse-TTF/OTF](https://caniuse.com/?search=TTF%2FOTF) | [caniuse-WOFF](https://caniuse.com/?search=WOFF) | [caniuse-EOT](https://caniuse.com/?search=eot) | [caniuse-SVG](https://caniuse.com/?search=svg) |

IE 只支持微软自有的 EOT 格式字体，而其他浏览器都不支持这一字体格式。**也就是说，@font-face 中我们至少需要 .woff、.eot 两种格式字体。**

### 字体下载

你有没有想过，字体是在什么时候下载的呢？当我们仅仅在 CSS 中定义 @font-face 的时候，页面加载，字体会自动下载吗？

不同浏览器下载字体的策略：

- IE8 只要定义了 @font-face，就会去下载字体，不论实际有没有应用该字体。
- Firefox，IE 9+ 只有定义了 @font-face 并且页面有元素应用了该字体，就会去下载，不论该元素是否有文本内容。
- Chrome，Safari 只有定义了 @font-face 并且页面有元素应用了该字体，并且该元素有文本内容，才会去下载字体。

### 字体加载优化

##### [字蛛（font-spider）](https://github.com/aui/font-spider/blob/master/README-ZH-CN.md)

 字蛛是一个智能 WebFont 压缩工具，它能自动分析出页面使用的 WebFont 并进行按需压缩。字蛛通过分析本地 CSS 与 HTML 文件获取 WebFont 中没有使用的字符，并将这些字符数据从字体中删除以实现压缩，并生成跨浏览器使用的格式。

**特性：**

* 压缩字体：智能删除没有被使用的字形数据，大幅度减少字体体积；

* 生成字体：支持 woff2、woff、eot、svg 字体格式生成。

**安装：** `npm install font-spider -g`

```shell
font-spider ./others_01.html
```

执行后，将过滤没有在页面中出现的字符。这样大大减小文件体积。

**注意：** 

* 压缩后的文件出现在源文件的位置，而源文件会备份到当前目录下 `.font-spider` 文件夹，

* @font-face 的 `--map` 参数，测试没有成功，报错：

  ```shell
  $ font-spider --map 'https://xxx.com/font,d:/xxx/assets/css/test' ./others_01.html
  # Error: File not found with singular glob: d:/xxx/assets/css/test/汉仪范笑歌隶书繁.ttf (if this was purposeful, use `allowEmpty` option)
  ```

* 有些字体文件可能生成后没有压缩，这是字体文件的原因，可能跟字型外框（Truetype 外框、PostScript 外框）有关。

##### [Fontmin](https://www.npmjs.com/package/fontmin)

用于压缩和转换字体文件。[官网](https://ecomfe.github.io/fontmin/)

**安装：** `npm install fontmin -S`

```js
// fontmin.node.js
const Fontmin = require('fontmin')
const fontmin = new Fontmin()
    .src('assets/font/*.ttf')
    .dest('dest')
    .use(Fontmin.glyph({ 
        text: `
            一夕轻雷落万丝，
            霁光浮瓦碧参差。
            有情芍药含春泪，
            无力蔷薇卧晓枝。
        `,
        hinting: false
	}))
fontmin.run()
```

执行 `node fontmin.node.js`，在当前项目根目录下创建 `dest` 目录，输出压缩后的字体文件，源文件不变。

注：与 font-spider 一样，有些字体文件没有压缩。

##### 字体预加载

```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

### 参考资料

[CSS在线字体库，外部字体的引用方法@font-face](https://www.cnblogs.com/hellman/p/6773461.html)

**字体下载：**

[下载字体](http://xiazaiziti.com/)

[字客网](https://www.fontke.com/)

[字体天下](https://www.fonts.net.cn/)

[100font.com——一个专门收集整理 “免费商用字体”的网站 ](https://www.100font.com/)

**字体文件转换：**

http://www.freefontconverter.com/

https://convertio.co/zh/font-converter/

https://cloudconvert.com/

https://www.fontke.com/tool/convfont/

https://www.pdf365.cn/convfont/

