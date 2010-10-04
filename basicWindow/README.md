# basicWindow

*Display Content in specified position* 

This plugin is meant to be torn apart and adjusted as needed. It is not meant to
be an a complete solution, rather a base for further development.

## Dependencies

Although basicWindow itself does not depend on it, the examples depend on
`jquery.basicPosition` which is also included in this repository.

## Usage

You have to define your own logic for showing and hiding windows. 
At its most basic you could do something like the following:

    var myWindow = $.basicWindow({
      show: function(content,position,options){
        return $("<div>hello world</div>").appendTo("body");
      },
      hide: function(el){
        return el.remove();
      }
    });

Notice that we returned the newly created object. This is so basicWindow can
track existing windows. If you do not return the created object, it will not
be able to cleanup.

Optionally we can pass 'init' during setup, which will be run once and only
once.

After defining your logic for showing windows the basic API is:

    myWindow.show(content,position,[options]);

To hide a window you can use:

    myWindow.hide();

Hide takes an optional parameter, which is the index or jQuery object that you
want to hide.

    myWindow.hide(indexOrObject);

Note that calling `hide` without any arguments will destroy all existing windows.

See the examples for more detailed usage. 

## ProTip

If your content isn't appearing where you want it to, its probably because it
doesn't have an explicit width when its position is calculated. This often
occurs when your content lacks any sort of positioning.
