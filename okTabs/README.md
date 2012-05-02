# okTabs

*Simple Tabs* 

## Usage

Tabs are dependent on very little markup. The minimum requirements are:

* The tab interface must be made up of links contained within an element. By default, it expects a list of links.
* The anchors of the links must match the id of the content element that they correspond to. 
* The tabular content must be contained in a parent element. It doesn't matter the type

    $("#my_container").okTabs([options]);

## Options

option                | default                | description
--------------------- | ---------------------- | -------------
activeClass           | 'active'               | className given to the currently selected tab
activeElementSelector | 'li'                   | which element receives the active class
inEffect              | 'show'                 | Effect when content is shown
outEffect             | 'hide'                 | Effect when content is hidden

## Notes

* Works with jQuery 1.7.0+ on account of using the `on` function. You could replace this with `delegate` if you need it to run on < 1.7.x
