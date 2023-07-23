## 基础篇：window对象

在 JavaScript 中，有一个永远被定义的全局对象，即一个永远存在全局作用域的对象。

在一个 Web 浏览器中，当脚本创建全局变量时，他们作为该全局对象的成员被创建。全局对象的接口取决于脚本在其中运行的执行上下文。

* 在 Web 浏览器中，运行的脚本将 Window 对象作为其全局对象。
* 在 Worker 中，运行的代码将 WorkerGlobalScope 对象作为其全局对象。
* 在 Node.js 环境下，运行的脚本具有一个称为 global 的对象作为其全局对象。

### window对象

Window 对象表示浏览器中打开的窗口。如果文档包含框架（frame、iframe 标签），浏览器会为 HTML 文档创建一个 window 对象，并为每个框架创建一个额外的 window 对象。

window 对象表示一个包含 DOM 文档的窗口，其 document 属性指向窗口中载入的 DOM文档 。使用 `document.defaultView` 属性可以获取指定文档所在窗口。

在有标签页功能的浏览器中，每个标签都拥有自己的 window 对象；也就是说，同一个窗口的标签页之间不会共享一个 window 对象。有一些方法，如 window.resizeTo 和 window.resizeBy 之类的方法会作用于整个窗口而不是 window 对象所属的那个标签。一般而言，如果一样东西无法恰当地作用于标签，那么它就会作用于窗口。

window 作为浏览器的全局对象，代表了脚本正在运行的窗口，暴露给 JavaScript 代码。任何全局变量或者全局函数都可以通过 window  的属性来访问。

**注意：** window 不是 JavaScript 的标准。事件上，window 对象没有公开标准，不过所有浏览器都支持该对象。

### 构造函数

#### DOMParser

DOMParser 构造函数可以将存储在字符串中的 XML 或 HTML 源代码解析为一个 DOM Document。

```javascript
const domParser = new DOMParser();
```

DOMParser 实例的 parseFromString() 方法解析包含 HTML 或 XML 的字符串，返回一个HTMLDocument 或一个 XMLDocument。

```javascript
parseFromString(string, mimeType)
```

string 是要解析的字符串，必须包含 HTML、xml、xhtml+xml 或 svg 文档。

mimeType 是一个字符串，用于确定是使用 XML 解析器还是 HTML 解析器来解析字符串。

mimeType 的有效值有：

- text/html
- text/xml
- application/xml
- application/xhtml+xml
- image/svg+xm

任何其他值都是无效的，将导致一个 TypeError 被抛出。

```javascript
const domParser = new DOMParser();
const doc1 = domParser.parseFromString('<warning>Beware of the tiger</warning>', 'application/xml');
const doc2 = domParser.parseFromString('<circle cx="50" cy="50" r="50"/>', 'image/svg+xml');
const doc3 = domParser.parseFromString('<strong>Beware of the leopard</strong>', 'text/html');

console.log(doc1.documentElement.textContent); // Beware of the tiger
console.log(doc2.firstChild.tagName);          // circle
console.log(doc3.body.firstChild.textContent); // Beware of the leopard
```

#### Image

Image() 构造函数创建一个新 HTMLImageElement 实例，等同于 `document.createElement('img')`。

```javascript
new Image(width, height)
```

width（可选）是图像的**宽**度，即 img 标签的 width 属性的值。

height（可选）是图像的**高**度，即 img 标签的 height 属性的值。

无论构造函数中指定的大小如何，都会加载整个位图。

```javascript
const image = new Image(100, 200);
image.src = '01ik2icdfpfojopdr1h6pq3831.jpg';
document.body.appendChild(image);
```

#### Option()

Option() 构造函数创建一个新的 HTMLOptionElement。

```javascript
new Option(text, value, defaultSelected, selected)
```

text（可选）表示元素内容的字符串，即显示的文本。如果未指定，则使用默认值“”（空字符串）。

value（可选）表示 HTMLOptionElement 的值的字符串 ，即等价 option 标签的 value。如果未指定，则使用 text 的值作为。

defaultSelected（可选）设置元素是否允许默认选中，可选值 true 或 false，默认 false。

selected（可选）设置元素是否默认选中，可选值 true 或 false，默认为 false（未选中）。如果省略，即使 defaultSelected 参数为 true，也不会选择该选项。

```html
<select id='select'></select>
```

```javascript
const select = document.getElementById('select');
const options = ['Four', 'Five', 'Six'];
options.forEach((ele, index) => {
    select[index] = new Option(ele, index, true, index === 1);
});
```

#### Worker()

Worker 接口是 Web Workers API 的一部分，指的是一种可由脚本创建的后台任务，任务执行中可以向其创建者收发信息。要创建一个 Worker ，只须调用 Worker(URL) 构造函数，函数参数 URL 为指定的脚本。

Worker 也可以创建新的 Worker，当然，所有 Worker 必须与其创建者同源（注意：Blink 暂时不支持嵌套 Worker）。 

**注意：** 不是所有函数和构造函数都可以在 Worker 中使用。比如，Worker 可以使用 XMLHttpRequest 发送请求，但是请求的  responseXML 与 channel 两个属性值始终返回 null （fetch 仍可正常使用，没有类似的限制）。 

### window属性

这个接口从 EventTarget 接口继承属性，也从 WindowOrWorkerGlobalScope 和 WindowEventHandlers 这两个 mixin 中继承属性。

* **name：** 获取/设置窗口的名称。在某些框架里，该属性也被用于**跨域通信**。

* **closed：** 只读属性，表示所引用的窗口是否关闭。
* **devicePixelRatio：** 只读属性，返回当前显示设备的物理像素分辨率与设备独立像素的比例。 此值也可以解释为像素大小的比率：一个 CSS 像素的大小与一个物理像素的大小。 简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个 CSS 像素。
* **isSecureContext（实验性）：** 只读属性，返回一个布尔值，表示上下文是否能够使用安全上下文的特征。如果是 HTTPS 协议，就是 true，否则就是 false。
* **console：** 只读属性，返回一个对 Console 对象的引用，console 提供了向浏览器控制台输出日志信息的方法。这些方法仅应该用于调试，并不应该用来给最终用户呈现信息。
* **location：** 只读属性，返回一个 Location  对象，其中包含有关文档当前位置的信息。尽管是一个只读 Location 对象，仍然可以赋给它一个地址，如 `window.location = 'http://www.example.com'` 是 `window.location.href = 'http://www.example.com'` 的同义词 。
* **localStorage：** 只读属性，返回一个可被用于访问当前源的**本地存储空间**的 Storage 对象。
* **sessionStorage：** 只读属性，返回一个可被用于访问当前源的**会话存储空间**的 Storage 对象。
* **navigator：** 只读属性，返回一个 Navigator 对象的引用，用于请求运行当前代码的应用程序的相关信息。
* **history：** 只读属性，返回 History 对象的引用。History 对象提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口。
* **document：** 只读属性，返回对当前窗口所包含文档的引用。
* **customElements：** 只读属性，接口返回一个 CustomElementRegistry 对象的引用，可用于注册新的自定义元素，或者获取之前定义过的自定义元素的信息。
* **frameElement：** 只读属性，返回嵌入窗口（iframe、object 等）的**元素**，如果未嵌入窗口，则返回 null。
* **frames：**  只读属性，返回当前窗口中所有**子窗体**的数组。
* **length：** 只读属性，返回当前窗口中包含的框架数量（框架包括 frame 和 iframe 两种元素）。
* **fullScreen（非标准）：** 此属性表示窗口是否以全屏显示。
* **innerHeight：** 只读属性，返回浏览器窗口的视口（viewport）**高**度（以 px 为单位）；如果有**水平**滚动条，也包括滚动条高度。
* **innerWidth：** 只读属性，返回浏览器窗口的视口（viewport）**宽**度（以 px 为单位）；如果有**垂直**滚动条，也包括滚动条高度。
* **outerHeight：** 只读属性，返回整个浏览器窗口外部的**高**度（以 px 为单位），包括侧边栏、窗口镶边和调正窗口大小的边框。

* **outerWidth：** 只读属性，返回整个浏览器窗口外部的**宽**度（以 px 为单位），包括侧边栏、窗口镶边和调正窗口大小的边框。

* **pageXOffset、scrollX：**  只读属性，返回文档在水平方向滚动的像素值。

  **注意：** 为了跨浏览器兼容性，请使用 pageXOffset  代替 scrollX。另外，旧版本的 IE（<9）两个属性都不支持，必须通过其他的非标准属性来解决此问题。

* **pageYOffset、scrollY：**  只读属性，返回文档在垂直方向滚动的像素值。

  **注意：** 为了跨浏览器兼容性，请使用 pageYOffset  代替 scrollY。另外，旧版本的 IE（<9）两个属性都不支持，必须通过其他的非标准属性来解决此问题。

* **screenX（非标准）、screenLeft：** 只读属性，返回浏览器左边界到操作系统桌面左边界的水平距离。
* **screenY（非标准）、screenTop：** 只读属性，返回浏览器左边界到操作系统桌面左边界的水平距离。
* **opener：** 返回对打开当前窗口的那个窗口的引用。如，window A 中打开 window B，则 B.opener 返回 A。
* **parent：** 只读属性，返回当前窗口或子窗口的父窗口的引用。如果一个窗口没有父窗口，则为自身的引用；如果当前窗口是一个 iframe、object、frame，则为嵌入它的那个窗口。
* **self：** 只读属性，返回一个指向当前 window 对象的引用。
* **top：** 只读属性，返回窗口层级最顶层窗口的引用。
* **window：** 只读属性，返回 window 对象本身的引用。
* **locationbar：** 只读属性，返回一个 locationbar 对象引用，可以检查其 visibility 属性。
* **menubar：** 只读属性，返回一个 menubar 对象引用，可以检查其 visibility 属性。
* **performance：** 只读属性，返回 performance API 的引用。Web Performance API 允许网页访问某些函数来测量网页和 Web 应用程序的性能，包括 Navigation Timing API和高分辨率时间数据。
* **crypto：** 只读属性，返回与全局对象关联的 Crypto 对象。 Crypto 接口提供了基本的加密功能，可用于当前的上下文中。它允许访问一个密码强度的随机数生成器和密码原文。
* **screen：** 只读属性，返回 screen 对象的引用。screen 对象实现了 Screen 接口，它是个特殊的对象，返回当前渲染窗口中和屏幕有关的属性。
* **personalbar：** 只读属性，返回 personalbar 对象的引用，其可见性可以在窗口中切换。
* **scrollbars：** 只读属性，返回一个 scrollbars 对象引用，可以检查其 visible 属性。

* **speechSynthesis：** 只读属性，返回一个 SpeechSynthesis 对象的引用。
* **statusbar：** 只读属性，返回一个 statusbar 对象引用，可以检查其 visible 属性。
* **toolbar：** 只读属性，返回一个 toolbar 对象引用，可以检查其 visible 属性。
* **visualViewport（实验性）：** 只读属性，返回一个 VisualViewport 对象。该对象表示给定窗口的可视视口。

### window方法

这个接口继承了 EventTarget 接口的方法，并实现了 WindowOrWorkerGlobalScope 和 EventTarget 的方法。

* **alert()：** 显示一个警告对话框，上面显示有指定的文本内容以及一个 "确定" 按钮。

* **blur()：** 用于将焦点移出顶层窗口，与用户主动将焦点移出顶层窗口本质上是一样的。

* **cancelAnimationFrame()（实验性）：** 用于取消之前通过调用 requestAnimationFrame() 方法添加到计划中的动画帧请求。

* **cancelIdleCallback()（实验性）：** 用于取消之前调用 requestIdleCallback() 方法的回调。

* **clearImmediate()（非标准）：** 用于清除 setImmediate() 设置的回调函数。

* **close()：** 关闭当前窗口或某个指定的窗口。该方法只能由 open() 方法打开的窗口的 window 对象来调用。如果一个窗口不是由脚本打开的，那么，在调用该方法时，JavaScript 控制台会出现类似下面的错误：

  ```javascript
  Scripts may not close windows that were not opened by script. 
  ```

  同时也要注意，对于由 HTMLIFrameElement.contentWindow 返回的 Window 对象，close() 也没有效果。

* **confirm()：** 显示一个具有一个可选消息和两个按钮（确定和取消）的模态对话框 。返回一个布尔值，表示是选择确定还是取消。

* **find()：** 用于在窗口中搜索给定的字符串。如果搜索到指定的字符串，则返回 true，否则返回 false。

  ```javascript
  window.find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog);
  ```

  aString 是将要搜索的字符串。

  aCaseSensitive 是布尔值。如果为 true，表示搜索是区分大小写的。

  aBackwards 是布尔值。如果为 true，表示搜索方向为向上搜索。

  aWrapAround 是布尔值。如果为 true，表示为循环搜索。

  aWholeWord（未实现）是布尔值。如果为 true，表示采用全字匹配搜索。

  aSearchInFrames 是布尔值。如果为 true，表示会搜索 frame 框架内的文本。

  aShowDialog 是布尔值。如果为 true，则会弹出一个搜索对话框。

* **focus()：** 用于将焦点设置在当前窗口上。会将窗口显示在前（靠近屏幕），但可能由于用户设置而失败，并且该窗口在方法返回之前不能保证会显示在最前。

* **getComputedStyle()：** 返回一个对象。该对象在应用活动样式表并解析这些值可能包含的任何基本计算后，报告元素的所有 CSS 属性的值。 私有的 CSS 属性值可以通过对象提供的 API 或通过简单地使用 CSS 属性名称进行索引来访问。

  ```javascript
  window.getComputedStyle(element, [pseudoElt]);
  ```

  pseudoElt（可选）指定一个要匹配的伪元素的字符串，但必须对普通元素省略（或 null）。

* **getSelection()：** 返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置。与 Document.getSelection() 方法等价。

  **注意：** 目前在 Firefox、Edge（非 Chromium 版本）、IE 中，该方法 对 textarea、input 元素不起作用。HTMLInputElement.setSelectionRange() 或 selectionStart 及 selectionEnd 属性可用于解决此问题。

* **matchMedia()：** 返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。返回的MediaQueryList 可用于判定 Document 是否匹配媒体查询，或者监控一个document 来判定它匹配了或者停止匹配了此媒体查询。

* **minimize()：** 让当前浏览器窗口最小化（仅限顶级 XUL 窗口），可以通过调用 window.moveTo() 方法让窗口恢复正常显示。

* **moveBy()：** 根据指定的值，移动（相对）当前窗口。

  **注意：** 不能移动非 window.open 创建的窗口或 Tab；当一个窗口里有多于一个 Tab 时，不能移动该窗口。

* **moveTo()：** 将当前窗口移动（绝对）到指定的坐标位置。

  **注意：** 不能移动非 window.open 创建的窗口或 Tab；当一个窗口里有多于一个 Tab 时，不能移动该窗口。

* **open()：** 用指定的名称将指定的资源加载到浏览器上下文（window、iframe、tab ）。如果没有指定名称，则一个新的窗口会被打开，并且指定的资源会被加载进这个窗口的浏览器上下文中。

  ```javascript
   window.open(url, name, [features]，replace);
  ```

  url 是新窗口需要载入的 url 地址。

  name 指定 target 属性或窗口的名称（并不是新窗口的标题），不能含有空白字符。

  name 支持以下值：

  - _blank：URL加载到一个新的窗口。这是默认
  - _parent：URL加载到父框架
  - _self：URL替换当前页面
  - _top：URL替换任何可加载的框架集
  - name：窗口名称

  features（可选） 是一个列出新窗口的特征（大小、位置、滚动条等）的字符串。字符串中不能包含任何空白字符，特性之间用逗号分隔开。

  **注意：** 如果定义了 features 参数，那么没有在这个字符串中列出的特性会被禁用或移除 （除了 titlebar 和 close 默认设置为 yes）。

  features 的参数有：

  * left=pixels： 该窗口的左侧位置。
  * top=pixels（仅限 IE 浏览器）：窗口顶部的位置。
  * width=pixels：窗口的宽度，最小值为 100。
  * height=pixels： 窗口的高度。最小值为 100。
  * location=yes|no|1|0：是否显示地址字段，默认值是 yes。
  * menubar=yes|no|1|0：是否显示菜单栏，默认值是 yes。
  * resizable=yes|no|1|0：是否可调整窗口大小，默认值是 yes。
  * scrollbars=yes|no|1|0：是否显示滚动条，默认值是 yes。
  * status=yes|no|1|0：是否要添加一个状态栏，默认值是 yes。
  * titlebar=yes|no|1|0：是否显示标题栏，默认值是 yes。通常被忽略，除非调用 HTML 应用程序或一个值得信赖的对话框。
  * toolbar=yes|no|1|0：是否显示浏览器工具栏，默认值是 yes。
  * channelmode=yes|no|1|0（仅限 IE 浏览器）： 是否要在影院模式显示 window。默认是没有的。
  * directories=yes|no|1|0（仅限 IE 浏览器）： 是否添加目录按钮。默认是肯定的。
  * fullscreen=yes|no|1|0（仅限 IE 浏览器）： 浏览器是否显示全屏模式。默认是没有的。在全屏模式下的 window，还必须在影院模式。

  replace 是一个布尔值，指定装载到窗口的 URL 是在窗口的浏览历史中创建一个新条目，还是替换浏览历史中的当前条目。

* **postMessage()：** 用于实现安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面是同域时，这两个脚本才能相互通信。postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

  从广义上讲，一个窗口可以获得对另一个窗口的引用（如，targetWindow = window.opener），然后在窗口上调用 targetWindow.postMessage() 方法分发一个  MessageEvent 消息。接收消息的窗口可以通过监听 message 事件，来根据需要自由处理此事件。

* **print()：** 打开打印对话框以打印当前文档。

* **prompt()：** 显示一个对话框，对话框中包含一条文字信息，用来提示用户输入文字。

* **requestAnimationFrame()：** 告诉浏览器——希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

* **requestIdleCallback()（实验性）：** 用于插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

* **resizeBy()：** 以**相对**于窗口当前大小来调整该窗口的大小。

  **注意：** 不能移动非 window.open 创建的窗口或 Tab；当一个窗口里有多于一个 Tab 时，不能移动该窗口。

* **resizeTo()：** 以**绝对**大小方式调整窗口的大小。

  **注意：** 不能移动非 window.open 创建的窗口或 Tab；当一个窗口里有多于一个 Tab 时，不能移动该窗口。

* **scroll()：** 滚动窗口至文档中的特定位置。

* **scrollBy()：** 在窗口中按指定的偏移量滚动文档。

* **scrollByLines()（非标准）：** 按给定的行数滚动文档。

* **scrollByPages()（非标准）：** 在当前文档页面按照指定的页数翻页。

* **scrollTo()：** 滚动到文档中的某个坐标。该函数实际上和 scroll() 是一样的。

* **setCursor()（非标准）：** 在当前窗口中改变光标（鼠标）的样子。

* **setImmediate()（非标准）：** 用来把一些需要长时间运行的操作放在一个回调函数里，在浏览器完成后面的其他语句后，就立刻执行这个回调函数。

* **sizeToContent()（非标准）：** 根据窗口内容调整窗口大小。 为了使其工作，在调用此函数时应加载 DOM 内容。例如，在 DOMContentLoaded 事件。

* **stop()：** 相当于点击了浏览器的停止按钮。由于脚本的加载顺序，该方法不能阻止已经包含在加载中的文档，但是它能够阻止图片、新窗口、和一些会延迟加载的对象的加载。

* **updateCommands()（非标准）：** 更新当前 chrome 窗口（UI）的命令状态。

* **addEventListener()：** 将指定的监听器注册到 EventTarget 上，当该对象触发指定的事件时，指定的回调函数就会被执行。 事件目标可以是一个文档上的元素 Element、Document、Window 或者任何其他支持事件的对象（如，XMLHttpRequest）。

  ```javascript
  target.addEventListener(type, listener, options);
  target.addEventListener(type, listener, useCapture);
  ```

  type 表示监听事件类型的字符串。

  listener 是一个实现了 EventListener 接口的对象，或者是一个函数。当所监听的事件类型触发时，会接收到一个事件通知（实现了 Event 接口的对象）对象。

  options（可选）是一个指定有关 listener 属性的可选参数对象。

  options 可用的选项有：

  * capture:  布尔值，表示监听函数会在该类型的事件的捕获阶段还是冒泡阶段触发。
  * once:  布尔值，表示监听函数是否在添加之后最多只调用一次。如果是 true，监听函数会在其被调用之后自动移除。
  * passive: 布尔值，设置为 true 时，表示监听函数永远不会调用 preventDefault()。如监听函数仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

  useCapture  是一个布尔值，表示在 DOM 树中，注册了监听函数的元素是否要先于它下面的 EventTarget 调用该监听函数。 如果为 true，沿着 DOM 树向上冒泡的事件，不会触发监听函数。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件。 如果没有指定， 默认为 false。 

* **removeEventListener()：** 删除使用 addEventListener() 方法添加的事件。使用事件类型，事件侦听器函数本身，以及可能影响匹配过程的各种可选择的选项的组合来标识要删除的事件侦听器。

* **atob()：** ASCII to binary，用于将 ASCII 码解析成 binary 数据，即 Base64 的解码过程。

* **btoa()：** binary to ASCII，用于将 binary 的数据用 ASCII 码表示，即 Base64 的编码过程。从 String 对象中创建一个 base-64 编码的 ASCII 字符串，其中字符串中的每个字符都被视为一个二进制数据字节。

* **setInterval()：** 重复调用一个函数或执行一个代码片段，在每次调用之间具有固定的时间间隔。

* **clearInterval()：** 取消先前通过调用 setInterval() 方法设置的重复定时任务。

* **setTimeout()：** 设置一个定时器，该定时器在定时器到期后执行一个函数或指定的一段代码。

* **clearTimeout()：** 取消先前通过调用 setTimeout() 方法设置的定时器任务。

* **createImageBitmap()：** 接受各种不同的图像来源，并返回一个 Promise，解析为 ImageBitmap。

  ```javascript
  createImageBitmap(image[, options]).then(function(response) { ... });
                                                               createImageBitmap(image, sx, sy, sw, sh[, options]).then(function(response) { ... });
  ```

  image 是一个图像源，可以是一个 img、SVG、video、canvas、HTMLImageElement、SVGImageElement、HTMLVideoElement、HTMLCanvasElement、Blob、ImageData、ImageBitmap、OffscreenCanvas 对象。
  sx 是裁剪点 x 坐标；sy 是裁剪点 y 坐标；sw 是裁剪宽度，值可为负数；sh 是裁剪高度，值可为负数。

  options （可选）是设置选项的对象，可用的选项有：

  - imageOrientation：指示图像是按原样呈现还是垂直翻转，默认值 none（不翻转），还可以是 flipY。
  - premultiplyAlpha：指示位图颜色通道由 alpha 通道预乘，可选值有：none、premultiply、default（默认）。
  - colorSpaceConversion：指示图像是否使用色彩空间转换进行解码，可选值有：none、default（默认，表示使用特定实现的行为。
  - resizeWidth：指示新宽度的长整数。
  - resizeHeight：指示新高度的长整数。
  - resizeQuality：指定图像缩放算法，可选值有：pixelated、low（默认）、medium、high。

* **fetch()：** 用于发起获取资源的请求，返回一个 promise，会在请求响应后被解析，并传回 Response 对象。

### window事件

window 可以使用 addEventListener() 或通过将事件监听器分配给此接口的属性来监听事件。

#### 全局事件

* **error：** 当资源加载失败或无法使用时触发。如，脚本执行错误或图像无法找到或无效、script 执行时报错。

* **languagechange：** 当用户的首选语言更改时触发。

* **orientationchange（已弃用）：** 当设备的方向改变时触发。

* **devicemotion：** 以固定间隔触发，指示设备正在接收的物理加速度的大小和旋转速率。

* **deviceorientation：** 在方向传感器输出新数据的时候触发。其数据系传感器与地球坐标系相比较所得，也就是说在设备上可能会采用设备地磁计的数据。

* **resize：** 调整窗口大小时触发。这是一个高频事件，因此事件处理程序不应该执行计算开销很大的操作。

* **storage：** 当会话存储或本地存储发生变化时触发。

  **注意：** 该事件不在导致数据变化的当前页面触发（如果浏览器同时打开一个域名下面的多个页面，当其中的一个页面改变 sessionStorage 或 localStorage 的数据时，其他所有页面的  storage  事件会被触发，而原始页面并不触发 storage 事件）。

#### 动画事件

* **animationcancel（实验性）：** 当动画意外中止时触发。换句话说，任何时候它停止运行时触发。这可能发生在更改、删除动画或使用 CSS 隐藏动画节点时。
* **animationend：** 当动画正常完成时触发。如果动画在完成之前中止，如，从 DOM 中删除元素或从元素中删除动画，则不会触发事件。
* **animationiteration：** 当动画迭代完成时触发，即，当一个 CSS 动画迭代结束并且另一个动画开始时触发。此事件不会与 animationend 事件同时发生，因此 `animation-iteration-count：1` 的动画不会发生。
* **animationstart：** 当动画开始时触发。如果有 `animation-delay`，则在延迟期到期后将触发此事件；如果是负值，则以其绝对值延迟触发。

#### 剪贴板事件

* **copy：** 当用户通过浏览器的用户界面启动**复制**操作时触发。
* **cut：** 当用户通过浏览器的用户界面启动**剪切**操作时触发。
* **paste：** 当用户通过浏览器的用户界面启动**粘贴**操作时触发。

#### 连接事件

* **offline：** 当浏览器失去对网络的访问权并且 navigator.onLine 的值切换为 false 时触发。
* **online：** 当浏览器获得对网络的访问权并且 navigator.onLine 的值切换为 true 时触发。

#### 焦点事件

* **blur：** 当元素失去焦点时触发。
* **focus：** 当元素获得焦点时触发。

#### 游戏手柄事件

* **gamepadconnected：** 当浏览器检测到游戏手柄已连接或第一次使用游戏手柄的按钮/轴时触发。
* **gamepaddisconnected：** 当浏览器检测到游戏手柄已断开连接时触发。

#### 历史事件

* **hashchange：** 当 URL 的片段标识符（以 `#` 符号开头和之后的部分）发生更改时触发。

* **pagehide：** 当浏览器在切换到显示与会话历史记录不同的文档的过程中隐藏当前文档时发送。如，当用户单击 “后退” 按钮或单击 “前进” 按钮以在会话历史中向前移动时，就会发生这种情况。

* **pageshow：** 当浏览器由于导航任务使文档可见时触发，包括以下情况：

  * 初始加载页面
  * 从同一窗口或选项卡中的另一个页面导航到该页面
  * 在移动操作系统上恢复冻结页面
  * 使用浏览器的前进或后退按钮返回页面

* **popstate：** 当活动的历史条目改变时触发。

  如果当前处于激活状态的历史记录条目是由  history.pushState() 方法创建的或者是由 history.replaceState() 方法修改的，则 popstate 事件的 state 属性包含了这个历史记录条目的 state 对象的一个拷贝。

  **注意：** 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。popstate 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者调用 history.back() 等方法）。即，在同一文档的两个历史记录条目之间导航会触发该事件。

#### 加载和卸载事件

* **beforeunload：** 当窗口、文档及其资源即将被卸载时触发该事件。文档仍然可见，此时事件仍然可以取消。

  此事件使网页能够触发确认对话框，询问用户是否真的要离开该页面。如果用户确认，浏览器导航到新页面，否则取消导航。

  根据规范，为了显示确认对话框，事件处理程序应该调用 preventDefault()。  

  为了避免不必要的弹出窗口，浏览器可能不会显示在卸载前事件处理程序中创建的提示，除非与页面进行了交互，或者甚至根本不显示它们。  

  HTML规范指出，在此事件期间，对 window.alert()、window.confirm() 和 window.prompt() 方法的调用可能被忽略。  

* **DOMContentLoaded：** 在文档完全加载和解析后触发，无需等待样式表、图像和子框架完成加载。

* **load：** 在整个页面加载后触发，包括所有依赖资源，例如样式表图像。

* **unload：** 在卸载文档或子资源时触发。

  文档处于以下状态：

  * 所有资源仍然存在（img、iframe 等）
  * 终端用户看不到任何东西
  * UI 交互无效（window.open、alert、confirm等）
  * 错误不会停止卸载工作流程

  **注意：** 具备弹窗阻止功能的浏览器会忽略 onunload  事件回调中调用的 Window.open() 方法。

  **注意：** onunload 特性（乃至 unload 事件本身）并非使用 sendBeacon() 的正确途径，要调用 sendBeacon() 接口，应当使用 visibilitychange 和 pagehide 事件。 

#### 清单事件

* **appinstalled：** 当网页应用成功安装为渐进式网页应用时立即触发。
* **beforeinstallprompt：** 当用户即将安装 Web 应用程序时触发。

#### 消息事件

* **message：** 当窗口收到消息时触发。如，window.postMessage() 来自另一个浏览上下文的调用。

* **messageerror：** 当 Window 对象收到无法反序列化的消息时触发。

#### 打印事件

* **afterprint：** 在相关文档开始打印或打印预览关闭后触发。
* **beforeprint：** 当相关文档即将打印或预览打印时触发。

#### promise 拒绝事件

* **rejectionhandled：** 每当 JavaScript Promise 被拒绝，但 Promise rejection 处理之后，该事件就会被发送到脚本的全局范围。
* **unhandledrejection：** 每当 JavaScript Promise 被拒绝，但没有处理程序来捕获拒绝时触发。

#### 过渡事件

* **transitioncancel：** 当 CSS 过渡取消时触发。
* **transitionend：** 当 CSS 过渡完成时触发。
* **transitionrun：** 当 CSS 过渡首次创建时触发。
* **transitionstart：** 当 CSS 过渡实际开始时触发。

### 事件处理程序

事件处理程序是窗口对象的属性，可以为窗口中可能发生的各种可能感兴趣的事情建立事件处理程序。

从 EventTarget 和 WindowEventHandlers 接口继承事件处理程序。

* **onload：** 在所有资源和 DOM 完全加载后触发，也可用于处理 Window、XMLHttpRequest、img 等元素的加载。当页面从缓存加载时不会被调用，例如使用后退按钮。
* **onunload：** 当用户离开页面或关闭窗口资源和内容的时候触发。

* **onbeforeunload：** 在窗口卸载前触发。此时页面文档依然可见，且该事件的默认动作可以被取消。

* **onabort：** 当资源的加载被中止时触发。如，用户的加载仍在进行时取消加载。

* **oncontextmenu：** 在按下鼠标右键时触发。 除非阻止默认行为，否则浏览器上下文菜单将被激活。

* **onerror：** 当资源加载失败或运行时发生错误时触发，用于处理 error 的事件。

  Error 事件的事件处理程序，在各种目标对象的不同类型错误被触发：

  * 当 JavaScript 运行时错误（包括语法错误）发生时。
  * 当一项资源（如 img、script）加载失败时，加载资源的元素会触发 error 事件，并执行该元素上的 onerror() 处理函数。这些 error 事件不会向上冒泡到 window，不过能被单一的 window.addEventListener('error') 捕获。

  由于历史原因，window.onerror 和 element.onerror 接受不同的参数。

* **onresize：** 在调整窗口大小时连续触发。
* **onstorage：** 当会话存储或本地存储发生变化时触发。

* **onblur：** 在窗口或元素失去焦点后触发。例如，弹出窗口。

* **onchange：** 在窗口或元素发生 change 事件时触发。

* **onclick：** 在窗口或元素发生点击事件时触发。

* **ondblclick：** 在窗口或元素发生双击事件时触发。

* **onfocus：** 当窗口或元素获得焦点时触发。

* **onhashchange：** 当井号 (`#`) 之后的 URL 部分更改时触发。

* **oninput：** 当 input、select、textarea 元素的值改变时触发。它还会在 contenteditable 或 designMode 属性开启的元素上触发。

* **onselect：** 在选择输入字段中的文本后触发。只有在文本框和文本域内选择文本才会触发。

* **onreset：** 在用户点击表单中的 reset 按钮（`<input type="reset"/>`）时触发。

* **onsubmit：** 在用户点击提交按钮（`<input type="submit"/>`）提交表单时触发。

* **onkeydown：** 当用户按下键盘上的按键时触发。

* **onkeypress：** 当用户键盘任意键处于按下位置时触发。

  **注意：** 有些浏览器不会触发某些键的 kerpress 事件，如，基于 webkit 的浏览器（Google Chrome、Safari）不会触发方向键的 keypress 事件、Firefox 不会触发 SHIFT 等修改键的 keypress 事件。

* **onkeyup：** 当用户释放键盘上的按键时触发。

* **onmousedown：** 当按下任何鼠标按钮时触发。

* **onmousemove：** 当鼠标在窗口内移动时连续触发。

* **onmouseout：** 当指针离开窗口时触发。

* **onmouseover：** 当指针进入窗口时触发。

* **onmouseup：** 释放任何鼠标按钮时触发。

* **onpopstate：** 每当激活同一文档中不同的历史记录条目时触发。

* **onscroll：** 当滚动条通过任何方式移动时触发。如果资源完全适合窗口，则无法调用此事件。

* **onwheel：** 当鼠标滚轮绕任意轴旋转时触发。

  **注意：** 不要将 onscroll 与 onwheel 混淆。onwheel 是鼠标滚轮旋转，而 onscroll 处理的是对象内部内容区的滚动事件。

* **onselectionchange：** 当一个 selectstart 事件被触发时触发。比如，在页面上选中文字变化时。

* **onafterprint：** 当打印对话框关闭时触发，即在被用户打印结束或者中止打印窗口的情况下触发。

* **onbeforeprint：** 当打开打印对话框时触发。

* **unhandledrejection：** 每当 JavaScript Promise 被拒绝，但没有处理程序来捕获拒绝时触发。

* **onrejectionhandled：** 每当 JavaScript Promise 被拒绝，但 Promise rejection 处理之后，该事件就会被发送到脚本的全局范围。

* **onappinstalled：** 当网页应用成功安装为渐进式网页应用时立即触发。

* **onbeforeinstallprompt：** 当用户即将安装 Web 应用程序时触发。

* **onclose（实验性）：** 用来处理 dialog 元素的关闭事件。

* **ondevicemotion（移动设备）：** 以固定间隔触发，指示设备正在接收的物理加速度的大小和旋转速率。

* **ondeviceorientation（移动设备）：** 在方向改变时触发，包含了设备的相对旋转方向改变信息。

* **ongamepadconnected（实验性）：** 在连接游戏手柄时触发。

* **ongamepaddisconnected（实验性）：** 在游戏手柄断开连接时触发。

* **onlanguagechange（实验性）：** 当用户首选语言更改时触发。

* **onmessage（实验性）：** 当窗口接收到 message 事件时触发。

* **onpaint（实验性）：** 在窗口上绘制时触发。

### 相关问题

#### 为什么 JavaScript 的 atob()  和 btoa() 这样命名？

atob()，ASCII to binary，用于将 ASCII 码解析成 binary 数据，即 Base64 的解码过程。

btoa()，binary to ASCII，用于将 binary 的数据用 ASCII 码表示，即 Base64 的编码过程。

ASCII 是 base64 编码的结果，仅由可以正确表示和传输的 ASCII 字符子集（A-Za-z0-9+/=）组成的安全文本。

binary 是任何 0 和 1 的流。在 JavaScript 中，它必须用字符串类型表示。

binary 是 JavaScript 字符集的另外一个子集，它类似于 ASCII 字符集，但是字符的码点不再限制到 127， 它包含了 255 以内的字符。binary 字符串设计的目的不是用于代表字符，而是代表二进制数据。由 binary 字符串代表的二进制数据大小是原始数据的两倍，然而这对于最终用户是不可见的， 因为 JavaScript 字符串的长度是以 2 字节为单位进行计算的。比如， “Hello world” 属于 ASCII 子集，而 ÀÈÌÒÙ 不属于 ASCII 码，但属于 binary。

```javascript
window.btoa('base64编码_解码') // Uncaught DOMException: Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.

encodeURIComponent('base64编码_解码')
// 'base64%E7%BC%96%E7%A0%81_%E8%A7%A3%E7%A0%81'
window.btoa(encodeURIComponent('base64编码_解码'))
// 'YmFzZTY0JUU3JUJDJTk2JUU3JUEwJTgxXyVFOCVBNyVBMyVFNyVBMCU4MQ=='

window.atob('YmFzZTY0JUU3JUJDJTk2JUU3JUEwJTgxXyVFOCVBNyVBMyVFNyVBMCU4MQ==')
// 'base64%E7%BC%96%E7%A0%81_%E8%A7%A3%E7%A0%81'
decodeURIComponent('base64%E7%BC%96%E7%A0%81_%E8%A7%A3%E7%A0%81')
// 'base64编码_解码'
```

#### window.error 和 window.addEventListener('error') 区别

window.onerror 含有详细的 error 信息（如：error.stack），而且兼容性更好，所以一般 JavaScript 运行时错误使用 window.onerror 捕获处理。

window.addEventListener('error') 可以捕获 JavaScript 运行时的错误，也能捕获资源加载错误。为避免重复上报 JavaScript 运行时错误，此时应该只有 `event.srcElement inatanceof HTMLScriptElement、HTMLLinkElement、HTMLImageElement` 时才上报。

### 参考资料

[MDN - Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window#event_handlers)

