/**
 * jquery.okPopup.ui.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/08/13
 *
 * Each UI feature is a function that returns an options object that will be merged
 * into okPopup's options. 
 * 
 * Each UI feature receives the user specified options as an argument
 *
 */

(function($) {

  $.okPopup.ui = {

    /**
     * imageZoom
     *
     * Provides a zooming effect for images.
     * Assumes the following markup:
     *
     *     <a href='/path/to/full'><img src='/path/to/thumb'/></a>
     *
     */
    imageZoom: function(opts){

      var target, 
          thumb, 
          loading;

      opts = $.extend({
        parent          : '#ui-overlay', // make the parent the overlay so clicking the element will also trigger a close
        durationIn      : 300,
        durationOut     : 200,
        easingIn        : 'swing',
        easingOut       : 'swing',
        loadingTemplate : "<div class='ui-loading'></div>" // This should be styled via CSS
      }, opts );

      function animate(e, popup) {
        var initialCSS, finalCSS;

        popup.html("<img src='"+ target.attr('href')+"' alt=''/>");

        thumb = target.children();

        if (loading.is(":visible")) {
          loading.fadeOut('fast',function(){
            loading.remove();
          });
        }

        popup.overlay.show(); // overlay needs to be visible before we take measurements

        finalCSS = $.positionAt(popup, popup.overlay, 'center');

        popup.open(e).css($.extend({ position: 'absolute' }, dimensions(thumb))).find('img').css({ width: '100%' }); // Set the initial position
        popup.animate(finalCSS, opts.durationIn, opts.easingIn); // Animate to the final position
      }

      function preload(e,popup) {
        e.preventDefault();

        // Perform default behavior if modifier key is held down
        if ( e.shiftKey || e.ctrlKey || e.metaKey || e.altKey ) {
          return true; // Don't prevent default
        }

        target = $(e.currentTarget).imagesLoaded(function(){
          loading.fadeOut('fast', function(){ loading.remove(); });
          animate(e, popup); // Animate now that the image is loaded 
        });

        loading = $(opts.loadingTemplate).appendTo("body").positionAt(popup.overlay, 'center').fadeIn();
      }

      function close(e, popup) {
        return popup.animate($.extend({ opacity:'hide' }, dimensions(thumb)), opts.durationOut, opts.easingOut, function(){
          $(this).css({width:'',height:''}).hide();
          popup.close();
        });
      }

      return {
        parent    : opts.parent,
        openEvent : 'click',
        modal     : 'click',
        onOpen    : preload,
        onClose   : close
      }
    },
    /**
     * gallery
     *
     * Create a responsive modal gallery from a series of images.
     *
     * Dependencies - okCycle.core
     *                okCycle.ui
     *                okCycle.transition
     */
    gallery: function(opts){
      opts = $.extend({
        resize   : true,
        animate  : true,
        duration : 3000,
        cycleOptions : ['caption','navigation']
      }, opts );

      var html = "";

      // Generate the intial markup
      this.children().each(function(){
        var self = $(this),
            src  = self.find('a').attr('href');
        html += "<li><img src='"+src+"' alt='' /></li>";
      });

      html = "<ul>"+html+"</ul>";

      function close(e, popup) {
        e.preventDefault();
        return popup.add(popup.overlay).fadeOut(function(){
          popup.close(e);
        });
      }

      return {
        openEvent   : 'click',
        openEffect  : 'fadeIn',
        parent      : "body",
        closeEffect : 'fadeOut' ,
        modal       : 'click',
        template    : function(){
          var t = $("<div class='ui-popup slideshow-container'><header><a class='close' href='#'>Close</a></header><div class='content'>"+html+"</div></div>");

          t.find("li:first img").imagesLoaded(function(){

            t.show().css({position:'absolute', left: '-9999em'});

            $("ul", t).okCycle({
              effect: 'fade',
              duration: opts.duration,
              preload: false, // we're already preloading
              ui: opts.cycleOptions
            });
            t.hide();
          });
          return t;
        },
        // TODO Should have option to center within the window
        where       : { location:'center', constrain: false },
        onClose     : close
      };
    }
  };

  function dimensions(thumb){
    return { 
      height : thumb.height(),
      width  : thumb.width(),
      top    : thumb.offset().top - $(window).scrollTop(),
      left   : thumb.offset().left - $(window).scrollLeft()
    };
  }

})(jQuery);
