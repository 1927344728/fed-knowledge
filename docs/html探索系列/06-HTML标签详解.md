## HTML标签详解

HTML（超文本标记语言，HyperText Markup Language）是构成 Web 世界的一砖一瓦。它定义了网页内容的含义和结构。除 HTML 以外的其它技术，则通常用来描述一个网页的表现与展示效果（CSS），或功能与行为（ JavaScript）。

“超文本”（hypertext）是指连接单个网站内或多个网站间的网页的链接。链接是网络的一个基本方面。只要将内容上传到互联网，并将其与他人创建的页面相链接，就可以成为了万维网的积极参与者。

HTML 使用 “标记”（markup）来注明文本、图片和其他内容，以便于在 Web 浏览器中显示。HTML 标记包含一些特殊“元素”，如：

```html
head、title、body、header、footer、article、section、p、div、span、img、aside、audio、canvas、datalist、details、embed、nav、output、progress、video
```

HTML 元素通过 “标签”（tag）将文本从文档中引出，标签由在 “<” 和 “>” 中包裹的元素名组成，HTML 标签里的元素名不区分大小写。也就是说，它们可以用大写，小写或混合形式书写。

### 元素按内容分类

每一个 HTML 元素都必须遵循定义了它可以包含哪一类内容的规则。 这些规则被归类为几个常见的元素内容模型。每个 HTML 元素都属于 0 个、1 个或多个内容模型，每个模型都有一些规则使得元素中的内容必须遵循一个 HTML 规范文档 。

以下是三种类型的内容分类：

- 主内容类，描述了很多元素共享的内容规范；
- 表单相关的内容类，描述了表单相关元素共有的内容规范；
- 特殊内容类，描述了仅仅在某些特殊元素上才需要遵守的内容规范，通常这些元素都有特殊的上下文关系。

#### 主内容类（Main content categories）

##### 元数据内容（Metadata content）

此类元素修改文档其余部分的陈述或者行为，建立与其他文档的链接，或者传达其他外带信息。

```html
base、link、meta、noscript、script、style、template、title
```

##### 流式元素（Flow content）

此类元素通常包含文本或植入的内容。

所有可以放在 body 标签内，构成文档内容的元素均属于流式元素。因此，除了元数据内容（base、link、meta、style、title 等）只能放在 head 标签内的元素外，剩下的所有元素均属于流式元素。

```html
a、abbr、address、article、aside、audio、b、bdo、bdi、blockquote、br、button、canvas、cite、code、data、datalist、del、details、dfn、div、dl、em、embed、fieldset、figure、footer、form、h1~h6、header、hgroup、hr、i、iframe、img、input、ins、kbd、label、main、map、mark、math、menu、meter、nav、noscript、object、ol、output、p、pre、progress、q、ruby、s、samp、script、section、select、small、span、strong、sub、sup、svg、table、template、textarea、time、ul、var、video、wbr、文本节点
```

属于此类的少数其他元素（仅限于某种特殊情形，这些元素才会属于此类）：

* area：仅限于它作为 map 的子节点的情形；
* link、meta： 当 itemprop 属性存在时。
* style：仅限于 scoped 属性存在的情形。

##### 章节元素（Sectioning content）

属于分节内容模型的元素，即在当前的大纲中创建一个分节，此分节将定义 header、footer 和标题元素的范围。

```html
article、aside、nav、section
```

##### 标题元素（Heading content）

标题内容定义了分节的标题，而这个分节可能由一个明确的分节内容元素直接标记，也可能由标题本身隐式地定义。

```html
h1~h6、hgroup（将多个 h1~h6 的子元素组装到一起）
```

##### 段落元素（Phrasing content）

段落元素规定文本和它包含的标记。

所有可以放在 p 标签内，构成段落内容的元素均属于段落元素元素。因此，所有段落元素均属于流式元素。

```html
abbr、audio、b、bdo、br、button、canvas、cite、code、datalist、dfn、em、embed、i、iframe、img、input、kbd、label、mark、math、meter、noscript、object、output、progress、q、ruby、samp、script、select、small、span、strong、sub、sup、svg、textarea、time、var、video、wbr、文本节点
```

一些其他的元素也属于这个分类，但是只有当如下特殊情况时才会实现：

* a、del、ins、map：当它仅包含段落元素时；
* area：当它为 map 元素的子元素时；
* link、meta： 当 itemprop 属性存在时。

##### 嵌入元素（Embedded content）

嵌入元素嵌入另一个资源或者将来自另一种标记语言或命名空间的内容插入到文档中。

```html
audio、canvas、embed、iframe、img、math、object、svg、video
```

##### 交互元素（Interactive content）

交互式内容包含为用户交互而特别设计的元素。

```html
a、button、details、embed、iframe、label、select、textarea
```

仅在特殊情形下才会属于此类的元素有：

* audio、video：当 controls 属性存在时；
* img、object：当 usemap 属性存在时；
* input：当 type 属性不处于隐藏（hidden）状态时；
* menu：当 type 属性处于工具栏（toolbar）状态时。

##### 表单相关内容（Form-associated content）

表单相关的内容包含拥有表单父节点的元素，一个表单父节点可以是 form 元素，也可以是其 id 在表单属性中被指定了的元素。

```html
button、fieldset、input、label、meter、object、output、progress、select、textarea
```

另外，还存在一些较小的分类，如脚本支持（Script-Supporting）元素等。

```shell
script, template
```

#### 透明内容模型（Transparent content model）

如果一个元素拥有透明内容模型， 即使将透明内容更换为子元素，其内容必须由合法的 HTML5 元素组成。

```html
del、ins
```

### 元素按功能分组

#### 主根元素

主根元素表示一个 HTML 文档的根（顶级元素），所以它也被称为根元素。所有其他元素必须是此元素的后代。

```html
html
```

#### 文档元数据

元数据含有页面的相关信息，包括样式、脚本及数据，能帮助一些软件（搜索引擎、浏览器等等）更好地运用和渲染页面。对于样式和脚本的元数据，可以直接在网页里定义，也可以链接到包含相关信息的外部文件。

```html
base、head、link、meta、noscript、script、style、title
```

#### 分区根元素

分区根元素表示文档的内容。

```html
body
```

#### 内容分区

内容分区元素允许将文档内容从逻辑上进行组织划分。使用包括页眉（header）、页脚（footer）、导航（nav）和标题（h1~h6）等分区元素，来为页面内容创建明确的大纲，以便区分各个章节的内容。

```html
article、section、header、h1~h6、main、nav、aside、footer、address
```

#### 文本内容

使用文本内容元素来组织在 body 内的块或章节的内容。这些元素能标识内容的宗旨或结构，而这对于可访问性（ accessibility）和搜索引擎优化（SEO）很重要。

```html
div、p、dd、dl、dt、dd、ul、ol、li、figure、figcaption、hr、menu、pre、blockquote
```

#### 内联文本语义

使用内联文本语义元素定义一个单词、一行内容，或任意文字的语义、结构或样式。

```html
a、span、em、b、i
abbr、bdi、bdo、br、cite、code、data、dfn、kbd、mark、q、rp、rt、ruby、s、samp、small、strong、sub、sup、time、u、var、wbr
```

#### 图片和多媒体

HTML 支持各种多媒体资源，例如图像、音频和视频。

```html
area、audio、img、map、track、video
```

#### 内嵌内容

除了常规的多媒体内容，HTML 可以包括各种其他的内容，即使它并不容易交互。

```html
embed、iframe、object、picture、portal、source
```

#### SVG 和 MathML

使用 svg、math 标签将 SVG 或 MathML 内容直接嵌入 HTML 文档。

```html
svg、math
```

#### 脚本

为了创建动态内容和 Web 应用程序，HTML 支持使用脚本语言，最突出的就是 JavaScript。

```html
canvas、noscript、script
```

#### 编辑标识

这些元素能标示出某个文本被更改过的部分。

```html
del、ins
```

#### 表格内容

这里的元素用于创建和处理表格数据。

```html
caption、col、colgroup、table、tbody、td、tfoot、th、thead、tr
```

#### 表单

HTML 提供了许多可一起使用的元素，这些元素能用来创建一个用户可以填写并提交到网站或应用程序的表单。

```html
form、input、select、textarea、label、button、datalist、fieldset、legend、meter、optgroup、option、output、progress、
```

#### 交互元素

HTML 提供了一系列有助于创建交互式用户界面对象的元素。

```html
details、dialog、summary
```

#### Web 组件

Web 组件是一种与 HTML 相关联的技术，简单来说，它允许开发者创建自定义元素，并如同普通的 HTML 一样使用它们。另外，也可以创建经过自定义的标准 HTML 元素。

```html
slot、template
```

### 行内元素和块级元素

HTML 中的元素可分为两种类型：块级元素和行级元素。这些元素的类型是通过文档类型定义（DTD）来指明。

#### 块级元素定义

HTML 中，总是从新行开始，并且占据可用的整个宽度（尽可能向左和向右伸展）的元素，称为块级元素。

```html
div, p, hr, h1~h6,
ul, ol, li, dl, dt, dd,
table, caption, thead, tbody, tfoot, tr, th, td
form, fieldset, legend,
noframes, noscript, pre, address
```

块级元素有以下特点：

* 总是从新行开始；
* 宽度缺省是它的容器的100%，除非设定一个宽度；

* 宽、高、行高以及外边距和内边距都可控制；

* 可以容纳内联元素和其他块元素。

> 注：**在p元素中是不能嵌套块级元素的。在p标签还没结束时，遇到下一个块级元素就会自动结束**。
>
> ```html
> <p>
> 	<div>p标签不能放块元素。</div>
> </p>
> ```
>
> 在浏览器中渲染为：
>
>     <p></p>
>     <div>p标签不能放块元素。</div>
>     <p></p>

#### 行内元素定义

HTML 中，不会从新行开始，并且只占用必要的宽度的元素，称为行内元素。

```html
span, a, b, em, i, big, small, strong, sub, sup, img, input, select, textarea, br,
abbr, acronym, bdo, cite, code, dfn, kbd, q, samp, tt, var
```

行内元素有以下特点：

* 元素不会从新行开始；

* 只占用必要的宽度（即文字或图片的宽度，不可改变）；

* 宽、高、上下内边距/外边距不可改变；**（上下的内边距，虽然可以加大元素范围，但是对元素周围的内容是没影响的。）**
* 只能容纳文本或者其他内联元素。**（嵌套块级元素，行内元素高度不会撑开）**。

#### 行内块元素定义

行内块级元既具有块级元素的特点，也有行内元素的特点。**它可以自由设置元素宽、高、行高、外边距、内边距，也可以和其他行内或行内块级元素元素放置在同一行上。**

行内元素和块级元素都可以通过 css 的 `display: inline-block` 转换成行内块元素。

#### 行内元素和块级元素区别

* 块级：块级元素会独占一行，默认情况下宽度自动填满其父元素宽度；

  行内：行内元素不会独占一行，相邻的行内元素会排在同一行。其宽度随内容的变化而变化。

* 块级：块级元素可以包含行内元素和块级元素；

  行内：行内元素不能包含块级元素。

* 块级：块级元素可以设置宽、高、行高、外边距、内边距。

  行内：行内元素不可以设置宽、高、上下外边距、上下内边距。**（左右外边距、左右内边距是可以的）**

**小结：** 不管块级元素、行内元素，还是行内块元素，区别主要是三个方面：一是排列方式，二是默认宽度，三是宽高边距设置。

### HTML标签嵌套

#### HTML中为何P标签内不可包含DIV标签？

我们也可以通过CSS把div定义成内联元素，把span定义成块元素，但是，我们却不能在HTML里任意转化它们，块元素可以包含内联元素或某些块元素，但内联元素却不能包含块元素，它只能包含其他的内联元素。

因为我们使用的DTD中规定了**块级元素是不能放在`<p>`里面的**，再加上一些浏览器纵容这样的写法：

```html
<p>这是一个段落的开始
<p>这是另一个段落的开始

<!-- 当一个<p>签还没结束时，遇到下一个块元素就会把自己结束掉，其实浏览器是把它们处理成这样： -->

<p>这是一个段落的开始</p>
<p>这是另一个段落的开始</p>
```

#### 那哪些块元素里面不能放哪些块元素呢？

我知道你有这个疑问，也知道我仅仅列一张清单你不好记住它们。我们可以先把所有的块元素再次划分成几个级别的，我们已经知道 html 元素在最外层，html 元素下一级里面只会有 head、body、frameset、noframes，而我们已经知道了可视的元素只会出现在 body 元素里，所以我们把 body 元素划在第一个级里面，接着，把不可以自由嵌套的元素划在第三个级，其他的就归进第二个级。

所谓的不可自由嵌套的元素就是里面只能放内联元素的，它们包括有：

* 标题标记：h1~h6、caption；
* 段落标记：p；
* 其他：hr、dt（只存在于列表元素 dl）。

#### 为什么说第二级的元素可以自由嵌套呢？

我们可以把它们看成是一些容器（或者说是盒子）， 这些容器的大小可以自由变化，例如我们可以把 ul 元素嵌在div 元素里面，也可以把 div 元素嵌在 li 元素里面。 
在 HTML 里有几个元素是比较特别的，ul、ol、dl、table 元素的子一层必须是指定元素：

* ul、ol 元素的子一级必须是 li 元素；
* dl 元素的子一级必须是 dt、dd 元素；
* table 元素的子一层必须是 caption、thead、tfoot、tbody 等元素，而再子一层必须是 tr（只存在于thead、tfoot、tbody 中）元素，之后才是可放内容的 td、th 元素。

### 其他元素特点

##### 空元素定义

标签内没有内容的 HTML 标签被称为空元素。空元素是在开始标签中关闭的。如：br、 hr、 img、 input、 link、 meta。

##### link 标签定义

link 标签定义文档与外部资源的关，它只能存在于 head 部分。

link 标签中的 rel 属性定义了当前文档与被链接文档之间的关系。常见的 stylesheet 指的是定义一个外部加载的样式表。

### 常见问题

##### 1. HTML5 有哪些新特性、移除了那些元素？

HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。

新增的有：

- 绘画 canvas;
- 用于媒介回放的 video 和 audio 元素;
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
- sessionStorage 的数据在浏览器关闭后自动删除;
- 语意化更好的内容元素，比如 article、footer、header、nav、section;
- 表单控件，calendar、date、time、email、url、search、**datalist、keygen、output;**
- 新的技术 webworker, websocket;
- 新的文档属性 document.visibilityState

移除的元素有：

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
- 对可用性产生负面影响的元素：frame，frameset，noframes；

##### 2. 如何处理 HTML5 新标签的浏览器兼容问题？

* IE8/IE7/IE6 支持通过 `document.createElement` 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式。

* 当然也可以直接使用成熟的框架，比如 html5shiv ;

  ```html
  <!--[if lt IE 9]>
  	<script> src="https://cdn.jsdelivr.net/npm/html5shiv/dist/html5shiv.min.js"</script>
  <![endif]-->
  ```

  [if lte IE 9]……[endif] 判断 IE 的版本，限定只有 IE9 以下浏览器版本需要执行的语句。

#####  4. HTML 语义化的理解

- 用正确的标签做正确的事情。
- html 语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析;
- 即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;
- 搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO ;
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

html 的本质作用其实就是定义网页文档的结构，一个语义化的文档，能够使页面的结构更加清晰，易于理解。这样不仅有利于开发者的维护和理解，同时也能够使机器对文档内容进行正确的解读。

如果是搜索引擎的爬虫对我们网页进行分析的话，那么它会依赖于 html 标签来确定上下文和各个关键字的权重，一个语义化的文档对爬虫来说是友好的，是有利于爬虫对文档内容解读的，从而有利于我们网站的 SEO 。从 html5 我们可以看出，标准是倾向于以语义化的方式来构建网页的，比如新增了 header 、footer 这些语义标签，删除了 big 、font 这些没有语义的标签。

##### 5. b 与 strong 的区别和 i 与 em 的区别？

从页面显示效果来看，被 b 和 strong 包围的文字将会被加粗，而被 i 和 em 包围的文字将以斜体的形式呈现。

 但是 b、i 是自然样式标签，分别表示无意义的加粗，无意义的斜体，表现样式为 `{ font-weight: bolder}`，仅仅表示「这
 里应该用粗体显示」或者「这里应该用斜体显示」，此两个标签在 HTML4.01 中并不被推荐使用。

 而 em、strong 是语义样式标签。em 表示一般的强调文本，而 strong 表示比 em 语义更强的强调文本。

 使用阅读设备阅读网页时： strong 会重读，而 b 是展示强调内容。

##### 6. title 与 h1 的区别？

title 属性没有明确意义只表示是个标题，h1 则表示层次明确的标题，对页面信息的抓取也有很大的影响。

##### 7. 页面导入样式时，使用 link 和 @import 有什么区别？

* 从属关系区别： @import 是 CSS 提供的语法规则，只有导入样式表的作用；link 是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性、引入网站图标等。
* 加载顺序区别：加载页面时，link 标签引入的 CSS 被同时加载；@import 引入的 CSS 将在页面加载完毕后被加载。
* DOM 可控性区别：可以通过 JS 操作 DOM ，插入 link 标签来改变样式；由于 DOM 方法是基于文档的，无法使用 @import 的方式插入样式。

##### 8. iframe 有那些缺点？

- iframe 会阻塞主页面的 onload 事件。window 的 onload 事件需要在所有 iframe 加载完毕后（包含里面的元素）才会触发。在 Safari 和 Chrome 里，通过 JavaScript 动态设置 iframe 的 src 可以避免这种阻塞情况。
- 搜索引擎的检索程序无法解读这种页面，不利于网页的 SEO 。
- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
- 浏览器的后退按钮失效。
- 小型的移动设备无法完全显示框架。

##### 9.HTML 中为何 P 标签不可包含块元素？

在 HTML5 中，标准制定者重新定义了 HTML 元素的分类，其中：所有可以放在 P 标签内，构成段落内容的元素均属于段落元素。由于可见，块级元素是不能放在 P 标签里。

**P 标签内包含块元素时，它会先结束自己。**

```html
<section class="box_08">
    <p>
        黄叶青苔归路，屧粉衣香何处。消息竟沉沉，今夜相思几许。
    	<div>秋雨，秋雨，一半因风吹去。—纳兰性德-如梦令</div>
    </p>
</section>
```

![image-20220828115300436](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220828115300436.png)

[P标签包含块元素DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=8)

##### 10. head 标签中必不少的是？

head 标签用于定义文档的头部，它是所有头部元素的容器。head 中的元素可以引用脚本、指示浏览器在哪里找到样式表、提供元信息等等。

 文档的头部描述了文档的各种属性和信息，包括文档的标题、在 Web 中的位置以及和其他文档的关系等。绝大多数文档头部包含的数
 据都不会真正作为内容显示给读者。

下面这些标签可用在 head 部分：`base、link、meta、script、style、title`。

title 定义文档的标题，它是 head 部分中唯一必需的元素。

**注意：** Chrome 测试，没有 head 标签，页面也能显示。

### 参考资料

[HTML 元素参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

