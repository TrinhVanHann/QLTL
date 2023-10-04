const mongoose = require("mongoose");
const Schema = mongoose.Schema

const fileSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    type: {type: String},
    size: {type: Number},
    updatedAt: [Date],
    createdAt: [Date]
},{
    _id: false,
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);