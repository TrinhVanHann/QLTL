const express = require('express')
const router = express.Router()
const loginController = require('../controllers/LoginController')
const SiteController = require('../controllers/SiteController')

router.post('/auth', loginController.auth)
router.get('/change', loginController.change)
router.post('/change', loginController.updateChange)
router.get('/', loginController.index)
 

module.exports = router