# basicWindow

*Display Content in specified position* 

## Usage

    $.basicWindow(content,[position],[options]);

options         | default                                   | description
-------------   | -------------                             | -------------
contentSelector | "#ui-basicWindow-content"                 | The content will be appended to the element specified by this selector.
template        | "<div id='ui-basicWindow-content'></div>" | The content inside the basicWindow
offsetTop       | 10                                        | Used when location is an Event or DOM-element.  Rarely do we want to appear directly on top of an element
offsetLeft      | 10                                        | Same purpose as above
show            | Function                                  | Overwrite. 'this' is the container with appended content
hide            | Function                                  | Overwrite. 'this' is the container with appended content
modal           | true                                      | Whether or not to show a modal window when displaying the content window
