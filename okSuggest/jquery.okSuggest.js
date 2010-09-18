/*
 * jquery.okSuggest
 *
 * Copyright (c) 2011 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 03/11/11 
 *
 * @projectDescription Live Search
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0.0
 *
 */

// TODO - bind keys dynamically
(function($){
  var eventsBound;

  $.fn.okSuggest = function(opts){

    opts = $.extend({
      data       : [],     // Data used in the liveSearch
      selected   : null,   // String - which datum should start out in the input
      minLength  : 1,      // Minimum number of keystrokes to start the search
      keys       : {       // Controls
        select : [13],     // Enter
        next   : [40],     // Down
        prev   : [38]      // Up
      },
      onInsert   : function(textInput,str) { // Called when a new value is inserted into the original input
        return textInput.val(str);
      },                                 // (`this` is set to the original input. Receives the visible text input as an argument)
      notFound   : function(textInput){  // Called in the event that the user-entered string does not conform to existing values.
      },                                 // (`this` is set to the original input. Receives the visible text input as an argument)
      filter     : function(string,searchTerm) { // Run for each data point, must return a numerical value (higher == better match)
        return string.score(searchTerm);         // Uses quicksilver by default (included)
      },
      helpText : "Begin typing to search" // Text displayed to user when focusing the input
    },opts);

    function selectResult(liveSearch,forward){
      var ul      = liveSearch.contents().find("ul:first"),
          focused = ul.children("li.ui-selected"),
          toFocus = focused[forward ? "next" : "prev"]();
      if (toFocus.length === 0 || focused.length === 0) {
        toFocus = ul.children(forward ? ":first" : ":last");
      }
      focused.removeClass("ui-selected");
      toFocus.addClass("ui-selected");
      return false;
    }

    function insertResult(input,liveSearch){
      var selected      = liveSearch.contents().find("li.ui-selected"), 
          originalInput = input.prev(); // If called on a select
      if (selected.length && selected.html() !== "") {
        if (originalInput.length && originalInput[0].tagName == "SELECT") {
          originalInput[0].selectedIndex = selected.data('index');
        }
        opts.onInsert.call(originalInput, input,selected.html().replace(/<strong>([^<]+)<\/strong>/ig,'$1'));
        liveSearch.contents().hide();
      } else {
        opts.notFound.call(originalInput.length ? originalInput : input, input);
      }
    }

    function keyupHandler(e){
      var input      = $(e.target),
          liveSearch = input.parent().data("okSuggest"),
          val        = $.trim( input.val() );
      if (e.which == 40) { //next
        return selectResult(liveSearch,1);
      } else if (e.which == 38) { //prev
        return selectResult(liveSearch,0);
      } else if (val.length >= opts.minLength) {
        liveSearch.filter(val, opts.filter); 
        if ( !val || liveSearch.contents().find("li:first").length === 0) {
          return liveSearch.contents().hide();  
        } else if (e.which != 13) {
          return liveSearch.contents().show();  
        }
      } else {
        return liveSearch.reset().contents().find("li:first").addClass("ui-selected");
      }
    }

    function keydownHandler(e) {
      var liveSearch = $(e.target).parent().data("okSuggest");
      toggleHelp(e);
      if (e.which == 13) {
        e.preventDefault();
        insertResult($(e.target),liveSearch);
        return false;
      }
    }

    function clickHandler(e){
      var t         = $(e.target),
          okSuggest = t.closest('div.okSuggest');
      $("li.ui-selected", okSuggest).removeClass("ui-selected");
      t.addClass('ui-selected');
      insertResult(okSuggest.find(".okSuggest-input"),okSuggest.data("okSuggest"));
    }

    function toggleHelp(e) {
      var vis = e.type == 'focusin';
      $(e.target).nextAll(".okSuggest-help")[vis ? 'show' : 'hide']();
    }

    if (!eventsBound) {
      $("input.okSuggest-input").live({ keydown: keydownHandler, keyup: keyupHandler, focus: toggleHelp, blur: toggleHelp });
      $(".okSuggest .liveSearch li").live('click',clickHandler);
      eventsBound = true;
    }

    return this.each(function(){
      var self = $(this), val = self.val(),liveSearch,list,str;
      self.wrap("<div class='okSuggest'/>");
      if (this.tagName == "SELECT") {
        for ( var i = 0; i < this.children.length; i++ ) {
          opts.data.push($.trim( this.children[i].innerHTML )); 
        }  
        val  = $("option:selected", self).html();
        self = $("<input type='text' />").insertAfter(self.hide());
      } 
      if (opts.selected) { val = opts.selected; }
      liveSearch = $.liveSearch.create(opts.data, { className: "okSuggest-list" });
      list       = liveSearch.contents().width(self.outerWidth(true));

      self
        .attr({ autocomplete:'off', accesskey: self.attr("accesskey"), tabindex: self.attr("tabindex") })
        .addClass('okSuggest-input')
        .val(val)
        .after(list.hide())
        .after("<div class='okSuggest-help' style='display: none;'>"+opts.helpText+"</div></div>")
        .parent()
          .data('okSuggest',liveSearch);
    });
  };
})(jQuery);
