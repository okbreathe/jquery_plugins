# okCycle

*Tiny, modular, flexible slideshow* 

If you're looking for a drop-in solution that does all the styling and other
work for you, you're in the wrong place. While I hate to reinvent the wheel for
the Nth time, I tired of all the bloated, spaghetti-code slideshows that
worked well enough until you stepped off their "golden path" and tried to change
anything. What I needed was a small plugin, with sensible defaults, that was
easy customize. 

This is that.

## Usage

    $("#my_slideshow").okCycle();

### okCycle is made up of three components:

* *core* - Supplies the core functionality of the plugin. This is all you really need, but it doesn't do anything by itself.

* *transitions* - How we get from one slide to the next

* *ui* - Add useful things like, you know, user controls.

See each file for information on how to extend and write your own transitions/user interface elements.

## Dependencies

 * jQuery imagesLoaded 

The image load event is an unreliable, and tricky beast. imagesLoaded paves over some of the quirks.

If you find the plugin too large for your tastes (although its less than 1KB minified), you can try replacing it with this snippet, which
is not quite as cross-browser compatible, but significantly smaller.

      $.event.special.imagesloaded = {
        
        add: function (obj) {
          var self = $(this);
          if ( this.tagName == 'IMG' && this.src !== '' ) {
            if ( this.complete || this.readyState == 4 ) {
              obj.handler.apply(this, arguments);
            } else {
              self.bind('load.imagesloaded', function(){
                obj.handler.apply(self[0], arguments);
                self.unbind('load.imagesloaded');
              });
            }
          }
        },
        
        teardown: function (namespaces) {
          $(this).unbind('.imagesloaded');
        }
      };

## Options

option           | default                | description
---------------- | ---------------------- | -------------
effect           | 'scroll',              | Transition effect used to cycle elements
easing           | 'swing',               | Easing used by the effect
ui               | [],                    | Any UI elements that we should build
duration         | 2000,                  | Time between animations
speed            | 500,                   | Speed the slides are transitioned between
autoplay         | false,                 | Whether to start playing immediately
afterSetup       | function(){},          | Call with the slideshow as 'this' immediately after setup is performed
afterMove        | function(transition){} | Called after we move to another slide

## Notes

* Has been tested on jQuery 1.6.2 and higher

* Although okCycle implements an autoplaying feature, it does not by default
  pause on hover.  Because okCycle allows the controls can exist anywhere on
  page, it is necessary to define hover behavior manually
 
  Just add the behavior for the hover event inside the 'afterSetup' callback



          // Note that you shouldn't call pause/play directly as our reference 
          // to the slideshow as 'this' will be lost
          var slideshow = $("my_slides_show").okCycle({
            autoplay: true, 
            afterSetup:function(){
              var slideshow = this,
                  ui        = this.data('ui');
              ui.hover(function(){ slideshow.pause(); },function(){ slideshow.play(); });
            }
          });
