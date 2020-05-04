var YUITest = require('yuitest'),
    Assert = YUITest.Assert,
    ObjectAssert = YUITest.ObjectAssert,
    path = require('path'),
    Y = require(path.join(__dirname, '../', 'lib', 'init'));

var suite = new YUITest.TestSuite('files.js');
suite.add(new YUITest.TestCase({
    name: 'exists',
    test_valid: function() {
        var result = Y.Files.exists(path.join(__dirname, 'testdata', 'files'));
        Assert.isTrue(result);
    },
    test_valid_callback: function() {
        var result,
            callback,
            test = this;

        callback = function(returnvalue) {
            Assert.isTrue(returnvalue);
            test.resume();
        };
        result = Y.Files.exists(path.join(__dirname, 'testdata', 'files', 'json.json'), callback);
        this.wait();
    },
    test_invalid: function() {
        var result = Y.Files.exists(path.join(__dirname, 'testdata', 'invalidlocation'));
        Assert.isFalse(result);
    },
    test_invalid_callback: function() {
        var result,
            callback,
            test = this;

        callback = function(returnvalue) {
            Assert.isFalse(returnvalue);
            test.resume();
        };
        result = Y.Files.exists(path.join(__dirname, 'testdata', 'invalidlocation'), callback);
        this.wait();
    }
}));

suite.add(new YUITest.TestCase({
    name: 'getJSON',
    test_valid: function() {
        var result = Y.Files.getJSON(path.join(__dirname, 'testdata', 'files', 'json.json'));
        Assert.isObject(result);
        ObjectAssert.ownsKey('validkey', result);
    },
    test_invalid_file: function() {
        var result = Y.Files.getJSON(path.join(__dirname, 'testdata', 'files', 'nofilehere'));
        Assert.isObject(result);
        ObjectAssert.ownsNoKeys(result);
    }
}));

YUITest.TestRunner.add(suite);
