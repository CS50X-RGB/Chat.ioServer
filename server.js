import express from 'express';
const app = express();
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import connectDb from './data/database1.js';
import { config } from 'dotenv';
const server = http.createServer(app);
import UserRouter from './Router/user.js';
import cookieParser from 'cookie-parser';
//MiddleWare
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST","DELETE","PUT"],
        credentials: true,
    }
});

const Router = express.Router();
app.use('/api/v1.1/users',UserRouter);

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);
    
    socket.on("send_message", (data) => {
        // Emit the message to the specific room
        const messageData = {
            message : data.message,
            sender :  true,
        }
        io.to(data.room).emit("r-m", messageData);
    });
    socket.on('leave_room',(room)=>{
        socket.leave(room);
    })
    socket.on('join_room', (room) => {
        socket.join(room);
    });
});

config({
    path: "./data/config.env",
})
// app.get('/',(req,res)=>{
        // res.send('<h2>ROHAN CHAT .io</h2>');
// })
server.listen(process.env.PORT, () => {
    console.log(`Listening to ${process.env.PORT}`);
});
connectDb();