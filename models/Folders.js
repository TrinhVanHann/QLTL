const mongoose = require("mongoose");
const Schema = mongoose.Schema

const folderSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    folder_childs: [String],
    file_childs: [String]
},{
    _id: false
});

module.exports = mongoose.model("Folder", folderSchema);