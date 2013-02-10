/**
 * jquery.okPopup.effects.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 04/05/12
 *
 * @description For popups, modal windows, tooltips etc.
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
*/

(function($) {
  $.fn.extend({

    // Bubble Puff Effect
    togglePuff : function(opts, fn) {
      opts = $.extend({
        distance   : 10,
        effectTime : 250
      }, opts);

      return this.each(function() {
        var self   = $(this),
        hidden = self.is(":hidden");

        if (hidden) { 
          self.show(); 
        }

        self.animate({
          top: '-=' + opts.distance + 'px',
          opacity: hidden ? 1 : 0 
        }, opts.effectTime,  function() {
          self[hidden ? 'show' : 'hide']();
          if (fn) { 
            fn.call(this); 
          } 
        });    

      });
    }

  });
})(jQuery);
