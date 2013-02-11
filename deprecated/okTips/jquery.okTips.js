/**
 * jquery.okTips.js
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/18/12
 *
 * @description Yet another simple tooltip plugin
 * @author Asher Van Brunt
 * @email asher@okbreathe.com
 * @version 1.02
 *
 * @id jQuery.fn.okTips
 * @param {Object} settings none are required.
 * @return {jQuery} The same jQuery object
 *
 */

(function($) {

  // Bubble Puff effect
  // Also known as the Coda Bubble effect
  $.fn.togglePuff = function(settings, callback) {
    settings = $.extend({
      distance   : 10,
      effectTime : 250
    }, settings);

    return this.each(function() {
      var self   = $(this),
          hidden = self.is(":hidden");

      if (hidden) { 
        self.show(); 
      }

      self
        .animate({
          top: '-=' + settings.distance + 'px',
          opacity: hidden ? 1 : 0 
        }, settings.effectTime,  function() {
          if (callback) { 
            callback(this); 
          } 
        });    
    });

  };

  $.fn.okTips = function(opts) {

    var popup,
        overlay,
        trigger;

    // All callback functions except for 'body' receive the trigger as the first
    // argument. Inside this function 'this' will be the popup
    opts = $.extend({
      template       : "<div id='ui-oktip' class='ui-tooltip'></div>", // The wrapper for the tooltip
      live           : false,              // Whether to use 'live' instead of a normal event handler
      triggerEvent   : 'click',            // The event that triggers the tooltip
      closeTrigger   : null,               // Selector of element that will close the popup if clicked
      triggerCloses  : true,               // If non-modal and true, moving outside the trigger closes the tooltip, otherwise moving outside the tooltip closes
      beforeShow     : null,               // Called right before the tooltip is made visible
      afterShow      : null,               // Called right after the tooltip is made visible
      beforeDestroy  : null,               // Called right before tooltip is removed
      afterDestroy   : null,               // Called right after tooltip is removed
      body           : function(trigger){  // Can be text, or a function. If it is a function and returns text, 
        return "<p>"+trigger.title+"</p>"; // the text will be used for the body of the tooltip.
      },
      top            : -20,                // The y offset to display the tooltip at
      left           : 20,                 // The x offset to display the tooltip at
      hideDelay      : 500,                // Delay before hiding the tooltip
      effectTime     : 250,                // Used by the togglePuff effect
      distance       : 10,                 // Used by the togglePuff effect
      modal          : false,              // If true popup is closed by clicking anywhere else, otherwise it is closed via mouseout
      overlayClass   : 'ui-widget-overlay' // The class of the overlay used for modal tooltips
    }, opts);

    function appendHtml(){
      var html;
      if (popup.length === 0) { 
        popup = $(opts.template).appendTo(document.body).hide(); 
      } 
      
      // If we have modal and non-modal tooltips on the same page, we'll still need to generate an overlay
      if (opts.modal && overlay.length === 0) {
        overlay = $("<div id='ui-oktip-overlay'></div>")
          .addClass(opts.overlayClass)
          .css({ position:'absolute', top: 0, left: 0, width:"100%", height: $(document).height(), zIndex:"1000" })
          .appendTo(document.body)
          .hide();
      }

      popup.bind('destroy', destroy);

      html = typeof(opts.body) == 'function' ? opts.body.call(popup,trigger) : opts.body;

      if (typeof(html) === "string") { popup.html(html); }
    }

    // Adjust the Popup if we're too close to the right or top of the window
    function getPosition(e){
      var scrollTop   = $(window).scrollTop(),
          screenWidth = $(window).width(),     
          left,
          top;

      if (e.pageX + popup.outerWidth() + (opts.left*2) >= screenWidth){
        left = screenWidth - popup.width() - opts.left;
      }

      if ( e.pageY + (opts.top*2) <= scrollTop) {
        top = scrollTop - (opts.top*2);
      }

      return {
        top:  (top  || e.pageY + opts.top)  + "px",
        left: (left || e.pageX + opts.left) + "px"
      };
    }

    function create(e) {
      var visible, pos, html;

      appendHtml();

      visible = popup.is(":visible");
      pos     = getPosition(e);

      popup
        .stop(true)
        .css({ position: 'absolute', zIndex: '9999', left: pos.left, top: pos.top });

      bindDestroyEvent();

      if (opts.beforeShow) { 
        opts.beforeShow.call(popup,trigger); 
      }

      visible ? popup.show() : popup.togglePuff(opts,function(e){$(e).show();}); // Don't animate if it's already on screen

      if (opts.modal) {
        overlay.show();
      }

      if (opts.afterShow) { 
        opts.afterShow.call(popup,trigger); 
      }

      return popup;
    }

    function bindDestroyEvent(){
      if (opts.modal) {
        overlay.bind('click', function(e){
          e.preventDefault();
          destroy(e);
        });
      } else if (opts.triggerCloses) {
        $(trigger).bind('mouseleave', function(e){ destroy(e); });
      } else {
        popup.bind('mouseenter', function(e){
          popup
            .unbind('mouseenter')
            .bind('mouseleave', function(e){
              e.preventDefault();
              destroy(e);
            });
        });
      }
      if (opts.closeTrigger) {
        $(opts.closeTrigger).bind('click', function(e){
          e.preventDefault();
          destroy(e);
        });
      }
      return popup;
    }

    function destroy(e) {
      if (opts.beforeDestroy) { opts.beforeDestroy.call(popup,trigger); }

      if (popup.is(":visible")) {
        popup.stop(true).togglePuff(opts,function(e){$(e).hide();});
      }

      if (opts.modal) {
        popup.unbind('mouseleave');
        overlay
          .hide()
          .unbind('click');
      }

      if (opts.afterDestroy) { opts.afterDestroy.call(popup, trigger); }
    }

    return $(this.selector)[opts.live ? 'live' : 'bind'](opts.triggerEvent, function(e){
      e.preventDefault();
      popup   = $("#ui-oktip");
      overlay = $("#ui-oktip-overlay");
      trigger = this;
      create(e);
    });
  };

})(jQuery);
