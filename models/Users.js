const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  active: { type: Boolean }
});

module.exports = mongoose.model("user", userSchema);