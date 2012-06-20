/**
 * jquery.okCycle.js
 *
 * Copyright (c) 2012 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * Date: 02/15/12
 *
 * @description Tiny, modular, flexible slideshow
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 1.00
 *
 */

(function($){

  // Holds meta-plugin settings
  $.okCycle = {};

  $.fn.okCycle = function(opts){
    opts = $.extend({
      effect     : 'scroll',              // Transition effect used to cycle elements
      easing     : 'swing',               // Easing used by the effect
      ui         : [],                    // Any UI elements that we should build
      duration   : 2000,                  // Time between animations
      speed      : 500,                   // Speed the slides are transitioned between
      preload    : 1,                     // Number of images to load (Use 0 for all) before the plugin is initialized
      loadOnShow : false,                 // If true, successive images will not be loaded until they become visible
      autoplay   : false,                 // Whether to start playing immediately
      afterSetup : function(){},          // Call with the slideshow as 'this' immediately after setup is performed
      afterMove  : function(transition){} // Called after we move to another slide
    },opts);

    var setup = $.okCycle[opts.effect], plugins = [], animating = 'animating', active = 'activeSlide', interval = 'interval', unloaded = 'unloaded';

    if (!setup) {
      if (console && console.log) {
        console.log("No such transition '"+opts.effect+"'");
      }
      return false; // Fail early since we don't know what to do
    }

    function  loadImage (img) { 
      var idx = $.inArray(img[0], this.data(unloaded));
      if ( idx > -1 ) {
        img.imagesLoaded(function(){
          $(this).fadeIn(); 
        });
        img[0].src = img[0]._src; 
        delete unloaded[idx];
      }
    }

    function endAnimation() {
      if (this.data(interval)) {
        this.data(interval, clearTimeout(this.data(interval)));
      }
    }

    function pause(){
      endAnimation.call(this);
      return this.data(animating, false);
    }

    function play(){
      var self = this.data(animating, true);
      return self.data(interval, setTimeout(function(){ next.call(self); }, opts.duration));
    }

    function next(){
      var prev = this.data(active), cur = prev+1;
      transition(this, prev, cur == this.children().length ? 0 : cur, true);
    }

    function prev(){
      var prev = this.data(active), cur = prev-1;
      transition(this, prev,  cur < 0 ? this.children().length-1 : cur, false);
    }

    function moveTo(idx) {
      var a = this.data(active); 
      transition(this, a, idx, idx > a); 
    }

    function transition(self, prev, cur, forward){
      endAnimation.call(self);

      if (opts.preload > 0 && opts.loadOnShow) {
        loadImage.call(self,self.children().eq(cur).find("img")); // Load the next image
      }

      var fn, data = { 
        from      : self.children().eq(prev),
        to        : self.children().eq(cur),
        fromIndex : prev,
        toIndex   : cur,
        forward   : forward,
        easing    : opts.easing,
        speed     : opts.speed,
        after     : function(){

          opts.afterMove.call(self, this);
          if (self.data(animating)) { 
            play.call(self); 
          }
        }
      };

      setup.move.call(self.data(active, cur),data);

      $.each(opts.ui, function(){
        fn = $.okCycle.ui[this];
        if (fn && fn.move) { 
          fn.move.call(self, self.data('ui'), data); 
        }
      });

    }

    return this.each(function(){
      var self   = $(this),
          imgs   = $('img', self),
          loaded = 0;

      if (opts.preload > 0) {
        if  (opts.loadOnShow) {
          self.data(unloaded,[]);
          imgs.slice(opts.preload).each(function(){
            this._src = this.src;
            this.src = '';
            self.data(unloaded).push($(this).hide()[0]);
          });
        }
        imgs = imgs.slice(0,opts.preload);
      }

      // Initialize UI
      if (opts.ui.length) {
        $.each(opts.ui, function(i,v){ plugins.push($.okCycle.ui[v].init); });
        // Ensure that the UI is contained
        self.data('ui',self.wrap("<div class='okCycle-ui'/>").parent());
      }

      // Store the index of current slide. Store the index rather than the element
      // to avoid race conditions between animations and UI.
      self.data(active, 0);

      // Setup plugins
      $.each(plugins, function(i,v){ if(v){v.call(self,self.data('ui'),opts);} });

      // Initialize transition effect after all images have loaded
      imgs.imagesLoaded(function(){
        setup.init.call(self,opts);
      });

      // Expose API
      self.extend({ pause: pause, play: play, next: next, prev: prev, moveTo: moveTo });

      // Start autoplaying if enabled
      if (opts.autoplay){ 
        play.call(self); 
      }

      // Call after setup hook
      opts.afterSetup.call(self);

    });

  };

})(jQuery);
