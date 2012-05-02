/**
 * jquery.okTabs.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 05/02/12
 *
 * @description Simple Tabs
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.00
 *
 */

(function($){

  $.fn.okTabs = function(opts){

    opts = $.extend({
      activeClass           : 'active', // className given to the currently selected tab
      activeElementSelector : 'li',     // which element receives the active class
      inEffect              : 'show',   // Effect when content is shown
      outEffect             : 'hide'    // Effect when content is hidden
    }, opts);
    
    return this.each(function(){
      var links  = $("a", this),
          active = $("."+opts.activeClass, this);

      // If no active element is found, use the first
      if (active.length === 0) {
        active = $(opts.activeElementSelector+":first", this);
      }

      active.addClass(opts.activeClass);

      $((active.is("a") ? active : active.find("a")).attr('href')).show().siblings().hide();
    
      $(document).on('click', $(this).selector + ' a', function(e) {
        var self    = $(this),
            content = $(self.attr('href'));
    
        if ( content.length ) {

          e.preventDefault();
    
          self.closest(opts.activeElementSelector).addClass(opts.activeClass).siblings().removeClass(opts.activeClass);
    
          // Show tab content and add active class
          content.siblings()[opts.outEffect]().removeClass(opts.activeClass);
          content[opts.inEffect]().addClass(opts.activeClass);

        }
      });
    });

  };
  
})(jQuery);
