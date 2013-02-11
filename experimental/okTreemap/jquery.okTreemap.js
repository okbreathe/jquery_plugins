/*
 * jquery.okTreemap.js
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 10/12/2009
 *
 * @projectDescription Treemap creator
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 0.4
 *
 * @id jQuery.fn.okTreemap
 * @param {Function} Returns an array of values.
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object.
 *
 */

(function($){

  // The stepFunction receives the current step and the current value if
  // available It should return a set of values for the given step.  When the
  // stepFunction returns null, the treeMap will be removed.
  $.fn.treeMap = function(stepFunction,opts) {

    // Inside all callbacks 'this' is the treeMap itself
    opts = $.extend({
      triggerEvent: 'click',  // Event that triggers the creation of a treemap
      live:         false,    // Use $.fn.live rather than $.fn.bind
      offsetX:      15,       // The x-offset that the treeMap will appear from the trigger
      offsetY:      -15,      // The y-offset that the treeMap will appear from the trigger
      title: '',              // Sets the title of the treemap. You can also change it later in a callback.
      template:    'treeMap', // Which template to use for the treeMap, you can add more adding them to $.fn.treeMap.templates
      colorSequence: [
        "#888888",
        "#666666", 
        "#444444", 
        "#222222", 
        "#000000"
      ],                      // Colors are assigned from the inside-out, left to right. That is, the current selection will always be the first color '#888',
                              // and the previous selection will be '#666'
      gridFunction: null,     // Allow changing the number of rows and columns on the table. Receives the total number of cells
                              // should return an array: [columns,rows]
      onInit:       null,     // Called when creating a treeMap for the first time
      onSelect:     null,     // Called after a cell is selected. Receives the selections and the last selected value.
      onComplete:   null      // Callback performed after the final step is reached
    }, opts);

    var treeMap        = null, 
        currentStep    = 0,
        selections     = [];

    // Set the number of columns and rows First see if we can get a sqrt (e.g.
    // 3x3). Otherwise just go for the largest divisor
    function createtableGrid (cellCount) {
      return opts.gridFunction ? opts.gridFunction.call(treeMap,cellCount) : (function(c){
        if (cellCount == 2) { return [2,1]; }
        var n    = c - 1,
            sqrt = Math.sqrt(c),
            rows;
        if (sqrt.toString().length == 1) {
          rows =  sqrt;
        } else {
          while (n > 1) { if (c % n === 0) { rows = n; } n--; }
        }
        return [cellCount/rows,rows];
      })(cellCount);
    }

    function createTable($cell){

      if (opts.onSelect) {
        opts.onSelect.call(treeMap, selections, $cell ? $cell.find('.value').html() : null);
      }

      var values = stepFunction.call(treeMap, currentStep, $cell ? $cell.find('.value').html() : null),
          grid   = createtableGrid(values.length),
          html   = '',
          pos    = 0, // Where we are in the values array
          value  = null;

      for (var i = 0; i < grid[1]; ++i){
        html += "<tr>";
        for (var j = 0; j < grid[0]; ++j){
          value = values[pos] || '';
          html += "<td id='ui-treemap-cell-" + value + 
            "' class='ui-treemap-cell step-"+(currentStep+1)+"'><a href='#' class='value'>" + value +"</a></td>";
          pos++;
        }
        html += "</tr>";
      }
      return "<table class='ui-treemap step-" + (currentStep+1) +"'>" + html + "</table>";
    }

    function cleanup(){
      treeMap.hide().unbind('mousedown');
      $(document).unbind('mousedown');
      selections  = [];
      currentStep = 0;
    }

    function appendTreeMap(){
      if ($(".ui-treemap").length <= 0 ) {
        treeMap = $($.fn.treeMap.templates[opts.template]);
        treeMap.css({
          position: 'absolute',
          display:  'none'
        });
        $("body").append(treeMap);
      }
    }

    function showTreeMap($trigger) {
      var offset = $trigger.offset();
      treeMap
        .css({
          left: ( offset.left + opts.offsetX ) + 'px',
          top:  ( offset.top  + opts.offsetY ) + 'px'
        })
        .show();
    }

    // ==== Note
    // Cells start at 1, the only time that the
    // treemap is at step 0 is before it is clicked on
    function cellClickHandler($cell) {
      var step, // This is what was just clicked on, currentStep is what we just came from
          previousSelector,
          $previous,
          value = $cell.find('.value').html();

      /step-(\d\d?)/.test($cell[0].className);
      
      step  = parseInt(RegExp.$1,10); // Cells start at 1

      if (currentStep >= step ) {
        selections.splice(step-1, currentStep);
        previousSelector = [".step-"+step];

        for (var i=currentStep;i>step;i--) {
          previousSelector.push(" .step-" + i); 
        }

        $previous = $(previousSelector.join(","));
        $previous.find("table").remove();
        $previous.find(".value").show();

      }

      selections.push(value);

      currentStep = step;

      // If we've reached the end, call completion event, otherwise add a child table
      if (stepFunction.call(treeMap, currentStep, value) == null) { 
        if (opts.onComplete) {
          opts.onComplete.call(treeMap, selections);
        }
        cleanup();
      } else {
        $('.value', $cell).hide();
        $cell
          .append(createTable($cell))
          .find('td').hover(function(e){
            $(this).addClass('ui-state-hover');
          },function(e){
            $(this).removeClass('ui-state-hover');
          });
      }
      adjustBackgroundColors();
    }

    function adjustBackgroundColors() {
      $("table", treeMap).sort(function(a,b){
       return a.className > b.className ? -1 : a.className == b.className ? 0 : 1;
      }).each(function(i){
        $(this).animate({
						backgroundColor: opts.colorSequence[i]
        });
      });
    }

    function createEventHandler($trigger) {
      if (treeMap.is(":hidden")) {
        treeMap.fadeIn('fast');
        $(document).bind('mousedown',function(e){ if (treeMap.is(":visible")){ cleanup(); } });
        
        $("#ui-treemap-content", treeMap)
          .html(createTable())
          .find('td').hover(function(e){
            $(this).addClass('ui-state-hover');
          },function(e){
            $(this).removeClass('ui-state-hover');
          });
        
        treeMap.bind('mousedown', function(e){
          e.stopPropagation();
          if (e.button == 2) {
            return false;
          }
          var $target = null;
          if ( e.target.tagName == "TD" ) {
            $target = $(e.target);
          } else if (e.target.parentNode.tagName == "TD" ) {
            $target = $(e.target).parent(); 
          }
          if ($target) {
            cellClickHandler($target, $trigger);
          }
          return false;
        });
        showTreeMap($trigger);
      } 
      treeMap.find('.ui-treemap-title').html(opts.title);
      if (opts.onInit) {
        opts.onInit.call(treeMap);
      }
    }

    return this.each(function(){
      var self = $(this);
      if (treeMap == null) { appendTreeMap(); }
      self[opts.live ? 'live' : 'bind'](opts.triggerEvent, function(e){ e.preventDefault(); createEventHandler(self); });
    });

  };

  $.fn.treeMap.templates = {
    treeMap: "<div id='ui-treemap' class='ui-widget ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible ui-treemap-container'><div id='ui-treemap-header' class='ui-widget-header ui-helper-clearfix ui-corner-top'><div class='ui-treemap-title'></div></div><div id='ui-treemap-content' class='ui-widget-content'></div><div class='ui-treemap-footer'></div></div>"
  };
    
})(jQuery);
