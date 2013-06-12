# okTabs

*Simple Tabs* 

## Usage

Tabs are dependent on very little markup. The minimum requirements are:

* The tab interface must be made up of links. These links may or may not be container within an element. By default, it expects them to be within a list.
* The anchors of the links must match the id of the content element that they correspond to. 
* The tabular content must be contained in a parent element. Tag doesn't matter.

    $("#my_container").okTabs([options]);

## Options

option                | default                | description
--------------------- | ---------------------- | -------------
useHashNavigation     | true                   | Whether or not clicking tabs changes the location.hash
activeClass           | 'active'               | className given to the currently selected tab
activeElementSelector | 'li'                   | which element receives the active class
inEffect              | 'show'                 | Effect when content is shown
outEffect             | 'hide'                 | Effect when content is hidden
afterSetup            | Function               | Called after the plugin has bound to each tabbed interface
afterSelect           | Function               | Called whenever a tab change occurs

## Notes

* Requires jQuery 1.7+. This is due to usage of `on`. You can replace this with `delegate` if you need it to run on < 1.7
