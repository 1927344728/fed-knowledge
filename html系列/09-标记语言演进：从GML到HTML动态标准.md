## 标记语言演进：从 GML 到 HTML 动态标准

**标记语言（Markup Language）** 是一种用于在文本中嵌入**标记**（markup）的系统化方法，这些标记不仅提供文档的**结构信息**（如章节、段落、列表），还能描述**样式**或**语义**，使得文档可以被计算机程序解析、处理或呈现。

**标记语言两大组成：**

- **文本内容**（即文档中实际要呈现或传达的信息）。
- **标记**（以特定语法嵌入文本中的代码，用于指示内容的角色、结构或处理方式）。

**标记语言 vs 编程语言 vs 样式表语言：**

- **标记语言**（HTML、XML）：描述内容“是什么”和“如何组织”。
- **编程语言**（JavaScript、Python）：描述“做什么”（算法、逻辑、计算）。
- **样式表语言**（CSS）：描述“看起来什么样”（颜色、布局、字体）。

GML 是标记语言的源头，SGML 是在其基础上形成的国际标准，而 HTML 和 XML 则是 SGML 的两个重要应用分支。XHTML 是 HTML 与 XML 结合的产物，而当前的 HTML（无版本号的动态标准）则是 Web 标记语言的最终统一形态。

**常见标记语言速览：**

| 名称         | 用途             | 标记是否固定            | 特点                         |
| :----------- | :--------------- | :---------------------- | :--------------------------- |
| **HTML**     | 网页结构展示     | 固定                    | 语法宽松，浏览器容错性强     |
| **XML**      | 数据存储与交换   | 可扩展                  | 语法严格，标签可无限扩展     |
| **Markdown** | 轻量级文档格式化 | 极简固定                | 易读易写                     |
| **LaTeX**    | 学术排版         | 可扩展                  | 强大数学支持，生成高质量 PDF |
| **SGML**     | 定义其它标记语言 | 元语言                  | 复杂，现代 HTML/XML 的祖先   |
| **XHTML**    | 严格版 HTML      | 固定（但遵循 XML 语法） | 规则严格，已边缘化           |

**标记语言演进：**

```shell
GML（1969年，IBM）
 │
 └── SGML（1986年成为 ISO 国际标准）
      │
      ├── HTML 4.01（SGML的一个应用，用于网页显示）
      │    │
      │    └── XHTML 1.0（2000年，XML语法重新包装的HTML）
      │          │
      │          └── 2018年被W3C标记为"已取代"
      │
      ├── XML 1.0（SGML的简化子集，用于数据交换）
      │
      └── HTML Living Standard（现行唯一标准）
            │
            └── W3C HTML5（2014年快照，已不再作为独立规范）
```

### GML（通用标记语言）

**诞生时间**：1969年

**创造者**：IBM 的 Charles Goldfarb、Edward Mosher 和 Raymond Lorie（语言名称 GML 也是三位创造者姓氏首字母的巧合组合）。

**基本定位**：为**解决不同文档系统之间的数据交换**问题而设计的结构化文档描述语言。

**核心思想**：将文档按照逻辑结构（章节、段落、列表等）进行标记，而非关注排版样式。

**历史地位**：GML 是标准通用标记语言（SGML）的直接先驱和基础。

GML 是**通用标记语言**（Generalized Markup Language），诞生于 1969 年，由 IBM 发明，标志着文档处理从**特定的排版指令**迈向了**结构化、描述性的标记**。它的出现，为之后深刻改变了信息世界的 SGML（标准通用标记语言）、HTML 和 XML 等语言奠定了基础。

GML 通过定义文档类型和嵌套元素结构，为文档构建了清晰的结构。它的标记语法非常简洁，使用冒号（`:`）和句点（`.`）来定义元素和结束标记：

```xml
:doc.
:title. 标记语言演进
:author. Lizhao
:date. 2026年5月18日

:chapt. GML
:p. GML（通用标记语言，Generalized Markup Language）诞生于 <:bold.1969:ebold. 年，由 IBM 发明。
:list.
    :item. 创造者
    :item. 基本定位
    :item. 核心思想
:elist.
:edoc.
```

### SGML（标准通用标记语言）

**标准编号**：ISO 8879:1986，于 1986 年 10 月 23 日正式发布。

**基本定位**：SGML 是一种 **元语言**（meta-language），即用于定义其他标记语言的语言。它本身不是一种文档语言，而是一套如何定义标记语言的规范。

**文档结构**：SGML 由三个核心部分组成——语法定义、文档类型定义（DTD）和文档实例。

**主要优点**：高稳定性、高可携性（可移植性）、高完整性。

**主要缺点**：结构极其复杂（规范文档长达 500 多页），学习和使用成本高昂，不适用于 Web 数据传输场景。

SGML 是**标准通用标记语言**（Standard Generalized Markup Language），是国际上定义电子文件结构和内容描述的标准。它并非一门具体的标记语言，而是一门“元语言”(Metalanguage)，即一门可以用来**定义**其他标记语言的语言。

**SGML 的优点：**

- **高度通用与可扩展**：SGML允许为任何领域创建完美的标记语言，不受固定标签集限制-。
- **严谨与结构化**：要求文档必须遵循其DTD定义的严格结构，确保了文档的规范性和机器可读性。
- **平台独立**：SGML文档独立于任何特定软件，确保了数据在不同系统间的长期可访问性。

**SGML 的缺点：**

- **极高的复杂性**：规范文档长达数百页，学习曲线非常陡峭。
- **高昂的实现成本**：开发全面支持 SGML 的解析器代价高昂。
- **严格的合规要求**：SGML文档必须严格依据DTD，这种“零容忍”的设计哲学，与追求高效、灵活推广的 Web 精神有所冲突。

**SGML 的三个组成部分：**

- **SGML声明（SGML Declaration）**：指定构建文档的基本参数。
- **文档类型定义（DTD）**：这是SGML的核心。DTD定义了一门新语言的合法“语法”，用一系列规则明确规定了文档中可以有哪些元素、如何嵌套，以及哪些属性是必要的-。
- **文档实例（Document Instance）**：实际撰写的、包含数据和标记的文档文件。

#### SGML 声明（SGML Declaration）

SGML 声明为整个文档**设定解析环境的基本参数**。它不定义具体的元素标签，而是规定了一些全局性的处理规则。

- **字符集**：文档使用什么字符集（ASCII、EBCDIC 等）。
- **定界符**：标记的起始符号（默认 `<`）、结束符号（默认 `>`）、注释符号（默认 `--`）等。
- **命名规则**：标签名称的最大长度、是否区分大小写。
- **容量限制**：例如一个元素最多可以有多少个属性、属性值最长多少字符。

```shell
<!SGML "ISO 8879:1986"

  CHARSET
    BASESET  "ISO 646-1983//CHARSET International Reference Version (IRV)//ESC 2/5 4/0"
    DESCSET  32 95 0

  CAPACITY
    SGMLREF
      TOTALCAP  150000

  SYNTAX
    SHUNCHAR 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 127
    DELIM    SGMLREF
    NAMING   SGMLREF

  SGMLREF
>
```

#### 文档类型定义（DTD）

文档类型定义（DTD，Document Type Definition），是为一类文档定义**合法的元素、属性、嵌套关系**。

**文档类型定义规定：**

- 哪些元素可以出现。比如：title、p、div 等元素。
- 元素之间如何嵌套。比如：body 元素下必须有 title 元素，不能有 section 元素。
- 元素可以带哪些属性。比如：img 元素，可以有 src、alt 属性。
- 属性值的类型。比如：文本、唯一标识符 ID，或者多个选项中的一个。

```xml
<!-- 声明新闻文章元素 -->
<!ELEMENT article   (headline, byline?, dateline?, body) >

<!-- 声明文章内的其他元素 -->
<!ELEMENT headline  (#PCDATA) >
<!ELEMENT byline    (#PCDATA) >
<!ELEMENT dateline  (#PCDATA) >
<!ELEMENT body      (paragraph+ | section+) >

<!-- paragraph 可以包含文本、强调、引用 -->
<!ELEMENT paragraph (#PCDATA | emph | quote)* >
<!ELEMENT emph      (#PCDATA) >
<!ELEMENT quote     (#PCDATA) >

<!-- 属性定义示例：新闻文章的 id 和 version -->
<!ATTLIST article
          id        ID       #REQUIRED
          version   CDATA    "1.0" >
```

**注意：**采用该 DTD 的文档实例都必须严格遵循这些规则，否则解析器会报错。

#### 文档实例（Document Instance）

文档实例是实际包含**真实数据和标记的文档文件**，是用户最终编写的、也是最终被解析使用的文件。文档实例中必须引用一个 DTD（在 <!DOCTYPE> 声明中），然后按照 DTD 中定义的规则来写标签和内容。

```xml
<!DOCTYPE article SYSTEM "article.dtd">
<article id="a123" version="1.0">
    <headline>标准通用标记语言</headline>
    <byline>作者 Lizhao</byline>
    <dateline>2026年5月18日</dateline>
    <body>
        <paragraph>**标记语言（Markup Language）** 是一种用于在文本中嵌入**标记**（markup）的系统化方法，这些标记不仅提供文档的**结构信息**（如章节、段落、列表），还能描述**样式**或**语义**，使得文档可以被计算机程序解析、处理或呈现。</paragraph>
    </body>
</article>
```

### HTML（超文本标记语言）

**诞生背景**：Tim Berners-Lee（蒂姆·伯纳斯-李）于 1990 年代初在 CERN 研发万维网时，基于 SGML 的一个简化子集设计了 HTML。

**基本定位**：HTML 是 SGML 的一个 **应用**（application），而非 SGML 本身。

**核心特征**：HTML 的标记集合是**固定的、不可扩展**的。它只使用了 SGML 中很少一部分标记，便于在计算机上实现。

**用途**：**着重于文档在浏览器中的显示与呈现**，是一种标记语言，而非编程语言。

HTML 是超文本标记语言（HyperText Markup Language），是一种**标记语言**，着重如何描述将文件显示在浏览器中。HTML 的标记是固定的，即 HTML 语法是不可扩展的。

**HTML的核心特征：**

- **标记固定不可扩展**：标签都是预定义的。
- **语法宽松**：标签可以不闭合、属性可以不加引号、大小写不敏感。
- **本质是标记语言**，不是编程语言。

#### **HTML 的发展历程**

HTML 是万维网（WWW）最核心的语言，是在近三十年的时间里，由一群人为了一个更开放、更强大的网络而不断演进的成果。

- **灵感诞生（1990年）**：Tim Berners-Lee 在 CERN（欧洲核子研究组织）工作期间，为了科学家们能更方便地共享和浏览文档，提出了**超文本**的概念，并基于 SGML 发明了 HTML 的雏形。HTML 在最初被设计为一种语义描述科学文档的语言，它作为一种“**标记语言**”，允许作者为文档的各个部分（如标题、段落、列表等）添加“标签”，来告诉浏览器这些内容的含义和结构。
- **HTML 1.0 （1993）**：**草案**。非正式标准，IETF 工作草案。
- **HTML 2.0（1995年）**：**互联网工程任务组（IETF）** 从 1993 年开始正式制定 HTML 规范，并于1995年发布了第一个官方版本，也就是 **HTML 2.0**。
- **W3C（1994 年）**：Tim Berners-Lee 在 1994 年亲自创立了**万维网联盟（W3C）**，旨在引领 Web 技术的发展。1996年，W3C 正式从 IETF 手中接管了 HTML 的标准化工作-。
- **HTML 3.2 (1997年)**：首个由 W3C 发布的推荐标准，整合了当时浏览器的各种特性，最为突出的是引入了 table 标签。
- **HTML 4.0 (1997年)** 和 **HTML 4.01 (1999年)**：这两个版本意义重大，它们强调将**结构（HTML）与表现（CSS）分离开来**，使网页的样式控制更加灵活和高效。
- **XHTML**：在 HTML 4.01 之后，W3C 认为 HTML 的语法不够严谨，希望走向更严格的 **XHTML**（基于 XML 的 HTML）。但浏览器厂商觉得这偏离了实际需求。于是在 **2004年**，苹果、Mozilla 和 Opera 等公司成立了 **WHATWG（网页超文本应用技术工作小组，Web Hypertext Application Technology Working Group）**，继续沿着“动态标准”的方向推进 HTML，这也直接催生了后来的 HTML5。

- **HTML5（2004-2019）**：WHATWG 的工作成果最终被 W3C 认可，双方共同推进了 **HTML5** 的开发。2008年，第一份草案发布；2014年，HTML5 的正式推荐标准问世。HTML5 解决了 HTML4 的诸多问题：**缺乏语义标签、多媒体支持差、移动端不友好**等。
- **HTML 动态标准（2019年）**：历经了长达数年的并行与分歧之后，两大组织终于在 2019 年达成合作协议。W3C 正式决定放弃对 HTML 的独立维护，将 **WHATWG 维护的“HTML Living Standard”（HTML 动态标准）确立为 HTML 的唯一标准**。此后，**HTML 不再有版本号**，而是作为一项持续更新、不断完善的标准。

#### HTML 的下一代特性

HTML 作为“动态标准”持续演进，不再有 “HTML6” 这种大版本号。

开发者正在热烈讨论一些未来的新提案：

- **更强大的Web组件**：让开发者能更便捷地创建和复用自定义UI元素。
- **与 AI 的深度融合**：通过标准属性为 AI 模型提供更明确的语义指引，辅助 AI 生成更精准的界面。
- **HTML-in-Canvas**：一种新的渲染范式，将网页像游戏画面一样进行高效、复杂的渲染。
- **性能和体验提升**：包括更高效的移动端应用架构、更流畅的多媒体操作以及对增强现实等新交互形式的底层支持-。

#### 代码示例

HTML 是一种**标记语言**，由一系列具有特定含义的元素组成，通过尖括号包裹的标签来向浏览器描述不同的内容：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>这是一个网页</title>
</head>
<body>
    <header>
        <h1>欢迎来到我的博客</h1>
        <nav>...</nav>
    </header>
    <main>
        <article>
            <h2>文章的标题</h2>
            <p>这里是文章的正文内容，非常有趣。</p>
            <img src="logo.jpg" alt="网站Logo" width="100">
            <a href="https://www.example.com">访问示例网站</a>
        </article>
    </main>
    <footer>
        <p>© 2026 我的博客</p>
    </footer>
</body>
</html>
```

### XML（可扩展标记语言）

**标准状态**：XML 1.0 于 1998年2月10日成为 W3C 推荐标准，并于 2000 年 10 月 6 日发布了第二版。

**基本定位**：XML 是 SGML 的一个 **简化子集**（subset），但保留了 SGML 的核心**扩展能力**。

**核心特征**：与 HTML 相比，XML 的**标签是可扩展的**——用户可以根据需要自定义标签。

**用途**：**着重于数据的结构化表示和跨平台数据交换**。XML 使用一套简单而灵活的标准格式，为 Web 应用提供了描述数据和交换数据的有效手段

XML 是可扩展标记语言（Extensible Markup Language），是 SGML 的一个子集。它是一种用于存储和传输数据的标记语言，它以纯文本格式，通过可自定义的标签来描述信息，实现了数据的“自我描述”。

SGML 功能极其强大，但过于复杂，难以在Web上普及。由是 XML 作为其**简化子集**被设计出来。它保留了 SGML 的核心力量，同时抛弃了那些复杂、不常用的特性。

**xml 的核心语法规则：**

- **一个根元素**：所有元素必须被一个单一的根元素包裹。
- **严格闭合**：每个开始标签都必须有一个对应的结束标签，且**对大小写敏感**。
- **正确嵌套**：标签的嵌套顺序必须正确，绝不能交叉。
- **属性加引号**：所有属性值必须使用引号（单引号或双引号）括起来。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<article>
  <header id="article01">
    <author>Lizhao</author>
    <title lang="en">标记语言演进</title>
    <time>2026年5月18日</time>
  </header>
</article>
```

### XHTML（可扩展超文本标记语言）

- **标准状态**：XHTML 1.0 于 2000 年 1 月 26 日成为 W3C 推荐标准。该版本于 2018 年 3 月 27 日被标记为 **Superseded Recommendation**（已被取代的推荐标准），W3C 建议新项目采用最新版本的 HTML 规范
- **基本定位**：XHTML 是将 HTML 4 以 XML 1.0 的形式进行重新表达（reformulation of HTML 4 as an XML 1.0 application）
- **核心特征**：XHTML 使用 XML 的严格语法规则来书写 HTML，在语法上比传统 HTML 更为严格
- **与 HTML/XML 的关系**：传统 HTML 是一种基于 SGML 的应用，而 XHTML 则基于 XML。XHTML 可视为 **HTML 向 XML 过渡** 的产物

XHTML 是可扩展超文本标记语言（Extensible HyperText Markup Language）

**XHTML 的发展历程：**

- **XHTML 1.0（2000年1月26日）**：在遵循 XML 语法的同时，**尽可能地保持与现有 HTML 4.01 浏览器的兼容性**。它包含了三种 DTD（文档类型定义）：
  - **Strict（严格型）**：最纯净的版本，强制使用 CSS 进行样式定义，将结构与表现彻底分离。
  - **Transitional（过渡型）**：在遵循新语法的同时，允许使用部分已被弃用的表现性标签（如：font）。
  - **Frameset（框架型）**：用于支持使用 frameset 标签的网页。
- **XHTML 1.1（2001年5月31日）**：不再向后兼容 HTML，舍弃了几乎所有过时的特性。XHTML1.1 是最后一个独立的标准。
- **XHTML 2.0（止步于草案）**：旨在创建一个理想的、基于 XML 的文档语言。因脱离实际开发需求，未能获得浏览器厂商支持而最终被取消。
- **XHTML5（HTML5 的一部分）**：随着 **HTML5 动态标准** 的崛起，WHATWG 与 W3C 将 “XHTML” 的概念和优势吸收进了 HTML5，形成标准中的 **"XML 语法"**。

**XHTML 的核心语法规则：**

- **文档声明与命名空间**：每个 XHTML 文档必须以 DOCTYPE 开头，根元素 html 必须使用 `xmlns` 属性指定命名空间。
- **元素必须小写**：标签名必须统一使用小写字母。
- **属性必须小写且加引号**：属性名必须小写，所有属性值必须使用双引号（`"`）或单引号（`'`）括起来。
- **所有元素必须闭合**：非空元素必须有结束标签；空元素（如 br、img）也必须以 "/" 结尾。
- **属性必须完整赋值**：所有属性必须有属性值，如：`checked="checked"`。
- **标签嵌套必须正确**：标签必须严格遵循先开标签后闭标签的顺序，不能交叉。

**注意**：XHTML 1.0 已于 2018 年被 W3C 正式标记为“已取代的推荐标准”，W3C 明确建议新项目采用最新版本的 HTML 规范。

**一句话说：XHTML 作为 HTML 向 XML 过渡的中间产物，随着 HTML5 及 HTML Living Standard 的成熟，已逐步退出历史舞台。**

### HTML5（W3C 2014）

**诞生背景**：HTML5 诞生于 Web 标准方向的激烈分歧之中。2004 年，苹果、Mozilla 和 Opera 对 W3C 放弃 HTML、全力推进 XHTML 的技术路线表示异议，联合成立了 WHATWG（网页超文本应用技术工作小组，Web Hypertext Application Technology Working Group），开始研发一套向后兼容、不基于 XML 且能支持现代 Web 应用的新标准，其成果 Web Applications 1.0 即为 HTML5 的前身。2006 年 W3C 转向与 WHATWG 合作，2008 年发布第一份工作草案，**2014年10月28日正式成为 W3C 推荐标准**。

**基本定位**：HTML5 是 HTML 标准的第五次重大修订，但意义远超版本号本身。它不是一门新语言，而是在继承 HTML 核心语法的基础上进行的**功能性扩展**，将浏览器从一个单纯的文档展示器转变为强大的应用开发平台。

**核心特征**：**原生能力的大幅增强**，新增了大量语义化标签（header、nav、article、section等），原生支持多媒体元素（audio、video）和图形绘制（canvas、SVG），同时提供了丰富的 JavaScript API（地理位置、本地存储、Web Workers、离线应用等），并改进了表单控件类型与内置校验机制。

**用途**：**着重于构建跨平台的 Web 应用**。

HTML5 是 HTML 标准的第五次重大修订，它并非 HTML 的最新版本。**HTML 目前已没有版本号**，取而代之的是 WHATWG 维护的 HTML Living Standard（HTML 动态标准）。

2019 年之前 W3C 发布的 HTML5 系列标准（含版本号）已被终结，其标准已被整合进 WHATWG 维护的 HTML Living Standard。W3C 明确宣布 WHATWG 动态标准为 HTML 的唯一标准版本。

**HTML5 这个术语在今天的语义已经发生了变化，不再 HTML 5.0 版本号，而是指代一组现代 Web 技术的集合——包括 HTML 动态标准，以及增强存储、多媒体和硬件访问的 JavaScript API。**

#### HTML5 的核心特性

**（更语义化的结构、更强大的功能、以及更出色的用户体验）：**

* **语义化标签**：header、nav、main、article、section、aside、footer。
* **原生多媒体支持**：提供了 video、audio 标签。
* **图形与动画能力**：提供了 canvas 标签、支持 SVG。
* **丰富的应用 API**：地理位置、本地存储、Web Workers、拖放操作。
* **其他重要改进**：新的表单类型（email、url、number、date 等 input 类型）、离线应用、响应式设计（CSS3 的 `@media` 查询）。

#### HTML5 的重要 API 

- **Geolocation**：获取用户地理位置。
- **Web Storage**：客户端存储（localStorage / sessionStorage）。
- **IndexedDB**：浏览器端 NoSQL 数据库。
- **Web Workers**：后台多线程执行 JavaScript。
- **WebSocket**：全双工实时通信。
- **History API**：无刷新修改浏览器 URL 和历史记录。
- **Drag and Drop**：原生拖放操作。
- **Canvas API**：动态 2D/3D 绘图。
- **WebRTC**：浏览器端实时音视频通信。
- **Notification API**：桌面推送通知。

**一句话总结：HTML5（术语） ≈ HTML Living Standard + CSS3 + JavaScript API。**

### HTML Living Standard（动态标准）

- **标准现状**：自 2019 年 5 月 28 日起，W3C 正式宣布 WHATWG 维护的 **HTML 动态标准**（HTML Living Standard）为 HTML 的唯一标准版本，标志着 HTML 从此进入“**无版本号、持续演进**”的新时代。
- **与 HTML5 的关系**：W3C 发布的带有版本号的 HTML5（包括 5.0、5.1、5.2 等）是 W3C 在 2014 年至 2019 年间发布的**快照版本**。WHATWG 在 2004 年以“活标准”模式开始维护 HTML 标准。2019 年后，W3C 终止了独立维护，统一使用 WHATWG 动态标准。
- **HTML5 在术语上的演变**：在当前技术语境中，“HTML5”一词更常用于指代一组现代 Web 技术的集合——包括 HTML 动态标准、CSS3 以及一系列增强存储、多媒体和硬件访问的 JavaScript API。
- **最新规范地址**：[https://html.spec.whatwg.org/](https://html.spec.whatwg.org/)

HTML Living Standard（HTML 动态标准）是 HTML 语言的**官方现行标准**，是由 WHATWG 维护的、持续更新的 HTML 规范。

**HTML Living Standard** 与传统的带版本号的标准（如 HTML 4.01、HTML5）不同，它采用 **“动态标准”**模式——标准文档没有固定的版本号，而是随着浏览器厂商的实践和 Web 技术的发展**持续更新**。

#### WHATWG（网页超文本应用技术工作小组）

**WHATWG** 是网页超文本应用技术工作小组（Web Hypertext Application Technology Working Group），是由苹果、Mozilla 和 Opera 于2004年成立。其成立的根本原因是：**当时的 W3C 意图放弃HTML，转而全力推进XHTML 和 XML 技术路线**。

**WHATWG 与 W3C 理念不同**：

- **WHATWG**：HTML 应该成为**动态标准**，随着技术和市场需求的变化**持续更新**。
- **W3C**：倾向于追求**固定的标准版本**，以严格的规范流程稳定发布。

2006年，W3C 改变了对 XHTML 的思路。2007年，W3C 采纳了 WHATWG 的提案，宣布以 WHATWG 的 Web 应用规范为基础推进 HTML5。这标志着 XHTML 路线的终结和 HTML5 时代的开启。

2019年5月28日，W3C 与 WHATWG 签署 **《合作备忘录》**，达成历史性协议：

- WHATWG 继续维护 **HTML 和 DOM 的动态标准**。
- W3C **停止独立发布** HTML 和 DOM 相关规范。
- W3C 将 WHATWG 的审阅草案纳入 **W3C 正式推荐标准流程**。
- 双方共同在 **WHATWG 的存储库** 中开发 HTML 和 DOM。

**自此，HTML Living Standard 成为 HTML 的唯一标准版本。**

#### 涵盖范围

HTML Living Standard 的涵盖范围比传统 HTML 标准更广，主要包括：

* **HTML 核心语法**：标签、元素、属性、文档结构等基础定义。
* **DOM 规范**：浏览器中 HTML 文档的对象模型表示。
* **Web API**：与页面交互的 JavaScript API（如 fetch、Web Storage、Web Workers 等）。
* **解析规则**：浏览器如何解析 HTML 代码的详细算法（包括容错机制）。
* **渲染行为**：浏览器如何呈现特定元素的标准行为。
* **可访问性**：ARIA 角色和语义的集成。

**注意**：CSS 和某些更底层的 API（如 WebRTC、WebGL）有各自独立的标准，不在 HTML Living Standard 范围内。

#### 浏览器支持情况

所有主流浏览器都已遵循 HTML Living Standard：

| 浏览器      | 引擎   | 遵循情况   |
| :---------- | :----- | :--------- |
| **Chrome**  | Blink  | ✅ 完全遵循 |
| **Edge**    | Blink  | ✅ 完全遵循 |
| **Firefox** | Gecko  | ✅ 完全遵循 |
| **Safari**  | WebKit | ✅ 完全遵循 |
| **Opera**   | Blink  | ✅ 完全遵循 |

####  版本演进的历史节点

* 1995：IETF 发布 HTML 2.0（首个官方标准）。

* 1997：W3C 发布 HTML 3.2。

* **1999**：W3C 发布 HTML 4.01（经典版本）。

* 2000：W3C 发布 XHTML 1.0。

* 2004：WHATWG 成立，开始研发动态标准。

* 2008：W3C 发布 HTML5 第一份工作草案。

* **2014**：W3C 正式发布 HTML5 推荐标准。

* **2019**：W3C 与 WHATWG 签署协议，HTML Living Standard 成为唯一标准。

* **至今**：WHATWG 持续维护 HTML Living Standard。

**一句话总结**：HTML Living Standard 是 **官方的现行标准**，HTML5 是 **历史上这个标准版本的名称**。