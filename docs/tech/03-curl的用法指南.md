## curl的用法指南

`curl` 是一个开源的用于数据传输的命令行工具与库，它使用 `URL` 语法格式，支持众多传输协议，包括：HTTP、HTTPS、FTP、FTPS、GOPHER、TFTP、SCP、SFTP、SMB、TELNET、DICT、LDAP、LDAPS、FILE、IMAP、SMTP、POP3、RTSP和RTMP。`curl` 库提供了很多强大的功能，你可以利用它来进行 HTTP/HTTPS 请求、上传/下载文件等，且支持 Cookie、认证、代理、限速等。

### curl使用实例

* **url访问**：直接加上要访问的网址。curl 默认发出 GET 请求，服务器返回的内容会在命令行输出。

  ```shell
  curl https://www.example.com
  ```

* **重定向跟踪：**页面使用了`301|303` 等重定向，可以添加 `-L` 参数来跟踪 URL 重定向。

  ```shell
  curl -L https://www.example.com
  ```

* **页面保存：**将页面源码保存到本地。 `-o/--output` 必须输入保存文件名，`-O/--remote-name` 保留远程文件的文件名。

  ```shell
  curl https://www.example.com >> example.html
  curl -o example.html https://www.example.com
  curl -O https://www.example.com/index.html
  ```

* **查看头信息**：使用 `-i`参数，页面响应头会和页面源码（响应体）一块返回；使用`-I`或`--head`参数，只返回向应头。

  ```shell
  curl -i https://www.example.com
  ```

  ```shell
  curl -I https://www.example.com
  curl --head https://www.example.com
  ```

* **HTTP请求方法**：curl 支持所有 HTTP 请求方法，默认使用  `get` 请求，可以通过 -X 参数指定。

  ```shell
  # 获取ip地址
  curl http://ip-api.com/json
  curl -X DELETE https://www.example.com/api/delete/xxx
  curl -X POST --data 'keyword=example' https://www.example.com/api/[delete_api]
  ```

* **HTTPS支持**：curl 可以直接访问 HTTPS 协议。如果使用的本地 `ssl证书` 认证的 HTTPS，可以通过`-E`或`--cert`参数指定本地证书。

  ```shell
  curl -E my_cert.pem https://www.example.com
  ```

* **添加请求头**：通过 `-H` 或 `--header` 参数来指定请求头。多次使用 `-H` 或 `--header` 参数可指定多个请求头。

  ```shell
  $ curl -H 'Content-Type:application/json' -H 'Authorization: ndhielsi.ighhgeuwj' https://www.example.com
  ```

* **Cookie支持**：通过 `--cookie` 参数指定发送请求时的 Cookie 值，也可以通过 `-b [文件名]` 来指定一个存储了 Cookie 值的本地文件。

  ```shell
  curl --cookie 'token=1234' https://www.example.com
  curl -b my_cookies.txt https://www.example.com
  ```

  Cookie 值可能会被服务器所返回的值所修改，并应用于下次 HTTP 请求。这时，可以能过 `-c` 参数指定存储服务器返回 Cookie 值的存储文件。

  ```shell
  curl -b my_cookies.txt -c newcookies.txt https://www.example.com
  ```

* **文件上传**：使用 `-T` 或 `--upload-file` 上传文件。

  ```shell
  curl -T ./index.html https://www.example.com/api/[upload_api]
  ```

* **伪造来源地址**：修改请求 Header 中的 referer 信息。

  ```shell
  curl -e http://localhost https://www.example.com
  ```

* **请求代理**：指定 HTTP 请求的代理。

  ```shell
  curl -x 123.45.67.89:1080 https://www.example.com
  ```

* **循环下载**：

  ```shell
  curl -O http://mydomain.net/~zzh/screen[1-10].JPG
  curl -O http://mydomain.net/~{zzh,nick}/[001-201].JPG
  curl -o #2_#1.jpg http://mydomain.net/~{zzh,nick}/[001-201].JPG
  ```

* **分块下载**：

  ```shell
  curl -r  0 -10240  -o "zhao.part1"  https://www.example.com/media/zhao1.mp3 &\
  curl -r 10241 -20480  -o "zhao.part1"  https://www.example.com/media/zhao1.mp3 &\
  curl -r 20481 -40960  -o "zhao.part1"  https://www.example.com/media/zhao1.mp3 &\
  curl -r 40961 - -o  "zhao.part1"  https://www.example.com/media/zhao1.mp3
  ```

* **限制网速**：限制 HTTP 请求和回应的带宽，模拟慢网速的环境。

  ```shell
  curl --limit-rate 200k https://www.example.com
  ```

### curl语法及选项

#### 语法

```shell
curl [options...] <url>
```

#### 参数选项

```bash
# 调试类
-v, --verbose URL                      输出请求中访问的路由信息
-q, --disable                          在第一个参数位置设置后 .curlrc 的设置直接失效，这个参数会影响到 -K, --config -A, --user-agent -e, --referer
-K, --config FILE                      指定配置文件
-L, --location                         跟踪重定向 (H)

# CLI显示设置
-s, --silent                           Silent模式。不输出任务内容
-S, --show-error                       显示错误. 在选项 -s 中，当 curl 出现错误时将显示
-f, --fail                             不显示连接失败时HTTP错误信息
-i, --include                          显示response的header (H/F)
-I, --head                             仅显示响应文档头
-l, --list-only                        只列出FTP目录的名称 (F)
-#, --progress-bar                     以进度条 显示传输进度

# 数据传输类
-X, --request [GET|POST|PUT|DELETE|…]  使用指定的 http method 例如 -X POST
-H, --header <header>                  设定 request里的header 例如 -H "Content-Type: application/json"
-e, --referer                          设定 referer (H)
-d, --data <data>                      设定 http body 默认使用 content-type application/x-www-form-urlencoded (H)
    --data-raw <data>                  ASCII 编码 HTTP POST 数据 (H)
    --data-binary <data>               binary 编码 HTTP POST 数据 (H)
    --data-urlencode <data>            url 编码 HTTP POST 数据 (H)
-G, --get                              使用 HTTP GET 方法发送 -d 数据 (H)
-F, --form <name=string>               模拟 HTTP 表单数据提交 multipart POST (H)
    --form-string <name=string>        模拟 HTTP 表单数据提交 (H)
-u, --user <user:password>             服务器帐户，密码 例如 admin:password
-b, --cookie <data>                    cookie 文件 (H)
-j, --junk-session-cookies             读取文件中但忽略 session cookie (H)
-A, --user-agent                       user-agent设置 (H)

# 传输设置
-C, --continue-at OFFSET               断点续转
-x, --proxy [PROTOCOL://]HOST[:PORT]   在指定的端口上使用代理
-U, --proxy-user USER[:PASSWORD]       代理用户名及密码

# 文件操作
-T, --upload-file <file>               上传文件
-a, --append                           添加要上传的文件 (F/SFTP)

# 输出设置
-o, --output <file>                    将输出写入文件，而非 stdout
-O, --remote-name                      将输出写入远程文件
-D, --dump-header <file>               将头信息写入指定的文件
-c, --cookie-jar <file>                操作结束后，要写入 Cookies 的文件位置
```

