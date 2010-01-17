# okSlide
*UI for linear/branching choices via panels.* 

## Explanation

okSlide sets up a series of panels that can be navigated through by clicking on
available choices on each panel. Each choice leads to another panel until we run
out of panels. It is possible to set it up both in a linear fashion 
(where choices are not dependent previous choices ), and hierarchically.

## Usage

Navigation relies on proper naming of the id attribute of the containing
panel and the name attribute of the links contained in the panel. 

The hierarchy is defined by appending ids of children to the id of their parent.

That is if you have a panel named "one", a direct descendant of this
panel would have an id of "one-two", and a child of "one-two", would have
the id of "one-two-three".  When speaking about panels I will refer only
to the last segment of their id, that is panel "one-two-three" will be
referred to as 'Panel three'.

This defines the relationship:

    one -> two -> three

If instead you wanted to make panel 'bar' and 'baz' both direct descendants of
'foo', you would give the child panels the id, 'foo-bar' and 'foo-baz' respectively.
This would define the relationship:

					/ bar
		foo -
					\ baz

To move from one panel to the next, links (by default with the class 
"more") are used. Links must have a *name* attribute that is
the last segment of the *id* of the panel that they point to. Example:

    one -> two

Panel one would have an id of 'one', panel 'two' would have an id 'one-two'.
Therefore a link on panel 'one' that links to panel 'two', would have a name
attribute of 'two'.

okSlide doesn't do anything other than move from one panel to the next. In
order to give it a purpose, take advantage of the various callbacks.

options       | default          | description
------------- | -------------    | -------------
duration      | 200              | Duration of the animation
panelClass    | 'panel'          | Class of the element that will be moved
vertical      | false            | If true, panels will move up/down rather than left/right
nextTrigger   | 'a.more'         | Selector of the element that will trigger forward movement
prevClass     | 'prev'           | Class of the li that will trigger backwards movement.  Note: will be dynamically inserted.
selectTrigger | "a:not('.more')" | A terminal link (a link doesn't go anywhere). Triggers afterSelect event when clicked.
afterSelect   | null             | Callback after a terminal link is selected, receives trigger as 'this' and the event
afterNext     | null             | Callback after panels are moved forward, receivers trigger as 'this' and the panel we're moving to
afterPrev     | null             | Callback after panels are moved backward, receivers trigger as 'this' and the panel we're moving to


## Help
    
If you're experiencing issues try setting an explicit width on the panels in css.
