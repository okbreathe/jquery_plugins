(function($){

  /*
   * jQuery.fn.positionAt     
   * Assists positioning DOM elements relative to body
   * @param object   - A String of a named object, DOM Element, Dom Event, or [x,y] array of coordinates
   * @param offsetLeft - added to the calculated x position
   * @param offsetTop  - added to the calculated y position
   *
    element, offsetX, offsetY
    element, namedPosition
    object of CSS options
   */
  $.fn.positionAt = function(object, positionOrOffset){
    var params, scrollTop, screenWidth, top, left, offsetTop, offsetLeft;

    return this.each(function(){
      var self = $(this);

      if ($.isPlainObject(positionOrOffset)) {
        params = positionOrOffset;
      } else { // Event or DOM Element

        if (typeof(positionOrOffset) == 'string') {
          self.css({position:'absolute'});
          params = $.fn.positionAt.locations[positionOrOffset].call(object,this);
        } else {
        
          if (positionOrOffset instanceof Array) {
             offsetLeft = positionOrOffset[0] || 0;
             offsetTop  = positionOrOffset[1] || 0; 
          }

          scrollTop   = $(window).scrollTop(); 
          screenWidth = $(window).width();

          if (object.currentTarget) {
            left = object.pageX;
            top  = object.pageY;
          } else {
            object = $(object).offset();
            left = object.left;
            top  = object.top;
          }

          // Ensure we don't clip the screen
          
          if (left + self.outerWidth() + (offsetLeft*2) >= screenWidth){
            left = screenWidth - self.width() - offsetLeft;
          }

          if (top + (offsetTop*2) <= scrollTop) {
            top = scrollTop - (offsetTop*2);
          }

          params = {
            top:  top  + offsetTop,
            left: left + offsetLeft
          };

        }

        if (!params.position){ 
          params.position = "absolute"; 
        }

      }

      self.css(params);
    });
  };

  function getPosition(elem,popup) {
    return $.extend({}, $(elem).offset(), {
      width: elem.offsetWidth , 
      height: elem.offsetHeight,
      actualWidth: popup.offsetWidth,
      actualHeight: popup.offsetHeight
    });
  }

  /*
   * Named locations for use with jQuery.fn.positionAt
   */
  $.fn.positionAt.locations = {
    elementBottom: function(popup) {
      var pos = getPosition(this,popup);
      return {top: pos.top + pos.height, left: pos.left + pos.width / 2 - pos.actualWidth / 2};
    },
    elementTop: function(popup) {
      var pos = getPosition(this,popup);
      return {top: pos.top - pos.actualHeight, left: pos.left + pos.width / 2 - pos.actualWidth / 2};
    },
    elementLeft: function(popup) {
      var pos = getPosition(this,popup);
      return {top: pos.top + pos.height / 2 - pos.actualHeight / 2, left: pos.left - pos.actualWidth};
    },
    elementRight: function(popup) {
      var pos = getPosition(this,popup);
      return {top: pos.top + pos.height / 2 - pos.actualHeight / 2, left: pos.left + pos.width};
    },
    center: function(popup){
      var top  = ($(window).height() - this.offsetHeight) / 2,
          left = ($(window).width()  - this.offsetWidth)  / 2;
      return {
        position: $.browser.msie && $.browser.version.substr(0,1)<7 ? "absolute" : "fixed", // IE6 doesn't do position:fixed
        margin:0, 
        top:  (top  > 0 ? top  : 0), 
        left: (left > 0 ? left : 0)
      };
    }
  };

})(jQuery);
