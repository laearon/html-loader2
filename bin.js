#! /usr/bin/env node

const _ = require('lodash');
const subarg = require('subarg');
const HtmlLoader = require('./index');

const argv = subarg(process.argv.slice(2));

var plugins = [];
if (!_.isArray(argv.plugin)) argv.plugin = [argv.plugin];
argv.plugin.forEach(_pgn => {
    var pngName = _pgn._[0];
    if (!pngName) throw new Error('Invalid argv input');
    delete _pgn._;
    _.keys(_pgn).forEach(key => {
        var value = _pgn[key];
        switch (value) {
            case 'true':
                _pgn[key] = true;
                break;
            case 'false':
                _pgn[key] = false;
                break;
            default:
        }
    });
    plugins.push([pngName, _pgn]);
});

var options = {};

_.keys(argv).forEach(key => {
    var value = argv[key];
    if (typeof value == 'object') return;
    options[key] = value;
});

options.plugins = plugins;

new HtmlLoader(options).pipe(process.stdout);
