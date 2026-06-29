# 技术驿站 • LIZHAO
GitBook 的 npm 包已经不再更新，官方推荐使用 @honkit/honkit 作为替代。

图片资源路径：https://my-files-1259410276.cos.ap-chengdu.myqcloud.com/md_images

### 其他方案：
* Docsify：轻量级，适合简单文档。
* VuePress：基于 Vue，适合技术文档。
* Docusaurus：由 Facebook 维护，适合开源项目文档。

### 常见问题
#### search index is too big, indexing is now disabled
**原因**：索引过大问题 ：需要调整搜索索引的配置  
**解决**：修改 book.json 文件，添加如下配置：
```json
{
    "plugins": ["-lunr", "-search", "search-pro"],
    "pluginsConfig": {
        "search-pro": {
            "maxSearchIndexSize": 10000000
        }
    }
}
```