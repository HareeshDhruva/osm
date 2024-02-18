const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    gender: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    location: {
      default: null,
      type: String,
    },
    profileUrl: {
      default: null,
      type: Object,
    },
    profession: {
      default: null,
      type: String,
    },
    views: [String],
    verified: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
