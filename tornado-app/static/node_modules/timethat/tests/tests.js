var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    timethat = require('../lib/timethat');

var tests = {
    'exporting': {
        topic: function() {
            return timethat;
        },
        'should export one function': function(topic) {
            assert.isFunction(topic.calc);
        }
    },
    'should use stamp as start': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 5:43:21');
            return timethat.calc(start, end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '2 hours, 43 minutes, 21 seconds');
        }
    },
    'should use stamp as end': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 5:43:21');
            return timethat.calc(start.getTime(), end);
        },
        'should print': function(topic) {
            assert.equal(topic, '2 hours, 43 minutes, 21 seconds');
        }
    },
    'should work with no arguments': {
        topic: function() {
            return timethat.calc();
        },
        'should print': function(topic) {
            assert.equal(topic, '0 seconds');
        }
    },
    'timer should work with 1 day': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/2/2010 5:43:21');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '1 day, 2 hours, 43 minutes, 21 seconds');
        }
    },
    'timer should work with 2 days (plural)': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/3/2010 5:43:21');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '2 days, 2 hours, 43 minutes, 21 seconds');
        }
    },
    'timer should work with only hours': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 4:43:21');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '1 hour, 43 minutes, 21 seconds');
        }
    },
    'timer should work with only hours - plural': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 5:43:21');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '2 hours, 43 minutes, 21 seconds');
        }
    },
    'timer should work with only minutes': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 3:01:01');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '1 minute, 1 second');
        }
    },
    'timer should work with only minutes - plural': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 3:21:02');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '21 minutes, 2 seconds');
        }
    },
    'timer should work with only seconds': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 3:00:01');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '1 second');
        }
    },
    'timer should work with only seconds - plural': {
        topic: function() {
            var start = new Date('1/1/2010 3:00:00'),
                end = new Date('1/1/2010 3:00:02');
            return timethat.calc(start.getTime(), end.getTime());
        },
        'should print': function(topic) {
            assert.equal(topic, '2 seconds');
        }
    },
    'timer should work with milliseconds': {
        topic: function() {
            return timethat.calc(1262336400000, 1262336400150);
        },
        'should print': function(topic) {
            assert.equal(topic, '0.15 seconds');
        }
    },
};


vows.describe('timethat').addBatch(tests).export(module);
