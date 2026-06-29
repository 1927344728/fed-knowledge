## 聊一聊Cookie的一些问题

**Cookie 是站点为了保存访客的一些信息，用来区分用户或者传递信息**。在 Session 出现之前，基本上所有的网站都采用 Cookie 来区分用户身份。

Web 应用程序是使用 HTTP 协议传输数据的。HTTP 协议是无状态的协议。一旦数据交换完毕，客户端与服务器端的连接就会关闭（HTTP 1.0 及以前），再次交换数据需要建立新的连接。Cookie 是一种是在客户端保持 HTTP 状态的方案，用来唯一标识一个用户，同时记录该用户的状态。

Cookie 主要用于以下三个方面：

* 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）；
* 个性化设置（如用户自定义设置、主题等）；
* 浏览器行为跟踪（如跟踪分析用户行为等）。

> 注意：Cookie 功能需要浏览器的支持。
>
> 如果浏览器不支持 Cookie 或者把 Cookie 禁用了，Cookie 机制就会失效。比如，Chrome 启用或禁用：在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据。

### Cookie是什么？

从本质上说，Cookie 就是存储在用户主机浏览器中的一小段文本文件。Cookies 是纯文本形式，它们不包含任何可执行代码，就其本身而言不是有害。一个 Web 页面或服务器告之浏览器来将这些信息存储并且基于一系列规则在之后的每个请求中都将该信息返回至服务器，然后 Web 服务器可以利用这些信息来标识用户。

* Chrome 的 Cookie 数据文件位于：`%LOCALAPPDATA%\Google\Chrome\User Data\Default\ Cookies`。如：`C:\Users\[whoami]\AppData\Local\Google\Chrome\User Data\Default\Cookies`。

  在用户[whoami]文件夹中，**AppData通常是隐藏的。**window 10下，点开查看 -> 勾中【隐藏的项目】。

* Chrome 开发者工具中查看：F12 -> Application -> Cookies -> [website]

* Chrome 设置中查看：在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据 -> 所有 Cookie 和网站数据。

### Cookie工作原理

**Cookie 使用 HTTP Header 传递数据。** 

Cookie机制定义了两种报头：`Set-Cookie` 和 `Cookie` 。`Set-Cookie` 包含于 Web 服务器的响应头中，Cookie 包含在客户端请求头中。

Cookie 的运行过程具体分析如下：

* 客户端在浏览器的地址栏中键入 Web 服务器的 URL，浏览器发送读取网页的请求。 

* 服务器接收到请求后，产生一个 `Set-Cookie` 信息，放在响应头中一起回传客户端，发起一次会话。 

* 客户端接到响应后，若要继续该次会话，则将 `Set-Cookie` 中的内容取出，形成一个 Cookies 文件储存在客户端计算机里。

* 当客户端再次向服务器发出请求时，浏览器先在电脑里寻找对应该网站的 Cookies 文件。如果找到，则根据此 Cookies 产生 Cookie 信息，放在 HTTP 请求头中发给服务器。**这些是浏览器自动做的，而且每一次 HTTP 请求都会自动带上 Cookie。**

* 服务器接收到包含 Cookie 信息的请求，检索 Cookie 中与用户有关的信息，生成一个客户端所请示的页面响应传递给客户端。 

### Cookie的属性

Cookie 由一个名称（name）、一个值（value）和其它几个用于控制 Cookie 有效期、安全性、使用范围的可选属性组成，但对服务端而言，它只需要 **name=value 值**。

Cookie 属性名称**不区分大小写**，比如：DOMAIN 和 domain、secure 和 SECURE。

Cookie 的 name 值一般是**区分大小写**的，但有些语言可能进行了封装，也可不区分大小写。比如：

* ASP：`response.cookies("aa") ` 与  `response.cookies("AA") ` 是指的同一个 Cookie。
* JavaScript：`document.cookie = "aa=1"` 和 `document.cookie = "AA=2"` 是两个 Cookie。

服务端可以设置所有的 Cookie 属性，但客户端有部分属性是无法设置的，如，HttpOnly：

```shell
# 客户端
[name]=[value];expires=[new Date()];domain=[domain];path=[path];Secure;

# 服务端
[name]=[value];expires=[new Date()];domain=[domain];path=[path];Secure;HttpOnly,size=[size];SameSite=[Strict|Lax|none];Priority=[Medium]
```

#### name

字符串，用于唯一确定一个 Cookie 的名称，在 JavaScript 中是区分大小写的。

name 属性是一个字符串，具体规则与 JavaScript 变量名称有所不同：使用字母数字和下划线、避免使用 `$`，没有保留字或变量名限制。要真正理解命名规则，[请阅读HTTP 1.1标准](http://javadocs.wikidot.com/hypertext-transfer-protocol-http1-1)。

#### value

字符串，用于存储 Cookie 的值。

value 值中逗号、分号、空格被当做了特殊符号，所以有这三个特殊字符时，需要对进行额外编码，如： `encodeURI|encodeURIComponent` 。

**注意：** value 值并不是一定要编码。原始的文档中指示仅有三种类型的字符必须进行编码：**分号、逗号、和空格**。

#### expires（未来某个时刻过期）

**GMT 格式**的时间，用于设置失效日期，默认有效期为：session（会话 Cookie，即浏览器关闭后过期）。

**GMT 格式**的时间，可通过 ` new Date().toGMTString()` 或者 ` new Date().toUTCString()` 获取。[JavaScript Date的使用和日期时间字符串格式](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/js-tan-suo-xi-lie/02javascriptdate-de-shi-yong-he-ri-qi-shi-jian-zi-fu-chuan-ge-shi)

以下表示一天后失效：

```javascript
// 正确写法
// 注：时区原因，以下四种写法表示的过期时间有差异

// Tue May 03 2022 22:48:41 GMT+0800 (中国标准时间)
document.cookie =`aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};`
document.cookie =`aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString()};`

// Tue, 03 May 2022 14:48:41 GMT
document.cookie =`aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toGMTString()};`
document.cookie =`aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()};`
```

如果设置的值无效，相当没有设置 expires：

```javascript
// 错误写法
document.cookie = `aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()};`
document.cookie = `aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString()};`
```

####  max-age（经过一定秒数过期）

数值（以秒为单位），表示在多少秒后失效，默认值是 -1（会话 Cookie，即浏览器关闭后过期）。

max-age 可接收的值：

* 负数：会话 Cookie，即浏览器关闭后过期；
* 0：表示删除 Cookie；
* 正数：有效期为 **客户端收到 Cookie 的时刻 + max-age（秒）**。

以下表示一天后失效：

  ```js
// 2022-05-03T15:02:08.782Z
document.cookie = `aaa=1234;max-age=${24 * 60 * 60};`
  ```

#### domain

字符串，表示允许访问 Cookie 的域名，默认为当前文档的域名。

需要注意以下问题：

* **Cookie不可跨站访问**：zhao.com 域名的 Cookie 不能被 example.com 域名访问。这是由 Cookie 的隐私安全机制决定的。
* **name 相同但 domain 不同的是两个不同的 Cookie。** 如果想要两个域名完全不同的网站共有 Cookie，可以生成两个Cookie，domain 属性分别为两个域名，输出到客户端。
* **domain 不能是顶级域名**，即不能设置为 `.com` 或 `com`。

设置 zhao.com 域名及其子域名允许访问 Cookie：

```js
document.cookie = 'aaa=1234;domain=.zhao.com;'
```

#### path

字符串，表示允许访问 Cookie 的**路径**，默认为 '/'，即对当前域名下的所有路径都有效。

设置 Path=/aaa，那么只有 /aaa 及其子路径的请求才会携带这个Cookie。

```js
document.cookie = 'aaa=1234;path=/aaa;' // 只允许 /aaa 目录下的页面访问 Cookie
document.cookie = 'aaa=1234;path=/;'    // 允许所有路径访问 Cookie
```

**注意：** **name 相同但 path 不同，是两个不同的 Cookie。**

**注意：** cookie 在 Header 的顺序，RFC 推荐在浏览器能够按 path 的长短排序，越长说明匹配的越精确，顺序越靠前。但并不是所有的浏览器都遵守这个，并且服务器也不应该依赖于 Cookie 出现的顺序。

#### httponly

布尔值，表示 Cookie 是否允许客户端的 JavaScript（如，`document.cookie`）访问，默认为空，即允许客户端通过 Javascript 访问（读、改、删等）Cookie。

这主要用于缓解跨站脚本（XSS）攻击，防止恶意脚本窃取敏感Cookie（如Session ID）。

**注意：** 客户端不能用 Javascript 设置带 httponly 属性的 Cookie（Chrome 开发者工具中可以设置），只能通过服务端来设置。

```js
`httpOnly;` //不区分大小写
```

#### secure

布尔值，表示是否仅允许通过 **HTTPS** 协议的请求携带，而不允许 HTTP 协议的请求携带，默认为空（即不管是 HTTPS 协议还是 HTTP 协议，都允许携带）。

这是保护 Cookie 不被中间人攻击的重要安全措施。

```js
document.cookie = 'aaa=1234;Secure;' // secure 不区分大小写
```

**注意：** secure 属性，只能在 HTTPS 协议下使用，HTTP 协议下不能设置 secure 属性。

#### sameSite

字符串（枚举值），表示是否允许 Cookie 在跨站请求中携带，默认值 Lax（在现代浏览器中，不同浏览器可能有差异）。

这是一个非常重要的安全属性，用于防御 CSRF 攻击。

SameSite 可接收值有：

* Strict：最严格，浏览器只会在**同一站点**的请求中发送 Cookie（即请求的域名和 Cookie 的域名完全一致）。
* Lax：默认值（在现代浏览器中）。大多数情况也是不发送第三方 Cookie，但在安全（如HTTPS）的顶级导航（例如点击链接）或GET请求中会携带 Cookie。
* None：允许在跨站请求中发送Cookie。**但前提是必须同时设置 `Secure` 属性**（即 Cookie 必须通过 HTTPS 传输）。

| 请求类型  |                 示例                 | Strict | Lax         | None        |
| :-------- | :----------------------------------: | ------ | ----------- | ----------- |
| 链接      |         `<a href="..."></a>`         | 不发送 | 发送 Cookie | 发送 Cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 不发送 | 发送 Cookie | 发送 Cookie |
| GET 表单  |  `<form method="GET" action="...">`  | 不发送 | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">`  | 不发送 | 不发送      | 发送 Cookie |
| iframe    |    `<iframe src="..."></iframe>`     | 不发送 | 不发送      | 发送 Cookie |
| AJAX      |            `$.get("...")`            | 不发送 | 不发送      | 发送 Cookie |
| Image     |          `<img src="...">`           | 不发送 | 不发送      | 发送 Cookie |

注意以下问题：

*  `SameSite=none` 只能在 HTTPS 协议下设置。因为，设置 SameSite 属性，Cookie 必须有 Secure 属性，而 Secure 属性只能在 HTTPS 协议下使用。

* 有部分浏览器不能加 `SameSite=none`。比如：IOS 12 的 Safari 以及老版本的一些 Chrome 会把 ` SameSite=none` 识别成 `SameSite=Strict`，所以服务端必须在设置 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不返回 `SameSite=none`  属性。

**注意：** 2020 年 2 月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，即，之前默认是 None 的，Chrome 80 后默认是 Lax。

**注意：** 为解决 Chrome 浏览器中，Cookie 无法跨站使用，可以让服务端设置 Cookie 的属性 `SameSite=none`，或者使用 nginx 类的代理器统一设置 。

#### size

数值，表示 Cookie 在磁盘上占用的**总字节数**。

size 是 `Name` + `Value` + 所有其他属性（如 `Domain`, `Path`, `Expires` 等）的**序列化字符串的总长度**，其作用是为帮助开发者了解 Cookie 的存储开销。浏览器对每个域名下的 Cookie 数量和总大小都有限制，这个属性有助于进行调试和优化。

**注意：** 开发者不能设置/修改 size 的值。这是一个**计算结果**，由浏览器根据你设置的 Cookie 内容自动计算得出。

#### priority（Chrome 历史遗留属性）

字符串（枚举值），用于在Cookie数量或大小达到浏览器限制时，决定**哪些Cookie应该被优先保留**。

priority 的可选值：

- `Low`
- `Medium` (默认值)
- `High`

当需要清理 Cookie 时，优先级为 `Low` 的 Cookie 会先于 `Medium` 和 `High` 的被删除。

**注意：** 开发者可能设置/修改 priority 属性的值，但**不推荐且不通用**。这是一个非标准属性，最初是 Chrome 特有的，其他浏览器可能不支持，并且现代 Chrome 中的清理算法可能已经发生了变化，依赖它并不可靠。

### 读写Cookie

服务器发送给客户端（浏览器）时，可以通过 Set-Cookie 创建、更新或删除 Cookie；而客户端也可以通过浏览器内置的一些脚本，比如 Javascript，创建、更新或删除 Cookie。

#### 客户端

客户端可以设置 Cookie 的一些属性：name、value、expires/max-age、domain、path、secure（HTTPS 协议下），但不能设置 HttpOnly 属性。

**创建 Cookie：**

```js
// 正确写法：
document.cookie = `aaa=1234;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

<span style="color: #0aa; font-weight: bold;">一次只能设置一个cookie。</span> 

```javascript
// 错误写法
document.cookie = "aaa=1234; bbb=1234; ccc=1234";
```

如上同时设置多个 Cookie，实际只会添加第一个 `aaa=1234`，后面的 Cookie 都没有添加成功。

最简单的设置多个 Cookie 的方法就在重复执行 `document.cookie = "[name]=[value]"`。

**查看 Cookie：**

```javascript
document.cookie
```

**修改 cookie：** 重新赋值就行，旧的值会被新的值覆盖。

```js
document.cookie = `aaa=5678;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

**注意**：**name、domain、path 都相同，Cookie 才会被覆盖**；否则是新增一个 Cookie。

**删除 Cookie：** 一种方法是通过浏览器开发者工具清除 Cookie（有第三方的工具，浏览器自身也有这种功能）；二是通过 Javascript 设置 Cookie 的有效期来清除 Cookie，如将 expires 属性的值设置为一个过去的时间点或者 max-age 属性值设置为 0。

**注意：name、domain、path 都相同，Cookie 才会被删除**。

```javascript
document.cookie = 'aaa=5678;domain=;path=/;max-age=0'
```

#### 服务端

服务器端通过响应头的 Set-Cookie 管理浏览器的 Cookie。

服务器向客户端传递 Cookie，浏览器接收后会将 Cookie 储存下来，以后每次发送请求时，浏览器发送请求的请求头部会带上 Cookie，但不是发送 Cookie 的所有属性，而是**只发送 name 和 value 值。**

**设置 Cookie：** 一个 set-Cookie 字段只能设置一个 Cookie。当要设置多个 Cookie，需要添加多个 set-Cookie 字段。服务端可以设置 Cookie 的所有属性选项：name、value、expires/max-age、domain、path、secure、HttpOnly。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  Cookie cookie = new Cookie("name", "value");
  cookie.setComment("Web Host Name");
  cookie.setMaxAge(24 * 60 * 60);
  cookie.setPath("/");
  ...
  response.addCookie(cookie);
}
```

**读取 Cookie：**

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  Cookie[] cookies = request.getCookies();

  // 处理输出中文乱码问题
  response.setCharacterEncoding("UTF-8");
  response.setContentType("text/html;charset=UTF-8");

  for (Cookie cookie:cookies) {
    out.println("名称："+ cookie.getName() +"/n");
    out.println("值："+ cookie.getValue() +"/n");
    out.println("有效时间："+ cookie.getMaxAge() +"/n");
    out.println("域名："+ cookie.getDomain() +"/n");
    out.println("路径："+ cookie.getPath() +"/n");
  }
}
```

**删除 Cookie：**

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  Cookie[] cookies = request.getCookies();
  for (Cookie cookie: cookies) {
    cookie.setMaxAge(0);
    response.addCookie(cookie);
  }
}
```

### Cookie的特性

#### 浏览器管理

浏览器对 Cookie 的管理是一个自动化的、基于规则的系统，主要包括四个环节：**接收、存储、发送和清理**。

* **接收**：接收服务器的 HTTP 响应时
  * 解析 `Set-Cookie` 头部；
  * 根据规则验证 Cookie 是否有效（比如：是否在允许的域和路径下） ；
  * 有效，则将其存储。

* **存储**：Cookie 存储在客户端（用户电脑）的特定文件或数据库中，每个 Cookie 都与其**域名、路径**等属性一起存储，每个域名维护一个独立的 Cookie 块。
* **发送**：客户端向服务器发起请求时，浏览器会执行 “Cookie匹配” 算法
  * 检查**域名**是否匹配（包括子域）；
  *  检查**路径**是否匹配（前缀匹配） ；
  * 检查 `Secure` 标志（如果设置了，则请求必须使用 HTTPS 协议） ；
  * 检查 `SameSite` 标志（根据当前请求是跨站还是同站来决定是否发送 Cookie）；
  * 检查 Cookie 是否已过期。
  * 所有匹配且未被阻止的 Cookie，组合成一个字符串，放在请求的 `Cookie` 头部中发送给服务器。

* **清理**
  - **会话Cookie**：当用户关闭浏览器时，这些 Cookie 会被清除。
  - **持久Cookie**：当 Cookie 到达其 `Expires` 或 `Max-Age` 指定的时间时，会被自动清除。
  - **手动清理**：用户可以通过浏览器设置手动清除所有或特定站点的 Cookie。
  - **达到限制**：当某个域名的 Cookie 数量或总大小超出浏览器限制时，浏览器会按照一定策略（如 LRU，最近最少使用）清理旧的 Cookie。

**备注**：**LRU** 的全称是 **L**east **R**ecently **U**sed，中文翻译为**最近最少使用**。

#### Cookie安全性

Cookie的安全性需要服务器和浏览器共同维护，主要通过设置正确的属性来实现。

| 安全措施                     | 作用                                                         | 如何设置                                                     |
| :--------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **`Secure` 属性**            | 只能通过**HTTPS**加密连接传输，防止在明文中被窃听。          | `Set-Cookie: sid=abc123; Secure`                             |
| **`HttpOnly` 属性**          | 阻止 JavaScript 通过 `document.cookie` API 访问该 Cookie，有效缓解 XSS 攻击。 | `Set-Cookie: sid=abc123; HttpOnly`                           |
| **`SameSite` 属性**          | 控制跨站请求中是否被发送，是防御**CSRF攻击**的利器。         | `Set-Cookie: sid=abc123; SameSite=Strict | Lax | None` (None需配Secure) |
| **合理的 `Domain` & `Path`** | 限制 Cookie的作用范围，避免不必要的暴露                      | 精确设置到需要的子域和路径。                                 |
| **较短的过期时间**           | 设置合理的过期时间                                           |                                                              |

#### Cookie的优缺点

* **优点**
  * **简单通用**：技术非常成熟，所有浏览器都支持，服务器和客户端实现都简单。
  * **状态保持**：解决了 HTTP 协议无状态的问题，是实现会话管理、用户登录的核心机制。
  * **无需服务器存储**：数据存储在客户端，减轻了服务器的存储压力（但服务器仍需维护会话状态）。
  * **自动管理**：浏览器自动完成 Cookie 的发送和接收，对开发者透明。

* 缺点
  * **容量和数量限制**：每个 Cookie 大小通常只有 4KB，且每个域名下的 Cookie 数量有限。**所有超出该限制的 Cookies 都会被截掉并且不会发送至服务器。**
  * **性能开销**：**每次请求都会自动携带**符合条件的 Cookie，如果 Cookie 过多过大，会增加网络带宽的消耗。
  * **安全性问题**：容易受到 CSRF 和 XSS 攻击，必须通过正确设置属性来防护。
  * **隐私问题**：第三方 Cookie 可用于追踪用户在不同网站间的行为，因此正被现代浏览器逐步淘汰。
  * **客户端不可靠**：用户可能禁用 Cookie，或者随时手动清除它们。
  * **自动清理机制不确定**：大小或数量超过时，IE 和 Opera 会删除最近最少使用过的 Cookie，但是 Firefox 是随机决定要清除哪个 Cookie。

#### Cookie限制

限制通常分为两个方面：**单个Cookie的大小**和**每个域名的Cookie总数**。

| 浏览器            | 单个Cookie大小限制    | 每个域名Cookie总数限制 | 备注                                      |
| :---------------- | :-------------------- | :--------------------- | :---------------------------------------- |
| **Chrome / Edge** | **4096 bytes (~4KB)** | **180**                | 超过限制后，会按LRU策略清理最旧的Cookie。 |
| **Firefox**       | **4097 bytes**        | 150                    | 略大于4KB。                               |
| **Safari**        | **4096 bytes (~4KB)** | 无明确硬性限制         | 但实际也有约束，行为可能不同。            |
| IE6 以及更低版本  |                       | 20                     |                                           |

**注意**：

- **总大小限制**：一些浏览器还对每个域名下所有 Cookie 的**总大小**有限制（例如约1024KB），但这不是一个普遍严格的标准。
- **超出限制的后果**：当设置新 Cookie 导致超出限制时，浏览器会**静默地**删除一个或多个旧的Cookie（通常是LRU），而不是报错。

**最佳实践**：永远不要接近这些限制。

### 常见问题

#### 如何唯一标识一个Cookie？

**简短回答：浏览器会根据 Cookie 的 Name、Domain 和 Path 这三个属性的组合来唯一标识一个Cookie。**

也就是说，只要 **`Name`**、**`Domain`** 和 **`Path`** 这三个属性中有任何一个不同，浏览器就会将其视为**不同的、独立的Cookie**，即使它们的 `Value` 完全相同。

#### 为什么 Max-Age 更好？

expires  是 http/1.0 协议的，其值是一个**GMT 格式**的时间；而 max-age 是 http/1.1 协议的，用于代替 expires，其值是一个以**秒**为单位时间段。

**注意：** 同时设置 expires 和 max-age，**Max-Age 的优先级高于 Expires**。

Max-Age 之所以被设计为优先级更高，主要是因为它有以下几个优势：

- **更简单直观**：使用秒数来设置，无需生成复杂的 GMT 时间字符串。
- **更可靠**：Max-Age 是相对时间，基于客户端收到 Cookie 的时刻计算。而 Expires  是绝对时间，如果客户端（浏览器）的系统时钟不准确（过快或过慢），就会导致 Cookie 过早或过晚过期。
- **符合现代标准**：作为更新的标准，它被推荐使用。

**最佳实践**：在现代Web开发中，建议优先使用  Max-Age，并避免同时设置两者。如果为了兼容非常古老的客户端而需要同时设置，请确保 Max-Age 的值是你期望生效的值。

#### domain 值必须以点（.）开始吗？

**简短回答：不是必须的。但带点和不带点有**重要区别。

* 带点（例如 `.zhao.com`）：**明确地**指定该 Cookie 应该被发送给 `zhao.com` 及其**所有子域名**（如 `www.zhao.com`、 `api.zhao.com`、 `shop.zhao.com` 等）。此时，点（.）类似一种“通配”声明，主动将 Cookie 的作用范围扩展到整个域名树。

* 不带点（例如 `zhao.com`）：在现代浏览器中，**隐式地**具有与带点形式**相同的效果**，即，Cookie 也会被发送给 `zhao.com` 及其所有子域名；而在非常古老的浏览器规范（早期 [RFC 2109](https://tools.ietf.org/html/rfc2109) 标准）中，不带点的设置可能只精确匹配该域名本身，即**对子域无效**。但根据现代的 [RFC 6265](https://tools.ietf.org/html/rfc6265) 标准，**不带点的设置会被浏览器自动解释为带点的形式**。

**最佳实践**：为了代码清晰和简洁，**推荐使用不带点的形式**（`Domain=mydomain.com`）。这是最广泛使用和认可的方式。

#### path 值结尾需要包含 “/” 吗 ？

**简短回答： 结尾加不加 “/” 效果是完全一样的。**

**[RFC 6265](https://tools.ietf.org/html/rfc6265) 标准**：

* path 值为空或者第一个字符为非 "/" 字符，默认为 "/"
* Cookie 路径匹配，从 path 值第一个字符开始到最右边的 "/"，但不包括它。

**最佳实践：** 从代码清晰性和可读性的角度，推荐**使用结尾的 “/”**。

#### 跨域和跨站是什么概念？

##### 什么是跨域？

 同源或者同域是两个URL的**“协议 + 域名 + 端口”** 三部分是否完全相同。只要有任何一部分不同，就是跨域。

这是一个**同源策略** 下的概念，同源策略是浏览器最核心的安全基石，它限制了不同源的文档或脚本如何相互交互。

| 当前页面URL                   | 目标URL                        | 是否跨域 | 原因                         |
| :---------------------------- | :----------------------------- | :------- | :--------------------------- |
| `https://www.example.com/app` | `https://www.example.com/api`  | **否**   | 协议、域名、端口均相同       |
| `https://www.example.com`     | `http://www.example.com`       | **是**   | 协议不同 (`https` vs `http`) |
| `https://www.example.com`     | `https://api.example.com`      | **是**   | 域名不同 (`www` vs `api`)    |
| `https://www.example.com`     | `https://www.example.com:8080` | **是**   | 端口不同 (`443` vs `8080`)   |

**AJAX请求（Fetch/XMLHttpRequest）**默认受同源策略限制，跨域请求会被浏览器拦截，除非客户端、服务端明确设置允许跨域。

##### 什么是跨站？

同站是指两个 URL 的 **eTLD+1** 相同，**不需要考虑协议和端口**。其中，eTLD 表示有效顶级域名，而 eTLD+1 则表示**顶级域名 + 二级域名**。

这是一个 Cookie 的 **`SameSite` 属性** 下的概念，主要用于防御CSRF攻击。

| 当前站点                  | 目标站点                    | 是否跨站 | 原因                                                         |
| :------------------------ | :-------------------------- | :------- | :----------------------------------------------------------- |
| `https://www.example.com` | `https://api.example.com`   | **否**   | 相同的 `eTLD+1` (`example.com`)                              |
| `https://www.example.com` | `https://example.github.io` | **是**   | 不同的 `eTLD+1` (`example.com` vs `example.github.io`)       |
| `https://a.github.io`     | `https://b.github.io`       | **是**   | **注意！** 虽然都是 `github.io`，但 `github.io` 本身是公共后缀，所以 `a.github.io` 和 `b.github.io` 是不同的站点！ |

##### Cookie 不受同源策略限制？

**简单来说：Cookie 的安全边界是“站点”，而不是“源”。它关心的是 Cookie 属于哪个站点，而不是哪个源。**

也就是说，Cookie 只关注 URL 的 **eTLD+1** ，不关心协议和端口。比如：zhao.com 和 example.com 是跨站，它们的 Cookie 不能共享；而 a.zhao.com 和 b.zhao.com 是跨域的，但还是同站，它们的 Cookie 是可以共享的。

**注意**：Cookie 是否允许携带，除了必需是同站，还取决于 `SameSite` 属性以及浏览器本身的 Cookie 管理策略。

#### Cookie发送不成功  

* 浏览器禁用了 Cookie：Chrome 浏览器，`在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据`；IE 浏览器，`工具 -> internet选项 -> 隐私 -> 高级` 。

* 同源策略限制了 Cookie 发送（[查看解决跨域的方法](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/01-ji-chu-03-tan-tan-qian-duan-kua-yuan-wen-ti-ji-jie-jue-fang-fa)。）。
  * 前端请求头没有 `withCredentials: true`，或者服务端响应头没有 `access-control-allow-credentials: true`、`access-control-allow-origin` 没有包含当前发请求的页面的域名。

  * Cookie 的 Samesite 属性没有设置正确（比如 `sameSite: Lax`，在现在 Chrome 浏览器不允许跨站携带，但是 FireFox 浏览器或早期的 Chrome 浏览器是允许的），`Samesite: None` 是表示允许跨站携带 Cookie。


* 其他原因：
  * 使用 Mockjs，但没有开启允许跨域：`Mock.XHR.prototype.withCredentials = true`。 **(血泪经历，记忆深刻)**

#### withCredentials 和 sameSite 属性

withCredentials 和 sameSite 属性都跟 Cookie 跨站有关：

* withCredentials：针对 XHR；
* samesite：可针对 XHR，也包括 a、img、iframe 等标签请求相关的 Cookie。

**withCredentials** 是请求头/响应头相关的信息，是为解决前端跨域请求问题。

使用该属性需要以下三点：

* 服务器响应头信息 `Access-Control-Allow-Credentials: true`。

* 服务端响应头信息必须携带 `Access-Control-Allow-Origin`，指定允许跨域的域名。

  > 规范中提到，如果 XMLHttpRequest 请求设置了 withCredentials 属性，**那么服务器不得设置 Access-Control-Allow-Origin的值为*** ，否则浏览器将会抛出 `The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' ` 错误。

* 客户端需要开启请求头部信息 `withCredentials: true`，如果未开启，请求头部不会发送请求服务器设置在客户端的 Cookie。（如果省略 withCredentials 设置，有的浏览器还是会一起发送 Cookie。这时，可以显式关闭 withCredentials）

sameSite 是 Cookie 属性，可限制客户端请求中 Cookie 跨站情况，其默认值在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（即CSRF）。

**注意**：即使开启了 withCredentials，此时客户端 Cookie 还是遵守**同站**政策，跨站发请求，仍无法将请求响应头中 Cookie 写到客户端，也无法将客户端 Cookie 读取到 HTTP 请求头。跨站携带，还是需要依赖 sameSite 属性。

### 参考链接

[关于Cookie的一些思考和理解](https://www.jianshu.com/p/64c0f5d073bb)

[session与cookie详解](https://www.imooc.com/article/267349)

[cookie详解](https://cloud.tencent.com/developer/article/1065905)

[深入解析Cookie技术](https://www.freebuf.com/articles/web/42802.html)

[聊一聊 cookie](https://segmentfault.com/a/1190000004556040)

[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)