## 蒙层底部页面跟随滚动
弹窗是一种常见的交互方式，而蒙层是弹窗必不可少的元素，用于隔断页面与弹窗区块，暂时阻断页面的交互。但是，在蒙层元素中滑动的时候，滑到内容的尽头时，再继续滑动，蒙层底部的页面会开始滚动，显然这不是我们想要的效果，因此需要阻止这种行为。  

#### 解决方案一

打开蒙层时，给body添加样式：

```css
/*在某些机型下，你可能还需要给根节点添加此样式。关闭蒙层时，移除些样式*/
body {
    height: 100%;
    overflow: hidden;
}
```

**优点：**简单方便，只需添加css样式，没有复杂的逻辑。
**缺点：**兼容性不好，适用于pc，移动端就尴尬了。部分安卓机型以及safari中，无法无法阻止底部页面滚动。  



#### 解决方案二

就是利用移动端的touch事件，来阻止默认行为（这里可以理解为页面滚动就是默认行为）。

```js
// node为蒙层容器dom节点
node.addEventListener('touchstart', e => {
    e.preventDefault()
}, false)
```
简单粗暴，滚动时底部页面也无法动弹了。假如你的蒙层内容不会有滚动条，那么上述方法prefect。
但是，最怕空气突然安静，假如蒙层内容有滚动条的话，那么它再也无法动弹了。因此我们需要写一些js逻辑来判断要不要阻止默认行为，复杂程度明显增加。

**具体思路：**判定蒙层内容是否滚动到尽头，是则阻止默认行为，反之任它横行。



#### **解决方案三**(推荐使用)  

**具体思路：**要阻止页面滚动，那么何不将其固定在视窗（即position: fixed），这样它就无法滚动了，当蒙层关闭时再释放。
当然还有一些细节要考虑，将页面固定视窗后，内容会回头最顶端，需要记录一下同步top值。

```js
let top = 0
function stopBodyScroll (isFixed) {
    let bodyEl = document.body
    if (isFixed) {
        top = window.scrollY

        bodyEl.style.position = 'fixed'
        bodyEl.style.top = -top + 'px'
    } else {
        bodyEl.style.position = ''
        bodyEl.style.top = ''
        window.scrollTo(0, top) // 回到原先的top
    }
}
```


