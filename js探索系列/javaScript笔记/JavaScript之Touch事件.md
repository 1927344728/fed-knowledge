## JavaScript笔记之Touch事件

为了给基于触摸的用户界面提供高质量的支持，Touch 事件提供了在触摸屏或触控板上解释手指（或触控笔）活动的能力。

Touch 事件接口是较为底层的 API，可为特定程序提供多点触控交互（比如双指手势）的支持。多点触控交互开始于一个手指（或触控笔）开始接触设备平面的时刻。随后其他手指也可触摸设备表面，并随意进行划动。当所有手指离开设备平面时，交互结束。整个交互期间，程序接收开始、移动、结束三个阶段的触摸事件。

### 触摸事件的API

浏览器的触摸 API 由三个部分组成。

- Touch：表示用户与触摸表面间的一个单独的接触点。
- TouchList：表示一组 Touch，用于多点触控的情况。
- TouchEvent：表示位于表面上的一个触摸点的某个状态发生改变时产生的事件。

Touch 接口的实例对象用来表示触摸点（一根手指或者一根触摸笔），包括位置、大小、形状、压力、目标元素等属性。有时，触摸动作由多个触摸点（多根手指）组成，多个触摸点的集合由 TouchList 接口的实例对象表示。TouchEvent 接口的实例对象代表由触摸引发的事件，只有触摸屏才会引发这一类事件。

在很多情况下，触摸事件和鼠标事件会同时被触发（目的是让没有对触摸设备优化的代码仍然可以在触摸设备上正常工作）。如果你使用了触摸事件，可以调用 event.preventDefault() 来阻止鼠标事件被触发。



### 触摸事件的类型

为了区别触摸相关的状态改变，存在多种类型的触摸事件。可以通过检查触摸事件的 TouchEvent.type 属性来确定当前事件属于哪种类型。触摸引发的事件有以下几种：

- touchstart：当用户在触摸平面上放置了一个触点时触发。事件的目标元素将是触点位置上的那个目标元素。

- touchend：当一个触点被用户从触摸平面上移除（即用户的一个手指或手写笔离开触摸平面）时触发。当触点移出触摸平面的边界时也将触发。例如用户将手指划出屏幕边缘。

  事件的目标元素与触发 touchstart 事件的目标元素相同，即使 touchend 事件触发时，触点已经移出了该元素 。

  已经被从触摸平面上移除的触点，可以在 changedTouches 属性定义的 TouchList 中找到。

- touchmove：当用户在触摸平面上移动触点时触发。事件的目标元素和触发 touchstart 事件的目标元素相同，即使当 touchmove 事件触发时，触点已经移出了该元素 。

  当触点的半径、旋转角度以及压力大小发生变化时，也将触发此事件。

- touchcancel：当触点由于某些原因被中断时触发。有几种可能的原因如下（具体的原因根据不同的设备和浏览器有所不同）：

  * 由于某个事件出现而取消了触摸：例如触摸过程被弹窗打断。
  * 触点离开了文档窗口，而进入了浏览器的界面元素、插件或者其他外部内容区域。
  * 当用户产生的触点个数超过了设备支持的个数，从而导致 TouchList 中最早的 Touch 对象被取消。



### Touch接口

Touch 对象表示在触控设备上的触摸点。通常是指手指或者触控笔在触屏设备或者触摸板上的操作。Touch 对象代表一个触点，每个触点包含位置，大小，形状，压力大小，和目标元素属性。

Touch 对象可以通过以下属性获取，需要注意的是，这三个属性是有区别：

- `touches`：当前屏幕上所有触摸点的集合列表
- `targetTouches`：绑定事件的那个结点上的触摸点的集合列表
- `changedTouches`：触发事件时改变的触摸点的集合

#### Touch对象的属性

```js
clientX: 341.6842346191406
clientY: 229.68423461914062
force: 1
identifier: 0
pageX: 341.6842346191406
pageY: 229.68423461914062
radiusX: 12.105263710021973
radiusY: 12.105263710021973
region: null
rotationAngle: 0
screenX: 345.6000061035156
screenY: 356
target: canvas.element_canvas1
```

* identifier：只读。此 Touch 对象的唯一标识符。 一次触摸动作（例如手指触摸）在平面上移动的整个过程中，该标识符不变。可以根据它来判断跟踪的是否是同一次触摸过程。

* screenX、screenY：只读。触点相对于屏幕左边缘的X坐标、上边缘的Y坐标。

* clientX、clientY：只读。触点相对于可见视区左边缘的X坐标、上边缘的Y坐标。不包括任何滚动偏移。

* pageX、pageY：只读。触点相对于HTML文档左边缘的X坐标、上边缘的Y坐标。当存在水平、垂直滚动的偏移时，这个值包含了水平、垂直滚动的偏移。

* target：只读。返回触摸点最初接触的元素，即使这个触摸点已经移出那个元素的交互区域。

  需要注意的是：如果这个元素在触摸过程中被移除，这个事件仍然会指向它，因此这个事件也不会冒泡到 window 或 document 对象。所以，如果有元素在触摸过程中可能被移除，最佳实践是将触摸事件的监听器绑定到这个元素本身，防止元素被移除后，无法再从它的上一级元素上侦测到从该元素冒泡的事件。

* radiusX、radiusY：只读。返回能够包围接触区域的最小椭圆的水平轴（X轴）、垂直轴（Y轴）半径。
* rotationAngle：只读。返回一个0到90的角度值，表示上述由 radiusX 和 radiusY 描述的椭圆为了尽可能精确地覆盖用户与平面之间的接触区域而需要顺时针旋转的角度。
* force：只读。返回用户对触摸平面的压力大小，是一个从0.0(没有压力)到1.0(最大压力)的浮点数。
* region：暂时没有找相关说明。



### TouchList接口

TouchList 接口代表一个触摸平面上所有触点的列表。例如，如果一个用户用三根手指接触屏幕（或者触控板），与之对应的 TouchList 会包含每根手指的 Touch 对象，总共三个。

**TouchList对象的属性和方法：**

* length：只读。返回TouchList中 Touch 对象的数量。
* identifiedTouch()：列表中标示符与指定值匹配的第一个Touch 对象会被返回。
* item()：返回列表中以指定值作为索引的 Touch 对象。



### TouchEvent接口

TouchEvent 是一类描述手指在触摸平面（触摸屏、触摸板等）的状态变化的事件。这类事件用于描述一个或多个触点，使开发者可以检测触点的移动，触点的增加和减少，等等。

TouchEvent 的属性继承了 UIEvent 和 Event：

```js
altKey: false
ctrlKey: false
shiftKey: false
metaKey: false
touches: TouchList {0: Touch, length: 1}
targetTouches: TouchList {0: Touch, length: 1}
changedTouches: TouchList {0: Touch, length: 1}

// Event事件属性
currentTarget: null
srcElement: canvas.element_canvas1
target: canvas.element_canvas1
type: "touchstart"
bubbles: true // 该事件是否会在 DOM 中冒泡
cancelBubble: false // stopPropagation() 的历史别名。在事件处理器函数返回之前，将此属性的值设置为 true，亦可阻止事件继续冒泡
cancelable: true // 表示事件是否可以取消
composed: true // 表示事件是否可以穿过 Shadow DOM 和常规 DOM 之间的隔阂进行冒泡
defaultPrevented: true // 表示 preventDefault() 方法是否取消了事件的默认行为
eventPhase: 0 // 表示事件流正被处理到了哪个阶段
isTrusted: true // 表示事件是由浏览器（例如用户点击）发起的，还是由脚本（使用事件创建方法）发出的。
path: // 一个由事件流所经过的 DOM 节点组成的数组。实验中，可能用 deepPath 类似
returnValue: false // 旧版 IE 引入的一个非标准历史属性，为保证依赖此属性的网页正常运作，此属性最终被收入规范
timeStamp: 2128.1449999660254 // 事件创建时的时间戳（精度为毫秒）

// UIEvent事件属性
sourceCapabilities: // 返回的一个实例InputDeviceCapabilities，其提供了关于负责产生的触摸事件，物理装置信息的接口。
detail: 0 // 当值为非空的时候, 提供当前点击数(和环境有关) 。
view: // 返回的生成事件的 document.defaultView 对象。在浏览器中，这是事件所在的 Window 对象。
which: 0 // 返回一个对应（键盘）按下的数字类型的 keyCode ，或者一个字母数字键按下时的字符码
```

- type：表示事件的类型，不区分大小写。

- altKey：布尔值，表示触摸时是否按下了 Alt 键。

- ctrlKey：布尔值，表示触摸时是否按下了 Ctrl 键。

- shiftKey：布尔值：表示触摸时是否按下了 Shift 键。

- metaKey：布尔值，表示触摸时是否按下了 Meta 键（或 Windows 键）。

- touches：当前屏幕上所有触摸点的集合列表。

- targetTouches：绑定事件的那个结点上的触摸点的集合列表。

- changedTouches：触发事件时改变的触摸点的集合。

- currentTarget：指向事件所绑定的元素，**是监听事件者**。在事件处理程序内部，对象 this 始终等于currentTarget 的值。

- target：指向事件发生时的元素，**是事件的真正发出者**。IE有兼容问题。

- srcElement：和 target 相同，firFox 不兼容。

  ```js
  // 获取直接目标对象的兼容写法
  let target = e.target || e.srcElement    
  ```



### 常见问题

##### targetTouches 和 changedTouches 的区别

targetTouches 是当前触摸元素上的触摸点的集合列表；changedTouches 是触发事件时改变的触摸点的集合，包括已经被从触摸平面上移除的触点。

所以，在 touchend、touchcancel 事件中，只能用 changedTouches 获取 Touch 对象。

#### 300ms延迟

移动浏览器会在 `touchend` 和 `click` 事件之间，等待 300 - 350 ms，判断用户是否会进行双击手势用以缩放文字。

这是因为触摸屏幕的行为被重载(overload)了。在手指触摸屏幕的瞬间，浏览器无法预知用户是在轻触(Tap)、双触(Double-Tap)、滑动(Swipe)、按住不放(Hold)还是其他什么操作。唯一保险的做法就是等上一会儿看接下来会发生什么。

**解决方案一：** 禁用缩放。注：浏览器可能不支持。

```html
<meta name="viewport" content="user-scalable=no" />
```

```css
html {
	/*注意浏览器前缀*/
    touch-action: manipulation;
}
```

**解决方案二：** 改变视口宽度。为用户适配了页面大小和阻止了用户缩放，浏览器就不用再判断用户双击缩放了，于是便自动取消了click事件的 300ms 延迟。注：safari 浏览器可能不支持。

```html
<meta name="viewport" content="width=device-width" />
```

**解决方案三：** 引用 fastclick 库。**（不推荐）**

**原理:**  移动端点击事件发生时，会触发 `touchStart -> touchMove -> touchEnd -> click` ，fastclick 是在监听到 touchEnd 事件时，立即触发click事件，并阻止原来事件的发生。

**缺点：** 可以会引起表单 input 元素获取焦点时，唤起软件键的一些异常；还有其他Bug。

#### 实时获取触摸点所在位置的元素

touchmove 事件的目标元素和触发 touchstart 事件的目标元素相同，即使当 touchmove 事件触发时，触点已经移出了该元素 。如果要实时获取触摸点所在位置的元素，普通方法已不奏效。  

**解决方案一(推荐)：**

```js
//获取存储当前触摸点位置的对象，取clientX及clientY，再通过 elementFromPoint 获取当前触摸位置的元素
let myLocation = e.originalEvent.changedTouches[0];
let realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
```
> 此方法返回的是最顶层的元素，所以务必将你需要的元素的 z-index 设置为最高。  
> 由于手机兼容性问题。touchmove 事件的监听函数需加上 e.stopPropagation 和 e.preventDefault。

**解决方案二：** 在父元素上定义 touchmove 事件。

#### touchend监听事件无法触发

部分安卓机中，touchend 事件无效。

**解决方案一：**在 `touchstart` 或者 `touchmove` 事件的监听函数中，阻止事件的默认行为 `event.preventDefault()`，那么到 `touchend` 就能正常触发。  

> `touchend`是触发了，但页面默认滚动页面被阻止掉了。
> 在安卓4.0系统（即Android ICS系统），如果在 `touchstart` 和第一个 `touchmove` 触发时，没有调用 `preventDefault`，那么后面 `touchmove`（连续触发）以及最后的 `touchend` 都不会被触发。所以我们需要决定第一个 `touchmove` 是否是一个滚动事件（如果是，则不能 `preventDefault` 阻止默认行为），然后手动触发`touchend`。  

**解决方案二：**同时绑定 `touchcancel` 和 `touchend` 事件

这个可以解决 `touchend` 的触发问题，但其实还不是最优解，`touchend` 还是比较难触发。最根本的还是寄希望于谷歌尽早解决这个历史遗留bug。



### 参考资料

[MDN Touch](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch)

[MDN 触摸事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events)

[阮一峰 触摸事件](https://wangdoc.com/javascript/events/touch.html)