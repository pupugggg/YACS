const Error = require('../util/ErrorWithStatusCode')
const { Schema, model } = require('mongoose')
const { generateToken } = require('../service/authService')
const bcrypt = require('bcrypt')
const {roomModel} = require('./roomModel')
const authSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})
authSchema.static('register', async function (data) {
    const userExist = await this.findOne({ email: data.email })
    if (userExist) {
        throw new Error('User Already exist')
    }
    const saltRounds = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(data.password, saltRounds)
    data.password = hashed
    const result = await this.create(data)
    await roomModel.create({user:result._id})
    return { token: generateToken(result),id:result._id,name:result.username }
})
authSchema.static('login', async function (data) {
    const user = await this.findOne({ email: data.email })
    if (!user) {
        throw new Error('Email or password mismatched')
    }
    const passwordMatched = await bcrypt.compare(data.password, user.password)
    if (!passwordMatched) {
        throw new Error('Email or password mismatched')
    }
    return { token: generateToken(user) ,id:user._id,name:user.username}
})
const authModel = model('auth', authSchema)

module.exports = authModel
