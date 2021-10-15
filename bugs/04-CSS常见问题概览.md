

## CSS常见问题概览

#### **CSS样式错乱**  

样式在 PC 端 Chrome 浏览器中显示正常，在部分手机上错乱。

**原因：** 样式缺少前缀。webpack 项目中通过 `autoprefixer` 自动给样式加前缀（即，加 ``-webkit, -ms, -moz-, -o-` 等前缀），而具体需要对哪些浏览器哪些版本加前缀，是通过配置决定的。  

```js
"browserslist": [
    "> 1%",
    "last 2 versions"
]
```

其中 `last 2 versions` 是指定对最新的两个版本加前缀，这个指定是不固定。随着浏览器的更新，所指向的版本也变化，导致`autoprefixed` 不对之前的一些旧版本加前缀。

**解决方法：** 在 `package.json` 文指定需要加前缀的浏览器及对应版本，当然，也可以用其他文档形式配置。

```js
"browserslist": [
    "> 1%",
    "last 2 versions",
    "Android >= 3.2",
    "Firefox >= 20",
    "iOS >= 7",
    "chrome >  20"
]
```

#### **transform: scale引起的元素模糊问题**  

CSS 中使用 `transform: scale(1.18)` 放大元素，元素中的文字图片变模糊。

**原因**：大概原理就是 `scale` 的时候导致了 `font-size` 算出了小数，所以 Chrome 就模糊了处理，而且只会发生在复杂的 DOM 结构里，很简单的 DOM 结构，是不会发生模糊的。因为 Chrome 在处理这种复杂 Dom 结构的缩放的时候，把 Dom 结构渲染成了一张图，然后对图片进行缩放。

**解决**：对原有的 Dom 结构，先进行 zoom，慢慢调试到 scale 之后文字不模糊的程度就 ok了。目前采用调整 scale 倍数的方法，即scale(1.18) 改成 scale(1.2)。

**其他尝试：** 加 `translateZ(0)、translate3d(0,0,0)` 的解决方案，亲测无效。

#### a标签伪类问题

* **问题一：** `:active` 在移动端无效。

  **解决：** 在元素或 `body/html` 上绑定一个 `touchstart` 事件能激活 `:active` 状态。

  ```js
  //...空函数即可
  document.body.addEventListener('touchstart',function () { });
  ```

* 元素使用 `:active`，点击字体颜色会默认到 `:visited` 的默认颜色，需同时设置 `:active、:visited` 的颜色。

* 伪类的优先有：

  ```css
  /*按L-V-H-A的顺序设置超链接样式即可，可速记为LoVe（喜欢）HAte（讨厌）*/
  a {
      &:link{}
      &:visited{}
      &:hover{}
      &:active{}
  }
  ```

#### 表单元素的placeholder文本不居中

* PC端：`line-height:` [和表单元素的高度一样]；
* 移动端：`line-height：normal` 。

#### CSS动画页面闪动，动画卡顿

尽可能地使用合成属性 `transform`、`opacity` 来设计CSS3动画，不使用 `position: left | top` 来定位 。

```css
-webkit-transform: translate3d(0, 0, 0);
-moz-transform: translate3d(0, 0, 0);
-ms-transform: translate3d(0, 0, 0);
transform: translate3d(0, 0, 0);
```

#### box-sizing属性

`content-box`：设置的高度不包括上下 `border、padding`；宽度包括左右 `border、padding`；

`border-box`：设置的宽高值包括 `border、padding`。



### 背景边框的问题

#### 背景图片大小

```css
background: url(xxx) no-repeat top top/80% auto;

/**部分手机不支持"/"后加参数的写法*，可改用下面写法/
background: url(xxx) no-repeat top top auto;
background-size: 80%；
```

#### 渐变颜色

```css
/*部分手机不支持background-image属性写渐变颜色。如酷派、联想s810t；*/
background-image: -webkit-radial-gradient(center center, circle cover, #0087fb 0%, #0087fb 35%,transparent 35%);
```

#### 透明色

IOS中 `background` 渐变色中 `transparent` 显示为黑色。

```css
background: linear-gradient(to right, #f91250 0%, transparent 10%, transparent 90%, #f91250 100%);
```

**错误解决方法：**将 `transparent` 改成 `rgba(255,255,255,0)`。

```css
background: linear-gradient(to right, rgba(249,18,80,1) 0%, rgba(255,255,255,0) 10%, rgba(255,255,255,0) 90%, rgba(249,18,80,1) 100%);
```

**正确解决方法：**将 `transparent` 改成 `rgba(249,18,80,0)`，即将透明色前的色值 `#f91250` 转换成 rgba 值，并设置透明度设为0。

```css
background: linear-gradient(to right, rgba(249,18,80,1) 0%, rgba(249,18,80,0) 10%, rgba(249,18,80,0) 90%, rgba(249,18,80,1) 100%);
```

#### 圆形有些扁

元素设置 `border-radius: 100px`（大于元素宽高），圆形有些扁。

父标签字体大小设置为零，由子标签设置 `font-size` 属性。

#### 底部的导航栏挡住

`body` 设置 `height: 100%` 后被底部的导航栏挡住。

```js
document.documentElement.style.height = `${window.innerHeight}px`
```

#### 滚动条未隐藏

`body` 设置 `width: 100%; overflow: hidden`，仍有 X 方向滚动条。

**原因：** `body` 没有设置 `postion:relative`，且有子元素中有绝对定位元素宽度超过屏幕宽度。



### -webkit的问题

- 禁止用户选中文字：`-webkit-user-select:none`；  

- 去掉按钮touch时蓝色边框 :` -webkit-tap-highlight-color:rgba(0,0,0,0)`；  

- 去除webkit的滚动条: `::-webkit-scrollbar{ display: none; }`；  

- 禁止保存或者拷贝图像(仅ios有效) : `img { -webkit-touch-callout: none; }  `；

- 禁止选中内容 htm: `{ -webkit-user-select: none;}  `；

- 修改表单元素中placeholder 的样式： `::-webkit-input-placeholder{ }`；

- 去除表单元素的默认样式: ` -webkit-appearance:none`；  如`select`、`input`；

- `input type=number`之后，PC 端出现上下箭头：  

  ```css
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
  }
  ```

- 快速回弹滚动 (iOS上拥有像Native 的滚动效果)

  ```css
  {
      overflow: auto;
      -webkit-overflow-scrolling:touch;
  }
  ```

  

### table样式的问题

* td 用 col 设置了宽度后超出部分隐藏：table 加属性 `table-layout:fixed`（固定宽度布局）  ;

* col 和 colgroup 发挥作用且保证兼容的应用就只有俩： `width、background  `；

* table 定义了 `border-collapse:collapse` 属性，`border-spacing` 属性不生效；

* table中 实现圆角效果：在 table 中设置 `border-radius` 发现不起作用，原因是 `border-collapse: collapse` 和 `border-radius` 不兼容。以下方法解决**（chrome试验可行，未测手机兼容性）**：


### 旧手机上的问题（机型可能已淘汰）

#### border-radius失效

* 部分 Android 不识别百分比单位，可设置一个较大值的px、em、rem单位；

* 部分手机下，width 值过大，border-radius 无效；

* Android 4.2.x 不支持 border-radius 缩写；

* **Samsung S4 (Android Browser4.4.2)**

  使用了 border-radius，并且使用了 -webkit-transform 属性，当使用了 translatez 或者 translate3d 值，圆角会出现问题，可用 -webkit-transform: translate(0, 0) 来避免这个问题。

* **Android 4.x bug**

  * 三星 Galaxy S4中自带浏览器不支持border-radius缩写

  * 同时设置border-radius和背景色的时候，背景色会溢出到圆角以外部分

  * 部分手机(如三星)，a链接支持鼠标:visited事件，也就是说链接访问后文字变为紫色

  * android无法同时播放多音频audio