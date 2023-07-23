### NPM：常用命令

NPM的全称是 `Node Package Manager`，是随同NodeJS一起安装的包管理和分发工具，它很方便让`JavaScript`开发者下载、安装、上传以及管理已经安装的包。

### 常用命令

```shell
npm -h # 列出帮助信息
npm <command> -h # 列出该命令的帮助信息
npm help <term> # 查看帮助信息
npm -l #列出全部可用命令
npm -v #列出npm版本号

npm init # 初始化一个基于node的项目，会创建一个配置文件package.json
npm init --yes # 全部使用默认配置

npm config set <key> <value> # 设置配置
npm config delete <key> # 删除配置
npm config list #查看全部配置

npm install [-g] <pkg>[@<version>] # 安装指定包。默认本地安装，-g全局安装
npm install <pkg>[@<version>]  --save # 安装运行时依赖包
npm install <pkg>[@<version>]  --save-dev # 安装开发时依赖包
npm install <pkg>[@<version>] <pkg>[@<version>] # 一次性安装多个
npm uninstall [-g] <pkg>[@<version>] # 卸载指定包
npm update <pkg>[@<version>] # 更新包
npm update <pkg>[@<version>] -g # 更新全局包

npm root # 查看当前包的安装路径
npm root -g #查看全局npm安装的路径

npm search pkg # 查看指定包是否存在
tree -d # 以树状图的方式列出一个项目下所有依赖的物理结构
npm ls # 查看当前目录下安装了那些包
npm ls <pkg> # 查看特定package的信息
npm ls -g # 查看全局安装的包
npm info <pkg> # 查看包的信息
npm view <pkg> # 查看包的信息
npm info <pkg> # 查看包的信息
npm show <pkg> # 查看包的信息
npm v <pkg> # 查看包的信息

npm login #登录
npm whoami #查看当前用户

npm publish #发布项目
npm unpublish <name>[@<version>]#取消发布项目

npm config set registry <镜像源地址> # 设置源
npm install -g cnpm --registry=<镜像源地址> #安装cnpm工具
cnpm install <pkg>[@<version>] # 使用cnpm代替npm

npm cache clean --force # 清除缓存

npm install -g nrm # 安装nrm工具
nrm ls # 查看当前可用的镜像源
nrm use <镜像源名称> #切换npm源
```

### npm version 详解

npm version 获取当前的详细版本信息。

```shell
{
    npm: '6.9.0',
    ares: '1.15.0',
    brotli: '1.0.7',
    cldr: '35.1',
    http_parser: '2.8.0',
    icu: '64.2',
    llhttp: '1.1.3',
    modules: '72',
    napi: '4',
    nghttp2: '1.38.0',
    node: '12.2.0',
    openssl: '1.1.1b',
    tz: '2019a',
    unicode: '12.1',
    uv: '1.28.0',
    v8: '7.4.288.21-node.17',
    zlib: '1.2.11'
}
```

version 命令用法：

```shell
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

alias: verison
```

| 命令                   | 作用                                              | 示例                                 |
| ---------------------- | ------------------------------------------------- | ------------------------------------ |
| npm version prerelease | 增加预发布号                                      | 1.0.0 -> 1.0.1-0、1.0.1-0 -> 1.0.1-1 |
| npm version prepatch   | 升级小版本号，预发布号为 0                        | 1.0.1-1 -> 1.0.2-0                   |
| npm version preminor   | 升级中版本号，小号和预发布号为 0                  | 1.0.2-0 -> 1.1.0-0                   |
| npm version premajor   | 升级大版本号，中号、小号和预发布号为0             | 1.1.0-0 -> 2.0.0-0                   |
| npm version patch      | 去掉预发布号或者升级小版本号                      | 2.0.0-0 -> 2.0.0、2.0.0 -> 2.0.1     |
| npm version minor      | 去掉预发布号或者升级中版本号， 同时版本号设置为 0 | 2.0.1 -> 2.1.0                       |
| npm version major      | 去掉预发布号或者升级大版本号，其他位都置为 0      | 3.1.0 -> 4.0.0                       |

一些常用配置参数：

* allow-same-version：布尔值，默认 false，允许将新版本设置为与当前版本相同的值。
*  commit-hooks：布尔值，默认 true，使用命令时，运行 git commit 钩子。 
* git-tag-version：布尔值，默认 true，使用命令时，运行 git tag 命令。
* preid：字符串，默认 ''，使用 “预发布标识符” 用作 semver 的 “预发布” 部分的前缀，如，1.2.0-alpha.0 中的alpha。 