# basicWindow

*Display Content in specified position* 

This plugin is meant to be torn apart and adjusted as needed. It is not meant to
be an a complete solution, rather a base for further development.

Two types of Windows:

* singleton # e.g. modal dialogs
* multiple  # e.g. tooltips

## Dependencies

jquery.basicElement
jquery.basicPosition

Note that multiWindow depends on singleWindow.

## Usage

You have to define your own logic for showing and hiding
windows. After doing so, the basic API is

    $.singleWindow.show(content,position,[options]);

    $.singleWindow.hide();

In the case of a multiWindow, hide also takes an additional
parameter, which is the index or jQuery object that you want to 
hide.

    $.singleWindow.hide(indexOrObject);

Note that calling `hide` without any arguments will destroy all existing windows.

See the examples for more detailed usage

## ProTip

If your content isn't appearing where you want it to, its probably because it
doesn't have an explicit width when its position is calculated. This often
occurs when your content lacks any sort of positioning.
