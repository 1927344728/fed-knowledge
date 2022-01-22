# web主题切换和个性化定制方法总结

## 切换主题

**切换主题：**主题是由**开发者**定义，一般来说只有有限的主题可选。

### 方法一：class 命名空间

**定制不同主题，存于不同的 class 命名空间下，通过 JS 修改 `body` 或其他需要换主题的标签上的 class 名来实现主题切换。**

该方法的关键在于如何为不同主题，生成不同的 class。如果纯手动写多个主题的 class，成本太高，而且后期维护也比较困难。

以下是两种解决方案：**postcss-themes 插件、less 混合**。

#### [postcss-themes](https://www.npmjs.com/package/postcss-themes) 插件（推荐）

将主题相关的变量提取到一个主题变量文件中， `postcss-themes` 会为使用了主题文件中变量的选择器，新添加一份带有命名空间的选择器。

```js
/* postcss.config.js */
module.exports = {
  plugins: {
    'postcss-themes': {
      themes: { // themes 可以为数组，配置多个主题
        filePath: 'red_theme.css'
      }
    },
    'postcss-css-variables': {},
  }
}
```

输入 css：

```css
/* index.css */
:root {
  --main-color: green;
}
.foo {
  font-size: 16px;
  color: var(--main-color);
}
```

```css
/* red_theme */
:root {
  --main-color: red;
}
```

输出 css：

```css
.foo {
  font-size: 16px;
  color: green;
}
.red_theme .foo {
  color: red;
}
```

#### Less 混合

less 混合是将一组属性从一个规则集包含（或混入）到另一个规则集的方法。规则集可以通过传参生成不同的新规则集。该方案需要将所有主题相关的样式集中在一个规则集中，实际执行起来比较困难。

```css
/*variables.less*/
.base_theme(@background: #e2e9f9, @color: #337ab7){
  .class_1 {
    background: @background;
  }
  .class_1 a:hover{
    color: saturate(@color, 20%);
  }
  .class_2 {
    color: @color;
  }
}
```

```css
@import 'variables.less';
.default_theme { /*默认主题，经典蓝*/
  .base_theme();
}
.coffee_theme { /*咖啡色主题*/
  .base_theme(#f5e2c9, #9f754d);
}
.purple_theme { /*紫色主题*/
  .base_theme(#e5d3ed, #b88bcb);
}
```

#### JS 切换主题

 JS 修改 body 或其他需要换主题的元素的 class 名。

```js
document.body.className = `${document.body.className} ${theme_class_name}`
```

### 方法二：多个 CSS 文件

**定制不同主题，每个主题生成一份 CSS 文件，然后再通过 JS 切换主题样式文件来实现。**

实现步骤上如下：

* 创建主题变量文件，包含主题相关的变量定义；

* 根据不同的主题变量文件，编译生成不同主题的 CSS 文件；

* 通过 JS 切换主题样式文件。

其中重点是，如何根据不同的主题变量文件，编译生成不同主题的 CSS 文件。

以下是两种用 webpack 的实现方式：

#### 多次运行 webapck，生成多个 CSS 文件

一次打包同时生成多份主题 CSS 文件比较麻烦，因此通过打包多次，每次生成一个主题对应的 css 文件来实现，而 JS 文件在这个过程中是不会改变。

```js
// webpack.prod.conf.js
module.exports = theme => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name]_${theme}.css`,
      }),
    ],
    resolve: {
      alias: {
        themeVars: path.join(__dirname, `../src/style/themes/theme-${theme}.css`),
      }
    }
  }
}
```

```css
/*variable/color.less*/
@import "~themeVars"
```

```js
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')
['default', 'broker'].forEach(theme => {
  webpack(webpackConfig(theme), (err, stats) => {})
})
```

**注意：** 使用 `less` 预处理，`@import` 可以直接引用 `webpack.prod.conf.js` 中定义的 `alias`，而 `postcss-loader` 是无法使用该 `alias` 的。

`postcss-loader` 是通过 `postcss-import` 来处理 `@import` 语句。 `postcss-import` 是不支持 `alias` 配置的，需要用另一个插件 [postcss-import-alias-resolver](https://www.npmjs.com/package/postcss-import-alias-resolver) 来实现。

```js
// postcss.config.js
const path = require('path')
const aliasResolver = require('postcss-import-alias-resolver');
module.exports = {
  plugins: {
    'postcss-import': {
      resolve: aliasResolver({
        alias: {
          themeVars: path.join(__dirname, `src/style/themes`),
        }
      })      
    }
  }
}
```

```css
/*variable/color.less*/
@import '~themeVars/theme-broker.css';
```

但是，`postcss.config.js` 中，只能静态指定 `alias`，想要动态指定，需要在 `webpack.prod.conf.js` 中配置。实际运行时，发现 `postcss-import-alias-resolver` 的指定的 `alias` 在 `webpack.prod.conf.js` 中无效（**？？具体原因未找到）**。

最后，改用自定义 `postcss-import`中的 `resolve` 方法来实现的：

```js
// webpack.prod.conf.js
module.exports = theme => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name]_${theme}.css`,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(css|postcss)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('postcss-import')({
                    resolve: (id, basedir, importOptions) => {
                      // 这里会将 @import "./color.css" 的导入文件，指向`../themes/theme-${theme}.css`。所以 color.css 可以是一个并不存在的文件。
                      if (id === './color.css') {
                        return path.join(basedir, `../themes/theme-${theme}.css`)
                      }
                      return path.join(basedir, id)
                    }
                  }),
                  // 注意，webpack的配置会覆盖postcss.config.js。
                  // 所以，如有其他 postcss 插件，也要移到这里
                  ...
                ]
              }
            }
          ]
        }
      ]
    }
  }
}
```

#### 运行一次 webpack， 生成多个 css 文件 （不推荐）

* `extract-text-webpack-plugin`: 多次调用插件实例，生成多个 css 文件。不过，该插件适用于 webapck 3，目前已废弃。

  [webpack如何extract多个css](https://github.com/shirleyMHao/blog/issues/5)

* `mini-css-extract-plugin`：有多主题的相关讨论，但还没有可行的解决方案。

  [Support multiple instances of MiniCssExtractPlugin to generate multiple CSS theme output from the single CSS input](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/427)

#### JS 切换主题样式文件

* **JS 改变 link 标签的 href 属性**

  实现： [腾讯首页个性化换肤demo页面](http://www.zhangxinxu.com/study/200912/qq-home-page-skin-jquery.html)

  ```html
  <link id="skincolor" href="skin-default.css" rel="stylesheet" type="text/css">
  document.getElementById('#skincolor').href = 'skin-red.css';
  ```

  **注意：**该方法需重新加载样式表，会带来**加载延迟**。样式切换不流畅，体验不太好。

* **JS 修改 link 标签的 `disabled` 属性**

  实现： MDN [Alternative style sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)

  ```html
  <link href="reset.css" rel="stylesheet" type="text/css">
  <link href="default.css" rel="stylesheet" type="text/css" title="Default Style">
  <link href="fancy.css" rel="alternate stylesheet" type="text/css" title="Fancy" disabled>
  <link href="basic.css" rel="alternate stylesheet" type="text/css" title="Basic" disabled>
  ```

  link 标签的 `disabled` 属性用来启用或禁用样式表。通过 JS 设置 link 标签 `disabled="false"`，可以让默认不渲染的 CSS 开始渲染。

  以上样式表都可分为3类：

  - **无 title 属性：** `<link rel="stylesheet">`，无论如何都会加载并渲染。如：`reset.css`。
  
  - **有 title 属性：** `<link rel="stylesheet" title="Default Style">`，默认样式，CSS 文件加载并渲染。如：`default.css`。
  
  - **有 title 属性：** `<link rel=“alternate stylesheet” title="Fancy">`，作为备选样式，CSS 文件加载，默认不渲染。如：`fancy.css`。
  
    `alternate` 意味备用，相当于是 css 预加载进来备用，所以**不会有加载换延问题**。

## 个性化定制主题

**个性化定制主题：**主题是由**用户**定义，一般具有无限种可能，用户可以为主题变量设置任意色值。

### 方法一：动态创建 style 标签

该方法实现原理就是通过 JS 创建一个 `style` 元素，填充新样式，`append` 到 `head` 元素中，覆盖 css 文件中定义的样式。

#### 一个简单的DEMO

```html
<div class="text_color"> 一个简单的示意 </div>
```

```css
.text_color { color: red; }
```

```js
const styleDom = document.createElement('style')
styleDom.innerHTML = '.text_color { color: cyan; }'
document.head.appendChild(styleDom)
```

该方法可以说是最简单的，也可以说是最复杂的。说简单，是因为它的实现方式直接明了；说复杂，是因为它必需逐个找到需要修改的元素的 class 名，元素越多，实现起来就越复杂。

此外，使用了 css modules 的项目，我们无法锁定需要修改的元素的 class 名。

#### 案例分析

Element-UI 换肤： [Element-UI 换肤预览](https://elementui.github.io/theme-preview/#/zh-CN) [Element-UI 换肤原理](https://github.com/ElemeFE/element/issues/3054#issuecomment-468448059)

换肤实现过程：

* 用 Ajax 将当前页面的 CSS 文件请求回来；

* 处理请求回来的 CSS 数据：将需要替换的色值全部替换成新颜色值。

  Element-UI 换肤的处理过程分三步：

  * 把默认主题文件中涉及到颜色的 CSS 值替换成**关键词**。[源码](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)
  * 根据用户选择的色值，生成一系列对应的新颜色值。[源码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)
  * 把**关键词**换回刚刚生成的相应的新颜色值。[源码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)

* 创建 `style` 标签，把处理好的数据填进去，再 `append` 到 `head` 元素。[相关代码](https://github.com/EhlementUI/theme-preview/blob/master/src/app.vue#L198-L211)

#### 简单源码示例

```js
function changeTheme (url, colorMap = {}) {
  const request = new XMLHttpRequest()
  request.onreadystatechange = res => {
    const resTarget = res.target
    if (resTarget.readyState !== 4) {
      return
    }
    if (resTarget.status === 200) {
      let originalStyle = resTarget.response
      for (let k in colorMap) {
        originalStyle = originalStyle.replace(new RegExp(k, 'ig'), colorMap[k])
      }
      const styleDom = document.createElement('style')
      styleDom.innerText = originalStyle
      document.head.appendChild(styleDom)
    }
  }
  request.open('GET', url)
  request.send()
}
changeTheme('https://xxx.xxx.com/css_file_path/index.css', {
  '#508cee': '#ff5521',
  '#D2DFFE': '#FFDDD2'
})
```

### 方法二：LESS 在线修改变量

基于 `less` 写样式，为主题相关的颜色定义变量。在 HTML 中直接引入 `.less` 文件，再引入 `less.js` ，`less.js` 会在线将 `.less` 文件编译成浏览器可识别的样式，然后填充在新创建的 `style` 标签中。我们通过调用 `less.modifyVars` 方法修改主题变量实现个性化定制主题。

#### 一个简单的DEMO

```html
<body>
  <link rel="stylesheet/less" type="text/css" href="theme.less" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/4.1.1/less.min.js"></script>
  <div class="text_color">LESS 在线修改变量</div>
</body>
```

```css
/**theme.less**/
@major_color: red;
.text_color {
  color: @major_color;
}
```

`less.js` 在线编译 `.less` 文件，创建一个 `style` 元素，填入编译后的样式：

```html
<link rel="stylesheet/less" type="text/css" href="theme.less">
<style type="text/css" id="less:pages-common-templatev1-theme">.text_color {color: red;}</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/4.1.1/less.min.js"></script>
```

JS 修改变量：

```js
window.less.modifyVars({"@major_color": 'cyan'})
```

```html
<style type="text/css" id="less:pages-common-templatev1-theme">.text_color {color: cyan;}</style>
```

#### 方法分析

* 引入的 `.less` 文件，需要在浏览器中编译，这对浏览器性能有影响，不建议在生产环境使用。

* 此方法仅限于用 `less` 的项目才能使用。`sass` 没有类似 `less.modifyVars`  的方法。

* 引入 `.less` 文件的 `<link>` 标签：`rel` 属性值必需是 `stylesheet/less`。

* `less.js` 一定要在所有的 `.less` 文件后引用。

* 最后一个关键问题：如何把项目中的 `less` 样式（`.less`文件、`.vue` 文件中的 `<style lang="less">` 等）提取到一个 `.less` 文件中。

  目前还没有找到可实现的方案。 [Ant Design Pro 在线更换主题](https://pro.ant.design/zh-CN/blog/change-theme) 有正在试验的方案，但目前还有问题。它的实现步骤：

  * 合并 less：通过 `antd-pro-merge-less` 插件扫描 `src` 中所有的 less，将其合并为一个 `.less` 文件。
  * 转化 css-module。
  * 抽取 less 变量：通过 `antd-theme-webpack-plugin` 来做到的。它通过遍历 less 的语法树，抽取配置中所有拥有 `less` 变量的选择器，并且将其组合成一个 `color.less` 的文件。[antd-theme-generator](https://www.npmjs.com/package/antd-theme-generator) 可以查看具体实现。

#### 实例预览：[Ant Design 在线更换主题预览](https://antdtheme.com/aliyun)



## 最优雅的切换/自定义主题方案

**CSS 变量：** CSS 预设主题相关变量， 通过 JS 动态修改 CSS 变量，进而修改主题。

css 变量的设置及使用：

```css
:root {
  --major-color: red;
}
.text_color {
  color: var(--major-color);
}
```

JS 操作 CSS 变量：

```js
document.documentElement.style.getPropertyValue('--major-color')
document.documentElement.style.setProperty('--major-color', 'purple')
document.documentElement.style.removeProperty('--major-color')

/*
注意：js操作css变量是在标签的style对象上，所以，对于在css文件中定义的变量，如：`:root { --major-color: red; }`，调用 getPropertyValue 方法，返回的值是空字符。
可以改用下面方法获取：
*/
getComputedStyle(document.documentElement).getPropertyValue('--major-color')
```

### **CSS 变量最大的问题是浏览器兼容性**

目前来看（2021.07），大部分主流浏览器（chrome、safari、firefox、edge等）是支持的，但是，IE 浏览器不支持。

![image-20210720160638232](https://tva1.sinaimg.cn/large/008i3skNly1gsnh8wsg97j31210ghq6b.jpg)

[https://caniuse.com/css-variables](https://caniuse.com/css-variables)



## 总结

* **class 命名空间**：这是个值得推荐的方案。它的唯一问题是，css 文件将多个主题的样式打包进来，文件会增大。不过，使用 `postcss-themes` 生成多主题样式，只会新增引用了主题相关变量的选择器，文件不会增加太多，并且，它还有个优势：切换主题不会有延迟问题。
* **多个 CSS 文件**：相比 class 命名空间，这个方案优势在于首次加载的 CSS 文件不需要包含其他主题相关的样式。它的缺点：切换主题可能会有加截延迟；webpack 类的打包工具生成的 CSS 文件，我们通常习惯给文件名指定 hash 值，这会导致 JS 动态加载 CSS 时，无法确定正确的文件名；如果有按需加载的模块，切换主题会变得不好处理。
  
* **动态创建 style 标签**：这个方案是最灵活的，可以任意修改元素的样式。其他方案都有个前提，必需先确定主题相关的变量，主题切换只能修改引用了变量的样式。它的缺点也很明显：主题切换涉及的元素越多，实现成本就越高；不适合使用了 css module 的项目；如果是基于请求已有 css 文件的数据，替换色值来实现，则会有加截延迟问题，另外，按需加载的模块也不好处理。
* **LESS 在线修改变量**：这是个不太实用的方案。因为，在浏览器中实时编译  `.less`  文件，非常影响性能，不适合用于生产环境，另外，将所有主题变量相关的样式提取到一个单独的 `.less` 文件也比较麻烦。


* **css 变量方法 (推荐)**：这是最完美的方案，除了不支持 IE 浏览器（目前已确定的是 IE，也可能还有些其他非主流浏览器）。



## 参考链接

[使用 css/less 动态更换主题色（换肤功能）](https://www.cnblogs.com/leiting/p/11203383.html)

[一文总结前端换肤换主题](https://www.jianshu.com/p/35e0581629d2)

[实现三方库按需引入与多主题方案](https://hstory.cn/2018/08/31/%E5%AE%9E%E7%8E%B0%E4%B8%89%E6%96%B9%E5%BA%93%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5%E4%B8%8E%E5%A4%9A%E4%B8%BB%E9%A2%98%E6%96%B9%E6%A1%88/)

[阮一峰-CSS 变量教程](https://www.ruanyifeng.com/blog/2017/05/css-variables.html)

