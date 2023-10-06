const Handlebars = require('handlebars')
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
    }
}