/**
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

import {
  IS_UPGRADED,
  VK_SPACE,
  VK_ENTER,
} from '../utils/constants';

import { randomString } from '../utils/string-utils';
import { getParentElements, isFocusable } from '../utils/dom-utils';

const JS_COLLAPSIBLE = 'mdlext-js-collapsible';
const COLLAPSIBLE_CONTROL_CLASS = 'mdlext-collapsible';
const COLLAPSIBLE_GROUP_CLASS = 'mdlext-collapsible-group';
const COLLAPSIBLE_REGION_CLASS = 'mdlext-collapsible-region';

/**
 * The collapsible component
 */

class Collapsible {
  element_ = null;
  controlElement_ = null;

  /**
   * @constructor
   * @param {HTMLElement} element The element that this component is connected to.
   */
  constructor(element) {
    this.element_ = element;
    this.init();
  }

  keyDownHandler = event => {
    if (event.keyCode === VK_ENTER || event.keyCode === VK_SPACE) {
      event.preventDefault();

      // Trigger click
      (event.target || this.controlElement).dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
    }
  };

  clickHandler = event => {
    if(!this.isDisabled) {
      if(event.target !== this.controlElement) {
        // Do not toggle if a focusable element inside the control element triggered the event
        const p = getParentElements(event.target, this.controlElement);
        p.push(event.target);
        if(p.find( el => isFocusable(el))) {
          return;
        }
      }
      this.toggle();
    }
  };

  get element() {
    return this.element_;
  }

  get controlElement() {
    return this.controlElement_;
  }

  get isDisabled() {
    return (this.controlElement.hasAttribute('disabled') &&
      this.controlElement.getAttribute('disabled').toLowerCase() !== 'false') ||
      (this.controlElement.hasAttribute('aria-disabled') &&
      this.controlElement.getAttribute('aria-disabled').toLowerCase() !== 'false');
  }

  get isExpanded() {
    return this.controlElement.hasAttribute('aria-expanded') &&
      this.controlElement.getAttribute('aria-expanded').toLowerCase() === 'true';
  }

  get regionIds() {
    return this.controlElement.hasAttribute('aria-controls')
      ? this.controlElement.getAttribute('aria-controls').split(' ')
      : [];
  }

  get regionElements() {
    return this.regionIds
      .map(id => document.querySelector(`#${id}`))
      .filter( el => el != null);
  }

  collapse() {
    if(!this.isDisabled && this.isExpanded) {
      if(this.dispatchToggleEvent('collapse')) {
        this.controlElement.setAttribute('aria-expanded', 'false');
        const regions = this.regionElements.slice(0);
        for (let i = regions.length - 1; i >= 0; --i) {
          regions[i].setAttribute('hidden', '');
        }
      }
    }
  }

  expand() {
    if(!this.isDisabled && !this.isExpanded) {
      if(this.dispatchToggleEvent('expand')) {
        this.controlElement.setAttribute('aria-expanded', 'true');
        this.regionElements.forEach(region => region.removeAttribute('hidden'));
      }
    }
  }

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    }
    else {
      this.expand();
    }
  }

  dispatchToggleEvent(action) {
    return this.element.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        cancelable: true,
        detail: {
          action: action
        }
      })
    );
  }

  disableToggle() {
    this.controlElement.setAttribute('aria-disabled', true);
  }

  enableToggle() {
    this.controlElement.removeAttribute('aria-disabled');
  }

  addRegionId(regionId) {
    const ids = this.regionIds;
    if(!ids.find(id => regionId === id)) {
      ids.push(regionId);
      this.controlElement.setAttribute('aria-controls', ids.join(' '));
    }
  }

  addRegionElement(region) {
    if(!(region.classList.contains(COLLAPSIBLE_GROUP_CLASS) ||
      region.classList.contains(COLLAPSIBLE_REGION_CLASS))) {
      region.classList.add(COLLAPSIBLE_GROUP_CLASS);
    }

    if(!region.hasAttribute('role')) {
      const role = region.classList.contains(COLLAPSIBLE_GROUP_CLASS) ? 'group' : 'region';
      region.setAttribute('role', role);
    }

    if(!region.hasAttribute('id')) {
      region.id = `${region.getAttribute('role')}-${randomString()}`;
    }

    if(this.isExpanded) {
      region.removeAttribute('hidden');
    }
    else {
      region.setAttribute('hidden', '');
    }
    this.addRegionId(region.id);
  }

  removeRegionElement(region) {
    if(region && region.id) {
      const ids = this.regionIds.filter(id => id === region.id);
      this.controlElement.setAttribute('aria-controls', ids.join(' '));
    }
  }

  removeListeners() {
    this.controlElement.removeEventListener('keydown', this.keyDownHandler);
    this.controlElement.removeEventListener('click', this.clickHandler);
  }

  init() {
    const initControl = () => {
      // Find the button element
      this.controlElement_ = this.element.querySelector(`.${COLLAPSIBLE_CONTROL_CLASS}`) || this.element;

      // Add "aria-expanded" attribute if not present
      if(!this.controlElement.hasAttribute('aria-expanded')) {
        this.controlElement.setAttribute('aria-expanded', 'false');
      }

      // Add role=button if control != <button>
      if(this.controlElement.nodeName.toLowerCase() !== 'button') {
        this.controlElement.setAttribute('role', 'button');
      }

      // Add tabindex
      if(!isFocusable(this.controlElement) && !this.controlElement.hasAttribute('tabindex')) {
        this.controlElement.setAttribute('tabindex', '0');
      }
    };

    const initRegions = () => {
      let regions = [];
      if(!this.controlElement.hasAttribute('aria-controls')) {
        // Add siblings as collapsible region(s)
        let r = this.element.nextElementSibling;
        while(r) {
          if(r.classList.contains(COLLAPSIBLE_GROUP_CLASS) ||
            r.classList.contains(COLLAPSIBLE_REGION_CLASS)) {
            regions.push(r);
          }
          else if(r.classList.contains(JS_COLLAPSIBLE)) {
            // A new collapsible component
            break;
          }
          r = r.nextElementSibling;
        }
      }
      else {
        regions = this.regionElements;
      }
      regions.forEach(region => this.addRegionElement(region));
    };

    const addListeners = () => {
      this.controlElement.addEventListener('keydown', this.keyDownHandler);
      this.controlElement.addEventListener('click', this.clickHandler);
    };

    initControl();
    initRegions();
    this.removeListeners();
    addListeners();
  }

  downgrade() {
    this.removeListeners();
  }

}

(function() {
  'use strict';

  /**
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  const MaterialExtCollapsible = function MaterialExtCollapsible(element) {
    this.element_ = element;
    this.collapsible = null;

    // Initialize instance.
    this.init();
  };
  window['MaterialExtCollapsible'] = MaterialExtCollapsible;

  /**
   * Initialize component
   */
  MaterialExtCollapsible.prototype.init = function() {
    if (this.element_) {
      this.collapsible = new Collapsible(this.element_);
      this.element_.classList.add(IS_UPGRADED);

      // Listen to 'mdl-componentdowngraded' event
      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
    }
  };

  /*
   * Downgrade component
   * E.g remove listeners and clean up resources
   */
  MaterialExtCollapsible.prototype.mdlDowngrade_ = function() {
    this.collapsible.downgrade();
  };


  // Public methods.

  /**
   * Get control element.
   * @return {HTMLElement} element The element that controls the collapsible region.
   * @public
   */
  MaterialExtCollapsible.prototype.getControlElement = function() {
    return this.collapsible.controlElement;
  };
  MaterialExtCollapsible.prototype['getControlElement'] = MaterialExtCollapsible.prototype.getControlElement;

  /**
   * Get region elements controlled by this collapsible
   * @returns {Array<HTMLElement>} the collapsible region elements
   * @public
   */
  MaterialExtCollapsible.prototype.getRegionElements = function() {
    return this.collapsible.regionElements;
  };
  MaterialExtCollapsible.prototype['getRegionElements'] = MaterialExtCollapsible.prototype.getRegionElements;

  /**
   * Add region elements.
   * @param {Array<HTMLElement>} elements The element that will be upgraded.
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.addRegionElements = function(...elements) {
    elements.forEach(element => this.collapsible.addRegionElement(element));
  };
  MaterialExtCollapsible.prototype['addRegionElements'] = MaterialExtCollapsible.prototype.addRegionElements;

  /**
   * Remove collapsible region(s) from component.
   * Note: This operation does not delete the element from the DOM tree.
   * @param {Array<HTMLElement>} elements The element that will be upgraded.
   * @public
   */
  MaterialExtCollapsible.prototype.removeRegionElements = function(...elements) {
    elements.forEach(element => this.collapsible.removeRegionElement(element));
  };
  MaterialExtCollapsible.prototype['removeRegionElements'] = MaterialExtCollapsible.prototype.removeRegionElements;

  /**
   * Expand collapsible region(s)
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.expand = function() {
    this.collapsible.expand();
  };
  MaterialExtCollapsible.prototype['expand'] = MaterialExtCollapsible.prototype.expand;

  /**
   * Collapse collapsible region(s)
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.collapse = function() {
    this.collapsible.collapse();
  };
  MaterialExtCollapsible.prototype['collapse'] = MaterialExtCollapsible.prototype.collapse;

  /**
   * Toggle collapsible region(s)
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.toggle = function() {
    this.collapsible.toggle();
  };
  MaterialExtCollapsible.prototype['toggle'] = MaterialExtCollapsible.prototype.toggle;

  /**
   * Check whether component has aria-expanded state true
   * @return {Boolean} true if aria-expanded="true", otherwise false
   */
  MaterialExtCollapsible.prototype.isExpanded = function() {
    return this.collapsible.isExpanded;
  };
  MaterialExtCollapsible.prototype['isExpanded'] = MaterialExtCollapsible.prototype.isExpanded;

  /**
   * Check whether component has aria-disabled state set to true
   * @return {Boolean} true if aria-disabled="true", otherwise false
   */
  MaterialExtCollapsible.prototype.isDisabled = function() {
    return this.collapsible.isDisabled;
  };
  MaterialExtCollapsible.prototype['isDisabled'] = MaterialExtCollapsible.prototype.isDisabled;

  /**
   * Disables toggling of collapsible region(s)
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.disableToggle = function() {
    this.collapsible.disableToggle();
  };
  MaterialExtCollapsible.prototype['disableToggle'] = MaterialExtCollapsible.prototype.disableToggle;

  /**
   * Enables toggling of collapsible region(s)
   * @return {void}
   * @public
   */
  MaterialExtCollapsible.prototype.enableToggle = function() {
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
