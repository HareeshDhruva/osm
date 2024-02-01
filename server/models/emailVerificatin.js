const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: String,
    token: String,
    created_At: Date,
    expires_At: Date,
  },
  { timestamps: true }
);

const Verification = mongoose.model(
  "emailVarification",
  emailVerificationSchema
);

module.exports = Verification;
