## 基于create-react-app打造代码规范化的react+ts项目

Create React App 是一个官方支持的创建 React 单页应用程序的方法。它提供了一个零配置的现代构建设置。 

而在实际的项目开发中，我们通常希望可以自行配置一些参数。如：webpack 的`alias`、typescript 的`path`、eslint 的`rules`等。本文记录了基于 create-react-app 打造 react+ts 的过程遇到的各种问题，以及对应的解决方法。

* npm: 6.9.0
* node: v12.2.0
* react-scripts: 4.0.3 (发布新版本的 Create React App，更新 react-scripts 即可 )

### 创建项目

**创建 react + ts 项目：** `npx create-react-app my-app --typescript`

**安装 TypeScript 包:** `npm install --save typescript @types/node @types/react @types/react-dom @types/jest`

将 `.js、.jsx` 文件重命名为 `.ts、.tsx` 文件（typeScript文件），运行 `npm start` 启动项目。

> 注：不需要手动创建 `tsconfig.json` 文件。当项目中的 `src/` 路径下有TypeScript文件（`.ts|tsx`）时，运行 `npm start` 会自动创建`tsconfig.json` 文件。

### 自定义webpack

CRA 项目中，webpack 的配置是封装在 `react-scripts` 包内。扩展 webpack 配置有以下方法：

#### 1. `npm run eject` **（不推荐）**

它会将所有配置文件和传递依赖项（Webpack，Babel，ESLint等）复制到项目中，以便你可以完全控制它们。除 `eject` 之外的所有命令仍然有效，但它们将指向复制的脚本，以便你可以调整它们。

注意：**这是单向操作。一旦你 `eject` ，你就不能回去了！**

CRA 通过升级其中的 `react-scripts` 包来升级 CRA 的特性，而使用了 `eject` 命令，就再也享受不到 CRA 升级带来的好处了。因为 `package` 中的 `scripts` 的命令已经指向了项目中的配置文件，而不是指向 `react-scripts` 包。

#### 2. `react-app-rewired` +` customize-cra`

* **安装：**`npm i react-app-rewired customize-cra -S`

* **配置：**在项目根目录添加 `config-overrides.js` 配置文件

  该工具可以在不 `npm run eject`， 也不创建额外 `react-scripts` 的情况下修改 `create-react-app` 内置的 `webpack` 配置，然后你将拥有 `create-react-app` 的一切特性，且可以根据你的需要去配置 `webpack `的` plugins, loaders` 等。

  [查看更多配置](https://www.npmjs.com/package/react-app-rewired)

  ```js
  /* config-overrides.js */
  module.exports = function override(config, env) {
    //do stuff with the webpack config...
    return config;
  }
  ```

  默认情况下， `config-overrides.js` 文件导出单个函数，以便在开发或生产模式下自定义 webpack 配置。此外，该文件中也可以导出一个包含最多三个字段的对象，每个字段都是一个函数。如下：

  ```js
  /* config-overrides.js */
  module.exports = {
    // 该字段与 config-overrides.js 导出的单个函数的等效项。
    // 它无法在测试模式下配置编译，也不能用于自定义开发模式下的 Webpack Dev Server。
    webpack: function(config, env) {
      return config;
    },
    // 该配置应用于 Jest 模式下。这意味着上述 webpack 配置在测试模式下都是无效的。
    jest: function(config) {
      return config;
    },
    // 在开发模式下运行时，用于生成 dev server 配置。
    devServer: function(configFunction) {
      return function(proxy, allowedHost) {
        const config = configFunction(proxy, allowedHost);
        return config;
      };
    },
    // paths 字段用于为 create-react-app 传递到 webpack 和 jest 的路径提供覆盖。
    paths: function(paths, env) {
      return paths;
    }
  }
  ```

* 使用 customize-cra。

  `customize-cra` 用于改成 `react-app-rewired` 的 `config-overrides.js`文件。通过导入 `customize-cra` 功能和导出几个函数调用包裹在 `override` 函数中。这样，就可以很容易地修改组成`create-react-app` 的配置对象（`webpack`，`webpack-dev-server`，`babel`等）。

  [查看更多customize-cra api](https://github.com/arackaf/customize-cra)
  
  ```js
  /* config-overrides.js */
  const {
      override,
      disableEsLint,
      addWebpackAlias,
  } = require("customize-cra");
  const path = require("path");
  
  module.exports = override(
      disableEsLint(),
      addWebpackAlias({
          ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js")
      })
);
  ```

* 修改项目启动命令。

  ```json
  /* package.json */
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
  ```
  
* 自定义 `config-overrides.js` 路径。

  比如：您想要使用在 `node_modules` 中的第三方 `config-overrides.js`，您可以将以下内容添加到您的 `package.json`：

  ```json
  "config-overrides-path": "node_modules/some-preconfigured-rewire"
  ```

#### 3. [@craco/craco](https://www.npmjs.com/package/@craco/craco) 

`craco` 是另一款类似 `react-app-rewired` 的功能。

* 安装：`npm i @craco/craco -S`

* 配置：在项目根目录下添加 `craco.config.js` 配置文件。[更看更多配置](https://www.npmjs.com/package/@craco/craco)

  ```js
  /* craco.config.js */
  const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");
  
  module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    style: {},
    eslint: {},
    babel: {},
    typescript: {},
    webpack: {
      alias: {
        '@': path.resolve(__dirname, "src")
      },
      plugins: {
        add: [],
        remove: [],
      },
      configure: { },
      // configure: (webpackConfig, { env, paths }) => { return webpackConfig; }
    },
    jest: { },
    devServer: { },
    plugins: [ ]
  };
  ```
  
* 修改项目启动命令

  ```json
  /* package.json */
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
  ```


### 自定义Typescript

按上述安装方法创建项目后，运行 `npm start`，在 `src/` 有 typescript 文件的情况下，会自动创建 `tsconfig.json` 文件。 你可以编辑该文件。

**在建项过程中发现， 修改 `tsconfig.json`  文件中的 `compilerOptions.paths` 属性后，每次运行 `npm start`，该属性会被自动创建的文件覆盖。**

解决方案如下：

* 安装： `npm i @craco/craco -D`

* 新建 `tsconfig.paths.json` 文件

  ```json
  // tsconfig.paths.json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```

* 修改 `tsconfig.json` 文件。

  ```json
  // tsconfig.json
  {
    "extends": "./tsconfig.paths.json",
    ...
  }
  ```

### 环境变量

CRA 创建的项目可以使用环境中声明的变量，就像是在 JS 文件中本地声明的变量一样。默认情况下，项目将为你定义 `NODE_ENV` ，以及以 `REACT_APP_` 开头的任何其他环境变量。

**环境变量在构建期间嵌入**。由于 Create React App 生成静态的 HTML / CSS / JS 包，因此无法在 runtime(运行时) 读取它们。项目中的环境变量，会在构建静态文件时，替换成对应的值。

```js
console.log(process.env)

// FAST_REFRESH: true
// NODE_ENV: "development"
// PUBLIC_URL: ""
// WDS_SOCKET_HOST: undefined
// WDS_SOCKET_PATH: undefined
// WDS_SOCKET_PORT: undefined
```

`NODE_ENV`  是一个特殊内置环境变量。当你运行 `npm start` 时，它总是等于 `'development'` ，当你运行 `npm test` 它总是等于 `'test'` ，当你运行 `npm run build` 来生成一个生产 bundle(包) 时，它总是等于 `'production'` 。**你无法手动覆盖`NODE_ENV`。** 

> 注意：**必须以 `REACT_APP_` 开头创建自定义环境变量。除了 `NODE_ENV` 之外的任何其他变量都将被忽略。更改任何环境变量都需要重新启动正在运行的开发服务器。**

#### 自定义环境变量

有两种方式完成自定义环境变量：在 shell 中或在 `.env` 文件中。

* **在 Shell 中添加临时环境变量**

  定义环境变量可能因操作系统而异。 注意，**这种方式对于 shell 会话是暂时的**。

  ```shell
  # Windows (cmd.exe)
  # 注意：变量赋值需要用引号包裹，以避免尾随空格。）
  set "REACT_APP_SECRET_CODE=abcdef" && npm start
  
  # Windows (Powershell)
  ($env:REACT_APP_SECRET_CODE = "abcdef") -and (npm start)
  
  # Linux, macOS (Bash)
  REACT_APP_SECRET_CODE=abcdef npm start
  ```

* **在 `.env` 中添加开发环境变量**

  要定义永久环境变量，请在项目的根目录中创建名为 `.env` 的文件：

  ```shell
  # .env
  REACT_APP_WEBSITE_NAME=REACT+TS项目
  REACT_APP_AUTHOR=李兆
  REACT_APP_SECRET_NUMBER=123456
  ```

  环境变量间的引用：

  ```shell
  REACT_APP_VERSION=$REACT_APP_SECRET_NUMBER
  ```

#### 如何使用环境变量

* **在 HTML 中引用环境变量**

  ```html
  <!-- index.htm l-->
  <title>%REACT_APP_WEBSITE_NAME%</title>
  ```

* **在 JS 中引用环境变量**

  ```js
  // index.js
  console.log(process.env.REACT_APP_AUTHOR)
  ```

* **在 CSS 中引用环境变量**

  ```js
  # .env.local
  REACT_APP_MAIN_COLOR=red
  ```

  **方法一**：使用行内样式

  ```js
  <!--行内样式-->
  <div style=\{\{color: process.env.REACT_APP_MAIN_COLOR\}\}></div>
  ```

  **方法二：**使用 `CSS in JS`，即用 js  写 css，可用第三方库实现。如：`Style Components`、`Emotion`。

  **安装：**`npm i styled-components -D`

  ```js
  // index.js
  import styled from 'styled-components'
  const WrapperDiv = styled.div`
    color: ${process.env.REACT_APP_MAIN_COLOR}
  `;
  function App() {
    return <WrapperDiv>css in js</WrapperDiv>;
  }
  export default App;
  ```
  **方法三**：使用 CSS 预处理器来管理全局变量。如：sass。

  **安装：**`npm install node-sass -S`

  ```js
  // craco.config.js
  module.exports = {
    style: {
    	sass: {
    		loaderOptions: {
        	additionalData:  "$my-color: cyan;"
    		}
    	}
    }
  }
  ```

  ```css
  /* index.scss */
  .env_variable {
    color: $my-color;
  }
  ```

#### 其他 `.env` 文件

- `.env`：默认。
- `.env.local`：本地覆盖。**除 test 之外的所有环境都加载此文件**。
- `.env.development`, `.env.test`, `.env.production`：设置特定环境。
- `.env.development.local`, `.env.test.local`, `.env.production.local`：设置特定环境的本地覆盖。

左侧的文件比右侧的文件具有更高的优先级：

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` 。注意：**没有 `.env.local`**

### 代码规范化(Eslint\Prettier)

#### eslint配置

**方法一：Create React App 官方给出的[解决方案](https://create-react-app.dev/docs/setting-up-your-editor/#experimental-extending-the-eslint-config)**

* 添加境变量`EXTEND_ESLINT`为`true`。
* 修改 `eslant` 配置，可直接修改 `package.json` 配置，或者添加 `eslint.js` 文件。

```json
// package.json
{
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ],
    "rules": {
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    }
  },
}
```

```js
// eslintrc.js
module.exports = {
  extends: [
    "react-app",
    "react-app/jest"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
  },
}
```

**方法二：修改 `craco.config.js` 配置。**

```js
module.exports = {
  eslint: {
    enable: true,
    mode: "extends",
    configure: {
      extends: [
        "react-app",
        "react-app/jest"
      ],
      rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
      },
    },
    pluginOptions: {
    },
  },
}
```

#### prettier配置

* **安装：**`npm i prettier eslint-plugin-prettier eslint-config-prettier -D`

* **配置：**在 `package.json` 里添加 `prettier` 字段，或者在项目的根目录下添加 `.prettierrc` 或 `.prettierrc.js` 或 `.prettier.config.js` 和 `.prettierrc.toml` 文件。

  ```js
  // package.json
  {
    ...
    "prettier": {
      "printWidth": 80,
      "tabWidth": 2,
      "useTabs": false,
      "singleQuote": true,
      "semi": false
    }
  }
  ```

  ```js
  // .prettier.config.js
  module.exports = {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
    semi: true,
  }
  ```

* **命令行：**

  ```json
  // package.json
  // 采用.prettier.config.js配置时，命行令中要加 --config .prettier.config.js
  {
    "scripts": {
      "format": "prettier --write \"src/**/*.+(js|jsx|css)\"",
      // "format": "prettier --write --config .prettier.config.js \"src/**/*.+(js|jsx|css)\""
    },
  }
  ```

  然后，执行 `npm run format`即可。

* **整合：**prettier 和 Git 整合。

  **安装：**`npm i lint-staged husky -D`

  **配置：**

  ```js
  // package.json
  {
    ...
    "lint-staged": {
      "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
        "prettier --write --config .prettier.config.js \"src/**/*.+(js|jsx|css)\"",
        "git add"
      ]
    },
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
    },
  }
  
  ```

### 添加 Router(路由)

CRA 并未规定特定的Router(路由)解决方案，但 React Router 是最受欢迎的 Router(路由) 解决方案。

```js
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from '../home'
import About from '../about'
import Dashboard from '../dashboard'

function App () {
  return (
    <Router>
      <div>
        <ul>
          <li> <Link to="/">Home</Link> </li>
          <li> <Link to="/about">About</Link> </li>
          <li> <Link to="/dashboard">Dashboard</Link> </li>
        </ul>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
```

React Router中的组件主要分为三类：

- 路由器，例如`<BrowserRouter>` 和 `<HashRouter>`

  * `<BrowserRouter>` 使用常规URL路径。这些通常是外观最好的网址，但它们要求您的服务器配置正确。 具体来说，您的Web服务器需要在所有由React Router客户端管理的URL上提供相同的页面。

    请注意，在部署应用程序之前，[你可能需要配置生产服务器以支持客户端路由](https://www.html.cn/create-react-app/docs/deployment#serving-apps-with-client-side-routing)。

  * `<HashRouter>` 将当前位置存储在URL的哈希部分中，因此URL看起来类似于`http://example.com/#/your/page`。 由于哈希从不发送到服务器，因此这意味着不需要特殊的服务器配置。

- 路由匹配器，例如 `<Route>` 和 `<Switch>`

  渲染 `<Switch>` 时，它会搜索其子元素 `<Route>`，以查找其路径与当前URL匹配的元素。当找到一个时，它将渲染该 `<Route>` 并忽略所有其他路由。这意味着您应该将 `<Route>` 包含更多特定路径（通常较长）的路径放在不那么特定路径之前。

- 导航，例如 `<Link>`，`<NavLink>` 和 `<Redirect>`

### 添加样式

#### 如何引入样式

* **添加常规 CSS 文件。**即通过 `import` 的方式导入 `.css` 文件。

  ```css
  /**index.css**/
  .app_link {
    color: red
  }
  ```

  ```js
  import './index.css'
  function App() {
    return <div>
  		<p className="app_link">Learn React</p>
  	</div>
  }
  export default App
  ```

* **添加 CSS Modules 样式表**。

  CRA 项目使用 `[name].module.css` 文件命名约定支持 `CSS Modules` 和常规 CSS 。 CSS Modules 允许通过自动创建 `[filename]\_[classname]\_\_[hash]` 格式的唯一 `classname` 来确定 CSS 的作用域。

  ```css
  /**index.module.css**/
  .app_module_link {
    color: orange;
  }
  ```

  ```js
  import styles from './index.module.css';
  function App() {
    return <div>
  		<p className={styles.app_module_link}>Learn React</p>
  	</div>
  }
  export default App
  ```

  最终渲染结果：

  ```html
  <div><p class="index_app_link__1pkYt">Learn React</p></div>
  ```

* **添加 Sass 样式表**。

  首先，安装：`npm install node-sass -S`，然后，将文件扩展名改为 `.scss` 或 `.sass` （建议用 .scss，书写格式更接近常规css）。

  ```css
  /**index.scss**/
  .app_scss_link {
    color: $my-color;
  }
  ```

  ```js
  import './index.scss'
  function App() {
    return <div>
  		<p className="app_scss_link">Learn React</p>
  	</div>
  }
  export default App
  ```

* **使用css-in-js。**

  ```js
  // index.js
  import styled from 'styled-components'
  const LinkP = styled.p`
    color: deeppink;
  `;
  function App() {
    return <div>
  		<LinkP>Learn React</LinkP>
  	</div>
  }
  export default App
  ```

  最终渲染结果：

  ```html
  <div><p class="sc-bdnxRM kqYXav">Learn React</p></div>
  ```

#### Postcss预处理器

CRA 内嵌了压缩、自动添加浏览器前缀等插件，同时，你也可以按需要引入一些 Postcss 插件。如：`postcss-apply`、`postcss-css-variables`、`postcss-px2rem-exclude` 等。

**安装：**`npm i postcss-px2rem-exclude -D`

**配置：**修改 `craco.config.js`，添加 postcss 插件配置

```js
// craco.config.js
module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData:  "$my-color: cyan;"
      }
    },
    postcss: {
      plugins: [
        require("postcss-import")({
          "path": "src/assets/css"
        }),
        require("postcss-preset-env")({
          features: {
            "custom-properties": {
              preserve: false,
              variables: {}
            },
            "nesting-rules": true
          }
        }),
        require("postcss-apply")({}),
        require("postcss-css-variables")({}),
        require("postcss-px2rem-exclude")({
          remUnit: 16,
          exclude: /node_modules|folder_name/i
        }),
      ]
    },
  },
}
```

### 结语

CRA 项目还可以结合 `redux` 管理页面状态。

除了 `create-react-app` 外，也可以选用 `dva`、`umi`等应用框架。

* **[dva](https://dvajs.com/guide/)**

  dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。

  相比于 CAR 只是多了内置的 `redux` 和 `redux-saga`，帮我们处理了数据流这方面的需求而已。如果只是想要达到这个效果的话，直接在 CAR 中增加 dva 的依赖也是可以做到的。

* **[umi](https://v2.umijs.org/zh/guide/)**

  umi 是蚂蚁金服的底层前端框架，中文可发音为乌米，是一个可插拔的企业级 react 应用框架。umi 以路由为基础的，支持[类 next.js 的约定式路由](https://umijs.org/zh/guide/router.html)，以及各种进阶的路由功能，并以此进行功能扩展，比如[支持路由级的按需加载](https://umijs.org/zh/plugin/umi-plugin-react.html#dynamicimport)。然后配以完善的[插件体系](https://umijs.org/zh/plugin/)，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求，目前内外部加起来已有 50+ 的插件。

### 参考链接

[Create React App 中文文档](http://www.html.cn/create-react-app/)

[[译]基于create-react-app打造代码规范化的React项目](https://dumengjie.github.io/2018/09/11/%E8%AF%91-%E5%9F%BA%E4%BA%8Ecreate-react-app%E6%89%93%E9%80%A0%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83%E5%8C%96%E7%9A%84React%E9%A1%B9%E7%9B%AE/)

[这些 CSS-in-JS 库，谁更适合你](https://zhuanlan.zhihu.com/p/129670569)

[TypeScript 中文手册](https://typescript.bootcss.com/module-resolution.html)

[react-router-dom@5.x官方文档翻译](https://segmentfault.com/a/1190000020812860)

