/*
 * jquery.okTagList
 *
 * Copyright (c) 2011 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 03/11/11 
 *
 * @projectDescription Simple TextBoxList UI
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0.0
 *
 */
(function($){

  var eventsBound, focusedTag, focusedList;

  function caretPosition(i) {
    var pos = 0, sel;	
    if (document.selection) { // IE
      i.focus ();
      sel = document.selection.createRange();
      sel.moveStart ('character', -i.value.length);
      pos = sel.text.length;
    } else if (i.selectionStart || i.selectionStart == '0') { // Firefox
      pos = i.selectionStart;
    }
    return (pos);
  }

  function generateTag(str) {
    return "<li class='tag'>"+str+"<a class='close' href='#'></a></li>";
  }

  // Insert a tag into tag list and update the hidden input accordingly
  function addTag(tagList,str) {
    var input = tagList.prev(), 
        vals  = [];
    tagList.find("li:not(.entry)").each(function(){ vals.push(this.innerHTML.replace(/<\/?[^>]*>/g,'')); });
    vals.push(str);
    input.val(vals.join(","));
    return $(generateTag(str)).insertBefore(tagList.find("li.entry"));
  }

  function setFocus(tag) {
    if (focusedTag) { focusedTag.removeClass("ui-focus"); }
    if (tag && tag.length) {
      if (tag.hasClass("entry")) {
        tag.children().focus();
      }
      focusedTag = tag.addClass("ui-focus");
    } else {
      focusedTag = null;
    }
    return tag;
  }

  window.okTagList = {
    addTag: function(e,t){
      var hasResult;
      if (t.is("div.tagList input")) {
        e.preventDefault();
        if (t.val() !== "") {
          if (this.hasClass('autosuggest')) {
            hasResult = okTagList.insertResult.call(this,e,t);
          } 
          addTag(this,hasResult ? hasResult : t.val()) ;
          t.val('');
        }
      }
      return okTagList;
    },
    nextTag: function(e,t){
      if (focusedTag && focusedTag.next().length) {
        e.preventDefault();
        setFocus(focusedTag.next());
      }
      return okTagList;
    },
    prevTag: function(e,t){
      var tag = t.is("div.tagList .entry input") && caretPosition(t[0]) === 0 ?  t.blur().parent() : focusedTag;
      if (tag.length && tag.prev().length) {
        e.preventDefault();
        setFocus(tag.prev());
      }
      return okTagList;
    },
    removeTag: function(e,t){
      var tag;
      if (t.is("div.tagList .entry input")) {
        return this;
      }
      tag = t.is("div.tagList li.tag") ? t : focusedTag;
      if (tag && tag.length) {
        e.preventDefault();
        setFocus(tag.next());
        tag.remove();
      }
      return okTagList;
    }
  };

  function bindEvents() {
    var keyDownHandler, clickHandler;

    if (!eventsBound) {
      // Inside the dispatch 'this' is set to the list
      keyDownHandler = (function(l){ 
        var str = "var t = $(e.target); switch(e.which){";
        $.each($.fn.okTagList.keys,function(f,vs){
          if (l[f]) {
            $.each(vs,function(i,v){ str  +="case "+v+": okTagList."+f+".call(this,e,t); break;"; });
          }
        });
        str += "}";
        return( new Function( 'e', str ) );
      })(okTagList);

        
      clickHandler = function(e){
        var t    = $(e.target), 
            tag  = t.closest("li.tag"),
            list = t.closest("div.tagList");

        $("div.tagList-help").hide();
        /*
         * click a close link  -> remove the tag
         * click a tag         -> focus the tag
         * click on the list   -> focus the list
         * click anywhere wlse -> defocus the tag
         */
        if (t.is("a.close")) {
          okTagList.removeTag(e,tag);
        } else if (tag.length) {
          setFocus(tag);
        } else {
          if (list) { list.find("input").trigger("focus"); }
          setFocus();
        }
      };

      $(document)
        .keydown(function(e){if (focusedList) {focusedList.find("div.tagList-help").hide();} keyDownHandler.call(focusedList,e);})
        .click(clickHandler);

      $(".tagList input")
      .live('focus',function(){ focusedList = $(this).closest(".tagList").addClass('focus'); 
        if ($("li.entry input", focusedList).val() === "") { focusedList.find("div.tagList-help").show(); }
      })
      .live('blur', function(){ focusedList.removeClass('focus'); focusedList = null; });

      eventsBound = true;
    }
  }

  $.fn.okTagList = function(opts){

    opts = $.extend({
      helpText : "Type the name of a tag you'd like to use. Use commas to separate multiple tags." // Text displayed to user when focusing the input
    },opts);

    function init() {
      var initialTags = "",
          input       = $(this).hide(),
          ret         =  "";
      $.each(input.val().split(","),function(i,v){ if (v !== "") { initialTags += generateTag(v); } });
      ret =  $("<div class='tagList'><ul>"+initialTags+"<li class='entry'><input type='text' autocomplete='off'/></li></ul>" +
               "<div class='tagList-help' style='display: none;'>"+opts.helpText+"</div></div>")
              .insertAfter(input).data('input', input);
      if (opts.autosuggest) {
         ret.append(okTagList.autosuggest.init(input,opts.autosuggest)).addClass('autosuggest');
      }
      return ret;
    }

    bindEvents();

    return this.each(init);
  };

  $.fn.okTagList.keys = {
    addTag     : [13,188], // Enter, Comma
    removeTag  : [8,46],   // Del, Backspace
    nextTag    : [39],     // Left
    prevTag    : [37],     // Right
    nextResult : [40],     // Down
    prevResult : [38]      // Up
  };

})(jQuery);
