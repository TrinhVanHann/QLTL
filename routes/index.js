const siteRouter = require('./site')
const loginRouter = require('./login')
const filesRouter = require('./files')
const foldersRouter = require('./folders')
const shareRouter = require('./share')
const usersRouter = require('./users')
const trashRouter = require('./trash')
const registerRouter = require('./register')
const avatarRouter = require('./avatar')

function route(app) {
    app.use('/users', usersRouter)
    app.use('/trash', trashRouter)
    app.use('/files', filesRouter)
    app.use('/folders', foldersRouter)
    app.use('/share', shareRouter)
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/', siteRouter)
    app.use('/avatar', avatarRouter)
}

module.exports = route