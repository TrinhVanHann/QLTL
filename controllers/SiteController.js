const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')
const { response } = require('express')
class SiteController{
    //GET /
    index(req, res, next){
        const rootId = req.data.root_id
        const showList = false
        Folder.findOne({ _id: rootId })
        .then(rootFolder => {
            rootFolder = rootFolder.toObject()
            const rootFolderSlug = rootFolder.slug
   
            res.render('home',{ rootFolderSlug, showList })
        })
        .catch(next)
    }
    
}

module.exports = new SiteController