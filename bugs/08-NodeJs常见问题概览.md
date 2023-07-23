## NodeJs常见问题概览

#### 为什么node-sass总是安装失败？

安装 node-sass 有几个步骤：

* 校验本地 node_modules 中是否已安装 node-sass，版本是否一致；
* 如未安装或版本不符，从 npm 源安装 node-sass；
* 检测全局缓存和本地中是否有 binding.node，如有即跳过安装；
* 没有 binding.node 则从 github下载该二进制文件并将其缓存到全局；
* 假如 binding.node 下载失败，则尝试本地编译出该文件；
* 将版本信息写到 package-lock.json。

实际上，node-sass 依赖了一个二进制文件 binding.node，也就是说，npm 安装完 node-sass 后，还会从 github下载 binding.node。

安装 node-sass 失败原因有以下几种：

* **npm 源速度慢：** 解决方法，改用国内镜像源。
* **binding.node 源无法访问或速度慢：** 解决方法，改用国内镜像源。
* **node 版本与 node-sass 版本不兼容：** node-sass 版本兼容性并不好，老项目中依赖的 node-sass 很可能已经不兼容新的 node，对应版本兼容参考 [官方仓库](https://github.com/sass/node-sass)。解决方法，修改 node-sass 或 node 的版本。
* **缓存中 binding.node 版本不一致：** 本地 node 版本改了，或在不同机器上运行，node 版本不一致，会报类似错误。解决方法，按提示 `npm rebuild node-sass` 或清除缓存重新安装。
* **安装失败后重新安装：** 安装失败后重新安装，有可能无权限删除已安装内容。解决方法， `npm uninstall node-sass` 或手动删掉原目录后再安装。
* **提示没有安装 python、build 失败等：** 假如拉取 binding.node 失败，node-sass 会尝试在本地编译binding.node，过程就需要 python。

### 参考资料

[为什么node-sass总是安装失败？](https://segmentfault.com/a/1190000020993365)

