/**
 * jquery.okPopup.js
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
 * TODO
 * - The core of basic position should simply work with numbers
 * - basicPosition should measure stuff?
 */

(function($) {

  $.fn.okPopup = function(opts){
    $.okPopup.create(this,opts);
  };

  $.okPopup = {
    create: function(element,opts){
      opts = $.extend({
        content    : "",   // Content of the popup - Can be a string or a function that returns a string, DOM element or jQuery object
        ui         : null, // String name of a UI function located in jquery.okPopup.ui.js
        openWhen   : null, // Takes a string in the format "event [,selector]". The given event will bound to the selector (if present) and when triggered, will cause the popup to open. See `bindEvents`
        closeWhen  : null, // Takes a string in the format "event [,selector]". The given event will bound to the selector (if present) and when triggered, will cause the popup to close. See `bindEvents`
        template   : "<div/>",  // Popup template. Can be string or a function that returns a string, DOM element or jQuery object
        parent     : 'body', // Where the popup will be attached to
        transition : null, // The string name of one of the transitions available in jquery.okPopup.transitions.js
        position: {  // The final location of the popup
          location   : 'center', // Any named location found in $.positionAt: elementBottom, elementTop, elementLeft, elementRight, centerParent, centerViewport, fillViewport
          relativeTo : 'parent', // Can be 'element','event','parent' or regular jQuery selector. see `setOffsetElement`
          offset     : null, // X,Y offset from the calculated position
          margin     : {top:0,left:0} // Extra margin outside of the element that will be taken into consideration when using the 'centerViewport' location
        },
        onInit  : function(popup,opts){}, // Called once when creating the popup
        onOpen  : function(popup,ui){ popup.html(ui.content); }, // Called every time the popup is opened
        onClose : null // Called every time the popup is closed
      }, opts.ui ? $.okPopup.ui[opts.ui].call(element,opts) : null, opts);

      var popup      = typeof(opts.template) == 'function' ? opts.template() : opts.template, 
          transition = $.okPopup.transitions[opts.transition];

      if (!transition) throw("No such transition '"+opts.transition+"'"); // Fail early since we don't know what to do

      // Create a new popup instance
      popup = (popup instanceof jQuery ? popup : $(popup))
        .appendTo(opts.parent)
        .addClass('ui-popup')
        .hide();

      // Initialize UI
      opts.onInit.call(element,popup,opts);

      // Initialize transition
      if (transition.onInit) transition.onInit.call(element,popup,opts);

      // Bind Events
      bindEvents(popup,element,opts.openWhen,this.open,opts);
      bindEvents(popup,element,opts.closeWhen,this.close,opts);

      return popup;
   },
   // Transitins are responsible for showing/hiding the popup
   // UI is responsible for adding additional components and binding events
   open: function(popup,event,opts){
     var content  = typeof(opts.content) == 'function' ? opts.content(event, popup) : opts.content,
         deferred = $.Deferred(),
         resolve  = function(){ 
           popup.removeClass('loading');
           deferred.resolve($.positionAt(popup, setOffsetElement(popup,event,opts.position))); 
         },
         promise  = deferred.promise(),
         preload,
         ui;

     event.preventDefault();

     // Ensure we're working with a jquery object
     if (!(content instanceof jQuery)) content = $("<div />").html(content);

     popup.addClass('loading');

     // Images or Embedded Content will be preloaded. To perform work after it has been
     if ((preload = content.find('img').andSelf().filter('img')).length > 0 && $.fn.imagesLoaded ) {
       preload.imagesLoaded(resolve);
     } else if ((preload = content.find('iframe object embed').andSelf().filter('iframe object embed')).length)  {
       preload.one('load', resolve).each(function() { 
         if(this.complete) $(this).trigger('load'); 
       });
     } else {
       resolve();
     }

     ui = { event: event, content: content, options: opts };
     
     // Set content and do any UI setup
     promise = opts.onOpen(popup,$.extend(ui,promise));

     if (!(promise && promise.done)) promise = deferred.promise();

     // Pass the promise object to the transition
     $.okPopup.transitions[opts.transition].onOpen(popup,$.extend(ui,promise));
   },
   close: function(popup,event,opts){
     if (opts.onClose) opts.onClose(popup,event);
     $.okPopup.transitions[opts.transition].onClose(popup, event);
   }
  };

  /**
   *
   * EventMaps are in the format:
   * event [one or more commas seperated selectors]
   *   A special selector "element" is available which will target the element object passed into
   *   the create method (done automatically when using the $.fn.okPopup form)
   * event
   */
  function bindEvents(popup, element, eventMap, handler, opts) {
    if (!eventMap) return;

    eventMap = typeof(eventMap) == 'string' ? [eventMap] : eventMap;

    $.each(eventMap,function(idx,str){
      var chunks   = str.split(" "),
          event    = chunks.shift(),
          selector = $.trim(chunks.join(" "));

      // Anywhere the special selector 'element' has been used, replace it with elements selector
      if (element) selector = selector.replace(/(^|\s)element(\s|$)/g, function($0,$1,$2){ return $1 + element.selector + $2; });

      // Bind events
      $("body").on(event, $.trim(selector) === "" ? null : selector, function(e){ 
        e.preventDefault(); 
        handler(popup,e,opts); 
      });
    });
  }

  /**
   * Given what the position object sets the relativeTo property to,
   * we'll derive the offsetElement programmatically.
   * If not one of the provided special selectors, it will default
   * to 'body' unless a selector string is provided
   */
  function setOffsetElement(popup, event, opts) {
    switch ( opts.relativeTo ) {
      case 'parent':
        opts.offsetElement = popup.parent();
        break;
      case 'event':
        opts.offsetElement = event;
        break;
      default:
        if (opts.relativeTo) opts.offsetElement = opts.relativeTo;
        break;
    }
    return opts;
  }

})(jQuery);
