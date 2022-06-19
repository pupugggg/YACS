const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const authModel = require('../models/authModel')
const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization
    if(!token || !token.startsWith('Bearer')){
        res.status(401)
        throw new Error('unauthorized, no token')
    }
    try{
        const tokenContentIndex = 1
        const tokenContent = token.split(' ')[tokenContentIndex]
        const decoded = jwt.verify(tokenContent,process.env.jwtPrivateKey||'jwt')
        const user = await authModel.findOne({email:decoded.email})
        if(!user){
            res.status(401)
            throw new Error('unauthorized, invalid credentials')
        }
        req.token = tokenContent
        req.user = user
    }catch(error){
        res.status(401)
        throw new Error(error.message)
    }
    next()
})

module.exports=authMiddleware