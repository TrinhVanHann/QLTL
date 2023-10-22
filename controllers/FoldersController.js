const { createFolder, renameDocument, downloadFolder } = require('../models/Upload.model')
const { checkNameFolder, tracebackFolder } = require('../middlewares/OperateFolder')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')

class FoldersController{
    //GET /folders/:slug
    index(req, res, next){
        let username
        let currentFolderId
        const userId = req.data.user_id
        const rootId = req.data.root_id
        let slug = req.params.slug
        const renderValue = 'showList'

        Promise.all([Folder.findOne({ slug: slug}), 
                     User.findOne({ _id: userId })])
        .then(([curFolder,User]) => {
            username = User.username
            currentFolderId = curFolder._id
            return Promise.all([ tracebackFolder(curFolder),
                                 Folder.find({ parent_id: currentFolderId }),
                                 File.find({ parent_id: currentFolderId }),
                                 Folder.findOne({ _id: rootId }) ])
        })
        .then(([tracebackList, folderList, fileList, rootFolder]) => {

            folderList = folderList.map(folder => folder.toObject())
            fileList = fileList.map(file => file.toObject())
            rootFolder = rootFolder.toObject()
            const rootFolderSlug = rootFolder.slug

            res.render('home',{ folderList, fileList, 
                                username, currentFolderId, 
                                rootFolderSlug, renderValue,
                                tracebackList })
        })
        .catch(next)
    }
    
    //POST /folders/action/create
    async create(req, res, next){

        const parentId = req.body.curFolderId
        let folderName
        const folderOwner = req.data.user_id
        checkNameFolder(parentId, 'New Folder')
        .then(count => {
            if (count === 0) folderName = 'New Folder'
            else folderName = 'New Folder ('+ count +')'

            return createFolder(folderName, parentId)
        })
        .then((folderId) => {

            const newFolder = new Folder({
                _id: folderId,
                name: folderName,
                parent_id: parentId,
                owner: folderOwner
            })
            return newFolder
        })
        .then((newFolder) => {
            newFolder.save()
            return Folder.findByIdAndUpdate(parentId, {$push: {folder_childs: newFolder._id}})
        })
        .then((folder) => {
            folder.save()
            res.redirect('back')
        })
        .catch(next)
    }

    //POST /folders/action/rename
    rename(req, res, next) {
        const newname = req.body.newname
        Folder.updateOne({ _id: req.body.folder_id },
                         { name: newname })
        .then(() => {
            return renameDocument(req.body.folder_id, newname)
        })
        .then(() => res.redirect('back'))
        .catch(next)
    }

    //GET /folders/action/download/:slug
    download(req, res, next) {
        Folder.findOne({ slug: req.params.slug })
        .then(folder => downloadFolder(folder._id,`C:\\Users\\Administrator\\Downloads\\`))
        .then(() => res.redirect('back'))
        .catch(next)
    }

    //GET /folders/action/delete/:slug
    delete(req, res, next) {
        Folder.delete({ slug: req.params.slug})
            .then(() => res.redirect('back'))
            .catch(next)
    }
}

module.exports = new FoldersController