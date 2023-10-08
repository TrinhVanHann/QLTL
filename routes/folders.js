const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const foldersController = require('../controllers/FoldersController')
const upload = require('../utils/multerUpload')

router.post('/action/create', foldersController.create)
router.post('/action/rename', foldersController.rename)
router.use('/:slug', authenticateToken, foldersController.index)
 
module.exports = router 