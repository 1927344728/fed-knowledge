## git报错

### qpacket_write_wait: Connection to 13.229.188.59 port 22: Broken pipe

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

`git pull `或者 `git push`时，出现`packet_write_wait connection to xx.xx.xx.xx Broken pipe`错误。

这是超时或者`SSH`被强行中断引起的。

##### 解决方法

可以通过配置，让`SSH`保持连接。可以在服务端配置，让 `server `每隔30秒向 `client `发送一个` keep-alive` 包来保持连接。如果服务端没有权限配置，或者无法配置，可以配置客户端 `ssh`，使客户端发起的所有会话都保持连接。

客户端配置：在 `~/.ssh/config`文件（若没有，就创建一个）中添加：

```shell
Host *
	#让 server 每隔30秒向 client 发送一个 keep-alive 包来保持连接
	ServerAliveInterval 60
	#如果发送 keep-alive 包数量达到 60 次，客户端依然没有反应，则服务端 sshd 断开连接
	ClientAliveCountMax 60
```

如果什么都不操作，该配置可以让连接保持 `60s * 60` ， `60min`。

### LF will be replaced by CRLF

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