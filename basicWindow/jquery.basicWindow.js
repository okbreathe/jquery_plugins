(function($){

	function setPosition(location){
		var params;
		if (typeof(location) == "string") {
			params = this.locations[location].call(this.container);
		} else if (location instanceof Array) {
			params = {top:location[1]||0,left:location[0]||0};
		} else {
			params = location.currentTarget ? 
				getPosition.call(this,location.pageX,location.pageY,this.options) : 
				getPosition.call(this,$(location).offset().left, $(location).offset().top,this.options);
		}
		if (!params.position){ params.position = "absolute"; }
		return this.container.css(params); 
	}

	// Adjust the Window if we're too close to the right or top of the window
	function getPosition(x,y){
		var opts = this.options, scrollTop = $(window).scrollTop(), screenWidth = $(window).width(), left, top;
		if (x + this.container.outerWidth() + (opts.left*2) >= screenWidth){
			left = screenWidth - this.container.width() - opts.offsetLeft;
		}
		if ( y + (opts.top*2) <= scrollTop) {
			top = scrollTop - (opts.offsetTop*2);
		}
		return {
			top:  (top  || y + opts.offsetTop) + "px",
			left: (left || x + opts.offsetLeft) + "px"
		};
	}

	function create(opts) {
		this.container = $("#ui-basicWindow");
		if (this.container.length === 0) { 
			this.container = $("<div id='ui-basicWindow'>"+opts.template+"</div>").appendTo(document.body).css({zIndex:9999}).hide(); 
			if (opts.modal) {
				this.overlay = $("<div id='ui-basicWindow-overlay' class='ui-basicWindow-overlay'></div>")
					.css({ position:'absolute', top: 0, left: 0, width:"100%", height:$("body").height()+'px', zIndex:8999 })
					.appendTo(document.body)
					.hide();
			}
		} 
	}

	$.basicWindow = {
		container : null,
		content   : null,
		overlay   : null,
		options   : null,
    show: function(content,location, opts) {
			this.options = $.extend($.basicWindow.defaults,opts);
			create.call(this,this.options);
			this.content = this.container.find(this.options.contentSelector).html(typeof(content) == "string" ? content : (content instanceof jQuery ? content.html() : content.innerHTML));
      setPosition.call(this,location);
			this.options.show.call(this);
			return this;
    },
    hide: function() {
			create.call(this);
      this.container.find(this.options.contentSelector).html('');
			this.options.hide.call(this);
			return this;
    }
	};

  /*
   * Extend this object to add named positions
   */
  $.basicWindow.locations = {
    center: function(){
      var top  = ($(window).height() - this.outerHeight()) / 2,
          left = ($(window).width()  - this.outerWidth())  / 2;
      return {
        position: $.browser.msie && $.browser.version.substr(0,1)<7 ? "absolute" : "fixed", // IE6 doesn't do position:fixed
        margin:0, 
        top:  (top  > 0 ? top  : 0) + 'px', 
        left: (left > 0 ? left : 0) + 'px'
      };
    }
  };

  $.basicWindow.defaults = {
      contentSelector: "#ui-basicWindow-content",                           // The content will be appended to the element specified by this selector.
      template: "<div id='ui-basicWindow-content'></div>",                  // The content inside the basicWindow
			offsetTop: 10,                                                        // Used when location is an Event or DOM-element. 
      offsetLeft: 10,                                                       // Used when location is an Event or DOM-element. 
      show: function(){ this.overlay.show();return this.container.show();}, // Overwrite. 'this' is $.basicWindow
      hide: function(){ this.overlay.hide();return this.container.hide();}, // Overwrite. 'this' is $.basicWindow
      modal : true                                                          // Whether or not to CREATE a modal overlay in addition to a window
  };

})(jQuery);
