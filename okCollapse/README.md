# okCollapse

*Small plugin for hiding/showing list nodes* 

## Expanation

See the example for markup

## Usage

    $("some list").okCollapse();


options        | default       | description
-------------  | ------------- | -------------
toggleSelector | "a",          | What element will trigger collapsing/expanding of the content
toggleEvent    | "click",      | Delegated event that will trigger toggling
collapsedClass | "collapsed",  | Class added to collapsed elements
collapseSpeed  | 3,            | Higher = faster (proportional to the expanded height of the container)
expansionSpeed | 5,            | Higher = faster (proportional to the expanded height of the container)
fadeSpeed      | 3,            | Higher = faster
maxDuration    | 200,          | If the calculated (__Speed * containerHeight) duration is over this amount it will be used in its stead
collapseOthers | true          | If true, other visible elements will be collapsed when another is expanded
