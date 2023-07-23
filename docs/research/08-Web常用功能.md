## Web常用功能

### H5唤起移动应用

唤起 App，在不同平台要采用不同的方法，主要是这三个：

- URL Scheme
- Universal Link
- Android App Links

##### URL Scheme

URL Scheme 是 iOS、Android 都兼容的机制，只需要原生 App 开发时注册 Scheme 即可，用户点击此类链接时，会自动唤醒 App，并借助 URL Router 机制跳转到指定页面。

[常见的 app URL Scheme](https://blog.csdn.net/wangxiaocheng16/article/details/104313571)：

```shell
sms://    #短信
tel://    #电话
weixin:// #微信
alipay:// #支付宝
taobao:// #陶宝
mqq://    #QQ
zhihu://  #知乎
```

URL Scheme 存在的限制：

- 国内各个厂商浏览器差异很大，当要被唤醒的目标 App 未安装时，这个链接很容易出错。
- 当注册有多个 Scheme 相同的时候，目前是没有办法区分的。
- 不支持从其他 App 中的 UIWebView 中跳转到目标 App。
- **被部分主流平台禁止**，微信、微博、QQ浏览器、手机百度中都已经被禁止使用。

正是由于这些限制的存在，苹果和安卓都不约而同发布了自己的第二套方案：iOS 的 Universal Link、Android 的 App Links。

##### Universal Link（iOS）

Universal Link 是 iOS 9 后苹果推出的通用链接技术，能够方便的通过一个 https 链接来打开 App 指定页面，不需要额外的判断，如果没有安装 App，可以跳转到自定义地址。

相对 Scheme 的优势在于，Universal Link 是一个 Web Link，因此少了很多麻烦：当用户已安装该 App 时，不需要加载任何页面，能够立即唤醒 App，用户未安装 App，则跳去对应的 web link（自定义页面）。

Universal Links 支持从其他 App 中的 UIWebView 中跳转到目标 app。提供 Universal Link 给别的 App 进行 App 间的交流，然而对方并不能够用这个方法去检测你的 App 是否被安装，具有比较好的隐私性。绝大多数平台都支持 Universal Link，微信 7.0.5 版本也解除了对 Universal Link 的限制，同时也能被搜索引擎索引。

##### App Links（Android）

Android M 以上版本可以通过 App Links，让用户在点击一个链接时跳转到 App 的指定页面，前提是这个 App 已经安装并经过验证。App Links 的最大的作用，就是可以避免从页面唤醒 App 时出现的选择浏览器选项框，前提是必须注册相应的 Scheme，就可以实现直接打开关联的 App。

实际上 App Link s和 Universal Links 差异不大，但相对来说有不同的限制：

- App links 在国内的支持还不够，部分安卓浏览器并不支持跳转至 App，而是直接在浏览器上打开对应页面。
- 系统询问是否打开对应 App 时，假如用户选择“取消”并且选中了“记住此操作”，那么用户以后就无法再跳转 App。

##### 微信唤起 app 之 微信开放标签（wx-open-launch-app）

[wx-open-launch-app](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html) 用于页面中提供一个可跳转指定 App 的按钮。

**注意：Android平台通过开放标签跳转App，App必须接入微信OpenSDK**，详细参见文档[《Android微信 OpenSDK 接入指南》](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Access_Guide/Android.html)。

wx-open-launch-app 仅开放给**已认证的服务号**，服务号绑定“JS接口安全域名”下的网页可使用此标签跳转满足一定条件的App。在使用该标签之前，首先需要前往[微信开放平台](https://open.weixin.qq.com/)的**管理中心 - 公众账号或小程序详情 - 接口信息 - 网页跳转移动应用 - 关联设置**中绑定所需要跳转的App。详细配置规则参考文档[《微信内网页跳转 APP 功能》](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_H5_Launch_APP.html)。

需要注意的问题：

* 提前条件：服务号已认证、开放平台账号已认证、服务号与开放平台账号同主体。
* 配置：服务号 “JS接口安全域名” 绑定网页的域名、服务号绑定所需要跳转的App。

* 点击开放标签按钮无法唤起 App：跟访问页面的方式有关。点击聊天窗口的链接访问，无法唤起移动应用。需要通过分享链接或者公众号发送消息（卡片形式）、扫描二维码访问页面，才能唤起。
* 点击开放标签按钮无法唤起 App（安卓）：App 必需是已经在后台运行，才能被唤起（IOS无此限制）。（应该可以解决，需要安卓原生端开发人员参与）。

