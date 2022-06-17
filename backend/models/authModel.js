const mongoose = require('mongoose')
const {generateToken} = require('../service/authService')
const { Schema,model } = mongoose
const bcrypt = require('bcrypt')
const authSchema = new Schema({
    username:String,
    email:String,
    password:String,
})
authSchema.static('register',async function(data){
    const userExist = await this.findOne({email:data.email})
    if(userExist){
        throw new Error('user exist')
    }
    const saltRounds = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(data.password, saltRounds)
    data.password = hashed
    const result = await this.create(data)
    return {token:generateToken(result)}
})
authSchema.static('login',async function(data){
    const user = await this.findOne({email:data.email})
    if(!user){
        throw new Error('user not found')
    }
    const passwordMatched = await bcrypt.compare(data.password,user.password)
    if(!passwordMatched){
        res.status(400)
        throw new Error('Password mismatched')
    }
    return {token:generateToken(user)}
})
const authModel = model('auth',authSchema)

module.exports = authModel