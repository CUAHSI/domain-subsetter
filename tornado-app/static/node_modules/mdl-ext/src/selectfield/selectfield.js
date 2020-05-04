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

/*
 * Copied/Modified from https://github.com/google/material-design-lite/tree/master/src/textfield
 */

import { randomString } from '../utils/string-utils';
import {
  IS_DIRTY,
  IS_FOCUSED,
  IS_DISABLED,
  IS_INVALID,
  IS_UPGRADED
} from '../utils/constants';

(function() {
  'use strict';
  const LABEL = 'mdlext-selectfield__label';
  const INPUT = 'mdlext-selectfield__select';

  /**
   * Class constructor for Selectfield MDLEXT component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  const MaterialExtSelectfield = function MaterialExtSelectfield(element) {
    this.element_ = element;
    this.init(); // Initialize instance.
  };

  window['MaterialExtSelectfield'] = MaterialExtSelectfield;

  /**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  /*eslint no-unused-vars: 0*/
  MaterialExtSelectfield.prototype.onFocus_ = function( /*event*/ ) {
    this.element_.classList.add(IS_FOCUSED);
  };

  /**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  /*eslint no-unused-vars: 0*/
  MaterialExtSelectfield.prototype.onBlur_ = function( /*event*/ ) {
    this.element_.classList.remove(IS_FOCUSED);
  };

  /**
   * Handle reset event from out side.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialExtSelectfield.prototype.onReset_ = function( /*event*/ ) {
    this.updateClasses_();
  };

  /**
   * Handle class updates.
   *
   * @private
   */
  MaterialExtSelectfield.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
    this.checkFocus();
  };

  // Public methods.

  /**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.checkDisabled = function() {
    if (this.select_.disabled) {
      this.element_.classList.add(IS_DISABLED);
    } else {
      this.element_.classList.remove(IS_DISABLED);
    }
  };
  MaterialExtSelectfield.prototype['checkDisabled'] = MaterialExtSelectfield.prototype.checkDisabled;


  /**
   * Check the focus state and update field accordingly.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.checkFocus = function() {
    // Note: element.querySelector(':focus') always return null in JsDom, even if select element has focus
    /*eslint no-extra-boolean-cast: 0*/
    if (Boolean(this.element_.querySelector(':focus'))) {
      this.element_.classList.add(IS_FOCUSED);
    } else {
      this.element_.classList.remove(IS_FOCUSED);
    }
  };

  MaterialExtSelectfield.prototype['checkFocus'] = MaterialExtSelectfield.prototype.checkFocus;


  /**
   * Check the validity state and update field accordingly.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.checkValidity = function() {

    /* Don't think it makes any sense to check validity.
       Tests I've done, so far, indicates that setting an illegal value via JS returns selectedIndex=0

    if (this.select_.validity) {
      if (this.select_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
    */
  };

  MaterialExtSelectfield.prototype['checkValidity'] = MaterialExtSelectfield.prototype.checkValidity;

  /**
   * Check the dirty state and update field accordingly.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.checkDirty = function() {
    if (this.select_.value && this.select_.value.length > 0) {
      this.element_.classList.add(IS_DIRTY);
    } else {
      this.element_.classList.remove(IS_DIRTY);
    }
  };

  MaterialExtSelectfield.prototype['checkDirty'] = MaterialExtSelectfield.prototype.checkDirty;

  /**
   * Disable select field.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.disable = function() {
    this.select_.disabled = true;
    this.updateClasses_();
  };

  MaterialExtSelectfield.prototype['disable'] = MaterialExtSelectfield.prototype.disable;

  /**
   * Enable select field.
   *
   * @public
   */
  MaterialExtSelectfield.prototype.enable = function() {
    this.select_.disabled = false;
    this.updateClasses_();
  };

  MaterialExtSelectfield.prototype['enable'] = MaterialExtSelectfield.prototype.enable;

  /**
   * Update select field value.
   *
   * @param {string} value The value to which to set the control (optional).
   * @public
   */
  MaterialExtSelectfield.prototype.change = function(value) {
    this.select_.value = value || '';
    this.updateClasses_();
  };
  MaterialExtSelectfield.prototype['change'] = MaterialExtSelectfield.prototype.change;

  /**
   * Initialize element.
   */
  MaterialExtSelectfield.prototype.init = function() {
    if (this.element_) {
      this.label_ = this.element_.querySelector(`.${LABEL}`);
      this.select_ = this.element_.querySelector(`.${INPUT}`);

      if (this.select_) {
        // Remove listeners, just in case ...
        this.select_.removeEventListener('change', this.updateClasses_);
        this.select_.removeEventListener('focus', this.onFocus_);
        this.select_.removeEventListener('blur', this.onBlur_);
        this.select_.removeEventListener('reset', this.onReset_);

        this.select_.addEventListener('change', this.updateClasses_.bind(this));
        this.select_.addEventListener('focus', this.onFocus_.bind(this));
        this.select_.addEventListener('blur', this.onBlur_.bind(this));
        this.select_.addEventListener('reset', this.onReset_.bind(this));

        if(this.label_) {
          let id;
          if(!this.select_.hasAttribute('id')) {
            id = `select-${randomString()}`;
            this.select_.id = id;
          }
          else {
            id = this.select_.id;
          }

          if(!this.label_.hasAttribute('for')) {
            this.label_.setAttribute('for', id);
          }
        }

        const invalid = this.element_.classList.contains(IS_INVALID);
        this.updateClasses_();
        this.element_.classList.add(IS_UPGRADED);

        if (invalid) {
          this.element_.classList.add(IS_INVALID);
        }
        if (this.select_.hasAttribute('autofocus')) {
          this.element_.focus();
          this.checkFocus();
        }
      }
    }
  };

  /**
   * Downgrade component
   * E.g remove listeners and clean up resources
   *
   * Nothing to downgrade
   *
  MaterialExtSelectfield.prototype.mdlDowngrade_ = function() {
    'use strict';
    console.log('***** MaterialExtSelectfield.mdlDowngrade ');
  };
  */

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  /*eslint no-undef: 0*/
  componentHandler.register({
    constructor: MaterialExtSelectfield,
    classAsString: 'MaterialExtSelectfield',
    cssClass: 'mdlext-js-selectfield',
    widget: true
  });
})();
