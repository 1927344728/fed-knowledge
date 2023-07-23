## Node.js：module（模块）

在 Node.js 模块系统中，每个文件都被视为独立的模块。

Node.js 有些模块会被编译成二进制，称为核心模块，定义在 Node.js 源代码的 `lib/` 目录下。require() 总是会优先加载核心模块。 例如，`require('http')` 始终返回内置的 HTTP 模块，即使有同名文件。

### 访问主模块

 module 提供了一个 filename 属性（通常等同于 __filename）表示当前文件路径。当 Node.js 直接运行一个文件时，require.main 会被设为它的 module。 

这意味着可以通过 `require.main === module` 来判断一个文件是否被直接运行：

```javascript
console.log(require.main.filename)
console.log(require.main === module)
```

### 缓存

模块在第一次加载后会被缓存。 这也意味着（类似其他缓存机制），如果每次调用 `require('foo')` 都解析到同一文件，则返回相同的对象。

多次调用 `require(foo)` 不会导致模块的代码被执行多次。 这是一个重要的特性。 借助它, 可以返回“部分完成”的对象，从而允许加载依赖的依赖, 即使它们会导致循环依赖。

如果想要多次执行一个模块，可以导出一个函数，然后调用该函数。

模块缓存的注意事项：

* 模块是基于其解析的文件名进行缓存的。 由于调用模块的位置的不同，模块可能被解析成不同的文件名（比如，从 node_modules 目录加载），这样就不能保证 `require('foo')` 总能返回完全相同的对象。
* 在不区分大小写的文件系统或操作系统中，被解析成不同的文件名可以指向同一文件，但缓存仍然会将它们视为不同的模块，并多次重新加载。

### 循环

重要问题：当我们在 A.js 中引用 B.js，在 B.js 中引用 A.js 时会发生什么？

官网上点出了这种模块循环的情况，并且解释清楚了原因：

> When main.js loads a.js, then a.js in turn loads b.js. At that point, b.js tries to load a.js. In order to prevent an infinite loop, an unfinished copy of the a.js exports object is returned to the b.js module. b.js then finishes loading, and its exports object is provided to the a.js module.


简单说就是，为了防止模块载入的死循环，Node.js 在模块第一次载入后会把它的结果进行缓存，下一次再对它进行载入的时候会直接从缓存中取出结果。所以在这种循环依赖情形下，不会有死循环。但需要注意的是，此时缓存**可能是一个未完成的模块**。

```javascript
// a.js
console.log('a');
exports.str = 'a1';
const b = require('./b.js');
console.log('a:', b.str);
exports.str = 'a2';
console.log('a:结束');
```

```javascript
// b.js
console.log('b');
exports.str = 'b1';
const a = require('./a.js');
console.log('b:', a.str);
exports.str = 'b2';
console.log('b:结束');
```

```javascript
// main.js
console.log('main');
const a = require('./a.js');
const b = require('./b.js');
console.log('main：', a.str, b.str);
```

当 `main.js` 加载 `a.js` 时，`a.js` 又加载 `b.js`。 此时，`b.js` 去加载 `a.js`，会返回一个 `a.js` 的 `exports` 对象的 **未完成的副本** 给 `b.js` 模块。 然后 `b.js` 完成加载，并将 `exports` 对象提供给 `a.js` 模块。

该程序的输出会是：

```shell
main
a
b
b: a1
b:结束
a: b2
a:结束
main： a2 b2
```

### 模块加载

#### 文件模块

如果按确切的文件名没有找到模块，则 Node.js 会尝试带上 .js、.json 或 .node 拓展名再加载。

* .js 文件会被解析为 JavaScript 文本文件；.json 文件会被解析为 JSON 文本文件；.node 文件会被解析为通过 dlopen 加载的编译后的插件模块。
* 以 `/` 为前缀的模块是文件的绝对路径。
* 以 `./` 为前缀的模块是文件的相对路径，也就是说，加载同一目录下的文件。
* 当没有以 `/`、`./` 或 `../` 开头来表示文件时，则模块必须是一个核心模块或加载自 `node_modules` 目录。

如果给定的路径不存在，则 require() 会抛出一个 code 属性为 'MODULE_NOT_FOUND' 的 Error。

#### 目录作为模块

可以把程序和库放到一个单独的目录，然后提供一个单一的入口来指向它。 

如果，根目录下有 package.json 文件且指定了 main 字段的值：

```json
// package.json
{
  "name" : "some-library",
  "main" : "./lib/some-library.js"
}
```

则 `require('./some-library')` 会尝试加载 `./some-library/lib/some-library.js`，这就是 Node.js 处理 package.json 文件的方式。

**注意：** 如果 main 字段指定的文件不存在，则无法解析，Node.js 会将模块视为不存在，并抛出默认错误：`Error: Cannot find module 'some-library'`。

如果目录里没有 package.json 文件，则 Node.js 就会试图加载目录下的 index.js 或 index.node 文件。

#### 从 node_modules 目录加载

如果传递给 require() 的模块标识符不是一个核心模块，也没有以 `/`、`./` 或 `../` 开头，则 Node.js 会从当前模块的父目录开始，尝试从它的 `/node_modules` 目录里加载模块。 Node.js 不会附加 node_modules 到一个已经以 node_modules 结尾的路径上。

如果还是没有找到，则移动到再上一层父目录，直到文件系统的根目录。

比如，在 `/home/ry/projects/foo.js` 文件里调用了 `require('bar.js')`，则 Node.js 会按以下顺序查找：

```shell
/home/ry/projects/node_modules/bar.js
/home/ry/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
```

#### 从全局目录加载

如果 NODE_PATH 环境变量被设为一个以冒号分割的绝对路径列表，则当在其他地方找不到模块时 Node.js 会搜索这些路径。

**注意：** 在 Windows 系统中，NODE_PATH 是以分号间隔的。

在当前的模块解析算法运行之前，NODE_PATH 最初是创建来支持从不同路径加载模块的。

虽然 NODE_PATH 仍然被支持，但现在不太需要，因为 Node.js 生态系统已制定了一套存放依赖模块的约定。 有时当人们没意识到 NODE_PATH 必须被设置时，依赖 NODE_PATH 的部署会出现意料之外的行为。 有时一个模块的依赖会改变，导致在搜索 NODE_PATH 时加载了不同的版本（甚至不同的模块）。

此外，Node.js 还会搜索以下位置：

```shell
$HOME/.node_modules
$HOME/.node_libraries
$PREFIX/lib/node
```


其中 $HOME 是用户的主目录，$PREFIX 是 Node.js 里配置的 node_prefix。

这些主要是历史原因。

**注意：** 强烈建议将所有的依赖放在本地的 node_modules 目录。 这样将会更快地加载，且更可靠。

### 模块作用域

#### __dirname

当前模块的文件夹名称。等同于 __filename 的 path.dirname() 的值。

#### __filename

当前模块的文件名，返回当前模块文件的绝对路径（符号链接会被解析）。

```javascript
console.log(__filename) // '/Users/xxx/Documents/xxx/demo-lizh/node/nodejs/global.js'
```

**注意：** 对于主程序，这不一定与命令行中使用的文件名相同。

也就是说，运行 `node main.js`，`main.js` 导入 `a.js` 文件，`a.js` 文件中 `console.log(__filename)` 语句打印的是 `a.js` 文件的绝对路径，而不是 `main.js` 文件的绝对路径。

#### exports

exports 变量是在模块的文件级别作用域内有效的，它在模块被执行前被赋予 module.exports 的值。

它是一个对于 module.exports 的更简短的引用形式，以便 `module.exports.f = ...` 可以被更简洁地写成 `exports.f = ...`。 

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

#### module

对当前模块的引用。

#### require()

引入模块。

##### require.cache

被引入的模块将被缓存在这个对象中。从此对象中删除键值对将会导致下一次 require 重新加载被删除的模块。

**注意：** 不能删除 native addons（原生插件），因为它们的重载将会导致错误。

##### require.resolve(request[, options])

使用内部的 require() 机制查询模块的位置，此操作只返回解析后的文件名，不会加载该模块。

参数说明：

* request：字符串，需要解析的模块路径。
* options：Object
  * paths：数组，解析模块的起点路径。此参数存在时，将使用这些路径而非默认解析路径。 注意：此数组中的每一个路径都被用作模块解析算法的起点，意味着 node_modules 层级将从这里开始查询。

##### require.resolve.paths(request)

返回一个数组，其值是包含解析 request 过程中被查询的路径。 

如果 request 字符串指向核心模块（例如，http、fs），则返回 null。

参数说明：

* request：字符串，需要解析的模块路径。

### module 对象

在每个模块中，module 的自由变量是一个指向表示当前模块的对象的引用。 

module 实际上不是全局的，而是每个模块本地的。

为了方便，module.exports 也可以通过全局模块的 exports 对象访问。 

#### module.children

被该模块引用的模块对象。

#### module.exports

module.exports 对象是由模块系统创建的。 

如果希望模块能够被其他模块引用，则需要将期望导出的对象赋值给 module.exports。 

```javascript
// c.js
module.exports = {
  a: 1,
  b: 2
}
```

```javascript
// main.js
const ObjC = require('./c.js')
console.log(ObjC) // {a: 1, b: 2}
```

**注意：** 将期望的对象赋值给 exports 会简单地重新绑定本地 exports 变量，这可能不是期望的。

```javascript
// c.js，正常。main.js 打印：{a: 1, b: 2}
exports.a = 1
exports.b = 2
```

```javascript
// c.js，异常。main.js 打印：{}
exports = {
  a: 1,
  b: 2
}
```

**注意：** 对 module.exports 的赋值必须立即完成，不能在任何回调中完成。 

#### module.filename

模块的完全解析后的文件名。

#### module.id

模块的标识符。 通常是完全解析后的文件名。

#### module.loaded

模块是否已经加载完成，或正在加载中。

#### module.parent

最先引用该模块的模块。

#### module.paths

模块的搜索路径。

#### module.require(id)

提供了一种类似 require() 从原始模块被调用的加载模块的方式。

**注意：** 为了做到这个，需要获得一个 module 对象的引用。 因为 require() 会返回 module.exports，且 module 只在一个特定的模块代码中有效，所以为了使用它，必须明确地导出。

### module 模块

module 对象和 module 模块是不同的：module 对象是 Node.js 中的全局变量；而 module 模块，是通过 `import 'module'` 或 `require('module')` 访问。

```javascript
const Module = require('module');
for (key in Module) {
  console.log(key)
}
```

```shell
_cache
_pathCache
_extensions
_debug
_findPath
_nodeModulePaths
_resolveLookupPaths
_load
_resolveFilename
_initPaths
_preloadModules

builtinModules
globalPaths
createRequireFromPath
createRequire
syncBuiltinESMExports
Module
runMain
findSourceMap
SourceMap
```

#### module.builtinModules

Node.js 提供的所有模块的名称列表。 可用于验证某个模块是否由第三方模块维护。 

```javascript
const builtinModules = require('module').builtinModules;
console.log(builtinModules)
```

#### module.createRequire(filename)

返回一个 require 函数。

参数说明：

* filename：字符串，用于构造 require 函数的文件名。必须是一个文件 URL 对象、文件 URL 字符串、或绝对路径字符串。

```javascript
// main.mjs。注意：import 只能在 ES module 中使用。
import { createRequire } from 'module';

// import.meta.url 是当前文件路径。
// file:///Users/xxx/Documents/xxx/demo-lizh/node/nodejs/main.mjs
const myRequire = createRequire(import.meta.url);
const objC = myRequire('./c.js')
console.log(objC)
```

```javascript
// main.js
const { createRequire } = require('module');
const myRequire = createRequire(__filename);
const objC = myRequire('./c.js');
console.log(objC)
```

#### module.createRequireFromPath(filename)（弃用）

返回一个 require 函数。

**注意：** 该方法已弃用，改用 createRequire() 。

参数说明：

* filename：字符串，用于构造 require 函数的文件名。必须是一个文件 URL 对象、文件 URL 字符串、或绝对路径字符串。

```javascript
const { createRequireFromPath } = require('module');
const myRequire = createRequireFromPath('/Users/xxx/Documents/xxx/demo-lizh/node/nodejs/');
const objC = myRequire('./c.js');
console.log(objC)
```

### 参考资料

[Node.js 中文文档 - module（模块）](https://www.nodeapp.cn/modules.html)

[API Reference Document - module（模块）](https://www.apiref.com/nodejs-zh/module.html)

