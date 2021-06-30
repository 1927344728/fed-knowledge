## webpack构建优化篇

随着项目的发展，项目目录会越来越大，各种库也会越来越多，会直接导致Webpack的构建效率极低。本文整理了一些项目优化方法，**主要是针对已有的、webpack 4以下的项目**。

Webpack 4 支持零配置使用，构建速度有很大提升，推荐使用webpack 4构建新项目。



以下是一些优化webpack的插件或配置方法：



### html-webpack-plugin-for-multihtml

在前端多页面（多html）开发的时候，使用`webpack`进行HMR热部署，但每一次修改之后，热部署持续很长的时间，而且页面越多，时间越长，观察可知大部分时间花在 `asset optimization` 这一步。每次修改都会触发所有页面的重新构建，但其实**我们只需要更新修改的页面即可**。

**解决方案：**

使用 [html-webpack-plugin-for-multihtml](https://www.npmjs.com/package/html-webpack-plugin-for-multihtml) 代替 [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)  模块，并且加上 `multihtmlCache`。

>  when a file has been changed, `compiler` will recompile and trigger `plugin('make', cb)`, then `html-webpack-plugin` will create new `childCompiler`, and run `compile` for all html. it is slow.

> **`package.json` `scripts` 中的  `npm rn dev ` 命令加入`--profile` (放在`—config`前)，它会告诉你编译过程中哪些步骤耗时最长。**

**安装：**`npm i html-webpack-plugin-for-multihtml --save-dev`

```js
const HtmlWebpackPluginForMultihtml = require('html-webpack-plugin-for-multihtml')
plugins: [
    new HtmlWebpackPluginForMultihtml({
        filename: ``,
        template: ``,
        inject: true,
        chunks: [],
        multihtmlCache: true // 解决多页热部署的关键
    })
]
```

> 项目页面过多，可能出错 `JavaScript heap out of memory` 错误。
>
> 原因和解决方法可参考下面链接:
>
> [https://blog.csdn.net/QIANG123___/article/details/79183544](https://blog.csdn.net/QIANG123___/article/details/79183544)
>
> https://blog.csdn.net/u013176571/article/details/76498025

**参考链接**

[完美解决webpack多页面热部署缓慢问题](https://blog.csdn.net/dobility/article/details/87781713)



### commonsChunkPlugin

`CommonsChunkPlugin`主要是用来提取第三方库和公共模块。将第三方库（例如vue）提取到单的 `vendor` chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。

因此可以单独打包出来，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。

```js
//name: 'runtime',创建一个名为runtime的commons chunk
//filename: '[name].js',输出一个文件名与前面name参数相同的js文件
//chunks: ['vendor']，指明是对名为vendor的chunk，进行文件抽离。
new webpack.optimize.CommonsChunkPlugin({
    name: 'runtime',
    filename: '[name].js',
    chunks: ['vendor']
}),
```

```js
//单独分离出第三方库、自定义公共模块、webpack运行文件
//进行两次文件提取，第一次生成名为vendor的chunk，第二次以vendor chunk为源，生成名为runtime的chunks
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor','runtime'],
        filename: '[name].js'
    }),
]

//上面这段代码，等价于下面这段：
plugins: [
    //分离出第三方库、自定义公共模块、webpack运行文件
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name].js'
    }),
    ////抽离webpack运行文件
    new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime',
        filename: '[name].js',
        chunks: ['vendor']
    }),
]


//抽离第三方库和自定义公共模块。
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor','runtime'],
        filename: '[name].js',
        minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: '[name].js',
        
        //从名为enteryJs_1、enteryJs_2的entry chunk中抽取commons chunk
        chunks: ['enteryJs_1','enteryJs_2']
        
    })
]
```

> 各种教程中`CommonsChunkPlugin`提及到`chunk`主要有以下三种：
>
> `entry chunk`：webpack当中配置的入口文件（entry）
>
> `commons chunk`：通过`CommonsChunkPlugin`提取出来的chunk
>
> `children chunk`：入口文件以及它的依赖文件通过`code split`（代码分割）或者分割出来的。[我理解：入口文件中，import()加载的模块生成的chunk]??

**参数详解**

```js
new webpack.optimize.CommonsChunkPlugin({
    // 这是common chunk的名称。即通过CommonsChunkPlugin创建出来的chunk
    // 如果是已存在chunk的名字，则从source chunks中提取该chunk的代码。即不需要再生成
    name: string,
    // 传入字符串数组，等于为每个块名称多次调用插件。即相当于对数组遍历，且当前元素以前一个子元素做为[chunks]参数的值
    // names: string[],

    // 提取出来的文件名。一般不需要配置，自动取name的值
    filename: string,

    // number：表示模块抽取的最小被调用次数。默认minchunks：3，表示chunk最少需要被调用3次，webpack才会把它当做一个公共模块抽取出来
    // Infinity：直接生成公共chunk，不包含模块，只有webpack的runtime代码
    // function：webpack会用它来检验每个模块。[我解理：返回值为true，表示提该模块]？？
    // 有两个参数module（object类型）、count（number类型），分别代表source chunks中引用的模块，引用的次数。module有两个常用的参数。
    // module有两个常用的属性：module.context（该模块文件所在的目录）、module.resource（该模块文件的完整路径，即module.context + 模块名称）
    minChunks: number|Infinity|function(module, count) -> boolean,

    // 指定需要提取代码的chunks。chunk 必须是公共chunk 的子模块。
    // 如果被忽略，默认为所有的入口chunk (entry chunk) 。
    chunks: string[],

    // 如果true，则会对所有公共 chunk 的【子模块块】进行公共模块提取
	// 一个 chunk 的多个子 chunk 的公共模块，移入父 chunk（会对首次加载时间产生不良影响）。
    children: boolean,

	// 如果true，则会对所有公共 chunk 的【后代模块】进行公共模块提取
	deepChildren: boolean,

    // 一个 chunk 的多个子 chunk 的公共模块，移入父 chunk（会对首次加载时间产生不良影响）
	// async: true。表示并非将公共模块移动到父 chunk（增加初始加载时间），而是使用新的异步加载的额外公共chunk。当下载额外的 chunk 时，它将自动并行下载。
	// async: string。提供想要的字符串，而不是 true 来对输出的文件进行更换名称
    async: boolean|string,

    // 创建公共块之前所有公共模块的最小大小
    minSize: number,
})
```

参考链接：

 [commonsChunkPlugin插件](https://www.html.cn/doc/webpack2/plugins/commons-chunk-plugin/)



### splitChunksPlugin

`Webpack `4给我们带来了一些改变。包括更快的打包速度，引入了`SplitChunksPlugin`插件来取代（之前版本里的）`CommonsChunksPlugin`插件。

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // 表示从哪些chunks里面抽取代码
      // async: 打包异步引入的代码块
      // all:  同步、异步
      // initial: 同步代码
      // 还可以通过函数来过滤所需的 chunks
      chunks: 'async', 
      //表示抽取出来的文件在压缩前的最小大小，默认为 30000(30kb)
      minSize: 30000,
      //表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小
      maxSize: 0,
      //表示被引用次数，默认为1
      minChunks: 1,
      //最大的按需(异步)加载次数，默认为 5；
      maxAsyncRequests: 5,
      //最大的初始化加载次数，默认为 3；
      maxInitialRequests: 3,
      //抽取出来的文件的自动生成名字的分割符，默认为 ~；
      automaticNameDelimiter: '~',
      //抽取出来文件的名字，默认为 true，表示自动生成文件名；
      name: true,
      //缓存组。（这才是配置的关键）
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

//optimization.runtimeChunk
//通过optimization.runtimeChunk: true选项，webpack会添加一个只包含运行时(runtime)额外代码块到每一个入口。（译注：这个需要看场景使用，会导致每个入口都加载多一份运行时代码）
```

上面的那么多参数，其实都可以不用管。**cacheGroups 才是配置的关键，它可以继承/覆盖上面 `splitChunks` 中所有的参数值。**

除此之外还额外提供了三个配置，分别为：`test`, `priority` 和 `reuseExistingChunk`。

> test: 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
>
> priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
>
> reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。

**参考链接**

[webpack4——SplitChunksPlugin使用指南](https://blog.csdn.net/qq_26733915/article/details/79458533)

[webpack 4 Code Splitting 的 splitChunks 配置探索](https://imweb.io/topic/5b66dd601402769b60847149)



### **DllPlugin** 、 DllReferencePlugin 和 AutoDllPlugin

`DllPlugin `和 `DllReferencePlugin `提供了以大幅度提高构建时间性能的方式拆分软件包的方法。

**原理：**将特定的第三方NPM包模块提前构建，然后通过页面引入。这不仅能够使得 vendor 文件可以大幅度减小，同时，也极大的提高了构件速度。

**只对库文件打包一次。**也就是说，只要库文件不变，只需要打包一次，以后再打包业务代码和库文件没关系啦，这样一来真正做到了库文件永远是那个库文件，只要库文件不变，缓存永远有效。

#### DllPlugin 和 DllReferencePlugin

实现过程：

* **提前缓存指定的第三方库**。

  开发运行阶段：直接引入第三方打包库。需要在`index.html`配置静态变量，即提前打包的第三方包路径，通过`HtmlWebpackPlugin`实现。

  生产打包阶段：已经打包过的第三库不会再次打包，而是直接引用，打包速度提升不止一倍多。

* 文件名中添加hash，用于标记当前打包版本，如果引入第三包没有变化，hash版本号还是和上次一样。这样就能起到缓存的作用。

* 需要注意在`html`里引入的静态变量（第三库路径），需要依靠`webpack.dll.conf.js`文件中的`AssetsPlugin`生成本地静态缓存。

* 在build文件夹中新建`webpack.dll.config.js`

  ```js
  const path = require('path')
  const webpack = require('webpack')
  
  // 需要打包到一起的第三文件
  const vendors = [
  	'vue/dist/vue.esm.js',
  	'axios'
  ];
  module.exports = {
  	// 也可以设置多个入口，多个vendor，就可以生成多个bundle
      entry: {
          vendor: vendors
      },
     	// 输出文件的名称和路径
      output: {
          filename: '[name].bundle.js',
          path: path.join(__dirname, './static/dll'),
          library: '[name]_[chunkhash]',
      },
      plugins: [
          // 这时候打包需要设置环境为production，因为像vue之类在dev环境下会比prod环境多一些信息，在生产环境如果打包的是dev代码，vue也会给出警告
          new webpack.DllPlugin({
              path: path.join(__dirname, './static/dll', '[name]-manifest.json'),
              name: '[name]_[chunkhash]',
              context: __dirname
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
      ]
  }
  ```

* 生成`DLL Bundle`。在`package.json`中新增：

  ```json
  "scripts": {
  	"build:dll": webpack --config webpack.dll.config.js
  }
  ```

  执行`npm run build:dll`，生成`DLL Bundle`，即`vendor-manifest.json`

* `webpack`使用`DLLReferencePlugin`，将的`vendor-manifest.json`中的第三方库打包成一个js。

  配置如下：

  ```json
  plugins: [
  	new webpack.DllReferencePlugin({
          context: path.join(__dirname, '..'),
          manifest: require(path.join(__dirname, '../static/dll/vendor-manifest.json'))
      })
  ]
  ```

* 在`html`中引入`js`

  ```js
  new HtmlWebpackPlugin({
      title: 'title',
      filename: 'index.html',
      template: 'index.html',
      templateParameters: {
          dllVendor: './dll/vendor.bundle.js'
      }
  })
  ```

  ```html
  <script src="<%= htmlWebpackPlugin.options.templateParameters.dllVendor %>"></script>
  ```

> `CommonsChunkPlugin`和`DLLPlugin`区别：
>
> `CommonsChunkPlugin`：每次打包都要把第三方库也运行打包一次
>
> `DLLPlugin`：每次打包只打包项目文件，我们只要引用第一次打包好的第三方压缩文件就行了

> 建议先用**webpack-bundle-analyzer **查看哪些插件可以打包到dll。



#### AutoDllPlugin

相当于自动完成完成了`DllReferencePlugin`和`DllPlugin`的工作，并将生成的js注入到html。

**安装：**`npm i autodll-webpack-plugin -D`

```js
const AutoDllPlugin = require('autodll-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

plugins: [
    new AutoDllPlugin({
        inject: true, // will inject the DLL bundles to html
        context: path.join(__dirname, '..'),
        filename: '[name]_[hash].dll.js',
        path: 'res/js',
        plugins: mode === 'online' ? [  //判断线上环境
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                },
                sourceMap: false,
                parallel: true
            })
        ] : [],
        entry: {
            vendor: [
                '@babel/polyfill',
                'axios',
                'better-scroll',
                'bxs-ui-vue/*',
                'id-validator',
                'id-validator/src/GB2260',
                'lodash',
                'mint-ui',
                'vee-validate',
                'velocity-animate',
                'vue/dist/vue.esm.js',
                'vue-lazyload',
                'vue-router',
                'vux'
            ]
        }
    })
]
```

#### 实际测试情况

* 线上打包，`AutoDllPlugin`比`CommonsChunkPlugin`慢。

* 使用autoDll打包的插件，应避免局部引用。

  如：`autoDll`打包了`bxs-ui-vue`框架，页面中用 `import { DefaultPage } from 'bxs-ui-vue'`。`autoDll` `build`过程中，无法识别`DefaultPage`是`bus-ui-vue`的一个子组件，会把`DefaultPager`打包到业务的js文件中。

* 开发环境使用`AutoDllPlugin`，可以加快编译速度。

* 无法打包插件：`vue-awesome-swiper`。

**参考链接**

[实践 DllPlugin 来优化 webpack 打包速度](https://juejin.im/entry/57a6dee4a633bd00604d0e73)



### webpack-parallel-uglify-plugin

`webpackParallelUglifyPlugin`是`UglifyJS`一个**多进程**的实现。

当`webpack`有多个`JS`文件需要输出和压缩时候，原来的`UglifyJS`会一个个压缩并且输出。

`webpackParallelUglifyPlugin`插件则会开启多个子进程，把对多个文件压缩的工作分别给多个子进程去完成，但是每个子进程还是通过`UglifyJS`去压缩代码。无非就是变成了并行处理该压缩了，并行处理多个子任务，效率会更加的提高。

**安装：**`npm i webpack-parallel-uglify-plugin -D`

```js
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
new ParallelUglifyPlugin({
  cacheDir: '.cache/',
  uglifyJS:{
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }
})
```



### Happypack

`happypack `是 `webpack `的一个插件，目的是通过多进程模型，来加速代码构建。

**安装：** `npm install --save-dev happypack`

```js
{
	test: /\.vue$/,
	loader: 'vue-loader',
	options: vueLoaderConfig
},
{
	test: /\.js$/,
	loader: 'babel-loader',
	include: [
        resolve('src'),
        resolve('test'),
        resolve('node_modules/webpack-dev-server/client'
    ]
},
```

替换为：

```js
//引入插件
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 4});

//替换原来的loader
{
    test: /\.vue$/,
	loader: 'happypack/loader?id=happyvue'
},
{
    test: /\.js$/,
    include: [resolve('src'), resolve('lib'),resolve('test'),resolve('node_modules/webpack-dev-server/client')],
	loader: 'happypack/loader?id=happybabel',
	exclude: /node_modules/
}

//加happyPack的配置
plugins: [
    new HappyPack({  // HappyPack插件
        id: 'happybabel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool
    }),
    new HappyPack({
        id: 'happyvue',
        //同时开多少线程进行打包，也可以用ThreadPool控制
        threads: 4,
        loaders: [{
            //这是真实的处理loader，具体配置和rules里原本的一致，options也照搬过来就行
            loader:'vue-loader',
            options: vueLoaderConfig
        }]
    })
]
```

> 并发实现后，一定就能提升编译效率吗？
>
> 不一定！
>
> * **一个文件有多个依赖文件，才有并发的可能。**
>
>   父模块和它的依赖模块之间不可以并发。因为只有编译完父文件之后，才能知道它的依赖文件列表。
>
>   假设一个项目代码，从入口文件开始，每一个模块只依赖了一个其他的模块。这样每次编译完一个模块，只能有一个依赖模块可以编译。这一个过程里，模块编译只能一个一个顺序执行，没有并发可行性。
>
> * 正常情况下，一个文件引入多个依赖，多个依赖之间可以并发；
> * 每个依赖引入多个子依赖，这些依赖和子依赖之间，只要没有直接的依赖链，都可以并发。

#### 实测结果

* `HappyPack `对`file-loader、url-loader `支持的不友好

* 使用了`vux-loader`，`happypack` 对` vue-loader` 无效

* 实际使用中，`happypack`提升速度有限。

**参考链接**

[HappyPack - Webpack 的加速器](http://blog.yunfei.me/blog/happypack_webpack_booster.html)



### Externals方法

`webpack `提供`Externals`的方法，可以通过外部引用的方法，引入第三方库

```js
//index.html
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.js"></script>

//webpack.config.pro.js
externals: {
	vue: 'Vue'
}
```



### Resolve方法

`resolver`帮助`webpack `找到需要引入的模块代码，这些代码在包含在个` require/import `语句中。 当打包模块时，`webpack`使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径。

```js
resolve: {
	extensions: ['.js', '.jsx', '.less', '.css'],
	modules: [
        path.resolve(dirname, 'node_modules'),
        path.resolve(dirname, 'src')
    ]
}
```



### 合适的devtool 选项

设置devtool值来决定项目需不需要生成`.map`文件。修改`webpack.config.js` 代码配置：

```js
module.exports = {
  ...
  devtool: 'eval',
  ...
}
```

#### devtool值详解

* none：省略devtool选项

- eval：每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 //@ sourceURL。

- source-map：生成一个 SourceMap 文件。

- hidden-source-map：和 source-map 一样，但不会在 bundle 末尾追加注释。

- inline-source-map：生成一个 DataUrl 形式的 SourceMap 文件。

- eval-source-map：每个 module 会通过 eval() 来执行，并且生成一个 DataUrl 形式的 SourceMap 。

- cheap-source-map：生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 

  sourcemap（譬如 babel 的 sourcemap）。

- cheap-module-source-map：生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。

#### 关键字解答

看似配置项很多， 其实只是五个关键字`eval`，`source-map`，`cheap`，`module`，`inline`的任意组合。这五个关键字每一项都代表一个特性：

- eval： 使用eval包裹模块代码。
- source-map： 产生`.map`文件。
- cheap： 不包含列信息，也不包含loader的sourcemap。
- module： 包含loader的sourcemap。比如：jsx to js ，babel的sourcemap。
- inline： 将`.map`作为DataURI嵌入，不单独生成`.map`文件。这个配置项比较少见

#### 使用推荐

**开发环境推荐使用**

* eval ：每个模块使用eval()和//@ sourceURL执行。主要缺点是，它没有正确显示行号。

* eval-source-map：每个模块使用eval()执行，而SourceMap作为DataUrl添加到eval()中。最初它是缓慢的，但是它提供快速的重建速度和产生真实的文件。行号被正确映射，因为它被映射到原始代码。它产生了最优质的开发资源。

**生产环境推荐使用**

* **none ：省略devtool选项，不触发SourceMap。**

* source-map：一个完整的SourceMap是作为一个单独的文件。



### 总结

* `AutoDllPlugin`打包第三插件，构建速度并没有比`commonsChunkPlugin`快，且`AutoDllPlugin`打包出来的`js`，会有兼容性问题，在部分安卓机中报错，还没找到原因。

* `Happypack`对构建速度的优化有限，并没有网上所说提升`30%\50%`

* `webpack-parallel-uglify-plugin`，可以显示加快构建速度

* `html-webpack-plugin-for-multihtml`，在多页面项目的开发中，可以极大得减少构建时间。

* 最近发现`webpack4`的项目，页面太多了，热加载也会变慢。**正在找对应解决文案。。。**



### 参考链接

[打破砂锅问到底：详解Webpack中的sourcemap](https://segmentfault.com/a/1190000008315937)

[Webpack 打包优化之体积篇](https://www.jeffjade.com/2017/08/06/124-webpack-packge-optimization-for-volume/)

[Webpack 打包优化之速度篇](https://www.jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/)

