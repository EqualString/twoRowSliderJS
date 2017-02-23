// twoRowSliderJS
// =============
// Author: Alen Egredžija
// Date: 20/02/2017
// Website: 
// Description: Makes two row infinite slider with specified markup.
//              Calculates row width and position.
//
// Options: motionBlur - true/false, (default: true) : enables/disables motion blur when sliding
//          animationDuration - time(ms) <150 - 1500>, default: 330 : sliding animation speed 
//
// Extra usage: Overwrite two-row-slider.css clases for specific behaviour/usage of plugin.
//              

;(function (factory) { //RequireJS, node/Common & klasično korištenje plugina
    if (typeof define === 'function' && define.amd) {
        // AMD. Registriraj kao anoniman modul
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery')(window)); //Slanje window objekta rezultatu require-a
    } else { 
        // Browser 
        factory(jQuery, window);
    }
}(function( $, window ){
    'use strict'

    $.twoRowSliderJS = function( el, opts ) { //Plugin koji ćemo dodati u jQuery .fn objekt

        var plugin = this; 

        const $slider = $(el), //DOM element (slider)
              $window = $(window); //Window objekt (Pozivanje plugina se može pozvati 'najnormalnije') 
        
        //Defaultne opcije
        var defaults = {
            motionBlur: true,
            animationDuration: 330
        };

        plugin.settings = {};

        //Selektori markup-a
        const gridItems = $slider.find('li'),
              imagesContainer = $slider.find('div:first'),
              imagesGrid = imagesContainer.find('ul'),
              heroDiv = $slider.find('div:last');

        //Dodatne Varijable      
        var fullWidth = 0, //Width za sve elemente u gridu
            rowWidth = 0,  //Width row-a
            i = 0,
            blurClass = 'motion-blur';       

        /** Metode **/    
        plugin.init = () => {

            plugin.settings = $.extend({}, defaults, opts); //spajanje defaultnih sa user-provided opcijama ( $.extend )
            if(plugin.settings.motionBlur === false) blurClass = ''; //Ako se kao option pošalje false, inače uvijek postoji motion-blur

            const reg = new RegExp('^[0-9]+$'); //Integer regex
            const duration = plugin.settings.animationDuration;
            if((!reg.test(duration))||(duration > 1500)||(duration < 150)) plugin.settings.animationDuration = 330; //Default ako ne prođe regex ili limite animacije

            //Dodatne 'slider' klase
            $slider.addClass('two-row-slider hidden fadeIn');
            imagesContainer.addClass('images-container');
            imagesGrid.addClass('images-grid');
            heroDiv.addClass('slider-hero');

        }

        const calculateWidth = () => {

            //Izračun ukupne duljine niza slika (sa padding-om)
            gridItems.each(function() {
                $(this).addClass('row-2-element fadeIn'); 
                fullWidth += $(this).outerWidth(true);
            });

            //fullWidth += 65; //fullWidth + padding (controls)

            while(rowWidth <= fullWidth/2){ // -> /2, dva row-a
                $(gridItems[i]).addClass('row-1-element').removeClass('row-2-element'); //<li> u prvom redu ima row-1-element klasu za wrap
                rowWidth += $(gridItems[i]).outerWidth(true);
                i++;
            }

        }

        const wrapAppend = () => {

            //Wrap div-ova
            $slider.find('.row-1-element').wrapAll('<div class="row-1" />').wrapAll('<div class="slider-row-1" />');
            $slider.find('.row-2-element').wrapAll('<div class="row-2" />').wrapAll('<div class="slider-row-2" />');

            //Append kontroli
            $slider.find('.row-2').append('<div class="slider-controls"><div class="arrows"><div class="tp-left"></div><div class="tp-right"></div></div></div>');

             //Width za grid i row-ove
            $slider.find('.images-grid, .row-1').css('width', rowWidth + 'px');
            $slider.find('.row-2').css('width',fullWidth - rowWidth + 'px');

        }

        var setOffset = () => { //Zove se i na $window.resize()

            //Offset za grid, tj. da ga 'izbaci' iz wrappera (images-container -a) i postavi na poziciju
            var offset = rowWidth - imagesContainer.width();

            imagesGrid.css('right', offset + 'px');
            
            $slider.removeClass('hidden'); //Otkriji slider

        }

        const setSliderControls = () => {
            
            //Slider row selektori, da se smanji brzian selektanja u onClick eventima 
            const sliderRow_1 = $slider.find('.slider-row-1'),
                  sliderRow_2 = $slider.find('.slider-row-2');

            //Kontrole slider-a
            $slider.find('.tp-left').click( () => { 
                const indent_1 = - sliderRow_1.find('li:first').width(); // -> :last bi trebalo u zadatku međutim sama animacija čudno izgleda a i logično mi je da se pomakne za dužinu slike koja ulazi u viewport
                const indent_2 = - sliderRow_2.find('li:first').width(); // -||-

                sliderRow_1.addClass(blurClass).animate({'left':indent_1}, plugin.settings.animationDuration, () => { 
                    sliderRow_1.append(sliderRow_1.find('li:first')).css('left', '0').removeClass(blurClass);
                });    

                sliderRow_2.addClass(blurClass).animate({'left':indent_2}, plugin.settings.animationDuration, () => { 
                    sliderRow_2.append(sliderRow_2.find('li:first')).css('left', '0').removeClass(blurClass);
                });    
            });

            $slider.find('.tp-right').click( () => { 
                const indent_1 = sliderRow_1.find('li:last').width();
                const indent_2 = sliderRow_2.find('li:last').width();

                sliderRow_1.addClass(blurClass).animate({'left':indent_1}, plugin.settings.animationDuration, () =>{ 
                    sliderRow_1.prepend(sliderRow_1.find('li:last')).css('left', '0').removeClass(blurClass);
                });    

                sliderRow_2.addClass(blurClass).animate({'left':indent_2}, plugin.settings.animationDuration, () =>{ 
                    sliderRow_2.prepend(sliderRow_2.find('li:last')).css('left', '0').removeClass(blurClass);
                }); 
            });

        }

        $window.load( () => { //Init
            plugin.init(); //'Constructor'
            calculateWidth();
            wrapAppend();
            setOffset();
            setSliderControls();
        });

        $window.resize( ()=> { //Promijeni offset poziciju slider-a ako se promjeni veličina ekrana
            setOffset();
        });
            
    }

    //Dodavanje plugina u .fn objekt
    $.fn.twoRowSliderJS = function(options) {

        return this.each( ()=> { //Vraćanje objekata zbog chaina
            if (undefined == $(this).data('twoRowSliderJS')) { //Ako već nije dodan elementu
                var plugin = new $.twoRowSliderJS(this, options); //Nova instanca plugina (proslijedi DOM element sa opcijama)
                $(this).data('twoRowSliderJS', plugin); //Spremi referencu na plugin objekt da se kasnije može pristupati public metodama i settings property-ima
            }
        });

    }
    
}));