import express from 'express';
// import bodyParser from 'body-parser';
import { Server } from 'socket.io';
// import cors from 'cors';
// import  http from 'http';
const socketIdToName = {};
const nameToSocketId = {};

const app = express();
// const server = http.createServer(app);
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello from homepage.');
});


const io = new Server({cors:true});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('room-join', data => {
        console.log('a new user joined ' + data.name);
        socketIdToName[socket.id] = data.name;
        nameToSocketId[data.name] = socket.id;
        socket.join(data.roomId);
        io.to(socket.id).emit('room-join', data);   
        io.to(data.roomId).emit("user:joined", { name:data.name, id: socket.id });
    });
    // socket.on('offer', data => {
    //     console.log('offer received');
    //     const from = socketIdToName[socket.id];
    //     const to = nameToSocketId[data.name];
    //     socket.broadcast.to(to).emit('call-back', data.offer, from);
    // });
    // socket.on('answer', data => {
    //     console.log('answer received');
    //     const from = socketIdToName[socket.id];
    //     const to = nameToSocketId[data.name];
    //     socket.broadcast.to(to).emit('answer', data.answer);
    // });
    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });
    
      socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });
    
      socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

const main = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port: http://localhost:${PORT}`);
    });
    io.listen(3000);
    
}
main();