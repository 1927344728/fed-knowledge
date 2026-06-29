## 基础篇：MutationObserver对象

MutationObserver 接口提供了监视对 DOM 树所做更改的能力，比如，节点的增减、属性的变动、文本内容的变动。它是 DOM3 Events 规范的一部分，用来替代旧的 Mutation Events 功能。

概念上，它很接近事件，可以理解为 DOM 发生变动就会触发 Mutation Observer 事件。但是，它与事件有一个本质不同：事件是同步触发，也就是说，DOM 的变动立刻会触发相应的事件；Mutation Observer 则是异步触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。

Mutation Observer 有以下特点：

* 等待所有脚本任务完成后，才会运行（即异步触发方式）。
* 把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
* 既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。

### 构造函数

MutationObserver() 构造函数创建并返回一个新的观察器，它会在 DOM 变化时，调用指定的回调函数。MutationObserver 对 DOM 的观察不会立即启动；而必须先调用 observe() 方法来确定，要监听哪一部分的 DOM 以及要响应哪些更改。

```javascript
const observer = new MutationObserver(callback);
```

callback 是一个回调函数，在指定的节点或子树以及配置项有 DOM 变动时会被调用。回调函数拥有两个参数：一个是描述所有被触发改动的 MutationRecord 对象数组，另一个是调用该函数的 MutationObserver 对象。

```javascript
const observer = new MutationObserver(function callback (mutationList, mObserver) {
    mutationList.forEach((mutation) => {
        switch(mutation.type) {
            case 'childList':
                console.log('从树上添加或移除一个或更多的子节点')
                break;
            case 'attributes':
                console.log('节点的一个属性值被更改')
                break;
        }
    });
});
observer.observe(document.body, {
    childList: true,  // 观察目标子节点的变化，是否有添加或者删除
    attributes: true, // 观察属性变动
    subtree: true     // 观察后代节点，默认为 false
});
```

### 方法

#### observe()

配置了 MutationObserver 对象的回调方法以开始接收与给定选项匹配的 DOM 变化的通知。根据配置，观察者会观察 DOM 树中的单个 Node，也可能会观察被指定节点的部分或者所有的子孙节点。

要停止 MutationObserver（以便不再触发它的回调方法），需要调用 MutationObserver.disconnect() 方法。

```javascript
mutationObserver.observe(target[, options])
```

* target： DOM 树中的一个要观察变化的 DOM 节点（可能是一个 Element），或者是被观察的子节点树的根节点。

* options（可选）： 描述了 DOM 的哪些变化应该提供给当前观察者的回调函数。

  * childList（可选）： 是否监视目标节点（如果 subtree 为 true，则包含子孙节点）添加或删除新的子节点，默认值为 false。
  * attributes（可选）： 是否观察受监视元素的属性值变更，默认值 false。
  * characterData（可选）： 是否监视指定目标节点或子节点树中节点所包含的字符数据的变化。无默认值。

  * attributeFilter（可选）： 要监视的特定属性名称的数组，无默认值。如果未包含此属性，则对所有属性的更改都会触发变动通知。
  * attributeOldValue（可选）： 当监视节点的属性改动时，将此属性设为 true 时，将记录任何有改动的属性的上一个值。无默认值。
  * characterDataOldValue（可选）： 是否在文本在受监视节点上发生更改时记录节点文本的先前值。无默认值。
  * subtree（可选）：是否监视范围扩展至目标节点整个节点树中的所有节点，默认值 false。其他值也会作用于此子树下的所有节点，而不仅仅只作用于目标节点。

以下任一情况都会抛出异常：

* 配置选项使得实际上不会监视任何内容，即 childList、attributes、characterData 三个属性都为 false。
* attributes 为 false，但是 attributeOldValue 为 true 或者 attributeFilter 配置存在。
* characterData 为 false，但是 characterDataOldValue 为 true。

**注意：** 对一个节点多次添加同一个观察器是无效的，回调函数依然只会触发一次。但是，如果指定不同的 options 对象，就会被当作两个不同的观察器。

####  takeRecords()

返回已检测到但尚未由观察者的回调函数处理的所有匹配 DOM 更改的列表，**使变更队列保持为空**。 

此方法最常见的使用场景是在断开观察者之前，立即获取所有未处理的更改记录，以便在停止观察者时可以处理任何未处理的更改。

**注意：** 调用 takeRecords() 后，已发生但未传递给回调的变更队列将保留为空。

#### disconnect()

告诉观察者停止观察变动。 可以通过再次调用 observe() 方法来重启观察者。

**注意：** 所有已经检测到但是尚未向观察者报告的变动都会被丢弃。

**注意：** 如果被观察的元素被从 DOM 中移除，然后被浏览器的垃圾回收机制释放，此 MutationObserver 将同样被删除。

### 参考资料

[MDN - MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

[阮一峰 - Mutation Observer API](https://javascript.ruanyifeng.com/dom/mutationobserver.html)