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
        console.log(`Client ${socket.id} connected`);
        const { roomId, user } = socket.handshake.query;
        const room_id = roomId;
        const user_count = (0, usersutil_1.addUser)({ id: socket.id, name: user, room: roomId });
        console.log("room  id / user==== ", room_id, user, user_count);
        socket.join(room_id);
        io.in(room_id).emit('room_data', { room: room_id, users: user_count });
        socket.on('new_message', (newMessage) => {
            console.log("user embeded in socket ", newMessage, socket.id);
            const user = newMessage.user;
            io.to(room_id).emit('new_message_added', { user: user === null || user === void 0 ? void 0 : user.name, newMessage });
            io.to(room_id).emit('room_data', { room: room_id, users: (0, usersutil_1.getUsersInRoom)(room_id).length });
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