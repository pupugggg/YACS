const asyncHandler = require('express-async-handler')
const {roomModel,roomDetailModel} = require('../models/roomModel')
const createRoom = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const rooms = await roomModel.createRoom(req.user._id,name)
    res.json(rooms)
    
    
})
const getRoomsFromUser = asyncHandler(async(req,res)=>{
    const rooms = await roomModel.getRooms(req.user._id)
    res.json(rooms)
})
const joinRoom = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const result = await roomModel.joinRoom(req.user._id,id)
    res.json(result)
})
const quitRoom = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const result = await roomModel.quitRoom(req.user._id,id)
    res.json(result)
})

module.exports = {createRoom,getRoomsFromUser,quitRoom,joinRoom}
