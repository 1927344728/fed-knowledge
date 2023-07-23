## 基础篇：Element对象

Element 是一个通用性非常强的基类，所有 Document 对象下的对象都继承自它。这个接口描述了所有相同种类的元素所普遍具有的方法和属性。

一些接口继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。例如， HTMLElement 接口是所有 HTML 元素的基本接口，而 SVGElement 接口是所有 SVG 元素的基础。大多数功能是在这个类的更深层级的接口中被进一步制定的。

在 Web 平台的领域以外的语言，比如 XUL，通过 XULElement 接口，同样也实现了 Element 接口。

### Element属性

Element 继承了 Node 接口所有属性，并且扩展了 Node 的父接口 EventTarget，并且从以下接口继承了部分属性：ParentNode、ChildNode、NonDocumentTypeChildNode、Animatable。

##### id

返回元素的 id 属性。

同一文档中，若 id 的值不是空字符串 ""，便必须是唯一的；也就是说，不能有 id 属性值相同的元素。

##### className

获取或设置指定元素的 class 属性的值，其返回值是一个字符串，可以由空格分隔的多个 class 属性值。、

##### classList（只读）

返回一个元素的 class 属性的实时 DOMTokenList 集合。

##### attributes（只读）

返回元素所有属性节点的一个实时集合。该集合是一个 NamedNodeMap 对象，是一个类数组（不是一个数组），所以它没有数组的方法，其包含的属性节点的**索引顺序随浏览器不同而不同**。

##### clientHeight（只读）

返回元素内部**高度**（单位：像素）。

元素内部的高度包含内边距，但不包括水平滚动条、边框和外边距。对于没有定义 CSS 或者内联布局盒子的元素为 0。

```javascript
clientHeight = height + padding - 水平滚动条高度（如果存在）。
```

**备注：** 此属性会将获取的值四舍五入取整数。 如果需要小数结果，可使用 getBoundingClientRect() 方法。

**备注：** getBoundingClientRect() 方法只能获取元素的 width / height，即 offsetWidth / offsetHeight ，包括边框的长度。

##### clientWidth（只读）

与 clientHeight 类似，返回的是元素内部**宽度**（单位：像素）。

元素内部的宽度包含内边距，但不包括垂直滚动条、边框和外边距。

当在根元素使用 (或者 quirks（怪异）模式下的在 body 元素），返回 viewport 的宽度（不包括任何滚动条）。

##### clientLeft（只读）

返回元素的**左边框**的宽度（单位：像素），不包括左外边距和左内边距。

如果元素的文本方向是从右向左（RTL，right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度。

##### clientTop（只读）

返回元素的**上边框**的宽度（单位：像素），不包括顶部外边距或内边距。

一个元素顶部边框的宽度（以像素表示）。不包括顶部外边距或内边距。clientTop 是只读的。

##### innerHTML

设置或获取 HTML 语法表示的元素的后代。

##### outerHTML

设置或获取描述元素（包括其后代）的序列化 HTML 片段。在设置时，会从给定的字符串开始解析，替换元素自身。

##### localName（只读）

返回一个字符串，表示这个元素名称本地化的部分。

##### namespaceURI（只读）

返回元素的命名空间，若该元素不在命名空间中则返回 null。

##### nextElementSibling（只读）

返回当前元素在其父元素的子元素节点中的**后一个元素**节点，如果该元素已经是最后一个元素节点，则返回 null。

##### previousElementSibling（只读）

返回当前元素在其父元素的子元素节点中的**前一个元素**节点，如果该元素已经是第一个元素节点，则返回 null。

##### prefix（只读）

返回指定元素的命名空间前缀，如果未指定前缀，则返回 null。

##### scrollHeight（只读）

返回一个元素内容**高度**的度量，包括由于溢出导致的视图中不可见内容。

没有垂直滚动条的情况下， scrollHeight 与 clientHeight 相同：包含元素的内边距，但不包括边框、外边距或水平滚动条（如果存在），还包括伪元素的高度，例如 `::before` 或 `::after`。 

##### scrollWidth（只读）

返回一个元素内容**宽度**的度量，包括由于溢出导致的视图中不可见内容。

没有水平滚动条的情况下， scrollWidth 与 clientWidth 相同：包含元素的内边距，但不包括边框、外边距或垂直滚动条（如果存在），还包括伪元素的宽度，例如 `::before` 或 `::after`。 

##### scrollLeft

获取或设置一个元素的内容水平滚动的距离，即元素的内容左侧（卷起来的）到它的视口可见内容（的左侧）的距离（单位：像素）。

该值可以是任意整数，然而：

* 如果元素不能滚动（如，元素没有溢出，或者元素有 `non-scrollable` 属性），那么返回 0。
* 如果给 scrollLeft 设置的值小于 0，那么值将变为 0。
* 如果给 scrollLeft 设置的值超出容器可滚动的值，则会被设为最大值。

**注意：** 如果元素的内容排列方向是从右向左（rtl，Right-To-Left），那么滚动条会位于最右侧（内容开始处），并且scrollLeft值为 0。此时，当从右到左拖动滚动条时，scrollLeft 会从 0 变为负数。

##### scrollTop

获取或设置一个元素的内容垂直滚动的距离，即元素的内容顶部（卷起来的）到它的视口可见内容（的顶部）的距离（单位：像素）。

该值可以是任意整数，然而：

* 如果元素不能滚动（如，元素没有溢出，或者元素有 `non-scrollable` 属性），那么返回 0。
* 如果给 scrollTop 设置的值小于 0，那么值将变为 0。
* 如果给 scrollTop 设置的值超出容器可滚动的值，则会被设为最大值。

##### tagName

返回当前元素的标签名。

**备注：** 在 XML（或者其他基于 XML 的语言，比如 XHTML、xul）文档中，tagName 的值会保留原始的大小写。而在 HTML 文档中，tagName 会返回其大写形式。

**备注：** 对于元素节点来说，tagName 属性的值和 nodeName 属性的值是相同的。

##### assignedSlot（只读）

返回一个 HTMLSlotElement，表示 slot 插入节点的元素。

```html
<my-paragraph>
    <span slot="my-text">Let's have some different text!</span>
</my-paragraph>
```

```javascript
const slottedSpan = document.querySelector('my-paragraph span')
console.log(slottedSpan.assignedSlot)
```

##### onfullscreenchange

fullscreenchange 事件的回调方法，在元素进入或退出全屏模式时触发。不仅可用于观察（监听）可预期的过度变化，还可以观察（监听）未知的变化，如：当你的应用程序在后台运行。

##### onfullscreenerror

 fullscreenerror 事件的回调方法，在进入全屏模式过程中出现错误时触发。

### Element方法

从父接口 Node 和 Node 的父接口 EventTarget 继承方法，并继承了 ParentNode、ChildNode、NonDocumentTypeChildNode、Animatable 的部分方法。 

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

##### querySelector()

返回与指定的选择器组匹配的元素的后代的第一个元素。

**注意：** 匹配过程首先会应用到整个文档，来创建一个可能有匹配元素的初始列表，然后从结果元素中检查它们是否是指定元素的后代元素。第一个匹配的元素将会被返回。

##### querySelectorAll()

返回一个非实时更新的 NodeList，它包含所有元素的非活动节点，该元素来自与其匹配指定的 CSS 选择器组的元素（指定元素本身不包括，即使它匹配）。

##### closest()

获取匹配特定选择器且离当前元素最近的祖先元素（也可以是当前元素本身）。如果匹配不到，则返回 null。

##### matches()

返回一个布尔值，表示元素是否包含指定的选择器。

##### insertAdjacentElement()

将指定的元素插入到相对于被调用的元素的给定的一个位置。

```javascript
element.insertAdjacentElement(position, element);
```

position 值必须是以下字符串之一：

* beforebegin：在该元素本身的前面。
* afterbegin：只在该元素当中，在该元素第一个子孩子前面。
* beforeend：只在该元素当中，在该元素最后一个子孩子后面。
* afterend：在该元素本身的后面。

##### insertAdjacentHTML()

将指定的文本解析为 Element 元素，并将元素插入到相对于被调用的元素的给定的一个位置。

```javascript
element.insertAdjacentHTML(position, text);
```

它不会重新解析它正在使用的元素，因此它不会破坏元素内的现有元素。这避免了额外的序列化步骤，使其比直接使用 innerHTML 操作更快。

##### insertAdjacentText()

将一个给定的文本节点插入到相对于被调用的元素的给定的一个位置。

```javascript
element.insertAdjacentText(position, element);
```

##### remove()

从 DOM 中删除指定元素。

##### addEventListener() 

将指定的监听器**注册**到事件目标上，当该对象触发指定的事件时，指定的回调函数就会被执行。事件目标可以是一个文档上的元素 Element、Document、Window，或者任何其他支持事件的对象（比如 XMLHttpRequest）。

其工作原理是将实现事件监听的函数或对象添加到调用它的事件目标上的指定事件类型的事件侦听器列表中。

```javascript
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```

##### removeEventListener()

删除事件目标的监听事件。使用事件类型，事件侦听器函数本身，以及可能影响匹配过程的各种可选择的选项的组合来标识要删除的事件侦听器。

```javascript
target.removeEventListener(type, listener[, options]);
target.removeEventListener(type, listener[, useCapture]);
```

##### dispatchEvent()

向一个指定的事件目标**派发**一个事件，并以合适的顺序同步调用目标元素相关的事件处理函数。标准事件处理规则（包括事件捕获和可选的冒泡过程），同样适用于通过手动的使用 dispatchEvent() 方法派发的事件。

**注意：** 与浏览器原生事件不同，原生事件是由 DOM 派发的，并通过事件循环机制，异步调用事件处理程序，而dispatchEvent() 则是同步调用事件处理程序。在调用 dispatchEvent() 后，所有监听该事件的事件处理程序将在代码继续前执行并返回。

##### getBoundingClientRect()

返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。

该对象包含描述整个元素的位置和大小的只读属性—— left、top、right、bottom、x、y、width 和 height，单位为像素。除了 width 和 height 以外的属性，是相对于视图窗口的左上角来计算的。

##### getClientRects()

返回一个是 ClientRect 对象集合，其提供元素相关的 CSS 边框。

该对象包含一组描述该边框的只读属性——left、top、right 和 bottom，单位为像素，这些属性值是相对于视口的左上角。即使当表格的标题在表格的边框外面，该标题仍会被计算在内。

**注意：** 当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，返回的矩形不包括任何可能超出元素范围的子元素的边界。

##### hasAttribute()

返回一个布尔值，指示该元素是否包含有指定**名称**的属性。

##### hasAttributeNS()

返回一个布尔值，指示该元素是否包含有指定**命名空间和名称**的属性。

##### hasAttributes()

返回一个布尔值，表明当前元素节点是否有至少一个的属性。

##### getAttribute()

返回元素上一个**指定的属性值**。如果指定的属性不存在，则返回 null 或 "" （空字符串）。

当在被标记为 HTML 文档中的一个 HTML 元素上调用此方法时，getAttribute() 会先将其参数转换为小写形式。

**注意：** 当指定的属性不存在时，所有浏览器（Firefox、IE、Opera 最新版本、Safari、Konqueror 以及 iCab 等等）都返回 null，这也是当前 DOM 规范草案规定的。然而，旧的 DOM 3 核心规范认为，此时正确的返回值应该是一个空字符串，因此，在 XUL（Gecko） 中，返回一个空字符串。

##### getAttributeNS()

返回具有**指定命名空间和名称的属性值**。如果指定的属性不存在，则返回 null 或 "" （空字符串）。

##### getAttributeNames()

返回一个数组，包含指定元素的**所有属性名称**，如果该元素不包含任何属性，则返回一个空数组。

##### setAttribute()

设置指定元素上的**指定名称的属性值**。如果属性已经存在，则更新该值；否则，使用指定的名称和值添加一个新的属性。

属性的值/新值为任何非字符串的值，都会被自动转换为字符串。

当在 HTML 文档中的 HTML 元素上调用 setAttribute() 方法时，该方法会将其属性名称参数小写化。

##### setAttributeNS()

与 setAttribute() 类似，设置指定元素上的**指定命名空间和名称的属性值**。

##### removeAttribute()

从指定的元素中删除一个给定名称的属性。

##### removeAttributeNS()

从指定的元素中删除一个给命名空间和名称的属性。

##### toggleAttribute()

切换给定元素的某个布尔值属性的状态（如果属性不存在则添加属性，属性存在则移除属性）。

##### scroll()

使指定元素滚动到某个特定坐标。

##### scrollTo()

使指定元素滚动到指定坐标位置。

##### scrollBy()

使指定元素滚动一段特定距离的。

##### scrollIntoView()

使指定元素滚动到对用户可见。

```javascript
element.scrollIntoView(); // 等同于 element.scrollIntoView(true)
element.scrollIntoView(alignToTop);
element.scrollIntoView(scrollIntoViewOptions);
```

参数说明：

* alignToTop（可选）： 布尔值，默认为 true。为 true，元素的顶端将和其所在滚动区的可视区域的顶端对齐，等同于 `scrollIntoViewOptions: {block: "start", inline: "nearest"}`；为 false，元素的底端将和其所在滚动区的可视区域的底端对齐，等同于 `scrollIntoViewOptions: {block: "end", inline: "nearest"}`。
* scrollIntoViewOptions（可选）：
  * behavior（可选）：定义动画过渡效果，默认为 "auto"。可选值：auto | smooth。
  * block（可选）：定义垂直方向的对齐，默认为 "start"。可选值：start | center | end | nearest。
  * inline（可选）：定义水平方向的对齐， 默认为 "nearest"。可选值：start | center | end | nearest。

##### requestFullscreen()

用于发出异步请求使元素进入全屏模式。

```javascript
const Promise = Element.requestFullscreen(options);
```

options 是可选参数，控制转换到全屏模式的行为的对象。

可用的选项有：

* navigationUI（可选）： 控制当元素处于全屏模式时是否显示导航 UI。
  * “hide”：浏览器的导航界面将被隐藏，屏幕的整个尺寸将分配给元素的显示。
  * ”show“：浏览器将呈现页面导航控件和可能的其他用户界面；元素的尺寸（以及屏幕的感知大小）将被限制，以便为该用户界面留出空间。
  * “auto”（默认值）：由浏览器来决定是否显示导航条。

该方法不能保证元素一定能够进入全屏模式。如果元素被允许进入全屏幕模式，返回的 Promise 会 resolve，并且该元素会收到一个 fullscreenchange 事件，通知它已经进入全屏模式。如果全屏请求被拒绝，返回的 promise 会变成 rejected 并且该元素会收到一个 fullscreenerror 事件。

**备注：** 早期的实现总是会把这些事件发送给 Document，而不是调用的元素。

**注意：** 该方法只能在用户交互或者设备方向改变的时候调用，否则将会失败。

##### attachShadow()

给指定的元素挂载一个 ShadowDOM，并且返回对 ShadowRoot 的引用。

**注意：** 不是每一种类型的元素都可以附加到 shadowRoot 下面。出于安全考虑，一些元素不能使用 shadow DOM（例如 a 元素），以及许多其他的元素。

可以挂载 shadowRoot 的元素：

```javascript
任何带有有效的名称且可独立存在的自定义元素
body、div、p、span、h1~h6
main、nav、article、section、header、aside、footer
blockquote
```

##### createShadowRoot()

用于创建  ShadowDOM 实例，并附加到现有元素。创建 shadowDOM 之后，它所附加的元素称为 shadow root。

**备注：** 不推荐使用此方法，而使用 attachShadow()。

##### setCapture()

将鼠标事件重新定向到指定元素，直到鼠标按钮被释放或者 releaseCapture() 被调用。

```javascript
element.setCapture(retargetToElement);
```

retargetToElement 设置为 true，所有事件被直接定向到这个元素；如果是 false，事件也可以在该元素的子元素上触发。

##### setPointerCapture()

用于将特定元素指定为未来指针事件的捕获目标。指针的后续事件将以捕获元素为目标，直到捕获被释放（通过 releasePointerCapture()）。

##### hasPointerCapture()

返回一个布尔值，表示当前元素是否具有由给定指针 ID 标识的指针的指针捕获。

##### releasePointerCapture()

释放（停止）先前为特定指针设置的指针捕获。

##### animate()（实验性）

用创建新 Animation，将它应用于元素，然后运行动画。它将返回一个新建的 Animation 对象实例。

##### getAnimations()（实验性）

返回一个包含所有影响此元素或计划在将来这样做 Animatable 的对象的数组 ，也可以选择是否返回后代元素的 Animation 对象。

##### computedStyleMap()（实验性）

返回一个 StylePropertyMapReadOnly 接口，该接口提供 CSS 声明块的只读表示，它是 CSSStyleDeclaration。

##### requestPointerLock()（实验性）

异步地请求将鼠标指针锁定在指定元素上。

若想追踪请求成功还是失败，则需要在 Document 级别监听 pointerlockchange 和 pointerlockerror 事件。

### Element事件

使用 addEventListener() 或将事件监听器分配给该接口的 oneventname 属性来监听事件。

##### cancel

当用户指示浏览器关闭当前打开的对话框时触发。如，当用户按下 Esc 键或单击 “关闭对话框” 按钮时，浏览器可能会触发此事件。

##### error

当资源加载失败或无法使用时触发。如，脚本执行错误或图像无法找到或无效。

##### scroll

滚动文档视图或元素时触发。 

##### select

选择某些文本时会触发事件。

**备注：** 该事件不适用于所有语言的所有元素。例如，在 HTML，只能在表单 input、textarea 元素上触发。

##### wheel

当用户转动指向设备（通常是鼠标）上的滚轮按钮时触发。 

##### copy

当用户通过浏览器 UI（如，使用 `Ctrl/⌘ + C` 键盘快捷方式或从菜单中选择“复制”）启动复制操作并响应允许的 `document.execCommand('copy')` 调用时触发。

##### cut

在将选中内容从文档中删除并将其添加到剪贴板后触发。

如果用户尝试对不可编辑内容执行剪切操作，则 cut 事件仍会触发，但事件对象不包含任何数据。

##### paste

当用户在浏览器用户界面发起“粘贴”操作时触发。

如果光标位于可编辑的上下文中（例如，textarea 元素或者 contenteditable 属性为 true 的元素），则默认操作是将剪贴板的内容插入光标所在位置的文档中。

事件处理程序可以通过调用事件的 clipboardData 属性上的 getData() 访问剪贴板内容。如果要覆盖默认行为（例如，插入一些不同的数据或转换剪贴板的内容），必须使用 event.preventDefault() 方法取消默认操作，然后手动插入想要的数据。

##### compositionstart

文本合成系统（如，输入法编辑器）开始新的输入合成时触发。如，当用户使用拼音输入法开始输入汉字。

##### compositionend

当文本段落的构成完成或取消时触发（具有特殊字符的触发，需要一系列键和其他输入，如语音识别或移动中的字词建议）。

##### compositionupdate

当字符被输入到一段文字的时候（这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）触发。

##### focus

当一个元素获取焦点时触发。它和 focusin 事件的主要区别是：focusin 支持冒泡。

##### blur

当一个元素失去焦点时触发。它和 focusout 事件的主要区别是：focusout 支持冒泡。

##### focusin

当一个元素获取焦点时触发。

##### focusout

当一个元素失去焦点时触发。

##### fullscreenchange

当元素进入到或退出了全屏模式时触发。

##### fullscreenerror

当元素进入到或退出了全屏模式**发生错误**时触发。

##### keydown

当键盘按键按下时触发。

##### keypress

当按下一个键并且该键通常会产生一个字符值时触发。

##### keyup

在键盘按键被松开时触发。

> keydown 与 keypress 区别：所有按键均会触发 keydown 事件，无论这些按键是否会产生字符值。
>
> keydown 与 keyup 事件捕获了键盘按键的操作，而 keypress 反映了具体输入某个字符的值。比如，小写 `a` 在keydown 和 keyup 事件中输出的是大写 `A` 的 Unicode 编码 65，但是在 keypress 中输出的就是小写 `a` 的 Unicode 编码 97；而大写 `A` 在这些事件中输出的都是 Unicode 编码 65。
>
> 键盘事件只能由 input、textarea 以及任何具有 contentEditable 或 tabindex="-1" 属性的组件触发。

##### click

在一个元素上单击（按下和放开）一次鼠标的指针设备按钮（通常是鼠标左键）时触发。

##### dblclick

在一个元素上连续单击两次鼠标的指针设备按钮（通常是鼠标左键）时触发。

##### contextmenu

在用户尝试打开上下文菜单时被触发。

该事件通常在鼠标点击右键或者按下键盘上的菜单键时被触发，如果使用菜单键，该上下文菜单会被展示到所聚焦元素的左下角，但是如果该元素是一棵 DOM 树的话，上下文菜单便会展示在当前这一行的左下角。

任何没有被禁用的鼠标右击事件（通过调用事件的 preventDefault() 方法）的元素都可以触发该事件。

##### mousedown

在指针设备按钮**按下**时触发。

##### mouseup

在指针设备按钮**放开**时触发。

##### mouseenter

当指针设备（通常指鼠标）的指针**移动到**元素时触发。

类似 mouseover 事件，两者区别是：mouseenter 不会冒泡，而 mouseover 会。也就是说，当指针从该元素移动到其子元素时，不会触发 mouseenter 事件，但会触发 mouseover 事件。

##### mouseleave

当指针设备（通常是鼠标）的指针**移出**元素时触发。

类似 mouseout 事件，两者区别是：mouseleave 不会冒泡，而 mouseout 会。也就是说，当指针从该元素移动到其子元素时，不会触发 mouseleave 事件，但会触发 mouseout 事件。

##### mouseover

当指针设备（通常指鼠标）的指针**移动到**当前元素或其子元素时触发。当指针从一个元素移入其子元素时也会触发，因为子元素遮盖了父元素的可视区域。

##### mouseout

当指针设备（通常指鼠标）的指针**移出**当前元素或其子元素时触发。当指针从一个元素移入其子元素时也会触发，因为子元素遮盖了父元素的可视区域。

##### mousemove

当指针设备（通常指鼠标）在元素上移动时触发。

##### touchstart

当一个或多个触摸点与触控设备表面**接触**时触发。

##### touchmove

当一个或多个触摸点沿触摸设备表面**移动**时触发。

##### touchend

当一个或多个触摸点沿触摸设备表面**移除**时触发。

##### touchcancel

当一个或多个触摸点沿触摸设备表面**被中断**时触发。中断方式基于特定实现而有所不同，例如， 创建了太多的触摸点。

### HTMLElement对象

HTMLElement 接口表示所有的 HTML 元素。一些 HTML 元素直接实现了 HTMLElement 接口，其它的间接实现 HTMLElement 接口。

#### HTMLElement属性

继承父接口 Element 和 GlobalEventHandlers 的属性  ：

* accessKey： 获取/设置元素访问的快捷键。
* accessKeyLabel（只读）： 返回一个包含元素访问的快捷键的字符串。
* contentEditable： 获取/设置元素的可编辑状态。
* isContentEditable（只读）： 表明元素的内容是否可编辑。
* contextMenu： 设置/获取元素的右键菜单。
* dataset（只读）： 获取元素的自定义属性，是一个对象。
* dir： 获取/设置元素的方向，可选的值有：ltr、rtl、auto。
* hidden： 获取/设置元素是否隐藏。
* lang： 获取/设置元素属性、文本、内容的语言。
* offsetHeight（只读）： 元素可视高度加上上下 border 的宽度。
* offsetWidth（只读）： 元素自身可视宽度加上左右 border 的宽度。
* offsetLeft（只读）： 元素左边框距离父元素左边框或者 body 元素左边框的距离。
* offsetTop（只读）： 元素上边框距离父元素上边框或者 body 元素上边框的距离。
* offsetParent（只读）： 元素的父元素，如果没有就是 body 元素。
* style： 获取/设置元素的 style 属性。
* tabIndex： 获取/设置元素的 tab 键控制次序。
* title： 获取/设置元素的 title 属性。

#### HTMLElement方法

继承父接口 Element 的方法：

* blur()： 元素失去焦点。
* click()： 触发元素的点击事件。
* focus()： 元素获得焦点。

### 相关问题

#### getElementsByClassName 和 querySelectorAll 的区别？

getElementsByClassName 返回一个**即时更新（动态的）**HTMLCollection，querySelectorAll 返回一个**非即时更新（静态的）** NodeList。

HTMLCollection 和 NodeList 都是类数组形式。

```html
<div id="parent">
    <p class="p">1</p>
    <p class="p">2</p>
    <p class="p">3</p>
</div>
```

```javascript
const parent = document.getElementById('parent')
const list1 = parent.getElementsByClassName('p')
const list2 = parent.querySelectorAll('.p')
console.log(list1.length1); // 3
console.log(list2.length1); // 3

const newP = docuemnt.createElement("p")
newP.classList.add('p');
parent.appendChild(newP);
console.log(list1.length1); // 4 (即时更新)
console.log(list2.length1); // 3（非即时更新）
```

### 参考资料

[MDN - Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)

[MDN - HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)