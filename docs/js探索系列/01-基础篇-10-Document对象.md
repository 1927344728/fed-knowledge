## 基础篇：Document对象

Document 接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是 DOM 树。DOM 树包含了像 body、table、div、video 元素，以及大量其他元素。它向网页文档本身提供了全局操作功能，能解决如何获取页面的 URL 、如何在文档中创建一个新的元素等问题。

Document 接口描述了任何类型的文档的通用属性与方法。根据不同的文档类型（HTML、XML、SVG...），还能使用更多 API：使用 `text/html` 作为内容类型的 HTML 文档，还实现了 HTMLDocument 接口，而 XML 和 SVG 文档则实现了 XMLDocument 接口。

获取 document 对象的方法有：

* 浏览器中，直接使用 document 或 window.document。
* iframe 框架中，使用 iframe 节点的 contentDocument 属性。
* Ajax 操作返回的文档中，使用 XMLHttpRequest 对象的 responseXML 属性。
* 普通节点的 ownerDocument 属性。

### Document属性

#### Node 和 EventTarget 接口

以上属性，Document 接口继承自 Node 和 EventTarget 接口。

##### all（只读）(已废弃)

返回一个以文档节点为根节点的 HTMLAllCollection 集合。换句话说，它能返回页面的所有元素。

**备注：** 该属性有一个特性，就是转换为布尔值时，返回的是 false。

```javascript
document.all
// HTMLAllCollection(154) [html, head, title, meta, meta, meta, link, link, link, link, link, link, link, script,, …]
Boolean(document.all) // false
```

**备注：** 该特性已经从 Web 标准中删除。

##### anchors（只读）(已废弃)

返回文档中所有锚点元素的列表。

##### body

返回当前文档中的 body 元素或者 frameset 元素。

##### characterSet（只读）

返回当前文档的字符编码。该字符编码是用于渲染此文档的字符集，可能与该页面指定的编码不同。

##### compatMode（只读）

表明当前文档的渲染模式是怪异模式、混杂模式还是标准模式。

可能的值有：

* BackCompat：文档为怪异模式。
* CSS1Compat：文档不是怪异模式，意味着文档处于标准模式或者准标准模式。

##### contentType（只读）

根据当前文档的 MIME Header，返回它的 Content-Type。

**注意：** 返回值是浏览器检测到的，不一定是直接读取 HTTP 响应头中的或者 HTML 中 meta 标签指定的值。

##### doctype（只读）

返回当前文档的文档类型定义（Document Type Definition，DTD）。

##### documentElement（只读）

返回文档对象的根元素，如，HTML 文档的 html 元素。

HTML 文档通常包含两个子节点：`<!DOCTYPE>` 和 `<html>`，而 XML 文档通常包含多个子节点：根元素、DOCTYPE 声明，和 processing instructions。

##### documentURI（只读）

以字符串的类型，返回当前文档的路径。

**备注：** HTML 文档有一个 `document.URL` 属性返回同样的值。但是不像 URL 属性，documentURI 属性适用于所有类型的文档。

##### embeds（只读）

返回当前文档的所有 embed  元素的列表 。

##### fonts

返回当前文档的 FontFaceSet 接口。FontFaceSet 是一个实验中的功能，管理着字体们的加载和可查询的字体们下载状态。

##### forms（只读）

返回当前文档中的 form 元素的一个集合。

##### head（只读）

返回当前文档中的 head 元素。如果有多个 head 元素，则返回第一个。

##### hidden（只读）

返回一个布尔值，表明当前页面是否隐藏。

##### images（只读）

返回当前文档中所有 image 元素的集合。

##### implementation（只读）

返回一个和当前文档相关联的 DOMImplementation 对象。DOMImplementation 对象提供了不依赖于任何 document 的方法。

##### lastStyleSheetSet（只读）（已废弃）

返回最后一个启用的样式表集合。当 document.selectedStyleSheetSet 属性发生变化时，这个属性的值就会随之发生变化。

如果当前样式表集尚未通过 document.selectedStyleSheetSet 更改，则返回值为 null。

##### links（只读）

返回文档中所有具有 href 属性值的  area、a 元素的集合。

##### plugins（只读）

返回一个 HTMLCollection 对象，该对象包含一个或多个 HTMLEmbedElement 表示当前文档中的 embed 元素。

##### scripts（只读）

返回一个 HTMLCollection 对象，包含了当前文档中所有 script 元素的集合。

##### scrollingElement（只读）

返回滚动文档的 Element 对象的引用。 

在标准模式下，是文档的根元素（document.documentElement）；当在怪异模式下，是指文档的 body 元素（若不存在返回 null ）。

##### selectedStyleSheetSet

表示当前使用的样式表集合的名称。

##### styleSheetSets（只读）

返回一个所有当前可用样式表集的实时列表。

##### Document.timeline（只读）

表示当前文档的默认时间轴。 此时间轴是 DocumentTimeline 的一个特殊实例，它会在网页加载时自动创建。

##### Document.visibilityState（只读）

返回 document 的可见性， 即当前可见元素的上下文环境。由此可以知道当前文档（即为页面）是在背后， 或是不可见的隐藏的标签页，或者（正在）预渲染。

可用的值如下：

* visible：页面内容至少是部分可见。即此页面在前景标签页中，并且窗口没有最小化。
* hidden：页面对用户不可见。即文档处于背景标签页或者窗口处于最小化状态，或者操作系统正处于锁屏状态'。
* prerender：页面此时正在渲染中，因此是不可见的。文档只能从此状态开始，永远不能从其他值变为此状态。

当此属性的值改变时，会触发 document 的 visibilitychange 事件。

典型用法是防止当页面正在渲染时加载资源，或者当页面在背景中或窗口最小化时禁止某些活动。

#### HTMLDocument 接口

以下属性，是 HTML 文件的 Document 接口继承自 HTMLDocument 接口。

##### cookie

返回一个使用分号分隔的 cookie 列表，或设置（写入）一个 cookie。

##### defaultView（只读）

在浏览器中，该属性返回当前 document 对象所关联的 window 对象；如果没有，会返回 null。

##### designMode

获取或设置是否（让用户）编辑整个文档的能力。\

该属性的有效值为 `on` 和 `off` 。根据规范，该属性默认为 `off`。

Firefox 遵循此标准。早期版本的 Chrome 和 IE 默认为 `inherit` 。从 Chrome 43 开始，默认值为 "off" ，并且不再支持 `inherit`。在 IE6 到 IE10 中，该值为大写。

##### dir（只读）

获取或设置文档的文字方向，是从左到右（ltr） (默认) 还是从右到左（rtl）。

rtl（right to left）代表从右到左，ltr（left to right）代表从左到右。

##### domain（已废弃）

获取或设置当前文档的域名，常用于同源策略。

如果成功设置此属性，则原始端口的端口部分也将设置为 null。

##### lastModified（只读）

返回一个字符串，其中包含了当前文档的最后修改日期和时间。

##### location（只读）

返回一个 Location 对象，包含有文档的 URL 相关的信息，并提供了改变该 URL 和加载其他 URL 的方法。

尽管 location 属性返回的是一个只读的 Location 对象，但是也能给它设置一个字符串。

以下写法都是可以的：

```javascript
document.location      = 'http://www.example.com'
document.location.href = 'http://www.example.com'
```

##### readyState（只读）

返回当前文档的加载状态。

可用的值如下：

* loading：正在加载，即 document 仍在加载。
* interactive：可交互，即文档已被解析，"正在加载" 状态结束，但是如图像、样式表和框架之类的子资源仍在加载。
* complete：完成，即文档和所有子资源已完成加载，且此时会触发 load 事件。

当该属性值发生变化时，会在 document 对象上触发 readystatechange 事件。

##### referrer（只读）

返回的是一个 URI，当前页面就是从这个 URI 所代表的页面跳转或打开的。

如果用户直接打开了这个页面（不是通过页面跳转，而是通过地址栏或者书签等打开的），则该属性为空字符串。由于该属性只是返回一个字符串，所以不能够通过该属性引用页面的 DOM。

在 iframe 中，该属性会初始化为父窗口 Window.location 的href。

##### title

获取或设置当前文档的标题。

##### URL（只读）

以字符串形式返回文档的地址栏链接。

**备注：** 该属性的值和 document.location.href 属性的值是相等的。然而 document.location.href 是可写的，document.URL 是只读的。

**备注：** document.documentURI 也返回与该属性相同的值，不过它在非 HTML 文档中也可以使用。

#### Document 接口

##### activeElement（只读）

返回当前在 DOM 或者 shadow DOM 树中获得焦点的 Element；如果没有焦点元素，会返回 body 或 null 。

通常情况下，如果 HTMLInputElement 或者 HTMLTextAreaElement 元素中有文字被选中时， 则返回该元素 。其他情况下，焦点元素也可能是 select 元素或者 input 元素。

##### fullscreenElement（只读）

返回当前文档处于全屏模式下的元素。

##### pointerLockElement（只读）

返回在鼠标事件中当目标被锁定时的元素集和。如果指针处于锁定等待中、指针没有被锁定，或者目标在另外一个文档中这几种情况，返回的值 null。

##### styleSheets（只读）

返回一个 StyleSheetList、CSSStyleSheet 对象，即当前文档通过引入或者嵌入文档中的样式表。

### Document事件属性

#### Document接口

##### onfullscreenchange

该属性是 fullscreenchange 事件的处理器，该处理器在**文档进入或者退出全屏模式**的时候立即触发。

**备注：** fullscreenchange 事件不会直接说明文档当前是进入还是退出全屏模式。可以查看Document.fullscreenElement 的值，如果为 null，则表示已退出全屏模式； 否则，指定的元素将接管屏幕。

##### onfullscreenerror

该属性是 fullscreenchange 事件的处理器，该处理器在当前文档**不能进入全屏模式**，即使它被请求时触发。

##### onreadystatechange

该属性是 readystatechange 事件的处理器，该处理器在文档的 **readyState 属性发生变化**时触发。

##### onselectionchange

该属性是 selectionchange 事件的处理器，该处理器在文档的**文本选择范围**变化时触发。

##### onvisibilitychange

该属性是 visibilitychange 事件的处理器，该处理器**在文档内容变得可见或已隐藏**时触发。

#### GlobalEventHandlers接口

##### onabort

该属性是 abort 事件的处理器，该处理器在**资源加载中断**时触发，但不是错误的结果。

##### onerror

该属性是 error 事件的处理器，该处理器在**发生不同类型的错误**在各种目标时触发。

包含以下场景：

* 当 JavaScript 运行时错误（包括句法错误和处理程序中抛出的异常）时触发。
* 当资源（img、script...）加载失败时，会在启动加载的元素上触发。

##### oncontextmenu

该属性是 contextmenu 事件的处理器，该处理器在用户尝试**打开上下文菜单**时触发。此事件通常通过单击鼠标右键或按上下文菜单键来触发。

##### onformdata

该属性是 formdata 事件的处理器，该处理器在**构建表示表单数据的条目列表**后触发。这发生在提交表单时，但也可以通过调用 FormData() 构造函数来触发。

##### onload

该属性是 load 事件的处理器，该处理器在**文档加载过程结束**时触发。至此，文档中的所有对象都在 DOM 中，所有图片、脚本、链接和子框架都加载完毕。

##### onloadeddata

该属性是 loadeddata 事件的处理器，该处理器在**媒体的第一帧完成加载**时触发。

##### onloadedmetadata

该属性是 loadedmetadata 事件的处理器，该处理器在**元数据完成加载**时触发。

##### onloadend

该属性是 loadend 事件的处理器，该处理器在**加载资源的进度停止**时触发。

##### onloadstart

该属性是 loadstart 事件的处理器，该处理器在**开始加载资源**时触发。

##### onpause

该属性是 pause 事件的处理器，该处理器在**媒体播放暂停**时触发。

##### onplay

该属性是 play 事件的处理器，该处理器在**媒体播放**时触发。

##### onplaying

该属性是 playing 事件的处理器，该处理器在第一次开始播放后以及重新启动时触发。例如，当由于缺少数据而暂停或延迟后恢复播放时会触发它。

### Document方法

#### Node 和 EventTarget 接口

##### adoptNode()

从其他的 document 文档中获取一个节点。 该节点以及它的子树上的所有节点都会从原文档删除，并且它的ownerDocument 属性会变成当前的 document 文档。之后可以把这个节点插入到当前文档中。

##### createAttribute()

创建并返回一个新的属性节点。该节点是一个实现了 Attr 接口的节点。

##### createAttributeNS()

使用指定的命名空间 URI 和限定名称创建一个新属性节点，并将其返回。该节点是一个实现 Attr 接口的节点。

##### createCDATASection()

创建并返回一个新的 CDATA 片段节点。

##### createComment()

创建并返回一个注释节点。

##### createDocumentFragment()

创建一个新的文档片段。

##### createElement()

创建一个给定标签名的新元素。

##### createElementNS()

创建一个给定标签名和命名空间的新元素。

##### createEvent()

创建一个指定类型的事件。其返回的对象必须先初始化并可以被传递给 Element.dispatchEvent。

##### createNodeIterator()

返回一个新的 NodeIterator 对象。

##### createProcessingInstruction() 

创建一个新的处理指令节点，并返回。

##### createRange()

创建一个 Range 对象。Range 接口表示一个包含节点与文本节点的一部分的文档片段。

##### createTextNode()

创建一个新的文本节点。这个方法可以用来转义 HTML 字符。

##### createTreeWalker()

创建并返回一个 TreeWalker 对象。

##### getElementsByClassName()

返回一个包含所有指定**类名**的子元素的动态 HTML 集合 HTMLCollection。

动态 HTML 集合 HTMLCollection，意味着它可以自动更新自己来保持和 DOM 树的同步而不用再次调用该方法。

当在 document 对象上调用时，会搜索整个 DOM 文档，包含根节点；在任意元素上调用该方法，会搜索以当前元素为根节点的 DOM 树。

##### getElementsByTagName()

返回一个包括所有指定**标签名**的子元素的动态 HTML 集合 HTMLCollection。

动态 HTML 集合 HTMLCollection，意味着它可以自动更新自己来保持和 DOM 树的同步而不用再次调用该方法。

当在 document 对象上调用时，会搜索整个 DOM 文档，包含根节点；在任意元素上调用该方法，会搜索以当前元素为根节点的 DOM 树。

##### getElementsByTagNameNS()

与 getElementsByTagName() 类似，但返回的是带有**指定标签名和命名空间**的元素集合。

##### hasStorageAccess()（实验性）

返回了一个 Promise 来判断该文档是否有访问第一方储存的权限。

##### importNode()

将外部文档的一个节点拷贝一份，然后可以把这个拷贝的节点插入到当前文档中。

**备注：** 源节点不会从外部文档中删除，被导入的节点是源节点的一个拷贝。

##### requestStorageAccess()

请求第一方存储的访问权限，并返回一个 Promise，如果授予，则返回 resolve，被拒绝，则返回 reject。

##### getElementById()

返回一个匹配特定 ID 的元素。由于元素的 ID 在大部分情况下要求是独一无二的，这个方法自然而然地成为了一个高效查找特定元素的方法。

**注意：** 该方法只有在作为 document 的方法时才能起作用，而在 DOM 中的其他元素下无法生效。这是因为 ID 值在整个网页中必须保持唯一。因此没有必要为这个方法创建所谓的 “局部” 版本。

##### querySelector()

返回文档中与指定选择器或选择器组匹配的第一个 Element 对象。 如果找不到匹配项，则返回 null。

**备注：** 匹配是使用深度优先先序遍历，从文档标记中的第一个元素开始，并按子节点的顺序依次遍历。

##### querySelectorAll()

返回与指定的选择器组匹配的文档中的元素列表，返回的对象是 NodeList 。

**备注：** 使用深度优先的先序遍历文档的节点。

#### HTML Documents接口扩展

##### close()

用于结束由对文档的 `Document.write()` 写入操作，这种写入操作一般由 `Document.open()` 打开。

##### open()

打开一个要写入的文档。

这将会有一些连带的影响：

* 已注册到文档、文档中的节点或文档的 window 的所有事件监听器会被清除。
* 文档中的所有节点会被清除。

**备注：** 当 `document.write()` 在页面加载后调用，会自动调用该方法。

##### write()

将一个文本字符串写入一个由 `document.open()` 打开的文档流。

##### writeln()

向文档中写入一串文本，并紧跟着一个换行符。

##### execCommand()（已废弃）

当一个 HTML 文档切换到**设计模式**时，该方法允许运行命令来操纵可编辑内容区域的元素。

```javascript
// 查看和开启设计模式
document.designMode // 'off'
document.designMode = 'on'
```

大多数命令影响文档中选中的文本（粗体，斜体等），当其他命令插入新元素（添加链接）或影响整行（缩进）。当使用 contentEditable 时，将影响当前活动的可编辑元素。

```javascript
document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
```

参数说明：

* aCommandName： 命令的名称。
* aShowDefaultUI： 是否展示用户界面，一般为 false。Mozilla 没有实现。
* aValueArgument： 一些命令需要额外的参数，默认为 null。

可用命令如下：

* copy： 拷贝当前选中内容到剪贴板。启用这个功能的条件因浏览器不同而不同，而且不同时期，其启用条件也不尽相同。使用之前请检查浏览器兼容表，以确定是否可用。
* cut： 剪贴当前选中的文字并复制到剪贴板。启用这个功能的条件因浏览器不同而不同，而且不同时期，其启用条件也不尽相同。使用之前请检查浏览器兼容表，以确定是否可用。、
* paste： 在光标位置粘贴剪贴板的内容，如果有被选中的内容，会被替换。剪贴板功能必须在 user.js 配置文件中启用。
* selectAll： 选中编辑区里的全部内容。
* contentReadOnly： 通过传入一个布尔类型的参数来使能文档内容的可编辑性。（IE 浏览器不支持）
* delete： 删除选中部分。
* backColor： 修改文档的背景颜色。
* bold： 开启或关闭选中文字或插入点的粗体字效果。
* italic： 在光标插入点开启或关闭斜体字。
* fontSize： 在插入点或者选中文字部分修改字体大小。需要提供一个 HTML 字体尺寸 (1-7) 作为参数。
* foreColor： 在插入点或者选中文字部分修改字体颜色。需要提供一个颜色值字符串作为参数。
* indent： 缩进选择或插入点所在的行， 在 Firefox 中，如果选择多行，但是这些行存在不同级别的缩进，只有缩进最少的行被缩进。
* redo： 重做被撤销的操作。
* undo： 撤销最近执行的命令。
* ...

##### queryCommandEnabled() 

查询浏览器中指定的编辑指令是否可用。

请注意以下情况：

* 经过测试，在部分浏览器它永远返回 false，而 IE 浏览器即使对于同样支持的属性也可能有不同返回值；有时 IE 还会对不支持的属性抛出异常而不是返回 false。
* 对于 "cut" 和 "copy" 指令，只有当用户启动的线程调用该方法时才返回 true。
* "paste" 指令不仅当特性不可用时返回 false ，脚本权限不足时也一样。

##### queryCommandSupported() 

查询浏览器是否支持指定的编辑指令。

请注意：

* 如果命令没有值或未启用，将返回空字符串。
* "fontSize" 命令将被特殊处理，如果值被重写，它将返回最近似标准尺寸的整数倍像素大小。
* 如果命令的值已被重写，将由重写返回。
* 否则，此命令返回命令的值，如同 document.queryCommandValue()。

##### queryCommandState()

返回指定命令在对象内的状态码。

* 1：表示指定命令在对象内已执行；
* 0：表示指定命令在对象内未执行，处于可执行状态；
* -1：表示指定命令在对象内处于不可用状态。

##### getElementsByName()

根据给定的 name 返回一个在 动态的 HTML document 的节点列表集合。

##### hasFocus() 

返回一个布尔值，表明当前文档或者当前文档内的节点是否获得了焦点。

#### Document接口

##### getSelection()

返回一个 Selection 对象，表示用户选择的文本范围，或插入符号的当前位置。

##### elementFromPoint()

返回给定坐标点下最上层的 HTML 元素。

##### elementsFromPoint()

返回给定坐标点下的 HTML 元素数组。

##### caretPositionFromPoint()

返回一个 CaretPosition 对象，其中包含 DOM 节点，以及插入符号和插入符号在该节点内的字符偏移量。

### Document事件

使用 addEventListener() 监听，或将事件监听器分配给该接口的 oneventname 属性来监听这些事件。

##### scroll

文档视图或者一个元素在**滚动**时触发。

##### visibilitychange

当其选项卡的**内容变得可见或被隐藏**时触发。

##### wheel

当用户在定点设备（通常是鼠标）上旋转**滚轮**按钮时触发。

##### DOMContentLoaded

当纯 HTML 被完全加载以及解析时触发，而不必等待样式表、图片或者子框架完成加载。

##### readystatechange

当文档的 readyState 属性发生改变时触发。

##### load

当整个页面及所有依赖资源，如样式表、图片或者子框架都已完成加载时触发。

##### animationcancel

当 CSS 动画**意外中止**时触发。换句话说，任何时候它不是由正常执行完成而停止运行时触发。这可能发生在更改 以删除动画或使用 CSS 隐藏动画节点时。

##### animationend

当 CSS **动画完成**时触发。如果动画在完成之前中止，例如从 DOM 中删除元素或从元素中删除动画，则不会触发事件。

##### animationiteration

当 CSS **动画的迭代结束并且另一个动画开始时**触发该事件。此事件不会与 animationend 事件同时发生，因此对于 `animation-iteration-count: 1` 的动画不会发生。

##### animationstart

当 CSS **动画开始**时触发。如果有 animation-delay 属性，则在延迟期到期后将触发此事件。负延迟将导致事件以等于延迟的绝对值触发（相应地，动画将在该时间索引开始播放到序列中）。

##### copy

当用户通过浏览器的用户界面启动**复制**操作时触发。

此事件的原始目标是 Element 复制操作的预期目标。可以在接口上侦听此事件，Document 可以在捕获或冒泡阶段进行处理。

##### cut

当用户通过浏览器的用户界面启动**剪切**操作时触发。

##### paste

当用户通过浏览器的用户界面启动**粘贴**操作时触发。

##### dragstart

当用户**开始拖动**一个元素或者一个选择文本的时触发。

##### drag

当元素或者选择的文本被**拖动**时触发（每几百毫秒）。

##### dragend

拖放事件在**拖放操作结束**时触发（通过释放鼠标按钮或单击 Escape 键）。

##### dragenter

当拖动的元素或被选择的文本**进入有效的放置目标**时触发。

##### dragover

当元素或者选择的文本**被拖拽到一个有效的放置目标**上时触发（每几百毫秒触发一次）。

##### dragleave

当一个被拖动的元素或者被选择的文本**离开一个有效的拖放目标**时触发。

##### drop

当一个元素或是选中的文字被**拖拽释放到一个有效的释放目标位置**时触发。

```html
<div>
    <div draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)" > This div is draggable </div>
</div>
```

```javascript
let dragged;

/* 拖动目标元素时触发 drag 事件 */
document.addEventListener("drag", event => {}, false);
document.addEventListener("dragstart", event => {}, false);
document.addEventListener("dragend", event => {}, false);

/* 放置目标元素时触发事件 */
document.addEventListener("dragover", event => {}, false);
document.addEventListener("dragenter", event => {}, false);
document.addEventListener("dragleave", event => {}, false);
document.addEventListener("drop", event => {}, false);
```

##### fullscreenchange

当浏览器进入或离开全屏时触发。

##### fullscreenerror

当一个事件处理器用于处理 fullscreenchange 事件时，在当前文档不能进入全屏模式时触发。

##### keydown

当键盘按键按下时触发。

##### keypress

当按下一个键并且该键通常会产生一个字符值时触发。

##### keyup

当键盘按键被松开时触发。

> 与 keypress 事件不同的是，所有按键均会触发 keydown 事件，无论这些按键是否会产生字符值。
>
> keydown 与 keyup 事件捕获了键盘按键的操作，而 keypress 反映了具体输入某个字符的值。比如，小写 `a` 在keydown 和 keyup 事件中输出的是大写 `A` 的 Unicode 编码 65，但是在 keypress 中输出的就是小写 `a` 的 Unicode 编码 97；而大写 `A` 在这些事件中输出的都是 Unicode 编码 65。
>
> 键盘事件只能由 input、textarea 以及任何具有 contentEditable 或 tabindex="-1" 属性的组件触发。

##### gotpointercapture

当一个元素用 setPointerCapture() 捕获指针时触发。setPointerCapture() 方法用于将特定元素指定为未来指针事件的捕获目标，指针的后续事件将以捕获元素为目标，直到被 releasePointerCapture() 方法释放。

##### pointerdown

当指针变为活动状态时触发该事件。对于鼠标，它在设备从未按下按钮转换为至少按下一个按钮时触发。对于触摸，它是在与数字化仪进行物理接触时触发的。对于笔，它在手写笔与数字化仪发生物理接触时触发。

##### pointerup

当指针不再活动时触发该事件。

```javascript
const dom = document.querySelector('p');
dom.addEventListener('gotpointercapture', () => {
    console.log('指针捕获')
});
dom.addEventListener('pointerdown', (event) => {
    dom.setPointerCapture(event.pointerId);
});
```

##### pointerenter

当一个指向设备移动到一个元素或它的后代元素的命中测试边界时触发，另外，不支持悬停（hover）的设备的 pointerdown 事件后也会触发。

##### pointerout

触发原因有多种

* 指针设备移出元素的命中测试边界；
* pointerup 为不支持悬停的设备触发事件；
* 触发 pointercancel 事件后；
* 当触控笔离开数字化仪可检测到的悬停范围时。

##### pointermove

当指针改变坐标并且指针未被浏览器触摸动作取消时触发。

##### pointerleave 

当指向设备移出元素的命中测试边界时触发。 对于笔式设备，当触笔离开数字化仪可检测到的悬停范围时触发此事件。 

##### pointerover

当指针设备移动到元素的命中测试边界时触发该事件。

##### lostpointercapture

当释放捕获的指针时触发。

##### pointercancel

当浏览器确定不太可能再发生指针事件时触发，或者在 pointerdown 事件触发后，该指针随后被用于通过平移、缩放或滚动来操作视口。 

一些情况示例：

* 发生取消指针活动的硬件事件。 如，用户使用应用切换器界面或移动设备上的 “home” 按钮切换应用程序。  
* 当指针处于活动状态时，设备的屏幕方向改变时。  
* 浏览器认为用户不小心启动了指针输入。 如，如果硬件支持手掌拒绝功能，以防止在使用触控笔时手放在显示屏上不小心触发事件，就会发生这种情况。  
* 触摸操作 CSS 属性阻止继续输入。 

##### pointerlockchange

当指针解锁或者被锁定时触发。

##### pointerlockerror

当锁定指针失败（由于技术原因或权限被拒绝）时触发。

##### selectionchange

在文档上的当前文本选择被改变时触发。

##### selectstart

在用户开始一个新的选择时触发。

##### touchcancel

当一个或多个触摸点以特定于实现的方式中断时（如，创建了太多的触摸点）触发。

##### touchend

当触点离开触控平面时触发。

##### touchmove

当触点在触控平面上移动时触发。

##### touchstart

当一个或多个触摸点与触控设备表面接触时触发。

##### transitionrun

在第一次创建 CSS 过渡时触发，即在 transition-delay 开始之前。

##### transitionstart

当 CSS 过渡实际开始时触发，即在 transition-delay 结束之后。

##### transitioncancel

当 CSS 过渡被取消时触发。

如以下情况：

* 应用于目标的 transition-property 属性的值被更改；
* display 属性被设置为 `none`；
* 转换在运行到完成之前就停止了，例如通过将鼠标移出悬浮过渡元素。

##### transitionend

当 CSS 过渡完成时触发。

该事件在两种场景触发：当它完成转换到转换状态时，以及当它完全恢复到默认或非转换状态时。如果没有转换延迟或持续时间，或者均为 0，或者均未声明，则没有过渡，也不会触发任何过渡事件。

在过渡完成之前，如果移除 transition-property 属性或设置 display 属性为 `none`，则该事件不会触发。

如果 transitioncancel 事件被触发，则该事件不会触发。

### 参考资料

[MDN - Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)