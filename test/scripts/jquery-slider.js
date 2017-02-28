// twoRowSliderJS
// =============
// Author: Alen Egredžija
// Date: 20/02/2017
// Website: 
// Description: Makes two row infinite slider with specified markup.
//              Calculates row width and position.
//
// Options: arrowsType - options for using single or double control arrows
//          motionBlur - true/false, (default: true) : enables/disables motion blur when sliding
//          motionBlurIntensity: - <2 - 200> , default 30: intensity for motion blur
//          animationEasing: - easing for sliding animation, check provided easing functions for all easings
//          animationDuration - time(ms) <150 - 1500>, default: 330 : sliding animation speed 
//
// Extra usage: Overwrite two-row-slider.css clases for specific behaviour/usage of plugin.
//      

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/
;(function(global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {//AMD (RequireJS)
    define(['jquery'], function($) {
      return factory($, global, global.document);
    });
  } else if (typeof exports === "object" && exports) { //node/CommonJS
    module.exports = factory(require('jquery'), global, global.document);
  } else {
    factory(jQuery, global, global.document); //Browser
  }
})(typeof window !== 'undefined' ? window : this, function($, window, document, undefined) {
    'use strict'

    $.twoRowSliderJS = function( el, opts ) { //Plugin for jQuery .fn object

        var plugin = this; 

        const $slider = $(el), //DOM element (slider)
              $window = $(window); //Window object
        
        //Default options if none is provided
        var defaults = {
            arrowsType: 'single',
            motionBlur: true,
            motionBlurIntensity: 30,
            animationEasing: 'swing',
            animationDuration: 330
        };

        plugin.settings = {};

        //Markup selectors
        const gridItems = $slider.find('li'),
              imagesContainer = $slider.find('div:first'),
              imagesGrid = imagesContainer.find('ul'),
              heroDiv = $slider.find('div:last');

        //Variables      
        var fullWidth = 0, //Width for all elements in grid
            rowWidth = 0,  //Row Width
            i = 0,
            svgBlurId;

        //Arrows SVGs
        const arrows = {
            single:{
                left: '<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M46.077 55.738c0.858 0.867 0.858 2.266 0 3.133s-2.243 0.867-3.101 0l-25.056-25.302c-0.858-0.867-0.858-2.269 0-3.133l25.056-25.306c0.858-0.867 2.243-0.867 3.101 0s0.858 2.266 0 3.133l-22.848 23.738 22.848 23.738z" /></svg>',
                right: '<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M17.919 55.738c-0.858 0.867-0.858 2.266 0 3.133s2.243 0.867 3.101 0l25.056-25.302c0.858-0.867 0.858-2.269 0-3.133l-25.056-25.306c-0.858-0.867-2.243-0.867-3.101 0s-0.858 2.266 0 3.133l22.848 23.738-22.848 23.738z" /></svg>'
            },
            double:{
                left: '<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M48 10.667q1.104 0 1.885 0.781t0.781 1.885-0.792 1.896l-16.771 16.771 16.771 16.771q0.792 0.792 0.792 1.896t-0.781 1.885-1.885 0.781q-1.125 0-1.896-0.771l-18.667-18.667q-0.771-0.771-0.771-1.896t0.771-1.896l18.667-18.667q0.771-0.771 1.896-0.771zM32 10.667q1.104 0 1.885 0.781t0.781 1.885-0.792 1.896l-16.771 16.771 16.771 16.771q0.792 0.792 0.792 1.896t-0.781 1.885-1.885 0.781q-1.125 0-1.896-0.771l-18.667-18.667q-0.771-0.771-0.771-1.896t0.771-1.896l18.667-18.667q0.771-0.771 1.896-0.771z" /></svg>',
                right: '<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M29.333 10.667q1.104 0 1.875 0.771l18.667 18.667q0.792 0.792 0.792 1.896t-0.792 1.896l-18.667 18.667q-0.771 0.771-1.875 0.771t-1.885-0.781-0.781-1.885q0-1.125 0.771-1.896l16.771-16.771-16.771-16.771q-0.771-0.771-0.771-1.896 0-1.146 0.76-1.906t1.906-0.76zM13.333 10.667q1.104 0 1.875 0.771l18.667 18.667q0.792 0.792 0.792 1.896t-0.792 1.896l-18.667 18.667q-0.771 0.771-1.875 0.771t-1.885-0.781-0.781-1.885q0-1.125 0.771-1.896l16.771-16.771-16.771-16.771q-0.771-0.771-0.771-1.896 0-1.146 0.76-1.906t1.906-0.76z" /></svg>'
            }
        };       
   
        /** Methods **/    
        plugin.init = () => {

            plugin.settings = $.extend({}, defaults, opts); //Merge default with user-provided options ( $.extend )

            if(plugin.settings.arrowsType !== 'double') plugin.settings.arrowsType = 'single'; 

            const reg = new RegExp('^[0-9]+$'); //Integer regex

            const intensity = plugin.settings.motionBlurIntensity;
            if((!reg.test(intensity))||(intensity > 200)||(intensity < 2)) plugin.settings.motionBlurIntensity = 30; 
            if(plugin.settings.motionBlur === false) plugin.settings.motionBlurIntensity = 0; //disable motionBlur

            const duration = plugin.settings.animationDuration;
            if((!reg.test(duration))||(duration > 1500)||(duration < 150)) plugin.settings.animationDuration = 330; 

            if(!$.easing.hasOwnProperty(plugin.settings.animationEasing)) plugin.settings.animationEasing = 'swing';  //If jQuery.easing object does not contain provided easing, use deafult (swing)

            //Add new 'slider' classes
            $slider.addClass('two-row-slider hidden fadeIn');
            imagesContainer.addClass('images-container');
            imagesGrid.addClass('images-grid');
            heroDiv.addClass('slider-hero');

        }

        const calculateWidth = () => {

            //Calculate full width of images row (with padding)
            gridItems.each(function() {
                $(this).addClass('row-2-element fadeIn'); 
                fullWidth += $(this).outerWidth(true);
            });

            //fullWidth += 65; //fullWidth + padding (controls)

            while(rowWidth <= fullWidth/2){ // -> /2, two rows
                $(gridItems[i]).addClass('row-1-element').removeClass('row-2-element');
                rowWidth += $(gridItems[i]).outerWidth(true);
                i++;
            }

        }

        const wrapAppend = () => {

            //Wrap of divs
            $slider.find('.row-1-element').wrapAll('<div class="row-1" />').wrapAll('<div class="slider-row-1" />');
            $slider.find('.row-2-element').wrapAll('<div class="row-2" />').wrapAll('<div class="slider-row-2" />');

            //Number of current plugins appended in DOM via main slider class counting
            //So each DOM element connected with this plugin can have it's own svg blur filter
            svgBlurId ='blur-' + $('.two-row-slider').length; 

            $slider.prepend('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters"><defs><filter id="'+svgBlurId+'"><feGaussianBlur in="SourceGraphic" stdDeviation="0,0" /></filter></defs></svg>');
            
            //Add blur filter to each row via css url
            $slider.find('.slider-row-1').css({
		        webkitFilter:"url('#"+svgBlurId+"')",
		        filter:"url('#"+svgBlurId+"')"
	        });

            $slider.find('.slider-row-2').css({
		        webkitFilter:"url('#"+svgBlurId+"')",
		        filter:"url('#"+svgBlurId+"')"
	        });

            //Append controls
            $slider.find('.row-2').append('<div class="slider-controls"><div class="arrows"><div class="tp-left">'+ arrows[plugin.settings.arrowsType].left +'</div><div class="tp-right">'+ arrows[plugin.settings.arrowsType].right +'</div></div></div>');

             //Width for grid and rows
            $slider.find('.images-grid, .row-1').css('width', rowWidth + 'px');
            $slider.find('.row-2').css('width', fullWidth - rowWidth + 'px');

        }

        var setOffset = () => { //Call on init and on $window.resize()

            //Offset for grid
            var offset = rowWidth - imagesContainer.width();
            imagesGrid.css('right', offset + 'px');
            
            $slider.removeClass('hidden'); //Reveal slider

        }

        const setSliderControls = () => {
            
            //Slider row selectors
            const sliderRow_1 = $slider.find('.slider-row-1'),
                  sliderRow_2 = $slider.find('.slider-row-2');

            //Blur selector (vanilla js)
            const motionBlur = document.getElementById(svgBlurId).firstElementChild;      

            //Slider controls
            $slider.find('.tp-left').click( () => { 
                const indent_1 = - sliderRow_1.find('li:first').width();
                const indent_2 = - sliderRow_2.find('li:first').width(); 

                motionBlur.setAttribute("stdDeviation", plugin.settings.motionBlurIntensity + ",0");

                sliderRow_1.animate({'left':indent_1}, plugin.settings.animationDuration, plugin.settings.animationEasing, () => { 
                    sliderRow_1.append(sliderRow_1.find('li:first')).css('left', '0');
                });    

                sliderRow_2.animate({'left':indent_2}, plugin.settings.animationDuration, plugin.settings.animationEasing, () => { 
                    sliderRow_2.append(sliderRow_2.find('li:first')).css('left', '0');
                    motionBlur.setAttribute("stdDeviation","0,0");
                });    

                return false;
            
            });

            $slider.find('.tp-right').click( () => { 
                const indent_1 = sliderRow_1.find('li:last').width();
                const indent_2 = sliderRow_2.find('li:last').width();

                motionBlur.setAttribute("stdDeviation", plugin.settings.motionBlurIntensity + ",0");

                sliderRow_1.animate({'left':indent_1}, plugin.settings.animationDuration, plugin.settings.animationEasing, () =>{ 
                    sliderRow_1.prepend(sliderRow_1.find('li:last')).css('left', '0');
                });    

                sliderRow_2.animate({'left':indent_2}, plugin.settings.animationDuration, plugin.settings.animationEasing, () =>{ 
                    sliderRow_2.prepend(sliderRow_2.find('li:last')).css('left', '0');
                    motionBlur.setAttribute("stdDeviation","0,0");
                }); 

                return false;

            });

        }

        $window.load( () => { //Init
            plugin.init(); //'Constructor'
            calculateWidth();
            wrapAppend();
            setOffset();
            setSliderControls();
        });

        $window.resize( () => { //Change slider offset 
            setOffset();
        });
            
    }

    /* Easing functions */ 
    // t: current time, b: begInnIng value, c: change In value, d: duration
    $.easing.jswing = $.easing.swing;

    // Extend jQuery.easing object 
    $.extend($.easing,
    {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: (x, t, b, c, d) => {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: (x, t, b, c, d) => {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });

    /* Add plugin in .fn object */
    $.fn.twoRowSliderJS = function(options) {

        return this.each( ()=> { //return because of jQuery chanining
            if (undefined == $(this).data('twoRowSliderJS')) { //If he is not in object yet
                var plugin = new $.twoRowSliderJS(this, options); //New plugin instance 
                $(this).data('twoRowSliderJS', plugin); //Save reference so we can later use properties and public methods
            }
        });

    }
    
});