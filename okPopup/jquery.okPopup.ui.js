/**
 * jquery.okPopup.ui.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/17/13
 *
 * @description For popups, modal windows, tooltips etc.
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 2.01 BETA
 *
 */

(function($) {
  "use strict";
  /*
   * Each UI feature is a function that returns an options object that will be
   * merged into okPopup's options. 
   *
   * Each UI feature receives the user specified options as an argument
   */
  $.okPopup.ui = {
    /**
     * Create a responsive modal popup window
     *
     * @method tooltip
     * @param {Object} options Plugin Options
     */
    tooltip: function(options){
      return {
        onInit      : function(popup,options){ popup.css({position:'absolute'}).addClass('tooltip'); },
        openWhen    : 'mouseenter element',
        closeWhen   : 'mouseleave element',
        transition  : 'bubblePuff',
        location    : { 
          position     : { y: 'top',    x: 'center' }, 
          registration : { y: 'bottom', x: 'center' },
          offset       : { top: -5 },
          relativeTo   : 'element'
        },
        content     : function(popup,element){ 
          return element.data('content'); 
        }
      };
    },
    /**
     * Create a responsive modal popup window. This UI takes additional options
     * 
     * @method modal
     * @param {Object} options           Plugin options
     * @param {String} [options.filters] Given an link's href, generate plugin content differently. See method body.
     *
     */
    modal: function(options) {
      if (!options.filters) options.filters = {};

      options.filters = $.extend(true,{
        // If a filter matches an href then the content function will be called
        // with `this` as the element and the href This will be used to
        // generate the modal's content
        video: {
          matcher: /(vimeo|youtube)/,
          content: function(){
            var href   = this.attr('href'),
                width  = this.data('width') || 900,
                height = this.data('height') || 504;
            return '<iframe src="'+href+'?autoplay=1" width="'+width+'" height="'+height+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
          }
        },
        image: {
          matcher: /.*\.(jpe?g|gif|png)$/,
          content: function(){
            var href   = this.attr('href'),
                width  = this.data('width') || '',
                height = this.data('height') || '';
            return "<img src='"+ href +"' width='"+width+"' height='"+height+"' alt='' />";
          }
        }
      }, options.filters);

      function onInit(popup, options){
        popup.css({position: 'fixed'}).addClass('responsive modal');

        // Add an overlay if this is a modal popup. Will only ever be added once
        // and reused for all modal popups
        var overlay = $('#ui-overlay');

        if ( overlay.length === 0 ) {
          overlay = $("<div id='ui-overlay' class='ui-overlay' />").appendTo("body").hide();
        }

        overlay.click(function(e){ popup.close(); });

        popup.overlay = overlay;

        if (!$.okPopup.resizeEventBound) {
          $(window).resize(function(){ 
            $(".ui-popup.responsive:visible").each(function(e){
              var popup = $(this);
              popup.positionAt($.extend(options.location,popup.data('dimensions')));
            });
          });
          $.okPopup.resizeEventBound = true;
        }
      }

      function onOpen(popup, ui) {
        var content = ui.content,
            existing;

        popup.overlay.show();

        if ((existing = popup.find('.ui-content')).length) existing.remove();

        popup.append(content.addClass('ui-content').hide()).stop(true,true);

        ui.done(function(){
          var dimensions;

          $.measure(content,function(){
            // For embedded videos we need to grab the explicit width/height
            dimensions = { 
              width  : content.attr('width')  || content.width(), 
              height : content.attr('height') || content.height() 
            };
            // Store the original dimensions for scaling on resize
            popup.data('dimensions', dimensions);
          });

          // Depending on whether the content is a image, and its aspect ratio, we'll scale differently
          if (content.is("img")) {
            content.css(dimensions.width <= dimensions.height ? { height: '100%', width: 'auto' } : { width: '100%', height: 'auto' }); // Scale differently in portrait vs landscape
          } else {
            content.attr({ width: '100%', height: '100%' });
          }
        });

        // Pass the calculated dimensions to the transition
        return ui.then(function(){
          return $.positionAt(popup,$.extend(popup.data('dimensions'),ui.options.location));
        });
      }

      function onClose(popup, element) {
        popup.find('.ui-content').remove();
        popup.overlay.fadeOut();
      }

      function setContent(popup, element)  {
        var content = '',
            item    = element;

        $.each(options.filters,function(k,v){
          if (typeof(v.matcher) == 'function' ? v.matcher.call(item) : v.matcher.test(item.attr('href'))) {
            content = v.content.call(item, popup);
            return false;
          }
        });

        return $(content);
      }

      return {
        openWhen   : 'click element',
        closeWhen  : 'click .ui-modal .ui-close',
        content    : setContent,
        onInit     : onInit,
        onOpen     : onOpen,
        onClose    : onClose,
        template   : "<div class='ui-modal'><header><a href='#' class='ui-close'>Close</a></header></div>",
        transition : 'grow',
        location   : { 
          relativeTo : window,
          constrain  : true, 
          margin     : 10
        }
      };
    },

    /**
     * Enhances the modal UI with gallery capabilities
     *
     * @method gallery
     * @param {Object} options Plugin Options
     *
     * By default a 'gallery' is inferred to be any item that matches the original selector
     * e.g. $("a.gallery-item"), all '.gallery-item' elements will be used to generate the items
     * for the current gallery. If you want to use a different set of items, provide an `items`
     * function option, which returns a jQuery object of gallery items
     */
    gallery: function(options) {
      var modalInit;

      options = $.okPopup.ui.modal.call(this,options);

      // Store the original init function to call later
      modalInit = options.onInit;

      function moveTo(event, popup, backwards) {
        event.preventDefault();

        var idx = popup.currentIndex || 0;

        backwards ? idx-- : idx++;

        idx = idx < 0 ? popup.galleryItems.length -1 : idx >= popup.galleryItems.length ? 0 : idx;

        popup.currentIndex = idx;

        // Call open manually
        popup.open(popup.galleryItems.eq(idx));

        // Callback
        options.afterMove(popup, idx);
      }

      return $.extend(options,{
        // The collection of items
        items: function(){ return this; },
        // Called after transitioning to another item
        afterMove: function(popup, index){},
        // Our Controls
        navTemplate: "<nav><a class='ui-prev prev' href='#'>Previous</a><a class='ui-next next' href='#'>Next</a></nav>",
        onInit: function(popup,options) {
          var next  = function(e){ moveTo(e,popup); },
              prev  = function(e){ moveTo(e,popup,true); };

          modalInit.call(this,popup,options);

          popup.galleryItems = options.items.call(this);

          $(options.navTemplate).appendTo(popup);
          
          $(".ui-prev", popup).click(prev);

          $(".ui-next", popup).click(next);

          popup.extend({ nextItem: next, prevItem: prev });
        }
      });
    }
  };

})(jQuery);
