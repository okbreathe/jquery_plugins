okPopup
  core
  transitions
    fade
    zoom
  ui
    popup
    responsive
    gallery

// The issue is how to determine what should close the popup
// often we want clicking the modal, clicking the image or clicking a button to close it
$.okPopup.create({
  onOpen: function(){},
  onClose: function(){},
  // these are either events or event selector pairs
  // event,
  // event selector [selector],
  // Three special selectors: element, modal, popup
  // element is the the element it was called on (only applicabale if using $.fn.okPopup)
  openEvent: 'click element .ui-close,'
  closeEvent: 'click modal'
  // even: open // event for both or specify individually [open,close]
  // modal: true //or close event
  ui: ['responsive', 'modal'],
  template: stringOrFunction,
  transition: {
    type: 'fade',
    location: 'center' // center|element|event
    location is a named position or an array and an something to position it against, defaults to viewport
    ...options..
  }
})

onShow/onHide = popup.open(content,elementOrEvent), popup.close(content,elementOrEvent)

$.okPopup.transitions = {
  zoom: function(transition,options){
    transition.to,
    transition.from
    transition.originalEvent
    transition.offsetElement
    transition.parent
    transition.resolve();
  }
};




# okPopup

*For popups, modal windows, tooltips etc.*

okPopup allows you to display a variety of popups, tooltips, modal windows etc.

It's basically a thin wrapper on `okPosition`. The goal is to abstract enough
out of your way that you can get basic functionality without fuss, but are
still replace most of the functionality when needed.


## Usage

See example.html


## Options

options       | default                                      | description
------------- | -------------------------------------------- | -------------
openEvent     | null                                         | Which event triggers the popup to show
closeEvent    | null                                         | Which event triggers the popup to be hidden
openEffect    | 'show'                                       | If your effect takes options, pass an array here
closeEffect   | 'hide'                                       | If your effect takes options, pass an array here
onOpen        | function(event,popup){ popup.open(event); }, | Called when open event is triggered. Arguments: original event and popup. Call `popup.open(event)` to perform default function.
onClose       | function(event,popup){ popup.close(); },     | Called when close event is triggered. Arguments: original event and popup. Call `popup.close()` to perform default function.
modal         | false                                        | Whether we should create a modal overlay, if you pass a string of an event, it will be closed when the event is triggered on the overlay.
parent        | "body"                                       | element or selector of the parent element
template      | "<div class='ui-popup'></div>"               | Content container
overlayClass  | 'ui-widget-overlay'                          | The overlay class

## Notes

Requires jQuery 1.7.0 or greater

Using the imagesloaded is HIGHLY recommended, and probably required for modals to work correctly

Supports IE8+ and proper browsers.


// UI is basically prefab recipes for okPopup, and the above is basically shorthand for

$("#example-2").okPopup({
  openWhen    : 'click #example-2',
  closeWhen   : 'click .ui-modal',
  position    : 'center',
  transition  : 'fade',
  modal       : 'click',
  onInit      : function(){
    // Will only ever be added once and reused for all modal popups
    var overlay = $('.'+options.overlayClass);

    if ( overlay.length === 0 ) {
      overlay = $("&lt;div id='ui-overlay' class='ui-overlay' &gt;&lt;/div&gt;").appendTo("body").hide();
    }
  },
  content     : function(e,popup){ return $(e.currentTarget).data('content'); }
});

// Keep in mind that any options you explicitly pass in will override transitions
// So if you wanted to make it so that clicking anywhere closes the modal you could change the `closeWhen` property

{ closeWhen: 'click .ui-modal, .ui-popup'}


 // UI should return the final dimensions, if need be the UI can set the intial dimensions
 // If the UI does not return dimensions, just measure it directly
 // Or maybe return the element that needs to be measured? 
 // Might overcomplicate things
