const { Transform } = require('stream');

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
        this._data = '<!-- HtmlLoader bundled -->\n' + this._data;
        this.push(this._data);
        callback();
    }
}

module.exports = HtmlBase64Plugin;
