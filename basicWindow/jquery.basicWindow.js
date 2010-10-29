(function($){

	function BasicWindow(){
		this._collection = $();
		this._internal   = {};

		this.setup = function(opts){
			var self = this;
      if (opts instanceof Object) {
        $.each(['show','hide','init'],function(){ 
          if (opts[this]) { 
            self._internal[this] = opts[this]; 
            delete opts[this]; 
          } 
        });
        $.extend(self,opts);
      }
			$(document).ready(function(){ 
        if (self._internal.init) { self._internal.init.call(self); }
      });
      return this;
		};

		this.show = function(){
      var el = this._internal.show.apply(this,Array.prototype.slice.call(arguments,0));
      if (this._collection.filter(el).length === 0) {
        this._collection = this._collection.add(el);
      }
			return el;
		};

		this.hide = function(objOrIndex){
      var args = Array.prototype.slice.call(arguments,0);
		 	if (objOrIndex instanceof jQuery) {
			 	this._collection = this._collection.not(objOrIndex);
			}	else if (!isNaN(objOrIndex)) {
			 	objOrIndex = this._collection.splice(objOrIndex,1);
				objOrIndex = $(objOrIndex);
			} else {
				objOrIndex = this._collection;
			}
      args.unshift(objOrIndex);
      return this._internal.hide.apply(this,args);
		};
	}

	$.basicWindow = function(opts){
    var w = new BasicWindow();
    return w.setup(opts);
  };

})(jQuery);
