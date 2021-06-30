# 由z-index引发的层叠上下文思考

 **CSS** 是 `Cascading Style Sheets`的缩写，翻译为**层叠样式表**。这里的**层叠**是`css`的一个基本特征，它是一个定义了如何合并来自多个源的属性值的算法。它在CSS处于核心地位。

而本文讲的**层叠上下文**是三维空间Z轴上与层叠相关的概念。这里的**层叠**，意味着可覆盖，用户只能够看到最上层的东西，开发者必须将最终要的东西放在最上面，让用户能够一眼就看到。



这两个层叠的简述：

#### Cascading

这个层叠，也可以翻译为**级联**，指的是[样式的优先级](https://www.w3ctech.com/topic/1519)，定义了如何合并来自多个源的属性值的算法。

浏览器要显示元素时求索一个 CSS 属性值的次序：

- 元素内嵌样式
- 文档内嵌样式
- 外部样式表
- 用户样式
- 浏览器样式

#### Stacking

在CSS 2.1中，每一个盒子处在三维空间中。除了水平轴和垂直轴外，还有一个z轴（z-axis），这三个轴共同决定了盒子在三维空间中的位置。  

这个层叠，也可以翻译为**堆叠**，指的是盒子在z轴上的位置与盒子之间的重叠关系。



### 英文名词解释与概述

由于将英文名词翻译为中文名词容易产生歧义（如`Normal flow`被翻译为文档流、普通流、常规流等）。因此将`Stacking`涉及的一些英文名词解释如下：

* **non-positioned element**：非定位元素。也就是`position: static`的元素。

* **positioned element**：定位元素。也就是`position: relative/absolute/fixed/sticky `的元素。

* **box**：盒子。文档树由元素组成，渲染树由盒子组成，实际进行元素大小、布局渲染操作的对象是盒子进行而不是元素。

  在构造渲染树时会为每个元素生成对应的盒子。**但盒子不一定全部由元素生成，**如：`anonymous box`不是由元素对应生成，而是渲染器根据规则自动生成。

* **non-positioned / positioned element**：（非）定位盒子。非定位元素对应的是非定位盒子。定位元素对应的是定位盒子。

  **z-axis**：`box`定位坐标系中的z轴。

* **stacking context：层叠上下文，**z轴的基本组成单位。层叠上下文与盒子的映射关系为1:N，即每个层叠上下文可以有N个盒子。

  每个层叠上下文有一个父层叠上下文（除了`root stacking context`外）和0~N个子层叠上下文。

* **root stacking context：根层叠上下文。**与根盒子（`html/body`对应的盒子）对应的层叠上下文，是其他层叠上下文的祖先上下文，根层叠上下文的范围覆盖整条z轴。

* **stack level：层叠等级。**当N个盒子位于同一个层叠上下文中，则通过层叠等级来决定它们位于z轴上的位置。

* **stacking Order：层叠顺序。**表示元素发生层叠时候有着特定的垂直显示顺序。



### 一切从z-index开始

以上名词的具体介绍，后面会提及。此文的起因是`z-index`，我就从`z-index`开始吧。

大家可能都熟悉CSS中的`z-index`属性，需要跟大家讲的是，`z-index`实际上只是CSS层叠上下文和层叠等级中的**一叶小舟**。

`z-index`只是层叠等级中的一个属性而已，而理解`z-index`背后的原理实质上就是要理解层叠上下文。看一下下面示例：

![image-20200505152727176](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200505152727176.png)

```html
<section class="wrap_1">
    <div><p></p></div>
    <div></div>
    <div></div>
</section>
<style>
    .wrap_1 > div {
        position: relative;
        padding: 5px;
        border-bottom: 1px solid #a0a;
        min-height: 100px;
    }
    .wrap_1 > div:nth-child(1) {
        background: #f00;
        z-index: 10;
    }
    .wrap_1 > div:nth-child(1) p {
        min-height: 80px;
        margin-top: 40px;
        background: #fa0;
        z-index: -999;
    }
    .wrap_1 > div:nth-child(2) {
        margin: -30px 0 0 30px;
        background: #a0a;
        z-index: 8;
    }
    .wrap_1 > div:nth-child(3) {
        margin: -30px 0 0 60px;
        background: #0aa;
        z-index: 9;
    }
</style>
```

在构造渲染树时，三个`div`元素生成三个盒子，按先后顺序做个标记：`div_1_box、div_2_box、div_3_box`，`p`元素生成`p_box`。

对比这三个盒子的`z-index`：`div_1_box > div_3_box > div_2_box`。正如我们所看到，第一个`div`比其它两个更靠近用户，第三个`div`比第二个更靠近用户。

**靠近用户：**可理解为元素在更上层，观察者优先看到。这个跟层叠等级有关，没那么简单，后面会讲到。

关键来了：**为什么p_box的`z-index: -999`，它会比div_2_box、div_3_box更靠近用户？**

**这就跟层叠上下文有关了。**

* 对于定位元素而言，若`z-index`属性值不是`auto`，则会创建一个新的层叠上下文，并且其子孙盒子将属于这个新层叠上下文。

* **同一个层叠上下文的z-index才具有可比性。**

三个`div`元素是属于同一层叠上下文的，所以谁的`z-index`值大，谁就更靠近用户。而`p_box`虽然设置的`z-index`比`div_2_box、div_3_box`的小，但它属于第一个`div`元素创建的层叠上下文，与其他两个`div`不在同一层叠上下文。因此，它们中谁更靠近用户，并不是通过`z-index`简单对比决定的。

### 层叠规则决定哪个盒子更靠近用户

层叠规则决定了到底哪个盒子更靠近用户，四个规则如下：

1. 盒子属于同一个层叠上下文且`z-index`相同：

   按照盒子对应的元素在文档树的顺序，**后者比前者更靠近用户。**

2. 盒子属于同一个层叠上下文，但`z-index`不同：

   **z-index属性值大的盒子更靠近用户。**

3. 盒子属于不同的层叠上下文，并且层叠上下文没有祖孙/父子关系：

   盒子会向上沿着父盒子进行搜索，直到父盒子属于同一个层叠上下文为止，然后比较父盒子的`z-index`属性值，`z-index`属性值大的盒子更靠近用户。

4. 盒子属于不同的层叠上下文，并且层叠上下文为祖孙/父子关系。

   **子层叠上下文的盒子必定更靠近用户。**

### z-index在层叠中起什么作用呢

简单来说，`z-index`只有一个作用：**设置盒子在其所属的层叠上下文中的层叠等级。**`z-index`本身是很简单的，这也是为什么前文说，`z-index`只是层叠的一叶小舟。

理解`z-index`，就要先了解下它的特性：

*  **`z-index`属性值仅对定位盒子生效，而非定位盒子的`z-index`永远为auto。**

*  `z-index`属性值不为`auto`，则会创建一个新的层叠上下文，并且其子孙盒子将属于这个新层叠上下文。

* `z-index`属性值为`auto`，盒子不会创建一个新的本地层叠上下文。在当前层叠上下文中生成的盒子的层叠层级和父级盒子相同。

  > 这个是css3标准。也有说法（可能是css2）：
  >
  > 对于具有`z-index：auto`，将其视为已创建新的堆栈上下文，但是任何定位的后代和实际创建新堆栈上下文的后代均应视为父级堆栈上下文的一部分，而不是此新堆栈上下文的一部分。 
  
* **同一个层叠上下文的z-index才具有可比性**。常说的，`z-index`越大层叠等级越高，并不准确。这是基于在同一层叠上下文的前提条件下。

* `z-index`可以设置为负值。值为负的盒子比较特殊，它们会先被绘制，意味着它们可以出现在其它盒子的后面，包括父盒子。但是必要条件是该盒子必须与父盒子处于同一层叠上下文，并且父盒子不是这个层的根盒子。

为更好的理解`z-index`，下面举两个例子：

#### z-index仅对定位盒子生效

将上面示例代码中的`div`的`position: relative`注释，你会发现所有的`z-index`值都失效了：

![image-20200505183646658](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200505183646658.png)

```css
.wrap_1 > div {
    /*position: relative;*/
    padding: 5px;
    border-bottom: 1px solid #a0a;
    min-height: 100px;
}
```

当然，将`relative`改成`absolute/fixed/sticky `，`z-index`也是有效的，不过它们的表现行为是不一样的，且有各自的特性。 [Position属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

#### z-index值为auto和0的区别

`z-index:0`实际上和`z-index:auto`单纯从层叠等级上看，是可以看成是一样的。注意这里的措辞——**“单纯从层叠等级上看”，**实际上，两者在层叠上下文领域有着根本性的差异。

如图所示：红色`<p>`元素位于紫色`<p>`元素的上方。这个似乎没什么问题？毕竟红色`<p>`元素的`z-index`值大于紫色的！

![image-20200505165644435](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200505165644435.png)

```html
<section class="wrap_2">
    <div style="z-index: auto;"><p></p></div>
    <div style="z-index: auto;"><p></p></div>
</section>
<style>
    .wrap_2 > div {
        position: relative;
    }
    .wrap_2 > div > p {
        position: relative;
        min-height: 100px;
    }
    .wrap_2 > div:nth-child(1) > p {
        margin: 0 0 -30px 30px;
        background: #f00;
        z-index: 2;
    }
    .wrap_2 > div:nth-child(2) > p {
        background: #a0a;
        z-index: 1;
    }
</style>
```

接下来，我们把`div`标签中`z-index: auto`改为`z-index: 0`：

![image-20200505170148154](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200505170148154.png)

```html
<!--把`z-index: auto`改为`z-index: 0`-->
<section class="wrap_2">
    <div style="z-index: 0;"><p></p></div>
    <div style="z-index: 0;"><p></p></div>
</section>
```

结果反过来了：紫色的`<p>`元素位于红色的上方。

按照前面的【层叠规则】和【 `z-index`的特性】解释下：

`p`元素的div设置了`z-index`为`auto`，不会创建层叠上下文。所以两个`<p>`元素属于同一层叠上下文，谁的`z-index`大，谁就更靠近用户。

由于`div`本身是定位元素，div的`z-index`改为`0`后，会创建新的层叠上下文，并且`p`元素会属于这个新建层叠上下文。如此，这两个`<p>`元素就不在同一层叠上下文了，没有了可比性。不过，事情还没完，虽然它们已经无法对战，但它们的父标签`div`可以决出胜负。由于`div`属于同一层叠上下文且`z-index`相同，遵循**后者比前者更靠近用户**的规则，紫色`p`元素的`div`赢了，它更靠近用户。



`z-index`的内容到这里就结束了。

但，对于【层叠】来说，`z-index`只是一小部分。前文中也有许多地方提到层叠上下文、层叠等级等，你可以接着往下看。。。



先了解层叠的一些重要概念：

### 什么层叠上下文？

**`stacking context`，通常翻译为层叠上下文，是 HTML 中的一个三维的概念**，特性类似于**BFC**。即层叠上下文的内部子元素再怎么折腾，它们都跳不出层叠上下文的限制，不会影响外部的元素。这有点像，孙猴子有七十二般变化、一个筋头十万八千里，但他逃不出如来佛的手掌心。

![z-axis](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/zindex-z-axis.jpg)

在CSS2.1规范中，每个盒模型的位置是三维的，分别是平面画布上的`X轴`，`Y轴`以及表示层叠的`Z轴`。`x`轴指向屏幕的右边，`y`轴指向屏幕的底部，`z`轴的方向指向查看者。

一般情况下，元素在页面上沿`X轴Y轴`平铺，我们察觉不到它们在`Z轴`上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。

> 如果一个元素含有层叠上下文，我们可以理解为这个元素在`Z轴`上就“高人一等”，并且最终表现就是它离屏幕观察者更近，也就是前面说的**更靠近用户**。

### 什么是层叠等级?

`Stack Level`，通常翻译为层叠等级，也有译为层叠水平。它决定了**同一个层叠上下文中元素在`z`轴上的显示顺序**。

注意以下几点：

* 所有的元素都有层叠等级，包括层叠上下文元素，普通元素的层叠等级优先由层叠上下文决定。
* **层叠等级的比较只有在当前层叠上下文元素中才有意义。**
* 千万不要把**层叠等级和CSS的`z-index`属性混为一谈**。`z-index`只影响定位元素以及`Flex`盒子的孩子元素；而层叠等级所有的元素都存在。

### 什么是层叠顺序？

`stacking order`，通常翻译为层叠顺序，表示元素发生层叠时候有着特定的垂直显示顺序。

注意：这里跟上面两个不一样，上面的层叠上下文和层叠等级是概念，而这里的**层叠顺序是规则**。

在HTML文档中，默认情况之下有一个自然层叠顺序（`Natural Stacing Order`），即元素在`z`轴上的顺序。它是由许多因素决定的。比如下图，它显示了元素盒子放入层叠上下文的顺序，从层叠的底部开始，共有七种层叠等级：

![zindex-order](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/zindex-order.jpg?v=1)

- **背景和边框**：形成层叠上下文的元素的背景和边框。 层叠上下文中的最低等级。
- **负`z-index`值**：层叠上下文内有着负z-index值的子元素。
- **块级盒**：文档流中非行内非定位子元素。
- **浮动盒**：非定位浮动元素。
- **行内盒**：文档流中行内级别非定位子元素。
- **`z-index: 0|auto `**的定位元素或者**不依赖于`z-index`的层叠上下文**（比如：`opacity`小于1等）。
- **正`z-index`值**：定位元素。 层叠上下文中的最高等级。

这里，我们要关注的信息是：

1. 层叠上下文的元素的背景和边框等级最低，正`z-index`值的定位元素等级最高。
2. `inline/inline-block`元素等级要高于`block`(块级)/`float`(浮动)元素。
3. 不创建层叠上下文`z-index: auto`元素、不依赖于`z-index`的层叠上下文的元素与`z-index:0`创建了层叠上下文的元素，它们的层叠顺序是一样的，遵循**后者比前者更靠近用户**的层叠规则。它们的等级都比块级元素、浮动元素、行内元素更高。

### 层叠上下文的创建

来做一个小的测试：如果你无法实现，或者对以下的实现方法不理解，那么恭喜你，即将学习新的技能。

**问题：**尝试把红色的元素放到其他两个元素后面，但是必须遵守下面的规则 [点击试试？](https://1927344728.github.io/frontend-knowledge/demo/10-z-index.html?type=3)：

- 不能修改HTML中元素的顺序
- 不能增加或修改任何元素的`z-index`属性
- 不能增加或修改任何元素的`position`属性

![image-20200505212244123](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200505212244123.png)

```html
<section class="wrap_3">
    <div><p></p></div>
    <div><p></p></div>
    <div><p></p></div>
</section>
<style>
    .wrap_3 > div > p {
        position: relative;
        min-height: 100px;
    }
    .wrap_3 > div:nth-child(1) > p{
        background: #f00;
        z-index: 1;
    }
    .wrap_3 > div:nth-child(2) {
        margin: -30px 0 0 30px;
    }
    .wrap_3 > div:nth-child(2) > p{
        background: #a0a;
    }
    .wrap_3 > div:nth-child(3) {
        margin: -30px 0 0 60px;
    }
    .wrap_3 > div:nth-child(3) > p{
        background: #0aa;
    }
</style>
```

你想到解决方法了吗？

其实很简单，你只需要给第一个div标签加`opacity`小于`1`。**注意：这里说的是第一个div标签，不是p标签**

![image-20200506235557729](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200506235557729.png)

```html
<div class="wrap_3">
    <div style="opacity: .99;"><p></p></div>
    <div><p></p></div>
    <div><p></p></div>
</div>
```

原因是：`opacity`值小于1的元素，会创建一个层叠上下文。

讲到这里，你可能会问，为什么为`opacity`值小于1会创建层叠上下文。这个没有为什么——**这是css3的渲染机制**（css2中没有）。

接下来，你可能又会问了：我知道创建了层叠上下文啊，可跟红色的`<p>`跑下面有什么关系？

原因是：

一开始有两个层叠上下文，一个由根节点产生，一个由设置了`z-index:1`并且`position: relative`的红色`<p>`产生。

当我们给第一个div设置`opacity`小于1时，产生了第三个层叠上下文，并且会把子元素`<p>`提到这个层叠上下文，意味着`<p>`的`z-index`的作用域只在这个层叠上下文里面。而第一个div创建的是不依赖`z-index`（不指定`z-index`）的层叠上下文，它与其他两个定位元素`<p>`的等级是一样的。在层叠顺序按照在文档出现顺序排列，于是这个div在最后面。

这里要注意一点：**设置`opacity`小于1的div，是位于其他两个div的上面的。**

我们把`p`元素去删了，给div加上边框：

![image-20200507214842574](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200507214842574.png)

```html
<section class="wrap_4">
    <div style="opacity: 0.99;"></div>
    <div></div>
    <div></div>
</section>
<style>
    .wrap_4 > div {
        min-height: 100px;
        background: #fff;
    }
    .wrap_4 > div:nth-child(1) {
        border: 1px solid #f00;
    }
    .wrap_4 > div:nth-child(2) {
        margin: -30px 0 0 30px;
        border: 1px solid #a0a;
    }
    .wrap_4 > div:nth-child(3) {
        margin: -30px 0 0 60px;
        border: 1px solid #0aa;
    }
</style>
```

设置了`opacity`小于1的div，属于不依赖`z-index`的层叠上下文，遵守层叠顺序**（具体查看上一节【层叠顺序】）**，它的层叠等级比其他两个div块级元素高。



最后，你需要掌握以下内容：**层叠上下文，什么时候会被创建？**

满足以下任意一个条件的元素，[信息来源：mozilla -> css开发者指南](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)：

- 文档根元素`<html>`

- `position`值为 `relative | absolute | fixed`且z-index值不为 `auto` 的元素

- `position`值为 `fixed | sticky`的元素

  **注：**css2中，`position: fixed`必需设置z-index为非0值 ，而css3中只要设置fixed就会创建

- `flex`容器的子元素，且`z-index`值不为 `auto`

- `grid`容器的子元素，且`z-index`值不为 `auto`

- `opacity`属性值小于 `1` 的元素

- `mix-blend-mode`属性值不为 `normal` 的元素

- 以下任意属性值不为none的元素：

  - `transform`
  - `filter`
  - `perspective`
  - `clip-path`
  - `mask/mask-image/mask-border`

- `isolation`属性值为 `isolate` 的元素

- `-webkit-overflow-scrolling`属性值为 `touch` 的元素

- `will-change`值设定了任一属性而该属性在` non-initial `值时会创建层叠上下文的元素

- contain属性值为 `layout`、`paint` 或包含它们其中之一的合成值（比如 `contain: strict`、`contain: content`）的元素。

**注意：前面两条是CSS2的创建方法，后面的都是css3新增的**。

总结：

- 层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
- 每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
- 每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

> **Note:** 层叠上下文的层级是 HTML 元素层级的一个子级，因为只有某些元素才会创建层叠上下文。可以这样说，**没有创建自己的层叠上下文的元素会被父层叠上下文同化。**



### 常见问题

#### 为什么建议给absolute元素加z-index

比如下面代码 [点击查看](https://1927344728.github.io/frontend-knowledge/demo/10-z-index.html?type=5)：

```html
<section class="wrap_5">
    <p>影斑驳，叶落纷纷，一路的繁华，消瘦在秋风里。</p>
    <img src="../images/demo/s730j6s0dg6zk.jpg">
</section>
<style>
    .wrap_5 {
        width: 300px;
        position: relative;
    }
    .wrap_5 > img {
        display: block;
        width: 100%;
    }
    .wrap_5 > p {
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

当给`img`加类似`opacity/transform`等属性，会发生一个奇怪现象。如下图：将`<img>`的`opacity`设置为0.99后，图片将绝对定位的文本遮掉了。这是因为，`img`创建了不依赖`z-index`的层叠上下文，它与`z-index`为`auto`的`<p>`同级，遵循层叠顺序规则，`img`的层级更高。

**~~如果你已经掌握了层叠并且代码风格有良好规范，你可以忽略`z-index`。~~**

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/demo/zindex-absolute.jpg?v=1)

#### IE6/7的诡异行为

IE6/IE7浏览器中，只要是定位元素就会创建层叠上下文， 就算`z-index:auto`也会。



### 总结

- 属于同一层叠上下文的元素（无论它们在结构上是兄弟或父子，甚至是祖孙），都遵循上文所述的层叠顺序；
- 不同的层叠上下文之间，层级较大的层叠上下文元素及其内部元素位于层级小的层叠上下文元素及其内部元素之上；
- 不同的层叠上下文之间互相独立；
- 层叠上下文可嵌套，内部规则不影响外部。



### 参考链接

[CSS魔法堂：你真的理解z-index吗？](https://www.cnblogs.com/fsjohnhuang/p/4333164.html)

[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

[CSS 开发者指南-层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)