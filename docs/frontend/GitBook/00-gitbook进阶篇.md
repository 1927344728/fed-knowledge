## Gitbook进阶篇

### 集成 github 网站

为什么选择集成到github?

- **使用零成本:** github pages 集成在 github 中, 直接和代码管理绑定在一起, 随着代码更新自动重新部署, 使用非常方便.
- **免费:** 免费提供 [http://username.github.io](https://link.zhihu.com/?target=http%3A//username.github.io) 的域名, 免费的静态网站服务器.

- **无数量限制:** github pages 没有使用的数量限制, 每一个 github repository 都可以部署为一个静态网站.



#### 什么是 GitHub Pages ?

`Github Pages` 是 `github` 网站推出的一种**免费**的静态网页托管服务，适合搭建静态的项目主页或个人官网。

其中，网站项目的源码直接托管在 `github` 仓库中，当仓库文件更新后，该仓库所关联的网站自动更新，从而实现了源码与官网的联动更新。

每个账号**有且只有一个**主页站点，但允许**无限制**多的项目站点。

##### 主页站点：`https://<username>.github.io/`

##### 项目站点：`https://<username>.github.io/repository/ `



#### 如何集成 gitbook ?

我们已经知道 `Github Pages` 是提供静态网站的免费托管，而 `gitbook` 默认生成的内容就是静态网站。`gitbook` 默认输出目录 `_book/` 包括了静态网站所需的全部资源，其中就包括 `index.html` 首页文件。我们需要做的就是，这_book下的所有文件复制一份到根目录或`./docs`（取决于你github中的设置）。以为复制到./docs为例：

* 每次生成后将 `_book/` 整个目录复制到项目根目录或者定的docs

  ```shell
  gitbook build
  cp -r _book/* .
  ```

* gitbook build，可以指定输入文件

  ```shell
  gitbook build ./ ./docs
  ```

* book.json中设置output参数。（无效，不知道是什么原因。如果你知道，欢迎在下方给我留言）

  ```json
  # book.json
  {
  	"output": "./docs"
  }
  ```

  

### Openwrite

OpenWrite（官网：https://www.openwrite.cn）一文多发平台。只需要你使用 markdown 完成内容写作，通过文章扩散工具，就能轻松将文章内容到科技人汇聚的内容平台。从而让各个平台的读者都能看到你的内容，从而了解你，并提升你的综合影响力！

#### 一文多发

`OpenWrite` 提供的众多功能中最吸引我的地方莫过于**一文多发**功能了：我在用的平台它都有，我没用的平台它也有！

![image-20200501205202688](https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md/images/gitbook/image-20200501205202688.png)

平台整体上使用体验非常不错，大致步骤是先提前登陆各大目标平台，然后通过 `OpenWrite` 提供的插件自动进行渠道认证，配置各大渠道后就可以愉快发文啦！

#### 公众号引流

如果你有自己**独立博客**，也在运营者**微信公众号**，但是苦于没有很好的手段**引导读者关注公众号**，那么`Openwrite` 推出的 `ReadMore` 工具绝对可以**解决燃眉之**急。

* **静态博客**网站集成 `ReadMore` 工具后，全站博客文章内容自动**隐藏一半**，同时浮现出**阅读全文**的按钮引导读者点击解锁。
* 一旦读者想要**阅读全文**就会主动**点击按钮**，此时就会自动弹出**引导用户关注公众号**的弹窗。
* 接下来读者应该是关注公众号**回复关键字**获取验证码进而解锁文章。
* 读者**关注公众号**后，**发送关键字**获取文字链接并**点击该链接**，此时就会**获取验证码**,离成功只差一步!
* 再次回到博客平台的**受限文章**，**输入刚刚获取到的验证码**，不仅解锁了**当前文章**，博客内的其他文章也**全部自动解锁**，并不会造成不好体验,完美！

#### gitbook集成openwrite

* 安装 `openwrite` 插件。即在 `book.json` 配置，然然`gitbook install`

  ```json
  {
      "plugins" : ["openwrite"],
      "pluginsConfig":{
          "openwrite":{
              "blogId": "",
              "name": "",
              "qrcode": "",
              "keyword": ""
          }
      }
  }
  ```




### 参数链接

[雪之梦技术驿站](https://snowdreams1006.tech/markdown/)


