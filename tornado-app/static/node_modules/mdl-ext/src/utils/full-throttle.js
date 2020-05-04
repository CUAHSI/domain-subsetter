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
const fullThrottle = (callback, context) => {

  if (!context) {
    context = this || window;
  }

  let throttling = false;

  return (...args) => {
    if(!throttling) {
      throttling = true;
      window.requestAnimationFrame( () => {
        throttling = false;
        return Reflect.apply(callback, context, args);
      });
    }
  };
};

export default fullThrottle;
