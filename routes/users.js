const express = require('express')
const router = express.Router()
const usersController = require('../controllers/UsersController')
const AuthenticateToken = require('../middlewares/AuthenticateToken')

router.get('/',AuthenticateToken,usersController.index)

module.exports = router