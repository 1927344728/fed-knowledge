## 聊一聊Cookie的一些问题

### Cookie是什么？

**Cookie，是站点为了访客的一些信息来区分用户(Identifier)或者传递信息**。在Session出现之前，基本上所有的网站都采用Cookie来区分用户身份。

Web应用程序是使用HTTP协议传输数据的。`HTTP`协议是无状态的协议。一旦数据交换完毕，客户端与服务器端的连接就会关闭，再次交换数据需要建立新的连接。

Cookie机制采用的是在客户端保持`Http`状态的方案，是一种唯一标识一个用户，同时记录该用户的状态的机制。

**注意：Cookie功能需要浏览器的支持。**如果浏览器不支持`Cookie`或者把`Cookie`禁用了，`Cookie`功能就会失效。启用或禁用浏览器cookie，如：`Chrome -> 在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据`

**注意：** **Cookie 可以同站共享，即，一级域名相同的页面，可以共享cookie。**

### Cookie存在哪里？

坦白的说，一个cookie就是存储在用户主机浏览器中的一小段文本文件。Cookies是纯文本形式，它们不包含任何可执行代码。一个Web页面或服务器告之浏览器来将这些信息存储并且基于一系列规则在之后的每个请求中都将该信息返回至服务器。Web服务器之后可以利用这些信息来标识用户。Cookie只是包含了数据，就其本身而言并不有害。

* Cookies文件：Chrome的Cookie数据位于：`%LOCALAPPDATA%\Google\Chrome\User Data\Default\ Cookies`。如：`C:\Users\[whoami]\AppData\Local\Google\Chrome\User Data\Default\Cookies`。

  在用户[whoami]文件夹中，**AppData通常是隐藏的。**window10下，点开查看 -> 勾中【隐藏的项目】。

* chrome开发者工具中查看：F12 -> Application -> Cookies -> [website]

* chrome设置中查看：`Chrome -> 在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据 -> 所有 Cookie 和网站数据`



### Cookie的工作原理是什么？

**Cookie使用HTTPHeader传递数据。**Cookie机制定义了两种报头：`Set-Cookie`报头和`Cookie`报头。`Set-Cookie`报头包含于Web服务器的响应头（ResponseHeader）中，Cookie报头包含在浏览器客户端请求头（ReguestHeader）中。

Cookie的运行过程具体分析如下：

* 客户端在浏览器的地址栏中键入Web服务器的URL，浏览器发送读取网页的请求。 

* 服务器接收到请求后，产生一个`Set-Cookie`报头，放在HTTP报文中一起回传客户端，发起一次会话。 

* 客户端收到应答后，若要继续该次会话，则将`Set-Cook-ie中`的内容取出，形成一个Cookies文件储存在客户端计算机里。

* 当客户端再次向服务器发出请求时，浏览器先在电脑里寻找对应该网站的Cookies文件。如果找到，则根据此Cookies产生Cookie报头，放在HTTP请求报文中发给服务器。**这些是浏览器自动做的，而且每一次`http`请求浏览器都会自动做。**

* 服务器接收到包含Cookie报头的请求，检索其Cookie中与用户有关的信息，生成一个客户端所请示的页面应答传递给客户端。 浏览器的每一次网页请求，都可以传递已存在的Cookie文件。



### Cookie有哪些属性？

**通常服务器只想知道`[name]=[value]`值**，其余的字段有的为了存储，有的为了安全性。

**Cookie属性名称不区分大小写**。如：`DOMAIN和domain`，`secure和SECURE`。

**Cookie名称本是区分大小写的**。只不过由于 ASP 进行了封装，使得 cookie 名称不区分大小写。

> ASP 中 ：`response.cookies("aa") `与 `response.cookies("AA") `是指的同一个 cookie。
>
> JavaScript中：`document.cookie = "aa=1"`和`document.cookie = "AA=2"`是两个 cookie。

```shell
# 前端可设置的属性。其中Secure需在https协议下
[name]=[value];expires=[new Date()];domain=[domain];path=[path];Secure;

# 全部属性。服务器可以全部设置
[name]=[value];expires=[new Date()];domain=[domain];path=[path];Secure;HttpOnly,size=[size];SameSite=[Strict | Lax | none];Priority=[Medium]
```

- name：一个唯一确定cookie的名称。Cookie名称是一个字符串，不分大小写。规则与JavaScript变量名称不同，但是常识适用：使用字母数字和下划线、避免使用“ $”，没有保留字或变量名限制。要真正理解命名规则，[请阅读HTTP 1.1标准](http://javadocs.wikidot.com/hypertext-transfer-protocol-http1-1)。

- value：存储在cookie中的字符串值

  `cookie`其实是个字符串，这个字符串中`逗号、分号、空格`被当做了特殊符号。所以当cookie的 key 和 value 中含有这3个特殊字符时，需要对其进行额外编码。可用`escape | encodeURI | encodeURIComponent` 进行编码，用`unescape | decodeUR | decodeURIComponent`进行解码。

  通常的观点是cookie的值必须被URL编码，**但是这其实是一个谬误**。原始的文档中指示仅有三种类型的字符必须进行编码：分号，逗号，和空格。

* 生命周期

  **expires(未来某个时刻过期)**

  `expires`其实是`cookie`失效日期，默认有效期为`session`（即，会话cookie，浏览器关闭后失效）。

  `expires`必须是 `GMT` 格式的时间（可以通过` new Date().toGMTString()`或者` new Date().toUTCString()` 来获得）。[JavaScript Date的使用和日期时间字符串格式](https://lizh.gitbook.io/knowledge/js-tan-suo-xi-lie/02javascript-date-de-shi-yong-he-ri-qi-shi-jian-zi-fu-chuan-ge-shi)
  
  ```shell
  # 以下为表示一天后失效的日期
  
  # 正确写法。注：时区原因，以下四种写法表示的过期时间有差异
  `expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};`
  `expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toGMTString()};`
  # toGMTString：Sun, 02 Aug 2020 16:16:27 GMT
  `expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()};`
  # toUTCString：Sun, 02 Aug 2020 16:18:05 GMT
  `expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString()};`
  # toString：Mon Aug 03 2020 00:18:22 GMT+0800 (中国标准时间)

  # 错误写法。值无效，相当没有设置expires
`aaa=1234;domain;path;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()};`
  # toISOString：2020-08-02T16:19:05.896Z
  `aaa=1234;domain;path;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString()};`
  # toLocaleString：2020/8/3 上午12:19:20
  ```
  
   **max-age(经过一定秒数过期)**
  
   `max-age`指定当前`cookie`是在多长时间之后而失效，默认值是 -1（即，会话cookie，浏览器关闭后失效）。
  
    ```js
  //以下为表示一天后失效的日期。单位为：秒(s)
    `max-age=${24 * 60 * 60};`
    ```
  
  有三种可能值：
  
  * 负数：有效期`session`
  * 0：删除`cookie`
  * 正数：以秒为单位，有效期为`创建时刻 + max-age`
  
  > `expires` 是 http/1.0协议中的选项，在新的http/1.1协议中`expires`已经由 `max-age` 选项代替，两者的作用都是限制cookie 的有效时间。`expires`的值是一个时间点（`cookie失效时刻= expires`），而`max-age` 的值是一个以`秒`为单位时间段（`cookie失效时刻= 创建时刻 + max-age`）。
  
* domain：决定允许访问Cookie的域名。默认值为设置该`cookie`的网页所在的域名。

  **Cookie是不可跨域名的。**域名www.google.com颁发的Cookie不会被提交到域名www.baidu.com去。这是由Cookie的隐私安全机制决定的。隐私安全机制能够禁止网站非法获取其他网站的Cookie。

  `name`相同但`domain`不同的两个Cookie是两个不同的Cookie。如果想要两个域名完全不同的网站共有Cookie，可以生成两个Cookie，`domain`属性分别为两个域名，输出到客户端。

  **domain不能是公共后缀**，即不能设置为`.com`或`com`。

  如果想所有www.baidu.com域名下的域名都可以使用该Cookie，需要设置Cookie的domain参数。需设置：

  ```js
  `domain=.baidu.com;`
  ```

  > 注意：
  >
  > **domain参数必须以点(‘.’)开始?**
  >
  > 早期的标准[RFC 2109](https://tools.ietf.org/html/rfc2109)：domain必须以"."开始。不以"."开始，cookie对子域无效。然而，[RFC 6265](https://tools.ietf.org/html/rfc6265)标准中，是不需要以'.'开始，如果存在‘.’，也会自动忽略。为兼容一些使用RFC 2109标准的旧浏览器，**建议domain参数都以'.'开始。**
  >

* path：决定允许访问Cookie的路径（ContextPath）。默认值为设置该`cookie`的网页所在的目录。

  在默认情况下，与创建cookie的网页在同一目录或子目录下的所有网页都可以读取该cookie。指定域中的路径，应该向服务器发送path值。

  **name相同但path不同的两个Cookie也是两个不同的Cookie。**
  
  ```js
  `path=/aaa;`//只允许/aaa下的程序使用Cookie
`path=/;` //允许所有路径使用Cookie
  ```
  
  > 注意：
  >
  > **不要包含结尾的'/'？：**
  >
  > [RFC 6265](https://tools.ietf.org/html/rfc6265)标准：path为空或者第一个字符为非"/"字符，默认为"/"。此外，cookie路径匹配，从path第一个字符开始到最右边的"/"，但不包括它。所以“尾部"/"是不需要的。
  >
  > **cookie的顺序：**
  >
  > RFC推荐在`request header`中浏览器能够按path的长短排序，越长说明匹配的越精确，顺序越靠前。并不是所有的浏览器都遵守这个，并且服务器也不应该依赖于cookie出现的顺序。
  
  > `domain`是域名，`path`是路径，两者加起来就构成了 URL，`domain`和`path`一起来限制 cookie 能被哪些 URL 访问。
  >
  > 如：cookie的 `domain`为`aaa.com`, `path`为`/`。若请求的URL（`js/html/img/css`资源请求，**但不包括 XHR 请求**）的域名是`aaa.com、api.aaa.com、ev.api.aaa.com`，且 URL 的路径是`/、/home、/home/login`，则浏览器会将此 cookie 添加到该请求的 cookie 头部中。

* secure：设置`cookie`只在确保安全协议的请求中才会发送。当请求是`HTTPS`或者其他安全协议时，包含 `secure` 选项的 `cookie` 才能被发送至服务器。

  默认情况下，`cookie`不会带`secure`选项(即为空)。所以默认情况下，不管是`HTTPS`协议还是`HTTP`协议的请求，`cookie` 都会被发送至服务端。

  客户端通过 `javascript`去设置`secure`类型的 cookie，必须保证网页是`https`协议的。在`http`协议的网页中是无法设置`secure`类型cookie的。[查看相关](https://stackoverflow.com/questions/37234687/how-to-set-cookie-secure-flag-using-javascript)
  
  ```js
`Secure;` //不区分大小写
  ```
  
  > 注意：`secure`选项只是限定了在安全情况下才可以传输给服务端，但chrome中还是可以看到这个 cookie的。
  >
  
* httponly：设置`cookie`是否能通过 `js` 去访问。默认情况下，`cookie`不会带`httpOnly`选项(即为空)，所以默认情况下，客户端是可以通过`javascript`代码去访问（包括读取、修改、删除等）这个`cookie`的。**当`cookie`带`httpOnly`选项时，客户端则无法通过`javascript`代码去访问（包括读取、修改、删除等）**，只能通过服务端来设置。[查看相关](https://stackoverflow.com/questions/14691654/set-a-cookie-to-httponly-via-javascript)

  ```js
  `httpOnly;` //不区分大小写
  ```

* size：未找到相关说明。**似乎是浏览器根据value自动设置的。**??

* SameSite：让 `Cookie `在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF），从而减少安全风险。[Cookie 的 SameSite 属性](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)。

  跨站和跨域是不同的：

  * 跨域是浏览器同源策略中的概念。其同源是指两个 URL 的协议/主机名/端口一致，判断比较严格。

  * Cookie中的「同站」：只要两个 URL 的 `顶级域名（也称一级域名）+ 二级域名，比如aaa.com` 相同即可，不需要考虑协议和端口，判断比较宽松。

  sameSite有三个值：

  * `Strict`：最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
  * `Lax`：规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。
  * None：Chrome 计划将`Lax`变为默认设置。这时，网站可以选择显式关闭`SameSite`属性，将其设为`None`。**不过，前提是必须同时设置`Secure`属性（Cookie 只能通过 HTTPS 协议发送），否则无效。**

  2020年2月份发布的 Chrome 80 版本中默认屏蔽了第三方的 Cookie，即，之前默认是 None 的，Chrome80 后默认是 Lax。 其影响详见下表：

  | 请求类型  | 示例 | Strict | Lax | None  |
  | :-------- | :----------------------------------: | -------- | ---------- | ---------- |
  | 链接      |         `<a href="..."></a>`         | 不发送 | 发送 Cookie | 发送 Cookie |
  | 预加载    | `<link rel="prerender" href="..."/>` | 不发送 | 发送 Cookie | 发送 Cookie |
  | GET 表单  |  `<form method="GET" action="...">`  | 不发送 | 发送 Cookie | 发送 Cookie |
  | POST 表单 | `<form method="POST" action="...">`  | 不发送 | 不发送 | 发送 Cookie |
  | iframe    |    `<iframe src="..."></iframe>`     | 不发送 | 不发送 | 发送 Cookie |
  | AJAX      |            `$.get("...")`            | 不发送 | 不发送 | 发送 Cookie |
  | Image     |          `<img src="...">`           | 不发送 | 不发送 | 发送 Cookie |

  有两点要注意的地方：

  * HTTP 接口不支持` SameSite=none`。因为，加`SameSite=none` 属性，必须加上 `Secure `属性，而 `Secure  `属性表示只有在 `HTTPS `协议下该 `Cookie `才会被发送。

  如果你想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

  * 需要 UA 检测，部分浏览器不能加 `SameSite=none`

    IOS 12 的 Safari 以及老版本的一些 Chrome 会把` SameSite=none` 识别成 `SameSite=Strict`，所以服务端必须在下发 Set-Cookie 响应头时进行` User-Agent` 检测，对这些浏览器不下发` SameSite=none` 属性。

* priority：未找到相关说明。??



### Cookie管理机制

* 有时效cookie（也称持久化cookie）：`expires`带有有效时间或者`max-age`为正数。在下次访问之前，如果失效时间到期，会自动清除对应cookie。

* 会话cookie：`expires`时间是`session`或者比当前时间还要早的时间或者未设或者`max-age`为负数。在会话结束时（浏览器关闭）会被删除。

* 如果浏览器中的cookie限制到达，那么cookies会被删除以为新建cookies创建空间。
* 对于任何这些自动删除来说，Cookie管理显得十分重要，因为这些删除都是无意识的。



### 如何操作cookie？

除了服务器发送给客户端（浏览器）的时候，通过Set-Cookie，创建或更新对应的cookie之外，还可以通过浏览器内置的一些脚本，比如 `javascript`，去设置对应的`cookie`，对应实现是操作`javascript`中的`document.cookie`。

> 浏览器可以通过设置来接受和拒绝访问 cookie。出于功能和性能的原因考虑，建议尽量降低 cookie 的使用数量，并且要尽量使用小 cookie。

#### 前端对cookie进行操作

**设置 cookie：**客户端可以设置cookie 的下列选项：`expires`、`domain`、`path`、`secure`**（只在`https`协议的网页中）**，但无法设置`HttpOnly`选项。

<span style="color: #0aa; font-weight: bold;">一次只能设置一个cookie。</span>当设置多个`cookie`时`document.cookie = "aaa=1234; bbb=1234; ccc=1234";`，只会添加第一个`cookie` `aaa=1234`，后面的所有`cookie`都没有添加成功。所以最简单的设置多个`cookie`的方法就在重复执行`document.cookie = "[name]=[value]"`。

```js
document.cookie = `aaa=1234;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

**查看cookie：**`document.cookie`

**修改 cookie：**要想修改一个`cookie`，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，**name/domain/path 这3个字段都相同的时候，cookie才会被覆盖。**否则不会修改旧值，而是添加了一个新的 cookie。

```js
document.cookie = `aaa=5678;domain=;path=/;expires=${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)};Secure;SameSite=none;Priority=Medium`
```

**删除 cookie：**

* 通过浏览器工具清除 cookie (有第三方的工具，浏览器自身也有这种功能) 。

* 通过设置 cookie 的有效期来清除 cookie。对cookie重新赋值，将新cookie的`expires` 设置为一个过去的时间点或者max-age设置为0。但同样要注意，**name/domain/path 这3个字段都相同的时候，cookie才会被覆盖。**



#### 后端服务器对cookie进行操作

从服务器端，发送cookie给客户端，是对应的Set-Cookie。包括了对应的cookie的名称，值，以及各个属性。而从客户端发送cookie给服务器的时候，是不发送cookie的各个属性的，而**只是发送对应的名称和值。**

**设置 cookie：**一个`set-Cookie`字段只能设置一个`cookie`，当你要想设置多个 cookie，需要添加同样多的`set-Cookie`字段。服务端可以设置cookie 的所有选项：`expires`、`domain`、`path`、`secure`、`HttpOnly`

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

**读取Cookie**

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

**删除Cookie**

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



### Cookie怎么提高安全性？

cookie是容易修改和获取，即容易被利用。那么自然而然会想到安全性问题。以下四种方式，在后端服务器对cookie进行适当的处理，可以提高cookie的安全性：

* 设置cookie的`httpOnly`属性，指明该cookie只用来HTTP请求使用。这个时候前端或者浏览器是拿不到这个cookie的，也就是使用`document.cookie`是不会出现的。
* 设置cookie的`secure`属性，使得cookie只在安全协议(如：https)下传输。如果把`https`改成`http`，cookie无法跟随请求一起发送到server端，在发送cookie之前就已启用了加密传输协议`https`。
* 设置cookie的`expires`不要太长。如果必要，将其设置成跟随`session`的结束而结束。
  * expires：默认可以不指定expires时间，或者设置一个比当前时间要早的时间。
  * max-age：设置为0。
* 只在cookie中存放不敏感数据，即使被盗也不会有重大损失。
* 通过加密（如：MD5加密）和安全传输技术（SSL），减少cookie被破解的可能性。



### Cookie有什么优点缺点？

**优点：**

* 不需要额外设置，浏览器发送请求时，自动带上cookie。

* 不需要服务器资源，直接存储在本地。


**缺点：**

* cookie会被附加在每个HTTP请求中，无形中增加了流量。

* 安全问题：在HTTP请求中的cookie是明文传递的、cookie可以被改写。

* 清理机制：IE和Opera会删除最近最少使用过的cookie，但是Firefox是随机决定要清除哪个cookie。(目前有些浏览器可以关闭自动清理)

* **所有超出该限制的cookies都会被截掉并且不会发送至服务器。**

* cookie大小的限制：大多数浏览器4096B的长度限制，为了兼容多种浏览器，最好将长度限制在4095B以内。

* 每个域的cookie总数是有限的，不同浏览器之间各有不同。
  * IE6以及更低版本限制每个域名最多20个cookie。
  * IE7之后的版本每个域名最多50个。
  * Firefox限制每个与最多50个cookie。
  * Safari和Chrome对于每个域的cookie数量限制没有硬性规定。
  
  



### 常见问题

#### Cookie发送不成功  

**原因一：**浏览器禁用了cookie。

`Chrome -> 在右上角“更多”图标 -> 设置 -> 隐私设置和安全性 -> 网站设置 -> Cookie 和网站数据`

`ie -> 工具 -> internet选项 -> 隐私 -> 高级` 

**原因二:**  [跨域问题](https://yq.aliyun.com/articles/610080)  。参考以下解决方法：

方法一：

1. 前端对于跨域的 `XMLHttpRequest `请求，需要设置`withCredentials `属性为 `true`。

2. 服务端的响应中`header`必须携带` Access-Control-Allow-Credentials: true`，否浏览器将不会把响应的内容返回给发送者。  

3. 服务端的响应中`header`必须携带`Access-Control-Allow-Origin`，指定允许跨域的域名。

   > 规范中提到，如果 `XMLHttpRequest `请求设置了`withCredentials `属性，**那么服务器不得设置 Access-Control-Allow-Origin的值为*** ，否则浏览器将会抛出`The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' `错误。

方法二：  [Nginx反向代理解决前后端联调跨域问题](https://segmentfault.com/a/1190000010197683)

方法三：[更多方法](https://juejin.im/post/5b5787e1f265da0f6263804d)

**原因三**：页面使用了请求mockjs。**(被坑过，记忆深刻)**



#### cookie的size、priority问题

在chrome中测试过，无法设置size值 。chrome中可以查看size的值，似乎是根据cookie的value值长度自动生成的。？？

priority是设置cookie优先级的，具体有哪些参数，优先级规则是什么，没有找到相应资料。？？





### 参考链接

[关于Cookie的一些思考和理解](https://www.jianshu.com/p/64c0f5d073bb)

[session与cookie详解](https://www.imooc.com/article/267349)

[cookie详解](https://cloud.tencent.com/developer/article/1065905)

[深入解析Cookie技术](https://www.freebuf.com/articles/web/42802.html)

[聊一聊 cookie](https://segmentfault.com/a/1190000004556040)

[浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)