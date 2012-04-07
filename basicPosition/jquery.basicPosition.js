(function($){

  /*
   * jQuery.fn.positionAt     
   * Assists positioning DOM elements relative to body
   * @param location   - A String of a named location, DOM Element, Dom Event, or [x,y] array of coordinates
   * @param offsetLeft - added to the calculated x position
   * @param offsetTop  - added to the calculated y position
   */
  $.fn.positionAt = function(location,offsetLeft,offsetTop){
    var params, scrollTop, screenWidth, top, left;   
    offsetLeft = offsetLeft || 0;
    offsetTop  = offsetTop  || 0;
    return this.each(function(){
      var self = $(this);
      if (typeof(location) == "string"){
        params = $.fn.positionAt.locations[location].call(self);
      } else if (location instanceof Array) {
        params = {top:location[1]||0+offsetTop,left:location[0]||0+offsetLeft};
      } else if ($.isPlainObject(location)) {
        params = location;
      } else { // Event or DOM Element
        scrollTop   = $(window).scrollTop(); 
        screenWidth = $(window).width();
        if (location.currentTarget) {
          left = location.pageX;
          top  = location.pageY;
        } else {
          location = $(location).offset();
          left = location.left;
          top  = location.top;
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

      self.css(params);
    });
  };

  /*
   * Named locations for use with jQuery.fn.positionAt
   */
  $.fn.positionAt.locations = {
    topLeft     : function(){ return { left:  0, top:0 };    },
    topRight    : function(){ return { right: 0, top:0 };    },
    bottomRight : function(){ return { right: 0, bottom:0 }; },
    bottomLeft  : function(){ return { left:  0, bottom:0 }; },
    topCenter   : function(){ return { top:   0, width: "50%", left: "25%"}; },
    center      : function(absolute){
      // var css = {
        // position :	absolute ? 'absolute' : 'fixed', 
        // left     :  '50%', 
        // top      :  '50%',
        // marginLeft:	'-' + (this.outerWidth() / 2), 
        // marginTop:	'-' + (this.outerHeight() / 2)
      // };

      // if (absolute) {
        // css.marginTop =	parseInt(this.css('marginTop'),  10) + $(window).scrollTop();
        // css.marginLeft =	parseInt(this.css('marginLeft'), 10) + $(window).scrollLeft();
      // }
      // return css;

      var top  = ($(window).height() - this.outerHeight()) / 2,
          left = ($(window).width()  - this.outerWidth())  / 2;
      return {
        position: $.browser.msie && $.browser.version.substr(0,1)<7 ? "absolute" : "fixed", // IE6 doesn't do position:fixed
        margin:0, 
        top:  (top  > 0 ? top  : 0), 
        left: (left > 0 ? left : 0)
      };
    }
  };

})(jQuery);
