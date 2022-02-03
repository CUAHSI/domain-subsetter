YUI.add('options', function(Y) {
    var path = require('path'),
        returnvalue = {};

    /**
     * Handles argument parsing
     * @module mdl
     * @class Options
     */

    /**
     * Parses arguments and returns an Object of config options
     * @method Options
     * @param {Array} args Arguments to parse
     * @return {Object} The config object
     */
    Y.Options = function(inputargs) {
        var args = Y.Array(inputargs),
            v = null,

            // Default values:
            options = {
                other: []
            },
            command = args.shift();

        switch (command) {
            case '-h':
            case 'help':
                options.help = true;
                break;
            case '-s':
            case 'shifter':
                options.help = false;
                options.shifter = true;
                break;
            default:
                Y.log('No valid command given', 'warn', Y.packageInfo.name);
                break;
        }

        options.args = args;

        return options;
    };

});
