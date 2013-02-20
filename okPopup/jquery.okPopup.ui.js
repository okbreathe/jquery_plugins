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
 * @version 2.0 BETA
 *
 */

(function($) {

  /*
   * Each UI feature is a function that returns an options object that will be merged
   * into okPopup's options. 
   * Each UI feature receives the user specified options as an argument
   */
  $.okPopup.ui = {
    tooltip: function(opts){
      return {
        onInit      : function(popup,opts){ popup.css({position:'absolute'}).addClass('tooltip'); },
        openWhen    : 'mouseenter element',
        closeWhen   : 'mouseleave element',
        transition  : 'togglePuff',
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
    modal: function(opts) {
      if (!opts.fitlers) opts.filters = {};

      opts.filters = $.extend({
        // If a filter matches an href then the content function will be called with `this` as the element and the href
        // This will be used to generate the modal's content
        video: {
          matcher: /(vimeo|youtube)/,
          content: function(href){
            var width  = this.data('width') || 900,
                height = this.data('height') || 504;
            return '<iframe src="'+href+'?autoplay=1" width="'+width+'" height="'+height+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
          }
        },
        image: {
          matcher: /.*\.(jpe?g|gif|png)$/,
          content: function(href){
            var width  = this.data('width') || '',
                height = this.data('height') || '';
            return "<img src='"+ href +"' width='"+width+"' height='"+height+"' alt='' />";
          }
        }
      }, opts.fitlers);

      function onInit(popup, opts){
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
              popup.positionAt($.extend(opts.location,popup.data('dimensions')));
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

        $.each(opts.filters,function(k,v){
          if(v.matcher.test(item.attr('href'))) {
            content = v.content.call(item,item.attr('href'));
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
     */
    gallery: function(opts) {
      var modalInit,
          currentItem,
          galleryItems = this;

      opts = $.okPopup.ui.modal(opts);

      modalInit = opts.onInit;

      function moveTo(event, popup, backwards) {
        event.preventDefault();

        var idx = galleryItems.index(currentItem);

        backwards ? idx-- : idx++;

        // TODO this is kind of hackish
        event.currentTarget = currentItem = galleryItems.eq(idx < 0 ? galleryItems.length -1 : idx >= galleryItems.length ? 0 : idx);

        // Call open manually
        popup.open(event);
      }

      return $.extend(opts,{
        onInit: function(popup,opts) {
          var next  = function(e){ moveTo(e,popup); },
              prev  = function(e){ moveTo(e,popup,true); };

          modalInit(popup,opts);

          $("<nav><a class='ui-prev prev' href='#'>Previous</a><a class='ui-next next' href='#'>Next</a></nav>").appendTo(popup);
          
          $(".ui-prev", popup).click(prev);

          $(".ui-next", popup).click(next);

          popup.extend({ nextItem: next, prevItem: prev });
        }
      });
    }
  };

})(jQuery);
