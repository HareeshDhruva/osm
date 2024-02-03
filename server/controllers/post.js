require('dotenv').config();
const Post = require("../models/postModel");
const cloudinary = require('cloudinary');

const createPost = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { description, image } = req.body.data;
    if (!image) {
      return res.status(201).json("image must!");
    }
    const post = await Post.create({
      userId,
      description,
      image,
    });
    res.status(200).json({ data: post });
  } catch (error) {
    res.status(201).json({ message: "failed in post" });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate({
      path: 'userId',
      select: '-password',
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: '-password',
      },
    })
    .sort({ _id: -1 });
    res.status(200).json({
      data: posts,
      success: true,
      message: "successfuuly",
    });
  } catch (error) {
    res.status(201).json({ message: "something went wrong" });
  }
};

const getuserPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userpost = await Post.find({ userId: id })
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      message: "successfully",
      success: true,
      data: userpost,
    });
  } catch (error) {
    res.status(201).json({ message: "Post not yet !" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body.user;

  try {
    const postfound = await Post.findById({ _id: id });
    if (postfound) {
      if (postfound.userId.toString() === userId) {
        const result = await Post.findByIdAndDelete({ _id: id });
        if (result) {
            cloudinary.v2.api.delete_resources(postfound.image.public_id).then(()=>{
            return res.status(200).json({ message: "Delete SuccessFully"});
          });
        }
      } else {
        res.status(201).json({ message: "Not actual user" });
      }
    } else {
      res.status(201).json({ message: "Post already deleted" });
    }
  } catch (error) {
    res.status(201).json({ message: "Somthing  went wrong" });
  }
};

module.exports = { createPost, getuserPost, deletePost, getPost };
