## 为什么使用PostCSS 处理CSS ？

### postcss是什么？

**PostCSS是一个用 JavaScript 工具和插件转换 CSS 代码的工具。**

`PostCSS`并不是一门语言，而是一个类似于`webpack`的工具，它支持很多插件，来达到便捷的编译效果，组成一个CSS编译/lint/autoprefixer的生态圈。它的作者是[Euil Martians](https://evilmartians.com/)，一家致力于技术研究与网站外包开发的公司。其后端技术栈偏重于Ruby，而前端从 React 到 Node 都有涉猎。

PostCSS 本身是一个功能比较单一的工具。它提供了一种方式用 JavaScript 代码来处理 CSS。它负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。

插件基于 CSS 代码的 AST 所能进行的操作是多种多样的，比如可以支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的 CSS 规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式。从这个角度来说，**PostCSS 的强大之处在于其不断发展的插件体系。**

目前 PostCSS 已经有 200 多个功能各异的插件。开发人员也可以根据项目的需要，开发出自己的 PostCSS 插件。

实际上，PostCSS 的主要功能只有两个：

* 第一个就是前面提到的把 CSS 解析成 JavaScript 可以操作的 AST，
* 第二个就是调用插件来处理 AST 并得到结果。

因此，**不能简单的把 PostCSS 归类成 CSS 预处理或后处理工具。**PostCSS 所能执行的任务非常多，同时涵盖了传统意义上的预处理和后处理。



### 为什么选择postcss？

随着前端工程化的不断完善，CSS 预处理器已经成为项目中不可缺少的部分，很多人在项目技术选型阶段就会先选择一个 CSS 预处理器，绝大部分前端工程的脚手架也内置了一系列的 CSS 预处理的模版。

CSS 预处理器是一个能让你通过预处理器自己独有的语法来生成 CSS 的程序。

市面上有很多 CSS 预处理器可供选择，且绝大多数 CSS 预处理器会增加一些原生 CSS 不具备或不完善的高级特性，这些特性让 CSS 的结构更加具有可读性且易于维护。当前社区代表的 CSS 预处理器 主要有以下几种：

- [Sass](http://sass-lang.com/)：2007 年诞生，最早也是最成熟的 CSS 预处理器，拥有 Ruby 社区的支持和 Compass 这一最强大的 CSS 框架，目前受 LESS 影响，已经进化到了全面兼容 CSS 的 SCSS。
- [Less](http://lesscss.org/)：2009年出现，受 SASS 的影响较大，但又使用 CSS 的语法，让大部分开发者和设计师更容易上手，在 Ruby 社区之外支持者远超过 SASS，其缺点是比起 SASS 来，可编程功能不够，不过优点是简单和兼容 CSS，反过来也影响了 SASS 演变到了 SCSS 的时代，著名的 Twitter Bootstrap 就是采用 LESS 做底层语言的。
- [Stylus](http://stylus-lang.com/)：Stylus 是一个CSS的预处理框架，2010 年产生，来自 Node.js 社区，主要用来给 Node 项目进行 CSS 预处理支持，所以 Stylus 是一种新型语言，可以创建健壮的、动态的、富有表现力的 CSS。比较年轻，其本质上做的事情与 SASS/LESS 等类似，

相比其他的 CSS 预处理器，postcss 优势主要体现在以下几个方面：

- 根据你需要的特性进行模块化，而不是像 less 或者 scss 一样的全家桶。
- 多样化的功能插件，创建了一个生态的插件系统
- 拥有极高的处理性能（[3倍以上的处理速度](https://github.com/postcss/benchmark)）
- 可以自己编写postcss插件
- 既可以写正常的CSS，也可以结合 LESS 或者 SASS 一起编写
- 可以与许多流行工具无缝部署，例如` webpack、gulp、codepen` 等

- 对 Source Map 支持更好

一句话来概括PostCSS：**CSS编译器能够做到的事情，它也可以做到，而且能够做得更好**



### postcss的使用

`PostCSS`的一大特点是，具体的编译插件甚至是CSS书写风格，可以根据自己的需要进行安装，选择自己需要的特性：嵌套，函数，变量。自动补全，CSS新特性等等，而不是像`less`或者`scss`一样的大型全家桶。因此，不需要再专门去学习`less`或者`scss`的语法，只要选择自己喜欢的特性，可以只写 CSS 文件，但依旧可以写嵌套或者函数，然后选择合适的插件编译它就行了。

到目前，PostCSS有200个多个插件。你可以在[插件列表](https://github.com/postcss/postcss/blob/master/README-cn.md)或[搜索目录](http://postcss.parts/)找到它们。你也可以自己[开发PostCSS插件](https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md)。

**安装：**`npm i -D postcss-loader`

**postcss的配置：**

* `webpack.config.js`，优先级最高

  ```js
  // webpack.config.js
  {
      test: /\.css$/,
      use: [
          'style-loader',
          'css-loader',
          {
              loader: 'postcss-loader',
              options: {
                  ident: 'postcss',
                  plugins: (loader) => [
                      require('postcss-import')({ root: loader.resourcePath }),
                      require('postcss-preset-env')(),
                      require('cssnano')()
                  ]
              }
          }
      ]
  }
  ```

- `postcss.config.js`或者`.postcssrc.js`

  ```js
  // postcss.config.js
  module.exports = ({ file, options, env }) => ({
      parser: file.extname === '.sss' ? 'sugarss' : false,
      plugins: {
          'autoprefixer': {},
          'postcss-import': { root: file.dirname },
          'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
          'cssnano': env === 'production' ? options.cssnano : false
      }
  })
  ```

- `.postcssrc`

  ```js
  {
      "plugins": {
          "postcss-plugin": {}
      }
  }
  ```

- `package.json` 中的 `postcss`，优先级最低

  ```js
  {
      "postcss": {
          "plugins": {
  			"postcss-plugin": {}
          }
      }
  }
  ```

  

### 基于webpack，创建测试项目

鉴于现在`webpack`也越来越火，所以之后的配置主要是借助于`postcss-loader`，将`PostCSS`的生态圈依托在`webpack`之下。

**安装：**

`npm i webpack webpack-cli -g `

`npm i webpack`

`npm i css-loader postcss-loader mini-css-extract-plugin -D `

**项目结构如下：**

```sh
- build
  - webpack.postcss.config.js
- src
  - index.css
  - index.js
- package.json
- postcss.config.js
```

```js
// webpack.postcss.config.js
const webpack = require('webpack')
const Path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackConfig = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: Path.resolve(__dirname, '../dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                // 使用 PostCSS 处理 CSS 文件
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.css',
            chunkFilename: 'chunkIndex.css',
        })
    ]
}
webpack(webpackConfig, err => {})
```

> MiniCssExtractPlugin 不能与 style-loader 一起使用
>
> webpack(webpackConfig, err => {})，要传回调函，可以为空

```js
// index.js
import './index.css'
```

```css
/*index.css*/
.hello {
    box-sizing: border-box;
}
```

```js
// package.json
{
    ...
    "scripts": {
		"postcss": "node build/webpack.postcss.config.js"
    },
    ...
}
```

```js
// postcss.config.js
module.exports = ({ file, options, env }) => ({
    plugins: {
    }
})
```



### 常用插件

#### [Autoprefixer](https://github.com/postcss/autoprefixer)

安装：`npm i autoprefixer -D`

利用从 Can I Use 网站获取的数据为 CSS 规则添加特定厂商的前缀。[Autoprefixer](https://github.com/postcss/autoprefixer) 自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。

我们可以用以下方法，对插件配置参数，([Browserslist，指定目标浏览器范围](<https://www.npmjs.com/package/browserslist>) )：

* `postcss.config.js`：

  ```js
  //postcss.config.js
  module.exports = ({ file, options, env }) => ({
      plugins: {
          "autoprefixer": {
              "overrideBrowserslist": [
                  "> 0.1%",
                  "last 2 versions",
                  "Android >= 3.2",
                  "Firefox >= 20",
                  "iOS >= 7",
                  "chrome >  20"
              ]
          }
      }
  })
  ```

* ` package.json` 增加如下配置：

  ```js
  {
      "browserslist": [
          "> 1%",
          "last 2 versions",
          "Android >= 3.2",
          "Firefox >= 20",
          "iOS >= 7",
          "chrome >  20"
      ]
  }
  ```

* 根目录下加`.browerslistrc`配置文件：

  ```js
  # 注释是这样写的，以#号开头
  "> 1%",
  "last 2 versions",
  "Android >= 3.2",
  "Firefox >= 20",
  "iOS >= 7",
  "chrome >  20"
  ```


具体配置参数，可以参考[前端工程基础知识点--Browserslist (基于官方文档翻译）](<https://juejin.im/post/5b8cff326fb9a019fd1474d6>)

```css
/* 输入 src/index.css */
.autoprefixer {
    box-sizing: border-box;
}

/* 输出 dist/index.css */
.autoprefixer {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
```



#### [postcss-nesting](https://github.com/jonathantneal/postcss-nesting) 、[**postcss-nested**](https://github.com/postcss/postcss-nested)

支持css的嵌套写法。

安装：` npm i postcss-nesting -D`

安装：`npm i postcss-nested -D`

他们两个的区别是：

- [postcss-nesting](https://github.com/jonathantneal/postcss-nesting): W3C nested selectors，遵循W3C的写法，每个嵌套的样式前面都需要一个`&`（注意符号后面有个空格）
- [postcss-nested](https://github.com/postcss/postcss-nested): Sass-like nested selectors，不需要加`&`符号

建议是使用 `postcss-nesting` ，遵循W3C规则。

```js
//postcss.config.js
module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-nesting": {}
    }
})
```

```css
/*postcss-nesting，嵌套样式前需要加&符号*/
/*postcss-nested，正常样式前不需加&符号，伪类前还是要加*/
/*输入*/
.postcss_nesting {
    & sub_class {
        width: 100%;
    }
    & a {
        color: red;
    }
}

/*输出*/
.postcss_nesting sub_class {
    width: 100%;
}
.postcss_nesting a {
    color: red;
}
```



#### [postcss-import](<https://www.npmjs.com/package/postcss-import>)

允许css通过`@ import`内联其他css模块。

**安装：**` npm i postcss-import -D`

```js
// postcss.config.js
module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-nesting": {}
    }
})
```

新增一个`import.css`文件，在`index.css`中导入：

```css
/*import.css*/
.import {
    color: red;
}
.import_sub {
    width: 100%;
}
```

```css
/*index.css*/
@import './import.css';
```

最终输出到`dist/index.css`：

```css
/*import.css*/
.import {
    color: red;
}
.import_sub {
    width: 100%;
}
```



#### [postcss-preset-env](https://preset-env.cssdb.org/) 

安装：`npm i postcss-preset-env -D`

帮你将现代 CSS 语法转换成大多数浏览器都能理解的东西，根据你的目标浏览器或运行时环境来确定你需要的 polyfills，基于 [cssdb 实现](https://cssdb.org/)。

` postcss-preset-env` 已经内置了 `autoprefixer、postcss-nesting/postcss-nested、postcss-import` 等相关功能。

```js
//postcss.config.js
module.exports = {
    plugins: {
        "postcss-preset-env": {
            features: {
                "custom-properties": {
                    preserve: false,
                    variables: {}
                },
                "nesting-rules": true
            }
        }
    }
}
```

具体参数可查看[postcss-preset-env](https://www.npmjs.com/package/postcss-preset-env) 或者 [feature](https://preset-env.cssdb.org/features)



#### [cssnano](http://cssnano.co/)

安装：`npm i cssnano -D`

cssnano会采用格式良好的CSS并通过许多有针对性的优化来运行它，以确保最终结果对于生产环境而言尽可能小。

```js
//postcss.config.js
module.exports = {
    plugins: {
        "cssnano": {
            preset: ["default", {
                // 禁止插件对自定义动画名称的重命名
                reduceIdents: false,
                // 禁用postcss重写z-index值
                zindex: true
            }]
        }
    }
}
```

```css
/*输入*/
.autoprefixer {
    box-sizing: border-box;
}
.postcss_nesting {
    & sub_class {
        width: 100%;
    }
    & a {
        color: red;
    }
}
.cssnano {
    font-size: 16px;
    z-index: 1000;
}

/*输出*/
.autoprefixer{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.postcss_nesting sub_class{width:100%}.postcss_nesting a{color:red}.cssnano{font-size:16px;z-index:1000}
```



#### [postcss-apply](https://www.npmjs.com/package/postcss-apply)

允许您将一组属性存储在指定的定制属性中，然后在其他样式规则中引用它们。

您正在使用@apply 规则和自定义属性集。该功能将不会包含在 `postcss-cssnext` 的下一个主要版本中。这很可能不会得到来自浏览器供应商的更多支持，因为该规范尚未被认可，并且正在讨论替代解决方案。

安装：`npm i postcss-apply -D`

```js
//postcss.config.js
module.exports = {
    plugins: {
        "postcss-import": {},
        "postcss-apply": {}
    }
}
```

新增一个`apply.css`，引入到`index.css`：

```css
/*apply.css*/
:root {
	--no-wrap: {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
```

```css
/*index.css*/
@import './apply.css';
.apply {
    color: green;
    @apply --no-wrap;
}
```

最终输出到`dist/index.css`：

```css
/*dist/index.css*/
.apply {
    color: green;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

> postcss-apply 要跟 postcss-import 一起使用



#### [postcss-mixins](https://www.npmjs.com/package/postcss-mixins)

样式混入文件中。

安装：`npm i postcss-mixins -D`

```js
//postcss.config.js
module.exports = ({ file, options, env }) => ({
  plugins: {
    "postcss-mixins": {},
  }
})
```

```css
/*输入*/
@define-mixin icon $name, $color: blue {
    .icon.is-$(name) {
        color: $color;
    }
    .icon.is-$(name):hover {
        color: white;
        background: $color;
    }
}
  
@mixin icon twitter {
    background: url(twt.png);
}

/*输出*/
.icon.is-twitter {
    color: blue;
}

.icon.is-twitter:hover {
    color: white;
    background: blue;
}
```



#### [postcss-px2rem-exclude](https://www.npmjs.com/package/postcss-px2rem-exclude)

安装：`npm i postcss-px2rem -D`

安装：`npm i postcss-px2rem-exclude -D`

```js
//postcss.config.js
module.exports = {
    "plugins": {
        "postcss-px2rem-exclude": {
            remUnit: 75,
            exclude: /node_modules|folder_name/i
        }
    }
}
```

```css
/*输入*/
.px2rem {
    width: 100px;
    font-size: 30px;
}

/*输出*/
.px2rem {
    width: 1.333333rem;
    font-size: 0.4rem;
}
```



### 参考文档

[postCss 初识 （文章较长，需要耐心）](https://juejin.im/post/6844903590935560205)

[2019年，你是否可以抛弃 CSS 预处理器？](https://aotu.io/notes/2019/10/29/css-preprocessor/index.html)