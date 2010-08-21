(function($){

	function MultiWindow(){
		this._collection = $();
		this._settings   = { show:[], hide:[], offsetX:[], offsetY:[] };

		this.show = function(content,location,opts){
			this._init(opts);
			var el = this._settings.show[this._settings.show.length-1].call(this,content);
			this._collection = this._collection.add(el);
			if (el instanceof jQuery) { el.positionAt(location,this.offset(0),this.offset(1)); } // only position it if the show function returns a jQuery object
			this._restore();
			return el;
		};

		this.hide = function(objOrIndex){
		 	if (objOrIndex instanceof jQuery) {
			 	this._collection = this._collection.not(objOrIndex);
			}	else if (!isNaN(objOrIndex)) {
			 	objOrIndex = this._collection.splice(objOrIndex,1);
				objOrIndex = $(objOrIndex);
			} else {
				objOrIndex = this._collection;
			}
			this._settings.hide[this._settings.hide.length-1].call(this,objOrIndex);
			this._restore();
		};
	}

	MultiWindow.prototype = $.singleWindow;

	$.multiWindow = new MultiWindow();

})(jQuery);
