(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("mdl-ext", [], factory);
	else if(typeof exports === 'object')
		exports["mdl-ext"] = factory();
	else
		root["mdl-ext"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(113);
	module.exports = __webpack_require__(53);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var VK_TAB = 9;
	var VK_ENTER = 13;
	var VK_ESC = 27;
	var VK_SPACE = 32;
	var VK_PAGE_UP = 33;
	var VK_PAGE_DOWN = 34;
	var VK_END = 35;
	var VK_HOME = 36;
	var VK_ARROW_LEFT = 37;
	var VK_ARROW_UP = 38;
	var VK_ARROW_RIGHT = 39;
	var VK_ARROW_DOWN = 40;
	
	var ARIA_EXPANDED = 'aria-expanded';
	var ARIA_HIDDEN = 'aria-hidden';
	var ARIA_MULTISELECTABLE = 'aria-multiselectable';
	var ARIA_SELECTED = 'aria-selected';
	
	var IS_DIRTY = 'is-dirty';
	var IS_DISABLED = 'is-disabled';
	var IS_EXPANDED = 'is-expanded';
	var IS_FOCUSED = 'is-focused';
	var IS_INVALID = 'is-invalid';
	var IS_UPGRADED = 'is-upgraded';
	var DATA_UPGRADED = 'data-upgraded';
	
	var MDL_RIPPLE = 'mdl-ripple';
	var MDL_RIPPLE_COMPONENT = 'MaterialRipple';
	var MDL_RIPPLE_EFFECT = 'mdl-js-ripple-effect';
	var MDL_RIPPLE_EFFECT_IGNORE_EVENTS = 'mdl-js-ripple-effect--ignore-events';
	
	exports.VK_TAB = VK_TAB;
	exports.VK_ENTER = VK_ENTER;
	exports.VK_ESC = VK_ESC;
	exports.VK_SPACE = VK_SPACE;
	exports.VK_PAGE_UP = VK_PAGE_UP;
	exports.VK_PAGE_DOWN = VK_PAGE_DOWN;
	exports.VK_END = VK_END;
	exports.VK_HOME = VK_HOME;
	exports.VK_ARROW_LEFT = VK_ARROW_LEFT;
	exports.VK_ARROW_UP = VK_ARROW_UP;
	exports.VK_ARROW_RIGHT = VK_ARROW_RIGHT;
	exports.VK_ARROW_DOWN = VK_ARROW_DOWN;
	exports.ARIA_EXPANDED = ARIA_EXPANDED;
	exports.ARIA_HIDDEN = ARIA_HIDDEN;
	exports.ARIA_MULTISELECTABLE = ARIA_MULTISELECTABLE;
	exports.ARIA_SELECTED = ARIA_SELECTED;
	exports.IS_DIRTY = IS_DIRTY;
	exports.IS_DISABLED = IS_DISABLED;
	exports.IS_EXPANDED = IS_EXPANDED;
	exports.IS_FOCUSED = IS_FOCUSED;
	exports.IS_INVALID = IS_INVALID;
	exports.IS_UPGRADED = IS_UPGRADED;
	exports.DATA_UPGRADED = DATA_UPGRADED;
	exports.MDL_RIPPLE = MDL_RIPPLE;
	exports.MDL_RIPPLE_COMPONENT = MDL_RIPPLE_COMPONENT;
	exports.MDL_RIPPLE_EFFECT = MDL_RIPPLE_EFFECT;
	exports.MDL_RIPPLE_EFFECT_IGNORE_EVENTS = MDL_RIPPLE_EFFECT_IGNORE_EVENTS;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(5)
	  , core      = __webpack_require__(1)
	  , ctx       = __webpack_require__(37)
	  , hide      = __webpack_require__(11)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(44)('wks')
	  , uid        = __webpack_require__(46)
	  , Symbol     = __webpack_require__(5).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 5 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(60);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(10)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(25);
	module.exports = __webpack_require__(9) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(6)
	  , IE8_DOM_DEFINE = __webpack_require__(82)
	  , toPrimitive    = __webpack_require__(101)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _apply = __webpack_require__(66);
	
	var _apply2 = _interopRequireDefault(_apply);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Since some events can fire at a high rate, the event handler should be limited to execute computationally
	 * expensive operations, such as DOM modifications, inside a single rendered frame.
	 * When listening to e.g. scroll and resize events, the browser tends to fire off more events per
	 * second than are actually useful. For instance, if your event listener sets some element positions, then it
	 * is possible for those positions to be updated multiple times in a single rendered frame. In this case, all of
	 * the layout calculations triggered by setting the elements' positions will be wasted except for the one time that
	 * it runs immediately prior to the browser rendering the updated layout to the screen.
	 * To avoid wasting cycles, we can use requestAnimationFrame to only run the event listener once just before the page
	 * is rendered to the screen.
	 * *
	 * @param callback the function to throttle
	 * @param context  optional context of this, default to global
	 * @return {function(...[*])}
	 */
	var fullThrottle = function fullThrottle(callback, context) {
	
	  if (!context) {
	    context = undefined || window;
	  }
	
	  var throttling = false;
	
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (!throttling) {
	      throttling = true;
	      window.requestAnimationFrame(function () {
	        throttling = false;
	        return (0, _apply2.default)(callback, context, args);
	      });
	    }
	  };
	};
	
	exports.default = fullThrottle;
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Converts a JSON string to object
	 * @param jsonString
	 * @param source
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.jsonStringToObject = undefined;
	
	var _assign = __webpack_require__(33);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var jsonStringToObject = function jsonStringToObject(jsonString) {
	  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	  var s = jsonString.replace(/'/g, '"');
	  try {
	    return (0, _assign2.default)(source, JSON.parse(s));
	  } catch (e) {
	    throw new Error('Failed to parse json string: ' + s + '. Error: ' + e.message);
	  }
	};
	
	exports.jsonStringToObject = jsonStringToObject;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * @license
	 * Copyright 2016 Leif Olsen. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * A javascript utility for conditionally creating a list of strings.
	 * The function takes any number of arguments which can be a string or object.
	 * Inspired by (but not copied from) JedWatson/classnames, https://github.com/JedWatson/classnames
	 *
	 * @param  {*} args the strings and/or objects to
	 * @return {Array} a list of strings
	 * @example
	 * // Returns ['foo', 'bar', 'baz', 'quux']
	 * stringList(', ', 'foo', { bar: true, duck: false }, 'baz', { quux: true });
	 * @example see the tests for more examples
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.stringList = exports.randomString = exports.joinStrings = undefined;
	
	var _keys = __webpack_require__(65);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var stringList = function stringList() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var isString = function isString(str) {
	    return str != null && typeof str === 'string';
	  };
	
	  var flatten = function flatten(list) {
	    return list.reduce(function (a, b) {
	      return a.concat(Array.isArray(b) ? flatten(b) : b);
	    }, []);
	  };
	
	  var objectToStrings = function objectToStrings(arg) {
	    return (0, _keys2.default)(arg).filter(function (key) {
	      return arg[key];
	    }).map(function (key) {
	      return key;
	    });
	  };
	
	  return args.filter(function (arg) {
	    return !!arg;
	  }).map(function (arg) {
	    return isString(arg) ? arg : objectToStrings(arg);
	  }).reduce(function (result, arg) {
	    return result.concat(Array.isArray(arg) ? flatten(arg) : arg);
	  }, []);
	};
	
	/**
	 * A simple javascript utility for conditionally joining strings together.
	 * The function takes a delimiter string and any number of arguments which can be a string or object.
	 *
	 * @param delimiter delimiter to separate joined strings
	 * @param  {*} args the strings and/or objects to join
	 * @return {String} the joined strings
	 * @example
	 * // Returns 'foo, bar, baz, quux'
	 * joinStrings(', ', 'foo', { bar: true, duck: false }, 'baz', { quux: true });
	 * @example see the tests for more examples
	 */
	var joinStrings = function joinStrings() {
	  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    args[_key2 - 1] = arguments[_key2];
	  }
	
	  var delimiter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';
	  return stringList.apply(undefined, args).join(delimiter);
	};
	
	/**
	 * Generates a random string with a given length
	 * @param n {Integer} length of generated string
	 * @see http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	 * @return {String} the random string
	 * @example
	 * // Returns e.g. 'pd781w0y'
	 * randomString(8);
	 * @example see the tests for more examples
	 */
	var randomString = function randomString() {
	  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
	  return Array(n + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, n);
	};
	
	exports.joinStrings = joinStrings;
	exports.randomString = randomString;
	exports.stringList = stringList;

/***/ },
/* 16 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(95)
	  , enumBugKeys = __webpack_require__(39);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(40)
	  , defined = __webpack_require__(24);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(24);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tether = exports.removeChildElements = exports.moveElements = exports.isRectInsideWindowViewport = exports.isFocusable = exports.getScrollParents = exports.getParentElements = exports.getWindowViewport = undefined;
	
	var _isNan = __webpack_require__(62);
	
	var _isNan2 = _interopRequireDefault(_isNan);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Remove child element(s)
	 * element.innerHTNL = '' has a performance penality!
	 * @see http://jsperf.com/empty-an-element/16
	 * @see http://jsperf.com/force-reflow
	 * @param element
	 * @param forceReflow
	 */
	var removeChildElements = function removeChildElements(element) {
	  var forceReflow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	
	
	  // See: http://jsperf.com/empty-an-element/16
	  while (element.lastChild) {
	    element.removeChild(element.lastChild);
	  }
	  if (forceReflow) {
	    // See: http://jsperf.com/force-reflow
	    var d = element.style.display;
	
	    element.style.display = 'none';
	    element.style.display = d;
	  }
	};
	
	/**
	 * Moves child elements from a DOM node to another dom node.
	 * @param source {HTMLElement}
	 * @param target {HTMLElement} If the target parameter is ommited, a document fragment is created
	 * @return {HTMLElement} The target node
	 *
	 * @example
	 * // Moves child elements from a DOM node to another dom node.
	 * moveElements(source, destination);
	 *
	 * @example
	 * // If the second parameter is ommited, a document fragment is created:
	 * let fragment = moveElements(source);
	 *
	 * @See: https://github.com/webmodules/dom-move
	 */
	var moveElements = function moveElements(source, target) {
	  if (!target) {
	    target = source.ownerDocument.createDocumentFragment();
	  }
	  while (source.firstChild) {
	    target.appendChild(source.firstChild);
	  }
	  return target;
	};
	
	/**
	 * Get the browser viewport dimensions
	 * @see http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
	 * @return {{windowWidth: number, windowHeight: number}}
	 */
	var getWindowViewport = function getWindowViewport() {
	  return {
	    viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
	    viewportHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	  };
	};
	
	/**
	 * Check whether an element is in the window viewport
	 * @see http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/
	 * @param top
	 * @param left
	 * @param bottom
	 * @param right
	 * @return {boolean} true if rectangle is inside window viewport, otherwise false
	 */
	var isRectInsideWindowViewport = function isRectInsideWindowViewport(_ref) {
	  var top = _ref.top,
	      left = _ref.left,
	      bottom = _ref.bottom,
	      right = _ref.right;
	
	  var _getWindowViewport = getWindowViewport(),
	      viewportWidth = _getWindowViewport.viewportWidth,
	      viewportHeight = _getWindowViewport.viewportHeight;
	
	  return top >= 0 && left >= 0 && bottom <= viewportHeight && right <= viewportWidth;
	};
	
	/**
	 * Get a list of parent elements that can possibly scroll
	 * @param el the element to get parents for
	 * @returns {Array}
	 */
	var getScrollParents = function getScrollParents(el) {
	  var elements = [];
	
	  /*
	  for (el = el.parentNode; el; el = el.parentNode) {
	    const cs = window.getComputedStyle(el);
	    if(!(cs.overflowY === 'hidden' && cs.overflowX === 'hidden')) {
	      elements.unshift(el);
	    }
	    if(el === document.body) {
	      break;
	    }
	  }
	  */
	
	  var element = el.parentNode;
	  while (element) {
	    var cs = window.getComputedStyle(element);
	    if (!(cs.overflowY === 'hidden' && cs.overflowX === 'hidden')) {
	      elements.unshift(element);
	    }
	    if (element === document.body) {
	      break;
	    }
	    element = element.parentNode;
	  }
	
	  return elements;
	};
	
	/**
	 * Get a list of parent elements, from a given element to a given element
	 * @param {HTMLElement} from
	 * @param {HTMLElement} to
	 * @return {Array<HTMLElement>} the parent elements, not including from and to
	 */
	var getParentElements = function getParentElements(from, to) {
	  var result = [];
	  var element = from.parentNode;
	  while (element) {
	    if (element === to) {
	      break;
	    }
	    result.unshift(element);
	    element = element.parentNode;
	  }
	  return result;
	};
	
	/**
	 * Position element next to button
	 *
	 * Positioning strategy
	 *  1. element.height > viewport.height
	 *     let element.height = viewport.heigt
	 *     let element.overflow-y = auto
	 *  2. element.width > viewport.width
	 *     let element.width = viewport.width
	 *  3. position element below button, align left edge of element with button left
	 *       done if element inside viewport
	 *  4. position element below button, align right edge of element with button right
	 *       done if element inside viewport
	 *  5. positions element above button, aligns left edge of element with button left
	 *       done if element inside viewport
	 *  6. position element above the control element, aligned to its right.
	 *       done if element inside viewport
	 *  7. position element at button right hand side, aligns element top with button top
	 *       done if element inside viewport
	 *  8. position element at button left hand side, aligns element top with button top
	 *       done if element inside viewport
	 *  9. position element inside viewport
	 *     1. position element at viewport bottom
	 *     2. position element at button right hand side
	 *        done if element inside viewport
	 *     3. position element at button left hand side
	 *       done if element inside viewport
	 *     4. position element at viewport right
	 * 10. done
	 *
	 */
	var tether = function tether(controlledBy, element) {
	  var controlRect = controlledBy.getBoundingClientRect();
	
	  // 1. will element height fit inside window viewport?
	
	  var _getWindowViewport2 = getWindowViewport(),
	      viewportWidth = _getWindowViewport2.viewportWidth,
	      viewportHeight = _getWindowViewport2.viewportHeight;
	
	  element.style.height = 'auto';
	  //element.style.overflowY = 'hidden';
	  if (element.offsetHeight > viewportHeight) {
	    element.style.height = viewportHeight + 'px';
	    element.style.overflowY = 'auto';
	  }
	
	  // 2. will element width fit inside window viewport?
	  element.style.width = 'auto';
	  if (element.offsetWidth > viewportWidth) {
	    element.style.width = viewportWidth + 'px';
	  }
	
	  var elementRect = element.getBoundingClientRect();
	
	  // element to control distance
	  var dy = controlRect.top - elementRect.top;
	  var dx = controlRect.left - elementRect.left;
	
	  // element rect, window coordinates relative to top,left of control
	  var top = elementRect.top + dy;
	  var left = elementRect.left + dx;
	  var bottom = top + elementRect.height;
	  var right = left + elementRect.width;
	
	  // Position relative to control
	  var ddy = dy;
	  var ddx = dx;
	
	  if (isRectInsideWindowViewport({
	    top: top + controlRect.height,
	    left: left,
	    bottom: bottom + controlRect.height,
	    right: right
	  })) {
	    // 3 position element below the control element, aligned to its left
	    ddy = controlRect.height + dy;
	    //console.log('***** 3');
	  } else if (isRectInsideWindowViewport({
	    top: top + controlRect.height,
	    left: left + controlRect.width - elementRect.width,
	    bottom: bottom + controlRect.height,
	    right: left + controlRect.width
	  })) {
	    // 4 position element below the control element, aligned to its right
	    ddy = controlRect.height + dy;
	    ddx = dx + controlRect.width - elementRect.width;
	    //console.log('***** 4');
	  } else if (isRectInsideWindowViewport({
	    top: top - elementRect.height,
	    left: left,
	    bottom: bottom - elementRect.height,
	    right: right
	  })) {
	    // 5. position element above the control element, aligned to its left.
	    ddy = dy - elementRect.height;
	    //console.log('***** 5');
	  } else if (isRectInsideWindowViewport({
	    top: top - elementRect.height,
	    left: left + controlRect.width - elementRect.width,
	    bottom: bottom - elementRect.height,
	    right: left + controlRect.width
	  })) {
	    // 6. position element above the control element, aligned to its right.
	    ddy = dy - elementRect.height;
	    ddx = dx + controlRect.width - elementRect.width;
	    //console.log('***** 6');
	  } else if (isRectInsideWindowViewport({
	    top: top,
	    left: left + controlRect.width,
	    bottom: bottom,
	    right: right + controlRect.width
	  })) {
	    // 7. position element at button right hand side
	    ddx = controlRect.width + dx;
	    //console.log('***** 7');
	  } else if (isRectInsideWindowViewport({
	    top: top,
	    left: left - controlRect.width,
	    bottom: bottom,
	    right: right - controlRect.width
	  })) {
	    // 8. position element at button left hand side
	    ddx = dx - elementRect.width;
	    //console.log('***** 8');
	  } else {
	    // 9. position element inside viewport, near controlrect if possible
	    //console.log('***** 9');
	
	    // 9.1 position element near controlrect bottom
	    ddy = dy - bottom + viewportHeight;
	    if (top + controlRect.height >= 0 && bottom + controlRect.height <= viewportHeight) {
	      ddy = controlRect.height + dy;
	    } else if (top - elementRect.height >= 0 && bottom - elementRect.height <= viewportHeight) {
	      ddy = dy - elementRect.height;
	    }
	
	    if (left + elementRect.width + controlRect.width <= viewportWidth) {
	      // 9.2 Position element at button right hand side
	      ddx = controlRect.width + dx;
	      //console.log('***** 9.2');
	    } else if (left - elementRect.width >= 0) {
	      // 9.3 Position element at button left hand side
	      ddx = dx - elementRect.width;
	      //console.log('***** 9.3');
	    } else {
	      // 9.4 position element at (near) viewport right
	      var r = left + elementRect.width - viewportWidth;
	      ddx = dx - r;
	      //console.log('***** 9.4');
	    }
	  }
	
	  // 10. done
	  element.style.top = element.offsetTop + ddy + 'px';
	  element.style.left = element.offsetLeft + ddx + 'px';
	  //console.log('***** 10. done');
	};
	
	/**
	 * Check if the given element can receive focus
	 * @param {HTMLElement} element the element to check
	 * @return {boolean} true if the element is focusable, otherwise false
	 */
	var isFocusable = function isFocusable(element) {
	  // https://github.com/stephenmathieson/is-focusable/blob/master/index.js
	  // http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
	
	  if (element.hasAttribute('tabindex')) {
	    var tabindex = element.getAttribute('tabindex');
	    if (!(0, _isNan2.default)(tabindex)) {
	      return parseInt(tabindex) > -1;
	    }
	  }
	
	  if (element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') !== 'false') {
	    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-contenteditable
	    return true;
	  }
	
	  // natively focusable, but only when enabled
	  var selector = /input|select|textarea|button|details/i;
	  var name = element.nodeName;
	  if (selector.test(name)) {
	    return element.type.toLowerCase() !== 'hidden' && !element.disabled;
	  }
	
	  // anchors and area must have an href
	  if (name === 'A' || name === 'AREA') {
	    return !!element.href;
	  }
	
	  if (name === 'IFRAME') {
	    // Check visible iframe
	    var cs = window.getComputedStyle(element);
	    return cs.getPropertyValue('display').toLowerCase() !== 'none';
	  }
	
	  return false;
	};
	
	/**
	 * Get a list of offset parents for given element
	 * @see https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
	 * @param el the element
	 * @return {Array} a list of offset parents
	 */
	/*
	const offsetParents = (el) => {
	  const elements = [];
	  for (; el; el = el.offsetParent) {
	    elements.unshift(el);
	  }
	  if(!elements.find(e => e === document.body)) {
	    elements.unshift(document.body);
	  }
	  return elements;
	};
	*/
	
	/**
	 * Finds the common offset ancestor of two DOM nodes
	 * @see https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
	 * @see https://gist.github.com/benpickles/4059636
	 * @param a
	 * @param b
	 * @return {Element} The common offset ancestor of a and b
	 */
	/*
	const commonOffsetAncestor = (a, b) => {
	  const parentsA = offsetParents(a);
	  const parentsB = offsetParents(b);
	
	  for (let i = 0; i < parentsA.length; i++) {
	    if (parentsA[i] !== parentsB[i]) return parentsA[i-1];
	  }
	};
	*/
	
	/**
	 * Calculate position relative to a target element
	 * @see http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
	 * @param target
	 * @param el
	 * @return {{top: number, left: number}}
	 */
	/*
	const calcPositionRelativeToTarget = (target, el) => {
	  let top = 0;
	  let left = 0;
	
	  while(el) {
	    top += (el.offsetTop - el.scrollTop + el.clientTop) || 0;
	    left += (el.offsetLeft - el.scrollLeft + el.clientLeft) || 0;
	    el = el.offsetParent;
	
	    if(el === target) {
	      break;
	    }
	  }
	  return { top: top, left: left };
	};
	*/
	
	exports.getWindowViewport = getWindowViewport;
	exports.getParentElements = getParentElements;
	exports.getScrollParents = getScrollParents;
	exports.isFocusable = isFocusable;
	exports.isRectInsideWindowViewport = isRectInsideWindowViewport;
	exports.moveElements = moveElements;
	exports.removeChildElements = removeChildElements;
	exports.tether = tether;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(63);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 24 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(44)('keys')
	  , uid    = __webpack_require__(46);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(99)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(41)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	// See: http://robertpenner.com/easing/
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
	  t /= d / 2;
	  if (t < 1) return c / 2 * t * t + b;
	  t--;
	  return -c / 2 * (t * (t - 2) - 1) + b;
	};
	
	var inOutQuintic = function inOutQuintic(t, b, c, d) {
	  var ts = (t /= d) * t;
	  var tc = ts * t;
	  return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
	};
	
	exports.easeInOutQuad = easeInOutQuad;
	exports.inOutQuintic = inOutQuintic;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MIN_INERVAL = 1000 / 60;
	
	/**
	 * Trigger a callback at a given interval
	 * @param interval defaults to 1000/60 ms
	 * @return {function()} reference to start, stop, immediate and started
	 */
	
	var intervalFunction = function intervalFunction() {
	  var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MIN_INERVAL;
	
	
	  var lapse = interval < MIN_INERVAL ? MIN_INERVAL : interval;
	  var cb = undefined;
	  var next = null;
	  var timeElapsed = 0;
	
	  var execute = function execute() {
	    var f = cb(timeElapsed);
	    if (!f) {
	      cancel();
	    }
	  };
	
	  var cancel = function cancel() {
	    if (next) {
	      window.cancelAnimationFrame(next);
	    }
	    next = null;
	    timeElapsed = 0;
	  };
	
	  var _start = function _start() {
	    var timeStart = Date.now();
	
	    var loop = function loop(now) {
	      if (next) {
	        next = window.requestAnimationFrame(function () {
	          return loop(Date.now());
	        });
	
	        timeElapsed += now - timeStart;
	
	        if (timeElapsed >= lapse) {
	          execute();
	          if ((timeElapsed -= lapse) > lapse) {
	            // time elapsed - interval_ > interval_ , indicates inactivity
	            // Could be due to browser minimized, tab changed, screen saver started, computer sleep, and so on
	            timeElapsed = 0;
	          }
	        }
	        timeStart = now;
	      }
	    };
	
	    next = 1; // a truthy value for first loop
	    loop(timeStart);
	  };
	
	  return {
	    get started() {
	      return next != null;
	    },
	    get interval() {
	      return lapse;
	    },
	    set interval(value) {
	      lapse = value < MIN_INERVAL ? MIN_INERVAL : value;
	    },
	    start: function start(callback) {
	      if (typeof callback !== 'function') {
	        throw new TypeError('callback parameter must be a function');
	      }
	      cb = callback;
	      _start();
	    },
	    immediate: function immediate() {
	      if (!cb) {
	        throw new ReferenceError('callback parameter is not defined. Call start before immediate.');
	      }
	      execute();
	    },
	
	    stop: function stop() {
	      return cancel();
	    }
	  };
	};
	
	exports.default = intervalFunction;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(36)
	  , TAG = __webpack_require__(4)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(34);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17)
	  , document = __webpack_require__(5).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(36);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(89)
	  , $export        = __webpack_require__(3)
	  , redefine       = __webpack_require__(98)
	  , hide           = __webpack_require__(11)
	  , has            = __webpack_require__(16)
	  , Iterators      = __webpack_require__(7)
	  , $iterCreate    = __webpack_require__(86)
	  , setToStringTag = __webpack_require__(43)
	  , getPrototypeOf = __webpack_require__(94)
	  , ITERATOR       = __webpack_require__(4)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f
	  , has = __webpack_require__(16)
	  , TAG = __webpack_require__(4)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(5)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(27)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(35)
	  , ITERATOR  = __webpack_require__(4)('iterator')
	  , Iterators = __webpack_require__(7);
	module.exports = __webpack_require__(1).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(105);
	var global        = __webpack_require__(5)
	  , hide          = __webpack_require__(11)
	  , Iterators     = __webpack_require__(7)
	  , TO_STRING_TAG = __webpack_require__(4)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray2 = __webpack_require__(8);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(function () {
	  'use strict';
	
	  var ACCORDION = 'mdlext-accordion';
	  var ACCORDION_VERTICAL = 'mdlext-accordion--vertical';
	  var ACCORDION_HORIZONTAL = 'mdlext-accordion--horizontal';
	  var PANEL = 'mdlext-accordion__panel';
	  var PANEL_ROLE = 'presentation';
	  var TAB = 'mdlext-accordion__tab';
	  var TAB_CAPTION = 'mdlext-accordion__tab__caption';
	  var TAB_ROLE = 'tab';
	  var TABPANEL = 'mdlext-accordion__tabpanel';
	  var TABPANEL_ROLE = 'tabpanel';
	  var RIPPLE_EFFECT = 'mdlext-js-ripple-effect';
	  var RIPPLE = 'mdlext-accordion__tab--ripple';
	  var ANIMATION_EFFECT = 'mdlext-js-animation-effect';
	  var ANIMATION = 'mdlext-accordion__tabpanel--animation';
	
	  /**
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	  var MaterialExtAccordion = function MaterialExtAccordion(element) {
	
	    // Stores the Accordion HTML element.
	    this.element_ = element;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtAccordion'] = MaterialExtAccordion;
	
	  // Helpers
	  var accordionPanelElements = function accordionPanelElements(element) {
	    if (!element) {
	      return {
	        panel: null,
	        tab: null,
	        tabpanel: null
	      };
	    } else if (element.classList.contains(PANEL)) {
	      return {
	        panel: element,
	        tab: element.querySelector('.' + TAB),
	        tabpanel: element.querySelector('.' + TABPANEL)
	      };
	    } else {
	      return {
	        panel: element.parentNode,
	        tab: element.parentNode.querySelector('.' + TAB),
	        tabpanel: element.parentNode.querySelector('.' + TABPANEL)
	      };
	    }
	  };
	
	  // Private methods.
	
	  /**
	   * Handles custom command event, 'open', 'close', 'toggle' or upgrade
	   * @param event. A custom event
	   * @private
	   */
	  MaterialExtAccordion.prototype.commandHandler_ = function (event) {
	    event.preventDefault();
	    event.stopPropagation();
	
	    if (event && event.detail) {
	      this.command(event.detail);
	    }
	  };
	
	  /**
	   * Dispatch toggle event
	   * @param {string} state
	   * @param {Element} tab
	   * @param {Element} tabpanel
	   * @private
	   */
	  MaterialExtAccordion.prototype.dispatchToggleEvent_ = function (state, tab, tabpanel) {
	    var ce = new CustomEvent('toggle', {
	      bubbles: true,
	      cancelable: true,
	      detail: { state: state, tab: tab, tabpanel: tabpanel }
	    });
	    this.element_.dispatchEvent(ce);
	  };
	
	  /**
	   * Open tab
	   * @param {Element} panel
	   * @param {Element} tab
	   * @param {Element} tabpanel
	   * @private
	   */
	  MaterialExtAccordion.prototype.openTab_ = function (panel, tab, tabpanel) {
	    panel.classList.add(_constants.IS_EXPANDED);
	    tab.setAttribute(_constants.ARIA_EXPANDED, 'true');
	    tabpanel.removeAttribute('hidden');
	    tabpanel.setAttribute(_constants.ARIA_HIDDEN, 'false');
	    this.dispatchToggleEvent_('open', tab, tabpanel);
	  };
	
	  /**
	   * Close tab
	   * @param {Element} panel
	   * @param {Element} tab
	   * @param {Element} tabpanel
	   * @private
	   */
	  MaterialExtAccordion.prototype.closeTab_ = function (panel, tab, tabpanel) {
	    panel.classList.remove(_constants.IS_EXPANDED);
	    tab.setAttribute(_constants.ARIA_EXPANDED, 'false');
	    tabpanel.setAttribute('hidden', '');
	    tabpanel.setAttribute(_constants.ARIA_HIDDEN, 'true');
	    this.dispatchToggleEvent_('close', tab, tabpanel);
	  };
	
	  /**
	   * Toggle tab
	   * @param {Element} panel
	   * @param {Element} tab
	   * @param {Element} tabpanel
	   * @private
	   */
	  MaterialExtAccordion.prototype.toggleTab_ = function (panel, tab, tabpanel) {
	    if (!(this.element_.hasAttribute('disabled') || tab.hasAttribute('disabled'))) {
	      if (tab.getAttribute(_constants.ARIA_EXPANDED).toLowerCase() === 'true') {
	        this.closeTab_(panel, tab, tabpanel);
	      } else {
	        if (this.element_.getAttribute(_constants.ARIA_MULTISELECTABLE).toLowerCase() !== 'true') {
	          this.closeTabs_();
	        }
	        this.openTab_(panel, tab, tabpanel);
	      }
	    }
	  };
	
	  /**
	   * Open tabs
	   * @private
	   */
	  MaterialExtAccordion.prototype.openTabs_ = function () {
	    var _this = this;
	
	    if (this.element_.getAttribute(_constants.ARIA_MULTISELECTABLE).toLowerCase() === 'true') {
	      [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + ACCORDION + ' > .' + PANEL))).filter(function (panel) {
	        return !panel.classList.contains(_constants.IS_EXPANDED);
	      }).forEach(function (closedItem) {
	        var tab = closedItem.querySelector('.' + TAB);
	        if (!tab.hasAttribute('disabled')) {
	          _this.openTab_(closedItem, tab, closedItem.querySelector('.' + TABPANEL));
	        }
	      });
	    }
	  };
	
	  /**
	   * Close tabs
	   * @private
	   */
	  MaterialExtAccordion.prototype.closeTabs_ = function () {
	    var _this2 = this;
	
	    [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + ACCORDION + ' > .' + PANEL + '.' + _constants.IS_EXPANDED))).forEach(function (panel) {
	      var tab = panel.querySelector('.' + TAB);
	      if (!tab.hasAttribute('disabled')) {
	        _this2.closeTab_(panel, tab, panel.querySelector('.' + TABPANEL));
	      }
	    });
	  };
	
	  // Public methods.
	
	  /**
	   * Upgrade an individual accordion tab
	   * @public
	   * @param {Element} tabElement The HTML element for the accordion panel.
	   */
	  MaterialExtAccordion.prototype.upgradeTab = function (tabElement) {
	    var _this3 = this;
	
	    var _accordionPanelElemen = accordionPanelElements(tabElement),
	        panel = _accordionPanelElemen.panel,
	        tab = _accordionPanelElemen.tab,
	        tabpanel = _accordionPanelElemen.tabpanel;
	
	    var disableTab = function disableTab() {
	      panel.classList.remove(_constants.IS_EXPANDED);
	      tab.setAttribute('tabindex', '-1');
	      tab.setAttribute(_constants.ARIA_EXPANDED, 'false');
	      tabpanel.setAttribute('hidden', '');
	      tabpanel.setAttribute(_constants.ARIA_HIDDEN, 'true');
	    };
	
	    var enableTab = function enableTab() {
	      if (!tab.hasAttribute(_constants.ARIA_EXPANDED)) {
	        tab.setAttribute(_constants.ARIA_EXPANDED, 'false');
	      }
	
	      tab.setAttribute('tabindex', '0');
	
	      if (tab.getAttribute(_constants.ARIA_EXPANDED).toLowerCase() === 'true') {
	        panel.classList.add(_constants.IS_EXPANDED);
	        tabpanel.removeAttribute('hidden');
	        tabpanel.setAttribute(_constants.ARIA_HIDDEN, 'false');
	      } else {
	        panel.classList.remove(_constants.IS_EXPANDED);
	        tabpanel.setAttribute('hidden', '');
	        tabpanel.setAttribute(_constants.ARIA_HIDDEN, 'true');
	      }
	    };
	
	    // In horizontal layout, caption must have a max-width defined to prevent pushing elements to the right of the caption out of view.
	    // In JsDom, offsetWidth and offsetHeight properties do not work, so this function is not testable.
	    /* istanbul ignore next */
	    var calcMaxTabCaptionWidth = function calcMaxTabCaptionWidth() {
	
	      var tabCaption = tab.querySelector('.' + TAB_CAPTION);
	      if (tabCaption !== null) {
	        var w = [].concat((0, _toConsumableArray3.default)(tab.children)).filter(function (el) {
	          return el.classList && !el.classList.contains(TAB_CAPTION);
	        }).reduce(function (v, el) {
	          return v + el.offsetWidth;
	        }, 0);
	
	        var maxWidth = tab.clientHeight - w;
	        if (maxWidth > 0) {
	          tabCaption.style['max-width'] = maxWidth + 'px';
	        }
	      }
	    };
	
	    var selectTab = function selectTab() {
	      if (!tab.hasAttribute(_constants.ARIA_SELECTED)) {
	        [].concat((0, _toConsumableArray3.default)(_this3.element_.querySelectorAll('.' + TAB + '[aria-selected="true"]'))).forEach(function (selectedTab) {
	          return selectedTab.removeAttribute(_constants.ARIA_SELECTED);
	        });
	        tab.setAttribute(_constants.ARIA_SELECTED, 'true');
	      }
	    };
	
	    var tabClickHandler = function tabClickHandler() {
	      _this3.toggleTab_(panel, tab, tabpanel);
	      selectTab();
	    };
	
	    var tabFocusHandler = function tabFocusHandler() {
	      selectTab();
	    };
	
	    var tabpanelClickHandler = function tabpanelClickHandler() {
	      selectTab();
	    };
	
	    var tabpanelFocusHandler = function tabpanelFocusHandler() {
	      selectTab();
	    };
	
	    var tabKeydownHandler = function tabKeydownHandler(e) {
	
	      if (_this3.element_.hasAttribute('disabled')) {
	        return;
	      }
	
	      if (e.keyCode === _constants.VK_END || e.keyCode === _constants.VK_HOME || e.keyCode === _constants.VK_ARROW_UP || e.keyCode === _constants.VK_ARROW_LEFT || e.keyCode === _constants.VK_ARROW_DOWN || e.keyCode === _constants.VK_ARROW_RIGHT) {
	
	        var nextTab = null;
	        var keyCode = e.keyCode;
	
	        if (keyCode === _constants.VK_HOME) {
	          nextTab = _this3.element_.querySelector('.' + PANEL + ':first-child > .' + TAB);
	          if (nextTab && nextTab.hasAttribute('disabled')) {
	            nextTab = null;
	            keyCode = _constants.VK_ARROW_DOWN;
	          }
	        } else if (keyCode === _constants.VK_END) {
	          nextTab = _this3.element_.querySelector('.' + PANEL + ':last-child > .' + TAB);
	          if (nextTab && nextTab.hasAttribute('disabled')) {
	            nextTab = null;
	            keyCode = _constants.VK_ARROW_UP;
	          }
	        }
	
	        if (!nextTab) {
	          var nextPanel = panel;
	
	          do {
	            if (keyCode === _constants.VK_ARROW_UP || keyCode === _constants.VK_ARROW_LEFT) {
	              nextPanel = nextPanel.previousElementSibling;
	              if (!nextPanel) {
	                nextPanel = _this3.element_.querySelector('.' + PANEL + ':last-child');
	              }
	              if (nextPanel) {
	                nextTab = nextPanel.querySelector('.' + PANEL + ' > .' + TAB);
	              }
	            } else if (keyCode === _constants.VK_ARROW_DOWN || keyCode === _constants.VK_ARROW_RIGHT) {
	              nextPanel = nextPanel.nextElementSibling;
	              if (!nextPanel) {
	                nextPanel = _this3.element_.querySelector('.' + PANEL + ':first-child');
	              }
	              if (nextPanel) {
	                nextTab = nextPanel.querySelector('.' + PANEL + ' > .' + TAB);
	              }
	            }
	
	            if (nextTab && nextTab.hasAttribute('disabled')) {
	              nextTab = null;
	            } else {
	              break;
	            }
	          } while (nextPanel !== panel);
	        }
	
	        if (nextTab) {
	          e.preventDefault();
	          e.stopPropagation();
	          nextTab.focus();
	
	          // Workaround for JSDom testing:
	          // In JsDom 'element.focus()' does not trigger any focus event
	          if (!nextTab.hasAttribute(_constants.ARIA_SELECTED)) {
	
	            [].concat((0, _toConsumableArray3.default)(_this3.element_.querySelectorAll('.' + TAB + '[aria-selected="true"]'))).forEach(function (selectedTab) {
	              return selectedTab.removeAttribute(_constants.ARIA_SELECTED);
	            });
	
	            nextTab.setAttribute(_constants.ARIA_SELECTED, 'true');
	          }
	        }
	      } else if (e.keyCode === _constants.VK_ENTER || e.keyCode === _constants.VK_SPACE) {
	        e.preventDefault();
	        e.stopPropagation();
	        _this3.toggleTab_(panel, tab, tabpanel);
	      }
	    };
	
	    if (tab === null) {
	      throw new Error('There must be a tab element for each accordion panel.');
	    }
	
	    if (tabpanel === null) {
	      throw new Error('There must be a tabpanel element for each accordion panel.');
	    }
	
	    panel.setAttribute('role', PANEL_ROLE);
	    tab.setAttribute('role', TAB_ROLE);
	    tabpanel.setAttribute('role', TABPANEL_ROLE);
	
	    if (tab.hasAttribute('disabled')) {
	      disableTab();
	    } else {
	      enableTab();
	    }
	
	    if (this.element_.classList.contains(ACCORDION_HORIZONTAL)) {
	      calcMaxTabCaptionWidth();
	    }
	
	    if (this.element_.classList.contains(RIPPLE_EFFECT)) {
	      tab.classList.add(RIPPLE);
	    }
	
	    if (this.element_.classList.contains(ANIMATION_EFFECT)) {
	      tabpanel.classList.add(ANIMATION);
	    }
	
	    // Remove listeners, just in case ...
	    tab.removeEventListener('click', tabClickHandler);
	    tab.removeEventListener('focus', tabFocusHandler);
	    tab.removeEventListener('keydown', tabKeydownHandler);
	    tabpanel.removeEventListener('click', tabpanelClickHandler);
	    tabpanel.removeEventListener('focus', tabpanelFocusHandler);
	
	    tab.addEventListener('click', tabClickHandler);
	    tab.addEventListener('focus', tabFocusHandler);
	    tab.addEventListener('keydown', tabKeydownHandler);
	    tabpanel.addEventListener('click', tabpanelClickHandler, true);
	    tabpanel.addEventListener('focus', tabpanelFocusHandler, true);
	  };
	  MaterialExtAccordion.prototype['upgradeTab'] = MaterialExtAccordion.prototype.upgradeTab;
	
	  /**
	   * Execute command
	   * @param detail
	   */
	  MaterialExtAccordion.prototype.command = function (detail) {
	    var _this4 = this;
	
	    var openTab = function openTab(tabElement) {
	
	      if (tabElement === undefined) {
	        _this4.openTabs_();
	      } else if (tabElement !== null) {
	        var _accordionPanelElemen2 = accordionPanelElements(tabElement),
	            panel = _accordionPanelElemen2.panel,
	            tab = _accordionPanelElemen2.tab,
	            tabpanel = _accordionPanelElemen2.tabpanel;
	
	        if (tab.getAttribute(_constants.ARIA_EXPANDED).toLowerCase() !== 'true') {
	          _this4.toggleTab_(panel, tab, tabpanel);
	        }
	      }
	    };
	
	    var closeTab = function closeTab(tabElement) {
	      if (tabElement === undefined) {
	        _this4.closeTabs_();
	      } else if (tabElement !== null) {
	        var _accordionPanelElemen3 = accordionPanelElements(tabElement),
	            panel = _accordionPanelElemen3.panel,
	            tab = _accordionPanelElemen3.tab,
	            tabpanel = _accordionPanelElemen3.tabpanel;
	
	        if (tab.getAttribute(_constants.ARIA_EXPANDED).toLowerCase() === 'true') {
	          _this4.toggleTab_(panel, tab, tabpanel);
	        }
	      }
	    };
	
	    var toggleTab = function toggleTab(tabElement) {
	      if (tabElement) {
	        var _accordionPanelElemen4 = accordionPanelElements(tabElement),
	            panel = _accordionPanelElemen4.panel,
	            tab = _accordionPanelElemen4.tab,
	            tabpanel = _accordionPanelElemen4.tabpanel;
	
	        _this4.toggleTab_(panel, tab, tabpanel);
	      }
	    };
	
	    if (detail && detail.action) {
	      var action = detail.action,
	          target = detail.target;
	
	
	      switch (action.toLowerCase()) {
	        case 'open':
	          openTab(target);
	          break;
	        case 'close':
	          closeTab(target);
	          break;
	        case 'toggle':
	          toggleTab(target);
	          break;
	        case 'upgrade':
	          if (target) {
	            this.upgradeTab(target);
	          }
	          break;
	        default:
	          throw new Error('Unknown action "' + action + '". Action must be one of "open", "close", "toggle" or "upgrade"');
	      }
	    }
	  };
	  MaterialExtAccordion.prototype['command'] = MaterialExtAccordion.prototype.command;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtAccordion.prototype.init = function () {
	    var _this5 = this;
	
	    if (this.element_) {
	      // Do the init required for this component to work
	      if (!(this.element_.classList.contains(ACCORDION_HORIZONTAL) || this.element_.classList.contains(ACCORDION_VERTICAL))) {
	        throw new Error('Accordion must have one of the classes "' + ACCORDION_HORIZONTAL + '" or "' + ACCORDION_VERTICAL + '"');
	      }
	
	      this.element_.setAttribute('role', 'tablist');
	
	      if (!this.element_.hasAttribute(_constants.ARIA_MULTISELECTABLE)) {
	        this.element_.setAttribute(_constants.ARIA_MULTISELECTABLE, 'false');
	      }
	
	      this.element_.removeEventListener('command', this.commandHandler_);
	      this.element_.addEventListener('command', this.commandHandler_.bind(this), false);
	
	      [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + ACCORDION + ' > .' + PANEL))).forEach(function (panel) {
	        return _this5.upgradeTab(panel);
	      });
	
	      // Set upgraded flag
	      this.element_.classList.add(_constants.IS_UPGRADED);
	    }
	  };
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   *
	   * Nothing to downgrade
	   *
	   MaterialExtAccordion.prototype.mdlDowngrade_ = function() {
	     'use strict';
	     console.log('***** MaterialExtAccordion.mdlDowngrade');
	   };
	   */
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtAccordion,
	    classAsString: 'MaterialExtAccordion',
	    cssClass: 'mdlext-js-accordion',
	    widget: true
	  });
	})(); /**
	       * @license
	       * Copyright 2016 Leif Olsen. All Rights Reserved.
	       *
	       * Licensed under the Apache License, Version 2.0 (the "License");
	       * you may not use this file except in compliance with the License.
	       * You may obtain a copy of the License at
	       *
	       *      http://www.apache.org/licenses/LICENSE-2.0
	       *
	       * Unless required by applicable law or agreed to in writing, software
	       * distributed under the License is distributed on an "AS IS" BASIS,
	       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	       * See the License for the specific language governing permissions and
	       * limitations under the License.
	       *
	       * This code is built with Google Material Design Lite,
	       * which is Licensed under the Apache License, Version 2.0
	       */
	
	/**
	 * A WAI-ARIA friendly accordion component.
	 * An accordion is a collection of expandable panels associated with a common outer container. Panels consist
	 * of a header and an associated content region or tabpanel. The primary use of an Accordion is to present multiple sections
	 * of content on a single page without scrolling, where all of the sections are peers in the application or object hierarchy.
	 * The general look is similar to a tree where each root tree node is an expandable accordion header. The user navigates
	 * and makes the contents of each panel visible (or not) by interacting with the Accordion Header
	 */

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _isInteger = __webpack_require__(32);
	
	var _isInteger2 = _interopRequireDefault(_isInteger);
	
	var _toConsumableArray2 = __webpack_require__(8);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _assign = __webpack_require__(33);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _intervalFunction = __webpack_require__(30);
	
	var _intervalFunction2 = _interopRequireDefault(_intervalFunction);
	
	var _easing = __webpack_require__(29);
	
	var _jsonUtils = __webpack_require__(14);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @license
	 * Copyright 2016 Leif Olsen. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * This code is built with Google Material Design Lite,
	 * which is Licensed under the Apache License, Version 2.0
	 */
	
	/**
	 * Image carousel
	 */
	
	var MDL_RIPPLE_CONTAINER = 'mdlext-carousel__slide__ripple-container';
	
	(function () {
	  'use strict';
	
	  //const CAROUSEL = 'mdlext-carousel';
	
	  var SLIDE = 'mdlext-carousel__slide';
	  var ROLE = 'list';
	  var SLIDE_ROLE = 'listitem';
	
	  /**
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	  var MaterialExtCarousel = function MaterialExtCarousel(element) {
	    // Stores the element.
	    this.element_ = element;
	
	    // Default config
	    this.config_ = {
	      interactive: true,
	      autostart: false,
	      type: 'slide',
	      interval: 1000,
	      animationLoop: (0, _intervalFunction2.default)(1000)
	    };
	
	    this.scrollAnimation_ = (0, _intervalFunction2.default)(33);
	
	    // Initialize instance.
	    this.init();
	  };
	
	  window['MaterialExtCarousel'] = MaterialExtCarousel;
	
	  /**
	   * Start slideshow animation
	   * @private
	   */
	  MaterialExtCarousel.prototype.startSlideShow_ = function () {
	    var _this = this;
	
	    var nextSlide = function nextSlide() {
	      var slide = _this.element_.querySelector('.' + SLIDE + '[aria-selected]');
	      if (slide) {
	        slide.removeAttribute('aria-selected');
	        slide = slide.nextElementSibling;
	      }
	      if (!slide) {
	        slide = _this.element_.querySelector('.' + SLIDE + ':first-child');
	        _this.animateScroll_(0);
	      }
	      if (slide) {
	        _this.moveSlideIntoViewport_(slide);
	        slide.setAttribute('aria-selected', '');
	        _this.emitSelectEvent_('next', null, slide);
	        return true;
	      }
	      return false;
	    };
	
	    var nextScroll = function nextScroll(direction) {
	      var nextDirection = direction;
	
	      if ('next' === direction && _this.element_.scrollLeft === _this.element_.scrollWidth - _this.element_.clientWidth) {
	        nextDirection = 'prev';
	      } else if (_this.element_.scrollLeft === 0) {
	        nextDirection = 'next';
	      }
	      var x = 'next' === nextDirection ? Math.min(_this.element_.scrollLeft + _this.element_.clientWidth, _this.element_.scrollWidth - _this.element_.clientWidth) : Math.max(_this.element_.scrollLeft - _this.element_.clientWidth, 0);
	
	      _this.animateScroll_(x, 1000);
	      return nextDirection;
	    };
	
	    if (!this.config_.animationLoop.started) {
	      (function () {
	        _this.config_.animationLoop.interval = _this.config_.interval;
	        var direction = 'next';
	
	        if ('scroll' === _this.config_.type) {
	          _this.config_.animationLoop.start(function () {
	            direction = nextScroll(direction);
	            return true; // It runs until cancelSlideShow_ is triggered
	          });
	        } else {
	          nextSlide();
	          _this.config_.animationLoop.start(function () {
	            return nextSlide(); // It runs until cancelSlideShow_ is triggered
	          });
	        }
	      })();
	    }
	
	    // TODO: Pause animation when carousel is not in browser viewport or user changes tab
	  };
	
	  /**
	   * Cancel slideshow if running. Emmits a 'pause' event
	   * @private
	   */
	  MaterialExtCarousel.prototype.cancelSlideShow_ = function () {
	    if (this.config_.animationLoop.started) {
	      this.config_.animationLoop.stop();
	      this.emitSelectEvent_('pause', _constants.VK_ESC, this.element_.querySelector('.' + SLIDE + '[aria-selected]'));
	    }
	  };
	
	  /**
	   * Animate scroll
	   * @param newPosition
	   * @param newDuration
	   * @param completedCallback
	   * @private
	   */
	  MaterialExtCarousel.prototype.animateScroll_ = function (newPosition, newDuration, completedCallback) {
	    var _this2 = this;
	
	    var start = this.element_.scrollLeft;
	    var distance = newPosition - start;
	
	    if (distance !== 0) {
	      (function () {
	        var duration = Math.max(Math.min(Math.abs(distance), newDuration || 400), 100); // duration is between 100 and newDuration||400ms||distance
	        var t = 0;
	        _this2.scrollAnimation_.stop();
	        _this2.scrollAnimation_.start(function (timeElapsed) {
	          t += timeElapsed;
	          if (t < duration) {
	            _this2.element_.scrollLeft = (0, _easing.inOutQuintic)(t, start, distance, duration);
	            return true;
	          } else {
	            _this2.element_.scrollLeft = newPosition;
	            if (completedCallback) {
	              completedCallback();
	            }
	            return false;
	          }
	        });
	      })();
	    } else {
	      if (completedCallback) {
	        completedCallback();
	      }
	    }
	  };
	
	  /**
	   * Execute commend
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.command_ = function (event) {
	    var _this3 = this;
	
	    var x = 0;
	    var slide = null;
	    var a = event.detail.action.toLowerCase();
	
	    // Cancel slideshow if running
	    this.cancelSlideShow_();
	
	    switch (a) {
	      case 'first':
	        slide = this.element_.querySelector('.' + SLIDE + ':first-child');
	        break;
	
	      case 'last':
	        x = this.element_.scrollWidth - this.element_.clientWidth;
	        slide = this.element_.querySelector('.' + SLIDE + ':last-child');
	        break;
	
	      case 'scroll-prev':
	        x = Math.max(this.element_.scrollLeft - this.element_.clientWidth, 0);
	        break;
	
	      case 'scroll-next':
	        x = Math.min(this.element_.scrollLeft + this.element_.clientWidth, this.element_.scrollWidth - this.element_.clientWidth);
	        break;
	
	      case 'next':
	      case 'prev':
	        slide = this.element_.querySelector('.' + SLIDE + '[aria-selected]');
	        if (slide) {
	          slide = a === 'next' ? slide.nextElementSibling : slide.previousElementSibling;
	          this.setAriaSelected_(slide);
	          this.emitSelectEvent_(a, null, slide);
	        }
	        return;
	
	      case 'play':
	        (0, _assign2.default)(this.config_, event.detail);
	        this.startSlideShow_();
	        return;
	
	      case 'pause':
	        return;
	
	      default:
	        return;
	    }
	
	    this.animateScroll_(x, undefined, function () {
	      if ('scroll-next' === a || 'scroll-prev' === a) {
	        var slides = _this3.getSlidesInViewport_();
	        if (slides.length > 0) {
	          slide = 'scroll-next' === a ? slides[0] : slides[slides.length - 1];
	        }
	      }
	      _this3.setAriaSelected_(slide);
	      _this3.emitSelectEvent_(a, null, slide);
	    });
	  };
	
	  /**
	   * Handles custom command event, 'scroll-prev', 'scroll-next', 'first', 'last', next, prev, play, pause
	   * @param event. A custom event
	   * @private
	   */
	  MaterialExtCarousel.prototype.commandHandler_ = function (event) {
	    event.preventDefault();
	    event.stopPropagation();
	    if (event.detail && event.detail.action) {
	      this.command_(event);
	    }
	  };
	
	  /**
	   * Handle keypress
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.keyDownHandler_ = function (event) {
	
	    if (event && event.target && event.target !== this.element_) {
	
	      var action = 'first';
	
	      if (event.keyCode === _constants.VK_HOME || event.keyCode === _constants.VK_END || event.keyCode === _constants.VK_PAGE_UP || event.keyCode === _constants.VK_PAGE_DOWN) {
	
	        event.preventDefault();
	        if (event.keyCode === _constants.VK_END) {
	          action = 'last';
	        } else if (event.keyCode === _constants.VK_PAGE_UP) {
	          action = 'scroll-prev';
	        } else if (event.keyCode === _constants.VK_PAGE_DOWN) {
	          action = 'scroll-next';
	        }
	
	        var cmd = new CustomEvent('select', {
	          detail: {
	            action: action
	          }
	        });
	        this.command_(cmd);
	      } else if (event.keyCode === _constants.VK_TAB || event.keyCode === _constants.VK_ENTER || event.keyCode === _constants.VK_SPACE || event.keyCode === _constants.VK_ARROW_UP || event.keyCode === _constants.VK_ARROW_LEFT || event.keyCode === _constants.VK_ARROW_DOWN || event.keyCode === _constants.VK_ARROW_RIGHT) {
	
	        var slide = getSlide_(event.target);
	
	        if (!slide) {
	          return;
	        }
	
	        // Cancel slideshow if running
	        this.cancelSlideShow_();
	
	        switch (event.keyCode) {
	          case _constants.VK_ARROW_UP:
	          case _constants.VK_ARROW_LEFT:
	            action = 'prev';
	            slide = slide.previousElementSibling;
	            break;
	
	          case _constants.VK_ARROW_DOWN:
	          case _constants.VK_ARROW_RIGHT:
	            action = 'next';
	            slide = slide.nextElementSibling;
	            break;
	
	          case _constants.VK_TAB:
	            if (event.shiftKey) {
	              action = 'prev';
	              slide = slide.previousElementSibling;
	            } else {
	              action = 'next';
	              slide = slide.nextElementSibling;
	            }
	            break;
	
	          case _constants.VK_SPACE:
	          case _constants.VK_ENTER:
	            action = 'select';
	            break;
	        }
	
	        if (slide) {
	          event.preventDefault();
	          setFocus_(slide);
	          this.emitSelectEvent_(action, event.keyCode, slide);
	        }
	      }
	    }
	  };
	
	  /**
	   * Handle dragging
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.dragHandler_ = function (event) {
	    var _this4 = this;
	
	    event.preventDefault();
	
	    // Cancel slideshow if running
	    this.cancelSlideShow_();
	
	    var updating = false;
	    var rAFDragId = 0;
	
	    var startX = event.clientX || (event.touches !== undefined ? event.touches[0].clientX : 0);
	    var prevX = startX;
	    var targetElement = event.target;
	
	    var update = function update(e) {
	      var currentX = e.clientX || (e.touches !== undefined ? e.touches[0].clientX : 0);
	      var dx = prevX - currentX;
	
	      if (dx < 0) {
	        _this4.element_.scrollLeft = Math.max(_this4.element_.scrollLeft + dx, 0);
	      } else if (dx > 0) {
	        _this4.element_.scrollLeft = Math.min(_this4.element_.scrollLeft + dx, _this4.element_.scrollWidth - _this4.element_.clientWidth);
	      }
	
	      prevX = currentX;
	      updating = false;
	    };
	
	    // drag handler
	    var drag = function drag(e) {
	      e.preventDefault();
	
	      if (!updating) {
	        rAFDragId = window.requestAnimationFrame(function () {
	          return update(e);
	        });
	        updating = true;
	      }
	    };
	
	    // end drag handler
	    var endDrag = function endDrag(e) {
	      e.preventDefault();
	
	      _this4.element_.removeEventListener('mousemove', drag);
	      _this4.element_.removeEventListener('touchmove', drag);
	      window.removeEventListener('mouseup', endDrag);
	      window.removeEventListener('touchend', endDrag);
	
	      // cancel any existing drag rAF, see: http://www.html5rocks.com/en/tutorials/speed/animations/
	      window.cancelAnimationFrame(rAFDragId);
	
	      var slide = getSlide_(targetElement);
	      setFocus_(slide);
	      _this4.emitSelectEvent_('click', null, slide);
	    };
	
	    this.element_.addEventListener('mousemove', drag);
	    this.element_.addEventListener('touchmove', drag);
	    window.addEventListener('mouseup', endDrag);
	    window.addEventListener('touchend', endDrag);
	  };
	
	  /**
	   * Handle click
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.clickHandler_ = function (event) {
	    // Click is handled by drag
	    event.preventDefault();
	  };
	
	  /**
	   * Handle focus
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.focusHandler_ = function (event) {
	    var slide = getSlide_(event.target);
	    if (slide) {
	      // The last focused/selected slide has 'aria-selected', even if focus is lost
	      this.setAriaSelected_(slide);
	      slide.classList.add(_constants.IS_FOCUSED);
	    }
	  };
	
	  /**
	   * Handle blur
	   * @param event
	   * @private
	   */
	  MaterialExtCarousel.prototype.blurHandler_ = function (event) {
	    var slide = getSlide_(event.target);
	    if (slide) {
	      slide.classList.remove(_constants.IS_FOCUSED);
	    }
	  };
	
	  /**
	   * Emits a custeom 'select' event
	   * @param command
	   * @param keyCode
	   * @param slide
	   * @private
	   */
	  MaterialExtCarousel.prototype.emitSelectEvent_ = function (command, keyCode, slide) {
	
	    if (slide) {
	      this.moveSlideIntoViewport_(slide);
	
	      var evt = new CustomEvent('select', {
	        bubbles: true,
	        cancelable: true,
	        detail: {
	          command: command,
	          keyCode: keyCode,
	          source: slide
	        }
	      });
	      this.element_.dispatchEvent(evt);
	    }
	  };
	
	  /**
	   * Get the first visible slide in component viewport
	   * @private
	   */
	  MaterialExtCarousel.prototype.getSlidesInViewport_ = function () {
	    var carouselRect = this.element_.getBoundingClientRect();
	
	    var slidesInViewport = [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + SLIDE))).filter(function (slide) {
	      var slideRect = slide.getBoundingClientRect();
	      return slideRect.left >= carouselRect.left && slideRect.right <= carouselRect.right;
	    });
	    return slidesInViewport;
	  };
	
	  /**
	   * Move slide into component viewport - if needed
	   * @param slide
	   * @private
	   */
	  MaterialExtCarousel.prototype.moveSlideIntoViewport_ = function (slide) {
	    var carouselRect = this.element_.getBoundingClientRect();
	    var slideRect = slide.getBoundingClientRect();
	
	    if (slideRect.left < carouselRect.left) {
	      var x = this.element_.scrollLeft - (carouselRect.left - slideRect.left);
	      this.animateScroll_(x);
	    } else if (slideRect.right > carouselRect.right) {
	      var _x = this.element_.scrollLeft - (carouselRect.right - slideRect.right);
	      this.animateScroll_(_x);
	    }
	  };
	
	  /**
	   * Removes 'aria-selected' from all slides in carousel
	   * @private
	   */
	  MaterialExtCarousel.prototype.setAriaSelected_ = function (slide) {
	    if (slide) {
	      [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + SLIDE + '[aria-selected]'))).forEach(function (slide) {
	        return slide.removeAttribute('aria-selected');
	      });
	      slide.setAttribute('aria-selected', '');
	    }
	  };
	
	  /**
	   * Removes event listeners
	   * @private
	   */
	  MaterialExtCarousel.prototype.removeListeners_ = function () {
	    this.element_.removeEventListener('focus', this.focusHandler_);
	    this.element_.removeEventListener('blur', this.blurHandler_);
	    this.element_.removeEventListener('keydown', this.keyDownHandler_);
	    this.element_.removeEventListener('mousedown', this.dragHandler_);
	    this.element_.removeEventListener('touchstart', this.dragHandler_);
	    this.element_.removeEventListener('click', this.clickHandler_, false);
	    this.element_.removeEventListener('command', this.commandHandler_);
	    this.element_.removeEventListener('mdl-componentdowngraded', this.mdlDowngrade_);
	  };
	
	  // Helpers
	  var getSlide_ = function getSlide_(element) {
	    return element.closest('.' + SLIDE);
	  };
	
	  var setFocus_ = function setFocus_(slide) {
	    if (slide) {
	      slide.focus();
	    }
	  };
	
	  var addRipple_ = function addRipple_(slide) {
	    if (!slide.querySelector('.' + MDL_RIPPLE_CONTAINER)) {
	      var rippleContainer = document.createElement('span');
	      rippleContainer.classList.add(MDL_RIPPLE_CONTAINER);
	      rippleContainer.classList.add(_constants.MDL_RIPPLE_EFFECT);
	      var ripple = document.createElement('span');
	      ripple.classList.add(_constants.MDL_RIPPLE);
	      rippleContainer.appendChild(ripple);
	
	      var img = slide.querySelector('img');
	      if (img) {
	        // rippleContainer blocks image title
	        rippleContainer.title = img.title;
	      }
	      slide.appendChild(rippleContainer);
	      componentHandler.upgradeElement(rippleContainer, _constants.MDL_RIPPLE_COMPONENT);
	    }
	  };
	  // End helpers
	
	
	  // Public methods.
	
	  /**
	   * Cancel animation - if running.
	   *
	   * @public
	   */
	  MaterialExtCarousel.prototype.stopAnimation = function () {
	    this.config_.animationLoop.stop();
	  };
	  MaterialExtCarousel.prototype['stopAnimation'] = MaterialExtCarousel.prototype.stopAnimation;
	
	  /**
	   * Upgrade slides
	   * Use if more list elements are added later (dynamically)
	   *
	   * @public
	   */
	  MaterialExtCarousel.prototype.upgradeSlides = function () {
	    var _this5 = this;
	
	    var hasRippleEffect = this.element_.classList.contains(_constants.MDL_RIPPLE_EFFECT);
	
	    [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + SLIDE))).forEach(function (slide) {
	
	      slide.setAttribute('role', SLIDE_ROLE);
	
	      if (_this5.config_.interactive) {
	        if (!slide.getAttribute('tabindex')) {
	          slide.setAttribute('tabindex', '0');
	        }
	        if (hasRippleEffect) {
	          addRipple_(slide);
	        }
	      } else {
	        slide.setAttribute('tabindex', '-1');
	      }
	    });
	  };
	  MaterialExtCarousel.prototype['upgradeSlides'] = MaterialExtCarousel.prototype.upgradeSlides;
	
	  /**
	   * Get config object
	   *
	   * @public
	   */
	  MaterialExtCarousel.prototype.getConfig = function () {
	    return this.config_;
	  };
	  MaterialExtCarousel.prototype['getConfig'] = MaterialExtCarousel.prototype.getConfig;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtCarousel.prototype.init = function () {
	
	    if (this.element_) {
	      // Config
	      if (this.element_.hasAttribute('data-config')) {
	        this.config_ = (0, _jsonUtils.jsonStringToObject)(this.element_.getAttribute('data-config'), this.config_);
	      }
	
	      // Wai-Aria
	      this.element_.setAttribute('role', ROLE);
	
	      // Prefer tabindex -1
	      if (!(0, _isInteger2.default)(this.element_.getAttribute('tabindex'))) {
	        this.element_.setAttribute('tabindex', -1);
	      }
	
	      // Remove listeners, just in case ...
	      this.removeListeners_();
	
	      if (this.config_.interactive) {
	
	        // Ripple
	        var hasRippleEffect = this.element_.classList.contains(_constants.MDL_RIPPLE_EFFECT);
	        if (hasRippleEffect) {
	          this.element_.classList.add(_constants.MDL_RIPPLE_EFFECT_IGNORE_EVENTS);
	        }
	
	        // Listen to focus/blur events
	        this.element_.addEventListener('focus', this.focusHandler_.bind(this), true);
	        this.element_.addEventListener('blur', this.blurHandler_.bind(this), true);
	
	        // Listen to keyboard events
	        this.element_.addEventListener('keydown', this.keyDownHandler_.bind(this), false);
	
	        // Listen to drag events
	        this.element_.addEventListener('mousedown', this.dragHandler_.bind(this), false);
	        this.element_.addEventListener('touchstart', this.dragHandler_.bind(this), false);
	
	        // Listen to click events
	        this.element_.addEventListener('click', this.clickHandler_.bind(this), false);
	      }
	
	      // Listen to custom 'command' event
	      this.element_.addEventListener('command', this.commandHandler_.bind(this), false);
	
	      // Listen to 'mdl-componentdowngraded' event
	      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
	
	      // Slides collection
	      this.upgradeSlides();
	
	      // Set upgraded flag
	      this.element_.classList.add(_constants.IS_UPGRADED);
	
	      if (this.config_.autostart) {
	        // Start slideshow
	        this.startSlideShow_();
	      }
	    }
	  };
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   */
	  MaterialExtCarousel.prototype.mdlDowngrade_ = function () {
	    'use strict';
	    //console.log('***** MaterialExtCarousel.mdlDowngrade_');
	
	    // Stop animation - if any
	
	    this.stopAnimation();
	
	    // Remove listeners
	    this.removeListeners_();
	  };
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtCarousel,
	    classAsString: 'MaterialExtCarousel',
	    cssClass: 'mdlext-js-carousel',
	    widget: true
	  });
	})();

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(22);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(23);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _constants = __webpack_require__(2);
	
	var _stringUtils = __webpack_require__(15);
	
	var _domUtils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var JS_COLLAPSIBLE = 'mdlext-js-collapsible'; /**
	                                               * @license
	                                               * Copyright 2016-2017 Leif Olsen. All Rights Reserved.
	                                               *
	                                               * Licensed under the Apache License, Version 2.0 (the "License");
	                                               * you may not use this file except in compliance with the License.
	                                               * You may obtain a copy of the License at
	                                               *
	                                               *      http://www.apache.org/licenses/LICENSE-2.0
	                                               *
	                                               * Unless required by applicable law or agreed to in writing, software
	                                               * distributed under the License is distributed on an "AS IS" BASIS,
	                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	                                               * See the License for the specific language governing permissions and
	                                               * limitations under the License.
	                                               *
	                                               * This code is built with Google Material Design Lite,
	                                               * which is Licensed under the Apache License, Version 2.0
	                                               */
	
	/**
	 * A collapsible is a component to mark expandable and collapsible regions.
	 * The component use the aria-expanded state to indicate whether regions of
	 * the content are collapsible, and to expose whether a region is currently
	 * expanded or collapsed.
	 * @see https://www.w3.org/WAI/GL/wiki/Using_the_WAI-ARIA_aria-expanded_state_to_mark_expandable_and_collapsible_regions
	 */
	
	var COLLAPSIBLE_CONTROL_CLASS = 'mdlext-collapsible';
	var COLLAPSIBLE_GROUP_CLASS = 'mdlext-collapsible-group';
	var COLLAPSIBLE_REGION_CLASS = 'mdlext-collapsible-region';
	
	/**
	 * The collapsible component
	 */
	
	var Collapsible = function () {
	
	  /**
	   * @constructor
	   * @param {HTMLElement} element The element that this component is connected to.
	   */
	  function Collapsible(element) {
	    var _this = this;
	
	    (0, _classCallCheck3.default)(this, Collapsible);
	    this.element_ = null;
	    this.controlElement_ = null;
	
	    this.keyDownHandler = function (event) {
	      if (event.keyCode === _constants.VK_ENTER || event.keyCode === _constants.VK_SPACE) {
	        event.preventDefault();
	
	        // Trigger click
	        (event.target || _this.controlElement).dispatchEvent(new MouseEvent('click', {
	          bubbles: true,
	          cancelable: true,
	          view: window
	        }));
	      }
	    };
	
	    this.clickHandler = function (event) {
	      if (!_this.isDisabled) {
	        if (event.target !== _this.controlElement) {
	          // Do not toggle if a focusable element inside the control element triggered the event
	          var p = (0, _domUtils.getParentElements)(event.target, _this.controlElement);
	          p.push(event.target);
	          if (p.find(function (el) {
	            return (0, _domUtils.isFocusable)(el);
	          })) {
	            return;
	          }
	        }
	        _this.toggle();
	      }
	    };
	
	    this.element_ = element;
	    this.init();
	  }
	
	  (0, _createClass3.default)(Collapsible, [{
	    key: 'collapse',
	    value: function collapse() {
	      if (!this.isDisabled && this.isExpanded) {
	        if (this.dispatchToggleEvent('collapse')) {
	          this.controlElement.setAttribute('aria-expanded', 'false');
	          var regions = this.regionElements.slice(0);
	          for (var i = regions.length - 1; i >= 0; --i) {
	            regions[i].setAttribute('hidden', '');
	          }
	        }
	      }
	    }
	  }, {
	    key: 'expand',
	    value: function expand() {
	      if (!this.isDisabled && !this.isExpanded) {
	        if (this.dispatchToggleEvent('expand')) {
	          this.controlElement.setAttribute('aria-expanded', 'true');
	          this.regionElements.forEach(function (region) {
	            return region.removeAttribute('hidden');
	          });
	        }
	      }
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      if (this.isExpanded) {
	        this.collapse();
	      } else {
	        this.expand();
	      }
	    }
	  }, {
	    key: 'dispatchToggleEvent',
	    value: function dispatchToggleEvent(action) {
	      return this.element.dispatchEvent(new CustomEvent('toggle', {
	        bubbles: true,
	        cancelable: true,
	        detail: {
	          action: action
	        }
	      }));
	    }
	  }, {
	    key: 'disableToggle',
	    value: function disableToggle() {
	      this.controlElement.setAttribute('aria-disabled', true);
	    }
	  }, {
	    key: 'enableToggle',
	    value: function enableToggle() {
	      this.controlElement.removeAttribute('aria-disabled');
	    }
	  }, {
	    key: 'addRegionId',
	    value: function addRegionId(regionId) {
	      var ids = this.regionIds;
	      if (!ids.find(function (id) {
	        return regionId === id;
	      })) {
	        ids.push(regionId);
	        this.controlElement.setAttribute('aria-controls', ids.join(' '));
	      }
	    }
	  }, {
	    key: 'addRegionElement',
	    value: function addRegionElement(region) {
	      if (!(region.classList.contains(COLLAPSIBLE_GROUP_CLASS) || region.classList.contains(COLLAPSIBLE_REGION_CLASS))) {
	        region.classList.add(COLLAPSIBLE_GROUP_CLASS);
	      }
	
	      if (!region.hasAttribute('role')) {
	        var role = region.classList.contains(COLLAPSIBLE_GROUP_CLASS) ? 'group' : 'region';
	        region.setAttribute('role', role);
	      }
	
	      if (!region.hasAttribute('id')) {
	        region.id = region.getAttribute('role') + '-' + (0, _stringUtils.randomString)();
	      }
	
	      if (this.isExpanded) {
	        region.removeAttribute('hidden');
	      } else {
	        region.setAttribute('hidden', '');
	      }
	      this.addRegionId(region.id);
	    }
	  }, {
	    key: 'removeRegionElement',
	    value: function removeRegionElement(region) {
	      if (region && region.id) {
	        var ids = this.regionIds.filter(function (id) {
	          return id === region.id;
	        });
	        this.controlElement.setAttribute('aria-controls', ids.join(' '));
	      }
	    }
	  }, {
	    key: 'removeListeners',
	    value: function removeListeners() {
	      this.controlElement.removeEventListener('keydown', this.keyDownHandler);
	      this.controlElement.removeEventListener('click', this.clickHandler);
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this2 = this;
	
	      var initControl = function initControl() {
	        // Find the button element
	        _this2.controlElement_ = _this2.element.querySelector('.' + COLLAPSIBLE_CONTROL_CLASS) || _this2.element;
	
	        // Add "aria-expanded" attribute if not present
	        if (!_this2.controlElement.hasAttribute('aria-expanded')) {
	          _this2.controlElement.setAttribute('aria-expanded', 'false');
	        }
	
	        // Add role=button if control != <button>
	        if (_this2.controlElement.nodeName.toLowerCase() !== 'button') {
	          _this2.controlElement.setAttribute('role', 'button');
	        }
	
	        // Add tabindex
	        if (!(0, _domUtils.isFocusable)(_this2.controlElement) && !_this2.controlElement.hasAttribute('tabindex')) {
	          _this2.controlElement.setAttribute('tabindex', '0');
	        }
	      };
	
	      var initRegions = function initRegions() {
	        var regions = [];
	        if (!_this2.controlElement.hasAttribute('aria-controls')) {
	          // Add siblings as collapsible region(s)
	          var r = _this2.element.nextElementSibling;
	          while (r) {
	            if (r.classList.contains(COLLAPSIBLE_GROUP_CLASS) || r.classList.contains(COLLAPSIBLE_REGION_CLASS)) {
	              regions.push(r);
	            } else if (r.classList.contains(JS_COLLAPSIBLE)) {
	              // A new collapsible component
	              break;
	            }
	            r = r.nextElementSibling;
	          }
	        } else {
	          regions = _this2.regionElements;
	        }
	        regions.forEach(function (region) {
	          return _this2.addRegionElement(region);
	        });
	      };
	
	      var addListeners = function addListeners() {
	        _this2.controlElement.addEventListener('keydown', _this2.keyDownHandler);
	        _this2.controlElement.addEventListener('click', _this2.clickHandler);
	      };
	
	      initControl();
	      initRegions();
	      this.removeListeners();
	      addListeners();
	    }
	  }, {
	    key: 'downgrade',
	    value: function downgrade() {
	      this.removeListeners();
	    }
	  }, {
	    key: 'element',
	    get: function get() {
	      return this.element_;
	    }
	  }, {
	    key: 'controlElement',
	    get: function get() {
	      return this.controlElement_;
	    }
	  }, {
	    key: 'isDisabled',
	    get: function get() {
	      return this.controlElement.hasAttribute('disabled') && this.controlElement.getAttribute('disabled').toLowerCase() !== 'false' || this.controlElement.hasAttribute('aria-disabled') && this.controlElement.getAttribute('aria-disabled').toLowerCase() !== 'false';
	    }
	  }, {
	    key: 'isExpanded',
	    get: function get() {
	      return this.controlElement.hasAttribute('aria-expanded') && this.controlElement.getAttribute('aria-expanded').toLowerCase() === 'true';
	    }
	  }, {
	    key: 'regionIds',
	    get: function get() {
	      return this.controlElement.hasAttribute('aria-controls') ? this.controlElement.getAttribute('aria-controls').split(' ') : [];
	    }
	  }, {
	    key: 'regionElements',
	    get: function get() {
	      return this.regionIds.map(function (id) {
	        return document.querySelector('#' + id);
	      }).filter(function (el) {
	        return el != null;
	      });
	    }
	  }]);
	  return Collapsible;
	}();
	
	(function () {
	  'use strict';
	
	  /**
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	
	  var MaterialExtCollapsible = function MaterialExtCollapsible(element) {
	    this.element_ = element;
	    this.collapsible = null;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtCollapsible'] = MaterialExtCollapsible;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtCollapsible.prototype.init = function () {
	    if (this.element_) {
	      this.collapsible = new Collapsible(this.element_);
	      this.element_.classList.add(_constants.IS_UPGRADED);
	
	      // Listen to 'mdl-componentdowngraded' event
	      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
	    }
	  };
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   */
	  MaterialExtCollapsible.prototype.mdlDowngrade_ = function () {
	    this.collapsible.downgrade();
	  };
	
	  // Public methods.
	
	  /**
	   * Get control element.
	   * @return {HTMLElement} element The element that controls the collapsible region.
	   * @public
	   */
	  MaterialExtCollapsible.prototype.getControlElement = function () {
	    return this.collapsible.controlElement;
	  };
	  MaterialExtCollapsible.prototype['getControlElement'] = MaterialExtCollapsible.prototype.getControlElement;
	
	  /**
	   * Get region elements controlled by this collapsible
	   * @returns {Array<HTMLElement>} the collapsible region elements
	   * @public
	   */
	  MaterialExtCollapsible.prototype.getRegionElements = function () {
	    return this.collapsible.regionElements;
	  };
	  MaterialExtCollapsible.prototype['getRegionElements'] = MaterialExtCollapsible.prototype.getRegionElements;
	
	  /**
	   * Add region elements.
	   * @param {Array<HTMLElement>} elements The element that will be upgraded.
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.addRegionElements = function () {
	    var _this3 = this;
	
	    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
	      elements[_key] = arguments[_key];
	    }
	
	    elements.forEach(function (element) {
	      return _this3.collapsible.addRegionElement(element);
	    });
	  };
	  MaterialExtCollapsible.prototype['addRegionElements'] = MaterialExtCollapsible.prototype.addRegionElements;
	
	  /**
	   * Remove collapsible region(s) from component.
	   * Note: This operation does not delete the element from the DOM tree.
	   * @param {Array<HTMLElement>} elements The element that will be upgraded.
	   * @public
	   */
	  MaterialExtCollapsible.prototype.removeRegionElements = function () {
	    var _this4 = this;
	
	    for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      elements[_key2] = arguments[_key2];
	    }
	
	    elements.forEach(function (element) {
	      return _this4.collapsible.removeRegionElement(element);
	    });
	  };
	  MaterialExtCollapsible.prototype['removeRegionElements'] = MaterialExtCollapsible.prototype.removeRegionElements;
	
	  /**
	   * Expand collapsible region(s)
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.expand = function () {
	    this.collapsible.expand();
	  };
	  MaterialExtCollapsible.prototype['expand'] = MaterialExtCollapsible.prototype.expand;
	
	  /**
	   * Collapse collapsible region(s)
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.collapse = function () {
	    this.collapsible.collapse();
	  };
	  MaterialExtCollapsible.prototype['collapse'] = MaterialExtCollapsible.prototype.collapse;
	
	  /**
	   * Toggle collapsible region(s)
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.toggle = function () {
	    this.collapsible.toggle();
	  };
	  MaterialExtCollapsible.prototype['toggle'] = MaterialExtCollapsible.prototype.toggle;
	
	  /**
	   * Check whether component has aria-expanded state true
	   * @return {Boolean} true if aria-expanded="true", otherwise false
	   */
	  MaterialExtCollapsible.prototype.isExpanded = function () {
	    return this.collapsible.isExpanded;
	  };
	  MaterialExtCollapsible.prototype['isExpanded'] = MaterialExtCollapsible.prototype.isExpanded;
	
	  /**
	   * Check whether component has aria-disabled state set to true
	   * @return {Boolean} true if aria-disabled="true", otherwise false
	   */
	  MaterialExtCollapsible.prototype.isDisabled = function () {
	    return this.collapsible.isDisabled;
	  };
	  MaterialExtCollapsible.prototype['isDisabled'] = MaterialExtCollapsible.prototype.isDisabled;
	
	  /**
	   * Disables toggling of collapsible region(s)
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.disableToggle = function () {
	    this.collapsible.disableToggle();
	  };
	  MaterialExtCollapsible.prototype['disableToggle'] = MaterialExtCollapsible.prototype.disableToggle;
	
	  /**
	   * Enables toggling of collapsible region(s)
	   * @return {void}
	   * @public
	   */
	  MaterialExtCollapsible.prototype.enableToggle = function () {
	    this.collapsible.enableToggle();
	  };
	  MaterialExtCollapsible.prototype['enableToggle'] = MaterialExtCollapsible.prototype.enableToggle;
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtCollapsible,
	    classAsString: 'MaterialExtCollapsible',
	    cssClass: JS_COLLAPSIBLE,
	    widget: true
	  });
	})();

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(22);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(23);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _class, _temp; /**
	                    * @license
	                    * Copyright 2016-2017 Leif Olsen. All Rights Reserved.
	                    *
	                    * Licensed under the Apache License, Version 2.0 (the "License");
	                    * you may not use this file except in compliance with the License.
	                    * You may obtain a copy of the License at
	                    *
	                    *      http://www.apache.org/licenses/LICENSE-2.0
	                    *
	                    * Unless required by applicable law or agreed to in writing, software
	                    * distributed under the License is distributed on an "AS IS" BASIS,
	                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	                    * See the License for the specific language governing permissions and
	                    * limitations under the License.
	                    *
	                    * This code is built with Google Material Design Lite,
	                    * which is Licensed under the Apache License, Version 2.0
	                    */
	
	var _jsonUtils = __webpack_require__(14);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var JS_FORMAT_FIELD = 'mdlext-js-formatfield';
	var FORMAT_FIELD_COMPONENT = 'MaterialExtFormatfield';
	
	/**
	 * Detect browser locale
	 * @returns {string} the locale
	 * @see http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
	 */
	var browserLanguage = function browserLanguage() {
	  return navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage;
	};
	
	/**
	 * The formatfield  formats an input field  using language sensitive number formatting.
	 */
	
	var FormatField = (_temp = _class = function () {
	  function FormatField(element) {
	    var _this = this;
	
	    (0, _classCallCheck3.default)(this, FormatField);
	    this.options_ = {};
	
	    this.clickHandler = function () {
	      clearTimeout(FormatField.timer);
	    };
	
	    this.focusInHandler = function () {
	      if (!(_this.input.readOnly || _this.input.disabled)) {
	        _this.input.value = _this.unformatInput();
	        //setTimeout(() => this.input.setSelectionRange(0, this.input.value.length), 20);
	        FormatField.timer = setTimeout(function () {
	          return _this.input.select();
	        }, 200);
	      }
	    };
	
	    this.focusOutHandler = function () {
	      clearTimeout(FormatField.timer);
	
	      if (!(_this.input.readOnly || _this.input.disabled)) {
	        _this.formatValue();
	      }
	    };
	
	    this.element_ = element;
	    this.init();
	  }
	
	  (0, _createClass3.default)(FormatField, [{
	    key: 'stripSeparatorsFromValue',
	    value: function stripSeparatorsFromValue() {
	      var _this2 = this;
	
	      var doReplace = function doReplace() {
	        return _this2.input.value.replace(/\s/g, '').replace(new RegExp(_this2.options.groupSeparator, 'g'), '').replace(_this2.options.decimalSeparator, '.');
	      };
	      //.replace(this.intlGroupSeparator_, ''),
	      //.replace(this.intlDecimalSeparator_, '.');
	
	      return this.input.value ? doReplace() : this.input.value;
	    }
	  }, {
	    key: 'fixSeparators',
	    value: function fixSeparators(value) {
	      var _this3 = this;
	
	      var doReplace = function doReplace() {
	        return value.replace(new RegExp(_this3.intlGroupSeparator_, 'g'), _this3.options.groupSeparator).replace(_this3.intlDecimalSeparator_, _this3.options.decimalSeparator);
	      };
	
	      return value ? doReplace() : value;
	    }
	  }, {
	    key: 'formatValue',
	    value: function formatValue() {
	      if (this.input.value) {
	        var v = new Intl.NumberFormat(this.options.locales, this.options).format(this.stripSeparatorsFromValue());
	
	        if ('NaN' !== v) {
	          this.input.value = this.fixSeparators(v);
	        }
	      }
	    }
	  }, {
	    key: 'unformat',
	    value: function unformat() {
	      var _this4 = this;
	
	      var doReplace = function doReplace() {
	        return _this4.input.value.replace(/\s/g, '').replace(new RegExp(_this4.options.groupSeparator, 'g'), '').replace(_this4.options.decimalSeparator, '.');
	      };
	
	      return this.input.value ? doReplace() : this.input.value;
	    }
	  }, {
	    key: 'unformatInput',
	    value: function unformatInput() {
	      var _this5 = this;
	
	      var doReplace = function doReplace() {
	        return _this5.input.value.replace(/\s/g, '').replace(new RegExp(_this5.options.groupSeparator, 'g'), '');
	      };
	
	      return this.input.value ? doReplace() : this.input.value;
	    }
	  }, {
	    key: 'removeListeners',
	    value: function removeListeners() {
	      this.input.removeEventListener('click', this.clickHandler);
	      this.input.removeEventListener('focusin', this.focusInHandler);
	      this.input.removeEventListener('focusout', this.focusOutHandler);
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this6 = this;
	
	      var addListeners = function addListeners() {
	        _this6.input.addEventListener('click', _this6.clickHandler);
	        _this6.input.addEventListener('focusin', _this6.focusInHandler);
	        _this6.input.addEventListener('focusout', _this6.focusOutHandler);
	      };
	
	      var addOptions = function addOptions() {
	        var opts = _this6.element.getAttribute('data-formatfield-options') || _this6.input.getAttribute('data-formatfield-options');
	        if (opts) {
	          _this6.options_ = (0, _jsonUtils.jsonStringToObject)(opts, _this6.options);
	        }
	      };
	
	      var addLocale = function addLocale() {
	        if (!_this6.options.locales) {
	          _this6.options.locales = browserLanguage() || 'en-US'; //'nb-NO', //'en-US',
	        }
	      };
	
	      var addGrouping = function addGrouping() {
	        var s = 1234.5.toLocaleString(_this6.options.locales, {
	          style: 'decimal',
	          useGrouping: true,
	          minimumFractionDigits: 1,
	          maximumFractionDigits: 1
	        });
	
	        _this6.intlGroupSeparator_ = s.charAt(1);
	        _this6.intlDecimalSeparator_ = s.charAt(s.length - 2);
	        _this6.options.groupSeparator = _this6.options.groupSeparator || _this6.intlGroupSeparator_;
	        _this6.options.decimalSeparator = _this6.options.decimalSeparator || _this6.intlDecimalSeparator_;
	
	        if (_this6.options.groupSeparator === _this6.options.decimalSeparator) {
	          var e = 'Error! options.groupSeparator, "' + _this6.options.groupSeparator + '" ' + 'and options.decimalSeparator, ' + ('"' + _this6.options.decimalSeparator + '" should not be equal');
	          throw new Error(e);
	        }
	      };
	
	      this.input_ = this.element.querySelector('input') || this.element;
	
	      addOptions();
	      addLocale();
	      addGrouping();
	      this.formatValue();
	      addListeners();
	    }
	  }, {
	    key: 'downgrade',
	    value: function downgrade() {
	      this.removeListeners();
	    }
	  }, {
	    key: 'element',
	    get: function get() {
	      return this.element_;
	    }
	  }, {
	    key: 'input',
	    get: function get() {
	      return this.input_;
	    }
	  }, {
	    key: 'options',
	    get: function get() {
	      return this.options_;
	    }
	  }]);
	  return FormatField;
	}(), _class.timer = null, _temp);
	
	
	(function () {
	  'use strict';
	
	  /**
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	
	  var MaterialExtFormatfield = function MaterialExtFormatfield(element) {
	    this.element_ = element;
	    this.formatField_ = null;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtFormatfield'] = MaterialExtFormatfield;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtFormatfield.prototype.init = function () {
	    if (this.element_) {
	      this.element_.classList.add(_constants.IS_UPGRADED);
	      this.formatField_ = new FormatField(this.element_);
	
	      // Listen to 'mdl-componentdowngraded' event
	      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
	    }
	  };
	
	  /**
	   * Get options object
	   *
	   * @public
	   *
	   * @returns {Object} the options object
	   */
	  MaterialExtFormatfield.prototype.getOptions = function () {
	    return this.formatField_.options;
	  };
	  MaterialExtFormatfield.prototype['getOptions'] = MaterialExtFormatfield.prototype.getOptions;
	
	  /**
	   * A unformatted value is a string value where the locale specific decimal separator
	   * is replaced with a '.' separator and group separators are stripped.
	   * The returned value is suitable for parsing to a JavaScript numerical value.
	   *
	   * @example
	   * input.value = '1 234,5';
	   * inputElement.MaterialExtFormatfield.getUnformattedValue();
	   * // Returns '1234.5'
	   *
	   * @public
	   *
	   * @returns {String} the unformatted value
	   */
	  MaterialExtFormatfield.prototype.getUnformattedValue = function () {
	    return this.formatField_.unformat();
	  };
	  MaterialExtFormatfield.prototype['getUnformattedValue'] = MaterialExtFormatfield.prototype.getUnformattedValue;
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   */
	  MaterialExtFormatfield.prototype.mdlDowngrade_ = function () {
	    this.formatField_.downgrade();
	  };
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtFormatfield,
	    classAsString: FORMAT_FIELD_COMPONENT,
	    cssClass: JS_FORMAT_FIELD,
	    widget: true
	  });
	})();

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(59);
	
	__webpack_require__(49);
	
	__webpack_require__(51);
	
	__webpack_require__(50);
	
	__webpack_require__(54);
	
	__webpack_require__(55);
	
	__webpack_require__(56);
	
	__webpack_require__(57);
	
	__webpack_require__(52);
	
	__webpack_require__(58);

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray2 = __webpack_require__(8);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MDL_RIPPLE_CONTAINER = 'mdlext-lightboard__slide__ripple-container'; /**
	                                                                          * @license
	                                                                          * Copyright 2016 Leif Olsen. All Rights Reserved.
	                                                                          *
	                                                                          * Licensed under the Apache License, Version 2.0 (the "License");
	                                                                          * you may not use this file except in compliance with the License.
	                                                                          * You may obtain a copy of the License at
	                                                                          *
	                                                                          *      http://www.apache.org/licenses/LICENSE-2.0
	                                                                          *
	                                                                          * Unless required by applicable law or agreed to in writing, software
	                                                                          * distributed under the License is distributed on an "AS IS" BASIS,
	                                                                          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	                                                                          * See the License for the specific language governing permissions and
	                                                                          * limitations under the License.
	                                                                          *
	                                                                          * This code is built with Google Material Design Lite,
	                                                                          * which is Licensed under the Apache License, Version 2.0
	                                                                          */
	
	/**
	 * A lightboard is a translucent surface illuminated from behind, used for situations
	 * where a shape laid upon the surface needs to be seen with high contrast. In the "old days" of photography
	 * photograpers used a lightboard to get a quick view of their slides. The goal is to create a responsive lightbox
	 * design, based on flex layout, similar to what is used in Adobe LightRoom to browse images.
	 */
	
	(function () {
	  'use strict';
	
	  //const LIGHTBOARD = 'mdlext-lightboard';
	
	  var LIGHTBOARD_ROLE = 'grid';
	  var SLIDE = 'mdlext-lightboard__slide';
	  var SLIDE_ROLE = 'gridcell';
	  var SLIDE_TABSTOP = 'mdlext-lightboard__slide__frame';
	  /**
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	  var MaterialExtLightboard = function MaterialExtLightboard(element) {
	    // Stores the element.
	    this.element_ = element;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtLightboard'] = MaterialExtLightboard;
	
	  // Helpers
	  var getSlide = function getSlide(element) {
	    return element ? element.closest('.' + SLIDE) : null;
	  };
	
	  // Private methods.
	
	  /**
	   * Select a slide, i.e. set aria-selected="true"
	   * @param element
	   * @private
	   */
	  MaterialExtLightboard.prototype.selectSlide_ = function (element) {
	    var slide = getSlide(element);
	    if (slide && !slide.hasAttribute('aria-selected')) {
	      [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + SLIDE + '[aria-selected="true"]'))).forEach(function (selectedSlide) {
	        return selectedSlide.removeAttribute('aria-selected');
	      });
	
	      slide.setAttribute('aria-selected', 'true');
	    }
	  };
	
	  /**
	   * Dispatch select event
	   * @param {Element} slide The slide that caused the event
	   * @private
	   */
	  MaterialExtLightboard.prototype.dispatchSelectEvent_ = function (slide) {
	    this.element_.dispatchEvent(new CustomEvent('select', {
	      bubbles: true,
	      cancelable: true,
	      detail: { source: slide }
	    }));
	  };
	
	  /**
	   * Handles custom command event, 'first', 'next', 'prev', 'last', 'select' or upgrade
	   * @param event. A custom event
	   * @private
	   */
	  MaterialExtLightboard.prototype.commandHandler_ = function (event) {
	    event.preventDefault();
	    event.stopPropagation();
	
	    if (event && event.detail) {
	      this.command(event.detail);
	    }
	  };
	
	  // Public methods
	
	  /**
	   * Initialize lightboard slides
	   * @public
	   */
	  MaterialExtLightboard.prototype.upgradeSlides = function () {
	
	    var addRipple = function addRipple(slide) {
	      // Use slide frame as ripple container
	      if (!slide.querySelector('.' + MDL_RIPPLE_CONTAINER)) {
	        var a = slide.querySelector('.' + SLIDE_TABSTOP);
	        if (a) {
	          var rippleContainer = a;
	          rippleContainer.classList.add(MDL_RIPPLE_CONTAINER);
	          rippleContainer.classList.add(_constants.MDL_RIPPLE_EFFECT);
	          var ripple = document.createElement('span');
	          ripple.classList.add(_constants.MDL_RIPPLE);
	          rippleContainer.appendChild(ripple);
	          componentHandler.upgradeElement(rippleContainer, _constants.MDL_RIPPLE_COMPONENT);
	        }
	      }
	    };
	
	    var hasRippleEffect = this.element_.classList.contains(_constants.MDL_RIPPLE_EFFECT);
	
	    [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + SLIDE))).forEach(function (slide) {
	
	      slide.setAttribute('role', SLIDE_ROLE);
	
	      if (!slide.querySelector('a')) {
	        slide.setAttribute('tabindex', '0');
	      }
	      if (hasRippleEffect) {
	        addRipple(slide);
	      }
	    });
	  };
	  MaterialExtLightboard.prototype['upgradeSlides'] = MaterialExtLightboard.prototype.upgradeSlides;
	
	  /**
	   * Execute command
	   * @param detail
	   * @public
	   */
	  MaterialExtLightboard.prototype.command = function (detail) {
	    var _this = this;
	
	    var firstSlide = function firstSlide() {
	      return _this.element_.querySelector('.' + SLIDE + ':first-child');
	    };
	
	    var lastSlide = function lastSlide() {
	      return _this.element_.querySelector('.' + SLIDE + ':last-child');
	    };
	
	    var nextSlide = function nextSlide() {
	      var slide = _this.element_.querySelector('.' + SLIDE + '[aria-selected="true"]').nextElementSibling;
	      return slide ? slide : firstSlide();
	    };
	
	    var prevSlide = function prevSlide() {
	      var slide = _this.element_.querySelector('.' + SLIDE + '[aria-selected="true"]').previousElementSibling;
	      return slide ? slide : lastSlide();
	    };
	
	    if (detail && detail.action) {
	      var action = detail.action,
	          target = detail.target;
	
	
	      var slide = void 0;
	      switch (action.toLowerCase()) {
	        case 'select':
	          slide = getSlide(target);
	          this.dispatchSelectEvent_(slide);
	          break;
	        case 'first':
	          slide = firstSlide();
	          break;
	        case 'next':
	          slide = nextSlide();
	          break;
	        case 'prev':
	          slide = prevSlide();
	          break;
	        case 'last':
	          slide = lastSlide();
	          break;
	        case 'upgrade':
	          this.upgradeSlides();
	          break;
	        default:
	          throw new Error('Unknown action "' + action + '". Action must be one of "first", "next", "prev", "last", "select" or "upgrade"');
	      }
	
	      if (slide) {
	        var a = slide.querySelector('a');
	        if (a) {
	          a.focus();
	        } else {
	          slide.focus();
	        }
	
	        // Workaround for JSDom testing:
	        // In JsDom 'element.focus()' does not trigger any focus event
	        if (!slide.hasAttribute('aria-selected')) {
	          this.selectSlide_(slide);
	        }
	      }
	    }
	  };
	  MaterialExtLightboard.prototype['command'] = MaterialExtLightboard.prototype.command;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtLightboard.prototype.init = function () {
	    var _this2 = this;
	
	    var keydownHandler = function keydownHandler(event) {
	
	      if (event.target !== _this2.element_) {
	        var action = void 0;
	        var target = void 0;
	        switch (event.keyCode) {
	          case _constants.VK_HOME:
	            action = 'first';
	            break;
	          case _constants.VK_END:
	            action = 'last';
	            break;
	          case _constants.VK_ARROW_UP:
	          case _constants.VK_ARROW_LEFT:
	            action = 'prev';
	            break;
	          case _constants.VK_ARROW_DOWN:
	          case _constants.VK_ARROW_RIGHT:
	            action = 'next';
	            break;
	          case _constants.VK_ENTER:
	          case _constants.VK_SPACE:
	            action = 'select';
	            target = event.target;
	            break;
	        }
	        if (action) {
	          event.preventDefault();
	          event.stopPropagation();
	          _this2.command({ action: action, target: target });
	        }
	      }
	    };
	
	    var clickHandler = function clickHandler(event) {
	      event.preventDefault();
	      event.stopPropagation();
	
	      if (event.target !== _this2.element_) {
	        _this2.command({ action: 'select', target: event.target });
	      }
	    };
	
	    var focusHandler = function focusHandler(event) {
	      event.preventDefault();
	      event.stopPropagation();
	
	      if (event.target !== _this2.element_) {
	        _this2.selectSlide_(event.target);
	      }
	    };
	
	    if (this.element_) {
	      this.element_.setAttribute('role', LIGHTBOARD_ROLE);
	
	      if (this.element_.classList.contains(_constants.MDL_RIPPLE_EFFECT)) {
	        this.element_.classList.add(_constants.MDL_RIPPLE_EFFECT_IGNORE_EVENTS);
	      }
	
	      // Remove listeners, just in case ...
	      this.element_.removeEventListener('command', this.commandHandler_);
	      this.element_.removeEventListener('keydown', keydownHandler);
	      this.element_.removeEventListener('click', clickHandler);
	      this.element_.removeEventListener('focus', focusHandler);
	
	      this.element_.addEventListener('command', this.commandHandler_.bind(this), false);
	      this.element_.addEventListener('keydown', keydownHandler, true);
	      this.element_.addEventListener('click', clickHandler, true);
	      this.element_.addEventListener('focus', focusHandler, true);
	
	      this.upgradeSlides();
	
	      this.element_.classList.add(_constants.IS_UPGRADED);
	    }
	  };
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  /* jshint undef:false */
	  componentHandler.register({
	    constructor: MaterialExtLightboard,
	    classAsString: 'MaterialExtLightboard',
	    cssClass: 'mdlext-js-lightboard',
	    widget: true
	  });
	})();

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray2 = __webpack_require__(8);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _isInteger = __webpack_require__(32);
	
	var _isInteger2 = _interopRequireDefault(_isInteger);
	
	var _slicedToArray2 = __webpack_require__(67);
	
	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);
	
	var _entries = __webpack_require__(64);
	
	var _entries2 = _interopRequireDefault(_entries);
	
	var _getIterator2 = __webpack_require__(31);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _fullThrottle = __webpack_require__(13);
	
	var _fullThrottle2 = _interopRequireDefault(_fullThrottle);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @license
	 * Copyright 2016 Leif Olsen. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * This code is built with Google Material Design Lite,
	 * which is Licensed under the Apache License, Version 2.0
	 */
	
	/**
	 * Responsive Lightbox
	 */
	
	(function () {
	  'use strict';
	
	  var LIGHTBOX = 'mdlext-lightbox';
	  var LIGHTBOX_SLIDER = 'mdlext-lightbox__slider';
	  var LIGHTBOX_SLIDER_SLIDE = 'mdlext-lightbox__slider__slide';
	  var STICKY_FOOTER = 'mdlext-lightbox--sticky-footer';
	  var BUTTON = 'mdl-button';
	
	  /**
	   * https://github.com/google/material-design-lite/issues/4205
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	  var MaterialExtLightbox = function MaterialExtLightbox(element) {
	    // Stores the element.
	    this.element_ = element;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtLightbox'] = MaterialExtLightbox;
	
	  /**
	   * Handle keypress
	   * @param event
	   * @private
	   */
	  MaterialExtLightbox.prototype.keyDownHandler_ = function (event) {
	
	    if (event) {
	      if (event.keyCode === _constants.VK_ESC || event.keyCode === _constants.VK_SPACE || event.keyCode === _constants.VK_END || event.keyCode === _constants.VK_HOME || event.keyCode === _constants.VK_ARROW_UP || event.keyCode === _constants.VK_ARROW_LEFT || event.keyCode === _constants.VK_ARROW_DOWN || event.keyCode === _constants.VK_ARROW_RIGHT) {
	
	        if (event.keyCode !== _constants.VK_ESC) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	
	        var action = 'first';
	        if (event.keyCode === _constants.VK_END) {
	          action = 'last';
	        } else if (event.keyCode === _constants.VK_ARROW_UP || event.keyCode === _constants.VK_ARROW_LEFT) {
	          action = 'prev';
	        } else if (event.keyCode === _constants.VK_ARROW_DOWN || event.keyCode === _constants.VK_ARROW_RIGHT) {
	          action = 'next';
	        } else if (event.keyCode === _constants.VK_SPACE) {
	          action = 'select';
	        } else if (event.keyCode === _constants.VK_ESC) {
	          action = 'cancel';
	        }
	
	        dispatchAction_(action, this);
	      }
	    }
	  };
	
	  /**
	   * Handle button clicks
	   * @param event
	   * @private
	   */
	  MaterialExtLightbox.prototype.buttonClickHandler_ = function (event) {
	
	    if (event) {
	      event.preventDefault();
	      event.stopPropagation();
	
	      dispatchAction_(this.getAttribute('data-action') || '', this);
	
	      var n = this.closest('.' + LIGHTBOX);
	      if (n) {
	        n.focus();
	      }
	    }
	  };
	
	  /**
	   * Dispatches an action custom event
	   * @param action
	   * @param source
	   * @param target
	   * @private
	   */
	  var dispatchAction_ = function dispatchAction_(action, source) {
	    var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : source;
	
	
	    target.dispatchEvent(new CustomEvent('action', {
	      bubbles: true,
	      cancelable: true,
	      detail: {
	        action: action || '',
	        source: source
	      }
	    }));
	  };
	
	  /**
	   * Reposition dialog if component parent element is "DIALOG"
	   * @param lightboxElement
	   * @private
	   */
	  var repositionDialog_ = function repositionDialog_(lightboxElement) {
	    var footerHeight = function footerHeight(footer, isSticky) {
	      return isSticky && footer ? footer.offsetHeight : 0;
	    };
	
	    var reposition = function reposition(dialog, fh) {
	      if (window.getComputedStyle(dialog).position === 'absolute') {
	        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	        var topValue = scrollTop + (window.innerHeight - dialog.offsetHeight - fh) / 2;
	        dialog.style.top = Math.max(scrollTop, topValue) + 'px';
	      }
	    };
	
	    var p = lightboxElement.parentNode;
	    var dialog = p && p.nodeName === 'DIALOG' ? p : null;
	
	    if (dialog && dialog.hasAttribute('open')) {
	      lightboxElement.style.width = 'auto';
	      lightboxElement.style.maxWidth = '100%';
	      var img = lightboxElement.querySelector('img');
	      if (img) {
	        lightboxElement.style.maxWidth = img.naturalWidth !== undefined ? img.naturalWidth + 'px' : img.width + 'px' || '100%';
	      }
	
	      var fh = footerHeight(lightboxElement.querySelector('footer'), lightboxElement.classList.contains(STICKY_FOOTER));
	      var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - fh;
	      if (dialog.offsetHeight > vh) {
	        var n = 0;
	        while (dialog.offsetHeight > vh && ++n < 4) {
	          lightboxElement.style.width = lightboxElement.offsetWidth * vh / lightboxElement.offsetHeight + 'px';
	        }
	      }
	      reposition(dialog, fh);
	    }
	  };
	
	  /**
	   * Handle image load
	   * @param event
	   * @private
	   */
	
	  MaterialExtLightbox.prototype.imgLoadHandler_ = function () /*event*/{
	    repositionDialog_(this);
	  };
	
	  /**
	   * Handle image drag
	   * @param event
	   * @private
	     */
	  MaterialExtLightbox.prototype.imgDragHandler_ = function (event) {
	
	    var setStyles = function setStyles(element, properties) {
	      //noinspection JSAnnotator
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(properties)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
	              key = _step$value[0],
	              value = _step$value[1];
	
	          element.style[key] = value;
	        }
	        // ... or:
	        //for (const key in properties) {
	        //  element.style[key] = properties[key];
	        //}
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    };
	
	    event.preventDefault();
	    //event.stopPropagation();
	
	    var x = event.clientX || (event.touches !== undefined ? event.touches[0].clientX : 0);
	
	    var img = this;
	    img.style.opacity = '0.2';
	
	    var slider = document.createElement('div');
	    slider.classList.add(LIGHTBOX_SLIDER);
	    setStyles(slider, { 'width': img.offsetWidth + 'px', 'height': img.offsetHeight + 'px' });
	
	    var slide = document.createElement('div');
	    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
	    slide.textContent = '>';
	    setStyles(slide, {
	      'width': img.offsetWidth + 'px',
	      'height': img.offsetHeight + 'px',
	      'line-height': img.offsetHeight + 'px',
	      'font-size': img.offsetHeight / 4 + 'px',
	      'text-align': 'right',
	      'background-image': 'url("' + (img.getAttribute('data-img-url-prev') || '') + '")'
	    });
	    slider.appendChild(slide);
	
	    slide = document.createElement('div');
	    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
	    setStyles(slide, {
	      'width': img.offsetWidth + 'px',
	      'height': img.offsetHeight + 'px',
	      'background-image': 'url("' + img.src + '")'
	    });
	    slider.appendChild(slide);
	
	    slide = document.createElement('div');
	    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
	    slide.textContent = '<';
	    setStyles(slide, {
	      'width': img.offsetWidth + 'px',
	      'height': img.offsetHeight + 'px',
	      'line-height': img.offsetHeight + 'px',
	      'font-size': img.offsetHeight / 4 + 'px',
	      'text-align': 'left',
	      'background-image': 'url("' + (img.getAttribute('data-img-url-next') || '') + '")'
	    });
	    slider.appendChild(slide);
	
	    img.parentNode.appendChild(slider);
	
	    // drag handler
	    var drag = function drag(e) {
	      e.preventDefault();
	      var dx = (e.clientX || (e.touches !== undefined ? e.touches[0].clientX : 0)) - x; // TODO: maybe rewrite to improve performance
	
	      if (slider.offsetWidth - Math.abs(dx) > 19) {
	        slider.style.left = dx + 'px';
	      }
	    };
	
	    // end drag handler
	    var endDrag = function endDrag(e) {
	      e.preventDefault();
	      //e.stopPropagation();
	
	      window.removeEventListener('mousemove', drag);
	      window.removeEventListener('touchmove', drag);
	      window.removeEventListener('mouseup', endDrag);
	      window.removeEventListener('touchend', endDrag);
	
	      var dx = slider.offsetLeft;
	      img.parentNode.removeChild(slider);
	      img.style.opacity = '1.0';
	
	      if (Math.abs(dx) > 19) {
	        dispatchAction_(dx > 0 ? 'prev' : 'next', img);
	      }
	    };
	
	    window.addEventListener('mousemove', drag);
	    window.addEventListener('touchmove', drag);
	    window.addEventListener('mouseup', endDrag);
	    window.addEventListener('touchend', endDrag);
	  };
	
	  /**
	   * Initialize component
	   */
	  MaterialExtLightbox.prototype.init = function () {
	    var _this = this;
	
	    if (this.element_) {
	      // Do the init required for this component to work
	      this.element_.addEventListener('keydown', this.keyDownHandler_.bind(this.element_), true);
	
	      if (!(0, _isInteger2.default)(this.element_.getAttribute('tabindex'))) {
	        this.element_.setAttribute('tabindex', 1);
	      }
	
	      [].concat((0, _toConsumableArray3.default)(this.element_.querySelectorAll('.' + BUTTON))).forEach(function (button) {
	        return button.addEventListener('click', _this.buttonClickHandler_.bind(button), false);
	      });
	
	      var figcaption = this.element_.querySelector('figcaption');
	      if (figcaption) {
	        figcaption.addEventListener('click', this.buttonClickHandler_.bind(figcaption), false);
	      }
	
	      var footer = this.element_.querySelector('footer');
	      if (footer) {
	        footer.addEventListener('click', this.buttonClickHandler_.bind(footer), false);
	      }
	
	      var img = this.element_.querySelector('img');
	      if (img) {
	        img.addEventListener('load', this.imgLoadHandler_.bind(this.element_), false);
	        img.addEventListener('click', function (e) {
	          return e.preventDefault();
	        }, true);
	        img.addEventListener('mousedown', this.imgDragHandler_.bind(img), true);
	        img.addEventListener('touchstart', this.imgDragHandler_.bind(img), true);
	      }
	      window.addEventListener('resize', (0, _fullThrottle2.default)(function () {
	        return repositionDialog_(_this.element_);
	      }));
	      window.addEventListener('orientationchange', function () {
	        return repositionDialog_(_this.element_);
	      });
	
	      // Set upgraded flag
	      this.element_.classList.add(_constants.IS_UPGRADED);
	    }
	  };
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   *
	   * Nothing to downgrade
	   *
	  MaterialExtLightbox.prototype.mdlDowngrade_ = function() {
	  };
	  */
	
	  /**
	   * The component registers itself. It can assume componentHandler is available in the global scope.
	   */
	  /* jshint undef:false */
	  componentHandler.register({
	    constructor: MaterialExtLightbox,
	    classAsString: 'MaterialExtLightbox',
	    cssClass: 'mdlext-js-lightbox'
	  });
	})();

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(22);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(23);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _toConsumableArray2 = __webpack_require__(8);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _stringUtils = __webpack_require__(15);
	
	var _fullThrottle = __webpack_require__(13);
	
	var _fullThrottle2 = _interopRequireDefault(_fullThrottle);
	
	var _constants = __webpack_require__(2);
	
	var _domUtils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @license
	 * Copyright 2016 Leif Olsen. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * This code is built with Google Material Design Lite,
	 * which is Licensed under the Apache License, Version 2.0
	 */
	
	/**
	 * A menu button is a button that opens a menu. It is often styled as a
	 * typical push button with a downward pointing arrow or triangle to hint
	 * that activating the button will display a menu.
	 */
	var JS_MENU_BUTTON = 'mdlext-js-menu-button';
	var MENU_BUTTON_MENU = 'mdlext-menu';
	var MENU_BUTTON_MENU_ITEM = 'mdlext-menu__item';
	var MENU_BUTTON_MENU_ITEM_SEPARATOR = 'mdlext-menu__item-separator';
	//const MDL_LAYOUT_CONTENT = 'mdl-layout__content';
	
	/**
	 * Creates the menu controlled by the menu button
	 * @param element
	 * @return {{element: Element, selected: Element, open: (function(*=)), removeListeners: (function()), downgrade: (function())}}
	 */
	
	var menuFactory = function menuFactory(element) {
	
	  var ariaControls = null;
	  var parentNode = null;
	
	  var removeAllSelected = function removeAllSelected() {
	    [].concat((0, _toConsumableArray3.default)(element.querySelectorAll('.' + MENU_BUTTON_MENU_ITEM + '[aria-selected="true"]'))).forEach(function (selectedItem) {
	      return selectedItem.removeAttribute('aria-selected');
	    });
	  };
	
	  var setSelected = function setSelected(item) {
	    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	    if (force || item && !item.hasAttribute('aria-selected')) {
	      removeAllSelected();
	      if (item) {
	        item.setAttribute('aria-selected', 'true');
	      }
	    }
	  };
	
	  var getSelected = function getSelected() {
	    return element.querySelector('.' + MENU_BUTTON_MENU_ITEM + '[aria-selected="true"]');
	  };
	
	  var isDisabled = function isDisabled(item) {
	    return item && item.hasAttribute('disabled');
	  };
	
	  var isSeparator = function isSeparator(item) {
	    return item && item.classList.contains(MENU_BUTTON_MENU_ITEM_SEPARATOR);
	  };
	
	  var focus = function focus(item) {
	    if (item) {
	      item = item.closest('.' + MENU_BUTTON_MENU_ITEM);
	    }
	    if (item) {
	      item.focus();
	    }
	  };
	
	  var nextItem = function nextItem(current) {
	    var n = current.nextElementSibling;
	    if (!n) {
	      n = element.firstElementChild;
	    }
	    if (!isDisabled(n) && !isSeparator(n)) {
	      focus(n);
	    } else {
	      var i = element.children.length;
	      while (n && i-- > 0) {
	        if (isDisabled(n) || isSeparator(n)) {
	          n = n.nextElementSibling;
	          if (!n) {
	            n = element.firstElementChild;
	          }
	        } else {
	          focus(n);
	          break;
	        }
	      }
	    }
	  };
	
	  var previousItem = function previousItem(current) {
	    var p = current.previousElementSibling;
	    if (!p) {
	      p = element.lastElementChild;
	    }
	    if (!isDisabled(p) && !isSeparator(p)) {
	      focus(p);
	    } else {
	      var i = element.children.length;
	      while (p && i-- > 0) {
	        if (isDisabled(p) || isSeparator(p)) {
	          p = p.previousElementSibling;
	          if (!p) {
	            p = element.lastElementChild;
	          }
	        } else {
	          focus(p);
	          break;
	        }
	      }
	    }
	  };
	
	  var firstItem = function firstItem() {
	    var item = element.firstElementChild;
	    if (isDisabled(item) || isSeparator(item)) {
	      nextItem(item);
	    } else {
	      focus(item);
	    }
	  };
	
	  var lastItem = function lastItem() {
	    var item = element.lastElementChild;
	    if (isDisabled(item) || isSeparator(item)) {
	      previousItem(item);
	    } else {
	      focus(item);
	    }
	  };
	
	  var selectItem = function selectItem(item) {
	    if (item && !isDisabled(item) && !isSeparator(item)) {
	      setSelected(item);
	      close(true, item);
	    }
	  };
	
	  var keyDownHandler = function keyDownHandler(event) {
	
	    var item = event.target.closest('.' + MENU_BUTTON_MENU_ITEM);
	
	    switch (event.keyCode) {
	      case _constants.VK_ARROW_UP:
	      case _constants.VK_ARROW_LEFT:
	        if (item) {
	          previousItem(item);
	        } else {
	          firstItem();
	        }
	        break;
	
	      case _constants.VK_ARROW_DOWN:
	      case _constants.VK_ARROW_RIGHT:
	        if (item) {
	          nextItem(item);
	        } else {
	          lastItem();
	        }
	        break;
	
	      case _constants.VK_HOME:
	        firstItem();
	        break;
	
	      case _constants.VK_END:
	        lastItem();
	        break;
	
	      case _constants.VK_SPACE:
	      case _constants.VK_ENTER:
	        selectItem(item);
	        break;
	
	      case _constants.VK_ESC:
	        close(true);
	        break;
	
	      case _constants.VK_TAB:
	        // We do not have a "natural" tab order from menu, so the best we can do is to set focus back to the button
	        close(true);
	        break;
	
	      default:
	        return;
	    }
	    event.preventDefault();
	  };
	
	  var blurHandler = function blurHandler(event) {
	
	    // See: https://github.com/facebook/react/issues/2011
	    var t = event.relatedTarget || event.explicitOriginalTarget || // FF
	    document.activeElement; // IE11
	
	    //console.log('***** blur, target, relatedTarget', event.target, t);
	
	    try {
	      if (t) {
	        if (t.closest('.' + MENU_BUTTON_MENU) !== element && shouldClose(t)) {
	          close();
	        }
	      } else {
	        close();
	      }
	    } catch (err) {
	      // FF throws error: "TypeError: n.closest is not a function" if related target is a text node
	      close();
	    }
	  };
	
	  var clickHandler = function clickHandler(event) {
	    //console.log('***** click, target', event.target);
	
	    event.preventDefault();
	    var t = event.target;
	    if (t && t.closest('.' + MENU_BUTTON_MENU) === element) {
	      var item = t.closest('.' + MENU_BUTTON_MENU_ITEM);
	      if (item) {
	        selectItem(item);
	      }
	    } else {
	      if (shouldClose(t)) {
	        close();
	      }
	    }
	  };
	
	  var touchStartHandler = function touchStartHandler(event) {
	    //console.log('***** touchStart, target', event.target);
	
	    var t = event.target;
	    if (!(t && t.closest('.' + MENU_BUTTON_MENU) === element)) {
	      if (event.type === 'touchstart') {
	        event.preventDefault();
	      }
	      close();
	    }
	  };
	
	  var addListeners = function addListeners() {
	    element.addEventListener('keydown', keyDownHandler, false);
	    element.addEventListener('blur', blurHandler, true);
	    element.addEventListener('click', clickHandler, true);
	    document.documentElement.addEventListener('touchstart', touchStartHandler, true);
	  };
	
	  var _removeListeners = function _removeListeners() {
	    element.removeEventListener('keydown', keyDownHandler, false);
	    element.removeEventListener('blur', blurHandler, true);
	    element.removeEventListener('click', clickHandler, true);
	    document.documentElement.removeEventListener('touchstart', touchStartHandler, true);
	  };
	
	  var _open = function _open(controlElement) {
	    var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'first';
	
	
	    ariaControls = controlElement.closest('.' + JS_MENU_BUTTON);
	
	    element.style['min-width'] = Math.max(124, controlElement.getBoundingClientRect().width) + 'px';
	    element.removeAttribute('hidden');
	    (0, _domUtils.tether)(controlElement, element);
	
	    var item = void 0;
	    switch (position.toLowerCase()) {
	      case 'first':
	        firstItem();
	        break;
	
	      case 'last':
	        lastItem();
	        break;
	
	      case 'selected':
	        item = getSelected();
	        if (item && !item.hasAttribute('disabled')) {
	          focus(item);
	        } else {
	          firstItem();
	        }
	        break;
	    }
	
	    addListeners();
	  };
	
	  var shouldClose = function shouldClose(target) {
	    //console.log('***** shouldClose');
	
	    var result = false;
	    var btn = target && target.closest('.' + JS_MENU_BUTTON) || null;
	    if (!btn) {
	      result = true;
	    } else if (btn.getAttribute('aria-controls') === element.id) {
	      if (btn !== ariaControls) {
	        result = true;
	      }
	    } else {
	      result = true;
	    }
	    return result;
	  };
	
	  var close = function close() {
	    var forceFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	    var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	    _removeListeners();
	
	    element.dispatchEvent(new CustomEvent('_closemenu', {
	      bubbles: true,
	      cancelable: true,
	      detail: { forceFocus: forceFocus, item: item }
	    }));
	  };
	
	  var addWaiAria = function addWaiAria() {
	    if (!element.hasAttribute('id')) {
	      // Generate a random id
	      element.id = 'menu-button-' + (0, _stringUtils.randomString)();
	    }
	    element.setAttribute('tabindex', '-1');
	    element.setAttribute('role', 'menu');
	    element.setAttribute('hidden', '');
	
	    [].concat((0, _toConsumableArray3.default)(element.querySelectorAll('.' + MENU_BUTTON_MENU_ITEM))).forEach(function (menuitem) {
	      menuitem.setAttribute('tabindex', '-1');
	      menuitem.setAttribute('role', 'menuitem');
	    });
	
	    [].concat((0, _toConsumableArray3.default)(element.querySelectorAll('.' + MENU_BUTTON_MENU_ITEM_SEPARATOR))).forEach(function (menuitem) {
	      menuitem.setAttribute('role', 'separator');
	    });
	  };
	
	  var init = function init() {
	    addWaiAria();
	    parentNode = element.parentNode;
	    element.classList.add('is-upgraded');
	  };
	
	  var _downgrade = function _downgrade() {
	    _removeListeners();
	    if (element.parentNode !== parentNode) {
	      parentNode.appendChild(element);
	    }
	    element.classList.remove('is-upgraded');
	  };
	
	  init();
	
	  return {
	    /**
	     * Get the menu element
	     * @returns {Element} the menu element
	     */
	    get element() {
	      return element;
	    },
	
	    /**
	     * Set selected menu item
	     * @param item
	     */
	    set selected(item) {
	      setSelected(item, true);
	    },
	
	    /**
	     * Open menu
	     * @param {Element} controlElement the element where the menu should be aligned to
	     * @param {String} position menuElement item to receive focus after menu element is opened
	     */
	    open: function open(controlElement) {
	      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'first';
	      return _open(controlElement, position);
	    },
	
	    /**
	     * Remove event listeners.
	     */
	    removeListeners: function removeListeners() {
	      return _removeListeners();
	    },
	
	    /**
	     * Downgrade menu
	     */
	    downgrade: function downgrade() {
	      return _downgrade();
	    }
	  };
	};
	
	/**
	 * The menubutton component
	 */
	
	var MenuButton = function () {
	  function MenuButton(element) {
	    var _this = this;
	
	    (0, _classCallCheck3.default)(this, MenuButton);
	
	    this.keyDownHandler = function (event) {
	      if (!_this.isDisabled()) {
	        switch (event.keyCode) {
	          case _constants.VK_ARROW_UP:
	            _this.openMenu('last');
	            break;
	
	          case _constants.VK_ARROW_DOWN:
	            _this.openMenu();
	            break;
	
	          case _constants.VK_SPACE:
	          case _constants.VK_ENTER:
	            _this.openMenu('selected');
	            break;
	
	          case _constants.VK_ESC:
	            _this.closeMenu();
	            break;
	
	          case _constants.VK_TAB:
	            _this.closeMenu();
	            return;
	
	          default:
	            return;
	        }
	      }
	      //event.stopPropagation();
	      event.preventDefault();
	    };
	
	    this.clickHandler = function () {
	      if (!_this.isDisabled()) {
	        if (_this.element.getAttribute('aria-expanded').toLowerCase() === 'true') {
	          _this.closeMenu(true);
	        } else {
	          _this.openMenu('selected');
	        }
	      }
	    };
	
	    this.recalcMenuPosition = (0, _fullThrottle2.default)(function () {
	      var c = _this.focusElement.getBoundingClientRect();
	      var dx = _this.focusElementLastScrollPosition.left - c.left;
	      var dy = _this.focusElementLastScrollPosition.top - c.top;
	      var left = (parseFloat(_this.menu.element.style.left) || 0) - dx;
	      var top = (parseFloat(_this.menu.element.style.top) || 0) - dy;
	
	      _this.menu.element.style.left = left + 'px';
	      _this.menu.element.style.top = top + 'px';
	      _this.focusElementLastScrollPosition = c;
	    });
	
	    this.positionChangeHandler = function () {
	      _this.recalcMenuPosition(_this);
	    };
	
	    this.closeMenuHandler = function (event) {
	      if (event && event.detail) {
	        if (event.detail.item && event.detail.item !== _this.selectedItem) {
	          _this.selectedItem = event.detail.item;
	          _this.dispatchMenuSelect();
	        }
	        _this.closeMenu(event.detail.forceFocus);
	      }
	    };
	
	    this.element = element;
	    this.focusElement = undefined;
	    this.focusElementLastScrollPosition = undefined;
	    this.scrollElements = [];
	    this.menu = undefined;
	    this.selectedItem = null;
	    this.init();
	  }
	
	  /**
	   * Re-position menu if content is scrolled, window is resized or orientation change
	   * @see https://javascriptweblog.wordpress.com/2015/11/02/of-classes-and-arrow-functions-a-cautionary-tale/
	   */
	
	
	  (0, _createClass3.default)(MenuButton, [{
	    key: 'dispatchMenuSelect',
	    value: function dispatchMenuSelect() {
	      this.element.dispatchEvent(new CustomEvent('menuselect', {
	        bubbles: true,
	        cancelable: true,
	        detail: { source: this.selectedItem }
	      }));
	    }
	  }, {
	    key: 'isDisabled',
	    value: function isDisabled() {
	      return this.element.hasAttribute('disabled');
	    }
	  }, {
	    key: 'removeListeners',
	    value: function removeListeners() {
	      this.element.removeEventListener('keydown', this.keyDownHandler);
	      this.element.removeEventListener('click', this.clickHandler);
	    }
	  }, {
	    key: 'openMenu',
	    value: function openMenu() {
	      var _this2 = this;
	
	      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
	
	
	      if (!this.isDisabled() && this.menu) {
	
	        // Close the menu if button position change
	        this.scrollElements = (0, _domUtils.getScrollParents)(this.element);
	        this.scrollElements.forEach(function (el) {
	          return el.addEventListener('scroll', _this2.positionChangeHandler);
	        });
	
	        window.addEventListener('resize', this.positionChangeHandler);
	        window.addEventListener('orientationchange', this.positionChangeHandler);
	        this.menu.element.addEventListener('_closemenu', this.closeMenuHandler);
	
	        this.menu.selected = this.selectedItem;
	        this.menu.open(this.focusElement, position);
	        this.element.setAttribute('aria-expanded', 'true');
	
	        this.focusElementLastScrollPosition = this.focusElement.getBoundingClientRect();
	      }
	    }
	  }, {
	    key: 'closeMenu',
	    value: function closeMenu() {
	      var _this3 = this;
	
	      var forceFocus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	      if (this.menu) {
	        this.menu.removeListeners();
	        this.scrollElements.forEach(function (el) {
	          return el.removeEventListener('scroll', _this3.positionChangeHandler);
	        });
	        window.removeEventListener('resize', this.positionChangeHandler);
	        window.removeEventListener('orientationchange', this.positionChangeHandler);
	        this.menu.element.removeEventListener('_closemenu', this.closeMenuHandler);
	
	        if (forceFocus) {
	          this.focus();
	        }
	        this.element.setAttribute('aria-expanded', 'false');
	        this.menu.element.setAttribute('hidden', '');
	      }
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {
	      if (!this.isDisabled()) {
	        this.focusElement.focus();
	      }
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this4 = this;
	
	      var addListeners = function addListeners() {
	        _this4.element.addEventListener('keydown', _this4.keyDownHandler);
	        _this4.element.addEventListener('click', _this4.clickHandler);
	      };
	
	      var addWaiAria = function addWaiAria() {
	        _this4.element.setAttribute('role', 'button');
	        _this4.element.setAttribute('aria-expanded', 'false');
	        _this4.element.setAttribute('aria-haspopup', 'true');
	      };
	
	      var addFocusElement = function addFocusElement() {
	        _this4.focusElement = _this4.element.querySelector('input[type="text"]');
	        if (!_this4.focusElement) {
	          _this4.focusElement = _this4.element;
	
	          if (!(_this4.focusElement.tagName.toLowerCase() === 'button' || _this4.focusElement.tagName.toLowerCase() === 'input')) {
	            if (!_this4.focusElement.hasAttribute('tabindex')) {
	              _this4.focusElement.setAttribute('tabindex', '0');
	            }
	          }
	        }
	      };
	
	      var moveElementToDocumentBody = function moveElementToDocumentBody(element) {
	        // To position an element on top of all other z-indexed elements, the element should be moved to document.body
	        //       See: https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
	
	        if (element.parentNode !== document.body) {
	          return document.body.appendChild(element);
	        }
	        return element;
	      };
	
	      var findMenuElement = function findMenuElement() {
	        var menuElement = void 0;
	        var menuElementId = _this4.element.getAttribute('aria-controls');
	        if (menuElementId !== null) {
	          menuElement = document.querySelector('#' + menuElementId);
	        } else {
	          menuElement = _this4.element.parentNode.querySelector('.' + MENU_BUTTON_MENU);
	        }
	        return menuElement;
	      };
	
	      var addMenu = function addMenu() {
	        var menuElement = findMenuElement();
	        if (menuElement) {
	          if (menuElement.componentInstance) {
	            _this4.menu = menuElement.componentInstance;
	          } else {
	            _this4.menu = menuFactory(menuElement);
	            menuElement.componentInstance = _this4.menu;
	            moveElementToDocumentBody(menuElement);
	          }
	          _this4.element.setAttribute('aria-controls', _this4.menu.element.id);
	        }
	      };
	
	      addFocusElement();
	      addWaiAria();
	      addMenu();
	      this.removeListeners();
	      addListeners();
	    }
	  }, {
	    key: 'downgrade',
	    value: function downgrade() {
	      var _this5 = this;
	
	      if (this.menu) {
	        // Do not downgrade menu if there are other buttons sharing this menu
	        var related = [].concat((0, _toConsumableArray3.default)(document.querySelectorAll('.' + JS_MENU_BUTTON + '[aria-controls="' + this.element.getAttribute('aria-controls') + '"]')));
	        if (related.filter(function (c) {
	          return c !== _this5.element && c.getAttribute('data-upgraded').indexOf('MaterialExtMenuButton') >= 0;
	        }).length === 0) {
	          this.menu.downgrade();
	        }
	      }
	      this.removeListeners();
	    }
	  }]);
	  return MenuButton;
	}();
	
	(function () {
	  'use strict';
	
	  /**
	   * https://github.com/google/material-design-lite/issues/4205
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	
	  var MaterialExtMenuButton = function MaterialExtMenuButton(element) {
	    this.element_ = element;
	    this.menuButton_ = null;
	
	    // Initialize instance.
	    this.init();
	  };
	  window['MaterialExtMenuButton'] = MaterialExtMenuButton;
	
	  // Public methods.
	
	  /**
	   * Get the menu element controlled by this button, null if no menu is controlled by this button
	   * @public
	   */
	  MaterialExtMenuButton.prototype.getMenuElement = function () {
	    return this.menuButton_.menu ? this.menuButton_.menu.element : null;
	  };
	  MaterialExtMenuButton.prototype['getMenuElement'] = MaterialExtMenuButton.prototype.getMenuElement;
	
	  /**
	   * Open menu
	   * @public
	   * @param {String} position one of "first", "last" or "selected"
	   */
	  MaterialExtMenuButton.prototype.openMenu = function (position) {
	    this.menuButton_.openMenu(position);
	  };
	  MaterialExtMenuButton.prototype['openMenu'] = MaterialExtMenuButton.prototype.openMenu;
	
	  /**
	   * Close menu
	   * @public
	   */
	  MaterialExtMenuButton.prototype.closeMenu = function () {
	    this.menuButton_.closeMenu(true);
	  };
	  MaterialExtMenuButton.prototype['closeMenu'] = MaterialExtMenuButton.prototype.closeMenu;
	
	  /**
	   * Get selected menu item
	   * @public
	   * @returns {Element} The selected menu item or null if no item selected
	   */
	  MaterialExtMenuButton.prototype.getSelectedMenuItem = function () {
	    return this.menuButton_.selectedItem;
	  };
	  MaterialExtMenuButton.prototype['getSelectedMenuItem'] = MaterialExtMenuButton.prototype.getSelectedMenuItem;
	
	  /**
	   * Set (default) selected menu item
	   * @param {Element} item
	   */
	  MaterialExtMenuButton.prototype.setSelectedMenuItem = function (item) {
	    this.menuButton_.selectedItem = item;
	  };
	  MaterialExtMenuButton.prototype['setSelectedMenuItem'] = MaterialExtMenuButton.prototype.setSelectedMenuItem;
	
	  /**
	   * Initialize component
	   */
	  MaterialExtMenuButton.prototype.init = function () {
	    if (this.element_) {
	      this.menuButton_ = new MenuButton(this.element_);
	      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
	      this.element_.classList.add(_constants.IS_UPGRADED);
	    }
	  };
	
	  /**
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   */
	  MaterialExtMenuButton.prototype.mdlDowngrade_ = function () {
	    this.menuButton_.downgrade();
	  };
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtMenuButton,
	    classAsString: 'MaterialExtMenuButton',
	    cssClass: JS_MENU_BUTTON,
	    widget: true
	  });
	})();

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _stringUtils = __webpack_require__(15);
	
	var _constants = __webpack_require__(2);
	
	/**
	 * @license
	 * Copyright 2016 Leif Olsen. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * This code is built with Google Material Design Lite,
	 * which is Licensed under the Apache License, Version 2.0
	 */
	
	/*
	 * Copied/Modified from https://github.com/google/material-design-lite/tree/master/src/textfield
	 */
	
	(function () {
	  'use strict';
	
	  var LABEL = 'mdlext-selectfield__label';
	  var INPUT = 'mdlext-selectfield__select';
	
	  /**
	   * Class constructor for Selectfield MDLEXT component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	  var MaterialExtSelectfield = function MaterialExtSelectfield(element) {
	    this.element_ = element;
	    this.init(); // Initialize instance.
	  };
	
	  window['MaterialExtSelectfield'] = MaterialExtSelectfield;
	
	  /**
	   * Handle focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	  /*eslint no-unused-vars: 0*/
	  MaterialExtSelectfield.prototype.onFocus_ = function () /*event*/{
	    this.element_.classList.add(_constants.IS_FOCUSED);
	  };
	
	  /**
	   * Handle lost focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	  /*eslint no-unused-vars: 0*/
	  MaterialExtSelectfield.prototype.onBlur_ = function () /*event*/{
	    this.element_.classList.remove(_constants.IS_FOCUSED);
	  };
	
	  /**
	   * Handle reset event from out side.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	  MaterialExtSelectfield.prototype.onReset_ = function () /*event*/{
	    this.updateClasses_();
	  };
	
	  /**
	   * Handle class updates.
	   *
	   * @private
	   */
	  MaterialExtSelectfield.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkValidity();
	    this.checkDirty();
	    this.checkFocus();
	  };
	
	  // Public methods.
	
	  /**
	   * Check the disabled state and update field accordingly.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.checkDisabled = function () {
	    if (this.select_.disabled) {
	      this.element_.classList.add(_constants.IS_DISABLED);
	    } else {
	      this.element_.classList.remove(_constants.IS_DISABLED);
	    }
	  };
	  MaterialExtSelectfield.prototype['checkDisabled'] = MaterialExtSelectfield.prototype.checkDisabled;
	
	  /**
	   * Check the focus state and update field accordingly.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.checkFocus = function () {
	    // Note: element.querySelector(':focus') always return null in JsDom, even if select element has focus
	    /*eslint no-extra-boolean-cast: 0*/
	    if (Boolean(this.element_.querySelector(':focus'))) {
	      this.element_.classList.add(_constants.IS_FOCUSED);
	    } else {
	      this.element_.classList.remove(_constants.IS_FOCUSED);
	    }
	  };
	
	  MaterialExtSelectfield.prototype['checkFocus'] = MaterialExtSelectfield.prototype.checkFocus;
	
	  /**
	   * Check the validity state and update field accordingly.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.checkValidity = function () {
	
	    /* Don't think it makes any sense to check validity.
	       Tests I've done, so far, indicates that setting an illegal value via JS returns selectedIndex=0
	     if (this.select_.validity) {
	      if (this.select_.validity.valid) {
	        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
	      } else {
	        this.element_.classList.add(this.CssClasses_.IS_INVALID);
	      }
	    }
	    */
	  };
	
	  MaterialExtSelectfield.prototype['checkValidity'] = MaterialExtSelectfield.prototype.checkValidity;
	
	  /**
	   * Check the dirty state and update field accordingly.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.checkDirty = function () {
	    if (this.select_.value && this.select_.value.length > 0) {
	      this.element_.classList.add(_constants.IS_DIRTY);
	    } else {
	      this.element_.classList.remove(_constants.IS_DIRTY);
	    }
	  };
	
	  MaterialExtSelectfield.prototype['checkDirty'] = MaterialExtSelectfield.prototype.checkDirty;
	
	  /**
	   * Disable select field.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.disable = function () {
	    this.select_.disabled = true;
	    this.updateClasses_();
	  };
	
	  MaterialExtSelectfield.prototype['disable'] = MaterialExtSelectfield.prototype.disable;
	
	  /**
	   * Enable select field.
	   *
	   * @public
	   */
	  MaterialExtSelectfield.prototype.enable = function () {
	    this.select_.disabled = false;
	    this.updateClasses_();
	  };
	
	  MaterialExtSelectfield.prototype['enable'] = MaterialExtSelectfield.prototype.enable;
	
	  /**
	   * Update select field value.
	   *
	   * @param {string} value The value to which to set the control (optional).
	   * @public
	   */
	  MaterialExtSelectfield.prototype.change = function (value) {
	    this.select_.value = value || '';
	    this.updateClasses_();
	  };
	  MaterialExtSelectfield.prototype['change'] = MaterialExtSelectfield.prototype.change;
	
	  /**
	   * Initialize element.
	   */
	  MaterialExtSelectfield.prototype.init = function () {
	    if (this.element_) {
	      this.label_ = this.element_.querySelector('.' + LABEL);
	      this.select_ = this.element_.querySelector('.' + INPUT);
	
	      if (this.select_) {
	        // Remove listeners, just in case ...
	        this.select_.removeEventListener('change', this.updateClasses_);
	        this.select_.removeEventListener('focus', this.onFocus_);
	        this.select_.removeEventListener('blur', this.onBlur_);
	        this.select_.removeEventListener('reset', this.onReset_);
	
	        this.select_.addEventListener('change', this.updateClasses_.bind(this));
	        this.select_.addEventListener('focus', this.onFocus_.bind(this));
	        this.select_.addEventListener('blur', this.onBlur_.bind(this));
	        this.select_.addEventListener('reset', this.onReset_.bind(this));
	
	        if (this.label_) {
	          var id = void 0;
	          if (!this.select_.hasAttribute('id')) {
	            id = 'select-' + (0, _stringUtils.randomString)();
	            this.select_.id = id;
	          } else {
	            id = this.select_.id;
	          }
	
	          if (!this.label_.hasAttribute('for')) {
	            this.label_.setAttribute('for', id);
	          }
	        }
	
	        var invalid = this.element_.classList.contains(_constants.IS_INVALID);
	        this.updateClasses_();
	        this.element_.classList.add(_constants.IS_UPGRADED);
	
	        if (invalid) {
	          this.element_.classList.add(_constants.IS_INVALID);
	        }
	        if (this.select_.hasAttribute('autofocus')) {
	          this.element_.focus();
	          this.checkFocus();
	        }
	      }
	    }
	  };
	
	  /**
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   *
	   * Nothing to downgrade
	   *
	  MaterialExtSelectfield.prototype.mdlDowngrade_ = function() {
	    'use strict';
	    console.log('***** MaterialExtSelectfield.mdlDowngrade ');
	  };
	  */
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /*eslint no-undef: 0*/
	  componentHandler.register({
	    constructor: MaterialExtSelectfield,
	    classAsString: 'MaterialExtSelectfield',
	    cssClass: 'mdlext-js-selectfield',
	    widget: true
	  });
	})();

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _fullThrottle = __webpack_require__(13);
	
	var _fullThrottle2 = _interopRequireDefault(_fullThrottle);
	
	var _jsonUtils = __webpack_require__(14);
	
	var _constants = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(function () {
	  'use strict';
	
	  var MDL_LAYOUT_CONTENT = 'mdl-layout__content';
	  var IS_SCROLL_CLASS = 'mdlext-is-scroll';
	
	  /**
	   * @constructor
	   * @param {Element} element The element that will be upgraded.
	   */
	  var MaterialExtStickyHeader = function MaterialExtStickyHeader(element) {
	    // Stores the element.
	    this.header_ = element;
	
	    // Heder listens to scroll events from content
	    this.content_ = null;
	    this.lastScrollTop_ = 0;
	
	    // Default config
	    this.config_ = {
	      visibleAtScrollEnd: false
	    };
	
	    this.mutationObserver_ = null;
	
	    this.drawing_ = false;
	
	    // Initialize instance.
	    this.init();
	  };
	
	  window['MaterialExtStickyHeader'] = MaterialExtStickyHeader;
	
	  /**
	   * Update header width
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.recalcWidth_ = function () {
	    this.header_.style.width = this.content_.clientWidth + 'px';
	  };
	
	  var throttleResize = (0, _fullThrottle2.default)(function (self) {
	    return self.recalcWidth_();
	  });
	
	  /**
	   * Adjust header width when window resizes or oreientation changes
	   * @param event
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.resizeHandler_ = function () /* event */{
	    throttleResize(this);
	  };
	
	  /**
	   * Update header position
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.reposition_ = function () {
	
	    var currentContentScrollTop = this.content_.scrollTop;
	    var scrollDiff = this.lastScrollTop_ - currentContentScrollTop;
	
	    if (currentContentScrollTop <= 0) {
	      // Scrolled to the top. Header sticks to the top
	      this.header_.style.top = '0';
	      this.header_.classList.remove(IS_SCROLL_CLASS);
	    } else if (scrollDiff > 0) {
	
	      if (scrollDiff >= this.header_.offsetHeight) {
	
	        // Scrolled up. Header slides in
	        var headerTop = parseInt(window.getComputedStyle(this.header_).getPropertyValue('top')) || 0;
	        if (headerTop != 0) {
	          this.header_.style.top = '0';
	          this.header_.classList.add(IS_SCROLL_CLASS);
	        }
	        this.lastScrollTop_ = currentContentScrollTop;
	      }
	      return;
	    } else if (scrollDiff < 0) {
	      // Scrolled down
	      this.header_.classList.add(IS_SCROLL_CLASS);
	      var _headerTop = parseInt(window.getComputedStyle(this.header_).getPropertyValue('top')) || 0;
	
	      if (this.content_.scrollHeight - this.content_.scrollTop <= this.content_.offsetHeight) {
	        // Bottom of content
	        if (_headerTop != 0) {
	          this.header_.style.top = this.config_.visibleAtScrollEnd ? '0' : '-' + this.header_.offsetHeight + 'px';
	        }
	      } else {
	        _headerTop += scrollDiff;
	        var offsetHeight = this.header_.offsetHeight;
	        this.header_.style.top = (Math.abs(_headerTop) > offsetHeight ? -offsetHeight : _headerTop) + 'px';
	      }
	    }
	
	    this.lastScrollTop_ = currentContentScrollTop;
	  };
	
	  var throttleScroll = (0, _fullThrottle2.default)(function (self) {
	    return self.reposition_();
	  });
	
	  /**
	   * Scroll header when content scrolls
	   * @param event
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.scrollHandler_ = function () /* event */{
	    throttleScroll(this);
	  };
	
	  /**
	   * Init header position
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.updatePosition_ = function () /* event */{
	    this.recalcWidth_();
	    this.reposition_();
	  };
	
	  /**
	   * Add mutation observer
	   * @private
	   */
	  MaterialExtStickyHeader.prototype.addMutationObserver_ = function () {
	    var _this = this;
	
	    // jsdom does not support MutationObserver - so this is not testable
	    /* istanbul ignore next */
	    this.mutationObserver_ = new MutationObserver(function () /*mutations*/{
	      // Adjust header width if content changes (e.g. in a SPA)
	      _this.updatePosition_();
	    });
	
	    this.mutationObserver_.observe(this.content_, {
	      attributes: false,
	      childList: true,
	      characterData: false,
	      subtree: true
	    });
	  };
	
	  /**
	  * Removes event listeners
	  * @private
	  */
	  MaterialExtStickyHeader.prototype.removeListeners_ = function () {
	
	    window.removeEventListener('resize', this.resizeHandler_);
	    window.removeEventListener('orientationchange', this.resizeHandler_);
	
	    if (this.content_) {
	      this.content_.removeEventListener('scroll', this.scrollHandler_);
	    }
	
	    if (this.mutationObserver_) {
	      this.mutationObserver_.disconnect();
	      this.mutationObserver_ = null;
	    }
	  };
	
	  /**
	   * Initialize component
	   */
	  MaterialExtStickyHeader.prototype.init = function () {
	
	    if (this.header_) {
	
	      this.removeListeners_();
	
	      if (this.header_.hasAttribute('data-config')) {
	        this.config_ = (0, _jsonUtils.jsonStringToObject)(this.header_.getAttribute('data-config'));
	      }
	
	      this.content_ = this.header_.parentNode.querySelector('.' + MDL_LAYOUT_CONTENT) || null;
	
	      if (this.content_) {
	        this.content_.style.paddingTop = this.header_.offsetHeight + 'px'; // Make room for sticky header
	        this.lastScrollTop_ = this.content_.scrollTop;
	
	        this.content_.addEventListener('scroll', this.scrollHandler_.bind(this));
	        window.addEventListener('resize', this.resizeHandler_.bind(this));
	        window.addEventListener('orientationchange', this.resizeHandler_.bind(this));
	
	        this.addMutationObserver_();
	        this.updatePosition_();
	
	        // Set upgraded flag
	        this.header_.classList.add(_constants.IS_UPGRADED);
	      }
	    }
	  };
	
	  /*
	   * Downgrade component
	   * E.g remove listeners and clean up resources
	   *
	   * Nothing to clean
	   *
	   MaterialExtStickyHeader.prototype.mdlDowngrade_ = function() {
	     'use strict';
	     console.log('***** MaterialExtStickyHeader.prototype.mdlDowngrade_');
	   };
	   */
	
	  // The component registers itself. It can assume componentHandler is available
	  // in the global scope.
	  /* eslint no-undef: 0 */
	  componentHandler.register({
	    constructor: MaterialExtStickyHeader,
	    classAsString: 'MaterialExtStickyHeader',
	    cssClass: 'mdlext-js-sticky-header'
	  });
	})(); /**
	       * @license
	       * Copyright 2016 Leif Olsen. All Rights Reserved.
	       *
	       * Licensed under the Apache License, Version 2.0 (the "License");
	       * you may not use this file except in compliance with the License.
	       * You may obtain a copy of the License at
	       *
	       *      http://www.apache.org/licenses/LICENSE-2.0
	       *
	       * Unless required by applicable law or agreed to in writing, software
	       * distributed under the License is distributed on an "AS IS" BASIS,
	       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	       * See the License for the specific language governing permissions and
	       * limitations under the License.
	       *
	       * This code is built with Google Material Design Lite,
	       * which is Licensed under the Apache License, Version 2.0
	       */
	
	/**
	 * A sticky header makes site navigation easily accessible anywhere on the page and saves content space at the same.
	 * The header should auto-hide, i.e. hiding the header automatically when a user starts scrolling down the page and
	 * bringing the header back when a user might need it: they reach the bottom of the page or start scrolling up.
	 */

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	__webpack_require__(21);
	
	__webpack_require__(15);
	
	__webpack_require__(14);
	
	__webpack_require__(13);
	
	__webpack_require__(29);
	
	__webpack_require__(30);

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _isIterable2 = __webpack_require__(61);
	
	var _isIterable3 = _interopRequireDefault(_isIterable2);
	
	var _getIterator2 = __webpack_require__(31);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;
	
	    try {
	      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);
	
	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }
	
	    return _arr;
	  }
	
	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if ((0, _isIterable3.default)(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	__webpack_require__(104);
	module.exports = __webpack_require__(1).Array.from;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(48);
	__webpack_require__(28);
	module.exports = __webpack_require__(102);

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(48);
	__webpack_require__(28);
	module.exports = __webpack_require__(103);

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(106);
	module.exports = __webpack_require__(1).Number.isInteger;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(107);
	module.exports = __webpack_require__(1).Number.isNaN;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(108);
	module.exports = __webpack_require__(1).Object.assign;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(109);
	var $Object = __webpack_require__(1).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(112);
	module.exports = __webpack_require__(1).Object.entries;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(110);
	module.exports = __webpack_require__(1).Object.keys;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(111);
	module.exports = __webpack_require__(1).Reflect.apply;

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(19)
	  , toLength  = __webpack_require__(45)
	  , toIndex   = __webpack_require__(100);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(12)
	  , createDesc      = __webpack_require__(25);
	
	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5).document && document.documentElement;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(9) && !__webpack_require__(10)(function(){
	  return Object.defineProperty(__webpack_require__(38)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(7)
	  , ITERATOR   = __webpack_require__(4)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(17)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(6);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(91)
	  , descriptor     = __webpack_require__(25)
	  , setToStringTag = __webpack_require__(43)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(11)(IteratorPrototype, __webpack_require__(4)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(4)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(18)
	  , gOPS     = __webpack_require__(93)
	  , pIE      = __webpack_require__(42)
	  , toObject = __webpack_require__(20)
	  , IObject  = __webpack_require__(40)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(10)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(6)
	  , dPs         = __webpack_require__(92)
	  , enumBugKeys = __webpack_require__(39)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(38)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(81).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(12)
	  , anObject = __webpack_require__(6)
	  , getKeys  = __webpack_require__(18);
	
	module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 93 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(16)
	  , toObject    = __webpack_require__(20)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(16)
	  , toIObject    = __webpack_require__(19)
	  , arrayIndexOf = __webpack_require__(79)(false)
	  , IE_PROTO     = __webpack_require__(26)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(3)
	  , core    = __webpack_require__(1)
	  , fails   = __webpack_require__(10);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(18)
	  , toIObject = __webpack_require__(19)
	  , isEnum    = __webpack_require__(42).f;
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , defined   = __webpack_require__(24);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(17);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(6)
	  , get      = __webpack_require__(47);
	module.exports = __webpack_require__(1).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(35)
	  , ITERATOR  = __webpack_require__(4)('iterator')
	  , Iterators = __webpack_require__(7);
	module.exports = __webpack_require__(1).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(37)
	  , $export        = __webpack_require__(3)
	  , toObject       = __webpack_require__(20)
	  , call           = __webpack_require__(85)
	  , isArrayIter    = __webpack_require__(83)
	  , toLength       = __webpack_require__(45)
	  , createProperty = __webpack_require__(80)
	  , getIterFn      = __webpack_require__(47);
	
	$export($export.S + $export.F * !__webpack_require__(87)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(78)
	  , step             = __webpack_require__(88)
	  , Iterators        = __webpack_require__(7)
	  , toIObject        = __webpack_require__(19);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(41)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(3);
	
	$export($export.S, 'Number', {isInteger: __webpack_require__(84)});

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.4 Number.isNaN(number)
	var $export = __webpack_require__(3);
	
	$export($export.S, 'Number', {
	  isNaN: function isNaN(number){
	    return number != number;
	  }
	});

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(3);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(90)});

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(3);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(9), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(20)
	  , $keys    = __webpack_require__(18);
	
	__webpack_require__(96)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	var $export   = __webpack_require__(3)
	  , aFunction = __webpack_require__(34)
	  , anObject  = __webpack_require__(6)
	  , rApply    = (__webpack_require__(5).Reflect || {}).apply
	  , fApply    = Function.apply;
	// MS Edge argumentsList argument is optional
	$export($export.S + $export.F * !__webpack_require__(10)(function(){
	  rApply(function(){});
	}), 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList){
	    var T = aFunction(target)
	      , L = anObject(argumentsList);
	    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
	  }
	});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export  = __webpack_require__(3)
	  , $entries = __webpack_require__(97)(true);
	
	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 113 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;
//# sourceMappingURL=mdl-ext.js.map