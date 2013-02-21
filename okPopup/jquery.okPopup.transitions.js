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
  "use strict";
  /**
   * @method onInit  (optional) called once during plugin initialization
   * @param {Object} options Plugin Options
   *
   * @method onOpen  called when the openWhen event is triggered, or popup.open is called
   *                 You can attach callbacks to the ui promise to trigger them
   *                 after the content is loaded. It receives the final dimensions as an
   *                 argument
   * @param {jQuery}  popup
   * @param {Promise} ui           Enhanced Promise Object
   * @param {jQuery}  [ui.element] The element that triggered the event
   * @param {jQuery}  [ui.content] The content for this popup
   * @param {Object}  [ui.options] The original plugin options for this instance
   *
   * @method onClose called when the closeWhen event is triggered, or popup.close is called
   *                 The transition should be resolved when the onClose method is done.
   * @param {jQuery}   popup
   * @param {Deferred} transition           Enhanced Deferred Object
   * @param {jQuery}   [transition.element] The element that triggered the event
   * @param {Object}   [transition.options] The original plugin options for this instance
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
    /**
     * This transition takes additional location options
     * 
     * @param {String} [options.location.scaleFrom] Can be either 'center' or 'element'. If 'center', 
     * scales from the center of the screen, if 'element' scales from the triggering element
     */
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
