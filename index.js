const path = require('path');
const { EventEmitter } = require('events');
const { Transform } = require('stream');
const fs = require('fs');
const _ = require('lodash');
const pump = require('pump');

const log = console.log.bind(console);

class HTMLLoader extends EventEmitter {
    constructor(opts) {
        /**
         * opts {
         *  filePath: String,
         *  basePath: String,
         *  plugins: [['Url-loader', options]]
         * }
         */
        super();
        var plugins = [],
            currentPlugin;
        if (!_.isPlainObject(opts) || !opts.filePath)
            throw new Error(
                'constructor must has argument { filePath: String }'
            );
        if (_.isArray(opts.plugins)) {
            for (var i = 0; i < opts.plugins.length; i++) {
                currentPlugin = opts.plugins[i];
                if (!_.isArray(currentPlugin)) {
                    currentPlugin = [currentPlugin];
                }
                var pluginName = currentPlugin[0];
                var pluginOpts = currentPlugin[1];
                if (!pluginName)
                    throw new Error(`plugin[${i}] doesn't have name property`);
                if (_.isString(pluginName)) {
                    pluginName = require(pluginName);
                }
                if (!_.isFunction(pluginName))
                    throw new Error(`plugin[${i}] is invalid`);
                if (!_.isPlainObject(pluginOpts)) pluginOpts = {};
                currentPlugin = [pluginName, pluginOpts];
                plugins.push(currentPlugin);
            }
        }
        delete opts.plugins;
        this._opts = opts;
        plugins.unshift([UniversalInterfaceStream, {}]);
        plugins = plugins.map(plugin => {
            return new plugin[0](_.assign({}, opts, plugin[1]));
        });
        this._plugins = plugins;
        this.pipeline = this.createPipeline(
            fs.createReadStream(opts.filePath),
            ...plugins,
            err => {
                if (err) {
                    this.emit('error', err);
                    throw err;
                }
                this.emit('finish', this.pipeline._data);
            }
        );
    }

    createPipeline(...streams) {
        return pump(...streams);
    }

    pipe(stream) {
        return this.pipeline.pipe(stream);
    }
}

class UniversalInterfaceStream extends Transform {
    constructor(opts) {
        super();
        this._data = '';
    }
    _transform(chunk, enc, callback) {
        this._data += chunk;
        callback();
    }
    _flush(callback) {
        this.push(this._data);
        callback();
    }
}

HTMLLoader.UniversalInterfaceStream = UniversalInterfaceStream;

module.exports = HTMLLoader;
