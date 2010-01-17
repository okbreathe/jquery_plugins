# okReveal
*Reveal hidden content through one or more animations.* 

## Explanation

Provides a UI for revealing hidden content when the containing element is
moused over. A use-case for this would be in page 'callouts'.  Allows child
elements to independently animate to build up more complex animations. It may
be easier to just view the demo to get a better idea of what it does.

## Usage

If called without options, okReveal will apply the default animation (fade) to
the children of the target element. 

You can specify which elements to animate, and what type of animation to
apply to each element by passing a hash of options where the keys are
selectors and the values are animations. Alternatively, you can pass a selector 
(which will again use the default animation).


Setting selectors and their respective animations

    $("#some-id").okReveal({
      elements: {'.foo':'slideRight', '.bar':'slideLeft'}
    });

Setting selectors and an animation type (all elements will use the same animation type)

    $("#some-id").okReveal({
      elements: ".foo, .bar",
      effect: "slideLeft"
    });

options       | default       | description
------------- | ------------- | -------------
triggerEvent  | 'mouseenter'  | Event that triggers the revealing animation.
effect        | 'fade'        | 'fade', 'slide', 'slideLeft' and 'slideRight'. Note: slide{Left,Right} require jquery.effects.slide
hideDelay     | 300           | Delay before elements are hidden
showDelay     | 150           | Delay before showing content (only applies if triggerEvent is mouseenter)
elements      | null          | Can be a string selector or an object. If an object the keys should be selectors to elements to animate. The values can either be string animation type or a
two-element array ([0] will run on mouse over, [1] on mouse out  ) of objects that will be passed directly to jQuery's `animate` function . 
