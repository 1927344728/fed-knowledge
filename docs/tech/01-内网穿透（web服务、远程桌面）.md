# 内网穿透（web服务、远程桌面）

## 内网穿透

内网，其实就是在公司或者是家庭内部，建立的一种局域网络或者是办公网络，从而实现多台电脑之间可以进行资源的共享，包括设备、资料、数据等。

外网，则是由一个网关与其它的网络系统连接，相对于内网而言，这种网络系统称之为外部网络，也就是我们经常说到的互联网。

**内网穿透就是别人通过外网能够访问到我们本地的服务器，也称为内网穿透动态域名解析服务（nat-DDNS）是一种基于动态域名服务（DDNS）和网络地址转换（nat）的服务器内外网动态映射方法。**

我们在做开发时，搭建的本地服务器只能供我们自己电脑的浏览器访问，或者处于同一个wifi下的手机访问，但是我们如果想让别人访问到我们的本地服务器。 我们就要做内网穿透了。

### 内网穿透的原理

内网穿透是我们在进行网络连接时的一种术语，也叫做**NAT穿透**，即在计算机是局域网内的时候，外网与内网的计算机的节点进行连接时所需要的连接通信。内网穿透的功能就是，当我们在端口映射时设置时，**内网穿透起到了地址转换的功能**，也就是把公网的地址进行翻译，转成为一种私有的地址，然后再采用ADSL（Asymmetric Digital Subscriber Line，非对称数字用户线路，是宽带接入技术的一种）的宽带路由器，将一个动态或者是固定的公网IP，最后ADSL在交换机上，这样所有的电脑都可以共享上网。内网穿透除了可以实现内网之间机器的网络通信功通之外，还可以解决UDP中出现的数据传输不稳定问题。

### NAT（网络地址转换）

NAT（Network Address Translation，网络地址转换）属接入广域网(WAN)技术，是一种**将私有（保留）地址转化为合法IP地址**的转换技术，它被广泛应用于各种类型Internet接入方式和各种类型的网络中。原因很简单，NAT不仅完美地解决了lP地址不足的问题，而且还能够有效地避免来自网络外部的攻击，隐藏并保护网络内部的计算机。

**NAT工作原理：**

当私有网主机和公共网主机通信的IP包经过NAT网关时，将IP包中的源IP或目的IP在私有IP和NAT的公共IP之间进行转换。

如下图所示，NAT网关有2个网络端口，其中公共网络端口的IP地址是统一分配的公共 IP，为`202.20.65.5`；私有网络端口的IP地址是保留地址，为`192.168.1.1`。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/l8qxsuxoeu.png"/>

1. **客户机发起请求：**私有网中的主机`192.168.1.2`向公共网中的主机`202.20.65.4`发送了1个IP包`Dst=202.20.65.4,Src=192.168.1.2`。（src = source，源；dst = destination，目的）

2. **NAT网关将私网IP转为公网IP：**当IP包经过`NAT`网关时，`NAT Gateway`会将IP包的源IP转换为`NAT Gateway`的公共IP并转发到公共网，此时IP包`Dst=202.20.65.4，Src=202.20.65.5`中已经不含任何私有网IP的信息。

3. **服务端响应：**`Web Server`发出的响应IP包`Dst= 202.20.65.5,Src=202.20.65.4`发送到`NAT Gateway`。

4. **NAT网关将公网IP转为私网IP**：`NAT Gateway`会将IP包的目的IP转换成私有网中主机的IP，然后将IP包`Des=192.168.1.2，Src=202.20.65.4`转发到私有网。对于通信双方而言，这种地址的转换过程是完全透明的

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/7jmmzh3r96.png)

5. **NAT网关连接跟踪：**`NAT Gateway`在收到响应包后，就需要判断将数据包转发给谁。此时如果子网内仅有少量客户机，可以用静态NAT手工指定；但如果内网有多台客户机，并且各自访问不同网站，这时候就需要连接跟踪`connection track`。

   在`NAT Gateway`收到客户机发来的请求包后，做源地址转换，并且将该连接记录保存下来，当`NAT Gateway`收到服务器来的响应包后，查找`Track Table`，确定转发目标，做目的地址转换，转发给客户机。

   

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/p9c6rbit97.png)

1. **NAT网关端口转换：**如果`Client A`和`Client B`同时访问`Web Server`，那么当`NAT Gateway`收到响应包的时候，就无法判断将数据包转发给哪台客户机。

   `NAT Gateway`会在`Connection Track`中加入端口信息加以区分。如果两客户机（端口不同）访问同一服务器，那么在`Track Table`里加入端口信息即可区分，如果两客户机端口正好相同，那么在实行NAT的同时对源端口也要做相应的转换。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/hzkla28zra.png" alt="NAT网关端口转换"  />



### NAPT原理（网络地址端口转换）

NAPT（Network Address Port Translation，网络地址端口转换），是NAT的进一步扩展，**在NAT进行IP地址转换的同时进行Port的转换。**



## 内网穿透工具

| 工具名称                               |   模式     |        支持模式         |                             **教程文档**                             |                             说明                             |
| -------------- | :--------------- | :--------------- | :--------------: | :------------: |
| **[Frp](https://www.natfrp.com/)** |    免费     |    TCP、http(s)、udp     | [官网](http://gitproxy.qianqu.me/wiki/#/frpc/use_windows) | **推荐** |
| [**Sunny-Ngrok**](http://www.ngrok.cc/) |  免费/收费  |    TCP、http(s)、udp     | [官网](http://www.ngrok.cc/_book/)                        | **推荐** |
| [**Ngrok**](https://ngrok.com/)        | 免费/收费 | TCP、http(s)、Websocket | [官网](https://ngrok.com/product)                         | **速度慢**                  |
| [**Natapp**](https://natapp.cn/)       | 免费/收费。 | TCP、http(s)、wss | [官网](https://natapp.cn/article) | **免费需实名认证** |

其他：[**小米球**](http://ngrok.ciqiuwl.cn/)（免费/收费）、[echosite](https://www.echosite.cn/)（收费）、Ssh、autossh（免费）、[**花生壳**](https://www.oray.com/)（**免费模式，不技持web访问**）。



### [Frp 安装使用](https://www.natfrp.com)

#### Window安装过程

[查看官网教程](http://gitproxy.qianqu.me/wiki/#/launcher/use_wpf)

1. **Sakura frp账号注册。**在官网[https://www.natfrp.com/](https://www.natfrp.com/)注册，成功后会跳转到 [管理面板](https://www.natfrp.com/user/)，在左侧栏点击软件下载，win10选第一个就好了。

![image-20200809165843825](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809165843825.png)

3. **创建并启动隧道。**

   * 打开刚才下载的软件，点击安装`SakuraLauncher.exe`，在界面中输入访问密钥进行登陆。密钥在官网的[管理面板](https://www.natfrp.com/user/)查看。

![image-20200809183942429](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809183942429.png)

![image-20200809184333846](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809184333846.png)

* 登陆完成后，点左边菜单栏的隧道，点击新建隧道。**也可以在官网中创建隧道**，创建后，需要重启`SakuraLauncher.exe`，才能在软件隧道列表中看到。

![image-20200809184538061](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809184538061.png)

* 本地ip：通常可以填`127.0.0.1`。window通过`cmd`运行`ipconfig`查看。

  > 查看本地IP地址：按`win+r`，输入`cmd`按`enter`，输入`ipconfig`

* 端口：远程桌面的端口默认是3389（左侧TCP端口监听列表中，如果没有3389，说明远程桌面服务没启，需要手动启动下）。其他，如启动web服务`localhost:3000`，则填3000。

  > 启动远程桌面端口：输入`services.msc`按`enter`，找到 `remote desktop services`，右击选择启动。或者计算机 -> 管理 -> 服务和应用程序 -> 服务 -> Remote Desktop Services，启动远程服务。

* 隧道名称：可不填，会产生一个随机的名称

* 隧道类型：远程桌面选择TCP，web服务也可以选择TCP。如果选`http\https`类型，需要有备案过的域名。

* 远程端口：可以自己指定，范围是10240~65535，不能和已有的重复。默认0，会随机分配一个。

* 服务器：一般没有特殊需求可能随便选。**如果是web服务，则需要查看服务器是否支持建站。**[官网查看隧道类型介绍](https://www.natfrp.com/tunnel/create)

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200811004102324.png" alt="image-20200811004102324" style="zoom:150%;" />



* 点击开启刚才的隧道，会弹出日志信息。这个日志信息上面的**IP或者服务器域名+端口**，是用于远程桌面连接、web页面访问的地址。

![](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200810012342674.png)


#### Mac安装过程

[查看官网教程](http://gitproxy.qianqu.me/wiki/#/frpc/use_unix)

1. 下载[frpc_darwin_amd64](https://www.natfrp.com/tunnel/download)文件。
2. 用 root 权限执行自动安装的脚本：`sudo bash <(curl -s https://getfrp.sh)`。
3. 根据安装后的提示，启动隧道：`<frpc_darwin_amd64文件路径> -f <账户密钥>:<隧道ID>`

> 我在自动安装过程中，执行命令`sudo bash <(curl -s https://getfrp.sh)`出错了；后来试了`sudo wget -O- https://getfrp.sh`也不行，是`mac`的`wget`不支持`https`协议；最后，我是将文件下载到本地，再用`bash`执行。

#### 创建`http(s)`隧道

1. 必需自己要有可用的域名。如果没有，就创建`tcp`隧道，一样可以访问web页面。
2. 不是所有服务器都支持建站，具体需查看服务器的描述。

3. 通过所选服务器的`域名或ip + 端口`来连接或访问（无论是web服务，还是远程桌面连接）。



### [**Sunny-Ngrok**](http://www.ngrok.cc/)

1. [注册账号](http://www.ngrok.cc/login/register)
2. [下载客户端](https://www.ngrok.cc/download.html)。解压后有两个文件：`sunny.exe`和`Sunny-Ngrok启动工具.bat`。
3. [购买（有免费服务器）、开通隧道](http://www.ngrok.cc/user.html)
4. 命令行启动隧道：
   * 方法一：通过 `cmd`命令行进到 `sunny.exe`所在的目录执行，运行：`sunny.exe clientid 隧道id`或者`sunny.exe clientid 隧道id,隧道id`（多个隧道同时启动）。
   * 方法二：通过 `Sunny-Ngrok启动工具.bat` 启动，直接输入隧道id就好了



### [Ngrok](https://ngrok.com/)

1. **下载 -> 解压 -> 安装：**在Linux或OSX上，您可以使用以下命令从终端解压缩`ngrok`。在`Windows`上，只需双击 `ngrok.zip`。
2. **注册账号：**运行此命令会`./ngrok身份验证令牌<your_auth_token>`，将您的身份验证令牌添加到您的 `ngrok.yml`文件中。连接帐户将在仪表板上列出您打开的隧道，为您提供更长的隧道超时时间，以及更多。访问信息中心以获取您的身份验证令牌。
3. **启动：**命令板中试执行`./ngrok help`，查看是否安装成功；运行`./ngrok http 80`启动`80`端口的http隧道。



## 恢复window 10远程桌面功能

如果window 10是家庭版，则不支持远程桌面，需要安装 `RDP War`p 恢复`Win10`家庭版系统的远程桌面访问功能。

* 下载` RDP Warp`。项目地址：https://github.com/stascorp/rdpwrap，在页面的`Release`找到下载页面，下载`zip`文件，解压。

![image-20200809172337095](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809172337095.png)

* **首先运行RDPCheck.exe**，这是一个测试程序，会尝试建立一个和本机之间的远程连接。如果连接成功，那么说明你的主机是支持完整的远程桌面连接功能的，也就不需要进行后续操作了。如果失败，那么接着**以管理员身份运行install.bat**，执行安装。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809172512699.png" alt="image-20200809172512699"  />

* 安装程序结束之后，**运行RDPConf.exe**，查看目前的远程桌面服务的运行状态。

  **如果Wrapper state：Not installed**，是没有安装成功，可能是被杀毒软件拦截了。

![image-20200809174016918](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809174016918.png)

**如果Listener state一项是红色的，显示not listening [not supported]，**这是因为其中一个文件无效引起的，我们可以手动加下。

![image-20200809182128358](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20200809182128358.png)

**解决方法：**

1. 以管理员权限运行 `Powershell/CMD`
2. 运行命令 **net stop termservice**，关闭`Remote Desktop Services`服务
3. 下载**[rdpwrap.ini](https://wws.lanzous.com/iS2IIdb6sng)文件，**将下载到的文件替换到 `C:\Program Files\RDP Wrapper`文件夹。注意：`rdpwrap.ini`有可能对你的电脑无效，这跟window系统版本有关，你可以从网上找其他`rdpwrap.ini`文件。
4. 运行命令 **net start termservice**，恢复 `Remote Desktop Services` 服务
5. 运行`update.bat`，再运行`RDPConf.exe`查看。成功的话。

`Diagnostics`里面的三个状态都是绿的，那么远程桌面连接功能已经恢复了。




## 远程桌面连接

**内网的连接，直接输入被控电脑的本地ip即可；外网需要先做内网穿透。**

**远程桌面连接（主控电脑）：**

window 7：Windows -> 附件 -> 远程桌面连接 -> 输入被控电脑的本地IP或内网穿透后的ip

window 10：单击搜索 -> 远程桌面连接 -> 打开 -> 输入被控电脑的本地IP或内网穿透后的ip

mac： ？？

**允许连接远程桌面（被控电脑）：**

window的远程桌面连接，可以使用自带的远程桌面连接；mac需要借助`microsoft remote desktop`类的工具实现。

* window 7：计算机 -> 右击，选择【属性】 -> 远程设置 -> 远程，设置允许远程控制。

* window 10：开始 -> 设置 -> 系统 -> 远程桌面，


**远程桌面连接，需要注意：**

1. 被控电脑正常运行

2. 被控电脑启动了远程桌面服务，且设置为允许远程桌面服务。
3. 需要被控电脑的登录账号和密码。有些电脑，如果有没密码，是不允许远程桌面连接的，如：window 7。
4. 有些电脑的防火墙或杀毒软件，可能会影响远程桌面连接服务。



### microsoft remote desktop 

1. 下载安装：

   mac：https://microsoft-remote-desktop-connection.softonic.cn/mac

   window：https://remote-desktop-windows-10.softonic.cn/download

2. 添加被控制 PC 的 IP 、登录账号、密码。

<img src="https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/20200809211913.jpg" style="zoom:;" />



### teamviewer

TeamViewer 是全面的**远程访问、远程控制及远程支持**解决方案，几乎适用于所有桌面和移动平台，包括 Windows、macOS、Android 及 iOS。 使用流程如下：

1. 下载：https://www.teamviewer.cn/cn/products/teamviewer/，安装软件**（主控和被控PC都必需安装）**。
2. 注册账号。
3. 输入伙伴的ID（被控电脑的teamviewer ID）。

![image-20200812204943589](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/ABD9-CB2A-D9B5-63F72FB35DA1.jpg)



## 参考链接

[网络地址转换NAT原理](https://cloud.tencent.com/developer/article/1619642)

[NAPT和NAT的工作原理及其区别](https://blog.csdn.net/u013485792/article/details/76071252)

[可以实现内网穿透的几款工具](https://my.oschina.net/ZL520/blog/2086061)

[超全内网穿透工具,github项目及方法](https://fdlucifer.github.io/2019-11-29-Intranet-penetration)
[Win10（家庭版）内网穿透实现远程桌面访问](https://zhuanlan.zhihu.com/p/109972051)

