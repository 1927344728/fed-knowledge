## Git安装、使用及常用命令

### Git是什么？

Git是一个分布式版本管理系统，是为了更好地管理Linux内核开发而创立的。

Git可以在任何时间点，把文档的状态作为更新记录保存起来。因此可以把编辑过的文档复原到以前的状态，也可以显示编辑前后的内容差异。

而且，编辑旧文件后，试图覆盖较新的文件的时候（即上传文件到服务器时），系统会发出警告，因此可以避免在无意中覆盖了他人的编辑内容。



### Git安装

可以网上搜索"git"下载安装。[下载git windows版](https://gitforwindows.org/)



### git init

如果你有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，那么首先需要进入该项目目录中。 如果你还没这样做过，那么不同系统上的做法有些不同：

在 Linux 上：`$ cd /home/user/my_project`；

在 macOS 上：`$ cd /Users/user/my_project`；

在 Windows 上：`$ cd /c/user/my_project`。

`git init`命令将创建一个名为 `.git` 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪。 



### git clone 

执行如下命令以创建一个本地仓库的克隆版本：

```
git clone /path/to/repository
```

如果是远端服务器上的仓库，你的命令会是这个样子：

```console
$ git clone [url,如https://github.com/1927344728/xxxx]
$ git clone [url,如https://github.com/1927344728/xxxx] [myDirectory]  //自定义本地仓库的名字
```

这会在当前目录下创建一个名为 “xxxx” 的目录，并在这个目录下初始化一个 `.git` 文件夹， 从远程仓库拉取下所有数据放入 `.git` 文件夹，然后从中读取最新版本的文件的拷贝。

Git 支持多种数据传输协议。 上面的例子使用的是 `https://` 协议，不过你也可以使用 `git://` 协议或者使用 SSH 传输协议，比如 `git@github.com:1927344728/xxxx` 。 

> git clone特别慢是因为`github.global.ssl.fastly.net`域名被限制了。[git clone速度太慢的解决办法](./02-git clone速度太慢的解决办法.md)

> 开始 clone，如果仓库太大，可以在 git clone 中加入参数 --depth=1，只拉取最近的一个 revision。
>
> ```text
> git clone --depth=1 https://github.com/xxxx/xxxx.git
> ```
>
>  如果后面想看历史的版本，那么也很好办，使用 git fetch 即可。
>
> ```text
> git fetch --unshallow
> ```

> 对于远程私有项目，需要输入账号和密码。为了避免每次下载和上传都输入，可以使用[ssh协议](./04-github SSH.md)。



### git add

暂存一个文件:  `git add -N filename.x`

暂存一个文件的一部分: `git add --patch filename.x`。



### git commit

暂存的内容添加到上一次的commit:  `git commit --amend -m ""`

合并多个分支：

```
git reset --soft master
git commit -am "新提交信息"
```

或者

```
//交互式rebase
git rebase -i <branch>/<commitId>
```

编辑和删队已提交分支：

从一个提交(commit)里移除一个文件：

```
git checkout HEAD^ myfile
git add -A
git commit --amend
```

删除最后一次提交(commit)：

```
git reset HEAD^ --hard
git push -f [remote] [branch]
```

> 如果你已经推(push)了这次提交(commit), 你可以修改这次提交(commit)然后强推(force push), 但是不推荐这么做



### git diff

```shell
git diff [上一分支]..[当前分支] -- . ':![排除的文件夹]' 
```



### git log

查看commit信息。

> 推荐：git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
>
> 别名：git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"

```shell
//一行情书版
git log --oneline

图文并茂版
这次命令使用三个参数 --oneline， --decorate 和 --graph 。
–oneline 刚才就是哪个一句话情书的。
–graph 选项会绘制一个 ASCII 图像来展示提交历史的分支结构。
–decorate 是用来可以显示出指向提交的指针的名字，也就是 HEAD 指针, feature/test等分支名称，还有远程分支，标签等

//展示前n条数据
git log -n
 
//展示简要的每次提交行数的变化，及其他基本信息。
git log –stat
 
//展示每次提交详细的代码变化
git log -p
 
//按提交的创建者分类
git shortlog

git log –pretty=format:""
    git log --pretty=format:"%h %s"
    #个人log配置个性化输出命令
    git log --pretty=format:"%H %cd *%an*:%s(%ar)" --graph
    展示历史最后2次提交的commit id 和 提交注释信息
    git log -2 --pretty=format:"%h - %ad, %ar : %s"

    %H 提交对象（commit）的完整哈希字串
    %h 提交对象的简短哈希字串
    %T 树对象（tree）的完整哈希字串
    %t 树对象的简短哈希字串
    %P 父对象（parent）的完整哈希字串
    %p 父对象的简短哈希字串
    %an 作者（author）的名字
    %ae 作者的电子邮件地址
    %ad 作者修订日期（可以用 -date= 选项定制格式）
    %ar 作者修订日期，按多久以前的方式显示
    %cn 提交者(committer)的名字
    %ce 提交者的电子邮件地址
    %cd 提交日期
    %cr 提交日期，按多久以前的方式显示



//搜索参数为提交的创建者和提交者，而且是支持正则表达式的，可以发挥的余地很多
git log  --author=<pattern>
git log --committer=<pattern>
    //示例
    git log --author=lizh


//关于按时间搜索。<date>格式：2020.3.1、2020.03.01
git log --since=<date>
git log --after=<date>
git log --until=<date>
git log --before=<date>
    //示例
    git log --since="2020.03.01" --until="2020.03.05"


//搜索提交信息,也支持正常表达式
git log --grep=<pattern>
		//示例。
		git log --grep="aaa\|bbb" //提交信息包含aaa或bbb
		
		
//搜索修改具体文件
git log [\--] <path>
		//示例
		git log src/aaa/bbb.vue
		git log -- src/aaa/bbb.vue


//查看某个字符串/正则表达式的变动历史提交
git log -S<string>
git log -G<regex>
		//示例
		git log -S 'aa'
		git log -G '^aa'
		
		
//选择只看合并提交，或者非合并提交
git log --merges
git log --no-merges
```



### git reflog

可以查看所有分支的所有操作记录（包括（包括commit和reset的操作），包括已经被删除的commit记录，git log则不能察看已经删除了的commit记录，而且跟进结果可以回退道某一个修改。



### git stash

```
git stash //暂存所有改动
git stash -u //暂存所有改动，-u来排队一些文件
git stash push file.js, file2.js //暂存提定文件
git stash save <message>  //暂存时记录消息
git stash push -m <message>  //暂存时记录消息
git stash list  //暂存stash记录
$ git stash apply "stash@{n}"  //使用某个记录
git stash pop  //显示暂存内容，并删队暂存记录
```



### git checkout

未暂存的内容移动到一个新分支:  `git checkout -b my-branch`



### git reset 和 git revert

**git reset，直接删除指定的commit，不保留痕迹**

返回上一commit: `git reset HEAD^`

重置某一文件：`git reset filename`

--soft 回退后修改的代码被保留并标记为add的状态（git status 是绿色的状态） 

--mixed 重置索引，但不重置工作树，更改后的文件标记为未提交（add）的状态。默认操作。 

--hard 重置索引和工作树，并且分支修改的所有文件和中间的提交，没提交的代码都被丢弃了。

 --merge 和--hard类似，只不过如果在执行reset命令之前你有改动一些文件并且未提交，merge会保留你的这些修改，hard则不会。【注：如果你的这些修改add过或commit过，merge和hard都将删除你的提交】

 --keep 和--hard类似，执行reset之前改动文件如果是分支修改了的，会提示你修改了相同的文件，不能合并。如果不是分支修改的文件，会移除缓存区。 

**git revert , 是用一次新的commit来回滚之前的commit**

 

###  组合多个提交：

假设你的工作分支将会做对于 `master` 的pull-request。 一般情况下你不关心提交(commit)的时间戳，只想组合 *所有* 提交(commit) 到一个单独的里面, 然后重置(reset)重提交(recommit)。 确保主(master)分支是最新的和你的变化都已经提交了, 然后:

```
git reset --soft master
git commit -am "New awesome feature"
```

如果你想要更多的控制, 想要保留时间戳, 你需要做交互式rebase (interactive rebase): 

```
git rebase -i master
```

如果没有相对的其它分支， 你将不得不相对自己的`HEAD` 进行 rebase。 例如：你想组合最近的两次提交(commit), 你将相对于`HEAD~2` 进行rebase， 组合最近3次提交(commit), 相对于`HEAD~3`, 等等。

```
git rebase -i HEAD~2
```

安全合并(merging)策略

```
git merge --no-ff --no-commit my-branch
```

将一个分支合并成一个提交(commit)

```
git merge --squash my-branch
```

检查是否分支上的所有提交(commit)都合并(merge)过了

```
git log --graph --left-right --cherry-pick --oneline HEAD...feature/120-on-scroll
或者
git log master ^feature/120-on-scroll --no-merges
```



### 远程仓库命令

现在的情景是，你已经在本地创建了一个Git仓库后，又想在GitHub创建一个Git仓库，并且让这两个仓库进行远程同步，这样，GitHub上的仓库既可以作为备份，又可以让其他人通过该仓库来协作，真是一举多得。

> [点击查看创建本地Git仓库和远程Git仓库](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013752340242354807e192f02a44359908df8a5643103a000)，本文只记录常用命令

1. 现在把本地仓库和远程仓库关联起来：

   `git remote add origin git@git.winbaoxian.com:lizhao/gitbook.git`

   >  远程库的名字就是`origin`，这是Git默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库。

2. 删除远程仓库：`git remote rm origin`

3. 远程仓库是否连接： ssh -T [git@git.winbaoxian.com](mailto:git@git.winbaoxian.com) 

   是否创建了公有密钥：ls ~/.ssh 

   生成密钥：ssh-keygen -t rsa -f ~/.ssh/ellacf -C "邮箱"

   -t 指定密钥类型，默认是 rsa ，可以省略。

   -C 设置注释文字，比如邮箱。

   -f 指定密钥文件存储文件名。



### 配置信息

检查已有的配置信息: `git config --list`

修改信息：`git config --global user.name <userName>`



### 分支管理

1. 关联远程分支： `git branch --set-upstream-to=origin/master master`

2. 新建并关联远程分支：`git push -u origin master`

   > 我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

3. 删除远程分支：`git push origin --delete <branch>`

4. 删除本地分支：`git branch -D <branch>`



### npm install报错

npm cache clean --force



###  文件管理删除

删除未跟踪文件：`git clean -f`	

删除未跟踪文件及目录：`git clean -fd`

删除未跟踪文件及目录( gitignore里的也一起删掉)：`git clean -xfd`

`git clean -nxfd`、`git clean -nf`、`git clean -nfd` 。加上 -n 参数来先看看会删掉哪些文件



### alias 配置文件

Bash：其配置文件可能是 /etc/bashrc、~/bash_profile 或者 /etc/profile

~/.gitconfig

zsh: ~/.zshrc、~/.oh-my-zsh/plugins/git/git.plugin.zsh



### .gitignore文件

在Git工作区的根目录下创建`.gitignore`文件，然后把要忽略的文件夹/文件名填进去。这样当你使用`git add .`的时候这些文件就会被自动忽略掉。

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



### 推荐链接

[git - 简明指南（入门推荐）](https://rogerdudler.github.io/git-guide/index.zh.html)

[Git教程- 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)