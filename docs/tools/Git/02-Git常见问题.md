## Git常见问题

### Git速度太慢问题

git clone 或者 git push 特别慢，并不是因为 **[http://github.com](https://links.jianshu.com/go?to=http%3A%2F%2Fgithub.com)** 的这个域名被限制了。而是 **[http://github.global.ssl.fastly.Net](https://links.jianshu.com/go?to=http%3A%2F%2Fgithub.global.ssl.fastly.Net)** 这个域名被限制了。

#### hosts文件绑定映射(亲测有效)

**域名解析过程：** 用户从浏览器中输入 `github.com` 网址时，浏览器并不知道域名对应的真实 IP 地址，它先询问本主机是否认识该域名，如果本主机不认识，会去询问当地运营商，如果运营商也不认识，再继续询问上级，直到问域名的真实 IP 地址为止！

hosts 是本地的一个域名映射文件，它可以直接告诉浏览器域名对应的 IP 地址。这样可以省略域名解析过程，优化访问速度。

首先，在第三方网站（如：[https://www.ipaddress.com/](https://www.ipaddress.com/)、[http://tool.chinaz.com/dns/](http://tool.chinaz.com/dns/)）查询 `github.global.ssl.fastly.net`、`github.com` 两个域名的 IP。

**注意：** 大型网站服务器都不会是只有一台服务器，而是多台服务器组成的集群一起对外提供服务。我们应该先选用就近的服务器。

其次，修改 hosts 文件。

```shell
199.232.69.194 github.global.ssl.fastly.net
140.82.113.4 github.com
```

最后，清除DNS缓存。详见[修改hosts文件](https://app.gitbook.com/s/-M8fDLTBWl2H-MOzligj/bugs/99-qi-ta-wen-ti-hui-zong)

**效果：** 原速度约 10Kib/s，修改后 100Kib/s 以上。

#### github镜像 (亲测有效)

使用 github 镜像链接：

```shell
git clone https://github.com/xxx/xxx.git
# 需要 github.com 账号密码登录
git clone https://github.com.cnpmjs.org/xxx/xxx.git
```

**效果：** 原速度约 10Kib/s，替换后 500~800KiB/s。

#### 重置本地接收缓存

```shell
# 10485760 (10MB)
git config --global http.postBuffer 10485760`
```

Git 文档中已有对该字段的[说明](https://git-scm.com/docs/git-config#Documentation/git-config.txt-httppostBuffer)，大意是：HTTP/1.1 协议的 `transfer-encoding: chunked` 头会将数据切块传输，每块数据一般默认不超过 1MB。通过 `http.postBuffer` 可以重置本地接收缓存的大小，也即每块数据的尺寸上限。

一般不推荐将这个值设置太大，因为这会显著地提高内存的消耗量。

#### 代理器：http[s].proxy

打开代理器，如：Shadowsocks，修改 Git 代理配置。

```shell
# 请注意：需要查看自己的端口是不是也是1080，可以打开你的代理器查看
# 请注意：该方法只对https协议有效，对SSH协议依旧无效
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080
```

```shell
git clone https://github.com/xxx/xxx.git
```

不推荐直接用全局代理。因为，这样 clone 国内仓库速度会变慢。可改用局部代理，即只代理 github。

```shell
git config --global http.https://github.com.proxy https://127.0.0.1:1080
git config --global https.https://github.com.proxy https://127.0.0.1:1080
```

### Git Bash中文乱码

##### Git status不能显示中文

修改 Git 配置文件：

```js
[core]
    quotepath = false 
```

或者终端输入命令：

```shell
git config --global core.quotepath false
```

##### Git log出现乱码

修改 Git 配置文件：

```shell
[gui]  
    encoding = utf-8  
[i18n]  
    commitencoding = utf-8  
[svn]  
    pathnameencoding = utf-8  
```

或者终端输入命令：

```shell
git config --global gui.encoding utf-8
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding gbk
```

修改 `%GIT_HOME%\etc\profile` 文件，新增：

```shell
export LESSCHARSET=utf-8
```

##### vi/vim查看有中文的文件乱码

修改 `%GIT_HOME%\share\vim\vimrc` 文件，在文件末尾加入：

```shell
set fileencodings=utf-8,ucs-bom,cp936,big5
set fileencoding=utf-8
set termencoding=gbk
```

##### 输入中文后出现乱码

修改 `%GIT_HOME%\etc\inputrc` 文件，在文件末尾加入：

```shell
set output-meta on
set convert-meta off
```

##### ls命令输出乱码

在 `git bash` 中使用 `ls` 命令的时，如果目录和文件带有中文，则会出现乱码。

编辑 `etc\git-completion.bash` 文件，在文件末尾增加以下内容：

```shell
alias ls='ls --show-control-chars --color=auto' 
```

##### ipconfig、systeminfo乱码

命令行的解释说明的中文字符使用的是 GBK 码，而当前的 git bash text 设置是默认的 utf-8 码。

**解决：**打开 GitBash（git-bash.exe），对窗口 `右键 -> Options -> Text -> Locale` 改为 `zh_CN`，`Character set` 改为 `GBK` 。

在 GBK 基础上使用 ls 命令行，发现中文文件夹名有乱码，是由于系统命名文件夹时使用的是 utf-8。

**解决：**按上面流程，改成 `utf-8`。

**由于这种随时因各对象字符编码不同造成的乱码，只能使用时自行在option中更改编码类型**

### github SSH

`SSH`是 `Secure Shell` 的缩写，是一个应用层的加密网络协议，它不只可以用于远程登录、远程命令执行，还可用于数据传输。使用`SSH `协议可以连接远程服务器和服务并向它们验证。 利用 `SSH `密钥可以连接 `GitHub`，而无需在每次访问时提供用户名或密码。

[检查是否已有 SSH 密钥](https://help.github.com/cn/github/authenticating-to-github/checking-for-existing-ssh-keys)：

```shell
# 默认情况下，公钥的文件名是以下之一：id_rsa.pub、id_ecdsa.pub、id_ed25519.pub
ls -al ~/.ssh
```

[生成新 SSH 密钥](https://help.github.com/cn/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)：

```shell
# 创建以电子邮件为标签的新 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# -b 指定密钥长度
# -e 读取已有私钥或者公钥文件
# -f 指定用来保存密钥的文件名
# -t 指定要创建的密钥类型
# -C 添加注释
```

会提示您 `Enter a file in which to save the key`（输入要保存密钥的文件）时，按 Enter 键；再在提示时输入安全密码，也可以直接按 Enter 键（即密码为空）。 

[将 SSH 密钥添加到 ssh-agent](https://help.github.com/cn/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)：

先启动 ssh-agent，再将 SSH 私钥添加到 ssh-agent。

```shell
# 启动 ssh-agent：以 Git for Windows 终端为例
eval $(ssh-agent -s)
# Agent pid 2629
```

```shell
# 将 SSH 私钥添加到 ssh-agent。id_rsa是密钥文件名称，可自行指定
ssh-add ~/.ssh/id_rsa
```

[新增 SSH 密钥到 GitHub 帐户](https://help.github.com/cn/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)：

将 SSH 密钥复制到剪贴板。在复制密钥时，请勿添加任何新行或空格。

```shell
# 如果 pbcopy 不可用，可找 ~/.ssh/id_rsa.pub 文件直接复制
pbcopy < ~/.ssh/id_rsa.pub
```

登录 github.com 网站，访问：头像 -> Settings -> SSH and GPG keys  -> SSH keys，点击 New SSH key，自定义 title，将复制的密钥粘贴到 key 区域。

[测试 SSH 连接](https://help.github.com/cn/github/authenticating-to-github/testing-your-ssh-connection)：

```shell
ssh -T git@github.com
```

如果看到类似如下的警告：

```shell
> The authenticity of host 'github.com (IP ADDRESS)' can't be established.
> RSA key fingerprint is SHA256:nThbg6kXUpJsWGl7E1IGOCspRomxdCARLviKw6E5SY8.
> Are you sure you want to continue connecting (yes/no)?
```

验证所看到消息中的指纹是否匹配 [GitHub 的 RSA 公钥指纹](https://docs.github.com/cn/github/authenticating-to-github/githubs-ssh-key-fingerprints)。 如果是，则输入 `yes`。

连接成功，显示：

```shell
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

[使用 SSH 密钥密码](https://help.github.com/cn/github/authenticating-to-github/working-with-ssh-key-passphrases)：

您可以保护 SSH 密钥并配置身份验证代理，这样您就不必在每次使用 SSH 密钥时重新输入密码。

使用 SSH 密钥时，如果有人获得您计算机的访问权限，他们也可以使用该密钥访问每个系统。 要添加额外的安全层，可以向 SSH 密钥添加密码。 您可以使用 `ssh-agent` 安全地保存密码，从而不必重新输入。

通过输入以下命令，您可以更改现有私钥的密码而无需重新生成密钥对：

```shell
$ ssh-keygen -p
# Start the SSH key creation process
> Enter file in which the key is (/Users/you/.ssh/id_rsa): [Hit enter]
> Key has comment '/Users/you/.ssh/id_rsa'
> Enter new passphrase (empty for no passphrase): [Type new passphrase]
> Enter same passphrase again: [One more time for luck]
> Your identification has been saved with the new passphrase.
```

如果您的密钥已有密码，系统将提示您输入该密码，然后才能更改为新密码。

### 配置对比工具后，为什么打开是空白的？

**场景：** 用如下命令添加对比工具配置：

```shell
git config --local difftool.bc4.cmd "\"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"$LOCAL\" \"$REMOTE\""
```

然后，执行 `git difftool`，Beyond Compare 成功打开了，但是没有对比文件，两边对比区域都是空白的。

**原因：**  `\"$LOCAL\" \"$REMOTE\"` 字符解析问题。在执行配置命令时，SHELL 将这两个带 `$` 的字符串当成环境变量解析了，而系统中没有这两个环境变量，最终解析为空字符。最终 `config` 配置结果如下：

```shell
[diff]
	tool = bc4
[difftool "bc4"]
	cmd = \"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"\" \"\"
```

**解决方法：** 在 `$` 字符前加转义符 `\`。

```shell
git config --local difftool.bc4.cmd "\"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"\$LOCAL\" \"\$REMOTE\""
```

或者直接打开 `config` 文件，添加配置：

```shell
[diff]
	tool = bc4
[difftool "bc4"]
	cmd = \"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"$LOCAL\" \"$REMOTE\"
[difftool]
```

### git merge 和 git rebase 的区别

git rebase 和 git merge 做的事其实是一样的。它们都被设计来将一个分支的更改并入另一个分支，但是他们采取不同的工作方式。

#### git merge

当用 git merge 合并 A、B 分支时（如：当前分支 A，执行 `git merge  B`），先进行一个三方比对（A 分支节点代码、B 分支节点代码、两者共同的父节点代码，如果两者没有共同的父节点将出现异常），对比 A 与父节点的差异，对比 B 与父节点的差异，合并双方差异即可。

如果有相同位置的差异则是冲突！

**合并后的 commit 的记录将会按时间点统一汇总**（即是A、B 支合并后 commit 在一条线上以时间先后顺序排在一起。

**其优点是：**所有分支的 commit 记录清晰可见，便于查看历史记录的变更和回滚到任意记录点。

**其缺点是：**commit 记录过多，合并记录会造成分支线错综复杂。

#### git rebase

**切记！不要在公共分支上做 rebase!!!**

rebase 顾名思义 re-base —— 重定基准。

当用 git rebase 合并 A、B 分支时（如：当前分支 A，执行 `git rebase B`），首先会把 B 的代码依次合并到 A 分支来，如果有冲突则依次解决。因为不像 git merge 一样一次合并统一解决冲突，所以可能需要多次解决。

B 分支同步合并到 A 分支后，A 分支的基准已修改为已 B 分支的最新记录。而且 A 分支还在暂存区的 commit 记录 hash 值已变更，最终合并到 B 分支的最新记录后面。**commit 不会像 merge 一样 A、B 分支混排在一起。**

**其优点是：** 项目历史会非常整洁，项目历史提交记录呈现出完美的线性。
**其缺点是：** 安全性。改变了项目历史提交记的顺序，可能会给协作工作流带来灾难性的影响，而且 rebase 合并了提交后无法看到和上游并入的操作，也无法查找到某个历史节点的变更具体操作或者回退。

### git pull、git fetch、git remote update 的区别

**git pull：** 更新并合并您所在的当前分支的所有远程更改。事实上，是相当于从远程仓库获取最新版本，然后再与本地分支 merge（合并）。即相当于：`git pull = git fetch + git merge FETCH_HEAD ` 。 FETCH_HEAD 指的是：目前已经从远程仓库取下来的分支的最新版本。 

**git fetch：** 用法与 git pull 十分相似。区别是：git fetch 仅更新您所在的分支，而**不合并任何更改**。

```shell
# 将所有远程仓库分支更新到本地。如果本地没有对应分支，则创建本地分支并拉取代码
git fetch

# 指定远程仓库，不指定分支时通常默认为master
git fetch origin

# 指定远程仓库和分支
git fetch origin <branch>

# 本地新建 temp 分支，并将远程 origin 仓库的 master 分支代码下载到 temp
git fetch origin master:tmp 
```

**git remote update：** 更新所有与远程分支关联的本地分支，但不合并任何更改。

### git reset 和 git revert 的区别

git reset 和 git revert 都是用于回退 commit。它们的区别在于：

**git reset：** 回退 commit 后，会直接删除该 commit，git log 命令中不会有被回退的 commit 记录（注意：git reflog 命令中，还是可以查看到的）。

**git revert：** 回退是新建一个 commit，该 commit 与你回退后的 commit 的内容是一样的。

比如：当前分支有 commit 记录：`。。。-> A -> B`。执行 `git reset`，分支记录是：`。。。-> A`，B 被删除了；而执行 `git revert`，分支记录是：`。。。-> A -> B -> C`，其中 C 是新的 commit，其内容与 A 是一样的，可以理解为是 A 的复制。

### Git不同平台换行符问题

GNU/Linux 和 Mac OS 使用换行（LF）或新行作为行结束字符，而 Windows 使用换行和回车（LFCR）组合来表示行结束字符。

为了避免这些行结尾的差异的不必要提交，我们必须配置 Git 客户端写入与 Git 仓库使用相同的行结束符。

对于 Windows 系统，可以将 Git 客户端配置为将行结束符转换为 CRLF 格式，同时退出，并在提交操作时将其转换回 LF 格式。以下可根据您的需要来设置。

```shell
git config --global core.autocrlf true
```

对于 GNU/Linux 或 Mac OS，我们可以配置 Git 客户端，以便在执行结帐操作时将线结束从 CRLF 转换为 LF。

```shell
git config --global core.autocrlf input
```

- **true：** 自动完成标准化与转换
- **input：** 只做标准化操作，不做转换操作
- **false：** 提交与检出的代码都保持文件原有的换行符不变

### Git常见报错

### npm install报错

尝试清除 npm 缓存。

```shell
npm cache clean --force
```

#### qpacket_write_wait: Connection to 13.229.188.59 port 22: Broken pipe

```shell
remote: Enumerating objects: 283, done.
remote: Counting objects: 100% (283/283), done.
remote: Compressing objects: 100% (18/18), done.
qpacket_write_wait: Connection to 13.229.188.59 port 22: Broken pipe
fatal: the remote end hung up unexpectedly
fatal: early EOF
fatal: index-pack failed
```

git pull 或者 git push 时，出现 `packet_write_wait connection to xx.xx.xx.xx Broken pipe` 错误。这是超时或者 `SSH` 被强行中断引起的。

**解决方法：** 可以通过配置，让`SSH`保持连接。可以在服务端配置，让 `server ` 每隔30秒向 `client ` 发送一个 ` keep-alive` 包来保持连接。如果服务端没有权限配置，或者无法配置，可以配置客户端 `ssh`，使客户端发起的所有会话都保持连接。

**客户端配置：** 在 `~/.ssh/config`文件（若没有，就创建一个）中添加：

```shell
Host *
	# 让 server 每隔60秒向 client 发送一个 keep-alive 包来保持连接
	ServerAliveInterval 60
	# 如果发送 keep-alive 包数量达到 60 次，客户端依然没有反应，则服务端 sshd 断开连接
	ClientAliveCountMax 60
```

如果什么都不操作，该配置可以让连接保持 `60 * 60` ， `60min`。
