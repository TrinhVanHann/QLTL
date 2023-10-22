const express = require('express')
const router = express.Router()
const filesController = require('../controllers/FilesController')
const upload = require('../utils/multerUpload')
const authenticateToken = require('../middlewares/AuthenticateToken')

router.get('/:slug', authenticateToken, filesController.show)
router.get('/action/share/:slug', authenticateToken, filesController.share)
router.get('/action/download/:slug', filesController.download)
router.get('/action/delete/:slug', filesController.delete)
router.post('/action/rename', filesController.rename)
router.post('/action/completeShare', filesController.completeShare)
router.post('/action/upload', authenticateToken, upload.array('file'), filesController.upload)

module.exports = router 