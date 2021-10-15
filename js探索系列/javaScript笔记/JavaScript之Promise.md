## JavaScript笔记之Promise
### Promise含义

`Promise `是一个对象，它代表了一个异步操作的最终完成或者失败。

`Promise `是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

理想状态下，`Promise` 提供统一的 API，各种异步操作都可以用同样的方法进行处理（）。但有一些 API 仍然使用旧方式来传入的成功（或者失败）的回调。典型的例子就是 `setTimeout()` 函数。

`Promise`对象有以下特点：

* 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
* 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 `resolved`（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

`Promise`也有一些缺点：

* 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。
* 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。会在`chrome`的控制台上打印，但不影响其他代码执行。
* 当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。



### Promise基础用法

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

`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。其中，`resolve`函数的作用是，将`Promise`对象的状态从即从 `pending `变为 `fulfilled`，即，异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将`Promise`对象的状态从从 `pending `变为 `rejected`，即，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```js
promise.then(value => {
  // success
}, err => {
  // failure
});
```

`Promise`实例生成后**立即执行**，然后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。



### Promise的一些约定

- 在本轮 [事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#执行至完成) 运行完成之前，回调函数是不会被调用的。

  * 同步语句是按顺序，立即执行
  * `Promise.resolve()`在**本轮 ”事件循环” 结束**时执行
  * `setTimeout(fn, 0)`是零延迟，不过，这并不意味着回调会立即执行，它是在**下一轮 “事件循环” 开始**时执行。基本上，`setTimeout` 需要等待当前队列中所有的消息都处理完毕之后才能执行，即使已经超出了由第二参数所指定的时间。

  ```js
  setTimeout(function () {
    console.log('three')
  }, 0)
  
  Promise.resolve().then(function () {
    console.log('two')
  });
  
  console.log('one')
  
  // one
  // two
  // three
  ```

- 即使异步操作已经完成（成功或失败），在这之后通过 `then()` 添加的回调函数也会被调用。

- 通过多次调用 `then()` 可以添加多个回调函数，它们会按照插入顺序执行。这就是Promise的**链式调用**（**chaining**）。



### 常见的Promise封装（图片加载、Ajax请求）

```js
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

loadImageAsync('./assets/img/pins_3338674420.jpg').then(res => {
    console.log('加载成功！', './assets/img/pins_3338674420.jpg')
}, err => {
    console.log('加载失败！', './assets/img/pins_3338674420.jpg')
})
```

```js
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

getText("./assets/other/%E7%BE%8E%E4%BA%BA%E8%B0%B7%20-%20%E9%98%BF%E5%85%B0.vtt").then(json => {
    console.log('Contents: ' + json)
}, error => {
    console.error('出错了', error)
})
```



### promise原型对象方法

#### then()

`Promise.prototype.then()`的作用是为 `Promise `实例添加状态改变时的回调函数。`then`里的**两个参数都是可选**的，如：`catch(failureCallback)` 是 `.then(null, rejection)`或`.then(undefined, rejection)` 的缩略形式。

* `then`方法的第一个参数是`resolved`状态的回调函数，第二个参数是`rejected`状态的回调函数。如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。

* `reject`函数的参数通常是`Error`对象的实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个 `Promise `实例。如果`resolve`方法返回的是一个`Promise`对象（即有异步操作），那么，后一个`then`方法中的第一个回调函数，就会等待该`Promise`对象的状态发生变化，才会被调用。

* 调用`resolve`或`reject`并不会终结 `Promise` 的参数函数的执行。也就是说，其后面还可以执行其它语句，但是，一般不建议这么做。

* `then`方法返回的是一个新的`Promise`实例（注意，不是原来那个`Promise`实例）。`then`方法中可以用`return`来返回参数，在后一个`then`的回调函数中接收。

  ```js
  Promise.resolve().then(res => {
      return 'aa'
  }).then(res => {
      console.log(res)
  }, err => {
      console.log(err) //aa
  })
  ```

#### catch()

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```js
loadImageAsync('./img/pins_3338674420.jpg').then(res => {
    console.log('加载成功！')
}, err => {
    console.log(err.message)
})

loadImageAsync('./img/pins_3338674420.jpg').then(res => {
    console.log('加载成功！')
}).catch( err => {
    console.log(err.message)
})
```

上面代码中，`loadImageAsync()`方法返回一个 Promise 对象，如果该对象状态变为`resolved`，则会调用`then()`方法指定的回调函数；如果异步操作抛出错误，状态就会变为`rejected`，就会调用`catch()`方法指定的回调函数，处理这个错误。另外，`then()`方法指定的回调函数，如果运行中抛出错误，也会被`catch()`方法捕获。

* Promise 状态已经变成`resolved`，再抛出错误是无效的。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

  ```js
  const promise = new Promise((resolve, reject) => {
    resolve('ok')
    throw new Error('test') //无法被catch捕获
  });
  promise.then(function(value) {
      console.log(value)
  }).catch(error => {
      console.log(error)
  });
  ```

* Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。

* 一般来说，不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

* 没有使用`catch()`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

* `catch()`方法返回的还是一个 Promise 对象，因此后面还可以接着调用`then()`或者`catch()`方法。

#### finally()

`Promise.prototype.finally()`用于指定不管 Promise 对象最后状态如何，都会执行的操作，即，**不依赖于 Promise 的执行结果**。该方法是 `ES2018` 引入标准的。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

`finally()`的实现：

```js
Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    )
}
```



### Promise静态方法

#### all()

`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。`Promise.all()`方法的参数可以是数组或者其他具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

```js
const p = Promise.all([p1, p2, p3])
```

`p`的状态由`p1`、`p2`、`p3`决定：

* 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

* 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。
* `p1`、`p2`、`p3`有`catch`方法，会调用自己的`catch（）`方法；没有就会调用`Promise.all()`的`catch`方法。

#### race()

`Promise.race()`方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。`Promise.race()`方法的参数与`Promise.all()`方法一样

```js
const p = Promise.race([p1, p2, p3]);
```

只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

应用场景：如，对一个异步请求做超时判断

```js
const p = Promise.race([
    loadImageAsync('./img/pins_3338674420.jpg'),
    new Promise( (resolve, reject) => {
        setTimeout(() => reject(new Error('request timeout')), 1000)
    })
])
p.then(console.log).catch(console.error)
```

#### allSettled()

`Promise.allSettled()`方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。该方法由 [ES2020](https://github.com/tc39/proposal-promise-allSettled) 引入。

`Promise.allSettled()`方法返回的新的 Promise 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。状态变成`fulfilled`后，Promise 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 Promise 实例。数组中的每个Promise实例都有`status`属性，该属性的值只可能是字符串`fulfilled`或字符串`rejected`。`fulfilled`时，对象有`value`属性，`rejected`时有`reason`属性，对应两种状态的返回值。

应用场景：**不关心异步操作的结果，只关心这些操作有没有结束。**

#### any()

`Promise.any()`方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。该方法目前是一个第三阶段的[提案](https://github.com/tc39/proposal-promise-any) 。

`Promise.any()`抛出的错误，不是一个一般的错误，而是一个 `AggregateError `实例。它相当于一个数组，每个成员对应一个被`rejected`的操作所抛出的错误。

#### resolve()

`Promise.resolve()`方法用于现有对象转为 Promise 对象。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve`方法的参数分成四种情况：

* **参数是一个 Promise 实例：**不做任何修改、原封不动地返回这个实例。

* **参数是一个`thenable`对象：**将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then`方法。

  ```js
  let thenable = { //thenable对象指的是具有then方法的对象
    then: function(resolve, reject) {
      resolve(42);
    }
  };
  
  let p1 = Promise.resolve(thenable);
  p1.then(function(value) {
    console.log(value);  // 42
  });
  ```

* **参数不是具有`then`方法的对象，或根本就不是对象：**如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 Promise 对象，状态为`resolved`。`Promise.resolve`方法的参数，会同时传给回调函数。

* **不带有任何参数：**直接返回一个`resolved`状态的 Promise 对象。

#### reject()

`Promise.reject(reason)`方法也会返回一个新的 Promise 实例，该实例的状态为`rejected`。

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
p.then(null, function (s) {
  console.log(s)
});
```

注意：`Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续回调方法的参数。这一点与`Promise.resolve`方法不一致。

#### try() 

`Promise.try()`是现在有一个[提案](https://github.com/ljharb/proposal-promise-try)，Promise 来统一处理同步函数和异步操作，都用`then`方法指定下一步流程，用`catch`方法处理`f`抛出的错误。

一般就会采用下面的写法：

```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```

上面的写法有一个缺点，就是如果`f`是同步函数，那么它会在本轮事件循环的末尾执行，即就是说，它并没有像同步函数一个立即执行。

那么有没有一种方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 呢？回答是可以的，并且还有两种写法：

* 用`async`函数来写

  ```js
  const f = () => console.log('now')
  (async () => f())()
  console.log('next')
  // now
  // next
  ```

* 使用`new Promise()`

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

`Promise.try`方法替代上面的写法：

```js
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```



### Promise 拒绝事件

#### rejectionhandled

当一个Promise错误最初未被处理，但是**稍后又得到了处理**，则会触发**rejectionhandled**事件：

```js
// 不会触发
window.addEventListener("rejectionhandled", event => {
    console.log("拒绝原因: " + event.reason)
}, false)
let p = Promise.reject('rejected').then(res => {}, err => {})
```

```js
// 触发
window.addEventListener("rejectionhandled", event => {
    console.log("拒绝原因: " + event.reason)
}, false)
let p = Promise.reject('rejected')
setTimeout(() => {
    // 或者 p.catch(e =>{})
    p.then(res => {}, err => {})
}, 1000)
```

#### unhandledrejection

当 Promise 被拒绝，但没有提供 `reject` 函数来处理该 rejection 时，会派发此事件。

```js
//window
window.addEventListener("unhandledrejection", event => {
    /* 你可以在这里添加一些代码，以便检查
     event.promise 中的 promise 和
     event.reason 中的 rejection 原因 */

    //告诉 JavaScript 引擎当 promise 被拒绝时不要执行默认操作，默认操作一般会包含把错误打印到控制台。
    event.preventDefault()
}, false)
new Promise((resolve, reject) => {
    x = x + 1
}).then(() => {})
```

```js
//Node.js
process.on('unhandledRejection', (reason, promise) => {
})
```



### promise串行运行

以下是用 Promise 来包裹 `setTimeout()` 函数，并返回 promise 实例，作测试用例：

```js
const func1 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('func1')
        resolve('func1')
    }, 2000)
})
const func2 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('func2')
        resolve('func2')
    }, 1000)
})
const func3 = () => new Promise(resolve => {
    setTimeout(() => {
        console.log('func3')
        resolve('func3')
    }, 1000)
})
```

`Promise.all()` 和 `Promise.race() `是并行运行异步操作的两个函数，其参数中的 Promise 实例，是并行执行的，不存在等待关系。

```js
Promise.all([func1(), func2(), func3()]).then(res => {
    console.log('Promise.all：', res)
})

/*
func2
func3
func1
Promise.all： (3) ['func1', 'func2', 'func3']
/*
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=2)



Promise 串行运行，即 promise1 运行完，再运行 promise2。。。，可以通过以下方法实现：

#### Promise 链式调用

```js
Promise.resolve().then(func1).then(func2).then(func3).then(res => {
    console.log('参数：', res)
})
/*
func1
func2
func3
参数： func3
*/
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=3)

依次调用 `func1、func2、func3`，返回 `func3` 的执行结果。



#### for 版本

```js
function sequencePromisesWithForThen (promises) {
    function recordValue(results, value) {
        results.push(value)
        return results
    }
    // 记录每个Promise实例的执行结果。如果不调用此方法，函数最后的Promise的传递出来的参数，只有最后一个Promise实例的执行结果
    let pushValue = recordValue.bind(null, [])
    let promise = Promise.resolve()
    for (let i = 0; i < promises.length; i++) {
        promise = promise.then(promises[i]).then(pushValue)
    }
    return promise
}

sequencePromisesWithForThen([func1, func2, func3]).then(res => {
    console.log('sequencePromisesWithForThen：', res)
})
/**
func1
func2
func3
sequencePromisesWithForThen： (3) ['func1', 'func2', 'func3']
**/
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=4)



#### reduce 版本

```js
function sequencePromisesWithReduce (promises) {
  function recordValue(results, value) {
      results.push(value)
      return results
  }
  // 记录每个Promise实例的执行结果。如果不调用此方法，函数最后的Promise的传递出来的参数，只有最后一个Promise实例的执行结果
  let pushValue = recordValue.bind(null, [])
  return promises.reduce((promise, task) => {
    return promise.then(task).then(pushValue)
  }, Promise.resolve())
}

sequencePromisesWithReduce([func1, func2, func3]).then(res => {
    console.log('sequencePromisesWithReduce：', res)
})
/**
func1
func2
func3
sequencePromisesWithReduce： (3) ['func1', 'func2', 'func3']
**/
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=5)



#### async/await

```js
async function sequencePromisesForAsync(promises) {
    let result
    for (let f of promises) {
        result = await f(result)
    }
    console.log('sequencePromisesForAsync：', result)
    return result
}

sequencePromisesForAsync([func1, func2, func3])
/**
func1
func2
func3
sequencePromisesForAsync： func3
**/
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/11-promise.html?type=6)

**注意：以上串行运行方法中的参数是函数，不是 Promise 对象。**



### 常见问题

#### IE 不技持 Promise

引入 `polyfill.js` ：`<script src="https://cdn.bootcdn.net/ajax/libs/babel-polyfill/7.10.4/polyfill.js"></script>`

或者通过 `node `安装并引入[@babel/polyfill](https://www.npmjs.com/package/@babel/polyfill)

```js
npm i @babel/polyfill -S

// js文件中引入
import '@babel/polyfill'
```

#### Promise嵌套

优先执行 Promsie 构造其中的同步任务，再执行`then`方法。

```js
new Promise((resolve, reject) => {
    console.log('1')
    resolve()
    new Promise((resolve, reject) => {
        console.log('2')
        resolve()
    }).then(() => {
        console.log('3')
    })
}).then(() => {
    console.log('4')
})

/**
1
2
3
4
**
```



### 参考链接

[MDN promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[阮一峰 ECMAScript 6 入门 promise](https://es6.ruanyifeng.com/#docs/promise)

