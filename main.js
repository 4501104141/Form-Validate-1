function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    let selectorRules = {};
    function validate(inputElement, rule) {
        // let errorElement = getParent(inputElement, '.form-group');
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errolSelector);
        let errorMessage;
        //Get rules of selector
        let rules = selectorRules[rule.selector];
        //Loop through each rule and check
        //If have exception then break
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) { break; }
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    //Get element form need validate
    let formElement = document.querySelector(options.form);
    if (formElement) {
        //When submit form 
        formElement.onsubmit = function (e) {
            e.preventDefault();
            let isFormValid = true;
            //Loop each rule and validate
            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                if (!isValid) { isFormValid = false; }
            });
            if (isFormValid) {
                //case submit with js
                if (typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');
                    let formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                //case submit with behavior default
                else {
                    formElement.submit();
                }
            }
        }
        //Handle loop each rule and handle listen event
        options.rules.forEach(function (rule) {
            //Save rules for each input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                //Handle blur out input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                //Handle case when user input
                inputElement.oninput = function () {
                    let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errolSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
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
Validator.isComfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Nhap khong chinh xac';
        }
    }
}