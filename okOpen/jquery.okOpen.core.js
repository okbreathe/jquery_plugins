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
      effect       : 'show',
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

    opened = $(options.template).appendTo(options.parent).hide();

    return opened.extend({ 
      open  : function(content,opts){$.okOpen.ui.open(this, content, $.extend(options,opts)); }, 
      close : function(opts){ $.okOpen.ui.close(this, $.extend(options,opts)); } ,
      options: options
    });

  };

  $.okOpen.ui = {
    open: function(opened, content, opts){
      if (opts.modal) {
        $('.'+opts.overlayClass).show();
      }

      if (opts.destroyAfter) {
        setTimeout(function() {
          $.okOpen.ui.close(opened,opts);
        }, opts.destroyAfter);
      }

      return opened.html(content).positionAt.apply(opened, $.isArray(opts.where) ? opts.where : [opts.where])[opts.effect]();
    },
    // Not sure about this or even what it does yet
    queue: function(){
    
    },
    close: function(opened, opts){
      $('.'+opts.overlayClass).hide();
      opened.hide();
    }
  }

})(jQuery);
