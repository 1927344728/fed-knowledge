## 深入理解JavaScript的浅拷贝和深拷贝

JavaScript具有自动垃圾回收机制，所以对于前端开发来说，内存空间并不是一个经常被提及的概念。在JS引擎中，每一个变量都需要一个内存空间，内存空间主要有两种类型：**堆内存和栈内存**。

### 什么是堆栈？

对于开发人员而言，或多或少都会接触过堆跟栈的概念。

- 对于数据结构而言：

  * **栈是一种运算受限的线性表**，其限制是指只仅允许在表的一端进行插入和删除操作，这一端被称为栈顶（Top），相对地，把另一端称为栈底（Bottom）。把新元素放到栈顶元素的上面，使之成为新的栈顶元素称作进栈、入栈或压栈（Push）；把栈顶元素删除，使其相邻的元素成为新的栈顶元素称作出栈或退栈（Pop）。这种受限的运算使栈拥有 **先进后出** 的特性（First In Last Out），简称FILO。

  * **堆是一种常用的树形结构，是一种特殊的完全二叉树**，当且仅当满足所有节点的值总是不大于或不小于其父节点的值的完全二叉树被称之为堆。堆的这一特性称之为堆序性。堆一般也称作 Priority Queue （即优先队列）。

    在一个堆中，根节点是最大（或最小）节点。如果根节点最小，称之为小顶堆（或小根堆），如果根节点最大，称之为大顶堆（或大根堆）。堆的左右孩子没有大小的顺序。

- 对于计算机存储而言： 堆与栈是两种不同的内存管理，属于内存空间的一段区域。

#### 堆(Heap)

堆区内存一般由程序员分配释放，若程序员不释放，程序结束时可能由垃圾回收机制回收。

堆区内存使用二级缓存。

局部环境中，函数执行完成后，函数局部环境声明的变量不再需要时，就会被垃圾回收销毁（理想的情况下，闭包会阻止这一过程）。

全局环境中，只有页面退出时才会出栈，解除变量引用。所以开发者应尽量避免在全局环境中创建全局变量，如需使用，也要在不需要时手动标记清除，将其内存释放掉。

* **堆区内存存储引用数据类型**： 如，Object, Array, Date, RegExp, Function等。**引用数据类型**在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

  堆内存中变量实际上是一个指向堆内存地址的指针。每个空间大小不一样，要根据情况开进行特定的分配。

* **堆内存中变量的值是可变的**

* **堆内存中变量的比较是内存地址的比较**

JavaScript 中有自动垃圾回收机制，会通过标记清除的算法识别哪些变量对象不再使用，对其进行销毁。开发者也可在代码中手动**设置变量值为 null 进行标记清除**。

#### 栈(Stack)

栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等，其操作方式类似于数据结构中的栈。

栈区内存使用一级缓存，**它的访问效率会高一些**。

* **栈区内存存储基本数据类型**： 如，undefined，boolean，number，string，null 以及对象变量的指针。

* 栈内存中数据大小确定，内存空间大小可以分配，是**按值存储的，可以直接访问**。

  > 当我们定义一个const对象的时候，我们说的常量其实是指针，就是const对象对应的堆内存指向是不变的，但是堆内存中的数据本身的大小或者属性是可变的。

* **栈内存中变量的值是不可变的**

  动态修改了基本数据类型的值，它的原始值也是不会改变的。例如：

  ```js
  var str = "abc"
  str[1] = 'ddd' //返回值：ddd
  console.log(str)  //其原始值还是：abc
  ```

* **栈内存中变量的比较是值的比较**

> **为什么会有栈内存和堆内存之分？**
>
> 通常与垃圾回收机制有关。为了使程序运行时占用的内存最小。
>
> 当一个方法执行时，每个方法都会建立自己的内存栈，在这个方法内定义的变量将会逐个放入这块栈内存里，随着方法的执行结束，这个方法的内存栈也将自然销毁了。因此，**所有在方法中定义的变量都是放在栈内存中的**。
>
> 当创建一个对象时，这个对象将被保存到堆内存中，以便反复利用（因为对象的创建成本通常较大）。堆内存中的对象不会随方法的结束而销毁，即使方法结束后，这个对象还可能被另一个引用变量所引用（方法的参数传递时很常见），则这个对象依然不会被销毁。**只有当一个对象没有任何引用变量引用它时，才会被销毁。**

### 赋值和浅拷贝、深拷贝的区别

#### 赋值（=）

在我们进行赋值操作的时候，基本数据类型的赋值（=）是在内存中新开辟一段栈内存，然后再将**值赋值**到新的栈中。所以说，基本类型的赋值的两个变量是**两个独立相互不影响的变量。**

而引用类型的赋值（=）是将对象保存在栈内存的**地址赋值**到新变量，拷贝的是对象的引用，而不是对象本身。新变量和原变量指向的是同一个对象，因此**两者之间操作互相有影响**。

```js
let objA = {
    a: 'abc',
    b: '123'
}
let objB = objA
objB.a = 'xyz'

//将objA赋值给objB，它们仍指向同一对象。objB改变属性a，objA同样会改变。
console.log(objA) //{a: "xyz", b: "123"}
```

#### 浅拷贝和深拷贝

浅拷贝和深拷贝是对引用类型的数据（对象）而言。它们会创建一个新的对象，会开辟一块新的内存空间，将原对象的属性的值拷贝过来。拷贝结束之后，内存中的值是完全相同的，但是内存地址是不一样的，**两个对象之间相互不影响，也互不干涉。**

**浅拷贝：**只会将对象的各个属性进行依次拷贝，并不会进行递归拷贝，也就是说只会对对象的第一层属性进行拷贝。

**深拷贝：**不同于浅拷贝，它不但拷贝目标对象的第一层属性，而且还递归拷贝目标对象的所有属性。



### 浅拷贝的实现方法

浅拷贝测试用例：

```js
let objA = {
    a: 'abc',
    b: '123',
    c: {
      d: 'ddd',
      e: 'eee',  
    },
    [Symbol()]: {
        f: 'fff',
        g: 'ggg'
    },
    get m () { return 1 }
}
Object.defineProperty(objA, 'h', {
    value: 4,
    enumerable: false
})
```

#### for...in循环

```js
function shallowCopy1 (obj) {
	if (typeof obj !== 'object') {
		return
	}
	let newObj = obj.constructor === Array ? [] : {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			newObj[key] = obj[key]
		}
	}
	return newObj
}

shallowCopy1(objA)
// 输出结果为
// a: "abc"
// b: "123"
// c: {d: "ddd", e: "eee"}
// m: 1
```

该方法无法正确拷贝以下属性：

* **Symbol**：`Symbol`是ES6中引入的原始数据类型。`Symbol`值通过`Symbol`函数生成，是独一无二的。ES6中规定了对象的属性名有两种类型，一种是字符串，另一种就是 `Symbol` 类型。

* **不可枚举属性**
* **属性描述符**

我们来列举一下，可以获取对象键名的方法：

|              方法              | 自身属性 | 继承属性 | 可枚举 | 不可枚举 | Symbol属性 |
| :----------------------------: | :------: | :------: | :----: | :------: | :--------: |
|            for...in            |    ✓     |    ✓     |   ✓    |    X     |     X      |
|         Object.keys()          |    ✓     |    X     |   ✓    |    X     |     X      |
|  Object.getOwnPropertyNames()  |    ✓     |    X     |   ✓    |    ✓     |     X      |
| Object.getOwnPropertySymbols() |    ✓     |    X     |   X    |    X     |     ✓      |
|       Reflect.ownKeys()        |    ✓     |    X     |   ✓    |    ✓     |     ✓      |

- `for...in`：循环遍历对象自身的和继承的可枚举属性（不含 `Symbol` 属性）。
- `Object.keys()`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 `Symbol` 属性）的键名。
- `Object.getOwnPropertyNames()`返回一个数组，包含对象自身的所有属性（不含 `Symbol` 属性，但是包括不可枚举属性）的键名。
- `Object.getOwnPropertySymbols()`返回一个数组，包含对象自身的所有 `Symbol` 属性的键名。
- `Reflect.ownKeys()`返回一个数组，包含对象自身的所有键名，不管键名是 `Symbol` 或字符串，也不管是否可枚举。

将上面方法改成遍历`Reflect.ownKeys()`返回的数组：

```js
//修改后，可遍历对象自身的所有键名。不含继承、不含属性描述符
function shallowCopy2 (obj) {
	if (typeof obj !== 'object') {
		return
	}
	let newObj = obj.constructor === Array ? [] : {}
	Reflect.ownKeys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
			newObj[key] = obj[key]
		}
    })
	return newObj
}
shallowCopy2(objA)
// 输出结果为
// a: "abc"
// b: "123"
// c: {d: "ddd", e: "eee"}
// h: 4
// m: 1
// Symbol(): {f: "fff", g: "ggg"}
```

该方法可以正确拷贝Symbol属性、不可枚举属性，但**仍无法正确拷贝继承属性、属性描述符**。

再来了解下这两个方法：

* `Object.getPrototypeOf`方法返回参数对象的原型。这是获取原型对象的标准方法。

* ES6引入了`Object.getOwnPropertyDescriptors`方法，返回指定对象所有自身属性（非继承属性）的描述对象

我们可以用Object.create()，根据对象的原型链和属性描述符生成新对象：

```js
function shallowCopy3 (obj) {
    return Object.create(
        Object.getPrototypeOf(objA), 
        Object.getOwnPropertyDescriptors(objA) 
    )
}
shallowCopy3(objA)

// 输出结果为
// a: "abc"
// b: "123"
// c: {d: "ddd", e: "eee"}
// m: 1
// Symbol(): {f: "fff", g: "ggg"}
// h: 4
// get m: ƒ m()
```

该方法成功拷贝了Symbol属性、不可枚举属性、属性描述符，**但仍无法拷贝承继属性**。



#### Object.assign() 

`Object.assign`拷贝的属性是有限制的，只拷贝源对象的自身属性（包含Symbol），不包含继承属性，也不包含不可枚举的属性。

ES6扩展运算符的结果与`Object.assign()` 的相同。

```js
Object.assign({}, objA)
{ ...objA }

// a: "abc"
// b: "123"
// c: {d: "ddd", e: "eee"}
// m: 1
// Symbol(): {f: "fff", g: "ggg"}
```

#### 数组的浅拷贝

```js
let arrA = [1, 2, 3]

//concat方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后部，然后返回一个新数组，原数组不变。
let arrB = arrA.concat()

//slice方法用于提取目标数组的一部分，返回一个新数组，原数组不变。
let arrB = arrA.slice()

//es6扩展运算符
let arrB = [...arrA]
```



### 深拷贝的实现方法

深拷贝测试用例：

```js
let objB = {
    num: 0,
    str: '',
    boolean: true,
    unf: undefined,
    nul: null,
    obj: {
        name: '我是一个对象',
        id: 1
    },
    arr: [0, 1, 2],
    func: function() {
        console.log('我是一个函数')
    },
    date: new Date(),
    reg: new RegExp('/我是一个正则/ig'),
    err: new Error('我是一个错误'),

    [Symbol()]: {
        f: 'fff',
        g: 'ggg'
    }
}
Object.defineProperties(objB, {
    h: {
        value: 4,
        enumerable: false,
        writable: false,
        configurable: false      
    },
    m: {
        get() {
            console.log('调用了get')
            return [1,2,3]
        },
        set(val) {
            console.log('调用了set')
        }
    }
})
```

#### JSON.parse(JSON.stringify())

**原理：** 用`JSON.stringify`将对象转成JSON字符串，再用`JSON.parse()`把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

`JSON.parse(JSON.stringify())`的确是一种很简单易用的方式。可惜的是，它能正确处理的对象只有 Number、String、Array 等**能够被Json 表示的数据结构**。在遇到不安全的JSON值会自动将其忽略，在数组中则会返回null（以保证单元位置不变）。

> 不安全的 JSON 值: undefined 、 function 、 symbol （ES6+）和包含循环引用的对象，都不符合 JSON 结构标准，支持 JSON 的语言无法处理它们。

```js
JSON.parse(JSON.stringify(objB))

// 输出结果
// arr: [0, 1, 2]
// boolean: true
// date: "2020-05-13T12:34:57.078Z"
// err: {}
// nul: null
// num: 0
// obj: {name: "我是一个对象", id: 1}
// reg: {}
// str: ""

// 丢失的数据有：undefined、function、Symbol、不可枚举属性
// 不能正确复制：Date、RegExp、Error、属性描述符
```

该方法的局限：

- 不能复制：undefined、function、Symbol、不可枚举属性
- 不能正确复制：Date、RegExp、Error、属性描述符
- 循环引用
- 相同引用会被重复复制

#### 迭代递归法

**原理：**对于简单类型，直接复制。对于引用类型，递归复制它的每一个属性。

我们将前面讲到的方法做一个递归：

```js
function deepCopy1 (obj) {
	if (!obj || typeof obj !== 'object') {
		return obj
	}
	let newObj = obj.constructor === Array ? [] : {}
	Reflect.ownKeys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy1(obj[key]) : obj[key]
		}
    })
	return newObj
}

// 输出结果
// arr: [0, 1, 2]
// boolean: true
// date: {}
// err: {stack: "Error: 我是一个错误", message: "我是一个错误"}
// func: ƒ ()
// h: 4
// m: (3) [1, 2, 3]
// nul: null
// num: 0
// obj: {name: "我是一个对象", id: 1}
// reg: {lastIndex: 0}
// str: ""
// unf: undefined
// Symbol(): {f: "fff", g: "ggg"}

//不能正确复制：Date、RegExp、Error、属性描述符(拷贝后属性描述符丢失)
```

这是一般场景中使用的方法，功能比JSON方法强大。但它同样存在以下问题：

* 不能正确复制：Date、RegExp、Error、属性描述符。

* 循环引用
* 相同引用会被重复复制

当然，JavsScript中的数据类型远远不只这些。



### Javascript中的数据类型

#### 常见的有

基本数据类型：Boolean、String、Number

引用类型：function、Array、Date

其他：RegExp，Arguments，Error、NodeList

#### 不一定常见

Blob、File、FileList、ImageData

#### ES6

Map、Set、WeakMap、WeakSet、ArrayBuffer对象、TypedArray视图和DataView视图、Float32Array、Float64Array、Int8Array...

一一实现他们不是一件简单的事情，甚至是一件完全没有必要的事情（当然可以让你了解更多）



### 深入解析深拷贝方法

我们在上面**迭代递归法**的基础上来分析实现深拷贝需要解决的问题：

#### 类型判断用

要实现各种数据类型的拷贝，先要判断其类型。上述方法使用`!obj || typeof obj !== 'object'`来判断是否为对象，而`typeof`方法本身也有局限性。

JavaScript 有四种方法可以判断：

- `typeof`运算符

  `typeof`可以判断出`number`、`string`、`boolean`、`undefined`及`function`等类型，而对于`null`及数组、对象，`typeof`均判断为`object`，不能进一步判断它们的类型。**需要特别注意下null的类型判断**：

  ```js
  //特别注意`typeof null`的坑
  typeof null  // "object"
  null instanceof Object  // false
  ```

- `instanceof`运算符

  `instanceof`不能判断`undefined`和`null`，而且对于不是用`new`声明的基本类型也无法判断。对于是使用new声明的类型，它还可以检测出多层继承关系。

* `constructor`

  `constructor`不能判断`undefined`和`null`，并且使用它是不安全的，因为`contructor`的指向是可以改变的

- `Object.prototype.toString`方法

  在任何值上调用 `Object `原生的` toString() `方法，都会返回一个` [object NativeConstructorName] `格式的字符串。每个类在内部都有一个` [[Class]]` 属性，这个属性中就指定了上述字符串中的构造函数名。

  **但是它不能检测非原生构造函数的构造函数名。**

  相对而言，这是一种比较常用的判断方法：

  ```js
  Object.prototype.toString.call(obj).slice(8,-1)
  ```

#### 处理特殊的数据类型

实现Date、RegExp、Error、属性描述符的正确拷贝。解决方法如下：

```js
function deepCopy2 (obj) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    let newObj
    let Constructor = obj.constructor
    switch(Constructor){
        case RegExp:
            newObj = new Constructor(obj)
            break
        case Date:
            newObj = new Constructor(obj.getTime())
            break
        default:
            newObj = new Constructor()
            newObj = Object.create(
                Object.getPrototypeOf(newObj),
                Object.getOwnPropertyDescriptors(obj)
            )
            break
    }
    
    Reflect.ownKeys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy2(obj[key]) : obj[key]
        }
    })

    return newObj
}
deepCopy2(objB)
```

完整版可以查看[lodash深拷贝](https://github.com/lodash/lodash/blob/master/.internal/baseClone.js)

> 函数的处理：函数拥有一些内在属性，但我们一般不修改这些属性，所以函数一般直接引用其地址即可。如果需要处理，可考虑用`eval`或`new Function`来实现。

#### 循环引用

当对象中有一个属性等于它自身时，会出现循环引用的报错：

```js
objB.n = objB
deepCopy2(objB)

// Uncaught RangeError: Maximum call stack size exceeded
```

**解决思路：**存储已经被拷贝的对象，每一次进行拷贝的时候就先查询该对象是否已经被拷贝，如果已经被拷贝则取出该对象并返回。

##### 解决方法一：weakMap储存被拷贝过对象

```js
function deepCopy3 (obj, hash = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    if (hash.has(obj)) {
        return hash.get(obj)
    }
    let newObj
    let Constructor = obj.constructor
    switch(Constructor){
        case RegExp:
            newObj = new Constructor(obj)
            break
        case Date:
            newObj = new Constructor(obj.getTime())
            break
        default:
            newObj = new Constructor()
            newObj = Object.create(
                Object.getPrototypeOf(newObj),
                Object.getOwnPropertyDescriptors(obj)
            )
            break
    }

    hash.set(obj, newObj)
    Reflect.ownKeys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy3(obj[key], hash) : obj[key]
        }
    })

    return newObj
}
deepCopy3(objB)
```

##### 解决方法二：闭包变量储存被拷贝过对象

```js
function deepCopy4 (obj, hash = []) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    for(let i = 0; i < hash.length; i++){
        if(hash[i].visitedObj === obj){        
            return hash[i].newObj
        }
    }
    let newObj
    let Constructor = obj.constructor
    switch(Constructor){
        case RegExp:
            newObj = new Constructor(obj)
            break
        case Date:
            newObj = new Constructor(obj.getTime())
            break
        default:
            newObj = new Constructor()
            newObj = Object.create(
                Object.getPrototypeOf(newObj),
                Object.getOwnPropertyDescriptors(obj)
            )
            break
    }

    hash.push({
        visitedObj: obj,
        newObj
    }) 
    Reflect.ownKeys(obj).forEach(key => {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy4(obj[key], hash) : obj[key]
        }
    })

    return newObj
}
deepCopy4(objB)
```

#### 相同引用会被重复复制

objB对象中c、d引用的是同一个对象，但在深拷贝时，会分别给c、d拷贝了一个新对象。拷贝后，c、d指向的并不是同一对象，这种情况并不是我们想要的。

```js
let objC = {
    a: 'aaa'
}
objB.p = objC
objB.q = objC
objB.p === objB.q // true，指向同一对象

let objD = deepCopy2(objB)
objD.p === objD.q // false，指向不同对象
```

相同引用的解决思路与上面循环引用相似，**上面循环引用的解决方法，已解决该问题**

#### 递归爆栈

当数据的层次很深时就会栈溢出。以下是一个生成指定深度和广度JSON数据的方法：

```js
//定义一个方法，生成指定深度和广度的JSON对象
function createData(deep = 1, breadth = 1) {
    var data = {}
    var temp = data

    for (var i = 0; i < deep; i++) {
        temp = temp['data' + (i + 1)] = {}
        for (var j = 0; j < breadth; j++) {
            temp[j] = j
        }
    }

    return data
}
```

拷贝的层级很深会栈溢出，但数据的广度不会造成溢出：

```js
deepCopy3(createData(200000, 5))  //Uncaught RangeError: Maximum call stack size exceeded

deepCopy3(createData(5, 200000)) //正常
```

**破解递归爆栈的方法有两种：**

第一种是消除尾递归，但在这里貌似行不通。

第二种方法就是干脆不用递归，改用循环。

```js
function deepCopy5(obj, root = {}) {
    // 栈
    const stackList = [
        {
            parent: root,
            key: null,
            data: obj,
        }
    ]

    while(stackList.length) {
        // 深度优先
        const node = stackList.pop()
        const parent = node.parent
        const key = node.key
        const data = node.data

        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent
        if (key !== null) {
            res = parent[key] = {}
        }

        for(let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    // 下一次循环
                    stackList.push({
                        parent: res,
                        key: k,
                        data: data[k],
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }
    }

    return root
}
```

递归爆栈的场景很少见，通常可以忽略。这里仅仅是提出问题，并提供一种解决思路。该方法没有考虑特殊数据的处理、循环引用、相同引用等。



### 推荐的深拷贝方法

我们在`deepCopy3`基础上做些改动，实现一个在日常开发中通用的深拷贝方法：

```js
function deepCopy (obj, hash = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    if (hash.has(obj)) {
        return hash.get(obj)
    }
    let newObj
    let Constructor = obj.constructor
    switch(Constructor){
        case RegExp:
            newObj = new Constructor(obj)
            break
        case Date:
            newObj = new Constructor(obj.getTime())
            break
        default:
            newObj = new Constructor()
            break
    }

    hash.set(obj, newObj)
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key], hash) : obj[key]
        }
    }

    return newObj
}
```

你如仔细看，会发现这个方法功能不如`deepCopy3`强大。为了适应vue项目中的开发，该方法有二处改动：

* 删除了`Object.create`方法。无法拷贝属性描述符。

  原因一：此方法中创建数据时，返回的对象类型有些怪异。vue中的props选项在做类型校验时会报错。

  ```js
  var a = [1,2,3]
  var b = Object.create(
      Object.getPrototypeOf(a),
      Object.getOwnPropertyDescriptors(a)
  )
  
  b instanceof Array // true，判断为数组
  b.constructor === Array  // true，判断为数组
  Object.prototype.toString.call(b) // [object Object]，判断为Object
  ```

  原因二：在vue框架下，使用此方法无法实现深拷贝，具体原因没研究明白。（我写了一段调用`deepCopy3`拷贝多层级的`JSON`对象的JS，在`chrome`测试过，是可以实现深拷贝的）

* `Reflect.ownKeys`方法换成了`for..in`。无法拷贝不可枚举属性。

  这是因为有些对象中的不可枚举属性，不能通过`new Constructor()`直接创建。比如：vue项目的数据有不可枚举属性`__ob__`，这是一个`Observer`方法，在`new Constructor`时，因为没有传参，引起报错。

### 总结

JavaScript的深拷贝涉及的内容还很多，比如：能否用`Object.create()`实现深拷贝、 如何拷贝原型链上的属性、函数等数据类型的拷贝等。

一般来说，上面的推荐方法已经够用了。这个方法已经覆盖了大部分的业务需求。如果业务中需要频繁使用深考贝且数据结构复杂，可以考虑引入第三方库，比如： [loadsh](https://github.com/lodash/lodash/blob/master) 。



### 参考链接

[ES6时代，你真的会克隆对象吗](https://github.com/Alvin-Liu/Blog/issues/8)

[ES6时代，你真的会克隆对象吗(二)](https://segmentfault.com/a/1190000013131068)

[JavaScript深拷贝的一些坑](https://juejin.im/post/5b235b726fb9a00e8a3e4e88)

[深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

[深入 js 深拷贝对象](https://www.jianshu.com/p/b08bc61714c7)

