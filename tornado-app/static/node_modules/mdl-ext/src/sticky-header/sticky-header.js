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
 * A sticky header makes site navigation easily accessible anywhere on the page and saves content space at the same.
 * The header should auto-hide, i.e. hiding the header automatically when a user starts scrolling down the page and
 * bringing the header back when a user might need it: they reach the bottom of the page or start scrolling up.
 */

import fullThrottle from '../utils/full-throttle';
import { jsonStringToObject } from '../utils/json-utils';
import {
  IS_UPGRADED
} from '../utils/constants';


(function() {
  'use strict';
  const MDL_LAYOUT_CONTENT  = 'mdl-layout__content';
  const IS_SCROLL_CLASS  = 'mdlext-is-scroll';


  /**
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtStickyHeader = function MaterialExtStickyHeader(element) {
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
  MaterialExtStickyHeader.prototype.recalcWidth_ = function() {
    this.header_.style.width = `${this.content_.clientWidth}px`;
  };

  const throttleResize = fullThrottle(self => self.recalcWidth_() );

  /**
   * Adjust header width when window resizes or oreientation changes
   * @param event
   * @private
   */
  MaterialExtStickyHeader.prototype.resizeHandler_ = function( /* event */ ) {
    throttleResize(this);
  };


  /**
   * Update header position
   * @private
   */
  MaterialExtStickyHeader.prototype.reposition_ = function() {

    const currentContentScrollTop = this.content_.scrollTop;
    const scrollDiff = this.lastScrollTop_ - currentContentScrollTop;

    if(currentContentScrollTop <= 0) {
      // Scrolled to the top. Header sticks to the top
      this.header_.style.top = '0';
      this.header_.classList.remove(IS_SCROLL_CLASS);
    }
    else if(scrollDiff > 0) {

      if(scrollDiff >= this.header_.offsetHeight) {

        // Scrolled up. Header slides in
        const headerTop = (parseInt( window.getComputedStyle( this.header_ ).getPropertyValue( 'top' ) ) || 0);
        if(headerTop != 0) {
          this.header_.style.top = '0';
          this.header_.classList.add(IS_SCROLL_CLASS);
        }
        this.lastScrollTop_ = currentContentScrollTop;
      }
      return;
    }
    else if(scrollDiff < 0) {
      // Scrolled down
      this.header_.classList.add(IS_SCROLL_CLASS);
      let headerTop = (parseInt( window.getComputedStyle( this.header_ ).getPropertyValue( 'top' ) ) || 0);

      if (this.content_.scrollHeight - this.content_.scrollTop <= this.content_.offsetHeight) {
        // Bottom of content
        if(headerTop != 0) {
          this.header_.style.top = this.config_.visibleAtScrollEnd ? '0' : `-${this.header_.offsetHeight}px`;
        }
      }
      else {
        headerTop += scrollDiff;
        const offsetHeight = this.header_.offsetHeight;
        this.header_.style.top = `${( Math.abs( headerTop ) > offsetHeight ? -offsetHeight : headerTop )}px`;
      }
    }

    this.lastScrollTop_ = currentContentScrollTop;
  };


  const throttleScroll = fullThrottle((self) => self.reposition_());

  /**
   * Scroll header when content scrolls
   * @param event
   * @private
   */
  MaterialExtStickyHeader.prototype.scrollHandler_ = function( /* event */ ) {
    throttleScroll(this);
  };

  /**
   * Init header position
   * @private
   */
  MaterialExtStickyHeader.prototype.updatePosition_ = function( /* event */ ) {
    this.recalcWidth_();
    this.reposition_();
  };

  /**
   * Add mutation observer
   * @private
   */
  MaterialExtStickyHeader.prototype.addMutationObserver_ = function() {

    // jsdom does not support MutationObserver - so this is not testable
    /* istanbul ignore next */
    this.mutationObserver_ = new MutationObserver( ( /*mutations*/ ) => {
      // Adjust header width if content changes (e.g. in a SPA)
      this.updatePosition_();
    });

    this.mutationObserver_.observe( this.content_, {
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
  MaterialExtStickyHeader.prototype.removeListeners_ = function() {

    window.removeEventListener('resize', this.resizeHandler_);
    window.removeEventListener('orientationchange', this.resizeHandler_);

    if(this.content_) {
      this.content_.removeEventListener('scroll', this.scrollHandler_);
    }

    if(this.mutationObserver_) {
      this.mutationObserver_.disconnect();
      this.mutationObserver_ = null;
    }
  };

  /**
   * Initialize component
   */
  MaterialExtStickyHeader.prototype.init = function() {

    if (this.header_) {

      this.removeListeners_();

      if(this.header_.hasAttribute('data-config')) {
        this.config_ = jsonStringToObject(this.header_.getAttribute('data-config'));
      }

      this.content_ = this.header_.parentNode.querySelector(`.${MDL_LAYOUT_CONTENT}`) || null;

      if(this.content_) {
        this.content_.style.paddingTop = `${this.header_.offsetHeight}px`;  // Make room for sticky header
        this.lastScrollTop_ = this.content_.scrollTop;

        this.content_.addEventListener('scroll', this.scrollHandler_.bind(this));
        window.addEventListener('resize', this.resizeHandler_.bind(this));
        window.addEventListener('orientationchange', this.resizeHandler_.bind(this));

        this.addMutationObserver_();
        this.updatePosition_();

        // Set upgraded flag
        this.header_.classList.add(IS_UPGRADED);
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
})();
