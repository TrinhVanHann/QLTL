const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')
const Department = require('../models/Department')
const { response } = require('express')
class SiteController{
    //GET /
    index(req, res, next){
        const rootId = req.data.root_id
        const userId = req.data.user_id
        const renderValue = 'none'
        Promise.all([
            Folder.findOne({ _id: rootId }),
            User.findOne({_id: userId})
        ])
        .then(([rootFolder, user]) => {
            rootFolder = rootFolder.toObject()
            user = user.toObject()
   
            res.render('home',{ rootId, user, renderValue })
        })
        .catch(next)
    }

    delete(req, res, next){
        Promise.all([
            Folder.delete({_id: {$in: req.body['folderIds[]']}}),
            File.delete({ _id: {$in: req.body['fileIds[]']}})
        ])
        .then(() => res.redirect('back'))
        .catch(next)
    }
}

module.exports = new SiteController