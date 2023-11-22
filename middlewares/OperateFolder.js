const Folder = require('../models/Folders')
const File = require('../models/Files')

module.exports = {
    checkNameFolder: function (folderId, name) {
        return Folder.findWithDeleted({ parent_id: folderId })
            .then((folders) => {
                const folderNames = folders.map(folder => folder.name)
                if (folderNames.includes(name)) {
                    let i = 1
                    while (folderNames.includes(name + ' (' + i + ')') && i < 100) i++
                    return i
                }
                else return 0
            })
            .catch(err => console.error(err))
    },
    checkNameFile: function (fileId, name) {
        File.findWithDeleted({ parent_id: fileId })
            .then((files) => {
                const fileNames = files.map(file => file.name)
                return [fileNames, files]
            })
            .then(([fileNames, files]) => {
                return {
                    existNamefiles: files.filter(file => fileNames.include(file.name)),
                    newNamefiles: files.filter(file => !(fileNames.include(file.name)))
                }
            })
    },
    tracebackFolder: async function (folder) {
        let ifolder = folder
        let pathList = [{ name: ifolder.name, _id: ifolder._id, type: ifolder.type }];
        try {
            while (ifolder.parent_id !== 'none') {
                ifolder = await Folder.findOne({ _id: ifolder.parent_id });
                if (!ifolder) {
                    // Không tìm thấy thư mục cha
                    console.error('Parent folder not found');
                    return pathList; // Trả về mảng hiện tại
                }
                pathList.unshift({ name: ifolder.name, _id: ifolder._id });
            }

            return pathList;
        } catch (err) {
            console.error(err);
            return pathList; // Trả về mảng hiện tại nếu có lỗi
        }
    }
}