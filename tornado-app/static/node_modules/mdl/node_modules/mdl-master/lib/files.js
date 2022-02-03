YUI.add('files', function(Y) {

/**
* Ported fileutils methods from [Selleck](http://github.com/rgrove/selleck)
* @class Files
* @module mdl
*/

Y.Files = {};

/*
Selleck
Copyright (c) 2011 Yahoo! Inc.
Licensed under the BSD License.
*/

var fs = require('graceful-fs');
    fsPath   = require('path'),
    useFS = (fs.exists) ? fs : fsPath;

var exists = function(file, cb) {
    if (cb) {
        useFS.exists(file, cb);
    } else {
        return useFS.existsSync(file);
    }
};

Y.Files.exists = exists;

/**
* Helper method for getting JSON data from a local file
* @method getJSON
* @param {Path} filename The filename to parse JSON from
* @return {Object} The JSON data
*/
Y.Files.getJSON = function(filename) {
    var data = {};
    if (exists(filename)) {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    return data;
};

});
