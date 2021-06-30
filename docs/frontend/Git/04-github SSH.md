## github SSH

`SSH`是`Secure Shell`的缩写，是一个应用层的加密网络协议，它不只可以用于远程登录、远程命令执行，还可用于数据传输。当然它由`ssh Client`和`ssh Server`端组成，有很多实现，`Ubuntu`上就默认安装的`OpenSSH`， `Client`端叫做`ssh`， `Server`端叫做`sshd`。`OpenSSH`只用来做远程登录和命令执行。

使用`SSH `协议可以连接远程服务器和服务并向它们验证。 利用 `SSH `密钥可以连接 `GitHub`，而无需在每次访问时提供用户名或密码。



以下命行中Git Bash中执行：

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
