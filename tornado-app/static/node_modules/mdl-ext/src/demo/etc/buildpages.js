'use strict';

// TODO: Automate this. Use Gulp
const posthtml = require('posthtml');
const html = require('fs').readFileSync('partials/lightbox.html').toString();

posthtml()
  .use(require('posthtml-include')({ encoding: 'utf-8', root: 'partials/' }))
  .process(html /*, options */)
  .then(function(result) {
    console.log(result.html);
  })
  .catch(function(error) {
    console.error(error);
  });
