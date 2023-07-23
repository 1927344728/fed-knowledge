## Node.js：fs（文件系统）

fs（文件系统）I/O 是对标准 POSIX 函数的简单封装。

### POSIX 标准

POSIX 表示可移植操作系统接口（Portable Operating System Interface of UNIX），POSIX 标准定义了操作系统应该为应用程序提供的接口标准，是 IEEE 为要在各种 UNIX 操作系统上运行的软件而定义的一系列 API 标准的总称，其正式称呼为 IEEE 1003，而国际标准名称为 ISO/IEC 9945。

POSIX 标准意在期望获得源代码级别的软件可移植性。换句话说，为一个 POSIX 兼容的操作系统编写的程序，应该可以在任何其它的 POSIX 操作系统（即使是来自另一个厂商）上编译执行。

POSIX 并不局限于 UNIX。许多其它的操作系统，例如 DEC OpenVMS 支持 POSIX 标准，尤其是 IEEE Std. 1003.1-1990（1995 年修订）或 POSIX.1，POSIX.1 提供了源代码级别的 C 语言应用编程接口（API）给操作系统的服务程序，例如读写文件。POSIX.1 已经被国际标准化组织（International Standards Organization，ISO）所接受，被命名为 ISO/IEC 9945-1:1990 标准。

**备注：** Windows 从 WinNT（Microsoft Windows NT，由微软公司发行在 1997 年左右发布）开始就有兼容 POSIX 的考虑。这是因为当年在要求严格的领域，Unix 地位比 Windows 高。为了把 Unix 用户拉到 Windows 阵营，被迫支持 POSIX。现在 Win10 对 Linux/POSIX 支持好，则是因为 Linux 已经统治了廉价服务器市场。

### 异步和同步调用

fs 很多方法都有**异步和同步**的形式：

* 异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会（exists 除外）保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

* 使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。

```javascript
// 异步
const fs = require('fs')
fs.readFile('./nodejs/test.txt', { encoding: 'utf8' }, (err, data) => {
  if (err) { throw err }
  console.log(data)
})
```

```javascript
// 同步
const data = fs.readFileSync('./nodejs/test.txt', { encoding: 'utf8'})
console.log(data)
```

大多数 fs 函数可以省略回调函数，在这种情况下，会使用默认的回调函数。 但，不建议省略异步方法的回调函数，**未来的版本可能会导致抛出错误**。

另外，基于 promise 的操作会返回 Promise：

```javascript
// Promise
const fs = require('fs/promises');
(async function() {
  const data = await fs.readFile('./nodejs/test.txt', { encoding: 'utf8'})
  console.log(data)
})();
```

**注意：** 在 Windows 上 Node.js 遵循单驱动器工作目录的理念。 当使用驱动器路径且不带反斜杠时就能体验到该特征。 例如：`fs.readdirSync('c:\\'`) 可能返回与 `fs.readdirSync('c:')` 不同的结果。 详见 [MSDN - 命名文件、路径和命名空间](https://learn.microsoft.com/zh-cn/windows/win32/fileio/naming-a-file?redirectedfrom=MSDN#fully_qualified_vs._relative_paths)。

**注意：** 在 Windows 上，使用 'w' 选项（通过 fs.open 或 fs.writeFile）打开已有隐藏文件将会失败，错误信息为 EPERM 。已隐藏文件可以通过 'r+' 选项打开。

### 文件路径

大多数 fs 操作接受的文件路径可以指定为字符串、Buffer、或 URL 对象（使用 `file:` 协议）。

**注意：** 字符串形式的路径会被解释为 UTF-8 字符序列（标识绝对或相对的文件名）。

**注意：** 相对路径会相对于当前工作目录（通过调用 process.cwd() 确定）进行处理。

#### file: 协议

字符串、Buffer 路径不支持 `file:` 协议，只有 URL 对象支持 `file:` 协议。

```javascript
// 正常
const fs = require('fs');
const { URL } = require('url');
const fileUrl = new URL(`file://${__dirname}/test.txt`);
const data = fs.readFileSync(fileUrl, { encoding: 'utf8' });
```

```javascript
// 异常：URL 对象未使用 file: 协议。
const fs = require('fs');
const { URL } = require('url');
const fileUrl = new URL(`${__dirname}/test.txt`);
const data = fs.readFileSync(fileUrl, { encoding: 'utf8' });
// Uncaught NodeError TypeError [ERR_INVALID_URL]: Invalid URL: /Users/xxx/Documents/xxx/demo-lizh/node/nodejs/test.txt
```

```javascript
// 异常：只有 URL 对象支持 file: 协议。
const fs = require('fs')
const data = fs.readFileSync(`file://${__dirname}/test.txt`, { encoding: 'utf8' })
// Uncaught Error Error: ENOENT: no such file or directory, open 'file:///Users/xxx/Documents/xxx/demo-lizh/node/nodejs/test.txt'.
```

**注意：** `file:` URLS 必须是绝对路径。

#### Buffer 路径

fs 函数支持传递和接收字符串路径与 Buffer 路径。 后者的目的是使其可以在允许非 UTF-8 文件名的文件系统中工作。 对于大多数普通用途，使用 Buffer 路径是不必要的，因为字符串 API 会自动与 UTF-8 相互转换。

**注意：** 在某些文件系统（NTFS、HFS+），文件名总是被编码为 UTF-8。 在这些文件系统中，传入非 UTF-8 编码的 Buffer 到 fs 函数将无法像预期那样工作。

### 文件描述符

在 POSIX 系统上，对于每个进程，内核都维护着一张当前打开着的文件和资源的表格。 每个打开的文件都分配了一个称为文件描述符的简单的数字标识符。 在系统层，所有文件系统操作都使用这些文件描述符来标识和跟踪每个特定的文件。 

Windows 系统使用了一个虽然不同但概念上类似的机制来跟踪资源。 为了简化用户的工作，Node.js 抽象出操作系统之间的特定差异，并为所有打开的文件分配一个数字型的文件描述符。

```javascript
const fs = require('fs')
fs.open('./nodejs/test.txt', 'r', (err, fd) => {
  if (err) throw err;
  console.log(fd)
  fs.fstat(fd, (err, stat) => {
    if (err) throw err;
    console.log(stat)
    fs.close(fd, (err) => {
      if (err) throw err;
      console.log('关闭文件描述符')
    });
  });
});
```

**注意：** 当操作完成时关闭描述符至关重要。因为，大多数操作系统限制在任何给定时间内可能打开的文件描述符的数量。 如果不这样做将导致内存泄漏，最终导致应用程序崩溃。

### WHATWG URL 对象支持

对于大多数 fs 模块的函数， path 或者 filename 参数可以当作一个 WHATWG URL 对象传入。 

WHATWG 是 **Web Hypertext Application Technology Working Group**（网页超文本应用技术工作小组，以推动网络 HTML 5 标准为目的而成立的组织）的简写。WHATWG URL 是 WHATWG 规范的一种 URL 标准，其使用比旧版的 API 更具选择性和更精细的方法来选择使用的编码字符。

#### 百分比编码集

WHATWG算法定义了三个“百分比编码集”，它们描述了必须进行百分编码的字符范围：

* C0 control percent-encode set（C0控制百分比编码集）： **用于所有其他情况的编码**，特别地包括 URL 的分段部分，特殊条件下也包括主机及路径部分，包括范围在 U+0000 ~ U+001F（含）的代码点及大于U+007E的所有代码点。
* path percent-encode set（路径百分比编码集）： **用于大多数 URL 的路径部分编码**，包括 C0 control percent-encode set（C0控制百分比编码集）的代码点及 U+0020、U+0022、U+0023、 U+003C、U+003E、U+003F、U+0060、U+007B、和 U+007D 的代码点。
* userinfo encode set（用户信息编码集）： **专门用于用户名和密码部分的编码**，包括 path percent-encode set（路径百分比编码集）的代码点及 U+002F、U+003A、U+003B、U+003D、 U+0040、U+005B、U+005C、U+005D、U+005E、和 U+007C 的代码点。

#### 不同的平台的特定行为

在 Windows 上，携带主机名的 `file:` URLs 被转换为 UNC 路径；有硬盘盘符的 `file:` URLs 会被转换成本地绝对路径；既没有主机名，也没有盘符的 `file:` URLs 在转换时会抛出错误。

在 Windows 上：

```javascript
// 携带主机名：file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
fs.readFileSync(new URL('file://hostname/p/a/t/h/file'));

// 携带本地磁盘盘符：file:///C:/tmp/hello => C:\tmp\hello
fs.readFileSync(new URL('file:///C:/tmp/hello'));

// 如果不携带主机名，就必须包含本地磁盘盘符；否则会抛出错误
fs.readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
fs.readFileSync(new URL('file:///c/p/a/t/h/file'));
```

**注意：** 在 Windows 上，携带盘符的 `file:` URLs 必须使用 `:` 作为盘符后的分隔符，否则会抛出错误。

**注意：** 在 Windows 上，携带已编码的反斜线 `file:` URLs 在编码是会抛出错误。

**注意：** 在其他所有的平台上， 都不支持携带主机名的 `file:` URLs，且会抛出错误。

**注意：** 当 `file:` URL 包含已经编码的斜线符号会在所有平台抛出错误。

```javascript
const fs = require('fs')
const { URL } = require('url')
const fileUrl = new URL(`file://${__dirname}%2Ftest.txt`)
const data = fs.readFileSync(fileUrl, { encoding: 'utf8' })
// Uncaught NodeError TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded / characters
```

### Dir 类

表示目录流的类，可用于读取和清理目录。

由 opendir 类方法创建：

```javascript
const fs = require('fs')
const dir = fs.opendirSync('./nodejs');
console.log(dir)
```

#### close()

关闭目录的底层资源句柄， 后续的读取会导致错误。

```javascript
dir.close()         // 返回 Promise（在资源被关闭之后会被 resolve）
dir.close(callback) // 关闭资源句柄之后将会调用 callback
dir.closeSync()
```

```javascript
const fs = require('fs')
const dir = fs.opendirSync('./nodejs');
dir.close().then(() => {
  dir.read()
})
// UnhandledPromiseRejectionWarning: Error [ERR_DIR_CLOSED]: Directory handle was closed
```

```javascript
const fs = require('fs')
const dir = fs.opendirSync('./nodejs');
const res = dir.closeSync()
console.log(res) // undefined
dir.read()
// Uncaught NodeError Error [ERR_DIR_CLOSED]: Directory handle was closed
```

#### read()

读取下一个目录项作为 fs.Dirent。

```javascript
dir.read()         // 返回 Promise。resolve 时，传入 fs.Dirent 或 null（读取不到目录项）
dir.read(callback) // 读取完成后，调用 callback，并传入 fs.Dirent 或 null（读取不到目录项）
dir.readSync()     // 返回下一个目录项作为 fs.Dirent 或 null（读取不到目录项）
```

```javascript
const fs = require('fs')
const dir = fs.opendirSync('./nodejs');
let dirent = dir.readSync()
while (dirent) {
  console.log(dirent.name)
  dirent = dir.readSync()
}
```

**注意：** 返回的目录项不遵循操作系统的底层目录机制所提供的特定顺序。 

**注意：** 遍历目录时添加或删除的目录项可能不会包含在遍历的结果中。

#### `[Symbol.asyncIterator]()`

 异步地遍历目录，直到读取了所有的目录项。返回的目录项为 fs.Dirent。

**注意：** 返回的目录项不遵循操作系统的底层目录机制所提供的特定顺序。 

**注意：** 遍历目录时添加或删除的目录项可能不会包含在遍历的结果中。

#### path

此目录的只读路径，即，提供给 opendir 类方法的参数。

### Dirent 类

目录项（可以是文件或目录中的子目录）的表示，通过读取 fs.Dir 返回。 目录项是文件名和文件类型对的组合。

```javascript
const fs = require('fs')
const dir = fs.opendirSync('./nodejs');
const dirent = dir.readSync()
console.log(dirent)
```

#### isBlockDevice()

如果 fs.Dirent 对象描述块设备，则返回 true。

#### isCharacterDevice()

如果 fs.Dirent 对象描述字符设备，则返回 true。

#### isDirectory()

如果 fs.Dirent 对象描述文件系统目录，则返回 true。

#### isFIFO()

如果 fs.Dirent 对象描述先进先出（FIFO）管道，则返回 true。

#### isFile()

如果 fs.Dirent 对象描述普通的文件，则返回 true。

#### isSocket()

如果 fs.Dirent 对象描述套接字，则返回 true。

#### isSymbolicLink()

如果 fs.Dirent 对象描述符号链接，则返回 true。

#### name

返回 fs.Dirent 对象指向的文件名。 此值的类型取决于传递给 fs.readdir() 或 fs.readdirSync() 的 options.encoding。

### FSWatcher 类

从 fs.watch() 返回的对象是该类型。

提供给 fs.watch() 的 listener 回调会接收返回的 FSWatcher 的 change 事件。

```javascript
const fs = require('fs')
const fsWatcher = fs.watch('./nodejs/test.txt', { encoding: 'utf8' }, (eventType, filename) => {
  console.log(eventType, filename)
});
```

#### change 事件

当一个被监视的目录或文件有变化时触发。

参数说明：

* eventType：字符串，fs 变化的类型；
* filename： 字符串或 Buffer，变化的文件名。

filename 参数可能不会被提供，这依赖于操作系统支持。 如果提供了 filename，则若 fs.watch() 被调用时 encoding 选项被设置为 `buffer`，则它会是一个 Buffer，否则是一个字符串。

```javascript
fsWatcher.on('change', (err) => {
  console.log('change事件')
})
```

#### close 事件

当监视器停止监视更改时触发。 关闭的 fs.FSWatcher 对象在事件处理函数中不再可用。

```javascript
fsWatcher.on('close', (err) => {
  console.log('close事件')
})
```

#### error 事件

当监视文件时发生错误时触发。 发生错误的 fs.FSWatcher 对象在事件处理函数中不再可用。

```javascript
fsWatcher.on('error', (err) => {
  console.log('error事件')
})
```

#### close()

停止监视 fs.FSWatcher 对象。 一旦停止，则 fs.FSWatcher 对象将不再可用。

```javascript
fsWatcher.close()
```

### ReadStream 类

ReadStream 是一个可读流。

```javascript
const fs = require('fs')
const readStream = fs.createReadStream('./nodejs/test.txt')
```

#### close 事件

当 ReadStream 底层的文件描述符被关闭时触发。

#### open 事件

当 ReadStream 的文件被打开时触发。

回调函数参数说明：

* fd：数值，被 ReadStream 使用的整数文件描述符。

```javascript
readStream.on('open', (n) => {
  console.log('open: ', n)
})
```

#### ready 事件

当 fs.ReadStream 准备好使用时触发，即 open 事件之后立即触发。

#### bytesRead

已读取的字节数。

#### path

流正在读取的文件的路径，指定在 fs.createReadStream() 的第一个参数。 

如果 path 传入的是一个字符串，则 readStream.path 是一个字符串。 如果 path 传入的是一个 Buffer，则 readStream.path 是一个 Buffer。

#### pending

如果底层的文件还未被打开（即在触发 ready 事件之前），则此属性为 true。

### WriteStream 类

WriteStream 一个可写流。

```javascript
const fs = require('fs')
const writeStream = fs.createWriteStream('./nodejs/test.txt')
```

#### close 事件

当 WriteStream 底层的文件描述符被关闭时触发。

#### open 事件

当 WriteStream 的文件被打开时触发。

回调函数参数说明：

* fd：数值，被 ReadStream 使用的整数文件描述符。

```javascript
writeStream.on('open', (n) => {
  console.log('open: ', n)
})
```

#### ready 事件

当 fs.WriteStream 准备好使用时触发，即 open 事件之后立即触发。

#### bytesWritten

已写入的字节数。 不包括仍在排队等待写入的数据。

#### path

流正在写入的文件的路径，指定在 fs.createWriteStream() 的第一个参数。 

如果 path 传入的是一个字符串，则 writeStream.path 是一个字符串。 如果 path 传入的是一个 Buffer，则 writeStream.path 是一个 Buffer。

#### pending

如果底层的文件还未被打开（即在触发 ready 事件之前），则此属性为 true。

### Stats 类

从 fs.stat()、fs.lstat() 和 fs.fstat() 及其同步版本返回的对象都是该类型。

```javascript
const fs = require('fs')
const data = fs.statSync('./nodejs/test.txt')
```

#### Stats 属性

* atime、atimeMs： 访问时间（戳），即文件数据最近被访问的时间。 会被 mknod(2)、 utimes(2) 和 read(2) 系统调用改变

* birthtime、birthtimeMs： 创建时间（戳），即文件创建的时间。当文件被创建时设定一次。 

  **注意：** 在创建时间不可用的文件系统中，该字段可能被替代为 ctime 或 1970-01-01T00:00Z（如 Unix 的纪元时间戳 0）。 该值在此情况下可能会大于 atime 或 mtime。 在 Darwin 和其它的 FreeBSD 衍生系统中，如果 atime 被使用 utimes(2) 系统调用显式地设置为一个比当前 birthtime 更早的值，也会有这种情况。

* ctime、ctimeMs： 变化时间（戳），即文件状态最近更改的时间（修改索引节点数据） 。会被 chmod(2)、 chown(2)、 link(2)、 mknod(2)、 rename(2)、 unlink(2)、 utimes(2)、 read(2) 和 write(2) 系统调用改变。
* mtime、mtimeMs： 修改时间（戳），即文件数据最近被修改的时间。 会被 mknod(2)、 utimes(2) 和 write(2) 系统调用改变。
* dev：包含该文件的设备的数字标识符。

* info：文件系统特定的文件索引节点编号。
* mode：描述文件类型和模式的位字段。
* nlink：文件存在的硬链接数。
* uid：拥有该文件（POSIX）的用户的数字型用户标识符。
* gid：拥有该文件（POSIX）的群组的数字型群组标识符。
* rdev：如果文件表示一个设备，则此值为数字型设备标识符。
* size：文件的大小（以字节为单位）。
* blksize：用于 I/O 操作的文件系统块的大小。
* blocks：为此文件分配的块数。

#### Stats 方法

* isFile()： Stats 对象是否是描述普通的文件。
* isDirectory()：Stats 对象是否是描述文件系统目录。

* isFIFO()： Stats 对象是否是描述先进先出（FIFO）管道。
* isSocket()：Stats 对象是否是描述套接字。
* isBlockDevice()：Stats 对象是否是描述块设备。
* isCharacterDevice()：Stats 对象是否是描述字符设备。
* isSymbolicLink()：Stats 对象是否是描述符号链接。

### fs 方法

#### access

判断是否有指定文件或目录的某个或某些权限。

```javascript
fs.access(path[, mode], callback)
fs.accessSync(path[, mode])
```

参数说明：

* path： 字符串 | Buffer | URL，指明文件或目录的路径；
* mode： 整数值，默认值：fs.constants.F_OK，指明文件模式（权限和粘滞位）；
* callback：回调函数，带一个可能的 Error 对象为参数。

以下常量定义了 mode 的可能值：

* fs.constants.F_OK：文件对调用进程可见。常用于确定文件是否存，但不涉及 rwx 权限。
* fs.constants.R_OK：文件可被调用进程读取。
* fs.constants.W_OK：文件可被调用进程写入。
* fs.constants.X_OK：文件可被调用进程执行。 对 Windows 系统没作用（相当于 fs.constants.F_OK）。

mode 值可以创建由两个或更多个值的位或组成的掩码：

```javascript
const fs = require('fs')
fs.access('./nodejs/test.txt', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) { throw err }
  console.log('有读写权限')
})
```

```javascript
const fs = require('fs')
try {
  fs.accessSync('./nodejs/test.txt', fs.constants.R_OK | fs.constants.W_OK)
  console.log('有读写权限')
} catch (err) {
  console.error('无权访问');
}
```

**注意：** 不建议在调用 fs.open() 、 fs.readFile() 或 fs.writeFile() 之前使用 fs.access() 检查一个文件的可访问性。 如此处理会造成紊乱情况，因为其他进程可能在两个调用之间改变该文件的状态。 作为替代，用户代码应该直接打开/读取/写入文件，当文件无法访问时再处理错误。

```javascript
// 不推荐
fs.access('./nodejs/test.txt', (err) => {
  if (!err) {
    console.error('文件已存在');
    return;
  }
  fs.open('./nodejs/test.txt', 'wx', (err, fd) => {
    if (err) { throw err; }
    console.log(fd);
  });
})
```

#### appendFile

追加数据到一个文件，如果文件不存在则创建文件。 data 可以是一个字符串或 Buffer。

```javascript
fs.appendFile(file, data[, options], callback)
fs.appendFileSync(file, data[, options])
```

参数说明：

* path： 字符串 | Buffer | URL | 整数值，指明文件路径或者文件描述符；
* data：字符串 | Buffer，指明要写入的数据；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值： 'utf8'，指明字符编码；
  * mode：整数值，默认值：0o666，指明文件模式（权限和粘滞位）；
  * flag：字符串 | 整数值，默认值：'a'，指明文件系统标志；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.appendFile('./nodejs/test.txt', '\n追加数据', (err) => {
  if (err) { throw err }
  console.log('数据已追加')
})
// fs.appendFileSync('./nodejs/test.txt', '\n追加数据')
```

file 可能是一个被打开用来追加数据的数字文件描述符（通过 fs.open() 或者 fs.openSync()）。这样的文件描述符将不会被自动关闭。

```javascript
fs.open('./nodejs/test.txt', 'a', (err, fd) => {
  if (err) { throw err }
  fs.appendFile('./nodejs/test.txt', '\n追加数据', (e) => {
    if (e) { throw e }
    console.log('数据已追加')
  })
})
```

#### chmod

修改文件的权限。

```javascript
fs.chmod(path, mode, callback)
fs.chmodSync(path, mode)
```

参数说明：

* path： 字符串 | Buffer | URL，指明文件路径；
* mode：整数值，指明文件模式（权限和粘滞位）；
* callback：回调函数，带一个可能的 Error 对象为参数。

mode 值是用下面的常量进行**逻辑或**操作后的数字掩码：

* fs.constants.S_IRUSR： 0o400，所有者可读；
* fs.constants.S_IWUSR： 0o200，所有者可写；
* fs.constants.S_IXUSR： 0o100，所有者可执行或搜索；
* fs.constants.S_IRGRP： 0o40，群组可读；
* fs.constants.S_IWGRP： 0o20，群组可写；
* fs.constants.S_IXGRP： 0o10，群组可执行或搜索；
* fs.constants.S_IROTH： 0o4，其他人可读；
* fs.constants.S_IWOTH： 0o2，其他人可写；
* fs.constants.S_IXOTH： 0o1，其他人可执行或搜索。

```javascript
const fs = require('fs')
fs.chmod('./nodejs/test.txt', fs.constants.S_IRUSR | fs.constants.S_IWUSR, (err) => {
  if (err) throw err;
  console.log('修改文件权限')
});
```

一个构造 mode 的更简单的方式是使用 3 位八进制串（比如，765）：最左侧的数字代表了文件所有者的权限；中间一位代表了组的权限；最右侧的数字代表其他人的权限。

* 7：可读、可写、可执行；
* 6：可读、可写；
* 5：可读、可执行；
* 4：只读；
* 3：可写、可执行；
* 2：只写；
* 1：只可执行；
* 0：没有权限。

例如，八进制值 `0o765` 表示：

* 所有者可以读取、写入和执行该文件；
* 群组可以读和写入该文件；
* 其他人可以读取和执行该文件。

```javascript
fs.chmod('./nodejs/test.txt', 0o765, (err) => {
  if (err) throw err;
  console.log('修改文件权限')
});
```

当使用期望的文件模式的原始数字时，任何大于 0o777 的值都可能导致不支持一致的特定于平台的行为。 因此，诸如 S_ISVTX、 S_ISGID 或 S_ISUID 之类的常量不会在 fs.constants 中公开。

**注意：** 在 Windows 上，只能更改写入权限，并且不会实现群组、所有者或其他人的权限之间的区别。

#### lchmod

类似于 chmod() ，但，path 可能是一个符号链接。

在符号链接的情况下，lchown 更改符号链接本身的所有者，而不是该符号链接所指向的文件。

```javascript
fs.lchmod(path, mode, callback) // 只在 macOS 有效。
fs.lchmodSync(path, mode)
```

#### chown

修改文件的所有者和群组。

```javascript
fs.chown(path, uid, gid, callback)
fs.chownSync(path, uid, gid) // 返回 undefined
```

参数说明：

* path： 字符串 | Buffer | URL，指明文件路径；
* uid：数值，所有者；
* gid：数值，组；
* callback：回调函数，带一个可能的 Error 对象为参数。

#### lchown

与 chown () 类似，但不取消引用符号链接。

```javascript
fs.lchown(path, uid, gid, callback)
fs.lchownSync(path, uid, gid)
```

#### close

关闭一个文件描述符。

```javascript
fs.close(fd, callback)
fs.closeSync(fd)
```

参数说明：

* fd：整数值，指明文件描述符；
* callback：回调函数，带一个可能的 Error 对象为参数。

对任何其他 fs 操作正在使用的任何文件描述符（fd）调用 fs.close() 可能导致未定义的行为。

#### copyFile

拷贝文件。

```javascript
fs.copyFile(src, dest[, flags], callback)
fs.copyFileSync(src, dest[, flags])
```

参数说明：

* src：字符串 | Buffer | URL | 整数值，指明源文件的路径或者描述符；
* desc：字符串 | Buffer | URL | 整数值，指明目标文件的路径或者描述符；
* flag：字符串 | 整数值，默认值：0，用于指定行为的拷贝操作（唯一支持的是 fs.constants.COPYFILE_EXCL），表示如果 dest 已经存在，则不拷贝。
* callback：回调函数，带一个可能的 Error 对象为参数。

将 src 拷贝到 dest。默认情况下，如果 dest 已经存在会被覆盖。

Node.js 不能保证拷贝操作的原子性。如果目标文件打开后出现错误，Node.js 将尝试删除它。

```javascript
const fs = require('fs')
fs.copyFile('./nodejs/test.txt', './nodejs/test4.txt', (err) => {
  if (err) throw err;
  console.log('拷贝文件')
});
```

**注意：** 不支持复制目录；不支持 glob 表达式（如，`dir/*`）；dest 目录一定要存在（它不会自动创建目录），若不存在时则会抛出异常。

#### fs.createReadStream(path[, options])

返回一个新建的 ReadStream 对象。

参数说明：

* path： 字符串 | Buffer | URL | 整数值，指明文件的路径或者描述符；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：null，指明字符编码；
  * flag：字符串 | 整数值，默认值：'r'，指明文件系统标志；
  * mode： 整数值，默认值：0o666，指明文件模式（权限和粘滞位）；
  * fd：整数值，默认值：null，表示文件描述符。如果指定了 fd，则会忽略 path 参数；
  * autoClose：布尔值，默认值：true，表示在 error 或 end 时，文件描述符会被自动关闭；
  * start：整数值，默认值：0，表示从文件中读取的**起始**位置；
  * end：整数值，默认值：Infinity，表示从文件中读取的**结束**位置。

#### fs.createWriteStream(path[, options])

返回一个新建的 WriteStream 对象。

参数说明：

* file：字符串 | Buffer | URL 对象 | number，文件名或文件描述符；

* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：null，指明字符编码；
  
  * flag：字符串 | 整数值，默认值：'r'，指明文件系统标志；
  
  * mode： 整数值，默认值：0o666，指明文件模式（权限和粘滞位）；
  
  * fd：整数值，默认值：null，表示文件描述符。如果指定了 fd，则会忽略 path 参数；
  
  * autoClose：布尔值，默认值：true，表示在 error 或 end 时，文件描述符会被自动关闭。
  
  * emitClose：布尔值，默认值：true，表示文件流被销毁后会触发一个 close 事件。
  
  * start：整数值，默认值：0，表示从文件中写入的**起始**位置；
  
  * fs：Object，默认值：null。用于覆盖 fs 的 open、write、writev 和 close 方法。
  
    **注意：** 至少需要覆盖 write 和 writev 中的一个；重写 write() 而不重写 writev() 可能会降低性能，因为一些优化（_writev()）将被禁用；如果没有提供 fd 选项，还需要重写 open； 如果 autoClose 为 true，还需要重写 close。 

#### exists（弃用）

通过检查文件系统来判断给定的路径是否存在。

**注意：** 已废弃，建议使用 fs.stat() 或 fs.access() 代替。

```javascript
fs.exists(path, callback)
fs.existsSync(path)
```

参数说明：

* path： 字符串 | Buffer | URL，指明文件路径；
* callback：回调函数，带一个布尔值，表示给定的路径是否存在。

```javascript
const fs = require('fs')
fs.exists('./nodejs/test.txt', (exists) => {
  if (exists) {
    console.log('文件存在')
    return
  }
  console.log('文件不存在')
});

fs.access('./nodejs/test.txt', (err) => {
  if (err) { throw err }
  console.log('文件存在')
});
```

**注意：** 此回调的参数和其他 Node.js 回调的参数不一致。 通常，Node.js 回调的第一个参数是 err，接下来是一些其他可选参数，而 fs.exists() 只有一个布尔类型的参数。这也是为什么推荐使用 fs.access() 代替 fs.exists()。

**注意：** fs.exists() 是废弃的，但 fs.existsSync() 不是。 

**注意：** 不推荐在调用 fs.open，fs.readFile()，fs.writeFile() 之前使用 fs.exists() 检测文件是否存在。因为在两次调用之间，其他进程可能修改文件。作为替代，用户应该直接开/读取/写入文件，当文件不存在时再处理错误。

#### link

创建一个新链接（也称为硬链接）到现有文件，可理解为复制文件到指定位置，并重命名？？。

```javascript
fs.link(existingPath, newPath, callback)
fs.linkSync(existingPath, newPath)
```

参数说明：

* existingPath：字符串 | Buffer | URL，指明源文件路径；
* newPath：字符串 | Buffer | URL，指明目标文件路径；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.link('./nodejs/test.txt', './nodejs/test11.txt', (err) => {
  if (err) { throw err }
  console.log('文件重命名')
});
```

**注意：** 如果 newPath 已存在，则报错，不会覆盖已有文件。

#### mkdir

创建目录。

```javascript
fs.mkdir(path[, mode], callback)
fs.mkdirSync(path[, mode])
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* mode：整数值，默认值：0o777，指明文件模式（权限和粘滞位）；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.mkdir('./nodejs/dir', (err) => {
  if (err) { throw err }
  console.log('创建目录')
});
```

#### mkdtemp

创建一个唯一的临时目录。

```javascript
fs.mkdtemp(prefix[, options], callback)
fs.mkdtempSync(prefix[, options])
```

参数说明：

* prefix：字符串，目录前缀，其后追加**六位随机字符**作为一个唯一的临时目录；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：'utf8'，指明字符编码；

* callback：回调函数，带有一个可能的错误参数，和创建的目录路径作为字符串作第二个参数。

```javascript
const fs = require('fs')
fs.mkdtemp('temp', (err, folder) => {
  if (err) { throw err }
	console.log('创建唯一临时目录：', folder)
});
// 创建唯一临时目录： tempHPjhgP
```

#### open

打开文件（或目录）。

```javascript
fs.open(path[, flags][, mode], callback)
fs.openSync(path[, flags][, mode]) // 返回一个文件描述符
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* mode：整数值，默认值：0o666，指明文件模式（权限和粘滞位）（在 Windows 上，只能操作写权限）；
* flag：字符串 | 整数值，默认值：'r'，指明文件系统标志；
* callback：回调函数，可有两个参数：
  * err：一个可能的错误；
  * fd：一个文件描述符。

```javascript
const fs = require('fs')
fs.open('./nodejs/test.txt', (err, fd) => {
  if (err) { throw err }
  console.log('打开文件：', fd)
});
```

#### opendir

打开目录。返回一个 fs.Dir，其中包含所有用于更进一步读取和清理目录的的函数。

```javascript
fs.opendir(path[, options], callback)
fs.opendirSync(path[, options]) // 返回一个 Dir 对象
```

参数说明：

* path：字符串 | Buffer | URL，指明目录的路径；
* options：字符串（指明字符编码） | Object；

  * encoding：字符串，默认值：'utf8'，指明字符编码；
  * bufferSize：数值，默认值：32，当从目录读取时在内部缓冲的目录项的数量。值越高，则性能越好，但内存占用更高；
* callback：回调函数，可有两个参数：
  * err：一个可能的错误；
  * dir：一个 Dir 对象。

encoding 选项用于在打开目录和后续的读取操作时设置 path 的字符编码。

```javascript
const fs = require('fs')
const res = fs.opendir('./nodejs', (err, dir) => {
  if (err) { throw err }
  console.log(dir)
});
```

#### read

从 fd 指定的文件中读取数据。

```javascript
fs.read(fd, buffer, offset, length, position, callback)
fs.read(fd, buffer[, options], callback)
fs.read(fd[, options], callback)

fs.readSync(fd, buffer, offset, length, position)
fs.readSync(fd, buffer, [options])
```

参数说明：

* fd：整数值，文件描述符；
* options：Object，包括 buffer、offset、length、position 选项；
  * buffer：Buffer | Uint8Array，存储从文件中获取的数据；
  * offset ：整数值，buffer 中开始写入的偏移量；
  * length：整数值，指定要读取的字节数；
  * position：整数值，指定从文件中开始读取的位置；
* callback：回调函数，可有三个参数：
  * err：一个可能的错误；
  * bytesRead：整数值；
  * buffer：Buffer。

如果 position 为 null，则数据从当前文件读取位置开始读取，且文件读取位置会被更新。 如果 position 为一个整数，则文件读取位置保持不变。

```javascript
const fs = require('fs')
const buf = new Buffer.alloc(100);
fs.open('./nodejs/test.txt', 'r', (err, fd) => {
  if (err) { throw err }
  fs.read(fd, buf, 0, buf.length, 0, (e, bytesRead, buffer) => {  
	  if (e) { throw e }
    console.log(buf.toString())
    console.log('字节数：', bytesRead)
    console.log(buffer.toString())
  })
  
  // fs.read(fd, { buffer: buf }, (e, bytesRead, buffer) => {  
  //   if (e) { throw e }
  //   console.log(buffer.toString())
  // })
  
  // fs.read(fd, (e, bytesRead, buffer) => {  
  //   if (e) { throw e }
  //   console.log(buffer.toString())
  // })
});
```

#### readdir

读取一个目录的内容。 

```javascript
fs.readdir(path[, options], callback)
fs.readdirSync(path[, options])
```

参数说明：

* path：字符串 | Buffer | URL，指明目录路径；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：'utf8'，指明字符编码；
* callback：回调函数，可有两个参数：
  * err：一个可能的错误；
  * files：目录中不包括 `.` 和 `..` 的文件名的数组。

```javascript
const fs = require('fs')
fs.readdir('./nodejs', (err, files) => {
  if (err) { throw err }
  console.log(files)
});
```

#### readFile

读取一个文件的全部内容。

```javascript
fs.readFile(path[, options], callback)
fs.readFileSync(path[, options])
```

参数说明：

* path：字符串 | Buffer | URL 对象 | 整数值，文件名或文件描述符；
* options：字符串（指定使用的字符编码） | Object；
  * encoding：字符串，默认值：null，指明字符编码；
  * flag：字符串 | 整数值，默认值：'r'，指明文件系统标志；
* callback：回调函数，可有两个参数：
  * err：一个可能的错误；
  * data：字符串 | Buffer，表文件的内容。

如果未指定字符编码，则返回原始的 buffer。

**注意：** 当 path 是一个目录时，fs.readFile() 与 fs.readFileSync() 的行为与平台有关。 在 macOS、Linux 与 Windows 上，会返回一个错误。 在 FreeBSD 上，会返回目录内容的表示。

**注意：** 如果一个文件描述符被指定为 path，则它不会被自动关闭。

```javascript
const fs = require('fs')
fs.readFile('./nodejs/test.txt', 'utf8', (err, data) => {
  if (err) { throw err }
  console.log(data)
});
```

#### realpath

返回规范化的绝对路径名。

```javascript
fs.realpath(path[, options], callback)
fs.realpathSync(path[, options])
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：'utf8'，指明字符编码；
* callback：回调函数，可有两个参数：
  * err：一个可能的错误；
  * resolvedPath：字符串 | Buffer，规范化的绝对路径。

```javascript
const fs = require('fs')
fs.realpath('./nodejs/test.txt', 'utf8', (err, resolvedPath) => {
  if (err) { throw err }
  console.log(resolvedPath)
});
```

**注意：** 只支持可转换成 UTF8 字符串的路径。

**注意：** 如果路径解析到套接字或 pipe ，函数将返回与该对象相关的系统名称。

#### rename

更改文件的名称或位置。

```javascript
fs.rename(oldPath, newPath, callback)
fs.renameSync(oldPath, newPath)
```

参数说明：

* oldPath：字符串 | Buffer | URL，指明源文件路径；
* newPath：字符串 | Buffer | URL，指明新文件路径；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.rename('./nodejs/test.txt', './nodejs/test22.txt', (err) => {
  if (err) { throw err }
  console.log('修改文件的名称')
});
fs.rename('./nodejs/test11.txt', './test33.txt', (err) => {
  if (err) { throw err }
  console.log('修改文件的名称和位置')
});
```

#### rm

版本：14.14.0。

删除文件和目录（仿照标准 POSIXrm 实用程序）。

```javascript
fs.rm(path[, options], callback)
fs.rmSync(path[, options])
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* options：字符串（指明字符编码） | Object；
  * force：布尔值，默认值：false，指明是否忽略 path 不存在导致的异常；
  * recursive：布尔值，默认值：false，指明是否执行递归删除，即删除目录下的子目录（在递归模式下，操作会在失败时重试）；
  * maxRetries：数值，默认值：0，指明当发生 EBUSY、EMFILE、ENFILE、ENOTEMPTY 或 EPERM 错误，重试该操作的次数（注意：如果 recursive 不为 true，则忽略此选项）；
  * retryDelay：数值，默认值：0，指明重试之前的等待时间（以毫秒为单）（注意：如果 recursive 不为 true，则忽略此选项）；
* callback：函数，只有一个可能是 Error 对象参数。

```javascript
const fs = require('fs')
fs.rm('./nodejs/test.txt', (err) => {
  if (err) { throw err }
  console.log('删除文件或目录')
});
```

#### rmdir

删除目录。

```javascript
fs.rmdir(path, callback)
fs.rmdirSync(path)
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* options：字符串（指明字符编码） | Object；
  * recursive：布尔值，默认值：false，指明是否执行递归删除，即删除目录下的子目录（在递归模式下，操作会在失败时重试）；
  * maxRetries：数值，默认值：0，指明当发生 EBUSY、EMFILE、ENFILE、ENOTEMPTY 或 EPERM 错误，重试该操作的次数（注意：如果 recursive 不为 true，则忽略此选项）；
  * retryDelay：数值，默认值：0，指明重试之前的等待时间（以毫秒为单）（注意：如果 recursive 不为 true，则忽略此选项）；
* callback：回调函数，只有一个可能的异常参数。

```javascript
const fs = require('fs')
fs.rmdir('./nodejs/dir', (err) => {
  if (err) { throw err }
  console.log('删除目录')
});
```

**请注意：** 在文件上（而不是目录上）使用 fs.rmdir()，在 Windows 平台将会导致 ENOENT 错误，而在 POSIX 平台将会导致 ENOTDIR 错误。

#### stat

获取文件状态。

```javascript
fs.stat(path, callback)
fs.statSync(path)
```

参数说明：

* path：字符串 | Buffer | URL，指明文件路径；
* callback：回调函数，可有两个参数：
  * err：一个可能的 Error 对象；
  * stats：一个 [fs.Stats](https://www.nodeapp.cn/fs.html#fs_class_fs_stats) 对象。

```javascript
const fs = require('fs')
fs.stat('./nodejs/test.txt', (err, stat) => {
  if (err) { throw err }
  console.log(stat)
});
```

不建议在调用 fs.open() 、fs.readFile() 或 fs.writeFile() 之前使用 fs.stat() 检查一个文件是否存在。 作为替代，用户代码应该直接打开/读取/写入文件，当文件无效时再处理错误。

如果要检查一个文件是否存在且不操作它，推荐使用 fs.access()。

#### lstat

获取文件状态，与 stat() 类似。但，path 可以是一个符号链接。

```javascript
fs.lstat(path, callback)
fs.lstatSync(path) // 返回一个 fs.Stats 实例
```

参数说明：

* path：字符串 | Buffer | URL，指明文件路径；
* callback：回调函数，可有两个参数：
  * err：一个可能的 Error 对象；
  * stats：一个 [fs.Stats](https://www.nodeapp.cn/fs.html#fs_class_fs_stats) 对象。

```javascript
const fs = require('fs')
fs.symlinkSync('./nodejs/test.txt', 'linkTest');
fs.lstat('linkTest', (err, stat) => {
  if (err) { throw err }
  console.log(stat)
});
```

#### symlink

为文件创建一个符号链接。

```javascript
fs.symlink(target, path[, type], callback)
fs.symlinkSync(target, path[, type])
```

参数说明：

* target：字符串 | Buffer | URL，指明源文件路径；

* path：字符串 | Buffer | URL，指明新创建的符号链接；
* type：字符串，目标类型，可接收值：dir | file（默认） | junction（自动将 target 参数标准化为绝对路径）；
* callback：回调函数，带一个可能的 Error 对象为参数。

**注意：** type 参数仅在 Windows 上有效（在其他平台上忽略）。

**注意：** Windows 上，Node.js 要求 target 是绝对路径。 

```javascript
const fs = require('fs')
fs.symlink('./nodejs/test.txt', 'linkTest', (err) => {
  if (err) { throw err }
  console.log('为文件创建一个符号链接')
});
```

#### readlink

读取一个符号链接指向的路径。

```javascript
fs.readlink(path[, options], callback)
fs.readlinkSync(path[, options])
```

参数说明：

* path：字符串 | Buffer | URL，指明文件或目录的路径；
* options：字符串（指明字符编码） | Object；
  * encoding：字符串，默认值：'utf8'，指明字符编码；
* callback：回调函数，可有两个参数：
  * err：一个可能的 Error 对象；
  * linkString：字符串 | Buffer，符号链接指向的路径。

```JavaScript
const fs = require('fs')
fs.symlinkSync('./nodejs/test.js', 'linkTest'); 
fs.readlink('linkTest', 'utf8', (err, linkString) => {
  if (err) { throw err }
  console.log(linkString)
});
```

#### unlink

删除一个符号链接，也可能会将它引用的文件也删除（所引用的文件没有其他符号链接，并且没有进程打开该文件）。

```javascript
fs.unlink(path, callback)
fs.unlinkSync(path)
```

参数说明：

* path：字符串 | Buffer | URL，指明符号链接；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.symlinkSync('./nodejs/test.js', 'linkTest'); 
fs.unlink('linkTest', (err) => {
  if (err) { throw err }
  console.log('删除一个符号链接')
});
```

#### truncate

将文件截断到指定长度（会直接修指定文件）。

```javascript
fs.truncate(path[, len], callback)
fs.truncateSync(path[, len])
```

参数说明：

* path：字符串 | Buffer | URL，指明文件路径；
* len：数值，默认值：0，截取的长度；
* callback：回调函数，带一个可能的 Error 对象为参数。

```javascript
const fs = require('fs')
fs.truncate('./nodejs/test.txt', 1, (err) => {
  if (err) { throw err }
  console.log('将文件截断到指定长度')
});
```

#### `fs.watch(filename[, options][, listener])`

监视指定目标的变化，指定目标可以是一个文件或一个目录。 返回的对象是一个 fs.FSWatcher。

参数说明：

* filename：字符串 | Buffer | URL，指明文件或目录的路径；
* options：字符串（指明字符编码） | Object；
  * persistent：布尔值，默认值：true，指明如果文件正在被监视，进程是否应该继续运行；
  * recursive：布尔值，默认值：false，指明是否全部子目录应该被监视，或只是当前目录（**注意：递归选项只支持 macOS 和 Windows**）；
  * encoding：字符串，默认值：'utf8'，指明字符编码；
* listener：监听函数，可有两个参数：
  * eventType：字符串，可接收值：rename | change；
  * filename：字符串 | Buffer，触发事件的文件的名称。

**注意：** 在大多数平台，当一个文件出现或消失在一个目录里时，rename 会被触发。

**注意：** 监听器回调是绑定在由 fs.FSWatcher 触发的 change 事件上，但它跟 eventType 的 'change' 值不是同一个东西。

**注意：** fs.watch API 不是 100％ 跨平台一致的，且在某些情况下不可用。

##### 可用性

该特性依赖于底层操作系统提供的一种方法来通知文件系统的变化：

- 在 Linux 系统中，使用 [`inotify`](http://man7.org/linux/man-pages/man7/inotify.7.html)。
- 在 BSD 系统中，使用 [`kqueue`](https://www.freebsd.org/cgi/man.cgi?kqueue)。
- 在 macOS 系统中，对文件使用 [`kqueue`](https://www.freebsd.org/cgi/man.cgi?kqueue)，对目录使用 [`FSEvents`](https://developer.apple.com/library/mac/documentation/Darwin/Conceptual/FSEvents_ProgGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40005289-CH1-SW1)。
- 在 SunOS 系统（包括 Solaris 和 SmartOS）中，使用 [`event ports`](http://illumos.org/man/port_create)。
- 在 Windows 系统中，该特性依赖 [`ReadDirectoryChangesW`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365465(v=vs.85).aspx)。
- 在 Aix 系统中，该特性依赖 [`AHAFS`](https://www.ibm.com/developerworks/aix/library/au-aix_event_infrastructure/) 必须是启动的。

如果底层功能因某些原因不可用，则 fs.watch 也无法正常工作。 例如，当使用虚拟化软件如 Vagrant、Docker 等时，在网络文件系统（NFS、SMB 等）或主文件系统中监视文件或目录可能是不可靠的。

但，仍然可以使用基于 stat 轮询的 fs.watchFile()，但是这种方法更慢，可靠性也更低。

**注意：** fs.watch() 比 fs.watchFile() 和 fs.unwatchFile() 更高效。 可能的话，应该使用 fs.watch() 而不是 fs.watchFile() 和 fs.unwatchFile()。

##### 索引节点

在 Linux 或 macOS 系统中，fs.watch() 解析路径到一个索引节点，并监视该索引节点。 如果监视的路径被删除或重建，则它会被分配一个新的索引节点。 监视器会发出一个删除事件，但会继续监视原始的索引节点。 新建的索引节点的事件不会被触发。 这是正常的行为。

AIX 文件在文件的生命周期中保留相同的 inode。在 AIX 上保存并关闭监视的文件将触发两个通知（一个用于添加新内容，一共用于拦截）。

##### 文件名参数

listener 函数中提供的 filename 参数仅在 Linux、macOS、Windows、以及 AIX 系统上支持。 即使在支持的平台中，filename 也不能保证提供。 因此，不要以为 filename 参数总是在回调中提供，如果它是空的，需要有一定的后备逻辑。

```javascript
const fs = require('fs')
fs.watch('./nodejs', (eventType, filename) => {
  console.log(`类型: ${eventType}`);
  if (filename) {
    console.log(`文件名: ${filename}`);
    return
  }
  console.log('未提供文件名');
});
```

#### fs.watchFile(filename[, options], listener)

监视文件的变化。

参数说明：

* filename：字符串 | Buffer | URL，指明文件路径；

* options：Object；
  * persistent：布尔值，默认值：true，指明如果文件正在被监视，进程是否应该继续运行；
  * interval：整数值，默认值：5007，指明目标应该每隔多少毫秒被轮询；
  * encoding：字符串，默认值：'utf8'，指定用于传给监听器的文件名的字符编码；
* listener：监听函数，可有两个参数：
  * current：fs.Stat 实例，指明文件当前的状态对象；
  * previous：fs.Stat 实例，指明文件以前的状态对象。

当 fs.watchFile() 所监听的文件消失并重新出现时，第二个回调函数中返回的 previous（文件重新出现）将与第一个回调函数的 previous（消失）相同。比如，文件被删除，然后又恢复；文件重命名两次，且第二次重命名与其原名称相同。

**注意：** 当一个 fs.watchFile 的运行结果是一个 ENOENT 错误时，它会调用监听器一次，且将所有字段置零（或将日期设为 Unix 纪元）。 在 Windows 中，blksize 和 blocks 字段会是 undefined 而不是零。 如果文件是在那之后创建的，则监听器会被再次调用，且带上最新的状态对象。 这是在 v0.10 版之后在功能上的变化。

```javascript
const fs = require('fs')
fs.watchFile('./nodejs/test.txt', (current, previous) => {
  console.log(`当前: ${current.size}`);
  console.log(`之前: ${previous.size}`);
});
```

#### fs.unwatchFile(filename[, listener])

停止监视文件的变化。

参数说明：

* filename：字符串 | Buffer | URL，指明文件路径；
* listener：回调函数，使用 fs.watchFile() 注册的监听器 。如果有指定，则只移除指定的监听器；否则所有的监听器都会被移除。

如果 filename 是一个未被监视的文件名，将会是一个空操作，而不是一个错误。

#### utimes

修改文件系统时间戳。

```javascript
fs.utimes(path, atime, mtime, callback)
fs.utimesSync(path, atime, mtime)
```

参数说明：

* path：字符串 | Buffer | URL 对象，文件名；
* atime：数值 | 字符串 | 时间对象；
* mtime：数值 | 字符串 | 时间对象；
* callback：回调函数，只有一个可能的异常参数。

如果 atime 和 mtime 参数值不能被转换为数值，或值是 NaN 、 Infinity 或 -Infinity，则会抛出错误。

#### write

```javascript
fs.write(fd, buffer[, offset[, length[, position]]], callback)
fs.writeSync(fd, buffer[, offset[, length[, position]]]) // 返回写入的字节数
```

写入 buffer 到 fd 指定的文件。

参数说明：

* fd：整数值，文件描述符；
* buffer：Buffer | Uint8Array；
* offset：整数值，指明 buffer 中被写入的部分；
* length：整数值，指明要写入的字节数；
* position：整数值，指明从文件开始写入数据的位置的偏移量（ 如果 `typeof position !== 'number'`，则数据从当前位置写入）；
* callback：函数，可接收三个参数：
  * err：一个可能的 Error 对象；
  * bytesWritten：整数值，指明从 buffer 写入了多少字节；
  * buffer：Buffer | Uint8Array。

```javascript
const fs = require('fs')
fs.open('./nodejs/test.txt', 'r+', (err, fd) => {
  if (err) { throw err }
  const buf = Buffer.from('lizhao');
  const buf2 = Buffer.alloc(100);
  const position = fs.readSync(fd, buf2)
  fs.write(fd, buf, 1, buf.length - 1, position, (err2, bytesWritten, buffer) => {
    if (err2) { throw err2 }
    console.log(bytesWritten)
    console.log(buffer.toString())
  })
});
```

```javascript
fs.write(fd, string[, position[, encoding]], callback)
fs.writeSync(fd, string[, position[, encoding]]) // 返回写入的字节数
```

写入 string 到 fd 指定的文件。 如果 string 不是一个字符串，则该值将被强制转换为一个字符串。

参数说明：

* fd：整数值，文件描述符；
* string：字符串，指明要写入到文件的字符；
* position：整数值，指明从文件开始写入数据的位置的偏移量；
* encoding：字符串，指明期望的字符串编码；
* callback：函数，可接收三个参数：
  * err：一个可能的 Error 对象；
  * written：整数值，指明写入的字符数；
  * string：字符串，指明写入的字符。

```javascript
const fs = require('fs')
fs.open('./nodejs/test.txt', 'r+', (err, fd) => {
  if (err) { throw err }
  const buf2 = Buffer.alloc(100);
  const position = fs.readSync(fd, buf2)
  fs.write(fd, 'lizhao', position, (err2, written, string) => {
    if (err2) { throw err2 }
    console.log(written)
    console.log(string)
  })
});
```

**注意：** 多次对同一文件使用 fs.write 且不等待回调，是不安全的。 对于这种情况，强烈推荐使用 fs.createWriteStream。

**注意：** 在 Linux 上，当文件以追加模式打开时，指定位置的写入是不起作用的。 内核会忽略位置参数，并总是将数据追加到文件的末尾。

#### writeFile

写入数据到文件，如果文件已经存在，则替代文件。

```javascript
fs.writeFile(file, data[, options], callback)
fs.writeFileSync(file, data[, options]) // 返回 undefined
```

参数说明：

* file：字符串 | Buffer | URL 对象 | number，文件名或文件描述符；
* data：字符串 | Buffer | Uint8Array，要写入到文件的数据；
* options：Object | 字符串
  * encoding：字符串，可选， 默认值：'utf8'；
  * mode：数值，可选，默认值：0o666；
  * flag：字符串，可选，默认为 'w'。
* callback：回调函数，带有一个可能的错误参数。

如果 data 是一个 buffer，则忽略 encoding 选项。

**注意：** 多次对同一文件使用 fs.writeFile 且不等待回调，是不安全的。 对于这种情况，强烈推荐使用 fs.createWriteStream。

**注意：** 如果 file 指定为一个文件描述符，则它不会被自动关闭。

### fs 方法（带 f 前缀）

* fchmod：fs.fchmod(fd, mode, callback)、fs.fchmodSync(fd, mode)；
* fchown：fs.fchown(fd, uid, gid, callback)、fs.fchownSync(fd, uid, gid)；
* fdatasync：fs.fdatasync(fd, callback)、fs.fdatasyncSync(fd)；
* fstat：fs.fstat(fd, callback)、fs.fstatSync(fd)；
* fsync：fs.fsync(fd, callback)、fs.fsyncSync(fd)；
* ftruncate：fs.ftruncate(fd[, len], callback)、fs.ftruncateSync(fd[, len])；
* futimes：fs.futimes(fd, atime, mtime, callback)、fs.futimesSync(fd, atime, mtime)

此类带 `f` 前缀的方法与对应的方法主要区别：第一个参数 fd 是文件描述符。

### fs 属性

#### constants

返回一个包含常用文件系统操作的常量的对象。 

### 相关问题

#### Node.js 支持哪些字符编码？

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理 I/O 操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。

Node.js 目前支持的字符编码包括：
* ascii： 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。
* utf8： 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。
* utf16le： 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
* ucs2： utf16le 的别名。
* base64： Base64 编码。
* latin1： 一种把 Buffer 编码成一字节编码的字符串的方式。
* binary： latin1 的别名。
* hex：将每个字节编码为两个十六进制字符。

#### Node.js 支持哪些文件系统标志？

在采用 flag 选项的地方都可以使用：

* a：打开文件进行追加。如果文件不存在，则创建该文件。
* ax：类似 a，但如果路径存在则失败。
* a+：打开文件进行读取和追加。如果文件不存在，则创建该文件。
* ax+： 类似 a+，但如果路径存在则失败。
* as：打开文件以同步模式追加。如果文件不存在，则创建该文件。
* as+：以同步模式打开文件进行读取和追加。如果文件不存在，则创建该文件。
* r： 打开文件进行阅读。如果文件不存在，则会发生异常。
* r+：打开文件进行读写。如果文件不存在，则会发生异常。
* rs+：以同步方式打开文件进行读写，并指示操作系统绕过本地文件系统缓存。这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。

* w：打开文件进行写入。该文件被创建（如果它不存在）或被截断（如果它存在）。

* wx： 类似 w，但如果路径存在则失败。
* w+：打开文件进行读写。该文件被创建（如果它不存在）或被截断（如果它存在）。

* wx+：  类似 w+，但如果路径存在则失败

### 参考资料

[Node.js 中文文档 - fs (文件系统)](https://www.nodeapp.cn/fs.html#fs_file_system)

[posix是什么都不知道，就别说你懂Linux了！](https://www.eet-china.com/mp/a65068.html)
