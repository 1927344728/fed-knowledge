## CSS应用示例

### Img标签图片空隙问题

img 是内联元素，当父元素没有设置高度的时候，底部会有一些空白。

具体原因与幽灵空白节点和行高有关，可查看 [幽灵空白节点](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/css-tan-suo-xi-lie/00css-ji-chu-zhi-shi#you-ling-kong-bai-jie-dian)、[img元素底部为何有空白？](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/css-tan-suo-xi-lie/14css-tan-suo-xi-lie-lineheight#img-yuan-su-di-bu-wei-he-you-kong-bai)。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/1245223-a1d7789ea88eef3f.png)

**解决方法：**

-  **display: block：** 把 img 元素设为块级元素；
-  **font-size: 0：** 将父元素字体大小设为零；
-  **vertical-align: top|bottom|text-top|text-bottom：** 修改 img 元素的垂直对齐方式；
-  **overflow: hidden：** `img` 元素、父元素设置相同高度，父元素加 `overflow:hidden` ，截掉超出的空白部分；
-  **float: left：** 设置 img 元素的浮动属性，这样图片的 `display` 属性值会变成 `block` 。

**注意：** 图片宽高最好为偶数，否则图片之间可能出现一丝间隙。[具体原理与设备的象素比有关](https://juejin.im/entry/59e70320f265da431c6f6514)

### rem产生的小数像素问题

rem 是 css 中的相对长度单位。**概括地说**，rem 单位的意思是"根元素的字体大小“，即 HTML 节点的 fontsize 值。响应式开发中，用rem 做单位，可以通过修改 HTML 节点的 fontsize 值，实现在不同屏宽下，渲染出不同尺寸的元素。

比如：HTML 节点的 `font-size: 16px`，其子元素 `font-size: 1rem`，最终计算子元素的 font-size 值 `16px * 1 = 16px`。

与此同时，rem 单位的使用也带来一个问题：对于单倍像素密度的屏幕而言，px 是最小的单位，如果子元素 `font-size: 1.03rem`，最终计算出来的值是 `16px * 1.03 = 16.475px`。那么，这`16.475px` 最终是如果渲染的呢？

![image-20210916000059171](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20210916000059171.png)

```html
<section>
  <style type="text/css">
    .box1 ul li {
      height: 1.03rem;
    }
  </style>
  <div class="box1">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</section>
<script>
    console.log('LI元素的CSS计算高度和实际渲染高度：')
    Array.prototype.slice.call(document.querySelector('.box1').getElementsByTagName('li')).map((e, i) => {
        console.log(`第${i + 1}个：`, getComputedStyle(e).height, e.clientHeight)
    })
</script>
```

[查看DEMO](https://1927344728.github.io/demo-lizh/html/others_01.html)

从示例可见，元素最终渲染出来的高度，有可能是17，也有可能是16。

浏览器的渲染规则：**对像素小数进行四舍五入，元素最终渲染出来的像素是整数体，但是，元素真实占据的空间依旧是原始大小，即带小数的值。**

也就是说，如果当前元素没有被其他元素占用空间，其尺寸带小数 `0.475px`，那么小数部分的渲染尺寸应该是 `0px`，但它会占用其临近的元素的空间。如果其临近的元素也带小数 `0.475px` ，加上被占用的 `0.475px`，实际的小数部分是`0.95px`，四舍五入，最终渲染为 `1px`，同时，它还有 `0.05px` 的空间可以被其它元素占用。

了解更多，可参考 http://trac.webkit.org/wiki/LayoutUnit

### 文本超出时省略

```css
/*单行*/
{
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}
/*多行*/
{
    overflow: hidden;
    text-overflow: ellipsis;
    display:-moz-box;
    display:-webkit-box;
    display:box;
    -moz-line-clamp: 3;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -moz-box-orient: vertical;
    -webkit-box-orient: vertical;
    box-orient: vertical;
}
```

### 自定义滚动条的颜色

注：设置在 `body` 上的滚动条颜色样式无效，需加在 `html` 标签。

```css
/*滚动条整体样式*/
/*高宽分别对应横竖滚动条的尺寸*/
html::-webkit-scrollbar {
    width: 15px;  
    /*height: 1px;*/
}
/*滚动条里面小方块*/
html::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
}
/*滚动条里面轨道*/
html::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
}
```
