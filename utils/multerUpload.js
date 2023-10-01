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

module.exports = upload