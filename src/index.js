const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io')



const app = express();

const PORT =process.env.PORT||4000
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: ["my-custom-header"],
 
    }
});


app.use(cors())
app.options('*', cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

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
