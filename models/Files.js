const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const MongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const fileSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    type: {type: String},
    size: {type: Number},
    owner: {type: String},
    updatedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    deleteAt: {type: Date, default: null},
    slug: { type: String, slug: "name", unique: true },
},{
    _id: false,
    timestamps: true
});
fileSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true })
module.exports = mongoose.model("File", fileSchema);