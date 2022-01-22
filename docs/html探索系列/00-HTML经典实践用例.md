## HTML经典实践用例

### 实现圆形点击区域

* **纯 html 实现：** 使用 `map`、`area` 来给图像标记热点区域的方式。`map` 标签用来定义一个客户端图像映射，`area`  标签用来定义图像映射中的区域（矩形、圆形、多边形），`area` 标签必需嵌套在 `map` 元素内部。

* **纯 css 实现：** 使用 `border-radius` ，当 `border-radius` 的长度等于宽高相等的元素值的一半时，即可实现一个圆形的点击区域。

* **纯 Js 实现：** 通过监听文档的点击事件，获取每次点击时鼠标的位置，判断该位置是否在规定的圆形区域内。

```html
<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/nice/20190419141711_6640njffmwvi_small.jpg" usemap="#IMG">
<map id="IMG" name="IMG">
    <area shape="rect" coords="0,0,200,200" href="https://www.google.com" target="blank" title="www.google.com">
    <area shape="circle" coords="300,160,120" href="https://www.baidu.com" target="blank" title="www.baidu.com">
    <area shape="poly" coords="400,0,500,100,600,300,550,250,350,150,400,0" href="https://www.huaban.com" target="blank" title="www.huaban.com">
</map>
```

[查看 图像映射 DEMO](https://1927344728.github.io/demo-lizh/html/00-html.html?type=2)

#### map

`map` 标签用于与其他标签来定义图像映射（可点击链接区域）。

通过 `map` 标签的 `name` 属性为提供了一个名称，以便可以对其进行引用。该属性必须存在并且必须具有不带空格字符的非空值，不得等于同一文档另一个 `map` 标签的 `name` 属性值。如果指定了 `id` 性，则 `id` 属性必须与 `name` 相同。

图片和热点区域元素关联是使用图片的 `usemap` 属性，其值对应 `map` 标签的 `id` 或者 `name`。出于兼容性考虑，最好两个属性都加上。比如，Chrome 只支持 `name` 属性。

#### area

`area` 标签可以在热点区域内定义几何区域与相关联的超文本链接。

* shape： 定义热点的形状。

  `rect` 表示定义了一个矩形区域；

  `circle` 表示定义了一个圆形区域；

  `poly` 表示定义一个多边形；

  `default` 表示超出任何定义形状的整个区域。

* coords： 说明了的坐标 `shape` 的大小、形状和位置，坐标值都是以 `px` 为单位。

  `rect `对应值是 `x1,y1,x2,y2`，指定矩形左上角和右下角的坐标；

  `circle `对应值是 `x,y,radius`，指定圆心坐标和半径；

  `poly` 对应值是 `x1,y1,x2,y2,..,xn,yn`，指定多边形边缘的坐标。如果第一个和最后一个坐标对不一样，浏览器会添加最后一个坐标对来闭合多边形；

  `default` 则不需要该属性，即使定义了也是无效r 。

* href： `area` 的超链接目标，是一个有效的 URL。该属性可以省略；如果省略，则该 `area` 标签不代表超链接。

**注意：** `area` 标签必须拥有一个 `map` 祖先标签，但不一定是直接的父标签。

**注意：** 如果某个 `area` 标签中的坐标和其他区域发生了重叠，会优先采用最先出现的 `area` 标签。浏览器会忽略超过图像边界范围之外的坐标。

**注意：** Tab 键索引可以看到 area 区域。

