const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')

class SiteController{
    index(req, res, next){
        let username
        let currentFolderId
        const userId = req.data.user_id
        const rootId = req.data.root_id


        User.findOne({ _id: userId })
        .then((User) => {
            username = User.username
            if(req.body.curFolderId) currentFolderId = req.body.curFolderId
            else currentFolderId = rootId

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
}

module.exports = new SiteController