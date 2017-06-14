/**
 * fire on Dom ready
 * @param {type} fn
 * @returns {undefined}
 */
onReady = function (fn) {
    (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);
};
/**
 * return a formatted date
 * @param {DateObject} dt
 * @returns {String}
 */
fmtDate = function (dt) {
    var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return (dt instanceof Date)?  dt.toLocaleDateString("fr-FR", options) : '--';
}

/**
 * parse a date string like dd/mm/yyyy
 * @param {type} str
 * @returns {Date Object|null} null if not a valid date
 */
function parseDate(str) {

   var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (t !== null) {
       var d = +t[1], m = +t[2] - 1, y = +t[3];
        var date = new Date(y, m, d);
        if (date.getFullYear() === y && date.getMonth() === m) {
            return date;
        }
    }
    return null;
}

onReady(function () {
// ==================================== TEST ===========================
// Prefill form
    document.getElementById('formfiller').addEventListener('click', function (e) {
        var fields = {
            'inputEmail3': 'gaby@start.com',
            'date3': '12/10/2017',
            'pwd3': '123456',
            'pwd3-confirm': '123456',
            'name': 'John Doe',
            'message': 'Have a nice day !'
        };
        for (var i in fields) {
            document.getElementsByName(i)[0].value = fields[i];
        }
        // checkboxes
        var elts = document.querySelectorAll("input[name='option[]']");
        elts[0].setAttribute('checked', '');
        elts[3].setAttribute('checked', '');
        elts[4].setAttribute('checked', '');

        var elt = document.querySelector("input[name='terms']");
        elt.setAttribute('checked', '');


    });

    checkForm('testform', {
        /* ============== validators ============ */
        validators: {
            confirmpwd: {
                fn: function (e, form) {
                    var one = form.querySelector('#pwd3').value;
                    var two = form.querySelector('#pwd3-confirm').value;
                    // check only if confirm pwd is filled
                    return (two) ? one === two : true;
                },
                msg: "Passwords do not match."
            },
            acceptterms: {
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
                    var dt = parseDate(e.value);
                    console.log('date: ',fmtDate(dt));
                    return !!dt;
                },
                msg: "Please enter a valid french date (jj/mm/aaaa)"
            }

        },
        /* =========== on valid form ============ */
        onValid: function (e) {
            var data = e.target.elements;
            alert('Well Done ! ' + data.length + ' Elements submitted');
            // if submit is done by ajax...
            e.preventDefault();
        },
        /* ============ on error ============== */
        onError: function (e) {
            alert('Check twice !');
        }
    }

    ); // form

}); // onReady