# okTreemap

*a framework for creating a treemap-like UI components*

## Explanation

A treemap is a method for displaying data by using nested rectangles. In this
case, we use a series of nested tables.  A treemap begins with two or more
choices (one choice isn't really a choice is it?). Each time a table cell is
clicked on, its contents are then replaced with another table which presents
two or more choices.  This process can continue until space runs out. 

The neat thing in this is that all the choices that the user *did not make*
remain available to throughout the process (by virtue of replacing only
selected cells).

I would be interested to know what you uses you come up for it.

## Usage

			$(selector).treeMap(stepFunction, {...options...}) 

The stepFunction is called after each selection. The stepFunction receives the
current step, and the selected value and should return an array of values. If
the stepFunction ever returns null, then the treemap will be considered at an
end and the onComplete callback will be called. 

options       | default       | description
------------- | ------------- | -------------
triggerEvent  | 'click'       | Event that triggers the creation of a treemap
live          | false         | Use $.fn.live rather than $.fn.bind
offsetX       | 15            | The x-offset that the treeMap will appear from the trigger
offsetY       | -15           | The y-offset that the treeMap will appear from the trigger
title         | ''            | Sets the title of the treemap. You can also change it later in a callback
template      | 'default'     | Which template to use for the treeMap, you can add more adding them to $.fn.treeMap.templates
colorSequence | Array         | An array that defines the background colours to apply to the tables
gridFunction  | null          | Change the number of rows and columns in the table. Receives the total number of cells and should return an array: [columns,rows]
onInit        | null          | Called when creating a treeMap for the first time
onSelect      | null          | Called after a cell is selected. Receives the selections and the last selected value.
onComplete    | null          | Callback performed after the final step is reached
