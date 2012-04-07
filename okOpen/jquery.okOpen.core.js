/**
 * jquery.okOpen.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 04/05/12
 *
 */

(function($) {

  var defaults = {
  };

  $.okOpen = function(options){

    options = $.extend({
      where        : ['center'],
      inEffect     : 'show',
      outEffect    : 'hide',
      modal        : false, // Whether we should create a modal overlay
      parent       : "body", // selector of the parent element 
      template     : "<div id='ui-opened' class='ui-opened'></div>", // Content container
      overlayClass : 'ui-widget-overlay', // The overlay class
      destroyAfter : 0 // Automatically remove after N milliseconds
    },options);

    var overlay;

    if (options.modal) {
      overlay = $(options.overlayClass);

      if ( overlay.length === 0 ) {
        overlay = $("<div class='"+options.overlayClass+"' ></div>").appendTo("body").hide();
      }

    }

    return $(options.template)
      .appendTo(options.parent)
      .hide()
      .extend({ 
        open      : function(content,effectOptions){ return $.okOpen.ui.open(this, content, options, effectOptions); }, 
        close     : function(effectOptions){ return $.okOpen.ui.close(this, options, effectOptions); } ,
        overlay   : overlay,
        options   : options,
        opened    : false
      });
  };

  $.okOpen.ui = {
    open: function(opened, content, opts, effectOptions){
      if (opened.opened) {
        return opened;
      }

      opened.opened = true;

      if (opts.modal) {
        opened.overlay.show();
      }

      return opened
        .html(content)
        .positionAt.apply(opened, $.isArray(opts.where) ? opts.where : [opts.where])[opts.inEffect]
        .apply(opened, Array.prototype.slice.call(arguments,3));
    },
    close: function(opened, opts, effectOptions){

      opened.opened = false;

      $('.'+opts.overlayClass).hide();

      opened[opts.outEffect].apply(opened, Array.prototype.slice.call(arguments, 2));
    }
  }

})(jQuery);
