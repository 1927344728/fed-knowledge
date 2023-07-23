## Node.js：path（路径）

path 模块提供了一些实用工具，用于处理文件和目录的路径。

### Windows 与 POSIX 的对比

path 模块的默认操作会因 Node.js 应用程序运行所在的操作系统而异。 具体来说，当在 Windows 操作系统上运行时， path 模块会假定正被使用的是 Windows 风格的路径。

#### Windows 风格路径

标准的 DOS 路径可由以下三部分组成：

* 卷号或驱动器号，后跟卷分隔符（:）。
* 目录名称。 目录分隔符用来分隔嵌套目录层次结构中的子目录。
* 可选的文件名。 目录分隔用来分隔文件路径和文件名。

如果以上三项都存在，则为绝对路径。 如未指定卷号或驱动器号，且目录名称的开头是目录分隔符，则路径属于当前驱动器根路径上的相对路径。 否则路径相对于当前目录。 下表显示了一些可能出现的目录和文件路径。

| 路径                                             | 描述                                         |
| :----------------------------------------------- | :------------------------------------------- |
| C:\Documents\Newsletters\Summer2018.pdf          | `C:` 驱动器的根目录中的绝对文件路径。        |
| \Program Files\Custom Utilities\StringFinder.exe | 当前驱动器根路径上的绝对路径。               |
| 2018\January.xlsx                                | 指向当前目录的子目录中的文件的相对路径。     |
| ..\Publications\TravelBrochure.pdf               | 指向从当前目录开始的目录中的文件的相对路径。 |
| C:\Projects\apilibrary\apilibrary.sln            | `C:` 驱动器的根目录中的文件的绝对路径。      |
| C:Projects\apilibrary\apilibrary.sln             | `C:` 驱动器的当前目录中的相对路径。          |

#### posix是什么？

POSIX（Portable Operating System Interface of UNIX，可移植操作系统接口），是 IEEE（Institute of Electrical and Electronics Engineers，电气与电子工程师协会） 为在各种 UNIX 操作系统上运行的应用程序提而定义的一系列 API 标准的总称，是为了提升应用程序在不同 UNIX 操作系统之间的代码可移植性，其正式称呼为 IEEE 1003，而国际标准名称为 ISO/IEC 9945。

POSIX.1 已经被 ISO（International Standards Organization，国际标准化组织）所接受，被命名为 ISO/IEC 9945-1:1990 标准。

POSIX 主要由四部分组成:

- XBD（Base Definitions volume）：包含一些通用的术语、概念、接口以及工具函数（cd、mkdir、cp、mv等）和头文件定义（stdio.h、stdlib.h、pthread.h等）。
- XSH（System Interface volume）：包含系统服务函数的定义，例如线程、套接字、标准IO、信号处理、错误处理等。
- XCU（Shell and Utilities volume）：包含 shell 脚本书写的语法、关键字以及工具函数（break、cd、cp、continue、pwd、return）的定义。
- XRAT（Rationale volume）：包含与本标准有关的历史信息以及采用或舍弃某功能的扩展基本原理。

#### 不同的路径解析结果

使用 path.basename() 可能会在 POSIX 和 Windows 上产生不同的结果。

**注意：** Windows 支持正斜杠（/）和反斜杠（\）作为目录分隔符，而基于 Unix 的系统仅支持正斜杠（/）。

在 Windows 上：

```javascript
const path = require('path')
path.basename('C:\\a\\b.html')       // 'b.html'
path.win32.basename('C:\\a\\b.html') // 'b.html'
```

注意：如果要在任意操作系统上使用 Windows 文件路径时获得一致的结果，则使用 path.win32。

在 POSIX 上：

```javascript
const path = require('path')
path.basename('C:\\a\\b.html')       // 'C:\a\b.html'
path.posix.basename('C:\\a\\b.html') // 'C:\a\b.html'
path.win32.basename('C:\\a\\b.html') // 'b.html'
```

**注意：** 如果要在任意操作系统上使用 POSIX 文件路径时获得一致的结果，则使用 path.posix。

### path方法（10+1）

#### basename(path[, ext])

返回路径的最后一部分，尾部的目录分隔符会被忽略。

参数说明：

* path：字符串，表示路径；
* ext：可选，字符串。表示文件扩展名。

如果 path 不是字符串、或给定了 ext 但不是字符串，则抛出 TypeError。

```javascript
const path = require('path')
path.basename('/demo-lizh/node/package')               // 'package'
path.basename('/demo-lizh/node/package.json')          // 'package.json'
path.basename('/demo-lizh/node/package.json', '.json') // 'package'
```

**注意：** 尽管 Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但是 basename 方法会将扩展名视为区分大小写的字符串。

```javascript
path.basename('/demo-lizh/node/package.json', '.json') // 'package'
path.basename('/demo-lizh/node/package.json', '.JSON') // 'package.json'
```

#### dirname(path)

返回路径的目录名，尾部的目录分隔符会被忽略。

参数说明：

* path：字符串，表示路径。

如果 path 不是字符串，则抛出 TypeError。

```javascript
const path = require('path')
path.dirname('/demo-lizh/node/package')      // '/demo-lizh/node'
path.dirname('/demo-lizh/node/package/')     // '/demo-lizh/node'
path.dirname('/demo-lizh/node/package.json') // '/demo-lizh/node'
```

#### extname(path)

返回路径的扩展名，即路径的最后一部分中从最后一次出现句点（`.`）字符直到字符串结束。 如果路径的最后一部分没有句点（`.`），或者路径除了第一个字符以外没有句点（`.`），则返回空字符串。

参数说明：

* path：字符串，表示路径。

如果 path 不是字符串，则抛出 TypeError。

```javascript
const path = require('path')
path.extname('/demo-lizh/node/package')      // ''
path.extname('.package')                     // ''
path.extname('/demo-lizh/node/package.json') // '.json'
```

#### normalize(path)

规范化给定的路径，解析 `..` 和 `.` 片段，且当路径中有多个连续的路径分隔符时（POSIX 上的 `/`、Windows 上的 `\` 或 `/`），则它们将被替换为单个平台特定的路径分隔符。尾部的分隔符会保留。

参数说明：

* path：字符串，表示路径。

如果 path 是零长度的字符串，则返回 `.`，表示当前工作目录；如果 path 不是字符串，则抛出 TypeError。

在 POSIX 上：

```javascript
const path = require('path')
path.normalize('demo-lizh/node////////package.json') // 'demo-lizh/node/package.json'
path.normalize('demo-lizh/node/package.json/..')     // 'demo-lizh/node'
path.normalize('')                                   // '.'
```

在 Windows 上：

```javascript
path.normalize('C:\\temp\\\\foo\\bar\\..\\') // 'C:\\temp\\foo\\'
```

#### join([...paths])

将所有给定的路径片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。

参数说明：

* paths：字符串，路径片段的序列。

长度为零的路径片段会被忽略；如果连接后的路径字符串为长度为零的字符串，则返回 `.`，表示当前工作目录；如果任何的路径片段不是字符串，则抛出 TypeError。

```javascript
const path = require('path')
path.join('demo-lizh', 'node', 'package.json') // 'demo-lizh/node/package.json'
path.join('demo-lizh', '', 'package.json')     // 'demo-lizh/package.json'
path.join('')                                  // '.'
```

#### resolve([...paths])

将路径或路径片段的序列解析为绝对路径。

给定的路径序列会从右到左进行处理，后面的每个 path 会被追加到前面，**直到构造出绝对路径**。 

参数说明：

* paths：字符串，路径片段的序列。

如果任何参数不是字符串，则抛出 TypeError。

**注意：**

* 如果在处理完所有给定的路径片段之后还未生成绝对路径，则会使用当前工作目录。

* 生成的路径会被规范化，并且尾部的斜杠会被删除（除非路径被解析为根目录）。

* 零长度的路径片段会被忽略。

* 如果没有传入路径片段，则返回当前工作目录的绝对路径。

```javascript
const path = require('path')
path.resolve('/demo-lizh', 'node', 'package.json')  // '/demo-lizh/node/package.json'
path.resolve('demo-lizh', 'node', 'package.json')   // '/Users/lizhao/Documents/lizhao/demo-lizh/node/demo-lizh/node/package.json'
path.resolve('/demo-lizh', '/node', 'package.json') // '/node/package.json'
path.resolve('/demo-lizh/node/json/', '../package.json') // '/demo-lizh/node/package.json'
path.resolve('') // '/Users/xxx/Documents/xxx/demo-lizh/node'
path.resolve()   // '/Users/xxx/Documents/xxx/demo-lizh/node'
```

#### relative(from, to)

根据当前工作目录返回 from 到 to 的相对路径。 如果 from 和 to 各自解析到相同的路径（分别调用 path.resolve() 之后），则返回零长度的字符串。

参数说明：

* from：字符串，表示路径。
* to：字符串，表示路径。

如果将零长度的字符串传入 from 或 to，则使用当前工作目录代替该零长度的字符串；如果 from 或 to 不是字符串，则抛出 TypeError。

在 POSIX 上：

```javascript
const path = require('path')
path.relative('/demo-lizh/node/nodejs/path.js', '/demo-lizh/node/package.json') // '../../package.json'
path.relative('node/package.json', 'node/package.json') // ''
path.relative('node/package.json', '')                  // '../..'
```

在 Windows 上：

```javascript
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb') // '..\\..\\impl\\bbb'
```

#### format(pathObject)

将一个对象转换为路径字符串。 与 path.parse() 相反。

参数说明：

* pathObject：Object，表示路径的对象。

```json
{
  dir: '',
  root: '',
  base: '',
  name: '',
  ext: ''
}
```

pathObject 对象中的属性有优先级：

* 如果提供了 dir，则忽略 root；
* 如果 base 存在，则忽略 ext 和 name。

```javascript
const path = require('path')

path.format({
  root: '/Documents/',
  name: 'package-lock',
  ext: '.json'
})
// '/Documents/package-lock.json'

path.format({
  dir: '/lizhao/demo-lizh/node',
  base: 'package.json',
  root: '/Documents',
  name: 'package-lock',
  ext: '.json'
})
// '/lizhao/demo-lizh/node/package.json'
```

**注意：** root 属性必须带 '/' 后缀，dir 属性不需要。

#### parse(path)

返回一个对象，其属性表示路径的有效元素。 尾部的目录分隔符会被忽略。

参数说明：

* path：字符串，表示路径。

如果 path 不是字符串，则抛出 TypeError。

在 POSIX 上：

```javascript
const path = require('path')
console.log(path.parse('/demo-lizh/node/package.json'))
// {root: '/', dir: 'demo-lizh/node', base: 'package.json', ext: '.json', name: 'package'}

console.log(path.parse('demo-lizh/node/package.json'))
// {root: '', dir: 'demo-lizh/node', base: 'package.json', ext: '.json', name: 'package'}

console.log(path.parse(''))
// {root: '', dir: '', base: '', ext: '', name: ''}
```

在 Windows 上：

```javascript
const path = require('path')
path.parse('C:\\demo-lizh\\node\\package.json')
// {root: 'C:\', dir: 'C:\demo-lizh\node', base: 'package.json', ext: '.json', name: 'package'}

path.parse('demo-lizh\\node\\package.json')
// {root: '', dir: 'demo-lizh\node', base: 'package.json', ext: '.json', name: 'package'}

path.parse('')
// {root: '', dir: '', base: '', ext: '', name: ''}
```

#### isAbsolute(path)

返回布尔值，表示路径是否为绝对路径。

参数说明：

* path：字符串，表示路径。

如果给定的 path 是零长度字符串，则返回 false；如果 path 不是字符串，则抛出 TypeError。

在 POSIX 上：

```javascript
const path = require('path')
path.isAbsolute('/demo-lizh/node/package.json') // true
path.isAbsolute('./package.json')               // false
path.isAbsolute('')                             // false
```

在 Windows 上：

```javascript
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```

#### toNamespacedPath(path)

返回给定路径的等效名称空间前缀路径。 如果 path 不是字符串，则将返回 path 而不进行修改。

**注意：** 仅在 Windows 系统上有意义。 在 POSIX 系统上，该方法不可操作，并且始终返回 `path` 而不进行修改。

### path属性（4）

#### posix

提供对 path 方法的 POSIX 特定实现的访问。

```javascript
path.posix.basename('/demo-lizh/node/package')
path.posix.join('demo-lizh', 'node', 'package.json')
```

#### win32

提供对特定于 Windows 的 path 方法的实现的访问。

```javascript
path.win32.basename('/demo-lizh/node/package')
path.win32.join('demo-lizh', 'node', 'package.json')
```

#### delimiter

提供平台特定的路径定界符：

- 在 Windows 上：`;`；
- 在 POSIX 上：`:`。

在 POSIX 上：

```javascript
const path = require('path')
process.env.PATH                       // /usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin
process.env.PATH.split(path.delimiter) // ['/usr/local/bin', '/usr/local/sbin', '/usr/bin', '/bin', '/usr/sbin', '/sbin']
```

在 Windows 上：

```javascript
process.env.PATH                        // C:\Windows\system32;C:\Windows;C:\Program Files\node\
process.env.PATH.split(path.delimiter); // ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

#### sep

提供平台特定的路径片段分隔符：

- Windows 上： `\`；
- POSIX 上： `/`。

在 POSIX 上：

```javascript
path.sep // '/'
```

在 Windows 上：

```javascript
path.sep // '\\'
```

### 参考资料

[API Reference Document](https://www.apiref.com/nodejs-zh/path.html#path_path)

[Windows 系统中的文件路径格式](https://learn.microsoft.com/zh-cn/dotnet/standard/io/file-path-formats)

[posix是什么都不知道，就别说你懂Linux了！](https://www.eet-china.com/mp/a65068.html)

