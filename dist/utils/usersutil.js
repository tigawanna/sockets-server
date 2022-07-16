"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCount = exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
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
    console.log("all users === ", users);
    console.log("user to add ==== ", name);
    const existingUser = userExists(users, name);
    console.log("existing user HH++++ ====", existingUser);
    if (existingUser) {
        console.log("existing user");
        return { error: "Username is taken" };
    }
    else {
        const user = { id, name, room };
        console.log("adding user === ", user);
        users.push(user);
        return { user };
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
const removeUser = (id) => {
    const index = userExistsIndex(users, id);
    console.log(index);
    if (index !== -1) {
        console.log("user ", users[index].name, "disconected , removing them");
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