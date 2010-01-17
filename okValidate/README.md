# okValidate

*A lightweight, customizable form validation plugin for jQuery 1.3 that just works*

## Explanation

A reasonably sized (12kb uncompressed, 6.8kb minified) form-validation plugin.
Actually it would only be 7 kb uncompressed, and 3.8kb minified, but the
email address and url validator regexps are *ginormous* (you could easily remove
them if you want to use a lighter regexp).

## Usage

okValidate favors convention over configuration. To validate a particular field,
add a class to the field name of one or more validators.

    <input class='email required' name='email' type='text' />

This will validate the field with the 'required' and 'email' validators (built-in).

To add additional validators you must add properties to or extend the
`$.fn.okValidate.validators` object and/or the `$.fn.okValidate.messages`
object. In order to properly validate, both the validator, and corresponding
messages **must** have the same key. 

    $.extend($.fn.okValidate.validators, {
      my_validator: /^foo$/
    });
    $.extend($.fn.okValidate.messages, {
      my_validator: "#{name} answer was not 'foo'"
    });

'Validations' and 'Validation Messages' live in separate objects 
to allow redefining of of validations separately from the messages (validations are 
mostly identical - messages can be more unique).

Validators can be either a function or a regexp. If a function, it
should return true if the input is valid, and false if it is not. Regexps should
attempt to match a valid input.

When writing messages, you can add replacement patterns. Anything inside 
of the `#{...}` will be replaced with the corresponding attribute of the input.
That is to say `#{name}` will be replaced with the name attribute from
the input, and `#{id}` with the id. Additional transformation of this property
will be performed by the 'replacementFormatter' method. The default is to
replace underscores and dashes with spaces and to strip brackets.

## Usage

    $("form").okValidate({...options...})

#### Note

When validating checkbox and radio groups you only need to add validation
class(es) to one checkbox or radio button in the group. It will still work if
you add the classes to additional inputs however.

## Options

options             | default          | description
-------------       | -------------    | -------------
inlineErrors        | true             | If errors inline appear after inputs with errors or at the top of the form
liveValidation      | true             | If validation occurs after the liveEvent is fired within the field or on submit
liveEvent           | 'blur'           | Can be 'blur' or 'keyup'
errorClass          | 'error'          | class added to inputs with errors and the error label appended to input fields
errorContainerClass | 'error-messages' | If not using inline errors, this is the class that the error list will have
showErrorFunction   | null             | If you want a custom function for showing the errorlist
hideErrorFunction   | null             | If you want a custom function for hiding the errorlist
onSubmit            | null             | Callback on submit
replacementFormatter| function()       | Alter the replacement pattern before insertion. 

