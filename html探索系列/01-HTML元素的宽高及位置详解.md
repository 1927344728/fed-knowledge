## HTML元素的宽高度及位置详解

### 元素的宽度
```js
window.innerWidth   //除去菜单栏的窗口宽度。安卓、ios都认别
window.innerHeight  //除去菜单栏的窗口高度。安卓、ios都认别
window.outerWidth  //包括菜单栏的窗口宽度。安卓手机识别，ios不认别。
window.outerHeight  //包括菜单栏的窗口宽度。安卓手机识别，ios不认别。

window.screen.height  //屏幕的高度
window.screen.width  //屏幕的宽度
window.screen.availHeight  //屏幕的可利用高度
window.screen.availWidth  //屏幕的可利用宽度
//screen.width/height，屏幕宽度/高度(即：屏幕分辩率。比如1920 * 1080）
//screen.availWidth/availHeight，屏幕的可利用宽度/高度(即：屏幕分辩率 - (工具栏 + mac的dock等)

window.screenTop  //浏览器距离屏幕的高度
window.screenLeft  //浏览器距离屏幕的宽度
window.scrollX //属性返回页面的水平滚动距离
window.scrollY //属性返回页面的垂直滚动距离，单位都为像素。这两个属性只读。
window.pageXOffset //window.scrollX别名
window.pageYOffset //window.scrollY别名

document.body.clientWidth  //指元素的自身宽度（包括padding）
document.body.clientHeight  //指元素的自身的高度（包括padding）
document.body.clientLeft  //子级div内容位置到父级内容区域的宽度距离(即border值)
document.body.clientTop  //子级div内容位置到父级内容区域的高度距离(即border值)
document.body.offsetWidth  //指定元素的宽度（包括padding，border和内容）
document.body.offsetHeight  //指定元素的高度（包括padding，border和内容）
document.body.offsetTop  //距离父级元素的高度
document.body.offsetLeft  //距离父级元素的宽度
document.body.scrollWidth  //获取的是文档的宽度（当指定的宽度小于浏览器窗口的时候，为浏览器的宽度）
document.body.scrollHeight  //获取的是文档的高度（当指定的高度小于浏览器窗口的时候，为浏览器的高度）
document.body.scrollTop  //文档被滚动上去的时候（即滚动条往上滚动的距离）
document.body.scrollLeft  //文档被滚动右去的时候（即滚动条往右滚动的距离）

document.documentElement.scrollWidth  //获取的是文档的宽度（当指定的宽度小于浏览器窗口的时候，为浏览器的宽度）
document.documentElement.scrollHeight  //
document.documentElement.scrollTop //垂直方向滚动的值  
document.documentElement.scrollLeft

//clientX，clientY是事件中的概念 
event.clientX //鼠标点击时候距离可视区的左侧坐标  
event.clientY //鼠标点击时候距离可视区的上侧坐标  
event.clientX + document.documentElement.scrollLeft //鼠标点击时候相对文档左侧的水平距离
```
> document.body.scrollTop与document.documentElement.scrollTop两者有个特点，就是同时只会有一个值生效。比如document.body.scrollTop能取到值的时候，document.documentElement.scrollTop就会始终为0；反之亦然。所以，如果要得到网页的真正的scrollTop值，可以这样：  `document.body.scrollTop + document.documentElement.scrollTop`。  


offset：指定元素的border+padding+内容的宽度和高度  
> IE6/7中: offsetLeft = (offsetParent的padding-left)+(当前元素的margin-left)  
> IE8以上: offsetLeft = (offsetParent的margin-left)+(当前元素的margin-left)  
> 火狐中: offsetLeft = (offsetParent的margin-left)+(当前元素的margin-left)+(offsetParent的padding-left)


client: 指定元素的宽度和高度 即内容+padding  
> 如果没有滚动条，即元素本身设定的宽度  
> 如果出现滚动条，滚动条会遮盖元素宽高，那么，该属性就是其本来宽高减去滚动条的宽度  
> 读取元素border的宽度和高度（子级内容区域到父级内容区域的距离）: document.body.clientLeft、document.body.clientTop  

scroll： 元素的宽度（client）+滚动部分??



### 文档渲染模式  
文档的渲染模式有"混杂模式"和"标准模式"。还有另外一种渲染模式, Gecko的"准标准模式", 该模式和标准规范模式的区别仅为表格单元内的图片布局方式不同. 且该模式的类型字符串仍为: "CSS1Compat".  

document.compatMode用来判断当前浏览器采用的渲染方式。官方解释：  
BackCompat：标准兼容模式关闭。  
CSS1Compat：标准兼容模式开启。  

当document.compatMode等于BackCompat时，浏览器客户区宽度是document.body.clientWidth；
当document.compatMode等于CSS1Compat时，浏览器客户区宽度是document.documentElement.clientWidth。

documentElement 对应的是 html 标签，而 body 对应的是 body 标签。    



### 浏览器窗口可视区域兼容性写法

浏览器窗口的大小，则是指在浏览器窗口中看到的那部分网页面积，又叫做viewport（视口）。  

```js
function getViewport(){
    if (document.compatMode == "BackCompat"){
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}
```

一个准确获取网页客户区的宽高、滚动条宽高、滚动条Left和Top的代码（兼容目前流行的全部浏览器，包括：IE、Firefox、Safari、Opera、Chrome）：

```js
if (document.compatMode == "BackCompat") {
    cWidth = document.body.clientWidth;
    cHeight = document.body.clientHeight;
    sWidth = document.body.scrollWidth;
    sHeight = document.body.scrollHeight;
    sLeft = document.body.scrollLeft;
    sTop = document.body.scrollTop;
} else { //document.compatMode == "CSS1Compat"
    cWidth = document.documentElement.clientWidth;
    cHeight = document.documentElement.clientHeight;
    sWidth = document.documentElement.scrollWidth;
    sHeight = document.documentElement.scrollHeight;
    sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
    sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
}
```
>1. 必须在页面加载完成后才能运行，否则document对象还没生成，浏览器会报错。
>2. 大多数情况下，都是document.documentElement.clientWidth返回正确值。但是，在IE6的quirks模式中，document.body.clientWidth返回正确的值，因此加入了对文档模式的判断
>3. clientWidth和clientHeight都是只读属性，不能对它们赋值。

  

### 网页的大小

首先，要明确两个基本概念。  

一张网页的全部面积，就是它的大小。通常情况下，网页的大小由内容和CSS样式表决定。  

很显然，如果网页的内容能够在浏览器窗口中全部显示（也就是不出现滚动条），那么网页的大小和浏览器窗口的大小是相等的。如果不能全部显示，则滚动浏览器窗口，可以显示出网页的各个部分。  

```js
function getPagearea(){
    if (document.compatMode == "BackCompat"){
        return {
            width: Math.max(document.body.scrollWidth, document.body.clientWidth),
            height: Math.max(document.body.scrollHeight, document.body.clientHeight)
    　　}
    } else {
        return {
            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
        }
    }
}
```

>网页内容能够在浏览器窗口中全部显示，不出现滚动条，那么网页的clientWidth和scrollWidth应该相等。但是实际上，不同浏览器有不同的处理，这两个值未必相等。所以，我们需要取它们之中较大的那个值。  



### 网页元素的位置

#### **获取网页元素的绝对位置**

网页元素的绝对位置，指**该元素的左上角相对于整张网页左上角的坐标**。这个绝对位置要通过计算才能得到。  
每个元素都有offsetTop和offsetLeft属性，表示该元素的左上角与父容器（offsetParent对象）左上角的距离。所以，只需要将这两个值进行累加，就可以得到该元素的绝对坐标。  

```js
function getElementLeft(element) {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent
    while (current !== null) {
    　　actualLeft += current.offsetLeft
    　　current = current.offsetParent
    }
    return actualLeft
}
function getElementTop(element) {
    var actualTop = element.offsetTop
    var current = element.offsetParent
    while (current !== null) {
    　　actualTop += current.offsetTop
    　　current = current.offsetParent
    }
    return actualTop
}
```

#### **获取网页元素的相对位置**  

网页元素的相对位置，指**该元素左上角相对于浏览器窗口左上角的坐标**。  
有了绝对位置以后，获得相对位置就很容易了，只要将绝对坐标减去页面的滚动条滚动的距离就可以了。滚动条滚动的垂直距离，是document对象的scrollTop属性；滚动条滚动的水平距离是document对象的scrollLeft属性。  

```js
function getElementViewLeft(element) {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent
    while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }

    var elementScrollLeft = document.compatMode == "BackCompat" ? document.body.scrollLeft : document.documentElement.scrollLeft
    return actualLeft - elementScrollLeft
}
function getElementViewTop(element) {
    var actualTop = element.offsetTop
    var current = element.offsetParent

    while (current !== null) {
        actualTop += current. offsetTop
        current = current.offsetParent
    }

    var elementScrollTop = document.compatMode == "BackCompat" ? document.body.scrollTop :document.documentElement.scrollTop
    return actualTop - elementScrollTop
}
```

>scrollTop和scrollLeft属性是可以赋值的，并且会立即自动滚动网页到相应位置，因此可以利用它们改变网页元素的相对位置。另外，element.scrollIntoView()方法也有类似作用，可以使网页元素出现在浏览器窗口的左上角。  

#### **获取元素位置的快速方法**  

除了上面的函数以外，还有一种快速方法，可以立刻获得网页元素的位置。那就是使用getBoundingClientRect()方法。它返回一个对象，其中包含了left、right、top、bottom四个属性，分别对应了该元素的左上角和右下角相对于浏览器窗口（viewport）左上角的距离。  

相对位置:  
```js
var X = this.getBoundingClientRect().left
var Y = this.getBoundingClientRect().top
```

绝对位置(相对位置+滚动距离):  
```js
var X = this.getBoundingClientRect().left + document.documentElement.scrollLeft  + document.body.scrollLeft
var Y = this.getBoundingClientRect().top + document.documentElement.scrollTop + document.body.scrollTop
```
> 目前，IE、Firefox 3.0+、Opera 9.5+都支持该方法，而Firefox 2.x、Safari、Chrome、Konqueror不支持。
