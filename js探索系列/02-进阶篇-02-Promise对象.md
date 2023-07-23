## 进阶篇：Promise对象
### 什么是Promise？

Promise 是一个 JavaScript 对象，本质上是一个函数返回的对象，用于表示一个异步操作的最终完成（成功或失败）及其结果值。

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

一个 Promise 必然处于以下几种状态之一：

* 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。
* 已兑现（fulfilled）：意味着操作成功完成。
* 已拒绝（rejected）：意味着操作失败。

**备注：** 如果一个 promise 已经被兑现（fulfilled）或被拒绝（rejected），那么我们也可以说它处于已敲定（settled）状态。您还会听到一个经常跟 promise 一起使用的术语：已决议（resolved），它表示 promise 已经处于已敲定状态，或者为了匹配另一个 promise 的状态被"锁定"了。

Promise 对象的缺点：

* 一旦新建 Promise 就会立即执行，无法中途取消。
* 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
* 如果 catch 函数，Promise 内部抛出的错误，不会反应到外部（也不影响其他代码执行）。

### 基础用法

```js
const promise = new Promise((resolve, reject) => {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value)
  } else {
    reject(error)
  }
})
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。其中，resolve 函数的作用是，将 Promise 对象的状态从 pending 变为 fulfilled，即，异步操作成功时调用；reject 函数的作用是，将 Promise 对象的状态从从 pending 变为 rejected，即，在异步操作失败时调用。

```js
promise.then(value => {
    // success
}, err => {
    // failure
});
```

**注意：** Promise 实例生成后会**立即执行**。

Promise 的一些特性：

- **Promise 是微任务：** Promise.resolve() 在**本轮 ”事件循环” 结束**时执行；setTimeout(fn, 0) 表示零延迟，是在**下一轮 “事件循环” 开始**时执行。基本上，setTimeout 需要等待当前队列中所有的消息都处理完毕之后才能执行，即使已经超出了由第二参数所指定的时间。

- **Promise 链式调用：** then()、catch()、finally() 方法将进一步的操作与一个变为已敲定状态的 promise 关联起来。这些方法还会返回一个新生成的 promise 对象，这个对象可以被非强制性的用来做链式调用。

### 常见使用场景

```js
// 图片加载
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = function () {
            resolve(image)
        }
        image.onerror = function () {
            reject(new Error(`加载出错： ${url}`))
        }
        image.src = url
    })
}

loadImageAsync('./assets/img/pins_3338674420.jpg').then(
    res => console.log('加载成功！'),
    err => console.error(err)
)
```

```js
// Ajax请求
function getText(url) {
    return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest()
        http.open("GET", url)
        http.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return
            }
            if (this.status === 200) {
                return resolve(this.response)
            } else {
                return reject(new Error(this.statusText))
            }
        }
        http.send()
    })
}

getText("./assets/other/%E7%BE%8E%E4%BA%BA%E8%B0%B7%20-%20%E9%98%BF%E5%85%B0.vtt").then(
    json => console.log('Contents: ' + json),
    err => console.error(err)
)
```

### 静态方法

```javascript
const p1 = Promise.resolve('p1: Success!')
const p2 = Promise.reject('p2: Error!')
const p3 = Promise.resolve('p1: Success!')
```

#### all()

all() 方法接收一个 Promise 实例的可迭代对象，当所有 Promise 实例成功或者其中一个 Promise 失败时，返回一个新的 Promise 实例。这个新的 Promise 实例的参数是一个原 Promise 实例的结果的数组。

* 完成（Fulfillment）： 如果传入 iterable 为空，或者所有传入的 promise 都变为完成状态，或者传入的可迭代对象内没有 promise，则返回一个已完成 resolved 状态的 promise。在任何情况下，该返回的 promise  的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 promise  值）。

* 失败/拒绝（Rejection）： 如果传入的 promise  中有一个失败（rejected），则将失败 promise 的结果传递给失败状态的回调函数，而不管其它 promise 是否完成。

```js
Promise.all([p1, p3]).then((res => {
    console.log(res)
})).catch(err => {
    console.error(err)
})
//  ['p1: Success!', 'p1: Success!']
```

```javascript
Promise.all([p1, p2, p3]).then((res => {
    console.log(res)
})).catch(err => {
    console.error(err)
})
// p2: Error!
```

#### allSettled()

allSettled() 方法接收一个 Promise 实例的可迭代对象，在所有给定的 promise 都已经 fulfilled 或 rejected（即，无论是成功的达成或被拒绝）后，返回一个新的 Promise 实例。这个新的 Promise 实例的参数是一个对象数组，每个对象表示对应的 Promise 实例的结果。

每个结果对象，都有一个 status 字符串，如果它的值为 fulfilled，则结果对象上存在一个 value；如果值为 rejected，则存在一个 reason 。

```javascript
Promise.allSettled([p1, p2, p3]).then((res => {
    console.log(res)
})).catch(err => {
    console.error(err)
})
// (3) [{…}, {…}, {…}]
// 0: {status: 'fulfilled', value: 'p1: Success!'}
// 1: {status: 'rejected', reason: 'p2: Error!'}
// 2: {status: 'fulfilled', value: 'p1: Success!'}
// length: 3
// [[Prototype]]: Array(0)
```

**备注：** allSettled() 方法不关心异步操作的结果，只关心这些操作有没有结束。

#### any()

any() 方法接收一个 Promise 实例的可迭代对象，只要其中的一个 Promise 实例成功，返回一个新的成功 Promise 实例，参数是成功 Promise 实例的结果。

如果可迭代对象中没有一个 Promise 实例成功，则返回一个失败的 Promise 实例，参数是 AggregateError 类型（Error 的一个子类，用于把单一的错误集合在一起）的实例。

```javascript
Promise.any([p2, p2, p2]).then((res => {
    console.log(res)
})).catch(err => {
    console.error(err)
})
// AggregateError: All promises were rejected
```

本质上，这个方法和 all() 方法是相反的。

**注意：** any() 方法依然是实验性的，尚未被所有的浏览器完全支持，目前处于 TC39 第四阶段草案。

#### race()

race() 方法接收一个 Promise 实例的可迭代对象，只要其中的一个 Promise 实例解决或拒绝，返回一个新的成功 Promise 实例。这个新的成功 Promise 实例，与第一个完成的 Promise 相同的完成方式被完成。它可以是成功的，也可以是失败的，这要取决于第一个完成的方式是两个中的哪个。

```javascript
Promise.race([p1, p2, p3]).then((res => {
    console.log(res)
})).catch(err => {
    console.error(err)
})
// p1: Success!
```

如果传的迭代是空的，则返回的 Promise 实例将永远等待。

#### resolve()

resolve() 方法返回一个以给定值解析后的 Promise 对象。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

该方法的参数分成四种情况：

* **参数是一个 Promise 实例：**不做任何修改、原封不动地返回这个实例。

* **参数是一个 thenable 对象：**将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then`方法。

  ```js
  // thenable对象指的是具有then方法的对象
  const thenable = {
    then: function(resolve, reject) {
      resolve(42);
    }
  };
  
  const p1 = Promise.resolve(thenable);
  p1.then(function(value) {
    console.log(value); // 42
  });
  ```

* **参数不是具有 then 方法的对象，或根本就不是对象：**如果参数是一个原始值，或者是一个不具有 then 方法的对象，则返回一个新的 Promise 对象，状态为 resolved。resolve() 方法的参数，会同时传给回调函数。

* **不带有任何参数：**直接返回一个 resolved 状态的 Promise 实例。

#### reject()

reject() 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
```

**注意：** 该方法的参数，会原封不动地作为拒绝的理由传递给后续的回调函数。这一点与 resolve() 方法不同。

#### try() 

try() 是现在有一个[提案](https://github.com/ljharb/proposal-promise-try)，Promise 来统一处理同步函数和异步操作，都用 then() 方法指定下一步流程，用 catch() 方法处理抛出的错误。

```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```

上面的写法有一个缺点，就是如果 f 是同步函数，那么它会在本轮事件循环的末尾执行，即就是说，它并没有像同步函数一个立即执行。

那么有没有一种方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 呢？

回答是可以的。

还有以下两种写法：

```js
const f = () => console.log('now')
(async () => f())()
console.log('next')
// now
// next
```

```js
const f = () => console.log('now');
(
    () => new Promise(resolve => resolve(f()))
    // 或者
    // () => Promise.resolve(f())
)()
console.log('next')
// now
// next
```

try() 方法替代上面的写法：

```js
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```

### 实例方法

#### then()

then() 方法返回一个 Promise，作用是为 Promise 实例添加状态改变时的回调函数。

then() 方法有两个参数（都是可选的），是给定的 Promise 的成功和失败情况的回调函数。

```javascript
const genPromise = (value) => new Promise((resolve, reject) => {
    if (value === 1) {
        return resolve(value)
    }
    return reject('Error')
})
genPromise(1).then(res => console.log('Success: ', res), err => console.error(err))
genPromise(1).then(res => console.log('Success: ', res), null)
genPromise().then(null, err => console.error(err))
```

* then() 方法的第一个参数是 resolved 状态的回调函数，第二个参数是 rejected 状态的回调函数。这两个回调函数都是可以传参数的。

* resolve 函数的参数除了正常的值以外，还可以是另一个 Promise 实例。如果 resolve 方法返回的是一个Promise 对象（即有异步操作），那么，后一个 then 方法中的第一个回调函数，就会等待该 Promise 对象的状态发生变化，才会被调用。

* reject 函数的参数通常是 Error 对象的实例，表示抛出的错误；

* then() 方法中，resolve 和 reject 回调函数后面还可以执行其它语句，但是，一般不建议这么做。

* then() 方法返回的是一个新的 Promise 实例（不是原来的 Promise 实例）。

* then() 方法中可以用 return 来返回参数，在后一个 then 的回调函数中接收。

  ```js
  Promise.resolve().then(res => {
      return 'aa'
  }).then(res => {
      console.log(res) //aa
  }, err => {
      console.error(err)
  })
  ```

#### catch()

catch() 方法返回一个Promise 实例，并且处理拒绝的情况。它的行为与调用 `.then(undefined, onRejected)` 相同。

catch() 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数。事实上，catch() 方法内部就是调用 `.then(undefined, onRejected))` 实现的。

```js
loadImageAsync('./img/pins_3338674420.jpg').then(res => {
    console.log('加载成功！')
}).catch(err => {
    console.error(err)
})
```

上面代码中，loadImageAsync() 方法返回一个 Promise 对象，如果 Promise 对象的异步操作成功，则调用 then() 方法指定的回调函数；如果失败，则会调用 catch() 方法处理这个错误。另外，then() 方法指定的回调函数，如果运行中抛出错误，也会被 catch() 方法捕获。

catch() 的一些注意事项：

* Promise 状态已经变成 resolved，再抛出错误是无效的。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

  ```js
  const promise = new Promise((resolve, reject) => {
      resolve('ok')
      throw new Error('test') // 无法被 catch捕获
  });
  promise.then(function(value) {
      console.log(value) // ok
  }).catch(error => {
      console.log(error)
  });
  ```

* Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch() 方法捕获。

* 没有使用 catch() 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

* 一般来说，不要在 then() 方法里面定义 reject 回调函数，总是使用 catch() 方法。

* catch() 方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then() 或 catch() 方法。

#### finally()

finally() 方法用于指定一个在 Promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行的回调函数。这为在 Promise 是否成功完成后都需要执行的代码提供了一种方式。

finally() 方法与 then(onFinally, onFinally) 类似，它们不同的是：

* 不需要多次声明该函数或为该函数创建一个变量。
* 由于无法知道 promise 的最终状态，所以 finally 的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。
* finally() 方法总是会返回原来的值。

```js
Promise.resolve(2).then(() => {}, () => {}) // resolved 的结果为 undefined
Promise.resolve(2).finally(() => {})        // resolved 的结果为 2
Promise.reject(3).then(() => {}, () => {})  // rejected 的结果为 undefined
Promise.reject(3).finally(() => {})         // rejected 的结果为 3
```

finally() 方法的实现：

```js
Promise.prototype.finally = function (callback) {
    const P = this.constructor
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    )
}
```

### Promise 拒绝事件

当 Promise 被拒绝时，会有以下两个事件之一被派发到全局作用域。

#### rejectionhandled

当 Promise 被拒绝、并且在 reject 函数处理该 rejection 之后会触发此事件。

**注意：** 只有当一个 Promise 错误最初未被处理，**稍后又得到了处理**，才会触发。

```js
// 不会触发
window.addEventListener("rejectionhandled", event => {
    console.log("rejected: " + event.reason)
}, false)
const p = new Promise((resolve, reject) => {
    x = x + 1
}).then(res => { }, err => { })
```

```js
// 触发
window.addEventListener("rejectionhandled", event => {
    console.log("rejected: " + event.reason)
}, false)
const p = new Promise((resolve, reject) => {
    x = x + 1
})
setTimeout(() => {
    p.then(res => { }, err => { })
}, 0)
```

#### unhandledrejection

当 Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件。

```js
// window
window.addEventListener("unhandledrejection", event => {
    console.log(event.type)
}, false)
new Promise((resolve, reject) => {
    x = x + 1
}).then(() => { })
```

```js
//Node.js
process.on('unhandledRejection', (reason, promise) => {})
```

### promise串行运行

以下是用 Promise 来包裹 setTimeout()  函数，并返回 promise 实例，作测试用例：

```js
const f1 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('f1')
        resolve('f1')
    }, 2000)
})
const f2 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('f2')
        resolve('f2')
    }, 1000)
})
const f3 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('f3')
        resolve('f3')
    }, 1000)
})
```

Promise.all() 和 Promise.race() 是并行运行参数中的 Promise 实例的两个函数，即，Promise 实例是并行执行的，不存在等待关系。

```js
Promise.all([f2(), f1(), f3()]).then(res => {
    console.log('Promise.all：', res)
})
// f2
// f3
// f1
// Promise.all： (3) ['f2', 'f1', 'f3']
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=2)

Promise 串行是指每一个由 promise 封装的任务都顺序执行，即上一个执行完成后再执行下一个。

**注意：** 以下串行运行方法中的参数都是**函数**，不是 Promise 对象。

#### Promise 链式调用

```js
Promise.resolve().then(f1).then(f2).then(f3).then(res => {
    console.log('参数：', res)
})
// f1
// f2
// f3
// 参数： f3
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=3)

#### for 版本

```js
function sequencePromisesWithForThen (promises) {
    function recordValue(results, value) {
        results.push(value)
        return results
    }
    // 记录每个Promise实例的执行结果。
    // 如果不调用此方法，函数最后的Promise的传递出来的参数，只有最后一个Promise实例的执行结果
    const pushValue = recordValue.bind(null, [])
    let promise = Promise.resolve()
    for (let i = 0; i < promises.length; i++) {
        promise = promise.then(promises[i]).then(pushValue)
    }
    return promise
}
sequencePromisesWithForThen([f1, f2, f3]).then(res => {
    console.log('sequencePromisesWithForThen：', res)
})
// f1
// f2
// f3
// sequencePromisesWithForThen： (3) ['f1', 'f2', 'f3']
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=4)

#### reduce 版本

```js
function sequencePromisesWithReduce (promises) {
    function recordValue(results, value) {
        results.push(value)
        return results
    }
    // 记录每个Promise实例的执行结果。
    // 如果不调用此方法，函数最后的Promise的传递出来的参数，只有最后一个Promise实例的执行结果
    const pushValue = recordValue.bind(null, [])
    return promises.reduce((promise, task) => {
        return promise.then(task).then(pushValue)
    }, Promise.resolve())
}
sequencePromisesWithReduce([f1, f2, f3]).then(res => {
    console.log('sequencePromisesWithReduce：', res)
})
// f1
// f2
// f3
// sequencePromisesWithReduce： (3) ['f1', 'f2', 'f3']
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=5)

#### async/await

```js
async function sequencePromisesForAsync(promises) {
    const result = []
    for (let f of promises) {
        result.push(await f())
    }
    console.log('sequencePromisesForAsync：', result)
    return result
}
sequencePromisesForAsync([f1, f2, f3])
// f1
// f2
// f3
// sequencePromisesForAsync： (3) ['f1', 'f2', 'f3']
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=6)

### 常见问题

#### IE 不技持 Promise

在 HTML 文档中引入 polyfill.js ：

```html
<script src="https://cdn.bootcdn.net/ajax/libs/babel-polyfill/7.10.4/polyfill.js"></script>
```

或者通过 node 安装并引入 [@babel/polyfill](https://www.npmjs.com/package/@babel/polyfill)：

```js
npm i @babel/polyfill -S

// js文件中引入
import '@babel/polyfill'
```

#### Promise嵌套

嵌套 Promise 是一种可以限制 catch 语句的作用域的控制结构写法。明确来说，嵌套的 catch 仅捕捉在其之前同时还必须是其作用域的异常，而捕捉不到在其链式以外或者其嵌套域以外的异常。

**注意：** 简便的 Promise 链式编程最好保持扁平化，尽量不要嵌套 Promise。

Promise 嵌套中，优先执行 Promsie 构造其中的同步任务，再执行 then 方法。

```js
new Promise((resolve, reject) => {
    console.log('1')
    resolve()
    new Promise((resolve, reject) => {
        console.log('2') // c2
        resolve()
    }).then(() => {
        console.log('3') // c3
    })
}).then(() => {
    console.log('4')
})
// 1
// 2
// 3
// 4
```

**注意：** Promise 函数内的代码是同步执行的，then 函数内的才是微任务，即异步的代码。

### 参考链接

[MDN - promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[MDN - 使用 Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

[阮一峰 ECMAScript 6 入门 promise](https://es6.ruanyifeng.com/#docs/promise)

