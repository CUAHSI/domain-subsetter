const MIN_INERVAL = 1000/60;

/**
 * Trigger a callback at a given interval
 * @param interval defaults to 1000/60 ms
 * @return {function()} reference to start, stop, immediate and started
 */

const intervalFunction = ( interval = MIN_INERVAL ) => {

  let lapse = interval < MIN_INERVAL ? MIN_INERVAL : interval;
  let cb = undefined;
  let next = null;
  let timeElapsed = 0;

  const execute = () => {
    const f = cb(timeElapsed);
    if (!f) {
      cancel();
    }
  };

  const cancel = () => {
    if(next) {
      window.cancelAnimationFrame(next);
    }
    next = null;
    timeElapsed = 0;
  };

  const start = () => {
    let timeStart = Date.now();

    const loop = now => {
      if (next) {
        next = window.requestAnimationFrame( () => loop( Date.now() ));

        timeElapsed += now - timeStart;

        if(timeElapsed >= lapse) {
          execute();
          if( (timeElapsed -= lapse) > lapse) {
            // time elapsed - interval_ > interval_ , indicates inactivity
            // Could be due to browser minimized, tab changed, screen saver started, computer sleep, and so on
            timeElapsed = 0;
          }
        }
        timeStart = now;
      }
    };

    next = 1;  // a truthy value for first loop
    loop( timeStart );
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
    start(callback) {
      if(typeof callback !== 'function') {
        throw new TypeError('callback parameter must be a function');
      }
      cb = callback;
      start();
    },
    immediate() {
      if(!cb) {
        throw new ReferenceError('callback parameter is not defined. Call start before immediate.');
      }
      execute();
    },
    stop: () => cancel(),
  };
};

export default intervalFunction;
