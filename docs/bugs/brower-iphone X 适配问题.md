## iphone X 适配问题 
### 安全区域

iPhoneX 取消了物理按键，改成底部小黑条，这一改动导致网页出现了比较尴尬的屏幕适配问题。对于网页而言，顶部（刘海部位）的适配问题浏览器已经做了处理，所以我们只需要关注底部与小黑条的适配问题即可（即常见的吸底导航、返回顶部等各种相对底部 fixed 定位的元素）。以下是解决方法：

1. html文件的head的meta[name='viewport']加属性`viewport-fit=cover`
   
   ```html
   <meta name="viewport" content="width=device-width, viewport-fit=cover">
   ```
   
   iOS11 新增特性，苹果公司为了适配 iPhoneX 对现有 viewport meta 标签的一个扩展，用于设置网页在可视窗口的布局方式。可设置三个值：
   
   * contain: 可视窗口完全包含网页内容
   * cover：网页内容完全覆盖可视窗口 
   * auto：默认值，跟 contain 表现一致  

2. 样式中设置安全区域

   ```css
   body {
     /*页面主体内容限定在安全区域内*/
     padding-bottom: constant(safe-area-inset-bottom);
     padding-bottom: env(safe-area-inset-bottom);
   }
   
   {
     /*fixed 元素的适配*/
     padding-bottom: constant(safe-area-inset-bottom);
     padding-bottom: env(safe-area-inset-bottom);
   }
   
   /*使用 @supports 隔离兼容样式*/
   @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(
   safe-area-inset-bottom)) {
     div {
       margin-bottom: constant(safe-area-inset-bottom);
       margin-bottom: env(safe-area-inset-bottom);
     }
   }
   ```

   

### 常见问题

1. iphone X下，fixed元素在页面滑动底部时，会往上滑动移动一点。这是由于**页面高度不足一屏(或者撑开页面高度的元素加了fixed，脱离文档流)**引起的。解决：
   * body或者主元素中加 min-height
   * 加空的div撑高页面
2. 元素使用`padding-bottom`预留底部小黑条区域，必需设置`box-sizing: content-box`




