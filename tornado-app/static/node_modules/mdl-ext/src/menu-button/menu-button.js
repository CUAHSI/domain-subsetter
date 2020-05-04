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
 * A menu button is a button that opens a menu. It is often styled as a
 * typical push button with a downward pointing arrow or triangle to hint
 * that activating the button will display a menu.
 */
import { randomString } from '../utils/string-utils';
import fullThrottle from '../utils/full-throttle';
import {
  VK_TAB,
  VK_ENTER,
  VK_ESC,
  VK_SPACE,
  VK_END,
  VK_HOME,
  VK_ARROW_LEFT,
  VK_ARROW_UP,
  VK_ARROW_RIGHT,
  VK_ARROW_DOWN,
  IS_UPGRADED,
} from '../utils/constants';

import { getScrollParents, tether } from '../utils/dom-utils';

const JS_MENU_BUTTON = 'mdlext-js-menu-button';
const MENU_BUTTON_MENU = 'mdlext-menu';
const MENU_BUTTON_MENU_ITEM = 'mdlext-menu__item';
const MENU_BUTTON_MENU_ITEM_SEPARATOR = 'mdlext-menu__item-separator';
//const MDL_LAYOUT_CONTENT = 'mdl-layout__content';

/**
 * Creates the menu controlled by the menu button
 * @param element
 * @return {{element: Element, selected: Element, open: (function(*=)), removeListeners: (function()), downgrade: (function())}}
 */

const menuFactory = element => {

  let ariaControls = null;
  let parentNode = null;

  const removeAllSelected = () => {
    [...element.querySelectorAll(`.${MENU_BUTTON_MENU_ITEM}[aria-selected="true"]`)]
      .forEach(selectedItem => selectedItem.removeAttribute('aria-selected'));
  };

  const setSelected = (item, force=false) => {
    if(force || (item && !item.hasAttribute('aria-selected'))) {
      removeAllSelected();
      if(item) {
        item.setAttribute('aria-selected', 'true');
      }
    }
  };

  const getSelected = () => {
    return element.querySelector(`.${MENU_BUTTON_MENU_ITEM}[aria-selected="true"]`);
  };

  const isDisabled = item => item && item.hasAttribute('disabled');

  const isSeparator = item => item && item.classList.contains(MENU_BUTTON_MENU_ITEM_SEPARATOR);

  const focus = item => {
    if(item) {
      item = item.closest(`.${MENU_BUTTON_MENU_ITEM}`);
    }
    if(item) {
      item.focus();
    }
  };

  const nextItem = current => {
    let n = current.nextElementSibling;
    if(!n) {
      n = element.firstElementChild;
    }
    if(!isDisabled(n) && !isSeparator(n)) {
      focus(n);
    }
    else {
      let i = element.children.length;
      while(n && i-- > 0) {
        if(isDisabled(n) || isSeparator(n)) {
          n = n.nextElementSibling;
          if(!n) {
            n = element.firstElementChild;
          }
        }
        else {
          focus(n);
          break;
        }
      }
    }
  };

  const previousItem = current => {
    let p = current.previousElementSibling;
    if(!p) {
      p = element.lastElementChild;
    }
    if(!isDisabled(p) && !isSeparator(p)) {
      focus(p);
    }
    else {
      let i = element.children.length;
      while(p && i-- > 0) {
        if(isDisabled(p) || isSeparator(p)) {
          p = p.previousElementSibling;
          if(!p) {
            p = element.lastElementChild;
          }
        }
        else {
          focus(p);
          break;
        }
      }
    }
  };

  const firstItem = () => {
    const item = element.firstElementChild;
    if(isDisabled(item) || isSeparator(item) ) {
      nextItem(item);
    }
    else {
      focus(item);
    }
  };

  const lastItem = () => {
    const item = element.lastElementChild;
    if(isDisabled(item) || isSeparator(item)) {
      previousItem(item);
    }
    else {
      focus(item);
    }
  };

  const selectItem = item => {
    if(item && !isDisabled(item) && !isSeparator(item)) {
      setSelected(item);
      close(true, item);
    }
  };

  const keyDownHandler = event => {

    const item = event.target.closest(`.${MENU_BUTTON_MENU_ITEM}`);

    switch (event.keyCode) {
      case VK_ARROW_UP:
      case VK_ARROW_LEFT:
        if(item) {
          previousItem(item);
        }
        else {
          firstItem();
        }
        break;

      case VK_ARROW_DOWN:
      case VK_ARROW_RIGHT:
        if(item) {
          nextItem(item);
        }
        else {
          lastItem();
        }
        break;

      case VK_HOME:
        firstItem();
        break;

      case VK_END:
        lastItem();
        break;

      case VK_SPACE:
      case VK_ENTER:
        selectItem(item);
        break;

      case VK_ESC:
        close(true);
        break;

      case VK_TAB:
        // We do not have a "natural" tab order from menu, so the best we can do is to set focus back to the button
        close(true);
        break;

      default:
        return;
    }
    event.preventDefault();
  };


  const blurHandler = event => {

    // See: https://github.com/facebook/react/issues/2011
    const t = event.relatedTarget ||
      event.explicitOriginalTarget || // FF
      document.activeElement;         // IE11

    //console.log('***** blur, target, relatedTarget', event.target, t);

    try {
      if (t) {
        if (t.closest(`.${MENU_BUTTON_MENU}`) !== element && shouldClose(t)) {
          close();
        }
      }
      else {
        close();
      }
    }
    catch(err) {
      // FF throws error: "TypeError: n.closest is not a function" if related target is a text node
      close();
    }
  };

  const clickHandler = event => {
    //console.log('***** click, target', event.target);

    event.preventDefault();
    const t = event.target;
    if (t && t.closest(`.${MENU_BUTTON_MENU}`) === element) {
      const item = t.closest(`.${MENU_BUTTON_MENU_ITEM}`);
      if (item) {
        selectItem(item);
      }
    }
    else {
      if (shouldClose(t)) {
        close();
      }
    }
  };

  const touchStartHandler = event => {
    //console.log('***** touchStart, target', event.target);

    const t = event.target;
    if(!(t && t.closest(`.${MENU_BUTTON_MENU}`) === element)) {
      if (event.type === 'touchstart') {
        event.preventDefault();
      }
      close();
    }
  };

  const addListeners = () => {
    element.addEventListener('keydown', keyDownHandler, false);
    element.addEventListener('blur', blurHandler, true);
    element.addEventListener('click', clickHandler, true);
    document.documentElement.addEventListener('touchstart', touchStartHandler, true);
  };

  const removeListeners = () => {
    element.removeEventListener('keydown', keyDownHandler, false);
    element.removeEventListener('blur', blurHandler, true);
    element.removeEventListener('click', clickHandler, true);
    document.documentElement.removeEventListener('touchstart', touchStartHandler, true);
  };

  const open = (controlElement, position='first') => {

    ariaControls = controlElement.closest(`.${JS_MENU_BUTTON}`);

    element.style['min-width'] = `${Math.max(124, controlElement.getBoundingClientRect().width)}px`;
    element.removeAttribute('hidden');
    tether(controlElement, element);

    let item;
    switch (position.toLowerCase()) {
      case 'first':
        firstItem();
        break;

      case 'last':
        lastItem();
        break;

      case 'selected':
        item = getSelected();
        if(item && !item.hasAttribute('disabled')) {
          focus(item);
        }
        else {
          firstItem();
        }
        break;
    }

    addListeners();
  };


  const shouldClose = target => {
    //console.log('***** shouldClose');

    let result = false;
    const btn = (target && target.closest(`.${JS_MENU_BUTTON}`)) || null;
    if(!btn) {
      result = true;
    }
    else if(btn.getAttribute('aria-controls') === element.id) {
      if(btn !== ariaControls) {
        result = true;
      }
    }
    else {
      result = true;
    }
    return result;
  };

  const close = (forceFocus = false, item = null) => {
    removeListeners();

    element.dispatchEvent(
      new CustomEvent('_closemenu', {
        bubbles: true,
        cancelable: true,
        detail: { forceFocus: forceFocus, item: item }
      })
    );
  };

  const addWaiAria = () => {
    if (!element.hasAttribute('id')) {
      // Generate a random id
      element.id = `menu-button-${randomString()}`;
    }
    element.setAttribute('tabindex', '-1');
    element.setAttribute('role', 'menu');
    element.setAttribute('hidden', '');

    [...element.querySelectorAll(`.${MENU_BUTTON_MENU_ITEM}`)].forEach( menuitem => {
      menuitem.setAttribute('tabindex', '-1');
      menuitem.setAttribute('role', 'menuitem');
    });

    [...element.querySelectorAll(`.${MENU_BUTTON_MENU_ITEM_SEPARATOR}`)].forEach( menuitem => {
      menuitem.setAttribute('role', 'separator');
    });
  };

  const init = () => {
    addWaiAria();
    parentNode = element.parentNode;
    element.classList.add('is-upgraded');
  };

  const downgrade = () => {
    removeListeners();
    if(element.parentNode !== parentNode) {
      parentNode.appendChild(element);
    }
    element.classList.remove('is-upgraded');
  };

  init();

  return {
    /**
     * Get the menu element
     * @returns {Element} the menu element
     */
    get element() {
      return element;
    },

    /**
     * Set selected menu item
     * @param item
     */
    set selected(item) {
      setSelected(item, true);
    },

    /**
     * Open menu
     * @param {Element} controlElement the element where the menu should be aligned to
     * @param {String} position menuElement item to receive focus after menu element is opened
     */
    open: (controlElement, position='first') => open(controlElement, position),

    /**
     * Remove event listeners.
     */
    removeListeners: () => removeListeners(),

    /**
     * Downgrade menu
     */
    downgrade: () => downgrade(),
  };
};


/**
 * The menubutton component
 */

class MenuButton {

  constructor(element) {
    this.element = element;
    this.focusElement = undefined;
    this.focusElementLastScrollPosition = undefined;
    this.scrollElements = [];
    this.menu = undefined;
    this.selectedItem = null;
    this.init();
  }

  keyDownHandler = event => {
    if(!this.isDisabled()) {
      switch (event.keyCode) {
        case VK_ARROW_UP:
          this.openMenu('last');
          break;

        case VK_ARROW_DOWN:
          this.openMenu();
          break;

        case VK_SPACE:
        case VK_ENTER:
          this.openMenu('selected');
          break;

        case VK_ESC:
          this.closeMenu();
          break;

        case VK_TAB:
          this.closeMenu();
          return;

        default:
          return;
      }
    }
    //event.stopPropagation();
    event.preventDefault();
  };

  clickHandler = () => {
    if(!this.isDisabled()) {
      if(this.element.getAttribute('aria-expanded').toLowerCase() === 'true') {
        this.closeMenu(true);
      }
      else {
        this.openMenu('selected');
      }
    }
  };

  /**
   * Re-position menu if content is scrolled, window is resized or orientation change
   * @see https://javascriptweblog.wordpress.com/2015/11/02/of-classes-and-arrow-functions-a-cautionary-tale/
   */
  recalcMenuPosition = fullThrottle( () => {
    const c = this.focusElement.getBoundingClientRect();
    const dx = this.focusElementLastScrollPosition.left - c.left;
    const dy = this.focusElementLastScrollPosition.top - c.top;
    const left = (parseFloat(this.menu.element.style.left) || 0) - dx;
    const top = (parseFloat(this.menu.element.style.top) || 0) - dy;

    this.menu.element.style.left = `${left}px`;
    this.menu.element.style.top = `${top}px`;
    this.focusElementLastScrollPosition = c;
  });


  positionChangeHandler = () => {
    this.recalcMenuPosition(this);
  };

  closeMenuHandler = event => {
    if(event && event.detail) {
      if(event.detail.item && event.detail.item !== this.selectedItem) {
        this.selectedItem = event.detail.item;
        this.dispatchMenuSelect();
      }
      this.closeMenu(event.detail.forceFocus);
    }
  };

  dispatchMenuSelect() {
    this.element.dispatchEvent(
      new CustomEvent('menuselect', {
        bubbles: true,
        cancelable: true,
        detail: { source: this.selectedItem }
      })
    );
  }

  isDisabled() {
    return this.element.hasAttribute('disabled');
  }

  removeListeners() {
    this.element.removeEventListener('keydown', this.keyDownHandler);
    this.element.removeEventListener('click', this.clickHandler);
  }

  openMenu(position='first') {

    if(!this.isDisabled() && this.menu) {

      // Close the menu if button position change
      this.scrollElements = getScrollParents(this.element);
      this.scrollElements.forEach(el => el.addEventListener('scroll', this.positionChangeHandler));

      window.addEventListener('resize', this.positionChangeHandler);
      window.addEventListener('orientationchange', this.positionChangeHandler);
      this.menu.element.addEventListener('_closemenu', this.closeMenuHandler);

      this.menu.selected = this.selectedItem;
      this.menu.open(this.focusElement, position);
      this.element.setAttribute('aria-expanded', 'true');

      this.focusElementLastScrollPosition = this.focusElement.getBoundingClientRect();
    }
  }

  closeMenu(forceFocus = false) {
    if(this.menu) {
      this.menu.removeListeners();
      this.scrollElements.forEach(el => el.removeEventListener('scroll', this.positionChangeHandler));
      window.removeEventListener('resize', this.positionChangeHandler);
      window.removeEventListener('orientationchange', this.positionChangeHandler);
      this.menu.element.removeEventListener('_closemenu', this.closeMenuHandler);

      if (forceFocus) {
        this.focus();
      }
      this.element.setAttribute('aria-expanded', 'false');
      this.menu.element.setAttribute('hidden', '');
    }
  }

  focus() {
    if(!this.isDisabled()) {
      this.focusElement.focus();
    }
  }

  init() {
    const addListeners = () => {
      this.element.addEventListener('keydown', this.keyDownHandler);
      this.element.addEventListener('click', this.clickHandler);
    };

    const addWaiAria = () => {
      this.element.setAttribute('role', 'button');
      this.element.setAttribute('aria-expanded', 'false');
      this.element.setAttribute('aria-haspopup', 'true');
    };

    const addFocusElement = () => {
      this.focusElement = this.element.querySelector('input[type="text"]');
      if(!this.focusElement) {
        this.focusElement = this.element;

        if(!(this.focusElement.tagName.toLowerCase() === 'button' || this.focusElement.tagName.toLowerCase() === 'input')) {
          if (!this.focusElement.hasAttribute('tabindex')) {
            this.focusElement.setAttribute('tabindex', '0');
          }
        }
      }
    };

    const moveElementToDocumentBody = (element) => {
      // To position an element on top of all other z-indexed elements, the element should be moved to document.body
      //       See: https://philipwalton.com/articles/what-no-one-told-you-about-z-index/

      if(element.parentNode !== document.body) {
        return document.body.appendChild(element);
      }
      return element;
    };

    const findMenuElement = () => {
      let menuElement;
      const menuElementId = this.element.getAttribute('aria-controls');
      if(menuElementId !== null) {
        menuElement = document.querySelector(`#${menuElementId }`);
      }
      else {
        menuElement = this.element.parentNode.querySelector(`.${MENU_BUTTON_MENU}`);
      }
      return menuElement;
    };

    const addMenu = () => {
      const menuElement = findMenuElement();
      if(menuElement) {
        if(menuElement.componentInstance) {
          this.menu = menuElement.componentInstance;
        }
        else {
          this.menu = menuFactory(menuElement);
          menuElement.componentInstance = this.menu;
          moveElementToDocumentBody(menuElement);
        }
        this.element.setAttribute('aria-controls', this.menu.element.id);
      }
    };

    addFocusElement();
    addWaiAria();
    addMenu();
    this.removeListeners();
    addListeners();
  }

  downgrade() {
    if(this.menu) {
      // Do not downgrade menu if there are other buttons sharing this menu
      const related = [...document.querySelectorAll(`.${JS_MENU_BUTTON}[aria-controls="${this.element.getAttribute('aria-controls')}"]`)];
      if(related.filter( c => c !== this.element && c.getAttribute('data-upgraded').indexOf('MaterialExtMenuButton') >= 0).length === 0) {
        this.menu.downgrade();
      }
    }
    this.removeListeners();
  }

}

(function() {
  'use strict';

  /**
   * https://github.com/google/material-design-lite/issues/4205
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtMenuButton = function MaterialExtMenuButton(element) {
    this.element_ = element;
    this.menuButton_ = null;

    // Initialize instance.
    this.init();
  };
  window['MaterialExtMenuButton'] = MaterialExtMenuButton;


  // Public methods.

  /**
   * Get the menu element controlled by this button, null if no menu is controlled by this button
   * @public
   */
  MaterialExtMenuButton.prototype.getMenuElement = function() {
    return this.menuButton_.menu ? this.menuButton_.menu.element : null;
  };
  MaterialExtMenuButton.prototype['getMenuElement'] = MaterialExtMenuButton.prototype.getMenuElement;

  /**
   * Open menu
   * @public
   * @param {String} position one of "first", "last" or "selected"
   */
  MaterialExtMenuButton.prototype.openMenu = function(position) {
    this.menuButton_.openMenu(position);
  };
  MaterialExtMenuButton.prototype['openMenu'] = MaterialExtMenuButton.prototype.openMenu;

  /**
   * Close menu
   * @public
   */
  MaterialExtMenuButton.prototype.closeMenu = function() {
    this.menuButton_.closeMenu(true);
  };
  MaterialExtMenuButton.prototype['closeMenu'] = MaterialExtMenuButton.prototype.closeMenu;

  /**
   * Get selected menu item
   * @public
   * @returns {Element} The selected menu item or null if no item selected
   */
  MaterialExtMenuButton.prototype.getSelectedMenuItem = function() {
    return this.menuButton_.selectedItem;
  };
  MaterialExtMenuButton.prototype['getSelectedMenuItem'] = MaterialExtMenuButton.prototype.getSelectedMenuItem;


  /**
   * Set (default) selected menu item
   * @param {Element} item
   */
  MaterialExtMenuButton.prototype.setSelectedMenuItem = function(item) {
    this.menuButton_.selectedItem = item;
  };
  MaterialExtMenuButton.prototype['setSelectedMenuItem'] = MaterialExtMenuButton.prototype.setSelectedMenuItem;

  /**
   * Initialize component
   */
  MaterialExtMenuButton.prototype.init = function() {
    if (this.element_) {
      this.menuButton_ = new MenuButton(this.element_);
      this.element_.addEventListener('mdl-componentdowngraded', this.mdlDowngrade_.bind(this));
      this.element_.classList.add(IS_UPGRADED);
    }
  };

  /**
   * Downgrade component
   * E.g remove listeners and clean up resources
   */
  MaterialExtMenuButton.prototype.mdlDowngrade_ = function() {
    this.menuButton_.downgrade();
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  /* eslint no-undef: 0 */
  componentHandler.register({
    constructor: MaterialExtMenuButton,
    classAsString: 'MaterialExtMenuButton',
    cssClass: JS_MENU_BUTTON,
    widget: true
  });
})();
