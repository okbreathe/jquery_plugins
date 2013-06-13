/**
 * jquery.okTabs.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 06/12/13
 *
 * @description Simple Tabs
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.1
 *
 */

(function($){

  $.fn.okTabs = function(opts){

    opts = $.extend({
      useHashNavigation     : true,         // Whether or not clicking tabs changes the location.hash
      activeClass           : 'active',     // className given to the currently selected tab
      activeElementSelector : 'li',         // Which element receives the active class
      inEffect              : 'show',       // Effect when content is shown
      outEffect             : 'hide',       // Effect when content is hidden
      afterSetup            : function(){}, // Called after the plugin has bound to each tabbed interface
      afterSelect           : function(){}  // Called whenever a tab change occurs
    }, opts);

    function select(e) {
      var self    = $(this),
          content = $(self.attr('href')),
          st      = parseInt($(window).scrollTop(),10); // Store scrolltop
  
      if (content.length) {
        self.closest(opts.activeElementSelector).addClass(opts.activeClass).siblings().removeClass(opts.activeClass);
  
        // Show tab content and add active class
        content.siblings()[opts.outEffect]().removeClass(opts.activeClass);
        content[opts.inEffect]().addClass(opts.activeClass);

        opts.afterSelect.call(this);

        if (opts.useHashNavigation) {
          // Restore scrollTop
          setTimeout(function(){ $(window).scrollTop(st); }, 10);
        } else if (e){ 
          e.preventDefault(); 
        }
      }
    }

    $(document).on('click', $(this).selector + ' a', select);

    // Fire during hashchange
    if (opts.useHashNavigation) {
      $(window).bind('hashchange',function(){
        var anchor = location.hash,
            target;

        if (anchor && (target = $("a[href='"+anchor+"']")).length) 
          select.call(target);
      });

      // Trigger hashchange when the page is ready
      $(function(){ $(window).trigger('hashchange'); });
    }
    
    return this.each(function(){
      var links  = $("a", this),
          active = $("."+opts.activeClass, this);

      // If no active element is found, use the first
      if (active.length === 0) {
        active = $(opts.activeElementSelector+":first", this);
      }

      active.addClass(opts.activeClass);

      $((active.is("a") ? active : active.find("a")).attr('href')).show().siblings().hide();
    
      opts.afterSetup.call(this);
    });

  };
  
})(jQuery);
