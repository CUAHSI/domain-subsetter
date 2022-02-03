YUI.add('help', function(Y) {
    /**
    * @module mdl
    * @class Help
    */
    var help = [
        "mdl [--forcebranch <branch>] [-h|--help] <command> [command options]",
        "",
        "       --forcebranch <branch>  Use tools for a specific version of Moodle",
        "               Under normal circumstances the branch of Moodle that you are",
        "               using will be determined by parsing the version.php in your",
        "               moodle root directory.",
        "       -h|--help               Show this help, and the help for the version",
        "               of mdl relevant to the version of moodle you are running.",
        "",
        "Version-specific help follows below:",
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
    };

});
