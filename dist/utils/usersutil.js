"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCount = exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.checkUserNameExists = exports.addUser = void 0;
const users = [];
const userExists = (users, name) => {
    let status = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === name) {
            status = true;
            break;
        }
    }
    return status;
};
const addUser = ({ id, name, room }) => {
    name = name === null || name === void 0 ? void 0 : name.trim().toLowerCase();
    room = room === null || room === void 0 ? void 0 : room.trim().toLowerCase();
    const existingUser = userExists(users, name);
    if (existingUser) {
        return users.length;
    }
    else {
        const user = { id, name, room };
        users.push(user);
        const count = (0, exports.getUsersInRoom)(room).length;
        return count;
    }
};
exports.addUser = addUser;
const userExistsIndex = (users, id) => {
    let status = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            status = i;
            break;
        }
    }
    return status;
};
const checkUserNameExists = (name) => {
    let status = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === name) {
            status = true;
            break;
        }
    }
    return status;
};
exports.checkUserNameExists = checkUserNameExists;
const removeUser = (id) => {
    const index = userExistsIndex(users, id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
const getUser = (id) => users.find((user) => user.id === id);
exports.getUser = getUser;
const getUsersInRoom = (room) => users.filter((user) => user.room === room);
exports.getUsersInRoom = getUsersInRoom;
const userCount = () => users.length;
exports.userCount = userCount;
//# sourceMappingURL=usersutil.js.map