## @规则：@media（媒体查询）

媒体查询（Media queries）非常实用，尤其是当你想要根据设备的大致类型（如打印设备与带屏幕的设备）或者特定的特征和设备参数（例如：屏幕分辨率和浏览器视窗宽度）来修改网站或应用程序时。

媒体查询常被用于以下目的：

* 有条件的通过 `@media` 和 `@import at-rules` 用 CSS 装饰样式。

* 用 `media=` 属性为 `<style>`、` <link>`、` <source>` 和其他 HTML 元素指定特定的媒体类型。如：

  ```html
  <link rel="stylesheet" src="styles.css" media="screen" />
  <link rel="stylesheet" src="styles.css" media="print" />
  ```

* 使用 `Window.matchMedia()`  和 `MediaQueryList.addListener()` 方法来测试和监控媒体状态。

### 语法

每条媒体查询语句都由一个可选的 **媒体类型** 和任意数量的 **媒体特性** 表达式构成。可以使用多种 **逻辑操作符** 合并多条媒体查询语句。媒体查询语句**不区分大小写**。

当媒体类型（如果指定）与在其上显示文档的设备匹配并且所有媒体特性表达式都计算为 `true` 时，媒体查询将计算为 `true`。 涉及未知媒体类型的查询始终为 `false`。

#### 媒体类型

媒体类型描述设备的一般类别。媒体类型是可选的，并且会（隐式地）应用 `all` 类型，但如果要使用 not 或 only 逻辑操作符，必需显式指定。

* all： 适用于所有设备；
* print： 适用于在打印预览模式下在屏幕上查看的分页材料和文档；
* screen：主要用于屏幕；
* speech： 主要用于语音合成器。

> **被废弃的媒体类型：** CSS2.1 和  Media Queries 3 定义了一些额外的媒体类型：tty、tv、projection、handheld、braille、embossed、aural，但是他们在 Media Queries 4 中已经被废弃，并且不应该被使用。aural 类型被替换为具有相似效果的speech。

#### 媒体特性

媒体特性描述了 userAgent、输出设备，或是浏览环境的具体特征。媒体特性表达式是完全可选的，它负责测试这些特性或特征是否存在、值为多少。每条媒体特性表达式都必须用括号括起来。

主要 [媒体特性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries/Using_media_queries#%E5%AA%92%E4%BD%93%E7%89%B9%E6%80%A7) 如下：

* aspect-ratio： 视窗（viewport）的宽高比，如：`min-aspect-ratio: 8/5`。
* color： 输出设备每个像素的比特值，常见的有 8、16、32 位。如果设备不支持输出彩色，则该值为 0。
* display-mode： 应用程序的显示模式，如 web app的manifest 中的 [display](https://developer.mozilla.org/zh-CN/docs/Web/Manifest#display) 成员所指定，可选值有：fullscreen | standalone | minimal-ui | browser，首选显示模式 standalone。
* height： 视窗（viewport）的高度。
* monochrome： 输出设备单色帧缓冲区中每个像素的位深度。如果设备并非黑白屏幕，则该值为 0。
* orientation：视窗（viewport）的旋转方向，可选值有：portrait | landscape。
* resolution：输出设备的像素密度（分辨率），如：`resolution: 150dpi`。
* width：视窗（viewport）的宽度，包括纵向滚动条的宽度。

#### 逻辑操作符

逻辑操作符 not、and 和 only 可用于联合构造复杂的媒体查询，您还可以通过用逗号分隔多个媒体查询，将它们组合为一个规则。

* and： 用于将多个媒体查询规则组合成单条媒体查询，它还用于将媒体功能与媒体类型结合在一起。

* not： 用于反转整个媒体查询的含义。 如果出现在以逗号分隔的查询列表中，它将仅否定应用了该查询的特定查询。 如果使用 not 运算符，则还必须指定媒体类型。

  ```css
  @media not all and (monochrome) {}
  /** 等价于 **/
  @media not (all and (monochrome)) {}
  
  @media not screen and (color), print and (color) {}
  /** 等价于 **/
  @media (not (screen and (color))), print and (color) { ... }
  ```

  **注意：** 在 Level 3 中，not 关键字不能用于否定单个媒体功能表达式，而只能用于否定整个媒体查询。

* only： 仅在整个查询匹配时才用于应用样式，对于防止较早的浏览器应用所选样式很有用。如果使用 only 运算符，则还必须指定媒体类型。

  当不使用 only 时，旧版本的浏览器会将 `screen and (max-width: 500px)` 简单地解释为 screen，忽略查询的其余部分。

  **注意：** only 对现代浏览器没有影响。

* 逗号（`,`）： 用于将多个媒体查询合并为一个规则。 逗号分隔列表中的每个查询都与其他查询分开处理。 因此，如果列表中的任何查询为 `true`，则整个 media 语句均返回 `true`。 换句话说，列表的行为类似于逻辑或（or）运算符。

### CSS 样式使用

@media 是 CSS @规则之一，可用于基于一个或多个 **媒体查询** 的结果来应用样式表的一部分。 使用它，您可以指定一个媒体查询和一个CSS块，当且仅当该媒体查询与正在使用其内容的设备匹配时，该 CSS 块才能应用于该文档。

媒体查询器语法：

```css
@media mediatype and|not|only (media feature) {
  css-code;
}
```

如下样式，只能应用于宽度不小于 900px 的页面下：

```css
@media screen and (min-width: 900px) {
  .font_size {
    font-size: 18px;
  }
}
```

如下样式，在设备竖屏时应用：

```css
@media (orientation: portrait){
  .front_color {
    color: green;
  }
}
```

常见的媒体查询：

```css
/** 主要屏幕尺寸划分 **/
@media screen and (min-width: 1200px) {}
@media screen and (min-width: 960px) and (max-width: 1199px) {}
@media screen and (min-width: 768px) and (max-width: 959px) {}
@media screen and (min-width: 480px) and (max-width: 767px) {}
@media screen and (max-width: 479px) {}

/** 横屏|竖屏 **/
@media (orientation: landscape){}
@media (orientation: portrait){}

/** 视窗宽高比 **/
@media (min-aspect-ratio: 16/9){}

/** 设备的像素密度（分辨率）**/
@media (resolution: 150dpi) {}
@media (resolution: 2dppx) {}
@media (min-resolution: 2dppx) {}
```

### Meta 标签使用

根据不同的媒体类型（计算机屏幕和打印）或媒体特性，引用不同的样式表：

```html
<link rel="stylesheet" media="mediatype and|not|only (media feature)" href="style.css">
```

`media` 属性规定被链接文档将显示在什么设备上。

如：在智能设备上，可以**根据屏幕设备的方向和尺寸来调用相应的样式文件**。

```html
<link rel="stylesheet" media="screen and (orientation:portrait)"  href="orientation_portrait.css">
<link rel="stylesheet" media="screen and (max-width:960px)" href="width_960.css">
```

虽然，如上方法可以实现媒体查询，但应该避免使用。因为，该方法有个大的弊端：会增加页面 Http 的请求次数（即使媒体查询条件不符，也会加载样式文件）。更好的做法是将媒体查询相关的样式都写在一个 css 文件里。

此外，除 `link`，还有 `area`、`source`、`style` 等标签也允许使用 `media` 属性。

### Javascript 使用

DOM 提供了通过编程方法来获得媒体查询结果的特性。这是通过 MediaQueryList 接口和它的方法来实现的。创建了 MediaQueryList 对象之后，就可以通过它来检查查询结果，或者设置事件监听器，在查询结果发生变化时自动接收到通知。

```javascript
const mediaQueryList = window.matchMedia("(orientation: portrait)")
if (mediaQueryList.matches) {
  /* 设备的旋转方向为纵向 portrait */
} else {
  /* 设备的旋转方向不是纵向，也就是横向 landscape */
}

/* mediaQueryList.matches 值变化时触发 */
mediaQueryList.addListener(mql => {
  console.log(mql)
})
```

可以调用 `removeListener()` 方法移除监听：

```javascript
const mediaQueryList = window.matchMedia("(orientation: portrait)");
function handleOrientationChange(mql) {}
mediaQueryList.addListener(handleOrientationChange)
mediaQueryList.removeListener(handleOrientationChange)
```

### 相关问题

#### device-width和width的区别

device-width 是设备整个显示区域的宽度，如真实的设备屏幕宽度；width 是目标显示区域的宽度，如浏览器宽度。

如果使用 device-width，那么缩小或放大浏览器时，CSS 是不执行 的，因为设备宽度没有变化；

如果使用 device-width，那么移动设备由竖变横时，CSS 是执行的，因为设备显示区域宽度发生了变化；

如果使用 width，缩小或放大浏览器时是执行 CSS 的，因为显示区域即浏览器大小发生了变化。

通常，面向移动设备使用 device-width；面向 PC 设备使用 max-width。

**注意：** `device-height`、`device-width` 已在 Media Queries Level 4 中被弃用。



### 参考资料

[MDN 使用媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries/Using_media_queries)

[@media 媒体查询](https://tsejx.github.io/css-guidebook/concept/rules/media/)