## Web中如何实现长宽比

长宽比在影视制作中又被称之为宽高比，指的是一个视频的宽度除以它的高度所得到的比例，通常表示为 x:y 或 x ×y，其中的冒号和叉号表示中文的 “比” 之意。

Web 中的长宽比最初是用于响应式设计中的 img、video 之类的元素，随之扩展为适用于任何的容器长宽比。

### 利用可替换元素

可替换元素（img、video）和其他元素不同，它们本身有像素宽度和高度的概念。所以，只需要指定其宽度或者高度值，另一边自动计算就可以了。

```css
img {
  width: 100%;
  height: auto;
}
```

**备注：** 基于可替换元素的这个特性，当需要一个固定长宽比时，可以用可替换元素撑开容器，具体（以 4: 3 为例）实现：准备一张长宽比为 4:3 的透明图片；在容器中引用一个 img 元素，其 src 是该图片的 URL，width 设备为 100%；容器的主内容区域，通过绝对定位，覆盖在图片上。

```html
<div style="position: relative;">
  <img src="pic-4X3.jpg" style="width: 100%">
  <div style="position: absolute;top: 0; left: 0; width: 100%">
    主内容区域
	</div>
</div>
```

### padding-bottom/padding-top

**CSS 知识点：** 容器垂直方向的内外边距（padding-bottom/padding-top/margin-bottom/margin-top）使用百分比做单位时，是**基于容器的宽度来计算**的。

也就是说，当一个容器的宽度是 300px，如果没有子元素，并设置 `padding-top: 100%`，则 padding-top 的实际值是 300px，容器被撑开的高度为 300px。然后，在容器中，使用绝对定位来充满主内容。

```css
.wrapper {
  position: relative;
  width: 300px;
}
.wrapper-aspect-ratio {
  width: 100%;
	height: 0;
	padding-bottom: 100%;
}
..wrapper-main {
  positon: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
```

在 CSS 中有一个神奇的 calc() 函数，它可以做一些基本的数学计算：

```css
padding-top: calc(200 / 300 * 100%);
```

**备注：** 该方式只能高度随着宽度动，并不能实现宽度随着高度动。

### aspect-ratio 属性

aspect-ratio 属性为容器定义一个期待的纵横比，这个纵横比可以用来计算自动尺寸以及为其他布局函数服务。

aspect-ratio 属性接收以下值：

* auto：具有固有宽高比的替换元素将使其宽高比，否则相当于没有设置宽高比。
* 宽高比，即两个无单位值之间的比例。

```html
<div class=".aspect-ratio"></div>
<style>
  .aspect-ratio {
		aspect-ratio: 2/1;
    background: #0aa;
  }
</style>
```

**备注：** 目前来看（2022-10-21），除了 IE，其他浏览器都支持该属性。[caniuse - aspect-ratio](https://caniuse.com/?search=aspect-ratio)

### JavaScript计算

用 JavaScript 根据目标元素的宽度，计算需要的高度，再将高度设置到目标元素。

### 参考资料

[稀土掘金 - CSS如何实现固定宽高比？](https://juejin.cn/post/6844904070679887886)

[码农网 - 容器长宽比](https://www.codercto.com/a/6546.html)

[MDN - aspect-ratio](https://developer.mozilla.org/zh-CN/docs/Web/CSS/aspect-ratio)