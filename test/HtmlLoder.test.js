const path = require('path');
const HTMLLoader = require('../');

const loader = new HTMLLoader({
    filePath: path.resolve(__dirname, 'a.html'),
    plugins: [[__dirname + '/fakePlugin', { a: 1 }]]
});

loader.on('finish', function(data) {
    debugger;
});
