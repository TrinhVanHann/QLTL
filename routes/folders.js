const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const foldersController = require('../controllers/FoldersController')
const upload = require('../utils/multerUpload')

router.post('/action/create', authenticateToken, foldersController.create)
router.post('/action/rename', foldersController.rename)
router.get('/action/download/:slug', foldersController.download)
router.use('/:slug', authenticateToken, foldersController.index)
 
module.exports = router 