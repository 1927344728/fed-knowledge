## git clone速度太慢的解决办法

git clone或者git push特别慢，并不是因为 **[http://github.com](https://links.jianshu.com/go?to=http%3A%2F%2Fgithub.com)** 的这个域名被限制了。而是 **[http://github.global.ssl.fastly.Net](https://links.jianshu.com/go?to=http%3A%2F%2Fgithub.global.ssl.fastly.Net)** 这个域名被限制了。



解决方法如下：

### hosts文件绑定映射(亲测有效)

最初用户从浏览器中输入 `github.com` 网址时，浏览器并不知道这个域名对应的真实 `ip` 地址，先问问自己电脑认识不认识这个域名的门牌号，如果本机不认识会接着往上问，当地运行商也不认识这个域名的话，继续问上级，直到问出来 `github.com` 的门牌号是 `140.82.113.4` 为止!

如此繁琐的问路过程被称之为 `DNS` 寻址，如果问路的时间都占用很久，那么访问网站的速度自然会很慢。

所以，如果我们直接告诉浏览器目的地，那么浏览器也就不会一步一步去费劲问路了，这在一定程度上也就优化了访问网站的速度。

##### 获取IP

提供两个查询域名解析的网站：

[https://www.ipaddress.com/](https://www.ipaddress.com/)

http://tool.chinaz.com/dns/

```js
github.global.ssl.fastly.net
github.com
```

##### 就近CDN加速

大型网站服务器都不会是只有一台服务器，而是多台服务器组成的集群一起对外提供服务。

全世界都在使用 `github` ，如果每一次访问网站时走的都是美国服务器，即使浏览器知道目的地，但是距离太多遥远还是会很慢。

因此，如果能够就近访问 `github` 网站就能大幅提高访问速度了，幸运的是，网络上同样有现成的工具来帮助我们查看就近的网站地址。[http://tool.chinaz.com/dns/](http://tool.chinaz.com/dns/)

![image-20200501114529797](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/other/image-20200501114529797.png)

##### 修改hosts文件

- Windows上的hosts文件路径在`C:\Windows\System32\drivers\etc\hosts`
- Linux的hosts文件路径在：`sudo vim /etc/hosts`

在hosts文件末尾添加两行(对应上面查到的ip)

```js
199.232.69.194 github.global.ssl.fastly.net
140.82.113.4 github.com
```

##### 保存更新DNS

- Winodws：打开CMD，输入`ipconfig /flushdns`（刷新）、`ipconfig /displaydns`（查看）
- Linux：在终端输入`sudo /etc/init.d/networking restart`

> 通过修改本机的 `hosts` 文件来绕过 `dns` 解析，这种方法仅仅适用于能够访问网站只不过是访问速度慢这一现象。
>
> hosts文件用记事本打开，一般需要管理员权限才能修改；可以将hosts文件复制出来，修改完成后，再替换到etc文件夹中；也可以修改hosts的权限：右键hosts–>属性–>安全->编辑，添加【写入】权限。
>
> 需要打开shadowsock等代理软件。原速度：10Kib/s左右，设置后100Kib/s以上



### 设置Git http[s].proxy

##### 打开SS代理(Shadowsocks)

##### 设置全局代理

```js
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080
##请注意：需要查看自己的端口是不是也是1080，可以打开你的SS查看代理设置##
```

输入`git clone https://github.com/xxxx/xxxx.git`，利用代理进行下载。

> **请注意，这里指的是https协议，也就是`git clone https://www.github.com/xxxx/xxxx.git`, 对于SSH协议`git clone git@github.com:xxxx/xxxx.git`依旧是无效的**

##### 不推荐直接用全局代理

因为如果挂了全局代理，这样如果需要克隆coding之类的国内仓库，会奇慢无比。建议使用这条命令，只对github进行代理，对国内的仓库不影响

```
git config --global http.https://github.com.proxy https://127.0.0.1:1080
git config --global https.https://github.com.proxy https://127.0.0.1:1080
```

同时，如果在输入这条命令之前，已经输入全局代理的话，可以输入进行取消

```text
git config --global --unset http.proxy
git config --global --unset https.proxy
```



### 通过【码云】等国内代码管理网站导入

1. 注册【码云】
2. 通过【码云】【从github导入已有项目】
3. git clone【码云】中的项目



### 重置本地接收缓存

`git config --global http.postBuffer 524288000`

git 文档中已有对该字段的[说明](https://git-scm.com/docs/git-config#Documentation/git-config.txt-httppostBuffer)，大意是：HTTP/1.1 协议的 transfer-encoding:chunked 头会将数据切块传输，每块数据一般默认不超过 1MB。通过 http.postBuffer 可以重置本地接收缓存的大小，也即每块数据的尺寸上限。一般不推荐将这个值设置太大，因为这会显著地提高内存的消耗量。

> 官方文档警告不要将该值设置太大。把缓存区设定成了 524288000 bytes（500MB）。这意味着，即使是 clone 一个 50 MB的小项目，在数据传输完之前，git 也会在内存开辟一个 500MB 的缓冲区。不是经常 clone项目还好，否则对内存相当不友好。建议可以改小些，譬如 10MB(10485760)，即提升了速度，也没有造成太大的浪费。
>
> `git config --global http.postBuffer 10485760`



### 代理Git -> connect.exe

##### 找到 .ssh 文件夹

比如 `C:\Users\[用户名]\.ssh` ，在里面新建一个空白文件，取名 `config`。**注意不是 `config.txt` ！**

##### 修改 `config` 文件

在 `config` 文件里写上一行：

```js
ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```

这里 git 的安装路径和后面的代理自己看着填，不要试着用相对路径，保证要吃亏。因为 `Program Files` 文件夹中间带一个空格，所以这里需要把整个路径给引号引起来。  后面的代理的话，`-S` 指是 socks 代理，默认是 socks5，后面的 `%h %p` 意思是 Host 和 Port，必须得写上，我也不知道为什么要这么设计。  如果要使用 HTTP 代理，就写 `-H`，更多代理类型（比如 socks4）请参[这个](https://link.zhihu.com/?target=https%3A//bitbucket.org/gotoh/connect/wiki/Home%23!more-detail)。

**以上写法是针对全局的，**如果想只针对某个网站的话，就这么写：

```text
Host github.com     
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p

Host gitlab.com     
  ProxyCommand "C:\Program Files\Git\mingw64\bin\connect.exe" -S 127.0.0.1:1080 %h %p
```

> 补充一点Windows上用connect.exe的坑。
>
> 1. 此程序必须写完整路径，即使在Path里也不可以只写connect.exe。这是个BUG，在 [ProxyCommand incorrectly requires an absolute path · Issue #1185 · PowerShell/Win32-OpenSSH](https://link.zhihu.com/?target=https%3A//github.com/PowerShell/Win32-OpenSSH/issues/1185) 中已经被修了。
>
> 2. 使用`-H`可不用输入密码。
>
> 3. 在程序路径两边加上引号：`ProxyCommand "c:\tools\connect.exe" -H 127.0.0.1:1080 %h %p`，git clone/pull/push等是能生效的，但`ssh -T git@github.com`会报：
>
>    ```js
>    CreateProcessW failed error:87
>    posix_spawn: Unknown error
>    ```
>
>    必须去掉引号：`ProxyCommand c:\tools\connect.exe -H 127.0.0.1:1080 %h %p`。这样`ssh -T`，以及一般的ssh连接，包括VSC的Remote - SSH才会成功。而git命令却会失败：
>
>    ```js
>    /bin/sh: line 0: exec: c:toolsconnect.exe: not found
>    ssh_exchange_identification: Connection closed by remote host
>    fatal: Could not read from remote repository.
>    
>    Please make sure you have the correct access rights
>    ```
>
>    看信息是反斜杠都没了，所以应用斜杠，引号仍不能加：
>
>    ```text
>    Host github.com
>        Ciphers aes128-gcm@openssh.com
>        ProxyCommand c:/tools/connect.exe -H 127.0.0.1:1080 %h %p
>    ```



### 使用github的镜像 (亲测有效)

`git clone https://github.com/xxxx/xxxx.git` 替换成`git clone https://github.com.cnpmjs.org/xxxx/xxxx.git`

> 亲测：替换前大约10KiB/s，替换后大约500~800KiB/s。
>
> 第一次clone要登录，使用github.com的账号密码即可。





### 参考链接：

[加快git clone 几十倍速度的小方法 （30KB vs 2M）](https://blog.51cto.com/11887934/2051323)

https://www.zhihu.com/question/27159393
