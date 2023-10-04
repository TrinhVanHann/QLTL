const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const siteController = require('../controllers/SiteController')

router.get('/', authenticateToken, siteController.index)
router.post('/', authenticateToken, siteController.index)



module.exports = router