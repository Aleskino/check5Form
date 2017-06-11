/* 
 * form validation module based on HTML5 specifications
 * see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
 * 
 * native validators : pattern, min, max, required, step, maxlength
 *  
 */



checkForm = (function () {
    'use strict';

    var form; // form object
    var checks; // elements wiht data-check attribute
    var validators = {}; // custom validators


    /**
     * 
     * @param {type} formId Id element form
     * @param {type} customFn Custom validator function
     * @returns {undefined}
     */
    function init(formId, customFn) {

        setOpts(validators, customFn);

        form = document.getElementById(formId);
        if (!form) {
            console.log('Form #' + formId + ' not found !');
            return;
        }
        //if no validation feature we don't enhance
        if (!('noValidate' in form)) {
            return;
        }
        // If the novalidate attribute is set on the <form> element, 
        // interactive validation of the constraints doesn't happen.
        form.noValidate = true;
        // onSubmit
        form.addEventListener('submit', function (e) {

            form.checkValidity();   // update html5 validation
            if (validateAll()) {
                return true; // good !
            }
            e.preventDefault(); // bad ! cancel submit
            form.querySelector('.form-group.has-error').scrollIntoView();
        });

        // get elements with custom validation : "data-check" attribute
        checks = [];
        var elts = form.querySelectorAll('[data-check]');
        for (var i = 0; i < elts.length; i++) {
            if (!elts[i].disabled) {
                checks.push(elts[i]);
            }
        }

        // Native HTML5 validation : fired when element is loosing focus
        form.addEventListener('blur', function (e) {
            validate(e.target);
        }, true);

        // custom validation events
        var elt, i, tag, type;
        for (i = 0; i < checks.length; i++) {
            // Then we link it to the onchange event for the <select> 
            // and the oninput event for the <input>:
            elt = checks[i];
            tag = elt.tagName;
            type = elt.getAttribute('type');
            if (type === 'radio' || type === 'checkbox' || tag === 'SELECT') {
                elt.addEventListener('change', function (e) {
                    validate(e.target);
                });
            }
        }
    }

    /**
     * Validate an element and set/remove error notification
     * @param {HTMLElement} e
     * @returns {Boolean} true if success
     */
    var validate = function (e) {
        var error = "", check = e.dataset.check;

        // custom validation first
        if (validators[check]) {
            var error = validators[check].fn.call(this, e, form) ? "" : validators[check].msg;
        }
        // then html5 validation
        if (!e.validity.valid) {
            error = error === "" ? e.validationMessage : error;
        }
        error ? setError(e, error) : removeError(e);
        return !Boolean(error);
    };

    /**
     * validate ALL elements in form and set/remove error notifications
     * @returns {Boolean}
     */
    var validateAll = function () {
        var success = true, i, fields = form.elements;
        for (i = 0; i < fields.length; i++) {
            success = validate(fields[i]) && success;
        }
        return success;
    };

    /**
     * Display error notification
     * @param {HTMLelement} e
     * @param {String} msg
     * @returns {undefined}
     */
    var setError = function (e, msg) {
        var message;
        var parent = e.parentNode;

        if (!parent.classList.contains('has-error')) {
            message = document.createElement('div');
            message.className = 'help-block';

            message.innerHTML = msg;
            parent.classList.add('has-error');
            parent.appendChild(message);
        } else {
            parent.querySelector('.help-block').innerHTML = msg;
        }
    }

    /**
     * Removes error notification
     * @param {HTMLElement} e
     * @returns {undefined}
     */
    var removeError = function (e) {
        var parent = e.parentNode;
        if (parent.classList.contains('has-error')) {
            parent.classList.remove('has-error');
            parent.removeChild(parent.querySelector('.help-block'));
        }
    };

    /**
     * merge objects
     * @param {type} o
     * @param {type} user
     * @returns {undefined}
     */
    var setOpts = function (o, user) {
        if (typeof user === 'object') {
            Object.keys(user).forEach(function (key) {
                o[key] = user[key];
            });
        }
    }

    return init; // return constructor
})();

