const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const checkRBAC = require('../middlewares/checkRBAC')
const foldersController = require('../controllers/FoldersController')

router.post('/action/create', authenticateToken, foldersController.create)
router.post('/action/rename', authenticateToken, foldersController.rename)
// router.get('/action/download/:id', authenticateToken, checkRBAC, foldersController.download)
router.get('/action/delete/:id', authenticateToken, checkRBAC, foldersController.delete)
router.get('/action/share/:id', authenticateToken, checkRBAC, foldersController.share)
router.post('/action/completeShare', authenticateToken, foldersController.completeShare)
router.get('/affiliated', authenticateToken, foldersController.affiliated)
router.use('/:id', authenticateToken, checkRBAC, foldersController.index)


module.exports = router 