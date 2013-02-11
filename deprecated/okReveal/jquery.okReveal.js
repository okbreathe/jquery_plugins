/*
 * jquery.okReveal
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 08/13/2009
 *
 * @projectDescription An easy way to reveal content based on mouse events
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.0
 *
 * @id jQuery.fn.okReveal
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object.
 *
 * Optional dependencies to enable horizontal sliding:
 *	effects.core.js
 *	effects.slide.js
 */

// Built in typeof is useless
function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (typeof value.length === 'number' &&
          !(value.propertyIsEnumerable('length')) &&
              typeof value.splice === 'function') {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

// Slide left/right effects
jQuery.fn.extend({
  slideLeftShow: function() {
    return this.each(function() {
      $(this).show('slide', {direction: 'left'});
    });
  },
  slideLeftHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'left'});
    });
  },
  slideRightShow: function() {
    return this.each(function() {
        $(this).show('slide', {direction: 'right'});
    });
  },
  slideRightHide: function() {
    return this.each(function() {
      $(this).hide('slide', {direction: 'right'});
    });
  }
});

(function($){
  $.fn.okReveal = function(opts){
    opts = $.extend({
      triggerEvent: 'mouseenter', // Event that triggers the revealing animation.
      effect: 'fade',             // Animation to apply if elements is a string selector. Ignored if elements is an object
      hideDelay: 300,             // Delay before elements are hidden
      showDelay: 150,             // Delay before revealing content (really only applies if the triggerEvent is mouseenter, in which case the mouse must be left
                                  // in the container for showDelay long before the animation will occur)
      elements: null              // Can be a string selector or an object. If an object the keys should be
                                  // selectors to elements to animate. The values can either be string
                                  // animation type or a two-element array ([0] will run on mouse over, [1]
                                  // on mouse out  ) of objects that will be passed directly to jQuery's
                                  // `animate` function . 
    },opts);       

    var $elem,
        $current,
        effects = {
          fade:       ['fadeOut',  'fadeIn'],
          slideUp:    ['slideUp',   'slideDown'],
          slideDown:  ['slideDown',   'slideUp'],
          slideLeft:  ['slideLeftHide', 'slideLeftShow'],
          slideRight: ['slideRightHide', 'slideRightShow']
        },
        hideDelayTimer  = null,
        showDelayTimer  = null,
        mouseHasLeft    = false,
        mouseHasEntered = false;

    function getEffect(type,effect) {
      if (type == 'hide') {
        return effects[effect][1];
      } else if (type == 'show') {
        return effects[effect][0];
      }
    }

    // If elements is an object
    function animateFromObject($trigger,action){
      $.each(opts.elements, function(k,v){
        var self = $trigger.find(k);
        if (typeOf(v) == 'array') {
          self.animate(v[action == 'show' ? 0 : 1]);
        } else {
          self[getEffect(action,v)]();
        }
      });
    }

    // If elements is a string selector 
    function animateFromString($trigger,action){
      $elem = opts.elements ? $trigger.find(opts.elements) : $trigger.children();
      if (action == 'show' && !$elem.is(":animated")) {
        $elem[effects[opts.effect][0]]();
      } else if (action == 'hide' && (!$elem.is(':visible') || $elem.is(":animated")) ) {
        $elem[effects[opts.effect][1]]();
      }
    }
   
    function animate($trigger,action) {
      $current = $trigger;
      if (hideDelayTimer) {
        clearTimeout(hideDelayTimer);
        hideDelayTimer = null;
      }
      if (typeOf(opts.elements) === 'string') {
        animateFromString($trigger,action);
      } else {
        animateFromObject($trigger,action);
      }
    }

    return this.each(function(){
      $(this).
        bind(opts.triggerEvent, function(e){
          e.preventDefault();
          mouseHasEntered = true;
          var self = $(this);
          // Don't do anything if we've entered the same item within the specified delay
          if ($current && ($current.index(this) != -1) && hideDelayTimer) {
            clearTimeout(hideDelayTimer);
          } else if (($current && $current.index(this) > -1) && (!mouseHasLeft)) {
            return false;
          } else {
            // Delay immediate activation
            showDelayTimer = setTimeout(function() {
              showDelayTimer = null;
              if ($current && hideDelayTimer){
                animate($current, 'hide');
              }
              animate(self, 'show');
            }, opts.showDelay);
            mouseHasLeft = false;
          }
          return false;
        }).
        bind('mouseleave', function(e){
          if (!mouseHasEntered) { return false; }
          var self = $(this);
          mouseHasLeft = true;
          // If we're waiting to show, and we mouse out, cancel the show action
          // Otherwise hide
          if (showDelayTimer) {
            clearTimeout(showDelayTimer);
            showDelayTimer = null;
          } else {
            hideDelayTimer = setTimeout(function() {
              animate(self, 'hide');
            }, opts.hideDelay);
            mouseHasEntered = false;
          }
          return false;
        });
    });
  };

})(jQuery);
