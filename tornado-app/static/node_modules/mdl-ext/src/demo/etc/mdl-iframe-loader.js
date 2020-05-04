'use strict';

/**
 * Inject required CSS and JS into html fragment loaded into an <iframe>
 * @type {{}}
 */
var mdlIframeLoader = {};
(function(self) {

  // The CSS and JS needed to run MDL snippets in an <iframe>

  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  try {
    new window.CustomEvent('test');
  } catch(e) {
    var CustomEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }

  var docs = [
    { 'type': 'css', 'id': 'font-roboto-css',     'src': 'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en' },
    { 'type': 'css', 'id': 'material-icon-css',   'src': 'https://fonts.googleapis.com/icon?family=Material+Icons' },
    { 'type': 'css', 'id': 'dialog-polyfill-css', 'src': 'demo/styles/dialog-polyfill.css' },
    { 'type': 'css', 'id': 'material-css',        'src': 'https://code.getmdl.io/1.1.3/material.grey-orange.min.css' },
    { 'type': 'css', 'id': 'mdlext-css',          'src': 'lib/mdl-ext-eqjs.css' },
    { 'type': 'css', 'id': 'demo-css',            'src': 'demo/styles/demo.css' },
    { 'type': 'js',  'id': 'dialog-polyfill-js',  'src': 'demo/scripts/dialog-polyfill.js' },
    { 'type': 'js',  'id': 'material-js',         'src': 'https://code.getmdl.io/1.1.3/material.min.js' },
    { 'type': 'js',  'id': 'eq-js',               'src': 'demo/scripts/eq.min.js' },
    { 'type': 'js',  'id': 'mdlext-js',           'src': 'lib/index.js' }
  ];

  var joinOrigin = function(origin, src) {
    return src.startsWith('http') ? src : origin.concat(src);
  };

  var loadResources = function( origin, loadCompleted ) {
    var expectToLoad = docs.length;
    var filesLoaded = 0;

    for (var i = 0; i < docs.length; i++) {
      if (document.getElementById(docs[i].id) === null) {
        var el;
        var src = joinOrigin(origin, docs[i].src);

        if (docs[i].type === 'css') {
          el = document.createElement('link');
          el.href = src;
          el.rel = 'stylesheet';
          el.type = 'text/css';
        }
        else {
          el = document.createElement('script');
          el.src = src;
          el.type = 'text/javascript';
          el.async = false;
          el.charset = 'utf-8';
        }
        el.id = docs[i].id;
        el.onload = function () {
          filesLoaded++;
          if(filesLoaded >= expectToLoad) {
            loadCompleted();
          }
        };
        document.head.appendChild(el);
      }
      else {
        expectToLoad--;
      }
    }
  };

  /**
   * Inject required CSS and JS into html fragment loaded into an <iframe>
   * @param origin path relative to root of this project, e.g. "../../../
   */
  self.load = function( origin ) {
    loadResources( origin, function () {
      if(window.componentHandler) {
        window.componentHandler.upgradeDom();
      }
    });
  };

  return self;
})(mdlIframeLoader);
