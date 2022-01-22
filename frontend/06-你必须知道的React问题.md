## 你必须知道的React问题

使用 React 已经一年多了，这次重读了一篇 React 的文档，将一些主要概念和疑问做了一个整理。本文内容主要来自 [React 文档](https://zh-hans.reactjs.org/)，还有一些网上查询的资料，以及自己的一些使用经验和理解。由于篇幅过长，拆分成 [重读React教程](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/05-zhong-du-react-jiao-cheng) 和 [你必须知道的React问题](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/06-ni-bi-xu-zhi-dao-de-react-wen-ti) 两篇。

### 如何创建一个新的React应用？

#### [create-react-app](https://www.html.cn/create-react-app/docs/getting-started/)

Create React App 是一个官方支持的创建 React 单页应用程序的方法。它提供了一个零配置的现代构建设置。

```shell
npx create-react-app my-app
cd my-app
npm start
```

create-react-app 是基于 webpack 的打包层方案，包含 build、dev、lint 等，他在打包层把体验做到了极致，但是不包含路由，不是框架，也不支持配置。

#### [umi](https://umijs.org/zh-CN/docs)

Umi，中文可发音为乌米，是可扩展的企业级前端应用框架。Umi 以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

Umi 是蚂蚁金服的底层前端框架，已直接或间接地服务了 3000+ 应用，包括 java、node、H5 无线、离线（Hybrid）应用、纯前端 assets 应用、CMS 应用等。他已经很好地服务了我们的内部用户，同时希望他也能服务好外部用户。

```shell
mkdir myapp
cd myapp
npx @umijs/create-umi-app
npm i
npm start
```

umi 通过 create-umi 提供脚手架能力，包含：

- project，通用项目脚手架，支持选择是否启用 TypeScript，以及 umi-plugin-react 包含的功能

- ant-design-pro，仅包含 ant-design-pro 布局的脚手架，具体页面可通过 umi block 添加

- block，区块脚手架

- plugin，插件脚手架

- library，依赖（组件）库脚手架，基于 umi-plugin-library

    ```shell
    npm create umi
    ```

#### Next.js

Next.js 是一个流行的、轻量级的框架，用于配合 React 打造静态化和服务端渲染应用。它包括开箱即用的样式和路由方案，并且假定你使用 Node.js 作为服务器环境。

#### Gatsby

Gatsby 是用 React 创建静态网站的最佳方式。它让你能使用 React 组件，输出预渲染的 HTML 和 CSS 以保证最快的加载速度。

#### 从零开始创建React应用

一组 JavaScript 构建工具链通常由这些组成：

- 一个 package 管理器。如：Yarn、npm。它能让你充分利用庞大的第三方 package 的生态系统，并且轻松地安装或更新它们。
- 一个打包器。如：webpack、Parcel。它能让你编写模块化代码，并将它们组合在一起成为小的 package，以优化加载时间。
- 一个编译器。如：Babel。它能让你编写的新版本 JavaScript 代码，在旧版浏览器中依然能够工作。

如果你倾向于从头开始打造你自己的 JavaScript 工具链，可以查看这个指南，它重新创建了一些 Create React App 的功能。

#### 其他工具链

- Neutrino 把 webpack 的强大功能和简单预设结合在一起。并且包括了 React 应用和 React 组件的预设。
- Nx 是针对全栈 monorepo 的开发工具包，其内置了 React，Next.js，Express 等。
- Parcel 是一个快速的、零配置的网页应用打包器，并且可以搭配 React 一起工作。
- Razzle 是一个无需配置的服务端渲染框架，但它提供了比 Next.js 更多的灵活性。



### 应用程序中的三种架构模式

过去，MV* 模式被大量用于构建桌面和服务器端应用程序，但直到最近几年它们才被应用于 JavaScript。MV* 模式的主要目标是**分离关注点**，MV* 模式中有 3 种非常重要的架构模式：MVC、MVP、MVVM。

#### 什么是MVC？

MVC 全名是 Model View Controller，把应用程序分成三部分分别是：

* Model（模型）：应用程序业务相关的数据以及对数据的处理方法；
* View（视图）： 显示模型的图形界面，一般没有业务上的逻辑；
* Controller（控制器）： 用于连接模型和视图，控制应用程序的流程（事件绑定等）。

![mvc](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/MVC.jpg)

**交互流程：**

1. View 获取用户交互（路由，键盘，鼠标等），并把事件移交给 Controller；
2. Controller 完成业务逻辑后，调用 Model 接口更新数据；
3. Model 更改数据之后，通知 View 重新渲染图形界面。

还有一种交互流程：用户不与 View 交互，直接通过 controller 接受指令，更新 Model 状态，达到更新 View 的目的。例如：改变 URL 触发 hashChange 事件。

MVC 的出现不仅实现了功能模块和显示模块的分离，同时它还提高了应用系统的可维护性、可扩展性、可移植性和组件的可复用性。

MVC 主要缺点是，Model 和 View 解耦程度不足，Model 和 View 虽然相互分离，但是之间关联性太强，没有做到独立的重用；数据流向不明确，View 可以由 Model 更新，也可以由 Controller 修改。

**典型框架：** Backbone.js。

#### 什么是MVP？

MVP 全名是 Model-View-Presenter，是 MVC 的衍生物，专注于改进表示逻辑。分两种情况：

##### Passive View（被动视图）

Presenter占据绝对主导地位，掌控着 Model 和 View，而后两者之间互不联系。

- Model（业务模型）：应用程序业务相关的数据以及对数据的处理方法；
- View（视图界面）： 显示模型的图形界面，包含传递事件和提供相关接口给 Presenter；
- Presenter（派发器）： 作为中间层同步控制着 Model 数据修改和 View 视图变化。

![MVP](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/MVP.jpg)

**交互流程：**

- View 获取用户交互，并把事件移交给 Presenter；
- Presenter 完成业务逻辑后，调用 Model 接口更新数据；
- Model 数据更新成功后，通知 Presenter；
- Presenter 收到通知后，调用 View 接口重新渲染图形界面。

##### Supervising Controller（监督控制器）

在监督控制器中，视图层接管了一部分视图逻辑，主要内容就是同步**简单的**视图和模型的状态；而监督控制器就需要负责响应用户的输入以及一部分更加复杂的视图、模型状态同步工作。



MVP 完全分离了 View 层和 Model 层，也就是说，View 层与 Model 层一点关系也没有，双方是不知道彼此存在的，在它们眼里，只有 Presenter 层。因此，View 层可以抽离出来做成组件，在复用性上比 MVC 模型好很多。

MVP 的主要缺点是，如果业务复杂一点，Presenter 的体积增大、臃肿，难以维护。而且所有数据都需要 Presenter 层进行手动同步，代码有比较多的冗余部分。

**典型框架：**Web 框架中不常见，但是在安卓原生开发有这类框架。

#### 什么是MVVM？

MVVM 全名是 **Model-View-ViewModel**，本质上也是 MVC 的改进版，也可以说是 MVP 的改良版，把应用程序分成三部分分别是：

- Model（业务模型）：应用程序业务相关的数据以及对数据的处理方法；
- View（视图界面）： 用于显示模型的图形界面。通过使用模板语法来声明式的将数据渲染进 DOM；
- ViewModel（视图模型）： **ViewModel 的核心就是双向绑定技术**。通过双向绑定机制，将 View 层和 Model 层之间的修改都会同步到对方。

![MVVM](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/MVVM.jpg)

MVVM 的双向绑定，不仅使速度有了一定的提高，代码量也减少很多。MVVM 的主要缺点是不适用于大型项目，过多的数据绑定需要大量的监听对象，这些在代码中是无感的，但会造成应用程序的性能成本。

**典型框架：** knockoutjs、Vue 也有不少它的影子。

#### 双向绑定

MVVM 模型中数据绑定方法一般有以下 3 种：

- 数据劫持
- 发布-订阅模式
- 脏值检查

Vue.js 使用的是数据劫持和发布-订阅模式两种方法。先来了解三个概念：数据监听器（Observer）、指定解析器（Compiler）、订阅者 （Watcher）。

Observer 用于监听数据变化，如果数据发生改变，不论是在 View 层还是 Model 层， Oberver 都会知道，然后告诉 Watcher。Compiler 的作用是对数据进行解析，之后绑定指定的事件，在这里主要用于更新视图。

Vue.js 数据绑定的流程：首先将需要绑定的数据用数据劫持方法找出来，之后用 Observer 监听这堆数据，如果数据发生变化，Observer 就会告诉 Watcher，然后 Watcher 会决定让哪个 Compiler 去做出相应的操作，这样就完成了数据的双向绑定。

**现在的框架其实都是双向绑定的。只不过 Angular 需要你绑在 $scope 上，React 需要你手动写一遍 setState。** 

#### MVC、MVP、MVVM的区别

**MVC 和 MVP（Passive View）区别：** 

MVP 是基于 MVC 模式上演变过来，与 MVC 有一定的相似性，Controller 和 Presenter 负责逻辑的处理，Model 提供数据，View 负责显示。

在 MVC 框架中，View 层可以通过访问 Model 层来更新，但在 MVP 框架中，View 层不能再直接访问 Model 层，必须通过 Presenter 层提供的接口，然后 Presenter 层再去访问 Model 层。两者最大区别是：**MVP（Passive View） 中， View 和 Model 是完全解耦的。**

**MVP 和 MVVM 区别：**

MVVM 的框架图与 MVP 的框架图相似。两者最大的区别是： Presenter 是采用手动写方法来调用或者修改 View 层和 Model 层，而 ViewModel 双向绑定了 View 层和 Model 层，View 层的数据变化，会自动修改 Model 层的数据，反之变然。

#### 总结（个人理解）

这个问题花了很多时间查资料，网上相关的文章很多，但每篇文章的描述有些差异，我也一度陷入迷茫，后来才意识到有两点需要先明确：**一是所谓的架构模式只是概念性的，不要将某个框架与架构模式强行对应；** 二是架构模式最早是桌面和服务器端应用程序的概念，Web 框架对模式的解读和实现是有所不同的。

MV* 模式中，Model 是存储数据，View 层是展示数据。在不同的框架中，View 层和 Model 层的基础功能不变，但内容可能会有所差别。比如：View 层是否包含自身的接口，Model 中是否包含业务相关的逻辑。

MV* 模式中的不管是 C、P 或者 VM，重点都是如何控制 Model 和 View 同步。MVC 通过 C 控制 M，M 通知 V 重新渲染；MVP 通过 P 管控着 M 和 V，M 的更新需经过 P 才能同步到 V，反之变然；MVVM 通过 VM 双向绑定 M 和 V，使 M 的更新自动同步到 V，反之变然。

框架实现是多样的，它不需要完全遵循某种模式，比如：MVC 模式的框架可能会有 P 直接更新 V、V 直接更新 Model 的设计；MVP 模式的框架可能 M 和 V 本身就允许存在一些简单的逻辑处理，相互进行一些简单的交互。M 层和控制层（C、P、VM）的定义也没那么明晰，框架没有明确规定哪些业务逻辑应该写在哪一层，开发者根据业务需求选择。

**React 的官方文档说他是 V 层；Vue 的官方文档也提到，它没有完全遵循 MVVM 模型，只是设计上受到了它的启发（双向绑定）。** 

**最后，一句话表达个人理解： MVC 的初衷是 M 层、V 层、C 层分离；MVP 的核心是 M 层和 V 层解耦；MVVM 的核心是 M 层和 V 层的双向绑定。**



### React和Vue有哪些差异？

React 和 Vue 是现在最热门的选择之一，它们有许多相似之处：

* 使用 Virtual DOM；
* 提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件；
* 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。

#### 诞生

**React：** React 起源于 Facebook 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设 Instagram 的网站。做出来以后，发现这套东西很好用，就在2013年5月开源了。

**Vue：** Vue 作者是尤雨溪，作者曾经任职于谷歌。

* 2013年： 尤雨溪受到 Angular 的启发，开发出了一款轻量框架，最初命名为 Seed。

- 2013年12月8日： 0.6.0，更名为 Vue；

- **2014年01月27日： 0.8.0，Vue 正式对外发布；**

- 2014年02月25日： 0.9.0，代号 Animatrix。此后，重要的版本都会有自己的代号；

- 2015年06月13日： 0.12.0，代号 Dragon Ball；

  Laravel 社区（一款流行的 PHP 框架的社区）首次使用 Vue，Vue 在 JS 社区也打响了知名度。

- 2015年10月27日： 1.0.0，代号 Evangelion，是 Vue 历史上的第一个里程碑。

  同年，vue-router、vuex、vue-cli 相继发布，标志着 Vue 从一个视图层库发展为一个渐进式框架。

- **2016年10月01日： 2.0.0，这是是第二个重要的里程碑；**

  它吸收了 React 的虚拟 Dom 方案，还支持服务端渲染。自从 Vue 2.0 发布之后，Vue 就成了前端领域的热门话题。

- 2019年02月05日： 2.6.0 ，代号 Macross。这是一个承前启后的版本；

- 2019年12月05日： 在万众期待中，尤雨溪公布了 Vue 3 源代码，此时的 Vue 3 仍 处于 Alpha 版本；

- **2020年09月18日： 3.0，正式发布。**

#### 基本原理

**Vue：** 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 `Object.defineProperty` 把这些 property 全部转为 `getter/setter`。每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

**React：** React 将浏览器中的 DOM 抽象成一个 Javascript 对象（虚拟 DOM）。React 所有的表层操作实际上是在操作虚拟 DOM，再经过 Diff 算法计算出当前虚拟 DOM 与上一次的虚拟 DOM 的差异，然后将差异进行实际的 DOM 操作更新页面。 

#### 性能对化

**React：** 在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。

也就是说，React 会中初始化时调用 render 函数生成虚拟 DOM 树，当 Props 或 State 发生改变时，再次调用 render 函数渲染出另外一棵虚拟 DOM 树，比较前后两棵 DOM 的差异，更新视图中有差异的地方。组件更新时，会先触发 shouldComponentUpdate 生命周期函数，它是用来控制组件是否被重新渲染的（对比当前的 Props 或 State 和更新之后的 NextProps 或 NextState），如果它返回 true，则执行 render 函数，更新组件；否则，忽略更新，以节省性能。

**Vue：**在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知道哪个组件确实需要被重渲染。Vue 实例被创建时，会遍历 data 对象所有的属性，并使用 `Object.defineProperty` 把这些属性全部转为 getter/setter，每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，在属性被访问和修改时通知对应的组件。对应的组件再次调动渲染函数，生成虚拟Dom树对比，实现更新。

在 Vue 中，每一个组件都精确地知道自己是否需要重绘，所以每次渲染并不需要手动优化。

**简述**：当数据特别多的时候，Vue 中的 watcher 也会特别多，从而造成页面卡顿，所以一般数据比较多的大型项目会倾向于使用 React。在 React 官网中，官方也建议我们使用 React 来构建快速响应的大型 Web 应用程序。

#### 状态管理

**React：** React 是单向数据流，通过 props 和 state 管理组件状态。props 是父组件向子组件通信的方式，子组件不应该修改 props；state 是组件内部的状态，只允许定义 state 的组件访问。

**Vue：**  Vue 实现了双向数据绑定，当 View 改变更新 Model，当 Model 改变更新 View。组件状态（数据）是在 data 定义的，当一个 Vue 实例被创建时，Vue 通过 `Object.defineProperty`  监听劫持 data 对象的 getter/setter 属性来实现的。data 中的数据，不同用什么方式修改了，都会触发组件重新渲染。

#### 推荐写法

**React：** 在 React 中，一切都是 JavaScript。不仅仅是 HTML 可以用 JSX 来表达，现在的潮流也越来越多地将 CSS 也纳入到 JavaScript 中来处理。 

React 推荐使用 JSX。JSX 是 JavaScrip 的一种扩展语法，但是它具有 JavaScrip 的全部能力。从本质上讲，JSX 只是为 `React.createElement` 函数提供的语法糖。

```jsx
/* component.jsx */
const contentColor = { color: 'red' }
class MyComponent extends React.Component {
  state = {
    content: '这是一个简单的JSX文件'
  }
  render() {
    return <div className={contentColor}> {state.content} </div>
  }
}
export default MyComponent
```

**Vue：**Vue 的整体思想是拥抱经典的 Web 技术，并在其上进行扩展。

Vue 推荐 `.vue` 格式的单文件模板。Vue 保留了 Html、Css、Js 分离的写法，使 Web 开发者能保持原有习惯，更接近常用的 Web 开发方式。所有 Vue.js 的模板都是合法的 HTML ，所以能被遵循规范的浏览器和 HTML 解析器解析。

事实上 Vue 也提供了渲染函数，甚至支持 JSX。然而，默认推荐的还是模板。

```vue
<!-- component.vue -->
<template>
	<div class="contentColor"> {{content}} </div>
</template>
<script>
export default {
  name: 'MyComponent',
  data () {
  	return {
  		content: '这是一个简单的.vue模板'
  	}
  }
}
</script>
<style>
	.contentColor { color: red; }
</style>
```

React 推荐的 JSX 语法更像 JavaScript（偏逻辑），它允许把 HTML 和 CSS 全都写进 JavaScript，即 "all in js"；Vue 推荐的 `.vue` 模板更贴近 HTML（偏视图表现），可以更直观地观察语义结构，更好地结合 CSS 的书写。

#### 原生渲染Native

Native 指的是使用原生 API 来开发 App，比如：IOS 使用 OC 语言，android 使用 Java。

**vue：** Vue 和 Weex 进行官方合作，Weex 是阿里巴巴发起的跨平台用户界面开发框架，它的思想是多个平台，只写一套代码，Weex 允许你使用 Vue 语法开发不仅仅可以运行在浏览器端，还能被用于开发 IOS 和 Android 上的原生应用的组件。即只需要编写一份代码，即可运行在 Web、iOS、Android上。

**React：** React Native 是 Facebook 在2015年3月在F8开发者大会上开源的跨平台UI框架，需针对 IOS、Android不同编写2份代码，使用 React Native 需要按照文档安装配置很多依赖的工具，相对比较麻烦。

Weex 的思想是多个平台，只写一套代码，而 React Native 的思想是多个平台可以写多套代码，但其使用的是同一套语言框架。

Weex 的目标在于抹平各个平台的差异性，从而简化应用开发。而 React Native 承认了各个平台之间的差异，退而求其次，在语言和框架层面对平台进行抽象，从方法论的角度去解决多平台开发的问题。

Weex 相对来说上手比较简单，安装 vue-cli 之后就可以使用，学习门槛低，但是它的社区目前还处于成长期；而 React Native 的社区非常成熟活跃，有非常丰富的组件可供扩展。

#### 服务端渲染SSR

服务端渲染核心在于方便 SEO 优化，后端先调用数据库，获得数据之后，将数据和页面元素进行解析，组合成完整的 HTML 页面，再直接返回给浏览器，以便用户浏览。

**React：** Next.js 是一个 React 框架，允许使用 React 构建 SSR 和静态 Web 应用。

**Vue：** 2016 年 10 月 25 日，zeit.co 背后的团队对外发布了 Next.js。几小时后，与 Next.js 异曲同工，一个基于 Vue.js 的服务端渲染应用框架应运而生，我们称之为：Nuxt.js。

#### 构建工具

**React：** React 官方提供了 `create-react-app`，但是现在还存在一些局限性：

- 不允许在项目生成时进行任何配置（实际也可以借助第三方插件修改）；
- 只提供一个构建单页面应用的单一模板，而 Vue 提供了各种用途的模板；
- 不能用用户自建的模板构建项目，而自建模板对企业环境下预先建立协议是特别有用的；

**Vue：** Vue 提供了 `Vue-cli` 脚手架，能让你非常容易地构建项目，包含了 Webpack、Browserify，甚至 no build system，但是有些设置例，如 Scss 预处理器等自定义配置需要自定义。

#### 总结

Vue 和 React 的核心都是**专注于轻量级的视图层**，它们本身只是解决一个很小的问题，但是它们庞大的生态圈提供了丰富的配套工具，一开始它并不会给你提供全套的配置方案，将所有的功能都一次性给你打包好，它只会给你提供一些简单的核心功能，当你需要做一个更复杂的应用时，再增添相应的工具。

例如：做一个单页应用的时候才需要用路由；做一个相当庞大的应用，涉及到多组件状态共享以及多个开发者共同协作时，才可能需要大规模状态管理方案。

框架的存在就是为了帮助我们应对不同的项目复杂度。当我们面对一个大型、复杂的开发项目时，使用合适的框架就会事半功倍。但是，框架本身也有复杂度，如果只是一个简单的页面（比如：只有一些图片和文字，以及一些简单的跳转交互），却使用了很复杂的框架，那么不仅会失去工具本身所带来优势，还会增加各种问题，比如：开发成本、页面性能（比如：业务代码只有十几K，引入框架的资源100多k）。



### React中元素与组件有什么区别？

#### 元素

元素是 React 中最小基本单位。我们可以使用 JSX 语法、 React.createElement()、 React.cloneElement() 来创建 React 元素：

```jsx
const rElement = <div className="element">I'm element</div>
React.createElement(type, [props], [...children])
React.cloneElement(element, [props], [...children])
```

#### 组件

React 组件是封装起来的具有独立功能的 UI 部件。从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。 

React 中有三种构建组件的方式：`React.createClass()`、ES6 class 和无状态函数。前两种方式构建的组件是类，无状态组件创建的是函数，它们在 React 被视为是一样的。

```jsx
const ReactComponent = React.createClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>
  }
})
// 使用了ES6标准语法来构建，但它的实现仍是调用 React.createClass() 来实现了，
class ReactComponent extemds React.Component{
  render: function() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
function ReactComponent (props) {
  return <h1>Hello, {props.name}</h1>
}
```

**简单来说：** 组件是由元素构成的。元素数据结构是普通对象，而组件数据结构是类或纯函数。



### 什么渐进式框架？

**渐进式可以理解为：一步一步的意思，即，框架只提供最核心部分，其他的可以逐个、按需采用。** 这个过程是随着开发者的需求逐步变化增长的，由简单到复杂的应用场景都可以涵盖到。

每个框架都不可避免会有自己的一些特点，从而会对使用者有一定的要求，这些要求就是主张，主张有强有弱，它的强势程度会影响在业务开发中的使用方式。

比如：Angular，它两个版本都是强主张的，如果你用它，必须接受以下东西：

- 必须使用它的模块机制- 必须使用它的依赖注入
- 必须使用它的特殊形式定义组件（这一点每个视图框架都有，难以避免）

所以 Angular 是带有比较强的排它性的，如果你的应用不是从头开始，而是要不断考虑是否跟其他东西集成，这些主张会带来一些困扰。

再比如：React，它也有一定程度的主张，它的主张主要是函数式编程的理念。你需要知道什么是副作用，什么是纯函数，如何隔离副作用。它的侵入性看似没有 Angular 那么强，主要因为它是软性侵入。

简而言之，可以选择性的使用该框架的一个或一些组件，这些组件的使用也不需要将框架全部组件都应用；而且用了这些组件也不要求你的系统全部都使用该框架。



### 什么时候使用useMemo和useCallback？

使用 useMemo 和 useCallback 的是为了**避免不必要的重新渲染**。

我们知道，默认情况下如果父组件重新渲染，那么该父组件下的所有子组件都会随着父级的重新渲染而重新渲染。

- 无论子组件是类组件或是函数组件。
- 无论子组件在本次渲染过程中，子组件是否有任何相关的数据变化。

举例，假设某父组件中有2个子组件：子组件 A、子组件 B。若因为子组件 A 发生了某些操作，引发父组件重新渲染，这时即使子组件 B 没有任何需要更改的地方，但是默认也会重新被渲染一次。

    function CountButton({onClick, count}) {
      return <button onClick={onClick}>{count}</button>
    }
    
    function DualCounter() {
      const [count1, setCount1] = React.useState(0)
      const increment1 = () => setCount1(c => c + 1)
    
      const [count2, setCount2] = React.useState(0)
      const increment2 = () => setCount2(c => c + 1)
    
      return <>
    		<CountButton count={count1} onClick={increment1} />
        <CountButton count={count2} onClick={increment2} />
    	</>
    }

每次单击其中任何一个按钮时，DualCounter 的状态都会发生变化，因此会重新渲染，然后重新渲染两个CountButton。 但是，实际上只需要重新渲染被点击的那个按钮吧？因此，如果你点击第一个按钮，则第二个也会重新渲染，但没有任何变化，我们称之为“不必要的重新渲染”。

DualCounter 重新渲染会重新创建变量 count1、count2 和函数 increment1、increment2。这样必然会引起两个子组件的重新渲染。使用 useMemo 和 useCallback 就是为了应对这种情况。它 返回的缓存值和缓存函数，只要所依赖的项没有变化，其返回的变量和函数就不变化，从而避免了不必要的重新渲染。

大多数时候，你不需要考虑去优化不必要的重新渲染。React 会调用 Diff 算法计算子组件是否真正需要渲染，这个过程是非常快的！然而，有些情况下渲染可能会花费大量时间（比如重交互的图表、动画等）。

**回答：** 渲染比较昂贵，且传入值相等的情况下，会引起不必要重新渲染的时候。



### 其他问题

#### 为什么 React 不同步地更新 this.state？

在开始重新渲染之前，React 会有意地进行“等待”，直到所有在组件的事件处理函数内调用的 setState() 完成之后。这样可以通过**避免不必要的重新渲染来提升性能**。

但是，你可能还是会想，为什么 React 不能立即更新 this.state，而不对组件进行重新渲染呢。

主要有两个原因：

* 这样会破坏掉 props 和 state 之间的一致性，造成一些难以 debug 的问题。因为，即使 state 是同步更新，props 也不是（props 在重新渲染父组件之前您无法知道）。

* 频繁同步更新 this.state，可能会造成页面渲染闪烁。

#### 如何获取上一轮的 props 或 state？

通过 ref 来手动实现：`useRef` 不仅可以用于 DOM refs。refs 对象是一个 current 属性可变且可以容纳任意值的通用容器，类似于一个 class 的实例属性。

```jsx
function MyComponent() {
  const [state, setState] = useState(0);

  const prevStateRef = useRef()
  useEffect(() => {
    prevStateRef.current = state
  });
  const prevState = prevStateRef.current;

  return <h1>Now: {count}, before: {prevState}</h1>
}
```

#### 单向数据流和双向绑定各有什么优缺点？

- 单向数据流：
  优点：数据流动方向可以跟踪，流动单一，追查问题的时候可以跟快捷；
  缺点：写起来不太方便，要使 UI 发生变更就必须创建各种 action 来维护对应的 state。
- 双向流动： 
  优点：写起来很方便；
  缺点：各种数据相互依赖相互绑定，导致数据问题（子组件修改父组件、兄弟组件互相修改）的源头难以被跟踪到。

#### React.Component和React.PureComponent的区别？

两者很相似，主要区别在于 `React.Component` 并未实现 `shouldComponentUpdate()`，而`React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。

如果赋予 React 组件相同的 props 和 state，render() 函数会渲染相同的内容，那么在某些情况下使用 `React.PureComponent` 可提高性能。

#### 自定义 Hook 必须以 “use” 开头吗？

必须如此。

这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 Hook 的规则。



### 参考资料

[React中文文档](https://zh-hans.reactjs.org/)

[Vue.js-对比其他框架](https://cn.vuejs.org/v2/guide/comparison.html)

[MVC、MVP、MVVM的区别和联系（精讲版）](http://c.biancheng.net/view/7743.html)

[阮一峰-MVC，MVP 和 MVVM 的图示](https://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)

[浅谈 MVC、MVP 和 MVVM 架构模式](https://draveness.me/mvx/)

[【译】什么时候使用 useMemo 和 useCallback](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)