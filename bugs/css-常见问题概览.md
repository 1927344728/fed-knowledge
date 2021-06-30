

## CSS常见问题概览

1. **box-sizing的一些特性**

   `box-sizing: content-box`：高度(height)不包括上下border、padding；宽度(width)包括左右border、padding。

   `box-sizing:border-box`：宽高值包括border、padding。

2. **表单元素 的placeholder文本不居中**

   pc端：`line-height:` [和表单元素的高度一样]
   移动端：`line-height：normal` 

3. Ios中input的`readonly、disabled`问题

   disabled：安卓机上可以显示，Ios机上显示空白。可改为readonly

   readonly：Ios手机中点击仍会出现软键盘弹框。样式中加`point-events: none`解决

   > readonly只能用于input(text/passward)、textarea元素；disabled可用于所有表单元素。
   >
   > readonly只是使文本框不能输入，外框没有变化；disabled会使文本框变灰。
   >
   > 将表单以 POST 或 GET 的方式提交的话，使用了 disabled 后，这个元素的值不会被传递出去，而 readonly 会将该值传递出去。

4. 当文字超出范围时自动补...省略号

   ```css
   /*单行*/
   {
       white-space: nowrap;
       overflow: hidden;
       text-overflow:ellipsis;
   }
   /*多行*/
   {
       overflow: hidden;
       text-overflow: ellipsis;
       display:-moz-box;
       display:-webkit-box;
       display:box;
       -moz-line-clamp: 3;
       -webkit-line-clamp: 3;
       line-clamp: 3;
       -moz-box-orient: vertical;
       -webkit-box-orient: vertical;
       box-orient: vertical;
   }
   ```

5. a标签伪类的相关问题

   * :active在移动端无效。需要在按钮元素或`body/html`上绑定一个`touchstart`事件才能激活`:active`状态。

     ```js
     //...空函数即可
     document.body.addEventListener('touchstart',function () { });
     ```

   * 元素使用`:active`，点击字体颜色会默认到`:visited`的默认颜色，需同时设置`:active、:visited`的颜色。

   * 伪类的设置顺序

     ```css
     /*按L-V-H-A的顺序设置超链接样式即可，可速记为LoVe（喜欢）HAte（讨厌）*/
     a {
         &:link{}
         &:visited{}
         &:hover{}
         &:active{}
     }
     ```

6. CSS动画页面闪动，动画卡顿：尽可能地使用合成属性`transform`、`opacity`来设计CSS3动画，不使用`position: left | top`来定位 。

   ```css
   -webkit-transform: translate3d(0, 0, 0);
   -moz-transform: translate3d(0, 0, 0);
   -ms-transform: translate3d(0, 0, 0);
   transform: translate3d(0, 0, 0);
   ```

7. **IE滚动条的颜色：设置在body上的滚动条颜色样式无效，需加在html标签选择符上即可**

   ```css
   /*滚动条整体样式*/
   /*高宽分别对应横竖滚动条的尺寸*/
   html::-webkit-scrollbar {
       width: 15px;  
       /*height: 1px;*/
   }
   /*滚动条里面小方块*/
   html::-webkit-scrollbar-thumb {
       border-radius: 10px;
       background-color: skyblue;
       background-image: -webkit-linear-gradient(
           45deg,
           rgba(255, 255, 255, 0.2) 25%,
           transparent 25%,
           transparent 50%,
           rgba(255, 255, 255, 0.2) 50%,
           rgba(255, 255, 255, 0.2) 75%,
           transparent 75%,
           transparent
       );
   }
   /*滚动条里面轨道*/
   html::-webkit-scrollbar-track {
       box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
       background: #ededed;
       border-radius: 10px;
   }
   ```

8. **CSS样式错乱**  

   页面样式在chrome中正常，在部分手机上错乱。调试发现某些样式缺少前缀。

   webpack项目中通过`autoprefixer`自动给样式加前缀（即，加-webkit, -ms, -moz-, -o-等前缀）。具体需要对哪些浏览器哪些版本加前缀，是通过配置决定的。如webpack中：  

   ```js
   "browserslist": [
       "> 1%",
       "last 2 versions"
   ]
   ```

   其中last 2 versions是指定对最新的两个版本加前缀，这个指定是不固定。随着浏览器的更新，所指向的版本也变化，导致autoprefixed不对之前的一些旧版本加前缀。

   **解决方法：指定需要加前缀的浏览器及对应版本**

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

9. **transform: scale引起的元素模糊问题**  

   css中使用transform: scale(1.18)放大元素，元素中的文字图片变模糊。

   **原因**：大概原理就是scale的时候导致了font-size算出了小数，所以chrome就模糊了处理，而且只会发生在复杂的dom结构里，很简单的dom结构，是不会发生模糊的。因为chrome在处理这种复杂dom结构的缩放的时候，把dom结构渲染成了一张图，然后对图片进行缩放。

   **解决**：对原有的dom结构，先进行zoom，慢慢调试到scale之后文字不模糊的程度就ok了

   > 网络上提供加translateZ(0)、translate3d(0,0,0)解决方案。项目中试过，无效。目前采用调整scale倍数的方法，即scale(1.18)改成scale(1.2)。



### Img标签图片空隙问题

#### 这个是浏览器的一个设计问题  

* img本来是行内元素，却可以用width 和height，当父元素没有设置高度的时候，用子元素们的高度计算出的高度给父元素的时候就会出现3px空隙这类的问题。

* img图片默认排版为 inline-block;而所有的inline-block元素之间都会有空白。
  ![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/other/1245223-a1d7789ea88eef3f.png)

#### 解决方法

- 把img标签设为块级元素：`img{ display:block;} ` 。
- 将父容器字体大小设为零：`font-size:0;  `。
- 去掉img标签之间的空格：将所用的img标签书写在同一行（即各个img标签之间不留空格），无须设置其他样式。  
- 设置图片的垂直对齐方式：`img{vertical-align:top;}`。可选text-top，bottom，text-bottom等，视情况而定  。
- 截掉超出的空白部分：父节点高宽固定，图片大小随父节点而定。设置父节点：`overflow:hidden`  。
- 设置图片的浮动属性:` img{ float: left;} `。
- 移动端图片宽、高度，最好为偶数。[具体原理与设备的象素比有关](https://juejin.im/entry/59e70320f265da431c6f6514)



### 关于背景、边框的一些问题

* 背景图片大小的兼容问题

  ```css
  background: url(xxx) no-repeat top top/80% auto;
  
  /**部分手机不支持"/"后加参数的写法*/
  background: url(xxx) no-repeat top top auto;
  background-size: 80%；
  ```

* 渐变颜色兼容问题

  ```css
  /*部分手机不支持background-image属性写渐变颜色。如酷派、联想s810t；*/
  background-image:-webkit-radial-gradient(center center, circle cover, #0087fb 0%, #0087fb 35%,transparent 35%);
  ```

* **IOS中background渐变色中transparent显示为黑色**

  background渐变色：红(0%) -> 透明(10%) -> 透明(90%) -> 红(100%)。ios中透明颜色显示为黑色。

  ```css
  background: linear-gradient(to right, #f91250 0%, transparent 10%, transparent 90%, #f91250 100%);
  ```

  **原因：未知**

  **错误解决方法：**将`transparent`改成`rgba(255,255,255,0)`。**实测结果：显示白色**

  ```css
  background: linear-gradient(to right, rgba(249,18,80,1) 0%, rgba(255,255,255,0) 10%, rgba(255,255,255,0) 90%, rgba(249,18,80,1) 100%);
  ```

  **正确解决方法：**将transparent改成rgba(249,18,80,0)，即将透明色前的色值 `#f91250`转换成rgb值，并设置透明度设为0。

  ```css
  background: linear-gradient(to right, rgba(249,18,80,1) 0%, rgba(249,18,80,0) 10%, rgba(249,18,80,0) 90%, rgba(249,18,80,1) 100%);
  ```

* 元素设置`border-radius: 100px`（大于元素宽高），圆形有些扁

  父标签字体大小设置为零，子标签设置font-size。

* body设置100%高度后被底部的导航栏挡住

  ```js
  document.documentElement.style.height = `${window.innerHeight}px`
  ```

* body设置100%、overflow，仍有X方向滚动条

  body没有设置`postion:relative`，且有absolute元素宽度超过屏幕宽度。



### 关于-webkit的一些样式

- 禁止用户选中文字：`-webkit-user-select:none`；  

- 去掉按钮touch时蓝色边框 :` -webkit-tap-highlight-color:rgba(0,0,0,0)`；  

- 去除webkit的滚动条: `::-webkit-scrollbar{ display: none; }`；  

- 禁止保存或者拷贝图像(仅ios有效) : `img { -webkit-touch-callout: none; }  `；

- 禁止选中内容 htm: `{ -webkit-user-select: none;}  `；

- 修改表单元素中placeholder 的样式： `::-webkit-input-placeholder{ }`；

- 去除表单元素的默认样式: ` -webkit-appearance:none`；  如`select`、`input`；

- `input type=number`之后，pc端出现上下箭头：  

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

  

### 关于table的一些样式

* td用col设置了宽度后超出部分隐藏: table加属性`table-layout:fixed`（固定宽度布局）  

* col和colgroup 发挥作用且保证兼容的应用就只有俩： `width`和`background  `

* table定义了`border-collapse:collapse`属性，`border-spacing`属性不生效

* table中实现圆角效果：在table中设置`border-radius`发现不起作用，原因是`border-collapse: collapse`和`border-radius`不兼容。以下方法解决**（chrome试验可行，未测手机兼容性）**：

  ```html
  <table>
      <tr>
          <td>头部1</td>
          <td>头部2</td>
          <td>头部3</td>
      </tr>
      <tr>
          <td>1内容1</td>
          <td>1内容2</td>
          <td>1内容3</td>
      </tr>
      <tr>
          <td>2内容1</td>
          <td>2内容2</td>
          <td>2内容3</td>
      </tr>
  </table>
  ```

  ```html
  <!--方法一-->
  <!--不设置border-collapse属性或者设置border-collapse: separate;设置border-spacing: 0;-->
  <!--给表格加border-radius,给每个单元格设置边框-->
  <style>
      table {
          width: 600px;
          text-align: center;
          border-spacing: 0;
          border: 1px solid #ccc;
          border-radius: 12px;
          overflow: hidden;
      }
      table tr {
          height: 50px;
          line-height: 50px;
      }
  
      /*加边框*/
      table tr td {
          border-right: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
      }
      table tr:last-child td {
          border-bottom: 0;
      }
      table tr td:last-child {
          border-right: 0;
      }
  </style>
  ```

  ```html
  <!--方法二-->
  <!--使用box-shadow替代border-->
  <style>
      table {
          width: 600px;
          text-align: center;
          border-collapse: collapse;
          border-radius: 12px;
          border-style: hidden;
  
          box-shadow: 0 0 0 1px #ccc;
          overflow: hidden;
      }
      table tr {
          height: 50px;
          line-height: 50px;
      }
      table tr td {
          border: 1px solid #ccc;
      }
  </style>
  ```



### 旧手机上的一些问题（机型可能已淘汰）

* **border-radius失效**

  * 部分Android不识别百分比单位，可设置一个较大值的px、em、rem单位

  * 部分手机下，width值过大，border-radius无效

  * Android 4.2.x 不支持border-radius缩写

* **Samsung S4 (Android Browser4.4.2)**

  使用了 border-radius，并且使用了 -webkit-transform 属性，当使用了 translatez 或者 translate3d 值，圆角会出现问题，可用 -webkit-transform: translate(0, 0) 来避免这个问题。

* **Android 4.x bug**

  * 三星 Galaxy S4中自带浏览器不支持border-radius缩写

  * 同时设置border-radius和背景色的时候，背景色会溢出到圆角以外部分

  * 部分手机(如三星)，a链接支持鼠标:visited事件，也就是说链接访问后文字变为紫色

  * android无法同时播放多音频audio