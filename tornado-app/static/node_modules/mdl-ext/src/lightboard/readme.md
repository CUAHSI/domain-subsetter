# Lightboard

![Lightboard](../../etc/lightboard.png)

Thumbnails in a responsive, fluent grid.

## Introduction
A lightboard is a translucent surface illuminated from behind, used for situations where a shape laid 
upon the surface needs to be seen with high contrast. In the "old days" of photography photograpers 
used a lightboard to get a quick view of, sorting and organizing their slides.

The Material Design Lite Ext (MDLEXT) lightboard is defined and enclosed by a container element. The slides are 
distributed in a row column fashion, with repect to the available screen size. The slides scales proportionally to fill 
available horizontal space, or the available content size, depending on the type of queries you choose to apply 
for your responsive breakpoints. The number of slides per row depends on available space. The component 
adds `role='grid'` to the lightboard and `role='gridcell` to the individual slides.

The Material Design Lite Ext (MDLEXT) lightboard has two versions; one version based on media queries and one version 
based on **element queries**.

### How to use the eq.js version of MDLEXT lightboard

&nbsp;1. Install [eq.js](https://github.com/Snugug/eq.js).
```sh
$ npm install --save eq.js
```

&nbsp;2. Import `mdl-ext-eqjs.scss` in your main SASS file. Remove `mdl-ext.scss` - they can not co exist.
```css
@import '../node_modules/mdl-ext/src/mdl-ext-eqjs';
```

&nbsp;3. Import or Require `eq.js`.  
```javascript
const eqjs = require('eq.js'); // ... or:  import eqjs from 'eq.js';
```

&nbsp;4. Upgrade DOM and trigger `eq.js`<br/>
If you're loading html fragments, using e.g. Ajax, then upgrade DOM and trigger `eq.js` after page load.

```javascript
window.fetch(href, {method: 'get'})
 .then(response => response.text())
 .then(text => {
   contentPanelEl.insertAdjacentHTML('afterbegin', text);

    // Upgrade DOM
    componentHandler.upgradeDom();

   // Trigger eq.js
   eqjs.refreshNodes();
   eqjs.query(undefined, true);
})
.catch(err => console.error(err));
```

An example of how to use `eq.js` in a SPA can be found [here](https://github.com/leifoolsen/mdl-webpack).                           

## To include a MDLEXT lightboard component
&nbsp;1. Code a `<ul>` element with `class="mdlext-lightboard mdlext-js-lightboard"` to hold the lightboard slides.
```html
<ul class="mdlext-lightboard mdlext-js-lightboard">
</ul>
```

&nbsp;2. Code a `<li>` element with `class="mdlext-lightboard__slide"`  to hold an individual slide.
```html
<ul class="mdlext-lightboard mdlext-js-lightboard">
  <li class="mdlext-lightboard__slide">
  <li>
</ul>
```

&nbsp;3. Code an `<a href="#">` element with `class="mdlext-lightboard__slide__frame"`  to hold the slide frame. Optionally add a href to a large version of the image shown in the slide.
```html
<ul class="mdlext-lightboard mdlext-js-lightboard">
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
    </a>  
  <li>
</ul>
```

&nbsp;4. Code a `<figure>` element (decorates frame and center image in slide).  
```html
<ul class="mdlext-lightboard mdlext-js-lightboard">
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
      </figure>
    </a>  
  <li>
</ul>
```

&nbsp;5. Inside the `<figure>` element add an `<img>` element with reference to the thumbnail image to be shown in slide. Optionally add a `<figcaption>` element to hold the image title.    
```html
<ul class="mdlext-lightboard mdlext-js-lightboard">
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D802591.jpg" title="Whooper swans in flight"/>
        <figcaption>_D802591.jpg</figcaption>
      </figure>
    </a>  
  <li>
</ul>
```

&nbsp;6. Repeat steps 2..5 for each slide required.

### Example
Lightboard with eight slides, ripple effect on each slide, no spacing between slides, subscribes to lightboard `select` event.

```html
<ul id="lightboard-1" class="mdlext-lightboard mdlext-js-lightboard
  mdlext-lightboard--no-spacing
  mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events">

  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D802141.jpg" title="Northern goshawk with prey"/>
        <figcaption>_D802141.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D802591.jpg" title="Whooper swans in flight"/>
        <figcaption>_D802591.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D804370-3.jpg" title="European green woodpecker"/>
        <figcaption>_D804370-3.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D808689.jpg" title="The bridge"/>
        <figcaption>_D808689.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D802181.jpg" title="Landscape in blue pastel"/>
        <figcaption>_D802181.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D800912.jpg" title="Hiking the mountains of Dovre"/>
        <figcaption>_D800912.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_D809453-_D809457-4.jpg" title="Train to nowhwere. Ny Aalesund, Spitsbergen." />
        <figcaption>_D809453-_D809457-4.jpg</figcaption>
      </figure>
    </a>
  </li>
  <li class="mdlext-lightboard__slide">
    <a href="#" class="mdlext-lightboard__slide__frame">
      <figure>
        <img src="_DSC8214.jpg" title="Blues"/>
        <figcaption>_DSC8214.jpg</figcaption>
      </figure>
    </a>
  </li>
</ul>

<script>
  window.addEventListener('load', function() {
    var lightboard = document.querySelector('#lightboard-1');
    lightboard.addEventListener('select', function(e) {
      console.log('Slide selected. Source:', e.detail.source);
    });
  });
</script>
```

## Keyboard interaction
The lightboard interacts with the following keyboard keys.

*   `Tab` - When focus is on a slide, pressing the `Tab` key moves focus in the following manner:
    1.  If interactive glyphs or menus are present in the slide frame, focus moves to each in order. (Not implemented yet)
    2.  The next `Tab` key press moves focus as follows:
        *   If there is a next slide, focus moves to the next slide.
        *   If focus is on the last slide, focus moves to the first focusable element outside the lightboard component.
*   `Left arrow` - Moves focus to the previous slide. If the current slide is the first slide, focus moves to the last slide.
*   `Right arrow` - Moves focus to the next slide. If the current slide is the last slide, focus moves to the first slide.
*   `Up arrow` - behaves the same as left arrow.
*   `Down arrow` - behaves the same as right arrow.
*   `End` - When focus is on a slide, an `End` key press moves focus to the last slide.
*   `Home` - When focus is on a slide, a `Home` key press moves focus to the first slide.
*   `Enter/Space` - When focus is on slide, pressing `Enter`/`Space` selects that particular slide. The lightboard emits a **select** event.
*   `Shift+Tab` - Generally the reverse of `Tab`.


## Events
Interaction with the component programmatically is performed receiving events from the component or by sending events to 
the component (or by using the public api).  

### Events the component listenes to
A client can send a `command` custom event to the lightboard. The command event holds a detail object defining the action 
to perform and a optionally a target for the action.

The detail object has the following structure:

```javascript
detail: { 
  action, // "first", "last", "next", "prev", "upgrade" or "select" 
  target  // Target, the slide that should be affected by the event 
}
```

Possible actions are:

#### first
Focuses the first slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
ce = new CustomEvent('command', { detail: { action : 'first' } });
myLightboard.dispatchEvent(ce);
```

#### last
Focuses the last slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
ce = new CustomEvent('command', { detail: { action : 'last' } });
myLightboard.dispatchEvent(ce);
```

#### next
Focuses the next slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
ce = new CustomEvent('command', { detail: { action : 'next' } });
myLightboard.dispatchEvent(ce);
```

#### prev
Focuses the previous slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
ce = new CustomEvent('command', { detail: { action : 'prev' } });
myLightboard.dispatchEvent(ce);
```

#### select
Selects a slide, i.e. adds `aria-selected="true"` on the targeted slide. The lightboard responds with a `select` event.

```javascript
myLightboard = document.querySelector('#my-lightboard');
slide = lightboard.querySelector('.mdlext-lightboard__slide:nth-child(2)');
ce = new CustomEvent('command', { detail: { action : 'prev', target: slide } });
myLightboard.dispatchEvent(ce);
```

#### upgrade
Upgrade slides. If you add slides to the lightboard after the page has loaded, you must call `upgrade` to 
notify the lightboard component about the new slides.

```javascript
myLightboard = document.querySelector('#my-lightboard');
slide = 
   '<li class="mdlext-lightboard__slide">'
  +'  <a href="#" class="mdlext-lightboard__slide__frame">'
  +'    <figure>'
  +'      <img src="_D802181.jpg" title="Landscape in blue pastel"/>'
  +'      <figcaption>_D802181.jpg</figcaption>'
  +'    </figure>'
  +'  </a>'
  +'</li>';

myLightboard.insertAdjacentHTML('beforeend', slide);
ce = new CustomEvent('command', { detail: { action : 'upgrade' } });
myLightboard.dispatchEvent(ce);
```

### Events emitted from the component
The lightboard emits a custom `select` event when a slide is clicked. The event has a detail object with the following content:
```
{
  source  // the slide instance that caused the event
}
```

Set up an event listener to receive the select event.
```javascript
document.querySelector('#my-lightboard').addEventListener('select', function(e) {
  console.log('Slide selected:', e.detail.source);
});
```

Trigger the event.
```javascript
myLightboard = document.querySelector('#my-lightboard');
slide = lightboard.querySelector('.mdlext-lightboard__slide:nth-child(2)');
ce = new CustomEvent('command', { detail: { action : 'select', target: slide } });
myLightboard.dispatchEvent(ce);
```

## Public methods

### upgradeSlides()
Upgrade slides. If you add slides to the lightboard after the page has loaded, you must call `upgradeSlides` to 
notify the component about the new slides.

```javascript
slide = 
   '<li class="mdlext-lightboard__slide">'
  +'  <a href="#" class="mdlext-lightboard__slide__frame">'
  +'    <figure>'
  +'      <img src="_D802181.jpg" title="Landscape in blue pastel"/>'
  +'      <figcaption>_D802181.jpg</figcaption>'
  +'    </figure>'
  +'  </a>'
  +'</li>';

myLightboard = document.querySelector('#my-lightboard');
myLightboard.insertAdjacentHTML('beforeend', slide);
myLightboard.MaterialExtLightboard.upgradeSlides();
```

### command( detail )
Executes an action, optionally targeting a specific slide. The actions corresponds to the custom events defined for this 
component.
 
The detail object parameter has the following structure:
```javascript
detail: { 
  action, // "first", "last", "next", "prev", "upgrade" or "select" 
  target  // Target, the slide that should be affected by the event 
}
```

Possible actions are:

#### first: command( {action: 'first' } )
Focuses the first slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
myLightboard.MaterialExtLightboard.command( {action: 'first'} );
```

#### last: command( {action: 'last' } )
Focuses the last slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
myLightboard.MaterialExtLightboard.command( {action: 'last'} );
```

#### next: command( {action: 'next' } )
Focuses the next slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
myLightboard.MaterialExtLightboard.command( {action: 'next'} );
```

#### prev: command( {action: 'prev' } )
Focuses the previous slide.

```javascript
myLightboard = document.querySelector('#my-lightboard');
myLightboard.MaterialExtLightboard.command( {action: 'prev'} );
```

#### select: command( {action: 'first', target: slide } )
Selects a slide, i.e. adds `aria-selected="true"` on the targeted slide. The lightboard responds with a `select` event.

```javascript
myLightboard = document.querySelector('#my-lightboard');
slide = lightboard.querySelector('.mdlext-lightboard__slide:nth-child(2)');
myLightboard.MaterialExtLightboard.command( {action: 'prev', target: slide} );
```

#### upgrade: command( {action: 'upgrade' } )
Upgrade slides. If you add slides to the lightboard after the page has loaded, you must call `upgrade` to 
notify the lightboard component about the new slides.

```javascript
myLightboard = document.querySelector('#my-lightboard');
slide = 
   '<li class="mdlext-lightboard__slide">'
  +'  <a href="#" class="mdlext-lightboard__slide__frame">'
  +'    <figure>'
  +'      <img src="_D802181.jpg" title="Landscape in blue pastel"/>'
  +'      <figcaption>_D802181.jpg</figcaption>'
  +'    </figure>'
  +'  </a>'
  +'</li>';

myLightboard.insertAdjacentHTML('beforeend', slide);
myLightboard.MaterialExtLightboard.command( {action: 'upgrade'} );
```

## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the lightboard.
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|--------------|--------|---------|
| `mdlext-lightboard` | Defines a container as an MDLEXT lightboard component | Required on `<ul>` element |
| `mdlext-js-lightboard` | Assigns basic MDL behavior to lightboard | Required on `<ul>` element |
| `mdlext-lightboard--no-spacing` | Modifies the slides to have no margin between them. | Optional on `<ul>` element |
| `mdlext-lightboard__slide` | Defines a slide | Required on `<li>` element |
| `mdlext-lightboard__slide__frame` | Defines the slide frame, makes the frame focusable and selectable | Required on `<a>` element. First inner element of `<li>`  |
| `mdl-js-ripple-effect` | Applies ripple click effect to slides | Optional; goes on "outer" `<ul>` element |
| `mdl-js-ripple-effect--ignore-events` |  | Should be added when the component initializes, but that does not seem to happen due to bug/limitation in MDL. For now, add this class if `mdl-js-ripple-effect` class is applied |


A lightboard and its assosiated slides has the following roles.

| Attribute | Effect | Remarks |
|-----------|--------|---------|
| `role="grid"` | Defines the lightboard as a WAI-ARIA grid | Added to `mdlext-lightboard` when component innitializes |
| `role="gridcell"` | Defines the slide as a WAI-ARIA cell | Added to `mdlext-lightboard__slide` when component innitializes |
| `aria-selected` | Defines a slide as selected | Added to `mdlext-lightboard__slide` when a slide is clicked |


## How to use the component programmatically
Refer to [snippets/lightboard.html](./snippets/lightboard.html) or the [tests](../../test/lightboard/lightboard.spec.js) 
for detailed usage.
