TypeScript使用指南

>#### TypeScript is JavaScript with syntax for types.
>
>TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
>
>——[TypeScript 官网](https://www.typescriptlang.org/zh/)

TypeScript 是由微软开发的一种开源的编程语言，是 JavaScript 的一个超集，扩展了 JavaScript 的语法。

从本质上说，**TypeScript 是 JavaScript 的一个强类型（静态类型）的版本**， 它可以编译成普通的 JavaScript 代码。 TypeScript 支持任意浏览器、任意环境、任意系统。

### TypeScript特性

#### 类型系统

从 TypeScript 的名字就可以看出来，**「类型」**是其最核心的特性。

我们知道，JavaScript 是一门非常灵活的编程语言：

- 它没有类型约束，一个变量可能初始化时是字符串，过一会儿又被赋值为数字。
- 由于隐式类型转换的存在，有的变量的类型很难在运行前就确定。
- **基于原型的面向对象编程**，使得原型上的属性或方法可以在运行时被修改。
- 函数是 JavaScript 中的一等公民，可以赋值给变量，也可以当作参数或返回值。

这种灵活性就像一把双刃剑，一方面使得 JavaScript 蓬勃发展，无所不能，从 2013 年开始就一直蝉联最普遍使用的编程语言排行榜冠军；另一方面也使得它的代码质量参差不齐，维护成本高，运行时错误多。

而 TypeScript 的类型系统，为 JavaScript 提供了静态类型检查以及使用看起来像基于类的面向对象编程语法操作 Prototype，并且与编辑器紧密集成，在编辑器中尽早捕获错误，在很大程度上弥补了 JavaScript 的缺点。

#### 静态类型

类型系统按照**「类型检查的时机」**来分类，可以分为动态类型和静态类型。

**动态类型**是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误。JavaScript 是一门解释型语言，没有编译阶段，所以它是动态类型，以下这段代码在运行时才会报错：

```javascript
let foo = 1;
foo.split(' ');
// Uncaught TypeError: foo.split is not a function
// 运行时会报错（foo.split 不是一个函数），造成线上 bug
```

**静态类型**是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查，所以 TypeScript 是静态类型，这段 TypeScript 代码在编译阶段就会报错了：

```javascript
let foo = 1;
foo.split(' ');
// Property 'split' does not exist on type 'number'.
// 编译时会报错（数字没有 split 方法），无法通过编译
```

#### 弱类型

类型系统按照**「是否允许隐式类型转换」**来分类，可以分为强类型和弱类型。

JavaScript 和 TypeScript 都是弱类型语言，所以以下代码都能正常运行：

> TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性，所以它也是弱类型。

```javascript
let a = 1 + '1'
typeof a // string
```

运行时数字 1 会被隐式类型转换为字符串 '1'，加号（+）被识别为字符串拼接，所以打印出结果是字符串 '11'。

作为对比，Python 是强类型，以下代码会在运行时报错：

```python
print(1 + '1')
# TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

若要修复该错误，需要进行强制类型转换：

```python
print(str(1) + '1')
```

强弱是相对的，Python 在处理整型和浮点型相加时，会将整型隐式转换为浮点型，但是这并不影响 Python 是强类型的结论，因为大部分情况下 Python 并不会进行隐式类型转换。

相比而言，JavaScript 和 TypeScript 中不管加号两侧是什么类型，都可以通过隐式类型转换计算出一个结果——而不是报错——所以 JavaScript 和 TypeScript 都是弱类型。

虽然 TypeScript 不限制加号两侧的类型，但是我们可以借助 TypeScript 提供的类型系统，以及 ESLint 提供的代码检查功能，来限制加号两侧必须同为数字或同为字符串。这在一定程度上使得 TypeScript 向「强类型」更近一步了——当然，这种限制是可选的。

这样的类型系统体现了 TypeScript 的核心设计理念：**在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型系统来提高代码的可维护性，减少可能出现的 bug。**

#### 适用于任何规模

TypeScript 非常适用于大型项目——这是显而易见的，类型系统可以为大型项目带来更高的可维护性，以及更少的 bug。

在中小型项目中推行 TypeScript 的最大障碍就是认为使用 TypeScript 需要写额外的代码，降低开发效率。但事实上，由于有 **类型推论**，大部分类型都不需要手动声明了。相反，TypeScript 增强了编辑器（IDE）的功能，包括代码补全、接口提示、跳转到定义、代码重构等，这在很大程度上提高了开发效率。而且 TypeScript 有近百个编译选项，如果你认为类型检查过于严格，那么可以通过修改编译选项来降低类型检查的标准。

TypeScript 还可以和 JavaScript 共存。这意味着如果你有一个使用 JavaScript 开发的旧项目，又想使用 TypeScript 的特性，那么你不需要急着把整个项目都迁移到 TypeScript，你可以使用 TypeScript 编写新文件，然后在后续更迭中逐步迁移旧文件。如果一些 JavaScript 文件的迁移成本太高，TypeScript 也提供了一个方案，可以让你在不修改 JavaScript 文件的前提下，编写一个类型声明文件，实现旧项目的渐进式迁移。

事实上，就算你从来没学习过 TypeScript，你也可能已经在不知不觉中使用到了 TypeScript——在 VSCode 编辑器中编写 JavaScript 时，代码补全和接口提示等功能就是通过 TypeScript Language Service 实现的。

#### 与标准同步发展

TypeScript 的另一个重要的特性就是坚持与 ECMAScript 标准同步发展。

ECMAScript 是 JavaScript 核心语法的标准，自 2015 年起，每年都会发布一个新版本，包含一些新的语法。

一个新的语法从提案到变成正式标准，需要经历以下几个阶段：

* Stage 0：展示阶段，仅仅是提出了讨论、想法，尚未正式提案。
* Stage 1：征求意见阶段，提供抽象的 API 描述，讨论可行性，关键算法等。
* Stage 2：草案阶段，使用正式的规范语言精确描述其语法和语义。
* Stage 3：候选人阶段，语法的设计工作已完成，需要浏览器、Node.js 等环境支持，搜集用户的反馈。
* Stage 4：定案阶段，已准备好将其添加到正式的 ECMAScript 标准中。

一个语法进入到 Stage 3 阶段后，TypeScript 就会实现它。一方面，让我们可以尽早的使用到最新的语法，帮助它进入到下一个阶段；另一方面，处于 Stage 3 阶段的语法已经比较稳定了，基本不会有语法的变更，这使得我们能够放心的使用它。

除了实现 ECMAScript 标准之外，TypeScript 团队也推进了诸多语法提案，比如可选链操作符（?.）、空值合并操作符（??）、Throw 表达式、正则匹配索引等。

### 为什么要使用TypeScript？

TypeScript 解决了 JavaScript 的 **痛点**：

* 弱类型和没有命名空间，很难模块化，难以运用到大型项目开发。TypeScript 在编译的时候提供了一套机制保证强类型判断，利用关键字 moudle 实现了类似命名空间的效果，适合进行大型项目的开发。
* JavaScript 不是面向对象语言。TypeScript 提供了一些语法糖帮助大家实现面向对象的编程。

TypeScript 是为开发大型应用而设计的，编译它产生  JavaScript 以确保兼容性。由于 TypeScript 是 JavaScript 的严格超集，任何现有的 JavaScript 程序都是合法的 TypeScript 程序。

TypeScript 编译器本身也是用 TypeScript 编写，并被转译为 JavaScript。

#### TypeScript更可靠

类型的定义和编译器的引入，可使你避免掉代码中的大多数愚蠢错误。

* 静态类型化，通过类型注解提供编译时的静态类型检查；
* 类型安全，在编码期间检测错误的功能，而不是在编译项目时检测错误。

Rollbar 于 2018 年统计了[前端项目中 Top10 的错误类型](https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/)：

```shell
Uncaught TypeError: Cannot read property
TypeError: ‘undefined’ is not an object (evaluating
TypeError: null is not an object
(unknown): Script error
TypeError: Object doesn’t support property
TypeError: ‘undefined’ is not a function
Uncaught RangeError
TypeError: Cannot read property ‘length’
Uncaught TypeError: Cannot set property
ReferenceError: event is not defined
```

事实证明，其中很多是 null 或未定义的错误。一个好的静态类型检查系统（如：Typescript）可以帮助避免它们。如果需要类型但尚未定义，它可以警告您。

#### TypeScript更清晰

显式类型使代码可读性更高，所以我们的注意力将会更集中在系统究竟是如何构建的，以及系统的不同部分如何相互作用。在大型系统中，能够在记住上下文的同时抽象出系统的其余部分是很重要的。类型的定义使我们能够做到这一点。

TypeScript 包含一组非常好的面向对象编程（OOP）特性，这些特性有助于维护健壮和干净的代码；这提高了代码质量和可维护性。这些 OOP 特性使 TypeScript 代码非常整洁和有组织性。

- 大型的开发项目，使用 TypeScript 工具来进行重构更容易、便捷；
- 引入了JavaScript中没有的“类”概念；
- 引入模块的概念，可以把声明、数据、函数和类封装在模块中。

#### TypeScript更灵活

与 Java、C++ 不同，Typescript 没有严格要求 100% 的静态类型覆盖。Javascript 代码可以用 Typescript 直接编译通过。所以 Javascript 项目想迁移 Typescript ，只需要批量把后缀改成 .ts，当你在一些地方希望享受静态类型的好处时，再逐渐补充类型定义。而碰到静态类型没有带来实质利益的 Case，也大可不必定义类型或者用 any 来定义。

TypeScript 支持为现存 JavaScript 库添加类型信息的定义文件，方便其他程序像使用静态类型的值一样使用现有库中的值。

#### IDE/编辑器智能提示

TypeScript 通过类型定义文件，解决了 IDE/编辑器无法智能提示的痛点。

### 发展历史

TypeScript 开发者寻求一种不破坏现有标准兼容性和跨平台支持的解决方案。知道 ECMAScript 标准为未来基于类编程提供支持后，Typescript 开发便基于此方案。这形成了包含一组新的语法扩展的一个 JavaScript 编译器，一个基于此提案的超集，可将 TypeScript 语法编译为常规的 JavaScript。从这个意义上来讲，TypeScript 是ECMAScript 2015 预期内容的预览版本。提案中未包括的可选静态类型被添加到了 TypeScript 中，有助于促进工具和 IDE 支持。

* 经过两年的内部开发，微软在 2012 年 10 月发布了 TypeScript 第一个版本（0.8）。最初，只有 Microsoft Visual Studio IDE 支持，随后，逐渐在其他 IDE 中以插件形式支持，目前大部分主流的文本编辑器，例如Emacs、Vim、Webstorm、Atom 和微软发布的 Visual Studio Code 都能支持 TypeScript 语法。
* 2013 年，发布了 TypeScript 0.9 版本，增加了对泛型的支持。
* 2014 年 4 月，发布了 TypeScript 1.0 版本。
* 2014 年 7 月，发布了新的 TypeScript 编辑器，声称其性能提高了5倍。同时，代码托管由 CodePlex 迁移至GitHub。
* 2014 年 10 月，Angular 发布了 2.0 版本，它是一个基于 TypeScript 开发的前端框架。
* 2015 年 1 月，ts-loader 发布，webpack 可以编译 TypeScript 文件了。
* 2015 年 4 月，微软发布了 Visual Studio Code，它内置了对 TypeScript 语言的支持，它自身也是用 TypeScript 开发的。
* 2016 年 5 月，@types/react、@types/node 发布，TypeScript 可以开发 React、Node.js 应用了。
- 2016 年 9 月 22 日，TypeScript 2.0 发布，其中引入了几个功能，例如开发者可以选择不为变量分配空值等。

* 2018 年 7 月 30 日，TypeScript 3.0 发布，其中包含许多新功能，例如剩余参数（页面存档备份，存于互联网档案馆）、展开语法（页面存档备份，存于互联网档案馆）、带有元组的剩余参数、带有通用类型的剩余参数等。
* 2019 年 2 月，TypeScript 宣布由官方团队来维护 typescript-eslint，以支持在 TypeScript 文件中运行 ESLint 检查。

- 2020 年 5 月，Deno 发布了 1.0 版本，它是一个 JavaScript 和 TypeScript 运行时。
- 2020 年 8 月，TypeScript 发布了 4.0 版本。
- 2020 年 9 月，Vue 发布了 3.0 版本，官方支持 TypeScript。

### 一个简单示例

**安装：** `npm install -g typescript`。

**运行**： `tsc hello.ts`、`tsc -w hello.ts`（启动监听模式）。

约定使用 TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 .jsx 时，以 .tsx 为后缀。

```typescript
// hello.ts
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

这时候会生成一个编译好的文件 `hello.js`：

```javascript
function sayHello(person) {
  return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

TypeScript 最大的优势之一便是增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等。主流的编辑器都支持 TypeScript，推荐使用 Visual Studio Code。

### 类型定义

#### 基础类型

JavaScript 中基础类型有：布尔值、数字、字符串、null、undefined、Symbol、BigInt。

布尔值类型定义：

```typescript
const isDone: boolean = false;
```

注意：boolean 表示是布尔值基础类型，使用构造函数 `Boolean` 创造的对象不是布尔值：

```typescript
const isDone: boolean = new Boolean(true);
// 'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.
```

事实上 `new Boolean()` 返回的是一个 Boolean 对象：

```typescript
const isDone: Boolean = new Boolean(true);
```

直接调用 Boolean 也可以返回一个 boolean 类型：

```typescript
const isDone: boolean = Boolean(true);
```

在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。其他基础类型（除了 null 和 undefined）一样。

数字类型定义：

```typescript
let decimalismNum: number = 6;   // 十进制数字
let hexNum: number = 0xf00d;     // 十六进制数字
let binaryNum: number = 0b1010;  // 二进制数字
let octonaryNum: number = 0o744; // 八进制数字
let notANum: number = NaN;
let infinityNum: number = Infinity;
```

字符串类型定义：

```typescript
let name: string = 'Tom';
let title: string = `This is ${name} sawyer`;
```

Null和Undefined类型定义：

```typescript
let undef: undefined = undefined;
let nul: null = null;
```

undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给数字、字符串等类型。

然而，当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。 

#### Any

任意值（Any）用来表示允许赋值为任意类型。

```typescript
let num: any = 'seven';
num = 7;
```

 any 类型访问任何属性都是允许的：

```typescript
const anyThing: any = 'hello';
anyThing.myName
anyThing.myName.firstName
```

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：

```typescript
let something; // 相当于 let something: any;
something = 'seven';
something = 7;
```

#### Void

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数：

```typescript
function alertName(): void {
  alert('My name is Tom');
}
```

声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null（只在 --strictNullChecks 未指定时）：

```typescript
let unusable: void = undefined;
```

#### Never

never 类型表示的是那些永不存在的值的类型：

- 一个从来不会有返回值的函数；
- 一个总是会抛出错误的函数。

```typescript
function error(message: string): never {
  throw new Error(message);
}

function fail() {
  return error("Something failed");
}

function infiniteLoop(): never {
  while (true) {
  }
}
```

变量也可能是 never类型，当它们被**永不为真的类型保护所约束时**。？？

```typescript
const nvr: never = (() => {
  throw new Error('Error');
})();
```

```typescript
interface IObject {
  a: string,
  b: number
}
const obj : IObject = {
  a: '',
  b: 0
}
type TKey = keyof IObject

function setValue (option : any) {
  const key : TKey = option.key;
  obj[key] = '' // 报错：Type 'string' is not assignable to type 'never'.(2322)
  // (obj[key] as IObject[keyof IObject]) = '' // 正确
}
```

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了never 本身之外），即使 any 也不可以赋值给 never。

#### 数组

 有多种方式可以定义数组：一是在元素类型后面接上 []，表示由此类型元素组成的一个数组：

```typescript
const list: number[] = [1, 2, 3];
```

二是使用数组泛型，Array <元素类型>：

```typescript
const list: Array<number> = [1, 2, 3];
```

三是用接口表示数组，一般不会用这种方式，这种方式适用于类数组，如 IArguments、NodeList、HTMLCollection ：

```typescript
interface List {
  [index: number]: number;
}
const list: List = [1, 2, 3];
```

```typescript
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
```

#### 元组

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为  string 和 number 类型的元组。

```typescript
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error
```

当访问一个越界的元素，会使用联合类型替代，即，可以是 string，也可以是 number，但不能是其他类型：

```javascript
x[3] = 'world' // OK
x[5] = 'Tom'   // OK
x[6] = true    // Error
```

#### Object

object 表示非基础类型，也就是上述基础类型之外的类型。

使用 object 类型，就可以更好的表示像 Object.create 这样的API。

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

#### 枚举

enum 类型是对 JavaScript 标准数据类型的一个补充。

**数字类型枚举：**

使用枚举我们可以定义一些有名字的数字常量。

```typescript
enum Color { Red, Green, Blue }
let c: Color = Color.Green;
```

```javascript
var Color;
(function (Color) {
  Color[Color["Red"] = 0] = "Red";
  Color[Color["Green"] = 1] = "Green";
  Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;

// console.log(Color)
// 0: "Red"
// 1: "Green"
// 2: "Blue"
// Blue: 2
// Green: 1
// Red: 0
```

默认情况下，从 0 开始为元素编号，也可以手动的指定成员的数值：

```typescript
enum Color { Red = 1, Green, Blue }
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```typescript
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是可以由枚举的值得到它的名字。 例如，知道数值为 2，但是不确定它映射到 Color 里的哪个名字：

```typescript
enum Color {Red = 1, Green, Blue}
const colorName: string = Color[2]; // Green
```

**字符串类型枚举：**

```typescript
enum Status {
  UNKNOWN = 'UNKNOWN',
  SUCCESS = 'success',
  ERROR = 'error',
}
```

```javascript
var Status;
(function (Status) {
    Status["UNKNOWN"] = "UNKNOWN";
    Status["SUCCESS"] = "success";
    Status["ERROR"] = "error";
})(Status || (Status = {}));

// console.log(Status)
// ERROR: "error"
// SUCCESS: "success"
// UNKNOWN: "UNKNOWN"
```

#### 接口

在 TypeScript 中，我们使用接口来定义对象的类型。

在面向对象语言中，接口是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类去实现。

```typescript
// 接口一般首字母大写。
interface Person {
  name: string;
  age: number;
}

// 赋值的时候，变量的形状必须和接口的形状保持一致。
const tom: Person = {
  name: 'Tom',
  age: 25
};
```

使用接口需要注意以下问题：

* 变量的属性不能比接口少；
* 变量的属性不能比接口多；
* 接口可以定义可选属性；
* 接口可以定义只读属性，只读属性应该在声明变量时赋值，而不是声明后再赋值；
* 接口可以定义任意的属性，需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。

```typescript
interface Person {
  readonly id: number, // 只读属性
  name: string;
  age?: number; // 可选属性
  [propName: string]: string | number; // 任意属性，其属性类型必须包含 name、age 类型。
}

const tom: Person = {
  id: 1,
  name: 'Tom',
  age: 25,
  gender: 'male', // 任意属性
  birthday: 1651056792048 // 可加多个任意属性
};
// tom.id = 2
// 'Person' only refers to a type, but is being used as a value here.ts
```

#### 函数

为函数定义类型，需要给每个参数添加类型之后再为函数本身添加返回值类型。

**注意：** TypeScript 能够根据返回语句自动推断出返回值类型，因此通常省略它。

**用类型定义函数：**

```javascript
function sum(x: number, y?: number): number { // ? 表示可选参数
  if (y !== undefined) {
    return x + y
  }
  return x
}

const sum = function (x: number, y: number): number =>
  return x + y
}
// 其中，变量 sum 的类型相当于
const sum : (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y
}
```

**用接口定义函数：**

```typescript
interface SumFunc {
  (x: number, y?: number): number;
}
// 或者
// type SumFunc = (x: number, y?: number) => number;

const sum: SumFunc = function(x, y) {
  if (y !== undefined) {
    return x + y
  }
  return x
}
```

#### 类

传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链实现继承。而在 ES6 引入新特性—— Class。

TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

##### 访问修饰符

* **public：** 修饰公有的属性或方法，可以在任何地方被访问到。默认所有的属性和方法都是公有的。
* **private：** 修饰私有的属性或方法，不能在声明它的类的外部访问。
* **protected：** 修饰受保护的属性或方法，它和 private 类似，区别是它在子类中也是允许被访问的。

需要注意的是，修饰符仅用于 TypeScript 编译时代码的检查，并不影响运行时的可访问性。

##### readonly修饰符

readonly 将属性设置为只读的，只读属性必须在声明时或构造函数里被初始化。

注意，readonly 必须写在上述三个修饰符后面。

```typescript
class Person {
  static hello = "word"
  private readonly type: number = 1
  public name: string;
	constructor (name: string) {
    this.name = name
  }
	protected getName () : string {
    return this.name
  }
}
```

##### 抽象类

abstract 用于定义抽象类和抽象类内定义抽象方法。抽象类与接口的区别是，抽象类可以包含成员的实现细节。 

* 抽象类做为其它派生类的基类使用，一般不会直接被实例化；
* 抽象类中的抽象方法必须被子类实现。

```typescript
abstract class Person {
  ...
}

new Person()
// Cannot create an instance of an abstract class.ts(2511)
```

##### 类与接口

接口是对类的一部分行为进行抽象，类可以实现接口。

```typescript
interface Person {
  name: string
}

class Student implements Person {
  name = ''
}
```

类可以当做接口使用。类定义会创建类的实例的类型和一个构造函数，类能创建出类型，所以能够在允许使用接口的地方使用类。

```typescript
class Point {
  x: number;
  y: number;
}
interface Point3d extends Point {
  z: number;
}
const point3d: Point3d = {x: 1, y: 2, z: 3};
```

#### 泛型

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。使用泛型来创建可重用的函数，一个函数可以支持多种类型的数据。 

##### 简单的使用

```typescript
function getLen (arg: number []): number [] {
  return arg
}
```

```typescript
getLen([1, 2, 3]) // OK
getLen('123') // Error. Argument of type 'string' is not assignable to parameter of type 'number[]'.
```

为使该函数可以重用，一种方法是使用 any 类型来定义函数：

```typescript
function getLen (arg: any): any {
  return arg
}
```

但是， 使用 any 类型会导致这个函数可以接收和返回任何类型的参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。

因此，需要一种方法能**约束返回值的类型与传参的类型必须相同**。 这里，我们使用了类型变量，它是一种特殊的变量，只用于表示类型而不是值。

```typescript
function getLen<T> (arg: T): T {
  return arg
}
```

类型变量 T 捕获传参的类型，之后就可以在函数中使用这个类型做返回值类型，这样就约束了参数类型与返回值类型必须相同。 这个使用类型变量的 getLen 函数就叫做**泛型函数**，它可以适用于多个类型。 

**注意：** T 是泛型参数名，也可以使用其他的泛型参数名（如，A、U、G），只要在数量和使用方式能对应即可。

```typescript
function getLen<U> (arg: U): U {
  return arg
}
```

**泛型函数有两种使用方法：** 一是显示传入参数类型；二是利用类型推论 – 即编译器会根据传入的参数自动确定 T 的类型。。

```typescript
getLen<string>('123')
```

##### 泛型约束

使用泛型需要注意，创建泛型函数时，函数体必须正确的使用这个通用的类型。

```typescript
function getLen<T> (arg: T): T {
  console.log(arg.length)
  return arg
}
// Property 'length' does not exist on type 'T'.
```

因为，类型变量代表的是任意类型，也就是说，函数的传参可能是数字，而数字是没有 length 属性的。

一种解决方法，明确指定变量类型是数组：

```typescript
function getLen<T> (arg: T[]): T[] {
  console.log(arg.length)
  return arg
}
```

另一种解决方法是使用**泛型约束**，即，创建一个包含 length 属性的接口，使用 extends 来约束函数的传参必须有一个 length 属性：

```typescript
interface ILength {
  length: number;
}
function getLen<T extends ILength> (arg: T): T {
  console.log(arg.length)
  return arg
}
```

##### 泛型接口、泛型类

除了泛型函数，还可以创建泛型接口、泛型类，但无法创建泛型枚举和泛型命名空间。

```typescript
interface IFnGetLen<T> {
  <T>(arg: T): T;
}
class Point<T> {
  z: T;
  get: (x: T, y: T) => T;
}
```

##### 在泛型约束中使用类型参数

可以声明一个类型参数，且它被另一个类型参数所约束。比如，想用属性名从对象里获取这个属性，并且想确保这个属性存在于对象上的：

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const params = { a: 1, b: 2, c: 3, d: 4 };
getProp(params, "a"); // OK
getProp(params, "m"); // Error. Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### 进阶内容

#### 类型推论

类型推论即类型是在哪里如何被推断的。

TypeScript 里，在有些没有明确指出类型的地方，TypeScript 会依照类型推论的规则推断出一个类型。

```typescript
const num = 'seven';
// 相当于
const num: string = 'seven';
```

```typescript
const foo = {
  a: 123,
  b: 456
};
// 相当于
const foo : {
  a: number,
  b: number
} = {
  a: 123,
  b: 456
};
foo.a = 'hello'; // Error
```

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查。

#### 类型断言

类型断言相当于可以告诉编译器，“这个值，你当成 XXX 类型来检查”，有点像类型转换。与类型转换的区别是，类型断言只会影响 TypeScript 编译时的类型，不会真的影响到变量的类型。

类型断言有两种形式：其一是 **尖括号** 语法：

```typescript
const value: any = "this is a string";
const len: number = (<string>value).length;
```

另一个为 **as** 语法：

```javascript
const value: any = "this is a string";
const len: number = (value as string).length;
```

两种形式是等价的。但，当在 TypeScript 里使用 JSX 时，只有 as 语法断言是被允许的。

#### 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```typescript
type Status = 'SUCCESS' | 'ERROR' | 'PENDING';
let sts : Status =  "SUCCESS" // OK
sts = "OK" // Error. Type '"OK"' is not assignable to type 'Status'.
```

#### 联合类型

联合类型表示取值可以为多种类型中的一种。

```typescript
let num: string | number;
num = 'seven';
num = 7;
```

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，会访问此联合类型的所有类型里**共有**的属性或方法：

```typescript
function getLen(value: string | number): number {
  return value.length;
}
// Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.ts
```

当变量被赋值时，会根据类型推论的规则推断出一个类型：

```typescript
let num: string | number;
num = 'seven';
num.length; // OK
num = 7;
num.length; // Error
```

#### 交叉类型

交叉类型是将多个类型合并为一个类型，即把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

**注意： 创建对象必须同时拥有了这三种类型的成员。**

```typescript
interface Person {
  a: string
}
interface Person2 {
  log () : void
}
interface Person3 {
  b: number
}
const person : Person & Person2 & Person3 = {
  a: 'a',
  log () {},
  // b: 1
}
// Type '{ a: string; log(): void; }' is not assignable to type 'Person & Person2 & Person3'.
//  Property 'b' is missing in type '{ a: string; log(): void; }' but required in type 'Person3'.
```

#### 命名空间

类型可以存在于命名空间里，命名空间用来表示全局变量是一个对象，包含很多子属性。

 比如，有这样的声明 `let x: A.B.C`， 我们就认为 C 类型来自 A.B 命名空间。

```typescript
declare namespace A {
  declare namespace B {
    interface C {}
  }
}
```

#### 模块

只要在声明文件中，出现了 import 或 export，那么这个声明文件就是模块声明文件，而不再是全局声明文件。

在模块声明文件中，所有声明都属于局部声明，都只能在文件内部使用，或者通过 export 供外部使用。

**注意：** `declare global` 块必须出现在模块声明文件中，才能有效声明全局变量或全局类型。

```typescript
export {} // 必需要有一个export和import语句
declare global {
    // ...
}
```

`declare module` 可以用来为一个没有类型声明的模块声明类型，也可以用来扩展一个模块的类型声明。

```typescript
declare module 'foo' {
    const name: string
    function sayHello (name: string): string
    export default function sayHi(): string
}
```

```typescript
import sayHi, { name, sayHello } from 'foo'
sayHi()
sayHello(name)
```

#### 三斜线指令

三斜线指令是包含单个 XML 标签的单行注释，用来加载声明文件。

三斜线指令仅可放在包含它的文件的最顶端。 一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

```typescript
/// <reference path="..." />
```

默认情况下，TypeScript 编译器会加载命令行指定的或者 tsconfig.json 配置文件的 "files" 字段指定的所有声明文件。如果需要加载不在指定范围的声明文件，就需要用到三斜线指令。

**三斜线指令语法：**

* `/// <reference path="..." />`：  用于声明对**文件**的依赖。
* `/// <reference types="..." />`： 用于声明对**包**的依赖。
* `/// <reference no-default-lib="true"/>`： 告诉编译器在编译过程中不要包含这个默认库。 这与在命令行上使用 --noLib 相似。
* `/// <amd-module />`： 给编译器传入一个可选的模块名。默认情况下生成的 AMD 模块都是匿名的。
* `/// <amd-dependency />`： 告诉编译器有一个非 TypeScript 模块依赖需要被注入。这个指令被废弃了，使用 `import "moduleName";` 代替。

**备注：** path 类型声明的是对文件的依赖，包含路径（相对当前文件或者根目录）信息；types 类型声明的是对 `node_modules/@types ` 文件夹下的类型的依赖，不包含路径信息。

**注意：** 如果指定了 --noResolve 编译选项，三斜线指令会被忽略。

### 关键字

#### keyof操作符

TypeScript 允许遍历某种类型的属性，并通过 keyof 操作符提取其属性的名称。keyof 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键（字符串或数字），其返回类型是联合类型。

```typescript
interface IObject {
    a: string,
    b: number,
    c: boolean
}
type TKey = keyof IObject // 相当于 type TKey = 'a' | 'b' | 'c'
```

通常，在泛型约束中，可以使用 `extends keyof` 从对象里获取某个属性：

```typescript
function getProp<IObject, K extends keyof IObject>(obj: IObject, key: K) {
  return obj[key];
}
```

**注意：** IObject 接口的属性是非基础类型，在未明确指定属性字段时，对象的属性赋值会报异常。

```typescript
interface IObject {
  a: String,
  b: Number,
  c: Boolean
}
type TKey = keyof IObject

const obj : IObject = {
  a: new String(''),
  b: new Number(0),
  c: new Boolean(false)
}
function setValue (option : any) {
  const key : TKey = option.key;
  obj[key] = new String('')
}
// 报错：
// Type 'String' is not assignable to type 'String & Number & Boolean'.
//  Type 'String' is missing the following properties from type 'Number': toFixed, toExponential, toPrecision(2322)
```

#### typeof操作符

typeof 操作符用于获取变量的类型。因此这个操作符的后面接的始终是一个**变量**，且需要运用到类型定义当中。

```javascript
interface IObject {
    a: string,
    b: number,
    c: boolean
}
const obj : IObject = {
  a: '',
  b: 0,
  c: false
}

type TTemp = typeof obj // 即 type TTemp = IObject
```

**注意：** typeof 通常用于具有结构的值，比如对象等。

如果将 typeof 用于原始类型的值，返回的类型将是这个值，通常这样做没有意义：

```typescript
const a = 'hello'
type T1 = typeof a // 相当于 type T1 = 'hello'
```

#### in

遍历一个联合类型。

```typescript
type TKeys = 'a' | 'b' | 'c'
type TObj =  {
  [p in TKeys]: any
}
```

#### extends

在 TS 的类型系统中，`A extends B` 表示类型 A 是否是继承自类型 B，通常用于泛型约束和类型条件表达式。

```typescript
interface IObject {
  a: string,
  b: number
}
interface IObject2 extends IObject {
  c: boolean
}
const obj : IObject2 = {
  a: '1',
  b: 1,
  c: false
}
```

```typescript
function getProp<IObject, K extends keyof IObject>(obj: IObject, key: K) {
  return obj[key];
}
```

```typescript
type T1 = IObject2 extends IObject ? number : string // type T1 = number
type T2 = RegExp extends IObject ? number : string   // type T2 = string
```

当泛型变量传入联合类型时，会有一些地方可能和想象结果不一样：

```typescript
type TArr1<Type> = Type extends any ? Type[] : never
type TArr2<Type> = [Type] extends any ? Type[] : never

type T1 = TArr1<string | number> // 相当于 type T1 = string[] | number[]
type T2 = TArr2<string | number> // 相当于 type T2 = (string | number)[]
```

#### infer

infer 意为推断，但依据它的作用，其实可以将其理解为「捕获」，infer X 语句的意思就相当于：捕获一个类型并将这个类型分配给类型变量 X 保存。

infer X 语句放置在哪里呢，放置在一个想要捕获类型的地方，也就是说将 infer X 语句当作一个占位语句放置在本来应该书写类型的地方，就可以捕获到这个类型。

比如，数组的类型、对象属性类型、函数参数的类型、函数的返回值等。

```typescript
// 用变量 ItemType 捕获数组的类型，也可写为 Array<infer ItemType>
// (infer ItemType)[] 表示任何类型的数组，比如 string[], number[] 等
// infer ItemType 就是将 ItemType 当作一个类型变量，传入的是什么类型的数组，ItemType 就是什么类型。
type T1<T> = T extends (infer ItemType)[] ? ItemType : T
type T11 = T1<string[]>      // type T11 = string
type T12 = T1<Array<number>> // type T12 = number
type T13 = T1<string>        // type T13 = string。非数组类型，条件表达式走了 false 分支，直接返回了泛型变量的类型

// 用变量 MsgType 捕获对象属性的类型
type T2<T> = T extends { message: infer MsgType } ? MsgType : T
type T21 = T2<{ message: string }> // type T21 = string
type T22 = T2<{ message: number }> // type T22 = number
```

### 声明文件

一般来讲，组织声明文件的方式取决于库是如何被使用的。 在 JavaScript 中一个库有很多使用方式，这就需要书写声明文件去匹配它们。

#### 声明语句

声明语句是指在 TypeScript 中用于声明变量类型、函数类型、类类型、接口、命名空间、模块的语句。

* declare var： 声明全局变量
* declare function： 声明全局方法
* declare class： 声明全局类
* declare enum： 声明全局枚举类型
* declare namespace： 声明（含有子属性的）全局对象
* interface： 声明全局类型
* type： 声明全局类型
* declare global： 扩展全局变量
* declare module： 扩展模块

#### 声明文件

声明文件是存放声明语句的文件。

**注意： 声明文件必需以 .d.ts 为后缀。**

一般来说，TypeScript 会解析项目中所有的 *.ts 文件，当然也包含以 `.d.ts` 结尾的文件。如果无法解析，那么可以检查下 `tsconfig.json` 中的 files、include 和 exclude 配置。

#### 声明合并

声明合并指的是，如果声明了两个以上的同名函数、同名接口、同名命名空间或同名 class ，那么它们会合并成一个类型。

```typescript
function reverse(x: number): number;
function reverse(x: string): string;

// 相当于
function reverse(x: number | string): number | string;
```

```typescript
interface Alarm {  price: number; }
interface Alarm { weight: number; }

// 相当于
interface Alarm {
    price: number;
    weight: number;
}
```

#### 第三方声明文件

在 TypeScript 2.0 以上的版本，获取第三方库的类型声明文件只需要使用 npm。

```shell
npm install --save @types/lodash
```

如果一个 lodash 的 npm 包已经包含了它的声明文件，那就不必再去下载相应的 @types 包了。

下载完后，就可以直接在 TypeScript 里使用 lodash 了。 

大多数情况下，类型声明包的名字总是与它们在 npm 上的包的名字相同，但是有 `@types/` 前缀， 但如果你需要的话，你可以在 https://aka.ms/types这里查找你喜欢的库。

### 配置文件

TypeScript 使用 `tsconfig.json` 做为编译时的配置文件，TypeScript 编译器可以根据它的信息来对代码进行编译。

如果一个目录下存在一个 `tsconfig.json`文件，那么它意味着这个目录是 TypeScript 项目的根目录。`tsconfig.json` 文件指定了用来编译这个项目的根文件和编译选项。 

一个项目可以通过以下方式编译：

* 不带任何输入文件的情况下调用 `tsc`，编译器会从当前目录开始去查找 tsconfig.json 文件，逐级向上搜索父目录。
* 不带任何输入文件的情况下调用 `tsc`，且使用命令行参数 --project（或 -p）指定一个包含 tsconfig.json 文件的目录。
* 当命令行上指定了输入文件时，`tsconfig.json` 文件会被忽略。

运行 `tsc --init` 命令，初始化 TypeScript 项目并创建一个 `tsconfig.json` 文件，文件中包含默认配置选项：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "strict": true,
    "skipLibCheck": true
  }
}
```

**注意：** 如果 `tsconfig.json` 文件是个空文件，那么所有默认的文件都会以默认配置选项编译。

**注意：** 在命令行上指定的编译选项会覆盖在 `tsconfig.json` 文件里的相应选项。

TypeScript 配置文件包含六个顶级配置项：compileOnSave、files、include、exclude、extends 和compilerOptions，其中 compilerOptions 用来配置编译选项。

#### compilerOptions

compilerOptions 可以被忽略，这时编译器会使用默认值。在这里查看完整的[编译器选项](https://typescript.bootcss.com/compiler-options.html)列表。

##### target

target 指定编译之后的版本目标，可选值有：ES3（默认值）、ES5、ES2015、ES2016、ES2017、ESNext（最新 ES 规范版本）。

##### module

module 指定生成哪个模块系统码，可选值有：None、CommonJS、AMD、System、UMD、ES6 或 ES2015。

如果不设置 module 选项，则如果 target 设为 ES6，那么 module 默认值为 ES6，否则是 commonjs。

##### lib

lib 指定编译过程中需要引入的库文件的列表。

如果你要使用一些 ES6 的新语法，你需要引入 ES6 这个库，或者也可以写 ES2015。如果没有指定 lib 配置，默认会加载一些库，而加载什么库是受 target 影响的。如果 target 为 ES5，默认包含的库有 DOM、ES5 和 ScriptHost；如果 target 是 ES6，默认引入的库有 DOM、ES6、DOM.Iterable 和ScriptHost。

##### outFile

outFile 指定将输出文件合并为一个文件，它的值为一个文件路径名。但是要注意，只有设置 module 的值为 amd 和 system 模块时才支持这个配置。

文件合并的顺序是根据传入编译器的文件顺序和 `///<reference>` 和 import 的文件顺序决定的。

##### outDir

outDir 指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹。

##### baseUrl

baseUrl 设置解析非相对模块名称的基本目录，相对模块不会受 baseUrl 的影响。

##### paths

paths 设置模块名到基于 baseUrl 的路径映射。如果使用 paths，必须设置 baseUrl。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"], // 此处映射是相对于"baseUrl"
			"*": ["./node_modules/@types/*", "./typings/*"],
    }
  }
}
```

##### @types、typeRoots、types

默认所有可见的 @types 包会在编译过程中被包含进来。`node_modules/@types` 文件夹下以及它们子文件夹下的所有包都是可见的； 也就是说，`./node_modules/@types/`，`../node_modules/@types/`和 `../../node_modules/@types/` 等等。

如果指定了 typeRoots，只有 typeRoots 下面的包才会被包含进来。

```json
{
  "compilerOptions": {
    "typeRoots" : ["./typings"]
  }
}
```

这个配置文件会包含所有 `./typings`下面的包，而不包含 `./node_modules/@types` 里面的包。

如果指定了 types，只有被列出来的包才会被包含进来。

```json
{
  "compilerOptions": {
    "types" : ["node", "lodash", "express"]
  }
}
```

这个配置文件将仅会包含 `./node_modules/@types/node`、`./node_modules/@types/lodash` 和 `./node_modules/@types/express`。`/@types/`， `node_modules/@types/*` 里面的其它包不会被引入进来。

指定 `"types": []` 来禁用自动引入 @types 包。

**注意：** 自动引入只在你使用了全局的声明时是重要的。 如果你使用 `import "foo"` 语句，TypeScript 仍然会查找 `node_modules` 和 `node_modules/@types` 文件夹来获取 foo 包。

#### files、include、exclude

files 指定一个包含相对或绝对文件路径的列表。

include 和 exclude 属性指定一个文件 glob 匹配模式列表。

支持的 glob 通配符有：

- `*` 匹配 0 或多个字符（不包括目录分隔符）；
- `?` 匹配一个任意字符（不包括目录分隔符）
- `**/` 递归匹配任意子目录。

如果一个 glob 模式里的某部分只包含 `*` 或 `.*`，那么仅有支持的文件扩展名类型被包含在内（`.ts`、`.tsx`、和`.d.ts`， 如果 allowJs 选项设置为 true，还包含 `.js` 和 `.jsx`）。

如果 files 和 include 都没有被指定，编译器默认包含当前目录和子目录下所有的 TypeScript 文件（`.ts`、`.d.ts` 和 `.tsx`），排除在 exclude 里指定的文件。如果 allowJs 选项被设置成 true，JS 文件（`.js` 和 `.jsx`）也被包含进来。 

如果指定了 files 或 include，编译器会将它们结合一并包含进来。 使用 outDir 指定的目录下的文件永远会被编译器排除，除非你明确地使用 files 将其包含进来（这时就算用 exclude 指定也没用）。

使用 include 引入的文件可以使用 exclude 属性过滤。 然而，通过 files 属性明确指定的文件却总是会被包含在内，不管 exclude 如何设置。 如果没有特殊指定， exclude 默认情况下会排除 node_modules、bower_components、jspm_packages 和 outDir 指定的输出目录。

任何被 files 或 include 指定的文件所引用的文件也会被包含进来。 如，A.ts 引用了 B.ts，因此 B.ts 不能被排除，除非引用它的 A.ts 在 exclude 列表中。

**注意：** 编译器不会去引入那些可能做为输出的文件；比如，假设包含了 index.ts，那么 index.d.ts 和 index.js 会被排除在外。 通常来讲，不推荐只有扩展名的不同来区分同目录下的文件。

#### extends

tsconfig.json 文件可以利用 extends 属性从另一个配置文件里继承配置。

extends 是 tsconfig.json 文件里的顶级属性（与compilerOptions、files、include、和 exclude 一样）。 extends 的值是一个字符串，包含指向另一个要继承文件的路径。

在原文件里的配置先被加载，然后被所继承文件里的配置重写。 如果发现循环引用，则会报错。所继承配置文件的 files、include、exclude、compilerOptions 等属性覆盖源配置文件的属性。

配置文件里的相对路径在解析时相对于它所在的文件。

#### compileOnSave

在最顶层设置 compileOnSave 标记，可以让 IDE 在保存文件的时候根据 tsconfig.json 重新生成文件。

要想支持这个特性需要 Visual Studio 2015、TypeScript1.8.4 以上并且安装 atom-typescript 插件。

### 常见报错

##### globalProperties 报错（Vue 3）

全局挂载过滤器方法，在模板中使用，TS 报错找不到名称。

```html
<span>
  {{filters.parseTime(createTime)}}
</span>
```

```shell
Cannot find name 'filters'.
```

解决方案：

```typescript
// main.ts
declare module '@vue/runtime-core' {
  // Custom properties added to component instances in any way and can be accessed through `this`
  interface ComponentCustomProperties {
    filters: any
  }
}

app.config.globalProperties.filters = filters
```

##### 错误码：2691

```shell
# 导入路径不能以'.ts'扩展名结束。 考虑导入'./xxx'。 
An import path cannot end with a '.ts' extension. Consider importing './XXX' instead。
```

TypeScript 导入 .ts 文件，不需要加 .ts 后缀。

##### 错误码：2669

```shell
# 全局作用域的扩充只能直接嵌套在外部模块或环境模块声明中。 
Augmentations for the global scope can only be directly nested in external modules or ambient module declarations。
```

```typescript
// 错误
declare global {
    interface Window {
        DEBUG_TEMP_CONSOLE_FLAG: Boolean;
    }
}

// 正确
// 有 import、export 语句的，认为是模板文件
export {}
declare global {
    interface Window {
        DEBUG_FLAG: Boolean;
    }
}
```

##### 错误码：2362

```shell
# 算术运算的左边必须是“any”、“number”或枚举类型。 
The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.
```

```typescript
// 错误
'a2'.replace(/[^0-9]/, '') - 1

// 正确
Number('a2'.replace(/[^0-9]/, '')) - 1
```

##### 错误码：2343

```shell
# 该语法需要一个名为'{1}'的导入助手，但模块'{0}'没有导出成员'{1}'。 
This syntax requires an imported helper named '{1}', but module '{0}' has no exported member '{1}'.
```

```shell
# 此语法需要名为 __spreadArray 的导入帮助器，tslib 中不存在该帮助器。请考虑升级 "tslib" 的版本。
This syntax requires an imported helper named __spreadArray which does not exist in 'tslib'. Consider upgrading your version of 'tslib'。
```

这是 VS Code 的提示。因为 VS Code 是基于 tsLib 导出的。实际上，不做任何事情都不会发生任何不好的事情，只是缺少类型而已。

 解决方法：升级 tslib。

```shell
npm i tslib@latest -D
```

##### 错误码：1109

```shell
# 预期表达式
Expression expected.ts(1109)
```

```typescript
// 错误。此处应该是一个表达式，即不需要换行
refForm?.value?
  .validate()
  .then(() => {})
  .catch((error : any) => {});

// 正确
refForm?.value?.validate()
  .then(() => {})
  .catch((error : any) => {});
```

##### 错误码：1005

```shell
# 预期分号
':' expected.ts(1005)
```

```typescript
// 错误。应该是不支持该语法
const obj = {};
const key = 'a';
const value = obj?[key];

// 正确
const obj : any = {};
const key = 'a';
const value = obj[key];
```

### 相关问题

#### 内置对象

内置对象是指根据标准在全局作用域上存在的对象，这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。内置对象可以直接在 TypeScript 中当做定义好了的类型。

ECMAScript 标准提供的内置对象有：Boolean、Error、Date、RegExp 等。

DOM 和 BOM 提供的内置对象有：Document、HTMLElement、Event、NodeList 等。

根据 TypeScript 内置的 `lib.dom.d.ts` 文件，[HTMLElementTagNameMap](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.htmlelementtagnamemap.html) 接口定义 DOM 类型：

```typescript
interface HTMLElementTagNameMap {
	div: HTMLDivElement,
	p: HTMLParagraphElement,
	span: HTMLSpanElement,
	a: HTMLAnchorElement,
	img: HTMLImageElement,
	video: HTMLVideoElement,
	audio: HTMLAudioElement,
	canvas: HTMLCanvasElement,

	html: HTMLHtmlElement,
	body: HTMLBodyElement,
	button: HTMLButtonElement,
	dl: HTMLDListElement,
	form: HTMLFormElement,
	input: HTMLInputElement,
	textarea: HTMLTextAreaElement,
	label: HTMLLabelElement,
	frame: HTMLFrameElement,
	iframe: HTMLIFrameElement,
	ol: HTMLOListElement,
	ul: HTMLUListElement,
	li: HTMLLIElement,
	picture: HTMLPictureElement,
	pre: HTMLPreElement,
	script: HTMLScriptElement,
	select: HTMLSelectElement,
	...
}
```

TypeScript 核心库（node_modules/typescript/lib/**）文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

**注意：** TypeScript 核心库的定义中不包含 Node.js 部分。

#### void、never 的区别？

void 表示没有任何类型，never 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。void 类型可以被赋值为 undefined|null（在 strictNullChecking 为 false 时），但是除了 never 本身以外，其他任何类型不能赋值给 never。

#### interface 和 type 有什么区别？

可以简单理解为：interface 描述**数据结构**，type 描述**类型关系**。

##### 继承或者说扩展的方式不同

interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以继承 type，type 也可以继承 interface 。 

虽然效果差不多，但是两者语法不同：

```typescript
interface InterfaceName {  name: string;  }
type TypeName = {  name: string;  }

interface User1 extends InterfaceName { 
    age: number; 
}
interface User2 extends TypeName { 
    age: number; 
}

type User3 = InterfaceName & { age: number;  }
type User4 = TypeName & { age: number;  }
```

##### type 可以声明基本类型别名、联合类型、元组等类型

```typescript
// 基本类型别名
type Name = string

// 联合类型
interface Dog { wong(); }
interface Cat { miao(); }
type Pet = Dog | Cat

// 元组：定义数组每个位置的类型
type PetList = [Dog, Pet]
```

##### type 能使用 typeof 获取实例的类型进行赋值

```typescript
const div = document.createElement('div');
type B = typeof div
```

##### interface 能合并声明，type 不行

```typescript
interface User {
    name: string
    age: number
}
interface User {
    sex: string
}

// 最终合并结果
// User {
//     name: string
//     age: number
//     sex: string 
// }
```

一般来说，如果不清楚什么时候用 interface，什么时候用 type，就优先用 interface 实现，如果不能再用 type。 

### 参考资料

[Bootcss：TypeScript 中文手册](https://typescript.bootcss.com/)

[TypeScript中文文档](https://www.tslang.cn/index.html)

[TypeScript代码演练场](https://www.typescriptlang.org/zh/play)

[TypeScript 入门教程](https://ts.xcatliu.com/)

[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

[TS 声明文件 .d.ts](https://drylint.com/TypeScript/TS%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6d.ts.html#%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6%E8%AF%AD%E6%B3%95%E5%88%97%E8%A1%A8)

[Typescript 中的 interface 和 type 到底有什么区别](https://juejin.cn/post/6844903749501059085)

