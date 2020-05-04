# Lightbox

![Lightbox](../../etc/lightbox.png)
A responsive lightbox to be used in conjunction with e.g. a MDLEXT lightboard component.

## Introduction
The Material Design Lite Ext (MDLEXT) Lightbox displays an image filling the screen, and dimming out the rest of the web page.
It acts as a modal dialog, using the `<dialog>` element as a container for the lightbox. The component uses 
the [Material Design Lite Card component](http://www.getmdl.io/components/index.html#cards-section) to provide a layout for the lightbox.

## How to use the Google Chrome Dialog polyfill 

&nbsp;1. Install [Google Chrome Dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill).
```sh
$ npm install --save dialog-polyfill
```

&nbsp;2. Use the polyfill in a static page.
```html
<!DOCTYPE html>
<html>
<head>
  <title>Material Design Lite Extensions</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
  <link rel="stylesheet" href="node_modules/material-design-lite/material.css" />
  <link rel="stylesheet" href="node_modules/mdl-ext/lib/mdl-ext.min.css" />
</head>
<body>
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
  <main class="mdl-layout__content">
  </main
</div>
<script type="text/javascript" src="node_modules/dialog-polyfill/dialog-polyfill.js" charset="utf-8"></script>
<script type="text/javascript" src="node_modules/material-design-lite/material.min.js" charset="utf-8"></script>
<script type="text/javascript" src="node_modules/mdl-ext/lib/mdl-ext.min.js" charset="utf-8"></script>
</body>
</html>
```

&nbsp;3. Use it in your (Webpack) build.

&nbsp;3.1. Import `dialog-polyfill.css` in your main SASS file..
```css
@import '../node_modules/dialog-polyfill/dialog-polyfill.css';
```

&nbsp;3.2. Require `dialog-polyfill`.  
```javascript
const dialogPolyfill = require('dialog-polyfill/dialog-polyfill');
```

&nbsp;... or import the `dialog-polyfill`.  
```javascript
import { dialogPolyfill }  from 'dialog-polyfill/dialog-polyfill';
```

>Adjust path to `node_modules` (libraries) according to where your files are located. 
>For more information about the dialog polyfill, refer to the [Google Chrome Dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill) documentaion and the Material Design Lite [Dialog](http://www.getmdl.io/components/index.html#dialog-section) section.

## To include a MDLEXT lightbox component
&nbsp;1. Code a `<dialog>` element with `class="mdlext-dialog"` to display the lightbox as a modal dialog.
```html
<dialog class="mdlext-dialog">
</dialog>
```

&nbsp;2. Code a `<div>` element with `class="mdlext-lightbox mdlext-js-lightbox mdl-card"` to hold the lightbox.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
  </div>
</dialog>
```

&nbsp;3. Code a `<div>` element with `class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast"` to hold the close dialog button.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
    </div>
  </div>
</dialog>
```

&nbsp;4. Code a `<button>` element with `data-action="close"` and `class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"` to display the close button. Add an `<i>` element inside the `<button>` element to hold the close icon.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
  </div>
</dialog>
```

&nbsp;5. Code a `<figure>` element with `class="mdl-card__media"` to hold the image and the image description.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
    </figure>
  </div>
</dialog>
```

&nbsp;5. Inside the `<figure>` element code an empty `<img>` element and an empty `<figcaption>` element to hold the image and the image description.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
      <img src="" alt>
      <figcaption></figcaption>
    </figure>
  </div>
</dialog>
```


&nbsp;6. Code a `<footer>` element with `class="mdl-card__actions"` to hold the image title and navigation buttons.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
      <img src="" alt>
      <figcaption></figcaption>
    </figure>
    <footer class="mdl-card__actions">
    </footer>    
  </div>
</dialog>
```

&nbsp;7. Code a `<div>` element with `class="mdl-card__supporting-text"` to hold the image title.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
      <img src="" alt>
      <figcaption></figcaption>
    </figure>
    <footer class="mdl-card__actions">
      <div class="mdl-card__supporting-text">
      </div>
    </footer>    
  </div>
</dialog>
```

&nbsp;8. Code a `<nav>` element to hold the navigation buttons.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
      <img src="" alt>
      <figcaption></figcaption>
    </figure>
    <footer class="mdl-card__actions mdl-card--border">
      <div class="mdl-card__supporting-text">
      </div>
      <nav>
      </nav>      
    </footer>    
  </div>
</dialog>
```


&nbsp;9. Add your navigation buttons with `class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"` inside the `<nav>` element.
```html
<dialog class="mdlext-dialog">
  <div class="mdlext-lightbox mdlext-js-lightbox mdl-card">
    <div class="mdl-card__menu mdl-color-text--white mdl-typography--body-2-color-contrast">
      <button data-action="close" class="mdl-button mdl-button--icon mdl-js-button" title="Close">
        <i class="material-icons">close</i>
      </button>
    </div>
    <figure class="mdl-card__media">
      <img src="" alt>
      <figcaption></figcaption>
    </figure>
    <footer class="mdl-card__actions mdl-card--border">
      <div class="mdl-card__supporting-text">
      </div>
      <nav>
        <button data-action="first" class="mdl-button mdl-button--icon mdl-js-button" title="First">
          <i class="material-icons">first_page</i>
        </button>
        <button data-action="prev" class="mdl-button mdl-button--icon mdl-js-button" title="Previous">
          <i class="material-icons">chevron_left</i>
        </button>
        <button data-action="next" class="mdl-button mdl-button--icon mdl-js-button" title="Next">
          <i class="material-icons">chevron_right</i>
        </button>
        <button data-action="last" class="mdl-button mdl-button--icon mdl-js-button" title="Last">
          <i class="material-icons">last_page</i>
        </button>
      </nav>      
    </footer>    
  </div>
</dialog>
```
Add as many buttons as you like. To identify the button that trigger an custom event, you should assign each button a unique data-action attribute value. 
The data-action attribute will be emitted as a part of the custom event triggered when a button is clicked.

&nbsp;10. Add an image and open the dialog.

```javascript
var dialog = document.querySelector('dialog');

// A dialog element MUST be a child of document.body!!
if(dialog.parentNode.tagName !== 'BODY') {
  document.body.appendChild(dialog);
}

if (!('showModal' in dialog)) {
  dialogPolyfill.registerDialog(dialog);
}
var lightbox = dialog.querySelector('.mdlext-lightbox');
var img = lightbox.querySelector('img'); 
var supportingText = lightbox.querySelector('.mdl-card__supporting-text');
var imageDetails = lightbox.querySelector('figcaption'); 

img.setAttribute("src", 'wiew-from-my-window.jpg');
img.setAttribute("alt", 'View from my window');
img.setAttribute("title", 'View from my window');
img.setAttribute('data-img-url-prev', 'some-image.jpg');
img.setAttribute('data-img-url-next', 'some-other-image.jpg');
supportingText.innerHTML = 'View from my window';
imageDetails.innerHTML = 'Photo taken from my window yesterday morning'; 

if(!dialog.open) {
  dialog.showModal();
}
```

### Examples
* See: [snippets/carousel.html](./snippets/lightbox.html)
* TRy out [the live demo](http://leifoolsen.github.io/mdl-ext/demo/lightbox.html)

## Keyboard interaction
The lightbox interacts with the following keyboard keys.

*   `Left arrow` - Emits a custom event with action='prev'
*   `Right arrow` - Emits a custom event with action='next'
*   `Up arrow` - behaves the same as left arrow.
*   `Down arrow` - behaves the same as right arrow.
*   `End` - Emits a custom event with action='last'
*   `Home` - Emits a custom event with action='first'
*   `Space` - Emits a custom event with action='select'
*   `Esc` - Emits a custom event with action='cancel'

## Mouse / Touch interaction
*   `Drag/Swipe left` - Emits a custom event with action='next'
*   `Drag/Swipe right` - Emits a custom event with action='prev'

## Events
The lightbox emits a custom **action** event when a button contained in the lightbox is clicked, an images is dragged or swiped, 
or if one of the keys `Arrow Left`, `Arrow Up`, `Arrow Right`, `Arrow Down`, `Home`, `End`, `Space` or `Esc` is pressed. 
The event has a detail object with the following content:
```
{
  action, // one of: 'first', 'prev', 'next', 'last', 'select', 'close', 'cancel' - 
          // or any value assigned to a button action attribute (empty string if no action assigned) 
  source  // the button instance that caused the event, or the lightbox element if a key triggered the event
}
```

## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the lightbox.
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|--------------|--------|---------|
| `mdlext-lightbox` | Defines a container as an MDLEXT lightbox component | Required on `<div>` element |
| `mdlext-js-lightbox` | Assigns basic MDL behavior to lightbox | Required on `<div>` element |
| `mdlext-lightbox__slider` | Displays previous, current and next image when dragging | Element added by component |
| `mdlext-lightbox__slider__slide` | Holds an image to display when dragging | Element added by component |

<!--
| `mdlext-lightbox--sticky-footer` | Positions footer at bottom of screen | Optional on `mdlext-lightbox` element |
-->

| Attribute | Effect | Remarks |
|-----------|--------|---------|
| `data-img-url-prev` | Displays previous image when dragging | URL to previous image in a collection |
| `data-img-url-next` | Displays next image when dragging | URL to next imagein a collection |


## How to use the component programmatically
The [tests](../../test/lightbox/lightbox.spec.js) and the [snippets/lightbox.html](./snippets/lightbox.html) 
code provides examples on how to use the component programmatically.

