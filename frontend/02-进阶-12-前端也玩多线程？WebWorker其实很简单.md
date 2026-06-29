## JavaScript 多线程：Web Worker 其实很简单.md

JavaScript 设计之初就是为了操作浏览器 DOM 和处理用户交互。如果允许多线程同时修改同一个 DOM 节点，一个线程要删除，另一个线程要修改，浏览器就不知道听谁的了。因此，JS 的主线程是**单线程**的，所有代码在一个主线程上按顺序执行。

**JavaScript 是单线程语言**，但它的运行环境（浏览器、Node.js）提供了实现**多线程**效果的能力：

- **浏览器中的 Web Workers**：在浏览器后台创建独立于主线程的 **Worker 线程**。

- **Node.js 中的 Worker Threads**：类似 Web Workers，用于在服务器端实现真正的并行计算。

### 浏览器进程和线程

#### 进程（Chrome）

##### 浏览器进程

全局控制中心，不渲染网页内容，但管理所有标签页。

- **UI 线程**：绘制 UI 界面（地址栏、书签、前进/后退按钮）、响应用户点击/输入。
- **存储线程**：读写 localStorage、IndexedDB、Cookie、文件系统。
- **进程通信线程**（IPC）：负责浏览器各进程的消息传递。
- **文件 IO 线程**：处理文件读写。

##### 渲染进程

解析 HTML/CSS、执行 JavaScript、页面布局与绘制、处理用户交互。每个页签（或 iframe）通常有自己独立的渲染进程。

* **主线程**：执行 JavaScript 代码、解析 HTML/CSS 构建 DOM 树和 CSSOM 树、执行样式计算、布局（Layout）、绘制记录（Paint），处理用户事件回调，管理宏任务与微任务的执行。
* **合成线程**：处理滚动和 CSS 动画，将各图层位图合成为最终屏幕图像。
* **光栅化线程池**：将矢量图形、图层、绘制指令转换为实际的位图像素数据。
* **Worker 线程**：运行 Web Worker、Service Worker、Shared Worker，无法直接访问 DOM，可与主线程通信。
* **音频线程**：处理音频解码、混合和输出。
* **视频解码线程**：视频流硬件或软件解码。

##### GPU 进程

专门负责图形相关的加速任务（3D 加速、CSS 动画、video 解码等）。

GPU 的使用初衷是为了实现 CSS 的 3D 效果，只是随后网页、UI 界面都选择采取 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。

* **GPU 主线程**：调用底层图形驱动接口（OpenGL/Metal/DirectX/Vulkan），管理 GPU 内存中的纹理、缓冲区、着色器等资源。
* **合成线程**：处理 CSS 3D 变换、WebGL 等，将多个图层合成为一帧完整的图像。
* **显示线程**：将合成完成的帧输出到显示器。

##### 网络进程

独立处理所有网络请求（HTTP/HTTPS 等），包括缓存、Cookie、跨域策略等。

* **网络调度线程**：管理请求队列、决定请求优先级、复用已有连接（Keep-Alive、HTTP/1.1 连接复用）。
* **HTTP/2 线程**：处理 HTTP/2 协议、管理多路复用（多个请求共享一个 TCP 连接）、处理头部压缩（HPACK 算法）。
* **QUIC/HTTP/3 线程**：处理基于 UDP 的 QUIC 协议及 HTTP/3 请求，解决 TCP 队头阻塞问题。
* **缓存线程**：读取和写入 HTTP 缓存，依据 Cache-Control、ETag 等头部判断缓存有效性。
* **代理线程**：处理各种代理协议（SOCKS4、SOCKS5、HTTP 代理），负责代理环境下的请求转发和隧道建立。

##### 插件进程

用于运行旧的浏览器插件（如基于 NPAPI 或 PPAPI 的 Flash 插件、PDF 查看器）。随着 Web 技术发展，目前已很少使用。

* 插件主线程：运行插件的核心业务逻辑（如 Flash 脚本或 PDF 解析代码），处理插件生命周期。
* 图形线程：负责插件的图形输出（如 Flash 动画或游戏画面的绘制）。
* 音频线程：处理插件发出的音频流（如 Flash 中的声音播放）。

#### 渲染器进程

渲染器进程是浏览器多进程架构中最复杂、与网页开发者关系最密切的进程。每个标签页（或同源 iframe 组）通常拥有一个独立的渲染器进程，这种隔离机制保证了一个页面的崩溃不会影响其他页面。

**核心职责**：

* 解析 HTML 文档并构建 DOM 树。
* 解析 CSS 并构建 CSSOM 树。
* 执行 JavaScript 代码。
* 计算样式、执行布局（Layout/Reflow）。
* 进行绘制记录（Paint）和光栅化（Rasterization）。
* 处理用户交互事件。
* 管理网络请求（部分与网络进程协作）。
* 运行各种工作线程（Worker）。

**内部线程**：

* 主线程：核心执行线程，承担最多任务。
* 合成线程：独立处理滚动和部分动画。
* 光栅化线程池：将绘制指令转换为像素位图。
* Worker 线程：包括 Web Worker、Service Worker、Shared Worker。
* 音频线程：处理 Web Audio API。
* 视频解码线程：硬件/软件解码视频流。

#### JavaScript 主线程

JavaScript 代码在主线程上执行，——JavaScript 是单线程的，也就是主线程只有一个，

**主线程特性**：

* 同一时刻只能做一件事。
* 所有同步任务按顺序执行。

* 异步任务通过事件循环（Event Loop）机制调度。

**主线程工作**：

* avaScript 代码执行：执行全局同步代码、执行任务队列中的任务。
* 页面解析与构建：HTML 解析、CSS 解析、合并为渲染树。
* 样式计算：遍历渲染树中的每个元素，计算最终的样式属性。
* 布局：计算每个元素在页面中的精确位置和尺寸。
* 绘制记录：将布局阶段得到的位置和尺寸信息，转换为绘制指令。
* 事件处理：捕获并分发用户交互事件、处理事件冒泡和事件捕获、执行事件的回调函数。
* 任务队列调度（事件循环）：维护一个事件循环，持续不断地检查是否有任务需要执行，包括：宏任务队列、微任务队列。
* 线程协作：负责与其他线程的协作。

**主线程执行流程**：

* 用户输入 URL 回车。
* 主线程接收网络进程传来的 HTML 数据。
* 解析 HTML（构建 DOM 树），遇到 script 标签则暂停解析。
* 加载并执行 JavaScript，可能修改 DOM 和 CSSOM。
* 继续解析 HTML 剩余部分。
* 解析 CSS，构建 CSSOM 树。
* 将 DOM + CSSOM 合并为渲染树。
* 样式计算。
* 布局。
* 绘制记录。
* 将绘制指令交给合成线程。
* 合成线程 → 光栅化 → 显示。

### 为什么需要 Web Worker？

JavaScript 是**单线程**语言，当 JavaScript 在执行耗时任务时，浏览器无法做任何其他事情——不能响应用户点击，不能渲染动画，不能滚动页面。

这就是典型的 **UI 阻塞**问题。

**传统解决方案：**

- **setTimeout**：只是延迟执行，还是会阻塞。
- **Promise**：异步但不并行，还是单线程。
- **requestIdleCallback**：利用空闲时间，但不能真正并行。

**适用于 Worker 的任务类型：**

- 大量数据计算和转换。
- 图像处理（通过 ImageBitmap 传输）。
- 数据加密/解密。
- 复杂数据验证。
- 后台数据同步。
- 实时数据处理（WebSocket + Worker）。

这些需要的是真正的**后台任务**——这就是 Web Worker 诞生的原因。

### Worker

Web Worker 是浏览器提供的 **JavaScript 多线程**解决方案，允许在后台线程中运行脚本，不会阻塞主线程的 UI 渲染和用户交互。

**核心特征**：

- **运行在独立线程**：不与主线程共享执行栈，不会阻塞主线程。
- **无法访问 DOM**：不能操作 document、window、parent 等对象（但可以访问部分 API，如 navigator、location、fetch、IndexedDB、WebSocket）。
- **通信通过消息传递**：与主线程之间通过 postMessage 和 onmessage 交换数据。
- **同源限制**：Worker 脚本必须与父页面同源（除非使用 CORS）。
- **作用域独立**：Worker 有自己的全局上下文，与主线程的 window 不同。

#### 构造函数

```javascript
const worker = new Worker(URL, options);
```

**构造函数参数：**

- `URL`：Worker 脚本的 URL 地址（同源策略限制）。
- `options`（可选）：
  - `type`：脚本类型，默认 `"classic"`，可设为 `"module"`。
  - `credentials`：凭证选项，`"omit"`、`"same-origin"` 或 `"include"`。
  - `name`：Worker 的名称，用于调试。

#### 实例属性

* **onerror**：错误事件处理器，当 Worker 发生错误时触发。
* **onmessage**：消息事件处理器，接收 Worker 发送的消息。
* **onmessageerror**：消息错误事件处理器，当接收到无法反序列化的消息时触发。

#### 实例方法

* **postMessage()**：向 Worker 发送消息，支持结构化克隆算法传输的数据。
* **terminate()：**立即终止，Worker 线程。

#### Worker 全局作用域方法

* **postMessage()：**向创建 Worker 的主线程发送消息。
* **close()：**立即终止 Worker 自身。
* **importScripts()：**同步导入一个或多个脚本（仅在 Dedicated Worker 中可用）。

#### 支持的 API 

* **JavaScript 核心功能（全部支持）：**标准的 JavaScript 函数集（如 String、Array、Object、JSON 等），Array,、Object、Map、Set、Promise、Symbol、ArrayBuffer、DataView\TypedArray、正则表达式、箭头函数、类、模块。
* **定时器函数**：setTimeout、clearTimeout、setInterval、clearInterval。**注意**：不支持 setImmediate （非标准）。
* **网络请求 API**：fetch、XMLHttpRequest、WebSocket。
* **存储 API**：caches（Service Worker 专用，其他 Worker 也支持）、indexedDB。
* **编解码 API**：TextEncoder、TextDecoder、btoa、atob。
* **二进制数据处理**：Blob、FileReader（部分支持，无文件选择功能）、File/FileList（不支持，无法访问用户文件）。
* **加密 API（部分支持）：**Crypto（支持 getRandomValues，但不支持 subtle）。
* **URL 相关 API：**URL、URLSearchParams。
* **导航器信息（部分）：**支持 userAgent、language、onLine、serviceWorker（仅安全上下文）；不支持 geolocation, clipboard, mediaDevices, permissions 等。
* **其他支持的 API：**console、performance、BroadcastChannel、EventSource。

#### 不支持的 API

* **DOM 相关（完全不支持）：**document、window、parent、top、opener、DOM 元素操作。
* **渲染相关**： requestAnimationFrame、canvas、WebGL、CSS 对象模型。
* **大多数交互 API**：alert、confirm、prompt、localStorage、sessionStorage、Clipboard、Geolocation、Notification、Payment Request、Speech、Fullscreen、History。
* **部分其他 API**：localStorage / sessionStorage、WebUSB、WebBluetooth、WebSerial、IntersectionObserver、ResizeObserver、MutationObserver（部分浏览器可能支持）。

### Dedicated Worker（专用）

**Dedicated Worker**（专用工作线程）是由**单个脚本**（通常是主线程）创建和使用的 Worker。它只能被创建它的那个脚本访问，无法被其他脚本（包括同源的其他页面或 Worker）使用。

* **1对1绑定**：一个 Dedicated Worker 只服务于创建它的脚本。
* **独立线程**：运行在独立于主线程的真实操作系统线程中。
* **消息通信**：通过 postMessage() 和 onmessage 进行异步消息传递。
* **无法访问**：DOM	不能操作 document、window、parent 等。
* **可用的全局对**：self（指向 Worker 自身）、navigator、location（只读）、fetch、XMLHttpRequest、setTimeout 等。
* **同源限制 Worker**：脚本必须与主页面同源（除非使用 CORS 跨域加载）。

```javascript
// 主线程
const worker = new Worker('worker.js');
worker.postMessage('hello');
worker.onmessage = (e) => {};
worker.onerror = (error) => {};
worker.terminate();
```

```javascript
// worker.js（Worker 线程）
self.onmessage = (e) => {};
self.onerror = (message, filename, lineno, colno, error) => {};
self.postMessage('world'); 
self.close();
```

### Shared Worker（共享）

**Shared Worker**（共享工作线程）是一种可以被**多个脚本**（如同源的不同页面、iframe 或 Worker）共同使用的 Worker。只要这些脚本处于**同源**环境中，它们就可以共享同一个 Shared Worker 实例。

**核心特征**：

- **1对多绑定**：一个 Shared Worker 可以被同源的多个脚本同时访问。
- **独立线程**：运行在独立于主线程的真实操作系统线程中。
- **端口通信**：通过 `port` 进行消息传递，每个连接有独立的端口。
- **无法访问 DOM**：不能操作 `document`、`window`、`parent` 等。
- **可用的全局对象**：`self`、`navigator`、`location`（只读）、`fetch` 等。
- **同源限制**：必须与所有连接的页面同源。
- **生命周期**：只要还有任何端口连接，Worker 就会保持运行。

```javascript
// 主线程（任意多个页面/脚本）
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.postMessage('hello');
sharedWorker.port.onmessage = (e) => {};
sharedWorker.onerror = (error) => {};
sharedWorker.port.start();
sharedWorker.port.close();
```

```javascript
// shared-worker.js（Shared Worker 线程）
const ports = [];
self.onconnect = (event) => {
    const port = event.ports[0];
    ports.push(port);
    port.onmessage = (e) => {
        port.postMessage('收到: ' + e.data);
        ports.forEach(p => p.postMessage('广播: ' + e.data));
    };
    port.start();
    port.onclose = () => {};
};
self.onerror = (message, filename, lineno, colno, error) => {};
```

### Service Worker

**Service Worker**（服务工作线程）是一种**代理服务器**，位于浏览器和网络之间，可以拦截、处理所有网络请求。它主要用于实现离线访问、推送通知和后台同步等功能，是渐进式 Web 应用（PWA）的核心技术。

Service Worker 运行在独立的后台线程中，不与任何特定页面绑定，可以同时服务于多个页面。

**核心特征**：

- **网络代理**：作为浏览器和网络之间的代理服务器，可以拦截、修改所有网络请求。
- **离线支持**：缓存资源后，即使在离线状态下也能正常访问页面。
- **独立线程**：运行在独立于主线程的后台线程中，不会阻塞页面交互。
- **无法访问 DOM**：不能操作 `document`、`window`、`parent` 等。
- **可用的全局对象**：`self`、`caches`、`fetch`、`clients`、`CacheStorage`、`navigator`、`location`（只读）等。
- **HTTPS 限制**：出于安全考虑，必须在 HTTPS 协议下运行（本地开发 `localhost` 除外）。
- **事件驱动**：基于事件触发，不使用时自动休眠，节省系统资源。
- **独立生命周期**：有独立的注册、安装、激活、更新等生命周期阶段，与页面生命周期解耦。
- **作用域限制**：只能控制注册路径及其子路径下的页面。
- **推送通知**：支持后台推送消息，即使页面未打开也能接收通知。
- **后台同步**：支持网络恢复后自动重试失败的操作。

**注意**：Service Worker 注册的默认作用域是与 Service Worker 脚本文件路径相对的 `./`。如果 Service Worker 脚本文件位于根网域， 就意味着其作用域将是整个域名；如果位于 `/example/` ，则它的默认作用域为 `/example/`，即只能管控 `/example/` 目录下的页面。

```javascript
// 主线程（注册 Service Worker）
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
            console.log('注册成功:', registration.scope);
        })
        .catch(error => {
            console.error('注册失败:', error);
        });
    
    navigator.serviceWorker.onmessage = (e) => {};
    navigator.serviceWorker.oncontrollerchange = () => {};
    navigator.serviceWorker.ready.then(registration => {});
}
```

```javascript
// sw.js（Service Worker 线程）

/**
 * 安装事件（install）
 * 触发时机：Service Worker 首次注册成功或版本更新时
 * 版本更新：sw.js 文件内容发生变化。可以是修改版本号常量、添加注释、修改代码逻辑等
 * 用途：预缓存静态资源，为离线访问做准备
 */
self.oninstall = (event) => {
    // waitUntil() 方法用于延长安装事件的生命周期
    // 接收一个 Promise，只有当 Promise 完成后，安装才算成功
    event.waitUntil(
        // caches.open() 打开或创建指定的缓存库，my-cache-v1 是缓存名称
        // cache.addAll() 批量添加资源到缓存。任意一个资源下载失败，整个安装会失败
        caches.open('my-cache-v1').then(cache => cache.addAll([
            '/',              // 根页面（通常是 index.html）
            '/styles.css',    // 样式文件
            '/script.js'      // 脚本文件
        ]))
    );
};

/**
 * 激活事件（activate）
 * 触发时机：install 安装成功后，或新的 Service Worker 开始接管页面时
 * 用途：清理旧缓存、执行迁移操作、立即接管页面
 */
self.onactivate = (event) => {
    event.waitUntil(
        // caches.keys() 获取所有缓存库的名称列表
        // 只保留当前版本 'my-cache-v1'，其他版本都删除
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== 'my-cache-v1').map(key => caches.delete(key)));
        })
    );
    
    // 默认情况下，新 Service Worker 激活后，不会立即控制已打开的页面，需要用户刷新页面或关闭重开后，新页面才会被新 SW 控制。
    // clients.claim() 可选：让新的 Service Worker 立即接管所有未受控的页面
    // event.waitUntil(clients.claim());
};

/**
 * 请求拦截事件（fetch）
 * 触发时机：页面发起任何网络请求（fetch、XMLHttpRequest、图片、CSS、JS 等）
 * 用途：拦截请求，决定从缓存返回、从网络请求、或自定义响应
 */
self.onfetch = (event) => {
    // respondWith() 用于拦截网络请求，改为执行内部逻辑
    // caches.match() 在缓存中查找匹配当前请求的资源
    // 如果缓存命中，返回缓存内容；否则发起真实网络请求
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
};

self.onmessage = (event) => {    
    // event.source 指向发送消息的页面
    event.source.postMessage('收到消息');
    
    // 或者向所有客户端广播消息
    // self.clients.matchAll().then(clients => {
    //     clients.forEach(client => client.postMessage('广播消息'));
    // });
};

self.onerror = (message, filename, lineno, colno, error) => {};
```

