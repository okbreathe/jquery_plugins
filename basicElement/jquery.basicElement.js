(function($) {

	function BasicElement(){
		this._settings = {};

		this.setup = function(opts){
			var self = this;
			$(document).ready(function(){ self._init(opts); });
		};

    // Private

	  // Set context back to initial state
		this._restore = function(){
			var self = this;
			$.each(self._settings,function(k,v){
			 	if (self._settings[k] instanceof Array)	 { self._settings[k].length = 1; }
			});
		};

    // Set initial context or append temporary context
		this._init = function(opts){
			var self = this;
			if (opts instanceof Object) {
				if (opts.init) {
				 	opts.init.call(self);
					delete opts.init;
				}
				$.each(opts,function(k,v){
					if (self._settings[k]) { 
						self._settings[k].push(v); 
					} else {
						self._settings[k] = v;
					}
				});
			}
		};
	}

	$.basicElement = new BasicElement();

})(jQuery);

