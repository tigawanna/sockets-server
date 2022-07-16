import express,{ Request,Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
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



  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("new_message", (data) => {
    console.log("data ==== ",data)
    io.emit("new_message_added", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


io.on('disconnect', (socket) => {
    console.log("user disconnected === ",socket.id)
    // socket.on("new-operations", function(data) {
    //     io.emit("new-remote-operations", data);
    //   });
});

server.listen(PORT, () => {
  console.log(`listening on  http://localhost:${PORT}`)
});

})().catch(e=> console.log('error on server ====== ',e))

