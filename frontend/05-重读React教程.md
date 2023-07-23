## 重读React教程

使用 React 已经一年多了，这次重读了一篇 React 的文档，将一些主要概念和疑问做了一个整理。本文内容主要来自 [React 文档](https://zh-hans.reactjs.org/)，还有一些网上查询的资料，以及自己的一些使用经验和理解。由于篇幅过长，拆分成 [重读React教程](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/05-zhong-du-react-jiao-cheng) 和 [你必须知道的React问题](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/frontend/06-ni-bi-xu-zhi-dao-de-react-wen-ti) 两篇。

### React是什么？

**React** 是 Facebook 推出一个用于构建用户界面的 JavaScript 库。

它起源于 Facebook 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设 Instagram 的网站。做出来以后，发现这套东西很好用，就在2013年5月开源了。

React 负责解决其它 Javascript 框架所面对的一大常见难题，即对**大规模数据集的处理**。React 使用虚拟 DOM 和 Diff 算法，在数据发生变更时，只对 DOM 中的有差异部分进行重新渲染，使 React 得以实现远超其它框架的速度表现。

React 使创建交互式 UI 变得轻而易举。它可以将一些简短、独立的代码片段组合成复杂的 UI 界面，这些代码片段被称作“组件”。这点顺应了 Web 开发组件化的趋势。

React 不是 MVVM 框架。很多人也认为它不是纯粹的 MVC 框架，只是 MVC 中的 V （View，视图），一个以状态驱动视图的单向数据流的库。

React 特点：

- **声明式设计**：以声明式编写 UI，可以让你的代码更加可靠，且方便调试；
- **高效**：React 通过对 DOM 的模拟，最大限度地减少与 DOM 的交互；
- **灵活**：React 可以与已知的库或框架很好地配合；
- **JSX**：JSX 是 JavaScript 语法的扩展。React 开发不一定使用 JSX ，但我们建议使用它；
- **组件**：通过 React 构建组件，使得代码更加容易得到复用，能够很好的应用在大项目的开发中；
- **单向响应的数据流**： React 实现了单向响应的数据流，从而减少了重复代码，这也是它为什么比传统数据绑定更简单。



### React基本原理

作为一个构建用户界面的库，React 的核心始终围绕着**更新**这一个重要的目标，将更新和极致的用户体验结合起来是 React 团队一直在努力的事情。

在 Web 开发中，我们总需要将变化的数据实时反应到 UI 上，这时就需要对 DOM 进行操作。而**复杂或频繁的DOM 操作通常是性能瓶颈产生的原因**（如何进行高性能的复杂 DOM 操作通常是衡量一个前端开发人员技能的重要指标）。

为此，React 引入了**虚拟DOM（Virtual DOM）**的机制：在浏览器端用 Javascript 实现了一套 DOM API。在React 开发中，所有的 DOM 操作都是通过虚拟 DOM 进行，每当数据变化时，React 都会重新构建整个虚拟 DOM 树，再将当前整个虚拟 DOM 树和上一次的虚拟 DOM 树进行对比，得到虚拟 DOM 结构的区别，然后仅仅将需要变化的部分进行实际的浏览器 DOM 更新。

尽管每一次都需要构造完整的虚拟 DOM 树，但是因为虚拟 DOM 是内存数据，性能是极高的，而对实际 DOM 进行操作的仅仅是 Diff 部分，因而能达到提高性能的目的。

React 还优化了批处理虚拟 DOM 的刷新，在一个事件循环（Event Loop）内的两次数据变化会被合并。如：连续先将节点内容从 A 变成 B，然后又从 B 变成 A，React 会认为 DOM 不发生任何变化。

这样，在保证性能的同时，开发者将不再需要关注某个数据的变化如何更新到一个或多个具体的 DOM 元素，而只需要关心在任意一个数据状态下，整个界面是如何 Render 的。

**简而言之：React 将浏览器中的 DOM 抽象成一个 Javascript 对象（虚拟 DOM）。React 所有的表层操作实际上是在操作虚拟 DOM，再经过 Diff 算法计算出当前虚拟 DOM 与上一次的虚拟 DOM 的差异，然后将差异进行实际的 DOM 操作更新页面。**



### React的几个重要概念

**React 的核心思想是封装组件。** 各个组件维护自己的状态和 UI，当状态变更，自动重新渲染整个组件。基于这种方式的一个直观感受就是我们不再需要不厌其烦地来回查找某个 DOM元素，然后操作 DOM 去更改 UI。

React 的几个重要概念：

#### 虚拟DOM

虚拟 DOM 是一种编程概念： **UI 以一种理想化的，或者说“虚拟的”表现形式保存在内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步**。

React 的虚拟 DOM 是**由 Javascript 类库基于浏览器 API 来实现的，其本质是一个由浏览器 DOM 转换而成 Javascript 对象。** 这是一套独立于浏览器的 DOM 系统，兼顾了性能和跨浏览器的兼容性。

当浏览器载入 HTML 文档并渲染用户界面时，构成 HTML 文档的元素就是 DOM（文档对象模型）。Javascript 通过浏览器 API 操作 DOM。但是，这些操作是非常低效，频繁使用 JS 操作 DOM 元素可能会变得复杂而又耗时。

React 的初衷就是**帮助用户更新浏览器的 DOM**，让我们不再需要关心 DOM 的操作和复杂单页面应用的性能。React 实现虚拟 DOM 后，我们不需要和 DOM API 打交道，取而代之的是虚拟 DOM，React 会通过 DOM API 为用户尽可能高效地渲染虚拟 DOM。

**之所以引入虚拟DOM：** 一方面是性能的考虑，访问虚拟 DOM 要比访问 DOM API 更高效，并且还可以采用 Diff 算法进一步优化；更重要的一方面是提供一种一致的开发方式来开发服务端应用、Web 应用和手机端应用。

#### 组件

**React 应用都是构建在组件之上。**

**所谓组件，即封装起来的具有独立功能的 UI 部件。**React 推荐以组件的方式去重新思考 UI 构成，将 UI 上每一个功能相对独立的模块定义成组件，然后将小的组件通过组合或者嵌套的方式构成大的组件，最终完成整体 UI 的构建。

**组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。** 

React 认为一个组件应该具有如下特征：

- **可组合：** 一个组件易于和其它组件一起使用，或者嵌套在另一个组件内部。通过这个特性，一个复杂的 UI 可以拆分成多个简单的 UI 组件；
- **可重用：** 每个组件都是具有独立功能的，它可以被使用在多个 UI 场景；
- **可维护：** 每个小的组件仅仅包含自身的逻辑，更容易被理解和维护；

#### [Diff算法](https://zh-hans.reactjs.org/docs/reconciliation.html)

**Diff 算法全称叫做 Difference 算法，用于计算出两个虚拟 DOM 的差异，实质上是两个 Javascript 对象的对比。**这是 React 中开销最大的地方，**也是 React 性能优化的重点。**

在某一时间节点调用 React 的 `render()` 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 `render()` 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何高效的更新 UI，以保证当前 UI 与最新的树保持同步。

在算法领域中，两棵树的转换目前最优的算法复杂度为 `O(n3)` ，n 为节点数量。 这意味着当树上有 1000 个元素时，需要`1000 * 1000 * 1000 = 10亿` 次比较，显然远远不够高效。

> 将两颗树中所有的节点一一对比需要 `O(n²)` 的复杂度，在对比过程中发现旧节点在新的树中未找到，那么就需要把旧节点删除，删除一棵树的一个节点（遍历找到一个合适的节点，存放被删除节点的子节点）的时间复杂度为 `O(n)`，同理添加新节点的复杂度也是 `O(n)`，合起来 Diff 两个树的复杂度就是 `O(n³)`。

React 在基于以下两个假设的基础上, 提出了一套复杂度为 `O(n)` 的启发式算法：

* 不同类型（即标签名、组件名）的元素会产生不同的树；

* 通过设置 `key` 属性来标识一组同级子元素在渲染前后是否保持不变。

在实践中, 以上两个假设在绝大多数场景下都成立。

当对比两棵树时，React 首先比较两棵树的根节点。不同类型的根节点元素会有不同的形态。

Diff 算法描述：

* **不同类型的元素/组件：** 当元素的标签或组件名发生变化, 直接卸载并替换以此元素作为根节点的整个子树。

* **同一类型的元素：** 当元素的标签相同时，React 保留此 DOM 节点，仅对比和更新有改变的属性（如：className、title等），然后递归对比其子节点。对于 style 属性，React 会继续深入对比，仅更新有改变的属性（如：color、fontSize等）。

* **同一类型的组件：** 当组件的 props 更新时，组件实例保持不变，React 调用组件的生命周期方法，并执行 render() 方法。Diff 算法会递归比对新旧 render() 执行的结果。

* **对子节点的递归：** 默认情况下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个变化。
  
  当一组同级子节点（列表）的末尾添加了新的子节点时，上述 Diff 算法的开销较小。但当新元素被插入到列表开头时，Diff 算法只能按顺序依次比对并重建从新元素开始的后续所有子节点，造成极大的开销浪费。
  解决方案是为一组列表项添加 key 属性。Diff 对同一层级的子节点进行处理时，会根据 key 进行简要的复用。两棵树中存在相同 key 的节点时，只会移动节点。
  **Key 应该具有稳定，可预测，以及列表内唯一的特质。**同时，应该避免使用数组索引值作为 key，因为当插入或删除元素后，之后的元素和索引值的对应关系都会发生错乱，导致错误的比对结果。也应该避免使用不稳定的 key （如：随机数），因为每次渲染都会发生改变，从而导致列表项被不必要地重建。

#### 单向数据流

**单向数据流：即规范了数据的流向——数据只能由父组件向子组件进行传递，反过来则不行。** 

单向数据绑定是 React 推崇的一种应用架构的方式：在 React 应用中，任何可变数据应当只有一个相对应的唯一“数据源”。组件可以将自身的 state 向下传递，作为其子组件的 props 属性，并任何组件都是彼此独立地管理其内部 state，每个组件的 state 只能影响组件树下方的组件。

单向数据流（从上到下）与单一数据源这两个原则，限定了 React 中多个组件需要反映相同的变化数据，需要进行状态提升，**即将共享状态（变化数据）提升到他们最近的共同父组件中**。

也就是说，如果一个组件的状态变化，需要更新另一个组件，先将该状态移到这两个组件最近的共同父组件中。组件状态变更，通过发消息的方式向上传递，触发父组件状态的变更（详见下方**逆向通信**），而父组件状态的变更后，React 会自动更新其所有子组件的状态，并重新渲染。

单向数据绑定方式比双向绑定方式需要编写更多的代码，但带来的好处是：**排查和隔离 bug 所需的工作量将会变少**。因为，存在于组件中的任何 state，仅有组件自己能够修改它。

#### JSX

JSX 是一个 JavaScript 的语法扩展，是 React 提出的一种语法。

JSX 类似于模板语言，但它具有 JavaScript 的全部能力。JSX 最终会被编译为 `React.createElement()` 函数调用，返回称为 “React 元素” 的普通 JavaScript 对象。

JSX 能很好地描述 UI 应该呈现出它应有交互的本质形式（即，书写 JS 语言的文件允许书写 HTML 语言，可以更直观了解最终在浏览器呈现的 UI）。

```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName
}
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
}

const element =  <h1> Hello, {formatName(user)}! </h1>
ReactDOM.render(element, document.getElementById('root'))
```

JSX 有以下特点：

- 可以嵌套表达式 `{}`；
- 本身就是一个表达式对象；
- 通过使用 `“”` 双引号或者 `{}` 来作为属性；
- 必须明确声明字对象，没有子对象，应该使用自闭和标签；
- 可以防止注入攻击；
- 可以使用 babel 将 JSX 转换为 Javascript 对象；

React 并不强制要求使用 JSX。当你不想在构建环境中配置有关 JSX 编译时，不在 React 中使用 JSX 会更加方便。

每个 JSX 元素只是调用 `React.createElement(component, props, ...children)` 的语法糖。因此，**使用 JSX 可以完成的任何事情都可以通过纯 JavaScript 完成。**



### 组件状态：props和state

React 把用户界面当作简单的状态机。把用户界面想像成拥有不同状态，之后渲染这些状态，这样可以轻松让用户界面和数据保持一致。

React 有两种管理状态的数据模型：props 和 state。

#### props

React 定义组件时，会将组件所有接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”，即 props 是从父组件向下传递给子组件的数据。

React 有一条规则：**props 是只读的，组件不应以任务方式修改自身的 props。所有 React 组件都必须像纯函数一样保护它们的 props 不被更改**。

注意：组件可以接受任意 props，包括基本数据类型，React 元素以及函数。

#### state

state 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

state 包含了组件中**用于渲染且随时可能发生变化的数据**，它由用户自定义，是一个普通 JavaScript 对象。**除了拥有并设置它的组件，其他组件都无法访问。**这就是为什么称 state 为私有的、局部的或封装的。

组件可以选择把它的 state 作为 props 向下传递到它的子组件中。

```jsx
<MyComponent data={this.state.data} />
<MyComponent {...this.state} />
```

这通常会被叫做“自上而下”或是“单向”的数据流。任何的 state 总是属于特定的组件，而且从该 **state 派生的任何数据或 UI 只能影响树中“低于”它们的组件**。

如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。

正确地使用 state：

* 构造函数是唯一可以给 state 赋值的地方；

* 不要直接修改 state，而是应该使用 `setState()`；

* state 的更新可能是异步的：出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用；
* state 的更新会被合并（浅合并）：当你调用 `setState()` 的时候，React 会把你提供的对象合并（浅合并）到当前的 state；

#### 逆向通信：子组件向父组件通信

React 中的数据是采用 "自上而下"的单向流动，即，父组件向子组件传递数据。现在，我们尝试组件的逆向通信：子组件更新父组件的 state。

前面我们说过，父组件是通过 props 将自身的 state 传递给子组件的，而 props 是只读的，state 只能由拥有并设置它的组件访问。所以，逆向通信实现思路是：**让父组件向子组件传递一个能够触发父组件 state 改变的函数，子组件调用该函数通知父组件更新 state**。

```jsx
function ChildComponent(props) {
  return <>
    <p>Hello, {props.name}!</p>
    <button onClick={() => props.updateStateName('Lizh')}>点击修改</button>
  </>
}

function ParentComponent() {
  const [state, setState] = useState({ name: 'World'})
  const updateStateName = value => {
    setState({ name: value })
  }
  return <ChildComponent name={state.name} updateStateName={value => updateStateName(value)} />
}
```

#### props和state的区别是什么？

props 和 state 都是普通的 JavaScript 对象。它们都是用来保存信息的，这些信息可以控制组件的渲染输出，而它们的一个重要的不同点就是：**props 是父组件传递给子组件的（类似于调用函数时，传入的的形参），而 state 是在组件内被组件自己管理的（类似于定义函数时，内部声明的变量）**。组件不能修改 `props`，但可以调用 `setState()` 方法修改  `state`。



### 类组件

类组件：使用 ES6 的 class 来定义的组件。类组件继承 `React.Component` 并且创建 `render` 函数返回 react 元素。

```js
class MyComponent extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

#### state

构造函数是唯一可以给 state 赋值的地方，并且允许接收 props 参数**（不推荐，除非后续的渲染不依赖于 props 的更新）**。

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name
    }
  }
  // 或者
  // state = { date: new Date() }
  ...
}
```

#### setState

`setState()` 将对组件 state 的更改排入队列，并通知 React 需要使用更新后的 state 重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式。

`setState()` 应该视为请求，而不是立即更新执行的命令，因为它是异步的。React 并不会保证 state 的变更会立即生效。

```jsx
setState(updater, [callback])
```

第一个参数除了接受函数外，还可以接受对象类型。传入函数，函数中接收的 state 和 props 都保证为最新，函数的返回值会与 state 进行浅合并；传入对象，将传入的对象浅层合并到新的 state 中。

第二个参数为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行。通常，我们建议使用 `componentDidUpdate()` 来代替此方式。

```jsx
this.setState({ name: 'lizh' })
// 第一个参数可以传函数。用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数
this.setState((state, props) => ({
  name: state.name + '01'
}), () => {
  console.log('回调函数')
})
```

#### forceUpdate

默认情况下，当组件的 state 或 props 发生变化时，组件将重新渲染。如果 render() 方法依赖于其他数据，则可以调用 `forceUpdate()` 强制让组件重新渲染。

调用 `forceUpdate()` 将致使组件调用 `render()`方法，此操作会跳过该组件的 `shouldComponentUpdate()`。但其子组件会触发正常的生命周期方法，包括 `shouldComponentUpdate() `方法。

#### 生命周期

`setState、forceUpdate` 是 React 更新组件的主动调用的方法，而生命周期方法是在组件渲染的不同阶段自动触发的。

常用的生命周期方法如下：

* `render()`：class 组件中唯一必须实现的方法。该方法返回以下值之一：一个React 元素、一个包含多个 React 元素的数组或 fragments、字符串或数值类型、布尔类型或 null 或一个 Portals 实例（将子节点渲染到存在于父组件以外的 DOM 节点）。

* `constructor()`：构造函数，在组件挂载之前调用，仅用于：初始化内部 state、为事件处理函数绑定实例。

* `componentDidMount()`： 在组件挂载后（插入 DOM 树中）立即调用。

* `componentWillUnmount()`：在组件卸载及销毁之前直接调用。

* `shouldComponentUpdate()`：在 props 或 state 发生变化后，渲染执行之前被调用。

  根据返回值的布尔值，判断是否重新渲染当前 state 或 props 的更改。默认是每次发生变化都会重新渲染组件；如果返回 false，则跳过更新。

  > 请注意：返回 false 并不会阻止子组件在 state 更改时重新渲染；首次渲染或使用 forceUpdate() 时不会调用该方法。

* `componentDidUpdate()`：在更新后会被立即调用。首次渲染不会执行此方法。

      componentDidUpdate(prevProps, prevState, snapshot)

  第三个参数是生命周期 `getSnapshotBeforeUpdate()` 方法的返回值；如果没有该生命周期，此参数为 `undefined`。

  > 请注意：如果 `shouldComponentUpdate()` 返回值为 false，则不会调用该方法。

* `static getDerivedStateFromProps()`：在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

  > 请注意：此方法无权访问组件实例；不管原因是什么，都会在每次渲染前触发此方法。

* `getSnapshotBeforeUpdate()`：最近一次渲染输出（提交到 DOM 节点）之前调用。

挂载时，生命周期调用顺序：`constructor() -> static getDerivedStateFromProps() -> render() -> componentDidMount()`。

更新时，生命周期调用顺序：`static getDerivedStateFromProps() ->  shouldComponentUpdate() -> render() -> getSnapshotBeforeUpdate() -> componentDidUpdate()`。



### 函数组件

函数组件：编写 JavaScript 函数来定义组件。函数组件是一个纯函数，它接收一个 `props` 对象返回一个 `react` 元素。

```js
function MyComponent(props) {
  return <h1>Hello, {props.name}</h1>
}
```

在 Hook 出现之前，react 中的函数组件通常只负责 UI 的渲染，没有自身的状态和生命周期。可以说，在 Hook 之前的函数组件和类组件**最大**的区别是：状态和生命周期的有无。

#### 什么是Hook？

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。它是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

React 有一些内置的 Hook。你也可以创建你自己的 Hook 来复用不同组件之间的状态逻辑。

**Hook 使用规则：**

* 只能在函数最外层调用 Hook，不要在循环、条件判断或者子函数中调用；
* 只能在 React 的函数组件中调用 Hook（或者自定义的 Hook 中）。不要在其他 JavaScript 函数中调用。

Hook 在 class 内部是不起作用的。但你可以使用它们来取代 class 。

#### useState

调用 `useState()` 会给组件添加一些内部状态。

```jsx
const [state, setState] = useState(initialState)
const [state, setState] = useState(() => {
  let initialState = null
 	// do something
  return initialState
})
```

`initialState` 可以是对象，可以是数字或字符串，也可以不传，还可以传入一个函数，在函数中计算并返回初始的 state。`initialState` 只有在第一次渲染时会被用到，后续渲染时会被忽略。

`useState()` 返回一个有两个值的数组：当前状态和一个让你更新状态的函数。在这里，我们定义状态名是 `state`，更新函数的名称是 `setState`，这两个变量是数组解构的赋值，我们可以给他们定义任何名称。

```jsx
setState(newState)
setState(prevState => {
  // do something
  return prevState
})
```

更新函数类似 class 组件的 `this.setState`，但是它是用新的 state 替换旧的 state，而不是将两者进行合并。它的参数除了接收具体的值，还可以接收一个函数。该函数将接收先前的 state，并返回一个更新后的值。

如果更新函数接收的值或接收的函数的返回值与当前 state 完全相同，React 将跳过子组件的渲染及 effect 的执行。（React 使用 `Object.is()` 比较算法来比较 state。）

需要注意的是，React 可能仍需要在跳过渲染前执行 render 方法。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。

一个组件中可以使用多个 useState。

#### useEffect

你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

`useEffect` 可以让你在函数组件中执行副作用操作。它跟类组件中的 `componentDidMount`、 `componentDidUpdate`  和  `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

```jsx
// 等同于 componentDidMount 和 componentDidUpdate
useEffect(() => {
  // do something
})
```

默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。

然而，在某些场景下可能不需要每次渲染都调用副作用函数。要实现这一点，可以给  `useEffect`  传递第二个参数，它是 effect 所依赖的值数组。

```jsx
useEffect(
  () => {
    const subscription = props.source.subscribe();
  },
  [props.source]
)
```

此时，只有当 `props.source` 改变后才会调用副作用函数。如果数组中有多个元素，那么只要有一个元素发生变化，React 就会执行 effect。

如果想只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。

> 注：与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。

副作用函数还可以通过返回一个函数来指定如何“清除”副作用。

```jsx
useEffect(() => {
  // 等同于 componentWillUnmount
  return function () {
    // do something
  }
})
```

一个组件中多次使用 `useEffect` 。

#### useReducer

useState 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。

在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数 。dispatch 永远不会变，因此读取它的组件不需要重新渲染。

```jsx
const initialState = {count: 0}
function init(iState) {
  return {count: iState}
}
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1}
    case 'decrement':
      return {count: state.count - 1}
    default:
      throw new Error()
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // 或者
  // const [state, dispatch] = useReducer(reducer, initialState, init)
  return <>
    Count: {state.count}
		<button onClick={() => dispatch({type: 'decrement'})}>-</button>
		<button onClick={() => dispatch({type: 'increment'})}>+</button>
	</>
}
```

#### useCallback

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的缓存版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如： `shouldComponentUpdate`）的子组件时，它将非常有用。

useCallback 可以将组件的某些处理函数挂载到 React 底层原型链上，并返回该处理函数的引用，当组件每次即将要重新渲染时，确保 props 中该处理函数为同一函数（因为是同一对象引用），跳过本次无意义的重新渲染，达到提高组件性能的目的。

```jsx
const memoizedCallback = useCallback(
  () => {
    if (name === 'World') {
      console.log(`callback1：World`)
      return
    }
    console.log(`callback2：${name}`)
  },
  [name]
)
```

#### useMemo

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算缓存值。这种优化有助于避免在每次渲染时都进行高开销的计算。

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。

#### useLayoutEffect

其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用副作用。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

#### 自定义Hook

通过自定义 Hook，可以将组件逻辑提取到可重用的函数中。自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。

```jsx
import { useState, useEffect } from 'react';
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    }
  })
  return isOnline
}
```

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**Hook 函数与 JavaScript 函数的区别：**一、自定义 Hook 函数可以使用其他 Hook 函数，实现类似生命周期的管理；二、React 以某种方式跟踪 Hook 函数调用，即 React 能够将 Hook 函数调用（及其输入和输出）与特定的 React 元素相关联。



### 类组件和函数组件的区别

了解了类组件和函数组件，你可能马上会有疑问了：我应该用类组件还是函数组件呢？这两者有什么不同？

#### 两者的区别

* **实现思想：** 类组件根基是向对象编程；函数组件是函数式编程。
* **复用模式：** 类组件可以实现继承，函数组件缺少继承能力。不过，这不重要，因为 React 的思想：**组合优于继承**（继承的灵活性差，细节屏蔽过多）。

* **语法上：** 函数组件是一个纯函数，它接收一个 props 对象返回一个 React 元素。而类组件是继承 `React.Component` 并且创建 `render` 函数返回 react 元素。
* **状态管理：** 类组件通过 `setState` 管理组件状态；而函数组件呢？它是一个纯函数，是没有 state 的，通常我们也称它为无状态组件。
* **生命周期：** 类组件所有的生命周期钩子都来自于继承的 `React.Component`；而函数组件是没有生命周期钩子的。
* **未来趋势：** 基于 Hook 的加持，React 社区主推函数组件。

> **注意：react@16.8 版本添加了 hooks ，可以在函数组件中使用 `useState` 钩子去管理 `state`，使用 `useEffect` 钩子去使用生命周期函数。**

#### 本质的差异

两者本质的差异是：**心智模式（心智模型、心理模型）， 函数式组件捕获了渲染时所使用的值。**

> **Mental Model：Function components capture the rendered values.**

关于这一点，[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/) 文章讲的非常详细。

个人对此的理解是：类似于 JavaScript 中函数调用时，参数传值和传址的区别。

以下是在 React 中的简单示例：

组件定义时，props 的属性 propA 的默认值是 'word'，并在组件中设置一个定时器，3s 后打印 propA，然后在渲染后，定时器触发前，父组件更新 propA 的值为 'lizhao'。

```jsx
function MyComponents (props) {
  useEffect(() => {
    setTimeout(() => {
      alert(props.propA)    
    })    
  }, [])
  ...
}
```

```jsx
class MyComponents extends React.Component {
	componentDidMount () {
    setTimeout(() => {
      alert(this.props.propA)    
    })
  }
  ...
}
```

那么，定时器触发时，alert 打印出来的值是 'word'，还是 'lizhao'?

代码执行结果：函数组件打印出来的是 'word'，而类组件打印出来的是 'lizhao'。

我们知道，props 是不能被组件以任何方式修改的，组件渲染时接收的是什么值，props 一直（组件当前状态期间）会是这个值。这是也是函数组件的表现，它**捕获了渲染时所使用的值**。但是，对于类组件呢，它虽然不能修改 props，但它在定时器中访问 propA 属性的方式是 `this.props.propA`，`this` 是指向组件实例的，`this` 是可变的。当组件重新渲染后，`this` 指向了新的实例的， 定时器触发时， `this.props.propA` 也指向了新实例的 `propA`。

所以说，函数组件捕获渲染时的值，而类组件捕获最新实例的值。这在大部分场景区别不大，但两者的思维模式有本质区别。

至于，你最终是希望捕获渲染时的值，还是捕获最新实例的值，决定于你的业务需求。不过，你无需担心选用类组件或函数组件不符合你的期待。类组件可以实现捕获渲染时的值，函数组件也可以实现捕获最新实例的值（使用 `useRef()` 实现，详见 [How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes)），两者只是关注的方向不同。

#### 为什么会在 React 中加入 Hook？

Hook 解决了类组件中一些问题：

- 在组件之间复用状态逻辑很难：使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使你在无需修改组件结构的情况下复用状态逻辑。
- 复杂组件变得难以理解：将逻辑完全不相关的代码组合在一个方法，这样容易产生 bug，并且导致逻辑不一致。Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。
- 难以理解的 class：JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。
- class 给目前的工具带来了一些问题：class 不能很好的压缩，并且会使热重载出现不稳定的情况。

React 准备让 Hook 覆盖所有 class 组件的使用场景，但是**React也将继续为 class 组件提供支持。**

#### 性能对比

你可能听过其中一个好处是性能更好了，但是哪个是更好的？很多判断标准都存在缺陷。

一般来说，我们可以认为 Hook 的设计在某些方面更加高效：

* Hook 避免了 class 需要的额外开支，像是创建类实例和在构造函数中绑定事件处理器的成本。
* 符合语言习惯的代码在使用 Hook 时不需要很深的组件树嵌套。这个现象在使用高阶组件、render props、和 context 的代码库中非常普遍。组件树小了，React 的工作量也随之减少。

但是，在现代浏览器中，闭包和类的原始性能只有在极端场景下才会有明显的差别。性能主要取决于代码做的事情，而不是取决于你是使用函数或者类。实际上，两者的性能尽管在不同优化策略下有所不同，但差异不大。

#### 两者的优劣性

类组件

- this 的模糊性；
- 业务逻辑散落在生命周期中
- 类组件缺乏标准的拆分方式。

函数组件

- 基于函数式编程的优点（输入输出恒定，无副作用等），函数组件更纯粹、简单、易测试；
- 闭包捕获的值优于 this 的模糊性，捕获的值永远是确定且安全的；
- 更细腻的逻辑组织和复用，更好的作用于时间切片与并发模式；
- 由于函数组件的执行从来都是自顶向下，依赖于`dom diff`算法不至于频繁渲染。



### 事件处理

由于 fiber（负责调用组件生命周期方法，进行 Diff 运算等） 机制的特点，生成一个 fiber 节点时，它对应的 DOM 节点有可能还未挂载，onClick 这样的事件处理函数作为 fiber 节点的 prop，也就不能直接被绑定到真实的 DOM 节点上。

为此，React提供了一种 **“顶层注册，事件收集，统一触发”** 的事件机制。这套事件机制被称之为**合成事件**。

**合成事件是** React 基于浏览器的原生事件机制实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等。React 根据 W3C规范来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口。

React 的合成事件处理和原生事件很相似，但是也有如下不同点：

- React 事件的命名采用小驼峰式，而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

- React 不能通过返回 false 的方式阻止默认行为，必须显式的使用 preventDefault。

如果想要获得原生DOM事件，可以通过 `e.nativeEvent` 属性获取：

```jsx
const handleClick = e => console.log(e.nativeEvent)
const ButtonComponent = <button onClick={handleClick}>按钮</button> 
```

`onClick` 事件看似绑定到 DOM 元素上，但实际并不会把事件代理函数直接绑定到真实的节点上，而是把所有的事件绑定到结构的最外层，使用一个统一的事件去监听。

这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象。

当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用（**先执行原生事件，然后处理 React 事件**）。这样做简化了事件处理和回收机制，效率也有很大提升。

如需注册捕获阶段的事件处理函数，则应为事件名添加 `Capture`。例如，处理捕获阶段的点击事件请使用 `onClickCapture`，而不是 `onClick`。



### 受控组件和非受控组件

**在一个受控组件中，表单数据是由 React 组件来管理的，而在非受控组件，表单数据将交由 DOM 节点来处理。**

#### 受控组件

如果一个表单元素的值是由 React 控制，就其称为受控组件。当用户将数据输入到受控组件时，触发组件的事件处理器修改状态。

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }
  handleChange(event) {
    this.setState({value: event.target.value})
  }
  render() {
    return <form>
      <input type="text" value={this.state.value} onChange={e => this.handleChange(e)} />
    </form>
  }
}
```

#### 非受控组件

一个非受控组件，就像是运行在 React 体系之外的表单元素，它的值是存在 DOM 中。当用户将数据输入到表单字段时，React 不需要做任何事情（不需要为每个状态更新都编写数据处理函数）就可以映射更新后的信息。

你可以使用 Refs 来从 DOM 节点中获取表单数据。

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }
  render() {
    return <form onSubmit={this.handleSubmit}>
      <input type="text" ref={this.inputRef} />
    </form>
  }
}
```



### Context

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法，即共享那些对于一个组件树而言是“全局”的数据。

#### 类组件：createContext

```jsx
const ThemeContext = React.createContext({
  color: 'red'
})
class App extends React.Component {
  render() {
    return <ThemeContext.Provider value={{ color: 'red' }}>
      <Toolbar />
    </ThemeContext.Provider>
  }
}
function Toolbar() {
  return <ThemedButton />
}
class ThemedButton extends React.Component {
  static contextType = ThemeContext
  render() {
    return <div style={{color: this.context.color}} >Context</div>
  }
}
```

另外，还有两种方式接收当前的 context 值：

```jsx
export class ThemedButton extends React.Component {
  render() {
    return <ThemeContext.Consumer>
      { value =>  <div style={{color: value.color}} >Context</div> }
    </ThemeContext.Consumer>
  }
}
```

```jsx
export class ThemedButton extends React.Component {
  render() {
    return <div style={{color: this.context.color}} >Context</div>
  }
}
ThemedButton.contextType = ThemeContext
```

Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。

如果你只是想避免层层传递一些属性，可以考虑在 props 中传一个封装好的组件、或者调整组件的层级。

#### 函数组件：useContext

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的` value` prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `<MyContext provider>` 的 `value` 值。

```jsx
function ThemedButton () {
  const theme = useContext(ThemeContext)
  return <div style={{color: theme.color}} >Context</div>
}
```



### Refs

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素。比如：管理焦点、文本选择、媒体播放、触发强制动画、集成第三方 DOM 库、非受控组件取值。

Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

React 支持一个特殊的、可以附加到任何组件上的 ref 属性。此属性可以是一个由 `React.createRef()` 函数创建的对象、或者一个 `useRef()` 勾子返回的对象、或者一个回调函数。

**谨慎使用 ref。** 在使用 ref 前，不妨先考虑下，是否能采用更合理的状态来控制。

#### 类组件：createRef

使用 `React.createRef() ` 创建 ref 对象，并通过 ref 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  render() {
    return <div ref={this.myRef} />
  }
}
```

通过 ref 的 `current` 属性访问该节点：

```jsx
const node = this.myRef.current
```

ref 的值根据节点的类型而有所不同：

* 当 ref 属性用于 HTML 元素时，接收底层 DOM 元素作为其 `current` 属性；
* 当 ref 属性用于自定义 class 组件时，接收组件的挂载实例作为其 `current` 属性。

#### 函数组件：useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内持续存在。

```jsx
function MyComponent() {
  const inputEl = useRef(null)
  const onButtonClick = () => inputEl.current.focus()
  return <>
    <input ref={inputEl} type="text" />
    <button onClick={onButtonClick}>Focus the input</button>
	</>
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

如果不将 `inputEl` 传给节点的 `ref` 属性，则 `inputEl.current` 的值将是我们传入的初始值。

如果将`inputEl` 以`<input ref={inputEl}/>` 形式传入节点，则无论该节点如何改变，React 都会将 `inputEl.current` 设置为相应的 DOM 节点。

`useRef()` 的返回对象是一个普通 Javascript 对象。它和自建一个 `{current: ...}` 对象的唯一区别是，它会在每次渲染时返回同一个 ref 对象。

请记住，ref 对象的 `.current` 属性变更不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。

#### 回调refs

React 也支持另一种设置 refs 的方式，称为“回调 refs”。它能助你更精细地控制何时 refs 被设置和解除。

给 ref 属性传递一个函数，该函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问。这也是官方强烈推荐的用法。

这个函数执行的时机为：

* 组件被挂载后，回调函数被立即执行，回调函数的参数为该组件的具体实例。
* 组件被卸载或者原有的ref属性本身发生变化时，回调也会被立即执行，此时回调函数参数为null，以确保内存泄露。

```jsx
class MyComponent extends React.Component {
  constructor () {
    buttonEl = null
  }
  getButtonRef (inst) {
    this.buttonEl = inst
  }
  render() {
    return <div>
      <button ref={this.getButtonRef.bind(this)}>点击</button>
    </div>
  }
}
```

React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null，而更新时它被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。

回调函数在 `componentDidMount` 或 `componentDidUpdate` 前触发，React 会保证 refs 一定是最新的。

#### 转发 refs 到 DOM 组件

组件中，props 的 `ref` 属性是不会透传下去。这是因为 `ref` 不是 prop 属性。就像 `key` 一样，其被 React 进行了特殊处理。也就是说，你在子组件中，是无法通过 `props.ref` 获取父组件传递的 `ref` 值。

我们可以通过以下两个方法，将组件的 ref 传递（即，转发）给子组件：

**方法一：** 使用 `React.forwardRef `。

```jsx
const MyRefComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    转发 refs 到 DOM 组件
  </div>
))
class MyApp extends React.Component {
  ref = React.createRef()
  render() {
    return <>
      <MyRefComponent ref={this.ref} />
      <button onClick={() => console.log(this.ref.current)}>点击</button>
    </>
  }
}
```

第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 class 组件不接收 `ref` 参数，且 props 中也不存在 `ref`。

也就是说，如果没有 `React.forwardRef`，  `MyRefComponent` 无法接收 ref，也就无法绑定到其内的节点中。

**方法二：** 传 `ref、key` 除外的 props 属性。

上面我们说过，`ref、key` 被 React 进行了特殊处理，无法透传到子组件，而 props 又是可以传任何值的。那么，我们可以通过定义一个普通的 props 属性来传递 ref 对象。

```jsx
const MyRefComponent = props => (
  <div ref={props.myRef}>
    转发 refs 到 DOM 组件
  </div>
)
class MyApp extends React.Component {
  ref = React.createRef()
  render() {
    return <>
      <MyRefComponent myRef={this.ref} />
      <button onClick={() => console.log(this.ref.current)}>点击</button>
    </>
  }
}
```



### 高阶组件

高阶组件（HOC）是 React 中用于复用组件状态和逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

具体而言，**高阶组件是参数为组件，返回值为新组件（可追加一些 props）的函数。**

**区别：** 组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

请注意，HOC 不应该修改传入的组件，也不应该使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。**HOC 是纯函数，没有副作用。**

```jsx
// 封装一个自动获取被包裹的组件中某个DOM可以父节点中使用的区域大小
function calcDomSize = dom => {}
const AutoCalcSize = WrappedComponent => props => {
  const innerRef = useRef()
  const [state, setState] = useState({
    width: 0,
    height: 0
  })
  useEffect(() => {
    setState({
      width: calcDomSize(innerRef.current).width,
      height: calcDomSize(innerRef.current).height
    })
  }, [])
  return <WrappedComponent {...props} innerRef={innerRef} calcWidth={state.width} calcHeight={state.height} />
}
```

**使用 HOC 的一些约定：**

* 约定：透传被包裹的组件的原有的所有 props；

* 约定：最大化可组合性。HOC 一般仅接受一个参数，也就是被包裹的组件。而 HOC 通常可以接收多个参数，用来区分不同场景的一些逻辑；

* 约定：包装显示名称以便轻松调试。

**使用 HOC 的一些注意事项：**

* 不要在 render 方法中使用 HOC；
* 务必复制静态方法；
* Refs 不会被传递；

### 相关问题

#### 为什么 Virtual DOM 比原生 DOM 快？

Virtual DOM 对于需要有大量的 DOM 操作时，能够很好的提高效率，通过在操作前确定需要做的最小修改，尽可能的减少 DOM 操作带来的重流和重绘的影响。其实 **Virtual DOM 并不一定比我们真实的操作 DOM 要快**，这种方法的目的是为了提高我们开发时的可维护性，在任意的情况下，都能保证一个尽量小的性能消耗去进行操作。



### 参数资料

[React中文文档](https://zh-hans.reactjs.org/)

[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

[【译】React函数组件和类组件的区别](https://zhuanlan.zhihu.com/p/104126843)