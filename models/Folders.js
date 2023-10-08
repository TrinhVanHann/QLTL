const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const folderSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    folder_childs: [String],
    file_childs: [String],
    slug: { type: String, slug: "name", unique: true },
    updatedAt: [Date],
    createdAt: [Date],
},{
    _id: false,
    timestamps: true
});

module.exports = mongoose.model("Folder", folderSchema);