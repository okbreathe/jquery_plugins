# okShortcut

*Easy keybinding*

The two methods `jQuery.shortcut.add` and `jQuery.shortcut.remove` are used to
add and remove key bindings, respectively. Both take a key-combination and a
callback and `jQuery.shortcut.add` can receive an optional options hash.

## Usage

    $.shortcut.add(key_combination, callback, [options]);
    $.shortcut.remove(key_combination, callback);

    // E.g.

    $.shortcut.add('shift+enter', doSomething);
    $.shortcut.remove('shift+enter', doSomething);

## Note

 * Original based on original script by Binny V A http://www.openjs.com/scripts/events/keyboard_shortcuts/

## Options

options                 | default           | description
----------------------- | ----------------- | ---------------------------------------------------------------------
type                    | 'keydown'         | What event to bind to (can be keydown,keyup or keypress)
propagate               | false             | Whether events propagate
disableInInput          | false             | Whether or not key bindings are disabled when an input has focus
target                  | document          | What element event are bound to
keycode                 | false             | Give an explicit keycode to test for
