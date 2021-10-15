## HTML常见问题概览
#### 1. 页面锚点偏移

在进行锚点定位时，页面往往定位到页面的最顶部，无论是上部有导航条，还是出于美观考虑，都希望定位后该内容与页面顶部有一些间距。而锚点自动定位是无法达到的。   

* **方法一：** 用`Element.scrollIntoView()` 滚动页面 ：该方法将当前的元素滚动到浏览器窗口的可视区域内。

* **方法二：** 利用 `padding-top` 将锚点上移 `100px`，再用 `margin-top` 将内容上移 `100px`，修复锚点区域和内容区域 `padding-top` 产生的 `100px`的偏移。

  ```css
  .anchor{
      padding-top: 100px;
      margin-top: -100px;  
  }
  ```

  类似的，也可以在元素前面新添加一个元素，设置高度，本元素设置margin-top负值.

* **方法三：** 利用 css3 的 `:target` 选择器。`:target` 声明只支持现代浏览器，IE浏览器支持 IE9+。

  ```css
  .anchor:target{
      padding-top:100px;
  }
  ```

* **方法四：** 绑定 `window.onhashchange` 事件，控制页面滑动。

  ```js
  window.addEventListener('hashchange', function(e) {
      window.scrollBy(0, -100)
  }, false);
  ```



