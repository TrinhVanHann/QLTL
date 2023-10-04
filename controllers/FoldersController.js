const { createFolder } = require('../models/Upload.model')
const Folder = require('../models/Folders')

class FoldersController{
    async create(req, res, next){

        const parentId = req.body.curFolderId
        createFolder('New folder', parentId)
        .then((folderId) => {
            const newFolder = new Folder({
                id: folderId,
                name: 'New folder',
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
}

module.exports = new FoldersController