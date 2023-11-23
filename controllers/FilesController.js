const path = require('path')
const fs = require('fs')
const { uploadFile, renameDocument, downloadFile } = require('../models/Upload.model')
const File = require('../models/Files')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const Share = require('../models/Share')
const Department = require('../models/Department')
const { tracebackFolder } = require('../middlewares/OperateFolder')

class FilesController {
  //POST /files/action/upload
  async upload(req, res, next) {
    const files = req.files
    const parentId = req.body.parentId

    const fileOwner = req.data.username
    const fileOwnerId = req.data.user_id
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
              owner_id: fileOwnerId,
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
        return Folder.findByIdAndUpdate(parentId, { $push: { file_childs: { $each: uploadFileIds } } })
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(next)
  }

  //GET /files/:id   ####### HAS SIDEBAR
  show(req, res, next) {
    const renderValue = 'preview'
    const userId = req.data.user_id
    const rootId = req.data.root_id
    let curFile

    File.findOneWithDeleted({ _id: req.params.id })
      .then(file => {
        curFile = file
        return tracebackFolder(file)
      })
      .then(tracebackList => {
        const iframeSrc = `https://drive.google.com/file/d/${curFile._id}/preview`
        res.render('home', { rootId, tracebackList, renderValue, iframeSrc })
      })
      .catch(next)
  }

  //POST /Files/action/rename
  rename(req, res, next) {
    const newname = req.body.newname
    const username = req.data.username
    File.updateOne({ _id: req.body.file_id, owner: username },
      { name: newname })
      .then(() => {
        return renameDocument(req.body.file_id, newname)
      })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  //GET /files/action/download/:id
  download(req, res, next) {
    File.findOne({ _id: req.params.id })
      .then(file => downloadFile(file._id, `C:\\Users\\Administrator\\Downloads\\${file.name}`))
      .then(() => res.redirect('back'))
      .catch(next)
  }

  //GET /files/action/delete/:id
  delete(req, res, next) {
    File.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  //GET files/action/share/:id   ####### HAS SIDEBAR
  async share(req, res, next) {
    const renderValue = 'share'
    const isFile = true
    const rootId = req.data.root_id
    let document = await File.findOne({ _id: req.params.id })
    let [userShared, departmentShared, generalShared, shared] = await Promise.all([
      User.aggregate([
        {
          $addFields: { 'userId': { '$toString': '$_id' } }
        },
        {
          $lookup: {
            from: 'shares',
            localField: 'userId',
            foreignField: 'shared_object',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares',
        },
        {
          $match: {
            'shares.document_id': document._id
          }
        }
      ]),
      Department.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: 'name',
            foreignField: 'shared_object',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.document_id': document._id
          }
        }
      ]),
      Share.findOne({ document_id: document._id, type_object: 'general' }),
      Share.find({ document_id: document._id }),
    ])
    const sharedUserId = userShared.map(user => user.userId)
    const sharedDeparmentName = departmentShared.map(department => department.name)
    let [notSharedUsers, notSharedDepartments] = await Promise.all([
      User.find({
        $and: [
          { _id: { $nin: sharedUserId } },
          { _id: { $nin: document.owner_id } },
        ]
      }),
      Department.find({ name: { $nin: sharedDeparmentName } }),
    ])

    document = document.toObject()
    notSharedUsers = notSharedUsers.map(user => user.toObject())
    notSharedDepartments = notSharedDepartments.map(department => department.toObject())
    generalShared = generalShared.toObject()
    // userShared = userShared.map(user => user.toObject())
    // departmentShared = departmentShared.map(department => department.toObject())

    res.render('home', {
      document, isFile,
      generalShared, userShared, departmentShared, notSharedUsers,
      notSharedDepartments,
      rootId, renderValue
    })
  }


  //POST files/action/completeShare
  async completeShare(req, res, next) {
    const data = req.body
    Share.deleteMany({ document_id: data.documentId })
      .then(async function () {
        if (data.general.permissions !== 'none') {
          const newGeneralShare = await new Share({
            document_id: data.documentId,
            shared_object: 'general',
            permissions: data.general.permissions,
            type_object: 'general'
          })
          newGeneralShare.save()
        }
        if (data.users !== 'none') {
          const newUserShares = await data.users.filter(user => user.permissions !== 'none').map(user => {
            return {
              document_id: data.documentId,
              shared_object: user.userId,
              permissions: user.permissions,
              type_object: 'user'
            }
          })
          Share.insertMany(newUserShares)
        }
        if (data.departments !== 'none') {
          const newDeparmentShares = await data.departments.map(department => {
            return {
              document_id: data.documentId,
              shared_object: department.departmentName,
              permissions: department.permissions,
              type_object: 'department'
            }
          })
          Share.insertMany(newDeparmentShares)
        }
      })
    res.redirect('back')
  }
}

module.exports = new FilesController