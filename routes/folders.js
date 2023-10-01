const express = require('express')
const router = express.Router()
const foldersController = require('../controllers/FoldersController')
const upload = require('../utils/multerUpload')

router.post('/action/create', foldersController.create)

module.exports = router