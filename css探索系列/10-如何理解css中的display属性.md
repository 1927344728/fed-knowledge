# 如何理解css中的display属性

**display** 是CSS中最重要的用于控制布局的属性。每个元素都有一个默认的 display 值，这与元素的类型有关。对于大多数元素它们的默认值通常是 block 或 inline。

**display** 属性可以设置元素的内部和外部显示类型。元素的外部显示类型将决定该元素在流式布局中的表现，比如：块级、内联元素；元素的内部显示类型可以控制其子元素的布局，比如：table、flow layout、grid、flex。



### display的属性

#### CSS 1

- display: none
- display: block
- display: inline
- display: list-item

#### CSS 2.1

* display: inline-block
* display: table
* display: inline-table
* display: table-\*

#### CSS 3

* display: inline-list-item
* display: flex
* display: box
* display: inline-flex

- display: grid
- display: inline-grid
- display: ruby
- ...
  

### none

属性值为 `none` 的元素，既不会占据空间，也无法显示，相当于该元素不存在。一些特殊元素的默认 display 值是它，例如 `script`、`style`。 

与 `visibility` 属性的区别： `none` 不会保留元素本该显示的空间，但是 `visibility: hidden;` 还会保留。

### block

display 属性值为 `block `的元素，称为**块元素**。一个块级元素会新开始一行并且尽可能撑满容器，特性如下：

- 元素独占一整行
- 元素可以设置宽度和高度
- 元素默认宽度100%，默认高度自适应
- 可以设置  margin 与 padding 属性

常见的块级元素有：

- **div：标准的块级元素**
- ol、ul、dl、dir 
- p、h1 - h6
- hr
- fieldset、form、table 
- noframes、noscript、address、blockquote、center 、pre、isindex、menu

### inline

display 属性值为 `inline`的元素，称为**行内元素或内联**。一个行内元素与其他行内元素在同一行上，特性如下：

- 可与其他行内元素在同一行上
- 元素宽高不可改。宽度、高度自适应，即内容文字或者图片的宽高
- text-align 属性设置无效
- 不可以设置  margin 与 padding 属性
- line-height 会让 inline 元素居中

常见的行内元素：

- **span：标准的行内元素**
- a、label 、**img** 
- br 
- abbr、cite、code 
- b、em 、i、strong 、font 
- big、small、acronym 
- dfn 、kbd、q、s、u、sub、sup、strike 、bdo、samp、tt 、var、kbd
- q、s、u、sub、sup、strike 、bdo、samp、tt 、var

#### 空白符带来的问题

两个 inline 元素之间出现了奇怪的间隔：

![image-20200817225257103](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200817225257103.png)

```html
<div class="element_box2">
    <div class="element_item2">
        <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/1bf18986c7786cadc5257b92c474c4fe.jpg">
        <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141710_4735vxaqwhri_small.jpg">
    </div>
</div>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=1)

**解决方法：**

方法一：两个 inline 元素写在一行，即，不要有任何字符，包括空白符。

```html
<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/1bf18986c7786cadc5257b92c474c4fe.jpg"><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141710_4735vxaqwhri_small.jpg">
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=2)

方法二：将 inline 元素转换为 inline-block 元素

方法三：设置父元素的` font-size: 0`



### list-item

此类型可以将多个元素作为列表来显示，同时在元素的开头添加列表的标记，可以设置 `list-style-position`、`list-style-type`属性。

另有：`display: inline-list-item`，chrome 测试，属性无效？？

![image-20200817234630160](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200817234630160.png)

```html
<style>
    .item_03 span {
        display: list-item;
        list-style-position: inside;
        list-style-type: cambodian;
    }
</style>
<section class="item_03">
    <span>世上最凄绝的距离是两个人本来距离很远，互不相识，</span>
    <span>忽然有一天，他们相识，相爱，距离变得很近。</span>
    <span>然后有一天，不再相爱了，本来很近的两个人，变得很远，甚至比以前更远。</span>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=3)



### inline-block

display 属性值为 `inline-block`的元素，称为**行块元素**，同时具有 `block` 的宽高特性又具有 `inline` 的同行元素特性。

- 元素可以设置宽度和高度
- 元素可以和其他元素共处一行
- 元素默认宽度自适应，默认高度自适应
- 可以设置 margin、padding、text-align 属性

常见的行块元素：input、textarea、select、button

### table

display 值为 table，此元素会作为块级表格来显示（类似table），表格前后带有换行符。

| 元素     | 所属类型           | 说明                                             |
| -------- | ------------------ | ------------------------------------------------ |
| table    | table              | 此元素会作为块级表格来显示，表格前后带有换行符。 |
| tabel    | inline-table       | 此元素会作为内联表格来显示，表格前后带有换行符。 |
| tr       | table-row          | 此元素会作为一个表格行显示                       |
| td       | table-cell         | 此元素会作为一个表格单元格显示                   |
| th       | table-cell         | 此元素会作为一个表格单元格显示                   |
| tbody    | table-row-group    | 此元素会作为一个或多个行的分组来显示             |
| thead    | table-header-group | 此元素会作为一个或多个行的分组来显示             |
| tfoot    | table-footer-group | 此元素会作为一个或多个行的分组来显示             |
| col      | table-column       | 此元素会作为一个单元格列显示                     |
| colgroup | table-column-group | 此元素会作为一个或多个列的分组来显示             |
| caption  | table-caption      | 此元素会作为一个表格标题显示                     |

### table-cell

table表格中的单元格有一些特性，我们可以借助`display:table-cell`属性实现以下内容：

#### 垂直居中

单元格的一个特性，可以设置 `vertical-align` 来控制内容的垂直对齐方式：

![image-20200818001119784](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200818001119784.png)

```html
<style>
    .box_04 {
        display: table-cell;
        width: 600px;
        height: 300px;
        border: 1px solid #0aa;
        vertical-align: middle;
        text-align: center;
    }
    .box_04 img {
        height: 200px;
    }
</style>
<section class="box_04">
    <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141710_4735vxaqwhri_small.jpg">
</section>
```

[查看垂直居中DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=4)



#### 自适应布局

左侧图片用`float: left`，右侧文案用 `display: table-cell`。当图片宽度变化时，文案宽度会自动调节，终始保持占满整个父元素宽度。

![image-20200818001950326](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200818001950326.png)

```html
<style>
    .box_05 img {
        float: left;
        height: 120px;
        margin-right: 20px;
    }
    .item_05 {
        display: table-cell;
        width: 600px;
        padding: 20px;
        border: 1px solid #0aa;
    }
</style>

<section class="box_05">
    <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141710_4735vxaqwhri_small.jpg">
    <div class="item_05">
        曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。
    </div>
</section>
```

[查看自适应布局DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=5)



#### 等高布局

表格的另一个特点：同一行列表单元格都等高。

![image-20200818003216577](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200818003216577.png)

```html
<style>
    .box_06 {
        display: table-row;
    }
    .item_06 {
        display: table-cell;
        width: 33.3333%;
        padding: 20px;
    }
</style>
<section class="box_06">
    <div class="item_06" style="background: #e2efed;">曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。
    </div>
    <div class="item_06" style="background: #f2f2f2;">
        曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。
    </div>
    <div class="item_06" style="background: #ffdaed;">
        曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，长大的含义除了欲望还有勇气和坚强，以及某种必须的牺牲。曾经在某一个瞬间，我们以为自己长大了，有一天，我们终于发现，</div>
</section>
```

[查看等高布局DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=6)



### flex

flex是一种弹性布局属性。主要属性有两大类：容器属性和项目的属性。
**注意，设为Flex布局以后，子元素的float、clear和vertical-align属性将失效。**

另有inline-flex：将对象作为内联块级弹性伸缩盒显示。

#### 容器属性

- flex-direction: 属性决定主轴的方向（即项目的排列方向）。
- flex-wrap: 默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。
- flex-flow: 属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。
- justify-content: 属性定义了项目在主轴上的对齐方式。
- align-items: 属性定义项目在交叉轴上如何对齐。
- align-content: 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

#### 项目属性

- order: 定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow: 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- flex-shrink: 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis: 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
- flex: 属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
- align-self: 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

### box

由于某X5浏览器某些版本还不支持最新版的flex布局，所以为了保证良好的运行，建议还是使用`display: box`，box 和 flex 布局的主要差别如下:

##### 容器属性

- display: box。该显示样式的新值可将此元素及其直系子代加入弹性框模型中。Flexbox 模型只适用于直系子代。
- box-orient：horizontal | vertical | inherit。子元素是如何排列的？还有两个值：inline-axis（真正的默认值）和 block-axis，但是它们分别映射到水平和垂直方向。

- box-pack：start | end | center | justify。设置沿 box-orient 轴的框排列方式。因此，如果 box-orient 是水平方向，就会选择框的子代的水平排列方式，反之亦然。

- box-align：start | end | center | baseline | stretch

基本上而言是 box-pack 的同级属性。设置框的子代在框中的排列方式。如果方向是水平的，该属性就会决定垂直排列，反之亦然。

##### 项目属性

- box-flex：0 | 任意整数。该子代的弹性比。弹性比为 1 的子代占据父代框的空间是弹性比为 2 的同级属性的两倍。其默认值为 0，也就是不具有弹性。

### grid

即网格布局，将网页划分成一个个网格，可以任意组合不同的网格，做出各种各样的布局。

另有：display: inline-grid，作为行内元素的网格布局。

### flow-root

元素，无论是内联元素，还是原本就是块级元素，在应用`display:flow-root`声明后，都会变成块级元素，同时这个元素会建立新的BFC（块级格式上下文）。

与`block`相对，`flow-root` 元素 主要区别就是**创建了BFC**，可以用来清除浮动、阻止外边距折叠。

与其他创建 BFC 的方法相比，flow-root 可以创建无副作用的 BFC。 如：float、`postion: absolute` 创建 BFC 会改变元素的布局形式；overflow: hidden 会隐藏溢出内容。

### ruby

`ruby`这个取值对于我们亚洲人来说其实是非常有用的一个东西，但是目前除了`Firefox`以外其它浏览器对它的支持都不太好。简而言之，`display: ruby;`的作用就是可以做出下面这样的东西：

![clipboard.png](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/214122309-5a5ac84bde635_articlex.png)

ruby这个词在英语里的意思是红宝石，但在日语里是ルビ，翻译成中文是旁注标记的意思，我们中文的旁注标记就是汉语拼音。可以想见，这个标准的制定者肯定是日本人，如果是我们中国人的话，那这个标签就不是ruby，而是pinyin了。还有一个ruby语言，发明者也是一个日本人，和html里这个ruby是两码事，不要搞混了。



### 其他值

ruby-base、ruby-text、ruby-base-container、ruby-text-container

contents、run-in

详情请查看 [display的32种写法](https://segmentfault.com/a/1190000012833458)



### 相关问题

#### 什么是块级元素？

块级元素指的是 `display` 值为 `block` 的元素吗？我知道不少人一直有这样的认知，不过这不完全准确。

块级元素元素包含 `display` 值为：

- block
- list-item
- table
- table-*
- flex
- `position: absolute/fixed` 元素，或者 `float: left|right` 元素，或者根元素，这三都的 `display` 值会根据以下规则转变：`display: inline-table` 转变为 `display: table`，`display: inline|inline-block|run-in| table-*` 转换为 `display: block`。

#### 内联盒模型基本概念

内联盒模型主要由四部分组成：内容区域、内联盒子、行框盒子、包含盒子。

* **内容区域(content area)**：是一种围绕文字看不见的盒子。内容区域的大小与 `font-size` 大小和 `font-family` 相关，与 `line-height` 没有任何关系。[点击查看字体字号和盒子的关联](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)

* **内联盒子(inline boxes)**：每个行内元素会生成一个行内框，行内框是一个浏览器渲染模型中的一个概念，无法显示出来。内联盒子不会让内容成块显示，而是排成一行。

  如：外部包含inline水平的标签(span、a、em、strong等)，则属于内联盒子。如果是个光秃秃的文字，则属于匿名内联盒子。行内框默认等于内容区域，除非设置了padding。

* **行框盒子(line boxes)：**每一行就是一个行框盒子，每个行框盒子又是由一个一个内联盒子组成。行框盒子是浏览器渲染模式中的一个概念，无法显示出来。行框高度等于本行中所有行内框高度的最大值。当有多行内容时，每一行都有自己的行框。

* **包含盒子(containing box)**：由一行一行的行框盒子组成，**高度就是单行文本高度的累加**。

#### 为什么不建议行内元素包含块元素？

内元素包含块元素是不符合规范的写法。尽管这种用法不会报错，它还是有些怪异表现，比如：

![image-20211016221145462](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20211016221145462.png)

```html
<section class="box_07">
    <span>
        黄叶青苔归路，屧粉衣香何处。消息竟沉沉，今夜相思几许。
        <div><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/pins_4246056171.webp" alt=""></div>
        秋雨，秋雨，一半因风吹去。—纳兰性德-如梦令
    </span>
</section>
```

[行内元素包含块元素DEMO](https://1927344728.github.io/demo-lizh/html/15-display.html?type=7)

**怪异一：** 行内元素的内容遇到块元素会自动换行，这不符合我们对行内元素的第一感知（**行内元素是在一行显示的**）。 

其实际渲染类似：

```html
<section class="box_07">
    <span>黄叶青苔归路，屧粉衣香何处。消息竟沉沉，今夜相思几许。</span>
    <div><img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/pins_4246056171.webp" alt=""></div>
    <span>秋雨，秋雨，一半因风吹去。—纳兰性德-如梦令</span>
</section>
```

**怪异二：** 高度问题。在开发者工具，检查 span 元素可以看出，它的高度是 195.6px，但它的区域似乎只有块元素前面的一行文字。实际中，我们也无法通过 span 标签去获取整块内容的真正高度：

```js
document.querySelector('.box_07').querySelector('span').clientHeight
// 0
document.querySelector('.box_07').querySelector('span').offsetHeight
// 21
```



### 参考链接

 [display的32种写法](https://segmentfault.com/a/1190000012833458)

[我所知道的几种display:table-cell的应用](https://www.zhangxinxu.com/wordpress/2010/10/我所知道的几种displaytable-cell的应用/)

