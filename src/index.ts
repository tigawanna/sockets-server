import express,{ Request,Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, getUsersInRoom, getUser, removeUser, userCount } from './utils/usersutil';
// const express = require('express');

const cors = require('cors');
const socketio = require('socket.io')





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
  const { roomId,user } = socket.handshake.query;
  const room_id = roomId as string

 
  const user_count =  addUser({id:socket.id,name:user,room:roomId})
  console.log("room  id / user==== ",room_id,user,user_count)
  socket.join(room_id);
  io.in(room_id).emit('room_data', {room: room_id,users:user_count});


  // Listen for new messages
  // socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
  //   io.in(room_id).emit(NEW_CHAT_MESSAGE_EVENT, data);
  // });

socket.on('new_message', (newMessage) => {
 console.log("user embeded in socket ",newMessage,socket.id)
 const user = newMessage.user
      //@ts-ignore
  io.to(room_id).emit('new_message_added', { user: user?.name,newMessage});

 
  })


 
// socket.on('join', ({ name}) => {
// const { roomId } = socket.handshake.query;
//   const room= roomId as string

//     const { error, user } = addUser(
//       { id: socket.id, name, room });

//     // if (error) return callback(error);

//     // Emit will send message to the user
//     // who had joined
//     socket.emit('message', { user: 'admin', text:`${user?.name},welcome to room ${user?.room}.`});

//     // Broadcast will send message to everyone
//     // in the room except the joined user
//     socket.broadcast.to(user?.room).emit('message', { user: "admin",text: `${user?.name}, has joined`});

//     socket.join(user?.room);
//     // console.log("room",user?.room)
//     io.to(user?.room).emit('room_data', {
//         room: room,
//         users: userCount()
//     });

 
// }
// )


  // socket.on("join_room", (data) => {
  //   socket.join(data);
  //   console.log(`User with ID: ${socket.id} joined room: ${data}`);
  // });

  // socket.on("new_message", (data) => {
  //   console.log("data ==== ",data)
  //   io.emit("new_message_added", data);
  // });

//   socket.on('new_message', (newMessage, callback) => {
//   console.log("user embeded in socket ",newMessage,socket.id)
//     const user = newMessage.user
//     //@ts-ignore
//     io.to(user?.room).emit('new_message_added', { user: user?.name,newMessage});
//    //@ts-ignore
//     io.to(user?.room).emit('room_data', { room: user?.room,users: getUsersInRoom(user?.room).length });
//     // callback();
// })



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

