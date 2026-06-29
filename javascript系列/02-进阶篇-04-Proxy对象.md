## 进阶篇：Proxy对象

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用、new 操作符等）。

```javascript
const MyProxy = new Proxy(target, handler)
```

* MyProxy： `new Proxy()` 返回的 Proxy 实例。
* target： 使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组、函数、甚至另一个代理）。
* handler： 一个以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时的代理行为。

Proxy 原意是 "代理"，表示由它来 “代理” 目标对象的某些操作。

### Proxy 静态方法

##### revocable()

用来创建一个可撤销的代理对象。

```javascript
Proxy.revocable(target, handler);
```

返回一个包含了代理对象本身和它的撤销方法的可撤销 Proxy 对象。

```javascript
const revocable = Proxy.revocable({}, {
    get(target, name) {
        return "[[" + name + "]]";
    }
});
console.log(revocable)
// {proxy: Proxy, revoke: ƒ}
// proxy: Proxy {}
// revoke: ƒ ()
// [[Prototype]]: Object
```

* proxy： 表示新生成的代理对象本身，和用一般方式 `new Proxy(target, handler)` 创建的代理对象没什么不同，只是它可以被撤销掉。
* revoke： 撤销方法，调用的时候不需要加任何参数，就可以撤销掉和它一起生成的那个代理对象。

一旦某个代理对象被撤销，它将变得几乎完全不可调用，在它身上执行任何的可代理操作都会抛出 TypeError 异常（注意，可代理操作一共有 14 种，执行这 14 种操作以外的操作不会抛出异常）。

一旦被撤销，这个代理对象便不可能被直接恢复到原来的状态，同时和它关联的目标对象以及处理器对象都有可能被垃圾回收掉。再次调用撤销方法 revoke() 则不会有任何效果，但也不会报错。

```javascript
const proxy = revocable.proxy;
console.log(proxy.foo); // "[[foo]]"

revocable.revoke();
console.log(proxy.foo);   // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
proxy.foo = 1             // Uncaught TypeError: Cannot perform 'set' on a proxy that has been revoked
delete proxy.foo          // Uncaught TypeError: Cannot perform 'deleteProperty' on a proxy that has been revoked
console.log(typeof proxy) // 'object'。因为 typeof 不属于可代理操作
```

### handler对象的方法（13个）

handler 对象是一个容纳一批特定属性的占位符对象。每个属性代表一个捕获器，这些捕获器都是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为。

##### get()

用于代理对象的**读取**属性操作，可以返回任何值。

```javascript
const MyProxy = new Proxy(target, {
    get: function(target, property, receiver) {}
});
```

以下操作会触发该代理：

* 访问属性：MyProxy[prop] 和 MyProxy.prop；
* 访问原型链上的属性：Object.create(MyProxy)[prop]；
* Reflect.get()。

违反以下约束会抛出 TypeError 异常：

* 如果要访问的目标属性是不可写以及不可配置的，则返回的值必须与该目标属性的值相同。
* 如果要访问的目标属性没有配置访问方法，即 get 捕获器没有处理，则返回值必须为 undefined。

##### set()

用于代理对象的**设置**属性操作。其返回值应当为一个布尔值，返回 true 代表属性设置成功。

```javascript
const MyProxy = new Proxy(target, {
    set: function(target, property, value, receiver) {}
});
```

以下操作会触发该代理：

* 指定属性值：MyProxy[prop] = value、MyProxy.prop = value。
* 指定继承者的属性值：Object.create(MyProxy)[prop] = value。
* Reflect.set()

违反以下约束会抛出 TypeError 异常：

* 若目标属性是一个不可写及不可配置的数据属性，则不能改变它的值。
* 如果目标属性没有配置存储方法，即 set 捕获器没有处理，则不能设置它的值。
* 在严格模式下，返回值为 false，也会抛出一个 TypeError 异常。

##### has()

用于代理对象的 **in 操作符**。其返回值是一个布尔值。

```javascript
const MyProxy = new Proxy(target, {
    has: function(target, prop){}
});
```

以下操作会触发该代理：

* 属性查询：prop in MyProxy；
* 继承属性查询：prop in Object.create(MyProxy)；
* with 检查: with(MyProxy) { (prop); }；
* Reflect.has()。

违反以下约束会抛出 TypeError 异常：

* 如果目标对象的某一属性本身不可被配置，则该属性不能够被代理隐藏。
* 如果目标对象为不可扩展对象，则该对象的属性不能够被代理隐藏

##### getPrototypeOf()

当**读取**代理对象的原型时，该方法就会被调用。即，Object.getPrototypeOf() 方法的捕获器。其返回值必须是一个对象或者 null。

```javascript
const MyProxy = new Proxy(obj, {
    getPrototypeOf(target) {
        return null
    }
});
```

以下五种操作会触发：

- Object.getPrototypeOf()；
- Reflect.getPrototypeOf()；
- `__proto__`；
- Object.prototype.isPrototypeOf()；
- instanceof。

以下两种情况会抛出 TypeError 异常：

* getPrototypeOf() 方法返回的不是对象也不是 null。
* 目标对象是不可扩展的，且 getPrototypeOf() 方法返回的原型不是目标对象本身的原型。

##### setPrototypeOf()

当**设置**代理对象的原型时，该方法就会被调用。即，Object.setPrototypeOf() 方法的捕获器。如果成功修改，则返回 true，否则返回 false。

```javascript
const MyProxy = new Proxy(target, {
    setPrototypeOf: function(target, prototype) {}
});
```

这两种操作会触发该代理：Object.setPrototypeOf()、Reflect.setPrototypeOf()。

当目标对象是不可扩展的，且原型参数与 Object.getPrototypeOf(target) 的值不同时，会抛出 TypeError 异常。

##### defineProperty()

用于代理对象的 Object.defineProperty() 方法。其返回值必须是一个布尔值，表示定义该属性的操作成功与否。

```javascript
const MyProxy = new Proxy(target, {
    defineProperty: function(target, property, descriptor) {}
});
```

这两种操作会触发该代理：Object.defineProperty()、Reflect.defineProperty()。

违反以下情况会抛出 TypeError 异常：

* 如果目标对象不可扩展，将不能添加属性。
* 如果属性不作为一个目标对象的不可配置的属性存在的话，则不能添加或者修改其为不可配置的。
* 如果目标对象存在一个对应的可配置属性，这个属性可能不会是不可配置的。
* 如果一个属性在目标对象中存在对应的属性，那么 Object.defineProperty(target, prop, descriptor) 将不会抛出异常。
* 在严格模式下，defineProperty() 方法返回 false，将会抛出 TypeError 异常。

##### deleteProperty()

用于代理对象的**删除**属性操作。其返回值必须是一个布尔值，表示了该属性是否被成功删除。

如果该方法抛出错误或者返回 false，当前属性就无法被 delete 命令删除。

```javascript
const MyProxy = new Proxy(target, {
    deleteProperty: function(target, property) {}
});
```

以下操作会触发该代理：

* 删除属性：delete MyProxy[prop] 和 delete MyProxy.prop；
* Reflect.deleteProperty()。

违反以下约束会抛出 TypeError 异常：

* 如果目标对象的属性是不可配置的，那么该属性不能被删除。

##### ownKeys()

用于代理对象**自身属性的读取**操作。其返回值必须是一个可枚举对象。

```javascript
const MyProxy = new Proxy(target, {
    ownKeys: function(target) {}
});
```

以下操作会触发该代理：

* Object.getOwnPropertyNames()；
* Object.getOwnPropertySymbols()；
* Object.keys()；
* Reflect.ownKeys()。

违反以下约束会抛出 TypeError 异常：

* 返回值必须是一个可枚举对象。
* 返回值的元素类型要么是一个 String ，要么是一个 Symbol。
* 返回值必须包含目标对象的所有不可配置（non-configurable ）、自有（own）属性的 key。
* 如果目标对象不可扩展，那么返回值必须包含目标对象的所有自有属性的 key，不能有其它值。

##### getOwnPropertyDescriptor()

用于代理对象的 Object.getOwnPropertyDescriptor() 方法。其返回值必须是一个对象或 undefined。

```javascript
const MyProxy = new Proxy(target, {
    getOwnPropertyDescriptor: function(target, prop) {}
});
```

这两种操作会触发该代理：Object.getOwnPropertyDescriptor()、Reflect.getOwnPropertyDescriptor()。

违反以下约束会抛出 TypeError 异常：

* 返回值必须是一个对象 或 undefined。
* 如果属性作为目标对象的不可配置的属性存在，则该属性无法报告为不存在。
* 如果属性作为目标对象的属性存在，并且目标对象不可扩展，则该属性无法报告为不存在。
* 如果属性不存在作为目标对象的属性，并且目标对象不可扩展，则不能将其报告为存在。
* 如果属性不作为目标对象的自身属性存在，或者作为目标对象的可配置的属性存在，那么属性不能被报告为不可配置。
* Object.getOwnPropertyDescriptor(target) 的结果可以使用 Object.defineProperty() 方法应用于目标对象，也不会抛出异常。

##### apply()

用于代理函数的调用、call 和 apply 操作，可以返回任何值。

```javascript
const MyProxy = new Proxy(target, {
    apply: function(target, thisArg, argumentsList) {}
});
```

```javascript
const func = function () {
    return '目标函数';
}
const MyProxy = new Proxy(func, {
    apply: function () {
        return '代理';
    }
});
MyProxy() // '代理'
```

以下操作会触发该代理：

* MyProxy(...args)；
* Function.prototype.apply() 和 Function.prototype.call()；
* Reflect.apply()。

违反以下约束会抛出 TypeError 异常：

* target 必须是可被调用的。也就是说，它必须是一个函数对象。

##### construct()

用于代理对象的 **new 操作符**。其返回值必须是一个对象。

```javascript
const MyProxy = new Proxy(target, {
    construct: function(target, argumentsList, newTarget) {}
});
```

以下操作会触发该代理：

* new MyProxy(...args)；
* Reflect.construct()。

违反以下约束会抛出 TypeError 异常：

* target 必须是可被调用的。也就是说，它必须是一个函数对象。

##### isExtensible()

用于代理对象的 Object.isExtensible() 方法。其返回值必须是一个布尔值或可转换成布尔值的值。

```javascript
const MyProxy = new Proxy(target, {
    isExtensible: function(target) {}
});
```

这两种操作会触发该代理：Object.isExtensible()、Reflect.isExtensible()。

当 Object.isExtensible(proxy) 与 Object.isExtensible(target) 返回值不同时，会抛出 TypeError 异常。

##### preventExtensions()

用于代理对象的 Object.preventExtensions() 方法。其返回值必须是一个布尔值或可转换成布尔值的值。

```javascript
const MyProxy = new Proxy(target, {
    preventExtensions: function(target) {}
});
```

这两种操作会触发该代理：Object.preventExtensions()、Reflect.preventExtensions()。

当目标对象是可扩展的，那么只能返回 false，否则会抛出 TypeError 异常。

### 相关问题

##### Proxy 的 this 指向

Proxy 代理的情况下，目标对象内部的 this 会指向 Proxy 代理。这与不做代理的情况下，目标对象的 this 指向行为不一致。

```javascript
const target = {
    m: function () {
        console.log(this === proxy);
    }
};
const proxy = new Proxy(target, {});

target.m() // false
proxy.m()  // true
```

### 参考链接

[MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

