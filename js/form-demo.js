/**
 * fire on Dom ready
 * @param {type} fn
 * @returns {undefined}
 */
onReady = function (fn) {
    (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);
}


onReady(function () {
// ==================================== TEST ===========================

   
    checkForm('testform', {
        confirmpwd: {
            fn: function (e, form) {
                var one = form.querySelector('#pwd3').value;
                var two = form.querySelector('#pwd3-confirm').value;
                // check only if confirm pwd is filled
                return (two) ? one === two : true;
            },
            msg: "Passwords do not match."
        },
        acceptTC: {
            fn: function (e, form) {
                return e.checked;
            },
            msg: "Please indicate that you accept the Terms and Conditions"
        },
        atleastone: {
            fn: function (e, form) {
                var selector = "input[name='" + e.name + "']:checked";
                var group = form.querySelectorAll(selector);
                return group.length > 0;
            },
            msg: "Please check at least one option."
        },
        date: {
            fn: function (e, form) {
                var ts = Date.parse(e.value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                return !isNaN(ts);
            },
            msg: "Please enter a valid french date (jj/mm/aaaa)"
        },

    }); // form

}); // onReady