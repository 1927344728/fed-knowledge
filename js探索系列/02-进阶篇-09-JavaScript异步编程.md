## 进阶篇：JavaScript异步编程

异步（Asynchronous，async）是与同步（Synchronous, sync）相对的概念。

在单线程编程中，程序的运行是同步的（同步不意味着所有步骤同时运行，而是指步骤在一个控制流序列中按顺序执行）；而异步则是不保证同步的概念，也就是说，步骤的执行将不再与原有的序列有顺序关系。

所谓的**同步**就是在执行一个任务时，在该任务没有完成之前，其他任务是无法执行的，必须等该任务完成。换句话说，任务执行时，**会阻塞后面的任务**。

所谓的**异步**就是在执行一个任务时，为该任务指定一个回调函数来处理任务完成后需要做的事情，而不需要等该任务完成，再去执行其他任务。换句话说，任务发出后，**不会阻塞后面的任务**。

```javascript
// 异步编程：定时器回调函数
setTimeout(() => {
    console.log(1)
}, 100)
console.log(2)
// 2
// 1
```

### 异步编程

计算机在设计上是异步的。

**异步意味着事情可以独立于主程序流而发生，也就是说，异步就是从主线程发射一个子线程来完成任务。**

异步编程技术使程序可以在执行一个可能长期运行的任务的同时，继续对其他事件做出反应，而不必等待任务完成，其常见形式是：**提供的函数（回调函数）将在事件发生时被调用（而不是立即被调用）**。

通常，编程语言（C、Java、C＃、PHP、Go、Ruby、Swift、Python）是同步的，有些会在语言或库中提供管理异步性的方法，比如，使用线程（衍生新的进程）来处理异步操作。

JavaScript 语言是同步的，并且是单线程（一次只能完成一个任务；如果有多个任务，则必须排队）的。 这意味着无法通过创建线程的方法来处理异步操作。

而浏览器提供的许多功能可能需要很长的时间来完成，因此需要异步完成：

* 定时器函数：setTimeout、setInterval。
* 网络请求：异步 Ajax 或者 fetch 发起的 HTTP 请求。
* DOM 事件机制中的监听器：onClick、onMouseOver、onChange、onSubmit 等的监听函数。
* 使用 getUserMedia() 访问用户的摄像头和麦克风。
* 使用 showOpenFilePicker() 请求用户选择文件以供访问。

为了解决这个问题，JavaScript 指供了一些异步编程的方案来处理异步任务：回调函数、Promise、Generators/yield、Async/await。

### 回调函数

回调函数是 JavaScript 异步编程的最基本、最原始的方式，例如事件回调、setTimeout/setInterval、ajax等，但是使用回调函数存在一个非常棘手的问题，那就是回调地狱，一开始写没什么，等过一段时间后，不管自己看还是别人看，都会觉得这代码写的真恶心。

回调函数其实是一个简单的函数，会作为值被传给另一个函数，并且仅在事件发生时才被执行。 之所以这样做，是因为 JavaScript 具有顶级的函数，这些函数可以被分配给变量并传给其他函数（称为高阶函数）。

从历史发展的脉络来看，早些年为了实现 JavaScript 的异步编程，一般都采用回调函数的方式。

```javascript
// window 对象的 load 事件监听器
window.addEventListener('load', () => {
    console.log('页面准备就绪时才会运行')
})

// 定时器的回调函数
setTimeout(() => {
    console.log('1秒之后运行')
}, 1000)

// XHR请求的回调函数
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log(xhr.responseText)
            return
        }
        console.error('出错')
    }
}
xhr.open('GET', 'http://example.com')
xhr.send()
```

使用回调函数存在一个很常见的问题：当嵌套层级过多时，会形成 “回调地狱” 或 “厄运金字塔”，代码会变得非常复杂，难以阅读和调试：

```javascript
const fs = require('fs')
fs.readFile('./1.txt', 'utf-8', (err, r1) => {
    console.log(r1)
    fs.readFile(r1, 'utf-8', (err, r2) => {
        console.log(r2)
        fs.readFile(r2, 'utf-8', function(err, r3) {
            console.log(r3)
            fs.readFile('./1.txt', 'utf-8', function(err, r3) {
                console.log('全部完成!')
            });
        });
    });
});
```

### Promise

Promise 是异步编程的一种解决方案，比传统的解决方案 “回调函数和事件” 更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了 Promise 对象，在一定程度上解决了回调地狱的问题。但是存在的问题也很明显，过多使用 then 链式调用，其实并没有从根本上解决回调地狱的问题，只是换了一种写法，可读性虽然有所提升，但是依旧很难维护。

Promise 本意是承诺，在程序中的意思就是承诺过一段时间后会给一个结果。 什么时候会用到过一段时间？答案是异步操作，异步是指可能比较长时间才有结果的才做，例如网络请求、读取本地文件等。

从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

当 Promise 被调用后，它会以处理中状态开始。 这意味着调用的函数会继续执行其他任务，而 Promise 仍处于处理中直到解决为止，从而为调用的函数提供所请求的任何数据。被创建的 Promise 最终会以被解决状态或被拒绝状态结束，并在完成时调用相应的回调函数（then 或 catch）。

Promise 的三种状态：

* pending：处理中，Promise 对象实例创建时候的初始状态。
* resolved：成功状态。
* rejected：失败状态。

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }
            console.log(data)
            resolve(data)
        })
    })
}

read('./1.txt').then(r1 => {
    return read(r1);
}).then(r2 => {
    return read(r2);
}).then(r3 => {
    return read(r3);
}).catch(err => {
    console.log(err);
});
// 或者
read('./1.txt')
    .then(read)
    .then(read)
    .then(read)
    .catch(err => {
    console.log(err);
});
```

Promise 对 “回调地狱” 进行了改进，可读性的确有一定的提升，可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数，但是 Promise 也存在一些问题，即便是使用 Promise 的链式调用，如果操作过多，其实并没有从根本上解决回调地狱的问题，只是换了一种写法，可读性虽然有所提升，但是依旧很难维护。

另外，Promise 还提供了一个 all 方法，用于并行执行多个 Promise：

```javascript
// all 方法：只有所有promise的状态都成功，all的状态才会变成成功。
Promise.all([read('./1.txt'), read('./2.txt'), read('./3.txt')]).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err)
});
```

### Generators/yield

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同，Generator 最大的特点就是**可以控制函数的执行**。Generator 函数可以看作是异步任务的容器，需要暂停的地方，都用 **yield** 语法来标注：**Generator 函数返回的是一个迭代器对象**，函数内遇到 yield 关键字会暂停，然后，通过调用迭代器的 next() 方法可重新启动，每次返回的是 yield 后的表达式结果。

yield 表达式本身没有返回值，或者说总是返回 undefined。next() 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```javascript
function* generatorFunc(x) {
    const y = 2 * (yield (x + 1))
    const z = yield (y / 3)
    return (x + y + z)
}
const it = generatorFunc(5)
console.log(it.next())   // {value: 6, done: false}
console.log(it.next(12)) // {value: 8, done: false}
console.log(it.next(13)) // {value: 42, done: true}
```

代码执行分析：

* Generator 函数调用和普通函数不同，它会返回一个迭代器；
* 当执行第一次 next 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`；
* 当执行第二次 next 时，传入的参数 12 就会被当作上一个 yield 表达式的返回值，此时 `let y = 2 * 12`，所以第二个 yield 等于 `2 * 12 / 3 = 8`。**注意：** 如果不传参，yield 永远返回 `undefined`。
* 当执行第三次 next 时，传入的参数 13 就会被当作上一个 yield 表达式的返回值，所以 `z = 13, x = 5, y = 24`，相加等于 42。

**注意：** yield 后面的表达式是同步的，也就是说，如果后面的表达式是异步操作，next() 方法启动时，不会等待当前停留的 yield 的异步操作执行结束。

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }
            console.log(data)
            resolve(data)
        })
    })
}

function * generatorRead() {
    const r1 = yield read('./1.txt')
    const r2 = yield read(r1)
    const r3 = yield read(r2)
}
const it = generatorRead();
it.next().value.then((r1) => {
    it.next(r1).value.then((r2) => {
        it.next(r2).value.then(() => {
            console.log('全部完成！')
        })
    })
})
```

以上是 Generator 函数异步编程的代码，跟回调函数的 “回调地狱” 很像。在实际开发中，通常配合 co 库使用，可以让代码变得简洁易读。

co 是一个为 Node.js 和浏览器打造的基于生成器的流程控制工具，借助于 Promise，可以使用更加优雅的方式编写非阻塞代码。

```javascript
const co = require('co')
co(generatorRead()).then(() => {
    console.log('全部完成！')
})
```

### Async/await

async/await 是 ES2017 提出的一种异步解决方案，它相当于 Generator + 执行器的语法糖，就目前来说，是最佳的异步解决方案，真正实现了异步代码，同步表示。

其最大的优点是代码清晰，**让异步逻辑的代码看起来像同步一样**。

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }
            console.log(data)
            resolve(data)
        })
    })
}

async function promiseRead() {
    const r1 = await read('./1.txt')
    const r2 = await read(r1)
    const r3 = await read(r2)
}
promiseRead();
```

### 其他方法

##### 事件监听

通过事件机制，实现代码的解耦。JavaScript 处理 DOM 交互就是采用的事件机制。

#### 发布-订阅

发布订阅基于事件监听，发布者和订阅者通过一个事件中心进行通信，并且实现了多个事件解耦。

### 参考链接

[MDN- 异步 JavaScript 简介](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Asynchronous/Introducing)

[Node.js - JavaScript 异步编程与回调](http://nodejs.cn/learn/javascript-asynchronous-programming-and-callbacks)

[runoob.com - JavaScript 异步编程](https://www.runoob.com/js/js-async.html)

[稀土掘金 - JS 异步编程都有哪些方案？](https://juejin.cn/post/6955387870651613198)