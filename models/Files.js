const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const MongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const fileSchema = new Schema({
    _id: { type: String },
    name: { type: String },
    parent_id: { type: String, default: 'none' },
    type: { type: String },
    company_type: { type: String },
    size: { type: Number },
    owner: { type: String },
    owner_id: { type: String },
    documentType: { type: String }
}, {
    _id: false,
    timestamps: true
});
fileSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true })
module.exports = mongoose.model("File", fileSchema);