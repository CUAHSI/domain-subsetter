var fs = require("fs"),
    path = require('path'),
    spawn = require('child_process').spawn;

YUI.add('mdl', function(Y) {
    Y.namespace('MDL');
    Y.MDL.run = function(options) {
        var childtask;

        this.starttime = new Date().getTime();

        if (options.help) {
            Y.help.show();
        }

        // Time to run this stuff.
        if (options.shifter) {
            Y.applyConfig({
                modules: {
                    childtask: {
                        fullpath: __dirname + '/tasks/shifter.js'
                    }
                }
            });
            Y.use('childtask', function(Y) {
                childtask = Y.Childtask.run(options.args);
            });
            return childtask;
        }

        this.endtime = new Date().getTime();
    };
    Y.MDL.findDependent = function(name) {
        var returnvalue = false;
        console.log(name);
        process.mainModule.paths.some(function(p) {
            var subpath = path.resolve(p, name);
            if (Y.Files.exists(subpath)) {
                returnvalue = subpath;
                return true;
            }
        });
        return returnvalue;
    };
    Y.MDL.runChild = function(childName, childBinaryPath, childOptions) {
        var childPath = Y.MDL.findDependent(childName),
            childMetaPath,
            childMeta,
            childBinary;

        childMetaPath = path.resolve(childPath, 'package.json');
        childMeta = Y.Files.getJSON(childMetaPath);

        Y.log('Running ' + childName + '@' + childMeta.version +
                ' with arguments: ' + childOptions.join(' '), 'info', Y.packageInfo.name);

        // We run everything against node.
        // Add the path to shifter to the start of the arguments.
        childBinary = path.resolve(childPath, childBinaryPath);
        childOptions.unshift(childBinary);

        return this.spawnChild(process.execPath, childOptions);
    };
    Y.MDL.spawnChild = function(path, args) {
        var child;
        // Run Shifter with our arguments:
        child = spawn(process.execPath, args, {
            cwd: process.cwd(),
            stdio: [process.stdin, process.stdout, process.stderr]
        });

        child.on('exit', function(code) {
            Y.log("Completed shifter run with exit code " + code);
        });
        return child;
    };
});
