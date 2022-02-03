YUI.add('project', function(Y) {
    var NS = Y.namespace('Project'),
        fs = require('fs'),
        path = require('path');

    NS.init = function(inputoptions) {
        var options = null,

            // Use the CLI arguments if no others were given.
            args = inputoptions || Y.Array(process.argv, 2);

        // Process the arguments now.
        options = Y.Options(args);

        return options;
    };

});
