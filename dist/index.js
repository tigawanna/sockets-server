"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const usersutil_1 = require("./utils/usersutil");
const utils_1 = require("./utils/utils");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const server = (0, http_1.createServer)(app);
var jsonParser = bodyParser.json();
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
        res.send({ message: "We did it!" });
    });
    app.get('/me', (req, res) => {
        res.send({ message: "smoosh" });
    });
    app.post('/users', jsonParser, (req, res) => {
        var _a;
        const user = (_a = req.body) === null || _a === void 0 ? void 0 : _a.user.username;
        const userExists = (0, usersutil_1.checkUserNameExists)(user);
        res.send({ data: userExists });
    });
    io.on("connection", async (socket) => {
        const { room, user } = socket.handshake.query;
        const room_id = room;
        const user_count = (0, usersutil_1.addUser)({ id: socket.id, name: user, room });
        socket.join(room_id);
        io.in(room_id).emit('room_data', { room, users: user_count });
        const join_room_message = { message: `${user} joined`, time: (0, utils_1.makeTimeStamp)(), user: "server" };
        io.in(room_id).emit('new_message_added', { user, newMessage: join_room_message });
        socket.on('new_message', (newMessage) => {
            const user = newMessage.user;
            io.in(room_id).emit('new_message_added', { user: user === null || user === void 0 ? void 0 : user.name, newMessage });
        });
        socket.on("disconnect", () => {
            (0, usersutil_1.removeUser)(socket.id);
            io.in(room_id).emit('room_data', { room: room_id, users: user_count - 1 });
            const join_room_message = { message: `${user} left`, time: (0, utils_1.makeTimeStamp)(), user: "server" };
            io.in(room_id).emit('new_message_added', { user, newMessage: join_room_message });
        });
    });
    server.listen(PORT, () => {
        console.log(`listening on  http://localhost:${PORT}`);
    });
})().catch(e => console.log('error on server ====== ', e));
//# sourceMappingURL=index.js.map