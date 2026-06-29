## 前端模块化编程：CommonJS、AMD、CMD、UMD、ES6

前端模块化编程是一种将复杂的代码，按功能 / 职责拆分为独立、封闭、可复用的小块（模块），并通过统一规范实现模块间导入、导出、依赖管理的开发方式。

前端模块化编程具有以下优势：

- **可维护性**：模块独立，便于调试和更新。
- **可复用性**：模块可在不同项目中重复使用。
- **命名空间管理**：避免全局变量污染。
- **依赖管理**：明确声明模块间的依赖关系。

模块化编程是“**高内聚，低耦合**” 的基础。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。

### 早期的模块化方案

在各种模块化规范出来之前，一般使用匿名闭包函数解决模块化的问题。

```js
var num0 = 2;
(function () {
    var num1 = 3
    var num2 = 5 
    var add = function () {
        return num0 + num1 + num2
    }
    console.log(add()) // 10
})()
```

这样做的好处是，可以在函数内部使用全局变量和局部变量，并且不用担心局部变量污染全局变量。

这种用括号把匿名函数包起来的方式，也叫做立即执行函数（IIFE）。所有函数内部代码都在闭包（closure）内。它提供了整个应用生命周期的私有和状态。

### CommonJs规范

**核心思想：**通过 exports 或者 module.exports 导出需要暴露的接口，再通过 require 方法来 **同步加载** 所要依赖的其他模块。

**其特点是：**

- **同步加载**：加载时执行，且模块加载是同步的，适合服务器环境。
- **值拷贝**：导出的是值的拷贝，不是引用。
- **缓存机制**：模块第一次加载后会被缓存。

**注意：Nodejs 使用的是 CommonJs 规范。CommonJS 只能用于服务器，前端浏览器不支持。**

**定义 CommonJs 模块：**

```javascript
// a.js
var x = 5
var addX = function (value) {
    return value + x
}
module.exports.x = x
module.exports.addX = addX
```

`module.exports` 本身就是一个对象，所以，在导出时可以使用 ` module.exports = {foo: 'bar'}` 也可以使用 `module.exports.foo = 'bar'`。

但是， `exports `是 `module.exports` 的一个引用，或者理解为是一个指针，指向 `module.exports`，这样，我们就只能使用 `exports.foo = 'bar'` 的方式，而不能使用` exports = {foo: 'bar'} ` 这种方式，因为这种方式会导致 `exports ` 指向了别的对象，那么这个模块的输出就会有问题了。

```javascript
// 错误，会断开引用
exports = { foo: 'bar' }

// 正确
module.exports = { foo: 'bar' }
exports.foo = 'bar'
```

**加载 CommonJs 模块：**

```javascript
var a = require('./a.js')

console.log(a.x) // 5
console.log(a.addX(1)) // 6
```

> **为什么 CommonJS 规范不适合作为浏览器的规范**
>
> 由于 CommonJS 是同步加模块，在服务端加载模块时都是从本地硬盘中加载，读取速度很快。但是在浏览器端加载模块时，需要请求服务器端，涉及网速、代理的问题，一旦等待时间过长，浏览器会处于“假死”状态。

### AMD规范

AMD，异步模块化定义（Asynchronous Module Definition）。

**核心思想：「动态创建 `<script>` 标签」来做异步加载 + 依赖管理 + 回调执行。**

**其特点是：**

- **依赖前置**：在定义时就声明所有依赖。
- **异步并行**：多个模块并行加载。
- **回调执行**：前置依赖，**所有依赖加载完立即执行**。

**目前，主要有两个 Javascript 库实现了 AMD 规范：require.js 和 curl.js。**

**定义 ADM 模块：**

```js
define(['a'], function(myLib){
    function foo(){
        myLib.doSomething()
    }
    return {
        foo : foo
    }
})
```

**加载 AMD 模块：** 

```js
require([module], callback);
// 第一个参数[module]，是一个数组，里面的成员就是要加载的模块；
// 第二个参数callback，则是加载成功之后的回调函数。
```

```js
require(['a', 'b', 'c'], function (a, b, c){
	// some code here
});
```

### CMD规范

CMD，Common Module Definition，通用模块定义，是阿里的玉伯提出来的。 

**核心思想：与 AMD 一样，「动态创建 `<script>` 标签」来做异步加载 + 依赖管理 + 回调执行。**

**核心区别**：AMD 和 CMD 都需要先加载完所有依赖文件，但 AMD 是**前置依赖**，加载完后立即执行，而 CMD 是**就近依赖**，遇到 require 语句时才执行。

**其特点是：**

- **依赖就近**：在代码中需要的地方声明依赖。
- **延迟执行**：工厂函数在需要时才执行。
- **同步 require**：提供类似 CommonJS 的同步写法。

**CMD是 sea.js 在推广过程中对模块定义的规范化产物。**

```js
define(function(require, exports, module) {
    var a = require('./a') //在需要时申明
    a.doSomething()
    if (false) {
        var b = require('./b')
        b.doSomething()
    }
})
```

### UMD规范

UMD，Universal Module Definition，通用模块定义。它并不是一种规范，而是结合 AMD/CMD 和 CommonJS 的一种更为通用的 JS 模块解决方案。

UMD 模块既能在服务端（node）运行，又能在浏览器端运行。

**其特点是：**

- **环境嗅探**：运行时检测当前环境。
- **多重适配**：一套代码适配多种规范。
- **回退机制**：最后回退到全局变量。

**其实现很简单：**

* 先判断是否支持 Node.js 模块格式（exports是否存在），存在则使用 CommonJS 规范。
* 再判断是否支持 AMD/CMD（define是否存在），存在则使用 AMD/CMD 规范。
* 前两个都不存在，则将模块公开到全局（window或global）。

```javascript
(function (root, factory) {
  // 1. AMD 环境（浏览器 RequireJS）
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory); // 依赖前置
  }
  // 2. CommonJS 环境（Node.js）
  else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  }
  // 3. 普通浏览器（全局变量）
  else {
    root.MyLib = factory(root.jQuery);
  }
})(this, function ($) {
  // ===== 真正的模块代码 =====
  function hello() {
    return 'Hello UMD';
  }
  return { hello };
});
```

### ES6 Modules

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

**其特点是：**

- **静态结构**：import/export 必须在顶层，便于静态分析，编译时确定依赖；
- **实时绑定**：导出的是值的引用，不是拷贝；
- **严格模式**：默认在严格模式下执行；
- **循环引用处理**：有完善的循环引用处理机制。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

* **运行时加载**：CommonJS 和 AMD 加载是运行时加载，即只有运行时才能得到这个对象。
* **编译时加载**：也称静态加载，ES6 模块是编译时加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

之前的几种模块化方案都是前端社区自己实现的，只是得到了大家的认可和广泛使用，而 ES6 的模块化方案是真正的规范。 

在 ES6 中，使用 import 引入模块、export 导出模块，功能比 AMD/CMD/CommonJS 更强大。现代浏览器和 Node.js 已经**原生支持 ES6 Modules**，只有在需要兼容旧环境时，才会使用 Babel/Webpack 等工具将 ESM 编译为 CommonJS（require）等兼容格式。

#### export命令

* export 命令除了输出变量，还可以输出函数或类（class）。
* 通常情况下，export 输出的变量就是本来的名字，但是可以使用 as 关键字重命名。
* export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。import 也一样。

```js
// profile.js
export var firstName = 'Michael'
export function multiply(x, y) {
  return x * y
}
function func1() { ... }
export {
  efunc1 as func1,
  efunc2 as func1
}
```

#### import命令

使用 export 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 import 命令加载这个模块。

* import 命令可以使用 as 关键字，将输入的变量重命名。
* import 命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

* import 命令具有提升效果，会提升到整个模块的头部，首先执行。
* import 是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
* 多次重复执行同一句 import 语句，那么只会执行一次，而不会执行多次

```js
import { firstName, multiply, efunc1 } from './module.js'
import('./module.js').then(module => {
  module.doSomething()
})
const module = await import('./module.js')
```

**注意：**目前阶段，通过 Babel 转码，CommonJS 模块的 require 命令和 ES6 模块的 import 命令，可以写在同一个模块里面，但是最好不要这样做。因为 import 在静态解析阶段执行，所以它是一个模块之中最早执行的，可能导致加载的顺序跟预期不符。

#### 其他用法

模块的整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面：

```javascript
import * as Utils from './profile'
```

export default，为模块指定默认输出：

```javascript
// 导出
export default {
	firstName,
  multiply,
  efunc1 as func1,
  efunc2 as func1
}

// 导入
import Utils from './profile'
```

export 与 import的复合写法，即在一个模块之中，先入后输出同一个模块：

```javascript
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

模块的继承：

```javascript
export * from 'my_module'
```

获取模块的元信息：

```javascript
console.log(import.meta.url)
```

### Node.js 加载模块

JavaScript 现在有两种模块加载方式：一种是 ES6 模块，简称 ESM；另一种是 CommonJS 模块，简称 CJS。

- **CommonJS（CJS）**：Node.js 传统默认模块系统，使用 `require()` / `module.exports` / `exports` 语法，**同步**加载、运行时解析。
- **ES6 Modules（ESM）**：JavaScript 官方标准模块，使用：`import` / `export` / `export default` 语法，**异步**加载、静态解析。

**如何选择加载方式**：

* `.mjs` 文件：永远按 ESM 加载。
* `.cjs` 文件：永远按 CJS 加载。
* `.js` 文件：取决于 `package.json` 配置。`"type": "module"` 用 ESM，缺省或 "type": "commonjs"则用 CJS。

```js
// package.json
{
   "type": "module"
}
```

**注意：**ES6 模块与 CommonJS 模块尽量不要混用。旧版 Node.js 中 `require` 不能加载 `.mjs`；**v20.19+/v22+ 已默认支持 `require(esm)`**，但只能导入 ESM 的**默认导出**，命名导出无法直接访问。反过来，ESM**顶层不能直接用 `require`**；可通过 `createRequire` 或 `import()` 加载 CommonJS。

```javascript
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const lodash = require('lodash')
```

### ES6 加载 CommonJS

ESM `import` 可加载 CommonJS，但**CommonJS 只有默认导出、无命名导出**，因此只能用默认导入整体加载；用命名导入会得到 `undefined`。

```js
import packageMain from 'commonjs-package';
import { method } from 'commonjs-package';
import('commonjs-package').then((packageMain)=>{})
```

### 各规范的综合比较

**CommonJS 和 AMD/CMD：**

* CommonJS 加载模块是**同步**的，加载完成后才能执行后面的操作。
* AMD/CMD 加载模块是**异步**的，加载过程中不会阻塞后面语句的执行，加载完成后会执行回调函数中的语句。

**AMD 和 CMD：**

* AMD 推崇**前置依赖**，即所有依赖的模块全部加载完，立即执行所有模块。
* CMD 推崇**就近依赖**，即所有依赖的模块全部加载完，不会立即执行所有模块，而是当 `requre` 某个模块时，才会执行。 

```javascript
// AMD: 依赖必须一开始就写好 
define(['./a', './b'], function(a, b) { 
  a.doSomething()
  b.doSomething()
})

// CMD: 依赖可以就近书写
define(function(require, exports, module) {
   var a = require('./a')
   a.doSomething()
   var b = require('./b')
   b.doSomething()
})
```

**ES6 Modules 和 CommonJS：**

* CommonJS 模块输出的是一个值的拷贝；ES6 Modules 模块输出的是值的引用。
* CommonJS 模块是运行时加载；ES6 Modules 模块是编译时输出接口。
* CommonJS 模块的 require() 是同步加载模块；ES6 Modules 的**文件下载是异步**的，但**静态 import 语法本身是同步**的。动态导入 `import()` 才返回 Promise。
* ES6 模块之中，顶层的 this 指向 undefined；CommonJS 模块的顶层 this 指向当前模块。

| 特性         | CommonJS               | AMD                            | CMD                            | UMD      | ES6 Modules        |
| ------------ | ---------------------- | ------------------------------ | ------------------------------ | -------- | ------------------ |
| **加载方式** | 同步                   | 异步                           | 异步                           | 多种     | 异步下载、同步执行 |
| **适用环境** | 服务器端               | 浏览器端                       | 浏览器端                       | 通用     | 通用               |
| **语法**     | require/module.exports | define                         | define                         | 兼容判断 | import/export      |
| **依赖处理** | 运行时                 | 前置依赖（提前加载，立即执行） | 就近依赖（提前加载，延迟执行） | 多种     | 编译时             |
| **性能**     | 适合服务器             | 浏览器可用                     | 延迟执行                       | 兼容     | 支持 tree-shaking  |
| **标准化**   | 社区标准               | 社区标准                       | 社区标准                       | 社区标准 | 官方标准           |

### 模块的循环引用

**循环引用**（Circular Dependency）是指两个或多个模块相互依赖，形成闭环的依赖关系。比如：a 模块引用了 b 模块，而 b 模块又引用了 a 模块。

```javascript
// a.js
import b from './b.js'
console.log(b)

// b.js
import a from './a.js'
console.log(a)
```

**循环引用产生的问题：**

- **初始化顺序问题**：哪个模块应该先执行？
- **死循环风险**：如果没有正确处理，会导致无限递归。
- **未定义访问**：在模块未完全初始化时访问其导出。
- **内存泄漏**：某些情况下可能导致内存无法释放。

#### CommonJS 的处理机制

**核心原理：同步加载 + 记录模块缓存，** 即采用 "部分执行" 策略，遇到循环引用时返回**已经执行完成的部分**，未执行的部分不会输出。

**处理机制：**

- CommonJS 是**同步加载**，模块加载时会生成一个**exports 空对象**并缓存。
- 遇到循环依赖时，**直接返回当前已缓存的 exports 对象**（只有已执行部分）。
- 不会等待模块完全执行完毕，也不会重新加载。
- 模块后续给 exports 赋值，会同步到缓存对象上。

```javascript
// main.js
require('./assets/js/a.js')
console.log('done')

// a.js
var moduleB = require('./b.js')
console.log(moduleB.b)
moduleB.funcB()
module.exports = {
  a: 'a',
  funcA: function () {
    console.log('funcA')
  }
}

// b.js
var moduleA = require('./a.js')
console.log(moduleA.a)
moduleA.funcA()
module.exports = {
  b: 'b',
  funcB: function () {
    console.log('funcB')
  }
}
```

```shell
undefined
Uncaught TypeError: moduleA.funcA is not a function
```

运行 `node main.js` 命令，大致执行过程如下：

- **`a.js`**：执行 `var moduleB = require('./b.js')` 时，转去执行 `b.js`；
- **`b.js`**：执行 `var moduleA = require('./a.js')` 时，`a.js` 已执行过（但未全部执行完），只能导出已执行部分，也就是一个**空 exports 对象**。
- **`b.js`**：执行 `console.log(moduleA.a)`，打印为 `undefined`。
- **`b.js`**：执行 `moduleA.funcA()`，报错：`Uncaught TypeError: moduleA.funcA is not a function`，执行结束。

**一句话总结：CommonJS 导出的是「值的拷贝」，循环依赖时返回未完全赋值的缓存对象，可能拿到 undefined。**

#### ES6 Modules 的处理机制

**核心原理：静态解析 + 导出引用绑定 + ，** 在代码执行前就建立了导入导出的绑定关系。

**处理机制**：

- ESM 分为三个阶段：**解析 → 加载 → 执行**。
- 解析阶段会**构建完整的模块依赖图**，确定所有导入导出关系。
- ESM 导出的不是值拷贝，而是**引用绑定**。
- 为每个模块创建一个**模块环境记录**，初始为 **"未初始化"** 状态。模块有三种状态：**未声明**（绑定不存在）、**未初始化**（绑定存在但未赋值）、**已初始化**（绑定已赋值）。
- 深度优先执行，先把依赖链最深的模块执行完。
- 循环依赖时，**不重新解析模块，直接使用已有的模块记录**。
- 真正执行时，变量会保持最新的引用关系。

```javascript
// main.js
import './c.js'
console.log('done')

// c.js
import { d, funcD } from './d.js'
console.log(d)
funcD()
export var c = 'c'
export function funcC () {
  console.log('funcC')
}

// d.js
import { c, funcC } from './c.js'
console.log(c)
funcC()
export var d = 'd'
export function funcD () {
  console.log('funcD')
}
```

```javascript
undefined
funcC
d
funcD
done
```

运行 `node main.js` 命令，大致执行过程如下：

* **`执行 main.js`**：发现 `import './c.js'`，去加载 `c.js`。

* **`加载 c.js`**：发现 `import {d, funcD} from './d.js'`，去加载 `d.js`。

- **加载 `d.js`**：发现 `import {c, funcC} from './c.js'`，`c.js` 已经在加载中了，不会重复加载，直接建立引用关系。

* **执行 d.js（最深层）**：**函数声明会提升，var 声明也会提升，但赋值不会提升**。所以，`c` 变量**已声明但未赋值**，`console.log(c)` 输出 `undefined`；`funcC` 函数**已经存在**（函数提升），`funcC()` 输出 `funcC`。
* **`执行 c.js`**：`d.js` 已经完全执行完毕，`d` 已经赋，`funcD` 也已定义。`console.log(d)` 输出 `d`，`funcD()` 输出 `funcD`。
* **`执行 main.js`**：`console.log('done')` 输出 `done`，执行结束。

**一句话总结：ES Module 导出的是「引用」，循环依赖时保持变量实时同步，不会出现缓存值不一致问题。**

#### webpack 的处理机制

Webpack 本身**不创造新的模块化规范**，它只是把 `ESM / CommonJS` 代码编译成浏览器可执行的代码，内部用一套自己的模块系统 __webpack_require__ 模拟 Node.js 的模块加载，严格保留原规范（`ESM / CommonJS`）的行为：缓存、导出、循环依赖策略完全忠于原规范。

`__webpack_require__` 是 Webpack 内部模块系统核心，是模拟 CommonJS 实现的**万能模块加载器**，所有模块最终都跑在它上面。**只要进入 `__webpack_require__`，就会立刻生成一个空的 `module.exports = {}` 并放入缓存。**循环依赖时，**直接返回这个空 / 半成品对象**，不会重新执行，不会死循环。

这就是 Webpack 处理**所有循环依赖**的底层机制。

```javascript
var installedModules = {}; // 模块缓存池（关键！循环依赖全靠它）

function __webpack_require__(moduleId) {
  // 1. 缓存已有 → 直接返回
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }

  // 2. 创建空模块：空 exports + 未加载完成标记
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}  // 空对象！循环依赖时就返回这个半成品
  };

  // 3. 执行模块代码
  modules[moduleId].call(
    module.exports, 
    module, 
    module.exports, 
    __webpack_require__
  );

  // 4. 标记加载完成
  module.l = true;

  // 5. 返回导出对象
  return module.exports;
}
```

##### CommonJS 循环依赖

完全遵循 CommonJS 原规范：

- 导出是值的拷贝；
- 循环依赖时返回缓存中的 exports 对象；
- 函数声明、变量声明**不会提升**到 exports 上。
- 返回的 exports 是空对象，**函数不会提前挂载**，调用直接报错。

![微信图片_20231112214641](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/微信图片_20231112214641.jpg)



##### ESM 循环依赖

**把 ESM 编译成 CommonJS 格式，但保留 ESM 核心特性：**

- 导出的是引用；
- 循环依赖时返回缓存中的 exports 对象；
- 函数声明、变量声明（不赋值）**会提升**到 exports 上。
- 返回的 exports，**函数会提前挂载**，调用不报错。

![微信图片_20231112214652](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/微信图片_20231112214652.jpg)

##### CommonJS 和 ESM 循环依赖的核心差异

Webpack 的 `installedModules` 缓存对 CommonJS 和 ESM **完全一致**，都是一开始创建空 `exports` 对象。

**核心差异源于编译阶段**：

- CommonJS：不做任何提升，代码执行到才赋值，循环依赖时返回**纯空对象**。
- ESM：**函数提前挂载到 exports**，变量只声明不赋值，循环依赖时返回**半成品对象**。

### 常见问题

#### 为什么说 ESM 是「异步加载」？

**一句话核心**：ESM 的异步是指，**不会阻塞 HTML 解析 / 页面渲染**，文件下载过程是后台进行的。

**最关键的理解**：**ESM 的「异步」不是指 import 异步执行！**而是指模块文件的下载过程是异步的（后台下载），不会阻塞 HTML 和页面渲染。模块的执行顺序仍然是有序、同步、深度优先的！

`<script type="module">` 默认是 `defer` 行为，是**异步 / 非阻塞**的：

* 浏览器读到它，**不停止 HTML 解析，后台悄悄下载 JS**；
* 下载期间，页面继续渲染，不会阻塞页面；
* 下载完，在合适时机执行（HTML 解析完 + 全依赖下载完）。

### 总结

2026 年模块化现状：ESM 是未来标准、浏览器原生支持、Node.js 主推；CommonJS 是现在主流、存量巨大、生态成熟；AMD/CMD 已淘汰。


### 参考资料

[ECMAScript 6 入门 Module 的语法](https://es6.ruanyifeng.com/#docs/module)

[CommonJS,AMD,CMD和ES6的对比](https://cloud.tencent.com/developer/article/1525043)