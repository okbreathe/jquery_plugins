# okTips

*Flexible tooltips and more* 

## Explanation

okTips are a simple, but flexible solution that can be used for both tooltips,
and modal dialogs. The Mighty Mouse of tooltips if you will - small but
powerful. I found other tooltip solutions to be unnecessarily heavy,
and/or inflexible. It comes with a bevy of options and clocks in at
7.2kb uncompressed and 3 kb minified.

## Usage

    $("selector").okTips({...options...});

Out of the box, okTips functions much like other tooltips: it takes the text
from the element's title attribute and displays it as the body of the tooltip. 

Now that may suffice for most usage, but if you need to customize the text of
the tooltip you'll want to pass in options object. Specifically, pass in 
either a string or a function that returns a string as the 'body' parameter.
If `body` returns text, it will be used as the body of the popup.
Alternatively, since `this` inside of the `body` function is the popup itself,
you can set the popup body there or perform other actions.

    $("selector").okTips({body:function(){...do something...}});

To remove a popup, use the 'destroy' event:

    $("popup").trigger('destroy');

options       | default                          | description
------------- | -------------                    | -------------
template      | "&lt;div class='ui-tooltip'&gt;&lt;/div&gt;" | The wrapper for the tooltip
live          | false                            | Whether to use 'live' instead of a normal event handler
triggerEvent  | 'mouseenter'                     | The event that triggers the tooltip
closeTrigger  | null                             | Selector of element that will close the popup if clicked
triggerCloses | true                             | If non-modal and true, moving outside the trigger closes the popup, otherwise moving outside the popup closes
beforeShow    | null                             | Called right before the popup is made visible
afterShow     | null                             | Called right after the popup is made visible
beforeDestroy | null                             | Called right before tooltip is removed
afterDestroy  | null                             | Called right after tooltip is removed
body          | function                         | Can be text, or a function. If it is a function and returns text, the text will be used for the body of the popup.
top           | -20                              | The y offset to display the popup at
left          | 20                               | The x offset to display the popup at
hideDelay     | 500                              | Delay before hiding the tooltip
effectTime    | 250                              | Used by the togglePuff effect
distance      | 10                               | Used by the togglePuff effect
modal         | false                            | If true popup is closed by clicking anywhere else, otherwise it is closed via mouseout
overlayClass  | 'ui-widget-overlay'              | The class of the overlay used for modal tooltips

#### Note

All callback functions except for 'body' receive the trigger as the first
argument, and inside this function 'this' will be the popup

## Help

If the default browser tooltip is showing up on hover, try remove the title
attribute from the element. You can add it to the element's jQuery data() to
use it later.

    $(this)
      .data('title', this.title)
      .removeAttr('title');

    $(this).data('title');

This isn't the default because not everyone wants this behavior, and it's very
easy to add if you do.
