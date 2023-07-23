## CSS探索系列之flex布局

当对一个文档进行布局的时候，浏览器的渲染引擎会根据标准之一的 **CSS 基础框盒模型**（**CSS basic box model**），将所有元素表示为一个个矩形的盒子（box）。每个盒子由四个部分组成：内容 `Content`、内边距 `Padding`*、*边框 `Border`、外边距 `Margin`。CSS 决定这些盒子的大小、位置以及属性（例如颜色、背景、边框尺寸…）。

布局的传统解决方案，基于盒状模型，依赖 `display `属性 + `position`属性 + `float`属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

`Flex `是 `Flexible Box `的缩写，意为"弹性盒子"，用来为盒状模型提供最大的灵活性。

**弹性盒子布局（Flexible Box Layout）**定义了一种针对用户界面设计而优化的 `CSS `盒子模型。在弹性布局模型中，弹性容器的子元素可以在任何方向上排布，也可以弹性伸缩其尺寸，既可以增加尺寸以填满未使用的空间，也可以收缩尺寸以避免父元素溢出。**子元素的水平对齐和垂直对齐都能很方便的进行操控。**



### 基本概念

**弹性盒子布局**是一种一维的布局模型，一次只能处理一个维度上的元素布局，一行或者一列。作为对比的是另外一个二维布局 [网格布局](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)，可以同时处理行和列上的布局。

![image-20200612003555661](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200612003555661.png)



```css
.container {
    display: flex | inline-flex; /**生成块或内联的弹性容器**/
}
```

**弹性容器：** `display `属性的值为 `flex | inline-flex` 的元素。

**弹性项目：**弹性容器的每个子元素都称为弹性项目。

**轴：**每个弹性盒子布局包含两个轴。弹性项目沿其依次排列的那根轴称为**主轴**。垂直于**主轴**的那根轴称为**侧轴(cross axis)**。

**方向：**弹性容器的**主轴起点(main start)**/**主轴终点(main end)**和**侧轴起点(cross start)**/**侧轴终点(cross end)**描述了弹性项目排布的起点与终点。它们具体取决于弹性容器的主轴与侧轴中，由 `writing-mode` 确立的方向（从左到右、从右到左，等等）。

**行：**根据 [`flex-wrap`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap) 属性指定弹性项目单行显示还是多行显示 。如果允许换行，这个属性允许你控制行的堆叠方向（从左到中、从右到左）。

**尺寸：**根据弹性容器的主轴与侧轴，弹性项目的宽和高中，对应主轴的称为**主轴尺寸(main size)** ，对应侧轴的称为 **侧轴尺寸(cross size)**。

由于弹性盒子使用了不同的布局算法，某些属性用在弹性容器上没有意义：

- 多栏布局模块的 `column-*` 属性对弹性项目无效。
- `float `与 `clear `对弹性项目无效。使用 `float `将使元素的 `display `属性计为`block`。
- `vertical-align` 对弹性项目的对齐无效。



### 容器的属性

以下6个属性设置在容器上：

- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`

#### flex-direction属性

定义了主轴的方向(正方向或反方向)，即弹性项目的排列方向。

初始值：`row`

取值：

- `row`：主轴为水平方向，从左到右。
- `row-reverse`：主轴为水平方向，从右到左。
- `column`：主轴为垂直方向，从上往下。
- `column-reverse`：主轴为垂直方向，从下往上。

![image-20200612004410287](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200612004410287.png)

> 请注意：
>
>  `row` 和 `row-reverse` 受 flex 容器的`direction`属性的影响。
>
> `css`属性 **`direction`** 用来设置文本、表列水平排列的方向，初始值`ltr`。 `ltr` 表示从左到右 (类似汉语、英语等大部分语言)， `rtl` 表示从右到左 (类似希伯来语或阿拉伯语)。
>
> `direction`属性是 `ltr`，`row `表示从左到右定向的水平轴，而 `row-reverse` 表示从右到左; 如果 `dir `属性是 `rtl`，`row `表示从右到左定向的轴，而` row-reverse` 表示从左到右。
>
> 
>
> `column`和`column-reverse`受弹性容器的 **`writing-mode`** 属性的影响。
>
>  **`writing-mode`** 属性指定块流动方向，即块级容器堆叠的方向，以及行内内容在块级容器中的流动方向。
>
> `horizontal-tb`：行内元素从左到右或从右到左（受`direction`属性的影响） ，块元素由上往下。
> `vertical-rl`：行内元素由上往下或由下往上，块元素从左到右或从右到左。（受`direction`属性的影响）
> `vertical-lr`：行内元素由上往下或由下往上，块元素从左到右或从右到左。（受`direction`属性的影响）



#### flex-wrap属性

指定弹性项目单行显示还是多行显示 。如果允许换行，这个属性允许你控制行的堆叠方向。

初始值：`nowrap`

取值：

* `nowrap`：弹性项目被摆放到到一行，这可能导致溢出弹性容器。 cross-start  会根据 flex-direction 的值 相当于 start 或 before。
* `wrap`：弹性项目被打断到多个行中，行由上往下排列。
* `wrap-reverse`：和 `wrap `的行为一样，但是行由下往上排列。

![image-20200612011228246](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200612011228246.png)



####  flex-flow属性

 **`flex-flow`** 属性是 `flex-direction` 和` flex-wrap` 的简写。

初始值：`row nowrap`。

```css
flex-flow: column-reverse wrap;
```



####  justify-content属性

定义了弹性项目在主轴上的对齐方式及其周围的空间的分配。

初始值：`flex-start`

取值：

- `flex-start`：主轴起点对齐。
- `flex-end`：主轴终点对齐。
- `center`： 居中。
- `space-between`：两端对齐，弹性项目之间的间隔都相等。
- `space-around`：每个弹性项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
- `space-evenly`：弹性项目之间、弹性项目与边框之间的间隔都相等。

![image-20200612225416483](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200612225416483.png)

以上六个是常见取值，还有值`start、left、right、baseline、first baseline、last baseline、stretch、safe、unsafe`。？？



#### align-items属性

属性定义弹性项目在侧轴上如何对齐。

初始值：`normal`。取决于我们处在什么布局模式中

取值：

- `flex-start`：侧轴起点对齐
- `flex-end`：侧轴终点对齐
- `center`：中间对齐
- `baseline`: 弹性项目的第一行文字的基线对齐
- `stretch`：弹性项目将占满整个容器的高度（弹性项目未设置高度或设为`auto`）。

![image-20200612232910010](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200612232910010.png)



#### align-content属性

当弹性盒子分多行时，定义了行的对齐方式和周围分配空间。该属性对单行（即：未设置`flex-wrap`或 `flex-wrap: nowrap`）弹性盒子模型无效。

取值：

- `flex-start`：侧轴起点对齐
- `flex-end`：侧轴终点对齐
- `center`：中间对齐
- `space-between`：与侧轴两端对齐，轴线之间的间隔平均分布。
- `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- `stretch`（默认值）：轴线占满整个侧轴（弹性项目未设置高度或设为`auto`）。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200613000900833.png" alt="image-20200613000900833" style="zoom: 67%;" />



#### place-content属性

是 `align-content` 和 ` justify-content` 的简写。第一个值为 `align-content `属性, 第二个值为` justify-content` 。

```css
place-content: center start; 
```

> **非常重要**：如果没有设置第二个值，那么第二个的值与第一个相等，此前提是第一个值对两个属性都是有效的。如果设置的这个值对两个属性都无效，那么整个设置的值就是无效的。



### 项目的属性

以下6个属性设置在项目上：

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

#### order属性

定义项目的排列顺序。数值越小，排列越靠前，默认为0。

#### flex-grow属性

指定了弹性项目扩展规则，即弹性容器中剩余空间的应该分配多少给弹性项目。

剩余的空间是弹性容器的主轴尺寸减去所有弹性项目的尺寸和。

默认为`0`，即如果存在剩余空间，也不放大；大于0，则弹性容器剩余空间的分配就会发生；负值无效。

**具体规则如下：**

- 所有剩余空间总量是1
- 只有一个弹性项目设置了 `flex-grow`属性值
  - 如果`flex-grow`值小于1，则扩展的空间就是`总剩余空间 * flex-grow值`
  - 如果`flex-grow`值大于1，则独享所有剩余空间
- 有多个弹性项目设置了`flex-grow`属性值
  - 如果`flex-grow`值总和小于1，则每个子项扩展的空间就是`总剩余空间 * flex-grow值`。
  
  - 如果`flex-grow`值总和大于1，则所有剩余空间被利用，分配比例就是`flex-grow`属性值的比例。
  
    如：所有弹性项目都有相同的`flex-grow`系数，那么所有的项目将获得相同的剩余空间。
  
    如：三个弹性项目，有一个的`flex-grow`属性为2，其他项目都为1，即：`1：2：1`，则值为`2`的占据剩余空间的`2/4`，其他两个分别占`1/4`。

![image-20200613141809054](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200613141809054.png)

#### flex-shrink属性

指定了弹性项目的收缩规则。弹性项目仅在默认宽度之和大于容器，且未设置`flex-wrap`或者`flex-wrap: nowrap`的时候才会发生收缩。

不足空间是`所有弹性项目的宽度和 - 弹性容器的宽度`。

默认值为1，即如果空间不足，弹性项目将缩小；值为`0`表示不收缩；负值无效。

具体规则：

- 只有一个弹性项目设置了`flex-shrink`
  - `flex-shrink`值小于1，则收缩的尺寸不完全，会有一部分内容溢出弹性容器。
  - `flex-shrink`值大于等于1，则收缩完全，正好填满弹性容器。
- 多个弹性项目设置了`flex-shrink`
  - `flex-shrink`值的总和小于1，则收缩的尺寸不完全，每个弹性项目的收缩尺寸为`不足空间 * flex-shrink值`。
  
  - `flex-shrink`值的总和大于1，则收缩完全，每个弹性项目收缩尺寸的比例和`flex-shrink`值的比例一样。
  
    如：所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。
  
    如：一个弹性项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。

![image-20200613143309096](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200613143309096.png)

#### flex-basis属性

指定了弹性项目在主轴方向上的初始大小。浏览器根据这个属性，计算主轴是否有多余空间。

**注意：**弹性项目的最终尺寸，是由一系列盒模型属性和布局算法决定的，具体可查看下文【弹性项目尺寸的计算】章节。

初始值：`auto`

取值：

* `auto`，即弹性项目的本来大小。

  > 最初 `auto  `的含义是 "参照`width`和`height`属性"。
  >
  > 在此之后，`auto `的含义变成了自动尺寸,  而 `main-size` 变成了 "参照`width`和`height`属性"。实际执行于 [bug 1032922](https://bugzilla.mozilla.org/show_bug.cgi?id=1032922).
  >
  > 然后呢，这个更改又在 [bug 1093316](https://bugzilla.mozilla.org/show_bug.cgi?id=1093316) 中被撤销了, 所以 `auto `变回了原来的含义；而一个新的关键字 `content `变成了自动尺寸。 ([bug 1105111](https://bugzilla.mozilla.org/show_bug.cgi?id=1105111) 包括了增加这个关键字)。
  
* `<width>`

  可以跟`width`或`height`属性的值一样（比如350px、2rem、30%），则弹性项目将占据固定空间。负值是不被允许的。

  > **Note:** 当一个元素同时被设置了 `flex-basis` (除值为 `auto` 外) 和 `width` (或者在 `flex-direction: column` 情况下设置了`height`) ， `flex-basis` 具有更高的优先级。

* `content`

  基于弹性项目的内容自动调整大小。**除火狐，其他大多数浏览器不支持。**

* 其他值。**除火狐，其他大多数浏览器不支持。**

  ```css
  /* 固有的尺寸关键词 */
  flex-basis: fill;
  flex-basis: max-content;
  flex-basis: min-content;
  flex-basis: fit-content;
  ```



#### flex属性

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，后两个属性可选。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

默认值：`initial`，`0 1 auto`。

`flex` 属性可以指定1个，2个或3个值：

* **单值语法**：值必须为以下其中之一

  - 一个无单位数值：它会被当作`<flex-grow>`的值。

  - 一个有效的宽度(width)值：它会被当作 `<flex-basis>`的值。

  - 关键字`none`，`auto`或`initial`。

    `auto` ：`1 1 auto`

    `none`：`0 0 auto`

    `initial`：`0 1 auto`。即：`flex-grow、flex-shrink、flex-basis`的默认值。

* **双值语法**：第一个值必须为一个无单位数值，当作 `<flex-grow>` 的值。第二个值必须为以下之一

  * 一个无单位数：它会被当作 `<flex-shrink>` 的值。

  * 一个有效的宽度值：它会被当作 `<flex-basis>` 的值。

* **三值语法**

- 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。
- 第二个值必须为一个无单位数，并且它会被当作 `<flex-shrink>` 的值。
- 第三个值必须为一个有效的宽度值， 并且它会被当作 `<flex-basis>` 的值。



#### align-self属性

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。

初始值：`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

取值：可能取6个值，除了`auto`，其他都与`align-items`属性完全一致。

![image-20200613154244372](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200613154244372.png)



### 弹性项目尺寸的计算

在弹性盒子布局中，一个弹性项目的最终尺寸是基础尺寸、弹性增长或收缩、最大最小尺寸限制共同作用的结果：

- 基础尺寸：由CSS `flex-basis、width`等属性，内容尺寸以及`box-sizing`盒模型共同决定；
- 弹性增长指的是`flex-grow`属性，弹性收缩指的是`flex-shrink`属性；
- 最大最小尺寸限制指的是`min-width`/`max-width`等CSS属性，以及`min-content`最小内容尺寸。

```shell
#优先级
最大最小尺寸限制 > 弹性增长或收缩 > 基础尺寸
```

弹性项目尺寸的计算规则：

* 如果没有设置 `flex-basis` 属性，那么 `flex-basis` 的大小就是弹性项目的 `width` 属性的大小；
* 如果没有设置 `flex-basis` 、 `width` 属性，那么 `flex-basis` 的大小就是弹性项目内容的大小；
* 默认情况下，`flex-basis`的大小不会收缩至小于内容尺寸。若想改变这一状况，可以设置 `min-width、width` 属性。
* 主轴空间有剩余空间，遵循`flex-grow`规则；空间不足，遵循`flex-shrink`规则



以下在实际开发的项目中遇到的问题：使用了`flex`布局后，弹性项目中文本溢出自动省略号（...）的属性（即， `text-overflow:ellipsis` ）失效。

```html
<section>
    <div class="box_01">
        <div class="item_01">低眉含笑间</div>
        <div class="item_01 item_01_text01" style="flex: 1; ">
            <div class="text">寒灯纸上梨花雨凉 谁的深情绚烂了三生石上的一见倾心 灯烛依旧 无人执手。低眉含笑间 寒灯纸上梨花雨凉 谁的深情绚烂了三生石上的一见倾心 灯烛依旧 无人执手
            </div>
        </div>
    </div>
</section>
<style>
    .box_01 {
        display: flex;
        padding: 10px;
        border: 1px solid #0aa;
    }
    .box_01 .item_01 {
        margin-right: 15px;
        padding: 10px;
        color: #fff;
        text-align: center;
        background-color: #0aa;
        white-space: nowrap;
    }
    .box_01 .item_01 .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .box_01 .item_01_text01 {
        min-width: 0;
    }
    /*
    .box_01 .item_01_text02 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    */
</style>
```

![image-20200613203317491](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200613203317491.png)

[查看DEMO](https://1927344728.github.io/demo-lizh/html/07-flex.html)

从本质上来说，`ellipsis`失效的是因为`.text`元素中的文本没有溢出。

`.text_parent`元素是一个弹性项目，设置了`flex: 1`（即：`flex-grow:1; flex-shrink:1; flex-basis: auto;`，`flex-basis: auto;`），且没有设置`width`属性，它的宽度由内容宽度决定，即`.text`元素的宽度。

`.text`元素默认情况下`width: 100%`，宽度与父元素`.text_parent`一样。父元素宽度不固定的情况下，`.text`元素的宽度取内容宽度，即文本的宽度。

最终结果：**`.text_parent`的宽度 = `.text的宽度` = 文本宽度，所有文本没有溢出**

  

要使`ellipsis`启效，首先我们可以想到的方法是给`.text`元素设置一个小于文本宽度的`width`值，但这种方法显然不适用于响应式开发。

**另一种思路是：**给`.text_parent`指定一个小于文本宽度的`width`值。

**方法一：**`.text_parent`设置`overflow`属性

```css
.text_parent {
    overflow: hidden;
}
```

弹性项目在弹性容器中，有一个可用宽度。设置`overflow`后，表示弹性项目宽度不超出可用宽度。

**方法二：**`.text_parent`设置`width`属性

```js
.text_parent {
    width: 0;
}
```

弹性项目的`width`属性的作用是告诉浏览器：`我有自己的宽度，不需要取内容的宽度`。注意：弹性项目的最终尺寸不一定是css中的`width`值，它会根据一系列的盒模型属性来计算。

**方法三：**`.text_parent`设置`min-width`属性

```css
/**
根据CSS规范草案，一般情况下min-width属性默认值是0，但弹性项目的min-width属性默认值是auto，这样能为弹性盒子布局指明更合理的默认表现。
**/
.text_parent {
    min-width: 0;
}
```

弹性项目设置了`min-width`属性，浏览器将采用如下算法（`shrink-to-fit算法` ??）：

```js
弹性项目宽度 = min ( max (最小宽度, 可用宽度) , 首选宽度)
```

最小宽度：`min-width`的值

可用宽度：弹性项目在弹性容器中的允许宽度

首选宽度：内容不发生换行的时的宽度。（示例中的文本宽度）



以上是个人对弹性项目`width`计算的理解，如有不对，敬请指正。

**参考文章：**

[张鑫旭 - Oh My God，CSS flex-basis原来有这么多细节](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-basis/)

[flexbox 布局中 flex 项的宽度计算原理](https://www.html.cn/archives/10319)



### 浏览器前缀

`flex`布局需要一些浏览器前缀来最大力度地兼容大多数的浏览器。`Flex`布局的前缀不只是在属性前面添加浏览器前缀，不同浏览器下的属性名和属性值都不同，这是因为`Flexbox`布局的标准一直在变，一共有`old, tweener, new `三个版本。

可能处理前缀的最好方法是使用新的语法书写CSS并通过[Autoprefixer](https://css-tricks.com/autoprefixer/)运行CSS，能够很好地处理这个问题。

另外，这里有一个Sass中 @mixin 来处理一些前缀，也可以给你一些处理前缀的启发：

```js
@mixin flexbox() {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

@mixin flex($values) {
  -webkit-box-flex: $values;
  -moz-box-flex:  $values;
  -webkit-flex:  $values;
  -ms-flex:  $values;
  flex:  $values;
}

@mixin order($val) {
  -webkit-box-ordinal-group: $val;  
  -moz-box-ordinal-group: $val;     
  -ms-flex-order: $val;     
  -webkit-order: $val;  
  order: $val;
}

.wrapper {
  @include flexbox();
}

.item {
  @include flex(1 200px);
  @include order(2);
}
```

### 相关问题

#### iPhone 设备兼容

iPhone 11pro、iPhone 不支持  `justify-content: right`，请用 `justify-content: flex-end` 代替。

### 参考链接

[MDN CSS 布局](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout)

[mdn CSS 弹性盒子布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[张鑫旭 写给自己看的display: flex布局教程](https://www.zhangxinxu.com/wordpress/2018/10/display-flex-css3-css/)

