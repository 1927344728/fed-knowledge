## 关于CSS

层叠样式表 (`Cascading Style Sheets`，缩写为 `CSS`），是一种 样式表语言，用来描述 HTML 或 XML（包括如 SVG、MathML、XHTML 之类的 XML 分支语言）文档的呈现。CSS 描述了在屏幕、纸质、音频等其它媒体上的元素应该如何被渲染的问题。

CSS 是开放网络的核心语言之一，由 W3C 规范 实现跨浏览器的标准化。CSS节省了大量的工作。 样式可以通过定义保存在外部.css文件中，同时控制多个网页的布局，这意味着开发者不必经历在所有网页上编辑布局的麻烦。CSS 被分为不同等级：CSS1 现已废弃， CSS2.1 是推荐标准， CSS3 分成多个小模块且正在标准化中。

### CSS 的诞生

20 世纪 90 年代蒂姆·伯纳斯·李（Tim Berners-Lee）发明万维网，创造 HTML 超文本标记语言。此后网页样式便以各种形式存在，不同的浏览器有自己的样式语言来控制页面的效果，因为最原始的 Web 版本中根本没有提供一种网页装饰的方法。

![e6c9d24ely1gznn7wy005j20gi0do0uk.jpg](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/e6c9d24ely1gznn7wy005j20gi0do0uk.jpg)

在HTML迅猛发展的 90 年代，不同的浏览器根据自身的 HTML 语法结构来支持实现不同的样式语言。在最初的 HTML 版本中，由于只含有很少的显示属性，所以用户可以自己决定显示页面的方式。

但随着 HTML 的发展，HTML 增加了很多功能，代码也越来越臃肿，HTML 就变得越来越乱。网页也失去了语义化，维护代码很艰难，因为代码很混乱： 

```html
<p>
	<font size="4" color="red">some text!</font>
</p>
```

于是装饰网页样式的 CSS（层叠样式表，Cascading Style Sheets）诞生了。

### CSS 的历史

#### CSS1

于1994年，[Håkon Wium Lie (哈肯·维姆·莱)](https://en.wikipedia.org/wiki/Håkon_Wium_Lie) 和 [Bert Bos (伯特·波斯)](https://en.wikipedia.org/wiki/Bert_Bos) 合作设计CSS。他们在1994年首次在芝加哥的一次会议上第一次展示了CSS的建议。

1996年12月 发表的 CSS1 的要求有第一版主要规定了选择器、样式属性、伪类 、对象几个大的部分。

#### CSS2

CSS2 在 1998 年 5月 由 W3C 发布，CSS2 规范是基于 CSS1 设计的，扩充和改进了很多更加强大的属性。包括选择器、位置模型、布局、表格样式、媒体类型、伪类、光标样式。

CSS 2.1 修复了 CSS 2中的错误，删除了支持不良或不能完全互操作的特性，并为规范增加了已经实现的浏览器扩展。 为了遵守 W3C 标准化技术规范的过程，CSS 2.1 在 Working Draft (WD) 状态和 Candidate Recommendation (CP) 状态之间来回了很多年。

#### CSS3

CSS3 是层叠样式表（Cascading Style Sheets）语言的最新版本，旨在扩展CSS2.1。

为了加快那些已经确认没有问题的特性的标准化速度，W3C 的 [CSS Working Group](http://www.w3.org/blog/CSS/) 作出了一项被称为 [Beijing doctrine](http://fantasai.inkedblade.net/weblog/2011/inside-csswg/modules) 的决定，将 CSS 划分为许多小组件，称之为模块。这些模块彼此独立，按照各自的进度来进行标准化。其中一些已经是 W3C Recommendation 状态，也有一些仍是 Early Working Drafts（早期工作草案）。当新的需求被肯定后， 新的模块也会同样地添加进来。

从形式上来说，**CSS3 标准自身已经不存在了**。每个模块都被独立的标准化，现在标准 CSS 包括了修订后的 CSS2.1 以及完整模块对它的扩充，模块的 level（级别）数并不一致。可以在每个时间点上为 CSS 标准定义一个 snapshots（快照），列出 CSS 2.1 和成熟的模块。

有一张图可以更加直观的表示当前 CSS3 Modules 的分类和状态：



<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/CSS3_taxonomy_and_status-v2.png" />

### 指南与教程

[MDN CSS（层叠样式表）](https://developer.mozilla.org/zh-CN/docs/Web/CSS)

[MDN CSS 参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)

[CSS参考手册（css.doyoe.com）](https://css.doyoe.com/)

[CSS 教程（www.runoob.com）](https://www.runoob.com/css/css-border.html)