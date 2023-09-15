import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDb from "./data/database1.js";
import { config } from "dotenv";
import UserRouter from "./Router/user.js";
import ChatRouter from "./Router/message.js";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://650496fae988620469e70ca8--relaxed-sprite-032bb8.netlify.app", 
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "https://650496fae988620469e70ca8--relaxed-sprite-032bb8.netlify.app", 
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1.1/users", UserRouter);
app.use("/api/v1.1/chat", ChatRouter);

const recivers = [];

// Socket.io
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("user message", data.message, "room number", data.room);
    const messageData = {
      message: data.message,
      sender: true,
      senderName: data.sender,
    };
    io.to(data.room).emit("r-m", messageData);
  });

  socket.on("leave_room", (room) => {
    console.log(`User leaving room: ${room}`);
    socket.leave(room);
  });

  socket.on("join_room", (room) => {
    console.log(`User id is ${socket.id}`);
    console.log(`User joining room: ${room}`);
    // Emit receiver_user_id event with the socket id
    socket.emit("receiver_user_id", { receiverUserId: socket.id });
    socket.join(room);
  });
});

// Configuration
config({
  path: "./data/config.env",
});

// Default route
app.get("/", (req, res) => {
  res.send("<h2>ROHAN CHAT .io</h2>");
});

// Start the server
server.listen(3001, () => {
  console.log(`Listening to 3001`);
});

// Connect to the database
connectDb();
