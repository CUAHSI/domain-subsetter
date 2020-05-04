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
 * A WAI-ARIA friendly accordion component.
 * An accordion is a collection of expandable panels associated with a common outer container. Panels consist
 * of a header and an associated content region or tabpanel. The primary use of an Accordion is to present multiple sections
 * of content on a single page without scrolling, where all of the sections are peers in the application or object hierarchy.
 * The general look is similar to a tree where each root tree node is an expandable accordion header. The user navigates
 * and makes the contents of each panel visible (or not) by interacting with the Accordion Header
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
  IS_EXPANDED,
  IS_UPGRADED,
  ARIA_MULTISELECTABLE,
  ARIA_EXPANDED,
  ARIA_HIDDEN,
  ARIA_SELECTED
} from '../utils/constants';


(function() {
  'use strict';
  const ACCORDION            = 'mdlext-accordion';
  const ACCORDION_VERTICAL   = 'mdlext-accordion--vertical';
  const ACCORDION_HORIZONTAL = 'mdlext-accordion--horizontal';
  const PANEL                = 'mdlext-accordion__panel';
  const PANEL_ROLE           = 'presentation';
  const TAB                  = 'mdlext-accordion__tab';
  const TAB_CAPTION          = 'mdlext-accordion__tab__caption';
  const TAB_ROLE             = 'tab';
  const TABPANEL             = 'mdlext-accordion__tabpanel';
  const TABPANEL_ROLE        = 'tabpanel';
  const RIPPLE_EFFECT        = 'mdlext-js-ripple-effect';
  const RIPPLE               = 'mdlext-accordion__tab--ripple';
  const ANIMATION_EFFECT     = 'mdlext-js-animation-effect';
  const ANIMATION            = 'mdlext-accordion__tabpanel--animation';

  /**
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  const MaterialExtAccordion = function MaterialExtAccordion( element ) {

    // Stores the Accordion HTML element.
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialExtAccordion'] = MaterialExtAccordion;


  // Helpers
  const accordionPanelElements = ( element ) => {
    if(!element) {
      return {
        panel: null,
        tab: null,
        tabpanel: null
      };
    }
    else if (element.classList.contains(PANEL)) {
      return {
        panel: element,
        tab: element.querySelector(`.${TAB}`),
        tabpanel: element.querySelector(`.${TABPANEL}`)
      };
    }
    else {
      return {
        panel: element.parentNode,
        tab: element.parentNode.querySelector(`.${TAB}`),
        tabpanel: element.parentNode.querySelector(`.${TABPANEL}`)
      };
    }
  };


  // Private methods.

  /**
   * Handles custom command event, 'open', 'close', 'toggle' or upgrade
   * @param event. A custom event
   * @private
   */
  MaterialExtAccordion.prototype.commandHandler_ = function( event ) {
    event.preventDefault();
    event.stopPropagation();

    if(event && event.detail) {
      this.command(event.detail);
    }
  };

  /**
   * Dispatch toggle event
   * @param {string} state
   * @param {Element} tab
   * @param {Element} tabpanel
   * @private
   */
  MaterialExtAccordion.prototype.dispatchToggleEvent_ = function ( state, tab, tabpanel ) {
    const ce = new CustomEvent('toggle', {
      bubbles: true,
      cancelable: true,
      detail: { state: state, tab: tab, tabpanel: tabpanel }
    });
    this.element_.dispatchEvent(ce);
  };

  /**
   * Open tab
   * @param {Element} panel
   * @param {Element} tab
   * @param {Element} tabpanel
   * @private
   */
  MaterialExtAccordion.prototype.openTab_ = function( panel, tab, tabpanel ) {
    panel.classList.add(IS_EXPANDED);
    tab.setAttribute(ARIA_EXPANDED, 'true');
    tabpanel.removeAttribute('hidden');
    tabpanel.setAttribute(ARIA_HIDDEN, 'false');
    this.dispatchToggleEvent_('open', tab, tabpanel);
  };

  /**
   * Close tab
   * @param {Element} panel
   * @param {Element} tab
   * @param {Element} tabpanel
   * @private
   */
  MaterialExtAccordion.prototype.closeTab_ = function( panel, tab, tabpanel ) {
    panel.classList.remove(IS_EXPANDED);
    tab.setAttribute(ARIA_EXPANDED, 'false');
    tabpanel.setAttribute('hidden', '');
    tabpanel.setAttribute(ARIA_HIDDEN, 'true');
    this.dispatchToggleEvent_('close', tab, tabpanel);
  };

  /**
   * Toggle tab
   * @param {Element} panel
   * @param {Element} tab
   * @param {Element} tabpanel
   * @private
   */
  MaterialExtAccordion.prototype.toggleTab_ = function( panel, tab, tabpanel ) {
    if( !(this.element_.hasAttribute('disabled') || tab.hasAttribute('disabled')) ) {
      if (tab.getAttribute(ARIA_EXPANDED).toLowerCase() === 'true') {
        this.closeTab_(panel, tab, tabpanel);
      }
      else {
        if (this.element_.getAttribute(ARIA_MULTISELECTABLE).toLowerCase() !== 'true') {
          this.closeTabs_();
        }
        this.openTab_(panel, tab, tabpanel);
      }
    }
  };

  /**
   * Open tabs
   * @private
   */
  MaterialExtAccordion.prototype.openTabs_ = function() {
    if (this.element_.getAttribute(ARIA_MULTISELECTABLE).toLowerCase() === 'true') {
      [...this.element_.querySelectorAll(`.${ACCORDION} > .${PANEL}`)]
        .filter(panel => !panel.classList.contains(IS_EXPANDED))
        .forEach(closedItem => {
          const tab = closedItem.querySelector(`.${TAB}`);
          if (!tab.hasAttribute('disabled')) {
            this.openTab_(closedItem, tab, closedItem.querySelector(`.${TABPANEL}`));
          }
        });
    }
  };

  /**
   * Close tabs
   * @private
   */
  MaterialExtAccordion.prototype.closeTabs_ = function() {
    [...this.element_.querySelectorAll(`.${ACCORDION} > .${PANEL}.${IS_EXPANDED}`)]
      .forEach( panel => {
        const tab = panel.querySelector(`.${TAB}`);
        if(!tab.hasAttribute('disabled')) {
          this.closeTab_(panel, tab, panel.querySelector(`.${TABPANEL}`));
        }
      });
  };


  // Public methods.

  /**
   * Upgrade an individual accordion tab
   * @public
   * @param {Element} tabElement The HTML element for the accordion panel.
   */
  MaterialExtAccordion.prototype.upgradeTab = function( tabElement ) {

    const { panel, tab, tabpanel } = accordionPanelElements( tabElement );

    const disableTab = () => {
      panel.classList.remove(IS_EXPANDED);
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute(ARIA_EXPANDED, 'false');
      tabpanel.setAttribute('hidden', '');
      tabpanel.setAttribute(ARIA_HIDDEN, 'true');
    };

    const enableTab = () => {
      if(!tab.hasAttribute(ARIA_EXPANDED)) {
        tab.setAttribute(ARIA_EXPANDED, 'false');
      }

      tab.setAttribute('tabindex', '0');

      if(tab.getAttribute(ARIA_EXPANDED).toLowerCase() === 'true') {
        panel.classList.add(IS_EXPANDED);
        tabpanel.removeAttribute('hidden');
        tabpanel.setAttribute(ARIA_HIDDEN, 'false');
      }
      else {
        panel.classList.remove(IS_EXPANDED);
        tabpanel.setAttribute('hidden', '');
        tabpanel.setAttribute(ARIA_HIDDEN, 'true');
      }
    };

    // In horizontal layout, caption must have a max-width defined to prevent pushing elements to the right of the caption out of view.
    // In JsDom, offsetWidth and offsetHeight properties do not work, so this function is not testable.
    /* istanbul ignore next */
    const calcMaxTabCaptionWidth = () => {

      const tabCaption = tab.querySelector(`.${TAB_CAPTION}`);
      if(tabCaption !== null) {
        const w = [...tab.children]
          .filter( el => el.classList && !el.classList.contains(TAB_CAPTION) )
          .reduce( (v, el) => v + el.offsetWidth, 0 );

        const maxWidth = tab.clientHeight - w;
        if(maxWidth > 0) {
          tabCaption.style['max-width'] = `${maxWidth}px`;
        }
      }
    };

    const selectTab = () => {
      if( !tab.hasAttribute(ARIA_SELECTED) ) {
        [...this.element_.querySelectorAll(`.${TAB}[aria-selected="true"]`)].forEach(
          selectedTab => selectedTab.removeAttribute(ARIA_SELECTED)
        );
        tab.setAttribute(ARIA_SELECTED, 'true');
      }
    };

    const tabClickHandler = () => {
      this.toggleTab_(panel, tab, tabpanel);
      selectTab();
    };

    const tabFocusHandler = () => {
      selectTab();
    };

    const tabpanelClickHandler = () => {
      selectTab();
    };

    const tabpanelFocusHandler = () => {
      selectTab();
    };

    const tabKeydownHandler = e => {

      if(this.element_.hasAttribute('disabled')) {
        return;
      }

      if ( e.keyCode === VK_END        || e.keyCode === VK_HOME
        || e.keyCode === VK_ARROW_UP   || e.keyCode === VK_ARROW_LEFT
        || e.keyCode === VK_ARROW_DOWN || e.keyCode === VK_ARROW_RIGHT ) {

        let nextTab = null;
        let keyCode = e.keyCode;

        if (keyCode === VK_HOME) {
          nextTab = this.element_.querySelector(`.${PANEL}:first-child > .${TAB}`);
          if(nextTab && nextTab.hasAttribute('disabled')) {
            nextTab = null;
            keyCode = VK_ARROW_DOWN;
          }
        }
        else if (keyCode === VK_END) {
          nextTab = this.element_.querySelector(`.${PANEL}:last-child > .${TAB}`);
          if(nextTab && nextTab.hasAttribute('disabled')) {
            nextTab = null;
            keyCode = VK_ARROW_UP;
          }
        }

        if(!nextTab) {
          let nextPanel = panel;

          do {
            if (keyCode === VK_ARROW_UP || keyCode === VK_ARROW_LEFT) {
              nextPanel = nextPanel.previousElementSibling;
              if(!nextPanel) {
                nextPanel = this.element_.querySelector(`.${PANEL}:last-child`);
              }
              if (nextPanel) {
                nextTab = nextPanel.querySelector(`.${PANEL} > .${TAB}`);
              }
            }
            else if (keyCode === VK_ARROW_DOWN || keyCode === VK_ARROW_RIGHT) {
              nextPanel = nextPanel.nextElementSibling;
              if(!nextPanel) {
                nextPanel = this.element_.querySelector(`.${PANEL}:first-child`);
              }
              if (nextPanel) {
                nextTab = nextPanel.querySelector(`.${PANEL} > .${TAB}`);
              }
            }

            if(nextTab && nextTab.hasAttribute('disabled')) {
              nextTab = null;
            }
            else {
              break;
            }
          }
          while(nextPanel !== panel);
        }

        if (nextTab) {
          e.preventDefault();
          e.stopPropagation();
          nextTab.focus();

          // Workaround for JSDom testing:
          // In JsDom 'element.focus()' does not trigger any focus event
          if(!nextTab.hasAttribute(ARIA_SELECTED)) {

            [...this.element_.querySelectorAll(`.${TAB}[aria-selected="true"]`)]
              .forEach( selectedTab => selectedTab.removeAttribute(ARIA_SELECTED) );

            nextTab.setAttribute(ARIA_SELECTED, 'true');
          }
        }
      }
      else if (e.keyCode === VK_ENTER || e.keyCode === VK_SPACE) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleTab_(panel, tab, tabpanel);
      }
    };

    if(tab === null) {
      throw new Error('There must be a tab element for each accordion panel.');
    }

    if(tabpanel === null) {
      throw new Error('There must be a tabpanel element for each accordion panel.');
    }

    panel.setAttribute('role', PANEL_ROLE);
    tab.setAttribute('role', TAB_ROLE);
    tabpanel.setAttribute('role', TABPANEL_ROLE);

    if(tab.hasAttribute('disabled')) {
      disableTab();
    }
    else {
      enableTab();
    }

    if( this.element_.classList.contains(ACCORDION_HORIZONTAL)) {
      calcMaxTabCaptionWidth();
    }

    if (this.element_.classList.contains(RIPPLE_EFFECT)) {
      tab.classList.add(RIPPLE);
    }

    if (this.element_.classList.contains(ANIMATION_EFFECT)) {
      tabpanel.classList.add(ANIMATION);
    }

    // Remove listeners, just in case ...
    tab.removeEventListener('click', tabClickHandler);
    tab.removeEventListener('focus', tabFocusHandler);
    tab.removeEventListener('keydown', tabKeydownHandler);
    tabpanel.removeEventListener('click', tabpanelClickHandler);
    tabpanel.removeEventListener('focus', tabpanelFocusHandler);

    tab.addEventListener('click', tabClickHandler);
    tab.addEventListener('focus', tabFocusHandler);
    tab.addEventListener('keydown', tabKeydownHandler);
    tabpanel.addEventListener('click', tabpanelClickHandler, true);
    tabpanel.addEventListener('focus', tabpanelFocusHandler, true);
  };
  MaterialExtAccordion.prototype['upgradeTab'] = MaterialExtAccordion.prototype.upgradeTab;


  /**
   * Execute command
   * @param detail
   */
  MaterialExtAccordion.prototype.command = function( detail ) {

    const openTab = tabElement => {

      if(tabElement === undefined) {
        this.openTabs_();
      }
      else if(tabElement !== null) {
        const { panel, tab, tabpanel } = accordionPanelElements( tabElement );
        if(tab.getAttribute(ARIA_EXPANDED).toLowerCase() !== 'true') {
          this.toggleTab_(panel, tab, tabpanel);
        }
      }
    };

    const closeTab = tabElement => {
      if(tabElement === undefined) {
        this.closeTabs_();
      }
      else if(tabElement !== null) {
        const { panel, tab, tabpanel } = accordionPanelElements( tabElement );

        if(tab.getAttribute(ARIA_EXPANDED).toLowerCase() === 'true') {
          this.toggleTab_(panel, tab, tabpanel);
        }
      }
    };

    const toggleTab = tabElement => {
      if(tabElement) {
        const { panel, tab, tabpanel } = accordionPanelElements( tabElement );
        this.toggleTab_(panel, tab, tabpanel);
      }
    };


    if(detail && detail.action) {
      const { action, target } = detail;

      switch (action.toLowerCase()) {
        case 'open':
          openTab(target);
          break;
        case 'close':
          closeTab(target);
          break;
        case 'toggle':
          toggleTab(target);
          break;
        case 'upgrade':
          if(target) {
            this.upgradeTab(target);
          }
          break;
        default:
          throw new Error(`Unknown action "${action}". Action must be one of "open", "close", "toggle" or "upgrade"`);
      }
    }
  };
  MaterialExtAccordion.prototype['command'] = MaterialExtAccordion.prototype.command;


  /**
   * Initialize component
   */
  MaterialExtAccordion.prototype.init = function() {
    if (this.element_) {
      // Do the init required for this component to work
      if( !(this.element_.classList.contains(ACCORDION_HORIZONTAL) || this.element_.classList.contains(ACCORDION_VERTICAL))) {
        throw new Error(`Accordion must have one of the classes "${ACCORDION_HORIZONTAL}" or "${ACCORDION_VERTICAL}"`);
      }

      this.element_.setAttribute('role', 'tablist');

      if(!this.element_.hasAttribute(ARIA_MULTISELECTABLE)) {
        this.element_.setAttribute(ARIA_MULTISELECTABLE, 'false');
      }

      this.element_.removeEventListener('command', this.commandHandler_);
      this.element_.addEventListener('command', this.commandHandler_.bind(this), false);

      [...this.element_.querySelectorAll(`.${ACCORDION} > .${PANEL}`)].forEach( panel => this.upgradeTab(panel) );

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
   MaterialExtAccordion.prototype.mdlDowngrade_ = function() {
     'use strict';
     console.log('***** MaterialExtAccordion.mdlDowngrade');
   };
   */


  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  /* eslint no-undef: 0 */
  componentHandler.register({
    constructor: MaterialExtAccordion,
    classAsString: 'MaterialExtAccordion',
    cssClass: 'mdlext-js-accordion',
    widget: true
  });
})();
