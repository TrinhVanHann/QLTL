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

Handlebars.registerHelper('switch', function (value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
});

Handlebars.registerHelper('case', function (value, options) {
    if (value == this.switch_value) {
        this.switch_break = true;
        return options.fn(this);
    }
});

Handlebars.registerHelper('default', function (value, options) {
    if (this.switch_break == false) {
        return value;
    }
});
module.exports = {
    renderIcon: (type = 'application/vnd.google-apps.folder') => {
        const mimeTypeToIcon = {
            'application/vnd.google-apps.folder': 'folder.png',
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
        let url = mimeTypeToIcon[type]
        return '/imgs/' + url
    },
    renderSize: (size) => {
        if (size < 1024) return `${size}B`
        else if (size < 1024 * 1024) return `${Math.round(size / 1024, 2)}KB`
        else return `${Math.round(size / (1024 * 1024), 2)}MB`
    },
    renderPermissions: function (id, permissions, type) {

        const result = permissions.reduce((accum, permission) => {
            if (permission === 'preview') {
                const href = Handlebars.escapeExpression(`/share/${type}s/${id}`)
                return accum + `<a href="${href}">Xem</a>`
            }
            else if (permission === 'delete') {
                const href = Handlebars.escapeExpression(`/share/${type}s/action/delete/${id}`)
                return accum + `<a href="${href}">Xóa</a>`
            }
            else if (permission === 'download') {
                const href = Handlebars.escapeExpression(`/share/${type}s/action/download/${id}`)
                return accum + `<a href="${href}">Tải về</a>`
            }
            else return accum
        }, '')
        return new Handlebars.SafeString(result)
    },
    contains: (list, item) => {
        if (list) return list.includes(item)
        else return false
    },
    filter: (list, category) => {
        list.filter(ele => ele.documentType === category)
        return list
    }
}