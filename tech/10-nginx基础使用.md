## Nginx基础使用

Nginx 是一款轻量级的 Web 服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。

### 安装及使用

brew 又叫 Homebrew，是 Mac 中的一款软件包管理工具，通过 brew 可以很方便的在 Mac 中安装软件或者是卸载软件。

一般 Mac 电脑会默认安装有 brew。

```shell
# 搜索
brew search nginx
# 安装
brew install nginx
# 卸载
brew uninstall nginx
# 升级
sudo brew update
# 查看安装信息
sudo brew info nginx
# 查看已经安装的软件
brew list
```

**安装：** `brew install nginx` 。

#### 安装扩展模块

以 `echo-nginx-module` 为例：

* [下载](https://github.com/openresty/echo-nginx-module/tags) 并解压 [echo-nginx-module](https://github.com/openresty/echo-nginx-module)。

* **添加 echo-nginx-module 模块：** 解压后的目录可以放到任何位置，但需要告诉 nginx 该扩展模块的位置。在终端用 `--add-module` 指定模块位置。

  ```shell
  cd /usr/local/Cellar/nginx/1.21.1
  ./configure --add-module=/usr/local/Cellar/nginx/1.21.1/echo-nginx-module-0.62
  ```

* **编译并重新安装。**

  make 是用来编译的，它从 Makefile 中读取指令，然后编译。

  make install 是用来安装的，它也从 Makefile 中读取指令，安装到指定的位置。

  ```shell
  make
  make install
  # 这时侯切记不要make install, 因为 make install 就会把文件复制到安装目录
  ```

* **检验并启动。** 

  ```shell
  sudo /usr/local/nginx/sbin/nginx -v
  sudo /usr/local/nginx/sbin/nginx
  ```

> 注意： 用 `brew install nginx` 安装，目录下没有 `./configure` 程序。需要在[官网下载](http://nginx.org/en/download.html)安装包，解压，再执行如上步骤。

#### 路径与配置

安装完以后，可以在终端输出的信息里看到一些配置路径：

* /usr/local/etc/nginx/nginx.conf： 配置文件路径；
* /usr/local/var/www： 服务器默认路径，即默认 HTML 文件存放路径；
* /usr/local/Cellar/nginx/1.21.1： nginx 的安装路径；
* /usr/local/bin/nginx： nginx 执行文件；
* /usr/local/var/log/nginx/error.log：报错日志。

#### 怎么彻底卸载Nginx？

* 关闭 nginx（如果已启动）：`nginx -s stop`；
* 卸载 nginx：`brew uninstall nginx`；

* 检查 nginx 是否在运行：`ps -ef | grep nginx`；
* 停止 nginx 进程：`kill -9 [上一步查出来的nginx进程号]`；
* 查找所有名字包含 nginx 的文件：`find / -name nginx`；
* 删除 nignx 安装的相关文件：`rm -rf /usr/local/nginx`；

### Nginx的一些命令

**Nginx 自己的命令：**

```shell
# 打开终端运行命令
nginx             # 启动Nginx。
									# nginx 会在 /usr/local/var/run/ 路径下创建一个名为 nginx.pid 的文件
nginx -s reload   # 重新加载配置
									# 但前提是 /usr/local/var/run/ 路径下必须存在 nginx.pid 文件
nginx -s reopen   # 重启
nginx -s stop     # 停止
									# nginx 会将 /usr/local/var/run/ 路径下名为nginx.pid 的文件删除掉。
									# 但前提是/usr/local/var/run/ 路径下必须存在 nginx.pid 文件
nginx -s quit     # 退出 nginx
nginx -V          # 查看版本，以及配置文件地址
nginx -v          # 查看版本
nginx -c filename # 指定配置文件
nginx -h          # 帮助    
nginx -t          # 测试配置是否有语法错误
```

**brew services 命令：**

```shell
# brew services [-v|--verbose] [list | run | start | stop | restart | cleanup] [...]
brew services start nginx    # 启动Nginx服务
brew services stop nginx     # 停止Nginx服务
brew services restart nginx  # 重启Nginx服务
```

### [Nginx的配置文件](https://www.nginx.cn/76.html)

根据安装的提示，配置文件的路径：`/usr/local/etc/nginx/nginx.conf`。

Nginx 的主配置文件是 nginx.conf，这个配置文件一共由三部分组成，分别为**全局块、events块和http块**。在http 块中，又包含 http 全局块、多个 server 块。每个 server 块中，可以包含 server 全局块和多个 location 块。在同一配置块中嵌套的配置块，各个之间不存在次序关系。

配置文件支持大量可配置的指令，绝大多数指令不是特定属于某一个块的。同一个指令放在不同层级的块中，其作用域也不同，一般情况下，高一级块中的指令可以作用于自身所在的块和此块包含的所有低层级块。如果某个指令在两个不同层级的块中同时出现，则采用“就近原则”，即以较低层级块中的配置为准。比如，某指令同时出现在 http 全局块中和 server 块中，并且配置不同，则应该以 server 块中的配置为准。

打开文件编辑里面的内容：

```shell
user  nginx;
worker_processes  1;
#error_log  /var/log/nginx/error.log warn;
#pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    keepalive_timeout  65;
    server {
        listen       9600;
        server_name  localhost;
        location / {
            root   /html;
            index  index.html index.htm;
        }
        location /api {
            proxy_pass http://example.com;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

#### 全局块

全局块是默认配置文件从开始到 events 块之间的一部分内容，主要设置一些影响 Nginx 服务器整体运行的配置指令，因此，这些指令的作用域是 Nginx 服务器全局。

通常包括配置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数、Nginx 进程 PID 存放路径、日志的存放路径和类型以及配置文件引入等。

#### events块

events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接。常用到的设置包括是否开启对多 worker process 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型处理连接请求，每个 worker process 可以同时支持的最大连接数等。

这一部分的指令对 Nginx 服务器的性能影响较大，在实际配置中应该根据实际情况灵活调整。

#### http块

http 块是 Nginx 服务器配置中的重要部分，代理、缓存和日志定义等绝大多数的功能和第三方模块的配置都可以放在这个模块中。

前面已经提到，http 块中可以包含自己的全局块，也可以包含 server 块，server 块中又可以进一步包含 location 块，使用 “http全局块” 来表示 http 中自己的全局块，即 http 块中不包含在 server 块中的部分。

可以在 http 全局块中配置的指令包括文件引入、MIME-Type 定义、日志自定义、是否使用 sendfile 传输文件、连接超时时间、单连接请求数上限等。

#### server块

server 块和“虚拟主机”的概念有密切联系。

虚拟主机，又称虚拟服务器、主机空间或是网页空间，它是一种技术。该技术是为了节省互联网服务器硬件成本而出现的。这里的“主机”或“空间”是由实体的服务器延伸而来，硬件系统可以基于服务器群，或者单个服务器等。虚拟主机技术主要应用于 HTTP、FTP 及 EMAIL 等多项服务，将一台服务器的某项或者全部服务内容逻辑划分为多个服务单位，对外表现为多个服务器，从而充分利用服务器硬件资源。从用户角度来看，一台虚拟主机和一台独立的硬件主机是完全一样的。

在使用 Nginx 服务器提供 Web 服务时，利用虚拟主机的技术就可以避免为每一个要运行的网站提供单独的 Nginx 服务器，也无需为每个网站对应运行一组 Nginx 进程。虚拟主机技术使得 Nginx 服务器可以在同一台服务器上只运行一组 Nginx 进程，就可以运行多个网站。

在前面提到过，每一个 http 块都可以包含多个 server 块，而每个 server 块就相当于一台虚拟主机，它内部可有多台主机联合提供服务，一起对外提供在逻辑上关系密切的一组服务（或网站）。

和 http 块相同，server 块也可以包含自己的全局块，同时可以包含多个 location 块。在 server 全局块中，最常见的两个配置项是本虚拟主机的监听配置和本虚拟主机的名称或IP配置。

#### listen指令

server块中最重要的指令就是 listen 指令，这个指令有三种配置语法。这个指令默认的配置值是：listen *:80 | *:8000；只能在 server 块种配置这个指令。

```shell
listen 127.0.0.1:8000;  # 只监听来自127.0.0.1这个IP，请求8000端口的请求
listen 127.0.0.1;       # 只监听来自127.0.0.1这个IP，请求80端口的请求（不指定端口，默认80）
listen 8000;            # 监听来自所有IP，请求8000端口的请求
listen *:8000;          # 和上面效果一样
listen localhost:8000;  # 和第一种效果一致
```

#### server_name指令

用于配置虚拟主机的名称。

对于name 来说，可以只有一个名称，也可以由多个名称并列，之间用空格隔开。每个名字就是一个域名，由两段或者三段组成，之间由点号 “.” 隔开。

```shell
server_name  localhost myserver.com;
```

Nginx 服务器规定，第一个名称作为此虚拟主机的主要名称。

在 name 中可以使用通配符 “*”，但通配符只能用在由三段字符串组成的名称的首段或尾段，或者由两段字符串组成的名称的尾段，如：

```
server_name myserver.* *.myserver.com
```

由于 server_name 指令支持使用通配符和正则表达式两种配置名称的方式，因此在包含有多个虚拟主机的配置文件中，可能会出现一个名称被多个虚拟主机的 server_name 匹配成功。那么，来自这个名称的请求到底要交给哪个虚拟主机处理呢？Nginx 服务器做出如下规定：

对于匹配方式不同的，按照以下的优先级选择虚拟主机，排在前面的优先处理请求。

- ① 准确匹配 server_name
- ② 通配符在开始时匹配 server_name 成功
- ③ 通配符在结尾时匹配 server_name 成功
- ④ 正则表达式匹配 server_name 成功

在以上四种匹配方式中，如果 server_name 被处于同一优先级的匹配方式多次匹配成功，则首次匹配成功的虚拟主机处理请求。

#### location块

每个 server 块中可以包含多个 location 块。在整个 Nginx 配置文档中起着重要的作用，而且 Nginx 服务器在许多功能上的灵活性往往在 location 指令的配置中体现出来。

location 块的主要作用是，基于 Nginx 服务器接收到的请求字符串（例如， server_name/uri-string），对除虚拟主机名称（也可以是IP别名，后文有详细阐述）之外的字符串（前例中“/uri-string”部分）进行匹配，对特定的请求进行处理。地址定向、数据缓存和应答控制等功能都是在这部分实现。许多第三方模块的配置也是在 location 块中提供功能。

在Nginx的官方文档中定义的location的语法结构为：

```shell
location [ = | ~ | ~* | ^~ ] uri { ... }
```

其中，uri 变量是待匹配的请求字符串，可以是不含正则表达的字符串，如 `/myserver.php` 等；也可以是包含有正则表达的字符串，如 `.php$`（表示以 `.php` 结尾的URL）等。

其中方括号里的部分，是可选项，用来改变请求字符串与 uri 的匹配方式。

在不添加此选项时，Nginx 服务器首先在 server 块的多个 location 块中搜索是否有标准 uri 和请求字符串匹配，如果有多个可以匹配，就记录匹配度最高的一个。然后，服务器再用 location 块中的正则 uri 和请求字符串匹配，当第一个正则uri匹配成功，结束搜索，并使用这个 location 块处理此请求；如果正则匹配全部失败，就使用刚才记录的匹配度最高的 location 块处理此请求。

了解了上面的内容，就可以解释可选项中各个标识的含义了：

* `“=”`：用于标准uri前，要求请求字符串与 uri 严格匹配。如果已经匹配成功，就停止继续向下搜索并立即处理此请求。

* `“^～”`：用于标准uri前，要求 Nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再使用 location 块中的正则 uri 和请求字符串做匹配。
* `“～”`： 用于表示 uri 包含正则表达式，并且区分大小写。
* `“～*”`：用于表示 uri 包含正则表达式，并且不区分大小写。注意如果 uri 包含正则表达式，就必须要使用“～”或者“～*”标识。

> 我们知道，在浏览器传送URI时对一部分字符进行URL编码，比如空格被编码为“%20”，问号被编码为“%3f”等。“～”有一个特点是，它对uri中的这些符号将会进行编码处理。比如，如果location块收到的URI为“/html/%20/data”，则当Nginx服务器搜索到配置为“～ /html/ /data”的location时，可以匹配成功。

#### root指令

这个指令用于设置请求寻找资源的根目录，此指令可以在 http 块、server 块或者 location 块中配置。由于使用 Nginx 服务器多数情况下要配置多个 location 块对不同的请求分别做出处理，因此该指令通常在 location 块中进行设置。

#### index指令

指定用来做默认文档的文件名，即定义首页索引文件的名称，可以在文件名处使用变量。 如果您指定了多个文件，那么将按照您指定的顺序逐个查找。 可以在列表末尾加上一个绝对路径名的文件。

```shell
index  index.$geo.html  index.0.html  /index.html;
```

**注意：** 保存配置文件后，重新加载配置文件： `nginx -s reload`。

#### 其他相关指令

| 指令| 语法| 使用环境 | 作用 |
| --------------------------- | ----------------------------------- | -------------------------- | ------------------------------------------------------------ |
| break | -| server、location、if | 完成当前的规则集，不再处理 rewrite 指令。|
| if| - | server、location | 检查一个条件是否符合，如果条件符合，则执行大括号内的语句。 <br />if 指令不支持嵌套，不支持多个条件 `&&` 和 `&brvbar;&brvbar;` 处理。|
| return | return code; | server、location、if | 结束规则的执行并返回状态码给客户端。|
| rewrite | rewriteregex replacement flag; | server、location、if | 根据表达式来重定向URI，或者修改字符串。|
| set | set variable value; | server、location、if | 用于定义一个变量，并给变量赋值。<br />变量的值可以为文本、变量以及文本变量的联合。|
| Uninitialized_variable_warn | uninitialized_variable_warn on\off; | http、server、location、if | 开启和关闭未初始化变量的警告信息，默认值为开启。|

#### If指令详解

正则表达式匹配：

- ==：  等值比较；
- ~：  与指定正则表达式模式匹配时返回“真”，判断匹配与否时区分字符大小写；
- ~*：  与指定正则表达式模式匹配时返回“真”，判断匹配与否时不区分字符大小写；
- !~：  与指定正则表达式模式不匹配时返回“真”，判断匹配与否时区分字符大小写；
- !~*：  与指定正则表达式模式不匹配时返回“真”，判断匹配与否时不区分字符大小写；

**文件及目录匹配判断：**

- -f, !-f： 判断指定的路径是否为存在且为文件；
- -d, !-d： 判断指定的路径是否为存在且为目录；
- -e, !-e： 判断指定的路径是否存在，文件或目录均可；
- -x, !-x： 判断指定路径的文件是否存在且可执行；

```shell
# 如果文件不存在则返回 400
if (!-f $request_filename) {
	return 400;
}

# 如果 host 不是 example.com，则 301 到 example.com 中
if ( $host != 'example.com' ){
	rewrite ^/(.*)$ https://example.com/$1 permanent;
}

# 如果请求类型不是 POST 则返回 405
if ($request_method = POST) {
	return 405;
}

# 如果参数中有 a=1，则 301 到指定域名
if ($args ~ a=1) {
	rewrite ^ http://example.com/ permanent;
}
```

#### 几个常见配置项

- `$host`： HTTP请求行的主机名；
* `$hostname`： 主机名；
* `$uri`： 请求中的当前URI；
* `$remote_addr`： 客户端地址；
* `$remote_port`： 客户端端口；
* `$remote_user`： 用于HTTP基础认证服务的用户名；
* `$request`： 代表客户端的请求地址；
* `$request_uri`： 一些客户端请求参数的原始 URI；
* `$scheme`： 请求使用的 web 协议，http | https；
* `$server_addr`： 服务器端地址；
* `$server_name`： 服务器名；
* `$server_port`： 服务器端口；
* `$http_host`： 请求地址，即浏览器中你输入的地址（IP或域名）；

### 什么是正向代理和反向代理？

#### 正向代理

正向代理是一个位于客户端和目标服务器之间的服务器(代理服务器)，为了从目标服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理服务器向目标服务器转交请求并将获得的内容返回给客户端。

这种代理其实在生活中是比较常见的，比如访问外国网站技术，其用到的就是代理技术。

有时候，用户想要访问某国外网站，该网站无法在国内直接访问，但是我们可以访问到一个代理服务器，这个代理服务器可以访问到这个国外网站。这样呢，用户对该国外网站的访问就需要通过代理服务器来转发请求，并且该代理服务器也会将请求的响应再返回给用户。

**所以，正向代理，其实是"代理服务器"代理了"客户端"，去和"目标服务器"进行交互。**

#### 反向代理

反向代理是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

对于常用的场景，就是我们在 Web 开发中用到的负载均衡服务器，客户端发送请求到负载均衡服务器上，负载均衡服务器再把请求转发给一台真正的服务器来执行，再把执行结果返回给客户端。

**所以，反向代理，其实是"代理服务器"代理了"目标服务器"，去和"客户端"进行交互。**

#### 正向代理和反向代理的区别

虽然正向代理服务器和反向代理服务器所处的位置都是客户端和真实服务器之间，所做的事情也都是把客户端的请求转发给服务器，再把服务器的响应转发给客户端，但是二者之间还是有一定的差异的。

* 正向代理其实是客户端的代理，帮助客户端访问其无法访问的服务器资源。反向代理则是服务器的代理，帮助服务器做负载均衡，安全防护等。
* 正向代理一般是客户端架设的，比如在自己的机器上安装一个代理软件。而反向代理一般是服务器架设的，比如在自己的机器集群中部署一个反向代理服务器。
* 正向代理中，服务器不知道真正的客户端到底是谁，以为访问自己的就是真实的客户端。而在反向代理中，客户端不知道真正的服务器是谁，以为自己访问的就是真实的服务器。
* 正向代理和反向代理的作用和目的不同。正向代理主要是用来解决访问限制问题。而反向代理则是提供负载均衡、安全防护等作用。二者均能提高访问速度。

### 正向代理和反向代理配置示例

#### 正向代理配置演示

以下演示中，我们以 A 主机浏览器作为客户端、A 主机也作为提供 Web 服务的服务器、B 主机作为代理服务器。我们禁止 A 主机浏览器直接访问自己提供的 Web 服务，然后通过 B 主机代理获取，来模拟正向代理的场景。

* A 主机（IP：192.168.188.98）启动一个 Web 服务，如 `192.168.188.98:9700/index.html`。这时，客户端是能正常访问该 Web 服务。

* 修改 A 主机的 Nginx 配置文件，加入一个判断语句：如果访问该服务的客户端主机是 A（IP：192.168.188.98），则禁止访问，返回403；

  ```shell
  server {
      listen       9700;
      server_name  localhost;
      location / {
          if ($remote_addr ~* "^192\.168\.188\.98") {
              return 403;
          }
          proxy_pass  http://localhost:9600;
      }
  }
  ```

  `nginx -s reload`一下，然后在客户端打开 `192.168.188.98:9700/index.html`，可以发现已经无法访问了，页面返回 403。

* 修改 B 主机（IP：192.168.188.99） 的 Nginx 配置文件，添加如下配置：

  ```shell
  # http协议的代理
  server {
      resolver 8.8.8.8;
      listen 8088;
      server_name localhost;
      location / {
          proxy_pass $scheme://$http_host$request_uri;
      }
  }
  # https协议的代理
  server {
      resolver 8.8.8.8;
      listen 443;
      server_name localhost;
      location / {
          proxy_pass $scheme://$http_host$request_uri;
      }
  }
  ```
  
  * resolver：DNS 解析服务器的 IP；
  * `$scheme` 是请求的协议，`$http_host` 是请求的主机名， `$request_uri` 是请求后面所加的参数。
  
  这个配置是，所有访问 B 主机下 8088|443 端口的 HTTP|HTTPS 请求，全部代理到  `$scheme://$http_host$request_uri;` ，即原访问地址。
  
* 将 B 主机设置为 A 主机的代理器。也就是说，A 主机的所有请求都是发向 B 主机的，B 主机再用 A 主机的发起的请求地址，去请求真正要访问的主机。

  Mac 设置代理器的方法：在 A 主机打开 `系统偏好设置 -> 网络 -> 高级 -> 代理 -> 网页代理(HTTP) | 安全网页代理(HTTPS)` 的 【网页代理服务器】填入 B 主机的 IP，以及 8088|443 端口号。

  ![image-20211201202840435](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/QQ%E5%9B%BE%E7%89%8720211205182656.png)

以上配置就是正向代理的一个场景演示。客户端是想要 A 的资源，但是 A 的资源只有 B 能拿到，便让 B 代理去帮助我们访问 A 的资源。整个过程 A 只知道 B 拿了它的资源，并不知道最终是客户端拿到的。

现在，我们又能在客户端访问 `192.168.188.98:9700/index.html` 了，绕过了 A 主机设定的限制。

#### 反向代理配置

```shell
# 将 localhost:9700/api 请求代理到 https://example.com/api
# 注意！！proxy_pass  https://example.com；中 https://example.com 后面不能有 "/"
# 否则！！会将 localhost:9700/api 代理到 https://example.com/
server {
	listen       9700;
	server_name  localhost;

	location / {
		proxy_pass  https://www.baidu.com/;
	}
}
```

### 一些常见错误

#### 重启 nginx 报错

执行命令：`nginx -s reload` 时，报错：

```shell
nginx: [error] invalid PID number "" in "/usr/local/var/run/nginx.pid"
```

或者

```shell
nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)
```

**原因：** 没有 `nginx.pid` 文件。可以是没有启动 nginx，或者是 `nginx.pid` 误删了。

**解决：** 重启一下 Nginx 就好了。

#### 启动 nginx 报错

```shell
nginx

nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] still could not bind()
```

**原因：** 可能是系统中其他进程占用了端口，也可能是 nginx 已经启动了。

**解决：** `lsof -i:8080` 找出占用端口的进程。如果是其他进程占用了，可以用 `kill -9 [进程id]` 关闭该进程，或者为 nginx 指定其他端口。如果是 nginx 已经在用了，重启 nginx `nginx -s reload`，而不是启动 nginx。

#### nginx 代理失败

安装及配置完成后，nginx 代理无效。控制台没有报错，只是默默失败。

其原因可能是：

* 代理软件冲突。比如：开启了 ShadowSocks。
* listen 所指定的端口，是其他程序（如：webpack 开发环境、http-server）启动的。访问该端口的请求，没有进入 Nginx。

#### ./configure: No such file or directory

定位到 `/usr/local/Cellar/nginx/1.21.1` 目录，执行如下命令时：

```shell
./configure --add-module=/usr/local/Cellar/nginx/1.21.1/echo-nginx-module-0.62
```

**报错：** `no such file or directory: ./configure`。

**原因：** 该目录下没有 `./configure` 文件。这可能是使用 `brew install nginx` 安装，有部分文件没有。

**解决：** 下载并解压 nginx 安装包，找到解压后的目录，依次执行 `./configure --add-module=/usr/local/Cellar/nginx/1.21.1/echo-nginx-module-0.62` -> `make` -> `make install`。

**相关链接：** [./configure: No such file or directory - build nginx-rtmp-module on Mac OS X](https://stackoverflow.com/questions/40858679/configure-no-such-file-or-directory-build-nginx-rtmp-module-on-mac-os-x)

#### nginx: [alert] kill(61700, 1) failed (3: No such process)

在执行 `nginx -s reload`、`nginx -s stop`，报错：

```shell
nginx: [alert] kill(61700, 3) failed (3: No such process)
```

**原因：** nginx 启动的进程不存在。可能没有启动，或者被意外关闭了。

**解决：** 

```shell
# 指定配置檔案地址
/usr/local/nginx/nginx -c /usr/local/nginx/nginx.conf
```



### 参考资料

[Mac下 Nginx 的安装运行](http://yu66.vip/doc/mac/010-Mac%E4%B8%8BNginx%E7%9A%84%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.html)

[Nginx配置文件详解](https://www.cnblogs.com/54chensongxia/p/12938929.html)

[Nginx中文文档](https://www.nginx.cn/doc/)

[Nginx 正向代理与反向代理实战](https://developer.51cto.com/art/202010/629316.htm)