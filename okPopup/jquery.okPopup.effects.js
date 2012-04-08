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
