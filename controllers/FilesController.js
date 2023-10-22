const path = require('path')
const fs = require('fs')
const { uploadFile, showFile, renameDocument, downloadFile } = require('../models/Upload.model')
const File = require('../models/Files')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const Share = require('../models/Share')
const { tracebackFolder } = require('../middlewares/OperateFolder')
const checkRBAC = require('../middlewares/checkRBAC')

class FilesController{
    //POST /files/action/upload
    async upload(req, res, next){
      const files = req.files
      const parentId = req.body.parentId
      const fileOwner = req.data.user_id
      let uploadFileIds

      // update drive
      Promise.all(
        files.map(async (file) => {

          const fileId = await uploadFile(file, parentId);
          
          return fileId;
        })
      )
      // update database
      .then((fileIds) => {
        uploadFileIds = fileIds
        return Promise.all(
          files.map(async (file, index) => {
            const newFile = new File({
              _id: fileIds[index],
              name: file.originalname,
              type: file.mimetype,
              parent_id: req.body.parentId,
              size: file.size,
              owner: fileOwner
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

    //GET /files/:slug
    show(req, res, next) {
      const renderValue = 'preview'
      const userId = req.data.user_id 
      let curFile

      File.findOneWithDeleted({slug: req.params.slug})
      .then(file => {
        curFile = file
        return true //checkRBAC(file, userId)
      })
      .then((permission) => {
        if(permission){
          return tracebackFolder(curFile)
        }
        else res.status(500).json({message: "Bạn không có quyền truy cập vào tài liệu này"})
      })
      .then(tracebackList => { 
        const iframeSrc = `https://drive.google.com/file/d/${curFile._id}/preview`
        res.render('home', {tracebackList, renderValue, iframeSrc})
      })
      .catch(next)
    }


    rename(req, res, next) {
        console.log('Doi ten khong thanh cong')
        const newname = req.body.newname
        File.updateOne({ _id: req.body.file_id },
                        { name: newname })
        .then(() => {
            return renameDocument(req.body.file_id, newname)
        })
        .then(() => res.redirect('back'))
        .catch(next)
    }

    //GET /files/action/download/:slug
    download(req, res, next) {
      File.findOne({ slug: req.params.slug })
      .then(file => downloadFile(file._id,`C:\\Users\\Administrator\\Downloads\\${file.name}`))
      .then(() => res.redirect('back'))
      .catch(next)
    }
    
    //GET /files/action/delete/:slug
    delete(req, res, next) {
      File.delete({ slug: req.params.slug})
            .then(() => res.redirect('back'))
            .catch(next)
    }


    //GET files/action/share/:slug
    async share(req, res, next){
      try {
        const renderValue = 'share'
        let file = await File.findOne({slug: req.params.slug})
        let Shared = await Share.find({document_id: file._id})
        let [sharedUsers,notSharedUsers,rootFolder] = await Promise.all([ 
          User.find({_id: Shared.shared_object}),
          User.find({_id: {$nin: [Shared.shared_object, file.owner]}}),
          Folder.findOne({_id: req.data.root_id})
        ])

        file = file.toObject()
        sharedUsers = sharedUsers.map(user => user.toObject())
        notSharedUsers = notSharedUsers.map(user => user.toObject())
        const rootFolderSlug = rootFolder.slug

        res.render('home', {file, sharedUsers, notSharedUsers, rootFolderSlug, renderValue})
      }
      catch {
        next()
      }
    }


    //POST files/action/completeShare
    async completeShare(req, res, next){
        const data = req.body
        console.log([data])
        Share.deleteMany({document_id: data.fileId})
        .then(async function(){
          if(data.general.permissions !== 'none'){
            const newGeneralShare = await new Share({
              document_id: data.fileId,
              shared_object: 'general',
              permissions: data.general.permissions
            })
            newGeneralShare.save()
          }
          if(data.users !== 'none'){
            const newUserShares = await data.users.map(user => {
              return {
                document_id: data.fileId,
                shared_object: user.userId,
                permissions: user.permissions
              }
            })
            Share.insertMany(newUserShares)
          }

          res.redirect('back')
          // if(data.deparments !== []){
          //   const newDeparmentShares = await data.deparments.map((idx, deparment) => {
          //     return {
          //       document_id: data.fileId,
          //       shared_object: deparment.deparmentName,
          //       permissions: deparment.permissions
          //     }
          //   })
          //   Share.insertMany(newDeparmentShares)
          // }
        })
    }

    
} 

module.exports = new FilesController