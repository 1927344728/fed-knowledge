## 谈谈JavaScript的作用域和上下文

作用域（scope），是一个程序设计概念，在许多程序设计语言中是非常重要的。

通常来说，一段程序代码中所用到的变量并不总是有效/可用的，而限定这个变量的可用性的代码范围就是这个变量的作用域。

作用域的使用提高了程序逻辑的局部性，增强程序的可靠性，减少名字冲突。

作用域相关的概念很多：词法作用域、动态作用域、全局作用域、局部作用域、上下文、闭包、还有最令人疑惑的 this 等等。。。

### 什么是作用域呢？

**一句话：作用域就是变量或者函数的可访问性。**

作用域是指当前的执行上下文中，变量或者函数在其中可见或可被访问到。

**作用域是一个抽象概念，在 JavaScript 中, 作用域可以理解为可访问变量、对象、函数的集合。**通常我们说某个变量不在作用域内，指的就是变量在当前执行上下文不可访问。

作用域分为词法作用域（静态作用域）和动态作用域。

### 词法作用域（静态作用域）

**词法作用域，也称静态作用域，是指作用域在变量或函数声明时就已经确定了**。

**JavaScript 采用的就是词法作用域，** 也就是说，无论 Javascript 函数在何处调用，它能访问哪些变量，不能访问哪些变量是早已确定的（由定义时的位置决定）。

大多数现在程序设计语言都是采用静态作用域规则，如 C/C++、C#、Python、Java...

一个简的示例：

```js
const name = '风'
function funcA (){
    console.log(fengyun)
}
function funcB () {
    const name = '云'
    funcA()
}
funcB() // 风
```

如上代码，在 funcB 函数内调用 funcA 函数。funcA 访问变量 name，是在定义函数时的作用域中查找，而不是在执行函数的作用域（funcB 的函数作用域）查找。funcA 是在全局作用域下定义的，因此，它会在全局作用域中查找变量 name。

**JavaScript 关心的是函数声明时的作用域，而不是函数执行时的作用域。**

JavaScript 的词法作用域双分为**全局作用域**、**函数作用域**，以及 ES6 新增的**块级作用域**。

#### 全局作用域

也称为全局变量，是指能被程序中任何函数或者方法访问的变量或函数。全局变量的生命周期是存在于整个程序之内，只有在页面关闭后才会销毁。

一般来说，以下三种情形的变量拥有全局作用域：

##### 程序最外层 var 声明的变量或程序最外层声明的函数

```javascript
// 全局变量会挂载到平台的全局对象上，如浏览器中的 window 对象
var varA = 123
var funcA = function () {
    console.log('funcA')
}
console.log(varA)  // 123
console.log(funcA) // ƒ () {console.log('funcA')}
```

**注意：** Javascript 存在**变量**以及**函数**提升现象。

```js
console.log(varB) //undefined
var varB = 123
// 相当于
var varB
console.log(varB) //undefined
varB = 123
```

```js
var funcA = function () { 
    console.log('1')
}
function funcA() { 
    console.log('2')
}
funcA() // 1
// 以上代码相当于
// 声明变量 funcA -> 声明函数 funcA，变量 funcA 指向该函数 -> 对变量 funcA 赋值一个新函数
// funcA 最终指向的是该新函数
var funcA
function funcA() { 
    console.log('2')
}
funcA = function () { 
    console.log('1')
}
```

##### 未声明直接赋值的变量

不带声明命令的变量会自动升级为全局作用域，不管是在程序的最外层还是函数内部。

```js
<script>
    var funcA = function () {
        a = 123
        return a
    }
    funcA() //123
    console.log(a) //123
</script>
```

程序最外层定义的变量会挂载到全局对象属性，它有一个特性是不能用 delete 运算符删除，而未声明直接赋值的变量，虽然也是挂载到全局对象，但它是可以被 delete 运算符删除的 。

```javascript
var a = '123'
b = '456'

delete a // false
delete b // true

console.log(a) // 123
console.log(b) // Uncaught ReferenceError: b is not defined
```

##### 全局对象的属性和方法

一个全局对象是一个永远存在于全局作用域内的对象。

在 JavaScript 中，全局对象取决于运行时的宿主环境：

* **浏览器：** window 对象，任何全局变量或者全局函数都可以通过 window  的属性来访问。
* **Worker：**  WorkerGlobalScope 对象。
* **Node.js：** global 对象。

**全局作用域弊端：** 过多的定义全局变量会污染全局命名空间， 容易引起命名冲突。

#### 函数作用域

也称为局部变量，是指函数内声明的变量，只能在函数内部访问，外层的作用域（全局作用域或者其他函数作用域）无法直接访问。局部变量的生命周期是存在于函数执行期间，函数执行完毕后销毁。

```js
var funcA = function () {
    var a = 123
    return a
}
var funcB = function () {
    console.log(a)
}
console.log(a) // Uncaught ReferenceError: a is not defined
funcB()        // Uncaught ReferenceError: a is not defined
```

#### 块级作用域

是指通过 ES6 新增命令 let、const 在块级语句（大括号 `{}` ））内声明变量时，所创建的新的作用域。该作用域内的变量只能在该块级语句内使用，外部语句无法被访问。

ES6 以前，**块级语句，如 if、switch 条件语句、for 和 while 循环语句，不像会函数一样创建新的作用域**。在块语句内声明的变量，其作用域就是声明块级语句时所在的作用域。

```js
for(var k = 0; k < 5; k++) {}
console.log(k) // 5

// 相当于
var k;
for(k = 0; k < 5; k++) {}
console.log(k) // 5
```

ES6 之后，块级语句内通过 let、const 声明的变量，无法在块级语句外访问。

```js
for(let k = 0; k < 5; k++) {}
console.log(k) // Uncaught ReferenceError: k is not defined

// 相当于，形成一个匿名函数的闭包
(function () {
    for(var k = 0; k < 5; k++) {}
})()
console.log(k) // Uncaught ReferenceError: k is not defined
```

### 动态作用域

**注意：JavaScript 没有用动态作用域概念，但 this 机制却和动态作用域类似！**

**动态作用域是指在函数运行时，才能确定的作用域。**动态作用域不关心函数是如何声明以及在何处声明的，只关心它们在**何处调用**。

采用动态作用域的语言有 Pascal、Emacs Lisp、Common Lisp（兼有静态作用域）、Perl（兼有静态作用域）。C/C++是静态作用域语言，但在宏中用到的名字，也是动态作用域。

在 JavaScript 语言中，动态作用域的概念和 this 类似，this 也关心函数在哪里调用的。**JavaScript 除了 this 之外，其他，都是根据词法作用域查找！！！**

### 作用域链

**一句话：作用域链是在查找变量或函数时，按先后顺序访问作用域的有序集合。**

作用域链的创建过程跟执行上下文的建立有关：当查找一个变量时，如果当前执行上下文中没有找到，则会去父级执行上下文查询，如果父级执行上下文还是没有，则继续向上查找...，一直到全局执行上下文为止；如果在全局执行上下文仍没有，则返回 undefined。

这个查找的过程便形成了作用域链，每一个执行上下文都有自己的作用域链。

作用域链的作用是保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，可以访问到外层环境的变量和函数。

作用域链的本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前端始终都是当前执行上下文的变量对象，全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

### 执行上下文

也称为执行环境，即 Javascript 脚本执行时的环境。

ECMASscript 有三种类型代码：global、function、eval。执行不同类型代码会产生对应的执行上下文。一个执行上下文可以抽象理解为一个上下文对象，该对象有一系列的属性（称为上下文状态），用来追踪关联代码的执行进度。

执行上下文主要有三个属性：

* 变量对象（Variable Object）
* this 指针（This Value）
* 作用域链 （Scope Chain）

#### 变量对象（Variable Object）

变量对象是与执行上下文相关的数据作用域 。 它是与上下文关联的特殊对象，用于存储在上下文中声明的变量和 函数。 它是一个抽象的概念，在不同的执行上下文中，它的表示使用不同的对象。

例如：在浏览器中，变量对象是全局对象（window）；在 Node.js 中，变量对象是全局对象（global）。

进入执行上下文时，变量对象的初始化过程具体如下：

- 函数的形参：当进入函数执行上下文时，形参是变量对象的一个属性，其属性名就是形参的名字，其值就是实参的值（未传参数，默认值为 undefined）。
- 函数声明：函数也是变量对象的一个属性，其属性名和值都是函数对象创建出来的。如果变量对象已经包含了相同名字的属性，则覆盖它的值。
- 变量声明：函数内声明的变量也是变量对象的一个属性，其属性名即为变量名，未赋值则默认为 undefined。函数内变量名不会影响已经声明的相同的函数名或者函数的参数名。

#### 活动对象（Activation Object）

当函数调用时，会创建一个活动对象。该对象包括含变量对象与 arguments 对象。arguments 对象是传入函数的实参，是一个类数组对象。

在进入函数，上下文对象创建一个变量对象，同时初始化一个表示 Arguments 对象的 arguments 属性。

### 执行上下文栈

每一种代码的执行都需要依赖自身的上下文。Javascript 脚本开始执行时，引擎会创建一个全局上下文；函数的每一次调用，都会创建函数执行上下；eval 函数的每一次执行，会创建 eval 执行上下文。

**注意：每一次函数的调用（包括递归），都产生了一个新的函数上下文。**

一系列的执行上下文从逻辑上形成一个栈：栈底总是全局上下文，栈顶是当前正在执行的上下文。脚本执行时，会在不同的执行上下文间切换（退出当前执行上下文，进入新的执行上下文）。

当 Javascript 脚本被浏览器载入后，默认最先进入的是一个全局执行上下文。当在全局上下文调用一个函数时，程序流就进入该函数内，此时引擎就会为该函数创建一个新的函数执行上下文，并且将其压入到执行上下文堆栈的顶部。浏览器总是执行栈顶的执行上下文，执行完毕后，将该执行上下文从栈顶弹出，然后，再次进入栈顶的执行上下文，直接栈中只有一个执行上下文，即栈底的全局上下文。

### this

**this** 是一个非常特殊的关键词标识符，也是 JavaScript 中最令人疑惑的机制之一。

this  是当前执行上下文（global、function 或 eval）的一个属性。它到底指向什么（对象），取决于 this 所在的函数属于谁。在绝大多数情况下，函数的调用方式决定了 this 的指向（即，this 在运行时绑定）。

**注意：** this 不能在执行期间被赋值，并且在每次函数被调用时，this 的指向也可能会不同。

```javascript
function func() {
    this = window
}
func() // Uncaught SyntaxError: Invalid left-hand side in assignment
```

#### 全局上下文中

this 指向 JavaScript 宿主环境的全局对象。

比如：在浏览器中，this 始终指向 Window 对象；在 Node.js 中，this  始终指向 Global 对象。

```js
console.log(this === window) // true
```

#### 函数上下文中

在函数内部，this 的值取决于函数被调用的方式。

##### 简单调用，即独立函数调用。

在非严格模式下，this 没有明确的指向对象，默认指向全局对象。

```js
function funcA () {
    console.log(this === window) // true
}
funcA()

function funcB() {
    function funcC() {
        console.log(this === window) // true
    }
    funcC()
}
funcB()
```

在严格模式下，this 默认是 `undefined`。

```js
'use strict';
function funcA() {
    console.log(this) // undefined
}
funcA()
```

##### 作为对象方法

当函数作为对象方法调用时，this 指向该对象。

```js
const obj = {
    prop: '火麒麟',
    func: function () {
        return this.prop
    }
}
obj.func() // '火麒麟'
```

##### 构造函数

在作为构造函数调用时（new 命令调用），this 指向创建的实例。

```js
function func() {
    this.instName = 'name'
    return this
}
console.log(func() === window)      // true
console.log(new func() === window)  // false
console.log(new func())             // func {instName: 'name'}
```

##### 箭头函数

在箭头函数中，this 由词法作用域决定，指向声明函数时所在的执行上下文，并且不会再被其他绑定 this 的方式（call、apply、bind）影响。

```js
const self = this
const func = () => this
const obj = { func: func }
const func2 = funcC.bind(obj)

funcC() === self         // true
obj.funcC() === self     // true
funcC.call(obj) === self // true
func2() === self         // true
```

##### DOM事件的函数

this 指向触发事件的 DOM 元素。

```js
document.querySelector('div').addEventListener('click', function () {
    console.log(this === document.querySelector('div')) // true
}, false)
```

#### 绑定this

`Function.prototype.call()`、``Function.prototype.apply()`` 方法可以指定函数运行时的 this。

```js
var a = 2
var obj = { a: 20 }
function func(b) {
    return this.a + b
}

func(1)              // 1, window.a + b
func.call(obj, 1)    // 21, obj.a + b
func.apply(obj, [1]) // 21, obj.a + b
```

ECMAScript 5 引入了 `Function.prototype.bind()`，该方法创建一个与原函数有相同函数体和作用域的新函数，但是新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的。

```js
const func2 = func.bind(obj)
funcJ(1) // 21
```

**注意：** 非严格模式下，当用 call()、apply()、bind() 传进去作为 this 的参数不是对象时，将会调用对应的数据类型的构造函数转换成对象，而 null、undefined 由于无法转换成对象，全局对象将作为 this。

```javascript
console.log(func.call(1, 1))      // NaN, Number(1).a + b
console.log(func.apply('1', [1])) // NaN, String(1).a + b
console.log(func.bind(null)(1))   // 3, window.a + b
```

### 作用域与执行上下文

JavaScript 属于解释型语言，其代码的执行分为解释阶段和执行阶段。

* **解释阶段： ** 词法分析、语法分析、作用域规则确定。

* **执行阶段：** 创建执行上下文、执行函数代码、垃圾回收。

作用域是在**解释阶段**确定的，即在**函数声明**的时候就确定的一系列变量的集合体，而执行上下文是在**执行阶段**，也就是**函数执行**时才产生的一系列变量的集合体。也就是说作用域定义了执行上下文中的变量的访问规则，执行上下文是在这个作用域规则的前提下执行代码的。

一个作用域下可能包含若干个上下文环境，也可能从来没有过上下文环境（函数从来就没有被调用过）；有可能有过，现在函数被调用完毕后，上下文环境被销毁了；有可能同时存在一个或多个（闭包）。**同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值**。

作用域和执行上下文之间最大的区别是： **执行上下文在运行时确定，随时可能改变（比如 this）；作用域在定义时就确定，并且不会改变**。

### 闭包（closure）

闭包是 JavaScript 中最强大的特性之一。

《JavaScript高级编程指南》：**闭包是指有权访问另外一个函数作用域中的变量的函数。**

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)：**闭包是由函数以及声明该函数的词法环境组合而成的。**也就是说，闭包可以让你从内部函数访问外部函数作用域，以及外部函数能访问的所有变量和函数。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

一个函数里面嵌套另外一个函数，被嵌套（内部）的函数自身形成了一个闭包，这个闭包可以自己拥有独立的词法环境，也就意味着，被嵌套函数的作用域除了自身的作用域，还维持了其容器函数的作用域。

此外，由于被嵌套函数可以访问容器函数的作用域，因此当被嵌套函数生存周期大于外部函数时，容器函数中定义的变量和函数的生存周期将比被嵌套函数执行时间长。当被嵌套函数以某一种方式被任何一个外部作用域访问时，一个闭包就产生了。

**一句话概括：闭包就是一个拥有自身作用域和父级作用域（由外层函数提供，即便外层函数销毁依旧可以访问）的特殊函数。**

**注意： 闭包的本质是利用了作用域的机制，来达到外部作用域访问内部作用域的目的。**

闭包的特征：

* 闭包是一个在另一个函数内声明的函数。理论上说，JavaScript 中所有的函数都是闭包....
* 闭包能访问外部函数作用域中的变量和函数，即使外部函数的执行上下文已释放或者外部函数已销毁。
* 外部函数却不能够访问定义在内部函数中的变量和函数。

>  **闭包可以理解为一种特殊的函数作用域吗？？？？** 

一个简单的示例：

```js
let func = function () {
    let name = 'lizh';
    function f1() {
        console.log(name)
    }
    return f1
}
const func2 = func(); // func函数已执行完毕，执行上下文被释放
func2() // 打印：lizh。也就是，func函数执行上下文被释放后，f1函数仍能访问其内的变量

func = null // 即使 func 销毁
func2()     // 仍能访问 func 函数内的变量
```

即使 func 函数执行上下文被释放后，甚至 func 函数被销毁，f1 函数仍能访问 func 作用域内的变量，无论 f1 是在什么作用域下调用。

#### 闭包的使用场景

##### 模拟私有属性、方法

编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用。而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。比如：

```js
const Counter = (() => {
    let privateValue = 0;
    function change(val) {
        privateValue += val;
    }
    return {
        sum(val) {
            change(val)
        },
        value() {
            return privateValue;
        }
    }
})();
Counter.value() // 0
Counter.sum(1)
Counter.value() // 1
console.log(privateValue) // Uncaught ReferenceError: privateValue is not defined
Counter.change(1)         // Uncaught TypeError: Counter.change is not a function
```

变量 privateValue 和函数 change 是在一个立即执行的匿名函数体内声明的，外部无法直接访问，必须通过匿名函数返回的公共函数来访问。

##### 函数工厂

所谓函数工厂就是函数的返回值是一个函数，也就是创建函数的函数。

```js
function makeFunc(x) {
    return function (y) {
        return x + y
    }
}

const add5 = makeFunc(5)
const add10 = makeFunc(10)

add5(2)  // 7
add10(2) // 12
```

add5 函数和 add10 函数共享相同的函数定义，但是保存了不同的词法环境。在 add5 函数的执行上下文中，x 的值为 5，而在 add10 函数的执行上下文中，x 的值为 10。

##### 减少名字冲突

闭包可以有效得避免局部属性污染全局变量空间导致的命名空间混乱。

#### 使用闭包需要注意

##### 闭包的性能与内存占用

由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 IE 中可能导致内存泄露。

```javascript
const func = function () {
    let name = 'lizh';
    function func2() {
        console.log(name)
    }
    return func2
}
func()()
```

一般来说，当函数执行完成后，函数内的变量也被释放。而上述的 func 函数，由于内部的闭包函数 func2 引用了变量 name，导致 func 函数执行后，name 变量无法释放，仍占用内存。 

**解决方法：** 在退出函数之前，将不使用的局部变量全部删除。

##### 闭包变量共享问题

```javascript
function func() {
    for (var i = 0; i < 3; i++) {
        var value = i
        setTimeout(() => {
            console.log(value)
        }, i * 1000)
    }
}
func()
```

如上函数，我们期待的是 func 函数依次打印：0、1、2，但实际打印结果是：2、2、2。

原因是 setTimeout 的传参是闭包。这些闭包都是 func 函数声明的，它们有相同的词法作用域。由变量 value 是使用 var 声明的，存在变量提升，所以 value 是在 func 函数的作用域内。func 函数的 for 循环执行结束后，value 变量的值是 2，所以，无论哪个定时器执行函数，访问的都是值为 2 的 value。

以上 func 函数相当于：

```javascript
function func() {
    var value
    for (var i = 0; i < 3; i++) {
        value = i
        setTimeout(() => {
            console.log(value)
        }, i * 1000)
    }
}
```

**解决方法：** for 语句内，用 let 或 const 声明 value 变量。

##### this的使用

```js
var a = "风中之神"
var obj = {
    a: "不哭死神",
    func() {
        console.log(this.a)
        return function () {
            console.log(this.a)
        }
    }
}

obj.func()()
// 不哭死神
// 风中之神
```

调用 `obj.func()()`，会先后执行两个函数：一是 func 函数，函数体内的 this 指向 obj；二是作为 func() 函数返回值的函数，其函数体内的 this 指向的是全局对象，因为 func() 函数返回的函数，相当于在全局作用域声明了一个函数。

```js
const func2 = obj.func()
func2()
```

### call、apply、bind

#### 相同之处

* 都可以改变函数体内 this 的指向。
* 第一个参数都是 this 要指向的对象。
  - 非严格模式下，不传、传 null、undefined，指向**全局对象**；严格模式下，this 的值将会是 null、undefined。
  - 非严格模式下，传原始值（数字、字符串、布尔值），指向该原始值的自动包装对象，即被 String、Number、Boolean 对象转换；严格模式下，不会自动转换。
  - 传一个对象，指向该对象。
* 都可以利用后续参数传参。
* 都对 ES6 的箭头函数无效。

#### 不同之处

* call、apply 传参方式不一样。

- apply、call 立即执行；bind 不立即执行，它会返回一个新创建的函数。

```js
var a = '风'
const obj = {
    a: '云'
}
function func1(b, c) {
    console.log(this.a + `：${b}${c}`)
}
const func2 = (b, c) => {
    console.log(this.a + `：${b}${c}`)
}
func1('摩诃', '无量') // 风：摩诃无量
func2('摩诃', '无量') // 风：摩诃无量
```

```js
func1.call(obj, '摩诃', '无量')    // 云：摩诃无量
func1.apply(obj, ['摩诃', '无量']) // 云：摩诃无量
func1.bind(obj)('摩诃', '无量')    // 云：摩诃无量

func2.call(obj, '摩诃', '无量')    // 风：摩诃无量
func2.apply(obj, ['摩诃', '无量']) // 风：摩诃无量
func2.bind(obj)('摩诃', '无量')    // 风：摩诃无量
```

#### 模拟实现 call 和 bind

```javascript
var a = '风'
const obj = {
    a: '云'
}
function func(b) {
    console.log(this.a + `：${b}`)
}

func('摩诃无量') // 风：摩诃无量
```

实现原理：**将函数设置为对象的属性，然后用对象去调用。**

```js
obj.func = func
obj.func('摩诃无量') // 云：摩诃无量
```

具体实现：

```js
// call 的模拟
Function.prototype.myCall = function (context = window) {
    context.fn = this
    const args = [...arguments].slice(1)
    const result = context.fn(...args)
    delete context.fn
    return result
}

func.myCall(obj, '摩诃无量') // 云：摩诃无量
```

```js
// bind 的模拟
Function.prototype.myBind = function (context) {
    const fn = this // 原函数
    const args = [...arguments].slice(1)
    return function F() {
        if (this instanceof F) { // 当构造函数使用时，this指向创建的实例
            return new fn(...args, ...arguments)
        }
        return fn.apply(context, args.concat(...arguments))
    }
}

const func2 = func.myBind(obj)
func2('摩诃无量')     // 云：摩诃无量
new func2('摩诃无量') // undefined：摩诃无量。this指向创建的实例，而实例没有a属性。
```

#### 实用场景

将类数组转化为数组：

```js
Array.prototype.slice.call(arrayLike)
Array.prototype.slice.apply(arrayLike)
Array.prototype.slice.bind(arrayLike)()
```

判断数据类型：

```js
Object.prototype.toString.call([])
Object.prototype.toString.apply([])
Object.prototype.toString.bind([])()
```

数组追加：

```js
const arr1 = ['风', '云']
const arr2 = ['摩', '诃', '无', '量']
Array.prototype.push.apply(arr1, arr2)
console.log(arr1) // ['风', '云', '摩', '诃', '无', '量']
```

获取数组中的最大值和最小值：

```js
const arr = [1, 3, 5, 7, 2, -10, 11]
Math.max.apply(null, arr) // 11
Math.min.apply(null, arr) // -10
```

### 一个关于作用域的题目

以下代码的最终输出结果是什么？

```js
function func() {
    f2 = function () {
        console.log('1')
    }
    return this
}
func.f2 = function () {
    console.log('2')
}
func.prototype.f2 = function () {
    console.log('3')
}
var f2 = function () {
    console.log('4')
}
function f2() {
    console.log(5)
}

func.f2()
f2()
func().f2()
f2()
new func.f2()
new func().f2()
new new func().f2()
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/others_01.html?type=2)

执行结果是：2 4 1 1 2 3 3。

### 参考链接

[理解执行环境与作用域链](https://leohxj.gitbooks.io/front-end-database/javascript-advance/scope-chain.html)

[MDN 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[一篇文章看懂JS闭包，都要2020年了，你怎么能还不懂闭包？](https://www.codetd.com/article/7955558)