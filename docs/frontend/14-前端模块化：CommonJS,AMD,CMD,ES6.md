## 前端模块化编程：CommonJS、AMD、CMD、UMD、ES6

模块化可以降低协同开发的成本，提高代码复用率，减少代码量，同时也是“高内聚，低耦合”的基础。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。

模块化主要解决两个问题：

* 命名冲突

* JS 文件存在依赖关系，加载必须有顺序。项目较大时，依赖会错综复杂。

目前流行的 JS 模块化规范有 CommonJS、AMD、CMD 以及 ES6 的模块系统。

### 早期的模块化解决方法

在各种模块化规范出来之前，人们使用匿名闭包函数解决模块化的问题。

```js
var num0 = 2 // 注意这里的分号
(function () {
    var num1 = 3
    var num2 = 5 
    var add = function () {
        return num0 + num1 + num2
    }
    console.log(add()) // 10
})()
```

这样做的好处是，你可以在函数内部使用全局变量和局部变量，并且不用担心局部变量污染全局变量。这种用括号把匿名函数包起来的方式，也叫做立即执行函数（IIFE）。所有函数内部代码都在闭包(closure)内。它提供了整个应用生命周期的私有和状态。

### CommonJs规范

CommonJS 的核心思想就是通过 require 方法来 **同步加载** 所要依赖的其他模块，然后通过 exports 或者 module.exports 来导出需要暴露的接口。

**Nodejs 使用的是 CommonJs 规范。CommonJS 只能用于服务器，前端浏览器不支持。**

**定义 CommonJs 模块：**

```js
// a.js
var x = 5
var addX = function (value) {
    return value + x
}
module.exports.x = x
module.exports.addX = addX
```

**注意：**因为 `module.exports` 本身就是一个对象，所以，我们在导出时可以使用 ` module.exports = {foo: 'bar'}` 也可以使用 `module.exports.foo = 'bar'`。但是， `exports `是 `module.exports` 的一个引用，或者理解为 `exports `是一个指针，`exports` 指向`module.exports`，这样，我们就只能使用 `exports.foo = 'bar'` 的方式，而不能使用` exports = {foo: 'bar'} ` 这种方式，因为这种方式会导致 `exports ` 指向了别的对象，那么这个模块的输出就会有问题了。

**加载 CommonJs 模块：**

```js
vara = require('./a.js')

console.log(example.x) // 5
console.log(example.addX(1)) // 6
```

> **为什么 CommonJS 规范不适合作为浏览器的规范**
>
> 由于 CommonJS 是同步加模块，在服务端加载模块时都是从本地硬盘中加载，读取速度很快。但是在浏览器端加载模块时，需要请求服务器端，涉及网速、代理的问题，一旦等待时间过长，浏览器会处于“假死”状态。

### ADM规范

AMD 全称异步模块化定义规范（Asynchronous Module Definition），采用异步加载模块的方式，模块的加载不影响后面语句的执行，并且使用 callback 回调函数的方式来运行模块加载完成后的代码。

**目前，主要有两个 Javascript 库实现了 AMD 规范：require.js 和 curl.js。**

AMD标准中，定义了下面两个API：

- require([module], callback) 
- define(id, [depends], callback) 

即通过 define 来定义一个模块，然后使用 require 来加载一个模块。 并且，require 还支持 CommonJS 的模块导出方式。

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

当 require() 函数加载上面这个模块的时候，就会先加载 ` a.js` 文件，再执行回调函数。

**加载 AMD 模块：** 采用 require() 语句加载模块，但是不同于 CommonJS，它要求两个参数：

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

默认情况下，`require.js` 假定 `a.js、b.js、c.js`与当前 `JS `文件在同一个目录。可以使用 `require.config()` 方法参数中的 `paths `属性指定各个模块的加载路径。

### CMD规范

CMD（Common Module Definition）通用模块定义，异步加载模块。

CMD 规范是阿里的玉伯提出来的。 它和 requirejs 非常类似，即一个 js 文件就是一个模块，但是CMD的加载方式更加优秀，是通过按需加载的方式，而不是必须在模块开始就加载所有的依赖。

CMD 推崇依赖就近，可以把依赖写进你的代码中的任意一行，AMD 是依赖前置的，在解析和执行当前模块之前，模块必须指明当前模块所依赖的模块。

**CMD是 sea.js 在推广过程中对模块定义的规范化产物。**

**定义 CMD 模板：**

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

UMD（Universal Module Definition）通用模块定义。它并不是一种规范，而是结合 AMD/CMD 和 CommonJS 的一种更为通用的 JS 模块解决方案。

UMD 的实现很简单：

* 先判断是否支持 Node.js 模块格式（exports是否存在），存在则使用 CommonJS 规范。
* 再判断是否支持 AMD/CMD（define是否存在），存在则使用 AMD/CMD 规范。
* 前两个都不存在，则将模块公开到全局（window或global）。

在打包模块的时候经常会见到这样的写法：

```js
output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'vue.js',
	library: 'Vue',
	libraryTarget: 'umd'
}
```

表示打包出来的模块为 umd 模块，既能在服务端（node）运行，又能在浏览器端运行。

```js
/**
 * UMD-Universal Module Definition 通用模块定义
 * */
(function (root, factory) {
    if (typeof define === 'function') {
        // 判断是否是 AMD/CMD
        define([], factory)
    } else if (typeof exports === 'object') {
        // Node CommonJS 规范
        module.exports = factory()
    } else {
        // 浏览器环境
        root.someAttr = factory
    }
})(this, function () {
    ...
    return {}
})
```

### ES6模块

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

* 运行时加载：CommonJS 和 AMD 加载是运行时加载，即只有运行时才能得到这个对象。
* 编译时加载：也称静态加载，ES6 模块是编译时加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

ES6 模块还有以下好处：

- 不再需要 `UMD` 模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者`navigator`对象的属性。
- 不再需要对象作为命名空间（比如`Math`对象），未来这些功能可以通过模块提供。

之前的几种模块化方案都是前端社区自己实现的，只是得到了大家的认可和广泛使用，而 ES6 的模块化方案是真正的规范。 在ES6中，我们可以使用 import 关键字引入模块，通过 exprot 关键字导出模块，功能较之于前几个方案更为强大，也是我们所推崇的，**但是由于ES6目前无法在浏览器中执行，所以，我们只能通过 babel 将不被支持的 import 编译为当前受到广泛支持的 require**。 

ES6 模块功能主要由两个命令构成：`export`和`import`。`export` 命令用于规定模块的对外接口，`import` 命令用于输入其他模块提供的功能。

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
import { firstName, multiply, efunc1 } from './profile.js'
```

目前阶段，通过 Babel 转码，CommonJS 模块的 require 命令和 ES6 模块的 import 命令，可以写在同一个模块里面，但是最好不要这样做。因为 import 在静态解析阶段执行，所以它是一个模块之中最早执行的，可能导致加载的顺序跟预期不符。

#### 其他用法

##### 模块的整体加载

除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。

```js
import * as Utils from './profile'
```

##### export default 命令

export default 命令，为模块指定默认输出。

```js
export default {
	firstName,
    multiply,
    efunc1 as func1,
    efunc2 as func1
}
```

```js
import Utils from './profile'
```

##### export与import的复合写法

如果在一个模块之中，先输入后输出同一个模块，`import`语句可以与`export`语句写在一起。

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

##### 模块的继承

```js
export * from 'my_module'
```

#### Node.js 的模块加载方法

JavaScript 现在有两种模块。一种是 ES6 模块，简称 ESM；另一种是 CommonJS 模块，简称 CJS。

CommonJS 模块是 Node.js 专用的，与 ES6 模块不兼容。语法上面，两者最明显的差异是，CommonJS 模块使用`require()`和`module.exports`，ES6 模块使用`import`和`export`。

它们采用不同的加载方案。从 Node.js v13.2 版本开始，Node.js 已经默认打开了 ES6 模块支持。

Node.js 要求 ES6 模块采用`.mjs`后缀文件名。也就是说，只要脚本文件里面使用`import`或者`export`命令，那么就必须采用`.mjs`后缀名。Node.js 遇到`.mjs`文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定`"use strict"`。

如果不希望将后缀名改成`.mjs`，可以在项目的`package.json`文件中，指定`type`字段为`module`。

```js
// package.json
{
   "type": "module"
}
```

如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成`.cjs`。如果没有`type`字段，或者`type`字段为`commonjs`，则`.js`脚本会被解释成 CommonJS 模块。

总结为一句话：`.mjs`文件总是以 ES6 模块加载，`.cjs`文件总是以 CommonJS 模块加载，`.js`文件的加载取决于`package.json`里面`type`字段的设置。

注意，ES6 模块与 CommonJS 模块尽量不要混用。`require` 命令不能加载`.mjs`文件，会报错，只有`import`命令才可以加载`.mjs`文件。反过来，`.mjs`文件里面也不能使用`require`命令，必须使用`import`。

#### ES6 模块加载 CommonJS 模块

ES6 模块的 `import` 命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。

```js
// 只能整体加载
import packageMain from 'commonjs-package';

// 加载单一的输出项
import packageMain from 'commonjs-package';
const { method } = packageMain;
```

### 各规范的异同

* CommonJS 加载模块是**同步**的，只有加载完成后才能执行后面的操作。

* AMD/CMD 加载模块是**异步**的，加载过程中不会阻塞后面语句的执行，加载完成后会执行回调函数中的语句。

* AMD 和 CMD 区别：

  * AMD 推崇依赖前置，即将所有依赖的模块全部加载完，再执行回调函数。
  * CMD 推崇依赖就近，需要使用某个模块时，才会去加载。 

  ```js
  // AMD: 依赖必须一开始就写好 
  define(['./a', './b'], function(a, b) { 
      a.doSomething() // 此处略去 100 行 
      b.doSomething() ... 
  })
  
  // CMD: 依赖可以就近书写
  define(function(require, exports, module) {
         var a = require('./a')
         a.doSomething()
         var b = require('./b')
         b.doSomething()
  })
  ```

  * AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分。

* ES6 模块与 CommonJS 模块的差异
  * CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
  * CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
  * CommonJS 模块的 require() 是同步加载模块，ES6 模块的 import 命令是异步加载，有一个独立的模块依赖的解析阶段。
  * ES6 模块之中，顶层的 this 指向 undefined；CommonJS 模块的顶层this指向当前模块。




### 参考资料

[ECMAScript 6 入门 Module 的语法](https://es6.ruanyifeng.com/#docs/module)

[CommonJS,AMD,CMD和ES6的对比](https://cloud.tencent.com/developer/article/1525043)