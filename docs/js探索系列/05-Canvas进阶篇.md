## Canvas进阶篇

Canvas 是一个可以使用脚本（通常为 JavaScript）来绘制图形的 HTML 元素。例如，它可以用于绘制图表、制作图片构图或者制作简单的动画。

### Canvas 事件监听

你是否需要一个在 Canvas 画布上的任意图形的点击事件监听？但是 Canvas 没有此类监听器的 API。你只能在整个 Canvas 画布上进行事件监听，而不是在画布上的任意一个元素。

#### 方式一：利用数学的力量

以监听 canvas 中一个圆圈为例：当拥有圆圈的坐标和尺寸（半径）信息，我们可以利用数学方式通过简单计算来检测在任意一个圆圈上的点击。我们所需要的就是获取到鼠标点击位置的坐标信息，并且跟所有的圆圈逐一进行相交检测。

这种方式非常普遍，并在许多项目中广泛使用，并且可以轻松找到更加复杂集合图形的数学函数（比如，矩形、椭圆、多边形等等）。

#### 方式二：模拟点击区域

点击区域的原理很简单：只需要获取点击区域的像素，并且找到拥有相同颜色的图形即可。

但是，这种方式可能无效，因为不同的图形可能拥有相同的颜色。为了避免这种问题，我们应该创建一个 “点击图形” canvas 画布。它与跟主 canvas 画布拥有几乎相同的图形，并且每一个图形都拥有唯一的颜色。

然后，我们需要绘制每个图形 2 次。第一次在主画布上（可见的），然后在 "点击" 画布上（不可见）。

当点击主 canvas 时，你需要做的就是获取到点击处的一个像素，然后在 '点击' canvas 上找到跟主 cavnas 同样位置的一个像素的颜色。

### 简单示例

![image-20230408182743759](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20230408182743759.png)

```html
<!-- 方式一：利用数学的力量 -->
<canvas id="canvas" width="500" height="300"></canvas>
<p class="tips"></p>
<script>
    const canvas = document.querySelector('canvas')
    const p = document.querySelector('p')
    const circleList = generateCircleList(5)
    drawCircle(ctx, circleList)
    canvas.addEventListener('mousedown', (event) => {
        const x = (event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) - canvas.offsetLeft;
        const y = (event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop) - canvas.offsetTop;
        circleList.forEach(e => {
            const pointY = Math.sqrt(Math.pow(e.radius, 2) - Math.pow(x - e.x, 2), 2)
            if (e.x - e.radius <= x && e.x + e.radius >= x && e.y - pointY <= y && e.y + pointY >= y) {
                canvas.style.borderColor = e.fillColor
                p.innerHTML = e.fillColor
                p.style.color = e.fillColor
            }
        });
    }, false);
</script>
```

[查看 Canvas 事件 DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html)

### Canvas 动画

#### 动画的基本步骤

可以通过以下的步骤来画出一帧：

* **清空 canvas：** 除非接下来要画的内容会完全充满 canvas（例如背景图），否则你不需要清空所有。最简单的做法就是用 clearRect 方法。
* **保存 canvas 状态：** 如果你要改变一些会改变 canvas 状态的设置（样式、变形之类的），又要在每画一帧之时都是原始状态的话，你需要先保存一下。
* **绘制动画图形（animated shapes） ：** 这一步才是重绘动画帧。
* **恢复 canvas 状态：** 如果已经保存了 canvas 的状态，可以先恢复它，然后重绘下一帧。

#### 操控动画

在 canvas 上绘制内容是用 canvas 提供的或者自定义的方法，而通常，我们仅仅在脚本执行结束后才能看见结果，比如说，在 for 循环里面做完成动画是不太可能的。

因此，为了实现动画，我们需要一些可以定时执行重绘的方法。有两种方法可以实现这样的动画操控：

* 通过 setInterval、setTimeout 方法来控制在设定的时间点上执行重绘。
* 通过 requestAnimationFrame 方法告诉浏览器你希望执行一个动画，并在重绘之前，请求浏览器执行一个特定的函数来更新动画。

**注：** requestAnimationFrame 方法提供了更加平缓并更加有效率的方式来执行动画，当系统准备好了重绘条件的时候，才调用绘制动画帧。一般每秒钟回调函数执行 60 次，也有可能会被降低。

#### canvas 的优化

* **在离屏 canvas 上预渲染相似的图形或重复的对象：** 如果发现自己在每个动画帧上重复了一些相同的绘制操作，请考虑将其分流到屏幕外的画布上。然后，您可以根据需要频繁地将屏幕外图像渲染到主画布上，而不必首先重复生成该图像的步骤。

* 避免浮点数的坐标点，用整数取而代之。

* 不要在用 drawImage 时缩放图像。

* 使用多层画布去画一个复杂的场景。

* 用 CSS 设置大的背景图。

* **用 CSS transforms 特性缩放画布：** CSS transforms 使用 GPU，因此速度更快。最好的情况是不直接缩放画布，或者具有较小的画布并按比例放大，而不是较大的画布并按比例缩小。

* **关闭透明度：** 如果画布不需要透明，当使用 HTMLCanvasElement.getContext() 创建一个绘图上下文时把 alpha 选项设置为 false 。这个选项可以帮助浏览器进行内部优化。

  ```javascript
  const ctx = canvas.getContext('2d', { alpha: false });
  ```

#### 示例：动态绘制图形

```html
<canvas id="canvas" width="500" height="300"></canvas>
<script>
    const canvas = document.querySelector('canvas')
    const circleList = generateCircleList(5)
    circleList.forEach((e, i) => {
        setTimeout(() => {
            ctx.beginPath();
            ctx.fillStyle = e.fillColor;
            ctx.strokeStyle = e.strokeColor;
            ctx.arc(e.x, e.y, e.radius, e.startAngle, e.endAngle, e.anticlockwise);
            ctx.fill();
            ctx.stroke();
        }, i * 1000)
    })
</script>
```

[查看 动态绘制图形 DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html?type=2)

#### 示例：循环全景照片

```html
<canvas id="canvas" width="500" height="300"></canvas>
<script>
    const canvas = document.querySelector('canvas')
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const speed = 30;
    const scale = 1.2
    const img = new Image();
    img.src = './assets/img/20190419141710_4735vxaqwhri_small.jpg';

    let imageWidth = 0
    let imageHeight = 0
    let x = 0;
    let y = 0
    let dx = -1;
    let dy = -1

    img.onload = function () {
        img.width = img.width / img.height * canvasHeight * scale;
        img.height = canvasHeight * scale;
        imageWidth = img.width
        imageHeight = img.height
        return setInterval(draw, speed);
    }

    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, x, y, imageWidth, imageHeight);
        if (imageWidth !== canvasWidth) {
            if (dx < 0 && Math.abs(x) > imageWidth - canvasWidth) {
                dx = Math.abs(dx)
            }
            if (dx > 0 && x >= 0) {
                dx = Math.abs(dx) * -1
            }
            x += dx;
        }
        if (imageHeight !== canvasHeight) {
            if (dy < 0 && Math.abs(y) > imageHeight - canvasHeight) {
                dy = Math.abs(dy)
            }

            if (dy > 0 && y >= 0) {
                dy = Math.abs(dy) * -1
            }
            y += dy;
        }
    }
</script>
```

[查看 循环全景照片 DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html?type=3)

#### 示例：鼠标追踪动画

```html
<canvas id="canvas" width="500" height="300"></canvas>
<script>
    function ColorLine(lineWidth, color, deg) {
        this.x = mousePotin.x;
        this.y = mousePotin.y;
        this.lineWidth = lineWidth;
        this.color = color;
        this.theta = Math.random() * Math.PI * 2;
        this.deg = deg;
        this.radius = Math.random() * 150;

        this.draw = function () {
            const point = {
                x: this.x,
                y: this.y
            };
            this.theta += this.deg;
            this.x = mousePotin.x + Math.cos(this.theta) * this.radius;
            this.y = mousePotin.y + Math.sin(this.theta) * this.radius;
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    function beginDraw() {
        requestAnimationFrame(beginDraw);
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        colorLines.forEach(e => e.draw());
    }

    const canvas = document.querySelector('canvas')
    const mousePotin = {
        x: (document.body.scrollLeft + document.documentElement.scrollLeft + canvas.clientWidth) / 2,
        y: (document.body.scrollTop + document.documentElement.scrollTop + canvas.clientHeight) / 2
    };
    const colorLines = [];
    for (let i = 0; i < 100; i++) {
        colorLines.push(new ColorLine(5, `#${Math.random().toString(16).slice(2, 8)}`, Math.PI / 180));
    }

    beginDraw()
    window.onmousemove = function (e) {
        mousePotin.x = e.clientX;
        mousePotin.y = e.clientY;
    }
</script>
```

[查看 鼠标追踪动画 DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html?type=4)

### 像素操作

ImageData 对象中存储着 Canvas 对象真实的像素数据。它包含以下几个只读属性：

* width：图片宽度，单位是像素。
* height：图片高度，单位是像素。
* colorSpace：字符串，表示图像数据的颜色空间，可取值 srgb（sRGB 色彩空间）、"display-p3"（display-p3 色彩空间）。
* storageFormat：??。
* data：包含着 RGBA 格式的整型数据，范围在 0 至 255 之间（包括255）。

data 属性返回一个对象，该对象包含指定的 ImageData 对象的图像数据。对于 ImageData 对象中的每个像素，都存在着四方面的信息，即 RGBA 值：

* R：红色（0-255）。
* G：绿色（0-255）。
* B：蓝色（0-255）
* A：alpha 通道（0-255。0 - 透明，255 - 完全可见）。

color/alpha 信息以数组形式存储在 ImageData 对象的 data 属性中，即 第一像素的信息在 data[0]~data[3]，第二像素的信息在 data[4]~data[7]。

#### createImageData

createImageData 用于 Canvas 2D 创建一个新的、空白的、指定大小的 ImageData 对象。所有的像素在新对象中都是透明的，即 rgba 值为 “0, 0, 0, 0”。

```javascript
ctx.createImageData(width, height);
ctx.createImageData(imagedata);
```

参数说明：

* width：ImageData 新对象的宽度。
* height：ImageData 新对象的高度。
* imagedata：从现有的 ImageData 对象中，复制一个和其宽度和高度相同的对象。图像自身不允许被复制。

```javascript
const canvas = document.querySelector('canvas')
const img = new Image();
img.src = './assets/img/20190419141710_4735vxaqwhri_small.jpg';
img.onload = function () {
    img.height = img.height / img.width * canvas.clientWidth * 1.2;
    img.width = canvas.clientWidth * 1.2;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.createImageData(canvas.clientWidth, canvas.clientHeight);
    const data = imageData1.data
    for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.random() * 255;
        data[i + 1] = Math.random() * 255;
        data[i + 2] = Math.random() * 255;
        data[i + 3] = Math.random() * 255;
    }
    ctx.putImageData(imageData, 10, 10, 0, 0, 100, 100);
}
```

#### getImageData

getImageData 返回一个 ImageData 对象，用来描述 Canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点 - sx、sy，宽 - sw，高 - sh。

```javascript
ctx.getImageData(sx, sy, sw, sh);
```

参数说明：

* sx：将要被提取的图像数据矩形区域的左上角 x 坐标。
* sy：将要被提取的图像数据矩形区域的左上角 y 坐标。
* sw：将要被提取的图像数据矩形区域的宽度。
* sh：将要被提取的图像数据矩形区域的高度。

```javascript
const imageData = ctx.getImageData(10, 10, 200, 300);
const data = imageData.data
```

```javascript
const canvas = document.querySelector('canvas')
const img = new Image();
img.src = './assets/img/20190419141710_4735vxaqwhri_small.jpg';

img.onload = function () {
    img.height = img.height / img.width * canvas.clientWidth * 1.2;
    img.width = canvas.clientWidth * 1.2;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = Math.random() * 255;
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, img.width, img.height);
}
```

#### putImageData

putImageData 用于 Canvas 2D 将数据从已有的 ImageData 对象绘制到位图的方法。如果提供了一个绘制过的矩形，则只绘制该矩形的像素。此方法不受画布转换矩阵的影响。

```javascript
ctx.putImageData(imagedata, dx, dy);
ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
```

参数说明：

* imageData：包含像素值的数组对象。
* dx：源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）。
* dy：源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）。
* dirtyX（可选）：在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（x 坐标）
* dirtyY（可选）：在源图像数据中，矩形区域左上角的位置。默认是整个图像数据的左上角（y 坐标）。

* dirtyWidth（可选）：在源图像数据中，矩形区域的宽度。默认是图像数据的宽度。

* dirtyHeight（可选）：在源图像数据中，矩形区域的高度。默认是图像数据的高度。

[查看 像素操作 DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html?type=5)

### 数据转换

#### SVG 转 CANVAS

![image-20230408182911607](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20230408182911607.png)

```javascript
const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
svgDom.setAttribute('version', 1.1)
svgDom.setAttribute('baseProfile', 'full')
svgDom.setAttribute('width', canvas.clientWidth)
svgDom.setAttribute('height', canvas.clientHeight)
svgDom.innerHTML = `
<rect width="100%" height="100%" fill="orange" />
<text x="250" y="150" font-size="55" text-anchor="middle" fill="white">SVG TO CANVAS</text>
`

const image = new Image();
image.src = 'data:image/svg+xml;charset=utf-8,' + new XMLSerializer().serializeToString(svgDom);
image.onload = function () {
    ctx.drawImage(image, 0, 0, image.width, image.height);
}
```

```javascript
// 注意：以下方法，svg标签一定要加属性 xmlns='http://www.w3.org/2000/svg'，即
svgDom.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

// svg内容中可以有中文字符
image.src = 'data:image/svg+xml,' + unescape(encodeURIComponent(svgDom.outerHTML));
image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgDom.outerHTML)));

// svg内容中不能有中文字符
image.src = 'data:image/svg+xml,' + svgDom.outerHTML;
image.src = 'data:image/svg+xml;base64,' + window.btoa(svgDom.outerHTML);
```

[查看 SVG-TO-CANVAS DEMO](https://1927344728.github.io/demo-lizh/html/10-canvas02.html?type=6)

#### CANVAS 转 base64

```javascript
const base64Url = canvas.toDataURL("image/jpeg");
const a = document.createElement('a');
a.setAttribute('href', base64Url);
a.setAttribute('download', 'lizhao-download-canvas-image.jpg');
a.click();
```

#### base64 转图片文件

```javascript
const base64Url = canvas.toDataURL("image/jpeg");
const bytes = window.atob(base64Url.split(',')[1]);
const arrayBuffer = new ArrayBuffer(bytes.length);
const uint8Array = new Uint8Array(arrayBuffer);
for (let i = 0; i < bytes.length; i++) {
    uint8Array[i] = bytes.charCodeAt(i);
}
const jpegBlob = new Blob([arrayBuffer], { type: 'image/jpeg' });
```

```javascript
const jpegFile = new File([uint8Array], 'lizhao-base64-to-jpeg.jpeg', { type: 'image/jpeg' });
```

#### CANVAS 转 URL

```javascript
const jpgeUrl = URL.createObjectURL(jpegBlob);
```

### 图像合成([查看效果](https://blog.csdn.net/laijieyao/article/details/41862473))

在绘制图形时，不同的图形会因为绘制的先后而有了层级关系。如果新绘制的图形和原有内容有重叠部分，在默认情况下，新绘制的图形是会覆盖在原有内容之上。

globalCompositeOperation 属性设置要在绘制新形状时应用的合成操作的类型，它有12个可选值：

|      属性值      |                             描述                             |
| :--------------: | :----------------------------------------------------------: |
|   source-over    |                   默认。新图像覆盖老图像。                   |
|    source-in     | 新图像覆盖老图像，且仅仅会绘制重叠的部分，其他区域都变成透明的。 |
|    source-out    |             只绘制不重叠的部分，老图像是透明的。             |
|   source-atop    |   新图像覆盖老图像，且仅仅会绘制重叠的部分，其他区域不变。   |
| destination-over |                      老图像覆盖新图像。                      |
|  destination-in  | 老图像覆盖新图像，且仅仅会绘制重叠的部分，其他区域都变成透明的。 |
| destination-out  |             只绘制不重叠的部分，新图像是透明的。             |
| destination-atop |   老图像覆盖新图像，且仅仅会绘制重叠的部分，其他区域不变。   |
|     lighter      |                     重叠部分作加色处理。                     |
|       xor        |                     重叠部分会变成透明。                     |
|       copy       |                 只保留新图像，老图像被清除。                 |
|      darker      |             重叠部分作减色处理。该值可能已移除。             |

### 常见问题

#### 图片的 crossorigin 属性

在 HTML5 中，一些 HTML 元素提供了对 CORS 的支持， 例如 audio、img、link、script、video 均有一个跨域属性（crossorigin），它允许你配置元素获取数据的 CORS 请求。

图片的 crossorigin 属性结合合适的 CORS 响应头，就可以实现在画布中使用跨域 img 元素的图像，就像在同源中使用一样。

crossorigin 属性具有以下可能的值：

* anonymous：对此元素的 CORS 请求将不设置凭据标志。
* use-credentials：对此元素的 CORS 请求将设置凭证标志；这意味着请求将提供凭据。
* ""： 设置一个空的值，如 crossorigin 或 crossorigin=""，和设置 anonymous 的效果一样。

事实上，即使是无效的关键字和空字符串也会被当作 "anonymous" 关键字使用。

**注意：** canvas 使用跨域图片，必须是图片的服务器允许跨域访问。

由于在 canvas 中的像素可能来自多种来源，包括从其他主机检索的图像或视频，因此不可避免的会出现安全问题。尽管 canvas 中可以绘制非同源图片，但是这会**污染画布**，并且不再认为是安全的画布，这将可能在 canvas 检索数据过程中引发异常。

在"被污染"的画布中调用以下方法将会抛出安全错误：

* 调用 getImageData() 方法；
* 调用 toBlob() 方法；
* 调用 toDataURL() 方法。

```javascript
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const img = new Image();
img.onload = function () {
    context.drawImage(this, 0, 0);
    context.getImageData(0, 0, this.width, this.height);
};
img.src = 'https://diff.example.com/images/sidgie.png';
```

如果使用 canvas.toDataURL() 方法，则会报错：

```shell
Failed to execute ‘toDataURL’ on　’HTMLCanvasElement’: Tainted canvased may not be exported
```

解决方法就是给 img 加一个 crossorigin 属性：

```javascript
img.crossorigin = 'anonymous'
```

crossorigin 可接收的值有：

* anonymous： 元素的跨域资源请求不需要凭证标志设置。
* use-credentials： 元素的跨域资源请求需要凭证标志设置，意味着该请求需要提供凭证。

其中，只要 crossOrigin 的属性值不是 `use-credentials`，全部都会解析为 `anonymous`，包括空字符串，包括类似 `abc` 这样的字符。

#### Canvas 图片渲染异常

封装一个方法 drawCardImage 用于将图片和一些文本绘制到 canvas，再导出为图片。在 HUAWEI P30（Harmony 3.0.0）下，连续两次调用该方法，报错：`Tainted canvasses may not be exported`。

**解决方法：** 第二次调用该方法，放在一个定时器中，如：setTimeout(async () => { await drawCardImage() }, 100)。
**备注：** 很神奇，没有找到具体原因。未在其他机型发现该问题，且 HUAWEI Meta 40 Pro（Harmony 3.0.0）、HUAWEI Meta 20 X（Harmony 3.0.0）也是正常的。

#### Canvas大小限制

HTML Canvas 元素受到现代和传统浏览器的广泛支持。Canvas 本身是没有宽度限制的，但是每种浏览器和平台组合都加了独特的大小限制，超过限制将导致画布无法使用。

目前，浏览器没有提供 Api 来确定它们的限制是多少，也没有在创建了一个不可用的画布后抛出任何的反馈信息。这使得处理大型画布元素成为一个挑战，特别是对于支持各种浏览器和平台的应用程序。

[canvas-size](https://www.npmjs.com/package/canvas-size) 是一个 npm 包，提供了浏览器支持的 Canvas 元素的最大面积、高度和宽度，以及测试自定义画布尺寸的能力。

以下是 canvas-size 的测试结果，测试是使用 BrowserStack 提供的虚拟设备进行的（结果可能因实际硬件而异）：

**PC 端：** 

| Browser (OS)             | Max Width | Max Height | Max Area (Total)              |
| ------------------------ | --------- | ---------- | ----------------------------- |
| Chrome >= 73 (Mac, Win)  | 65,535    | 65,535     | 16,384 x 16,384 (268,435,456) |
| Chrome <= 72 (Mac, Win)  | 32,767    | 32,767     | 16,384 x 16,384 (268,435,456) |
| Edge >= 80 (Mac, Win)    | 65,535    | 65,535     | 16,384 x 16,384 (268,435,456) |
| Edge <= 18 (Win)         | 16,384    | 16,384     | 16,384 x 16,384 (268,435,456) |
| Firefox >= 60 (Mac, Win) | 32,767    | 32,767     | 11,180 x 11,180 (124,992,400) |
| IE 11 (Win)              | 16,384    | 16,384     | 8,192 x 8,192 (67,108,864)    |
| IE 9 - 10 (Win)          | 8,192     | 8,192      | 8,192 x 8,192 (67,108,864)    |
| Safari >= 5 (Mac)        | 4,194,303 | 8,388,607  | 16,384 x 16,384 (268,435,456) |

**移动端：** 在运行相同平台/浏览器组合的移动设备之间，测试结果可能会有所不同，尤其是在硬件性能较差的旧设备上。

| Browser (OS)                | Max Width | Max Height | Max Area (Total)              |
| --------------------------- | --------- | ---------- | ----------------------------- |
| Chrome 91 (Android 8 - 11)  | 65,535    | 65,535     | 16,384 x 16,384 (268,435,456) |
| Chrome 91 (Android 7)       | 65,535    | 65,535     | 14,188 x 14,188 (201,299,344) |
| Chrome 91 (Android 6)       | 65,535    | 65,535     | 16,384 x 16,384 (268,435,456) |
| Chrome 91 (Android 5)       | 65,535    | 65,535     | 11,180 x 11,180 (124,992,400) |
| Chrome 68 (Android 7.1 - 9) | 32,767    | 32,767     | 14,188 x 14,188 (201,299,344) |
| Chrome 68 (Android 6)       | 32,767    | 32,767     | 10,836 x 10,836 (117,418,896) |
| Chrome 68 (Android 5)       | 32,767    | 32,767     | 11,402 x 11,402 (130,005,604) |
| IE (Windows Phone 8.x)      | 4,096     | 4,096      | 4,096 x 4,096 (16,777,216)    |
| Safari (iOS >= 9)           | 4,194,303 | 8,388,607  | 4,096 x 4,096 (16,777,216)    |



### 参考链接

[MDN - canvas 教程 - 基本的动画](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_animations)

[【译文】HTML5 Canvas的点击区域检测以及如何监听Canvas上各种图形的点击事件](https://www.cnblogs.com/hanshuai/p/14385286.html)

[H5 canvas 半知半解](https://www.kancloud.cn/dennis/canvas/340123)

[CSDN - 【HTML5】Canvas之globalCompositeOperation属性详解](https://blog.csdn.net/laijieyao/article/details/41862473)

[前端知识总结 - canvas](https://www.kancloud.cn/zhangqh/front/302716)