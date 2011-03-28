# okDrag

*Simple, lightweight drag and drop list sorting*

Tested on Chrome 9, Firefox 3.6, IE7/8 using jQuery 1.3.2-1.4.4.

## Usage

		$(selector).okDrag();

## Events

okDrag fires two events:

* dragStart - fired on mousedown when over a valid draggable element with the draggable as `this`
* dragStop  - fired on mouseup with the draggable as `this` with the additional parameters of
  `positionChanged` (Boolean value for whether the item position changed), `listChanged` 
  (Boolean value for whether the item changed lists)

## Note

* The plugin is intended for use only with lists and may not work with other markup structures without modification.
* A list must fully contain all its elements. This is commonly a problem with floated elements inside a list. The solution is to just float the container as well.

## Options

Note that in order to use the scroll options you must include the option jquery.okDrag.scroll plugin.

options                | default                                       | description
-----------------------| --------------------------------------------- | ---------------------------------------------------------------------
itemSelector           | "li"                                          | Actual element that will be dragged
handleSelector         | "li"                                          | Selector of the element inside the list to act as the drag handle.
handleSelectorExclude  | "input"                                       | Exclude certain elements from being handles
dragBetween            | false                                         | Allow dragging between lists.
enableDrag             | function()                                    | If returns true, then dragging is enabled. `this` - will be set to the draggedItem. 
placeHolderTemplate    | "<li>&nbsp;</li>"                             | HTML for the placeholder of the dragged item.
allowNested            | true                                          | Allow nested lists to be sortable
tabSize                | 20                                            | Horizontal space user must move mouse before a sub list will be created
listType               | 'ul'                                          | What type of sublist to create
scrollSensitivity      | 20                                            | Distance in pixels from the edge of the viewport after which the viewport should scroll. 
scrollSpeed            | 20                                            | Speed at which the window should scroll
scrollContainer        | $(document)                                   | Which element will be scrolled (must be jQuery extended element)
