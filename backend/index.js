'use strict'
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const app = express()
const httpServer = createServer(app)
const mongoose = require('mongoose')
async function main() {
    await mongoose.mongoose
      .connect('mongodb://docker:mongopw@localhost:49153')
      .then(() => console.log("💻 Mondodb Connected"))
      .catch(err => console.error(err));
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        },
    })
    app.use(express.urlencoded({extended:false}))
    app.use(express.json())
    app.use(cors())
    app.use(require('./routes/authRoute'))
    app.use(require('./routes/roomRoute'))
    const users = {};
    const socketToRoom = {};
    io.on('connection', (socket) => {
        console.log(socket.id, 'connected')
        socket.on("join room", roomID => {
            if (users[roomID]) {
                const length = users[roomID].length;
                if (length === 4) {
                    socket.emit("room full");
                    return;
                }
                users[roomID].push(socket.id);
            } else {
                users[roomID] = [socket.id];
            }
            socketToRoom[socket.id] = roomID;
            const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
    
            socket.emit("all users", usersInThisRoom);
        });
    
        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
        });
    
        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        });
    
        socket.on('disconnect', () => {
            const roomID = socketToRoom[socket.id];
            let room = users[roomID];
            if (room) {
                room = room.filter(id => id !== socket.id);
                users[roomID] = room;
            }
        });
    })
    io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    app.use(require('./middlewares/errorHandler'))
    const port = process.env.port || 5000
    httpServer.listen(port, () => {
        console.log(`server run on port ${port}`)
    })
}
main()