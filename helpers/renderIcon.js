const Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('switch', function(value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
  });
  
Handlebars.registerHelper('case', function(value, options) {
if (value == this.switch_value) {
    this.switch_break = true;
    return options.fn(this);
}
});

Handlebars.registerHelper('default', function(value, options) {
    if (this.switch_break == false) {
    return value;
    }
});
module.exports = {
    renderIcon: (type) => {
        const mimeTypeToIcon = {
            'application/pdf': 'PDF.png',
            'application/msword': 'DOC.png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOC.png',
            'application/vnd.ms-excel': 'XLS.png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLS.png',
            'application/vnd.ms-powerpoint': 'PPT.png',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT.png',
            'text/plain': 'TXT.png',
            'image/png': 'IMG.png',
            'image/jpeg': 'IMG.png'
        };
        const url = mimeTypeToIcon[type]

        return '/imgs/' + url
    },   
}