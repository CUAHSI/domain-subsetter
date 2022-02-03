/**
 * Remove child element(s)
 * element.innerHTNL = '' has a performance penality!
 * @see http://jsperf.com/empty-an-element/16
 * @see http://jsperf.com/force-reflow
 * @param element
 * @param forceReflow
 */
const removeChildElements = (element, forceReflow = true) => {

  // See: http://jsperf.com/empty-an-element/16
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
  if(forceReflow) {
    // See: http://jsperf.com/force-reflow
    const d = element.style.display;

    element.style.display = 'none';
    element.style.display = d;
  }
};

/**
 * Moves child elements from a DOM node to another dom node.
 * @param source {HTMLElement}
 * @param target {HTMLElement} If the target parameter is ommited, a document fragment is created
 * @return {HTMLElement} The target node
 *
 * @example
 * // Moves child elements from a DOM node to another dom node.
 * moveElements(source, destination);
 *
 * @example
 * // If the second parameter is ommited, a document fragment is created:
 * let fragment = moveElements(source);
 *
 * @See: https://github.com/webmodules/dom-move
 */
const moveElements = (source, target) => {
  if (!target) {
    target = source.ownerDocument.createDocumentFragment();
  }
  while (source.firstChild) {
    target.appendChild(source.firstChild);
  }
  return target;
};


/**
 * Get the browser viewport dimensions
 * @see http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
 * @return {{windowWidth: number, windowHeight: number}}
 */
const getWindowViewport = () => {
  return {
    viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    viewportHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};


/**
 * Check whether an element is in the window viewport
 * @see http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/
 * @param top
 * @param left
 * @param bottom
 * @param right
 * @return {boolean} true if rectangle is inside window viewport, otherwise false
 */
const isRectInsideWindowViewport = ({ top, left, bottom, right }) => {
  const { viewportWidth, viewportHeight } = getWindowViewport();
  return top >= 0 &&
    left >= 0 &&
    bottom <= viewportHeight &&
    right <= viewportWidth;
};


/**
 * Get a list of parent elements that can possibly scroll
 * @param el the element to get parents for
 * @returns {Array}
 */
const getScrollParents = el => {
  const elements = [];

  /*
  for (el = el.parentNode; el; el = el.parentNode) {
    const cs = window.getComputedStyle(el);
    if(!(cs.overflowY === 'hidden' && cs.overflowX === 'hidden')) {
      elements.unshift(el);
    }
    if(el === document.body) {
      break;
    }
  }
  */

  let element = el.parentNode;
  while (element) {
    const cs = window.getComputedStyle(element);
    if(!(cs.overflowY === 'hidden' && cs.overflowX === 'hidden')) {
      elements.unshift(element);
    }
    if(element === document.body) {
      break;
    }
    element = element.parentNode;
  }

  return elements;
};

/**
 * Get a list of parent elements, from a given element to a given element
 * @param {HTMLElement} from
 * @param {HTMLElement} to
 * @return {Array<HTMLElement>} the parent elements, not including from and to
 */
const getParentElements = (from, to) => {
  const result = [];
  let element = from.parentNode;
  while (element) {
    if(element === to) {
      break;
    }
    result.unshift(element);
    element = element.parentNode;
  }
  return result;
};

/**
 * Position element next to button
 *
 * Positioning strategy
 *  1. element.height > viewport.height
 *     let element.height = viewport.heigt
 *     let element.overflow-y = auto
 *  2. element.width > viewport.width
 *     let element.width = viewport.width
 *  3. position element below button, align left edge of element with button left
 *       done if element inside viewport
 *  4. position element below button, align right edge of element with button right
 *       done if element inside viewport
 *  5. positions element above button, aligns left edge of element with button left
 *       done if element inside viewport
 *  6. position element above the control element, aligned to its right.
 *       done if element inside viewport
 *  7. position element at button right hand side, aligns element top with button top
 *       done if element inside viewport
 *  8. position element at button left hand side, aligns element top with button top
 *       done if element inside viewport
 *  9. position element inside viewport
 *     1. position element at viewport bottom
 *     2. position element at button right hand side
 *        done if element inside viewport
 *     3. position element at button left hand side
 *       done if element inside viewport
 *     4. position element at viewport right
 * 10. done
 *
 */
const tether = (controlledBy, element) => {
  const controlRect = controlledBy.getBoundingClientRect();

  // 1. will element height fit inside window viewport?
  const { viewportWidth, viewportHeight } = getWindowViewport();

  element.style.height = 'auto';
  //element.style.overflowY = 'hidden';
  if(element.offsetHeight > viewportHeight) {
    element.style.height = `${viewportHeight}px`;
    element.style.overflowY = 'auto';
  }

  // 2. will element width fit inside window viewport?
  element.style.width = 'auto';
  if(element.offsetWidth > viewportWidth) {
    element.style.width = `${viewportWidth}px`;
  }

  const elementRect = element.getBoundingClientRect();

  // element to control distance
  const dy = controlRect.top - elementRect.top;
  const dx = controlRect.left - elementRect.left;

  // element rect, window coordinates relative to top,left of control
  const top = elementRect.top + dy;
  const left = elementRect.left + dx;
  const bottom = top + elementRect.height;
  const right = left + elementRect.width;

  // Position relative to control
  let ddy = dy;
  let ddx = dx;

  if(isRectInsideWindowViewport({
    top: top + controlRect.height,
    left: left,
    bottom: bottom + controlRect.height,
    right: right
  })) {
    // 3 position element below the control element, aligned to its left
    ddy = controlRect.height + dy;
    //console.log('***** 3');
  }
  else if(isRectInsideWindowViewport({
    top: top + controlRect.height,
    left: left + controlRect.width - elementRect.width,
    bottom: bottom + controlRect.height,
    right: left + controlRect.width
  })) {
    // 4 position element below the control element, aligned to its right
    ddy = controlRect.height + dy;
    ddx = dx + controlRect.width - elementRect.width;
    //console.log('***** 4');
  }
  else if(isRectInsideWindowViewport({
    top: top - elementRect.height,
    left: left,
    bottom: bottom - elementRect.height,
    right: right
  })) {
    // 5. position element above the control element, aligned to its left.
    ddy = dy - elementRect.height;
    //console.log('***** 5');
  }
  else if(isRectInsideWindowViewport({
    top: top - elementRect.height,
    left: left + controlRect.width - elementRect.width,
    bottom: bottom - elementRect.height,
    right: left + controlRect.width
  })) {
    // 6. position element above the control element, aligned to its right.
    ddy = dy - elementRect.height;
    ddx = dx + controlRect.width - elementRect.width;
    //console.log('***** 6');
  }
  else if(isRectInsideWindowViewport({
    top: top,
    left: left + controlRect.width,
    bottom: bottom,
    right: right + controlRect.width
  })) {
    // 7. position element at button right hand side
    ddx = controlRect.width + dx;
    //console.log('***** 7');
  }
  else if(isRectInsideWindowViewport({
    top: top,
    left: left - controlRect.width,
    bottom: bottom,
    right: right - controlRect.width
  })) {
    // 8. position element at button left hand side
    ddx = dx - elementRect.width;
    //console.log('***** 8');
  }
  else {
    // 9. position element inside viewport, near controlrect if possible
    //console.log('***** 9');

    // 9.1 position element near controlrect bottom
    ddy =  dy - bottom + viewportHeight;
    if(top + controlRect.height >= 0 && bottom + controlRect.height <= viewportHeight) {
      ddy = controlRect.height + dy;
    }
    else if(top - elementRect.height >= 0 && bottom - elementRect.height <= viewportHeight) {
      ddy = dy - elementRect.height;
    }

    if(left + elementRect.width + controlRect.width <= viewportWidth) {
      // 9.2 Position element at button right hand side
      ddx = controlRect.width + dx;
      //console.log('***** 9.2');
    }
    else if(left - elementRect.width >= 0) {
      // 9.3 Position element at button left hand side
      ddx = dx - elementRect.width;
      //console.log('***** 9.3');
    }
    else {
      // 9.4 position element at (near) viewport right
      const r = left + elementRect.width - viewportWidth;
      ddx = dx - r;
      //console.log('***** 9.4');
    }
  }

  // 10. done
  element.style.top = `${element.offsetTop + ddy}px`;
  element.style.left = `${element.offsetLeft + ddx}px`;
  //console.log('***** 10. done');
};

/**
 * Check if the given element can receive focus
 * @param {HTMLElement} element the element to check
 * @return {boolean} true if the element is focusable, otherwise false
 */
const isFocusable = (element) => {
  // https://github.com/stephenmathieson/is-focusable/blob/master/index.js
  // http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus

  if (element.hasAttribute('tabindex')) {
    const tabindex = element.getAttribute('tabindex');
    if (!Number.isNaN(tabindex)) {
      return parseInt(tabindex) > -1;
    }
  }

  if (element.hasAttribute('contenteditable') &&
    element.getAttribute('contenteditable') !== 'false') {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-contenteditable
    return true;
  }

  // natively focusable, but only when enabled
  const selector = /input|select|textarea|button|details/i;
  const name = element.nodeName;
  if (selector.test(name)) {
    return element.type.toLowerCase() !== 'hidden' && !element.disabled;
  }

  // anchors and area must have an href
  if (name === 'A' || name === 'AREA') {
    return !!element.href;
  }

  if (name === 'IFRAME') {
    // Check visible iframe
    const cs = window.getComputedStyle(element);
    return cs.getPropertyValue('display').toLowerCase() !== 'none';
  }

  return false;
};


/**
 * Get a list of offset parents for given element
 * @see https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
 * @param el the element
 * @return {Array} a list of offset parents
 */
/*
const offsetParents = (el) => {
  const elements = [];
  for (; el; el = el.offsetParent) {
    elements.unshift(el);
  }
  if(!elements.find(e => e === document.body)) {
    elements.unshift(document.body);
  }
  return elements;
};
*/

/**
 * Finds the common offset ancestor of two DOM nodes
 * @see https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
 * @see https://gist.github.com/benpickles/4059636
 * @param a
 * @param b
 * @return {Element} The common offset ancestor of a and b
 */
/*
const commonOffsetAncestor = (a, b) => {
  const parentsA = offsetParents(a);
  const parentsB = offsetParents(b);

  for (let i = 0; i < parentsA.length; i++) {
    if (parentsA[i] !== parentsB[i]) return parentsA[i-1];
  }
};
*/

/**
 * Calculate position relative to a target element
 * @see http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
 * @param target
 * @param el
 * @return {{top: number, left: number}}
 */
/*
const calcPositionRelativeToTarget = (target, el) => {
  let top = 0;
  let left = 0;

  while(el) {
    top += (el.offsetTop - el.scrollTop + el.clientTop) || 0;
    left += (el.offsetLeft - el.scrollLeft + el.clientLeft) || 0;
    el = el.offsetParent;

    if(el === target) {
      break;
    }
  }
  return { top: top, left: left };
};
*/

export {
  getWindowViewport,
  getParentElements,
  getScrollParents,
  isFocusable,
  isRectInsideWindowViewport,
  moveElements,
  removeChildElements,
  tether,
};

