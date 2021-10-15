## sublime3 插件篇

### 插件管理工具

#### 错误安装(不可用)

按Ctrl + `(此符号为tab按键上面的按键) 调出console，粘贴以下代码到命令行并回车：

```js
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

**遗憾的是：`Sublime text 3`已经不支持`Package Control`安装插件了！**

#### 正确安装（可用）

1. 手动下载一个`package control`的包：`https://github.com/wbond/package_control`。

2. 下载解压后，将解压文件重新命名为：`Package Control `，拷贝到`sublime` 的`packages`目录下。可以直接菜单栏`Perferences -->Browse Packages`打开。 

   **严格按照上面明明，首字母记住要大些！！！**

3. 重启`sublime`，点击菜单栏`Perferences`，会发现多了`Package Settings` 和`Package Control `这两个菜单，这就说明 `Package Control`安装成功了。

4. 尝试下安装一个插件，如`Emmet`。`Ctrl +Shift+P` 打开控制台，输入install，选择`Install Package`。此时要等待一会，因为Package Control 正在加载插件列表。

5. **但是很不幸，又失败了**！控制台提示无法访问https://packagecontrol.io/channel_v3.json。这个应该也是被墙了...

6. 不过，别慌！这是可以解决的。

   打开`Package Settings-->Package Control --> Settings User`，加入如下内容：

   ```json
   "channels": [ "http://cst.stu.126.net/u/json/cms/channel_v3.json"]
   ```

   > `http://cst.stu.126.net/u/json/cms/channel_v3.json`是个国内的战点



### 常用插件列表

[官网插件库](https://packagecontrol.io/)

用`Package Control`安装插件的方法：按下`Ctrl+Shift+P`调出命令面板，输入`install `调出` Install Package `选项，然后在列表中选中要安装的插件。

**注意：安装插件时保持网络畅通，避免插件由于网络原因奔溃**

#### Emmet（原名 Zen Coding）

一种快速编写`html/css`的方法。

安装`Emmet`的同时，也会自动安装其依赖`PyV8 binary`库，安装`PyV8`库会用较长时间，可以在`Sublime`左下角看到安装进程状态。

#### html5

支持hmtl5规范的插件包。

**使用方法**：新建html文档 -> ! -> 敲击Tab键 -> 自动补全html5规范文档。

#### javascript-API-Completions

支持`Javascript`、`JQuery`、`Twitter Bootstrap`框架、`HTML5`标签属性提示的插件，是少数支持`sublime text 3`的后缀提示的插件，`HTML5`标签提示`sublime text 3`自带，不过JQuery提示还是很有用处的，也可设置要提示的语言。

#### JSFormat

JS代码格式化插件。

**使用方法：**使用快捷键ctrl+alt+f

#### SublimeLinter

一个支持lint语法的插件，可以高亮linter认为有错误的代码行，也支持高亮一些特别的注释，比如“TODO”，这样就可以被快速定位。（`IntelliJ IDEA`的`TODO`功能很赞，这个插件虽然比不上，但是也够用了吧）

#### BracketHighlighter

类似于代码匹配，可以匹配括号，引号等符号内的范围。

使用方法：系统默认为白色高亮，可以使用链接所述方法进行自定义配置

#### Alignment

代码对齐，如写几个变量，选中这几行，Ctrl+Alt+A，哇，齐了。

#### Ctags

函数跳转，我的电脑上是Alt+点击 函数名称，会跳转到相应的函数

#### DocBlockr

注释插件，生成幽美的注释。标准的注释，包括函数名、参数、返回值等，并以多行显示，省去手动编写。

#### SideBarEnhancements

侧栏右键功能增强，非常实用

#### [DocBlockr](https://packagecontrol.io/packages/DocBlockr)

支持对函数、变量的快捷注释

#### FileHeader

新建文件时，增加文件头注释



### 常见问题

#### 设置默认浏览器和快捷键

* 安装插件 `SideBarEnhancements`

* 选择浏览器打开 `html`：在左侧栏中，右键 `html` 文件，单击右键菜单栏中 `Open In Browser`，选择浏览器

* 设置默认浏览器和快捷键：`preferences -> Package Settings -> Side Bar -> Setting User `，添加设置：

  ```shell
  [
  	{
  	    "keys":["f10"],
  		"command":"side_bar_files_open_with",
  		"args":{
  		"paths":[],
  			"application":"C:/Users/lizhao/AppData/Local/Google/Chrome/Application/chrome.exe",
  			"extensions":".*"
  		}
  	}
  ]
  ```

  



