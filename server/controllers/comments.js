const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const postComment = await Comment.find({ postId })
      .populate({
        path: "userId postId",
        select: "-password",
      })
      .populate({
        path: "replies.userId",
        select: "-password",
      })
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "success",
      data: postComment,
    });
  } catch (error) {
    res.status(201).json({ message: "fail" });
  }
};

const likeApost = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const post = await Post.findById({ _id: id });
    if (post.likes.includes(String(userId))) {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    } else {
      post.likes.push(userId);
    }
    const newPost = await Post.findByIdAndUpdate(id, post);

    res.status(200).json({
      success: true,
      message: "successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(201).json({ message: "something went wrong" });
  }
};

const likeAcomment = async (req, res) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;
  try {
    if (rid === undefined || rid === null || rid === "false") {
      const comment = await Comment.findById(id);
      const index = comment.likes.findIndex((el) => el === String(userId));
      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((i) => i === String(userId));
      }

      const updated = await Comment.findByIdAndUpdate(id, comment, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Successfully",
        data: updated,
      });
    } else {
      const replyComment = await Comment.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );
      const index = replyComment?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );
      if (index === -1) {
        replyComment.replies[0].likes.push(userId);
      } else {
        replyComment.replies[0].likes = replyComment.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }
      const query = { _id: id, "replies._id": rid };
      const update = {
        $set: {
          "replies.$.likes": replyComment.replies[0].likes,
        },
      };
      const result = await Comment.findOneAndUpdate(query, update, {
        new: true,
      });
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(201).json({ message: "something went wrong" });
  }
};

const commentPost = async (req, res) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;
    if (comment === null) {
      res.status(404).json({ message: "comment is required" });
    }
    const newComment = new Comment({ comment, from, userId, postId: id });
    await newComment.save();
    const post = await Post.findById(id);
    post.comments.push(newComment._id);
    const UpdatePost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: UpdatePost,
    });
  } catch (error) {
    res.status(201).json("something went wrong");
  }
};

const replyPostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { comment, from, url } = req.body.data;
  const { id } = req.params;
  if (comment === null) {
    return res.status(201).json({ message: "Comment is Requires" });
  }
  try {
    const commentInfo = await Comment.findById(id);
    commentInfo.replies.push({
      comment,
      from,
      url,
      userId,
      created_At: Date.now(),
    });
    commentInfo.save();
    res.status(200).json({ data: commentInfo });
  } catch (error) {
    res.status(201).json({ message: "somthing went wrong" });
    return;
  }
};

module.exports = {
  getComments,
  likeApost,
  likeAcomment,
  commentPost,
  replyPostComment,
};
