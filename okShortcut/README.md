# okShortcut

*Easy keybinding*

The two methods `jQuery.shortcut.add` and `jQuery.shortcut.remove` are used to
add and remove key bindings, respectively. Both take a key-combination and a
callback. `jQuery.shortcut.add` can optionally receive an options (listed below) hash.

A key combination can include all alphanumeric keys, special keys and function keys.

Key combinations are specified by either combining the literal (in the 
case of an alphanumeric key) or the key name with a series of pluses

    shift+ctrl+f

**Key Names**

    tab, space, enter, backspace, scroll, capslock, numlock, pause, insert,
    home, delete, end, pageup, pagedown, left, up, right, down, 

    f1,f2..f12

## Usage

    $.shortcut.add(key_combination, callback, [options]);
    $.shortcut.remove(key_combination, callback);

    // E.g.

    $.shortcut.add('shift+enter', doSomething);
    $.shortcut.remove('shift+enter', doSomething);

## Note

 * Originally inspired by http://www.openjs.com/scripts/events/keyboard_shortcuts/

## Options

options                 | default           | description
----------------------- | ----------------- | ---------------------------------------------------------------------
type                    | 'keydown'         | What event to bind to (can be keydown,keyup or keypress)
propagate               | false             | Whether events propagate
disableInInput          | false             | Whether or not key bindings are disabled when an input has focus
target                  | document          | What element events should be bound to
keycode                 | false             | Give an explicit keycode to test for
