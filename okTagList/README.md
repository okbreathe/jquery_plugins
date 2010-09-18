# okTagList

*Simple TextBoxList UI* 

## Usage

Call `okTagList` on the inputs that you wish to use a tagLists.

    $("input selector").okTagList({...options...});

The example uses the Quicksilver sorting algorithm (the default for
basicLiveSearch), but is not required.

## Notes

* When using the autosuggest plugin, the data must already exist in the page (or be passed in)
* Requires jQuery 1.4.3 or higher.
* Should work on IE6, but you'll need to modify the CSS.

## Options

### okTagList Options

option           | default       | description
---------------- | ------------- | -------------
helpText         | See plugin    | Text displayed to user when focusing the input

### okTagList.suggest Options

option           | default                                | description
---------------- | -------------------------------------- | -------------
data             | []                                     | Data used in the liveSearch
minLength        | 1                                      | Minimum number of keystrokes to start the search
maxResults       | 10                                     | Maximum number of results to show
filter           | Function (see plugin)                  | Run for each data point, must return a numerical value (higher == better match)

## Changing the keys

To change the keys extend the the `$.fn.okTagList.keys` object. Each action
must be an array of keycodes for the particular keys you want to use. See the
plugin for examples
