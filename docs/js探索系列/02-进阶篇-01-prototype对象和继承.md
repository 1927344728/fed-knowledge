## 进阶篇：prototype对象和继承

JavaScript 常被描述为一种**基于原型的语言**——每个对象拥有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为**原型链**，它解释了为何一个对象会拥有定义在其他对象中的属性和方法。

在传统的面向对象编程（Object Oriented Programming，OOP）语言中，首先**定义类**，然后在创建对象实例时，将类定义的**所有属性和方法都复制到实例**，而在 JavaScript 中并不如此复制——是在构造函数和对象实例之间**建立一个链接**（对象实例的 `__proto__` 属性，指向其构造函数的 prototype 对象），之后通过上溯原型链，在构造器中找到这些属性和方法。

```javascript
function Person() { }
Person.prototype.hi = 'Hello,'
Person.prototype.greeting = function () {
    console.log(`${this.hi} ${this.name}!`)
}

const person = new Person();
person.name = 'lizhao';
person.greeting() // Hello, lizhao!

console.log(Person.prototype) // {hi: 'Hello,', greeting: ƒ, constructor: ƒ}
console.log(Person.prototype === person.__proto__) // true
```

**注意： ES6 引入的 class 关键字只是语法糖，JavaScript 仍然是基于原型的。**

### 构造器（构造函数）

传统的面向对象编程语言（C++、Java...）都有**类**的概念。所谓**类**就是对象的模板，对象就是类的实例。但是，JavaScript 语言的对象体系，不是基于类的，而是基于**构造函数**和**原型链**。

在 JavaScript 中，构造函数是对象的模板，描述实例对象的基本结构，用于生成多个具有相同结构的实例对象。本质上说，构造函数就是一个普通的函数，当使用 new 操作符调用该函数时，就可以称为构造器（构造函数）。

构造函数有以下特征：

* 用 new 操作符来调用。
* 函数体的 this 指向生成的对象实例。

```javascript
function Person(name) {
    this.hi = 'Hello,'
    this.name = name
    this.greeting = function () {
        console.log(`${this.hi} ${this.name}!`)
    }
}
const person = new Person('lizhao');
person.greeting() // 'Hello, lizhao!'
```

**构造函数的缺点：** 同一个构造函数创建的多个实例之间，无法共享属性和方法。这样就会导致两个问题：一是系统资源的浪费，如上代码，每个实例都会创建 hi、name 属性和 greeting 方法，而 hi 属性和 greeting 方法在每个实例中都是一样的；二是构造函数与实例之间缺少联接，比如，想要统一更新所有已生成实例的 hi 属性。

### new操作符

new 操作符用于创建一个对象类型或者构造函数的实例。

new 操作符进行如下的操作：

* 创建一个空的新对象（即 {}）；
* 为新对象添加属性 `__proto__`，将该属性指向构造函数的 prototype 属性；
* 将新对象作为 this 的上下文 ；
* 如果该函数没有返回对象，则返回 this。

函数内部可以使用 `new.target` 属性。如果当前函数是 new 操作符调用，target 属性指向当前函数，否则为undefined。

```javascript
function Person() {
    console.log(new.target)
}
new Person(); // ƒ Person() { console.log(new.target) }
Person()      // undefined
```

### 原型

JavaScript 继承机制的设计思想就是，原型对象的所有属性和方法，都能被实例对象共享。这样不仅节省了内存，还建立了实例和对象之间的联系。

```javascript
function Person(name) {
    this.name = name
}
Person.prototype.hi = 'Hello,'
Person.prototype.greeting = function () {
    console.log(`${this.hi} ${this.name}!`)
}

const person1 = new Person('li');
person1.greeting() // Hello, li!

const person2 = new Person('zhao');
person2.greeting() // Hello, zhao!
```

原型对象的属性不是实例对象自身的属性：

```javascript
person1.hasOwnProperty('name')     // true
person1.hasOwnProperty('hi')       // false
person1.hasOwnProperty('greeting') // false
```

修改原型对象会立刻体现到所有实例对象上：

```javascript
Person.prototype.hi = '你好，'
person1.greeting() // 你好， li!
person2.greeting() // 你好， zhao!
```

实例对象可以重写原型对象中的属性和方法。当访问一个对象的属性和方法时，JavaScript 引擎先会查找自身是否有该属性或方法，如果没有，再去原型对象查找。

```javascript
person2.hi = 'Goodbye,'
person2.hasOwnProperty('hi') // true
person2.greeting() // Goodbye, zhao!

person1.greeting() // 你好， li!
```

> **仅个人理解：** 原型（对象）、prototype（对象）的概念
>
> prototype 的翻译是“原型”，所以有时候容易误将 “原型对象” 和 “prototype 对象” 认为是同一个东西。
>
> 一个对象的原型（对象）指的是一个对象可以从另一个对象**继承的、共享的**属性和方法的集合。在 Javascript 中，所有对象（Object.create(null) 创建的对象除外）都有一个原型（对象）。
>
> 一个对象的 prototype（对象）指的是该对象可以**被继承的、被共享的**属性和方法的集合。在 Javascript 中，并不是所有对象都有 prototype（对象） 。
>
> 一个对象的原型（对象），指的就是该对象构造函数的 prototype（对象）。

#### constructor属性

构造函数的 prototype 对象有一个 constructor 属性，默认指向该构造函数。

所有实例对象（Object.create(null) 创建的对象除外）都将从其构造函数的原型中继承了一个 constructor 属性，默认情况下，该属性指向实例对象的构造函数。

**注意：** 实例的 constructor 属性是继承而来的，不是自身属性。当获取实例的 constructor 时，其实是从实例的原型，也就是其构造函数的 prototype 对象中读取。

```javascript
function Person() { }
const person = new Person();

Person.prototype.constructor === Person // true
person.constructor === Person.prototype.constructor // true
person.constructor === Person // true
```

之所以构造函数要在 prototype 对象有这样一个指向自身的属性，就是为了给实例对象继承，让实例对象知道自己是哪一个构造函数创建的。

**constructor 属性应用：** 一是获取实例对象的构造函数的名称，二是用于从一个实例对象创建另一个属于同一构造函数的实例对象。

```javascript
person.constructor.name // 'Person'

const person2 = new person.constructor()
person2.constructor === person.constructor // true
```

可以为任何数据类型（null、undefined 除外）指定 constructor 属性，但基本类型（String、Number、Boolean 等）不会保留更改，也不会抛出异常（基本类型设置其他属性也是如此）。也就是，每次将基本类型当成对象使用时，都是根据**原始值**实时创建实例对象，其他属性被忽略了。

```javascript
function Person() { }
const str = 'abc'
str.constructor = Person
str.prop = 123

console.log(str.constructor) // ƒ String() { [native code] }
console.log(str.prop)        // undefined
```

基本上，除了基本类型外，任何对象都可以更改 constructor 属性的值。

```javascript
const arr = []
arr.constructor = Person
console.log(arr.constructor) // ƒ Person() { }
```

改变构造函数 prototype 对象或者实例对象的 constructor 属性不会影响 instanceof 运算符。

```javascript
arr instanceof Array // true
```

**注意：** 如果构造函数的 prototype 对象修改为其他构造函数的 prototype 对象，建议修改其 constructor 属性，也就是重新将 constructor 属性指向构造函数。

```javascript
function Person() {
    this.hi = 'Hello'
}
function Student() { }
Person.prototype = Student.prototype

const person = new Person()
console.log(person.constructor) // ƒ Student() { }
console.log(person.hi)          // Hello
```

如上，person 实例本来是 Person 构造函数创建的，但是，由于 Person.prototype 对象修改为 Student.prototype 对象，导致 person 实例的 constructor 属性继承的是 Student.prototype.constructor，指向的是 Student 构造函数。

这样可能会引发一些问题，比如，当我们依赖实例对象的 constructor 属性创建新实例时：

```javascript
const person2 = new person.constructor()
console.log(person2.hi) // undefined. 不是 Person 创建的实例
```

如上代码，本意是创建另一个 Person 实例，而实际创建的是一个 Student 实例。这是由于 person.constructor 指向的并不是真正创建 person 实例的构造函数。

因此，为了避免不必要的问题，推荐如下做法：

```javascript
Person.prototype = Student.prototype
Person.prototype.constructor = Person
```

#### instanceof运算符

instanceof 运算符返回一个布尔值，用于判断一个实例对象的原型链上是否包含某个对象的  prototype 属性。

```javascript
[] instanceof Array  // true
[] instanceof Object // true

[].__proto__ === Array.prototype // true
Array.prototype.__proto__ === Object.prototype // true
// 数组实例的原型是Array.prototype -> Array.prototype 的原型是 Object.prototype。所以，数组实例的原型链上也包含 Object.prototype。
```

**需要注意的是：** `person instanceof Person` 返回 true，并不意味着永远返回 true，因为 Person.prototype 属性的值是可变的，同样，person 的原型链也是可变的。

```javascript
Person.prototype = { a: 1 }
person instanceof Person // false
```

```javascript
Object.setPrototypeOf(person, { b: 1 })
person instanceof Person // false
```

**注意：** 在多个全局对象的情况下（如：多个 frame 或多个窗口)，不同的全局环境拥有不同的全局对象，从而拥有不同的内置类型构造函数。这可能会引发一些问题。比如，`[] instanceof window.frames[0].Array` 会返回 false，因为 `window.Array.prototype !== window.frames[0].Array.prototype`。

**注意：** 一般来说，Javascript 中所有对象都是 Object 的实例，也就是说， `anyObject instanceof Object` 都应该返回 true，但也有两种例外的情况：一是以字面量方式创建的原始值（非对象），二是用 `Object.create(null)` 创建的对象。

```javascript
const str1 = 'abc'
const str2 = new String('abc')
str1 instanceof Object // false
str2 instanceof Object // true

const obj = Object.create(null)
typeof obj    // 'object'
obj.__proto__ // undefined
obj instanceof Object // false
```

#### 其他相关的属性和方法

##### Object.create()

ECMAScript 5 中引入了 Object.create()，用来创建一个**指定原型的新对象**。

```javascript
Object.create(null) // 创建一个原型为null的实例对象

function Constructor(){}
Object.create(Constructor.prototype, {
    prop1: { // 数据属性
        writable: true,
        configurable: true,
        value: "hello"
    },
    prop2: { // 访问器属性
        configurable: false,
        get: function () { return 10 },
        set: function (value) {}
    }
});
```

Object.create() 的主要用于从一个实例对象生成另一个实例对象，这是推荐的做法，比依赖实例对象的 constructor 属性更安全：

```javascript
function Person() { }
const person = new Person()
Object.setPrototypeOf(person, null)

new person.constructor() // Uncaught TypeError: person.constructor is not a constructor
Object.create(Object.getPrototypeOf(person)) // {}
```

##### getPrototypeOf()

返回指定对象的原型（内部[[Prototype]]属性的值）。这是获取对象的原型的标准方法，与对象的 `__proto__` 属性返回的是同一原型对象。

```javascript
const arr = [];
Object.getPrototypeOf(arr) === arr.__proto__ // true
```

##### setPrototypeOf()

为对象设置一个指定的原型 (一个对象或 null），即修改对象 [[Prototype]] 属性的值。

```javascript
const arr = [];
Object.setPrototypeOf(arr, String.prototype)
// arr 会失去 Array.prototype 上的属性和方法了，但会继承 String.prototype 上的属性和方法。

arr.push(1)  // Uncaught TypeError: arr.push is not a function
arr.fixed(2) // Uncaught TypeError: String.prototype.toString requires that 'this' be a String
```

##### isPrototypeOf()

返回布尔值，判断对象是否在另一个对象的原型链上，其作用与 instanceof 运算符相同，只是调用方式不同。

```javascript
Object.prototype.isPrototypeOf([]) // true
[] instanceof Object // ture
```

##### `__proto__`

返回实例对象内部 [[Prototype]] 属性，也就是构造函数的 prototype 对象。

**注意：** `__proto__` 属性是一个访问器属性（一个 getter 和一个 setter 函数），**是可读写的**。

**注意：** `__proto__` 已被大多数浏览器厂商所支持，但仅在 ES6 规范中被标准化，也就是说，ES6 以前，`__proto__` 不是 ECMAScript 语言规范。建议使用 `Object.getPrototypeOf()` 获取对象的原型。

### 原型链

在 Javascript 中，每个对象拥有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为**原型链**，它解释了为何一个对象会拥有定义在其他对象中的属性和方法。

所有对象（Object.create(null) 创建的对象除外）的原型最终都可以上溯到 Object.prototype，也就是说，所有对象都继承了 Object.prototype 的属性，如常见的 valueOf()、toString() 方法。

那么，Object.prototype 对象有没有原型呢？

有，Object.prototype 的原型是 null。

```javascript
Object.getPrototypeOf(Object.prototype) // null
```

null 没有任何属性和方法，也没有自己的原型。因此，原型链的尽头就是 null。

读取对象的某个属性时，JavaScript 引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。如果直到最顶层的 Object.prototype 还是找不到，则返回 undefined。

如果对象自身和它的原型，都定义了一个同名属性，那么优先读取对象自身的属性，这叫做 “覆盖”。

**注意：** 在原型链上查找属性是比较耗时的，对性能有影响。所查找的属性在原型链层次越高，对性能的影响越大。另外，查找不存在的属性时会遍历整个原型链，也就是，遍历原型链上的所有可枚举属性。

**注意：** 改变原型对象的属性，在每一个 JavaScript 引擎和浏览器中都是一个非常慢且影响性能的操作，原型对象的属性修改会影响到所有继承自该原型的实例对象。一般建议是，创建一个新的且可以继承该原型的对象（推荐使用 `Object.create()`），再重写对象的属性和方法。

### 继承

继承是面向对象编程中的一个概念。继承可以使得子类具有父类的各种属性和方法，而不需要再次编写相同的代码。在子类继承父类的同时，还可以重新定义某些属性，并重写某些方法，即覆盖父类的原有属性和方法，使其获得与父类不同的功能。另外，为子类追加新的属性和方法也是常见的做法。

#### 一个简单示例

JavaScript 的继承是基于**构造函数**，本质上是让一个构造函数的 prototype 对象接收另一个对象上的属性和方法。

```javascript
function Person(name) {
    this.hi = `Hello, I'm ${name}!`
}
Person.prototype.greet = function () {
    console.log(this.hi)
}
function Student(name, grade) {
    Person.call(this, name)
    this.grade = grade
}
Student.prototype = Object.create(Person.prototype)
// Object.create()，是为防止 Student.prototype 的改动影响 Person.prototype
Student.prototype.construcotr = Student
Student.prototype.read = function () { }

const student = new Student("Lizhao", 100)
console.log(student) // Student {hi: "Hello, I'm Lizhao!", grade: 100}
```

#### 多重继承

JavaScript 不提供多重继承功能，但可以通过扩展构造函数的 prototype 对象来实现多重继承。

```javascript
function Manager() { }
Manager.prototype.manage = function () { }
Object.assign(Student.prototype, Manager.prototype)
```

#### class 关键字

ES6 引入了一套新的关键字来定义类，包括 class、constructor、static、extends 和 super。

**注意： ES6 中的类仍然是基于原型的，class 关键字只是语法糖。**

```javascript
class Person {
    constructor(name) {
        this.hi = `Hello, I'm ${name}!`
    }
    greet() {
        console.log(this.hi)
    }
}

class Student extends Person {
    constructor(name, grade) {
        super(name);
        this.grade = grade
    }
    read() { }
}
const student = new Student("Lizhao", 100)
console.log(student) // Student {hi: "Hello, I'm Lizhao!", grade: 100}
```

constructor 方法是一个特殊的方法，用于创建和初始化一个由 class 创建的对象。

super 关键字指向父类，可以用于在 constructor 方法内调用父类的构造函数，或者调用父类的其他函数，但不能访问父类中的属性。如果子类中定义了构造函数，那么它必须先调用 super() 才能使用 this 。

static 关键字用来定义一个类的静态属性和静态方法，静态属性和静态方法不会出现在类实例中。

extends 关键字用于创建一个类作为另一个类的一个子类。

### 常见问题

#### prototype、`__proto__`、getPrototypeOf？

prototype 对象大概是 JavaScript 中最容易混淆的名称之一。

prototype 的翻译是 “原型”。所以，你可能认为，prototype 对象指向当前对象的原型对象，其实不是。

一个对象的 prototype 对象的属性和方法，是用于被其他对象（子对象、实例）继承的，而一个对象的原型对象定义的是该对象可以从其他对象（父对象、构造函数）承继而来的属性和方法。

遵循 ECMAScript 标准，每一个对象都有一个内部 [[Prototype]] 符号，用于指向对象的原型，也就是，该对象的构造函数的 prototype 对象。

在 ES6 之前，[[Prototype]] 是通过 `__proto__` 属性来获取的。这个属性不是 ECMAScript 标准，但绝大部分浏览器都支持。

从 ES6 开始，[[Prototype]] 可以通过 `Object.getPrototypeOf()`  方法来获取，这是获取对象原型的标准方法。该方法和 `__proto__` 属性的返回是相同的。

#### 为什么要修改 A.prototype.constructor = A ？

```javascript
function Person() { }
function Student() { }
Student.prototype = Person.prototype
Student.prototype.constructor = Student
const student = new Student()
```

在原型链继承中，经常会看到类似 `Student.prototype.constructor = Student` 的代码。

为什么要这样修改呢？不修改会有什么后果呢？

事实上，就算不修改，`new Student()` 也不会有什么问题。

这一行代码的作用仅仅是，**让实例对象能够找到它真正的构造函数**。

比如，从一个实例对象生成另一个实例对象时，如果没有这行代码，会出现如下情况：

```javascript
function Person() {
    this.hi = 'Hello'
}
function Student() { }
Person.prototype = Student.prototype

const person = new Person()
console.log(person.hi) // 'Hello'。是Person的实例，有属性 hi。

const person2 = new person.constructor()
console.log(person2.hi) // undefined。不是Person的实例，所以没有属性 hi。
```

### 参考资料

[MDN - 对象原型](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object_prototypes)

[MDN - new 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)

[阮一峰 - prototype 对象](https://javascript.ruanyifeng.com/oop/prototype.html)