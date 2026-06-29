## uniapp基础篇

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

### 创建项目

#### 可视化界面

uni-app 支持通过可视化界面、vue-cli 命令行两种方式快速创建项目。

可视化的方式比较简单：先下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)，HBuilderX 内置相关环境，开箱即用，无需配置 nodejs。HBuilderX 是通用的前端开发工具，但为 uni-app 做了特别强化。

#### vue-cli 命令行

* 全局安装 vue-cli：`npm install -g @vue/cli`。

* 创建 uni-app：

  ```shell
  # 使用正式版（对应HBuilderX最新正式版）
  vue create -p dcloudio/uni-preset-vue my-project
  ```

* 运行、发布 uni-app：

  ```shell
  npm run dev:%PLATFORM%
  npm run build:%PLATFORM%
  ```

  ```shell
  app-plus	app平台生成打包资源（支持npm run build:app-plus，可用于持续集成。不支持 run，运行调试仍需在 HBuilderX 中操作）
  h5	         H5
  mp-alipay	   支付宝小程序
  mp-baidu	   百度小程序
  mp-weixin	   微信小程序
  mp-toutiao	 抖音小程序
  mp-lark	     飞书小程序
  mp-qq	       qq 小程序
  mp-360	     360 小程序
  mp-kuaishou	 快手小程序
  mp-jd	       京东小程序
  mp-xhs	     小红书小程序
  quickapp-webview	      快应用(webview)
  quickapp-webview-union	快应用联盟
  quickapp-webview-huawei	快应用华为
  ```

​		浏览器访问本地链接：http://localhost:8082/#/pages/index/index

* 运行并发布快应用：快应用有两种开发方式，uni-app 均支持，即类小程序 webview 渲染方式、原生渲染方式。

#### 可视化界面和 cli 建项的区别

* 可视化界面建项：一种免 node 开发概念。工程代码在项目目录下，编译器在 HBuilderX 目录下而不是项目下，编译结果在项目的 unpackage 目录下。
* cli 建项：传统的 node 项目结构。工程代码在 src 目录下，编译器在项目下，编译结果在 dist 目录下。

### 页面

uni-app 项目中，一个页面就是一个符合 Vue SFC 规范的 vue 文件。

在 uni-app js 引擎版中，后缀名是 .vue 文件或 .nvue 文件。 这些页面均全平台支持，差异在于当 uni-app 发行到 App 平台时，**.vue 文件会使用 webview 进行渲染，.nvue 会使用原生进行渲染**。

一个页面可以同时存在 vue 和 nvue，在 pages.json 的路由注册中不包含页面文件名后缀，同一个页面可以对应 2 个文件名。

重名时优先级如下：

* 非 app 平台，先使用 vue，忽略 nvue；
* app 平台，使用 nvue，忽略 vue；
* uni-app x 中，后缀名是 .uvue 文件。

uni-app x 中没有 js 引擎和 webview，不支持和 vue 页面并存。

uni-app x 在app-android上，每个页面都是一个全屏activity，不支持透明。

> uni-app x，是下一代 uni-app，是一个跨平台应用开发引擎。
>
> uni-app x 没有使用 js 和 webview，它基于 uts 语言。在 App 端，uts 在 iOS 编译为 swift、在 Android 编译为 kotlin，完全达到了原生应用的功能、性能。
>
> uni-app x 是一个庞大的工程，它包括 uts 语言、uvue 渲染引擎、uni 的组件和 API、以及扩展机制。

uni-app 中的页面，默认保存在工程根目录下的 pages 目录下。

每次新建页面，均需在 pages.json 中配置 pages 列表；未在 pages.json -> pages 中注册的页面，uni-app会在编译阶段进行忽略。

### JS 语法

uni-app 的 js API 由标准 ECMAScript 的 js API 和 uni 扩展 API 这两部分组成。

标准 ECMAScript 的 js 仅是最基础的 js。浏览器基于它扩展了 window、document、navigator 等对象。小程序也基于标准 js 扩展了各种 wx.xx、my.xx、swan.xx 的 API。node 也扩展了 fs 等模块。

uni-app 基于 ECMAScript 扩展了 uni 对象，并且 API 命名与小程序保持兼容。

#### 和浏览器 JS 的区别

uni-app 的 js 代码，h5 端运行于浏览器中。非 h5 端（包含小程序和App），Android 平台运行在 v8 引擎中，iOS 平台运行在 iOS 自带的 jscore 引擎中，都没有运行在浏览器或 webview 里。

非 H5 端，虽然不支持 window、document、navigator 等浏览器的 js API，但也支持标准 ECMAScript。

#### app端

在 App 端 JS 脚本运行在独立的 JS 引擎中，vue 页面使用系统 webview 渲染，nvue 页面使用系统原生 View 渲染。

**Android 平台：** JS 脚本运行在独立 Google V8 引擎中，版本与 Chrome 83一致，因此支持的语法与 Android 系统版本无关；vue 页面渲染在系统 Webview 中，受 Android 系统版本影响；nvue 页面使用系统原生 View 渲染，css 支持有限。

**iOS平台：** JS 脚本运行在 iOS 操作系统提供的 JavaScriptCore 引擎，因此支持的语法与 iOS 系统有关，跟 iOS 系统的 Safari 浏览器一致；vue 页面渲染在系统 WKWebview 中，受 iOS 系统版本影响，兼容性与 iOS 系统的 Safari 浏览器一致；nvue 页面使用系统原生 View 渲染，css 支持有限。

### CSS 语法

uni-app 有 vue 页面、nvue 页面、uvue 页面。

* vue 页面是 webview 渲染的。
* nvue 页面是原生渲染的，其样式比 web 会限制更多。
* uvue 页面是原生渲染的，是 web 的 css 子集。

uni-app 的 css 与 web 的 css 基本一致，支持 less、sass、scss、stylus 等预处理器。

### uts语法

uts，全称 uni type script，是一门跨平台的、高性能的、强类型的现代编程语言。

它可以被编译为不同平台的编程语言，如：

* web 平台，编译为 JavaScript；
* Android 平台，编译为 Kotlin；
* iOS 平台，编译 Swift。

uts 采用了与 ts 基本一致的语法规范，支持绝大部分 ES6 API。

但为了跨端，uts 进行了一些约束和特定平台的增补。

过去在 js 引擎下运行支持的语法，大部分在 uts 的处理下也可以平滑的在 kotlin 和 swift 中使用。但有一些无法抹平，需要使用条件编译。和 uni-app 的条件编译类似，uts 也支持条件编译。写在条件编译里的，可以调用平台特有的扩展语法。

### 运行和调试

运行，指将项目运行起来，可以一边修改代码、一边立即看到修改结果，同时可以打 log 日志（console.log）。

而调试，也称之为 debug，在运行的基础之上，进一步可以打断点、单步跟踪、看堆栈信息。

HBuilder 为 uni-app 提供了内置的 web 浏览器、web 端调试环境、App 的真机运行环境、App 调试环境、uniCloud 运行环境、uniCloud 调试环境。

#### web平台调试

web端调试有两种方案：一种是在终端启动项目，在浏览器中使用其自带的开发者调试工具；二是在 HBuilderX，使用其内置浏览器的控制台。

**HBuilderX 调试：** 打开 uni-app 项目的页面，点 HBuilderX 右上角的预览按钮（会提示先安装内置浏览器），可以在内置浏览器里打开 Web 运行结果，然后打开其开发者调试工具。

#### app平台调试

因手机差异较大，HBuilder 并没有提供 App 的模拟器。不管 uni-app 或 5+App/wap2app 项目，都需要连接真实的手机或手机模拟器来运行测试，称之为“真机运行”。

- Android 平台：HBuilder 支持 adb 协议，在 HBuilder 运行的电脑上，可以使用 usb 线连接 Android 设备，也可以使用安装在电脑上的 Android 模拟器（包括 google 官方模拟器，三方模拟器如“雷电”、“夜神”等）。
- iOS平台：HBuilder 支持 itunes 协议，在 HBuilder 运行的电脑上，使用 usb 线连接 iPhone 或 iPad；如果是 mac 电脑，则可以连接 XCode 自带的 iOS 模拟器。如果是 arm 架构 cpu，还可以直接启动真机运行基座。

**Android 设备为例：** HBuilderX 顶部菜单栏 -> 运行 -> 运行到手机或模拟器，先安装 app 基座。安装完成后，点击『运行到 Android App 基座』，用 usb 线连接 Android 设备，会提示在手机上安装 HBuilder，安装完后，即可看到运行页面。

#### 小程序平台调试

使用各家小程序开发工具调试。

uni-app 运行到微信、阿里等平台的小程序开发者工具时，可在这些工具的控制台查看 console 信息，网络请求等信息等。

**微信小程序为例：** HBuilderX 顶部菜单栏 -> 运行 -> 运行到小程序模拟器 -> 微信开发者工具 - [uni-app]，运行完后后，打开「微信开发者工具」，导入 dist/dev/mp-weixin 运行。

#### uni-vue-devtools调试

仅支持vue3。暂不支持vue2。

uni-vue-devtools 是基于 vue-devtools 开发的 uni-app 项目调试工具。

在 web 开发时，开发者可以在 chrome 里安装 vue devtools插件。但 app 和小程序过去无法使用。

现在 HBuilderX 集成了该功能，web、app、小程序均可使用。

### App离线打包

#### Android 离线打包

* [下载、安装Android Studio](https://developer.android.google.cn/studio/index.html)
* [下载、安装HBuilderX](https://www.dcloud.io/hbuilderx.html)
* [下载App离线SDK](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html)
* [申请 Appkey](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html)

##### 申请Appkey

* [登录开发者中心](https://dev.dcloud.net.cn/pages/app/list)（没有账号的，需要注册一个）。
* 点击 "创建应用"，新建一个 uni-app 应用。
* 点击创建后的应用的名称查看详情，点击 "各平台信息" -> "新增"，填入各项信息。生成 Android 应用签名SHA1值、SHA256，可查看 [Android平台签名证书(.keystore)生成指南](https://ask.dcloud.net.cn/article/35777)。
* 在创建的平台应用中，点击 "离线打包Key" 的 "创建" ，生成 Appkey。
* 在创建的平台应用中，点击 "离线打包Key" 的 "查看" ，可看到 Android。

##### 生成本地打包 APP 资源

打开 HBuilder，点击 发行 -> 原生APP-本地打包 -> 生成本地打包 APP 资源。

**注意：** 打包前，需要先在`src/manifest.json` 文件填写 appid，其值在 “开发者中心” -> “应用管理” -> “我的应用” -> 列表中的 Appid，如：`__UNI__614EF21`。

生成后的资源路径在：`dist/resources/__UNI__614EF21`。

**注意：** 打包资源由 HBuilderX x.x.x 版本生成，运行的基座 sdk 也需配套相同版本，否则在手机端部分功能可能无法正常使用。

[UNI-APP安卓本地打包详细教程（保姆级）](https://blog.csdn.net/PIOnly/article/details/125196697)

##### 导入工程

解压下载来的 Android 离线 SDK（如：Android-SDK@3.99.81993_20231227.zip），打开 Android Studio，导入 解压后的 HBuilder-Integrate-AS 目录。

用 HBuilder 生成的 APP 资源，替换 `HBuilder-Integrate-A\simpleDemo\src\main\assets\apps` 目录下的 `__UNI__A` 目录。

##### 修改配置

* 打开 `simpleDemo/src/main/assets/data/dcloud_control.xml` 文件，将 appid 更换成自己 uni-app 的应用标识 AppID，也就是 HBuilder 项目下，`src/manifest.json` 中的 appid。
* 打开 `simpleDemo/src/main/AndroidManifest.xml` 文件
  * 将 manifest 标签的 package 属性设置为 “开发者中心” -> “应用管理” -> “我的应用”  -> 点击 “应用名称” -> “各平台信息” -> “包名/appid/域名”
  * 将 manifest  -> application -> meta-data 标签的 android:name 值为 "dcloud_appkey" 的 android:value 值设置为前面申请的 Appkey。
* 打开 `simpleDemo/src/main/res/values/strings.xml` 文件，输入自己应用想要的应用名称（类似 QQ、微信这些应用名称）。
* 打开 `simpleDemo/src/main/res/drawable/icon.9.png` 目录，该目录主要存放 icon.png（logo 图片）、push.png（消息推送 logo）、splash.png（启动页）图片。依次选中图片，右键 -> 点击 "Create 9-Patch file"，将图片更换为 `xxx.9.png` 类型，防止不同型号手机导致图片变形。
* 打开 `simpleDemo/build.gradle` 文件，填入 Android 包名、大版本号、小版本号。可通过在 `uni-android/simpleDemo/src/main/assets/apps/__UNI__614EF21/www/manifest.json`  文件查看版本号信息。
* 最后，点击 Android Studio 编辑器上方的 build -> 点击 Generate  Signed Bundle / APK 进行打包。

### 常见问题

#### 项目开发问题

* src/static 目录不能为空，即至少要有一个文件，否则编译报错：

  ```shell
  in unable to locate '/Users/XXX/uni-app/src/static/**/*' glob
  ```

* 引用外部 JS：？？

* 插件引用：尽量在[uni-app 插件市场](https://ext.dcloud.net.cn)寻找插件，npm 等第三方市场没有 uni-app 兼容性描述，很容易下载到无法跨平台的、仅适配 web 的插件。

#### Android Studio 打包问题

##### startup failed:

```shell
Caused by: org.codehaus.groovy.control.MultipleCompilationErrorsException: startup failed:
```

```shell
Unsupported Java. 
Your build is currently configured to use Java 17.0.9 and Gradle 6.5.

Possible solution:
 - Upgrade Gradle wrapper to 7.2 version and re-import the project
```

**解决方案：** 

* 点击 “Upgrade Gradle wrapper to 7.2 version and re-import the project”，升级 Gradle 到 7.0
* 升级 Java 版本：Android Studio 编辑器 -> File -> Settings -> Build, Execution, Deployment -> Build Tools -> Gradle -> Gradel JDK -> Download JDK，选择 18.0.2 的版本。
* 重新同步构建项目：Android Studio 编辑器 -> File -> Sync Project with Gradle Files。

##### Execution failed for task ':simpleDemo:processReleaseMainManifest'.

```shell
> Unable to make field private final java.lang.String java.io.File.path accessible: module java.base does not "opens java.io" to unnamed module @14a41352

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.
```

**解决方案：** 在 `gradle.properties` 文件中添加如下配置：

```shell
org.gradle.jvmargs=-Xmx1536m \
--add-exports=java.base/sun.nio.ch=ALL-UNNAMED \
--add-opens=java.base/java.lang=ALL-UNNAMED \
--add-opens=java.base/java.lang.reflect=ALL-UNNAMED \
--add-opens=java.base/java.io=ALL-UNNAMED \
--add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED \
--add-exports=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED \
--add-exports=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED \
--add-exports=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED
```

#### 第一次进入页面空白（安卓）

点击安卓应用，每一次进入页面时空白，之后进入正常。

**vconsole：**

由于引入了 vconsole，导出 javascript 报错。没细查，可能 vconsole 有些用法，在安卓端不支持，比如：window、document 类的。移除 vconsole即可（期待有兼容各平台的替代方案）。

**TextEncoder is undefine：**

安卓平台下，不支持 TextEncoder 对象。添加 TextEncoder 的 polyfill 即可。

```shell
# 安装 text-encoding
npm i -S text-encoding
```

```javascript
// 在 src/main.js 引用 TextEncoder，并设置为全局变量
import { TextEncoder, TextDecoder } from 'text-encoding'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
```

#### 什么是快应用？

快应用是一种新的应用形态，以往的手机端应用主要有两种方式：网页、原生应用；网页无需安装，却体验不是很好；原生应用体验流畅，却需要从应用商店下载安装，难以一步直达用户；快应用的出现，就是希望能够让用户无需下载安装，并且还能流畅的体验应用内容。

为了达到上面的目标，快应用建立一种新的语言开发规范，同时提供一系列的开发套件辅助支持。简单来说，开发者主要利用前端知识与技能，以及对应的 IDE，手机设备就可以做原型的开发。快应用使用前端技术栈开发，原生渲染，同时具备 H5 与原生应用的双重优点，开发者使用的前端技术栈资料多，学习成本低。

2018 年 3 月份，由小米，OPPO，vivo，华为等 10 家国内主流厂商成立了快应用联盟，从技术规范层面做了统一，并保证了开发者开发的快应用可以直接在所有的联盟内厂商的手机设备上运行。

快应用框架深度集成进各手机厂商的手机操作系统中，可以在操作系统层面形成用户需求与应用服务的无缝连接，很多只用在原生应用中才能使用的功能，在快应用中可以很方便的实现，享受原生应用体验，同时不用担心分发留存等问题，资源消耗也比较少。

对于每台手机设备，应用可以从多个系统入口，引用用户体验产品。比如：全局搜索、负一屏、浏览器搜索等。

#### nvue 与 vue 的常见区别？

基于原生引擎的渲染，虽然还是前端技术栈，但和 web 开发肯定是有区别的。

* nvue 页面控制显隐只可以使用 v-if，不可以使用 v-show。
* nvue 页面只能使用 flex 布局，不支持其他布局方式，且排列方向默认为竖排（可在 manifest.json -> app-plus -> nvue -> flex-direction 节点下修改，仅在 uni-app 模式下生效）。
* 布局不能使用百分比、没有媒体查询。
* 支持的 css 有限。
* css 选择器支持的比较少，只能使用 class 选择器。
* class 进行绑定时只支持数组语法。
* 文字内容，必须、只能在 text 组件下。不能在 div、view 的 text 区域里直接写文字。否则即使渲染了，也无法绑定  js  里的变量。
* 只有 text 标签可以设置字体大小，字体颜色。
* 不支持背景图。但可以使用 image 组件和层级来实现类似 web 中的背景效果。因为原生开发本身也没有 web 这种背景图概念
* nvue 页面没有 bounce 回弹效果，只有几个列表组件有 bounce 效果，包括 list、recycle-list、waterfall。
* 原生开发没有页面滚动的概念，页面内容高过屏幕高度并不会自动滚动，只有部分组件可滚动（list、waterfall、scroll-view/scroller），要滚得内容需要套在可滚动组件下。
* 在 App.vue 中定义的全局 js 变量不会在 nvue 页面生效。globalData 和 vuex 是生效的。
* App.vue 中定义的全局 css，对 nvue 和 vue 页面同时生效。如果全局 css 中有些 css 在 nvue 下不支持，编译时控制台会报警，建议把这些不支持的 css 包裹在条件编译里。
* 目前不支持在 nvue 页面使用 typescript/ts。

[详情链接](https://uniapp.dcloud.net.cn/tutorial/page.html#nvue-%E5%BC%80%E5%8F%91%E4%B8%8E-vue-%E5%BC%80%E5%8F%91%E7%9A%84%E5%B8%B8%E8%A7%81%E5%8C%BA%E5%88%AB)

### 参考资料

[uniapp 官网](https://zh.uniapp.dcloud.io/)

[跨端开发框架深度横评之2020版](https://juejin.cn/post/6844904118901817351)

