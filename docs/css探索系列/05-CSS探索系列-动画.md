## CSS探索系列之动画

自从有了前端开发这个概念以来，其实这个岗位所做的事情都是围绕着人机交互来开展的，主要包括展示信息给用户看，然后获取用户的意图并做出响应。一个高质量的动画在很多情况下都能大大提升用户的视觉体验。

本文主要讲 `css` 中的 `transition` 和 `animation` ，包括它们的基本用法以及一些简单的DEMO。



### 动画的基本概念

动画的实现原理，是利用了人眼的“视觉暂留”现象，在短时间内连续播放数幅静止的画面，使肉眼因视觉残象产生错觉，而误以为画面在“动”。

- 帧：在动画过程中，每一幅静止画面即为一“帧”;
- 帧率：即每秒钟播放的静止画面的数量，单位是fps(Frame per second);
- 帧时长：即每一幅静止画面的停留时间，单位一般是ms(毫秒);
- 跳帧(掉帧/丢帧)：在帧率固定的动画中，某一帧的时长远高于平均帧时长，导致其后续数帧被挤压而丢失的现象。

一般浏览器的渲染刷新频率是 60fps，所以在网页当中，帧率如果达到 50-60fps 的动画将会相当流畅，让人感到舒适。



### 实现动画的方式

#### Javascript 直接实现

**思路：**通过 `setInterval ` 或 `setTimeout ` 方法的回调函数来持续调用改变某个元素的 CSS 样式以达到元素样式变化的效果。

**问题：**通常会导致页面频繁性**重排重绘**，消耗性能，一般应该在桌面端浏览器。在移动端上使用会有明显的卡顿。

**16ms**： 设置 `setInterval ` 时间间隔一般是是 `16ms`。一般认为人眼能辨识的流畅动画为每秒 60 帧，这里 `16ms` 比 `1000ms/60` 帧略小一些，可认为该动画是流畅的。在很多移动端动画性能优化时，一般使用 `16ms` 来进行节流处理连续触发的浏览器事件。例如对 `touchmove`、`scroll `事件进行节流等。通过这种方式减少持续事件的触发频率，可以大大提升动画的流畅性。

#### CSS3 transition

**思路：**通过元素改变样式，进行前后样式的平滑动画效果过渡。

**问题：**在移动端开发中，直接使用 `transition `动画会让页面变慢甚至卡顿。所以我们通常**添加 transform:translate3D(0,0,0) 或 transform:translateZ(0) 来开启移动端动画的GPU加速**，让动画过程更加流畅。

#### CSS3 animation

**思路：**`animation ` 算是真正意义上的 CSS3 动画。通过对**关键帧**定义不同的样式，不同帧之间的进行平滑过渡。关键帧状态是通过百分比来控制的。

**优势：**CSS3 最大的优势是摆脱了 JS 的控制，并且能利用硬件加速以及实现复杂动画效果。

#### Canvas动画

**思路：**通过 `getContext()` 获取元素的绘制对象，通过 `setInterval ` 等方法不断用 `clearRect `清空画布，重新绘制内容来实现页面动画效果。

**优势：**Canvas主要优势是可以应对页面中多个动画元素渲染较慢的情况，完全通过 `javascript `来渲染控制动画的执行。可用于实现较复杂动画。

#### SVG（可伸缩矢量图形）

SVG 动画由 SVG 元素内部的元素属性控制，一般通过一下几个元素控制：

- 用于控制动画延时
- 对属性的连续改变进行控制
- 颜色变化
- 控制如缩放、旋转等几何变化
- 控制SVG内元素的移动路径

**优势：** SVG 的一大优势是含有较为丰富的动画功能，原生绘制各种图形、滤镜和动画，并且能被 js 调用。**html是对dom的渲染，svg就是对图形的渲染**。
**缺点：** 元素较多且复杂的动画使用 svg 渲染会比较慢，而且 SVG 格式的动画绘制方式必须让内容嵌入到HTML中使用。

#### requestAnimationFrame

**思路：** `requestAnimationFrame `是另一种Web API，原理与 `setTimeout `和 `setInterval `类似，都是通过 `javascript `持续循环的方法调用来触发动画动作。但是 `requestAnimationFrame `是浏览器针对动画专门优化形成的 APi，在性能上比另两者要好。

通常，我们将执行动画的**每一步传到requestAnimationFrame中**，每次执行完后，在进行异步回调方法用调用自身来连续触发动画效果。

```js
function render() {
    //doing somethings
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
```

**基于兼容性问题，通常在项目中，一般在：**

- **桌面端浏览器**推荐使用 Javascript 直接实现动画或 SVG 方式
- **移动端**可以考虑使用 CSS3 transition、CSS3 animation、Canvas 或 requestAnimationFrame 方式



### CSS Transition（过渡）

**CSS transitions** 提供了一种在更改 CSS 属性时控制动画速度的方法。 其可以让属性变化成为一个持续一段时间的过程，而不是立即生效的。通常将两个状态之间的过渡称为**隐式过渡（implicit transitions）**，因为开始与结束之间的状态由浏览器决定。

比如：`hover` 状态的样式，通常这个改变是立即生效的，但是加了 `transition` 属性后，`hover` 状态的改变，会有一个持续的过渡过程，呈现出随时间变化的动态效果。

```html
<style>
    .item_01,
    .item_01_02 {
        display: inline-block;
        width: 100px;
        height: 100px;
        background-color: #0aa;
        border-radius: 20px;
    }

    .item_01:hover,
    .item_01_02:hover {
        width: 200px;
        height: 200px;
        background-color: orange;
        transform: rotate(180deg);
        border-radius: 100px;
    }

    .item_01_02 {
        transition: width 2s, height 2s, background-color 2s, transform 2s, border-radius 2s;
    }
</style>

<section>
    <div class="item_01"></div>
    <div class="item_01_02"></div>
</section>
```

[查看 Transition DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html)



#### transition的子属性

CSS transitions 可以决定哪些属性发生动画效果 (明确地列出这些属性)，何时开始 (设置 delay），持续多久 (设置 duration) 以及如何动画 (定义 timing function，比如匀速地或先快后慢)。

```css
transition: <property> <duration> <timing-function> <delay>
```

一个 transition 可以同时定义多个属性：

```css
transition: width 2s, height 2s, background-color 2s, transform 2s, border-radius 2s;
```

transition 是简写属性，它包含了以下子属性：

* **transition-property**：指定哪个或哪些 CSS 属性用于过渡，未指定的属性仍如通常那样瞬间变化。

* **transition-duration**：指定过渡的时长。或者为所有属性指定一个值，或者指定多个值，为每个属性指定不同的时长。

* **transition-timing-function**：`transition ` 的状态变化速度（又称 `timing function`），默认ease，逐渐放慢。

  CSS 属性受到 `transition effect` 的影响，会产生不断变化的中间值，而 CSS `transition-timing-function` 属性用来描述这个中间值是怎样计算的。实质上，通过这个函数会建立一条加速度曲线，因此在整个transition变化过程中，变化速度可以不断改变。

  * ease：逐渐放慢

  * ease-in：加速

  * ease-out：减速

  * ease-in-out：先加速，后减速

  * linear：匀速

  * cubic-bezier(x1, y1, x2, y2)：定义了一条 立方贝塞尔曲线（cubic Bézier curve）。这些曲线是连续的，一般用于动画的平滑变换，也被称为缓动函数（easing functions）。

  * steps(number, position)。`steps()`功能符可以让动画不连续，number 表示把我们的动画分成了多少段；position 关键字，表示动画是从时间段的开头连续还是末尾连续。

    * step-start，等同于 steps(1, start)

    * step-end，等同于 steps(1, end)

* **transition-delay**：规定了在过渡效果开始作用之前需要等待的时间。

  值以秒（s）或毫秒（ms）为单位，表明动画过渡效果将在何时开始。取值为正时会延迟一段时间来响应过渡效果；取值为负时会导致过渡立即开始。

  ```css
  transition-delay: 10s, 5s, 5s, 5s, 5s;
  ```

当属性值列表长度不一致时，以 `transition-property` 的值列表长度为标准，如果某个属性值列表长度短于它的，则重复其值以长度一致， 例如：

```css
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s;
}
/*等价于*/
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s, 3s, 5s;
}
```

类似地，如果某个属性的值列表长于 transition-property 的，将被截短。 例如：

```css
div {
  transition-property: opacity, left;
  transition-duration: 3s, 5s, 2s, 1s;
}
/*等价于*/
div {
  transition-property: opacity, left;
  transition-duration: 3s, 5s;
}
```

#### 检测过渡是否完成

当过渡完成时触发一个事件，在符合标准的浏览器下，这个事件是 `transitionend`，在 WebKit 下是 `webkitTransitionEnd`。 `transitionend `事件提供两个属性：

* propertyName：字符串，指示已完成过渡的属性。
* elapsedTime：浮点数，指示当触发这个事件时过渡已运行的时间（秒）（多个属性定义了不同 `transition-duration` ，结束时间不一样）。这个值不受 transition-delay 影响。

```js
el.addEventListener("transitionend", updateTransition, true)
```

#### transition的局限

transition的优点在于简单易用，但是它有几个很大的局限：

- transition 需要事件触发，所以没法在网页加载时自动发生。
- transition是一次性的，不能重复发生，除非一再触发。
- transition只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态。
- 一条transition规则，只能定义一个属性的变化，不能涉及多个属性。

使用 `transition` 时，直接在元素上加 `class` 、或者直接插入元素（如 `.appendChild()`）、或者改变属性 `display: none` 后立即使用过渡，元素没有过渡效果，一开始就处于结束状态。

简单的解决办法，改变属性前用 `window.setTimeout()` 延迟几毫秒。



### CSS Animation（动画）

**CSS animation** 使得可以将从一个 CSS 样式配置转换到另一个 CSS 样式配置。动画包括两个部分：

* 描述动画的样式规则，即 `animation` 属性。
* 用于指定动画开始、结束以及中间点样式的关键帧，即`@keyframes`。

#### Animation的属性

创建动画序列，需要使用 animation 属性或其子属性，该属性允许配置动画时间、时长以及其他动画细节，但该属性不能配置动画的实际表现，动画的实际表现是由 @keyframes 规则实现。

```html
<style>
    .item_02 {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
        background-color: #0aa;
        border-radius: 25px;
        animation: move2 2s ease 1s infinite;
    }
    @keyframes move2 {
        0% {
            transform: translate(0, 0);
            background-color: red;
        }
        100% {
            transform: translate(552px, 0);
            background-color: orange;
        }
    }
</style>

<section>
    <div class="item_02"></div>
</section>
```

[查看 animation DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html?type=2)



CSS animation 属性是一个简写属性形式，简写顺序如下（个人习惯按这种顺序，部分子属性可以省略和调整顺序）：

```css
animation: <animation-name> <animation-duration> <animation-timing-function> <animation-delay> <animation-iteration-count> <animation-direction> <animation-fill-mode> <animation-play-state>;

/*默认*/
animation: none 0s ease 0s 1 normal none running;
```

其子属性有:

##### animation-name

指定应用的一系列动画，每个名称代表一个由 @keyframes 定义的动画序列。

##### animation-duration

设置动画一个周期的时长，单位为秒(s)或者毫秒(ms)，无单位值无效。

##### animation-timing-function

设置动画速度， 即通过建立加速度曲线，设置动画在关键帧之间是如何变化。

* ease：逐渐放慢

* ease-in：加速

* ease-out：减速

* ease-in-out：先加速，后减速

* linear：匀速

* cubic-bezier(x1, y1, x2, y2)：定义了一条 立方贝塞尔曲线（cubic Bézier curve）。这些曲线是连续的，一般用于动画的平滑变换，也被称为缓动函数（easing functions）。

* steps(number, position)。`steps()`功能符可以让动画不连续，number 指的是把**两个关键帧之间的动画分为n步阶段性展示**，而不是`keyframes`写的变化次数。；position 关键字，表示动画是从时间段的开头连续还是末尾连续。

  * step-start，等同于 steps(1, start)

  * step-end，等同于 steps(1, end)

  ```css
  .item_03_01 { animation: move3 2s step-start 1s infinite; }
  .item_03_02 { animation: move3 2s steps(3, start) 1s infinite; }
  .item_03_03 { animation: move3 2s steps(3, end) 1s infinite; }
  .item_03_04 { animation: move3 2s steps(30, start) 1s infinite; }
  ```

  [查看 steps DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html?type=3)


##### animation-delay

设置延时，即从元素加载完成之后到动画序列开始执行的这段时间。该值可用单位为秒(s)和毫秒(ms)。如果未设置单位，定义无效。

##### animation-iteration-count

设置动画重复次数， 默认1，可以指定 `infinite `无限次重复动画。

* 可以指定了多个值，每次播放动画时，将使用列表中的下一个值，在使用最后一个值后循环回第一个值。

* 可以用小数定义循环，来播放动画周期的一部分

##### animation-direction

设置动画在每次运行完后是反向运行还是重新回到开始位置重复运行。

* **normal**：每个播放动画都是从起点到终点，播放完成后，动画重置到起点重新开始，这是默认属性。
* **alternate**：动画交替反向运行，即第一次动画播放结束，第二次动画播放从终点开始，第三次动画播放从起点开始，以此循环交替。同时，带时间功能的函数也反向，比如，ease-in 在反向时成为 ease-out。计数取决于开始时是奇数迭代还是偶数迭代
* **reverse**：反向运行动画，每次动画都是从终点到起点。
* **alternate-reverse**：与 **alternate** 类似，但，动画第一次运行时是反向的。决定奇数次或偶数次的计数从1开始。

```css
.item_04_01 { animation: move4 2s ease 1s infinite normal; }
.item_04_02 { animation: move4 2s ease 1s infinite alternate; }
.item_04_03 { animation: move4 2s ease 1s infinite reverse; }
.item_04_04 { animation: move4 2s ease 1s infinite alternate-reverse; }
```

[查看 animation-direction DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html?type=4)

##### animation-fill-mode

指定动画执行前后如何为目标元素应用样式。

* **none**：当动画未执行时，动画将不会将任何样式应用于目标，而是已经赋予给该元素的 CSS 规则来显示该元素。这是默认值。
* **forwards**：动画播放结束后，目标元素停留在**最后一个关键帧**的样式。最后一个关键帧取决于` animation-direction` 和 `animation-iteration-count` 的值。
* **backwards**：目标元素将**第一个关键帧**用作动画播放之前以及在 `animation-delay` 期间的样式。 第一个关键帧取决于`animation-direction` 的值。
* **both**：动画将遵循`forwards`和`backwards`的规则，即，开始之前遵循 `backward` 规则，结束之后遵循 `forwards` 规则。

```css
.item_05_01 { animation: move5 2s ease 1s 2; }
.item_05_02 { animation: move5 2s ease 1s 2 forwards; }
.item_05_03 { animation: move5 2s ease 1s 2 reverse forwards; }
.item_05_04 { animation: move5 2s ease 1s 2 backwards; }
.item_05_05 { animation: move5 2s ease 1s 2 reverse backwards; }
.item_05_06 { animation: move5 2s ease 1s 2 both; }
```

[查看 animation-fill-mode DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html?type=5)

##### animation-play-state

定义一个动画是否运行或者暂停。可以通过查询它来确定动画是否正在运行。另外，它的值可以被设置为暂停和恢复的动画的重放。

* running：当前动画正在运行。
* paused：当前动画已被停止。

#### 使用keyframes定义动画序列

`Animation` 通过使用 `@keyframes` 建立两个或两个以上关键帧来实现。每一个关键帧都描述了动画元素在给定的时间点上应该如何渲染，时间点用 `百分比` 表示。

* 0%：表示动画的第一时刻，可选值，别名 `from`。若未指定，则浏览器使用计算值开始动画
* 100%：表示动画的最终时刻，可选值，别名 `to`。若未指定，则浏览器使用计算值结束动画

* 也可包含额外可选的关键帧，描述动画开始和结束之间的状态。

#### 动画事件监听器

JavaScript代码监听所有三种可能的动画事件：

```js
var e = document.getElementById("watchme");
e.addEventListener("animationstart", listener, false);
e.addEventListener("animationend", listener, false);
e.addEventListener("animationiteration", listener, false);

e.className = "slidein";
```

#### 重新运行CSS动画

在某些情况下你可能想让这段动画再次运行。比如：动画执行完成后，你想通过一个点击事件，让动画重新播放一次。

目前 CSS 并没有提供一种方式来再次启动它，我们可以通过以下方法实现：

1. 切换 class。removeClass 移除执行动画的 class，再用 addClass 加回来，注意，中间一定要有一个延迟（延迟可以设置很低）。

2. 重载元素。步骤是克隆原始元素，插入到自身之后，移除原始元素。

3. 相同动画，不同名字。

4. 通过 JavaScript 改变 CSS animation （`animation`必须是`infinite`） 的播放状态。

   ```js
   element.style.webkitAnimationPlayState="paused"
   element.style.webkitAnimationPlayState="running"
   ```

   注意：应该通过 AnimationEnd 事件将它设置回 pause 否则它的重启不会像你想的那样。

#### Animation的优缺点

相较于传统的脚本实现动画技术，使用 CSS 动画有三个主要优点：

- 能够非常容易地创建简单动画，你甚至不需要了解 `JavaScript `就能创建动画。
- 动画运行效果良好，甚至在低性能的系统上。渲染引擎会使用跳帧或者其他技术以保证动画表现尽可能的流畅。而使用 `JavaScript `实现的动画通常表现不佳（除非经过很好的设计）。
- 让浏览器控制动画序列，允许浏览器优化性能和效果，如降低位于隐藏选项卡中的动画更新频率。

也有一些缺点：

* 不能动态修改或定义动画内容
* 运行过程控制较弱，无法附加事件绑定回调函数
* 代码冗长。想用 CSS 实现稍微复杂一点动画，最后 CSS 代码都会变得非常笨重



### [Animation 和 Transition 的性能探究](http://zencode.in/18.CSS-animation%E5%92%8Ctransition%E7%9A%84%E6%80%A7%E8%83%BD%E6%8E%A2%E7%A9%B6.html)

#### 浏览器的内部机制

让我们拨开浏览器的面纱看看它到底是如何工作的。一旦我们明白其内部机制，便能驾驭它了。

现代浏览器通常由两个重要的线程组成。这两个线程一起工作完成绘制页面的任务：

- 主线程
- 合成线程

主线程需要做的任务如下：

- 运行 Javascript
- 计算 HTML 元素的 CSS 样式
- layout (relayout)
- 将页面元素绘制成一张或多张位图
- 将位图发送给合成线程

合成线程主要任务是：

- 利用 GPU 将位图绘制到屏幕上
- 让主线程将可见的或即将可见的位图发给自己
- 计算哪部分页面是可见的
- 计算哪部分页面是即将可见的（当你的滚动页面的时候）
- 在你滚动时移动部分页面

在很长的一段时间内，主线程都在忙于运行 Javascript 和绘制大型元素。当它忙碌的时候，它就没空响应用户的输入了。

换个角度说，合成线程一直在尝试保证对用户输入的响应。它会在页面改变时每秒绘制 60 次页面，即使页面还不完整。

例如，当用户滚动一个页面时，合成线程会让主线程提供最新的可见部分的页面位图。然而主线程不能及时的响应。这时合成线程不会等待，它会绘制已有的页面位图。对于没有的部分则绘制白屏。

#### GPU

之前提到了合成线程会使用 GPU 来绘制位图。如今大多数手机、平板和电脑都带有了 GPU 芯片。

它非常的特别，它很擅长做某些事情，又很不擅长做其他事情。

GPU 很擅长做：

- 绘制东西到屏幕上
- 一次次绘制同一张位图到屏幕上
- 绘制同一张位图到不同的位置、旋转角度和缩放比例

GPU 很不擅长做：

* 加载位图到内存中

#### transition: height

假设：将一个页面元素的高度从 `100px` 渐变到 `200px` 。

在 transition 动画的每一帧中，浏览器都要做重流和重绘，然后将位图发送给 GPU。之前我们提到了，加载位图到 GPU 内存中是很慢的。

浏览器之所以这么拼命的工作是因为元素在不停的变化。而且修改元素的高度可能会导致子元素的大小也会变化，所以浏览器不得不进行重流。在重流之后主线程还需要重新生成元素的位图。

**重流、重绘、GPU加载位图都是比较耗时的操作。**

#### transition: transform

所以高度的变化是很耗时的，有没有什么东西耗时更少呢？

假设：将一个元素缩小到其一半大小。

同时假设：使用 CSS transform 属性来缩放元素。CSS如下：

```css
div {
    transform: scale(0.5);
    transition: transform 1s linear;
}

div:hover {
    transform: scale(1.0);
}
```

依据规范，**CSS transform 属性并不会触发当前元素或附近元素的重流**。浏览器将当前元素视为一个整体，它会缩放、旋转、移动这一整个元素。

这对浏览器来说是个天大的好消息！浏览器只需要在动画开始之时生成位图，然后将位图发送给 GPU。之后浏览器不需要做额外的重流和重流，甚至不需要发送位图给 GPU。浏览器只需要充分发挥 GPU 的长处：绘制同一张位图到不同的位置、旋转角度和缩放比例。

#### 最适合做动画的属性

总结一下做动画时速度很快的CSS属性：

- CSS transform
- CSS opacity
- CSS filter （具体要看filter的复杂度）

这个列表目前很小，但是随着浏览器越来越先进，你会看到这个列表越变越大。同样的也不要小看这张列表上的属性。你会惊讶居然可以用这么几个简单的属性实现这么多复杂的动画效果。发挥你们的创造力吧！



### 还有哪些CSS 属性可以做动画?

有些属性动画无意义，所以 [可动画属性列表](https://developer.mozilla.org/zh-CN/docs/CSS/CSS_animated_properties) 是一个有限集合，部分常见属性如下：

- all
- opacity
- width、min-width、max-width
- height、min-height、max-height、line-height
- left、right、top、bottom
- margin、padding
- transform、transform-origin
- rotate、scale、translate
- background、background-color、background-position、background-size
- border、outline
- radius
- mask
- box-shadow
- color
- flex
- font、font-size、font-size-adjust、font-stretch、font-variation-settings、font-weight
- vertical-align
- word-spacing、letter-spacing
- visibility
- line-clamp
- max-lines
- z-index
- zoom



### 相关问题

#### css过渡和css动画的区别是什么？

其主要区别在于：`transition ` 需要触发一个事件才会随着时间改变其 CSS 属性；animation 在不需要触发任何事件的情况下，也可以显式的随时间变化来改变元素CSS属性，达到一种动画的效果。

* transition 是过渡，是样式值的变化的过程，只有开始和结束；animation 其实也叫关键帧，通过和 keyframe 结合可以设置中间帧的一个状态；

* animation 配合 @keyframe 可以不触发时间就触发这个过程，而 transition 需要通过 hover 或者 js 事件来配合触发；

* animation 可以设置很多的属性，比如循环次数，动画结束的状态等等。transition 只能触发一次；

#### auto值

auto 值常常较复杂，规范指出不要在它上动画。一些用户代理，比如基于 Gecko 的，遵循这点；一些，比如基于 WebKit的，没有这么严格限制。在 `auto` 上动画结果可能不可预期，这取决于浏览器及其版本，应当避免使用。

#### 3D动画

[查看 3D动画 DEMO](https://1927344728.github.io/demo-lizh/html/18-css动画.html?type=6)



### CSS动画工具和框架

* [Animate.css](https://animate.style/)

  Animate.css 是一个跨浏览器 CSS 动画的集合，你可以在滚动条、主页上等 Web 项目中使用它。

* [在线动画制作](http://www.miued.com/tools/) 

* [Anime.js](https://www.animejs.cn/)

  Anime.js是一个轻量级JavaScript动画库，具有简单但功能强大的API。

  它适用于CSS属性，SVG，DOM属性和JavaScript对象。它可以通过对时间轴的回调实现对动画的控制。通过关键帧实现对动画补充与饱满，在上面几乎可以实现基本动画需要的工作。最关键的是，Anime.js适用于所有网页，你可以使用html，css，js，svg等制作动画。

* [three.js](http://www.webgl3d.cn/)

  Three.js 是基于原生WebGL封装运行的三维引擎，在所有WebGL引擎中，Three.js 是国内文资料最多、使用最广泛的三维引擎。

  既然Threejs是一款WebGL三维引擎，那么它可以用来做什么想必你一定很关心。所以接下来内容会展示大量基于Threejs引擎或Threejs类似引擎开发的Web3D应用，以便大家了解。

* [Lottie](https://airbnb.io/lottie/#/)

  Lottie是一个面向Android、iOS、Web和Windows的库，它解析导出为带有bodymovin的json的AE（Adobe After Effects）动画，并在移动和Web上以本地方式呈现这些动画。



### 参考资料

[前端实现动画的6种方式详解](https://www.cnblogs.com/Renyi-Fan/p/9268657.html#_label2_1)

[MDN 使用 CSS transitions](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)

[MDN 使用 CSS 动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

[MDN CSS 动画属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_animated_properties)

[【工具】前端动画解决方案Lottie（web篇）](https://blog.michealwayne.cn/2019/07/18/tools_study/%E3%80%90%E5%B7%A5%E5%85%B7%E3%80%91%E5%89%8D%E7%AB%AF%E5%8A%A8%E7%94%BB%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88Lottie%EF%BC%88web%E7%AF%87%EF%BC%89/)

[【CSS3进阶】酷炫的3D旋转透视](https://www.cnblogs.com/coco1s/p/5414153.html)

[CSS animation和transition的性能探究](http://zencode.in/18.CSS-animation%E5%92%8Ctransition%E7%9A%84%E6%80%A7%E8%83%BD%E6%8E%A2%E7%A9%B6.html)

