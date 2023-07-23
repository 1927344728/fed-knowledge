## HTML常见问答

#### src、href、URL 有什么区别？

* **src：** source的缩写，指向外部资源的位置，**指向的内容将会嵌入到文档中当前标签所在位置**。

  在请求 src 资源时会将其指向的资源下载并应用到文档内。当浏览器解析到该元素时，**会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕**。如`script, img, frame`。用作 "拿取"。

* **href：** Hypertext Reference 的缩写，指向网络资源所在位置。

  建立资源与当前元素（锚点）或当前文档（链接）之间的链接。浏览器可以识别文档，就会并行下载资源并且**不会停止对当前文档的处理。**如`link, a`等标签。用作 "连结前往"。

* **URL：** Uniform Resource Locator 的缩写，表示统一资源定位符，是互联网上标准资源的地址。

  互联网上的每个文件都有一个唯一的 URL，它包含的信息指出文件的位置以及浏览器应该怎么处理它。通用的 "连结" 的专业代名词，在 HTML 语法里几乎不会使用。

#### URL后面带"/"与不带"/"有什么区别？

URL 带 "/" 与不带 "/" 是两个不同的概念。不带 "/" 就是一个文件，带 "/" 就是一个目录。**对于 SEO 优化而言，带斜杠的链接是非常有必要的。**

`Domain/abc` 表示的是根目录下的 `abc` 文件，而 `Domain/abc/` 指的是 `abc` 目录下的 `default` 文件（一般是指 `index` 文件，服务器可自定义）。

当搜索引擎蜘蛛爬取 `Domain/abc`  时，首先是到根目录下去读取 `abc` 文件，找不到 `abc` 文件后会自动的读取根目录下 `abc` 目录下的``default`文件

而当搜索引擎蜘蛛爬取  `Domain/abc/`   时，是直接到根目录下 `abc` 目录直接读取该目录下的 `default` 文件。在同样资源的情况下，能节省读取时间，对 SEO 优化是非常必要的。

#### textContent、innerText、innerHTML 有什么区别？

textContent 是 Node 接口的属性，设置或获取一个节点及其后代的文本内容。

innerText 是 HTMLElement 接口的属性，设置或获取一个节点及其后代的 **“渲染”** 文本内容。

innerHTML 是 Element 接口的属性，设置或获取元素的后代 HTML。

主要不同点：

* innerText 只有 HTML 元素才可以调用，但是 textContent 任意 Node 节点都可以。即：HTMLElement.innerText、Node.textContent。
* innerText 会保留块级元素的换行特性，以换行符形式（'\n'）呈现。

* textContent 会获取所有元素的内容，包括 script、style 元素。
* innerText 只展示给人看的元素（即不会获取 script、style 元素），并且受 CSS 样式的影响，不会返回子节点中隐藏（如，display: none）元素的文本。
* 由于 innerText 受 CSS 样式的影响，它会触发回流去确保是最新的计算样式，而回流在计算上可能会非常昂贵，因此应尽可能避免。
* 在 IE（<= 11 的版本） 中对 innerText 进行修改，不仅会移除当前元素的子节点，而且还会永久性地破坏所有后代文本节点。在之后不可能再次将节点再次插入到任何其他元素或同一元素中。
* 使用 innerHTML 可能受到 XSS 攻击。

**推荐：** 使用 textContent 属性代替 innerText 属性获取文本内容。innerText 属性存在诸多特别的特性、以及兼容性差异，以及性能方面问题。

**推荐：** 如果仅是修改 DOM 元素的文字内容，使用 textContent 属性而不是 innerHTML 属性。操作 textContent 属性性能会更高一点。

HTMLElement.innerText：设置或获取节点及其子节点的呈现文本内容。**注意：** 如果子节点是不可见（如，display: none），则忽略子节点。

#### 元素的 alt 和 title 属性有什么区别？

**alt 属性：** 规定在图像无法显示时的替代文本。

用于在图像无法显示或者用户禁用图像显示时，代替图像显示在浏览器中的内容。`alt` 属性只能用在 `img、area、input` 元素中（包括 applet 元素）。对于 `input` 元素，`alt` 属性意在用来替换提交按钮的图片。如：

```html
<input type="image" src="image.gif" alt="Submit" />
```

**title 属性：** 规定关于元素的额外信息。这些信息通常会在鼠标移到元素上时显示一段工具提示文本。

title 属性常与 `form、a` 元素一同使用，以提供关于输入格式和链接目标的信息。同时它也是 `abbr、acronym` 元素的必需属性。当然 title 属性是比较广泛使用的，可以用在除了 `base、basefont、head、html、meta、param、script、title` 之外的所有标签。但是并不是必须的。

title 属性有一个很好的用途，即为链接添加描述性文字，特别是当连接本身并不是十分清楚的表达了链接的目的。这样就使得访问者知道那些链接将会带他们到什么地方，他们就不会加载一个可能完全不感兴趣的页面。

另外一个潜在的应用就是为图像提供额外的说明信息，比如日期或者其他非本质的信息。

> 当用户把鼠标移动到 img 元素上时，Internet Explorer 会显示出 alt 属性的值。这种行为并不正确。所有其他的浏览器正在向规范靠拢，只要当图像无法显示时，才会显示出替代文本。

#### Canvas 和 SVG 有什么区别？

Canvas 是一种通过 JavaScript 来绘制 2D 图形的方法。Canvas 是逐像素来进行渲染的，因此当我们对 Canvas 进行缩放时，会出现锯齿或者失真的情况。

SVG 是一种使用 XML 描述 2D 图形的语言。SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。我们可以为某个元素附加 JavaScript 事件监听函数。并且 SVG 保存的是图形的绘制方法，因此当 SVG 图形缩放时并不会失真。

#### attribute 和 property 有什么区别？

attribute 是 Dom 元素在文档中作为 html 标签拥有的属性；

property 就是 Dom 元素在 js 中作为对象拥有的属性。

对于 html 的标准属性来说，attribute 和 property 是同步的，是会自动更新的，但是对于自定义的属性来说，他们是不同步的。

#### disabled 和 readonly 有什么区别？

* **readonly：** 表示元素为只读； 只能用于 `input(text/passward)、textarea` 元素；只是使文本框不能输入，外框没有变化；
* **disabled：** 表示禁用元素；可用于所有表单元素；会使文本框变灰。

将表单以 POST 或 GET 的方式提交的话，使用了 `disabled` 后，这个元素的值不会被传递出去，而 `readonly` 会将该值传递出去。

但，无论元素设置的是 `readonly` 还是 `disabled` 属性，通过 JS 脚本都能更改元素的 value。

#### Flash、Ajax 各自的优缺点？（??lizhao）

**Flash：** 优点：适合处理多媒体、矢量图形，兼容性，客户端资源调度；缺点：对CSS、处理文本上不足，不容易被搜索，flash 文件通常会很大，用户第一次使用的时候需要忍耐较长的等待时间 ，性能较差。

**Ajax：**对CSS、文本支持很好，支持搜索；多媒体、矢量图形、机器访问不足。

**共同点：**与服务器的无刷新传递消息、用户离线和在线状态、操作DOM。

#### 网页验证码是干嘛的，是为了解决什么安全问题？

* 区分用户是计算机还是人的公共全自动程序。可以防止恶意破解密码、刷票、论坛灌水；
* 有效防止黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试。

#### 浏览器是如何解析 CSS 选择器？

```css
.content_box div p a {}
```

* 首先找到页面所有的 `<a>` 元素；

* 然后向上找到被 `<p>` 元素包裹的 `<a>` 元素；

* 向上查找到一直到 `.content_box` 的元素。

由上可以，越靠右的选择器越具有唯一性，浏览器解析 CSS 属性的效率就越高。

#### HTML5 的 form 的自动完成功能是什么？

 autocomplete 属性规定输入字段是否应该启用自动完成功能。默认为启用，设置为 autocomplete=off 可以关闭该功能。

自动完成允许浏览器预测对字段的输入。当用户在字段开始键入时，浏览器基于之前键入过的值，应该显示出在字段中填写的选项。

autocomplete 属性适用于 form，以及下面的 input 类型：text、search、url、telephone、email、password、datepickers、range、color。