## CSS换主题换肤方法总结

### 换主题

换主题表示页面的颜色值，是开发时已知的有限个。

#### 定制不同主题class，js控制class名

以`vue + less` 为例：

##### 提供一个函数，可根据不同传参生成不同class

主要是改变背景色和字体颜色，把需要改变的元素都提取出来，写成一个函数，方便调用，定义背景色和字体颜色两个变量，变量分别有一个默认值。

```less
/*aaa.less*/
@charset 'utf-8';
.change(@background: #e2e9f9,@color: #337ab7){
  .aaaa {
    background: @background;
  }
  .bbbb a:hover{
    color: saturate(@color,20%);
  }
  .cccc {
    color: @color;
  }
  .dddd {
    background: fadeout(@color,30%);
  }
  .eeee {
    background: darken(@color, 10%);
  }
}
```

##### 调用此函数，在less文件中生成不同主题

在less文件开始处，引入aaa.less文件。语法为`import url(aaa.less)`，然后调用change函数，分别给不同的皮肤设置不同的颜色。

`class0, class1, class2...`是生成不同主题的类名。页面换主题，是用js给body或其他需要换主题的元素设置不同class名。

```less
@charset "utf-8";
@import url(aaa.less);
.class0 {
    .change();  //默认  经典蓝
}
.class1 {
    .change(#f5e2c9,#9f754d);   //咖啡棕
}
.class2 {
    .change(#e5d3ed,#b88bcb); //紫色
}
```

```js
document.body.className = [class0 | class1 | class2]
```



#### JS改变href属性值切换样式表

实现： [腾讯首页个性化换肤demo页面](http://www.zhangxinxu.com/study/200912/qq-home-page-skin-jquery.html)

```html
<link id="skincolor" href="skin-default.css" rel="stylesheet" type="text/css">
document.getElementById('#skincolor').href = 'skin-red.css';
```

这种实现有两个缺点：

**不易维护：**对于颜色和主题多了，需要同时维护 n 个样式文件，

**加载延迟：**重新加载样式表，会带来加载延迟。样式切换不流畅，体验也不好。



#### HTML 的 rel 属性下的 alternate

实现： MDN [Alternative style sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)

```html
<link href="reset.css" rel="stylesheet" type="text/css">
<link href="default.css" rel="stylesheet" type="text/css" title="Default Style">
<link href="fancy.css" rel="alternate stylesheet" type="text/css" title="Fancy" disabled>
<link href="basic.css" rel="alternate stylesheet" type="text/css" title="Basic" disabled>
```

所有样式表都可分为3类：

* **无title属性，**`<link rel=“stylesheet”>`，**无论如何都会加载并渲染**。如`reset.css`。
* **有title属性，**`<link rel=“stylesheet”>`，作为默认样式CSS文件加载并渲染。如`default.css`。
* **有title属性，**`<link rel=“alternate stylesheet”>`，作为备选样式CSS文件加载，默认不渲染。如`red.css、green.cs`s。

alternate意味备用，相当于是 css 预加载进来备用，所以不会有上面那种切换延时。

 **具体使用：**

**`<link>` 的 `disabled `属性**可以来和启用或禁和多个样式表。**使用`JavaScript`代码修改`<link>`元素**DOM对象的`disabled`值**为`false`，可以让默认不渲染的CSS开始渲染。



### 动态色值换肤

动态换肤表示，开发时无法知道具体色值。是客户端用户自定义的色值。

这种情况，上面的几种方式就不适合了。 



先看下已有的实现有哪些方法：

#### 全局替换样式中的色值

实现：Element-UI 换肤功能。 [示例预览](https://elementui.github.io/theme-preview/#/zh-CN) [实现原理](https://github.com/ElemeFE/element/issues/3054)

* 查找需要替换的色值。把默认主题文件中涉及到颜色的 CSS 值替换成**关键词**。[相关代码](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)

* 根据用户选择的色值，生成一系列对应的新颜色值。[相关代码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)
* 把**关键词**换回刚刚生成的相应的新颜色值。[相关代码](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)

* 创建 `style` 标签，把生成的样式填进去，再append到页面中。[相关代码](https://github.com/EhlementUI/theme-preview/blob/master/src/app.vue#L198-L211)



#### 修改less的色值变量

实现：Ant Design 的更换主题色功能

**通过`<link>`引入less文件**，然后基于less.js中的方法来进行修改变量。这里是用 less 提供的 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式进行覆盖变量来实现。

**modifyVars方法是基于 `less` 在浏览器中的编译来实现。**

> 此方法仅限于用less的项目才能使用。sass是没有类似 less.modifyVars 这种方法的。



实现过程如下：

* 利用webpack中的`extract-text-webpack-plugin`，将vue中每个.vue文件里面的style提取出来。

  ```js
  {
      module: {
          rules: [
              {
                  test: /\.vue$/,
                  loader: 'vue-loader',
                  options: {
                    loaders: {
                      less: ExtractTextPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: 'css-loader!less-loader'
                      }),
                      css: ExtractTextPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: 'css-loader'
                      })
                    }
                  }
                },    
      ]},
      plugins: [
        new ExtractTextPlugin({
          filename: 'css/styles.less' //路径以及命名
        })
      ]
  }
  ```

* 在html中引入less文件，**通过less.js而不是less-loader来编译这个文件**。

  ```html
  <link rel="stylesheet/less" type="text/css" href="./src/less/style.less" />
  <script>
    window.less = {
      env: 'development',
    }
  </script>
  <script src="static/js/less.js"></script>
  ```

  **注意：**

  **less.js一定要在所有的less文件后引用**

  引入less文件的`<link>`标签，type类型必需是`type=”text/less”`

* 通过js修改相应的变量。

  ```js
  less.modifyVars({
    '@mainColor': 'blue'
  });
  ```

如果发现项目运行报错如下：

```js
.bezierEasingMixin();
^
Inline JavaScript is not enabled. Is it set in your options?
```

 那可能是webpack配置里没有开启 `javascriptEnabled：true`:

```js
{
  test: /\.less$/,
  loader: 'less-loader',
  options: {
    javascriptEnabled: true
  }
}
```



### css 变量方法

如果项目里用的不是less, 那么还是用css的方法，通用且容易操作。

使用**css变量**来进行主题色的修改，替换主题色变量，然后用setProperty来进行动态修改。

用法就是给变量加`--`前缀，涉及到主题色的都改成`var(--themeColor)`这种方式

用之前看下兼容性

![img](https://img2018.cnblogs.com/blog/1207871/201908/1207871-20190802143842870-1700097756.png)

 [https://caniuse.com/#search=CSS%20Variables](https://caniuse.com/#search=CSS Variables)

大部分主流浏览器还是支持的，而且主要是操作起来够简便。

用法举例：

```css
body{   --themeColor:#000;}
```

使用：

```css
.main{   color: var(--themeColor);}
```

要修改主题色的话：

```css
document.body.style.setProperty('--themeColor', '#ff0000');
```



### 总结

#### 1. 定制不同主题class，js控制class名

- 简单，好理解，已有项目实现比较困难
- 需要多个主题的class，并将所有有色值的样式写在同一class命名空间下

#### 2. JS改变href属性值切换样式表

* 简单，好理解，已有项目实现比较困难
* **需要找到在webpack中，可以同时生成多个不同主题的样式表的方法**
* 需要多个主题的样式表。主题多了，维护起来很麻烦
* 切换样式，加截css文件有延迟

#### 3. HTML 的 rel 属性下的 alternate

	* 与方法2类似
	* 优点在于，没有加载延迟

#### 4. 全局替换样式中的色值

* 实现相对简单
* 有加截延迟
* 请求css文件，可能有跨域问题

#### 5. 修改less的色值变量

* 需要将vue文件中，所有样式提取到一个.less文件中
* 基于 `less` 在浏览器中的编译来实现。这种在线编译less文件的方法，影响性能

#### 6. css 变量方法 (推荐，最佳换肤方案)

* 需要对已有色值进行提取，已有项目实现比较困难
* 不支持IE， 2016年前的chrome，safari
* 兼容性原因，机型覆盖率难以评估。[Can I Use CSS Variables](https://caniuse.com/#feat=css-variables)



### 参考链接

[使用 css/less 动态更换主题色（换肤功能）](https://www.cnblogs.com/leiting/p/11203383.html)

[聊一聊前端换肤](https://juejin.im/post/5ca41617f265da3092006155)

[一文总结前端换肤换主题](https://www.jianshu.com/p/35e0581629d2)