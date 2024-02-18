const dotenv = require("dotenv");
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const connection = require("./config");
const http = require('http');
const {Server} = require('socket.io');
const Radis = require("ioredis");

const {
  login,
  register,
  resetPasswordRequest,
  passwordChange,
  verifiedpasswordChange,
  logout,
  getMessage
} = require("./controllers/authController");
const router = require("./routes/auth");
const path = require("path");
const {
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
} = require("./controllers/users");
const userAuth = require("./middleware");
const {
  getPost,
  createPost,
  getuserPost,
  deletePost,
} = require("./controllers/post");
const {
  getComments,
  likeApost,
  likeAcomment,
  commentPost,
  replyPostComment,
} = require("./controllers/comments");
const Smg = require("./models/messageModel");

dotenv.config();
const URL = process.env.MONGO_URL;
const app = express();
const message = express();
const server = http.createServer(message);
connection(URL);

app.use(router);
app.use(bodyparser.json({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND,
    credentials: true,
  })
);

app.post("/register", register);
app.post("/login", login);

app.get("/user/verify", router);
app.get("/user/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.post("/user/password-reset-request", resetPasswordRequest);
app.get("/user/password-reset", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/passwordReset.html"));
});

app.post("/user/verified-password-change", verifiedpasswordChange);
app.post("/user/password-change", passwordChange);

app.post("/updateUser", userAuth, updateUser);
app.post("/updateProfilePhoto", userAuth, updateProfilePhoto);
app.post("/getuser/:id?", userAuth, getUser);
app.post("/sendFriendRequest", userAuth, sendfriendRequest);
app.post("/getFriendRequest", userAuth, getfriendRequest);
app.post("/acceptFriendRequest", userAuth, acceptfriendRequest);
app.post("/profileView", userAuth, profileView); //not
app.post("/suggested", userAuth, suggested);
app.post("/searchUser", searchUser);
app.post("/deleteFriend",userAuth,removeFriend);

app.get("/", getPost);
app.post("/create-post", userAuth, createPost);
app.post("/get-user-post/:id", userAuth, getuserPost);
app.post("/delete-post/:id", userAuth, deletePost);

app.get("/comment/:postId", getComments);
app.post("/like/:id", userAuth, likeApost);
app.post("/like-comment/:id/:rid?", userAuth, likeAcomment);
app.post("/comment-post/:id", userAuth, commentPost);
app.post("/reply-comment/:id", userAuth, replyPostComment);
app.post("/message",userAuth,getMessage);

app.post("/logout", logout); //not
app.listen(process.env.PORT, () => {
  console.log(`server started`);
});

const io = new Server(server,{
  cors:{
    origin: process.env.FRONTEND,
    credentials: true,
    methods:["GET","POST"],
  }
});

const pub = new Radis({
  host:"redis-19740.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  port:19740,
  username:"default",
  password:"N52PlntqaCqcg5KGYdUcoVY7RUZLmDHn"
});

const sub = new Radis({
  host:"redis-19740.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  port:19740,
  username:"default",
  password:"N52PlntqaCqcg5KGYdUcoVY7RUZLmDHn"
});

io.on("connection",(socket)=>{
    sub.subscribe("MESSAGES");
    socket.on("join_room",(data)=>{
        socket.join(data);
    });
    socket.on("send_message",async (data)=>{
      await pub.publish("MESSAGES",JSON.stringify(data));
      socket.to(data.receiver).emit("receive_message",data);
    })
    socket.on("disconnect",()=>{
      return true
    });
  })
  
  sub.on('message',async(channel,data)=>{
    if(channel === 'MESSAGES'){
      const new_data = JSON.parse(data);
      const newMessage = await Smg.create(new_data);
      await newMessage.save();
    }
  })

server.listen(process.env.PORTN,()=>{
  console.log(`chat server started on the port`)
})