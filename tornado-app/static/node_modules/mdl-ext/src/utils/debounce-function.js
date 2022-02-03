/**
 * Debouncing enforces that a function not be called again until a certain
 * amount of time has passed without it being called.
 *
 * @see https://css-tricks.com/the-difference-between-throttling-and-debouncing/
 * @see https://github.com/webmodules/raf-debounce
 * @see https://github.com/moszeed/es6-promise-debounce
 * @see https://gist.github.com/philbirnie/893950093611d5c1dff4246a572cfbeb/
 * @see https://github.com/SliceMeNice-ES6/event-utils/blob/master/debounce.js
 * @see https://github.com/jeromedecoster/raf-funcs
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @see http://davidwalsh.name/javascript-debounce-function
 *
 * @param callback the callback
 * @param threshold optional delay, default to 250 ms, min to 1000/60ms ms
 * @param context  optional context of this, default to global
 * @return {Function} reference to immediate and cancel
 */
const MIN_THRESHOLD = 1000/60;

const debounceFunction = function(callback, threshold=250, context) {

  if(threshold < MIN_THRESHOLD) {
    threshold = MIN_THRESHOLD;
  }

  if (!context) {
    context = this || window;
  }

  let next = null;
  let start = 0;

  return function (...args) {

    const cancel = () => {
      if(next) {
        window.cancelAnimationFrame(next);
        next = null;
      }
    };

    const execute = () => {
      cancel();
      return Reflect.apply(callback, context, args);
    };

    const later = () => {
      if (threshold - (Date.now() - start) <= 0) {
        return execute();
      }
      next = window.requestAnimationFrame(later);
    };

    cancel();
    start = Date.now();
    next = window.requestAnimationFrame(later);

    return {
      cancel: () => cancel(),
      immediate: () => execute()
    };
  };
};

export default debounceFunction;
