# okValidate

*A lightweight, customizable form validation plugin for jQuery 1.3 and 1.4 that just works*

## Explanation

A reasonably sized (13kb uncompressed, 7.4kb minified) form-validation plugin.
It would only be 7 kb uncompressed, and 4kb minified, if not for the email
address and url validator regexps which are *ginormous*.

## Usage

okValidate favors convention over configuration. To validate a particular
field, add the name of a validator to the class of an input. For example, if we
wanted to use the `required` validator on a particular input we would add the
class "required"

    <input class='email required' name='email' type='text' />

This would validate the field with the 'required' and 'email' validators (built-in).

All validator keys are converted to regexps when testing the field class.
This allows us the opportunity to use the match data in validations. Take the
built-in length validator, `"length\\[(\\d+),?(\\d+)?\\]"` (note that the RegExp is escaped).
This will match a class of "length[#,#]" where '#' is any digit.
Matches from the regexp are applied to the validator function as arguments. The
length validator looks like this:

    function(min,max) { var len = this.val().length; return len > min && len < max; }

It receives the first and the second digit (if given) as `min` and `max`.

To add additional validators you must add properties to or extend the
`$.fn.okValidate.validators` object and/or the `$.fn.okValidate.messages`
object. In order to properly validate, both the validator, and corresponding
messages **must** have the same key. 

    $.extend($.fn.okValidate.validators, {
      my_validator: /^foo$/
    });
    $.extend($.fn.okValidate.messages, {
      my_validator: "#{field} answer was not 'foo'"
    });

## Manually Adding/Removing Errors

You can manually add and remove errors from particular inputs by triggering the
'error' and 'ok' events.

    $(input).trigger("error",["Message to Add"]); // Add "Message to Add" as an error message to the input
    $(input).trigger("ok"); // Remove errors from input

These events can be used for Ajax validation (see example.html). As standard validation
of an input only depends on the current state of the input, any validation that
depends on other sources must be performed in an alternate way.

## Details

'Validations' and 'Validation Messages' live in separate objects to allow
redefining of validations separately from the messages.

Validators can be either a function or a regexp. If a function, it
should return true if the input is valid, and false if it is not. Regexps should
attempt to match a valid input.

Validation messages can either be a string or a function that returns a string.
If the message is a string, `#{field}` will be replaced with the results of the
`fieldName` function. If the corresponding validator returns 1 or more matches,
they can be substituted into the message using the format `#{n}` where
'n' is the position of the match.  For example, the length message could be defined as:

    "#{field} must be between #{1} and #{2} characters",

If the validation message is a function, it will receive the fieldName as the first
argument, and as matches as subsequent arguments. For example, the length
message could be defined as:

    function(name,min,max){
      return name + " must be between "+min+" and "+max+" characters";
    }

## Usage

    $("form").okValidate({...options...})

#### Note

When validating checkbox and radio groups you only _need_ to add validation
class(es) to one input in the group. 

## Options

options             | default          | description
-------------       | -------------    | -------------
inlineErrors        | true             | If errors appear inline after inputs or collected at the top of the form
liveEvent           | 'blur'           | Should be either 'blur' or 'keyup'
liveValidation      | true             | If validation occurs after the liveEvent is fired (within the field or on submit)
errorClass          | 'error'          | Class added to inputs with errors as well as the error label appended to input fields
errorContainerClass | 'error-messages' | If NOT using inline errors, the error list will be given this class
showErrorFunction   | null             | Custom function for showing the errorlist
hideErrorFunction   | null             | Custom function for hiding the errorlist
onSubmit            | null             | Callback on submit
fieldName           | function         | Result of this function will be substituted into the error message as `#{field}`
