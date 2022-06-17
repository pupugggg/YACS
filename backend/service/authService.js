const jwt = require('jsonwebtoken')
const generateToken=  (user)=>{
    const token = jwt.sign(
        {username:user.username,email:user.email},
         process.env.jwtPrivateKey||'jwt',
         {expiresIn:'30d'}
     )
     return token
}

module.exports = {generateToken}