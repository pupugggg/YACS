'use strict'
require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { diff, patch } = require('jsondiffpatch')
const cors = require('cors')
const app = express()
const httpServer = createServer(app)
const mongoose = require('mongoose')
async function main() {
    await mongoose.mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('💻 Mondodb Connected'))
        .catch((err) => console.error(err))
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        },
    })
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors())
    app.use(require('./routes/authRoute'))
    app.use('/api/v1/room', require('./routes/roomRoute'))
    const rooms = {}
    const users = {}
    const documents = {}
    io.on('connection', (socket) => {
        socket.on('join', (room) => {
            socket.join(room)
            if (!rooms[room]) {
                rooms[room] = []
            }
            users[socket.id] = room
            rooms[room].push(socket.id)
            socket.emit(
                'callee-list',
                rooms[room].filter((element) => element !== socket.id)
            )
        })
        console.log(socket.id, 'connected')
        socket.on('video-offer', (data) => {
            socket
                .to(data.callee)
                .emit('video-offer', { caller: socket.id, offer: data.offer })
        })
        socket.on('video-answer', (data) => {
            socket.to(data.caller).emit('video-answer', {
                callee: socket.id,
                answer: data.answer,
            })
        })
        socket.on('new-ice-candidate', (data) => {
            socket.to(data.target).emit('new-ice-candidate', {
                source: data.source,
                candidate: data.candidate,
            })
        })
        socket.on('leave', () => {
            const roomName = users[socket.id]
            if (roomName && rooms[roomName]) {
                rooms[roomName] = rooms[roomName].filter(
                    (element) => element !== socket.id
                )
                io.to(roomName).emit('bye', socket.id)
                delete users[socket.id]
            }
        })
        socket.on('disconnect', (reason) => {
            console.log(socket.id, 'disconnect due to ', reason)
            const roomName = users[socket.id]
            if (roomName && rooms[roomName]) {
                rooms[roomName] = rooms[roomName].filter(
                    (element) => element !== socket.id
                )
                io.to(roomName).emit('bye', socket.id)
                delete users[socket.id]
            }
        })
    })
    io.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
    })
    if (
        process.env.environment !== 'development' ||
        process.env.environment == 'production'
    ) {
        const root = require('path').join(__dirname, 'build')
        app.use(express.static(root))
        app.get('*', (req, res) => {
            res.sendFile('index.html', { root })
        })
    }
    app.use(require('./middlewares/errorHandler'))
    const port = process.env.port || 5000
    httpServer.listen(port, () => {
        console.log(`server run on port ${port}`)
    })
}
main()
