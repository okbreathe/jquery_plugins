/**
 * jquery.okPopup.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 04/05/12
 *
 */

(function($) {

  $.fn.okPopup = function(options) {
    return $.okPopup.create(this,options);
  };

  $.okPopup = {
    create: function(self,options){
      options = $.extend({
        openEvent    : null,                                        // Which event triggers the popup to show
        closeEvent   : null,                                        // Which event triggers the popup to be hidden
        openEffect   : 'show',                                      // If your effect takes options, pass an array here
        closeEffect  : 'hide',                                      // If your effect takes options, pass an array here
        onOpen       : function(event,popup){ popup.open(event); }, // Called when open event is triggered.
        onClose      : function(event,popup){ popup.close(); },     // Called when close event is triggered.
        modal        : false,                                       // Whether we should create a modal overlay, if you pass a string of an event,
                                                                    // it will be closed when the event is triggered on the overlay.
        parent       : "body",                                      // element or selector of the parent element
        template     : "<div class='ui-popup'></div>",              // Content container
        overlayClass : 'ui-overlay'                                 // The overlay class
      }, options.ui ? $.okPopup.ui[options.ui](options) : null, options);

      var popup, overlay;

      if (options.modal) {
        overlay = $('.'+options.overlayClass);

        if ( overlay.length === 0 ) {
          overlay = $("<div id='ui-overlay' class='"+options.overlayClass+"' ></div>").appendTo("body").hide();
        }

      }

      popup = $(options.template)
        .appendTo(options.parent)
        .hide()
        .extend({ 
          open    : function(event,content){ return $.okPopup.open.call(this, event, content); }, 
          close   : function(){ return $.okPopup.close.call(this); } ,
          overlay : overlay,
          options : expandOptions(options)
        });

      // Bind events if given
      if (options.openEvent) {
        $(self.selector).on(options.openEvent,function(e){
          if ( popup.options.onOpen(e,popup) !== true ) {
            e.preventDefault();
          }
        });
      }

      if (options.closeEvent) {
        $(self.selector).on(options.closeEvent,function(e){
          if ( popup.options.onClose(e,popup) !== true ) {
            e.preventDefault();
          }
        });
      }

      return popup;
   },
   // `content` can be a string or function. If a string it will just set the
   // innerHTML to the value. If given a function, it will be called with the
   // event and popup. This is primarily used if you call the open function
   // manually.
    open: function(event, content){
      var self  = this, 
          where = $.isArray(this.options.where) ? this.options.where : [this.options.where];

      where.unshift(this.options.modal ? $(this.options.parent) : event.currentTarget);

      if (this.overlay) {
        this.overlay.show();
        if (typeof(this.options.modal) == "string") {
          this.overlay.one(this.options.modal,function(e){
            self.options.onClose(e,self);
          });
        }
      }

      if (typeof(content) == 'string') {
        this.html(content);
      } else if (typeof(content) == 'function') {
        content(event, self);
      }

      this.stop(true,true).hide();
      return this[this.options.openEffect].apply(this, this.options.openEffectOptions).positionAt.apply(this, where);
    },
    close: function(){
      if (this.overlay) {
        this.overlay.hide();
      }

      this[this.options.closeEffect].apply(this, this.options.closeEffectOptions);
    }
  };

  // Standardize effect options into an array
  function expandOptions(options) {
    function expand(op,effect) {
      effect = $.isArray(effect) ? effect : [effect];
      options[op+'Effect'] = effect.shift();
      options[op+'EffectOptions'] = effect;
    }
    expand('open',options.openEffect);
    expand('close',options.closeEffect);
    return options;
  }

})(jQuery);
