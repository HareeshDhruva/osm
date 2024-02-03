require('dotenv').config();
const User = require("../models/userModels");
const FriendRequest = require("../models/requestSchema");
const cloudinary = require('cloudinary');

const getUser = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.params;
  const user = await User.findById(id ?? userId).populate({
    path: "friends",
    select: "-password",
  });

  if (user) {
    res.status(200).json({ data: user });
  } else {
    res.status(201).json({ message: "users not found" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.body.user;
  const { data } = req.body;

  const filteredUser = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== "")
  );
  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    filteredUser
  );

  if (updatedUser) {
    res.status(200).json({ data: updatedUser });
  } else {
    res.status(201).json({ message: "users update fail" });
  }
};

const updateProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: "Provide all Fields" });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deleteCloudinary = cloudinary.v2.api.delete_resources(user.profileUrl.public_id);
    user.profileUrl = data;
    const saveUser = user.save();
    await Promise.all([deleteCloudinary, saveUser]);
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendfriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestId } = req.body.data;

    const existRequest = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo: requestId,
    });

    if (existRequest) {
      res.status(201).json({ message: "You Have Alredy Sent Request" ,data:existRequest.status});
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestId,
      requestTo: userId,
    });

    if (accountExist) {
      res.status(201).json({ message: "You Have Alredy Received Request",data:accountExist.status });
      return;
    }

    const newRequest = await FriendRequest.create({
      requestFrom: userId,
      requestTo: requestId,
    });
    newRequest.save();
    res.status(200).json({ success: true, message: newRequest });
  } catch (error) {
    console.log(error);
  }
};

const getfriendRequest = async (req, res) => {
  const { userId } = req.body.user;
  try {
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "-password",
      })
      .limit(10)
      .sort({ _id: -1 });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(201).json({ message: "Not Exist" });
  }
};

const acceptfriendRequest = async (req, res) => {
  const id = req.body.user.userId;
  const { rid, requestStatus } = req.body.data;
  const status = requestStatus;
  const exist = await FriendRequest.findById(rid);
  if (!exist) {
    return res.status(201).json({ message: "No Friend requset found" });
  }
  try {
    const newExist = await FriendRequest.findByIdAndUpdate(
      { _id: rid, requestStatus: status },
      { requestStatus: "Accepted" },
      { new: true }
    );

    if (newExist && newExist.requestStatus === "Accepted") {
      const admin = await User.findById(id);
      const friendId = newExist.requestFrom;

      if (!admin.friends.includes(friendId)) {
        admin.friends.push(friendId);
        await admin.save();
      }

      const friend = await User.findById(friendId);
      if (!friend.friends.includes(id)) {
        friend.friends.push(id);
        await friend.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(201).json({
      success: false,
      message: "An error occurred",
    });
  }
};

const profileView = async (req, res) => {
  const { userId } = req.body.user;
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    user.views.push(userId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "successfully viewd",
    });
  } catch (error) {
    res.status(201).json({ success: false, message: "failed" });
  }
};

const suggested = async (req, res) => {
  const { userId } = req.body.user;
  try {
    let queryObject = {};
    queryObject._id = { $ne: userId };
    queryObject.friends = { $nin: userId };
    queryObject.verified = true;
    let QueryResult = await User.find(queryObject)
      .limit(15)
      .select("-password");
    const suggestedFriends = QueryResult;
    res.status(200).json({ data: suggestedFriends, success: true });
  } catch (error) {
    res.status(201).json({ success: false, message: "failed" });
  }
};

const searchUser = async (req, res) => {
  try {
    const { search } = req.body;
    const posts = await User.find({
      firstname: { $regex: search, $options: "i" },
    });
    res.status(200).json({
      data: posts,
      success: true,
      message: "successfully",
    });
  } catch (error) {
    res.status(201).json({ message: "fail in get post" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const userId = req.body.user.userId;
    const friendIdToRemove = req.body.data;
    await FriendRequest.findOneAndDelete({requestTo:friendIdToRemove,requestFrom:userId});
    const currentUser = await User.findById(userId);
    const friendIndex = currentUser.friends.indexOf(friendIdToRemove);
    if (friendIndex !== -1) {
      currentUser.friends.splice(friendIndex, 1);
      await currentUser.save();
      const friendUser = await User.findById(friendIdToRemove);
      const currentUserIndexInFriend = friendUser.friends.indexOf(userId);
      if (currentUserIndexInFriend !== -1) {
        friendUser.friends.splice(currentUserIndexInFriend, 1);
        await friendUser.save();
        return res.status(200).json({ message: "Friend removed successfully" });
      } else {
        return res.status(404).json({ message: "User not found in friend's friend list" });
      }
    } else {
      return res.status(404).json({ message: "Friend not found in user's friend list" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getUser,
  sendfriendRequest,
  getfriendRequest,
  acceptfriendRequest,
  profileView,
  suggested,
  updateUser,
  updateProfilePhoto,
  searchUser,
  removeFriend,
};
