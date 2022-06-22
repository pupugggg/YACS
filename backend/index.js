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
    io.on('connection', (socket) => {
        console.log(socket.id, 'connected')
        socket.on('join room',(room)=>{
            socket.join(room)
            const userInRoom = io.sockets.adapter.rooms.get(room)
            console.log('current room',userInRoom)
            socket.emit('users',[...userInRoom].filter(e=>e!==socket.id))
        })
        socket.on("disconnect", (reason) => {
            console.log(socket.id,'disconnect due to ',reason)
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