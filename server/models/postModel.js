const mongoose = require("mongoose");

const posrSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    description: { type: String },
    image: { type: Object },
    likes: [String],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", posrSchema);
module.exports = Post;
