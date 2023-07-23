## HTML代码规范

#### DOCTYPE 声明

```html
<!DOCTYPE 根元素 可用性 "注册//组织//类型 标签 定义//语言" "URL">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

DOCTYPE（document type）文档类型的简写，用来说明你用的 XHTML 或者 HTML 是什么版本。

其中 DTD 叫文档类型定义，里面包含了文档的规则，浏览器就根据你定义的 DTD 来解释你页面的标识，并展现出来。要建立符合标准的网页，DOCTYPE 声明是必不可少的关键组成部分；除非你的 XHTML 确定了一个正确的 DOCTYPE，否则你的标识和 css 都不会生效。

XHTML 1.0 提供了三种DTD声明可供选择：有过度的（Transitional）、严格的（strict）、框架的（frameset）。

HTML5 由以下语句声明：

```html
<!DOCTYPE html>
```

单击 [DOCTYPE：文档类型与浏览器模式](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/html-tan-suo-xi-lie/04doctype-wen-dang-lei-xing-yu-liu-lan-qi-mo-shi)，了解更多 DOCTYPE 信息。

#### 命名空间namespace

```html
<html xmlns="http://www.w3.org/1999/xhtml">
```

xmlns 是 XHTML namespace 的缩写，称为命名空间。**它在 XHTML 中是必要的，而在 HTML 中则是可选的。**

XHTML 是 HTML 向 XML 过渡的标识语言，它需要符合 XML 文档规则，因此也需要定义名字空间。又因为 XHTML1.0 不能自定义标识，所以它的名字空间都相同，就是"http://www.w3.org/1999/xhtml"。

xmlns 属性可以在文档中定义一个或多个可供选择的命名空间，可以放置在文档内任何元素的开始标签中。

xmlns 提供**避免元素命名冲突**的方法。因为 XML 中的元素名称是由开发者定义的，当两个不同的文档使用相同的元素名时，就会发生命名冲突。

如果需要使用符合 XML 规范的 XHTML 文档，则应该在文档中的 `<html>` 标签中至少使用一个 xmlns 属性，以指定整个文档所使用的主要命名空间：

```html
<html xmlns="http://www.w3.org/1999/xhtml">
```

如果需要在一个 div 元素中显示一串数学公式，则可以为该 div 元素定义一个数学命名空间。比如这样：

```html
<div xmlns="http://www.w3.org/1999/Math/MathMl">x3/x</div>
```

如果您不希望在每次显示除法公式时都在 div 元素中定义 xmlns 属性，那么更好的办法是在文档的开头处定义具有前缀的命名空间：

```html
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:math="http://www.w3.org/1999/Math/MathMl">
```

然后，您就可以在 div 中使用该前缀了，就像这样：

```html
<math:div>x3/X<div>
```

常用的命名空间值：

* HTML：http://www.w3.org/1999/xhtml。

* MathML：http://www.w3.org/1998/Math/MathML。MathML 指数学标记语言，是XML语言的一个子集，用来在 Web 网页，甚至部分软件中显示数学公式。简言之，就是使用特殊的类似 HTML 的标记在网页中显示数学公式。

* svg：http://www.w3.org/2000/svg。

* xllink：http://www.w3.org/1999/xlink。XLink 是一种通过 [W3C推荐标准](https://zh.wikipedia.org/wiki/W3C推荐标准) 认证的XML标记语言，用于在 XML 文档中创建超链接，以及提供与这些链接相关联的元数据。

* namespace：http://www.w3.org/XML/1998/namespace。？

* xmlns：http://www.w3.org/2000/xmlns/。？

#### <b style="color:#0bb">页面语言LANG</b>

Lang 属性的取值应该遵循互联网工程任务组–IETF（The Internet Engineering Task Force）制定的关于语言标签的文档。推荐使用属性值 cmn-Hans-CN（简体, 中国大陆），但是考虑浏览器和操作系统的兼容性，目前仍然使用 `zh-CN` 属性值

`<html lang="zh-CN">`

#### 定义语言编码CHARSET

```html
<meta charset="UTF-8">
```

为了被浏览器正确解释和通过 W3C 代码校验，所有的 HTML 文档都必须声明它们所使用的编码语言。

HTML5 默认的字符编码是 `UTF-8`。

注意：请尽量统一写成标准的 `UTF-8`，不要写成 `utf8、UTF8`。根据 IETF 定义，其编码标准的写法是 `UTF-8`，而 `UTF8、utf8 ` 的写法只是出现在某些编程系统中。

#### HTML标签闭合

**HTML元素共有以下5种：**

- 空元素：`area、base、br、col、command、embed、hr、img、input、keygen、link、meta、param、source、track、wbr`
- 原始文本元素：`script、style`
- RCDATA元素：`textarea、title`
- 外来元素：来自 MathML 命名空间和 SVG 命名空间的元素。
- 常规元素：其他 HTML 允许的元素都称为常规元素。

**为了能让浏览器更好的解析代码以及能让代码具有更好的可读性，有如下约定：**

- 所有具有开始标签和结束标签的元素都要写上起止标签，某些允许省略开始标签或和束标签的元素亦都要写上。
- **空元素标签都不加 “/” 字符**

#### HTML代码风格

- HTML 标签名、类名、标签属性和大部分属性值统一用小写；

- HTML 文本、CDATA、JavaScript、meta 标签某些属性等内容可大小写混合；

- 不需要为 CSS、JS 指定类型属性，HTML5 中默认已包含；

- 元素属性值使用双引号语法。

- 给所有属性赋一个值：XHTML 规定所有属性都必须有一个值，没有值的就重复本身。

  ```html
  <input type="checkbox" name="name" value="abcd" checked>
  
  <!--标准写法-->
  <input type="checkbox" name="name" value="abcd" checked="checked" />
  ```


- 图片添加有意义的 alt 属性；
- 在 form 表单中增加 lable，以增加用户友好度；
- 元素属性顺序：
* `class`
  
* `id`
  
* `name`
  
* `data-*`
  
* `src`, `for`, `type`, `href`, `value` , `max-length`, `max`, `min`, `pattern`
  
* `placeholder`, `title`, `alt`
  
* `aria-*`, `role`
  
* `required`, `readonly`, `disabled`

* **特殊字符引用:**  HTML 中不能使用小于号  “<”  和大于号  “>” 特殊字符，浏览器会将它们作为标签解析，若要正确显示，在 HTML 源代码中使用字符实体。

  [HTML 特殊符号编码对照表](https://tool.chinaz.com/tools/htmlchar.aspx)

  ```html
  原代码	    显示结果	描述
  &lt;        <        小于号或显示标记
  &gt;	    >        大于号或显示标记
  &amp;	    &        可用于显示其它特殊字符
  &quot;	    “        引号
  &reg;	    ®        已注册
  &copy;	    ©        版权
  &trade;	    ™        商标
  &ensp;               半个空白位
  &emsp;               一个空白位
  &nbsp;               不断行的空白
  ```

- **代码缩进: 使用四个空格进行代码缩进，使得各编辑器表现一致（各编辑器有相关配置）**

  **两个空格：**

  - 使用两个空格可以一眼就知道是两个空格而不是一个制表符（大部分编辑器默认一个制表符占四个空格的位置）。所以两个空格更容易保持一致性。
  - 能和其他语言统一。比如写 JSON、Python、YAML 时就不用切换习惯了

  **四个空格：**更具有层次感，便于观察代码的逻辑结构。

- **代码嵌套:** 元素嵌套规范，每个块状元素独立一行，内联元素可选。段落元素与标题元素只能嵌套内联元素。减少标签数量，需要尽量避免多余的父节点。

- 列表中的条目必须总是放置于`<ul>`、`<ol>`或`<dl>` 中，永远不要用一组 `<div>`或`<p>` 来表示。

* **注释规范**

  **单行注释:**一般用于简单的描述，如某些状态描述、属性描述等。注释位于要注释代码的上面，单独占一行

  **模块注释:**一般用于描述模块的名称以及模块开始与结束的位置。

#### HTML模板示例

HTML5 标准模版：

``` html
<html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
        <title>HTML5标准模版</title>
    </head>
    <body></body>
</html>
```

移动端 HTML5 模版：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <!--优先使用IE最新版本和Chrome-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--移动设备上屏幕显示区域的设置-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover">
        <!--主要是针对苹果手机将数字自动识别为号码-->
        <meta name="format-detection" content="telephone=no">
        <!--启用全屏模式，伪装app，离线应用。-->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <!--隐藏状态栏/设置状态栏颜色-->
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器-->
        <meta name="HandheldFriendly" content="True">
        <!-- 微软的老式浏览器 告诉浏览器页面为某个宽度特殊优化-->
        <meta name="MobileOptimized" content="width">
        <!--指定适合自己网站的渲染内核名称-->
        <meta name="renderer" content="webkit" />
        <title></title>
    </head>
    <body></body>
</html>
```

PC 端 HTML5 模版：

```html
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="keywords" content="your keywords">
        <meta name="description" content="your description">
        <meta name="author" content="author,email address">
        <meta name="robots" content="index,follow">
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
        <meta name="renderer" content="ie-stand">
        <title>PC端HTML模版</title>
    </head>
    <body></body>
</html>
```