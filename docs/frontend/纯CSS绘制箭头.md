## 纯CSS绘制箭头

用CSS即可绘制出各种箭头，无需裁剪图片，甚至没有用到 `CSS3` 的东西。对浏览器支持良好。


### 边框箭头
原理非常简单，通过截取`border`的部分“拐角”实现

![image-20200802020855663](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200802020855663.png)


```html
<style>
    .flex_box {
        padding: 10px 0;
        text-align: center;
    }
    .flex_item {
        display: inline-block;
        width: 80px;
        height: 80px;
        margin: 20px 0;
        background: rgba(255, 0,0,0.1);
        border-color:red;
        border-width: 0 0 1px 1px;
        border-style: solid;
        transform:rotateZ(-45deg);
    }

</style>
<section>
    <div class="flex_box">
        <em class="flex_item"></em>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/fed-knowledge/demo/14-arrow.html)



### 实心箭头

当元素宽、高为零，且其他边为透明颜色时，可以形一个三角形。改变各个边的宽度，即通过调整“边框”厚度可以配置出任意角度 

![image-20200802021224072](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200802021224072.png)


```html
<style>
    .flex_box2 {
        padding: 10px 0;
        text-align: center;
    }
    .flex_item2 {
        display: inline-block;
        width: 0;
        height: 0;
        border: 50px solid transparent;
        border-top-color: #0dd;
    }

</style>
<section>
    <div class="flex_box2">
        <em class="flex_item2"></em>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/fed-knowledge/demo/14-arrow.html?type=2)



### 90°之外的箭头

常见的箭头设计是大于90°的，在上面例子的基础上，“压扁”或“拉长”矩形不就可以了吗?而“压扁”或“拉长”需要用`skew()`就能实现，只不过需要做些角度的计算。
按照`width: 100px; `角度120°的需求来定义边长、角度两个变量。`height = width * cos(30°) = width * sin(60°)`。


![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/other/218192-5b38efb41639a1eb.png) 

![image-20200802021401702](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200802021401702.png)

```css
<style>
    .flex_box3 {
        padding: 10px 0;
        text-align: center;
    }
    .flex_item3 {
        display: inline-block;
        width: 100px;
        height: 86px;
        transform: rotate(-30deg) skewX(30deg);
        background: #e4ffe7;
        border-bottom: 1px solid #00ff22;
        border-left: 1px solid #00ff22;
    }
</style>
<section>
    <div class="flex_box3">
        <em class="flex_item3"></em>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/fed-knowledge/demo/14-arrow.html?type=3)



![image-20200802022247549](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200802022247549.png) 

```html

<style>
    .flex_box {
        padding: 0;
        position: relative;
        height: 80px;
    }
    .flex_item4 {
        position: absolute;
        left: 40%;
        width: 10px;
        height: 40px;
        background: #f50;
    }
    .flex_item4:nth-child(1) {
        top: 0;
        transform: skewX(30deg);
    }
    .flex_item4:nth-child(2) {
        bottom: 0;
        transform: skewX(-30deg);
    }
</style>
<section>
    <div class="flex_box">
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/fed-knowledge/demo/14-arrow.html?type=4)



### 终极实现方法

`transform: matrix`实现任意大小，任意方向， 任意角度的箭头 。

先把div 旋转45度， 让它成为一个 菱形 然后再伸缩，达到任意的角度， 这样就可以得到一个 任意角度的箭头。由于用到了旋转和伸缩两种变换，所以需要使用 `transform: matrix(a,b,c,d,e,f)` 这个变换矩阵。

![image-20200802025353693](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200802025353693.png)

```html
<style>
    .flex_item5 {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-top: 20px;
        border-top: 2px solid #f50;
        border-right: 2px solid #f50;
        transform: matrix(0.7071067811865475,0.7071067811865476,-0.7071067811865476,0.7071067811865475,0,0);
    }
</style>
<section>
    <div class="flex_box">
        <em class="flex_item5"></em>
    </div>
</section>
```

[查看DEMO](https://1927344728.github.io/fed-knowledge/demo/14-arrow.html?type=5)

<p style="color: #f50">(没看懂。感兴趣的可以点击下方链接查看。lizh)</p>


### 参考链接

[css箭头](http://www.php-master.com/post/44097.html) 

[使用css实现任意大小，任意方向， 任意角度的箭头](https://juejin.im/post/5a9c99c4f265da23906b7c98)

