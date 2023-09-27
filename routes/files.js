const express = require('express')
const router = express.Router()
const filesController = require('../controllers/FilesController')
const multer = require('multer')
var storage = multer.diskStorage({
    destination: (req,file, res) => {
        res(null,'./upload')
    },
    filename: (req, file, res) => {
        res(null,file.originalname)
    }
})
var upload = multer({ storage: storage })

router.post('/action/upload',upload.single('file'),filesController.upload)

module.exports = router