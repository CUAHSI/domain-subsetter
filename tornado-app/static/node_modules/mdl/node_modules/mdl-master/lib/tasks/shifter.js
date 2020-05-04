YUI.add('childtask', function(Y) {
    var path = require('path'),
        shifter;

    Y.namespace('Childtask');
    Y.Childtask.run = function (options) {
            // Local options are the options that we calculate based upon
            // the options and other factors.
        var localOptions,

            // childOptions are the options that we pass to the child we
            // spawn. They are made up of the localOptions converted to
            // appropriate CLI params.
            childOptions = Y.Array(options),
            key,
            cwd = process.cwd(),

            // The detected path to the shifter module.
            shifterPath,

            // The path containing the shifter metadata
            shiftermetaPath,

            // The shifter meta object.
            shiftermeta

;

        localOptions = {
            // By default in Moodle we want to try and walk the repository.
            walk:           true,

            // We also tend to run recursively.
            recursive:      true,

            // Use our .jshintrc.
            lint:           'config',

            // Warn with full detail for lint.
            'lint-stderr':  false,

            // We want to always clean the build directory.
            clean:          true
        };

        if ((path.basename(cwd) === 'src') || path.basename(path.dirname(cwd)) === 'src') {
            // If we're in either a src directory or a module directory, we
            // shouldn't run recursively.
            localOptions.recursive = false;

            if ((path.basename(cwd) === 'src')) {
                // Only walk if we're in the src director
                localOptions.walk = true;
            } else {
                localOptions.walk = false;
            }
        }

        // Check the childOptions for things which may require us to make
        // changes to our default options.
        for (key in childOptions) {
            switch(childOptions[key]) {
                case '--watch':
                    localOptions.watch = true;
                    break;
                case '--lint':
                    delete localOptions.lint;
                    break;
                case '-v':
                case '--verbose':
                    // Override the -v option to shifter to give verbosity
                    localOptions['lint-stderr'] = true;
                    delete childOptions[key];
                    break;
            }
        }

        // When watching we cannot run recursively as the watch will pick
        // up the built changes and trigger further builds.
        if (localOptions.watch) {
            localOptions.recursive = false;
        }

        // Convert our local options to CLI arguments.
        for (key in localOptions) {
            switch (key) {
                case 'walk':
                    if (childOptions.indexOf('--walk') === -1 &&
                            childOptions.indexOf('--no-walk') === -1) {
                        if (localOptions[key]) {
                            childOptions.unshift('--walk');
                        } else {
                            childOptions.unshift('--no-walk');
                        }
                    }
                    break;
                case 'recursive':
                    if (childOptions.indexOf('--recursive') === -1 &&
                            childOptions.indexOf('--no-recursive') === -1) {
                        if (localOptions[key]) {
                            childOptions.unshift('--recursive');
                        } else {
                            childOptions.unshift('--no-recursive');
                        }
                    }
                    break;
                case 'lint':
                    if (childOptions.indexOf('--lint') === -1 &&
                            childOptions.indexOf('--no-lint') === -1) {
                        // Sorry - options have to be reversed because we
                        // unshift just to be sure.
                        childOptions.unshift('config');
                        childOptions.unshift('--lint');
                    }
                    break;
                case 'lint-stderr':
                    if (childOptions.indexOf('--lint-stderr') === -1 &&
                            childOptions.indexOf('--no-lint-stderr') === -1) {
                        if (localOptions[key]) {
                            childOptions.unshift('--lint-stderr');
                        }
                    }
                    break;
            }
        }

        Y.MDL.runChild('shifter', 'bin/shifter', childOptions);
    };

}, '@VERSION@', {requires: ['files']});
