/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var parser = require('uglify-js').parser,
    uglify = require('uglify-js').uglify;

/**
 * Minify JS.
 *
 * Issue: we need to preserve license comments which is still an open issue in uglify-js:
 * https://github.com/mishoo/UglifyJS/pull/332
 *
 * Fix based on the Ender workaround here:
 * https://github.com/ender-js/Ender/blob/76961673be2a29e893d8d3dc9b97e3faf8b169a6/lib/ender.file.js#L25-58
 * Ender is licensed under MIT - copyright 2012 Dustin Diaz & Jacob Thornton
 * http://ender.no.de/
 *
 *
 * @param options {Object} Task options.
 * @param options.config {Object} Minify options.
 * @param blob {Object} Incoming blob.
 * @param done {Function} Callback on task completion.
 */
exports.jsminify = function (options, blob, done) {
    options = options || {};

    var config = options.config || {},
        comments = [],
        token = '"jsminify task: preserved comment block"',
        reMultiComments = /\/\*![\s\S]*?\*\//g,
        reTokens = new RegExp(token, 'g'),
        source = blob.result,
        ast;

    try {
        source = source.replace(reMultiComments, function (comment) {
            comments.push(comment);
            return ';' + token + ';';
        });

        ast = parser.parse(source, config.semicolon || false);

        if (config.mangle) {
            ast = uglify.ast_mangle(ast, config);
        }
        if (config.squeeze) {
            ast = uglify.ast_squeeze(ast, config);
        }

        source = uglify.gen_code(ast, config);

        source = source.replace(reTokens, function () {
            return '\n' + comments.shift() + '\n';
        });

        if (source.substr(source.length - 1) === ')') {
            source += ';';
        }
        source += '\n';
    } catch (e) {
        if (options.callback) {
            options.callback(e);
        }

        done('Minify failed, ' + (blob.name || 'file') + ' unparseable.\nException:\n' + JSON.stringify(e));
        return;
    }

    done(null, new blob.constructor(source, blob));
};
