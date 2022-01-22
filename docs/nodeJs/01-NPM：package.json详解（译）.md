## NPM：package.json详解（译）

Node.js 是一个基于 Chrome V8 引擎的 JS 运行环境，npm 是它的包管理器。

在 Node.js 中，包可以是一个库或者一个框架，也可以是一个 Node.js 项目，Node.js 项目遵循模块化架构，当我们创建一个 Node.js 项目的时，这些模块的描述文件被称之为 package.json 文件。

package.json 是 Node.js 项目中非常重要的配置文件，是一个项目的核心。该文件定义了项目的配置信息（如：名称、版本、许可证、入口文件、执行脚本等元数据）、项目所需要的模块包的描述等。npm install 命令会根据这个文件下载所有依赖模块。

package.json 必须是纯 JSON 的，而不仅仅是一个 JavaScript 对象字面量。

### 创建 package.json

package.json 文件创建有两种方式：手动创建、自动创建。

* 手动创建：直接在项目根目录新建一个 package.json 文件，然后输入相关的内容；
* 自动创建：在项目根目录下执行 npm init，然后根据提示一步步输入相应的内容；

一个简单的 package.json 示例：

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

如果你打算发布你的包，那 package.json 中**最重要**的就是 name 和 version 字段，它们是必填的。name 和 version 共同构成一个 npm 包的唯一标识。

### package.json 配置说明

#### name

包名称。如果你打算发布你的包，那么 name 是必需的，否则是可选的。

定义名称的一些规则：

* 名称必须少于或等于 214 个字符（包括范围包的范围，如 `@babel/core` 中的 `@babel`）；
* 范围包的名称可以以 `.` 或 `_` 开头，但非范围包是不允许的；
* 名称中**不得包含大写字母**；
* 该名称最终成为 URL、命令行参数和文件夹名称的一部分。因此，名称不能包含任何非 URL 安全字符。

#### version

包版本号。如果你打算发布你的包，那么 version 是必需的，否则是可选的。

包版本号需要遵循 SemVer 规范，该规范的标准版本号采用 X.Y.Z 的格式，其中 X、Y 和 Z 均为非负的整数，且禁止在数字前方补零：

* X 是主版本号（major）：第一位就是主要版本号。一般用于，重大功能的更新，或功能的添加又不能向后兼容的情况。
* Y 是次版本号（minor）：中间那一位是指次要版本号。一般用于，一些功能的添加，但又能向后兼容的情况。
* Z 是修订号（patch）：最后一位就是补丁版本号。一般用于，一些 BUG 修复。

当某个版本改动比较大、并非稳定而且可能无法满足预期的兼容性需求时，我们可能要先发布一个先行版本。

先行版本号可以加到标准版本号的后面，通过 `-` 号连接一连串以 `.` 分隔的标识符和版本编译信息：

* 内部版本（alpha），比如：`2.0.0-alpha-8ad8as-20220129` ；
* 公测版本（beta），比如：`2.0.0-beta-8ad8as-20220129` ；
* 正式版本的候选版本（rc，即 Release candiate），比如：`2.0.0-rc.0-next-23k38s-20220129` 。

通过以下命令可以查看包的版本号：

```shell
npm view <proejct-name> version
npm view <proejct-name> versions
```

**即：** 版本号必须是可由 [node-semver](https://github.com/npm/node-semver) 解析的字符串。

#### description

包的一段描述信息，是一个字符串。这有助于用户了解该包，帮助用户在 npm search 时找到这个包。

#### keywords

包的一些关键字，是一个字符串数组。这有助于用户了解该包，帮助用户在 npm search 时找到这个包。

#### homepage

项目的主页链接地址。

```json
"homepage": "https://github.com/owner/project#readme"
```

#### bugs

项目 BUG 跟踪器的 url 和报告问题的电子邮件地址。

```json
"bugs": {
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

可以指定一个或两个值。如果只想提供 url，可以将 bugs 的值指定为一个简单的字符串：

```json
"bugs": "https://github.com/owner/project/issues"
```

在当前包目录下，执行 npm bugs 命令，将会在浏览器中打开 url；如果没有指定 url 值，则会打开该包在 npmjs.com 官网的 url。

#### license

包的许可证，以便用户知道他们的使用权利和限制。

查看许可证列表：https://opensource.org/licenses/alphabetical

```json
{
  "license": "ISC"
}
```

ISC 许可证：特此授予出于任何目的使用、复制、修改和/或分发本软件的许可，无论是否收费，前提是上述版权声明和本许可声明出现在所有副本中。

```json
{
  "license": "UNLICENSED"
}
```

UNLICENSED：不希望在任何条款下授予他人使用私有或未发布包的权利。

#### author、contributors

author 是指一个人，contributors 是一组人。两者的数据结构是一样的，只是 author 是一个对象，contributors 是一个对象数组。其中，email、url 是可选项。

```json
{
  "name" : "Barney Rubble",
  "email" : "b@rubble.com",
  "url" : "http://barnyrubble.tumblr.com/"
}
```

也可以简写为：

```json
{
  "author": "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
}
```

#### funding

指定包开发的最新资助方式信息，可以是对象、字符串 UR L或对象数组：

```json
{
  "funding": {
    "type" : "individual",
    "url" : "http://example.com/donate"
  }
```

```json
{
  "funding": "http://example.com/donate"
}
```

```json
{
  "funding": [
    {
      "type" : "individual",
      "url" : "http://example.com/donate"
    },
    "http://example.com/donateAlso",
    {
      "type" : "patreon",
      "url" : "https://www.patreon.com/my-account"
    }
  ]
}
```

执行 `npm fund` 命令列出项目所有依赖包的 funding 信息，也可以 `npm fund <projectname>` 列出某个包的 funding 的信息（有多个 url 时，将列出第一个）。

#### files

描述包作为依赖项安装时要包含的目录，是一个文件模式数组。文件模式遵循类似 `.gitignore` 的语法，但不同的是，files 字段不是表示忽略，而是指定的文件、目录或 glob 模式（`*`、`**/*`等）打包发布出去。

files 字段的默认值是`["*"]`，即包括所有文件。

在配置 files 字段时，也可以在根目录或者子目录下配置一个 `.npmignore` 文件。根目录下的 `.npmignore` 文件不会覆盖 files 字段，但是子目录下的会。 `.npmignore` 文件的作用 `.gitignore` 文件很像，但有 `.gitignore` 文件的情况下， `.npmignore` 会被忽略。

**注意：** files 字段中包含的文件不能通过 `.npmignore` 或`.gitignore` 排除 。

一些特殊的文件和目录是没法被包含或排除的，无论它们是否存在于 `files` 数组中。

无论设置如何，包始终包含某些文件：`package.json`、`README`、`LICENSE / LICENCE`、`main` 字段中指定的文件。

**注意：** README、LICENSE 文件的名称可以是任意的大小写和扩展名。

同样，有些文件始终不会包含：`.git`、`CVS`、`.svn`、`.hg`、`.lock-wscript`、`.wafpickle-N`、`.*.swp`、`.DS_Store`、`._*`、`npm-debug.log`、`.npmrc`、`node_modules`、`config.gypi`、`*.orig`、
`package-lock.json` (如果想发布，可以用 `npm-shrinkwrap.json` 代替)。

#### main

包的主入口，也就是说，包名为 `project-name`，用户安装后，使用时执行 `require("project-name")`，会返回主入口文件导出的对象。

主入口文件应该是相对于根目录的包，如：`dist/index.js`。如果 `main` 字段未设置，则默认为根目录下的 `index.js` 文件。

#### browser

与 main 字段类似，区别在于包是准备给客户端（浏览器）使用的。在 browser 字段定义主入口，有助于提示用户包可能依赖于 Node.js 包中不支持的对象和 API，比如：window。

#### bin

`.js` 文件是可以通过 node 命令来执行的，比如：

```javascript
/* bin_test.js */
console.log('abcd')
```

定位到 `bin_test.js` 文件所在的目录，在终端执行 `node bin_test.js `，即可打印 `abcd`。这里的一个关键是，先要找到 `bin_test.js` 文件的路径，这个有时候是很麻烦的事情，比如，你可能忘记了文件路径，或者你不想输入一长串字符来定位文件。

`bin` 字段可以使执行文件变得更简单。它允许定义一个指令名称，并指定一个可执行文件。当**全局安装**此软件包时，该文件将会映射到 `/usr/local/bin` 目录，只要在终端输入指令名称，即可执行映射的文件。

比如：`my-program` 项目的 bin 配置如下：

```json
{
  "bin": {
    "command-name": "./bin/index"
  }
}
```

全局安装项目：`npm i my-program -g `，然后，在终端输入 `command-name`  即可执行 `my-program/bin/index` 文件。

当包是作为依赖项安装在一个项目中时，该项目的 `node_modules/.bin` 目录下会生成一个 `command-name` 文件，我们也可以在当前项目下，调用 `./node node_modules/.bin/command-name ` 执行映射文件。

bin 字段也可以配置如下：

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": "./path/to/program"
}
```

相当于：

```json
{
  "name": "my-program",
  "version": "1.2.5",
  "bin": {
    "my-program": "./path/to/program"
  }
}
```

**注意：** 请确保在 bin  字段中引用的可执行文件首行是 `#!/usr/bin/env node`，否则 node 不会解释该文件。

> #!/usr/bin/env node 是什么意思呢？
>
> **#!：** 这个符号在 Linux 或者 Unix 中称为 shebang。unix 类操作系统中一个普通文件带有 `#!` 开头的，就会当做一个执行文件来运行，因为 `#` 在很多脚本里面是用作注释开头的符号，解释器不会解释这行，只是标识说明这是可以执行文件。
>
> **/usr/bin/env node**：意思是用 node 解释器来执行该文件，`/usr/bin/env` 是告诉系统去 PATH 目录中找 node 解释程序。

#### man

man 是 manual 的简写，主要用于查看帮助手册，有助于让用户查看各个命令功能以及使用的说明。

man 字段指定单个文件或多个文件名的数组，以供 man 程序查找帮助文档。

如果只提定一个文件，那么不管 man 指定的文件名是什么，最终指令都是包名称：

```json
{
  "name": "my-program",
  "man": "./man/doc.1"
}
```

以上指定  `./man/doc.1` 文件，但实际执行指令是 `man my-program ` 。

如果文件名不以包名称开头，包名称会做为 man 指令的前缀：

```json
{
  "name": "my-program",
  "man": [
    "./man/my-program.1",
    "./man/othername.1"
  ]
}
```

最终执行指令是 `man my-program` 和 `man my-program-othername`。

Man 文件必须以数字结尾，如果它们被压缩，则可以选择 `.gz` 后缀。数字指示文件安装到哪个 man 部分：

```json
{
  "name": "my-program",
  "man": [
    "./man/my-program.1",
    "./man/my-program.2"
  ]
}
```

最终执行指令是 `man my-program` 和 `man 2 my-program`。

#### directories

directories 字段是为一些字段的配置指定目录，目录下的所有文件将会添加到该字段下，比如：bin、doc、lib、man 字段。

```json
{
  "directories": {
    "bin": "./bin",
    "doc": "./doc",
    "lib": "./lib",
    "man": "./man"
  }
}
```

由于 bin 指令的工作方式的原因，同时指定一个 bin 文件路径和设置 directories.bin 是错误的。如果要指定单个文件，请使用 bin 字段；如果指定一个目录下的所有文件，请使用 directories.bin。

#### repository

repository 字段用于指定代码的仓库地址，使用 `npm docs` 命令能快速打开该地址。

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/npm/cli.git"
  }
}
```

对于 GitHub、GitHub gist、Bitbucket 或 GitLab 存储库，您可以为 `npm install` 安装提供如下形式的地址：

```json
{
  "repository": "npm/npm",
  "repository": "github:user/repo",
  "repository": "gist:11081aaa281",
  "repository": "bitbucket:user/repo",
  "repository": "gitlab:user/repo"
}
```

如果包的 `package.json` 文件不在项目根目录中（只是一个子目录），你可以指定它所在的目录：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react-dom"
  }
}
```

#### scripts

scripts 字段用于支持一些内置脚本及其预设的生命周期事件以及任意脚本。这些脚本可以通过运行 `npm run-script` 或 `npm run` 执行 。 脚本运行时，其对应的，名称中带有 pre 和 post 的命令也将运行（如：premyscript、myscript、 postmyscript）。依赖项中的脚本可以使用 npm explore、npm run 执行。

```json
{
  "scripts": {
    "precompress": "将在 compress 脚本之前运行",
    "compress": "运行 compress 脚本压缩文件",
    "postcompress": "将在 compress 脚本之后运行"
  }
}
```

运行 `npm run compress` 时，这个三个脚本都会运行。

##### 有一些特殊的生命周期脚本只在某些情况下发生：

* **prepare：** 
  - 在打包、发布之前触发，比如：`npm publish`、`npm pack`；
  - 本地运行 `npm install` （没有任何参数）时触发；
  - `prepublish` 之后，`prepublishOnly` 之前触发；
  - 注意：如果通过 git 安装的包包含 `prepare` 脚本，则它的 `dependencies`、`devDependencies` 会被安装，且 prepare 脚本也会在打包和安装时触发；
  - 在 npm@7，这些脚本在后台运行。要查看输出，请运行：`--foreground-scripts`。

* **prepublishOnly：** 在准备打包和包装之前运行，仅在 `npm publish`。
* **prepack：** 
  * 在打包源码之前运行（如：`npm pack`、`npm publish` 以及安装 Git 依赖项时）触发；
  * 注意：`npm run pack` 与 `npm pack` 不同。`npm run pack` 是用户自定义的脚本名称，而 `npm pack` 是 CLI 定义的命令。
* **postpack：** 在生成压缩包之后，被移动到最终目的地之前运行（publish 不会在本地保存压缩包）。

##### 一些 npm 指令的生命周期顺序：

* **npm cache add|npm diff：** prepare；
* **npm ci|npm install：** preinstall --> install > postinstall > prepublish > preprepare > prepare > postprepare；
* **npm pack**： prepack > prepare > postpack；
* **npm publish**： prepublishOnly > prepack > prepare > postpack > publish > postpublish；
* **npm rebuild**： preinstall > install > postinstall > prepare；
* **npm restart|npm start|npm stop|npm test**： pre<脚本名称> > <脚本名称>  > post<脚本名称]>；
* **npm run <用户自定义的脚本名称>**： pre<用户自定义的脚本名称> > <用户自定义的脚本名称> > post<用户自定义的脚本名称>；

**注意：** npm v6 的 uninstall 有生命周期，但在 npm v7 没有了。

##### 在当前包下自定义可执行脚本：

```json
{
  "name" : "foo",
  "dependencies" : {
    "bar" : "0.1.x"
  },
  "scripts": {
    "start" : "bar ./test"
  }
}
```

然后，可以运行 `npm start` 以执行 `bar ./test` ，该脚本在 `npm install` 会被导出 到 `node_modules/.bin`。

##### package.json 变量

package.json 中字段，会自动加上 `npm_package_` 前缀，并添加到环境变量中，可以在包脚本中引用：

```js
/* var.js */
console.log(process.env.npm_package_name, process.env.npm_package_version)
console.log(process.env.npm_package_scripts_test)
```

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "var": "node ./bin_test.js"
  }
}
```

运行 `npm run var `，即查看输出结果。

##### 退出

脚本执行后，会将参数传递给 sh。如果脚本不是以 0 退出，那么这将中止该过程。

**注意：** 这些脚本文件不必是 Node.js 甚至 JavaScript 程序，但它们必须是某种可执行文件。

### config

config 用于配置一些参数，以便在包脚本中使用：

```json
{
  "name": "foo",
  "config": {
    "port": "8080"
  }
}
```

包脚本可以在环境变量中，引用配置的参数：`npm_package_config_port`。

### dependencies（项目依赖）

dependencies 字段用于指定当前包所依赖的包，是一个简单对象。该对象以包名称为 Key，value 值可以是包对应的版本范围（一外或多个版本描述，多个描述用空格分隔），或者指定 tarball 或 git 的 URL 标识。

**注意：** 不要在 dependencies 字段放置一些用于测试、编辑或其他开发时用到的包。这些应该放在devDependencies 字段。

##### 指定版本范围（遵循[semver](https://github.com/npm/node-semver#versions)）：

- **version：** 完全匹配；

- **>version：** 大于 version；

- **>=version：** 大于等 version；

- **<version：** 小于 version；

- **<=version：** 小于等于 version；

- **~version：** version 指定了次要版本，则允许补丁级别的更改；如果没有，则允许次要版本的更改；

  ```shell
  ~1.2.3 等价于 >=1.2.3 <1.3.0-0
  ~1.2   等价于 >=1.2.0 <1.3.0-0   同 1.2.x
  ~1     等价于 >=1.0.0 <2.0.0-0   同 1.x
  ~0.2   等价于 >=0.2.0 <0.3.0-0   同 0.2.x
  ~1.2.3-beta.2 等价于 >=1.2.3-beta.2 <1.3.0-0 请注意：只允许更改 1.2.3 版本中，预发布版本 >=beta.2 的版本。如，1.2.3-beta.4，但 1.2.4-beta.2 是不允许的。
  ```

- **^version：** 不允许修改 version 最左边的非零主版本号；如果是零，则只允许补丁版本更改；

  ```shell
  ^1.2.3 等价于 >=1.2.3 <2.0.0-0
  ^0.2.3 等价于 >=0.2.3 <0.3.0-0
  ^0.0.3 等价于 >=0.0.3 <0.0.4-0
  ^1.2.3-beta.2 等价于 >=1.2.3-beta.2 <2.0.0
  ^0.0.3-beta   等价于 >=0.0.3-beta <0.0.4-0
  
  ^1.x 等价于 >=1.0.0 <2.0.0-0
  ^0.x 等价于 >=0.0.0 <1.0.0-0
  ```

- **1.2.x：** 1.2.0、1.2.1 等，但不是 1.3.0；

- **version1 - version2：** 等价于 `>=version1 <=version2`；

- **range1 || range2：** range1 或者 range2；

- **tag：** 指定带 tag 的特定版本，如：`latest`；

- ***|空字符：** 匹配任何版本；

- **tarball URL**

- **Git URL**

- **GitHub URL**

- 本地路径

##### tarball URL

指定一个压缩包的 URL 来代替版本范围，该压缩包将在安装时下载并安装到本地项目中。

```json
{
  "dependencies": {
    "asd": "http://asdf.com/asdf.tar.gz"
  }
}
```

##### Git URL

指定一个有效的 Git URL。

```shell
git+ssh://git@github.com:npm/cli.git#v1.0.27
git+ssh://git@github.com:npm/cli#semver:^5.0
git+https://isaacs@github.com/npm/cli.git
git://github.com/npm/cli.git#v1.0.27
```

##### GitHub URL

指定一个有效的 GitHub URL。

```shell
expressjs/express
mochajs/mocha#4727d357ea
user/repo#feature\/branch
```

##### 本地路径

指定本地目录下的一个包的路径。

```shell
../foo/bar
~/foo/bar
./foo/bar
/foo/bar
```

执行 `npm install -S` 指定时，这些路径会被规范化为相对路径，并保存在 `package.json` 文件中，如：

```json
{
  "dependencies": {
    "bar": "file:../foo/bar"
  }
}
```

这在本地离线开发或者调试 npm 包时很有帮助。

### devDependencies（开发依赖）

devDependencies 字段用于定义开发时依赖的包，配置方式与 dependencies 类似，不同的是，devDependencies 定义的应该是一些开发时依赖的包，比如：测试工具、编辑转换器等。

因为，如果其他开发者在他们的项目下引用了你的 npm 包，那么他们可能不想或不需要下载和构建您使用的开发或测试相关的一些。他们在运行 `npm i your-program` 时，会安装对应 package.json 文件下 dependencies 字段指定的依赖，但不会安装 devDependencies 字段的。

但是，如果他们将你的项目下载到了本地，他们在本地的该项目目录下运行 `npm install`，则会安装  dependencies 和 devDependencies 下的依赖，以便他们开发或者测试该项目。

### peerDependencies（对等依赖）

peerDependencies 字段用于表达包与宿主包（比如：包 A1 是在必需在 包 A 的环境下运行，则称 A 是 A1 的宿主包，而 A1 称为 A 的一个插件）的依赖关系。

比如：

```json
{
  "name": "tea-latte",
  "version": "1.3.5",
  "peerDependencies": {
    "tea": "2.x"
  }
}
```

即，告诉系统：我只在我的宿主包 `tea` 的 `2.x` 版本下工作，如果你安装我，请确保它跟我一起安装，并且位于同一级目录下。

随后，运行 `npm install tea-latte` 可能会产生以下依赖关系图：

```shell
├── tea-latte@1.3.5
└── tea@2.2.0
```

**注意：** 两者是同级的，也就是说，`tea` 不是嵌套在 `tea-latte ` 的 `node_modules` 下的。

**注意：** 如果当前目录下已经有一个 `tea` 包，且版本不匹配 peerDependencies 指定的 `2.x`，你尝试执行`npm i tea-latte` 时，会收到错误消息。

**注意：** npm 版本 1、2 和 7 将自动安装 peerDependencies，如果它们在依赖关系树中的没有明确指定依赖于更高版本。对于 npm 版本 3 到 6，您将收到未安装 peerDependency 的警告。

**一条建议：** 如果依赖关系树，尝试安装另一个具有冲突的插件可能会导致错误。出于这个原因，请确保你的插件 peerDependencies 字段中指定的**版本范围尽可能广泛**，而不是锁定到特定的补丁版本。

### peerDependenciesMeta

当用户安装你的包时，如果指定的包 peerDependencies 尚未安装，npm 将发出警告。

peerDependenciesMeta 字段用于为 npm 提供有关如何使用对等依赖项的更多信息。

```json
{
  "name": "tea-latte",
  "version": "1.3.5",
  "peerDependencies": {
    "tea": "2.x",
    "soy-milk": "1.2"
  },
  "peerDependenciesMeta": {
    "soy-milk": {
      "optional": true
    }
  }
}
```

### bundledDependencies（捆绑依赖）

bundledDependencies 字段主要用于你需要在本地保存 npm 包或通过单个文件下载并使用它们时，你可以通过在指定一个包名的数组中并执行 `npm pack`。

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": [
    "renderized",
    "super-streams"
  ]
}
```

通过运行 `npm pack` 来获取 `awesome-web-framework-1.0.0.tgz` 文件。该文件包含依赖项 `renderized`、`super-streams`，可以通过执行 `npm install awesome-web-framework-1.0.0.tgz` 将其安装到新项目中。

### optionalDependencies（可选依赖）

optionalDependencies 字段用于指定一些可选依赖，这样，在安装 dependency 找不到包或安装失败时，npm 仍能继续执行。

其安装逻辑类似：

```json
try {
  var foo = require('foo')
	var fooVersion = require('foo/package.json').version
} catch (er) {
  foo = null
}
if ( notGoodFooVersion(fooVersion) ) {
  foo = null
}
if (foo) {
  foo.doFooThings()
}
```

**注意：** 运行 `npm install --no-optional` 将阻止安装这些依赖项。

**注意：** optionalDependencies 将覆盖 dependencies 同名的包，因此通常只在一处定义即可。

### overrides

overrides 字段用于指定对 dependencies 字段中的依赖修改。

overrides 提供了一种将依赖关系树中的包替换为另一个版本或完全替换为另一个包的方法。这些更改可以根据需要确定具体或模糊的范围。

比如，确保无论 dependencies 依赖什么版本，foo 包始终安装 `1.0.0` 版本：

```json
{
  "overrides": {
    "foo": "1.0.0"
  }
}
```

以上是简写，完整的对象允许覆盖包本身以及包的子项。

比如，将 foo 包下，任何位置的 bar 包指定 `1.0.0`：

```json
{
  "overrides": {
    "foo": {
      ".": "1.0.0",
      "bar": "1.0.0"
    }
  }
}
```

或者，仅指定它的子包（或孙子，或曾孙等）：

```json
{
  "overrides": {
    "bar": {
      "foo": "1.0.0"
    }
  }
}
```

也可以嵌套任意层，且可以指定版本或版本范围：

```json
{
  "overrides": {
    "baz@2.0.0": {
      "bar": {
        "foo": "1.0.0"
      }
    }
  }
}
```

当 dependencies 指定的版本范围和 overrides 不匹配时，会报错，你可以用以下方法解决：

```json
{
  "dependencies": {
    "foo": "^1.0.0"
  },
  "overrides": {
    // 不好，会抛出 EOVERRIDE 错误
    // "foo": "^2.0.0"
    // 好，符合匹配，因此允许覆盖
    // "foo": "^1.0.0"
    // 最好，override 定义为依赖的一个引用，该引用不需要做版本匹配
    "foo": "$foo"
  }
}
```

### engines（引擎）

engines 用于指定你的包适用的 node 或者 npm 版本，默认是 `*`，即适用任何版本：

```json
{
  "engines": {
    "node": ">=0.10.3 <15",
    "npm": "~1.0.20"
  }
}
```

除非用户在配置文件中设置了 `engine-strict` 标志，否则该字段仅是建议性的，并且只在包作为依赖项安装时发出警告。

### os

os 字段用于指定包允许（或者不允许）在哪些操作系统上运行。

```json
{
  "os": [
    "darwin",
    "linux",
    "!win32"
  ]
}
```

当前主机的操作系统的值来自 `process.platform`。

### cpu

cpu 字段用于指定包允许（或者不允许）在哪些 CPU 架构上运行。

```json
{
  "cpu": [
    "x64",
    "ia32",
    "!arm",
    "!mips"
  ]
}
```

当前主机的 CPU 架构的值来自 `process.arch`。

### private

private 字段用于是否允许发布该包，为 `true` 则拒绝发布 。这是一种防止意外发布私有存储库的方法。

如果你想确保给定的包只发布到特定的仓库（如，内部仓库），请使用下方的 publishConfig 字段中的 registry 属性中配置参数。

### publishConfig

publishConfig 字段用于定义一组将在发布时使用的配置值，比如，tag、registry、access。

请参阅 config 查看可以覆盖的配置选项列表。

### workspaces

workspaces 字段指定一个文件匹配符的数组，用于描述了本地文件系统中的工作空间的位置。

如，只要有有效的 package.Json文件，将 `./packages` 内的文件夹被视为工作区：

```json
{
  "name": "workspace-example",
  "workspaces": [
    "./packages/*"
  ]
}
```

### 默认值

npm 将根据包内容默认一些值。

- `"scripts": {"start": "node server.js"}`

  如果根目录下有 `server.js`，则 npm 将默认 `start` 命令为 `node server.js`。

- `"scripts":{"install": "node-gyp rebuild"}`

  如果根目录下有 `binding.gyp` 文件，且没有定义 `install` o r`preinstall` 脚本，npm 将默认 `install` 使用 `node-gyp rebuild` 命令。

- `"contributors": [...]`

  如果根目录下有一个 `AUTHORS` 文件，npm 会将每一行视为一种 `Name  (url)` 格式，其中 email 和 url 是可选的。以 `#` 或空格开头行将被忽略。

### 常见问题

#### npm ci 和 npm install 的区别

npm ci 和 npm install 类似，不同之处在于 npm ci 旨在用于自动化环境，例如测试平台、持续集成和部署，或者您希望确保对依赖项进行全新安装。

npm ci 在以下情况下会明显更快：

* 存在 package-lock.json 或 npm-shrinkwrap.json 文件
* node_modules 不存在或为空目录

npm install 和 npm ci 的主要区别：

* 项目必须有 package-lock.json 或 npm-shrinkwrap.json，否则无法使用 npm ci；
* 如果 package-lock.json 中的依赖项与 package.json 中的依赖项不匹配，则 npm ci 将退出并显示错误，而不是更新 package-lock.json；
* npm ci 一次只能安装整个项目，而无法添加单个依赖项；
* npm ci 开始安装之前自动删除node_modules文件夹；
* npm ci 不会更改 package.json 和 package-lock.json。

当我们执行 CI/CD 或生产发布时，最好使用 npm ci：它会清理 node_modules 文件夹，严格按照 package-lock.json 中指定版本进行安装，并且会对比 package-lock.json 和 package.json 依赖，防止由错误的依赖版本造成的故障且执行速度更快。 

#### package.json 和 package-lock.json 的区别

为什么有了package.json，还需要 package-lock.json 文件呢？当 node_modules 文件夹并不存在或被删除时，需要用到 npm install 重新装载全部依赖时，通过 package-lock.json 可以直接表明下载地址和相关依赖，相对下载速度也更快，也不容易报错。

### 参考资料

[NPM package-json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)

[Node.js 中文网 - package.json 指南](http://nodejs.cn/learn/the-package-json-guide)

