## CSS探索系列之Margin

### Margin是什么？

> CSS 边距属性定义元素周围的空间。通过使用单独的属性，可以对上、右、下、左的外边距进行设置。也可以使用简写的外边距属性同时改变所有的外边距。
>
> ——W3School

> 边界，元素周围生成额外的空白区。“空白区”通常是指其他元素不能出现且父元素背景可见的区域。
>
> ——CSS 权威指南

Margin 常被用于：

- 块元素水平居中；
- 元素之间留有舒适的留白；
- 处理特殊的 first 或 last 元素；
- 一些布局，如：等高布局；

需要注意的地方：

- 神奇的外边距折叠；
- 怪异的百分比值；
- auto 值；
- 与相对偏移属性（top、right、bottom、left）的异同；

### 神奇的外边距折叠

![image-20200504010557625](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200504010557625.png)

```html
<div class="wrap">
    <p>我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。</p>
    <p>回忆模糊不清，就给自我欺骗提供了机会。</p>
</div>
<style type="text/css">
    .wrap {
        border: 1px solid #f00;
    }
    .wrap p {
        margin: 50px 0;
    }
</style>
```

按照常规思路，这两个 `<p>` 之间的空白应该是第一个 `margin-bottom` 50px 加上第二的 `margin-top` 50px，即 `50 + 50px = 100px` ，但结果总是出乎意料不是么？

**它们之间只剩下了 `50px`。**

#### Why?

**这就是Margin的外边距折叠现象。**

早在`CSS1`中就有对 `margin` 折叠的说明，我们来看看：

> 原文：The width of the margin on non-floating block-level elements specifies the minimum distance to the edges of surrounding boxes. Two or more adjoining vertical margins (i.e., with no border, padding or content between them) are collapsed to use the maximum of the margin values. In most cases, after collapsing the vertical margins the result is visually more pleasing and closer to what the designer expects.
>
> 翻译：外边距用来指定**非浮动元素**与其周围盒子边缘的最小距离。两个或两个以上的相邻的**垂直外边距**会被折叠并使用它们之间**最大的那个外边距值**。多数情况下，**折叠垂直外边距可以在视觉上显得更美观，也更贴近设计师的预期。**

从这段话中，我们能获得一些有用的信息：

- 发生折叠需要是相邻的非浮动元素。

- 折叠发生在垂直外边距上，即`margin-top/margin-bottom`。

  **注：此特性受书写模式影响，具体可看本文后面章节。**

- 折叠后取其中最大的那个`margin`值作为最终值。

#### 到底什么是Margin折叠？

在CSS中，两个或以上的块元素（可能是兄弟，也可能不是）之间的相邻外边距可以被合并成一个单独的外边距。通过此方式合并的外边距被称为折叠，且产生的已合并的外边距被称为**折叠外边距**。

处于同一个块级上下文中的块元素，没有行框、没有间隙、没有内边距和边框隔开它们，这样的元素垂直边缘毗邻，则称之为相邻。

##### 什么是垂直边缘毗邻？

而根据 w3c 规范，两个 margin 是邻接的必须满足以下条件：

* 必须是处于常规文档流（非 float 和绝对定位）的块级盒子，并且处于同一个 BFC 当中；
* 没有 `padding` 和 `border` 将他们分隔开；
* 属于垂直方向上相邻的外边距，可以是下面任意一种情况：
  * 元素的 `margin-top` 与其第一个常规文档流的子元素的 `margin-top`；
  * 元素的 `margin-bottom` 与其下一个常规文档流的兄弟元素的 `margin-top`；
  * `height` 属性值为 `auto` 的元素的 `margin-bottom` 与其最后一个常规文档流的子元素的 `margin-bottom`；
  * `min-height` 的值为零、`height` 的值为零或 `auto`，不包含常规文档流的子元素，并且自身没有建立新的 BFC 的元素的`margin-top` 和 `margin-bottom`。

你可能需要注意的是发生 `margin` 折叠的元素**不一定是兄弟关系，也能是父子或祖先的关系。**

#### 如何避免margin折叠？

避免 margin 折叠，我们可以从 margin 折叠需要满足的条件着手：

* 为元素创建块级格式上下文元素（BFC），使两个元素不属性同一 BFC，比如：`position: absolute `、`float: left | right`、`display: inline-block`；

- 为元素设置 `padding`、`border` 属性；
- 根元素的 `margin` 不与其它任何 `margin` 发生折叠；
- 元素设置 `height`、`min-height`、`max-height`，可避免与最后一个子元素折叠；
- 元素设置 `height`、`min-height`，可避免空元素折叠；

### 怪异的百分比

#### 你可能从没注意过它

我必须承认这是一个非常基础的知识点，但仍然有很多人可能对此有错误的认知。

假设一个块级包含容器，宽600px，高300px，块级子元素定义 `margin:10% 5%;` 大家说说 margin 的 top, right, bottom, left 计算值最终是多少？

应该有不少人脱口而出：` 60px 15px 60px 15px` 。

```css
<div class="wrap">
    <p>我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。</p>
</div>
<style type="text/css">
    .wrap {
      width: 600px;
      height: 300px;
      border: 1px solid #f00;
    }
    .wrap p {
        margin: 10% 5%;
        background: #0aa;
    }
</style>
```

![image-20200504012208342](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200504012208342.png)

**事实告诉我们结果是 `60px 30px 60px 30px`。**

#### 为什么会这样？

诧异吗？不用怀疑浏览器出了问题，因为这是正确的实现。

规范中注明 **margin 的百分比值参照其包含块的宽度进行计算。**

```
Note that in a horizontal flow, percentages on ‘margin-top’ and ‘margin-bottom’ are relative to the width of the containing block, not the height (and in vertical flow, ‘margin-left’ and ‘margin-right’ are relative to the height, not the width).
Note that percentages on ‘padding-top’ and ‘padding-bottom’ are relative to the width of the containing block, not the height (at least in a horizontal flow; in a vertical flow they are relative to the height).
```

当然，它不会这么简单，以上只是发生在默认的横向书写的情况下。

**注：此特性受书写模式影响，具体可看本文后面章节。**

#### 为什么参照的是width，而不是height?

对于`margin/padding-top/bottom` 的百分比之所以按照 width 计算，目前主要有以下两种解释：

* 相对于height计算会引起无线循环

  正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加，如此循环。

* 基于排版的需求

  之所以按照同一个 width 来计算，是为了要横向和纵向2个方向都创建相同的 `margin/padding`，如果它们的参照物不一致，那用百分比就无法得到垂直和水平一致的留白。

### Margin: Auto

`auto` 是 `margin` 的可选值之一。相信大家平时使用 `auto` 值时，最多的用法大概是 `margin: 0 auto;` 和 `margin: auto;`，恩，是的，就是块元素水平居中。不过你可能也发现了，不论是  `margin: auto;` 还是 `margin: 0 auto;` 效果都是一样的，都是让元素水平居中了，但纵向并没有任何变化。

根据规范，`margin-top: auto;` 和 `margin-bottom: auto;`，其计算值为0。这也就解释了为什么 `margin: auto;` 等同于 `margin: 0 auto;`。

**为什么auto能实现水平居中？**

**这是因为水平方向的 `auto`，其计算值取决于可用空间（剩余空间）。**

**注：此特性受书写模式影响，具体可看本文后面章节。**

想象这样一个场景：一个宽200px的元素被包含在一个宽600px的元素，此元素的 `margin-left: auto`，大家觉得结果会怎样？

![image-20200503234104813](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200503234104813.png)

```html
<div class="wrap">
    <div class="margin_left">
      我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。回忆模糊不清，就给自我欺骗提供了机会。—— 石黑一雄《远山淡影》
    </div>
</div>
<style type="text/css">
  .wrap {
    width: 600px;
    border: 1px solid #f00;
  }
  .wrap .margin_left {
    width: 200px;
    margin-left: auto;
    background: #0aa;
  }
</style>
```

这与规范描述一致。`margin-left: auto;` 自动占据了父节点的的可用空间，即 600px - 200px = 400px。而元素中没有 `margin-right`，也就是可用空间全部是 `margin-left` 占用的，最后的结果要当于  `margin-left:400px;`。即 `margin-left:auto;` 的结果会相当于右对齐。

同样，`margin: auto;` 和 `margin: 0 auto;` 能实现水平居中了。因为左右方向的 `auto` 值均分了可用空间，使得块元素得以在包含块内居中显示。

**总结：** `margin` 水平方向的属性值，若一侧定值，一侧值为 `auto`，则 `auto`为剩余空间大小；如果两侧均是 `auto`，则平分剩余空间。

### Margin与Relative的异同

![image-20200503225626449](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200503225626449.png)

```html
<div class="wrap">
  <div class="compare">
    <div class="margin">
      我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。回忆模糊不清，就给自我欺骗提供了机会。—— 石黑一雄《远山淡影》
    </div>
  </div>
  <div class="compare">
    <div class="relative">
      我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。回忆模糊不清，就给自我欺骗提供了机会。—— 石黑一雄《远山淡影》
    </div>
  </div>
</div>
<style type="text/css">
  .wrap {
    border: 1px solid #f00;
  }
  .wrap .compare {
    display: inline-block;
    width: 49%;
    padding: 10px;
    vertical-align: top;
    box-sizing: border-box;
  }
  .wrap .margin {
    margin-top: 50px;
    background: #a0a;
  }
  .wrap .relative {
    position: relative;
    top: 50px;
    background: #0aa;
  }
</style>
```

这似乎没什么不同？都完成了向下偏移 50px的需求。

好吧。这里还真没什么不同，至少在这里没有！不论是 `margin-top` 还是 `relative top` 都是以**自身作为参照物**进行偏移的。

**但它们真的不一样!**

我们来看看规范怎么说：

**margin:**

> 原文：Margins in CSS serve to add both horizontal and vertical space between boxes.
>
> 翻译：CSS中的margin用来添加盒子之间的水平和垂直间隙。

**top, right, bottom, left:**

>原文：An element is said to be positioned if its ‘position’ property has a value other than ‘static’. Positioned elements generate positioned boxes, and may be laid out according to the following four physical properties: top, right, bottom, left.
>
>翻译：一个元素的position属性值如果不为static则发生定位。定位元素会产生定位盒，并且会根据 top, right, bottom, left 这4个物理属性进行排版布局。

意思很明白，`margin` 是用来增加自身与他人之间的空白，而 `top, right, bottom, left` 是用来对自身进行排版，作用完全不同。

也就是说 `margin` 是互动的，因为它要影响他人；而 `top, right, bottom, left`是孤独的，他只是自己一个人玩，不影响他人。

不是很明白？！还是直接看图吧：

![image-20200503225830177](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200503225830177.png)

```html
<div class="wrap">
  <div class="compare">
    <div class="margin">
      我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。回忆模糊不清，就给自我欺骗提供了机会。—— 石黑一雄《远山淡影》
    </div>
    <div class="diff">我们不一样，每个人都有不同的境遇。。。</div>
  </div>
  <div class="compare">
    <div class="relative">
      我喜欢回忆，是因为回忆是我们审视自己生活的过滤器。回忆模糊不清，就给自我欺骗提供了机会。—— 石黑一雄《远山淡影》
    </div>
    <div class="diff">我们不一样，每个人都有不同的境遇。。。</div>
  </div>
</div>
<style type="text/css">
  .wrap {
    border: 1px solid #f00;
  }
  .wrap .compare {
    display: inline-block;
    width: 49%;
    padding: 10px;
    vertical-align: top;
    box-sizing: border-box;
  }
  .wrap .margin {
    margin-top: 50px;
    background: #a0a;
  }
  .wrap .relative {
    position: relative;
    top: 50px;
    background: #0aa;
  }
  .wrap .diff {
    position: relative;
    padding: 10px;
    color: #f00;
  }
</style>
```

结果有出乎你的意料吗？好吧，不论怎么，解释下为什么会这样？

上面说过，`margin` 是用来增加自身与他人之间的空白，是互动的，**因为他要影响他人**。即`margin`元素往下偏移了50px，他后面的兄弟元素是**从他偏移后的位置开始排版**；

而 `top, right, bottom, left` 是用来对自身进行排版，他只是自己一个人玩，**不影响他人**。即`ralative`元素虽然也往下偏移了50px，但他的兄弟元素，还是**从他偏移前的位置开始排版**。

简而言之，你眼睛看到的`relative`元素，并不是他在布局中的真正位置。

这才是他在布局中的位置：

![image-20200503230100757](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200503230100757.png)



### Margin应用示例

#### 等高布局

要求：不论是主栏还是侧栏，总是以最高的那列为基准高度。

![image-20200504014912231](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200504014912231.png)

```html
<div class="wrap">
    <div class="main">但凡死缠烂打的人，大都不是真的深爱你，那只是在跟自己赛跑。真正爱你的人，做不到死缠烂打。因为自尊不允许。我们一直深信，爱就是把最好的一切给予对方，包括尊严。--多少浅浅淡淡的转身，是旁人看不懂的情深。—— 苏芩</div>
    <div class="aside">多少浅浅淡淡的转身，是旁人看不懂的情深</div>
</div>
<style type="text/css">
    .wrap { overflow: hidden; font-size: 0; }
    .main, .aside{
        display: inline-block;
        width: 50%;
        padding: 10px;
        font-size: initial;
        background: #a0a;
        vertical-align: top;

        margin-bottom: -999px;
        padding-bottom: 999px;
        box-sizing: border-box;
    }
    .aside { background: #0aa; }
</style>
```

#### 去掉列表最后一项下边框

![image-20200504015238324](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200504015238324.png)

```html
<div class="wrap">
    <ul>
        <li>多少浅浅淡淡的转身，是旁人看不懂的情深</li>
        <li>多少浅浅淡淡的转身，是旁人看不懂的情深</li>
        <li>多少浅浅淡淡的转身，是旁人看不懂的情深</li>
        <li>多少浅浅淡淡的转身，是旁人看不懂的情深</li>
        <li>多少浅浅淡淡的转身，是旁人看不懂的情深</li>
    </ul>
</div>
<style>
    .wrap ul { margin-bottom: -1px; }
    .wrap li{
        list-style: none;
        padding: 5px;
        border-bottom: 1px solid #a0a;

        overflow: hidden;
    }
</style>
```

这里只是简单了解下，实现的方法有很多，比如： `:first-child`、为最后一项单独写 class。

#### 圣杯布局

在 CSS 中，圣杯布局是指两边盒子宽度固定，中间盒子自适应的三栏布局，其中，中间栏放到文档流前面，保证先行渲染；三栏全部使用 `float: left`，并配合 `left`、`right` 属性。

```html
<header>header</header>
<div class="container">
    <!-- 这里把 middle 区域放在第一位是为了让浏览器先加载 middle 区域 -->
    <div class="middle">middle（中间弹性区）</div>
    <div class="left">left</div>
    <div class="right">right</div>
</div>
<footer>footer</footer>
```

```css
header {
    height: 50px;
    background-color: red;
}
.container {
    height: 200px;
    overflow: hidden;
    padding: 0 200px;
}
.middle {
    width: 100%;
    height: 200px;
    background-color: #ECECEC;
    float: left;
}
.left {
    width: 200px;
    height: 200px;
    position: relative;
    left: -200px;
    margin-left: -100%;
    background-color: blue;
    float: left;
}
.right {
    width: 200px;
    height: 200px;
    position: relative;
    right: -200px;
    margin-left: -200px;
    background-color: yellow;
    float: left;
}
footer {
    height: 50px;
    background-color: black;
}
```

#### 双飞翼布局

圣杯布局其实和双飞翼布局是一回事。它们实现的效果是一样的，差别在于其实现的思想。

双飞翼布局在 middle 块子元素 `div.in` 中使用 `padding` 留出左右两边区域，让 left、right 块无需再用 `reletive` 定位：

```html
...
<div class="container">
    <div class="middle">
        <div class="in">middle（中间弹性区）</div>
    </div>
    ...
</div>
...
```

```css
.container {
    height: 200px;
    overflow: hidden;
}
.in {
    padding: 0 200px 0 200px;
}
.left {
    width: 200px;
    height: 200px;
    margin-left: -100%;
    background-color: blue;
    float: left;
}
.right {
    width: 200px;
    height: 200px;
    margin-left: -200px;
    background-color: yellow;
    float: left;
}
```

### 书写模式对Margin的影响

CSS中有一些样式是受书写模式影响的。非常不幸，`margin` 正好是其中之一。

* 在水平书写模式下，发生 `margin` 折叠的是**垂直方向**，即 `margin-top/margin-bottom`；在垂直书写模式下，发生 `margin` 折叠是的**水平方向**，即 `margin-right/margin-left`。
* 在水平书写模式下， `margin/padding-*` 的百分比都按照width计算。在垂直书写模式下， `margin/padding-*` 都按照 height计算。
* 在水平书写模式下， `margin: auto;` 等同于 `margin: 0 auto;` ，即`top、bottom`为0；在垂直书写模式下，  `margin: auto;` 等同于 `margin: auto 0;` ，即`left、right`为0。

可用 `write-mode` 更改书写模式，属性值：

##### [CSS 书写模式的24种方式](https://zhuanlan.zhihu.com/p/24979353)

```css
/* 关键值 */ 
horizontal-tb：水平方向自上而下的书写方式。即 left-right-top-bottom
vertical-rl：垂直方向自右而左的书写方式。即 top-bottom-right-left
vertical-lr：垂直方向内内容从上到下，水平方向从左到右
sideways-rl：内容垂直方向从上到下排列
sideways-lr：内容垂直方向从下到上排列
/*除火狐浏览器，其他的浏览器都不支持 sideways-*/
```

在水平书写模式（默认）：

```css
/*块级方向：由上到下；行内方向：水平方向，从左至右。 */
.h {
    writing-mode: horizontal-tb;
    direction: ltr;
}
```

在垂直书写模式：

```css
.v {
	writing-mode: vertical-rl; 
}
```

> **`direction`** ：用来设置文本、表列水平溢出的方向。 `rtl` 表示从右到左 (类似希伯来语或阿拉伯语)， `ltr` 表示从左到右 (类似英语等大部分语言)。

### 常见问题

##### 哪些情况下 margin 会无效？

因为 `margin` 属性的诸多特异性，所以，在实际开发时，经常会遇到设置的 margin 无效的情形：

* **margin 折叠时：** 垂直方向的 `margin` 折叠的时候，更改 `margin` 值可能会没有效果的。
* **inline 元素：** `display: inline` 的非替换元素的垂直 `margin` 是无效的，虽然规范提到有渲染，但浏览器表现却未寻得一点踪迹；对于内联替换元素，垂直 `margin` 有效，并且没有 `margin` 折叠的问题；
* **表格：** 表格中的 tr、td 元素或者设置 `display: table-cell|table-row` 的元素的 `margin` 都是无效的。但是，如果是 `display: table-caption|table|inline-table` 则可以通过 `margin` 控制外间距，甚至 `::first-letter` 伪元素也可以解析 `margin`。
* **绝对定位元素非定位方位的 margin：** 比如，元素绝对定位时，只设置 `top: 10%; left: 30%;` 两个方位，则 `right|bottom` 值属于 `auto` 状态，也就是右侧和底部没有进行定位，此时，这两个方向设置 `margin` 值是无效的。??
* **定高或定宽容器的子元素：** 定高容器的子元素的 `margin-bottom` 或者定宽容器的子元素的 `margin-right` 的定位无效的。这个时候并不是无效，只是给人的感觉是无效。



### 参考链接

[margin系列文章](https://blog.doyoe.com/2013/12/31/css/margin系列之布局篇/)

[css进阶之十三：margin合并与margin无效](https://zhyjor.github.io/2018/06/26/css%E8%BF%9B%E9%98%B6%E4%B9%8B%E5%8D%81%E4%B8%89%EF%BC%9Amargin%E5%B4%A9%E5%A1%8C/)
