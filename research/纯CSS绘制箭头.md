## 纯CSS绘制箭头

用CSS即可绘制出各种箭头，无需裁剪图片，甚至没有用到 `CSS3` 的东西。对浏览器支持良好。


### 边框箭头
原理非常简单，通过截取`border`的部分“拐角”实现

![image-20200802020855663](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802020855663.png)


```html
<style>
    .box_01 {
        padding: 10px 0;
        text-align: center;
    }
    .box_01 .item_01 {
        display: inline-block;
        width: 80px;
        height: 80px;
        margin: 20px 0;
        background: rgba(255, 0, 0, 0.1);
        border-color: red;
        border-width: 0 0 1px 1px;
        border-style: solid;
        transform: rotateZ(-45deg);
    }
</style>
<section class="box_01">
    <em class="item_01"></em>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/09-arrow.html?type=1)



### 实心箭头

当元素宽、高为零，且其他边为透明颜色时，可以形一个三角形。改变各个边的宽度，即通过调整“边框”厚度可以配置出任意角度 

![image-20200802021224072](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802021224072.png)


```html
<style>
    .box_01 .item_02 {
        display: inline-block;
        width: 0;
        height: 0;
        border: 50px solid transparent;
        border-top-color: #0dd;
    }
</style>
<section class="box_01">
    <em class="item_02"></em>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/09-arrow.html?type=2)



### 90°之外的箭头

常见的箭头设计是大于90°的，在上面例子的基础上，“压扁”或“拉长”矩形不就可以了吗?而“压扁”或“拉长”需要用`skew()`就能实现，只不过需要做些角度的计算。
按照`width: 100px; `角度120°的需求来定义边长、角度两个变量。`height = width * cos(30°) = width * sin(60°)`。


![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/218192-5b38efb41639a1eb.png) 

![image-20200802021401702](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802021401702.png)

```html
<style>
    .box_01 .item_03 {
        display: inline-block;
        width: 100px;
        height: 86px;
        transform: rotate(-30deg) skewX(30deg);
        background: #e4ffe7;
        border-bottom: 1px solid #00ff22;
        border-left: 1px solid #00ff22;
    }
</style>
<section class="box_01">
    <em class="item_03"></em>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/09-arrow.html?type=3)



![image-20200802022247549](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802022247549.png) 

```html
<style>
    .box_04 {
        padding: 0;
        position: relative;
        height: 80px;
    }
    .box_04 .item_04 {
        position: absolute;
        left: 40%;
        width: 10px;
        height: 40px;
        background: #f50;
    }
    .box_04 .item_04:nth-child(1) {
        top: 0;
        transform: skewX(30deg);
    }
    .box_04 .item_04:nth-child(2) {
        bottom: 0;
        transform: skewX(-30deg);
    }
</style>
<section class="box_04">
    <div class="item_04"></div>
    <div class="item_04"></div>
</section>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/09-arrow.html?type=4)

### transform: matrix() 用法详解

`transform: matrix()` 是CSS中最强大但也最复杂的变换函数，它允许你通过一个 6 值矩阵执行2D变换。

#### 核心概念

```shell
matrix(a, b, c, d, tx, ty)
```

参数对应以下变换：

- `a` 和 `d`：控制缩放（x轴和y轴）
- `b` 和 `c`：控制倾斜
- `tx` 和 `ty`：控制平移（x轴和y轴）

即，对应以下值：

```shell
matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
```

#### 角度和弧度

**角度 (Degrees)：**源于古巴比伦文明的60进制计数系统。将一个圆等分为360份的单位，即，完整的圆 = 360°，平角 = 180°，直角 = 90°。

**弧度 (Radians)：**国际单位制中的标准角度单位。基于圆的半径的单位，1弧度 = 半径长度的弧所对的圆心角，一个完整的圆 = 2π弧度 (约6.283弧度)。

弧度 = 角度 × (π/180)

角度 = 弧度 × (180/π)

> 角度在日常生活中更常见，弧度在高等数学和物理学中更常用。弧度使许多数学公式更加简洁，特别是在微积分中

#### 变换函数的等价关系

##### 未变换

```shell
matrix(1, 0, 0, 1, 0, 0)
```

##### 平移：translate() 转 matrix()

```shell
translate(tx, ty)
matrix(1, 0, 0, 1, tx, ty)
```

##### 缩放：scale() 转 matrix()

```shell
scale(sx, sy)
matrix(sx, 0, 0, sy, 0, 0)
```

##### 倾斜：skew() 转 matrix()

```shell
skew(θx, θy)
matrix(1, tan(θy), tan(θx), 1, 0, 0)
```

##### 旋转：rotate() 转 matrix()

```shell
rotate(θ)
matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0)
```

```shell
const angle = 60;
const rad = angle * Math.PI / 180;
const sin = Math.sin(rad);
const cos = Math.cos(rad);

transform: matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0);
transform: matrix(0.5000000000000001, 0.8660254037844386, -0.8660254037844386, 0.5000000000000001, 0, 0);
```


### 参考链接

[使用css实现任意大小，任意方向， 任意角度的箭头](https://juejin.im/post/5a9c99c4f265da23906b7c98)

