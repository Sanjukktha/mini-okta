const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "local" },
  token: { type: String },
});

module.exports = mongoose.model("User", userSchema);
