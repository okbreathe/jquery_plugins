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
        openEffect   : 'show', // If your effect takes options, pass an array here
        closeEffect  : 'hide', // If your effect takes options, pass an array here
        onOpen       : function(event,popup){ popup.open(event); }, // Intercept the open event. Arguments are the original event and the default functionality. Call doDefault() when you're done.
        onClose      : function(event,popup){ popup.close(); }, // Intercept the close event. Arguments are the original event and the default functionality. Call doDefault() when you're done. 
        modal        : false,  // Whether we should create a modal overlay, if you pass a string of an event, 
                               // it will be closed when the event is triggered on the overlay. 
        parent       : "body", // element or selector of the parent element 
        template     : "<div class='ui-popup'></div>", // Content container
        overlayClass : 'ui-widget-overlay' // The overlay class
      },options);

      var popup, overlay;

      if (options.modal) {
        overlay = $(options.overlayClass);

        if ( overlay.length === 0 ) {
          overlay = $("<div class='"+options.overlayClass+"' ></div>").appendTo("body").hide();
        }

      }

      popup = $(options.template)
        .appendTo(options.parent)
        .hide()
        .extend({ 
          open    : function(event){ return $.okPopup.open.call(this, event); }, 
          close   : function(){ return $.okPopup.close.call(this); } ,
          overlay : overlay,
          options : expandOptions(options)
        });

      // Bind events if given
      if (options.show) {
        $(self.selector).on(options.show,function(e){
          e.preventDefault();
          popup.options.onOpen(e,popup);
        });
      }

      if (options.hide) {
        $(self.selector).on(options.hide,function(e){
          e.preventDefault();
          popup.options.onClose(e,popup);
        });
      }

      return popup;
    },
    open: function(event){
      var self    = this, 
          content = this.options.content ? this.options.content(event) : null,
          where   = $.isArray(this.options.where) ? this.options.where : [this.options.where];

      where.unshift(event.currentTarget);

      if (this.overlay) {
        this.overlay.show();
        if (typeof(this.options.modal) == "string") {
          this.overlay.one(this.options.modal,function(e){
            self.options.onClose(e,self)
          });
        }
      }

      this.stop(true,true).hide();

      if (typeof(content) == "string" ) {
        this.html(content);
      }

      return this[this.options.openEffect].apply(this, this.options.openEffectOptions).positionAt.apply(this, where);
    },
    close: function(){
      if (this.overlay) {
        this.overlay.hide();
      }

      this[this.options.closeEffect].apply(this, this.options.closeEffectOptions);
    }
  };

  function expandOptions(options) {
    function expand(dir,effect) {
      effect = $.isArray(effect) ? effect : [effect];
      options[dir+'Effect'] = effect.shift();
      options[dir+'EffectOptions'] = effect;
    }
    expand('in',options.openEffect);
    expand('out',options.closeEffect);
    return options;
  }

})(jQuery);
