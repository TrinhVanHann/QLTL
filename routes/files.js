const express = require('express')
const router = express.Router()
const filesController = require('../controllers/FilesController')
const upload = require('../utils/multerUpload')
const authenticateToken = require('../middlewares/AuthenticateToken')
const checkRBAC = require('../middlewares/checkRBAC')


router.get('/action/share/:id', authenticateToken, filesController.share)
router.get('/action/download/:id', authenticateToken, checkRBAC, filesController.download)
router.get('/action/delete/:id', authenticateToken, checkRBAC, filesController.delete)
router.post('/action/rename', authenticateToken, filesController.rename)
router.post('/action/completeShare', authenticateToken, filesController.completeShare)
router.post('/action/upload', authenticateToken, upload.array('file'), filesController.upload)
router.get('/staff/:id', authenticateToken, checkRBAC, filesController.staffShow)

router.get('/:id', authenticateToken, checkRBAC, filesController.show)
module.exports = router 