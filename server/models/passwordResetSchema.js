const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  email: { type: String, unique: true },
  token: { type: String },
  created_At: Date,
  expires_At: Date,
});

const PasswordReset = mongoose.model("passwordReset", passwordResetSchema);

module.exports = PasswordReset;
