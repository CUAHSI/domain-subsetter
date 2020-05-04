# Color Themes
![Color Themes](../../etc/palette.png)

The **color-themes** component demonstrates how you can create your own themes of 
[material design colors](https://www.google.com/design/spec/style/color.html).

## Introduction
Material Design Lite provides only one color theme, but in many web designs more than one theme is required, e.g. a 
dark theme and a light theme. This component provides the necessary SASS files to use two additional color themes in MDL.

### To include a MDLEXT color theme component:
&nbsp;1. Code a block element, as the "outer" container, intended to hold all of the color theme.
```html
<section>
</section>
```

&nbsp;2. Add one of the `mdlext-light-color-theme` or `mdlext-dark-color-theme` classes to the block element using the `class` attribute.
```html
<section class="mdlext-light-color-theme">
</section>
```

&nbsp;3. Add the MDL components that shuld be rendered with the spesified color theme.
```html
<section class="mdlext-light-color-theme">
  <div class="mdl-card mdl-shadow--2dp">
    <header class="mdl-card__title mdl-color--primary mdl-color-text--primary-contrast">
      <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        <i class="material-icons">view_headline</i>
      </button>
      <h2 class="mdl-card__title-text">A card with a Color Theme</h2>
      <div class="mdl-layout-spacer"></div>
      <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
        <i class="material-icons">share</i>
      </button>
    </header>
    <div class="mdl-card__supporting-text">
      Some supporting text ...
    </div>
    <footer class="mdl-card__actions mdl-card--border">
      <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Read more
      </a>
      <div class="mdl-layout-spacer"></div>
      <button class="mdl-button mdl-button--icon mdl-button--colored"><i class="material-icons">share</i></button>
    </footer>
  </div>
  <p>More content ...</p>
</section>  
```

### Create your own color theme
Creating your own color theme is simple. For each of the themes, light or dark, you must modify six SASS variables. 
The variables defines the primary and accent colors for the theme, and their corresponding contrast colors. 

Start by picking some sensible primary and accent colors from the 
[material color plaette](https://www.google.com/design/spec/style/color.html#color-color-palette) - or use one of the
web based platte generators as an aid. The [material palette](http://www.materialpalette.com/) is used for this example.
 
Pick a primary and an accent color from the [material palette](http://www.materialpalette.com/), e.g. grey/yellow.
Download the SASS version of the palette and translate the variables to the MDLEXT color theme.

The downloaded material palette SASS variables:
```sass
$primary-color-dark:   #616161
$primary-color:        #9E9E9E
$primary-color-light:  #F5F5F5
$primary-color-text:   #212121
$accent-color:         #FFEB3B
$primary-text-color:   #212121
$secondary-text-color: #727272
$divider-color:        #B6B6B6
```

Open the MDLEXT [color-themes](./_color-themes.scss) SASS file and translate material palette variables to MDLEXT color theme:
```sass
$mdlext-light-color-primary:          #9E9E9E;
$mdlext-light-color-primary-dark:     #616161;
$mdlext-light-color-primary-light:    #9E9E9E; // Fallback color. Set to color-primary if fallback is not needed
$mdlext-light-color-primary-contrast: #F5F5F5;  
$mdlext-light-color-accent:           #FFEB3B; 
$mdlext-light-color-accent-light:     #FFEB3B; // Fallback color. Set to color-primary if fallback is not needed
$mdlext-light-color-accent-contrast:  #FFFFFF;
```

Save the modified variables to your own SASS project, recompile and try out your new theme.

There are a few more SASS variables you can modify - and they should be relativeley self explanatory. By default these 
values are set in accordance with the guidance given in the 
[material design colors](https://www.google.com/design/spec/style/color.html) guide.

#### Examples
See the [example code](./snippets/color-themes.html).

## Configuration options

The MDLEXT CSS classes apply various predefined visual and behavioral enhancements to MDL components. 
The table below lists the available classes and their effects.

| MDLEXT class | Effect | Remarks |
|-----------|--------|---------|
| `mdlext-light-color-theme` | Defines container as an MDLEXT light color theme component | Required on an "outer" block element|
| `mdlext-dark-color-theme` | Defines container as an MDLEXT dark coolor theme component | Required on an "outer" block element|
