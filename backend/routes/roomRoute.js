const router = require('express').Router()
const {createRoom} =require('../controllers/roomController')
const baseUrl = '/api/v1/room'
router.get(baseUrl,createRoom)
module.exports = router