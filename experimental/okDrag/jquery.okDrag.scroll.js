/*
 * Shamelessly stolen and adapted from jQuery UI
 */
(function($){
  $.extend($.okDrag,{
    scroll: {
      mousedown: function(){
        var i = this, scrollParent = i.offsetParent();
        if(scrollParent[0] != document && scrollParent[0].tagName != 'HTML') 
          i.overflowOffset = scrollParent.offset();
      },
      mousemove: function(event,o){
        var i = this, scrolled = false, scrollParent = o.scrollContainer;

        if(scrollParent[0] != document && scrollParent[0].tagName != 'HTML') {

          if(!o.axis || o.axis != 'x') {
            if((i.overflowOffset.top + scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
              scrollParent[0].scrollTop = scrolled = scrollParent[0].scrollTop + o.scrollSpeed;
            else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
              scrollParent[0].scrollTop = scrolled = scrollParent[0].scrollTop - o.scrollSpeed;
          }

          if(!o.axis || o.axis != 'y') {
            if((i.overflowOffset.left + scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
              scrollParent[0].scrollLeft = scrolled = scrollParent[0].scrollLeft + o.scrollSpeed;
            else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
              scrollParent[0].scrollLeft = scrolled = scrollParent[0].scrollLeft - o.scrollSpeed;
          }

        } else {

          if(!o.axis || o.axis != 'x') {
            if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
              scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
            else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
              scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
          }

          if(!o.axis || o.axis != 'y') {
            if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
              scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
            else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
              scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
          }

        }

      }
    }
  });
})(jQuery);
