## JavaScript Date的使用和日期时间字符串格式

JavaScript的时间由世界标准时间（UTC）1970年1月1日开始，用毫秒计时，一天由 86,400,000 毫秒组成。`Date` 对象的范围是 -100,000,000 天至 100,000,000 天（等效的毫秒值）。

创建一个 JavaScript `Date` 实例，该实例呈现时间中的某个时刻。`Date` 对象则基于 [Unix Time Stamp](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16)，即自1970年1月1日（UTC）起经过的毫秒数。

### 常规函数调用

以一个函数的形式来调用 `Date` 对象（即不使用 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符）会返回一个代表当前日期和时间的字符串。

```js
Date() //Sat May 30 2020 21:08:12 GMT+0800 (中国标准时间)
```

注意，即使带有参数，`Date`作为普通函数使用时，返回的还是当前时间。

```js
Date(2020, 4, 1) //Sat May 30 2020 21:09:28 GMT+0800 (中国标准时间)
```



### 构造函数用法

创建一个新`Date`对象的唯一方法是通过[`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符。`Date()`构造函数有四种基本形式

```js
new Date() // 当前日期和时间
new Date(milliseconds) //返回从 1970 年 1 月 1 日至今的毫秒数
new Date(dateString)
new Date(year, month, day, hours, minutes, seconds, milliseconds)
```

#### 没有参数

如果没有输入任何参数，则`Date`的构造器会依据系统设置的当前时间来创建一个Date对象。

```js
new Date() //Sat May 30 2020 21:13:39 GMT+0800 (中国标准时间)
```

#### Unix时间戳

Unix时间戳表示当前时间到1970年1月1日00:00:00 UTC对应的秒数。

注意，`JavaScript`内的时间戳指的是当前时间到1970年1月1日00:00:00 UTC对应的毫秒数，和`unix`时间戳不是一个概念，后者表示秒数，差了1000倍。

时间戳必须是`number`格式，`string`会返回`Invalid Date`。

```js
new Date(1600000000000) //Sun Sep 13 2020 20:26:40 GMT+0800 (中国标准时间)
new Date('1600000000000') //Invalid Date
```

#### 时间戳字符串

`dateString`表示日期的字符串值。该字符串必须是能被`Date.parse()`解析的，即符合 [IETF-compliant RFC 2822 timestamps](http://tools.ietf.org/html/rfc2822#page-14) 或 [version of ISO8601](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15)。

> **注意:** 由于浏览器差异和不一致性，强烈建议不要使用`Date`构造函数（和`Date.parse`，它们是等效的）解析日期字符串。
>
> 比如：对 ISO 8601 格式的支持中，仅有日期的字符串 (例如 "1970-01-01") 会被处理为 UTC 而不是本地时间，与其他格式的串的处理不同。

#### 分别提供日期与时间的每一个成员

至少需要提供年份与月份两个参数。如果只传一个参数，会被解析为时间戳。

```js
new Date(2000) //Thu Jan 01 1970 08:00:02 GMT+0800 (中国标准时间)
new Date(2000, 0) //Sat Jan 01 2000 00:00:00 GMT+0800 (中国标准时间)
```

这一形式的 `Date() `返回的 `Date `对象中的每一个成员都来自下列参数。没有提供的成员将使用最小可能值（对日期为`1`，其他为`0`）。

- `year`

  表示年份的整数值。 0到99会被映射至1900年至1999年，其它值代表实际年份。

- `monthIndex`

  表示月份的整数值，从 0（1月）到 11（12月）。

- `day` 可选

  表示一个月中的第几天的整数值，从1开始。默认值为1。

- `hours` 可选

  表示一天中的小时数的整数值 (24小时制)。默认值为0（午夜）。

- `minutes` 可选

  表示一个完整时间（如 01:10:00）中的分钟部分的整数值。默认值为0。

- `seconds` 可选

  表示一个完整时间（如 01:10:00）中的秒部分的整数值。默认值为0。

- `milliseconds` 可选

  表示一个完整时间的毫秒部分的整数值。默认值为0。

> **注意：**当Date作为构造函数调用并传入多个参数时，如果数值大于合理范围时（如月份为 13 或者分钟数为 70），相邻的数值会被调整。
>
> ```js
> new Date(2019, 13, 1) //Sat Feb 01 2020 00:00:00 GMT+0800 (中国标准时间)
> new Date(2020, 1, 1)  //Sat Feb 01 2020 00:00:00 GMT+0800 (中国标准时间)
> 
> new Date(2019, 13, 1, 8, 70) //Sat Feb 01 2020 09:10:00 GMT+0800 (中国标准时间)
> new Date(2019, 13, 1, 9, 10) //Sat Feb 01 2020 09:10:00 GMT+0800 (中国标准时间)
> ```

> **注意：**当Date作为构造函数调用并传入多个参数时，所定义参数代表的是当地时间。如果需要使用世界协调时 UTC，使用 `new Date(Date.UTC(...))` 和相同参数。
>
> ```js
> new Date(2019, 4, 30).getTime() //1559145600000
> new Date(2019, 4, 30) // Thu May 30 2019 00:00:00 GMT+0800 (中国标准时间)
> 
> new Date(Date.UTC(2019, 4, 30)).getTime() //1559174400000
> new Date(Date.UTC(2019, 4, 30)) // Thu May 30 2019 08:00:00 GMT+0800 (中国标准时间)
> ```

`Date` 对象为跨平台提供了统一的行为。时间属性可以在不同的系统中表示相同的时刻，而如果使用了本地时间对象，则反映当地的时间。

`Date` 对象支持多个处理 UTC 时间的方法，也相应地提供了应对当地时间的方法。UTC，也就是我们所说的格林威治时间，指的是time中的世界时间标准。而**当地时间则是指执行JavaScript的客户端电脑所设置的时间**。



### Date对象的属性

##### constructor

返回对创建此对象的 Date 函数的引用。

##### prototype

允许为 Date 对象添加属性。

##### length

Date.length 的值是 7。这是该构造函数可接受的参数个数。



### Date对象的方法

##### now()

返回自 1970-1-1 00:00:00  UTC（世界标准时间）至今所经过的毫秒数。

为了提供针对定时攻击和指纹追踪的保护，`Date.now()` 的精度可能会根据浏览器的高级设置项目而被取整。

```js
Date.now() //1590848667253
```

##### parse()

解析一个表示某个日期的字符串，并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数，如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：2015-02-31），则返回值为NaN。

**不推荐在ES5之前使用Date.parse方法**，因为字符串的解析完全取决于实现。直到至今，不同宿主在如何解析日期字符串上仍存在许多差异，因此最好还是手动解析日期字符串（在需要适应不同格式时库能起到很大帮助）。   

**比如：`2020-05-31 15:30:00 `的字符串解析，可能为NaN，UTC时间或者本地时间。**

其参数必须是一个符合 RFC2822或 ISO 8601 日期格式的字符串（其他格式也许也支持，但结果可能与预期不符）。

##### UTC()

接受的参数同日期构造函数接受最多参数时一样（2个参数~7个参数），返回从1970-1-1 00:00:00 UTC到指定日期的的毫秒数。

```js
Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
```



### Date实例的方法

所有的 `Date` 实例都继承自 [`Date.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/prototype)。修改 `Date `构造函数的原型对象会影响到所有的 `Date` 实例。

##### valueOf()

`valueOf`方法返回实例对象距离时间零点（1970年1月1日00:00:00 UTC）对应的毫秒数，该方法等同于`getTime`方法。

#### get 类方法（共19个）

| 方法                | 描述                                            |
| :------------------ | :---------------------------------------------- |
| getYear()           | 请使用 getFullYear() 方法代替。                 |
| getTime()           | 返回 1970 年 1 月 1 日至今的毫秒数。            |
| getTimezoneOffset() | 返回本地时间与格林威治标准时间 (GMT) 的分钟差。 |

```js
new Date().getTimezoneOffset() //-480
//-480表示 UTC 比当前时间少480分钟，即当前时区比 UTC 早8个小时。
```

返回实例对象年、月、日、时、分、秒、毫秒、周的值（共8个）：

| 方法              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| getFullYear()     | 从 Date 对象以四位数字返回年份。                             |
| getMonth()        | 从 Date 对象返回月份 (0 ~ 11)。                              |
| getDate()         | 从 Date 对象返回一个月中的某一天 (1 ~ 31)。                  |
| getHours()        | 返回 Date 对象的小时 (0 ~ 23)。                              |
| getMinutes()      | 返回 Date 对象的分钟 (0 ~ 59)。                              |
| getSeconds()      | 返回 Date 对象的秒数 (0 ~ 59)。                              |
| getMilliseconds() | 返回 Date 对象的毫秒(0 ~ 999)。                              |
| getDay()          | 从 Date 对象返回一周中的某一天 (0 ~ 6)。 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推。 |

根据世界时，返回实例对象年、月、日、时、分、秒、毫秒、周的值（共8个）：

| 方法                 | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| getUTCFullYear()     | 根据世界时从 Date 对象返回四位数的年份。                     |
| getUTCMonth()        | 根据世界时从 Date 对象返回月份 (0 ~ 11)。                    |
| getUTCDate()         | 根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。              |
| getUTCHours()        | 根据世界时返回 Date 对象的小时 (0 ~ 23)。                    |
| getUTCMinutes()      | 根据世界时返回 Date 对象的分钟 (0 ~ 59)。                    |
| getUTCSeconds()      | 根据世界时返回 Date 对象的秒钟 (0 ~ 59)。                    |
| getUTCMilliseconds() | 根据世界时返回 Date 对象的毫秒(0 ~ 999)。                    |
| getUTCDay()          | 根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推。 |

#### set 类方法(共16个)

| 方法      | 描述                            |
| --------- | ------------------------------- |
| setTime() | 以毫秒设置 Date 对象。          |
| setYear() | 请使用 setFullYear() 方法代替。 |

设置实例对象的年、月、日、时、分、秒、毫秒的值（共7个）：

**注：没有`setDay`方法，因为星期几是计算出来的，而不是设置的。**

| 方法              | 描述                                  |
| ----------------- | ------------------------------------- |
| setFullYear()     | 设置 Date 对象中的年份（四位数字）。  |
| setMonth()        | 设置 Date 对象中月份 (0 ~ 11)。       |
| setDate()         | 设置 Date 对象中月的某一天 (1 ~ 31)。 |
| setHours()        | 设置 Date 对象中的小时 (0 ~ 23)。     |
| setMinutes()      | 设置 Date 对象中的分钟 (0 ~ 59)。     |
| setSeconds()      | 设置 Date 对象中的秒钟 (0 ~ 59)。     |
| setMilliseconds() | 设置 Date 对象中的毫秒 (0 ~ 999)。    |

 根据世界时，设置实例对象的年、月、日、时、分、秒、毫秒的值（共7个）：

| 方法                 | 描述                                            |
| -------------------- | ----------------------------------------------- |
| setUTCDate()         | 根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。 |
| setUTCMonth()        | 根据世界时设置 Date 对象中的月份 (0 ~ 11)。     |
| setUTCFullYear()     | 根据世界时设置 Date 对象中的年份（四位数字）。  |
| setUTCHours()        | 根据世界时设置 Date 对象中的小时 (0 ~ 23)。     |
| setUTCMinutes()      | 根据世界时设置 Date 对象中的分钟 (0 ~ 59)。     |
| setUTCSeconds()      | 根据世界时设置 Date 对象中的秒钟 (0 ~ 59)。     |
| setUTCMilliseconds() | 根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。    |

```js
let dateA = new Date('2020-05-31')
dateA //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
dateA.setFullYear(2030)
dateA //Fri May 31 2030 08:00:00 GMT+0800 (中国标准时间)
```

`set`类方法和`get`类方法，可以结合使用，得到相对时间。

```js
let dateA = new Date('2020-05-31')                 
//设置1000天以后
dateA.setDate(dateA.getDate() + 1000)
dateA //Sat Feb 25 2023 08:00:00 GMT+0800 (中国标准时间)
//设置1年以后
dateA.setFullYear(dateA.getFullYear() + 1)
dateA //Sun Feb 25 2024 08:00:00 GMT+0800 (中国标准时间)
```



#### to 类方法（共12个）

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| toString()           | 返回一个表示该日期对象的字符串。覆盖了Object.prototype.toString() 方法。 |
| toUTCString()        | 把一个日期对象转换为一个以UTC时区计时的字符串。              |
| toISOString()        | 把一个日期转换为符合 ISO 8601 扩展格式的字符串。注意：返回的总是 UTC 时区的时间。 |
| toJSON()             | 与toISOString方法的返回结果完全相同。默认情况下，这个方法常用于 JSON序列化Date对象。 |
| toLocaleString()     | 返回一个表示该日期对象的字符串，该字符串与系统设置的地区关联（locality sensitive）。覆盖了 Object.prototype.toLocaleString() 方法。 |
| toDateString()       | 以人类易读（human-readable）的形式返回该日期对象日期部分的字符串。 |
| toLocaleDateString() | 返回一个表示该日期对象日期部分的字符串，该字符串格式与系统设置的地区关联（locality sensitive）。 |
| toTimeString()       | 以人类易读格式返回日期对象时间部分的字符串。                 |
| toLocaleTimeString() | 返回一个表示该日期对象时间部分的字符串，该字符串格式与系统设置的地区关联（locality sensitive）。 |
| ~~toGMTString()~~    | ~~返回一个基于 GMT (UT) 时区的字符串来表示该日期。请使用 toUTCString() 方法代替。~~ |
| ~~toSource()~~       | ~~返回一个与Date等价的原始字符串对象，你可以使用这个值去生成一个新的对象。重写了 Object.prototype.toSource() 这个方法。 注：该特性是非标准的，请尽量不要在生产环境中使用它！~~ |
| ~~toLocaleFormat()~~ | ~~使用格式字符串将日期转换为字符串。该特性是非标准的，请尽量不要在生产环境中使用它！~~ |

```js
let DateA = new Date(2020，5，30)
DateA.toString() // Sat May 30 2020 00:00:00 GMT+0800 (中国标准时间)
DateA.toUTCString() // Fri, 29 May 2020 16:00:00 GMT
DateA.toISOString() // 2020-05-29T16:00:00.000Z
DateA.toJSON() // 2020-05-29T16:00:00.000Z
DateA.toLocaleString() // 2020/5/30 上午12:00:00
DateA.toDateString() // Sat May 30 2020
DateA.toLocaleDateString() // 2020/5/30
DateA.toTimeString() // 00:00:00 GMT+0800 (中国标准时间)
DateA.toLocaleTimeString() // 上午12:00:00
```

`toLocaleDateString()、toLocaleString()、toLocaleTimeString()`返回的字符串格式因不同语言而不同。新增的参数 `locales` 和 `options` 使程序能够指定使用哪种语言格式化规则，允许定制该方法的表现（behavior）。在旧版本浏览器中， `locales` 和 `options` 参数被忽略，使用的语言环境和返回的字符串格式是各自独立实现的。

```js
let DateA = new Date(2020, 4, 30)
let options = {
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: true
}
DateA.toLocaleTimeString() //上午12:00:00
DateA.toLocaleTimeString("cn", options) //UTC 下午4:00:00
DateA.toLocaleTimeString("en-US", options) //4:00:00 PM UTC
```



### 标准时间

**GMT即「格林威治标准时间」(Greenwich Mean Time，简称G.M.T.)**，指位于英国伦敦郊区的皇家格林威治天文台的标准时间，因为本初子午线被定义为通过那里的经线。然而由于地球的不规则自转，导致GMT时间有误差，因此**目前已不被当作标准时间使用。**

**UTC是最主要的世界时间标准，**是经过平均太阳时(以格林威治时间GMT为准)、地轴运动修正后的新时标以及以「秒」为单位的国际原子时所综合精算而成的时间。UTC比GMT来得更加精准。其误差值必须保持在0.9秒以内，若大于0.9秒则由位于巴黎的国际地球自转事务中央局发布闰秒，使UTC与地球自转周期一致。

**理论上，UTC与 GMT 时间是相等的（除非出现了闰秒，日常使用上可以忽略不计）。**



### 时区与UTC偏移

#### 时区的概念

时区是地球上的区域使用同一个时间定义。以前，人们通过观察太阳的位置（时角）决定时间，这就使得不同经度的地方的时间有所不同（地方时）。1863年，首次使用时区的概念。时区通过设立一个区域的标准时间部分地解决了这个问题。

整个地球分为二十四时区，每个时区都有自己的本地时间 。`本地时间 = 标准时间 + 时区差`，**时区差东为正，西为负**。

#### 时区表示法

如果时间是以协调世界时（UTC）表示，则在时间后面直接加上一个“Z”（不加空格）。“Z”是协调世界时中0时区的标志。因此，`09:30 UTC`就写作 `09:30Z` 或是 `0930Z`。`14:45:15 UTC` 则为 `14:45:15Z` 或 `144515Z`。

UTC时间也被叫做祖鲁时间，因为在北约音标字母中用“Zulu”表示“Z”。

#### UTC偏移量

UTC偏移量代表了某个具体的时间值与UTC时间之间的差异。用 `±[hh]:[mm] 、 ±[hh][mm] 、±[hh]` 的形式表示。比如北京时间的时区会表达成 `+08:00、+0800 、UTC+8` 。

一个时区中往往会包含多个偏移量，而多个时区可能在一年的某些时间有相同的偏移量。比如 `America/Chicago、America/Denver、America/Belize` 在一年中不同的时间都会包含 `-06:00 `这个偏移。



### 日期时间字符串格式

**日期格式的字符串必须符合 [RFC2822](http://tools.ietf.org/html/rfc2822#page-14) 或 ISO 8601标准。**

其他非标准格式也许也支持，但结果可能与预期不符。

`ECMAScript `规范规定：如果一个字符串不符合标准格式，则函数可以使用任何由引擎决定的策略或解析算法。

#### [RFC 2822标准](https://tools.ietf.org/html/rfc2822#section-3.3)（推荐）

`RFC 2822`标准指定了在计算机用户之间发送的电子邮件时的文本消息的语法。

  ~~~js
YYYY/MM/DD HH:MM:SS ±timezone(时区用4位数字表示)
//2020/05/31 15:15:30.500 +0800

YYYY = 4位数年份
month = 2位数月份或者'Jan/Feb/Mar/Apr/May/Jun/Jul/Aug/Sep/Oct/Nov/Dec'
day = 2位数日期
hour = 小时的2位数
minute = 分钟的2位数
second = 秒的2位数
timezone = ±4位数时区，即±[hh][mm]

/*
以下皆为chrome测试结果。By lizhao，2020/05/31
*/

//未指定时区，以本地时区解析
new Date('2020/05/31 15:15:30.500') //本地时区（东八区），Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020/05/31 15:15:30.500Z') //UTC时间，Sun May 31 2020 23:15:30 GMT+0800 (中国标准时间)
new Date('2020/05/31 15:15:30.500 +0100') //东一区Sun May 31 2020 22:15:30 GMT+0800 (中国标准时间)

//毫秒可以是【:】或【.】分隔，标准中未说明
new Date('2020/05/31 15:15:30:500') //Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020/05/31 15:15:30.500') //Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)


//RFC 2822的兼容性比较好
//年、月、日的【/】前后可以有空格，时、分、秒不可以
new Date('2020 / 05 / 31 15:15:30:500') //Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020 / 05 / 31 15 : 15 : 30: 500') //Invalid Date
//用英文指定月份，好像是做英文简写的不区分大小写的字符匹配？？？
//以下都可以正常返回结果：Thu Feb 20 2020 00:00:00 GMT+0800 (中国标准时间)
new Date('2020/February/20')
new Date('2020/FEBRUARY/20')
new Date('2020/Februar/20')
new Date('2020/Februa/20')
new Date('2020/Febru/20')
new Date('2020/Febr/20')
new Date('2020/Feb/20')
new Date('2020/Febaaaa/20')
//以下报错，Invalid Date
new Date('2020/Fe/20') 
  ~~~

#### [ISO 8601标准](https://www.w3.org/TR/NOTE-datetime)

国际标准化组织的国际标准`ISO 8601`是日期和时间的表示方法，全称为《数据存储和交换形式·信息交换·日期和时间的表示方法》。目前最新为第三版ISO8601:2004，第一版为ISO8601:1988，第二版为ISO8601:2000。年由4位数组成，以公历公元1年为0001年，以公元前1年为0000年，公元前2年为-0001年，其他以此类推。应用其他纪年法要换算成公历，但如果发送和接受信息的双方有共同一致同意的其他纪年法，可以自行应用。

**注意：IOS 8601标准日期字符串，不能有空格。**

````js
YYYY-MM-DDThh:mm:ss.sTZD
//2020-05-31T15:15:30.500+08:00

YYYY = 四位数年份
MM = 两位数的月份（01 =一月，依此类推）
DD = 两位数字的月份（01到31）
hh = 小时的两位数（00到23）（不允许上午/下午）
mm = 分钟的两位数（00到59）
ss = 秒的两位数字（00到59）
s = 一个或多个数字，代表秒的小数部分
TZD = 时区指示符，Z或±[hh]:[mm]

/*
以下皆为chrome测试结果。By lizhao，2020/05/31
*/

//指定时区
new Date('2020-05-31T15:15:30.500Z')
//【Z】表示UTC标准时区，即"00:00"
//输出结果（东八区）：Sun May 31 2020 23:15:30 GMT+0800 (中国标准时间)
new Date('2020-05-31T15:15:30.500+01:00')
//【+01:00】表示东一区
//输出结果（东八区）：Sun May 31 2020 22:15:30 GMT+0800 (中国标准时间)

//不指定时区
new Date('2020-05-31') //解析为UTC时间：Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
new Date('2020-5-31') //以本地时区解析：Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
new Date('2020-05-31T15:15:30.500') //以本地时区解析：Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020-5-31T15:15:30.500') //报错：Invalid Date。因为字符串中，月份只有1位数。
````

* 日期与时间之间用【T】分隔，以指示时间元素的开始。标准是大写(T)，chrome中小写(t)也可以解析。
* 时区以UTC（世界标准时间）表示，并带有特殊的UTC标记（“ Z”）。

* 时区偏移量为 `+ hh:mm` 表示日期/时间使用的本地时区比UTC提前 `hh `小时和 `mm `分钟。时区偏移量为` -hh:mm` 表示日期/时间使用本地时区，该时区比UTC落后 `hh `小时和 `mm `分钟。

#### 两者之间的差别

* **ISO 8601标准的兼容性比RFC 2822差得多。IE8、Safari、iOS均不支持ISO 8601。**一般情况下建议用RFC 2822格式的。

* **未指定时区并且不符合ISO 8601标准，默认使用本地时区。**

  只有一种情况会以UTC时间的零点为标准进行解析：**未指定时区，只有日期格式，没有时间格式，且符合ISO 8601标准的字符串。**

  注：这个只是ES5的标准而已，在ES6里这两种形式都会变成当前时区的零点为基准

  ```js
  //以UTC时间的零点为标准进行解析
  new Date('2020-05-31') //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
  
  //以下全部以本地时区为标准进行解析
  new Date('2020/05/31') //RFC 2822标准：Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  new Date('2020-5-31') //非ISO 8601标准：Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  new Date("May 31, 2020") //非标准格式: Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  ```

* RFC2822 的时区表示用四位数字 `±[hh][mm](+0800)`，而 ISO 8601 的时区表示用` ±[hh]:[mm](+08:00)`

  ```js
  //+0800不是标准IOS 8601写法。
  //chrome浏览器、安卓中正常，Ios中获取时间出错。
  new Date("2018-11-12T00:00:00+0800")
  ```

#### 其他非标准格式

```js
new Date("May 31, 2020") //Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
new Date("31 May, 2020") //Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)

new Date("Sun, 31 May 2020 00:00:00 GMT") //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
new Date("Sun May 31 2020 00:00:00 GMT") //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
new Date("Sun, 31 May 2020 00:00:00 +0000") //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
new Date("Sun, 31 May 2020 00:00:00 +00:00")  //Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)

//注意月份与日期的顺序。以数字表示月份、日期时，月份在前。
new Date("05 31, 2020") //Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
new Date("31 05, 2020") //Invalid Date
new Date("12 05, 2020") //Sat Dec 05 2020 00:00:00 GMT+0800 (中国标准时间)
```



### 时间对象的夏令时问题

执行命令：`new Date(584290800000) `（当前东八时区）

执行结果：`Fri Jul 08 1988 00:00:00 GMT+0900 (CDT)` (变成东九时区)

```js
//safari、IOS
new Date(584290800000)
Thu Jul 07 1988 23:00:00 GMT+0800 (CST)

//Android | chrome
new Date(584290800000)
Fri Jul 08 1988 00:00:00 GMT+0900 (中国夏令时间)
```

导致不同环境获取的日期不一样：

```js
//safari、IOS
new Date(584290800000).getDate() //7

//Android | chrome
new Date(584290800000).getDate() //8
```

夏令时的原因，不同浏览器解析夏令时间的时间戳的返回结果有差异。在安卓或chrome中，解析为`Sat Sep 10 1988 00:00:00 GMT+0900 (中国夏令时间)`(东九区)，但在IOS或safari中，解析为`Thu Jul 07 1988 23:00:00 GMT+0800 (CST)（东八区）`。

#### 什么是夏令时？

夏时制，夏时令（Daylight Saving Time：DST），又称“日光节约时制”和“夏令时间”，是一种为节约能源而人为规定地方时间的制度，在这一制度实行期间所采用的统一时间称为“夏令时间”。一般在天亮早的夏季人为将时间提前一小时，可以使人早起早睡，减少照明量，以充分利用光照资源，从而节约照明用电。各个采纳夏时制的国家具体规定不同。目前全世界有近110个国家每年要实行夏令时。

1986年至1991年，中华人民共和国在全国范围实行了六年夏令时，每年从4月中旬的第一个星期日2时整（北京时间）到9月中旬第一个星期日的凌晨2时整（北京夏令时）。除1986年因是实行夏令时的第一年，从5月4日开始到9月14日结束外，其它年份均按规定的时段施行。夏令时实施期间，将时间调快一小时。1992年4月5日后不再实行。

#### 解决方法

* 不存储时间戳，存时间字符串。

* 时间精确到天的，可以手动加1~2个小时。

  ```js
  new Date(584290800000 + 2* 60 * 60 * 1000)
  ```

  

### 其他常见问题

#### 日期的运算

类型自动转换时，`Date`实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。

两个日期实例对象进行减法运算时，返回的是它们间隔的毫秒数；进行加法运算时，返回的是两个字符串连接而成的新字符串。

```js
let DateA = new Date(2020, 4, 30)
let DateB = new Date(2020, 4, 1)
console.log(DateA - DateB) //2505600000
console.log(DateA + DateB) //Sat May 30 2020 00:00:00 GMT+0800 (中国标准时间)Fri May 01 2020 00:00:00 GMT+0800 (中国标准时间)
```

**注：不能用 == 或 === 判断时间对象是否表示同一时间**

```js
let DateA = new Date(2020, 4, 30)
let DateB = new Date(2020, 4, 30)

//实际是两个对象对比。对比的是变量中存的栈内存的地址
DateA == DateB //false
DateA === DateB //false

//可以在运算后，转化成时间戳再对比
+DateA == +DateB //true
+DateA === +DateB //true
```

#### getTime()与parse()的区别

`Date.parse()`虽然声称是返回日期与 1970 年 1 月 1 日午夜之间所间隔的毫秒数，但是实际上返回的是精确到秒的毫秒数，而并非实际的毫秒。并且这个数字是非四舍五入的，也就是即使是1秒999毫秒，也按照1000毫秒来输出。
而`getTime()`则返回实际毫秒数。

```js
let DateA = new Date(2020, 4, 30, 8, 0, 0, 300)
DateA.getTime() //1590796800300
Date.parse(DateA) //1590796800000
```

#### 生日算年龄

```js
/*
函数：根据生日算年龄
参数：
 - birth为Date对象|时间字符串|时间戳
 - d为指定时间，不传默认为当前时间
*/
function getAgeFromBirth (birth, d = new Date()) {
	if (birth === undefined || birth === null || birth > d) {
		return -1
	}
    let curDate = new Date(d)
    let birthDate = new Date(birth)
    let age = curDate.getFullYear() - birthDate.getFullYear()
    if (curDate.getMonth() < birthDate.getMonth() || (curDate.getMonth() === birthDate.getMonth() && curDate.getDate() < birthDate.getDate()) ) {
        age --
    }
    return age
}
```

#### Date解析为时间字符

```js
/*
函数：Date对象|时间字符串|时间戳，转换成指定格式的时间字符串
参数：
 - time为Date对象|时间字符串|时间戳
 - cFormat String。指定返回的字符串格式
*/
function parseTime (time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
    if (time === undefined || time === null) {
        return null
    }
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10){
            time = parseInt(time) * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = cFormat.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}
```



### 参考链接

[JavaScript 标准内置对象 Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

[JavaScript 时间与日期处理实战:你肯定被坑过](https://segmentfault.com/a/1190000007581722)