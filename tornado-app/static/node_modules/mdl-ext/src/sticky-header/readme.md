# Sticky Header

![Sticky Header](../../etc/sticky-header.png)

A sticky header can be used as a replacement for the Material Design Lite 
[Fixed Header](https://github.com/google/material-design-lite/tree/master/src/layout#examples).

## Introduction
A sticky header makes site navigation easily accessible anywhere on the page and saves content space at the same.

The header should auto-hide, i.e. hiding the header automatically when a user starts scrolling down the page and 
bringing the header back when a user might need it: they reach the bottom of the page or start scrolling up.

>**Note:** The Sticky Header does not collapse on smaller screens.

### To include a MDLEXT **sticky-header** component:

&nbsp;1. Code a `<div>` element. This is the "outer" div that holds the entire layout.
```html
<div>
</div>
```

&nbsp;2. Add MDL classes as indicated, separated by spaces, to the `div` using the class attribute.
```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
</div>
```

&nbsp;3. Inside the div, code a `<header>` element, as described in the Material Design Lite 
[Component Guide](https://getmdl.io/components/index.html#layout-section/layout). Add MDL classes as indicated.
```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
  <header class="mdl-layout__header mdlext-layout__sticky-header mdlext-js-sticky-header">
    <div class="mdl-layout__header-row">
  
      <!-- Title -->
      <span id="header-title" class="mdl-layout-title">Title goes here</span>
  
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
  
      <label id="go-home" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
        <a href="#">
          <i class="material-icons">home</i>
        </a>
      </label>
    </div>
  </header>
</div>
```

&nbsp;4. Code a drawer, and include the MDL class as indicated
```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
  <header class="mdl-layout__header mdlext-layout__sticky-header mdlext-js-sticky-header">
    <div class="mdl-layout__header-row">
  
      <!-- Title -->
      <span id="header-title" class="mdl-layout-title">Title goes here</span>
  
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
  
      <label id="go-home" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
        <a href="#">
          <i class="material-icons">home</i>
        </a>
      </label>
    </div>
  </header>

  <aside class="mdl-layout__drawer">
    <span class="mdl-layout-title">Drawer title</span>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href="#">A manu item</a>
    </nav>
  </aside>
</div>
```

&nbsp;4. Add a `<main>` element to hold the layout's primary content, and include the MDL class as indicated
```html
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
  <header class="mdl-layout__header mdlext-layout__sticky-header mdlext-js-sticky-header">
    <div class="mdl-layout__header-row">
  
      <!-- Title -->
      <span id="header-title" class="mdl-layout-title">Title goes here</span>
  
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
  
      <label id="go-home" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
        <a href="#">
          <i class="material-icons">home</i>
        </a>
      </label>
    </div>
  </header>

  <aside class="mdl-layout__drawer">
    <span class="mdl-layout-title">Drawer title</span>
    <nav class="mdl-navigation">
      <a class="mdl-navigation__link" href="#">A manu item</a>
    </nav>
  </aside>
  
  <main class="mdl-layout__content">
    <p>Content</p>
    <p>Goes</p>
    <p>Here</p>
  </main>  
</div>
```

### Examples

* [Sticky header, Fixed drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header.html)
* [Sticky header, Drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header-ii.html)
* [Sticky header, No Drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header-iii.html)
* [Sticky header, Waterfall, Fiexed Drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header-iv.html)
* [Sticky header, Waterfall, Drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header-v.html)
* [Sticky header, Waterfall, No Drawer](http://leifoolsen.github.io/mdl-ext/demo/sticky-header-vi.html)


## Component configuration
The component can be configured using a `data-config` attribute. The attribute value is a JSON string with the following properties.

| Property             |    |    |
|----------------------|----|----|
| `visibleAtScrollEnd` | if `true`, the header vil show when page is scrolled to the bottom | default: `false` |


The `data-config` attribute must be a valid JSON string. You can use single or double quotes for the JSON properties. 

Example 1, single quotes in JSON config string:
```html
<header class="mdl-layout__header mdlext-layout__sticky-header mdlext-js-sticky-header" 
  data-config="{ 'visibleAtScrollEnd': true }">
  
  <div class="mdl-layout__header-row">
    <span id="header-title" class="mdl-layout-title">Title goes here</span>
  </div>
</header>
```

Example 2, double quotes in JSON config string:
```html
<header class="mdl-layout__header mdlext-layout__sticky-header mdlext-js-sticky-header" 
  data-config='{ "visibleAtScrollEnd": true }'>
  
  <div class="mdl-layout__header-row">
    <span id="header-title" class="mdl-layout-title">Title goes here</span>
  </div>
</header>
```

## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the lightbox.
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|--------------|--------|---------|
| `mdlext-layout__sticky-header` | Defines a header as an MDLEXT header component | Required on `<header>` element |
| `mdlext-js-sticky-header` | Assigns basic MDL behavior to header | Required on `<header>` element |


## How to use the component programmatically
The [tests](../../test/sticky-header/sticky-header.spec.js) provides example code on how to use the component programmatically.

