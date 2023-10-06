const path = require('path')
const fs = require('fs')
const { uploadFile } = require('../models/Upload.model')
const File = require('../models/Files')
const Folder = require('../models/Folders')

class FilesController{
    //POST /files/action/upload
    async upload(req, res, next){
      const files = req.files
      const parentId = req.body.parentId
      let uploadFileIds

      Promise.all(
        files.map(async (file) => {

          const fileId = await uploadFile(file, parentId);
          
          return fileId;
        })
      )
      .then((fileIds) => {
        uploadFileIds = fileIds
        return Promise.all(
          files.map(async (file, index) => {
            const newFile = new File({
              _id: fileIds[index],
              name: file.originalname,
              type: file.mimetype,
              parent_id: req.body.parentId,
              size: file.size
            })

            return newFile
          })
        )
      })
      .then((newFiles) => {
        newFiles.map(newFile => newFile.save())
      })
      .then(() => {
        files.map(file => fs.unlink(file.path, (err) => console.error(err)))
      })
      .then(() => {
        return Folder.findByIdAndUpdate(parentId, {$push: {file_childs: { $each: uploadFileIds}}})
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(next)
    }
}

module.exports = new FilesController