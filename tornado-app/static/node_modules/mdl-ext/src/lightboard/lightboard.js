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
 * A lightboard is a translucent surface illuminated from behind, used for situations
 * where a shape laid upon the surface needs to be seen with high contrast. In the "old days" of photography
 * photograpers used a lightboard to get a quick view of their slides. The goal is to create a responsive lightbox
 * design, based on flex layout, similar to what is used in Adobe LightRoom to browse images.
 */

import {
  VK_ENTER,
  VK_SPACE,
  VK_END,
  VK_HOME,
  VK_ARROW_LEFT,
  VK_ARROW_UP,
  VK_ARROW_RIGHT,
  VK_ARROW_DOWN,
  IS_UPGRADED,
  MDL_RIPPLE,
  MDL_RIPPLE_COMPONENT,
  MDL_RIPPLE_EFFECT,
  MDL_RIPPLE_EFFECT_IGNORE_EVENTS
} from '../utils/constants';

const MDL_RIPPLE_CONTAINER = 'mdlext-lightboard__slide__ripple-container';

(function() {
  'use strict';

  //const LIGHTBOARD = 'mdlext-lightboard';
  const LIGHTBOARD_ROLE = 'grid';
  const SLIDE = 'mdlext-lightboard__slide';
  const SLIDE_ROLE  = 'gridcell';
  const SLIDE_TABSTOP = 'mdlext-lightboard__slide__frame';
  /**
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtLightboard = function MaterialExtLightboard(element) {
    // Stores the element.
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialExtLightboard'] = MaterialExtLightboard;


  // Helpers
  const getSlide = element => {
    return element ? element.closest(`.${SLIDE}`) : null;
  };



  // Private methods.

  /**
   * Select a slide, i.e. set aria-selected="true"
   * @param element
   * @private
   */
  MaterialExtLightboard.prototype.selectSlide_ = function(element) {
    const slide = getSlide(element);
    if( slide && !slide.hasAttribute('aria-selected') ) {
      [...this.element_.querySelectorAll(`.${SLIDE}[aria-selected="true"]`)]
        .forEach(selectedSlide => selectedSlide.removeAttribute('aria-selected'));

      slide.setAttribute('aria-selected', 'true');
    }
  };


  /**
   * Dispatch select event
   * @param {Element} slide The slide that caused the event
   * @private
   */
  MaterialExtLightboard.prototype.dispatchSelectEvent_ = function ( slide ) {
    this.element_.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        cancelable: true,
        detail: { source: slide }
      })
    );
  };

  /**
   * Handles custom command event, 'first', 'next', 'prev', 'last', 'select' or upgrade
   * @param event. A custom event
   * @private
   */
  MaterialExtLightboard.prototype.commandHandler_ = function( event ) {
    event.preventDefault();
    event.stopPropagation();

    if(event && event.detail) {
      this.command(event.detail);
    }
  };


  // Public methods

  /**
   * Initialize lightboard slides
   * @public
   */
  MaterialExtLightboard.prototype.upgradeSlides = function() {

    const addRipple = slide => {
      // Use slide frame as ripple container
      if(!slide.querySelector(`.${MDL_RIPPLE_CONTAINER}`)) {
        const a = slide.querySelector(`.${SLIDE_TABSTOP}`);
        if(a) {
          const rippleContainer = a;
          rippleContainer.classList.add(MDL_RIPPLE_CONTAINER);
          rippleContainer.classList.add(MDL_RIPPLE_EFFECT);
          const ripple = document.createElement('span');
          ripple.classList.add(MDL_RIPPLE);
          rippleContainer.appendChild(ripple);
          componentHandler.upgradeElement(rippleContainer, MDL_RIPPLE_COMPONENT);
        }
      }
    };

    const hasRippleEffect = this.element_.classList.contains(MDL_RIPPLE_EFFECT);

    [...this.element_.querySelectorAll(`.${SLIDE}`)].forEach( slide => {

      slide.setAttribute('role', SLIDE_ROLE);

      if(!slide.querySelector('a')) {
        slide.setAttribute('tabindex', '0');
      }
      if(hasRippleEffect) {
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
  MaterialExtLightboard.prototype.command = function( detail ) {

    const firstSlide = () => {
      return this.element_.querySelector(`.${SLIDE}:first-child`);
    };

    const lastSlide = () => {
      return this.element_.querySelector(`.${SLIDE}:last-child`);
    };

    const nextSlide = () => {
      const slide = this.element_.querySelector(`.${SLIDE}[aria-selected="true"]`).nextElementSibling;
      return slide ? slide : firstSlide();
    };

    const prevSlide = () => {
      const slide = this.element_.querySelector(`.${SLIDE}[aria-selected="true"]`).previousElementSibling;
      return slide ? slide : lastSlide();
    };

    if(detail && detail.action) {

      const { action, target } = detail;

      let slide;
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
          throw new Error(`Unknown action "${action}". Action must be one of "first", "next", "prev", "last", "select" or "upgrade"`);
      }

      if (slide) {
        const a = slide.querySelector('a');
        if (a) {
          a.focus();
        }
        else {
          slide.focus();
        }

        // Workaround for JSDom testing:
        // In JsDom 'element.focus()' does not trigger any focus event
        if(!slide.hasAttribute('aria-selected')) {
          this.selectSlide_(slide);
        }

      }
    }
  };
  MaterialExtLightboard.prototype['command'] = MaterialExtLightboard.prototype.command;


  /**
   * Initialize component
   */
  MaterialExtLightboard.prototype.init = function() {

    const keydownHandler = event => {

      if(event.target !== this.element_) {
        let action;
        let target;
        switch (event.keyCode) {
          case VK_HOME:
            action = 'first';
            break;
          case VK_END:
            action = 'last';
            break;
          case VK_ARROW_UP:
          case VK_ARROW_LEFT:
            action = 'prev';
            break;
          case VK_ARROW_DOWN:
          case VK_ARROW_RIGHT:
            action = 'next';
            break;
          case VK_ENTER:
          case VK_SPACE:
            action = 'select';
            target = event.target;
            break;
        }
        if(action)  {
          event.preventDefault();
          event.stopPropagation();
          this.command( { action: action, target: target } );
        }
      }
    };

    const clickHandler = event => {
      event.preventDefault();
      event.stopPropagation();

      if(event.target !== this.element_) {
        this.command( { action: 'select', target: event.target } );
      }
    };

    const focusHandler = event => {
      event.preventDefault();
      event.stopPropagation();

      if(event.target !== this.element_) {
        this.selectSlide_(event.target);
      }
    };


    if (this.element_) {
      this.element_.setAttribute('role', LIGHTBOARD_ROLE);

      if (this.element_.classList.contains(MDL_RIPPLE_EFFECT)) {
        this.element_.classList.add(MDL_RIPPLE_EFFECT_IGNORE_EVENTS);
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

      this.element_.classList.add(IS_UPGRADED);
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
