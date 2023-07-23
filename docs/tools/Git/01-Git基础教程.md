## Git基础教程

### Git是什么？

Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。

Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

Git 与常用的版本控制工具 CVS，Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。



### Git安装和基本配置

**安装：** [下载git windows版](https://gitforwindows.org/)

Git 提供了一个叫做 git config 的工具，专门用来配置或读取相应的工作环境变量。

这些环境变量，决定了 Git 在各个环节的具体工作方式和行为。这些变量可以存放在以下三个不同的地方：

- **/etc/gitconfig 文件：** 系统中对所有用户都普遍适用的配置。若使用 `git config` 时用 `--system` 选项，读写的就是这个文件。
- **~/.gitconfig 文件：** 用户目录下的配置文件只适用于该用户。若使用 `git config` 时用 `--global` 选项，读写的就是这个文件。
- **.git/config 文件：** 当前项目的 Git 目录中的配置文件。这里的配置仅仅针对当前项目有效。若使用 `git config` 时用 `--local` 选项，读写的就是这个文件。

每一个级别的配置都会覆盖上层的相同配置，所以` .git/config` 里的配置会覆盖 `/etc/gitconfig `中的同名变量。

在 Windows 系统上，Git 会找寻用户主目录下的 `.gitconfig` 文件。主目录即 $HOME 变量指定的目录，一般都是 `C:\User\$USER`。

此外，Git 还会尝试找寻 `/etc/gitconfig` 文件，只不过看当初 Git 装在什么目录，就以此作为根目录来定位。

**查看配置：**

```shell
git config -l

git config --system -l
git config --global -l
# user.email=用户电子邮箱
# user.name=用户名
# core.quotepath=false
# core.aurocrlf=true
# core.autocrlf=true
# core.autocrl=true
# gui.encoding=utf-8
# i18n.commitencoding=utf-8
# i18n.logoutputencoding=utf-8
git config --local -l
git config --global user.name
```

```shell
# 修改配置
git config --global user.email 'newEmail@example.com'

# 删除配置
git config --global --unset user.email
```

**配置编缉器：** 可以配置默认的文本编辑器，Git 在需要你输入一些消息时会使用该文本编辑器。缺省情况下，Git 使用系统的缺省编辑器，这通常可能是 vi 或者 vim 。

```shell
git config --global core.editor emacs
```

**配置比较工具：**

```shell
git config --global merge.tool vimdiff
```

Git 可以接受 kdiff3、tkdiff、meld、xxdiff、emerge、vimdiff、gvimdiff、ecmerge 和 opendiff 作为有效的合并工具。

**配置客户端对比工具：**

```shell
# 将bc4设置为默认difftool
git config --local diff.tool bc4  
git config --local difftool.bc4.cmd "\"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"\$LOCAL\" \"\$REMOTE\""
git config --local difftool.prompt false

# 将bc4设置为默认mergetool
git config --global merge.tool bc4
git config --global mergetool.bc4.cmd "\"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"\$LOCAL\" \"\$REMOTE\" \"\$BASE\" \"\$MERGED\""
# 退出bc4时完成merge
git config --global mergetool.bc4.trustExitCode true
git config --global mergetool.prompt false
git config --global mergetool.keepBackup false
```

说明：`"\"C:\\Program Files\\Beyond Compare 4\\BCompare.exe\" \"\$LOCAL\" \"\$REMOTE\""`

表示找到可执行文件 `BCompare.exe` ，传递两个参数，开始运行软件。可执行文件路径后面是两个参数，用空格分开。`\"、\$` 是对字符的转义。

* 第一个表示调用可执行文件的路径；
* 第二个 `$LOCAL` 表示远程文件临时存储在本地的路径；
* 第三个 `$REMOTE` 表示去拿当前需要比较的文件。

最后，用 `git difftool` 代替 `git diff` 命令。



### Git基本概念

#### Git的四个区域

- **工作区：** 就是平时存放项目代码的目录；
- **暂存区：** 用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息。一般存放在 `.git` 目录下的 index 文件（`.git/index`）中，所以我们把暂存区有时也叫作索引（index）；
- **版本库或本地仓库：** 本地的一个目录，有一个隐藏目录 `.git`；
- **远程仓库：** 托管代码的服务器。如：gitlab、github 等。

#### 文件的四种状态

- **未跟踪：** 此文件在文件夹中，但并没有加入到仓库, 不参与版本控制。
- **未修改：** 文件已经入库，且工作区的文件与版本库中的文件快照内容完全一致。这种类型的文件有两种去处：被修改，变为已修改状态；被删除，变为未跟踪状态。
- **已修改：** 文件仅仅是修改，修改内容还在工作区。这个文件也有两个去处：通过 git add 进入暂存区，变为暂存状态；使用 git checkout，丢弃修改过，返回未修改状态。
- **暂存状态：** 文件存放在暂存区。执行 `git commit` 则将修改同步到本地仓库中。这时本地仓库中的文件和工作区文件又变为一致，文件为未修改状态。执行 git reset HEAD 会取消暂存，返回修改状态。

#### Git工作流程

- 创建或克隆 Git 仓库；
- 在工作区添加、修改文件；
- 将工作区文件放入暂存区；
- 将暂存区文件提交到本地仓库；
- 将本地仓库文件提交到远程仓库。



### 创建仓库

#### 新建一个仓库

**语句：** `git init`

Git 使用 `git init` 命令来初始化一个 Git 仓库，Git 的很多命令都需要在 Git 的仓库中运行，所以 `git init` 是使用 Git 的第一个命令。

首先需要进入项目目录，不同系统上的做法有些不同：

- 在 Linux 上：`$ cd /home/user/my_project`；

- 在 macOS 上：`$ cd /Users/user/my_project`；

- 在 Windows 上：`$ cd /c/user/my_project`。


`git init` 命令将创建一个名为 `.git` 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪。 

```shell
git init

# 指定目录作为Git仓库
git init [directory]
```

#### 克隆已有仓库

**语句：** `git clone `

```shell
git clone <repo> <directory>
```

创建一个本地或远程仓库的克隆版本：

```shell
git clone [local,/path/to/repository]
git clone [url,如https://github.com/1927344728/xxxx]
git clone [url,如https://github.com/1927344728/xxxx] [directory]  //自定义本地仓库的名字
```

默认会在当前目录下创建一个以被克隆仓库名一样的文件夹，文件夹包含一个 `.git` 子文件夹（存放远程仓库拉取下所有版本信息），以及仓库中所有文件。

Git 支持多种数据传输协议。 上面的例子使用的是 `https://` 协议，不过你也可以使用 `git://` 协议或者使用 SSH 传输协议，比如 `git@github.com:1927344728/xxxx` 。 

如果仓库太大，可以在 `git clone` 中加入参数 ``--depth=1`，只拉取最近的一个 revision。

```shell
git clone --depth=1 https://github.com/xxxx/xxxx.git
```

如果后面想看历史的版本，那么也很好办，使用 git fetch 即可。

```shell
git fetch --unshallow
```

> git clone特别慢是因为`github.global.ssl.fastly.net`域名被限制了。[Git速度太慢问题](./02-Git常见问题.md)
>
> 对于远程私有项目，需要输入账号和密码。为了避免每次下载和上传都输入，可以使用 [github SSH](./02-Git常见问题.md)。



### Git基本操作

Git 的工作就是创建和保存你项目的快照及与之后的快照进行对比。

Git 常用的命令，除了 git init、git clone，还有以下命令：

* git status
* git add
* git commit
* git reset
* git checkout
* git pull
* git push

#### 查看文件状态

**语句：** `git status `

查看所有文件（或指定文件）状态。

```shell
git status [file]
```

#### 工作区 ==> 暂存区

**语句：** `git add`

添加指定所有文件（或目录、或单个文件）到暂存区。

```shell
git add .
git add [dir]
git add [file1] [file2] ...

# -f：强行添加 .gitignore 中忽略的文件。
git add -f <file>
```

#### 暂存区 ==> 本地仓库

**语句：** `git commit`

将暂存区的内容提交到本地仓库。

```shell
# 提交暂存区所有文件（或指定文件）到本地仓库中，[message] 可以是一些备注信息
git commit -m [message]
git commit [file1] [file2] ... -m [message]

# 加-a参数，不需要执行 git add 命令，直接提交
git commit -am [message]

# 暂存区的内容添加到上一次 commit
git commit --amend
# 修改已提交到暂存区的commit的备注信息
git commit --amend --only -m <message>
```

#### 暂存区、本地仓库 ==> 工作区、暂存区

**语句：** `git reset [--soft | --mixed | --hard] [HEAD] `

用于回退版本，可以指定退回某一次提交的版本。

```shell
# 回退暂存区的所有文件（或指定文件）到工作区
git reset HEAD [filename]

# --mixed 为默认，可省略。
# 回退本地仓库上一次（或指定的某个）提交到工作区（变成此次提交 add 之前状态）   
git reset --mixed HEAD^
git reset HEAD^
git reset [commitId]

# 回退本地仓库上一次（或指定的某个）提交到暂存区（变成此次提交 add 之后，commit 之前状态）  
git reset --soft  HEAD^ 
git reset --soft  [commitId]

# 回退本地仓库上一次（或指定的某个）提交到工作区（变成此次提交 add 之前状态，并撤销所有修改） 
git reset --hard  HEAD^ 
git reset --hard  [commitId]

# 将整个分支重置/还原到另一个分支状态
git reset [branch]
```

HEAD 表示当前版本、HEAD^ 上一个版本、HEAD^^ 上上一个版本、HEAD^^^ 上上上一个版本。。。

HEAD~0 表示当前版本、HEAD~1 上一个版本、HEAD^2 上上一个版本、HEAD^3 上上上一个版本。。。

#### 恢复工作区

**语句：** `git checkout `

用于切换分支或恢复工作区文件。

```shell
# 切换分支
git checkout [branch]
# 创建分支，再切换分支。如果当前工作区有修改内容，会一起移到新分支。
git checkout -b [branch]

# 撤销所有文件（或指定文件）的修改
git checkout .
git checkout [file]
```

#### 远程仓库 ==> 本地仓库

**语句：** `git pull <远程主机名> <远程分支名>:<本地分支名> `

用于从远程获取代码并合并本地的版本。

**注意：** 以下示例是基于本地仓库已与远程仓库关联。如果尚未关联，请查看下文 【远程仓库管理】。

```shell
# 将与当前分支同名的远程分支合并到本地
git pull

# 将远程 master 分支与当前分支合并
git pull origin master

# 将远程 master 分支与本地的 myBranch 分支合并
git pull origin master:myBranch
```

#### 本地仓库 ==> 远程仓库

**语句：** `git push <远程主机名> <本地分支名>:<远程分支名> `

**注意：** 以下示例是基于本地仓库已与远程仓库关联。如果尚未关联，请查看下文 【远程仓库管理】。

```shell
# 将本地当前分支推送到远程同名分支
git push

# 将本地 master 分支推送到远程 master 分支
git push origin master

# 将本地 master 分支推送到远程 removeBranch 分支
git push origin master:removeBranch

# 强制推送本地分支到远程分支。注意：这是个危险的操作，它会用本地分支的提交记录强行覆盖远程分支的，会删除远程仓库中其他人推送的，但你还没抓取下来的提交。慎用！！！
git push --force

# 删除远程 removeBranch 分支
git push origin --delete removeBranch
```



### 分支管理

几乎每一种版本控制系统都以某种形式支持分支。使用分支意味着你可以从开发主线上分离开来，然后在不影响主线的同时继续工作。

分支管理包括本地分支管理和远程分支管理，以及两者的同步。

```shell
# 创建分支
git branch [branch]

# 查看当前分支
git branch
# 查看本地分支
git branch -v
# 查看远程分支
git branch -r
# 查看本地分支，并显示对应的远程关联的分支
git branch -vv
# 查看所有分支（本地分支、远程分支，无论是否有关联）
git branch -a

# 切换（或创建后切换）分支
git checkout -b [branch]
git checkout [branch]

# 删除本地分支
git branch -D [branch]
```

```shell
# 删除远程分支
git push origin --delete [branch]
# 删除远程分支。注意：不能再当前分支下删除，需要切换到别的分支
git branch -r -d origin/[branch]
git push origin :branch-name
```

```shell
# 关联远程分支
git checkout --track origin/[branch]

# 本地 master 分支关联远程 master 分支
git branch --set-upstream-to=origin/master master

# 将本地仓库当前分支推送到远程 master 分支
# -u 参数：如果远程没有 master，会先自动创建并关联
git push -u origin master

# 本地创建分支，并与远程分支关联
git checkout -b <branch> origin/[branch]

# 查看本地存在，但远程没有的分支
git remote prune origin --dry-run
# 删除本地存在，但远程没有的分支
git remote prune origin
# 将远程分支抓取下来。--prune：删除本地存在，但远程没有的分支
git remote update origin --prune 
```

#### 合并分支

**语句：** `git merge`

用于将另外一个或一个以上的分支合并到当前分支。该命令由 git pull 用于合并来自另一个存储库的更改，可以手动使用将更改从一个分支合并到另一个分支。

```shell
git merge <branch>
git merge <branch1> <branch2>
```

如果你和另一个开发者，修改了同一个文件，这时候 merge 可能会发生冲突（系统无法判断该用谁的修改），需要手动处理一下。

当产生合并冲突时，文件中冲突部分会以 `<<<<<<<`、`=======` 和 `>>>>>>>` 表示。在 `=======` 之前的部分是当前分支这边的情况，在 `=======` 之后的部分是对方分支的情况。

在看到冲突以后，你可以选择以下两种方式：

* **决定不合并。**这时，唯一要做的就是重置 index 到 HEAD 节点。`git merge --abort` 用于这种情况。
* **解决冲突。** Git 会标记冲突的地方，解决完冲突后（手动删除 `<<<<<<<`、`=======` 和 `>>>>>>>` 等，并删除不需要的修改内容），再使用 `git add` 加入到暂存区，然后使用 `git commit` 产生合并节点。



### 远程仓库管理

假设，你已经在本地创建了一个Git 仓库，又在 GitHub 创建一个 Git 仓库，并且让两者关联，这样，GitHub上的仓库既可以作为备份，又可以让其他人通过该仓库来协作。

以下是关于远程仓库的一些操作：

```shell
# 列出已经存在的仓库
git remote

# 列出已经存在的仓库，并显示所关联的远程仓库地址。若未关联，返回空。
git remote -v

# 添加远程仓库，并将本地仓库和远程仓库关联。
# origin 是远程仓库名。这是Git默认的叫法，可以改成其他的
# 本地项目上传至多个远程库
git remote add origin git@github.com:xxx/xxx.git
git remote add gitee git@gitee.com:xxx/xxx.git

# 删除远程仓库
git remote rm origin
```



### 查看提交历史

#### 查看提交记录

**语句：** `git log`

查看本地仓库中所有的提交记录。

**推荐别名：** `git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"`

```shell
# 一行情书版
git log --oneline
# 绘制一个 ASCII 图像来展示提交历史的分支结构
git log --graph
# 显示出指向提交的指针的名字，也就是 HEAD 指针, feature/test等分支名称，还有远程分支，标签等
git log --decorate

# 展示前n条记录
git log -n
# 展示简要的每次提交行数的变化，及其他基本信息。
git log --stat
# 展示每次提交详细的代码变化
git log -p
 
# 按提交的创建者分类。显示所有提交者，以及他们的提交总数和每次提交的注释
git shortlog

# 个性化输出命令
git log --pretty=format:"%h %s"
# %H 提交对象（commit）的完整哈希字串
# %h 提交对象的简短哈希字串
# %s 提交的注释
# %T 树对象（tree）的完整哈希字串
# %t 树对象的简短哈希字串
# %P 父对象（parent）的完整哈希字串
# %p 父对象的简短哈希字串
# %an 作者（author）的名字
# %ae 作者的电子邮件地址
# %ad 作者修订日期（可以用 -date= 选项定制格式）
# %ar 作者修订日期，按多久以前的方式显示
# %cn 提交者(committer)的名字
# %ce 提交者的电子邮件地址
# %cd 提交日期
# %cr 提交日期，按多久以前的方式显示

# 按创建者和提交者搜索：支持正则表达式
git log --author=<pattern>
git log --committer=<pattern>

# 按时间搜索。<date>格式：2020.3.1、2020.03.01
git log --since=<date>
git log --after=<date>
git log --until=<date>
git log --before=<date>
git log --since="2020.03.01" --until="2020.03.05"

# 按提交信息搜索：支持正则表达式
git log --grep=<pattern>
git log --grep="aaa\|bbb" 
		
# 按具体文件搜索
git log [\--] <path>
git log src/aaa/bbb.vue
git log -- src/aaa/bbb.vue


# 查看某个字符串/正则表达式的变动历史提交
git log -S <string>
git log -G <regex>
git log -S 'aa'
git log -G '^aa'
		
# 选择只看合并提交，或者非合并提交
git log --merges
git log --no-merges
```

**语句：** `git reflog`

查看所有分支的所有操作记录，包括 commit 和 reset 的操作，已经被删除的commit记录。git log 是不能查看已经删除的记录。git reflog 可以很好地帮助你恢复你误操作的数据，

#### 查看指定文件提交记录

**语句：** `git blame <file>`

用于查看指定文件的修改记录，以列表形式显示修改记录。



### 其他操作

#### 对比操作

**语句：** `git diff [file]`

用于对比工作区、暂存区、本地仓库之间的更改。

```shell
# 对比工作区和暂存区所有文件（或指定文件）的差异
git diff
git diff <file|directory>

# 对比暂存区和本地仓库所有文件（或指定文件）的差异
git diff --cached
git diff --staged

# 对比两次提交之间的差异
git diff <commit>..<commit> -- . ':![排除的文件夹]' 

# 对比两个分支之间的差异
git diff [可省略，默认当前分支] <branch>
git diff <branch> <branch>
```

#### 标签管理

**语句：** `git tag [-a] [-f] [-m <msg>] <tagname> [<commit>]`

用于创建，列出，删除或验证使用 GPG 签名的标签对象。

用于在开发阶段，某个阶段的完成，创建一个版本，可以创建一个 tag 来指向软件开发中的一个关键时期。比如：版本号更新的时候可以建一个 v1.0，v1.2 之类的标签，这样在以后回顾的时候会比较方便。

```shell
# 查看标签列表
git tag
git tag -l 'v1.4.2.*'

# 添加标签
git tag -a <tagname> -m "备注信息"
# 为指定提交添加标签
git tag -a <tagname> <commithash>

# 查看标签的版本信息
git show <tagname>

# 删除标签
git tag -d <tagname>

# 推送标签到远程服务器
git push origin <tagname>
git push origin --tags
```

#### 储藏工作区

**语句：** `git stash`

用于保存工作区目录和索引的当前状态，并恢复工作区以匹配 HEAD 提交。类似于 `git checkout .`，但是修改内容没有真正丢弃，而是存在仓库的位置，便于下次恢复。

```shell
# 保存暂存区和工作区的改动
git stash
git stash save
git stash save <message>
git stash push <file>,<file>
git stash push -m <message>

# 显示储藏记录
git stash list
git show <stash>
git stash show <stash>
# 比如：git show stash@{0}。stash@{0}是通过 git stash list 命令查到的。

# 恢复最新储藏记录到工作区。git默认会把工作区和暂存区的改动都恢复到工作区。
git stash pop
# 恢复最新储藏记录到工作区。尝试将原来暂存区的改动还恢复到暂存区。
git stash pop --index
# 恢复指定储藏记录到工作区
git stash pop <stash>
# 注意：** 通过 git stash pop 命令恢复储藏记录，该记录会被删除。**

# 除了不删除已恢复的储藏记录之外
git stash apply

# 删除一个储藏记录。如果不指定 <stash>，则默认删除最新的储藏记录。
git stash drop <stash>
# 删除所有储藏记录
git stash clear
# 从储藏记录创建分支
git stash branch <branch> [<stash>]
```

####  合并多个提交

假设你接到一个临时需求，你在 master 分支上创建新分支 temp 来工作，最后你完成任务时，在 temp 分支提交了10个 commit，准备合并回 master 分支。如果直接用 `git merge temp `，这10个 commit 都会一一出现在 master 分支。为让 master 看起来会更简洁一些，通常我们推荐将这些 commit 合并成一个。

**方法一：**

```shell
# 将当前分支重置/还原到另一个分支状态，回退提交到暂存区
git reset --soft master
git commit -am "New awesome feature"
```

**方法二：** 如果你想要保留一些信息，可选用 交互式 rebase。

```shell
# 从 HEAD 版本开始往过去数3个 commit
git rebase -i HEAD~2
# 指定要合并的 commit 起点。注意：该 commit 是不参与合并的，仅仅是当一个坐标
git rebase -i <commit>

# 以 master 的最新 commit 为起点
git rebase -i master
```

执行了 rebase 命令之后，终端显示如下：

```shell
pick 3ca6ec3 '注释**********'
pick 1b40566 '注释*********'
pick 53f244a '注释**********'
```

将 pick 改为 squash 或者 s，保存并关闭文本编辑窗口：

```shell
pick 3ca6ec3 '注释**********'
s 1b40566 '注释*********'
s 53f244a '注释**********'
```

保存退出，Git 会压缩提交历史。

如果有冲突，要注意，修改的时候要保留最新的历史，不然我们的修改就丢弃了。修改后执行如下命令：

```shell
git add .  
git rebase --continue  
```

如果没有冲突，或者冲突已经解决，则会出现：

```shell
# This is a combination of 4 commits.  
# The first commit’s message is:  
注释......
# The 2nd commit’s message is:  
注释......
# The 3rd commit’s message is:  
注释......
# Please enter the commit message for your changes. Lines starting # with ‘#’ will be ignored, and an empty message aborts the commit.
```

输入 `wq`，保存退出，完合合并。

**方法三：** 将一个分支合并成一个 commit：

```
git merge --squash my-branch
```

#### cherry-pick命令

将指定的 commit 合到当前分支。

```shell
# 将提交合并到当前分支
git cherry-pick <commit>
# 将该分支提交合并到当前分支
git cherry-pick <branch>
# 将多个提交合并到当前分支
git cherry-pick <commit1> <commit2>

# 将从 commit1 到 commit2 的所有提交合并到当前分支，但是不包含 commit1
# commit1 必须早于提交 commit2，否则命令将失败，但不会报
git cherry-pick <commit1>..<commit2>
# 如果要包含 commit1，如下
git cherry-pick <commit1>^..<commit2>

# -n，--no-commit：只更新工作区和暂存区，不产生新的提交
git cherry-pick -n <commit>
```

#### 代码回滚

**git reset，** 重置当前 HEAD 到指定的 commit。用于回退版本，遗弃不再使用的提交。

```shell
git revert HEAD  # 撤销前一次 commit
git revert HEAD^ # 撤销前前一次 commit
git revert [commitId] # 撤销指定的版本，撤销也会作为一次提交进行保存。
git revert [branch] # 将整个分支重置/还原到另一个分支状态
```

**git revert，** 撤销某次操作，此次操作之前和之后的 commit 和 history 都会保留，并且把这次撤销，作为一次最新的提交。

```shell
git revert HEAD  # 恢复前一次 commit
git revert HEAD^ # 恢复前前一次 commit
git revert [commitId] # 恢复指定的版本，恢复也会作为一次提交进行保存。
git revert -n [commitId1]..[commitIdn] # 恢复多个 commit
git revert -n [commitId1]^..[commitIdn] # 恢复多个 commit，含 commitId1
```

**git checkout，** 用于切换分支或恢复工作区文件。

```shell
git checkout [branch]    # 切换分支
git checkout -b [branch] # 创建并切换分支
git checkout . # 放弃工作区中的全部修改
git checkout filename # 放弃工作区中某个文件的修改
git checkout <commit> # 把整个git仓库文件回退到 commit 参数指定的版本
git checkout [<commit>] <filepath>：# 回退 filepath 文件为 commit 参数指定的版本。如果不填 commit，默认为暂存区；如果暂存区为空，则该文件会回滚到最近一次的提交状态。
```

**revert 和 reset 的区别：** git revert 是用一次新的 commit 来回滚之前的 commit，git reset 是直接删除不需要的 commit。

在回滚这一操作上看，效果差不多，但是在 commit 管理上有区别：

- git reset 是回滚到指定的 commit，相当于是删除了指定 commit 以后的所有的提交，并且不会产生新的 commit 记录，如果要推送到远程服务器的话，需要强制推送 -f（-f 很危险，不建议使用）。
- git revert 是对 commit 进行逆向操作，回滚所有代码改动，然后重新生成一个 commit。本身不会对其他的提交 commit 产生影响，如果要推送到远程服务器的话，就是普通的操作 git push 就好了。

**注意：** 使用 git revert 回滚代码，如果之前的 commit 是从目标分支合并过来的，则 revert 后，想把代码还原，再次把原分支的 commit 合并过来时，代码不会改动。因为，原分支的所有 commit 已经在当前分支了。**解决方法：** 将 revert 生成的 commit 再 revert 一次，或者将原分支改动生成新的 commit，比如 cherry-pick、多 commit 合为一个，都会生成新的 commit。

###  文件管理

#### 工作区文件

```shell
# 删除未跟踪文件（或文件及目录、或文件及目录包含gitignore里的）
git clean -f	
git clean -fd
git clean -xfd

# 删除文件
git rm <file>
# 删除暂存区和工作区文件
git rm -f <file>
# 删除暂存区文件，但保留在工作区
git rm --cached <file>
# 递归删除，即删除整个目录中的所有子目录和文件
git rm –r <directory>
```

#### alias配置文件

* **一般：** ``~/.gitconfig` 或者当前目录下的 `.git/config`；
* **Bash：** `/etc/bashrc`、`~/bash_profile` 、`/etc/profile`；
* **zsh：** `~/.zshrc`、`~/.oh-my-zsh/plugins/git/git.plugin.zsh`；
* **window：** `C:\Users\$User\.gitconfig`，也可以在 `C:\Users\$User\.bash_profile` 配置。

#### .gitignore文件

工作区的根目录下创建 `.gitignore`文件，然后把要忽略的文件夹/文件名填进去。这样当你使用`git add .`的时候这些文件就会被自动忽略掉。

```shell
# general
*~
*.log
tmp
dump
**/.DS_Store
.svn/
.idea/
.metadata/
.project
Thumbs.db
*.iml

#node
**/node_modules/

#bower
**/bower_components
_book

#sublime project config file
**/*.sublime-project
**/*.sublime-workspace
```



### 参考链接

[runoob.com-Git 教程](https://www.runoob.com/git/git-tutorial.html)

[易百-Git教程](https://www.yiibai.com/git)

[git - 简明指南（入门推荐）](https://rogerdudler.github.io/git-guide/index.zh.html)

[Git教程- 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

