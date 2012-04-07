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

  function expandOptions(options) {
    function expand(dir,effect) {
      if ($.isArray(effect)) {
        options[dir+'Effect'] = effect.shift();
        options[dir+'EffectOptions'] = effect;
      } else {
        options[dir+'Effect'] = effect;
        options[dir+'EffectOptions'] = [];
      }
    }
    expand('in',options.inEffect);
    expand('out',options.outEffect);
    return options;
  }

  $.fn.okPopup = function(options) {
    return $.okPopup.create(this,options);
  };

  $.okPopup = {
    create: function(self,options){
      options = $.extend({
        inEffect     : 'show', // If your effect takes options, pass an array here
        outEffect    : 'hide', // If your effect takes options, pass an array here
        modal        : false,  // Whether we should create a modal overlay, if you pass a string of an event, 
                               // it will be closed when the event is triggered on the modal. 
                               // If you pass a string it will be bound as an event on the overlay that 
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
          open    : function(el){ return $.okPopup.open.call(this, el ? el : self); }, 
          close   : function(el){ return $.okPopup.close.call(this, el ? el : self); } ,
          overlay : overlay,
          options : expandOptions(options)
        });

      // Bind events if given
      if (options.show) {
        $(self.selector).on(options.show,function(e){
          e.preventDefault();
          popup.open(e.currentTarget);
        });
      }

      if (options.hide) {
        $(self.selector).on(options.hide,function(e){
          e.preventDefault();
          popup.close(e.currentTarget);
        });
      }

      return popup;
    },
    open: function(el){
      var self    = this, 
          content = this.options.content.call(el),
          where   = $.isArray(this.options.where) ? this.options.where : [this.options.where];

      where.unshift(el);

      if (this.overlay) {
        this.overlay.show();
        if (typeof(this.options.modal) == "string") {
          this.overlay.one(this.options.modal,function(e){
            self.close();
          });
        }
      }

      this.stop(true,true).hide();

      if (typeof(content) == "string" ) {
        this.html(content);
      }

      return this[this.options.inEffect].apply(this, this.options.inEffectOptions).positionAt.apply(this, where);
    },
    close: function(el){
      var effect, effectOptions;

      if (this.overlay) {
        this.overlay.hide();
      }

      this[this.options.outEffect].apply(this, this.options.outEffectOptions);
    }
  };

})(jQuery);
