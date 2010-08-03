(function($){

  $.fn.basicCycle = function(opts){
    opts = $.extend({
      effect     : 'shift', // Either 'all', a specific animation, or an array of animations to use
      duration   : 2000, // Time to wait between animations IN ADDITION to the duration of of 2x the speed
      speed      : 500, // Higher is longer
      cycle      : true // Whether to start cycling immediately
    },opts);

    function pause(){
      if (this.data('interval')) {
        clearTimeout(this.data('interval'));
        this
          .data('interval',null)
          .data('animating',false);
      }
    }

    function cycle(){
      var self = this;
      self
        .data('animating',true)
        .data('interval', setInterval(function(){
          next.call(self);
        }, opts.duration+opts.speed*2));
    }

    // Hide the current slide and append it to the end of the image stack
    function next(){
      var self  = this,
          child = this.children(":first-child");
      if (this.children.length>1){ child.hide().appendTo(this); }
      $.fn.basicCycle.effects[opts.effect]
        .call(this, child , false, function(){ self.trigger('cycle:step'); });
    }

    // Prepend the current slide on the stack
    function prev(){
      var self  = this, 
          child = this.children(":last-child");
      $.fn.basicCycle.effects[opts.effect]
        .call(this, child, true,
              function(){ 
                if (self.children.length>1){ child.prependTo(self); }
                self.trigger('cycle:step'); 
              }
        );
    }

    return this
      .extend({ pause: pause, cycle: cycle, start: cycle, next: next, previous: prev, prev:prev})
      .each(function(){
        var self  = $(this).css({overflow:"hidden"}).data("speed",opts.speed),
            setup = $.fn.basicCycle.setup[opts.effect];
        setup ? setup.call(self) : $.fn.basicCycle.setup["default"].call(self);
        self
          .children()
            .filter(":first-child")
            .appendTo(self)
            .show();
        if (opts.cycle){ cycle.call(self); }
      });
  };

  /*
   * Extend this object to add more transitions.
   * Inside the transition, 'this' is the container
   */
  $.fn.basicCycle.effects = {
    fade: function(child,reverse,callback){
      child[reverse ? 'fadeOut' : 'fadeIn' ](this.data("speed")*2, callback);
    },
    slide:function(child,reverse,callback){
      child[reverse ? 'hide' : 'show']("slide", {direction:'left'},this.data("speed"), callback);
    },
    // Rather than sliding on top of the other slide, all children
    // are shifted
    shift:function(ct,reverse,callback){
      var child;
      if (reverse) {
        child = ct.children(":last");
        child.prependTo(ct); 
        ct.css({left: "-" + child.outerWidth() + "px"});
        ct.show().animate({left: "0px"},function(){
          callback();
        });
      } else {
        child = ct.children(":first");
        ct.show().animate({left: "-" + child.outerWidth() + "px"},function(){
          child.appendTo(ct);
          ct.css({left:0});
          callback();
        });
      }
    }
  };

  /*
   * Some effects may require some pre-processing in order
   * to run effectively. Add a key corresponding to the effect
   * that needs setup.
   */
  $.fn.basicCycle.setup = {
    'default': function(){
      this.children().css({position:"absolute",top:0,left:0});
    },
    'shift'  : function(){
      var iw = this.children().width(),
          ow = 0;
      this.children().each(function(){ ow += $(this).outerWidth(true);});
      this
        .wrapInner("<div id='basicWindow-iw'></div>")
        .css({width:iw})
        .children()
          .css({position:'relative',overflow:"auto",width: ow})
          .children()
            .css({'float':'left', display:'inline'});
    }
  };

})(jQuery);
