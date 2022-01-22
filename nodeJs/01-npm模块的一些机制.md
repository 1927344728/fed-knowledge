## npm模块的一些机制

npm （Node PackageManager） 是 JavaScript 世界的包管理工具，并且是 Node.js 平台的默认包管理工具。通过 npm 可以安装、共享、分发代码，管理项目依赖关系。

### npm的模块安装及管理

#### 安装模块

- 发出 npm install 命令

- 查询 node_modules 目录之中是否已经存在指定模块。如果存在，就不再重新安装了。

- 若不存在，npm 向 registry 查询模块压缩包的网址

- 下载压缩包，存放在根目录下的`.`npm目录里

- 解压压缩包到当前项目的node_modules目录


**注意：** 一个模块安装以后，本地其实保存了两份。一份是`.`npm目录下的压缩包，另一份是node_modules目录下解压后的代码。但是，运行npm install 的时候，只会检查node_modules目录，而不会检查`.`npm目录。也就是说，如果一个模块在`.`npm下有压缩包，但是没有安装在node_modules目录中，npm 依然会从远程仓库下载一次新的压缩包。

```shell
npm install <packageName> # 远程版本较新、或者本地版本不存在时安装
npm install <packageName> --force # 不管是否安装过，npm 都要强制重新安装
npm install packageName@[version] # 安装指定版本
```

#### 更新模块

命令：`npm update`

```shell
npm update <packageName>
```

先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装。

#### 查询模块

npm 模块仓库提供了一个查询服务，叫做 registry 。以 npmjs.org 为例：

```shell
https://registry.npmjs.org/webpack // 查看 webpack 模块所有版本的信息
https://registry.npmjs.org/webpack/4.44.2 // 查看4.44.2版本的 webpack 模块信息
```

`npm install` 和 `npm update` 命令，都是通过这种方式安装模块的。

#### 模块缓存

`npm install` 或 `npm update` 命令，从 registry 下载压缩包之后，都存放在本地的缓存目录。

这个缓存目录，在 Linux 或 Mac 默认是用户主目录下的 `.npm` 目录，在 Windows 默认是 `%AppData%/npm-cache`。通过配置命令，可以查看这个目录的具体位置。

```shell
npm config get cache
# $HOME/AppData/Roaming/npm-cache
```

每个模块的每个版本，都有一个自己的子目录，里面是代码的压缩包 `package.tgz`文件，以及一个描述文件`package/package.json`。除此之外，还会生成一个 `{cache}/{hostname}/{path}/.cache.json` 文件。

对于一些不是很关键的操作（比如 `npm search` 或 `npm view`），npm 会先查看 `.cache.json` 里面的模块最近更新时间，跟当前时间的差距，是不是在可接受的范围之内。如果是的，就不再向远程仓库发出请求，而是直接返回 `.cache.json` 的数据。

清空缓存：

```shell
npm cache clean --force
```

#### `--cache-min` 参数

npm 提供了一个 `--cache-min` 参数，用于从缓存目录安装模块。`--cache-min` 参数指定一个时间（单位为分钟），只有超过这个时间的模块，才会从 registry 下载。

```shell
npm install --cache-min 9999999 <package-name>
# 只有超过999999分钟的模块，才从 registry 下载。实际上就是指定，所有模块都从缓存安装，这样就大大加快了下载速度。

npm install --cache-min Infinity <package-name>
# 从缓存中安装
```

#### package.json

package.json 用于记录项目中使用的 npm 包，以及项目的配置信息（比如名称、版本号、项目描述、许可证等元数据），便于开发组成员共享。开发人员在项目目录下运行 npm install 命令可以自动下载 package.json 文件中运行和开发环境中所需的依赖。



### npm的模块安装机制

安装 npm 模块时，可能的方式有两种：**平级式**的安装或**嵌套式**的安装。

![image-20201104203800542](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20201104203800542.png)

假设：项目 APP 下有两个依赖模块 A 和 B；A 又有一个依赖模块 C v1.0；而 B 也有一个依赖模块 C v2.0。显然，它们并不能同时存在于同一个 node_modules 下，当安装的时候，由于 npm的作用机制，只能有一个版本的依赖模块被安装，其中一个将覆盖另外一个。这可能会导致A模块和B模块不兼容

#### npm2下的模块安装机制

npm2 安装多级的依赖模块采用嵌套的安装方式。

**优点：**解决了版本单一时存在的存在的不兼容问题，实现多版本兼容

**弊端：**可能造成相同模块大量冗余的问题

#### npm3下的模块安装机制

npm3 和 npm2 的不同主要体现在二级模块的安装上：

npm3会**"尽量"**把逻辑上某个层级的模块在物理结构上**"全部"**放在项目的第一层级里，具体我概括为以下三种情况：

* 在安装某个二级模块时，若发现第**一**层级**还没有相同名称的模块**，便**把这第二层级的模块放在第一层级**

* 在安装某个二级模块时，若发现第**一**层级**有相同名称，相同版本的模块**，便**直接复用那个模块**

* 在安装某个二级模块时，若发现第**一**层级**有相同名称，但版本不同的模块**，便**只能嵌套在自身的父模块下方**

>**在npm2中，依赖树的逻辑结构和它的物理结构相同**
>
>**在npm3中，依赖树的逻辑结构和它的物理结构可能不同**



### npm的模块引用机制

在 Node.js 中，有三类模块：

* Node.js 的核心模块。如：fs 模块、database 模块
* 文件模块：开发者自行编写的。如：test.js 模块
* npm 模块：这是一种特殊的文件模块，一般是一个文件或包的形式，比如引入 mysql 所需的 npm 包。

#### 路径分析

文件模块引入时，模块标识指明了确切的文件位置（可以放置在任意位置，使用相对路径（ `./` 和 `../` ）或以 `/` 开头的绝对路径），所以在路径分析中可以省略大量时间，加载速度仅次于核心模块。

npm 模块则是会从以下路径中依次查找，直到找到目标模块为止。npm 模块的路径越深，路径分析的耗时越多，其加载速度是最慢的。

```shell
/Users/[whoami]/[projectname]/[directory]/node_modules
/Users/[whoami]/[projectname]/node_modules
/Users/[whoami]/node_modules
/Users/node_modules
/node_modules
/Users/[whoami]/.node_modules
/Users/[whoami]/.node_libraries
/usr/local/Cellar/node/7.7.1/lib/node
```

#### 文件定位

模块标识可以不包含后缀名，所以 Node.js 在文件定位时会依次补充 .js，.json，.node 后缀名，然后去进行文件定位。因为 Node.js 是单线程，所以文件定位时会发生堵塞，所以如果引入的模块后缀是 .json 或者 .node，可以在引入的时候加上后缀，可以提高查找速度。

#### 编译执行

定义到具体文件后，Node.js 会创建一个模块对象，然后将模块引入并且编译。每一个编译成功的模块其文件路径都会作为索引缓存在缓存对象上，以提高二次引入模块的性能。

核心模块在 Node.js 源代码的编译过程中，直接被编译成二进制文件，然后被直接加载到内存中，所以核心模块引入时，文件定位和编译执行这两个步骤可以直接跳过，并且核心模块在路径分析中会被优先判断，所以核心模块的加载速度是最快的。

文件模块则是在执行时动态加载，所以路径分析，文件定位以及编译执行这三个步骤都不可省略，所以加载速度比核心模块慢。

Node.js 对引入过的模块会进行缓存，以减少二次引入模块的性能开销二次加载模块一律采用缓存优先方式。核心模块的缓存检查优先于文件模块。

### npm模块循环依赖及其解决

重要问题：当我们在 A.js 中引用 B.js，在 B.js 中引用 A.js 时会发生什么？

官网上点出了这种模块循环的情况，并且解释清楚了原因：

> When `main.js` loads `a.js`, then `a.js` in turn loads `b.js`. At that point, `b.js` tries to load `a.js`. In order to prevent an infinite loop, an **unfinished copy** of the `a.js` exports object is returned to the `b.js` module. `b.js` then finishes loading, and its exports object is provided to the `a.js` module.

简单说就是，为了防止模块载入的死循环，Node.js 在模块第一次载入后会把它的结果进行缓存，下一次再对它进行载入的时候会直接从缓存中取出结果。所以在这种循环依赖情形下，不会有死循环，但是却会因为缓存造成模块没有按照我们预想的那样被导出（export，详细的案例分析见下文）。

下面是一个两个模块循环依赖的问题最简情形：

A.js：

```js
let b = require('./B');

console.log('A: before logging b');
console.log(b);
console.log('A: after logging b');

module.exports = {
    A: 'this is a Object'
};
```

B.js：

```js
let a = require('./A');

console.log('B: before logging a');
console.log(a);
console.log('B: after logging a');

module.exports = {
    B: 'this is b Object'
};
```

运行 `A.js`，将会看到如下输出：

```js
B: before logging a
{}
B: after logging a
A: before logging b
{ B: 'this is b Object' }
A: after logging b
```

JavaScript 作为一门解释型的语言，上面的打印输出清晰的展示出了程序运行的轨迹。在这个例子中，`A.js` 首先 `require` 了 `B.js`, 程序进入 `B.js`，在 `B.js` 中第一行又 `require` 了 `A.js`。

如前文所述，为了避免无限循环的模块依赖，在 Node.js 运行 `A.js` 之后，它就被缓存了，但需要注意的是，此时缓存的仅仅是一个未完工的 `A.js`（an **unfinished copy** of the `a.js`）。所以在 `B.js` `require` `A.js` 时，得到的仅仅是缓存中一个未完工的 `A.js`，具体来说，它并没有明确被导出的具体内容（`A.js` 尾端）。所以 `B.js` 中输出的 `a` 是一个空对象。

之后，`B.js` 顺利执行完，回到 `A.js` 的 `require` 语句之后，继续执行完成。





### 参考资料

[npm 模块安装机制简介](https://www.ruanyifeng.com/blog/2016/01/npm-install.html)

https://www.cnblogs.com/penghuwan/p/6970543.html

https://cloud.tencent.com/developer/article/1556014

http://maples7.com/2016/08/17/cyclic-dependencies-in-node-and-its-solution/