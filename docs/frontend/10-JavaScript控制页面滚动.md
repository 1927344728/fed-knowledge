## JavaScript控制页面滚动

H5 页面上的滚动，可分为窗口滚动和元素（加了`overflow: scroll | auto`）滚动。

JavaScript 有以下方法和属性可以控制页面滚动：

### 常用的滚动方法

#### scrollTo

scrollTo 方法可以使界面滚动到给定元素的**指定坐标位置**。

```js
scrollTo(x-coord, y-coord)
scrollTo(options)
```

#### scroll

scroll 方法可以使界面滚动到给定元素的**指定坐标位置**。window.scrollTo 实际上和该方法是相同的。

```html
window.scroll(x-coord, y-coord) 
window.scroll(options)
```

#### scrollBy

scrollBy 方法是使页面相对当前的位置滚动多少距离。

```html
window.scrollBy(x-coord, y-coord)
window.scrollBy(options) 
```

- `x-coord` 是期望滚动到位置水平轴上距元素左上角的像素
- `y-coord` 是期望滚动到位置竖直轴上距元素左上角的像素

* options 是一个 ScrollToOptions 对象。
  * top：指定 window 或元素 Y 轴方向滚动的像素数。
  * left：指定 window 或元素 X 轴方向滚动的像素数。
  * behavior：指定滚动是否应该平滑进行，还是立即跳到指定位置。取值：smooth (平滑滚动) | instant  (瞬间滚动) | auto。默认值 `auto`，效果等同于 `instant`。

#### scrollIntoView

Element.scrollIntoView() 方法让当前的元素滚动到浏览器窗口的可视区域内。

```html
element.scrollIntoView(); // 等同于element.scrollIntoView(true) 
element.scrollIntoView(alignToTop); // Boolean型参数 
element.scrollIntoView(scrollIntoViewOptions); // Object型参数
```

* alignToTop：一个 Boolean 值。true 表示元素的顶端将和其所在滚动区的可视区域的顶端对齐；false 表示元素的底端将和其所在滚动区的可视区域的底端对齐。
* scrollIntoViewOptions：一个包含下列属性的对象：
  * behavior：定义动画过渡效果。取值：auto | smooth。默认为 auto。
  * block：定义垂直方向的对齐。取值：start | center | end | nearest。默认为 start。
  * inline：定义水平方向的对齐。取值：start | center | end | nearest。默认为 nearest。

> **这是一个实验中的功能**
> 此功能某些浏览器尚在开发。由于该功能对应的标准文档可能被重新修订，所以在未来版本的浏览器中该功能的语法和行为可能随之改变。



### 常用的滚动属性

#### scrollLeft

Element.scrollLeft 属性可以读取或设置元素滚动条到元素左边的距离。

注意：如果这个元素的内容排列方向 direction 是`rtl` (right-to-left) ，那么滚动条会位于最右侧（内容开始处），并且`scrollLeft`值为0。此时，当你从右到左拖动滚动条时，scrollLeft会从0变为负数。

`scrollLeft` 可以是任意整数，然而：

- 如果元素不能滚动（比如：元素没有溢出），那么`scrollLeft` 的值是0。
- 如果给`scrollLeft` 设置的值小于0，那么`scrollLeft` 的值将变为0。
- 如果给`scrollLeft` 设置的值大于元素内容最大宽度，那么`scrollLeft` 的值将被设为元素最大宽度。

#### scrollTop

Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。

一个元素的 `scrollTop` 值是这个元素的**内容顶部**（卷起来的）到它的视口可见内容（的顶部）的距离的度量。

其他与 scrollLeft 类似。



### 其他方法

window.scrollByLines()：按给定的行数滚动文档。注：目前仅Firefox浏览器支持。

window.scrollByPages()：在当前文档页面按照指定的页数翻页。注：目前仅Firefox浏览器支持。



### 注意问题

1. 低版本 IE 浏览器可能不支持  scrollTo()、scrollBy() 等方法。可以自己实现个滚动的方法。

2. `scrollTo()`、`scrollBy()`、`scrollBy()`  都可以用于 `window` 和 `element` 控制滚动。 但部分手机（比如：华为 麦芒4，系统版本：6.0.1），不支持 `element.scrollTo()`。可以使用 `element.scrollLeft` 属性。
3. window 没有 scrollTop 、scrollLeft 属性，但可以用  `document.documentElement.scrollTop、document.documentElement.scrollLeft` 实现窗口滚动。