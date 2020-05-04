/**
 * Throttling enforces a maximum number of times a function can be called over time.
 *
 * @param callback the function to throttle
 * @param delay optional delay, default to 1000/60ms
 * @param context optional context of this, default to global window
 * @returns {Function} reference to immediate and cancel functions
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/resize#Example
 * @see https://gist.github.com/yoavniran/d1d33f278bb7744d55c3
 * @see https://github.com/pelotoncycle/frame-throttle
 * @see https://github.com/jeromedecoster/raf-funcs
 */
const MIN_DELAY = 1000/60;

const throttleFunction = (callback, delay=MIN_DELAY, context) => {

  if(delay < MIN_DELAY) {
    delay = MIN_DELAY;
  }

  if (!context) {
    context = this || window;
  }

  let next = null;
  let start = 0;

  return (...args) => {

    const cancel = () => {
      if(next !== null) {
        window.cancelAnimationFrame(next);
        next = null;
      }
    };

    const execute = () => {
      cancel();
      return Reflect.apply(callback, context, args);
    };

    const later = () => {
      if (delay - (Date.now() - start) <= 0) {
        return execute();
      }
      next = window.requestAnimationFrame(later);
    };

    if(next === null) {
      start = Date.now();
      next = window.requestAnimationFrame(later);
    }

    return {
      cancel: () => cancel(),
      immediate: () => execute()
    };
  };
};

export default throttleFunction;
