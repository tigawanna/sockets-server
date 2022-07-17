interface User{
 id:string
 name:string
 room:string   
}
const users:User[] = [];

const userExists=(users:User[],name:string)=>{
let status = false    
for(let i = 0;i<users.length;i++){
    if(users[i].name===name){
    status = true;
    break
    }
}
return status;
}

console.log("all users in list=== ",users)

export const addUser = ({id, name, room}) => {
    name = name?.trim().toLowerCase();
    room = room?.trim().toLowerCase();
    
  
    console.log("user to add ==== ",name)

   const existingUser = userExists(users,name)
    console.log("existing user????====",existingUser)
    if(existingUser) {
    console.log("existing user")
    return users.length;
    }else{
    const user = {id,name,room};
    console.log("adding user === ",user)
    users.push(user);
    console.log("all users === ",users)
    const count = getUsersInRoom(room).length
    return count
    }
  
 
}
const userExistsIndex=(users:User[],id:string)=>{
    let status = -1   
    for(let i = 0;i<users.length;i++){
        if(users[i].id === id){
        status = i;
        break
        }
    }
    return status;
    }

export const removeUser = (id:string) => {
    // const index = users.findIndex((user) => {
    //     user.id === id
    // });
    const index = userExistsIndex(users,id)
    console.log(index)
    if(index !== -1) {
    console.log("user ",users[index].name ,"disconected , removing them")
    return users.splice(index,1)[0];
    }
    
}


export const getUser = (id:string) => users .find((user) => user.id === id);
 
export const getUsersInRoom = (room:string) => users.filter((user) => user.room === room);

export const userCount =()=>users.length
