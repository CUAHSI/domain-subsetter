# Selectfield
![Selectfield](../../etc/select-element.png)

## Introduction
The [HTML select](https://developer.mozilla.org/en/docs/Web/HTML/Element/select) (`<select>`) element represents 
a control that presents a menu of options. The options within the menu are represented by `<option>` elements, 
which can be grouped by `<optgroup>` elements. Options can be pre-selected for the user.

The Material Design Lite Ext (MDLEXT) **select field** component is an enhanced version of the standard 
[HTML `<select>`] (https://developer.mozilla.org/en/docs/Web/HTML/Element/select) element.
A select field consists of a horizontal line indicating where keyboard input can occur and, typically, text that clearly communicates 
the intended contents of the select field. An icon (at the right hand side) indicates that the select field has user selectable options. 

This component relates to the guidelines given in [Materials Design spesifications page, Text Fields](http://www.google.com/design/spec/components/text-fields.html). 

### To include a MDLEXT **select field** component:

&nbsp;1. Code a `<div>` element to hold the select field.
```html
<div>
...
</div>
```

&nbsp;2. Inside the div, code an `<select>` element with an `id` attribute of your choice.
```html
<div>
  <select id="some-id">
  </select>
</div>
```

&nbsp;3. Inside the `<select>` element code a list of user selectable options.
```html
<div>
  <select id="some-id">
    <option value=""></option>
    <option value="option1">option 1</option>
    <option value="option2">option 2</option>
    <option value="option3">option 3</option>
  </select>
</div>
```

&nbsp;4. Also inside the div, after the `<select>` element, code a `<label>` element with a `for` attribute 
whose value matches the `select` element's `id` value, and a short string to be used as the field's placeholder text.
```html
<div>
  <select id="some-id">
  ...
  </select>
  <label for="some-id">Options</label>
</div>
```

&nbsp;5. Add one or more MDLEXT classes, separated by spaces, to the select field container, 
select element, label element, and error message using the `class` attribute.
```html
<div class="mdlext-selectfield mdlext-js-selectfield">
  <select id="some-id" class="mdlext-selectfield__select">
  ...
  </select>
  <label for="some-id" class="mdlext-selectfield__label">Options</label>
  <span class="mdlext-selectfield__error">Someting is wrong</span>
</div>
```
The select field component is ready for use.

#### Examples

Select field with a standard label.
```html
<div class="mdlext-selectfield mdlext-js-selectfield">
  <select id="some-id" class="mdlext-selectfield__select">
    <option value=""></option>
    <option value="option1">option 1</option>
    <option value="option2">option 2</option>
    <option value="option3">option 3</option>
  </select>
  <label for="some-id" class="mdlext-selectfield__label">Options</label>
</div>
```

Select field with a floating label.
```html
<div class="mdlext-selectfield mdlext-js-selectfield mdlext-selectfield--floating-label">
  <select id="some-id" class="mdlext-selectfield__select">
    <option value=""></option>
    <option value="option1">option 1</option>
    <option value="option2">option 2</option>
    <option value="option3">option 3</option>
  </select>
  <label for="some-id" class="mdlext-selectfield__label">Options</label>
</div>
```

Select field with a standard label and error message.
```html
<div class="mdlext-selectfield mdlext-js-selectfield">
  <select id="some-id" class="mdlext-selectfield__select">
    <option value=""></option>
    <option value="option1">option 1</option>
    <option value="option2">option 2</option>
    <option value="option3">option 3</option>
  </select>
  <label for="some-id" class="mdlext-selectfield__label">Options</label>
  <span class="mdlext-selectfield__error">Something is wrong</span>
</div>
```


## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the select field. 
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|-----------|--------|---------|
| `mdlext-selectfield` | Defines container as an MDL component | Required on "outer" div element|
| `mdlext-js-selectfield` | Assigns basic MDL behavior to input | Required on "outer" div element |
| `mdlext-selectfield__select` | Defines element as selectfield select | Required on select element |
| `mdlext-selectfield__label` | Defines element as selectfield label | Required on label element for select elements |
| `mdlext-selectfield--floating-label` | Applies *floating label* effect | Optional; goes on "outer" div element |
| `mdlext-selectfield__error` | Defines span as an MDL error message | Optional; goes on span element for MDL select element with *pattern*|
| `is-invalid` | Defines the selectfield as invalid on initial load. | Optional on `mdlext-selectfield` element |
<!--
| `mdlext-selectfield--expandable` | Defines a div as an MDL expandable select field container | For expandable select fields, required on "outer" div element |
| `mdl-button` | Defines label as an MDL icon button | For expandable select fields, required on "outer" div's label element |
| `mdl-js-button` | Assigns basic behavior to icon container | For expandable input fields, required on "outer" div's label element |
| `mdl-button--icon` | Defines label as an MDL icon container | For expandable select fields, required on "outer" div's label element |
| `mdl-input__expandable-holder` | Defines a container as an MDL component | For expandable select fields, required on "inner" div element |
-->

>**Note I:** Disabled versions of each select field type are provided, and are invoked with the standard HTML boolean attribute `disabled`. `<select class="mdlext-selectfield__select" id="select-id" name="select-id" disabled>`
>This attribute may be added or removed programmatically via scripting.

>**Note II:** The select field can for some browser and OS combinations, e.g. 
>FireFox and OSX, be off by 2 pixels compared to the input field. There is no 
>way to fix this, as far as I know, without setting an explicit height on both field types. 
>Since MDL does not set a specific height of the text field, it can not be done for the select 
>field either. If alignment is required, the user must in his/hers design set a specific height 
>both for textfields and selectfields.

## How to use the component programmatically
The tests provides examples on how to use the component [programmatically](https://github.com/leifoolsen/mdl-ext/blob/master/test/selectfield/selectfield.spec.js)

### Credits 
The Select component is based on the following sources:
* [Material Design Lite selectfield component](https://github.com/mebibou/mdl-selectfield) 
* [mdl-selectfield](https://github.com/MEYVN-digital/mdl-selectfield)
* [Simple Material Design Login, with select field](http://codepen.io/michaelschofield/pen/qEzWaM)
* [Material Design &lt;select&gt; element, css only](http://codepen.io/pudgereyem/pen/PqBxQx)
