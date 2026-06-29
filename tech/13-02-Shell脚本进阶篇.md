## Shell 脚本进阶篇

Shell 是一种**命令行解释器**，它充当用户与操作系统内核之间的桥梁。用户在 Shell 中输入命令，Shell 负责解释这些命令并调用内核执行。

Shell 的主要功能包括：

- **命令解释**：解释和执行用户命令，并传递给内核；
- **程序调用**：支持调用其他程序并传递参数；
- **输入输出重定向**：控制数据的流向；
- **管道连接**：将一个程序的输出作为另一个程序的输入；
- **编程能力**：支持变量、条件判断、循环等编程特性。

计算机中，真正能够控制计算机硬件（CPU、内存、显示器等）的只有操作系统内核。

由于安全、复杂、繁琐等原因，用户不能直接接触内核（也没有必要），需要**另外再开发一个程序**，让用户直接使用这个程序；该程序的作用就是接收用户的操作（点击图标、输入命令），并进行简单的处理，然后再传递给内核。如此一来，用户和内核之间就多了一层“代理”，这层“代理”既简化了用户的操作，也保护了内核。 在Linux下，这个命令行程序叫做 **Shell**。

### 文件与目录操作

* `ls`：列出目录内容。
* `cd`：切换目录。
* `pwd`：显示当前目录路径。
* `mkdir`：创建目录。
* `rmdir`：删除空目录。
* `rm`：删除文件或目录。
* `cp`：复制文件或目录。
* `mv`：移动或重命名文件。
* `touch`：创建空文件或更新时间戳。
* `cat`：查看文件内容。
* `stat`：显示文件或文件系统的详细状态信息。
* `less` / `more`：分页查看大文件。
* `head` / `tail`：查看文件开头或结尾。
* `ln`：创建链接文件。
* `basename / dirname`：从路径中提取文件名和目录部分。

#### ls

列出当前目录里的文件、文件夹。

```shell
ls [选项] [文件或目录]
```

**常用参数**：

- `-l`：以长格式显示详细信息（权限、链接数、所有者、大小、修改时间）。
- `-a`：显示所有文件，包括以点开头的隐藏文件。
- `-h`：与 `-l` 配合，以人类可读方式显示文件大小（如 KB、MB）。
- `-R`：递归显示子目录内容。
- `-t`：按修改时间排序（最新在上）。

```shell
ls -lahRt
ls -lh myshell.sh
```

#### cd

切换进入不同文件夹（改变当前所在位置）。

```shell
cd [目录路径]
```

无常用参数，支持特殊路径：

- `cd /`：**切换到系统的根目录**。
- `cd ~` 或 `cd`：切换到当前用户的家目录。
- `cd -`：切换到上一次所在的目录。
- `cd ..`：切换到上级目录。

**平台差异**：Windows cmd， `cd /` 切换到当前盘符根目录，`cd /D` 可跨盘符。

```shell
cd /
cd ~
cd /Users/$USER/Documents
```

#### pwd

显示当前所在目录的绝对路径。

shell

```
pwd [选项]
```

**常用参数**：

- `-P`：显示实际物理路径，不解析符号链接。
- `-L`：显示逻辑路径（包含符号链接，默认行为）。

**平台差异**：Windows cmd，无 `pwd` 命令，使用 `echo %cd%` 或 `cd`（无参数）。

```shell
pwd
pwd -P
```

#### mkdir

创建新目录。

```shell
mkdir [选项] 目录名...
```

**常用参数**：

- `-p`：递归创建多级目录，若父目录不存在则自动创建。
- `-m`：创建时直接设置权限模式（如 `-m 755`）。

```shell
mkdir -p project/src/main
mkdir -m 700 privateDir
```

#### rmdir

删除空目录。

```shell
rmdir [选项] 目录名...
```

**常用参数**：

- `-p`：递归删除空目录，若删除后父目录也为空则一并删除。

**注意**：`rmdir` 只能删除空目录。删除非空目录请使用 `rm -rf`（Linux/macOS）或 `rmdir /s`（Windows cmd）。

```shell
rmdir -p project/src/main
```

#### rm

删除文件或目录。

```shell
rm [选项] 文件或目录...
```

**常用参数**：

- `-r` 或 `-R`：递归删除，用于删除目录及其内容。
- `-f`：强制删除，忽略不存在的文件，不提示确认。
- `-i`：交互模式，删除前逐一询问确认。
- `-v`：显示详细删除过程。

**平台差异**：

- Windows cmd：使用 `del` 删除文件，`rmdir /s` 删除目录。

```shell
rm -rf project
rm -i log.txt
rm -v info.txt
```

#### cp

复制文件或目录。

```shell
cp [选项] 源文件 目标文件
cp [选项] 源文件... 目标目录
```

**常用参数**：

- `-r` 或 `-R`：递归复制目录。
- `-i`：覆盖前提示确认。
- `-u`：仅当源文件比目标新或目标不存在时才复制。
- `-p`：保留原文件的属性（修改时间、权限等）。
- `-a`：归档模式，等于 `-dpR`，保留链接、属性并递归。
- `-v`：显示详细复制过程。

```shell
cp file.txt log.txt
cp -r project project2
cp -rv project project3
cp -i project/src/main/log.txt log.txt
cp -a project project4
```

#### mv

移动或重命名文件。

```shell
mv [选项] 源文件 目标文件
mv [选项] 源文件... 目标目录
```

**常用参数**：

- `-i`：覆盖前提示确认。
- `-v`：显示详细移动过程。
- `-n`：不覆盖已存在的目标文件。

**平台差异**：Windows cmd：使用 `move`。

```shell
mv project/src/main/log.txt log2.txt
mv -i project/src/main/log.txt log3.txt
mv -v project/src/main/log.txt log2.txt
mv -n project/src/main/log.txt log2.txt
mv -nv project/src/main/log.txt log2.txt
```

#### touch

创建空文件或更新文件时间戳。

```shell
touch [选项] 文件名...
```

**常用参数**：

- `-c`：不创建任何文件，仅当文件存在时才修改时间戳。
- `-t`：指定时间戳（格式 `[[CC]YY]MMDDhhmm[.ss]`）。
- `-r`：参考另一个文件的时间戳来设置。
- `-a`：只改**访问时间**。
- `-m`：只改**修改时间**。

**时间格式规则**：

- `CC`：世纪（19/20，可省略）
- `YY`：年份后两位
- `MM`：月份 01~12
- `DD`：日期 01~31
- `hh`：小时 00~23
- `mm`：分钟 00~59
- `.ss`：秒数 00~59，可选

**平台差异**：Windows cmd 无原生 `touch` 命令，可使用 `copy nul filename` 创建空文件。

```shell
touch log5.txt
touch log.txt
touch -t 202603021008.55 log.txt
touch -r err.txt log.txt
```

**注意**：修改创建时间，`SetFile -d "02/02/2026 10:30:00" log.txt`。

#### cat

查看文件内容（一次性输出整个文件）。

```shell
cat [选项] [文件...]
```

**常用参数**：

- `-n`：对所有输出行编号。
- `-b`：仅对非空行编号。
- `-s`：压缩连续的空行为一行。

**平台差异**：Windows cmd 使用 `type` 命令。

```shell
cat log.txt
cat -n log.txt
cat -b vite.config.js
cat -s vite.config.js
```

#### stat

显示文件或文件系统的详细状态信息。

```shell
stat [选项] 文件...
```

**常用参数**：

- `-f 格式`：自定义输出格式。
- `-x`：以扩展格式显示详细信息。
- `-s`：以 shell 可解析的格式输出。
- `-l`：显示链接信息。

**格式占位符**：

- `%z`：文件大小（字节）。
- `%Sm`：最后修改时间。
- `%Sa`：最后访问时间。
- `%B`：块大小。

```shell
stat log.txt
stat -x log.txt
stat -f "%z bytes" log.txt
```

#### less  / more

分页查看大文件（逐屏显示，支持上下滚动）。

```shell
less [选项] 文件名
more [选项] 文件名
```

**less 常用参数**：

- `-N`：显示行号。
- `-S`：不换行，长行可左右滚动。
- `-F`：若文件内容少于一屏则直接退出（类似 `cat`）。

**more 常用参数**：

- `-d`：提示按空格继续、按 q 退出。
- `-s`：压缩连续空行为一行。

**交互操作**：

- `less`：空格 / `f` 下一页，`b` 上一页，`/` 关键词搜索，`n` 下一个匹配，`q` 退出。
- `more`：空格下一页，`b` 上一页，`q` 退出。

**平台差异**：Windows cmd 无原生 `less`，`more` 功能较简陋。

```shell
less vite.config.js
less -N vite.config.js
less -S vite.config.js
less -F vite.config.js

more vite.config.js
more -d vite.config.js
more -s vite.config.js
```

**一句话：`more` 是基础版分页查看，`less` 是增强版（功能更强）。**

#### head / tail

查看文件开头或结尾部分。

```shell
head [选项] 文件名
tail [选项] 文件名
```

**head 常用参数**：

- `-n [数量]`：显示前 N 行（`-n 20` 或简写 `-20`）。
- `-c [字节数]`：显示前 N 个字节。

**tail 常用参数**：

- `-n [数量]`：显示后 N 行（`-n 20` 或简写 `-20`）。
- `-c [字节数]`：显示后 N 个字节。
- `-f`：动态跟踪文件增长（常用于查看实时日志）。
- `-F`：类似 `-f`，但文件被轮转后能重新打开。
- `--pid=PID`：与 `-f` 配合，当指定进程结束后也停止跟踪。

**平台差异**：Windows cmd 无原生 `head`/`tail`，可用 `more` 或 `find` 模拟部分功能。

```shell
head vite.config.js
head -n 20 vite.config.js
head -20 vite.config.js
head -c 100 vite.config.js

tail vite.config.js
tail -n 20 vite.config.js
tail -20 vite.config.js
tail -c 100 vite.config.js
tail -f vite.config.js
tail -F vite.config.js
```

#### ln

创建链接文件（硬链接或符号链接）。

```shell
ln [选项] 目标文件 链接名
```

**常用参数**：

- `-s`：创建符号链接（软链接），不使用时创建硬链接。
- `-f`：强制覆盖已存在的链接文件。
- `-n`：若链接名是一个指向目录的符号链接，将其视为普通文件处理。
- `-v`：显示详细过程。

**概念区别**：

- **硬链接**：与源文件指向同一 inode，删除源文件不影响硬链接，不能跨文件系统，不能链接目录。
- **符号链接**：独立文件，存储源文件路径，删除源文件则链接失效（悬空链接），可跨文件系统，可链接目录。

**平台差异**：Windows cmd `mklink` 命令（需管理员权限），`mklink /D` 创建目录符号链接，`mklink /H` 硬链接。

```shell
ln log.txt log-link
ln -s log.txt log-link
ln -f log.txt log-link
ln -fv log.txt log-link
```

#### basename / dirname

从路径中提取文件名和目录部分。

```shell
basename /Users/$USER/Documents
basename /Users/$USER/Documents/log.txt .txt
dirname /Users/$USER/Documents
```

### 文件查找与内容处理

* `find`：按条件查找文件。
* `grep`：搜索文件内容。
* `sed`：流式编辑文本。
* `sort`：排序文本行。
* `uniq`：去重相邻行（常与 `sort` 结合使用）。
* `wc`：统计行数、单词数、字节数。
* `cut`：按列切分文本。

#### find

在指定目录下按条件查找文件或目录。

```shell
find [路径...] [表达式]
```

**常用参数（表达式部分）**：

- `-name 模式`：按文件名查找（支持通配符 `*` `?`，需加引号）。
- `-iname 模式`：忽略大小写的文件名匹配。
- `-type 类型`：按类型（`f` 普通文件，`d` 目录，`l` 符号链接）。
- `-size [+-]大小`：按大小（`c` 字节，`k` KB，`M` MB，`G` GB）。
- `-mtime [+-]n`：按修改时间（`+n` 表示 n 天前，`-n` 表示 n 天内）。
- `-exec 命令 {} \;`：对找到的每个文件执行命令。
- `-exec 命令 {} +`：与 `-exec` 类似，但将多个文件一次性传给命令（效率更高）。
- `-delete`：删除找到的文件。
- `-print`：打印结果（默认行为）。

**平台差异**：Windows cmd 无原生 `find`，有 `where` 命令（仅按文件名）。

```shell
find .
find . -name vite
find . -name src -type d
find . -name "*.vue" -size +20k
find . -name "*.md" -mtime -1
find . -name "*.md" -mtime -1 -exec ls -l {} \;
find . -name "*.md" -mtime -1 -exec ls -l {} +
```

#### grep

**grep** 是全局正则表达式打印（Global Regular Expression Print），用于搜索文件内容中的匹配模式（支持正则表达式）。

```shell
grep [选项] 模式 [文件...]
```

**常用参数**：

- `-i`：忽略大小写。
- `-r` 或 `-R`：递归搜索目录下的所有文件。
- `-n`：显示匹配行的行号。
- `-v`：反向选择，输出不匹配的行。
- `-l`：只输出包含匹配内容的文件名。
- `-L`：只输出不包含匹配内容的文件名。
- `-E`：使用扩展正则表达式（等价于 `egrep`）。
- `-A n`：显示匹配行及其后 n 行（After）。
- `-B n`：显示匹配行及其前 n 行（Before）。
- `-C n`：显示匹配行及其前后各 n 行（Context）。
- `-o`： 只输出**匹配到的内容**，不输出整行。
- `-w`：精确匹配**完整单词**，不匹配片段。
- `-x`：整行完全匹配。
- `-c`：只统计匹配行数，不展示内容。
- `-q`：静默匹配，只看是否命中，无输出（脚本判断用）。
- `-s`：忽略不存在文件、权限报错等错误信息。
- `-F` 当作**纯字符串**匹配，禁用正则（等价 fgrep）。
- `--color`：匹配内容高亮显示。
- `--exclude=xxx`：排除指定文件。
- `--exclude-dir=xxx`：排除指定目录。

**平台差异**：Windows cmd 使用 `findstr`（功能较弱）。

```shell
grep "echarts" ./*
grep -n "echarts" ./*
grep -r "echarts" .
grep -rl "echarts" .
grep -rl "echarts" src/pages src/common
grep -rc "echarts" src/pages
grep -rl "echarts" . --exclude-dir=node_modules
grep -r -E "^(.+)_LOCALHOST_ENV" --exclude-dir=node_modules
grep -r -C 10 "echarts" .
```

#### sed

流编辑器 是流编辑器（Stream Editor），常用于查找替换。

```shell
sed [选项] '命令' 文件...
```

**常用参数**：

- `-i`：直接修改文件（不加 `-i` 只输出到屏幕）。
- `-i.bak`：直接修改，同时备份为 `.bak` 文件。
- `-e`：执行多个命令。
- `-n`：安静模式，仅输出被处理的行（常与 `p` 命令配合）。

**常用命令**：

- `s/old/new/`：替换每行第一个 `old` 为 `new`。
- `s/old/new/g`：替换每行所有 `old` 为 `new`（global）。
- `s/old/new/2`：替换每行第二个 `old`。
- `a`：匹配行**下方**追加内容。
- `i`：匹配行**上方**插入内容。
- `d`：删除行。
- `p`：打印行（常与 `-n` 配合）。
- `nq`：处理到第 n 行后退出。

```shell
sed "s/原文/修改/" log.txt
sed "s/原文/修改/g" log.txt
sed "s/原文/修改/2" log.txt

sed -i "" "s/原文/修改/" log.txt # -i 后面必须传一个空字符串

sed '2d' log.txt     # 删除第二行
sed '2,5d' log.txt   # 删除2-5行
sed '/信息/d' log.txt # 删除含字符『信息』行

sed -n '2p' log.txt     # 只打印第二行
sed -n '/信息/p' log.txt # 只打印含字符『信息』行

sed '3q' test.txt # 读到第三行，退出
```

#### sort

对**文本行**进行排序。

```shell
sort [选项] [文件...]
```

**常用参数**：

- `-n`：按数值大小排序（默认按字典序）。
- `-r`：反向排序（降序）。
- `-k 字段`：按指定字段排序（如 `-k 2` 按第二字段）。
- `-t 分隔符`：指定字段分隔符（默认空白）。
- `-u`：去重（等同于先 sort 再 uniq）。
- `-h`：按人类可读数值排序（如 2K, 1M, 3G）。
- `-o 文件`：将结果写入文件（而不是重定向）。

```shell
sort log.txt
sort -r log.txt
sort -r -k 2 log.txt
sort -u log.txt
```

#### uniq

去重相邻行（通常与 `sort` 结合使用）。

```shell
uniq [选项] [输入文件 [输出文件]]
```

**常用参数**：

- `-c`：在每行前显示重复次数。
- `-d`：仅显示重复的行（每个重复组显示一次）。
- `-u`：仅显示不重复的行（全局唯一）。
- `-i`：忽略大小写。
- `-f N`：跳过前 N 个**字段**进行比较。
- `-s N`：跳过前 N 个**字符**进行比较。

**注意**：`uniq` 只去除**相邻**重复行，因此通常需要先 `sort`。

```shell
sort log.txt | uniq -c
sort log.txt | uniq -d
sort log.txt | uniq -u
```

#### wc

统计行数、单词数、字节数。

```shell
wc [选项] [文件...]
```

**常用参数**：

- `-l`：统计行数。
- `-w`：统计单词数。统计中文 = 被【空格 / 换行】分割的片段数量 +  **空白符（空格、换行、制表符）**。
- `-c`：统计字节数。
- `-m`：统计字符数（与 `-c` 在多字节编码下不同）。
- `-L`：显示最长行的长度。

**平台差异**：Windows cmd：无原生 `wc`。

```shell
wc -l log.txt
wc -w log.txt
wc -c log.txt
wc -m log.txt
wc -L log.txt
```

#### cut

按列切分文本，提取指定字段或字符。

```shell
cut [选项] [文件...]
```

**常用参数**：

- `-d 分隔符`：指定字段分隔符（默认制表符 `\t`）。
- `-f 字段列表`：指定要提取的字段（配合 `-d` 用）。
- `-c 字符列表`：按**字符位**置提取（如 `1-5`，`2,4`）。
- **`-b`**：按**字节**截取（一般不用）。

```shell
cut -d : -f 1,2 log.txt
cut -c 3- log.txt
cut -c 1,2 log.txt
```

### 权限与进程管理

* `chmod`：修改文件权限。
* `chown`：修改文件所有者。
* `ps`：查看进程状态。
* `top`：动态查看系统资源占用。
* `kill`：终止进程。
* `sudo`：以超级用户权限执行命令。
* `lsof`：列出打开的文件（含网络连接、端口占用等）。

#### chmod

chmod（change mode） 修改文件或目录的**权限**。

```shell
chmod [选项] 模式 文件...
```

```shell
-rw-r--r--@ 1 lizhao  staff  61  5 20 12:59 log.txt
# -rw-r--r--：-表示代表这是普通文件；rw-表示文件所有者的权限；r--表示同组用户的权限；r--表示其他所有用户的权限
# staff：macOS 系统默认的用户组
```

**常用参数**：

- `-R`：递归修改目录及其内部所有文件。
- `-v`：显示详细修改过程。

**符号模式**：`[ugoa][+-=][rwxXst]`

- `u`：所有者（user）
- `g`：所属组（group）
- `o`：其他用户（others）
- `a`：全部（all，等同于 ugo）
- `+`：添加权限
- `-`：移除权限
- `=`：精确设置权限
- `r`：读权限
- `w`：写权限
- `x`：执行权限
- `X`：目录或已有执行权限的文件才添加执行权限

**数字模式**：三位八进制数

- 第一位：所有者权限
- 第二位：所属组权限
- 第三位：其他用户权限
- 权限值：`r=4`，`w=2`，`x=1`（如 `7=rwx`，`5=r-x`）

**平台差异**：传统 Windows 文件系统（FAT32/NTFS）不使用 Unix 权限模型。Git Bash/WSL 中可正常使用。

```shell
chmod +x myshell.sh   # 加执行权限
chmod 755 myshell.sh  # 所有都加权限 rwx；所属组加权限 r-x；其他用户权限 r-x
chmod -R g+w dir/     # 给所属组添加写权限
chmod a-x myshell.sh  # 除所有人的执行权限
```

#### chown

chown（change owner）修改文件 / 目录**所有者**。

```shell
chown [选项] [用户][:组] 文件...
```

**常用参数**：

- `-R`：递归修改目录及其内部所有文件。
- `-v`：显示详细修改过程。

**格式说明**：

- `chown user file`：仅修改所有者。
- `chown :group file`：仅修改所属组。
- `chown user:group file`：同时修改所有者和组。
- `chown user: file`：修改所有者和组（组为用户的主组）。

**平台差异**：Windows 的 Git Bash/WSL 中可正常使用（需在 Linux 文件系统中）。

```shell
chown lizhao log.txt
chown :zhao log.txt
chown lizhao: log.txt
chown lizhao:zhao log.txt
chown lizhao:zhao *.txt

chown -R lizhao log
```

#### ps

显示当前系统中的进程信息。

```shell
ps [选项]
```

**常用参数 BSD 风格（推荐）**：

- `a`：显示所有终端的进程（包括其他用户）。
- `u`：显示面向用户的格式（用户、CPU、内存等）。
- `x`：显示没有控制终端的进程（如守护进程）。
- `aux`：最常用组合，显示所有用户的所有进程。

```shell
ps aux
ps aux | head -3
ps aux | grep zsh
```

**常用参数 System V 风格**：

- `-e` 或 `-A`：所有进程。
- `-f`：完整格式（PPID、UID、时间等）。
- `-ef`：常用组合，显示所有进程的完整格式。
- `-l`：长格式。
- `-u 用户名`：显示指定用户的进程。
- `-p PID`：显示指定 PID 的进程。

- `-o`：指定要显示的列。比如：pid,ppid,cmd,%cpu,%mem，表示进程号、父进程号、命令、CPU占比、内存占比。

```shell
ps -ef
ps -el
ps -u $USER
ps -p 37009
ps -eo pid,ppid,cmd,%cpu,%mem
```

#### top

动态实时查看系统资源占用和进程状态。

```shell
top [选项]
htop [选项]
```

**top 常用参数（macOS）**：

- `-s 秒数`：设置界面刷新间隔。
- `-pid PID`：仅监控指定进程。
- `-o 排序字段`：按字段排序，`-字段` 降序。
- `-l 次数`：输出指定轮次后退出（替代 - n）。
- `-stats 列名`：自定义展示列。

```shell
top -s 2 -pid 18268
top -s 2 -l 3 -pid 18268
```

#### kill

向进程发送信号（常用于终止进程）。

```shell
kill [选项] PID...
```

**常用参数**：

- `-l` 或 `-L`：列出所有信号名称。
- `-9` 或 `-KILL`：强制终止（进程不可捕获，无法清理）。
- `-15` 或 `-TERM`：默认信号，正常终止（进程可捕获，允许清理）。
- `-2` 或 `-INT`：中断信号，相当于 Ctrl+C。
- `-1` 或 `-HUP`：挂起信号（常用于重新加载配置，如 nginx、systemd 服务。不用需要恢复）。
- `-STOP`：暂停进程（不是终止）。
- `-CONT`：恢复被暂停的进程。

**平台差异**：Windows 使用 `taskkill /PID 1234 /F`。

```shell
kill -l
kill -9 18268
kill -2 81423
kill -KILL 18268
kill -HUP 82812
kill -STOP 82812
kill -CONT 82812
```

```shell
# 清除占用端口的进程
kill -9 $(lsof -ti :9600)
```

#### sudo

**sudo**（Super User Do）以超级用户或其他用户身份执行命令。

```shell
sudo [选项] 命令
```

**常用参数**：

- `-u 用户`：以指定用户身份执行（默认 root）。
- `-i`：模拟初始登录，加载目标用户的完整环境。
- `-s`：仅启动目标用户的 shell（不加载完整环境）。
- `-k`：清空缓存密码，下次 sudo 必须重输。
- `-K`：彻底删除 sudo 身份凭证。
- `-l` 或 `--list`：列出当前用户允许执行的命令。
- `-b`：在后台运行命令。
- `-E`：保留当前用户的环境变量。
- `-H`：将 `$HOME` 设置为目标用户的家目录。

**平台差异**：Windows：无原生 `sudo`，PowerShell 中可以右键“以管理员身份运行”，或使用 `Start-Process -Verb RunAs`。Windows 11 2024 更新后开始引入类似 `sudo` 的功能。

```shell
sudo -u nginx
sudo -i
sudo -l
sudo -s
sudo -E env
```

#### lsof

**lsof**（List Open Files）列出当前系统打开的文件（在 macOS/Linux 中一切皆文件，包括普通文件、目录、网络连接、设备等）。

```shell
lsof [选项] [名称...]
```

**常用参数**：

- `-i`：显示网络连接（Internet 地址）。
- `-i :端口号`：显示指定端口的网络连接。
- `-i TCP` 或 `-i UDP`：仅显示 TCP 或 UDP 连接。
- `-p PID`：显示指定进程 ID 打开的文件。
- `-u 用户名`：显示指定用户打开的文件。
- `-c 进程名`：显示指定进程名打开的文件。
- `-t`：仅输出 PID（适合脚本使用）。
- `-n`：不解析主机名（显示 IP 地址，速度更快）。
- `-P`：不解析端口名（显示端口号，不转换为服务名）。
- `-i4` / `-i6`：仅显示 IPv4 或 IPv6 连接。
- `+d 目录`：列出目录下打开的文件（不递归）。
- `-D 目录`：递归列出目录下打开的文件（macOS 支持）。

```shell
lsof -i
lsof -i :9600
lsof -i tcp
lsof -p 90276
lsof -p 90276
lsof -c node
lsof -t -i :9600
lsof /Users/$USER/Documents
```

### 压缩与打包

* `tar`：打包或解包文件（常用 `-czf` 压缩，`-xzf` 解压）。
* `gzip` / `gunzip`：压缩或解压 `.gz` 文件。
* `zip` / `unzip`：处理 `.zip` 压缩包。

#### tar

打包或解包文件（常与压缩结合使用）。

```shell
tar [选项] 归档文件 [文件或目录...]
```

**基本操作参数**：

- `-c`：创建归档文件。
- `-x`：解包归档文件。
- `-t`：列出归档内容。

**压缩类型参数**：

- `-z`：通过 gzip 压缩/解压（`.tar.gz` 或 `.tgz`）。
- `-j`：通过 bzip2 压缩/解压（`.tar.bz2` 或 `.tbz2`）。
- `-J`：通过 xz 压缩/解压（`.tar.xz`）。

**其他常用参数**：

- `-f`：指定归档文件名（必须紧跟参数，如 `-f archive.tar`）。
- `-v`：显示处理的文件列表。
- `-C 目录`：解包时切换到指定目录。
- `-p`：保留原文件权限。
- `-r`：向已存在的归档文件中追加文件（不能用于压缩文件）。

**平台差异**：Windows 原生不支持 tar，但 Windows 10 1803+ 开始内置 tar 命令（功能有限）。

```shell
# 只打包，不压缩
tar -cvf log.tar f1.txt f2.f3 dir1

# 创建压缩包
tar -czvf log.tar.gz log.txt
tar -cjvf log.tar.bz2 log.txt

# 解压
tar -xzvf log.tar.gz
tar -zxvf log.tar.gz -C $(pwd)/temp
mkdir -p temp && tar -zxvf log.tar.gz -C $(pwd)/temp

# 查看
tar -tzvf log.tar.gz
```

#### gzip / gunzip

压缩或解压文件（只压缩单个文件，不打包目录）。

```shell
gzip [选项] 文件...
gunzip [选项] 文件.gz...
```

**gzip 常用参数**：

- `-d`：解压缩（等同于 `gunzip`）。
- `-c`：将结果输出到标准输出（保留原文件）。
- `-r`：递归压缩目录内文件。
- `-1` 至 `-9`：压缩级别（1 最快、体积最大，9 最慢、体积最小，默认 6）。
- `-l`：显示压缩文件信息。
- `-k`：保留原文件（默认 gzip 会删除原文件）。

**gunzip 常用参数**：

- `-c`：将解压结果输出到标准输出（保留压缩包）。
- `-f`：强制解压（覆盖已存在的文件）。
- `-k`：保留压缩包（解压后不删除 .gz 文件）。

**平台差异**：Windows：原生不支持，Git Bash/WSL 中可用。

```shell
gzip -k log.txt
gzip -c log.txt > log.txt.gz
gzip -9 log.txt
gzip -l log.txt.gz
gzip -d log.txt.gz

gunzip log.txt.gz
gunzip -c log.txt.gz > log.txt
```

#### zip / unzip

处理 `.zip` 格式的压缩包（跨平台兼容性好）。

```shell
zip [选项] 压缩包名 文件...
unzip [选项] 压缩包名
```

**zip 常用参数**：

- `-r`：递归压缩目录。
- `-m`：压缩后删除原文件。
- `-e`：加密（会提示输入密码）。
- `-数字`：压缩级别（0-9，0 仅存储不压缩）。
- `-q`：安静模式（不输出信息）。
- `-u`：更新压缩包中的文件（仅当文件更新时）。
- `-d`：从压缩包中删除文件。

**unzip 常用参数**：

- `-d 目录`：解压到指定目录。
- `-l`：列出压缩包内容（不解压）。
- `-o`：覆盖已存在文件时不提示。
- `-n`：不覆盖已存在的文件。
- `-p`：将内容输出到标准输出（用于管道）。
- `-q`：安静模式。

```shell
zip log.zip log.txt
zip -r project.zip project

unzip log.zip
unzip -l log.zip
```

### 网络操作

* `ping`：测试网络连通性。
* `curl`：发送 HTTP 请求。
* `wget`：下载文件。
* `ssh`：远程登录。
* `scp`：远程复制文件。
* `netstat`：查看网络状态。
* `ifconfig` / `ip`：查看网络接口配置。

#### ping

**ping** 是互联网数据包探查器（Packet Internet Groper），测试网络连通性和延迟。

```shell
ping [选项] 目标地址
```

**常用参数**：

- `-c 次数`：发送指定数量的包后停止。
- `-i 秒数`：每次发送的间隔（默认 1 秒，Linux 需 root 才能小于 0.2 秒）。
- `-s 字节数`：设置发送数据包的大小（默认 56 字节，加上 ICMP 头共 64 字节）。
- `-t TTL`：设置 IP 生存时间（Linux 用 `-t`，Windows 用 `-i`）。
- `-W 秒数`：等待响应的超时时间。
- `-4` 或 `-6`：强制使用 IPv4 或 IPv6。
- `-q`：安静模式，只显示开头和结尾的统计信息。
- `-D`：在每行前显示时间戳（Linux）。

**平台差异**：**Windows** `ping` 默认发 4 个包后停止，参数不同（`-n` 代替 `-c`，`-w` 超时单位毫秒）。

```shell
ping -c 10 izhao.com.cn
```

#### curl

发送 HTTP/HTTPS 请求，也可用于 FTP、SMTP 等协议。

```shell
curl [选项] URL
```

**下载相关参数**：

- `-O`：将文件保存为远程文件名。
- `-o 文件名`：将输出保存到指定文件。
- `-C -`：断点续传。

**请求相关参数**：

- `-X 方法`：指定 HTTP 方法（GET、POST、PUT、DELETE 等）。
- `-H "头:值"`：添加请求头。
- `-d "数据"`：发送 POST 数据（自动设为 `application/x-www-form-urlencoded`）。
- `-F "name=@文件"`：发送 multipart/form-data（用于上传文件）。
- `-b "name=value"`：发送 Cookie。
- `-c 文件`：将服务器设置的 Cookie 保存到文件。
- `-A "字符串"`：设置 User-Agent。

**输出相关参数**：

- `-v`：显示详细通信信息（调试用）。
- `-s`：静默模式（不显示进度和错误）。
- `-L`：跟随重定向（如 301/302）。
- `-k`：允许不安全的 SSL 连接（忽略证书验证）。
- `-I`：仅获取响应头（HEAD 请求）。

```shell
curl -O https://example.com/file.zip

curl -X POST -H "Content-Type: application/json" \
     -d '{"key":"value"}' https://api.example.com

curl 'https://api.izhao.com.cn/api/hello' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -b 'token=b2a5725cf7044ae2ad003d2e609471a4' \
  
curl -F "image=@photo.jpg" https://uploads.example.com
```

**一句话：curl 是多功能网络工具，支持几十种协议，偏向调试、API、上传、请求构造。**

#### wget

网络下载工具，支持递归、断点续传、后台下载等。

```shell
wget [选项] URL
```

**下载控制参数**：

- `-O 文件名`：另存为指定名称。
- `-c`：断点续传。
- `-t 次数`：设置重试次数，0 为无限重试。
- `-T 秒数`：设置连接超时时间。
- `-q`：安静模式，无输出。
- `-v`：详细日志输出。

**递归下载参数**：

- `-r`：开启递归下载。
- `-l 深度`：限制递归层级。
- `-np` / `--no-parent`：不跳转上级目录。
- `-A 后缀`：只下载指定后缀文件。
- `-R 后缀`：排除指定后缀文件。

**其他常用参数**：

- `-b`：后台后台下载。
- `--limit-rate=速率`：限速下载（例：200k、2M）。
- `--user=账号 --password=密码`：网站账号密码认证。
- `-i 文本文件`：读取文件内多行 URL 批量下载。
- `-m` / `--mirror`：全站镜像下载。

```shell
wget -O downloadFile.zip https://example.com/file.zip
wget -c https://example.com/largefile.zip
wget -r -np -l 2 https://site.com/docs/
wget --limit-rate=500k https://example.com/largefile.zip
wget -i urls.txt
```

**一句话：wget 是纯粹的下载工具，偏向文件下载、断点续传、递归整站下载。**

#### ssh

SSH 是安全外壳协议（Secure Shell），**加密远程登录、远程管理服务器**。

```shell
ssh [参数] 用户名@主机IP/域名
```

**常用核心参数：**

- `-p 端口`：指定远程端口（非 22 端口必用）。
- `-i 私钥文件`：使用密钥登录。
- `-L 本地端口:目标IP:目标端口`：**本地端口转发**。
- `-R 远程端口:本地IP:本地端口`：**远程端口转发**。
- `-N`：只建立隧道，不登录终端。
- `-f`：后台运行 SSH 连接。
- `-t`：强制分配虚拟终端。
- `-T`：不分配终端，专门用于测试连接。

**配置文件**：`~/.ssh/config`。

```shell
ssh root@192.168.1.100
ssh -p 2000 user@1.1.1.1
ssh -L 8080:127.0.0.1:80 root@服务器IP

ssh -T git@github.com
ssh -vT git@github.com
ssh -i ~/.ssh/id_rsa_github git@github.com
```

#### scp

**scp**（Secure Copy）基于 SSH 加密传输文件。

```shell
scp [选项] 源 目标
scp [参数] 本地文件 用户名@主机:远程路径
scp [参数] 用户名@主机:远程文件 本地路径
```

**常用参数**：

- `-r`：递归传输整个文件夹。
- `-p`：保留文件修改时间、权限。
- `-P 端口`：指定 SSH 端口（大写 P）。
- `-C`：传输时压缩提速。
- `-i 私钥路径`：指定密钥登录传输。

```shell
scp file.txt user@remote:/home/user/
scp user@remote:/home/user/file.txt ./
scp -r -i key.pem ~/data/ ec2-user@aws:/home/ec2-user/
scp user1@host1:/remote1/file user2@host2:/remote2/
```

#### netstat

显示网络连接、路由表、接口统计等信息。

```shell
netstat [选项]
```

**常用参数**：

- `-a`：显示所有连接和监听端口。
- `-n`：不解析服务名（直接显示 IP 和端口号）。
- `-r`：显示路由表。
- `-i`：显示网络接口统计。
- `-s`：显示各协议的统计信息。
- `-p`：指定协议。

```shell
netstat -an -p tcp
netstat -an -p udp
netstat -an -p tcp | grep 9600
netstat -r
netstat -i
```

#### ifconfig / ip

查看和配置网络接口。

**ifconfig** 是网络接口配置（interface configuration），macOS、旧版 Linux 默认自带。

**ip** 是互联网协议（Internet Protocol），Linux 新一代网络管理命令，是**现代 Linux 主流首选**。macOS 不支持，仅 Linux 使用。

```shell
ifconfig [接口] [选项]
ip [对象] [命令] [选项]
```

```shell
ifconfig
ifconfig en0
# 查看 MAC 地址（物理地址）
ifconfig en0 | grep ether
# 临时开启网卡
ifconfig en0 up
# 临时关闭网卡
ifconfig en0 down
# 临时设置IP
ifconfig en0 192.168.1.105
```

```shell
ip addr
ip link show
ip link set eth0 up
ip link set eth0 down
ip addr add 192.168.1.106/24 dev eth0
ip addr del 192.168.1.106/24 dev eth0
ip route
```

### 系统信息与控制

* `df`：查看磁盘使用情况。
* `du`：查看目录或文件大小。
* `uname`：查看系统信息。
* `hostname`：显示或设置系统的主机名。
* `whoami`：显示当前用户名。
* `which / type`：查找命令的可执行文件路径。
* `date`：显示或设置系统时间。
* `man`：查看命令帮助手册。
* `history`：查看命令历史记录。
* `alias`：创建命令别名。
* `exit`：退出当前 shell。

#### df

**df**（Disk Free）显示文件系统的磁盘使用情况。

```shell
df [选项] [文件或目录]
```

**常用参数**：

- `-h`：以人类可读格式显示（KB、MB、GB）。
- `-H`：以 1000 为基数的人类可读格式（而非 1024）。
- `-i`：显示 inode 使用情况而非块使用情况。
- `-l`：仅显示本地文件系统（不显示网络挂载）。
- `-g`：以 GB 为单位显示。
- `-m`：以 MB 为单位显示。
- `-k`：以 KB 为单位显示（默认）。

```shell
df
df -h
df -h log.txt
df -i /
```

#### du

**du**（Disk Usage）估算文件或目录的磁盘使用空间。

```shell
du [选项] [文件或目录...]
```

**常用参数**：

- `-h`：以人类可读格式显示。
- `-s`：仅显示总计（不显示子项）。
- `-a`：显示文件大小（默认只显示目录）。
- `-c`：显示总计行。
- `-d 深度`：限制显示深度（如 `-d 1` 只显示一级子目录）。
- `-x`：不跨越文件系统边界。

```shell
du -sh /Users/$USER/Documents
du -d 1 -h /Users/$USER/Documents
```

#### uname

**uname**（Unix Name）显示操作系统信息。

```shell
uname [选项]
```

**常用参数**：

- `-a`：显示所有信息（内核名称、主机名、内核版本、硬件架构等）。
- `-s`：显示内核名称（macOS 显示 `Darwin`）。
- `-n`：显示网络主机名。
- `-r`：显示内核版本。
- `-v`：显示内核版本详细信息。
- `-m`：显示硬件架构（如 `x86_64`、`arm64`）。

```shell
uname
uname -a
# Darwin Macmini-USER.local 24.3.0 Darwin Kernel Version 24.3.0: Thu Jan  2 20:22:58 PST 2025; root:xnu-11215.81.4~3/RELEASE_ARM64_T8132 arm64
# Darwin：内核名称
# Macmini-USER.local：电脑的名字
# 24.3.0：Darwin 内核版本号
# Darwin Kernel Version 24.3.0: Thu Jan 2 20:22:58 PST 2025：内核编译时间
# xnu-11215.81.4~3/RELEASE_ARM64_T8132：xnu 是 macOS 内核全名；ARM64_T8132 是 Apple Silicon 芯片；T8132 是 M2 芯片
# arm64：系统架构（M 系列芯片）
```

#### hostname

显示或设置系统的主机名。

```shell
hostname
```

#### whoami

显示当前有效的用户名。

```shell
whoami
```

#### which / type

查找命令的可执行文件路径。

```shell
which node
type node
```

#### date

显示或设置系统时间。

```shell
date [选项] [+格式]
```

**常用参数**：

- `-u`：显示 UTC 时间（协调世界时）。
- `-r 文件名`：显示文件的最后修改时间。
- `-r 秒数`：将指定秒数（从纪元开始）转换为日期时间。
- `+格式`：自定义输出格式（以 `+` 开头）。

**格式占位符**：

- `%Y`：年（四位）
- `%m`：月（01-12）
- `%d`：日（01-31）
- `%H`：小时（00-23）
- `%M`：分钟（00-59）
- `%S`：秒（00-59）
- `%F`：等价于 `%Y-%m-%d`
- `%T`：等价于 `%H:%M:%S`
- `%a`：星期几缩写（如 Mon、Tue）
- `%A`：星期几全称

```shell
date
date "+%Y-%m-%d %H:%M:%S"
date -u
date -r log.txt
date -r 1704067200
```

#### man

**man**（Manual）查看命令的手册页（帮助文档）。

```shell
man [选项] [章节] 命令名
```

**常用参数**：

- `-k 关键词`：搜索手册页名称和描述（等价于 `apropos`）。
- `-f 命令`：显示命令的简短描述（等价于 `whatis`）。
- `-a`：显示所有匹配的手册页（依次显示）。
- `-w`：仅显示手册页路径，不显示内容。

```shell
man ls
man -k ls
man -f ls
man -w ls
```

#### history

显示当前 shell 会话的命令历史记录。

```shell
history [选项]
```

**常用参数**：

- `-n`：仅显示最近 n 条记录。
- `-c`：清除当前会话的历史记录。

- `!!`：重复上一条命令。
- `!n`：重复历史中第 n 条命令。

```shell
history
history -10
!!
!-2
```

#### alias

创建或查看命令别名（简化常用命令）。

```shell
alias [别名[='命令']]
```

**持久化别名（写入配置文件）**：

- **bash**：`~/.bashrc`。
- **zsh**（macOS 默认）：`~/.zshrc`。

```shell
alias
alias gst='git status'
alias gst
unalias gst
```

#### exit

退出当前 shell 或终端会话。

```shell
exit [退出码]
```

**常用形式**：

- `exit`：默认退出码为上一个命令的退出码（`$?`）。
- `exit 0`：正常退出。
- `exit 1`：非正常退出（表示错误）。

### 管道、重定向与作业控制

* `|`：管道，将前一个命令输出作为后一个输入。
* `jobs`：查看后台任务。
* `fg / bg`：将任务放到前台/后台运行。

#### |（管道）

将前一个命令的标准输出作为后一个命令的标准输入。

```shell
ps aux | grep node
ls -la | less
cat log.txt | wc -l
```

#### jobs

显示当前 shell 会话中的后台任务列表。

**注意**：`jobs` 只认**当前终端窗口 / 标签页**的任务，换窗口就看不到了。

```shell
jobs [选项]
```

**常用参数**：

- `-l`：显示进程 PID。
- `-p`：仅显示任务组进程 ID。

```shell
sleep 100 &
jobs
jobs -l
```

#### fg / bg

**fg**（Foreground）将后台任务放到前台运行。

**bg**（Background）将暂停的任务放到后台继续运行。

```shell
fg [任务号]
bg [任务号]
```

**常见用法**：

- `fg`：将最近一个后台任务放到前台。
- `fg %任务号`：将指定任务放到前台。
- `bg`：将最近一个暂停任务放到后台继续运行。
- `bg %任务号`：将指定暂停任务放到后台继续运行。

```shell
sleep 100 &
jobs
fg %1
bg %1
```