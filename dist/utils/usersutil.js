"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user) => {
        user.room === room && user.name === name;
    });
    if (existingUser) {
        return { error: "Username is taken" };
    }
    const user = { id, name, room };
    users.push(user);
    return { user };
};
exports.addUser = addUser;
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        user.id === id;
    });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
const getUser = (id) => users
    .find((user) => user.id === id);
exports.getUser = getUser;
const getUsersInRoom = (room) => users
    .filter((user) => user.room === room);
exports.getUsersInRoom = getUsersInRoom;
//# sourceMappingURL=usersutil.js.map