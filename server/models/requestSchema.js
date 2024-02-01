const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    requestTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    requestFrom: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    requestStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("friendRequest", requestSchema);
module.exports = FriendRequest;
