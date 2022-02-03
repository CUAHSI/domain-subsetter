/*jslint maxlen: 500 */
var vows = require('vows'),
    assert = require('assert'),
    cssproc = require('../lib/');

var tests = {
    'should export': {
        topic: function() {
            return cssproc;
        },
        'and should have parse function': function(topic) {
            assert.isFunction(topic.parse);
        }
    },
    'process background url': {
        ' ../../s1/foo.gif [multi line]': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url(\n';
                    str += "   '../../s1/foo.gif'\n";
                    str += ');\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo/s1/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url(\n';
                    str += "   'http://foobar.com/build/foo/s1/foo.gif'\n";
                    str += ');\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' ../../../foo.gif': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( ../../../foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( http://foobar.com/build/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' .././../../foo.gif': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( .././../../foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( http://foobar.com/build/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' foo.gif': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo/bar/baz/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( http://foobar.com/build/foo/bar/baz/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' ./foo.gif': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( ./foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo/bar/baz/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( http://foobar.com/build/foo/bar/baz/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' /foo/bar/baz/foo.gif': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( /foo/bar/baz/foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo/bar/baz/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( http://foobar.com/build/foo/bar/baz/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        },
        ' "../../s1/s2/foo.gif"': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( "../../s1/s2/foo.gif" );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return "http://foobar.com/build/foo/s1/s2/foo.gif"': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( "http://foobar.com/build/foo/s1/s2/foo.gif" );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        }
    },
    'skipping absolute paths': {
        'url(http://www.yahoo.com/a1/a2/foobar.gif )': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url(http://www.yahoo.com/a1/a2/foobar.gif );\n';
                    str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        },
        'url( "http://www.yahoo.com/a1/a2/foobar.gif")': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url( "http://www.yahoo.com/a1/a2/foobar.gif");\n';
                    str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        },
        "url(   'http://www.yahoo.com/a1/a2/foobar.gif'  )": {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += "background: url(    'http://www.yahoo.com/a1/a2/foobar.gif' );\n";
                    str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        },
        "url('http://www.yahoo.com/a1/a2/foobar.gif')": {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += "background: url('http://www.yahoo.com/a1/a2/foobar.gif');\n";
                    str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        },
        'url(//foobar.com/foo.gif)': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += '    background: url(//foobar.com/foo.gif);\n';
                    str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/file.css',
                    base: '//xyz.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        }
    },
    'VML': {
        "url(#default#VML);": {
            topic: function() {
                var str = 'v\\:oval,\n';
                str += 'v\\:shadow,\n';
                str += 'v\\:fill {\n';
                str += '    behavior: url(#default#VML);\n';
                str += '    display: inline-block;\n';
                str += '    zoom: 1; *display: inline;\n';
                str += '};\n';

                this.str = str;
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should not change url': function(topic) {
                assert.equal(this.str, topic);
            }
        }
    },
    'AlphaImageLoader': {
        "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='picker_mask.png', sizingMethod='scale')": {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '    background-image: none;\n';
                    str += "    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='picker_mask.png', sizingMethod='scale');\n";
                    str += '}\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            "and should return  src='http://foobar.com/build/foo/s1/s2/picker_mask.png'": function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '    background-image: none;\n';
                    str += "    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://foobar.com/build/foo/s1/s2/picker_mask.png', sizingMethod='scale');\n";
                    str += '}\n';
                assert.equal(str, topic);
            }
        },
        'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale", src="picker_mask.png")': {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '    background-image: none;\n';
                    str += '    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale", src="picker_mask.png");\n';
                    str += '}\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return src="http://foobar.com/build/foo/s1/s2/picker_mask.png"': function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '    background-image: none;\n';
                    str += '    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale", src="http://foobar.com/build/foo/s1/s2/picker_mask.png");\n';
                    str += '}\n';
                assert.equal(str, topic);
            }
        },
        'filter:AlphaImageLoader(src="picker_mask.png")': {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="picker_mask.png");\n';
                    str += '}\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return src="http://foobar.com/build/foo/s1/s2/picker_mask.png"': function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="http://foobar.com/build/foo/s1/s2/picker_mask.png");\n';
                    str += '}\n';
                assert.equal(str, topic);
            }
        },
        'filter:AlphaImageLoader(src="../picker_mask.png")': {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="../picker_mask.png");\n';
                    str += '}\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return src="http://foobar.com/build/foo/s1/picker_mask.png"': function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="http://foobar.com/build/foo/s1/picker_mask.png");\n';
                    str += '}\n';
                assert.equal(str, topic);
            }
        },
        'filter:AlphaImageLoader(src="../../f1/picker_mask.png")': {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="../../f1/picker_mask.png");\n';
                    str += '}\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should resturn src="http://foobar.com/build/foo/f1/picker_mask.png"': function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '    filter:AlphaImageLoader(src="http://foobar.com/build/foo/f1/picker_mask.png");\n';
                    str += '}\n';
                assert.equal(str, topic);
            }
        },
        'filter:AlphaImageLoader(src="../../f1/picker_mask.png") [multi-line]': {
            topic: function() {
                var str = '*html .yui-picker-bg {\n';
                    str += '      /* picker_mask.png */\n';
                    str += '      /* http://foo/build/a1/f1/f2/picker_mask.png */\n';
                    str += '   filter:AlphaImageLoader(\n';
                    str += '      src="../../f1/picker_mask.png",\n';
                    str += "      sizingMethod='scale'\n";
                    str += '   );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/s1/s2/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return src="http://foobar.com/build/foo/f1/picker_mask.png"': function(topic) {
                var str = '*html .yui-picker-bg {\n';
                    str += '      /* picker_mask.png */\n';
                    str += '      /* http://foo/build/a1/f1/f2/picker_mask.png */\n';
                    str += '   filter:AlphaImageLoader(\n';
                    str += '      src="http://foobar.com/build/foo/f1/picker_mask.png",\n';
                    str += "      sizingMethod='scale'\n";
                    str += '   );\n';
                    str += '};\n';

                assert.equal(str, topic);
            }
        }
    },
    'Multi line in same batch': {
        ' ../../s1/foo.gif [multi line]': {
            topic: function() {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url(\n';
                    str += "   '../../s1/foo.gif'\n";
                    str += ');\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor {\n';
                    str += '   background: url( ../../../foo.gif );\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/foo/bar/baz/file.css',
                    base: 'http://foobar.com/build/'
                }, str, this.callback);
            },
            'and should return http://foobar.com/build/foo/s1/foo.gif': function(topic) {
                var str = '.yui-test-cssprocessor {\n';
                    str += 'background: url(\n';
                    str += "   'http://foobar.com/build/foo/s1/foo.gif'\n";
                    str += ');\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor {\n';
                    str += '   background: url( http://foobar.com/build/foo.gif );\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        }
    },
    'no urls in css': {
        topic: function() {
            var str = '.yui-test-cssprocessor {\n';
                str += '    font-weight: bold;\n';
                str += '};\n';

            this.str = str;
            cssproc.parse({
                root: '/home/yui/src/',
                path: '/home/yui/src/foo/bar/baz/file.css',
                base: 'http://foobar.com/build/'
            }, str, this.callback);
        },
        'and not change anything': function(topic) {
            assert.equal(this.str, topic);
        }
    },
    'base as absolute path - /path/to': {
        topic: function() {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
            cssproc.parse({
                root: '/home/yui/src/',
                path: '/home/yui/src/foo/bar/baz/file.css',
                base: '/path/to/build/'
            }, str, this.callback);
        },
        'and should return /path/to/build/foo.gif': function(topic) {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(/path/to/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
            assert.equal(str, topic);
        }
    },
    'base without procol - //foobar.com': {
        topic: function() {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
            cssproc.parse({
                root: '/home/yui/src/',
                path: '/home/yui/src/foo/bar/baz/file.css',
                base: '//foobar.com/build/'
            }, str, this.callback);
        },
        'and should return /path/to/build/foo.gif': function(topic) {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(//foobar.com/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
            assert.equal(str, topic);
        }
    },
    'base with multiple domains': {
        topic: function() {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor2 {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor3 {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor4 {\n';
                str += '    background: url(foo.gif);\n';
                str += '};\n';
            cssproc.parse({
                root: '/home/yui/src/',
                path: '/home/yui/src/foo/bar/baz/file.css',
                base: [
                    '//foobar.com/build/',
                    '//s1.foobar.com/build/',
                    'http://s2.foobar.com/build/'
                ]
            }, str, this.callback);
        },
        'and should use multiple domains': function(topic) {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(//foobar.com/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor2 {\n';
                str += '    background: url(//s1.foobar.com/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor3 {\n';
                str += '    background: url(http://s2.foobar.com/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor4 {\n';
                str += '    background: url(//foobar.com/build/foo/bar/baz/foo.gif);\n';
                str += '};\n';
            assert.equal(str, topic);
        }
    },
    'multiple base with chaining calls': {
        topic: function() {
            var callback = this.callback,
                str = '.yui-test-cssprocessor {\n';
                str += '    background: url(bar.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor2 {\n';
                str += '    background: url(bar.gif);\n';
                str += '};\n';
            cssproc.parse({
                root: '/home/yui/src/',
                path: '/home/yui/src/file.css',
                base: [
                    'https://foobar.com/build/',
                    'https://barfoo.com/build/'
                ]
            }, str, function (err, firstBlob) {
                var str = firstBlob;
                    str += '.yui-test-cssprocessor {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor2 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor3 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor4 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/another.css',
                    base: [
                        '//xyz.com/build/',
                        '//abc.com/build/'
                    ]
                }, str, callback);
            });
        },
        'and should not mix the index for multiple domains': function(topic) {
            var str = '.yui-test-cssprocessor {\n';
                str += '    background: url(https://foobar.com/build/bar.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor2 {\n';
                str += '    background: url(https://barfoo.com/build/bar.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor {\n';
                str += '    background: url(//xyz.com/build/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor2 {\n';
                str += '    background: url(//abc.com/build/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor3 {\n';
                str += '    background: url(//xyz.com/build/foo.gif);\n';
                str += '};\n';
                str += '.yui-test-cssprocessor4 {\n';
                str += '    background: url(//abc.com/build/foo.gif);\n';
                str += '};\n';
            assert.equal(str, topic);
        },
        'and parse another chunk with multi domains': {
            topic: function() {
                var str  = '.yui-test-cssprocessor {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor2 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor3 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor4 {\n';
                    str += '    background: url(foo.gif);\n';
                    str += '};\n';
                cssproc.parse({
                    root: '/home/yui/src/',
                    path: '/home/yui/src/another.css',
                    base: [
                        '//xyz.com/build/',
                        '//abc.com/build/',
                        '//asd.com/build/',
                        '//qwe.com/build/'
                    ]
                }, str, this.callback);
            },
            'and should restart the index to -1': function(topic) {
                var str  = '.yui-test-cssprocessor {\n';
                    str += '    background: url(//xyz.com/build/foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor2 {\n';
                    str += '    background: url(//abc.com/build/foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor3 {\n';
                    str += '    background: url(//asd.com/build/foo.gif);\n';
                    str += '};\n';
                    str += '.yui-test-cssprocessor4 {\n';
                    str += '    background: url(//qwe.com/build/foo.gif);\n';
                    str += '};\n';
                assert.equal(str, topic);
            }
        }
    }
};


vows.describe('cssproc').addBatch(tests)['export'](module);
