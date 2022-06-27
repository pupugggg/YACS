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
roomDetailSchema.static('joinRoom', async function (userId,roomId) {
    const room = await this.findOne({ roomId: roomId })
    if (!room) {
        throw new Error('Room not found', 400)
    }
    if (!room.roles.get(userId)) {
        room.roles.set(userId, roles.member)
        await room.save()
    }
    return room
})
const roomDetailModel = model('roomDetail', roomDetailSchema)
const roomSchema = new Schema({
    user: { required: true, type: Types.ObjectId },
    rooms: { required: true, type: [Types.ObjectId], default: [],ref:'roomDetail'},
})
roomSchema.static('createRoom', async function (userId,name) {
    const uniqueRoomKey = generateKey()
    const roomDetail = await roomDetailModel.create({
        roomId: uniqueRoomKey,
        owner: userId,
        name:name?name:uniqueRoomKey,
        roles: new Map([[userId, roles.admin]]),
    })
    const rooms = await this.findOneAndUpdate(
        { user: userId },
        { $push: { rooms: roomDetail._id } },
        { new: true }
    ).populate('rooms')
    return rooms
})
roomSchema.static('getRooms', async function (userId) {
    const rooms = await this.findOne({ user: userId }).populate('rooms')
    return rooms
})
roomSchema.static('joinRoom', async function (userId,roomId) {
    const room = await roomDetailModel.joinRoom(userId,roomId)
    const rooms = await this.findOneAndUpdate(
        { user: userId },
        { $addToSet: { rooms: room._id } },
        { new: true }
    ).populate('rooms')
    return {room:room}
})
roomSchema.static('quitRoom', async function (userId,roomId) {
    const room = await roomDetailModel.findOne({roomId:roomId})
    room.roles.delete(userId)
    await room.save()
    if(room.roles.size===0){
        await roomDetailModel.deleteOne({roomId:roomId})
    }
    const rooms = await this.findOneAndUpdate(
        { user: userId },
        { $pull: { rooms: room._id } },
        { new: true }
    ).populate('rooms')
    return rooms
})
const roomModel = model('room', roomSchema)

module.exports = { roomModel, roomDetailModel }
