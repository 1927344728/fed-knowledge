## README

Node.js 是一个开源和跨平台的  JavaScript 运行时环境。 它几乎是任何类型项目的流行工具！

Node.js 在浏览器之外运行 V8 JavaScript 引擎（Google Chrome 的内核）。 这使得 Node.js 的性能非常好。

Node.js 有以下特性：

* 单进程运行，无需为每个请求创建新的线程。
* 提供了一组异步的 I/O 原语，以防止 JavaScript 代码阻塞。当 Node.js 执行 I/O 操作时（比如从网络读取、访问数据库或文件系统），Node.js 将在响应返回时恢复操作（而不是阻塞线程和浪费 CPU 周期等待）。
* 使用 JavaScript，可以编写除客户端代码之外的服务器端代码。
* 支持新的 ECMAScript 标准。

### 一点历史

- **2009**： Node.js 诞生、第一版的 npm 被创建；
- **2010**： Express 诞生、Socket.io 诞生；
- **2011**： npm 发布 1.0 版本、较大的公司（LinkedIn、Uber 等）开始采用 Node.js、hapi 诞生；
- **2012**： 普及速度非常快；
- **2013**： 第一个使用 Node.js 的大型博客平台：Ghost、Koa 诞生；
- **2014**： 大分支：io.js 是 Node.js 的一个主要分支，目的是引入 ES6 支持并加快推进速度；
- **2015**： Node.js 基金会 诞生、IO.js 被合并回 Node.js、npm 引入私有模块、Node.js 4（以前从未发布过 1、2 和 3 版本）；
- **2016**： leftpad 事件、Yarn 诞生、Node.js 6；
- **2017**： npm 更加注重安全性、Node.js 8、HTTP/2、V8 在其测试套件中引入了 Node.js，除了 Chrome 之外，Node.js 正式成为 ；JS 引擎的标杆、每周 30 亿次 npm 下载
- **2018**： Node.js 10、ES 模块 .mjs 实验支持、Node.js 11；
- **2019**： Node.js 12、Node.js 13；
- **2020**： Node.js 14、Node.js 15；
- **2021**： Node.js 16、Node.js 17；

### Node.js 与浏览器的区别

浏览器和 Node.js 均使用 JavaScript 作为其编程语言，但构建运行于浏览器中的应用程序与构建 Node.js 应用程序完全不同。

Node.js 应用程序具有巨大的优势：使用单一语言轻松编程所有一切（前端和后端）。

在浏览器中，主要操作是与 DOM 或 Web 平台 API进行交互，但不存在文件系统访问等功能。

而在 Node.js 中，允许**文件系统访问**，并且可以选择不同的运行环境（不同版本的 Node.js），但它没有浏览器提供的 `document`、`window`、以及所有其他的对象。

 JavaScript 发展的速度非常快，但是浏览器发展得慢一些，并且用户的升级速度也慢一些，因此有时在 web 上，不得不使用较旧的 JavaScript / ECMAScript 版本。而 Node.js 则不需要，**它支持新的 ECMAScript 标准** 。

另一个区别是：**Node.js 使用 CommonJS 模块系统，而在浏览器中，则还正在实现 ES 模块标准**，即，在 Node.js 中使用 `require()`，而在浏览器中则使用 `import`。

### V8 JavaScript 引擎

V8 是 Google Chrome 提供支持的 JavaScript 引擎的名称。 当使用 Chrome 进行浏览时，它负责处理并执行 JavaScript。

V8 提供了执行 JavaScript 的运行时环境。 DOM 和其他 Web 平台 API 则由浏览器提供。

JavaScript 引擎独立于托管它的浏览器。 此关键的特性推动了 Node.js 的兴起。 V8 于 2009 年被选为为 Node.js 提供支持的引擎，并且随着 Node.js 的爆炸性发展，V8 成为了现在为大量的服务器端代码（使用 JavaScript 编写）提供支持的引擎。

Node.js 的生态系统非常庞大，得益于此，V8 还为桌面应用程序（通过 Electron 等项目）提供支持。

**V8 使用 C++ 编写**，并且不断地被改进。 它是可移植的，且可运行于 Mac、Windows、Linux 和其他一些系统。

### 如何从 Node.js 读取环境变量

Node.js 的 process 核心模块提供了 env 属性，该属性承载了在启动进程时设置的所有环境变量。

```javascript
process.env.NODE_ENV
```

### Node.js 从命令行接收参数

```javascript
node app.js joe
node app.js name=joe
```

获取参数值的方法是使用 Node.js 中内置的 process 对象，其 argv 属性是一个包含所有命令行调用参数的数组。

argv 数组的第一个参数是 node 命令的完整路径；第二个参数是正被执行的文件的完整路径；所有其他的参数从第三个位置开始。

#### Node.js资料

[Node.js 中文网 - 入门教程](http://nodejs.cn/learn)

[Node.js 中文网 - API文档](http://nodejs.cn/api/)
