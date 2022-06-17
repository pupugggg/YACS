const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization
    if(!token || !token.startsWith('Bearer')){
        res.status(401)
        throw new Error('unauthorized, no token')
    }
    try{
     
        const tokenContent = token.split(' ')[1]
      
        const decoded = jwt.verify(tokenContent,process.env.jwtPrivateKey)
        const user = await db.sequelize.user.findOne({where:{email:decoded.email}})
        if(!user){
            res.status(401)
            throw new Error('unauthorized, invalid credentials')
        }
        req.user = user
    }catch(error){
        res.status(401)
        throw new Error(error.message)
    }
    next()
})

module.exports={authMiddleware}