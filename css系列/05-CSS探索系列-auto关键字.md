### CSS探索系列之auto关键字

在 CSS 中，大概有 400 多个属性（不包括带浏览器前缀的属性），其中很多属性的值可以是 auto 关键字。比如常见的，width、height、margin、padding、top 等等。

```javascript
getComputedStyle(document.querySelector('div'))
```

虽然他们的值都可以取值 auto，但是差别却很大。

**auto 关键字使用因属性而异**，也就是说，在不同属性中，它解释是不一样的。

### Width: Auto

当对一个文档进行布局的时候，浏览器的渲染引擎会根据标准之一的 CSS 基础框盒模型，将所有元素表示为一个个矩形的盒子。每个盒子由四个部分（或称区域）组成，其效用由它们各自的边界所定义：内容区域、内边距区域（padding）、边框区域（border）、外边距区域（margin）。

块级元素的 width 属性的初始值就是 auto，意味着它们将占据其父元素的所有水平空间。也就是说，即使设置了 margin、padding、border 属性，也不会超出其父元素的水平空间，元素宽度 = 父元素水平空间 = 内容区域宽度 + 水平方向内边距 + 水平方向边框 + 水平方向外边距。

**注意一点：** 如果元素的 width 的值改成 100%，则结果就是，元素宽度 = 内容区域宽度（父元素水平空间） + 水平方向内边距 + 水平方向边框 + 水平方向外边距，也就是说**会超出父元素的水平空间**。

### Height: Auto

height 属性 和 width 的情况完全不同。一个元素的高度等于它实际内容占用的高度，默认值就是 auto。

### Margin: Auto

对于 margin，最常见的是将已知宽度的元素水平居中：margin 水平方向的属性值，若一侧定值，一侧值为 auto，则 auto为剩余空间大小；如果两侧均是 auto，则平分剩余空间。

auto 可用于实现**块级元素**的水平居中，但不能用于实现垂直居中？

auto 是自动填充剩余空间。块级元素的宽度是占据父元素的水平空间，设置 auto 会平分剩下的水平空间；但高度是随内容自动扩充的，垂直方向没有剩余的空间，所以 auto 不能实现垂直居中。

> auto 在顶部和底部的外边距总是计算为 0px（绝对定位元素除外）。
>
> W3C 规范：**如果 margin-top 或 margin-bottom 为 auto，则其使用值为 0。**

**注意：** 内联元素不可以使用 `margin:0 auto`，使用了也没有效果。

**备注：** 还有一种使用场景，利用 `margin: auto` 把一个绝对定位的元素居中，前提条件：元素是绝对定位元素，且有固定的宽度和高度。

### Flex: Auto

在 flex 布局中，如果给一个子元素设置了 `flex: auto`， 就相当于设置了 `flex: 1 1 auto`。

根据 MDN的规范， 设置了 `flex：auto` 的元素将根据其宽度和高度来调整大小，但它可以根据可用的额外空间来增大或缩小。

**备注：** 在 flex 布局的父元素内，给子元素的 margin 设置为 auto 会让这个子元素被 "推到" 对应的另一边。特别的，如果容器内只有一个子元素，可以用 `margin: auto` 实现水平垂直居中。

### Grid: Auto

在 Grid 布局中，可以给某一列设置为 auto之后，这一列的宽度将取决于包含在其中的内容的长度。

**备注：** 在 Grid 布局中，给元素设置 `margin:auto` 可以达到和 Flex 布局相似的效果，即，给其中一个 Grid 布局的元素设置了 `margin-left: auto`， 那么它将被 “推到” 右侧，同时它的宽度将取决于内容的宽度，而不是 Grid 的宽度了。

### Overflow: Auto

overflow 是 CSS 的简写属性，用于设置元素溢出时所需的行为——即当元素的内容太大而无法适应它的块级格式化上下文时。

可接收值：

* visible：不裁减内容，允许内容渲染到边距盒（padding）的外部。
* hidden：裁减内容以适应边距（padding）盒。
* clip：类似于 hidden，裁减内容以适应边距（padding）盒。clip 和 hidden 之间的区别是：clip 关键字禁止所有滚动，包括以 Javascript 方式的滚动。该盒子不是一个滚动的容器，并且不会启动新的格式化上下文。如果希望开启一个新的格式化上下文，可以使用 `display: flow-root`。
* scroll：无论是否实际裁剪了任何内容，浏览器总是显示滚动条，以防止滚动条在内容改变时出现或者消失。打印机可能会打印溢出的内容。
* **auto：** 取决于用户代理。**如果内容未溢出边距（padding）盒，它看起来与 visible 相同，但是仍然建立了一个新的块级格式化上下文；如果内容溢出，则浏览器提供滚动条。**

### top/right/bottom/left: Auto

CSS 定位属性 top、right、bottom、left 定义了定位元素的**外边距**边界与其包含块**内边距**边界之间的偏移，非定位元素设置此属性无效。

它们都可以使用 auto 关键字。

以 left 属性为例，其效果取决于元素的 position 属性：

* position: absolute | fixed： 指定了定位元素左外边距边界与其包含块左边界之间的偏移。
* position: relative：指定了元素的左边界离开其正常位置的偏移。
* position: sticky：如果元素在 viewport 里面，效果和 `position:relative` 等同；如果元素在 viewport 外面，效果和 `position:fixed` 等同。
* position: static：无效。

当 left 和 right 同时指定时，元素的位置会被重复指定。当容器是从左到右时，left 的值会被优先设定；当容器是从右到左时，right 的值会被优先设定。

对于 auto 关键字而言：

* 对于绝对定位元素，元素将忽略此属性而以 right 属性为准，如果此时设置 width: auto，将基于内容需要的宽度设置宽度；如果 right 也为 auto 的话，元素的水平位置就是它作为静态（static）元素时该在的位置。
* 对于相对定位元素，元素相对正常位置的偏移量将基于 right 属性；如果 right 也为 auto 的话，元素将不会有偏移。

**注意：** auto 将使得元素定位时遵循父元素的 padding 属性，而不是遵循父元素的边界。

其他三个属性与 top 属性类似。

### 参考资料

[【CSS】【译】一文了解 CSS 中关于 auto 的一切](https://juejin.cn/post/6844904102871171085)

[Everything About Auto in CSS](https://ishadeed.com/article/auto-css/)

