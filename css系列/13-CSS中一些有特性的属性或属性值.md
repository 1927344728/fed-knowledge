## CSS中一些属性或属性值的特性

### visibility:collapse

`visibility` 属性用于显示或隐藏元素而不更改文档的布局。该属性还可以隐藏表格中的行或列。

可取值如下：

* visible： 元素正常显示；

* hidden：隐藏元素，但是其他元素的布局不改变，相当于此元素变成透明。注意：若将其子元素设为 `visibility: visible`，则该子元素依然可见。

* collapse：用于隐藏 `<table>` 中的行、列、列组和行组，并且不占用任何空间。但是，仍会计算隐藏的行和列的大小，就好像折叠的行或列中的单元格一样。此值主要用于删除表格的行或列时，不强制重新计算整个表的宽度和高度。

  对于其他元素，`collapse` 处理与 `hidden` 相同。

**注意：** 有些现代浏览器对 `collapse` 不支持或是不完全支持，在其他元素（非表格行与列元素）上使用时，不会正确的将它显示成 `hidden` 的效果。

**注意：** `visibility: collapse` 会改变表格的布局，嵌套在其被折叠的单元格中的表格也会同样被折叠，除非为此嵌套表格指定 `visibility: visible`。 

### font-style

`font-style` 属性用于设置 `font-family` 字体的 `italic`、`oblique` 样式。

可取值如下：

* normal： 常规字体；
* italic： 斜体字体，如果当前字体没有可用的斜体版本，会选用 `oblique`  替代；
* oblique： 倾斜体字体，如果当前字体没有可用的倾斜体版本，会选用 `italic` 替代；

```css
font-style: normal;
font-style: italic;
font-style: oblique;
font-style: oblique 14deg;
```

`italic` 样式一般是指书写体（常规字体的斜体版，有单独的字体文件），相比无样式的字体，通常会占用较少的高度，而 `oblique` 字形一般只是常规字形的倾斜版本。斜体和倾斜体都是通过人工倾斜常规字体的字形来模拟的。

对于 `oblique` 来说，如果所选字体族中有一个或多个斜面可用，则选择与指定角度最接近的斜面。如果没有斜面可用，浏览器将通过按指定的倾斜量合成斜面版本的字体。有效值为`-90~90deg` (含 `90deg`)。如果没有指定角度，则使用 `14deg`。正值倾斜到线的末尾，而负值倾斜到线的开头。

如果有多个斜面可用，一般来说，对于要求的角度为 `14deg` 或更大，首选较大的角度；否则，首选更小的角度。

可变字体可以精确控制 `oblique` 字体的倾斜程度。对于 TrueType 或 OpenType 可变字体，变量 `slnt` 用于实现 `oblique` 倾斜的变化；变量 `ital` 值为 1，用于指定 `italic` 的值。

### border

border 属性是一个用于设置各种单独的边界属性的简写属性： `border-width, border-style, border-color`。

* border-width 不支持百分比（一般来说，没有 border-width 没有百分比的需求）；
* border-style 的默认值是 `none`，而不是 `solid`；
* border-style: double 的表现规则：双线宽度永远相等，中间间隔±1；
* border-color 默认值是元素的 `color` 属性值。
* 和所有的简写属性一样，如果有缺省值会被设置成对应属性的初始值。同时需要注意，`border` 属性不能设置  `border-image`  属性，但会把该属性重置为初始值 `none`。

#### vertical-algin

`vertical-align` 属性用来指定内联元素或表格单元格（`table-cell`）元素的垂直对齐方式。

`vertical-align` 属性可被用于两种环境：

* 使内联元素盒模型与其行内元素容器垂直对齐；
* 表格单元内容垂直对齐。

**注意：** `vertical-align` 属性只对行内元素、行内块元素和表格单元格元素生效，不能用它垂直对齐块级元素。

**相对父元素垂直对齐的值：**

* baseline：**默认值**，元素的基线与父元素的基线对齐；
* sub：元素的基线与父元素的下标基线对齐；
* super：元素的基线与父元素的上标基线对齐；
* text-top：元素的顶部与父元素的字体顶部对齐；
* text-bottom：元素的底部与父元素的字体底部对齐；
* middle：元素的中线与父元素的基线加上父元素 `x-height`（译注：x高度）的一半对齐；
* `<length>`：元素的基线对齐到父元素的基线之上的给定长度。可以是负数；
* `<percentage>`：元素的基线对齐到父元素的基线之上的给定百分比，该百分比值是按 `line-height` 属性计算的，可以是负数；

**相对行垂直对齐的值：**

* top：元素及其后代元素的顶部与整行的顶部对齐；
* bottom：元素及其后代元素的底部与整行的底部对齐；

**表格单元格垂直对齐的值：**

* baseline、sub、super、text-top、text-bottom、`<length>`、` <percentage>` 表示单元格的基线，与该行中所有以基线对齐的其它单元格的基线对齐；
* top：使单元格内边距的上边缘与该行顶部对齐；
* middle：使单元格内边距盒模型在该行内居中对齐；
* bottom：使单元格内边距的下边缘与该行底部对齐；

**注意：** 一个 `inline-block` 元素，如果里面没有 `inline` 内联元素，或者 `overflow` 不是 `visible`，则该元素的基线就是其外边距的下边缘替代（如图片等替换元素），否则，其基线就是元素里面最后一行内联元素的基线。

### overflow

overflow  属性定义当一个元素的内容太大而超出块级格式化上下文时候该做什么。它是 `overflow-x` 和 `overflow-y` 的简写。

**overflow 属性的可取值：**

* **visible：** 内容不能被裁减并且可能渲染到边距盒（padding）的外部。
* **hidden：** 如果需要，内容将被裁减以适应边距（padding）盒。不提供滚动条，也不支持允许用户滚动（例如通过拖拽或者使用滚轮）。内容**可以以编程的方式（如，JavaScript）滚动**（如，通过设置 scrollLeft 等属性的值或 scrollTo() 方法），因此该元素仍然是一个滚动的容器。
* **clip（实验性）：** 类似于 hidden，内容将以元素的边距（padding）盒进行裁剪。clip 和 hidden 之间的区别是 clip 关键字禁止所有滚动，包括以编程方式的滚动。该盒子不是一个滚动的容器，并且不会启动新的格式化上下文。如果希望开启一个新的格式化上下文，可使用 `display: flow-root`。
* **scroll：** 如果需要，内容将被裁减以适应边距（padding）盒。无论是否实际裁剪了任何内容，浏览器总是显示滚动条，以防止滚动条在内容改变时出现或者消失。打印机可能会打印溢出的内容。
* **auto：** 取决于用户代理。如果内容适应边距（padding）盒，它看起来与 visible 相同，但是仍然建立了一个新的块级格式化上下文。如果内容溢出，则浏览器提供滚动条。
* **overlay（已弃用）：** 行为与 auto 相同，但是滚动条绘制在内容之上，而不是占据空间。

**overflow 属性的特性：**

- 除 visible 以外的值，都将创建一个新的块级格式化上下文。这在技术层面上是必须的——如果一个浮动元素和滚动条相交，它会在每个滚动步骤后强行重新渲染内容，从而导致慢滚动体验。
- 当 overflow-x 值为 hidden | scroll | auto，而 overflow-y 的值为 visible（默认值）时，**overflow-y 属性会被隐式的计算为 auto**。同理，当 overflow-y 值为 hidden | scroll | auto，overflow-x 属性的 visible（默认值），也会被隐式的计算为 auto。
- HTML 中有两个标签默认是产生滚动条的：根元素（html）、文本域元素（textarea）。
- 为使 overflow 有效果，块级容器必须有一个指定的宽度、高度（width|max-width、height|max-height）或者设置 `white-space: nowrap`。
- `overflow: hidden` 元素同时存在 border、padding 属性，则当子元素内容超出时，剪裁边界是 border 盒子的内边缘，而非 padding 盒子的内边缘。
- 如果 `overflow: hidden` 元素不是定位元素，且绝对定位元素和 overflow 容器之间也没有定位元素，则无法对绝对定位元素进行剪裁。
- 如果 overflow 的属性值是 auto|scroll，即使绝对定位元素高宽比 overflow 元素高宽还要大，也都不会出现滚动条。
- overflow  元素自身有 transform 属性时，Chrome 和 Opera 浏览器下的 overflow 剪裁是无效的。

### relative

* 相对定位元素的 `left|top|right|bottom` 的百分比值是相对于包含块计算的，而不是自身。注意，其偏移距离是相对自身；
* 相对定位元素的 `top|bottom` 的百分比值是相对包含块高度计算的，同时，如果包含块的高度是 `auto`，那么计算值是 0，偏移无效；
* 相对定位元素同时应用对立方向定位值的时候，也就是 `top|bottom` 或者 `left|right` 同时使用的时候，只有一个方向的定位属性会起作用。而谁起作用则是与文档流的顺序有关的，默认的文档流是自上而下、从左往右，因此 `top|bottom` 同时使用的时候，`bottom` 失效，`left|right` 同时使用的时候，`right` 失效。

### text-indent

`text-indent` 属性定义一个**块元素**首行文本内容之前的缩进量。

* `text-indent` 仅对第一行内联盒子内容有效；
* `text-indent` 对非替换元素的内联元素（`display: inline`）无效，但如果 `display` 值为 `inline-block|inli
  ne-table` 则会生效；
* `input|button` 标签按钮 `text-indent` 值无效；
* `text-indent` 的百分比值是相对包含块计算的，而不是当前元素。



### 参考资料

[MDN vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

[MDN overflow-y](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow-y)