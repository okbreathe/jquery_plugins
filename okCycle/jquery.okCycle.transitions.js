/**
 * jquery.okCycle.effects.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/23/13
 *
 * @description Provides transitions for okCycle
 * @author Asher Van Brunt
 * @mail asher@okbreathe.com
 * @version 1.3
 *
 */

(function($){

  /**
   * Effects are objects that implement two methods: 'init' and 'move'.
   *
   * @method init called when the plugin is initally run and should setup any markup or values that are needed for functionality
   *
   * @param {Object} options the original options that the plugin was initialized with
   *
   * @method move called when transitioning between slides with an transition object. A transition object has everything a 
   *              growing boy needs to transition between slides:
   *
   * @param {DeferredObject} transition
   *
   * @param {jQuery}   [transition.from]       slide we're moving _from_
   * @param {Integer}  [transition.fromIndex]  index of the slide we're moving _from_
   * @param {jQuery}   [transition.to]         slide we're moving _to_
   * @param {Integer}  [transition.toIndex]    index of the slide we're moving _to_
   * @param {Boolean}  [transition.forward]    whether we are moving forward or backwards
   * @param {String}   [transition.easing]     Easing used for the transition
   * @param {Numeric}  [transition.speed]      Transition speed
   * @param {Function} [transition.resolve]    Resolve this transition
   *
   * The transition object is an enhanced Deferred Object with the additional above properties/methods.
   *
   * NOTE A move function MUST DO the following:
   *
   *   * Resolve the transition object by calling `transition.resolve()` at the end of your transition ( so autoplay works )
   *
   *   * Return the set of active elements (so we can load content if required)
   *
   * The move function, additionally should probably do two more things:
   *
   *   * Move the slide (duh)
   *
   *   * Give the active slide an active class.  Although okCycle.core doesn't
   *   internally use this, some of the transitions do.
   */

  $.extend($.okCycle, {
    // Bog-Standard Fade Transition
    fade: {
      init: function(options){
        this.children().css({position:"absolute",top:0,left:0}).eq(this.data('activeSlide')).css({zIndex:3});
        this.css({ position:'relative', overflow: 'hidden', width: this.children(':first').width(), height: this.children(':first').height() });
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');    
        return transition.to
          .addClass('active')
          .css({opacity : 0, zIndex : 3})
          .animate({ opacity : 1}, transition.speed, transition.easing, function(){
            transition.from.css({zIndex:1}); 
            transition.resolve();
          });
      }
    },
    // Slide one slide on top of the other
    slide: {
      init: function(options){
        this.children().css({ position:"absolute", top:0, left:0 }).eq(this.data('activeSlide')).css({zIndex:3});
        this.wrap("<div class='okCycle-container' />")
          .parent().css({ position:'relative', overflow: 'hidden', width: this.children().width(), height: this.children().height() });
      },
      move: function(transition){
        transition.from.css({zIndex : 2}).removeClass('active');
        return transition.to
          .addClass('active')
          .css({left: transition.forward ? this.width() : -this.width(), zIndex : 3})
          .animate({left : 0}, transition.speed, transition.easing, function(){
            transition.from.css({zIndex:1}); 
            transition.resolve();
          });
      }
    },
    // Rather than sliding on top of the other slide, all children are shifted
    // NOTE This transition pull elements out of the DOM, so it is not appropriate for content such as iFrames
    scroll:{
      init: function(options){
        var groupedBy = options.inGroupsOf || 1,
            ow = this.children().outerWidth(true) * groupedBy, 
            iw = this.children().outerWidth(true) * this.children().length;

        this.data('groupedBy', groupedBy);

        this.wrap("<div class='okCycle-container' />").parent().css({position:'relative', overflow: 'hidden', width: ow});

        this
          .css({position:'relative', width:iw, 'float':'left'})
          .children()
            .css({'float':'left', display:'inline', position: 'relative'}).first().addClass('active');
      },
      move: function(transition){
        var self   = this, 
            diff   = transition.toIndex - transition.fromIndex, 
            offset = (( transition.forward && diff < 0) || ( !transition.forward && diff > 0)) ? 1 : Math.abs(diff),
            child  = transition.forward ? self.children().slice(0,offset*this.data('groupedBy')) : self.children().slice(-offset*this.data('groupedBy')),
            pos    = "-" + (offset*(child.outerWidth(true) * this.data('groupedBy') ))+"px";

        var active = this.children().removeClass('active').eq(diff).addClass('active');

        if (transition.forward) {
          self.animate({ left: pos }, function(){ self.append(child).css({left:0}); transition.resolve(); });
        } else {
          self.prepend(child).css({ left: pos }).animate({left: "0px"}, transition.resolve );
        }

        return active;
      }
    },
    // Same effect as scroll, but can be used in full-screen slideshows and responsive layouts
    flexScroll: {
      init: function(options){
        this.wrap("<div class='okCycle-container' />")
          .css({position:'relative','width':'200%',left:0})
          .parent()
            .css({position:'relative',width: '100%', 'minHeight': '100%', overflow: 'hidden'});

        this.children().each(function(i,v){
          $(this).addClass("item-"+i);
        });

        this.children().first().addClass('active');

        this.children()
          .css({ position: 'relative', 'float': 'left', width: '50%' }).slice(2).hide();
      },
      // To/From may not be calculated correctly due to rearranging the order of the slides in the DOM,
      // therefore we get the two active slides, hide the rest, and show the 'next' slide depending on
      // whether we're moving forwards or backwards
      move: function(transition) {
        var self   = this,
            diff   = transition.toIndex - transition.fromIndex, 
            prev   = this.children('.active').removeClass('active'),
            active = this.children().eq(diff).addClass('active').show();

        // If we're going backwards we need to set the initial offset
        if (!transition.forward ) {
          self.css({left: "-100%"});
          active.prependTo(self);
        }

        self.animate({
          left: transition.forward ? '-100%' : '0%' }, 
          transition.speed, 
          transition.easing, function(){
            self.css({left: 0}); 
            prev.hide();
            if (transition.forward) { prev.appendTo(self); }
            active.next().show();
            transition.resolve();
          });

        return active;
      }
    }
  });

})(jQuery);
