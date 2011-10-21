/*
 * jquery.okShortcut.js
 *
 * Copyright (c) 2011 Asher Van Brunt | http://www.okbreathe.com
 * Licensed under the BSD LICENSE
 * Date: 03/28/11
 *
 * @projectDescription Easy Keybinding
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 0.2.0
 *
 */

jQuery.shortcut = (function(){

  var defaultOptions = {
    type           : 'keydown', // What event to bind to (can be keydown,keyup or keypress)
    propagate      : false,     // Whether events propagate
    disableInInput : false,     // Whether or not key bindings are disabled when an input has focus
    target         : document,  // What element event are bound to
    keycode        : false      // Give an explicit keycode to test for
  };

  // Work around for Shift key bug created by using lowercase
  // as a result the shift+num combinationnation was broken
  var shiftNums = {
    '`':'~',    '1':'!',    '2':'@',    '3':'#',  
    '4':'$',    '5':'%',    '6':'^',    '7':'&',    '8':'*',  
    '9':'(',    '0':')',    '-':'_',    '=':'+',    ';':':',  
    "'":'"',    ',':'<',    '.':'>',    '/':'?',   '\\':'|'
  },

  // Special Keys and their codes
  specialKeys = { 
    27: 'esc', 9: 'tab', 32:'space', 13: 'enter', 8:'backspace', 145: 'scroll', 
    20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',
    35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 
    112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 
    120:'f9', 121:'f10', 122:'f11', 123:'f12' 
  },

  modifierMapping = {
    ctrl   :'ctrl',     control :'ctrl',
    shift  :'shift',    alt     :'alt',
    option :'alt',      meta    :'meta'
  },

  // Holds the bound shortcuts
  bindings = {}; 

  function triggeredInDisableTags(event, disableInInput) {
    if (!disableInInput){
      return false; 
    }
    var disableTags = 'textarea input';
    var element = event.target || event.srcElement;
    if (element.nodeType === 3) { element = element.parentNode; }
    return (disableTags.toLowerCase().indexOf(element.tagName.toLowerCase()) >= 0) ? true : false;
  }

  /*
   * Split the key combination up,
   * and check to see if it is either
   * A.) A Modifier key
   * B.) specialKey
   * C.) A specifically stated keycode
   * D.) If the character equals the key 
   * E.) If it is one of the shiftNum characters
   * For every segment that returns true find, add 1 to count
   * If we have looped through all the segments and the count is equal, call the function
   */
  function matching(combination, options, e) {
    var key, 
        modifier,
        want       = {},
        keys       = combination.split('+'),
        code       = e.keyCode || e.which, // which key was pressed
        character  = { 188: ',', 190: '.' }[code] || String.fromCharCode(code).toLowerCase(),
        count      = 0;

    for (var i=0, len=keys.length; i < len; i++) {
      key      = keys[i];
      modifier = modifierMapping[key];

      if (modifier) {
        want[modifier] = true;
        count++;

      } else if ( (key.length >= 1 && specialKeys[code] === key) ||     // Check if it is a special key
                  (options.keycode === code)                     ||     // Whether we explicitly gave keycode
                  (character === key && !specialKeys[code])      ||     // prevent f5 overlapping with 't', f4 with 's' etc...
                  (e.shiftKey && shiftNums[character] === key) ) {
        count++; 
      }
    }

    // jQuery binds the metakey to Control on PCs and Command on Macs
    return (
      keys.length  === count &&
      !!want.shift === !!e.shiftKey &&
      !!want.ctrl  === !!e.metaKey &&
      !!want.alt   === !!e.altKey 
    );
  }

  // Return the function to be called at keypress
  function makeKeypressedFun( combination, callback, options ) {
    return function( e ) {
      e = e ? e : window.event;

      // Don't do anything unless the key press is one our bound keys and we're not in a disabled tag
      if ( triggeredInDisableTags(e, options.disableInInput) || !matching(combination, options, e) ) {return;}
      callback(e);
      if( !options.propagate ) {
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
      }
    };
  }

  return {
    // Add a shortcut
    add: function(combination, callback, options) {
      options = options || {};

      for (var name in defaultOptions) {
        if (!options.hasOwnProperty(name)) { 
          options[name] = defaultOptions[name]; 
        }
      }

      var fn = makeKeypressedFun( combination, callback, options );

      bindings[combination.toLowerCase()] = {
        'callback' : fn,
        'target'	 : options.target,
        'event'    : options.type
      };

      jQuery(options.target).bind(options.type, fn);
      return this;
    },

    // Remove a shortcut - you only need to pass the shortcut
    remove: function(combination) {
      var binding = bindings[combination.toLowerCase()];

      delete bindings[combination];

      if( binding ){ 
        jQuery(binding.target).unbind(binding.event, binding.callback);
      }
      return this;
    }	
  };
})();
