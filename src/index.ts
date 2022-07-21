import express,{ Request,Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, checkUserNameExists,removeUser} from './utils/usersutil';
import { makeTimeStamp } from './utils/utils';

// const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser')





const app = express();

const PORT = process.env.PORT||4000
const server = createServer(app);
// const httpServer = createServer(app);
var jsonParser = bodyParser.json()
 // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

const io = new Server(server,{ 
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["my-custom-header"],

}
});

(async () => {

app.use(cors())
app.options('*', cors());

app.get('/', (req:Request, res:Response) => {
  res.send({ message: "We did it!" })
});

app.get('/me', (req:Request, res:Response) => {
  res.send({ message: "smoosh" })
});

app.post('/users',jsonParser,(req:Request, res:Response) => {

  const user = req.body?.user.username
  // //console.log("looking for ===== ",user)
 const userExists = checkUserNameExists(user)
 //console.log("looking for ===== ",user, userExists)
  res.send({data:userExists})
});



io.on("connection", async(socket) => {



//console.log(`Client ${socket.id} connected`);

   
  // Join a conversation
  const { room,user } = socket.handshake.query;
  const room_id = room as string
 const user_count =  addUser({id:socket.id,name:user,room})
  // //console.log("room  id / user==== ",room_id,user,user_count)
  socket.join(room_id);
  io.in(room_id).emit('room_data', {room,users:user_count});
  const join_room_message={message:`${user} joined`, time:makeTimeStamp(), user:"server" }
  io.in(room_id).emit('new_message_added', { user,newMessage:join_room_message});




socket.on('new_message', (newMessage) => {
 //console.log("new message ",newMessage,room_id)
 const user = newMessage.user
      //@ts-ignore
  io.in(room_id).emit('new_message_added', { user: user?.name,newMessage});

 })


 

socket.on("disconnect", () => {
    //console.log("User Disconnected new user count ====", socket.id,user_count);
    removeUser(socket.id)
    io.in(room_id).emit('room_data', {room: room_id,users:user_count - 1 });
    const join_room_message={message:`${user} left`, time:makeTimeStamp(), user:"server" }
    io.in(room_id).emit('new_message_added', { user,newMessage:join_room_message});
  });
});




server.listen(PORT, () => {
  console.log(`listening on  http://localhost:${PORT}`)
});

})().catch(e=> console.log('error on server ====== ',e)
)

