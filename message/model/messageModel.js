const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender_name: String,
    profile: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: String,
    time: String,
  },
  {
    timestamps: true,
  }
);

const Smg = mongoose.model("message", messageSchema);
module.exports = Smg;
