# okPopup

*Tiny, modular, flexible content display* 

Thin wrapper on top of okPosition. It abstracts enough out of your way that you
can get basic functionality without fuss, but can still work directly with the
internals.

Can be used for tooltips, modal windows etc.

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

