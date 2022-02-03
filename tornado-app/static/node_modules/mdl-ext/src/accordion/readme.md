# Accordion
![Accordion](../../etc/flexbox-accordion.png)

A WAI-ARIA friendly accordion component.

>**Note:** The accordion has been refactored and is not compatible with accordion prior to version 0.9.13

## Introduction
An accordion component is a collection of expandable panels associated with a common outer container. Panels consist
of a tab header and an associated content region or panel. The primary use of an Accordion is to present multiple sections
of content on a single page without scrolling, where all of the sections are peers in the application or object hierarchy.
The general look is similar to a tree where each root tree node is an expandable accordion header. The user navigates
and makes the contents of each panel visible (or not) by interacting with the Accordion tab header.

### Features:
* The accordion component relates to the guidelines given in [WAI-ARIA Authoring Practices 1.1, Accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion) 
* User interactions via keyboard or mouse 
* Toggle a particular tab  using enter or space key, or by clicking a tab
* Client can interact with accordion using a public api og by dispatching a custom action event 
* The accordion emits a custom toggle events reflecting the tab toggled


### To include a MDLEXT **accordion** component:

&nbsp;1. Code a `<ul>` element with `class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal"`  to hold the accordion with horizontal layout. 
```html
<ul class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal">
</ul>
```

&nbsp;2. Code a `<li>` element with `class="mdlext-accordion__panel"`  to hold an individual accordion panel. 
```html
<ul class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal">
  <li class="mdlext-accordion__panel">
  </li>
</ul>
```

&nbsp;3. Code a `<header>` element with `class="mdlext-accordion__tab"`  to hold the accordion tab header. 
```html
<ul class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal">
  <li class="mdlext-accordion__panel">
    <header class="mdlext-accordion__tab">
    </header>
  </li>
</ul>
```

&nbsp;4. Code a `<span>` element with `class="mdlext-accordion__tab__caption"` to hold the accordion tab header caption. 
```html
<ul class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal">
  <li class="mdlext-accordion__panel">
    <header class="mdlext-accordion__tab">
      <span class="mdlext-accordion__tab__caption">A tab caption</span>
    </header>
  </li>
</ul>
```

&nbsp;5. Code a `<section>` element with `class="mdlext-accordion__tabpanel"`  to hold the tab content. 
```html
<ul class="mdlext-accordion mdlext-js-accordion mdlext-accordion--horizontal">
  <li class="mdlext-accordion__panel">
    <header class="mdlext-accordion__tab">
      <span class="mdlext-accordion__tab__caption">A tab caption</span>
    </header>
    <section class="mdlext-accordion__tabpanel">
      <p>Content goes here ...</p>
    </section>
  </li>
</ul>
```

&nbsp;6. Repeat steps 2..5 for each accordion panel required. 

### Example
Multiselectable vertical accordion with three panels, aria attributes, ripple effect on each tab header, decorated with 
a glyph left and a state icon right. Tab #1 is open at page load (aria-expanded="true"). Subscribes to accordion toggle event.

```html
<ul id="my-accordion" 
  class="mdlext-accordion mdlext-js-accordion mdlext-accordion--vertical mdlext-js-ripple-effect"
  role="tablist" aria-multiselectable="true">

  <li class="mdlext-accordion__panel" role="presentation">
    <header class="mdlext-accordion__tab" role="tab" aria-expanded="true">
      <i class="material-icons">dns</i>
      <span class="mdlext-accordion__tab__caption">First section. A long caption should not push the state icon</span>
      <i class="mdlext-aria-toggle-material-icons"></i>
    </header>
    <section class="mdlext-accordion__tabpanel" role="tabpanel" aria-hidden="false">
      <h5>Content #1 goes here</h5>
      <p>Some content <a href="#">with an anchor</a> as a focusable element.</p>
    </section>
  </li>
  <li class="mdlext-accordion__panel" role="presentation">
    <header class="mdlext-accordion__tab" role="tab" aria-expanded="false">
      <i class="material-icons">all_inclusive</i>
      <span class="mdlext-accordion__tab__caption">Tab #2</span>
      <i class="mdlext-aria-toggle-material-icons"></i>
    </header>
    <section class="mdlext-accordion__tabpanel" role="tabpanel" aria-hidden="true" hidden>
      <h5>Content #2 goes here</h5>
      <p>Some content....</p>
    </section>
  </li>
  <li class="mdlext-accordion__panel" role="presentation">
    <header class="mdlext-accordion__tab" role="tab" aria-expanded="false">
      <i class="material-icons">build</i>
      <span class="mdlext-accordion__tab__caption">Tab #3</span>
      <i class="mdlext-aria-toggle-material-icons"></i>
    </header>
    <section class="mdlext-accordion__tabpanel" role="tabpanel" aria-hidden="true" hidden>
      <h5>Content #3 goes here</h5>
    </section>
  </li>
</ul>

<script>
  'use strict';
  window.addEventListener('load', function() {
    var accordion = document.querySelector('#my-accordion');
    accordion.addEventListener('toggle', function(e) {
      console.log('Accordion toggled. State:', e.detail.state, 'Source:', e.detail.tab);
    });
  });
</script>

```
>**Note:** All required aria attributes will be added by the accordion component during initialization - so it is not 
strictly necessary to apply the attributes in markup.

### More examples
* The [snippets/accordion.html](./snippets/accordion.html) and the [tests](../../test/accordion/accordion.spec.js) provides more detailed examples.
* Try out the [live demo](http://leifoolsen.github.io/mdl-ext/demo/accordion.html)


## Keyboard interaction
The accordion interacts with the following keyboard keys.

*   <kbd>Tab</kbd> - When focus is on an accordion (tab)header, pressing the <kbd>Tab</kbd> key moves focus in the following manner:
    1.  If interactive glyphs or menus are present in the accordion header, focus moves to each in order.
    2.  When the corresponding tab panel is expanded (its [aria-expanded](http://www.w3.org/TR/wai-aria-1.1/#aria-expanded) state is 'true'), then focus moves to the first focusable element in the panel.
    3.  If the panel is collapsed (its aria-expanded state is 'false'), OR, when the last interactive element of a panel is reached, the next <kbd>Tab</kbd> key press moves focus as follows:
        *   Moves focus to the next logical accordion header.
        *   When focus reaches the last header, focus moves to the first focusable element outside the accordion component.
*   <kbd>Left arrow</kbd>
    *   When focus is on the accordion header, a press of <kbd>up</kbd>/<kbd>left</kbd> arrow keys moves focus to the previous logical accordion header.
    *   When focus reaches the first header, further <kbd>up</kbd>/<kbd>left</kbd> arrow key presses optionally wrap to the first header.
*   <kbd>Right arrow</kbd>
    *   When focus is on the accordion header, a press of <kbd>down</kbd>/<kbd>right</kbd> arrow key moves focus to the next logical accordion header.
    *   When focus reaches the last header, further <kbd>down</kbd>/<kbd>right</kbd> arrow key presses optionally wrap to the first header
*   <kbd>Up arrow</kbd> - behaves the same as left arrow
*   <kbd>Down arrow</kbd> - behaves the same as <kbd>right arrow</kbd>
*   <kbd>End</kbd> - When focus is on the accordion header, an <kbd>End</kbd> key press moves focus to the last accordion header.
*   <kbd>Home</kbd> - When focus is on the accordion header, a <kbd>Home</kbd> key press moves focus to the first accordion header.
*   <kbd>Enter</kbd> or <kbd>Space</kbd> - When focus is on an accordion header, pressing <kbd>Enter</kbd> ir <kbd>Space</kbd> toggles the expansion of the corresponding panel.
    *   If collapsed, the panel is expanded, and its aria-expanded state is set to 'true'.
    *   If expanded, the panel is collapsed and its aria-expanded state is set to 'false'.
*   <kbd>Shift+Tab</kbd> - Generally the reverse of <kbd>Tab</kbd>.


## Events
Interaction with the component programmatically is performed receiving events from the component or by sending events to 
the component (or by using the public api).  

### Events the component listenes to
A client can send a `command` custom event to the accordion. The command event holds a detail object defining the action 
to perform and a target for the action.

The detail object has the following structure:
```javascript
detail: { 
  action, // "open", "close", "toggle" or "upgrade" 
  target  // Target, panel or tab, of action, "undefined" if all panels should be targeted.
          // Note: If you send a null target, the action is cancelled
}
```

Possible actions are:

#### open
Open a targeted tab and it's corresponding tabpanel.

```javascript
myAccrdion = document.querySelector('#my-accordion');
target = myAccordion.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3)'); 
ce = new CustomEvent('command', { detail: { action : 'open', target: target } });
```
If `target` is undefined, the action will open all panels.
**Note**: Opening all panels only makes sense if the accordion has the aria attribute `aria-multiselectable` set to `true`, 
and will be cancelled otherwise. 

#### close
Close a targeted tab and its corresponding tabpanel.

```javascript
myAccrdion = document.querySelector('#my-accordion');
target = myAccordion.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3)'); 
ce = new CustomEvent('command', { detail: { action : 'close', target: target } });
```
If `target` is undefined, the action will close all panels.
**Note**: Closing all panels only makes sense if the accordion has the aria attribute `aria-multiselectable` set to `true`, 
and will be cancelled otherwise. 

#### toggle
Toggle a targeted tab. Open or close a targeted tab and it's corresponding tabpanel.

```javascript
myAccrdion = document.querySelector('#my-accordion');
target = myAccordion.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3)'); 
ce = new CustomEvent('command', { detail: { action : 'toggle', target: target } });
```
If `target` is undefined, the action will be cancelled.

#### upgrade
Upgrade a targeted panel. If you add a panel to the accordion after the page has loaded, you must call `upgrade` to 
notify the accordion component about the new panel.

```javascript
myAccrdion = document.querySelector('#my-accordion');
addedPanel = myAccordion.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(4)'); 
ce = new CustomEvent('command', { detail: { action : 'upgrade', target: addedPanel } });
```
If `target` is undefined, the action will be cancelled.

#### Example: Expand all panels.
```javascript
var ce = new CustomEvent( 'command', { 
  detail: { 
    action: 'open' 
  } 
});
document.querySelector('#my-accordion').dispatchEvent(ce);
```

#### Example: Toggle a spesific tab.
```javascript
var panel3 = document.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3) .mdlext-accordion__tab');
var ce = new CustomEvent('command', { 
  detail: { 
    action: 'toggle', 
    target: panel3 
  } 
});
document.querySelector('#my-accordion').dispatchEvent(ce);
```

#### Example: Append a new panel.
```javascript
var panel =
  '<li class="mdlext-accordion__panel">'
  +  '<header class="mdlext-accordion__tab" aria-expanded="true">'
  +    '<span class="mdlext-accordion__tab__caption">New Tab</span>'
  +    '<i class="mdlext-aria-toggle-material-icons"></i>'
  +  '</header>'
  +  '<section class="mdlext-accordion__tabpanel">'
  +    '<h5>New tab content</h5>'
  +    '<p>Some content</p>'
  +  '</section>'
  +'</li>';

var accordion = document.querySelector('#my-accordion');
accordion.insertAdjacentHTML('beforeend', panel);

var theNewPanel = document.querySelector('#my-accordion .mdlext-accordion__panel:last-child');
var ce = new CustomEvent('command', { detail: { action : 'upgrade', target: theNewPanel } });
document.querySelector('#my-accordion').dispatchEvent(ce);
```

Refer to [snippets/accordion.html](./snippets/accordion.html) or the [tests](../../test/accordion/accordion.spec.js) for detailed usage.


### Events emitted from the component
The accordion emits a custom `toggle` event when a panel opens or closes. The event has a detail object with the following structure:

```javascript
detail: {
  state,    // "open" or "close"
  tab,      // the haeder tab element instance that caused the event
  tabpanel  // the cooresponding tabpanel element instance
}
```

Set up an event listener to receive the toggle event.
```javascript
document.querySelector('#my-accordion').addEventListener('toggle', function(e) {
  console.log('Accordion toggled. State:', e.detail.state, 'Source:', e.detail.source);
});
```
Refer to [snippets/accordion.html](./snippets/accordion.html) or the [tests](../../test/accordion/accordion.spec.js) for detailed usage.


## Public methods

### upgradeTab(tabOrPanelElement)
Upgrade a targeted panel with aria attributes and ripple effects. If you add a panel to the accordion after the page has 
loaded, you must call `upgrade` to notify the accordion component about the newly added panel.

```javascript
var accordion = document.querySelector('#my-accordion');
var panel3 = document.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3)');
accordion.MaterialExtAccordion.upgradeTab( panel3 );
```

### command(detail)
Executes an action, targeting a specific tab. The actions corresponds to the custom events defined for this component.
 
The detail object parameter has the following structure:
```javascript
detail: { 
  action, // "open", "close", "toggle" or "upgrade" 
  target  // Target, panel or tab, of action, "undefined" if all panels should be targeted.
          // Note: If you send a null target, the action is cancelled
}
```

#### open: command( {action: 'open', target: tabOrPanelElement } )
Open a targeted tab and it's corresponding tabpanel.

#### close: command( {action: 'close', target: tabOrPanelElement } )
Close a targeted tab and it's corresponding tabpanel.

#### toggle: command( {action: 'toggle', target: tabOrPanelElement } )
Toggle a targeted tab. Open or close a targeted tab and it's corresponding tabpanel.

#### upgrade: command( {action: 'upgrade', target: tabOrPanelElement } )
Upgrade a targeted panel with aria attributes and ripple effects. If you add a panel to the accordion after the page has 
loaded, you must call `upgrade` to notify the accordion component about the newly added panel.

#### Example: Expand all panels.
```javascript
var accordion = document.querySelector('#my-accordion');
accordion.MaterialExtAccordion.command( {action: 'open'} );
```

#### Example: Toggle panel.
```javascript
var accordion = document.querySelector('#my-accordion');
var panel3 = document.querySelector('#my-accordion .mdlext-accordion__panel:nth-child(3) .mdlext-accordion__tab');
accordion.MaterialExtAccordion.command( {action: 'toggle', target: panel3} );
```

Refer to [snippets/accordion.html](./snippets/accordion.html) or the [tests](../../test/accordion/accordion.spec.js) for detailed usage.


## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the accordion. 
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|--------------|--------|---------|
|`mdlext-accordion`| Defines container as an MDL component | Required on "outer" `<div>` or `<ul>` element |
|`mdlext-js-accordion`| Assigns basic MDL behavior to accordion | Required on "outer" `<div>` or `<ul>` element |
|`mdlext-accordion--horizontal`| Horizontal layot of an accordion | Required. The accordion must have one of `mdlext-accordion--horizontal` or `mdlext-accordion--vertical` defined |
|`mdlext-accordion--vertical`| Vertical layot of an accordion | Required. The accordion must have one of `mdlext-accordion--horizontal` or `mdlext-accordion--vertical` defined |
|`mdlext-js-ripple-effect`| Applies ripple click effect to accordion tab header | Optional. Goes on "outer" `<ul>` or `<div>` element |
|`mdlext-js-animation-effect`| Applies animation effect to accordion tab panel | Optional. Goes on "outer" `<ul>` or `<div>` element |
|`mdlext-accordion__panel`| Defines a container for each section of the accordion - the tab and tabpanel element | Required on first inner `<div>` element or `<li>` element  |
|`mdlext-accordion__tab`| Defines a tab header for a corresponding tabpanel | Required on `<header>` or `<div>` element |
|`mdlext-accordion__tabpanel`| The content | Required on `<section>` or `<div>` element |


The table below lists available attributes and their effects.

| Attribute | Description | Remarks |
|-----------|-------------|---------|
|`aria-multiselectable`| If true, multiple panels may be open simultaneously | Required. Add `aria-multiselectable="true"` to the `mdlext-accordion` element to keep multiple panels open at the same time. If not present, the component will set `aria-multiselectable="false"` during initialization.|
|`role=tablist`| Component role | Required. Added by component during initialization if not present. |
|`role=presentation`| Accordion panel role | Required. Added by component during initialization if not present. |
|`role=tab`| Accordion tab header role | Required. Added by component during initialization if not present. |
|`aria-expanded`| Accordion tab header attribute.  An accordion should manage the expanded/collapsed state of each tab by maintain its aria-expanded state. | Required. Defaults to `aria-expanded="false"`. Set `aria-expanded="true"` if you want a tab to open during page load. |
|`aria-selected`| Accordion tab header attribute. An accordion should manage the selected state of each tab by maintaining its aria-selected state | Optional. Added by component. |
|`disabled`| Accordion tab header attribute. Indicates a disabled tab and tabpanel | Optional. If this attribute is present, the tabpanel will not open or close. |
|`role=tabpanel`| Accordion tabpanel role. | Required. Added by component during initialization if not present. |
|`aria-hidden`| Accordion tabpanel attribute. An accordion should convey the visibility of each tabpanel by maintaining its aria-hidden state | Required. Added by component. |
|`hidden`| Accordion tabpanel attribute. | Required. Added by component if `aria-hidden="true"`. |
 

## Other examples 
* The Accordion component is based on / inspired by this [CodePen](http://codepen.io/aann/pen/dPqBML)
* [Open Ajax, Tab Panel: Accordian1](http://www.oaa-accessibility.org/examplep/accordian1/)
* [www3 Accordion Example](https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion1.html)
