const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const fileSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    type: {type: String},
    size: {type: Number},
    updatedAt: [Date],
    createdAt: [Date],
    slug: { type: String, slug: "name", unique: true },
},{
    _id: false,
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);