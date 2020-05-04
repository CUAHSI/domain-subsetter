
/**
 * An API for observing changes to Element’s size.
 *
 * @See https://wicg.github.io/ResizeObserver/
 * @ee https://github.com/pelotoncycle/resize-observer
 *
 */

import intervalFunction from './interval-function';

((window, document) => {
  'use strict';

  if (typeof window.ResizeObserver !== 'undefined') {
    return;
  }

  document.resizeObservers = [];

  /**
   * The content rect is defined in section 2.3 ResizeObserverEntry of the spec
   * @param target the element to calculate the content rect for
   * @return {{top: (Number|number), left: (Number|number), width: number, height: number}}
   *
   * Note:
   * Avoid using margins on the observed element. The calculation can return incorrect values when margins are involved.
   *
   * The following CSS will report incorrect width (Chrome OSX):
   *
   * <div id="outer" style="width: 300px; height:300px; background-color: green;overflow:auto;">
   *   <div id="observed" style="width: 400px; height:400px; background-color: yellow; margin:30px; border: 20px solid red; padding:10px;">
   *   </div>
   * </div>
   *
   * The calculated width is 280. The actual (correct) width is 340 since Chrome clips the margin.
   *
   * Use an outer container if you really need a "margin":
   *
   * <div id="outer" style="width: 300px; height:300px; background-color: green;overflow:auto; padding:30px;">
   *   <div id="observed" style="width: 400px; height:400px; background-color: yellow; margin: 0; border: 20px solid red; padding:10px;">
   *   </div>
   * </div>
   *
   * A more detailed explanation can be fund here:
   * http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
   */
  const getContentRect = target => {
    const cs = window.getComputedStyle(target);
    const r = target.getBoundingClientRect();
    const top = parseFloat(cs.paddingTop) || 0;
    const left = parseFloat(cs.paddingLeft) || 0;
    const width = r.width  - (
        (parseFloat(cs.marginLeft) || 0) +
        (parseFloat(cs.marginRight) || 0) +
        (parseFloat(cs.borderLeftWidth) || 0) +
        (parseFloat(cs.borderRightWidth) || 0) +
        (left) +
        (parseFloat(cs.paddingRight) || 0)
      );
    const height = r.height  - (
        (parseFloat(cs.marginTop) || 0) +
        (parseFloat(cs.marginBottom) || 0) +
        (parseFloat(cs.borderTopWidth) || 0) +
        (parseFloat(cs.borderBottomWidth) || 0) +
        (top) +
        (parseFloat(cs.paddingBottom) || 0)
      );
    return {width: width, height: height, top: top, left: left};
  };

  const dimensionHasChanged = (target, lastWidth, lastHeight) => {
    const {width, height} = getContentRect(target);
    return width !== lastWidth || height !== lastHeight;
  };


  /**
   * ResizeObservation holds observation information for a single Element.
   * @param target
   * @return {{target: *, broadcastWidth, broadcastHeight, isOrphan: (function()), isActive: (function())}}
   * @constructor
   */
  const ResizeObservation = target => {
    const {width, height} = getContentRect(target);

    return {
      target: target,
      broadcastWidth: width,
      broadcastHeight: height,

      isOrphan() {
        return !this.target || !this.target.parentNode;
      },
      isActive() {
        return dimensionHasChanged(this.target, this.broadcastWidth, this.broadcastHeight);
      }
    };
  };

  /**
   * A snapshot of the observed element
   * @param target
   * @param rect
   * @return {{target: *, contentRect: *}}
   * @constructor
   */
  const ResizeObserverEntry = (target, rect) => {
    return {
      target: target,
      contentRect: rect
    };
  };


  /**
   * The ResizeObserver is used to observe changes to Element's content rect.
   */
  class ResizeObserver {

    /**
     * Constructor for instantiating new Resize observers.
     * @param callback void (sequence<ResizeObserverEntry> entries). The function which will be called on each resize.
     * @throws {TypeError}
     */
    constructor( callback ) {

      if(typeof callback !== 'function') {
        throw new TypeError('callback parameter must be a function');
      }

      this.callback_ = callback;
      this.observationTargets_ = [];
      this.activeTargets_ = [];

      document.resizeObservers.push(this);
    }

    /**
     * A list of ResizeObservations. It represents all Elements being observed.
     *
     * @return {Array}
     */
    get observationTargets() {
      return this.observationTargets_;
    }

    /**
     *  A list of ResizeObservations. It represents all Elements whose size has
     *  changed since last observation broadcast that are eligible for broadcast.
     *
     * @return {Array}
     */
    get activeTargets() {
      return this.activeTargets_;
    }

    /**
     * Adds target to the list of observed elements.
     * @param {HTMLElement} target The target to observe
     */
    observe(target) {
      if(target) {
        if (!(target instanceof HTMLElement)) {
          throw new TypeError('target parameter must be an HTMLElement');
        }
        if (!this.observationTargets_.find(t => t.target === target)) {
          this.observationTargets_.push(ResizeObservation(target));
          resizeController.start();
        }
      }
    }

    /**
     * Removes target from the list of observed elements.
     * @param target The target to remove
     */
    unobserve(target) {
      const i = this.observationTargets_.findIndex(t => t.target === target);
      if(i > -1) {
        this.observationTargets_.splice(i, 1);
      }
    }

    /**
     * Stops the ResizeObserver instance from receiving notifications of resize changes.
     * Until the observe() method is used again, observer's callback will not be invoked.
     */
    disconnect() {
      this.observationTargets_ = [];
      this.activeTargets_ = [];
    }

    /**
     * Removes the ResizeObserver from the list of observers
     */
    destroy() {
      this.disconnect();
      const i = document.resizeObservers.findIndex(o => o === this);
      if(i > -1) {
        document.resizeObservers.splice(i, 1);
      }
    }

    deleteOrphansAndPopulateActiveTargets_() {

      // Works, but two iterations
      //this.observationTargets_ = this.observationTargets_.filter( resizeObervation => !resizeObervation.isOrphan());
      //this.activeTargets_ = this.observationTargets_.filter( resizeObervation => resizeObervation.isActive());

      // Same result as above, one iteration
      /*
      this.activeTargets_ = [];
      let n = this.observationTargets_.length-1;
      while(n >= 0) {
        if(this.observationTargets_[n].isOrphan()) {
          this.observationTargets_.splice(n, 1);
        }
        else if(this.observationTargets_[n].isActive()) {
          this.activeTargets_.push(this.observationTargets_[n]);
        }
        n -= 1;
      }
      */

      // Same result as above - but reduce is cooler :-)
      this.activeTargets_ = this.observationTargets_.reduceRight( (prev, resizeObservation, index, arr) => {
        if(resizeObservation.isOrphan()) {
          arr.splice(index, 1);
        }
        else if(resizeObservation.isActive()) {
          prev.push(resizeObservation);
        }
        return prev;
      }, []);
    }

    broadcast_() {
      this.deleteOrphansAndPopulateActiveTargets_();
      if (this.activeTargets_.length > 0) {
        const entries = [];
        for (const resizeObservation of this.activeTargets_) {
          const rect = getContentRect(resizeObservation.target);
          resizeObservation.broadcastWidth = rect.width;
          resizeObservation.broadcastHeight = rect.height;
          entries.push(ResizeObserverEntry(resizeObservation.target, rect));
        }
        this.callback_(entries);
        this.activeTargets_ = [];
      }
    }
  }


  //let interval = require('./interval-function');

  /**
   * Broadcasts Element.resize events
   * @return {{start: (function()), stop: (function())}}
   * @constructor
   */
  const ResizeController = () => {

    const shouldStop = () => {
      return document.resizeObservers.findIndex( resizeObserver => resizeObserver.observationTargets.length > 0 ) > -1;
    };

    const execute = () => {
      //console.log('***** Execute');
      for(const resizeObserver of document.resizeObservers) {
        resizeObserver.broadcast_();
      }

      return shouldStop();
    };

    const interval = intervalFunction(200);

    return {
      start() {
        if(!interval.started) {
          //console.log('***** Start poll');
          interval.start(execute);
        }
      }
    };
  };

  window.ResizeObserver = ResizeObserver;

  const resizeController = ResizeController();
  //console.log('***** ResizeObserver ready');

})(window, document);
