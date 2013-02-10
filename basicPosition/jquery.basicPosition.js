/**
 *
 * jquery.positionAt.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/17/13
 *
 * @description Assists positioning DOM elements relative to other elements
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 * TODO maybe rename to measureing tools or something
 *
 */
(function($){

  /**
   * jQuery.positionAt     
   *
   * Given an element, and an offsetElement,
   * return dimensions for adjusting the element's size/position.
   *
   * offsetElement - Selector, Event, DOM Element or jQuery object. If given an event the offsetElement will become the event's currentTarget
   * @param element {DOMElement} - An element to position
   * @param options {String|Object} - A string of a named location, or an options object with the following properties
   * location - Named location
   * margin   -  String, Object or Function
   */
  $.positionAt = function(element, options) {
    var offsetElement, location, css, fn, ret;

    // Standardize our element into a jQuery object
    if (!(element instanceof jQuery)) element = $(element);

    if (typeof(options) == "string") options = { location : options };

    options = $.extend({
      location      :  'centerParent',
      offsetElement :  element.parent()
    }, options);

    location      = options.location;
    offsetElement = options.offsetElement;

    // Standardize our offsetElement into a jQuery Object
    if (typeof(offsetElement) == "string") offsetElement = $(offsetElement);
    if (offsetElement.target) offsetElement = $(offsetElement.currentTarget);
    if (offsetElement.tagName) offsetElement = $(offsetElement);

    if (!(fn = $.positionAt.locations[location])) throw "No such location '"+location+"'";

    ret = fn(element,offsetElement,options);

    if (options.offset) {
      ret.top  = ret.top + (options.offset.left || 0);
      ret.left = ret.left + (options.offset.top  || 0); 
    }

    return ret;
  };

  /*
   * Measure a element, regardlesss of whether or not it is hidden
   */
  $.positionAt.measure = function(element, fn) {
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


  /*
   * Apply the styles to given element from $.positionAt
   */
  $.fn.positionAt = function(options){
    return this.css($.positionAt(this,options));
  };

  /*
   * Named locations for use with jQuery.positionAt
   */
  $.positionAt.locations = {
    elementBottom: function(element,offsetElement,options) {
      var pos = getOffsetDimensions(element, offsetElement,options);
      return {top: pos.top + pos.height, left: pos.left + pos.width / 2 - pos.elementWidth / 2};
    },
    elementTop: function(element,offsetElement,options) {
      var pos = getOffsetDimensions(element, offsetElement,options);
      return {top: pos.top - pos.elementHeight, left: pos.left + pos.width / 2 - pos.elementWidth / 2};
    },
    elementLeft: function(element,offsetElement,options) {
      var pos = getOffsetDimensions(element, offsetElement,options);
      return {top: pos.top + pos.height / 2 - pos.elementHeight / 2, left: pos.left - pos.elementWidth};
    },
    elementRight: function(element,offsetElement,options) {
      var pos = getOffsetDimensions(element, offsetElement,options);
      return {top: pos.top + pos.height / 2 - pos.elementHeight / 2, left: pos.left + pos.width};
    },
    centerParent: function(element,offsetElement,options){
      return center($(element), $(offsetElement), options);
    },
    centerViewport: function(element,offsetElement,options){
      return center($(element), $(window), options);
    },
    fillViewport: function(element,offsetElement) {
      var bh     = $(window).height(),
          bw     = $(window).width(),
          ratio  = element.width() / element.height(),
          h      = bh,
          w      = bw;

      // Scale it proportionally
      if ((bw / bh) < ratio)  {
		    w = bh * ratio;
      } else {
		    h = bw / ratio;
      }

      return {
        width  : w, 
        height : h,
        left   : (bw - w) / 2,
        top    : (bh - h) / 2
      };
    }
  };

  /*
   * Center an element relative to an offsetElement,
   * generally its parent or body
   */
  function center(element, offsetElement,options) {
    var dimensions = constrain(element, offsetElement, options),
        isFixed    = element.css('position') == 'fixed';

    return {
      width  : dimensions.width,
      height : dimensions.height,
      top    : Math.max(0, ((offsetElement.height() - dimensions.height) / 2) + (isFixed ? 0 : offsetElement.scrollTop())),
      left   : Math.max(0, ((offsetElement.width() - dimensions.width) / 2) + (isFixed ? 0 : offsetElement.scrollLeft()))
    };
  }

  /*
   * Margins can be specified in a number of ways
   * Integer that will be used for both X,Y margins
   * Object with X,Y margins
   * Function that returns either an integer or an object
   */
  function getMargin(element,offsetElement,options) {
    if (typeof(options.margin) == 'function') {
      return options.margin(element,offsetElement,options);
    } else if (typeof(options.margin) == "number") {
      return {x: options.margin, y: options.margin};
    } else if ($.isPlainObject(options.margin)) {
      return options; 
    }
    return {x: 0, y: 0};
  }

  /*
   * Apply margins and ensure the element stays within the parent and 
   * is scaled proportionally
   */
  function constrain(element, offsetElement, options) {
    // TODO setting the width/height in the options object is kind of a hack
    var width  = options.width || element.width(),
        height = options.height || element.height(),
        margin = getMargin(element,offsetElement,options),
        adjusted;

    // Don't set the dimensions if we've been told not to
    if (options.constrain !== false) {
      if (width > (offsetElement.width() - margin.x * 2)) {
        adjusted = offsetElement.width() - margin.x * 2;
        height	 = (adjusted / width) * height;
        width	   = adjusted;
      }
      if (height > (offsetElement.height() - margin.y * 2)) {
        adjusted = offsetElement.height() - margin.y * 2;
        width	   = (adjusted / height) * width;
        height   = adjusted;
      }
    }

    return { height: height, width: width };
  }

  function getOffsetDimensions(element,offsetElement,options) {
    return  $.positionAt.measure(element,function(){
      return $.extend({}, $(offsetElement).offset(), {
        width         : options.width  || offsetElement[0].offsetWidth,
        height        : options.height || offsetElement[0].offsetHeight,
        elementWidth  : element[0].offsetWidth,
        elementHeight : element[0].offsetHeight
      });
    });
  }

})(jQuery);
