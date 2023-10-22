function Validator(option){
    var option = option
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
        option.rules.forEach(function(rule) {
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
Validator.validateOnSubmit = function(){
    if(this.formElement) {
        var isValidAll = true;
        option.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = this.validate(inputElement,rule);
            if(!isValid) isValidAll = false;
        })
        return isValidAll
    }
    else return false
}

