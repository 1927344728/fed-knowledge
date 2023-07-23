## DOCTYPE：文档类型与浏览器模式

### 文档类型定义（DTD）

**DTD**（document type definition，文档类型定义）是一系列的语法规则， 用来定义XML或(X)HTML的文件类型（允许元
素及它们的属性和层次关系的定义）。浏览器会使用它来判断文档类型， 决定使用何种协议来解析，以及切换浏览器模式。

事实上 DTD 可以定义所有 SGML 语族的文档类型，但由于太过繁琐， XML/HTMl反而更加流行。



### 什么是SGML?

SGML 是标准通用标记语言 (Standard Generalized Markup Language) 的简称。 SGML 是一个指定文档标记语言或标记集的标准。这样的规范本身就是文档类型定义（DTD）。SGML 本身不是文档语言，而是如何指定文档语言的描述。它是元数据。

SGML是国际上定义电子文件结构和内容描述的标准。SGML具有非常复杂的文档结构，主要用于大量高度结构化数据的访问和其他各种工业领域，在分类和索引数据中非常有用。但是它不适用于Web数据描述。

SGML 基于 IBM 开发的早期通用标记语言，包括通用标记语言（GML）和ISIL。

SGML 优点有：高稳定性、高可携性、高完整性。它的缺点有：高复杂性、费用昂贵。它的缺点也正是因为它的稳定性和完整性催生出了高度复杂的特性，其相对衍生出来的就是高费用性的巨大缺陷。

换句话说，一个人想要接手或者使用它，必须先制定它的 DTD（文件格式定义），这个DTD的制定是相当复杂和昂贵的，可以简单的想象一下，每次写一个全新 DTD 标准的 SGML 文件都需要为此开发一个解析工具（浏览器）的代价。

HTML 是继承自标准通用标记语言（SGML）。他继承了 SGML 的很多优点，但他只使用了 SGML 中很少的一部分标记，为了便于在计算机上实现，HTML 规定的标记是固定的，即 HTML 语法是不可扩展的。

XML 也是继承自标准通用标记语言（SGML）。他使用一种简单而又灵活的标准格式，为基于 Web 的应用提供了一个描述数据和交换数据的有效手段。他与 HTML 最大的区别就在于他的标签是可扩展的。



### DOCTYPE的作用

DOCTYPE 是 Document Type (文档类型的）的简写，是用来声明文档类型和 DTD 规范的，主要用于**文件的合法性验证**和**浏览器解析文档**。 

在HTML代码中，<!DOCTYPE>声明严格意义上，它不是一个HTML标签，只是一个用于告诉浏览器当前代码用的 XHTML 或者 HTML 是哪一种规范的声明指令。

**`<!DOCTYPE>` 声明决定浏览器以标准模式还是怪异模式来解析文档。**

在制作网页的时候，必须告诉浏览器你所写的HTML代码使用了哪一种规范，才可以正确的显示网页。如果没有说明自己HTML代码所采用的何种规范，浏览器将以**怪异模式**解析网页代码，这样就可能无法正常的将网页显示在浏览器上，不同的浏览器怪异模式差别不同（浏览器可能会使用内置的默认DTD），所显示出网页也不同。

#### DOCTYPE 组成部分

```html
<!DOCTYPE 根元素 可用性 "注册//组织//类型 标签 定义//语言" "URL">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

* **根元素：**指定 DTD 中声明的顶级元素类型，这与声明的 SGML 文档类型相对应，默认HTML 。
* **可用性：**指定正式公开标识符(FPI)是可公开访问的对象还是系统资源。 默认 PUBLIC 可公开访问的对象。 SYSTEM 系统资源，如本地文件或 URL。
* **注册：**指定组织是否由国际标准化组织(ISO)注册。默认 + ，组织名称已注册。 - 组织名称未注册，Internet 工程任务组(IETF)和万维网协会(W3C)并非注册的 ISO 组织。
* **组织：**指定表明负责由 !DOCTYPE 声明引用的 DTD 的创建和维护的团体或组织的名称，即 OwnderID。 IETF 或 W3C。
* **类型：**指定公开文本类，即所引用的对象类型。默认 DTD。
* **标签：**指定公开文本描述，即对所引用的公开文本的唯一描述性名称，后面可附带版本号。默认 HTML 。
* **定义：**指定文档类型定义。Strict（排除所有 W3C 专家希望逐步淘汰的代表性属性和元素）、Transitional（包含除 frameSet 元素的全部内容）、 Frameset（框架集文档）。
* **语言：**指定公开文本语言，即用于创建所引用对象的自然语言编码系统。该语言定义已编写为 ISO 639 语言代码(大写两个字母)。 默认 EN。
* **URL**：指定所引用对象的位置。

#### DOCTYPE 的用法

- DOCTYPE 标签处于 html 标签之前

- DOCTYPE 标签必须放在每一个XHTML文档最顶部，在所有代码和标识之上

- DOCTYPE 标签没有结束标签

- DOCTYPE 标签对大小写不敏感

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        hello world
    </body>
</html>
```

#### 常用的 DOCTYPE 声明

HTML 中 <!DOCTYPE> 常见声明类型共有8种，分别是 html5 有1种，HTML 4.01 和 XHTML 1.0 都有3种，XHTML 1.1 有1种，它们的写法如下：

**1. HTML5 <!DOCTYPE>声明**

HTML 5 规定了一种 <!DOCTYPE> 声明，它能向前向后兼容，代码也更加简洁（HTML5 不是基于 SGML，因此不要求引用 DTD。），推荐使用。

```html
<!DOCTYPE html>
```

**2. HTML4.01 <!DOCTYPE>声明**

HTML 4.01规定了三种不同的 <!DOCTYPE> 声明，分别是：

* **Strict：**包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
* **Transitional：**包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
* **Frameset：**等同于 HTML 4.01 Transitional，但允许框架集内容。

```html
<!--HTML 4.01 Strict-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!--HTML 4.01 Transitional-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!--HTML 4.01 Frameset-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

**3. XHTML1.0 <!DOCTYPE>声明**

XHTML 1.0 也规定了三种不同的 <!DOCTYPE> 声明，分别是：

* **Strict：**包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。
* **Transitional：**包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。
* **Frameset：**等同于 XHTML 1.0 Transitional，但允许框架集内容。

```html
<!--XHTML 1.0 Strict-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!--XHTML 1.0 Transitional-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--XHTML 1.0 Frameset-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

**4. XHTML 1.1<!DOCTYPE>声明**

XHTML 1.1规定了一种声明， 等同于 XHTML 1.0 Strict，但允许添加模型。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

**5. 其他<!DOCTYPE>声明**

```html
<!-- HTML 4.0 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!-- HTML 4.0 Frameset -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">

<!-- HTML 4.0 Transitional -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML 3.2 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">

<!-- HTML 2.0 -->
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">

<!-- XHTML Basic 1.0 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">

<!-- XHTML Basic 1.0 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">

<!-- XHTML 2.0 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 2.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml2.dtd">
```

  

### 怪异模式和标准模式

在很久以前的网络上，页面通常有两种版本：为网景（Netscape）的 Navigator 准备的版本，以及为微软（Microsoft）的 Internet Explorer 准备的版本。当 W3C 创立网络标准后，为了不破坏当时既有的网站，浏览器不能直接弃用这些标准。因此，浏览器采用了两种模式，用以把能符合新规范的网站和老旧网站区分开。

目前浏览器的排版引擎使用三种模式：怪异模式（Quirks mode）、接近标准模式（Almost standards mode）、以及标准模式（Standards mode）。在**怪异模式**下，排版会模拟 Navigator 4 与 Internet Explorer 5 的非标准行为。为了支持在网络标准被广泛采用前，就已经建好的网站，这么做是必要的。在**标准模式**下，行为即（但愿如此）由 HTML 与 CSS 的规范描述的行为。在**接近标准模式**下，只有少数的怪异行为被实现。

#### 浏览器如何决定使用哪个模式？

对 HTML 文件来说，浏览器使用文件开头的 DOCTYPE 来决定用怪异模式处理或标准模式处理。

以下情况浏览器会采用标准模式渲染：

- 给出了完整的 DOCTYPE 声明
- DOCTYPE 声明了 Strict DTD
- DOCTYPE 声明了 Transitional DTD 和 URI

以下情况浏览器会采用混杂模式渲染：

- DOCTYPE 声明了 Transitional DTD 但未给出 URI
- DOCTYPE 声明不合法
- 未给出 DOCTYPE 声明

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset=UTF-8>
        <title>Hello World!</title>
    </head>
    <body>
    </body>
</html>
```

`<!DOCTYPE html>`，是所有可用的 DOCTYPE 之中最简单的，也是 HTML5 所推荐的。HTML 的早期变种也属于推荐标准，不过，当今的浏览器都会对这个 DOCTYPE 使用标准模式，就算是早已过时的 Internet Explorer 6 也一样。目前，并没有正当的理由，去使用其他更复杂的 DOCTYPE。如果你使用其他的 DOCTYPE，你可能会面临触发接近标准模式或者怪异模式的风险。

在 HTML5 中，DOCTYPE 唯一的作用是启用标准模式。更早期的 HTML 标准中，DOCTYPE 会附加其他意义，但**没有任何浏览器会将 DOCTYPE 用于怪异模式和标准模式之间互换以外的用途。**

#### 怪异模式和标准模式的语句解析不同点有哪些？

* **盒模型的处理差异**

  标准 CSS 盒模型的宽度和高度等于内容区的高度和宽度，不包含内边距和边框，而 IE6 之前的浏览器实现的盒模型的宽高计算方式是包含内边距和边框的。因此，对于IE5.5 及以下的浏览器及其他版本的怪异模式和标准模式下的盒模型宽高计算方式是不一样的；

* **行内元素的垂直对齐**

  很多早期的浏览器对齐图片至包含它们的盒子的下边框，虽然 CSS 的规范要求它们被对齐至盒内文本的基线。标准模式下，基于Gecko 的浏览器将会对齐至基线，而在 quirks 模式下它们会对齐至底部。最直接的例子就是图片的显示。在标准模式下，图片并不是与父元素的下边框对齐的，如果仔细观察，你会发现图片与父元素下边框之间存在一点小空隙。那是因为标准模式下，图片是基线对齐的。而怪异模式下，则不存在这个问题。

* **获取视口尺寸**

  ```js
  // 标准模式下，任意浏览器都兼容：
  document.documentElement.clientWidth
  document.documentElement.clientHeight
  
  // 怪异模式下的浏览器：
  document.body.clientWidth
  document.body.clientHeight
  ```

* 可以设置行内元素的高宽

  在Standards模式下，给span等行内元素设置wdith和height都不会生效，而在quirks模式下，则会生效。

* 可设置百分比的高度

  在 standards 模式下，一个元素的高度是由其包含的内容来决定的，如果父元素没有设置高度，子元素设置一个百分比的高度是无效的。

* 用 `margin: 0 auto` 设置水平居中在 IE下会失效

  使用 `margin: 0 auto` 在 standards 模式下可以使元素水平居中，但在 quirks 模式下却会失效，quirk 模式下的解决办法，用text-align 属性。

* quirk 模式下设置图片的 padding 会失效

* quirk 模式下 Table 中的字体属性不能继承上层的设置

* quirk模式下 `white-space: pre` 会失效

### 相关问题

##### 为什么HTML5 只需要写简短的一句？

HTML4.01 之前是基于 SGML 来定义的一门语言，所以要加上 DTD 的引用。

HTML 5 不基于 SGML，因此不需要对 DTD 进行引用，但是需要 Doctype 来规范浏览器的行为，让浏览器按照它们应该的方式来运行。

##### 如何查看目前是哪个模式？

* js 判断是哪种模式。

  ```js
  document.compatMode
  // BackCompat：怪异模式
  // CSS1Compat: 标准模式或者接近标准模式
  ```

* 在 Firefox 中，请从右键菜单选择 查看页面信息，然后查看 渲染模式。

* 在 Internet Explorer 中，请按下 F12，然后查看 文档模式。

##### SGML 、 HTML 、XML、XHTML 和 HTML 5 的区别？

![image-20201106014817231](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20201106014817231.png)

* GML 是第一代标记语言，使文档能明确将标示和内容分开，所以文件使用同样的标示方法。

* SGML 在 GML 的基础上进行整理，形成了一套非常严谨的文件描述方法。它的组成包括语法定义，DTD，文件实例三部分。SGML 因太严谨规范达500多页，故而不易学、不易用、难以实现，所以在它的基础上又发展出了其他的更易用的置标语言。

* HTML，超文本标记语言，是人们抽取了 SGML 的一个微小子集而提取出来的。HTML 规定的标记是固定的，即 HTML 语法是不可扩展的。其早期规范比较松散，但比较易学。

* XML，可扩展标记语言，也是 SGML 的一个子集，但使用比较严格的模式。XML 和 HTML 的最大区别就在于 XML 的标签是可扩展的，而 HTML 的标签都是固定的而且数量有限。

* XHTML，可扩展超文本标记语言。因为HTML扩充性不好，内容的表现跟不上时代的变化（如无法表示某些化学符号等），以及因为性能的问题，官方逐渐趋于严格的模式，所以使用 XML 的严格规则的 XHTML 成了 W3C 计划中 HTML 的替代者。

  XHTML 就是以 XML 的语法形式来写 HTML，它和 HTML 没什么本质的区别，就是比 HTML 更严谨而且语义化更强。比如：

  * 文件结构：XHTML DOCTYPE是强制性的、html 标签中的 XML namespace 属性是强制性的、`html、head、title、body 标签也是强制性的。

  * 元素语法：XHTML 元素必须正确嵌套、XHTML元素必须始终关闭、XHTML元素必须小写、XHTML文件必须有一个根元素。

  * 属性语法：XHTML属性必须使用小写、XHTML属性值必须用引号包围、XHTML属性最小化也是禁止的

* HTML 5 是最新的HTML标准，它被设计用来替代HTML/XHTML。

  HTML 经过一系列修订，到现在说的 HTML 一般指 HTML 4.01；而现在的 HTML 5 则是 HTML 的第五个修订版，其主要的目标是将互联网语义化，以便更好地被人类和机器阅读，并同时提供更好地支持各种媒体的嵌入。而HTML5本身并非技术，而是标准。它所使用的技术早已很成熟，国内通常所说的html5实际上是html与css3及JavaScript和api等的一个组合，大概可以用以下公式说明：HTML5≈HTML+CSS3+JavaScript+API。

  * 专门为承载丰富的 web 内容而设计的，无需额外外挂。
  * 拥有新的语义、图形以及多媒体元素。
  * 提供的新元素和新的 API 简化了 web 应用程式的搭建。
  * 是跨平台的，被设计为在不同型别的硬体（PC、平板、手机、电视机等等）之上执行。

**XHTML 是 HTML 过渡到 XML 的中间产物，最后觉得 HTML5 更好用，就用 HTML5了。**



### 参考资料

[DOCTYPE的作用：文档类型与浏览器模式](https://harttle.land/2016/01/22/doctype.html)

[DOCTYPE的作用与常见用法](https://www.jianshu.com/p/fe5bd4f7b163)

[DOCTYPE作用及用法详解](https://www.jianshu.com/p/c3dcdad42e6d)

[MDN 怪异模式和标准模式](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)

[SGML、HTML、XML、XHTML、HTML5](https://www.cnblogs.com/huanqna/p/8178057.html)