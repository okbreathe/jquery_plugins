# okSlide
*UI for linear/branching choices via panels.* 

## Explanation

okSlide creates a series of panels that can be navigated through by clicking on
available choices on each panel. Each choice leads to another panel until we run
out of panels. It is possible to set it up both in a linear fashion 
(where choices are not dependent previous choices ), and hierarchically.

## Usage

Navigation is relatively simple. Each link has an anchor that is
the id of the panel that it leads to.  `<a href='#foo'>a link</a>`
will lead to the panel `<li id='foo'>...</li>`. Clicking on the link 'foo'
will slide the panel '#foo' in view. See the example for extended usage.

Markup must be a list. Each `li` is a 'panel'.

    <ul>
      <li>...whatever...</li>
       ...
       <li>...whatever...</li>
     </ul>

okSlide doesn't do anything other than move from one panel to the next. In
order to give it a purpose, take advantage of the various callbacks.

options       | default       | description
------------- | ------------- | -------------
triggerEvent  | "click"       | Trigger showing next panel
panelSelector | "li"          | Selector of the element that will be moved
duration      | 200           | Duration of the animation
vertical      | false         | If true, panels will move up/down rather than left/right
afterSelect   | null          | Callback after a terminal link is selected, receives trigger as 'this'
afterNext     | null          | Callback after panels are moved forward, receivers trigger as 'this' and the panel we're moving to
afterPrev     | null          | Callback after panels are moved backward, receivers trigger as 'this' and the panel we're moving to
prevClass     | "prev"        | Class of the li that will trigger backwards movement.  Note: will be dynamically inserted.
backtrackText | Function      | Text used by the backtracking link
backtrack     | Function      | Function to use to append a backtracking link.  Set to false to only allow one-way traversal. 'this' will be set to the panel
