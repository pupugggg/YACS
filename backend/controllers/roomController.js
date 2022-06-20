const asyncHandler = require('express-async-handler')
const {roomModel,roomDetailModel} = require('../models/roomModel')
const createRoom = asyncHandler(async(req,res)=>{
    const rooms = await roomModel.createRoom(req.user._id)
    res.json(rooms)
    
})
const getRoomsFromUser = asyncHandler(async(req,res)=>{
    const rooms = await roomModel.getRooms(req.user._id)
    res.json(rooms)
})
const joinRoom = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const room = await roomDetailModel.joinRoom(id,req.user._id)
    res.json({room:room})
})
const quitRoom = asyncHandler(async(req,res)=>{
    res.json({msg:req.user._id})
})

module.exports = {createRoom,getRoomsFromUser,quitRoom,joinRoom}
