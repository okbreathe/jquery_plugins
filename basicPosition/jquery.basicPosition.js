/**
 *
 * jquery.basicPosition.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/17/13
 *
 * @description Utilities for retrieving and setting dimensions on DOM elements
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 2.0 BETA
 *
 * * TODO
 * - The core should simply work with numbers

 */
(function($){

   /**
    * Return the CSS necessary to position an element relative to another element
    *
    * @method $.positionAt
    * @param {JQuery} element The element that we need to position
    * @param {Object} options Plugin Options
    * @return {Object} css dimensions need to position the element at the desired position
    */
  $.positionAt = function(element, options) {
    options = $.extend({
      position: { x: 'center', y: 'center' },    // Where this element will be positioned (x can be one of: 'left', 'right' or 'center'; y can be one of: 'top','center','bottom')
      relativeTo: $("body"),                     // Relative to what element
      constrain: false,                          // Should we constrain the final size based on the relativeTo element
      margin: { x: 0, y: 0 },                    // If constraining, add additional padding to the final dimensions
      offset: { top: 0, left: 0 },               // Adjust the offset of the final calculated position
      registration: { x: 'center', y: 'center' } // Where we are positioning from. Same options as position.
    }, options);

    // If the parent of the element has its position set, it'll be set relative to its parent

    var css              = {},
        offsetElement    = $(options.relativeTo),
        offsetDimensions = getOffsetDimensions(element,offsetElement);

    function get(position,registration,offsetSize,offsetPos,elementSize){
      var ret,
          // If its not a direct child, we need to account for the element's offset position
          push = options.relativeTo[0] == element.parent()[0] ? 0 : offsetPos,
          map = {top: 'topOrLeft', left: 'topOrLeft', center: 'center', right: 'bottomOrRight', bottom: 'bottomOrRight'};

      position     = map[position];
      registration = map[registration];

      switch ( registration ) {
        case 'topOrLeft' :
          ret = {
            topOrLeft     : push,
            center        : push + offsetSize / 2,
            bottomOrRight : push + offsetSize
          }; 
          break;
        case 'center' :
          ret = {
            topOrLeft     : push - elementSize / 2,
            center        : push + offsetSize / 2 - elementSize / 2,
            bottomOrRight : push + offsetSize - elementSize / 2
          }; 
          break;
        case 'bottomOrRight' :
          ret = {
            topOrLeft     : push - elementSize,
            center        : push + offsetSize / 2 - elementSize,
            bottomOrRight : push + offsetSize - elementSize
          }; 
          break;
      }
      return ret[position];
    }

    /*
     * Apply margins and ensure the element stays within the parent and 
     * is scaled proportionally
     */
    function constrain() {
      var width  = options.width || element.outerWidth(),
          height = options.height || element.outerHeight(),
          margin = getMargin(element,offsetElement,options),
          adjusted;

        if (width > (offsetElement.outerWidth() - margin.x * 2)) {
          adjusted = offsetElement.outerWidth() - margin.x * 2;
          height	 = (adjusted / width) * height;
          width	   = adjusted;
        }
        if (height > (offsetElement.outerHeight() - margin.y * 2)) {
          adjusted = offsetElement.outerHeight() - margin.y * 2;
          width	   = (adjusted / height) * width;
          height   = adjusted;
        }

      return { height: height, width: width };
    }

    if (options.constrain !== false) css = constrain();

    return  $.extend(css,{
      left : get(options.position.x, options.registration.x, offsetDimensions.width, offsetDimensions.left, css.width || element.outerWidth()) + (options.offset.left || 0),
      top  : get(options.position.y, options.registration.y, offsetDimensions.height, offsetDimensions.top, css.height || element.outerHeight()) + (options.offset.top || 0)
    });
  };
 
  /**
   * Position an element relative to another element
   *
   * @method $.fn.positionAt
   * @param {JQuery} element The element that we need to position
   * @param {Object} options Plugin Options
   * @return {Object} css dimensions need to position the element at the desired position
   */
  $.fn.positionAt = function(options){
    // Unless it's a direct child of the relativeTo element, append to the body
    if (options.relativeTo[0] != this.parent()[0]) this.css({position: this.css('position') == 'fixed' ? 'fixed' : 'absolute'}).appendTo("body");
    return this.css($.positionAt(this,options));
  };

  /**
   * Measure a element, regardlesss of whether or not it is hidden
   *
   * @method $.measure
   * @param {JQuery} element Element that we need to measure
   * @param {Function} callback Perform measurements within this callback
   */
  $.measure = function(element, fn) {
    var originalStyles = [],
        hiddenElements = element.parents().andSelf().filter(':hidden'),
        ret,
        style;
    
    hiddenElements.each( function() {
      style = $(this).attr('style');
      style = typeof style == 'undefined'? '': style;
      originalStyles.push( style );
      $(this).attr( 'style', style + ' display: block !important; left:-10000; position: absolute;' );
    });

    ret = fn(element);

    hiddenElements.each(function() {
      $(this).attr('style', originalStyles.shift() );
    });

    return ret;
  };

  function getOffsetDimensions(element,offsetElement) {
    var isFixed = element.css('position') == 'fixed';

    return  $.measure(offsetElement,function(){
      return  $.extend($(offsetElement).offset(), {
        width  : offsetElement.outerWidth(),
        height : offsetElement.outerHeight()
      }, offsetElement[0] == window ? {
        top  : isFixed ? 0 : offsetElement.scrollTop(),
        left : isFixed ? 0 : offsetElement.scrollLeft()
      } : null);
    });
  }

  /*
   * Margins can be specified in a number of ways
   * Integer that will be used for both X,Y margins
   * Object with X,Y margins
   * Function that returns either an integer or an object
   */
  function getMargin(element,offsetElement,options) {
    var margin;

    if (typeof(options.margin) == 'function') {
      margin = options.margin(element,offsetElement);
    } else if (typeof(options.margin) == "number") {
      margin = {x: options.margin, y: options.margin};
    } else if ($.isPlainObject(options.margin)) {
      margin = options.margin; 
    }

    if (!margin.x) margin.x = 0;
    if (!margin.y) margin.y = 0;

    return margin;
  }

})(jQuery);
