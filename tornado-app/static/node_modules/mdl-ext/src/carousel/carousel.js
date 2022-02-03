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

import intervalFunction from '../utils/interval-function';
import { inOutQuintic } from '../utils/easing';
import { jsonStringToObject} from '../utils/json-utils';
import {
  VK_TAB,
  VK_ENTER,
  VK_ESC,
  VK_SPACE,
  VK_PAGE_UP,
  VK_PAGE_DOWN,
  VK_END,
  VK_HOME,
  VK_ARROW_LEFT,
  VK_ARROW_UP,
  VK_ARROW_RIGHT,
  VK_ARROW_DOWN,
  IS_UPGRADED,
  IS_FOCUSED,
  MDL_RIPPLE,
  MDL_RIPPLE_COMPONENT,
  MDL_RIPPLE_EFFECT,
  MDL_RIPPLE_EFFECT_IGNORE_EVENTS
} from '../utils/constants';

const MDL_RIPPLE_CONTAINER = 'mdlext-carousel__slide__ripple-container';


(function() {
  'use strict';

  //const CAROUSEL = 'mdlext-carousel';
  const SLIDE      = 'mdlext-carousel__slide';
  const ROLE       = 'list';
  const SLIDE_ROLE = 'listitem';


  /**
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtCarousel = function MaterialExtCarousel(element) {
    // Stores the element.
    this.element_ = element;

    // Default config
    this.config_ = {
      interactive  : true,
      autostart    : false,
      type         : 'slide',
      interval     : 1000,
      animationLoop: intervalFunction(1000)
    };

    this.scrollAnimation_ = intervalFunction(33);

    // Initialize instance.
    this.init();
  };

  window['MaterialExtCarousel'] = MaterialExtCarousel;


  /**
   * Start slideshow animation
   * @private
   */
  MaterialExtCarousel.prototype.startSlideShow_ = function() {

    const nextSlide = () => {
      let slide = this.element_.querySelector(`.${SLIDE}[aria-selected]`);
      if(slide) {
        slide.removeAttribute('aria-selected');
        slide = slide.nextElementSibling;
      }
      if(!slide) {
        slide = this.element_.querySelector(`.${SLIDE}:first-child`);
        this.animateScroll_(0);
      }
      if(slide) {
        this.moveSlideIntoViewport_(slide);
        slide.setAttribute('aria-selected', '');
        this.emitSelectEvent_('next', null, slide);
        return true;
      }
      return false;
    };

    const nextScroll = direction => {
      let nextDirection = direction;

      if('next' === direction &&  this.element_.scrollLeft === this.element_.scrollWidth - this.element_.clientWidth) {
        nextDirection = 'prev';
      }
      else if(this.element_.scrollLeft === 0) {
        nextDirection = 'next';
      }
      const x = 'next' === nextDirection
        ?  Math.min(this.element_.scrollLeft + this.element_.clientWidth, this.element_.scrollWidth - this.element_.clientWidth)
        :  Math.max(this.element_.scrollLeft - this.element_.clientWidth, 0);

      this.animateScroll_(x, 1000);
      return nextDirection;
    };


    if(!this.config_.animationLoop.started) {
      this.config_.animationLoop.interval = this.config_.interval;
      let direction = 'next';

      if('scroll' === this.config_.type) {
        this.config_.animationLoop.start( () => {
          direction = nextScroll(direction);
          return true; // It runs until cancelSlideShow_ is triggered
        });
      }
      else {
        nextSlide();
        this.config_.animationLoop.start( () => {
          return nextSlide(); // It runs until cancelSlideShow_ is triggered
        });
      }
    }

    // TODO: Pause animation when carousel is not in browser viewport or user changes tab
  };

  /**
   * Cancel slideshow if running. Emmits a 'pause' event
   * @private
   */
  MaterialExtCarousel.prototype.cancelSlideShow_ = function() {
    if(this.config_.animationLoop.started) {
      this.config_.animationLoop.stop();
      this.emitSelectEvent_('pause', VK_ESC, this.element_.querySelector(`.${SLIDE}[aria-selected]`));
    }
  };

  /**
   * Animate scroll
   * @param newPosition
   * @param newDuration
   * @param completedCallback
   * @private
   */
  MaterialExtCarousel.prototype.animateScroll_ = function( newPosition, newDuration, completedCallback ) {

    const start = this.element_.scrollLeft;
    const distance = newPosition - start;

    if(distance !== 0) {
      const duration = Math.max(Math.min(Math.abs(distance), newDuration||400), 100); // duration is between 100 and newDuration||400ms||distance
      let t = 0;
      this.scrollAnimation_.stop();
      this.scrollAnimation_.start( timeElapsed => {
        t += timeElapsed;
        if(t < duration) {
          this.element_.scrollLeft = inOutQuintic(t, start, distance, duration);
          return true;
        }
        else {
          this.element_.scrollLeft = newPosition;
          if(completedCallback) {
            completedCallback();
          }
          return false;
        }
      });
    }
    else {
      if(completedCallback) {
        completedCallback();
      }
    }
  };

  /**
   * Execute commend
   * @param event
   * @private
   */
  MaterialExtCarousel.prototype.command_ = function( event ) {
    let x = 0;
    let slide = null;
    const a = event.detail.action.toLowerCase();

    // Cancel slideshow if running
    this.cancelSlideShow_();

    switch (a) {
      case 'first':
        slide = this.element_.querySelector(`.${SLIDE}:first-child`);
        break;

      case 'last':
        x = this.element_.scrollWidth - this.element_.clientWidth;
        slide = this.element_.querySelector(`.${SLIDE}:last-child`);
        break;

      case 'scroll-prev':
        x = Math.max(this.element_.scrollLeft - this.element_.clientWidth, 0);
        break;

      case 'scroll-next':
        x = Math.min(this.element_.scrollLeft + this.element_.clientWidth, this.element_.scrollWidth - this.element_.clientWidth);
        break;

      case 'next':
      case 'prev':
        slide = this.element_.querySelector(`.${SLIDE}[aria-selected]`);
        if(slide) {
          slide = a === 'next' ? slide.nextElementSibling : slide.previousElementSibling;
          this.setAriaSelected_(slide);
          this.emitSelectEvent_(a, null,  slide);
        }
        return;

      case 'play':
        Object.assign(this.config_, event.detail);
        this.startSlideShow_();
        return;

      case 'pause':
        return;

      default:
        return;
    }

    this.animateScroll_(x, undefined, () => {
      if ('scroll-next' === a || 'scroll-prev' === a) {
        const slides = this.getSlidesInViewport_();
        if (slides.length > 0) {
          slide = 'scroll-next' === a ? slides[0] : slides[slides.length - 1];
        }
      }
      this.setAriaSelected_(slide);
      this.emitSelectEvent_(a, null, slide);
    });
  };

  /**
   * Handles custom command event, 'scroll-prev', 'scroll-next', 'first', 'last', next, prev, play, pause
   * @param event. A custom event
   * @private
   */
  MaterialExtCarousel.prototype.commandHandler_ = function( event ) {
    event.preventDefault();
    event.stopPropagation();
    if(event.detail && event.detail.action) {
      this.command_(event);
    }
  };

  /**
   * Handle keypress
   * @param event
   * @private
   */
  MaterialExtCarousel.prototype.keyDownHandler_ = function(event) {

    if (event && event.target && event.target !== this.element_) {

      let action = 'first';

      if ( event.keyCode === VK_HOME    || event.keyCode === VK_END
        || event.keyCode === VK_PAGE_UP || event.keyCode === VK_PAGE_DOWN) {

        event.preventDefault();
        if (event.keyCode === VK_END) {
          action = 'last';
        }
        else if (event.keyCode === VK_PAGE_UP) {
          action = 'scroll-prev';
        }
        else if (event.keyCode === VK_PAGE_DOWN) {
          action = 'scroll-next';
        }

        const cmd = new CustomEvent('select', {
          detail: {
            action: action,
          }
        });
        this.command_(cmd);
      }
      else if ( event.keyCode === VK_TAB
        || event.keyCode === VK_ENTER      || event.keyCode === VK_SPACE
        || event.keyCode === VK_ARROW_UP   || event.keyCode === VK_ARROW_LEFT
        || event.keyCode === VK_ARROW_DOWN || event.keyCode === VK_ARROW_RIGHT) {

        let slide = getSlide_(event.target);

        if(!slide) {
          return;
        }

        // Cancel slideshow if running
        this.cancelSlideShow_();

        switch (event.keyCode) {
          case VK_ARROW_UP:
          case VK_ARROW_LEFT:
            action = 'prev';
            slide = slide.previousElementSibling;
            break;

          case VK_ARROW_DOWN:
          case VK_ARROW_RIGHT:
            action = 'next';
            slide = slide.nextElementSibling;
            break;

          case VK_TAB:
            if (event.shiftKey) {
              action = 'prev';
              slide = slide.previousElementSibling;
            }
            else {
              action = 'next';
              slide = slide.nextElementSibling;
            }
            break;

          case VK_SPACE:
          case VK_ENTER:
            action = 'select';
            break;
        }

        if(slide) {
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
  MaterialExtCarousel.prototype.dragHandler_ = function(event) {
    event.preventDefault();

    // Cancel slideshow if running
    this.cancelSlideShow_();

    let updating = false;
    let rAFDragId = 0;

    const startX = event.clientX || (event.touches !== undefined ? event.touches[0].clientX : 0);
    let prevX = startX;
    const targetElement = event.target;

    const update = e => {
      const currentX = (e.clientX || (e.touches !== undefined ? e.touches[0].clientX : 0));
      const dx = prevX - currentX;

      if(dx < 0) {
        this.element_.scrollLeft = Math.max(this.element_.scrollLeft + dx, 0);
      }
      else if(dx > 0) {
        this.element_.scrollLeft = Math.min(this.element_.scrollLeft + dx, this.element_.scrollWidth - this.element_.clientWidth);
      }

      prevX = currentX;
      updating = false;
    };

    // drag handler
    const drag = e => {
      e.preventDefault();

      if(!updating) {
        rAFDragId = window.requestAnimationFrame( () => update(e));
        updating = true;
      }
    };

    // end drag handler
    const endDrag = e => {
      e.preventDefault();

      this.element_.removeEventListener('mousemove', drag);
      this.element_.removeEventListener('touchmove', drag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);

      // cancel any existing drag rAF, see: http://www.html5rocks.com/en/tutorials/speed/animations/
      window.cancelAnimationFrame(rAFDragId);

      const slide = getSlide_(targetElement);
      setFocus_(slide);
      this.emitSelectEvent_('click', null,  slide);
    };

    this.element_.addEventListener('mousemove', drag);
    this.element_.addEventListener('touchmove', drag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend',endDrag);
  };

  /**
   * Handle click
   * @param event
   * @private
   */
  MaterialExtCarousel.prototype.clickHandler_ = function(event) {
    // Click is handled by drag
    event.preventDefault();
  };

  /**
   * Handle focus
   * @param event
   * @private
   */
  MaterialExtCarousel.prototype.focusHandler_ = function(event) {
    const slide = getSlide_(event.target);
    if(slide) {
      // The last focused/selected slide has 'aria-selected', even if focus is lost
      this.setAriaSelected_(slide);
      slide.classList.add(IS_FOCUSED);
    }
  };

  /**
   * Handle blur
   * @param event
   * @private
   */
  MaterialExtCarousel.prototype.blurHandler_ = function(event) {
    const slide = getSlide_(event.target);
    if(slide) {
      slide.classList.remove(IS_FOCUSED);
    }
  };

  /**
   * Emits a custeom 'select' event
   * @param command
   * @param keyCode
   * @param slide
   * @private
   */
  MaterialExtCarousel.prototype.emitSelectEvent_ = function(command, keyCode, slide) {

    if(slide) {
      this.moveSlideIntoViewport_(slide);

      const evt = new CustomEvent('select', {
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
  MaterialExtCarousel.prototype.getSlidesInViewport_ = function() {
    const carouselRect = this.element_.getBoundingClientRect();

    const slidesInViewport = [...this.element_.querySelectorAll(`.${SLIDE}`)].filter( slide => {
      const slideRect = slide.getBoundingClientRect();
      return slideRect.left >= carouselRect.left && slideRect.right <= carouselRect.right;
    });
    return slidesInViewport;
  };

  /**
   * Move slide into component viewport - if needed
   * @param slide
   * @private
   */
  MaterialExtCarousel.prototype.moveSlideIntoViewport_ = function(slide) {
    const carouselRect = this.element_.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();

    if(slideRect.left < carouselRect.left) {
      const x = this.element_.scrollLeft - (carouselRect.left - slideRect.left);
      this.animateScroll_(x);
    }
    else if(slideRect.right > carouselRect.right) {
      const x = this.element_.scrollLeft - (carouselRect.right - slideRect.right);
      this.animateScroll_(x);
    }
  };


  /**
   * Removes 'aria-selected' from all slides in carousel
   * @private
   */
  MaterialExtCarousel.prototype.setAriaSelected_ = function(slide) {
    if(slide) {
      [...this.element_.querySelectorAll(`.${SLIDE}[aria-selected]`)].forEach(
        slide => slide.removeAttribute('aria-selected')
      );
      slide.setAttribute('aria-selected', '');
    }
  };

  /**
   * Removes event listeners
   * @private
   */
  MaterialExtCarousel.prototype.removeListeners_ = function() {
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
  const getSlide_ = element => {
    return element.closest(`.${SLIDE}`);
  };

  const setFocus_ = slide => {
    if(slide) {
      slide.focus();
    }
  };

  const addRipple_ = slide => {
    if(!slide.querySelector(`.${MDL_RIPPLE_CONTAINER}`)) {
      const rippleContainer = document.createElement('span');
      rippleContainer.classList.add(MDL_RIPPLE_CONTAINER);
      rippleContainer.classList.add(MDL_RIPPLE_EFFECT);
      const ripple = document.createElement('span');
      ripple.classList.add(MDL_RIPPLE);
      rippleContainer.appendChild(ripple);

      const img = slide.querySelector('img');
      if (img) {
        // rippleContainer blocks image title
        rippleContainer.title = img.title;
      }
      slide.appendChild(rippleContainer);
      componentHandler.upgradeElement(rippleContainer, MDL_RIPPLE_COMPONENT);
    }
  };
  // End helpers


  // Public methods.

  /**
   * Cancel animation - if running.
   *
   * @public
   */
  MaterialExtCarousel.prototype.stopAnimation = function() {
    this.config_.animationLoop.stop();
  };
  MaterialExtCarousel.prototype['stopAnimation'] = MaterialExtCarousel.prototype.stopAnimation;


  /**
   * Upgrade slides
   * Use if more list elements are added later (dynamically)
   *
   * @public
   */
  MaterialExtCarousel.prototype.upgradeSlides = function() {

    const hasRippleEffect = this.element_.classList.contains(MDL_RIPPLE_EFFECT);

    [...this.element_.querySelectorAll(`.${SLIDE}`)].forEach( slide => {

      slide.setAttribute('role', SLIDE_ROLE);

      if(this.config_.interactive) {
        if(!slide.getAttribute('tabindex')) {
          slide.setAttribute('tabindex', '0');
        }
        if (hasRippleEffect) {
          addRipple_(slide);
        }
      }
      else {
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
  MaterialExtCarousel.prototype.getConfig = function() {
    return this.config_;
  };
  MaterialExtCarousel.prototype['getConfig'] = MaterialExtCarousel.prototype.getConfig;

  /**
   * Initialize component
   */
  MaterialExtCarousel.prototype.init = function() {

    if (this.element_) {
      // Config
      if(this.element_.hasAttribute('data-config')) {
        this.config_ = jsonStringToObject(this.element_.getAttribute('data-config'), this.config_);
      }

      // Wai-Aria
      this.element_.setAttribute('role', ROLE);

      // Prefer tabindex -1
      if(!Number.isInteger(this.element_.getAttribute('tabindex'))) {
        this.element_.setAttribute('tabindex', -1);
      }

      // Remove listeners, just in case ...
      this.removeListeners_();

      if(this.config_.interactive) {

        // Ripple
        const hasRippleEffect = this.element_.classList.contains(MDL_RIPPLE_EFFECT);
        if (hasRippleEffect) {
          this.element_.classList.add(MDL_RIPPLE_EFFECT_IGNORE_EVENTS);
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
      this.element_.classList.add(IS_UPGRADED);

      if(this.config_.autostart) {
        // Start slideshow
        this.startSlideShow_();
      }
    }
  };

  /*
   * Downgrade component
   * E.g remove listeners and clean up resources
   */
  MaterialExtCarousel.prototype.mdlDowngrade_ = function() {
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
