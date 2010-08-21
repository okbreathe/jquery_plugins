(function($) {

	function SingleWindow(){
		this._settings = { show:[], hide:[], offsetX:[], offsetY:[] };

		this.show = function(content,location,opts){
			this._init(opts);
			var el = this._settings.show[this._settings.show.length-1].call(this,content);
			if (el instanceof jQuery) { el.positionAt(location,this.offset(0),this.offset(1)); } // only position it if the show function returns a jQuery object
			this._restore();
		};

		this.offset = function(p) {
			var s = this._settings,ret=0;
		 	if (p && s.offsetY)	 {
				ret = s[s.offsetY.length-1];
			} else if (s.offsetX)	 {
				ret = s[s.offsetX.length-1];
			}
			return ret;
		};

		this.hide = function(){
			this._settings.hide[this._settings.hide.length-1].call(this);
			this._restore();
		};

	}

	SingleWindow.prototype = $.basicElement;

	$.singleWindow = new SingleWindow();

})(jQuery);
