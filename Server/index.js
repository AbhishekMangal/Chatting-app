const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const { timeStamp, time } = require('console');

const app = express();
app.use(express.json({limit: '50mb'}));
// const ori = ["https://chatting-app-11.onrender.com", "http://localhost:3000"];
const ori = "https://chatting-app-11.onrender.com";

app.use(cors({
  // origin : "https://chatting-app-11.onrender.com",
  origin: ori,
  methods: ["GET", "POST"],
  credentials: true
}));

const httpServer = http.createServer(app);

require('dotenv').config();

app.use('/api/auth', require('./Routes/userRoutes'));
app.use('/api/message', require('./Routes/messagesRoute'));
app.use('/api/friend', require('./Routes/FriendsRoute'));
app.use('/api/request', require('./Routes/Request'));

const port = process.env.PORT || 5000;
const server = httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const userName = process.env.Name;
const password = process.env.password;

connectToMongo(userName, password);

const io = new Server(server, {
  cors: {
   
    origin: ori,
    methods: ["GET", "POST"],
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.emit("current-online-users", Array.from((new Map).keys()));
  socket.on("add-user", (userId) => {

    onlineUsers.set(userId, socket.id);


    io.emit("user-online", { userId });
    
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user-offline", { userId }); // Notify all clients about the offline status
      }
    });
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      
      socket.to(sendUserSocket).emit("msg-recieve", { message: data.message, from: data.from });
      socket.to(sendUserSocket).emit("new-message", { from: data.from, message: data.message });
    }
  });




  socket.on("seen",({messageId, from})=>{
  {
    const sendUserSocket = onlineUsers.get(from)
    if(sendUserSocket)
    {
      socket.to(sendUserSocket).emit("seen", {messageId})
    }
  }
})
});
