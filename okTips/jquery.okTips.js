/*
 * jquery.okTips.js
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 09/10/2009
 *
 * @projectDescription Yet another simple tooltip plugin
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 * @id jQuery.fn.okTips
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 */

(function($) {

  // Bubble Puff effect
  // Also known as the Coda Bubble effect
  $.fn.togglePuff = function(settings, callback) {
    settings = jQuery.extend({
        distance   : 10,
        effectTime : 250
    }, settings);

    return this.each(function() {
      var isHidden = $(this).is(":hidden");
      if (isHidden) { $(this).show(); }
      $(this)
        .animate({
          top: '-=' + settings.distance + 'px',
          opacity: isHidden ? 1 : 0 
        }, settings.effectTime,  function() {
          if (callback) { callback(this); } 
        });    
    });

  };

  $.fn.okTips = function(opts) {
    var $popup,
        $cover,
        trigger;

    // All callback functions except for 'body' receive the trigger as the first
    // argument, and inside this function 'this' will be the popup
    opts       = $.extend({
      id             : "tooltip",                                    // The id of the tooltip - there can only ever be one visible tooltip
      popup          : "<div id='ui-oktip' class='ui-tooltip'></div>", // The wrapper for the tooltip
      live           : false,                                        // Whether to use 'live' instead of a normal event handler
      triggerEvent   : 'click',                                      // The event that triggers the tooltip
      closeTrigger   : null,                                         // Selector of element that will close the popup if clicked
      triggerCloses  : true,                                         // If non-modal and true, moving outside the trigger closes the popup, otherwise moving outside the popup closes
      beforeShow     : null,                                         // Called right before the popup is made visible
      afterShow      : null,                                         // Called right after the popup is made visible
      beforeDestroy  : null,                                         // Called right before tooltip is removed
      afterDestroy   : null,                                         // Called right after tooltip is removed
      body           : function(){                                   // Can be text, or a function. If it is a function and returns text, 
        return "<p>"+this.title+"</p>";                              // the text will be used for the body of the popup.
      },
      top            : -20,                                          // The y offset to display the popup at
      left           : 20,                                           // The x offset to display the popup at
      hideDelay      : 500,                                          // Delay before hiding the tooltip
      effectTime     : 250,                                          // Used by the togglePuff effect
      distance       : 10,                                           // Used by the togglePuff effect
      modal          : true,                                        // If true popup is closed by clicking anywhere else, otherwise it is closed via mouseout
      overlayClass   : 'ui-widget-overlay-clear'                     // The class of the overlay used for modal tooltips
    }, opts);

    function appendHtml(){
      var html;
      if ($popup.length === 0) { 
        $popup = $(opts.popup).appendTo(document.body).hide(); 
        if (opts.modal) {
          $cover = $("<div id='ui-oktip-overlay'></div>");
          $cover
            .addClass(opts.overlayClass)
            .css({ position:'absolute', top: 0, left: 0, width:"100%", height:$("body").height()+'px', zIndex:"1000" })
            .appendTo(document.body)
            .hide();
        }
      } 
      
      $popup.bind('destroy', function(){ destroy(); });

      html = typeof(opts.body) == 'function' ? opts.body.call($popup,trigger) : opts.body;
      if (typeof(html) === "string") { $popup.html(html); }
    }

    // Adjust the Popup if we're too close to the right or top of the window
    function getPosition(e){
      var scrollTop   = $(window).scrollTop(),
          screenWidth = $(window).width(),     
          left,
          top;

      if (e.pageX + $popup.outerWidth() + (opts.left*2) >= screenWidth){
        left = screenWidth - $popup.width() - opts.left;
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
      visible = $popup.is(":visible");
      pos     = getPosition(e);

      $popup
        .stop(true)
        .css({
          position: 'absolute',
          zIndex: '9999',
          left: pos.left,
          top: pos.top
        });

      bindDestroyEvent();
      if (opts.beforeShow) { opts.beforeShow.call($popup); }
      // Don't animate if it's already on screen
      visible ? $popup.show() : $popup.togglePuff(opts,function(e){$(e).show();});
      if (opts.modal) {$cover.show();}
      if (opts.afterShow) { opts.afterShow.call($popup); }
      return $popup;
    }

    function bindDestroyEvent(){
      if (opts.modal) {
        $cover.bind('click', function(e){
          e.preventDefault();
          destroy(e);
        });
      } else if (opts.triggerCloses) {
        $(trigger).bind('mouseleave', function(e){ destroy(e); });
      } else {
        $popup.bind('mouseenter', function(e){
          $popup
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
      return $popup;
    }

    function destroy(e) {
      if (opts.beforeDestroy) { opts.beforeDestroy.call($popup); }

      if ($popup.is(":visible")) {
        $popup.stop(true).togglePuff(opts,function(e){$(e).hide();});
      }

      if (opts.modal) {
        $popup.unbind('mouseleave');
        $cover
          .hide()
          .unbind('click');
      }

      if (opts.afterDestroy) { opts.afterDestroy.call(popup, $trigger); }
    }

    return $(this.selector)[opts.live ? 'live' : 'bind'](opts.triggerEvent, function(e){
      $popup = $("#ui-oktip");
      $cover = $("#ui-oktip-overlay");
      e.preventDefault();
      trigger = this;
      create(e);
    });
  };

})(jQuery);
