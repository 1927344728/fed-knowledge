## 基础篇：Error、JSON、Math、console对象

### Error对象

通过 Error 的构造器可以创建一个错误对象。当代码运行时的发生错误，会创建新的 Error 对象，并将其抛出。Error 对象也可用于用户自定义的异常的基础对象。

```javascript
new Error([message[, fileName[,lineNumber]]])
```

message 是人类可阅读的错误描述信息。

fileName（非标准）是被创建的 Error 对象的文件名，默认是调用 Error 构造器代码所在的文件的名字

lineNumber（非标准）是被创建的 Error 对象的行号，默认是调用 Error 构造器代码所在的文件的行号。

```javascript
try {
    throw new Error("MyError!");
} catch (e) {
    console.log(e.message); // 'MyError!'
    console.log(e.name);    // 'Error'。非标准
    console.log(e.stack);   //  'Error: MyError! at...'。非标准
}
```

Error 可能当作普通函数一样使用，返回一个 Error 对象，与通过 new 关键字构造 Error 对象生成的结果相同。 

#### Error类型

* **EvalError：** 与 eval() 有关。如：eval 函数没有被正确执行。
* **InternalError：** JavaScript 引擎内部错误的异常抛出的实例。 如：递归太多。
* **RangeError：** 数值变量或参数超出其有效范围。如：数组长度为负数、Number 对象的方法参数超出范围、函数堆栈超过最大值。
* **ReferenceError：** 引用一个不存在的变量时发生的错误。
* **SyntaxError：** 解析代码的过程中发生的语法错误。
* **TypeError：** 变量或参数不属于有效类型。
* **URIError：**  URI 相关函数的参数不正确时抛出的错误。主要涉及：encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape() 这六个函数。

#### 自定义异常类型

```javascript
function MyError(message) {
    this.name = 'MyError';
    this.message = message || 'Default Message';
    this.stack = new Error().stack;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

try {
    throw new MyError('custom message');
} catch (e) {
    console.log(e.name);    // 'MyError'
    console.log(e.message); // 'custom message'
}
```

#### 抛出和捕获异常

##### throw

throw 语句用来抛出一个异常。当前函数的执行将被停止（throw 之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个 catch 块。如果调用者函数中没有 catch块，程序将会终止。

```javascript
try {
    throw new Error('This is a Error!');
} catch (e) {
    console.log(e.name);    // 'Error'
    console.log(e.message); // 'This is a Error!'
}
```

**注意：** throw 可以抛出任何类型的值。也就是说，除了 Error 类型，还可以抛出 JavaScript 中的任何值。

##### try...catch

try...catch 语句用于对指定的某个语句块内抛出的异常的响应。

try 语句包含一个 try 块，和至少一个 catch 或者 finally 块的。

* try...catch
* try...finally
* try...catch...finally

catch 块包含 try 块中抛出异常时要执行的语句。也就是，如果 try 块中有任何一个语句（或者调用的函数）抛出异常，会立即转向 catch 块的语句；如果没有异常抛出，会跳过 catch 块。

finally 块在 try 块 和 catch 块之后执行。无论是否抛出异常 finally 块都会执行。此外，如果抛出异常，即使没有catch 块处理异常，finally 块的语句也会执行。

```javascript
try {
    throw new Error('This is a Error!')
} catch (e) {
    console.log(e) // Error: This is a Error! at ...。
} finally {
    console.log('Finally!') // Finally!
}
```

如果 finally 块有 return 语句，那么该返回值将会成为整个 try-catch-finally 的返回值，无论 try 和 catch 块是否有 return 语句。

```javascript
function funcTry() {
    try {       return 1 }
    catch (e) { return 2 }
    finally {   return 3 }
}
console.log('返回值：', funcTry()) // '返回值： 3'
```

try 语句可以嵌套一个或者多个的 try 语句。如果 try 语句 没有 catch 块，那么抛出的异常将会被包裹它的 try 语句的 catch 块捕获。

```javascript
try {
    try {     throw new Error("Error inner!"); }
    finally { console.log("Finally inner!"); }
}
catch (e) { console.error(e); }
finally {   console.log("Finally outer!");}
// Finally inner!
// Error: Error inner! at xxx
// Finally outer!
```

### JSON对象

JSON（JavaScript Object Notation）是一种基于文本的标准格式，用于表示基于 JavaScript 对象语法的结构化数据，用来序列化对象、数组、数值、字符串、布尔值和 null 。

**注意：** JSON 是基于 JavaScript 语法，但 JSON 不是 JavaScript。

#### JSON格式

JSON 是一种基于 JavaScript 对象语法的数据格式。 

JSON 可以作为一个对象或者字符串存在：作为对象时，用于解读  JSON 中的数据；作为字符串时，用于通过网络传输 JSON 数据

另外，一个 JSON 对象可以储存在一个单独的文件中，该文件基本上就是一个文本文件，扩展名为 `.json`，对应的媒体类型（MIME type）为 `application/json`。 

JSON 格式注意事项

* JSON 是一种纯数据格式，只包含属性，没有方法。
* 属性名称和字符串必须放在**双引号**内，单引号无效。
* 一个意外的逗号或分号就可能导致 JSON 文件出错。如，数组或对象最后一个成员后面的逗号。
* 属性值是引用类型：只能是数组或对象，不能是函数、正则表达式对象、日期对象。
* 属性值是基本类型：只能是字符串、数值（十进制，且不能是 NaN、Infinity、-Infinity）、布尔值和 null，不能是 undefined。
* 属性值是数值：禁止出现前导零。
* 属性值是小数：小数点后面至少跟着一位数字。

#### JSON方法

JavaScript 提供一个全局的 JSON 对象来对 JSON 对象和 JSON 字符串进行转换。

JavaScript 内置的 JSON 对象只有两个方法：stringify()、parse()。除此之外，JSON 对象本身并没有其他作用，也不能被调用或者作为构造函数调用。

##### stringify()

用于将一个 JavaScript 对象或值转换为 JSON 字符串。

```javascript
JSON.stringify(value[, replacer [, space]])
```

value 是一个将要被序列化成 JSON 字符串的 JSON 对象。
replacer 可以是一个函数或数组。如果是函数，则 JSON 对象的每个属性都会经过该函数的转换和处理；如果是数组，则只有在数组中的属性名才会被序列化；如果是 null 或者未提供，则对象所有的属性都会被序列化。

```javascript
const json = { a: 1, b: 2 }
const jsonStr = JSON.stringify(json, function (key, value) {
    if (key === '') { return value }
    return value + 100
})
console.log(jsonStr) // {"a":101,"b":102}
```

replacer 是函数可以传入键（key）和值（value）两个参数。replacer 函数第一次调用时，key 是一个空字符串，value 是 stringify() 方法的第一个参数；第二次及以后的每次调用，都是对上一次调用的返回值的递归，即，如果上一次的返回值是可序列化的，则会继续调用 stringify() 方法。 

```javascript
const jsonStr = JSON.stringify(json, function (key, value) {
    if (key === '') {
        console.log(value) // {a: 1, b: 2}
        return { c: 'c', d: 'd' }
    }
    return value + 100
})
console.log(jsonStr) // {"c":"c100","d":"d100"}
```

space 是指定缩进用的空白字符串，用于美化输出。如果是数值，则代表有多少个（1~10，小于 1 意味着没有空格）空格；如果是字符串（长度超过 10，截取前 10），则该字符串将被作为空格；如果是 null 或者未提供，表示没有空格。

```javascript
const jsonStr = JSON.stringify(json, null, 8)
// '{\n        "a": 1,\n        "b": 2\n}'
```

stringify() 转换规则：

* 传参是函数、undefined 会返回 undefined。
* 布尔值、数字、字符串的包装对象会自动转换成对应的原始值。
* undefined、函数、Symbol 值：在非数组对象中将会被忽略；在数组中被转换成 null。
* NaN、Infinity、null 会转换为 null。
* 所有属性名是 Symbol 值的属性会被忽略。
* 非数组对象的属性不能保证以特定的顺序序列化。
* 如果属性值是对象，且该对象内有 toJSON() 方法，则该对象的序列化值为 toJSON() 方法的返回值。
* 不能包含循环引用的对象。
* Date 对象内置了 toJSON() 方法，Date 类型数据将会转换为字符串，结果同 `Date.toISOString()` 返回值。
* 其他类型的对象仅会序列化可枚举的属性。

```javascript
// 传参是函数、undefined 会返回 undefined
JSON.stringify(function () {}) // undefined
JSON.stringify(undefined)      // undefined

// 不能包含循环引用的对象
const obj = { a: 1 }
obj.b = obj
JSON.stringify(obj) // Uncaught TypeError: Converting circular structure to JSON

const json = {
  NaN: NaN,
  Infinity: Infinity,
  null: null,
  [Symbol('Symbol')]: 'Symbol',
  Date: new Date(),
  array: [undefined, function () { }, Symbol('Symbol')],
  obj: {
    undefined: undefined,
    fn: function () { },
    Symbol: Symbol('Symbol')
  },
  jsonObj: {
    toJSON: function () { return '自定义' }
  }
}
JSON.stringify(json) // {"NaN":null,"Infinity":null,"null":null,"Date":"2022-05-21T06:32:12.184Z","array":[null,null,null],"obj":{},"jsonObj":"自定义"}
```

##### parse()

用于将一个 JSON 字符串转换为 JavaScript 对象或值。

```javascript
JSON.parse(text[, reviver])
```

text 是要被解析成 JavaScript 值的字符串。若传入的字符串不符合 JSON 规范，则会抛出 SyntaxError 异常。
reviver 是一个函数，用来在返回解析值之前，修改解析值，返回修改后的解析值。该函数接收键（key）和值（value）两个参数。

reviver 函数解析对象本身以及它所包含的所有属性，会按照一定的顺序（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本身）调用，在调用过程中，当前属性所属的对象会作为 this 值。如果返回 undefined，则当前属性会被忽略；如果返回其他值，则会成为当前属性新的值。

当遍历到最顶层的值时（即最后一次调用），传入函数的参数会是空字符串和最终返回的解析值（有可能已经被修改过了），当前的 this 值会是 `{"": [最终返回的解析值]}`。

```javascript
const jsonStr = '{"a": 1, "b": 1}'
const json = JSON.parse(jsonStr, function (key, value) {
    console.log(key, value)
    if (key === '') {
        return { c: 'c', d: 'd' }
    }
    return value
})

// a 1
// b 1
// {c: 'c', d: 'd'}
```

**注意：** 如果 JSON 的属性值是数值，且带有前导零，JSON.stringify() 方法可能忽略前导零或者当作八进制解析（不同浏览器实现可能不一样），JSON.parse() 方法则会抛出 SyntaxError 错误。

### Math对象

Math 是一个内置对象，拥有一些数学常数属性和数学函数方法，主要用于 Number 类型计算，且不支持 BigInt 类型。

与其他全局对象不同的是，Math 不是一个构造函数，它的所有属性与方法都是静态的。

#### Math属性

* **E**： 欧拉常数，也是自然对数的底数，约等于 2.718。
* **LN2**： 2 的自然对数，约等于 0.693。
* **LN10**： 10 的自然对数，约等于 2.303。
* **LOG2E**： 以 2 为底的 E 的对数，约等于 1.443。
* **LOG10E**： 以 10 为底的 E 的对数，约等于 0.434。
* **PI**： 圆周率，一个圆的周长和直径之比，约等于 3.14159。
* **SQRT1_2**： 二分之一的平方根，同时也是 2 的平方根的倒数，约等于 0.707。
* **SQRT2**： 2 的平方根，约等于 1.414。

Math 的常量是使用 JavaScript 中浮点数的最大精度来定义的。

```javascript
Math.E  // 2.718281828459045
Math.PI // 3.141592653589793
```

#### Math方法

* **abs(x)**： 返回一个数的绝对值。
* **max([x[, y[, …]]])**： 返回零到多个数值中最大值。
* **min([x[, y[, …]]])**： 返回零到多个数值中最小值。
* **random()**： 返回一个 0 到 1 之间的伪随机数。
* **round(x)**： 返回四舍五入后的整数。
* **ceil(x)**： 返回大于一个数的最小整数，即一个数向上取整后的值。
* **floor(x)**： 返回小于一个数的最大整数，即一个数向下取整后的值。
* **sign(x)**： 返回一个数的符号，得知一个数是正数、负数还是 0。

* **trunc(x)**： 返回一个数的整数部分，直接去除其小数点及之后的部分。
* 

* **pow(x, y)**： 返回一个数的 y 次幂。

* **sqrt(x)**： 返回一个数的平方根。

* **cbrt(x)**： 返回一个数的立方根。
* **hypot([x[, y[, …]]])**： 返回其所有参数平方和的平方根。
* **log(x)**： 返回一个数的自然对数（㏒e，即 ㏑）。
* **log1p(x)**： 返回一个数加 1 的和的自然对数（㏒e，即 ㏑）。
* **log10(x)**： 返回一个数以 10 为底数的对数。
* **log2(x)**： 返回一个数以 2 为底数的对数。
* **exp(x)**： 返回欧拉常数的参数次方，E^x，其中 x 为参数，E 是欧拉常数（2.718...，自然对数的底数）。
* **expm1(x)**： 返回 exp(x) - 1 的值。
* 

* **clz32(x)**： 返回一个 32 位整数的前导零的数量。
* **fround(x)**： 返回最接近一个数的单精度浮点型表示。
* **imul(x, y)**： 返回 32 位整数乘法的结果。
* 

* **sin(x)**： 返回一个数的正弦值。
* **sinh(x)**： 返回一个数的双曲正弦值。

* **asin(x)**： 返回一个数的反正弦值。
* **asinh(x)**： 返回一个数的反双曲正弦值。

* **cos(x)**： 返回一个数的余弦值。
* **cosh(x)**： 返回一个数的双曲余弦值。

* **acos(x)**： 返回一个数的反余弦值。
* **acosh(x)**： 返回一个数的反双曲余弦值。
* **tan(x)**： 返回一个数的正切值。
* **tanh(x)**： 返回一个数的双曲正切值。
* **atan(x)**： 返回一个数的反正切值。
* **atanh(x)**： 返回一个数的反双曲正切值。
* **atan2(y, x)**： 返回 y/x 的反正切值。
* **toSource()**： 返回字符串 "Math"。

**注意**： 三角函数 sin()、cos()、tan()、asin()、acos()、atan() 和 atan2() 返回的值是弧度而非角度。若要转换，弧度除以 (Math.PI / 180) 即可转换为角度。同理，角度乘以这个数则能转换为弧度。

**注意**： 很多 Math 函数都有一个精度，而且这个精度在不同实现中也是不相同的。这意味着不同的浏览器会给出不同的结果，甚至，在不同的系统或架构下，相同的 JS 引擎也会给出不同的结果！

### console对象

Console 对象提供了浏览器控制台调试的接口。在不同浏览器上它的工作方式可能不一样，但通常都会提供一套共性的功能。

Console 对象可以从任何全局对象中访问到，如：浏览器作用域上的 Window、Web Worker 的 WorkerGlobalScope。

#### console方法

* **log()**： 打印内容的通用方法，Info 类型。

* **info()**： 打印资讯类说明信息，Info 类型。

* **warn()**： 打印一个警告信息，Warnings 类型。

* **error()**： 打印一条错误信息，Errors 类型。

* **debug()**： 打印一条调试信息，Verbose 类型。

* **trace()**： 输出一个 stack trace。

  ```javascript
  console.trace()
  // console.trace
  // (anonymous) @ [fileName]:[lineNo]
  ```

* **count()**： 以参数为标识记录 count() 调用的次数。如果省略参数，默认为 `default`。

* **countReset()**： 重置指定标识的计数器值。如果省略参数，此函数会重置默认的计数器。

* **dir()**： 在控制台中显示指定 JavaScript 对象的属性，并通过类似文件树样式的交互列表显示。

  ```javascript
  console.dir(document.querySelector('body'))
  // aLink: ""
  // accessKey: ""
  // ...
  ```

* **dirxml()**： 显示一个明确的XML/HTML元素的包括所有后代元素的交互树。

  ```javascript
  console.dirxml(document.querySelector('body'))
  // <body>
  //   <div>...</div>
  //   <script>...</script>
  // </body>
  ```

* **table()**： 将列表型的数据打印成表格。

  ```javascript
  console.table(["apples", "oranges", "bananas"]);
  console.table(["John", "Smith"], ["Jane", "Doe"], ["Emily", "Jones"]);
  
  function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  console.table([
      new Person("John", "Smith"),
      new Person("Jane", "Doe")
      new Person("Emily", "Jones")
  ], ["firstName"]); // 过滤属性名为 firstName 的列。
  ```

* **assert()**： 如果第一个参数 false，则将一个错误消息写入控制台；如果是 true，没有任何反应。

  ```javascript
  console.assert(false, 'The word is %s', 'Hello!');
  // Assertion failed: The word is Hello!
  
  console.assert(true, 'The word is %s', 'Hello!'); // undefined
  ```

* **clear()**： 清空控制台，并输出 `Console was cleared`。

* **group()**： 创建一个新的分组，后续所有打印内容将会以子层级的形式展示，直到调用 groupEnd() 之后，当前分组结束。

* **groupEnd()**： 关闭当前分组，即当前最近的一个 group() 创建的分组。

* **groupCollapsed()**：与 group() 类似，不同的是，该方法打印出来的内容默认是折叠的。

* **profile()（非标准）**： 开始记录性能描述信息

* **profileEnd()（非标准）**：停止记录之前已经由 profile() 开始记录的性能描述信息。

* **time()**： 启动一个计时器来跟踪某一个操作的占用时长。每一个计时器必须拥有唯一的名字，页面中最多能同时运行 10,000 个计时器。

* **timeLog()**： 在控制台输出一个 time() 启动的计时器的值。

* **timeEnd()**： 停止一个 time() 启动的计时器，并以毫秒打印其从开始到结束所用的时间。

* **timeStamp()（非标准）**： 添加一个标记到浏览器的 Timeline 或 Waterfall 工具。

#### 字符串替换

console 的方法支持以下占位符，不同类型的数据必须使用对应的占位符：

* **%s**： 字符串。
* **%d、%i**： 整数。
* **%f**： 浮点数，支持格式化。
* **%o、%O**： JavaScript 对象。
* **%c**： CSS 格式字符串，指定输入的样式。

```javascript
console.log("String: %s", 'abcd')           // String: abcd
console.log("Number: %d %d %2d", 1, 1.0001) // Number: 1 1 %2d
console.log("Float: %f %f", 1, 1.0001)      // Float: 1 1.0001
console.log("Object: %o", { a: 1, b: 2 })   // Object: {a: 1, b: 2}
console.log("String: %c%s %c efg", 'color: red;', 'abcd', 'color: green')
// String: abcd  efg。输出内容会显示不同颜色
```

如果输出的内容与指定类型不符，则会强制转换为指定类型。

```javascript
console.log("Number: %d", 'abcd')         // Number: NaN
console.log("String: %s", { a: 1, b: 2 }) // String: [object Object]
```

#### 定义样式

可以使用 `%c` 占位符为打印内容定义样式。

占位符前的文本不受影响，占位符后的文本将会使用参数中声明的 CSS 样式。

```javascript
console.log("This is a %ccolorful %cstring!", "color: red;", "color: green;");
```

`%c` 占位符可用的属性如下（不同浏览器可能存在差异）：

```shell
background
border
border-radius
box-decoration-break
box-shadow
clear
float
color
cursor
display
font
line-height
margin
outline
padding
text-*
white-space
word-spacing
word-break
writing-mode
```

**备注：** 控制台信息的默认行为与行内元素相似，可以通过 display 属性修改盒模型。

#### debugger语句

debugger 语句调用任何可用的调试功能。当被调用时，执行暂停在 debugger 语句的位置，如同在脚本源代码中的断点一样。

如果没有调试功能可用，则此语句不起作用。

### 参考资料

[MDN - Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)

[MDN - 使用JSON](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/JSON)

[MDN - JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)

[MDN - Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)

[MDN - Console](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)