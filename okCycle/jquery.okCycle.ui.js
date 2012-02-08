/**
 * jquery.okCycle.ui.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/15/12
 *
 * @description Provides UI elements for okCycle
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.00
 *
 */

(function($){

  /*
   * This follows the basic pattern set forth by the effects package. Init is
   * called on setup, this on move `move` is called. The only difference is
   * that the first argument to UI functions is the UI container element
   * itself.  `this` is still set to the slideshow itself. See
   * okCycle.transitions for an explanation of the transition object.
   *
   * Note that both `init` and `move` are optional, only add them if you need
   * them
   *
   */

  $.okCycle.ui = {
    // Pull the title attribute or a specific element to provide a caption
    caption: {
      init: function(ui,opts){
        $.okCycle.ui.caption.setCaption(this.children().eq(this.data('activeSlide')),$("<div class='caption'></div>").appendTo(ui).hide());
      },
      // If a title begins with a octothorpe we'll consider it an id attribute of an element containing the caption
      move: function(ui,transition){
        $.okCycle.ui.caption.setCaption(this.children('.active'), $(".caption", ui));
      },
      setCaption: function(el,container){
        var caption = el.attr('title') || ''; 

        caption = caption[0] == '#' ? $(caption).html() : caption;

        if (container.is(":visible")) {
          caption !== '' ?  container.html(caption) : container.fadeOut();
        } else if (caption !== ''){
          container.html(caption).fadeIn();
        }
      }
    },
    // Construct forward/back buttons
    navigation: {
      init: function(ui,opts){
        var self = this,
            nav  = $("<ul class='navigation'><li class='prev'><a href='#'>Previous</a></li><li class='next'><a href='#'>Next</a></li></ul>").appendTo(ui);
        nav.find(".prev a").click(function(e){ e.preventDefault(); self.prev(); });
        nav.find(".next a").click(function(e){ e.preventDefault(); self.next(); });
      }
    },
    // Construct pagination for jumping to specific slides
    pagination: {
      init: function(ui,opts){
        var self = this, html = "<ul class='pagination'>";
        for(var i=0; i< this.children().length; i++) {
          html += '<li><a href="#">'+(i+1)+'</a></li>';
        }
        var pagination = $(html+"</ul>").appendTo(ui);

        pagination.children().eq(this.data('activeSlide')).addClass('active');

        $("a", pagination).click(function(e){
          e.preventDefault();
          var li = $(this).parent();
          self.moveTo(li.siblings().andSelf().index(li));
        });
      },
      move: function(ui,transition){
        // Just set the active class
        $(".pagination", ui).children().removeClass('active').eq(transition.toIndex).addClass('active');
      }
    },
    // Display current and total pages
    currentPage: {
      init: function(ui,opts){
        ui.append('<ul class="current-page"><li class="current">'+(this.data('activeSlide')+1)+'</li><li class="total">'+this.children().length+'</li></ul>');
      },
      move: function(ui,transition){
        $("li.current", ui).html(transition.toIndex+1);
      }
    },
    // Add touch control the slideshow
    touch: {
      init: function(ui,opts) {
        opts = $.extend({
          vertical: false,
          threshold:  {
            x: 10,
            y: 25
          }
        },opts);

        var self = this, touch = {};
        
        self.ontouchstart = function(e) {
          touch.x = e.touches[0].clientX;
          touch.y = e.touches[0].clientY;
        };
        
        self.ontouchmove = function(e) {
          
          // only deal with one finger
          if (e.touches.length == 1) {			
            var op     = false,
                t      = e.touches[0],
                deltaX = touch.x - t.clientX,
                deltaY = touch.y - t.clientY;

            if (deltaY < opts.threshold.y && deltaY > (opts.threshold.y*-1)) {
              if (deltaX > opts.threshold.x)      { op = 'next'; }
              if (deltaX < (opts.threshold.x*-1)) { op = 'prev'; }
            } else if (vertical && (deltaX < opts.threshold.x && deltaX > (opts.threshold.x*-1)) ) {
              if (deltaY > opts.threshold.y)      { op = 'next'; }
              if (deltaY < (opts.threshold.y*-1)) { op = 'prev'; }
            }

            if (op) { 
              self[op](); 
              e.preventDefault(); 
            }
          }
        };
      
      } // init
    }
  };

})(jQuery);
