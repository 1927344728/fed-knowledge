## DOCTYPE：文档类型与浏览器模式

### 文档类型定义（DTD）

**DTD**（document type definition，文档类型定义）是一系列的语法规则， 用来定义XML或(X)HTML的文件类型（允许元
素及它们的属性和层次关系的定义）。浏览器会使用它来判断文档类型， 决定使用何种协议来解析，以及切换浏览器模式。

事实上 DTD 可以定义所有 SGML 语族的文档类型，但由于太过繁琐， XML/HTMl反而更加流行。

### 什么是SGML?

SGML 是**标准通用标记语言**（Standard Generalized Markup Language），是国际上定义电子文件结构和内容描述的标准。它并非一门具体的标记语言，而是一门“元语言”(Metalanguage)，即一门可以用来**定义**其他标记语言的语言。

**SGML 的三个组成部分：**

- **SGML声明（SGML Declaration）**：指定构建文档的基本参数。
- **文档类型定义（DTD）**：这是SGML的核心。DTD定义了一门新语言的合法“语法”，用一系列规则明确规定了文档中可以有哪些元素、如何嵌套，以及哪些属性是必要的-。
- **文档实例（Document Instance）**：实际撰写的、包含数据和标记的文档文件。

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

### 参考资料

[DOCTYPE的作用：文档类型与浏览器模式](https://harttle.land/2016/01/22/doctype.html)

[DOCTYPE的作用与常见用法](https://www.jianshu.com/p/fe5bd4f7b163)

[DOCTYPE作用及用法详解](https://www.jianshu.com/p/c3dcdad42e6d)

[MDN 怪异模式和标准模式](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)

[SGML、HTML、XML、XHTML、HTML5](https://www.cnblogs.com/huanqna/p/8178057.html)