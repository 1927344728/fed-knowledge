## CSS探索系列之line-height

line-height，又称行高，具体来说是指两行文字间基线间的距离，也可以称为一行文字所占的高度。在CSS，line-height 被用来控制行与行之间的垂直距离。

### 常规使用

line-height CSS 属性用于设置多行元素的空间量，如多行文本的间距。**对于块级元素，它指定元素行盒（line boxes）的最小高度。对于非替代的 inline 元素，它用于计算行盒（line box）的高度。**

> 替代的 inline 元素：img、iframe、video之类的由加载资源决定显示尺寸的元素

line-height 属性被指定为以下任何一个：

* normal: 取决于用户端。桌面浏览器（包括Firefox）使用默认值，约为1.2，这取决于元素的 `font-family`。
* **数字（推荐）**: 无单位数字，<数字>乘以该元素的字体大小。
* 长度: 以em、px、rem等为单位的值。
* 百分比: 与元素自身的字体大小有关。计算值是给定的百分比值乘以元素计算出的字体大小。

### 基本概念

#### 顶线、中线、基线、底线

文本排版的几个基本概念：**顶线、中线、基线、底线**。`vertical-align` 属性中有 `top、middle、baseline、bottom`，与这四条线有关。

基线（baseline），指的是一行字横排时下沿的基础线，基线并不是汉字的下端沿，通常可以理解为英文字母 x 的下端沿。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210308220145351.png" alt="image-20210308220145351" style="zoom:50%;" />

#### 字体高度、行高、行距和半行距

**字体高度：**顶线到底线的距离。我们，一般字体高度会大于或者等于字体大小，不同的字体会有差异。

**行高**：两行文本基线之间的距离。

**行距：**两行文本之间第一行的底线到第二行顶线的距离。**行距 = 行高 - 字体高度**

**半行距：**行距的一半。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210308220229509.png" alt="image-20210308220229509" style="zoom: 50%;" />

#### 内容区域、内联盒子、行框盒子、包含盒子

* **内容区域(content area)**：是一种围绕文字看不见的盒子。内容区域的大小与 `font-size` 大小和 `font-family` 相关，与 `line-height` 没有任何关系。[点击查看字体字号和盒子的关联](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)

* **内联盒子(inline boxes)**：每个行内元素会生成一个行内框，行内框是一个浏览器渲染模型中的一个概念，无法显示出来。内联盒子不会让内容成块显示，而是排成一行。

  如：外部包含inline水平的标签(span、a、em、strong等)，则属于内联盒子。如果是个光秃秃的文字，则属于匿名内联盒子。行内框默认等于内容区域，除非设置了padding。

* **行框盒子(line boxes)：**每一行就是一个行框盒子，每个行框盒子又是由一个一个内联盒子组成。行框盒子是浏览器渲染模式中的一个概念，无法显示出来。行框高度等于本行中所有行内框高度的最大值。当有多行内容时，每一行都有自己的行框。

* **包含盒子(containing box)**：由一行一行的行框盒子组成，**高度就是单行文本高度的累加**。

![image-20210308220316135](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210308220316135.png)

#### 内联元素的高度表现

行高(line-height) = 内容区域高度(content area) + 行间距(vertical spacing)

行高决定内联盒子的高度；内容区域高度只跟 `font-size`、`font-family` 有关；行间距可大可小(甚至负值)，保证高度正好等于行高。

行框盒子里面有多个不同行高的内联盒子，**高度并不是简单的由行高最高的那个盒子决定**，还需要考虑 `vertical-align` 属性值。

如下图：

上部分内联元素的高度：第一个 span: 28.4px，第二个 span: 54.8px，第三个 span: 18px。span 外层的包含盒子高度取决于第二个span，高度为52.8px（不包含 span 的边框）。

下部分内联元素的高度，与上部分完全一样。同时，给第三个 span 加一个 css 属性 `"vertical-align: -40px;`。span 外层的包含盒子高度为 **87.6px**（具体计算逻辑未知？？）。

![image-20210308223727021](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210308223727021.png)

```html
<section>
  <style type="text/css">
    .box1 {
      border: 1px solid #eee;
      margin-bottom: 15px;
    }
    .box1 span:nth-child(1) {
      font-size: 20px;
      color: rgb(87, 80, 211);
      border: 1px solid rgb(87, 80, 211);
    }
    .box1 span:nth-child(2) {
      font-size: 40px;
      color: rgb(218, 37, 29);
      border: 1px solid rgb(218, 37, 29);
    }
    .box1 span:nth-child(3) {
      font-size: 10px;
      color: rgb(59, 179, 195);
      border: 1px solid rgb(59, 179, 195);
    }
  </style>
  <div class="box1">
    <span>中文</span>
    <span>English</span>
    <span>English</span>
  </div>
  <div class="box1">
    <span>中文</span>
    <span>English</span>
    <span style="vertical-align: -40px;">English</span>
  </div>
</section>
```

[查看内联元素的高度DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html)

另外，行间距为负值时，如果 `line-height` 小于 `font-size`，`inline box` 会优先于行高，以保证 `inline box` 的高度正好等于行高。



### line-height应用

#### 单行文字的垂直居中对齐

一般来说，`line-height` 值设置为 `height` 一样大小的值，可以实现单行文字的垂直居中。实际上，`height` 是非必要的，删除`height` 单行文字也能居中的。

![image-20210309204247836](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309204247836.png)

```html
<section>
  <style type="text/css">
    .box2 {
      /*height: 50px;*/
      line-height: 50px;
      border: 1px solid #eee;
      color: #f121b1;
    }
  </style>
  <div class="box2">
    不要问，不要等，不要犹豫，不要回头。
  </div>
</section>
```

[查看单行文字的垂直居中DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html?type=2)

#### 多行文字的垂直居中

高度不固定 `div`，多行文字垂直居中可以用 `padding`。

高度固定的 `div`，多行文字垂直居中可以借助于 `line-height` 来实现。

![image-20210309204211516](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309204211516.png)

```html
<section>
  <style type="text/css">
    .box3 {
      height: 100px;
      line-height: 100px;
      border: 1px solid #eee;
      color: #e60012;
    }
    .box3 span {
      display: inline-block;
      line-height: 18px;
      vertical-align: middle;
    }
  </style>
  <div class="box3">
    <span>
      盈盈一点芳心，占多少春光，问卿知否？红妆莫斗。谁得似、净骨天然清瘦。神娟韵秀。
      盈盈一点芳心，占多少春光，问卿知否？红妆莫斗。谁得似、净骨天然清瘦。神娟韵秀。
    </span>
  </div>
</section>
```

> 注：span 标签要加 `display: inline-block`属性，或者改用块级标签。
>
> [查看多行文字的垂直居中DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html?type=3)

#### 图片的垂直居中

高度固定的 `div`，可以用 `line-height` 来实现不同高度图片的垂直居中。

![image-20210309210458080](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309210458080.png)

```html
<section>
  <style type="text/css">
    .box4 li {
      display: inline-block;
      width: 150px;
      line-height: 150px;
      border: 1px solid #eee;
    }
    .box4 li img {
      width: 100px;
      vertical-align: middle;
    }
  </style>
  <ul class="box4">
    <li><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/nice/20190419141710_4735vxaqwhri_small.jpg"></li>
    <li><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/nice/20190419141711_9501mvvwvonf_small.jpg"></li>
    <li><img style="width: 80px;" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/nice/c1647f58eed70de7fd7a19a63347d137.jpg"></li>
    <li><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/nice/20190419141711_5185ntcvfdux_small.jpg"></li>
  </ul>
</section>
```

[查看图片的垂直居中DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html?type=4)



### 相关扩展：vertical-algin

#### vertical-algin属性

**`vertical-align`** 用来指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。它只对行内元素、表格单元格元素生效，**不能用它垂直对齐块级元素**。

属性值可以为：

* baseline：元素的基线与父元素的基线对齐。
* sub：元素的基线与父元素的下标基线对齐。
* super：元素的基线与父元素的上标基线对齐。
* text-top：元素的顶部与父元素的字体顶部对齐。
* text-bottom：元素的底部与父元素的字体底部对齐。
* middle：元素的中线与父元素的基线加上父元素 `x-height`（译注：x高度）的一半对齐。
* `<length>`：元素的基线对齐到父元素的基线之上的给定长度。可以是负数。
* `<percentage>`：元素的基线对齐到父元素的基线之上的给定百分比，该百分比是 `line-height` 属性的百分比。可以是负数。
* top：元素及其后代元素的顶部与整行的顶部对齐。
* bottom：元素及其后代元素的底部与整行的底部对齐。

**注：上述值，top、bottom是相对整行垂直对齐，其余是相对其父元素垂直对齐。**

> 表格单元格的值
>
> baseline、sub、super、text-top、text-bottom、`<length>`、` <percentage>`，是单元格的基线，与该行中所有以基线对齐的其它单元格的基线对齐。
> top：使单元格内边距的上边缘与该行顶部对齐。
> middle：使单元格内边距盒模型在该行内居中对齐。
> bottom：使单元格内边距的下边缘与该行底部对齐。

**注：没有基线的元素，使用外边距的下边缘替代。**

> 一个inline-block元素，如果里面没有inline内联元素，或者overflow不是visible，则该元素的基线就是其margin底边缘，否则，其基线就是元素里面最后一行内联元素的基线。

`vertical-algin` 的百分比值是按 `line-height` 属性计算的。



### 相关问题

#### img元素底部为何有空白？

在 `div` 中加入 `img` 标签，如果 `div` 有背景色或者边框属性，会发现图片底部会有一些空白。如下图：

![image-20210309211610176](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309211610176.png)

```html
<section>
  <style type="text/css">
    .box5 {
      border: 1px solid #5aa572;
    }
    .box5 img {
      height: 250px;
    }
  </style>
  <div class="box5">
    <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/nice/20190419141710_4735vxaqwhri_small.jpg">
  </div>
</section>
```

[查看img元素底部空白DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html?type=5)

**在HTML5文档声明下，块状元素内部的内联元素的行为表现，就好像块状元素内部还有一个（更有可能两个-前后）看不见摸不着没有宽度没有实体的空白文本节点。**

其具体表现，和图片后面有文字是一样的，如下图：

![image-20210309215407892](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309215407892.png)

具体跟 `vertical-align` 和 `line-height` 有关：

`img` 标签默认的 `display` 属性值是  `inline`，其后面的文本是由一个匿名内联元素包裹。图片和文本的垂直对齐方式是 `vertical-align: baseline`，即基线对齐。`img` 标签的基线是图片的下边缘，文本的基线一般认为是小写 `x` 的下边缘（上图中，为 `w` 的下边缘）。图片与文本的基线对齐，最终渲染出来，图片底部就会留出一些空白。

这里的一个关键点是，**为什么 `img` 标签的基线是图片的下边缘？怎么来定位内联元素的基线？**

CSS2的可视化格式模型文档中有一么一段话：

>  The baseline of an ‘inline-block’ is the baseline of its last line box in the normal flow, unless it has either no in-flow line boxes or if its ‘overflow’ property has a computed value other than ‘visible’, in which case the baseline is the bottom margin edge.

这段话，我理解为：内联元素的基线是元素内正常流中最后一个内联元素的基线。如果，该元素里面没有内联元素，或者本身 `overflow` 属性的计算值而不是 `visible`，这种情况下基线是 `margin` 底边缘。

`img` 是单标签，其内部没有其他内联元素，所以它的基线是 `margin` 底边缘。

**常用解决方法：**`img` 标签加 `display: block`、`div` 标签加 `font-size: 0` 或者 `line-height: 0`、`img` 标签加 `vertical-align: top | middle | bottom` 等。



#### 为什么line-height推荐使用无单位数字？

`line-height` 的取值有：1.5、150%、1.5em

从计算上来讲，当前元素这三个`line-height` 的值是没有任何差别的。但子元素的 `line-height` 计算有差别：

* `line-height: 1.5`：子元素继承父元素 `line-height` 的系数，其具体值需要根据子元素的字体大小重新计算，即，子元素的 `line-height`  = 1.5 * 子元素的 `font-size` 值。
* `line-height: 150%/1.5em`：子元素继承父元素 `line-height` 的计算值，即，子元素的 `line-height`  = 父元素的 `line-height`  = 1.5 * 父元素的 `font-size` 值。

由此可见：无单位时，子元素的行高随子元素 `font-size` 值变化（推荐使用）；有单位时，子元素继承了父元素计算得出的行距，与子元素 `font-size` 无关。

![image-20210309233603556](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210309233603556.png)

```html
<section>
  <style type="text/css">
    .box6 li {
      display: inline-block;
      width: 30%;
      border: 1px solid #5aa572;
      vertical-align: top;
      font-size: 30px;
    }
    .box6 li:nth-child(1) { line-height: 1.5; }
    .box6 li:nth-child(2) { line-height: 150%; }
    .box6 li:nth-child(3) { line-height: 1.5em; }
    .box6 li span {
      color: #e60012;
      font-size: 15px;
    }
  </style>
  <ul class="box6">
    <li class="box6 item1">
      <span>盈盈一点芳心，占多少春光，问卿知否？红妆莫斗。谁得似、净骨天然清瘦。神娟韵秀。
    </li>
    <li class="box6 item3">
      <span>盈盈一点芳心，占多少春光，问卿知否？红妆莫斗。谁得似、净骨天然清瘦。神娟韵秀。</span>
    </li>
    <li class="box6 item2">
      <span>盈盈一点芳心，占多少春光，问卿知否？红妆莫斗。谁得似、净骨天然清瘦。神娟韵秀。</span>
    </li>
  </ul>
</section>
```

[查看line-height单位DEMO](https://1927344728.github.io/frontend-knowledge/demo/28-line-height.html?type=5)

上面的三个 `li` 元素的 `line-height` 计算值都是 `30px * 1.5 = 45px`。而第一个 `li` 下的 `span` 的 `line-height` 计算值是 `1.5 * 15px = 22.5px`，其余两个 `li` 下的 `span` 的计算值是父元素的 `line-height` 计算值，即 `45px`。



#### line-height 在内联元素和块级元素作用区别

* `line-height` 影响内联元素的高度。内联元素的行高 = 内容区域高度 + 行间距。`line-height` 之所以起作用，就是通过调整行距大小来实现的。
* `line-height` 无法影响替换元素，如：`img、iframe、video`。
* 通常，`line-height` 对块级元素本身是没有任何作用的。但在块元素没有提定 `height`时，它可以改变块级元素里面内联元素占据的高度来影响块元素高度。



#### 为何line-height可以让单行文本垂直居中？

在CSS中，如果我们把一段文本的 `line-height` 设置为父容器的高度就可以实现文本垂直居中。

那么，它怎么实际垂直居中的呢？

默认情况下一行文本的行高分为：上半行距，内容区域的高度，下半行距，并且上半行距是等于下半行距的。当`line-height`增大，内容区域的高度不变，上下行距增大（且保持相等），文本区域的位置往下移；当 `line-height` 值与 `height` 相等时，可以近似的看成内容区域垂直居中于父容器。

![image-20210412211528971](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20210412211528971.png)



### 参考资料

[MDN line-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-height)

[MDN vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

[张鑫旭 css行高line-height的一些深入理解及应用](https://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/)

[CSS深入理解之line-height](https://juejin.cn/post/6844903721025929223)

[css line-height 用法详解](https://blog.csdn.net/weixin_41275295/article/details/104443808)

[Deep dive CSS: font metrics, line-height and vertical-align](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)

