### npm常用命令

NPM的全称是 `Node Package Manager`，是随同NodeJS一起安装的包管理和分发工具，它很方便让`JavaScript`开发者下载、安装、上传以及管理已经安装的包。

```
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
npm ls # 查看当前目录下安装了那些包
npm ls <pkg> # 查看特定package的信息
npm ls -g # 查看全局安装的包
npm info # 查看包的信息

npm login #登录
npm whoami #查看当前用户

npm publish #发布项目
npm unpublish <name>[@<version>]#取消发布项目

npm config set registry <镜像源地址> # 设置源
npm install -g cnpm --registry=<镜像源地址> #安装cnpm工具
cnpm install <pkg>[@<version>] # 使用cnpm代替npm

npm install -g nrm # 安装nrm工具
nrm ls # 查看当前可用的镜像源
nrm use <镜像源名称> #切换npm源
```

