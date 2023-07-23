## 关于HTML

HTML（Hyper Text Markup Language），即超文本标记语言，是一种使用结构化 Web 网页及其内容的标记语言。就其核心而言， HTML 是一种相当简单的、由不同元素组成的标记语言，它可以应用于文本片段，使文本在文档中具有不同的含义（段落、列表、表格），将文档结构化为逻辑块（头部、主要内容、导航栏），并且可以将图片、影像等内容嵌入到页面中。

HTML常用标记：

```html
<head> <title> <body> <header> <footer> <article> <section> <p> <div> <span> <img> <aside> <audio> <canvas> <datalist> <details> <embed> <nav> <output> <progress> <video>
```

**HTML 文档本身是一种文本文件，其内容由信息和为信息指定的标记符组成**，通过专用的浏览器来识别，并将这些 HTML 文件 “翻译” 成可以识别的信息，即现在所见到的网页内容（如：文字如何处理、画面如何安排、图片如何显示等）。此外，也可以引入其它文件，用来描述一个网页的表现（如 CSS）或行为（如 JavaScript）等。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="path/css/css_01.css">
    <title>网页标题</title>
  </head>
  <body>
    <p>这是一段文本</p>
    <img src="path/images/pic_01.jpg" />
    <script src="path/js/js_01.js"></script>
  </body>
</html>
```

超文本是一种组织信息的方式，它通过超级链接方法将文本中的文字、图表与其他信息媒体相关联。这些相互关联的信息媒体可能在同一文本中，也可能是其他文件，或是地理位置相距遥远的某台计算机上的文件。

### HTML的诞生

HTML 是由 Web 的发明者 Tim Berners-Lee 和同事 Daniel W. Connolly 于 1990 年创立的一种标记语言，它是标准通用化标记语言 SGML 的应用。用 HTML 编写的超文本文档称为 HTML 文档，它能独立于各种操作系统平台（如 UNIX、Windows等）。

自 1990 年以来，HTML 就一直被用作万维网的信息表示语言，使用 HTML 描述的文件需要通过 Web 浏览器显示出效果。HTML 是一种建立网页文件的语言，通过标记式的指令（Tag），将影像、声音、图片、文字动画、影视等内容显示出来。

### HTML发展史

HTML 是用来标记 Web 信息如何展示以及其他特性的一种语法规则，是基于更古老一些的语言 SGML 定义，并简化了其中的语言元素。

HTML 历史上有如下版本：

* HTML 1.0：在 1993 年 6 月作为互联网工程工作小组（IETF）工作草案发布；
* HTML 2.0：1995 年 11 月作为 RFC 1866 发布，于 2000 年 6 月发布之后被宣布已经过时；
* HTML 3.2：1997 年 1 月 14 日，W3C 推荐标准；
* HTML 4.0：1997 年 12 月 18 日，W3C 推荐标准；
* HTML 4.01（微小改进）：1999 年 12 月 24 日，W3C 推荐标准；
* HTML 5：HTML5 是公认的下一代 Web 语言，极大地提升了 Web 在富媒体、富内容和富应用等方面的能力，被喻为终将改变移动互联网的重要推手。Internet Explorer 8 及以前的版本不支持。

### 指南与教程

[MDN HTML（超文本标记语言）](https://developer.mozilla.org/zh-CN/docs/Web/HTML)

[w3school HTML 教程](https://www.w3school.com.cn/h.asp)