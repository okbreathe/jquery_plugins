/**
 * jquery.okPopup.ui.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 04/14/12
 *
 * Each UI feature is a function that returns an options object that will be merged
 * into okPopup's options. 
 * 
 * Each UI feature receives the user specified options as an argument
 *
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
      loadingTemplate : "<div class='ui-loading'></div>"
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

      popup.open(e).css($.extend({ position: 'absolute' }, dimensions())).find('img').css({ width: '100%' }); // Set the initial position
      popup.animate(finalCSS, opts.durationIn, opts.easingIn); // Animate to the final position
    }

    function preload(e,popup) {
      var imgPreload = new Image();
      e.preventDefault();

      // Perform default behavior if modifier key is held down
      if ( e.shiftKey || e.ctrlKey || e.metaKey || e.altKey ) {
        return true; // Don't prevent default
      }

      target = $(e.currentTarget);

      imgPreload.onload = function() {
        loading.fadeOut('fast', function(){ loading.remove(); });
        animate(e, popup); // Animate now that the image is loaded 
      };

      loading = $(opts.loadingTemplate).appendTo("body").positionAt(popup.overlay, 'center').fadeIn();

      imgPreload.src = target.attr('href');

    }

    function dimensions(){
      return { 
        height : thumb.height(),
        width  : thumb.width(),
        top    : thumb.offset().top - $(window).scrollTop(),
        left   : thumb.offset().left - $(window).scrollLeft()
      };
    }

    function close(e, popup) {
      return popup.animate($.extend({ opacity:'hide' }, dimensions()), opts.durationOut, opts.easingOut, function(){
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
  }
};
