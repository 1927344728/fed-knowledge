# 由z-index引发的层叠上下文思考

**CSS** 通常被简称为样式或者样式表，而 CSS 其实是 `Cascading Style Sheets` 的缩写，翻译为**层叠样式表**。这里的**层叠**是 CSS 的一个基本特征，也是 CSS 的一个核心概念，它定义了合并来自多个源的属性值的算法。

此外，CSS 中还有另一个层叠的概念——层叠上下文，它是三维空间 Z 轴上，元素盒子之间的层叠。这里的**层叠**，意味着可覆盖，用户只能够看到 Z 轴上最上层的东西，开发者必须将最终要的东西放在最上层，让用户能够一眼就看到。

#### Cascading

层叠样式表中的层叠（Cascading），可以翻译为**级联**。

CSS 定义了三种可能的样式表来源：开发者、读者和浏览器，它们的作用范围是重叠的，而层叠则就是定义它们如何相互作用的算法，它决定如何找出要应用到每个文档元素的每个属性上的值。

层叠顺序如下：

* 首先，过滤来自不同源的全部规则，只保留要应用到当前页元素的那些规则。

* 其次，它依据重要程度对这些规则进行排序。重要程度指的是规则后面是否跟随者 `!important` 以及规则的来源，重要程度按升序排序如下：

  * 用户代理（浏览器）；

  * 读者：即浏览网页的用户，他们可以通过浏览器提供的接口为网站添加读者样式；

  * 开发者；

  * CSS 动画：`@keyframes` 定义状态的动画。`@keyframes` 定义的值会覆盖全部普通值，但会被 `!important` 的值覆盖。

    **注意：** `@keyframes` 不参与层叠，即任何时候 CSS 都是取单一的 `@keyframes` 的值，而不会是某几个 `@keyframe`的混合。如果有多个满足条件的关键帧时，来源最重要的样式表定义的 `@keyframes` 会被选中。

  * 开发者 + !important；

  * 读者 + !important；

  * 用户代理（浏览器） + !important；

  * CSS 过渡（transitions）。

* 假如层叠顺序相等，则使用哪个值取决于优先级（详见[CSS 优先级算法如何计算？](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/css-tan-suo-xi-lie/00css-chang-jian-wen-da#css-you-xian-ji-suan-fa-ru-he-ji-suan)）。

**特别注意：** 层叠算法是先于优先级是两个不同概念，层叠算法是先于优先级算法的。比如：即使读者定义的规则有更高的优先级，CSS 也会优先选择开发者定义的样式。

**注意：** **标记为 `!important` 样式，读者样式比开发者样式重要。**这实际上这是 CSS 提供的一个很好的选择机制，也就是说，通常情况下，开发者样式会拥有最大的权重，但是用户拥有最终的选择权，可以通过 `!important` 覆盖任何样式。

#### Stacking

层叠上下文中的层叠（Stacking），可以翻译为**堆叠**，指的是盒子在 Z 轴上的位置与盒子之间的重叠关系。在 CSS 2.1中，每一个盒子处在三维空间中，除了水平轴和垂直轴外，还有一个 Z 轴，这三个轴共同决定了盒子在三维空间中的位置。  

层叠上下文中，更**靠近用户**的元素优先被读者看到——更**靠近用户**，可理解为在 Z 轴的层级更高。

### 对应的英文名词解释

英文名词翻译为中文名词容易产生歧义，以下列出本文涉及的名词对应的英文名词：

* **非定位元素：** Non-positioned Element，也就是 `position: static` 元素；

* **定位元素**：Positioned Element，也就是 `position: relative|absolute|fixed|sticky ` 元素；

* **盒子**：box，也称盒模型。文档树由元素组成，渲染树由盒子组成，实际元素大小、布局渲染操作的对象是盒子而不是元素。在构造渲染树时会为每个元素生成对应的盒子。**但盒子不一定全部由元素生成，**如：匿名盒子（anonymous box）不是由元素对应生成，而是渲染器根据规则自动生成。

* **非/定位盒子**： Non-positioned/Positioned Element，非定位元素对应的是非定位盒子，定位元素对应的是定位盒子。

* **层叠上下文：** Stacking Context，也称堆叠上下文，Z 轴的基本组成单位。层叠上下文与盒子的映射关系为 `1:N`，即每个层叠上下文可以有 N 个盒子。每个层叠上下文有一个父层叠上下文（除根层叠上下文）和 `0~N` 个子层叠上下文。

* **根层叠上下文：** Root Stacking Context，根盒子（`html|body`对应的盒子）对应的层叠上下文，是其他层叠上下文的祖先上下文，根层叠上下文的范围覆盖整条 Z 轴。

* **层叠等级：** Stack Level，也有称层叠水平、层叠层级，当 N 个盒子位于同一个层叠上下文中，则通过层叠等级来决定它们位于 Z 轴上的位置。

* **层叠顺序：** Stacking Order，表示元素发生层叠时特定的垂直**显示**顺序。

### 一切从 z-index 开始

CSS 的 z-index 的理解容易陷入一个误区：`z-index` 属性值大的元素会覆盖 `z-index` 属性值小的元素，更致命的是，在日常开发中，我们看到的表现也大抵如此，这也造成我们忽略一个重要——层叠上下文。

先看一个简单示例：

![image-20220118205853233](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220118205853233.png)

```html
<section>
    <div style="position: relative; background: red; z-index: 10;">
        <p style="position: relative; background: orange; z-index: -999;"></p>
    </div>
    <div style="position: relative; background: darkviolet; z-index: 8;"></div>
    <div style="position: relative; background: darkturquoise; z-index: 9;"></div>
</section>
```

 [一个简单的 z-index DEMO](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=1)

如果按 z-index 来比较，层级排序应该是：红色（10） > 青色（9） > 紫色（8） > 橙色（-999） ，而实际上，前三者的表现也正是如此，唯独橙色（-999）——这个本该在无尽深渊的元素，一举超出其他元素，高居在上。

这种现象就跟本文的主角——层叠上下文有关了：

首先，走出上述 z-index 的误区，正确理解是：<b style="color: #0aa;">同一个层叠上下文的 z-index 才具有可比性。</b>

对于定位元素而言，若 `z-index` 属性值不是 `auto`，则会创建一个新的层叠上下文，并且其子孙盒子将属于这个新层叠上下文，因此，橙色（-999）实际是跟父盒子在同一层叠上下文，它比青色（9）、紫色（8） 更靠近用户。

`z-index` 只是层叠上下文中的一个属性而已，准确理解 `z-index`，实质上就是要理解**层叠上下文**。

### 什么层叠上下文？

**层叠上下文**（Stacking context）是 HTML 中的一个三维的概念，是指一个独立的环境，与块级上下文类似（BFC），即层叠上下文内的盒子都被限制了，它们的在 Z 轴的位置不受外面其他层叠上下文的影响，也不影响外面的其他层叠上下文。

在 CSS2.1 规范中，每个盒模型的位置是三维的，分别是平面画布上的 X 轴、Y 轴，以及表示层叠的  Z 轴。X 轴指向屏幕的右边，Y 轴指向屏幕的底部，Z 轴的方向指向读者。

![z-axis](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/zindex-z-axis.jpg)



一般情况下，元素在页面上沿 X 轴、Y 轴平铺，我们察觉不到它们在  Z 轴上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。

### 什么是层叠规则？

层叠规则决定了到底哪个盒子更靠近用户：

* 同一个层叠上下文，两个有同级层叠上下文的盒子，**z-index 属性值大的盒子更靠近用户。**
* 同一个层叠上下文，有层叠上下文的盒子平比普通元素的盒子更靠近用户。
* 同一个层叠上下文且 `z-index` 相同的盒子，对应元素在文档中**后者比前者的更靠近用户**。

* 不同的层叠上下文，并且层叠上下文没有祖孙/父子关系的两个盒子，会向上沿着父盒子进行搜索，直到两者父盒子属于同一个层叠上下文为止，然后比较父盒子的 `z-index` 属性值，`z-index` 属性值大的盒子更靠近用户。
* 不同的层叠上下文，并且层叠上下文为祖孙/父子关系，**子层叠上下文的盒子必定更靠近用户。**

### 什么是层叠等级?

层叠等级（Stack Level），也有译为层叠水平、层叠层级。它描述了**元素在当前层叠上下文中 Z 轴上的顺序**。

* 所有的元素都有层叠等级，包括层叠上下文元素、普通元素。
* **层叠等级的比较只有在当前层叠上下文元素中才有意义。**
* **不要将层叠等级和 z-index 属性混为一谈：** `z-index` 只影响定位元素以及 Flex 盒子的子元素；而层叠等级所有的元素都有的。

### 什么是层叠顺序？

层叠顺序（Stacking Order）表示元素发生层叠时特定的垂直**显示**顺序。

**注意：** 层叠上下文和层叠等级是概念，而**层叠顺序是规则**。

在 HTML 文档中，默认情况之下有一个自然层叠顺序（`Natural Stacing Order`），即元素在 Z 轴上的顺序。元素盒子放入层叠上下文的顺序，从层叠的底部开始，共有七种层叠等级（由低到高）：

![zindex-order](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/zindex-order.jpg?v=1)

- **背景和边框**：形成层叠上下文的元素的背景和边框；
- **负 z-index 值**：层叠上下文内有着负 `z-index` 值的定位元素；
- **块级盒**：层叠上下文内的非定位块级元素；
- **浮动盒**：层叠上下文内的非定位浮动元素；
- **行内盒**：层叠上下文内的非定位内联元素—— `inline|inline-block` 元素等级要高于 `block|float` 元素；
- **普通层叠上下文**：`z-index:0|auto `  的定位元素的层叠上下文，或者不依赖于 `z-index` （如：`opacity:0.9` ）的层叠上下文。
- **正 z-index 值**：层叠上下文内有着正 `z-index` 值的定位元素。

**注意：** `z-index: 0` （创建了层叠上下文）的元素、 `z-index: auto` （不创建层叠上下文）的元素、不依赖于 `z-index` 的层叠上下文的元素，这三者的层叠顺序是一样的，遵循**后者比前者更靠近用户**的层叠规则。

### 如何创建层叠上下文？

一个简单的示例：尝试把红色元素放到其他两个元素后面，但是必须遵守下面的规则 [点击试试？](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=2)：

- 不能修改 HTML 中元素的顺序；
- 不能增加或修改任何元素的 `position`  和 `z-index` 属性；

![image-20220502204544140](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220502204544140.png)

```html
<div> <p style="position: relative; background: red; z-index: 1;"></p> </div>
<div> <p style="position: relative; background: darkviolet;"></p> </div>
<div> <p style="position: relative; background: darkturquoise;"></p> </div>
```

[创建层叠上下文 DEMO](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=2)

你想到解决方法了吗？

其实很简单，你只需要给第一个 div 标签的  `opacity` 属性加一个小于 1 的值。注意：这里说的是第一个 **div** 标签，不是 p 标签。

```html
<div style="opacity: 0.99;">
    <p style="position: relative; background: red; z-index: 1;"></p>
</div>
<div> <p style="position: relative; background: darkviolet;"></p> </div>
<div> <p style="position: relative; background: darkturquoise;"></p> </div>
```

原理解释：一开始有两个层叠上下文，一个由根节点产生，一个由红色的 P 标签产生。当我们给第一个 div 设置 `opacity: 0.99` 时，产生了第三个层叠上下文，并且会把红色的 P 标签提到这个层叠上下文。也就是说，现在的层级比较是红色 div 标签和下面两个 p 标签，由于第一个 div 创建的是不依赖 `z-index` 的层叠上下文，而其他两个元素 p 标签是 `z-index: auto` 的层叠上下文，它们的等级是一样的。按层叠顺序，**文档中后面出现的更靠近用户**，即两个元素 p 标签在 Z 轴位置都比第一个 div 标签及其子标签更高。

**特意注意：** 第一个 div 的层级只是比后两个 p 标签低，但它仍然比后面两个 div 标签更高。

我们把 P 删除，给 div 加上边框，效果显示如下：

![image-20220118234150779](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220118234150779.png)

```html
<div style="border: 1px solid red;"></div>
<div style="border: 1px solid darkviolet;"></div>
<div style="border: 1px solid darkturquoise;"></div>
```

[创建层叠上下文 DEMO2](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=3)

当然，以上问题，`opacity: 0.99` 并不是唯一的方法，关键是掌握**层叠上下文是如何创建**的。

满足以下任意一个条件的元素：

- 文档根元素（html）；
- `position: relative|absolute|fixed` 且 `z-index` 值不为 `auto` 的元素；
- `position: fixed|sticky` 元素，**注意：**CSS2 中，`position: fixed` 必需设置 `z-index` 为非 0 值 ，而 CSS3 中只要设置 `fixed` 就会创建层叠上下文；
- `opacity` 属性值小于 `1` 的元素；
- 以下任意属性值不为 `none` 的元素：`transform`、`filter`、`perspective`、`clip-path`、`mask/mask-image/mask-border`；
- `flex` 容器的子元素，且 `z-index` 值不为 `auto`；
- `grid` 容器的子元素，且 `z-index` 值不为 `auto`；
- `mix-blend-mode` 属性值不为 `normal` 的元素；
- `isolation `属性值为 `isolate` 的元素；
- `-webkit-overflow-scrolling` 属性值为 `touch` 的元素；
- `will-change` 值设定了任一属性而该属性在 ` non-initial ` 值时会创建层叠上下文的元素；
- `contain` 属性值为 `layout`、`paint` 或包含它们其中之一的合成值（比如 `contain: strict`、`contain: content`）的元素。

**注意： 前面两条是 CSS2 的创建方法，后面的都是 CSS3 新增的**。

层叠上下文还有以下特性：

- 层叠上下文可以包含在其他层叠上下文中，并且受该层叠上下文限制；
- 每个层叠上下文都完全独立于它的兄弟元素；
- 每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

**注意：** 层叠上下文的层级是 HTML 元素层级的一个子级，因为只有某些元素才会创建层叠上下文。可以这样说，**没有创建自己的层叠上下文的元素会被父层叠上下文同化。**

### z-index 在层叠中起什么作用呢？

从 z-index 开始，也从 z-index 结束吧！

简单来说，`z-index` 只有一个作用：**修改定位盒子在其所属的层叠上下文中的层叠等级。** 前面所说的，所有元素都有层叠等级，`z-index` 就是修改定位元素的层叠等级。

`z-index` 有以下的特性：

*  **z-index 属性值仅对定位盒子生效，而非定位盒子永远是 z-index: auto；**

*  `z-index` 属性值不为 `auto`，则会创建一个新的层叠上下文，并且其子孙盒子将属于这个新层叠上下文；

* `z-index` 属性值为 `auto`，盒子不会创建一个新的本地层叠上下文，其层叠等级和父级盒子相同；

  > 这个是 CSS3 标准，也有如下说法（可能是css2）：
  >
  > 对于具有 `z-index：auto` 的盒子，将其视为已创建新的层叠上下文，但是该层叠上下文的后代应视为父级层叠上下文的一部分，而不是此新层叠上下文的一部分。 
  
* **同一个层叠上下文的 z-index 才具有可比性：** 常说的，`z-index` 越大层叠等级越高，是基于在同一层叠上下文内的。

* `z-index` 可以设置为负值。值为负的盒子比较特殊，它们会先被绘制，意味着它们可以出现在其它盒子的后面，包括父盒子。但是必要条件是该盒子必须与父盒子处于同一层叠上下文，并且父盒子不是这个层的根盒子。

#### 示例：z-index 仅对定位盒子生效

如：将第一 DEMO 中的 `position: relative` 都删除，你会发现所有的 `z-index` 值都失效了：

![image-20220119001039553](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220119001039553.png)

```html
<section>
    <div style="background: red; z-index: 10;">
        <p style="background: orange; z-index: -999;"></p>
    </div>
    <div style="background: darkviolet; z-index: 8;"></div>
    <div style="background: darkturquoise; z-index: 9;"></div>
</section>
```

当然，改成 `position: absolute|fixed|sticky `，`z-index` 也是有效的，不过它们的表现行为是不一样的，且有各自的特性。 

#### 示例：z-index 值为 auto 和 0 的区别

`z-index: 0` 和 `z-index: auto` 单纯从层叠等级上看，是可以看成是一样的。注意这里的措辞——**“单纯从层叠等级上看”，**实际上，两者在层叠上下文领域有着根本性的差异。

如图所示：红色 p 标签位于紫色 p 标签的上方。这个似乎没什么问题？毕竟红色 p 标签的 `z-index` 值大于紫色 p 标签！

![image-20220119001833920](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220119001833920.png)

```html
<div style="z-index: auto;">
    <p style="position: relative; background: red; z-index: 2;"></p>
</div>
<div style="z-index: auto;">
    <p style="position: relative; background: darkviolet; z-index: 1;"></p>
</div>
```

[查看  auto 和 0 的区别 DEMO](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=4)

接下来，我们把 div 标签中 `z-index: auto` 改为 `z-index: 0`：

![image-20220119001907951](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220119001907951.png)

```html
<div style="z-index: 0;">
    <p style="position: relative; background: red; z-index: 2;"></p>
</div>
<div style="z-index: 0;">
    <p style="position: relative; background: darkviolet; z-index: 1;"></p>
</div>
```

结果：紫色的 p 标签位于红色 p 标签的上方。

按照前面的【层叠规则】和【 z-index 的特性】解释下：

`z-index: auto` 不会创建层叠上下文，所以两个 p 标签属于同一层叠上下文，谁的 `z-index` 值大，谁就更靠近用户。

`z-index: 0` 会为两个 div 标签创建新的层叠上下文，并且 p 标签会属于各自的父层叠上下文。如此，这两个 p 标签就没有可比性了，它们的层叠等级取决于父层叠上下文，即 div 的层叠上下文，而两个 div 的层叠上下文的等级是一样的，所以，最后遵循**后者比前者更靠近用户**的规则。

### 常见问题

#### 为什么建议给 absolute 元素加 z-index？

![image-20220119003825984](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20220119003825984.png)

```html
<section class="box_05">
    <p>影斑驳，叶落纷纷，一路的繁华，消瘦在秋风里。</p>
    <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/s730j6s0dg6zk.jpg">
</section>
<style>
    .box_05 { width: 300px; position: relative; }
    .box_05 > img { display: block; width: 100%; }
    .box_05 > p {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 10px;
        margin: 0;
        background: rgba(255, 255, 255, 0.8);
        opacity: 1;
    }
</style>
```

[试一试？修改图片透明度](https://1927344728.github.io/demo-lizh/html/05-z-index.html?type=5)

当我们给图片添加透明度动画时，将图片的 `opacity` 属性值设置为小于 1（如：0.99），则图片会遮掉文本。因为，img 标签创建了新层叠上下文（`opacity: 0.99`），且该层叠上下文与 p 标签创建的层叠上下文（`z-index: auto`）同级，遵循层叠顺序规则，**后者比前者更靠近用户**。

当然，z-index 不是必需的，如果你完全理解了层叠上下文，并且代码风格良好，你可以忽略它。

#### IE6/7的诡异行为

IE6~7 浏览器中，只要是定位元素就会创建层叠上下文， 就算`z-index:auto`也会。

### 参考链接

[CSS魔法堂：你真的理解z-index吗？](https://www.cnblogs.com/fsjohnhuang/p/4333164.html)

[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

[CSS 开发者指南-层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)