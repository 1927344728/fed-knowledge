# Charles安装及使用

> Charles 是一个 HTTP 代理 / HTTP监视器 / 反向代理，使开发人员能够查看计算机和网络之间的所有 HTTP 和 SSL / HTTPS 流量。 这包括请求、响应和 HTTP 报头（其中包含 cookie 和缓存信息）。 
>
> ——[Charles](https://www.charlesproxy.com/)

Charles 是 MacOS 上的最常用的抓包工具。

**抓包（packet capture）** 就是将网络传输发送与接收的数据包进行截获、重发、编辑、转存等操作，也用来检查网络安全。

**Charles 通过将自己设置成系统的网络访问代理服务器**，使得所有的网络访问请求都通过它来完成，从而实现了网络封包的截取和分析。

![image-20200822214531424](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822214531424.png)

### 主要功能

* 截取 Http、Https、SSL 请求的网络数据。
* 支持**请求重定向**，即请求映射，包括本地映射和远程映射。使用场景：将线上资源映射到本地某个文件夹下，在本地文件（如，css、JavaScript 等文件）代码中调试一些线上才能重现的 bug（即，数据是线上的环境，前端代码在本地，方便在线调试）。

- 支持重发网络请求（用于服务端调试）。
- 支持修改网络请求参数。
- 支持网络请求的劫持并动态修改。
- 支持模拟慢速网络。如，模仿移动设备上的 2G/3G/4G 的访问。
- 支持反向代理。
- 支持 SOCKS 代理 。Socks 代理是基于 Socks 协议的一种代理，也叫全能代理。与其他类型的代理不同，它只是简单地传递数据包，而并不关心是何种应用协议，既支持 TCP 协议又支持 UDP 协议。所以 SOCKS 代理服务器比其他类型的代理服务器速度要快得多。

### Charles的安装 

* 安装 JDK：Charles 由 Java开发，需要先安装好 JDK。??

* 安装Charles：[下载安装包](https://www.charlesproxy.com/download/latest-release/) -> 安装。

* 破解：Charles 是付费软件，网上也有破解版下载。也可以用网上热心网友提供的信息完成注册：`Help -> registered  `

  ```shell
  Registered Name: https://zhile.io
  License Key: 48891cf209c6d32bf4
  ```

### 代理配置

#### 设置系统代理

Charles 通过将自己设置成代理服务器来截取数据。所以使用 Charles 的第一步是将其设置成系统的代理服务器。

点击菜单栏 proxy -> macOS Proxy，打开配置面板：

* Proxy Settings：设置端口等参数，端口一般默认 8888。

* Enable transparent HTTP proxying：允许代理 HTTP 请求。

* SSL Proxying Settings：设置允许抓取 https 请求。 该选项需要勾选 `Enable SSL Proxying`，并添加一条 `Location`规则：

  ![image-20200822223459747](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822223459747.png)


**需要注意的是：** Chrome 和 Firefox 浏览器默认并不使用系统的代理服务器设置，而 Charles 是通过将自己设置成系统的代理服务器来完成封包截取的，所以在默认情况下无法截取 Chrome 和 Firefox 浏览器的网络通讯内容。

以 Mac 下的 Chrome 为例：在 C'hrome 浏览器的地址栏右侧的三个。。。 -> 设置 -> 系统 -> 打开您计算机的代理设置，或者在 MAC 左上角的苹果ICON -> 系统偏好设置 -> 网络偏好设置 -> 高级 -> 代理 打开配置面板。将 【网页代理(HTTP)】  和 【安全网页代理(HTTPS)】 的网页代理服务器的 IP 设置为 Charles 服务的 IP，如：`127.0.0.1` 、`8888`。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_04.jpg" alt="charles_04" style="zoom: 50%;" />

以 Window（10） 下的 Chrome 为例：在 C'hrome 浏览器的地址栏右侧的三个。。。 -> 设置 -> 系统 -> 打开您计算机的代理设置，或者 windows开始 -> 设置 -> 网络和internet -> 代理 打开配置面板。将 【手动设置代理 】的代理服务器的 IP 设置为 Charles 服务的 IP，如：`127.0.0.1` 、`8888`。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823004801294.png" alt="image-20200823004801294" style="zoom: 50%;" />

#### 设置移动端代理

移动端可以使用 PC 端启动的 Charles 代理服务。（注意：移动端和 PC 端设备必需使用同一 wifi）

移动端配置代理服务器（以 iPhone 为例）：

* 设置手动代理：设置 -> 无线局域网 -> 【当前连接的 wifi 名】 -> 配置代理，将代理切换为【手动】，写入启动 Charles 服务的 电脑的 IP 和 端口号：

  * 主机名：查看 Charles 下，help -> Local IP Addresses。

  * 端口：查看 Charles 下，Proxy -> Proxy Settings。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_18.jpg?imageMogr2/thumbnail/!50p" alt="charles_18.jpg" style="zoom:50%;" />

- 安装证书。具体可查看下文【移动端证书安装】

* 打开任意需要网络通讯的程序，可以看到 Charles 弹出请求连接的确认菜单。点击 “Allow” 即可完成设置。

### 证书安装

#### 系统证书安装

* 安装证书：Charles 下，`help -> SSL Proxying -> Install Charles Root Certificate`。在安装过程中，**需要指定证书的存放位置。**

  <img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822223743327.jpg" style="zoom: 67%;" />

* 开启 SSL proxy：Charles 下，proxy -> SSL proxy。Charles 默认也并不截取 Https 网络通讯的信息。如果需要截取 Https 网络请求，需配置该选项。

**注意：** 如果 Charles 安装的证书，没有添加到受信任根证书列表中，Chrome 浏览器访问 https 地址时，会出现如下报错：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822223743326.png" alt="image-20200822223743326" style="zoom: 67%;" />

**解决：** 重新安装证书，并将证书添加到受信任根证书列表。

#### 浏览器证书安装

* 安装证书：Charles 下，点击 `Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or Remote Browser`，出现如下提示信息：

![image-20200822232013399](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822232013399.png)

* 根据提示，在浏览器地址栏输入 `chls.pro/ssl` 下载证书。
* 浏览器配置：以 Chrome 为例。在浏览器中输入 `chrome://settings`，找到 `隐藏设置和安全性 -> 更多 -> 管理证书`。

**注意：** 如果证书安装后，还是会出现 `<unknown>`，可能是浏览器没有信任某种请求方式。比如：`methods: connect`。

**注意：** 如果浏览器没有安装证书，则 Charles 抓取 Chrome 浏览器的 Https 请求，可能会出现 `<unknown>` 异常：

![image-20200822220635203](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200822220635203.png)

#### 移动端证书安装

##### IOS 客户端

1. 打开 Charles，选择 `help→SSL Proxying→Install Charles Root Certificate on a Mobile Device or Remote Browser`。
2. 移动端设备代理配置好后，打开 Safari，访问 `chls.pro/ssl ` 下载证书。如果无法访问 `chls.pro/ssl`，尝试用 `http://chls.pro/ssl` 或 `https://chls.pro/ssl`。
3. 证书下载下来是一个 ` *.pem ` 的文件，**重命名为 ` *.crt ` 文件**，不然无法安装。有的浏览器直接下载下来就是 ` *.crt`  文件，看运气。
4. 点击文件，安装证书。手机提示「此网站正尝试打开“设置”已向您显示一个配置描述文件。您要允许吗？忽略|允许」，选择允许，安装描述文件，并信任。
5. iOS10.3 以上的手机需要在，设置 → 通用 → 关于本机 → 证书信任设置→ charles proxy CA 证书，添加信任。

##### Android 客户端

Android 机，可能无法自动安装，可以手动安装。安卓手机类型众多，所以有些不太一样。

以 oppo R11 为列：设置 -> 其他设置 -> 安全与隐私 -> 从存储设备安装证书，找到下载的证书文件。

**方法一：**

1. 打开 Charles，选择 `help→SSL Proxying→Install Charles Root Certificate on a Mobile Device or Remote Browser`。

2. 设置手机代理，打开浏览器，输入网址 `chls.pro/ssl`。

3. 手机弹出提示『安装配置描述文件。您要允许吗？忽略|允许』，选择允许。

**方法二：**

1. 打开 Charles，选择 `help -> SSL Proxying -> Save Charles Certificate`，将证书导入到手机中。
2. 导入后直接点击安装证书即可。
3. 如果提示无法打开，需要进入手机 `设置 -> 更多设置 -> 系统安全 -> 从存储设备安装 -> 选择charles.pem`，点击高级，安装证书。

### Charles使用

![image-20200823113325508](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823113325508.png)

#### 过滤网络请求

对网络请求进行过滤，有以下几种办法：

**方法一：**在主界面的中部的 `Filter ` 栏中填入需要过滤出来的关键字。

**方法二：**在 Charles 的菜单栏选择 `Proxy -> Recording Settings`，然后选择 `Include `栏，选择添加一个项目，然后填入需要监控的协议、主机地址、端口号。适用经常性的封包过滤。

**方法三：**在想过滤的网络请求上右击，选择 `Focus`。

![image-20200823003432283](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823003432283.png)

#### 模拟慢速网络（Throttle Setting）

移动开发中，常常需要模拟慢速网络或者高延迟的网络，以测试在移动网络下，应用的表现是否正常。

在 Charles 的菜单上，选择 `Proxy -> Throttle Setting`  项，在配置面板中，勾选 `Enable Throttling` ，修改 `Throttle Preset ` 的选项。

如果只想模拟指定网站的慢速网络，可以勾选的 `Only for selected hosts` 项，添加指定的 hosts：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_08.jpg" alt="charles_08" style="zoom: 25%;" />

#### 重发网络请求

有时为调试服务器的接口，需要反复尝试不同参数的网络请求。Charles 可以方便地提供网络请求的修改和重发功能。只需要在以往的网络请求上点击右键，选择 `Edit `，即可创建一个可编辑的网络请求。

可以修改请求的任何信息，包括 URL 地址、端口、参数等，之后点击 `Execute ` 即可发送该修改后的网络请求。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_09.jpg" alt="charles_09" style="zoom: 20%;" />

#### 服务器压力测试（Repeat）

使用 Charles 的 Tools -> Repeat 功能来简单地测试服务器的并发处理能力。

在需要测试的网络请求上右击，然后选择 「Repeat Advanced」菜单项，如下所示：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_10.jpg" style="zoom:50%;" />

#### 请求重定向（Map）

Map 功能适合长期地将某一些请求重定向到另一个网络地址或本地文件。

Charles 的 Map 功能分 `Map Remote` 和` Map Local `两种，顾名思义，`Map Remote` 是将指定的网络请求重定向到另一个网址请求地址，`Map Local` 是将指定的网络请求重定向到本地文件。

##### Map Remote

在 Charles 的菜单中，选择 `Tools -> Map Remote ` 进入配置面板，填写网络重定向的源地址和目的地址（不需要限制的条件可留空）。

比如，将所有 192.168.188.98:9600（本地服务器）的请求重定向到了 192.168.190.47（其他服务器）：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823015640912.png" alt="image-20200823015640912" style="zoom: 33%;" />

**注：** path 参数，前面必需加 '/'。

**注意：** Map remote 可解决跨域问题。但 localhost 域名不会被拦截，可改用192.168.xxx.xxx。如果是通过 cookie 中的 token 判断登录，需要手动在 cookie 中设置 token。

##### Map Local 

在 Charles 的菜单中，选择 `Tools -> Map Local ` 进入配置面板，填写的重定向的源地址和本地的目标文件。

对于有一些复杂的网络请求结果，可以先使用 Charles 提供的 ` Save Response…` 功能，将请求结果保存到本地，然后稍加修改，成为本地环境下的目标映射文件。比如，将一个远程网络请求通过映射到一个本地文件中：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_11.jpg" alt="charles_11" style="zoom: 33%;" />

**实用场景：** 线上数据原因导致异常，测试环境或本地无法重现，而线上的  JavaScript 是压缩过的，debug 比较困难。这时候，可以访问线上出错的页面，然后将 JavaScript 资源的请求重定向到本地对应的未压缩的 JavaScript 文件。

**注意：** 使用中有一个潜在的问题，就是其返回的 Http Response Header 与正常的请求并不一样。这个时候如果客户端校验了 `Http Response Header ` 中的部分内容，就会使得该功能失效。解决办法是，使用下面提到的 Rewrite 功能，将相关的 Http 头 Rewrite 成希望的内容。

#### 重写请求/响应数据（Rewrite）

Rewrite 功能适合对某一类网络请求进行一些正则替换，以达到修改结果的目的。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823113136228.png" alt="image-20200823113136228" style="zoom:50%;" />

#### 重写请求/响应数据（临时）（Breakpoints）

Rewrite 功能适合做批量和长期的替换，Breakpoints 功能则适合做一些临时性的修改。

Breakpoints 功能类似在调试工具中设置断点，当指定的网络请求发生时，Charles 会截获该请求，然后在 Charles 中临时修改网络请求的返回内容。常用于只想临时修改一次网络请求结果，当然，使用 Rewrite 功能也可以达到目的，但是过于麻烦。

在 Charles 的菜单中，选择 `proxy ->  Breakpoint Settings ` 进入配置面板，完成配置后，接口调用时会进入暂停状态，此时，允许修改请求信息。修改后，点击 `Execute  ` 则可以让网络请求继续进行。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823113008659.png" alt="image-20200823113008659" style="zoom:50%;" />

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200823011245784.png" alt="image-20200823011245784" style="zoom: 50%;" />

**注意：** 使用 Breakpoints 功能将网络请求截获并修改过程中，**整个网络请求的计时并不会暂停，**所以长时间的暂停可能导致客户端的请求超时。

### 正向/反向代理

#### 正向代理

客户端想从目标服务器请求资源数据，但是其本身不能直接请求目标服务器，只能通过 proxy 服务器才能拿到。也就是，客户端向目标服务器请求数据，实际上是向 proxy 服务器发起请求，再由 proxy 服务器向目标服务器发起请求，并将响应数据返回给客户端。这种情况，客户端是明确知道最终要访问的是谁。

正向代理典型的案例是**翻墙**。

#### 反向代理

客户端发起请求时，并不知道最终是访问哪一台。它想访问的就是 Proxy 服务器，并且让 Proxy 服务器来决定请求的数据来源哪台服务器。实际上，proxy 服务器接收用户请求时，会转发到服务器中的随机（算法）某一台。这种情况，客户端不知道，也不关心最终访问的是谁。

反向代理典型的案例是**负载均衡**。

#### 反向代理配置（reverse proxies）

Charles 的反向代理功能允许将本地的端口映射到远程的另一个端口上，在 Charles 的菜单中，选择 `proxy -> reverse proxies ` 进入配置面板：

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_14.jpg" alt="charles_14" style="zoom:50%;" />

#### 解决与代理服务器的冲突（External Proxy Settings）

shadowsocks 类的代理软件，会对 charles 造成影响。

**Charles 的原理是把自己设置成系统的代理服务器，**但是在国内，由于工作需要，常常需要使用 Google 搜索，所以大部分程序员都有自己的翻墙软件，而这些软件的基本原理，也是把自己设置成系统的代理服务器，来做到透明的翻墙。

为了解决两者冲突，在 Charles 的 `External Proxy Settings` 中，设置翻墙的代理端口以及相关信息。同时，也要其他代理服务器的自动设置，使其不主动修改系统代理，避免 Charles 失效。 

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/charles_16.jpg" alt="charles_16" style="zoom: 25%;" />

### 常见问题

#### Https链接无法访问

* 没有开启 `SSL Proxying Setting -> enable SSL Proxying `，或者其中的 `location` 规则没加。
* 系统证书没有安装到根证书信任列表中。

**解决：** 参考上文【证书安装】。

#### 抓包请求出现 `<unknown>`

证书没有安装，或者证书没有添加到信任列表中。

**解决：** 参考上文【证书安装】。

### 参考资料

[Charles安装与使用](https://www.jianshu.com/p/a9531405526d)

[踩坑记：Charles 打不开 HTTPS ，显示您的连接不是私密连接](https://www.jianshu.com/p/7d3557abcf53)

[Charles问题之Windows10下抓取https包，出现unknown](https://www.jianshu.com/p/0c95595e928d)