const mongoose = require("mongoose");
const Schema = mongoose.Schema

const fileSchema = new Schema({
    _id: {type: String},
    name: {type: String },
    parent_id: {type: String, default: 'none'},
    type: {type: String},
    size: {type: Number} 
},{
    _id: false
});

module.exports = mongoose.model("File", fileSchema);