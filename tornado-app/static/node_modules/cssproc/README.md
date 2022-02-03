CSS Relative URL Processor
==========================

A small module designed to convert relative asset URL's in CSS files into absolute URL's for deployment
to a combo handled CDN (yui.yahooapis.com).

When you request a CSS file from a server with a ComboHandler on it, relative CSS assets are broken by default.

If your CSS looks like this:

```css
.foo {
    background-image: url( foo.png );
}
```

Located in a file with this path: `foo/bar/baz/main.css`

Loaded from a ComboHandler like this: `/combo?foo/bar/baz/main.css`

Your Image will resolve to: `/combo/foo.png`

When it should resolve to: `/foo/bar/baz/foo.png`

That's what this module does!


Build Status
------------

[![Build Status](https://secure.travis-ci.org/davglass/cssproc.png?branch=master)](http://travis-ci.org/davglass/cssproc)

Install
-------

    npm install cssproc


Examples
--------

As a file (from `examples/file/`):

```javascript
var cssproc = require('../../lib'),
    path = require('path'),
    fs = require('fs');

var file = path.join(__dirname, 'a1/f1/f2/test.css');

fs.readFile(file, 'utf8', function(err, data) {
    cssproc.parse({
        root: __dirname,
        path: file,
        base: 'http://yui.yahooapis.com/gallery-123456/'
    }, data, function(err, str) {
        console.log(str);
    });
});
```

It could also be used inside of a [combo handler](https://github.com/rgrove/combohandler)

Base
----

The value of `base` could be:

* `http://foobar.com/path/to` where protocol will be forced to HTTP
* `https://foobar.com/path/to` where protocol will be forced to SSL
* `//foobar.com/path/to` which is protocol agnostic where it uses the protocol for the css file that contains the images.
* `/path/to` for absolute paths where it uses the domain and protocol from the css file that contains the images.
* `['http://server1.com/path/to', '//server2.com/path/to', etc]` an array of hosts to loop through and alternate in the file to support domain sharding.
