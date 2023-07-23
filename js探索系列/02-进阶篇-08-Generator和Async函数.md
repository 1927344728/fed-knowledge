## 进阶篇：Generator和Async函数

Generator 函数，也称生成器函数，是 ES2015 提供的异步解决方案；Async 函数是 ES2017 提供的异步编程的终极解决方案。

**Async 函数是 Generator 函数的语法糖**，其本质是 Generator 函数 + 执行器。

### Generator函数

Generator 是 ES6 提供的一个新的数据类型，可以叫做 Generator 函数，其最大特点就是可以**控制函数的执行**（在执行时能暂停，后面又能从暂停处继续执行）。

语法上，Generator 函数是一个普通函数，但是有以下特征：

* 函数声明中，function 关键字与函数名之间有一个星号（`*`）；
* 函数体内部使用 yield（英语里的意思就是“产出”） 关键字来暂停和恢复 Generator 函数；
* Generator 函数调用后，并不立即执行，而是返回一个指向内部状态的指针对象，该对象是一个迭代器对象。
* 调用返回的迭代器对象的 next() 方法，会移动内部指针，使得指针指向下一个状态。next() 方法会返回一个对象，该对象包含 value 和 done 属性，value 的值是 yield 后面表达式的值；done 属性表示 Generator 函数是否执行完毕，即是否还有下一个阶段。

```javascript
function* genFunc(x) {
    const y = 2 * (yield (x + 1))
    const z = yield (y / 3)
    return (x + y + z)
}
const it = genFunc(5)
console.log(it.next())   // {value: 6, done: false}
console.log(it.next(12)) // {value: 8, done: false}
console.log(it.next(13)) // {value: 42, done: true}
```

代码执行分析：

* 调用 Generator 函数（可以传参），返回一个迭代器；
* 当执行第一次 next 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`；
* 当执行第二次 next 时，传入的参数 12 就会被当作上一个 yield 表达式的返回值，此时 `let y = 2 * 12`，所以第二个 yield 等于 `2 * 12 / 3 = 8`。**注意：** 如果 next 不传参，yield 永远返回 `undefined`。
* 当执行第三次 next 时，传入的参数 13 就会被当作上一个 yield 表达式的返回值，所以 `z = 13, x = 5, y = 24`，相加等于 42。

**注意：** Generator 函数不能当构造器使用。

#### yield关键字

yield 关键字用来暂停和恢复一个 Generator 函数。

```javascript
yield [expression]
```

yield 关键字使 Generator 函数执行暂停，其后面的表达式的值返回给 Generator 函数的调用者。返回值是一个迭代器执行结果的对象，有两个属性，value 和 done。value 属性是对 yield 表达式求值的结果，而 done 是false，表示 Generator 函数尚未完全完成；如果 Generator 函数已完成，则 value 为 undefned，done 为 true。

Generator 函数的执行，一旦遇到 yield 表达式，将被暂停，直到 Generator 函数的 next() 方法再次调用。每次调用 next() 方法，Generator 函数都会恢复执行，直到达到以下某个值：

* yield： Generator 函数再次暂停，返回结调用者的值，value 为 yield 表达式的值 并且 done 为 false。 下一次调用 next() 时，在 yield 之后的语句继续执行。
* throw： 用于从 Generator 函数中抛出异常。这让 Generator 函数完全停止执行，并且调用者后面的代码也无法继续执行，正如通常情况下抛出异常一样。
* 到达 Generator 函数的结尾：即，Generator 函数的执行结束，返回结调用者的值，value 为 undefined 并且 done 为 true。
* 到达 return 语句：即，Generator 函数的执行结束，返回结调用者的值，value 值由 return 语句指定，并且done 为 true。

```javascript
function* generatorFunc(x) {
    yield 1
    // throw '2'   // 抛出异常：Uncaught 2
    return 0
    console.log(3) // 永远不会执行
}
const it = generatorFunc()
console.log(it.next()) // {value: 1, done: false}
console.log(it.next()) // {value: 0, done: true}
console.log(it.next()) // {value: undefined, done: true}
```

**注意：** yield 表达式如果用在另一个表达式之中，必须放在圆括号里面。

```javascript
function* generatorFunc(x) {
    const result1 = 2 + (yield x + 5)
    }
const it = generatorFunc(1)
console.log(it.next()) // {value: 6, done: false}
```

**注意：** yield 只能在 Generator 函数中使用，在其他地方使用会报错。

**注意：** yield 后面的操作是同步的。也就是说，如果是 yield 后面是异步操作，调用 next() 方法时，执行 Generator 函数会立即往后执行，不会等待当前停留的 yield 表达式异步操作完成。 

#### next()方法

返回一个包含 value 和 done 属性的对象。该方法也可以通过接受一个参数用以向 Generator 函数传值。

```javascript
gen.next(value)
```

next() 方法中的参数将成为 Generator 函数上一个 yield 表达式的返回值。

```java
function* generatorFunc(x) {
    const y = 2 * (yield (x + 1))
    const z = yield (y / 3)
    return z
}
const it = generatorFunc(5)
console.log(it.next(10)) // 传参将忽略
console.log(it.next())   // {value: NaN, done: false}，相当于 const y = 2 * undefined
console.log(it.next(13)) // {value: 13, done: true}，相当于 const z = 13
```

**注意：** 由于 next() 方法的参数是表示上一个 yield 表达式的返回值，所以在第一次使用 next() 方法时，传递参数是无效的。

next() 方法返回的对象包含两个属性：

* value：迭代器返回的任意值，即 yield 表达的返回结果。当 done 的值为 true 时，可以返回指定值，也可以忽略该值。
* done：布尔值。Generator 函数尚未完成，则值为 false；如果已完成，则返回 true。

#### throw()方法

用来向 Generator 函数抛出异常。

如果 throw() 抛出的异常能被 Generator 函数内的 try...catch 块捕获，则不会中断 Generator 函数执行，仍会执行到下一个 yield。也就是说，throw() 方法相当于执行了一次 next() 方法，只是跳到 catch 块中，并执行了其中的代码。

```javascript
function* genFunc() {
    try {
        yield 1
    } catch (e) {
        console.log(e)
    }
    yield 2
    yield 3
}
const it = genFunc()
console.log(it.next())
console.log(it.throw('飘过，你们继续'))
console.log(it.next())

// {value: 1, done: false}
// 飘过，你们继续
// {value: 2, done: false}
// {value: 3, done: false}
```

如果 Generator 函数未定义 try...catch 块，但 throw() 抛出的异常能被外部 try...catch 块捕获，则 Generator 函数执行结束，程序继续执行。

```javascript
function* genFunc() {
    yield 1
    yield 2
    yield 3
}
try {
    const it = genFunc()
    console.log(it.next())
    console.log(it.throw('你完了，但其他人还会好好的'))
    console.log(it.next())
} catch (e) {
    console.log(e)
}
console.log('是的，我们还很好')

// {value: 1, done: false}
// 你完了，但其他人还是好好的
// 是的，我们还很好
```

如果 throw() 抛出的异常，即未在 Generator 函数内被捕获，也没有被外部 try...catch 块捕获，则返回 throw() 抛出的异常，程序中断执行。

```javascript
function* genFunc() {
    yield 1
    yield 2
    yield 3
}
const it = genFunc()
console.log(it.next())
console.log(it.throw('毁灭吧，我累了'))
console.log(it.next())

// {value: 1, done: false}
// Uncaught 毁灭吧，我累了
```

**注意：** throw 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 next() 方法。

#### return()方法

用于结束 Generator 函数的执行，并返回给定的值。

```javascript
function* genFunc(x) {
    yield 1
    yield 2
}
const it = genFunc()
console.log(it.next())
console.log(it.return('我睡了，你们继续'))
console.log(it.next())
console.log('接着奏乐接着舞')

// {value: 1, done: false}
// {value: '我睡了，你们继续', done: true}
// {value: undefined, done: true}
// 接着奏乐接着舞
```

#### yield* 表达式

yield* 表达式用于操作一个可迭代对象，并产生它返回的**每个**值。yield* 表达式本身的值是当迭代器关闭时返回的值（即 done 为 true 时）。

```javascript
function* genFunc1(x) {
    yield 1
    yield 2
    yield 3
}
function* genFunc2(x) {
    yield 4
    yield genFunc1()
    yield 5
}
for (let v of genFunc2()) {
    console.log(v);
}
// 4
// genFunc1 {<suspended>}
// 5
```

yield* 表达式用于遍历一个可迭代对象。

将上述 `yield genFunc1()` 改成 `yield * genFunc1()`，得到结果：

```javascript
function* genFunc2(x) {
    yield 4
    yield* genFunc1()
    yield 5
}
// 4
// 1
// 2
// 3
// 5
```

#### 异步编程的执行器

使用 Generator 函数可以解决异步编程的问题：

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) { reject(err) }
            console.log(data)
            resolve(data)
        })
    })
}
function * genRead(value) {
    const r1 = yield read(value)
    const r2 = yield read(r1)
    const r3 = yield read(r2)
}

const it = genRead('./1.txt');
it.next().value.then((r1) => {
    it.next(r1).value.then((r2) => {
        it.next(r2).value.then(() => {
            console.log('全部完成！')
        })
    })
})
```

该解决方案存在两个问题：

* 需要手动调用每个步骤的执行。
* 存在代码层级嵌套问题，不利于阅读和调试。

以下是一个 Generator 函数异步编程的自动执行器，实现的原理是，保证每个 yield 返回的都是函数，并且当前 yield 返回的函数将下一个 yield 返回的函数作为回调函数，即，回调函数嵌套。

```javascript
const fs = require('fs')
// 将 yield 表达式转换为函数，作为迭代器返回的对象中 value 的值
function thunk(file) {
    return function (cb) {
        return fs.readFile(file, 'utf8', (err, data) => {
            if (err) { return }
            console.log(data)
            cb(data)
        })
    }
}
// 实现 Generator 函数异步编程的自动执行
function autoRunner(gen, value) {
    const it = gen(value);
    function next(data) {
        const result = it.next(data);
        if (result.done) {
            return;
        }
        result.value(next);
    }
    next();
}

const genFunc = function* (value){
    const f1 = yield thunk(value);
    const f2 = yield thunk(f1);
    const f3 = yield thunk(f2);
};
autoRunner(genFunc, './1.txt');
```

另外，也可以使用第三方包实现异步编程的自动执行，比如，co。

co 模块是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 Generator 函数的自动执行。

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) { reject(err) }
            console.log(data)
            resolve(data)
        })
    })
}
function * geneRead(value) {
  const r1 = yield read(value)
  const r2 = yield read(r1)
  const r3 = yield read(r2)
}

const co = require('co')
co(geneRead('./1.txt')).then(() => {
    console.log('全部完成！')
})
```

#### 其他应用场景

##### Iterator 生成函数

```javascript
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
};
const it = myIterable[Symbol.iterator]();
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

##### 多维数组转一维数组

```javascript
function* iterArr(arr) {
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            yield* iterArr(arr[i]);
        }
    } else {
        yield arr;
    }
}
const arr = [
    'a',
    ['b', 'c'],
    ['d', ['e', 'f']]
];
for (let v of iterArr(arr)) {
    console.log(v); // a b c d e f
}
// 或者
console.log([...iterArr(arr)]); // ['a', 'b', 'c', 'd', 'e', 'f']
```

### Async函数

Async 函数是 ES2017 提供的一种异步编程解决方案，也是异步编程的终极解决方案。其最大的优点是代码清晰，**让异步逻辑的代码看起来像同步一样**。

本质上，Async 函数是 Generator 函数的语法糖，是 Generator 函数 + Promise 的组合。

其实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里，类似上述讲到的 Generator  + co。

```javascript
const fs = require('fs')
function read(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) { reject(err) }
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

#### async函数

async 函数是使用 async 关键字声明的函数，函数体内允许使用 await 关键字。

```javascript
async function promiseRead() {
    await read('./1.txt')
}
```

Async 函数一定会返回一个 Promise 对象，即使不是，也会被隐式地包装在一个 Promise 中。该 Promise 要么会通过一个由 async 函数返回的值被解决，要么会通过一个从 async 函数中抛出的（或其中没有被捕获到的）异常被拒绝。

#### await关键字

await 关键字用于等待一个 Promise 对象。它只能在 Async 函数中使用。

await 关键字会暂停当前 Async 函数的执行，并出让其控制权，并等待 Promise 处理完成，再继续执行。若 Promise 正常处理，其回调的 resolve 函数参数作为 await 表达式的值，继续执行  Async 函数；若 Promise 处理异常 ，await 表达式会把 Promise 的异常原因抛出，中断 Async 函数执行。

另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。

**注意：** await 关键字只在 Async 函数内有效。如果出现在非 Async 函数内，就会抛出异常。

**注意：** 为避免 Await 命令后面的 Promise 对象抛出的异常中断 Async 函数执行，最好把 await 命令放在 try...catch 代码块中。

### 相关问题

#### next()、throw()、return() 的有何异同？

next()、throw()、return() 都能让 Generator 函数恢复执行，并且执行到下一个 yield 表达式。

next() 将 yield 表达式的结果替换成一个指定的值，不会结束 Generator 函数的执行。

throw() 将 yield 表达式的结果替换成一个指定的值（建议是 Error 对象），会结束 Generator 函数或者程序的执行（如果 Generator 函数内部或者外部没有 try...catch 捕获异常）。

return() 将 yield 表达式的结果替换成一个指定的值，会结束 Generator 函数的执行。

#### Generator 与 Async 对比？

* Generator 函数出现在 ES2015 中，Async 函数出现在 ES2017 中，Async 是 Generator 的语法糖。
* Generator 函数需要手动逐步执行或者使用自动执行器（如，co）；而 Async 函数自带执行器，执行方式与普通函数相同。
* Generator 函数的 `*` 号和 yield 的语义没那么清晰；Async 函数的 async 表示异步，await 表示等待，语义更加清楚。
* Generator 函数的 yield 后面只能跟 Thunk 函数或 Promise 对象；而 Async 函数的 await 后面可以是 Promise 对象或者原始类型的值（会自动转为立即 resovle 的 Promise 对象）；
* Generator 函数返回遍历器；Async 函数返回 Promise 对象。

#### 顶层await

早期的语法规定是，await 命令只能出现在 async 函数内部，否则都会报错。

```javascript
function genPromise() {
    return Promise.resolve(1)
}
const r1 = await genPromise()
console.log(r1)
```

报错：

```shell
Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
```

从 ES2022 开始，允许在模块的顶层独立使用 await 命令，主要目的是为解决模块异步加载的问题。

### 参考资料

[MDN - function*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)

[MDN - async 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

[阮一峰 - Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)

[阮一峰 - async 函数](https://es6.ruanyifeng.com/#docs/async)