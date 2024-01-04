const path = require('path')
const fs = require('fs')
const { uploadFile, showFile, renameDocument, downloadFile } = require('../models/Upload.model')
const File = require('../models/Files')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const Share = require('../models/Share')
const checkRBAC = require('../middlewares/checkRBAC')

class ShareController {

  async indexDepartment(req, res, next) {
    const userId = req.data.user_id
    const user = await User.findOne({ _id: userId })
    const userDepartment = user.department
    Promise.all([
      File.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': userDepartment
          }
        }
      ]),
      Folder.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': userDepartment
          }
        }
      ])
    ])
      .then(([shareFiles, shareFolders]) => {
        const renderValue = 'showShare'
        res.render('home', { shareFiles, shareFolders, renderValue })
      })
  }
  //GET shares/user   ####### HAS SIDEBAR
  indexUser(req, res, next) {
    const userId = req.data.user_id
    const rootId = req.data.root_id
    Promise.all([
      User.findOne({ _id: userId }),
      File.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': userId
          }
        }
      ]),
      Folder.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': userId
          }
        }
      ])
    ])
      .then(([user, shareFiles, shareFolders]) => {
        const renderValue = 'showShare'
        user = user.toObject()
        res.render('home', { rootId, user, shareFiles, shareFolders, renderValue })
      })
  }

  //GET shares/general   ####### HAS SIDEBAR
  indexGeneral(req, res, next) {
    const userId = req.data.user_id
    const rootId = req.data.root_id
    Promise.all([
      User.findOne({ _id: userId }),
      File.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': 'general'
          }
        }
      ]),
      Folder.aggregate([
        {
          $lookup: {
            from: 'shares',
            localField: '_id',
            foreignField: 'document_id',
            as: 'shares'
          }
        },
        {
          $unwind: '$shares'
        },
        {
          $match: {
            'shares.shared_object': 'general'
          }
        }
      ])
    ])
      .then(([user, shareFiles, shareFolders]) => {
        const renderValue = 'showShare'
        user = user.toObject()
        res.render('home', { rootId, user, shareFiles, shareFolders, renderValue })
      })
  }

  //GET /share/files/:id   ####### HAS SIDEBAR
  fileShow(req, res, next) {
    const renderValue = 'preview'
    const rootId = req.data.root_id
    Promise.all([
      User.findOne({ _id: req.data.user_id }),
      File.findOneWithDeleted({ _id: req.params.id })
    ])
      .then(([user, file]) => {
        const iframeSrc = `https://drive.google.com/file/d/${file._id}/preview`
        user = user.toObject()
        res.render('home', { rootId, user, renderValue, iframeSrc })
      })
      .catch(next)
  }

  //GET /files/action/download/:id
  fileDownload(req, res, next) {
    File.findOne({ _id: req.params.id })
      .then(file => downloadFile(file._id, `C:\\Users\\Administrator\\Downloads\\${file.name}`))
      .then(() => res.redirect('back'))
      .catch(next)
  }

  //GET /files/action/delete/:id
  fileDelete(req, res, next) {
    File.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next)
  }


  //GET /share/folders/action/delete/:id
  folderDelete(req, res, next) {
    Folder.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  //GET /share/folders/:id
  folderShow(req, res, next) {
    let username
    let currentFolderId
    const userId = req.data.user_id
    const rootId = req.data.root_id
    let id = req.params.id
    const renderValue = 'showList'

    Promise.all([Folder.findOne({ _id: id }),
    User.findOne({ _id: userId })])
      .then(([curFolder, User]) => {
        username = User.username
        currentFolderId = curFolder._id
        return Promise.all([Folder.find({ parent_id: currentFolderId }),
        File.find({ parent_id: currentFolderId }),
        Folder.findOne({ _id: rootId })])
      })
      .then(([folderList, fileList, rootFolder]) => {

        folderList = folderList.map(folder => folder.toObject())
        fileList = fileList.map(file => file.toObject())
        rootFolder = rootFolder.toObject()
        const rootFolderSlug = rootFolder.id

        res.render('home', {
          folderList, fileList,
          username, currentFolderId,
          rootFolderSlug, renderValue
        })
      })
      .catch(next)
  }
}

module.exports = new ShareController