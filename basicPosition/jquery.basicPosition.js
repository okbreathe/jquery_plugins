(function($){

  /*
   * jQuery.fn.positionAt     
   * Assiting in positioining DOM elements
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
        // Ensure we don't go move the screen
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
      if (!params.position){ params.position = "absolute"; }
      self.css(params);
    });
  };

  /*
   * Named locations for use with jQuery.fn.positionAt
   */
  $.fn.positionAt.locations = {
    center: function(){
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
