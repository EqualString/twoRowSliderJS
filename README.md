twoRowSliderJS
=======

_two rows infinite jQuery slider_

#### Example usage

Just add a link to the css file in your `<head>`:

```html
<link rel="stylesheet" type="text/css" href="...dist/two-row-slider.css"/>
```

Sample markup

```html
  <div id="slider" class="hidden"><!-- .hidden prevents from flashing images -->
      <div>
        <ul>
            <li><img src="slider-image.jpg"/></li>
                             .
                             .
                             .
            <li><img src="slider-image.jpg"/></li>
        </ul>
      </div>
      <div>
        <h1>...</h1>
        <p>...</p> 
      </div>  
  </div>    
```

Then, before your closing ```<body>``` tag add:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="...dist/twoRowSliderJS.js"></script>
<script>
    
      $("#slider").twoRowSliderJS({
          motionBlur: false,
          animationDuration: 280
      });
  
</script>
```

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
motionBlur | boolean | true | Enables motion blur in sliding animation
animationDuration | integer | 330 | Sliding animation speed (ms), range : <150 - 1500>

#### Browser support

twoRowSliderJS works on IE8+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

jQuery 1.7