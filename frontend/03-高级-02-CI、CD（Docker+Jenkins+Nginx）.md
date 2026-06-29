## 高级篇：CI/CD（Docker+Jenkins+Nginx）

最早的前端开发就是实现页面，主要是用 HTML + CSS + JavaScript 搭建页面，然后加一些交互的特效。但是随着需求的增加，前端不仅要做 Web 应用，还要做App、小程序以及各种端。在这种需求日增的情况下，必须得考虑一种新的方式，提高前端开发效率，例如，解决代码冗余、项目可维护性、提升版本迭代速度等等一系列的问题。前端工程化的概念也就是在这种情况下被提出了。

前端工程本质上是软件工程的一种，可以从模块化、组件化、规范化、自动化四个方面来思考。

* 模块化：将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载。
* 组件化：组件是指从 UI 拆分下来的每个包含 HTML + CSS + JavaScript 功能完备的结构单元。
* 规范化：包含目录结构、编码风格、前后端接口规范、文档规范、组件管理、Git 分支管理、Commit 描述规范、定期 CodeReview、视觉图标规范等等。
* 自动化：让机器去完成一些简单的重复的劳动，包含：自动化测试、自动化构建、自动化部署等。

**备注：** 本文中的示例是在同一台电脑运行的，没有外网可访问的服务器。所以，SSH remote hosts、SSH Servers、SSH 自动构建等配置没有跑通。

### CI/CD 概要

#### CI

Continuous Integration，持续集成。集成是指软件开发过程中合并代码的过程，而持续集成指的就是自动化的过程——在开发人员提交新代码后，自动进行构建、测试并合并代码到代码仓库中。

#### CD

CD 有两种含义，Continuous Delivery 持续交付和 Continuous Deployment 持续部署。持续交付指在完成应用的测试、集成和构建后因为团队要求或业务要求，自动将应用部署到准生产环境，能部署到准生产环境也就意味着可以直接部署到正式的生产环境，所以，持续交付意味着任何的代码修改可以在任何想要部署的时候实施部署，表示一种能力。

而持续部署则是一种实践，一个最终动作，表示在通过前面的所有阶段后自动将改动投入生产环境。

### Docker

Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核的 cgroup，namespace，以及 OverlayFS 类的 Union FS 等技术，对**进程进行封装隔离**，属于 **操作系统层面的虚拟化技术**。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。

作为一种新兴的虚拟化方式，Docker 跟传统的虚拟化方式相比具有众多的优势：

* 更高效的利用系统资源
* 更快速的启动时间
* 一致的运行环境
* 更轻松的迁移
* 更轻松的维护和扩展

对比传统虚拟机总结：

| 特性       | 容器               | 虚拟机     |
| ---------- | ------------------ | ---------- |
| 启动       | 秒级               | 分钟级     |
| 硬盘使用   | 一般为 MB          | 一般为 GB  |
| 性能       | 接近原生           | 弱于       |
| 系统支持量 | 单机支持上千个容器 | 一般几十个 |

#### 安装 Docker

Homebrew 安装：`brew install --cask docker`

手动下载安装：下载 [Docker Desktop for Mac](https://desktop.docker.com/mac/main/amd64/Docker.dmg)

安装完成后，可以在主机（指计算机，是为区别后面涉及的容器概念）终端通过命令检查安装后的 Docker 版本：

```shell
docker --version
```

#### 安装 Jenkins 镜像

操作系统分为**内核**和**用户空间**。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。而 Docker 镜像（Image），就相当于是一个 root 文件系统。它是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

在主机终端执行以下命令，搜索 Jenkins 镜像：

```shell
docker search jenkins
```

在主机终端执行以下命令，拉取 Jenkins 镜像：

```shell
docker pull jenkins/jenkins:lts #  冒号（:）后面是版本号，可不加。不加版本号，默认拉取最新版
```

#### 启动 Jenkins 容器

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

容器的实质是进程，但与直接在宿主执行的进程不同，**容器进程运行于属于自己的独立的命名空间**。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。

在 Docker 应用程序界面，Images 列表中可看到已安装的 Jenkins 镜像。

![image-20221026104546470](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026104546470.png)

鼠标指针移动到该镜像上，点击【run】 按钮，配置以下选项运行容器：

* Container name：必填，容器名。
* Ports：必填，向主机发布容器的端口（即端口映射，9001:8080，表示主机 9001 端口对应容器 8080 端口）。可以配置两个端口映射：一个容器启动的端口，另一个是 Jenkins web 服务器的端口。
* Volumes：可不填，绑定挂载卷，是主机与容器的映射，主机路径（选择主机目录） : 容器路径（输入绝对路径，如 /var/jenkins_home）。
* Environment variables：可不填，环境变量。

![image-20221027200634367](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027200634367.png)

![image-20221027200656409](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027200656409.png)

另外，也可以在主机终端通过命令运行容：

```shell
# 使用 jenkins/jenkins:lts 镜像启动一个名为 jenkins 的容器
docker run -d -p 9001:8080 --name jenkins jenkins/jenkins:lts
docker run -uroot -d --restart=always --privileged=true -p 9001:8080 -v $HOME/Documents/docker/jenkins/jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts

# -u, --user= 用户名或者 UID
# -d, --detach=false 在后台运行容器并打印容器ID
# --restart=no 在容器退出时重新启动策略应用 
# --privileged 向此容器授予扩展特权
# -p, --publish=[] 向主机发布容器的端口（即端口映射，9001:8080，表示主机 9001 端口对应容器 8080 端口）
# -v, --volume=[] 绑定挂载卷
# --name= 指定容器名称
```

**注意：** 以上两种方法，都可能会遇到类似下面的问题：

```shell
docker run -uroot -d --restart=always --privileged=true -p 9001:8080 -v $HOME/Documents/docker/jenkins/jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts
# touch: setting times of '/var/jenkins_home/copy_reference_file.log': No such file or directory
# Can not write to /var/jenkins_home/copy_reference_file.log. Wrong volume permissions?
```

这是因为容器运行时，加了 -v 参数（绑定挂载卷，即主机与容器的映射）。容器初始化时，会用主机目录覆盖容下的目录，也就是说，如果主机目录为空文件夹，则容器对应的目录也会被替换为空文件夹，由于容器下的 /var/jenkins_home 目录包含 Jenkins 运行需要的一些文件， 被替换为空后，Jenkins 运行时，抛出读取文件异常。

**解决方案：**

* 不带 -v 参数，启动一次容器。

  ```shell
  docker run -d -p 9001:8080 --name jenkins jenkins/jenkins:lts
  ```

* 将容器下的 /var/jenkins_home 目录复制到主机目录下。

  ```shell
  sudo chmod 777 /Users/lizhao/Documents/docker
  docker cp jenkins:/var/jenkins_home $HOME/Documents/docker/jenkins
  # 或者
  sudo docker cp jenkins:/var/jenkins_home/** $HOME/Documents/docker/jenkins
  ```

* 删除容器，再指定 -v 参数，重新启动一次容器。

  ```shell
  docker run -uroot -d --restart=always --privileged=true -p 9001:8080 -v $HOME/Documents/docker/jenkins/jenkins_home:/var/jenkins_home -v $HOME/Documents/docker/web/jenkins:/html --name jenkins jenkins/jenkins:lts
  ```

#### 进入 Jenkins 终端

**容器进程运行于属于自己的独立的命名空间**。当需要在 Jenkins 容器执行 shell 命令时，先要进入 Jenkins 容器的终端（注：不是主机的终端）。

可用以下两种方法：

一种方法是通过主机终端执行以下命令：

```shell
# 以交互模式启动 jenkins 容器，在容器内执行 /bin/bash 命令
docker exec -it -uroot jenkins bash
# jenkins 是启动的容器名，也可以换成容器 Id
# -i 即使没有连接，也保持 STDIN 打开
# -t 分配一个伪 TTY
# -it 即以交互式进入容器
# -u 用户名或 UID
# bash 启动一个 Bash 会话
```

**备注：** 退出容器终端命令 exit。

另一种方法是在 Docker 应用程序界面中，点击 Containers ->  【容器】 -> actions -> Open in terminal 打开终端。

![image-20221026103841649](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026103841649.png)

![image-20221026104130990](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026104130990.png)

#### 配置 Jenkins 容器密钥

密钥的主要作用就是为了让 Jenkins 容器可以去 Github、Gitee、GitLab 上拉取代码。

进入 Jenkins 容器终端，执行：

```shell
ssh-keygen -t rsa -C "root" # 输入完一直回车就结束了
cat /root/.ssh/id_rsa.pub # 查看公钥
```

将 Jenkins 公钥放到 Github：[Github 网站](https://github.com/) -> 右上角头像 -> Settings  -> SSH and PGP keys -> new SSH key。

![image-20221026135104397](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026135104397.png)

#### 测试 SSH 连接

在 Jenkins 容器终端输入：

```shell
ssh -T git@github.com
```

如果看到类似如下的警告：

```shell
The authenticity of host 'github.com (IP ADDRESS)' can't be established.
RSA key fingerprint is xxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)?
```

验证所看到消息中的指纹是否匹配 GitHub 的 RSA 公钥指纹。 如果是，则输入 yes。

连接成功，显示：

```shell
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 导入 Github 项目

在 jenkins 容器终端输入：

```shell
cd /var/jenkins_home
mkdir workspace
cd workspace
git clone git@github.com:xxxxxxx/demo-xxxx.git # Github 项目地址。如果没有项目，先去创建一个。
```

**注意：** 避免直接在根目录下 clone 项目，会报错：

```shell
fatal: could not create work tree dir 'demo-xxx': Permission denied
```

### Jenkins

Jenkins 是一个开源的、提供友好操作界面的持续集成（CI）工具，起源于Hudson（Hudson是商用的），主要用于持续、自动的构建/测试软件项目、监控外部任务的运行（这个比较抽象，暂且写上，不做解释）。Jenkins 用 Java 语言编写，可在 Tomcat 等流行的 servlet 容器中运行，也可独立运行。通常与版本管理工具(SCM)、构建工具结合使用。常用的版本控制工具有 SVN、GIT，构建工具有 Maven、Ant、Gradle。

#### 访问页面

在 Docker 应用程序的界面中，点击 Containers -> 【容器】 -> PORT(S) -> 9001:8080，可以访问 jenkins 页面（也可以直接在浏览器输入地址 http://localhost:9001）。

首次进入页面，可能需要稍微等待一下（页面加载，可能需要几分钟）。加载完成后，进入【解锁 Jenkins】弹层，需要输入【管理员密码】。密码在 `/var/jenkins_home/secrets/initialAdminPassword` 文件中。

![image-20221025194011665](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221025194011665.png)

**这里要特别注意一点：** 因为 Jenkins 是在容器（可以理解为一台独立的计算机）中运行，所以 `/var/jenkins_home/secrets/initialAdminPassword` 并**不是**计算机根目录下的路径，而是已启动的 Jenkins 容器根目录下的路径。（这是指未提定挂载卷的情况下。如果指定了，可以在主机的挂载卷下查找）。

获取密码可用以下两种方法：

一种方法是在计算机终端执行：

```shell
docker exec -it -uroot jenkins bash # jenkins 是启动的容器名，也可以换成容器 Id
cat /var/jenkins_home/secrets/initialAdminPassword # 在终端输出密码
```

另一种方法是在 Docker 应用程序界面中，点击 Containers ->  【容器】 -> actions -> Open in terminal 打开终端，执行：

```shell
cat /var/jenkins_home/secrets/initialAdminPassword
```

**备注：** 也可以直接在 Containers ->  【Jenkins容器】 -> actions -> View details -> Logs 中查看密码。

输入密码继续：

* 进入【自定义Jenkins】弹层，选择【安装推荐的插件】；
* 插件安装完成后（需要等待十多分钟），进入【创建第一个管理员用户】弹层，可以创建一个管理员账号，也可以点击【使用 admin 账户继续】（admin 账号的密码就是上面提到的密码）跳过；
* 进入【实例配置】弹层，可以点击【现在不要】跳过；
* 进入【Jenkins已就绪！】弹层，点击【开始使用 Jenkins】。

![image-20221028173014496](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221028173014496.png)

#### 安装插件

安装可能需要用到的 3 个插件：

* NodeJS 插件：用于构建前端 Vue 项目。
* SSH ： 连接远程服务器工具。
* Publish Over SSH ：发布到远程服务器工具。

以安装 NodeJS 插件为例：

点击 Dashboard -> Manage Jenkins -> System Configuration -> Manage Plugins，切换到【可选插件】，输入 "NodeJS"，点击 【Download now and install after restart】；进入到【安装/更新 插件中】页面，勾选【安装完成后重启 Jenkins（空闲时）】；重启后，刷新页面。

![image-20221026175416635](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026175416635.png)

**备注：** 如果 Jenkins 重启失败，可以在 Docker 应用程序界面中手动启动）。

#### 管理凭据

凭据其实就是账号密码，访问 Github、Gitee 都需要用到。

点击 Dashboard -> 系统管理 -> 安全 -> Manage Credentials，点击 Stores scoped to Jenkins -> System ->【全局】-> 【Add Credentials】。

填写配置信息：

* 类型：凭据类型，可以是账号密码、私钥等。
* 用户名：如 Github 的账号；
* 密码：如 Github 的密码。

凭据类型：

* Secret text：API Token 之类的 token，比如，GitHub 个人访问 token。

* Username and password：可以为独立的字段，也可以为冒号分隔的字符串：username:password。

* Secret file：保存在文件中的加密内容。
* SSH Username with private key：SSH 公钥/私钥对。
* Certificate：a PKCS#12 证书文件 和可选密码。

![image-20221026181323897](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026181323897.png)

![image-20221028174555381](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221028174555381.png)

#### 系统配置

配置全局设备和路径：点击 Dashboard -> 系统管理 -> 系统配置 -> 系统配置。

添加以下两个配置：

* SSH remote hosts
* SSH Servers

SSH remote hosts 填写信息：

* Hostname：远程服务器 IP 地址；
* Port：远程服务器端口；
* Credentials：登录任据，即前面【管理凭据】添加好的凭据，也可以通过【+ 添加】新增。

![image-20221027184202017](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027184202017.png)

SSH Servers 填写信息：

* Name：服务器名称；
* Hostname：服务器 IP 地址；
* Username：服务器登录的用户名；
* Remove Directory：服务器 Jenkins 容器映射到主机的目录；

![image-20221027184325263](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027184325263.png)

#### 全局工具配置

这里其实就是配置一些项目中需要用到的环境，如 JDK、Maven、NodeJS 等等：点击 Dashboard -> 系统管理 -> 系统配置 -> 全局工具配置。

![image-20221026182408380](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221026182408380.png)

#### 创建任务

创建一个 Jenkins 任务：点击 Dashboard -> 新建任务。

![image-20221027090438007](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027090438007.png)

Jenkins 任务配置：

- General：可不填，一些常规信息。

- 源码管理：必填，源码的仓库地址和凭据（前面管理任据中新增的凭据）。

- 构建触发器：可不填，建议勾选【GitHub hook trigger for GITScm polling】，用于 Jenkins 自动部署。

- 构建环境：必填。比如，构建前端 Vue 项目需要 NodeJS 环境。这里勾选 【Provide Node & npm bin/ folder to PATH】（如果没有该选项，可能是没有安装 NodeJs 插件或者没有在【全局工具配置】中配置 NodeJs 环境。

- Build Steps：必填，选择需要的构建步骤。这里我们选择简单的 【执行 shell】选项，填入 shell 命令，比如前端项目常用的，npm run build。

  ```shell
  # 示例1
  cd vue-cli-template
  echo $WORKSPACE
  echo $BRANCH_NAME
  node -v
  npm -v
  npm i
  npm run build
  ```

  ```shell
  # 示例2
  cd /
  rm -r -f html/vue-cli-template
  mkdir html/vue-cli-template
  cp -r /var/jenkins_home/workspace/vue-cli-template/vue-cli-template/dist/* /html/vue-cli-template
  ```

- 构建后操作：可不填，定义构建后的操作。

![image-20221027091934009](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027091934009.png)

![image-20221027092016915](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027092016915.png)

![image-20221027092050349](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027092050349.png)

![image-20221027193257671](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027193257671.png)

点击【保存】后，返回主机查看任务列表，点击任务右侧的箭头按钮可以构建项目。

![image-20221027092722144](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027092722144.png)

### Nginx

Nginx 是一款轻量级的 Web 服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。

类型的还有 Apache 、Apache下的顶级项目 Tomcat、微软的 IIS。不同服务器的侧重点是不同的，比如，Tomcat 是一个开放源代码、运行 servlet 和 JSP Web 应用软件的基于 Java 的 Web 应用软件容器。

#### 安装镜像

在主机终端执行以下命令，搜索 Nginx 镜像：

```shell
docker search nginx
```

在主机终端执行以下命令，拉取 Nginx 镜像：

```shell
docker pull nginx
```

#### 启动容器

启动过程与前面【启动 Jenkins 容器】类似，同样要注意加了 -v 参数，需要确保主机和容器目录映射后不会删除 Nginx 运行的配置文件。

启动步骤：

* 只配置容器名称和端口，启动 Nginx 容器。

  ```shell
  docker run -uroot -d --restart=always --privileged=true -p 9100:80 --name nginx nginx:latest
  ```

* 在主机终端执行复制命令，将容器内需要映射的目录和文件复制到主机挂载卷。

  ```shell
  docker cp nginx:/etc/nginx $HOME/Documents/docker/nginx
  docker cp nginx:/usr/share/nginx/html $HOME/Documents/docker/html
  ```

* 删除容器，然后，配置容器名称和端口 + -v 参数，重新启动 Nginx 容器。

  ```shell
  docker run -uroot -d --restart=always --privileged=true -p 9100:80 -v $HOME/Documents/docker/web:/usr/share/nginx/html --name nginx nginx:latest
  ```

打开 http://localhost:9100，访问 Nginx 主页。

#### 配置文件

现在我们可以在主机路径下，修改 Nginx 配置文件：

```shell
$HOME/Documents/docker/nginx/nginx.conf
$HOME/Documents/docker/nginx/conf.d/default.conf
```

**备注：** 配置文件修改后，Nginx 需要重启一下，不然不生效。

配置文件示例：

```shell
# nginx.conf
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    keepalive_timeout  65;
    #gzip  on;
    include /etc/nginx/conf.d/*.conf;
}
```

```shell
# default.conf
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    
    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```

### Jenkins 自动构建

向 GitHub push 代码后，触发 Jenkins 构建。

**特别注意：** GitHub 配置 Jenkins 自动构建，必需有外网可访问的 Jenkins 地址。

#### GitHub 上配置 Jenkins 的 webhook

webhook 是通知 Jenkins 时的请求地址，用来填写到 GitHub 上，这样 GitHub 就能通过该地址通知到 Jenkins。

webhook 地址是：[jenkins URL] + github-webhook。假设 Jenkins 的地址是：192.168.188.98:9002，则该地址就是 http://192.168.188.98:9002/github-webhook。

![image-20221027093201730](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027093201730.png)

**特别注意：** Payload URL 必须是外网能访问的地址，否则 GitHub 无法访问到 Jenkins。

#### GitHub 上创建一个 access token

Jenkins 的一些需要权限的操作用这个 access token 去鉴权。

点击 GitHub 网站的个人设置：Settings -> Developer settings -> Personal access tokens -> Tokens(classic) ->  Generate new Tokens -> Generate new Tokens(classic)。

![image-20221027093558437](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027093558437.png)

![image-20221027094407451](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027094407451.png)

选择需要的权限（如，repo、admin:repo_hook），然后点击【Generate token】。创建成功后，**记得保存 token**，刷新页面以后就找不到了。

#### 修改 Jenkins 配置

先修改系统配置，点击 Dashboard -> 系统管理 -> 系统配置 -> GitHub -> 添加 Github 服务器 -> 凭据【新增】，填入刚才生成的 token，勾上【管理 Hook】，点击 【连接测试】，最后点击【保存】。

![image-20221027095139661](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027095139661.png)

![image-20221027095554947](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027095554947.png)

然后修改任务配置，在任务列表中找到对应的任务，点击【配置】，修改：

* 构建触发器：GitHub hook trigger for GITScm polling 勾上。
* 构建环境：Use secret text(s) or file(s) 勾上 -> 新增 -> Secret text。

![image-20221027100914767](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images/image-20221027100914767.png)

完成配置。今后只要该项目 push 源码，GitHub 就会向此 webhook 地址发请求，通知 Jenkins 构建。

### 参考资料

[Docker 官方文档](https://docs.docker.com/)

[Docker —— 从入门到实践](https://yeasy.gitbook.io/docker_practice/install/mac)

[Jenkins 用户手册](https://www.jenkins.io/zh/doc/)

[前端工程化之 CI/CD](https://xuezenghui.com/posts/gitlab-ci-cd/)

[知乎 - 谁能介绍下web前端工程化？](https://www.zhihu.com/question/24558375)

[稀土掘金 - Jenkins + Docker + Github 实现自动化部署 Maven 项目](https://juejin.cn/post/7127302949797101604#heading-23)

[稀土掘金 - Docker 安装 Nginx 部署前端项目](https://juejin.cn/post/7126146371198910478)

[稀土掘金 - Jenkins + Github + Nginx 自动化部署 Vue 项目](https://juejin.cn/post/7127671229707714591#heading-12)
