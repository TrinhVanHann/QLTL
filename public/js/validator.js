function Validator(option){
    function getParent(element, selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};
    // Hàm validate cho mỗi rule
    function validate(inputElement, rule){
        var rules = selectorRules[rule.selector];
        var errorMessage;
        for(var i = 0; i < rules.length; i++){
            switch(inputElement.type){
                case "radio":
                case "checkbox":
                    errorMessage = rules[i](document.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }
        var messageElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector);
        if(errorMessage) {
            messageElement.innerText = errorMessage;
            inputElement.classList.add('invalid');
        } else {
            messageElement.innerText = '';
            inputElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    var formElement = document.querySelector(option.form);
    if(formElement) {
        //Xử lý submit: validate toàn bộ khi có submit, neu k có lỗi thì in ra giá trị input
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isValidAll = true;
            option.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if(!isValid) isValidAll = false;
            })
            if(isValidAll) {
                if(typeof option.onSubmit === 'function') {
                    var formInputs = Array.from(formElement.querySelectorAll('[name]'))
                    var formValues = formInputs.reduce( function(value, input){
                        switch(input.type) {
                            case 'radio':
                                if(input.matches(':checked')) {
                                    value[input.name] = input.value;
                                }
                                break;
                            case 'checkbox':
                                if(input.matches(':checked')) {
                                    if(Array.isArray(value[input.name])) {
                                        value[input.name].push(input.value);
                                    }
                                    else { 
                                        value[input.name] = [input.value];
                                    }
                                }
                                break;
                            case 'file':
                                value[input.name] = input.files
                                break;
                            default:
                                value[input.name] = input.value;
                        }
                        return value;
                    }, {})
                    option.onSubmit(formValues);
                } else {
                    formElement.submit();
                }
            }
        }
        option.rules.forEach(function(rule) {
            //Nhóm các rule theo selector
            if(!Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector] = [rule.test];
            } else {
                selectorRules[rule.selector].push(rule.test);
            }

            //Xử lý validate khi blur 
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach( function(inputElement) {
                if(inputElement) {
                    inputElement.onblur = function(){
                        validate(inputElement,rule);
                    }
                    inputElement.oninput = function(){
                        var messageElement = getParent(inputElement,option.formGroupSelector).querySelector(option.errorSelector);
                        messageElement.innerText = '';
                        inputElement.classList.remove('invalid')
                    }
                }
            })
        })
    }
}
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector) {
    return{ 
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng định dạng email'
        }
    }
}
Validator.minLength = function(selector, minLength) {
    return{ 
        selector: selector,
        test: function(value){
            return value.length >= minLength ? undefined : `Vui lòng nhập vào tối thiểu ${minLength} ký tự`
        }
    }
}
Validator.isConfirmed = function(selector,confirmValue) {
    return{
        selector: selector,
        test: function(value){
            return value === confirmValue() ? undefined : 'Giá trị nhập vào không chính xác'
        }
    }
}

