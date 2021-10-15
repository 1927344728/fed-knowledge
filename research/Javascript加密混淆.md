## Javascript加密混淆

### **为什么要对JS代码进行保护？**

* JS代码运行于客户端。
* JS代码是公开透明的。

由于这两个原因，至使JS代码是不安全的，任何人都可以读、分析、复制、盗用，甚至篡改。因此出现了很多安全事件，典型的如：自己的原创程序代码被盗用、网站数据被篡改等等。

如果你不想让自己的代码被它人看到、不想它人了解你的代码功能，或者想降低被不怀好意的人甚至是黑客攻击。那么你应该尝试使用JS保护。



### 如何对Javascript代码进行保护？

* **使JS代码不可读**

  让攻击者无法理解代码功能，也无法篡改任何功能。

* **使JS代码不可分析**

  让攻击者不能进行动态跟踪调试。

  代码不可读之后，攻击者往往会进行动态跟踪调试，以期逆向还原出原始代码，或分析出程序功能。



### 怎么实现代码的不可读不可分析？

- 代码加密：加密后的代码看似乎杂乱，但代码在执行前需要进行解密才能执行，只要找到解密函数即可还原出原始代码，所以此方式安全系数较低；
- 虚拟机技术：可以屏蔽JS原始关键字，但兼容性较差，无法保证在多端，多浏览器下运行；
- **代码混淆：使用字符串阵列化、平展控制流、多态变异、僵尸函数等手段，使代码变的不可读不可分析，达到最终保护的目的。且不影响代码原有功能。是理想、实用的JS保护方案。**



###  JavaScript加密

> 密码学有一句话：
> **当你采用的加密模式，使得攻击者为了破解所付出的代价 远远超过其所获得的利益之时，你的加密方案就是安全的。**

* 代码无法做到完全不可读，只能做到很难读。
* 只能增加逆向难度，从而提高山寨逆向成本。

造成这两点的原因是，你无法绕过浏览器的web inspector(下文简称WI)。有人会说在JS做黑盒，但其最终调用的还是浏览器提供的API。你是无法防止他人在你调用API时候拦截的。除非你的代码拥有比WI更高的API权限。否则都是没有用。

**[国内最知名的JS加密当属JShaman](http://jshaman.com/guide.html)**

[**Node.js加密算法库Crypto**](https://nodejs.org/api/crypto.html)



### JavaScript混淆

**脱离混淆的Javascript加密是伪命题，无论怎么加密，如果不加以混淆手段保护，都没有意义。**

如同传统软件的加壳保护，js混淆给底层的加密算法加了最基本的保障，在js层面来说，混淆和加密一定是相辅相成的。

由于js是动态指令码语言，在http中传输的就是原始码，逆向起来要比打包编译后的软体简单很多。暴露在外的程式码没有绝对的安全，但是在对抗中，精心设计的混淆程式码能够给破坏者带来不小的麻烦，也能够为防守者争取更多的时间，相对于破解来说，混淆器规则的更替成本要小得多，在高强度的攻防中，可以大大增加破解者的工作量，起到防御作用。从这个角度来讲，关键程式码进行混淆是必不可少的步骤。



JS混淆归结为三类： eval类型，hash类型，压缩类型

#### [eval混淆](http://blog.w3cub.com/tools/jspacker/)

也是最早JS出现的混淆加密，据说第一天就被破解，修改一下代码，alert一下就可以破解了。

#### hash混淆

* miniui 使用的[JSA加密](https://sourceforge.net/projects/jsintegration/files/tools/_ JSA-20071021/)

* fundebug使用的[javascript-obfuscator](https://obfuscator.io/)

JSA加密 和 javascript-obfuscator 的区别：

通过[JSA加密](https://sourceforge.net/projects/jsintegration/files/tools/_ JSA-20071021/)混淆后生成的代码，[beautifier](https://beautifier.io/)一下，可以发现，其实没有做什么什么修改，只是做了一些变量替换。想还原也比较简单的。这里就不拿它来做代表，也没有什么人用。

通过[javascript-obfuscator](https://obfuscator.io/)混淆后生成的代码，[beautifier](https://beautifier.io/)一下，分析一下可以发现，其实多了一个字典，所有方法变量，都有可能存在字典中，调用时先调用字典还原方法名变量再执行。其实入口都是变量的规则。

#### 压缩混淆

是目前前端性能优化的常用工具，以[uglify](https://www.npmjs.com/package/uglify-js)为代表。



#### js混淆器大致有两种

- 通过正则替换实现的混淆器
- 通过语法树替换实现的混淆器

第一种实现成本低，但是效果也一般，适合对混淆要求不高的场景。

第二种实现成本较高，但是更灵活，而且更安全，更适合对抗场景。基于语法层面的混淆器其实类似于编译器，基本原理和编译器类似，我们先对编译器做一些基本的介绍。

##### 编译器工作流程

简单的说，当我们读入一段字串文字（source code），词法分析器会把它拆成一个一个小的单位（token），比如数字1 是一个token, 字串'abc'是一个token等等。接下来语法分析器会把这些单位组成一颗树状结构（AST），这个树状结构就代表了token们的组成关系。比如1 + 2 就会展示成一棵加法树，左右子节点分别是token - 1 和token - 2 ，中间token表示加法。编译器根据生成的AST转换到中间程式码，最终转换成机器程式码。

对编译器更多细节感兴趣的同学可以移步龙书：[编译原理](https://book.douban.com/subject/5416783/)

##### 混淆器工作流程

编译器需要把原始码编译成中间程式码或者机器码，而我们的混淆器输出其实还是js。所以我们从语法分析之后往下的步骤并不需要。想想我们的目标是什么，是修改原有的js程式码结构，在这里面这个结构对应的是什么呢？就是AST。任何一段正确的js程式码一定可以组成一颗AST，同样，因为AST表示了各个token的逻辑关系，我们也可以通过AST反过来生成一段js程式码。所以，你只需要构造出一颗AST，就能生成任何js程式码！

##### 规则设计

知道了大致的混淆流程，最重要的环节就是设计规则。我们上面说了，我们需要生成新的AST结构意味着会生成和原始码不一样的js程式码，但是我们的混淆是不能破坏原有程式码的执行结果的，所以混淆规则必须保证是在不破坏程式码执行结果的情况下，让程式码变得更难以阅读。

具体的混淆规则各位可以自行根据需求设计，比如拆分字串、拆分阵列，增加废程式码等等。

[混淆器设计？](https://www.zhihu.com/question/22841206/answer/43999530)

参考：提供商业混淆服务的[ jscramble](https://jscrambler.com/)的混淆规则



#### 混淆插件

##### [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

> 一个免费和高效的JavaScript混淆器(包括ES2017)。让你的代码更难复制，防止别人窃取你的成果。这个工具是一个优秀的Web UI(并且是开源的)
>
> 这个库很像在线`JavaScript`代码压缩网站，实际上也可以做一个在线压缩代码的网站。不过他吸引我的是他的cli工具。
>
> ❗ 作者在`Github`上说了没有很多时间来维护这个项目了，使用请慎重考虑。

```js
//源码
function aa () {
	console.log('aaa')
}
aa()

//混淆后
var _cs=['\x61\x61\x61']; function _f0() { console.log(_cs[0]) } _f0()
```

##### [uglify-js](https://www.npmjs.com/package/uglify-js)

是一款JS代码处理工具，提供了压缩，混淆和代码规范化等功能。通过以下传参数，可以对js做些混淆：

```js
mangle: {
	toplevel: true, // — 混淆在最高作用域中声明的变量名（默认false）
	eval: true,	// - 混淆在eval 或 with作用域出现的变量名（默认false）
	properties: {} //**警告：**这能会搞崩你的代码。混淆属性名跟混淆变量名不一样，是相互独立的。会混淆对象所有可见的属性名，除了DOM属性名和JS内置的类名。
}
```

> uglify-js可以对变量名、属性、方法名进行混淆，无法对字符串进行混淆。

##### [closure-webpack-plugin](https://www.npmjs.com/package/closure-webpack-plugin)

与uglify-js类似。有对应webpack 4\webpack 3的插件。

##### [jscrambler](https://jscrambler.com/)

jscrambler是一个商业级工具，看了很多社区的评论，这个目前是最好的，需要付费。

##### [jsfuck（开源）](https://github.com/aemkei/jsfuck)

jsfuck 是一个开源的js 混淆工具，原理比较简单，其实就是通过特定的字符串加上下标定位字符，再由这些字符替换源代码，从而实现混淆。而且文件体积会受很大影响。

```js
//源码
alert('a')

//转换后
[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+........
```



### 反调试

由于JavaScript自带`debugger`语法，我们可以利用死循环性的`debugger`，当页面打开调试面板的时候，无限进入调试状态。



### [ 把js代码转化为二进制字节码](http://www.fairysoftware.com/js_er_jing_zhi.html)

### 代码可以放置其他位置（非js文件）

放到png文件中：利用HTML Canvas 2D Context获取二进制数据的特性，可以用图片存储脚本资源。

利用HTML [Canvas 2D Context](https://www.w3.org/TR/2dcontext/)获取二进制数据的特性，可以用图片存储脚本资源。

放在css文件中：利用`content`样式能存放字符串的特性，同样可以用来存储脚本资源。

### [代码块预处理工具](https://github.com/zswang/jdists)





### 在线加密混淆工具

https://www.jsjiami.com/ （在线）

https://www.sojson.com/jsjiemi.html (在线)



参考链接：

[加密基础知识四 前端JS加密传输 crypto-js](https://www.jianshu.com/p/1aed5b55ca27)

[js混淆加密，通过混淆Js程式码让别人(很难)无法还原](https://www.itread01.com/content/1546872497.html)

[移动时代的前端加密](https://github.com/smileyby/codeProtect)
