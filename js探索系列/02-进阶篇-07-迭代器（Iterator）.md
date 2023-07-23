## 进阶篇：迭代器（Iterator）

迭代器（Iterator），也称遍历器，是访问集合元素的一种方式，从集合的第一个元素开始访问，直到所有的元素被访问完结束。比如 JavaScript 中，for...in 循环 Object、for...of 循环 Set、map 遍历数组等。

Iterator 是 ES6 引入的一种接口，为各种不同的数据结构提供统一的遍历访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的遍历过程：

* 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

* 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。
* 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。
* 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

每一次调用 next 方法，都会返回一个迭代器。具体来说，就是返回一个包含 value 和 done 两个属性的对象。

**一句来概括：** Iterator 就是允许为所有数据结构，定义一个遍历逻辑。

本文几个重要的概念：

* 迭代：在计算机中，重复执行一个子程序（一组指令），每一次重复称为一次“迭代”，且每一次迭代得到的结果会作为下一次迭代的初始值，直到满足某条件为止。
* 迭代器： 在 JavaScript 中，是指一个包含 next() 方法的对象，且该方法返回的对象应当有 value（当前成员的值） 和 done（布尔值，表示遍历是否结束）两个属性。
* 可迭代对象：在 JavaScript 中，是指一个实现了 @@iterator 方法的对象，即，该对象必须具有一个带 Symbol.iterator 的属性。

### 迭代协议

迭代协议作为 ES6 的一组补充规范，它并不是新的内置实现或语法，而是协议。这些协议可以被任何遵循某些约定的对象来实现。

迭代协议具体分为两个协议：**可迭代协议**和**迭代器协议**。

#### 可迭代协议

可迭代协议允许 JavaScript 对象定义或定制它们的迭代行为。例如，在一个 for..of 结构中，哪些值可以被遍历到。一些内置类型是内置可迭代对象，并且有默认的迭代行为，比如 Array、Map，而其他内置类型则没有，比如  Object。

要成为可迭代对象， 一个对象必须实现 @@iterator 方法。这意味着对象（或者它原型链上的某个对象）必须有一个键为 @@iterator 的属性，可通过常量 Symbol.iterator 访问，是一个无参数的函数，其返回值为一个符合迭代器协议的对象。

```javascript
const arr1 = [1, 2, 3]
const iterator = arr1[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
// {value: 1, done: false}
// {value: 2, done: false}
// {value: 3, done: false}
// {value: undefined, done: true}
```

当一个对象需要被迭代的时候（比如，被置入一个 for...of 循环时），首先，会调用（不带参数）对象的 @@iterator 方法，然后使用此方法返回的迭代器获得要迭代的值。

在函数内部，this 关键字可用于访问可迭代对象的属性，以决定在迭代过程中提供什么。

#### 迭代器协议

迭代器协议定义了产生一系列值（无论是有限个还是无限个）的标准方式。当值为有限个时，所有的值都被迭代完毕后，则会返回一个默认返回值。

只有实现了一个拥有以下语义的 next() 方法，一个对象才能成为迭代器。

next() 方法是一个无参数的或者可以接受一个参数的函数，必须返回一个对象，该对象应当有两个属性：

* done（布尔值）： 如果迭代器可以产生序列中的下一个值，则为 false；迭代完毕，则为 true。

* value： 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。

如果返回了一个非对象值（比如，false、undefined），则会抛出一个 TypeError 异常。

### 迭代器

在 JavaScript 中，迭代器是一个对象，该对象实遵循迭代器协议，包含一个特定语义的 next() 方法，也可以包含 return() 方法和 throw() 方法。

#### next()方法

迭代器的根本特征就是具有 next() 方法，且每次调用 next() 方法，都会返回一个代表当前成员的信息对象，具有 value 和 done两个属性。

如果已经迭代到序列中的最后一个值，则 value 为 undefined、done 为 true；否则，value 为当前成员的值、done 为 false。

```javascript
function makeIterator(obj) {
    let nextIndex = 0;
    const keys = Object.keys(obj)
    return {
        next: function () {
            return nextIndex < keys.length ? {
                value: obj[keys[nextIndex++]],
                done: false
            } : {
                done: true
            };
        }
    };
}
const it = makeIterator({
    a: 1,
    b: 2
});
console.log(it.next().value); // 1
console.log(it.next().value); // 2
console.log(it.next().done);  // true
```

一旦创建，迭代器对象可以通过重复调用 next() 显式地迭代。迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能执行一次。迭代结束，next() 方法应返回 `{ done：true }`。

#### return()方法

如果 for...of 循环提前退出（通常是 throw 异常、有 break 语句），就会调用 return() 方法。

```javascript
function genIterrator(obj) {
    const keys = Object.keys(obj)
    let nextIndex = 0
    return {
        [Symbol.iterator]() {
            return {
                next: function () {
                    return nextIndex < keys.length ? {
                        value: obj[keys[nextIndex++]],
                        done: false
                    } : {
                        done: true
                    };
                },
                return() {
                    console.log('return')
                    return { done: true };
                }
            };
        }
    };
}
```

下面的两种情况会触发 return() 方法：

```javascript
const obj = {
    a: 1,
    b: 2
}
// 情况一
for (let value of genIterrator(obj)) {
    console.log(value);
    break
}
// 情况二
for (let value of genIterrator(obj)) {
    console.log(value);
    thow new Error()
}
```

#### throw()方法

主要是在 Generator 函数使用，一般的遍历器对象用不到这个方法。

throw() 是将 yield 表达式替换成一个 throw 语句。

```javascript
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
};
console.log([...myIterable]); // [1, 2]
const iterator = myIterable[Symbol.iterator]();
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.throw(new Error('出错了'))); // Uncaught Error: 出错了
console.log(iterator.next());
```

### 生成器

生成器是一个返回迭代器的函数。在 JavaScript 中，生成器函数使用 function* 语法编写。 

与迭代器一样，生成器对象的 next() 方法返回的对象，同样拥有两个属性 value 和 done。当 done 为 false 时，value 的值为生成器函数的返回值；同样的，若 done 为 true 时，value 为 undefined，且之后再执行 next() 方法，得到也一直是同一个对象。

在 JavaScript 中，生成器函数使用 `function*` 语法编写。 

```javascript
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
};
console.log([...myIterable]); // [1, 2]
const it = myIterable[Symbol.iterator]();
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

yield 关键字可以让生成器停止和开始执行，生成器函数在遇到 yield 之前会一直正常执行，遇到之后就会停止执行，同时保存当前函数作用域的状态，返回一个迭代器对象。停止执行的生成器函数，只有再次调用 next() 之后才会继续执行，直到再次遇到 yield、return、throw 或是生成器函数执行完毕。

可以根据需要多次调用该函数，并且每次都返回一个新的 Generator，但每个 Generator 只能迭代一次。

**注意：** 箭头函数不能作为生成器函数。

### 可迭代对象

若一个对象拥有迭代行为，比如可以在 for...of 中循环对象中的值，那么那个对象便是一个可迭代对象。

可迭代对象必须实现 @@iterator 方法，也就意味着，这个对象（或其原型链中的任意一个对象）必须具有一个Symbol.iterator 属性。

#### 内置可迭代对象

目前所有的内置可迭代对象如下：String、Array、TypedArray、Map 和 Set，它们的原型对象都实现了 @@iterator 方法。

**注意：** Object 不是可迭代对象。

#### 接受可迭代对象的内置 API

* new Map([iterable])
* new WeakMap([iterable])
* new Set([iterable])
* new WeakSet([iterable])
* Promise.all(iterable)
* Promise.race(iterable)
* Array.from(iterable)

#### 需要可迭代对象的语法

一些语句和表达式需要可迭代对象：

* 解构赋值
* 扩展运算符
* for...of 循环
* yield *

```javascript
[a, b, c] = new Set(["a", "b", "c"]);
a // "a"

[..."abc"]; // ["a", "b", "c"]

for(let value of ["a", "b", "c"]){
    console.log(value);
}
// "a"
// "b"
// "c"

function * gen() {
    yield * ["a", "b", "c"];
}
gen().next(); // { value: "a", done: false }
```

#### 自定义可迭代对象

以 Object 为例，将 Object 封装为可迭代对象。

```javascript
function makeIterator() { // 生成器
    const self = this
    const keys = Object.keys(self)
    let nextIndex = 0;
    return { // 迭代器
        next: function () {
            return nextIndex < keys.length ? {
                value: self[keys[nextIndex++]],
                done: false
            } : {
                done: true
            };
        }
    };
}
const obj = { // 可迭代对象
    a: 1,
    b: 2,
    [Symbol.iterator]: makeIterator
}
for (let item of obj) {
    console.log(item)
}
```

```javascript
const obj = { a: 1, b: 2, c: 3 }
function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
for (let item of entries(obj)) {
    console.log(item);
}
```

### 相关问题

#### for...in 和 for...of 有什么不同？

for...in 循环只**遍历可枚举属性**（包括自身的，以及其原型链上的可枚举属性）。像 Array、Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的不可枚举属性，例如，String 的 indexOf()  方法、Object 的 toString() 方法。

for...in 循环有几个缺点：

* 数组的键名是数字，但是 for...in 循环是以字符串作为键名，即 “0”、“1”、“2” 等等。
* for...in 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
* 某些情况下，for...in 循环会以任意顺序遍历键名。

for...of 在可迭代对象（包括 Array、Map、Set、String、TypedArray、arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句。

for...of 循环有以下优点：

* 没有 for...in 那些缺点。
* 提供了遍历所有数据结构的统一操作接口。

**for...of 的缺点：** 不能遍历不可迭代对象，比如，普通对象（即，Object）。

**总结：** for...in、for...of 都可以实现，它们之间的主要区别在不同迭代方式。for...in 语句以**任意顺序**迭代对象的可枚举属性，可用来遍历**任意对象**；而 for...of 语句遍历**可迭代对象定义要迭代的数据**，一般用来遍历**可迭代对象**。

### 参考链接

[MND - 迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%8D%8F%E8%AE%AE)

[MDN - 迭代器和生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)

[阮一峰 - Iterator 和 for...of 循环](https://es6.ruanyifeng.com/#docs/iterator)