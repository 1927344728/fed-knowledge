## 谈谈 JavaScript 的作用域和上下文

Javascript与作用域有关的概念很多：全局作用域、局部作用域、词法作用域、上下文、闭包、还有最令人疑惑的 this 等等。。。

本文主要是对作用域相关的内容做个疏理。

  

什么是作用域？

**一句话：作用域就是变量与函数的可访问范围。**

**作用域是一个抽象概念，在 JavaScript 中, 作用域可以理解为可访问变量、对象、函数的集合。**通常我们说某个变量在不在某个作用域，指的就是变量在此作用域是否可访问。换句话说，作用域决定了代码区块中变量和其他资源的访问权限。

作用域分为词法作用域（静态作用域）和动态作用域。

  

### 词法作用域

**词法作用域，也称静态作用域，是指函数的作用域在声明（定义）时就已经确定了**。

**JavaScript 采用的就是词法作用域。**`Javascript`函数无论在何处调用，它能访问哪些变量，不能访问哪些变量是早已确定的。它的作用域是由定义时的位置决定的。

大多数现在程序设计语言都是采用静态作用域规则，如C/C++、C#、Python、Java……

来看一个简的例子：

```js
let fengyun = '风中之神'
function funcA (){
    console.log(fengyun)
}
function funcB () {
    let fengyun = '不哭死神'
    funcA()
}
funcB() //风中之神
```

如上代码，在`funcB`调用`funcA`。`funcA`没有变量`fengyun`，它会在定义函数的作用域中查找。`funcA`是在全局作用域用定义的，因此，它会在全局作用域中查找变量` fengyun`。

**JavaScript关心的是函数声明时的作用域，而不是函数执行时的作用域。**

  

词法作用域可分为全局作用域、函数作用域，以及ES6新增的块级作用域。

#### 全局作用域

全局作用域中的变量能被程序中任何函数或者方法访问，这种变量也称为全局变量。全局变量的生命周期是存在于整个程序之内，只有在页面关闭后才会销毁。

一般来说以下三种情形拥有全局作用域：

##### 程序最外层定义的函数或者变量

```js
//全局变量会挂载到 window 对象上
<script>
    var varA = 123
    var funcA = function () {
        console.log('funcA')
    }
    console.log(varA) //123
    console.log(funcA) //ƒ () {console.log('funcA')}
</script>
```

```js
<script>
    console.log(varB) //undefined
    var varB = 123
    
    //这里要注意，varB在定义之前被调用，不会报错。这是因为变量提升。但变量提升只会声明变量，并不会直接赋值。以上代码价于：
    var varB
    console.log(varB) //undefined
    varB = 123
</script>
```

```js
var funcA = function () { 
    console.log('1')
}
function funcA() { 
    console.log('2')
}
funcA() //1

//以上代码等价于
//先声明变量funcA；定义一个函数名为funcA的函数，变量funcA指向这个函数；对变量funcA赋值一个新函数，覆盖前面函数
var funcA
function funcA() { 
    console.log('2')
}
funcA = function () { 
    console.log('1')
}
```

##### 未声明直接赋值的变量

这个跟我们平常写代码的坏习惯有关，不用var声明的变量会自动升级为全局作用域，不管是在程序的最外层还是函数内部。

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

> 程序最外层定义的变量会挂载到window属性，它有一个特性是不能用delete运算符删除。delete一个全局变量返回的是false。
>
> 未声明直接赋值的变量创建一个全局变量，创建的是全局属性，属性能够被delete运算符删除 。
>
> ```js
> var a = '123'
> b = '456'
> 
> delete a //false
> delete b //true
> 
> console.log(a) //123
> console.log(b) //Uncaught ReferenceError: b is not defined
> ```

##### Window对象的属性和方法

一般情况下，window对象的内置属性都拥有全局作用域，例如`window.name、window.location、window.top`等等

通常在Javascript中我们说全局对象，指的就是Window对象（与宿主环境有关），引用`this`指代的也是Window对象，如果我们在程序中定义一个全局作用域的变量，那么它自然也会成为Window对象的属性。

> 全局作用域弊端：过多的定义全局变量会污染全局命名空间， 容易引起命名冲突。



#### 函数作用域

函数作用域是指函数内声明的变量（不带var），只能在函数内部访问，外层的作用域（全局作用域或者其他函数作用域）无法直接访问。不同的函数内可以使用相同名称的变量，它们之间互不干扰。

函数内声明的变量称为局部变量，在函数执行完毕后销毁。

```js
<script>
    var funcA = function () {
        var a = 123
        return a
    }
    var funcB = function () {
        console.log(a)
    }
    console.log(a) //Uncaught ReferenceError: a is not defined
    funcB() //Uncaught ReferenceError: a is not defined
</script>
```



#### 块级作用域

**块语句（大括号“｛｝”中间的语句），如 if 和 switch 条件语句或 for 和 while 循环语句，不像函数，它们不会创建一个新的作用域**。在块语句中定义的变量将保留在它们已经存在的作用域中。

```js
for(var k = 0; k < 5; k++) {
}
console.log(k) //5
```

用 `var `关键字声明的变量，在 `for` 循环之后仍然被保存这个作用域里。

块级作用域可通过ES6新增命令 let 和 const 声明，所声明的变量在指定块的作用域外无法被访问：

```js
for(let k = 0; k < 5; k++) {
}
console.log(k) //Uncaught ReferenceError: k is not defined

if (true) {
    const j = '123'
}
console.log(j) //Uncaught ReferenceError: j is not defined
```

创建匿名函数，函数内的变量无法被外部访问：

```js
(function () {
    for(var k = 0; k < 5; k++) {
    }
})()
console.log(k) //Uncaught ReferenceError: k is not defined
```



### 动态作用域

首先说明一下，**JavaScript没有用动态作用域概念**，但`this`机制却和动态作用域类似！

**动态作用域是指函数的作用域在运行时才确定。**动态作用域不关心函数是如何声明以及在何处声明的，只关心它们从**何处调用**。动态作用域的概念和js中的`this`相同，`this`也关心函数在哪里调用的。**`JavaScript` 除了`this`之外，其他，都是根据词法作用域查找！！！**

采用动态作用域的语言有Pascal、Emacs Lisp、Common Lisp（兼有静态作用域）、Perl（兼有静态作用域）。C/C++是静态作用域语言，但在宏中用到的名字，也是动态作用域。



### 执行上下文栈

在ECMASscript中的代码有三种类型：global, function和eval。

每一种代码的执行都需要依赖自身的上下文。当然global的上下文可能涵盖了很多的function和eval的实例。函数的每一次调用，都会进入函数执行中的上下文,并且来计算函数中变量等的值。eval函数的每一次执行，也会进入eval执行中的上下文，判断应该从何处获取变量的值。

注意：一个function可能产生无限的上下文环境，因为一个函数的调用（甚至递归）都产生了一个新的上下文环境。

一系列活动的执行上下文从逻辑上形成一个栈。栈底总是全局上下文，栈顶是当前（活动的）执行上下文。当在不同的执行上下文间切换（退出的而进入新的执行上下文）的时候，栈会被修改（通过压栈或者退栈的形式）。

当javascript代码文件被浏览器载入后，默认最先进入的是一个全局的执行上下文。当在全局上下文中调用执行一个函数时，程序流就进入该被调用函数内，此时引擎就会为该函数创建一个新的执行上下文，并且将其压入到执行上下文堆栈的顶部。浏览器总是执行当前在堆栈顶部的上下文，一旦执行完毕，该上下文就会从堆栈顶部被弹出，然后，进入其下的上下文执行代码。这样，堆栈中的上下文就会被依次执行并且弹出堆栈，直到回到全局的上下文。

### 执行上下文

也称为执行环境，即Javascript代码执行时的环境。不同类型代码的执行会产生不同的执行环境。一个执行的上下文可以抽象的理解为object，每一个执行的上下文都有一系列的属性（我们称为上下文状态），他们用来追踪关联代码的执行进度。主要有三个属性：

* 变量对象(variable object)
* this指针(this value)
* 作用域链(scope chain)

#### 变量对象(Variable Object)

变量对象(variable object) 是与执行上下文相关的 数据作用域(scope of data) 。 它是与上下文关联的特殊对象，用于存储被定义在上下文中的 变量(variables) 和 函数声明(function declarations) 。 它是一个抽象的概念，不同的上下文中，它表示使用不同的object。

例如：在浏览器中，变量对象也是全局对象自身，即window；在Nodejs中，变量对象也是全局对象自身，即Global对象。（这就是我们可以通过全局对象的属性来指向全局变量）。

进入执行上下文时，VO的初始化过程具体如下：

- 函数的形参：当进入函数执行上下文时，形参是变量对象的一个属性，其属性名就是形参的名字，其值就是实参的值；对于没有传递的参数，其值为undefined
- 函数声明：函数也是变量对象的一个属性，其属性名和值都是函数对象创建出来的；如果变量对象已经包含了相同名字的属性，则替换它的值
- 变量声明：函数内的变量也是变量对象的一个属性，其属性名即为变量名，其值为undefined;如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。

**执行代码的时候，VO的一些Undefined值会被确定。**

```js
console.log(varA) //undefined
console.log(funcB)//ƒ baz(){ console.log("baz")}

var varA = '雪饮刀'
function funcB(){
    console.log("绝世好剑");
}
```

变量`varA`初始化为变量对象中的属性，属性名是变量名，值为undefined。`console.log(varA)`执行时，`varA`还未赋值，其值仍为`undefined`。

函数`funcB`初始化为变量对象中的属性，其属性名和值都是函数对象创建出来的。因此它是有值的。

以上代码等价于：

```js
var varA
function funcB(){
    console.log("绝世好剑");
}

console.log(varA)
console.log(funcB)

varA = '雪饮刀'
```

#### 活动对象(activation object)

当函数被调用者激活，这个特殊的活动对象(activation object) 就被创建了。它包含普通参数(formal parameters) 与特殊参数(arguments)对象(具有索引属性的参数映射表)。

即：**活动对象 = 变量对象 + 特殊对象arguments 。**

AO是在进入函数的执行上下文时创建的，并为该对象初始化一个arguments属性，该属性的值为Arguments对象。

对于VO和AO的关系可以理解为：VO在不同的执行上下文有不同的表现：当在全局执行上下文，可以直接使用VO；但是，在函数执行上下文中，AO就会被创建，并在函数上下文中作为变量对象使用。

#### 作用域链(scope chain)

**一句话：作用域链其实就是对执行上下文中的变量对象(VO|AO)有序访问的链表。**

在执行上下文的作用域中查找变量的过程被称为标识符解析(indentifier resolution)，这个过程的实现依赖于函数内部另一个同执行上下文相关联的对象——作用域链。**作用域链是一个有序链表，**其包含着用以告诉JavaScript解析器一个标识符到底关联着哪一个变量的对象。而每一个执行上下文都有其自己的作用域链Scope。

作用域链的用途，是保证对执行上下文有权访问的所有变量和函数的有序访问。当查找变量的时候，**会先从当前上下文的变量对象中查找**，如果没有找到，就会从父级**(词法层面上的父级)**执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。

```js
let varA = '风神腿'
let varB = '排云掌'
function funcA () {
    let varB = '天霜拳'
    function funcB () {
        console.log(varA) //风神腿，全局对象中的varA
        console.log(varB) //天霜拳，funcA中的varB
    }
    funcB()
    funcC()
}
function funcC () {
    console.log(varA) //风神腿，全局对象中的varA
    console.log(varB) //排云掌，全局对象中的varB
}
funcA()
```

`funcA`调用`funcB`打印`varA`，`funcB`没有此变量，然后再在父级执行上下文(`funcA`的函数执行上下文)中查找，没有找到，再往上级查找，一直找到全局对象的`let varA = '风神腿' `。

注意：**这里的父级行上下文指的是词法层面上的父级，即定义函数的父级上下文。**比如：`funcC`虽然是在`funcA`中调用的，但它不会调用`funcA`定义的变量`varB`，而是调用全局上下文中的`let varB = '排云掌'`，因为它是在全局上下文中声明的。

在一般情况下，一个作用域链包括父级变量对象（variable object）（作用域链的顶部）、函数自身变量VO和活动对象（activation object）。当查找标识符的时候，会从作用域链的活动对象部分开始查找，然后(如果标识符没有在活动对象中找到)查找作用域链的顶部，循环往复。



### 上下文（this）

**上下文通常是取决于一个函数如何被调用。当函数作为对象的方法被调用时，上下文就是调用方法的对象，this指向这个对象。**

`this`关键词是JavaScript中最令人疑惑的机制之一。`this`是非常特殊的关键词标识符，在每个函数的作用域中被自动创建，它到底指向什么（对象），取决于 this 所在的函数属于谁：

#### 全局上下文中

`this`指向JavaScript 的宿主换环境的全局对象。在浏览器中，`this`始终指向`Window`对象；在Node.js中，`this`始终指向`Global` 对象。

```js
console.log(this === window) // true
```

#### 函数上下文中

##### 简单调用

简单调用，即独立函数调用。`this`没有明确的指向对象，那么默认就指向全局对象。

```js
function funcA () {
  return this
}
funcA() === window //true
```

在严格模式下，`this`保持进入执行上下文时被设置的值。如果没有设置，那么默认是`undefined`。它可以被设置为任意值**（包括`null/undefined/1`等等基础值，不会被转换成对象）**。

```js
function funcB () {
  "use strict"
  return this
}

funcB() === undefined //true
```

##### 箭头函数

在箭头函数中，`this`由词法作用域设置。它被设置为定义它的执行上下文的`this`，并且不再被调用方式影响（`call/apply/bind`）。

```js
let self = this
let funcC = () => this
funcC() === self //true

let obj = {
    funcC
}
obj.funcC() === self //true

funcC.call(obj) === self //true
let funcD = funcC.bind(obj)
funcD() === self //true
```

##### 作为对象方法

当函数作为对象方法调用时，`this`指向该对象。

```js
let objA = {
  propA: '火麒麟',
  funcF: function () {
    return this.propA
  }
}

objA.funcF() //"火麒麟"
```

##### 构造函数

在构造函数（函数用`new`调用）中，`this`指向构造出来的新对象。

```js
function funcG () {
    return this
}
funcG() === window //true
new funcG() === window //false,this指向新生成的实例
```

```js
class classA {
    funcH () {
        console.log(this === window) //false
        return this
    }
}
let consA = new classA()
consA.funcH() === consA //true
```

##### call和apply

`Function.prototype`上的`call`和`apply`可以指定函数运行时的`this`。

```js
var c = 50
var d = 60
function funcI(a, b){
  return a + b + this.c + this.d
}

let objB = {
    c: 10,
    d: 20
}
funcI.call(objB, 1, 2) //33 = 1 + 2 + 10 + 20
funcI.apply(objB, [100, 200]) //330 = 100 + 200 + 10 + 20
funcI.apply(1, [100, 200]) //NaN = 100 + 200 + undefined + undefined。this指向new Number(1)生成的Number对象，对象没有c、d属性
funcI.apply('1', [100, 200]) //NaN = 100 + 200 + undefined + undefined。this指向new String('1')生成的String对象，对象没有c、d属性
funcI.apply(null, [100, 200]) //410 = 100 + 200 + 50 + 60。this指向window
```

> 注意：当用`call`和`apply`而传进去作为`this`的不是对象时，将会调用对应的数据类型的构造函数转换成对象，而`null/undefined`由于无法转换成对象，全局对象将作为this。

#### bind

ES5引进了`Function.prototype.bind`。`f.bind(someObject)`会创建新的函数（函数体和作用域与原函数一致），但`this`被永久绑定到`someObject`，不论你怎么调用。

```js
function funcI(a, b){
  return a + b + this.c + this.d
}

let objB = {
    c: 10,
    d: 20
}
let funcJ = funcI.bind(objB)
funcJ(80, 90)  //200 = 80 + 90 + 10 + 20
```

#### DOM事件的函数

`this`自动设置为触发事件的dom元素。

```js
document.querySelector('div').addEventListener('click', function () {
    console.log(this === document.querySelector('div')) //true
}, false)
//点击div元素，执行结果为true
```

简单的说就是：

- 没指定调用对象，默认都指向全局对象
- 有对象就指向调用对象
- 在箭头函数中，`this`由词法作用域设置
- 用new构造就指向新对象
- 通过 apply 或 call 或 bind 来改变 this 的所指



### 作用域与执行上下文的区别

作用域是在**函数声明**的时候就确定的一系列变量的集合体，而执行上下文是**函数执行**时才产生的一系列变量的集合体。也就是说作用域定义了执行上下文中的变量的访问规则，执行上下文是在这个作用域规则的前提下执行代码的。

JavaScript 属于解释型语言，JavaScript 的执行分为：解释和执行两个阶段：

#### 解释阶段

- 词法分析
- 语法分析
- 作用域规则确定

#### 执行阶段

- 创建执行上下文
- 执行函数代码
- 垃圾回收

作用域是在JavaScript 解释阶段确定的，而执行上下文是执行阶段创建的。

它们最大的区别是：

**执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变**。



### 闭包

《JavaScript高级编程指南》：**闭包是指有权访问另外一个函数作用域中的变量的函数。**

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)：**闭包是由函数以及声明该函数的词法环境组合而成的。**也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

一个简单的闭包示例：

```js
function makeFunc() {
    var name = "Mozilla"
    function displayName() {
        alert(name)
    }
    return displayName
}

var myFunc = makeFunc()
myFunc()
```

这里的`displayName`就是一个闭包。`myFunc` 是执行 `makeFunc` 时创建的 `displayName` 函数实例的引用。`displayName` 的实例维持了一个对它的词法环境（变量 `name` 存在于其中）的引用。因此，当 `myFunc` 被调用时，变量 `name` 仍然可用，其值 `Mozilla` 就被传递到`alert`中。

一个更有意思的示例：

```js
function makeAdder(x) {
  return function(y) {
    return x + y
  }
}

var add5 = makeAdder(5)
var add10 = makeAdder(10)

console.log(add5(2))  // 7
console.log(add10(2)) // 12
```

`add5` 和 `add10` 都是闭包。它们共享相同的函数定义，但是保存了不同的词法环境。在 `add5` 的环境中，`x` 为 5。而在 `add10` 中，`x` 则为 10。

#### 闭包的用处

- 模拟私有属性、方法

  编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用。而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。比如：

  ```js
  var Counter = (function() {
    var privateCounter = 0;
    function changeBy(val) {
      privateCounter += val;
    }
    return {
      increment: function() {
        changeBy(1);
      },
      decrement: function() {
        changeBy(-1);
      },
      value: function() {
        return privateCounter;
      }
    }   
  })();
  
  console.log(Counter.value()); /* logs 0 */
  Counter.increment();
  Counter.increment();
  console.log(Counter.value()); /* logs 2 */
  Counter.decrement();
  console.log(Counter.value()); /* logs 1 */
  ```

  该共享环境创建于一个立即执行的匿名函数体内。这个环境中包含两个私有项：名为 `privateCounter` 的变量和名为 `changeBy` 的函数。这两项都无法在这个匿名函数外部直接访问。必须通过匿名函数返回的三个公共函数访问。

* 函数工厂

  函数工厂，就是调用函数后，返回的是一个新函数。前面有一个示例中的`makeAdder`函数就是函数工厂：

  ```js
  function makeAdder(x) {
    return function(y) {
      return x + y
    }
  }
  
  var add5 = makeAdder(5)
  var add10 = makeAdder(10)
  ```

- 避免局部属性污染全局变量空间导致的命名空间混乱

#### 闭包的缺点

- 内存消耗

  我们已经知道了闭包是自带执行环境的函数，相比普通函数，闭包对于内存的占用还真就比普通函数大，毕竟外层函数的自由变量无法释放。

* 闭包中的this

  ```js
  var varA = "风中之神"
  var objA = {
      varA: "不哭死神",
      FuncM: function () {
          console.log("FuncM: " + this.varA) //FuncM: 不哭死神
          return function () {
              console.log("FuncN: " + this.varA) //FuncN: 风中之神
          }
      }
  }
  
  obj.FuncM()() //FuncN: 风中之神
  ```

  `FuncM`的输出好理解。前面我们讲到：**当函数作为对象方法调用时，`this`指向该对象**。所以`FuncM`中的`this`指向的是`objA`，但是，这不并不意味它返回的函数也指向`objA`。`FuncM`返回的函数是全局上下文中调用的，它指向的是全局对象，即`window`。`obj.FuncM()()`等价于下面代码：

  ```js
  var funcO = obj.FuncM()
  funcO() //FuncN: 风中之神
  ```

### call/apply/bind的异同点

相同之处：

* 它们都可以改变函数体内 this 的指向。
* 第一个参数都是this要指向的对象
  - 不传，或者传null，undefined， this指向**window对象**
  - 传递另一个函数的函数名fun2，this指向**函数fun2的引用**
  - 值为原始值(数字，字符串，布尔值)，this会指向该原始值的自动包装对象，如 String、Number、Boolean
  - 传递一个对象，函数中的this指向这个对象
* 都可以利用后续参数传参
* 对ES6 的箭头函数无效

不同之处：

* call、apply传参方式不一样

- apply、call 立即执行；bind不立即执行，它会返回一个新创建的函数

```js
var varA = '风中之神'
function funcA (a, b) {
    console.log(this.varA + `：${a} ${b}`)
}
var arrawFunc = (a, b) => {
    console.log(this.varA + `：${a} ${b}`)
}
var objF = {
    varA: '不哭死神'
}

funcA('风', '云') //风中之神：风 云
arrawFunc('风', '云') //风中之神：风 云
```

默认情况下，`funcA、arrawFunc`函数中的`this`都是指向`window`。我们通过`call/apply/bind`来改变this的指向**（注意这三个方法的差异）**：

```js
//普通函数，this指向改变，指向objF
funcA.call(objF, '风', '云') //后续传参，传参需一个一个传
funcA.apply(objF, ['风', '云']) //后续传参，参数放在一个数组中
let funcC = funcA.bind(objF) //返回一个绑定函数
funcC('风', '云')
//以上三个的输出结果：不哭死神：风 云

//箭头函数，this指向无法改变，仍是指向window
arrawFunc.call(objF, '风', '云')
arrawFunc.apply(objF, ['风', '云'])
let funcD = arrawFunc.bind(objF)
funcD('风', '云')
//以上三个的输出结果：风中之神：风 云
```

#### 模拟实现 call 和 bind

实现原理：**将函数设置为对象的属性，然后用对象去调用。**

```js
//测试用列
var varA = '风中之神'
function funcA (a, b) {
    console.log(this.varA + `：${a} ${b}`)
}
var objF = {
    varA: '不哭死神'
}
funcA('风', '云') //风中之神：风 云
```

```js
//实现原理
var varA = '风中之神'
var objF = {
    varA: '不哭死神',
    funcA: function () {
        console.log(this.varA)
    }
}
objF.funcA('风', '云') //不哭死神：风 云
```

具体实现：

```js
//call的模拟
Function.prototype.myCall = function (context) {
    var context = context || window
    context.fn = this //fn是属性名，随便定义，后面会删除
    var args = [...arguments].slice(1) //取出函数中的参数
    var result = context.fn(...args)
    delete context.fn //删除fn属性
    return result
}

funcA.myCall(objF, '风', '云') //不哭死神：风 云
```

```js
//bind的模拟
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var that = this
  var args = [...arguments].slice(1)
  return function F() { // 返回一个函数
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new that(...args, ...arguments)
    }
    return that.apply(context, args.concat(...arguments))
  }
}

let funcC = funcA.myBind(objF)
new funcC('风', '云') //undefined：风 云。this指向新建的实例，新建的实例中没有varA属性，输出undefined
```

#### 实用场景

##### 将类似数组的对象转化为数组

类似数组的对象：对象的所有键名都是正整数或零，并且有`length`属性。

```js
Array.prototype.slice.call(document.querySelectorAll('div'))
Array.prototype.slice.apply(document.querySelectorAll('div'))
Array.prototype.slice.bind(document.querySelectorAll('div'))()
```

##### 判断变量类型

```js
Object.prototype.toString.call([])
Object.prototype.toString.apply([])
Object.prototype.toString.bind([])()
//[object Array]
```

##### 数组追加

```js
var arrA = [1 , 2 , 3, 4]
var arrB = ["风" , "中" , "之" , "神"]
Array.prototype.push.apply(arrA, arrB)
console.log(arrA) //[1, 2, 3, 4, "风", "中", "之", "神"]
```

##### 获取数组中的最大值和最小值

```js
var num = [1, 3, 5, 7, 2, -10, 11]
Math.max.apply(Math, num) //11
Math.min.apply(Math, num) //-10
```



### 最后，留一个Javascript题目

以下代码的最终输出结果是什么？

```js
function funcQ() {
    funcR = function () { 
        console.log('1')
    }
    return this
}
funcQ.funcR = function () {
    console.log('2')
}
funcQ.prototype.funcR = function () { 
    console.log('3')
}
var funcR = function () { 
    console.log('4')
}
function funcR() { 
    console.log(5)
}

funcQ.funcR()
funcR()
funcQ().funcR()
funcR()
new funcQ.funcR()
new funcQ().funcR()
new new funcQ().funcR()
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/others_01.html?type=2)

执行结果是：2 4 1 1 2 3 3。



### 参考链接

[理解执行环境与作用域链](https://leohxj.gitbooks.io/front-end-database/javascript-advance/scope-chain.html)

[MDN 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[一篇文章看懂JS闭包，都要2020年了，你怎么能还不懂闭包？](https://www.codetd.com/article/7955558)