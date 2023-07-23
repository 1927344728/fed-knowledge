# 规范代码：Linter、Prettier、EditorConfig

任何语言都需要强调编码风格的一致性。以相同的风格编写代码在团队开发中是至关重要的，这样才能更利于其他人阅读和维护。

团队多人协同开发项目的一个很大的问题是：无可避免地会出现每个开发者编码习惯不同、代码风格迥异，为了代码高可用、可维护性， 如何从项目管理上尽量统一和规范代码呢？

不要花费过多时间和精力讨论怎么样的风格是最好的——这通常也不会有结果。统一和规范代码的关键是怎么将规范落实。文档约定，靠开发者自我修养，这种方法是无法确保整个项目代码的规范化。在如今工程化开发的环境下，我们完全可以借助一些工具实现自动检查，规范代码的输出，确保提交到仓库的是高质量代码。

本文主要讲述规范代码的几个工具：**ESlint、StyleLint、Prettier、EditorConfig**，以及它们之间的冲突问题 。文章最后是一个 Git Hook 集成这些工具的示例，讲述了 **husky（新版本） + lint-staged** 用法 。

### [ESlint](http://eslint.cn)

ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于2013年6月创建。代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

ESLint 的初衷是为了让程序员可以创建自己的检测规则。ESLint 的所有规则都被设计成可插入的。ESLint 的默认规则与其他的插件并没有什么区别，规则本身和测试可以依赖于同样的模式。为了便于人们使用，ESLint 内置了一些规则，当然，你可以在使用过程中自定义规则。

ESLint 的目标是**保证代码的一致性和避免错误**，是使用 Node.js 编写。

#### 安装及配置

**安装：**`npm i eslint -D`。

**配置：** 命令行运行 `eslint --init` ，在当前目录下生成一个`.eslintrc.*`文件。

Eslint 使用 JavaScript、JSON 或者 YAML 文件为整个目录（处理你的主目录）和它的子目录指定配置信息。如果同一个目录下有多个配置文件，ESLint 只会使用一个，会按照以下优先级（从高到低）。

  * **.eslintrc.js：** JavaScript 文件；
  * **.eslintrc.yaml > .eslintrc.yml：** YAML 是专门用来写配置文件的语言，非常简洁和强大，远比 JSON 方便；
  * **.eslintrc.json：** 允许 JavaScript 风格的注释；
  * **.eslintrc（已弃用）：** 可以是 JSON ，也可以是 YAML；
  * **package.json：**  在 `package.json` 文件的 `eslintConfig` 属性定义配置。

默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录。如果想要将 ESLint 限制到一个特定的项目，在你项目根目录下的 `package.json` 文件的 `eslintConfig` 字段或者 ``.eslintrc.*`` 配置文件中设置 `"root": true`。ESLint 一旦发现配置文件中有 `"root": true`，它会直接去根目录寻找配置文件，不会再在各级父目录中寻找。

完整的配置层次结构，从最高优先级到最低的优先级，如下：

* 行内配置：`/*eslint-disable*/` 和 `/*eslint-enable*/` > `/*global*/` > `/*eslint*/` > `/*eslint-env*/`

* 命令行选项（或 CLIEngine 等价物）：`--global` > `--rule` > `--env` > `-c`、`--config`

* 项目级配置：与要检测的文件在同一目录下的 `.eslintrc.*` 或 `package.json` 文件；如果没有，再继续在父级目录寻找 `.eslintrc` 或 `package.json`文件，直到根目录（包括根目录）或直到发现一个有`"root": true` 的配置。

* 如果不是（1）到（3）中的任何一种情况，退回到 `~/.eslintrc` 中自定义的默认配置。

#### 使用方式

**[命令行](https://cn.eslint.org/docs/user-guide/command-line-interface)：** `eslint [options] [file|dir|glob]*`。

```shell
eslint --fix '{src,packages}/**/*.{js,vue,ts}'

eslint --ext .js -c ~/my-eslint.js --rulesdir my-rules/ --ignore-path tmp/.eslintignore --quiet -o ./test/test.html -f compact --fix lib/
```

* **--ext：** 查找指定的文件扩展名。默认以 `.js`  作为唯一性文件扩展名。
* **-c, --config：** 指定一个额外的配置文件。
* **--rulesdir**： 指定另一个加载规则文件的目录。
* **--ignore-path：** 指定一个文件作为 `.eslintignore`。默认情况下，ESLint 在当前工作目录下查找 `.eslintignore`。
* **--quiet：** 禁止报告警告。
* **-o, --output-file：** 将报告写到一个文件。
* **-f, --format：** 指定了控制台的输出格式。默认 `stylish`。
* **--fix**： 指示 ESLint 试图修复尽可能多的问题。修复只针对实际文件本身，而且剩下的未修复的问题才会输出。不是所有的问题都能使用这个选项进行修复。

[**集成编辑器**](https://cn.eslint.org/docs/user-guide/integrations#editors)：集成 Visual Studio Code、Sublime Text 3、Atom 等编辑器使用。

[**构建工具**](https://cn.eslint.org/docs/user-guide/integrations#build-tools)：Webpack、Gulp、Grunt、Rollup 等构建工具中使用。

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [resolve('src'), resolve('packages')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    fix: true
                }
            }
        ]
    }
}
```

[**Git Hooks**](https://cn.eslint.org/docs/user-guide/integrations#source-control)： 比如，git 的钩子函数 Precommit、pre-commit。

#### [配置说明](https://cn.eslint.org/docs/user-guide/configuring)

  ```js
// .eslintrc.js
module.exports = {
    root: true,
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        node: true,
        browser: true,
    },
    globals: {},
    plugins: [],
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    rules: {
        "no-unused-vars": 0,
        "quotes": ["error", "double"],
        "vue/max-attributes-per-line": 2
    }
}
  ```

[本人在用的一份 Vue 项目的 .eslintrc.js 配置](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/js/.eslintrc.js)

* **root：** 为 `true` 表示停止寻找配置文件，从根目录下查找 `package.json` 文件的配置或者 `.eslintrc.*` 配置文件。

* **parser：** 指定解析器，即将 Js 语句解析成语法树的插件。ESLint 默认使用 Espree （查看 [Espree DEMO](https://cn.eslint.org/parser/)）作为其解析器，你可以在配置文件中指定一个不同的解析器，但该解析器需要符合一些[要求](https://cn.eslint.org/docs/user-guide/configuring#specifying-parser)，并且 ESLint 不会修复与其它解析器不兼容的相关 bug。

  可以与 ESLint 兼容的解析器有：**Esprima、Babel-ESLint、@typescript-eslint/parser**。

* **parserOptions：** 指定解析器选项。

  **注意：** Vue 项目中，如果想为 `.vue` 文件的 script 使用单独的 parser 可以将 `parserOptions.parser` 指定为想使用的 parser。

  ```js
  parserOptions: {
      ecmaVersion: 6,
      sourceType: "script",
      ecmaFeatures: {
          impliedStrict: true
      }
  }
  ```

  * **ecmaVersion：** 指定要使用的 ECMAScript 版本，默认设置为 3，5（默认）。可选版本号： 6（同2015）、7（同2016）、 8（同 2017）、9（同2018）、10 （同2019）。

  * **sourceType：**生成的 Js 的类型，默认 script，可先：module（如果你的代码是 ECMAScript 模块)。

  * **ecmaFeatures：** 表示你想使用的额外的语言特性。globalReturn 允许在全局作用域下使用 return 语句；impliedStrict 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)；jsx - 启用 JSX；experimentalObjectRestSpread - 启用实验性的属性。

* **processor：** 指定处理器，从另一种文件中提取 JavaScript 代码，或者在预处理中转换 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。

  ```js
  {
      "plugins": ["a-plugin"],
      "processor": "a-plugin/a-processor"
  }
  
  // 为特定类型的文件指定处理器
  {
      "plugins": ["a-plugin"],
      "overrides": [
          {
              "files": ["*.md"],
              "processor": "a-plugin/markdown"
          }
      ]
  }
  ```

* **env：** 指定环境。一个环境定义了一组预定义的全局变量，可定义多个。点击查看 [所有可用环境](https://cn.eslint.org/docs/user-guide/configuring#specifying-environments)，一般常用的环境有：

  - **browser：** 浏览器环境中的全局变量；
  - **node：** Node.js 全局变量和 Node.js 作用域；
  - **commonjs：** CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)；
  - **shared-node-browser：** Node.js 和 Browser 通用全局变量。
  - **es6：** 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 `ecmaVersion` 解析器选项为 6）。
  - **amd：** 将 `require()` 和 `define()` 定义为像 amd 一样的全局变量。

  可以为特定的插件，指定环境：

  ```js
  {
      "plugins": ["example"],
      "env": {
          "example/[envName]": true
      }
  }
  ```

* **globals：** 指定自定义的全局变量。

  ```js
  {
      "globals": {
          "globalVar1": "writable",
          "globalVar2": "readonly",
          "globalVar3": "off"
      }
  }
  ```

  `writable` 表示允许重写变量；`readonly` 表示不允许重写变量；`off` 表示禁用全局变量。

  由于历史原因，布尔值 false 和字符串值 `readable `等价于 `readonly`。类似地，布尔值 true 和字符串值 `writeable ` 等价于 `writable`。但是，不建议使用旧值。

* **plugins：** 指定第三方插件。插件名称可以省略 eslint-plugin- 前缀。

  ```js
  {
      "plugins": [
          "plugin1",
          "eslint-plugin-plugin2"
      ]
  }
  ```

* **rules：** 添加检验规则（[Eslint 规则列表](https://cn.eslint.org/docs/rules/)）。如上：`no-unused-vars` 规则的名称。值是错误级别，可以是字符串或数字：

  * **off | 0：** 关闭规则；
  * **warn | 1：**开启规则，使用警告级别的错误（不会导致程序退出）；
  * **error | 2：**开启规则，使用错误级别的错误（当被触发的时候，程序会退出）。

  ```javascript
  {
      rules: {
          // 可以是字符串或数字
          'no-debugger': 'off',
          // 可以是数组，数组的第一个值是错误级别，第二个值是规则的参数。
          "quotes": ["error", "double"]
      }
  }
  ```

  ```javascript
  // 可以为指定插件定义规则
  {
      "plugins": [
          "plugin1"
      ],
      "rules": {
          "plugin1/rule1": "error"
      }
  }
  ```

  ```javascript
  // 可以为一组文件配置规则
  {
    "overrides": [
      {
        "files": ["*-test.js","*.spec.js"],
        "rules": {
          "no-unused-expressions": "off"
        }
      }
    ]
  }
  ```

* **settings：** 添加共享设置。它将值提供给每一个将被执行的规则。如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置。

  ```js
  {
      "settings": {
          "sharedData": "Hello"
      }
  }
  ```

* **extends：** 指定一个和多个可以继承的配置文件，值可以是一个表文件路径或配置名称的字符串，也可以是字符串数组（数组中的每个配置继承它前面的配置）。这些配置文件的规则可以被 rules 属性中的配置覆盖。

  ```js
  {
  	extends: [
  		"plugin:vue/recommended",
  		"eslint:recommended",
  		"eslint-config-standard",
          "absolute_or_relative_path/.eslintrc.js"
  	]
  }
  ```

  * **配置名称：** `eslint:recommended` 是 Eslint 推荐的配置名称，启用一系列[核心规则](https://cn.eslint.org/docs/rules/) 。这个推荐的规则只能在 ESLint 主要版本进行更新。

    还有一个 `eslint:all`，启用当前安装的 ESLint 中所有的核心规则。**不推荐使用**，因为它可能在 ESLint 的任何版本进行更改。

  * **配置对象npm包**： `eslint-config-standard` 是一个可共享的配置，是一个 npm 包，它输出一个配置对象。可以省略包名的前缀 `eslint-config-`。

  * **插件配置：** 一些插件也可以输出一个或多个命名的 配置，plugins 属性值 可以省略包名的前缀 `eslint-plugin-`。`plugin:vue/recommended` 等同 `plugin:eslint-plugin-vue/recommended`。

  * **指定配置文件**： 可以是到**基本配置文件**的绝对路径，也可以是相对路径。

* **overrides：** 添加一些更精细的配置。比如： 如果同一个目录下的文件需要有不同的配置。

  同一配置文件中，overrides 配置比其他常规配置具有更高的优先级。overrides 的配置几乎与 ESLint 的其他配置相同，除了 root。

  ```js
  {
    "overrides": [
      {
        "files": ["bin/*.js", "lib/*.js"],
        "excludedFiles": "*.test.js",
        "rules": {
          "quotes": ["error", "single"]
        }
      }
    ]
  }
  ```

#### eslint-config-* 和 eslint-plugin-* 的区别

* **eslint-config-*：** `eslint-config-*` 其实就是一个 常规的 `.eslintrc` 文件。最终被 eslint 所识别的配置文件就是所有继承文件的属性合并，并且子类覆盖父类。

* **eslint-plugin-*：** `eslint-plugin-*` 可以理解为只是一个定义规则的包。`extends`  引入的 plugins 在没有对应 config 文件的情况下，如果没有指定 `rules`，它的规则其实是不会发生校验的。

  ```js
  // eslint-plugin-vue
  module.exports = {
      rules: {
  		// 引入一系列的规则
          'array-bracket-spacing': require('./rules/array-bracket-spacing')
      },
      configs: {
          // 引入一系列配置文件
          'recommended': require('./configs/recommended')
      },
      ...
  }
  ```

#### 忽略代码

在文件中以注释形式，指定忽略的代码。

```javascript
// eslint-disable-next-line
alert('foo');

alert('foo'); // eslint-disable-line

/* eslint-disable no-alert, no-console */
alert('foo')
console.log('bar')
/* eslint-enable no-alert, no-console */
```

#### .eslintignore

创建一个 `.eslintignore` 文件告诉 ESLint 去忽略特定的文件和目录。`.eslintignore` 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测。

```shell
.DS_Store
node_modules
/dist

.env.local
.env.*.local
```

除了 `.eslintignore` 文件中的模式，ESLint 总是忽略 `/node_modules/*` 和 `/bower_components/*` 中的文件。

如果没有发现 `.eslintignore` 文件，也没有指定替代文件，ESLint 将在 `package.json` 文件中查找 `eslintIgnore ` 属性，来检查要忽略的文件。

```json
{
  "eslintIgnore": ["hello.js", "world.js"]
}
```

#### [自定义规则](https://cn.eslint.org/docs/developer-guide/working-with-rules)

自定义规则的方式有两种：

* 创建一个 `eslint-plugin-*` 插件，在配置文件的 `extends` 中引用。创建插件最简单的方式是使用 [Yeoman generator](https://www.npmjs.com/package/generator-eslint)。
* 创建单个或多个规则，放在一个目录下，用命令行的 `--rulesdir` 参数指定规则目录。

以创建规则为例，按照以下步骤：

- 自定义规则，把所有的规则放在同一个目录下，如：`rules/lib`；

  ```js
  // no-hello-in-identifier.js
  // 定义规则：禁止标识符中出现 hello
  // JavaScript 标识符包括变量名、函数名、参数名和属性名
  module.exports = {
      meta: {
          type: "suggestion",
          messages: {
              invalidName: "避免标识符出现 'hello' "
          }
      },
      create: function (context) {
          return {
              Identifier(node) {
                  if (node.name.toLowerCase().includes('hello')) {
                      context.report({
                          node,
                          messageId: 'invalidName'
                      })
                  }
              }
          }
      }
  }
  ```

  一个规则的源文件输出一个对象，包含以下属性。

  * **meta：** 规则的元数据。type 表规则的类型、docs 表对规则的描述（在自定义的规则或插件中，可省略或包含部分属性）、messages 定义一些报错信息。
  * **create：** 返回一个对象。其中包含了 **ESLint 在遍历 JavaScript 代码的抽象语法树 AST (ESTree 定义的 AST) 时，用来访问节点的方法**。create 函数的参数 context 对象包含额外的功能，有利于规则完成他们的工作。顾名思义，context 对象包含与规则上下文相关的信息。

- 创建一个配置文件：在 rules 属性下指定你的规则 ID、错误级别，否则，规则将不会运行；

  ```js
  // .eslintrc.js
  // 启动规则
  module.exports = {
      ...
      rules: {
  		'no-hello-in-identifier': 1
      },
      ...
  }
  ```

- 运行命令行：使用 `--rulesdir` 选项指定规则的目录。

  ```shell
  eslint --rulesdir rules/lib/ --config .eslintrc.js demo.js
  ```

  

### [Stylelint](https://stylelint.docschina.org/)

一款与 Eslint 类型的插件，不过，是用于校验 Css 的，可以帮助你避免错误和强制约定一些代码风格。

#### 安装及配置

**安装：**`npm install stylelint stylelint-config-standard -D`。

**配置：** 在项目中加配置文件，查找和加载配置对象从当前工作目录开始，它将按以下顺序查找以下可能的源：

* `package.json` 中的 `stylelint` 属性；
* `.stylelintrc`： 没有扩展名，可以是 JSON 或 YAML 格式。也可以添加文件扩展名以指定格式：`.stylelintrc.json`、 `.stylelintrc.yaml`、 `.stylelintrc.yml`、 `.stylelintrc.js`。；
* `stylelint.config.js` 文件。

找到并解析其中一个后，搜索将停止并将使用该对象。可以使用 `config` 或 `configFile` 选项指定配置文件。

#### 使用方式

- **[命令行](https://stylelint.docschina.org/user-guide/cli/)：**  `stylelint [options] [file|dir|glob]*`。

  ```shell
  stylelint test.css
  
  # 检查目录中的所有.css|.html(文件中style块) 文件
  stylelint src/*.css
  stylelint src/*.html
  
  stylelint  --config stylelint.config.js --fix test.css > report.txt
  ```

- **[Node 应用程序接口](https://stylelint.docschina.org/user-guide/node-api/)：** 通过 Node 应用程序接口使用 stylelint 的一些示例和选项。

- **[PostCSS 插件](https://stylelint.docschina.org/user-guide/postcss-plugin/)：** 使用 PostCSS 插件的一些示例及选项。

- **[辅助工具](https://stylelint.docschina.org/user-guide/complementary-tools/)：** 社区提供的编辑器（Sublime Text、Atom、Visual Studio Code 等）插件、构建工具（Gulp、Webpack 等）插件、以及其他工具（Git 中的构子）的汇总。

#### [配置说明](https://stylelint.docschina.org/user-guide/configuration/)

```js
// stylelint.config.js
module.exports = {
    "plugins": [],
    "extends": [
        "stylelint-config-standard"
    ],
    "rules": {
        "color-no-invalid-hex": true
    }
}
```

* **extends：** 继承现有配置（无论您自己的配置还是第三方配置）。当一个配置继承另一个配置时，它从另一个配置的属性开始，然后添加并覆盖其中的内容。

  extends 可以是数组，数组中的每个项都优先于前一项，而当前文件配置的优于所有数组中的配置文件。

  extends 的值是一个 **定位符（或者是一个定位符数组）**，最终通过 `require()` 加载，所以可以是任何适用于 Node 的 `require.resolve()` 算法的格式。这意味着 **定位符** 可以是：

  * node_modules 中模块的名称（如：stylelint-config-standard，从该模块导入的文件必须是有效的 JSON 配置）；
  * 使用 .js 或 .json 扩展名的文件绝对路径；
  * 相对于引用配置的使用 .js 或 .json 扩展名的文件相对路径。

* **plugins：** 插件是社区构建的支持方法、工具集、非标准 CSS 功能或非常具体的用例的规则或规则集。

  plugins 用于配置一组插件。其值是一个**定位符数组**。与上面的 extends 一样，定位符可以是 npm 模块名称、绝对路径或相对于调用配置文件的路径。

  一旦声明了插件，在您的 "rules" 对象中，您需要为插件的规则添加选项，就像任何标准规则一样。您需要查看插件的文档才能知道规则名称应该是什么。

  如：`stylelint-selector-bem-pattern` 是一款 stylelint 扩展插件，用于为 Css 选择器指定正则匹配。

  ```js
  module.exports = {
      "plugins": [
          "stylelint-selector-bem-pattern"
      ],
      "rules": {
          "plugin/selector-bem-pattern": {
              "preset": "suit",
              // 组件名称检查规则，如：div、span等
              "componentName": /^[-_a-zA-Z0-9]+$/,
              // 选择器检查规则
              "componentSelectors": function (componentName) {
                  const prefix = "[a-z0-9]+" // 定义统一的选择器前缀
                  const block = "(?:-[a-z0-9]+)+" // 中划线连接，且只允许小写字母和数字
                  const modifier = "(?:-|--[a-z0-9]+)*" // 中划线或下划线连接，且只允许小写字母和数字
                  return new RegExp(`^\\.${prefix}${block}${modifier}`)
              },
              // 通用选择器检查规则：在CSS文件在，用 /** @define utilities */ 注释表示是通用选择器。
              "utilitySelectors": /^\.util-[-_a-z0-9]+$/,
              "implicitComponents": ["components/**/*.css", "others/**/*.css"],
              "ignoreSelectors": [
                  "\.no-.+$"
              ]
          }
      }
  }
  ```

* **rules：** 指定 Stylelint 要启用的校验规则。默认情况下没有打开任何规则。

  rules 属性是一个键作为规则名称，值作为规则配置的对象。每条规则配置都符合以下格式之一：

  * **单个值：** 主选项；
  * **包含两个值的数组：** [主选项, 辅助选项]；
  * **null：** 关闭规则。

  点击查看 [stylelint 所有内置规则](https://stylelint.docschina.org/user-guide/rules/)，或者在 [示例配置](https://stylelint.docschina.org/user-guide/example-config/) 中找到主要规则选项的完整列表。

  默认情况下，所有规则都是 "error" 级别的严重性。您可以通过在配置中添加 defaultSeverity 属性来更改此默认值，或者使用辅助选项 `severity` 调整任何特定规则的严重性。severity 的可用值是：warning|error。

  所有规则都接受一个 `message` 辅助选项，如果指定该选项，任何标准消息都将被替为换指定的内容。

* **processors：** 处理器是一些社区包，使 stylelint 能够从非样式表文件中提取样式。它只能与命令行 和 Node.js API 一起使用，不能与 PostCSS 插件一起使用。

  处理器可以启用 stylelint 校验，但不会自动修复，且不支持对非样式文件中的 CSS 进行校验。

  processors 的值是一个**定位符的数组**。与 extends 上面一样，定位器可以是 npm 模块名称、绝对路径或相对于调用配置文件的路径。

  ```javascript
  {
    "processors": [
        "stylelint-my-processor",
        [
            "some-other-processor",
            {
                "optionOne": true,
                "optionTwo": false
            }
        ]
    ],
    "rules": {..}
  }
  ```

* **ignoreFiles：** 提供 glob 或 glob 数组以忽略特定文件。

  glob 是用于匹配符合指定模式的文件集合的一种语言， 类似于正则表达式， 但更加简单。

  **请注意，这不是忽略大量文件的有效方法。 如果要有效地忽略大量文件，请使用 .stylelintignore 或调整文件 glob。**

  如果 globs 是绝对路径，则它们按原样使用。如果它们是相对路径，则相对于它们进行分析：

  * `configBasedir` （Node.js API 传参中）；
  * 配置的文件路径，如果配置是 stylelint 查找加载的文件的话；
  * 或 `process.cwd()`。

  默认情况下，忽略所有 `node_modules` 和 `bower_components`。如果设置了 `ignoreFiles`，则将覆盖默认值。

  `ignoreFiles` 属性从继承配置中删除：只有根级配置可以忽略文件。

* **defaultSeverity：**未指定严重性的所有规则的默认严重性级别，可用值是：warning|error。

#### 忽略代码

在文件中以注释形式，指定忽略的代码：

```css
/* stylelint-disable */
a {}
/* stylelint-enable */

/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
    color: pink !important;
}
/* stylelint-enable */

#id { /* stylelint-disable-line */
    color: pink !important; /* stylelint-disable-line declaration-no-important */
}
#id {
    /* stylelint-disable-next-line declaration-no-important */
    color: pink !important;
}
```

#### .stylelintignore

您可以使用 `.stylelintignore` 文件（或指向另一个忽略模式文件）来忽略特定文件。在检查文件系统之前，这些文件将从文件 glob 中排除，因此它是忽略大量文件的有效方法。

`.stylelintignore` 文件中的模式必须与 `.gitignore` 语法匹配。（在幕后，`node-ignore` 解析您的模式）这意味着您的 `.stylelintignore` 中的模式总是相对于 `process.cwd()` 进行分析。

stylelint 将在 `process.cwd()` 中查找`.stylelintignore`文件。您还可以使用`--ignore-path`（在CLI中）和 `ignorePath`（在JS中）选项指定忽略模式文件的路径（绝对或相对于`process.cwd()`）。



### [Prettier](https://www.prettier.cn/)

Prettier 的中文意思是“漂亮的、机灵的”，也是一个流行的代码格式化工具的名称。它在整个代码库中强制执行一致的代码风格（不会影响 AST），它能够解析代码，并使用你自己设定的规则来重新输出规范的代码。

Prettier 具有以下几个有优点：

- 可配置化；
- 支持多种语言；
- 集成多数的编辑器；
- 简洁的配置项。

到目前为止，采用 Prettier 的最大原因是**停止所有正在进行的关于风格的争论**。

#### **Prettier 和 Linters 的区别：**

Linter （如：ESLint/stylelint） 有两类规则：

**格式规则： ** 例如：max-len、no-mixed-spaces-and-tabs、keyword-spacing、comma-style ...

Prettier 减轻了 Linters 对这类规则的检查！Prettier 将以一致的风格从头开始重新输出整个项目的代码。

**代码质量规则：** 例如：no-unused-vars、no-extra-bind、no-implicit-globals、prefer-promise-reject-errors ...

Prettier 不会为这些规则做任何事。这些规则是 Linter 提供的最重要的功能，因为它们很可能会捕获您代码中的真正错误！

**换句话说：使用 Prettier 格式化代码；使用 Linter 来捕获代码中的错误！**

#### 安装及配置

**安装：**`npm i prettier -D `

**配置：** 可以通过以下格式的文件（按优先顺序）配置 Prettier：

* `package.json` 文件中的 `prettier` 字段；
* **.prettierrc：** 用 JSON 或 YAML 编写的文件；
* `.prettierrc.json、.prettierrc.yml、.prettierrc.yaml、.prettierrc.json5` 文件；
* `.prettierrc.js、.prettierrc.cjs、prettier.config.js、prettier.config.cjs` 导出 `module.exports`；
* `.prettierrc.toml` 文件。

配置文件将从被格式化的文件位置开始解析，并在文件树中搜索，直到找到（或未找到）配置文件。

Prettier 故意不支持任何类型的全局配置。这是为了确保当一个项目被复制到另一台计算机时，Prettier 的行为保持不变。否则，Prettier 将无法保证团队中的每个人都获得相同的一致结果。

#### 使用方式

**命令行：** 在命令行使用 `prettier` 命令：

```shell
prettier rules/prettier.test.js
prettier --write rules/prettier.test.js
```

* **--write|-w：** prettier 默认是在终端输出格式化后的文件。使用 `--write` 参数，将重写所有已处理的文件。 （注意：这会覆盖您的文件！）

* **--check|-c：** 检查文件是否已格式化。（注意：只检查，并不会对文件格式化！）

* **--find-config-path：** 返回上次格式化该文件使用的配置文件的路径。

  ```shell
  prettier --find-config-path rules/prettier.test.js
  # > prettier.config.js
  ```

* **--config：** 指定配置文件。

* **--ignore-path：** 指定要忽略文件的配置文件。

* **--list-different|-l**： 返回格式化文件会改动的文件名列表。

  ```shell
  prettier -l rules/**.test.js
  ```

* **--no-config：** 不要寻找配置文件。将使用默认设置。
* **--config-precedence：** 枚举值，默认 cli。指定 cli 配置选项的优先级。
  * cli-override：CLI 选项优先于配置文件。
  * file-override： 配置文件优先于 CLI 选项。
  * prefer-file： 有配置文件，将忽略其他 CLI 选项；未找到配置文件，CLI 选项将正常使用。此选项增加了对编辑器集成的支持，当用户定义其配置，希望尊重项目特定配置。
* **--no-editorconfig：** 解析配置文件时，忽略 `.editorconfig` 文件。
* **--with-node-modules：** Prettier 默认是忽略 `node_modules`目录中的文件。该参数表示退出此行为。
* **--loglevel：** 枚举值，默认 log 。更改 CLI 的日志记录级别。值：error、warn、log （默认）、debug、silent。

**Node应用程序接口：** Prettier 提供了 APIS，允许你以编程方式运行 Prettier。

```javascript
const prettier = require("prettier")
prettier.format("foo ( );", {
    semi: false,
    parser: "babel"
})
// -> "foo()"
```

**浏览器：** 在 HTML 中引入 `prettier.js`，在浏览器中调用 API。 此版本不依赖于 Node.js。它只格式化代码，不支持配置文件、忽略文件、CLI 使用或插件的自动加载。

```javascript
<script src="https://unpkg.com/prettier@2.4.1/standalone.js"></script>
<script src="https://unpkg.com/prettier@2.4.1/parser-graphql.js"></script>
<script>
    prettier.format("type Query { hello: String }", {
        parser: "graphql",
        plugins: prettierPlugins,
    })
</script>
```

**Git Hooks**： 可以将 Prettier 与预提交工具一起使用，即在 `git add` 提交之前重新格式化并标记为 “暂存” 文件。（详见下文）

**与编辑器集成：** Prettier 可以在多个编辑器中以插件的形式使用。如：VS Code、Vim、Sublime Text、WebStorm、Atom等。

以 VS code 为例，配置文件在保存时自动格式化文件：

* 安装 `Prettier - Code formatter` ；
* 添加配置文件 `prettier.config.js`；
* 在 `文件 -> 首选项 -> 设置 -> 文本编辑器 -> 格式化` 中勾选 `Format On Save` ；
* 重启 VS code 。之后，在你每次保存文件时，prettier 会自动格式化文件。

#### [配置说明](https://www.prettier.cn/docs/options.html)

```js
//prettier.config.js
module.exports = {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    quoteProps: "as-needed",
    trailingComma: "es5",
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: "always"
}
```

* **printWidth：** 数值，默认80。每行的最大字符长度。注意：printWidth 不是硬性的允许行长度上限，它只是说明您希望的每行的字符长度，与 Eslint 中的 max-len 不一样。比如：行中语句是一个长字符，printWidth 不会强制它换行

  ```js
  var strA = 'The future belongs to those who believe in the beauty of their dreams.'
  var strAA = 'The future belongs to those ' + 'who believe in the beauty of their dreams.'
  
  /** 格式化后：
  var strA =
      "The future belongs to those who believe in the beauty of their dreams.";
  var strAA =
      "The future belongs to those " +
      "who believe in the beauty of their dreams.";
  **/
  ```

* **tabWidth：** 数值，默认2。指定每个缩进符的空格数。

* **useTabs：** 布尔值，默认值 false。指定缩进是否用 tab 符。

* **semi：** 布尔值，默认值 true。在语句末尾输出分号。

* **singleQuote | jsxSingleQuote：** 布尔值，默认值 false。指定是否使用单引号代替双引号。

  JSX 会忽略 `singleQuote` 选项，指定要 JSX 中是否使用单引号代替双引号请使用 `jsxSingleQuote` 选项。 

  如果引号的数量超过另一个引号，则较少使用的引号将用于格式化字符串。示例：

  ```js
  "I'm double quoted" => "I'm double quoted"
  "This \"example\" is single quoted" => 'This "example" is single quoted'
  ```

* **quoteProps | jsxSingleQuote：** 枚举值，默认值 `as-needed`。指定对象中的属性的引号如何改动。

  * as-needed：仅在需要时在对象属性周围添加引号。
  * consistent：如果对象中至少有一个属性需要引用，请引用所有属性。
  * preserve：尊重对象属性中引号的输入使用，即不改动属性的引号。

* **trailingComma：**  枚举值，默认值 `es5`。指定在多行逗号分隔的句法结构中如何输出尾随逗号。

  * es5：在 ES5 中有效的尾随逗号（对象、数组等），TypeScript 中的类型参数中没有尾随逗号。
  * none：没有尾随逗号。
  * all：尽可能尾随逗号（包括函数参数和调用）。

  ```js
  // trailingComma: "all"
  const objA = {
      propA: "1111",
      propB: "2222",
      propC: "3333"
  }
  /** 格式化后：
  const objA = {
      propA: "1111",
      propB: "2222",
      propC: "3333",
  }
  */
  ```

* **bracketSpacing：** 布尔值，默认值 true。表示对象的括号之间是否留空格。

  ```js
  // bracketSpacing: true
  const objb = {propA: "1111"}
  
  /** 格式化后：
  const objb = { propA: "1111" }
  */
  ```

* **bracketSameLine：** 布尔值，默认值 false。指定是否将 HTML（HTML、JSX、Vue、Angular）多行的元素的结束符 `>`放在同一行（不适用于自动关闭元素）。

  ```html
  <!-- bracketSameLine: true **-->
  <button
  	className="prettier-class"
  	id="prettier-id"
  	onClick={this.handleClick}>
  	Click Here
  </button>
  
  <!-- bracketSameLine: false **-->
  <button
  	className="prettier-class"
  	id="prettier-id"
  	onClick={this.handleClick}
  >
  	Click Here
  </button>
  ```

* **arrowParens：** 枚举值，默认值 `always`。指定箭头函数只有一个参数时，是否包含括号。
  
  * always：始终包括括号。例子：`(x) => x`。
  * avoid：尽可能省略括号。例子：`x => x`。
  
* **rangeStart | rangeEnd**： 数值，`rangeStart`  默认值 0，`rangeEnd ` 默认值一 `Infinity`。这两个选项用来表示仅格式化文件的一部分，`rangeStart` 表示字符开始的位置，`rangeEnd` 表示字符结束的位置。

* **parser：** 指定要使用的解析器。没有默认值，Prettier 会自动从输入文件路径推断解析器，因此您不必更改此设置。点击查看 [所有有效的解析器](https://www.prettier.cn/docs/options.html#parser)。

* **filepath：** 字符串。指定要格式化的文件。此选项仅在 CLI 和 API 中有用，在配置文件中使用它没有意义。

* **requirePragma：** 布尔值，默认 false。仅格式化文件顶部包含特殊注释的文件，即 执行 prettier 命令格式化多个文件时，只格式化顶部带以下注释的文件。

  ```js
  /** @prettier */
  ```

  或者

  ```js
  /** @format */
  ```

* **insertPragma：** 布尔值，默认 false。 指定是否对已使用 Prettier 命令格式化的文件，在顶部插入一个特殊 `@format` 标记。与 `requirePragma` 同时使用时，`require-pragma` 具有优先权，`insert-pragma` 会被忽略。

  ```js
  /** @format */
  ```

* **proseWrap：** 枚举值，默认值 `preserve`。默认情况下，Prettier 将按 markdown 文本原来的样子进行换行，因为某些服务的渲染器对换行符比较敏感。在某些情况下，您可能希望改用编辑器自己的换行，您可以选择 `never`。
  * always：如果文本超过 printWidth，则将其换行。
  * never：不换行。
  * preserve：按原样换行。

* **htmlWhitespaceSensitivity：**  枚举值，默认值 `css`。为 HTML、Vue、Angular 和 Handlebars 指定全局空白敏感度。

  - css：尊重 CSS `display`属性的默认值。在 Handlebars 使用 `strict`。
  - strict：所有标签周围的空白（或没有空白）被认为是重要的。
  - ignore：所有标签周围的空白（或没有空白）被认为是无关紧要的。

* **vueIndentScriptAndStyle：** 布尔值，默认值 false。是否缩进Vue 文件中的代码 `<script>` 和 `<style>` 标签。

* **endOfLine：**  枚举值，默认值 `lf`。指定换行符。

  由于历史原因，文本文件中存在两种常见的行尾形式，即 `\n`（`LF`）和 `\r\n`（回车+`CRLF`）。前者在 Linux 和 macOS 上很常见，而后者在 Windows 上很普遍。

  - lf：仅`\n`换行 ( )，常见于 Linux 和 macOS 以及 git 存储库内。
  - crlf：回车符 + 换行符 ( `\r\n`)，在 Windows 上很常见。
  - cr：仅回车符 ( `\r`)，很少使用。
  - auto：维护现有的换行符。

* **embeddedLanguageFormatting：**枚举值，默认值 `auto`。控制 Prettier 是否格式化文件中嵌入的引用代码。

  - auto：如果 Prettier 可以自动识别嵌入代码，请对其进行格式化。
  - off：永远不要自动格式化嵌入的代码。

* **overrides：** 重写对某些文件扩展名、文件夹和特定文件的 prettier 配置。

  ```javascript
  {
      "overrides": [
          {
              "files": "*.overrides-example.js",
              "options": {
                  "semi": true
              }
          }
      ]
  }
  ```

* **共享配置：** 共享 Prettier 配置很简单，只需发布一个导出配置对象的模块，然后在 `package.json` 或者配置文件中导入即可。

  ```javascript
  module.exports = {
      ...require("@company/prettier-config"),
      semi: false,
  }
  ```

#### [忽略代码](https://www.prettier.cn/docs/ignore.html)

在文件中以注释形式，忽略代码：

```javascript
// prettier-ignore
```

#### [.prettierignore](https://www.prettier.cn/docs/ignore.html#ignoring-files-prettierignore)

新创建 `.prettierignore` 文件，去忽略某些文件和文件夹。

```shell
build
coverage
*.html
```



### [EditorConfig ](https://editorconfig.org/)

EditorConfig 帮助**跨不同编辑器和 IDE** 从事同一项目的多个开发人员维护一致的编码风格。 EditorConfig 项目包括一个用于定义编码样式的文件格式（.editorconfig）和一组文本编辑器插件，这些插件使编辑器能够读取文件格式并遵循所定义的样式。 

有些编辑器默认支持 editorConfig，如 webstorm；而有些编辑器则需要安装 editorConfig 插件，如ATOM、Sublime、VS Code等。

当打开一个文件时，EditorConfig 插件会在打开文件的目录和其每一级父目录查找 `.editorconfig` 文件，直到有一个配置文件 root=true。

EditorConfig 的配置文件是从上往下读取的，并且最近的 EditorConfig 配置文件会被最先读取。匹配  EditorConfig 配置文件中的配置项会按照读取顺序被应用，所以最近的配置文件中的配置项拥有优先权。

如果 `.editorconfig` 文件没有进行某些配置，则使用编辑器默认的设置。

#### 配置说明

`.editorconfig` 需要是 UTF-8 字符集编码的，以 CRLF 或 LF 行分隔符，斜杆（/）被用作为一个路径分隔符，井号（#）或分号（;）被用作于注释，注释需要与注释符号写在同一行。

`.editorconfig` 文件中，所有的属性和值都是忽略大小写的，解析时它们都是小写的。注意：部分名称是文件路径的，是区分大小写。

示例：

```shell
root = true

[*]
end_of_line = lf
insert_final_newline = true

[*.{js,py}]
charset = utf-8

[*.py]
indent_style = space
indent_size = 4

[**.js]
indent_style = space
indent_size = 2
```

**请注意，并非每个插件都支持所有属性。**

- **indent_style：** 指定以 tab 符，还是空格缩进。值：tab | space。
- **indent_size：** 指定缩进 tab 符的列数或者空格的宽度。当设置为 tab 时，`tab_width` 将使用（如果指定）的值。
- **tab_width：** 指定 tab 符的列数的整数。这个默认为 `indent_size` 的值，`indent_size` 通常不需要指定。
- **end_of_line：** 指定换行符。值：lf | cr | crlf。
- **charset：** 指定编码字符集。值：latin1 | utf-8 | utf-8-bom | utf-16be | utf-16le。
- **trim_trailing_whitespace：** 指定是否删除换行符之前的任何空白字符。值：true | false。
- **insert_final_newline：** 指定是否在文件保存时以换行符结尾。值：true | false。
- **root：** 指定是否停止对 `.editorconfig` 文件的搜索。该属性应置于文件顶部，在任何其他属性之上。值：true。

一般情况下，如果没有指定属性，将使用编辑器默认设置的值。对于任何属性，值为 `unset` 是为了移除该属性的影响，即使它之前已经设置过。

#### 与编辑器集成

要将 EditorConfig 与编辑器或 IDE一起使用， 必需安装对应的 EditorConfig 插件或扩展。。

以 VS code 为例：安装 `EditorConfig for VS Code` 插件，再配置 `.editorconfig` 文件。

**注意：** 需要先安装 `EditorConfig ` 包。如：`npm install editorconfig -g`。

**注意：** VS code 的 Prettier 和 EditorConfig  插件有冲突。如果你安装过 Prettier 插件，后面又安装了 EditorConfig。这时，你调用 `Format Document` 命令或者保存文件，EditorConfig  可能不会自动格式化文件。

**EditorConfig  格式化无效，有两个可能的原因：**

* 编辑器指定的默认格式化程序是 Prettier（或其他程序）。我们可以修改默认的格式化程序： `Ctrl + Shift + p` 打开命令面板，输入 `setting`，点击 `Perferences: Open Settings(JSON)` ，打开 `setting` 文件，设置 `"editor.defaultFormatter": "EditorConfig.EditorConfig"` 。

* 格式化程序不能格式化当前文件。**报错：** 扩展 ”EditorConfig for VS Code“ 配置为格式化程序，但不能格式化 'JavaScript' -文件。

  解决方法一：为特定的格式指定更改格式化文档方式，方法如上，参数如下方。

  解决方法二：在文档中 `右键 -> 使用...格式化文档`，可以点击【格式化程序】格式化当前文件，也可以选择 【配置默认格式化程序...】为当前格式指定默认格式化程序。

以上两种方法，本质上都是修改 `setting` 文件，配置参数如下：

```shell
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "EditorConfig.EditorConfig",
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    }
}
```



### 如何避免 Linters、Prettier、EditorConfig 冲突？

Linters、Prettier、EditorConfig 通过在项目中统一约定配置，可以在代码开发过程中就检查、约束、美化代码，统一编码风格；这样可以省去很多的沟通成本，提前暴露代码缺陷，减少后期二次维护代码的风险。

这三者可以一起在项目中使用，它们的关注点各有不同：

* **EditorConfig：** 跨编辑器和 IDE 编写代码，保持一致的简单编码风格；

* **Prettier：** 只专注于代码格式化，并不具备检查语法等功能；

* **Linters：** 代码质量检测、编码风格约束等，并且会提示或自动修复（部分）不符合风格规范的代码。

三者有部分规范属性是重复的，比如：代码缩进风格，EditorConfig 配置中指定 `indent_style = space, indent_size = 4` ，Prettier 配置中指定 `tabWidth: 2, useTabs: false`， Eslinte 配置中指定 rules 字段中 `"indent": ["error", 4]`。这三种配置都是指定代码缩进的规范，其指定值不一样时，不可避免的会发生冲突。

在这之前，我一直有个疑问：即然 Linters 可以约束和规范代码，为什么还要用 Prettier 和 EditorConfig 呢？

目前我总结，可能是以下原因：

* Prettier 可以针对各种流行语言，Linters 是针对特定的某种语言，比如：Eslint 是针对 JavaScript。
* Prettier、EditorConfig  安装、配置比较简单，运行速度也较快，并且能较好的与编辑器或 IDE 集成。
* Prettier、EditorConfig 可以提供一些 Liners 没有的规范。比如：EditorConfig  的`charset` 属性。

那么我们该如何避免冲突？

#### 方法一：专事专办、各司其职

让不同的插件做自己专注的事，避免重复配置同一规范。

* 与编辑器或 IDE 相关的所有配置（结尾行、缩进风格、缩进大小等等）应该由 EditorConfig 来处理；
* 和代码格式相关的一切事物应该由 Prettier 处理；
* 剩下的，代码质量相关的，则由 Linters 负责。

这样，Linters 做为我们的代码质量检测器，Prettier 充当代码格式化工具，而 EditorConfig 将为每个人提供正确的编辑器配置。

#### 方法二：目标一致、同进同退

将这三个插件的指定同一规范的配置的值设置为等价的。比如：缩进风格，统一2个空格：

```shell
# .editorconfig
indent_style = space
indent_size = 2

# prettier.config.js
module.exports = {
    tabWidth: 2,
    useTabs: false
}


# .eslintrc.js
module.exports = {
    rules: {
    	"indent": ["warn", 2]
    }
}
```

#### 方法三：协商合作、互谦互让

为插件的配置约定不同优先级，或者约定覆盖规则。

* Prettier 的最新版本通过解析 `.editorconfig` 文件来确定要使用的配置选项。也就是说，Prettier 会解析 EditorConfig  的配置。如果 Prettier 没有该配置，将采用 EditorConfig  的配置；如果有，则采用 Prettier 的配置。**Prettier 配置优先于 EditorConfig。**

* Linters 集成 Prettier，禁用冲突的规则。

  比如：Eslint 提供插件将 Prettier 作为 Eslint 规则来运行，如： `eslint-plugin-prettier`。我们通过 `extends` 字段来扩展该插件，然后在 `rules` 字段中指定关闭或启用某个 Prettier 规则。 

  再比如：Eslint 提一个 `eslint-plugin-prettier` 扩展，禁用所有与格式化相关的 ESLint 规则。

  ```javascript
  // .eslintrc.js
  module.exports = {
      "plugins": ["prettier"],
      "extends": [
          "eslint:recommended",
          "prettier"
      ],
      "rules": {
          "prettier/prettier": "error"
      }
  }
  ```

  * **"plugins": ["prettier"]：** 注册插件；
  * **"extends": ["prettier"]**： 启用 `eslint-config-prettier` 配置，关闭与 ESLint 冲突的规则；
  * **"prettier/prettier": "error"**： 启用 `eslint-plugin-prettier` 提供的规则。

  **注意：** `extends` 字段中，后面引入的插件会覆盖前面的插件。 



### Git Hook 集成格式化工具

在我们提交代码时，使用格式化程序，帮助我们检查代码并自动修复错误，在修复不了的时候，报错给我们。这样，可以确保提交到仓库的代码是风格一致的。

#### Git Hook

Git 能在特定的重要动作发生时触发自定义脚本。 有两组这样的钩子：客户端的和服务器端的。 客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。 

钩子都被存储在 Git 目录下的 hooks 子目录中。 也即绝大部分项目中的 .git/hooks 。 当你用 git init 初始化一个新版本库时，Git 默认会在这个目录中放置一些示例脚本。这些脚本除了本身可以被调用外，它们还透露了被触发时所传入的参数。 所有的示例都是 shell 脚本，其中一些还混杂了 Perl 代码，不过，任何正确命名的可执行脚本都可以正常使用 —— 你可以用 Ruby 或 Python，或任何你熟悉的语言编写它们。 这些示例的名字都是以 .sample 结尾，如果你想启用它们，得先移除这个后缀。

把一个正确命名（不带扩展名）且可执行的文件放入 .git 目录下的 hooks 子目录中，即可激活该钩子脚本。 这样一来，它就能被 Git 调用。

客户端钩子分为很多种：提交工作流钩子、电子邮件工作流钩子和其它钩子。

**提交工作流钩子：** 

* **pre-commit：** 钩子在 `git commit` 前运行。 它用于检查即将提交的快照：检查是否有所遗漏、核查代码。 如果该钩子以非零值退出，Git 将放弃此次提交，不过你可以用 git commit --no-verify 来绕过这个环节。 你可以利用该钩子，来检查代码风格是否一致（运行类似 lint 的程序）、尾随空白字符是否存在（自带的钩子就是这么做的），或新方法的文档是否适当。

* **prepare-commit-msg：** 钩子在启动提交信息编辑器之前，默认信息被创建之后运行。
* **commit-msg：** 钩子接收一个参数，此参数即上文提到的，存有当前提交信息的临时文件的路径。 如果该钩子脚本以非零值退出，Git 将放弃提交，因此，可以用来在提交通过前验证项目状态或提交信息。 
* **post-commit：** 钩子在整个提交过程完成后运行。 它不接收任何参数，但你可以很容易地通过运行 git log -1 HEAD 来获得最后一次的提交信息。 

除了客户端钩子，作为系统管理员，你还可以使用若干服务器端的钩子对项目强制执行各种类型的策略。 这些钩子脚本在推送到服务器之前和之后运行。 推送到服务器前运行的钩子可以在任何时候以非零值退出，拒绝推送并给客户端返回错误消息，还可以依你所想设置足够复杂的推送策略。

* **pre-receive：** 处理来自客户端的推送操作时，最先被调用的脚本是 pre-receive。 它从标准输入获取一系列被推送的引用。如果它以非零值退出，所有的推送内容都不会被接受。 你可以用这个钩子阻止对引用进行非快进（non-fast-forward）的更新，或者对该推送所修改的所有引用和文件进行访问控制。
* **update：** update 脚本和 pre-receive 脚本十分类似，不同之处在于它会为每一个准备更新的分支各运行一次。 假如推送者同时向多个分支推送内容，pre-receive 只运行一次，相比之下 update 则会为每一个被推送的分支各运行一次。 它不会从标准输入读取内容，而是接受三个参数：引用的名字（分支），推送前的引用指向的内容的 SHA-1 值，以及用户准备推送的内容的 SHA-1 值。 如果 update 脚本以非零值退出，只有相应的那一个引用会被拒绝；其余的依然会被更新。

* **post-receive：** post-receive 挂钩在整个过程完结以后运行，可以用来更新其他系统服务或者通知用户。 

#### [Husky](<https://www.npmjs.com/package/husky>)

在项目的 `.git/hooks` 目录中，有一些 `.sample` 结尾的钩子示例脚本，如果想启用对应的钩子，只需手动删除后缀，即可。

**注：** 删除某一个 hook 的后缀 `.sample` 即可启用该 hook 脚本，默认是不启用的。

但是，我们一般不去改动 `.git/hooks` 里面的文件，因为我们使用 husky 插件。husky 在安装过程中会在 `.git/hooks` 文件夹中生成一系列的 git hook 脚本。

**安装：** `npm i husky -D`

**注意 Husky 版本问题：** husky@6.0.0 做了破坏性的变更，之前版本的设置方式已经失效。

根据官方说法，之前 husky 的工作方式是：安装时，创建所有类型的 Git hooks。这样做的好处是，无论用户设置什么类型的 hook，husky 都能确保其正常运行，其缺点也明显，即使用户没有设置任何 hook，husky 也向 Git 中添加了所有类型的 Git hook。

那有没有可能让 husky 只添加某一个 hook呢？husky 的作者尝试过解决这个问题，但是失败了。其根本原因是：husky 需要在两个地方进行配置才能完成一个完整的 hook 功能。一是 `package.json` 配置 git hook 所要执行的真正命令，一是在 `.git/hooks` 目录下，配置相对应的 hook。作者没有找到一个可靠的方法，同步这两个地方的配置。

**新版本的工作原理：** 新版的 husky 使用了从 git 2.9 开始引入的一个新功能 `core.hooksPath`。`core.hooksPath` 可以让你指定 git hooks 所在的目录而不是使用默认的 `.git/hooks/`。这样 husky 可以使用 `husky install` 将 `git hooks` 的目录指定为 `.husky/`，然后使用 `husky add` 命令向 `.husky/` 中添加 hook。通过这种方式我们就可以只添加我们需要的 `git hook`，而且所有的脚本都保存在了一个地方（`.husky/` 目录下）因此也就不存在同步文件的问题了。

**新版本（6.0.0后）实践：**

* **安装：** `npm i husky -D`

* 在 `package.json` 中添加 prepare 脚本：

  ```json
  // package.json
  {
      "scripts": {
          "prepare": "husky install"
      }
  }
  ```

  prepare 脚本会在 `npm install`（不带参数）之后自动执行。也就是，执行 `npm install` 安装完项目依赖后，会执行 `husky install`命令该。命令会创建在根目录下创建 `.husky/` 目录并指定该目录为 git hooks 所在的目录。

  当然，也可以直接在命令行中执行 `husky install`，创建 `.husky` 目录。

* 添加 Git hooks：

  ```shell
  npx husky add .husky/pre-commit "echo 'Create Git Hooks Success!'"
  ```

  在 `./husky` 目录下，打开 `pre-commit` 文件，可查看其中配置：

  ```shell
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"
  
  echo 'Create Git Hook Success!'
  ```

之后，执行 `git commit` 命令的，会调用钩子执行 `"echo 'Create Git Hooks Success!'"`。

husky 的配置可以使用 `.huskyrc、.huskyrc.json、.huskyrc.js、husky.config.js` 文件。

####  [Lint-staged](https://github.com/okonet/lint-staged)

lint-staged 是一个在 git 暂存文件上（也就是被 git add 的文件）运行已配置的 linter（或其他）任务。lint-staged 总是将所有暂存文件的列表传递给任务。简单来说，就是当我们运行 `eslint` 或 `stylelint` 命令时，只会检查我们通过 `git add` 添加到暂存区的文件，可以避免我们每次检查都把整个项目的代码都检查一遍。

**安装：** `npm i lint-staged -D`

**配置：** 在 `package.json` 文件中配置：

```json
//package.json
{
    "lint-staged": {
        "{src,packages}/**/*.{js,vue}": [
            "eslint --fix",
            "prettier --write",
            "git add"
        ],
        "{src,packages}/**/*.{css,vue}": [
            "stylelint --fix",
            "git add"
        ]
    }
}
```

这里 lint-staged 的配置，前面一条是：在 git 的待提交的文件中，在 src、package 目录下的所有 `.js` `.vue` 都要执行三条命令。前两条是 eslint 命令和 prettier 命令，后一条是将处理过的代码重新 add 到 git 中。

配置完成后，执行 `git add .` 向暂存区提交文件，再在命令行中执行 `lint-staged`，即可执行以上配置的命令。

其他 lint-staged 配置方式：

* `package.json` 的 lint-staged 字段；
* **.lintstagedrc：** JSON 或 YML 格式的文件；
* **lint-staged.config.js：** JS 格式的文件。

使用 `–config` 或 `-c` 标识传递配置文件。

#### husky + lint-staged

执行 `husky add` 命令，添加 `pre-commit` 钩子，执行 `"lint-staged"`，形成一个自动化工具链：

```shell
npx husky add .husky/pre-commit "lint-staged"
```

如此，在 commit 之前，将暂存区的内容做一次代码检查和代码美化，然后再添加到暂存区；然后再 commit，完美！！



### 参考链接

[ESLint 官方文档](https://cn.eslint.org/)

[stylelint 官方文档](https://stylelint.docschina.org/)

[Prettier 中文网](https://www.prettier.cn/)

[EditorConfig 官方文档](https://editorconfig.org/)

[Git 文档 - Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

[husky+lint-staged助力团队编码规范](https://neveryu.github.io/2020/06/10/husky-lint-staged/)

[husky使用总结](https://zhuanlan.zhihu.com/p/366786798)

