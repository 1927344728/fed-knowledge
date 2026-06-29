## React Native 基础篇

React Native 是由 **Facebook（现 Meta）** 开源的一个跨平台移动应用开发框架，于 2015 年发布。它允许开发者使用 **React** 和 **JavaScript** 来构建原生 iOS 和 Android 应用。

**核心特点**：

* **Learn Once, Write Anywhere**：与 React 语法一致，但组件映射到原生 UI 组件（如 `<View>` → `UIView`/`View`），而非 DOM 元素。
* **原生渲染**：不使用 WebView，直接调用平台原生 UI 组件和 API，性能接近纯原生应用。
* **热重载（Hot Reloading）**：代码修改后实时看到效果，保留应用状态，极大提升开发效率。

### 创建项目

目前 React Native 官方文档和社区都已将 Expo 作为**默认推荐**的创建项目方式。

**Expo 是构建在 React Native 之上的上层框架（Framework）**。React Native 是底层引擎，Expo 在它外面封装了一套完整的工具链和开发服务。

**创建项目**：

```shell
npx create-expo-app@latest react-native-demo
cd react-native-demo
npx expo start
```

运行 `npx expo start` 后，终端会显示一个 QR 码，开发服务器就启动成功了。

**在设备上运行应用（安卓）**：

* 在安卓机上安装 **Expo Go** App。
* 打开 **Expo Go** App，选择 "Scan QR Code"，扫描终端中的二维码。
* 确保**电脑和手机连接同一个 Wi-Fi**（电脑别插网线）。

### 本地构建（APK）

#### 安装环境

在开始构建前，需要先安装好 Android 开发环境。

* **安装 Android Studio**：从 [Android Studio 官网](https://developer.android.com/studio) 下载并安装。安装时勾选：Android Studio、Android Virtual Device (AVD) 。

* **安装 Android SDK**：打开 Android Studio，进入 **Settings > Languages & Frameworks > Android SDK**：

  - 在 **SDK Platforms** 选项卡中，勾选 **Android 15 (VanillaIceCream)** 下的 `Android SDK Platform 35` 。

  - 在 **SDK Tools** 选项卡中，确保已安装 `Android SDK Build-Tools` 和 `Android Emulator` 。

* **配置环境变量（Windows）**：

  - 在系统环境变量中新建 `ANDROID_HOME`，值为 Android SDK 路径（默认 `%LOCALAPPDATA%\Android\Sdk`）。

  - 将 `%ANDROID_HOME%\platform-tools` 添加到 `Path` 变量中 。

* **验证环境**：打开终端，运行以下命令确认环境配置正确。

  ```shell
  adb --version
  ```

#### 构建调试版（Debug APK）

调试版**无需签名**，可以直接安装到手机测试，适合开发阶段快速验证。

**运行构建命令**：

- 自动执行 `npx expo prebuild`  生成  `android` 目录。
- 编译原生代码并生成调试版 APK。
- 自动安装到已连接的 Android 设备或模拟器上。

```shell
npx expo run:android

# 或者
npm run android
```

构建完成后，APK 文件位于：

```shell
android/app/build/outputs/apk/debug/app-debug.apk
```

#### 构建正式版（Release APK）

正式版**必须签名**才能安装到手机或提交到应用商店。

##### 生成签名密钥

```shell
cd react-native-demo
keytool -genkey -v -keystore react-native-demo.keystore -alias react-native-demo -keyalg RSA -keysize 2048 -validity 10000
```

运行后会提示输入：**密钥库密码**、**密钥密码**、姓名、组织、城市等基本信息。

命令执行后，会在当前目录生成 `.keystore` 文件，将 `.keystore` 文件移动到 `android/app` 目录下。

##### 配置 Gradle 签名

打开 `android/gradle.properties` 文件，在末尾添加：

```properties
MYAPP_UPLOAD_STORE_FILE=react-native-demo.keystore
MYAPP_UPLOAD_KEY_ALIAS=react-native-demo
MYAPP_UPLOAD_STORE_PASSWORD=[密钥库密码]
MYAPP_UPLOAD_KEY_PASSWORD=[密钥密码]
```

**安全建议**：如果担心密码泄露，可以将这些配置添加到 `~/.gradle/gradle.properties`（用户级别）。

##### 修改 build.gradle

打开 `android/app/build.gradle`，在 `signingConfigs` 中添加 `release` 配置：

```json
android {
  signingConfigs {
    release {
      if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
      }
    }
  }
}
```

##### 生成 APK

```shell
cd android
./gradlew assembleRelease
```

APK 文件位置：`android/app/build/outputs/apk/release/app-release.apk`。

### 常见问题

#### React Native 的优势与局限

**React Native 优势**：

- **跨平台复用**：通常 70-90% 代码可共享。
- **开发效率高**：热重载 + 声明式 UI。
- **丰富生态**：大量第三方库（React Navigation、Reanimated）。
- **原生扩展**：可编写原生模块访问平台特有功能。

**React Native 局限**：

- **性能瓶颈**：Bridge 序列化开销（动画、大数据传输）。
- **原生依赖**：复杂功能仍需原生代码。
- **调试困难**：跨层问题（JS ↔ 原生）排查复杂。
- **更新延迟**：新 iOS/Android 特性需要时间适配。

#### React Native 与 uni-app 对比

**React Native 追求"像原生"，核心是性能和生态；uni-app 追求"广覆盖"，核心是一套代码搞定所有平台（尤其是小程序）。**

| 维度           | **React Native**                           | **uni-app**                                          |
| :------------- | :----------------------------------------- | :--------------------------------------------------- |
| **开发语言**   | 基于 **React** 框架                        | 基于 **Vue.js** 框架                                 |
| **核心优势**   | **性能接近原生**                           | **平台覆盖广**                                       |
| **渲染机制**   | 原生UI组件（iOS/Android）                  | `.nvue` 优先**原生渲染**，`。vue`优先 WebView 渲染   |
| **主要平台**   | iOS、Android、Web                          | **iOS、Android、Web、及各家小程序**（微信/支付宝等） |
| **生态与社区** | **全球生态**极丰富（npm），第三方库海量    | **国内生态**强，官方插件市场丰富，尤其针对小程序     |
| **典型应用**   | Facebook、Instagram、沃尔玛等大型跨平台App | 大量国内电商、生活服务类App及小程序                  |

### 参考资料

[Expo中文网](https://expo.nodejs.cn/)

[React Native 中文网](https://reactnative.cn/)