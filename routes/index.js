const siteRouter = require('./site')
const loginRouter = require('./login')
const filesRouter = require('./files')

function route(app){
    app.use('/files', filesRouter)
    app.use('/login', loginRouter)
    app.use('/', siteRouter)
}

module.exports = route