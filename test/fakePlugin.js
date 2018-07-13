const { Transform } = require('stream');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const base64 = require('base64-js');

class HtmlBase64Plugin extends Transform {
    constructor(opts) {
        super();
        this._opts = opts;
        this._data = '';
    }
    _transform(chunk, enc, callback) {
        this._data += chunk;
        callback();
    }
    _flush(callback) {
        this._data = imgtag2base64(
            this._data,
            this._opts.filePath,
            this._opts.basePath,
            this._opts.size
        );
        this.push(this._data);
        callback();
    }
}

function imgtag2base64(html, filePath, basePath, size) {
    var reg = /(<img[^<>]*?\s+src=["'])([^'"<>+]+?)(['"][^<>]*?>)/gi;
    basePath = basePath || filePath;
    return html.replace(reg, function($0, $1, $2, $3) {
        try {
            debugger;
            var src = $2;
            var dirname = path.dirname(filePath);
            var destFile;
            if (src[0] === '/') {
                destFile = path.resolve(basePath, '.' + src);
            } else {
                destFile = path.resolve(dirname, src);
            }
            var extname = path.extname(destFile);
            var fileData = fs.readFileSync(destFile);
            if (typeof size === 'number' && fileData.byteLength > size * 1000)
                throw new Error('file size exceeds max size allowed');
            var base64Str = base64.fromByteArray(fileData);
            var mimeInfo = mime.getType(extname);
            if (!mimeInfo) throw new Error('Unknown mimeType');
            base64Str = 'data:' + mimeInfo + ';base64,' + base64Str;
            return $1 + base64Str + $3;
        } catch (err) {
            return $0;
        }
    });
}

module.exports = HtmlBase64Plugin;
