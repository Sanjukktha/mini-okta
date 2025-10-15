const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  provider: { type: String, default: "local" },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: String
});

module.exports = mongoose.model("User", userSchema);
