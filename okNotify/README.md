# okNotify

*Simple Growl-like notifications, with independent notification queues*

Yes. Another Growl-like notification plugin. This one is A) lightweight 
(5.4kb uncompressed, &lt; 2.7kb minified ) and B) Flexible, but 
opinionated (takes care of common use-cases out of the box).
Additionally, as stated above, this plugin allows you to create multiple, 
simultaneous message queues in different areas of the screen.

Tested in all major browsers (Firefox 3/3.5, Opera 9, IE 6/7/8, Safari 4).

## Usage

The plugin add two functions to the jQuery object. `noticeAdd` takes a string
or an options object (options detailed below and in the script). Without
arguments `noticeRemove` will remove all notices from the page. If given a
selector or jQuery object it will remove those object(s). 

    $.noticeAdd(string or object) // Add a notice
    $.noticeRemove(selector, or jQuery object) // Remove a notice

To create a basic notice all you have to do is pass in a string,
`$.noticeAdd("Hello World");`. If you want to customize the output, or
add a title, you can instead pass in an options object,
`$.noticeAdd({text:'hello world'});` (This will output an identical 
notification as the previous example). Here's a more full-featured notification:

    $.fn.noticeAdd({text:'hello world', title: 'Just saying hi', position: 'center', stay: true});

This notice will appear in the middle of screen, with a title and won't be
removed until the user manually removes it.

If you want to change the markup that okNotify uses to create the notification,
you can add new 'templates' to the $.noticeAdd.templates object and then
pass the template in to the `$.noticeAdd` function in the option object: 

    $.noticeAdd.templates['myCustomTemplate'] = "<div>foo</div>";
    $.noticeAdd({template:'myCustomTemplate'});

While you can use any markup you like, okNotify depends on the existence of
certain selectors to add content to the notification.  So unless you have a
very good reason to do so, it is recommended that that you simply style the
notification via css. 

If you really need to change the markup, to ensure okNotify functions
correctly, ensure that your template includes the following classes:

*'ui-notification, ui-notification-title, ui-notification-content'*. The
*'ui-notification'* contains the notification itself,
*'ui-notification-title'* and *'ui-notification-content'* hold the title and
content respectively.

options          | default                     | description
---------------- | --------------------------- | -------------
inEffect         | { opacity: 'show' }         | passed to $.fn.animate(), any parameters that it accepts are valid
inEffectDuration | 600                         | in effect duration in miliseconds
duration         | 3000                        | time before the item disappears
text             | ''                          | content of the notification
title            | ''                          | title of the notification
stay             | false                       | should the notice item stay or not? (if false it will fade after duration milliseconds)
type             | 'notice'                    | could also be error, success etc.
position         | 'top-right'                 | top-center, top-left, top-right, bottom-left, bottom-right, center
containerClass   | 'ui-notification-container' | class that wraps the container
template         | 'standard'                  | Extend the $.noticeAdd.templates object to add additional templates
fixed            | false                       | absolute or fixed positioning.
