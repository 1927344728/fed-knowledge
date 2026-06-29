## Electron基础篇

Electron 是一个使用 JavaScript、HTML 和 CSS 构建**桌面应用程序**的框架。 嵌入 Chromium 和 Node.js 到 二进制的 Electron，允许使用 JavaScript 代码创建在 Windows、macOS 和 Linux 上运行的跨平台应用。

### 创建应用程序

#### 安装

在使用 Electron进行开发之前，需要安装 Node.js（**建议使用最新版本**）。

**注意：** 因为 Electron 将 Node.js 嵌入到其二进制文件中，应用运行时的 Node.js 版本与系统中运行的 Node.js 版本无关。

```shell
mkdir electron-app
cd my-electron-app
npm init
```

**注意：** entry point 应为 main.js；author、description 可为任意值，但对于应用打包是必填项。

```shell
npm install -S electron
```

在 package.json 文件，添加一条命令：

```json
// package.json
{
  "scripts": {
    "start": "electron ."
  }
}
```

#### main.js

在项目的根目录下创建一个 main.js 文件。

任何 Electron 应用程序的入口都是 main.js 文件，它控制了主进程。它运行在一个完整的 Node.js 环境中，负责控制应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程。

将一个页面加载进应用窗口，需要两个 Electron 模块：

* app 模块：控制应用程序的事件生命周期。
* BrowserWindow 模块：创建和管理应用程序窗口。

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 通过预加载脚本从渲染器访问Node.js
    // 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.openDevTools()
  win.loadFile('index.html')
}
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()

  // 如果没有任何浏览器窗口是打开的，则调用 createWindow() 方法
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭所有窗口时退出应用
// 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

```

#### index.html

在项目的根目录下创建一个 index.html 文件。

在 Electron 中，各个窗口显示的内容可以是本地 HTML 文件，也可以是一个远程url。

```html
<!--index.html-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>你好!</title>
  </head>
  <body>
    <h1>你好!</h1>
    我们正在使用 Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    和 Electron <span id="electron-version"></span>.
    <!--将脚本添加到渲染器进程，即 Web 环境-->
    <script src="./renderer.js"></script>
  </body>
</html>
```

#### preload.js

在项目的根目录下创建一个 preload.js 文件。

该文件是预加载脚本。预加载脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。它在渲染器进程加载之前加载，并有权访问两个 渲染器全局（例如 window 和 document）和 Node.js 环境。

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})
```

#### renderer.js

在项目的根目录下创建一个 renderer.js 文件。

该文件是渲染器脚本。渲染器脚本可以通过 index.html 文件 body 标签内添加 script 标签来加载。渲染器脚本运行在正常的 Web 环境中，其代码可以使用与前端开发相同的 JavaScript API 和工具。

> 出于安全原因，渲染进程默认跑在网页页面上，而并非 Node.js里。

```javascript
// renderer.js
const replaceText = (selector, text) => {
  const element = document.getElementById(selector)
  if (element) {
    element.innerText = text
  }
}
for (const dependency of ['chrome', 'node', 'electron']) {
  replaceText(`${dependency}-version`, versions[dependency]())
}

const funcPing = async () => {
  const response = await window.versions.ping()
  console.log(response)
}
funcPing()
```

#### 运行

在终端，定位到当前项目，运行 `npm start` 命令。

### 上下文隔离

上下文隔离功能将确保预加载脚本和 Electron 的内部逻辑运行在所加载的 webcontent 网页之外的另一个独立的上下文环境里。

这意味着，**预加载脚本访问的 window 对象并不是网站所能访问的 window 对象**。 例如，在预加载脚本中设置 window.hello = 'wave' 并且启用了上下文隔离，当网站尝试访问 window.hello 对象时将返回 undefined。

自 Electron 12 以来，默认情况下已启用上下文隔离，并且它是所有应用程序推荐的安全设置。

### 进程之间通信

Electron 的主进程和渲染进程有着清楚的分工并且不可互换。 这代表着无论是从渲染进程直接访问 Node.js 接口，亦或者是从主进程访问 HTML 文档对象模型 (DOM)，都是不可能的。

在 Electron 中，进程使用 ipcMain 和 ipcRenderer 模块，通过开发人员定义的 “通道” 传递消息来进行通信。 这些通道是 **任意** （随意命名）和 **双向** （可以在两个模块中使用相同的通道名称）的。

#### 渲染器进程到主进程（单向）

渲染器进程到主进程（单向），可以使用 ipcRenderer.send API 发送消息，然后使用 ipcMain.on API 接收。

* 使用 ipcMain.on 监听事件。
* 通过预加载脚本暴露 ipcRenderer.send。
* 预加载脚本中调用暴露的函数。

```javascript
// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
})
```

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

```javascript
// renderer.js
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})
```

#### 渲染器进程到主进程（双向）

渲染器进程到主进程（双向），可以通过将 ipcRenderer.invoke 与 ipcMain.handle 搭配使用来完成。

* 使用 ipcMain.handle 监听事件。
* 通过预加载脚本暴露 ipcRenderer.invoke。
* 预加载脚本中调用暴露的函数。

```javascript
// main.js
const { app, dialog, ipcMain } = require('electron')
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
})
```

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

```javascript
// renderer.js
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})
```

#### 主进程到渲染器进程

将消息从主进程发送到渲染器进程时，需要指定是哪一个渲染器接收消息。 消息需要通过其 WebContents 实例发送到渲染器进程。

* 使用 webContents 模块发送消息。
* 通过预加载脚本暴露 ipcRenderer.on。
* 预加载脚本中调用暴露的函数。

```javascript
// main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
  
  mainWindow.loadFile('index.html')
}
```

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
})
```

```javascript
// renderer.js
const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue.toString()
})
```

#### 渲染器进程到渲染器进程

没有直接的方法可以使用 ipcMain 和 ipcRenderer 模块在 Electron 中的渲染器进程之间发送消息。

提供两种方案：

* 将主进程作为渲染器之间的消息代理。 这需要将消息从一个渲染器发送到主进程，然后主进程将消息转发到另一个渲染器。
* 从主进程将一个 MessagePort 传递到两个渲染器。 这将允许在初始设置后渲染器之间直接进行通信。

### 开发调试

#### 调试主进程

主进程脚本是 main.js，是在 Node.js 环境下运行。

Node.js 的调试，有三种方法，具体查看[Node.Js：三种调试方法](https://lizh.gitbook.io/knowledge/nodejs/01node.js-san-zhong-tiao-shi-fang-fa)。

#### 调试渲染进程

最广泛使用来调试指定渲染进程的工具是 Chromium 的开发者工具集。它可以获取到所有的渲染进程，包括 BrowserWindow 的实例、BrowserView 以及WebView。

```javascript
// main.js
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  win.webContents.openDevTools()
  win.loadFile('index.html')
}
app.whenReady().then(() => {
  createWindow()
})
```

#### 开发者工具扩展

Electron 支持 Chrome DevTools 扩展，可用于扩展 Chrome 的开发人员工具的功能，以调试流行的 Web 框架。

* 使用工具加载 DevTools 扩展：electron-devtools-installer。

* 手动加载 DevTools 扩展：

  * 在 Google Chrome 中安装扩展。

  * 打开 chrome://extensions，找到扩展程序的 ID，像 fmkadmapgofadopljbjfkapdkoienihi 一样的 hash 字符串。

  * 找到 Chrome 扩展程序的存放目录。以 Mac 为例：~/Library/Application Support/Google/Chrome/Default/Extensions。

  * 在主进程的脚本加载该扩展程序。

    ```javascript
    // main.js
    const { app, session } = require('electron')
    const path = require('node:path')
    const os = require('node:os')
    
    // on macOS
    const reactDevToolsPath = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.9.0_0'
    )
    
    app.whenReady().then(async () => {
      await session.defaultSession.loadExtension(reactDevToolsPath)
    })
    ```

> Electron 仅支持 [有限的 `chrome.*` APIs ](https://www.electronjs.org/zh/docs/latest/api/extensions)，所以使用不支持的 `chrome.*` 扩展的 APIs 可能无法工作。

### 打包并分发应用程序

Electron 应用程序需要打包后分发给用户。

为了让应用程序受到用户系统的信任，您需要以数字签名证明可分发文件的内容是真实的并且未被代码签名篡改。 只要在应用配置中添加签名证书信息，您就可以通过 Forge 对其进行签名。

#### 使用 Electron Forge

最快捷的打包方式是使用 Electron Forge。

Electron Forge 是一个处理 Electron 应用程序打包与分发的一体化工具。 在工具底层，它将许多现有的 Electron 工具 （例如 electron-packager、 @electron/osx-sign、electron-winstaller 等）组合到一起。

安装 Electron Forge，并使用其 "import" 命令设置 Forge 的脚手架。

```shell
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

根目录下，新增一个 forge.config.js 文件，并且 Forge 会将一些脚本添加到根目录的 package.json 文件中：

```json
{
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  }
}
```

#### 创建一个可分发版本

使用 Forge 的 make 命令来创建可分发的应用程序。

```shell
npm run make
```

make 命令包含两步：

* 首先，运行 electron-forge package ，把应用程序代码与 Electron 二进制包结合起来。完成打包的代码将会被生成到一个特定的文件夹中。
* 然后，将使用这个文件夹为每个 maker 配置生成一个可分发文件。

默认情况下，在脚本运行后，应该在根目录下看到一个 `out` 文件夹，其中包括可分发文件与一个包含其源码的文件夹。

默认情况下，只会为当前的主机操作系统架构发布一个单一的可分发文件。 可以通过将 --arch 参数传递给 Forge 命令来发布不同的架构。

#### 对代码进行签名

代码签名是交付桌面应用程序的重要组成部分，并且它对于应用程序的自动更新功能来说是必需的。

代码签名是一种可用于证明桌面应用程序是由已知来源创建的安全技术。 Windows 和 macOS 拥有其特定的代码签名系统，这将使用户难以下载或启动未签名的应用程序。

在 macOS 上，代码签名是在应用程序打包时完成的。 而在 Windows 中，则是对可分发文件进行签名操作。 如果您已经拥有适用于 Windows 和 macOS 的代码签名证书，可以在 Forge 配置中设置您的凭据。

以 Mac 为例：

```javascript
// forge.config.js
module.exports = {
  packagerConfig: {
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID
    }
  }
}
```

### 发布和更新

发布应用到 GitHub 版本中心，并将自动更新功能整合到应用代码中。

#### 使用 update.electronjs.org

Electron 官方在 https://update.electronjs.org 上为开源应用程序提供了免费的自动更新服务。

 使用它有以下几点要求：

* 你的应用在 macOS 或 Windows 上运行。
* 你的应用有一个公开的 GitHub 仓库。
* 应用程序需要发布到 GitHub releases 中。
* 应用程序需要完成签名。

#### 发布一个 GitHub 版本

Electron Forge 的 Publisher 插件可以自动将打包的应用程序分发到各种来源。 

```shell
npm install --save-dev @electron-forge/publisher-github
```

```javascript
// forge.config.js
module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'github-user-name',
          name: 'github-repo-name'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}
```

```javascript
// package.json
{
  "scripts": {
    "publish": "electron-forge publish"
  }
}
```

运行 `npm run publish` 命令，将输出的可分发文件发布到新的 GitHub 版本。

> 本地发布的版本可能很单一，因为只能为你的主机操作系统创建一种版本 (比如, 你不能从 macOS 系统上发布 Window 系统的 .exe 文件)。
>
> 一种解决方案是通过自动化工作流来发布：比如，GitHub Actions, 通过它可以在各种云系统内包括 Ubuntu、macOS 和 Windows 上运行任务。

#### 检测更新程序代码

Electron 应用通过 autoUpdater 模块来实现此功能，此模块可以从更新服务源中读取信息，并检查是否有一个新版本可供下载。

一旦你的发布版本被推送到 GitHub，对应的更新服务 update.electronjs.org 将会自动对接你的应用。剩下的唯一步骤是使用 autoUpdater 模块配置源。

为了让整个过程更加简单，Electron 团队维护 update-electron-app 模块，它在一次函数调用中为 update.electronjs.org 设置了 autoUpdater 模块，无需配置。 这个模块将搜索 update.electronjs.org 源中与项目内 package.json 的"repository" 字段匹配的部分。

```shell
npm install update-electron-app
```

```javascript
// main.js
require('update-electron-app')()
```

### 常见问题

#### 运行 npm start 报错
```shell
throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
```
**原因：** Electron 没有安装好。npm install 结束后，虽然 node_modules/electron/ 文件夹已存在， 但是 Electron 并没安装好（可能是墙的原因），导致文件缺失。从两点可以看出：一是，electron/dist 不存在或者没有可运行的文件；二是，node_modules/electron/ 下不存在 path.txt 文件。

**解决方法：** 

* 手动[下载](https://npm.taobao.org/mirrors/electron/) Electron 压缩包， 如：https://registry.npmmirror.com/binary.html?path=electron/26.1.0/electron-v26.1.0-darwin-x64.zip。
* 解压压缩包，将解压后的文件复制到 node_modules/electron/dist 下。
* 在 node_modules/electron/ 下创建 path.txt 文件，文件中输入：Electron.app/Contents/MacOS/Electron。path.txt 的内容，不同平台不一样，可参考 node_modules/electron/install.js -> getPlatformPath 方法下的枚举值。

* 再执行 npm start。

备注：Mac 下，可能被拦截。可通过 系统偏好设置 -> 安全性与隐私 -> 左下角 '锁' 的 icon，解锁，允许第三方应用。
备注：另一种解决方案，查看 https://github.com/pangxieju/electron-fix。

### 参考资料

[Electron 官网](https://www.electronjs.org/zh/)

