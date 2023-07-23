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

**Cookie 使用 HTTP Header 传递数据。** Cookie机制定义了两种报头：`Set-Cookie` 和 `Cookie` 。`Set-Cookie` 包含于 Web 服务器的响应头中，Cookie 包含在客户端请求头中。

Cookie 的运行过程具体分析如下：

* 客户端在浏览器的地址栏中键入 Web 服务器的 URL，浏览器发送读取网页的请求。 

* 服务器接收到请求后，产生一个 `Set-Cookie` 信息，放在响应头中一起回传客户端，发起一次会话。 

* 客户端接到响应后，若要继续该次会话，则将 `Set-Cookie` 中的内容取出，形成一个 Cookies 文件储存在客户端计算机里。

* 当客户端再次向服务器发出请求时，浏览器先在电脑里寻找对应该网站的 Cookies 文件。如果找到，则根据此 Cookies 产生 Cookie 信息，放在 HTTP 请求头中发给服务器。**这些是浏览器自动做的，而且每一次 HTTP 请求都会自动带上 Cookie。**

* 服务器接收到包含 Cookie 信息的请求，检索 Cookie 中与用户有关的信息，生成一个客户端所请示的页面响应传递给客户端。 

### Cookie的属性

Cookie 由一个名称（name）、一个值（value）和其它几个用于控制 Cookie 有效期、安全性、使用范围的可选属性组成，但对服务端而言，它只需要 **name=value 值**。

**Cookie 属性名称不区分大小写**，如：DOMAIN 和 domain、secure 和 SECURE；Cookie 的 name 原本是区分大小写的，只是有些可能进行了封装，使得 name 属性也不区分大小写。比如：

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

name 属性用于唯一确定一个 Cookie 的名称。

name 属性是一个字符串，不分大小写，具体规则与 JavaScript 变量名称有所不同：使用字母数字和下划线、避免使用 `$`，没有保留字或变量名限制。要真正理解命名规则，[请阅读HTTP 1.1标准](http://javadocs.wikidot.com/hypertext-transfer-protocol-http1-1)。

#### value

value 属性用于存储 Cookie 的值。

Cookie 的值其实是个字符串，这个字符串中逗号、分号、空格被当做了特殊符号，所以当 value 中含有这三个特殊字符时，需要对其进行额外编码。比如，用 `escape|encodeURI|encodeURIComponent` 进行编码，用 `unescape|decodeUR|decodeURIComponent` 进行解码。

> 通常的观点是 Cookie 的值必须被 URL 编码，**但是这其实是一个谬误**。原始的文档中指示仅有三种类型的字符必须进行编码：分号、逗号、和空格。

#### expires（未来某个时刻过期）

expires 属性用于设置一个 Cookie 失效日期，默认有效期为：session（会话 Cookie，浏览器关闭后失效）。

expires 属性的值必须是 GMT 格式的时间（可通过 ` new Date().toGMTString()` 或者 ` new Date().toUTCString()` 获取）。[JavaScript Date的使用和日期时间字符串格式](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/js-tan-suo-xi-lie/02javascriptdate-de-shi-yong-he-ri-qi-shi-jian-zi-fu-chuan-ge-shi)

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

// 2022-05-03T14:55:16.036Z
document.cookie = `aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()};`

// 2022/5/3 22:55:49
document.cookie = `aaa=1234;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString()};`
```

####  max-age（经过一定秒数过期）

 max-age 属性指定当前 Cookie 是在多长时间之后而失效，默认值是 -1（会话cookie，浏览器关闭后失效），单位是秒（s）。

以下表示一天后失效：

  ```js
// 2022-05-03T15:02:08.782Z
document.cookie = `aaa=1234;max-age=${24 * 60 * 60};`
  ```

max-age 可接收的值：

* 负数：有效期 session；
* 0：删除 Cookie；
* 正数：以秒为单位，有效期为 **创建时刻 + max-age**。

> expires 和 max-age 的区别：
>
> expires  是 http/1.0 协议中的选项，在新的 http/1.1 协议中 expires 已经由 max-age 选项代替，两者的作用都是限制 Cookie 的有效时间。
>
> expires 的值是一个时间点，而 max-age 的值是一个以**秒**为单位时间段。

#### domain

domain 属性决定允许访问 Cookie 的域名。默认值为设置该 Cookie 的网页所在的域名。

domain 属性需要注意以下问题：

* **Cookie不可跨站访问。** 域名 www.google.com 颁发的 Cookie 不会被提交到域名 www.baidu.com 去。这是由 Cookie 的隐私安全机制决定的。隐私安全机制是为禁止网站非法获取其他网站的 Cookie。

* **name 相同但 domain 不同的是两个不同的 Cookie。** 如果想要两个域名完全不同的网站共有 Cookie，可以生成两个Cookie，domain 属性分别为两个域名，输出到客户端。
* **domain 不能是公共后缀**，即不能设置为 `.com` 或 `com`。

比如，想让 www.baidu.com 域名下的子域名都可以使用该 Cookie，可以设置：

```js
document.cookie = 'aaa=1234;domain=.baidu.com;'
```

> **domain 值必须以点（.）开始吗？**
>
> 早期的标准 [RFC 2109](https://tools.ietf.org/html/rfc2109)：domain 必须以 "." 开始，若不以 "." 开始，Cookie 对子域无效。然而，[RFC 6265](https://tools.ietf.org/html/rfc6265) 标准中，是不需要以 "." 开始，如果存在 "." ，也会自动忽略。
>
> 为兼容一些使用 RFC 2109 标准的旧浏览器，**建议 domain 值都以 "." 开始。**

#### path

path 属性决定允许访问 Cookie 的路径，默认值为设置该 Cookie 的网页所在的目录，且所有与该网页在同一目录或子目录下的网页都可以读取该 Cookie。

**注意：** **name 相同但 path 不同的是两个不同的 Cookie。**

```js
document.cookie = 'aaa=1234;path=/aaa;' // 只允许 /aaa 目录下的页面访问 Cookie
document.cookie = 'aaa=1234;path=/;'    // 允许所有路径访问 Cookie
```

> **path 值要不要包含结尾 “/” ？**
>
> [RFC 6265](https://tools.ietf.org/html/rfc6265)标准：path 为空或者第一个字符为非 "/" 字符，默认为 "/"。此外，Cookie 路径匹配，从 path 第一个字符开始到最右边的 "/"，但不包括它。
>
> **所以尾部 "/" 是不需要的。**

> **cookie 在 Header 的顺序**
>
> RFC 推荐在请求 Header 中浏览器能够按 path 的长短排序，越长说明匹配的越精确，顺序越靠前。
>
> 但并不是所有的浏览器都遵守这个，并且服务器也不应该依赖于 Cookie 出现的顺序。

#### secure

secure 属性设置 Cookie 是否只在安全协议（HTTPS 或者其他安全协议）的请求中才会发送，默认情况下为空，即不管是 HTTPS 协议还是 HTTP 协议的请求，Cookie 都会被发送至服务端。

```js
document.cookie = 'aaa=1234;Secure;' // secure 不区分大小写
```

**注意：** 客户端通过 Javascript 设置 secure 类型的 Cookie，必须保证网页是 HTTPS 协议的，HTTP 协议的网页无法设置 secure 类型的 Cookie。

#### httponly

httponly 属性用于设置 Cookie 是否允许客户端 Javascript 访问，默认为空，即客户端是可以通过 javascript 访问（读、改、删等）Cookie 。

**注意：** 客户端无法用 Javascript 设置带 httponly 属性的 Cookie（Chrome 开发者工具中可以设置），只能通过服务端来设置。

```js
`httpOnly;` //不区分大小写
```

#### size

未找到关于 size 属性的说明。**似乎是浏览器根据value自动设置的。**??

#### SameSite

SameSite 属性用于设置是否允许 Cookie 跨站访问，可接收值有：

* Strict：最为严格，完全禁止第三方 Cookie。跨站点时，任何情况下都不会发送 Cookie，换言之，只有当前网页的 URL 与请求目标同站时，才会带上 Cookie。
* Lax：规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。
* None：无论是否跨站都会发送 Cookie。

其影响详见下表：

| 请求类型  | 示例 | Strict | Lax | None  |
| :-------- | :----------------------------------: | -------- | ---------- | ---------- |
| 链接      |         `<a href="..."></a>`         | 不发送 | 发送 Cookie | 发送 Cookie |
| 预加载    | `<link rel="prerender" href="..."/>` | 不发送 | 发送 Cookie | 发送 Cookie |
| GET 表单  |  `<form method="GET" action="...">`  | 不发送 | 发送 Cookie | 发送 Cookie |
| POST 表单 | `<form method="POST" action="...">`  | 不发送 | 不发送 | 发送 Cookie |
| iframe    |    `<iframe src="..."></iframe>`     | 不发送 | 不发送 | 发送 Cookie |
| AJAX      |            `$.get("...")`            | 不发送 | 不发送 | 发送 Cookie |
| Image     |          `<img src="...">`           | 不发送 | 不发送 | 发送 Cookie |

注意以下问题：

* HTTP 协议不支持 `SameSite=none`。因为，使用 SameSite 属性，Cookie 必须有 Secure 属性，而 Secure 属性只能在 HTTPS 协议下使用。

* 需要 UA 检测，部分浏览器不能加 `SameSite=none`。IOS 12 的 Safari 以及老版本的一些 Chrome 会把` SameSite=none` 识别成 `SameSite=Strict`，所以服务端必须在设置 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不返回 `SameSite=none`  属性。


2020 年 2 月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，即，之前默认是 None 的，Chrome 80 后默认是 Lax。

为解决 Chrome 浏览器中，Cookie 无法跨站使用问题，可以让服务端设置 Cookie 的属性 SameSite=none，或者使用 nginx 类的代理器统一设置 。

#### priority

未找到 priority 属性的相关说明。

### 操作Cookie

服务器发送给客户端（浏览器）时，可以通过 Set-Cookie 创建或更新 Cookie；而客户端也可以通过浏览器内置的一些脚本，比如 Javascript，去设置 Cookie。

#### 客户端操作Cookie

客户端可以设置 Cookie 的一些属性：name、value、expires、domain、path、secure（HTTPS 协议下），但不能设置 HttpOnly 属性。

**设置 Cookie：**

```js
document.cookie = `aaa=1234;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

<span style="color: #0aa; font-weight: bold;">一次只能设置一个cookie。</span> 

```javascript
document.cookie = "aaa=1234; bbb=1234; ccc=1234";
```

如上同时设置多个 Cookie，实际只会添加第一个 `aaa=1234`，后面的 Cookie 都没有添加成功。

最简单的设置多个 Cookie 的方法就在重复执行 `document.cookie = "[name]=[value]"`。

**查看 Cookie：**

```javascript
document.cookie
```

**修改 cookie：** 重新赋值就行，旧的值会被新的值覆盖。

但要注意一点，在设置新 Cookie 时，**name、domain、path 这 3 个字段都相同的时候，Cookie 才会被覆盖。**否则不会修改旧值，而是添加了一个新的 cookie。

```js
document.cookie = `aaa=5678;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

**删除 Cookie：** 一种方法是通过浏览器工具清除 Cookie (有第三方的工具，浏览器自身也有这种功能) ；二是通过 Javascript 设置 Cookie 的有效期来清除 Cookie，如将 expires 属性的值设置为一个过去的时间点或者 max-age 属性值设置为 0（同样要注意，**name、domain、path 这 3 个字段都相同的时候，Cookie 才会被覆盖**）。

```javascript
document.cookie = 'aaa=5678;domain=;path=/;max-age=0'
```

#### 服务端操作Cookie

服务器端通过响应头的 Set-Cookie 信息，向客户端传递 Cookie，客户端接收后会将 Cookie 储存下来，以后每次发送请求时，客户端的请求头部会带上 Cookie，不过，不是发送 Cookie 的所有属性，而是**只发送 name 和 value 值。**

**设置 Cookie：** 一个 set-Cookie 字段只能设置一个 Cookie。当要设置多个 Cookie，需要添加多个 set-Cookie 字段。服务端可以设置 Cookie 的所有属性选项：name、value、expires、domain、path、secure、HttpOnly。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Cookie cookie = new Cookie("name", "value");
    cookie.setComment("Web Host Name"); // Cookie描述
    cookie.setMaxAge(24 * 60 * 60); // Cookie有效时间
    cookie.setPath("/"); // Cookie有效路径
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
        out.println("Cookie名   称："+cookie.getName()+"<br />");
        out.println("Cookie储   值："+cookie.getValue()+"<br />");
        out.println("Cookie备   注："+cookie.getComment()+"<br />");
        out.println("Cookie有效时间："+cookie.getMaxAge()+"<br />");
        out.println("Cookie有效路径："+cookie.getPath()+"<br />");
        out.println("Cookie有效域名："+cookie.getDomain()+"<br />");
        out.println("<a href=\"./CookieDel?name="+cookie.getName()+"\">删除Cookie</a><br />");
        out.println("--------------------------------------<br />");
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
 	//或者
    response.clearCookie('default_font')
}
```

### Cookie的一些性质

#### Cookie的管理

* 有时效 Cookie（也称持久化 Cookie）： expires 带有有效时间或者 max-age 为正数。在下次访问之前，如果失效时间到期，会自动清除对应 Cookie。

* 会话 Cookie：expires 时间是 session 或者比当前时间还要早的时间或者未设或者 max-age 为负数。在会话结束时（浏览器关闭）会被删除。

* 如果浏览器中的 Cookie 限制到达，那么 Cookies 会被自动删除以为新建 Cookies 创建空间。
* 对于任何这些自动删除来说，Cookie 管理显得十分重要，因为这些删除都是无意识的。

#### Cookie安全性

Cookie 是容易修改和获取，即容易被利用。那么自然而然会想到安全性问题。

以下四种方式，在服务端对 Cookie 进行适当的处理，可以提高安全性：

* **设置 httpOnly 属性：** 指明该 Cookie 只用来 HTTP 请求使用。这个时候用户端是拿不到 Cookie的，也就是使用 `document.cookie` 是不会出现的。
* **设置 secure属性：** 使得 Cookie 只在安全协议（如：HTTPS）下传输。
* **合理设置有效期： ** 如果必要，将其设置成跟随 session 的结束而结束。
* 不在 Cookie 中存放敏感数据，即使被盗也不会有重大损失。
* 通过加密（如：MD5 加密）和安全传输技术（SSL），减少 Cookie 被破解的可能性。

#### Cookie的优点

* 不需要额外设置，浏览器发送请求时，自动带上 Cookie。

* 不需要服务器资源，直接存储在本地。

#### Cookie的缺点

* Cookie 会被附加在每个请求中，无形中增加了流量。

* 安全问题：请求头中的 Cookie 是明文传递的，且 Cookie 可以被改写。

* 清理机制：IE 和 Opera 会删除最近最少使用过的 Cookie，但是 Firefox 是随机决定要清除哪个 Cookie。（目前有些浏览器可以关闭自动清理）。

* Cookie 大小的限制：大多数浏览器 4096B 的长度限制，为了兼容多种浏览器，最好将长度限制在 4095B 以内。**所有超出该限制的 Cookies 都会被截掉并且不会发送至服务器。**

* 每个域名的 Cookie 数量是有限的，不同浏览器之间各有不同。
  * IE6 以及更低版本限制每个域名最多 20 个 Cookie。
  * IE7 之后的版本每个域名最多 50 个。
  * Firefox 限制每个与最多 50 个 Cookie。
  * Safari 和 Chrome 对于每个域的 Cookie 数量限制没有硬性规定。
  

### 常见问题

#### 跨域和跨站是什么概念？

* **跨域：** 跨域是浏览器同源策略同源/跨域的概念，是指两个 URL 的 **协议 + 主机名 + 端口** 三者都相同。同源策略作为浏览器的安全基石，其同源判断是比较严格的。比如：https://www.baidu.com，它的协议是 https，主机名是 www.baidu.com，端口是 443，另一个 URL 的这三者与之都相同才是同源。
* **跨站：** 同站、跨站和第一方/第三方是同一概念，是指两个 URL 的 **eTLD+1** 相同即可，**不需要考虑协议和端口**。其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表中，例如： .com、.co、.uk、.github.io 等。而 eTLD+1 则表示**顶级域名 + 二级域名**，例如：baidu.com。

>  www.baidu.com，.com 是一级域名（也有称顶级域名）； baidu 是二级域名； www 是三级域名。

**注意：** **Cookie 只是同站限制，不是同源限制**，即 Cookie 只关注域名，忽略协议和端口，也就是 Cookie 可以跨二级域名来访问。

比如：www.taobao.com 和 www.baidu.com 是跨站，它们的 Cookie 不能共享；www.a.taobao.com 和 www.b.taobao.com 是跨域的，但还是同站，它们的 Cookie 是可以共享的。

#### withCredentials 和 sameSite 属性

withCredentials 和 sameSite 属性都跟 Cookie 跨站有关。withCredentials 是针对 XHR；而 samesite 可针对 XHR，也包括 a、img、iframe 等标签的引用 HTTP 请求所相关的 Cookie。

**withCredentials** 是请求头/响应头相关的信息，是为解决前端跨域请求问题。

使用该属性需要以下三点：

* 服务器响应头信息 `Access-Control-Allow-Credentials: true`。

* 服务端响应头信息必须携带 `Access-Control-Allow-Origin`，指定允许跨域的域名。

  > 规范中提到，如果 XMLHttpRequest 请求设置了 withCredentials 属性，**那么服务器不得设置 Access-Control-Allow-Origin的值为*** ，否则浏览器将会抛出 `The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' ` 错误。

* 客户端需要开启请求头部信息 `withCredentials: true`，如果未开启，请求头部不会发送请求服务器设置在客户端的 Cookie。（如果省略 withCredentials 设置，有的浏览器还是会一起发送 Cookie。这时，可以显式关闭 withCredentials）

sameSite 是 Cookie 属性，可限制客户端请求中 Cookie 跨站情况，其默认值在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（即CSRF）。

注意，即使开启了 withCredentials，此时客户端 Cookie 还是遵守**同站**政策，跨站发请求，仍无法将请求响应头中 Cookie 写到客户端，也无法将客户端 Cookie 读取到 HTTP 请求头。

> 这取决由浏览器的策略。
>
> 比如，2 月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，解决方案是将 Cookie 的 sameSite 值设置为 none。
>
> 而 fireFox 暂时没有此限制。

#### Cookie发送不成功  

**原因一：**浏览器禁用了 Cookie。

Chrome 浏览器：`在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据`。

IE 浏览器：`工具 -> internet选项 -> 隐私 -> 高级` 。

**原因二:**  跨域政策限制了 Cookie 发送。

* 可以考虑开启  withCredentials。（参考上一节）

* 可使用[Nginx反向代理](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/01-ji-chu-03-tan-tan-qian-duan-kua-yuan-wen-ti-ji-jie-jue-fang-fa#2.nginx-fan-xiang-dai-li)。

* [更多解决跨域的方法](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/01-ji-chu-03-tan-tan-qian-duan-kua-yuan-wen-ti-ji-jie-jue-fang-fa)。

**原因三**：页面使用了请求 Mockjs。**(被坑过，记忆深刻)**

#### Cookie 的 size、priority 问题

在 Chrome 中测试过，无法设置 size 值 。Chrome 中可以查看 size 的值，似乎是根据 Cookie 的 value 值长度自动生成的。？？

priority 是设置 Cookie 优先级的，具体有哪些参数，优先级规则是什么，没有找到相应资料。？？

### 参考链接

[关于Cookie的一些思考和理解](https://www.jianshu.com/p/64c0f5d073bb)

[session与cookie详解](https://www.imooc.com/article/267349)

[cookie详解](https://cloud.tencent.com/developer/article/1065905)

[深入解析Cookie技术](https://www.freebuf.com/articles/web/42802.html)

[聊一聊 cookie](https://segmentfault.com/a/1190000004556040)

[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)