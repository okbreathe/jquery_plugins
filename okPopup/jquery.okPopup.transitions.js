/**
 * jquery.okPopup.transitions.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/17/13
 *
 * @description For popups, modal windows, tooltips etc.
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 2.0 BETA
 *
 */

(function($) {
  /*
   * onInit  - called once during plugin initialization (optional)
   * onOpen  - called when the openWhen event is triggered, or $.okPopup.open is called
   *           We could also pass in the deferred here.
   * onClose - called when the closeWhen event is triggered, or $.okPopup.close is called
   */
  $.okPopup.transitions = {
    bubblePuff: {
      onInit: function(){
        if ($.fn.togglePuff) return;

        $.fn.extend({
          // Bubble Puff Effect
          togglePuff : function(opts, fn) {
            opts = $.extend({ distance : 10, effectTime : 250 }, opts);

            return this.each(function() {
              var self   = $(this),
                  hidden = self.is(":hidden");

              if (hidden) self.show(); 

              self.animate({
                top: '-=' + opts.distance + 'px',
                opacity: hidden ? 1 : 0 
              }, opts.effectTime,  function() {
                self[hidden ? 'show' : 'hide']();
                if (fn) fn.call(this); 
              });    
            });
          }
        });
      },
      onOpen: function(popup, ui){
        ui.done(function(dimensions){
          popup.stop(true,true).css(dimensions).togglePuff();
        });
      },
      onClose: function(popup, transition){
        popup.stop(true,true).togglePuff(transition.resolve);
      }
    },
    // Additional location options:
    //   scaleFrom: 'center' | 'element'
    //     If center popup will scale from the center of the screen
    //     If element it will scale from the triggering element
    grow: {
      // Called when openWhen is triggered
      onOpen: function(popup,ui){
        var thumb = $(ui.element);

        if (!popup.is(":visible")) {
          if (ui.options.location.scaleFrom == 'element') {
            popup.show().css({ 
              height : thumb.height(),
              width  : thumb.width(),
              top    : thumb.offset().top - $(window).scrollTop(),
              left   : thumb.offset().left - $(window).scrollLeft()
            });
          } else {
            popup.show().positionAt(ui.options.location);
          }
        }

        ui.done(function(dimensions){
          popup.stop(true,true).animate(dimensions, 'fast', function(){ 
            ui.content.fadeIn();
          });
        });
      },
      // Called when closeWhen is triggered
      onClose: function(popup,transition){
        popup.stop(true,true).fadeOut(transition.resolve);
      }
    },
    fade: {
      onOpen: function(popup,ui){
        ui.done(function(dimensions){
          popup.stop(true,true).css(dimensions).fadeIn();
        });
      },
      onClose: function(popup,transition){
        popup.stop(true,true).fadeOut(transition.resolve);
      }
    },
    dropdown: {
      onOpen: function(popup,ui){
        ui.done(function(dimensions){
          popup.css($.extend({},dimensions,{ top: -dimensions.top - dimensions.height })).show();
          popup.stop(true,true).animate(dimensions, 'fast', function(){ 
            ui.content.fadeIn(); 
          });
        });
      },
      onClose: function(popup,transition){
        popup.stop(true,true).animate({top: -popup.offset().top - popup.height()}, 'fast', function(){ 
          popup.hide(); 
          transition.resolve();
        });
      }
    }
  };
})(jQuery);
