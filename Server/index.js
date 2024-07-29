const express = require('express');
const connectToMongo = require('./db')
var cors = require('cors');
const app = express();
const socket = require("socket.io");

app.use(express.json());
app.use(cors());
const httpServer = require('http').createServer(app);


const port = 5000;
require('dotenv').config();
app.use('/api/auth', require('./Routes/userRoutes'))
app.use('/api/message', require('./Routes/messagesRoute'))
app.use('/api/friend', require('./Routes/FriendsRoute'))

app.use('/api/request', require('./Routes/Request'))
// app.get('/',async(req, res)=>
// {
//     await res.send("Home page")
// })
const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
connectToMongo();
const io =  socket(server, {
  cors:{
    origin:"http://localhost:3000",
  
    Credential: true,

  },
  
});


global.onlineUsers = new Map();
console.log(global.onlineUsers , "s");
let x  = 1;

io.on("connection",(socket)=>{

  global.chatSocket = socket;
  socket.on("add-user", (userId)=>{
    console.log(userId +"s");
    onlineUsers.set(userId, socket.id);
  })
  socket.on("send-msg", (data)=>{
    
    const sendUserSocket = onlineUsers.get(data.to);
    
    if(sendUserSocket){
      
      
      socket.to(sendUserSocket).emit("msg-recieve",data.message,  data.length);
      socket.to(sendUserSocket).emit("new-message", {
        from: data.from,
        message: data.message,
      });
    }
  })
} )