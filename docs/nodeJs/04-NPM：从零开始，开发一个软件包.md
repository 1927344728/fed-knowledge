# NPM：从零开始，开发一个软件包

[npm](https://www.npmjs.com/) (Node Package Manager) 本来是 Node.js 的包管理工具，但随着JS这几年的蓬勃发展，现在 npm 已经成为了几乎所有跟 JS 相关的工具和软件包的管理工具，并且还在不断的发展完善中。

现在最新版的 Node.js 的安装都会自带npm，装上Node.js就可以使用npm。

### 初始化项目

发布一个 npm 代码包，本质上就是将你的代码公开在 `https://www.npmjs.com/` 网上。使用者可以通过 `npm install [npm包名]`，来引入你的代码。关键在于两点：

* 输出的 Js 文件，也就是代码主体。如：通常输出到``lib/index.js`。
* `package.json` 配置中指明你的输出文件的位置。这个是通过`main`属性来指定的

初始化项目，就是要创建一个 `package.json` 文件，其中模块的名字和版本号是必填项。可以手动创建，也可以用 `npm init` 自动创建。

`package.json`部分字段说明：[package.json参数详解](https://www.jianshu.com/p/0863270e14d4)

```json
{
  name: '', //插件的名字
  version: '', //插件版本号
  description: '', //插件描述
  author: '', //作者名
  main: '', //入口文件路径，require(name)将根据这个路径来引入
  files: '', //文件夹名，所有文件都会被包含进项目中(除非是那些在其他规则中被忽略的文件)
  bin: {}, //许多包有一个或多个可执行文件希望被安装到系统路径。提供一个bin字段，它是一个命令名和本地文件名的映射。在安装时，如果是全局安装，npm将会使用符号链接把这些文件链接到prefix/bin，如果是本地安装，会链接到./node_modules/.bin/。
  keywords: '', //关键词，使用数组形式，方便npm官网搜索
  scripts: {}, //命令行，通过npm run 执行
  license: '', //许可证书，一般开源是MIT
  homepage: '', //项目主页的url
  repository: '', //github仓库项目地址
}
```

![image-20201103231118837](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20201103231118837.png)

### 开发

这个可以很灵活，具体开发取决由 npm 包的复杂度。

* 可以是简单的，直接在`lib`文件夹下，创建一个只有一行代码的`console.log(Hello World!)`的`JS`文件；也可以采用`webpack + vue`之类的框架，开发一个复杂的项目，将最终编译出来的`JS`文件输出到`lib`文件夹。
* 可以给项目加`eslint`等代码校验
* 编写测试模块，如：`mocha` 和 `chai`
* 可以用`gitlab CI`类的方式实现自动化部署
* 可以创建`readme.md`文档，编写使用说明

### 测试

##### 相对路径安装

进入测试项目目录，用相对路径安装包。安装完后，可以在 `node_modules` 文件夹检查是否安装成功。

```
cd [项目目录]
npm install [包的相对路径]
```

##### npm link 测试

**相对路径安装**找路径比较麻烦，所以我们推荐使用 `npm link` 将 npm 包链接到全局，再安装到本地项目。

首先，定位到 npm 包项目的目录下，运行 `npm link`。

```shell
cd [npm包项目]
npm link
# 执行后，输出/usr/local/lib/node_modules/[插件项目名称] -> /Users/${whoami}/Documents/[插件项目路径]/[插件项目名称]
```

意思是将 **npm包项目** 连接到全局的 `node_modules` 下（全局 `node_modules` 目录下可以看到该 npm 包）。

然后，定位到需要测试项目，运行 `npm link [package-name]`，将 npm 包安装到当前项目。npm 包的修改，在 build 后，会同步更新到当前项目的 `node_modules`。

```shell
cd [需要使用 npm 包的项目目录]
npm link [package-name]
# /Users/[whoami]/Documents/[project-path]/node_modules/[package-name] -> /usr/local/lib/node_modules/[package-name] -> /Users/[whoami]/Documents/[project-path]/[package-name]
```

测试完成后，在 npm 包项目取消连接：

```
cd [npm包项目]
npm unlink
```

### 发布

* 注册：`npm adduser`

* 判断是否登录：`npm whoami`

* 登录：`npm login`

* 发布：`npm publish`。每次发布，必须修改版本号。版本号更新，要遵循 `Semver(语义化版本号)` 规范：
  * 升级补丁版本号：npm version patch
  * 升级小版本号：npm version minor
  * 升级大版本号：npm version major

* 删除：**根据规范，只有在发包的24小时内才允许撤销发布的包。**即使是你删除了，也只是无法被搜索到，仍可以通过链接直接访问。

  ```shell
  npm unpublish --force
  ```


### 使用

安装：`npm install [npm包名]`

使用：`import "[npm包名]`或者`import Obj, {Obj1, Obj2} from 'npm包名'`

### 权限转让

要使用 CLI 将软件包传输给另一个 npm 用户，请依次运行 `npm owner add` 和 `rm` 命令。

```shell
npm owner add <their-username> <package-name>
npm owner rm <your-username> <package-name>
```

如果您为写入启用了双重身份验证，则将一次性密码添加到参数 --otp：

```shell
# 其中123456是来自身份验证器应用程序的代码
npm owner add <their-username> <package-name> --otp=123456
npm owner rm <your-username> <package-name> --otp=123456
```

### 相关问题

#### npm link 失败

**实际场景一：** 将正在开发的 npm 包，通过 npm link 引入业务项目中调试时报错：

```shell
Module build failed: TypeError: Invalid PostCSS Plugin found at: plugins[0]
```

原因是包所在的项目中的 postcss 配置文件中的一些插件，在业务项目中没有安装。

**解决方法：** 一是修改 npm 包项目的 postcss 配置文件；二是业务项目中，忽略项目外的配置文件。

**实际场景二：** node 版本原因。

如果使用类似 nvm 的 Nodejs 的版本管理器，默认情况下，nvm 会为您安装的每个节点版本创建一个不同的全局  node_modules 文件夹。

运行时 npm link，将使用项目中使用的特定版本的节点来创建链接，这意味着只有使用相同版本节点的项目才能访问本地版本的依赖项。**更令人沮丧的是，npm link 在发生这种情况时不会抛出错误。**

**解决方法：** 在开发的 npm 包项目和业务项目，运行 `nvm use` 命令，使用相同的 Nodejs 版本。注意：即使用 node -v 命令查看，两个项目的 Nodejs 版本是相同的，也建议重新指定下相同版本。

**实际场景三：** 如果业务项目运行 npm i 安装了其他包，需要重新运行 npm link [package-name]。

#### npm publish报错

报错`[no_perms] Private mode enable, only admin can publish this module [no_perms] Private mode enable, only admin can publish this module`

**出现原因：**使用的是淘宝源`cnpm`，登陆到的是`npm`

**解决方法：**切换到 `npmjs `的网址，代码如下：`npm config set registry http://registry.npmjs.org/`。也可以用nrm管理源。

### 参考资料

[Why Your npm link Commands Might Be Failing](https://dev.to/rubengmurray/why-your-npm-link-commands-might-be-failing-4ncj)