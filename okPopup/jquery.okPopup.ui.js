/**
 * jquery.okPopup.ui.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/09/13
 *
 * @description For popups, modal windows, tooltips etc.
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 */

(function($) {

  /*
   * Each UI feature is a function that returns an options object that will be merged
   * into okPopup's options. 
   * Each UI feature receives the user specified options as an argument
   */
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
        if ( e.shiftKey || e.ctrlKey || e.metaKey || e.altKey ) return true;

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

      function dimensions(thumb){
        return { 
          height : thumb.height(),
          width  : thumb.width(),
          top    : thumb.offset().top - $(window).scrollTop(),
          left   : thumb.offset().left - $(window).scrollLeft()
        };
      }

      return {
        parent    : opts.parent,
        openEvent : 'click',
        modal     : 'click',
        onOpen    : preload,
        onClose   : close
      };
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
        cycleOptions : ['caption','navigation'],
        // Generate the intial markup
        // TODO This should be agnostic to the content, and just use the href
        // How would this account for embeds or simply content/text
        slideshow: function(){
          var html = "";
          this.children().each(function(){
            var self = $(this),
                src  = self.find('a').attr('href');
            html += "<li><img src='"+src+"' alt='' /></li>";
          });
          return html;
        }
      }, opts );

      var slideshow, self = this;

      function open(e,popup) {
        var clicked = $(e.target).closest("li"),
            index   = clicked.parent().children().index(clicked);

        slideshow.moveTo(index);

        popup
          .open(e)
          .css({ position:'fixed' })
          .find(".close").one('click', function(e){ close(e,popup); });
      }

      function close(e, popup) {
        e.preventDefault();
        return popup.add(popup.overlay).fadeOut(function(){
          popup.close(e);
        });
      }

      function resize(popup, slide){
        var clone = slide.children().clone().appendTo("body").css({ position:'absolute',left:'-9999em', width: 'auto',height: 'auto' }),
            css   = $.positionAt(clone, 'body',{ location: 'centerViewport', constrain: true, useScrollTop: false });

        clone.remove();

        slide
          .find("img")
          .css(css.width >= css.height ? { height: '100%', width: 'auto' } : {height: '100%', width: 'auto'}); // Scale differently in portrait vs landscape

        popup
          .animate({ width: css.width, height: css.height, top: css.top, left: css.left }, 500, opts.easing)
          .find("ul.ui-slides")
            .animate({width: css.width, height: css.height});
      }

      return {
        parent      : "body",
        openEvent   : 'click',
        openEffect  : 'fadeIn',
        closeEffect : 'fadeOut' ,
        modal       : 'click',
        where       : { location:'centerViewport', constrain: true, useScrollTop: false },
        onOpen      : open,
        onClose     : close,
        template    : function(){
          var t = $("<div class='ui-popup slideshow-container'><a class='close' href='#'>Close</a><ul class='ui-slides'>"+opts.slideshow.call(self)+"</ul></div>");
          
          // TODO We need to preload whatever image was clicked on, so this can't go here
          t.find("li:first img").imagesLoaded(function(){

            // popup needs to be visible before we take measurements
            t.css({position:'absolute', left: '-9999em'}).show();

            $("ul", t).okCycle({
              effect     : 'fade',
              duration   : opts.duration,
              preload    : false, // we're already preloading
              ui         : opts.cycleOptions,
              beforeMove : function(transition) {
                resize(t, transition.to);
              },
              afterSetup : function(){
                // TODO REMOVE, FOR DEBUGGING
                window.slideshow = slideshow = this;
              }
            });

            t.hide().find("li").css({height: '100%'});
          });

          return t;
        }
      };
    }
  };

})(jQuery);
