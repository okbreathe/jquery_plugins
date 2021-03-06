(function($){
  var lastValue, eventsBound;

  function selectResult(list,forward){
    if (list) {
      var focused = list.find(".ui-selected").removeClass("ui-selected"),
          toFocus = focused[forward ? "next" : "prev"]();
      if (toFocus.length === 0) {
        toFocus = list.children(forward ? ":first" : ":last");
      }
      toFocus.addClass("ui-selected");
    }
    return false;
  }

  function keyUpHandler(e,liveSearch,opts){
    var t   = $(e.target),
        val = t.val();
    if (e.which != 13 && t.is("div.tagList input")) {
      if (t.val().length >= opts.minLength && t.val() !== lastValue) {
        liveSearch.filter(t.val(), opts.filter); 
      }
      lastValue = t.val();
      if ( !val || liveSearch.contents().find("li:first").length === 0) {
        liveSearch.contents().hide();  
      } else {
        liveSearch.contents().show();  
      }
    }
  }

  function clickHandler(e,liveSearch){
    var t= $(e.currentTarget).addClass("ui-selected");
    okTagList.insertResult.call(liveSearch,e,t.prev().find(".entry input"));
    return false;
  }

  $.extend(okTagList, {
    autosuggest: {
      init: function(input,opts) {
        var ls;
        opts = $.extend({
          data       : [],
          minLength  : 1,
          maxResults : 10,
          filter : function(str,term){
            return str.score(term);
          }
        },opts);
        ls = $.liveSearch.create(opts.data,{ maxResults: opts.maxResults, className: 'tagList-autosuggest' });
        if (!eventsBound) {
          $("div.tagList.autosuggest .entry input")
            .live("keyup",function(e){ keyUpHandler(e,ls,opts); });
          $(".tagList-autosuggest")
            .live('click',function(e){ clickHandler(e,ls); });
          eventsBound = true;
        }
        return ls.contents().hide();
      }  
    },
    insertResult: function(e,t){
      var result     = false,
          input      = t,
          liveSearch = this.find(".tagList-autosuggest:first"),
          selected   = liveSearch.find("li.ui-selected:first");
      if (selected.length && selected.html() !== "" && e.which != 188) {   // Prevent commas from adding tags
        result = selected.html().replace(/<strong>([^<]+)<\/strong>/ig,'$1');
        liveSearch.hide();
      }
      return result;
    },
    prevResult: function(e,t){
      return selectResult(this.find("ul"),0);
    },
    nextResult: function(e,t){
      return selectResult(this.find("ul"),1);
    }
  });
})(jQuery);
