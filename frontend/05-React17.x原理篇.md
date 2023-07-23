## React17.x原理篇

React 是一个用于构建用户界面的 JavaScript 库。

React 是 Facebook 创建的一个开源项目，是 MVC 应用程序的**视图层**（Model View Controller）。

React 有以下特性：

* 以声明式编写 UI，让代码更加可靠，且方便调试。
* 组件化：构建管理自身状态的封装组件，然后对其组合以构成复杂的 UI。
* 有状态组件：基于状态设计简洁的视图，当数据变动时，React 能高效更新并渲染组件。
* 跨平台编写：无论现在使用什么技术栈，在无需重写现有代码的前提下，可以通过引入 React 来开发新功能，还可以使用 Node 进行服务器渲染，或使用 [React Native](https://reactnative.dev/) 开发原生移动应用。

React 最重要的方面之一是可以创建组件，就像自定义的、可重用的 HTML 元素一样，以快速有效地构建用户界面。React 还使用 state 和 props 简化了数据的存储和处理方式。

> React 不支持那些不兼容 ES5 方法的旧版浏览器。但如果 Web 应用包含了 polyfill，例如 es5-shim 和 es5-sham，则该应用仍然可以在这些浏览器中正常运行。但遇到问题你得自己解决，React 不会为你提供解决方案。

### 核心原理

React 核心技术——虚拟 DOM（Virtual DOM）：对于每一个组件，React 会在内存中构建一个相对应的虚拟 DOM 树。基于 React 开发时，所有的真实 DOM 构造都是通过虚拟 DOM 进行，每当组件的状态发生变化时，React 都会重新构建整个虚拟 DOM 数据，然后将当前的整个虚拟 DOM 树和上一次的虚拟 DOM 树进行对比，得出虚拟 DOM 结构变化的部分（Patchs），然后将这些 Patchs 再更新到真实 DOM 中。整个过程都是在内存中进行，因此是非常高效的。

 React 把每个组件都当作一个状态机来维护和管理，因此每个组件都拥有一套完整的生命周期，大致可以分为三个过程：初始化、更新和销毁。生命周期的每一个过程都明确的反映了组件的状态变化，对于开发来说就能很容易的把握组件的每个状态，不同的状态时期做对应的事情，互不干扰。

**最简单的理解：** React 创建**不同状态**下的组件，在适当时机采用代价最小的方式更新相应状态的组件。

#### 快速响应

[React 官网](https://zh-hans.reactjs.org/docs/thinking-in-react.html)对 React 的定义：

> 我们认为，React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

React 强调是在大型的 Web 应用程序的 **快速响应**。

日常浏览网页时，有两类场景会制约快速响应：

* 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
* 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：CPU 瓶颈和 IO 瓶颈。

##### CPU 的瓶颈

当项目变得庞大、组件数量繁多时，就容易遇到 CPU 的瓶颈。

主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。

我们知道，JavaScript 可以操作 DOM，GUI 渲染线程与 JavaScript 线程是互斥的。所以 JavaScript 脚本执行和浏览器布局、绘制不能同时执行。

在每16.6ms 时间内，需要完成如下工作：

```shell
JS脚本执行 -----  样式布局 ----- 样式绘制
```

当 JavaScript 执行时间过长，超出了16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

如何解决这个问题呢？

答案是：在浏览器每一帧的时间中，预留一些时间给 JavaScript 线程，React 利用这部分时间更新组件（在源码中，预留的初始时间是 5ms）。

当预留的时间不够用时，React 将线程控制权交还给浏览器使其有时间渲染UI，React 则等待下一帧时间到来继续被中断的工作。

这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为**时间切片**（time slice）。

所以，解决 CPU 瓶颈的关键是实现**时间切片**，而时间切片的关键是：**将同步的更新变为可中断的异步更新**。

##### IO 瓶颈

网络延迟是前端开发者无法解决的，但可以通过交互优化，来减少用户对网络延迟的感知。

为此，React实现了 Suspense 功能及配套的 hook——useDeferredValu。而在源码内部，为了支持这些特性，同样需要**将同步的更新变为可中断的异步更新**。

**总结来说：** React 践行 “构建快速响应的大型 Web 应用程序” 的关键——**将同步的更新变为可中断的异步更新**。

#### React 15 架构

React 15 架构可以分为两层：

* Reconciler（协调器）—— 负责找出变化的组件；
* Renderer（渲染器）—— 负责将变化的组件渲染到页面上。

##### Reconciler（协调器）

在 React 中可以通过 this.setState、this.forceUpdate、ReactDOM.render 等 API 触发更新。每当有更新发生时，Reconciler 会做如下工作：

* 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM；
* 将虚拟 DOM 和上次更新时的虚拟 DOM 对比；
* 通过对比找出本次更新中变化的虚拟 DOM；
* 通知 Renderer 将变化的虚拟 DOM 渲染到页面上。

React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 **stack Reconciler**。

##### Renderer（渲染器）

由于 React 支持跨平台，所以不同平台有不同的 Renderer。前端最熟悉的是负责在浏览器环境渲染的 Renderer —— ReactDOM。

除此之外，还有：

* ReactNative 渲染器，渲染 App 原生组件；
* ReactTest 渲染器，渲染出纯 Js 对象用于测试；
* ReactArt 渲染器，渲染到 Canvas、SVG 或 VML (IE8)。

在每次更新发生时，Renderer 接到 Reconciler 通知，将变化的组件渲染在当前宿主环境。

##### React 15 架构的缺点

Reconciler 采用递归的方式创建虚拟 DOM，递归过程是不能中断的。如果组件树的层级很深，递归更新时间超过了16ms，用户交互就会卡顿。

#### React 16 架构

React 16 将递归的无法中断的更新重构为**异步的可中断更新**。

React 16 架构可以分为三层：

* Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler；
* Reconciler（协调器）—— 负责找出变化的组件；
* Renderer（渲染器）—— 负责将变化的组件渲染到页面上。

相较于 React 15，React 16 中新增了 Scheduler（调度器）。这也是 React16 支持异步更新的关键。

##### Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个API，这就是 requestIdleCallback。但是由于以下因素，React 放弃使用：

* 浏览器兼容性；
* 触发频率不稳定，受很多因素影响。比如当浏览器切换 tab 后，之前 tab 注册的 requestIdleCallback 触发的频率会变得很低。

> requestIdleCallback 是一个实验中的功能，idle 是闲置、空闲的意思。这接收一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

基于以上原因，React 实现了功能更完备的 requestIdleCallback polyfill，这就是 Scheduler。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

Scheduler 是独立于 React 的库。

##### Reconciler（协调器）

在 React 15 中，Reconciler 是递归处理虚拟 DOM 的；而在 React 16 中，更新工作从递归变成了可以中断的循环过程。每次循环都会调用 shouldYield 判断当前是否有剩余时间。

```javascript
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

在 React16 中，Reconciler 与 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记。

整个 Scheduler 与 Reconciler 的工作都在内存中进行。只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer。

React 16 的 Reconciler 基于 Fiber 节点实现，被称为 **Fiber Reconciler**。

##### Renderer（渲染器）

Renderer 根据 Reconciler 为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

实际上，由于 Scheduler 和 Reconciler 都是平台无关的，所以 React 为他们单独发了一个包 react-Reconciler。Reconciler 内部采用了 Fiber 的架构。

#### 性能优化

由于 React 中性能主要耗费在于 update 阶段的 Diff 算法，因此其性能优化也主要集中在：

* 减少 update 流程的触发：正常进入 update 流程有三种方式：setState、父组件 render、forceUpdate。使用 shouldComponentUpdate 钩子，根据具体的业务状态，减少不必要的 props 变化导致的渲染，比如一个不用于渲染的 props 导致的 update。
* 优化 Diff  算法：为了降低算法复杂度，React的 Diff 会预设三个限制：
  * 只对同级元素进行 Diff。如果一个 DOM 节点在前后两次更新中跨越了层级，则 React 不会尝试复用他。
  * 两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div 及其子孙节点，并新建 p 及其子孙节点。
  * 通过 key 属性来暗示哪些子元素在不同的渲染下能保持稳定。

#### 工作流程

使用 React.createElement() 创建一组 React 元素（一个 React 元素可能包含其他 React 元素），这样就创建了一个层层嵌套的 React 元素 ”树“，然后再使用 ReactDOM.render() 将这个 React 元素 ”树“ 的 ”根元素“ 挂载到真实 DOM 节点上。

**注意：** 使用 JSX 创建 React 元素，其实不过是 cerateElement 的语法糖，本质上是一样的。

其流程包括：

* 元素类型声明阶段：包含原生 HTML 标签、自定义的组件。

* 创建 React 元素：通过 React.createElement 创建了一个 React 元素。
* render 准备阶段：初始化 React 元素的一些属性、事件、children 等，处理一些浏览器的兼容性，将 React 元素转换为 Fiber 节点，生成 Fiber 树。
* render 阶段：将 Fiber 节点渲染成真正的 DOM 元素，然后挂载到指定的 DOM 节点上。
* 更新阶段：数据的改变会触发 DOM 的更新。在 React 中，数据以两种形式存在：state 和 props。state 保存属于当前组件的数据，props 保存从外部传递到当前组件的数据。props 数据改变是由父组件的 state 数据改变触发时，其改变会触发父组件的 setState() 重新渲染组父组件及其子组件；state 数据改变则会触发当前组件的 setState() 重新渲染。

### 核心概念

#### Virtual DOM

Virtual DOM（虚拟 DOM） 是一种编程概念。在这个概念里， UI 以一种理想化的，或者说“虚拟的”表现形式被保存于内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步（这一过程叫做协调）。

这种方式赋予了 React 声明式的 API：您告诉 React 希望让 UI 是什么状态，React 就确保 DOM 匹配该状态。这使您可以从属性操作、事件处理和手动 DOM 更新这些在构建应用程序时必要的操作中解放出来。

与其将 “Virtual DOM” 视为一种技术，不如说它是一种模式，人们提到它时经常是要表达不同的东西。在 React 的世界里，术语 “Virtual DOM” 通常与 React 元素关联在一起，因为它们都是代表了用户界面的对象。而 React 也使用一个名为 “fibers” 的内部对象来存放组件树的附加信息。

也就是说，React 中 Virtual DOM 的实现有 React Element 和 React Fiber。

#### React Element

元素描述了你在屏幕上想看到的内容。

React Element（React 元素）与浏览器的 DOM 元素不同。它是一种虚拟 DOM 的实现，以开销极小的普通 JavaScript 对象，负责更新 DOM 来与 React 元素保持一致。

#### React Fiber

Fiber 并不是计算机术语中的新名词，其中文翻译叫做**纤程**，与进程、线程、协程同为程序执行过程。

React Fiber 是 React 16 中新的协调引擎，本质上也是**一种虚拟 DOM 的实现**。它的主要目的是使 Virtual DOM 可以进行增量式渲染，提高其对动画、布局和手势等领域的适用性。其主要功能是增量渲染，也就是，将渲染工作分成块并将其分散到多个帧上。

Fiber 内部其实存储了很多上下文信息，可以认为是改进版的虚拟 DOM，它同样也对应了组件实例及 DOM 元素。同时 Fiber 也会组成 Fiber 树，但是它的结构不再是一个树形，而是一个链表的结构。

```javascript
function FiberNode(tag, pendingProps, key, mode) {
  // ...
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;
	// ...
}
```

#### 组件

React 组件是可复用的小的代码片段，它们返回要在页面中渲染的 React 元素。

组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

React 组件基本由以下部分组成：

* 由原生的 HTML 元素或其他组件组成；
* 组件的属性（Props）；
* 组件的状态（State）；
* 组件的生命周期钩子函数。

React 组件分为：函数组件与 class 组件。

```javascript
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

```javascript
// class 组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

上述两个组件在 React 里是等效的。

#### JSX

JSX（JavaScript + XML）是一个 JavaScript 语法扩展。它类似于模板语言，但它具有 JavaScript 的全部能力，且允许在其中编写 XML 的语言。

实际上，JSX 仅仅只是 React.createElement(component, props, ...children) 函数的语法糖。JSX 最终会被编译为 React.createElement() 函数调用，返回称为 “React 元素” 的普通 JavaScript 对象。

```javascript
import React from 'react';
const element = <h1>Hello, world!</h1>;
```

React 认为渲染逻辑本质上与其他 UI 逻辑内在耦合，比如，在 UI 中需要绑定处理事件、在某些时刻状态发生变化时需要通知到 UI，以及需要在 UI 中展示准备好的数据。

React 不强制要求使用 JSX。

#### 生命周期

生命周期方法，用于在组件不同阶段执行自定义功能。

React 组件的生命周期可分成三个状态：

* 挂载阶段（Mounting）：组件被创建并插入到 DOM 。其生命周期调用顺序：
  * constructor()：在 React 组件挂载之前，会调用它的构造函数。
  * getDerivedStateFromProps()：在调用 render 方法之前调用，且初始挂载及后续更新时都会被调用。
  * render()：class 组件中唯一必须实现的方法。
  * componentDidMount()：在组件挂载后立即调用。
* 更新阶段（Updating）：每当组件的 state 或 props 发生变化时，组件就会更新。
  * getDerivedStateFromProps()：在调用 render 方法之前调用，且初始挂载及后续更新时都会被调用。
  * shouldComponentUpdate()：当 props 或 state 发生变化时被调用。
  * render()：class 组件中唯一必须实现的方法。
  * getSnapshotBeforeUpdate()：在最近一次渲染输出（提交到 DOM 节点）之前调用。
  * componentDidUpdate()：在更新后会被立即调用。
* 卸载阶段（Unmounting）：组件取消挂载或从 DOM 中删除。
  * componentWillUnmount()：在组件卸载及销毁之前直接调用。

### React 源码解读

```html
<div id="app"></div>
<script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
<script>
  class Hellow extends React.Component {
    constructor(props) {
      super(props);
      this.state = { message: `Hellow, Lizhao. This is ${new Date()}` };
    }
    render() {
      return React.createElement(
        'p',
        {
          onClick: () => this.setState({
            message: `Hellow, Lizhao. This is ${new Date()}`
          })
        },
        this.state.message
      );
    }
  }
  const container = document.querySelector('#app');
  const hellowInst = ReactDOM.render(React.createElement(Hellow), container);
</script>
```

前端开发常用 React 作为 Web 应用程序的核心框架。事实上，Web 开发使用的 React 包含两部分：React 和 ReactDOM。

React 的核心是虚拟 DOM，负责描述 React 的特性：类组件、函数组件、hooks、contexts、refs...，并提供 React API。React 是平台无关的，它只描述特性长什么样、该怎么用，并不负责特性的具体实现。也就是说的，React 可用于 Web 开发，也可以用于原生开发。

ReactDOM 是浏览器环境的渲染器，负责将这些虚拟 DOM 渲染到浏览器中变成实际 DOM。

在 v17.0.2 版本中，**react.js 的源码仅有 3000 多行，而 react-dom.js 的源码则有 2w 多行**。实际上，大部分的框架逻辑都在 react-dom 当中。

React 提供以下 API：

```javascript
exports.Children = Children;
exports.Component = Component;
exports.PureComponent = PureComponent;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createRef = createRef;
exports.forwardRef = forwardRef;

// Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useEffect = useEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
// ...
```

#### createElement

createElement 可谓是 React 中最重要的 API 了，它用来创建并返回指定类型的新 ReactElement。

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

type 指代 ReactElement 的类型：

* 字符串：比如 div、p，代表原生 DOM，称为 HostComponent；
* Class类型：继承自 Component 或者 PureComponent 的组件，称为 ClassComponent；
* 函数：函数组件；
* 原生提供的 Fragment、AsyncMode 等是Symbol，会被特殊处理。

ReactElement 只是一个用来承载信息的容器，有以下信息：

* type：类型，用于判断如何创建节点；
* key 和 ref 这些特殊信息；
* props 新的属性内容；
* $$typeof 用于确定是否属于 ReactElement。

```javascript
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  };
  element._store = {};
  Object.defineProperty(element._store, 'validated', { /**...省略**/});
  Object.defineProperty(element, '_self', { /**...省略**/});
  Object.defineProperty(element, '_source', { /**...省略**/});
  return element;
};

function createElement(type, config, children) {
  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;
  // ...
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

function createElementWithValidation(type, props, children) {
	// ...
  var element = createElement.apply(this, arguments);
  // ...
  return element;
}
var createElement$1 = createElementWithValidation;
exports.createElement = createElement$1;
```

> 使用 JSX 编写的代码将会被转换成使用 React.createElement() 的形式。如果使用了 JSX 方式，那么一般来说就不需要直接调用 React.createElement()。

#### Component

React 的组件可以定义为 class 或函数的形式。如需定义 class 组件，需要继承 React.Component，且其子类中必须定义 render() 函数：

```javascript
class Hellow extends React.Component {
  render() {
    return <p>Hellow, Lizhao. This is {new Date()}</p>
  }
}
```

```javascript
var ReactNoopUpdateQueue = {
  isMounted: function (publicInstance) {
    return false;
  },
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function (partialState, callback) {
  // ...
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

React 的核心功能是根据传入的参数生成一个 ReactElement 对象，供渲染器使用。

### ReactDOM 源码解读

ReactDOM 是一个浏览器环境下的渲染器，其核心功能就是将 ReactElement 渲染成真实 DOM，然后挂载到文档中的某个节点下。

渲染器负责在不同的宿主载体上实现特性，达到与描述相对应的真实效果。与 ReactDOM 类似的，还有 ReactNative（渲染 App 原生组件）、ReactTest（渲染出纯 JavaScript 对象用于测试）和 ReactArt（渲染到 Canvas、SVG 或 VML (IE8)。

react-dom 包提供了用户 DOM 的特定方法，可以在应用程序的顶层进行使用，另外，还提供了客户端和服务器应用程序的特定模块：react-dom/client、react-dom/server。

react-dom 提供以下 API：

```javascript
exports.createPortal = createPortal$1;
exports.findDOMNode = findDOMNode;
exports.flushSync = flushSync;
exports.hydrate = hydrate;
exports.render = render;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.unstable_batchedUpdates = batchedUpdates$1;
exports.unstable_createPortal = unstable_createPortal;
exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
```

#### render()

在提供的 container 里渲染一个 React 元素，并返回对该组件的引用（或者针对无状态组件返回 null）。

```javascript
render(element, container[, callback])
```

```javascript
function render(element, container, callback) {
  // ...
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}

function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  // ...
  var root = container._reactRootContainer;
  var fiberRoot;
  if (!root) {
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    // ...
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // ...
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```

render() 方法的核心函数有两个：legacyCreateRootFromDOMContainer 和 updateContainer。

##### legacyCreateRootFromDOMContainer

legacyCreateRootFromDOMContainer 函数根据 container 元素数创建 Fiber 树的根节点，并初始化所有的事件监听器。其核心功能在 createFiberRoot 函数。

legacyCreateRootFromDOMContainer 的主要逻辑：

* legacyCreateRootFromDOMContainer：返回 createLegacyRoot 函数执行结果。
* createLegacyRoot：返回 ReactDOMBlockingRoot 实例对象。
* new ReactDOMBlockingRoot：构造函数，将 createRootImpl 函数执行结果赋值给实例的 _internalRoot 属性，添加实例方法 render 和 unmount。
* createRootImpl：根据 container 元素创建 Fiber 树的根节点，为 container 元素注册所有支持的监听事件。
* createContainer：返回 createFiberRoot 函数执行结果。
* createFiberRoot：创建 Fiber 树。

```javascript
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  // ...
  return createLegacyRoot(container, shouldHydrate ? {
    hydrate: true
  } : undefined);
}

function createLegacyRoot(container, options) {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

function ReactDOMBlockingRoot(container, tag, options) {
  this._internalRoot = createRootImpl(container, tag, options);
}

function createRootImpl(container, tag, options) {
  // ...
  var root = createContainer(container, tag, hydrate);
  // ...
  // 为 container 添加所有支持的监听事件
  listenToAllSupportedEvents(rootContainerElement);
	// ...
  return root;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate);
}
```

createFiberRoot 函数创建 Fiber 树的根节点（root）和宿主组件根 Fiber 节点（uninitializedFiber），然后将两者关联，即 root.current = uninitializedFiber，uninitializedFiber.stateNode = root。

createFiberRoot 函数的主要逻辑：

* new FiberRootNode：生成 FiberRootNode 实例（container 在实例的 containerInfo 属性中）。
* createHostRootFiber -> createFiber -> new FiberNode：生成 FiberNode 实例。
* initializeUpdateQueue：初始化 uninitializedFiber 节点的更新函数队列。

```javascript
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  // 创建 Fiber 树的根节点
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  // 初始化更新器
  initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

```javascript
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLanePriority;
  // ...
}
```

```javascript
function createHostRootFiber(tag) {
  // ...
  return createFiber(HostRoot, null, null, mode);
}

var createFiber = function (tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
};

function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  // ...
}
```

最终生成的 Fiber 树的根节点结构如下：

```shell
{
 - containerInfo: div # container 容器节点
 - current: FiberNode # 宿主组件的 Fiber 根节点
 	 - alternate: # 新节点，将替换该节点
   - child: # 子节点
   - elementType: # 元素类型 
   - ref: # 
   - return: # 父节点
   - sibling: # 兄弟节点
   - stateNode: # Fiber 树的根节点
   - ...
 - entangledLanes: 
 - entanglements: 
 - eventTimes: 
 - ...
}
```

##### updateContainer

updateContainer 函数将传入的 element 参数更新到容器，其核心函数是 scheduleUpdateOnFiber。

updateContainer 函数的主要函数：

* createUpdate：创建一个更新器，update.payload.element 属性指向 ReactDOM.render 方法的 element 参数。
* enqueueUpdate：对宿主组件的 Fiber 根节点更新函数进行排列，即修改 root.current.updateQueue.shared.pending 的数据。
* scheduleUpdateOnFiber：渲染 Fiber 树。

```javascript
function updateContainer(element, container, parentComponent, callback) {
  // ...
  var update = createUpdate(eventTime, lane);
  update.payload = {
    element: element
  };
  // ...
  enqueueUpdate(current$1, update);
  scheduleUpdateOnFiber(current$1, lane, eventTime);
  return lane;
}

function enqueueUpdate(fiber, update) {
  var updateQueue = fiber.updateQueue;
  // ...
  var sharedQueue = updateQueue.shared;
  var pending = sharedQueue.pending;
  // ...
  sharedQueue.pending = update;
  // ...
}

function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  // ...
  if (lane === SyncLane) {
    if (/** ... **/) {
      schedulePendingInteractions(root, lane); 
      performSyncWorkOnRoot(root);
    }
    // ...
  }
  // ...
}
```

##### scheduleUpdateOnFiber

scheduleUpdateOnFiber 是 Fiber 树的渲染的核心函数。无论是首次渲染还是后续的 setState、useState 等钩子函数的更新操作，都是调用 scheduleUpdateOnFiber 来重新渲染 Fiber 树。

scheduleUpdateOnFiber 函数的核心功能是在 performSyncWorkOnRoot 函数。

performSyncWorkOnRoot 函数的主要函数：

* renderRootSync：同步构建 Fiber 树。
* commitRoot：将 Fiber 树渲染到宿主环境。

```javascript
function performSyncWorkOnRoot(root) {
  // ...
  if () { } else {
    lanes = getNextLanes(root, NoLanes);
    exitStatus = renderRootSync(root, lanes);
  }
  // ...
  commitRoot(root);
  ensureRootIsScheduled(root, now());
  return null;
}
```

##### renderRootSync

renderRootSync 函数中的主要函数是：

* prepareFreshStack：设置全局变量 workInProgressRoot、workInProgress，记录正在工作的 Fiber 树和 Filber节点。
  * createWorkInProgress：根据当前节点的类型、props 创建一个新的 Fiber 节点，然后将当前节点的 elementType、type、stateNode、child、sibling、updateQueue 属性复制到新节点中，最后将新节点赋值到 workInProgress 变量和当前节点的 alternate 属性。

* workLoopSync：循环执行 performUnitOfWork 函数，直到 workInProgress 为空。

```javascript
function renderRootSync(root, lanes) {
  // ...
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes);
    startWorkOnPendingInteractions(root, lanes);
  }
  var prevInteractions = pushInteractions(root);
  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
  // ...
}

function prepareFreshStack(root, lanes) {
  // ...
  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
  // ...
}

function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;
  // ...
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  // ...
  return workInProgress;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

##### performUnitOfWork

performUnitOfWork 操作 Filber 树中的节点，直到所到 Fiber 节点执行完成。

* beginWork$1 -> beginWork：为各种不同类型的 Fiber 节点调用更新函数。返回值不为空，则赋值给 workInProgress，进行下一循环 ；否则，执行 completeUnitOfWork 函数。

* completeUnitOfWork -> completeWork：为各种不同类型的 Fiber 节点构建真实的 DOM 节点。遍历整个 Fiber 树，直接到当前  Fiber 节点的 return 属性为空；每次循环后，将 workInProgress 变量指定当前  Fiber 节点的 sibling 或 return 属性。

```javascript
function performUnitOfWork(unitOfWork) {
  // ...
  if (/** ... ***/) {
    // ...
  } else {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }

  resetCurrentFiber();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner$2.current = null;
}

beginWork$1 = function (current, unitOfWork, lanes) {
  // ...
  try {
    return beginWork(current, unitOfWork, lanes);
  } catch (originalError) {
    // ...
  }
};
```

##### beginWork

beginWork 函数为不同类型的组件调用不同的更新函数，创建对应组件的 Fiber 节点。

上面的简单示例中有三种类型组件，即 HostRoot（宿主树的根，即浏览器环境下的 DOM 树的根节）、ClassComponent、HostComponent（浏览器的 DOM）。

* HostRoot
  * updateHostRoot：返回 ReactDOM.render 函数中 element 参数的 Fiber 节点。
  * processUpdateQueue：在 workInProgress.updateQueue.shared.pending 查找需要更新的宿主 Element。
  * reconcileChildren：调用 reconcileChildFibers 函数，将其返回值赋值 workInProgress.child。
  * reconcileChildFibers：为不同类型组件调用不同函数，创建 Fiber 节点。
  * reconcileSingleElement：根据 Element 创建 Fiber 节点。
* ClassComponent
  * updateClassComponent：返回类组件实例中 render 方法生成的 ReactElement 的 Fiber 节点。
  * constructClassInstance：构造类的实例，将实例赋值到 workInProgress.stateNode 属性，将实例的 state 属性赋值到 workInProgress.memoizedState 属性。
  * mountClassInstance：修改实例的 props、state、refs 等属性，将实例的 state 更新到 workInProgress 的 updateQueue.baseState 属性。
  * finishClassComponent：调用实例的 render 方法，生成子 ReactElement。
  * reconcileChildren：调用 reconcileChildFibers 函数，将其返回值赋值 workInProgress.child。
  * mountChildFibers（reconcileChildFibers）：为不同类型组件调用不同函数，创建 Fiber 节点。
  * reconcileSingleElement：根据 Element 创建 Fiber 节点。
* HostComponent
  * updateHostComponent：返回 null
  * reconcileChildren：调用 reconcileChildFibers 函数，将其返回值赋值 workInProgress.child。
  * mountChildFibers（reconcileChildFibers）：返回 null。

```javascript
function beginWork(current, workInProgress, renderLanes) {
  // ...
  switch (workInProgress.tag) {
    case IndeterminateComponent: { /** ... **/ }
    case LazyComponent: { /** ... **/ }
    case FunctionComponent: {
      // ...
      return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);
    }
    case ClassComponent: {
      // ...
      return updateClassComponent(current, workInProgress, _Component2, _resolvedProps, renderLanes);
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case HostText:
      return updateHostText(current, workInProgress);
      // ...
  }
  // ...
}
```

##### completeWork

completeWork 函数为 Fiber 树的节点创建真实的 DOM 节点，并赋值到 workInProgress.stateNode 属性。

以 HostComponent 为例，主要逻辑为：

* createInstance：创建 DOM 节点，并在 DOM 节点中缓存 Fiber 节点和 props。
  * createElement：用 DOM 容器元素的 ownerDocument 对象的 createElement 方法创建对应类型的 DOM 元素。
* appendAllChildren：添加 DOM 元素的子元素。
* finalizeInitialChildren
  * setInitialProperties：初始化一些特殊元素。比如，注册 video、audio 的媒体事件；图片的加载和报错事件；input、select、textarea 元素的一些属性。
  * setInitialDOMProperties：为 DOM 元素设置属性。

```javascript
function completeWork(current, workInProgress, renderLanes) {
  var newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent:  {
      // ...
      return null;
    }
    case HostRoot: {
      // ...
      return null;
    }
    case HostComponent: {
      // ...
      if () { } else {
        if () { } else {
          var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
          appendAllChildren(instance, workInProgress, false, false);
          workInProgress.stateNode = instance; 
          if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance)) {
            markUpdate(workInProgress);
          }
        }
      }
      return null;
    }
    // ...
  }
}
```

##### commitRoot

commitRoot 函数将 Fiber 树中节点的真实 DOM 节点渲染到宿主环境下，主要函数是 commitRootImpl。

commitRootImpl 函数核心逻辑：

* commitBeforeMutationEffects：处理 DOM 变更**前**的一些生命周期等。
  * commitBeforeMutationLifeCycles：执行实例的 getSnapshotBeforeUpdate 方法等。

* commitMutationEffects：将 Fiber 树中节点的真实 DOM 节点渲染到宿主环境下。
  * commitPlacement
  * insertOrAppendPlacementNodeIntoContainer
  * appendChildToContainer：调用原生节点的 appendChild 方法插入节点。
* commitLayoutEffects：处理 DOM 变更**后**的一些生命周期等。
  * commitLifeCycles：执行实例的 componentDidMount、componentDidUpdate 方法等。

```javascript
function commitRoot(root) {
  var renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority$1(ImmediatePriority$1, commitRootImpl.bind(null, root, renderPriorityLevel));
  return null;
}

function commitRootImpl(root, renderPriorityLevel) {
  // ...
  if (firstEffect !== null) {
    // ...
    do {
      invokeGuardedCallback(null, commitBeforeMutationEffects, null);
      // ...
    } while (nextEffect !== null); // We no longer need to track the active instance fiber

    // ...
    do {
      invokeGuardedCallback(null, commitMutationEffects, null, root, renderPriorityLevel);
      // ...
    } while (nextEffect !== null);
    // ...
    nextEffect = firstEffect;
    do {
      invokeGuardedCallback(null, commitLayoutEffects, null, root, lanes);
      // ...
    } while (nextEffect !== null);
  }
  // ...
}
```

commitMutationEffects 函数的核心逻辑：

```javascript
function commitMutationEffects(root, renderPriorityLevel) {
  while (nextEffect !== null) {
    // ...
    switch (primaryFlags) {
      case Placement: {
        commitPlacement(nextEffect);
        // ...
      }
        // ...
    }
    // ...
  }
}

function commitPlacement(finishedWork) {
  // ...
  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}

function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  var tag = node.tag;
  var isHost = tag === HostComponent || tag === HostText;
  if (isHost || enableFundamentalAPI ) {
    var stateNode = isHost ? node.stateNode : node.stateNode.instance;
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) {} else {
    var child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      var sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function appendChildToContainer(container, child) {
  var parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode;
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  }
  // ...
}
```

#### 事件机制

React 基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等。

在 React 中这套事件机制被称之为合成事件。

在 React 17 中，事件机制有三个比较大的改动：

* 将事件委托给根节点而不是 document。
* 支持原生捕获事件：让所有的捕获事件与浏览器捕获阶段保持一致。同时，onScroll 事件不再进行事件冒泡。onFocus 和 onBlur 使用原生 focusin、focusout 合成。
* 移除事件池复用。

##### 合成事件（SyntheticEvent）

合成事件是 React 模拟原生 DOM 事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器。它根据 W3C 规范 来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口。

在 React中，绑定的 onClick 等事件，并不是原生事件，而是由原生事件合成的 React 事件。比如，click、touchstart、mousedown 事件合成为 onClick 事件；blur、change、input、keydown、keyup等合成为 onChange 事件。

采用合成事件的目的：

* 进行浏览器兼容，实现更好的跨平台：React 提供的合成事件用来抹平不同浏览器事件对象之间的差异，将不同平台事件模拟合成事件。
* 性能优化：将事件都代理到了容器节点上，减少了事件监听器的创建，节省了内存。
* 优先级机制：与底层架构上的任务调度「优先级机制」衔接。
* 事件统一管理和事务机制：React 可以知道原生事件发生的过程，方便追踪和管理事件。

```javascript
function createSyntheticEvent(Interface) {
  function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
    this._reactName = reactName;
    this._targetInst = targetInst;
    this.type = reactEventType;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;
    // ...
    return this;
  }

  _assign(SyntheticBaseEvent.prototype, {
    preventDefault: function () { /** ... **/},
    stopPropagation: function () { /** ... **/},
    persist: function () { /** ... **/},,
    isPersistent: functionThatReturnsTrue
  });

  return SyntheticBaseEvent;
}
```

##### 事件绑定

React 在渲染 React 树的根 DOM 容器（React 16 是在 Document 上）上注册了所有合法的原生事件，并通过 dispatchEvent 函数作为事件的统一回调函数。

事件绑定的函数调用栈为：render -> legacyRenderSubtreeIntoContainer -> legacyCreateRootFromDOMContainer -> createLegacyRoot -> new ReactDOMBlockingRoot -> createRootImpl -> listenToAllSupportedEvents。

```javascript
function listenToAllSupportedEvents(rootContainerElement) {
  // ...
  allNativeEvents.forEach(function (domEventName) {
    if (!nonDelegatedEvents.has(domEventName)) {
      listenToNativeEvent(domEventName, false, rootContainerElement, null);
    }

    listenToNativeEvent(domEventName, true, rootContainerElement, null);
  });
}

function listenToNativeEvent(domEventName, isCapturePhaseListener, rootContainerElement, targetElement) {
  // ...
  if (!listenerSet.has(listenerSetKey)) {
    // ...
    addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
    listenerSet.add(listenerSetKey);
  }
}

function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener, isDeferredListenerForLegacyFBSupport) {
  var listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
  // ...
  if (isCapturePhaseListener) {
    // ...
  } else {
    if (isPassiveListener !== undefined) {
      unsubscribeListener = addEventBubbleListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
    } else {
      unsubscribeListener = addEventBubbleListener(targetContainer, domEventName, listener);
    }
  }
}
```

特别要注意， addTrappedEventListener 函数中的 listener 函数是根据不同的事件优先级返回的不同函数。比如，onClick 事件调用的是 dispatchDiscreteEvent 函数：

```javascript
function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags) {
  // ...
  switch (eventPriority) {
    case DiscreteEvent:
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case UserBlockingEvent:
      listenerWrapper = dispatchUserBlockingUpdate;
      break;
    case ContinuousEvent:
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
}
```

对于非冒泡事件，则直接在绑定对应事件的 DOM 节点上，调用栈：render -> legacyRenderSubtreeIntoContainer -> updateContainer -> scheduleUpdateOnFiber -> performSyncWorkOnRoot -> renderRootSync -> workLoopSync -> performUnitOfWork -> completeUnitOfWork -> completeWork -> finalizeInitialChildren -> setInitialProperties。

```javascript
function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
  // ...
  switch (tag) {
    case 'dialog':
      listenToNonDelegatedEvent('cancel', domElement);
      listenToNonDelegatedEvent('close', domElement);
      props = rawProps;
      break;

    case 'iframe':
    case 'object':
    case 'embed':
      listenToNonDelegatedEvent('load', domElement);
      props = rawProps;
      break;
      // ...
  }
  // ...
}
```

##### 事件触发

React 事件机制采用委托形式，所有元素的事件都委托在 DOM 容器。事件触发时，dispatchEvent 函数被调用，依次处理从真实 DOM 上查找对应的 Fiber、事件批量提取、根据不同的事件类型合成不同的事件对象、在对应的Fiber 节点自下而上递归收集 props 中对应事件函数，最后执行所有事件的监听函数。

以 onClick 事件为例，在 createEventListenerWrapperWithPriority 函数中，其回调函数对应的是  dispatchDiscreteEvent 函数。该函数接收四个参数，domEventName、eventSystemFlags、container 三个参数是在注册时绑定的，第四个参数 nativeEvent 是原生 DOM 的监听函数接收的原生的 Event 对象。

dispatchDiscreteEvent 函数的主要逻辑：

* dispatchEvent：分发事件。
* attemptToDispatchEvent：获取事件的目标元素和目标元素对应的 Fiber 节点或者最近的祖先元素的 Fiber 节点。
* dispatchEventForPluginEventSystem
* dispatchEventsForPlugins：收集 Fiber 节点的事件及监听函数。
  * extractEvents$5：主要函数是 extractEvents$4，其他是对 mouseover、mouseout、focusout、focusin、onCompositionStart、onBeforeInput 等事件做些处理。
  * extractEvents$4：收集 Fiber 节点的事件，调用对应的合成事件构造函数生成合成事件实例，创建事件对象，追加到事件队列。
  * accumulateSinglePhaseListeners：收集存储在 Fiber 节点的 props 中的事件对应的监听函数。
* processDispatchQueue：处理事件队列。
  * processDispatchQueueItemsInOrder：处理事件监听函数。

```javascript
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  // ...
  discreteUpdates(dispatchEvent, domEventName, eventSystemFlags, container, nativeEvent);
}

function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  // ...
  var blockedOn = attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
  // ...
}

function attemptToDispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  // ...
  dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer);
  return null;
}

function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  // ...
  batchedEventUpdates(function () {
    return dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst);
  });
}

function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  var nativeEventTarget = getEventTarget(nativeEvent);
  var dispatchQueue = [];
  extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  // ...
}

function extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  // ..
  var _listeners = accumulateSinglePhaseListeners(targetInst, reactName, nativeEvent.type, inCapturePhase, accumulateTargetOnly);
  if (_listeners.length > 0) {
    var _event = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget);
    dispatchQueue.push({
      event: _event,
      listeners: _listeners
    });
  }
}

function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly) {
  // ...
  while (instance !== null) {
    // ...
    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;
      if (reactEventName !== null) {
        var listener = getListener(instance, reactEventName);

        if (listener != null) {
          listeners.push(createDispatchListener(instance, listener, lastHostComponent));
        }
      }
    }
    // ...
    instance = instance.return;
  }
  return listeners;
}

function getListener(inst, registrationName) {
  // ...
  var props = getFiberCurrentPropsFromNode(stateNode);
  // ...
  var listener = props[registrationName];
  // ...
  return listener;
}

function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  // ...
  for (var i = 0; i < dispatchQueue.length; i++) {
    var _dispatchQueue$i = dispatchQueue[i],
        event = _dispatchQueue$i.event,
        listeners = _dispatchQueue$i.listeners;
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
	// ...
}

function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
  if (inCapturePhase) {
    // ...
  } else {
    for (var _i = 0; _i < dispatchListeners.length; _i++) {
      // ...
      executeDispatch(event, _listener, _currentTarget);
    }
  }
}
```

#### 更新（setState）

setState 方法是类组件从 React.Component 继承的方法，调用的是类组件 updater 对象下的 enqueueSetState 方法。

```javascript
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject; 
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
Component.prototype.setState = function (partialState, callback) {
  // ...
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

updater.enqueueSetState 的创建过程是：render -> legacyRenderSubtreeIntoContainer -> updateContainer -> scheduleUpdateOnFiber -> performSyncWorkOnRoot -> renderRootSync -> workLoopSync -> performUnitOfWork -> beginWork$1 -> beginWork -> updateClassComponent。

updateClassComponent 函数的主要逻辑：

* constructClassInstance
* adoptClassInstance
* classComponentUpdater.enqueueSetState
* scheduleUpdateOnFiber

```javascript
function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
  // ...
  if (instance === null) {
    // ...
    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  }
  // ...
  return nextUnitOfWork;
}

function constructClassInstance(workInProgress, ctor, props) {
  // ...
  var instance = new ctor(props, context);
  var state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  adoptClassInstance(workInProgress, instance);
	// ...
  return instance;
}

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  set(instance, workInProgress);
  {
    instance._reactInternalInstance = fakeInternalInstance;
  }
}

var classComponentUpdater = {
  isMounted: isMounted,
  enqueueSetState: function (inst, payload, callback) {
    var fiber = get(inst);
    var eventTime = requestEventTime();
    var lane = requestUpdateLane(fiber);
    var update = createUpdate(eventTime, lane);
    update.payload = payload;
    // ...
    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
  enqueueReplaceState: function (inst, payload, callback) { /** ... **/},
  enqueueForceUpdate: function (inst, callback)  { /** ... **/}
};
```

classComponentUpdater.enqueueSetState 方法调用 enqueueUpdate 和  scheduleUpdateOnFiber 来根据 Fiber 树更新宿主组件，过程与上面的 updateContainer 函数类似。

调用逻辑与 updateContainer 函数有些差异：scheduleUpdateOnFiber -> ensureRootIsScheduled -> scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root)) -> flushSyncCallbackQueueImpl，其本质上还是调用 performSyncWorkOnRoot 函数。

#### 协调器（Reconciler）

React 在 performSyncWorkOnRoot -> renderRootSync -> workLoopSync -> performUnitOfWork 中，通过循环调用 performUnitOfWork 来更新 Filber 树上的节点。

performUnitOfWork  函数则是在 beginWork$1 -> beginWork 函数中，根据不同的组件类型调用不同的更新函数。其中 updateFunctionComponent、finishClassComponent、updateHostRoot、updateHostComponent 等更新函数都会调用 reconcileChildren 函数。

##### reconcileChildren

reconcileChildren 函数是 Reconciler 的核心。

reconcileChildren -> reconcileChildFibers 函数为当前 Filber 节点不同类型的子节点调用不同的协调函数，返回对应的 Filter 节点。

```javascript
function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
  // ...
  var isObject = typeof newChild === 'object' && newChild !== null;
  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
      case REACT_PORTAL_TYPE:
        return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
  }

  if (isArray$1(newChild)) {
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
  }

  if (getIteratorFn(newChild)) {
    return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
  }
  // ...
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

##### reconcileChildrenArray

如果子节点是数组，reconcileChildren 函数调用 reconcileChildrenArray 函数比较了新旧 Fiber 节点是否能够复用，其目的是为尽量少的遍历节点。这涉及到 DOM-Diff 算法，也就是是旧的 Fiber 节点和新 Fiber 节点的比对。

reconcileChildrenArray 函数主要逻辑：

```javascript
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
  // ...
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    // 旧节点位于新节点右边：下次循环，旧节点不变
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
	 	// 根据 key 判断是否可以复用节点：若可复用则返回旧节点创建的 Fiber
    var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
		// 不可复用节点，跳出循环
    if (newFiber === null) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }

    // 删除旧节点
    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) {
        deleteChild(returnFiber, oldFiber);
      }
    }

    // 更新操作
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    // ...
    oldFiber = nextOldFiber;
  }

  // 新节点遍历完，删除剩下的旧节点
  if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }

  // 旧节点遍历完，新节点若还有，则剩下的都是需要新创建的
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
      if (_newFiber === null) {
        continue;
      }
      // ...
    }
    return resultingFirstChild;
  }
  
  // 保存旧节点信息
  var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  
  // 第一次 for 循环过程中，碰到无法复用的节点便会跳到这里
  // 通过新节点的 key 值或索引，查找 existingChildren 是否有相同的旧节点
	for (; newIdx < newChildren.length; newIdx++) {
    var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);
    // ...
  }
	// ...
  return resultingFirstChild;
}
```

### Scheduler（调度器）原理

在浏览器中，GUI 渲染线程与 JavaScript 线程是互斥的，也就是说，JavaScript 脚本执行和浏览器布局、绘制不能同时执行。

主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。当 JavaScript 执行时间过长，超出了16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

因此，当遇到大计算量的操作或者设备性能不足时，会使页面中的一些动画渲染掉帧或者阻塞用户交互，从而导致页面卡顿现象。

为了解决这个问题，React 内部实现了一个 Scheduler。Scheduler 的核心原理是：在一个浏览器渲染帧（16.6ms）中，使用 **5ms** 进行 JavaScript 运算，其余时间用于 UI 渲染、用户交互处理等其他操作。

Scheduler 基于 Fiber 结构，在类似原生 requestIdleCallback 函数的回调中执行 Fiber 树中节点更新的 JavaScript 运算，当当前帧执行超过 5ms，则将剩余节点的更新放到下一帧，从来实现 Fiber 树渲染的异步可中断更新。

这是一个简单的 Scheduler 模拟：

```javascript
const syncSleep = (time) => {
  const start = new Date().valueOf();
  let countSleep = 0
  while (new Date().valueOf() - start < time) {
    console.log('sleep: ', ++countSleep)
  }
}
const add = (a, b) => {
  syncSleep(1);
  return a + b;
}
const accumulate = () => {
  let count = 0;
  let i = 1;
  const func = () => {
    if (i <= 200) {
      console.log('add: ', i);
      count = add(count, i);
      i ++;
      return func;
    }
    console.log("count:", count)
    return null
  }
  return func;
}

let expireTime;
const workLoop = (task) => {
  let taskForNextTime = task;
  while (new Date().valueOf() < expireTime && task) {
    taskForNextTime = task();
  }
  return taskForNextTime;
}

let nextTask = accumulate()
const channel = new MessageChannel();
channel.port1.onmessage = () => {
  expireTime = new Date().valueOf() + 5;
  nextTask = workLoop(nextTask);
  if (nextTask) {
    channel.port2.postMessage(null)
  }
}
channel.port2.postMessage(null)
```

### 一个简单的 React

```html
<div id="app"></div>
<script src="./react.js"></script>
<script src="./react-dom.js"></script>
<script>
  class Hellow extends React.Component {
    constructor(props) {
      super(props);
      this.state = { message: `Hellow, Lizhao. This is ${new Date()}!` };
    }
    render() {
      return React.createElement(
        'p',
        {
          onClick: (name) => this.setState({
            message: `Hellow, Lizhao. This is ${new Date()}!`
          })
        },
        this.state.message
      );
    }
  }
  const container = document.querySelector('#app');
  const hellowInst = ReactDOM.render(React.createElement(Hellow), container);
</script>
```

```javascript
// react.js
const createElement = (tag, attrs, ...childs) => {
  return { tag, attrs, childs }
}

function Component(props) {
  this.props = props
  this.state = {}
}
Component.prototype.setState = function (updateState) {
  this.state = Object.assign({}, this.state, updateState)
  ReactDOM.updateClassComponent(this)
}

const React = {
  createElement,
  Component
}
window.React = React
```

```javascript
// react-dom.js
const NOOP = function () {}
const setAttribute = (dom, attr, value) => {
  if (/on\w+/.test(attr)) {
    attr = attr.toLowerCase()
    dom[attr] = value || NOOP
    return
  }
  dom.setAttribute(attr, value)
}

const updateClassComponent = (component) => {
  const {
    props,
    state,
    base,
    shouldComponentUpdate = NOOP,
    componentWillReceiveProps = NOOP,
    componentWillUpdate = NOOP,
    componentWillMount = NOOP,
    componentDidUpdate = NOOP,
    componentDidMount = NOOP
  } = component
  const isUpdateComponent = !!base
  if (isUpdateComponent) {
    const bool = shouldComponentUpdate(props, state)
    if (!bool && bool !== undefined) {
      return false
    }
    componentWillReceiveProps()
    componentWillUpdate()
  } else {
    componentWillMount()
  }

  const element = component.render()
  const hostDom = createHostDom(element)
  if (isUpdateComponent) {
    base.parentNode && base.parentNode.replaceChild(hostDom, base)
    componentDidUpdate()
  } else {
    componentDidMount()
  }
  component.base = hostDom
}

const createHostDom = (element) => {
  if (['string', 'number'].includes(typeof element)) {
    return document.createTextNode(element)
  }

  if (Object.getPrototypeOf(element.tag) === React.Component) {
    const component = new element.tag(element.attrs)
    updateClassComponent(component)
    return component.base
  }
  
  if (['string'].includes(typeof element.tag)) {
    const hostDom = document.createElement(element.tag)
    if (element.attrs) {
      for (let key in element.attrs) {
        setAttribute(hostDom, key, element.attrs[key])
      }
    }
    if (element.childs) {
      element.childs.forEach(child => {
        hostDom.appendChild(createHostDom(child))
      })
    }
    return hostDom
  }
}

const ReactDOM = {
  render: (element, root) => {
    root.innerText = ""
    root.appendChild(createHostDom(element))
  },
  updateClassComponent
}
window.ReactDOM = ReactDOM
```

### 相关部题

#### React 有什么优点？

* 速度很快：采取虚拟 DOM 的方式，避免直接对 DOM 进行操作。在 UI 渲染过程中，React 通过在虚拟 DOM 中的微操作来实对现实际 DOM 的局部更新。
* 跨浏览器兼容：虚拟 DOM 帮助解决了跨浏览器问题，它提供了标准化的 API，甚至在 IE8 中都是没问题的。
* 单向数据流。
* 纯粹的 JavaScript。

#### 什么是进程、线程、协程、纤程？

##### 进程

进程是一个具有一定独立功能的程序在一个数据集上的一次动态执行的过程，是操作系统进行资源分配和调度的一个独立单位，是应用程序运行的载体。进程是一种抽象的概念，从来没有统一的标准定义。进程一般由程序、数据集合和进程控制块三部分组成。

##### 线程

线程是程序执行中一个单一的顺序控制流程，是程序执行流的最小单元，是处理器调度和分派的基本单位。一个进程可以有一个或多个线程，各个线程之间共享程序的内存空间。一个标准的线程由线程ID、当前指令指针(PC)、寄存器和堆栈组成。而进程由内存空间（代码、数据、进程空间、打开的文件）和一个或多个线程组成。

在一个进程中，当一个线程任务执行几毫秒后，会由操作系统的内核（负责管理各个任务）进行调度，通过硬件的计数器中断处理器，让该线程强制暂停并将该线程的寄存器放入内存中，通过查看线程列表决定接下来执行哪一个线程，并从内存中恢复该线程的寄存器，最后恢复该线程的执行，从而去执行下一个任务。

任务执行的那一小段时间叫做时间片，任务正在执行时的状态叫运行状态，被暂停的线程任务状态叫做就绪状态，意为等待下一个属于它的时间片的到来。

这种方式保证了每个线程轮流执行，由于 CPU 的执行效率非常高，时间片非常短，在各个任务之间快速地切换，给人的感觉就是多个任务在“同时进行”，这也就是并发。

**注意：** 进程是资源分配的最小单位，线程是 CPU 调度的最小单位。

##### 协程

协程全称为协同程序，又称作微线程。它与多线程情况下的线程比较类似。协程有自己的堆栈、局部变量和指令指针，通常，多个协程共享全局变量等很多信息。其思想是，一系列相互依赖的协程依次使用CPU，每次只有一个协程运行，其他协程处于休眠状态。协程实际上是在一个线程当中，每个协程对 CPU 进行分时访问。

协程是一个语言上的实现，本质是基于线程上的调度，要求协程上的代码不要做阻塞动作，在异步操作结束后重新排队。

线程和协程的主要区别在于：在多处理器的情况下，多线程程序可以同时运行多个线程；而协同程序需要通过协作来完成，在任一时刻只有一个协同程序在运行。

##### 纤程

纤程是比线程更小的一个运行单位。一个线程可以拆分为多个纤程，然后通过人工转换，从而让各个纤程工作。

纤程起始就是线程里面创建的多个执行任务。

**协程和纤程的区别在于：** 协程是在空闲时（异步操作中）主动让出线程的执行权，然后在异步操作结束后重新排队；而纤程是由调度器强制切换到其他纤程来交出线程的执行权。

### 参考资料

[React 官方中文文档](https://zh-hans.reactjs.org/)

[React技术揭秘](https://react.iamkasong.com/)



[React源码解析](https://react.jokcy.me/book/api/react.html)

[Github - React原理解析](https://sputnikw.github.io/React%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90/)

[稀土掘金 - 浅谈React17事件机制](https://juejin.cn/post/6971242638716436487)

[知乎 - React 的 Concurrent Mode 是否有过度设计的成分？](https://www.zhihu.com/question/434791954)

[jelly - 手写一个简单的 React](https://jelly.jd.com/article/60aceb6b27393b0169c85231)

[Github - 实现一个简单的react](https://github.com/yangrenmu/learn-react)

