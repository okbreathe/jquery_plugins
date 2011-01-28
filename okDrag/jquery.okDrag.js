/*
 * jquery.okDrag.js
 *
 * Copyright (c) 2011 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 03/11/11
 *
 * @projectDescription Simple Drag and Drop Sorting
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 0.1.1
 *
 */
(function($){

  var lists         = $(''),
      lastPosition  = null,
      originalList  = null,
      originalIndex = null,
      dragged       = null,
      placeHolder   = null,
      dropTargets   = [];

  $.okDrag = {
    opts: {},
    mouseDown: function(e,opts){
      D.opts = opts;
      if (D.opts.enableDrag && !D.opts.enableDrag.call(e.target)) {
        return false;
      }

      lists   = $(D.opts.listSelector);
      dragged = $(e.target).closest(D.opts.itemSelector);

      var pOffset = dragged.offsetParent().offset(),
          offsetX = ( e.pageX - dragged.offset().left ) + pOffset.left,
          offsetY = ( e.pageY - dragged.offset().top  ) + pOffset.top;

      if (e.button == 2 || dragged.is(D.opts.handleSelectorExclude)) { return false; }

      placeHolder = $(D.opts.placeHolderTemplate);

      dragged
        .trigger("dragStart")
        .css({ position: "absolute", opacity: 0.8, "z-index": 999, left:e.pageX-offsetX, top:e.pageY-offsetY})
        .after(placeHolder);

      D.cachedropTargets(); 
      D.cacheOriginalPosition();

      if (D.scroll) {
        D.scroll.mousedown.call(dragged);  
      }

      $(document)
        .bind('mouseup'  , D.dragStop)
        .bind('mousemove', {x:offsetX, y:offsetY}, D.dragStart);
      return false;
    },
    dragStart: function(e){
      var isect = D.intersection(e.pageX, e.pageY), 
          list  = dropTargets[isect[0]],
          item;

      dragged.css({ top: e.pageY - e.data.y , left: e.pageX - e.data.x });

      if (D.scroll) {
        D.scroll.mousemove.call(dragged,e,D.opts);  
      }

      if ( isect &&  (!D.opts.dragBetween ? list.item[0] == originalList : true)) {
        item = list.dropTargets[isect[1]];
        if ( item && item.item[0] != placeHolder[0] ) {
          if (lastPosition === null || lastPosition.top > dragged.offset().top || lastPosition.left > dragged.offset().left) {
            item.item.before(placeHolder);
          } else { 
            item.item.after(placeHolder); 
          }
        } else if (list && list.dropTargets.length === 0) {
          list.item.append(placeHolder);
        } 
        D.cachedropTargets(); 
        lastPosition = dragged.offset();
      } 
      return false;
    },
    dragStop: function(e){
      placeHolder.before(dragged);
      dragged.css({ position: "", top: "", left: "", opacity: "", "z-index": "" });
      placeHolder.remove();
      D.opts.dragEnd.call(dragged, originalIndex != dragged.siblings().andSelf().index(dragged), originalList != dragged.parent()[0]);
      dragged.trigger("dragStop");
      $(document)
        .unbind('mouseup',   D.dragStop)
        .unbind('mousemove', D.dragStart);
    },
    /*
     * Two layers of caching. First we cache the coordinates of the list, and
     * then the coordinates of the children. This confers two benefits: 
     * 1) We can drop on empty lists 
     * 2) Speeds up intersection lookups with multiple lists
     */
    cachedropTargets: function() {
      var list, item, listLoc, itemLoc;
      function buildLoc(el) {
        var ret    = el.offset();
        ret.right  = ret.left + el.width();
        ret.bottom = ret.top  + el.height();
        ret.item   = el;
        return ret;
      }
      dropTargets.length = 0;
      lists.each(function(i){
        list                = $(this);
        listLoc             = buildLoc(list);
        listLoc.dropTargets = [];
        list.children(D.opts.itemSelector).not(dragged).each(function(i) {
          listLoc.dropTargets.push(buildLoc($(this)));
        });
        dropTargets.push(listLoc);
      });
    },
    /*
     * When we execute callbacks, we want to know if the 
     * a) the item was moved to a different list
     * b) if the position of the item was changed
     * NOTE that its possible to change lists and still have the same
     * position (but in the other list)
     */
    cacheOriginalPosition: function(){
      originalIndex = dragged.siblings().andSelf().index(dragged);
      originalList  = dragged.parent()[0];
    },
    /*
     * Returns false if the item is not currently intersecting any known items
     * Otherwise it will return a tuple of (listLocationIndex,[itemLocationIndex])
     */
    intersection: function(mousex,mousey){
      var list, item, ret = [];
      function isIntersecting(el) {
        return el.left<mousex && el.right>mousex && el.top<mousey && el.bottom>mousey;
      }
      for (var i = 0, len1 = dropTargets.length; i < len1; i++) {
        list = dropTargets[i];
        if (isIntersecting(list)) { 
          ret.push(i); 
          for (var j = 0, len2 = list.dropTargets.length; j < len2; j++) {
            item = list.dropTargets[j];
            if (isIntersecting(item)) { ret.push(j); return ret; }
          }
          return ret;
        } 
      }
      return false;
    }
  };

  var D = $.okDrag; // Just a shortcut

  $.fn.okDrag = function(opts){
    opts = $.extend({
      itemSelector: "li",                               // Actual element that will be dragged
      handleSelector: "li",                             // Selector of the element inside the list to act as the drag handle.
      handleSelectorExclude: "input",                   // Exclude certain elements from being handles
      dragEnd: function(positionChanged,listChanged){}, // Callback executed when dragging ends
      dragBetween: false,                               // Allow dragging between lists.
      enableDrag: function(){ return true; },           // If returns true, then dragging is enabled
      placeHolderTemplate: "<li>&nbsp;</li>",           // HTML for the placeholder of the dragged item.
      // Only available if using the okDrag.scroll plugin
      scrollSensitivity: 20,                            // Distance in pixels from the edge of the viewport after which the viewport should scroll. 
      scrollSpeed: 20,                                  // Speed at which the window should scroll
      scrollContainer: $(document)                      // Which element will be scrolled (must be jQuery extended element)
    },opts);

    opts.listSelector = this.selector;

    $(this.selector).live('mousedown',function(e){
      if ($(e.target).is(opts.handleSelector)) {
        $.okDrag.mouseDown(e,opts);
      }
      return false;
    });
    return this;
  };
  
})(jQuery);
