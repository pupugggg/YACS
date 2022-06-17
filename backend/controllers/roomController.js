const asyncHandler = require('express-async-handler')

const createRoom = asyncHandler(async(req,res)=>{
    res.json({msg:'123'})
})

module.exports = {createRoom}
