## Git常见问题

### Git Bash中文乱码

#### Git status不能显示中文

git status 查看有改动但未提交的文件时总只显示数字串(八进制的字符编码)，显示不出中文文件名。

* **修改git 配置文件：** 编辑 `%GIT_HOME%\etc\gitconfig` 文件，也有些 windows 系统是存放在`C:\Users\Administrator\.gitconfig`路径或`安装盘符:\Git\mingw64\etc\gitconfig`，在文件末尾增加以下内容：

  ```js
  [core]
      quotepath = false 
      # status引用路径不再是八进制（反过来说就是允许显示中文了）
  ```

* **命令行执行：** git bash 终端输入命令：`git config --global core.quotepath false`

#### Git log出现乱码

* **修改 git 配置文件：** 编辑 `%GIT_HOME%\etc\gitconfig` 文件，也有些 windows 系统是存放在`C:\Users\Administrator\.gitconfig` 路径或 `安装盘符:\Git\mingw64\etc\gitconfig`，在文件末尾增加以下内容：

  ```js
  [gui]  
      encoding = utf-8  
      # 代码库统一使用utf-8  
  [i18n]  
      commitencoding = utf-8  
      # log编码  
  [svn]  
      pathnameencoding = utf-8  
      # 支持中文路径  
  ```

  修改 `%GIT_HOME%\etc\profile` 文件，加入如下内容：

  ```js
  export LESSCHARSET=utf-8
  # 注意：一般来说export LESSCHARSET的值就是utf-8,如果profile文件中没有这一项，请加入。
  ```

* 命令行执行
  * `git config --global gui.encoding utf-8`
  * `git config --global i18n.commitencoding utf-8`
  * `git config --global i18n.logoutputencoding gbk`，在 `/etc/profile` 中添加：`export LESSCHARSET=utf-8`

#### vi/vim查看有中文的文件乱码

修改 `%GIT_HOME%\share\vim\vimrc` 文件,在文件末尾加入如下内容:

```shell
set fileencodings=utf-8,ucs-bom,cp936,big5
set fileencoding=utf-8
set termencoding=gbk
```

#### 输入中文后出现乱码

修改 `%GIT_HOME%\etc\inputrc` 文件，加入：

```shell
set output-meta on
set convert-meta off
```

#### git bash中使用ls命令乱码

在 `git bash` 中使用 `ls` 命令的时候，如果目录和文件带有中文，则会出现乱码，编辑 `etc\git-completion.bash` 文件，在文件末尾增加以下内容：

```shell
#让ls命令能够正常显示中文
alias ls='ls --show-control-chars --color=auto' 
```

#### ipconfig、systeminfo乱码

* 这是因为命令行的解释说明的中文字符使用的是GBK码，当前的 git bash text 设置是默认的 utf-8 码。

  **解决：**打开 GitBash（git-bash.exe），对窗口 `右键 -> Options -> Text -> Locale` 改为 `zh_CN`，`Character set` 改为 `GBK` ；键入exit 退出关闭再重新打开。

* 在 GBK 基础上使用 ls 命令行，发现中文文件夹名有乱码，是由于系统命名文件夹时使用的是 utf-8。

  **解决：**按上面流程，改成utf-8

* **由于这种随时因各对象字符编码不同造成的乱码，只能使用时自行在option中更改编码类型**



### github SSH

`SSH`是 `Secure Shell` 的缩写，是一个应用层的加密网络协议，它不只可以用于远程登录、远程命令执行，还可用于数据传输。当然它由 `ssh Client` 和 `ssh Server` 端组成，有很多实现，`Ubuntu` 上就默认安装的 `OpenSSH`， `Client` 端叫做 `ssh`， `Server` 端叫做`sshd`。`OpenSSH` 只用来做远程登录和命令执行。

使用`SSH `协议可以连接远程服务器和服务并向它们验证。 利用 `SSH `密钥可以连接 `GitHub`，而无需在每次访问时提供用户名或密码。

以下命行中 Git Bash 中执行：

#### [检查现有 SSH 密钥](https://help.github.com/cn/github/authenticating-to-github/checking-for-existing-ssh-keys)

输入 `ls -al ~/.ssh` 以查看是否存在现有 SSH 密钥：

```shell
$ ls -al ~/.ssh
# 列出 .ssh 目录中的文件（如果有）
```

> 检查目录列表以查看是否已经有 SSH 公钥。 默认情况下，公钥的文件名是以下之一：*id_rsa.pub*、*id_ecdsa.pub*、*id_ed25519.pub*


#### [生成新 SSH 密钥](https://help.github.com/cn/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)

粘贴下面的文本（替换为您的 GitHub 电子邮件地址）。

```shell
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

* 这将创建以所提供的电子邮件地址为标签的新 SSH 密钥。
* 提示您“Enter a file in which to save the key（输入要保存密钥的文件）”时，按 Enter 键。 这将接受默认文件位置。
* 在提示时输入安全密码（可以为空，直接【enter】）。 

#### [将 SSH 密钥添加到 ssh-agent](https://help.github.com/cn/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)

如果已安装 [GitHub Desktop](https://desktop.github.com/)，可使用它克隆仓库，而无需处理 SSH 密钥。 它还附带 Git Bash 工具，这是在 Windows 上运行 `git` 命令的首选方法。

1. 确保 ssh-agent 正在运行：

   - 如果您使用随 GitHub Desktop 一起安装的 Git Shell，则 ssh-agent 应该正在运行。

   - 如果您使用的是其他终端提示符，例如 Git for Windows，您可以根据“使用 SSH 密钥密码”中的“自动启动 ssh-agent”说明进行操作，或者手动启动它：

     ```shell
     # 在后台启动 ssh-agent
     $ eval $(ssh-agent -s)
     > Agent pid 59566
     ```

2. 将 SSH 私钥添加到 ssh-agent。 如果您创建了不同名称的密钥，或者您要添加不同名称的现有密钥，请将命令中的 *id_rsa* 替换为您的私钥文件的名称。

   ```shell
   $ ssh-add ~/.ssh/id_rsa
   ```

3. [将 SSH 密钥添加到 GitHub 帐户](https://help.github.com/cn/articles/adding-a-new-ssh-key-to-your-github-account)。

#### [新增 SSH 密钥到 GitHub 帐户](https://help.github.com/cn/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

1. 将 SSH 密钥复制到剪贴板。在复制密钥时，请勿添加任何新行或空格。

   ```shell
   $ pbcopy < ~/.ssh/id_rsa.pub
   # 如果 `pbcopy` 不可用，可找到隐藏的 `.ssh` 文件夹，在常用的文本编辑器中打开该文件，并将其复制到剪贴板。
   ```

2. 在github.com中：个人资料 -> **Settings（设置）** -> **SSH and GPG keys（SSH 和 GPG 密钥）** -> **New SSH key（新 SSH 密钥）**或 **Add SSH key（添加 SSH 密钥）**。

3. 在 "Title"（标题）字段中，为新密钥添加描述性标签。将密钥粘贴到 "Key"（密钥）字段。单击 **Add SSH key（添加 SSH 密钥）**。

4. 如有提示，请确认您的 GitHub 密码。

#### [测试 SSH 连接](https://help.github.com/cn/github/authenticating-to-github/testing-your-ssh-connection)

1. 打开 Terminal（终端）Terminal（终端）Git Bash。

2. 输入以下内容：

   ```shell
   $ ssh -T git@github.com
   # 对 GitHub 尝试 ssh
   ```

   您可能会看到类似如下的警告：

   ```shell
   > The authenticity of host 'github.com (IP ADDRESS)' can't be established.
   > RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
   > Are you sure you want to continue connecting (yes/no)?
   ```

   或类似如下：

   ```shell
   > The authenticity of host 'github.com (IP ADDRESS)' can't be established.
   > RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
   > Are you sure you want to continue connecting (yes/no)?
   ```

3. 验证您看到的消息中的指纹匹配步骤 2 中的消息之一，然后输入 `yes`：

   ```shell
   > Hi username! You've successfully authenticated, but GitHub does not
   > provide shell access.
   ```


#### **[使用 SSH 密钥密码](https://help.github.com/cn/github/authenticating-to-github/working-with-ssh-key-passphrases)**

您可以保护 SSH 密钥并配置身份验证代理，这样您就不必在每次使用 SSH 密钥时重新输入密码。

使用 SSH 密钥时，如果有人获得您计算机的访问权限，他们也可以使用该密钥访问每个系统。 要添加额外的安全层，可以向 SSH 密钥添加密码。 您可以使用 `ssh-agent` 安全地保存密码，从而不必重新输入。

[添加或更改密码](https://help.github.com/cn/github/authenticating-to-github/working-with-ssh-key-passphrases#adding-or-changing-a-passphrase)

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



### git常见错误

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

##### 问题描述

`git pull ` 或者 `git push`时，出现 `packet_write_wait connection to xx.xx.xx.xx Broken pipe` 错误。

这是超时或者 `SSH` 被强行中断引起的。

##### 解决方法

可以通过配置，让`SSH`保持连接。可以在服务端配置，让 `server ` 每隔30秒向 `client ` 发送一个 ` keep-alive` 包来保持连接。如果服务端没有权限配置，或者无法配置，可以配置客户端 `ssh`，使客户端发起的所有会话都保持连接。

客户端配置：在 `~/.ssh/config`文件（若没有，就创建一个）中添加：

```shell
Host *
	#让 server 每隔30秒向 client 发送一个 keep-alive 包来保持连接
	ServerAliveInterval 60
	#如果发送 keep-alive 包数量达到 60 次，客户端依然没有反应，则服务端 sshd 断开连接
	ClientAliveCountMax 60
```

如果什么都不操作，该配置可以让连接保持 `60s * 60` ， `60min`。

#### LF will be replaced by CRLF

`CRLF`, `LF `是用来表示文本换行的方式。`CR(Carriage Return) `代表回车，对应字符 `'\r'`；`LF(Line Feed) `代表换行，对应字符 `'\n'`。由于历史原因，不同的操作系统文本使用的换行符各不相同。主流的操作系统一般使用`CRLF`或者`LF`作为其文本的换行符。其中，`Windows `系统使用的是 `CRLF`，对应字符`\r\n`,  `Unix`系统(包括`Linux`, `MacOS`近些年的版本) 使用的是`LF`。

`git`工作区默认为`CRLF`来作为换行符。如果项目文件里有用`LF`作为换行符，`git add` 或`git commit`的时候就会弹出警告，当最终`push`到远程仓库的时候`git`会统一格式全部转化为用`CRLF`作为换行符。

##### 解决方法

Git 提供了一个名为 `core.autocrlf` 的配置，可以自动完成标准化与转换。它的设置方式如下：

```shell
git config --global core.autocrlf  [true | input | false]  # 全局设置
git config --local core.autocrlf  [true | input | false] # 针对本项目设置
```

- **true** 自动完成标准化与转换
- **input** 只做标准化操作，不做转换操作
- **false** 提交与检出的代码都保持文件原有的换行符不变