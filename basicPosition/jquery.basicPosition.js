(function($){

  /**
   * jQuery.fn.positionAt     
   * Assists positioning DOM elements relative to other elements
   * @param element {DOMElement} - An element to position
   * @param offsetElement {DOMElement|Event} - An element to position from
   * @param locationOrOptions {String|Object} - A String of a named location, or an options object
   *
   * If passing an object, you can specify the offset from the caculated
   * position by giving offsetLeft and offsetTop
   *
   */
  // TODO allow omitting the offsetElement
  $.positionAt = function(element, offsetElement, locationOrOptions) {
    var scrollTop, screenWidth, top, left, offsetTop, offsetLeft, location, options,
        self   = $(element),
        params = {};

    offsetElement = offsetElement instanceof jQuery ? offsetElement[0] : offsetElement;

    if (typeof(locationOrOptions) == 'string' ) {
      location = locationOrOptions;
    } else if ($.isPlainObject(locationOrOptions)) {
      location = locationOrOptions.location;
      options  = locationOrOptions;
    } 

    options    = options || {};
    offsetLeft = options.offsetLeft || 0;
    offsetTop  = options.offsetTop  || 0; 

    if (location) {
      self.css({ position:'absolute' }); // Needs to be done before we measure
      params = $.positionAt.locations[location].call(offsetElement, element, options);
    } else {
    
      scrollTop   = $(window).scrollTop(); 
      screenWidth = $(window).width();

      if (offsetElement.currentTarget) {
        left = offsetElement.pageX;
        top  = offsetElement.pageY;
      } else {
        offsetElement = $(offsetElement).offset();
        left = offsetElement.left;
        top  = offsetElement.top;
      }

      // Ensure we don't clip the screen
      
      if (left + self.outerWidth() + (offsetLeft*2) >= screenWidth){
        left = screenWidth - self.width() - offsetLeft;
      }

      if (top + (offsetTop*2) <= scrollTop) {
        top = scrollTop - (offsetTop*2);
      }

      params = { top: top, left: left };

    }

    params.top  = params.top + offsetTop;
    params.left = params.left + offsetLeft;

    return params;

  };

  $.fn.positionAt = function(offsetElement, locationOrOptions){
    return this.each(function(){
      $(this).css($.positionAt(this, offsetElement, locationOrOptions));
    });
  };

  /*
   * Named locations for use with jQuery.positionAt
   */
  $.positionAt.locations = {
    elementBottom: function(element,opts) {
      var pos = getPosition(this,element);
      return {top: pos.top + pos.height, left: pos.left + pos.width / 2 - pos.elementWidth / 2};
    },
    elementTop: function(element,opts) {
      var pos = getPosition(this,element);
      return {top: pos.top - pos.elementHeight, left: pos.left + pos.width / 2 - pos.elementWidth / 2};
    },
    elementLeft: function(element,opts) {
      var pos = getPosition(this,element);
      return {top: pos.top + pos.height / 2 - pos.elementHeight / 2, left: pos.left - pos.elementWidth};
    },
    elementRight: function(element,opts) {
      var pos = getPosition(this,element);
      return {top: pos.top + pos.height / 2 - pos.elementHeight / 2, left: pos.left + pos.width};
    },
    center: function(element,opts){
      var self        = $(element),
          win         = $(window), 
          doc         = $(document),
          width       = self.width(),
          height      = self.height(),
          margin      = opts.margin || 10,
          adjusted;

      // Don't set the width if we've been told not to
      if (opts.constrain !== false) {
        if (width > (win.width() - margin * 2)) {
          adjusted = win.width() - margin * 2;
          height	 = (adjusted / width) * height;
          width	   = adjusted;
        }
        if (height > (win.height() - margin * 2)) {
          adjusted = win.height() - margin * 2;
          width	   = (adjusted / height) * width;
          height   = adjusted;
        }
      }

      return {
        width  : width,
        height : height,
        top    : Math.max((win.height() / 2) - (height / 2) + doc.scrollTop(), 0),
        left   : Math.max((win.width() / 2) - (width / 2) + doc.scrollLeft(), 0)
      };
    }
  };

  function getPosition(offsetElement,element) {
    return $.extend({}, $(offsetElement).offset(), {
      width         : offsetElement.offsetWidth,
      height        : offsetElement.offsetHeight,
      elementWidth  : element.offsetWidth,
      elementHeight : element.offsetHeight
    });
  }

})(jQuery);
