/**
 * jquery.okCycle.effects.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/15/12
 *
 * @description Provides transitions for okCycle
 * @author Asher Van Brunt
 * @mail asher@okbreathe.com
 * @version 0.20
 *
 */

(function($){

  /**
   * Effects are objects that implement two methods: 'init' and 'move'.
   *
   * `init` is called when the plugin is initally run and should setup any markup or values that are needed for functionality
   *
   * @param {Object} opts the original options that the plugin was initialized with
   *
   * `move` is called when transitioning between slides with an transition object. A transition object has everything a 
   * growing boy needs to transition between slides:
   *
   * @param {Object} transition
   *
   * transition.from {jQuery}       slide we're moving _from_
   * transition.fromIndex {Integer} index of the slide we're moving _from_
   * transition.to {jQuery}         slide we're moving _to_
   * transition.toIndex {Integer}   index of the slide we're moving _to_
   * transition.forward {Boolean}   whether we are moving forward or backwards
   * transition.easing {String}     Easing used for the transition
   * transition.speed {Numeric}     Transition speed
   * transition.after {Function}    Callback function performed after moving the slides
   *
   * Note that you MUST call `transition.after();` at the end of your animation in order for autoplay to work
   *
   * A transition should do two things:
   *   * Move the slide (duh)
   *   * Give the active slide a class of 'active'. This is useful for the UI as we often can't depend on
   *     getting slides in the order that they were originally added in.
   */

  $.extend($.okCycle, {
    fade: {
      init: function(opts){
        this
          .css({ position:'relative', overflow: 'hidden', width: this.children().width(), height: this.children().height() })
          .children()
            .css({position:"absolute",top:0,left:0}).eq(this.data('activeSlide')).css({zIndex:3});
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');    
        transition.to.addClass('active').css({opacity : 0, zIndex : 3}).animate({ opacity : 1}, transition.speed, transition.easing, function(){
          transition.from.css({zIndex:1}); 
          transition.after();
        });
      }
    },
    // Slide one slide on top of the other
    slide: {
      init: function(opts){
        this.wrap("<div class='okCycle-container' />")
          .parent().css({ position:'relative', overflow: 'hidden', width: this.children().width(), height: this.children().height() });
        this.children().css({ position:"absolute", top:0, left:0 }).eq(this.data('activeSlide')).css({zIndex:3});
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');
        transition.to
          .addClass('active')
          .css({left: transition.forward ? this.width() : -this.width(), zIndex : 3})
          .animate({left : 0}, transition.speed, transition.easing, function(){
            transition.from.css({zIndex:1}); 
            transition.after();
          });
      }
    },
    // Rather than sliding on top of the other slide, all children are shifted
    scroll:{
      init: function(opts){
        var groupedBy = opts.inGroupsOf || 1,
            ow = this.children().outerWidth(true) * groupedBy, 
            iw = this.children().outerWidth(true) * this.children().length;

        this.data('groupedBy', groupedBy);

        this.wrap("<div class='okCycle-container' />").parent().css({position:'relative', overflow: 'hidden', width: ow});

        this
          .css({position:'relative', width:iw, 'float':'left'})
          .children()
            .css({'float':'left', display:'inline', position: 'relative'});
      },
      move: function(transition){
        var self   = this, 
            diff   = transition.toIndex - transition.fromIndex, 
            offset = (( transition.forward && diff < 0) || ( !transition.forward && diff > 0)) ? 1 : Math.abs(diff),
            child  = transition.forward ? self.children().slice(0,offset*this.data('groupedBy')) : self.children().slice(-offset*this.data('groupedBy')),
            pos    = "-" + (offset*(child.outerWidth(true) * this.data('groupedBy') ))+"px";

        this.children().removeClass('active').eq(diff).addClass('active');

        if (transition.forward) {
          self.animate({ left: pos }, function(){ self.append(child).css({left:0}); transition.after(); });
        } else {
          self.prepend(child).css({ left: pos }).animate({left: "0px"}, transition.after );
        }
      }
    }
  });

})(jQuery);
