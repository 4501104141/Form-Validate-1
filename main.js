function Validator(options) {
    function validate(inputElement, rule) {
        let errorElement = inputElement.parentElement.querySelector('.form-message');
        let errorMessage = rule.test(inputElement.value);
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            errorElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            errorElement.parentElement.classList.remove('invalid');
        }
    }
    //Get element form need validate
    let formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function (rule) {
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
            }
        })
    }
}
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui long nhap';
        }
    };
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui long nhap email';
        }
    };
}