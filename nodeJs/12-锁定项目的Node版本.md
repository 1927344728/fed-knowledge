## 锁定项目的 Node 版本

项目运行所依赖的 Node.js 版本可能是不一样的。版本过高或过低，都有可能引发一些错误，而且通常也难以排查和修改。

为每个项目指定 Node.js 版本，可保证项目在一个稳定可预期的环境中运行，减少不必要的故障，也可以让其他开发人员快速启动项目，避免在 Node 版本兼容性问题上花费过多时间。

为项目指定 Node.js 版本，可以通过版本管理器，或者 package.json 添加相应属性来实现。

### nvm

nvm，全英文是 node.js version management，是一个 Node.js 版本管理工具！

nvm 和 n 都是 Node.js 版本管理工具，为了解决 Node.js 各种版本存在不兼容现象，通过它们可以安装和切换不同版本的 Node.js。

安装：`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`，需要重启终端。

通过在项目根目录创建一个 .nvmrc，其中写上需要的 Node.js 版本号。这个版本号不一定是数字，可以是 nvm 能够理解的其他别称，详见 nvm --help 中对 <version> 的描述。

```shell
# .nvmrc
14.*
```

执行如下命令时，会自动使用 `.nvmrc` 中的版本号：

- nvm use
- nvm install
- nvm exec
- nvm run
- nvm which

运行 `nvm use` 命令可以切换到相应版本。如果本地没有安装，运行 `nvm install` 命令会安装相应版本。

### engines

根据 npm-package 文档的描述，可以在 package.json 中通过 engines 属性指定 Node 的版本。

```json
// package.json
{
  "engines": { "node": ">=0.10.3 <0.12" }
}
```

```json
// package.json
{
  "engines": { "node": ">=0.10.3 <0.12" }
}
```

有趣的是，在执行 npm install 安装项目依赖时，这个设置并不生效，相反，非官方的 yarn 是有效（respect）的，它会检查这里的设置，如果当前环境与所需不匹配，直接报错，这是我们期望的结果。

**注意：** 使用 `npm i` 并不会按照 engines 的属性来报错，这是因为在 npm 中设置了 engine-strict 默认为 false。因此，需要创建 .npmrc 来显式的定义为 true：

```shell
# .npmrc
engine-strict=true
```

```shell
# node 版本不符合，报错如下：
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: ant-design-pro@1.0.0
npm ERR! notsup Not compatible with your version of node/npm: ant-design-pro@1.0.0
npm ERR! notsup Required: {"node":">=14.0.0 < 15.0.0"}
npm ERR! notsup Actual:   {"npm":"9.5.1","node":"v18.16.0"}
```

另外，也可以手动写脚本来解决：

* 创建一个 checkver.js 文件。
* 安装 semver，`npm i -D semver`。

```javascript
const semver = require("semver");
const { engines } = require("./package");
const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  console.error(</span>Required node version <span class="pl-s1"><span class="pl-pse">${</span>version<span class="pl-pse">}</span></span>, got: <span class="pl-s1"><span class="pl-pse">${</span><span class="pl-c1">process</span>.<span class="pl-c1">version</span><span class="pl-pse">}</span></span>.<span class="pl-pds">);
process.exit(1);
}
```

添加 postinstall 命令到 package.json：

```json
// package.json
{
  "scripts": {
    "postinstall": "node ./checkver.js"
  }
}
```

### 常用Node版本管理工具

* nvm：一款 Node.js 版本管理工具，允许用户通过命令行快速安装、切换和管理不同的 Node.js 版本。nvm 只适用于 macOS 和 Linux 用户的项目，如果是 Windows 用户，可以使用 nvm-windows 、nodist 或 nvs 替换。
* n：一款交互式的 Node.js 版本管理工具，没有子脚本，没有配置文件，也没有复杂的 API，使用起来非常简单。n 只适用于 macOS 和 Linux ，不适用于 Windows。
* fnm：一款快速简单的 Node.js 版本管理器，使用 Rust 构建。优点：跨平台支持，包括：macOS、Windows、Linux；适用于 .node-version 和 .nvmrc 文件。

### 参考资料

[限定项目的 Node.js 版本](https://www.cnblogs.com/Wayou/p/restrict_node_version.html)

[3 款非常实用的 Node.js 版本管理工具](https://segmentfault.com/a/1190000042281929#item-2)

[锁定项目 Node 版本和包管理器](https://segmentfault.com/a/1190000041918155)

