## Shell 脚本入门篇

Shell 是一种**命令行解释器**，它充当用户与操作系统内核之间的桥梁。用户在 Shell 中输入命令，Shell 负责解释这些命令并调用内核执行。

Shell 的主要功能包括：

- **命令解释**：解释和执行用户命令，并传递给内核；
- **程序调用**：支持调用其他程序并传递参数；
- **输入输出重定向**：控制数据的流向；
- **管道连接**：将一个程序的输出作为另一个程序的输入；
- **编程能力**：支持变量、条件判断、循环等编程特性。

计算机中，真正能够控制计算机硬件（CPU、内存、显示器等）的只有操作系统内核。

由于安全、复杂、繁琐等原因，用户不能直接接触内核（也没有必要），需要**另外再开发一个程序**，让用户直接使用这个程序；该程序的作用就是接收用户的操作（点击图标、输入命令），并进行简单的处理，然后再传递给内核。如此一来，用户和内核之间就多了一层“代理”，这层“代理”既简化了用户的操作，也保护了内核。 在Linux下，这个命令行程序叫做 **Shell**。

### 什么是 Shell？

在计算机科学中，Shell 俗称"壳"（用来区别于"核"即 Kernel），是指**为使用者提供操作界面**的软件，它接收用户命令并调用相应的应用程序。

**内核和Shell（最核心关系）**：

- **内核（Kernel）**：操作系统底层核心，直接管理硬件（CPU、内存、磁盘、网卡），**不直接面向用户**，只提供系统调用接口。
- **壳（Shell）**：接收用户输入（命令 / 鼠标点击）、**解析命令 → 调用内核系统调用 → 显示结果**，Shell 是**普通应用程序**，不是内核一部分。

**Shell 两大分类：**

* **图形界面 Shell（GUI）**：可视化窗口、图标、菜单、鼠标操作。。比如：Windows 的 Windows Explorer（资源管理器），macOS 的 Finder，Linux 的 GNOME、KDE、Xfce、X 窗口管理器等。
* **命令行界面 Shell（CLI）**：纯文本界面，靠键盘输入命令。经典的 sh（Bourne Shell），Windows 的 cmd.exe，Linux 主流 的 bash、zsh 等。

**Shell 的双重身份**：

* **交互界面程序**：让人能操作系统（CLI / GUI）。
* **脚本编程语言**：有变量、循环、判断、函数等语法，可编写**Shell 脚本**。

#### Shell 的起源与历史

Shell 的概念最早出现在 1971 年的 Unix 系统中：

- **1971年**：Thompson shell（/bin/sh），第一个 Unix shell
- **1977年**：Bourne shell（sh），由 Stephen Bourne 开发，成为标准
- **1978年**：C shell（csh），引入类似 C 语言的语法
- **1983年**：Korn shell（ksh），兼容 Bourne shell 并增强功能
- **1989年**：Bash（Bourne Again Shell），由 Brian Fox 开发，成为 Linux 默认 shell

#### Shell 有哪些类型？

**常见 Shell 类型：**

| Shell 名称   | 说明                       | 特点                   | 常见系统                  |
| :----------- | :------------------------- | :--------------------- | :------------------------ |
| **sh**       | Bourne Shell               | 最早的 shell，语法简洁 | Unix 系统                 |
| **bash**     | Bourne Again Shell         | 功能最丰富，兼容 sh    | Linux 默认                |
| **zsh**      | Z Shell                    | 功能强大，插件丰富     | macOS 默认（Catalina 起） |
| **csh/tcsh** | C Shell                    | C 语言风格语法         | FreeBSD                   |
| **ksh**      | Korn Shell                 | 性能优异，脚本能力强   | AIX 系统                  |
| **fish**     | Friendly Interactive Shell | 用户友好，开箱即用     | 需手动安装                |

**Windows、macOS 的默认和推荐 Shell：**

| 系统    | 默认 Shell              | 推荐使用                                       |
| :------ | :---------------------- | :--------------------------------------------- |
| Windows | cmd / PowerShell        | **Git Bash**（包含 bash）、WSL（Linux 子系统） |
| macOS   | zsh（从 Catalina 开始） | 直接使用 Terminal 中的 zsh 或 bash             |

#### 如何查看当前 Shell？

```shell
# 查看当前使用的 shell
echo $SHELL

# 查看当前 shell 的版本
bash --version

# 查看系统所有可用的 shell
cat /etc/shells
```

#### Shell 作为编程语言

Shell 不只是命令行，**它是一门完整的解释型脚本语言**，核心特性：

- **解释型**：无需编译，逐行执行。
- **变量**：全局 / 局部、环境变量、数组。
- **流程控制**：if-else、for、while、case。
- **函数**：可定义、可传参、可返回值。
- **字符串处理**：截取、替换、匹配、正则。
- **文件操作**：创建、删除、遍历、权限修改。
- **管道 |、重定向 >/>>/<<**：命令串联、输入输出控制。
- **信号处理 trap**：捕获 Ctrl+C、退出、错误。
- **命令替换 ` `` 或 $()`**：嵌套执行命令。

#### 不同 Shell 的语法差异

```shell
# Bash/Zsh (推荐写法)
if [[ "$USER" == "root" ]]; then
  echo "Welcome, admin!"
fi

# Csh/Tcsh 风格
if ( $USER == "root" ) then
  echo "Welcome, admin!"
endif

# 数组定义差异
# Bash 数组
arr=(1 2 3 4 5)
echo ${arr[0]}

# Fish 数组（语法完全不同）
set arr 1 2 3 4 5
echo $arr[1]
```

### Shell 的平台差异

#### Windows（推荐 Git Bash）

Windows 原生使用 cmd 或 PowerShell，语法与 Unix Shell 完全不同。

**推荐方案**：

- **Git Bash（最推荐）**：随 Git for Windows 一起安装，提供完整的 bash 环境，支持大部分 Linux 命令。
- **WSL (Windows Subsystem for Linux)**：在 Windows 上原生运行 Linux，可使用 Ubuntu、Debian 等发行版，完整的 Linux 体验。
- **MSYS2/Cygwin**：提供 Unix-like 环境，适合编译 Unix 程序。

#### macOS（默认 zsh）

macOS 基于 Darwin（Unix 内核），与 Linux 高度兼容。

**macOS 特点**：

- 原生支持 bash 和 zsh。
- 从 Catalina（10.15）开始默认使用 zsh。
- Homebrew 提供强大的包管理。

#### Linux（默认 bash）

Linux 默认使用 bash，部分发行版开始改用 zsh。

### 第一个 Shell 脚本示例

Shell 脚本编程跟 JavaScript、php 编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。

#### 创建脚本

**创建一个文件 myshell.sh。** .sh 是扩展名，表示是 shell 脚本文件（没有扩展名也能正常运行）。

```shell
#!/bin/bash

name="Lizhao"
current_time=$(date +"%Y-%m-%d %H:%M:%S")

echo "Hello, $name!"
echo "Current time: $current_time"

exit 0
```

**注意**：`#!/bin/bash` 是注释，也是脚本的第一行，称为 shebang，指定解释器，也就是告诉系统用哪个程序来执行这个脚本。

#### 运行脚本

**直接运行解释器**：

```shell
/bin/sh myshell.sh
/bin/sh -x myshell.sh     # 显示每条命令的执行过程
/bin/sh -n myshell.sh     # 仅检查语法，不执行
/bin/sh -v myshell.sh     # 显示原始命令（不展开变量）

sh myshell.sh
zsh myshell.sh
bash myshell.sh
```

**备注**：这种方式运行，不需要在第一行指定解释器信息（即，`#!/bin/bash`），写了也没用。

**作为可执行程序：**

```shell
./myshell.sh
```

**备注**：，一定是 **./myshell.sh**，而不是 **myshell.sh**。直接执行 **myshell.sh**，系统会去 PATH 里找 myshell.sh，而当前目录通常不在 PATH 里，当然也就找不到。**./myshell.sh** 则告诉系统说，就在当前目录找。

#### 可执行权限

直接执行 `./myshell.sh`，可能会报错：
```shell
./myshell.sh
# zsh: permission denied: ./myshell.sh
```

这是脚本文件**没有「可执行权限」**，系统不让运行。

终端里执行这条命令，给脚本加权限：

```shell
# 添加执行权限
chmod +x ./myshell.sh
./myshell.sh
```

```shell
# 检查是否有权限：输出结果有 x 代表有权限
# 没有权限：-rw-r--r--@ 1 lizhao  staff  133  5 19 15:33 myshell.sh
# 有权限：  -rwxr-xr-x@ 1 lizhao  staff  133  5 19 15:33 myshell.sh
ls -l myshell.sh

# 移除所有执行权限
chmod -x ./myshell.sh

# 还原默认权限
chmod 644 ./myshell.sh
```

### Shell 传递参数

在 Shell 脚本中，`$n` 用于获取传递给脚本的参数。**n** 代表一个数字，$0 为执行的文件名（包含文件路径），$1 为执行脚本的第一个参数，$2 为执行脚本的第二个参数，${10} 表示第10参数（10 及以上需用花括号）。

```shell
#!/bin/bash

name=$1
current_time=$(date +"%Y-%m-%d %H:%M:%S")

echo $0
echo $1
echo $10 # 相当于 $1 + '0'
echo ${10}
echo 参数个数：$#
echo 所有参数（作为一个字符串）：$*
echo 所有参数（作为独立参数）：$@
echo 当前 Shell 进程 ID：$$
echo 上一条命令的退出状态：$?
echo 最后一个后台进程的：$!
echo Shell 当前选项：$-
echo "Hello, $name!"
echo "Current time: $current_time"

exit 0
```

```shell
sh myshell.sh Lizhao 2 3 4 5 6 7 8 9 10 11
# myshell.sh
# Lizhao
# Lizhao0
# 10
# 参数个数：11
# 所有参数（作为一个字符串）：Lizhao 2 3 4 5 6 7 8 9 10 11
# 所有参数（作为独立参数）：Lizhao 2 3 4 5 6 7 8 9 10 11
# 当前 Shell 进程 ID：5899
# 上一条命令的退出状态：0
# 最后一个后台进程的：
# Shell 当前选项：hB
# Hello, Lizhao!
# Current time: 2026-05-19 16:13:25
```

**特殊参数详解**：

* **$0**：脚本文件名（含路径）。
* **$1-$9**：第 1-9 个参数。

* **${10}**：第 10 个参数（10 以上需用花括号）。

* **$#**：参数个数。

* **$***：所有参数（作为一个字符串）。

* **$@**：所有参数（作为独立参数）。

* **$$**：当前 Shell 进程 ID。

* **$?**：上一条命令的退出状态。

* **$!**：最后一个后台进程的。

* **$-**：Shell 当前选项。

### Shell 变量

#### Shell 变量定义

Shell 变量名的命名基本规则：

- 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头。
- 中间不能有空格，可以使用下划线 **_**。
- 变量名和等号之间不能有空格。
- 不能使用标点符号。
- 不能使用 bash 里的关键字，如：readonly、set、export、test、if 等。

```shell
# 正确示例
name="Lizhao"         # 字符串
count=100             # 数字（实际也是字符串）
_private_var="abcd"   # 下划线开头
my_name_is="Lizhao"   # 多个单词用下划线

# 错误示例
1st_var="error"       # 不能以数字开头
my var="error"        # 不能有空格
my-var="error"        # 不能使用连字符
if="error"            # 不能使用关键字
```

```shell
#!/bin/bash

name="Lizhao"
readonly max_count=100

echo $name
echo ${name}
echo "Hello，${name}"

unset name

echo "${name:-Li}"     # 如果 name 为空，输出 Li
echo "${name:=Li}"     # 如果 name 为空，赋值为 Li
echo "${name:?变量未设置}"  # 如果 name 为空，报错退出
echo "${#name}"           # 获取变量长度
```

#### Shell 变量类型

Shell 中的变量分为三种类型：

- **局部变量：** 只能在当前 shell 中使用。
- **环境变量：** 所有子进程都能访问，必要的时候 shell 脚本也可以定义环境变量。
- **shell变量：** Shell 内置的特殊变量。

```shell
# 局部变量（默认）
local_var="只能在当前 shell 中使用"

# 环境变量（export 导出）
export ENV_VAR="所有子进程都能访问"

# Shell 变量（Shell 内置的特殊变量）
echo "当前 shell: $BASH_VERSION"
echo "当前用户: $USER"
echo "当前目录: $PWD"
```

#### Shell 数据类型

Shell 字符串可以单引号、双引号、反引号（）或者不用引号：

* **无引号**：shell 全力解析变量和命令、拆分、通配符。
* **单引号**：原样输出。不解析变量、不转义、不识别特殊字符，不能嵌套单引号。
* **双引号**：**只解析变量和反引号**。识别`$变量`、`命令`，屏蔽通配符 *、空格分割、别名等，大部分特殊字符不转义。
* **反引号**：**用来执行命令**，执行完把**结果替换出来**。等价于 `$()`，推荐用 `$()` 更清晰。

```shell
#!/bin/bash
name=Lizhao
echo $name a  b *
echo '$name a  b *'
echo "$name a  b *"
echo `date +%Y-%m-%d`
echo $(date +%Y-%m-%d)
```

```shell
# Lizhao a b Shell myshell.sh
# $name a  b *
# Lizhao a  b *
# 2026-05-19
```

**注意**：无引号，通配符（*）表示当前目录下 所有文件、所有文件夹 的名字。

Shell 只支持一维数组（不支持多维数组）：

```shell
#!/bin/bash

chars=("a" "b" "c")
numbers=([0]=1 [1]=2 [2]=3)
colors=()
colors[0]="red"
colors[1]="green"
colors[2]="blue"

# 访问数组元素
echo ${chars[0]} # 第一个元素：apple
echo ${chars[@]} # 所有元素
echo ${chars[*]} # 所有元素（作为字符串）

# 数组操作
echo ${#chars[@]} # 数组长度
echo ${!chars[@]} # 所有索引
chars+=("d") # 追加元素
unset chars[1] # 删除第二个元素

# 遍历数组
for c in "${chars[@]}"; do
    echo char: $c
done

# 关联数组（字典/键值对）(Bash 4.0+）
declare -A user
user["name"]="Alice"
user["age"]="25"
echo "${user[name]}"
```

### Shell 基本运算符

#### 算数运算符

Bash 原生不支持浮点运算，但提供了多种整数运算方式。

常用的算术运算符：+（加法）、-（减法）、*（乘法）、/（除法）、%（取余）、=（赋值）、==（相等）、!=（不相等）。

```shell
#!/bin/bash

a=10
b=3

# 方法1：$(( )) —— 推荐，最现代
echo "加法: $((a + b))"
echo "减法: $((a - b))"
echo "乘法: $((a * b))"
echo "除法: $((a / b))"
echo "取余: $((a % b))"
echo "幂运算: $((2 ** 3))"

# 方法2：let 命令
let sum=a+b
let "diff = a - b"
let "product = a * b"
echo
echo $sum $diff $product

# 方法3：expr 命令（需要注意空格和转义）
sum=`expr $a + $b`
product=`expr $a \* $b` # 乘号需要转义
echo
echo $sum $product

# 复杂表达式
result=$(( (a + b) * (a - b) / 2 ))
echo
echo "复杂运算结果: $result"

# 自增自减
count=5
((count++))
echo
echo $count
((count--))
echo $count 
((count+=10))
echo $count
```

#### 浮点数运算

Bash 本身不支持浮点数，需要借助外部工具：

* **bc**：Linux/macOS 自带的**高精度计算器**，专门处理小数。
* **awk**：超强文本处理工具 + 自带浮点数计算器。

```shell
#!/bin/bash

echo "1.5 + 2.3" | bc
echo "5.5 - 2.1" | bc
echo "3.14 * 2" | bc
echo "scale=2; 5 / 2" | bc

value=$(awk 'BEGIN{print 1.5 + 2.3}')
echo
echo $value
awk 'BEGIN{print 5.5 - 2.1}'
awk 'BEGIN{print 3.14 * 2}'
awk 'BEGIN{printf "%.2f\n", 5 / 2}'
```

#### 关系运算符（比较数字）

关系运算符只比较数字（只能比较整数，不能比较小数），不支持字符串，除非字符串的值是数字。

常用的关系运算符：

* -eq：检测两个数是否相等（==）；
* -ne：检测两个数是否不相等（!=）；
* -gt：检测左边的数是否大于右边（>）；
* -ge：检测左边的数是否大于等于右边的（>=）；
* -lt：检测左边的数是否小于右边的（<）；
* -le：检测左边的数是否小于等于右边的（<=）。

```shell
#!/bin/bash

a=10
b=5

if [ $a -eq $b ]; then
    echo '$a -eq $b: a 等于 b'
else
    echo '$a -eq $b: a 不等于 b'
fi

if [ $a -ne $b ]; then
    echo '$a -ne $b: a 不等于 b'
fi

if [ $a -gt $b ]; then
    echo '$a -gt $b: a 大于 b'
fi

if [ $a -ge $b ]; then
    echo '$a -ge $b: a 大于等于 b'
fi

if [ $a -lt $b ]; then
    echo '$a -lt $b: a 小于 b'
else
    echo '$a -lt $b: a 不小于 b'
fi

if [ $a -le $b ]; then
    echo '$a -le $b: a 小于等于 b'
else
    echo '$a -le $b: a 不小于等于 b'
fi
```

#### 逻辑运算符

* **&&**：逻辑与（AND）。
* **||**：逻辑或（OR）。
* **!**：逻辑非 （NOT）。
* **-a**：逻辑与（AND）（旧语法）。
* **-o**：逻辑或（OR）（旧语法）。

```shell
#!/bin/bash
a=8
b=3

if [ $a -gt 5 ] && [ $b -lt 5 ]; then
    echo "&&：成立"
fi

if [ $a -gt 20 ] || [ $b -lt 5 ]; then
    echo "||：成立"
fi

# if [ ! $a -eq $b ]; then  # 也能运行，但不规范、不推荐
if ! [ $a -eq $b ]; then
    echo "!：两个数字不相等"
fi

if [ $a -gt 5 -a $b -gt 1 ]; then
    echo "-a：成立"
fi

if [ $a -gt 20 -o $b -gt 1 ]; then
    echo "-o：成立"
fi
```

#### 字符串运算符

* **= 或 ==**：相等；
* **!=**：不相等；
* **-z**：长度是否为 0；
* **-n**：长度是否不为 0；
* **`<`**：字典顺序小于；
* **`>`**：字典顺序大于。

**注意事项**：

* 字符串比较**变量一定要加双引号**（防止为空报错）。
* `[]` 里**不能直接用 `< >`**，必须用 `[[ ]]` 双中括号（会解析为流输入输出）。
* `[ ]` 是 **test 命令**，POSIX 标准，所有 Shell 通用；`[[ ]]`：Bash 扩展语法，**内置关键字**，功能更强、更安全。
* 单括号 `[]` 里，**`[ "$a" = "$b" ]`** 是 **POSIX 标准**，所有 Shell 都支持（最通用）；**`[ "$a" == "$b" ]`** 是 **Bash 扩展**，Bash、zsh 能用，但**不标准**。
* 双括号 `[[ ]]` 里 `=` 和 `==` 完全一样。

```shell
#!/bin/bash

a="Hello"
b="Lizhao"
c=""
d="Hello"

if [ "$a" == "$d" ]; then
    echo "a 和 d 相等"
fi

if [ "$a" != "$b" ]; then
    echo "a 和 b 不相等"
fi

if [ -z "$c" ]; then
    echo "c 是空字符串"
fi

if [ -n "$a" ]; then
    echo "a 非空"
fi

if [ "$c" ]; then
    echo "c 不为空"
else
    echo "c 为空"
fi

if [[ "$a" < "$b" ]]; then
    echo "Hello 字典序小于 Lizhao"
fi

if [[ "$b" > "$a" ]]; then
    echo "Lizhao 字典序大于 Hello"
fi
```

#### 文件测试运算符

测试文件的各种属性，返回布尔值：

* **-b**：是否是块设备文件；
* **-c**：是否是字符设备文件；
* **-d**：是否是目录；
* **-e**：文件（包括目录）是否存在；
* **-f**：是否是普通文件（既不是目录，也不是设备文件）；
* **-g**：是否设置了 SGID 位；
* **-k**：是否设置了粘着位；
* **-p**：是否是管道；
* **-u**：是否设置了 SUID 位；
* **-r**：是否可读；
* **-w**：是否可写；
* **-x**：是否可执行；
* **-s**：是否为空（文件大小是否大于0）；
* **-S**：是否 socket 文件；
* **-L**：是否存在并且是一个符号链接；
* **-O**：属于当前用户；
* **-G**：属于当前组；
* **file1 -nt file2**：file1 比 file2 新；
* **file1 -ot file2**：file1 比 file2 旧。

**名词通俗解释：**

* **块设备文件**：以**数据块**为单位读写，可随机存取。比如：硬盘、U 盘、磁盘分区 `/dev/sda`。
* **字符设备文件**：以**字符流**顺序读写，串行传输。比如：键盘、鼠标、串口、控制台 `/dev/tty`。
* **SUID 位**：普通用户执行该程序时，**临时拥有文件所有者权限**。多用于提权程序，如 `passwd` 改密码。
* **SGID 位**：执行时临时拥有**文件所属组权限**；目录设置后，新建文件自动继承目录所属组。
* **粘着位**：目录设置后，**仅文件所有者 /root 能删除里面文件**。
* **管道文件**：进程间通信文件，单向传递数据，内存临时通道。
* **Socket 文件**：本地进程间套接字通信，多用于服务本地通讯（如 MySQL、nginx 本地通信）。

```shell
#!/bin/bash

f="./file.md"
d="./dir"

if [ -e "$f" ];then
    echo "$f 文件存在"
else
    echo "$f 不存在"
fi

if [ -d "$d" ];then
    echo "$d 是目录"
else
    mkdir -p "$d"
    echo "已创建目录"
fi

if [ -f "$f" ];then
    echo "是普通文件"
fi

echo
if [ -r "$f" ];then echo "可读";fi
if [ -w "$f" ];then echo "可写";fi
if [ -x "$f" ];then echo "可执行";fi

echo
if [ -s "$f" ];then
    echo "文件有内容"
else
    echo "文件为空"
fi

if [ -L "$f" ];then
    echo "是软链接"
fi
```

### Shell 命令

#### echo 命令

`echo` 是最常用的输出命令：

```shell
#!/bin/bash

name="Lizhao"

echo Hello，Lizhao
echo "Hello，Lizhao"
echo "Hello, $name"
echo "当前时间: $(date)"
echo "当前目录: `date`"
echo

echo -e "换行：第一行\n第二行"
echo -e "制表符：文本\t制表符\t对齐"
echo -e "系统提示音 / 警报声：声音\a"
echo -e "退格：删除\b\b字符"

echo -n "这不会换行"
echo "（紧接着这个）"

# 输出到文件
echo "输出到文件（覆盖）：aaaa" > file.txt
echo "更多内容（追加）：bbbb" >> file.txt
```

#### printf 命令

**printf** 命令模仿 C 程序库（library）里的 `printf()` 程序，是由 POSIX 标准所定义，比 echo 命令的移植性好。

```
printf format-string [arguments...]
```

**格式说明符：**

* **%s**：字符串。

* **%d**：十进制整数。

* **%f**：浮点数。

* **%x**：十六进制。

* **%o**：八进制。

* **%c**：单个字符。

* **%b**：字符串（处理转义序列）。

* **%q**：转义后的字符串（可重用）。

* **%-10s**：宽度为 10 个字符（**-** 表示左对齐，没有则表示右对齐），任何字符都会被显示在 10 个字符宽的字符内，如果不足则自动以空格填充，超过也会将内容全部显示出来。

* **%-4.2f**：小数，其中 **.2** 指保留2位小数。


**注意事项**：

* 单引号与双引号效果一样，没有引号也可以输出；
* format-string 中的格式替代符不足，多出的参数仍然会按照该格式输出，即 format-string 被重用；
* 如果没有 arguments，那么 %s 用空字符代替，%d 用 0 代替。

```shell
#!/bin/bash

printf "Hello, Lizhao\n"

printf "Name: %s, Age: %d\n" "Lizhao" 25
printf "%-10s %8d %8.2f\n" "Hello" 10 3.99
printf "%-10s %8d %8.3f\n" "Li" 5 1.50
printf "%-10s %8d %8.4f\n" "Zhao" 20 2.75

printf "\n"
printf "|%10s|\n" "right"
printf "|%-10s|\n" "left"

printf "\n"
printf "%08d\n" 123
printf "%+d\n" 100
printf "%.2f\n" 3.14159

printf "\n"
printf "\033[32m绿色文本\033[0m\n"
printf "\033[31m红色\033[0m 和 \033[34m蓝色\033[0m\n"
```

**注意**：**`\033[32m` = 把后面的文字变成绿色**，**`\033[0m` = 关掉颜色，恢复正常**。

**颜色**：`\033[31m` （红色），`\033[32m`（绿色），`\033[33m`（黄色），`\033[34m`（蓝色），`\033[0m`**（恢复默认颜色，必须加）**。

#### test 命令

`test` 命令用于条件测试，`[ ]` 是其别名，`[[ ]]` 是 Bash 增强版。

```shell
#!/bin/bash

name="Lizhao"

if test -f /etc/passwd; then
    echo "test -f：/etc/passwd 是普通文件"
else
    echo "test -f：/etc/passwd 不是普通文件"
fi

test 5 -gt 3 && echo "test 判断：5 大于 3"

if test "$name" = "Lizhao"; then
    echo "test 判断：字符串相等"
else
    echo "test 判断：字符串不相等"
fi

if test -d /tmp; then
    echo "test -d：/tmp 是目录"
else
    echo "test -d：/tmp 不是目录"
fi

if test -f /etc/passwd -a -r /etc/passwd; then
    echo "文件存在 并且 拥有可读权限"
else
    echo "不满足：存在且可读"
fi
```

#### 其他常用命令

* **ls -la**：列出目录详细内容。

* **cp source dest**：复制文件。

* **mv old new**：移动文件、重命名文件。

* **rm file**：删除文件。

* **mkdir -p path**：创建多级目录。

* **touch file**：创建空文件或更新文件时间戳。

* **cat file**：查看文件完整内容。

* **head -n 10 file**：查看文件前 10 行。

* **tail -n 10 file**：查看文件后 10 行。

* **tail -f log**：实时监听文件内容变化。

* **grep "pattern" file**：搜索匹配文本内容。

* **wc -l file**：统计文件行数。

* **sort file**：对文本内容进行排序。

* **uniq**：去除重复行，需先排序。

* **cut -d: -f1 file**：指定分隔符提取文本字段。

* **ps aux**：查看系统全部进程。

* **top**：实时监控进程运行状态。

* **df -h**：查看磁盘使用情况。

* **du -sh dir**：统计目录占用空间大小。

* **free -h**：查看内存使用状态。

* **uname -a**：查看完整系统信息。

* **whoami**：查看当前登录用户。

* **hostname**：查看主机名称。

* **ping -c 4 google.com**：测试网络连通性。

* **curl http://example.com**：发送 HTTP 网络请求。

* **wget http://example.com**：下载线上文件。

* **netstat -tuln**：查看本机监听端口。

* **which ls**：查找命令存放路径。

* **type ls**：查看命令所属类型。

* **man ls**：查看命令官方帮助手册。

* **help cd**：查看 Shell 内置命令帮助。

### Shell 流程控制

#### if else-if else

```shell
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```

```shell
#!/bin/bash

filename=$0

if [ -z "$filename" ]; then
  echo "错误：请提供文件名"
  exit 1
elif [ ! -f "$filename" ]; then
  echo "错误：文件 '$filename' 不存在"
  exit 1
elif [ ! -r "$filename" ]; then
  echo "错误：文件 '$filename' 不可读"
  exit 1
else
  echo "文件 '$filename' 存在且可读"
fi
```

**注意**：shell 的流程控制不可为空，也就是，如果 else|elif 分支没有语句执行，就不要写这个 else|elif。

#### case 语句

`case` 是多分支选择结构，适合处理多个固定值的匹配。

```shell
case $变量 in
  模式1)
      命令1
      ;;
  模式2|模式3)    # 多个模式匹配相同操作
      命令2
      ;;
  *)
      默认命令
      ;;
esac
```

```shell
#!/bin/bash

action=restart
case "$action" in
  start)
    echo "启动服务..."
    ;;
  stop)
    echo "停止服务..."
    ;;
  restart)
    echo "重启服务..."
    ;;
  status)
    echo "查看状态..."
    ;;
  *)
    echo "用法: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
```

**注意**：两个分号 `;;` 表示 break。

#### for 循环

```shell
for var in item1 item2 ... itemN;do
  command1
  command2
  ...
  commandN
done
```

```shell
#!/bin/bash

for color in red green blue; do
  echo "颜色: $color"
done


echo
for file in *.txt; do
  echo "处理文件: $file"
  wc -l "$file"
done


echo
for ((i=1; i<=10; i++)); do
  echo "计数: $i"
done

echo
for i in {1..5}; do
  echo $i
done

echo
# 带步进的序列（Bash 4.0+）
for i in {1..10..2}; do
  echo $i
done

echo
chars=("a" "b" "c")
for c in "${chars[@]}"; do
  echo $c
done

echo
for i in "${!chars[@]}"; do
  echo "$i: ${chars[$i]}"
done
```

#### while 语句

```shell
while condition
do
    command
done
```

```shell
#!/bin/bash

count=1
while [ $count -le 5 ]; do
  echo "计数: $count"
  ((count++))
done

echo
i=0
while ((i < 10)); do
  echo -n "$i "
  ((i++))
done


echo
while true; do
  read -p "输入命令 (quit 退出): " cmd
  if [ "$cmd" = "quit" ]; then
      break
  fi
  echo "执行: $cmd"
done
```

#### until 循环

until 循环执行一系列命令直至条件为 true 时停止，与 while 循环在处理方式上刚好相反。

```shell
until condition
do
    command
done
```

```shell
#!/bin/bash

count=1
until [ $count -gt 5 ]; do
  echo "计数: $count"
  ((count++))
done

echo
until [ -f "/tmp/ready.txt" ]; do
  echo "等待文件创建..."
  sleep 2
done
```

#### break、continue 循环控制

在循环过程中，有时候需要在未达到循环结束条件时强制跳出循环：

* **break**：允许跳出所有循环（终止执行后面的所有循环）；
* **continue**：不会跳出所有循环，仅仅跳出当前循环。

### Shell 函数

```shell
[ function ] funname () {
	action;
	[return int;]
}
```

**核心规则**：

- **先定义，后调用**：函数必须写在脚本**上方**，调用语句不能出现在函数定义之前，否则提示命令不存在。
- 两种标准定义格式：`function 函数名() { 函数体代码 }`、`函数名() { 函数体代码 }`。
- **函数传参**：调用函数时直接跟参数，函数内部通过内置变量获取。比如：`$1` 第一个参数、`$2` 第二个参数……`$9`第九个，`${10}` 第十个及以上参数，`$#` 获取传入参数总个数，`$*` 所有参数整体，`$@` 所有参数分开。
- **函数返回值 return**：只能返回整数值，即值范围 `0~255`。传入**大于 255**的数字，系统自动修正为 0； 如果不加 return 语句，将最后一条命令运行结果作为返回值。
- **获取返回值**：函数返回值在调用该函数后通过 $? 来获得。

```shell
function 函数名() {
  函数体代码
  return 0
}

函数名() {
  函数体代码
    return 0
}
```

```shell
#!/bin/bash

function func1() {
  local num=10
  echo "函数内局部变量：$num"
  return 5
}

func2() {
  local a=$1
  local b=$2
  local res=$((a + b))
  echo "求和：$a + $b = $res"
}

func1
echo "func1返回值：$?"
func2 20 30
echo "func2返回值：$?"
echo "外部访问局部变量num：$num"
```

### Shell 输入/输出重定向

大多数 UNIX 系统命令从终端接受输入并将所产生的输出发送回到终端。

一般情况下，每个 Unix/Linux 命令运行时都会打开三个文件：

- 标准输入文件（stdin）：stdin 的文件描述符为 0，Unix 程序默认从 stdin 读取数据。
- 标准输出文件（stdout）：stdout 的文件描述符为 1，Unix 程序默认向 stdout 输出数据。
- 标准错误文件（stderr）：stderr 的文件描述符为 2，Unix 程序会向 stderr 流中写入错误信息。

#### 重定向操作符

- `command > file`：标准输出重定向到文件，覆盖原有内容；
- `command >> file`：标准输出重定向到文件，追加写入内容；
- `command 2> file`：标准错误重定向到文件；
- `command 2>> file`：标准错误信息追加写入文件；
- `command &> file`：同时将标准输出与标准错误重定向至文件；
- `command > file 2>&1`：标准输出和标准错误统一重定向到文件；

- `command < file`：从文件中读取内容作为命令输入；
- `command << EOF`：Here Document 多行内联输入；
- `command <<< "string"`：Here String 单行字符串输入；

- `command1 | command2`：把前一个命令输出，作为后一个命令输入；

```shell
#!/bin/bash

whoami > users.txt
echo 正常信息 > file.txt     # 覆盖写入
echo 追加内容 >> file.txt    # 追加写入
ls dir100 2> err.txt        # 错误单独存入文件
ls dir100 2>> err.txt       # 错误追加
echo 全部信息 &> all.txt     # 输出+错误一起覆盖
echo 统一输出 > log.txt 2>&1 # 等价写法

cat < file.txt # 从文件读取内容
users=$(cat users.txt)
echo $users

# HereDocument 多行录入
cat <<EOF > info.txt
姓名：Lizhao
年龄：25
EOF

# HereString 单行传入
wc -w <<< "hello shell"

# 管道用法
ls -l | grep txt
```

#### /dev/null 文件

/dev/null 是一个特殊的文件，写入到它的内容都会被丢弃；如果尝试从该文件读取内容，那么什么也读不到。

```shell
# 丢弃输出
command > /dev/null
command 2> /dev/null
command &> /dev/null

# 测试命令是否存在
if command -v python &> /dev/null; then
  echo "Python 已安装"
fi

# 清空文件（相当于创建空文件）
cat /dev/null > file.txt
```

### Shell 文件包含

使用 `source` 或 `.`（点命令）在当前 shell 环境中执行脚本：

```shell
. filename
source filename
```



```shell
#!/bin/bash
# 文件名 env.sh
name="Lizhao"
age=26

sayHello(){
    echo "Hello，Lizhao"
}
echo "env 脚本内部执行完毕！"
```

```shell
#!/bin/bash

source ./env.sh
echo $name
echo $age
sayHello
```

**注意**：被包含的文件 **env.sh** 不需要可执行权限。

### Shell 常用特殊字符大全

Shell 脚本有些符号是有特殊意义的：

- `$`：取变量值：`$name`，脚本传参：`$1 $2 $# $* $@ $? $$`。
- `{}`：界定变量边界`${name}txt`，序列扩展：`{1..10}`。
- 单引号：原样输出，**所有符号都不解析**。
- 双引号：解析`$`变量、反引号，其余原样输出。
- 反引号：执行命令。

- `>` ：标准输出覆盖。
- `>>` ：标准输出追加。
- `<` ：输入重定向。
- `2>` ：错误重定向。
- `&>` ：合并标准输出 + 错误。

- `;`： 一行执行多条命令，互不影响。
- `;;`：break 语句。
- `.`：source 命令别名、当前目录。

- `#`：单行注释。
- `\`：换行续行符。

- `()`：新开子 shell 执行命令。
- `(())`：整数数学运算。
- `[]`：test 条件判断。
- `[[]]`：test 条件判断（升级版）。
- `$()`：反引号的命令替换（推荐）。

- `|`：管道，前命令输出当后命令输入。
- `&`：后台运行 `sleep 10 &`。

### 参考资料

[runoob.com Shell 教程](https://www.runoob.com/linux/linux-shell.html)

[runoob.com Shell 中的特殊字符](https://www.runoob.com/w3cnote/shell-special-char.html)

[linux bash shell 特殊字符大全](https://cloud.tencent.com/developer/article/1469049)