var path = require('path'),
    metaPath = path.join(__dirname, '../', 'package.json'),

    YUI_config = {
        //debug: false,
        modules: {
            help: {
                fullpath: path.join(__dirname, 'help.js')
            },
            files: {
                fullpath: path.join(__dirname, 'files.js')
            },
            options: {
                fullpath: path.join(__dirname, 'options.js')
            },
            project: {
                fullpath: path.join(__dirname, 'project.js')
            },
            utils: {
                fullpath: path.join(__dirname, 'utils.js')
            },
            mdl: {
                fullpath: path.join(__dirname, 'mdl.js')
            },
            all: {
                requires: [
                    'help',
                    'files',
                    'options',
                    'project',
                    'utils',
                    'mdl'
                ]
            }
        },
        filter: 'raw',
        logExclude: {
            attribute: true
        },
        logThreshold: 'info',
        useSync: true
    },
    YUI = require('yui').YUI;

var Y = YUI(YUI_config).use('all');
Y.packageInfo = Y.Files.getJSON(metaPath);
module.exports = Y;
