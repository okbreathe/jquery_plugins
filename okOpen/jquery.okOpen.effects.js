$.fn.extend({
  // Bubble Puff effect
  // Also known as the Coda Bubble effect
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

  },

  zoomIn: function(opts){

    opts = $.extend({
      duration      : 300,
      top           : 0,
      left          : 0,
      height        : 1,
      width         : 1,
      easing	      :	'swing',
      fitToViewport : true,    // The zoomed image will be constrained to the viewport dimensions
      margin        :	15		   // If using setToViewPort the margin from image to window (if the image would otherwise be larger than the screen)
    }, opts);

    var w    = $(window), 
        d    = $(document),
        finalWidth   = this.width(),
        finalHeight   = this.height(),
        adjusted,
        top, 
        left;

    // Set final dimensions for image
    if (opts.fitToViewport) {
      if (finalWidth > (w.width() - opts.margin * 2)) {
        adjusted = w.width() - opts.margin * 2;
        finalHeight	= (adjusted / finalWidth) * finalHeight;
        finalWidth	= adjusted;
      }
      if (finalHeight > (w.height() - opts.margin * 2)) {
        adjusted = w.height() - opts.margin * 2;
        finalWidth	= (adjusted / finalHeight) * finalWidth;
        finalHeight	= adjusted;
      }
    }

    // Center it
    top  = Math.max((w.height() / 2) - (finalHeight / 2) + d.scrollTop(), 0);
    left = Math.max((w.width() / 2) - (finalWidth / 2) + d.scrollLeft(), 0);

    this.css({ height: opts.height, width: opts.width, top: opts.top, left: opts.left }).show()
      .find('img')
        .css({ width: '100%' });

    return this.animate({
        top     : top,
        left    : left,
        width   : finalWidth,
        height  : finalHeight
      }, opts.durationIn, opts.easingIn);
  },
  zoomOut: function(opts){
    opts = $.extend({
      duration  : 200,    
      top       : 0,
      left      : 0,
      easing   	:	'swing'
    }, opts);

    return this.animate({
      top     : opts.top,
      left    : opts.left,
      opacity : "hide",
      width   : 1,
      height  : 1
    }, opts.duration, opts.easing);
  }
});
