## Node.js：三种调试方法

### 内置调试（Node inspector）

`Node.js` 包含了一个进程外的调试实用程序，可通过 V8 检查器或内置的调试客户端访问。 

**启动：**`node inspect --port=[9229] [nodeFile]`

#### 单步执行

- `cont`, `c`: 继续执行。
- `next`, `n`: 单步执行下一行。
- `step`, `s`: 单步进入。
- `out`, `o`: 单步退出。
- `pause`: 暂停运行中的代码（类似于开发者工具中的暂停按钮）。

#### 断点

- `setBreakpoint()`, `sb()`: 在当前行上设置断点。
- `setBreakpoint(line)`, `sb(line)`: 在指定行上设置断点。
- `setBreakpoint('fn()')`, `sb(...)`: 在函数体的第一个语句上设置断点。
- `setBreakpoint('script.js', 1)`, `sb(...)`: 在 `script.js` 的第一行上设置断点。
- `clearBreakpoint('script.js', 1)`, `cb(...)`: 清除 `script.js` 中第一行上的断点。

#### 信息

- `backtrace`, `bt`: 打印当前执行帧的回溯。
- `list(5)`: 列出脚本源码的 5 行上下文（前后各 5 行）。
- `watch(expr)`: 将表达式添加到监视列表。
- `unwatch(expr)`: 从监视列表中移除表达式。
- `watchers`: 列出所有的监视器和它们的值（在每个断点上自动地列出）。
- `repl`: 打开调试器的 repl，用于调试脚本的上下文中的执行。
- `exec expr`: 在调试脚本的上下文中执行一个表达式。

#### 执行的控制

- `run`: 运行脚本（在调试器启动时自动地运行）。
- `restart`: 重启脚本。
- `kill`: 杀死脚本。

#### 杂项

- `scripts`: 列出所有已加载的脚本。
- `version`: 显示 V8 的版本。

运行命令行，终端提示错误：`Timeout (2000) waiting for 127.0.0.1:9229 to be free`。这并不是端口被占用的问题，是`node inspect`在打开端口超时的一个bug。可以尝试升级`node-inspect`版本，或者修改`node.exe`的超时配置。https://github.com/nodejs/node-inspect/issues/48



### V8 检查器

`V8` 检查器的集成允许将 `Chrome `开发者工具附加到 `Node.js` 实例，以便进行调试和性能分析。 它使用了 [Chrome 开发者工具协议](http://nodejs.cn/s/YpFEVu)。

**启动：**

```shell
node --inspect [nodeFile]
# 指定端口
node --inspect=[port] [nodeFile]
# 在应用程序代码的第一行进行断点
node --inspect-brk [nodeFile]
```

```console
$ node --inspect-brk debug/index.js
Debugger listening on ws://127.0.0.1:9229/1dc7da88-983c-4fbe-a8e3-2d5f256e98af
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
```

**开始调试**：在 Chrome 浏览器的地址栏，键入 `chrome://inspect`或者`about:inspect`，回车后就可以看到下面的界面。

![image-20200802195554438](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802195554438.png)

![image-20200802195718540](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200802195718540.png)

#### NIM

每次调试 `Node.js `都要打开隐藏那么深的入口是不是很烦？还好我们有 `NIM`。`NIM（Node Inspector Manager）`是一个 `Chrome `插件，可以帮助我们快捷地打开 `DevTools`，也可以设置自动发现并打开 `DevTools`。

#### inspect-process

如果你觉得 `NIM `用起来也麻烦，那你可能需要` inspect-process`。

全局安装：`npm i inspect-process -g`
命令：` inspect app.js`
`inspect-process` 会自动调起 `Chrome DevTools`，然后定位到` app.js`，其余用法与 `Chrome DevTools` 一致。

#### process._debugProcess

如果一个 `Node.js` 进程已经启动，没有添加 `—inspect` 参数，我们不想重启（会丢失现场）又想调试怎么办？这时可以用 `process._debugProcess`。使用方法如下：

1. 通过 `ps `命令或者 `pgrep -n node` 查看当前启动的 `Node.js` 进程的 `pid`，例如：53911。

   ```shell
    ps ax | grep app.js 
   ```

2. 打开新的终端，运行：`node -e "process._debugProcess(53911)"`，原来的 `Node.js` 进程会打印出：`Debugger listening on ws://127.0.0.1:9229/2331fa07-32af-45eb-a1a8-bead7a0ab905`。

3. 调出 `Chrome DevTools` 进行调试。



#### [node inspect 和 node --inspect区别](https://github.com/nodejs/node-inspect/issues/48)

- `node --inspect`:  调试app.js，但暴露了远程调试接口，像`vscode, Chrome devtools, Intellij`等可以附加。另外，`app.js`可以正常运行，并可在终端完全控制。
- `node inspect`:  在`node`绑定的交互式`CLI`调试器。它是可以代替`vscode`或`Chrome devtools`等可视化调试器。另外，`CLI`调试器可使用`node --inspect`在单独的进程中启动脚本并附加到它。

两者之间的关系更加明显体现在更多的流和支持跨机器的远程调试:

```
# Start app.js with the inspect interface exposed, by default on port 9229:
node --inspect app.js
# In a separate terminal, start the inspect client against port 9229:
node inspect -p 9229
```

`node --inspect app.js`运行后，`CLI`调试器(`node inspect`连接到可用的调试界面进程了（`node --inspect`）。



### [Visual Studio Code](https://code.visualstudio.com/)

* `Vscode`编辑器的调试是通过插件来实现的。`Node.js` 的调试器是` VS Code` 默认就支持的，而`JavaScript`的调试，需要安装`Debugger for Chrome`插件。在左侧栏单击`Extensions`按钮，搜索`Debugger for Chrome`并点击安装。

* 左侧栏单击`run`按钮，打开调试栏。

* 单击左侧栏上方的配置按钮，打开`laungh.json`文件，并进行配置。

  ```json
  {
      // Use IntelliSense to learn about possible attributes.
      // Hover to view descriptions of existing attributes.
      // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
      "version": "0.2.0",
      "configurations": [
          {
              "type": "node-launch",
              "request": "launch",
              "name": "Launch NodeJs",
              "skipFiles": [
                  "<node_internals>/**"
              ],
              "program": "${workspaceFolder}\\nodeDemo\\debug\\index.js"
          },
          {
              "type": "node-attach",
              "request": "attach",
              "name": "Attach by Process ID",
              "processId": "${command:PickProcess}",
              "skipFiles": [
                  "<node_internals>/**"
              ]
          },
          {
              "name": "Launch 15-canvas入门篇.html",
              "type": "chrome",
              "request": "launch",
              "sourceMaps": false,
              "file": "${workspaceRoot}\\htmlDemo\\15-canvas入门篇.html"
          }
      ]
  }
  ```

* 在左侧栏上方选择相应的启动选项。注：如果没有配置项，并且本地有`index.js` 文件，是直接执行了这个文件。

* 在左侧栏上方单击`start Debugging`。

  ![image-20200803225503444.png](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200803225503444.png)

  ![image-20200803225915556.png](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200803225915556.png)

#### 配置launch.json

`VS Code` 提供了调试界面，但是并没有将调试配置统一起来，而是将它的自由度完全交给调试器本身，我们在` launch.json` 里书写的调试配置，其实就是调试器的配置或者参数，只不过它的格式是 `JSON`。

```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch NodeJs",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "program": "${workspaceFolder}\\nodeDemo\\debug\\index.js"
}
```

- **type：**必填项，代表着调试器的类型。它决定了` VS Code` 会使用哪个调试插件来调试代码。具体值如：`node`、`chrome`。

- **request：**必填项，代表着该如何启动调试器，有两个值： `launch` 和 `attach`。前者的意思就是 `VSCode `会使用调试器直接启动代码并且调试，后者的意思是你已经打开了程序，然后接通 `Node.js` 的内部调试协议进行调试。

- **name：**该配置的名字。调试时，可在调试栏上方选择运行哪个配置。

- **program：**就是告诉 `Node.js` 调试器，我们想要调试哪个文件。这个值支持预定义参数，比如：`${file}`，也就是当前编辑器里打开的文件；`${workspaceFolder}` 是代表当前工作区文件夹地址。

  > MacOS 或者 Linux 的书写方式 ：`"program": "path/app.js"`
  >
  > Windows 平台指定特定的书写方式：`program": path\\app.js`

这四个属性中，`type`、`request`是 `VS Code` 预先定义好的属性，每个调试器插件都会按照一样的方式去阅读和理解它的值；而`name`、`program`的定义和最终解释，都是由调试插件控制的，`VS Code` 并不会对它们做任何的约束和处理。

虽然每个调试器各自控制着用户可以使用哪些属性，但是调试器之间还是有很多相同的地方，调试插件在很多时候都会使用相同的属性名来代表同样的功能。经常使用的有下面这些：

- `program` 一般用于指定将要调试的文件。
- `stopOnEntry`，当调试器启动后，是否在第一行代码处暂停代码的执行。
- `args` 把参数传给将要被调试的代码。
- `env` 环境变量。大部分调试器都使用它来控制调试进程的特殊环境变量。
- `cwd` 控制调试程序的工作目录。
- `port` 是调试时使用的端口。



### 参考链接

[node 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)

[Node 调试工具入门教程](http://www.ruanyifeng.com/blog/2018/03/node-debugger.html)

[VSCode 代码调试器](https://geek-docs.com/vscode/vscode-tutorials/vscode-code-debugger.html)