# okPopup

*For popups, modal windows, tooltips etc.*

okPopup allows you to display a variety of popups, tooltips, modal windows etc.

## Usage

See example.html


## Options

options       | default                                      | description
------------- | -------------------------------------------- | -------------
content       | ""                                           | String or Function that returns the content for the popup
ui            | null                                         | String name of a UI function located in jquery.okPopup.ui.js
openWhen      | null                                         | Takes a string eventMap - see Binding Events
closeWhen     | null                                         | Takes a string eventMap - see Binding Events
allowMultiple | false                                        | Allow multiple instances of a popup to exist at once. See 'Multiple Popups'
template      | "<div/>"                                     | String or Function that returns a String or DOM Element, to use as the popup container
parent        | 'body'                                       | Element the popup will be attached to
transition    | null                                         | String name of a transitions located in jquery.okPopup.transitions.js
location      | Object                                       | Determines final location of the popup. See 'Positioning Popups'
onInit        | Function(popup,opts)                         | Called once when creating the popup
onOpen        | Function(popup,ui)                           | Called every time the popup is opened
onClose       | null                                         | Called every time the popup is closed

## Notes

Requires jQuery 1.8.0 or greater

Using the imagesloaded is HIGHLY recommended, and probably required for modals to work correctly

Supports IE8+ and proper browsers.
