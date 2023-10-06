const { createFolder } = require('../models/Upload.model')
const { checkNameFolder } = require('../middlewares/checkNameDocument')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')

class FoldersController{
    //GET /folders/:slug
    index(req, res, next){
        let username
        let currentFolderId
        const userId = req.data.user_id
        let slug = req.params.slug

        Promise.all([Folder.findOne({ slug: slug}), 
                     User.findOne({ _id: userId })])
        .then(([curFolder,User]) => {
            username = User.username
            currentFolderId = curFolder._id
            return Promise.all([ Folder.find({ parent_id: currentFolderId }),
                                 File.find({ parent_id: currentFolderId }) ])
        })
        .then(([folderList,fileList]) => {

            if(folderList) folderList = folderList.map(folder => folder.toObject())
            if(fileList) fileList = fileList.map(file => file.toObject())

            res.render('home',{ folderList, fileList, username, currentFolderId })
        })
        .catch(next)
    }
    
    //POST /folders/action/create
    async create(req, res, next){

        const parentId = req.body.curFolderId
        let folderName
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

    rename(req, res, next) {
        const newname = req.body.newname
        Folder.updateOne({ _id: req.body.folder_id },{ name: newname })
        .then(res.redirect('back'))
        .catch(next)
    }
}

module.exports = new FoldersController