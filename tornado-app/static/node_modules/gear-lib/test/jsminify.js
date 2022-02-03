var Blob = require('gear').Blob,
    jsminify = require('..').jsminify,
    fixtures = {
        js: new Blob('function   test(  x )  {console.log(x);;;;}'),
        min: 'function test(x){console.log(x);}\n',
        license: new Blob('/*!\n* Copyright (C) 2012\n*/\nfunction foo() {}'),
        license_min: '\n/*!\n* Copyright (C) 2012\n*/\n;function foo(){}\n',
        comment: new Blob('/*\n* Copyright (C) 2012\n*/\nfunction foo() {}'),
        comment_min: 'function foo(){}\n'
    };

describe('jsminify()', function() {
    it('should minify js', function(done) {
        jsminify({}, fixtures.js, function(err, res) {
            res.result.should.equal(fixtures.min);
            done(err);
        });
    });

    it('should preserve licenses', function(done) {
        jsminify({}, fixtures.license, function(err, res) {
            res.result.should.equal(fixtures.license_min);
            done(err);
        });
    });

    it('should strip comments', function(done) {
        jsminify({}, fixtures.comment, function(err, res) {
            res.result.should.equal(fixtures.comment_min);
            done(err);
        });
    });
});