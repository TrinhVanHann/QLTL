const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema

mongoose.plugin(slug)

const departmentSchema = new Schema({
    name: {type: String, unique: true},
    mgr_id: {type: String, default: null},
    employee_count: {type: Number, default: 0},
});

module.exports = mongoose.model("Department", departmentSchema);