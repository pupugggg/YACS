const asyncHandler = require('express-async-handler')
const authModel = require('../models/authModel')
const login = asyncHandler(async(req,res)=>{
    const data = req.body
    const result = await authModel.login(data)
    res.json(result)
})
const register = asyncHandler(async(req,res)=>{
    const data = req.body
    const result = await authModel.register(data)
    res.json(result)
})

const getMe = asyncHandler(async(req,res)=>{
    res.json({token:req.token,id:req.user._id,name:req.user.username})
})

module.exports = {login,register,getMe}
