## CSS探索系列之元素居中

CSS居中是前端工程师经常要面对的问题，也是基本技能之一。

今天将以往使用过的方法做一个总结，包括水平居中，垂直居中及水平垂直居中方案。本文对一些类似方案进行归类总结，整理结果如下。后面如有新方案，还会陆续的补充进来。

 

### DEMO

```html
<style>
.box {
    width: 600px;
    height: 300px;
    color: #0aa;
    border: 1px solid #0aa;
}
.box> .item {
    width: 300px;
    height: 150px;
    margin: 0 auto;
    color: #fff;
    background: #0aa;
}
</style>

<section class="box">
    <div class="item"></div>
</section>
```



### 水平居中

#### 1.margin：auto

块（block）元素水平居中，子元素 `margin: auto`。

```html
<style>
    .box_01 > .item {
        margin: 0 auto;
    }
</style>
<section class="box box_01">
    <div class="item">
        玉炉香，红蜡泪，偏照画堂秋思。眉翠薄，鬓云残，夜长衾枕寒。梧桐树，三更雨，不道离情正苦。一叶叶，一声声，空阶滴到明。
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=1)



#### 2.text-align：center

行内（inline-block、inline）元素水平居中。父元素 `text-align: center`。

```html
<style>
    .box_02 > .item_02 {
        text-align: center;
    }
</style>
<section class="box box_02">
    <span class="item_02">
        曾以为真情会在你我的心间永驻，<br>
        曾以为一辈子都要爱下去。<br>
        但终究，时光也会老去，人心也会变淡，<br>
        走着走着便忘了曾经，<br>
        想着想着便走错了地方。<br>
        有一天还是要面对分离，<br>
        面对这情深缘浅的现实；<br>
        有一天我们会分道杨镳，<br>
        变成了最熟悉的陌生人。
    </span>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=2)



### 垂直居中

#### 3.height + line-height

单行文字垂直居中，父元素`height值 === line-height值`。

```html
<style>
    .box_03 > .item_03 {
        height: 300px;
        line-height: 300px;
    }
</style>
<section class="box box_03">
    <span class="item_03">玉炉香，红蜡泪，偏照画堂秋思。</span>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=3)



#### 4.幽灵元素

如果一个父元素中，有两个`inline-block`的子元素，且这两个子元素`vertical-align: middle`，那么这两个元素在垂直方向是居中的。

思路再扩展下，如果其中一个子元素的高度跟父元素一样，那么这两个子元素，在父元素都是垂直居中了。按此思路，元素垂直居中的实现：给父元素设置一个伪元素，`display: inline-block; width: 0; height: 100%`，且设置为在页面不可见，我们称这个伪元素为"幽灵元素"，通过给幽灵元素和子元素设置 `vertical-align: middle` 可以实现垂直居中。

```html
<style>
    .box_04 {
        font-size: 0;
    }
    .box_04::after {
        display: inline-block;
        width: 0;
        height: 100%;
        content: ' ';
        visibility: hidden;
        vertical-align: middle;
    }
    .box_04 > .item_04 {
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
    }
</style>
<section class="box box_04">
    <div class="item_04">
        要走的终究是要走，想离开的最终还是会离开，没有那些敷衍的理由，留下的，只是那些没有保鲜期的诺言；一本往事录，合上的是谁的归宿，那曾经盛开的花，只不过是擦肩而过的幸福。
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=4)

> 注意：子元素宽度为100%时，右侧会有一丝空白。



### 水平垂直居中

#### 5.table-cell布局

行内元素、单行、多行文字水平垂直居中。

```html
<style>
    .box_05 {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
    }
    .box_05 .item_05 {
        display: inline-block;
        width: 80%;
    }
</style>
<section>
    <div class="box box_05">
        <div class="item_05">
            曾以为真情会在你我的心间永驻，曾以为一辈子都要爱下去。但终究，时光也会老去，人心也会变淡，走着走着便忘了曾经，想着想着便走错了地方。有一天还是要面对分离，面对这情深缘浅的现实；有一天我们会分道杨镳，变成了最熟悉的陌生人。
        </div>
    </div>
</section>
```

 [查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=5)



#### 6.flex布局

块元素、行内元素、单行、多行文字水平垂直居中。

```html
<style>
    .box_06 {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .box_06 > .item_06 {
        width: 80%;
    }
</style>
<section>
    <div class="box box_06">
        <div class="item_06">
            《童年．花草记忆》一念花开，一念花落。这山长水远的人世，终究是要自己走下去。人在旅途，要不断的自我救赎。(桂花)
        </div>
    </div>
</section>
```

 [查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=6)



#### 7.grid

```html
<style>
    .box_07 {
        display: grid;
    }
    .box_07 > .item_07 {
        width: 80%;
        margin: auto;
    }
</style>
<section>
    <div class="box box_07">
        <div class="item_07">
            来者要惜，去者要放。人生是一场旅行，不是所有人都会去同一个地方。路途的邂逅，总是美丽，分手的驿站，总是凄凉。不管喜与愁，该走的还是要走，该来的终究会来。人生的旅程，大半是孤单。懂得珍惜，来的俱是美丽；舍得放手，走的不成负担。对过去，要放；对现在，要惜；对将来，要信
        </div>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=7)



#### 8.position + 负margin

适用于固定大小的块级元素，`margin-left`、`margin-top`为元素宽、高的一半。

```html
.box_08 {
  text-align: left;
}
.box_08 > .item_08 {
    position: relative;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 224px;
    margin-top: -112px;
    margin-left: -200px;
}
<section>
    <div class="box box_08">
        <img class="item_08" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141710_4735vxaqwhri_small.jpg" />
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=8)



#### 9.position + calc()

适用于固定大小的块级元素，`calc`计算`50% - 元素宽或高的一半`。

```html
<style>
    .box_09 {
        position: relative;
    }
    .box_09 .item_09 {
        position: absolute;
        top: calc(50% - 75px);
        left: calc(50% - 150px);
        width: 300px;
        height: 150px;
        overflow: hidden;
    }
</style>
<section class="box box_09">
    <div class="item_09">
        走得顺时，不必太张狂，就算你爬到了坡顶，终究还要走下坡路；<br> 走得快时，无须太得意，你的脚力总是有限的，不如放慢脚步把短暂的路走得精彩些；
        <br> 走得累时，莫要太哀叹，要知道歇一歇，经受了劳累，才知道坚强与珍惜；
        <br> 走得苦时，切勿太悲怆，生活里是没有绝路的，苦难是人生的梯，助你走出低谷和沼泽。
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=9)



#### 10.position + margin: auto

子元素宽高都小于父元素时，水平垂直居中；子元素宽度大于父元素，水平方向左对齐，垂直方向居中；子元素高度大于父元素，水平方向居中，垂直方向也还是居中的。

```html
<style>
    .box_10 {
        position: relative;
    }
    .box_10 > .item_10 {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: auto;
    }
</style>
<section>
    <div class="box box_10" style="height: 500px;">
        <img class="item_10" style="width: 700px;" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141711_6640njffmwvi_small.jpg">
    </div>
    <div class="box box_10">
        <img class="item_10" style="width: 150px;" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/c1647f58eed70de7fd7a19a63347d137.jpg">
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=10)



#### 11.position + transform

```html
<style>
    .box_11 {
        position: relative;
    }
    .box_11 .item_11 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
<section>
    <div class="box box_11" style="height: 500px;">
        <img class="item_11" style="width: 700px;" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141711_6640njffmwvi_small.jpg">
    </div>
    <div class="box box_11">
        <img class="item_11" style="width: 150px;" src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/images/c1647f58eed70de7fd7a19a63347d137.jpg">
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=11)



#### 12.background

适用于图片的居中。

```html
<style>
    .box_12 {
        background: url(https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141711_9501mvvwvonf_small.jpg) no-repeat center;
        background-size: 80%;
    }
</style>
<section class="box box_12"></section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/01_v_&_h_center.html?type=12)



#### 13.padding填充

这种常用于父元素大小不固定的场景。



### 总结

居中实现方案有很多，本人比较常用的是：flex布局、 position + transform。上述水平垂直居中方案中：方案8、方案9只适用于仅居中元素已固定宽高。

