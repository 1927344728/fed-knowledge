## 基础篇：Event对象

Event 接口表示在 DOM 中出现的事件。

事件发生以后，会产生一个 Event 对象，作为参数传给监听函数。浏览器原生提供一个 Event 对象，所有的事件都是这个对象的实例，或者说继承了 Event.prototype 对象。

事件触发场景一般有：

* 由用户触发：如，鼠标或键盘事件。
* 由其他 API 触发：如，动画已经完成运行的事件、视频已被暂停等。
* 由脚本代码触发：如，对元素调用 Element.click() 方法；或者定义一些自定义事件，再使用 EventTarget.dispatchEvent() 方法将自定义事件派发往指定的目标。

有许多不同类型的事件，一些事件的实现是基于 Event 主接口的二次接口。

### 基于 Event 的接口

基于 Event 接口的接口主要有（所有的事件接口名称都是以 `Event` 结尾）：

* UIEvent： 表示简单的用户界面事件。以下接口是 UIEvent 的直接或间接后代：MouseEvent、TouchEvent、 FocusEvent、KeyboardEvent、WheelEvent、InputEvent、CompositionEvent。

* TouchEvent： 描述手指在触摸平面（触摸屏、触摸板等）的状态变化的事件，如，touchstart、touchend、touchmove、touchcancel 事件。

  这类事件用于描述一个或多个触点，使开发者可以检测触点的移动、触点的增加和减少等等。每个 Touch 对象代表一个触点；每个触点都由其位置，大小，形状，压力大小，和目标元素描述。 

* InputEvent（实验性）： 用来构造和字符输入相关的事件对象。
* KeyboardEvent： 描述了用户与键盘的交互。 每个事件都描述了用户与一个按键（或一个按键和修饰键的组合）的单个交互，包括 keydown、keypress、keyup 事件。
* MouseEvent： 指用户与指针设备（如鼠标）交互时发生的事件，如，click、dblclick、mouseup、mousedown。
* PointerEvent： 代表了由指针引发的事件的状态，包括接触点的位置、引发事件的设备类型、接触表面受到的压力等。如，pointerover、pointerenter、pointerdown、pointermove、pointerup、pointercancel、pointerout、pointerleave。
* MessageEvent： 代表一段被目标对象接收的消息。
* HashChangeEvent： 当 URL 中的片段标识符发生改变时触发。片段标识符指 URL 中 # 号和它以后的部分。

* CustomEvent： 是由程序创建的，可以有任意自定义功能的事件。
* ClipboardEvent： 描述了与剪贴板相关信息的事件，包括 cut、copy、paste 事件。
* DragEvent： 一个表示拖、放交互的一个接口。用户通过将指针设备（例如鼠标）放置在触摸表面上并且然后将指针拖动到新位置（如，另一个元素）来发起拖动。 
* FocusEvent： 表示和焦点相关的事件，如，focus、blur、focusin、focusout。
* WheelEvent： 表示用户滚动鼠标滚轮或类似输入设备时触发的事件。
* StorageEvent： 当前页面使用的 storage 被其他页面修改时触发。
* ErrorEvent： 在脚本发生错误时产生，它可以提供发生错误的脚本文件的文件名，以及发生错误时所在的行号等信息。

* BeforeUnloadEvent： 触发于 window、document 和它们的资源即将卸载时。当事件属性 returnValue 被赋值为非空字符串时，会弹出一个对话框，让用户确认是否离开页面（示例如下）。否则，事件被静默处理。一些浏览器实现仅在框架或内置框架接收到用户手势或交互时才显示对话框。

* PageTransitionEvent： 当网页在加载完成或卸载后会触发页面传输事件。

* ProgressEvent： 测量 HTTP 请求（XMLHttpRequest、img、audio、video、style、link 等底层资源的加载）等底层流程进度的事件。

* CloseEvent： 在连接关闭时发送给使用 WebSockets 的客户端。它在 WebSocket 对象的 onclose 事件监听器中使用。

* PopStateEvent：popstate 事件的接口。每当活动历史条目在同一文档的两个历史条目之间发生更改时，都会向窗口发送 popstate 事件。 如果激活的历史条目是通过调用 history. pushstate() 创建的，或者受到了history. replacestate() 的影响，那么 popstate 事件的 state 属性包含了历史条目的 state 对象的副本。 

* SVGEvent：一种与 SVG 相关事件所对应的事件对象接口。

* TimeEvent： 是 SVG SMIL 动画的一部分，提供与时间事件相关的特定上下文信息。

* TransitonEvent（实验性）： 指那些提供了与 transition 有关信息的事件。

* AnimationEvent（实验性）： 表示提供与动画相关的信息的事件。

* BlobEvent： 表示与 Blob 关联的事件，通常是（但不一定）与媒体内容相关联。 

* CompositionEvent：表示用户间接输入文本（如使用输入法）时发生的事件，常用事件有 compositionstart、compositionupdate、compositionend。

* DeviceMotionEvent（实验性）： 为 Web 开发者提供了关于设备的位置和方向的改变速度的信息。

* DeviceOrientationEvent（实验性）： 提供给网页开发者当设备（指手机、平板等移动设备）在浏览页面时物理旋转的信息。

* DeviceProximityEvent（实验性）： 利用设备的近距离感应器提供有关邻近物品的距离信息。

* MutationEvent： 提供特定于对文档对象模型层次结构和节点的修改的事件属性。

  ```javascript
  DOMAttrModified
  DOMAttributeNameChanged
  DOMCharacterDataModified
  DOMElementNameChanged
  DOMNodeInserted
  DOMNodeInsertedIntoDocument
  DOMNodeRemoved
  DOMNodeRemovedFromDocument
  DOMSubtreeModified
  ```

* TrackEvent： 表示对 HTML 媒体元素上一组可用轨道的更改的事件，如，addtrack、removetrack 事件。

* WebContextEvent： 属于 WebGL API 的一部分，同时也是生成用来对 WebGL 渲染上下文作响应的事件接口。
* FetchEvent、GamepadEvent、IDBVersionChangeEvent、MediaStreamEvent...

### Event 对象

Event 对象是监听函数的参数，同时，Event 对象本身就是一个构造函数，可以用来生成新的实例。

```javascript
event = new Event(typeArg, eventInit);
```

参数说明：

* typeArg： 字符串，表示所创建事件的名称。
* eventInit：可接收以下字段：
  * "bubbles"（可选）： 布尔值，默认值为 false，表示该事件是否冒泡。
  * "cancelable"（可选）： 布尔值，默认值为 false， 表示该事件能否被取消。
  * "composed"（可选）： 布尔值，默认值为 false，指示事件是否会在影子 DOM 根节点之外触发侦听器。

```javascript
const ev = new Event("testEvent", {
    "bubbles": true,
    "cancelable": false
});
document.addEventListener('testEvent', event => {
    console.log('testEvent')
}, false);
document.dispatchEvent(ev);
```

### Event属性

##### bubbles（只读）

布尔值，用来表示该事件是否会在 DOM 中冒泡。

##### cancelBubble

是 stopPropagation() 方法的一个曾用名。在从事件处理程序返回之前将其值设置为 true 可阻止事件的传播。

##### cancelable（只读）

布尔值，表示事件是否可以取消，即事件是否可以像从未发生一样被阻止（调用 preventDefault() 方法）。

如果事件不能被取消，则其 cancelable 属性的值为 false，且事件发生时无法在事件监听回调中停止事件。

大部分由用户与页面交互产生的原生浏览器事件都可以被取消。取消 click、wheel、beforeunload 事件将分别阻止用户点击某些元素、滚动页面或跳离页面。

##### composed（只读）

一个布尔值，表示事件是否可以穿过 Shadow DOM 和常规 DOM 之间的隔阂进行冒泡。

##### currentTarget（只读）

对事件当前注册目标的引用，注册目标是指**绑定事件**的对象的引用。这是一个当前计划将事件发送到的对象。它是有可能在重定向的过程中被改变的。

##### target（只读）

对事件原始目标的引用，原始目标是指**触发事件**的对象的引用。

**注意：** currentTarget 总是指向事件**绑定**的元素，而 target 则是事件**触发**的元素。

##### deepPath

返回事件的路径，该路径一个由事件流所经过的 DOM 节点组成的数组。如果影子根是在其关闭 的情况下创建的，则这不包括影子树中的节点。

##### defaultPrevented（只读）

布尔值，表示当前事件是否调用了 preventDefault() 方法。

##### eventPhase（只读）

表示事件流当前处于哪一个阶段。

* 0： Event.NONE，没有事件正在被处理。
* 1： Event.CAPTURING_PHASE，事件正在被目标元素的祖先对象处理。从 Window -> Document -> HTMLHtmlElement -> ... -> 目标元素的父元素。 通过 `EventTarget.addEventListener()` 注册为捕获模式的事件监听函数被调用。
* 2： Event.AT_TARGET，事件对象已经抵达事件目标，为这个阶段注册的事件监听被调用。 如果 `Event.bubbles` 的值为 false，对事件对象的处理在这个阶段后就会结束。
* 3： Event.BUBBLING_PHASE，事件对象逆向向上传播回目标元素的祖先元素。从父亲元素开始，并且最终到达包含元素 Window。这就是冒泡，并且只有 Event.bubbles 值为 true 的时候才会发生。 为这个阶段注册的事件监听函数在这个过程中被触发。

##### returnValue

表示该事件的默认操作是否允许。默认情况下，它被设置为 true，即允许进行默认操作。将该属性设置为 false 即可阻止默认操作。

**注意：** 虽然 returnValue 已被 DOM 标准采用，但它的存在主要是为了支持现有代码。推荐使用preventDefault() 方法，而 defaultPrevented 不是这个历史属性。

##### srcElement（非标准，一般用于 IE）

旧版 IE 对 Event.target 的非标准别称。出于兼容原因，一些其他浏览器也支持此别称。

##### timeStamp（只读）

事件创建时的时间戳（精度为毫秒）。按照规范，这个时间戳是 Unix 纪元起经过的毫秒数，但实际上，在不同的浏览器中，对此时间戳的定义也有所不同。

##### type（只读）

字符串，表示事件的类型，不区分大小写。

##### isTrusted（只读）

表示事件是由浏览器（例如用户点击）发起的，还是由脚本发出的。当事件是由用户行为生成的时候，这个属性的值为 true ，而当事件是由脚本创建、修改、通过 EventTarget.dispatchEvent() 方法派发的时候，这个属性的值为 false。

### Event方法

##### composedPath()

返回事件的路径，该路径一个由事件流所经过的 DOM 节点组成的数组。如果影子根是在其关闭 的情况下创建的，则这不包括影子树中的节点。

#####  preventDefault()

取消事件的默认行为，即告诉浏览器：如果此事件没有被显式处理，它默认的动作也不应该照常执行。

不过，此事件还是可以继续传播，除非碰到事件监听函数调用 stopPropagation()、stopImmediatePropagation() 方法。

##### stopImmediatePropagation()

阻止监听同一事件的其他事件监听器被调用。

如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。如果在其中一个事件监听器中执行 stopImmediatePropagation()，那么剩下的事件监听器都不会被调用。

##### stopPropagation()

阻止捕获和冒泡阶段中当前事件的进一步传播。

但是，它不能防止任何默认行为的发生。例如，对链接的点击仍会被处理，如果要阻止默认行为的发生，需要执行 preventDefault() 方法。

同时，它也不能阻止附加到相同元素的相同事件类型的其它事件处理器，如果要阻止这些处理器的运行，需要执行stopImmediatePropagation() 方法。

### EventTarget接口

EventTarget 是一个 DOM 接口，由可以接收事件、并且可以创建侦听器的对象实现。

Element、Document、window 是最常见的事件目标对象，但是其他对象也可以作为事件目标，比如 XMLHttpRequest、AudioNode、AudioContext 等等。

#### 构造函数

EventTarget() 构造函数用于创建一个新的 EventTarget 对象实例。

```javascript
class MyEventTarget extends EventTarget {
    constructor(mySecret) {
        super();
        this._secret = mySecret;
    }
    get secret() { return this._secret; }
};

const myEventTarget = new MyEventTarget(5);
console.log(myEventTarget.secret); // 5
myEventTarget.addEventListener("foo", e => {
    this._secret = e.detail;
});

const event = new CustomEvent("foo", { detail: 7 });
myEventTarget.dispatchEvent(event);
console.log(myEventTarget.secret); // 7
```

#### EventTarget方法

##### addEventListener()

将指定的监听器注册到事件目标上，当该对象触发指定的事件时，指定的回调函数就会被执行。 

其工作原理是将实现事件监听的函数或对象添加到调用它的事件目标上的指定事件类型的事件侦听器列表中。

```javascript
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```

参数说明：

* type（必传）： 字符串，表示监听事件类型。
* listener（必传）：  一个实现了 EventListener 接口的对象，或者是一个函数。当所监听的事件类型触发时，会接收到一个事件通知（实现了 Event 接口）对象。
* useCapture（可选）： 布尔值，默认为 false。在 DOM 树中，注册了监听函数的元素， 是否要先于它的子元素（也注册了监听函数）调用该监听函数。

* options ：可用的选项如下：
  * capture： 布尔值。在 DOM 树中，注册了监听函数的元素， 是否要先于它的子元素（也注册了监听函数）调用该监听函数。
  * once： 布尔值。表示监听函数在添加之后，是否只调用一次。为 true， 则监听函数会在其被调用之后自动移除。
  * passive： 布尔值。为 true 时，表示监听函数永远不会调用 preventDefault()。如果监听函数仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
  * signal（实验性）： AbortSignal 对象，该对象的 abort() 方法被调用时，监听器会被移除。

##### removeEventListener()

删除事件目标的监听事件。使用事件类型，事件侦听器函数本身，以及可能影响匹配过程的各种可选择的选项的组合来标识要删除的事件侦听器。

```javascript
target.removeEventListener(type, listener[, options]);
target.removeEventListener(type, listener[, useCapture]);
```

参数说明：

* type： 字符串，表示需要移除的事件类型。
* listener： 需要从目标事件移除的事件监听函数。
* useCapture（可选）： 布尔值，默认为 false，指定需要移除的事件监听函数是否为捕获监听器。如果同一个监听事件分别为 “事件捕获” 和 “事件冒泡” 注册了一次，这两次事件需要分别移除。
* options（可选）： 一个指定事件侦听器特征的可选对象。可选项有：
  * capture： 布尔值，表示是否为捕获类型的事件。

##### dispatchEvent()

向一个指定的事件目标**派发**一个事件，并以合适的顺序同步调用目标元素相关的事件处理函数。标准事件处理规则（包括事件捕获和可选的冒泡过程），同样适用于通过手动的使用 dispatchEvent() 方法派发的事件。

**注意：** 与浏览器原生事件不同，原生事件是由 DOM 派发的，并通过事件循环机制，异步调用事件处理程序，而dispatchEvent() 则是同步调用事件处理程序。在调用 dispatchEvent() 后，所有监听该事件的事件处理程序将在代码继续前执行并返回。

### 事件的传播

事件传播是一种描述在 Web 浏览器中触发的事件“堆栈”的方法。

引入事件传播的概念是为了处理 DOM 层次结构中具有父子关系的多个元素具有针对同一事件的事件处理程序，比如，当用户单击内部元素时，将首先处理哪个元素的 click 事件，即外部元素或内部元素的 click 事件。

事件传播有三个阶段：

* 捕获阶段： 事件从 window 开始向下到每个元素，直到到达目标元素。在此阶段，仅调用捕获类型监听器。
* 目标阶段： 事件到达目标元素。在此阶段，将调用在事件目标上注册的所有侦听器，无论其捕获标志的值如何。
* 冒泡阶段： 事件从目标元素向上冒泡，途径每一个元素，直到到达 window。在此阶段，只会调用非捕获类型监听器。

事件冒泡和捕获是事件传播的两种机制：捕获事件首先被最外面的元素捕获并传播到内部元素；冒泡事件首先由最内层元素捕获和处理，然后传播到外层元素。

使用 addEventListener() 方法时，可以使用 `useCapture` 参数指定传播类型：

```javascript
element.addEventListener(event, listener, useCapture)
```

`useCapture` 缺省值为 false，即默认使用冒泡传播（冒泡阶段触发），如果设置为 true，则使用捕获传播（捕获阶段触发）。

[W3C UIEvents 规范](https://www.w3.org/TR/DOM-Level-3-Events/) 的下图说明了三个事件流阶段：

![事件传播](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1495534508eventflow.svg)

DOM 标准事件流的触发的先后顺序为：**先捕获再冒泡**，即当触发 DOM 事件时，会先进行事件捕获，捕获到事件目标之后通过事件传播进行事件冒泡。不同的浏览器对此有着不同的实现，**IE10 及以下不支持捕获型事件**，IE11、Chrome 、Firefox、Safari 等浏览器则同时存在。

**注意：** window 它实际上不是一个 DOM 节点，但它实现了 EventTarget 接口，因此，为简单起见，可以将它视为文档对象的父节点来处理。

**注意：** 并非所有事件都会传播，如，focus、blur、mouseenter、mouseleave 事件不会传播。

### 事件的代理

事件代理，也称为事件委托，就是把一个元素响应事件（click、keydown......）的函数委托到另一个元素。

一般来讲，会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，当事件响应到需要绑定的元素上时，会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数。

DOM 事件委托的实现是利用**事件冒泡的机制**，即触发响应会从最底层目标一层层地向外到最外层。

事件委托的优点：

* **减少内存消耗：** 假设有一个列表，列表之中有 100 个列表项。如果给每个列表项一一都绑定一个事件监听函数，那对于内存消耗是非常大的。相反，如果将点击事件绑定到父层，然后在执行事件的时候再去匹配判断目标元素，就可以减少大量的内存消耗，节约效率。
* **动态绑定事件：** 假设需要通过 JavaScript 或者用户操作动态的增加列表项元素，那么每次新增都需要重新给新增的元素绑定事件。如果采用事件委托，就可以减少很多重复工作的，因为事件是绑定在父层的，和目标元素的增减没有关系，目标元素的事件响应是在父层监听函数中去匹配的。

```html
<ul id="List">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
    <li>Item 6</li>
</ul>
<script>
    document.getElementById("List").addEventListener("click", event => {
        if(event.target && event.target.nodeName === "LI") {
            console.log(event.target.innerHTML)
        }
    });
</script>
```

### 事件类别

发送 DOM 事件是为了将发生的相关事情通知代码。每个事件都是继承自 Event 接口的对象，可以包括自定义的成员属性及函数用于获取事件发生时相关的更多信息。事件可以表示任何从基本的用户交互、到发生在渲染模型自动通知的任何事情。

#### 最常见的类别

* error： 资源加载失败时。
* abort： 正在加载资源已经被中止时。
* load： 资源及其相关资源已完成加载。
* beforeunload： window、document 及其资源即将被卸载。
* unload： 文档或一个依赖资源正在被卸载。
* pagehide： 当浏览器在呈现与会话历史不同的页面的过程中隐藏当前页面时。
* pageshow： 当浏览器由于导航显示窗口的文档时。
* popstate： 当用户浏览会话历史时活动历史条目发生更改时。
* visibilitychange： 当其选项卡的内容变得可见或被隐藏时触发。
* hashchange： 当 URL 的片段标识符发生变化时触发该事件（URL 中以符号 # 开头和之后的部分）。
* readystatechange： 当文档的 readyState 属性发生变化时触发。

#### 键盘事件

* keydown： 当键盘按键按下时触发。
* keypress： 当按下一个键并且该键通常会产生一个字符值时触发。
* keyup： 当键盘按键被松开时触发。

#### 鼠标事件

* click： 在元素上按下并释放任意鼠标按键。
* contextmenu： 右键点击（在右键菜单显示前触发）。
* dblclick： 在元素上双击鼠标按钮。
* mousedown： 在元素上按下任意鼠标按钮。
* mouseenter： 指针移到有事件监听的元素内。
* mouseleave： 指针移出元素范围外（不冒泡）。
* mousemove： 指针在元素内移动时持续触发。
* mouseover： 指针移到有事件监听的元素或者它的子元素内。
* mouseout： 指针移出元素，或者移到它的子元素上。
* mouseup： 在元素上释放任意鼠标按键。
* pointerlockchange： 鼠标被锁定或者解除锁定发生时。
* pointerlockerror： 可能因为一些技术的原因鼠标锁定被禁止时。
* select： 有文本被选中。
* wheel： 滚轮向任意方向滚动。

#### 触摸事件

* touchcancel： 当一个或多个触摸点以特定于实现的方式中断时（如，创建了太多的触摸点）触发。
* touchend： 当触点离开触控平面时触发。
* touchmove： 当触点在触控平面上移动时触发。
* touchstart： 当一个或多个触摸点与触控设备表面接触时触发。

#### 表单事件

* input： 当 input、select、textarea 元素的值已更改时触发。

* reset： 点击重置按钮时。
* submit： 点击提交按钮。

#### 拖放事件

* drag： 正在拖动元素或文本选区（在此过程中持续触发，每 350ms 触发一次）。
* dragend： 拖放操作结束。（松开鼠标按钮或按下 Esc 键）。
* dragenter： 被拖动的元素或文本选区移入有效释放目标区。
* dragstart： 用户开始拖动 HTML 元素或选中的文本。
* dragleave： 被拖动的元素或文本选区移出有效释放目标区。
* dragover： 被拖动的元素或文本选区正在有效释放目标上被拖动（在此过程中持续触发，每 350ms 触发一次）。
* drop： 元素在有效释放目标区上释放。

#### 网络事件

* online： 浏览器已获得网络访问。
* offline： 浏览器已失去网络访问。

#### 焦点事件

* focus： 元素获得焦点（不会冒泡）。
* blur： 元素失去焦点（不会冒泡）。

#### WebSocket事件

* open： WebSocket 连接已建立。
* message： 通过 WebSocket 接收到一条消息。
* error： WebSocket 连接异常被关闭（比如有些数据无法发送）。
* close： WebSocket 连接已关闭。

#### CSS动画事件

* animationstart： 某个 CSS 动画开始时触发。
* animationend： 某个 CSS 动画完成时触发。
* animationiteration： 某个 CSS 动画完成后重新开始时触发。

#### CSS过渡事件

* transitionrun： 在第一次创建 CSS 过渡时触发，即在 transition-delay 开始之前。
* transitionstart： 当 CSS 过渡实际开始时触发，即在 transition-delay 结束之后。
* transitioncancel： 当 CSS 过渡被取消时触发。
* transitionend： 当 CSS 过渡完成时触发。

#### 打印事件

* beforeprint： 打印机已经就绪时触发。
* afterprint： 打印机关闭时触发。

#### 文本写作事件

* compositionstart： 文本合成系统（如，输入法编辑器）开始新的输入合成时触发。如，当用户使用拼音输入法开始输入汉字。
* compositionend： 当文本段落的构成完成或取消时触发（具有特殊字符的触发，需要一系列键和其他输入，如语音识别或移动中的字词建议）。
* compositionupdate： 当字符被输入到一段文字的时候（这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）触发。

#### 视图事件

* fullscreenchange： 元素被切换为全屏模式或恢复到正常模式。 
* fullscreenerror：由于技术上的原因或者因为权限被拒绝的原因无法切换到全屏模式。 
* resize： 文档视图已调整大小。
* scroll： 文档视图或元素滚动时。 

#### 剪贴板事件

* copy： 当用户通过浏览器的用户界面启动复制操作时触发。
* cut： 当用户通过浏览器的用户界面启动剪切操作时触发。
* paste： 当用户通过浏览器的用户界面启动粘贴操作时触发。

#### 媒体事件

* audioprocess： ScriptProcessorNode 的输入缓冲区已经准备好进行处理。 
* canplay： 浏览器可以播放媒体，但可能没有加载足够多的数据，后面可能需要停下来进一步缓冲内容。 
* canplaythrough： 浏览器可以一直播放媒体，而不需要停下来进行内容缓冲。 
* complete：离线音频上下文的渲染完成。 
* durationchange： duration 属性已经更新。
* emptied： 媒体数据为空。例如，如果媒体已经加载（或部分加载），则发送此事件，并调用 load() 方法重新加载。 
* ended： 播放已经停止，因为到达了媒体的末端。 
* loadeddata： 媒体的第一帧已经加载完毕。 
* loadedmetadata： 已加载元数据。
* pause： 播放暂停。
* play： 播放开始。
* playing： 在由于缺少数据而暂停或延迟之后准备开始。 
* ratechange： 播放速率发生变化。
* seeking： 搜索操作开始，这意味着该属性已更改为 true 并且媒体正在搜索新位置。
* seeked：查找操作完成、当前播放位置已更改且 seeking 属性更改为 false 时。
* stalled：试图获取媒体数据，但没有有效数据。 
* suspend： 媒体数据加载已暂停。
* timeupdate： currentTime 属性表示的时间已经更新。 
* volumechange： 音量改变。
* waiting： 由于暂时缺乏数据，播放已停止。 

#### 进度事件

* abort： 进度被终止（不是由于错误）。 
* error:  已失败。
* load： 已成功。
* loadend： 进度已停止（在 error、abort、load 后触发)。 
* loadstart： 开始。
* progress： 进行中。

### 常见问题

#### 如何监听函数？

浏览器的事件模型，就是通过监听函数对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是事件驱动编程模式的主要编程方式。

有三种为事件绑定监听函数的方法：

* HTML 元素的 on- 属性： 

  ```html
  <body onload="doSomething()">
      <div onclick="console.log(1)"></div>
  </body>
  ```

  **注意：** 这些属性的值是将会执行的代码，而不是一个函数。

  ```html
  <!-- 正确 -->
  <body onload="doSomething()">
  
  <!-- 错误 -->
  <body onload="doSomething">
  ```

  **注意：** 使用这个方法指定的监听代码，只会在冒泡阶段触发。

  **注意：** 直接在标签设置 `on-` 属性，与通过元素节点的 setAttribute 方法设置 `on-` 属性，效果是一样的。

* 元素节点的事件属性：

  ```javascript
  window.onload = doSomething;
  div.onclick = function (event) {
      console.log(1);
  };
  ```

  **注意：** 使用这个方法指定的监听代码，只会在冒泡阶段触发。

* 使用 addEventListener() 方法：

  ```javascript
  window.addEventListener('load', doSomething, false);
  ```

#### 通用的事件侦听器函数

事件是用户操作网页时发生的交互动作，如：click、move，事件除了用户触发的动作外，还可以是文档加载，窗口滚动和大小调整。事件被封装成一个 Event 对象，包含了该事件发生时的所有相关信息以及可以对事件进行的操作。

现代浏览器一共有三种事件模型：

* 最早的 DOM0 级事件模型： 这种模型不会传播，所以没有事件流的概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过 Js 属性来指定监听函数。这种方式是所有浏览器都兼容的。

* IE 事件模型： 该事件模型中，一次事件共有两个过程：**事件处理阶段和事件冒泡阶段**。事件处理阶段会首先执行目标元素绑定的监听事件。然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 Document，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。这种模型通过 `attachEvent` 来添加监听函数，可以添加多个监听函数，会按顺序依次执行。

* DOM2 级事件模型：在该事件模型中，一次事件共有三个过程：**事件捕获阶段、事件处理阶段和事件冒泡阶段**。捕获指的是事件从 Document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是 `addEventListener`，其中第三个参数可以指定事件是否在捕获阶段执行。

Chrome、Firefox 同时支持事件冒泡和事件捕获，IE 只支持事件冒泡。

```javascript
const EventUtils = {
    addEvent: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false)
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler)
        } else {
            element["on" + type] = handler
        }
    },

    removeEvent: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false)
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler)
        } else {
            element["on" + type] = null
        }
    },
    getTarget: function(event) {
        return event.target || event.srcElement
    },
    getEvent: function(event) {
        return event || window.event
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    }
}
```

**注意：** addEventListener() 方法在 IE11、Chrome 、Firefox、Safari 等浏览器都得到支持；attachEvent() 方法主要用于 IE 浏览器，并且仅在 IE10 及以下才支持，IE11 已经废了该方法。

### 参考资料

[MDN - Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

[MDN - 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)

[What Is Event Bubbling in JavaScript? Event Propagation Explained](https://www.sitepoint.com/event-bubbling-javascript/)

[JavaScript 事件传播](https://www.cainiaojc.com/javascript/event_propagation.html)