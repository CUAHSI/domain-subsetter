#!/usr/bin/env node

var cssproc = require('../../lib'),
    path = require('path'),
    fs = require('fs');

var file = path.join(__dirname, 'a1/f1/f2/test.css');

fs.readFile(file, 'utf8', function(err, data) {
    cssproc.parse({
        root: __dirname,
        path: file,
        base: 'http://yui.yahooapis.com/gallery-123456/'
    }, data, function(err, str) {
        console.log(str);
    });
});
