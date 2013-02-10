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
  // TODO
  // There's a couple variables here
  // 1) We might want to show 'loading' in various different ways
  //    Perhaps show it separately, perhaps just set it as the elements BG
  // 2) The core should handle content loading - all things need to deal with that
  // 3) Ready should probably be the default for most plugins, and open left empty
  // 
  // init - called once during plugin initialization
  // onOpen - called when the openWhen event is triggered, or $.okPopup.open is called
  //        We could also pass in the deferred here.
  // onClose - called when the closeWhen event is triggered, or $.okPopup.close is called
  $.okPopup.transitions = {
    togglePuff: {
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
      onOpen: function(popup,ui){
        ui.done(function(dimensions){
          popup.stop(true,true).css(dimensions).togglePuff();
        });
      },
      onClose: function(popup){
        popup.stop(true,true).togglePuff();
      }
    },
    // Additional position options:
    //   scaleFrom: 'center' | 'element'
    //     If center popup will scale from the center of the screen
    //     If element it will scale from the triggering element
    grow: {
      // Called when openWhen is triggered
      onOpen: function(popup,ui){
        var thumb = $(ui.event.currentTarget);

        if (!popup.is(":visible")) {
          if (ui.options.position.scaleFrom == 'element') {
            popup.show().css({ 
              height : thumb.height(),
              width  : thumb.width(),
              top    : thumb.offset().top - $(window).scrollTop(),
              left   : thumb.offset().left - $(window).scrollLeft()
            });
          } else {
            popup.show().positionAt(ui.options.position);
          }
        }

        ui.done(function(dimensions){
          popup.stop().animate(dimensions, 'fast', function(){ 
            ui.content.fadeIn();
          });
        });
      },
      // Called when closeWhen is triggered
      onClose: function(popup){
        popup.fadeOut();
      }
    },
    fade: {
      onOpen: function(popup,dimensions){
        popup.css(dimensions).fadeIn();
      },
      onClose: function(popup){
        popup.fadeOut();
      }
    },
    dropdown: {
      onOpen: function(popup,ui){
        ui.done(function(dimensions){
          popup.css($.extend({},dimensions,{ top: -dimensions.top - dimensions.height })).show();
          popup.stop().animate(dimensions, 'fast', function(){ 
            ui.content.fadeIn(); 
          });
        });
      },
      onClose: function(popup){
        popup.stop().animate({top: -popup.offset().top - popup.height()}, 'fast', function(){ 
          popup.hide(); 
        });
      }
    }
  };
})(jQuery);
