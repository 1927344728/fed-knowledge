## glob模式通配符

glob 命令是 global 的缩写，起源于贝尔实验室最早的 Unix 版本，最初是用 B 编程语言编写的，后来，此功能作为 C 库函数提供给 Shell 等程序使用。

在计算机编程中，glob 模式通配符用于指定文件名集。

例如，Unix Bash shell 命令：

```shell
# 将所有名称以 .txt 结尾的文件，从当前目录移动 dir 目录
mv *.txt dir/

# 将所有以单个字符命名的以 .txt 结尾的文件，从当前目录移动 dir 目录
mv ?.txt dir/
```

这里，`*` 是一个通配符，表示除 `/` 之外的任何**字符串**；`?` 也是一个通配符，表示**一个字符**，同理，`??` 表示两个字符。

除了匹配文件名之外，glob 还广泛用于匹配任意字符串（通配符匹配）。

传统上， glob 不匹配 Unix 点文件形式的隐藏文件；为了匹配它们，模式必须明确地以 `.` 开始。例如，`*` 匹配所有可见文件，`.*` 匹配所有隐藏文件。

### 特殊符号

glob 是由普通字符、`/`（斜杠） 和通配符（也称元字符）组成的字符串，用于匹配文件路径。glob 本身属于一种标准，并且各类语言都有其完整实现。

glob 语法中的特殊符号如下：

* 基础语法：`/ * ? ! []`
* 拓展语法：`** {} ()`

#### /（分隔符）

`/` 用于将一个字符串分隔为多个字符串片段，通过 `split('/')` 得到的数组每一项是一个字符串片段。也就是说，字符串片段就是两个分隔符之间的所有字符组成的字符串。

在 glob 中，分隔符永远是 `/` 字符。不区分操作系统，即使是在采用 `\`  作为分隔符的 Windows 操作系统中。

```shell
# src 目录下的 a.js
"src/a.js"
```

- `src/index.js`：有两个片段，即 `src` 和 `index.js`。
- `src/**/*.js`：有三个片段，即是 `src`、`**` 和 `*.js`。

**注意：** 在 glob 中，`\\` 字符被保留作为转义符使用。

#### *（星号）

`*` 用于匹配一个字符串片段中任意数量的字符，包括零个字符。

* `src/*.js`：匹配 src 目录下所有以  js 结尾的文件，但不能匹配 src 子目录中的文件，如 `src/js/a.js` 等。
* `/src/**/*.js`：匹配 src 目录**及其子目录**下所有以  js 结尾的文件，如 `src/js/a.js、src/js/dir/a.js` 等。

#### ？（问号）

`?` 用于匹配单个片段中的单个字符。

* `src/?.js`：匹配 src 目录下的 `src/a.js、src/b.js` 等，但不能匹配 `src/ab.js`、`src/dir/a.js` 等。
* `src/index.??`：匹配 src 目录下以 index 开头，后缀名是两个字符的文件，例如 `src/index.js、src/index.md`，但不能匹配 `src/index.jsx`。

#### !（惊叹号）

`!` 表示取反，即排除那些去掉惊叹号之后能够匹配到的文件。

* `src/[!ab].js`：匹配 `src/c.js`、`src/d.js` 等，不能匹配 `src/a.js`、`src/b.js` 等。
* `!src/temp/**`：排除 `src/temp` 目录下的所有目录和文件。

#### []（中括号）

`[]` 用于匹配单个字符串片段中的单个字符，但是字符集只能从括号内选择，如果字符集内有 `-`，表示范围。

* `src/[ab].js`：只能匹配 `src/a.js` 和 `src/b.js`。
* `src/[!ab].js`：不能匹配 `src/a.js` 和 `src/b.js`。
* `src/[c-z].js`：匹配 `src/c.js`、`src/d.js`、...、`src/z.js`，但不能匹配 `src/a.js` 和 `src/b.js`。

#### **（双星号）

`**` 在多个字符串片段中匹配任意数量的字符，包括零个字符。也就是说，递归匹配所有文件和目录（不含隐藏的文件和目录）。

* `src/js/**` ：匹配 `src/js` 目录下所有文件和文件夹，以及所有子文件和子文件夹。
* `src/js/**.js` ：匹配 `src/js` 目录及其子目录下的所有以 js 结尾的文件。

#### ()（圆括号）

`()` 必须跟在 `? * + @ !`后面使用，且圆括号里面的内容是一组以 | 分隔符的 glob 模式集合。

* `?(pattern|pattern|pattern)`：匹配 0 次或 1 次给定的模式。
* `*(pattern|pattern|pattern)`：匹配任意次数给定的模式。
* `+(pattern|pattern|pattern)`：匹配 1 次或多次给定的模式。
* `@(pattern|pattern|pattern)`：严格匹配给定的模式。
* `!(pattern|pattern|pattern)`：排队给定的模式。

#### {} （大括号）

`{} ` 用于匹配指定的多个 glob 模式，模式之间用逗号进行分隔，支持大括号嵌套，支持用 `..` 匹配连续的字符，即 `{start..end}` 语法。

* `{ab,cd/ef}/*.js`：匹配 `ab/file.js` 或 `cd/ef/file.js`。

- `a.{png,jp{,e}g}`：匹配 `a.png`、`a.jpg`、`a.jpeg`。
- `{a..c}{1..2}`：匹配 `a1`、`a2`、` b1`、`b2`、`c1`、`c2`。

### glob与RegExp的区别

在编程中匹配字符最常见的工具是正则表达式（RegExp），而 glob 模式除了用于匹配文件路径，也可以用于匹配字符串。

glob 在 RegExp 出现之前就有了，它在某些方面与 RegExp 功能相同，但是功能不如 RegExp 强大，且两者也有着不同的语法和约定。

| 符号 | Glob             | RegExp                         |
| ---- | ---------------- | ------------------------------ |
| *    | 0 或多个任意字符 | 量词，匹配规则的 0 或多个字符  |
| ?    | 任意单个字符     | 量词，匹配规则的 0 或 1 个字符 |
| .    | 非特殊字符       | 任意单个字符                   |
| {}   | 匹配组           | 量词，匹配次数                 |

| Glob | Regexp | 精确的 Regexp             |
| ---- | ------ | ------------------------- |
| *    | .*     | /^(?:(?!\.)(?=.)[^/]*?)$/ |
| ?    | .      | /^(?:(?!\.)(?=.)[^/])$/   |

**备注：** glob 匹配的是整个字符串，而 Regexp 默认匹配的是子串，Regexp 如果要匹配整个字符串需显式指定 `^` 和 `$`。

在 JavaScript 中，正则表达式是以标准 API 形式提供的，开箱即用。但是 glob 模式匹配并非 JavaScript 中的标准 API，需要自行解析和匹配。

**[minimatch](https://www.npmjs.com/package/minimatch)** 是 npm 内部使用的匹配库，支持 glob 基础语法和扩展语法，还可以实现 glob 的测试、匹配以及转换成正则表达式。

```javascript
const minimatch = require("minimatch")
minimatch("src/a.js", "src/*.js") // true
minimatch("src/b.js", "src/*.js") // true
minimatch("src/dir/a.js", "src/*.js") // false

minimatch.makeRe('*') // /^(?:(?!\.)(?=.)[^/]*?)$/
minimatch.makeRe('?') // /^(?:(?!\.)(?=.)[^/])$/
```

### 使用场合

* Node 的 glob 模块。
* Git 的 .gitignore 文件。
* TS 的 tsconfig.json 文件配置项。

### 参考资料

[glob (programming) - 维基](https://en.wikipedia.org/wiki/Glob_(programming))

[前端工程化之强大的glob语法][https://juejin.cn/post/6876363718578405384]

[glob 模式匹配简明教程](https://juejin.cn/post/6844904077801816077)

