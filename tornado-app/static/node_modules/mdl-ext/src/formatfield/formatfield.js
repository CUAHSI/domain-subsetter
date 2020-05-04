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


import {jsonStringToObject} from '../utils/json-utils';
import {
  IS_UPGRADED,
} from '../utils/constants';

const JS_FORMAT_FIELD = 'mdlext-js-formatfield';
const FORMAT_FIELD_COMPONENT = 'MaterialExtFormatfield';

/**
 * Detect browser locale
 * @returns {string} the locale
 * @see http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
 */
const browserLanguage = () => {
  return navigator.languages
    ? navigator.languages[0]
    : navigator.language || navigator.userLanguage;
};

/**
 * The formatfield  formats an input field  using language sensitive number formatting.
 */

class FormatField {
  static timer = null;

  element_;
  input_;
  options_ = {};
  intlGroupSeparator_;
  intlDecimalSeparator_;

  constructor(element) {
    this.element_ = element;
    this.init();
  }

  clickHandler = () => {
    clearTimeout(FormatField.timer);
  };

  focusInHandler = () => {
    if(!(this.input.readOnly || this.input.disabled)) {
      this.input.value = this.unformatInput();
      //setTimeout(() => this.input.setSelectionRange(0, this.input.value.length), 20);
      FormatField.timer = setTimeout(() => this.input.select(), 200);
    }
  };

  focusOutHandler = () => {
    clearTimeout(FormatField.timer);

    if(!(this.input.readOnly || this.input.disabled)) {
      this.formatValue();
    }
  };

  get element() {
    return this.element_;
  }

  get input() {
    return this.input_;
  }

  get options() {
    return this.options_;
  }

  stripSeparatorsFromValue() {
    const doReplace = () => this.input.value
      .replace(/\s/g, '')
      .replace(new RegExp(this.options.groupSeparator, 'g'), '')
      .replace(this.options.decimalSeparator, '.');
      //.replace(this.intlGroupSeparator_, ''),
      //.replace(this.intlDecimalSeparator_, '.');

    return this.input.value ? doReplace() : this.input.value;
  }

  fixSeparators(value) {
    const doReplace = () => value
      .replace(new RegExp(this.intlGroupSeparator_, 'g'), this.options.groupSeparator)
      .replace(this.intlDecimalSeparator_, this.options.decimalSeparator);

    return value ? doReplace() : value;
  }

  formatValue() {
    if(this.input.value) {
      const v = new Intl.NumberFormat(this.options.locales, this.options)
        .format(this.stripSeparatorsFromValue());

      if('NaN' !== v) {
        this.input.value = this.fixSeparators(v);
      }
    }
  }

  unformat() {
    const doReplace = () => this.input.value
      .replace(/\s/g, '')
      .replace(new RegExp(this.options.groupSeparator, 'g'), '')
      .replace(this.options.decimalSeparator, '.');

    return this.input.value ? doReplace() : this.input.value;
  }

  unformatInput() {
    const doReplace = () => this.input.value
      .replace(/\s/g, '')
      .replace(new RegExp(this.options.groupSeparator, 'g'), '');

    return this.input.value ? doReplace() : this.input.value;
  }

  removeListeners() {
    this.input.removeEventListener('click', this.clickHandler);
    this.input.removeEventListener('focusin', this.focusInHandler);
    this.input.removeEventListener('focusout', this.focusOutHandler);
  }

  init() {
    const addListeners = () => {
      this.input.addEventListener('click', this.clickHandler);
      this.input.addEventListener('focusin', this.focusInHandler);
      this.input.addEventListener('focusout', this.focusOutHandler);
    };

    const addOptions = () => {
      const opts = this.element.getAttribute('data-formatfield-options') ||
        this.input.getAttribute('data-formatfield-options');
      if(opts) {
        this.options_ = jsonStringToObject(opts, this.options);
      }
    };

    const addLocale = () => {
      if(!this.options.locales) {
        this.options.locales = browserLanguage() || 'en-US'; //'nb-NO', //'en-US',
      }
    };

    const addGrouping = () => {
      const s = (1234.5).toLocaleString(this.options.locales, {
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });

      this.intlGroupSeparator_ = s.charAt(1);
      this.intlDecimalSeparator_ = s.charAt(s.length-2);
      this.options.groupSeparator = this.options.groupSeparator || this.intlGroupSeparator_;
      this.options.decimalSeparator = this.options.decimalSeparator || this.intlDecimalSeparator_;

      if(this.options.groupSeparator === this.options.decimalSeparator) {
        const e = `Error! options.groupSeparator, "${this.options.groupSeparator}" ` +
          'and options.decimalSeparator, ' +
          `"${this.options.decimalSeparator}" should not be equal`;
        throw new Error(e);
      }
    };

    this.input_ = this.element.querySelector('input') || this.element;

    addOptions();
    addLocale();
    addGrouping();
    this.formatValue();
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
  const MaterialExtFormatfield = function MaterialExtFormatfield(element) {
    this.element_ = element;
    this.formatField_ = null;

    // Initialize instance.
    this.init();
  };
  window['MaterialExtFormatfield'] = MaterialExtFormatfield;

  /**
   * Initialize component
   */
  MaterialExtFormatfield.prototype.init = function() {
    if (this.element_) {
      this.element_.classList.add(IS_UPGRADED);
      this.formatField_ = new FormatField(this.element_);

      // Listen to 'mdl-componentdowngraded' event
      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
    }
  };

  /**
   * Get options object
   *
   * @public
   *
   * @returns {Object} the options object
   */
  MaterialExtFormatfield.prototype.getOptions = function() {
    return this.formatField_.options;
  };
  MaterialExtFormatfield.prototype['getOptions'] = MaterialExtFormatfield.prototype.getOptions;


  /**
   * A unformatted value is a string value where the locale specific decimal separator
   * is replaced with a '.' separator and group separators are stripped.
   * The returned value is suitable for parsing to a JavaScript numerical value.
   *
   * @example
   * input.value = '1 234,5';
   * inputElement.MaterialExtFormatfield.getUnformattedValue();
   * // Returns '1234.5'
   *
   * @public
   *
   * @returns {String} the unformatted value
   */
  MaterialExtFormatfield.prototype.getUnformattedValue = function() {
    return this.formatField_.unformat();
  };
  MaterialExtFormatfield.prototype['getUnformattedValue'] = MaterialExtFormatfield.prototype.getUnformattedValue;

  /*
   * Downgrade component
   * E.g remove listeners and clean up resources
   */
  MaterialExtFormatfield.prototype.mdlDowngrade_ = function() {
    this.formatField_.downgrade();
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  /* eslint no-undef: 0 */
  componentHandler.register({
    constructor: MaterialExtFormatfield,
    classAsString: FORMAT_FIELD_COMPONENT,
    cssClass: JS_FORMAT_FIELD,
    widget: true
  });

})();
