## HTTP的历史演变及概述

HTTP（HyperText Transfer Protocol），超文本传输协议是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的**客户端-服务端**模型，客户端打开一个连接以发出请求，然后等待直到收到服务器端响应。

HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。尽管通常基于 TCP/IP 层，但它可以在任何**可靠的传输层**上使用，也就是说，该协议不会像 UDP 那样静默的丢失消息。RUDP —— 作为 UDP 的可靠化升级版本——是一种合适的替代选择。

HTTP 的基本性质：

* **简单的：** HTTP 报文简单易读、允许简单测试。
* **可扩展的：** HTTP/1.0 开始，HTTP Headers 让协议扩展变得非常容易，只要服务端和客户端就新 Headers 达成语义一致，新功能就可以被轻松加入进来。
* **无状态，有会话的：** 同一连接，两个执行成功的请求之间是没有关系的，但使用 Cookies 可以创建有状态的会话。
* **本身不包含连接：** 一个连接是由传输层来控制的，这从根本上不属于 HTTP 的范围，HTTP 依赖于 TCP 或者其他的可靠连接（UDP 不是，可靠化版的 RUDP 是）。

### 计算机网络体系

计算机网络体系结构分为 3 种：OSI 体系结构（七层）、TCP/IP 体系结构（四层）、五层体系结构。

- OSI（Open System Interconnect，开放式系统互联）体系结构：概念清楚、理论完整，但是它既复杂又不实用。主要包括：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层。
- TCP/IP 体系结构：TCP/IP 是一个四层体系结构，得到了广泛的运用。主要包括：应用层、传输层、网际层和网络接口层。
- 五层体系结构：折中 OSI 体系结构和 TCP/IP 体系结构，综合二者的优点，这样既简洁，又能将概念讲清楚。主要包括：应用层、传输层、网络层、数据链路层和物理层。

TCP/IP 与 OSI 最大的不同在于：OSI 是一个理论上的网络通信模型，而 TCP/IP 则是实际运行的网络协议。

![计算机网络体系结构](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1782626178-bfa9c9ce6a459b9e_fix732.jpg)

OSI 7 层协议主要是：

* 应用层（Application）：为用户程序提供通信服务，使用的协议有 HTTP、TFTP、FTP、NFS、WAIS、SMTP。
* 表示层（Presentation）： 主要功能是定义数据格式及加密。对信息进行语法处理，可确保一个系统的应用层所发送的信息可以被另一个系统的应用层读取，使用的协议有 Telnet、Rlogin、SNMP、Gopher。
* 会话层（Session）： 定义了如何开始、控制和结束一个会话，包括对多个双向消息的控制和管理，主要是在系统之间里建立对话以及接收对话，使用的协议为 SMTP、DNS。
* 传输层（Transport）： 提供是在两个终端的进程之间数据传输服务，包括数据传输、错误检查、可靠数据传输（数据的正确性和有序性）、拥塞控制等，使用的协议为 TCP、UDP。TCP 协议提供的是可靠传输，它包含了所有的数据传输服务，而 UDP 协议提供的是不可靠传输，包含部分服务，即数据传输和错误检查。
* 网络层（Network）： 定义端到端的包传输，包括能够标识所有结点的逻辑地址、路由实现的方式、如何将一个包分解成更小的包的分段方法，使用协议 IP、IPX。
* 数据链路层（Data Link）： 定义在单个链路上如何传输数据，这些协议与被讨论的各种介质有关，使用协议为 ATM、FDDI 等。
* 物理层（Physical）： 为设备之间的数据通信提供传输媒体及互连设备，为数据传输提供可靠的环境。OSI 的物理层规范是有关传输介质的特性，包括连接头、帧、帧的使用、电流、编码及光调制等。使用规范为 Rj45、802.3 等。

### 典型的HTTP会话

HTTP 是一种简单可扩展的协议，其 Client-Server 的结构以及轻松扩展头部信息的能力使得 HTTP 可以和 Web 共同发展。

HTTP 是 Client-Server（客户端-服务器）协议，会话分为三个阶段：

* 客户端建立一条 TCP 连接（如果传输层不是 TCP，也可以是其他适合的连接）；
* 客户端发送请求并等待应答；
* 服务器处理请求并送回应答，回应包括一个状态码和对应的数据。

从 HTTP/1.1 开始，连接在完成第三阶段后不再关闭，客户端可以再次发起新的请求。这意味着第二步和第三步可以连续进行数次。

在客户端 - 服务器协议中，连接是由客户端发起建立的。在 HTTP 中打开连接意味着在底层传输层启动连接，通常是 TCP。使用 TCP 时，HTTP 服务器的默认端口号是 80，另外还有 8000 和 8080 也很常用。页面的 URL 会包含域名和端口号，但当端口号为 80 时可以省略。

### HTTP发展

HTTP 是万维网（World Wide Web）的基础协议。自 Tim Berners-Lee（蒂姆·伯纳斯 - 李） 博士和他的团队在 1989-1991 年间创造出它以来，HTTP 已经发生了太多的变化，在保持协议简单性的同时，不断扩展其灵活性。如今，HTTP 已经从一个只在实验室之间交换文件的早期协议进化到了可以传输图片、高分辨率视频、3D 效果的现代复杂互联网协议。

#### 万维网的发明

20 世纪 60 年代，美国国防部建立了 ARPA 网，在 70 年代又提出了 TCP/IP 协议，并在 80 年代应用在 UNIX 内核中。

1989 年， 当时在 CERN（欧洲核子研究中心） 工作的 Tim Berners-Lee 博士写了一份关于建立一个通过网络传输超文本系统的报告。这个系统起初被命名为 Mesh，在随后的1990年项目实施期间被更名为万维网（World Wide Web）。它在现有的 TCP/IP 协议基础之上建立，由四个部分组成：

* 一个用来表示超文本文档的文本格式，超文本标记语言（HTML）。
* 一个用来交换超文本文档的简单协议，超文本传输协议（HTTP）。
* 一个显示（以及编辑）超文本文档的客户端，即网络浏览器。第一个网络浏览器被称为 WorldWideWeb。
* 一个服务器，用于提供可访问的文档，即 Apache（早期的 Web 服务器，到了 http server 2.0 以后就改名为httpd）。

这四个部分完成于1990 年底，且第一批服务器已经在 1991 年初在 CERN 以外的地方运行了。 1991 年 8 月 16 日，Tim Berners-Lee 在公开的超文本新闻组上发表的文章被视为是万维网公共项目的开始。

#### HTTP/0.9 – 单行协议

最初版本的 HTTP 协议并没有版本号，后来它的版本号被定位在 0.9 以区分后来的版本。 HTTP/0.9 极其简单：请求由单行指令构成，以唯一可用方法 GET 开头，其后跟目标资源的路径（一旦连接到服务器，协议、服务器、端口号这些都不是必须的）。

```shell
GET /mypage.html
```

响应也极其简单的：只包含响应文档本身。

```html
<HTML>
  这是一个非常简单的HTML页面
</HTML>
```

跟后来的版本不同，HTTP/0.9 的响应内容并不包含 HTTP Header，这意味着只有 HTML 文件可以传送，无法传输其他类型的文件；也没有状态码或错误代码：一旦出现问题，一个特殊的包含问题描述信息的 HTML 文件将被发回，供人们查看。

#### HTTP/1.0 – 构建可扩展性

由于 HTTP/0.9 协议的应用十分有限，浏览器和服务器迅速扩展内容使其用途更广：

- 引入了协议版本号概念，版本信息会随着每个请求发送；
- 增加了 HEAD、POST 等新方法；
- 增加回响应状态码，标记可能的错误原因；
- 引入了 HTTP Header 的概念，让 HTTP 处理请求和响应更加灵活，更具扩展性；
- 传输的数据不再仅限于纯文本 HTML 文件，具备了传输其他类型文档（图像、视频、二进制文件）的能力。

一个典型的请求看起来就像这样：

```shell
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
<HTML>
    一个包含图片的页面
    <IMG SRC="/myimage.gif">
</HTML>
```

接下来是第二个连接，请求获取图片：

```shell
GET /myimage.gif HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:32 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/gif
(这里是图片内容)
```

在 1991-1995 年，这些新扩展并没有被引入到标准中以促进协助工作，而仅仅作为一种尝试：服务器和浏览器添加这些新扩展功能，但出现了大量的互操作问题。直到 1996 年 11 月，为了解决这些问题，一份新文档（RFC 1945）被发表出来，用以描述如何操作实践这些新扩展功能。

文档 RFC 1945 定义了 HTTP/1.0，但它是狭义的，并不是官方标准。

#### HTTP/1.1 – 标准化的协议

HTTP/1.0 多种不同的实现方式在实际运用中显得有些混乱，自 1995 年开始，即 HTTP/1.0 文档发布的下一年，就开始修订 HTTP 的第一个标准化版本。在 1997 年初，HTTP1.1 标准发布，就在 HTTP/1.0 发布的几个月后。

HTTP/1.1 消除了大量歧义内容并引入了多项改进：

- 允许持久连接，节省了多次打开 TCP 连接加载网页文档资源的时间；
- 增加管线化技术，允许在第一个应答被完全发送之前就发送第二个请求，以降低通信延迟；
- 增加了 PUT、DELETE 等新的方法；
- 支持响应数据分块，利于传输大文件；
- 引入额外的缓存管理和控制机制；
- 引入内容协商机制，包括语言、编码、类型等，并允许客户端和服务器之间约定以最合适的内容进行交换；
- 引入 Host 头，能够使不同域名配置在同一个 IP 地址的服务器上。

HTTP/1.1 在 1997 年 1 月以 [RFC 2068](https://datatracker.ietf.org/doc/html/rfc2068) 文件发布。

由于 HTTP 协议的可扩展性 – 创建新的头部和方法是很容易的 – 即使 HTTP/1.1 协议进行过两次修订，RFC 2616 发布于 1999 年 6 月，而另外两个文档 RFC 7230-RFC 7235 发布于 2014 年 6 月，作为 HTTP/2 的预览版本

HTTP 协议已经稳定使用超过15年了。

#### HTTP/2 - 为了更优异的表现

这些年来，网页愈渐变得的复杂，甚至演变成了独有的应用，可见媒体的播放量、增进交互的脚本大小也增加了许多：更多的数据通过 HTTP 请求被传输。HTTP/1.1 链接需要请求以正确的顺序发送，理论上可以用一些并行的链接（尤其是5到8个），带来的成本和复杂性堪忧。比如，HTTP 流水线模型就成为了 Web 开发的负担。

在 2010 年到 2015 年，谷歌通过实践了一个实验性的 SPDY 协议，证明了一个在客户端和服务器端交换数据的另类方式，其收集了浏览器和服务器端的开发者的焦点问题，明确了响应数量的增加和解决复杂的数据传输，SPDY成为了 HTTP/2 协议的基础。

SPDY 主要解决：

* **降低延迟：** 针对 HTTP 高延迟的问题，SPDY 优雅的采取了多路复用，即通过多个请求 stream 共享一个 TCP 连接的方式。
* **请求优先级：** 多路复用带来一个新的问题是，在连接共享的基础之上有可能会导致关键请求被阻塞。SPDY 允许给每个 Request 设置优先级，这样重要的请求就会优先得到响应。
* **Header 压缩：** 选择合适的压缩算法可以减小包的大小和数量。
* 基于 HTTPS 的加密协议传输，大大提高了传输数据的可靠性。
* 服务端推送： 服务端会将文件推送给客户端，当客户端再次尝试获取该文件时可直接从缓存中获取到，不用再发请求。

HTTP/2 在 HTTP/1.1 有几处基本的不同：

- HTTP/2 是采用二进制传输数据，而不是 HTTP 1.x 的文本格式，二进制协议解析起来更高效；
- 多路复用，允许同时通过单一连接发起多个请求，并指定请求优先级，移除了 HTTP/1.x 中顺序和阻塞的约束；
- 数据流：HTTP/2 将每个请求或回应的所有数据包，称为一个数据流，每个数据流都有一个独一无二的编号，数据包发送的时候，都必须标记数据流 ID，用来区分它属于哪个数据流。
- 使用专用算法压缩 Headers，减少数据传输量；
- 允许服务器主动向客户端推送数据，通过一个叫服务器推送的机制来提前请求。

在 **2015 年 5 月正式标准化后**，HTTP/2 取得了极大的成功，在 2016 年 7 月前，8.7% 的站点已经在使用它，代表超过68%的请求 。高流量的站点最迅速的普及，在数据传输上节省了可观的成本和支出。

这种迅速的普及率很可能是因为 HTTP2 不需要站点和应用做出改变：使用 HTTP/1.1 和 HTTP/2 对他们来说是透明的。拥有一个最新的服务器和新点的浏览器进行交互就足够了，只有一小部分群体需要做出改变，而且随着陈旧的浏览器和服务器的更新，而不需 Web 开发者做什么，用的人自然就增加了。

#### 后HTTP/2进化

随着 HTTP/2 的发布，就像先前的 HTTP/1.x 一样，HTTP 没有停止进化，HTTP 的扩展性依然被用来添加新的功能。特别的，我们能列举出 2016 年里 HTTP 的新扩展：

* 对 Alt-Svc 的支持允许了给定资源的位置和资源鉴定，允许了更智能的 CDN 缓冲机制。
* Client-Hints 的引入允许浏览器或者客户端来主动交流它的需求，或者是硬件约束的信息给服务端。
* 在Cookie头中引入安全相关的的前缀，现在帮助保证一个安全的cookie没被更改过。

Google 发明 QUIC 协议，在 2018 年 HTTP/3 获得批准。HTTP 3.0 又称为 HTTP Over QUIC，其弃用 TCP 协议，改为使用基于 UDP 协议的 QUIC 协议来实现。

### HTTP/1.x连接管理

HTTP 的传输协议主要依赖于 TCP 来提供从客户端到服务器端之间的连接。在早期，HTTP 使用一个简单的模型来处理这样的连接。这些连接的生命周期是短暂的：每发起一个请求时都会创建一个新的连接，并在收到应答时立即关闭。

打开每一个 TCP 连接都是相当耗费资源的操作：当请求发起时，网络延迟和带宽都会对性能造成影响。现代浏览器往往要发起很多次请求（十几个或者更多）才能拿到所需的完整信息，证明了这个早期模型的效率低下。

HTTP/1.1 新增了两种连接模型：长连接模型、HTTP 流水线模型。

![HTTP1_x_Connections.png](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/HTTP1_x_Connections.png)

#### 短连接

HTTP 最早期的模型，也是  HTTP/1.0 的默认模型，是短连接。每一个 HTTP 请求都由它自己独立的连接完成；这意味着发起每一个 HTTP 请求之前都会有一次 TCP 握手，而且是连续不断的。

TCP 协议握手本身就是耗费时间的，所以 TCP 可以保持更多的热连接来适应负载。短连接破坏了 TCP 具备的能力，新的冷连接降低了其性能。

HTTP/1.0 默认是短连接模型（如果没有指定 Connection 协议头，或者是值被设置为 close），而在 HTTP/1.1 中，只有当 Connection 被设置为 close 时才会用到这个模型。

#### 长连接

短连接有两个比较大的问题：创建新连接耗费的时间尤为明显，另外 TCP 连接的性能只有在该连接被使用一段时间后（热连接）才能得到改善。

为了缓解这些问题，长连接的概念便被设计出来了，甚至在 HTTP/1.1 之前，被称为一个 keep-alive 连接。

一个长连接会保持一段时间，重复用于发送一系列请求，节省了新建 TCP 连接握手的时间，还可以利用 TCP 的性能增强能力。当然这个连接也不会一直保留着：**连接在空闲一段时间后会被关闭** （服务器可以使用 Keep-Alive 协议头来指定一个最小的连接保持时间）。

长连接也还是有缺点的：就算是在空闲状态，它还是会消耗服务器资源，而且在重负载时，还有可能遭受 DoS 攻击（拒绝服务攻击，通过大量请求压垮或淹没目标计算机）。这种场景下，可以使用非长连接，即尽快关闭那些空闲的连接，也能对性能有所提升。

HTTP/1.0 默认是短连接，把 Connection 设置成 close 以外的其它参数都可以让其保持长连接，通常会设置为 retry-after。

HTTP/1.1 默认是长连接，协议头都不用再去声明它（一般建议加上，以防某种原因要退回到 HTTP/1.0）。

#### HTTP流水线模型

默认情况下，HTTP 请求是按顺序发出的。下一个请求只有在当前请求收到应答过后才会被发出。由于会受到网络延迟和带宽的限制，在下一个请求被发送到服务器之前，可能需要等待很长时间。

流水线是在**同一条长连接上发出连续的请求**，而不用等待应答返回。这样可以避免连接延迟。理论上讲，性能还会因为两个 HTTP 请求有可能被打包到一个 TCP 消息包中而得到提升。就算 HTTP 请求不断的继续，尺寸会增加，但设置 TCP 的 MSS（Maximum Segment Size）选项，仍然足够包含一系列简单的请求。

并不是所有类型的 HTTP 请求都能用到流水线：只有 idempotent（ 幂等）方式，比如 GET、HEAD、PUT 和 DELETE 能够被安全的重试，如果有故障发生时，流水线的内容要能被轻易的重试。

它比长连接更先进一些，多个连续的请求甚至都不用等待立即返回就可以被发送，这样就减少了耗费在网络延迟上的时间。

今天，所有遵循 HTTP/1.1 的代理和服务器都应该支持流水线，虽然实际情况中还是有很多限制：一个很重要的原因是，目前没有现代浏览器默认启用这个特性。

> 现代浏览器不默认启用 HTTP 流水线模型：
>
> * 各代理服务器可能有各种莫名其妙的行为；
> * 正确的实现流水线是复杂的：传输中的资源大小、多少有效的 RTT 会被用到，还有有效带宽，流水线带来的改善有多大的影响范围。不知道这些的话，**重要的消息可能被延迟到不重要的消息后面**。这个重要性的概念甚至会演变为影响到页面布局！因此 HTTP 流水线在大多数情况下带来的改善并不明显。
> * 流水线受制于 HOL 问题，即队头阻塞，在计算机网络的范畴中是一种性能受限的现象，原因是一列的第一个数据包（队头）受阻而导致整列数据包受阻。
>
> 由于这些原因，流水线已经被更好的算法给代替，如多路复用，已经用在 HTTP/2。

### HTTP请求方法

HTTP 定义了一组请求方法，以表明要对给定资源执行的操作。每一个请求方法都实现了不同的语义：

- GET： 请求一个指定资源，应该只用于获取数据；
- HEAD： 请求一个与 GET 请求的响应相同的响应，但没有响应体；
- POST： 用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用；
- PUT： 请求有效载荷替换目标资源的所有当前表示；
- DELETE： 删除指定的资源；
- CONNECT： 建立一个到由目标资源标识的服务器的隧道；
- OPTIONS： 描述目标资源的通信选项；
- TRACE： 沿着到目标资源的路径执行一个消息环回测试；
- PATCH： 用于对资源应用部分修改。

### TCP的三次握手四次挥手

三次握手指的是 **TCP 连接阶段** ，收发信息双方的三次操作。
四次挥手指的是 **TCP 关闭阶段** ，收发信息双方的四次操作。

#### TCP报文

* SYN（同步标志）： 同步序列编号（Synchronize Sequence Numbers），表示建立连接，在连接建立时同步序号，SYN=1 时表示这是一个连接请求或连接接受报文。
* ACK（确认标志）： 确认编号（Acknowledgement Number），表示响应，确认序号是否有效，为 1 时有效，为 0 时无效。TCP 规定连接建立后传送报文段 ACK=1。
* FIN（结束标志）：表示关闭连接，值为 1 表示要发送的数据报已经发送完毕，需要释放传送连接。
* PSH（推标志）：表示有 DATA 数据传输，接收方应该尽快将这个报文交给应用层。
* RST（复位标志）：表示连接重置，值为 1 时表示 TCP 连接存在严重的错误，需要重新进行连接。
* URG（紧急标志）：当值为 1  时表示次报文段中有需要紧急处理。

在 TCP 层，有个 FLAGS 字段，这个字段有以下几个标识：SYN、ACK、FIN、PSH、RST、URG。其中，对于我们日常的分析有用的就是前面的五个字段。

它们的含义是：SYN 表示建立连接，ACK 表示响应，FIN 表示关闭连接，PSH 表示有 DATA 数据传输，RST 表示连接重置。其中，ACK 是可以与 SYN，FIN 等同时使用的，比如 SYN 和 ACK 可能同时为 1，它表示的就是建立连接之后的响应，如果只是单个的一个 SYN，它表示的只是建立连接。

#### 三次握手

TCP 三次握手，其实就是建立一个 TCP 连接，客户端与服务器交互需要 3 个数据包。握手的主要作用就是为了确认双方的接收和发送能力是否正常，初始序列号，交换窗口大小以及 MSS 等信息。

刚开始客户端处于 CLOSED 的状态，服务端处于 LISTEN 状态，然后：

* 客户端发送连接请求：客户端发送 SYN 报文，并进入 SYN_SENT 状态，等待服务器的确认；；
* 服务端响应连接请求：服务器收到 SYN 报文，需要给客户端发送 ACK 确认报文，同时服务器也要向客户端发送一个 SYN 报文，所以也就是向客户端发送 SYN + ACK 报文，此时服务器进入 SYN_RCVD 状态；
* 客户端接收到服务端的应答请求：客户端收到 SYN + ACK 报文，向服务器发送确认包，客户端进入 ESTABLISHED 状态。

待服务器收到客户端发送的 ACK 包也会进入 ESTABLISHED 状态，至此，TCP 握手结束。

第一次握手可确定，客户端的发送能力是正常的；第二次握手可确定服务端的接收、发送能力是正常的；第三次握手可确定客户端的接收能力是正常的。所以，只有三次握手才能确认双方的接收与发送能力是否正常。

#### 四次挥手

当应用程序不需要数据通信了，就会发起断开 TCP 连接（客户端或服务器均可主动发起）。建立一个连接需要三次握手，而终止一个连接需要经过四次挥手。

四次挥手是为确保数据能够完成传输，而不是发送 FIN 报文后对方立即关闭连接。

刚开始双方都处于 ESTABLISHED 状态，假如是客户端主动发起关闭请求，则：

* 客户端发送断开连接请求：客户端发起 FIN 包（FIN = 1），客户端进入 FIN_WAIT_1 状态。TCP 规定，即使 FIN 包不携带数据，也要消耗一个序号。
* 服务端响应断开连接请求：服务器端收到 FIN 包，发出确认包 ACK（ack = u + 1），并带上自己的序号 seq=v，服务器端进入了 CLOSE_WAIT 状态。这个时候客户端已经没有数据要发送了，不过服务器端可能还有数据要发送，客户端依然需要接收。客户端接收到服务器端发送的 ACK 后，进入了 FIN_WAIT_2 状态，此时，客户端等待服务器发起关闭请求。
* 服务端发送断开连接请求：服务器端数据发送完毕后，向客户端发送 FIN 包（seq=w ack=u+1），半连接状态下服务器可能又发送了一些数据，假设发送 seq 为 w。服务器此时进入了 LAST_ACK 状态。
* 客户端接收到断开连接请求：客户端收到服务器的 FIN 包后，发出确认包（ACK=1，ack=w+1），此时客户端就进入了 TIME_WAIT 状态。**注意此时 TCP 连接还没有释放。**

服务端收到 ACK 报文之后，就处于关闭连接了，处于 CLOSED 状态。等待 2MSL（最长报文段寿命），主动关闭的一方，结束 TIME-WAIT，进入 CLOSED 状态。

### HTTPS

HTTPS 是以安全为目标的 HTTP 通道，简单讲是 HTTP 的安全版，即 HTTP + SSL/TLS，HTTPS 的安全基础是 SSL，通过 SSL 证书来验证服务器的身份，并为浏览器和服务器之间的通信进行加密。

HTTPS 协议的主要作用可以分为两种：一种是建立一个信息安全通道，来保证数据传输的安全；另一种就是确认网站的真实性。

#### SSL/TLS 是什么？

SSL 和 TLS 协议可以为通信双方提供识别和认证通道，从而保证通信的机密性和数据完整性。

SSL（Secure Socket Layer，安全套接层）是一种安全协议，用于保护互联网通信的安全性和数据完整性，是 1994 年由 Netscape 公司设计的一套协议，并与1995 年发布了 3.0 版本。SSL 协议可分为两层：SSL 记录协议（SSL Record Protocol），它建立在可靠的传输协议（如 TCP）之上，为高层协议提供数据封装、压缩、加密等基本功能的支持。SSL 握手协议（SSL Handshake Protocol），它建立在 SSL 记录协议之上，用于在实际的数据传输开始前，通讯双方进行身份认证、协商加密算法、交换加密密钥等。

SSL 是一种较老的技术，包含一些安全漏洞（漏洞并非源自于协议，而是人为的错误产生的，即未严格按照协议的要求配置），而 **TLS（Transport Layer Security，传输层安全协议）**是 IETF 在 SSL3.0 基础上设计的协议，是 SSL 的升级版本，修复了 SSL 漏洞。

**TLS** 是 Transport Layer Security 的缩写，中文翻译 **传输层安全性协议**。它决定了什么密码将会被用来加密通信，验证服务器，在进行真实的数据传输之前建立安全连接。 相比 HTTP 协议，HTTPS 就是多一个 TLS 协议握手过程，目的是为了通过非对称加密握手协商或者交换出对称加密密钥。

**注意： SSL 协议 和 TLS 协议是不兼容的。目前，所有 SSL 证书均已停用。TLS 证书是行业标准。但是，业界仍使用术语 SSL 来指代 TLS 证书。**

SSL 发展史：

- 1994 年 NetSpace 公司设计 SSL 协议1.0 版本，但未发布；
- 1995 年 NetSpace 发布 SSL/2.0 版本，很快发现有严重漏洞；
- 1996 年发布 SSL/3.0 版本，得到大规模应用；
- 1999 年，发布了 SSL 升级版 TLS/1.0 版本，目前应用最广泛的版本；
- 2006 年和 2008 年，发布了 TLS/1.1 版本和 TLS/1.2 版本。

#### TLS 四次握手

握手一般是通信的前置动作，即达成某种约定，比如 TCP 握手是要确定双端的接收、发送能力等；而 TLS 握手则是为了验证身份、交换信息从而生成秘钥，为后续加密通信做准备。

不论客户端和服务端的连接走 HTTP 还是 HTTPS，所有连接最初都要经过 TCP 三次握手，而 HTTPS 连接，在 TCP 建立连接之后， 还需要 TLS 四次握手。**因此，HTTPS 首次通信需要 7 次握手！**

TLS 主要分为两层：上层是 TLS 握手协议，有握手协议、密码规格变更协议、警告协议、应用数据协议 4 个部分；底层的是 TLS 记录协议，主要负责使用对称密码对消息进行加密。

**握手协议**负责通信双方交换消息（版本号、密码套件、证书、随机数）以相互确认，彼此验证，并商定它们将使用的密码套件，以及生成一致的会话密钥。**握手协议**是 TLS 协议中非常重要且最最复杂的部分。

在 TLS 握手过程中，客户端和服务器交互：

- 指定将要使用的 TLS 版本（TLS 1.0、1.2、1.3 等）；
- 决定将要使用哪些密码套件（密码套件是一组用于建立安全通信连接的算法）；
- 通过服务器的公钥和证书颁发机构的数字签名来验证服务器的身份；
- 生成会话密钥，以在握手完成后使用对称加密。

**TLS 握手协议涉及四次通信：**

* **客户端问候（client hello）消息：** 客户端向服务端发送 Client Hello 消息来开始握手，该消息携带**客户端支持的 TLS 版本、密码套件、客户端随机数**。
* **服务器回应（server hello）消息：** 服务端收到客户端的 client hello 消息后：
  * 向客户端发送 Server Hello 消息，并携带**服务端支持的 TLS 版本、密码套件、服务端随机数、会话id**。
  * 向客户端发送 Certificate 消息（服务端的证书），包含**证书支持的域名、发行方和有效期等信息**。
  * 向客户端发送 Server Key Exchange （服务器密钥交换）消息，传递公钥、签名等信息。
  * 向客户端发送 CertificateRequest 消息**（可选）**，验证客户端证书。
  * 向客户端发送 Server Hello Done 消息，通知已经发送了全部的信息。
* **客户端回应：** 客户端接收服务器回应，先验证服务器证书。如果证书不是可信机构颁布、或者证书中的域名与实际域名不一致、或者证书已经过期，就会向访问者显示一个警告，询问是否还要继续通信；如果证书没问题，客户端从证书中取出服务器的公钥，然后向服务器发送消息。
  * 向服务端发送 Client Key Exchange（客户端密钥交换） 消息，包含使用服务端公钥加密的随机字符串，即**预主密钥（Pre Master Secret）**。
  * 向服务端发送 Change Cipher Spec （更改密钥规格）消息，通知服务端后续数据会加密传输。
  * 向服务端发送 Finished 消息，其中包含加密后的握手信息。
* **服务器的最后回应：** 服务器接收客户端的第三个随机数（pre-master key）之后，计算生成本次会话所用的**会话密钥**，然后向客户端最后发送消息。
  * 向客户端发送 Change Cipher Spec（更改密钥规格）消息，通知客户端后续数据会加密传输。
  * 向客户端发送 Finished 消息，验证客户端的 Finished 消息并完成 TLS 握手。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/HM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDA0NTMyOA==.jpg)

TLS 握手的关键在于利用通信双方生成的随机字符串和服务端的公钥生成一个双方经过协商后的密钥，通信双方后续使用这个对称密钥加密数据，防止中间人监听和攻击，保障通信安全。

**虽然建立安全连接对增加了加载页面的等待时间，对于建立一个安全的连接来说，以增加等待时间为代价是值得的，因为在浏览器和web服务器之间传输的数据不可以被第三方解密。**

#### HTTPS 请求过程

* 客户端向服务器发起 HTTPS 的请求，连接到服务器的 443 端口；
* 服务器将**非对称加密**（即加密使用的密钥和解密使用的密钥是不相同的，分别称为公钥、私钥）的公钥传递给客户端，以证书的形式回传到客户端；
* 客户端接受到该公钥进行验证，如果有问题，则 HTTPS 请求无法继续；如果没有问题，客户端这个时候随机生成一个私钥，称为 client key，用于对称加密数据。使用前面的公钥对 client key 进行非对称加密，将加密之后的 client key 传递给服务器；
* 服务器使用私钥进行解密，得到 client key，使用 client key 对数据进行对称加密；
* 将对称加密的数据传递给客户端，客户端使用对称解密，得到服务器发送的数据。

**注意：** 采用 HTTPS 协议的服务器必须要有一套数字证书（其实就是一对公钥和私钥），可以自己制作，也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面。

#### HTTP2.0 相对于 HTTP1.x 的改进

- **头部压缩： **在 HTTP/1.1 及之前的时代，请求体一般会有响应的压缩编码过程，通过 Content-Encoding 头部字段来指定，而 HTTP1.x 的 header 也带有大量信息，而且每次都要重复发送（当请求字段非常复杂的时候，尤其对于 GET 请求，请求报文几乎全是请求头。因此，HTTP/2 针对头部字段，也采用了对应的压缩算法—— HPACK（专门为 HTTP/2 服务），对请求头进行压缩。
- **二进制格式（解析起来更高效）：** HTTP1.x 协议里的报文（主要指的是头部）不使用二进制数据，而是**文本形式**（文本、图片、视频等任意数据）；HTTP/2 是采用二进制传输数据，将原来 Headers + Body 的报文格式拆分成了一个个二进制的帧，用 Headers 帧存放头部字段，Data 帧存放请求体数据。
- **设置请求优先级：** 通信双方都可以给对方发送二进制帧，这种二进制帧的双向传输的序列，也叫做流 (Stream) 。HTTP/2 中传输的帧，每个帧分为帧头和帧体，帧头包括：帧长度、帧类型（有数据帧和控制帧两种）、帧标志、流标识符，可以在数据帧设置优先级，让服务端先处理重要资源，优化用户体验。
- **多路复用：** 一个 HTTP/2 连接上可以同时发多个帧，这一点和 HTTP/1 不同。HTTP/2 用流来在一个 TCP 连接上来进行多个数据帧的通信，这就是多路复用的概念。
- **服务器推送：** 在 HTTP/2 当中，服务器已经不再是完全被动地接收请求，响应请求，它也能新建 stream 来给客户端发送消息，当 TCP 连接建立之后，比如浏览器请求一个 HTML 文件，服务器就可以在返回 HTML 的基础上，将 HTML 中引用到的其他资源文件一起返回给客户端，减少客户端的等待。

#### HTTPS 的优缺点

HTTPS 的优点：

* 使用 HTTPS 协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；
* HTTPS 协议是由 SSL + HTTP 协议构建的可进行加密传输、身份认证的网络协议，要比 HTTP 协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性；
* HTTPS 是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本；
* 谷歌曾在 2014 年 8 月份调整搜索引擎算法，并称“比起同等 HTTP 网站，采用 HTTPS 加密的网站在搜索结果中的排名将会更高”。

HTTPS 的缺点：

* HTTPS 协议多次握手，导致页面的加载时间延长近 50%；
* HTTPS 连接缓存不如 HTTP 高效，会增加数据开销和功耗；
* 申请 SSL 证书需要钱，功能越强大的证书费用越高；
* SSL 涉及到的安全算法会消耗 CPU 资源，对服务器资源消耗较大；
* 加密范围有限，在黑客攻击、拒绝服务攻击、服务器劫持等方面几乎起不到什么作用。最关键的，SSL 证书的信用链体系并不安全，特别是在某些国家可以控制 CA 根证书的情况下，中间人攻击一样可行。

### 相关问题

#### HTTP 和 HTTPS 有什么区别？

* HTTPS 协议需要到 CA （Certificate Authority，证书颁发机构）申请证书，一般免费证书较少，因而需要一定费用；
* HTTP 是超文本传输协议，信息是明文传输，HTTPS 则是具有安全性的 SSL 加密传输协议；
* HTTP 和 HTTPS 使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443；
* HTTP 的连接很简单，是无状态的。HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全。

#### HTTP1.x、HTTP2.0、HTTPS 的区别

- HTTPS 是对 HTTP 的安全方面优化
- HTTP2.0 是对 HTTP 的性能方面优化

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/summary.png)

#### 为什么建立连接握手三次，关闭连接时需要是四次呢？

其实在 TCP 握手的时候，接收端发送 SYN+ACK 的包是将一个 ACK 和一个 SYN 合并到一个包中，所以减少了一次包的发送，三次完成握手。

对于四次挥手，因为 TCP 是全双工通信，在主动关闭方发送 FIN 包后，接收端可能还要发送数据，不能立即关闭服务器端到客户端的数据通道，所以也就不能将服务器端的 FIN 包与对客户端的 ACK 包合并发送，只能先确认 ACK，然后服务器待无需发送数据时再发送 FIN 包，所以四次挥手时必须是四次数据包的交互。

#### 为什么 TIME_WAIT 状态需要经过 2MSL 才能返回到 CLOSE 状态？

MSL 指的是报文在网络中最大生存时间。在客户端发送对服务器端的 FIN 的确认包 ACK 后，这个 ACK 包是有可能不可达的，服务器端如果收不到 ACK 的话需要重新发送 FIN 包。

所以客户端发送 ACK 后需要留出 2MSL 时间（ACK 到达服务器 + 服务器发送 FIN 重传包，一来一回）等待确认服务器端确实收到了 ACK 包。

也就是说客户端如果等待 2MSL 时间也没有收到服务器端的重传包 FIN，说明可以确认服务器已经收到客户端发送的 ACK。

另一个原因是：避免新旧连接混淆。

在客户端发送完最后一个 ACK 报文段后，在经过 2MSL 时间，就可以使本连接持续的时间内所产生的所有报文都从网络中消失，使下一个新的连接中不会出现这种旧的连接请求报文。

你要知道，有些自作主张的路由器会缓存 IP 数据包，如果连接重用了，那么这些延迟收到的包就有可能会跟新连接混在一起。

#### TCP和UDP有什么区别？

* TCP 是面向连接的，而UDP 是无连接（即发送数据前不需要先建立链接）；
* TCP 是可靠的，保证数据正确性（按序、不丢失、不重复），而 UDP 是不可靠的，可能丢包等问题；
* TCP 只能是 1 对 1，而 UDP 支持 1 对 1、1 对多；
* TCP 是面向字节流，而 UDP 面向报文，UDP 具有较好的实时性，工作效率比 TCP 高，并且网络出现拥塞不会使得发送速率降低（因此会出现丢包，适用于实时的应用，如 IP 电话、视频会议等）；
* TCP 对系统资源要求较多；
* TCP 的首部为 20 字节，而 UDP 只有 8 字节。

#### GET 和 POST 请求有什么区别？

在客户机和服务器之间进行请求-响应时，两种最常被用到的方法是：GET 和 POST。GET 从指定的资源请求数据，POST 向指定的资源提交要被处理的数据。

最直观的区别就是 GET 把参数包含在 URL 中（更不安全），POST 通过 Request Body 传递参数。

两者区别如下：

* GET 在浏览器回退时是无害的，而 POST 会再次提交请求；
* GET 请求会被浏览器主动缓存，而 POST 不会，除非手动设置；
* GET 请求只能进行 URL 编码，而 POST 支持多种编码方式；
* GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留；
* GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有（HTTP 协议并未规定两者的长度限制，但浏览器和 Web 服务器限制了 GET 请求的 URL 长度）；
* GET 只接受 ASCII 字符，而 POST 没有限制；
* GET 会把 HTTP header 和 Data一并发送出去，服务器响应200（返回数据）；而 POST 先发送 Header，服务器响应 100 continue，再发送 Data，服务器响应 200 ok（返回数据）；
* GET 请求比 POST 请求快，因为，GET 请求少一步，且可以缓存。

#### 浏览器支持同时开启多少个请求？

对于同一个域名，一般 PC 端浏览器会对单个域名的服务器同时建立 6 ～ 8 个连接，移动端则一般控制在 4 ～ 6 个（根据浏览器内核不同可能会有所差异），超过浏览器最大连接数，后续请求就会被阻塞。

### 参考资料

[MDN HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

[MDN HTTP的发展](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)

[MDN HTTP/1.x 的连接管理](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Connection_management_in_HTTP_1.x)

[Http系列(-) Http发展历史](https://juejin.cn/post/6844903935640240136)

[网络七层协议](https://baike.baidu.com/item/%E7%BD%91%E7%BB%9C%E4%B8%83%E5%B1%82%E5%8D%8F%E8%AE%AE/6056879)

[计算机网络的七层结构、五层结构和四层结构](https://segmentfault.com/a/1190000039204681)

[淘宝二面，面试官居然把TCP三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

[HTTPS详细解析、TLS四次握手](https://blog.csdn.net/weixin_44045328/article/details/107179755)

[sources/三次握手、七次握手、四次挥手](https://github.com/pro648/tips/blob/master/sources/%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E3%80%81%E4%B8%83%E6%AC%A1%E6%8F%A1%E6%89%8B%E3%80%81%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B.md)

[浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/)

[HTTP1.x、HTTP2.0、HTTPS 傻傻也要分清楚](https://blackpearl.fun/zh/technology/network/http)