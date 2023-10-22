const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')
const { response } = require('express')
class TrashController{
    //GET /trash
    index(req, res, next){
        const renderValue = 'showList'
        const userId = req.data.user_id
        const rootId = req.data.root_id

        Promise.all([Folder.findOne({ _id: rootId }), 
                           File.findDeleted({owner: userId}),
                           Folder.findDeleted({owner: userId}) ])
        .then(([rootFolder,fileList, folderList]) => {

            folderList = folderList.map(folder => folder.toObject())
            fileList = fileList.map(file => file.toObject())
            const rootFolderSlug = rootFolder.slug

            res.render('home',{ folderList, fileList, rootFolderSlug, renderValue })
        })
    }
}

module.exports = new TrashController