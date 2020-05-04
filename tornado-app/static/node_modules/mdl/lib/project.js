YUI.add('project', function(Y) {
    var NS = Y.namespace('Project'),
        fs = require('fs'),
        path = require('path'),
        CWD = process.cwd();

    NS.init = function(inputoptions) {
        var project = {},
            options = null,

            // Use the CLI arguments if no others were given.
            args = inputoptions || Y.Array(process.argv, 2);

        // Process the arguments now.
        options = Y.Options(args);

        if (options.configfile) {
            // We were given a config file - parse it and use it's options.
            project = Y.Files.getJSON(options.configfile);
        } else {
            // Try and find a config file in our working tree.
            //Y.log('Scanning for .mdl.json file.', 'info', 'mdl');
            //project = Y.getProjectData();
            if (!project) {
                project = {};
            }
        }

        if (options.branch === null) {
            // No branch was forcibly set - try to work out the branch now.
            options.branch = this.getVersion();
        }

        if (project.options && Object.keys(project.options).length) {
            options = Y.merge(project.options, options);
            delete project.options;
            options.project = project;
        }

        return options;
    };

    NS.getVersion = function() {
        rootdirectory = this.getRootDirectory();
        if (!this.isValid()) {
            // This doesn't seem to be Moodle.
            Y.log('This does not appear to be a valid Moodle directory', 'error', 'mdl');
            process.exit(255);
        }

        moodleversionfile = fs.readFileSync(path.join(rootdirectory, '/version.php'), 'utf8');
        versionstring = moodleversionfile.match(/release *= *'([^ a-zA-Z]*)/);
        if (versionstring && versionstring[1]) {
            if (versionstring[1].match(/dev$/)) {
                return 'master';
            }
            return versionstring[1];
        }

        return false;
    };

    NS.isValid = function() {
        // Try and find a valid lib/moodlelib.php
        var rootdirectory = this.getRootDirectory();
        if (typeof rootdirectory === "undefined") {
            return false;
        }
        try {
            fs.statSync(path.join(rootdirectory, 'lib', 'moodlelib.php'));
            return true;
        } catch (e){}
        return false;
    };

    NS.getRootDirectory = function() {
        // Try and find a valid copy of mdeploy.php.
        // This is a fairly moodle specific file.
        var rootdirectory;
        this.find(CWD, 'mdeploy.php', function(err, file) {
            if (file) {
                rootdirectory = path.resolve(path.dirname(file));
                return true;
            }
        });
        return rootdirectory;
    };
    NS.find = function(dir, file, cb) {
        var files, found,
        next = path.join(dir, '../');

        try {
            files = fs.readdirSync(dir);
        } catch (e) {
            files = [];
        }

        found = files.some(function(f) {
            if (f === file) {
                cb(null, path.join(dir, f));
                return true;
            }
        });

        if (!found) {
            if (dir === next) {
                cb('not found', null);
                return;
            }
            this.find(next, file, cb);
        }
    };
});
