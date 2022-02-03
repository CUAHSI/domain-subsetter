var YUITest = require('yuitest'),
    Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    ObjectAssert = YUITest.ObjectAssert,
    path = require('path'),
    Y = require(path.join(__dirname, '../', 'lib', 'init'));

var suite = new YUITest.TestSuite('mdl');
suite.add(new YUITest.TestCase({
    name: 'run',
    _should: {
    },
    test_help: function() {
        var options,
            test = this,
            help_show = Y.help.show;

        Y.help.show = function() {
            Y.help.show = help_show;
            Assert.pass();
        };

        options = Y.Project.init([
            '-h'
        ]);
        Assert.isTrue(options.help);

        Y.MDL.run(options);
    },
    test_findDependent: function() {
        var result;
        result = Y.MDL.findDependent('shifter');
        Assert.isString(result);
    },
    test_shifter: function() {
        var options,
            test = this,
            _spawnChild = Y.MDL.spawnChild,
            returnvalue;

        options = Y.Project.init([
            '-s'
        ]);

        // Overwrite the spawnChild to prevent it from actually spawning.
        Y.MDL.spawnChild = function(path, args) {
            Y.MDL.spawnChild = _spawnChild;
            Assert.pass();
            return 'spawnChild';
        };

        returnvalue = Y.MDL.run(options);
    }
}));

YUITest.TestRunner.add(suite);
