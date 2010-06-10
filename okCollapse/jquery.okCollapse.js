/*
 * jquery.okCollapse.js
 *
 * Copyright (c) 2010 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 06/09/10
 *
 * @projectDescription Small plugin for hiding/showing list nodes
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 */
(function($){

	$.fn.okCollapse = function(opts){

    opts = $.extend({
      toggleSelector : "a",         // What element will trigger collapsing/expanding of the content
      toggleEvent    : "click",     // Delegated event that will trigger toggling
      collapsedClass : "collapsed", // Class added to collapsed elements
      collapseSpeed  : 3,           // Higher = faster (proportional to the expanded height of the container)
      expansionSpeed : 5,           // Higher = faster (proportional to the expanded height of the container)
      fadeSpeed      : 3,           // Higher = faster
      maxDuration    : 200,         // If the calculated (__Speed * containerHeight) duration is over this amount it will be used in its stead
      collapseOthers : true,        // If true, other visible elements will be collapsed when another is expanded
      callback       : null         // Called when a node without children is reached (receives the clicked element)
    },opts);

    var animating = false;

    function dispatch(e) {
      e.preventDefault();
      var target = $(e.currentTarget),
            list = target.siblings("ul:first");
      if ( animating || list.length<1 ) { 
        if ( opts.callback ) { opts.callback(target); }
        return false; 
      } else { animating = true; }
      if (opts.collapseOthers) {
        target.parent().siblings().find("ul:first").each(function(){ hide($(this)); });
      }
      return list.hasClass(opts.collapsedClass) ?  show(list) : hide(list);
    }


    function show(list) {
      if (!list.hasClass(opts.collapsedClass)) { return (animating = false); }
      list.css({ display:'block' });
      return animate(list,list.data("maxHeight"),1,opts.expansionSpeed);
    }

    function hide(list) {
      if (list.hasClass(opts.collapsedClass)) { return (animating = false); }
      list.css({ opacity:0 });
      return animate(list,0,0,opts.collapseSpeed);
    }

    function animate(list,finalHeight,finalOpacity,movementSpeed) {
      var movementDuration = movementSpeed * list.data("maxHeight"),
          fadeDuration     = opts.fadeSpeed * list.data("maxHeight");
      return list
        .animate(
          { height: finalHeight },
          (movementDuration > opts.maxDuration ? opts.maxDuration : movementDuration),
          function(){
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
      .find("ul")
        .each(function(){
          (self = $(this))
            .data("maxHeight", self.height())
            .css({height:0,opacity:0})
            .addClass(opts.collapsedClass);
        });
    });
	};
})(jQuery);
