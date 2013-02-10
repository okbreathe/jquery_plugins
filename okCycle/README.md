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
preload          | 1                      | Number of images to load (Use 0 for all) before the plugin is initialized
loadOnShow       | false                  | If true, successive images will not be loaded until they become visible
inGroupsOf       | 1                      | How manu items should we page through at a time. Currently only applicable to the 'scroll' transition
autoplay         | false,                 | Whether to start cycling immediately
afterSetup       | function(){},          | Called with the slideshow as 'this' immediately after setup is performed
beforeMove       | function(transition){} | Called before moving to another slide, with the slideshow as 'this'
afterMove        | function(transition){} | Called after moving to another slide, with the slideshow as 'this'
hoverBehavior    | function(){}           | During autoplay, we'll generally want to pause the slideshow. Default behavior is to pause when hovering 
                                          | over the slideshow element or the ui container (".okCycle-ui") if it exists

## FAQ

* I want to use native CSS3 transitions rather than animation. 

  I suggest using the (jquery.transit plugin)[https://github.com/rstacruz/jquery.transit]. 
  In the okCycle.transitions file, replace the calls to animate with transit.

* Why doesn't slides.play(),slideshow.next() etc. work? 

  In order to support binding multiple slideshows on a given page, we must
  return each slideshow separately so that they can be controlled
  independently. Each individual slideshow is available in the afterSetup
  function, where they can be exposed to external functions.

    var slideshow;

    $(selector).okCycle({
      afterSetup: function(){
        slideshow = this;
      }
    });

## Notes

* Has been tested on jQuery 1.6.2 and higher

* As of version okCycle v1.2, jQuery v1.5 or higher is REQUIRED and >= v1.7 is SUGGESTED

* Although okCycle implements an autoplaying feature, as controls can exist anywhere on
  page, it may be necessary to rewrite the hoverBehavior function to take into
  account the position of your slideshow controls 
