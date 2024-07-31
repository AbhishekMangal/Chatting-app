const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors(
  {
  origin: "https://chatting-app-11.onrender.com",
  methods: ["GET", "POST"],
  credentials: true,
}
));

const httpServer = http.createServer(app);

require('dotenv').config();

app.use('/api/auth', require('./Routes/userRoutes'));
app.use('/api/message', require('./Routes/messagesRoute'));
app.use('/api/friend', require('./Routes/FriendsRoute'));
app.use('/api/request', require('./Routes/Request'));

const port = process.env.PORT || 5000;
const server = httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const userName = process.env.Name
const password = process.env.password


connectToMongo(userName, password);
const io = new Server(server, {
  cors: {
    origin: "https://chatting-app-11.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {

  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", 
        {message :data.message,
          from: data.from
    });
      socket.to(sendUserSocket).emit("new-message", {
        from: data.from,
        message: data.message,
      });
    }
  });
});
