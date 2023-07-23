## Node.js：HTTP

HTTP 核心模块是 Node.js 网络的关键模块。

Node.js 中的 HTTP 接口被设计成支持协议的许多特性。 比如，大块编码的消息。 这些接口不缓冲完整的请求或响应，用户能够以流的形式处理数据。

```javascript
const http = require('http')

const hostname = '0.0.0.0'
const port = 3000
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('你好，李兆！')
})
server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
```

### http类

HTTP 模块提供了 5 个类：

#### Server 类

该类继承自 net.Server。

当使用 createServer() 创建新的服务器时，通常会实例化并返回此类。

```javascript
const http = require('http')
const url = require('url')

const hostname = '0.0.0.0'
const port = 3000
const server = http.createServer((message, res) => {
  res.statusCode = 200
  res.statusMessage = 'OKkk'
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
})
server.on('request', (message, res) => {
  const urlObj = url.parse(message.url)
  const searchParamsObj = new url.URLSearchParams(urlObj.query)
  res.write(searchParamsObj.get('name') || 'Lizhao01!')
  res.end()
})
server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
```

##### checkContinue 事件

每当接收到一个带有 HTTP `Expect: 100-continue` 请求头的请求时触发。如果该事件未被监听，则服务器会自动响应 `100 Continue`。

处理该事件时，如果客户端应该继续发送请求主体，则调用 response.writeContinue()，否则生成一个适当的 HTTP 响应（例如 400 错误请求）。

**注意：** 当该事件被触发且处理后，request 事件不会被触发。

##### checkExpectation 事件

每当接收到一个带有 HTTP Expect 请求头值不为 100-continue 的请求时触发。 如果该事件未被监听，则服务器会自动响应 `417 Expectation Failed`。

**注意：** 当该事件被触发且处理后，request 事件不会被触发。

##### clientError 事件

当客户端触发了一个 error 时触发。默认情况下，请求异常时会立即销毁 socket。

##### close 事件

当服务器关闭时触发。

##### connect 事件

每当客户端发送 HTTP `CONNECT` 请求时触发。 如果该事件未被监听，则发送 CONNECT 请求的客户端会关闭连接。

##### connection 事件

当新的 TCP 流被建立时触发。

##### request 事件

每次接收到一个请求时触发。

**注意：** 每个连接可能有多个请求（在 HTTP keep-alive 连接的情况下）。

##### upgrade 事件

每当客户端发送 HTTP `upgrade` 请求时触发。 如果该事件未被监听，则发送 upgrade 请求的客户端会关闭连接。

##### close([callback])

停止服务端接收新的连接。

##### listen()

开启HTTP服务器监听连接。

##### setTimeout()

设置超时时间（毫秒）。 如果发生超时，则触 timeout 事件。

```javascript
server.setTimeout([msecs][, callback])
```

##### listening

返回一个布尔值，表示服务器是否正在监听连接。

##### maxHeadersCount

限制请求头的最大数量，默认为 2000。 如果设为 0，则没有限制。

##### timeout

读取或设备 socket 超时时间，以毫秒为单位。默认为 120000（2 分钟）。

值设为 0 可禁用请求连接的超时行为。

**注意：** socket 的超时逻辑是在连接上设定的，所以改变这个值只影响服务器新建的连接，而不会影响任何已存在的连接。

##### keepAliveTimeout

读取或设置保持连接的超时毫秒，默认为 5000（5秒）。

服务器完成最后的响应之后，需要等待的额外的传入数据的活跃毫秒数，socket 才能被销毁。如果服务器在 keep-alive 计时已激活时接收到新的数据，会重置常规的非活动计时。

值为 0 时禁用传入连接 keep-alive 的超时行为。 

**注意：** socket 的超时逻辑是在连接上设定的，所以改变这个值只影响服务器新建的连接，而不会影响任何已存在的连接。

#### ClientRequest 类

当 request() 或 get() 被调用时，会创建 http.ClientRequest 对象，表示着一个正在处理的请求，其请求头已进入队列。请求头仍可使用 setHeader(name, value)、getHeader(name) 和 removeHeader(name) API 进行修改

当响应被接收时，则会使用响应（http.IncomingMessage 实例作为参数）来调用 response 事件。

返回的响应数据可以通过以下两种方式读取：

- 可以调用 response.read() 方法。
- 在 response 事件处理函数中，可以为 data 事件设置事件监听器，以便可以监听流入的数据。

**注意：** Node.js 不会检查 Content-Length 与已传输的请求主体的长度是否相等。

##### abort 事件

当请求已被客户端终止时触发。 该事件仅在首次调用 abort() 时触发。

##### connect 事件

每当服务器响应 CONNECT 请求时触发。 如果该事件未被监听，则接收到 CONNECT 方法的客户端会关闭连接。

##### continue 事件

当服务器发送了一个 100 Continue 的 HTTP 响应时触发，通常是因为请求包含 Expect: 100-continue。 这是客户端将要发送请求主体的指令。

##### response 事件

当请求的响应被接收到时触发。 该事件只触发一次。

##### socket 事件

当 socket 被分配到请求后触发。

##### timeout 事件

当底层 socket 超时的时候触发。该方法只会通知空闲的 socket。请求必须手动停止。

##### upgrade 事件

每当服务器响应 upgrade 请求时触发。 如果该事件未被监听，则接收到 upgrade 请求头的客户端会关闭连接。

##### abort()

标记请求为终止。 调用该方法将使响应中剩余的数据被丢弃且 socket 被销毁。

##### end()

结束发送请求。 如果部分请求主体还未被发送，则会刷新它们到流中。 如果请求是分块的，则会发送终止字符 '0\r\n\r\n'。

```javascript
request.end([data[, encoding]][, callback])
```

如果指定了 data，则相当于调用 request.write(data, encoding) 之后再调用 request.end(callback)。

如果指定了 callback，则当请求流结束时会被调用。

##### flushHeaders()

刷新请求头。

出于效率的考虑，Node.js 通常会缓存请求头直到 request.end() 被调用或第一块请求数据被写入。 然后 Node.js 会将请求头和数据打包成一个单一的 TCP 数据包。

通常那是期望的（因为它节省了 TCP 往返），除非第一个数据块很长时间之后才被发送。 request.flushHeaders() 可以绕过最优选择并提前开始请求。

##### getHeader(name)

读取请求头。

**注意：** name 是大小写敏感的。

##### removeHeader(name)

移除一个已经在 headers 对象里面的 header。

##### setHeader(name, value)

为 headers 对象设置一个单一的 header 值。如果该 header 已经存在了，则将会被替换。这里使用一个字符串数组来设置有相同名称的多个 headers。

##### setNoDelay([noDelay])

一旦 socket 被分配给请求且已连接，socket.setNoDelay() 会被调用。

##### setSocketKeepAlive()

一旦 socket 被分配给请求且已连接，socket.setKeepAlive() 会被调用。

```javascript
request.setSocketKeepAlive([enable][, initialDelay])
```

##### setTimeout(timeout[, callback])

一旦 socket 被分配给请求且已连接，socket.setTimeout() 会被调用。返回 request。

##### write()

发送请求主体的一个数据块。 通过多次调用该方法，一个请求主体可被发送到一个服务器，在这种情况下，当创建请求时，建议使用 ['Transfer-Encoding', 'chunked'] 请求头。

```javascript
request.write(chunk[, encoding][, callback])
```

参数说明：

* chunk：string | Buffer；
* encoding：字符串，默认值：'utf8'，仅当 chunk 是一个字符串时才有效；
* callback：回调函数，当数据块被刷新时调用。

##### aborted

如果请求已被终止，则该属性的值为请求被终止的时间，从 1970-01-01 00:00:00 UTC 到现在的毫秒数。

##### connection

引用底层 socket。 通常用户不需要访问此属性。在 response.end() 之后，该属性为 null。

**注意：** 由于协议解析器连接到 socket 的方式，socket 将不会触发 readable 事件。

##### socket

同 request.connection。

#### ServerResponse 类

该对象在 HTTP 服务器内部被创建。

该类实现了（而不是继承自）stream.Writable 接口。

##### close 事件

当底层连接在 response.end() 被调用或能够刷新之前被终止时触发。

##### finish 事件

当响应已被发送时触发。 

更具体地说，当响应头和响应主体的最后一部分已被交给操作系统通过网络进行传输时，触发该事件。 这并不意味着客户端已接收到任何东西。

该事件触发后，响应对象上不再触发其他事件。

##### addTrailers(headers)

添加 HTTP 尾部响应头（一种在消息尾部的响应头）到响应。

仅当响应使用分块编码时，尾部响应头才会被发送；否则（比如请求为 HTTP/1.0），尾部响应头会被丢弃。

发送尾部响应头之前，需先发送 Trailer 响应头，并在值里带上尾部响应头字段的列表：

```javascript
response.writeHead(200, {
  'Content-Type': 'text/plain',
  'Trailer': 'Content-MD5'
});
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```

##### end()

该方法会通知服务器，所有响应头和响应主体都已被发送，即服务器将其视为已完成。 每次响应都必须调用 response.end() 方法。

```javascript
response.end([data][, encoding][, callback])
```

如果指定了 data，则相当于调用 response.write(data, encoding) 之后再调用 response.end(callback)。

如果指定了 callback，则当响应流结束时被调用。

##### getHeader()

读取一个已入队列但尚未发送到客户端的响应头。 

```javascript
response.getHeader(name)
```

**注意：** 名称不区分大小写。

##### getHeaderNames()

返回一个包含当前响应唯一名称的 http 头信息名称数组。

**注意：** 名称均为小写。

##### getHeaders()

返回当前响应头文件的浅拷贝。

由于使用了浅拷贝，因此数组值可能会改变，无需对各种与响应头相关的http模块方法进行额外调用。 返回对象的键是响应头名称，值是各自的响应头值。 

**注意：** 所有响应头名称都是小写的。

**注意：** 该方法返回的对象不会原型继承 JavaScript Object。 这意味着，没有定义典型的 Object 方法，如，toString()、hasOwnProperty()。

##### hasHeader()

如果响应头当前有设置 name 头部，返回 true。

```javascript
response.hasHeader(name)
```

**注意：** 名称不区分大小写。

##### removeHeader()

从隐式发送的队列中移除一个响应头。

```javascript
response.removeHeader(name)
```

##### setHeader()

为一个隐式的响应头设置值。 如果该响应头已存在，则值会被覆盖。 

```javascript
setHeader(name, value)
```

如果要发送多个名称相同的响应头，则使用字符串数组：

```javascript
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```

如果响应头字段的名称或值包含无效字符，则抛出 TypeError 错误。

response.setHeader() 设置的响应头会与 response.writeHead() 设置的响应头合并，且 response.writeHead() 的优先。

##### setTimeout()

设置 socket 的超时时间（毫秒）。如果提供了回调函数，则会作为监听器被添加到 timeout 事件。

```javascript
response.setTimeout(msecs[, callback])
```

##### write()

该方法会发送一块响应主体。 它可被多次调用，以便提供连续的响应主体片段。

```javascript
response.write(chunk[, encoding][, callback])
```

如果该方法被调用且 response.writeHead() 没有被调用，则它会切换到隐式响应头模式并刷新隐式响应头。

**注意：** 在 http 模块中，当请求是 `HEAD` 请求时，响应主体被省略。 类似地，204、304响应不能包括消息体。

**注意：** response.write() 首次被调用时，会发送缓冲的响应头信息和响应主体的第一块数据到客户端；第二次被调用时，Node.js 能够确定数据会被接收，于是开始传输新数据。 也就是说，响应的完成取决于响应主体的第一块数据。

##### writeContinue()

发送一个 HTTP/1.1 100 Continue 消息到客户端，表示请求主体可以开始发送。

##### writeHead()

发送一个响应头给请求。

```javascript
response.writeHead(statusCode[, statusMessage][, headers])
```

该方法在消息中只能被调用一次，且必须在 response.end() 被调用之前调用。

**注意：** 如果在调用该方法之前调用 response.write() 或 response.end()，则隐式的响应头会被处理并调用该函数。

**注意：** response.setHeader() 设置的响应头会与 response.writeHead() 设置的响应头合并，且 response.writeHead() 的优先。

##### connection、socket

返回 底层 socket。 

##### finished

返回一个布尔值，表示响应是否已完成。 默认为 false。 执行 response.end() 之后，该值会变为 true。

##### headersSent

返回一个布尔值（只读）。 如果响应头已被发送则为 true，否则为 false。

##### sendDate

当为 true 时，如果响应头里没有日期响应头，则日期响应头会被自动生成并发送。默认为 true。

**注意：** 该属性只可在测试时被禁用，因为 HTTP 响应需要包含日期响应头。

##### statusCode

数值。当使用隐式的响应头时（没有显式地调用 response.writeHead()），该属性控制响应头刷新时将被发送到客户端的状态码。

响应头被发送到客户端后，该属性表示被发出的状态码。

##### statusMessage

字符串。当使用隐式的响应头时（没有显式地调用 response.writeHead()），该属性控制响应头刷新时将被发送到客户端的状态信息。 如果该值为 undefined，则使用状态码的标准信息。

响应头被发送到客户端后，该属性表示被发出的状态信息。

#### IncomingMessage 类

IncomingMessage 对象由 http.Server 或 http.ClientRequest 创建，并作为第一个参数分别递给 request 和 response 事件。 它可以用来访问响应状态、消息头、以及数据。

IncomingMessage 类实现了 [stream.Readable](https://www.nodeapp.cn/stream.html#stream_class_stream_readable) 接口，还有以下额外的事件、方法、以及属性。

##### aborted 事件

当请求已被终止且网络 socket 已关闭时触发。

##### close 事件

当底层连接被关闭时触发。该事件每个响应只触发一次。

##### destroy()

调用接收到 IncomingMessage 的 socket 上的 destroy() 方法。

```javascript
message.destroy([error])
```

如果提供了 error，则触发 error 事件，且把 error 作为参数传入事件的监听器。

##### setTimeout()

调用 message.connection.setTimeout(msecs, callback)，返回 message。

```javascript
message.setTimeout(msecs, callback)
```

##### headers

请求头或响应头的对象。头信息的名称为小写。

##### httpVersion

在服务器请求中，该属性返回客户端发送的 HTTP 版本；在客户端响应中，该属性返回连接到的服务器的 HTTP 版本。

##### httpVersionMajor

返回 HTTP 版本的第一个整数值。

##### httpVersionMinor

返回 HTTP 版本的第二个整数值。

##### method（只读）

返回一个字符串，表示请求的方法。

**注意：** 仅在 http.Server 返回的请求中有效。

##### rawHeaders

接收到的原始的请求头或响应头列表。

**注意：** 键和值在同一个列表中。 偶数位的是键，奇数位的是对应的值。

**注意：** 头信息的名称不会被转换为小写，重复的也不会被合并。

##### trailers

返回 Trailer 请求头或响应头对象。 只在 end 事件时被赋值。

##### rawTrailers

接收到的原始的 Trailer 请求头或响应头的的键和值。只在 end 事件时被赋值。

##### socket

返回与连接关联的 net.Socket 对象。

##### statusCode

返回一个三位数的 HTTP 响应状态码，如，404。仅在 http.ClientRequest 返回的响应中有效。

##### statusMessage

返回 HTTP 响应状态消息（原因描述），如，`OK` 或 `Internal Server Error`。仅在 http.ClientRequest 返回的响应中有效。

##### url

返回请求的 URL 字符串。仅包含实际 HTTP 请求中的 URL。 

**注意：** 仅在 http.Server 返回的请求中有效。

#### Agent 类

Agent 负责为 HTTP 客户端管理连接的持续与复用。 它为一个给定的主机与端口维护着一个等待请求的队列，且为每个请求重复使用一个单一的 socket 连接直到队列为空，此时 socket 会被销毁或被放入一个连接池中，在连接池中等待被有着相同主机与端口的请求再次使用。 是否被销毁或被放入连接池取决于 keepAlive 选项。

连接池中的连接的 TCP Keep-Alive 是开启的，但服务器仍然可能关闭闲置的连接，在这种情况下，这些连接会被移出连接池，且当一个新的 HTTP 请求被创建时再为指定的主机与端口创建一个新的连接。 服务器也可能拒绝允许同一连接上有多个请求，在这种情况下，连接会为每个请求重新创建，且不能被放入连接池。 Agent 仍然会创建请求到服务器，但每个请求会出现在一个新的连接。

但一个连接被客户端或服务器关闭时，它会被移出连接池。 连接池中任何未被使用的 socket 会被释放，从而使 Node.js 进程在没有请求时不用保持运行。

**注意：** 当 Agent 实例不再被使用时，建议 destroy() 它，因为未被使用的 socket 也会消耗操作系统资源。

##### new Agent([options])

参数说明：

* options：Object，代理的配置选项；
  * keepAlive：布尔值，默认值：false。如果为 true，则保持 socket 可用（即使没有请求），以便被将来的请求使用而无需重新建立一个 TCP 连接；
  * keepAliveMsecs：整数值， 默认值：1000（ms），指定 TCP Keep-Alive数据包的初始延迟（keepAlive 选项为 false | undefined 时，该选项无效）；
  * maxSockets： 整数值，默认值：Infinity，指定每个主机允许的最大 socket 数量；
  * maxFreeSockets：整数值， 默认值：256，指定在空闲状态下允许打开的最大 socket 数量（仅当 keepAlive 为 true 时才有效）。

http.request() 使用的默认 http.globalAgent 的选项均为各自的默认值。

若要配置其中任何一个，则需要创建自定义的 http.Agent 实例：

```javascript
const http = require('http')
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 500,
  maxSockets: 88,
  maxFreeSockets: 126
});
```

##### createConnection(options[, callback])

创建一个用于 HTTP 请求的 socket 或流。

参数说明：

* options：Object，连接详情的选项；
  * host：字符串，默认值：'localhost'，连接的主机；
  * port：数整值，连接的端口；
  * path：字符串，客户端连接的路径；
  * localAddress：字符串，连接的本地地址；
  * localPort：字符串，连接的本地端口；
  * family： 数整值，默认值：4（还可以是 6），IP栈的版本；
  * hints： 数整值，可选的[dns.lookup() hints][].
  * lookup：函数，默认值：dns.lookup()，可自定义 lookup 方法；
* callback：函数，接收被创建的 socket 的回调函数，有两个参数；
  * err：一个可能的 Error 对象；
  * stream：一个 socket 或流对象。

默认情况下，该函数类似于 net.createConnection()。 但是如果期望更大的灵活性，自定义的代理可以重写该方法。

##### keepSocketAlive(socket)

在 socket 被请求分离的时候调用，可能被代理持续使用。

##### reuseSocket(socket, request)

由于 keep-alive 选项被保持持久化, 在 socket 附加到 request 时调用。

##### destroy()

销毁当前正被代理使用的任何 socket。

通常不需要这么做。 但是如果使用的代理启用了 keepAlive，则当确定它不再被使用时，最好显式地关闭代理。 否则，在服务器终止它们之前，socket 可能还会长时间保持打开。

##### getName(options)

为请求选项的集合获取一个唯一的名称，用来判断一个连接是否可以被复用。

对于 HTTP 代理，返回 `host:port:localAddress` 或 `host:port:localAddress:family`；对于 HTTPS 代理，名称会包含 CA、证书、密码、以及其他 HTTPS/TLS 特有的用于判断 socket 复用性的选项。

参数说明：

* options：Object，为名称生成程序提供信息的选项；
  * host：字符串，请求发送至的服务器的域名或 IP 地址；
  * port：整数值，远程服务器的端口；
  * localAddress：字符串，当发送请求时，为网络连接绑定的本地接口。

##### sockets（不要修改）

返回一个对象，包含当前正被代理使用的 socket 数组。

##### freeSockets（不要修改）

返回一个对象，包含当前正在等待被启用了 keepAlive 的代理使用的 socket 数组。 

##### maxFreeSockets

 对于已启用 keepAlive 的代理，设置要保留的空闲 socket 的最大数量。默认为 256。

##### maxSockets

该属性可设置代理为每个来源打开的并发 socket 的最大数量。默认为不限制。

##### requests（不要修改）

返回一个对象，包含还未被分配到 socket 的请求队列。

### http 属性

##### METHODS

此属性列出了所有支持的 HTTP 方法。

##### STATUS_CODES

此属性列出所有标准 HTTP 响应状态码的集合，以及每个状态码的简短描述。

##### globalAgent

Agent 的全局实例，作为所有 HTTP 客户端请求的默认值。

用于管理 HTTP 客户端连接的持久性和复用，它是 Node.js HTTP 网络的关键组件。

##### maxHeaderSize（只读）

指定 HTTP 消息头的最大允许大小（以字节为单位）。 默认为 8KB。 可使用 --max-http-header-size 命令行选项进行配置。

通过传入 maxHeaderSize 选项，可以为服务器和客户端的请求重写此值。

### http方法

##### createServer()

返回 http.Server 类的新实例。

```javascript
// index.js
const http = require('http')

const hostname = '0.0.0.0'
const port = 3000
const server = http.createServer((message, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('你好，Lizhao！')
})
server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
```

用 `node ./index.js` 启动服务，在浏览器打开 http://localhost:3000/ 可查看。

##### request()

发送 HTTP 请求到服务器，并创建 http.ClientRequest 类的实例，用于显示地发出 HTTP 请求。

Node.js 为每台服务器维护多个连接来进行 HTTP 请求。 

```
http.request(options[, callback])
http.request(url[, options][, callback])
```

参数说明：

* options：Object | string | URL。
  * protocol：字符串，默认值：'http'，使用的协议；
  * host：字符串，默认值：'localhost'，请求发送至的服务器的域名或 IP 地址。
  * hostname：host 的别名。为了支持 url.parse()，hostname 优先于 host。
  * family：整数值，当解析 host 和 hostname 时使用的 IP 地址族。有效值是 4 | 6。当未指定时，则同时使用 IP v4 和 v6。
  * port：整数值，默认值：80，远程服务器的端口。
  * localAddress：字符串，为网络连接绑定的本地接口。
  * socketPath：字符串，Unix 域 Socket（使用 host:port 或 socketPath）。
  * method：字符串，默认值：'GET'，指定 HTTP 请求方法的字符串。
  * path：字符串，默认值：'/'，请求的路径。应包括查询字符串（如有的话）。当请求的路径中包含非法字符时，会抛出异常。 目前只有空字符会被拒绝，但未来可能会变化。
  * headers：Object，请求头的对象。
  * auth：字符串，基本身份验证。
  * agent：http.Agent | boolean，控制 Agent 的行为。 可能的值有：undefined（默认，即对该主机和端口使用 http.globalAgent）| Agent 对象（显式地使用传入的 Agent） | false （创建一个新的使用默认值的 Agent）。
  * createConnection：函数 ，当不使用 agent 选项时，为请求创建一个 socket 或流。 这可以用于避免仅仅创建一个自定义的 Agent 类来覆盖默认的 createConnection 函数。
  * timeout：整数值，指定 socket 超时的毫秒数。

options 可以是一个对象、或字符串、或 URL 对象。 如果 options 是一个字符串，它会被自动使用 url.parse() 解析。 如果它是一个 URL 对象，它会被默认转换成一个 options 对象。

如果请求过程中遇到任何错误（DNS 解析错误、TCP 级的错误、或实际的 HTTP 解析错误），则在返回的请求对象中会触发 error 事件。 对于所有的 error 事件，如果没有注册监听器，则抛出错误。

```javascript
const http = require('http');
const request = http.request('http://0.0.0.0:3000/', (message) => {
  message.on('data', (response) => {
    console.log(`响应主体: ${response}`);
  });
  message.on('end', () => {
    console.log('请求结束！');
  });
})
request.write('ok');
request.end();
```

**注意：** 使用 http.request() 必须总是调用 request.end() 来表明请求的结束，即使没有数据被写入请求主体。

##### get()

类似于 http.request()，但会自动地设置 HTTP 方法为 GET，并自动地调用 req.end()。

### 参考资料

[搭建 HTTP 服务器](http://nodejs.cn/learn/build-an-http-server)

[API Reference Document - http（HTTP）](https://www.apiref.com/nodejs-zh/http.html#http_http)