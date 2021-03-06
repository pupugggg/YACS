const router = require('express').Router()
const {createRoom,getRoomsFromUser,quitRoom,joinRoom} =require('../controllers/roomController')
const authMiddleware = require('../middlewares/authMiddleware')
const baseUrl = ''
router.use(authMiddleware)
router.route(`${baseUrl}`).post(createRoom)
router.route(`${baseUrl}`).get(getRoomsFromUser)
router.route(`${baseUrl}/join/:id`).get(joinRoom)
router.route(`${baseUrl}/:id`).delete(quitRoom)
module.exports = router