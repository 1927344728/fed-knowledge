## 键盘事件

### 键盘事件

三个键盘事件：`keydown、keypress、keyup`

事件触发顺序：`keydown -> keypress -> keyup`

* keydown：当用户按下**任意键**时触发，而且按住不放的话，会重复触发此事件。

* keypress：当用户按下**字符键**时触发，而且按住不放的话，会重复触发此事件。但功能键不一定能触发这个事件。

* keyup：当用户释放键时触发。

键盘事件的触发过程具体是这样的：在用户按下键盘上的一个**字符键**时， 首先会触发`keydown`事件，然后是`keypress`事件，最后是`keyup`事件。其中，`keydown、keypress`事件是在文本框发生变化之前 被触发；而`keyup`在文本框发生变化之后被触发。如果用户按下一个键不放，就会重复触发`keydown、keypress`事件。在用户按下一个**功能键**时，首先触发`keydown`事件，然后就是`keyup`事件。如果用户按下一个键不放，就会重复触发`keydown`。

在`keyup` 事件中无法阻止浏览器默认事件，因为在`keypress`时，浏览器默认行为已经完成，即，将文字输入文本框（尽管这时还没显示），这个时候不管是`preventDefault`还是`return Value = false`，都不能阻止在文本框中输入文字的行为，如要阻止默认行为，必须在`keydown`或`keypress`时阻止。



### 键盘键分类

键盘中的键分为**字符键**（可打印）和**功能键**（不可打印），系统功能键包括如下：`Esc、Tab、Caps Lock、Shift、Ctrl、Alt、Enter、Backspace、Print Screen、Scroll Lock、Pause Break、Insert、Delete、Home、End、Page Up、Page Down， F1 ~ 12，Num Lock、The Arrow Keys`。

`keydown`和`keyup`均可以对系统功能键进行有效的拦截，但事件截获的位置不同；`keypress`事件**不能对系统功能键**（例如：后退、删除等）、**中文输入法**进行正常的响应，

**`keypress`响应系统功能键总结：**

Firefox：支持 `Esc、Enter、Backspace、Pause Break、Insert、Delete、Home、End、Page Up、Page Down、F1 ~ F12、The Arrow Keys`、支持 `The Arrow Keys`

Chrome、Oprea、Safari：支持`Enter`、不支持 `The Arrow Keys`

IE：支持`Esc、Enter`、不支持 `The Arrow Keys`

**中文输入法（浏览器之间表现得不太一致）：**

firfox：输入触发`keydown`，回车确认输入触发`keyup`

chrome：输入触发`keydown、keyup`，回车确认输入只触发`keydown`

IE：输入触发`keydown、keyup`，回车确认输入触发`keydown，keyup`

Safari：输入触发`keydown、keyup`，回车确认输入触发`keydown，keyup`

opera：输入触发`keydown、keyup`，回车确认输入触发`keydown，keyup`



### 键盘事件的取值

* `keyCode`(键码)：就是**字母或数字**对应的`ASCII`码。在发生`keydown、keypress、keyup`事件时，可在`event`对象中获取。

  > - 在`FF、Opera`中，按分号键时`keyCode`值为59，但`IE、Chrome、Safari`则返回186
  > - 在`Safari3`之前的版本中，上、下、左、右箭头和上翻(`PageUp`)、下翻(`PageDown`)键返回大于63000的值

* `which`：

* `charCode`(字符编码)：就是**按下的字符键**对应的ASCII编码。

  `keypress`事件中，`FF、Chrome、Safari`的`event`对象都支持一个`charCode`属性，这个属性在按下非字符键或发生`keydown和keyup`事件时值为0；

  `IE、Opera`则是在`keyCode`中 保存字符键的ASCII编码。

  所以，要想跨浏览器获得字符编码，代码如下：

  ```js
  //获取字符编码，可以使用String.fromCharCode()将其转换为实际的字符。
  var getCharCode = function(event){
      var charcode = event.charCode;
      if(typeof charcode === "number" && charcode != 0){
          return charcode;
      }else{
          //在中文输入法下 keyCode === 229 || keyCode === 197(Opera)
          return event.keyCode;
      }
  };
  ```



### 事件取值兼容情况

* `keydown、keyup`表现一致，`keypress`与两者有差异
* `keydown、keyup`事件中，字符键、功能键可获取`keyCode、witch`值，但`charCode=0`

* `keypress`事件中，字符键可获取`keyCode、witch、charCode`值。有些浏览器中，功能键不一定能触发此事件

* `keypress`事件的`keyCode`对字母的大小写敏感，而`keydown、keyup`事件不敏感

* `keypress`事件的`which`值无法区分主键盘上的数字键和附键盘数字键的，而`keydown、keyup`的`which`值对主附键盘的数字键敏感。
* IE(ie9以下，ie 11正常)，`keydown、keyup` 事件中只有一个属性`keyCode`属性，`keycode`属性表示你具体按下的键(也称为`virtual keycode`)；`keypress`事件中，`keyCode`属性指的是你键入的字符(`character code`)  

[查看DEMO](file:///D:/MyCode/demo-lizh/html/12-input.html)



### keyCode对应表

字母（大、小写）：`[A-Z] -> [65-90]`

数字：`[0-9] -> [48-57]`

小键盘按键：`[0-9] -> [96-105]`

F功能键：`[F1-F12] -> [112-123]`

> **`keyCod`**已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。
>
> 你应该使用[`KeyboardEvent.code`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code)。 不幸的是，有一些浏览器还是没有实现它，所以你在使用之前必须要小心，确认你所使用的那个被所有目标浏览器所支持。



### ASCII码表

信息在计算机上是用二进制表示的，这种表示法让人理解就很困难。因此计算机上都配有输入和输出设备，这些设备的主要目的就是，以一种人类可阅读的形式将信息在这些设备上显示出来供人阅读理解。为保证人类和设备，设备和计算机之间能进行正确的信息交换，人们编制的统一的信息交换代码，这就是**ASCII码**（`American Standard Code for Information Interchange`）表，它的全称是“美国信息交换标准代码”。

| 字符 | 编码 | 字符 | 编码 | 字符 | 编码 | 字符 | 编码 |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| nul  |  0   |  sp  |  32  |  @   |  64  |  '   |  96  |
| soh  |  1   |  !   |  33  |  A   |  65  |  a   |  97  |
| stx  |  2   |  "   |  34  |  B   |  66  |  b   |  98  |
| etx  |  3   |  #   |  35  |  C   |  67  |  c   |  99  |
| eot  |  4   |  $   |  36  |  D   |  68  |  d   | 100  |
| enq  |  5   |  %   |  37  |  E   |  69  |  e   | 101  |
| ack  |  6   |  &   |  38  |  F   |  70  |  f   | 102  |
| bel  |  7   |  `   |  39  |  G   |  71  |  g   | 103  |
|  bs  |  8   |  (   |  40  |  H   |  72  |  h   | 104  |
|  ht  |  9   |  )   |  41  |  I   |  73  |  i   | 105  |
|  nl  |  10  |  *   |  42  |  J   |  74  |  j   | 106  |
|  vt  |  11  |  +   |  43  |  K   |  75  |  k   | 107  |
|  ff  |  12  |  ,   |  44  |  L   |  76  |  l   | 108  |
|  er  |  13  |  -   |  45  |  M   |  77  |  m   | 109  |
|  so  |  14  |  .   |  46  |  N   |  78  |  n   | 110  |
|  si  |  15  |  /   |  47  |  O   |  79  |  o   | 111  |
| dle  |  16  |  0   |  48  |  P   |  80  |  p   | 112  |
| dc1  |  17  |  1   |  49  |  Q   |  81  |  q   | 113  |
| dc2  |  18  |  2   |  50  |  R   |  82  |  r   | 114  |
| dc3  |  19  |  3   |  51  |  S   |  83  |  s   | 115  |
| dc4  |  20  |  4   |  52  |  T   |  84  |  t   | 116  |
| nak  |  21  |  5   |  53  |  U   |  85  |  u   | 117  |
| syn  |  22  |  6   |  54  |  V   |  86  |  v   | 118  |
| etb  |  23  |  7   |  55  |  W   |  87  |  w   | 119  |
| can  |  24  |  8   |  56  |  X   |  88  |  x   | 120  |
|  em  |  25  |  9   |  57  |  Y   |  89  |  y   | 121  |
| sub  |  26  |  :   |  58  |  Z   |  90  |  z   | 122  |
| esc  |  27  |  ;   |  59  |  [   |  91  |  {   | 123  |
|  fs  |  28  |  <   |  60  |  \   |  92  | \|  | 124  |
|  gs  |  29  |  =   |  61  |  ]   |  93  |  }   | 125  |
|  re  |  30  |  >   |  62  |  ^   |  94  |  ~   | 126  |
|  us  |  31  |  ?   |  63  |  _   |  95  | del  | 127  |



### 参考链接

[MDN KeyboardEvent.keyCode](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode)

[键盘事件keydown、keypress、keyup随笔整理总结（摘抄）](https://www.cnblogs.com/xcsn/p/3413074.html)