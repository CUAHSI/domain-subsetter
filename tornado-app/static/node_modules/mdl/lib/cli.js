#!/usr/bin/env node

var Y = require('./init');

Y.log('Starting the MDL Suite@' + Y.packageInfo.version +
        ' using YUI@' + Y.version +
        ' with NodeJS@' + process.versions.node,
        'info', 'mdl');

options = Y.Project.init();

(new Y.MDL(options)).run();
