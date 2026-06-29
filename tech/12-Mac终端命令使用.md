## Mac 终端命令使用

在计算机科学中，Shell 俗称壳（用来区别于核），是指 **为使用者提供操作界面** 的软件（即，命令解析器）。它接收用户命令，然后调用相应的应用程序。

Mac 下默认使用 bash shell。

bash 一个命令处理器，全称：Bourne-Again Shell，Bash 是 Bourne shell 后继兼容版本与开放源代码版本，Bourne shell 是一个交换式的命令解释器和命令编程语言。bash 的命令语法是 Bourne shell 命令语法的超集。bash 与 Bourne shell 完全向后兼容，并且在 Bourne shell 的基础上增加和增强了很多特性。

在 Shell 命令行中，可以使用所有基本的 Linux / Unix 和 shell 命令，例如 ls、cd、cat 等。

### Mac OS、Linux、Unix 之间的关系

**简单来说：** Unix 简化形成了 Linux，Linux 则是 Android 的内核，而 Mac 则是使用 Unix 系统作为 IOS 和 Mac OS 的内核。

#### Unix

1969年，Bell 实验室的 Ken Thompson 开始利用一台闲置的 PDP-7 计算机开发了一种多用户、多任务操作系统。很快，Dennis Richie 加入了这个项目，在他们共同努力下诞生了最早的 UNIX。Richie 受一个更早的项目——MULTICS 的启发，将此操作系统命名为 Unix。早期 Unix 是用汇编语言编写的，但其第三个版本用一种崭新的编程语言 C 重新设计了。C 是 Richie 设计出来并用于编写操作系统的程序语言。 通过这次重新编写，Unix 得以移植到更为强大的 DEC PDP-11/45 与 11/70 计算机上运行。后来发生的一切，正如他们所说，已经成为历史。Unix 从实验室走出来并成为了操作系统的主流，现在几乎每 个主要的计算机厂商都有其自有版本的 Unix。

Unix 是一个功能强大、性能全面的多用户、多任务操作系统，可以应用从巨型计算机到普通 PC 机等多种不同的平台上，是应用面最广、影响力最大的操作系统。

Unix 系统主要有 Sun 的 Solaris、IBM 的 AIX,　HP 的 HP-UX，以及 x86 平台的的 SCO Unix/Unixware。

#### Linux

Linux 起源于一个学生的简单需求。Linus Torvalds——Linux 的作者与主要维护者，在其上大学时所买得起的唯一软件是 Minix。 Minix 是一个类似 Unix，被广泛用来辅助教学的简单操作系统。Linus 对 Minix 不是很满意，于是决定自己编写软件。他以学生时代熟悉的 Unix 作为原型， 在一台 Intel 386 PC 上开始了他的工作。他的进展很快，受工作成绩的鼓舞，他将这项成果通过互连网与其他同学共享，主要用于学术领域。有人看到了这个软件并开始分发。每当出现新问题时，有人会立刻找到解决办法并加入其中，很快的， Linux 成为了一个操作系统。

值得注意的是 Linux 并没有包括 Unix 源码。它是按照公开的 POSIX 标准重新编写的。Linux 大量使用了由麻省剑桥自由软件基金的 GNU 软件，同时 Linux 自身也是用它们构造而成。

Linux 是一类 Unix 操作系统的统称，严格来说，Linux 系统只有内核叫 “Linux”，而 Linux 也只是表示其内核，但因为习惯使然，人们习惯了用 Linux 称呼这类系统。一般也可以认为，Linux 是一套自由使用和自由传播的类 Unix 系统。

Linux 商业化的系统有 RedHat Linux 、SuSe Linux、slakeware Linux、国内的红旗等，还有Turbo Linux。

#### Mac OS

Mac OS 是基于 Unix 内核的图形化操作系统，由 Unix 的一个分支（BSD）发展过来的，内核叫 darwin（达尔文）。

Darwin 是 Mac OS 操作系统的类 Unix 核心，由内核（kernel）、XNU 和 运行时（runtime）组成。

Mac OS 包含了 Darwin，Darwin 包含了 XNU，XNU 包含了 Mark 和 BSD（Unix 操作系统的一个分支） 核心。

#### Unix 和 Linux 的区别

* Unix 系统大多是与硬件配套的，而 Linux 则可运行在多种硬件平台上；
* Unix 是商业软件，而 Linux 是自由软件，免费、公开源代码的；
* Unix 的历史久于 Linux，Linux 的思想源于 Unix。

#### Linux 和 Mac OS 的区别

都是基于类 Unix 的，不过 Mac OS X 属于 Unix 的直接衍生产品。

* Linux 和 macOS 都是起源于 Unix；
* Linux 是宏内核，macOS 的内核 Darwin 是混合内核；
* Linux 起源于 Linus，Darwin 是基于 Mach 和 BSD 修改而来；
* Linux 只是类 Unix，而 macOS 是通过了统一的 Unix 规范的正统 Unix。

### Mac 终端命令大全

**Mac 和 Linux 常用命令基本没有区别**，如：ls、find、cp、mkdir、tar 等，但还是有少数命令行的参数不同，以及细微差别。

#### 快捷键

```shell
Tab: 文件和文件夹名自动补全

Ctrl + A ：跳到当前行的开始
Ctrl + E ：跳到当前行的结束

Ctrl + L ：清空屏幕
Ctrl + U ：清空光标前的行
Ctrl + K ：清空光标后的行
Ctrl + W ：删除光标前的词
```

#### 目录操作

| 命令名 | 功能描述             | 使用举例                    |
| ------ | -------------------- | --------------------------- |
| cd     | 改变当前目录         | cd [dirName]                |
| ls     | 显示当前目录的内容   | ls [-alrtAFR] [file \| dir] |
| pwd    | 显示当前目录的路径名 | pwd                         |
| mkdir  | 创建一个目录         | mkdir [-p] dirName          |
| rmdir  | 删除一个**空目录**   | rmdir [-p] dirName          |

#### 文件操作

| 命令名 | 功能描述                 | 使用举例                 |
| ------ | ------------------------ | ------------------------ |
| cat    | 显示或连接文件           | cat [-nbsvet] fileName   |
| more   | 分屏显示文件内容         | more [] filename         |
| od     | 以八进制字码显示内容     | od [] filename           |
| cp     | 复制文件或目录           | cp [options] source dest |
| rm     | 删除文件或目录           | rm [options] filename    |
| mv     | 改变文件名或所在目录     | mv [options] source dest |
| ln     | 为文件创建链接           | ln [options] file1 file2 |
| find   | 在指定目录查找文件或目录 | find path [options] expr |
| file   | 显示文件类型             | file [options] filename  |
| open   | 使用默认的程序打开文件   | open filename            |

#### 选择操作

| 命令名 | 功能描述                         | 使用举例                        |
| ------ | -------------------------------- | ------------------------------- |
| head   | 显示文件的最初几行               | head -20 filename               |
| tail   | 显示文件的最后几行               | tail -15 filename               |
| cut    | 显示文件每行中 n-m 的字符        | cut [options] n-m file          |
| colrm  | 删除标准输入每行的 n-m 列字符    | colrm n m < file                |
| paste  | 合并文件的列                     | paste cut [options] file1 file2 |
| diff   | 比较并显示两个文件或目录的差异   | diff name1 name2                |
| sed    | 用脚本的指令来处理、编辑文本文件 | sed “s/red/green/g” filename    |
| grep   | 在文件中按模式查找               | grep “a” filename               |
| awk    | 在文件中查找并处理模式           | awk ‘{print $1 $1}’ filename    |
| sort   | 排序或归并文件                   | sort -d -f -u file1             |
| uniq   | 去掉文件中的重复行               | uniq file1 file2                |
| comm   | 比较两个已排过序的文件           | comm [options] file1 file2      |
| wc     | 统计文件的字符数、词数和行数     | wc filename                     |
| nl     | 给文件加上行号                   | nl file1 >file2                 |

#### 安全操作

| 命令名 | 功能描述               | 使用举例                |
| ------ | ---------------------- | ----------------------- |
| passwd | 修改用户密码           | passwd                  |
| chmod  | 改变文件或目录的权限   | chmod ug+x filename     |
| umask  | 定义创建文件的权限掩码 | umask 027               |
| chown  | 改变文件或目录的属主   | chown newowner filename |
| chgrp  | 改变文件或目录的所属组 | chgrp staff filename    |
| xlock  | 给终端上锁             | xlock -remote           |

#### 编程操作

| 命令名 | 功能描述                 | 使用举例                   |
| ------ | ------------------------ | -------------------------- |
| make   | 维护可执行程序的最新版本 | make                       |
| touch  | 更新文件的访问和修改时间 | touch -m 05202400 filename |

#### 进程操作

| 命令名 | 功能描述               | 使用举例         |
| ------ | ---------------------- | ---------------- |
| ps     | 显示进程当前状态       | ps u             |
| kill   | 终止进程               | kill -9 30142    |
| nice   | 改变待执行命令的优先级 | nice cc -c *.c   |
| renice | 改变已运行进程的优先级 | renice +20 32768 |

#### 时间操作

| 命令名 | 功能描述                 | 使用举例   |
| ------ | ------------------------ | ---------- |
| date   | 显示系统的当前日期和时间 | date       |
| cal    | 显示日历                 | cal 8 1996 |
| time   | 统计程序的执行时间       | time a.out |

#### 网络与通信操作

| 命令名 | 功能描述                         | 使用举例                    |
| ------ | -------------------------------- | --------------------------- |
| telnet | 远程登录                         | telnet hpc.sp.net.edu.cn    |
| rlogin | 远程登录                         | rlogin hostname -l username |
| rsh    | 在远程主机执行指定命令           | rsh f01n03 date             |
| ftp    | 在本地主机与远程主机之间传输文件 | ftp ftp.sp.net.edu.cn       |
| rcp    | 在本地主机与远程主机之间复制文件 | rcp file1 host1:file2       |
| ping   | 给一个网络主机发送 回应请求      | ping hpc.sp.net.edu.cn      |
| mail   | 阅读和发送电子邮件               | mail                        |
| write  | 给另一用户发送报文               | write username pts/1        |
| mesg   | 允许或拒绝接收报文               | mesg n                      |

#### Korn Shell命令

| 命令名  | 功能描述                        | 使用举例        |
| ------- | ------------------------------- | --------------- |
| history | 列出最近执行过的 几条命令及编号 | history         |
| r       | 重复执行最近执行过的 某条命令   | r -2            |
| alias   | 给某个命令定义别名              | alias del=rm -i |
| unalias | 取消对某个别名的定义            | unalias del     |

#### 其他命令

| 命令名 | 功能描述                       | 使用举例     |
| ------ | ------------------------------ | ------------ |
| uname  | 显示操作系统的有关信息         | uname -a     |
| clear  | 清除屏幕或窗口内容             | clear        |
| env    | 显示当前所有设置过的环境变量   | env          |
| who    | 列出当前登录的所有用户         | who          |
| whoami | 显示当前正进行操作的用户名     | whoami       |
| tty    | 显示终端或伪终端的名称         | tty          |
| stty   | 显示或重置控制键定义           | stty         |
| du     | 查询磁盘使用情况               | du -k subdir |
| df     | 显示文件系统的总空间和可用空间 | df /tmp      |
| w      | 显示当前系统活动的总信息       | w            |

### 相关问题

#### cd、pushd、popd 命令区别？

目录栈是用户最近访问过的系统目录列表，并以堆栈的形式管理。使用 dirs 命令显示当前目录栈中的所有记录。

cd 命令是进入当前目录的子目录。

pushd 命令常用于将目录加入到目录栈顶部，并切换到该目录；若不加任何参数，则会将位于记录栈最上面的 2 个目录对换位置。

popd 命令用于删除目录栈中的记录；如果不加任何参数，则会先删除目录栈最上面的记录，然后切换到删除过后的目录栈中的最上面的目录。

```shell
pushd d/folder/folder2/folder3/
pwd
# /d/folder/folder2/folder3
popd
pwd
# /
```

#### 如何杀死进程？

```shell
ps # 显示所有进程
lsof -i:[PORT] # 查看指定端口的进程
kill -9 [PID] # -9 表示彻底杀死进程
```

### 参考资料

[详解Linux与Unix系统的区别与联系](https://linux.cn/article-3159-1.html)

[C语言中文网 - Linux学习教程，Linux入门教程（超详细）](http://c.biancheng.net/linux_tutorial/)

[runoob.com Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)

[Linux/Mac find 命令详解](https://www.mzh.ren/linux-mac-find-detail.html)

