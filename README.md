# chek5Form

For a more detailed introduction to HTML5 form validation you can find some great articles like  [this one](https://www.html5rocks.com/en/tutorials/forms/constraintvalidation/) or check MDN for [a complete reference](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation).

HTML5 form validation but not very flexible. This short piece of code is an attempt to provide uniform appearance across browsers and custom constraints beyond the simple ones like `required`, `maxlength`, `pattern`, `step`, etc. and/or the correct form type like `email`, `phone`, `number`, etc.

Note that - as of today - these constraints are [widely supported](http://caniuse.com/#feat=form-validation). That's not the case of [Date and Time input](http://caniuse.com/#feat=input-datetime).



## Requirements

None ! Pure Javascript - no dependency

## HTML


```html
<form action="#" id="testform" >
   <div class="form-group">
      <label for="inputEmail3" class="control-label">Email*</label>
      <input type="email" name="inputEmail3" id="inputEmail3" placeholder="Email" required >
   </div>
   <div class="form-group">
      <label for="inputEmail3" class="control-label">Birthdate*</label>
      <input type="text" name="date3" id="date3" data-check="date" pattern="\d{1,2}/\d{1,2}/\d{4}" placeholder="jj/mm/aaaa" required />
   </div>
   <button type="submit" >submit</button>
</form>
```

- the form element MUST have an **ID**
- each form elements MUST be wrapped in a container with "**form-group**" class. Only one element per container
- custom constraints are set with a **data-check** attribute

## CSS

This is the bare minimal styling that you need :


```css
.help-block {
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
    color: #737373;
}
.has-error .help-block{
    color: #a94442;
    font-style: italic;
    font-size: 85%;
}
.has-error input {
border-color: #a94442;
box-shadow: inset 0 2px 2px rgba(0,0,0,0.075);
}
```
- help-block class is used to show notification messages on error, just below the element.
- has-error class is applied to the container with "form-group" class

## Javascript
```javascript
  checkForm(ID_of_my_form, {list_of_custom_constraints});
```
each constraint must have a validation function which returns false (fail) or true (success), and a notification message.

```javascript
myconstraint: {
    fn: function (e, form) {
         /* ..check something..  */
         return (ishappy) ? true : false;
        },
    msg: "I'm really not happy !"
}
```

*myconstraint* is called with the **data-check** attribute on the control :

> <input type="text" name="mycontrol" data-check="myconstraint" >

Here are some examples that you will see in the included demo.


```javascript
  checkForm('testform', {
        confirmpwd: {
          /* ========= confirm a password =========== */
            fn: function (e, form) {
                var one = form.querySelector('#pwd3').value;
                var two = form.querySelector('#pwd3-confirm').value;
                // check only if confirm pwd is filled
                return (two) ? one === two : true;
            },
            msg: "Passwords do not match."
        },
        acceptTC: {
          /* ========= require checked =========== */
            fn: function (e, form) {
                return e.checked;
            },
            msg: "Please indicate that you accept the Terms and Conditions"
        },
        atleastone: {
          /* ====== at least one option should be checked ======= */
            fn: function (e, form) {
                var selector = "input[name='" + e.name + "']:checked";
                var group = form.querySelectorAll(selector);
                return group.length > 0;
            },
            msg: "Please check at least one option."
        },
        date: {
          /* ====== give me french date ! ========== */
            fn: function (e, form) {
                var ts = Date.parse(e.value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                return !isNaN(ts);
            },
            msg: "Please enter a valid french date (jj/mm/aaaa)"
        },

    }); // form
```