## CSS代码规范

### @charset

样式文件必须写上 `@charset` 规则，并且一定要在样式文件的第一行首个字符位置开始写，编码名用 `UTF-8` 。

```css
@charset "UTF-8";
```

* **UTF-8 编码**：为世界统一编码，可以兼容全世界的操作系统，不会出现乱码情况。缺点是体积稍大点。

* **gb2312 编码：**国外的浏览者可能会出现乱码，获提示安装语言包。一般，网站提供给全球看的一般用`UTF-8`，仅仅针对国内的用`gb2312` 就可以了。体积稍小点，因为程序产生的网页文本使用 ANSI 编码格式，会比 `UTF-8` 文本编码节省一些体积，访问速度会稍微快一点点。

* **使用 UTF-8 编码有 2 个要注意：**
  * 网页的 `meta` 必须有这句：`<meta charset="UTF-8">`。
  * 网页的文本格式**必须保存为 `UTF-8` 格式**。

### 代码风格

* <b style="color:#0bb">class用"-"连接，id用驼峰命名。</b>
* 使用展开格式书写样式，即一个属性一行，每个属性声明末尾都要加分号。
* **选择器：**尽量少用通用选择器 `*`。
* 不使用 ID 选择器。
* 不使用无具体语义定义的标签选择器。
* **代码缩进：**统一使用两个空格进行代码缩进，使得各编辑器表现一致（各编辑器有相关配置）。
* 左括号与类名之间一个空格，冒号与属性值之间一个空格。
* 逗号分隔的取值，逗号之后一个空格。
* <b style="color:#0bb">为单个css选择器或新申明开启新行。</b>
* 十六进制数值能用简写的尽量用简写，例如使用 `#fff` 替代 `#ffffff`。
* 不要为 0 指明单位。
* <b style="color:#0bb">去掉小数点前面的 0。</b>
* <b style="color:#0bb">css属性值需要用到引号时，统一使用单引号。</b>
* 图片引入不需要引号。

### 属性书写顺序

- 布局定位属性：display、position、float、clear、visibility、overflow。

- 自身属性：width、height、margin、padding、border、background。
- 文本属性：color、font、text-decoration、text-align、vertical-align、white- space、break-word。
- 其他属性（CSS3）：content、cursor、border-radius、box-shadow、text-shadow、background: linear-gradient …。

  ```javascript
  body {
      /* 定位属性 */
      display: flex;
      position: absolute;
      float: left;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      clear: both;
      z-index: 100;
      content: '';
      list-style: square;
      visibility: visible;
  
      /* 自身属性 */
      width: 100px;
      height: 100px;
      border: 10px solid #fff;
      padding: 10px;
      margin: 10px;
      background: #fff;
  
      /* 文字样式 */
      color: white;
      font-family: '微软雅黑';
      font-size: 14px;
      font-style: normal;
      font-weight: bold;
      font-varient: normal;
  
      /* 文本属性 */
      text-align: center;
      vertical-align: middle;
      text-transform: none;
      text-indent: 2px;
      text-decoration: underline;
      letter-spacing: 10px;
      word-spacing: 10px;
      white-space: 10px;
      text-overflow: ellipsis;
  }
  ```

* 有浏览器前缀的属性在前，标准属性在后。

  ```css
  .border-radius {
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      -o-border-radius: 10px;
      -ms-border-radius: 10px;
      border-radius: 10px;
  }
  ```

  

