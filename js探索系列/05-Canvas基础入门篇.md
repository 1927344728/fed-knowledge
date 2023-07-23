# Canvas基础入门篇

Canvas API 提供了一个通过 JavaScript 和 HTML 的 canvas 元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

Canvas API 主要聚焦于2D图形。而同样使用 canvas 元素的 WebGL API 则用于绘制硬件加速的 2D 和 3D 图形。

### 获取渲染上下文(2D环境)

除一些过时的浏览器不支持 canvas 元素外，所有的新版本主流浏览器都支持它。Canvas 的默认大小为 300px X 150px。但是，可以使用 HTML 的高度和宽度属性来自定义 Canvas 的尺寸。为了在 Canvas 上绘制图形，先使用一个 JavaScript 上下文对象，它能动态创建图像。

**注意：** CSS  中的 width、height 控制的是画布在文档中的宽高，当宽度比例与 canvas 属性中定义的宽度不一致时，会拉伸 Canvas 元素，相当于把固定的图片拉伸了。

```html
<div class="flex_box">
    <canvas id="canvas" class="flex_item" width="500" height="500"></canvas>
</div>
```

```js
const canvas = document.getElementById("canvas_base")
const context = canvas.getContext("2d")
```

```js
function getContext2D () {
    return new Promise((resolve, reject) => {
        const canvas = document.getElementById("canvas_base")
        const context = canvas.getContext("2d")
        if (context) {
            resolve(context)
        } else {
            reject()
        }
    })
}
```

### 状态的保存和恢复

Canvas 是基于状态的绘制，包括：当前应用的变形、当前的裁切路径、以及以下属性：

```shell
strokeStyle
fillStyle
globalAlpha
lineWidth
lineCap
lineJoin
miterLimit
lineDashOffset
shadowOffsetX
shadowOffsetY
shadowBlur
shadowColor
globalCompositeOperation
font
textAlign
textBaseline
direction
imageSmoothingEnabled
```

Canvas 可通过以下方法管理状态：

* save()：保存画布的所有状态
* restore()：save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。

Canvas 状态存储在栈中，每当 save() 方法被调用后，当前的状态就被推送到栈中保存。

### 从线条开始

**移动画笔：**

```js
context.moveTo(x, y)
```

> 这句代码的意思是**移动画笔至(x, y)这个点（单位是px）**。记住，这里是以 **canvas 画布的左上角为笛卡尔坐标系的原点，且y轴的正方向向下，x轴的正方向向右。**

**笔画停点：**

```js
context.lineTo(x, y)
```

> 这句的意思是从**上一笔的停止点**绘制到(x, y)这里。不过要清楚，这里的 moveTo()、lineTo() 都只是状态而已，是规划，是我准备要画，还没有开始画，只是一个计划而已！

**选择画笔：**

```js
context.lineWidth = 2        // 设置画笔(线条)的粗细为2px
context.fillStyle = "#0dd"   // 设置或返回用于填充绘画的颜色、渐变或模式
context.strokeStyle = "#0dd" // 设置或返回用于笔触的颜色、渐变或模式
```

> Canvas是基于状态的绘制，所以我们在选择画笔粗细和颜色的同时，其实也是选择了线条的粗细和颜色。

**确定绘制：**

**确定绘制只有两种方法，fill() 和 stroke() **，前者是指填充，后者是指描边。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802152344385.png" alt="image-20200802152344385" style="zoom: 50%;" />

```js
// 绘制线条：青色
function drawLine (context) {
    context.moveTo(100, 100)
    context.lineTo(300, 200)
    context.lineWidth = 2
    context.strokeStyle = "#0dd"
    context.stroke()
}

// 绘制折线：粉红 -> 深蓝
function drawBrokenLine (context) {
    context.lineWidth = 2

    context.moveTo(100, 100)
    context.lineTo(300, 300)
    context.strokeStyle = "#d0d"
    context.stroke()

    context.moveTo(300, 300)
    context.lineTo(100, 500)
    context.strokeStyle = "#00d"
    context.stroke()
}
getContext2D().then(context => {
    drawLine(context) 
    drawBrokenLine(context) 
})
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=1)

期待绘制结果：第一条线是青色，第二条线是粉红色，第三条线是深蓝。 然而，最终绘制结果：三条线都是深蓝色。这里的原因就是前面强调——**Canvas是基于状态的绘制**。

什么意思呢？就是说每当状态发生改变，Canvas 会重新渲染。

从上面示例来说：每次使用 stroke() 时，它都会把之前设置的状态再绘制一遍。如，第一次 stroke() 时，绘制一条青色的折线；第二次 stroke() 时，会再重新绘制之前的那条青色的折线，但是这个时候的画笔已经被更换成粉红色的了，所以画出的折线全是粉红色的；第三次 stroke() 同理，画笔更换成了深蓝色，所以最终三条线都是深蓝！

实际上，这里看到的三条折线，其实绘制了 3 次，一共绘制了 6 条折线。

**创建新路径：**

beginPath() 是 Canvas 2D API 通过清空子路径列表开始一个新路径的方法。

在每次绘制之前加上 beginPath() ，表示下次绘制的起始处为 beginPath() 之后的代码。beginPath()  设置的绘制状态的作用域结束于 stroke()、fill() 或者 closePath() 方法。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802152715047.png" alt="image-20200802152715047" style="zoom:50%;" />

```js
function drawMultBrokenLine (context) {
    context.lineWidth = 2

    context.beginPath()
    context.moveTo(100, 100)
    context.lineTo(300, 200)
    context.strokeStyle = "#0dd"
    context.stroke()

    context.beginPath()
    context.moveTo(100, 100)
    context.lineTo(300, 300)
    context.strokeStyle = "#d0d"
    context.stroke()

    context.beginPath()
    context.moveTo(300, 300)
    context.lineTo(100, 500)
    context.strokeStyle = "#00d"
    context.stroke()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=2)

**线条属性概述：**

lineCap 属性定义上下文中线的端点，可以有以下 3 个值：

- butt：默认值，端点是垂直于线段边缘的平直边缘。
- round：端点是在线段边缘处以线宽为直径的半圆。
- square：端点是在选段边缘处以线宽为长、以一半线宽为宽的矩形。

lineJoin 属性定义两条线相交产生的拐角，可将其称为连接。在连接处创建一个填充三角形，可以使用 lineJoin 设置它的基本属性。

- miter：默认值，在连接处边缘延长相接。miterLimit 是角长和线宽所允许的最大比例(默认是 10)。
- bevel：连接处是一个对角线斜角。
- round：连接处是一个圆。

lineWidth 属性定义线的宽度（默认值为 1.0）。

strokeStyle 属性定义线和形状边框的颜色和样式。

### 填充颜色

**基本颜色：**

```js
context.fillStyle = "red"
context.fillStyle = "#FF0000"
context.fillStyle = "#F00"
context.fillStyle = "rgb(255,0,0)"
context.fillStyle = "rgba(255,0,0,1)"
context.fillStyle = "hsl(0,100%,50%)"
context.fillStyle = "hsla(0,100%,50%,1)"
```

**线性渐变：**

```js
const gradient = context.createLinearGradient(x0,y0,x1,y1)
// x0 渐变开始点的 x 坐标
// y0 渐变开始点的 y 坐标
// x1 渐变结束点的 x 坐标
// y1 渐变结束点的 y 坐标

gradient.addColorStop(stop, color)
// stop  介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置。
// color 在结束位置显示的 CSS 颜色值
```

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802153043369.png" alt="image-20200802153043369" style="zoom:50%;" />

```js
function createLinearGradient (context) {
    context.rect(100, 100, 300, 300);
    let grd = context.createLinearGradient(100, 100, 300, 300)
    grd.addColorStop(0, "#dd0")
    grd.addColorStop(0.5, "#fd0")
    grd.addColorStop(1, "#0dd")
    context.fillStyle = grd
    context.fill()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=3)

**径向渐变：**

```js
const gradient = context.createRadialGradient(x0,y0,r0,x1,y1,r1)
// x0 渐变的开始圆的 x 坐标
// y0 渐变的开始圆的 y 坐标
// r0 开始圆的半径
// x1 渐变的结束圆的 x 坐标
// y1 渐变的结束圆的 y 坐标
// r1 结束圆的半径

gradient.addColorStop(stop, color)
// stop  介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置。
// color 在结束位置显示的 CSS 颜色值
```

![image-20200802153527937](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802153527937.png)

```js
function createRadialGradient (context) {
    let grd = context.createRadialGradient(75, 50, 5, 90, 60, 100)
    grd.addColorStop(0, "#0aa")
    grd.addColorStop(1, "white")
    context.fillStyle = grd
    context.fillRect(10, 10, 300, 300)
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=4)

**填充纹理：** 纹理其实就是图案的重复，填充图案通过 createPattern() 函数进行初始化。

```js
context.createPattern(image,"repeat|repeat-x|repeat-y|no-repeat")
// 第一个参数：Image对象、canvas对象、video对象
// 平面上重复：repeat;
// x轴上重复：repeat-x;
// y轴上重复：repeat-y;
// 不使用重复：no-repeat;
```

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802154344739.png" alt="image-20200802154344739" style="zoom: 67%;" />

```js
function createPattern (context) {
    let canvas = document.createElement("canvas")
    let context2 = canvas.getContext('2d')
    canvas.width = 200
    canvas.height = 200
    let img = new Image()
    img.src = "./img/pins_3338674420.jpg"
    img.onload = function() {
        context2.drawImage(img, 0, 0, 200, 200)
        let pattern = context.createPattern(canvas, 'no-repeat')
        context.fillStyle = pattern
        context.fillRect(0, 0, 500, 500)
        context.lineWidth = 1
        context.strokeStyle = '#0dd'
        context.strokeRect(0, 0, 500, 500)
    }
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=5)

### 绘制矩形

```js
context.rect(x,y,width,height)/
context.fillRect(x,y,width,height)
context.strokeRect(x,y,width,height)
context.clearRect(x,y,width,height)
// x 矩形左上角的 x 坐标
// y 矩形左上角的 y 坐标
// width  矩形的宽度，以像素计
// height 矩形的高度，以像素计
```

### 绘制标准圆弧

```js
context.arc(x,y,r,sAngle,eAngle,counterclockwise);
// x 圆的中心的 x 坐标。
// y 圆的中心的 y 坐标。
// r 圆的半径。
// sAngle 起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
// eAngle 结束角，以弧度计。
// counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针(默认)，true = 逆时针。
```

```javascript
context.arcTo(x1,y1,x2,y2,r);
// x1 弧的起点的 x 坐标
// y1 弧的起点的 y 坐标
// x2 弧的终点的 x 坐标
// y2 弧的终点的 y 坐标
// r  弧的半径
```

![image-20200802154748374](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802154748374.png)

```js
function drawArc (context) {
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = '#0dd'
    context.arc(100, 75, 100, 0,  (120 / 180) * Math.PI, false)
    context.stroke()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=6)

![image-20200802154936529](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802154936529.png)

```js
function drawArcTo (context) {
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = '#0dd'
    context.moveTo(20, 20)
    context.lineTo(100, 20)
    context.arcTo(150, 20, 150, 70,50)
    context.lineTo(150, 100)
    context.stroke()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=7)

### 贝塞尔曲线

#### 二次贝塞尔曲线

```JS
context.quadraticCurveTo(cpx,cpy,x,y);
// cpx 贝塞尔控制点的 x 坐标
// cpy 贝塞尔控制点的 y 坐标
// x   结束点的 x 坐标
// y   结束点的 y 坐标
```

> 二次贝塞尔曲线需要两个点。第一个点是用于二次贝塞尔计算中的控制点，第二个点是曲线的结束点。曲线的开始点是当前路径中最后一个点。如果路径不存在，那么请使用 beginPath()  和 moveTo() 方法来定义开始点

![image-20200802160540181](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802160540181.png)

```JS
function drawQuadraticCurveTo (context) {
    context.lineWidth = 1
    context.strokeStyle = '#0dd'
    context.beginPath()
    context.moveTo(20, 20)
    context.quadraticCurveTo(20, 100, 200, 20)
    context.stroke()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=8)

#### 三次贝塞尔曲线

```JS
context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
// cp1x	第一个贝塞尔控制点的 x 坐标
// cp1y	第一个贝塞尔控制点的 y 坐标
// cp2x	第二个贝塞尔控制点的 x 坐标
// cp2y	第二个贝塞尔控制点的 y 坐标
// x	结束点的 x 坐标
// y	结束点的 y 坐标
```

> 三次贝塞尔曲线需要三个点。前两个点是用于三次贝塞尔计算中的控制点，第三个点是曲线的结束点。曲线的开始点是当前路径中最后一个点。如果路径不存在，那么请使用 beginPath()  和 moveTo() 方法来定义开始点。

### 文本设置

```js
font	     // 设置或返回文本内容的当前字体属性
textAlign	 // 设置或返回文本内容的当前对齐方式
textBaseline // 设置或返回在绘制文本时使用的当前文本基线

context.font = "[font-style] [font-variant] [font-weight] [font-size/line-height] [font-family]"
// font-style    // 规定字体样式：normal\italic\oblique
// font-variant  // 规定字体变体：normal\small-caps
// font-weight   // 规定字体的粗细：normal\bold\bolder\lighter\100~900
// font-size/line-height // 规定字号和行高，以像素计。
// font-family   // 规定字体系列。

context.textAlign = "center|end|left|right|start"
// 默认。  文本在指定的位置开始。
// end    文本在指定的位置结束。
// center 文本的中心被放置在指定的位置。
// left   文本左对齐。
// right  文本右对齐。

context.textBaseline = "alphabetic|top|hanging|middle|ideographic|bottom"
// alphabetic  默认。文本基线是普通的字母基线。
// top         文本基线是 em 方框的顶端。。
// hanging     文本基线是悬挂基线。
// middle      文本基线是 em 方框的正中。
// ideographic 文本基线是表意基线。
// bottom      文本基线是 em 方框的底端。
```

```js
fillText()    // 在画布上绘制“被填充的”文本
strokeText()  // 在画布上绘制文本（无填充）
measureText() // 返回包含指定文本宽度的对象

context.fillText(text,x,y,maxWidth)
context.strokeText(text,x,y,maxWidth)
// text     规定在画布上输出的文本。
// x        开始绘制文本的 x 坐标位置（相对于画布）。
// y        开始绘制文本的 y 坐标位置（相对于画布）。
// maxWidth 可选。允许的最大文本宽度，以像素计。
```

![image-20200802160727162](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802160727162.png)

```js
function drawText (context) {
    context.fillStyle = "#0aa"
    context.strokeStyle = "#0aa"

    context.font = "normal normal bold 30px/150px Times"
    context.textAlign = "center"
    context.textBaseline = "middle"

    context.fillText("Hello Canvas", 200, 250)
    context.strokeText("width:" + context.measureText("Hello Canvas").width, 200, 300, 200)
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=9)

### 变换设置

```js
context.scale(scalewidth,scaleheight);
// scalewidth  缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%, 依次类推)
// scaleheight 缩放当前绘图的高度 (1=100%, 0.5=50%, 2=200%, etc.)

context.rotate(angle);
// angle	旋转角度，以弧度计。
// 如需将角度转换为弧度，请使用 degrees*Math.PI/180 公式进行计算。
// 举例：如需旋转 5 度，可规定下面的公式：5*Math.PI/180。

context.translate(x,y);
// x 添加到水平坐标（x）上的值
// y 添加到垂直坐标（y）上的值
```

> 对于缩放变换有两点问题需要注意：
>
> 1.缩放时，图像左上角坐标的位置也会对应缩放
>
> 2.缩放时，图像线条的粗细也会对应缩放

```js
context.transform(a,b,c,d,e,f);
context.setTransform(a,b,c,d,e,f);
// a 水平缩放(1)
// b 水平倾斜(0)
// c 垂直倾斜(0)
// d 垂直缩放(1)
// e 水平位移(0)
// f 垂直位移(0)

// 平移变换： x’ = x + dx， y’ = y + dy。
// 也即是说可以使用 context.transform (1,0,0,1,dx,dy)代替context.translate(dx,dy)。

// 同理可以使用 context.transform(sx,0,0,sy,0,0)代替context.scale(sx, sy);
// 也可以使用context.transform(0,sy,sx,0,0,0);

// context.transform(Math.cos(θ*Math.PI/180)，Math.sin(θ*Math.PI/180), -Math.sin(θ*Math.PI/180),Math.cos(θ*Math.PI/180)，0，0）可以替代context.rotate(θ)。

// 也可以使用 context.transform(-Math.sin(θ*Math.PI/180),Math.cos(θ*Math.PI/180)， Math.cos(θ*Math.PI/180)，Math.sin(θ*Math.PI/180)，0，0）替代。

// 区别：transform()变换是指在上一次变换的状态基础上再次变换；setTransform()变换是指先重置到最初始的状态再开始变换。
```

![image-20200802162108256](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802162108256.png)

```js
function transform (context) {
    context.save()
    context.fillStyle = "#0aa"
    context.scale(1, 0.5)
    context.rotate(10 * Math.PI / 180)
    context.translate(20, 0)
    context.fillRect(0, 0, 150, 150)
    console.log('scale')
    context.restore()

    //transform
    context.save()
    context.translate(100, 0)
    context.fillStyle = "yellow"
    context.fillRect(0, 0, 150, 100)

    context.transform(1, 0.5, -0.5, 1, 30, 10)
    context.fillStyle = "red"
    context.fillRect(0, 0, 150, 100)

    context.transform(1, 0.5, -0.5, 1, 30, 10)
    context.fillStyle = "blue"
    context.fillRect(0, 0, 150, 100)
    context.restore()

    //setTransform
    context.save()
    context.translate(400, 0)
    context.fillStyle = "yellow"
    context.fillRect(0, 0, 150, 100)

    context.setTransform(1, 0.5, -0.5, 1, 100, 0)
    context.fillStyle = "red"
    context.fillRect(0, 0, 150, 100)

    context.setTransform(1, 0.5, -0.5, 1, 100, 0)
    context.fillStyle = "blue"
    context.fillRect(0, 0, 150, 100)
    context.restore()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=10)

> 注意保存和恢复Canvas状态
>
> 变换只会影响 transform() 等方法调用之后的绘图

### 裁剪区域

clip() 方法来实现 Canvas 的图像裁剪功能。该方法使用路径来对Canvas画布设置一个裁剪区域。因此，必须先创建好路径。创建完整后，调用 clip() 方法来设置裁剪区域。

需要注意的是**裁剪是对画布进行的，裁切后的画布不能恢复到原来的大小**，也就是说画布是越切越小的，要想保证最后仍然能在canvas最初定义的大小下绘图需要注意 save() 和 restore() 。画布是先裁切完了再进行绘图。并不一定非要是图片，路径也可以放进去~。

![image-20200802162403917](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802162403917.png)

```js
function setClip (context) {
    context.save()
    context.beginPath()
    context.fillStyle = '#0aa'
    context.arc(100, 100, 100, 2 * Math.PI, false)
    context.clip()
    let img = new Image()
    img.src = require("@/assets/image/01eb485e44bf8fa8012165187fa336.jpg@1280w_1l_2o_100sh.jpg")
    img.onload = function() {
        context.drawImage(img, 0, 0, 350, 250)
        context.closePath()
        context.restore()

        context.beginPath()
        context.moveTo(100, 100)
        context.lineTo(300, 100)
        context.strokeStyle = '#0aa'
        context.stroke()
        context.closePath()
    }
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=11)

### 绘制图像

Canvas 更有意思的一项特性就是图像操作能力。可以用于动态的图像合成或者作为图形的背景，以及游戏界面等等。浏览器支持的任意格式的外部图片都可以使用，比如 PNG、GIF、JPEG。 你甚至可以将同一个页面中其他 Canvas 元素生成的图片作为图片源。

Canvas 的 API 可以使用下面这些类型中的一种作为图片的源：

* HTMLImageElement：Image() 函数构造出来的，或者任何的 img 元素。
* HTMLVideoElement： video 元素作为图片源，可以从视频中抓取当前帧作为一个图像。
* HTMLCanvasElement：可以使用另一个 Canvas 元素作为图片源。
* ImageBitmap：一个高性能的位图。

这些源统一由 CanvasImageSource 类型来引用。

```js
context.drawImage(img,x,y)
context.drawImage(img,x,y,width,height)
context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)

// img     规定要使用的图像、画布或视频。
// sx      可选。开始剪切的 x 坐标位置。
// sy      可选。开始剪切的 y 坐标位置。
// swidth  可选。被剪切图像的宽度。
// sheight 可选。被剪切图像的高度。
// x       在画布上放置图像的 x 坐标位置。
// y       在画布上放置图像的 y 坐标位置。
// width   可选。要使用的图像的宽度。（伸展或缩小图像）
// height  可选。要使用的图像的高度。（伸展或缩小图像）
```

![image-20200802162553067](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802162553067.png)

```js
function drawImage (context) {
    let img = new Image()
    img.src = "./img/pins_3338674420.jpg"
    img.onload = function() {
        // context.drawImage(img, 0, 0, 500, 500, 0, 0, window.innerWidth, window.innerHeight)
        context.drawImage(img, 0, 0, 350, 250)
    }
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=12)

### 非零环绕原则与奇偶原则

我们一般使用Canvas的fill方法时，是直接进行填充路径。其实fill方法有两个参数可选：nonzero | evenodd。nonzero - 非零环绕原则，也是默认值；evenodd - 奇偶原则。

##### 非零环绕原则nonzero

```js
是用来判断哪些区域属于路径内( 计算结果非0，即为路径内 )。
* 在路径包围的区域中，随便找一点，向外发射一条射线，
* 和所有围绕它的边相交，
* 然后开启一个计数器，从0计数，
* 如果这个射线遇到顺时针围绕，那么+1，
* 如果遇到逆时针围绕，那么-1，
* 如果最终值非0，则这块区域在路径内。结果为0，代表这块区域不要填充，否则，必须填充
```

##### 奇偶原则

```js
* 在路径包围的区域中，随便找一点，向外发射一条射线，
* 和所有围绕它的边相交，
* 查看相交线的个数，如果为奇数，就填充，如果是偶数，就不填充
```

![image-20200802162859005](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802162859005.png)

```js
drawCircular (context) {
    context.shadowColor = "#545454";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 2;
    context.globalCompositeOperation = 'source-over'

    context.fillStyle = "#00AAAA"
    context.arc(200, 200, 100, 0, Math.PI * 2 ,false)
    context.arc(200, 200, 115, 0, Math.PI * 2 ,true)
    context.fill()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=13)

### 其他属性

**阴影设置：**

```js
shadowColor   // 设置或返回用于阴影的颜色
shadowBlur    // 设置或返回用于阴影的模糊级别
shadowOffsetX // 设置或返回阴影距形状的水平距离
shadowOffsetY // 设置或返回阴影距形状的垂直距离
```

> 需要注意的是，这里的阴影同其他属性设置一样，都是基于状态的设置。因此，如果只想为某一个对象应用阴影而不是全局阴影，需要在下次绘制前重置阴影的这四个属性。

**全局透明：**

```js
globalAlpha
// 默认值为1.0，代表完全不透明，取值范围是0.0（完全透明）~1.0。这个属性与阴影设置是一样的，如果不想针对全局设置不透明度，就得在下次绘制前重置globalAlpha。
```

**橡皮擦：**

```js
context.clearRect(x,y,w,h)
// 清空指定矩形上的画布上的像素。它接受四个参数，和其他绘制矩形的方法一样
```

**检测点：**

isPointInPath 用于判断在当前路径中是否包含检测点的方法。

```js
isPointInPath(x, y)
isPointInPath(x, y, fillRule)
isPointInPath(path, x, y)
isPointInPath(path, x, y, fillRule)

/*
x：检测点的 X 坐标
y：检测点的 Y 坐标
fillRule：用来决定点在路径内还是在路径外的算法，允许的值：
	nonzero - 非零环绕规则，默认的规则
	evenodd - 奇偶环绕原则
path：Path2D 应用的路径
*/
```

### 绘制圆角矩形

![image-20200802163558011](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802163558011.png)

```js
function roundRect (ctx, x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2){
        r = min_size / 2
    }
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
}
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=14)

### 绘制圆角图片

![image-20200802173138214](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802173138214.png)

![image-20200802173158563](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802173158563.png)

```js
function drawRoundImg (ctx, x, y, w, h, r) {
    ctx.save();
    let img = new Image()
    img.src = "./img/pins_3338674420.jpg"
    img.onload = function() {
        roundRect(ctx, x, y, w, h, r)
        ctx.clip();
        ctx.drawImage(img, x, y, w, h)
        ctx.restore()
    }
}

function drawRoundImg2 (ctx, x, y, w, h, r) {
    ctx.save();
    let img = new Image()
    img.src = "./img/pins_3338674420.jpg"
    img.onload = function() {
        let pattern = ctx.createPattern(img, "no-repeat");
        roundRect(ctx, x, y, w, h, r)
        ctx.fillStyle = pattern
        ctx.fill()
    }
}
```

[查看DEMO 圆角图片1](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=15) [查看DEMO 圆角图片2](https://1927344728.github.io/demo-lizh/html/10-canvas.html?type=16)

### 参考链接

[Canvas API中文文档首页地图](https://www.canvasapi.cn/)

[MDN - canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

[原生HTML5 Canvas 参考API文档](https://blog.csdn.net/zeping891103/article/details/72730968)

[canvas](http://caibaojian.com/canvas/)