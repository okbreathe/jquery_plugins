/*
 * jquery.okSlide
 *
 * Copyright (c) 2010 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 05/04/2010
 *
 * @projectDescription Simple Hierarchical Menu Slider
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.1
 *
 * @id jQuery.fn.okSlide
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object.
 *
 * @id jQuery.fn.nextUntil
 *
 * Notes:
 *	- The plugin requires jQuery v 1.4.2.
 */

(function($) {

  $.fn.nextUntil = function(expr) {
    var match = [];
    this.each(function(){
      for( var i = this.nextSibling; i; i = i.nextSibling ) {
        if ( i.nodeType != 1 ){ continue; }
        if ( $.filter( expr, [i] ).length ){ break; }
        match.push( i );
      }
    });
    return this.pushStack( match, arguments );
  };

  $.fn.okSlide = function(opts) {
    opts = $.extend({      
      triggerEvent : "click", // Trigger showing next panel
      panelSelector: "li",    // Selector of the element that will be moved
      duration     : 200,     // Duration of the animation
      vertical     : false,   // If true, panels will move up/down rather than left/right
      afterSelect  : null,    // Callback after a terminal link is selected, receives trigger as 'this'
      afterNext    : null,    // Callback after panels are moved forward, receivers trigger as 'this' and the panel we're moving to
      afterPrev    : null,    // Callback after panels are moved backward, receivers trigger as 'this' and the panel we're moving to
      prevClass    : "prev",  // Class of the li that will trigger backwards movement.  Note: will be dynamically inserted.
      backtrackText: function(){ return 'back'; },               // Text used by the backtracking link
      backtrack    : function(link){ return this.prepend(link);} // Function to use to append a backtracking link.  Set to false to only allow one-way traversal
                                                                 // 'this' will be set to the panel
    }, opts);

    var animating = false;

    function animate(dir){
      var next, params, resizeOn, 
          trigger  = this,
          cur      = this.closest(opts.panelSelector),
          id       = this.attr('href').split("#")[1],
          callback = opts[dir == '+=' ?  'afterPrev' : 'afterNext'],
          list     = cur.closest("ul");

      if (id) {
        animating = true;
        next      = $("#"+id);
        resizeOn  = dir == "-=" ? cur : next;

        if (dir == '-=' && opts.backtrack) { 
          addBackLink(this, cur, next); 
        }

        if (opts.vertical) {
          list.closest(".ui-slide-wrapper").height(next.outerHeight()+"px");
        } else {
          list.closest(".ui-slide-wrapper").width(next.outerWidth()+"px");
        }

        params = opts.vertical ?  { marginTop:  dir + resizeOn.outerHeight() + "px" } : { marginLeft: dir + resizeOn.outerWidth()  + "px" };

        // hide all the panels between the one we are moving to, and the current one
        cur.nextUntil(next).hide(); 
        next.show();

        return list.animate(
          params, { 
            queue:false, 
            duration:opts.duration, 
            complete:function(){ animating = false; if (callback) { callback.call(trigger,next) } } 
        });          
      }
      if (opts.afterSelect) { opts.afterSelect.call(trigger); }
      return false;
    }

    // When moving vertically, we need to take into account the appended link...so maybe append it before getting the height
    function addBackLink(trigger,cur,next){
      if (next.data('prevLink')) { return false; }
      opts.backtrack.call(next,"<a href='#"+cur.attr('id')+"' class='" + opts.prevClass + "'>"+opts.backtrackText.call(trigger,cur)+"</a>");
      next.data('prevLink', true);
    }

    return this.each(function(){
      var list  = $(this),
          items = list.children(), 
          ct    = $("<div class='ui-slide-wrapper'></div>"),
          w     = items.outerWidth(true),
          h     = items.outerHeight(true);
      ct
      .css("overflow","hidden")
      .insertBefore(list)
      .append(list);

      if (opts.vertical) {
        ct.height(items.height())
        list.height(h);
      } else {
        ct.width(items.width())
        list.width(w);
        items.css('float','left');
      }

      // Hide everything but the current
      items.slice(1).hide();

      list.delegate("a",opts.triggerEvent, function(e){
        e.preventDefault();
        var t = $(e.currentTarget);
        if (animating) { return false; }
        animate.call(t,opts.backtrack && t.hasClass(opts.prevClass) ? "+=" : "-=");
      });

    });
  };

})(jQuery);
