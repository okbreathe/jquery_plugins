/*
 * jquery.okValidate 
 *
 * Copyright (c) 2009 Asher Van Brunt | http://www.okbreathe.com
 * Dual licensed under MIT and GPL.
 * http://www.opensource.org/licenses/mit-license.php
 * Date: 01/10/2010
 *
 * @projectDescription Simple Validation for forms
 * @author Asher Van Brunt
 * @mailto asher@okbreathe.com
 * @version 0.5
 *
 * @id jQuery.fn.okValidate
 * @param {Object} Hash of settings, none are required.
 * @return {jQuery} Returns the same jQuery object
 *
 * Notes:
 *	- The plugin has only been tested with jQuery v 1.3.1, but should work with 1.4 as well
 */

;(function($){

  // Check if an object has any properties
  function isEmpty(ob){
    for(var i in ob){ if(ob.hasOwnProperty(i)){return false;}}
    return true;
  }

  $.fn.okValidate = function(opts){
  
    opts = $.extend({
      inlineErrors: true,                           // If true errors will be appended after the offending inputs, if false will appear at the top of the form
      liveValidation: true,                         // If true errors will appear after the field loses focus, if false only after submit is clicked
      liveEvent: 'blur',                            // Can be 'blur' or 'keyup'
      errorClass: "error",                          // The class that will be added to inputs with errors (only for inlineErrors)
      errorContainerClass: "error-messages",        // If not using inline errors, errors will be wrapped in a label of this class
      showErrorFunction: null,                      // If you want a custom function fow showing the errorlist
      hideErrorFunction: null,                      // If you want a custom function fow hiding the errorlist
      onSubmit: null,                               // Callback on submit
      replacementFormatter: function(replacement) { // Alter the replacement pattern before insertion. Default: replaces underscores/dashes with spaces, strips brackets
        return replacement.replace(/[_-]+/g,' ').replace(/\[\]/, '');
      }
    }, opts);

    // Deep extending the object causes regexps to turn into objects
    var validators     = $.fn.okValidate.validators,
        messages       = $.fn.okValidate.messages;

    // We don't necessarily want to append directly to the input because they
    // are commonly wrapped in labels
    function getErrorElement($input){
      return  $input.parent()[0].tagName == "LABEL" ? $input.parent() : $input;
    }

    // Given the replacement pattern "#{attribute}", will replace the contents
    // with the attribute as applied to the input
    function generateMessage($input, msg) {
      var replacement = msg.match(/#\{([^\{}]+)\}/);
      return replacement !== null ?  msg.replace(/#\{[^\{]+\}+/, opts.replacementFormatter($input.attr(replacement[1]))) : msg;
    }

    // Constructs the error markup
    function generateErrorList(errors) {
      var output = '';
      $.each(errors,function(id,el){
        $.each(el.data('messages'),function(k,msg){
          output += "<li>" + msg + "</li>";
        });
      });
      return "<div class='" + opts.errorContainerClass +"'><ul>" + output + '</ul></div>';
    }

    // Error list is prepended before the form itself
    function displayErrorList() {
      removeErrorList.call(this);

      if (opts.showErrorFunction) {
        opts.showErrorFunction.call(this); 
      } else {
        this.find('.error').removeClass('error');
        $.each(this.data('errors'),function(){
          $(this).addClass(opts.errorClass);
        });
        this
          .prepend(generateErrorList(this.data('errors')))
          .find("."+opts.errorContainerClass)
          .hide()
          .slideDown();
      }
    }

    function removeErrorList() {
      if (opts.hideErrorFunction) {
        opts.hideErrorFunction.call(this); 
      } else {
        this.find('.error').removeClass('error');
        $("."+opts.errorContainerClass, this).remove();
      }
    }

    // Errors appended to individual fields
    function appendErrorsTo($input) {
      var $label = $("<label/>"),
          msg    = $input.data('messages').join(", ");
      if (opts.showErrorFunction) {
        opts.showErrorFunction.call(this); 
      } else {
        if ($input.data('label')) {
          $input.data('label').html(msg);
        } else {
          $input.addClass(opts.errorClass);
          $label
            .addClass(opts.errorClass)
            .text(msg)
            .insertAfter(getErrorElement($input));
          $input.data('label', $label);
        }
      }
    }

    function removeErrorsFrom($input) {
      if (opts.hideErrorFunction) {
        opts.hideErrorFunction.call(this); 
      } else {
        if ($input.data('label')) {
          $input.data('label').remove();
          $input
            .data('label',null)
            .removeClass(opts.errorClass);
        }
      }
    }

    function maybeDisplayErrors($form,event) {
      if (opts.inlineErrors && this && this.data('messages').length <= 0) {
        removeErrorsFrom(this);
        return true;
      } else if (isEmpty( $form.data('errors') )) {
        removeErrorList.call($form);
        return true;
      } 

      opts.inlineErrors ?  
        $.each( $form.data('errors'),function(k,v){ appendErrorsTo($(v)); }) :
        displayErrorList.call($form);

      if (event) {
        event.preventDefault();
      }
      return false;
    }

    /* This is the where the meat of the processing occurs. If the input has a
     * class matching an existing validator name we will attempt to validate
     * against it.  If it isn't valid add a message to the messages array.
     * Finally, if the input contains any error messages append it to form's
     * error field list otherwise remove it from the list
    */
    function validateInput($form) {
      var $input           = this,
          assign_or_get_id = function (i) { if(!i.attr('id')){i.attr('id', "input_" + parseInt(new Date().getTime()+Math.random(), 10));}},
          validator;
      $input.data('messages', []);
      $.each($input[0].className.split(" "), function(){
        validator = validators[this];
        if (validator && !(typeof(validator) == 'function' ? validator.call($input) : validator.test($input.val()))) {
          if (this == 'required' || ($input.val() != "")) { // Prevent empty inputs from triggering validation errors
            assign_or_get_id($input);
            $input.data('messages').push(generateMessage($input, messages[this]));
            $form.data('errors')[$input.attr('id')] = $input;
          }
        }
      });

      if ( $input.data('messages').length <= 0 ) {
        delete $form.data('errors')[$input.attr('id')];
      }
    }

    return this.each(function(){
      var $form   = $(this),
          $inputs = $("input[type='checkbox'], input[type='password'], input[type='radio'].required, input[type='text'], select, textarea", $form),
          onEvent = function(e){
            // Only test the last item of a check of radiobox group
            var $input = /(checkbox|radio)/.test(this.type) ?  $("input[type='"+RegExp.$1+"'][name='"+this.name+"']:last", $form) : $(this);
            validateInput.call($input, $form);
            maybeDisplayErrors.call($input, $form, e);
          }

      $form.data('errors', {});

      if (opts.liveValidation) {
        $inputs[opts.liveEvent](function(){ onEvent.call(this); });
      } 

      $form.submit(function(e){
        $inputs.each(function(){ onEvent.call(this,e); });
        if (opts.onSubmit) {
          opts.onSubmit.call($form,e); 
        }
      });
    });
  };

  /* Extend these objects to add additional validators and messages. Validators
   * should have the same key as the message that they apply to. Validators can
   * be RegExp or a function - if a function returns true the input is
   * considered valid.
   *
   * If you don't want an validator to validate, just extend the validator 
   * object with a function that returns true.
   *
   * Note: Inside the validators 'this' is set to the input currently being validated against
   * Email and URL Regexs from: http://bassistance.de/jquery-plugins/jquery-plugin-validation/
  */ 
  $.fn.okValidate.validators = {
    email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
    required: function(){ 
      return (/(checkbox|radio)/.test(this[0].type) ? $("input[type='"+RegExp.$1+"'][name='"+this[0].name+"']").is(':checked') : ( this.val() != '' || this.val() != this.attr('title') )); 
    }, 
    number: function() { return !isNaN(this.val());},
    usd:/^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$/,
    zip:/^\d{5}(-\d{4})?$/,
    phone:/^[2-9]\d{2}-\d{3}-\d{4}$/,
    time12:/^[01]?\d:[0-5]\d?\s?[aApP]\.?[mM]\.?$/,
    time24:/^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$/
  };

  /* Replacement patterns anything inside the #{...} will be replaced with the
   * corresponding element's attribute That is to say "#{name}" will be
   * replaced with the name attribute from the input, and "#{id}" with the id
  */
  $.fn.okValidate.messages =  {
    email:    "#{name} is not a valid address",
    url:      "#{name} is not a valid url",
    required: "#{name} is required",
    number:   "#{name} is not a number",
    usd:      "#{name} must be a US Dollar amount.",
    zip:      "#{name} must be a zipcode in the format xxxxx or xxxxx-xxxx.",
    phone:    "#{name} must be in the format xxx-xxx-xxxx.",
    time24:   "#{name} must be a 24 hour time: 23:00.",
    time12:   "#{name} must be a 12 hour time: 12:00 AM/PM"
  };
})(jQuery);
