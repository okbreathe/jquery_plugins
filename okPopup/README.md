# okPopup

*Tiny, modular, flexible content display* 

At its basis, this puts some content somewhere, along with a modal window

You need to define, where you want it and how you want it shown.

okOpen provides a unified API for dynamic content display. This means tooltips, modals, popups etc.


## Usage

    var tooltip = $.okOpen({
      // if this returns a string it will be used, otherwise you can just do whatever you want here
      content: function(){
      }
      position: null // in the position function you get the original element or event, and tooltip
      inEffect: 'show'// If your effect takes multiple options, pass an array
      outEffect: 'hide'
    });

    // fadeIn
    // effectOptions: [duration,fn]

    tooltip.open( content, position,  [, effectOptions] ); // Theoretically we should be able to just set these things up inside our position
    then you can override any defualts

    tooltip.close([effect] [, effectOptions]);

    // position is passed directly to positionAt
    // So we'll implicitly pass the original element

    element, offsetX, offsetY
    element, namedPosition
    object of CSS options

    // so it will actually be

    offsetX, offsetY
    namedPosition
    object of CSS options

    // we can derive the parent from the tooltip

    The other question is how we deal with close events and the modal closes

    // We should allow explicit opening/closing in addition to the automatic

    // so basically if we don't bind events, it won't happen automatically

    // modal: true || 'event' // if you pass a string of an event, it will be closed when the event is triggered on the modal. If you pass a string it will be bound as an event on the overlay that closes both the popup and the overlay


  $.okOpen = function(options){

    options = $.extend({
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
        open      : function(content, where, effectOptions){ return $.okOpen.ui.open.call(this, content, where, options, effectOptions); }, 
        close     : function(effectOptions){ return $.okOpen.ui.close.call(this, options, effectOptions); } ,
        overlay   : overlay,
        options   : options,
        opened    : false
      });
  };

  $.okOpen.ui = {
    open: function(content, where, opts, effectOptions){

      if (this.overlay) {
        this.overlay.show();
      }

      return this
        .hide()
        .html(content)
        .stop(true,true)
        .positionAt.apply(this, $.isArray(where) ? where : [where])[opts.inEffect]
        .apply(this, Array.prototype.slice.call(arguments,3));
    },
    close: function(opts, effectOptions){

      if (this.overlay) {
        this.overlay.hide();
      }

      this[opts.outEffect].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }

