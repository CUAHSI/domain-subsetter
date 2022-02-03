var path = require('path'),
    metaPath = path.join(__dirname, '../', 'package.json'),

    YUI_config = {
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
            mdl: {
                fullpath: path.join(__dirname, 'mdl.js')
            },
            all: {
                requires: [
                    'help',
                    'files',
                    'options',
                    'project',
                    'mdl'
                ]
            }
        },
        logExclude: {
            loader: true,
            yui: true,
            get: true,
            attribute: true,
            handlebars: true
        },
        useSync: true
    },
    YUI = require('yui').YUI;

var Y = YUI(YUI_config).use('all');
Y.packageInfo = Y.Files.getJSON(metaPath);
module.exports = Y;
