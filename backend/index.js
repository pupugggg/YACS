'use strict'
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {  cors: {
    origin: "http://localhost:3000"
  }});

app.use(cors())
io.on("connection", (socket) => {
    console.log(socket.id, 'connected')

    socket.on('message', (room, data) => {
      io.in(room).emit('message', room, data)
    })
  
    socket.on('join', (room) => {
      socket.join(room)
      socket.emit('joined', room, socket.id)
    })
  
    socket.on('leave', (room) => {
      socket.leave(room)
      socket.to(room).emit('bye', room, socket.id)
      socket.emit('leave', room, socket.id)
    })
});

app.use(require('./middlewares/errorHandler'))
const port = process.env.port || 5000
httpServer.listen(port,()=>{console.log(`server run on port ${port}`)});