const mongoose = require("mongoose");
const Schema = mongoose.Schema

const folderSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    folder_childs: [String],
    file_childs: [String],
    updatedAt: [Date],
    createdAt: [Date]
},{
    _id: false,
    timestamps: true
});

module.exports = mongoose.model("Folder", folderSchema);