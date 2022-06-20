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
        socket.on('join', (room) => {
            socket.join(room)
            socket.emit('joined', room, socket.id)
        })
        socket.on('leave', (room) => {
            socket.leave(room)
            socket.to(room).emit('bye', room, socket.id)
            socket.emit('leave', room, socket.id)
        })
    })

    app.use(require('./middlewares/errorHandler'))
    const port = process.env.port || 5000
    httpServer.listen(port, () => {
        console.log(`server run on port ${port}`)
    })
}
main()