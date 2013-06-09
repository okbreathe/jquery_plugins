/**
 * jquery.okCycle.ui.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/23/13
 *
 * @description Provides UI elements for okCycle
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.5
 *
 */

(function($){

  /**
   * This follows the basic pattern set forth by the transitions package. `init` is
   * called on setup, this on move `move` is called. 
   * 
   * The only difference is that the first argument to UI functions is the UI
   * container element itself.  
   *
   * `this` is still set to the slideshow itself. See okCycle.transitions for
   * an explanation of the transition object.
   *
   * Note that both `init` and `move` are optional, you only need to specify
   * them if you actually need to use them
   *
   */

  $.okCycle.ui = {
    // Pull the data-caption attribute. 
    // If the data-caption attribute begins with an octothorpe, we will assume
    // it is referring to the id of another element somewhere on page,
    // otherwise we'll use the content directly
    caption: {
      init: function(ui,opts){
        $.okCycle.ui.caption.setCaption(this.children().eq(this.data('activeSlide')),$("<div class='caption' style='z-index:4' />").appendTo(ui).hide());
      },
      // If a caption begins with a octothorpe we'll consider it an id attribute of an element containing the caption
      move: function(ui,transition){
        $.okCycle.ui.caption.setCaption(this.children('.active'), $(".caption", ui));
      },
      setCaption: function(el,container){
        var caption = el.data('caption') || ''; 

        caption = caption[0] == '#' ? $(caption).html() : caption;

        if (container.is(":visible")) {
          caption !== '' ?  container.html(caption) : container.fadeOut();
        } else if (caption !== ''){
          container.html(caption).fadeIn();
        }
      }
    },
    // Forward/back buttons
    navigation: {
      init: function(ui,opts){
        var self = this,
            nav  = $("<ul class='navigation'><li class='prev'><a href='#'>Previous</a></li><li class='next'><a href='#'>Next</a></li></ul>").appendTo(ui);
        nav.find(".prev a").click(function(e){ e.preventDefault(); self.prev(); });
        nav.find(".next a").click(function(e){ e.preventDefault(); self.next(); });
      }
    },
    // Pagination for jumping to specific slides
    pagination: {
      init: function(ui,opts){
        var self = this, html = "<ul class='pagination'>";
        for(var i=0; i< this.children().length; i++) {
          html += '<li><a href="#">'+(i+1)+'</a></li>';
        }
        var pagination = $(html+"</ul>").appendTo(ui);

        pagination.children().eq(this.data('activeSlide')).addClass('active');

        pagination.on('click', 'a', function(e){
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
		// Enable mousewheel support
    mouseWheel: {
      init: function(ui,opts) {
        var self = this;
        ui.mousewheel(function(e, delta)  {
          self[delta < 0 ? 'next' : 'prev'](); 
          return false;
        });			
      }
    },
    // Enable touch support
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
        
        self[0].ontouchstart = function(e) {
          touch.x = e.touches[0].clientX;
          touch.y = e.touches[0].clientY;
        };
        
        self[0].ontouchmove = function(e) {
          
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
              e.preventDefault(); 
              self[op](); 
            }
          }
        };
      
      } // init
    }
  };

})(jQuery);
