## 重读Vue教程

### Vue.js 是什么?

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。

Vue 只关注视图层， 采用自底向上增量开发的设计。

Vue 是一个提供了 MVVM 模式的双向数据绑定的 Javascript 库，专注于 View 层。它的核心是 MVVM 中的 VM，也就是 ViewModel。 ViewModel 负责连接  View 和 Model，保证视图和数据的一致性。

#### MVVM是什么？

MVVM 是 **Model-View-ViewModel** 的缩写，它是一种基于前端开发的架构模式，其核心是提供对 View 和 ViewModel 的双向数据绑定，这使得 View 的变化会自动更新到 ViewModel，ViewModel 的变化也会自动同步到View 上显示，即所谓的**数据双向绑定**。

* **View：** 视图，即 DOM；对应 HTML 部分（代表 UI 组件），它负责将数据模型转化成 UI 展现出来。 
* **Model：** 模型，即数据模型；对应 Vue 组件里的 `data`，或者说是 vuex 里的数据；也可以在 Model 中定义数据修改和操作的业务逻辑。
* **ViewModel：** 监听模型数据，也就是 `data` 的的改变和控制视图行为、处理用户交互，简单理解就是一个同步 View 和 Model 的对象，连接 Model 和 View。

MVVM 是基于 MVC 的设计，开发人员在 HTML 标签上写一些指定，利用一些指令绑定，就能在 Model 和ViewModel 保持不变的情况下，很方便的将 UI 设计与业务逻辑分离，从而大大的减少繁琐的 DOM 操作。

MVVM 框架与 MVC 框架的主要区别有两点：

* 实现数据与视图的分离
* 通过数据来驱动视图，开发者只需要关心数据变化，DOM操作被封装了。

#### Vue响应式原理

一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 `Object.defineProperty` 把这些 property 全部转为 `getter/setter`。`Object.defineProperty` 是 ES5 中一个无法 shim 的特性，这也就是 **Vue 不支持 IE8 以及更低版本浏览器**的原因。

这些 `getter/setter` 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。

每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。



### Class 与 Style 绑定

用  `v-bind` 绑定 `class` 和 `style` 时，Vue.js 做了专门的增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

```html
<div v-bind:class="(isActive ? 'active' : '') + ' error'"></div>
<div v-bind:class="[isActive ? 'active' : '', 'error']"></div>
<div v-bind:class="{active: isActive, error: true }"></div>
<div v-bind:class="[{ active: isActive }, 'error']"></div>
```

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<!--数组语法可以将多个样式对象应用到同一个元素上-->
<div v-bind:style="[
	{ color: activeColor, fontSize: fontSize + 'px' },
  { border: '1px solid red'}
]"></div>

<!--2.3.0起，可以传一个包含多个值的数组，常用于提供多个带前缀的值-->
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```



### 事件处理

#### 事件的绑定

*  **v-on 指令：** 指令可以直接运行一些 JavaScript 代码，也可以绑定事件处理方法，还可以在内联 JavaScript 语句中调用方法。

  ```html
  <button v-on:click="window.alert('hello')">hello</button>
  <button v-on:click="hello">hello</button>
  <button v-on:click="hello()">hello</button>
  ```

  需要注意：绑定事件处理方法，不能传参，但会将 event 做为方法的第一个参数；而直接调用方法 `hello()`，是可以指定传参的。同时，如果需要用到 event 时，可以传入特殊变量 `$event` 。

  ```html
  <button v-on:click="hello('lizh', $event)">hello</button>
  ```

* **vm.$on( event, callback )：** 监听当前实例上的自定义事件。事件可以由 `vm.$emit` 触发。回调函数会接收所有传入事件触发函数的额外参数。

  ```js
  vm.$on('test', msg => {
  	console.log(msg)
  })
  vm.$emit('test', 'hello')
  // hello
  ```

#### 将原生事件绑定到组件

使用 `v-on` 的 `.native` 修饰符，可以在一个组件的根元素上直接监听一个原生事件。

```js
<my-component v-on:focus.native="onFocus"></my-component>
```

不过，有时候你可能并不是想将事件传递给组件的根元素，而是组件中的某个特定元素。

Vue 提供了一个 `$listeners` property，它是一个对象，里面包含了作用在这个组件上的所有监听器。再配合 `v-on="$listeners"` 将所有的事件监听器指向组件中的某个特定的子元素。

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

> 从 `2.4.0` 开始，`v-on` 同样支持不带参数绑定一个事件/监听器键值对的对象。注意当使用对象语法时，是不支持任何修饰器的。

```js
<input v-on="$listeners"></input>
```

#### 事件修饰符

- `.stop`： 阻止事件冒泡；
- `.prevent`： 阻止事件默认行为；
- `.capture`： 添加事件监听器时使用事件捕获模式；
- `.self `： 只当在 `event.target` 是当前元素自身时触发处理函数；
- `.once`： 事件将只会触发一次；
- `.passive`： 事件的默认行为会立即触发，优先级高于 `prevent`；

* `:keyup.enter`： 监听键盘 `enter` 按键；
* `:keyup.page-down`： 监听键盘 `pageDon` 按键；

使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止**所有的点击**，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。

需要注意：键盘按键的键值，在不同浏览器可以不一样。Vue 内置了以下别名，支持旧浏览器：`.enter, .tab, .delete, .esc, .space, .up, .down, .left, .righ`。



### 组件注册

全局注册：

```js
Vue.component('my-component-name', {
  // ... 选项 ...
})
```

局部注册：

```js
const ComponentA = { /* ... */ }
const ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

自动化全局注册：

Webpack 有一个 API `require.context()`，用来获取指定的文件夹内的特定文件。`require.context` 返回的结果是一个函数，该函数的传参是匹配的文件名的相对路径，返回的是一个模块。

```js
require.context(directory，useSubdirectories，regExp)
```

`require.context` 返回的函数，还有以下三个属性：

* resolve：函数，接文件夹下面匹配文件的相对路径，返回该文件相对于整个工程的相对路径；

* keys：函数，返回匹配成功文件的名字组成的数组；

* id：执行环境的id，返回的是一个字符串，主要用在 `module.hot.accept` ，应该是热加载？

我们可以使用 `require.context` 全局注册一些非常通用的基础组件。

```js
// 入口文件，如：src/main.js

import Vue from 'vue'
const requireComponent = require.context(
  '../../../components/form_items', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /\.(vue|js)$/ // 匹配基础组件文件名的正则表达式
)
requireComponent.keys().forEach(fileName => {
  const componentName = fileName.split('/')[1].split('.')[0]
  const componentConfig = requireComponent(fileName)

  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`；
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```



### Prop和 Attribute

props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义验证和设置默认值。

```js
props: {
  propB: {
		type: [String, Array], // 原生构造函数，或原生构造函数组成的数组。包括：String、Number、Boolean、Array、Object、Date、Function、Symbol、任何自定义构造函数。
    default: any || () => ({}), // 默认值。对象或数组的默认值必须从一个工厂函数返回。
		required：Boolean, // 是否是必传项
    validator: value => { // 自定义验证函数，将该 prop 的值作为唯一的参数代入。
      return boolean
    }
  }
}
```

#### prop传值

传入一个对象的所有 property：

如果你想要将一个对象的所有 property 都作为 prop 传入，你可以使用不带参数的 `v-bind` (取代 `v-bind:prop-name`)。例如，对于一个给定的对象 `post`：

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

```html
<blog-post v-bind="post"></blog-post>

<!--等价于-->
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

自定义类型：

```js
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```

```js
props: {
  author: Person
}
```

```html
<my-component :author="new Person('firstName', 'lastName')"></my-component>
```

通过 `instanceof` 来来验证 prop 的值是否是通过 `new Person` 创建的。

#### 非 Prop 的 Attribute

一个非 prop 的 attribute 是指传向一个组件，但是该组件 prop 没有定义对应的 property。

对于绝大多数 attribute 来说，从**外部提供给组件的值会替换掉组件根元素设置好的值**。庆幸的是，`class` 和 `style` attribute 会稍微智能一些，两边的值会被合并起来。

非 Prop 的 Attribute 通过 `$attrs` 来访问。 如果你**不**希望组件的根元素继承 attribute，你可以在组件的选项中设置 `inheritAttrs: false`。

#### prop的“伪"双向绑定

所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。也就是说，每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值，但是，你**不**应该在一个子组件内部改变父组件传递的 prop。

子组件修改父组件的 prop，需要在父组件中监听一个事件，并根据需要更新一个本地的数据：

```js
// 父组件：监听一个事件，用于更新本地的数据
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

```js
// 子组件：触发父组件的监听事件，传递更新的值
this.$emit('update:title', newTitle)
```

为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符：

```js
// 父组件：.sync修饰符，相当于添加了一个 update:title 监听事件
<text-document v-bind:title.sync="doc.title"></text-document>
```



### 自定义指令

除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，Vue 也允许注册自定义指令。因为，有的情况下，你仍然需要对普通 **DOM 元素进行底层操作**。如：当页面加载时，该元素将获得焦点。

注册全局指令：

```js
Vue.directive('focus', {
  bind: function (el, binding, vnode) {},
  inserted: function (el, binding, vnode) {
    el.focus()
  },
  update: function (el, binding, vnode, oldVnode) {},
  componentUpdated: function (el, binding, vnode, oldVnode) {},
  unbind: function (el, binding, vnode) {}
})
```

注册局部指令，在组件中定义  `directives` 选项：

```js
directives: {
  focus: {
    inserted: function (el, binding, vnode) {
      el.focus()
    }
  }
}
```

然后你可以在模板中任何元素上使用新的 `v-focus` property：

```html
<input v-focus placeholder="自动聚集此元素">
```

#### 钩子函数

一个指令定义对象可以提供如下几个钩子函数（均为可选）：

- `bind`： 只调用一次，指令第一次绑定到元素时调用；
- `inserted`： 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)；
- `update`： 所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。

- `componentUpdated`： 指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
- `unbind`： 只调用一次，指令与元素解绑时调用。

#### 钩子函数的参数

指令钩子函数会被传入以下参数：

- `el`： 指令所绑定的元素，可以用来直接操作 DOM。**除了 `el` 之外，其它参数都应该是只读的**；
- `binding`： 一个对象，包含以下 property：
  - `name`：指令名，不包括 `v-` 前缀；
  - `value`：指令绑定的值；
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用；
  - `expression`：指令绑定的字符串形式的指令表达式；
  - `arg`：传给指令的参数。如 `v-my-directive:foo` 中，参数为 `"foo"`；
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`：当前虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

#### 函数简写

如果只想在 `bind` 和 `update` 时触发相同行为，而不关心其它的钩子，可以这样写：

```js
Vue.directive('my-directive', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```



### 过滤器

自定义过滤器可被用于一些常见的文本格式化。比如：**双花括号插值和 `v-bind` 表达式**。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号指示：

```html
{{ message | capitalize }}
<div v-bind:id="rawId | formatId"></div>
```

全局定义过滤器：

```js
Vue.filter('capitalize', function (value) {
  return value ? value.replace(/^\w/, a => a.toUpperCase()) : ''
})
```

局部定义过滤器，在组件的选项中定义 filters 选项：

```js
filters: {
  capitalize: function (value) {
    return value ? value.replace(/^\w/, a => a.toUpperCase()) : ''
  }
}
```

过滤器函数总接收表达式的值 (之前的操作链的结果) 作为第一个参数。同时，它可以接收参数：

```js
{{ message | filterA('arg1', arg2) }}
```

这里，`filterA` 被定义为接收三个参数的过滤器函数。其中 `message` 的值作为第一个参数，普通字符串 `'arg1'` 作为第二个参数，表达式 `arg2` 的值作为第三个参数。



### Vue API

#### Vue.use( plugin )

安装 Vue.js 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 `install` 方法。`install` 方法调用时，会将 Vue 作为参数传入。

该方法需要在调用 `new Vue()` 之前被调用。

当 `install` 方法被同一个插件多次调用，插件将只会被安装一次。

#### provide / inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。

`provide` 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的 property。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作。

`inject` 选项应该是：一个字符串数组，或一个对象。对象的 key 是本地的绑定名，value 可以是父组件中定义的 provide 中的 key，也可以是一个对象，包含 `from、default` 两个 `property`。

```js
// 父组件
export default {
  provide () {
    return {
      provideInst: this
    }
  },
}

// 子组件
export default {
  inject: {
    aliasInst: {
      from: 'provideInst',
      default: () => ({})
    }
  },
}
```

#### model

允许一个自定义组件在使用 `v-model` 时定制 prop 和 event。默认情况下，一个组件上的 `v-model` 会把 `value` 用作 prop 且把 `input` 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 `value` prop 来达到不同的目的。使用 `model` 选项可以回避这些情况产生的冲突。

默认情况下：

```html
<my-component v-model="name"></my-component>
```

相当于：

```html
<my-component
	:value="name"
	@input="val => { name = val }"
></my-component>
```

如果我们在子组件 `my-component` 加入：

```js
export default {
  model: {
    prop: 'testValue',
    event: 'change'
  },
}
```

那么：

```html
<my-component v-model="name"></my-component>
<!--相当于-->
<my-component
	:testValue="name"
	@change="val => { name = val }"
></my-component>
```

#### v-on

绑定事件监听器。事件类型由参数指定，表达式可以是一个方法的名字或一个 Javascript 内联语句，还可以加对应修饰符（也可以省略）。

用在普通元素上时，只能监听原生 DOM 事件。用在自定义元素组件上时，也可以监听子组件触发的自定义事件。

在监听原生 DOM 事件时，方法以事件为唯一的参数。如果使用内联语句，语句可以访问一个 `$event` property ： `v-on:click="handle('ok', $event)"`。

从 2.4.0 开始，v-on 同样支持不带参数绑定一个事件/监听器键值对的对象。注意当使用对象语法时，是不支持任何修饰符的。

```html
<my-component v-on:click="ckEvent"></my-component>
<my-component v-on:click="ckEvent('a', $event)"></my-component>
<my-component v-on:click.native="ckEvent"></my-component>
<my-component v-on:myEvent="doSomething"></my-component>
<my-component v-on="myEventObject"></my-component>
```

```js
myEventObject: {
  click () => {},
	change () => {},
	myEvent () => {}
}
```

#### v-bind

动态地绑定一个或多个 attribute，或一个组件 prop 到表达式。在绑定 prop 时，prop 必须在子组件中声明。

可以用修饰符指定不同的绑定类型。

- `.prop` ： 作为一个 DOM property 绑定而不是作为 attribute 绑定，即不会传递到子组件的 $attrs；

- `.camel`： (2.1.0+) 将 kebab-case attribute 名转换为 camelCase；

- `.sync`： (2.3.0+) 语法糖，会扩展成一个更新父组件绑定值的 `v-on` 侦听器；

  ```html
  <text-document v-bind:title.sync="doc.title"></text-document>
  <!--相当于-->
  <text-document
    v-bind:title="doc.title"
    v-on:update:title="doc.title = $event"
  ></text-document>
  ```

没有参数时，可以绑定到一个包含键值对的对象。注意此时 `class` 和 `style` 绑定不支持数组和对象。

```html
<my-component v-bind="$props"></my-component>
```

#### key

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。

key 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

有相同父元素的子元素必须有**独特的 key**。重复的 key 会造成渲染错误。

#### ref

`ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。

当 `v-for` 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的**数组**。



### 常见问题

##### 数据响应问题

* 必须在初始化实例前声明所有根级响应式 property，哪怕只是一个空值；

* **Vue 不能检测对象的 property 的添加或移除：** 由于 Vue 会在初始化实例时对 property 执行 `getter/setter` 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。

  对于已经创建的实例，可以使用 `Vue.set(object, propertyName, value)`  或 `vm.$set` 实例方法将 property 转换为响应式 。

* **Vue 不能检测数组的某些变化**： 利用索引直接设置一个数组项时、修改数组的长度。

  同样，可以使用 `Vue.set` 或 `vm.$set` 来转换。

  另外，以下数组的变更方法会触发视图更新：`push()、 pop()、 shift()、 unshift()、 splice()、 sort()、 reverse()`。

##### 异步更新问题

Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

多数情况我们不需要关心这个过程，但是如果你想基于更新后的 DOM 状态来做点什么。比如：

```html
<my-component id="MyComponent" v-if="visible"></my-component>
```

```js
this.visible = true
const height = document.querySelector('#MyComponent').clientHeight
```

这种情况下，`document.querySelector('#MyComponent')` 很可能会报错，因为 `this.visible = true` 修改后，DOM 的更新是一个异步操作，也就是这个时候，DOM 是还不存在的。

为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。这样回调函数将在 DOM 更新完成后被调用。

```js
this.visible = true
let height = null
this.$nextTick(() => {
	height = document.querySelector('#MyComponent').clientHeight  
})
```

##### 为什么 data 必须是一个函数？

因为组件可能被用来创建多个实例。如果 `data` 仍然是一个纯粹的对象，则所有的实例将**共享引用**同一个数据对象！通过提供 `data` 函数，每次创建一个新实例后，我们能够调用 `data` 函数，从而返回初始数据的一个全新副本数据对象。

##### 为什么不推荐 v-for 与 v-if 一同使用？

当它们处于同一节点，`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。

```html
<ul>
  <li v-for="user in users" :key="user.id" v-if="user.isActive">
    {{ user.name }}
  </li>
</ul>
```

假设 `users` 有100个子项，而`user.isActive` 的子项只有一个。实际执行中，  `li` 将被循环100次，再通过 `v-if` 判断，过滤不符合条件的99个。从性能角度来看，这不太友好。

推荐做法，将 `users` 替换为一个计算属性，让其返回过滤后的列表：

```js
computed: {
  activeUsers () => this.users.filter(u => u.isActive)
}
```

```html
<ul>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

##### this作用域问题

* 避免在 `setTimeout、setInterval` 内使用 this。因为，内部的 this 指向的不是 Vue 实例。

* 不要在选项 property 或回调上使用箭头函数。

  ```js
  created: () => console.log(this.a)
  vm.$watch('a', newValue => this.myMethod())
  ```

  因为箭头函数并没有 `this`，`this` 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致 `Uncaught TypeError: Cannot read property of undefined` 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。

##### computed、watch、methods的区别

**计算属性**基于 data 中声明过或者父组件传递的 props 中的数据通过计算得到的一个**新值**，这个新值只会根据所依赖的值的变化而变化，简言之：这个属性依赖其他属性，由**其他属性计算而来**的。

同样，我们可以将一个计算属性定义为一个方法，在需要引用计算属性的地方直接调用该方法。两种方式的最终结果确实是完全相同的。不同的是**计算属性是基于它们的响应式依赖进行缓存的**。也就是说，多次访问计算属性会立即返回之前的计算结果，而不必再次执行函数。相比之下，多处引用方法，每次都会再执行函数。

**侦听属性**监听 Vue 实例上的属性变化，或某些特定数据的变化，然后执行某些具体的业务逻辑操作。当属性变化时，回调函数自动调用，在函数内部进行计算。其可以监听的数据来源：data，props，computed 内的数据。

虽然计算属性在大多数情况下更合适，但有时也需要自定义的**侦听属性**。比如：当需要在数据变化时执行异步或开销较大的操作时、一个数据改变影响多个数据。

**注意：** 组件初始化时，如果 watch 对象的选项 immediate 值为 true，则该 watch 计算会先于 computed 计算，其执行顺序：beforeCreate -> watch -> created -> beforeMount -> computed（如果计算的属性未使用，则不会触发） -> mounted。

##### Vue 组件有哪些通信方式？

8 种常规的 Vue 组件通信方案：

* 通过 props 传递。

* 通过 $emit 触发自定义事件。

* 使用 ref。

* $parent 或$root。

* $attrs 与 $listeners：逐级向下传属性 $attrs 和 $listeners。

* Provide 与 Inject：在祖先组件定义 provide 属性，返回传递的值；在后代组件通过inject接收组件传递过来的值。

* Vuex：共享数据中心。

* EventBus（适用兄弟组件传值）：创建一个中央事件总线 EventBus，兄弟组件通过 $emit 触发自定义事件，另一个兄弟组件通过 $on 监听自定义事件。

  ```javascript
  // Bus.js
  class Bus {  
    constructor() {
      this.callbacks = {};
    }
    $on(name, fn) {
      this.callbacks[name] = this.callbacks[name] || [];  
      this.callbacks[name].push(fn);
    }
    $emit(name, args) {
      if (this.callbacks[name]) {
        this.callbacks[name].forEach((cb) => cb(args));  
      }
    }
  }
  
  // main.js  
  Vue.prototype.$bus = new Bus() // 将$bus挂载到vue实例的原型上  
  // 另一种方式  
  Vue.prototype.$bus = new Vue() // Vue已经实现了Bus的功能 
  ```

  ```html
  <!-- Children1.vue -->
  this.$bus.$emit('foo')
  ```

  ```html
  <!-- Children2.vue -->
  this.$bus.$on('foo', this.handle)
  ```

### 参考资料

[Vue.js教程](https://cn.vuejs.org/v2/guide/)