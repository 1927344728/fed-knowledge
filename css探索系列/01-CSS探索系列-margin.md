## CSS探索系列之Margin

### Margin是什么？

> CSS 边距属性定义元素周围的空间。通过使用单独的属性，可以对上、右、下、左的外边距进行设置。也可以使用简写的外边距属性同时改变所有的外边距。
>
> ——W3School

> 边界，元素周围生成额外的空白区。“空白区”通常是指其他元素不能出现且父元素背景可见的区域。
>
> ——CSS 权威指南

#### Margin经常被用来做什么？

- 让块元素水平居中
- 让元素之间留有舒适的留白
- 处理特殊的 first 或 last
- 一些布局

#### 需要注意的地方

- margin 神奇的外边距折叠
- margin 怪异的百分比值
- margin 的 auto 值
- margin 和相对偏移 top、right、bottom、left 的异同



### Margin神奇的外边距折叠

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
        margin: 50px;
    }
</style>
```

按照常规思路，这两个 `<p>` 之间的空白应该是第一个 `margin-bottom` 50px 加上第二的 `margin-top` 50px，即 `50 + 50px = 100px` ，但结果总是出乎意料不是么？

**它们之间只剩下了 `50px`。**



#### Why?

**这就是Margin的外边距折叠现象。**

这？这内部到底发生了什么，才会有这样的表现

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

- 元素的上外边距和其属于常规流中的第一个孩子的上外边距。
- 元素的下外边距和其属于常规流中的下一个兄弟的上外边距。
- 属于常规流中的最后一个孩子的下外边距和其父亲的下外边距，如果其父亲的高度计算值为 `auto`。
- 元素的上、下外边距，如果该元素没有建立新的块级格式上下文，且 `min-height` 的计算值为零、`height` 的计算值为零或 `auto`、且没有属于常规流中的孩子。

说得很清楚了，我想是的。你可能需要注意的是发生 `margin` 折叠的元素**不一定是兄弟关系，也能是父子或祖先的关系。**



#### 如何避免margin折叠？

我想肯定有人要问，那我不想有 `margin` 折叠的情况发生，该怎么办？其实从上面的规则中，我们已经可以抽出避免 `margin` 折叠的条件来。

##### 不折叠场景：

- `margin` 折叠元素只发生在块元素上。
- 浮动元素不与其他元素 `margin` 折叠。
- 定义了属性 overflow 且值不为 visible（即创建了新的块级格式化上下文）的块元素，不与它的**子元素**发生`margin` 折叠；
- 绝对定位元素的 `margin` 不与任何 `margin` 发生折叠。
- 根元素的 `margin` 不与其它任何 `margin` 发生折叠；

##### 折叠场景：

- 上外边距折叠：如果常规流中的一个块元素没有 `border-top`、`padding-top`，且其第一个浮动的块级子元素没有间隙，则该元素的上外边距会与其常规流中的第一个块级子元素的上外边距折叠。
- 如果一个元素的 `min-height` 属性为0，且没有上或下边框以及上或下内边距，且 `height` 为0或者 `auto`，且不包含行框，且其属于常规流的所有孩子的外边距都折叠了，则折叠其外边距。



### Margin怪异的百分比

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

##### 相对于height计算会引起无线循环

正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加，如此循环。

##### 基于排版的需求

之所以按照同一个width来计算，是为了要横向和纵向2个方向都创建相同的`margin/padding`，如果它们的参照物不一致，那用百分比就无法得到垂直和水平一致的留白。



### Margin: Auto

auto是margin的可选值之一。相信大家平时使用auto值时，最多的用法大概是 `margin: 0 auto;` 和 `margin: auto;`，恩，是的，块元素水平居中。

不过你可能也发现了，不论是 `margin: auto;` 还是 `margin: 0 auto;` 效果都是一样的，都是让元素水平居中了，但纵向并没有任何变化。

根据规范，`margin-top: auto;` 和 `margin-bottom: auto;`，其计算值为0。这也就解释了为什么 `margin: auto;` 等同于 `margin: 0 auto;`。

#### 为什么auto能实现水平居中？

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

这与规范描述一致。`margin-left:auto;` 自动占据了父节点的的可用空间，即600 - 200px = 400px。而元素中没有`margin-right`，也就是可用空间全部是`margin-left`占用的，最后的结果要当于 `margin-left:400px;`。即 `margin-left:auto;` 的结果会相当于右对齐。

同样，`margin: auto;` 和 `margin: 0 auto;` 能实现水平居中了。因为左右方向的auto值均分了可用空间，使得块元素得以在包含块内居中显示。



#### auto只能用于常规流中的 block-level 元素

##### 常规流

常规流，有的也称为普通流，标准中是用**normal flow**一词。

将窗体自上而下分成一行一行，块级元素从上至下、 行内元素在每行中按从左至右的依次排放的布局称为常规流。

浮动机制（float）、绝对定位（postion: absolute）布局被称为是脱离常规流。

除非另外指定，否则**所有元素默认都是普通流定位**，也可以说，普通流中元素的位置由该元素在 HTML 文档中的位置决定。

##### block-level 元素

 `block-level` 指的是 `display` 值为 `block` 的元素吗？我知道不少人一直有这样的认知，不过这不完全准确。

`block-level` 元素包含 `display` 值为：

- block
- list-item
- table
- table-*
- flex
- 如果position既不是static也不是relative、float不是none或者元素是根元素，当display:inline-table时，display的计算值为table；当display值为 inline | inline-block | run-in | table-* 时，display的计算值为block



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

注意： `absolute` 偏移相对的是**上一个不为static的元素** ，并且偏移值是从其 `padding` 区域开始计算。

#### 但它们真的不一样!

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

也就是说 `margin` 是互动的，因为它要影响他人；

而 `top, right, bottom, left`是孤独的，他只是自己一个人玩，不影响他人。

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



### Margin 灵活应用

#### 等高布局

要求：不论是主栏还是侧栏，总是以最高的那列为基准高度。

![image-20200504014912231](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200504014912231.png)

```html
<div class="wrap">
    <div class="main">但凡死缠烂打的人，大都不是真的深爱你，那只是在跟自己赛跑。真正爱你的人，做不到死缠烂打。因为自尊不允许。我们一直深信，爱就是把最好的一切给予对方，包括尊严。--多少浅浅淡淡的转身，是旁人看不懂的情深。—— 苏芩</div>
    <div class="aside">多少浅浅淡淡的转身，是旁人看不懂的情深</div>
</div>
<style type="text/css">
.wrap {
    overflow: hidden;
    font-size: 0;
}
.main,
.aside{
    display: inline-block;
    width: 50%;
    padding: 10px;
    font-size: initial;
    background: #a0a;
    vertical-align: top;
    box-sizing: border-box;
}
.aside {
  background: #0aa;
}
</style>
```

margin的实现方法：

```html
<style type="text/css">
.main,
.aside{
	margin-bottom: -999px;
    padding-bottom: 999px;

}
</style>
```

需要提醒的是，这其实只是视觉欺骗，做到的了伪高等高。主栏和侧栏的实际高度其实并不相等，之所以可以达成这样的效果，其原因在于负 `margin` 值。

`margin` 会影响其上下文布局，当我们将元素的 `margin-bottom` 设置为负值时，元素及其相邻的元素，底部会自动上去其负值的高度，直到最高的那列底部边缘为止，然后裁剪。但该列本身的高度并不会发生变化，同时因为有 `padding-bottom` 向下扩展，颜色被填充满padding区域，于是达到视觉上的等高。



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
    .wrap li{
        list-style: none;
        padding: 5px;
        border-bottom: 1px solid #a0a;
    }
</style>
```

实现的方法有很多，比如： `:first-child`, `:nth-last-child(n)`, `:nth-last-of-type(n)` 之类的CSS3选择符，以及最原始的为最后一项单独写一个去除边框的class。

这里用margin也可以简单实现的。它有一定优势，比如兼容ie6-8、需要用到**不兼容css3的html转pdf的插件**。当然，如果用不上，你也可以了解下。。。

方法很简单：

```html
<style>
    .wrap{
        overflow: hidden;
    }
    .wrap ul{
        margin-bottom: -1px;
    }
</style>
```



#### Margin左右结构布局

1. absolute + margin 方式

   ```html
   <div>
       <aside class="aside">侧边栏固定宽度</aside>
       <div class="main">主内容栏自适应宽度</div>
   </div>
   <style>
       .aside{
           position: absolute;
           top: 0;
           left: 0;
           width: 200px;
           background: #a0a;
       }
       .main{
           margin-left: 210px;
           background: #0aa;
       }
   </style>
   ```

2. float + margin 方式

   ```html
   <div>
       <aside class="aside">侧边栏固定宽度</aside>
       <div class="main">主内容栏自适应宽度</div>
   </div>
   <style>
       .aside{
           float: left;
           width: 200px;
           background: #a0a;
       }
       .main{
           margin-left: 210px;
           background: #0aa;
       }
   </style>
   ```

3. float + 负margin 方式

   ```html
   <!--注意：左侧内容标签，放在主内容后面-->
   <div class="wrap">
       <div class="main">主内容栏自适应宽度</div>
       <aside class="aside">侧边栏固定宽度</aside>
   </div>
   <style>
       .wrap {
           padding-left: 210px;
       }
       /*主内容必需加float: left，不然后面内容会换行*/
       .main{
           float: left;
           width: 100%;
           background: #0aa;
       }
       .aside{
           float: left;
           position: relative;
           left: -210px;
           width: 200px;
           margin-left: -100%;
           background: #a0a;
       }
   </style>
   ```

注：这三种方法只适用左侧宽度固定的。

方法1，无法撑开父元素的高度，它将会溢出父元素区域。方法2，无法支持主内容优先显示。方法3，注意清除float。



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



### 参考链接

[margin系列文章](https://blog.doyoe.com/2013/12/31/css/margin系列之布局篇/)