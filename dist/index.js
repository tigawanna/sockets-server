"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const usersutil_1 = require("./utils/usersutil");
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
        socket.on('join', ({ name, room }, callback) => {
            console.log("mf joinde===", name, room);
            const { error, user } = (0, usersutil_1.addUser)({ id: socket.id, name, room });
            socket.emit('message', { user: 'admin', text: `${user === null || user === void 0 ? void 0 : user.name},welcome to room ${user === null || user === void 0 ? void 0 : user.room}.` });
            socket.broadcast.to(user === null || user === void 0 ? void 0 : user.room).emit('message', { user: "admin", text: `${user === null || user === void 0 ? void 0 : user.name}, has joined` });
            socket.join(user === null || user === void 0 ? void 0 : user.room);
            io.to(user === null || user === void 0 ? void 0 : user.room).emit('room_data', {
                room: user === null || user === void 0 ? void 0 : user.room,
                users: (0, usersutil_1.userCount)()
            });
        });
        socket.on('new_message', (newMessage, callback) => {
            console.log("user embeded in socket ", newMessage, socket.id);
            const user = newMessage.user;
            io.to(user === null || user === void 0 ? void 0 : user.room).emit('new_message_added', { user: user === null || user === void 0 ? void 0 : user.name, newMessage });
            io.to(user === null || user === void 0 ? void 0 : user.room).emit('room_data', { room: user === null || user === void 0 ? void 0 : user.room, users: (0, usersutil_1.getUsersInRoom)(user === null || user === void 0 ? void 0 : user.room).length });
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
            (0, usersutil_1.removeUser)(socket.id);
        });
    });
    server.listen(PORT, () => {
        console.log(`listening on  http://localhost:${PORT}`);
    });
})().catch(e => console.log('error on server ====== ', e));
//# sourceMappingURL=index.js.map