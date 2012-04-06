// Bubble Puff effect
// Also known as the Coda Bubble effect
$.fn.togglePuff = function(settings, callback) {
  settings = $.extend({
    distance   : 10,
    effectTime : 250
  }, settings);

  return this.each(function() {
    var self   = $(this),
        hidden = self.is(":hidden");

    if (hidden) { 
      self.show(); 
    }

    self
      .animate({
        top: '-=' + settings.distance + 'px',
        opacity: hidden ? 1 : 0 
      }, settings.effectTime,  function() {
        if (callback) { 
          callback(this); 
        } 
      });    
  });

};
