## webpack4.x原理篇

本质上，webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。

webpack 的本质是：**一种基于事件流的编程范例，一系列的插件运行。**

### 一个简单的 bundle 源码解析

```javascript
// a.js
console.log('a')
```

```javascript
// simple.s
import './assets/js/a.js'
console.log('done')
```

```javascript
// webpack.simple.config.js
const Path = require('path')
const Webpack = require('webpack')
const webpackConfig = {
  mode: 'development',
  entry: './src/simple',
  output: {
      path: Path.resolve(__dirname, '../dist'),
      filename: 'simple.js'
  }
}
Webpack(webpackConfig, err => {
  console.error(err)
})
```

运行 `node build/webpack.simple.config.js `，打开 `dist/simple.js`，源码结构大致如下：

```javascript
(function(modules) {
  var installedModules = {}; //   // 模块缓存
  function __webpack_require__(moduleId) { /** ... **/ }; // // 模块载入函数
  __webpack_require__.m = modules;          // 暴露的模块
  __webpack_require__.c = installedModules; // 暴露的模块缓存
  __webpack_require__.d = function(exports, name, getter) { /** ... **/ };  // 为 harmony（ ES2015）导出定义 getter 函数
  __webpack_require__.r = function(exports) { /** ... **/ };      // 定义导出的 __esModule 模块
  __webpack_require__.t = function(value, mode) { /** ... **/ };  // 创建一个命名空间（伪）对象
  __webpack_require__.n = function(module) { /** ... **/ };       // 为不兼容 ES2015 模块的返回默认导出函数

  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = ""; // __webpack_public_path__
  
  return __webpack_require__(__webpack_require__.s = "./src/simple.js");  // 加载入口模块并返回导出
})({
  "./src/assets/js/a.js": (function(module, exports) {
    eval("console.log('a')...");
  }),
  "./src/simple.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r...");
  })
});
```

从源码可以看出，bundle 整体由一个 IIFE（Immediately Invoked Function Expression，立即调用的函数表达式，即一个在定义时就会立即执行的 JavaScript 函数）包裹，里面的内容从上到下依次为：

- `installedModules` 对象：已载入的模块，即载入后的 `./src/simple.js`、`./src/assets/js/a.js` 模块。
- `__webpack_require__` 函数：模块载入函数。
- `__webpack_require__.m` 对象：暴露的模块。
- `__webpack_require__.c` 对象：暴露的模块缓存。
- `__webpack_require__.d` 函数：为 harmony（ ES2015）导出定义 getter 函数的函数。
- `__webpack_require__.r` 函数：定义导出的 __esModule 模块。
- `__webpack_require__.t` 函数：创建一个命名空间（伪）对象。
- `__webpack_require__.n` 函数：为不兼容 ES2015 模块的返回默认导出函数。
- `__webpack_require__.o` 函数：工具函数，判断对象属性用，Object.prototype.hasOwnProperty.call 方法的简写。
- `__webpack_require__.p` 变量：字符串，`__webpack_public_path__`。

最后的 IIFE，对应 entry 模块即上述示例的 `simple.js` ，用于启动整个应用。

这几个 `__webpack_` 开头奇奇怪怪的函数可以统称为 Webpack 运行时代码，作用是搭起整个业务项目的骨架，就上述简单示例所罗列出来的几个函数、对象而言，它们协作构建起一个简单的模块化体系从而实现 ES Module 规范所声明的模块化特性。

### Tapabel

webpack 可以看做成一个事件驱动型的事件流工作机制，通过事件将一个个构建任务串联起来，而实现这一切的就是 Tapable。Webpack 的两大核心模块的 Compiler（负责完整生命周期管理） 和 Compilation（负责资源构建） 都是 Tapable 的子类，并且实例内部的生命周期也是通过 Tapable 库提供的钩子类实现的。

tapable 这个小型 library 是 webpack 的一个核心工具，但也可用于其他地方，以提供类似的插件接口。这个类暴露 tap、tapAsync 和 tapPromise 方法，可以使用这些方法，注入自定义的构建步骤，这些步骤将在整个编译过程中不同时机触发。

Tapabel 是一个类似于 Node.js 的 EventEmitter 的库，主要是控制钩子函数的**发布与订阅**。

#### 提供的钩子

Tapable 库为插件提供了以下 Hook：

```javascript
// tapable/lib/index.js

exports.SyncHook = require("./SyncHook");
exports.SyncBailHook = require("./SyncBailHook");
exports.SyncWaterfallHook = require("./SyncWaterfallHook");
exports.SyncLoopHook = require("./SyncLoopHook");

exports.AsyncParallelHook = require("./AsyncParallelHook");
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");
exports.AsyncSeriesHook = require("./AsyncSeriesHook");
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
```

Tapable 的钩子可以分为**同步钩子**和**异步钩子**两大类，异步钩子又可以分为**并行**和**串行**两类。

hook 按事件回调的运行机制分为四种：

* Hook : 普通钩子，监听器之间互相独立不干扰。
* BailHook：熔断钩子，某个监听返回非 undefined 时后续不执行。
* WaterfallHook：瀑布钩子，如果上一个回调的返回非 undefined，那么就将下一个的回调的第一个参数替换为这个值。
* LoopHook：循环钩子，如果当前未返回 undefined 则一直执行。

hook 按触发事件的方式分：

* Sync：同步执行事件回调。该类 hook 只能用 tap 方法注册事件回调；如果使用 tapAsync 或者 tapPromise 方法注册会报错。
* AsyncSeries：按照顺序执行事件回调。如果当前事件回调是异步的，那么会等到异步执行完毕才会执行下一个事件回调。该类 hook 不能用 call 方法触发事件，必须用 callAsync 或者 promise 方法触发；这两个方法都能触发 tap 、tapAsync 和 tapPromise 注册的事件回调。
* AsyncParalle：并行执行所有的事件回调。

#### 同步钩子的使用

##### SyncHook

基础钩子，并不关心回调的内部具体实现，只是单纯地执行回调，且回调都是独立的，互不干扰。

```javascript
const { SyncHook } = require('tapable')

const tHook = new SyncHook(['name', 'greeting'])
tHook.tap('func1', (name, greeting) => {
  console.log(`func1：${name}，${greeting}。`)
})
tHook.tap('func2', (name, greeting) => {
  console.log(`func2：${name}，${greeting}。`)
  return 'func2'
})
tHook.tap('func3', (name, greeting) => {
  console.log(`func3：${name}，${greeting}。`)
})

tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
// func2：Lizhao，你好！。
// func3：Lizhao，你好！。
```

在注册事件回调时，有两个可以改变执行顺序的属性：stage 和 before。

stage 属性是一个整数值，值越大执行顺序就越靠后：

```javascript
// 修改上例 func2 回调
tHook.tap({
  name: 'func2',
  stage: 10
}, (name, greeting) => {
  console.log(`func2：${name}，${greeting}。`)
  return 'func2'
})

tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
// func3：Lizhao，你好！。
// func2：Lizhao，你好！。即，func2 最后执行
```

before 属性是 个字符串，是其它回调的名称。 顾名思义，before 就是表示该回调在某个回调之前执行。

```javascript
// 上例中，末尾追加一个回调
tHook.tap({
  name: 'func4',
  before: 'func3'
}, (name, greeting) => {
  console.log(`func4：${name}，${greeting}。`)
})
tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
// func4：Lizhao，你好！。
// func3：Lizhao，你好！。
// func2：Lizhao，你好！。
```

##### SyncBailHook

熔断钩子，某个监听返回非 undefined 时后续不执行。

```javascript
const { SyncBailHook } = require('tapable')

const tHook = new SyncBailHook(['name', 'greeting'])
tHook.tap('func1', (name, greeting) => {
  console.log(`func1：${name}，${greeting}。`)
  return ''
})
tHook.tap('func2', (name, greeting) => {
  console.log(`func2：${name}，${greeting}。`)
})

tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
```

##### SyncWaterfallHook

瀑布钩子，如果上一个回调的返回非 undefined，那么就将下一个的回调的第一个参数替换为这个值。

```javascript
const { SyncWaterfallHook } = require('tapable')

const tHook = new SyncWaterfallHook(['name', 'greeting'])
tHook.tap('func1', (name, greeting) => {
  console.log(`func1：${name}，${greeting}。`)
  return '李'
})
tHook.tap('func2', (name, greeting) => {
  console.log(`func2：${name}，${greeting}。`)
})

tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
// func2：李，你好！。
```

##### SyncLoopHook

循环钩子，如果当前未返回 undefined 则一直执行。也就是说，如果回调的返回值不是 undefined 时，会重新从第一个注册的事件回调处执行，直到当前执行的回调返回 undefined，才会执行后面的回调函数。

```javascript
const { SyncLoopHook } = require('tapable')

const tHook = new SyncLoopHook(['name', 'greeting'])
let counter = 0
tHook.tap('func1', (name, greeting) => {
  console.log(`func1：${name}，${greeting}。`)
})
tHook.tap('func2', (name, greeting) => {
  console.log(`func2：${name}，${greeting}。${counter + 1}`)
  counter ++
  return counter > 3 ? undefined : 'func2'
})
tHook.tap('func3', (name, greeting) => {
  console.log(`func3：${name}，${greeting}。`)
})

tHook.call('Lizhao', '你好！')
// func1：Lizhao，你好！。
// func2：Lizhao，你好！。1
// func1：Lizhao，你好！。
// func2：Lizhao，你好！。2
// func1：Lizhao，你好！。
// func2：Lizhao，你好！。3
// func1：Lizhao，你好！。
// func2：Lizhao，你好！。4
// func3：Lizhao，你好！。
```

#### 异步钩子的使用

异步钩子按照执行回调的机制分为**并行**和**串行**两种。对于异步钩子，添加事件监听的方式有三种：tap、tapAsync、tapPromise。

##### tap

tap 添加并行的异步钩子几乎是同时执行的，当所有回调函数执行完毕后会触发执行完毕的回调函数，且所有回调函数之间互不干扰。

```javascript
const { AsyncParallelHook } = require('tapable')

const tHook = new AsyncParallelHook(['name', 'greeting'])
tHook.tap('func1', (name, greeting) => {
  console.log(`func1：${name}，${greeting}。`)
})
tHook.tap('func2', (name, greeting) => {
  console.log(`func2：${name}，${greeting}。`)
  return 'func2'
})
tHook.tap('func3', (name, greeting) => {
  console.log(`func3：${name}，${greeting}。`)
})

tHook.callAsync('Lizhao', '你好！', () => {
  console.log('Done!')
})
```

##### tapAsync

tabAsync 通过添加**回调函数（callback）**的方式来表示当前回调执行完毕。

```javascript
const { AsyncParallelHook } = require('tapable')

const tHook = new AsyncParallelHook(['name', 'greeting'])
tHook.tapAsync('func1', (name, greeting, callback) => {
  setTimeout(() => {
    console.log(`func1：${name}，${greeting}。`)
    callback()
  }, 2000)
})
tHook.tapAsync('func2', (name, greeting, callback) => {
  setTimeout(() => {
    console.log(`func2：${name}，${greeting}。`)
    callback()
  }, 1000)
})
tHook.tapAsync('func3', (name, greeting, callback) => {
  console.log(`func3：${name}，${greeting}。`)
  callback()
})

tHook.callAsync('Lizhao', '你好！', () => {
  console.log('Done!')
})
// func3：Lizhao，你好！。
// func2：Lizhao，你好！。
// func1：Lizhao，你好！。
// Done!
```

**注意：** 一旦在某个回调的 callback 函数中传递参数，如，`callback('err')`，则认为是该回调抛出的错误信息，会立即终止执行，进入 tHook 的回调，且该回调后面添加的其他回调不会再执行。

##### tapPromise

tapPromise 注册的回调必须返回一个 Promise，通过调用 resolve() 方法表示该回调函数执行完毕。如果某个回调调用了 reject，hook 的回调也不会执行。

```javascript
const { AsyncParallelHook } = require('tapable')

const tHook = new AsyncParallelHook(['name', 'greeting'])
tHook.tapPromise('func1', (name, greeting) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`func1：${name}，${greeting}。`)
      resolve()
    }, 2000)
  })
})
tHook.tapPromise('func2', (name, greeting) => {
  return new Promise((resolve, reject) => {
    console.log(`func2：${name}，${greeting}。`)
    resolve()
  })
})

tHook.promise('Lizhao', '你好！').then(() => {
  console.log('Done!')
})
// func2：Lizhao，你好！。
// func1：Lizhao，你好！。
// Done!
```

AsyncParallelBailHook 异步并行熔断钩子，和同步的熔断钩子类似，当回调函数的 return、 callback 的实参或者 resolve 的值不为 undefined 时，终止所有回调函数的执行，并调用 tHook 的回调。

以上注册的回调函数都是并行的，而串行执行就是注册的回调函数依次顺序执行。

### 核心流程解析

Webpack 最核心的功能：

> At its core, **webpack** is a *static module bundler* for modern JavaScript applications.

也就是将各种类型的资源，包括图片、css、js等，转译、组合、拼接、生成 JS 格式的 bundler 文件。

官网首页的动画很形象地表达了这一点：

![](https://tva1.sinaimg.cn/large/e6c9d24ely1h0qyyitc49j20tt0csaat.jpg)

webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

* 初始化参数：从配置文件、 配置对象、Shell 参数中读取，与默认配置结合得出最终的参数。

* 实例化 Compiler：创建一个 Compiler 实例（compiler），并根据配置参数为实例添加选项及加载配置的和内置的插件，然后调用 run 方法启动编译。

* 启动编译：在 compiler.run 方法中先后执行 beforeRun、run 钩子，再调用 compiler.compile 方法，执行 beforeCompile、compile 钩子，然后生成一个 Compilation 实例（compilation）。

* 编译模块：执行 make 钩子，开始编译。

  * 从 entry 入口配置文件出发，调用所有配置的 Loader  对模块进行处理。
  * 再找出该模块依赖的模块，通过 acorn 库生成模块代码的 AST 语法树，形成依赖关系树（每个模块被处理后的最终内容以及它们之间的依赖关系）。

  - 根据语法树分析这个模块是否还有依赖的模块，如果有则继续循环每个依赖，直到所有入口依赖的文件都经过了对应的 loader 处理。
  - 解析结束后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。

* 输出资源：在编译完成后，调用 compilation.seal 方法封闭，生成资源，这些资源保存在 compilation.assets、compilation.chunk。

* 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

整个流程可分为以下三个阶段：

* 初始化阶段：初始化参数、实例化 Compiler。
* 构建阶段：启动编译、编译模块。
* 生成阶段：输出资源、输出完成。

> 抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntaxtree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。树上的每个节点都表示源代码中的一种结构。

#### 初始化阶段

调用 webpack 函数，处理 Compiler 类的参数，创建编译器（compiler），添加选项及加载配置的和内置的插件，最后返回 compiler。

```javascript
// webpack@4.44.1：/lib/webpack.js
const webpack = (options, callback) => {
	const webpackOptionsValidationErrors = validateSchema(
		webpackOptionsSchema,
		options
	);
	// ...
	let compiler;
	if (Array.isArray(options)) {
		// ...
	} else if (typeof options === "object") {
		options = new WebpackOptionsDefaulter().process(options);

		compiler = new Compiler(options.context);
		compiler.options = options;
		new NodeEnvironmentPlugin({
			infrastructureLogging: options.infrastructureLogging
		}).apply(compiler);
		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
				if (typeof plugin === "function") {
					plugin.call(compiler, compiler);
				} else {
					plugin.apply(compiler);
				}
			}
		}
		compiler.hooks.environment.call();
		compiler.hooks.afterEnvironment.call();
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
	if (callback) {
		// ...
		compiler.run(callback);
	}
	return compiler;
};
```

* 将传入的参数和默认参数合并成用户配置，并调用 validateSchema 校验配置，再调用 WebpackOptionsDefaulters 合并出最终配置。
* 创建 compiler 对象，加载 Node 环境插件，如输入、输出、监听等；再遍历用户定义的 plugins 集合，执行插件的 apply 方法。
* 执行编译器的 environment、afterEnvironment 钩子，调用 new WebpackOptionsApply().process 方法，为 compiler 添加配置参数及注册各种内置的插件。比如，JavascriptModulesPlugin、JsonModulesPlugin、EntryOptionPlugin、CommonJsPlugin、LoaderPlugin 等等。
* 调用 compiler.run 运行编译器。

最后一步是运行 compiler.run，有两种情况：

* 调用 webpack 时，有可执行的回调函数，则调用 webpack 函数时会自动调用 compiler.run。
* 调用 webpack 时，没有可执行的回调函数，则需要通过返回的 compiler 手动调用 run 方法。

#### 构建阶段

Compiler 模块是 webpack 的主要引擎。它继承自 Tapable 类，用来注册和调用插件。 

```javascript
// webpack@4.44.1：/lib/Compiler.js

const {
	Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
	AsyncSeriesHook
} = require("tapable");

class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = {
			// 各种钩子 ...
		};
		// ...
	}
	run(callback) {
		// ...
		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);
			this.hooks.run.callAsync(this, err => {
				if (err) return finalCallback(err);

				this.readRecords(err => {
					if (err) return finalCallback(err);

					this.compile(onCompiled);
				});
			});
		});
	}
	// ...
	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
}
```

构建阶段是 compiler 调用 Compilation 实例化对象的生命周期和方法：

* compiler.run 方法会执行 beforeRun、run 钩子，然后调用 compiler.compile 方法。
* compiler.compile 方法会执行 beforeCompile、compile 钩子，然后实例化 Compilation 类。
* Compilation 实例（compilation）创建后，执行 compiler 的 make 钩子，从 Entry 配置开始读取文件，并对文件进行编译。
* 进行编译完成后，调用 compilation 对象的 finish、seal 方法进入生成阶段。

构建阶段的核心是在 make 钩子执行。但是从源码看，compile 方法的执行是从 hooks.make.callAsync 直接到了 compilation.finish() 这一步，中间编译过程是怎么执行的呢？事实上，hooks.make.callAsync 所执行的 **make 钩子的回调函数是在各个插件中注册的**。 在 `./node_modules/webpack` 下用关键词 `hooks.make.tap` 搜索，可以发现很多插件都有给 make 钩子注册回调。比如：DllEntryPlugin、DynamicEntryPlugin、MultiEntryPlugin、PrefetchPlugin、SingleEntryPlugin 等。

SingleEntryPlugin 插件中的 apply 方法中，make 钩子回调函数调用了 compilation.addEntry 方法：

```javascript
// webpack@4.44.1：/lib/SingleEntryPlugin.js

class SingleEntryPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);

		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}
}
```

构建阶段的真正核心是 compilation 对象：

* 初始化模块：在实例化 Compilation 时，实例化了 NormalModuleFactory（存放模块）、ContextModuleFactory（存放模块的依赖关系）对象时初始化模块。
* 构建模块：compilation.addEntry 方法是构建阶段真正的开始，主要作用是将模块添加到依赖列表中去，addEntry -> _addModuleChain -> buildModule。这一步主要是获取了模块的基本信息，如相对路径、文件类型、需要用哪些 loader 处理这个文件等。核心是在 compilation.buildModule 方法中调用的 module.build 方法。真正的构建是通过具体模块对象的 module.build （源码位置：webpack/lib/NormalModule.js）方法进行。NormalModule 类的 build -> doBuild 方法，先使用 loader-runner 模块的 runLoaders 方法转译模块内容，通常是将各类资源类型转译为可以被 acorn 处理的标准 JavaScript 文本，比如，图片需要从图像二进制转换成类似于 `export default "data:image/png;base64,xxx"` 的 base64 格式，或者 `export default "http://xxx"` url 格式；再在 NormalModule 类的 build -> doBuild 的回调中调用 this.parser.parse，使用 acorn 将 JavaScript 文本解析生成 AST。
* 模块依赖处理：webpack 中依赖代表的内容比较多，通常来说只有使用 require 或 import 的模块依赖才会需要被递归解析，即递归生成相应的资源模块，其他依赖不需要生成新的模块就不会在这里处理。依赖处理是在 Compilation 类的 buildModule -> processModuleDependencies 方法。

* 所有模块及其依赖的模块都通过 Loader 转换完成后，在 make 钩子的回调中调用 compilation.finish -> compilation.seal，进入生成阶段。

```javascript
// webpack@4.44.1：/lib/Compilation.js
class Compilation extends Tapable {
	_addModuleChain(context, dependency, onModule, callback) {
		// ...
		this.semaphore.acquire(() => {
			moduleFactory.create(
				// ...
				(err, module) => {
					// ...
					const afterBuild = () => {
						if (addModuleResult.dependencies) {
							this.processModuleDependencies(module, err => {
								if (err) return callback(err);
								callback(null, module);
							});
						} else {
							return callback(null, module);
						}
					};
					// ...
					if (addModuleResult.build) {
						this.buildModule(module, false, null, null, err => {
							// ...
              afterBuild();
						});
					}
          // ...
				}
			);
		});
	}
	addEntry(context, entry, name, callback) {
		// ...
		this._addModuleChain(/** ... **/);
	}
  
	buildModule(module, optional, origin, dependencies, thisCallback) {
		// ...
		module.build(
			this.options,
			this,
			this.resolverFactory.get("normal", module.resolveOptions),
			this.inputFileSystem,
			error => {
        // ...
      }
		);
	}
}
```

```javascript
// webpack@4.44.1：/lib/NormalModule.js
class NormalModule extends Module {
	doBuild(options, compilation, resolver, fs, callback) {
		// ...
		runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},
			(err, result) => {}
		);
	}
  
	build(options, compilation, resolver, fs, callback) {
		// ...
		return this.doBuild(options, compilation, resolver, fs, err => {
			// ...
			try {
				const result = this.parser.parse(
					this._ast || this._source.source(),
					{
						current: this,
						module: this,
						compilation: compilation,
						options: options
					},
					(err, result) => {
						if (err) {
							handleParseError(err);
						} else {
							handleParseResult(result);
						}
					}
				);
			}
		});
	}
}
```

#### 生成阶段

构建阶段围绕 module 展开，生成阶段则围绕 chunks 展开。

经过构建阶段之后，webpack 得到足够的模块内容与模块关系信息，接下来开始生成最终资源了，即开始执行 compilation.seal 方法。

seal 方法完成 module 到 chunks 的转化，其中也做了大量的的优化工作，比如，hash 的创建、tree shaking 以及对内容进行生成，最终生成的代码会存放在 compilation.assets、compilation.chunk 上。

最后，在 compiler.emit 钩子中，根据配置参数的 output.path 属性，将文件输出到磁盘指定位置。

```javascript
// webpack@4.44.1：/lib/Compilation.js
class Compilation extends Tapable {
	// ...
	seal(callback) {
		// ...
		this.hooks.optimizeTree.callAsync(this.chunks, this.modules, err => {
			// ...
			if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
				this.hooks.beforeChunkAssets.call();
				this.createChunkAssets();
			}
			// ...
		});
	}

	createChunkAssets() {
    for (let i = 0; i < this.chunks.length; i++) {
      // ...
    }
  }
}
```

```javascript
// webpack@4.44.1：/lib/Compiler.js
class Compiler extends Tapable {
  // ...
  emitAssets(compilation, callback) {
    // ...
    this.hooks.emit.callAsync(compilation, err => {
      // ...
    });
  }
}
```

### 编写一个 loader

loader 是**转译模块源代码的转换规则**。 loader 被编写为接受源代码作为参数的**函数**， 并返回这些转换过的新版本代码。该函数在 loader 转换资源的时候调用，可以调用 [loader API](https://www.webpackjs.com/api/loaders/)，并通过 this 上下文访问。

当只有一个 loader 在资源中使用，该 loader 只能传入一个参数，这个参数是一个包含资源文件内容的字符串。

当链式调用多个 loader 的时候，请记住它们会以相反的顺序执行。取决于数组写法格式，从右向左或者从下向上执行。

* 最后的 loader 最早调用，将会传入原始资源内容。
* 第一个 loader 最后调用，期望值是传出 JavaScript 和 source map（可选）。
* 中间的 loader 执行时，会传入前一个 loader 传出的结果。

#### loader API

所谓 loader 只是一个导出为函数的 JavaScript 模块。loader-runner 会调用这个函数，然后把上一个 loader 产生的结果或者资源文件传入进去。函数的 this 上下文将由 webpack 填充，并且 loader-runner 具有一些有用方法，可以使 loader 改变为异步调用方式，或者获取 query 参数。

##### 同步 loader

无论是 return 还是 this.callback 都可以同步地返回转换后的 content 内容。

```javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
```

this.callback 方法则更灵活，因为它允许传递多个参数，而不仅仅是 content。

```javascript
module.exports = function(content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // 当调用 callback() 时总是返回 undefined
};
```

##### 异步 loader

对于异步 loader，使用 this.async 来获取 callback 函数。

```javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
```

##### "Raw" loader

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw，loader 可以接收原始的 Buffer。每一个 loader 都可以用 String 或者 Buffer 的形式传递它的处理结果。Complier 将会把它们在 loader 之间相互转换。

```javascript
module.exports = function(content) {
  assert(content instanceof Buffer);
  return someSyncOperation(content);
  // 返回值也可以是一个 `Buffer`
  // 即使不是 raw loader 也没问题
};
module.exports.raw = true;
```

##### 越过 loader（Pitching loader）

loader 总是**从右到左地**被调用。有些情况下，loader 只关心 request 后面的元数据，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先从左到右调用 loader 上的 pitch 方法。

配置：

```javascript
use: [
  'a-loader',
  'b-loader',
  'c-loader'
]
```

将会发生这些步骤：

```shell
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

那么，为什么 loader 可以利用 "跳跃(pitching)" 阶段呢？

首先，传递给 pitch 方法的 data，在执行阶段也会暴露在 this.data 之下，并且可以用于在循环时，捕获和共享前面的信息。

其次，如果某个 loader 在 pitch 方法中给出一个结果，那么这个过程会回过身来，并跳过剩下的 loader。

```javascript
// b.loader.js
module.exports = function(content) {
    return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    data.value = 42;
    if (someCondition()) {
      return "module.exports = require(" + JSON.stringify("-!" + remainingRequest) + ");";
    }
};
```

如上 b.loader 的 pitch 方法有返回结果，则执行步骤为：

```shell
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

##### loader 上下文

loader 上下文表示在 loader 内使用 this 可以访问的一些方法或属性。

* version：loader API 的版本号。目前是 2。

* context：模块所在的目录。可以用作解析其他模块路径的上下文。

* request：被解析出来的 request 字符串。

* query：即 loader 配置的 options 对象，或者是以 query 字符串作为参数调用时，以 ? 开头的字符串。

* callback：一个可以同步或者异步调用的可以返回多个结果的函数。预期的参数是：

  ```javascript
  this.callback(
    err: Error | null,
    content: string | Buffer,
    sourceMap?: SourceMap,
    meta?: any
  );
  ```

  * 第一个参数必须是 Error 或者 null。
  * 第二个参数是一个 string 或者 Buffer。
  * 第三个参数可选的，必须是一个可以被这个模块解析的 source map。
  * 第四个参数可选的，会被 webpack 忽略，可以是任何东西（例如一些元数据）。

* async：告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback。

* data：在 pitch 阶段和正常阶段之间共享的 data 对象。

* cacheable：设置是否可缓存标志的函数，默认可缓存。调用这个方法然后传入 false，可以关闭 loader 的缓存。

* 。。。

#### 一个简单示例

```javascript
// src/myLoader/index.js
const LoaderUtils = require("loader-utils");
module.exports = function(source) {
  console.log(source)
  console.log(this)
  const options = LoaderUtils.getOptions(this)
  console.log(options)
  if (this.resourcePath.match('/src/simple.js')) {
    source += `\nconsole.log("This is ${options.name}'s ${options.value}.")`
  }
  return source
};
```

#### 测试

##### 使用 webpack 测试

在本文第一个示例的 webpack.simple.config.js 添加 Loader 配置：

```javascript
// webpack.simple.config.js
const webpackConfig = {
  // ...
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: Path.resolve(__dirname, '../src/myLoader/index.js'),
        options: {
          name: 'Lizhao',
          value: 'MyLoader'
        }
      }
    }]
  }
}
```

运行 `node build/webpack.simple.config.js `，即可查看 myLoader 的运行结果。

##### loader-runner 测试

loader-runner 允许在不安装 webpack 的情况下运行 loaders。事件上，webpack 就是使用它执行 loader。

```javascript
// src/Myloader/run.js
const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");
runLoaders(
  {
    resource: path.resolve(__dirname,  "../simple.js"),
    loaders: [
      path.resolve(__dirname, "./index.js?name=Lizhao&value=MyLoader")
    ],
    readResource: fs.readFile.bind(fs)
  },
  (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(result.result)
    return result
  }
);
```

运行 `node src/Myloader/run.js `，即可查看 Loader 的运行结果。

### 编写一个插件

插件接口可以帮助用户直接触及到编译过程。 插件可以将处理函数注册到编译过程中的不同事件点上运行的生命周期钩子函数上。 当执行每个钩子时， 插件能够完全访问到编译的当前状态。

插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的**钩子**，所以做好阅读一些源码的准备！

> 编写插件前，建议先了解 Tapable 创建、管理钩子的模式和 webpack 的核心编译流程，尤其是 webpack 中的 compiler 和 compilation 对象。

#### 创建插件

webpack 插件由以下组成：

* 一个 JavaScript 命名函数。
* 在插件函数的 prototype 上定义一个 apply 方法。apply 方法在安装插件时，会被 compiler 调用一次，从而可以在回调函数中访问到 compiler 对象。
* 指定一个绑定到 webpack 自身的[事件钩子](https://www.webpackjs.com/api/compiler-hooks/)。
* 处理 webpack 内部实例的特定数据。
* 功能完成后调用 webpack 提供的回调。

```javascript
// 一个 JavaScript 命名函数。
function MyExampleWebpackPlugin() {};

// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  // 指定一个挂载到 webpack 自身的事件钩子。
  compiler.plugin('webpacksEventHook', function(compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
    console.log("This is an example plugin!!!");

    // 功能完成后调用 webpack 提供的回调。
    callback();
  });
};
```

也可以用 class 的形式来编写插件：

```javascript
class HtmlWebpackPlugin {
  constructor (options) {}
  apply (compiler) {
    compiler.plugin('webpacksEventHook', function(compilation, callback) {
      console.log("This is an example plugin!!!");
      callback();
    });
  };
}
```

#### 一个简单示例

```javascript
// src/myPlugin/index.js
const { RawSource } = require("webpack-sources");
module.exports = class myPlugin {
  constructor(options) {
    this.options = options;
    console.log("This is Lizhao's plugin.");
  }
  apply(compiler) {
    compiler.hooks.emit.tap(
      'myPlugin',
      (compilation) => {
        try {
          const filename = compilation.outputOptions.filename;
          const asset = compilation.assets[filename];
          const content = `
            /**
              Author: Lizhao
              UpdateTime: ${new Date().toString()}
            **/
          ` + asset.source();
          compilation.assets[filename] = new RawSource(content);
          console.log('This is emit hook!');
        } catch (err) {
          compilation.errors.push("error");
          console.error(err)
        }
      }
    );
  }
}
```

#### 测试

插件没有像 loader 那样的独立运行环境，只能在 webpack 里面运行。

在本文第一个示例的 webpack.simple.config.js 添加 plugins 配置：

```javascript
// webpack.simple.config.js
const MyPlugin = required('../src/myPlugin/index.js')
const webpackConfig = {
  // ...
  plugins: [
    new MyPlugin()
  ],
}
```

运行 `node build/webpack.simple.config.js `，即可查看 MyPlugin 的运行结果。

#### 插件的插件

插件自身也可以通过暴露 hooks 的方式进行自身扩展。

比如，html-webpack-plugin 提供钩子以将其扩展：html-webpack-plugin-alter-chunks (Sync)、html-webpack-plugin-before-html-generation (Async)、html-webpack-plugin-alter-asset-tags (Async)、html-webpack-plugin-after-html-processing (Async)、html-webpack-plugin-after-emit (Async) 等等。

### 模拟一个简单的 webpack

安新：`npm i @babel/preset-env babel-core babel-preset-env babel-traverse babylon`

```javascript
// src/myWebpack/lib/parser.js
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');
module.exports = {
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');
    return babylon.parse(source, {
      sourceType: 'module'
    });
  },
  getDependencis: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      }
    });
    return dependencies;
  },
  getCodeFromAst: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    });
    return code;
  }
}
```

```javascript
// src/myWebpack/lib/Compiler.js
const fs = require('fs');
const path = require('path');
const { getAST, getDependencis, getCodeFromAst } = require('./parser');
module.exports = class Compiler {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
    this.modules = [];
  }

  run() {
    const entryModule = this.buildModule(this.entry);
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    this.emitFiles();
  }

  buildModule(filename) {
    const ast = getAST(path.join(process.cwd(), 'src', filename));
    return {
      filename,
      dependencies: getDependencis(ast),
      transformCode: getCodeFromAst(ast)
    };
  }

  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = '';
    this.modules.map((_module) => {
      modules += `
        '${_module.filename}': function (require, module, exports) { ${_module.transformCode} },
      `
    });
    const bundle = `
      (function(modules) {
        function require(fileName) {
          const fn = modules[fileName];
          const module = { exports : {} };
          fn(require, module, module.exports);
          return module.exports;
        }
        require('${this.entry}');
        console.log('${new Date()}');
        console.log('This is myWebpack!');
      })({${modules}})`;
    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
};
```

```javascript
// src/myWebpack/index.js
const Compiler = require('./lib/Compiler.js');
module.exports = function webpack (options) {
  return new Compiler(options)
}
```

```javascript
// build/webpack.simple.config.js
const Path = require('path')
const Webpack = require('../src/myWebpack/index.js')

const webpackConfig = {
  mode: 'development',
  entry: './simple.js',
  output: {
    path: Path.resolve(__dirname, '../dist'),
    filename: 'simple.js'
  }
}
const compiler = Webpack(webpackConfig)
compiler.run()
```

运行 `node build/webpack.simple.config.js `，即可查看 myWebpack 的编译结果。

### [webpack5新特性](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/)

#### 长期缓存

采用新的算法为 Chunk、模块 ID 和最终导出的 bundle 文件分配确定的、短的（3 或 5 位，是包大小和长期缓存之间的一种权衡）数字 ID。

确定的名称有利于长期缓存的使用，即不会因为每次编译生成的文件名不同而导致缓存失效。

当使用 [contenthash] 时，Webpack 5 将使用真正的文件内容哈希值。之前它 "只" 使用内部结构的哈希值。 当只有注释被修改或变量被重命名时，这对长期缓存会有积极影响。这些变化在压缩后是不可见的。

#### 持久化缓存

在 webpack 4 里面，可以使用 cache-loader 将编译结果写入硬盘缓存，还可以使用 babel-loader，设置 option.cacheDirectory 将 babel-loader 编译的结果写进磁盘。

webpack5 默认开启缓存，缓存默认是在内存里。当然，可以在 cache 配置指定其他存储位置，比如磁盘。

webpack5 缓存默认存储在 node_modules/.cache/webpack，最大500MB，缓存时常两个星期，旧的缓存先沟汰。

#### 支持生成 ES6 代码

webpack 4 之前只生成 ES5 的代码。webpack5 则现在既可以生成 ES5 又可以生成 ES6/ES2015 代码。

配置 output.environment，告诉 webpack 在生成的运行时代码中可以使用什么样的 ES 特性。 

```javascript
odule.exports = {
  output: {
    environment: {
      arrowFunction: true,
      bigIntLiteral: false,
      const: true,
      destructuring: true,
      dynamicImport: false,
      forOf: true,
      module: false,
      optionalChaining: true,
      templateLiteral: true,
    },
  },
};
```

#### 内置支持资模块

资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

#### 不再为 Node.js 引用 Polyfills

在早期，webpack 的目的是为了让大多数的 Node.js 模块运行在浏览器中，但如今模块的格局已经发生了变化，现在许多模块主要是为前端而编写。Webpack <= 4 的版本中提供了许多 Node.js 核心模块的 polyfills，一旦某个模块引用了任何一个核心模块（如 cypto 模块），webpack 就会自动引用这些 polyfills。

尽管这会使得使用为 Node.js 编写模块变得容易，但它在构建时给 bundle 附加了庞大的 polyfills。在大部分情况下，这些 polyfills 并非必须。

从 Webpack 5 开始不再自动填充这些 polyfills，而会专注于前端模块兼容。我们的目标是提高 web 平台的兼容性。

#### 升级 tree-shaking

webpack 4 的 treeshaking 是关注 import 了某个库的什么模块，那么我就打包什么；webpack 5 更精细化，直接分析到哪些变量有效地用到了，那么我就打包哪些变量。

```javascript
// inner.js
export const a = 1;
export const b = 2;

// module.js
export * as inner from './inner';
// 或 import * as inner from './inner'; export { inner };

// user.js
import * as module from './module';
console.log(module.inner.a);
```

在生产模式下，会删除未引用的导出变量 b。

webpack 5 有一个新的选项 optimization.innerGraph，在生产模式下是默认启用的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。

#### 模块联邦（Module Federation）

Webpack 5 增加了一个新的功能 "模块联邦"，它允许多个 webpack 构建一起工作。 从运行时的角度来看，多个构建的模块将表现得像一个巨大的连接模块图。 从开发者的角度来看，模块可以从指定的远程构建中导入，并以最小的限制来使用。

模块联邦使得 JavaScript 应用得以从另一个 JavaScript 应用中动态地加载代码 —— 同时共享依赖。相当于 webpack 提供了线上 runtime 的环境，多个应用利用 CDN 共享组件或应用，不需要本地安装 npm 包再构建了，这就有点云组件的概念了。

依赖共享主要是由插件 ModuleFederationPlugin 来提供的。

比如，app1 加载远程的 app2 模块，依赖 react、react-dom。

```javascript
// app1
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {  
  //http://localhost:3002/remoteEntry.js  
  plugins: [    
    new ModuleFederationPlugin({      
      name: "app1",      
      remotes: {        
        app2: "app2@http://localhost:3002/remoteEntry.js",      
      }
    })
  ],
};
```

```javascript
// app2
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = { 
  plugins: [    
    new ModuleFederationPlugin({      
      name: "app2",      
      library: { 
        type: "var", 
        name: "app2" 
      },      
      filename: "remoteEntry.js",      
      exposes: {        
        "./Button": "./src/Button",      
      }
    })
  ]
};
```

### 相关问题

#### webpack4 为什么编译更快？

* V8 带来的优化（for..of 替代 forEach、Map 和 Set 替代 Object、includes 替代 indexOf）；
* 默认使用更快的 md4 hash 算法；
* webpacks AST 可以直接从 loader 传递给 AST，减少解析时间使用字符串方法替代正则表达式。

#### webpack 模块热替换原理

模块热替换（HMR - hot module replacement）功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

* 保留在完全重新加载页面期间丢失的应用程序状态。
* 只更新变更内容，以节省宝贵的开发时间。
* CSS/JS 源码变化时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

webpack 采用 webpack-dev-server 来实现热替换。webpack-dev-server 的服务器端用的是 express；热更新通信运用的 websocket 全双工通道双向通信协议，依赖了 Webpack-Dev-Middleware。webpack-dev-middleware 是一个封装器，它可以把 webpack 处理过的文件发送到一个 server（koa/express），在其内部使用 memfs 替换掉 compiler 的文件系统对象，实现了对内存文件的存储和访问，提高了存储读取效率。

webpack-dev-server 创建两个服务器：Bundle Server，静态资源的服务（express），提供文件访问路径；HMR Server，提供 websocket 的长连接，用于通知 HMR runtime 需要更新。

另外，客户端通过 hot-module-replacement-plugin 提供 HMR runtime 服务。一旦磁盘里面的文件修改，那么获收到 HMR server 发送的信息后，HMR runtime 会局部更新页面的代码。**这种方式可以不用刷新浏览器。**

模块热替换原理：

* 当修改了一个或多个文件时，文件系统接收更改并通知 webpack；
* Webpack Compile 重新编译构建一个或多个模块；
* Webpack 将模块输出到 Bundle Server；
* HMR Server 使用 webSocket 通知 HMR runtime 需要更新；
* HMR runtime 通过 HTTP 请求更新 jsonp；
* HMR runtime 替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

简单来说：webpack 结合 webpack-dev-server（WDS） 和 hot-module-replacement-plugin（HMR） 提供热替换功能。WDS 提供更新资源并知客户端更新， HMR 在客户端实现局部更新。

#### Loader 为什么是自右向左执行的？

为什么在配置文件中配置的 loader 都是从右向左的处理源文件而不是从左到右呢？这是由于 loader-runner 在处理每一个 loader 的时候，会先从左到右的执行 loader.pitch 方法，然后再执行本身的 loader 方法（称为 normal）。

```javascript
// node_modules/loader-runner/lib/LoaderRunner.js
function iteratePitchingLoaders(options, loaderContext, callback) {}
function iterateNormalLoaders(options, loaderContext, args, callback) {}
```

整个处理过程类似于 DOM 的事件冒泡机制，开始调用 loader-runner，会按照 laoders 中的顺序依次执行，先执行 loader 中的 pitch 方法，如果方法没有返回值则继续执行下一个 pitch 直到执行完毕后开始执行最后一个 loader 的 normal，然后从右向左的执行 loader 的 normal 方法，并且前一个 loader 的返回值作为后一个 normal 的入参。但是如果在中途有 loader 的 pitch 返回值，那么则直接将返回值作为前一个 loader normal 的入参，然后从右向左的执行 loader 的 normal 方法，其后面的 loaders 不再执行。

JavaScript 函数式编程中，组合函数的形式有两种：compose 和 pipe。

compose 的概念很简单——它结合了 n 个函数。函数按顺序是**从右往左**执行的，每个函数执行的返回结果做为下一个函数的参数。

```javascript
compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
```

pipe 的概念 compose 类似，只是它是**从左向右**依次执行。

```javascript
pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
```

所以，compose 和 pipe 只是改变函数执行的顺序。简单的反转其中一个的传参顺序，就可以获得与另一个相同的结果。

webpack 只是选择了 compose 方式解决函数多层嵌套，而 pipe 方式在技术上实现也不会有难度。

#### Compiler 和 Compilation 的区别？

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

整个 Webpack 从启动到关闭的生命周期，一般只有一个 Compiler 实例（compiler），负责监听文件和启动编译。

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

每一次编译（文件只要发生变化）就会生成一个 Compilation 实例（compilation），负责构建编译。

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

### 参考资料

[webpack 中文文档](https://webpack.docschina.org/concepts/)

[webpack 中文文档 - 编写一个 loader](https://www.webpackjs.com/contribute/writing-a-loader/)

[webpack 中文文档 - 编写一个插件](https://www.webpackjs.com/contribute/writing-a-plugin/)

[webpack 中文文档 - api](https://www.webpackjs.com/api/)

[稀土掘金 - Webpack4源码解析之Tapable](https://juejin.cn/post/7008736558832418853#heading-0)

[知乎 - [万字总结] 一文吃透 Webpack 核心原理](https://zhuanlan.zhihu.com/p/363928061)

[程序员客栈 - 再读 Webpack 源码，各个击破（一）：从 Compiler 和 Compilation 说起](https://jishuin.proginn.com/p/763bfbd6b3e3)

[稀土掘金 - webpack loader 源码、原理、实践](https://juejin.cn/post/6998416819497205774)

[知乎 - 「搞点硬货」从源码窥探Webpack4.x原理](https://zhuanlan.zhihu.com/p/102424286)

[源码 | webpack热更新原理分析](https://zhaopanpan.com/posts/webpack/webpack%E7%83%AD%E6%9B%B4%E6%96%B0%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html#%E6%9E%84%E5%BB%BA)