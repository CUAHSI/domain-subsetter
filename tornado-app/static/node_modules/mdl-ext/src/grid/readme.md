# Grid

![Grid](../../etc/grid.png)

A responsive **grid** based on **element queries** in favour of media queries.

## Introduction
Grids provide users with a way to view content in an organized manner that might otherwise be difficult to 
understand or retain. Their design and use is an important factor in the overall user experience.

The Material Design Lite Ext (MDLEXT) grid has two versions; one version based on media queries and one version 
based on **element queries**. The MDLEXT grid is a copy of the 
[Material Design Lite grid](https://github.com/google/material-design-lite/tree/master/src/grid) - with additional 
element queries support to distribute grid cells in a more responsive fashion.

### How to use the eq.js version of MDLEXT grid

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

&nbsp;4. Optionally trigger `eq.js`<br/>
If you're loading html fragments using e.g. Ajax, then trigger `eq.js` after page load.

```javascript
window.fetch(href, {method: 'get'})
 .then(response => response.text())
 .then(text => {
   contentPanelEl.insertAdjacentHTML('afterbegin', text);

   // Trigger eq.js
   eqjs.refreshNodes();
   eqjs.query(undefined, true);
})
.catch(err => console.error(err));
```

An example of how to use `eq.js` in a SPA can be found [here](https://github.com/leifoolsen/mdl-webpack).     

## To include a MDLEXT **grid** component:
Folow the documention for the [original mdl-grid](https://github.com/google/material-design-lite/blob/master/src/grid/README.md#to-include-an-mdl-grid-component). Just replace `mdl-` with `mdlext-`, and you're good to go. 
