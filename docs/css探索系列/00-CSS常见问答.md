## CSS常见问答

#### CSS3有哪些新特性？

CSS3 是 CSS 的最新标准，是向后兼容的，CSS1/2 的特性在 CSS3 里都是可以使用的，而 CSS3 也增加了很多新特性，为开发带来了更佳的开发体验。

* 过渡： transition；
* 动画： animation；
* 转换： transform；
* 布局： flex、grid、columns；
* 边框： border-radius、box-shadow、border-image；

* 背景和渐变： background-origin、background-clip、 background-size、linear-gradient()、radial-gradient()等；
* 文字： word-break、word-wrap、text-shadow、writing-mode、font-size-adjust；
* 盒模型： box-sizing、 box-reflect、

* @规则： @font-face、@keyframes、@supports；
* 单位： ch、rem、vw、vh、vmax、vmin、q；
* 颜色： rgba、hsla、currentColor、opacity；
* 关系选择符： E~F；
* 属性选择符： E[att^="val"]、E[att$="val"] 、E[att*="val"]；
* 伪类选择符： :not(s)、:root、:last-child、:only-child、:nth-child(n)、:nth-last-child(n)、:target、:first-of-type、:last-of-type、:only-of-type、:nth-of-type(n)、:nth-last-of-type(n)、:empty、:checked、:enabled、:disabled；
* 伪元素选择符： ::placeholder、::selection；
* 混合模式： background-blend-mode、mix-blend-mode；
* 其他： calc()  、var()；

#### reset.css 和 normalize.css 有什么区别？

`reset.css` 和 `normalize.css` 都是一个很小的 CSS 文件，且都是为了重置浏览器自带样式。

`reset.css` 是最早的一种解决浏览器间样式不兼容问题的方案，它的基本思想是**将浏览器的所有样式都重置掉**，从而达到所有浏览器样式保持一致的效果。但是使用这种方法，可能会带来一些性能上的问题，并且对于一些元素的不必要的样式的重置，其实反而会造成
 画蛇添足的效果。如：H1~6、p、strong、em 等标签看起来完全一样，没有任何装饰。

`normalize.css` 是一种更好的解决浏览器间样式不兼容的方法 ，它的思想是**尽量的保留浏览器自带的样式**，通过在原有的样式的基础上进行调整，来保持各个浏览器间的样式表现一致。如：H1~6 标签会在所有浏览器中以一致的方式显示对应的字体粗细、大小等等。

根据官网的定义： `normalize.css` 是一个现代的，为 HTML5 准备的 `reset.css` 的替代品。它可以使元素的渲染在多个浏览器下都能保持一致并且符合规范。它所瞄准的，也都是些需要规范化的样式。

相对与 `reset.css` ，`normalize.css` 的方法保留了有价值的默认值，并且修复了一些浏览器的 Bug，而且使用 `normalize.css` 不会造成元素复杂的继承链。

**总结来说**： `normalize.css`  比 `reset.css` 更合理、更高效、兼容性更好。

[reset.css](https://meyerweb.com/eric/tools/css/reset/)

[normalize.css](https://github.com/necolas/normalize.css/)

#### 标准 CSS 盒模型和 IE 盒模型有区别？

CSS 中有两种盒模型： IE 盒模型（border-box）、W3C 标准盒模型（content-box）。
盒模型包含四部分： 内容（content）、内边距（padding）、外边距（margin）、边框（border）。

两者区别在于：

* W3C 标准盒模型： 宽度（width）、高度（height）只包含内容（content），**不包含内边距（padding）、边框（border）**。
* IE盒模型： 宽度（width）、高度（height）包含内容（content）、内边距（padding）、边框（border）。

在 IE 8+ 浏览器中可以使用 `box-sizing`（CSS新增的属性）指定盒模型，默认值为 `content-box`，即标准盒模型；如果将 `box-sizing` 设为 `border-box` 则用的是 IE 盒模型。

如果在 IE 6~8 中 DOCTYPE 缺失会将盒子模型解释为 IE 盒模型。若在页面中声明了 DOCTYPE 类型，所有的浏览器都会把盒模型解释为 W3C 盒模型。

**总结来说：** 两者区别在于 width、height 计算方式不同。标准盒模型的 width、height 属性只包含内容（content），而 IE 盒模型还包含了内边距（padding）、边框（border）。

**注意：** 一般可以通过修改 `box-sizing: content-box | border-box  ` 属性来改变盒模型。

#### CSS 选择符有哪些？

* id选择器： `#myId`；
* 类选择器： `.my_classname`；
* 标签选择器： `div`、`h1`、`p`；
* 后代选择器： `h1 p`；
* 相邻后代选择器（子）选择器：`ul > li`；
* 兄弟选择器： `li ~ a`；
* 相邻兄弟选择器： `li + a`；
* 属性选择器： `a[rel="external"]`；
* 伪类选择器： `a:hover`、`li:nth-child`；
* 伪元素选择器： `::before`、`::after`；
* 通配符选择器： `*`；

#### CSS 中哪些属性可以继承？

在 CSS 中，每个 CSS 属性定义的概述都指出了这个属性是默认可继承的还是不继承的（Inherited: Yes|NO）。这决定了当没有为元素的属性指定值时该如何计算值。

* **继承属性：** 当元素（文档根元素除外）的一个继承属性没有指定值时，则取父元素的同属性的计算值。
  * 字体系列属性： font、font-family、font-weight、font-size、font-style、font-variant、font-stretch、font-size-adjust
  * 文本系列属性： text-indent、text-align、line-height、word-spacing、letter-spacing、text-transform、direction、color
  * 表格布局属性： caption-side、border-collapse、border-spacing、empty-cells、table-layout
  * 列表属性： list-style-type、list-style-image、list-style-position、list-style
  * 页面样式属性： page、page-break-inside、windows、orphans
  * 声音样式属性： speak、speak-punctuation、speak-numeral、speak-header、speech-rate、volume、voice-family、pitch、pitch-range、stress、richness、azimuth、elevation
  * 全局属性： visibility、quotes、cursor

* **非继承属性：** 当元素的一个非继承属性没有指定值时，则取属性自已的初始值。
  * 全局属性： display、opacity
  * 文本属性： vertical-align、text-decoration、text-shadow、white-space、unicode-bidi
  * 盒模型属性： width、height、margin、padding、border 等
  * 背景属性： background-image、background-color、background-position 等
  * 定位属性： float、clear、position 等
  * 生成内容属性： content、counter-reset、counter-increment
  * 轮廓样式属性：outline-style、outline-width、outline-color、outline
  * 页面样式属性：size、page-break-before、page-break-after

**注意：** a 标签的字体颜色不能被继承，h1-h6 标签字体的大小也是不能被继承的，因为它们都有一个默认值。

**注意：** 当一个属性不是继承属性时，可以使用 `inherit` 值指定一个属性应从父元素继承它的值，可用于任何继承性/非继承性属性。

#### all: unset 和 all: revert 有什么区别？

CSS 中的 all 属性可以将除了 `unicode-bidi`、`direction` 之外的所有属性重设为：

* **initial：** 将属性的初始（或默认，由官方 CSS 规范定义）值应用于元素。

* **inherit：** 使得元素获取其父元素的计算值，通常只在覆盖原有的值的时候使用。

* **unset：** 如果是继承属性，则值等同 `inherit`；如果是非继承属性，则值等同 `initial`。

* **revert：** 将属性还原原本应该具有的值。如果用户定义样式表中显式设置，则按此设置；否则，按照浏览器定义样式表中的样式设置；否则，等价于 `unset`。 

  `revert` 的取值是：

  - 如果是继承属性，则值等同 `inherit`。
  - 如果是非继承属性，则值取用户代理（浏览器）的样式表的默认值。
  - 如果是非继承属性，且用户代理（浏览器）的样式表中没有默认值，则值等同于 `initial`。

`revert` 与 `unset` 非常类似，在大部分情况下，他们的作用是一模一样的！唯一的区别是：非继承属性值是 `revert`，取值是用户代理（浏览器）的默认值，而 `unset` 取的是官方 CSS 对该属性定义的默认值。

注意： IE 浏览器不支持 `initial `、`unset`、`revert`。

#### CSS 的简写属性有哪些？

简写属性是可以同时设置好几个 CSS 属性值的 CSS 属性。

常见的简写属性有：background、font、transition、animation、margin、padding、border等。

```css
background: [background-color] [background-image] [background-repeat] [background-attachment] [background-position] / [ background-size] [background-origin] [background-clip];

font: [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family];  

transition: property duration timing-function delay;

animation: name duration timing-function delay iteration-count direction;

/** padding 与 margin类似
当只有一个值声明时，该值会用于所有四个边距。
当只有两个值声明时，第一个值用于上边距和下边距，第二个值用于左边距和右边距。
当有三个值声明时，第一个值用于上边距，第二个值用于左边距和右边距，第三个值用于下边距。
当有四个值声明时，其会按顺序用于上、右、下、左边距（按顺时针）。
**/
margin: [margin-top-right-bottom-left];
margin: [margin-top-bottom] [margin-left-right];
margin: [margin-top] [margin-left-right] [margin-bottom];
margin: [margin-top] [margin-right] [margin-bottom] [margin-left];

border: [border-width] [border-style] [border-color];
```

**需要注意以下几点：**

* 简写中没有指定的属性值会被设置为它的初始值。

  ```css
  /** background-color 的最终值不是 red，而是 background-color 的默认值 transparent。 **/
  background-color: red;
  background: url(images/bg.gif) no-repeat top right;
  ```

* `inherit` 值只能应用于单独属性。如果应用于一个简写属性，则必须整体应用，而不能对简写属性值的每一个部分单独应用。

  ```css
  /** 只能整体使用 **/
  padding: inherit;
  
  /** 错误：浏览器不识别该值 **/
  padding: inherit 50px 10px 50px;
  ```

* 简写属性不会强制内部属性的特定顺序。但，这只适用于这些属性使用不同类型的值时，如果几个属性的值类型相同，则要注意各属性的顺序。比如：盒子模型相关的属性（`margin`、`padding`、`border`）属性值的顺序需要按照约定顺序。

#### CSS 优先级算法如何计算？

一个简单的问题：当有多个选择器为同一元素的同一属性指定了不同的值，浏览器是如何决定应用哪一个选择器指定的值？

CSS（Cascading Style Sheets，层叠样式表）的一个核心概念是——层叠，它决定着如何将 CSS 应用到 HTML。

层叠有三个因素需要考虑，根据重要性降序排序如下：

- **重要程度：** 即属性值带是否带有 `!important`。如果有，则重要程序为 1，否则为 0。
- **优先级：** 重要程序相等时，浏览器会根据优先级来决定将哪个选择器的规则应用于元素。
- **资源顺序：** 重要程序和优先级都相等时，最后声明的选择器将应用于元素上，即后面的规则覆盖前面的规则。

选择器的优先级： **本质上，是不同类型的选择器有不同的分数值，把这些分数相加就得到特定选择器的权重，然后进行比较**。不同类型的选择器分数值取决于所表示的范围：

* 一个元素选择器不是很具体 — 比如：选择页面上某一类型的所有元素 — 它的优先级就会低一些。
* 一个类选择器稍微具体点 — 比如：选择该页面中有特定 class 的元素 — 它的优先级就要高一点。

**优先级可以分为四个等级：** A,B,C,D，左侧的等级高于右侧，每一个等级之间没有进制。

* **标签的 `style` 属性：** A 等级，有 `style` 属性，则 `A = 1`；没有，则 `A = 0`；
* **id 选择器：** B 等级，B 的值等于 id 选择器出现的次数；
* **class 选择器|属性选择器|伪类选择器：** C 等级，C 的值等于 class 选择器|属性选择器|伪类选择器出现的总次数；
* **标签选择器和伪元素选择器：** D 等级，D 的值等于标签选择器和伪元素选择器出现的总次数 。

**优先级计算方法：**

* 每个等级的初始值为 0，即 0,0,0,0；
* 每个等级的分数值为选择器出现的次数相加；
* 每个等级计数之间没关联，计算时不允许进位。比如：20 个类选择器仅仅意味着 0,0,20,0，~~而不是 0,2,0,0~~，它的优先级不会超过一个 id 选择器的分数值 0,1,0,0。
*  优先级比较规则：从左往右依次进行比较 。同一等级值较大者胜出，如果相等，则继续比较下一等级值 。
* 如果 4 个等级值相同，则最后声明的优先级高；
* 通配符选择器（`*`）、关系选择器（`+、>、~、空格`）、not 伪类（`:not()`）不会影响优先级，可以认为其分数值是 0,0,0,0。（但是，在 `:not()` 内部声明的选择器会影响优先级）。
* `!important` 没有分数值，但它的优先级是最高的，可以认为它的分数值为 1,0,0,0,0。

```css
#id_01 > ul > li > a.class_01 {}
/** 依次求出 A B C D 的值 **/
/**
	A = 0：没有内联样式；
	B = 1：id 选择器出现了 1 次；
	C = (1 + 0 + 0) = 1：类选择器出现了 1 次，属性选择器出现了 0 次，伪类选择器出现 0 次；
	D = (3 + 0) = 3：标签选择器出现了 3 次，伪元素出现了 0 次；
	最终值：(0, 1, 1, 3)
**/
```

| 选择器                                 | 优先级     |
| -------------------------------------- | ---------- |
| 内联样式                               | 1, 0, 0, 0 |
| *#id_01                                | 0, 1, 0, 0 |
| *[id="id_01"]                          | 0, 0, 1, 0 |
| div                                    | 0, 0, 0, 1 |
| div.class_01                           | 0, 0, 1, 1 |
| div#id_01                              | 0, 1, 0, 1 |
| html > body div [id="id_02"] ul li > p | 0, 0, 1, 6 |

**注意以下问题：**

* 判断优先级时，浏览器先会判断一条属性声明是否有 `!important`。如果有，那么它的优先级就是最高的；如果其他选择器也有  `!important`，则需要去比较优先级。
* 覆盖 `!important` 唯一的办法就是也指定一个 `!important`，并且具有更高优先级，或者声明的位置更靠后。
* 优先级低的选择器规则也会用于元素，只是如果与优先低高的选择器指定了同一属性，优先采用后者。

* 优先级是基于选择器的类型进行计算的。如下选择器中，id 选择器拥有更高的优先级：

  ```css
  /** 尽管选择器*[id="foo"] 选择了一个ID，但是它还是作为一个属性选择器来计算自身的优先级。 **/
  *#foo { color: green; }
  *[id="foo"] { color: purple; }
  ```

* 复制选择器可以增加优先级分数值。如下选择器中，`.c_01.c_01` 选择器拥有更高的优先级：

  ```css
  .c_01.c_01 { color: red; }
  .c_02 { color: green; }
  ```

* 部分浏览器由于字节溢出原因可能出现等级间进位问题。这种情况目前可能不存在了，感兴趣的可以点开 [有趣：256个class选择器可以干掉1个id选择器](https://www.zhangxinxu.com/wordpress/2012/08/256-class-selector-beat-id-selector/) 了解。

#### 什么是 CSS 包含块？

当客户端代理（如：浏览器）渲染文档时，对于每一个元素，它都产生了一个盒模型。每一个盒模型都被划分为四个区域**：内容区、内边距区、边框区、外边距区。**

![image-20220115200828710](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220115200828710.png)

包含块（Containing Block）本质上是一个元素的盒模型的某个区域，也可以理解为一个矩形，它的作用是**为它里面包含的元素提供一个参考**。一个元素的尺寸和位置通常会受其包含块的影响，比如：width、height、padding、margin、top、right、bottom、left 等属性，当它们的值是百分比值时，这些值的计算就是通过元素的包含块为坐标参考系计算得来。

最简单的示例：

``` css
<section>
	<p style="width: 50%;"></p>
</section>
```

以上示例，`section` 元素就是 `p` 元素的包含块，`p` 元素的 `width` 值就是 `section` 元素的 `width * 50%`。

##### 如何确定元素的包含块？

大多数情况下，元素的包含块就是这个元素最近的**祖先块元素的内容区**，但不是所有元素都如此。确定一个元素的包含块依赖的是该元素的 `position` 属性：

* **position: static|relative|sticky：** 元素的包含块可能由它的**最近的祖先块元素（`display: inline-block|block|list-item` ）的内容区**，也可能会建立格式化上下文。
* **position: absolute：** 元素的包含块就是由它最近的 `position` 值不为 `static` （也就是值为 `fixed|absolute|relative|sticky`）的**祖先元素的内边距区**。
* **position: fixed**： 对于连续媒体，元素的包含块是视口（Viewport）；对于连续媒体，元素的包含块是分页媒体的页面区域。
* **position：absolute|fixed**： 元素的包含块也可能是由满足以下条件的最近祖先元素的内边距区：
  * `transform` 或 `perspective` 的值不是 `none`；
  * `will-change: transform|perspective` ；
  * `filter` 的值不是 `none`，或者 `will-change` 的值是 `filter`（只在 Firefox 下生效）；
  * `contain: paint`。

> 注意： 根元素（HTML 节点）所在的包含块是一个被称为**初始包含块**的矩形。对于连续媒体，它的尺寸是视口（Viewport），并锚定在画布原点；对于连续媒体，它的尺寸是分页媒体的页面区域。
>
>  Continuous Media（连续媒体）用来定义那些内容没有间断的上下文环境，即其流动性是连续的。比如：屏幕上显示的网页内容、语音内容。
>
> Paged Media（分页媒体）与连续媒体的不同之处在于，文档的内容被分成一个或多个离散页面。比如：纸张、透明胶片等。
>
> **注意：** fixed 元素的包含块一般是初始包含块，但如果祖先元素中有 transform 等属性，则包含块是该祖先元素。

##### 如何根据包含块计算百分值？

如上所述，如果某些属性值是百分比值，它的计算值是由该元素的包含块计算而来的。这些属性包括盒模型属性和偏移属性:

* **height|top|bottom：** 元素的属性值由包含块的 `height` 属性的值来计算它的百分值。如果包含块的高度会根据它的内容变化（即，未指定 height，或者指定的 height 是百分比），而且包含块为 `position: relative|static` ，那么，这些值的计算值为 `auto`，也就是说，指定的百分比值无效。
* **width|left|right|padding|margin：** 元素的属性值由包含块的 `width` 属性的值来计算它的百分值。

#### display:none、opacity:0、visibility: hidden 有什么区别？

* **display: none：** `display` 用于设置元素的内部和外部显示类型。外部显示类型决定该元素在流式布局中的表现（比如：块级或内联元素）；内部显示类型控制其子元素的布局（如：flex、grid）。`display: none` 会将元素从可访问性树中移除。这会导致该元素及其所有子代元素不再被屏幕阅读技术访问。
* **opacity: 0：** `opacity` 用于设置一个元素的不透明度，换言之，指定了一个元素后面的背景的被覆盖程度。`opacity` 的值是 0.0~1.0 范围内的数值，`opacity: 0` 表示元素完全透明（即元素不可见）。
* **visibility: hidden：** `visibility` 用于设置显示或隐藏元素而不更改文档的布局。`visibility: hidden` 会隐藏元素，但是不改变文档布局，相当于此元素变成透明。**注意：** 若将其子元素设为 `visibility: visible`，则该子元素依然可见。

| 特性                           | display: none | opacity: 0 | visibility : hidden |
| ------------------------------ | ------------- | ---------- | ------------------- |
| 是否占据页面空间               | 否            | 是         | 是                  |
| 是否引起重流                   | 是            | 否         | 否                  |
| 是否引起重绘                   | 是            | **不一定** | 是                  |
| 是否可被子元素继承             | 否            | 否         | 是                  |
| 子元素是否能修改该属性继续显示 | 否            | 否         | **是**              |
| 是否能触发自身绑定事件         | 否            | 是         | **否**              |
| 是否影响遮挡住的元素触发事件   | 否            | 是         | 否                  |
| 是否支持过渡效果（transition） | 否            | 是         | 是                  |

**主要注意以下几点：**

*  `display` 和 `opacity` 是非继承属性，如果父元素设置了 `display: none` 和 `opacity: 0` 隐藏自身及其所有子元素，那么子元素不能设置 `display` 和 `opacity` 属性来显示自己；`visibility` 是继承属性，如果父元素设置了 `visibility : hidden` 隐藏自身及其所有子元素，子元素仍可以设置 `visibility: visible` 继续显示出来。
* `display: none` 会改变文档结构，会引起重流和重绘，而 `opacity` 和 `visibility` 属性不会引起重流。
* `display: none`和 `visibility : hidden` 会引起重绘，而 `opacity` 属性不一定会产生重绘。

> 重流：当文档中的一部分（或全部）元素，因为尺寸、布局、隐藏等改变而需要重新构建。这就称为重流（也称为回流、重排），重流必定会引发重绘。
>
> 重绘：当文档中的一些元素需要更新属性，而这些属性只是影响元素的外观、风格（如：background-color），而不会影响布局的时候，则称为重绘。
>
> 在 Blink 和 WebKit 内核的浏览器中，对于应用了 `transition`、`opacity` 等属性的元素，浏览器会将渲染层提升为合成层。合成层后，`transform` 和 `opacity` 属性值的修改不会触发重绘，GPU 只是在已有的图层上进行处理。

#### display、position、float 之间有什么关系？

* 如果 `display` 属性值为 `none`，用户代理（浏览器）会忽略 `position` and `float` 属性。
* 如果 `position` 值为 `absolute|fixed`，则 `display` 会被设置为 `block|table|inline-flex|flex`，`float` 被设置为 `none`。 
* 如果 `float` 值不为 `none`，则 `display` 会被设置为 `block`。注意，如果有 `position` 值是 `relative` 并且 `float` 属性不为 `none`，则 `relative` 相对于浮动后的最终位置定位。
* 根元素的 `display` 值是 `block`，不可修改。
* 其他情况，则保持指定的 `display` 属性值不变。

总的来说，可看作是优先级：`display: none` > `position: absolute|fixed` > `float: left|right` > 其他 `display`值。

#### 什么是可替换元素？

可替换元素是指展现效果不是由 CSS 来控制的元素。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。

简单来说，**它们的内容不受当前文档的样式的影响**。CSS 可以影响可替换元素的位置，但不会影响到可替换元素自身的内容。某些可替换元素，例如 `iframe` 元素，可能具有自己的样式表，但它们不会继承父文档的样式。

CSS 能对可替换元素产生的唯一影响在于，部分属性支持控制元素内容在其框中的位置或定位方式。

##### 哪些是可替换元素？

典型的可替换元素有：iframe、video、embed、img 等。

有些元素仅在特定情况下被作为可替换元素处理：option、audio、canvas、object、applet 等。

HTML 规范也说了 `input` 元素可替换，因为 `type="image"` 的 `input `元素就像 `img `一样被替换。但是其他形式的控制元素，包括其他类型的 `input `元素，被明确地列为非可替换元素。

用 CSS content 属性插入的对象是匿名的可替换元素。它们并不存在于 HTML 标记中，因此是“匿名的”。

##### 可替换元素有哪些特性？

* 可替换元素的外观不受 CSS 的影响，CSS 只影响可替换元素的盒子属性（大小、位置等）。更改替换元素本身的外观需要类似 `appearance` 属性，或者浏览器自身暴露的一些样式接口。
* CSS 在某些情况下会对可替换元素做一些特殊处理。比如：可替换元素的默认尺寸，video、iframe、canvas 等默认是 `300px*150px` （不包括边框）；img 默认是图片本身的大小；表单元素的默认尺寸则和浏览器有关，没有明显的规律。
* 一部分（并非全部）可替换元素，其本身具有的尺寸和基线（baseline）会被一些 CSS 属性用到，加入计算之中。比如：`vertical-align` 属性，其默认值是 `baseline`，指的是行高的基线，被定义为字符 `x` 的下边缘，而替换元素的基线则是元素的下边缘。
* 一些 CSS 属性可用于指定可替换元素的内容在该元素的盒区域内的位置或定位方式。比如：`object-fit` 指定可替换元素的内容在元素盒区域中的填充方式；`object-position` 指定可替换元素的内容对象在元素盒区域中的位置。

##### 可替换元素尺寸的计算规则？

可替换元素的尺寸从内而外分为 3 类：固有尺寸、HTML 尺寸、CSS 尺寸。

* 固有尺寸：  指的是替换内容原本的尺寸。如：图片、视频作为一个独立文件存在的时候，都是有着自己的宽高。
* HTML 尺寸： 只能通过 HTML 原生属性改变。比如：`img` 标签的 `width|height` 属性、`input` 的 `size` 属性、`textarea` 的 `cols|rows` 属性等。
* CSS 尺寸： 指的是通过 CSS 的 `width|height|max-width|min-width|max-height|min-height` 设置的尺寸，对应盒尺寸中的内容盒子。

这 3 类尺寸的计算规则具体如下：

* 如果没有 HTML 尺寸 和 CSS 尺寸，则使用固有尺寸作为最终的宽高；
* 如果没有 CSS 尺寸，则使用 HTML 尺寸作为最终的宽高；
* 如果有 CSS 尺寸，则最终尺寸由 CSS 属性决定；
* 如果固有尺寸含固有宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例显示；
* 如果上面的条件都不符合，则最终宽度表现为 300 px，高度为 150 px；
* 内联替换元素和块级替换元素使用上面同一套尺寸计算规则。

##### CSS content 属性与替换元素的关系？

`content` 属性生成的对象称为“匿名替换元素”。

* `content` 生成的文本是无法选中、复制的，但是普通元素的文本是可以被选中、复制的。同时，`content` 生成的文本无法被屏幕阅读设备读取，也无法被搜索引擎抓取；
* `content` 生成的内容不影响 `:empty` 伪类；
* `content` 动态生成值无法获取。



### 参考资料

[About normalize.css](https://nicolasgallagher.com/about-normalize-css/)

[MDN CSS 属性继承](https://developer.mozilla.org/zh-CN/docs/Web/CSS/inheritance)

[MDN CSS 的简写属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Shorthand_properties)

[MDN CSS 优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

[MDN 层叠与继承](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#specificity_2)

[MDN 布局和包含块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block)

[Relationships between display, position, and float](https://dbaron.org/css/test/sec0907)

[position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？](https://www.cnblogs.com/jackyWHJ/p/3756087.html)

[MDN 可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)
