(function($){

	function SingleWindow(){
		this.window  = null;
		this.overlay = null;   // jQuery extended object
		this._settings   = {
			template    : [ "<div id='ui-singleWindow' class='ui-window ui-window-single'><div id='ui-basicWindow-content' class='ui-window-content'></div></div>" ], 
			overlay     : [ "<div id='ui-basicWindow-overlay' class='ui-basicWindow-overlay'></div>" ], 
			container   : [ "body" ],
			offsetTop   : [ 0 ],
			offsetLeft  : [ 0 ],
			content     : [ function(content){ this.window.children().html(content); } ],
			create      : [ function(){ this.overlay.show(); this.window.show();     } ],
			destroy     : [ function(){ this.overlay.hide(); this.window.hide();     } ]
		};

		this.setup = function(opts){
			$.each(opts,function(k,v){
				if (this._settings[k]) { this._settings[k] = [v]; } 		
			});
		};

		// Returns the newly added window
		this.show = function(content,location,opts){
			this._init(opts);
			var s = this._settings;

			s.content[0].call(this,content);                       // Add Content
			this.window.positionAt(location,s.offsetLeft[0],s.offsetTop[0]); // Position It
			s.create[0].call(this);                                // Show it
			
			s.template.length  = s.offsetTop.length = s.offsetLeft.length = s.container.length = s.content.length  = s.container.length = s.destroy.length = 1;
			return this.window;
		};

		// Returns the collection of existing windows
		this.hide = function(objOrIndex){
			this._settings.destroy[0].call(this);
			return this.window;
		};

		this._init = function(opts){
			if (opts instanceof Object) {
				$.each(opts,function(k,v){
					if (this._settings[k]) { this._settings[k].push(v); } 		
				});
			}
			if (this.window === null) {
				this.window = $(this._settings.template[0]).appendTo(this._settings.container[0]).hide();
				if (this.overlay === null) { 
					this.overlay = $(this._settings.overlay[0]).appendTo(this._settings.container[0]).hide();
				}
			}
		};
	}

	$.singleWindow = new SingleWindow();

})(jQuery);
