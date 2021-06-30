## Git Bash中文乱码.

### git status不能显示中文
git status查看有改动但未提交的文件时总只显示数字串(八进制的字符编码)，显示不出中文文件名。

#### 修改git 配置文件

编辑`%GIT_HOME%\etc\gitconfig`文件，也有些windows系统是存放在`C:\Users\Administrator\.gitconfig`路径或`安装盘符:\Git\mingw64\etc\gitconfig`，在文件末尾增加以下内容：

```shell
[core]
    quotepath = false 
    # status引用路径不再是八进制（反过来说就是允许显示中文了）
```

#### 命令行执行

git bash 终端输入命令：`git config --global core.quotepath false`



### git log 出现乱码

#### 修改git 配置文件

编辑`%GIT_HOME%\etc\gitconfig`文件，也有些windows系统是存放在`C:\Users\Administrator\.gitconfig`路径或`安装盘符:\Git\mingw64\etc\gitconfig`，在文件末尾增加以下内容：

```shell
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

修改`%GIT_HOME%\etc\profile`文件，加入如下内容：

```shell
export LESSCHARSET=utf-8
# 注意：一般来说export LESSCHARSET的值就是utf-8,如果profile文件中没有这一项，请加入。
```

#### 命令行执行

* `git config --global gui.encoding utf-8`
* `git config --global i18n.commitencoding utf-8`
* `git config --global i18n.logoutputencoding gbk`
* 使得 `git log` 可以正常显示中文（配合`i18n.logoutputencoding = gbk`)，在 `/etc/profile` 中添加：`export LESSCHARSET=utf-8`



### vi/vim 查看有中文的文件乱码

修改 `%GIT_HOME%\share\vim\vimrc`文件,在文件末尾加入如下内容:

```shell
set fileencodings=utf-8,ucs-bom,cp936,big5
set fileencoding=utf-8
set termencoding=gbk
```



### 输入中文后出现乱码

修改`%GIT_HOME%\etc\inputrc`文件，加入：

```shell
set output-meta on
set convert-meta off
```



### git bash中使用ls命令乱码

在git bash中使用ls命令的时候，如果目录和文件带有中文，则会出现乱码，编辑`etc\git-completion.bash`文件,在文件末尾增加以下内容：

```shell
#让ls命令能够正常显示中文
alias ls='ls --show-control-chars --color=auto' 
```



### `ipconfig`、`systeminfo`乱码

* 这是因为命令行的解释说明的中文字符使用的是GBK码，当前的git bash text设置是默认的utf-8码

  **解决：**打开GitBash（git-bash.exe），对窗口右键 -> Options -> Text -> Locale改为zh_CN，Character set改为GBK ；键入exit退出关闭再打开就Okay啦

* 在GBK基础上使用ls命令行，发现中文文件夹名有乱码，是由于系统命名文件夹时使用的是utf-8

  **解决：**按上面流程，改成utf-8

* **由于这种随时因各对象字符编码不同造成的乱码，只能使用时自行在option中更改编码类型**