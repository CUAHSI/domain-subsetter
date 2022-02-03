# Dialog
Additional styling for `<dialog>`, based on the [Google Chrome Dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill).
`@include 'node_modules/dialog-polyfill/dialog-polyfill.css'` before using this in your SASS build.

## Introduction
The Material Design Lite Ext (MDLEXT) `mdlext-dialog` class provides better control of the dialog backdrop.

## Basic Usage
Refer to the [Google Chrome Dialog polyfill](https://github.com/GoogleChrome/dialog-polyfill) documentaion amd the MDLEXT [lightbox](../lightbox) component.
 
## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to the dialog. 
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|-----------|--------|---------|
| `mdlext-dialog` | Defines container as an MDLEXT component | Required on `<dialog>` element |

 
You can modify the dialog trough the following SASS variables.

| SASS variable |Description | Remarks | 
|-----------|--------|---------|
| `$mdlext-dialog-padding` | Dialog padding | default `0` | 
| `$mdlext-dialog-background-color` | Dialog background color | default `transparent` | 
| `$mdlext-dialog-backdrop-color` | Backdrop color when dialog is open | default `rgba(0,0,0,0.8)` | 
| `$mdlext-dialog-open-animation` | Animation when dialog opens | default `.5s .2s forwards` | 
| `$mdlext-dialog-backdrop-animation` | Backdrop animation when dialog opens | default `.2s forwards` | 

