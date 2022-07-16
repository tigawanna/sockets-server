"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors = require('cors');
const socketio = require('socket.io');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: ["my-custom-header"],
    }
});
(async () => {
    app.use(cors());
    app.options('*', cors());
    app.get('/', (req, res) => {
        res.send("hello");
    });
    io.on("connection", async (socket) => {
        socket.on("join_room", (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });
        socket.on("new_message", (data) => {
            console.log("data ==== ", data);
            io.emit("new_message_added", data);
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });
    io.on('disconnect', (socket) => {
        console.log("user disconnected === ", socket.id);
    });
    server.listen(PORT, () => {
        console.log(`listening on  http://localhost:${PORT}`);
    });
})().catch(e => console.log('error on server ====== ', e));
//# sourceMappingURL=index.js.map