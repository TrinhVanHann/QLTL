const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  folder_id: {type: String }
});

module.exports = mongoose.model("user", userSchema);