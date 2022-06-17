const router = require('express').Router()
const {login,register} =require('../controllers/authController')
const baseUrl = '/api/v1/auth/'
router.post(baseUrl+'login',login)
router.post(baseUrl+'register',register)
module.exports = router