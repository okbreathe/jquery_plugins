/**
 * jquery.okCycle.effects.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/09/13 
 *
 * @description Provides transitions for okCycle
 * @author Asher Van Brunt
 * @mail asher@okbreathe.com
 * @version 1.2
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
   * @param {DeferredObject} transition
   *
   * transition.from {jQuery}       slide we're moving _from_
   * transition.fromIndex {Integer} index of the slide we're moving _from_
   * transition.to {jQuery}         slide we're moving _to_
   * transition.toIndex {Integer}   index of the slide we're moving _to_
   * transition.forward {Boolean}   whether we are moving forward or backwards
   * transition.easing {String}     Easing used for the transition
   * transition.speed {Numeric}     Transition speed
   * transition.resolve {Function}  Resolve this transition
   *
   * The transition object is an enhanced Deferred Object with the additional above properties/methods.
   *
   * You MUST resolve the transition by calling `transition.resolve()` at the end of your animation in order for autoplay to work
   *
   * A transition should do two things:
   *   * Move the slide (duh)
   *   * Give the active slide an active class of (I've chosen to use 'active',
   *     but this is entirely up to your implementation, okCycle doesn't
   *     internally use this). This is useful for the UI as we often can't depend
   *     on getting slides in the order that they were originally added in.
   */

  $.extend($.okCycle, {
    // Bog-Standard Fade Transition
    fade: {
      init: function(opts){
        this.children().css({position:"absolute",top:0,left:0}).eq(this.data('activeSlide')).css({zIndex:3});
        this.css({ position:'relative', overflow: 'hidden', width: this.children(':first').width(), height: this.children(':first').height() });
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');    
        transition.to.addClass('active').css({opacity : 0, zIndex : 3}).animate({ opacity : 1}, transition.speed, transition.easing, function(){
          transition.from.css({zIndex:1}); 
          transition.resolve();
        });
      }
    },
    // Slide one slide on top of the other
    slide: {
      init: function(opts){
        this.children().css({ position:"absolute", top:0, left:0 }).eq(this.data('activeSlide')).css({zIndex:3});
        this.wrap("<div class='okCycle-container' />")
          .parent().css({ position:'relative', overflow: 'hidden', width: this.children().width(), height: this.children().height() });
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');
        transition.to
          .addClass('active')
          .css({left: transition.forward ? this.width() : -this.width(), zIndex : 3})
          .animate({left : 0}, transition.speed, transition.easing, function(){
            transition.from.css({zIndex:1}); 
            transition.resolve();
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
          self.animate({ left: pos }, function(){ self.append(child).css({left:0}); transition.resolve(); });
        } else {
          self.prepend(child).css({ left: pos }).animate({left: "0px"}, transition.resolve );
        }
      }
    },
    // Same effect as scroll, but can be used in full-screen slideshows and responsive layouts
    flexScroll: {
      init: function(opts){
        this.wrap("<div class='okCycle-container' />")
          .css({position:'relative','width':'200%',left:0})
          .parent()
            .css({position:'relative',width: '100%', 'minHeight': '100%', overflow: 'hidden'});

        this.children()
          .css({ position: 'relative', 'float': 'left', width: '50%', height: 'auto' }).slice(2).hide();
      },
      move: function(transition) {
        var container = this;

        container.children().removeClass('active').not(transition.from,transition.to).hide();

        // If we're going backwards we need to set the initial offset
        if (!transition.forward ) container.css({left: "-100%"});

        // Show the section we're about to transition to
        transition.to.addClass('active').show();

        container.animate({
          left: transition.forward ? '-100%' : '0%' }, 
          transition.speed, 
          transition.easing, 
          function(){ 
            container.css({left: 0}); 
            transition.from.hide(); 
            transition.resolve();
          });
      }
    }
  });

})(jQuery);
