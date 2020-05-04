#Formatfield
![Formatfield](../../etc/formatfield.png)

The formatfield component formats an input field using language sensitive 
**number formatting**. It acts as a "pluggable" component and can be added to a 
`mdl-textfield` component or to a `<input>` element.

## To include a MDLEXT formatfield component:
&nbsp;1. Code a [single-line `mdl-textfield`](https://getmdl.io/components/index.html#textfields-section) 
component.
```html
<div class="mdl-textfield mdl-js-textfield">
  <input class="mdl-textfield__input" type="text" 
    pattern="-?[0-9 ]*([\.,][0-9]+)?" value="1234.5">
  <label class="mdl-textfield__label">Number...</label>
  <span class="mdl-textfield__error">Input is not a number!</span>
</div>
```

&nbsp;2. Add the `mdlext-js-formatfield` class to define the element as a formatfield component.
```html
<div class="mdl-textfield mdl-js-textfield mdlext-js-formatfield">
  <input class="mdl-textfield__input" type="text" 
    pattern="-?[0-9 ]*([\.,][0-9]+)?" value="1234.5">
  <label class="mdl-textfield__label">Number...</label>
  <span class="mdl-textfield__error">Input is not a number!</span>
</div>
```

&nbsp;3. Optionally add a `data-formatfield-options` attribute with the given 
[locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation). 
If this step is omitted, the formatfield component uses the browser language as it's locale.
```html
<div class="mdl-textfield mdl-js-textfield mdlext-js-formatfield"
  data-formatfield-options="{'locales': 'nb-NO'}">
  <input class="mdl-textfield__input" type="text" 
    pattern="-?[0-9 ]*([\.,][0-9]+)?" value="1234.5">
  <label class="mdl-textfield__label">Number...</label>
  <span class="mdl-textfield__error">Input is not a number!</span>
</div>
```

### Examples
* The [snippets/formatfield.html](./snippets/formatfield.html) and the 
[tests](../../test/formatfield/formatfield.spec.js) provides more detailed examples.
* Try out the [live demo](http://leifoolsen.github.io/mdl-ext/demo/formatfield.html)

## Public methods

### getOptions()
Get component configuration options object.
```
var options = inputElement.MaterialExtFormatfield.getOptions();
console.log('locales', options.locales);
```

### getUnformattedValue()
An unformatted value is a string value where the locale specific decimal separator
is replaced with a '.' separator and group separators are stripped.
The returned value is suitable for parsing to a JavaScript numerical value.

Example
```javascript
input.value = '1 234,5';
inputElement.MaterialExtFormatfield.getUnformattedValue();
// Returns '1234.5'
```

## Configuration options
The MDLEXT CSS classes apply various predefined visual and behavioral enhancements 
to the formatfield. 

### Available classes and their effects.

| MDLEXT class | Effect | Remarks |
|--------------|--------|---------|
|`mdlext-js-formatfield`| Assigns basic MDL behavior to formatfield. | Required. |


### Options
The component can be configured using the `data-formatfield-options` attribute. 
The attribute value is a JSON string with properties defined by the 
[Intl.NumberFormat object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat).

The `data-formatfield-options` attribute must be a valid JSON string. 
You can use single or double quotes for the JSON properties.

Example 1, single quotes in JSON options string:
```html
<input class=" mdlext-js-formatfield" type="text"
  data-formatfield-options="{'locales': 'nb-NO', 'minimumFractionDigits': 0, 'maximumFractionDigits': 0}">
```

Example 2, double quotes in JSON options string:
```html
<input class=" mdlext-js-formatfield" type="text"
  data-formatfield-options='{"locales": "nb-NO", "minimumFractionDigits": 0, "maximumFractionDigits": 0}'>
```

## How to use the component programmatically
The [tests](../../test/formatfield/formatfield.spec.js) and the 
[snippets/formatfield.html](./snippets/formatfield.html) 
provides examples on how to use the component programmatically.
