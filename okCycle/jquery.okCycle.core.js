/**
 * jquery.okCycle.js
 *
 * Copyright (c) 2013 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/23/13
 *
 * @description Tiny, modular, flexible slideshow
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.3
 *
 */

(function($){

  // Hold meta-plugin settings
  $.okCycle = {};

  $.fn.okCycle = function(opts){
    opts = $.extend({
      effect        : 'scroll',              // Transition effect used to cycle elements
      easing        : 'swing',               // Easing used by the effect
      ui            : [],                    // Any UI elements that we should build. Appended in source order
      duration      : 2000,                  // Time between animations
      speed         : 300,                   // Speed the slides are transitioned between
      preload       : 1,                     // Number of images to load (Use 0 for all, false for none) before the plugin is initialized
      loadOnShow    : false,                 // If true, successive images will not be loaded until they become visible
      inGroupsOf    : 1,                     // How manu items should we page through at a time. Currently only applicable to the 'scroll' transition
      autoplay      : false,                 // Whether to start playing immediately. Provide a number (in seconds) to delay the inital start to the slideshow
      hoverBehavior : function(){            // During autoplay, we'll generally want to pause the slideshow at some point. The default behavior is to pause when hovering 
        var slideshow = this;                // over the slideshow element or the ui container (".okCycle-ui") if it exists
        (this.data('ui') || slideshow).hover(function(){ slideshow.pause(); }, function(){ slideshow.play(); });
      },
      afterSetup    : function(){},          // Called with the slideshow as 'this' immediately after setup is performed
      beforeMove    : function(transition){},// Called before we move to another slide, with the slideshow as 'this'
      afterMove     : function(transition){} // Called after we move to another slide, with the slideshow as 'this'
    },opts);

    var transition  = $.okCycle[opts.effect],
        animating   = 'animating',
        autoplaying = 'autoplaying',
        active      = 'activeSlide',
        interval    = 'interval',
        unloaded    = 'unloaded';

    if (!transition) throw("No such transition '"+opts.effect+"'"); // Fail early since we don't know what to do

    // Load an image if it has been previously unloaded
    function loadImage(img){ 
      var idx = $.inArray(img[0], this.data(unloaded));

      if (idx > -1) {
        img.imagesLoaded(function(){
          $(this).fadeIn(); 
        });

        img[0].src = img[0]._src; 

        delete this.data(unloaded)[idx];
      }
    }

    // Disable autoplay
    function pause(el){
      var self = el || this;

      if (self.data(interval)) {
        self.data(interval, clearTimeout(self.data(interval)));
      }

      return self.data(autoplaying, false);
    }

    // Autoplay
    function play(){
      var self = this.data(autoplaying, true);

      return self.data(interval, setTimeout(function(){ next.call(self); }, opts.duration));
    }

    // Move forwards
    function next(){
      var prev = this.data(active), 
          cur  = prev+1;

      return transitionTo(this, prev, cur == this.children().length ? 0 : cur, true);
    }

    // Move backwards
    function prev(){
      var prev = this.data(active), 
          cur  = prev-1;

      return transitionTo(this, prev,  cur < 0 ? this.children().length-1 : cur, false);
    }

    // Move to a specific slide
    function moveTo(idx){
      var activeIdx = this.data(active); 

      return transitionTo(this, activeIdx , idx, idx > activeIdx); 
    }

    // Transition to another slide using the chosen transition effect
    function transitionTo(self, prev, cur, forward){
      var data, activeItems, fn;

      if (!self.data(animating) && prev != cur) {
      
        self.data(animating, true);

        data = $.extend($.Deferred(),{ 
          from      : self.children().eq(prev),
          to        : self.children().eq(cur),
          fromIndex : prev,
          toIndex   : cur,
          forward   : forward,
          easing    : opts.easing,
          speed     : opts.speed
        });

        opts.beforeMove.call(self, data);

        // After the transition resolves the deferred, setup to transition to
        // the next slide (autoplay)
        data.done(function(){
          self.data(animating, false);

          opts.afterMove.call(self, data);

          if (self.data(autoplaying)) { 
            play.call(self); 
          }
        });

        // Transition to the next slide
        activeItems = transition.move.call(self.data(active, cur), data);

        // We can't depend on the transition returning items in same same
        // order, so load whatever the transition returns as the active items
        if (opts.preload > 0 && opts.loadOnShow) {
          (activeItems || transition.to).find("img").each(function(){
            loadImage.call(self, $(this)); // Load the next image
          });
        }

        // Tell the UI we've moved
        $.each(opts.ui, function(){
          fn = $.okCycle.ui[this];
          if (fn && fn.move) { 
            fn.move.call(self, self.data('ui'), data); 
          }
        });
      }

      return self;
    }

    return this.each(function(){
      var self      = $(this),
          imgs      = opts.preload === false ? $('') : $('img', self),
          loaded    = 0,
          initFn;

      // If we've elected to load on show we need to clear the src attribute to
      // prevent the browser from loading the image
      if (opts.preload && opts.preload > 0) {
        if (opts.loadOnShow) {
          self.data(unloaded,[]);
          imgs.slice(opts.preload).each(function(){
            this._src = this.src;
            this.src = '';
            self.data(unloaded).push($(this).hide()[0]);
          });
        }
        // Store the images we need to preload
        imgs = imgs.slice(0, opts.preload);
      }

      // Store the index of current slide. Store the index rather than the element
      // to avoid race conditions between animations and UI.
      self.data(active, 0);

      // Initialize UI
      if (opts.ui.length){
        // Ensure that the UI is contained in a parent element
        self.data('ui',self.wrap("<div class='okCycle-ui'/>").parent());

        $.each(opts.ui, function(i,v){ 
          if ((initFn = $.okCycle.ui[v].init)) {
            initFn.call(self,self.data('ui'),opts); 
          }
        });
      }

      // Initialize transition effect after all images have loaded
      imgs.imagesLoaded(function(){
        transition.init.call(self,opts);
      });

      // Expose API for each element in the set
      self.extend({ pause: pause, play: play, next: next, prev: prev, moveTo: moveTo });

      // Start autoplaying if enabled
      if ( opts.autoplay === true || typeof(opts.autoPlay) == 'number' ){ 
        setTimeout(function(){
          play.call(self); 
        },(isNaN(opts.autoplay) ? 0 : opts.autoplay));

        // Setup hover behavior
        if (typeof(opts.hoverBehavior) == 'function') {
          opts.hoverBehavior.call(self);
        }
      }

      // Call after setup hook
      opts.afterSetup.call(self);
    })
    // Expose the API for the entire set
    .extend({ 
      pause : function(el){ return pause.call(el || this); }, 
      play  : function(el){ return play.call(el || this);  }, 
      next  : function(el){ return next.call(el || this);  }, 
      prev  : function(el){ return prev.call(el || this);  }, 
      // move requires and idx, so we need to determine 
      // whether we were passed an element to work with
      moveTo: function(){ 
        var el, idx = arguments[0];
        if (arguments.length == 2) {
          el  = arguments[0];
          idx = arguments[1];
        }
        return moveTo.call(el || this, idx); 
      } 
    });
  };

})(jQuery);
