## CSS3探索系列之gradient

`<gradient> `是一种特别的`<image>`数据类型，用于表现两种或多种颜色的过渡转变。`<gradient>`只能被用于`<image>`可以使用的地方。因此，它并不适用于`background-color`以及类似的使用`<color>`数据类型的属性中。

通常，在CSS中渐变就是`background`的`background-image`，也就是说，**适用于背景图像的CSS属性都适合于渐变。**



### 渐变容器（渐变框）

`<gradient>` 图像和传统的背景图像不一样，它是无限的渐变图像，可见区域是由渐变容器大小来决定的。

一个DOM元素的`background-image`使用`linear-gradient`，其显示区域就是元素的`border-box`区域（即：包括内容、内边距和边框，但不包括外边距）。其实也是`background-color`或者说通过`url`引入背景图像的显示区域。

然而，如果你通过CSS的`background-size`设置一个尺寸，比如说`200px * 200px`，这个时候渐变容器（渐变尺寸）就是`200px * 200px`。在没有使用`background-position`设置为其他值时，它默认是显示在DOM元素的左上角（也就是`background-position: left top`）。



### 线形渐变

颜色值沿着一条隐式的直线逐渐过渡。由`linear-gradient()`创建一个表示两种或多种颜色线性渐变的图片。

#### 语法

```css
linear-gradient([ <angle> | to <side-or-corner> ,]? <linear-color-stop> [<color-hint>] <linear-color-stop> ... )
```

- `<side-or-corner>`

  通过指向边或者角，指定渐变的方向，可不写，默认值为 `to bottom`。

  取值：`to left/ to right/ to top/ to bottom/ to top left/ to bottom right`。关键词的先后顺序无影响，即`to top left`和`to left top`是一样的。

- `<angle>`

  用角度值指定渐变的方向（或角度），可不写，默认值为 `180deg`（等价`to bottom`）。 `0deg`表示指向北方的方向，角度顺时针增加。

  取值：`90deg`、`135deg`、`0.25turn`、`100grid`、`1rad`。

  在带前缀的变体和不带前缀的提案之间仍然存在一项语义的分歧：**标准将`0deg`指向北方，带前缀的保持原始的角度定义，即`0deg`指向东方**。

  > **CSS角度单位：deg、grad、rad、turn**
  >
  > **90deg = 100grad = 0.25turn ≈ 1.570796326794897rad**
  >
  > * deg：度（Degress）。一个圆共360度
  > * grad：梯度（Gradians）。一个圆共400梯度
  > * rad：弧度（Radians）。一个圆共2π弧度
  > * turn：转、圈（Turns）。一个圆共1圈

- `<linear-color-stop>`

  颜色终止点，由`<颜色值 位置>`组成，位置可不写。如：`#e66465`、`#e66465 50%`、`#e66465 100px`等。可写两个或多个颜色终止点。

  颜色终止列表中颜色的终止点应该是依次递增的。**如果一个颜色中间点的位置比前一个小，那么将会被设定成与前一个相同的值。**

  如果第一个颜色中间点没有位置属性,那么它默认为0%。如果最后一个颜色中间点没有位置属性, 则默认为100%。如果一个既不是起始也不是终止的颜色中间点，没有被明确声明位置，那么这个颜色就会从前后两个颜色的中间位置开始。

- `<color-hint>`

  定义了在相邻`<linear-color-stop>`之间过渡的中点，默认值50%。**注：相邻两个`<linear-color-stop>`之间只能有一个过渡点。**

```css
background-image: linear-gradient(#e66465, #9198e5); /*下图左，与【#e66465, 50%, #9198e5】等价*/
background-image: linear-gradient(#e66465, 10%, #9198e5); /*下图中*/
background-image: linear-gradient(#fb3 40%, #e66465 30%, #9198e5); /*下图右*/
```

![image-20200716232328505](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200716232328505.png)



#### 示例 [查看DEMO](https://1927344728.github.io/fed-knowledge/demo/13-gradient.html)

```html
<section>
    <div class="flex_box">
        <div class="flex_item"></div>
        <div class="flex_item"></div>
        <div class="flex_item"></div>
        <div class="flex_item"></div>
    </div>
</section>
```

```css
<style>
    .flex_item {
        display: inline-block;
        width: 200px;
        height: 200px;
        margin-right: 15px;
        border: 1px solid #0aa;
        background-image: linear-gradient(#e66465, #9198e5);
    }
    .flex_item:nth-child(2) {
        background-image: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
    }
    .flex_item:nth-child(3) {
        background-image: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
    }
    .flex_item:nth-child(4) {
        background-image: linear-gradient(#3f87a6 33.33%, #fb3 0, #fb3 66.66%, #e45b5a 0);
        background-size: 100% 42px;
    }
</style>
```

![image-20200716234706958](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200716234706958.png)



### 径向渐变

颜色值由一个中心点（原点）向外扩散并逐渐过渡到其他颜色值。由`radial-gradient()`函数产生。

#### 语法

```css
radial-gradient([ <shape> [<extent-keyword> | <size>] at <position> ]? <linear-color-stop> [<color-hint>] <linear-color-stop> ... )
```

* `<position>`

  表示用于设置相对于框的位置的`2D`空间中的坐标，即x轴、y轴坐标，默认值`center`。

  取值：关键字（`left, right, top, bottom or center`），或者百分比，或是一个绝对的长度值

  如：`left`、`left top`、`left center`、`center top`、`50%`、`100px`、`5rem`等。x轴、y轴都是关键字时，顺序无影响。

* `<shape>`
  渐变的形状，默认值`ellipse`（椭圆）。

  取值：`ellipse`（椭圆）、`circle`（正圆）

* `<size>`
  渐变圆的半径长度。

   当渐变类型为 `circle` 时，只能指定一个`size`值，值必需为具体的长度值，即直径；当渐变类型为 `ellopse`时，可以指定两个`size`值，即水平半径，垂直半径，值可以为具体的长度值或者百分比。

* `<extent-keyword>`
  关键字用于描述边缘轮廓的具体位置。以下为关键字常量：

  | 常量              | 描述                                                         |
  | :---------------- | :----------------------------------------------------------- |
  | `closest-side`    | 渐变的边缘形状与容器距离渐变中心点最近的一边相切（圆形）或者至少与距离渐变中心点最近的垂直和水平边相切（椭圆）。 |
  | `closest-corner`  | 渐变的边缘形状与容器距离渐变中心点最近的一个角相交。         |
  | `farthest-side`   | 与closest-side相反，边缘形状与容器距离渐变中心点最远的一边相切（或最远的垂直和水平边）。 |
  | `farthest-corner` | 渐变的边缘形状与容器距离渐变中心点最远的一个角相交。         |

- `<linear-color-stop>`

  颜色终止点，由`<颜色值 位置>`组成，位置可不写。如：`#e66465`、`#e66465 50%`、`#e66465 100px`等。可写两个或多个颜色终止点。

  颜色终止列表中颜色的终止点应该是依次递增的。**如果一个颜色中间点的位置比前一个小，那么将会被设定成与前一个相同的值。**

  如果第一个颜色中间点没有位置属性,那么它默认为0%。如果最后一个颜色中间点没有位置属性, 则默认为100%。如果一个既不是起始也不是终止的颜色中间点，没有被明确声明位置，那么这个颜色就会从前后两个颜色的中间位置开始。

- `<color-hint>`

  定义了在相邻`<linear-color-stop>`之间过渡的中点，默认值50%。

#### 示例 [查看DEMO](https://1927344728.github.io/fed-knowledge/demo/13-gradient.html?type=2)

```html
<section>
    <div class="flex_box2">
        <div class="flex_item2"></div>
        <div class="flex_item2"></div>
        <div class="flex_item2"></div>
        <div class="flex_item2"></div>
        <div class="flex_item2"></div>
        <div class="flex_item2"></div>
    </div>
</section>
```

```css
<style>
    .flex_item2 {
        display: inline-block;
        width: 200px;
        height: 200px;
        margin-right: 15px;
        border: 1px solid #0aa;
        background-image: radial-gradient(#ff0, #9198e5);
    }
    .flex_item2:nth-child(2) {
        background-image: radial-gradient(at top, #ff0, #9198e5);
    }
    .flex_item2:nth-child(3) {
        background-image: radial-gradient(circle at top, #ff0, #9198e5);
    }
    .flex_item2:nth-child(4) {
        background-image: radial-gradient(circle closest-corner at top, #ff0, #9198e5);
    }
    .flex_item2:nth-child(5) {
        background-image: radial-gradient(ellipse 50px 50px at top, #ff0, #9198e5);
    }
    .flex_item2:nth-child(6) {
        background-image: radial-gradient(#3f87a6 33.33%, #fb3 0, #fb3 66.66%, #e45b5a 0);
        background-size: 42px 42px;
    }
</style>
```

![image-20200717005804964](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200717005804964.png)



### 圆锥渐变

圆锥渐变创建一个图像，由一个梯度组成，颜色起始点是图形中心，然后以顺时针方向绕中心实现渐变效果（而不是从中心辐射）。由`conic-gradient()`函数产生。

#### 语法

```css
conic-gradient([ from <angle> ]? [ at <position> ]?, <angular-color-stop> [<color-hint>] <angular-color-stop> ... ) )
```

* `<angle>`

  颜色围绕中心点旋转的角度值，可不写，默认值为`0deg`（指向北方）。

* `<position>`

  表示用于设置相对于框的位置的`2D`空间中的坐标，即x轴、y轴坐标，默认值`center`。

  取值：关键字（`left, right, top, bottom or center`），或者百分比，或是一个绝对的长度值

  如：`left`、`left top`、`left center`、`center top`、`50%`、`100px`、`5rem`等。x轴、y轴都是关键字时，顺序无影响。

* `<angular-color-stop>`
  颜色终止点，由`<颜色值 角度>`组成，位置可不写。如：`#e66465`、`#e66465 90deg`、`#e66465 0.25turn`、`#e66465 0.25turn 0.75turn`等。可写两个或多个颜色终止点。

* `<color-hint>`

  定义了在相邻`<angular-color-stop>`之间过渡的中点，默认值`50%`。

#### 示例 [查看DEMO](https://1927344728.github.io/fed-knowledge/demo/13-gradient.html?type=3)

```html
<section>
    <div class="flex_box3">
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
        <div class="flex_item3"></div>
    </div>
</section>
```

```css
<style>
    .flex_item3 {
        display: inline-block;
        width: 200px;
        height: 200px;
        margin-right: 15px;
        border: 1px solid #0aa;
        background-image: conic-gradient(red, orange, yellow, green, teal, blue, purple);
    }
    .flex_item3:nth-child(2) {
        background-image: conic-gradient(from 40deg, red 0deg, orange 90deg, yellow 180deg, green 270deg, blue 360deg)
    }
    .flex_item3:nth-child(3) {
        background-image: conic-gradient(from 40deg at 25% 25%, red 0deg, orange 90deg, yellow 180deg, green 270deg, blue 360deg)
    }
    .flex_item3:nth-child(4) {
        background-image: conic-gradient(red 36deg, orange 36deg 170deg, yellow 170deg);
    }
    .flex_item3:nth-child(5) {
        background-image: conic-gradient(red 12.5%, orange 0 37.5%, red 0 62.5%, orange 0 87.5%, red 0);
        background-size: 50px 50px;
    }
    .flex_item3:nth-child(6) {
        background-image: conic-gradient(#3f87a6 33.33%, #fb3 0, #fb3 66.66%, #e45b5a 0);
        background-size: 42px 42px;
    }
    .flex_item3:nth-child(7) {
        position: relative;
        background: conic-gradient(rgba(255,152,0,1) 0, rgba(255,152,0,0) 100%);
        border: 0;
        text-align: center;
        vertical-align: top;
    }
    .flex_item3:nth-child(7):after {
        position: absolute;
        top: 10%;
        left: 10%;    
        display: block;
        width: 80%;
        height: 80%;
        content: " ";
        background: #fff;
    }
</style>
```

![image-20200724230512764](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200724230512764.png)



### 重复渐变

重复多次渐变图案直到足够填满指定元素。

#### 重复线性渐变

 `repeating-linear-gradient()`创建一个由重复线性渐变组成的`<image>`， 这是一个类似` linear-gradient` 的函数，并且**采用相同的参数**，但是它会在所有方向上重复渐变以覆盖其整个容器。

#### 重复径向渐变

`repeating-radial-gradient()` 创建一个从原点辐射的重复渐变组成的`<image>` 。它类似于`radial-gradient `并且**采用相同的参数**，但是它会在所有方向上重复颜色，以覆盖其整个容器。

#### 重复圆锥渐变

`repaeting-conic-gradient` 创建一个颜色过渡旋转围绕中心点的重复渐变组成的`<image>` 。重复圆锥渐变语法与`conic-gradient()`相似。

#### 示例 [查看DEMO](https://1927344728.github.io/fed-knowledge/demo/13-gradient.html?type=4)

```html
<section>
    <div class="flex_box4">
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
        <div class="flex_item4"></div>
    </div>
</section>
```

```css
<style>
    .flex_item4 {
        display: inline-block;
        width: 200px;
        height: 200px;
        margin-right: 15px;
        border: 1px solid #0aa;
        background-image:  repeating-linear-gradient(-45deg, transparent, transparent 25px, orange 25px, orange 50px);
    }
    .flex_item4:nth-child(2) {
        background-image:
            repeating-linear-gradient(transparent, transparent 23%, orange 23%, orange 27%),
            repeating-linear-gradient(90deg, transparent, transparent 23%, orange 23%, orange 27%);
    }
    .flex_item4:nth-child(3) {
        background-image: repeating-radial-gradient(red, yellow 10%, green 15%);
    }
    .flex_item4:nth-child(4) {
        background-image: repeating-radial-gradient(circle, red, red 10px, yellow 10px, yellow 20px);
        background-size: 25px;
    }
    .flex_item4:nth-child(5) {
        background-image: repeating-conic-gradient(red 0 9deg, yellow 9deg 18deg);
    }
    .flex_item4:nth-child(6) {
        background-image: repeating-conic-gradient(red 0 9deg, yellow 9deg 18deg);
        background-size: 50px 50px;
    }
</style>
```

![image-20200725001722017](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200725001722017.png)

### 其他渐变 [查看DEMO](https://1927344728.github.io/fed-knowledge/demo/13-gradient.html?type=5)

```html
<section>
    <div class="flex_box5">
        <div class="flex_item5"></div>
        <div class="flex_item5">愿你走出</div>
        <div class="flex_item5" text="半生归来">半生归来</div>
        <div class="flex_item5">
            <svg viewBoxs="0 0 500 300" class="svgBox">
                <defs>
                    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="50">
                        <stop  offset="0" style="stop-color: red"/>
                        <stop  offset="1" style="stop-color: orange"/>
                    </linearGradient>
                </defs>
                <text text-anchor="middle" class="gradient-text-three" x="110px" y="30%">仍是少年</text>
            </svg>
        </div>
    </div>
</section>
```

```css
<style>
    .flex_item5 {
        display: inline-block;
        width: 200px;
        height: 200px;
        margin-right: 15px;
        vertical-align: middle;
    }
	/*边框渐变*/
    .flex_item5:nth-child(1) {
        border: 10px solid transparent;
        border-image: linear-gradient(to top, red, orange);
        border-image-slice: 10;
    }
	/*文字渐变：方法一*/
    .flex_item5:nth-child(2) {
        height: 60px;
        font-size: 42px;
        background-image: linear-gradient(to top, red, orange);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
	/*文字渐变：方法二*/
    .flex_item5:nth-child(3) {
        height: 60px;
        font-size: 42px;
        position: relative;
        color: red;
    }
    .flex_item5:nth-child(3):before {
        position: absolute;
        color: orange;
        -webkit-mask: linear-gradient(to top, red, transparent);
        content: attr(text);
        z-index: 1;
    }
	/*文字渐变：方法三*/
    .flex_item5:nth-child(4) {
        height: 60px;
    }
    .flex_item5:nth-child(4) .gradient-text-three {
        fill: url(#SVGID_1_);
        font-size: 48px;
    }
</style>
```

![image-20200727221512513](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/css/image-20200727221512513.png)



### 参考链接

[MDN 使用 CSS 渐变](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Using_CSS_gradients)

[MDN linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/linear-gradient)

[神奇的 conic-gradient 圆锥渐变](https://www.cnblogs.com/coco1s/p/7079529.html)

[复杂的css背景图](https://bennettfeely.com/gradients/)