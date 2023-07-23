## 基础篇：History、URL、Screen、Navigator、Location对象

### History对象

History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。

window 对象通过 history 对象提供了对浏览器的会话历史的访问。它暴露了很多有用的方法和属性，允许你在用户浏览历史中向前和向后跳转，同时——从 HTML5 开始——提供了对 history 栈中内容的操作。

#### History属性

* **length：** 只读属性，返回一个整数，该整数表示会话历史中元素的数目，包括当前加载的页。
* **scrollRestoration：** 滚动恢复属性，允许 Web 应用程序在历史导航上显式地设置默认滚动恢复行为。可接收值：auto，表示将恢复用户已滚动到的页面上的位置；manual，表示不还原页面上的位置。用户必须手动滚动到该位置。
* **state：** 只读属性，返回一个表示历史堆栈顶部的状态的值。这是一种可以不必等待 popstate 事件而查看状态的方式。**注意：** 如果不是 pushState() 或 replaceState() 调用，state 的值将会是 null。

#### History方法

##### back()

在会话历史记录中向后移动一页。与用户点击浏览器**回退**按钮的效果相同。

**注意：** 当浏览器会话历史记录处于第一页时，调用此方法没有效果，也不会报错。

##### forward()

在会话历史中向前移动一页。与用户点击浏览器**前进**按钮的效果相同。

**注意：** 当浏览器历史栈处于最顶端时（当前页面处于最后一页时），调用此方法没有效果，也不会报错。

##### go()

通过当前页面的相对位置从浏览器历史记录（会话记录）加载页面。

go() 方法载入到会话历史中的某一特定页面， 通过与当前页面相对位置来标志（当前页面的相对位置标志为 0；-1 表示上一页；1 表示下一页。当整数参数超出界限时，则没有任何效果，也不会报错。

**注意：** history.go(0) 相当于刷新当前页面。如果是之前访问过的页面，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页。

```javascript
window.history.go(-1); // 等同 window.history.back();
window.history.go(1);  // 等同 window.history.forward();
window.history.go(0);  // 刷新页面
window.history.go();   // 刷新页面
```

##### pushState()

按指定的数据、名称和 URL，将一条历史记录 push 进会话历史栈。

```javascript
pushState(state, unused)
pushState(state, unused, url)
```

state 是任何可以序列化的 JavaScript 对象（有大小限的制，比如 firefox 为 16M），通过 pushState() 创建新的历史记录条目。无论什么时候用户导航到新的状态，popstate事件就会被触发，且该事件的 state 属性包含该历史记录条目状态对象的副本。

unused 是不能省略的，在此处传一个空字符串可以安全的防范未来这个方法的更改，或者，也可以为传一个短标题。该参数因历史原因而存在，未来也可能会用到。

url（可选的）是新历史条目的 URL。该参数是可选的，缺省为当前URL。

```javascript
window.onpopstate = function (e) {
    console.log(e)
}
setTimeout(() => {
    history.pushState({ a: 1, b: 2 }, 'abcd', 'a.html')
}, 3000)
```

如果需要读取当前历史记录项的 state，不需要等待 popstate 事件， 只需要访问 history.state。

**注意：** 如果要在 onpopstate 事件获取 e.state，则至少两次 pushState()。因为，当执行 pushState() 时，将一个新状态推入历史堆栈，它成为当前状态，而 onpopstate 事件意味着顶部历史状态正在被弹出，因此 e.state 现在将指向堆栈中新的新顶部状态，也就是  pushState() 之前的 URL。

**注意：** 调用 pushState() 后浏览器并不会立即加载这个 URL，只是地址栏有变化，但可能会在稍后某些情况下加载，比如，在用户重新打开浏览器时。

**注意：** 新 URL 可以为绝对路径，也可以为相对路径。当作为绝对路径时，新 URL 必须与当前 URL 同源，否会抛出一个异常；当作为相对路径时，是相对于当前 URL 处理。

在某种意义上，调用 pushState() 与设置 window.location = "#hash" 类似，二者都会在当前页面创建并激活新的历史记录。但 pushState() 具有如下几条优点：

*  pushState() 的新 URL 可以是与当前 URL 同源的任意 URL 。
*  pushState() 的新 URL 可以与当前 URL 相同，而 window.location = "#hash" 仅当新 hash 与 hash 不同时，才能创建新的历史记录项。
*  pushState() 可以将任意数据和新的历史记录项相关联；而基于 has 的方式是把相关数据编码为字符串。 

**注意：** pushState() 不会触发 hashchange 事件，即使新的 URL 与旧的 URL 仅 hash 不同也是如此。

##### replaceState()

按指定的数据、名称和 URL，更新历史栈上最新的入口。

replaceState() 与 pushState() 非常相似，区别在于 replaceState() 是修改了当前的历史记录项而不是新建一个。 

#### History事件

##### popstate

每当活动的历史记录项发生变化时，popstate 事件都会被传递给 window 对象。如果当前活动的历史记录项是被 pushState 创建的，或者是由 replaceState 改变的，那么 popstate 事件的状态属性 state 会包含一个当前历史记录状态对象的拷贝。

**注意：** 调用 pushState() 或者 replaceState() 不会触发 popstate 事件。popstate 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者 history.back()）。另外，只有在同一文档的两个历史记录条目之间导航才会触发该事件，比如，pushState() 或者 replaceState() 新增或更新的历史记录，或者添加 hash。也就是说，如果加载的是不同文档或者当前文档重载了，该事件不会触发。

### URL对象

URL API 是一个 URL 标准的组件，它定义了有效的 Uniform Resource Locator 和访问、操作 URL 的 API。URL 标准还定义了像域名、主机和 IP 地址等概念。

#### URL对象

URL() 构造函数返回一个新创建的 URL 对象，表示由一组参数定义的 URL。

```javascript
new URL(url [, base])
```

url 是一个表示绝对或相对 URL 的字符串。如果是相对的，则会以 base 作基准；如果是绝对的，则无论 base 是否存在，都将被忽略。

base（可选）是一个表示基准 URL 的字符串，默认为 ''。只在 url 是相对 URL 时起效。

```javascript
new URL('https://www.example.com/path/index.html?a=1&b=1#hash')
// hash: "#hash"
// host: "www.example.com"
// hostname: "www.example.com"
// href: "https://lizhao:aabbcc@www.example.com/path/index.htm?a=1&b=2#hash"
// origin: "https://www.example.com"
// password: "aabbcc"
// pathname: "/path/index.htm"
// port: ""
// protocol: "https:"
// search: "?a=1&b=2"
// searchParams: URLSearchParams {}
// username: "lizhao"
```

**注意：** 如果给定的基本 URL 或生成的 URL 不是有效的 URL 链接，则会抛出一个 TypeError。

#### URL方法

* **createObjectURL()：** 创建一个字符串，包含一个指定对象（File 对象、Blob 对象或者 MediaSource 对象）的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。

  在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 revokeObjectURL() 方法来释放。

* **revokeObjectURL()：** 销毁 createObjectURL() 方法创建的 URL 对象。

#### URL实例属性

* **hash**： URL 的 `#`  + 片段标识符（hash）；没有，则返回空字符串。
* **host**： URL 域名（即主机名）+ `:` + URL 的端口号。
* **hostname**： URL 域名。
* **href**： 完整 URL 的字符串。
* **origin**： 只读属性，URL 的协议名 + ``://`` + 域名 + 端口号。
* **password**： URL 域名前面指定的密码；没有，则返回空字符串。
* **pathname**： URL 中以 `/` 起头的 URL 文件路径。
* **port**： URL 端口号。
* **protocol**：URL 协议名 + `:`。
* **search**： URL 有参数，则 `?` + 所有参数；没有参数则为空字符串。
* **searchParams**： 只读属性，URLSearchParams 对象，可用于访问 search 中找到的各个查询参数。
* **username**： URL 域名前面指定的用户名；没有，则返回空字符串。

#### URL实例方法

* toString()： 返回完整 URL 的字符串，与 href 属性相同的字符串。
* toJSON()：返回完整 URL 的字符串，与 href 属性相同的字符串。

#### URLSearchParams对象（实验性）

URLSearchParams 接口定义了一些实用的方法来处理 URL 的查询字符串。

URLSearchParams 构造器创建并返回一个新的 URLSearchParams 对象，参数中 开头的 `?` 会被忽略。

```javascript
const urlObj = new URL('https://lizhao:aabbcc@www.example.com/path/index.htm?a=1&b=2#hash')

const searchObj1 = new URLSearchParams(urlObj.search)
const searchObj2 = new URLSearchParams('?a=1&b=2')
const searchObj3 = new URLSearchParams([["a", 1], ["b", 2]]);
const searchObj4 = new URLSearchParams({ a: 1, b: 2 });
```

**注意：** URLSearchParams 构造函数不会解析完整 URL，但是如果字符串起始位置有 `?` 的话会被忽略。

URLSearchParams 可用的方法有：

* **append()：** 插入一个指定的键/值对作为新的查询参数。
* **delete()：** 从查询参数列表里删除指定的查询参数及其对应的值。
* **get()：** 获取指定查询参数。如果有多个，则返回第一个的值。
* **getAll()：** 获取指定查询参数的所有值，返回是一个数组。
* **has()：** 返回一个布尔值，判断是否存在此查询参数。
* **set()：** 更新一个查询参数的新值。如果原来有多个值，将删除其他所有的值。
* **sort()：** 按键名排序。
* **entries()：** 返回一个 iterator 对象，包含了键/值对的所有对象。
* **keys()：** 返回一个 iterator 对象，包含了键/值对的所有键名。
* **values()：** 返回一个 iterator 对象，包含了键/值对的所有值。
* **toString()：** 返回查询参数组成的字符串，可直接使用在 UR L上。

### Screen对象

Screen 接口表示一个屏幕窗口，往往指的是当前正在被渲染的 window 对象，可以使用 window.screen 获取它。 

screen 对象实现了 Screen 接口，它是个特殊的对象，返回当前渲染窗口中和**屏幕**有关的属性。

**注意：** 由浏览器决定提供屏幕对象，此对象一般通过当前浏览器窗口活动状态动态检测来得到。

#### Screen属性

* **availTop：** 返回浏览器可用空间上边距离屏幕（系统桌面）上边界的距离（单位：像素）。大多数情况下，该属性返回 0。

* **availLeft：** 返回浏览器可用空间左边距离屏幕（系统桌面）左边界的距离（单位：像素）。大多数情况下，该属性返回 0。

  如果在有两个屏幕的电脑上使用该属性，在右侧屏幕计算该属性值时，返回左侧屏幕的宽度（单位：像素），也即左侧屏幕左边界的 X 坐标。

  在 Windows 中，该属性值取决于哪个屏幕被设为主屏幕，返回相对于主屏幕左边界的 X 坐标。也就是说，即使主屏幕不是左侧的屏幕，它的左边界的 X 坐标也是返回 0。如果副屏幕在主屏幕的左侧，则它拥有负的 X 坐标。

* **availHeight：** 返回浏览器窗口在屏幕上可占用的垂直高度（单位：像素）。

* **availWidth：** 返回浏览器窗口在屏幕上可占用的水平宽度（单位：像素）。

* **height：** 返回屏幕的高度（单位：像素）。

* **width：** 返回屏幕的宽度（单位：像素）。

  **注意：** height/width 返回的高度/宽度值并不是全部对浏览器窗口可用。任务栏或其他特殊的程序窗口，可能会减少浏览器窗口和其他应用程序能够利用的空间。

  **注意：** IE 会考虑缩放设置。只有当缩放比例为 100% 时，IE 才会返回真实的屏幕高度/宽度。

* **colorDepth：** 返回屏幕的颜色深度。根据 CSSOM 视图，为兼容起见，该值总为 24。

* **pixelDepth：** 返回屏幕的位深度/色彩深度。根据 CSSOM 视图，为兼容起见，该值总为24。

* **orientation（实验性）：** 只读属性，返回当前屏幕的方向。

* **left（非标准）：** 返回从主屏幕左侧到当前屏幕左侧的距离（单位：像素）。

* **top（已弃用）（非标准）：** 返回与当前屏幕顶部的距离（单位：像素）。

#### Screen方法

* **lockOrientation()：** 把屏幕锁定为指定的方向（仅在全屏或者已安装的 APP 中生效）。如果方向被授权锁定，则返回 true；如果被拒绝，则返回 false。**注意：** 返回值并不表示屏幕方向确实被锁定，可能会有延迟。

  ```javascript
  window.screen.lockOrientation(orientation)
  ```

  orientation 是需要锁定屏幕的方向。这个参数是一个字符串或者是一个由字符串组成的数组（让屏幕只在选定的方向上进行旋转）。

  可接收值有：

  * portrait-primary： 表示屏幕处于主要的肖像模式时的方向。如果设备处于正常位置且该位置处于纵向位置，或设备的正常位置处于横向并且设备保持顺时针转动 90°，则会在主肖像模式下考虑屏幕。正常的位置是依赖于设备的。
  * portrait-secondary： 表示屏幕处于辅助肖像模式时的方向。如果设备与正常位置保持 180°，并且该位置处于纵向位置，或者设备的正常位置处于横向位置，并且持有的设备逆时针转动90°，则屏幕将处于辅助人像模式。正常的位置是依赖于设备的。
  * landscape-primary： 代表了屏幕处于主要风景模式时的方向。 如果设备保持在正常位置，并且该位置处于横向位置，或者设备的正常位置处于纵向位置，并且所保持的设备顺时针旋转 90°，则会将其视为主要横向模式。正常的位置是依赖于设备的。
  * landscape-secondary： 代表了屏幕处于次要风景模式时的方向。如果设备与其正常位置保持 180°并且该位置处于横向，或者如果设备的正常位置是纵向的，并且所保持的设备逆时针旋转 90°，则将其视为次要横向模式。正常的位置是依赖于设备的。
  * portrait： 表示同时包含 portrait-primary、portrait-secondary。
  * landscape： 表示同时包含 landscape-primary、landscape-secondary。
  * default： 代表 portrait-primary、landscape-primary 主要取决于设备的自然方向。例如，如果面板分辨率为 1280 * 800，则为横向；如果为 800 * 1280，则为纵向。

* **unlockOrientation()（已弃用）：** 解锁屏幕转向（仅在全屏或者已安装的APP中生效）。

### Navigator对象

Navigator 接口表示用户代理的状态和标识。它允许脚本查询它和注册自己进行一些活动。

#### Navigator属性

* **userAgent：** 只读属性，返回当前浏览器的用户代理字符串 。基于检测用户代理字符串的浏览器识别是**不可靠**的，因为用户代理字符串是用户可配置的。

* **cookieEnabled：** 只读属性，返回一个布尔值，来表示当前页面是否启用了 cookie。

* **language：** 只读属性，返回一个表示用户首选语言的字符串。通常是浏览器 UI 的语言，如，zh-CN、en、en-US、fr、fr-FR、es-ES 等。 

* **geolocation：** 只读属性，返回一个 Geolocation 对象，通过这个对象可以访问到设备的位置信息。使网站或应用可以根据用户的位置提供个性化结果。

  **注意：** 出于安全考虑，当网页请求获取用户位置信息时，用户会被提示进行授权。

  **注意：** 不同浏览器在请求权限时有不同的策略和方式。Windows 10 在未开启定位的情况下无法获取位置。

* **maxTouchPoints：** 返回当前设备能够支持的最大同时触摸的点数。

* **onLine：** 只读属性，返回一个布尔值，表示浏览器的在线状态。可以通过监听 window.online 和 window.offline 事件来查看网络状态的变化。

  浏览器以不同的方式实现此属性：比如，在 Chrome 和 Safari 中，如果浏览器无法连接到局域网或路由器，则它处于离线状态；所有其他条件返回 true。因此，可以认为返回 false 时，浏览器时处于脱机状态，但不能认为返回 true 时，浏览器一定能访问互联网。

* **permissions（实验性）：** 只读属性，返回一个 Permissions 对象，用于查询和更新 Permissions API 涵盖的 API 的权限状态。

* **serviceWorker：** 只读属性，返回 ServiceWorkerContainer 对象，用于提供对 ServiceWorker 的注册、删除、升级和通信的访问。

  ```javascript
  // 查看剪贴板【读】权限
  navigator.permissions.query({name:'clipboard-read'}).then(function(result) {
      if (result.state === 'granted') {
          console.log('granted')
          return
      }
      if (result.state === 'prompt') {
          console.log('prompt')
          return
      }
      console.log('fail')
  })
  ```

* **hardwareConcurrency：** 只读属性，返回可用于在用户计算机上运行线程的逻辑处理器的数量 。

* **platform：** 只读属性，返回一个字符串，标识用户浏览器运行的平台。

* **storage：** 只读属性，返回 StorageManager 对象，一个可访问当前站点或应用程序的浏览器整体存储功能的单例对象 ，用于检查和配置数据存储的持久性，并大致了解您的浏览器有多少空间可用于本地存储。

  **注意：** 仅在安全上下文（HTTPS）、部分或所有支持的浏览器中可用。

* **connection（实验性）：** 只读属性，提供一个 NetworkInformation 对象来获取设备的网络连接信息，包括 downlink（网络下行速度）、effectiveType（网络类型）、onchange（有值代表网络状态变更）、rtt（估算的往返时间）、saveData（打开/请求数据保护模式）。

* **doNotTrack（实验性）：** 返回用户浏览器的 `do-not-track` 设置，如果用户不允许网站、内容和广告等进行跟踪，则该值为 yes。

* **keyboard（实验性）：** 只读属性，返回一个 Keyboard 对象，该对象提供对检索键盘布局图和切换从物理键盘的按键捕获的功能的访问。

* **languages（实验性）：** 只读属性，返回代表用户首选语言的字符串数组 。language 属性是数组中的第一个元素。当用户的首选语言发生变化时，会触发 languagechange 事件。  

* **mediaCapabilities（实验性）：** 只读属性，返回一个 MediaCapabilities对象，用于公开有关媒体功能 API定义的给定格式和输出功能的解码和编码功能的信息。

* **webdriver（实验性）：** 只读属性，返回布尔值一，表示用户代理是否由自动化控制。

* **mimeTypes（已弃用）：** 只读属性，返回一个 MimeTypeArray 对象，包含浏览器识别和支持的 MIME 类型的对象列表。如果浏览器支持 PDF 内联查看，则它具有 MIME 类型 `application/pdf` 和 `text/pdf`；否则返回一个空 MimeTypeArray。

* **plugins（已弃用）：** 只读属性，返回一个 PluginArray 对象，列出应用程序中安装的插件。

* **product（已弃用）：** 在任意浏览器下都只返回 `Gecko`，此属性只用于兼容的目的。

* **oscpu：** 返回一个字符串，代表当前所使用的操作系统类型。

#### Navigator方法

* **sendBeacon()：** 可用于通过 HTTP POST 将少量数据 异步传输到 Web 服务器。sendBeacon() 主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如：XMLHttpRequest）发送分析数据的一些问题（页面卸载时，中断 XMLHttpRequest 请求）。

  sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，这意味着：

  * 数据发送是可靠的。
  * 数据异步传输。
  * 不影响下一导航的载入。

  ```javascript
  document.addEventListener('visibilitychange', function logData() {
      if (document.visibilityState === 'hidden') {
          navigator.sendBeacon('/log', analyticsData);
      }
  });
  ```

* **javaEnabled()：** 返回布尔值，表明浏览器是否支持 Java。

* **vibrate()：** 使设备（有震动硬件）产生有频率的震动。若设备不支持震动，该方法将无效。若某震动方式已经在进行中（当该方法调用时），则前一个震动方式停止，新的取而代之。

  若因为提供无效的参数使设备无法震动，它将返回 false，否则返回 true。若振动方案导致长时间的震动，它会被截断：最大震动时长取决于每个浏览器的具体实现。

  ```javascript
  // 单位：ms
  window.navigator.vibrate(200);
  window.navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
  ```

* **share（实验性）：** 调用本机的共享机制作为 Web Share API 的一部分。如果不支持 Web Share API，则此方法为 undefined。

### Location对象

Location 接口表示其链接到的对象的位置。Document 和 Window 接口都有这样一个链接的 Location，分别通过 Document.location 和 Window.location 访问。

#### Location属性

* **href**： 整个 URL 的字符串，允许修改 href 来更新页面。
* **protocol**： URL 协议 + `:`。
* **origin**： 只读属性，页面来源的域名的标准形式字符串，即，URL 协议 + `://` + 域名 + `:` + URL 端口号。
* **host**： URL 域（主机）名 + `:` + URL 端口号。
* **hostname**： URL 域（主机）名。
* **port**： URL 端口号。如果 URL 不包含明确的端口号，则为空字符串.
* **pathname**： URL 路径部分，以 `/` 开头。如果没有路径，则为空字符串。
* **search**： URL 的查询参数字符串，以 `?` 开头。
* **hash**： URL 的片段标识符（hash）的字符串，以 `#` 开头。如果没有片段标识符，则为空字符串。
* **username（已弃用）**： URL 中域名前的用户名。
* **password（已弃用）**： URL 中域名前的密码。

#### Location方法

* **reload()**：刷新当前页面，就像点击 ”刷新“ 按钮一样。

  Firefox 对于该方法支持一个非标准的 boolean 参数 ，当值为 true 时，将强制 Firefox 从服务器加载页面资源。但是在其他浏览器中任何参数都是无效的。

  boolean 参数并不是标准规范，实际上，它从未成为 location.reload() 的规范。

* **assign()**： 触发窗口加载并显示指定的 URL 的内容。

  **注意：** 因违反安全规则（如，非同源 URL）导致的赋值失败，浏览器会抛出 SECURITY_ERROR 类型异常。

  **注意：** 如果 URL 无效，浏览器会抛出 SYNTAX_ERROR 类型异常。

* **replace()**： 用给定的 URL 替换掉当前的资源。与 assign() 方法不同的是，replace() 替换的新页面不会被保存在会话的历史 History中，这意味着用户将不能用后退按钮转到该页面。

* **toString()**： 返回整个 URL 的字符串，是 href 属性的只读版本。

### 相关问题

#### histosy.back() 和 history.go(-1) 有什么区别？

~~网上有说法~~：go(-1) 返回上一页，原页面表单中的内容会丢失；back() 返回上一页，原页表单中的内容会保留。

在 Chrome 实测发现：无论是 go(-1) 还是 back()，原页表单中的内容都会保留；退回原页面时，都不会重新加载资源。

### 参考资料

[MDN - History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

[MDN - History](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

[MDN - URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

[MDN - URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

[MDN - Screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen)

[MDN - Navigator](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator)

[MDN - Location](https://developer.mozilla.org/zh-CN/docs/Web/API/Location)