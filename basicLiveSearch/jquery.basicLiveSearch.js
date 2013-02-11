(function($) {
  function escapeRegExp(s) { 
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1'); 
  }

  function render(idx,html) {
    return "<li data-index='"+idx+"'>"+ html +"</li>"; 
  }

  function generate(ls,data) {
    var rows="", classNames = ["liveSearch"];
    if (ls.className) classNames.push(ls.className);
    for ( var i = 0; i < data.length; i++ ) {
      if (data[i] !== "") {
        rows += render(i,data[i]);
        data[i] = data[i].toLowerCase();
      }
    }
    return $("<div class='"+classNames.join(' ')+"'><ul>"+rows+"</ul></div>");
   }

  $.liveSearch = {
    create: function(data,opts) {
      var ls = $.extend({},this,opts);
      ls._list    = generate(ls,data);
      ls._cached  = ls._list.find("ul:first").html();
      ls._data    = data;
      return ls;
    },  
    maxResults: 10,
    contents: function(){
      return this._list;  
    },
    reset: function(){
      this._list.children().html(this._cached);
      return this;
    },
    filter: function(str,fn){
      var score,
          self   = this,
          ul     = this._list.find("ul:first"),
          i      = self._data.length,
          term   = $.trim( str.toLowerCase() ), 
          scores = [];

      if ( !term ) {
        self.reset();
      } else {
        while (i--) {
          score = fn(self._data[i],term);
          if (score > 0) { 
            scores.push([score, i, self._data[i]]);
          }
        }
        scores = scores.sort(function(a, b){ return b[0] - a[0]; });
        ul.html(self.render(str,scores));
      }
    },
    render: function(term,scores) {
      var ret    = "",
          len    = scores.length,
          chunks = term.split(' '),
          regex,
          highlight;
      term      = escapeRegExp(term);
      regex     = new RegExp(chunks.length > 1 ? "(" +term + "|" + chunks.slice(1).join("|") + ")" : term, 'ig');
      highlight = function(str) {
        return str.replace(regex, function(a,b,c){ return '<strong>' + a + '</strong>'; });
      };
      for ( var i = 0; i < len; i++ ) {
        if (i === this.maxResults) break;
        ret += render(scores[i][1],highlight( scores[i][2] )); 
      }
      return ret.replace(/>/, ' class="ui-selected">');
    }
  };

})(jQuery);
