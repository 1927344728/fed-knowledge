## webpack构建优化篇

使用 Webpack 管理项目时，随着项目的发展，页面会越来越多，各种第三方库也会越来越多，会导致 Webpack 的构建速度降低，尤其是在开发环境，因为每次文件改动，热加载都会对整个项目所有页面进行编译。而且，如果打包出来的文件体积过大，页面加载会变慢，影响用户体验。

本文整理了一些优化构建的 Webpack 插件和方法，且已在 **Webpack 3** 项目中亲测过。

> Webpack 4 支持零配置使用，构建速度已有很大提升，构建新项目推荐使用 Webpack 4。

### webpack性能分析工具

在优化前，我们先要了解项目目前的状况。分析 webpack 性能，可分体积和速度两部分。体积是指打包出来的文件大小，速度是指每次编译所消耗的时间。

#### webpack-bundle-analyzer

可视化大小的 webpack 输出文件与交互式可缩放的树图。 它可以将内容束展示为方便交互的直观树状图，让你明白你所构建包中真正引入的内容；我们可以借助它，发现它大体有哪些模块组成，找到不合时宜的存在，然后优化它。

```js
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```

或者终端运行命令时，加上 npm_config_report=true 参数：`NODE_ENV=production npm_config_report=true npm run build`。

![webpack-bundle-analyzer](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/微信图片_20211119220940.jpg)

#### speed-measure-webpack-plugin

它会告诉你编译过程中哪些步骤耗时最长。这是优化 webpack 构建速度的第一步，先知道要在哪些方面做优化。

```js
// webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const webpackConfig = smp.wrap({
  plugins: [new MyPlugin(), new MyOtherPlugin()]
})
```

![speed-measure-webpack-plugin](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/微信图片_20211119221036.jpg)

或者终端运行命令时，加上 --profile 参数：`NODE_ENV=production --profile npm run build`。



### [html-webpack-plugin-for-multihtml](https://www.npmjs.com/package/html-webpack-plugin-for-multihtml)

在多页面开发中，使用 webpack 进行热部署，每一次文件改动，都会重新编译项目文件，且页面越多，编译时间越长。我们通过分析工具可发现，大部分时间花在 `asset optimization` 这一步。因为，每次文件改动都会触发所有页面的重新构建，但其实**我们只需要更新有改动的文件即可**。

html-webpack-plugin-for-multihtml 是在 html-webpack-plugin 基础上，增加一个配置选项（multihtmlCache）来解决多 html 重新编译缓慢的问题。当一个文件被更改时，它将重新编译并触发 `plugin('make'， cb)`，而 html-webpack-plugin 将创建新的子编译，并对所有 html 进行编译。

> when a file has been changed, `compiler` will recompile and trigger `plugin('make', cb)`, then `html-webpack-plugin` will create new `childCompiler`, and run `compile` for all html. it is slow.

**注意：** 必需加上 multihtmlCache 参数。

**注意：** 该插件与 webpack 4 不兼容。

```js
const HtmlWebpackPluginForMultihtml = require('html-webpack-plugin-for-multihtml')
plugins: [
    new HtmlWebpackPluginForMultihtml({
        filename: ``,
        template: ``,
        inject: true,
        chunks: [],
        // 这是解决多页页面热部署的关键
        multihtmlCache: true
    })
]
```

> 项目页面过多，可能出错 `JavaScript heap out of memory` 错误。
>
> 简单来说：这是编译文件过多，引起内存泄露。
>
> 解决方法：node 启动时，传递 --max-old-space-size 或 --max-new-space-size 来调整内存大小的使用限制。
>
> ```shell
> node --max_old_space_size=4096 build/dev-server.js
> ```
>
> 或者利用第三方插件 [increase-memory-limit](https://www.npmjs.com/package/increase-memory-limit)扩展内存。

**参考资料：**

[完美解决webpack多页面热部署缓慢问题](https://blog.csdn.net/dobility/article/details/87781713)

[(node.js)webpack打包报javaScript heap out of memory,内存溢出，如何解决](https://blog.csdn.net/QIANG123___/article/details/79183544)

[webpack打包报javaScript heap out of memory的解决方法](https://blog.csdn.net/u013176571/article/details/76498025)



### [commonsChunkPlugin](https://www.webpackjs.com/plugins/commons-chunk-plugin/)

CommonsChunkPlugin 是 webpack 内置的插件，主要是用来提取第三方库和公共模块（如：Vue）提取到单独的 `vendor chunk` 文件，是比较推荐的做法，因为，它们很少像本地的源代码那样频繁修改。我们可以利用客户端的缓存机制，来命中缓存，减少资源请求。

```js
// name: 'runtime'，创建一个名为 runtime 的 commons chunk
// filename: '[name].js'，输出一个文件名与前面 name 参数相同的 Js 文件
// chunks: ['vendor']，指明是对名为 vendor 的 chunk，进行文件抽离。
new webpack.optimize.CommonsChunkPlugin({
    name: 'runtime',
    filename: '[name].js',
    chunks: ['vendor']
}),
```

```js
//单独分离出第三方库、自定义公共模块、webpack运行文件
//进行两次文件提取，第一次生成名为 vendor 的 chunk，第二次以 vendor chunk 为源，生成名为 runtime 的 chunks
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor','runtime'],
        filename: '[name].js'
    })
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

CommonsChunkPlugin 的 chunk 主要有以下三种：

- **entry chunk：** webpack当中配置的入口文件（entry）
- **commons chunk：** 通过 CommonsChunkPlugin 提取出来的chunk
- **children chunk：** 入口文件以及它的依赖文件通过`code split`（代码分割）或者分割出来的。【我理解：entry 是指定的文件以及通过 import 加载进来的模块生成的chunk】??

**参考资料：**

 [commonsChunkPlugin插件](https://www.html.cn/doc/webpack2/plugins/commons-chunk-plugin/)



### splitChunksPlugin

webpack 4 给我们带来了一些改变，其中之一是引入了 SplitChunksPlugin 插件来取代（之前版本里的）CommonsChunksPlugin 插件，来加快构建速度。

```js
module.exports = {
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

除此之外还额外提供了三个配置：

- **test：** 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
- **priority：** 表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
- **reuseExistingChunk：** 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。

**参考资料：**

[webpack4——SplitChunksPlugin使用指南](https://blog.csdn.net/qq_26733915/article/details/79458533)

[webpack 4 Code Splitting 的 splitChunks 配置探索](https://imweb.io/topic/5b66dd601402769b60847149)



### **DllPlugin** 、DllReferencePlugin、AutoDllPlugin

DllPlugin 和 DllReferencePlugin 提供了以大幅度提高构建时间性能的方式拆分软件包的方法。

它们将特定的第三方包提前构建，在页面中以 script 标签的形式引入。这不仅能够使得 vendor 文件可以大幅度减小，也极大的提高了构件速度。

它们 **只对第三方包打包一次。** 也就是说，只要不是增加或减少或更新了包文件，以后不需要对这么文件打包了。

#### DllPlugin、DllReferencePlugin

* 使用 DllPlugin，生成文件清单。

  ```js
  // webpack.dll.config.js
  
  const path = require('path')
  const webpack = require('webpack')
  const vendors = [
      'vue/dist/vue.esm.js',
      'axios'
  ];
  module.exports = {
      // 也可以设置多个入口，多个vendor，就可以生成多个bundle
      entry: {
          vendor: vendors
      },
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
  

在终端运行 `webpack --config webpack.dll.config.js`，生成生成`DLL Bundle`，即`vendor-manifest.json`。

* 使用  DLLReferencePlugin 将 `vendor-manifest.json` 文件中的第三方包打包成一个 Js。

  ```json
  plugins: [
      new webpack.DllReferencePlugin({
          context: path.join(__dirname, '..'),
          manifest: require(path.join(__dirname, '../static/dll/vendor-manifest.json'))
      })
  ]
  ```
  
* 使用 html-webpack-plugin，定义路径变量，在 html 文件用 script 引入。

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

#### AutoDllPlugin

相当于自动完成了  DllReferencePlugin 和 DllPlugin 的工作，并将生成的 Js 注入到 html。

```js
const AutoDllPlugin = require('autodll-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

plugins: [
    new AutoDllPlugin({
        inject: true,
        context: path.join(__dirname, '..'),
        filename: '[name]_[hash].dll.js',
        path: 'res/js',
        plugins: mode === 'online' ? [
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

#### CommonsChunkPlugin 和 DLLPlugin 的区别

CommonsChunkPlugin 在每次编译时，对第三方包文件进行打包，如果项目中加或减了 import 的引入，会生成新的文件。

DLLPlugin 在变量中指定每次编译需要提取的包文件，只要不手动改该变量，就不需要重新编译。

**实际测试情况：**

* DllPlugin、DllReferencePlugin 打包，一般是打包整个文件，而不是按需提取。所以打包出来的文件，体积比 CommonsChunkPlugin 打包出来的更大。

* AutoDllPlugin 打包应避免局部引用。如： `import { childComponent } from 'components'`，AutoDllPlugin 在 build 过程中，无法识别 ` childComponent ` 是 `node_modules` 目录下 `components` 的一个子组件，会它打包到业务的 Js 文件中。

* 开发环境使用 AutoDllPlugin，可以加快编译速度。

* 部分第三方包文件，无法提取。如：vue-awesome-swiper。

**参考资料：**

[实践 DllPlugin 来优化 webpack 打包速度](https://juejin.im/entry/57a6dee4a633bd00604d0e73)



### [webpack-parallel-uglify-plugin](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)

webpackParallelUglifyPlugin 是 UglifyJS 的一个**多进程**的实现。当 webpack 打包多个 Js 文件时，UglifyJS 是逐个压缩并且输出，而webpackParallelUglifyPlugin 则会开启多个进程，把对多个 Js 压缩的工作分配给多个子进程去完成，但是每个子进程还是通过 UglifyJS 来压缩代码。

简单说，就是将多个串行的任务，改成并行执行。

```js
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
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

happypack 是 webpack 的一个插件，目的是通过多进程模型，来加速代码构建。

```js
module.exports = {
    module: {
        rules: [
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
                    resolve('node_modules/webpack-dev-server/client')
                ]
            }
        ]
    }
}
```

替换为：

```js
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: 4})
module.exports = {
    module: {
        rules: [
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
        ]
    },
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
}
```

#### 并发实现后，一定就能提升编译效率吗？

不一定！

父模块和它的依赖模块之间不可以并发。因为只有编译完父文件之后，才能知道它的依赖文件列表。

假设一个项目代码，从入口文件开始，每一个模块只依赖了一个其他的模块，编译器只能一个一个顺序执行，没有并发可行性。

* 一个文件引入多个依赖，多个依赖之间可以并发；
* 每个依赖引入多个子依赖，这些依赖和子依赖之间，只要没有直接的依赖链，都可以并发。

**实际测试情况：**

* 对有些加载器不友好。如：file-loader、url-loader 。

* 若使用了 vux-loader，happypack 对 vue-loader 无效。

* 实测：速度提升有限。

**参考资料：**

[HappyPack - Webpack 的加速器](http://blog.yunfei.me/blog/happypack_webpack_booster.html)



### Externals方法

webpack 提供 Externals 的方法，可以通过外部引用的方法，引入第三方库。

```html
<!--index.html-->
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.js"></script>
```

```js
// webpack.config.js
module.exports = {
    externals: {
        vue: 'Vue'
    }
}
```

### Resolve方法

resolver 帮助 webpack 找到需要引入的模块代码，这些代码在包含在 ` require/import `语句中。 当打包模块时，webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径。

```js
// webpack.config.js
module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css'],
        modules: [
            path.resolve(dirname, 'node_modules'),
            path.resolve(dirname, 'src')
        ]
    }
}
```

### 合适的devtool 选项

设置 devtool 值来决定项目需不需要生成 `.map` 文件。

```js
// webpack.config.js
module.exports = {
  devtool: 'eval'
}
```

#### devtool 值详解

* **none：**  省略 devtool 选项；

- **eval：** 每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 `//@ sourceURL`；

- **source-map：** 生成一个 SourceMap 文件；

- **hidden-source-map：** 和 source-map 一样，但不会在 bundle 末尾追加注释；

- **inline-source-map：** 生成一个 DataUrl 形式的 SourceMap 文件；

- **eval-source-map：** 每个 module 会通过 `eval()` 来执行，并且生成一个 DataUrl 形式的 SourceMap；

- **cheap-source-map：** 生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 

  sourcemap（譬如 babel 的 sourcemap）；

- **cheap-module-source-map：** 生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。

#### 关键字解答

看似配置项很多， 其实只是五个关键字 `eval、source-map、cheap、module、inline` 的任意组合。

- **eval：** 使用 eval 包裹模块代码；
- **source-map：** 产生`.map`文件；
- **cheap：** 不包含列信息，也不包含 loader 的 sourcemap；
- **module：** 包含 loader 的 sourcemap；
- **inline：** 将 `.map` 作为 DataURI 嵌入，不单独生成 `.map` 文件。这个配置项比较少见。

#### 使用推荐

开发环境推荐使用：

* eval： 每个模块使用eval()和//@ sourceURL执行。主要缺点是，它没有正确显示行号。

* eval-source-map： 每个模块使用eval()执行，而SourceMap作为DataUrl添加到eval()中。最初它是缓慢的，但是它提供快速的重建速度和产生真实的文件。行号被正确映射，因为它被映射到原始代码。它产生了最优质的开发资源。

生产环境推荐使用：

* **none ：省略devtool选项，不触发SourceMap。**

* source-map： 一个完整的 SourceMap 是作为一个单独的文件。



### 总结

* AutoDllPlugin 打包第三插件，构建速度并没有比 commonsChunkPlugin 快，且 AutoDllPlugin 打包出来的 Js 在部分安卓机有兼容问题。未找到原因。

* Happypack 对构建速度的提升有限，并没有网上所说提升 30%~50%；

* webpack-parallel-uglify-plugin 可以明显加快构建速度；

* html-webpack-plugin-for-multihtml 在多页面项目的开发中，可以极大得加快构建速度；

* webpack4 对构建进行了优化，html-webpack-plugin 也可以使用缓存。



### 参考资料

[打破砂锅问到底：详解Webpack中的sourcemap](https://segmentfault.com/a/1190000008315937)

[Webpack 打包优化之体积篇](https://www.jeffjade.com/2017/08/06/124-webpack-packge-optimization-for-volume/)

[Webpack 打包优化之速度篇](https://www.jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/)

