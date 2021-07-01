## CSS代码规范

### @charset

样式文件必须写上 `@charset` 规则，并且一定要在样式文件的第一行首个字符位置开始写，编码名用 `UTF-8` 。

```css
@charset "UTF-8";
```

* **UTF-8编码**：为世界统一编码，可以兼容全世界的操作系统，不会出现乱码情况。缺点是体积稍大点。

* **gb2312编码：**国外的浏览者可能会出现乱码，获提示安装语言包。一般，网站提供给全球看的一般用`UTF-8`，仅仅针对国内的用`gb2312`就可以了。体积稍小点，因为程序产生的网页文本使用ANSI编码格式，会比`UTF-8`文本编码节省一些体积，访问速度会稍微快一点点。

* **使用UTF-8编码有2个要注意：**
  * 网页的`meta`必须有这句：`<meta charset="UTF-8">`。
  * 网页的文本格式**必须保存为`UTF-8`格式**。

 

### 代码风格

* <b style="color:#0bb">class用"_"连接，id用驼峰命名。</b>
* 使用展开格式书写样式，即一个属性一行，每个属性声明末尾都要加分号。
* **选择器：**尽量少用通用选择器 `*`。
* 不使用 ID 选择器。
* 不使用无具体语义定义的标签选择器。
* **代码缩进：**统一使用四个空格进行代码缩进，使得各编辑器表现一致（各编辑器有相关配置）。
* 左括号与类名之间一个空格，冒号与属性值之间一个空格。
* 逗号分隔的取值，逗号之后一个空格。
* <b style="color:#0bb">为单个css选择器或新申明开启新行。</b>
* 尽可能使用短的十六进制数值，例如使用 `#fff` 替代 `#ffffff`。
* 属性值十六进制数值能用简写的尽量用简写。
* 不要为 `0` 指明单位。
* <b style="color:#0bb">去掉小数点前面的0。</b>
* <b style="color:#0bb">css属性值需要用到引号时，统一使用单引号。</b>
* 图片引入不需要引号



### 属性书写顺序

- 布局定位属性：`display / position / float / clear / visibility / overflow`
- 自身属性：`width / height / margin / padding / border / background`
- 文本属性：`color / font / text-decoration / text-align / vertical-align / white- space / break-word`
- 其他属性（CSS3）：`content / cursor / border-radius / box-shadow / text-shadow / background: linear-gradient …`



### 浏览器私有前缀在前，标准前缀在后

```css
{
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -o-border-radius: 10px;
    -ms-border-radius: 10px;
    border-radius: 10px;
}
```



### 属性简写

```css
background: [background-color] [background-image] [background-repeat] [background-attachment] [background-position] / [ background-size] [background-origin] [background-clip];


font: [font-style] [font-variant] [font-weight] [font-size]/[line-height] [font-family];  

transition: property duration timing-function delay;

animation: name duration timing-function delay iteration-count direction;
```
