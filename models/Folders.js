const mongoose = require("mongoose");
const MongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const folderSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    folder_childs: [String],
    file_childs: [String],
    owner: {type: String},
    owner_id: {type: String},
    updatedAt: {type:Date, default: Date.now},
    createdAt: {type:Date, default: Date.now},
    deleteAt: {type:Date, default: null},
},{
    _id: false,
    timestamps: true
});

folderSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true })
module.exports = mongoose.model("Folder", folderSchema);