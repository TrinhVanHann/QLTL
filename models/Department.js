const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const folderSchema = new Schema({
    name: {type: String, unique: true},
    mgr_id: {type: String},
    employee_count: {type: Number},
});

module.exports = mongoose.model("Department", departmentSchema);