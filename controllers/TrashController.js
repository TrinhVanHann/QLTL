const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')
class TrashController {
    //GET /trash   ####### HAS SIDEBAR
    index(req, res, next) {
        const renderValue = 'showList'
        const userId = req.data.user_id
        const rootId = req.data.root_id

        Promise.all([File.findDeleted({ owner_id: userId }),
        Folder.findDeleted({ owner_id: userId })])
            .then(([fileList, folderList]) => {

                folderList = folderList.map(folder => folder.toObject())
                fileList = fileList.map(file => file.toObject())
                fileList = fileList.filter(file => file.deleted)
                folderList = folderList.filter(folder => folder.deleted)

                res.render('home', { folderList, fileList, rootId, renderValue })
            })
    }

    //GET /trash/restore/:id
    restore(req, res, next) {
        console.log([req.params])
        Promise.all([
            File.restore({ _id: req.params.id }),
            Folder.restore({ _id: req.params.id })
        ])
            .then(() => res.redirect('/trash'))
            .catch(next)
    }
    //GET /trash/trueDelete/:id
    trueDelete(req, res, next) {
        Promise.all([
            File.deleteOne({ _id: req.params.id }),
            Folder.deleteOne({ _id: req.params.id })
        ])
            .then(() => res.redirect('/trash'))
            .catch(next)
    }
}

module.exports = new TrashController