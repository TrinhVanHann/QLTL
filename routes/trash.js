const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/AuthenticateToken')
const trashController = require('../controllers/TrashController')
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport')

router.get('/', authenticateToken, trashController.index)
router.get('/restore/:id', authenticateToken, trashController.restore)
router.get('/trueDelete/:id', authenticateToken, trashController.trueDelete)



module.exports = router  