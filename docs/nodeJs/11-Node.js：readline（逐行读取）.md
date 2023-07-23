## Node.js：readline（逐行读取）

readline 模块提供了一个接口，用于一次一行地读取可读流（例如，process.stdin）中的数据。

#### 简单示例

```javascript
// readlineDemo.js
const readline = require('readline');

const readlineInst = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
readlineInst.question('请输入些什么吧？', (answer) => {
  console.log(`输入：${answer}`);
  readlineInst.close();
});
```

运行 `node ./readlineDemo.js`。运行后，程序将不会终止，会在 input 流上等待接收数据，直到接收后调用 `readlineInst.close()` 关闭。

#### 逐行地读取文件流

```javascript
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('test.txt'),
  crlfDelay: Infinity
});
rl.on('line', (line) => {
  console.log(`单行：${line}`);
});
```

### Interface类

Interface 类的实例是使用 readline.createInterface() 方法构造的。 每个实例都关联一个 input 可读流和一个 output 可写流。 output 流用于为到达的用户输入打印提示，并从 input 流读取。

#### close事件

监听实例的关闭，该事件监听器函数不传入任何参数。

当发生以下任一情况时会触发：

* 调用实例的 close() 方法，且实例放弃对 input 流和 output 流的控制；
* input 流接收到其 end 事件；
* input 流接收到 `ctrl + D` 以发信号传输结束（EOT）；
* input 流接收到 `ctrl + C` 以发信号 SIGINT，并且实例上没有注册 SIGINT 事件监听器。

```javascript
readlineInst.on('close', () => {
  console.log('关闭')
})
```

一旦触发该事件，则实例完成。

#### line事件

每当 input 流接收到行尾输入（\n、 \r 或 \r\n）时触发，通常发生在用户按下 Enter 或 Return 键。

监听器函数会带上包含接收到的那一行输入的字符串：

```javascript
readlineInst.on('line', (input) => {
  console.log(`接收到：${input}`);
});
```

#### pause事件

当发生以下任一情况时会触发：

* input 流被暂停；
* input 流未暂停，但接收到 SIGCONT 事件（input 流接收到 SIGINT 时，没有注册 SIGINT 事件监听器，则会触发 pause 事件）。

调用监听器函数时不传入任何参数。

```javascript
readlineInst.on('pause', () => {
  console.log('暂停')
});
```

#### resume事件

每当 input 流恢复时触发。

调用监听器函数时不传入任何参数。

#### SIGINT事件

每当 input 流接收到 `ctrl + C` 输入（通常称为 SIGINT）时触发。

如果当 input 流接收到 SIGINT 时没有注册 SIGINT 事件监听器，则会触发 pause 事件。

调用监听器函数时不传入任何参数。

```javascript
readlineInst.on('SIGINT', () => {
  console.log('按键：Ctrl + C')
});
```

#### SIGCONT事件

当先前使用 `ctrl + Z`（即 SIGTSTP）移入后台的 Node.js 进程使用 `fg(1p)` 返回到前台时触发。

如果 input 流在 SIGTSTP 请求之前被暂停，则不会触发此事件。

**注意：** Windows 上不支持 SIGCONT 事件。

#### SIGTSTP事件

每当 input 流接收到 `ctrl + Z` 输入（通常称为 SIGTSTP）时触发。

如果当 input 流接收到 SIGTSTP 时没有注册 SIGTSTP 事件监听器，则 Node.js 进程将被发送到后台。

当使用 fg(1p) 恢复程序时，将触发 pause 和 SIGCONT 事件。 这可用于恢复 input 流。

如果在将进程发送到后台之前暂停 input，则不会触发 pause 和 SIGCONT 事件。

调用监听器函数时不传入任何参数。

```javascript
readlineInst.on('SIGTSTP', () => {
  console.log('按键：Ctrl + Z')
});
```

**注意：** Windows 上不支持 SIGTSTP 事件。

#### close()

关闭 Interface 实例，且撤回对 input 和 output 流的控制。 调用时，close 事件会被触发。

#### pause()

暂停 input 流，且稍后需要时可被恢复。

**注意：** pause() 不会立刻暂停被 Interface 实例触发的其他事件（包括 line）。

#### prompt([preserveCursor])

在 output 流中新的一行写入 Interface 实例配置后的 prompt，用于为用户提供一个可供输入的新的位置。

当被调用时，如果 input 流已被暂停，则会恢复 input 流；如果 Interface 被创建时 output 被设为 null 或 undefined，则提示不会被写入。

参数说明：

* preserveCursor：布尔值。如果为 true，则阻止光标落点被设为 0。

#### setPrompt(prompt)

用于设置每当 prompt() 被调用时要被写入到 output 的提示。

参数说明：

* prompt：字符串，表示提示文案。

#### question(query, callback)

通过写入到 output 来展示 query，并等待用户提供到 input 的输入，然后调用 callback 函数并传入提供的输入作为第一个参数。

当被调用时，如果 input 流已被暂停，则会恢复 input 流；如果 Interface 被创建时 output 被设为 null 或 undefined，则提示不会被写入。

参数说明：

* query：字符串，一个在提示符之前、要写入 output 的叙述或询问。
* callback：一个回调函数，会被调用并带上用户响应 query 的输入。

```javascript
readlineInst.question('请输入些什么吧？', (answer) => {
  console.log(`输入：${answer}`);
});
```


**注意：** callback 函数不遵循接受一个 Error 对象或 null 作为第一个参数的标准模式，只带上提供的答案作为唯一的参数。

#### resume()

如果 input 流已被暂停，则恢复 input 流。

#### write(data[, key])

把 data 或一个由 key 指定的按键序列写入到 output。 只有当 output 是一个 [TTY](https://www.nodeapp.cn/tty.html) 文本终端时，key 参数才被支持。

当被调用时，如果 input 流已被暂停，则会恢复 input 流；如果 Interface 被创建时 output 被设为 null 或 undefined，则 data 和 key 不会被写入。

参数说明：

* data：字符串。
* key：Object
  * ctrl：布尔值，如果为 true，则表示 ctrl 键。
  * meta：布尔值，如果为 true，则表示 meta 键。
  * shift：布尔值，如果为 true，则表示 shift 键。
  * name：字符串，一个按键的名称。

如果指定了 key，则 data 会被忽略。

```javascript
readlineInst.write('输出！')
readlineInst.write(null, { ctrl: true, name: 'u' }) // 模拟 Ctrl+u 删除写入的前一行。
```

**注意：** write() 方法会写入数据到 readline 接口的 input，等同是用户提供的。

### readline方法

#### clearLine(stream, dir)

以 dir 指定的方向清除给定的 TTY 流的当前行。

参数说明：

* stream：可读的流；
* dir：数值，-1（光标左边）| 1（光标右边） | 0（整行）。

#### clearScreenDown(stream)

从光标的当前位置向下清除给定的 TTY 流。

参数说明：

* stream：可读的流。

#### createInterface(options)

创建一个 Interface 实例。

参数说明：

* options：Object。
  * input：可写的流，要监听的可读流。该选项是必需的。
  * output：可读的流，要写入逐行读取数据的可写流。
  * completer：一个可选的函数，用于 Tab 自动补全。该函数可获取用户输入的当前行作为参数，并返回一个包含以下两个条目的数组：一个包含匹配补全输入的数组、用于匹配的子字符串；该函数可接受两个参数，第二个参数是回调函数 ，可被异步调用？？。
  * terminal：布尔值。如果 input 和 output 应被当作一个 TTY，且要写入 ANSI/VT100 转换的代码，则设为 true。 默认为实例化时在 output 流上检查 isTTY。
  * historySize：数值，保留的历史行数的最大数量。 设为 0 可禁用历史记录。 该选项只有当 terminal 被用户或内部 output 设为 true 时才有意义，否则历史缓存机制不会被初始化。 默认为 30。
  * prompt：要使用的提示字符串。默认：`>`。
  * crlfDelay：数值，如果 \r 与 \n 之间的延迟超过 crlfDelay 毫秒，则 \r 和 \n 都会被当作换行分隔符。 默认：100 毫秒。
  * removeHistoryDuplicates：布尔值。如果为 true，则当添加到历史记录列表中的新输入行与旧输入行重复时，将从列表中删除旧的行。默认：false。

```javascript
const readlineInst = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (lines) => {
    return [['1111', '2222', '3333'], lines]
  },
  terminal: true,
  historySize: 30,
  prompt: '自定义提示符：',
  crlfDelay: 100,
  removeHistoryDuplicates: true
});
readlineInst.prompt('')
readlineInst.on('line', (line) => {
  console.log(`接收到：${line}`)
})
```

#### cursorTo(stream, x, y)

移动光标到给定的 TTY stream 中指定的位置。

参数说明：

* stream：可读的流；
*  x、y：数值。

#### moveCursor(stream, dx, dy)

移动光标到给定的 TTY stream 中相对当前的位置。

参数说明：

* stream：可读的流；
*  dx、dy：数值。

#### emitKeypressEvents(stream[, interface])

使给定的可读流 stream 相应于接收到的输入触发 keypress 事件。

参数说明：

* stream：Writable；
*  interface：Interface 实例，用于当自动补全被禁用时检测到复制粘贴输入

如果 stream 是一个 TTY，则它必须为原始模式。

### 参考资料

[API Reference Document - readline（逐行读取）](https://www.apiref.com/nodejs-zh/readline.html#readline_readline)