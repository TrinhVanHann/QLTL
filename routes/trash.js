const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const trashController = require('../controllers/TrashController')

router.get('/', authenticateToken, trashController.index)



module.exports = router  