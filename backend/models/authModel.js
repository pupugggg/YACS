const Error = require('../util/ErrorWithStatusCode')
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
        throw new Error('User Already exist')
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
        throw new Error('Email or password mismatched')
    }
    const passwordMatched = await bcrypt.compare(data.password,user.password)
    if(!passwordMatched){
        throw new Error('Email or password mismatched')
    }
    return {token:generateToken(user)}
})
const authModel = model('auth',authSchema)

module.exports = authModel