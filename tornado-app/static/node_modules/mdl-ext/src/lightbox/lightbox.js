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

import fullThrottle from '../utils/full-throttle';
import {
  VK_ESC,
  VK_SPACE,
  VK_END,
  VK_HOME,
  VK_ARROW_LEFT,
  VK_ARROW_UP,
  VK_ARROW_RIGHT,
  VK_ARROW_DOWN,
  IS_UPGRADED
} from '../utils/constants';

(function() {
  'use strict';

  const LIGHTBOX = 'mdlext-lightbox';
  const LIGHTBOX_SLIDER = 'mdlext-lightbox__slider';
  const LIGHTBOX_SLIDER_SLIDE = 'mdlext-lightbox__slider__slide';
  const STICKY_FOOTER = 'mdlext-lightbox--sticky-footer';
  const BUTTON = 'mdl-button';

  /**
   * https://github.com/google/material-design-lite/issues/4205
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtLightbox = function MaterialExtLightbox(element) {
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
  MaterialExtLightbox.prototype.keyDownHandler_ = function(event) {

    if (event) {
      if ( event.keyCode === VK_ESC || event.keyCode === VK_SPACE
        || event.keyCode === VK_END || event.keyCode === VK_HOME
        || event.keyCode === VK_ARROW_UP || event.keyCode === VK_ARROW_LEFT
        || event.keyCode === VK_ARROW_DOWN || event.keyCode === VK_ARROW_RIGHT) {

        if(event.keyCode !== VK_ESC) {
          event.preventDefault();
          event.stopPropagation();
        }

        let action = 'first';
        if (event.keyCode === VK_END) {
          action = 'last';
        }
        else if (event.keyCode === VK_ARROW_UP || event.keyCode === VK_ARROW_LEFT) {
          action = 'prev';
        }
        else if (event.keyCode === VK_ARROW_DOWN || event.keyCode === VK_ARROW_RIGHT) {
          action = 'next';
        }
        else if (event.keyCode === VK_SPACE) {
          action = 'select';
        }
        else if (event.keyCode === VK_ESC) {
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
  MaterialExtLightbox.prototype.buttonClickHandler_ = function(event) {

    if (event) {
      event.preventDefault();
      event.stopPropagation();

      dispatchAction_(this.getAttribute('data-action') || '', this);

      const n = this.closest(`.${LIGHTBOX}`);
      if(n) {
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
  const dispatchAction_ = (action, source, target = source) => {

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
  const repositionDialog_ = lightboxElement => {
    const footerHeight = (footer, isSticky) => isSticky && footer ? footer.offsetHeight : 0;

    const reposition = (dialog, fh) => {
      if (window.getComputedStyle(dialog).position === 'absolute') {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const topValue = scrollTop + (window.innerHeight - dialog.offsetHeight - fh) / 2;
        dialog.style.top = `${Math.max(scrollTop, topValue)}px`;
      }
    };

    const p = lightboxElement.parentNode;
    const dialog = p && p.nodeName === 'DIALOG' ? p : null;

    if(dialog && dialog.hasAttribute('open')) {
      lightboxElement.style.width = 'auto';
      lightboxElement.style.maxWidth = '100%';
      const img = lightboxElement.querySelector('img');
      if(img) {
        lightboxElement.style.maxWidth = img.naturalWidth !== undefined ? `${img.naturalWidth}px` : `${img.width}px` || '100%';
      }

      const fh = footerHeight(lightboxElement.querySelector('footer'), lightboxElement.classList.contains(STICKY_FOOTER));
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - fh;
      if (dialog.offsetHeight > vh) {
        let n = 0;
        while(dialog.offsetHeight > vh && ++n < 4) {
          lightboxElement.style.width = `${lightboxElement.offsetWidth * vh / lightboxElement.offsetHeight}px`;
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

  MaterialExtLightbox.prototype.imgLoadHandler_ = function( /*event*/ ) {
    repositionDialog_(this);
  };


  /**
   * Handle image drag
   * @param event
   * @private
     */
  MaterialExtLightbox.prototype.imgDragHandler_ = function(event ) {

    const setStyles = ( element, properties ) => {
      //noinspection JSAnnotator
      for(const [key, value] of Object.entries(properties)) {
        element.style[key] = value;
      }
      // ... or:
      //for (const key in properties) {
      //  element.style[key] = properties[key];
      //}
    };

    event.preventDefault();
    //event.stopPropagation();

    const x = event.clientX || (event.touches !== undefined ? event.touches[0].clientX : 0);

    const img = this;
    img.style.opacity = '0.2';

    const slider = document.createElement('div');
    slider.classList.add(LIGHTBOX_SLIDER);
    setStyles(slider, {'width': `${img.offsetWidth}px`, 'height': `${img.offsetHeight}px`} );

    let slide  = document.createElement('div');
    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
    slide.textContent = '>';
    setStyles(slide, {
      'width'           : `${img.offsetWidth}px`,
      'height'          : `${img.offsetHeight}px`,
      'line-height'     : `${img.offsetHeight}px`,
      'font-size'       : `${img.offsetHeight/4}px`,
      'text-align'      : 'right',
      'background-image': `url("${img.getAttribute('data-img-url-prev') || ''}")`
    });
    slider.appendChild(slide);

    slide  = document.createElement('div');
    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
    setStyles(slide, {
      'width'           : `${img.offsetWidth}px`,
      'height'          : `${img.offsetHeight}px`,
      'background-image': `url("${img.src}")`
    });
    slider.appendChild(slide);

    slide  = document.createElement('div');
    slide.classList.add(LIGHTBOX_SLIDER_SLIDE);
    slide.textContent = '<';
    setStyles(slide, {
      'width'           : `${img.offsetWidth}px`,
      'height'          : `${img.offsetHeight}px`,
      'line-height'     : `${img.offsetHeight}px`,
      'font-size'       : `${img.offsetHeight/4}px`,
      'text-align'      : 'left',
      'background-image': `url("${img.getAttribute('data-img-url-next') || ''}")`
    });
    slider.appendChild(slide);

    img.parentNode.appendChild(slider);


    // drag handler
    const drag = e => {
      e.preventDefault();
      const dx = (e.clientX || (e.touches !== undefined ? e.touches[0].clientX : 0)) - x; // TODO: maybe rewrite to improve performance

      if(slider.offsetWidth - Math.abs(dx) > 19) {
        slider.style.left = `${dx}px`;
      }
    };

    // end drag handler
    const endDrag = e => {
      e.preventDefault();
      //e.stopPropagation();

      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);

      const dx = slider.offsetLeft;
      img.parentNode.removeChild(slider);
      img.style.opacity = '1.0';

      if(Math.abs(dx) > 19) {
        dispatchAction_( (dx > 0 ? 'prev' : 'next') , img);
      }
    };

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend',endDrag);
  };


  /**
   * Initialize component
   */
  MaterialExtLightbox.prototype.init = function() {

    if (this.element_) {
      // Do the init required for this component to work
      this.element_.addEventListener('keydown', this.keyDownHandler_.bind(this.element_), true);

      if(!Number.isInteger(this.element_.getAttribute('tabindex'))) {
        this.element_.setAttribute('tabindex', 1);
      }

      [...this.element_.querySelectorAll(`.${BUTTON}`)].forEach( button =>
        button.addEventListener('click', this.buttonClickHandler_.bind(button), false)
      );

      const figcaption = this.element_.querySelector('figcaption');
      if(figcaption) {
        figcaption.addEventListener('click', this.buttonClickHandler_.bind(figcaption), false);
      }

      const footer = this.element_.querySelector('footer');
      if(footer) {
        footer.addEventListener('click', this.buttonClickHandler_.bind(footer), false);
      }

      const img = this.element_.querySelector('img');
      if(img) {
        img.addEventListener('load', this.imgLoadHandler_.bind(this.element_), false);
        img.addEventListener('click', e => e.preventDefault(), true);
        img.addEventListener('mousedown', this.imgDragHandler_.bind(img), true);
        img.addEventListener('touchstart', this.imgDragHandler_.bind(img), true);
      }
      window.addEventListener('resize', fullThrottle( () => repositionDialog_(this.element_) ));
      window.addEventListener('orientationchange', () => repositionDialog_(this.element_));

      // Set upgraded flag
      this.element_.classList.add(IS_UPGRADED);
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

