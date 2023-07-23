## HTML全局属性

全局属性是所有 HTML 元素共有的属性，即它们可以用于所有元素，即使属性可能对某些元素不起作用。

可以在所有的 HTML 元素上指定全局属性，甚至是在标准里没有指定的元素。这意味着任何非标准元素仍必须能够应用这些属性，即使使用这些元素意味着文档不再是 html5 兼容的。

例如，foo 不是一个有效的 HTML 元素，但是兼容 html5 的浏览器隐藏了有 hidden 属性的 foo 元素（  `<foo hidden>...<foo>` ）的内容。

### 基本全局属性

##### lang

帮助定义元素的语言：不可编辑元素所在的语言，或者应该由用户编写的可编辑元素的语言。该属性包含一个“语言标记”（由用连字符分隔的“语言子标记”组成）。

##### title

表示与其所属元素相关信息的文本。 这些信息通常可以作为提示呈现给用户，但不是必须的。

##### id

定义唯一标识符（ID），该标识符在整个文档中必须是唯一的。 其目的是在链接（使用片段标识符）、脚本、样式时标识元素。

##### class

一个以空格分隔的元素的类名列表。

##### style

设置要应用于元素的 CSS 样式声明。 

##### tabindex

整数属性，指示元素是否可以获取输入焦点（可聚焦），是否应该参与顺序键盘导航，如果是，则表示哪个位置。

可取值如下：

* 负值：表示该元素应该是可聚焦的，但不应通过顺序键盘导航到达；
* 0：表示元素应通过顺序键盘导航可聚焦和可到达，但其相对顺序由平台约定定义;
* 正值：意味着元素可以通过顺序键盘导航进行聚焦和访问；元素聚焦的顺序是 tabindex 的增加值。如果多个元素共享相同的 tabindex，则它们的相对顺序遵循它们在文档中的相对位置。

##### accesskey

提供了为当前元素生成键盘快捷键的提示。这个属性由空格分隔的字符列表组成。浏览器应该使用在计算机键盘布局上存在的第一个。

##### autocapitalize

控制用户的文本输入是否和如何自动大写，它可以有以下的值：

* off 或 none：没有应用自动大写（所有字母都默认为小写字母）。
* on 或 sentences：每个句子的第一个字母默认为大写字母；所有其他字母都默认为小写字母。
* words：每个单词的第一个字母默认为大写字母;所有其他字母都默认为小写字母。
* characters：所有的字母都应该默认为大写。

##### contenteditable

一个枚举属性，表示元素是否可被用户编辑。 如果可以，浏览器会调整元素的部件以允许编辑。

* true 或者空字符串：表明元素是可被编辑的；
* false：表明元素不能被编辑。

##### data-\*

一类自定义数据属性，赋予所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本（JavaScript）与 HTML 之间进行专有数据的交换。

所有这些自定义数据属性都可以通过所属元素的 HTMLElement.dataset 属性访问它们。

##### dir

一个指示元素中文本方向的枚举属性。

可取值如下：

* ltr：指从左到右，用于那种从左向右书写的语言（比如英语）；
* rtl：指从右到左，用于那种从右向左书写的语言（比如阿拉伯语）；
* auto：指由用户代理决定方向。它在解析元素中字符时会运用一个基本算法，直到发现一个具有强方向性的字符，然后将这一方向应用于整个元素。

##### draggable

一种枚举属性，指示是否可以使用 Drag and Drop API 拖动元素。

可取值如下：

* true：表明元素可能被拖动；
* false：表明元素可能不会被拖动。

##### hidden

布尔属性表示该元素尚未或不再相关。例如，它可用于隐藏在登录过程完成之前无法使用的页面元素。浏览器不会呈现此类元素。不得使用此属性隐藏可合法显示的内容。

##### inputmode

向浏览器提供有关在编辑此元素或其内容时要使用的虚拟键盘配置类型的提示。主要用于 input 元素，但在 contenteditable 模式下可用于任何元素。

##### is

允许指定标准 HTML 元素像已注册的自定义内置元素一样。

##### slot

将 shadow DOM 阴影关联树中的一个沟槽分配给一个元素：具有 slot 属性的元素被分配给由 slot 元素创建的沟槽，其 name 属性的值与 slot 属性的值匹配。

##### itemid

item 的唯一全局标识符。

##### itemprop

用于向 item 添加属性。 每个 HTML 元素都可以指定一个 itemprop 属性，其中一个 itemprop 由一个名称和值对组成。

##### itemref

只有不是具有 itemscope 属性的元素的后代，它的属性才可以与使用 itemref 项目相关联。它提供了元素 ID 列表（itemids）以及文档中其他位置的其他属性。

##### itemscope

itemscope 通常与 itemtype 一起使用，以指定包含在关于特定项目代码块中的 HTML。 itemscope 创建 Item 并定义与之关联的 itemtype 的范围。 

##### itemtype

指定将用于在数据结构中定义 itemprops（项属性）的词汇表的 URL。

##### part（实验性）

元素的部件名称的空格分隔列表。Part 名称允许 CSS 通过::part() 伪元素选择和设置阴影关联树中的特定元素。

##### dropzone（实验性）

枚举属性，指示可以使用 Drag and Drop API 在元素上删除哪些类型的内容。 

可取值如下：

* copy：表示 drop 将创建被拖动元素的副本
* move：表示拖动的元素将移动到此新位置。
* link：将创建一个指向拖动数据的链接。

##### spellcheck（实验性）

定义是否可以检查元素是否存在拼写错误。

可取值如下：

* true：表示如果可能，应检查元素是否存在拼写错误；
* false：表示不应检查元素的拼写错误。

##### translate（实验性）

用于指定在页面本地化时是否转换元素的属性值及其 Text 节点子节点的值，或者是否保持它们不变。

可取值如下：

* 空字符串和"yes"：表示元素将被翻译。
* "no"：表示该元素不会被翻译。

### 其他全局属性

除了基本的 HTML 全局属性之外，还存在以下全局属性：

* xml:lang、xml:base： 两者都是从 XHTML 规范继承，但为了兼容性而被保留的。

* 多重 aria-* 属性：用于改善无障碍。

* 事件处理程序属性：

  ```html
  onclick、onchange、ondbclick、
  oninput、onblur、onfocus、onselect、onsubmit、onreset、
  oncanplay、oncanplaythrough、onloadeddata、onloadedmetadata、onpause、onplay、onplaying、onprogress、onratechange、onseeking、onvolumechange、ondurationchange、onended、onseeked、
  ondrag、ondragend、ondragenter、ondragexit、ondragleave、ondragover、ondragstart、ondrop、
  onkeydown、onkeypress、onkeyup、
  onmousedown、onmouseenter、onmouseleave、onmousemove、onmouseout、onmouseover、onmouseup、onmousewheel、
  onerror、onscroll、onresize、onload、onloadstart、
  onabort、onautocomplete、onautocompleteerror、oncancel、onclose、oncontextmenu、oncuechange、onemptied、oninvalid、onshow、onsort、onstalled、onsuspend、ontimeupdate、ontoggle、onwaiting
  ```

### 参考资料

[MDN - 全局属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)

[MDN - HTML 属性参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes)