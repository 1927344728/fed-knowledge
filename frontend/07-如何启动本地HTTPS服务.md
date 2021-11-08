## 如何启动本地HTTPS服务

一般，我们启动本地服务是通过 `http://localhost` 来访问的，这在目前普通使用 HTTPS 协议的情况下，可能会遇到一些问题。比如：无法访问 HTTPS 保护服务器、IOS 设备中，http 访问 https 接口，限制了 Cookie 发送 。

以下讲解两种本地环境配置 HTTPS 的方法。

### 从openssl开始配置

#### 生成根证书

创建根安全套接字层（SSL）证书。然后，可以使用此根证书对可能为各个域生成的任意数量的证书进行签名。

* **生成 RSA-2048 密钥**并将其保存到文件 `rootCA.key`。

  此文件将用作生成根 SSL 证书的密钥。系统将提示您输入密码，每次使用此特定密钥生成证书时都需要输入密码。

  ```shell
  openssl genrsa -des3 -out rootCA.key 2048
  ```

* **使用生成的密钥创建新的 Root SSL 证书，**并保存到文件 `rootCA.pem` 。

  该证书的有效期为 1,024 天。随意将其更改为您想要的任意天数。系统还会提示您输入密码及其他可选信息。

  ```shell
  openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
  ```

  ```shell
  Country Name (2 letter code) []:IN
  State or Province Name (full name) []:Random
  Locality Name (eg, city) []:Random
  Organization Name (eg, company) []:Random
  Organizational Unit Name (eg, section) []:Random
  Common Name (eg, fully qualified host name) []:Local Certificate
  Email Address []:example@domain.com
  ```

#### MAC信任证书

先让 Mac 信任根证书，再为本地开发环境颁发证书。

* **让 Mac 信任根证书**，以便它所发布的所有单个证书也是可信的。

  Mac 导入证书：`启动台 -> 搜索输入“钥匙串” -> 单击`，然后，在钥匙串访问窗口，`文件 -> 导入项目` 导入生成的 `.pem` 文件。双击导入的证书，并在 『信任』部分中将 『使用此证书时：』下拉列表更改为 『始终信任』 。 

  ![image-20211105200318360](https://tva1.sinaimg.cn/large/008i3skNgy1gw4j0elddej31860u0ae8.jpg)

#### 生成本地证书

* 新创建一个  `server.csr.cnf` 文件，用于存储 OpenSSL 配置。把以下内容粘贴进去，以便在创建证书时导入这些设置，**注意不是在命令行中输入它们**。

  ```shell
  [req]
  default_bits = 2048
  prompt = no
  default_md = sha256
  distinguished_name = dn
  
  [dn]
  C=US
  ST=RandomState
  L=RandomCity
  O=RandomOrganization
  OU=RandomOrganizationUnit
  emailAddress=hello@example.com
  CN = localhost
  ```

* 新创建一个 `v3.ext` 文件，复制以下内容粘贴进入，用以创建 X509 v3 证书。请注意在 `subjectAltName` 这里指定的方式。

  ```shell
  authorityKeyIdentifier=keyid,issuer
  basicConstraints=CA:FALSE
  keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
  subjectAltName = @alt_names
  
  [alt_names]
  DNS.1 = localhost
  ```

* 根据 `server.csr.cnf` 文件中 openssl 的配置，生成 `server.key` 和 `server.csr` 文件。其中 `server.key` 用以存储密钥。

  ```shell
  openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <(cat server.csr.cnf)
  ```

* 证书签名请求是通过我们之前创建的根 SSL 证书发出的，用于创建域证书 localhost。输出是一个名为 `server.crt` 的证书文件。

  ```shell
  openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
  ```

目前新创建建的文件有：

* rootCA.key
* rootCA.pem
* server.csr.cnf
* v3.ext
* server.csr
* **server.key**
* rootCA.srl
* **server.crt**

其中，最终 HTTPS 需要使用的证书是 `server.key` 、`server.crt`。

#### 使用证书

 `server.key` 、`server.crt` 文件移动到服务器上的可访问位置，并在启动服务器时包含它们。 

**Node 中的使用：**

```shell
const fs = require("fs")
const express = require("express")
const https = require("https")
const app = express()
const server = https.createServer({
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}, app).listen(9601, () => {
  console.log('本地安全链接：https://localhost:9601')
})
```

**DevServer 中的使用：**

```shell
devServer: {
  https: true,
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}
```

> 注：该方法来源由网上，我对 openssl 指令也不熟悉。
>
> 实际执行后，可以用 `https://localhost:9601` 访问，但无法用 `https://0.0.0.0:9601` 或者本地 IP 访问，Chrome 中报错：`net::ERR_CERT_INVALID`。



### mkcert快速配置

上述方法，是自己生成签名证书，然后在 http server 中使用。由于自签证书浏览器不信任，为了解决浏览器信任问题，需要将证书添加到系统或浏览器的可信任中。

mkcert 是一个使用 go 语言编写的生成本地自签证书的小程序，具有跨平台，使用简单，支持多域名，自动信任CA等一系列方便的特性可供本地开发时快速创建 https 环境使用。

#### 安装

下载地址: [https://github.com/FiloSottile/mkcert/releases/latest](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FFiloSottile%2Fmkcert%2Freleases%2Flatest)

或者 Homebrew 直接安装：

```shell
brew install mkcert
mkcert --version
```

#### 使用命令

mkcert 规避了繁杂的 openssl 命令，几个简单的参数就可以生成一个本地可信的 https 证书了。更详细的用法查看[官方文档](https://github.com/FiloSottile/mkcert#mkcert)。

```shell
# 仅仅这么一条简单的命令，就帮助我们将mkcert使用的根证书加入了本地可信CA中，以后由该CA签发的证书在本地都是可信的。
mkcert -install
```

```shell
# 生成自签证书
mkcert localhost 127.0.0.1 ::1
```

#### 使用证书

**Node 中的使用：**

```shell
const fs = require("fs")
const express = require("express")
const https = require("https")
const app = express()
const server = https.createServer({
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem')
}, app).listen(9601, () => {
  console.log('本地安全链接：https://localhost:9601')
})
```

**DevServer 中的使用：**

```shell
devServer: {
  https: true,
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem')
}
```