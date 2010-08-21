(function($) {

	function SingleWindow(){
		this._settings = { show:[], hide:[] };

		this.show = function(content,location,opts){
			this._init(opts);
			var el = this._settings.show[this._settings.show.length-1].call(this,content,location,opts);
			this._restore();
			return el;
		};

		this.hide = function(){
			this._settings.hide[this._settings.hide.length-1].call(this);
			this._restore();
		};

	}

	SingleWindow.prototype = $.basicElement;

	$.singleWindow = new SingleWindow();

})(jQuery);
