const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
    comment: { type: String, require: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    replies: [
      {
        rId: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        from: { type: String },
        url: { type: String },
        replyAt: { type: String },
        comment: [String],
        created_At: { type: Date, default: Date.now() },
        replyed_At: { type: Date, default: Date.now() },
        likes: [String],
      },
    ],
    likes: [{ type: String }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
