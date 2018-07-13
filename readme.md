# html-loader2

html-loader 是一个基于流处理 html 文件的工具。都到了8102年，我居然还是写出了这个。。。

## html-loader 设计哲学

如 browserify 等打包工具都是将 js 作为一等公民很少有打包工具将 html 作为一等公民构建项目。html-loader 自身只提供将 img 标签的 src 自动转 base64，但是 html-loader 提供统一的 api 方便插件的编写。

## html-loader options

--filePath 文件路径 必选
--basePath 打包相对的根路径（与服务器静态资源跟路径相同）可选
--plugin 插件 可选

> 在 bash 中使用

```bash
html-loader2 --filePath html-loader2/test/a.html --basePath=html-loader2/test --plugin [html-loader2/builtin/HtmlBase64Plugin --size=1000]
```

> 在 node 中使用

```javascript
var HtmlLoader = require('html-loader2');
var HtmlBase64Plugin = require('html-loader2/builtin/HtmlBase64Plugin');
var loader = new HtmlLoader({
    filePath,
    basePath,
    plugin: [[HtmlBase64Plugin, { size: 1000 }]]
});
loader
    .on('finish', function(data) {
        console.log(data);
    })
    .on('error', function(err) {
        throw err;
    });
```

## html-loader 插件编写

```javascript
class Plugin extends Transform {
    constructor(opts) {
        /**
         * opts {
         *  filePath,
         *  basePath,
         *  YourPluginOptions,
         * }
         */
        super();
        this._data = '';
    }
    _transform(chunk, enc, callback) {
        this._data += chunk;
        callback();
    }
    _flush(callback) {
        // this._data = transform(this._data);
        this.push(this._data);
        callback();
    }
}

module.exports = Plugin;
```
