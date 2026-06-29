## sentry基础篇（vue）

**Sentry**  是一个开源的错误追踪工具，提供端到端的分布式跟踪，使开发人员能够实时监控和调试系统和服务的性能问题和错误。其专注于错误监控以及提取所有调试所需的信息。它支持几乎所有主流开发语言 JS、Java、Python、php 和平台，并提供了网页来展示输出错误。

### Sentry 配置

**注册账号：** 在 https://sentry.io/signup/ 注册一个账号。

**安装：**

```shell
npm install @sentry/vue --save
```

**创建项目（vue3）：** 在 Sentry -> insights 页面，创建一个项目。选中新创建的项目，可以查看 dsn 等信息。

### 使用（vue3）

**初始化 Sentry：**

```shell
Sentry.init({
  dsn: "https://xxxxxxxxxxxxxxx@xxxx.ingest.us.sentry.io/xxxx",
  sendDefaultPii: true,
  integrations: [],
});
```

**验证 Sentry：**

```javascript
onMounted(() => {
  throw new Error('Sentry Error：Lizhao!');
})
```

**查看 Sentry：**

在 Sentry -> issues 页面，可以查看项目的报错信息。

### Sentry 选项

#### 核心选项

##### dsn

字符串，必传。

dsn 会告知 SDK 应将事件发送至何处。若未进行此设置，SDK 将不会发送任何事件。

> dsn 信息，可以 sentry.io -> insights -> Projects，选中具体项目查看。

##### debug

布尔值，可选。

开启或关闭调试模式。若调试功能已启用，SDK 将尝试输出有关其执行情况的有用调试信息。

##### release

字符串，可选。

设置发布版本。某些格式会由 Sentry 检测到并以不同的方式呈现。

在浏览器中，SDK 将尝试从 window.SENTRY_RELEASE.id 中读取此值（如果该值存在的话）。

```javascript
Sentry.init({
  release: "my-project-name@2.3.12",
});
```

##### environment

字符串，默认值 production，可选。

默认情况下，会根据应用程序是否被打包来选择“开发”或“生产”模式。当发送器接收到带有环境参数设置的事件时，它会自动创建一个环境（创建后，不能删除，但可以将其隐藏。）。

environment 的值是区分大小写的，名称不能包含换行符、空格或斜杠，不能是字符串 “None”，且不能超过 64 个字符。

##### tunnel

字符串，可选。

设置用于传输捕获事件的 URL。此设置可用于绕过广告拦截器，或者对发送至 Sentry 的事件进行更精细的控制。使用此选项时，仍需添加您的 DSN（数据传输标识符），以便在生成的 Sentry 数据中设置必要的属性。

此选项需要实现自定义服务器端点。

##### sendDefaultPii

布尔值，默认 false，可选。

设置为 true，可将默认的个人身份信息数据发送至 Sentry。除此之外，还将使在事件中自动收集 IP 地址成为可能。

##### maxBreadcrumbs

数值，默认 100，可选。

用于控制应捕获的面包屑条目的总数。Sentry 设有最大数据包大小限制，任何超出该大小限制的事件都将被丢弃。

##### attachStacktrace

布尔值，默认 false，可选。

启用后，所有的日志消息都会自动附带堆栈跟踪信息。

堆栈跟踪信息总是会附在异常中；但当此选项被设置时，它还会与消息一同发送。例如，此选项意味着堆栈跟踪信息会出现在使用 Sentry.captureMessage() 方法捕获的所有消息旁边。

在 Sentry 中对事件进行分组的方式对于带有堆栈跟踪的事件和没有堆栈跟踪的事件是不同的。因此，某些事件启用或禁用此标志时，会看到新的分组。

##### initialScope

CaptureContext 对象或者返回 CaptureContext 对象的函数 ，可选。

设置数据的初始范围。

```javascript
Sentry.init({
	dsn: 'xxx',
  initialScope: {
    tags: { 'my-tag': 'my value' },
    user: { id: 42, email: 'john.doe@example.com' },
  },
});
```

##### maxValueLength

数值，默认 250，可选。

发送至 Sentry 的事件中，每个字符串属性的最大字符数（超过此数量后将被截断）。

##### normalizeDepth

数值，默认 3，可选。

Sentry SDKs 会将任何上下文数据规范化至指定的深度。超过此深度的数据将被修剪并用其类型（[对象] 或 [数组]）进行标记，而不会进一步遍历树结构。

##### normalizeMaxBreadth

数值，默认 1000，可选。

在使用 SDK 对上下文数据进行规范化处理时，任何给定对象或数组中所能包含的最大属性或条目数量。超出此深度的数据将被删除。

##### enabled

布尔值，默认 true，可选。

指定是否应向 Sentry 发送事件。

**注意：** 若设置为 false，并不会完全避免 Sentry 代码中的所有开销。若要完全禁用 Sentry，则需根据环境情况有条件地调用 Sentry.init。

##### sendClientReports

布尔值，默认 true，可选。

设置为 false，可禁用客户端报告的发送功能。

客户端报告是协议中的一个特性，它允许客户端向 Sentry 发送关于自身的状态报告。

目前，它们主要用于为那些从未发送出去的事件发出结果报告。

##### [integrations](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/)

Integration 数组或者返回 Integration 数组的函数，默认空数组，可选。

进行一些需要与 SDK 一同初始化的额外**集成操作**。集成是指一些可使用的代码片段，用于扩展 SDK 的功能。它们可用于添加自定义事件处理器、上下文提供程序，或者与 SDK 的生命周期进行关联。

##### [defaultIntegrations](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/#modifying-default-integrations)

undefined 或 false，可选。

禁用默认添加的集成。设置设为 false，将不会添加任何默认集成。

##### beforeBreadcrumb

返回 Breadcrumb 对象的函数或者 null，可选。

在将面包屑添加到作用域之前，先调用此函数并传入一个面包屑对象。

如果该函数无返回值，则会丢弃该面包屑。若要传递面包屑，则需返回第一个参数（其中包含面包屑对象）。回调函数会收到第二个参数（称为“提示”），该参数包含创建面包屑时所使用的原始对象，以便进一步自定义面包屑的外观。

```javascript
(breadcrumb: Breadcrumb, hint?: BreadcrumbHint) => Breadcrumb | null
```

##### transport

返回 Transport 对象的函数，可选。

JavaScript SDK 使用传输机制将事件发送至 Sentry。在现代浏览器中，大多数传输机制都使用浏览器的 fetch API 来发送事件。如果由于网络连接问题导致无法发送事件，传输机制将会丢弃该事件。

在浏览器中，默认情况下会使用基于 “fetch” 的传输方式。

```javascript
(transportOptions: TransportOptions) => Transport
```

```javascript
import { createTransport } from '@sentry/core';
import * from '@sentry/browser';

function makeFetchTransport(options) {
  function makeRequest(request) {
    const requestOptions = {
      body: request.body,
      method: 'POST',
      referrerPolicy: 'origin',
      headers: options.headers,
      ...options.fetchOptions,
    };

    return fetch(options.url, requestOptions).then(response => {
      return {
        statusCode: response.status,
        headers: {
          'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
          'retry-after': response.headers.get('Retry-After'),
        },
      };
    });
  }

  return createTransport(options, makeRequest);
}

Sentry.init({
  transport: makeFetchTransport
});
```

##### transportOptions

TransportOptions 对象，可选。

用于配置传输方式的选项。这是一个包含以下可选键的对象：

* headers：一个包含需随每次请求一同发送的头部信息的对象。
* fetchOptions：一个包含需传递给 fetch 调用的选项的对象。由 SDK 的 fetch 传输机制使用。

#### 错误监测选项

##### sampleRate

数值，默认 1，可选。

设置错误事件的采样率，范围在 0.0 到 1.0 之间。默认值为 1.0，这意味着 100% 的错误事件都会被发送。如果设置为 0.1，则只会发送 10% 的错误事件，即事件是随机选取的。

##### beforeSend

返回 Event 对象的函数或 null，可选。

用于 SDK 的消息或错误事件对象调用，并且可以返回修改后的事件对象，或者返回 null 以跳过事件的报告。

在 beforeSend 被执行时，所有的作用域数据都已经应用于该事件了。对作用域的进一步修改将不会产生任何效果。

```javascript
(event: Event, hint: EventHint) => Event | null
```

##### ignoreErrors

数组（字符串或正则达表式），默认值空数组，可选。

与这些字符串或正则表达式匹配的消息，在发送至 Sentry 之前将被过滤掉。

使用字符串时，部分匹配的也会被过滤掉，因此如果您需要按精确匹配进行筛选，请使用正则表达式。

##### denyUrls

数组（字符串或正则达表式），默认值空数组，可选。

用于匹配已产生错误的**脚本的 URL**。在这些 URL 上产生的错误将不会被发送至 Sentry。

##### allowUrls

数组（字符串或正则达表式），默认值空数组，可选。

用于匹配已产生错误的**脚本的 URL**。只有在这些 URL 上产生的错误才会被发送至 Sentry。

##### attachProps

布尔值，默认 true，可选。

启用后，抛出错误的 Vue 组件的所有属性都会附加到该事件中。

##### attachErrorHandler

布尔值，默认 true，可选。

默认情况下，SDK 会附加一个 Vue 错误处理程序，用于捕获 Vue 异常并将其报告给 Sentry。设置为 false 时，自动错误报告功能将被禁用。

通常情况下，此选项应保持启用状态，除非想要自行设置 Sentry 错误报告功能。例如，Sentry 的 Nuxt SDK 并不会添加错误处理程序，因为它是通过 Nuxt 提供的错误钩子来捕获错误的。

#### 追踪选项

##### 核心概念

**Trace（追踪）**，一个完整的请求生命周期，从开始到结束的所有操作。它包含一个或多个 Transaction，具有唯一的 traceId，可以跨服务、跨系统追踪。比如，一个用户从点击按钮到看到完整页面的全过程。

**Transaction（事务）**，表示一个完整的工作单元，通常是应用程序中的单个操作。它包含一个或多个 Span，有明确的开始和结束时间，通常对应一个路由切换或API调用。比如：Vue 路由切换、一个完整的 API 请求-响应周期、用户点击按钮触发的复杂操作。

**Span（跨度）**，事务中的单个操作或步骤。它代表事务中的具体操作，有明确的开始和结束时间，可以嵌套其他 Span。比如：数据库查询、外部API调用、组件渲染、函数执行。

```text
Trace (整个请求流)
│
└── Transaction 1 (如: 页面加载)
    │
    ├── Span 1.1 (如: 路由匹配)
    ├── Span 1.2 (如: API调用)
    │   ├── Span 1.2.1 (如: DNS查询)
    │   └── Span 1.2.2 (如: 网络传输)
    └── Span 1.3 (如: 组件渲染)
```

##### tracesSampleRate

数值，可选。

一个介于 0 到 1 之间的数值，用于控制特定交易被发送至 Sentry 的概率百分比。（0 表示 0%，而 1 表示 100%。）该设置适用于应用程序中创建的所有事务。

要么定义此选项，要么定义 traceSampler 选项，以便启用跟踪功能。

##### tracesSampler

返回数值或布尔值的函数，可选。

用于确定被发送至 Sentry 的概率的函数。该函数会自动接收有关该事务及其创建环境的信息，并必须返回一个介于 0（发送概率为 0%）和 1（发送概率为 100%）之间的数值。还可以通过返回 0 来筛选出不需要的事务。

必须定义此函数或者 traceSampleRate，以便启用跟踪功能。

函数的参数，SamplingContext 对象，具有以下属性：

* parentSampled：布尔值，父事务的采样决策。如果父事务进行了采样，则此值为真；否则为假。
* name：采样启动时的名称。
* attributes：采样的初始属性。

```javascript
(samplingContext: SamplingContext) => number | boolean
```

##### tracePropagationTargets

数组（字符串或正则达表式），可选。

用于控制哪些下游服务能够接收跟踪数据。该数据以发送记录（sentry-trace）和附加到任何发出的 HTTP 请求中的头（baggage header）的形式呈现。

用于与发出的**请求的 URL** 进行匹配。如果列表中的某一项与发出请求的 URL 相匹配，那么将会有跟踪数据附加到该请求上。**字符串项不必完全匹配**，也就是说，只要请求的 URL 包含通过该选项提供的字符串，就会将其匹配成功。

在浏览器中，默认情况下，所有发往相同源的请求都会被传递出去。

如果想要禁用跟踪传播功能，可以将此选项设置为“[]”。

##### beforeSendTransaction

返回 TransactionEvent 对象或 null 的函数，可选。

通过一个事务事件对象调用，并且可以返回修改后的事务事件对象，或者返回 null 来跳过对该事件的事务。

```javascript
(event: TransactionEvent, hint: EventHint) => TransactionEvent | null
```

##### beforeSendSpan

返回 SpanJSON 对象的函数，可选。

通过一个序列化对象调用，并且能够返回一个修改后的对象。此函数不仅对根跨度调用，对所有子跨度也同样适用。

如果您想要删除根跨度及其所有子跨度，请使用 beforeSendTransaction 替代此函数。

##### ignoreTransactions

数组（字符串或正则达表式），默认空数组，可选。

用于匹配不应发送至 Sentry 的事务名称。与这些字符串或正则表达式匹配的事务在发送至 Sentry 之前将被过滤掉。使用字符串时，部分匹配的交易将被过滤掉。

默认情况下，典型 API 健康检查请求的事务会被过滤掉。

##### ignoreSpans

数组（字符串或正则表达式或对象），默认空数组，可选。

用于匹配不应发送至 Sentry 的跨度名称。使用字符串时，部分匹配将被过滤掉。

如果根跨度与任何指定的模式相匹配，那么整个本地跟踪将会被删除。如果子跨度匹配，其子跨度将被重新归入被删除跨度的父跨度之下。

默认情况下，不会忽略任何跨度。

```javascript
Array<string | RegExp | {name?: string | RegExp, op?: string | RegExp}>
```

#### 会话回放选项

##### 核心概念

Session Replay（会话回放）是 Sentry 提供的一项功能，它通过记录用户在应用程序中的实际交互过程，帮助开发者更全面地理解错误发生的上下文环境。

**Session Replay** 是一种记录和回放用户与应用程序交互过程的技术，它创建用户会话的视频式重现（非真实视频，而是基于DOM的复现），与错误监控和性能追踪数据关联，提供完整的上下文。

**Session Replay 工作原理：**

- 捕获 DOM 变化（通过 MutationObserver）
- 记录用户交互（点击、滚动、输入等）
- 收集网络请求和 console 日志
- 压缩并分段发送数据到 Sentry

##### replaysSessionSampleRate

数值，可选。

对于立即开始录制并持续整个用户会话的回放，其采样率设定为：1 表示收集所有回放，0 则表示不收集任何回放。

##### replaysOnErrorSampleRate

数值，可选。

当出现错误时所录制的回放的采样率。这种类型的回放会记录错误发生前最多一分钟的事件，并持续录制直至会话结束。1 会收集所有出现错误的会话，而 0 则不会收集任何会话。

#### 性能选项

##### 核心概念

Profiling（性能剖析）是 Sentry 提供的高级性能监控功能，它通过收集和分析应用程序运行时的详细性能数据，帮助开发者深入理解代码级别的性能瓶颈。

**基本定义**

- **Profiling** 是一种细粒度的性能分析技术
- 记录代码执行时的调用栈、函数耗时、资源使用等数据
- 生成"火焰图"(Flame Graph)可视化性能热点
- 与错误和事务(Transaction)关联，提供完整的性能上下文

##### profilesSampleRate

数值，可选。

用于控制特定采样交易被分析的几率百分比。（0 表示 0%，而 1 表示 100%。）适用于应用程序中创建的所有事务。

这与追踪采样率相关——例如 0.5 表示 50%的采样交易将被分析。

### Integrations选项

##### 核心概念

Integrations（集成）是 Sentry SDK 的核心扩展机制，它们通过模块化的方式为 SDK 添加特定平台或框架的监控能力。

**基本定义：**

- **Integration** 是 Sentry 的功能插件
- 每种集成负责处理特定类型的监控场景
- 可以单独启用/禁用，按需组合使用
- 自动增强SDK的基础功能

集成按钮功能分类，包括：框架集成（Vue/React/Angular）、性能监控（BrowserTracing）、上下文增强（ContextLines）、环境适配（Dedupe）、辅助工具（Debug）。

##### 添加集成

```javascript
Sentry.init({
	integrations: [
    Sentry.reportingObserverIntegration()
  ]
});
```

##### 动态导入（推荐）

```javascript
Sentry.init({
  integrations: [],
});
import("@sentry/vue").then((lazyLoadedSentry) => {
  Sentry.addIntegration(lazyLoadedSentry.replayIntegration());
});
```

##### 删除默认集成

禁用所有集成可用 `defaultIntegrations: false`。只想删除一个或一些默认集成，则可以使用以下语法来过滤掉不想要的集成。

```javascript
Sentry.init({
  integrations: function (integrations) {
    return integrations.filter((integration) => integration.name !== "Breadcrumbs");
  }
});
```

##### 自定义集成

定制集成必须符合集成接口的要求。

```javascript
function myAwesomeIntegration() {
  return {
    name: "MyAwesomeIntegration",
    // SDK 初始化时，会调用 setup 钩子函数
    setup(client) {
      setupCustomSentryListener(client);
    },
    // processEvent 钩子用于在事件发送至 Sentry 之前对其进行修改
    processEvent(event, hint, client) {
      event.extra = {
        ...event.extra,
        myCustomTag: "value",
      };
      return event;
    },
    // preprocessEvent 钩子与 processEvent 类似，但它会在将事件传递给任何其他 processEvent 钩子之前被调用
    preprocessEvent(event, hint, client) {
      event.extra = {
        ...event.extra,
        myCustomTag: "value",
      };
    },
    // setupOnce 钩子与 setup 类似，但它只会运行一次，即便 SDK 重新初始化也是如此。
    // 使用 setupOnce 的唯一原因可能是，当多次调用 Sentry.init() 时，希望确保某段代码仅运行一次。
    setupOnce() {
      wrapLibrary();
    },
    // 在对所有集成进行 setupOnce() 和 setup() 调用之后，afterAllSetup 钩子会触发
    afterAllSetup(client) {
      startSomeThing(client);
    },
  };
}

Sentry.init({
  integrations: [myAwesomeIntegration()],
});
```

##### Breadcrumbs（默认集成，仅浏览器能运行）

Breadcrumbs（面包屑）是 Sentry 错误监控系统中的关键诊断工具，它记录了导致错误发生前的一系列系统事件和用户操作，形成可追溯的事件轨迹。

**Breadcrumbs** 是按时间顺序记录的应用事件流，每个记录称为一个"面包屑"（Breadcrumb），自动附加到错误报告中提供上下文。

Breadcrumbs 会封装原生 API 来捕获面包屑信息。默认情况下，Sentry SDK 会对浏览器的 **console、dom、fetch、history 和 xhr** 等 API 进行封装，以添加跟踪记录。

```javascript
Sentry.init({
  integrations: [
    Sentry.breadcrumbsIntegration({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      xhr: true,
    }),
  ],
});
```

##### BrowserApiErrors（默认集成，仅浏览器能运行）

将原生的时间和事件 API（如 **setTimeout、setInterval、requestAnimationFrame、addEventListener/removeEventListener**）封装在 `try/catch` 块中，以处理异步异常。

```javascript
Sentry.init({
  integrations: [
    Sentry.browserApiErrorsIntegration({
      setTimeout: true,
      setInterval: true,
      requestAnimationFrame: true,
      XMLHttpRequest: true,
      eventTarget: true,
      unregisterOriginalCallbacks: true,
    }),
  ],
});
```

##### BrowserProfiling（仅浏览器能运行）

捕获浏览器的性能分析数据。

它通过浏览器的 JS 自动分析 API 来捕获分析数据，并将其发送至 Sentry。要使用此集成，还需要启用浏览器跟踪集成。

```javascript
Sentry.init({
  integrations: [Sentry.browserProfilingIntegration()],
});
```

##### BrowserSession（仅浏览器能运行）

在浏览器中跟踪会话情况，跟踪用户的使用情况以及应用程序的无崩溃率。

```javascript
Sentry.init({
  integrations: [Sentry.browserSessionIntegration()],
});
```

##### BrowserTracing（仅浏览器能运行）

捕获浏览器的性能数据。

```javascript
Sentry.init({
  integrations: [Sentry.browserTracingIntegration()],
});
```

##### CaptureConsole

捕获所有 console API 调用。

```javascript
Sentry.init({
  integrations: [Sentry.captureConsoleIntegration({
    levels: ['log', 'info', 'warn', 'error', 'debug', 'assert']
	})],
})
```

##### ContextLines

从当前页面 HTML 的内联 JavaScript 中添加源代码。

此集成会将当前页面 HTML 中内联 JavaScript 的源代码（如，script 标签中的 JavaScript 代码），添加到捕获的错误的堆栈跟踪中。

但它无法收集由 HTML 引用的资源（如 `<script src="..."` ）中的源代码。

```javascript
Sentry.init({
  integrations: [Sentry.contextLinesIntegration({
    // 每个堆栈帧行号周围要收集的行数。默认值为 7 。
    frameContextLines: 7
	})]
});
```

##### Dedupe（默认集成）

对某些事件进行去重处理，以避免收到重复错误信息。

```javascript
Sentry.init({
  integrations: [Sentry.dedupeIntegration()],
});
```

##### ExtraErrorData

从错误对象中提取所有非本地属性，并将这些属性作为附加数据附加到事件中。

```javascript
Sentry.init({
  integrations: [Sentry.extraErrorDataIntegration({
    depth: 3,
    captureErrorCause: true
	})],
});
```

##### FunctionToString（默认集成）

允许保留原始的功能名称和方法名称，即便这些功能或方法已被错误处理或导航条目处理程序所封装。

```javascript
Sentry.init({
  integrations: [Sentry.functionToStringIntegration()],
});
```

##### GlobalHandlers（默认集成）

附加全局处理程序以捕获未捕获的异常和未处理的拒绝情况。

```javascript
Sentry.init({
  integrations: [Sentry.globalHandlersIntegration({
    onerror: true,
    onunhandledrejection: true
  })],
});
```

##### HttpClient（仅浏览器能运行）

捕获来自“Fetch”和“XHR”的失败请求中的错误，并附上请求和响应信息。

```javascript
Sentry.init({
  integrations: [Sentry.httpClientIntegration()]
});
```

##### HttpContext（默认集成，仅浏览器能运行）

将 HTTP 请求信息（如 URL、用户代理、引用信息以及其他头部信息）附加到事件中。

```javascript
Sentry.init({
  integrations: [Sentry.httpContextIntegration()],
});
```

##### InboundFilters（默认集成）

允许根据异常的类型、消息或 URL 来忽略特定的错误。

通过 ignoreErrors、ignoreTransactions、denyUrls、allowUrls 等错误监测选项来指定，如：

```javascript
Sentry.init({
  ignoreErrors: ["ignore-this-error"]
});
```

##### LinkedErrors（默认集成）

允许配置 link 错误。

```javascript
Sentry.init({
  integrations: [Sentry.linkedErrorsIntegration()],
});
```

##### Vue（默认集成）

为 Vue 应用程序添加错误和跨度监测功能。

```javascript
Sentry.init({
  integrations: [Sentry.vueIntegration()],
});
```

```javascript
Sentry.init({
  integrations: (integrations) =>
    integrations.filter((integration) => integration.name !== "Vue"),
});

const app = createApp({
  template: "<div>hello</div>",
});

Sentry.addIntegration(Sentry.vueIntegration({ app }));
```

### Sentry APIs

##### init

使用给定的选项初始化 SDK 。

```javascript
Sentry.init({
  dsn: "xxxxxx",
  sendDefaultPii: true,
  integrations: [],
});
```

##### addIntegration

在 SDK 中添加了一项集成功能。

```javascript
Sentry.addIntegration(Sentry.vueIntegration());
```

##### captureException

捕获异常事件并将其发送至 Sentry。

```javascript
  Sentry.captureException('captureException', {
    user:  {
      id: '1111',
      email: '2222',
      ip_address: '',
      username: '3333',
    },
    level: 'error', // fatal | error | warning | log | info | debug
    extra: {},
    tags: {},
    contexts: {},
    fingerprint: [''],
  })
```

##### captureMessage

捕获原始消息。消息是指需要发送至 Sentry 的文本信息。
```javascript
Sentry.captureMessage("Something went wrong");
// 指定严重程度级别(可选)：fatal error warning log debug info（efault）
Sentry.captureMessage("Something went wrong", "warning");
```

### Vue 特性

#### Pinia

获取 Pinia 状态数据。

```javascript
import { createPinia } from "pinia";
import { createSentryPiniaPlugin } from "@sentry/vue";
const pinia = createPinia();
pinia.use(createSentryPiniaPlugin());
```

##### attachPiniaState

布尔值，默认 true

将 Pinia 状态附加到 Sentry 事件中。

##### addBreadcrumbs

布尔值，默认 true

在 Sentry 事件中添加面包屑信息。

##### actionTransformer

函数

用于从 Pinia 操作中删除敏感信息。

传递给该函数的第一个参数是 Pinia 操作的名称。默认情况下，会发送所有操作，如果不想将操作名称发送至 Sentry，返回 null。

##### stateTransformer

函数

用于从 Pinia 状态中删除敏感信息。

传递给该函数的第一个参数是 Pinia 状态。默认情况下，会记录所有状态的变化。如果不想将状态变化附加到发送到 Sentry 的事件中，返回 null。

#### Track Vue Components

Sentry 的 Vue SDK 提供了一项用于监控 Vue 组件性能的功能：组件跟踪。启用此功能后，将在事务中获得表示组件生命周期事件及其持续时间的跨度。

可将 Vue Integration 添加到 `Sentry.init()` 调用中并设置 `tracingOptions.trackComponents` 选项。传递 `true` 以跟踪所有子组件，或指定要跟踪的单个组件的列表。

```javascript
import * as Sentry from "@sentry/vue";
Sentry.init({
  integrations: [
    Sentry.vueIntegration({
      tracingOptions: {
        // 默认是 false。设置为 true，表示跟踪所有子组件
        trackComponents: ["App", "RwvHeader", "RwvFooter", "RwvArticleList", "Pagination"], 
        // 默认是 ['activate', 'mount', 'update']
        hooks: ['activate', 'create', 'unmount', 'mount', 'update'],
      },
    }),
  ],
});
```

#### Vue Router

路由检测工具，可获得更具参数化的事务名称。

```javascript
import Vue from "vue";
import * as Sentry from "@sentry/vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({);
Sentry.init({
  Vue,
  integrations: [
    Sentry.browserTracingIntegration({
      router,
			// 可选值 name | path。name：将使用 route.name （如果已设置），否则将使用路由的路径；path：始终使用路径。
      routeLabel: "path", 
    })
  ]
});
```

#### Multiple Vue Apps

Vue 3 允许使用同一个 Sentry SDK 实例来运行多个应用程序，并且在 SDK 已经初始化完成之后，还可以动态添加更多应用程序。

```javascript
const appOne = Vue.createApp(App);
const appTwo = Vue.createApp(App);
const appThree = Vue.createApp(App);
Sentry.init({
  app: [
    appOne,
    appTwo,
    appThree
  ],
});
```

```javascript
const myLazyApp = createApp(MiscApp);

myLazyApp.mixin(Sentry.createTracingMixins({
  trackComponents: true
}));
Sentry.attachErrorHandler(myLazyApp);
```

### 参考资料

[sentry官网](https://docs.sentry.io/)

