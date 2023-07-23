## 关于Javascript

JavaScript 是一种轻量级的脚本语言。所谓“脚本语言”，指的是它不具备开发操作系统的能力，而是只用来编写控制其他大型应用程序的“脚本”。

JavaScript 是一种嵌入式（embedded）语言。它本身提供的核心语法不算很多，只能用来做一些数学和逻辑运算。JavaScript 本身**不提供任何与 I/O（输入/输出）**相关的 API，都要靠宿主环境（host）提供，所以 JavaScript 只合适嵌入更大型的应用程序环境，去调用宿主环境提供的底层 API。

JavaScript 是一种具有函数优先的轻量级、解释型或即时编译型的编程语言。它作为开发 Web 页面的脚本语言而出名的，但它也被用到了很多非浏览器环境中，例如 Node.js、 Apache CouchDB 和 Adobe Acrobat。

从语法角度看，JavaScript 语言是一种“对象模型”语言。各种宿主环境通过这个模型，描述自己的功能和操作接口，从而通过  JavaScript 控制这些功能。但是，**JavaScript 并不是纯粹的“面向对象语言”**，是一种基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式和声明式（如函数式编程）风格。

JavaScript 的标准是 ECMAScript 。截至 2012 年，所有的现代浏览器都完整的支持  ECMAScript 5.1，旧版本的浏览器至少支持 ECMAScript 3 标准。2015 年 6 月17日，ECMA 国际组织发布了 ECMAScript 的第六版，该版本正式名称为 ECMAScript 2015，但通常被称为 ECMAScript 6 或者 ES6。自此，ECMAScript 每年发布一次新标准。

### Javascript的历史

JavaScript 因为互联网而生，紧随着浏览器的出现而问世。

1994年12月，Navigator 发布了1.0 版，市场份额一举超过90%。Netscape 公司很快发现，Navigator 浏览器需要一种可以嵌入网页的脚本语言，用来控制浏览器行为。

1995年，Netscape 公司雇佣 Brendan Eich 开发这种网页脚本语言。

Brendan Eich 只用了10天，就设计完成了这种语言的第一版。它是一个大杂烩，语法有多个来源：

- 基本语法：借鉴 C 语言和 Java 语言。
- 数据结构：借鉴 Java 语言，包括将值分成原始值和对象两大类。
- 函数的用法：借鉴 Scheme 语言和 Awk 语言，将函数当作第一等公民，并引入闭包。
- 原型继承模型：借鉴 Self 语言（Smalltalk的一种变种）。
- 正则表达式：借鉴Perl语言。
- 字符串和数组处理：借鉴Python语言。

随后在 1996 年初，JavaScript 首先被应用于 Netscape 2 浏览器上。最初的 JavaScript 名为 LiveScript，但是因为一个糟糕的营销策略而被重新命名，该策略企图利用 Sun Microsystem 的 Java 语言的流行性，将它的名字从最初的 LiveScript 更改为 JavaScript——尽管两者之间并没有什么共同点。这便是之后混淆产生的根源。

几个月后，Microsoft 随 IE 3 发布推出了一个与之基本兼容的语言 JScript。又过了几个月，Netscape 将 JavaScript 提交至 Ecma International（一个欧洲标准化组织）， ECMAScript 标准第一版便在 1997 年诞生了，随后在 1999 年以 ECMAScript 第三版的形式进行了更新，从那之后这个标准没有发生过大的改动。

由于委员会在语言特性的讨论上发生分歧，ECMAScript 第四版尚未推出便被废除，但随后于 2009 年 12 月发布的 ECMAScript 第五版引入了第四版草案加入的许多特性。

第六版标准已经于 2015 年 6 月发布。

### Javascript的特性

与大多数编程语言不同，JavaScript 没有输入或输出的概念。它是一个在宿主环境下运行的脚本语言，任何与外界沟通的机制都是由宿主环境提供的。

浏览器是最常见的宿主环境，但在非常多的其他程序中也包含 JavaScript 解释器，如 Adobe Acrobat、Adobe Photoshop、SVG 图像、Yahoo! 的 Widget 引擎，Node.js 之类的服务器端环境，NoSQL 数据库（如开源的 Apache CouchDB）、嵌入式计算机，以及包括 GNOME （注：GNU/Linux 上最流行的 GUI 之一）在内的桌面环境等等。

### Javascript概览

JavaScript 是一种多范式的动态语言，它包含类型、运算符、标准内置（ built-in）对象和方法。它的语法来源于 Java 和 C，所以这两种语言的许多语法特性同样适用于 JavaScript。

JavaScript 通过原型链而不是类来支持面向对象编程。JavaScript 同样支持函数式编程——因为它们也是对象，函数也可以被保存在变量中，并且像其他对象一样被传递。

JavaScript 中的类型包括：

* Number（数字）
* String（字符串）
* Boolean（布尔）
* Function（函数）
* Object（对象）
* null（空）
* undefined（未定义）
* Symbol（ES2015 新增）

此外还有 Array（数组）类型，以及分别用于表示日期和正则表达式的 Date（日期）和 RegExp（正则表达式），这三种类型都是特殊的 Object。严格意义上说，Function（函数）也是一种特殊的 Object。

JavaScript 还有一种内置的 Error（错误）类型。

### JavaScript的版本

* 1997年7月，ECMAScript 1.0 发布。

* 1998年6月，ECMAScript 2.0 版发布。

* 1999年12月，ECMAScript 3.0 版发布，成为 JavaScript 的通行标准，得到了广泛支持。

* 2007年10月，ECMAScript 4.0 版草案发布，对 3.0 版做了大幅升级，预计次年 8 月发布正式版本。草案发布后，由于 4.0 版的目标过于激进，各方对于是否通过这个标准，发生了严重分歧。以 Yahoo、Microsoft、Google 为首的大公司，反对 JavaScript 的大幅升级，主张小幅改动；以 JavaScript 创造者 Brendan Eich 为首的 Mozilla 公司，则坚持当前的草案。
* 2008年7月，由于对于下一个版本应该包括哪些功能，各方分歧太大，争论过于激进，ECMA 开会决定，中止ECMAScript 4.0 的开发（即废除了这个版本），将其中涉及现有功能改善的一小部分，发布为 ECMAScript 3.1，而将其他激进的设想扩大范围，放入以后的版本，由于会议的气氛，该版本的项目代号起名为Harmony（和谐）。会后不久，ECMAScript 3.1 就改名为 ECMAScript 5。

* 2009年12月，ECMAScript 5.0 版正式发布。Harmony 项目则一分为二，一些较为可行的设想定名为JavaScript.next 继续开发，后来演变成 ECMAScript 6；一些不是很成熟的设想，则被视为JavaScript.next.next，在更远的将来再考虑推出。TC39 的总体考虑是，ECMAScript 5 与 ECMAScript 3 基本保持兼容，较大的语法修正和新功能加入，将由 JavaScript.next 完成。当时，JavaScript.next 指的是ECMAScript 6。第六版发布以后，将指 ECMAScript 7。TC39预计，ECMAScript 5 会在2013年的年中成为JavaScript开发的主流标准，并在此后五年中一直保持这个位置。
* 2011年6月，ECMAscript 5.1 版发布，并且成为 ISO 国际标准（ISO/IEC 16262:2011）。到了2012年底，所有主要浏览器都支持 ECMAScript 5.1 版的全部功能。
* 2013年3月，ECMAScript 6 草案冻结，不再添加新功能。新的功能设想将被放到 ECMAScript 7。
* 2013年12月，ECMAScript 6 草案发布。然后是12个月的讨论期，听取各方反馈。
* 2015年6月，ECMAScript 6 正式发布，并且更名为 “ECMAScript 2015”。这是因为 TC39 委员会计划，以后每年发布一个 ECMAScirpt 的版本，下一个版本在 2016 年发布，称为“ECMAScript 2016”。

### JavaScript 与 ECMAScript 的关系

1996年8月，微软模仿 JavaScript 开发了一种相近的语言，取名为 JScript（JavaScript 是 Netscape 的注册商标，微软不能用），首先内置于IE 3.0。Netscape公司面临丧失浏览器脚本语言的主导权的局面。

1996年11月，Netscape 公司决定将 JavaScript 提交给国际标准化组织 ECMA（European Computer Manufacturers Association），希望 JavaScript 能够成为国际标准，以此抵抗微软。ECMA 的 39 号技术委员会（Technical Committee 39）负责制定和审核这个标准，成员由业内的大公司派出的工程师组成，目前共25个人。该委员会定期开会，所有的邮件讨论和会议记录，都是公开的。

1997年7月，ECMA 组织发布 262 号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript。这个版本就是 ECMAScript 1.0 版。之所以不叫 JavaScript，一方面是由于商标的关系，Java 是 Sun 公司的商标，根据一份授权协议，只有 Netscape 公司可以合法地使用 JavaScript 这个名字，且JavaScript 已经被 Netscape 公司注册为商标，另一方面也是想体现这门语言的制定者是 ECMA，不是 Netscape，这样有利于保证这门语言的开放性和中立性。因此，ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现。在日常场合，这两个词是可以互换的。

ECMAScript 只用来标准化 JavaScript 这种语言的基本语法结构，与部署环境相关的标准都由其他标准规定，比如DOM 的标准就是由 W3C 组织（World Wide Web Consortium）制定的。

ECMA-262 标准后来也被另一个国际标准化组织 ISO（International Organization for Standardization）批准，标准号是 ISO-16262。

### JavaScript与Java的关系

JavaScript 和 Java 是两种不一样的语言，但是它们之间存在联系。

JavaScript 的基本语法和对象体系，是模仿 Java 而设计的。但是，JavaScript 没有采用 Java 的静态类型。正是因为 JavaScript 与 Java 有很大的相似性，所以这门语言才从一开始的 LiveScript 改名为 JavaScript。基本上，JavaScript 这个名字的原意是“很像 Java 的脚本语言”。

在 JavaScript 语言中，函数是一种独立的数据类型，以及采用基于原型对象（prototype）的继承链。这是它与Java 语法最大的两点区别。JavaScript 语法要比 Java 自由得多。

另外，Java 语言需要编译，而 JavaScript 语言则是运行时由解释器直接执行。

总之，JavaScript 的原始设计目标是一种小型的、简单的动态语言，与 Java 有足够的相似性，使得使用者（尤其是 Java 程序员）可以快速上手。



### 指南与教程

[MDN JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

[阮一峰 JavaScript 标准参考教程（alpha）](https://javascript.ruanyifeng.com/)