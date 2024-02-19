const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require('socket.io');
const Redis = require("ioredis");
const Message = require("./model/messageModel");

dotenv.config();
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL;
const REDIS_URL = process.env.REDIS;
const FRONTEND_URL = process.env.FRONTEND;

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: FRONTEND_URL
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL).then(() => {
  console.log("MongoDB connected");
}).catch(err => console.error(err));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  }
});

const pub = new Redis(REDIS_URL);
const sub = new Redis(REDIS_URL);

app.get('/', (req, res) => {
  res.send("osm redis server");
});

io.on("connection", (socket) => {
  sub.subscribe("MESSAGES");
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    await pub.publish("MESSAGES", JSON.stringify(data));
    socket.to(data.receiver).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // Clean up resources if needed
  });
});

sub.on('message', async (channel, data) => {
  if (channel === 'MESSAGES') {
    try {
      const new_data = JSON.parse(data);
      const newMessage = await Message.create(new_data);
      await newMessage.save();
    } catch (error) {
      console.error(error);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Chat server started`);
});
