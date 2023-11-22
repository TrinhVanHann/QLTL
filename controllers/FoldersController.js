const { createFolder, renameDocument, downloadFolder } = require('../models/Upload.model')
const { checkNameFolder, tracebackFolder } = require('../middlewares/OperateFolder')
const Folder = require('../models/Folders')
const User = require('../models/Users')
const File = require('../models/Files')
const Share = require('../models/Share')
const Department = require('../models/Department')

class FoldersController {
    //GET /folders/:id   ####### HAS SIDEBAR
    index(req, res, next) {
        let user
        let currentFolderId
        const userId = req.data.user_id
        const rootId = req.data.root_id
        let id = req.params.id
        const renderValue = 'showList'

        Promise.all([Folder.findOne({ _id: id }),
        User.findOne({ _id: userId })])
            .then(([curFolder, User]) => {
                user = User
                currentFolderId = curFolder._id
                return Promise.all([tracebackFolder(curFolder),
                Folder.find({ parent_id: currentFolderId }),
                File.find({ parent_id: currentFolderId })
                ])
            })
            .then(([tracebackList, folderList, fileList]) => {

                folderList = folderList.map(folder => folder.toObject())
                fileList = fileList.map(file => file.toObject())
                user = user.toObject()

                res.render('home', {
                    folderList, fileList,
                    user, currentFolderId,
                    rootId, renderValue,
                    tracebackList
                })
            })
            .catch(next)
    }

    //POST /folders/action/create
    async create(req, res, next) {


        console.log([req.body])
        const parentId = req.body.curFolderId
        let folderName
        const folderOwner = req.data.username
        const folderOwnerId = req.data.user_id

        checkNameFolder(parentId, 'New Folder')
            .then(count => {
                if (count === 0) folderName = 'New Folder'
                else folderName = 'New Folder (' + count + ')'

                return createFolder(folderName, parentId)
            })
            .then((folderId) => {

                const newFolder = new Folder({
                    _id: folderId,
                    name: folderName,
                    parent_id: parentId,
                    owner_id: folderOwnerId,
                    owner: folderOwner
                })
                return newFolder
            })
            .then((newFolder) => {
                newFolder.save()
                return Folder.findByIdAndUpdate(parentId, { $push: { folder_childs: newFolder._id } })
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

    //GET /folders/action/download/:id
    // async download(req, res, next) {
    //     // const recDownload = function(){

    //     // }
    //     // const folder = await Folder.findOne({ id: req.params.id })
    //     // const fileList = await File.find({ parent_id: folder._id})
    //     // const folderList = await Folder.find({parent_id: folder._id})
    //     // .then(folder => downloadFolder(folder._id,`C:\\Users\\Administrator\\Downloads\\`))
    //     // .then(() => res.redirect('back'))
    //     // .catch(next)
    // }


    //GET /folders/action/delete/:id
    delete(req, res, next) {
        Folder.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    //GET folders/action/share/:id   ####### HAS SIDEBAR
    async share(req, res, next) {
        const renderValue = 'share'
        const isFile = false
        const rootId = req.data.root_id
        let document = await Folder.findOne({ _id: req.params.id })
        let Shared = await Share.find({ document_id: document._id })
        let [notSharedUsers, notSharedDepartments] = await Promise.all([
            User.find({ username: { $nin: [Shared.shared_object, document.owner] } }),
            Department.find({ name: { $nin: Shared.shared_object } }),
        ])

        document = document.toObject()
        Shared = Shared.map(shared => shared.toObject())
        notSharedUsers = notSharedUsers.map(user => user.toObject())
        notSharedDepartments = notSharedDepartments.map(department => department.toObject())
        userShared = Shared.filter(shared => shared.type_object === 'user')
        departmentShared = Shared.filter(shared => shared.type_object === 'department')
        generalShared = Shared.filter(shared => shared.type_object === 'general')

        res.render('home', {
            document, isFile,
            generalShared, userShared, departmentShared, notSharedUsers,
            notSharedDepartments,
            rootId, renderValue
        })
    }


    //POST folders/action/completeShare
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

module.exports = new FoldersController