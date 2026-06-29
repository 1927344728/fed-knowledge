## 进阶篇：Reflect对象

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 Proxy 对象中的 handlers 对象中的的方法相同。

与大多数全局对象不同，Reflect 并非一个构造函数，所以不能通过 new 运算符对其进行调用，或者将 Reflect 对象作为一个函数来调用。Reflect 的所有属性和方法都是静态的。

### Reflect静态方法（13个）

Reflect 对象一共有 13 个静态方法，大部分与 Object 对象的同名方法的作用相同，而且与 Proxy 对象的方法是一一对应的。

##### get()

用于**读取**目标对象的属性，类似于 target[name]。

##### set()

用于**设置**目标对象的属性，返回一个布尔值表明是否成功设置属性。

```javascript
Reflect.set(target, propertyKey, value[, receiver])
```

如果遇到 setter，receiver 则为 setter 调用时的 this 值。

##### has()

判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。

```javascript
Reflect.has(target, propertyKey)
```

##### getPrototypeOf()

与 Object.getPrototypeOf() 方法几乎是一样的，都是返回指定对象的原型（即内部的 [[Prototype]] 属性的值）。

```javascript
Reflect.getPrototypeOf(target)
```

##### setPrototypeOf()

与 Object.setPrototypeOf() 方法是一样的，用于设置对象的原型（即内部的 [[Prototype]] 属性）为另一个对象或 null，如果操作成功返回 true，否则返回 false。

```javascript
Reflect.setPrototypeOf(target, prototype)
```

如果 target 不是 Object ，或 prototype 既不是对象也不是 null，抛出一个 TypeError 异常。

##### defineProperty()

基本等同于 Object.defineProperty() 方法，唯一不同是返回的是布尔值。

```javascript
Reflect.defineProperty(target, propertyKey, attributes)
```

##### deleteProperty()

用于**删除**目标对象的属性，与 delete 操作符（delete target[propertyKey]）很像，只是它是一个函数，返回一个布尔值，表明该属性是否被成功删除。

```javascript
Reflect.deleteProperty(target, propertyKey)
```

##### ownKeys()

返回一个由目标对象自身的属性键（不包含继承属性）组成的数组，其返回值等同于：

```javascript
Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
```

##### getOwnPropertyDescriptor()

 与 Object.getOwnPropertyDescriptor() 方法相似。如果属性在对象中存在，则返回给定的属性的属性描述符。否则返回 undefined。

```javascript
Reflect.getOwnPropertyDescriptor(target, propertyKey)
```

##### apply()

通过指定的参数列表发起对目标函数的调用，返回值是调用指定参数和 this 值的目标函数的返回结果。与 Function.prototype.apply() 方法类似。

```javascript
Reflect.apply(target, thisArgument, argumentsList)
```

参数说明：

* target： 目标函数；
* thisArgument： 目标函数调用时绑定的 this 对象；
* argumentsList： 目标函数调用时传入的实参列表，该参数应该是一个类数组的对象。

```javascript
Reflect.apply(Math.floor, undefined, [1.75]);
// 1
Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]);
// 'hello'，等价于 String.fromCharCode(104, 101, 108, 108, 111)
Reflect.apply(RegExp.prototype.exec, /ab/, ["confabulation"])
// 4，等价于 /ab/.exec("confabulation").index
Reflect.apply("".charAt, "ponies", [3]);
// 'i'，等价于 "ponies".charAt(3)
```

##### construct()

对构造函数进行 new 操作，返回目标构造函数的实际。相当于执行 new target(...args)。

```javascript
Reflect.construct(target, argumentsList[, newTarget])
```

参数说明：

* target： 被运行的目标构造函数；
* argumentsList： 类数组，目标构造函数调用时的参数。
* newTarget（可选）： 作为新创建对象的原型对象的 constructor 属性，默认值为目标构造函数。

```javascript
const obj1 = new Foo(...args);
const obj2 = Reflect.construct(Foo, args);
```

Reflect.construct() 和 Object.create() 方法的区别：

在 Reflect 出现之前，是通过明确指定构造函数和原型对象（使用 Object.create()）来创建一个对象的。

```javascript
function OneClass() {
    this.name = 'one';
}
function OtherClass() {
    this.name = 'other';
}

const obj1 = Reflect.construct(OneClass, [], OtherClass);
const obj2 = Object.create(OtherClass.prototype);
OneClass.apply(obj2, []);
// 以上两种方法是等效的
```

两种方式结果相同，但在创建对象过程中仍一点不同：使用 Object.create() 和 Function.prototype.apply() 时，如果不使用 new 操作符调用构造函数，构造函数内部的 new.target 值会指向 undefined；而调用Reflect.construct() 来创建对象，new.target 值会自动指定到 target（或者 newTarget）。

##### isExtensible()

判断一个对象是否可扩展，与 Object.isExtensible() 方法相似，但有一些不同：

如果该方法的第一个参数不是一个对象，那么将造成一个 TypeError 异常。对于 Object.isExtensible() 方法，非对象的第一个参数会被强制转换为一个对象。

```javascript
Reflect.isExtensible(1) // Uncaught TypeError: Reflect.isExtensible called on non-object
Object.isExtensible(1) // false
```

##### preventExtensions() 

阻止新属性添加到对象，与 Object.preventExtensions() 方法相似，但有一些不同：

如果该方法的第一个参数不是一个对象，那么将造成一个 TypeError 异常。 对于 Object.preventExtensions() 方法，非对象的第一个参数会被强制转换为一个对象。

```javascript
Reflect.preventExtensions(1) // Uncaught TypeError: Reflect.preventExtensions called on non-object
Object.preventExtensions(1)  // 1
```

### 比较 Reflect 和 Object 方法

ES2015 中引入的 Reflect 对象是一个内置对象，提供了与 JavaScript 对象交互的方法。Reflect 上存在的一些静态函数也对应于 ES2015 之前的 Object 上可用的方法。尽管某些方法在行为上看似相似，但它们之间常常存在细微的差异。

| 方法名                        | Object                                                       | Reflect                                                      |
| :---------- | :-------------------- | :-------------------- |
| defineProperty()              | 如果在对象上定义了属性，则返回传递给函数的对象，否则返回 TypeError。 | 如果在对象上成功定义了属性，则返回 true，否则返回 false。 |
| defineProperties()          | 如果未在对象上成功定义属性，则返回`TypeError`。              | -                                                         |
| set()                       | -                                                          | 如果在对象上成功设置了属性，则返回 true，否则返回 false 。<br />如果第一个参数不是对象（原始值），则抛出 TypeError。 |
| get()                       | -                                                          | 如果第一个参数不是对象（原始值），则抛出 TypeError。 |
| deleteProperty()            | -                                                          | 如果属性从对象中删除，则返回 true ，否则返回 false。 |
| getOwnPropertyDescriptor()  | 如果给定属性存在于对象上，则返回属性的属性描述符，如果不存在，则返回 undefined。 | 如果给定属性存在于对象上，则返回属性的属性描述符，如果不存在，则返回 undefined。<br />如果第一个参数不是对象（原始值），则抛出 TypeError。 |
| getOwnPropertyDescriptors() | 如果传入的对象没有拥有的属性描述符，则返回一个空对象。 | -                                                         |
| getPrototypeOf()            | 如果第一个参数不是对象（原始值），在 ES5 中抛出 TypeError，但在 ES2015 中强制为非对象。 | 如果第一个参数不是对象（原始值），则抛出 TypeError。 |
| setPrototypeOf()            | 如果对象的原型设置成功，则返回对象本身。<br />如果设置的原型不是 Object 或 null，或者被修改的对象的原型不可扩展，则抛出TypeError。 | 如果在对象上成功设置了原型，则返回 true，否则返回 false。<br />如果传入的目标不是Object，或者设置的原型不是 Object 或null，则抛出 TypeError。 |
| isExtensible()              | 如果参数不是对象（原始值），则在 ES5 中抛出 TypeError。在 ES2015 中，它将被强制为不可扩展的普通对象并返回 false。 | 如果参数不是对象（原始值），则抛出 TypeError。 |
| preventExtensions()         | 返回被设为不可扩展的对象<br />如果参数不是对象（原始值），则在 ES5 中抛出`TypeError`。在 ES2015 中，参数如为不可扩展的普通对象，然后返回对象本身。 | 如果对象已变得不可扩展，则返回 true，否则返回 false。<br />如果参数不是对象（原始值），则抛出 TypeError。 |
| keys()                      | 如果目标不是对象，则在 ES5 中抛出`TypeError`，但在 ES2015 中将非对象目标强制为的对象。 | -                                                          |
| ownKeys()                  | -                                                            | 如果参数不是对象（原始值），则抛出 TypeError。               |

### 相关问题

#### 为什么新增 Reflect 对象？

* 将 Object 对象的一些明显属于语言内部的方法（如，Object.defineProperty），放到 Reflect 对象上。目前，某些方法同时存在 Object 和 Reflect 对象上，未来的新方法将只在 Reflect 对象上。

* 修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc) 在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc) 则会返回 false。
* 让 Object 操作都变成函数行为。比如，`name in obj` 和 `delete obj[name]`，而 Reflect.has(obj, name) 和 Reflect.deleteProperty(obj, name) 方法让它们变成函数行为。
* Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。

### 参考链接

[MDN - Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

[阮一峰 ECMAScript 6 入门 - Reflect](https://es6.ruanyifeng.com/#docs/reflect)