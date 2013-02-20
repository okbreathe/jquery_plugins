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
 */

(function($) {

  $.fn.okPopup = function(options){
    return $.okPopup.create(this, options);
  };

  $.okPopup = {
    create: function(element, options){
      options = $.extend({
        content  : "",
        template : "<div/>",  
        parent   : 'body', 
        location : {  relativeTo : 'parent' },
        onInit   : function(popup, options){}, // Called once when creating the popup
        onOpen   : function(popup, ui){ popup.html(ui.content); }, // Called every time the popup is opened
        onClose  : null // Called every time the popup is closed
      }, 
      options && options.ui ? $.okPopup.ui[options.ui].call(element,options) : null, options);

      var popup      = typeof(options.template) == 'function' ? options.template() : options.template, 
          transition = $.okPopup.transitions[options.transition];

      if (!transition) throw("No such transition '"+options.transition+"'"); // Fail early since we don't know what to do

      // Create a new popup instance
      popup = (popup instanceof jQuery ? popup : $(popup))
        .appendTo(options.parent)
        .addClass('ui-popup')
        .hide();

      // Initialize UI
      options.onInit.call(element,popup,options);

      // Initialize transition
      if (transition.onInit) transition.onInit.call(element,popup,options);

      // Bind Events
      bindEvents(popup,element,options.openWhen,this.open,options);
      bindEvents(popup,element,options.closeWhen,this.close,options);

      // Add shortcut methods for calling open/close
      function getEl(e){ return e && e.currentTarget ? $(e.currentTarget) : e; }

      return popup.extend({
        open  : function(el){ $.okPopup.open(popup,getEl(el),options);  return popup; },
        close : function(el){ $.okPopup.close(popup,getEl(el),options); return popup; }
      });
   },
   open: function(popup, element, options){
     var content  = typeof(options.content) == 'function' ? options.content(popup, element) : options.content,
         deferred = $.Deferred(),
         resolve  = function(){ 
           popup.removeClass('loading');
           deferred.resolve($.positionAt(popup,  setOffsetElement(popup, element, options.location))); 
         },
         promise  = deferred.promise(),
         preload,
         ui;

     // Ensure we're working with a jquery object
     if (!(content instanceof jQuery)) content = $("<div />").html(content);

     popup.addClass('loading');

     // Images or Embedded Content will be preloaded. To perform work after it has been
     if ((preload = content.find('img').andSelf().filter('img')).length > 0 && $.fn.imagesLoaded ) {
       preload.imagesLoaded(resolve);
     } else if ((preload = content.find('iframe, object, embed').andSelf().filter('iframe, object, embed')).length)  {
       preload.one('load', resolve).each(function() { 
         if(this.complete) $(this).trigger('load'); 
       });
     } else {
       resolve();
     }

     ui = { element: element, content: content, options: options };
     
     // Set content and do any UI setup
     promise = options.onOpen(popup,$.extend(ui, promise));

     if (!(promise && promise.done)) promise = deferred.promise();

     // Pass the promise object to the transition
     $.okPopup.transitions[options.transition].onOpen(popup,$.extend(ui,promise));
   },
   close: function(popup, element, options){
     if (options.onClose) options.onClose(popup, element);

     $.okPopup.transitions[options.transition].onClose(popup, element);
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
  function bindEvents(popup, element, eventMap, handler, options) {
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
        handler(popup,$(e.currentTarget),options); 
      });
    });
  }

  /**
   * Given what the location object sets the relativeTo property to,
   * we'll derive the offsetElement programmatically.
   * element - the originally bound element
   * parent  - popup's parent
   *
   * Note - this will throw an error if there is no element is passed in and the relativeTo option was set to element
   */
  function setOffsetElement(popup, element, options) {
    var relativeTo;

    if (options.relativeTo == 'parent') {
      relativeTo = popup.parent();
    } else if (options.relativeTo == 'element') {
      if (element) {
        relativeTo = element;
      } else {
        throw "relativeTo was set to element, but no element provided";
      }
    } else if (options.relativeTo) {
      relativeTo = $(options.relativeTo);
    }

    return $.extend({},options,{ relativeTo: relativeTo });
  }

})(jQuery);
