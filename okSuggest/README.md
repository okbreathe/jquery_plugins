# okSuggest

*Suggestion for text inputs and selects* 

Provides inline textual suggestion for selects and text inputs.
Pluggable sort algorithm ( the example uses the Quicksilver sorting 
algorithm, but can be replaced with your own ). 

Although future versions may allow fetching options via ajax, currently the
options must exist in page.

## Usage

Call `okSuggest` on the text inputs or selects that you wish to add suggestion capability to.

    // With a select, the existing options will be used to populate the suggestion list
    $(selector).okSuggest();

    // With text inputs, you must provide an data array to populate the list
    $(selector).okSuggest({
      data: some_array,
      selected: selected_option
    });

## Dependencies

* basicLiveSearch (included)

## Notes

* If called on a select, it will be replaced with a text input and the options used populate the suggestion list.
* Should work on IE6, but you'll need to modify the CSS.
* Requires jQuery 1.4.3 or higher.

## Options

option           | default                                | description
---------------- | -------------------------------------- | -------------
data             | []                                     | Data used in the liveSearch
selected         | null                                   | String - which datum should start out in the input
minLength        | 1                                      | Minimum number of keystrokes to start the search
clearOnFocus     | true                                   | If focusing the input should clear the selected value
notFound         | Function                               | Called in the event that the user-entered string does not conform to existing values (`this` is set to the original input)
filter           | Function (see plugin)                  | Run for each data point, must return a numerical value (higher == better match)
onInsert         | function(textInput,str)                | Called when a new value is inserted into the original input
helpText         | "Begin typing to search"               | Text displayed to user when focusing the input
