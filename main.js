function Validator(options) {
    function validate(inputElement, rule) {
        let errorElement = inputElement.parentElement.querySelector(options.errolSelector);
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
                //Handle blur out input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                //Handle case when user input
                inputElement.oninput = function () {
                    let errorElement = inputElement.parentElement.querySelector(options.errolSelector);
                    errorElement.innerText = '';
                    errorElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui long nhap';
        }
    };
}
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui long nhap email';
        }
    };
}
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Nhap vao toi thieu ${min} ki tu`;
        }
    };
}
Validator.isComfirmed = function (selector, getCofirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getCofirmValue() ? undefined : message || 'Nhap khong chinh xac';
        }
    }
}