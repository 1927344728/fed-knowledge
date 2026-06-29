## 44道JavaScript难题，还不来考考？

这是国外某网站给出了 44 道 JavaScript 难题。这些题涉及面非常广，涵盖 JavaScript 原型、函数细节、强制转换、闭包等知识，而且都是非常细节的东西，透过这些小细节可以折射出很多高级的 JavaScript 知识点。

#### 1、parseInt 遇上 map

```javascript
["1", "2", "3"].map(parseInt)

// A. ["1", "2", "3"]
// B. [1, 2, 3]
// C. [0, 1, 2]
// D. other 
```

**答案：** D，返回的结果是 [1，NaN，NaN]。

**解释：** parseInt 函数只需要两个参数 parseInt(value, radix) ，而 map 的回调函数需要三个参数 callback(currentValue, index, array)。

parseInt 的第二个参数 radix 是一个介于 2~36 之间的整数，表示被解析字符串的基数（数学数字系统中的基）。

parseInt  解析规则：

* 参数字符串的第一个字符不能转换为数字（非数字或者不是指定基数中的数字），返回 NaN。

* radix 小于 2 或大于 36 ，返回 NaN。
* radix 是 0、NaN、Infinity、undefined 或未指定的，其解析规则如下：
  * 参数字符串以 0x 或 0X 开头，那么 radix 被假定为 16，字符串的其余部分被当做十六进制数去解析。
  * 参数字符串以 0 开头，那么 radix 被假定为 8 或 10，具体为哪一个取决于浏览器的实现。
  * 参数字符串以任何其他值开头，那么 radix 被假定为 10。

所以，本题的执行相当于：

```javascript
parseInt(1, 0) // 0，相当于 parseInt('1', 10)
parseInt(2, 1) // NaN，基数值小于 2
parseInt(3, 2) // NaN，3 不是指定基数 2 中的数字。二进制中只能出现 0、1
```

#### 2、神奇的null

```javascript
[typeof null, null instanceof Object]

// A. ["object", false]
// B. [null, false]
// C. ["object", true]
// D. other 
```

**答案：** A。

**解释：** 在 MDN 关于 null 的文档中也特别指出来了，`typeof null` 的结果是 "object"，它是 ECMAScript 的bug，其实应该是 "null"。但这个 bug 由来已久，在 JavaScript 中已经存在了将近二十年，也许永远不会修复，因为这牵扯到太多的 Web 系统，修复它会产生更多的 bug，令许多系统无法正常工作。

instanceof 运算符返回一个布尔值，用于判断一个实例对象的原型链上是否包含某个对象的  prototype 属性。null 值并不是以 Object 原型创建出来的，所以 `null instanceof Object` 返回 false。

```javascript
typeof null // 'object'
null instanceof Object // false
```

#### 3、愤怒的reduce

```javascript
[[3,2,1].reduce(Math.pow), [].reduce(Math.pow)]

// A. an error
// B. [9, 0]
// C. [9, NaN]
// D. [9, undefined] 
```

**答案：** A。

**解释：** 

```javascript
arr.reduce(callback(prev, current[, currentIndex[, array]])[, initialValue])
```

initialValue 是第一次调用函数时，参数 prev 的值。如果指定了 initialValue，则 current 将使用数组第一个元素；否则 prev 将使用数组第一个元素，而 current  将使用数组第二个元素。

如果数组为空且未指定初始值 initialValue，则会抛出 TypeError。

```javascript
[[3,2,1].reduce(Math.pow), [].reduce(Math.pow)]
// Uncaught TypeError: Reduce of empty array with no initial value

[3,2,1].reduce(Math.pow) // 9

[].reduce(Math.pow)
// Uncaught TypeError: Reduce of empty array with no initial value
```

#### 4、该死的优先级

```javascript
const val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');

// A. Value is Something
// B. Value is Nothing
// C. NaN
// D. other 
```

**答案：** D，实际上输出 "Something"。

**解释：**  + 运算符的优先级比条件运算符 `condition ? val1 : val2` 高。

```javascript
const val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
// Something
```

#### 5、神鬼莫测之变量提升

```javascript
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();

// A. Goodbye Jack
// B. Hello Jack
// C. Hello undefined
// D. Hello World 
```

**答案：** A。

**解释：** 在 JavaScript 中， functions 和 variables 会被提升。变量提升是 JavaScript 将声明移至作用域（全局域或者当前函数作用域）顶部的行为。

所以，上面的代码等价于：

```javascript
var name = 'World!';
(function () {
    var name
    if (typeof name === 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

#### 6、死循环陷阱

```javascript
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) { 
    count++;
}
console.log(count);

// A. 0
// B. 100
// C. 101
// D. other 
```

**答案：** D。

**解释：** Javascript 中最大的安全整数值是 `Number.MAX_SAFE_INTEGER = 9007199254740991`，当大于这个数时，数值是不准确的。

本题的问题在于，当 i = 9007199254740992 时，i ++ 后的值是 9007199254740992，仍是 <= END（ Math.pow(2, 53) ）的，所以造成死循环。

```javascript
Number.MAX_SAFE_INTEGER // 9007199254740991
Math.pow(2, 53)         // 9007199254740992
Math.pow(2, 53) + 1     // 9007199254740992
```

#### 7、过滤器魔法

```javascript
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) {
    return x === undefined;
});

// A. [undefined x 7]
// B. [0, 1, 2, 10]
// C. []
// D. [undefined] 
```

**答案：** C。

**解释：**当数组中，两个逗号之间没有任何值或者使用 delete 命令删除一个数组成员，会形成空位。

空位是包括在 length 属性中的，空位的值是 undefined，但它与 undefined 元素有所不同。如果是空位，使用数组的 forEach 方法、for...in 结构、以及 Object.keys 方法进行遍历，空位都会被跳过。

```javascript
var arr = [0, 1, 2];
arr[10] = 10;
console.log(arr)
arr.filter(function (x) {
    console.log(x)
    return x === undefined;
});

// [0, 1, 2, empty × 7, 10]
// 0
// 1
// 2
// 10
```

#### 8、警惕IEEE 754标准

```javascript
var one = 0.1;
var two = 0.2;
var eight = 0.8;
var six = 0.6;
[two - one == one, eight - six == two]

// A. [true, false]
// B. [false, false]
// C. [true, false]
// D. other 
```

**答案：** C。

**解释：**JavaScript 中采用双精度浮点数格式，即 IEEE 754 标准。在该格式下，有些数字无法表示出来，比如：0.1 + 0.2 = 0.30000000000000004 ，这不是 JavaScript 的锅，所有采用该标准的语言都有这个问题，比如：Java、Python等。

```javascript
0.1 + 0.2 // 0.30000000000000004
0.2 - 0.1 // 0.1
0.8 - 0.6 // 0.20000000000000007
```

#### 9、字符串陷阱

```javascript
function showCase(value) {
    switch(value) {
        case 'A':
            console.log('Case A');
            break;
        case 'B':
            console.log('Case B');
            break;
        case undefined:
            console.log('undefined');
            break;
        default:
            console.log('Do not know!');
    }
}
showCase(new String('A'));

// A. Case A
// B. Case B
// C. Do not know!
// D. undefined 
```

**答案：** C。

**解释：**在 switch 内部使用严格相等 === 进行判断。`new String("A")` 返回的是一个对象，而 String("A") 则是直接返回字符串 "A"。

```javascript
new String("A") === 'A' // false
String("A") === 'A'     // true
```

#### 10、再一次的字符串陷阱

```javascript
function showCase(value) {
    switch(value) {
        case 'A':
            console.log('Case A');
            break;
        case 'B':
            console.log('Case B');
            break;
        case undefined:
            console.log('undefined');
            break;
        default:
            console.log('Do not know!');
    }
}
showCase(String('A'));

// A. Case A
// B. Case B
// C. Do not know!
// D. undefined 
```

**答案：** C。

**解释：** 同题 9。

#### 11、并非都是奇偶

```javascript
function isOdd(num) {
    return num % 2 == 1;
}
function isEven(num) {
    return num % 2 == 0;
}
function isSane(num) {
    return isEven(num) || isOdd(num);
}

var values = [7, 4, "13", -9, Infinity];
values.map(isSane);

// A. [true, true, true, true, true]
// B. [true, true, true, true, false]
// C. [true, true, true, false, false]
// D. [true, true, false, false, false] 
```

**答案：** C。

**解释：** `-9 % 2 = -1` 以及 `Infinity % 2 = NaN`。

```javascript
-9 % 2       // -1
Infinity % 2 // NaN
```

#### 12、parseInt小贼

```javascript
parseInt(3, 8);
parseInt(3, 2);
parseInt(3, 0);

// A. 3, 3, 3
// B. 3, 3, NaN
// C. 3, NaN, NaN
// D. other 
```

**答案：** D，实际结果是 3、NaN、3。

**解释：** 同题 1。

#### 13、数组原型是数组

```javascript
Array.isArray( Array.prototype )

// A. true
// B. false
// C. error
// D. other 
```

**答案：** A。

**解释：** 一个鲜为人知的事实：其实 Array.prototype 也是一个数组。

```javascript
Array.isArray(Array.prototype)   // true
Array.prototype instanceof Array // false
```

#### 14、一言难尽的强制转换

```javascript
var a = [0];
if ([0]) {
    console.log(a == true);
} else {
    console.log("wut");
}

// A. true
// B. false
// C. "wut"
// D. other 
```

**答案：** B。

**解释：**  `[0]` 需要被强制转成 Boolean 的时候会被认为是 true；如果两个操作数都是对象，则仅当两个操作数都引用同一个对象时才返回 true。

相等运算符（==）中，如果两个操作数是不同类型的，就会尝试在比较之前将它们转换为相同类型：

* 如果操作数之一是 Boolean，则 true 转换为1、false 转换为 0。
* 如果操作数之一是对象，另一个是数字或字符串，会尝试使用对象的 valueOf() 和 toString() 方法将对象转换为原始值。

```javascript
!![0] // true

console.log([0] == true); // false
// 相当于
console.log('0' == 1);    // false

[0].valueOf()  // [0]
[0].toString() // '0'
```

相等（==）的比较规则相当复杂，可以参考 [MDN - 相等（==）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality)。

#### 15、撒旦之子“==”

```javascript
[]==[]

// A. true
// B. false
// C. error
// D. other 
```

**答案：** B。

**解释：**  如果比较的两个对象指向的是同一个对象，就返回 true，否则就返回 false。

相等（==）的比较规则相当复杂，可以参考 [MDN - 相等（==）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality)。

#### 16、加号 VS 减号

```javascript
'5' + 3;
'5' - 3;

// A. "53", 2
// B. 8, 2
// C. error
// D. other 
```

**答案：** A。

**解释：**  + 运算符中只要有一个是字符串，就会变成字符串拼接操作；- 运算符要求两个操作数都是数字，如果不是，会强制转换成数字。

算术运算符运算时，如果不是数值，则一律转为数值，再进行运算。

加法运算符在操作数是字符串的情况下，有些特殊：

* 操作数是两个字符串时，加法运算符会变成连接运算符，返回两个字符串连接的新字符串。
* 操作数一个是字符串，另一个是非字符串的原始值时，将原始值转成字符串，再连接在一起。
* 操作数一个是字符串，另一个是对象时，先转成原始值（valueOf() 方法），然后转成字符串（toString() 方法），再连接在一起。

#### 17、打死那个疯子

```javascript
1 + - + + + - + 1

// A. 2
// B. 1
// C. error
// D. other 
```

**答案：** A。

**解释：**  运算符优先级：一元运算（! ~ - + ++ -- typeof void delete） > 加减（+ -）。

```javascript
1 + (- (+ + (+ (- (+ 1)))))
```

#### 18、淘气的map

```javascript
var ary = Array(3);
ary[0] = 2;
ary.map(function(elem) {
    return "1";
});

// A. [2, 1, 1]
// B. ["1", "1", "1"]
// C. [2, "1", "1"]
// D. other 
```

**答案：** D，实际结果 `['1', empty × 2]`。

**解释：**  同题7。

#### 19、统统算我的

```javascript
function sidEffecting(ary) {
    ary[0] = ary[2];
}

function bar(a, b, c) {
    c = 10;
    sidEffecting(arguments);
    return a + b + c;
}

bar(1, 1, 1);

// A. 3
// B. 12
// C. error
// D. other 
```

**答案：** D，实际结果 21。

**解释：**  在JavaScript中，参数变量和 arguments 是双向绑定的。改变参数变量，arguments 中的值会立即改变；而改变 arguments 中的值，参数变量也会对应改变。

**注意：** 以上是在非严格模式下的结果；严格模式下返回的是 12。因此，严格模式下，函数的传参不会随 arguments 对象的值的改变而变化。

#### 20、损失精度的IEEE 754

```javascript
var a = 111111111111111110000;
var b = 1111;
console.log(a + b);

// A. 111111111111111111111
// B. 111111111111111110000
// C. NaN
// D. Infinity 
```

**答案：** B。

**解释：**  这是 IEEE 754 规范的黑锅，不是 JavaScript 的问题。表示这么大的数占用过多位数，会丢失精度。

单精度浮点数的尾位数是 23 位，能表达的最大数字是 2^23 = 8388608，一共七位。这意味着最多能有 7 位有效数字，绝对保证可表达的是 6 位，因为大于该最大数字的数精度会丢失，即单精度浮点数的精度为 6~7 位有效数字。

双精度浮点数的尾位数是 52 位，能表达的最大数字是 2^52 = 4503599627370496，一共 16。同理，双精度浮点数的精度为 15~16 位。

JavaScript 采用的是双精度浮点数。

#### 21、反转世界

```javascript
var x = [].reverse;
x();

// A. []
// B. undefined
// C. error
// D. window 
```

**答案：** C。

**解释：**  reverse 函数的 this 指向问题。如果 this 指向 undefeind，返回报错（可能跟运行环境有关）。

```javascript
var x = [].reverse;
console.log(x) // ƒ reverse() { [native code] }
x() // Uncaught TypeError: Cannot convert undefined or null to object

x.bind(this)() // 返回 this 指向。
```

#### 22、最小的正值

```javascript
Number.MIN_VALUE > 0

// A. false
// B. true
// C. error
// D. other 
```

**答案：** B。

**解释：** MIN_VALUE 表示的最小正数，其值约为 5e-324，小于 MIN_VALUE 的值将会转换为 0。

```javascript
Number.MIN_VALUE     // 5e-324
Number.MIN_VALUE > 0 // true
```

#### 23、谨记优先级

```javascript
[1 < 2 < 3, 3 < 2 < 1]

// A. [true, true]
// B. [true, false]
// C. error
// D. other 
```

**答案：** A。

**解释：** 相同优先级，**从左到右**依次运算。

```javascript
1 < 2 < 3 => true < 3 => true
3 < 2 < 1 => false < 1 => true
[1 < 2 < 3, 3 < 2 < 1] // [true, true]
```

#### 24、坑爹中的战斗机

```javascript
2 == [[[2]]]

// A. true
// B. false
// C. undefined
// D. other 
```

**答案：** A。

**解释：** 同题14。

```javascript
[[[2]]].toString() // '2'
2 == '2'           // true
```

#### 25、小数点魔术

```javascript
3.toString();
3..toString();
3...toString();

// A. "3", error, error
// B. "3", "3.0", error
// C. error, "3", error
// D. other 
```

**答案：** C。

**解释：** 点运算符会被优先识别为数字常量的一部分，然后才是对象属性访问符。

```javascript
3.toString();   // error，相当于 (3.)toString()
3..toString();  // 3，相当于 (3.).toString()
3...toString(); // error，相当于 (3.)..toString()
```

#### 26、自动提升为全局变量

```javascript
(function() {
    var x = y = 1;
})();
console.log(y);
console.log(x);

// A. 1, 1
// B. error, error
// C. 1, error
// D. other 
```

**答案：** C。

**解释：** 在函数中，没有用 var 声明变量 y，所以 y 会被自动创建在全局变量 window下面；而 x 是在函数内部声明的，所以在函数外部是无法访问的。

#### 27、正则表达式实例

```javascript
var a = /123/;
var b = /123/;
a == b;
a === b;

// A. true, true
// B. true, false
// C. false, false
// D. other 
```

**答案：** C。

**解释：** 每个字面的正则表达式，返回的都是一个 RegExp 实例对象。

```javascript
/123/ == /123/  // false
/123/ === /123/ // false
[1] == [1]      // false
[1] === [1]     // false
```

#### 28、数组也爱比大小

```javascript
var a = [1, 2, 3];
var b = [1, 2, 3];
var c = [1, 2, 4];

a == b;
a === b;
a > c;
a < c;

// A. false, false, false, true
// B. false, false, false, false
// C. true, true, false, true
// D. other 
```

**答案：** A。

**解释：** 相等比较同题15。对象的比较，是先转换为原始值再对比。

```javascript
a > c;
a.toString() > c.toString()
'1,2,3' > '1,2,4'
```

#### 29、原型把戏

```javascript
var a = {};
var b = Object.prototype;

[a.prototype === b, Object.getPrototypeOf(a) == b]

// A. [false, true]
// B. [true, true]
// C. [false, false]
// D. other 
```

**答案：** A。

**解释：** a 没有 prototype 属性的，所以 a.prototype = undefined，但可以通过 Object.getPrototypeOf 方法来获取一个对象的原型。

```javascript
a.prototype // prototype 
```

#### 30、构造函数的函数

```javascript
function f() {}
var a = f.prototype;
var b = Object.getPrototypeOf(f);
a === b;

// A. true
// B. false
// C. null
// D. other 
```

**答案：** B。

**解释：** 所有的 JavaScript 对象都会从一个 prototype（原型对象）中继承属性和方法。

prototype 的翻译是 “原型”。所以，你可能认为，prototype 对象指向当前对象的原型对象，其实不是。

一个对象的 prototype 对象的属性和方法，是用于被其他对象（子对象、实例）继承的，而一个对象的原型对象定义的是该对象可以从其他对象（父对象、构造函数）承继而来的属性和方法。

getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。这是获取对象的原型的标准方法，与对象的 `__proto__` 属性返回的是同一原型对象。

**简单说：** 对象的 prototype 属性用于被子对象继承；原型是该对象从父对象中继承的对象。

```javascript
f.prototype // {constructor: ƒ}
Object.getPrototypeOf(f) // ƒ () { [native code] }
Object.getPrototypeOf(f) === Function.prototype // true
```

#### 31、禁止修改函数名

```javascript
function foo() {}
var oldName = foo.name;
foo.name = "bar";
[oldName, foo.name];

// A. error
// B. ["", ""]
// C. ["foo", "foo"]
// D. ["foo", "bar"] 
```

**答案：** C。

**解释：** name 属性返回函数实例的名称，是只读属性。所以这里的修改无效。

#### 32、替换陷阱

```javascript
"1 2 3".replace(/\d/g, parseInt);

// A. "1 2 3"
// B. "0 1 2"
// C. "NaN 2 3"
// D. "1 NaN 3" 
```

**答案：** D。

**解释：** replace 的第二个参数可以为函数。该函数的传参数如下：

```javascript
"123abcd".replace(/(a)(\w)c(?<name>d)/g, function (match, p1, p2, p3, offset, string, NamedCaptureGroup) {
    console.log(match)
    console.log(p1)
    console.log(p2)
    console.log(p3)
    console.log(offset)
    console.log(string)
    console.log(NamedCaptureGroup)
});
// abcd
// a
// b
// d
// 3
// 123abcd
// {name: 'd'}
```

参数说明：

* match：匹配的子串。
* p1,p2, ...：代表第 n 个括号匹配的字符串。
* offset： 匹配到的子字符串在原字符串中的偏移量。
* string：被匹配的原字符串。
* NamedCaptureGroup：命名捕获组匹配的对象。

所以，上述 parseInt 的第二个参数是 offset，即匹配到的子字符串在原字符串中的偏移量。

```javascript
parseInt(1, 0) // 1
parseInt(2, 2) // NaN
parseInt(3, 4) // 3
```

#### 33、Function的名字

```javascript
function f() {}
var parent = Object.getPrototypeOf(f);
console.log(f.name);
console.log(parent.name);
console.log(typeof eval(f.name));
console.log(typeof eval(parent.name));

// A. "f", "Empty", "function", "function"
// B. "f", undefined, "function", error
// C. "f", "Empty", "function", error
// D. other 
```

**答案：** D。

**解释：** eval 返回字符串中代码的返回值。如果返回值为空，则返回 undefined。

```javascript
parent === Function.prototype // true
Function.prototype.name // ''

f.name       // 'f'
parent.name  // ''
eval(f.name) // ƒ f() { }
eval(parent.name)   // undefined
typeof eval(f.name) // 'function'
typeof eval(parent.name) // 'undefined'
```

#### 34、正则test()陷阱

```javascript
var lowerCaseOnly = /^[a-z]+$/;
[lowerCaseOnly.test(null), lowerCaseOnly.test()]

// A. [true, false]
// B. error
// C. [true, true]
// D. [false, true] 
```

**答案：** C。

**解释：** test 方法的参数如果不是字符串，会经过抽象 ToString 操作强制转成字符串。

```javascript
lowerCaseOnly.test('null')      // true
lowerCaseOnly.test('undefined') // true
[lowerCaseOnly.test(null), lowerCaseOnly.test()] // [true, true]
```

#### 35、逗号定义数组

```javascript
[,,,].join(", ")

// A. ", , , "
// B. "undefined, undefined, undefined, undefined"
// C. ", , "
// D. "" 
```

**答案：** C。

**解释：** JavaScript 允许用逗号来定义数组，得到的数组是含有 3 个 空位的数组，其值可以认为是 undefined（最一个逗号可忽略）。

join 函数中，如果数组的一个元素为 undefined 或 null，它会被转换为空字符串。

```javascript
[,,,].join(", ") // ', , '
```

#### 36、保留字 class

```javascript
var a = {class: "Animal", name: "Fido"};
console.log(a.class);

// A. "Animal"
// B. Object
// C. an error
// D. other 
```

**答案：** A（Chrome）。

**解释：** 实际上真正的答案取决于浏览器。class 是保留字，但是在 Chrome、Firefox、Opera 中可以作为属性名称，在 IE 中是禁止的。另一方面，其实所有浏览器基本接受大部分的关键字（如：int、private、throws等）作为变量名，而 class 是禁止的。

#### 37、无效日期

```javascript
var a = new Date("epoch");

// A. Thu Jan 01 1970 01:00:00 GMT+0100(CET)
// B. current time
// C. error
// D. other 
```

**答案：** D，实际结果是 `Invalid Date`。

**解释：** new Date() 的参数是 Number 类型，String 类型返回 `Invalid Date`。

#### 38、神鬼莫测的函数长度

```javascript
var a = Function.length;
var b = new Function().length;
console.log(a === b);

// A. true
// B. false
// C. error
// D. other
```

**答案：** B。

**解释：** 函数的 length 属性指明函数的形参个数。Function 构造器本身也是个 Function，其 length 属性值为 1。

```javascript
Function.length // 1
new Function().length // 0
```

#### 39、Date的面具

```javascript
var a = Date(0);
var b = new Date(0);
var c = new Date();
[a === b, b === c, a === c];

// A. [true, true, true]
// B. [false, false, false]
// C. [false, true, false]
// D. [true, false, false] 
```

**答案：** B。

**解释：** Date 普通函数使用时，**不管是否带有参数**，返回的都是调用函数时刻的时间和日期的字符串。Date 作构造函数使用时，如果只传一个参数，会被解析为时间戳；如果没有提供参数，那么新创建的 Date 对象表示实例化时刻的日期和时间。

```javascript
Date(0);    // 字符串，'Sat Aug 27 2022 22:55:04 GMT+0800 (中国标准时间)'
new Date(0) // Date 对象，Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
new Date()  // Date 对象，Sat Aug 27 2022 22:55:43 GMT+0800 (中国标准时间)
```

#### 40、min与max共舞

```javascript
var min = Math.min();
var max = Math.max();
console.log(min < max);

// A. true
// B. false
// C. error
// D. other 
```

**答案：** B。

**解释：** Math.min() 函数返回一组数中的最小值。如果没有参数，则结果为 Infinity；如果有任一参数不能被转换为数值，则结果为 NaN。

Math.max() 函数返回一组数中的最大值。如果没有参数，则结果为 -Infinity；如果有任一参数不能被转换为数值，则结果为 NaN。

```javascript
Math.min() // Infinity
Math.max() // -Infinity
```

#### 41、警惕全局匹配

```javascript
function captureOne(re, str) {
    var match = re.exec(str);
    return match && match[1];
}

const numRe = /num=(\d+)/ig;
const wordRe = /word=(\w+)/i;
const a1 = captureOne(numRe, "num=1");
const a2 = captureOne(wordRe, "word=1");
const a3 = captureOne(numRe, "NUM=1");
const a4 = captureOne(wordRe, "WORD=1");

[a1 === a2, a3 === a4]

// A. [true, true]
// B. [false, false]
// C. [true, false]
// D. [false, true] 
```

**答案：** C。

**解释：** exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。

如果匹配失败，exec() 方法返回 null，并将正则表达式的 lastIndex 重置为 0 。

如果匹配成功，exec() 方法返回一个数组，并更新正则表达式对象的 lastIndex 属性。

当正则表达式使用 “g” 标志时，可以多次执行 exec 方法来查找同一个字符串中的成功匹配。当你这样做时，查找将从正则表达式的 lastIndex 属性指定的位置开始。

```javascript
/num=(\d+)/ig.exec("num=1")
// ['num=1', '1', index: 0, input: 'num=1', groups: undefined]

const a1 = captureOne(numRe, "num=1");   // '1'
const a2 = captureOne(wordRe, "word=1"); // '1'
const a3 = captureOne(numRe, "NUM=1");   // null
const a4 = captureOne(wordRe, "WORD=1"); // '1'
```

#### 42、最熟悉的陌生人

```javascript
var a = new Date("2014-03-19");
var b = new Date(2014, 03, 19);
[a.getDay() == b.getDay(), a.getMonth() == b.getMonth()]

// A. [true, true]
// B. [true, false]
// C. [false, true]
// D. [false, false] 
```

**答案：** D。

**解释：** 当 Date 构造函数调用并传入多个参数时，表示月份的整数值，从 0~11（1月~12月）。

```javascript
new Date(2014, 03, 19) // Sat Apr 19 2014 00:00:00 GMT+0800 (中国标准时间)
```

此外，getDay 返回指定日期对象的星期中的第几天（0～6），也就是说，2014年3月19号和2014年4月19号返回的星期值可能不同。

```javascript
new Date("2014-03-19") // Wed Mar 19 2014 08:00:00 GMT+0800 (中国标准时间)
new Date(2014, 03, 19) // Sat Apr 19 2014 00:00:00 GMT+0800 (中国标准时间)

a.getDay()   // 3
a.getMonth() // 2
b.getDay()   // 6
b.getMonth() // 3
```

另外，注意一点：当 Date 构造函数传参是  ISO 8601 形式的字符串  只有一种情况会以 UTC 时间的零点为标准进行解析：**未指定时区，只有日期格式，没有时间格式，且符合 ISO 8601 标准的字符串。**

```javascript
new Date("2014-03-19") // UTC 时间，Wed Mar 19 2014 08:00:00 GMT+0800 (中国标准时间)
new Date("2014-3-19")  // 本地时区， Wed Mar 19 2014 00:00:00 GMT+0800 (中国标准时间)
```

#### 43、匹配隐式转换

```javascript
if("http://giftwrapped.com/picture.jpg".match(".gif")) {
    console.log("a gif file");
} else {
    console.log("not a gif file");
}

// A. "a gif file"
// B. "not a gif file"
// C. error
// D. other 
```

**答案：** A。

**解释：** match() 返回一个字符串匹配正则表达式的数组，数组成员为匹配的第一个字符串，没有找到匹配，则返回 null。参数是一个正则表达式对象，如果传入一个非正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换为正则表达式 ，如果没有参数，得到一 个包含空字符串的数组。

#### 44、重复声明变量

```javascript
function foo(a) {
    var a;
    return a;
}

function bar(a) {
    var a = "bye";
    return a;
}

[foo("hello"), bar("hello")]

// A. ["hello", "hello"]
// B. ["hello", "bye"]
// C. ["bye", "bye"]
```

**答案：** B。

**解释：** 一个变量在同一作用域中已经声明过，会自动移除 var 声明，但是赋值操作依旧保留。变量提升将影响变量声明，而不会影响其值的初始化。

需要注意的是只能通过调用 Date 构造函数来实例化日期对象：以常规函数调用它（即不加 new 操作符）将会返回一个字符串，而不是一个日期对象。另外，不像其他JavaScript 类型，Date 对象没有字面量格式。

### 参考资料

[44道JS难题，还不来考考？](https://www.helloworld.net/p/4376305958)