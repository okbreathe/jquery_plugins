# basicWindow

*Display Content in specified position* 

## Dependencies

jquery.basicPosition

Two types of Windows:

* singleton # e.g. modal dialogs
* multiple  # e.g. tooltips

What about the case where you don't want to move content, just display it?
like in the case of our inline forms

		// Set default display options
		$.multiWindow.setup({
			template  : "<div></div>",
			container : "body",
		 	content   : function(){},
		 	show      : function(){},
		 	hide      : function(){},
			offsetTop  : 10,
			offsetLeft : 10
		});
		
		// Set display options for this particular window
		$.multiWindow.show("foo",location, {
			template   : "<div></div>",
			container  : "body",
		 	content    : function(){},
		 	show       : function(){},
		 	hide       : function(){},
			offsetTop  : 10,
			offsetLeft : 10
		});

## Usage

    $.basicWindow(content,[position],[options]);

See the plugin for available options
(function($){

	function setPosition(location){
		var params, x, y, scrollTop, screenWidth, left, top;
		if (typeof(location) == "string") {
			params = this.locations[location].call(this.container);
		} else if (location instanceof Array) {
			params = {top:location[1]||0,left:location[0]||0};
		} else {
      scrollTop   = $(window).scrollTop(); 
      screenWidth = $(window).width();
      if (location.currentTarget ) {
        x = location.pageX;
        y = location.pageY;
      } else {
        x = $(location).offset().left;
        y = $(location).offset().top;
      }
      if (x + this.container.outerWidth() + (this.offsetLeft*2) >= screenWidth){
        left = screenWidth - this.container.width() - this.offsetLeft;
      }
      if ( y + (this.offsetTop*2) <= scrollTop) {
        top = scrollTop - (this.offsetTop*2);
      }
      params = {
        top:  (top  || y + this.offsetTop),
        left: (left || x + this.offsetLeft)
      };
		}
		if (!params.position){ params.position = "absolute"; }
		return this.container.css(params); 
	}

	function setup(options) {
    $.extend(this,options);
		this.container = $("#ui-basicWindow");
		if (this.container.length === 0) { 
			this.container = this.setContainer().appendTo(document.body).css({zIndex:9999}).hide(); 
      this.content   = this.setContent();
      this.overlay   = this.setOverlay();
			if (this.overlay) {
				this.overlay
					.css({ position:'absolute', top: 0, left: 0, width:"100%", height:$("body").height()+'px', zIndex:8999 })
					.appendTo(document.body)
					.hide();
			}
		} 
	}

	$.basicWindow = {
    // Used when location is an Event or DOM-element. 
    offsetTop: 10,                                        
    // Used when location is an Event or DOM-element. 
    offsetLeft: 10,                                       
    // The basicWindow Object
		container : null,
    // Must return a jQuery object. Will be used as the markup for the basicWindow
    setContainer: function(){
      return $("<div id='ui-basicWindow'><div id='ui-basicWindow-content'></div></div>");
    },
		content   : null,
    // Must return a jQuery object that will have content appended to it
    setContent: function(){
      return this.container.children(":first");
    },
    // Overlay used for modal windows
		overlay   : null,
    // Must return a jQuery object that will have content appended to it
    // If no object is returned, then no overlay will be used
    setOverlay: function(){
      return $("<div id='ui-basicWindow-overlay' class='ui-basicWindow-overlay'></div>");
    },
    /*
     * Show the basicWindow
     * @param content  - Can be text or a DOM element. If a DOM element, it's innerHTML will be used
     * @param location - Can be an DOM element, an event or a tuple of coordinates [x,y]
     * @param options  - These will be used to extend the $.basicWindow object
     */
    show: function(content, location, options) {
			setup.call(this,options);
			this.content.html(
        typeof(content) == "string" ? content : (
          content instanceof jQuery ? 
             content.html() : 
               content.innerHTML
        )
      );
      setPosition.call(this,location);
			this.setShow.call(this);
			return this;
    },
    // Overwrite to change how the window is shown (Internally called by show)
    setShow: function(){
     this.overlay.show();
     return this.container.show();
    },
    // Hide the basicWindow
    hide: function() {
			setup.call(this);
			this.setHide.call(this);
			return this;
    },
    // Overwrite to change how the window is hidden (Internally called by hide)
    setHide: function(){
     this.overlay.hide();
     return this.container.hide();
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
        top:  (top  > 0 ? top  : 0), 
        left: (left > 0 ? left : 0)
      };
    }
  };

})(jQuery);
