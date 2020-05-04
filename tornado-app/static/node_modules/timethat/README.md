Time That
=========

A simple module to print elapsed time from one date to another.

I use this in several of my CLI tools and figured I should export it and not just copy it.

Install
-------

    npm i timethat

Usage
-----

```javascript
var timethat = require('timethat'),
    start = new Date('1/1/2010 3:00:00'),
    end = new Date('1/1/2010 5:43:21');

console.log(timethat.calc(start, end));

//2 hours, 43 minutes, 21 seconds
```

```javascript
var start = new Date('1/1/2010 3:00:00'),
    end = new Date('1/1/2010 3:21:02');

console.log(timethat.calc(start, end));

//21 minutes, 2 seconds
```

```javascript
console.log(timethat.calc(1262336400000, 1262336400150));

//0.15 seconds
```

You can give it seconds or `Date` objects.

Build Status
------------

[![Build Status](https://secure.travis-ci.org/davglass/timethat.png)](http://travis-ci.org/davglass/timethat)

Currently at 100% code coverage, reports are in the Travis builds.

