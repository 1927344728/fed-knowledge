## Vue如何导入TypeScript

### 什么是Typescript？

[TypeScript](https://github.com/Microsoft/TypeScript) 是微软开发一款开源的编程语言，它是 `JavaScript` 的一个超集，本质上是为 `JavaScript` 增加了静态类型声明。任何的 `JavaScript` 代码都可以在其中使用，不会有任何问题。`TypeScript` 最终也会被编译成 `JavaScript`，使其在浏览器、Node 中等环境中使用。由于最终运行的仍然是 `JavaScript`，所以 `TypeScript` 并不依赖于环境的支持，也并**不会带来兼容性问题。**

同时，`TypeScript` 也是 `JavaScript ES6` 的超集。

Vue3.0 将使用 TS 重写，重写后的 Vue3.0 将更好的支持 TS。

`Google` 的 `Angular 2.0` 也宣布采用 `TypeScript` 进行开发。

2019 年 `TypeScript `将会更加普及，能够熟练掌握 TS，并使用 TS 开发过项目，将更加成为前端开发者的优势。



### 为什么要用TypeScript？

`TypeScript `的类型注解是一种轻量级的为函数或变量添加约束的方式，它的优势在于**静态类型检查。**

概括来说主要包括以下几点：

1. 静态类型检查

   即你编写的代码即使没有被执行到，一旦你编写代码时发生类型不匹配，语言在编译阶段即可发现。

2. IDE 智能提示

   在`TypeScript `这一类语言之前，`JavaScript `的智能提示基本完全依赖 IDE 提供的**猜测**，这种猜测可能并不正确，并且也缺乏更多的辅助信息。`TypeScript `不仅自己写的类库有丰富的类型信息，也可以对其他纯 JS 项目进行类型标注 ([DefinitelyTyped](https://link.zhihu.com/?target=https%3A//github.com/borisyankov/DefinitelyTyped))，便于使用者直接在 IDE 中浏览 API，效率大增。

3. 代码重构

   有时候需要修改一些变量/属性/方法名，牵涉到属性和方法的时候，很多改动是跨文件的，不像普通变量可以简单定位 scope，属性方法名的重命名对于 JS 来说异常痛苦，一方面是修改本身就不方便，另一方面是改了还不确定该改的是不是改了，不该改的是不是也改了。 

   而 `TypeScript `的静态类型系统就可以较为完美的解决这个问题。

4. 可读性

   **类型就是最好的注释**。对于阅读代码的人来讲，各种便利的类型一目了然，更容易明白作者的意图。

常见的变量类型定义：

```js
// 布尔值
let isDone: boolean = false; // 相当于 js 的 let isDone = false;
// 变量定义之后不可以随便变更它的类型
isDone = true // 不报错
isDone = "我要变为字符串" // 报错

// 数字
let decLiteral: number = 6; // 相当于 js 的 let decLiteral = 6;

// 字符串
let name: string = "bob";  // 相当于 js 的 let name = "bob";

// 数组
 // 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：
let list: number[] = [1, 2, 3]; // 相当于 js 的let list = [1, 2, 3];
// 第二种方式是使用数组泛型，Array<元素类型>：
let list: Array<number> = [1, 2, 3]; // 相当于 js 的let list = [1, 2, 3];

// 在 TypeScript 中，我们使用接口（Interfaces）来定义 对象 的类型。
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25
};
// 以上 对象 的代码相当于 
let tom = {
    name: 'Tom',
    age: 25
};

// Any 可以随便变更类型 (当这个值可能来自于动态的内容，比如来自用户输入或第三方代码库)
let notSure: any = 4;
notSure = "我可以随便变更类型" // 不报错
notSure = false;  // 不报错

// Void 当一个函数没有返回值时，你通常会见到其返回值类型是 void
function warnUser(): void {
    console.log("This is my warning message");
}

// 方法的参数也要定义类型，不知道就定义为 any
function fetch(url: string, id : number, params: any): void {
    console.log("fetch");
}
```

> 不要使用如下类型`Number`，`String`，`Boolean`或`Object`， 这些类型指的是非原始的装盒对象，它们几乎没在JavaScript代码里正确地使用过。应该使用类型`number`，`string`，and `boolean`。
>
> 使用非原始的`object`类型来代替`Object`
>
> 不确定的类型用Any，它是可以随便变更类型的



### Vue 引入 TypeScript

[Vue CLI](https://cli.vuejs.org/) 提供了内建的 TypeScript 工具支持。如果你是新创建项目，可以查看[TypeScript 支持](https://cn.vuejs.org/v2/guide/typescript.html)

现有的项目，首先需要安装一些必要/以后需要的插件：

```shell
# 安装vue的官方插件
npm i vue-class-component vue-property-decorator -S

#ts-loader typescript 必须安装，其他的相信你以后也会装上的
npm i ts-loader typescript tslint tslint-loader tslint-config-standard -D
```

- [vue-class-component](https://github.com/vuejs/vue-class-component)：强化 Vue 组件，使用 `TypeScript`/装饰器 增强 Vue 组件。
- [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)：在 `vue-class-component` 上增强更多的结合 Vue 特性的装饰器
- [ts-loader](https://github.com/TypeStrong/ts-loader)：`TypeScript `为 `Webpack `提供了 `ts-loader`，其实就是为了让`webpack`识别` .ts、 .tsx`文件
- [tslint-loader](https://github.com/wbuchwalter/tslint-loader)跟[tslint](https://github.com/palantir/tslint)：我想你也会在`.ts` `.tsx`文件 约束代码格式（作用等同于`eslint`）
- [tslint-config-standard](https://github.com/blakeembrey/tslint-config-standard)：`tslint` 配置 `standard`风格的约束



### 配置 webpack

* 首先找到`./build/webpack.base.conf.js`。

* 将`entry`中的入口文件`xx.js`改成`xx.ts`，顺便把项目文件中的`xx.js`也改成`xx.ts`，里面内容保持不变。
* 找到`resolve.extensions` 里面加上`.ts` 后缀 （是为了之后引入.ts的时候不写后缀）

* 找到`module.rules` 添加`webpack`对`.ts`的解析

  ```js
  //webpack.base.conf.js
  module.exports = {
  	entry: {
  		'bxs-docs': './docs/docs.ts',
  		'bxs-demo': './docs/demo.ts'
  	},
  	...
  	resolve: {
  		//默认解析扩展路径，设置完成后再引入文件后可以节约后缀名
  		extensions: ['.js', '.vue', '.css', '.ts', '.md'],
  	},
  	module: {
  		rules: [
  			{
  				test: /\.ts$/,
  				exclude: /node_modules/,
  				enforce: 'pre',
  				loader: 'tslint-loader'
  			},
  			{
  				test: /\.tsx?$/,
  				loader: 'ts-loader',
  				exclude: /node_modules/,
  				options: {
  				appendTsSuffixTo: [/\.vue$/],
  				}
  			},
        		...
  		]
  	},
  	...
  }
  ```

`ts-loader` 会检索当前目录下的 `tsconfig.json` 文件，根据里面定义的规则来解析`.ts`文件（就跟`.babelrc`的作用一样）。`tslint-loader` 作用等同于 `eslint-loader`



### 添加 tsconfig.json

接下来在根路径下创建`tsconfig.json`文件。这里有一份参考配置，完整的配置请点击 [tsconfig.json](http://json.schemastore.org/tsconfig)：

```json
{
  // 编译选项
  "compilerOptions": {
    // 输出目录
    "outDir": "./output",
    // 是否包含可以用于 debug 的 sourceMap
    "sourceMap": true,
    // 以严格模式解析
    "strict": true,
    // 采用的模块系统
    "module": "esnext",
    // 如何处理模块
    "moduleResolution": "node",
    // 编译输出目标 ES 版本
    "target": "es5",
    // 允许从没有设置默认导出的模块中默认导入
    "allowSyntheticDefaultImports": true,
    // 将每个文件作为单独的模块
    "isolatedModules": false,
    // 启用装饰器
    "experimentalDecorators": true,
    // 启用设计类型元数据（用于反射）
    "emitDecoratorMetadata": true,
    // 在表达式和声明上有隐含的any类型时报错
    "noImplicitAny": false,
    // 不是函数的所有返回路径都有返回值时报错。
    "noImplicitReturns": true,
    // 从 tslib 导入外部帮助库: 比如__extends，__rest等
    "importHelpers": true,
    // 编译过程中打印文件名
    "listFiles": true,
    // 移除注释
    "removeComments": true,
    "suppressImplicitAnyIndexErrors": true,
    // 允许编译javascript文件
    "allowJs": true,
    // 解析非相对模块名的基准目录
    "baseUrl": "./",
    // 指定特殊模块的路径
    "paths": {},
    // 编译过程中需要引入的库文件的列表
    "lib": [
      "dom",
      "es2015",
      "es2015.promise"
    ]
  }
}
```

### 添加 tslint.json

在根路径下创建`tslint.json`文件。这里就很简单了，就是 引入 `ts` 的 `standard` 规范

```json
{
  "extends": "tslint-config-standard",
  "globals": {
    "require": true
  }
}
```

### 让 ts 识别 .vue

由于 `TypeScript` 默认并不支持 `*.vue` 后缀的文件，所以在 `vue` 项目中引入的时候需要创建一个 `vue-shim.d.ts` 文件，放在项目对应使用目录下，例如 `src/vue-shim.d.ts`

```js
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

//全局变量/方法声明
declare global {
  interface Window {
    SystemJS: any; // 如果不确定类型, 可定义为any
  }
}
```

意思是告诉 `TypeScript` `*.vue` 后缀的文件可以交给 `vue` 模块来处理。

而在代码中导入 `*.vue` 文件的时候，**需要写上 `.vue` 后缀。**原因还是因为 `TypeScript` 默认只识别 `*.ts` 文件，不识别 `*.vue` 文件：

```js
import abcd from 'components/abcd.vue'
```

### 改造 `.vue` 文件

* import `.vue` 的文件的时候，**要补全 `.vue` 的后缀，**否则会提示语法错误或找不到模块
* 在`script` 标签上加上 `lang="ts"`, 意思是让`webpack`将这段代码识别为`typescript` 而非`javascript`
* **[vue-class-component](https://github.com/vuejs/vue-class-component)**：对 `Vue` 组件进行了一层封装，让 `Vue` 组件语法在结合了 `TypeScript` 语法之后更加扁平化。主要是配置以下属性：
  * components，注册子组件
  * filters，过滤器
  * directives，注册或获取全局指令。
  * ...
* [**vue-property-decorator**](https://github.com/kaorun343/vue-property-decorator) ：在 `vue-class-component` 上增强了更多的结合 `Vue` 特性的装饰器，新增了这 7 个装饰器：
  - `@Emit`
  - `@Inject`
  - `@Model`
  - `@Prop`
  - `@Provide`
  - `@Watch`

### Vue常见选项的转换

`template`、`style`模块不需要改，只需对`script`进行转换。

```js
<template>
    <div></div>
</template>

<script lang="ts">
import Abcd from './Abcd.vue'
import { Vue, Component, Emit, Inject, Model, Prop, Provide, Ref, Watch, PropSync } from 'vue-property-decorator'
//或者
//import Vue from 'vue'
//import Component, { mixins } from 'vue-class-component'
//import { Emit, Inject, Model, Prop, Provide, Watch, PropSync, Ref } from 'vue-property-decorator'

// 一定要用Component修饰。详情查看下一章节
@Component({
    components: {
        Abcd
    }
})

//Demo相当于原来的name: 'Demo'
export default class Demo extends Vue {
    //data,直接写
    count: number = 0
    desc: string = '123'
    private tx: string = ''
	//用 public, private 等修飾詞來決定能不能從外部 (別的 class) 存取

	// @Prop(options: (PropOptions | Constructor[] | Constructor) = {})
    // @Prop装饰器接收一个参数，这个参数可以有三种写法：
    // Constructor，例如String，Number，Boolean等，指定 prop 的类型；
    // Constructor[]，指定 prop 的可选类型；
    // PropOptions，可以使用以下选项：type，default，required，validator。
    @Prop()
    propA: number = 1

	// readonly是typeScriptr的属性，指定为只读
	// 感叹号是非null和非undefined的类型断言。如果不加，TypeScripts可能会报错"从未被初始化过"
    @Prop({
        type: [String, Number], //构造器
        default: 'default value', //默认值
        required: true, //必传
        validator() {} //检验器
    })
	readonly propA!: string | number
    //类型为Object,设置为any
    @Prop({
        default: () => {B
            return {}
        }
    })
    propB: any

	// @PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})
    // @PropSync装饰器与@prop用法类似，二者的区别在于，@PropSync 装饰器接收两个参数：
    // propName: string 表示父组件传递过来的属性名；
    // options: Constructor | Constructor[] | PropOptions 与@Prop的第一个参数一致；
    // @PropSync 会生成一个新的计算属性。
    // @PropSync需要配合父组件的.sync修饰符使用
    @PropSync('name', { type: String })
    syncedName!: string

    // methods 直接在此定义
    private add() {
    	this.number++
    }
    
    // 生命周期直接定义为同名屬性
	created () {}
    mounted () {}

    // 计算属性
    get msg () {
        return 'computed ' + this.demo
    }

    // @Watch(path: string, options: WatchOptions = {})
    @Watch('child', {
        immediate: true,
        deep: true
    })
    onChildChanged (val: string, oldVal: string) {
        if (val !== oldVal) {
            console.log(val)
        }
    }
}
</script>
```

以上代码等价与：

```js
<template>
    <div></div>
</template>
<script>
    
export default {
	name: "Demo",
    components: {
        Abcd
    },
	data () {
		return {
        	count: 0,
            desc: '123',
            private tx: ''
		}
	},
	props: {
		number: {
			type: Number,
            default: 1
		},
        propA: {
            type: [String, Number], //构造器
            default: 'default value', //默认值
            required: true, //必传
            validator() {} //检验器
        },
        propB: {
			type: Object,
            default: () => {B
            	return {}
            }
        },
		// @PropSync中定义的
        props: {
            name: {
                type: String
            }
        }
    },
	created () {},
    mounted () {},
	computed: {
        // @PropSync生成的计算属性
		syncedName: {
			get() {
                return this.name
            },
			set(value) {
				this.$emit('update:name', value)
			}
        },
		msg: {
			return 'computed ' + this.demo
		}
    },
	watch: {
        child: {
            immediate: true,
			deep: true,
			handler: 'onChildChanged'
        }
    },
	methods: {
		onChildChanged (val: string, oldVal: string) {
            if (val !== oldVal) {
                console.log(val)
            }
        }
    }
}
</script>
```

### @Component

**.vue文件中一定要用Component修饰**，参数可不传。

`@Component`配置 `vue-property-decorator`不支持的属性，如: components，filters，directives等

```js
<template>
  <span v-demo:foo.a="1+1">test</span>
</template>

<script lang="ts">
    import Abcd from './Abcd.vue'
    import Component from 'vue-class-component'
    @Component({
        components: {
            Abcd
        }, 
        filters: {},
        directives: {
            demo: {
				bind(el:any, binding:any, vnode:any, oldVnode: any) {
				}
            }
		}
    })
    export default class App extends Vue {}
</script>
```

### Mixins

在`TypeScript`中, 我们可以这么写：

```js
// 定义要混合的类 mixins/index.ts
import {Vue, Component} from 'vue-property-decorator'

// 一定要用Component修饰
@Component
export default class myMixins extends Vue {
    mixinVal: string = 'Hello Mixin'
}
```

然后, 在其他组件中使用它：

```js
<template>
	<div></div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component, { mixins } from 'vue-class-component'
    import mixinDemo from './mixin'

    @Component()
    export default class App extends mixins(mixinDemo) {
        mounted () {
            window.console.log('mixinVal => ', this.mixinVal)
        }
    }
</script>
```

### model

model是vue中的一个选项（用得比较少），它允许一个自定义组件在使用 `v-model` 时定制 prop 和 event。默认情况下，一个组件上的 `v-model` 会把 `value` 用作 prop 且把 `input` 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 `value` prop 来达到不同的目的。使用 `model` 选项可以回避这些情况产生的冲突。

```js
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', {
      type: Boolean
  }) readonly checked!: boolean
}
```

等价于：

```js
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    }
  }
}
```

### $emit

由@Emit修饰的函数，会在它们的原始参数之后，返回一个值。如果返回值是Promise，则在Promise执行后，再执行`$emit`。

如果事件的名称没有通过事件参数提供，则使用函数名。在这种情况下，`camelCase`名称将转换为`kebabo -case`。

如果`@emit` 对应的方法，还有别的参数，比如点击事件的 event，会在返回值之后。 也就是第三个参数。

```js
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  count = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }

  @Emit()
  returnValue() {
    return 10
  }

  @Emit()
  onInputChange(e) {
    return e.target.value
  }

  @Emit()
  promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}
```

等价于：

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })
      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}
```



### ref

`ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。

`@Ref(refKey?: string)`。`refKey`值可以为String，如果省略传输参数，那么会自动将属性名作为参数。

**@Ref与@Emit的区别：**@Emit在不传参数的情况下会转为 dash-case，而 @Ref不会转，为原属性名。

```js
import { Vue, Component, Ref } from 'vue-property-decorator'

import AnotherComponent from '@/path/to/another-component.vue'

@Component
export default class YourComponent extends Vue {
  @Ref() readonly anotherComponent!: AnotherComponent
  @Ref('aButton') readonly button!: HTMLButtonElement
}
```

等价于

```js
export default {
  computed() {
    anotherComponent: {
      cache: false,
      get() {
        return this.$refs.anotherComponent as AnotherComponent
      }
    },
    button: {
      cache: false,
      get() {
        return this.$refs.aButton as HTMLButtonElement
      }
    }
  }
}
```

另外还有些：`@Inject`、`@Provide`，不常见，这里不例举了。。。



### 总结

`vue`+`webpack`导入`typeScript`，实践过程其实并不复杂：

* 首先要对`typescript`有个初步了解，这个其实很简单，无非是对变量、函数、对象属性加了类型控制，可以查看前文中【常见的变量类型定义】，更详情的查看[TypeScript 中文手册](https://typescript.bootcss.com/basic-types.html)；
* 然后是将`typescript`安装到项目，新增一些配置文件，在webpack中将其引入；
* 最后是`vue`中的一些选项：`data、prop、created、methods、watch、computed`等的写法转换。



### 参考链接

[Vue 如何導入 TypeScript](https://medium.com/@paulyang1234/vue-如何導入-typescript-677589f4bbb3)

[Vue & TypeScript 初体验](https://juejin.im/post/5dd297405188252abd6acad0)

[vue + typescript 项目起手式](https://segmentfault.com/a/1190000011744210)

[TypeScript 中文手册](https://typescript.bootcss.com/basic-types.html)

