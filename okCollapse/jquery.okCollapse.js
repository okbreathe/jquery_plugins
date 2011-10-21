/*
 * jquery.okCollapse.js
 *
 * Copyright (c) 2010 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 09/27/11
 *
 * @projectDescription Small plugin for hiding/showing list nodes
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.13
 *
 */
(function($){

	$.fn.okCollapse = function(opts){

    opts = $.extend({
      toggleSelector      : "a",         // Selector that triggers collapsing/expanding of the content
      startCollapsed      : true,        // If true lists will be collapsed on page load
      collapsibleSelector : "ul",        // Selector that determines which elements will be collapsible
      toggleEvent         : "click",     // Delegated event that will trigger toggling
      collapsedClass      : "collapsed", // Class added to collapsed elements
      collapseSpeed       : 3,           // Higher = faster (proportional to the expanded height of the container)
      expansionSpeed      : 5,           // Higher = faster (proportional to the expanded height of the container)
      fadeSpeed           : 3,           // Higher = faster
      maxDuration         : 200,         // If the calculated (__Speed * containerHeight) duration is over this amount it will be used in its stead
      collapseOthers      : false,       // If true, other visible elements will be collapsed when another is expanded
      showSingle          : true,        // If true, lists with a single item will default to being visible
      afterShow           : null,        // Called after a node is revealed
      afterHide           : null,        // Called after a node is revealed
      callback            : null         // Called when a node without children is reached (receives the clicked element)
    },opts);

    var animating = false;

    function dispatch(e) {
      e.preventDefault();
      var target = $(e.currentTarget),
            list = target.closest("li").find(opts.collapsibleSelector+":first");
      if ( animating || list.length<1) { 
        if ( opts.callback ) { opts.callback.call(list,target); }
        return false; 
      } else { 
        animating = true; 
      }
      if (opts.collapseOthers) {
        target.parent().siblings().find(opts.collapsibleSelector+":first").each(function(){ 
          if ($(this).siblings("a:first").is(":visible")) {
            hide($(this)); 
          }
        });
      }
      if (opts.afterShow &&  list.hasClass(opts.collapsedClass)) { opts.afterShow.call(target); }
      if (opts.afterHide && !list.hasClass(opts.collapsedClass)) { opts.afterHide.call(target); }
      target.toggleClass(opts.collapsedClass);
      return list.hasClass(opts.collapsedClass) ?  show(list) : hide(list);
    }

    function show(list) {
      if (!list.hasClass(opts.collapsedClass)) { return (animating = false); }
      list.css({ display:'block' });
      // Calculate height for newly appended items
      if (!list.data("maxHeight")) {
        list
          .data("maxHeight", list.height())
          .css({height:0,opacity:0});
      }
      // Ensure that modifications to the list after expansion aren't limited to a preset height
      return animate(list,list.data('maxHeight'),1,opts.expansionSpeed,function(){ this.css("height", "auto"); });
    }

    function hide(list) {
      if (list.hasClass(opts.collapsedClass)) { return (animating = false); }
      list.css({ opacity:0 });
      return animate(list,0,0,opts.collapseSpeed);
    }

    function animate(list,finalHeight,finalOpacity,movementSpeed,callback) {
      var movementDuration = movementSpeed  * list.data("maxHeight"),
          fadeDuration     = opts.fadeSpeed * list.data("maxHeight");

      return list
        .stop(true,true)
        .animate(
          { height: finalHeight },
          (movementDuration > opts.maxDuration ? opts.maxDuration : movementDuration),
          function(){
            if (callback) { callback.call($(this)); }
            list.animate({ opacity:finalOpacity }, (fadeDuration > opts.maxDuration ? opts.maxDuration : fadeDuration) );
            animating = false;
          }
        )
        .toggleClass(opts.collapsedClass);
    }

    return this.each(function(){
      var self;
      $(this)
      .delegate(opts.toggleSelector, opts.toggleEvent, dispatch)
      .find(opts.collapsibleSelector)
        .each(function(){
          self = $(this);
          if (!opts.showSingle && self.children().length <= 1) {
            self.siblings(opts.toggleSelector+":first").hide();
          } else {
            self.data("maxHeight", self.height());
            if (opts.startCollapsed || self.hasClass(opts.collapsedClass)) {
              self.css({height:0, opacity:0}).addClass(opts.collapsedClass);
            }
          }
        });
    });
	};
})(jQuery);
