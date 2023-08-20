import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDb from './data/database1.js';
import { config } from 'dotenv';
import UserRouter from './Router/user.js'
import cookieParser from 'cookie-parser';



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Change this to your client's origin
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  },
});
app.use(cors({
    origin: 'http://localhost:3000', // Set the allowed origin
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }));
;


// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1.1/users', UserRouter);

// Socket.io
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  
  socket.on('send_message', (data) => {
    // Emit the message to the specific room
    const messageData = {
      message: data.message,
      sender: true,
    };
    io.to(data.room).emit('r-m', messageData);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  socket.on('join_room', (room) => {
    socket.join(room);
  });
});

// Configuration
config({
  path: './data/config.env',
});

// Default route
app.get('/', (req, res) => {
  res.send('<h2>ROHAN CHAT .io</h2>');
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Listening to ${process.env.PORT}`);
});

// Connect to the database
connectDb();
