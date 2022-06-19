const router = require('express').Router()
const {login,register,getMe} =require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const baseUrl = '/api/v1/auth/'
router.post(baseUrl+'login',login)
router.post(baseUrl+'register',register)
router.route(baseUrl+'me').get(authMiddleware,getMe)
module.exports = router