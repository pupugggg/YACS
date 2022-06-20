const Error = require('../util/ErrorWithStatusCode')
const { Schema, model } = require('mongoose')
const { Types } = require('mongoose')
const { generateKey } = require('../service/keyGenerateService')
const roles = require('../config/roles')
const roomDetailSchema = new Schema({
    roomId: { required: true, type: String, unique: true },
    name: {
        required: true,
        type: String,
        default: function () {
            return this.roomId
        },
    },
    owner: { required: true, type: Types.ObjectId },
    roles: { type: Map, of: Number },
})
roomDetailSchema.static('joinRoom', async function (roomId,userId) {
    const room = await this.findOne({ roomId: roomId })
    if (!room) {
        throw new Error('Room not found',400)
    }
    if(!room.roles.get(userId)){
        room.roles.set(userId,roles.member)
        await room.save()
    }
    return room
})
const roomDetailModel = model('roomDetail', roomDetailSchema)
const roomSchema = new Schema({
    user: { required: true, type: Types.ObjectId },
    rooms: { required: true, type: [String], default: [] },
})
roomSchema.static('createRoom', async function (userId) {
    const uniqueRoomKey = generateKey()
    const roomDetail = await roomDetailModel.create({
        roomId: uniqueRoomKey,
        owner: userId,
        roles: new Map([[userId, roles.admin]]),
    })
    const rooms = await this.findOneAndUpdate(
        { user: userId },
        { $push: { rooms: uniqueRoomKey } },
        { new: true }
    )
    return rooms
})
roomSchema.static('getRooms', async function (userId) {
    const rooms = await this.findOne({ user: userId })
    return rooms
})
const roomModel = model('room', roomSchema)

module.exports = { roomModel, roomDetailModel }
