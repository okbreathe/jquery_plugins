/*
 * jquery.okSlide
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 08/13/2009
 *
 * @projectDescription Simple Hierarchal Menu Slider
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 * @id jQuery.fn.okSlide
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object.
 *
 * @id jQuery.fn.nextUntil
*
 * Notes:
 *  - The plugin has only been tested with jQuery v 1.3.1
 *
 *  Markup example for $("#wrapper").okSlide();
 *  
 *   <div id="wrapper">
 *    <ul>
 *      <li class='panel'>...whatever...</li>
 *      ...
 *      <li class='panel'>...whatever...</li>
 *    </ul>
 *  </div>
 *
 */

/* Explanation
 *   Navigates through a series of panels, based on attribute names and ids.
 *   Given:
 *   Panel one with an id of 'one'
 *   Panel two with an id of 'one-two'
 *   Panel three with an id of 'one-three'
 *
 *   Children of panels are designated by appending names after the parent
 *   Panel two and three are thought of of children of panel one because of the naming scheme. 
 *
 *   To move down the hierarchy, links have a name attribute with a segment that points further
 *   down the hierarchy
 *   E.g. Panels One would have links with name attributes 'two' or 'three' which would move the
 *   shown panel to two or three if clicked
 *
 *
 * Tips
 *   If you're experience weird navigation issues try setting the explicit width on the 'panels'
 */
(function($) {

  $.fn.nextUntil = function(expr) {
    var match = [];
    this.each(function(){
        for( var i = this.nextSibling; i; i = i.nextSibling ) {
          // Make sure that we're only dealing with elements
          if ( i.nodeType != 1 ){ continue; }
          // stop if we find a match
          if ( $.filter( expr, [i] ).length ){ break; }
          match.push( i );
        }
      });

    return this.pushStack( match, arguments );
  };

  $.fn.okSlide = function(opts) {
    var animating = false;

    opts = $.extend({      
      duration     : 200,              // Duration of the animation
      panelClass   : 'panel',          // Class of the element that will be moved
      vertical     : false,            // If true, panels will move up/down rather than left/right
      nextTrigger  : 'a.more',         // selector of the element that will trigger forward movement
      prevClass    : 'prev',           // class of the li that will trigger backwards movement.  Note: will be dynamically inserted.
      selectTrigger: "a:not('.more')", // A terminal link (a link doesn't go anywhere). Triggers afterSelect event when clicked.
      afterSelect  : null,             // Callback after a terminal link is selected, receives trigger as 'this' and the event
      afterNext    : null,             // Callback after panels are moved forward, receivers trigger as 'this' and the panel we're moving to
      afterPrev    : null              // Callback after panels are moved backward, receivers trigger as 'this' and the panel we're moving to
    }, opts);

    // this  - the trigger
    // dir   - 'prev' or 'next' (direction)
    // prevPanel - panel that we're moving from
    function animate(dir,$prevPanel){
      if (animating) { return false; }
      var $trigger  = $(this),
          $panel    = getNextPanel.call(this,dir,$prevPanel),
          $list     = $prevPanel.closest("ul"),
          direction = dir == 'next' ? "-=" : "+=",
          callback  = dir == 'next' ? 'afterNext' : 'afterPrev',
          params    = opts.vertical ?  
            { marginTop:  direction  + $prevPanel.outerHeight() + "px" } : 
            { marginLeft: direction  + $prevPanel.outerWidth()  + "px" };
            
      // hide all the panels between the one we are moving to, and the current one
      $prevPanel.nextUntil('#'+ $panel.attr('id')).hide(); 
      $panel.show();

      animating = true;

      $list.animate(
        params, { 
          queue:false, 
          duration:opts.duration, 
          complete:function(){ 
            animating = false;
            if (dir == 'prev'){ $($prevPanel.data('parentLink')).remove(); }
            if (opts[callback]) { opts[callback].call($trigger[0], $panel); } 
          } 
      });          
    }

    function getNextPanel(dir,$currentPanel){
      var $panel;
      if (dir == 'next') {
        $panel  = $('#'+$currentPanel.attr('id') + "-" + $(this).attr('name'));
      } else {
        $panel  = $('#'+$currentPanel.attr('id').replace(/\-(\w+)$/,''));
      }
      return $panel;
    }

    // Append a link to the top of current panel to the parent 
    // this       - trigger
    // $prevPanel - panel we're moving form
    // $panel     - panel we're moving to
    function appendPrevLinks($prevPanel){
      var $panel      = getNextPanel.call(this,'next',$prevPanel),
          $list       = $('> ul', $panel),
          $parentLink = $("<li><a href='#' class='" + opts.prevClass + "'>" + $(this).html() +"</a></li>");

      $list.prepend($parentLink);

      $panel.data('parentLink', $parentLink);

      $parentLink.click(function(e){
        e.preventDefault();
        animate.call(this,'prev',$panel);
      });
      return false;
    }

    return this.each(function(){
      var $wrapper  = $(this),
          $list     = $('> ul', $wrapper),
          $panels   = $('> li', $list),
          w         = $panels.outerWidth(true), 
          h         = $panels.outerHeight(true);

      // Set the wrapper to width of the visible panel
      $wrapper.css("overflow","hidden");
      if ( opts.vertical ) {
        $wrapper.height(h); 
      }
      $wrapper.width(w);
      
      // Set the list to width of the entire length of the panels
      $list
        .css('width',$panels.length*w)
        .data('totalPanels', $panels.length);

      if (!opts.vertical) {
        $panels.css('float','left');
      }

      // Hide everything but the current
      $panels.not(":first").hide();

      // Setup event handlers
      $(opts.nextTrigger, $list).click(function(e){
        e.preventDefault();
        if (animating) { return false; }
        var $panel = $(this).closest("."+opts.panelClass);
        appendPrevLinks.call(this, $panel);
        animate.call(this,'next',$panel);
      });
      $(opts.selectTrigger, $list).click(function(e){ e.preventDefault(); if(opts.afterSelect){ opts.afterSelect.call(this,e); }  });
    });
  };

})(jQuery);
