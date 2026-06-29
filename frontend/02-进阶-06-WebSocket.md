## 进阶篇：WebSocket

WebSocket 是一种网络通信协议，于 2008 年诞生，2011 年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。WebSocket 允许服务器端与客户端进行全双工（full-duplex）的通信。

其特点包括：

- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
- 数据格式比较轻量，性能开销小，通信高效。
- 可以发送文本，也可以发送二进制数据。
- 没有同源限制，客户端可以与任意服务器通信，完全可以取代 Ajax。
- 协议标识符是 `ws`（如果加密，则为 `wss`，对应 HTTPS 协议），服务器网址就是 URL。

### WebSocket协议是如何工作的？

WebSocket 并不是全新的协议，而是利用了 HTTP 协议来建立连接。WebSocket 连接必须由浏览器发起，且发送的请求协议是一个标准的 HTTP 请求。

格式如下：

```shell
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

请求 Header 字段意义如下：

* **Connection: Upgrade：** 表示要升级协议；

* **Upgrade: websocket：** 表示要升级到 WebSocket 协议；

* **Sec-WebSocket-Version: 13：** 表示 WebSocket 的版本。如果服务端不支持该版本，需要返回一个 `Sec-WebSocket-Versionheader`，里面包含服务端支持的版本号；

* **Sec-WebSocket-Key：** 与服务端响应 Header 的 Sec-WebSocket-Accept 是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

随后，服务器如果接受该请求，就会返回如下响应。到此完成协议升级，后续的数据交互都按照新的协议来。

```shell
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

响应 Header 字段意义如下：

* **响应代码  101 ：** 表示本次连接的 HTTP 协议即将被更改；
* **Connection: Upgrade：** 表示协议将升级；
* **Upgrade: websocket：** 表示更改为 WebSocket 协议；
* **Sec-WebSocket-Accept：** 根据客户端请求首部的 Sec-WebSocket-Key 计算出来。计算公式为：将请求 Header 的 `Sec-WebSocket-Key` 跟 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 拼接，通过 `SHA1` 计算出摘要，并转成 `base64` 字符串。

实际上，HTTP 协议是建立在 TCP 协议之上的，TCP 协议本身就实现了全双工通信，但是 HTTP 协议的 **请求－应答机制** 限制了全双工通信。WebSocket 连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用 HTTP 协议了，直接互相发数据吧。

安全的 WebSocket 连接机制和 HTTPS 类似。浏览器用 `wss://xxx` 创建 WebSocket 连接时，会先通过 HTTPS 创建安全的连接，然后，将 HTTPS 升级为 WebSocket 协议，底层通信走的仍然是安全的 SSL/TLS 协议。

### 客户端

浏览器对 WebSocket 协议的处理，无非就是三件事：

- 建立连接和断开连接；
- 发送数据和接收数据；
- 处理错误。

用法相当简单：

```javascript
const ws = new WebSocket('ws://localhost:8080')
ws.onopen = function () {
    console.log('连接成功！')
    ws.send('Hello, I am Lizhao!')
    setInterval(() => {
        ws.send('What time is it now? ')
    }, 3000)
}
ws.onmessage = function (e) {
    console.log('服务端响应: ' + e.data)
}
ws.onclose = function (evt) {
    console.log('Bye, WebSocket!')
}
```

#### 构造函数

WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例：

```javascript
const ws = new WebSocket('ws://localhost:8080')
```

执行上面语句之后，客户端就会与服务器进行连接。

#### 属性

* readyState（只读）： 当前的链接状态，共有四种：
  - CONNECTING：值为 0，表示正在连接。
  - OPEN：值为 1，表示连接成功，可以通信了。
  - CLOSING：值为 2，表示连接正在关闭。
  - CLOSED：值为 3，表示连接已经关闭，或者打开连接失败。
* binaryType： 返回 WebSocket 连接所传输二进制数据的类型，可能值：blob | arraybuffer。
* bufferedAmount（只读）： 未发送至服务器的字节数。
* extensions（只读）： 返回服务器已选择的扩展值。目前，可以协定的扩展值只有空字符串或者一个扩展列表。
* protocol（只读）： 服务器选择的下属协议。
* url（只读）： WebSocket 的绝对路径。

#### 事件

* open： 指定连接成功后的回调函数。
* message： 指定收到服务器数据后的回调函数。
* close： 指定连接关闭后的回调函数。
* error： 指定报错时的回调函数。

可以直接为这四个事件定义函数，可以使用 `addEventListener` 方法。

```javascript
ws.onopen = function(event) {}
ws.onmessage = function(event) {}
ws.onclose = function(event) {}
ws.onerror = function(event) {}

ws.addEventListener('open', event => {})
ws.addEventListener('onmessage', event => {})
ws.addEventListener('onclose', event => {})
ws.addEventListener('onerror', event => {})
```

#### 方法

* send()： 向服务器发送数据。可以发送文本、Blob 对象、ArrayBuffer 对象：

  ```javascript
  ws.send('your message')
  ws.send(document.querySelector('input[type="file"]').files[0])
  
  const img = canvas_context.getImageData(0, 0, 400, 320)
  const binary = new Uint8Array(img.data.length)
  for (let i = 0 i < img.data.length i++) {
      binary[i] = img.data[i]
  }
  ws.send(binary.buffer)
  ```

* close()： 关闭连接。

### 服务端

要使用 WebSocket，关键在于服务器端支持。WebSocket 在服务端的实现非常丰富，Node.js、Java、C++、Python 等多种语言都有自己的解决方案。

以下通过 Node.js 的 `ws` 包来启动 WebSocket 连接：

```javascript
const app = require('express')()
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', (ws) => {
    console.log('连接成功！')
    ws.on('message', (message) => {
        console.log('客户端信息：', message)
        ws.send('Hello, I am WebSocket!')
    })
    setInterval(() => {
        ws.send('This time is ' + new Date().getTime())
    }, 1000)
})

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html')
})
app.listen(3000)
```

其他常用的 Node 实现：

- [uWebSockets](https://github.com/uNetworking/uWebSockets)

- [Socket.IO](https://socket.io/get-started/chat)

- [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

- [WebSocketd](http://websocketd.com/)，它的最大特点，就是后台脚本不限语言，标准输入（stdin）就是 WebSocket 的输入，标准输出（stdout）就是 WebSocket 的输出。

  ```shell
  websocketd --port=8080 bash ./my.sh
  ```

  上面的命令会启动一个 WebSocket 服务器，端口是 8080。每当客户端连接这个服务器，就会执行指定脚本，并将它的输出推送给客户端。

  ```shell
  websocketd --port=8080 ls
  ```

  上面的命令会执行 `ls` 命令，从而将当前目录的内容，发给浏览器。使用这种方式实时监控服务器，简直是轻而易举。

  websocketd 的实质，就是命令行的 WebSocket 代理。只要命令行可以执行的程序，都可以通过它与浏览器进行 WebSocket 通信。

### 相关问题

#### WebSocket 与 HTTP 的区别

HTTP 协议是一个请求－响应协议，请求必须先由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。换句话说，浏览器不主动请求，服务器是没法主动发数据给浏览器的。

在一个 HTTP 长连接中，可以发送多个 Request，接收多个 Response。

其中，HTTP0.9、HTTP1.0、HTTP1.1 又有些差别：

* HTTP0.9 是第一个版本的 HTTP 协议，它具有 HTTP 协议典型的无状态的特点，发送一个 Request，接收一个 Response，之后这次 HTTP 请求就结束了。
* HTTP1.0 开始支持长连接（但默认还是短连接）。如果使用长连接，需要添加请求头 `Connection: keep-alive`。
* HTTP1.1 起，浏览器和服务器默认开启 `Keep-Alive`。客户端和服务器都能选择随时关闭连接，在 Header 中加 `Connection:close` 即可。

在一个 HTTP 长连接中，可以发送多个 Request，接收多个 Response。

WebSocket  是 HTML5 开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于 TCP 传输协议，并复用 HTTP 的握手通道，其实跟 HTTP 协议基本没有关系，只是为了兼容现有浏览器的握手协议而已。

HTTP 长连接和 WebSocket  最大区别在于：HTTP 长连接中，**一个 Request 只能有一个 Response，且 Response 是被动的，不能主动发起；** WebSocket  连接中，双方都可以随时互相发送信息，服务端可以主动发起信息。

#### WebSocket的替代方案

WebSocket 的目的就是解决网络传输中的双向通信（客户端要向服务器传送数据，同时服务器也需要实时的向客户端传送信息）的问题，如果你不想或者由于兼容性无法使用 WebSocket，可以考虑以下几种解决方案：

* **轮询：** 即通过 `setInterval`、`setTimeout` 等方法，每隔一段时候，就发出一个询问，了解服务器有没有新的信息。轮询就会造成对网络和通信双方的资源的浪费，且通信非实时（隔多长时间发出一个询问需要慎重考虑）。
* **长轮询：** 与轮询类似，不过采取的是阻塞模型，也就是说，客户端发起连接后，如果没消息，就一直不返回 Response 给客户端。直到有消息才返回，返回完之后，客户端再次建立连接，周而复始。
* **长连接：** 在 HTTP/1.1 版本中，默认的连接都是长连接。HTTP 协议的长连接本质上就是 TCP 的长连接，即 TCP 连接默认不关闭，可以被多个请求复用。长连接仍然会造成资源的浪费（服务器需要一直保存和客户端的连接）、实时性不强等问题。

### 参考资料

[阮一峰 WebSocket 教程](https://www.ruanyifeng.com/blog/2017/05/websocket.html)

[廖雪峰 WebSocket](https://www.liaoxuefeng.com/wiki/1022910821149312/1103303693824096)

[WebSocket 从入门到精通，半小时就够！](https://xie.infoq.cn/article/cf37aed6cb4410719f112d587)

[MDN WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

