const User = require('../models/Users')

class UsersController {
    index(req, res, next) {
        res.render('user')
    }
}

module.exports = new UsersController 