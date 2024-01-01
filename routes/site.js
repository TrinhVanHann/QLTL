const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const siteController = require('../controllers/SiteController')

router.get('/', authenticateToken, siteController.index)
router.post('/action/delete', authenticateToken, siteController.delete)



module.exports = router