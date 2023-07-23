## Date对象和日期时间字符串格式

JavaScript 的时间由世界标准时间（UTC）1970年1月1日开始，用毫秒计时，一天由 86,400,000 毫秒组成。Date 对象的范围是相对距离 UTC 1970年1月1日 的前后 100,000,000 天，即前后 1 亿天。

### 时间相关的一些概念

#### GMT时间

**GMT即「格林威治标准时间」（Greenwich Mean Time，简称G.M.T.）**，指位于英国伦敦郊区的皇家格林威治天文台的标准时间，因为本初子午线被定义为通过那里的经线。然而由于地球的不规则自转，导致 GMT 时间有误差，因此**目前已不被当作标准时间使用。**

#### UTC时间

**UTC 是最主要的世界时间标准，** 是经过平均太阳时（以格林威治时间 GMT 为准）、地轴运动修正后的新时标以及以「秒」为单位的国际原子时所综合精算而成的时间。UTC 比 GMT 来得更加精准。其误差值必须保持在 0.9 秒以内，若大于 0.9 秒则由位于巴黎的国际地球自转事务中央局发布闰秒，使 UTC 与地球自转周期一致。

**理论上，UTC 与 GMT 时间是相等的（除非出现了闰秒，日常使用上可以忽略不计）。**

#### 时区的概念

时区是地球上的区域使用同一个时间定义。以前，人们通过观察太阳的位置（时角）决定时间，这就使得不同经度的地方的时间有所不同（地方时）。1863年，首次使用时区的概念。时区通过设立一个区域的标准时间部分地解决了这个问题。

整个地球分为二十四时区，每个时区都有自己的本地时间 。

**本地时间 = 标准时间 + 时区差（东为正，西为负）**

#### 时区表示法

如果时间是以协调世界时（UTC）表示，则在时间后面直接加上一个 “Z”（不加空格）。“Z” 是协调世界时中 0 时区的标志。

```javascript
// 09:30 UTC
09:30Z
0930Z

// 14:45:15 UTC
14:45:15Z
144515Z
```

UTC 时间也被叫做祖鲁时间，因为在北约音标字母中用 “Zulu” 表示 “Z”。

#### UTC偏移量

UTC 偏移量代表了某个具体的时间值与 UTC 时间之间的时区差异。用 `±[hh]:[mm] 、 ±[hh][mm] 、±[hh]` 的形式表示。

```javascript
// 北京时间的时区
+08:00
+0800
UTC+8
```

一个时区中往往会包含多个偏移量，而多个时区可能在一年的某些时间有相同的偏移量。

比如 `America/Chicago、America/Denver、America/Belize` 在一年中不同的时间都会包含 `-06:00 `这个偏移。

### Date对象

JavaScript 没有日期数据类型，但是可以使用 Date 对象和其方法来处理日期和时间。Date 对象有大量的设置、获取和操作日期的方法。

#### 构造函数用法

创建一个新 Date 对象的唯一方法是通过 new 操作符。

Date 构造函数有四种基本形式：

##### 没有参数

如果没有提供参数，那么新创建的 Date 对象表示实例化时刻的日期和时间。

```js
new Date() // Tue May 24 2022 22:24:58 GMT+0800 (中国标准时间)
```

##### Unix 时间戳

Unix 时间戳（Unix Time Stamp）是一个整数值，表示自 1970年1月1日00:00:00 UTC（the Unix epoch）以来的**毫秒**数，忽略了闰秒。

**请注意：** 大多数 Unix 时间戳功能仅精确到最接近的秒。

**注意：** 时间戳必须是 Number 类型，String 类型返回 `Invalid Date`。

```js
new Date(1653402623348)   // Tue May 24 2022 22:30:23 GMT+0800 (中国标准时间)
new Date('1653402623348') // Invalid Date
```

##### 时间戳字符串

时间戳字符串是一个表示日期的字符串值。该字符串必须是能被 Date.parse() 解析，即符合 [IETF-compliant RFC 2822 timestamps](http://tools.ietf.org/html/rfc2822#page-14) 或 [version of ISO8601](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15)。

**注意:** 由于浏览器差异和不一致性，强烈建议不要使用 Date 构造函数或者 Date.parse 解析日期字符串。

```javascript
new Date('1970-01-02') // Fri Jan 02 1970 08:00:00 GMT+0800 (中国标准时间)
new Date('1970-1-02')  // Fri Jan 02 1970 00:00:00 GMT+0800 (中国标准时间)

new Date('1970-01-02').toUTCString() // 'Fri, 02 Jan 1970 00:00:00 GMT'
new Date('1970-1-02').toUTCString()  // 'Thu, 01 Jan 1970 16:00:00 GMT'
```

##### 分别提供日期与时间的每一个成员

该传参形式至少需要提供年份与月份两个参数。如果只传一个参数，会被解析为时间戳。

```js
new Date(2022)    // Thu Jan 01 1970 08:00:02 GMT+0800 (中国标准时间)
new Date(2022, 0) // Sat Jan 01 2022 00:00:00 GMT+0800 (中国标准时间)
```

该传参形式的每一个成员都来自下列参数，有些参数可以省略，默认将使用最小可能值（日期为 1 ，其他 0 ）：

- **year：** 表示年份的整数值。0 到 99 会被映射至 1900 年至 1999 年，其它值代表实际年份。

- **month：** 表示月份的整数值，从 0~11（1月~12月）。

- **day（可选）：** 表示一个月中的第几天的整数值，从 1 开始，默认值为 1。

- **hours（可选）：** 表示一天中的小时数的整数值（24小时制），默认值为 0。

- **minutes（可选）：** 表示一个小时内的分钟部分的整数值，默认值为 0。

- **seconds（可选）：** 表示一分钟内的秒部分的整数值，默认值为 0。

- **milliseconds（可选）：** 表示一秒内的毫秒部分的整数值，默认值为 0。

**注意：**当 Date 构造函数调用并传入多个参数时，如果数值大于合理范围时（如：月份为 13 或者分钟数为 70），相邻的数值会被调整。

```javascript
new Date(2021, 13, 1) // Tue Feb 01 2022 00:00:00 GMT+0800 (中国标准时间)
new Date(2022, 1, 1)  // Tue Feb 01 2022 00:00:00 GMT+0800 (中国标准时间)

new Date(2021, 13, 1, 8, 70) // Tue Feb 01 2022 09:10:00 GMT+0800 (中国标准时间)
new Date(2022, 13, 1, 9, 10) // Wed Feb 01 2023 09:10:00 GMT+0800 (中国标准时间)
```

**注意：**当 Date 构造函数调用并传入多个参数时，所定义参数代表的是当地时间。

```javascript
new Date(2019, 4, 30).getTime() // 1559145600000
new Date(2019, 4, 30)           // Thu May 30 2019 00:00:00 GMT+0800 (中国标准时间)

new Date(Date.UTC(2019, 4, 30)).getTime() // 1559174400000
new Date(Date.UTC(2019, 4, 30)) // Thu May 30 2019 08:00:00 GMT+0800 (中国标准时间)
```

**注意：** Date 对象为跨平台提供了统一的行为。时间属性可以在不同的系统中表示相同的时刻，而如果使用了本地时间对象，则反映当地的时间。

**注意：** Date 对象有处理 UTC 时间的方法，也有处理当地时间的方法。UTC，也就是我们所说的格林威治时间，指的是 time 中的世界时间标准。而**当地时间则是指执行 JavaScript 的客户端电脑所设置的时间**。

#### 常规函数调用

Date 可以当作普通函数来使用。

**不管是否带有参数**，返回的都是调用函数时刻的时间和日期的字符串：

```js
Date()           // 'Tue May 24 2022 22:59:56 GMT+0800 (中国标准时间)'
Date(2020, 1, 1) // 'Tue May 24 2022 23:01:41 GMT+0800 (中国标准时间)'
```

### 属性

* prototype： 允许为 Date 对象添加属性。

* length： 返回值是，即构造函数可接受的参数个数。

### 方法

#### now()

now() 返回自 1970-1-1 00:00:00  UTC（世界标准时间）至今所经过的毫秒数。

**注意：** 为了提供针对定时攻击和指纹追踪的保护，`Date.now()` 的精度可能会根据浏览器的高级设置项目而被取整。

```js
Date.now() // 1653404883751
```

#### parse()

parse() 解析一个表示某个日期的字符串，并返回从1970-1-1 00:00:00 UTC 到该日期对象的 UTC 时间的毫秒数。

该方法参数必须是一个符合 RFC2822 或 ISO 8601 日期格式的字符串（其他格式也许也支持，但结果可能与预期不符）。如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值，则有可能返回 NaN，或者 UTC 时间，或者本地时间。

```javascript
Date.parse('2020-05-31 15:30:00')
```

**不推荐在ES5之前使用 Date.parse 方法**，因为字符串的解析完全取决于实现。直到至今，不同宿主在如何解析日期字符串上仍存在许多差异，因此最好还是手动解析日期字符串。   

#### UTC()

UTC() 接受的参数同 Date 构造函数一样，返回从1970-1-1 00:00:00 UTC 到指定日期的的毫秒数。

```js
Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
```

```javascript
Date.UTC(2022, 1, 1) // 1643673600000
```

### 实例属性

* constructor： 返回实例构造函数的引用，即 Date 构造函数。

### 实例方法

#### valueOf()

valueOf 方法返回实例对象距离 1970年1月1日00:00:00 UTC 对应的毫秒数，返回值与 getTime() 方法相同。

#### get 类方法（共19个）

| 方法                | 描述                                            |
| :------------------ | :---------------------------------------------- |
| getYear()           | 请使用 getFullYear() 方法代替。                 |
| getTime()           | 返回 1970 年 1 月 1 日至今的毫秒数。            |
| getTimezoneOffset() | 返回本地时间与格林威治标准时间 (GMT) 的分钟差。 |

```js
new Date().getTimezoneOffset() // -480
// -480 表示 UTC 比当前时间少 480 分钟，即当前时区比 UTC 早8个小时。
```

根据本地时间，返回实例对象年、月、日、时、分、秒、毫秒、周的值（共8个）：

| 方法              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| getFullYear()     | 返回四位数字年份                                             |
| getMonth()        | 返回月份（0~11）                                             |
| getDate()         | 回一个月中的某一天（1~31）                                   |
| getHours()        | 返回小时（0~23）                                             |
| getMinutes()      | 返回分钟（0~59）                                             |
| getSeconds()      | 返回秒数（0~59）                                             |
| getMilliseconds() | 返回毫秒（0~999）                                            |
| getDay()          | 返回一周中的某一天（0~6）。 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推。 |

根据世界时，返回实例对象年、月、日、时、分、秒、毫秒、周的值（共8个）：

| 方法                 | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| getUTCFullYear()     | 根据世界时，返回四位数的年份                                 |
| getUTCMonth()        | 根据世界时，返回月份（0~11）                                 |
| getUTCDate()         | 根据世界时，返回月中的一天（1 ~ 31）                         |
| getUTCHours()        | 根据世界时，返回小时（0~23）                                 |
| getUTCMinutes()      | 根据世界时，返回分钟（0~59）                                 |
| getUTCSeconds()      | 根据世界时，返回秒钟（0 ~ 59）                               |
| getUTCMilliseconds() | 根据世界时，返回毫秒（0 ~ 999）                              |
| getUTCDay()          | 根据世界时，返回一周中的某一天（0~6）。 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推。 |

#### set 类方法(共16个)

| 方法      | 描述                            |
| --------- | ------------------------------- |
| setTime() | 以毫秒设置 Date 对象。          |
| setYear() | 请使用 setFullYear() 方法代替。 |

设置实例对象的年、月、日、时、分、秒、毫秒的值（共7个）：

**注：没有`setDay`方法，因为星期几是计算出来的，而不是设置的。**

| 方法              | 描述                                 |
| ----------------- | ------------------------------------ |
| setFullYear()     | 设置 Date 对象中的年份（四位数字）   |
| setMonth()        | 设置 Date 对象中月份（0~11）         |
| setDate()         | 设置 Date 对象中月的某一天（1 ~ 31） |
| setHours()        | 设置 Date 对象中的小时（0 ~ 23）     |
| setMinutes()      | 设置 Date 对象中的分钟（0 ~ 59）     |
| setSeconds()      | 设置 Date 对象中的秒钟（0 ~ 59）     |
| setMilliseconds() | 设置 Date 对象中的毫秒（0 ~ 999）    |

 根据世界时，设置实例对象的年、月、日、时、分、秒、毫秒的值（共7个）：

| 方法                 | 描述                                            |
| -------------------- | ----------------------------------------------- |
| setUTCFullYear()     | 根据世界时， 设置 Date 对象中的年份（四位数字） |
| setUTCMonth()        | 根据世界时，设置 Date 对象中月份（0~11）        |
| setUTCDate()         | 根据世界时，Date 对象中月份的一天 (1 ~ 31)。    |
| setUTCHours()        | 根据世界时，设置 Date 对象中的小时（0 ~ 23）    |
| setUTCMinutes()      | 根据世界时，设置 Date 对象中的分钟（0 ~ 59）    |
| setUTCSeconds()      | 根据世界时，设置 Date 对象中的秒钟（0 ~ 59）    |
| setUTCMilliseconds() | 根据世界时，设置 Date 对象中的毫秒（0 ~ 999）   |

```js
const dateA = new Date('2020-05-31')

dateA // Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
dateA.setFullYear(2030)
dateA // Fri May 31 2030 08:00:00 GMT+0800 (中国标准时间)
```

set 类方法和 get 类方法，可以结合使用，得到相对时间：

```js
const dateA = new Date('2020-05-31')

dateA.setDate(dateA.getDate() + 1000) // 设置1000天以后
dateA // Sat Feb 25 2023 08:00:00 GMT+0800 (中国标准时间)

dateA.setFullYear(dateA.getFullYear() + 1) // 设置1年以后
dateA // Sun Feb 25 2024 08:00:00 GMT+0800 (中国标准时间)
```

#### to 类方法（共12个）

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| toString()           | 返回一个表示该日期对象的字符串                               |
| toUTCString()        | 把一个日期对象转换为一个以 UTC 时区计时的字符串。            |
| toISOString()        | 把一个日期转换为符合 ISO 8601 扩展格式的字符串。注意：返回的总是 UTC 时区的时间。 |
| toJSON()             | 与 toISOString 方法的返回结果完全相同。默认情况下，这个方法常用于 JSON 序列化 Date 对象。 |
| toLocaleString()     | 返回一个表示该日期对象的字符串，该字符串与系统设置的地区关联。 |
| toDateString()       | 以人类易读（human-readable）的形式返回该日期对象日期部分的字符串。 |
| toLocaleDateString() | 返回一个表示该日期对象日期部分的字符串，该字符串格式与系统设置的地区关联。 |
| toTimeString()       | 以人类易读格式返回日期对象时间部分的字符串。                 |
| toLocaleTimeString() | 返回一个表示该日期对象时间部分的字符串，该字符串格式与系统设置的地区关联。 |
| ~~toGMTString()~~    | ~~返回一个基于 GMT (UT) 时区的字符串来表示该日期。请使用 toUTCString() 方法代替。~~ |
| ~~toSource()~~       | ~~返回一个与Date等价的原始字符串对象，你可以使用这个值去生成一个新的对象。重写了 Object.prototype.toSource() 这个方法。 注：该特性是非标准的，请尽量不要在生产环境中使用它！~~ |
| ~~toLocaleFormat()~~ | ~~使用格式字符串将日期转换为字符串。该特性是非标准的，请尽量不要在生产环境中使用它！~~ |

```js
const date = new Date(2020, 5, 30)
date.toString()    // Sat May 30 2020 00:00:00 GMT+0800 (中国标准时间)
date.toUTCString() // Fri, 29 May 2020 16:00:00 GMT
date.toISOString() // 2020-05-29T16:00:00.000Z
date.toJSON()      // 2020-05-29T16:00:00.000Z
date.toLocaleString() // 2020/5/30 上午12:00:00
date.toDateString()   // Sat May 30 2020
date.toLocaleDateString() // 2020/5/30
date.toTimeString()       // 00:00:00 GMT+0800 (中国标准时间)
date.toLocaleTimeString() // 上午12:00:00
```

toLocaleDateString()、toLocaleString()、toLocaleTimeString() 返回的字符串格式因不同语言而不同。

新增的参数 locales  和 options 使程序能够指定使用哪种语言格式化规则，允许定制该方法的表现。在旧版本浏览器中，locales  和 options 参数被忽略，使用的语言环境和返回的字符串格式是各自独立实现的。

```js
const DateA = new Date(2020, 4, 30)
const options = {
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: true
}
DateA.toLocaleTimeString()                 // 上午12:00:00
DateA.toLocaleTimeString("cn", options)    // UTC 下午4:00:00
DateA.toLocaleTimeString("en-US", options) // 4:00:00 PM UTC
```

### 日期时间字符串格式

**日期格式的字符串必须符合 [RFC2822](http://tools.ietf.org/html/rfc2822#page-14) 或 ISO 8601标准，** 其他非标准格式也许也支持，但结果可能与预期不符。

ECMAScript 规范规定：如果一个字符串不符合标准格式，则函数可以使用任何由引擎决定的策略或解析算法。

#### [RFC 2822标准](https://tools.ietf.org/html/rfc2822#section-3.3)（推荐）

RFC 2822 标准指定了在计算机用户之间发送的电子邮件时的文本消息的语法。

  ~~~js
YYYY/MM/DD HH:MM:SS ±timezone(时区用4位数字表示)
// 2020/05/31 15:15:30.500 +0800

YYYY   = 4位数年份
month  = 2位数月份或者 'Jan/Feb/Mar/Apr/May/Jun/Jul/Aug/Sep/Oct/Nov/Dec'
day    = 2位数日期
hour   = 小时的2位数
minute = 分钟的2位数
second = 秒的2位数
timezone = ±4位数时区，即±[hh][mm]

// 以下皆为Chrome测试结果。By lizhao，2020/05/31

// 未指定时区，以本地时区解析
new Date('2020/05/31 15:15:30.500')
// 本地时区（东八区）：Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020/05/31 15:15:30.500Z')
// UTC 时间：Sun May 31 2020 23:15:30 GMT+0800 (中国标准时间)
new Date('2020/05/31 15:15:30.500 +0100')
// 东一区：Sun May 31 2020 22:15:30 GMT+0800 (中国标准时间)

// 毫秒可以是【:】或【.】分隔，标准中未说明
new Date('2020/05/31 15:15:30:500')
new Date('2020/05/31 15:15:30.500')
// Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
  ~~~

RFC 2822 的兼容性比较好：

```javascript
// 年、月、日的【/】前后可以有空格，时、分、秒不可以
new Date('2020 / 05 / 31 15:15:30:500') // Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020 / 05 / 31 15 : 15 : 30: 500') // Invalid Date

// 用英文指定月份，好像是做英文简写的不区分大小写的字符匹配？？？
// 以下都可以正常返回结果：Thu Feb 20 2020 00:00:00 GMT+0800 (中国标准时间)
new Date('2020/February/20')
new Date('2020/FEBRUARY/20')
new Date('2020/Februar/20')
new Date('2020/Februa/20')
new Date('2020/Febru/20')
new Date('2020/Febr/20')
new Date('2020/Feb/20')
new Date('2020/Febaaaa/20')

// 以下报错
new Date('2020/Fe/20') // Invalid Date
```

#### [ISO 8601标准](https://www.w3.org/TR/NOTE-datetime)

国际标准化组织的国际标准 ISO 8601 是日期和时间的表示方法，全称为《数据存储和交换形式·信息交换·日期和时间的表示方法》。

目前最新为第三版 ISO8601:2004，第一版为 ISO8601:1988，第二版为 ISO8601:2000。年由 4 位数组成，以公历公元 1 年为 0001年，以公元前 1 年为 0000 年，公元前 2 年为 -0001 年，其他以此类推。应用其他纪年法要换算成公历，但如果发送和接受信息的双方有共同一致同意的其他纪年法，可以自行应用。

**注意：IOS 8601标准日期字符串，不能有空格。**

````js
YYYY-MM-DDThh:mm:ss.sTZD
// 2020-05-31T15:15:30.500+08:00

YYYY = 四位数年份
MM = 两位数的月份（01 =一月，依此类推）
DD = 两位数字的月份（01到31）
hh = 小时的两位数（00到23）（不允许上午/下午）
mm = 分钟的两位数（00到59）
ss = 秒的两位数字（00到59）
s = 一个或多个数字，代表秒的小数部分
TZD = 时区指示符，Z或±[hh]:[mm]

// 以下皆为Chrome测试结果。By lizhao，2020/05/31

// 指定时区
new Date('2020-05-31T15:15:30.500Z')      // Z 表示 UTC 标准时区，即"00:00"
// 本地时间（东八区）：Sun May 31 2020 23:15:30 GMT+0800 (中国标准时间)
new Date('2020-05-31T15:15:30.500+01:00') // +01:00 表示东一区
// 本地时间（东八区）：Sun May 31 2020 22:15:30 GMT+0800 (中国标准时间)

//不指定时区
new Date('2020-05-31') // 解析为UTC时间：Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
new Date('2020-5-31')  // 以本地时区解析：Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
new Date('2020-05-31T15:15:30.500') // 以本地时区解析：Sun May 31 2020 15:15:30 GMT+0800 (中国标准时间)
new Date('2020-5-31T15:15:30.500') // 报错：Invalid Date。因为字符串中，月份只有 1 位数。
````

* 日期与时间之间用【T】分隔，以指示时间元素的开始。标准是大写（T），Chrome 中小写（t）也能解析。
* 时区以 UTC（世界标准时间）表示，并带有特殊的 UTC 标记（“ Z”）。

* 时区偏移量：`+ hh:mm` 表示日期/时间使用的本地时区比 UTC 提前 hh 小时和 mm 分钟；`-hh:mm` 表示日期/时间使用本地时区，该时区比 UTC 落后 hh 小时和 mm 分钟。

#### 两者区别

* **ISO 8601 标准的兼容性比 RFC 2822 差得多。IE8、Safari、iOS 均不支持 ISO 8601。**一般情况下建议用 RFC 2822 格式的。

* **未指定时区并且不符合 ISO 8601 标准，默认使用本地时区。**

  只有一种情况会以 UTC 时间的零点为标准进行解析：**未指定时区，只有日期格式，没有时间格式，且符合 ISO 8601 标准的字符串。**

  **注：** 这个只是ES5的标准而已，在 ES6 里这两种形式都会变成当前时区的零点为基准。

  ```js
  // 以 UTC 时间的零点为标准进行解析
  new Date('2020-05-31') // Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)
  
  // 以下全部以本地时区为标准进行解析
  new Date('2020/05/31')   // RFC 2822 标准
  // Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  new Date('2020-5-31')    // 非 ISO 8601 标准
  // Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  new Date("May 31, 2020") // 非标准格式
  // Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
  ```

* RFC2822 的时区表示用四位数字 `±[hh][mm](+0800)`，而 ISO 8601 的时区表示用 ` ±[hh]:[mm](+08:00)`

  ```js
  // +0800 不是标准 IOS 8601 写法。
  // Chrome 浏览器、安卓中正常，Ios 中获取时间出错。
  new Date("2018-11-12T00:00:00+0800")
  ```

#### 其他非标准格式

```js
new Date("May 31, 2020")
new Date("31 May, 2020")
// Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)

new Date("Sun, 31 May 2020 00:00:00 GMT")
new Date("Sun May 31 2020 00:00:00 GMT")
new Date("Sun, 31 May 2020 00:00:00 +0000")
new Date("Sun, 31 May 2020 00:00:00 +00:00")
// Sun May 31 2020 08:00:00 GMT+0800 (中国标准时间)

// 注意月份与日期的顺序。以数字表示月份、日期时，月份在前。
new Date("05 31, 2020") // Sun May 31 2020 00:00:00 GMT+0800 (中国标准时间)
new Date("31 05, 2020") // Invalid Date
new Date("12 05, 2020") // Sat Dec 05 2020 00:00:00 GMT+0800 (中国标准时间)
```

### 夏令时问题

不同宿主环境下，new Date 创建的对象，返回的时间相差一个时区，导致获取的日期也相差一天：

```javascript
new Date('1988-07-07T00:00:00.00') // Thu Jul 07 1988 00:00:00 GMT+0900 (中国夏令时间)
new Date(584290800000)             // Fri Jul 08 1988 00:00:00 GMT+0900 (中国夏令时间
```

```js
//safari、IOS
new Date(584290800000) // Thu Jul 07 1988 23:00:00 GMT+0800 (CST)
new Date(584290800000).getDate() // 7

//Android | chrome
new Date(584290800000) // Fri Jul 08 1988 00:00:00 GMT+0900 (中国夏令时间)
new Date(584290800000).getDate() // 8
```

这是夏令时的原因，不同浏览器解析夏令时间的时间戳的返回结果有差异。

#### 什么是夏令时？

夏时制，夏时令（Daylight Saving Time：DST），又称“日光节约时制”和“夏令时间”，是一种为节约能源而人为规定地方时间的制度，在这一制度实行期间所采用的统一时间称为“夏令时间”。一般在天亮早的夏季人为将时间提前一小时，可以使人早起早睡，减少照明量，以充分利用光照资源，从而节约照明用电。各个采纳夏时制的国家具体规定不同。目前全世界有近 110 个国家每年要实行夏令时。

**夏令时实施期间，将时间调快一小时。**

1986年至1991年，中华人民共和国在全国范围实行了六年夏令时，每年从 4 月中旬的第一个星期日 2 时整（北京时间）到 9 月中旬第一个星期日的凌晨 2 时整（北京夏令时）。除 1986 年因是实行夏令时的第一年，从 5 月 4 日开始到 9 月 14 日结束外，其它年份均按规定的时段施行。1992 年 4 月 5 日后不再实行。

#### 解决方法

* 不存储时间戳，存时间字符串。

* 如果时间只要求精确到日期，可以手动加 1~2 个小时，确定取出的日期值一样。


### 其他常见问题

#### 日期的运算

类型自动转换时，Date实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。

两个日期实例对象进行减法运算时，返回的是它们间隔的毫秒数；进行加法运算时，返回的是两个字符串连接而成的新字符串。

```js
let DateA = new Date(2020, 4, 30)
let DateB = new Date(2020, 4, 1)
console.log(DateA - DateB) // 2505600000
console.log(DateA + DateB) // Sat May 30 2020 00:00:00 GMT+0800 (中国标准时间)Fri May 01 2020 00:00:00 GMT+0800 (中国标准时间)
```

**注：不能用 == 或 === 判断时间对象是否表示同一时间**

```js
const DateA = new Date(2020, 4, 30)
const DateB = new Date(2020, 4, 30)

// 实际是两个对象对比。对比的是变量中存的栈内存的地址
DateA == DateB  // false
DateA === DateB // false

// 可以在运算后，转化成时间戳再对比
+DateA == +DateB  // true
+DateA === +DateB // true
```

#### getTime()与parse()的区别

Date.parse() 虽然声称是返回日期与 1970 年 1 月 1 日午夜之间所间隔的毫秒数，但是实际上返回的是精确到秒的毫秒数，而并非实际的毫秒。并且这个数字是非四舍五入的，也就是即使是 1 秒 999 毫秒，也按照 1000 毫秒来输出。
而 getTime() 则返回实际毫秒数。

```js
const DateA = new Date(2020, 4, 30, 8, 0, 0, 300)
DateA.getTime()   // 1590796800300
Date.parse(DateA) // 1590796800000
```

#### 生日换算年龄

```js
function getAgeFromBirth(birth, d = new Date()) {
    if (birth === undefined || birth === null || birth > d) {
        return -1
    }
    const curDate = new Date(d)
    const birthDate = new Date(birth)
    let age = curDate.getFullYear() - birthDate.getFullYear()
    if (curDate.getMonth() < birthDate.getMonth() || (curDate.getMonth() === birthDate.getMonth() && curDate.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}
```

#### 时间字符换算

```js
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

[MDN - JavaScript 标准内置对象 Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

[JavaScript 时间与日期处理实战:你肯定被坑过](https://segmentfault.com/a/1190000007581722)