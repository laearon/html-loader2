const path = require('path');
const HTMLLoader = require('../');
const HtmlBase64Plugin = require('../buildinPlugins').HtmlBase64Plugin;

const loader = new HTMLLoader({
    basePath: path.resolve(__dirname),
    filePath: path.resolve(__dirname, 'a.html'),
    plugins: [[HtmlBase64Plugin, { size: 0 }]]
});

loader.on('finish', function(data) {
    console.log(data);
});
