/*
 * jquery.okNotify.js
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 10/06/10
 *
 * @projectDescription Create a Growl-like notifications simply
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.1
 *
 * @id jQuery.noticeAdd
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the notice.
 * @id jQuery.noticeRemove
 * @param {Object or Selector} 
 * @return {jQuery} Nothing
 *
 */

(function($) {
  function addContainer(opts){
    var $container = $("."+opts.containerClass+"."+opts.position),
    styles = {
      'top-left'     : { left: 0, top:0    },
      'top-right'    : { right:0, top:0    },
      'bottom-right' : { right:0, bottom:0 },
      'bottom-left'  : { left: 0, bottom:0 },
      'center'       : { top: 0,  width: "50%", left: "25%"},
      'top-center'   : { top: 0,  width: "50%", left: "25%"}
    };

    if ($container.length === 0 ) {
      $container = $('<div></div>')
        .addClass(opts.containerClass)
        .addClass(opts.position)
        .css($.extend({position:opts.fixed ? 'fixed' : 'absolute',padding:'10px',zIndex:9999},styles[opts.position]))
        .appendTo('body');
    }

    if (opts.position == 'center') {
      $container.center(true);
    }

    return $container;
  }

  function uniqueId() {
    return "notice_" + parseInt(new Date().getTime()+Math.random(), 10);
  }

  // Center the element within the screen
  $.fn.center = function (absolute) {
    return this.each(function () {
      var self = $(this);
      self.css({
        position:	absolute ? 'absolute' : 'fixed', 
        left:		'50%', 
        top:		'50%', 
        zIndex:	'99'
      }).css({
        marginLeft:	'-' + (self.outerWidth() / 2) + 'px', 
        marginTop:	'-' + (self.outerHeight() / 2) + 'px'
      });

      if (absolute) {
        self.css({
          marginTop:	parseInt(self.css('marginTop'), 10) + $(window).scrollTop(), 
          marginLeft:	parseInt(self.css('marginLeft'), 10) + $(window).scrollLeft()
        });
      }
    });
  };

  $.extend({      
      noticeAdd: function(opts) {  
        opts = typeof(opts) == "string" ? {text:opts} : opts;
        opts = $.extend(true, {
          inEffect:         {            // passed to $.fn.animate(), any parameters that it accepts are valid         
            opacity: 'show'           
          },
          inEffectDuration: 600,         // in effect duration in miliseconds
          duration:         3000,        // time before the item disappears
          text:             '',          // content of the notification
          title:            '',          // title of the notification
          stay:             false,       // should the notice item stay or not? (if false it will fade after duration milliseconds)
          type:             'notice',    // could also be error, success etc.
          position:         'top-right', // top-center, top-left, top-right, bottom-left, bottom-right, center
          containerClass :  'ui-notification-container', // class that wraps the container
          template:         'standard',  // Extend the $.noticeAdd.templates object to add additional templates
          fixed:            false        // Whether to use absolute or fixed positioning. (Note: IE6 doesn't support position fixed)  
        }, opts);

        var $container,
            $notice  = $($.noticeAdd.templates[opts.template]),
            text     = $.trim(opts.text);

        $notice.attr('id', uniqueId());

        $.noticeAdd.notices = $.noticeAdd.notices.add($notice);

        $container = addContainer(opts);

        // Append the title 
        $('.ui-notification-title', $notice).append(opts.title);
        // Append the text, wrap it in a <p/> if it doesn't look like markup
        $('.ui-notification-content', $notice).append(text[0] == "<" ? text : '<p>'+text+'</p>');

        // Append the notice
        $notice
          .hide()
          .addClass(opts.type)
          .appendTo($container)
          .animate(opts.inEffect, opts.inEffectDuration);

        $('.ui-notification-close', $notice).click(function(e) { 
            e.preventDefault();
            $.noticeRemove($notice);
         });

        if (!opts.stay) {
          setTimeout(function() {
              $.noticeRemove($notice);
            },
            opts.duration);
        }
        return $notice;
      },

      noticeRemove: function(obj) {
        if (obj) {
          obj = typeof(obj) == "string" ? $(obj) : obj;
          obj.animate({ opacity: '0' }, 600, function() {
            obj.animate({ height: '0px' }, 300, function() {
              $.noticeAdd.notices.splice($.noticeAdd.notices.index(obj),1); 
              obj.siblings().length <= 0 ? obj.parent().remove() : obj.remove();
            });
          });
        } else {
          $.noticeAdd.notices.fadeOut(function(){ 
            $(this).parent().remove();
            $.noticeAdd.notices = $([]);
          });
        }
      }
    }); // $.extend

    // Extend the templates to add more
    $.noticeAdd.templates = {
      standard: "<div class='ui-notification'><div class='ow'><div class='iw'><div class='ui-notification-titlebar'><span class='ui-notification-title'></span><a class='ui-notification-close' href='#'>x</a></div> <div class='ui-notification-content'> </div></div></div></div>"
    };

    // List of active notices
    // Start by storing an empty jQuery object
    $.noticeAdd.notices = $([]);

})(jQuery);
