## Node.js：global（全局变量）

全局变量在所有的模块中都可用。 本文列出的对象特定于 Node.js，有些内置对象是 JavaScript 语言本身的一部分，它们也是全局可访问的。

有些变量虽然看似全局的，但实际上不是，它们仅存在于模块的作用域中：

- __dirname
- __filename
- exports
- module
- require()

### 全局变量

#### [Buffer 类](https://www.apiref.com/nodejs-zh/buffer.html)

用于直接处理二进制数据。 

* Buffer.alloc(size[, fill[, encoding]])
* Buffer.allocUnsafe(size)
* Buffer.allocUnsafeSlow(size)
* Buffer.byteLength(string[, encoding])
* Buffer.compare(buf1, buf2)
* Buffer.concat(list[, totalLength])
* Buffer.from(array)
* Buffer.from(arrayBuffer[, byteOffset[, length]])
* Buffer.from(buffer)
* Buffer.from(object[, offsetOrEncoding[, length]])
* Buffer.from(string[, encoding])
* Buffer.isBuffer(obj)
* Buffer.isEncoding(encoding)
* Buffer.poolSize
* ...

#### Console 类

console 模块提供了一个简单的调试控制台，类似于 Web 浏览器提供的 JavaScript 控制台。

该模块导出了两个特定的组件：

* 一个 Console 类，包含 console.log() 、 console.error() 和 console.warn() 等方法，可以被用于写入到任何 Node.js 流。
* 一个全局的 console 实例，可被用于写入到 process.stdout 和 process.stderr。 注意：全局的 console 对象的方法既不总是同步的（如浏览器中类似的 API），也不总是异步的（如其他 Node.js 流）。

Console 类可用于创建一个具有可配置的输出流的简单记录器：

```javascript
const { Console } = require('console');
// 或者
const { Console } = console;
```

* `new Console(stdout[, stderr])`
* `console.assert(value[, message][, ...args])`
* `console.clear()`
* `console.count([label])`
* `console.countReset([label='default'])`
* `console.debug(data[, ...args])`
* `console.dir(obj[, options])`
* `console.error([data][, ...args])`
* `console.group([...label])`
* `console.groupCollapsed()`
* `console.groupEnd()`
* `console.info([data][, ...args])`
* `console.log([data][, ...args])`
* `console.time(label)`
* `console.timeEnd(label)`
* `console.trace([message][, ...args])`
* `console.warn([data][, ...args])`

#### exports

exports 变量是在模块的文件级别作用域内有效的，它在模块被执行前被赋予 module.exports 的值。

它有一个快捷方式，以便 `module.exports.f = ...` 可以被更简洁地写成 `exports.f = ...`。 

**注意：** 就像任何变量，如果一个新的值被赋值给 `exports`，它就不再绑定到 `module.exports`。

```javascript
module.exports.hello = true; // 从对模块的引用中导出
exports = { hello: false };  // 不导出，只在模块内有效
```

当 module.exports 属性被一个新的对象完全替代时，也会重新赋值 exports，例如：

```javascript
module.exports = exports = function Constructor() {
  // ... 及其他
};
```

#### global

全局的命名空间对象。

在浏览器中，顶层作用域就是全局作用域。 这意味着在浏览器中，var something 会定义一个新的全局变量。 在 Node.js 中则不同，顶层作用域不是全局作用域，var something 的作用域只在模块内。

#### module

在 Node.js 模块系统中，每个文件都被视为独立的模块。

在每个模块中，module 的自由变量是一个指向表示当前模块的对象的引用。 为了方便，module.exports 也可以通过全局模块的 exports 对象访问。 module 实际上不是全局的，而是每个模块本地的。

#### process

process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。 因为是全局变量，所以无需使用 require()。

#### require()

引入模块。

#### __dirname

当前模块的目录名。

**注意：** __dirname 变量虽然看似全局的，但实际上不是。 

```javascript
console.log(__dirname) // '/Users/xxx/Documents/xxx/demo-lizh/node/nodejs'
```

#### __filename

当前模块的文件名，返回当前模块文件的绝对路径（符号链接会被解析）。

**注意：** __filename 变量虽然看似全局的，但实际上不是。 

```javascript
console.log(__filename) // '/Users/xxx/Documents/xxx/demo-lizh/node/nodejs/global.js'
```

**注意：** 对于主程序，这不一定与命令行中使用的文件名相同。

也就是说，运行 `node main.js`，`main.js` 导入 `a.js` 文件，`a.js` 文件中 `console.log(__filename)` 语句打印的是 `a.js` 文件的绝对路径，而不是 `main.js` 文件的绝对路径。

#### setImmediate(callback[, ...args])

setImmediate 参数中的回调函数是在事件循环的下一个迭代中执行。

当多次调用 setImmediate() 时， callback 函数会按它们被创建的顺序放入排队等待执行。 每轮的事件循环迭代都会处理整个回调队列。 如果一个 immediate 定时器是从一个正在执行中的回调内部被放入队列，则该定时器将不会被触发，直到下一轮的事件循环迭代。

**注意：** 延迟 0 毫秒的 setTimeout() 回调与 setImmediate() 非常相似。它们的执行顺序取决于各种因素，但是都会在事件循环的下一个迭代中运行。

零延迟 setTimeout() 和 setImmediate() 的执行顺序：

* 在文件 I/O、网络 I/O 等异步任务中，setImmediate() 会先于 setTimeout(fn,0)。（注意：这里仅指 Node.js 中，浏览器的事件循环机制是不一样的）。

  ```javascript
  const fs = require('fs')
  fs.readFile(__filename, () => {
      setTimeout(() => {
          console.log('1')
      }, 0)
      setImmediate(() => {
          console.log('2')
      })
  })
  // 2
  // 1
  ```

  

* 其他情况下，一般来说，取决于同步代码执行时间：代码执行时间较长（Node.js 中，一般是指超过 1ms，因为，Node.js 会将 setTimeout(fn, 0) 强制改为setTimeout(fn, 1)），则 setTimeout(fn,0) 先执行；否则 setImmediate() 先执行。

  ```javascript
  setTimeout(() => {
    console.log('1')
  }, 0)
  setImmediate(() => {
    console.log('2')
  })
  // 顺序不确定
  ```

#### clearImmediate(immediate)

取消由 setImmediate() 创建的 Immediate 对象。

#### setInterval(callback, delay[, ...args])

**每隔** delay 毫秒重复执行 callback。

当 delay 大于 2147483647 或小于 1 时，则 delay 将会被设置为 1。 非整数的 delay 会被截断为整数。

#### clearInterval(timeout)

取消由 setInterval() 创建的 Timeout 对象。

#### setTimeout(callback, delay[, ...args])

在 delay 毫秒之后执行一次性的 callback。

callback 可能不会精确地在 delay 毫秒后被调用 。 Node.js 不保证回调被触发的确切时间，也不保证它们的顺序。 回调会在尽可能接近指定的时间被调用。

当 delay 大于 2147483647 或小于 1 时，则 delay 将会被设置为 1。 非整数的 delay 会被截断为整数。

#### clearTimeout(timeout)

取消由 setTimeout() 创建的 Timeout 对象。

**注意：** 在Node.js 中，setImmediate()、setInterval() 和 setTimeout() 方法会各自返回表示安排的定时器的**对象**；而在浏览器中，它们的返回值是一个正整数，表示定时器的编号。

### 参考资料

[API Reference Document - global（全局变量）](https://www.apiref.com/nodejs-zh/globals.html)

[setTimeout和setImmediate到底谁先执行，本文让你彻底理解Event Loop](https://juejin.cn/post/6844904100195205133)