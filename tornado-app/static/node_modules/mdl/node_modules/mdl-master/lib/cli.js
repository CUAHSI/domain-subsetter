#!/usr/bin/env node

var Y = require('./init'),
    path = require('path');

Y.log('MDL Sub - ' + Y.packageInfo.name + '@' + Y.packageInfo.version, 'info', Y.packageInfo.name);
options = Y.Project.init();
new Y.MDL.run(options);
