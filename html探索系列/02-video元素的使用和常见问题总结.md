## video元素的使用和常见问题总结

**HTML`<video>`元素** 用于在`HTML`或者`XHTML`文档中嵌入媒体播放器，用于支持文档内的视频播放。你也可以将 `<video>` 标签用于音频内容，但是`audio`元素可能在用户体验上更合适。

以下是一个局域播放的示例，允许`html`元素在视频上方，[Demo查看](https://1927344728.github.io/fed-knowledge/demo/11-video.html)：

```html
<div class="player_box">
    <video
        controls
        controlslist="nodownload nofullscreen noremoteplayback"
        loop="true"
        poster="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/media/美人谷-阿兰.jpg"

        x5-playsinline="true"
        x5-video-player-type="h5-page"
        webkit-playsinline="true"
        playsinline="true"

        currentTime="100"
        muted
    >
        <source src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/media/美人谷.mp4" type="video/mp4">
        <!-- <source src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/media/Vives En Mi-art--Sharlene Taule--art-af1309f88d9fda37e0dc4ad2e2c4c9b8.mp4" type="video/mp4"> -->
        <p>
            Your browser doesn't support HTML5 video. Here is a <a href="myVideo.mp4">link to the video</a> instead.
        </p>
        <track default kind="subtitles" src="./assets/美人谷 - 阿兰.vtt" srclang="cn" label="中文字幕">
        <track kind="subtitles" src="sampleSubtitles_de.vtt" srclang="de">
        <track kind="descriptions" src="sampleDescriptions.vtt" srclang="en">
        <track kind="chapters" src="sampleChapters.vtt" srclang="en">
        <track kind="metadata" src="keyStage3.vtt" srclang="en" label="Key Stage 3">
    </video>
    <div class="player_pop"></div>
</div>
```

` <video>` 标签的内容是针对浏览器不支持此元素时候的降级处理。浏览器并不是都支持相同的视频格式，所以你可以在 `<source> `元素里提供多个视频源，然后浏览器将会使用它所支持的第一个源。

`<track>`标签它允许指定时序文本字幕（或者基于时间的数据），例如自动处理字幕。

其他使用注意事项：

- 如果你没有指定`controls`属性，那么视频不会展示浏览器自带的控件，你也可以用 `JavaScript `和 `HTMLMediaElement API `来创建你自己的控件。
- `HTMLMediaElement `会激活许多不同的事件，以便于让你可以控制视频（和音频）内容。
- 你可以用`CSS `属性 `object-position` 来调整视频在元素内部的位置，它可以控制视频尺寸适应于元素外框的方式。
- 如果想在视频里展示字幕或者标题，你可以在` <track>` 元素和` WebVTT `格式的基础上使用 JavaScript 来实现。



### video的属性

**autoplay**：布尔属性；指定后，视频会马上自动开始播放，不需要手动调用`play()`方法。

> 自动播放受浏览器政策限制，不同浏览器的表现不一样。移动端的app，可以设置参数来控制是否允许自动播放。

**autobuffer**：布尔属性；指定后，视频会自动开始缓存，即使没有设置自动播放。该属性适用于视频被认为可能会播放（比如，用户导航到专门播放视频的页面，而不是那种嵌入视频还有其它内容的页面）。视频会一直缓存到媒体缓存满。

**controls**：加上这个属性，Gecko 会提供用户控制，允许用户控制视频的播放，包括音量，跨帧，暂停/恢复播放。

**controlslist**：

当浏览器显示自己的控件集(例如，当指定了`Controls`属性时)，`Controlslist`属性将帮助浏览器选择在媒体元素上显示的控件。允许接受的值有`nodownload`,`nofullscreen`和`noremoteplayback`

```html
<video controls controlslist="nodownload nofullscreen noremoteplayback" src=""></video>
```

**crossorigin**：该枚举属性指明抓取相关图片是否必须用到`CORS`（跨域资源共享）。 支持`CORS`的资源 可在` <canvas> `元素中被重用，而不会被污染。允许的值如下：

* anonymous
  跨域请求（即，使用 Origin: 的HTTP头）会被执行。但是不发送凭证（即，不发送cookie， X.509 证书或者 HTTP Basic 授权）。如果服务器不提供证书给源站点 (不设置` Access-Control-Allow-Origin: HTTP头`)，图片会被 污染 并且它的使用会受限。
* use-credentials
  跨域请求A `cross-origin request (i.e. with Origin: HTTP header) `会被执行，且凭证会被发送 (即， 发送一个 cookie, 一个证书和HTTP Basic授权会被执行)。如果服务器不提供证书给源站点 (通过`Access-Control-Allow-Credentials: HTTP头`)，图像会被污染且它的使用会受限。
* 不加这个属性时，抓取资源不会走CORS请求(即，不会发送 Origin: HTTP 头)，保证其在`<video>`元素中使用时不会被污染。如果指定非法值，会被当作指定了枚举关键字 `anonymous `一样使用。 

**currentTime**：

读取`CurentTime`返回一个双精度浮点值，指示以秒为单位的媒体的当前播放位置。如果`video`尚未开始播放，则会在开始播放后返回偏移量。通过`CurentTime`将当前播放位置设置为给定时间，会在加载媒体时将媒体查找到该位置（从指定的位置开始播放）。

媒体正在播放的情况下，如果媒体缓冲区的数据已经过期（视频已经播放完），则` user agent`有可能无法正常拿到数据。有些媒体可能有一个不以0秒开始的媒体时间线（不是从头开始播放的），因此应该将`currentTime`的时间设置在其数据失效之前。`getStartDate() `这个方法可以用来确定媒体时间线起始的坐标。

```js
document.querySelector('video').currentTime = 100
```

> 实测，By lizhao，2020.06.07：
>
> 1.直接在`<video>`元素写`currentTime`属性，有兼容问题，有些浏览器可以无效，如：`chrome\安卓微信`。
>
> 2.只有视频开始播放后设置的`currentTime`才有效。
>
> 3.不能`canplay`事件中使用：会陷入死循环。

**disablePictureInPicture**：防止浏览器建议图片中的上下文菜单或在某些情况下自动请求图片中的图片。

**disableRemotePlayback**：一个布尔属性，用于禁用使用有线连接的设备(`HDMI`、`DVI`等)的远程播放功能。无线技术(`Miracast`、`Chromecast`、`DLNA`、`AirPlay`等)。

**duration（只读）**：一个双精度浮点值，它指示媒体的持续时间(总长度)，以秒为单位，在媒体的时间线上。如果元素上没有媒体，或者媒体无效，则返回的值为`NaN`。如果媒体没有已知终点(例如时间未知的实时流、网络广播、来自`WebRTC`的媒体等等)，那么这个值就是`Infinity`。

```js
document.querySelector('video').duration
```

**height**：视频展示区域的高度，单位是`CSS`像素。

**intrinsicsize**：

此属性将覆盖媒体元素的实际固有大小。具体来说，图像将在这些尺寸处进行光栅化，图像上的[naturalWidth / naturalHeight](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-naturalwidth) 将返回在此属性中指定的值。在视频元素上，视频将以此大小进行光栅化，而视频 上的[videoWidth / videoHeight](https://html.spec.whatwg.org/multipage/media.html#dom-video-videowidth)将返回固有大小值。

> 请确保启用`Experimental Web Platform features`标志。chrome中输入`chrome://flags/`，搜索该标志并设置为`enabled`。
>
> 注：chrome中实测无效。By lizhao，2020/05/29。

**loop**：布尔属性，设置循环播放。指定后，会在视频结尾的地方，自动返回视频开始的地方，重新播放。

**muted**：布尔属性，指明了视频里的音频的默认设置。设置后，音频会初始化为静音。默认值是false，意味着视频播放的时候音频也会播放 。

```js
document.querySelector('video').muted = true
```

>  直接在video写muted属性，有兼容问题

**playsinline**：

一个布尔属性，标志视频播放时局域播放，不脱离文档流 。请注意，没有此属性并不意味着视频始终是全屏播放的。

`playsinline `是标准写法

 `webkit-playsinline`在` iOS 10` 之前的写法，它的浏览器厂商前缀在` iOS 10` 中被移除。但是目前 `iOS `微信还不支持去掉前缀的写法。

`x5-playsinline`是`X5`内核的写法（微信、QQ浏览器等腾讯产品的内核）

```html
<video
       x5-playsinline="true"
       webkit-playsinline="true"
       playsinline="true"

       x-webkit-airplay="true"
       x5-video-player-type="h5"
       x5-video-player-fullscreen=""
       x5-video-orientation="portraint"
       :poster=""
       :src=""
       type=""
></video>
<!--在X5内核中让video标签播放不自动全屏，设置x5-playsinline-->
<!--注：x5内核-安卓下不能添加airplay="allow" x5-video-player-fullscreen="true" x-webkit-airplay="allow"（添加了之后playsinline属性就失效了）-->
```

`playsinline `属性比较特别， 需要嵌入网页的APP，比如`wechat`中`UIwebview `的`allowsInlineMediaPlayback = YES`、`webview.allowsInlineMediaPlayback = YES`，才能生效。

换句话说，如果APP不设置，你页面中加了这标签也无效，这也就是为什么安卓手机`WeChat `播放视频总是全屏，因为`APP`不支持`playsinline`，而ISO的`WeChat`却支持。

在` iOS 10 Safari `中，通过` <video playsinline> `可以让视频内联播放。设置了 `playsinline `属性的视频在播放时不会自动全屏，但用户可以点击全屏按钮来手动全屏；没有设置 `playsinline `的视频会在播放时自动全屏。无论是否设置 `playsinline `属性，退出全屏后视频都会继续播放。

注意：如果是想做全屏直播或者全屏H5体验的用户，IOS需要设置删除 `webkit-playsinline` 标签，因为你设置 false 是不支持的 ，安卓则不需要，因为默认全屏。但这时候全屏是有播放控件的，无论你有没有设置control。

**played**：返回 `TimeRanges `对象。`TimeRanges `对象表示用户已经播放或看到的视频范围。

已播范围指的是被播放视频的时间范围。如果用户在视频中跳跃，则会获得多个播放范围。

```js
document.querySelector('video').played.length //已播放的范围个数

document.querySelector('video').played.start(0) //第一段的开始时间
document.querySelector('video').played.end(0) //第一段的结束时间
```

**preload**：

该枚举属性旨在告诉浏览器作者认为达到最佳的用户体验的方式是什么。可能是下列值之一：

* none: 提示作者认为用户不需要查看该视频，服务器也想要最小化访问流量；换句话说就是提示浏览器该视频不需要缓存。
* metadata: 提示尽管作者认为用户不需要查看该视频，不过抓取元数据（比如：长度）还是很合理的。
* auto: 用户需要这个视频优先加载；换句话说就是提示：如果需要的话，可以下载整个视频，即使用户并不一定会用它。
* 空字符串：也就代指 auto 值。
* 假如不设置，默认值就是浏览器定义的了 （即，不同浏览器会选择自己的默认值），即使规范建议设置为 metadata。

> **使用备注：**
> autoplay 属性优先于 preload。假如用户想自动播放视频，那么很明显浏览器需要下载视频。同时设置autoplay 和 preload属性在规范里是允许的。
> 规范没有强制浏览器去遵循该属性的值；这仅仅只是个提示。

**poster**：一个海报帧的URL，用于在用户播放或者跳帧之前展示。如果属性未指定，那么在第一帧可用之前什么都不会展示；之后第一帧就像海报帧一样展示。

> poster，在不同环境下有兼容问题

**readyState**：返回音频/视频的当前就绪状态。就绪状态指示音频/视频是否已准备好播放。表示音频/视频元素的就绪状态：

| HAVE_NOTHING      | 0    | 没有关于音频/视频是否就绪的信息                              |
| ----------------- | ---- | ------------------------------------------------------------ |
| HAVE_METADATA     | 1    | 音频/视频已初始化                                            |
| HAVE_CURRENT_DATA | 2    | 数据已经可以播放(当前位置已经加载) 但没有数据能播放下一帧的内容 |
| HAVE_FUTURE_DATA  | 3    | 当前及至少下一帧的数据是可用的(换句话来说至少有两帧的数据)   |
| HAVE_ENOUGH_DATA  | 4    | 可用数据足以开始播放-如果网速得到保障 那么视频可以一直播放到底 |

**seeking**：返回用户目前是否在音频/视频中寻址。寻址中（Seeking）指的是用户在音频/视频中移动/跳跃到新的位置。

**src**：要嵌到页面的视频的URL。可选；你也可以使用`video`块内的`<source>`元素来指定需要嵌到页面的视频。

**volume**： 设置或返回音频/视频的音量

**width**：视频显示区域的宽度，单位是`CSS`像素。

以下为非标准属性：

**x-webkit-airplay**：`IOS webkit`属性，支持`Airplay`的设备（如：音箱、Apple TV)播放。这个属性应该是使此视频支持`ios`的`AirPlay`功能。通过`AirPlay`可以把当前的视频投放到支持此技术的其他设备上。

**x5-video-player-type**：

功能：启用同层H5播放器。

可选值：`h5-page`

特点：在**视频全屏**的时候（即不加`x5-playsinline="true"`属性），页面中元素可以呈现在视频层上，也是`WeChat`安卓版特有的属性

**x5-video-orientation**：

功能：声明播放器支持的方向

可选值： `landscape `横屏, `portraint`竖屏

默认值：`portraint`

```js
<video ... x5-video-player-type=”h5” x5-video-orientation="landscape"/> //横屏
<video ... x5-video-player-type="h5" x5-video-orientation="portrait"/> //竖屏
<video x5-video-player-type="h5" x5-video-orientation="landscape|portrait"/> //跟随手机自动旋转
```

> 注： 此属性只在声明了`x5-video-player-type=”h5”`情况下生效

**x5-video-player-fullscreen**：

功能：视频播放时将会进入到全屏模式。

可选值：`true`支持全屏播放，`false`不支持全屏播放

默认值：`false`

如果不申明此属性，页面得到视口区域为原始视口大小(视频未播放前)，比如在微信里，会有一个常驻的标题栏，如果不声明此属性，这个标题栏高度不会给页面，播放时会平均分为两块（上下黑块）

> 注： 声明此属性，需要页面自己重新适配新的视口大小变化。可以通过监听resize 事件来实现



### video的方法

**addTextTrack**：向音频/视频添加新的文本轨道。

**注：所有主流浏览器都不支持 `addTextTrack() `方法。**

```js
document.querySelector('video').addTextTrack(kind,label,language)
```

**canPlayType**：检测浏览器是否能播放指定的音频/视频类型，返回`String`。如下：

- probably：浏览器最可能支持该音频/视频类型
- maybe：浏览器也许支持该音频/视频类型
- "" ： （空字符串）浏览器不支持该音频/视频类型

```js
document.querySelector('video').canPlayType('video/mp4')
```

**load**：重新加载音频/视频元素

```js
document.querySelector('video').load()
```

**play**：开始播放音频/视频

```js
document.querySelector('video').play()
```

**pause**：暂停当前播放的音频/视频

```js
document.querySelector('video').pause()
```



### video的事件

| 事件名称            | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| `abort`             | 在播放被终止时触发。例如：当播放中的视频重新开始播放。       |
| `canplay`           | 在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发。   |
| `canplaythrough`    | 表明媒体可以在保持当前的下载速度的情况下不被中断地播放完毕。<br />**注意：手动设置`currentTime`会使得`firefox`触发一次`canplaythrough`事件，其他浏览器或许不会如此。** |
| `durationchange`    | 表明媒体的长度发生了改变。例如：在媒体已被加载足够的长度从而得知总长度时会触发这个事件。 |
| `emptied`           | 媒体被清空（初始化）时触发。                                 |
| `ended`             | 播放结束时触发。                                             |
| `error`             | 在发生错误时触发。元素的error属性会包含更多信息。参阅 [HTMLMediaElement.error](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error) 获得详细信息。 |
| `loadeddata`        | 媒体的第一帧已经加载完毕。                                   |
| `loadedmetadata`    | 媒体的元数据已经加载完毕，现在所有的属性包含了它们应有的有效信息。 |
| `loadstart`         | 在媒体开始加载时触发。                                       |
| `mozaudioavailable` | 当音频数据缓存并交给音频层处理时                             |
| `pause`             | 播放暂停时触发。                                             |
| `play`              | 在媒体回放被暂停后再次开始时触发。即：在一次暂停事件后恢复媒体回放。 |
| `playing`           | 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。 |
| `progress`          | 告知媒体相关部分的下载进度时周期性地触发。有关媒体当前已下载总计的信息可以在元素的buffered属性中获取到。 |
| `ratechange`        | 在回放速率变化时触发。                                       |
| `seeked`            | 在跳跃操作完成时触发。                                       |
| `seeking`           | 在跳跃操作开始时触发。                                       |
| `stalled`           | 在尝试获取媒体数据，但数据不可用时触发。                     |
| `suspend`           | 在媒体资源加载终止时触发，这可能是因为下载已完成或因为其他原因暂停。 |
| `timeupdate`        | 元素的`currentTime`属性表示的时间已经改变。                  |
| `volumechange`      | 在音频音量改变时触发（既可以是`volume`属性改变，也可以是`muted`属性改变）。 |
| `waiting`           | 在一个待执行的操作（如回放）因等待另一个操作（如跳跃或下载）被延迟时触发。 |



### source

HTML` <source> `元素为` <picture>、<audio>、<video> `元素指定多个媒体资源。

这是一个空元素。它通常用于以不同浏览器支持的多种格式提供相同的媒体内容。



### track

HTML` <track> `元素 被当作媒体元素—`<audio> `和` <video>`的子元素来使用。它允许指定时序文本字幕（或者基于时间的数据），例如自动处理字幕。字幕格式有 `WebVTT `格式（`.vtt`格式文件）— Web 视频文本字幕格式，以及指时序文本标记语言（TTML）格式。

**default属性**：该属性定义了该track应该启用，除非用户首选项指定了更合适一个track。每个媒体元素里面只有一个 `track` 元素可以有这个属性。

**kind属性**：

定义了 text track 应该如何使用。如果省略了该属性，默认的 kind 值就是 `subtitles`。

- **subtitles**。字幕给观影者看不懂的内容提供了翻译。比如英文电影里非英文的对话框或者文字。字幕可能包含额外的内容，通常有附加的背景信息。比如在电影星球大战开头的文字，或者某个场景的日期，时间，还有地点。
- **captions。**隐藏式字幕提供了音频的转录甚至是翻译。可能包含重要的非言语的信息，比如音乐提示或者音效。可以指定提示音的源文件 (e.g. music, text, character)。适用于耳聋的用户或者当调成静音的时候。
- **descriptions。**视频内容的文本描述。适用于失明用户或者当视频不可见的场景。
- **chapters。**章节标题。用于用户浏览媒体资源的时候。
- **metadata。**脚本使用的track。 对用户不可见。

**label属性**：当列出可用的text tracks时，给浏览器使用的text track的标题，这种标题是用户可读的。

**src属性**：track的地址。必须是合法的URL。该属性必须定义。

**srclang属性**：

track文本数据的语言。它必须是合法的 [BCP 47](http://people.w3.org/rishida/utils/subtags/) 语言标签。如果 `kind` 属性被设为 `subtitles,` 那么`srclang` 必须定义。如

- `zh `中文
- `zh-cmn` 中文普通话

- `zh-Hans` （简体字）
- `zh-yue`（广东话）
- `zh-Hant-HK` （香港使用繁体中文）
- `zh-cmn-Hans` 中文普通话简体
- `en` （英语）
- `en-GB` （英式英语）

**一个media 元素的任意两个 track 子元素不能有相同的 kind, srclang, 和 label属性。**

注意：`<track> `元素是 HTML5 中的新元素。[需注意其兼容性](http://www.miaoxingyun.com/html/track.html)



### WebVTT

[Web 视频文本轨格式（WebVTT）](https://developer.mozilla.org/zh-CN/docs/Web/API/WebVTT_API)

Web视频文本跟踪格式 (WebVTT) 是一种使用`<track>`元素显示定时文本轨道（如字幕或标题）的格式。 WebVTT文件的主要用途是将文本叠加添加到`<video>`。 WebVTT是一种基于文本的格式，必须使用UTF-8进行编码。 在可以使用空格的地方，您也可以使用制表符。 还有一个小的API可用于表示和管理这些轨道以及在正确的时间执行文本回放所需的数据。

WebVTT 文件的 MIME 类型为 `text/vtt`。

一个 WebVTT 文件（`.vtt`） 包含任意条带时间的提示性内容（cue）（可理解为一条或多条字幕），可以是单行或多行，如下所示：

```text
WEBVTT 美人谷

00:02.000 --> 00:05.000
美人谷 - 阿兰

00:07.950 --> 00:15.760
词：毛慧
曲：阿兰/毛慧
编曲：叶月/王晨
制作人：毛慧
录音：张生磊（记忆时刻录音棚）

00:38.130 --> 00:44.180
越过山河的神秘
幕自然的洗礼
看见山川出云泽被着大地

...
```

可以修改字幕样式：

```css
/*写在css文件中*/
video::cue {
  background-image: linear-gradient(to bottom, dimgray, lightgray);
  color: papayawhip;
}

video::cue(b) { /*表示.vtt中，<b>标签内文本的样式*/
  color: peachpuff;
}
```

```text
/*写在.vtt文件中*/
...

STYLE
::cue {
  background-image: linear-gradient(to bottom, dimgray, lightgray);
  color: papayawhip;
}
00:38.130 --> 00:44.180
越过山河的神秘
幕自然的洗礼
看见山川出云泽被着大地

...
```



### 自动播放

早期的安卓和IOS都需要用户手势才能自动播放，后期逐渐放宽的自动播放的策略，逐渐开始支持自动播放，当然在不同的机型和对应的浏览器上，展示略有差异，这个没有完全清楚所有机型展示情况。

检测当前的浏览器是否能支持自动播放：

```js
let promise = document.querySelector('video').play();
if (promise !== undefined) {
  promise.then(() => {
    // video can play
  }).catch(err => {
    // video cannot play
  })
}
```

移动端应用中内嵌的浏览器（如：`wkWebView`），有参数控制是否允许自动播放。因此，不同的应用下，展示情况略有差异。比如：钉钉可以支持，但是微信就禁止。

微信提供了内置的事件来支持自动播放：

```js
//实测：iPhone 11 Pro的微信可以自动播放；小米10的微信无法自动播放。By lizhao，2020/06/07
//必须加载JSAPI的JS文件。如：http://res.wx.qq.com/open/js/jweixin-1.2.0.js
document.addEventListener("WeixinJSBridgeReady", function (){ 
    document.querySelector('video').play();
}, false)
```

#### Chrome自动播放

> 实测：`By lizhao，2020/05/30`
>
> 使用`muted`属性后，可以自动播放。

#### Android自动播放

> 小米10实测：By lizhao，2020/05/30
>
> UC浏览器、微信不支持自动播放（无论是否设置muted属性），`video `设置 `autoplay `属性和`JS`调用`play()`方法都一样无效。QQ浏览器支持自动播放（无论是否设置muted属性）

#### IOS自动播放政策

**IOS  8自动播放政策**

允许使用 `preload="metadata" `来预加载视频 `Meta `信息，但**`<video> `无法自动播放，也无法内联播放，只能在【用户主动操作】后才能播放，且播放时必须全屏**。

至于「用户主动操作」具体指的是哪些行为，苹果官方有详细的说明：

* 点击视频播放按钮；

* 触发 `touchend、click、doubleclick 、 keydown` 事件，且在事件处理函数中直接调用 `video.play() `方法。

  显然，`button.addEventListener('click', () => { video.play(); }) `满足要求；而 `video.addEventListener('canplaythrough', () => { video.play(); }) `不满足要求；

* **值得注意的是：**上面讨论的是 `IOS `自带 `Safari `的视频播放政策。对于` IOS APP` 而言，开发者在给 `webview `设置 `mediaPlaybackRequiresUserAction `和 `allowsInlineMediaPlayback `属性之后，页面中的 `<video> `标签就可以通过 `autoplay `和` webkit-playsinline` 属性来启用自动播放和内联播放功能。

**IOS 10自动播放政策**

随着视频的进一步普及，在` IOS` 10 中，苹果终于进一步放松了 `Safari `视频播放政策。`IOS 10 Safari `允许自动播放以下两种视频：

- 无音轨视频；
- 无声音视频（设置了 `muted` 属性）；

对于这两种类型的视频，可以通过` <video autoplay> `或` video.play() `两种方式来自动播放，无需用户主动操作。但是，如果它们在播放时变得有声音（获取了音轨，或者 muted 属性被取消），Safari 会暂停播放。

通过` <video autoplay>` 自动播放的视频元素还需要满足一个条件：在可视区域内。同样，如果它们在播放时因为页面滚动等原因导致不可见，`Safari `也会暂停播放。



### 全屏/局域播放

全屏和局域播放的区别主要在于：

* 全屏播放：一般是调用系统的`native`播放器来打开全屏观看，覆盖在`webview`之上，即，播放界面位于所有页面元素的上方，并且控制条无法隐藏。**`Android`和`IOS`，在微信环境下打开，默认都是全屏播放。**
* 局域播放：视频是在文档内播放的，即，**可以在视频上方显示html元素**。`video`不加`controls`属性，可以隐藏控制条（实测：微信内置浏览器、QQ浏览器、UC浏览器。By lizhao，2020/05/30）。

**IOS全屏处理**：

* 全屏播放：`IOS`默认打开的是全屏模式。

* 局域播放：`video`设置 `webkit-playsinline='true'`属性。

**Android全屏处理**：

* 全屏播放：微信默认全屏播放，QQ、UC浏览器默认局域播放。

  > 小米10实测：By lizhao，2020/05/30
  >
  > 微信、QQ浏览器，横屏的全屏状态下，点击【旋转】，回到竖屏状态，页面样式有问题；UC浏览器旋转正常。

* 局域播放：`video`设置`x5-playsinline="true"`。

* 同层播放：`video`设置`x5-video-player-type：h5-page`。

* 同层全屏播放：`video`不设置`x5-playsinline`属性，设置`x5-video-player-type：h5-page`。 **同层全屏形态下的控件前端可以自定义，native形态不支持自定义。native形态播放器是处于顶层的独立view会遮盖视频区域的其它元素。**

**伪全屏**：采用局域播放状态，即`video`标签设置`playsinline`（注意兼容问题，具体可查看上文`playsinline`属性），通过设置样式和布局将视频内容撑满屏幕。**应用场景：**视频播放区域占满手机屏幕，视频上方需要显示弹幕、评论区等。

**CSS实现控制条隐藏**：在`video`外层套一个`div`，`height`设置固定值，并且设置`overflow:hidden`，`video`的高度设置为大于外层的高度，就能把控制条顶到视窗外。**注意：**这个时候对于`video`可能会造成放大，视频要留有一定的安全区，防止遮挡主体内容。



### video播放的控制

`video `元素有提供多个行为事件供开发者控制视频播放，兼容性比较好的有 `onended 、 ontimeupdate、onplay、onplaying`等，有些事件在不同浏览器不同设备上的的表现情况并不一致，不同的系统，设备，浏览器显示的特性还是很不一样的，还是看业务场景需要兼容到什么样，尽量不要大量处理这些事件，不然用户去浏览的时候，兼容问题较多。

**进入全屏的事件**：

```js
//腾讯浏览器：进入/退出全屏事件（支持版本: TBS中从>=036900开始支持，QB中是>=7.2开始支持）：
video.addEventListener("x5videoenterfullscreen", () => {
  console.log("进入全屏通知");
})
video.addEventListener("x5videoexitfullscreen", () => {
  console.log("退出全屏通知");
})
```

```js
//IOS 微信：进入/退出全屏的事件：
video.addEventListener("webkitbeginfullscreen", () => {
  console.log("进入全屏通知");
})

video.addEventListener("webkitendfullscreen", () => {
  console.log("退出全屏通知");
})
```

```js
// 监听暂停事件
video.addEventListener('pause', () => {
  console.log('暂停了')
})

// 监听停止事件
video.addEventListener('ended', () => {
	console.log('停止了')
})
```

**事件在不同环境的表现**：

| vent           | pc侧                                                         | IOS  | Android                                                      |
| :------------- | ------------------------------------------------------------ | :--- | :----------------------------------------------------------- |
| loadstart      | 文件加载，video初始化，未加载任何数据                        | 一致 | 一致                                                         |
| stalled        | 视频没有播放，没有取回任何媒介数据：一般是由于网络状况不佳，导致视频下载中断 | 一致 | 可能在play()事件触发前                                       |
| play           | 触发后，状态是开始播放，但视频并未真正开始播放               | 一致 | 一致                                                         |
| waiting        | play()事件触发后，等待数据                                   | 一致 | 一致                                                         |
| durationchange | 获取到视频长度，duration属性能获得真实视频长度               | 一致 | 可能在play()事件触发前，可能没有获取到真实的视频长度：可能触发多次， 只有最后一次才能获取到真实的duration，之前的值有可能为0或者1 |
| loadedmetadata | play()事件触发后，获取到元数据                               | 一致 | play()事件触发前，没有获取到真实的元数据                     |
| loadeddata     | play()事件触发后，获取到媒介数据                             | 一致 | play()事件触发前，没有获取到真实的媒介数据                   |
| canplay        | 可以播放，但视频可能还未真正开始播放，并且中途可能因为加载而暂停 | 一致 | 一致                                                         |
| playing        | 视频开始播放                                                 | 一致 | 可能还未真正开始播放，并且可能还未获取到视频长度             |
| canplaythrough | 视频开始播放后，可以流畅播放                                 | 一致 | 数据可能还没有开始加载，视频可能还未开始播放， 视频仍然会卡住 |
| timeupdate     | 视频播放后，更新播放进度， 会有明确的进度变化，可以获取到currentTime | 一致 | 第一次可能会有误差，如果 timeupdate事件的currentTime发生变化，代表视频一定开始播放 |
| progress       | 视频播放后，持续下载， 可以获取到当前的缓存buffer，并且全部下载完毕后不再触发 | 一致 | 第一次可能会有误差， 全部下载完毕后依然继续触发              |
| suspend        | 缓冲中，视频可能卡顿也可能在流畅播放中，全部缓存完毕后不再触发。视频还未真实播放前，pause()事件会触发suspend | 一致 | 一致                                                         |
| pause          | 可能是响应pause()事件暂停，或者是切出页面自动暂停            | 一致 | 一致                                                         |
| seeking        | 拖动进度条时，寻找播放位置。或者播放完毕，寻找下一个视频     | 一致 | 一致                                                         |
| seeked         | 拖动进度条时，定位到播放位置。或者开始播放下一个视频，或者是从头开始循环播放 | 一致 | 一致                                                         |
| error          | 错误，无法定位错误原因，无法通过paly()事件继续播放           | 一致 | 一致                                                         |



### 关于X5内核的一些问题

**微信内置浏览器的内核**：

**Android：**微信6.1版本以上都是使用的QQ浏览器的X5内核。5.4-6.1之间的版本，若用户安装了QQ浏览器就是使用的X5内核，若用户未安装浏览器，使用的是系统内核。

**IOS：**采用`WKWebview`或`UIWebview`内核，从`IOS8`开始支持`WKWebview`。

**最简单的检测X5内核方法：**打开一个网页，然后下拉。页面顶部有【QQ浏览器X5内核提供技术支持】，表明用的是X5内核；没有表示非X5内核。

**关闭/禁用/安装X5内核**：

1. 微信端打开 http://debugtbs.qq.com，进入X5内核的调试页面。
2. 若未安装X5内核，此链接打不开。已安装，可点击左上方【查看版本号】，如果内核版本信息显示为0的话，就表示X5内核已经被关闭了。
3. 点击【安装线上内核】，在下载或者安装过程中强行关闭微信，就可以禁用X5内核了。
4. 安装X5内核：可以打开https://debugmm.qq.com/?forcex5=true安装
5. 关闭X5内核不会导致微信出问题，甚至会让微信整体更加流畅，因为微信某些原生框架也是需要借助`Webview`来实现的。

**X5内核的视频播放形态**：

* **全屏播放**

  X5内核视频默认播放形态，用户点击视频区域后开始进入全屏播放，视频区域内的所有事件行为会由X5内核视频组件全权托管。视频层级最高，会遮挡所在区域所有html元素。（仅使用于安卓微信、手机QQ等非安卓QQ浏览器的X5内核场景）

* **页面内播放**

  X5内核视频在用户点击后默认会进入全屏播放，前端可以设置`video`的`x5-playsinline`属性来将视频限定于网页内部播放

* **同层页面内播放**

  同层页面内播放是标准的视频播放形态，在`video`标签中添加`x5-video-player-type：h5-page`属性来控制网页内部同层播放，可以在视频上方显示`html`元素。

**X5内核的一些特性**：

* X5内核竖屏播放视频时，横置手机会自动切到横屏全屏播放，但再竖屏时，视频无法切回来。这个是产品策略，需要用户点击全屏上的返回按钮后返回到竖屏。

* **X5内核不支持多个视频同时播放、不技持视频与音频同时播放**
* 同层全屏形态时不会盖住网页上的`html`元素；`native`形态播放器是处于顶层的独立`view`会遮盖视频区域的其它元素。

* x5内核video的`currentTime`，只有视频开始播放后设置才有效
* X5内核的视频播放不支持字幕功能



### 音视频同步播放

**需求背景：**同一视频面向不同客户时，根据具体的客户信息，将音轨中的一段内容替换（比如：音轨中的【先生，您好】，替换成具体姓氏【李先生，你好】）。

**实现思路：**

* **思路一：**服务端根据不同的客户信息，直接处理视频中的音轨。**（不可行）**

  原因：**处理速度太慢。**以40M的视频为例，视轨、音轨分离 -> 修改音轨 -> 合成视轨、音轨 -> 上传合成后的视频文件，整个流程跑完，大概3分钟。

* **思路二**：将视频拆分成一个没有声音的视频文件和一个音频文件，服务端只对音频文件处理；前端同时播放一个视频和一个音频，并保持两者同步。**（可行，需要解决的问题如下）**

#### 问题一：安卓微信中不支持同时播放一个视频和一个音频

这是X5内核的限制。目前大多安卓机的微信浏览器采用的是X5内核（可以禁用微信X5内核，但，很显然，我们不可能要求客户这么做。。。）。

**解决方法调研：**

1. 视频折分成多个小视频，前端串行播放**（体验不好）**

   **实现思路：**视频折分成多个小视频，服务端只需要处理其中一个小视频，处理速度可以控制在合理范围。

   **问题：**多段视频串行播放，在播放下一个视频时，会有停顿（停在前一视频的海报画面，等待下一视频加载）；播放进度控制问题。

2. `canvas`播放视频**（不可行）**

   **实现思路：**用`canvas`播放视频代替`video`元素。

   **问题**：`canvas`播放视频是通过页面重绘事件或者定时器，不停的抓取`video`每帧的画面，即，它是依赖`video`元素的。

   **适用场景：**用于对`video`的画面进行一此处理，如同步模糊背景、视频截图、灰色视频。

3. `Web audio API`播放音频**（可行，下一节将详细介绍）**

   **实现思路：**用`Web audio API`代替`audio`元素。

4. 其他标签代替`video、audio` **（不可行）**

   **实现思路：**`embed`或`object`代替`video`、`audio`元素。`embed`和`object`都是用来嵌入多种类型的外部内容的通用嵌入工具，其中包括像`Java`小程序和`Flash`，`PDF`这样的插件技术，甚至像视频，`SVG`和图像的内容！

   **问题：**`embed`、`object`播放视频或音频，类似在页面中嵌入一个包含`video`或`audio`元素的`iframe`。

   * 无法避开不支持音频、视频同时播放的问题

   * 音频控制不方便
   * 播放会出现控制界面。`android`可以小窗口播放，`IOS`会占满全屏。
   * 有些属性不可用。比如：`embed`的`starttime`

5. 小程序 **（暂未调研）**

   **实现思路：**取决于小程序是否放开不能同时播放视频和音视的限制。



#### 问题二：视频和音视的同步播放

主要在于三点：

##### 一：视频和音视同时开始播放

视频和音频的加载所需时间不一样，需要等两者都可以播放了，才能真正开始播放。

**实现**：在`canplay`事件标识视频、音频是否可播，再通过定时器轮询，监听两者都可播放时，再触发播放。

**注意**：部分机型，需要【用户主动操作】才能播放视频，直接在定时器中调用`play()`方法可能无效。解决方法是：在点击时，先触发一次播放，再在定时器中加暂停或播放的判断。

##### 二：拖动进度条后，保持视频和音视同步

拖动进度条后，改变`currentTime`的值，也会引起视频和音频的加载所需时间不一样的问题，而此时无法通过`canplay`事件解决，**因为`IOS`在`currentTime`改变后不会触发`canplay`事件。**

这时，我们可以用`seeked`事件监听视频、音频是否加载完成。

`canplay`、`seeked`事件的兼容情况（实测：一台`IOS`机、一台`android`机）：

| 事件                       | IOS app | IOS WeChat | android app | android wechat |
| -------------------------- | ------- | ---------- | ----------- | -------------- |
| canplay（开始播放）        | 触发    | 触发       | 触发        | 触发           |
| canplay（改currentTime后） | 不触发  | 不触发     | 触发        | 触发           |
| seeked                     | 触发    | 触发       | 触发        | 触发           |

##### 三：视频和音视不同步，纠正时差

正常来说，第一次播放、拖动进度条后的播放都是两者加载完成后同时播放的，视、音频应该不会出现时差。然而，现实是残酷的，部分机型还是出现了时差，有时还可能偏差几十秒**（具体原因未知）**。

这时，我们需要一个定时器实时监听两者的时差。当两者时差超过某个阈值时（如：0.5s），纠正音频的`currentTime`值。



#### 问题三：无音轨视频文件的问题

**部分IOS手机播放无音轨视频，需要等待很长时间才会开始播放**（android、pc chrome无此问题）。

以40M的视频为例：无音轨的视频，必需等视频加载30多M（约20~30秒，跟网速有关）后，才开始播放；而同一视频，保留音轨（不需要声音，可以将音量调为0），加载1M~2M就可以开始播放。**原因未知**



### Web Audio API

安卓微信（采用X5内核）不支持同时播放一个视频和一个音频，即，`video`、`audio`不能同时播放。调研发现，`web audio api`可以控制音频，可以替代`audio`，且它与`video`可以同时播放。

#### 简单示例

```js
const URL = 'path/music.mp3'
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

//加载音频文件
const getBuffer = function (url) {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            audioContext.decodeAudioData(request.response, buffer => buffer ? resolve(buffer) : reject('decoding error'));
        };
        request.onerror = error => reject(error);
        request.send();
    });
};
const playAudio = function (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
};
const buffer = await getBuffer(URL);
buffer && playAudio(buffer)
```

#### 一些问题：

* currentTime：不是当前音频播放的时间节点，而是`当前时间 - 音频上下文创建时间点`的时长。
* 如何修改音量、设置静音？？（按标准文档中的方法试了，有问题）
* 有些浏览器限制，页面最多只能同时存在6个音频上下文，即最多可以`new AudioContext()`6次。可用音频上下文的`close()`方法，及时关闭无用的音频上下文。  https://github.com/otalk/hark/issues/38

* 部分机型（如：乐视 android 6.0），app端无法正常播放（微信端正常）。原因是：`decodeAudioData`方法无法解码音频数据。
* 部分机型（如：vivo X7 android 5.1.1），不支持`Howler`插件。

> `Howler`是一款`web audio api`的封装插件。



### 兼容问题

#### 视频、音频的播放\暂停行为

切出应用 -> 再切换回来、锁屏 -> 解屏，`video`、`audio`、`web audio api`的播放/暂停行为不一致，体现在不同系统（`IOS`、`Android`）、不同应用（微信、保险师）中，如：

* 切出微信时，`video`会自动停止播放，而`audio`仍在播放。当然，并不是所有机型都如此，`Android`中腾讯`X5`浏览器处理的就比较完善，在切出后台时，`video`、`audio`会停止播放并且切回页面后自动续播。
* 切换出应用，部分机型中`web audio api`不会停止播放，**即使在`visibilitychange`事件，调用`stop`方法也无法停止。**
* 切换回应用，部分机型（如：华为 P30 android 9）中，`video`自动续播，`web audio api`不会。

**解决方法：**

对于切出微信，`audio`不停止播放的问题，可以在`visibilitychange`事件中，调用`pause`方法来暂停。

浏览器标签页被隐藏或显示的时候会触发 `visibilitychange `事件，可以通过`Document.visibilityState` 只读属性来获取当前标签页在浏览器中的激活状态：

```js
document.addEventListener("visibilitychange", e => {
    //用户离开了当前页面
    if (document.visibilityState === 'hidden') {
        video.pause()
    }
    // 用户打开或回到页面
    if (document.visibilityState === 'visible') {}

    //或者
    if (e.target.hidden) {}
})
```

另外，对于切换回应用，`video`、`audio`、`web audio api`的播放/暂停行为不一致，可以考虑在`visibilitychange`事件中，`document.visibilityState === 'visible'`时，刷新页面或更新音、视频模块。



#### 其他属性、事件的兼容问题

##### canplay、canplaythrought事件

* `IOS`在加载时不会触发这两个方法，即使`preload="auto"`也没用，需要播放后才会触发。`readyState`也是播放后，才能取到值的。而`Android`、`PC `端`Chrome`是会在加载阶段就触发这两个事件。

* 修改`video `的`currentTime`值，`android`会触发`canplay`事件，但`IOS`不会。

##### loadedmetadata事件

安卓微信（华为 meta 8）：取回的`duration\videoWidth\videoHeight`值为0。

**解决方法：**在`timeupdate`g事件中获取`duration\videoWidth\videoHeight`值

##### muted属性

部分安卓机（如：华为 meta 8）的微信中：`video`标签中写了`muted`属性后，通示`Js`切换`muted`的值，无效。

**解决方法：**`video`标签不设置`muted`属性，在页面初始化时，用`Js`对`muted`赋值。

##### volume属性

`IOS`中无法通过`volume`属性修改视频音量，直接写在`video`标签或者`js`修改都不行。



##### poster属性

在不同设备上表现不同，浏览器没问题，但是微信浏览器和`IOS`可能会显示空白。

**解决方案一** ：自定义一个`div`，将封面放在`div`中，然后`div`盖在`video`的上面。

**解决方案二**：通过`canvas`截取视频第一帧作为默认显示的图片。

```js
function cut () {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    let img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");

    Dom.appendChild(img);
};
video.addEventListener('loadeddata',cut)
```



#### 安卓手机的一些问题：

##### 视频播放结束后，可能会有广告弹出

**解决方法**：在视频播放完成事件中添加，先播放视频再暂停视频即可

```js
let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
let video = document.getElementById('video');
video.addEventListener('ended', () => {
  if (!isiOS) {
      video.play();
      setTimeout(() => {
          video.pause();
      }, 100)
  }
}
```

##### `Android`微信端（如：小米 10），局域播放状态下，有【全屏】按钮

这个是`X5`做了`video`劫持的结果，**目前解决方法**（网上搜索答案）：

* 成为腾讯的合作伙伴
* 将视频的 `width `撑大，如：` width: 120%`；然后再用 `object-position` 将画面通过计算居中显示，两边裁剪



### 参考链接

[MDN video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)

[视频H5 video标签最佳实践](https://segmentfault.com/a/1190000009395289)

[iOS 10 Safari 视频播放新政策](https://imququ.com/post/new-video-policies-for-ios10.html)

[video标签在不同平台上的事件表现差异分析](https://imweb.io/topic/560a6015c2317a8c3e086207)

[video在安卓与ios实际应用中遇到的问题及解决](https://segmentfault.com/a/1190000019685244)

[腾讯-H5同层播放器接入规范](https://x5.tencent.com/tbs/guide/video.html)

[腾讯-X5内核视频之问答汇总](https://docs.qq.com/doc/DTUxGdWZic0RLR29B)