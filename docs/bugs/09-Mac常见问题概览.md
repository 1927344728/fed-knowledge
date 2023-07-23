## Mac常见问题概览

#### homebrew

安装： `/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"`

相关链接：[最全的Homebrew安装方法](https://cloud.tencent.com/developer/article/1759415)

#### 清理缓存

```shell
~/Library/Caches/
~/Library/Containers/
```

#### 代理冲突

webpack 配置如下：

```javascript
// webpack.config.js
module.exports = {
  devServer: {
		host: 'a.lizhao.com'
  }
}
```

Mac 下，在使用 ClashX 或 shadowSock 等代理后，打开 a.lizhao.com 访问页面，报错 502。

解决：在 网络 -> 高级 -> 代理 -> 【忽略这些主机或域的代理设备】中，添加 'a.lizhao.com'。