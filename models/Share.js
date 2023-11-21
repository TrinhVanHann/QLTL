const mongoose = require("mongoose");
const MongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const shareSchema = new Schema({
    document_id: {type: String},
    shared_object: {type: String},
    permissions: [String],
    shareAt: {type: Date},
    type_object: {type: String}
},{
    timestamps: true
});

module.exports = mongoose.model("Share", shareSchema);