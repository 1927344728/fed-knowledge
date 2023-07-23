## webpack基础入门篇

本质上，webpack 是一个用于现代 JavaScript 应用程序的**静态模块打包工具**。当 webpack 处理应用程序时，它会在内部从一个入口点构建一个 依赖图（dependency graph），然后将你项目中所需的每一个模块组合成一个 bundles，它们均为静态资源，用于展示你的内容。

![image-20220329191851584](https://tva1.sinaimg.cn/large/e6c9d24ely1h0qyyitc49j20tt0csaat.jpg)

模块打包，通俗地说就是：找出模块之间的依赖关系，按照一定的规则把这些模块组织合并为一个 JavaScript 文件，当然，也可以折分成不同类型的文件。webpack 认为一切都是模块，JS 文件、CSS 文件、jpg/png 图片等等都是模块。

webpack 的一些核心概念：

* 入口（entry）：指定要处理的一个或多个模块，如：一个 JS 文件；
* 输出（output）：指定模块处理完成后的输出位置；
* loader：载入处理程序，用于转换某些类型的模块，如：一个 vue 文件转换为 JS 文件；
* 插件（plugin）：用于处理模块，执行的任务范围比 loader 更广；
* 模式（mode）：指定不同环境，如：development|production|none 之中的一个，webpack 会在根据不同环境做一些相应的内置优化；
* 浏览器兼容性（browser compatibility）：webpack 支持所有符合 ES5 标准 的浏览器（不支持 IE8 及以下版本）。webpack 的 import() 和 require.ensure() 需要 Promise。如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要提前加载 polyfill。

### 简单示例

在开始之前，请确保安装了 Node.js，**webpack 是基于 Node.js 开发的**。

安装：`npm i webpack webpack-cli -g`，注意：webpack v4+ 版本，需要安装 CLI。

创建一个主入口模块和一个子模块：

```javascript
// 子模块：src/assets/js/a.js
console.log(1)
```

```javascript
// 主入口模块：src/index.js
import './assets/js/a.js'
console.log(2)
```

webpack 开箱即用，可以无需使用任何配置文件，默认入口起点为 `src/index`，然后会在 `dist/main.js` 输出结果，并且在生产环境开启压缩和优化，但通常，我们创建一个 webpack 配置文件来扩展 webpack 的功能。

webpack 配置文件默认路径是项目根目录下的 webpack.config.js，webpack 会自动使用它，也可以创建在其他路径下，不过，运行时，需要通过 --config 指向该路径。

**注意：** webpack 配置可以是一个对象、一个函数、一个 Promise 或者是一个包含多个 webpack 配置的数组。

```javascript
// build/webpack.demo.config.js
const Path = require('path')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.js'
  },
}
```

终端运行：`webpack --config ./build/webpack.demo.config.js`。

### 入口（entry）

入口起点指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`，但你可以通过 entry 属性，来指定一个（或多个）不同的入口起点。

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

entry 属性有多种定义方式：

* **传字符串：** 指定一个主入口文件，生成一个 bundle。

  ```javascript
  module.exports = {
    entry: './path/to/my/entry/file.js'
  };
  // 等价于
  module.exports = {
    entry: {
      main: './path/to/my/entry/file.js'
    }
  };
  ```

* **传数组：** 指定多个主入口文件，生成一个 bundle。

  ```javascript
  module.exports = {
    entry: ['./src/index.js', './src/assets/js/b.js']
  };
  ```

* **传对象：** 指定多个主入口文件，生成多个 bundle。注意：output 属性的 fileName 需指定不同名称。

  ```javascript
  module.exports = {
    entry: {
      main: './src/index.js',
      otherB: './src/assets/js/b.js'
    },
    output: {
      filename: '[name]-[hash:16]-[id].js'
    }
  }
  ```

  **注意：** **如果对象的 key 带有斜杠（ `/`），则会被解析为目录。**

  ```javascript
  module.exports = {
    entry: {
      'main/assets/index': './src/index.js',
    }
  }
  ```

  最终生成目录：

  ```shell
  | - dist
  | | - main
  | | | - assets
  | | | | - index.js
  ```

* **传函数或者 Promise**。

### 输出（output）

output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主入口文件输出的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist ` 文件夹中。

```javascript
const path = require('path');
module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

filename 和 path 属性告诉 webpack bundle 的名称，以及 bundle 生成到哪里。

**注意：** 即使有多个 entry 起点，也只能指定一个 output 配置。

#### filename

filename 用于指定每个输出 bundle 的名称。这些 bundle 将写入到 path 选项指定的目录下。

如果 entry 属性配置了多个入口文件，则应该使用占位符来确保每个文件具有唯一的名称。

可以使用的占位符：

| 模板        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| [hash]      | 模块标识符的 hash。和整个项⽬的构建相关，只要项⽬⽂件有修改，整个项⽬构建的 hash 值就会更改。 |
| [chunkhash] | chunk 内容的 hash。                                          |
| [name]      | 模块名称                                                     |
| [id]        | 模块标识符                                                   |
| [query]     | 模块的 query，例如，文件名 `?` 后面的字符串                  |

[hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。或者，通过指定 hashDigestLength 属性在全局配置长度。

filename 还可以是一个函数，返回一个可包含占位符的字符串。

#### chunkFilename

chunkFilename 用于指定非入口 chunk 文件的名称。

默认使用 `[id].js` 或从 filename 属性中推断出的值（[name] 会被预先替换为 [id] 或 [id].）。

**注意：** 这些文件名需要在运行时 根据 chunk 发送的请求去生成。因此，需要在 webpack 运行时输出 bundle 值时，将 chunk id 的值对应映射到占位符（如 [name] 和 [chunkhash]）。这会增加文件大小，并且在任何 chunk 的占位符值修改后，都会使 bundle 失效。

#### path

path 用于指定文件输出的路径，是表示一个绝对路径的字符串，默认值是当前根目录下的 `./dist`。

```javascript
const Path = require('path')
module.exports = {
  output: {
    filename: '[name]-[hash:16]-[id].js',
    path: Path.resolve(__dirname, '../abcd/assets')
  }
}
```

#### publicPath

publicPath 用于指定在浏览器中所引用的输出文件的路径，也就是说 HTML 文档中 script 标签 src 属性的路径，可以是相对路径（相对于 HTML 页面解析）、相对于服务的路径（相对于服务器域名）、相对于协议的路径（协议取决于当前访问页面的协议）、绝对路径。

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    // publicPath: './assets/js', // 相对路径
    // publicPath: '/assets/js', // 相对于服务的路径
    // publicPath: '//cdn.example.com', // 相对于协议的路径
    publicPath: 'https://cdn.example.com', // 绝对路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

最终中 HTML 中注入资源：

```html
<script src="https://cdn.example.com/main.js"></script>
```

如果在编译时，不知道最终输出文件的 publicPath 是什么地址，则可以将其留空，并且在运行时通过入口起点文件中的 __webpack_public_path__ 动态设置。

```javascript
__webpack_public_path__ = myRuntimePublicPath;
```

#### library

library 的作用取决于 libraryTarget 选项的值。libraryTarget 的默认选项是 `var`，所以如果使用以下配置选项：

```javascript
module.exports = {
  output: {
    library: 'MyLibrary'
  }
}
```

如果生成的输出文件，是在 HTML 页面中作为一个 script 标签引入，则变量 MyLibrary 将与入口文件的返回值绑定，在浏览器中可以通过 `window.MyLibrary` 访问。

**注意：** 如果 entry 是一个数组，那么只会暴露数组中的最后一个模块；如果是一个对象，可以使用 array 语法暴露多个变量。

```javascript
module.exports = {
  output: {
    library: ['MyLibrary', "[name]"]
  }
}
```

从 webpack 3.1.0 开始，你可以将 library 指定为一个对象，用于给每个 target 起不同的名称：

```javascript
module.exports = {
  output: {
    library: {
      root: 'MyLibrary',
      amd: 'my-library',
      commonjs: 'my-common-library'
    },
    libraryTarget: 'umd'
  }
}
```

#### libraryExport

libraryExport 用于指定 libraryTarget 需要导出的模块（即上面 library 暴露的变量包含的对象），默认值是 undefined。如果 libraryTarget 值是空字符串，将导出整个命名空间对象。

下例演示了 `libraryTarget: 'var'`  下的作用：

* **libraryExport: 'default'：** 暴露默认导出，即 `export default` 中的内容；
* **libraryExport: 'MyModule'：** 暴露指定的模块，即 `export const MyModule` 中的内容；
* **libraryExport: ['MyModule', 'MySubModule']：** 数组被解释为模块的路径，即 `export const MyModule.MySubModule` 中的内容。

#### libraryTarget

libraryTarget 用于配置如何暴露 library，默认值 `var` 。**注意，此选项与 library 的值一同使用。**

以下示例，都假定 `library："MyLibrary"`：

* 暴露为一个变量（var）：默认值，当 library 加载完成，入口起点的返回值将分配给变量 MyLibrary。

  ```javascript
  var MyLibrary = _entry_return_;
  ```

* 暴露为一个变量（assign）：当 library 加载完成，入口起点的返回值将分配给一个隐含的全局变量，可能会潜在地重新分配到全局中已存在的值（谨慎使用）。

  ```javascript
  MyLibrary = _entry_return_;
  ```

* 通过在对象上赋值暴露（this|window|global|commonjs）：入口起点的返回值将分配给 `this|window|global|exports` 的一个属性（属性名称由 library 定义）。

  ```javascript
  this['MyLibrary'] = _entry_return_;
  window['MyLibrary'] = _entry_return_;
  global['MyLibrary'] = _entry_return_;
  ```
  
* commonjs：入口起点的返回值将分配给 exports 对象。这个名称也意味着，模块用于 CommonJS 环境。

  ```javascript
  exports['MyLibrary'] = _entry_return_;
  require('MyLibrary').doSomething();
  ```

* 模块定义系统（commonjs2）：入口起点的返回值将分配给 `module.exports` 对象，也意味着模块用于 CommonJS 环境。**注意：** 此模式下，无需再设置 library 的值。

  ```javascript
  module.exports = _entry_return_;
  require('MyLibrary').doSomething();
  ```

* 模块定义系统（amd）：将 library 暴露为 AMD 模块。

  ```javascript
  define('MyLibrary', [], function() {
    return _entry_return_;
  });
  require(['MyLibrary'], function(MyLibrary) {
  });
  ```

* 模块定义系统（amd-require）：将 library 暴露为一个立即执行的 AMD 模块。**注意：** 此模式下，无需再设置 library 的值。

* 模块定义系统（umd）：将 library 暴露为所有的模块定义下都可运行的方式。它将在 CommonJS、AMD 环境下运行，也可以将模块导出到 global 下的变量。

* 其他 Targets（jsonp）：将入口起点的返回值，包裹到一个 jsonp 包装容器中。

  ```javascript
  MyLibrary(_entry_return_);
  ```

#### sourceMapFilename

sourceMapFilename 用于向硬盘写入一个输出文件，只在 devtool 启用了 SourceMap 选项时才使用。默认使用 `[file].map`。

可以使用 filename 中的 `[name]、[id]、[hash]、[chunkhash]` 替换符号。除此之外，还可以使用 `[file]` 占位符（模块文件名称）、`[filebase]` 占位符（模块路径中的文件名）。

#### sourcePrefix

sourcePrefix 用于修改输出 bundle 中每行的前缀。

注意，默认情况下使用空字符串。使用一些缩进会看起来更美观，但是可能导致多行字符串中的问题。

```javascript
module.exports = {
  output: {
    sourcePrefix: '\t'
  }
};
```

#### 其他属性

* **auxiliaryComment：** 与 `output.library` 和 `output.libraryTarget` 一起使用，允许用户向导出容器中插入注释。
* **chunkLoadTimeout：** chunk 请求到期之前的毫秒数，默认为 120 000。从 webpack 2.6.0 开始支持。
* **crossOriginLoading：** 只用于 target 是 web，使用了通过 script 标签的 JSONP 来按需加载 chunk。启用 cross-origin 属性 加载 chunk，可接收值： false | anonymous | use-credentials。
* **jsonpScriptType：** 允许自定义 script 的类型，webpack 会将 script 标签注入到 DOM 中以下载异步 chunk，可接收值：text/javascript（默认） | module（与 ES6 就绪代码一起使用）。
* **devtoolModuleFilenameTemplate：** 此选项仅在 「devtool 使用了需要模块名称的选项」时使用。自定义每个 source map 的 sources 数组中使用的名称。可以通过传递模板字符串（template string）或者函数来完成。
* **devtoolFallbackModuleFilenameTemplate：** 当上面的模板字符串或函数产生重复时使用的备用内容。
* **devtoolNamespace：** 此选项确定 devtoolModuleFilenameTemplate 使用的模块名称空间。未指定时的默认值为：`output.library`。在加载多个通过 webpack 构建的 library 时，用于防止 source map 中源文件路径冲突。
* **hashDigest：** 在生成 hash 时使用的编码方式，默认为 `hex`。支持 Node.js `hash.digest` 的所有编码。对文件名使用 `base64`，可能会出现问题，因为 base64 字母表中有 / 字符。同样，`latin1` 规定可以含有任何字符。
* **hashDigestLength：** 散列摘要的前缀长度，默认为 20。
* **hashFunction：** 散列算法，默认为 `md4`。支持 Node.JS `crypto.createHash` 的所有功能。从 4.0.0-alpha2 开始，hashFunction 现在可以是一个返回自定义 hash 的构造函数。
* **hashSalt：** 一个可选的加盐值，通过 Node.JS `hash.update` 来更新哈希。
* **hotUpdateChunkFilename：** 自定义热更新 chunk 的文件名。可选的值参考 output.filename 选项，占位符只能是 [id] 和 [hash]，默认值是：`[id].[hash].hot-update.js`。
* **hotUpdateFunction：** 只在 target 是 web 时使用，用于**加载热更新**的 JSONP 函数。JSONP 函数用于异步加载热更新 chunk。
* **hotUpdateMainFilename：** 自定义热更新的主文件名。可选的值参考 output.filename 选项，占位符只能是 [hash]，默认值是：`[hash].hot-update.json`。
* **jsonpFunction：** 只在 target 是 web 时使用，用于**按需加载** chunk 的 JSONP 函数。JSONP 函数用于异步加载 chunk，或者拼接多个初始 chunk（SplitChunksPlugin、AggressiveSplittingPlugin）。
* **pathinfo：** 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项在 development 模式时的默认值是 true，而在 production 模式时的默认值是 false。
* **strictModuleExceptionHandling：** 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存（require.cache）中删除这个模块。出于性能原因，默认为 false。
* **umdNamedDefine：** 当使用了 `libraryTarget: "umd"`、`library: 'MyLibrary'`，设置 `umdNamedDefine: true`，会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 `define`。

### 模块（module）

module 决定了**如何处理项目中的不同类型的模块**。

#### noParse

noParse 指定 webpack 不需要解析的文件。这些文件中不应该含有 import、require、define 的调用，或任何其他导入机制。

```javascript
module.exports = {
  module: {
    noParse: 'jquery',
    noParse: ['jquery', 'lodash'],
    noParse: /jquery|lodash/,
    noParse: (content) => /jquery|lodash/.test(content)
  }
};
```

#### rules

rules 用于配置一组规则，指定模块的处理方式，即为不同模块指定相应的加载器（loader）或者解析器（parser）。

每个规则可以分为三部分：

* 条件（condition）：指定模块的匹配规则，有两种值：

  * resource：请求文件的绝对路径。
  * issuer：导入请求文件的模块的绝对路径。

  例如：从 `app.js` 导入 `./style.css`，resource 指的是 `style.css` 文件的路径 ，而 issuer 指的是 `app.js` 文件的路径。

  在规则中，属性 test、include、exclude、resource 是对 resource 的匹配，而属性 issuer 是对 issuer 的匹配。**当使用多个条件时，所有条件都匹配。**

* 结果（result）：为模块指定加载器（loader）或者解析器（parser）；

* 嵌套规则（nested rule）：每个规则可以使用属性 rules 和 oneOf 指定更细粒度的规则。

### 加载器（loader）

webpack 只能理解 JavaScript 和 JSON 文件。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

> 注意，loader 能够 import 任何类型的模块，这是 webpack 特有的功能，其他打包程序或任务执行器的可能并不支持。这种语言扩展是很有必要的，因为这可以使开发人员创建出更准确的依赖关系图。

#### 使用 loader

在应用程序中，有两种使用 loader 的方式：配置方式、内联方式。如果指定多个 loader，loader 从右到左（或从下到上）执行。

##### 配置方式

配置方式是在 webpack.config.js 文件中指定 loader。如果指定了多个 loader，则是**从下到上**执行。

loader 配置有两个属性：

* test：用于标识出应该被对应的 loader 进行转换的某个或某些文件；
* use：表示进行转换时，应该使用哪个 loader。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  }
};
```

以上配置中，对一个单独的 module 对象定义了 rules 属性，里面包含两个必须属性：test 和 use。这告诉 webpack 编译器如下信息：

> “嘿，webpack 编译器，当你碰到「在 `require()`/`import` 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先 **使用** `raw-loader` 转换一下。”

> 请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，`/\.txt$/` 与 `'/\.txt$/'`/ `"/\.txt$/"` 不一样。前者指示 webpack 匹配任何以 .txt 结尾的文件，后者指示 webpack 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合你的意图。

#### 内联方式

内联方式是在每个 import 语句或任何等同于 import 的方法 中指定 loader，使用 `!` 将资源中的 loader 分开。如果指定了多个 loader，则是**从右到左**执行。

```shell
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过为内联 import 语句添加前缀，可以覆盖配置中的所有 loader、preLoader 和 postLoader：

* 使用 `!` 前缀，将禁用所有已配置的 normal loader（普通 loader）。
* 使用 `!!` 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）。
* 使用 `-!` 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders。

```javascript
import Styles from '!style-loader!css-loader?modules!./styles.css';
import Styles from '!!style-loader!css-loader?modules!./styles.css';
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```


另外，选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`。

#### rules条件

rules 条件可以是：

- 字符串：匹配字符串，值可以是目录或文件的绝对路径。
- 正则表达式：test 输入值。
- 函数：指定一个函数，返回一个真值以匹配。
- 条件数组：至少一个匹配条件。
- 对象：匹配所有属性。每个属性都有一个定义行为。

条件配置：

* test：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。
* include：匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。
* exclude：排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。
* and：必须匹配数组中的所有条件。
* or：匹配数组中任何一个条件。
* not：必须排除这个条件。

**注意：** test、include、exclude 是 Rule.resource.[test|include|exclude] 的简写，如果在 Rule 提供了该选项，就不能再提供 Rule.resource。

**注意：** 当使用多个条件时，所有条件都要匹配。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'app/styles'),
          path.resolve(__dirname, 'vendor/styles')
        ]
      }
    ]
  }
};
```

**resourceQuery** 用于指定资料的查询条件。比如：`import Foo from './foo.css?inline'`，可以如下 resourceQuery 匹配：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        resourceQuery: /inline/,
        use: 'url-loader'
      }
    ]
  }
}
```

#### use

use 用于为一个模块**指定一组加载器**，值可以是表示加载器的字符串或对象（包含加载器选项）数组，也可以是一个返回加载器数组的函数。

传递字符串（如：`use: [ 'style-loader' ]`）是 loader 属性的简写方式（如：`use: [ { loader: 'style-loader'} ]`）。

多个加载器之间可以链接，这些加载器**将从右到左（由后往前）应用**。

```javascript
module.exports = {
  module: {
    rules: [
      {
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'less-loader',
            options: {
              noIeCompat: true
            }
          }
        ]
      }
    ]
  }
};
```

以上配置，表示依次调用 less-loader、css-loader、style-loader 加载器。

**注意：** Rule.loader 是 Rule.use: [ { loader } ] 的简写，Rule.options 和 Rule.query 是 Rule.use: [ { options } ] 的简写。

#### parser

parser 用于禁用、启用或配置解析器。默认的插件解析器选项：

```javascript
module.exports = {
  module: {
    rules: [
      {
        parser: {
          amd: false, // 禁用 AMD
          commonjs: false, // 禁用 CommonJS
          system: false, // 禁用 SystemJS
          harmony: false, // 禁用 ES2015 Harmony import/export
          requireInclude: false, // 禁用 require.include
          requireEnsure: false, // 禁用 require.ensure
          requireContext: false, // 禁用 require.context
          browserify: false, // 禁用特殊处理的 browserify bundle
          requireJs: false, // 禁用 requirejs.*
          // 禁用 __dirname、__filename、module、require.extensions、require.main 等。
          node: false,
          node: {...} // 在模块级别(module level)上重新配置 node 层(layer)
        }
      }
    ]
  }
}
```

#### oneOf

oneOf 用于配置规则数组，当规则匹配时，只使用第一个匹配规则。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader'
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
          }
        ]
      }
    ]
  }
};
```

#### 其他 rule 属性

* **enforce：** 用于指定 loader 种类，默认是普通 loader，可选值为 pre | post，还有一个额外的种类**行内 loader**，即应用在 import/require 行内。

  * 所有普通 loader 可以通过在请求中加上 `!` 前缀来忽略（覆盖）。

  * 所有普通和前置 loader 可以通过在请求中加上 `-!` 前缀来忽略（覆盖）。

  * 所有普通，后置和前置 loader 可以通过在请求中加上 `!!` 前缀来忽略（覆盖）。
  * 不应该在行内 loader 使用 `!` 前缀，因为它们是非标准的。

* **issuer：** 用于指定一个匹配导入请求文件的模块的绝对路径的条件。

* **type：** 用于设置匹配模块的类型，可选择值有 javascript/auto | javascript/dynamic | javascript/esm | json | webassembly/experimental。这将阻止 defaulrules 及其默认的导入行为的发生。

  例如：通过自定义加载器加载一个 `.json` 文件，你需要将类型设置为 javascript/auto，以绕过 webpack 内置的 json 导入。

### 插件（plugin）

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化、资源管理、注入环境变量等各种任务。

**插件目的在于解决 loader 无法实现的其他事。**

想要使用一个插件，你只需要 `require()` 它，然后把它添加到 plugins 选项中。多数插件可以通过选项自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

在上面的示例中，`html-webpack-plugin` 为应用程序生成 HTML 一个文件，并自动注入所有生成的 bundle。

### 解析（resolve）

resolve 用于设置**模块如何被解析**。

#### alias

创建 import 或 require 的别名，来确保模块引入变得更简单。

```javascript
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
}
```

现在，可以 `@` 表示 `src` 目录所在的路径，这在替换「在导入时使用相对路径」非常有用。

```javascript
import utils from '../../../utils/index.js';
import utils from '@/utils/index.js';
```

#### extensions

自动解析确定的扩展。默认值为：['.wasm', '.mjs', '.js', '.json']。

#### mainFields

当从 npm 包中导入模块时（例如，`import * as D3 from 'd3'`），此选项将决定在 `package.json` 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同。

target 属性设置为 webworker、web 或者没有指定，默认值为：['browser', 'module', 'main']。

对于其他任意的 target（包括 node），默认值为：['module', 'main']。

#### mainFiles

解析目录时要使用的文件名。默认值为：['index']。

#### modules

告诉 webpack 解析模块时应该搜索的目录。默认值为：['node_modules']。

绝对路径和相对路径都能使用：使用绝对路径，只能在给定目录中搜索；使用相对路径，则会在项目中用类似于 Node 查找 'node_modules' 的方式进行查找。

#### plugins

指定使用的额外的解析插件列表，比如 DirectoryNamedWebpackPlugin。

#### resolveLoader

resolveLoader 选项与上面的 resolve 对象的属性集合相同，但仅用于解析 webpack 的 loader 包。

```javascript
module.exports = {
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  }
};
```

**注意：** 可以为加载器指定别名，比如：

```javascript
module.exports = {
  resolveLoader: {
    alias: {
      txt: 'raw-loader'
    }
  }
};
```

使用 `import txt!templates/demo.txt`  相当于 `import raw-loader!templates/demo.txt`。

此外，可以通过 resolveLoader 为加载器指定扩展名或后缀， 但一般建议使用全名。

```javascript
module.exports = {
  resolveLoader: {
    moduleExtensions: ['-loader']
  }
}
```

#### 其他属性

* aliasFields：指定一个字段（例如 browser），该 browser 字段通常位于项目源代码树根目录的`package.json` 文件。
* descriptionFiles：指定用于描述的 JSON 文件。默认：['package.json']。
* enforceExtension：是否允许文件无扩展名。
* enforceModuleExtension：对模块是否需要使用的扩展（例如 loader）。
* unsafeCache：主动缓存模块，但并不安全，默认值为：true，值可以是布尔值、正则表达式、正则表达式数组。
* symlinks：是否将符号链接解析到它们的符号链接位置。
* cachePredicate：指定一个决定模块是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象，必须返回一个布尔值。

### 外部扩展（externals）

externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。相反，所创建的 bundle 依赖于那些存在于用户环境中的依赖。

简单说，就是防止将某些 import 的包打包到 bundle 中，而是在运行时再去从外部获取这些扩展依赖。

比如：在 HTML 文件中，从 CDN 引入 jQuery：

```html
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
```

在 webpack 配置：

```javascript
module.exports = {
  externals: {
    jquery: 'jQuery'
  }
};
```

这样，最终打包出来的 bundle，不会包含 jQuery，但在项目中，仍可以引入 jQuery 模块：

```javascript
import $ from 'jquery';
$('.my-element');
```

具有外部依赖的 bundle 可以在各种模块上下文（CommonJS、AMD、全局变量、ES2015 模块）中使用。

* root：可以通过一个全局变量访问 library（例如，通过 script 标签）。
* commonjs：可以将 library 作为一个 CommonJS 模块访问。
* commonjs2：和上面的类似，但导出的是 module.exports.default。
* amd：类似于 commonjs，但使用 AMD 模块系统。

```javascript
module.exports = {
  externals: {
    jquery: 'jQuery',
    // bundle 只引用 ./math 模块下的 subtract 的子集。
    subtract: ['./math', 'subtract'],
    
		// 对象仅用于 libraryTarget: 'umd'。
    lodash : {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // 指向全局变量
    },
    subtract : {
      root: ['math', 'subtract']
    }
  }
};
```

jQuery 将被视为全局变量。lodash 可以在 AMD 和 CommonJS 模块系统中通过 `lodash` 访问，但在全局变量形式下用` _` 访问。subtract 可以通过 `window['math']['subtract']` 访问。

另外，还可以配置函数、正则表达式来将依赖从输出 bundle 中排除，并且可以采用组合形式。

```javascript
module.exports = {
  externals: [
    function(context, request, callback) {
      if (/^yourregex$/.test(request)){
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
    /^(jquery|\$)$/i
  ]
};
```

### 模式（mode）

通过选择 `development | production | none` 之中的一个，来设置 `mode` 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 `production`。

```javascript
module.exports = {
  mode: 'production'
};
```

启用不同模块，webpack 会对一些属性使用不同的默认值。

* development：会将 DefinePlugin 中 `process.env.NODE_ENV` 的值设置为 `development`。启用 NamedChunksPlugin 和 NamedModulesPlugin。
* production：会将 DefinePlugin 中 `process.env.NODE_ENV` 的值设置为 `production`。启用 FlagDependencyUsagePlugin、FlagIncludedChunksPlugin、ModuleConcatenationPlugin 等。
* none：退出任何默认优化选项。

### 开发中（devServer）

devServer 用于为开发环境提供一些配置，请不要在生产环境中使用！开发环境是 mode 值为 'development'。

开发环境下，webpack 启动了内置的 webpack-dev-server，提供了一个简单的 web server，并且具有实时重新加载功能。

#### contentBase

contentBase 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要。devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。

**推荐使用一个绝对路径。**

默认情况下，将使用当前工作目录作为提供内容的目录。将其设置为 false 以禁用 contentBase。

#### disableHostCheck

disableHostCheck 用于设置是否绕过主机检查。

#### filename

filename 用于惰性模式中，减少编译。 默认在惰性模式，每个请求结果都会产生全新的编译。使用 filename，可以只在某个文件被请求时编译。

```javascript
module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    lazy: true, // 惰性模式
    filename: 'bundle.js' // 非惰性模式时没有效果
  }
}
```

现在只有在请求 `/bundle.js` 时候，才会编译 bundle。

#### headers

在所有响应中添加首部内容。

#### historyApiFallback

当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。

historyApiFallback 默认禁用，可以设置布尔值启用\禁用，也可以传入一个对象进行更详细控制：

```javascript
module.exports = {
  devServer: {
    // historyApiFallback: true
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    }
  }
}
```

#### host

host 指定使用一个域名，默认是 localhost。如果希望**服务器外部访问，可指定 0.0.0.0**。

#### https

默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：

```javascript
module.exports = {
  devServer: {
    // https: true // 使用了自签名证书
    https: {
      // 使用自己提供的证书
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

#### inline

在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式。这意味着一段处理实时重载的脚本被插入到 bundle 中，并且构建消息将会出现在浏览器控制台。

也可以使用 iframe 模式，它在通知栏下面使用 iframe 标签，包含了关于构建的消息。

```javascript
module.exports = {
  devServer: {
    inline: false
  }
}
```

#### lazy

lazy 用于设置是否启用惰性模式。当启用 lazy 时，dev-server 只有在请求时才编译 bundle。这意味着 webpack 不会监视任何文件改动。我们称之为惰性模式。

#### overlay

当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用。

```javascript
module.exports = {
  devServer: {
    // overlay: true // 只显示编译器错误
    overlay: {
      // 显示警告和错误
      warnings: true,
      errors: true
    }
  }
};
```

### proxy

proxy 用于配置跨域代理，如果服务端 API 与浏览器访问的页面不在同一域名，代理某些 URL 会很有用。

dev-server 使用了非常强大的 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 包处理请求代理。

比如：浏览器访问本地页面 `localhost:9600/index.html`，而 api 在 `localhost:3000` 域名下，你可以这样启用代理：

```javascript
// localhost:9600/api/users 会被代理到 http://localhost:3000/api/users
module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```

以上是简单示例，实际上 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 配置允许修改许多参数：重写请求路径、重写 Cookie 的域名和路径等。

```javascript
// localhost:9600/api/users 会被代理到 http://localhost:3000/users
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // 将主机头的来源更改为目标 URL
        // pathFilter: ['/api', '/ajax', '/someotherpath'], // 过滤路径，采用 Glob 模式匹配
        pathRewrite: { // 重写目标的 url 路径。可以是对象，也可以是函数或异步函数。
          '^/oldApi': '/newApi', // 重写路径
          '^/api': '',           // 移除路径
          '^/': '/path/',        // 添加路径
        },
        cookieDomainRewrite: { // 重写响应头部 set-cookie 域名，可以是布尔值、字符串、对象
          "old.domain": "new.domain",
        },
        // cookieDomainRewrite: "new.domain", // 要删除域，可使用空字符串（""）
        // cookiePathRewrite: '' // 重写响应头部 set-cookie 路径，可取值与 cookieDomainRewrite 类似
      }
    }
  }
};
```

#### publicPath

publicPath 用于指定哪些打包文件可在浏览器中访问，默认值是 `/`。

**注意：** publicPath 值总是以斜杠（`/`）开头和结尾。

假设服务器运行在 http://localhost:8080 并且 filename 选项被设置为 bundle.js，可以通过 http://localhost:8080/bundle.js 访问。

修改 publicPath，将 bundle 放在指定目录下：

```javascript
module.exports = {
  devServer: {
    publicPath: '/assets/'
  }
};
```

现在可以通过 http://localhost:8080/assets/bundle.js 访问 bundle。

也可以使用一个完整的 URL，这是 **模块热替换** 所必需的：

```javascript
module.exports = {
  devServer: {
    publicPath: 'http://localhost:8080/assets/'
  }
};
```

#### writeToDisk

writeToDisk 用于告诉 devServer 将生成的资源写入磁盘。

可以是一个布尔值，也可以是一个函数指定将哪些文件写入磁盘。

```javascript
module.exports = {
  devServer: {
    writeToDisk: (filePath) => {
      return /superman\.css$/.test(filePath);
    }
  }
}
```

#### 其他属性

* **open：** 布尔值，是否在服务启动后打开浏览器，默认 false。也可以传入字符串，指定用什么浏览器打开。注意：同一浏览器在不同平台的名称可能不一样，比如 Chrome 浏览器， 在 macOS 是 “Chrome”，在 Linux是 “google-chrome”，在 Windows 上是 “chrome”。
* **openPage：** 字符串，指定打开浏览器时的导航页面。
* **port：** 数值，指定要监听请求的端口号。
* **index：** 被作为索引文件的文件名，默认值为 index.html。
* **after：** 函数，在服务内部的所有其他中间件之**后**， 提供执行自定义中间件的功能。
* **allowedHosts：** 数组，添加域名的白名单服务，允许一些开发服务器访问。以 `.` 开头的值可以用作子域通配符。
* **before：** 函数，在服务内部的所有其他中间件之**前**， 提供执行自定义中间件的功能。
* **bonjour**：布尔值，是否通过 [ZeroConf](http://www.zeroconf.org/) 网络广播服务。
* **clientLogLevel：** 可接收值：none | info | error | warning，当使用内联模式时，会在开发工具的控制台显示消息。
* **color：** 布尔值，启用/禁用控制台的彩色输出。
* **compress：** 布尔值，是否启用启用 gzip 压缩。
* **hot：** 布尔值，是否启用 webpack 的模块热替换功能。
* **hotOnly：** 布尔值，构建失败时，是否启用 webpack 的模块热替换功能，
* **info：** 输出 cli 信息，只用于命令行工具。
* **noInfo：** 布尔值，是否隐藏 webpack bundle 信息之类的消息。
* **progress：** 布尔值，将运行进度输出到控制台。
* **public：** 当使用内联模式并代理 dev-server 时，内联的客户端脚本并不总是知道要连接到什么地方。它会尝试根据 window.location 来猜测服务器的 URL，但是如果失败，你需要使用这个配置。
* **quiet：** 布尔值，启用后，除了初始启动信息之外的任何内容都不会被打印到控制台。
* **socket：** 用于监听的 Unix socket（而不是 host）。
* **staticOptions：** 用于对 contentBase 路径下提供的静态文件，进行高级选项配置。
* **stats：** 可接收值 none | errors-only | minimal | normal | verbose，用于精确控制要显示的 bundle 信息。**注意：** 此选项在配置 quiet 或 noInfo 时无效。
* **stdin：** 布尔值，是否在 stdin 结束时关闭服务。
* **useLocalIp：** 布尔值，是否允许浏览器使用本地 IP 打开。
* **watchContentBase**：布尔值，是否监听 devServer.contentBase 选项下的文件。
* **watchOptions：** 与监视文件相关的控制选项。

### 其他 webpack 配置

#### context

context 用于设置基础目录，一个绝对路径，用于从配置中解析入口起点（entry point）和 loader。默认使用当前执行目录，即运行 webpack 时的目录路径。

#### target（构建目标）

target 用于告知 webpack，输出的文件是在什么环境使用的，默认值为：web，其值可以是一个字符串，或者是一个返回字符串和指定插件的函数。

* async-node：编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）。
* electron-main：编译为 Electron 主进程。
* electron-renderer：编译为 Electron 渲染进程，使用 JsonpTemplatePlugin、FunctionModulePlugin 来为浏览器环境提供目标，使用 NodeTargetPlugin 和 ExternalsPlugin 为 CommonJS 和 Electron 内置模块提供目标。
* node：编译为类 Node.js 环境可用（使用 Node.js require 加载 chunk）。
* node-webkit：编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 nw.gui 导入（实验性质）。
* web：编译为类浏览器环境里可用**（默认）**。
* webworker：编译成一个 WebWorker。

### 应用示例

#### [raw-loader](https://www.npmjs.com/package/raw-loader)

允许将文件作为字符串注入到另一个文件。

```html
<script>${require(' raw-loader!babel-loader!. /meta.html')}</script>
<script>${require('raw-loader!babel-loader!../node_modules/common.js')}</script>
```

#### [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)

这个插件非常简单，只是封装了另外两个 Webpack 插件来完成繁重的工作：

* 在运行时修改 webpack 配置，将模块添加到 externals 属性；
* 运行 copy-webpack-plugin 将模块资源复制到输出路径（必需是已安装的、在 node_modules 的模块）；
* 运行 html-webpack-include-assets-plugin 将模块添加到 HTML 文件中。

```javascript
const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'vue',
          entry: 'https://unpkg.com/vue@3/dist/vue.global.js',
          global: 'Vue',
        },
        {
          // /node_modules/atob/node-atob.js
          module: 'atob',
          entry: 'node-atob.js',
          global: 'AToB',
        },
      ]
    }),
  ]
}
```

最终会将 `node_modules/atob/node-atob.js`  文件复制到 vendor 文件夹下，并在 HTML 注入：

```html
<!--index.html-->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="vendor/atob/node-atob.js"></script>
<script src="index.js"></script>
```

#### eslint 自动修复

```javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    if (!process.env.NODE_ENV === "production") {
      config.module
        .rule("eslint")
        .use("eslint-loader")
        .options({
          fix: true
        });
    }
  }
};
```

### 相关问题

#### Webpack 和 Grunt、Gulp 的区别？

Grunt、Gulp 主要是解决重复任务的问题。比如: 压缩、编译 less、sass、地址添加 hash、替换等。

> Grunt 官网中的一句话：
>
> 自动化。对于需要反复重复的任务，例如压缩（minification）、编译、单元测试、linting等，自动化工具可以减轻你的劳动，简化你的工作。

Webpack 作者 Tobias 回复与 Grunt、Gulp、NPM 脚本的比较。

> Tobias： NPM 脚本对我而言足矣。实际上，说 webpack 是 Grunt/Gulp 的替代器并不完全准确。Grunt 和 Gulp 以及 NPM 脚本都是任务执行程序。
>
> Webpack是**模块打包程序**。这两类程序的目标不一样。但 webpack 简化了必须 “过度使用” Grunt 和 Gulp 和NPM 脚本才能实现的 Web 开发任务也是事实。NPM 脚本才是 Grunt 和 Gulp 的替代品。
>
> 不过，除了纯粹的构建之外，任务运行程序也有存在的理由，比如部署、代码检查、版本管理，等等。

**grunt、gulp 思路：** 遍历源文件 -> 按规则匹配文件 -> 执行任务。做不到按需加载，对打包的资源，是否用到，打包过程不关心。

**webpack 思路：** 入口 -> 模块依赖加载 -> 依赖分析 ->【打包】。在加载、分析、打包的过程中，可以针对性的做一些解决方案。比如：code split（拆分公共代码）。

webpack 更像一套前端工程化解决方案。利用强大插件机制，解决前端静态资源依赖管理的问题。

**注意 Grunt 与 Gulp 性能比较：** Grunt 的每个任务处理完成后存放在本地磁盘 `.tmp` 目录中，有本地磁盘的 I/O 操作，会导致打包速度比较慢；而 Gulp 有一个文件流的概念，也就是，每一步构建的结果并不会存在本地磁盘，而是保存在内存中，下一个步骤是可以使用上一个步骤的内存，大大增加了打包的速度。

#### webpack 和 rollup 有什么区别？

rollup 从设计之初就是面向 ES module 的，它诞生时 AMD、CMD、UMD 的格式之争还很火热，作者希望充分利用 ES module 机制，构建出结构扁平，性能出众的类库。

webpack 致力于复杂 SPA 的模块化构建，其优势在于:

- 通过 loader 处理各种各样的资源依赖；
- HMR 模块热替换；
- 代码按需加载；
- 提取公共模块。

rollup 致力于打造性能出众的类库，其优势在于：

- 编译出来的代码可读性好，打包后生成的 bundle 内容十分干净，没有什么多余的代码，只是将各个模块按照依赖顺序拼接起来，所有模块构建在一个函数内, 执行效率更高；
- 编译时依赖处理（rollup）自然比运行时依赖处理（webpack）性能更好。

#### 什么是 webpack 模块？

* ES2015 import 语句；
* CommonJS require() 语句；
* AMD define 和 require 语句；
* css/sass/less 文件中的 @import 语句；
* 样式（url(...)）、HTML 文件图片的 src 属性。

通过 loader，webpack 可以支持以各种语言和预处理器语法编写的模块。loader 描述了 webpack 如何处理非 JavaScript 模块，并且在 bundle 中引入这些依赖_。

#### webpack 如何解析模块路径？

resolver 是一个库，用于帮助 webpack 从每个如 require/import 语句中，找到需要引入到 bundle 中的模块代码的**绝对路径**。 当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径。

使用 enhanced-resolve，webpack 能够解析三种文件路径：

* **绝对路径：** 已是绝对路径，不需要进一步解析。

* **相对路径：** 以 import/require 的资源文件所在的目录为上下文目录，拼接指定的相对路径，以产生模块的绝对路径。

* **模块路径：** 模块将在 `resolve.modules` 中指定的所有目录内搜索，可以通过 resolve.alias 配置路径别名。一旦根据上述规则解析路径后，resolver 将检查路径是否指向文件或目录。

  如果路径指向一个文件：

  * 如果路径具有文件扩展名，则被直接将文件打包。
  * 否则，将使用 `resolve.extensions` 选项作为文件扩展名来解析，此选项告诉 resolver 在解析中能够接受哪些扩展名，例如：`.js, .jsx`。

  如果路径指向一个文件夹：

  * 如果文件夹中包含 package.json 文件，则按照顺序查找 resolve.mainFields 配置选项中指定的字段。通过 package.json 中的第一个字段确定文件路径。
  * 如果不存在 package.json 文件或者 package.json 文件中的 main 字段没有返回一个有效路径，则按照顺序查找 resolve.mainFiles 配置选项中指定的文件名，看是否能在 import/require 目录下匹配到一个存在的文件名。
  * 文件扩展名通过 resolve.extensions 选项，采用类似的方法进行解析。

  webpack 根据构建目标（node|web），为这些选项提供了合理的默认配置。

#### commonjs 和 commonjs2 有什么区别？

两个都是 CommonJS  规范，commonjs 也可称作 commonjs1，导出模块只有 exports 这一种方式，而 commonjs2 还支持 module.exports 这种方式导出模块。module.exports 方式被 Nodejs 和许多其他 CommonJs 实现。

commonjs 属于通过在对象上赋值暴露，commonjs2 属于模块定义系统。

对 Nodejs 而言，exports 只是 module.exports 的一个别名，实际导出的还是 module.exports，不能修改 exports 的指向，相当于：

```javascript
var module = {
    exports: {}
}
var exports = module.exports // 指向 module 的 exports 属性
exports.a = 1 // 允许
exports = {   // 不允许，已经不再指向 module 的 exports 属性
    a: 1
}
```

对于 webpack 的  output.libraryTarget 而言，其导出结果不同：

```javascript
// libraryTarget: 'commonjs'
exports['MyLibrary'] = _entry_return_;

// libraryTarget: 'commonjs2'
module.exports = _entry_return_;
```

### 参考资料

[Webpack 中文文档](https://webpack.docschina.org/)