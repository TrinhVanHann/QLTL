const path = require('path')
const fs = require('fs')
const { uploadFile } = require('../models/Upload.model')
class FilesController{
    upload(req, res, next){
      const file = req.file
      if(file){
        uploadFile(file)
        .then(() => {
            fs.unlink(file.path, (err) => console.error(err))
        })
        .then(() => res.redirect('back'))
      }
    }

}

module.exports = new FilesController