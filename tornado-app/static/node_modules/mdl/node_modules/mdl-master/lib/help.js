YUI.add('help', function(Y) {
    /**
    * @module mdl
    * @class Help
    */
    var help = [
        "mdl [command] [options]",
        "Possible commands are:",
        "",
        "       -s|shifter      Run the YUI Shifter tool",
        "       -d|doc          Run the YUI Doc tool",
        "       -h|help         Display this help (helpful huh)",
        "",
        "Please refer to the relevant documentation for the tools to find out about their options",
        ""
    ].join('\n'),

    NS = Y.namespace('help');

    NS.render = function() {
        return Y.Lang.sub(help, {
            VERSION: Y.packageInfo.version
        });
    };

    NS.show = function() {
        // Display help
        console.log(this.render());

        // Exit nicely.
        process.exit(0);
    };

});
