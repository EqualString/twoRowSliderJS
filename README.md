twoRowSliderJS
=======

_two rows infinite jQuery slider_

#### Demo

[https://equalstring.github.io/twoRowSliderJS/](https://equalstring.github.io/twoRowSliderJS/)

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
          arrowsType: 'double',
          motionBlur: true,
          motionBlurIntensity: 28,
          animationDuration: 350,
          animationEasing: 'easeInOutQuart'
      });
  
</script>
```

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
arrowsType | string | single | Use single or double arrow controls
motionBlur | boolean | true | Enables motion blur in sliding animation
motionBlurIntensity | integer | 30 | Set intensity of motion blur, range :<2 - 200>
animationEasing | string | swing | Set animation easing which will be used 
animationDuration | integer | 330 | Sliding animation speed (ms), range : <150 - 1500>

### Easings

twoRowSliderJS uses jQuery UI animation easing functions. For list and behavior of each easing check [https://api.jqueryui.com/easings/](https://equalstring.github.io/twoRowSliderJS/).

#### Browser support

twoRowSliderJS works on IE8+ (IE 10+ for Motion blur) in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

jQuery 1.7