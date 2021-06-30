# Charles安装及使用

Charles 是macOS 上的最常用的抓包工具。

**抓包（packet capture）**就是将网络传输发送与接收的数据包进行截获、重发、编辑、转存等操作，也用来检查网络安全。

**Charles 通过将自己设置成系统的网络访问代理服务器**，使得所有的网络访问请求都通过它来完成，从而实现了网络封包的截取和分析。

![image-20200822214531424](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822214531424.png)



### Charles 主要的功能

- 截取 Http 和 Https 网络封包。
- 支持重发网络请求，方便后端调试。
- 支持修改网络请求参数。
- 支持网络请求的截获并动态修改。
- 支持模拟慢速网络，主要是模仿手机上的2G/3G/4G的访问流程。

- 支持本地映射和远程映射。比如你可以把线上资源映射到本地某个文件夹下，这样可以方面的处理一些特殊情况下的 bug 和线上调试（网络的css，js等资源用的是本地代码，这些你可以本地随便修改，数据之类的都是线上的环境，方面在线调试）；
- 可以抓手机端访问的资源（如果是配置HOST的环境，手机可以借用 host 配置进入测试环境）
- 支持SSL代理。可以截取分析SSL的请求。
- 支持端口映射。
- 支持反向代理。
- 支持SOCKS



### Charles的安装 

* 安装 JDK。Charles由Java开发，需要先安装好 JDK。??

  查看是否安装：命令提示符中，输入`java -version`

  查看安装路径：命令提示符中，输入 `java -verbose`

* 安装Charles：[下载安装包](https://www.charlesproxy.com/download/latest-release/) -> 安装。

* 破解：Charles 是付费软件，网上也有破解版下载。也可以用网上热心网友提供的信息完成注册：`Help -> registered  `

  ```shell
  Registered Name: https://zhile.io
  License Key: 48891cf209c6d32bf4
  ```



### 设置系统代理

Charles 是通过将自己设置成代理服务器来完成封包截取的，所以使用 Charles 的第一步是将其设置成系统的代理服务器。启动软件，设置步骤如下：

* window：`proxy -> WindowsProxy `
* mac：` proxy -> macOS Proxy` 

**代理服务器设置：**

* `proxy -> Proxy Settings `，设置端口等参数，端口一般默认 `8888`。

* `proxy -> Enable transparent HTTP proxying`，允许代理 `HTTP` 请求。

* `proxy -> SSL Proxying Settings `，设置允许抓取 `https` 请求。 勾选 `Enable SSL Proxying`，添加一条 `Location`规则：

  ![image-20200822223459747](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822223459747.png)

  

此后，就可以看见源源不绝的网络请求出现在Charles的界面中。

**需要注意的是：**Chrome 和 Firefox 浏览器默认并不使用系统的代理服务器设置，而 Charles 是通过将自己设置成系统的代理服务器来完成封包截取的，所以在默认情况下无法截取 Chrome 和 Firefox 浏览器的网络通讯内容。如果你需要截取的话，在 Chrome 中设置成使用系统的代理服务器设置即可，或者直接将代理服务器设置成 127.0.0.1:8888 也可达到相同效果。

* Window（10）：`启动chrome -> 右上角竖排的三个。。。 -> 设置 -> 系统 -> 打开您计算机的代理设置 `，或者 `windows开始 -> 设置 -> 网络和internet -> 代理`。

  <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823004801294.png" alt="image-20200823004801294" style="zoom: 50%;" />

* Mac：`启动chrome -> 右上角竖排的三个。。。 -> 设置 -> 系统 -> 打开您计算机的代理设置 ` 或者 `系统偏好设置 -> 网络偏好设置 -> 高级 -> 代理`。将`网页代理(HTTP)` 和 `安全网页代理(HTTPS)` 的网页代理服务器的IP和端口设置与Charles 一致，如：`127.0.0.1` 、`8888`。

  <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_04.jpg" alt="charles_04" style="zoom: 50%;" />



### 设置移动端代理

首先，手机和电脑要使用同一wifi，然后再配置移动端设备的代理服务器信息。

* 以 iPhone 为例：`设置 -> 无线局域网 -> 当前连接的 wifi 名 -> 右边的详情键`，将最底部的【代理】一项，切换成【手动】，然后填上 Charles 运行所在的电脑的 IP 和 端口号：

  * 主机名：查看`help -> Local IP Addresses`

  * 端口：查看`Proxy -> Proxy Settings`

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_18.jpg?imageMogr2/thumbnail/!50p" alt="charles_18.jpg" style="zoom:50%;" />

- 安装证书。具体可查看下文【移动端证书安装】

* 打开任意需要网络通讯的程序，可以看到 Charles 弹出请求连接的确认菜单。点击 “Allow” 即可完成设置。



### 系统证书安装

安装证书：`help -> SSL Proxying ->  Install Charles Root Certificate`。

即使是安装完证书之后，Charles 默认也并不截取 Https 网络通讯的信息。如果你想对截取某个网站上的所有 Https 网络请求，可以在该请求上右击，选择 SSL proxy。

设置了 `SSL proxy`，Chrome 浏览器访问 https 地址，提示隐私设置错误，出现“您的连接不是私密连接”：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822223743326.png" alt="image-20200822223743326" style="zoom: 67%;" />

**原因：**  **Charles 安装的证书，没有添加到受信任根证书列表中。**

**解决：** 重新安装证书，并将证书添加到受信任根证书列表中，操作：`Help -> SSL Proxying -> install charles root certificate`。在安装过程中，**需要指定证书的存放位置。**

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822223743327.jpg" style="zoom: 67%;" />

### 浏览器证书安装

chrome 访问网站，抓取的数据，可能会出现 `<unknown>`，原因是浏览器没有安装证书，无法抓取 `https` 请求。

![image-20200822220635203](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822220635203.png)



**安装过程如下：**

* 安装证书：`Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or Remote Browser`，会有如下提示：

![image-20200822232013399](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200822232013399.png)

* 根据提示，在浏览器地址栏输入 `chls.pro/ssl` 下载证书。
* 在浏览器上安装证书，以 chrome 为例。在浏览器中输入：`chrome://settings`，访问 `隐藏设置和安全性 -> 更多 -> 管理证书`

如果证书安装后，还是会出现 `<unknown>`，可能是浏览器没有信任某种请求方式。比如：`methods: connect`。



### 移动端证书安装

#### IOS客户端

1. 打开Charles，选择`help→SSL Proxying→Install Charles Root Certificate on a Mobile Device or Remote Browser`
2. 移动端设备设备好代理后，打开safari，访问 `chls.pro/ssl ` 下载证书。如果无法访问 `chls.pro/ssl`，尝试用 `http://chls.pro/ssl` 或 `https://chls.pro/ssl`。
3. 证书下载下来是一个` *.pem `的文件，我们**需要重命名为` *.crt `文件**，不然无法安装。有的浏览器直接下载下来就是` *.crt` 文件，看运气。
4. 点击文件安装证书。手机弹出提示：此网站正尝试打开“设置”已向您显示一个配置描述文件。您要允许吗？忽略|允许，选择允许，安装描述文件，并信任
5. iOS10.3以上的手机需要在：`设置→ 通用 → 关于本机 → 证书信任设置→ charles proxy CA证书`，打开信任即可

#### Android客户端

Android机，可能无法自动安装，可以手动安装。安卓手机类型众多，所以有些不太一样。

以oppo R11为列：`设置 -> 其他设置 -> 安全与隐私 -> 从存储设备安装证书`，找到下载好的证书文件。

**方法一：**

1. 打开Charles，选择`help→SSL Proxying→Install Charles Root Certificate on a Mobile Device or Remote Browser`

2. 设置手机代理，打开浏览器，输入网址：`chls.pro/ssl`

3. 手机弹出提示：安装配置描述文件。您要允许吗？忽略|允许，选择允许，即可

**方法二：**

1. 打开Charles，选择`help -> SSL Proxying -> Save Charles Certificate`，将证书导入到手机中
2. 导入后直接点击安装证书即可
3. 如果提示无法打开，需要进入手机`设置 -> 更多设置 -> 系统安全 -> 从存储设备安装 -> 选择charles.pem`，点击高级，安装证书即可。



### Charles使用

![image-20200823113325508](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823113325508.png)

#### 过滤网络请求

对网络请求进行过滤，有以下几种办法：

**方法一：**在主界面的中部的 `Filter `栏中填入需要过滤出来的关键字。适用临时性的封包过滤。

**方法二：**在 Charles 的菜单栏选择`Proxy -> Recording Settings`，然后选择 `Include `栏，选择添加一个项目，然后填入需要监控的协议，主机地址，端口号。适用经常性的封包过滤。

**方法三：**在想过滤的网络请求上右击，选择 `Focus`。这种方式可以临时性的，快速地过滤出一些没有通过关键字的一类网络请求。

![image-20200823003432283](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823003432283.png)

#### 模拟慢速网络

在做移动开发的时候，我们常常需要模拟慢速网络或者高延迟的网络，以测试在移动网络下，应用的表现是否正常。Charles 对此需求提供了很好的支持。

在 Charles 的菜单上，选择 `Proxy -> Throttle Setting`  项，在之后弹出的对话框中，我们可以勾选上 `Enable Throttling` ，并且可以设置 `Throttle Preset `的类型。

如果我们只想模拟指定网站的慢速网络，可以再勾选上图中的 `Only for selected hosts` 项，然后在对话框的下半部分设置中增加指定的 hosts 项即可。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_08.jpg" alt="charles_08" style="zoom: 25%;" />



#### 修改网络请求内容

有些时候为了调试服务器的接口，我们需要反复尝试不同参数的网络请求。Charles 可以方便地提供网络请求的修改和重发功能。只需要在以往的网络请求上点击右键，选择 `Edit `，即可创建一个可编辑的网络请求。

可以修改该请求的任何信息，包括 URL 地址、端口、参数等，之后点击 `Execute `即可发送该修改后的网络请求。Charles 支持我们多次修改和发送该请求，这对于我们和服务器端调试接口非常方便，如图：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_09.jpg" alt="charles_09" style="zoom: 20%;" />

#### 给服务器做压力测试

我们可以使用 Charles 的 Repeat 功能来简单地测试服务器的并发处理能力。

我们在想打压的网络请求上（POST 或 GET 请求均可）右击，然后选择 「Repeat Advanced」菜单项，如下所示：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_10.jpg" alt="charles_10" style="zoom: 33%;" />

接着我们就可以在弹出的对话框中，选择打压的并发线程数以及打压次数，确定之后，即可开始打压。

>  悄悄说一句，一些写得很弱的投票网站，也可以用这个办法来快速投票。

  

  

有些时候我们想让服务器返回一些指定的内容，方便我们调试一些特殊情况。例如列表页面为空的情况，数据异常的情况，部分耗时的网络请求超时的情况等。如果没有 Charles，要服务器配合构造相应的数据显得会比较麻烦。这个时候，使用 Charles 相关的功能就可以满足我们的需求。

根据具体的需求，Charles 提供了 Map 功能、 Rewrite 功能以及 Breakpoints 功能，都可以达到修改服务器返回内容的目的。这三者在功能上的差异是：

1. Map 功能适合长期地将某一些请求重定向到另一个网络地址或本地文件。
2. Rewrite 功能适合对网络请求进行一些正则替换。
3. Breakpoints 功能适合做一些临时性的修改。

#### Map 功能

Charles 的 Map 功能分 `Map Remote` 和` Map Local `两种，顾名思义，`Map Remote` 是将指定的网络请求重定向到另一个网址请求地址，`Map Local` 是将指定的网络请求重定向到本地文件。

##### Map Remote

在 Charles 的菜单中，选择 `Tools -> Map Remote ` 即可进入到相应功能的设置页面。

对于 Map Remote 功能，我们需要分别填写网络重定向的源地址和目的地址，对于不需要限制的条件，可以留空。如：可将所有 192.168.188.98:9600（本地服务器）的请求重定向到了 192.168.190.47（其他服务器）。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823015640912.png" alt="image-20200823015640912" style="zoom: 33%;" />

> Map remote可解决跨域问题。
>
> 使用localhost接口，不会被拦截，可改用192.168.xxx.xxx
>
> 如果是通过cookie 中的token判断登录，需要手动在cookie中设置token

##### Map Local 

在 Charles 的菜单中，选择 `Tools -> Map Local `即可进入到相应功能的设置页面。

对于 Map Local 功能，我们需要填写的重定向的源地址和本地的目标文件。对于有一些复杂的网络请求结果，我们可以先使用 Charles 提供的` Save Response…` 功能，将请求结果保存到本地，然后稍加修改，成为我们的目标映射文件。

将一个指定的网络请求通过 Map Local 功能映射到了本地的一个经过修改的文件中。如图：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_11.jpg" alt="charles_11" style="zoom: 33%;" />

> 实际应用：**调试线上bug。**线上数据导致报错，测试环境或本地无法重现，而线上的js是压缩过的，debug比较困难。这时候，可以访问线上出错的页面，然后将js、css文件重定向到本地文件。

Map Local 在使用的时候，有一个潜在的问题，就是其返回的 Http Response Header 与正常的请求并不一样。这个时候如果客户端校验了`Http Response Header `中的部分内容，就会使得该功能失效。解决办法是同时使用 Map Local 以下面提到的 Rewrite 功能，将相关的 Http 头 Rewrite 成我们希望的内容。

#### Rewrite 功能

Rewrite 功能功能适合对某一类网络请求进行一些正则替换，以达到修改结果的目的。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823113136228.png" alt="image-20200823113136228" style="zoom:50%;" />



#### Breakpoints 功能

上面提供的 Rewrite 功能最适合做批量和长期的替换，但是很多时候，我们只是想临时修改一次网络请求结果，这个时候，使用 Rewrite 功能虽然也可以达到目的，但是过于麻烦，对于临时性的修改，我们最好使用 Breakpoints 功能。

Breakpoints 功能类似我们在 Xcode 中设置的断点一样，当指定的网络请求发生时，Charles 会截获该请求，这个时候，我们可以在 Charles 中临时修改网络请求的返回内容。

在 `proxy ->  Breakpoint Settings` ，完成配置。接口调用会进入暂停状态，可以修改请求信息，完成后点击 `Execute  `则可以让网络请求继续进行。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823113008659.png" alt="image-20200823113008659" style="zoom:50%;" />

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/image-20200823011245784.png" alt="image-20200823011245784" style="zoom: 50%;" />

注意：使用 Breakpoints 功能将网络请求截获并修改过程中，**整个网络请求的计时并不会暂停，**所以长时间的暂停可能导致客户端的请求超时。



### 正向代理和反向代理

#### 正向代理

用户想从服务器拿资源数据，但是只能通过proxy服务器才能拿到，所以用户A只能去访问proxy服务器然后通过proxy服务器去服务器B拿数据，这种情况用户是明确知道你要访问的是谁。

**最典型的案例是翻墙**

#### 反向代理

其实就是客户端去访问服务器时，他并不知道会访问哪一台，感觉就是客户端访问了Proxy一样，而实则就是当proxy关口拿到用户请求的时候会转发到代理服务器中的随机（算法）某一台。而在用户看来，他只是访问了Proxy服务器而已。

**典型的例子就是负载均衡**

#### 反向代理配置

Charles 的反向代理功能允许我们将本地的端口映射到远程的另一个端口上，在 `proxy -> reverse proxies`。例如，在下图中，我将本机的 9800 端口映射到了远程9600端口上了。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_14.jpg" alt="charles_14" style="zoom:50%;" />



### 设置外部代理，解决与翻墙软件的冲突

shadowsocks 类的代理软件，会对 charles 造成影响。

**Charles 的原理是把自己设置成系统的代理服务器，**但是在中国，由于工作需要，我们常常需要使用 Google 搜索，所以大部分程序员都有自己的翻墙软件，而这些软件的基本原理，也是把自己设置成系统的代理服务器，来做到透明的翻墙。

为了使得两者能够和平共处，我们可以在 Charles 的 `External Proxy Settings` 中，设置翻墙的代理端口以及相关信息。同时，我们也要关闭相关翻墙软件的自动设置，使其不主动修改系统代理，避免 Charles 失效。 

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/charles/charles_16.jpg" alt="charles_16" style="zoom: 25%;" />



### 常见问题

#### https链接无法访问

1. 没有开启 `SSL Proxying Setting -> enable SSL Proxying `，或者其中的 `location` 规则没加
2. 系统证书没有安装到根证书信任列表中。

解决方法，可以查看上文【系统证书安装】。

#### 抓包数据中，出现 `<unknown>`

证书没有安装，或者证书没有添加到信任列表中。

解决方法，查看 【浏览器证书安装】、【移动端证书安装】。



### 参考资料

[Charles安装与使用](https://www.jianshu.com/p/a9531405526d)

[踩坑记：Charles 打不开 HTTPS ，显示您的连接不是私密连接](https://www.jianshu.com/p/7d3557abcf53)

[Charles问题之Windows10下抓取https包，出现unknown](https://www.jianshu.com/p/0c95595e928d)


