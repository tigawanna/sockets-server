import express,{ Request,Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, removeUser} from './utils/usersutil';
// const express = require('express');

const cors = require('cors');






const app = express();

const PORT = process.env.PORT||4000
const server = createServer(app);
// const httpServer = createServer(app);

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
  res.send("hello");
});




io.on("connection", async(socket) => {



console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { room,user } = socket.handshake.query;
  const room_id = room as string

 
  const user_count =  addUser({id:socket.id,name:user,room})
  // console.log("room  id / user==== ",room_id,user,user_count)
  socket.join(room_id);
  io.in(room_id).emit('room_data', {room,users:user_count});




socket.on('new_message', (newMessage) => {
 console.log("user embeded in socket ",newMessage,socket.id)
 const user = newMessage.user
      //@ts-ignore
  io.in(room_id).emit('new_message_added', { user: user?.name,newMessage});

 })


 

socket.on("disconnect", () => {
    console.log("User Disconnected new user count ====", socket.id,user_count);
    removeUser(socket.id)
    io.in(room_id).emit('room_data', {room: room_id,users:user_count - 1 });
  });
});




server.listen(PORT, () => {
  console.log(`listening on  http://localhost:${PORT}`)
});

})().catch(e=> console.log('error on server ====== ',e))

