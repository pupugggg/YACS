const router = require('express').Router()
const {createRoom,getRoomsFromUser,quitRoom} =require('../controllers/roomController')
const authMiddleware = require('../middlewares/authMiddleware')
const baseUrl = '/api/v1/room'
router.use(authMiddleware)
router.route(`${baseUrl}`).post(createRoom)
router.route(`${baseUrl}`).get(getRoomsFromUser)
router.route(`${baseUrl}/join`).get(getRoomsFromUser)
router.route(`${baseUrl}`).delete(quitRoom)
module.exports = router