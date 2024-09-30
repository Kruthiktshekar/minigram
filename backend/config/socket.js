import {Server} from 'socket.io'


const configScoket = () => {


let io = new Server(3232, {
    cors: {
      origin: "http://localhost:3000",
    },
    connectionStateRecovery: {}
  });
  const userSocketMap = new Map();
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("add-user", (userId) => {
        console.log(userId, socket.id, 'jjjj')
        userSocketMap.set(userId, socket.id)
    });

    socket.on("send-msgs" , (data) =>{
        console.log(data,'from socket')
        const recipientSocketId = userSocketMap.get(data.to);
        console.log(recipientSocketId)
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receive-msg", data);
        } else {
            console.log("User is not connected");
        }
    })
  
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

export default configScoket