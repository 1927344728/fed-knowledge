## 基础篇：CSS对象模型（CSSOM）

CSS 对象模型（CSSOM，CSS Object Model）是树形形式的所有 CSS 选择器和每个选择器的相关属性的映射，具有树的根节点、同级、后代、子级和其他关系。CSSOM 与 文档对象模型（DOM）非常相似。两者都是关键渲染路径的一部分，也是正确渲染一个网站必须采取的一系列步骤。

CSSOM 与 DOM 一起构建渲染树，浏览器依次使用渲染树来布局和绘制网页。

**CSSOM 也是一组允许用 JavaScript 操纵 CSS 的 API**。它非常类似于DOM，但应用于 CSS 而不是 HTML。它允许用户动态读取和修改 CSS 样式。

### CSS接口

CSS 接口涵盖 CSS 相关的实用方法。它是一个工具接口，无法创建该类型的对象，其内部只定义了静态方法。

### 静态方法

##### registerProperty()

注册自定义属性，允许检查属性类型、默认值以及继承或不继承其值的属性。

注册自定义属性可以让您告诉浏览器自定义属性的行为方式；什么是允许的类型，自定义属性是否继承其值，以及自定义属性的默认值是什么。

```javascript
CSS.registerProperty(PropertyDefinition);
```

PropertyDefinition 对象包含以下成员：

* name： 字符串，表示正在定义的属性的名称。
* syntax（可选）： 表示已定义属性的预期语法的字符串。默认为 "*"。
* inherits： 布尔值，定义是否应该继承定义的属性，默认为 false。
* initialValue（可选）：表示已定义属性的初始值的字符串。

**注意：** name 必需是有效的自定义属性名称（即，以两个破折号开头，例如 `--my-color`），且不能是已经注册的属性名。

```html
<section class="custom_property">
    <p>地上一座城，天上，也是一座神秘城。</p>
    <p>云卷云舒，分秒变幻，对人间而言就是一场盛大的梦境。云中有什么，有没有已经离我们远去的至亲？</p>
    <p>「浮云游子意，落日故人情。」一座城市留住了许许多多的游子，每一次的黄昏，仿佛新愿。</p>
</section>
```

```javascript
CSS.registerProperty({
    name: '--my-color',
    syntax: '<color>',
    inherits: false,
    initialValue: '#c0ffee',
});
```

```css
.custom_property {
    --my-color: #c0ffee;
    background-image: linear-gradient(to right, #fff, var(--my-color));
    transition: --my-color 1s ease-in-out;
}
.custom_property:hover {
    --my-color: #00dddd;
}
```

##### supports()

返回一个布尔值，用来校验浏览器是否支持一个给定的 CSS 特性。

```javascript
CSS.supports("text-decoration-style");
CSS.supports("display", "flex");
CSS.supports("( transform-origin: 5% 5% )");
CSS.supports("( transform-style: preserve ) or ( -moz-transform-style: preserve ) or ( -o-transform-style: preserve ) or ( -webkit-transform-style: preserve )" );
```

另一种查询方法是：

```javascript
document.body.style['transform-origin'] // ""。表示支持该属性。
document.body.style['abcd']             // undefined。表示不支持该属性。
```

##### escape()（实验性）

返回转义后的字符，主要用作 CSS 选择器的一部分。

```javascript
CSS.escape(".foo#bar") // '\\.foo\\#bar'
CSS.escape("()[]{}")   // '\\(\\)\\[\\]\\{\\}'
CSS.escape(0)          // '\\30 ', 0 的 Unicode 代码点是 30
CSS.escape('\0')       // '�' 
```

##### CSS 数字工厂函数

CSS 数字工厂函数（CSS numeric factory functions），例如 CSS.em() 和 CSS.turn()，是一组使用传入的数字参数以及所指定的单位（单位名称即所用方法名称）来返回 CSSUnitValues 对象的方法。CSSUnitValues 对象包含 value、unit 属性，分别表示数值和单位。

```javascript
CSS.number(3)  // CSSUnitValue {value: 3, unit: 'number'}
CSS.percent(3) // CSSUnitValue {value: 3, unit: 'percent'}

CSS.em(3)      // CSSUnitValue {value: 3, unit: 'em'}
CSS.rem(3)     // CSSUnitValue {value: 3, unit: 'rem'}
CSS.dpi(3)     // CSSUnitValue {value: 3, unit: 'dpi'}
```

### StyleSheet接口

StyleSheet 接口代表网页的一张样式表，包括 link 元素加载的样式表和 style 元素内嵌的样式表。

```html
<link rel="stylesheet" href=assets\css\common.css />
<style id="MyStyle">
    body { color: #00dddd; }
</style>
```

```javascript
const styleSheet1 = document.styleSheets[0]
const styleSheet2 = document.getElementById('MyStyle')
```

#### StyleSheet属性

##### disabled

用于决定样式表是否被禁用于文档。
样式表被禁用可能由于这个属性被手动设置为 true，也可能是因为样式表是未激活的。

**注意：** disabled 设置为 false 并不保证样式表一定生效。例如，它可能被移除出文档。

##### href（只读）

返回当前样式表文件的 URI 地址。

如果该样式表是一个外链样式表文件，则值为样式表文件的 URI；如果是一个内联样式表，则为null。

##### media（只读）

返回样式信息的预期目标媒体。

```html
<link rel="stylesheet" href=assets\css\common.css  media="screen and (min-width: 300px)" />
```

```javascript
document.styleSheets[0].media
// MediaList {0: 'screen and (min-width: 300px)', length: 1, mediaText: 'screen and (min-width: 300px)'}
```

##### ownerNode（只读）

返回将该样式表与文档相关联的节点，通常是一个 HTML 或 link、style 元素。

##### parentStyleSheet（只读）

返回包含给定样式表的样式表。如果是 null，表示当前样式表是顶级样式表或不支持包含样式表。

##### title（只读）

返回当前样式表的咨询标题，即 ownerNode 中的 title 属性。

##### type（只读）

返回给定样式表的样式表语言。

```javascript
document.styleSheets[0].type // 'text/css'
```

### CSSStyleSheet接口

CSSStyleSheet 接口代表一个 CSS 样式表，并允许检查和编辑样式表中的规则列表。它继承父类型 StyleSheet 的属性和方法。

一个 CSS 样式表包含了一组表示规则的 CSSRule 对象。每条 CSS 规则可以通过与之相关联的对象进行操作，这些规则被包含在 CSSRuleList 内，可以通过样式表的 cssRules 属性获取。

```html
<link rel="stylesheet" href=assets\css\common.css />
<style id="MyStyle">
    body { color: #00dddd; }
</style>
```

```javascript
const styleSheet1 = document.styleSheets[0]
const styleSheet2 = document.getElementById('MyStyle')
```

#### CSSStyleSheet属性

CSSStyleSheet 接口继承了 StyleSheet 接口的所有属性。

##### cssRules（只读）

返回一个实时的 CSSRuleList，它提供包含样式表的每个 CSS 规则的实时、最新列表。列表中的每个项目都是一个CSSRule 规则。

```javascript
document.styleSheets[1].cssRules[0]
```

##### ownerRule（只读）

返回样式中通过 @import 引入的规则。如果样式表未使用 @import，则返回 null。

#### CSSStyleSheet方法

##### deleteRule()

用来从当前样式表对象中删除指定的样式规则。

```javascript
document.styleSheets[1].deleteRule(0)
```

##### insertRule()

用来给当前样式表插入新的样式规则。

```javascript
stylesheet.insertRule(rule [, index])
```

**insertRule() 的一些限制：**

* 如果 index > CSSRuleList.length，该方法会中止并返回一个 IndexSizeError 错误；
* 如果由于一些 CSS 约束而不能被插入到 index == 0，该方法会中止并返回一个 HierarchyRequestError 错误；
* 如果 rule 参数中包含超过一条样式规则，该方法会中止并返回一个 SyntaxError；
* 如果尝试在一条普通规则后插入一条 @import 这种类型的规则，该方法会中止并返回一个 HierarchyRequestError 错误；
* 如果 rule 是 @namespace 并且规则列表中有另外的 @import、@namespace 规则，该方法中止并返回一个 InvalidStateError 错误；

**注意：** 尽管 insertRule() 是 CSSStyleSheet 的一个方法，但它实际插入的地方是 CSSStyleSheet.cssRules 的内部 CSSRuleList。

### CSSRule接口

CSSRule 接口表示一条 CSS 规则。

CSSRule 接口指定了所有类型的规则的公共属性，而特定类型的规则的专有属性则在这些规则各自类型的、更专用的接口中被指定。

#### CSSRule属性

##### cssText

返回样式规则所包含的实际文本。

```javascript
document.styleSheets[1].cssRules[0].cssText
```

**注意：** 不能直接设置此属性，因为它现在指定为仅在功能上修改，并且静默如此。换句话说，尝试设置它绝对不会做任何事情，甚至不会忽略警告或错误。此外，它没有可设置的子属性。

##### parentRule（只读）

返回当前规则的父规则；如果没有，则返回 null。

例如：如果此规则是 @media 块中的样式规则，则其父规则将是该 CSSMediaRule。

##### parentStyleSheet（只读）

返回包含此规则的样式表的 CSSStyleSheet 对象。

##### type（只读）（已弃用）

规则类型，表示 CSS 规则类型 类型常量中的一种类型。

#### CSSRule类型常量

CSSRule 接口通过一系列整型常量来约束 CSSRule 的 type 取值范围，同时这些常量也对应规则的具体实现接口。

* STYLE_RULE： 1。 CSSStyleRule 规则，最常见的一种规则，即 `selector { prop1: val1; prop2: val2; }`。
* IMPORT_RULE： 3。 CSSImportRule 规则，即一个 @import 规则。
* MEDIA_RULE： 4。 CSSMediaRule 规则，即 `@media screen and (min-width: 900px) {}`。
* FONT_FACE_RULE： 5。 CSSFontFaceRule 规则，即 `@font-face {}`。
* PAGE_RULE： 6。 CSSPageRule 规则，即 `@page {}`。
* KEYFRAMES_RULE： 7。 CSSKeyframesRule 规则，即 `@keyframes aniName{}`。
* KEYFRAME_RULE： 8。 CSSKeyframeRule 规则。
* NAMESPACE_RULE： 10。 CSSNamespaceRule 规则，即 `@namespace url(http://www.w3.org/1999/xhtml);`。
* COUNTER_STYLE_RULE： 11。 CSSCounterStyleRule 规则，即 `@counter-style thumbs {}` 。
* SUPPORTS_RULE： 12。 CSSSupportsRule 规则，即 `@supports (display: grid) {}`。
* DOCUMENT_RULE： 13。 CSSDocumentRule 规则。
* FONT_FEATURE_VALUES_RULE： 14。 CSSFontFeatureValuesRule 规则。
* VIEWPORT_RULE： 15。 CSSViewportRule 规则。
* REGION_STYLE_RULE： 16。 CSSRegionStyleRule 规则。

UNKNOWN_RULE（0）和 CHARSET_RULE （2） 常量已弃用，无法再获取。

### CSSStyleDeclaration接口

CSSStyleDeclaration 接口表示一个对象，它是一个 CSS 声明块，CSS 属性键值对的集合。它暴露了样式信息和各种与样式相关的方法和属性。

CSSStyleDeclaration 对象可通过以下三种方式获取：

* HTMLElement.style，用于操作单个元素的样式。
* CSSStyleSheet API，如，`document.styleSheets[0].cssRules[0].style`。
* Window.getComputedStyle()，将 CSSStyleDeclaration 对象作为一个只读的接口。

#### CSSStyleDeclaration属性

##### cssText

返回或设置元素的内联样式声明的文本。

**注意：** 不要与 CSSRule 接口的 cssText 属性混淆。

##### length（只读）

返回一个指定规则声明过的样式属性个数。

##### parentRule（只读）

返回包含当前声明块的 CssRule。

#### CSSStyleDeclaration方法

##### getPropertyPriority()

根据传入的 CSS 属性，返回一个字符串，表示指定属性的优先级。如果优先级存在，就返回（如，"important"）；不存在，则返回空字符串。

##### getPropertyValue()

接口返回一个字符串 ，表示指定属性的值。若对应属性没有设置，则返回空字符串。

##### item()

返回指定索引的属性值。 当传入的下标越界时会返回空字符串，当未传入参数时会抛出一个 TypeError 。

##### removeProperty()

移除 CSSStyleDeclaration 对象的一个属性。

##### setProperty()

为 CSSStyleDeclaration 对象的一个属性设置一个新的值 。

```javascript
style.setProperty(propertyName, value, priority);
```

priority（可选）是一个字符串，允许设置 "important" 指定优先级。如果没有指定，则当作空字符串。

### MediaQueryList接口

MediaQueryLis t对象在一个 document 上维持着一系列的媒体查询，并负责处理当媒体查询在其 document 上发生变化时向监听器发送通知。

```javascript
const mq = window.matchMedia('screen and (min-width: 300px)');
```

**注意：** 无效 MediaQuery 语句也会返回的一个 MediaQueryList 实例，不会引发报错。

#### MediaQueryList属性

##### media

返回序列化的媒体查询列表。

```javascript
mq.media // 'screen and (min-width: 300px)'
```

##### matches

返回布尔值，表示当前页面是否符合指定的媒体查询条件。

##### onchange

用来指定当媒体查询条件的适配环境发生变化时的监听函数。该函数的参数是 change 事件对象（MediaQueryListEvent 实例）。

#### MediaQueryList方法

##### addListener()

用来为 change 事件添加监听函数。

##### removeListener()

用来为 change 事件撤销监听函数。

```javascript
function mqCallback () {}
mq.addListener(mqCallback)
mq.removeListener(mqCallback)
```

### CSS事件

##### transitionrun

在第一次创建 CSS 过渡时触发，即在 transition-delay 开始之前。

##### transitionstart

当 CSS 过渡实际开始时触发，即在 transition-delay 结束之后。

##### transitioncancel

当 CSS 过渡被取消时触发。

如以下情况：

* 应用于目标的 transition-property 属性的值被更改；
* display 属性被设置为 `none`；
* 转换在运行到完成之前就停止了，例如通过将鼠标移出悬浮过渡元素。

##### transitionend

当 CSS 过渡完成时触发。

该事件在两种场景触发：当它完成转换到转换状态时，以及当它完全恢复到默认或非转换状态时。如果没有转换延迟或持续时间，或者均为 0，或者均未声明，则没有过渡，也不会触发任何过渡事件。

在过渡完成之前，如果移除 transition-property 属性或设置 display 属性为 `none`，则该事件不会触发。

如果 transitioncancel 事件被触发，则该事件不会触发。

##### animationcancel

当 CSS 动画**意外中止**时触发。换句话说，任何时候它不是由正常执行完成而停止运行时触发。这可能发生在更改 以删除动画或使用 CSS 隐藏动画节点时。

##### animationend

当 CSS **动画完成**时触发。如果动画在完成之前中止，例如从 DOM 中删除元素或从元素中删除动画，则不会触发事件。

##### animationiteration

当 CSS **动画的迭代结束并且另一个动画开始时**触发该事件。此事件不会与 animationend 事件同时发生，因此对于 `animation-iteration-count: 1` 的动画不会发生。

##### animationstart

当 CSS **动画开始**时触发。如果有 animation-delay 属性，则在延迟期到期后将触发此事件。负延迟将导致事件以等于延迟的绝对值触发（相应地，动画将在该时间索引开始播放到序列中）。

### 参考资料

[MDN - CSS Object Model](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model)