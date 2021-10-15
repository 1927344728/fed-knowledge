## HTML代码规范

#### DOCTYPE 声明

`HTML` 文件必须加上 `DOCTYPE `声明，并统一使用 `HTML5 ` 的文档声明：`<!DOCTYPE html>`

#### <b style="color:#0bb">页面语言LANG</b>

Lang 属性的取值应该遵循互联网工程任务组–IETF（The Internet Engineering Task Force）制定的关于语言标签的文档。推荐使用属性值 cmn-Hans-CN（简体, 中国大陆），但是考虑浏览器和操作系统的兼容性，目前仍然使用 `zh-CN` 属性值

`<html lang="zh-CN">`

#### CHARSET

因为 ISO-8859 中字符集大小是有限的，且在多语言环境中不兼容，所以 `Unicode `联盟开发了 `Unicode `标准。

`Unicode `标准覆盖了（几乎）所有的字符、标点符号和符号。

`Unicode `使文本的处理、存储和运输，独立于平台和语言。

`HTML-5` 中默认的字符编码是 `UTF-8`

请尽量统一写成标准的 `UTF-8`，不要写成 `utf-8` 或 `utf8` 或 `UTF8`。根据 `IETF`对`UTF-8`的定义，其编码标准的写法是 `UTF-8`；而 `UTF8 `或 `utf8 `的写法只是出现在某些编程系统中

`<meta charset="UTF-8">`



#### HTML标签闭合

**HTML元素共有以下5种：**

- 空元素：`area、base、br、col、command、embed、hr、img、input、keygen、link、meta、param、source、track、wbr`
- 原始文本元素：`script、style`
- RCDATA元素：`textarea、title`
- 外来元素：来自 MathML 命名空间和 SVG 命名空间的元素。
- 常规元素：其他 HTML 允许的元素都称为常规元素。

**为了能让浏览器更好的解析代码以及能让代码具有更好的可读性，有如下约定：**

- 所有具有开始标签和结束标签的元素都要写上起止标签，某些允许省略开始标签或和束标签的元素亦都要写上。
- 空元素标签都不加 “/” 字符



#### HTML代码风格

- HTML 标签名、类名、标签属性和大部分属性值统一用小写；

- HTML 文本、CDATA、JavaScript、meta 标签某些属性等内容可大小写混合；

- 不需要为 CSS、JS 指定类型属性，HTML5 中默认已包含；


- 元素属性值使用双引号语法、元素属性值可以写上的都写上。属性顺序：

  * `class`

  * `id`

  * `name`

  * `data-*`

  * `src`, `for`, `type`, `href`, `value` , `max-length`, `max`, `min`, `pattern`

  * `placeholder`, `title`, `alt`

  * `aria-*`, `role`

  * `required`, `readonly`, `disabled`

* **特殊字符引用:**  HTML 中不能使用小于号  “<”  和大于号  “>” 特殊字符，浏览器会将它们作为标签解析，若要正确显示，在 HTML 源代码中使用字符实体

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

* HTML5 标准模版

  ``` html
  <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
          <title>HTML5标准模版</title>
      </head>
      <body></body>
  </html>
  ```
  
* 移动端 HTML5 模版

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
* PC 端 HTML5 模版

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