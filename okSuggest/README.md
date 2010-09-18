# okTagList

*Live Search* 

## Usage

Call `okTagList` on the text inputs or selects that you wish to use a tagLists.

    $(selector).okTagList({...options...});

The example uses the Quicksilver sorting algorithm (the default for
basicLiveSearch), but is not required.

## Notes

* When using the autosuggest plugin, the data must already exist in page.
* Should work on IE6, but you'll need to modify the CSS.
* Requires jQuery 1.4.3 or higher.

## Options

option           | default                                | description
---------------- | -------------------------------------- | -------------
data             | []                                     | Data used in the liveSearch
selected         | null                                   | String - which datum should start out in the input
minLength        | 1                                      | Minimum number of keystrokes to start the search
keys             | select - Enter, next - Down, prev - Up | Setup Controls
notFound         | Function                               | Called in the event that the user-entered string does not conform to existing values (`this` is set to the original input)
filter           | Function (see plugin)                  | Run for each data point, must return a numerical value (higher == better match)
