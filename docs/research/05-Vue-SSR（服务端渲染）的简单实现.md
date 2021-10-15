## Vue SSR（服务端渲染）的简单实现

本文是在学习和运用服务端渲染时，记录实现的关键原理和主要流程，以及实际应用需要注意的一些问题。如果想快速的初步了解下服务端渲染，不妨一看；如需更深入了解，请查看 [Vue SSR 指南](https://ssr.vuejs.org/zh/)。据我看来，官方文档中，除开发环境配置这块，其他大部分都讲得非常清晰了。

### 什么是服务器端渲染 (SSR)？

Vue.js 是构建客户端应用程序的框架。默认情况下，浏览器访问请求的 HTML 文件，只包含样式引入、Js 文件引入和一个 `<div id=app></div>`  节点。HTML 的具体内容，是先加载对应的 Js 文件，再通过 Js 来创建 DOM 元素，然后挂载到 div 节点，最终渲染和绘制页面。因这些操作都是在浏览器完成的，称为**客户端渲染（CSR）**。

HTML文件源码结构大致如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8>
    <title>标题</title>
    <link href=/css/chunk-vendors.5beb2143.css rel=stylesheet>
    <link href=/css/index.56f9bfbc.css rel=stylesheet>
  </head>
  <body>
    <div id=app></div>
    <script src=/js/chunk-vendors.f96edd27.js></script>
    <script src=/js/chunk-common.890dd7ad.js></script>
    <script src=/js/index.d0e01cc1.js></script>
  </body>
</html>
```

然而，我们也可以在服务端，先将一个 Vue 组件渲染为 HTML 字符串，然后，在浏览器访问时，直接返回包含具体内容的 HTML 字符串，浏览器只需将 HTML 字符串解析为 DOM 元素，再渲染和绘制成页面。这种称为**服务端渲染（SSR）**。

服务器渲染的应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。

### 为什么使用服务器端渲染 (SSR)？

与传统 SPA （Single-Page Application，单页应用程序）相比，服务器端渲染 (SSR) 的优势主要在于：

* 更好的 SEO：由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。

  请注意，截至目前，Google 和 Bing 可以很好对同步 JavaScript 应用程序进行索引。在这里，同步是关键。如果你的应用程序需要通过 Ajax 获取内容，抓取工具并不会等待异步完成后再行抓取页面内容。

* 更快的内容到达时间 (time-to-content)：无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记。你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验。

使用服务器端渲染 (SSR) 时还需要有一些权衡之处：

* 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。

* 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。

* 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

在对你的应用程序使用服务器端渲染 (SSR) 之前，你应该问的第一个问题是，是否真的需要它。这主要取决于内容到达时间 (time-to-content) 对应用程序的重要程度。

### 一个简单示例

```js
// index.js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset=utf-8 />
          <title>Hello</title>
        </head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8088)
```

命令行运行 `node index.js`，在浏览器中访问 `http://localhost:8088/` 即可。

其中，最关键的是如何将 Vue 组件转换为 HTML 字符串。`vue-server-renderer` 提供 `createRenderer` 和 `createBundleRenderer` 两个方法，分别支持将 Vue 实例和 Bundle 对象转换为 HTML 字符串。一般来说，通过 `webpack` 打包的 Vue 组件，输出的是 Bundle 对象。

### SSR的关键步骤

#### 改造源码结构

客户端渲染时，每个用户在自己的浏览器中使用新应用程序的实例类，创建新的上下文，用户之间互不影响。但是，服务端渲染时，Node.js 服务器运行的是一个长期进程。如果每个用户向服务器请求的是同一个实例，用户间共享上下文，就很容易导致交叉请求状态污染。因此，我们需要的是一个可以重复执行的工厂函数，再分别对客户端渲染、服务端渲染配置不同构建。

* 工厂函数：每个执行可以创建新的应用程序实例（包括 Vue 组件、router、store 实例）

  ```js
  // main.js
  import Vue from 'vue'
  import AppVue from './App.vue'
  import { craeteRouter } from './router'
  import { createStore } from './store'
  
  Vue.config.productionTip = false
  export function createApp() {
    const router = craeteRouter();
    const store = createStore();
    const App = new Vue({
      router,
      store,
      render: h => h(AppVue)
    });
    return { App, router, store };
  }
  ```

* 客户端渲染：只需创建应用程序，并且将其挂载到 DOM 中。

  ```js
  // entry-client.js
  import { createApp } from "./main";
  const { App, router ,store } = createApp();
  
  // 替换 store 中的状态
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  
  router.onReady(() => {
    App.$mount('#app')
  });
  ```

* 服务器渲染：使用 `default export` 导出函数，在每次渲染中重复调用此函数。

  ```js
  // entry-server.js
  import { createApp } from "./main";
  const { App, router ,store } = createApp();
  
  default export function () {
    return { App, router, store }
  }
  ```

#### 改造构建配置（vue.config.js）

vue-cli 默认创建的是纯客户端的项目配置。服务端渲染的配置大体上与纯客户端项目类似，我们可以在默认配置上，根据环境变量为服务端渲染的增加不同的配置。

* 客户端渲染（纯客户端）：只需指定入口文件即可。

  ```js
  // vue.config.js
  let baseConfig = {
    configureWebpack: {
      entry: './src/entry-client.js'
    }
  }
  module.exports = baseConfig
  ```

* 服务端渲染（服务器配置）：服务器配置，是用于生成传递给 `createBundleRenderer` 的 server bundle。

  ```js
  // vue.config.js
  ...
  const merge = require("lodash.merge")
  const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
  const nodeExternalsNode = require('webpack-node-externals');
  baseConfig = merge(baseConfig, {
    outputDir: './dist/server',
    productionSourceMap: process.env.NODE_ENV === 'development',
    css: {
      extract: false
    },
    configureWebpack: {
      entry: './src/entry-server.js',
      target: 'node',
      output: {
        libraryTarget: 'commonjs2'
      },
      externals: nodeExternalsNode({
        whitelist: [/\.css$/, /\?vue&type=style/]
      }),
      optimization: {
        splitChunks: false
      },
      plugins: [
        new VueSSRServerPlugin()
      ]
    },
    chainWebpack: config => {
      const langs = ["css", "postcss", "scss", "sass", "less", "stylus"];
      const types = ["vue-modules", "vue", "normal-modules", "normal"];
      for (const lang of langs) {
        for (const type of types) {
          let rule = config.module.rule(lang).oneOf(type)
          rule.uses.clear();
          rule.use().loader('null-loader');
        }
      }
    }
  });
  ...
  ```

* 服务端渲染（客户端配置）：客户端配置，是用于生成客户端构建清单。在 Node 中启动 Web 应用程序时，它可以自动推断和注入资源预加载 / 数据预取指令(preload / prefetch directive)，以及 css 链接 / script 标签到所渲染的 HTML。

  ```js
  // vue.config.js
  ...
  const merge = require("lodash.merge")
  const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
  baseConfig = merge(baseConfig, {
    outputDir: './dist/client',
    productionSourceMap: process.env.NODE_ENV === 'development',
    css: {
      sourceMap: process.env.NODE_ENV === 'development',
    },
    configureWebpack: {
      entry: './src/entry-client.js',
      target: 'web',
      optimization: {
        runtimeChunk: {
          name: 'manifest'
        }
      },
      plugins: [
        new VueSSRClientPlugin()
      ]
    }
  })
  ...
  ```

#### Node.Js 启动 Web 服务

根据生成的服务端 bundle 和客户端构建清单，编译成 HTML 字符串，启动 Web 服务。

```js
// server/index.js
const path = require('path')
const fs = require("fs")
const express = require('express')
const Server = express()

const serverBundle = require('../dist/server/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json')
const template = fs.readFileSync(path.resolve(__dirname, '../src/template.html'), 'utf8')

const { createBundleRenderer } = require("vue-server-renderer")
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

Server.get('*', (request, response, next) => {
    const context = {
      url: request.url
    };
    renderer.renderToString(context, (error, html) => {
      if (error) {
        next();
      } else {
        response.end(html);
      }
    });
	},
);

const rendererServerPort = 8080
Server.listen(rendererServerPort, () => {
    console.log(`server listening on ${rendererServerPort} port`);
  }
)
```

### SSR的开发环境配置

到目前为止，我们已经实现了服务端渲染的实现。可以发现，HTML字符串的生成，是基于编译后，dist 目录下的 server bundle 和客户端构建清单这两个静态文件转换的。也就是说，每次编辑过应用程序源代码之后，都必须重新编译并生成这两个文件，重启 Web 服务。这在开发过程中会影响开发效率。

在 develop 模式下，webpack 输出内容是在内存中的。为提升开发效率，我们可以启动观察模式，当源码有变化时，从内存中重新读取 server bundle 和客户端构建清单文件。 [点击查看源码 vue-cli4-ssr-example](https://github.com/uioz/vue-cli4-ssr-example/blob/vue-cli4/server/dev.js)。

* 生成客户端构建清单：在原有的【服务端渲染（客户端配置）】中加上 `devServer` 配置。

  ```js
  // vue.config.js
  ...
  baseConfig = merge(baseConfig, {
    ...
    devServer: {
      port: 3030,
      headers: { 'Access-Control-Allow-Origin': '*' }
    },
    publicPath: 'http://localhost:' + 3030
  })
  ...
  ```

* 启动开发环境的 Web 服务：

  ```js
  // dev.js
  const path = require('path');
  const webpack = require('webpack');
  const express = require('express');
  const { createBundleRenderer } = require("vue-server-renderer");
  const MemoryFs = require('memory-fs');
  const http = require('http');
  const fs = require("fs")
  
  const webpackConfig = require('@vue/cli-service/webpack.config');
  const rendererServerPort = 8080
  const devServerPort = 3030
  
  const MemoryFsForCompiler = new MemoryFs();
  const serverBundleOutputPath = path.join(webpackConfig.output.path, 'vue-ssr-server-bundle.json');
  let serverBundle;
  
  const serverCompiler = webpack(webpackConfig);
  serverCompiler.outputFileSystem = MemoryFsForCompiler;
  serverCompiler.watch({}, (error, status) => {
    if (error) throw error;
    status = status.toJson();
    serverBundle = JSON.parse(MemoryFsForCompiler.readFileSync(serverBundleOutputPath, 'utf-8'));
    console.log('vue-ssr-server-bundle generated');
  });
  
  const htmlTempalte = fs.readFileSync(path.resolve(__dirname, '../src/template.html'), 'utf8');
  const app = express();
  app.get('*', async (request, response) => {
    if (serverBundle == undefined) {
      response.status(500);
      response.end('Server Not Ready Yet!');
    }
    try {
      const renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false, // 推荐
        template: htmlTempalte,
        clientManifest: await getManifest(`http://localhost:${devServerPort}/vue-ssr-client-manifest.json`)
      });
  
      renderer.renderToString({
        url: request.url,
      }, (error, html) => {
        if (error) {
          response.status(404);
          response.end(`${request.url} Not found`);
        } else {
          response.type('html');
          response.end(html);
        }
      });
    } catch {
      response.status(500);
      response.end('Missing vue-ssr-client-manifest.json! Does devServer running ?')
    }
  }).listen(rendererServerPort, () => {
      console.log(`server listening on ${rendererServerPort} port`);
    }
  );
  
  
  function getManifest(url) {
    return new Promise((resolve, reject) => {
      const client = http.get(url, (response) => {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
          try {
            resolve(JSON.parse(rawData))
          } catch (e) {
            reject(e);
          } finally {
            client.destroy();
          }
        });
      }).on('error', reject);
    });
  }
  
  ```

### 需要注意的问题

* **SSR 推荐使用：** 建议用于单页面项目，用 vue-router 管理路由、Vux 管理页面状态。多页面项目也可以用 SSR，但配置会更复杂。

* **生命周期：** SSR 中只有 `beforeCreate、created` 会被执行，而在 CSR 中所有周期都会再执行一遍。另外，在服务端代码中不要写有全局副作用的代码，如：`setInterval`，因为无法在 `beforeDestroy、destroyed `的生命周期销毁定时器。

* **尽量写通用代码：** 避免使用特定平台的 API，比如：浏览器的 `window、document、navigator` 等。特别注意第三方库的引入，有时候你并不知道引入的库能不能完全运行在 Node端/浏览器端。如果它只能运行在纯浏览器环境，可以在 `created` 阶段之后引入和执行。

* **数据预取问题：**  在 SSR 期间，如果应用程序依赖于一些异步数据，那么在开始渲染过程之前，需要先预取和解析这些数据。

  为了解决这个问题，我们采用 Vuex 管理页面状态。在服务器端，我们在渲染之前预取数据，并将数据填充到 store 中，然后，在 Vue 组件中引入这些数据。

  ```js
  // index.vue
  <template>
    <section>
      SSR异步数据：{{ssrPageData.title}}
    </section>
  </template>
  <script>
  export default {
    async asyncData({ store }) {
      return store.dispatch("setSsrPageData")
    },
    computed: {
      ssrPageData () {
        return this.$store.state.step.ssrPageData
      }
    }
  }
  </script>
  ```

  ```js
  // store.js
  export default {
    state: {
      ssrPageData: {},
    },
    mutations: {
      setSsrPageData(state, data){
        state.ssrPageData = data
      }
    },
    actions: {
      setSsrPageData: async function ({ commit }){
        const res = await getAsyncData()
        commit('setSsrPageData', {
          title: res.data.title
        })
      }
    },
  }
  ```

  ```js
  // entry-server.js
  import { createApp } from './main'
  const { App, store, router } = createApp()
  
  export default function createAppWithContext(context) {
    return new Promise((resolve, reject) => {
      router.push(context.url)
      router.onReady(async () => {
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
          return reject({ code: 404 })
        }
  
        const componentWithAsyncDataTaskQueue = [];
        for (const matchedComponent of matchedComponents) {
          if (matchedComponent.asyncData !== undefined) {
            componentWithAsyncDataTaskQueue.push(
              matchedComponent.asyncData({
                store
              })
            );
          }
        }
  
        for (const asyncTask of componentWithAsyncDataTaskQueue) {
          await asyncTask;
        }
        context.state = store.state;
  
        resolve(App);
      }, reject)
    })
  }
  ```

* **Cookie 问题：** 当服务端数据预取跟用户信息相关时，我们通常是通过浏览器中的 Cookies 进行管理。浏览器在发送请求时，会自动把 Cookie 添加到请求中的 Header 中，而在 SSR 时，Node.Js 需要手动获取浏览器发来 Cookie，并在发送给服务端的请求 Header 中设置 Cookie。

  SSR 共有3种解决 Cookies 问题的方案：一、把 Cookies 注入到 state；二、把 Cookies 注入到 global；三、将 Cookies 注入到组件的 asyncData 方法。

  随着 Vue 的升级，第一种方案已经不再适用；第二种方案也有不少的限制。目前主要用到的是第三种方案：

  **获取浏览器 Cookie：**

  ```js
  // server/index.js
  Server.get('*', (request, response, next) => {
    const context = {
      url: request.url,
      cookie: request.headers.cookie
    }
  })
  ```

  **将 Cookie 传给 `asyncData` 方法：**

  ```js
  // entry-server.js
  ...
  matchedComponent.asyncData({
    store,
    cookie: context.cookie
  })
  ...
  ```

  **将 Cookie 传给 actions：**

  ```js
  // index.vue
  <script>
  export default {
    async asyncData({ store, cookie }) {
      return store.dispatch("setSsrPageData", { cookie })
    }
  }
  </script>
  ```

  **将 Cookie 传给 api，再加到 axios 的 Headers。**

  ```js
  // store.js
  export default {
    actions: {
      setSsrPageData: async function ({ commit }, { cookie } ){
        const res = await getAsyncData({cookie})
        commit('setSsrPageData', {
          title: res.data.title
        })
      }
    }
  }
  ```

### [Nuxt.js](https://www.nuxtjs.cn/guide)

Nuxt.js 是一个基于 Vue.js 的通用应用框架，它预设了利用 Vue.js 开发服务端渲染的应用所需要的各种配置。

作为框架，Nuxt.js 为 客户端/服务端 这种典型的应用架构模式提供了许多有用的特性，例如异步数据加载、中间件支持、布局支持等。

Nuxt.js 集成了以下组件/框架，用于开发完整而强大的 Web 应用：

* Vue 2

* Vue-Router

* Vuex (当配置了 Vuex 状态树配置项 时才会引入)

* Vue 服务器端渲染 (排除使用 mode: 'spa')

* Vue-Meta

* 压缩并 gzip 后，总代码大小为：57kb （如果使用了 Vuex 特性的话为 60kb）。

* 另外，Nuxt.js 使用 Webpack 和 vue-loader 、 babel-loader 来处理代码的自动化构建工作（如打包、代码分层、压缩等等）。



### 参考资料

[Vue SSR 指南（官方）](https://ssr.vuejs.org/zh/)

[vue-server-renderer API 参考](https://ssr.vuejs.org/zh/api/#createrenderer)

[vue-cli4-ssr-example](https://github.com/uioz/vue-cli4-ssr-example/blob/vue-cli4/server/dev.js)

[再说 Vue SSR 的 Cookies 问题](https://segmentfault.com/a/1190000010225972)