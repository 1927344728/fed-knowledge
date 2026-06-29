## 进阶篇：Class（类）

在面向对象编程中（OOP，Object-Oriented Programming）, 一个 类定义了一个对象的特征。类是定义对象属性和方法的模板，是用来绘制具体对象实例的“蓝图”，即，用于创建对象的模板。

### 定义类

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过 class 关键字创建一个基于原型继承的具有给定名称的新类。

基本上，class 可以看作只是一个**语法糖**，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function () {};
const point = new Point(1, 2);
```

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {}
}
const point = new Point(1, 2);
console.log(Point.prototype)
// {constructor: ƒ, toString: ƒ}
// constructor: class Point
// toString: ƒ toString()
// [[Prototype]]: Object
```

**注意：** 类的内部所有定义的方法，都是不可枚举的。

```javascript
console.log(Object.keys(Point.prototype)) // []
```

实际上，类是 “特殊的函数”，就像函数表达式和函数声明一样，类语法有两个组成部分：类表达式和类声明。

#### 类声明

声明一个类，可以使用带有 class 关键字的类名。

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

**注意：** 函数声明和类声明之间的一个重要区别在于，函数声明会提升，类声明不会。也就是说，类必须先声明，然后再访问，否则将抛出异常：`Uncaught ReferenceError: Cannot access 'Point' before initialization`。

#### 类表达式

类表达式是另一种定义类的方法。类表达式可以命名或不命名。命名类表达式的名称是该类体的局部名称。

```javascript
const Point = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

**需要注意：** 类声明和类表达式的主体都执行在严格模式下。比如，构造函数、静态方法、原型方法、getter 和 setter 都在严格模式下执行。

### constructor()

constructor() 是一个特殊的方法，称为构造函数，用于创建和初始化一个由 class 创建的对象。一个类只能拥有一个名为 "constructor" 的方法。如果类包含多个 "constructor" 方法，则将抛出 一个 SyntaxError：`Uncaught SyntaxError: A class may only have one constructor`。

一个类必须有 constructor() 方法，如果没有显式定义，一个空的 constructor() 方法会被默认添加。

```javascript
class Point {}

// 等同于
class Point {
    constructor() {}
}
```

constructor() 方法默认返回实例对象（即this），也可以指定返回另外一个对象。

```javascript
// 默认返回 this
const Point = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// 也可以返回其他对象
const Point = class {
    constructor() {
        return {
            x: 10,
            y: 10
        }
    }
}
```

一个构造函数可以使用 super 关键字来调用一个父类的构造函数。

```javascript
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color;
    }
}
```

**注意：** 类和普通构造函数有个主要区别， 类必须使用 new 调用，否则会报错；而普通构造函数不用 new 也可以执行。

### 静态方法

static 关键字用来定义一个类的一个静态方法。调用静态方法不需要实例化该类，且不能通过一个类实例调用静态方法。

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static position(a, b) {
        console.log(this) // this 指向 Point 类
        return a - b
    }
}

console.log(Point.position(20, 100)) // -80
const point = new Point(10, 10)
console.log(point.position(20, 100)) // Uncaught TypeError: point.position is not a function
```

静态方法的 this 指向的是类，而不是实例。当调用静态或原型方法时没有指定 this 的值，那么方法内的 this 值将被置为 undefined。因为，class 体内部的代码总是在严格模式下执行。

```javascript
const position = Point.position
console.log(position(20, 100)) // this 指向 undefined
```

**注意：** 静态方法也是可以从 super 对象上调用的。

```javascript
class Point {
    ...
    f1 () {
        super.position(20, 100)
    }
}
```

### 实例属性

实例的属性必须定义在类的方法里。如，下方的 x、y 属性。

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

静态的或原型的数据属性必须定义在类定义的外面。

```javascript
Point.color = "#00dddd";
Point.prototype.size = 10;
```

JavaScript 标准委员会 TC39 提出**公共和私有字段声明**，这功能还是实验性（第 3 阶段）。浏览器中的支持是有限的，但是可以通过 Babel 等系统构建后使用此功能。

公有字段声明：

```javascript
class Point {
    color = "#00dddd"
	constructor() {}
}
```

私有字段声明：

```javascript
class Point {
    #x=10;
    #y=10;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }
}
```

**注意：** 私有属性的属性名必须包括 #，如果不带 #，会被当作另一个属性。

**注意：** 直接访问某个类不存在的私有属性会报错，但是访问不存在的公开属性不会报错。

### getter/setter函数

类内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class Point {
    constructor() {}
    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: '+ value);
    }
}

const point = new Point();
point.prop = 1; // 'setter: 1'
point.prop      // 'getter'
```

存值函数和取值函数是设置在属性的属性描述对象上。

### Class 的继承

面向对象程序设计中最重要的一个概念是继承。

继承允许依据另一个类来定义一个类。也就是说，当创建一个类时，不需要重新编写新的数据成员和成员函数，只需指定新建的类继承了一个已有的类的成员即可。这个已有的类称为基类（父类），新建的类称为派生类（子类）。

继承达到了重用代码功能和提高执行效率的效果，使得创建和维护一个应用程序变得更容易。

#### extends关键字

class 可以通过 extends 关键字实现继承，让子类继承父类的属性和方法。extends 的写法比 ES5 的原型链继承，要清晰和方便很多。

```javascript
const Point = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    move () {}
}
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color;
    }
}
```

#### super关键字

**super 可以当作函数使用，也可以当作对象使用。**

当作函数使用时，用于在子类调用父类的构造函数。

ES6 规定，子类必须在 constructor() 方法中调用 super()，否则就会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。如果不调用 super() 方法，子类就得不到自己的 this 对象。

如果子类没有定义 constructor() 方法，这个方法会默认添加，并且里面会调用 super()。也就是说，不管有没有显式定义，任何一个子类都有 constructor() 方法。

```javascript
class ColorPoint extends Point {}

// 相当于
class ColorPoint extends Point {
    constructor(x, y) {
        super(x, y)
    }
}
```

**注意：** super 作为函数时，只能用在子类的构造函数之中，用在其他地方就会报错。

另外，super 也可以当作对象使用。当作对象使用时，需注意以下问题：

* 子类的普通方法中，super 指向**父类的原型对象**。
* 子类的普通方法中，通过 super 对象调用父类的方法时，方法内部的 this 指向当前的**子类实例**。
* 子类的静态方法中，super 指向**父类**。
* 子类的静态方法中，通过 super 对象调用父类的方法时，方法内部的 this 指向当前的**子类**。

```javascript
class ColorPoint extends Point {
    normalFn () {
        return super.move === Point.prototype.move
    }
    static staticFn () {
        return super.name === Point.name
    }
}
console.log(new ColorPoint().normalFn()) // true
console.log(ColorPoint.staticFn()) // true
```

**注意：** 在子类使用 super 时，后面必须跟一个参数列表或成员访问。 也就是说，必须显式指定是作为函数（`super()`）、还是作为对象使用（`super.xxx`），否则会报错。

```javascript
class ColorPoint extends Point {
    move () {
        console.log(super)
    }
}
console.log(new ColorPoint().console())
// Uncaught SyntaxError: 'super' keyword unexpected here
```

#### 私有属性和私有方法的继承

父类所有的属性和方法，都会被子类继承，除了私有的属性和方法。

```javascript
const Point = class {
    #x = 10
    #move() { }
}
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.#x
        this.#move()
    }
}
// Uncaught SyntaxError: Private field '#x' must be declared in an enclosing class
// Uncaught SyntaxError: Private field '#move' must be declared in an enclosing class 
```

#### 静态属性和静态方法的继承

父类的静态属性和静态方法，会被子类继承。

```javascript
const Point = class {
    static defaultX = 10
    static defaultPoint = {
        x: 10,
        y: 10
    }
    static move() {
        console.log('move')
    }
}
class ColorPoint extends Point { }
console.log(ColorPoint.move())
```

**注意：** 静态属性的继承通过**浅拷贝**实现的。也就是说，如果父类的静态属性的值是一个对象，那么子类的静态属性也会指向这个对象。子类修改对象的属性，会影响父类。

```javascript
ColorPoint.defaultPoint.x = 100
console.log(Point.defaultPoint.x)
```

### class 相关的一些属性和方法

#### new.target属性

new 是从构造函数生成实例对象的命令。ES6 为 new 命令引入了一个 new.target 属性，该属性一般用在构造函数之中，返回 new 命令作用于的那个构造函数。如果构造函数不是通过 new 命令或 Reflect.construct() 调用的，new.target 会返回 undefined，因此这个属性可以用来确定构造函数是怎么调用的。

```javascript
class Point {
    constructor() {
        console.log(new.target === Point)
    }
}
console.log(new Point()) // true
```

#### getPrototypeOf()

Object.getPrototypeOf() 方法用来从子类上获取父类，可用于判断一个类是否继承了另一个类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point
```

#### prototype、`__proto__`

大多数浏览器的 ES5 实现之中，每一个对象都有 `__proto__` 属性，指向对应的构造函数的 prototype 属性。Class 作为构造函数的语法糖，同时有 prototype 属性和 `__proto__` 属性，因此同时存在两条继承链。

（1）子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。

（2）子类 prototype 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的prototype属性。

### 相关问题

####  JavaScript 是面向对象还是面向过程编程语言？

**面向过程编程**是一种编程范式或编程风格。它以过程（可以理解为方法、函数、操作）作为组织代码的基本单元，以数据（可以理解为成员变量、属性）与方法相分离为最主要的特点。

**面向过程风格**是一种流程化的编程风格，通过拼接一组顺序执行的方法来操作数据完成一项功能，它最大的特点是不支持类和对象两个语法概念，不支持丰富的面向对象编程特性（比如继承、多态、封装）。

**面向对象编程**是把计算机程序视为一组对象的集合，而每个对象都可以接收其他对象发过来的消息，并处理这些消息，计算机程序的执行就是一系列消息在各个对象之间传递。

对于大规模复杂程序的开发，程序的处理流程并非单一的一条主线，而是错综复杂的网状结构。

面向对象编程相比面向过程编程，具有更加丰富的特性（封装、抽象、继承、多态）。利用这些特性编写出来的代码，更加易扩展、易复用、易维护。

**总结：** 面向对象编程语言比起面向过程编程语言，更加人性化、更加高级、更加智能。

**JavaScript 是一种高级的、解释型的编程语言，是一门基于原型、函数先行的语言，是一门多范式的语言，它支持面向对象编程，命令式编程，以及函数式编程。**

JavaScript 的对象设计跟目前主流基于类的面向对象差异非常大。而事实上，这样的对象系统设计虽然特别，但是 JavaScript 提供了完全运行时的对象系统，这使得它可以模仿多数面向对象编程范式，所以它也是正统的面向对象语言。

#### 为什么子类的构造函数，一定要调用 super()？

原因就在于 ES6 的继承机制，与 ES5 完全不同。ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即 “实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即 “继承在前，实例在后”。

这就是为什么 ES6 的继承必须先调用 super() 方法，因为这一步会生成一个继承父类的 this 对象，没有这一步就无法继承父类。同理，在子类的构造函数中，只有调用 super() 之后，才可以使用 this 关键字，否则会报错。

**这意味着**，新建子类实例时，父类的构造函数必定会先运行一次。

### 参考链接

[MDN - Class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)

[阮一峰 Class 的继承](https://wangdoc.com/es6/class-extends.html)